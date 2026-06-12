# Submission Packages

작성 기준: 2026-06-10 KST

## Scope

이 폴더는 괄사 루틴의 제출, 제휴, 검토용 자료를 묶어 관리합니다. 모든 문서는 앱을 **일반 뷰티 셀프케어 PWA** 범위로만 설명합니다.

공통 원칙:

- 의료, 진단, 치료, 질병 예방, 결과 보장으로 읽히는 표현은 사용하지 않는다.
- 얼굴 참고 가이드, AI 스타일 시각화, MediaPipe 언급은 참고 동선 표시와 뷰티 셀프케어 보조 범위로 제한한다.
- mock/reference 경로는 QA 전용이며 production 성공 기준으로 쓰지 않는다.
- 기준 production 성공 증적은 real MediaPipe Face Landmarker 흐름의 `referenceOnly=false`, `detectorSource=real`, `source=upload-landmark` 결과다.
- 기존 릴리스와 스토어 산출물은 이 제출 문서 작업에서 재생성하지 않는다.

## Packages

| Package | Purpose | Status |
| --- | --- | --- |
| `common/` | 모든 제출처에 공통으로 쓰는 제품, QA, 개인정보, 금지 표현 기준 | Draft complete |
| `seoul-beauty-week/` | 서울뷰티위크용 뷰티테크, 셀프케어, 로컬 개인정보 보호 제출 초안 | Draft complete |
| `apps-in-toss/` | 앱인토스 비게임 미니앱 포팅, 수익화, QA 검토 초안 | Draft complete |
| `ict-smart-device/` | ICT 스마트 디바이스 제출용 온디바이스/브라우저 로컬 참고 동선 가이드 초안 | Draft complete |

## Shared Build Basis

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Web zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` |
| Web zip SHA-256 | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| Store assets zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` |
| Store assets zip SHA-256 | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |
| Latest QA basis | `output/playwright/20260610-real-model-check/metrics.json` |
| QA status | `passed` |

## External Information

Use `docs/submissions/external-info-template.md` before final submission. It separates owner-provided facts from repository evidence, including official notice links, organizer requirements, company identity, contact details, hosted privacy/support URLs, and submission-day policy checks.

## Verification

Run the submission package check after editing these documents:

```sh
NODE_BIN="${NODE_BIN:-$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node}"
"$NODE_BIN" scripts/verify-submission-package.js
```

The script checks required files, baseline artifact hashes, latest real-model QA evidence, ICT mock/reference boundaries, and obvious risky claim lines in `docs/submissions/**/*.md`.
