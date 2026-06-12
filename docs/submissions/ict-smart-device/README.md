# ICT Smart Device Submission Packet

작성 기준: 2026-06-10 KST

## Packet Scope

이 패키지는 ICT 스마트 디바이스 계열 제출 또는 기술 검토 자료를 준비하기 위한 초안입니다. 제품 설명은 **일반 뷰티 셀프케어 PWA** 범위로만 유지합니다.

핵심 메시지:

- 온디바이스/브라우저 로컬 중심의 뷰티 셀프케어 PWA
- MediaPipe Face Landmarker 기반 선택형 참고 동선 가이드
- 서버 계정 없이 현재 브라우저 안에서 루틴 기록과 설정 관리
- production 성공 기준은 real MediaPipe 흐름이며, mock/reference는 QA 전용

## Files

- `submission-brief.md`: ICT 제출용 제품 설명과 기술 포지셔닝
- `technical-readiness.md`: 브라우저 로컬 처리, 모델/런타임, 디바이스 데모 준비
- `privacy-safety-summary.md`: 로컬 데이터 처리, 권한, 얼굴 참고 가이드 경계
- `qa-evidence.md`: 기준 빌드, 산출물, real-model QA 증적
- `copy-claims-checklist.md`: 제출 문구 검수 체크리스트
- `submission-assets-checklist.md`: 제출 전 외부 준비물과 데모 자산 체크리스트

공통 기준 문서:

- `docs/submissions/common/fact-sheet.md`
- `docs/submissions/common/qa-summary.md`
- `docs/submissions/common/privacy-safety-summary.md`
- `docs/submissions/common/forbidden-claims-checklist.md`

## Official References

ICT 스마트 디바이스 제출처의 공식 공고, 접수 폼, 파일 규격, 일정은 아직 이 저장소에 고정하지 않았습니다. 제출자는 `docs/submissions/external-info-template.md`에 공식 링크와 요구 정보를 채운 뒤, 제출 당일 다시 확인해야 합니다.

## Technical Fit

- Current app is a static PWA with HTML, CSS, and vanilla JavaScript.
- Current implementation uses a local Face Landmarker model file and browser-executed MediaPipe Tasks Vision runtime.
- Face guide camera/upload flow runs only after user action.
- The current app has no backend, account system, analytics SDK, advertising SDK, or payment SDK.
- Fully offline face scanning would require vendoring the MediaPipe Tasks Vision JS/WASM runtime instead of loading it from CDN.

## Submission Boundaries

- 이 패키지는 제출 문구와 증적 정리용이며, 실제 접수 완료를 뜻하지 않습니다.
- 회사명, 대표자, 사업자 정보, 담당자 연락처, 제출처 요구 양식, 디바이스 시연 계획은 소유자가 입력해야 합니다.
- 앱스토어 제출 항목은 별도로 남아 있습니다: hosted privacy/support URL, native wrapper, signing, store console forms.
- 기존 릴리스와 스토어 산출물은 재생성하지 않았습니다.

## Copy Guardrail

사용 가능한 방향:

- 일반 뷰티 셀프케어 PWA
- 온디바이스/브라우저 로컬 참고 동선 가이드
- MediaPipe Face Landmarker 기반 참고 동선 표시
- 사용자가 직접 선택한 카메라/업로드 흐름
- 데이터는 현재 브라우저에 저장

피해야 할 방향:

- 외모 변화 약속
- 전후 변화 단정 표현
- 얼굴 상태 평가처럼 읽히는 설명
- 의료, 진단, 치료, 질병 예방, 결과 보장 표현
- mock/reference QA 경로를 production 성공 기준처럼 설명하는 문구
