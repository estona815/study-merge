# 런칭 직전 점검 로그 (2026-06-12)

이 문서는 `scripts/write-launch-evidence.js`가 현재 워크트리 기준으로 재작성합니다.

## 자동 점검 결과

- 생성 시각 UTC: `2026-06-12T05:18:33.807Z`
- 생성 시각 KST: `2026-06-12T14:18:33+09:00`
- 실행 경로: `/Users/hantaeheuk/Documents/괄사`
- 앱 빌드: `20260612a06`
- 서비스워커 캐시: `gwalsa-routine-v20260612a06`
- 웹/PWA 상태: `conditional-go`
- 스토어 제출 상태: `external-blocked`

## 실행한 게이트

- `node --check app.js`
- `node --check service-worker.js`
- `./scripts/launch-precheck.sh`
- `./scripts/run-functional-smoke.sh`
- `./scripts/run-real-face-model-check.sh`
- `./scripts/generate-launch-screenshots.sh`
- `./scripts/launch-readiness-audit.sh`
- `./scripts/launch-blocker-report.sh`
- `./scripts/package-web-release.sh`
- `./scripts/verify-web-release.sh`
- `./scripts/package-store-assets.sh`
- `./scripts/verify-store-assets.sh`

## 게이트 결과

- 스크린샷 파일: `28`
- 페이지 에러: `0`
- 콘솔 에러: `0`
- 가로 오버플로우 행: `0`
- 고위험 문구 행: `0`
- 서비스워커 준비: `true`
- 스크린샷 게이트: `passed`
- 스크린샷 게이트 실패: `[]`
- 오프라인 리로드: `ok`
- 오프라인 지원 페이지: `ok`
- 오프라인 공개 페이지: `{"privacy-policy.html":"ok","terms-disclaimer.html":"ok","support.html":"ok"}`
- 정책 버튼 라우팅: `./public/privacy-policy.html`, `./public/terms-disclaimer.html`, `./public/support.html`

## 기능 Smoke 결과

- 상태: `passed`
- 체크: `manualLog, backup, faceCamera, faceGraphicUpload, faceGuide`
- fake camera 차단: `passed`
- fake camera 안내: `이 화면은 브라우저 테스트 카메라입니다. 실제 휴대폰 카메라 또는 사진 업로드로 확인해 주세요.`
- 투명 그래픽 업로드 차단: `passed`
- 투명 그래픽 안내: `동선 기준이 약한 이미지입니다. 투명 배경이나 그래픽 대신 밝은 정면 사진으로 다시 업로드해 주세요.`
- 참고 시각화 렌더: `passed`
- 참고 시각화 증적: `output/playwright/20260608-functional-smoke/face-simulation-card.png`
- 실패: `[]`
- 페이지 에러: `0`
- 콘솔 에러: `0`

## 운영 모드 MediaPipe 감지 결과

- 상태: `passed`
- provider: `mediapipe`
- detectorSource: `real`
- source: `upload-landmark`
- referenceOnly: `false`
- landmarkCount: `478`
- pointCount: `58`
- confidence: `82`
- reference 전역 우회 차단: `passed`
- 실감지 증적: `output/playwright/20260610-real-model-check/after-real-upload.png`
- 실패: `[]`
- 페이지 에러: `0`
- 콘솔 에러: `0`

## 최신 릴리스 패키지

- 패키지: `gwalsa-web-pwa-20260612-141823`
- zip: `output/release/gwalsa-web-pwa-20260612-141823.zip`
- sha256: `a216f6a041f4e8b38fe03fb3158652a8f083d9558feee819054999a36b508ec2`
- manifest: `output/release/gwalsa-web-pwa-20260612-141823/release/release-manifest.json`

## 최신 스토어 에셋 패키지

- 패키지: `gwalsa-store-assets-20260612-141832`
- zip: `output/store-assets/gwalsa-store-assets-20260612-141832.zip`
- sha256: `39112e3c05467b1739a9baf1977bd8ef5ded3df3d69fb053cae676e859841927`

## 스크린샷 증적

- `output/playwright/20260608-launch-demo/completion-390.png`
- `output/playwright/20260608-launch-demo/completion-430.png`
- `output/playwright/20260608-launch-demo/desktop/screen-face-routine-1280.png`
- `output/playwright/20260608-launch-demo/desktop/screen-log-1280.png`
- `output/playwright/20260608-launch-demo/desktop/screen-routines-1280.png`
- `output/playwright/20260608-launch-demo/desktop/screen-settings-1280.png`
- `output/playwright/20260608-launch-demo/desktop/screen-today-1280.png`
- `output/playwright/20260608-launch-demo/public-privacy-390.png`
- `output/playwright/20260608-launch-demo/public-privacy-offline-390.png`
- `output/playwright/20260608-launch-demo/public-support-390.png`
- `output/playwright/20260608-launch-demo/public-support-offline-390.png`
- `output/playwright/20260608-launch-demo/public-terms-390.png`
- `output/playwright/20260608-launch-demo/public-terms-offline-390.png`
- `output/playwright/20260608-launch-demo/screen-face-complete-390.png`
- `output/playwright/20260608-launch-demo/screen-face-guide-390.png`
- `output/playwright/20260608-launch-demo/screen-face-routine-390.png`
- `output/playwright/20260608-launch-demo/screen-face-scan-390.png`
- `output/playwright/20260608-launch-demo/screen-log-390.png`
- `output/playwright/20260608-launch-demo/screen-log-430.png`
- `output/playwright/20260608-launch-demo/screen-offline-reload-390.png`
- `output/playwright/20260608-launch-demo/screen-onboarding-390.png`
- `output/playwright/20260608-launch-demo/screen-onboarding-430.png`
- `output/playwright/20260608-launch-demo/screen-routines-390.png`
- `output/playwright/20260608-launch-demo/screen-routines-430.png`
- `output/playwright/20260608-launch-demo/screen-settings-390.png`
- `output/playwright/20260608-launch-demo/screen-settings-430.png`
- `output/playwright/20260608-launch-demo/screen-today-390.png`
- `output/playwright/20260608-launch-demo/screen-today-430.png`

## 남은 외부 제출 항목

입력 원장: `docs/external-store-inputs.md`

- Hosted public privacy, terms, and support URLs
- Developer/company name and support or privacy contact
- Apps in Toss appName, icon URL, category, developer/contact fields, and public URLs
- Apps in Toss logo 600x600 PNG, thumbnail 1932x828 PNG, and screenshot assets
- Run official Apps in Toss install/init/build flow and upload the final .ait bundle
- Run at least one Apps in Toss sandbox/Toss app test before requesting review
- Final check against current Apps in Toss non-game guide and service open policy
