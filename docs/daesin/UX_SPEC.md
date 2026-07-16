# DAESIN P0 UX/UI 시스템 명세

> 상태: Launch MVP v0.1 · 2026-07-14
> 오너: UX/UI Systems
> 제품 계약: [PRODUCT.md](./PRODUCT.md)
> 시각 source of truth: [BRAND_GUIDE.md](./BRAND_GUIDE.md)
> 카피 source of truth: [CONTENT_GUIDE.md](./CONTENT_GUIDE.md)
> 수익화 계약: [MONETIZATION.md](./MONETIZATION.md)

## 1. 문서 계약과 P0 경계

이 문서는 대신의 Launch P0를 화면, 상태, 상호작용, 접근성 단위로 구현할 수 있게 고정한다. 핵심 순간은 사용자가 자동 주문 직전에 앱을 열고, 비난 없이 상태를 확인한 뒤 세 가지 행동 중 하나를 직접 고르는 때다.

### UX 성공 조건

1. 가입이나 결제 없이 첫 추천까지 도달한다.
2. 정상 세션은 항상 `대신 먹기`, `계획해서 먹기`, `5분 보류` 세 선택을 제공한다.
3. 세 선택은 도덕적·시각적 우열 없이 모두 완료할 수 있다.
4. AI, 네트워크, 분석, 결제 SDK가 실패해도 핵심 세션은 규칙 기반으로 끝까지 진행된다.
5. 결과 저장 뒤 홈 통계와 주간 리포트에 실제 반영된다.
6. 민감 신호가 있으면 밈·축하·칼로리·paywall보다 안전한 안내가 우선한다.

### 명시적 제외

P1인 음성 AI, 사진 인식, 냉장고 분석, 편의점 실시간 데이터, 배달앱 감지, Screen Time/접근성 서비스 감시, 위젯, 운동·물·체중 추적, 커뮤니티, 경쟁, 웨어러블, 의료 상담, 코치 마켓플레이스는 화면·잠금 티저·`곧 제공` 문구까지 만들지 않는다.

## 2. 경험 원칙

| 원칙 | UI 결정 |
|---|---|
| 한 번 멈추되 가두지 않는다 | 질문은 한 화면에 하나, 타이머는 언제든 종료, 뒤로 가기와 세션 나가기를 제공한다. |
| 먹어도 실패가 아니다 | 먹기 선택에 오류색·경고·실망 표정·streak 손실을 쓰지 않는다. |
| 첫 가치가 설정 완성보다 먼저다 | 게스트 우선, 온보딩 5단계 이하, 알림 권한과 회원가입은 첫 세션 뒤다. |
| 속도가 장식보다 먼저다 | 스플래시는 초기화보다 길지 않고, AI가 늦으면 자동 fallback으로 전환한다. |
| 데이터보다 선택을 전면에 둔다 | 홈에 칼로리·체중·복잡한 차트를 두지 않는다. |
| 개인화는 안전 경계를 넘지 않는다 | 알레르기·식이 제한·민감 모드는 유료 여부보다 항상 우선한다. |
| 플랫폼 동작은 자연스럽게 유지한다 | iOS swipe back/sheet, Android predictive back/edge-to-edge 기대를 존중한다. |

## 3. 앱 셸과 정보 구조

### 3.1 내비게이션 계층

```text
Launch
├─ Splash / local bootstrap
├─ Onboarding (신규 또는 미완료)
└─ App shell
   ├─ 홈
   │  ├─ 충동 세션 (전체 화면 flow)
   │  └─ 주간 리포트 → 공유 카드
   ├─ 기록 → 세션 상세
   ├─ 세이브 → 추가/수정/상세
   └─ 마이
      ├─ 화면·말투 설정
      ├─ 식이·알레르기 설정
      ├─ 알림 설정
      ├─ 구독 / 복원
      ├─ 데이터 내보내기 / 삭제
      └─ 개인정보·서비스 한계

Global overlays
├─ Offline / recoverable error
├─ Confirm dialog / bottom sheet
├─ Sensitive support
└─ Eligible paywall (세션 밖에서만)
```

### 3.2 하단 탭

| 탭 | 기본 화면 | 역할 | 배지 |
|---|---|---|---|
| 홈 | `H01` | 핵심 CTA, 최근 효과, 오늘의 선택 | 사용하지 않음 |
| 기록 | `R01` | 날짜별 세션과 선택 맥락 | 사용하지 않음 |
| 세이브 | `V01` | 세이브 메뉴 재사용·관리 | 한도 경고는 목록 안에서만 |
| 마이 | `M01` | 설정, 구독, 데이터 제어 | 결제·알림 압박 배지 금지 |

- 충동 세션 `C01~C10` 동안 탭 바는 숨긴다. 세션을 끝내거나 명시적으로 나간 뒤 셸로 돌아온다.
- 홈 CTA `지금 땡겨요`는 스크롤 위치와 무관하게 첫 viewport에서 보인다.
- 주간 리포트는 홈의 카드와 기록 상단에서 진입할 수 있지만 중복 탭을 만들지 않는다.

## 4. 전체 화면 지도

화면 ID는 디자인·개발·분석 QA에서 공통으로 사용한다. 라우트 이름은 구현체에 맞게 바꿀 수 있으나 상태와 진입 조건은 유지한다.

