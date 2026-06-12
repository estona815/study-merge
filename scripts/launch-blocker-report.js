const fs = require("fs");
const path = require("path");

const root = process.cwd();
const blockerPath = path.join(root, "docs/launch-blockers.json");

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function checkNoPublicPrelaunchCopy() {
  const files = ["public/privacy-policy.html", "public/terms-disclaimer.html", "public/support.html"];
  const patterns = [/최종 배포 전/, /런칭 전/, /TODO/, /PLACEHOLDER/, /FIXME/, /TBD/];
  return files.flatMap((file) => {
    if (!exists(file)) return [{ file, issue: "missing" }];
    const text = read(file);
    return patterns
      .filter((pattern) => pattern.test(text))
      .map((pattern) => ({ file, issue: `contains ${pattern}` }));
  });
}

function checkRiskyCopy() {
  const files = ["index.html", "app.js", "README.md", "STORE_LISTING_DRAFT.md", "public/privacy-policy.html", "public/terms-disclaimer.html", "public/support.html"];
  const terms = ["신뢰도", "자동 추천", "가이드 분석", "분석하기", "분석 완료", "아침 붓기", "부기 리셋", "광대 리프트", "효과 유지", "전후 변화"];
  return files.flatMap((file) => {
    if (!exists(file)) return [{ file, issue: "missing" }];
    const text = read(file);
    return terms
      .filter((term) => text.includes(term))
      .map((term) => ({ file, issue: `contains ${term}` }));
  });
}

function checkAppsInTossPrep() {
  const issues = [];
  for (const file of ["package.json", "granite.config.ts", "TOSS_INAPP_RELEASE_TODO.md"]) {
    if (!exists(file)) issues.push({ file, issue: "missing Apps in Toss prep file" });
  }
  if (exists("app.js")) {
    const app = read("app.js");
    if (app.includes("cdn.jsdelivr.net/npm/@mediapipe/tasks-vision")) {
      issues.push({ file: "app.js", issue: "MediaPipe runtime still depends on CDN" });
    }
    if (!app.includes("assets/vendor/mediapipe/tasks-vision/") || !app.includes("vision_bundle.mjs")) {
      issues.push({ file: "app.js", issue: "vendored MediaPipe runtime path missing" });
    }
    if (!app.includes("FACE_SCAN_WASM_ASSET_PATH")) {
      issues.push({ file: "app.js", issue: "vendored MediaPipe WASM asset path missing" });
    }
  }
  if (exists("granite.config.ts")) {
    const granite = read("granite.config.ts");
    if (!granite.includes("name: 'camera'")) issues.push({ file: "granite.config.ts", issue: "camera permission missing" });
    if (!granite.includes("name: 'photos'")) issues.push({ file: "granite.config.ts", issue: "photos permission missing" });
  }
  return issues;
}

function getScreenshotMetrics() {
  const metricsPath = "output/playwright/20260608-launch-demo/metrics.json";
  if (!exists(metricsPath)) return { exists: false };
  const data = JSON.parse(read(metricsPath));
  const metrics = Array.isArray(data.metrics) ? data.metrics : [];
  return {
    exists: true,
    files: Array.isArray(data.files) ? data.files.length : 0,
    errors: Array.isArray(data.errors) ? data.errors.length : null,
    consoleErrors: Array.isArray(data.consoleErrors) ? data.consoleErrors.length : null,
    overflowRows: metrics.filter((item) => item.overflowX).length,
    riskyTermRows: metrics.filter((item) => Array.isArray(item.riskyTerms) && item.riskyTerms.length).length,
    swReady: Boolean(data.swReady),
    offlineReload: data.offlineReload || "unknown",
    offlinePublicSupport: data.offlinePublicSupport || "unknown",
    offlinePublicPages: data.offlinePublicPages || {},
    gateStatus: data.gateStatus || "unknown",
    gateFailures: Array.isArray(data.gateFailures) ? data.gateFailures : [],
  };
}

function getFunctionalSmokeReport() {
  const reportPath = "output/playwright/20260608-functional-smoke/functional-smoke-report.json";
  if (!exists(reportPath)) return { exists: false };
  const data = JSON.parse(read(reportPath));
  return {
    exists: true,
    status: data.status || "unknown",
    failures: Array.isArray(data.failures) ? data.failures : [],
    pageErrors: Array.isArray(data.pageErrors) ? data.pageErrors.length : null,
    consoleErrors: Array.isArray(data.consoleErrors) ? data.consoleErrors.length : null,
    checks: data.checks || {},
  };
}

