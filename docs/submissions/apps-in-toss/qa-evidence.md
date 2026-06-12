# Apps In Toss QA Evidence

작성 기준: 2026-06-10 KST

## Current PWA Evidence

This file records current PWA evidence only. Apps in Toss sandbox and review QA still need to be run after porting.

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Web release size | `4.3M` extracted, `3.4M` zip |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| Latest PWA QA status | `passed` |

## Current Release Artifacts

| Artifact | Path | SHA-256 |
| --- | --- | --- |
| Web/PWA zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store assets zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |

## Latest Production Model Check

Source: `output/playwright/20260610-real-model-check/metrics.json`

- Generated: `2026-06-10T00:59:12.754Z`
- Status: `passed`
- Page errors: none
- Launch URL: no reference guide query
- Real upload check: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Point count used by the app: `58`
- Routine title returned: `아침 컨디션 참고 루틴`

Release traceability:

- Packaged evidence path: `release/evidence/output/playwright/20260610-real-model-check/metrics.json`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## Apps In Toss QA Still Needed

| Check | Status |
| --- | --- |
| Create final Apps in Toss build | To do |
| Upload final miniapp bundle | To do |
| Run sandbox open test | To do |
| Complete 3분 루틴 in miniapp runtime | To do |
| Verify back and close behavior | To do |
| Verify local record persistence after reopen | To do |
| Verify delete/reset controls | To do |
| Verify privacy/support hosted links | To do |
| Verify camera/upload permission handling | To do |
| Verify no blocked navigation or CORS issue | To do |
| Verify bundle size against current policy | To do |
| Run monetization QA if IAP, subscription, or ads are added | To do |

## Porting Caveats

- Current PWA QA does not prove Apps in Toss runtime approval.
- Service worker, notification, camera, upload, and local storage behavior must be checked in the target miniapp environment.
- If Apps in Toss SDK/API, monetization, push, or server features are added, the QA scope expands.
- App store items remain separate: hosted privacy/support URLs, native wrapper, signing, and store console forms.
