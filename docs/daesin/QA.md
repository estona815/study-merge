# DAESIN QA Plan and Evidence

> 상태: web mock 릴리스 후보 검증 완료 · production release NO-GO · 2026-07-14  
> 기준 시간대: `Asia/Seoul`  
> 원칙: 실행하지 않은 검증은 `PASS`로 기록하지 않는다.

## 1. 상태 표기

| 상태 | 의미 |
|---|---|
| `PASS` | 이 문서에 기록된 명령과 현재 commit/worktree에서 실제 통과 |
| `FAIL` | 실행됐으며 기대 결과와 다름 |
| `BLOCKED` | 필요한 simulator, 계정, 키, 네트워크 또는 외부 상태가 없음 |
| `NOT RUN` | 아직 실행하지 않음 |
| `N/A` | 현재 빌드 범위에 해당하지 않으며 근거가 있음 |

파일 존재, mock 응답, web export는 native·production 검증의 대체 증거가 아니다. Supabase migration 파일 존재와 원격 프로젝트 적용도 별도 항목이다.

## 2. QA scope

P0 검증은 다음 세 층으로 나눈다.

1. **Pure contract tests** — 외부 API, 실제 시간, 네트워크, 랜덤 없이 domain 규칙을 검증한다.
2. **Adapter and persistence tests** — in-memory fake와 fixture로 AI fallback, 저장, export, delete를 검증한다.
3. **App verification** — typecheck, lint, web export, smoke, 실제 iOS Simulator와 Android Emulator를 각각 검증한다.

결정적 테스트의 고정값은 `tests/fixtures/daesin-core.json`을 사용한다. 현재 시간은 `2026-07-13T15:30:00.000Z`로 주입하고, KST에서는 2026-07-14 00:30이다. 테스트 코드에서 `Date.now()`, 실제 timer, `fetch`, production Supabase, 결제 SDK를 직접 호출하지 않는다.

## 3. P0 contract matrix

### 3.1 Rule priority and recommendation continuity

우선순위는 아래 순서로 고정한다. 상위 규칙을 하위 점수나 AI 응답이 덮어쓸 수 없다.

1. self-harm/eating-disorder 등 민감 신호 감지와 안전한 세션 전환
2. 알레르기 hard block
3. 식이 제한 hard block
4. 현재 세션의 저자극·칼로리 숨김 등 safety preference
5. 사용자의 기존 세이브 메뉴와 실제 만족 기록
6. 현재 craving의 감각 태그·준비 시간 적합도
7. 안정적인 deterministic tie-break (`priority`, 다음 `id` 오름차순)

필수 사례:

- 세이브 메뉴 점수가 가장 높아도 알레르기와 충돌하면 제외한다.
- AI가 금지 재료를 반환해도 client/server safety filter가 거부한다.
- 안전 후보가 0개면 금지 식품을 완화하지 않고 `계획해서 먹기`와 `5분 보류`를 유지한다.
- 동일 입력과 동일 fixture는 항상 같은 추천과 이유 코드를 반환한다.
- AI 장애가 세 가지 선택 흐름을 막지 않는다.

### 3.2 Allergy and dietary restrictions

- 알레르기는 대소문자·공백·동의어 정규화 뒤 재료와 `mayContain` 모두 검사한다.
- `allergens`와 `dietaryTags`는 AI가 만든 자연어가 아니라 승인된 enum/ID로 판정한다.
- `해당 없음`은 다른 알레르기·제한식과 동시에 저장되지 않는다.
- 알 수 없는 제한식 값은 무시해 안전 범위를 넓히지 않고 validation error로 처리한다.
- 사용자가 제한을 수정하면 이후 추천과 세이브 메뉴 eligibility가 즉시 재계산된다.
- 알레르기 차단은 Free/Pro, online/mock 여부와 무관하다.

### 3.3 Strict AI schema and fallback

AI 결과는 strict schema를 통과한 구조화 데이터만 사용한다.

- required field 누락, unknown key, 잘못된 enum, 범위 밖 숫자, 빈 option, 중복 ID는 invalid다.
- 자유 형식 HTML/Markdown, 실행 가능한 URL, 진단·체중 감량 문구는 결과 field로 허용하지 않는다.
- parse error, schema error, safety rejection, timeout, provider unavailable을 서로 다른 비민감 reason code로 분류한다.
- timeout은 실제로 기다리지 않고 injected timeout/error fixture로 검증한다.
- invalid/timeout 모두 versioned rule-based fallback으로 즉시 이어지고 추천 화면을 유지한다.
- analytics/error report에는 prompt, 음식명, 메모, AI 원문 응답을 넣지 않는다.

