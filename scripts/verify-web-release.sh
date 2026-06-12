#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

required_tools=(unzip shasum curl python3 rg)
for tool in "${required_tools[@]}"; do
  if ! command -v "$tool" >/dev/null 2>&1; then
    echo "Missing required tool: $tool" >&2
    exit 1
  fi
done

NODE_BIN="${NODE_BIN:-}"
NODE_MODULE_DIR="${NODE_MODULE_DIR:-}"

if [[ -z "$NODE_BIN" ]]; then
  if [[ -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
    NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  else
    NODE_BIN="$(command -v node || true)"
  fi
fi

if [[ -z "$NODE_BIN" ]]; then
  echo "Node.js is required to verify the release package." >&2
  exit 1
fi

if [[ -z "$NODE_MODULE_DIR" && -d "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules" ]]; then
  NODE_MODULE_DIR="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
fi

ZIP_INPUT="${1:-}"
if [[ -z "$ZIP_INPUT" ]]; then
  if [[ ! -f "output/release/latest-web-release.json" ]]; then
    echo "Missing output/release/latest-web-release.json. Run ./scripts/package-web-release.sh first." >&2
    exit 1
  fi
  ZIP_INPUT="$("$NODE_BIN" -e "const r=require('./output/release/latest-web-release.json'); if(!r.zipPath) process.exit(1); console.log(r.zipPath);")"
fi

case "$ZIP_INPUT" in
  /*) ZIP_PATH="$ZIP_INPUT" ;;
  *) ZIP_PATH="$ROOT/$ZIP_INPUT" ;;
esac

if [[ ! -f "$ZIP_PATH" ]]; then
  echo "Release zip not found: $ZIP_PATH" >&2
  exit 1
fi

SHA_PATH="${ZIP_PATH}.sha256"
if [[ ! -f "$SHA_PATH" ]]; then
  echo "Release zip checksum not found: $SHA_PATH" >&2
  exit 1
fi

TMP_DIR="$(mktemp -d /tmp/gwalsa-web-release-verify.XXXXXX)"
PID_FILE="/tmp/gwalsa-web-release-verify.pid"

cleanup() {
  if [[ -f "$PID_FILE" ]]; then
    local pid
    pid="$(cat "$PID_FILE")"
    if [[ -n "$pid" ]]; then
      kill "$pid" 2>/dev/null || true
    fi
    rm -f "$PID_FILE"
  fi
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo "== Verify web release package =="
echo "Zip: $ZIP_PATH"

(
  cd "$(dirname "$ZIP_PATH")"
  shasum -a 256 -c "$(basename "$SHA_PATH")"
)

unzip -q "$ZIP_PATH" -d "$TMP_DIR"

WEB_DIR="$TMP_DIR/web"
RELEASE_DIR="$TMP_DIR/release"

required_web_files=(
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

for file in "${required_web_files[@]}"; do
  if [[ ! -f "$WEB_DIR/$file" ]]; then
    echo "Missing web release file: $file" >&2
    exit 1
  fi
done

for file in release-manifest.json SHA256SUMS README_RELEASE.md; do
  if [[ ! -f "$RELEASE_DIR/$file" ]]; then
    echo "Missing release evidence file: release/$file" >&2
    exit 1
  fi
done

required_evidence_files=(
  "evidence/output/playwright/20260608-functional-smoke/functional-smoke-report.json"
  "evidence/output/playwright/20260608-launch-demo/metrics.json"
  "evidence/output/playwright/20260610-real-model-check/metrics.json"
)

for file in "${required_evidence_files[@]}"; do
  if [[ ! -f "$RELEASE_DIR/$file" ]]; then
    echo "Missing release evidence file: release/$file" >&2
    exit 1
  fi
done

(
  cd "$TMP_DIR"
  shasum -a 256 -c release/SHA256SUMS >/tmp/gwalsa-web-release-shasums.out
)

WEB_DIR="$WEB_DIR" RELEASE_DIR="$RELEASE_DIR" "$NODE_BIN" <<'NODE'
const fs = require("fs");
const path = require("path");

const webDir = process.env.WEB_DIR;
const releaseDir = process.env.RELEASE_DIR;
const appJs = fs.readFileSync(path.join(webDir, "app.js"), "utf8");
const swJs = fs.readFileSync(path.join(webDir, "service-worker.js"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(webDir, "manifest.json"), "utf8"));
const releaseManifest = JSON.parse(fs.readFileSync(path.join(releaseDir, "release-manifest.json"), "utf8"));
const screenshotMetrics = JSON.parse(fs.readFileSync(path.join(releaseDir, "evidence/output/playwright/20260608-launch-demo/metrics.json"), "utf8"));
const functionalSmoke = JSON.parse(fs.readFileSync(path.join(releaseDir, "evidence/output/playwright/20260608-functional-smoke/functional-smoke-report.json"), "utf8"));
const realModel = JSON.parse(fs.readFileSync(path.join(releaseDir, "evidence/output/playwright/20260610-real-model-check/metrics.json"), "utf8"));
const modelFile = path.join(webDir, "assets/models/face-landmarker/face-landmarker.task");
const runtimeFile = path.join(webDir, "assets/vendor/mediapipe/tasks-vision/0.10.35/vision_bundle.mjs");

const appBuild = appJs.match(/const appBuild\s*=\s*"([^"]+)"/)?.[1];
const swCache = swJs.match(/const cacheName\s*=\s*"([^"]+)"/)?.[1];
if (!appBuild || !swCache) {
  throw new Error("app build or service worker cache marker missing");
}
if (!swCache.includes(appBuild)) {
  throw new Error(`service worker cache '${swCache}' does not include app build '${appBuild}'`);
}
if (releaseManifest.appBuild !== appBuild || releaseManifest.serviceWorkerCache !== swCache) {
  throw new Error("release manifest build/cache metadata does not match packaged web files");
}
if (manifest.name !== "싸괄" || manifest.short_name !== "싸괄" || manifest.lang !== "ko") {
  throw new Error("manifest identity fields look incomplete");
}
if (manifest.start_url !== "./index.html" || manifest.scope !== "./" || manifest.display !== "standalone") {
  throw new Error("manifest installability fields look incomplete");
}
if (!/^#[0-9a-f]{6}$/i.test(manifest.theme_color || "") || !/^#[0-9a-f]{6}$/i.test(manifest.background_color || "")) {
  throw new Error("manifest theme/background colors must be hex colors");
}
if (!Array.isArray(manifest.icons) || manifest.icons.length < 3) {
  throw new Error("manifest content looks incomplete");
}
if (!fs.existsSync(modelFile) || fs.statSync(modelFile).size < 3000000) {
  throw new Error("packaged Face Landmarker model is missing or too small");
}
if (!fs.existsSync(runtimeFile) || fs.statSync(runtimeFile).size < 100000) {
  throw new Error("packaged MediaPipe runtime is missing or too small");
}
if (!appJs.includes("assets/vendor/mediapipe/tasks-vision/") || !appJs.includes("vision_bundle.mjs")) {
  throw new Error("app.js is not using the vendored MediaPipe runtime");
}
if (!appJs.includes("FACE_SCAN_WASM_ASSET_PATH")) {
  throw new Error("app.js is not using the vendored MediaPipe WASM asset path");
}
if (appJs.includes("cdn.jsdelivr.net/npm/@mediapipe/tasks-vision")) {
  throw new Error("app.js still references the MediaPipe CDN runtime");
}
const hasPng192 = manifest.icons.some((icon) => icon.src === "./assets/icon-192.png" && icon.sizes === "192x192" && icon.type === "image/png" && (icon.purpose || "").includes("maskable"));
const hasPng512 = manifest.icons.some((icon) => icon.src === "./assets/icon-512.png" && icon.sizes === "512x512" && icon.type === "image/png" && (icon.purpose || "").includes("maskable"));
const hasSvg = manifest.icons.some((icon) => (icon.src || "").includes("assets/icon.svg") && (icon.type || "").includes("svg"));
if (!hasPng192 || !hasPng512 || !hasSvg) {
  throw new Error("manifest required icons are incomplete");
}
if (screenshotMetrics.gateStatus !== "passed" || (screenshotMetrics.gateFailures || []).length) {
  throw new Error("packaged screenshot evidence did not pass its gate");
}
if ((screenshotMetrics.files || []).length < 28 || (screenshotMetrics.errors || []).length || (screenshotMetrics.consoleErrors || []).length) {
  throw new Error("packaged screenshot evidence is incomplete or has errors");
}
for (const file of ["privacy-policy.html", "terms-disclaimer.html", "support.html"]) {
  if (screenshotMetrics.offlinePublicPages?.[file] !== "ok") {
    throw new Error(`packaged screenshot evidence has offline public page failure: ${file}`);
  }
}
if (functionalSmoke.status !== "passed" || (functionalSmoke.failures || []).length) {
  throw new Error("packaged functional smoke evidence did not pass");
}
for (const name of ["manualLog", "backup", "faceGuide"]) {
  if (functionalSmoke.checks?.[name]?.status !== "passed") {
    throw new Error(`packaged functional smoke missing passed check: ${name}`);
  }
}
if ((functionalSmoke.pageErrors || []).length || (functionalSmoke.consoleErrors || []).length) {
  throw new Error("packaged functional smoke evidence has page or console errors");
}
const realUpload = realModel.checks?.realUpload || {};
const referenceGate = realModel.checks?.referenceGate || {};
if (realModel.status !== "passed"
  || realUpload.status !== "passed"
  || realUpload.provider !== "mediapipe"
  || realUpload.detectorSource !== "real"
  || realUpload.source !== "upload-landmark"
  || realUpload.referenceOnly !== false
  || referenceGate.status !== "passed"
  || referenceGate.allowedByGlobal !== false) {
  throw new Error("packaged real MediaPipe evidence did not pass production/reference gate requirements");
}

const assetMatch = swJs.match(/const\s+assets\s*=\s*\[([\s\S]*?)\];/);
if (!assetMatch) {
  throw new Error("service worker assets array not found");
}
const assets = Array.from(assetMatch[1].matchAll(/["']([^"']+)["']/g)).map((item) => item[1]);
const missing = [];
for (const asset of assets) {
  if (asset === "./" || asset === "/" || /^https?:\/\//.test(asset)) continue;
  const rel = asset.replace(/[?#].*$/, "").replace(/^\.\//, "").replace(/^\//, "");
  if (!fs.existsSync(path.join(webDir, rel))) missing.push(asset);
}
if (missing.length) {
  throw new Error(`service worker cached asset missing from package: ${missing.join(", ")}`);
}

console.log(`metadata ok appBuild=${appBuild} swCache=${swCache} cachedAssets=${assets.length}`);
NODE

APP_BUILD_FROM_PACKAGE="$(WEB_DIR="$WEB_DIR" "$NODE_BIN" -e "const fs=require('fs');const path=require('path');const js=fs.readFileSync(path.join(process.env.WEB_DIR,'app.js'),'utf8');const m=js.match(/const appBuild\\s*=\\s*\\\"([^\\\"]+)\\\"/);if(!m) process.exit(1);console.log(m[1]);")"

PORT="$(python3 - <<'PY'
import socket
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(("127.0.0.1", 0))
    print(s.getsockname()[1])
PY
)"

(
  cd "$WEB_DIR"
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/gwalsa-web-release-http.log 2>&1 &
  echo "$!" > "$PID_FILE"
)
sleep 1

BASE_URL="http://127.0.0.1:${PORT}"
curl_check() {
  local url="$1"
  local pattern="$2"
  local out="$TMP_DIR/http-check-$(basename "$url")"
  curl -sSf "$url" > "$out"
  rg -q "$pattern" "$out"
}

curl_check "$BASE_URL/index.html" "싸괄|${APP_BUILD_FROM_PACKAGE}"
curl_check "$BASE_URL/app.js" "const appBuild"
curl_check "$BASE_URL/service-worker.js" "gwalsa-routine-v"
curl_check "$BASE_URL/manifest.json" "\"name\"\\s*:\\s*\"싸괄\""
curl_check "$BASE_URL/public/privacy-policy.html" "개인정보 처리방침"
curl_check "$BASE_URL/public/terms-disclaimer.html" "이용약관|약관"
curl_check "$BASE_URL/public/support.html" "지원 안내|앱 사용 지원"

WEB_RELEASE_BASE_URL="$BASE_URL/index.html" \
NODE_PATH="$NODE_MODULE_DIR${NODE_PATH:+:$NODE_PATH}" \
"$NODE_BIN" scripts/verify-web-release-offline.js

echo "Release package verified from extracted web root."
