# ICT Smart Device Validation Evidence

작성 기준: 2026-06-10 KST

## Build Identity

| Field | Value |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| QA status | `passed` |

## Artifact Hashes

| Artifact | Path | SHA-256 |
| --- | --- | --- |
| Web/PWA release zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store asset zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |
| Packaged real-model evidence | `release/evidence/output/playwright/20260610-real-model-check/metrics.json` | `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a` |

## Real MediaPipe Model Check

Source: `output/playwright/20260610-real-model-check/metrics.json`

- Generated: `2026-06-10T00:59:12.754Z`
- Status: `passed`
- Page errors: none
- Real upload check: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Contains mock marker: `false`
- Exact evidence tuple: `provider=mediapipe`, `detectorSource=real`, `source=upload-landmark`, `referenceOnly=false`, `containsMock=false`
- Raw landmark count: `478`
- App point count: `58`
- Source confidence shown in app: `82`

## Mock/Reference Boundary

mock/reference is QA-only and is not production success evidence. Production evidence must use a normal launch URL without reference guide query and must show `referenceOnly=false`.

## Remaining Target-Environment Checks

- Exact target device and browser
- Official venue/network access
- MediaPipe runtime loading on target network
- Camera permission prompt
- Upload fallback
- Timer and record flow with face guide skipped
- Hosted privacy/support URLs, if required