### 3.4 Calories hidden

- `caloriesHidden=true`가 기본값이다.
- 숨김 상태에서는 범위, `kcal`, 신뢰도, 칼로리 접근성 label이 UI projection에 존재하지 않는다.
- sensitive mode는 사용자 설정과 무관하게 현재 세션에서 칼로리를 숨긴다.
- 주간 공유 카드와 analytics payload에 칼로리 값이 포함되지 않는다.
- 사용자가 명시적으로 표시를 켠 경우에도 값은 접힌 보조 정보이며 범위와 신뢰도를 함께 표시한다.

### 3.5 Sensitive mode

- 민감 신호가 활성화되면 tone을 `sensitive`로 override한다.
- meme copy, 느낌표 중심 축하, mascot wink/burst, 칼로리, paywall, review prompt, 공유 CTA, 제한 행동 조언을 제거한다.
- `sensitive → plain → global.safe_generic` 순으로만 copy fallback한다. meme fallback은 없다.
- 세션을 계속하기, 즉시 종료하기, 도움 정보 보기 중 사용자가 직접 선택할 수 있다.
- 민감 상태나 입력 원문은 analytics dimension으로 전송하지 않는다. 허용된 coarse `safety_mode_triggered` 이벤트만 사용한다.

### 3.6 Weekly statistics

- 주 경계는 KST 월요일 00:00 이상, 다음 월요일 00:00 미만이다.
- 완료되어 결과가 저장된 session만 `consciousChoices`에 포함한다.
- `swap`, `planned`, `delay`는 선택된 option 기준으로 각각 한 번만 집계한다.
- 가장 잦은 시간·이유·효과가 좋았던 방법은 deterministic tie-break를 사용한다.
- 삭제된 session은 즉시 집계에서 제외하고, 중복 event나 hydrate가 횟수를 늘리지 않는다.
- 데이터가 적으면 인과나 패턴을 단정하지 않고 low-data state와 다음 제안 1개만 제공한다.
- “먹지 않음”, 체중, 추정 칼로리 절감은 성공 통계로 계산하지 않는다.

### 3.7 Entitlement and paywall

- 단일 entitlement ID는 `daesin_pro`다. `active`만 Pro 기능을 연다.
- `unknown`, `loading`, provider error를 유료로 추정하지 않는다. 핵심 충동 브레이크는 계속 무료로 동작한다.
- 첫 세션 전, 진행 중 세션, sensitive mode, AI/storage 오류 복구, 삭제, 구독 복원 중에는 paywall을 노출하지 않는다.
- 자동 paywall은 완료 세션 3회 이상, 홈 복귀 뒤의 비핵심 전환, 최근 노출 후 7일 이상 조건을 모두 만족해야 한다.
- 수동 Pro 기능 진입도 최소 1회 세션 완료 뒤에만 허용한다.
- 닫기와 복원은 항상 보이며, restore 실패가 중복 구매를 유도하지 않는다.
- 가격·trial·절약률은 store provider 응답이 정상일 때만 표시한다. fixture 가격은 UI/QA 예시이며 실제 판매가가 아니다.
- 구독 만료가 기존 기록, export, delete, 알레르기·안전 기능을 삭제하거나 잠그지 않는다.

### 3.8 Persistence, export and delete-all

- 저장 snapshot은 schema version을 포함하고 hydrate 시 strict validation/migration을 거친다.
- storage 값은 신뢰하지 않는다. 손상 JSON, unknown version, 필수 field 누락은 안전한 기본 상태로 복구하고 원문을 UI에 렌더링하지 않는다.
- 앱 재시작 뒤 진행 중 세션을 이어가거나 명시적으로 버릴 수 있으며 중복 완료를 만들지 않는다.
- export는 사용자가 볼 수 있는 profile preference, sessions, outcomes, save meals, schema/export time을 포함한다.
- export는 auth/session token, provider secret, 내부 error stack, analytics profile ID를 포함하지 않는다.
- guest local-only 삭제는 profile, draft, session, save meal, settings, cached report를 모두 제거하고 새 guest 상태를 만든다.
- 연결 계정 삭제는 remote delete 성공과 local purge를 모두 확인한 뒤에만 완료로 표시한다. 부분 실패를 성공으로 표시하지 않는다.
- 앱 데이터 삭제와 App Store/Google Play 구독 해지는 별개임을 삭제 전 명확히 알린다.
- 삭제 완료 뒤 이전 profile ID로 analytics를 보내지 않는다.

