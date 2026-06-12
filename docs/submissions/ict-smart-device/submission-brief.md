# ICT Smart Device Submission Brief

작성 기준: 2026-06-10 KST

## One-Line

괄사 루틴은 브라우저 로컬에서 루틴 타이머, 기록, MediaPipe Face Landmarker 기반 참고 동선 표시를 제공하는 일반 뷰티 셀프케어 PWA입니다.

## Short Description

괄사 루틴은 사용자가 직접 루틴을 고르고 단계별 타이머를 따라가며 로컬 기록을 남길 수 있는 뷰티 셀프케어 PWA입니다. 선택형 얼굴 참고 가이드는 카메라 또는 업로드 이미지 위에 참고 동선을 표시하는 보조 기능이며, 현재 구현 기준으로 서버 계정이나 원격 이미지 처리 없이 브라우저 안에서 동작합니다.

## ICT Smart Device Fit

| Theme | Submission Angle |
| --- | --- |
| 브라우저 로컬 처리 | 정적 PWA 구조, `localStorage`, service worker 캐시, 사용자 주도 백업 |
| 온디바이스 참고 가이드 | 로컬 모델 파일과 MediaPipe Face Landmarker 런타임으로 얼굴 참고 동선 표시 |
| 사용자 제어 | 카메라/업로드, 기록 저장, 백업, 삭제, 알림은 사용자가 직접 선택 |
| 데모 용이성 | QR 또는 태블릿 브라우저로 실행해 루틴, 타이머, 기록, 참고 동선 흐름 시연 |
| 제출 확장성 | 웹 배포, PWA 설치, 미니앱 포팅, 네이티브 래퍼 검토가 가능한 정적 앱 구조 |

## Product Narrative

괄사 루틴은 일상 뷰티 셀프케어를 짧고 명확한 단계로 따라갈 수 있도록 만든 PWA입니다. 사용자는 루틴을 선택하고, 타이머를 보며 진행하고, 완료 후 로컬 기록과 사진 메모를 남길 수 있습니다. 기록, 설정, 커스텀 루틴, 리마인더는 현재 브라우저를 중심으로 저장됩니다.

얼굴 참고 가이드는 사용자가 직접 카메라 또는 파일을 선택했을 때만 실행됩니다. 이 기능은 MediaPipe Face Landmarker 결과를 바탕으로 화면 위에 참고 동선을 표시하는 보조 기능입니다. 사람 식별, 지속적인 얼굴 템플릿 생성, 원격 이미지 전송을 전제로 설명하지 않습니다.

## Technical Positioning

- App shape: HTML/CSS/vanilla JavaScript static PWA
- Face guide model: `assets/models/face-landmarker/face-landmarker.task`
- Runtime basis: MediaPipe Tasks Vision web runtime, loaded on demand
- Processing boundary: user-selected camera/upload image is processed in the browser for reference route display
- Storage boundary: routine records and settings are local to the browser unless the user creates a backup file
- Production QA basis: real MediaPipe upload flow with `referenceOnly=false`
- QA-only paths: `?referenceGuide=1` and `?faceGuideMode=reference`

## Demo Flow

1. QR or local URL opens the PWA on a target browser/device.
2. User starts a short beauty self-care routine and follows the step timer.
3. User optionally opens the face guide and selects camera or upload.
4. App displays a browser-local reference route overlay.
5. User completes the routine and reviews local record controls.
6. Presenter shows backup, reset, and permission boundaries.

## Suggested Submission Copy

### 100-Character Version

브라우저 로컬에서 괄사 루틴, 타이머, 기록, MediaPipe 기반 참고 동선 표시를 제공하는 뷰티 셀프케어 PWA.

### 300-Character Version

괄사 루틴은 브라우저 안에서 실행되는 일반 뷰티 셀프케어 PWA입니다. 사용자는 루틴을 고르고 단계별 타이머를 따라가며 로컬 기록을 남길 수 있습니다. 선택형 얼굴 참고 가이드는 MediaPipe Face Landmarker 기반으로 카메라 또는 업로드 이미지 위에 참고 동선을 표시합니다.

### Pitch Version

괄사 루틴은 정적 웹 기술과 브라우저 로컬 처리를 활용해 일상 뷰티 셀프케어 경험을 가볍게 제공하는 PWA입니다. 루틴 안내, 단계별 타이머, 로컬 기록, 백업/삭제, 리마인더를 제공하며, 선택형 얼굴 참고 가이드는 사용자가 직접 선택한 이미지 위에 MediaPipe Face Landmarker 기반 참고 동선을 표시합니다. 제출 데모에서는 QR로 바로 실행해 루틴 진행부터 브라우저 로컬 참고 가이드와 기록 관리까지 짧은 흐름으로 보여줄 수 있습니다.

## Reviewer Q&A Draft

| Question | Draft Answer |
| --- | --- |
| 무엇을 하는 앱인가요? | 일반 뷰티 셀프케어 루틴을 고르고, 타이머를 따라가며, 기록을 현재 브라우저에 남기는 PWA입니다. |
| ICT 요소는 무엇인가요? | 정적 PWA, 브라우저 로컬 저장, service worker 캐시, MediaPipe Face Landmarker 기반 참고 동선 표시를 결합했습니다. |
| 얼굴 참고 가이드는 어떤 기능인가요? | 사용자가 직접 선택한 카메라/업로드 이미지 위에 참고 동선을 표시하는 보조 기능입니다. |
| mock/reference 결과도 production 기준인가요? | 아닙니다. mock/reference는 명시적 QA 쿼리에서만 사용하는 검증 보조 경로이며, production 성공 기준은 real MediaPipe 결과입니다. |
| 개인정보는 어떻게 다루나요? | 현재 구현 기준으로 서버 계정, 분석 SDK, 광고 SDK가 없고 기록은 브라우저 저장소에 남습니다. |

## Terms To Keep Consistent

- `일반 뷰티 셀프케어 PWA`
- `브라우저 로컬 처리`
- `온디바이스 참고 동선 가이드`
- `MediaPipe Face Landmarker`
- `참고 동선 표시`
- `단계별 타이머`
- `로컬 기록`
- `현재 브라우저 저장`
