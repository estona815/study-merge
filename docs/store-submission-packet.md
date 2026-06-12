# Store Submission Packet

This file lists the launch-ready local assets and the store-only items that still need external confirmation.

## Current Web/PWA Build

- App name: 사괄
- Build: `20260612a05`
- Service worker cache: `gwalsa-routine-v20260612a05`
- Privacy page: `public/privacy-policy.html`
- Terms page: `public/terms-disclaimer.html`
- Support page: `public/support.html`
- Manifest: `manifest.json`
- Apps in Toss config draft: `granite.config.ts`
- Apps in Toss external TODO: `TOSS_INAPP_RELEASE_TODO.md`

## Icons

- `assets/icon.svg`
- `assets/icon-192.png`
- `assets/icon-512.png`
- `assets/apple-touch-icon.png`

Apps in Toss console assets still needed:

- Logo: 600x600 PNG, no transparent background
- Thumbnail: 1932x828 PNG
- Screenshots: vertical 636x1048 PNG at least 3 images, or horizontal 1504x741 PNG at least 1 image

## Screenshot Evidence

Generate or refresh screenshots with:

```bash
./scripts/generate-launch-screenshots.sh
```

Current evidence folder:

- `output/playwright/20260608-launch-demo/README.md`
- `output/playwright/20260608-launch-demo/metrics.json`
- `output/playwright/20260608-launch-demo/screen-onboarding-390.png`
- `output/playwright/20260608-launch-demo/screen-today-390.png`
- `output/playwright/20260608-launch-demo/screen-routines-390.png`
- `output/playwright/20260608-launch-demo/screen-log-390.png`
- `output/playwright/20260608-launch-demo/screen-settings-390.png`
- `output/playwright/20260608-launch-demo/screen-face-routine-390.png`
- `output/playwright/20260608-launch-demo/screen-face-guide-390.png`
- `output/playwright/20260608-launch-demo/screen-face-complete-390.png`
- `output/playwright/20260608-launch-demo/desktop/screen-today-1280.png`

## Verification Commands

```bash
./scripts/final-launch-gate.sh
```

Or run the steps individually:

```bash
./scripts/launch-precheck.sh
./scripts/launch-readiness-audit.sh
./scripts/launch-blocker-report.sh
./scripts/run-functional-smoke.sh
./scripts/run-real-face-model-check.sh
./scripts/package-web-release.sh
./scripts/verify-web-release.sh
./scripts/package-store-assets.sh
./scripts/verify-store-assets.sh
```

Latest local evidence:

- Syntax checks passed.
- Manifest and icon checks passed.
- Privacy, terms, and support pages are reachable over local HTTP.
- Screenshot generator covers core app screens, public privacy/terms/support pages, and offline public-page fallback.
- Functional smoke covers manual log save, light backup export, backup preview/merge/undo, and face guide upload completion persistence.
- Production MediaPipe smoke covers a no-reference launch URL and requires provider `mediapipe`, detectorSource `real`, source `upload-landmark`, and `referenceOnly=false`.
- MediaPipe Tasks Vision JS/WASM runtime is vendored under `assets/vendor/mediapipe/tasks-vision/0.10.35/` for the current build.
- Store asset package collects curated screenshots, icons, metadata drafts, privacy answers, external input checklist, and generated `metadata/review-evidence.md` under `output/store-assets/`.
- Release zip verifier rechecks the extracted `web/` root over HTTP, packaged smoke evidence JSON, manifest install fields, and service worker offline fallback for privacy, terms, and support pages.
- Browser metrics reported 0 page errors, 0 console errors, 0 horizontal overflow rows, and 0 tracked high-risk copy rows.
- Screenshot generation fails the launch gate if page errors, console errors, horizontal overflow, high-risk copy rows, service worker readiness, app offline reload, or public-page offline fallback regress.
- Service worker was ready and offline reload returned the app.
- Launch blocker report keeps repo-solvable blockers separate from external store submission blockers.

## Privacy And Policy Answer Drafts

- Store privacy answers draft: `docs/store-privacy-answers.md`
- External submission inputs: `docs/external-store-inputs.md`
- Official Apple/Google policy links are included there and should be rechecked immediately before submission.
- Creative launch visuals and screenshot/caption direction: `docs/creative-production-launch-visuals.md`

## Store-Only Items Still Needed

- Hosted, stable privacy policy URL.
- Hosted, stable terms/disclaimer URL.
- Hosted, stable support URL plus support contact channel.
- Native wrapper, bundle/package id, signing, app version/build number, and release track setup if submitting to Apple App Store or Google Play.
- Apps in Toss logo, thumbnail, screenshot assets in the current console-required sizes.
- Store-specific screenshot sizes and metadata fields if this package is reused for native app stores. Verify the latest official Apple and Google requirements before submission.
- Store privacy labels/Data Safety answers. Verify against the latest official Apple and Google policy docs before submission.
- Google Play Health apps declaration. Keep the app positioned as non-medical beauty self-care unless the final wrapper or console category requires a different declaration.
- Permission strings for camera, photo/file access, and notifications in the native wrapper.
- Final owner-provided fields in `docs/external-store-inputs.md`.
- Apps in Toss console fields and sandbox test evidence listed in `TOSS_INAPP_RELEASE_TODO.md`.

## Suggested Store Permission Copy

Camera:
참고 가이드에서 동선을 화면 위에 표시하기 위해 사용합니다. 이미지는 기기 안에서 처리되며 원본 카메라 이미지는 기록이나 백업에 저장하지 않습니다.

Photos/files:
전후 사진 기록 또는 참고 동선용 이미지를 사용자가 직접 선택할 때만 사용합니다. 전후 사진은 브라우저 안에서 압축되어 로컬 저장됩니다.

Notifications:
사용자가 설정한 괄사 루틴 리마인더를 보내기 위해 사용합니다. 알림은 사용자가 직접 켜거나 끌 수 있습니다.
