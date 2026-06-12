#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

STAMP="${1:-$(TZ=Asia/Seoul date +%Y%m%d-%H%M%S)}"
OUT_ROOT="$ROOT/output/release"
PACKAGE_NAME="gwalsa-web-pwa-${STAMP}"
PACKAGE_DIR="$OUT_ROOT/$PACKAGE_NAME"
WEB_DIR="$PACKAGE_DIR/web"
META_DIR="$PACKAGE_DIR/release"
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
  echo "Node.js is required to package the release." >&2
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

web_files=(
  "index.html"
  "styles.css"
  "app.js"
  "manifest.json"
  "service-worker.js"
  "assets/icon.svg"
  "assets/icon-192.png"
  "assets/icon-512.png"
  "assets/apple-touch-icon.png"
  "assets/models/face-landmarker/face-landmarker.task"
  "assets/models/face-landmarker/README.md"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/package.json"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/README.md"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/vision_bundle.mjs"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_internal.js"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_internal.wasm"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_module_internal.js"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_module_internal.wasm"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_nosimd_internal.js"
  "assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_nosimd_internal.wasm"
  "public/privacy-policy.html"
  "public/terms-disclaimer.html"
  "public/support.html"
)

doc_files=(
  "README.md"
  "LAUNCH_CHECKLIST.md"
  "MANUAL_QA_CHECKLIST.md"
  "design-qa.md"
  "STORE_LISTING_DRAFT.md"
  "PRIVACY_POLICY_DRAFT.md"
  "TERMS_DISCLAIMER.md"
  "TOSS_INAPP_RELEASE_TODO.md"
  "package.json"
  "granite.config.ts"
  "docs/launch-audit.md"
  "docs/store-submission-packet.md"
  "docs/store-privacy-answers.md"
  "docs/external-store-inputs.md"
  "docs/final-plugin-production-review-20260610.md"
  "docs/launch-blockers.json"
)

evidence_files=(
  "output/playwright/20260608-functional-smoke/functional-smoke-report.json"
  "output/playwright/20260610-real-model-check/metrics.json"
  "output/playwright/20260608-launch-demo/metrics.json"
)

rm -rf "$PACKAGE_DIR" "$ZIP_PATH" "$ZIP_PATH.sha256"
mkdir -p "$WEB_DIR" "$META_DIR/docs"

copy_file() {
  local src="$1"
  local dest_root="$2"
  if [[ ! -f "$src" ]]; then
    echo "Missing release input: $src" >&2
    exit 1
  fi
  mkdir -p "$dest_root/$(dirname "$src")"
  cp -p "$src" "$dest_root/$src"
}

for file in "${web_files[@]}"; do
  copy_file "$file" "$WEB_DIR"
done

for file in "${doc_files[@]}"; do
  copy_file "$file" "$META_DIR/docs"
done

for file in "${evidence_files[@]}"; do
  copy_file "$file" "$META_DIR/evidence"
done

WEB_DIR="$WEB_DIR" "$NODE_BIN" <<'NODE'
const fs = require("fs");
const path = require("path");

