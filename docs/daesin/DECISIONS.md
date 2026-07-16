# DAESIN Decisions

## 2026-07-14

1. 기존 Expo 56, React Native 0.85, Expo Router, TypeScript strict, pnpm을 유지한다.
2. 멀티 앱 충돌을 막기 위해 코드는 `src/daesin`, route는 `app-variants/daesin`, 문서는 `docs/daesin`에 둔다.
3. 새 의존성을 추가하지 않는다. Zustand, Zod, AsyncStorage, Expo Haptics, Supabase SDK 등 이미 설치된 패키지를 우선한다.
4. 외부 키 없이도 완주 가능한 `MockAIProvider`와 `RuleBasedProvider`를 기본으로 한다. 운영 AI 키는 서버 adapter에서만 읽는다.
5. Figma 커넥터는 사용 가능하지만, 이 멀티 앱 저장소의 source of truth는 코드 토큰과 `docs/daesin/design`의 UI 콘셉트로 고정한다. 원격 디자인 파일을 새로 만들어 이중 관리하지 않는다.
6. Night Bloom을 기본, Milk Moon을 라이트 테마로 사용한다. 성공 상태는 먹지 않은 행동이 아니라 선택·저장·계획 완료를 뜻한다.
7. 세 가지 선택은 도덕적 우열 없이 동일 계층으로 표시한다. 핵심 충동 개입은 Free에서 무제한이다.
8. 음식 사진은 사용하지 않고 기본은 텍스트·아이콘·중립 일러스트로 구성한다.
9. 대신이 생성 원본은 provenance를 기록하고, 출시 전 상표·캐릭터 유사성 및 최종 IP 검수를 별도 게이트로 둔다.
10. 현재 환경에서 iOS Simulator와 Android Emulator가 감지되지 않았으므로 web 렌더링과 정적 native config를 우선 검증하고, 실기기 검증은 release blocker로 명시한다.
11. 최종 bundle identifier, Android package, 실제 가격, 정책 URL, 운영자 정보는 제품 소유자 입력 전까지 출시 확정값으로 간주하지 않는다.
12. 실제 배포·결제·원격 DB migration 적용은 이 로컬 구현 범위에서 실행하지 않는다.

