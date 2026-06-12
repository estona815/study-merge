# Common Submission QA Summary

작성 기준: 2026-06-10 KST

## Build Under Review

| 항목 | 값 |
| --- | --- |
| App build | `20260612a06` |
| Service worker cache | `gwalsa-routine-v20260612a06` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Web zip SHA-256 | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| Store assets zip SHA-256 | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |

## QA Verdict

Latest QA basis: **passed**.

The current common submission package is based on the latest generated release pointer and the packaged QA evidence for build `20260612a06`. The app should be described only as a general beauty self-care PWA for routine guidance, local logs, reminders, and reference route display.

## Evidence Summary

| Evidence | Result | Source |
| --- | --- | --- |
| Production face guide model check | Passed | `output/playwright/20260610-real-model-check/metrics.json` |
| Functional smoke | Passed | `output/playwright/20260609-functional-smoke/functional-smoke-report.json` |
| Mobile and desktop implementation metrics | No horizontal overflow observed in captured routes | `output/playwright/20260610-implementation-check/metrics.json` |
| Release manifest and SHA-256 inventory | Present | `output/release/gwalsa-web-pwa-20260610-100147/release/release-manifest.json` |
| Store asset manifest and SHA-256 inventory | Present | `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/store-asset-manifest.json` |

## Latest Production Model Check

Source: `output/playwright/20260610-real-model-check/metrics.json`

- Generated: `2026-06-10T00:59:12.754Z`
- Status: `passed`
- Page errors: none
- Console errors: no failure entries; one informational TensorFlow Lite CPU delegate message was recorded
- Launch URL: no reference guide query
- Real upload check: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Raw landmark count: `478`
- Point count used by the app: `58`
- Source confidence shown in app: `82`
- Routine title returned: `아침 컨디션 참고 루틴`

Release traceability:

- Packaged evidence path: `release/evidence/output/playwright/20260610-real-model-check/metrics.json`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## Functional Smoke Check

Source: `output/playwright/20260609-functional-smoke/functional-smoke-report.json`

- Generated: `2026-06-09T09:52:03.965Z`
- Status: `passed`
- Page errors: none
- Console errors: none
- Manual log save: passed
- Light backup flow: passed
- Browser-test camera handling: passed with expected blocked state
- Weak graphic upload handling: passed with expected blocked state
- Face guide reference simulation persistence: passed

Release traceability:

- Packaged evidence path: `release/evidence/output/playwright/20260608-functional-smoke/functional-smoke-report.json`
- Packaged evidence SHA-256: `345f25c79921d73152c5ffef219b7df116940801107bdb12db76e07e7183be5f`

## Layout And Route Metrics

Source: `output/playwright/20260610-implementation-check/metrics.json`

- Mobile 390 px Today, Routines, Face Routine: horizontal overflow not observed
- Desktop 1280 px Today, Routines, Face Routine: horizontal overflow not observed
- Onboarding modal state captured on mobile and desktop
- Face guide simulation canvas rendered on mobile and desktop

## Release And Store Asset Verification

- Latest web release pointer: `output/release/latest-web-release.json`
- Latest store asset pointer: `output/store-assets/latest-store-assets.json`
- Web release package generated at `2026-06-10T10:01:48+0900`
- Store asset package generated at `2026-06-10T10:01:55+0900`
- Store asset package status: `review-assets-ready`

## QA Caveats For Submission

- Store submission itself remains dependent on external items: hosted policy/support URLs, native wrapper, signing, support contact, store console forms, and final same-day policy review.
- If a native wrapper adds analytics, crash reporting, ads, cloud sync, remote logging, or other SDK behavior, QA and privacy summaries must be updated before submission.
- Marketing, review notes, and screenshots must keep the app positioned as general beauty self-care and must not imply medical use, diagnosis, treatment, disease prevention, or guaranteed results.
