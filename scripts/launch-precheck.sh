#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

log_ok() {
  printf "[OK] %s\n" "$1"
}

log_fail() {
  printf "[FAIL] %s\n" "$1" >&2
  exit 1
}

cleanup_server() {
  if [[ -f /tmp/gwalsa-launch-precheck.pid ]]; then
    local server_pid
    server_pid="$(cat /tmp/gwalsa-launch-precheck.pid)"
    if [[ -n "$server_pid" ]]; then
      kill "$server_pid" 2>/dev/null || true
    fi
    rm -f /tmp/gwalsa-launch-precheck.pid
  fi
}

trap cleanup_server EXIT

log_step() {
  printf "\n[STEP] %s\n" "$1"
}

NODE_BIN="${NODE_BIN:-}"
if [[ -z "$NODE_BIN" && -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
  NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ -z "$NODE_BIN" ]]; then
  NODE_BIN="$(command -v node || true)"
fi
[[ -n "$NODE_BIN" ]] || log_fail "Node.js runtime not found"

APP_BUILD="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('app.js','utf8').match(/const appBuild\\s*=\\s*\"([^\"]+)\"/);if(!m) process.exit(1);console.log(m[1]);")"
SW_CACHE="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('service-worker.js','utf8').match(/const cacheName\\s*=\\s*\"([^\"]+)\"/);if(!m) process.exit(1);console.log(m[1]);")"
PUBLIC_POLICY_PATH="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('app.js','utf8').match(/const\\s+PUBLIC_POLICY_URL\\s*=\\s*\"([^\"]+)\"/);if(!m||!m[1]) process.exit(1);console.log(m[1]);")"
PUBLIC_TERMS_PATH="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('app.js','utf8').match(/const\\s+PUBLIC_TERMS_URL\\s*=\\s*\"([^\"]+)\"/);if(!m||!m[1]) process.exit(1);console.log(m[1]);")"
PUBLIC_SUPPORT_PATH="$("$NODE_BIN" -e "const fs=require('fs');const m=fs.readFileSync('app.js','utf8').match(/const\\s+PUBLIC_SUPPORT_URL\\s*=\\s*\"([^\"]+)\"/);if(!m||!m[1]) process.exit(1);console.log(m[1]);")"
PUBLIC_POLICY_PATH="${PUBLIC_POLICY_PATH#./}"
PUBLIC_TERMS_PATH="${PUBLIC_TERMS_PATH#./}"
PUBLIC_SUPPORT_PATH="${PUBLIC_SUPPORT_PATH#./}"

log_step "Static syntax checks"
"$NODE_BIN" --check app.js
"$NODE_BIN" --check service-worker.js
"$NODE_BIN" --check scripts/generate-launch-screenshots.js
"$NODE_BIN" --check scripts/run-functional-smoke.js
"$NODE_BIN" --check scripts/run-real-face-model-check.js
"$NODE_BIN" --check scripts/launch-blocker-report.js
"$NODE_BIN" --check scripts/build-static-dist.js
"$NODE_BIN" --check scripts/write-launch-evidence.js
"$NODE_BIN" --check scripts/verify-web-release-offline.js
log_ok "app.js / service-worker.js / launch scripts syntax OK"

log_step "Required files"
for file in \
  README.md \
  LAUNCH_CHECKLIST.md \
  MANUAL_QA_CHECKLIST.md \
  STORE_LISTING_DRAFT.md \
  PRIVACY_POLICY_DRAFT.md \
  TERMS_DISCLAIMER.md \
  TOSS_INAPP_RELEASE_TODO.md \
  package.json \
  granite.config.ts \
  docs/launch-audit.md \
  docs/final-draft-checklist.md \
  docs/external-store-inputs.md \
  public/privacy-policy.html \
  public/terms-disclaimer.html \
  public/support.html \
  index.html \
  styles.css \
  manifest.json \
  assets/icon-192.png \
  assets/icon-512.png \
  assets/apple-touch-icon.png \
  assets/vendor/mediapipe/tasks-vision/0.10.35/package.json \
  assets/vendor/mediapipe/tasks-vision/0.10.35/README.md \
  assets/vendor/mediapipe/tasks-vision/0.10.35/vision_bundle.mjs \
  assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_internal.js \
  assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_internal.wasm \
  assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_module_internal.js \
  assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_module_internal.wasm \
  assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_nosimd_internal.js \
  assets/vendor/mediapipe/tasks-vision/0.10.35/wasm/vision_wasm_nosimd_internal.wasm \
  app.js \
  service-worker.js \
  scripts/generate-launch-screenshots.sh \
  scripts/generate-launch-screenshots.js \
  scripts/run-functional-smoke.sh \
  scripts/run-functional-smoke.js \
  scripts/run-real-face-model-check.sh \
  scripts/run-real-face-model-check.js \
  scripts/build-static-dist.js \
  scripts/final-launch-gate.sh \
  scripts/package-web-release.sh \
  scripts/verify-web-release.sh \
  scripts/verify-web-release-offline.js \
  scripts/package-store-assets.sh \
  scripts/verify-store-assets.sh \
  scripts/write-launch-evidence.sh \
  scripts/write-launch-evidence.js \
  scripts/launch-blocker-report.sh \
  scripts/launch-blocker-report.js \
