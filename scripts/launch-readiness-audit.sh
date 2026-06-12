#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

NODE_BIN="${NODE_BIN:-}"
if [[ -z "$NODE_BIN" && -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
  NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
fi
if [[ -z "$NODE_BIN" ]]; then
  NODE_BIN="$(command -v node || true)"
fi
NODE_MODULE_DIR=""
if [[ -d "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules" ]]; then
  NODE_MODULE_DIR="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"
fi
if [[ -z "$NODE_BIN" ]]; then
  echo "FAIL Node.js runtime not found" >&2
  exit 1
fi

echo "## Launch Readiness Audit"
echo "Root: $ROOT"
echo

required_docs=(
  "README.md"
  "LAUNCH_CHECKLIST.md"
  "MANUAL_QA_CHECKLIST.md"
  "design-qa.md"
  "docs/launch-audit.md"
  "docs/store-submission-packet.md"
  "docs/store-privacy-answers.md"
  "docs/external-store-inputs.md"
  "docs/launch-blockers.json"
  "STORE_LISTING_DRAFT.md"
  "PRIVACY_POLICY_DRAFT.md"
  "TERMS_DISCLAIMER.md"
  "TOSS_INAPP_RELEASE_TODO.md"
  "package.json"
  "granite.config.ts"
  "index.html"
  "styles.css"
  "manifest.json"
  "service-worker.js"
  "public/privacy-policy.html"
  "public/terms-disclaimer.html"
  "public/support.html"
  "assets/icon-192.png"
  "assets/icon-512.png"
  "assets/apple-touch-icon.png"
  "scripts/generate-launch-screenshots.sh"
  "scripts/generate-launch-screenshots.js"
  "scripts/run-functional-smoke.sh"
  "scripts/run-functional-smoke.js"
  "scripts/run-real-face-model-check.sh"
  "scripts/run-real-face-model-check.js"
  "scripts/build-static-dist.js"
  "scripts/final-launch-gate.sh"
  "scripts/package-web-release.sh"
  "scripts/verify-web-release.sh"
  "scripts/verify-web-release-offline.js"
  "scripts/package-store-assets.sh"
  "scripts/verify-store-assets.sh"
  "scripts/write-launch-evidence.sh"
  "scripts/write-launch-evidence.js"
  "scripts/launch-blocker-report.sh"
  "scripts/launch-blocker-report.js"
)

echo "### Required files"
for file in "${required_docs[@]}"; do
  if [[ -f "$file" ]]; then
    echo "OK  $file"
  else
    echo "MISS $file"
  fi
done

if compgen -G "docs/launch-qa-*.md" > /dev/null; then
  latest_launch_qa="$(ls docs/launch-qa-*.md 2>/dev/null | sort | tail -n 1)"
  echo "OK  launch-qa evidence: ${latest_launch_qa}"
else
  echo "MISS launch-qa evidence file: docs/launch-qa-YYYYMMDD.md"
fi

echo
echo "### Screenshot evidence scan (latest path pattern scan)"
shot_dirs=(
  "output/playwright/20260608-launch-demo"
)

has_390=0
has_430=0
has_desktop=0
for d in "${shot_dirs[@]}"; do
  [[ -d "$d" ]] || continue
  if find "$d" -maxdepth 1 -type f -name "*390*.png" | grep -q .; then
    has_390=1
  fi
  if find "$d" -maxdepth 1 -type f -name "*430*.png" | grep -q .; then
    has_430=1
  fi
  if find "$d" -maxdepth 3 -type f \( -name "*1280*.png" -o -name "*desktop*.png" \) | grep -q .; then
    has_desktop=1
  fi
done
echo "390px shots: $has_390"
echo "430px shots: $has_430"
echo "desktop shots: $has_desktop"

get_screenshot() {
  local pattern="$1"
  local preferred_dirs=(
    "output/playwright/20260608-launch-demo"
    "output/playwright/20260606-ui-final-pass"
    "output/playwright/20260606-ui-polish"
    "output/playwright/20260606-ui-audit"
  )
  local found=""
  for d in "${preferred_dirs[@]}"; do
    [[ -d "$d" ]] || continue;
    found="$(find "$d" -maxdepth 3 -type f -name "$pattern" | head -n 1 || true)"
    if [[ -n "$found" ]]; then
      echo "$found"
      return 0
    fi
  done
  echo ""
}

echo "  onboarding: $(get_screenshot '*onboarding*.png' )"
echo "  today: $(get_screenshot '*today*.png' )"
echo "  routines: $(get_screenshot '*routines*.png' )"
echo "  log: $(get_screenshot '*log*.png' )"
echo "  settings: $(get_screenshot '*settings*.png' )"
echo "  face: $(get_screenshot '*face*.png' )"
echo "  public privacy offline: $(get_screenshot '*public-privacy-offline*.png' )"
echo "  public terms offline: $(get_screenshot '*public-terms-offline*.png' )"
echo "  public support: $(get_screenshot '*public-support*.png' )"
echo "  public support offline: $(get_screenshot '*public-support-offline*.png' )"
completion_file="$(get_screenshot '*completion*.png')"
echo "  completion: ${completion_file}"
completion_hits="$(find output/playwright -type f -name '*.png' | tr '\n' ' ' | sed 's/[[:space:]]/,/g' | grep -o 'complete' | wc -l | tr -d ' ' || true)"
echo "  completionPanel text search: ${completion_hits}"

echo
echo "### Required screenshot set (must-have for launch evidence)"
missing_artifacts=0
required_files=(
  "*onboarding*"
  "*today*"
  "*routines*"
  "*log*"
  "*settings*"
  "*face*"
  "*public-privacy-offline*"
  "*public-terms-offline*"
  "*public-support*"
  "*public-support-offline*"
  "completion*.png"
  "*1280*.png"
)
required_labels=(
  "onboarding"
  "today"
  "routines"
  "log"
  "settings"
  "face"
  "public-privacy-offline"
  "public-terms-offline"
  "public-support"
  "public-support-offline"
  "completion"
  "desktop"
)

for idx in "${!required_labels[@]}"; do
  label="${required_labels[$idx]}"
  pattern="${required_files[$idx]}"
  found_file="$(get_screenshot "$pattern")"
  if [[ -n "$found_file" ]]; then
    echo "OK  $label: $found_file"
  else
    echo "MISS $label screenshot"
    missing_artifacts=1
  fi
done

if [[ "$missing_artifacts" -ne 0 ]]; then
  echo
  echo "FAIL: Required screenshot evidence is incomplete."
  exit 1
fi

echo
echo "### Functional smoke evidence"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");
const file = "output/playwright/20260608-functional-smoke/functional-smoke-report.json";
if (!fs.existsSync(file)) {
  console.log(`MISS ${file}`);
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(file, "utf8"));
const checks = Object.entries(report.checks || {}).map(([name, value]) => `${name}:${value.status || "unknown"}`);
console.log(`status=${report.status}`);
console.log(`checks=${checks.join(", ")}`);
console.log(`faceCameraBlock=${report.checks?.faceCamera?.blocked ? "passed" : "missing"}`);
console.log(`faceGraphicUploadBlock=${report.checks?.faceGraphicUpload?.blocked ? "passed" : "missing"}`);
console.log(`faceSimulation=${report.checks?.faceGuide?.simulation?.status || "missing"}`);
console.log(`faceSimulationScreenshot=${report.checks?.faceGuide?.simulation?.screenshot || "missing"}`);
console.log(`pageErrors=${Array.isArray(report.pageErrors) ? report.pageErrors.length : "unknown"}`);
console.log(`consoleErrors=${Array.isArray(report.consoleErrors) ? report.consoleErrors.length : "unknown"}`);
if (report.status !== "passed"
  || report.checks?.faceCamera?.status !== "passed"
  || report.checks?.faceCamera?.blocked !== true
  || report.checks?.faceGraphicUpload?.status !== "passed"
  || report.checks?.faceGraphicUpload?.blocked !== true
  || report.checks?.faceGuide?.simulation?.status !== "passed") {
  console.log(`failures=${JSON.stringify(report.failures || [])}`);
  process.exit(1);
}
NODE

echo
echo "### Real MediaPipe model evidence"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");
const file = "output/playwright/20260610-real-model-check/metrics.json";
if (!fs.existsSync(file)) {
  console.log(`MISS ${file}`);
  process.exit(1);
}
const report = JSON.parse(fs.readFileSync(file, "utf8"));
const realUpload = report.checks?.realUpload || {};
const referenceGate = report.checks?.referenceGate || {};
console.log(`status=${report.status}`);
console.log(`provider=${realUpload.provider || "missing"}`);
console.log(`detectorSource=${realUpload.detectorSource || "missing"}`);
console.log(`source=${realUpload.source || "missing"}`);
console.log(`referenceOnly=${realUpload.referenceOnly}`);
console.log(`pointCount=${realUpload.pointCount || 0}`);
console.log(`landmarkCount=${realUpload.landmarkCount || 0}`);
console.log(`globalReferenceOverride=${referenceGate.allowedByGlobal}`);
console.log(`pageErrors=${Array.isArray(report.pageErrors) ? report.pageErrors.length : "unknown"}`);
if (report.status !== "passed"
  || realUpload.status !== "passed"
  || referenceGate.status !== "passed"
  || realUpload.provider !== "mediapipe"
  || realUpload.detectorSource !== "real"
  || realUpload.source !== "upload-landmark"
  || realUpload.referenceOnly !== false
  || realUpload.pointCount < 20
  || realUpload.landmarkCount < 100
  || referenceGate.allowedByGlobal !== false) {
  console.log(`failures=${JSON.stringify(report.failures || [])}`);
  process.exit(1);
}
NODE

echo
echo "### Layout overflow evidence from metrics"
"$NODE_BIN" - <<'NODE'
const fs = require("fs");
const file = "output/playwright/20260608-launch-demo/metrics.json";
if (!fs.existsSync(file)) {
  console.log(`No launch-demo metrics found: ${file}`);
  process.exit(0);
}
let overflowCount = 0;
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const entries = [];
if (Array.isArray(data.metrics)) entries.push(...data.metrics.map((item, i) => [String(i), item]));
else if (data.metrics && typeof data.metrics === "object") entries.push(...Object.entries(data.metrics));
for (const [key, item] of entries) {
  const viewport = item.viewport || {};
  const viewportWidth = Number(viewport.w || viewport.width || 0);
  const scroll = item.scroll || item;
  const docWidth = Number(scroll.docW || scroll.scrollWidth || 0);
  const bodyWidth = Number(scroll.bodyW || scroll.bodyScrollWidth || 0);
  const clientWidth = Number(scroll.clientW || scroll.clientWidth || viewportWidth || 0);
  if (!viewportWidth || !docWidth || !bodyWidth || !clientWidth) continue;
  if (item.overflowX || docWidth > clientWidth + 1 || bodyWidth > viewportWidth + 1) {
    overflowCount += 1;
  }
  console.log(`metrics:20260608-launch-demo ${key} w=${viewportWidth} body=${bodyWidth} doc=${docWidth} client=${clientWidth}`);
}
console.log(`overflowRows=${overflowCount}`);
NODE

echo
echo "### Reminder/notification runtime check"
if rg -q "function sendReminderNotification|getActiveServiceWorkerRegistration" app.js; then
  echo "OK app.js has reminder fallback flow"
else
  echo "CHECK app.js reminder flow"
fi

echo
echo "### Launch screenshot generator"
if [[ -x "scripts/generate-launch-screenshots.sh" || -f "scripts/generate-launch-screenshots.sh" ]]; then
  echo "OK scripts/generate-launch-screenshots.sh present"
else
  echo "MISS scripts/generate-launch-screenshots.sh"
  exit 1
fi

echo
echo "### Store asset packaging"
if [[ -f "output/store-assets/latest-store-assets.json" ]]; then
  "$NODE_BIN" - <<'NODE'
const fs = require("fs");
const latest = JSON.parse(fs.readFileSync("output/store-assets/latest-store-assets.json", "utf8"));
console.log(`INFO latest existing package=${latest.packageName}`);
console.log("INFO final launch gate regenerates store assets after web release verification");
NODE
else
  echo "INFO no existing store asset package; final launch gate creates it after web release verification"
fi

echo
echo "### Web release packager"
if [[ -x "scripts/package-web-release.sh" || -f "scripts/package-web-release.sh" ]]; then
  echo "OK scripts/package-web-release.sh present"
else
  echo "MISS scripts/package-web-release.sh"
  exit 1
fi
if [[ -x "scripts/verify-web-release.sh" || -f "scripts/verify-web-release.sh" ]]; then
  echo "OK scripts/verify-web-release.sh present"
else
  echo "MISS scripts/verify-web-release.sh"
  exit 1
fi
if [[ -x "scripts/package-store-assets.sh" || -f "scripts/package-store-assets.sh" ]]; then
  echo "OK scripts/package-store-assets.sh present"
else
  echo "MISS scripts/package-store-assets.sh"
  exit 1
fi
if [[ -x "scripts/verify-store-assets.sh" || -f "scripts/verify-store-assets.sh" ]]; then
  echo "OK scripts/verify-store-assets.sh present"
else
  echo "MISS scripts/verify-store-assets.sh"
  exit 1
fi

if [[ -n "$NODE_BIN" ]]; then
  if NODE_PATH="$NODE_MODULE_DIR${NODE_PATH:+:$NODE_PATH}" "$NODE_BIN" -e "require('playwright'); console.log('playwright-ok');" >/tmp/gwalsa-audit-playwright.out 2>/tmp/gwalsa-audit-playwright.err; then
    echo "OK  playwright module resolved"
  else
    echo "CHECK playwright module missing"
    if [[ -s /tmp/gwalsa-audit-playwright.err ]]; then
      echo "      $(sed -n '1,3p' /tmp/gwalsa-audit-playwright.err)"
    fi
  fi
else
  echo "CHECK node runtime not found (screenshot run impossible)"
fi

echo
echo "### Launch blocker report"
"$NODE_BIN" scripts/launch-blocker-report.js >/tmp/gwalsa-launch-blockers.json
if "$NODE_BIN" -e "const r=require('/tmp/gwalsa-launch-blockers.json'); if(r.webPwaLaunch.status==='repo-blocked') process.exit(1);"; then
  echo "OK web/PWA repo blockers clear"
else
  echo "FAIL web/PWA repo blockers remain"
  cat /tmp/gwalsa-launch-blockers.json
  exit 1
fi

echo
echo "Done."