### 4.1 Launch와 온보딩

| ID | 화면 | 필수 내용 | 주 행동 | 종료/예외 |
|---|---|---|---|---|
| `L00` | 스플래시 | 워드마크 또는 대신이 1개, 로컬 초기화 | 자동 진입 | 네트워크를 기다리지 않는다. 세션 복구가 있으면 `C-RECOVER`, 아니면 온보딩/홈으로 이동한다. |
| `O01` | 가치·성인 확인 | `배달앱보다 5분 먼저`, 비의료 서비스 요약, 만 18세 이상 확인 | `18세 이상이며 시작할게요` | 미확인 시 핵심 앱 진입을 막고 성인 대상 안내만 제공한다. |
| `O02` | 자주 당기는 음식 | 다중 선택 preset, 직접 입력, 건너뛰기 | `다음` | 선택 없음 허용. 첫 추천의 필수 조건이 아니다. |
| `O03` | 알레르기·식이 제한 | 알레르기, 제한식, `해당 없음`, 직접 입력 | `저장하고 다음` | 선택 충돌 시 구체적으로 수정 안내. 의료 진단 문구 금지. |
| `O04` | 말투 | 담백·친구·밈 preview, 밈 강도 | `이 말투로 할게요` | 선택은 이후 언제든 변경 가능. 민감 모드는 설정을 임시 override한다. |
| `O05` | 보기·시작 | 칼로리 숨김 기본, 저자극 보기, Night Bloom/Milk Moon/System | `대신 시작하기` | 알림·회원가입을 요청하지 않는다. 완료 즉시 `H01`. |

온보딩은 뒤로 가기와 앱 재시작을 견뎌야 한다. 각 단계의 값은 로컬 draft로 저장하고, 완료 전 analytics에는 자유 입력값을 보내지 않는다.

### 4.2 홈과 세션

| ID | 화면 | 필수 내용 | 주 행동 | 보조 행동/상태 |
|---|---|---|---|---|
| `H01` | 홈 | 대신이 메시지, `지금 땡겨요`, 오늘 멈춰본 횟수, 효과 좋았던 세이브 메뉴, 최근 기록, 주간 리포트 | `지금 땡겨요` | 빈 계정은 수치 `0`을 실패처럼 강조하지 않고 첫 세션 안내를 보여준다. |
| `C01` | 음식 입력 | 텍스트 필드, 최근/자주 입력, `그냥 뭔가 먹고 싶어` | `상태 확인하기` | 값이 있으면 키보드 action으로도 다음. 음식 사진 입력은 없음. |
| `C02` | 배고픔 | 0~10 discrete slider, 현재 값의 말 설명 | `다음` | 질문은 하나만 표시. 스크린리더용 증감 action 제공. |
| `C03` | 이유 | 정말 배고픔/스트레스/심심함/습관/보고 당김/잘 모르겠음 | 항목 선택 후 `분석 보기` | 단일 선택. 자유 감정 입력은 P0에서 요구하지 않는다. |
| `C04` | 분석 중 | 대신이 thinking, 짧은 상태 문구, 진행 중 취소/나가기 | 자동 | provider 지연 또는 실패 시 안내 후 규칙 기반 결과로 계속한다. |
| `C05` | 분석·세 선택 | 상황 요약, 감각 태그, 동등한 3개 OptionCard, 칼로리 접힘 정보(허용 시) | 카드 선택 | 카드 순서는 규칙으로 달라져도 크기·색·CTA 위계는 같다. |
| `C06A` | 대신 먹기 상세 | 메뉴명, 준비 시간, 감각 태그, 재료, 3단계 이하 조리법, 맞는 이유 | `이걸로 할게요` | 세이브 저장은 보조. 알레르기 충돌 시 카드 자체를 추천하지 않는다. |
| `C06B` | 계획해서 먹기 | 원래 음식, 양 선택, 사이드/남길 몫 중 적용 가능한 항목 | `이대로 계획할게요` | `정하지 않고 먹기`도 가능하되 죄책감 문구 없음. |
| `C06C` | 5분 보류 | 큰 타이머, 진행 링, micro action 1개 | `지금 다시 고를래요` | 매초 조작을 요구하지 않는다. 백그라운드에서도 종료 시각 기준으로 복원. |
| `C07` | 충동 재확인 | `지금 당김은 어느 정도예요?` 0~10 | `다음` | 원래보다 높아도 실패 표현 없음. 이후 세 선택으로 돌아가거나 결과 기록 가능. |
| `C08` | 결과 기록 | 실제 행동, 실제 음식(선택), 만족도, 짧은 메모(선택) | `기록 저장` | 필수 입력은 실제 행동 하나. 최대 2~3번 탭으로 저장 가능. |
| `C09` | 선택 완료 | 선택 요약, 홈에 반영됨, 중립/안심 대신이 | `홈으로` | 작은 완료 모션은 normal에서 1회. sensitive/reduce motion에서는 제거. |
| `C-RECOVER` | 세션 복구 | 마지막 저장 단계와 경과 시간 요약 | `이어서 하기` | `이번 세션 끝내기` 제공. 자동으로 입력을 삭제하지 않는다. |

### 4.3 기록, 세이브, 리포트

