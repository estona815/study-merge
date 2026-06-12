#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STAMP="${1:-$(TZ=Asia/Seoul date +%Y%m%d-%H%M%S)}"
OUT_ROOT="$ROOT/output/store-assets"
PACKAGE_NAME="gwalsa-store-assets-${STAMP}"
PACKAGE_DIR="$OUT_ROOT/$PACKAGE_NAME"
ASSET_DIR="$PACKAGE_DIR/store-assets"
ZIP_PATH="$OUT_ROOT/${PACKAGE_NAME}.zip"

NODE_BIN="${NODE_BIN:-}"
if [[ -z "$NODE_BIN" ]]; then
  if [[ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
    NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  else
    NODE_BIN="$(command -v node || true)"
  fi
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js is required to package store assets." >&2
  exit 1
fi

required_tools=(zip shasum)
for tool in "${required_tools[@]}"; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Missing required tool: $tool" >&2
    exit 1
  fi
done

APP_BUILD="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('app.js','utf8').match(/const appBuild\\s*=\\s*\"([^\"]+)\"/);if(!m) process.exit(1);console.log(m[1]);")"
SW_CACHE="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('service-worker.js','utf8').match(/const cacheName\\s*=\\s*\"([^\"]+)\"/);if(!m) process.exit(1);console.log(m[1]);")"

mobile_shots=(
  "output/playwright/20260608-launch-demo/screen-onboarding-430.png"
  "output/playwright/20260608-launch-demo/screen-today-430.png"
  "output/playwright/20260608-launch-demo/screen-routines-430.png"
  "output/playwright/20260608-launch-demo/completion-430.png"
  "output/playwright/20260608-launch-demo/screen-log-430.png"
  "output/playwright/20260608-launch-demo/screen-settings-430.png"
  "output/playwright/20260608-launch-demo/screen-face-guide-390.png"
)

desktop_shots=(
  "output/playwright/20260608-launch-demo/desktop/screen-today-1280.png"
  "output/playwright/20260608-launch-demo/desktop/screen-routines-1280.png"
  "output/playwright/20260608-launch-demo/desktop/screen-log-1280.png"
  "output/playwright/20260608-launch-demo/desktop/screen-settings-1280.png"
  "output/playwright/20260608-launch-demo/desktop/screen-face-routine-1280.png"
)

policy_shots=(
  "output/playwright/20260608-launch-demo/public-privacy-390.png"
  "output/playwright/20260608-launch-demo/public-terms-390.png"
  "output/playwright/20260608-launch-demo/public-support-390.png"
)

icon_files=(
  "assets/icon.svg"
  "assets/icon-192.png"
  "assets/icon-512.png"
  "assets/apple-touch-icon.png"
)

metadata_files=(
  "STORE_LISTING_DRAFT.md"
  "PRIVACY_POLICY_DRAFT.md"
  "TERMS_DISCLAIMER.md"
  "TOSS_INAPP_RELEASE_TODO.md"
  "package.json"
  "granite.config.ts"
  "docs/store-submission-packet.md"
  "docs/store-privacy-answers.md"
  "docs/external-store-inputs.md"
  "docs/creative-production-launch-visuals.md"
  "docs/final-plugin-production-review-20260610.md"
)

rm -rf "$PACKAGE_DIR" "$ZIP_PATH" "$ZIP_PATH.sha256"
mkdir -p "$ASSET_DIR/screenshots/mobile" "$ASSET_DIR/screenshots/desktop" "$ASSET_DIR/screenshots/policy" "$ASSET_DIR/icons" "$ASSET_DIR/metadata"

copy_required() {
  local src="$1"
  local dest="$2"
  if [[ ! -f "$src" ]]; then
    echo "Missing store asset input: $src" >&2
    exit 1
  fi
  cp -p "$src" "$dest"
}

index=1
for file in "${mobile_shots[@]}"; do
  base="$(basename "$file")"
  copy_required "$file" "$ASSET_DIR/screenshots/mobile/$(printf '%02d' "$index")-${base}"
  index=$((index + 1))
done