function getRealFaceModelReport() {
  const reportPath = "output/playwright/20260610-real-model-check/metrics.json";
  if (!exists(reportPath)) return { exists: false };
  const data = JSON.parse(read(reportPath));
  return {
    exists: true,
    status: data.status || "unknown",
    failures: Array.isArray(data.failures) ? data.failures : [],
    pageErrors: Array.isArray(data.pageErrors) ? data.pageErrors.length : null,
    consoleErrors: Array.isArray(data.consoleErrors) ? data.consoleErrors.length : null,
    realUpload: data.checks?.realUpload || {},
    referenceGate: data.checks?.referenceGate || {},
  };
}

function getStoreAssetsReport() {
  const latestPath = "output/store-assets/latest-store-assets.json";
  if (!exists(latestPath)) return { exists: false };
  const latest = JSON.parse(read(latestPath));
  const zipPath = latest.zipPath || "";
  const shaPath = latest.sha256Path || `${zipPath}.sha256`;
  return {
    exists: true,
    packageName: latest.packageName || null,
    zipPath,
    sha256Path: shaPath,
    zipExists: Boolean(zipPath && exists(zipPath)),
    shaExists: Boolean(shaPath && exists(shaPath)),
    zipSha256: latest.zipSha256 || null,
  };
}

function checkScreenshotGate(metrics) {
  const issues = [];
  if (!metrics.exists) {
    return [{ file: "output/playwright/20260608-launch-demo/metrics.json", issue: "missing screenshot metrics" }];
  }
  const publicPages = metrics.offlinePublicPages || {};
  const publicPageFailures = ["privacy-policy.html", "terms-disclaimer.html", "support.html"]
    .filter((file) => publicPages[file] !== "ok")
    .map((file) => `${file}:${publicPages[file] || "missing"}`);
  if (metrics.files < 28) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `screenshot files below expected 28: ${metrics.files}` });
  if (metrics.gateStatus !== "passed") issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `screenshot gate status ${metrics.gateStatus}` });
  if (metrics.gateFailures.length) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `screenshot gate failures: ${metrics.gateFailures.join("; ")}` });
  if (metrics.errors) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `page errors: ${metrics.errors}` });
  if (metrics.consoleErrors) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `console errors: ${metrics.consoleErrors}` });
  if (metrics.overflowRows) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `horizontal overflow rows: ${metrics.overflowRows}` });
  if (metrics.riskyTermRows) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `risky copy rows: ${metrics.riskyTermRows}` });
  if (!metrics.swReady) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: "service worker not ready" });
  if (metrics.offlineReload !== "ok") issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `offline reload ${metrics.offlineReload}` });
  if (metrics.offlinePublicSupport !== "ok") issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `offline support ${metrics.offlinePublicSupport}` });
  if (publicPageFailures.length) issues.push({ file: "output/playwright/20260608-launch-demo/metrics.json", issue: `offline public page failures: ${publicPageFailures.join(", ")}` });
  return issues;
}

function checkFunctionalSmoke(report) {
  if (!report.exists) {
    return [{ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: "missing functional smoke report" }];
  }
  const issues = [];
  if (report.status !== "passed") issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: `functional smoke status ${report.status}` });
  if (report.failures.length) issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: `functional smoke failures: ${report.failures.join("; ")}` });
  if (report.pageErrors) issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: `functional smoke page errors: ${report.pageErrors}` });
  if (report.consoleErrors) issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: `functional smoke console errors: ${report.consoleErrors}` });
  for (const name of ["manualLog", "backup", "faceCamera", "faceGraphicUpload", "faceGuide"]) {
    const status = report.checks?.[name]?.status;
    if (status !== "passed") issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: `functional smoke ${name} ${status || "missing"}` });
  }
  if (report.checks?.faceCamera?.blocked !== true) {
    issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: "functional smoke fake camera block missing or failed" });
  }
  if (report.checks?.faceGraphicUpload?.blocked !== true) {
    issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: "functional smoke transparent graphic upload block missing or failed" });
  }
  if (report.checks?.faceGuide?.simulation?.status !== "passed") {
    issues.push({ file: "output/playwright/20260608-functional-smoke/functional-smoke-report.json", issue: "functional smoke face simulation missing or failed" });
  }
  return issues;
}