| ID | 화면 | 필수 내용 | 주 행동 | 빈/오류 |
|---|---|---|---|---|
| `R01` | 기록 목록 | 날짜별 SessionCard, 음식, 이유, 선택 유형, 변화 | 세션 열기 | 빈 상태는 `첫 선택을 남겨볼까요?`; 빨간 실패 표식 없음. |
| `R02` | 세션 상세 | 당시 상태, 제안, 실제 선택, 충동 변화, 메모 | 필요 시 메모 수정 | 삭제는 확인 dialog. 선택을 사후 평가하지 않는다. |
| `V01` | 세이브 메뉴 | 즐겨찾기, 사용 횟수, 만족도, 감각·상황 태그, 준비 시간 | `메뉴 추가` | Free 5개. 초과 항목은 구독 만료 뒤에도 조회·선택 유지. |
| `V02` | 세이브 추가/수정 | 이름, 재료, 3단계 조리법, 준비 시간, 감각 태그, 상황 태그 | `저장` | 알레르기 충돌은 명시 확인. 사진은 필수가 아니며 기본은 중립 아이콘. |
| `V03` | 세이브 상세 | 메뉴 정보, 최근 사용, 만족도 | `이 메뉴 사용하기` | 사용은 충동 세션을 새로 시작하며 음식/추천 context만 prefill. |
| `W01` | 기본 주간 리포트 | 의식적 선택 수, 3개 선택 분포, 자주 발생한 시간·이유, 효과 좋았던 방법, 제안 1개 | `공유 카드 만들기` | 데이터 부족 시 숫자를 과장하지 않고 다음 한 번의 기록 가치를 안내. |
| `W02` | 공유 카드 미리보기 | story/square 비율, 개인정보 제거 preview | 시스템 공유 | 체중·칼로리·자유 메모·사용자명은 기본 제외. 저장 취소 가능. |

### 4.4 마이, 구독, 데이터, 안전

| ID | 화면 | 필수 내용 | 주 행동 | 규칙 |
|---|---|---|---|---|
| `M01` | 마이 | 화면·말투, 식이 설정, 알림, 구독, 데이터, 개인정보/서비스 한계 | 행 선택 | Pro 배지보다 안전·데이터 제어 접근성이 우선. |
| `M02` | 화면·말투 | theme, tone, meme level, calorie hidden, low-stimulation | 즉시 저장 | preview는 실데이터 대신 중립 fixture 사용. |
| `M03` | 알레르기·식이 제한 | 현재 값 편집 | `저장` | 변경 뒤 향후 추천 즉시 재필터. 기존 기록은 변경하지 않는다. |
| `M04` | 알림 | on/off, 선호 시간, 최대 횟수, quiet hours | 시스템 권한 요청 | 앱 내 값을 먼저 정한 뒤 OS prompt. 거절 후 설정 이동 안내 가능. |
| `M05` | 구독 | entitlement, 현재 상품/만료, 관리, 복원 | `구독 복원` | 복원·관리·해지는 paywall 없이 접근. |
| `M06` | 데이터·개인정보 | 내보내기, 분석 동의, AI 개선 동의, 삭제, 비의료 안내 | 선택한 작업 | 결제 여부와 무관. 민감 자유 입력은 analytics 기본 전송 금지. |
| `M07` | 데이터 삭제 확인 | 삭제 범위, 되돌릴 수 없음, 재인증이 필요할 수 있음 | `내 데이터 삭제` | destructive 색은 실제 위험에만 사용. 2단 확인, 완료/실패 상태 제공. |
| `P01` | Paywall | 실제 Pro 기능, 월간/연간 현지 가격, 갱신 고지, 닫기, 복원, 약관/개인정보 | 선택 상품 구매 | 표시 조건은 11절. 가격 로드 실패 시 구매 CTA를 비활성화하고 핵심 앱 복귀 제공. |
| `X01` | Sensitive 안내 | 중립 메시지, 칼로리 숨김 제안, 비의료 한계, 지원 고려 | `계속 선택하기` | 밈·장식 burst·paywall·제한 조언 제거. |
| `X02` | 긴급 지원 | 지역 긴급 지원 데이터, 신뢰하는 사람/전문가 연락, 앱 밖 연락 action | `도움 연결 보기` | 실제 지역 데이터가 없으면 번호를 추측하지 않는다. 즉시 위험 시 지역 긴급전화/응급실 안내. |

## 5. 가장 작은 완전한 세로형 흐름

P0 구현 순서는 아래 한 줄을 먼저 완주하게 한다.

```text
L00 → O01…O05 → H01 → C01(치킨) → C02(6) → C03(스트레스)
→ C04(rule/mock) → C05 → C06C → C07 → C08 → C09 → H01 → W01 반영
```

### 단계별 수용 기준

