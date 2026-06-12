# ICT Smart Device Technical Readiness

작성 기준: 2026-06-10 KST

## Current Technical Basis

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
| App shape | Static PWA: HTML, CSS, vanilla JavaScript |
| Main storage | Browser `localStorage` |
| Face guide model | `assets/models/face-landmarker/face-landmarker.task` |
| Face guide runtime | MediaPipe Tasks Vision web runtime, loaded on demand |
| Latest production QA | `output/playwright/20260610-real-model-check/metrics.json` passed |

## Browser-Local Architecture

- The app can be served as static web files.
- Routine logs, settings, custom routines, photo notes, and reminder preferences are stored in the current browser.
- User-created backup files are exported only after user action.
- Camera/upload is optional and user initiated.
- The face guide uses browser-executed landmark detection for reference route display.
- The current app does not include backend, account, analytics, advertising, payment, or cloud-sync SDKs.

## Face Guide Boundary

Production success must be described with the real MediaPipe path:

- Launch URL has no reference guide query.
- Real upload check is `passed`.
- Provider is `mediapipe`.
- Detector source is `real`.
- Source is `upload-landmark`.
- `referenceOnly=false`.
- `containsMock=false`.

QA-only reference paths:

- `?referenceGuide=1`
- `?faceGuideMode=reference`

These QA paths can help capture deterministic screens or test UI persistence, but they are not production success criteria and should not be presented as real model evidence.

## Device Demo Checklist

| Check | Status |
| --- | --- |
| Target device and browser selected | Owner to fill |
| Demo URL, local server URL, or QR target confirmed | Owner to fill |
| Network state confirmed for the demo venue | Owner to fill |
| MediaPipe runtime can load in the target environment | To verify |
| Face Landmarker model file is reachable | To verify |
| Camera permission prompt works on target device | To verify |
| Upload fallback works if camera is blocked | To verify |
| Timer flow remains usable if face guide is skipped | To verify |
| Local delete/reset controls are visible | To verify |
| Hosted privacy/support links are reachable, if required | Owner to fill |

## Offline And Packaging Notes

- The service worker caches the static app shell for PWA distribution.
- The Face Landmarker model file is included in the web package.
- The MediaPipe Tasks Vision JS/WASM runtime is currently loaded from CDN version `0.10.35`.
- For a fully offline device demonstration, vendor the MediaPipe Tasks Vision JS/WASM runtime into app assets and rerun QA before submission.
- If a native wrapper or dedicated hardware demo is added, document permissions, SDKs, signing, and data flow before final submission.

## Risks To Recheck Before Submission

| Risk | Mitigation |
| --- | --- |
| Target venue blocks CDN runtime | Prepare a vendored runtime build or confirm network allowlist |
| Camera permission differs by browser | Keep upload fallback and timer-only demo path ready |
| Organizer requires a native package | Treat native wrapper, signing, and store forms as external items |
| Demo script overstates the face guide | Use reference route display wording only |
| New SDK changes data handling | Update privacy, QA, and copy checklist before submitting |