; do
  [[ -f "$file" ]] || log_fail "missing required file: $file"
done
log_ok "required files exist"

log_step "Icon dimensions"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");

const expected = {
  "assets/icon-192.png": [192, 192],
  "assets/icon-512.png": [512, 512],
  "assets/apple-touch-icon.png": [180, 180],
};

function readPngSize(file) {
  const buffer = fs.readFileSync(file);
  const pngSignature = "89504e470d0a1a0a";
  if (buffer.length < 24 || buffer.subarray(0, 8).toString("hex") !== pngSignature) {
    throw new Error(`${file} is not a valid PNG`);
  }
  return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
}

for (const [file, [expectedWidth, expectedHeight]] of Object.entries(expected)) {
  const [width, height] = readPngSize(file);
  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(`${file} must be ${expectedWidth}x${expectedHeight}, got ${width}x${height}`);
  }
  console.log(`${file} ${width}x${height}`);
}
NODE
log_ok "icon PNG dimensions validated"

log_step "Version/cache parity"
if [[ "${SW_CACHE}" != *"${APP_BUILD}"* ]]; then
  log_fail "cacheName '${SW_CACHE}' does not contain appBuild '${APP_BUILD}'"
fi
log_ok "appBuild=${APP_BUILD}, cacheName=${SW_CACHE}"

log_step "Legacy marker sweep"
if rg -q "20260605ab|gwalsa-routine-v32|20260606c25|v71|20260607c02|20260608a01|gwalsa-routine-v20260608a01|20260608a02|gwalsa-routine-v20260608a02|20260609a01|gwalsa-routine-v20260609a01" app.js service-worker.js README.md LAUNCH_CHECKLIST.md MANUAL_QA_CHECKLIST.md design-qa.md docs/final-draft-checklist.md docs/launch-audit.md docs/store-submission-packet.md; then
  log_fail "stale build marker remains"
fi
log_ok "no stale build markers detected"