index=1
for file in "${desktop_shots[@]}"; do
  base="$(basename "$file")"
  copy_required "$file" "$ASSET_DIR/screenshots/desktop/$(printf '%02d' "$index")-${base}"
  index=$((index + 1))
done

index=1
for file in "${policy_shots[@]}"; do
  base="$(basename "$file")"
  copy_required "$file" "$ASSET_DIR/screenshots/policy/$(printf '%02d' "$index")-${base}"
  index=$((index + 1))
done

for file in "${icon_files[@]}"; do
  copy_required "$file" "$ASSET_DIR/icons/$(basename "$file")"
done

for file in "${metadata_files[@]}"; do
  copy_required "$file" "$ASSET_DIR/metadata/$(basename "$file")"
done

ASSET_DIR="$ASSET_DIR" \
PACKAGE_NAME="$PACKAGE_NAME" \
APP_BUILD="$APP_BUILD" \
SW_CACHE="$SW_CACHE" \
GENERATED_AT_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
GENERATED_AT_KST="$(TZ=Asia/Seoul date +%Y-%m-%dT%H:%M:%S%z)" \
"$NODE_BIN" <<'NODE' > "$ASSET_DIR/store-asset-manifest.json"
const fs = require("fs");
const path = require("path");

const assetDir = process.env.ASSET_DIR;

function readPngSize(file) {
  const buffer = fs.readFileSync(file);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error(`${file} is not a valid PNG`);
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function list(relativeDir) {
  const dir = path.join(assetDir, relativeDir);
  return fs.readdirSync(dir)
    .filter((name) => !name.startsWith("."))
    .sort()
    .map((name) => {
      const rel = path.join(relativeDir, name);
      const full = path.join(assetDir, rel);
      const item = { path: rel, bytes: fs.statSync(full).size };
      if (name.endsWith(".png")) Object.assign(item, readPngSize(full));
      return item;
    });
}

const manifest = {
  packageName: process.env.PACKAGE_NAME,
  generatedAtUtc: process.env.GENERATED_AT_UTC,
  generatedAtKst: process.env.GENERATED_AT_KST,
  appBuild: process.env.APP_BUILD,
  serviceWorkerCache: process.env.SW_CACHE,
  status: "review-assets-ready",
  storeSubmissionStatus: "external-blocked until hosted URLs, contact, native wrapper/signing, and official policy recheck are complete",
  officialPolicyNote: "Confirm the latest Apple App Store and Google Play screenshot, metadata, and privacy requirements immediately before submission.",
  screenshots: {
    mobile: list("screenshots/mobile"),
    desktop: list("screenshots/desktop"),
    policy: list("screenshots/policy"),
  },
  icons: list("icons"),
  metadata: list("metadata"),
};

console.log(JSON.stringify(manifest, null, 2));
NODE

cat > "$ASSET_DIR/README_STORE_ASSETS.md" <<EOF
# Gwalsa Store Review Assets

- Package: \`$PACKAGE_NAME\`
- App build: \`$APP_BUILD\`
- Service worker cache: \`$SW_CACHE\`

## Contents

- \`screenshots/mobile/\`: curated mobile screenshots from the launch evidence set
- \`screenshots/desktop/\`: desktop/web screenshots from the launch evidence set
- \`screenshots/policy/\`: public privacy, terms, and support page screenshots
- \`icons/\`: PWA and app icon source files
- \`metadata/\`: listing, privacy, terms, support, QA, launch-visual direction, and external store-input drafts
- \`store-asset-manifest.json\`: generated file list, sizes, and dimensions

## Submission Note

These are review-ready local assets, not a final native store submission by themselves. Before App Store or Google Play submission, confirm the latest official Apple/Google requirements, create any store-specific screenshot sizes/crops, replace local policy/support paths with public HTTPS URLs, and answer privacy/data-safety forms from the final signed wrapper.
EOF

WEB_RELEASE_SUMMARY="$("$NODE_BIN" - <<'NODE'
const fs = require("fs");
try {
  const latest = JSON.parse(fs.readFileSync("output/release/latest-web-release.json", "utf8"));
  console.log(`- Web release: \`${latest.packageName || "not generated"}\`\n- Web release zip: \`${latest.zipPath || "not generated"}\`\n- Web release sha256: \`${latest.zipSha256 || "not generated"}\``);
} catch {
  console.log("- Web release: `not generated`");
}
NODE
)"

