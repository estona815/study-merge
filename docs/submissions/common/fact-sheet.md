# Common Submission Fact Sheet

작성 기준: 2026-06-10 KST

## Product Positioning

- 앱 이름: 괄사 루틴
- 앱 유형: 일반 뷰티 셀프케어 PWA
- 주요 용도: 괄사 루틴 안내, 단계별 타이머, 로컬 기록, 전후 사진 메모, 백업/복원, 알림 리마인더
- 사용자 데이터 처리 방향: 서버 계정 없이 현재 브라우저 안에서 저장 및 관리
- 검수용 설명 원칙: 일반 뷰티 루틴과 셀프케어 참고용 앱으로 설명한다.
- 표현 제한: 의료 조언, 진단, 치료, 질병 예방, 결과 보장으로 읽히는 문구를 제출 자료에 사용하지 않는다.

## Build Identity

| 항목 | 값 |
| --- | --- |
| App build | `20260612a06` |
| Service worker cache | `gwalsa-routine-v20260612a06` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Web release generated | `2026-06-10T10:01:48+0900` |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| Store asset generated | `2026-06-10T10:01:55+0900` |

## Release Artifacts

| Artifact | Path | SHA-256 |
| --- | --- | --- |
| Web/PWA zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store assets zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |
| Web release manifest | `output/release/gwalsa-web-pwa-20260610-100147/release/release-manifest.json` | Manifest contains per-file SHA-256 entries. |
| Store asset manifest | `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/store-asset-manifest.json` | Listed in `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/SHA256SUMS`. |

## Packaged Web Scope

- Deploy root inside release zip: `web/`
- Main app files: `web/index.html`, `web/styles.css`, `web/app.js`, `web/manifest.json`, `web/service-worker.js`
- Public policy pages: `web/public/privacy-policy.html`, `web/public/terms-disclaimer.html`, `web/public/support.html`
- Icons: `web/assets/icon.svg`, `web/assets/icon-192.png`, `web/assets/icon-512.png`, `web/assets/apple-touch-icon.png`
- Face guide model file: `web/assets/models/face-landmarker/face-landmarker.task`
- Face model SHA-256: `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff`

## Store Asset Scope

- Package status: `review-assets-ready`
- Screenshots: mobile, desktop, and public policy page captures
- Icons: SVG, 192 px PNG, 512 px PNG, Apple touch icon
- Metadata drafts: privacy draft, terms draft, store listing draft, store privacy answers, external input checklist, creative launch visuals, production review, review evidence

## Latest QA Basis

- Latest production model check: `output/playwright/20260610-real-model-check/metrics.json`
- Result: `passed`
- Generated: `2026-06-10T00:59:12.754Z`
- Verified production path: no reference guide query, real MediaPipe upload flow, `referenceOnly=false`, `detectorSource=real`, `source=upload-landmark`
- Packaged evidence SHA-256 in web release: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## Submission Boundaries

- The current repository can provide the PWA build, local policy page drafts, screenshots, metadata drafts, QA evidence, and SHA-256 traceability.
- External submission items still required before app store submission: hosted privacy/support URLs, support contact, native wrapper, bundle or package ID, signing, store console forms, and same-day policy recheck.