| 단계 | 완료 기준 | 실패 시 UX |
|---|---|---|
| 게스트 시작 | 계정 생성 없이 profile/guest ID와 온보딩 설정이 저장됨 | 원격 저장 실패 시 로컬 게스트로 계속 |
| 음식 입력 | `치킨` 또는 generic craving이 session draft에 저장됨 | 빈 값이면 인라인 안내, generic action은 계속 가능 |
| 상태 확인 | 배고픔 6과 스트레스가 각각 저장됨 | 유효값 누락 필드로 포커스 이동 |
| 추천 | schema 통과 응답 또는 rule fallback이 정확히 3개 옵션 제공 | 내부 오류/JSON을 숨기고 fallback 사용 사실만 짧게 안내 |
| 보류 | 종료 시각을 저장하고 foreground/background에서 같은 경과를 계산 | 앱 재시작 시 남은 시간 또는 완료 상태 복원 |
| 결과 | 실제 행동 1개와 선택 입력이 로컬에 즉시 저장됨 | 원격 실패는 `기기에 저장됨` 상태로 재동기화 |
| 반영 | 홈 count와 주간 집계가 한 번만 증가 | 중복 submit은 idempotent 처리, 오류 시 다시 계산 |

### 세션 상태 머신

```text
draft_food
  → draft_hunger
  → draft_reason
  → recommending
     ├─ provider_valid
     ├─ provider_retry_once
     └─ rule_fallback
  → options_ready
     ├─ swap_selected → action_ready
     ├─ planned_selected → action_ready
     └─ delay_selected → timer_running → reassessing → action_ready/options_ready
  → outcome_pending
  → completed

Any incomplete state → persisted_draft → recover_or_discard
Sensitive signal → sensitive_overlay/mode override; core choice remains available when safe
```

- `completed`는 결과 기록이 저장된 뒤에만 설정한다.
- 같은 CTA를 여러 번 탭해도 추천·결과·통계가 중복 생성되지 않아야 한다.
- 세션 중 앱 이탈 확인은 `계속하기`를 primary, `이번 세션 끝내기`를 secondary로 둔다. 사용자를 가두지 않는다.

## 6. 선택 화면 규칙

### 6.1 카드 동등성

- 세 OptionCard는 같은 표면, 폭, radius, 제목 크기, 기본 border를 쓴다.
- `추천`, `건강`, `베스트`, `죄책감 없음`처럼 우열을 암시하는 배지를 쓰지 않는다.
- 정렬은 상황 적합성일 뿐 가치 순위가 아님을 스크린리더 label과 화면 intro로 설명한다.
- 선택된 카드만 `color.border.focus`와 체크 아이콘으로 표시한다. 초록/빨강으로 선악을 구분하지 않는다.
- 각 카드에는 제목, 한 줄 설명, 예상 시간/필요 행동을 제공한다. 전체 세부 정보는 다음 화면에서 연다.

### 6.2 정렬 규칙

| 조건 | 첫 카드 가능 | 금지 |
|---|---|---|
| 배고픔 7~10 | 빠른 세이브 메뉴 또는 계획해서 먹기 | 보류만 사실상 강요하기 |
| 배고픔 4~6 | 세 선택 균형; provider 적합도 사용 | 칼로리 낮은 순 정렬 |
| 배고픔 0~3 + 스트레스/심심함/습관 | 5분 보류 가능 | 먹기를 위험 카드로 만들기 |
| 알레르기/식이 충돌 | 충돌 후보 제거 후 안전 fallback | 경고만 붙인 채 추천 유지 |

### 6.3 칼로리 정보

- 기본은 숨김이다. 사용자가 명시적으로 허용한 경우에만 `자세히` disclosure 안에 범위·신뢰도·조리/양에 따른 차이를 함께 표시한다.
- 큰 Numeric 스타일, progress ring, 목표 대비, 적색 경고를 사용하지 않는다.
- sensitive mode에서는 사용자 설정과 무관하게 숨기고 `나중에 다시 표시`할 수 있음을 알린다.

## 7. 전역 모드와 우선순위

동시에 여러 모드가 적용되면 다음 순서로 UI를 결정한다.

```text
Safety escalation
> Sensitive mode
> Accessibility settings (screen reader, text scale, reduce motion/transparency, high contrast)
> Low-stimulation view / calorie hidden
> Offline/fallback state
> Theme and tone preference
> Decorative personalization
```

| 모드 | 바뀌는 것 | 유지되는 것 |
|---|---|---|
| Night Bloom / Milk Moon / System | semantic token 값 | 정보 계층, 의미, 컴포넌트 구조 |
| 저자극 보기 | 음식 사진을 아이콘/흐림/저채도로 대체, 모션·장식 밀도 축소 | 음식명, 준비 시간, 선택 가능성 |
| 칼로리 숨김 | 칼로리와 영양 숫자 제거 | 선택 카드, 안전 필터, 결과 기록 |
| 오프라인 | cached/규칙 기반 결과, 재동기화 상태 | 전체 세션과 결과 저장 |
| Sensitive | 밈·축하·칼로리·장식·paywall 제거, 중립 카피 | 핵심 선택권, 세션 나가기, 데이터 제어 |
| Reduce Motion | 이동·spring·burst·blink 제거 | 상태 전환과 완료 정보 |

## 8. Loading, empty, error, fallback

### 8.1 로딩 시간 계약

| 구간 | 표시 | 전환 |
|---:|---|---|
| `0~300ms` | 별도 spinner 없이 현재 레이아웃 유지 | 완료되면 바로 다음 화면 |
| `300ms~2s` | skeleton 또는 inline progress, 첫 상태 문구 | 입력 CTA를 중복 탭하지 못하게만 함 |
| `2~6s` | 두 번째 짧은 문구, `잠시만요` 반복 금지 | provider 결과 대기 |
| `6s` | provider 요청을 UX상 종료하고 rule fallback | `기본 추천으로 바로 이어갈게요` 안내 |