const webDir = process.env.WEB_DIR;
const sw = fs.readFileSync("service-worker.js", "utf8");
const match = sw.match(/const\s+assets\s*=\s*\[([\s\S]*?)\];/);
if (!match) {
  throw new Error("service-worker.js assets array not found");
}
const assets = Array.from(match[1].matchAll(/["']([^"']+)["']/g)).map((item) => item[1]);
const missing = [];
for (const asset of assets) {
  if (asset === "./" || asset === "/" || /^https?:\/\//.test(asset)) continue;
  const rel = asset.replace(/[?#].*$/, "").replace(/^\.\//, "").replace(/^\//, "");
  if (!fs.existsSync(path.join(webDir, rel))) {
    missing.push(asset);
  }
}
if (missing.length) {
  throw new Error(`release package missing cached assets: ${missing.join(", ")}`);
}
console.log(`service worker cached asset parity ok (${assets.length} entries)`);
NODE

(
  cd "$PACKAGE_DIR"
  find web release/docs release/evidence -type f -print | sort | while read -r file; do
    shasum -a 256 "$file"
  done > release/SHA256SUMS
)

GENERATED_AT_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
GENERATED_AT_KST="$(TZ=Asia/Seoul date +%Y-%m-%dT%H:%M:%S%z)"
APP_BUILD="$APP_BUILD" \
SW_CACHE="$SW_CACHE" \
STAMP="$STAMP" \
PACKAGE_NAME="$PACKAGE_NAME" \
GENERATED_AT_UTC="$GENERATED_AT_UTC" \
GENERATED_AT_KST="$GENERATED_AT_KST" \
PACKAGE_DIR="$PACKAGE_DIR" \
"$NODE_BIN" <<'NODE' > "$META_DIR/release-manifest.json"
const fs = require("fs");
const path = require("path");

const packageDir = process.env.PACKAGE_DIR;
const sums = fs.readFileSync(path.join(packageDir, "release/SHA256SUMS"), "utf8")
  .trim()
  .split(/\n+/)
  .filter(Boolean)
  .map((line) => {
    const match = line.match(/^([a-f0-9]{64})\s+(.+)$/);
    return match ? { sha256: match[1], path: match[2] } : { raw: line };
  });

const manifest = {
  packageName: process.env.PACKAGE_NAME,
  generatedAtUtc: process.env.GENERATED_AT_UTC,
  generatedAtKst: process.env.GENERATED_AT_KST,
  appBuild: process.env.APP_BUILD,
  serviceWorkerCache: process.env.SW_CACHE,
  deployRoot: "web/",
  policyUrlStatus: "must replace local public/*.html paths with hosted stable privacy, terms, and support URLs for store submission",
  storeSubmissionStatus: "external-blocked until wrapper, signing, public URLs, support contact, and official policy recheck are complete",
  files: sums,
};

console.log(JSON.stringify(manifest, null, 2));
NODE

cat > "$META_DIR/README_RELEASE.md" <<EOF
# Gwalsa Web PWA Release

- Package: \`$PACKAGE_NAME\`
- Generated UTC: \`$GENERATED_AT_UTC\`
- Generated KST: \`$GENERATED_AT_KST\`
- App build: \`$APP_BUILD\`
- Service worker cache: \`$SW_CACHE\`

## Deploy

Upload the contents of \`web/\` to the static hosting root.

Before app-store submission, replace local privacy, terms, and support paths with hosted stable URLs in the wrapper/store metadata and confirm the latest Apple/Google official policy requirements.

## Evidence

- \`release/release-manifest.json\`
- \`release/SHA256SUMS\`
- \`release/docs/\`
- \`release/evidence/\`

## Verify

Run \`./scripts/verify-web-release.sh\` after packaging. It checks zip SHA-256, required files, HTTP responses, manifest install fields, packaged smoke evidence, service worker metadata, and offline public-page fallback from the extracted \`web/\` root.
EOF

(
  cd "$PACKAGE_DIR"
  zip -qr "$ZIP_PATH" web release
)
(
  cd "$OUT_ROOT"
  shasum -a 256 "$(basename "$ZIP_PATH")" > "$(basename "$ZIP_PATH").sha256"
)

ZIP_SHA256="$(awk '{print $1}' "$ZIP_PATH.sha256")"
ZIP_PATH="$ZIP_PATH" \
SHA_PATH="$ZIP_PATH.sha256" \
ZIP_SHA256="$ZIP_SHA256" \
MANIFEST_PATH="$META_DIR/release-manifest.json" \
PACKAGE_DIR="$PACKAGE_DIR" \
PACKAGE_NAME="$PACKAGE_NAME" \
APP_BUILD="$APP_BUILD" \
SW_CACHE="$SW_CACHE" \
GENERATED_AT_UTC="$GENERATED_AT_UTC" \
GENERATED_AT_KST="$GENERATED_AT_KST" \
"$NODE_BIN" <<'NODE' > "$OUT_ROOT/latest-web-release.json"
const path = require("path");

function relative(file) {
  return path.relative(process.cwd(), file);
}

const latest = {
  packageName: process.env.PACKAGE_NAME,
  generatedAtUtc: process.env.GENERATED_AT_UTC,
  generatedAtKst: process.env.GENERATED_AT_KST,
  appBuild: process.env.APP_BUILD,
  serviceWorkerCache: process.env.SW_CACHE,
  zipPath: relative(process.env.ZIP_PATH),
  sha256Path: relative(process.env.SHA_PATH),
  packageDir: relative(process.env.PACKAGE_DIR),
  manifestPath: relative(process.env.MANIFEST_PATH),
  zipSha256: process.env.ZIP_SHA256,
};

console.log(JSON.stringify(latest, null, 2));
NODE

echo "Release package created:"
echo "  $ZIP_PATH"
echo "  $ZIP_PATH.sha256"
echo "  $META_DIR/release-manifest.json"
echo "  $OUT_ROOT/latest-web-release.json"
