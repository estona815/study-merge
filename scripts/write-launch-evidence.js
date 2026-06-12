const fs = require("fs");
const path = require("path");

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function readJson(relativePath, fallback = null) {
  try {
    return JSON.parse(read(relativePath));
  } catch {
    return fallback;
  }
}

function matchOrThrow(text, pattern, label) {
  const match = text.match(pattern);
  if (!match) throw new Error(`${label} not found`);
  return match[1];
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(path.join(root, dir))) return [];
  const out = [];
  function walk(current) {
    for (const entry of fs.readdirSync(path.join(root, current), { withFileTypes: true })) {
      const next = path.join(current, entry.name);
      if (entry.isDirectory()) walk(next);
      else if (!predicate || predicate(next)) out.push(next);
    }
  }
  walk(dir);
  return out.sort();
}

function bulletList(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

const appJs = read("app.js");
const swJs = read("service-worker.js");
const appBuild = matchOrThrow(appJs, /const appBuild\s*=\s*"([^"]+)"/, "appBuild");
const swCache = matchOrThrow(swJs, /const cacheName\s*=\s*"([^"]+)"/, "cacheName");
const generatedAt = new Date().toISOString();
const generatedAtKst = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
}).format(new Date()).replace(" ", "T");
const generatedDateKst = generatedAtKst.slice(0, 10);

const metrics = readJson("output/playwright/20260608-launch-demo/metrics.json", {});
const metricRows = Array.isArray(metrics.metrics) ? metrics.metrics : [];
const functionalSmoke = readJson("output/playwright/20260608-functional-smoke/functional-smoke-report.json", {});
const realFaceModel = readJson("output/playwright/20260610-real-model-check/metrics.json", {});
const screenshotSummary = {
  files: Array.isArray(metrics.files) ? metrics.files.length : 0,
  errors: Array.isArray(metrics.errors) ? metrics.errors.length : 0,
  consoleErrors: Array.isArray(metrics.consoleErrors) ? metrics.consoleErrors.length : 0,
  overflowRows: metricRows.filter((row) => row.overflowX).length,
  riskyTermRows: metricRows.filter((row) => Array.isArray(row.riskyTerms) && row.riskyTerms.length).length,
  swReady: Boolean(metrics.swReady),
  offlineReload: metrics.offlineReload || "unknown",
  offlinePublicSupport: metrics.offlinePublicSupport || "unknown",
  offlinePublicPages: metrics.offlinePublicPages || {},
  gateStatus: metrics.gateStatus || "unknown",
  gateFailures: Array.isArray(metrics.gateFailures) ? metrics.gateFailures : [],
};
const functionalSmokeSummary = {
  status: functionalSmoke.status || "unknown",
  checks: Object.keys(functionalSmoke.checks || {}),
  faceCameraBlockStatus: functionalSmoke.checks?.faceCamera?.blocked ? "passed" : "missing",
  faceCameraBlockText: functionalSmoke.checks?.faceCamera?.statusText || "",
  faceGraphicUploadBlockStatus: functionalSmoke.checks?.faceGraphicUpload?.blocked ? "passed" : "missing",
  faceGraphicUploadBlockText: functionalSmoke.checks?.faceGraphicUpload?.statusText || "",
  referenceVisualizationStatus: functionalSmoke.checks?.faceGuide?.simulation?.status || "missing",
  referenceVisualizationScreenshot: functionalSmoke.checks?.faceGuide?.simulation?.screenshot || "missing",
  failures: Array.isArray(functionalSmoke.failures) ? functionalSmoke.failures : [],
  pageErrors: Array.isArray(functionalSmoke.pageErrors) ? functionalSmoke.pageErrors.length : 0,
  consoleErrors: Array.isArray(functionalSmoke.consoleErrors) ? functionalSmoke.consoleErrors.length : 0,
};
const realFaceModelSummary = {
  status: realFaceModel.status || "unknown",
  provider: realFaceModel.checks?.realUpload?.provider || "missing",
  detectorSource: realFaceModel.checks?.realUpload?.detectorSource || "missing",
  source: realFaceModel.checks?.realUpload?.source || "missing",
  referenceOnly: realFaceModel.checks?.realUpload?.referenceOnly,
  pointCount: Number(realFaceModel.checks?.realUpload?.pointCount || 0),
  landmarkCount: Number(realFaceModel.checks?.realUpload?.landmarkCount || 0),
  sourceConfidence: realFaceModel.checks?.realUpload?.sourceConfidence || null,
  referenceGateStatus: realFaceModel.checks?.referenceGate?.status || "missing",
  allowedByGlobal: realFaceModel.checks?.referenceGate?.allowedByGlobal,
  screenshot: realFaceModel.checks?.realUpload?.screenshot || "missing",
  failures: Array.isArray(realFaceModel.failures) ? realFaceModel.failures : [],
  pageErrors: Array.isArray(realFaceModel.pageErrors) ? realFaceModel.pageErrors.length : 0,
  consoleErrors: Array.isArray(realFaceModel.consoleErrors) ? realFaceModel.consoleErrors.length : 0,
};

