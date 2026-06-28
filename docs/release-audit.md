# Study Merge Release Audit

## 1. Public Store Release Verdict

`No-Go`

테스트와 웹 export 는 통과하지만, 공개 App Store / Google Play 출시 기준으로는 콘텐츠 검증, 스토어 자산, 배포 식별자, 실기기 QA, privacy/legal 자료가 아직 부족하다.

## 2. Risk Table

| Priority | Issue | Why It Matters | User Impact | Release Impact | Fix | Difficulty | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P0 | Verified content metadata missing | 샘플/MVP 콘텐츠를 공개 출시 콘텐츠처럼 다룰 수 없음 | 잘못된 학습 신뢰 유도 가능 | 스토어 심사/법적 검토 리스크 | `sourceRef`, `reviewStatus`, `copyrightStatus` 채우기 | High | documented |
| P0 | Real device QA evidence missing | Expo/React Native 앱은 실기기 UI/성능 차이가 큼 | 레이아웃 깨짐, 제스처 충돌, 성능 저하 | 공개 출시 불가 수준 | iPhone/Android 기기별 QA 수행 및 증빙 저장 | High | documented |
| P0 | Store asset/config incomplete | 아이콘, 스플래시, bundle/package 식별자가 없음 | 설치 경험과 브랜드 신뢰 하락 | 빌드/제출 자체가 막힘 | 최종 스토어 자산과 식별자 확정 | Medium | documented |
| P0 | Privacy/support URLs missing | 스토어 등록과 사용자 신뢰에 필요 | 문의/정책 접근 불가 | 제출 blocker 가능 | 실제 정책/지원 페이지 준비 후 값 입력 | Medium | documented |
| P1 | App entry/config drift existed in repo | 다른 앱 진입점이 뜨면 제품 자체가 틀어짐 | 완전히 다른 앱 노출 가능 | 심각한 제품 불일치 | `App.tsx` / `app.json` 을 Study Merge 기준으로 정렬 | Low | fixed |
| P1 | Content structure gate was missing | 대규모 생성형 데이터는 구조 누락이 숨어들기 쉬움 | 깨진 퀴즈/합성 관계 가능 | QA 비용 상승 | `validate:content` 추가 | Medium | fixed |
| P1 | Persisted restore mutated state directly | 세션 복구 안정성과 테스트 가능성 저하 | 복구 꼬임 가능 | 유지보수 리스크 | 순수 restore helper 로 교체 | Medium | fixed |
| P1 | Session/lifecycle tests were thin | pause/restore/timer/finishGame 회귀 가능 | 세션 손실, 타이머 오류 | QA 신뢰 하락 | persistence/lifecycle/store tests 추가 | Medium | fixed |
| P2 | Invalid-merge UX feedback still limited | 초반 플레이어가 왜 이동이 안 되는지 덜 명확함 | 학습 게임 느낌 약화 | 치명적 blocker 는 아님 | 가벼운 상태 피드백 추가 검토 | Low | not addressed |
| P2 | Mobile store polish incomplete | 결과/복습/보드 문구가 더 다듬어질 여지 있음 | 몰입감 저하 | 출시 blocker 아님 | 계속 copy/UI polish | Low | partially fixed |

## 3. UX Gaps

- invalid merge 에 대한 직접적 피드백은 아직 약하다
- 튜토리얼 심화 단계 없이 바로 메인 루프로 들어간다
- tablet 레이아웃은 `supportsTablet` 만 켜져 있고 전용 QA 증빙이 없다

## 4. Gameplay Gaps

- 샘플 데이터 기반이라 실제 교육적 난이도/정확도 검증이 끝나지 않았다
- 합성 규칙은 안정적이지만 “장기 플레이 메타”는 아직 QA 증빙이 적다

## 5. Performance Gaps

- 대형 generated content 는 여전히 앱 번들에 정적으로 포함된다
- 저사양 Android 장기 플레이 성능 증빙이 없다
- 다만 파생 계산 일부는 memoization 으로 저위험 완화했다

## 6. Data-Quality Gaps

- release metadata coverage 부족
- 공식 curriculum / exam source traceability 부족
- copyright clearance status 부족

## 7. Operations Gaps

- 계정 동기화 없음
- 운영용 content CMS 없음
- analytics/crash monitoring 없음
- support flow 없음

## 8. Store-Readiness Gaps

- icon/splash/adaptive icon 미구성
- iOS bundle identifier / build number 없음
- Android package / versionCode 없음
- `eas.json` 없음
- privacy/support URL 없음

## 9. What Is Already Solid

- 게임 엔진 구조가 분리되어 있고 deterministic test 가 가능하다
- 보드 이동, 합성, 퀴즈 판정, 복습 큐, 결과/통계 루프가 end-to-end 로 연결되어 있다
- session restore 에서 `paused=true` 보장이 들어갔다
- AppState background pause 규칙이 명시적 helper 와 테스트로 고정됐다
- `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm web:export` 를 돌릴 수 있는 기본 검증 루프가 있다

## 10. Must Fix Before Public Release

- verified educational content metadata
- curriculum / exam accuracy review
- copyright review
- privacy/support/public policy materials
- icon/splash/store screenshots
- bundle/package/build identifiers
- real iOS/Android device QA evidence

## 11. Recommended Next Sprint Tasks

1. `sourceRef`, `reviewStatus`, `copyrightStatus` 를 concept/quiz/unit 단위로 채우는 content review workflow 설계
2. iPhone SE / 최신 iPhone / 저사양 Android / 중급 Android 실기기 QA 수행
3. 최종 앱 아이콘, 스플래시, 스토어 스크린샷 제작
4. iOS bundle identifier, Android package, build numbering 정책 확정
5. `eas.json` 추가와 실제 빌드 파이프라인 연결
6. privacy policy URL, support URL, review notes 초안 완성
7. invalid merge / blocked turn 에 대한 미세 UX 피드백 추가
8. tablet support 를 유지할지 여부 결정 후 iPad QA 또는 설정 축소
9. 콘텐츠 정확도 검수 결과를 validator 와 문서에 연결
10. low-end Android 30분 세션 성능 측정 기록 남기기

## 12. What Not To Do Right Now

- 계정/백엔드/analytics SDK 를 급하게 붙이지 말 것
- 검증되지 않은 교육 콘텐츠를 approved 로 표시하지 말 것
- 실제 bundle/package 값을 모르는 상태에서 임의 값으로 채우지 말 것
- 대규모 아키텍처 리라이트를 지금 시점에 시작하지 말 것
