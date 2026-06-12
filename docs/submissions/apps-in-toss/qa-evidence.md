# Apps In Toss QA Evidence

작성 기준: 2026-06-10 KST

## Current PWA Evidence

This file records current PWA evidence only. Apps in Toss sandbox and review QA still need to be run after porting.

| 항목 | 값 |
| --- | --- |
| App build | `20260612a06` |
| Service worker cache | `gwalsa-routine-v20260612a06` |
| Web release package | `gwalsa-web-pwa-20260612-141823` |
| Web release size | `37M` extracted, `14M` zip |
| Store asset package | `gwalsa-store-assets-20260612-141832` |
| Apps in Toss image package | `gwalsa-apps-in-toss-submission-20260612-141845` |
| Latest PWA QA status | `passed` |

## Current Release Artifacts

| Artifact | Path | SHA-256 |
| --- | --- | --- |
| Web/PWA zip | `output/release/gwalsa-web-pwa-20260612-141823.zip` | `a216f6a041f4e8b38fe03fb3158652a8f083d9558feee819054999a36b508ec2` |
| Store assets zip | `output/store-assets/gwalsa-store-assets-20260612-141832.zip` | `39112e3c05467b1739a9baf1977bd8ef5ded3df3d69fb053cae676e859841927` |
| Apps in Toss image zip | `output/apps-in-toss/gwalsa-apps-in-toss-submission-20260612-141845.zip` | `f76bc050dc6e94e6e5c011918385b258907455eab0e2fef4358cfcfe5c1b61fb` |

## Latest Production Model Check

Source: `output/playwright/20260610-real-model-check/metrics.json`

- Generated: `2026-06-12T05:17:33.708Z`
- Status: `passed`
- Page errors: none
- Launch URL: no reference guide query
- Real upload check: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Point count used by the app: `58`
- Routine title returned: `사과 리셋 참고 루틴`

Release traceability:

- Packaged evidence path: `release/evidence/output/playwright/20260610-real-model-check/metrics.json`
- Packaged evidence SHA-256: `0674dc21aabbcc2d5465d996094f6340cc4430aa157281b96de910c034fb041a`

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