log_step "Asset reference integrity"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");
const js = fs.readFileSync("app.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const idList = Array.from(html.matchAll(/id=\"([^\"]+)\"/g)).map((match) => match[1]);
const idSet = new Set(idList);
const duplicateIds = idList.filter((value, index, arr) => arr.indexOf(value) !== index);
if (duplicateIds.length) {
  console.log(`[WARN] Duplicate IDs detected in index.html: ${[...new Set(duplicateIds)].join(", ")}`);
  process.exit(1);
}
const references = new Set();
const selectorPatterns = [
  /\$\(\s*["']#([A-Za-z0-9_-]+)["']\s*/g,
  /document\.getElementById\(\s*["']([A-Za-z0-9_-]+)["']\s*\)/g,
  /querySelector(?:All)?\(\s*["']#([A-Za-z0-9_-]+)(?:[\s>+~.,:#]|\b)/g,
];
for (const pattern of selectorPatterns) {
  for (const match of js.matchAll(pattern)) {
    references.add(match[1].trim());
  }
}
const missing = Array.from(references).filter((id) => !idSet.has(id));
if (missing.length) {
  const unique = [...new Set(missing)].sort();
  console.log(`[WARN] ID references not found in index.html: ${unique.join(", ")}`);
  process.exit(1);
}
console.log(`index ID references ok (${references.size} checked)`);
NODE
for required_id in appVersionValue openPrivacyPolicyButton openTermsButton openSupportButton copyPolicyButton resetAppDataButton; do
  if ! rg -q "id=\"${required_id}\"" index.html; then
    log_fail "missing required UI id in index.html: ${required_id}"
  fi
done
rg -q 'href="./manifest.json"' index.html || log_fail "manifest is not referenced with expected path"
rg -q "href=\"./styles.css\\?v=${APP_BUILD}\"" index.html || log_fail "styles.css is not referenced with the current app build cache key"
rg -q "src=\"./app.js\\?v=${APP_BUILD}\"" index.html || log_fail "app.js is not referenced with the current app build cache key"
rg -q './assets/icon.svg' index.html || log_fail "icon asset reference missing"
rg -q './assets/apple-touch-icon.png' index.html || log_fail "apple touch icon reference missing"
rg -q "assets/vendor/mediapipe/tasks-vision/" app.js || log_fail "app.js does not use vendored MediaPipe runtime directory"
rg -q "vision_bundle\\.mjs" app.js || log_fail "app.js does not use vendored MediaPipe vision bundle"
rg -q "FACE_SCAN_WASM_ASSET_PATH" app.js || log_fail "app.js does not configure a vendored MediaPipe WASM asset path"
if rg -q "cdn\\.jsdelivr\\.net/npm/@mediapipe/tasks-vision" app.js; then
  log_fail "app.js still depends on the MediaPipe CDN runtime"
fi
rg -q "name: 'camera'" granite.config.ts || log_fail "granite.config.ts missing camera permission"
rg -q "name: 'photos'" granite.config.ts || log_fail "granite.config.ts missing photos permission"
log_ok "index references are aligned"

log_step "Manifest checks"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
if (!manifest.name || !manifest.short_name) {
  throw new Error("manifest name or short_name missing");
}
if (manifest.lang !== "ko") {
  throw new Error("manifest lang must be ko");
}
if (manifest.start_url !== "./index.html") {
  throw new Error("manifest start_url must be ./index.html");
}
if (manifest.scope !== "./") {
  throw new Error("manifest scope must be ./");
}
if (manifest.display !== "standalone") {
  throw new Error("manifest display must be standalone");
}
if (!/^#[0-9a-f]{6}$/i.test(manifest.theme_color || "") || !/^#[0-9a-f]{6}$/i.test(manifest.background_color || "")) {
  throw new Error("manifest theme/background colors must be hex colors");
}
if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
  throw new Error("manifest icons missing");
}
const hasPng192 = manifest.icons.some((icon) => {
    const src = icon.src || "";
    const sizes = (icon.sizes || "").toLowerCase();
    const purpose = icon.purpose || "";
    return (src === "./assets/icon-192.png" || src === "/assets/icon-192.png") && sizes === "192x192" && icon.type === "image/png" && purpose.includes("maskable");
  });
  if (!hasPng192) {
    throw new Error("manifest does not include required 192x192 png icon");
  }
  const hasPng512 = manifest.icons.some((icon) => {
    const src = icon.src || "";
    const sizes = (icon.sizes || "").toLowerCase();
    const purpose = icon.purpose || "";
    return (src === "./assets/icon-512.png" || src === "/assets/icon-512.png") && sizes === "512x512" && icon.type === "image/png" && purpose.includes("maskable");
  });
  if (!hasPng512) {
    throw new Error("manifest does not include required 512x512 png icon");
  }
  if (!manifest.icons.some((icon) => (icon.src || "").includes("assets/icon.svg") || (icon.type || "").includes("svg"))) {
    throw new Error("manifest does not include assets/icon.svg");
  }
console.log(`manifest name=${manifest.name}`);
NODE
log_ok "manifest validated"

log_step "Policy link wiring"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");
const js = fs.readFileSync("app.js", "utf8");
const policyMatch = js.match(/const\s+PUBLIC_POLICY_URL\s*=\s*"([^"]*)"/);
const termsMatch = js.match(/const\s+PUBLIC_TERMS_URL\s*=\s*"([^"]*)"/);
const supportMatch = js.match(/const\s+PUBLIC_SUPPORT_URL\s*=\s*"([^"]*)"/);
const missing = [];
if (!policyMatch || !policyMatch[1] || /TODO|PLACEHOLDER/.test(policyMatch[1])) missing.push("privacy policy URL");
if (!termsMatch || !termsMatch[1] || /TODO|PLACEHOLDER/.test(termsMatch[1])) missing.push("terms URL");
if (!supportMatch || !supportMatch[1] || /TODO|PLACEHOLDER/.test(supportMatch[1])) missing.push("support URL");
if (policyMatch && /PRIVACY_POLICY_DRAFT\\.md$/.test(policyMatch[1])) missing.push("privacy policy still points to draft markdown");
if (termsMatch && /TERMS_DISCLAIMER\\.md$/.test(termsMatch[1])) missing.push("terms still points to draft markdown");
const policyFile = (policyMatch && policyMatch[1] || "").replace(/^\.\//, "");
const termsFile = (termsMatch && termsMatch[1] || "").replace(/^\.\//, "");
const supportFile = (supportMatch && supportMatch[1] || "").replace(/^\.\//, "");
if (policyFile && !fs.existsSync(policyFile)) {
  missing.push(`privacy policy file missing: ${policyFile}`);
}
if (termsFile && !fs.existsSync(termsFile)) {
  missing.push(`terms file missing: ${termsFile}`);
}
if (supportFile && !fs.existsSync(supportFile)) {
  missing.push(`support file missing: ${supportFile}`);
}
if (missing.length) {
  console.log("[WARN] policy links not configured:", missing.join(", "));
} else {
  console.log(`[OK] policy urls configured: privacy=${policyMatch[1]}, terms=${termsMatch[1]}, support=${supportMatch[1]}`);
}
NODE

log_step "HTTP smoke (index + service worker)"
PORT="${LAUNCH_PRECHECK_PORT:-}"
if [[ -z "$PORT" ]]; then
  PORT="$(python3 - <<'PY'
import socket

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind(("127.0.0.1", 0))
    print(s.getsockname()[1])
PY
)"
fi
SERVER_PID=""
(
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/tmp/gwalsa-launch-precheck.log 2>&1 &
  SERVER_PID=$!
  echo "$SERVER_PID" > /tmp/gwalsa-launch-precheck.pid
)
sleep 1
if ! curl -sSf "http://127.0.0.1:${PORT}/index.html" >/tmp/gwalsa-index.html; then
  log_fail "index.html not served at localhost:${PORT}"
fi
if ! rg -q "싸괄|\"${APP_BUILD}\"" /tmp/gwalsa-index.html; then
  log_fail "index.html smoke check failed to find expected content"
fi
if ! curl -sSf "http://127.0.0.1:${PORT}/service-worker.js" > /tmp/gwalsa-sw.js; then
  log_fail "service-worker.js not served at localhost:${PORT}"
fi
if ! rg -q "${SW_CACHE}" /tmp/gwalsa-sw.js; then
  log_fail "service-worker.js cache name mismatch in served file"
fi
if ! curl -sSf "http://127.0.0.1:${PORT}/manifest.json" | rg -q "\"name\"\\s*:\\s*\"싸괄\""; then
  log_fail "manifest fetch smoke check failed"
fi
if ! curl -sSf "http://127.0.0.1:${PORT}/${PUBLIC_POLICY_PATH}" >/tmp/gwalsa-policy.html 2>/dev/null; then
  log_fail "privacy policy page not reachable"
fi
if ! rg -q "개인정보 처리방침|title" /tmp/gwalsa-policy.html; then
  log_fail "privacy policy page content looks unexpected"
fi
if ! curl -sSf "http://127.0.0.1:${PORT}/${PUBLIC_TERMS_PATH}" >/tmp/gwalsa-terms.html 2>/dev/null; then
  log_fail "terms page not reachable"
fi
if ! rg -q "이용약관|약관" /tmp/gwalsa-terms.html; then
  log_fail "terms page content looks unexpected"
fi
if ! curl -sSf "http://127.0.0.1:${PORT}/${PUBLIC_SUPPORT_PATH}" >/tmp/gwalsa-support.html 2>/dev/null; then
  log_fail "support page not reachable"
fi
if ! rg -q "지원 안내|앱 사용 지원" /tmp/gwalsa-support.html; then
  log_fail "support page content looks unexpected"
fi
log_ok "HTTP smoke checks passed"

:

echo
echo "Launch precheck complete. appBuild=${APP_BUILD}, swCache=${SW_CACHE}"
