# DAESIN Korean Store Metadata Draft

> Status: copy draft only · 2026-07-14  
> Do not submit until shipping behavior, provider disclosures, prices, policy URLs and actual screenshots are verified.

## 1. Core metadata

### App Store title / primary Korean name

**대신 – 야식·배달 충동 브레이크**

### Subtitle

**결제 전 5분, 내 선택을 되찾는 시간**

### Google Play short description

**야식과 배달이 당기는 순간, 잠시 멈추고 내가 직접 고르는 AI 충동 브레이크.**

### Apple App Store keyword draft

`간식,식습관,감정기록,마음챙김,타이머,식사계획,세이브메뉴,야간루틴,식사다이어리`

앱 이름·부제에 이미 있는 `대신`, `야식`, `배달`, `충동`, `브레이크`, `결제`, `5분`, `선택`은 중복하지 않는다. 키워드는 체중 감량, 식욕 억제, 폭식 치료, 의료 진단을 암시하지 않는다. 공식 한도와 검증 근거는 [ASO_VALIDATION_NOTES.md](./ASO_VALIDATION_NOTES.md)에 분리해 기록한다.

## 2. Promotional text draft

**배달앱을 열기 전, 대신을 먼저 열어보세요. 배고픔과 지금의 마음을 확인하고, 먹기·계획하기·5분 보류 중 내 선택을 직접 고를 수 있어요.**

## 3. Full description draft

### 충동 대신, 내가 고른 한 끼

야식이나 배달이 당기는 순간, 손가락이 자동으로 결제까지 가기 전에 잠깐 멈춰보세요. 대신은 현재 배고픔과 가장 가까운 이유를 확인하고, AI와 규칙 기반 시스템으로 지금 가능한 선택을 정리해 드리는 충동 브레이크 앱입니다.

### 세 가지 중 내가 직접 골라요

- **대신 먹기** — 지금 당기는 감각과 준비 시간을 고려한 세이브 메뉴를 살펴봐요.
- **계획해서 먹기** — 원래 먹고 싶던 음식을 존중하면서 양과 방법을 먼저 정해요.
- **5분 보류** — 타이머를 켜고 잠시 뒤 충동 강도를 다시 확인해요. 언제든 바로 끝낼 수 있어요.

어느 선택도 실패가 아닙니다. 대신의 목표는 음식을 참게 하는 것이 아니라, 자동 주문 대신 한 번 멈춘 뒤 스스로 선택하도록 돕는 것입니다.

### 나에게 맞게, 안전하게

- 회원가입 없이 게스트로 바로 시작
- 알레르기와 식이 제한을 추천보다 먼저 반영
- 담백·친구·밈 말투와 밈 강도
- 칼로리 숨김 기본값과 저자극 보기
- 세이브 메뉴와 실제 만족 기록
- 선택 중심의 기록과 주간 리포트
- 외부 AI가 늦거나 실패해도 이어지는 규칙 기반 추천
- 내 데이터 내보내기와 삭제

### 대신 Pro

핵심 충동 브레이크는 무료로 계속 사용할 수 있습니다. Pro는 세이브 메뉴 확장, 더 자세한 패턴 리포트, 고급 개인화와 꾸미기 기능을 제공합니다. 실제 상품, 가격, 기간과 무료 체험 조건은 구매 화면에 표시되는 스토어 정보를 확인해 주세요. 구독은 스토어 설정에서 관리하거나 해지할 수 있고, 앱에서 구독 복원을 이용할 수 있습니다.

대신은 의료 서비스가 아니며 질환의 진단·치료, 식욕 억제 또는 체중 감량을 제공하지 않습니다. 음식이나 몸에 대한 생각이 일상을 버겁게 한다면 자격을 갖춘 전문가 또는 신뢰하는 사람에게 도움을 요청할 수 있습니다.

## 4. Subscription disclosure template

실제 StoreKit/Play Billing 상품 정보가 정상 로드된 경우에만 placeholder를 치환해 표시한다.

> `{plan_name}` 구독은 `{price}/{period}`이며, `{trial_end_date}`까지 무료 체험 후 자동 갱신됩니다. 결제와 갱신은 사용 중인 스토어 계정에 청구됩니다. 현재 기간이 끝나기 전에 스토어 설정에서 해지할 수 있습니다. 구매 복원, 이용약관, 개인정보처리방침과 닫기 버튼을 항상 확인할 수 있습니다.

- 가격을 불러오지 못하면 구매 CTA를 비활성화하고 핵심 무료 기능으로 돌아갈 수 있게 한다.
- 연간 절약률은 월간·연간 현지 가격이 모두 있을 때 런타임 계산값만 표시한다.
- 내부 가격 가설, 고정 환율, 가짜 countdown은 스토어 copy에 넣지 않는다.

## 5. Privacy store copy draft

### Short disclosure

**게스트 기록은 기본적으로 기기에 저장됩니다. 계정을 연결한 경우에만 동기화 대상이 될 수 있어요. 입력한 음식명, 메모, 알레르기·식이 제한 원문은 제품 분석이나 광고 이벤트로 보내지 않으며, 설정에서 데이터를 내보내거나 삭제할 수 있습니다.**

### Data disclosure review map

아래는 portal 입력 전 검토할 후보 범주이며 최종 답변이 아니다. shipping SDK와 network capture에 따라 수정한다.

