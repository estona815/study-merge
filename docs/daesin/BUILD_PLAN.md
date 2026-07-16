# DAESIN Build Plan

이 계획은 `SOL 5.6 ULTRA`의 P0만 다루며 13개 작업으로 고정한다. P1 아이디어는 `BACKLOG.md`로만 보낸다.

1. 저장소·커넥터·빌드 위험 진단과 네임스페이스 결정
2. 제품·성장·브랜드·UX 계약 문서 고정
3. 전체 UI 콘셉트와 대신이 브랜드 에셋 제작
4. `daesin` Expo Router variant와 실행·export 명령 연결
5. 핵심 도메인, 추천 fallback, Zustand 영속 상태 구현
6. cold-launch Craving Gate → 입력 → 상태 → 추천 → 선택 → 결과 세로형 UI와 cooldown·딥링크 우선 구현
7. 타이머, 세이브 메뉴, 주간 리포트, 설정, 공유 구현
8. AI, Supabase, 안전, 분석, 오류, 구독 adapter와 migration 구현
9. 오늘의 대신 레시피 source/rights/nutrition pipeline, 선별 피드와 저장·조리 계측 구현
10. Paywall과 Free/Pro 운영 fallback 구현
11. 단위·통합·스모크·콘텐츠 안전 테스트 구현
12. Browser·iOS·Android 렌더링과 접근성 QA
13. 스토어 자산, 릴리즈 문서, 최종 검증 정리

## 종료 원칙

- 개발 중에는 관련 테스트만, Phase 종료 시 전체 게이트를 실행한다.
- 같은 원인의 실패를 두 번 넘게 반복하지 않는다.
- 실제 키가 없으면 mock mode로 전체 흐름을 유지한다.
- 외부 제출·배포·유료 결제는 사용자 승인 없이 실행하지 않는다.
