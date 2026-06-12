# Apps In Toss Miniapp Brief

작성 기준: 2026-06-10 KST

## Positioning

앱인토스용 괄사 루틴은 토스 안에서 설치 없이 바로 실행하는 3분 뷰티 셀프케어 미니앱으로 제안합니다. 사용자는 짧은 루틴을 시작하고, 단계별 타이머를 따라가며, 선택적으로 로컬 기록을 남길 수 있습니다.

## App Identity Draft

| Field | Draft |
| --- | --- |
| Miniapp name | 괄사 루틴 |
| appName | Owner to reserve in Apps in Toss console |
| Category | Non-game, beauty self-care utility |
| Customer email | Owner to provide |
| Support URL | Hosted URL required |
| Privacy URL | Hosted URL required |

## One-Line

토스 안에서 바로 여는 3분 괄사 루틴 타이머와 로컬 기록 미니앱.

## Short Description

괄사 루틴은 설치 없이 바로 시작하는 뷰티 셀프케어 미니앱입니다. 3분 루틴, 단계별 타이머, 로컬 기록, 선택형 참고 동선 표시를 간단한 흐름으로 제공합니다.

## Long Description

괄사 루틴은 토스 안에서 바로 실행할 수 있는 3분 뷰티 셀프케어 미니앱으로 포팅하는 것을 목표로 합니다. 사용자는 루틴을 시작하고 단계별 타이머를 따라가며, 완료 후 기록을 남길 수 있습니다. 선택형 참고 가이드는 사용자가 직접 카메라 또는 이미지를 선택한 경우에만 동선을 표시합니다.

현재 PWA 구현 기준으로 서버 계정, 분석 SDK, 광고 SDK, 결제 SDK는 포함되어 있지 않습니다. 앱인토스 포팅 과정에서 로그인, 결제, 광고, 푸시, 서버 API를 추가하면 개인정보와 QA 문서를 다시 갱신해야 합니다.

## 3-Minute Entry Flow

| Moment | User Experience |
| --- | --- |
| 0:00 | 미니앱 진입, 3분 루틴 시작 CTA 표시 |
| 0:10 | 사용자가 준비 확인 후 타이머 시작 |
| 0:20 | 첫 단계 안내와 남은 시간 표시 |
| 1:20 | 다음 단계로 자동 이동 또는 수동 이동 |
| 2:30 | 마무리 단계와 부드러운 종료 안내 |
| 3:00 | 완료 화면, 로컬 기록 저장 선택 |

## Feature Scope For First Port

Must have:

- 3분 루틴 첫 화면
- 단계별 타이머
- 루틴 완료 화면
- 로컬 기록 저장/삭제
- 개인정보와 지원 링크
- 앱인토스 뒤로가기/닫기 흐름 확인

Should have:

- 선택형 참고 동선 표시
- 사진 메모는 사용자가 직접 선택한 경우에만 저장
- 간단한 백업 또는 내보내기 방향 검토

Defer:

- 계정 기반 동기화
- 유료 루틴 라이브러리
- 광고 보상 흐름
- Toss API 기반 알림 또는 결제

## Search Keywords Draft

괄사, 셀프케어, 뷰티 루틴, 타이머, 기록, 데일리 루틴, 미니앱

## Review Notes Draft

이 미니앱은 일반 뷰티 셀프케어 루틴과 타이머를 제공하는 비게임 앱입니다. 얼굴 참고 가이드는 사용자가 직접 선택한 카메라 또는 이미지 위에 동선을 표시하는 보조 기능입니다. 현재 PWA 기준 데이터는 브라우저 로컬 저장소에 저장되며, 앱인토스 포팅 후 실제 SDK/API 구성에 맞춰 개인정보 안내를 갱신합니다.