## 4. Privacy and security checks

### Client and storage

- 클라이언트 번들에 AI provider key, Supabase service-role key, private key, webhook secret를 넣지 않는다.
- `EXPO_PUBLIC_*` 값은 모두 공개 설정으로 취급한다.
- 앱 소유 AsyncStorage에는 장기 bearer token이나 provider secret를 저장하지 않는다.
- storage hydrate 값과 deep link/remote 응답은 strict schema로 검증한다.
- 사용자 원문을 HTML로 주입하거나 dynamic code로 실행하지 않는다.

### Analytics allowlist

다음 원문은 analytics와 일반 오류 로그에 포함하면 안 된다.

- 입력 음식명, 자유 메모, AI prompt와 response
- 알레르기·식이 제한의 원문 또는 조합
- 정확한 배고픔·충동 점수의 시계열, 지원 화면 입력
- 이메일, 이름, auth/session token, export 파일 내용

이벤트는 승인된 event name, coarse enum, count, duration bucket, provider type, non-sensitive error code만 허용한다.

### Supabase / RLS evidence levels

| Evidence | 인정 범위 |
|---|---|
| migration 파일 존재 | 정책이 source control에 정의됨 |
| local `supabase db reset` + policy test | 새 DB에서 migration과 격리 시나리오가 통과 |
| staging migration history + 두 사용자 test | staging에 실제 적용되고 owner 격리가 동작 |
| production migration history + 운영 smoke | production 적용 증거. 명시 승인 전 실행 금지 |

파일 존재만으로 staging/production 적용을 주장하지 않는다. RLS 테스트는 사용자 A가 사용자 B의 profile/session/save meal/export/delete RPC를 읽거나 변경하지 못하는지, service-role만 필요한 작업이 client key로 불가능한지 확인해야 한다.

## 5. Accessibility and visual smoke

- 390×844 및 320px 폭에서 핵심 CTA, 세 선택, 5분 timer, delete confirmation을 확인한다.
- Dynamic Type/Android font scaling 최대 접근성 단계에서 중요한 copy와 닫기·복원 버튼이 잘리지 않아야 한다.
- VoiceOver/TalkBack label이 칼로리 숨김이나 민감 정보를 새지 않아야 한다.
- Reduce Motion에서 timer, 선택, 완료 정보가 정적으로 유지된다.
- Night Bloom/Milk Moon 모두 text/CTA/focus 대비를 확인한다.
- 키보드가 음식 입력 CTA와 삭제 확인 input을 가리지 않아야 한다.

## 6. Required commands

```bash
pnpm install --frozen-lockfile
pnpm test:daesin
pnpm typecheck
pnpm lint
pnpm test:smoke
pnpm check:secrets
pnpm web:daesin:export
pnpm verify:fast
```

`verify:full`은 native E2E, packaging, content validation의 실제 결과와 실패 원인을 함께 기록할 때만 release evidence로 사용한다.

## 7. Current evidence