- schema validation 실패는 서버에서 1회만 재시도하며 전체 6초 예산을 넘기지 않는다.
- 장식 animation이 끝나기를 기다리지 않는다.
- 화면 전체 skeleton은 홈 최초 부팅에만 사용한다. 기존 데이터가 있으면 stale content와 작은 갱신 표시를 쓴다.

### 8.2 오류 등급

| 등급 | 예 | 표현 | 회복 |
|---|---|---|---|
| Inline | 필수값 없음, 형식 오류 | 해당 필드 아래 텍스트+아이콘 | 수정 후 즉시 해제 |
| Recoverable | 원격 저장, 공유, 가격 로드 실패 | 화면 맥락을 유지한 banner/card | `다시 시도`, `나중에` |
| Fallback | AI timeout, invalid schema, offline | 중립 info banner | 규칙 기반으로 자동 진행 |
| Blocking | 로컬 저장 불가, 삭제 재인증 실패 | 전용 ErrorState | 안전한 뒤로 가기와 재시도 |
| Safety | 알레르기 충돌, 긴급 신호 | 경고 또는 Sensitive 안내 | 안전 후보 재계산/지원 연결 |

기술 오류에만 `color.status.error`를 쓴다. 음식 선택과 보류 취소는 오류가 아니다. raw JSON, provider명, stack, HTTP code는 사용자에게 노출하지 않는다.

### 8.3 필수 빈 상태

| 화면 | 메시지 방향 | CTA |
|---|---|---|
| 홈 첫 사용 | 첫 선택을 빠르게 시작 | `지금 땡겨요` |
| 기록 없음 | 평가 없이 아직 기록이 없음을 설명 | `첫 선택 남기기` |
| 세이브 없음 | 사용자가 직접 넣거나 첫 추천을 저장할 수 있음 | `메뉴 추가` |
| 리포트 데이터 부족 | 정확한 패턴에는 기록이 조금 더 필요 | `지금 선택 시작` |
| 알림 없음/권한 거절 | 앱은 계속 사용 가능, 설정은 선택 | `설정 열기` 또는 `나중에` |

## 9. Sensitive mode와 안전 UX

### 9.1 진입

구토, 약물·완하제 보상, 장시간 굶기, 극단적 섭취 제한, 과도한 보상 운동, 음식/체중 관련 강한 자기혐오, 자해·자살 표현 등 safety classifier의 `sensitive` 또는 `escalate` 결과로 진입한다. UI가 신호를 진단명으로 번역하거나 사용자에게 낙인을 붙이지 않는다.

### 9.2 Sensitive override

1. 현재 세션의 tone을 `sensitive`로 고정하고 meme level을 무시한다.
2. 대신이는 중립 표정만 사용하고 wink, 눈물, 스티커 burst, 축하 motion을 제거한다.
3. 칼로리·체중·제한 조언과 Pro upsell을 숨긴다.
4. `먹지 마세요`, `다음 끼니를 줄이세요`, `운동으로 보상하세요`를 제안하지 않는다.
5. 사용자가 계속 가능한 안전한 선택, 세션 종료, 지원 안내 중 하나를 직접 고르게 한다.
6. 모드는 analytics에 자유 입력이나 trigger 원문 없이 category/level만 전송한다.

### 9.3 Escalate 화면

- 제목은 위협적 경고가 아니라 현재 안전을 확인하는 문장으로 쓴다.
- `지금 당장 자신을 해칠 가능성이 있거나 안전하지 않다면 지역 긴급전화 또는 응급실에 연락하세요`를 명확히 제공한다.
- 국가/지역별 번호와 링크는 검증된 remote support directory에서 가져온다. 값이 없으면 번호를 추측하지 않는다.
- 전문 지원은 앱 기능의 대체품처럼 광고하지 않고, 앱이 의료·응급 서비스가 아님을 밝힌다.
- 긴급 화면 직후에는 paywall, 알림 opt-in, 공유, 리뷰 요청을 노출하지 않는다.

## 10. 컴포넌트 시스템

### 10.1 토큰 계약

시각 값은 `BRAND_GUIDE.md`가 우선한다. 구현은 hex를 화면에 직접 쓰지 않고 다음 namespace를 사용한다.

- 배경: `color.bg.{canvas,surface,elevated,subtle,scrim,glass}`
- 본문: `color.text.{primary,secondary,muted,inverse}`
- 행동: `color.action.{primary,primaryPressed,primaryText}`
- 강조: `color.accent.{lilac,ice,lime}`
- 경계: `color.border.{subtle,strong,focus}`
- 상태: `color.status.{success,warning,error,info}`
- 타이포: `type.{display,hero,h1,h2,body,bodySmall,label,caption,numeric,button}`
- 레이아웃: `space`, `radius`, `border`, `shadow`, `opacity`, `motion.duration`, `motion.easing`, `icon.size`, `touchTarget`

기본 화면 gutter는 작은 폰 16dp, 일반 폰 20dp, 큰 폰 24dp를 사용한다. 내용 최대 폭은 560dp로 제한해 큰 기기에서도 질문이 흩어지지 않게 한다. touch target은 iOS 최소 44×44pt, Android 최소 48×48dp다.

