# ICT Smart Device Technical Proposal

작성 기준: 2026-06-10 KST

## 1. Project Overview

괄사 루틴은 일반 뷰티 셀프케어 사용자를 위한 정적 Web/PWA입니다. 루틴 안내, 단계별 타이머, 로컬 기록, 사진 메모, 백업/복원, 리마인더를 제공하며, 선택형 얼굴 참고 가이드는 MediaPipe Face Landmarker 기반으로 참고 동선을 표시합니다.

현재 제출 기준 빌드는 `20260612a06`입니다. 서비스 워커 캐시는 `gwalsa-routine-v20260612a06`이며, 최신 release package와 QA evidence가 저장소에 고정되어 있습니다.

## 2. Problem Definition

일상 셀프케어 루틴은 순서, 시간, 기록 관리가 함께 필요합니다. 사용자가 모바일 브라우저에서 바로 시작할 수 있고, 복잡한 계정 없이 현재 브라우저 안에서 기록을 관리할 수 있는 도구가 있으면 데모와 사용 흐름이 단순해집니다.

괄사 루틴은 이 흐름을 루틴 선택, 타이머, 완료 기록, 선택형 참고 동선 표시로 묶어 제공합니다.

## 3. Service Goal

- 사용자가 짧은 셀프케어 루틴을 단계별로 따라갈 수 있게 한다.
- 기록과 설정을 현재 브라우저 중심으로 관리한다.
- 얼굴 참고 가이드를 사용자가 직접 선택한 경우에만 실행한다.
- 공모전 데모에서 QR 또는 브라우저 URL로 빠르게 실행할 수 있게 한다.
- mock/reference QA 경로와 production MediaPipe 성공 기준을 분리한다.

## 4. User Scenario

1. 사용자가 PWA를 열고 루틴을 선택합니다.
2. 단계별 타이머를 보며 루틴을 진행합니다.
3. 필요한 경우 얼굴 참고 가이드를 열고 카메라 또는 업로드를 선택합니다.
4. 앱은 브라우저 안에서 참고 동선을 표시합니다.
5. 사용자는 완료 기록과 메모를 남기고, 필요하면 백업 또는 삭제를 실행합니다.

## 5. Main Features

- 오늘 화면: 루틴 시작과 진행 상태 확인
- 루틴 화면: 기본 루틴과 커스텀 루틴 관리
- 타이머: 단계별 시간 안내와 완료 패널
- 기록: 완료 로그와 사진 메모
- 설정: 압력/기본값/리마인더/보관/정책/초기화 관리
- 얼굴 참고 가이드: MediaPipe Face Landmarker 기반 참고 동선 표시
- 백업/복원: 사용자가 직접 생성하는 JSON 백업

## 6. System Structure

The current app is a static frontend package:

- `index.html`: app shell
- `styles.css`: responsive UI styling
- `app.js`: routine, storage, face guide, backup, and UI logic
- `manifest.json`: PWA install metadata
- `service-worker.js`: app shell and public page cache
- `assets/models/face-landmarker/face-landmarker.task`: local Face Landmarker model
- `public/`: privacy, terms, and support page drafts

No backend, account system, analytics SDK, advertising SDK, payment SDK, or cloud sync SDK is included in the current implementation basis.

## 7. PWA Structure

The PWA can be distributed by uploading the release `web/` folder to a static hosting root. The manifest declares app name, icons, scope, start URL, theme color, and standalone display. The service worker caches the static app shell and public policy pages for local fallback behavior.

Current release package:

- `output/release/gwalsa-web-pwa-20260610-100147.zip`
- SHA-256: `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0`

## 8. MediaPipe Face Landmarker Usage

The face guide is optional and user initiated. It uses MediaPipe Face Landmarker to map user-selected camera/upload input to a reference route overlay. The feature is described only as reference route display for general beauty self-care.

Production success criteria:

- normal launch URL with no reference guide query
- `provider=mediapipe`
- `detectorSource=real`
- `source=upload-landmark`
- `referenceOnly=false`
- `containsMock=false`

QA-only paths:

- `?referenceGuide=1`
- `?faceGuideMode=reference`

These reference paths are useful for deterministic UI checks, but they are not production success evidence.

## 9. Local Data Processing

Routine logs, settings, custom routines, photo notes, and reminder preferences are stored in the current browser. User-created backups are generated only after explicit user action. Light backup excludes photos, while full backup may include compressed photo notes.

Camera/upload images used by the face guide are processed for reference route display in the browser. The current documentation does not describe remote image processing or persistent face templates.

## 10. Privacy Structure

Current implementation basis:

- Backend server: none
- Account system: none
- Analytics SDK: none
- Advertising SDK: none
- Payment SDK: none
- Primary storage: browser `localStorage`
- User controls: backup, light backup, reset, delete, permission revocation through browser/device settings

Hosted privacy/support URLs are still required before public distribution. Current files are local drafts only.

## 11. QA And Validation

Latest real-model QA:

- Source: `output/playwright/20260610-real-model-check/metrics.json`
- Generated: `2026-06-10T00:59:12.754Z`
- Status: `passed`
- Page errors: none
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Contains mock marker: `false`
- Raw landmark count: `478`
- App point count: `58`

Store asset package:

- `output/store-assets/gwalsa-store-assets-20260610-100154.zip`
- SHA-256: `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4`

## 12. Current Limits

- No stable public demo URL is stored in this repository.
- Current MediaPipe Tasks Vision JS/WASM runtime is loaded from CDN version `0.10.35`; fully offline demo requires vendoring the runtime and rerunning QA.
- Official HWP/PDF application form still needs owner identity, contact, signature, and consent.
- Native wrapper, store signing, and store console forms are outside the current PWA package.
- Exact target device and browser for 공모전 demo are not confirmed.

## 13. Future Improvement Plan

- Deploy the release `web/` folder to a stable HTTPS demo URL.
- Generate and test a QR code for the exact target device/network.
- Vendor the MediaPipe Tasks Vision runtime for fully offline demonstrations.
- Run target-device QA for camera permission, upload fallback, service worker behavior, and local reset.
- Complete official application form in HWP/PDF with owner-provided details and signature.
- Document any new SDK, native wrapper, server API, or remote storage before using it in submission materials.

## 14. Business And Expansion Possibility

The current build can be evaluated as a lightweight Web/PWA demo for browser-local self-care routine guidance. Expansion can proceed through static hosting, event/demo QR distribution, miniapp review, or native wrapper review. Any future account, payment, analytics, or cloud feature requires a new data-flow and policy scope.

Do not claim user count, revenue, approval, partnership, award, or certification unless the owner provides verifiable evidence.

## 15. Submission Summary

괄사 루틴은 build `20260612a06` 기준으로 루틴 타이머, 로컬 기록, 백업/삭제, 선택형 MediaPipe Face Landmarker 기반 참고 동선 표시를 제공하는 일반 뷰티 셀프케어 PWA입니다. 제출 자료는 브라우저 로컬 처리와 사용자 제어를 중심으로 설명하며, real MediaPipe QA evidence는 `referenceOnly=false` production path를 기준으로 합니다.
