# DAESIN App Spec

## 기본 정보

- 앱명: 대신 — 야식·배달 충동 브레이크
- 앱 유형: 셀프케어 / 의사결정 개입
- 타깃 사용자: 다크 큐트 감성을 선호하며 야식·배달 주문 직전 개입이 필요한 18세 이상 사용자
- 해결 문제: 충동 상태에서 손가락이 자동으로 결제하기 전에 멈추고 선택할 시간이 부족하다.

## 핵심 기능

1. 음식, 배고픔 점수, 이유를 짧게 확인한다.
2. AI schema 또는 규칙 fallback이 세 가지 동등한 행동 선택을 제공한다.
3. 실제 선택과 변화를 기록해 홈과 주간 리포트에 반영한다.

## 금지 기능

- 체중 감량·칼로리 중심 대시보드, 음식 금지, 죄책감·낙인·streak 벌점
- P1의 음성·사진 인식·배달앱 감시·커뮤니티·의료 상담

## 데이터 구조

- 도메인 엔티티: profile, dietary preference, craving session, recommendation, outcome, save meal, subscription
- 상태: onboarding, home, food, check-in, analyzing, options, timer, outcome, report, settings, paywall, sensitive
- 저장 경계: 로컬 AsyncStorage가 기본이며 remote repository는 adapter로 교체한다.

## 화면 구조

- 진입: 게스트 온보딩 또는 복원된 홈
- 핵심 CTA: `지금 땡겨요`
- 핵심 결과: 세 가지 선택과 결과 기록, 홈의 의식적 선택 횟수 증가

## 데모 모드

- API key 없이 mock provider 사용
- AI schema 실패 시 규칙 provider로 즉시 전환
- 테스트에서는 5분 타이머를 즉시 완료 가능

## 완료 조건

- `pnpm verify:fast`와 daesin export 통과
- 기본 route 렌더링 및 핵심 세로형 흐름 완주
- README·QA·release blocker 문서 존재
