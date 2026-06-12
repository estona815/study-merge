# Seoul Beauty Week QA Evidence

작성 기준: 2026-06-10 KST

## Basis

This package uses the existing common submission basis and does not regenerate release or store assets.

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
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
- Point count used by the app: `58`
- Routine title returned: `아침 컨디션 참고 루틴`

Release traceability:

- Packaged evidence path: `release/evidence/output/playwright/20260610-real-model-check/metrics.json`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

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

## Seoul Beauty Week QA Caveats

- Event booth demo should be checked on the exact device, browser, and network used on site.
- Public demo QR should be tested before printing.
- If the demo adds external forms, analytics, remote storage, or a different hosting path, update privacy and QA evidence.
- If a native wrapper is introduced later, app store submission remains external-blocked until hosted privacy/support URLs, signing, wrapper behavior, and store forms are complete.