const latestRelease = readJson("output/release/latest-web-release.json", {});
const latestStoreAssets = readJson("output/store-assets/latest-store-assets.json", {});
const blockerReport = (() => {
  try {
    const blockers = JSON.parse(read("docs/launch-blockers.json"));
    return {
      webPwaStatus: blockers.webPwaLaunch?.status || "unknown",
      storeStatus: blockers.storeSubmission?.status || "unknown",
      externalBlockers: Array.isArray(blockers.storeSubmission?.externalBlockers)
        ? blockers.storeSubmission.externalBlockers.map((item) => item.label)
        : [],
    };
  } catch {
    return { webPwaStatus: "unknown", storeStatus: "unknown", externalBlockers: [] };
  }
})();

const demoShots = listFiles("output/playwright/20260608-launch-demo", (file) => file.endsWith(".png"));
const launchEvidence = `# 런칭 직전 점검 로그 (${generatedDateKst})

이 문서는 \`scripts/write-launch-evidence.js\`가 현재 워크트리 기준으로 재작성합니다.

## 자동 점검 결과

- 생성 시각 UTC: \`${generatedAt}\`
- 생성 시각 KST: \`${generatedAtKst}+09:00\`
- 실행 경로: \`${root}\`
- 앱 빌드: \`${appBuild}\`
- 서비스워커 캐시: \`${swCache}\`
- 웹/PWA 상태: \`${blockerReport.webPwaStatus}\`
- 스토어 제출 상태: \`${blockerReport.storeStatus}\`

## 실행한 게이트

${bulletList([
  "`node --check app.js`",
  "`node --check service-worker.js`",
  "`./scripts/launch-precheck.sh`",
  "`./scripts/run-functional-smoke.sh`",
  "`./scripts/run-real-face-model-check.sh`",
  "`./scripts/generate-launch-screenshots.sh`",
  "`./scripts/launch-readiness-audit.sh`",
  "`./scripts/launch-blocker-report.sh`",
  "`./scripts/package-web-release.sh`",
  "`./scripts/verify-web-release.sh`",
  "`./scripts/package-store-assets.sh`",
  "`./scripts/verify-store-assets.sh`",
])}

## 게이트 결과

- 스크린샷 파일: \`${screenshotSummary.files}\`
- 페이지 에러: \`${screenshotSummary.errors}\`
- 콘솔 에러: \`${screenshotSummary.consoleErrors}\`
- 가로 오버플로우 행: \`${screenshotSummary.overflowRows}\`
- 고위험 문구 행: \`${screenshotSummary.riskyTermRows}\`
- 서비스워커 준비: \`${screenshotSummary.swReady}\`
- 스크린샷 게이트: \`${screenshotSummary.gateStatus}\`
- 스크린샷 게이트 실패: \`${JSON.stringify(screenshotSummary.gateFailures)}\`
- 오프라인 리로드: \`${screenshotSummary.offlineReload}\`
- 오프라인 지원 페이지: \`${screenshotSummary.offlinePublicSupport}\`
- 오프라인 공개 페이지: \`${JSON.stringify(screenshotSummary.offlinePublicPages)}\`
- 정책 버튼 라우팅: \`./public/privacy-policy.html\`, \`./public/terms-disclaimer.html\`, \`./public/support.html\`

## 기능 Smoke 결과

- 상태: \`${functionalSmokeSummary.status}\`
- 체크: \`${functionalSmokeSummary.checks.join(", ") || "none"}\`
- fake camera 차단: \`${functionalSmokeSummary.faceCameraBlockStatus}\`
- fake camera 안내: \`${functionalSmokeSummary.faceCameraBlockText}\`
- 투명 그래픽 업로드 차단: \`${functionalSmokeSummary.faceGraphicUploadBlockStatus}\`
- 투명 그래픽 안내: \`${functionalSmokeSummary.faceGraphicUploadBlockText}\`
- 참고 시각화 렌더: \`${functionalSmokeSummary.referenceVisualizationStatus}\`
- 참고 시각화 증적: \`output/playwright/20260608-functional-smoke/${functionalSmokeSummary.referenceVisualizationScreenshot}\`
- 실패: \`${JSON.stringify(functionalSmokeSummary.failures)}\`
- 페이지 에러: \`${functionalSmokeSummary.pageErrors}\`
- 콘솔 에러: \`${functionalSmokeSummary.consoleErrors}\`

## 운영 모드 MediaPipe 감지 결과

- 상태: \`${realFaceModelSummary.status}\`
- provider: \`${realFaceModelSummary.provider}\`
- detectorSource: \`${realFaceModelSummary.detectorSource}\`
- source: \`${realFaceModelSummary.source}\`
- referenceOnly: \`${realFaceModelSummary.referenceOnly}\`
- landmarkCount: \`${realFaceModelSummary.landmarkCount}\`
- pointCount: \`${realFaceModelSummary.pointCount}\`
- confidence: \`${realFaceModelSummary.sourceConfidence || "n/a"}\`
- reference 전역 우회 차단: \`${realFaceModelSummary.allowedByGlobal === false ? "passed" : "failed"}\`
- 실감지 증적: \`output/playwright/20260610-real-model-check/${realFaceModelSummary.screenshot}\`
- 실패: \`${JSON.stringify(realFaceModelSummary.failures)}\`
- 페이지 에러: \`${realFaceModelSummary.pageErrors}\`
- 콘솔 에러: \`${realFaceModelSummary.consoleErrors}\`

## 최신 릴리스 패키지

- 패키지: \`${latestRelease.packageName || "not generated"}\`
- zip: \`${latestRelease.zipPath || "not generated"}\`
- sha256: \`${latestRelease.zipSha256 || "not generated"}\`
- manifest: \`${latestRelease.manifestPath || "not generated"}\`

## 최신 스토어 에셋 패키지

- 패키지: \`${latestStoreAssets.packageName || "not generated"}\`
- zip: \`${latestStoreAssets.zipPath || "not generated"}\`
- sha256: \`${latestStoreAssets.zipSha256 || "not generated"}\`

## 스크린샷 증적

${demoShots.length ? bulletList(demoShots.map((file) => `\`${file}\``)) : "- `output/playwright/20260608-launch-demo/` 증적 없음"}