### 10.2 상태 우선순위

```text
disabled > loading > error > focused > pressed > selected > default
```

- `disabled`는 opacity만 낮추지 않고 label/상태 설명을 유지한다.
- `loading`은 원래 label 폭을 유지해 layout shift를 막고 접근성 label에 `처리 중`을 더한다.
- `focused`는 2px focus ring과 플랫폼 focus semantics를 제공한다.
- `selected`는 색 외에도 check/radio와 accessibility state를 제공한다.
- 표시 전용 컴포넌트는 pressed/focused 대신 loading/error/selected에 해당하는 content variant만 구현한다.

### 10.3 컴포넌트 명세

| 컴포넌트 | Variant | 필수 상태 | 핵심 규칙 |
|---|---|---|---|
| `PrimaryButton` | full, inline, destructive-confirm | default/pressed/focused/disabled/loading | 화면당 원칙적으로 1개. destructive는 실제 삭제에만. 높이 최소 52. |
| `SecondaryButton` | outline, tonal | 동일 | 주 행동과 경쟁하지 않되 대비 AA 유지. |
| `GhostButton` | text, subtle | 동일 | 취소·나중에·타이머 즉시 종료. touch area는 라벨보다 크게. |
| `IconButton` | plain, surface, destructive | 동일 + selected | 아이콘 단독이면 접근성 이름 필수. 24px icon, 44/48 target. |
| `MoodChip` | single, multi | default/pressed/focused/disabled/loading/error/selected | 이유·상황 선택. 색만으로 선택 표시 금지. |
| `SensoryTag` | read-only, selectable | 동일 | spicy/sweet 같은 감각. 건강·선악 label 금지. |
| `CravingSlider` | hunger, craving-before/after | default/focused/disabled/error/selected | 0~10 정수, 현재 값 텍스트, 증감 action, 큰 글자 대체 control. |
| `OptionCard` | swap, planned, delay | default/pressed/focused/disabled/loading/error/selected | 세 타입 동등한 시각 무게. 카드 전체 tap + 내부 상세 action 중첩 금지. |
| `SaveMealCard` | compact, full | 동일 | 이름, 시간, 감각, 만족도. 사진 없음에서도 완성된 레이아웃. |
| `SessionCard` | compact, detail | 동일 | 날짜, 선택, 이유, 변화. 성공/실패 badge 금지. |
| `MascotBubble` | default, thinking, calm, sensitive | loading/error 포함 content 상태 | 사용자 평가 표정 금지. sensitive는 장식 없음. |
| `CoachMessage` | normal, info, fallback, sensitive | loading/error | AI 자유문을 그대로 렌더링하지 않고 검증된 content field만. |
| `TimerRing` | running, paused-background, completed, reduced-motion | loading/error/selected | end timestamp 기반. 숫자와 상태 label을 항상 함께 제공. |
| `ProgressHeader` | onboarding, session | default/focused | `2/3`과 단계 이름 제공. 진행률만으로 의미 전달 금지. |
| `BottomSheet` | action, picker, info | default/loading/error | iOS sheet/Android modal 기대 준수. 키보드에 가리지 않음. |
| `ConfirmDialog` | discard, destructive | default/loading/error | 기본 focus는 안전한 action. destructive 문구는 결과를 구체적으로. |
| `EmptyState` | first-use, filtered, data-insufficient | default/loading/error | 장식 1개, 제목/설명/CTA 1개. |
| `ErrorState` | inline, section, full | error/loading | 원인보다 다음 행동. retry와 안전한 exit 제공. |
| `Skeleton` | card, list, home | loading | 실제 레이아웃과 같은 크기, shimmer는 Reduce Motion에서 정적. |
| `PaywallCard` | monthly, annual | default/pressed/focused/disabled/loading/error/selected | 스토어 가격만 표시. trial/갱신 정보 숨김 금지. |
| `WeeklyInsightCard` | count, pattern, suggestion | default/loading/error/selected | 제안 1개, 먹지 않음을 성공으로 계산하지 않음. |
| `ShareCard` | story, square, portrait | default/loading/error/selected | 개인정보·칼로리 기본 제외. 실제 export와 preview 일치. |
| `SettingsRow` | navigation, value, danger | default/pressed/focused/disabled/loading/error/selected | 전체 행 tap, 현재 값 읽기, danger는 삭제만. |
| `ToggleRow` | standard, permission-linked | 동일 | label/description과 switch 상태를 한 접근성 그룹으로. |
| `SegmentedControl` | 2~4 options | 동일 | 4개 초과면 chip/list 사용. 큰 글자에서 가로 스크롤 금지. |
| `TextField` | single, multiline, numeric | default/pressed/focused/disabled/loading/error/selected | persistent label, help/error, clear action. placeholder만 label로 쓰지 않음. |
| `SearchField` | recent, list-filter | 동일 | 검색 취소·지우기 제공. 음식 입력의 주 action과 혼동하지 않음. |

## 11. Paywall 타이밍과 행동

### 11.1 자동 eligibility

다음 중 먼저 충족한 하나로 eligibility가 생긴다.

- 완료 세션 3회 이상: `monetization.auto_paywall_min_sessions = 3`
- 첫 주간 리포트 확인: `monetization.weekly_report_unlocks_paywall = true`

