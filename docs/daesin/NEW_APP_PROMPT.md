# 새 앱 생성 요청 — 대신

AGENTS.md와 `docs/pipeline.md`를 기준으로 새 앱을 scaffold하고 MVP vertical slice까지 구현한다.

- 앱명: 대신 — 야식·배달 충동 브레이크
- 앱 유형: 성인용 mock-first 셀프케어 모바일 앱
- 타깃 사용자: 배달 주문 직전 한 번 멈추고 스스로 선택하고 싶은 18세 이상 사용자
- 해결 문제: 자동적인 야식·배달 주문 직전에 선택권을 회복하기 어렵다.
- 핵심 기능 3개:
  1. 음식·배고픔·이유 확인
  2. 대신 먹기·계획해서 먹기·5분 보류의 동등한 선택
  3. 결과 기록·세이브 메뉴·주간 의식적 선택 리포트

## 데모 조건

- 외부 API 없이 mock data와 rule fallback으로 작동
- 게스트 시작부터 홈 통계 반영까지 smoke test 포함
- 390×844에서 공유 가능한 디자인 품질 확보
- README에 실행법, 데모 시나리오, mock/production 경계 포함

## 완료 조건

- `verify:fast` 통과
- `web:daesin:export` 가능
- 기본 route와 핵심 CTA 동작
- 민감·알레르기·AI 실패 fallback 테스트
- 실제 출시 blocker 5개 이하로 정리