cat > "$ASSET_DIR/metadata/review-evidence.md" <<EOF
# Store Asset Review Evidence

- Package: \`$PACKAGE_NAME\`
- Generated UTC: \`$(date -u +%Y-%m-%dT%H:%M:%SZ)\`
- Generated KST: \`$(TZ=Asia/Seoul date +%Y-%m-%dT%H:%M:%S%z)\`
- App build: \`$APP_BUILD\`
- Service worker cache: \`$SW_CACHE\`
$WEB_RELEASE_SUMMARY

## Automated Evidence

- Screenshot gate: \`output/playwright/20260608-launch-demo/metrics.json\`
- Functional smoke: \`output/playwright/20260608-functional-smoke/functional-smoke-report.json\`
- Production MediaPipe model check: \`output/playwright/20260610-real-model-check/metrics.json\`
- Store asset manifest: \`store-asset-manifest.json\`
- Store asset checksums: \`SHA256SUMS\`

## Included Review Assets

- Mobile screenshots: 7
- Desktop screenshots: 5
- Public policy/support screenshots: 3
- Icons: icon SVG, 192 PNG, 512 PNG, Apple touch PNG
- Metadata drafts: store listing, privacy policy, terms/disclaimer, privacy answers, submission packet, launch-visual direction, external store inputs

## Remaining External Store Blockers

- Hosted public privacy, terms, and support URLs
- Developer/company name and support or privacy contact
- Native wrapper, bundle/package id, app version/build number, and signing
- Final App Store Connect / Play Console form answers after wrapper SDKs are known
- Final check against current Apple/Google official submission policies

This file describes the contents of this store asset package. The zip SHA-256 is written next to the zip as \`${PACKAGE_NAME}.zip.sha256\`.
EOF

(
  cd "$ASSET_DIR"
  find . -type f ! -name SHA256SUMS -print | sort | while read -r file; do
    shasum -a 256 "$file"
  done > SHA256SUMS
)

(
  cd "$PACKAGE_DIR"
  zip -qr "$ZIP_PATH" store-assets
)
(
  cd "$OUT_ROOT"
  shasum -a 256 "$(basename "$ZIP_PATH")" > "$(basename "$ZIP_PATH").sha256"
)

ZIP_SHA256="$(awk '{print $1}' "$ZIP_PATH.sha256")"
ZIP_PATH="$ZIP_PATH" \
SHA_PATH="$ZIP_PATH.sha256" \
ZIP_SHA256="$ZIP_SHA256" \
PACKAGE_DIR="$PACKAGE_DIR" \
PACKAGE_NAME="$PACKAGE_NAME" \
APP_BUILD="$APP_BUILD" \
SW_CACHE="$SW_CACHE" \
GENERATED_AT_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
GENERATED_AT_KST="$(TZ=Asia/Seoul date +%Y-%m-%dT%H:%M:%S%z)" \
"$NODE_BIN" <<'NODE' > "$OUT_ROOT/latest-store-assets.json"
const path = require("path");

function relative(file) {
  return path.relative(process.cwd(), file);
}

console.log(JSON.stringify({
  packageName: process.env.PACKAGE_NAME,
  generatedAtUtc: process.env.GENERATED_AT_UTC,
  generatedAtKst: process.env.GENERATED_AT_KST,
  appBuild: process.env.APP_BUILD,
  serviceWorkerCache: process.env.SW_CACHE,
  zipPath: relative(process.env.ZIP_PATH),
  sha256Path: relative(process.env.SHA_PATH),
  packageDir: relative(process.env.PACKAGE_DIR),
  zipSha256: process.env.ZIP_SHA256,
}, null, 2));
NODE

echo "Store assets package created:"
echo "  $ZIP_PATH"
echo "  $ZIP_PATH.sha256"
echo "  $OUT_ROOT/latest-store-assets.json"