자동 paywall은 eligibility가 생긴 즉시 덮지 않는다. 사용자가 결과 화면을 끝내고 홈으로 완전히 돌아온 뒤, 다음 비핵심 전환에서만 노출한다. 자동 노출은 최대 7일 1회다: `monetization.auto_paywall_cooldown_days = 7`.

### 11.2 의도 기반 진입

최소 1회 세션 완료 뒤 사용자가 여섯 번째 세이브 메뉴, 상세 월간 리포트, Pro 테마/스킨/공유 카드, 패턴 알림을 명시적으로 누르면 `Pro 기능` label을 확인한 뒤 paywall로 갈 수 있다. Free 세이브 메뉴 기본 한도는 remote config의 `5`이며 기존 항목을 잠그거나 삭제하지 않는다.

### 11.3 절대 억제 조건

- 첫 세션 완료 전
- `C01`부터 `C09`까지, 세션 복구·타이머 복귀 중
- sensitive/escalate 모드와 안내 직후
- 오프라인 fallback 직후
- 삭제, 복원, 결제 오류 처리 중
- 앱 foreground 복귀 직후

Paywall에는 항상 보이는 닫기, 월간·연간 실제 현지 가격, 자동 갱신/해지 안내, 복원, 약관, 개인정보 링크가 있어야 한다. 가격 조회 실패 시 임의 가격을 넣지 않고 `가격을 불러오지 못했어요`와 재시도/닫기를 제공한다.

## 12. 모바일 키보드, Safe Area, 뒤로 가기

### 12.1 공통 레이아웃

- 화면 root는 상단·하단 safe area inset을 소비하며 상태바/gesture 영역에 텍스트나 tap target을 두지 않는다.
- 고정 CTA의 하단 여백은 `max(safeAreaBottom, 12dp)`이고 tab bar가 있으면 tab bar 위 12dp를 추가한다.
- 작은 화면과 큰 글자에서는 고정 CTA를 content 위에 덮지 않고 scroll content의 마지막 padding을 CTA 높이만큼 확보한다.
- edge-to-edge Android에서는 navigation bar 대비를 theme token으로 맞추고 투명 bar 뒤 tap target을 두지 않는다.

### 12.2 키보드

| 화면 | keyboard | 행동 |
|---|---|---|
| `C01` 음식 입력 | text, return=`다음` | 포커스 시 CTA를 키보드 바로 위에 유지. suggestion chip은 세로 스크롤 가능. |
| `O02/O03/V02` 직접 입력 | text | 현재 필드가 키보드 위 최소 12dp 보이도록 자동 scroll. |
| `C08` 메모 | multiline | CTA는 메모에 덮이지 않고 `완료`로 키보드를 닫을 수 있음. |
| 삭제/가격/지원 dialog | 키보드 비사용이 기본 | 외부 키보드 focus 순서 지원. |

- iOS는 keyboard frame과 interactive dismissal을 사용한다. 화면 전체를 무조건 위로 밀어 헤더가 사라지게 하지 않는다.
- Android는 `adjustResize`/동등 동작으로 실제 viewport를 줄이고, 키보드 위에 이중 inset을 더하지 않는다.
- 탭으로 키보드를 닫더라도 입력값을 저장하고 오류를 숨기지 않는다.
- IME action과 화면 CTA는 같은 idempotent submit 함수를 호출한다.

### 12.3 Back 계약

- iOS swipe back과 Android hardware/predictive back preview를 지원한다.
- 입력만 있고 저장하지 않은 경우에만 discard 확인을 띄운다. 단순 화면 이동에 반복 확인을 쓰지 않는다.
- `C04` 추천 요청 중 back은 요청을 UI상 취소하고 `C03` draft를 유지한다.
- `C06C` 타이머에서 back은 타이머를 백그라운드 유지할지 종료할지 선택하게 한다. 시스템 종료 시 end timestamp는 보존한다.
- modal/sheet는 먼저 닫히고, 그다음 화면 back이 처리된다.

## 13. 접근성

### 13.1 시각·텍스트

- 본문은 WCAG AA 기준 4.5:1, 큰 텍스트와 핵심 UI 경계는 최소 3:1을 목표로 한다.
- 정보와 선택은 색 하나에 의존하지 않는다. label, icon, border, state semantics를 함께 쓴다.
- Dynamic Type/Android font scale 200%에서 핵심 플로우를 완주할 수 있어야 한다.
- 버튼은 2줄까지 늘어나며 중요한 카피는 말줄임하지 않는다. 카드 고정 높이는 사용하지 않는다.
- Reduce Transparency에서는 glass를 불투명 `color.bg.surface/elevated`로 교체한다.
- 음식 사진에는 정보 의존성을 두지 않으며 저자극 보기에서 아이콘/텍스트만으로 동일 행동이 가능하다.

### 13.2 Screen reader