function checkRealFaceModel(report) {
  if (!report.exists) {
    return [{ file: "output/playwright/20260610-real-model-check/metrics.json", issue: "missing real MediaPipe model report" }];
  }
  const issues = [];
  const realUpload = report.realUpload || {};
  const referenceGate = report.referenceGate || {};
  if (report.status !== "passed") issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real model status ${report.status}` });
  if (report.failures.length) issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real model failures: ${report.failures.join("; ")}` });
  if (report.pageErrors) issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real model page errors: ${report.pageErrors}` });
  if (realUpload.status !== "passed") issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real upload ${realUpload.status || "missing"}` });
  if (realUpload.provider !== "mediapipe") issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real upload provider ${realUpload.provider || "missing"}` });
  if (realUpload.detectorSource !== "real") issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real upload detectorSource ${realUpload.detectorSource || "missing"}` });
  if (realUpload.source !== "upload-landmark") issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real upload source ${realUpload.source || "missing"}` });
  if (realUpload.referenceOnly !== false) issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: "real upload marked referenceOnly" });
  if (Number(realUpload.pointCount || 0) < 20) issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real upload pointCount ${realUpload.pointCount || 0}` });
  if (Number(realUpload.landmarkCount || 0) < 100) issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: `real upload landmarkCount ${realUpload.landmarkCount || 0}` });
  if (referenceGate.status !== "passed" || referenceGate.allowedByGlobal !== false) {
    issues.push({ file: "output/playwright/20260610-real-model-check/metrics.json", issue: "reference mode is not query-gated" });
  }
  return issues;
}

function checkStoreAssets(report) {
  if (!report.exists) {
    return [{ file: "output/store-assets/latest-store-assets.json", issue: "missing store assets package metadata" }];
  }
  const issues = [];
  if (!report.zipExists) issues.push({ file: report.zipPath || "output/store-assets/latest-store-assets.json", issue: "store assets zip missing" });
  if (!report.shaExists) issues.push({ file: report.sha256Path || "output/store-assets/latest-store-assets.json", issue: "store assets checksum missing" });
  if (!report.zipSha256 || !/^[a-f0-9]{64}$/.test(report.zipSha256)) {
    issues.push({ file: "output/store-assets/latest-store-assets.json", issue: "store assets sha256 missing or invalid" });
  }
  return issues;
}

function main() {
  const blockers = JSON.parse(read("docs/launch-blockers.json"));
  const screenshotMetrics = getScreenshotMetrics();
  const functionalSmoke = getFunctionalSmokeReport();
  const realFaceModel = getRealFaceModelReport();
  const storeAssets = getStoreAssetsReport();
  const repoIssues = [
    ...checkNoPublicPrelaunchCopy(),
    ...checkRiskyCopy(),
    ...checkAppsInTossPrep(),
    ...checkScreenshotGate(screenshotMetrics),
    ...checkFunctionalSmoke(functionalSmoke),
    ...checkRealFaceModel(realFaceModel),
    ...checkStoreAssets(storeAssets),
  ];
  const requiredFiles = [
    "README.md",
    "LAUNCH_CHECKLIST.md",
    "MANUAL_QA_CHECKLIST.md",
    "design-qa.md",
    "TOSS_INAPP_RELEASE_TODO.md",
    "package.json",
    "granite.config.ts",
    "docs/store-submission-packet.md",
    "docs/store-privacy-answers.md",
    "docs/external-store-inputs.md",
    "public/privacy-policy.html",
    "public/terms-disclaimer.html",
    "public/support.html",
    "assets/icon-192.png",
    "assets/icon-512.png",
    "assets/apple-touch-icon.png",
    "scripts/generate-launch-screenshots.sh",
    "scripts/run-functional-smoke.sh",
    "scripts/run-functional-smoke.js",
    "scripts/run-real-face-model-check.sh",
    "scripts/run-real-face-model-check.js",
    "scripts/build-static-dist.js",
    "scripts/package-web-release.sh",
    "scripts/verify-web-release.sh",
    "scripts/verify-web-release-offline.js",
    "scripts/package-store-assets.sh",
    "scripts/verify-store-assets.sh",
    "scripts/write-launch-evidence.sh",
    "scripts/write-launch-evidence.js",
    "scripts/launch-precheck.sh",
    "scripts/launch-readiness-audit.sh",
  ].filter((file) => !exists(file)).map((file) => ({ file, issue: "missing" }));
  const report = {
    generatedAt: new Date().toISOString(),
    webPwaLaunch: {
      status: repoIssues.length || requiredFiles.length ? "repo-blocked" : blockers.webPwaLaunch.status,
      repoIssues,
      missingRequiredFiles: requiredFiles,
    },
    storeSubmission: blockers.storeSubmission,
    screenshotMetrics,
    functionalSmoke,
    realFaceModel,
    storeAssets,
    evidence: blockers.evidence,
  };
  console.log(JSON.stringify(report, null, 2));
  if (report.webPwaLaunch.status === "repo-blocked") {
    process.exit(1);
  }
}

main();