| Gate | Status | Evidence / blocker |
|---|---|---|
| Frozen install | `PASS` | `pnpm install --frozen-lockfile` — already up to date |
| Deterministic DAESIN unit tests | `PASS` | `pnpm test:daesin`; 5 suites, 39/39 tests; rule/safety/AI/weekly/paywall intent/cooldown/persistence/Free limit/export/delete/analytics privacy guard |
| TypeScript | `PASS` | `pnpm typecheck` |
| ESLint | `PASS` | `pnpm lint` |
| Workspace smoke | `PASS` | `pnpm test:smoke`; 5 suites, 8/8 tests. 자동 paywall cooldown과 명시적 Free-limit 진입을 포함해 검증 |
| Secret scan | `PASS` | `pnpm check:secrets` — high-confidence pattern 0 |
| Targeted source security scan | `PASS` | DAESIN source에 raw HTML/eval/dynamic navigation/postMessage/direct fetch/provider secret 없음; 공개 `EXPO_PUBLIC_DEMO_MODE` 1건만 확인 |
| Analytics privacy boundary | `PASS` | 이벤트별 property allowlist, raw food/note/allergy/diet/prompt/response/PII 차단과 transport 직전 재정제를 4건 집중 검증 |
| Paywall eligibility + app wiring | `PASS` | automatic/manual/Free-limit intent, 첫·진행 중 세션, sensitive/delete/restore/error-recovery 억제, 7일 cooldown 영속화, Free 5개 원자적 제한을 앱과 store에 연결해 검증 |
| DAESIN web export | `PASS` | `pnpm web:daesin:export`; `/daesin` base export 생성, `NO_COLOR` warning은 비차단 |
| Full fast gate | `PASS` | `pnpm verify:fast`; type/lint/smoke/DAESIN 39/check:secrets와 4개 app export 모두 exit 0 |
| Browser connector | `BLOCKED` | in-app Browser 초기화가 `Cannot redefine property: process` (`browser-client.mjs:33`)로 실패하여 local Playwright fallback 사용 |
| Playwright web flow | `PASS` | 390×844, 320×844, 1280×900; onboarding→첫 선택 완료→manual Pro paywall→설정 복귀→reload persistence, Free 0/5 표시와 기존 핵심 흐름 확인. console error/warning 0 |
| Web capture set | `PASS` | `assets/daesin/store/`의 기존 핵심 상태와 `output/playwright/daesin-monetization-qa/`의 모바일 세이브·모바일/데스크톱 paywall 캡처. native 제출 자산은 아님 |
| iOS Simulator | `BLOCKED` | `xcrun simctl` unavailable; native 실행 증거 없음 |
| Android Emulator | `BLOCKED` | `adb`, `emulator` unavailable; native 실행 증거 없음 |
| Supabase migration source | `PASS` | `supabase/migrations/20260714_daesin_p0.sql`에 DAESIN tables/cascade/RLS policy source 존재를 정적 확인 |
| Local RLS enforcement | `NOT RUN` | local Supabase policy test 필요 |
| Staging/production RLS applied | `BLOCKED` | project access와 명시적 운영 적용 증거 없음 |
| Production web security headers | `BLOCKED` | 정적 export만 확인; edge runtime CSP/nosniff/frame/referrer/permissions header 증거 없음 |
| Real subscription purchase/restore | `BLOCKED` | store sandbox offering·계정 필요 |
| Real AI provider | `BLOCKED` | server-side provider와 test key 필요; mock/fallback과 구분 |
| Full release gate | `EXPECTED FAIL` | `pnpm verify:full`은 앞 단계와 local Toss package까지 통과 후 Study Merge release metadata 47,511건 누락에서 의도적으로 차단 |
| Production dependency audit | `BLOCKED` | `pnpm audit --prod`가 레지스트리 응답 없이 1분 이상 정지해 결과 없이 종료. 취약점 0건으로 간주하지 않음 |

### 2026-07-14 command log

```text
PASS  pnpm install --frozen-lockfile
PASS  pnpm test:daesin
      5 suites, 39 tests
PASS  pnpm typecheck
PASS  pnpm lint
PASS  pnpm test:smoke
      5 suites, 8 tests
PASS  pnpm check:secrets
PASS  pnpm web:daesin:export
PASS  pnpm test
      node:test 116/116 + past-life Jest 26/26 + DAESIN Jest 39/39
PASS  pnpm verify:fast
      type/lint/smoke/DAESIN/secrets + 4 app exports
PASS  pnpm check:ui, pnpm smoke-test
SKIP  pnpm test:e2e
      repository playwright.config.* 없음; 별도 Playwright CLI로 실제 web 흐름 검증
EXPECTED FAIL  pnpm verify:full
      선행 gate/test/export/local Toss package 통과 후 Study Merge release metadata 47,511건 누락
BLOCKED  pnpm audit --prod
         registry 응답 없이 정지; 결과 없음
```

Playwright wrapper의 번들 경로가 없어 workspace dependency Node와 `pnpm dlx @playwright/cli`를 사용했다. workspace dependency는 추가하지 않았다. Browser connector 실패와 native 도구 부재는 web PASS로 대체하지 않는다.

## 8. Exit criteria

DAESIN을 release-ready로 판정하려면 다음이 모두 필요하다.

- deterministic domain/adapter tests와 `verify:fast` 통과
- guest 핵심 흐름과 fallback 흐름의 iOS·Android smoke
- 알레르기·식이 제한 safety set 0건 누락
- sensitive mode와 paywall exclusion 자동 검증
- local 및 staging RLS owner-isolation 검증
- delete/export를 guest와 연결 계정에서 각각 검증
- 실제 store sandbox에서 purchase, entitlement, restore, expiry 검증
- 실제 출시 후보 빌드에서 캡처한 6장 스토어 이미지
- privacy disclosure와 실제 SDK/network behavior 일치 확인