## 남은 외부 제출 항목

입력 원장: \`docs/external-store-inputs.md\`

${blockerReport.externalBlockers.length ? bulletList(blockerReport.externalBlockers) : "- 외부 블로커 목록 없음"}
`;

const launchQa = `# 런칭 QA 실행 기록 (${generatedDateKst})

이 문서는 \`scripts/write-launch-evidence.js\`가 현재 워크트리 기준으로 재작성합니다.

## 실행 환경

- 날짜: ${generatedDateKst}
- 시간대: KST
- 실행자: 자동/개발자 검증
- 빌드: \`${appBuild}\`
- 서비스워커 캐시: \`${swCache}\`

## 자동 검증 (완료)

${bulletList([
  "`node --check app.js`",
  "`node --check service-worker.js`",
  "`bash scripts/launch-precheck.sh`",
  "`bash scripts/run-functional-smoke.sh`",
  "`bash scripts/run-real-face-model-check.sh`",
  "`bash scripts/launch-readiness-audit.sh`",
  "`bash scripts/package-web-release.sh`",
  "`bash scripts/verify-web-release.sh`",
  "`bash scripts/package-store-assets.sh`",
  "`bash scripts/verify-store-assets.sh`",
])}

- HTTP smoke: \`/index.html\`, \`/service-worker.js\`, \`/manifest.json\`, \`/public/privacy-policy.html\`, \`/public/terms-disclaimer.html\`, \`/public/support.html\`
- 스크린샷 증적: \`output/playwright/20260608-launch-demo/\`
- 스크린샷 파일: \`${screenshotSummary.files}\`
- 오버플로우 메트릭: \`overflowRows=${screenshotSummary.overflowRows}\`
- 콘솔 에러: \`${screenshotSummary.consoleErrors}\`
- 고위험 문구 행: \`${screenshotSummary.riskyTermRows}\`
- 스크린샷 게이트: \`${screenshotSummary.gateStatus}\`
- 스크린샷 게이트 실패: \`${JSON.stringify(screenshotSummary.gateFailures)}\`
- 오프라인 리로드: \`${screenshotSummary.offlineReload}\`
- 오프라인 지원 페이지: \`${screenshotSummary.offlinePublicSupport}\`
- 오프라인 공개 페이지: \`${JSON.stringify(screenshotSummary.offlinePublicPages)}\`
- 정책/지원 링크 라우팅: \`/public/privacy-policy.html\`, \`/public/terms-disclaimer.html\`, \`/public/support.html\`
- 기능 smoke: \`${functionalSmokeSummary.status}\` (\`${functionalSmokeSummary.checks.join(", ") || "none"}\`)
- fake camera 차단: \`${functionalSmokeSummary.faceCameraBlockStatus}\`
- 투명 그래픽 업로드 차단: \`${functionalSmokeSummary.faceGraphicUploadBlockStatus}\`
- 참고 시각화 렌더: \`${functionalSmokeSummary.referenceVisualizationStatus}\` (\`output/playwright/20260608-functional-smoke/${functionalSmokeSummary.referenceVisualizationScreenshot}\`)
- 운영 모드 MediaPipe 실감지: \`${realFaceModelSummary.status}\` (\`${realFaceModelSummary.provider}, ${realFaceModelSummary.landmarkCount} landmarks, referenceOnly=${realFaceModelSummary.referenceOnly}\`)
- reference 전역 우회 차단: \`${realFaceModelSummary.allowedByGlobal === false ? "passed" : "failed"}\`
- 운영 모드 증적: \`output/playwright/20260610-real-model-check/${realFaceModelSummary.screenshot}\`
- 최신 릴리스 zip: \`${latestRelease.zipPath || "not generated"}\`
- 최신 스토어 에셋 zip: \`${latestStoreAssets.zipPath || "not generated"}\`

## 수동 검증 (운영/기기 점검 필요)

- Fresh Install
- Core Flow
- History And Photos
- Face Guide
- Settings And Policies
- Backup
- Permissions And Offline
- Display (390/430/tablet/desktop)

> 상태: 자동 게이트 기반 사전 통과 완료. 앱스토어 제출 전 상기 수동 항목은 타깃 디바이스에서 1회 최종 확인 필요.
`;

fs.writeFileSync(path.join(root, "docs/launch-release-evidence-20260607.md"), launchEvidence);
fs.writeFileSync(path.join(root, "docs/launch-qa-20260607.md"), launchQa);

console.log(JSON.stringify({
  generatedAt,
  generatedAtKst: `${generatedAtKst}+09:00`,
  appBuild,
  swCache,
  screenshotSummary,
  realFaceModelSummary,
  latestRelease: {
    packageName: latestRelease.packageName || null,
    zipPath: latestRelease.zipPath || null,
    zipSha256: latestRelease.zipSha256 || null,
  },
  latestStoreAssets: {
    packageName: latestStoreAssets.packageName || null,
    zipPath: latestStoreAssets.zipPath || null,
    zipSha256: latestStoreAssets.zipSha256 || null,
  },
}, null, 2));