- 화면 진입 시 화면 제목 → 질문 → 설명 → 선택 → CTA 순서로 읽는다.
- 선택 change 후 새 상태를 짧게 announce하고 focus를 임의로 화면 상단에 되돌리지 않는다.
- Slider는 `배고픔, 6/10, 보통보다 조금 높음`처럼 label/value를 함께 읽고 increment/decrement action을 제공한다.
- OptionCard는 `세 가지 중 첫 번째, 5분 보류, 선택되지 않음`처럼 순서와 상태를 읽되 `추천 1위`라고 하지 않는다.
- Timer는 매초 announce하지 않는다. 시작, 1분 남음(앱이 열려 있을 때), 완료만 알리고 언제든 종료 button을 읽을 수 있어야 한다.
- 장식 마스코트는 숨기고, 의미 있는 상태일 때만 `대신이가 기본 추천을 준비 중이에요`처럼 대체 label을 제공한다.

### 13.3 모션·촉각·인지

- Reduce Motion에서는 spring, parallax, blink, burst를 제거하고 120ms 이하 opacity로 대체한다.
- haptic은 완료·타이머 상태의 보조 수단이며 유일한 신호가 아니다.
- 빠른 깜빡임, 화면 흔들림, 자동 반복 neon을 사용하지 않는다.
- 한 화면에 질문 하나, primary action 하나를 원칙으로 하고 시간 제한 입력은 두지 않는다.
- 오류는 `무엇이 잘못됐는지 + 지금 할 수 있는 일` 순서로 쓴다.

### 13.4 플랫폼 QA 기준 기기

- iOS: 작은 iPhone, 일반 크기 iPhone, Pro Max; VoiceOver, Dynamic Type 최대, Reduce Motion/Transparency, Dark Mode.
- Android: 작은 저가형, 일반 중간 성능; TalkBack, font scale 200%, gesture/3-button navigation, dark theme, keyboard resize.
- 두 플랫폼 모두 safe area, landscape/회전 복원, background timer, 강제 종료 세션 복구, 네트워크 변화, 시스템 테마 전환을 확인한다.

## 14. 분석 이벤트 연결

UI는 분석 adapter만 호출하며 음식명, 메모, 건강 자유 입력을 보내지 않는다.

| 화면/행동 | 이벤트 |
|---|---|
| `O01/O05` | `onboarding_started`, `guest_session_created`, `onboarding_completed` |
| `H01 → C01` | `craving_started` |
| `C01/C02/C03` | `food_entered`(category only), `hunger_selected`(bucket), `reason_selected` |
| `C04` | `recommendation_requested`, `recommendation_succeeded/failed`, `recommendation_fallback_used` |
| `C05/C06*` | `recommendation_viewed`, `option_selected`, `planned_portion_created` |
| `C06C` | `timer_started/completed/cancelled` |
| `C08` | `outcome_logged`(category/bucket only) |
| `V02/V03` | `save_meal_created/selected` |
| `W01/W02` | `weekly_report_viewed`, `share_card_created`, `share_started` |
| `P01` | `paywall_viewed`, `trial_started`, `subscription_started/restored` |
| `X01/X02` | `safety_mode_triggered`(level/category only) |
| `M02/M04/M06` | `calories_hidden`, `notification_opted_in`, `data_export_requested`, `account_deleted` |

## 15. P0 디자인·구현 수용 체크

### 핵심 흐름

- [ ] 신규 사용자가 5단계 이하 온보딩 뒤 게스트로 홈에 진입한다.
- [ ] `치킨 → 6 → 스트레스 → fallback → 5분 보류 → 결과 저장`을 네트워크 없이 완주한다.
- [ ] 앱 재시작과 background 후 타이머·draft·완료 통계가 복원된다.
- [ ] 세 선택이 같은 위계이고 어느 선택도 실패로 기록되지 않는다.
- [ ] 중복 탭과 재시도에도 결과/통계가 한 번만 생성된다.

### 상태·안전

- [ ] 홈/기록/세이브/리포트에 loading, empty, recoverable error가 있다.
- [ ] AI timeout/invalid schema는 1회 이내 재시도 후 rule fallback으로 진행한다.
- [ ] sensitive mode에서 밈·칼로리·celebration·paywall이 사라진다.
- [ ] 알레르기 충돌 메뉴는 선택 카드에 노출되지 않는다.
- [ ] 데이터 삭제와 구독 복원이 paywall 없이 접근 가능하다.

### 모바일·접근성

- [ ] 키보드가 음식 입력·메모·저장 CTA를 가리지 않는다.
- [ ] iOS safe area/swipe back과 Android edge-to-edge/back이 자연스럽다.
- [ ] touch target, 대비, 큰 글자, VoiceOver/TalkBack, Reduce Motion을 통과한다.
- [ ] 저자극 보기에서 사진 없이 같은 핵심 행동을 할 수 있다.
- [ ] paywall은 최초 세션/진행 중 세션/sensitive 상태에서 0회 노출된다.

## 16. 구현 handoff 규칙

1. 시각 값이 충돌하면 `BRAND_GUIDE.md`, 행동·상태가 충돌하면 이 문서, 문구가 충돌하면 `CONTENT_GUIDE.md`를 따른다.
2. 화면 문자열을 코드에 직접 쓰지 않고 key 기반 resource로 호출한다.
3. 디자인 파일의 frame과 개발 route, QA case에 이 문서의 화면 ID를 붙인다.
4. P0 밖 아이디어는 이 문서에 추가하지 않고 `BACKLOG.md`로 보낸다.
5. 실제 기기에서 검증하지 않은 상태는 완료로 표시하지 않는다.
