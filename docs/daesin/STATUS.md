# DAESIN Status

기준일: 2026-07-15 KST

## Phase 상태

- Phase 0 — Repository & Connector Discovery: 완료
- Phase 1 — Product & Brand Contract: 완료
- Phase 2 — Design Source of Truth: 완료
- Phase 3 — Vertical Slice: 완료
- Phase 4 — P0 Completion: 진행 중 (핵심 세션·로컬 수익화·검증 레시피 vertical slice 완료, production 연결 미완료)
- Phase 5 — Commercial Polish: 완료 (출시 문서·카피·비활성 구독 경계)
- Phase 6 — QA & Release: 조건부 완료 (web RC 검증 완료, production은 NO-GO)

## 확인된 기반

- Expo Router variant 패턴 존재
- TypeScript strict, pnpm lockfile, CI fast/full gate 존재
- Zustand, Zod, AsyncStorage, Supabase, Haptics, Sharing, ViewShot 사용 가능
- Browser와 Image Gen 사용 가능
- 화이트 우선 Berry Mint Diary 토큰과 Night Bloom 선택 테마, 하트-타이머 마스코트 적용
- 제품·브랜드·UX·콘텐츠·성장·수익화 계약 문서화 완료
- `daesin` 전용 Expo Router 변형과 web export 명령 연결 완료
- 동등한 세 선택, 5분 보류, 결과 저장, 주간 리포트의 web 세로 흐름 확인
- 홈 인라인 Craving Gate, 3개 빠른 음식 칩, 민트 CTA와 오늘의 레시피 우선 계층 구현
- 식약처 `COOKRCP01` 실제 source adapter, mock/cache adapter, stale-feed fallback 구현
- 외부 텍스트 sanitize·prompt injection·권리·알레르기·영양 범위·중복·개인화 테스트 구현
- 공식 sample 기반 3개 offline recipe feed와 상세→저장·지금 만들기 상태 연결
- 09:00/21:00 Asia/Seoul worker contract, recipe migration/RLS와 GitHub schedule source 구현(미적용)
- 분석 이벤트별 property allowlist와 raw 사용자 콘텐츠 차단 경계 확인
- paywall eligibility의 7일 cooldown 및 작업·민감 상태 억제 pure contract 확인
- `automatic`·`save_meal_limit`·`manual_pro` 진입을 실제 앱에 연결하고 첫 세션·진행 중 세션·민감 상태에서 차단
- Free 신규 세이브 메뉴 5개 제한을 Zustand action에서 원자적으로 적용하고 기존 항목·Pro 항목은 유지
- paywall 최근 노출과 첫 주간 리포트 확인 상태를 schema v2 local persistence에 저장
- 390×844 web 릴리스 후보에서 핵심 상태 6장 실제 캡처

## 현재 출시 차단 요소

- 마스터 고정 결정인 cold-launch `Craving Gate`의 선노출·2시간 cooldown·진행 세션/딥링크 우선·설정 opt-out이 현재 출시 후보에서 검증되지 않았다.
- iOS Simulator, Android Emulator와 실기기 증거가 없어 native 통과를 주장할 수 없다.
- 실제 AI provider, production analytics, store subscription adapter는 연결·검증되지 않았다.
- 실제 store subscription adapter와 sandbox 구매·복원·만료 상태는 연결·검증되지 않았다. 로컬 paywall은 가격을 꾸며내지 않고 비활성 상태를 유지한다.
- 실제 식약처 API 키 기반 수집, worker의 staging 실행, migration/RLS 적용 및 영구 cache 증거가 없다.
- 레시피 피드→상세→저장·조리 분석 이벤트와 운영 대시보드는 production transport에 연결되지 않았다.
- Supabase migration은 source만 존재하며 local/staging/production RLS 적용 증거가 없다.
- 개인정보처리방침·지원·약관 URL과 운영자 정보가 확정되지 않았다.
- 캡처 6장은 web QA 원본이며 iPhone·Android 제출 규격 자산은 각 플랫폼에서 다시 캡처해야 한다.
- ASO 초안은 공식 글자 수만 통과했으며 한국 storefront 검색 경쟁·상표 충돌·실제 portal 금칙어 검증은 미완료다.
