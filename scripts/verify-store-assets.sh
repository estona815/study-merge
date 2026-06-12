#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NODE_BIN="${NODE_BIN:-}"
if [[ -z "$NODE_BIN" ]]; then
  if [[ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
    NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  else
    NODE_BIN="$(command -v node || true)"
  fi
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js is required to verify store assets." >&2
  exit 1
fi

required_tools=(unzip shasum)
for tool in "${required_tools[@]}"; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Missing required tool: $tool" >&2
    exit 1
  fi
done

ZIP_INPUT="${1:-}"
if [[ -z "$ZIP_INPUT" ]]; then
  if [[ ! -f "output/store-assets/latest-store-assets.json" ]]; then
    echo "Missing output/store-assets/latest-store-assets.json. Run ./scripts/package-store-assets.sh first." >&2
    exit 1
  fi
  ZIP_INPUT="$("$NODE_BIN" -e "const r=require('./output/store-assets/latest-store-assets.json'); if(!r.zipPath) process.exit(1); console.log(r.zipPath);")"
fi

case "$ZIP_INPUT" in
  /*) ZIP_PATH="$ZIP_INPUT" ;;
  *) ZIP_PATH="$ROOT/$ZIP_INPUT" ;;
esac

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "Store assets zip not found: $ZIP_PATH" >&2
  exit 1
fi

SHA_PATH="${ZIP_PATH}.sha256"
if [[ ! -f "$SHA_PATH" ]]; then
  echo "Store assets checksum not found: $SHA_PATH" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d /tmp/gwalsa-store-assets-verify.XXXXXX)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "== Verify store assets package =="
echo "Zip: $ZIP_PATH"

(
  cd "$(dirname "$ZIP_PATH")"
  shasum -a 256 -c "$(basename "$SHA_PATH")"
)

unzip -q "$ZIP_PATH" -d "$TMP_DIR"
ASSET_DIR="$TMP_DIR/store-assets"

for file in \
  README_STORE_ASSETS.md \
  store-asset-manifest.json \
  SHA256SUMS \
  icons/icon-192.png \
  icons/icon-512.png \
  icons/apple-touch-icon.png \
  metadata/STORE_LISTING_DRAFT.md \
  metadata/TOSS_INAPP_RELEASE_TODO.md \
  metadata/package.json \
  metadata/granite.config.ts \
  metadata/store-privacy-answers.md \
  metadata/external-store-inputs.md \
  metadata/review-evidence.md \
; do
  if [[ ! -f "$ASSET_DIR/$file" ]]; then
    echo "Missing store asset file: $file" >&2
    exit 1
  fi
done

(
  cd "$ASSET_DIR"
  shasum -a 256 -c SHA256SUMS >/tmp/gwalsa-store-assets-shasums.out
)

ASSET_DIR="$ASSET_DIR" "$NODE_BIN" <<'NODE'
const fs = require("fs");
const path = require("path");

const assetDir = process.env.ASSET_DIR;
const manifest = JSON.parse(fs.readFileSync(path.join(assetDir, "store-asset-manifest.json"), "utf8"));
const expectedAppBuild = fs.readFileSync("app.js", "utf8").match(/const appBuild\s*=\s*"([^"]+)"/)?.[1];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readPngSize(file) {
  const buffer = fs.readFileSync(file);
  const pngSignature = "89504e470d0a1a0a";
  assert(buffer.length >= 24 && buffer.subarray(0, 8).toString("hex") === pngSignature, `${file} is not a valid PNG`);
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

assert(manifest.status === "review-assets-ready", "store asset manifest status is not review-assets-ready");
assert(expectedAppBuild && manifest.appBuild === expectedAppBuild, "store asset manifest appBuild mismatch");
assert((manifest.screenshots?.mobile || []).length >= 7, "not enough mobile screenshots");
assert((manifest.screenshots?.desktop || []).length >= 5, "not enough desktop screenshots");
assert((manifest.screenshots?.policy || []).length >= 3, "not enough policy screenshots");

const expectedIcons = {
  "icons/icon-192.png": [192, 192],
  "icons/icon-512.png": [512, 512],
  "icons/apple-touch-icon.png": [180, 180],
};
for (const [file, [expectedWidth, expectedHeight]] of Object.entries(expectedIcons)) {
  const { width, height } = readPngSize(path.join(assetDir, file));
  assert(width === expectedWidth && height === expectedHeight, `${file} expected ${expectedWidth}x${expectedHeight}, got ${width}x${height}`);
}

const mobile = manifest.screenshots.mobile || [];
for (const item of mobile) {
  assert([780, 860].includes(item.width), `mobile screenshot pixel width must be 780 or 860: ${item.path}`);
  assert(item.height >= 1600, `mobile screenshot pixel height too small: ${item.path}`);
}

const metadataText = fs.readFileSync(path.join(assetDir, "metadata/STORE_LISTING_DRAFT.md"), "utf8");
const reviewEvidence = fs.readFileSync(path.join(assetDir, "metadata/review-evidence.md"), "utf8");
assert(reviewEvidence.includes(manifest.packageName), "review evidence does not reference this store asset package");
assert(reviewEvidence.includes("Mobile screenshots: 7"), "review evidence does not summarize mobile screenshots");
const referencedStorePackages = [...new Set(reviewEvidence.match(/gwalsa-store-assets-\d{8}-\d{6}/g) || [])];
assert(referencedStorePackages.length === 1 && referencedStorePackages[0] === manifest.packageName, "review evidence appears to contain conflicting store asset package references");
for (const risky of ["치료", "진단", "질병 예방"]) {
  const allowedDisclaimer = "의료 조언, 진단, 치료, 질병 예방 목적이 아닙니다";
  if (metadataText.includes(risky) && !metadataText.includes(allowedDisclaimer)) {
    throw new Error(`metadata contains high-risk medical wording: ${risky}`);
  }
}

console.log(JSON.stringify({
  status: "passed",
  mobileScreenshots: manifest.screenshots.mobile.length,
  desktopScreenshots: manifest.screenshots.desktop.length,
  policyScreenshots: manifest.screenshots.policy.length,
  icons: manifest.icons.length,
}, null, 2));
NODE

echo "Store assets package verified."