| Candidate category | Possible DAESIN data | Purpose | Submission check |
|---|---|---|---|
| User identifiers | guest/account profile ID | app functionality, sync | guest/account 연결 여부에 따른 linked 정의 확인 |
| Health / sensitive preference | allergy, dietary restriction, calorie view preference | recommendation safety | 정확한 store taxonomy 확인 |
| User content | food text, notes, save meals | app functionality | analytics/ads 전송 금지 확인 |
| Usage data | approved event names, coarse enums, counts | analytics | consent/opt-out와 linked 여부 확인 |
| Diagnostics | crash and non-sensitive error code | app stability | raw input/token redaction 확인 |
| Purchases | product/entitlement status | subscription | store/provider 처리 범위 확인 |

Planned stance: third-party advertising and cross-app tracking are not part of Launch MVP. “No tracking”은 실제 SDK 설정, provider 계약과 network capture가 이를 증명할 때만 portal에서 선택한다.

출시 전 채울 항목:

- 개인정보처리방침 URL: `TBD`
- 이용약관 URL: `TBD`
- 지원 URL/이메일: `TBD`
- 데이터 삭제 URL: `TBD`
- 사업자/운영자 정보: `TBD`
- AI·analytics·error·subscription provider 및 처리 지역/보존 기간: `TBD`

## 6. Six-shot actual capture list

모든 이미지는 출시 후보 빌드의 demo fixture로 실제 캡처한다. 디자인 source of truth는 `docs/daesin/BRAND_GUIDE.md`다.

| # | Headline | Actual screen | Capture state | Theme | Truthfulness check |
|---:|---|---|---|---|---|
| 1 | **배달앱보다 5분 먼저 열어요** | Craving Gate | cold launch, 음식 입력과 기본 대신이 | Milk Moon | 입력 전에 설명·통계가 앞서지 않음 |
| 2 | **지금 땡기는 걸 말해줘요** | 음식 입력 | 승인된 synthetic 최근 음식 | Night Bloom | 실제 입력 UI와 일치 |
| 3 | **배고픔과 마음을 같이 봐요** | 상태 확인 | 배고픔 6, 이유 선택 전 | Night Bloom | 한 화면에 질문 하나 |
| 4 | **세 가지 중 내가 직접 골라요** | 분석 결과/선택 카드 | swap/planned/delay 모두 미선택 | Night Bloom | 카드 무게가 동등함 |
| 5 | **먹기로 해도 실패가 아니에요** | 계획해서 먹기 | 양·방법 선택, 죄책감 copy 없음 | Milk Moon | 체중·칼로리 hero 없음 |
| 6 | **오늘 만들 한 끼를 대신 골라요** | 오늘의 레시피 상세 | 허용 출처·권리·영양 신뢰도 fixture | Milk Moon | 출시 후보의 출처·저장·지금 만들기와 일치 |

### Capture procedure

1. Release candidate build/version과 fixture version을 기록한다.
2. iPhone과 Android에서 각 플랫폼 UI를 별도로 캡처한다. 한 플랫폼 캡처를 늘려 재사용하지 않는다.
3. 이름, 이메일, 자유 메모, 실제 음식 기록과 알림을 포함하지 않는다.
4. 상태바 시각, 글자 확대 기본값, theme, locale `ko-KR`을 통일한다.
5. 앱에 없는 UI, 그래프, 가격, badge, 알림을 후편집으로 추가하지 않는다.
6. 최종 device class, pixel size, alpha, feature graphic 요구 사항은 제출 시점 공식 portal validator로 확인한다.

## 7. App review notes draft

- 앱은 18세 이상 성인을 대상으로 하며 회원가입 없이 핵심 흐름을 확인할 수 있습니다.
- 첫 실행에서 게스트로 시작한 뒤 `지금 땡겨요`를 눌러 음식, 배고픔, 이유, 세 가지 선택을 확인할 수 있습니다.
- 외부 AI 장애 시 규칙 기반 fallback이 동작합니다. 심사용 build가 mock이면 production AI라고 주장하지 않고 reviewer note에 명시합니다.
- 현재 mock review build에서는 구매와 자동 paywall이 비활성입니다. 첫 세션·진행 중 세션·sensitive mode 억제는 pure eligibility contract로 검증했지만 UI 정책 통합 전에는 운영 결제를 켜거나 해당 동작을 심사 메모에서 주장하지 않습니다.
- 설정의 `내 데이터 내보내기`, `내 데이터 삭제`에서 데이터 권리 흐름을 확인할 수 있습니다.
- 리뷰 계정, sandbox 상품과 테스트 단계는 submission build가 확정된 뒤 여기에 추가합니다.

### Web QA capture evidence (제출용 아님)

390×844 web 릴리스 후보에서 실제 캡처한 원본입니다. 합성 목업이 아니지만 iPhone·Android store 제출 규격이나 native UI 통과 증거로 사용하지 않습니다.

1. `assets/daesin/store/01-adult-onboarding-web-390x844.png`
2. `assets/daesin/store/02-home-web-390x844.png`
3. `assets/daesin/store/03-three-options-web-390x844.png`
4. `assets/daesin/store/04-delay-timer-web-390x844.png`
5. `assets/daesin/store/05-completion-web-390x844.png`
6. `assets/daesin/store/06-weekly-report-web-390x844.png`

## 8. Metadata QA

- [ ] title/subtitle/description이 현재 portal 글자 수와 금칙어 검사를 통과한다.
- [ ] 앱 UI, 상품, provider, 무료/Pro 차이와 설명이 일치한다.
- [ ] AI·의료·체중 감량·효과·절약률의 근거 없는 claim이 없다.
- [ ] privacy copy와 portal disclosure가 실제 network behavior와 일치한다.
- [ ] six-shot set은 실제 release candidate에서 캡처했다.
- [ ] iPhone/Android 자산을 각 플랫폼에서 별도로 검수했다.
- [ ] 지원·privacy·terms·delete URL이 공개 HTTPS에서 열린다.
