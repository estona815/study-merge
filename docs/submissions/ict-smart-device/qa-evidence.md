# ICT Smart Device QA Evidence

작성 기준: 2026-06-10 KST

## Basis

This package uses the existing common submission basis and does not regenerate release or store assets.

| 항목 | 값 |
| --- | --- |
| App build | `20260612a06` |
| Service worker cache | `gwalsa-routine-v20260612a06` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Web release size | `4.3M` extracted, `3.4M` zip |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| Store asset size | `4.1M` extracted, `3.9M` zip |
| Latest QA status | `passed` |

## Release Artifacts

| Artifact | Path | SHA-256 |
| --- | --- | --- |
| Web/PWA zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store assets zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |
| Web release manifest | `output/release/gwalsa-web-pwa-20260610-100147/release/release-manifest.json` | Per-file SHA-256 entries |
| Store asset manifest | `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/store-asset-manifest.json` | Listed in package SHA inventory |

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
- Contains mock marker: `false`
- Point count used by the app: `58`
- Raw landmark count: `478`
- Routine title returned: `아침 컨디션 참고 루틴`

Release traceability:

- Packaged evidence path: `release/evidence/output/playwright/20260610-real-model-check/metrics.json`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## Mock/Reference Boundary

mock/reference evidence is QA-only. It can be used to check UI rendering or deterministic screenshots, but it must not be submitted as production face guide success evidence.

Allowed QA-only entry points:

- `?referenceGuide=1`
- `?faceGuideMode=reference`

Production success evidence must use a normal launch URL without reference-guide query parameters and must show:

- `provider=mediapipe`
- `detectorSource=real`
- `source=upload-landmark`
- `referenceOnly=false`
- `containsMock=false`

## Store Asset Evidence

Store asset package includes:

- Mobile screenshots
- Desktop screenshots
- Public privacy, terms, and support page screenshots
- Icons
- Metadata drafts
- Review evidence

Source package:

- `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/README_STORE_ASSETS.md`

## ICT Smart Device QA Still Needed

| Check | Status |
| --- | --- |
| Confirm official submission format and required QA evidence | Owner to fill |
| Run demo on exact target device and browser | To do |
| Verify camera permission and upload fallback on target device | To do |
| Verify MediaPipe runtime loading on target network | To do |
| Verify timer and local record flow without face guide | To do |
| Verify local delete/reset controls on target device | To do |
| Verify hosted privacy/support URLs, if required | Owner to fill |
| Verify no new SDK, server API, or remote image path was added | To do |

## QA Caveats

- Current PWA QA does not prove approval by an ICT program or device review process.
- Service worker, camera, upload, local storage, and CDN runtime behavior must be checked in the exact demo environment.
- If the demo adds external forms, analytics, remote storage, device telemetry, or a different hosting path, update privacy and QA evidence.
- If a native wrapper is introduced later, app store submission remains external-blocked until hosted privacy/support URLs, signing, wrapper behavior, and store forms are complete.
