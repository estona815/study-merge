# DAESIN Brand Guide

> Status: v1 brand contract · 2026-07-14  
> Visual source of truth: this document  
> Product: **대신 – 야식·배달 충동 브레이크**  
> Core line: **충동 대신, 내가 고른 한 끼.**

## 1. Brand contract

대신은 음식을 금지하거나 사용자를 평가하는 앱이 아니다. 주문 직전의 자동적인 흐름을 잠시 늦추고, 사용자가 자신의 상태를 확인한 뒤 직접 선택하도록 돕는 **AI 충동 브레이크**다.

브랜드가 매 순간 전달해야 하는 감정은 다음 네 가지다.

1. **Non-judgmental** — 먹기로 해도 실패가 아니다.
2. **Intimate** — 건강 대시보드보다 새벽의 비밀 다이어리에 가깝다.
3. **Lightly witty** — 민감한 순간을 가볍게 풀되 사용자를 웃음거리로 만들지 않는다.
4. **Premium and calm** — 예쁘지만 시끄럽지 않고, 유료 제품처럼 정돈되어 있다.

### Voice anchors

- Product promise: **배달앱보다 5분 먼저 여는 앱.**
- Brand belief: **먹는 선택도, 멈추는 선택도 내가 고르면 된다.**
- Mascot role: **장바구니 결재를 잠시 보류해 주는 작은 비서.**

### One visual direction

**Night Bloom / Milk Moon**은 서로 다른 콘셉트가 아니라 하나의 세계를 이루는 다크·라이트 페어다.

- **Night Bloom**은 기본 경험이다. 새벽 1시의 깊은 플럼, 반투명 카드, 하트 핑크와 라일락의 작은 빛을 사용한다.
- **Milk Moon**은 같은 구조를 낮은 대비의 장식과 밀크 화이트 배경으로 반전한 라이트 모드다.
- 두 테마 모두 같은 의미 토큰, 타이포 계층, 마스코트 구조, 모션 문법을 사용한다.
- 시스템 테마를 따르는 옵션을 제공하며, 첫 설치의 제품 기본값은 Night Bloom으로 한다.

핵심 장면은 “새벽 1시, 혼자 보는 비밀 감정 다이어리와 세련된 AI 메신저의 결합”이다. 다크 큐트, 소프트 고스, 사이버 다이어리, Y2K의 질감은 **작은 스티커와 표면 처리**에만 쓰고, 정보 구조는 차분한 현대 모바일 앱으로 유지한다.

## 2. Visual language

### Composition

- 넓은 여백 안에 하나의 질문 또는 하나의 선택만 둔다.
- 카드는 2~3단 깊이까지만 사용한다. 게임식 패널 중첩과 과도한 배지는 금지한다.
- 둥근 카드, 얇은 헤어라인, 국소적인 광택으로 “소유하고 싶은 디지털 다이어리”의 촉감을 만든다.
- 글리터, 별, 리본은 정보가 없는 여백에만 두며 한 화면의 장식 군집은 최대 2개다.
- 유리 효과는 배경과 텍스트 대비를 해치지 않는 보조 표면이다. 본문 뒤에 강한 블러나 무늬를 두지 않는다.

### Signature motifs

주요 모티프는 작은 하트, 초승달, 별, 채팅 버블, 디지털 커서, 영수증 스탬프, `결재 보류` 도장, 잠금, 타이머 링, 다이어리 스티커다. 한 화면에서는 대표 모티프 하나와 보조 모티프 하나만 조합한다.

픽셀 형태의 작은 눈물은 날씨나 감정의 추상 기호로만 제한적으로 사용할 수 있다. 얼굴의 상처, 울음의 미화, 자해 암시와 결합하지 않는다.

### Surface treatment

- Night Bloom의 글래스 카드는 밝은 테두리 1px와 낮은 불투명도 표면을 함께 사용한다.
- Milk Moon은 블러보다 불투명한 밀크 카드와 부드러운 보랏빛 그림자를 우선한다.
- 그라디언트는 큰 배경 또는 대표 CTA의 미세한 깊이에만 사용한다. 텍스트, 상태, 작은 아이콘에는 단색을 쓴다.
- 형광색은 넓게 칠하지 않는다. 애시드 라임은 5% 미만의 작은 신호나 스티커 디테일만 허용한다.

## 3. Semantic color system

색상은 화면 코드에 직접 입력하지 않고 아래 semantic token을 사용한다. 같은 토큰은 두 테마에서 같은 의미를 가진다.

| Token | Night Bloom | Milk Moon | Use |
|---|---:|---:|---|
| `color.bg.canvas` | `#160F1E` | `#FFF9F7` | 전체 화면 배경 |
| `color.bg.surface` | `#22162B` | `#FFFFFF` | 기본 카드·시트 |
| `color.bg.elevated` | `#2C1D38` | `#FFF1F5` | 선택 카드·떠 있는 표면 |
| `color.bg.subtle` | `#362443` | `#F4EDF6` | 칩·세컨더리 영역 |
| `color.bg.scrim` | `rgba(10, 6, 14, .68)` | `rgba(53, 38, 62, .28)` | 모달 배경 |
| `color.bg.glass` | `rgba(255, 255, 255, .065)` | `rgba(255, 255, 255, .84)` | 장식용 글래스 표면 |
| `color.text.primary` | `#F8F1F7` | `#35263E` | 제목·본문 |
| `color.text.secondary` | `#D3C4D5` | `#62536A` | 보조 설명 |
| `color.text.muted` | `#B09FB5` | `#74667B` | 캡션·메타데이터 |
| `color.text.inverse` | `#2A1320` | `#FFFFFF` | primary fill 위 텍스트 |
| `color.action.primary` | `#FF72AE` | `#B92D6B` | 핵심 CTA·선택 상태 |
| `color.action.primaryPressed` | `#FF93C2` | `#932054` | primary pressed |
| `color.action.primaryText` | `#2A1320` | `#FFFFFF` | 핵심 CTA 라벨 |
| `color.accent.lilac` | `#B99AFF` | `#6C45B8` | AI·집중·포커스 |
| `color.accent.ice` | `#8FDFF5` | `#176C84` | 타이머·정보 |
| `color.accent.lime` | `#DDF76A` | `#586B00` | 5% 미만의 작은 포인트 |
| `color.border.subtle` | `#4B3856` | `#E3D8E5` | 카드 구분선 |
| `color.border.strong` | `#806C88` | `#9D8AA3` | 활성·입력 경계 |
| `color.border.focus` | `#B99AFF` | `#6C45B8` | 키보드·스크린리더 포커스 |
| `color.status.success` | `#75DDB0` | `#167A59` | 선택·저장·계획 완료 |
| `color.status.warning` | `#F4C966` | `#835800` | 확인이 필요한 비위험 주의 |
| `color.status.error` | `#FF8791` | `#B52B45` | 기술 오류·실제 위험 경고만 |
| `color.status.info` | `#8FDFF5` | `#176C84` | 중립 안내 |

### Color rules

- `success`는 “먹지 않음”을 뜻하지 않는다. **선택 완료, 기록 저장, 계획 실행**에만 사용한다.
- 세 가지 선택 카드에는 초록/노랑/빨강의 선악 또는 신호등 체계를 적용하지 않는다. 모두 중립 표면으로 시작하고 선택된 카드만 `action.primary` 또는 `border.focus`로 표시한다.
- 음식, 주문, 먹기 선택을 `error`로 표시하지 않는다. 빨강 계열 오류 색은 네트워크 오류, 삭제 경고, 알레르기 위험처럼 실제 주의가 필요한 상황에만 쓴다.
- 본문은 최소 WCAG AA를 목표로 한다. 현재 primary/secondary/muted 본문 조합은 각 canvas에서 4.5:1 이상이 되도록 정했다.
- 큰 텍스트나 장식 색이 통과하더라도 작은 본문 용도로 자동 승격하지 않는다.
- OLED 다크 화면에서 순수 검정 배경과 순수 흰색 본문을 맞붙이지 않는다.
- 색만으로 상태를 전달하지 않는다. 아이콘, 라벨, 선택 표시를 함께 제공한다.

## 4. Typography

한국어 가독성, 플랫폼 자연스러움, 접근성을 우선한다. 초기 출시의 앱 UI는 별도 폰트 파일을 번들하지 않고 **플랫폼 시스템 글꼴**을 사용한다. iOS와 Android의 기본 Korean fallback을 존중하고, 동일한 크기·행간·위계로 브랜드 일관성을 만든다.

로고는 향후 자체 제작한 커스텀 레터링 아웃라인을 사용한다. 장식용 외부 폰트는 본문, 버튼, 입력, 타이머 숫자에 사용하지 않는다.

| Style | Size / line | Weight | Tracking | Use |
|---|---:|---:|---:|---|
| Display | 40 / 48 | 700 | `-0.02em` | 스토어·온보딩의 짧은 문장 |
| Hero | 32 / 40 | 700 | `-0.018em` | 홈 핵심 메시지 |
| Heading 1 | 28 / 36 | 700 | `-0.015em` | 화면 제목 |
| Heading 2 | 22 / 30 | 700 | `-0.01em` | 섹션 제목 |
| Body | 17 / 26 | 400 | `0` | 기본 본문 |
| Body Small | 15 / 22 | 400 | `0` | 보조 설명 |
| Label | 14 / 20 | 600 | `0` | 필드·칩·탭 |
| Caption | 12 / 18 | 500 | `0.005em` | 메타데이터 |
| Numeric | 40 / 44 | 700 | `-0.02em` | 타이머·핵심 수치 |
| Button | 16 / 22 | 700 | `0` | CTA |

### Type rules

- 한국어에 넓은 자간, 전부 대문자인 영문 장문, 장식적인 이탤릭을 적용하지 않는다.
- 숫자는 지원되는 경우 tabular figures를 사용해 타이머가 흔들리지 않게 한다.
- 본문 한 줄은 모바일 기준 약 18~26자 범위가 읽기 좋다. 설명을 카드 폭 전체에 빽빽하게 채우지 않는다.
- Dynamic Type과 Android font scaling을 지원한다. 최대 접근성 크기에서 CTA 라벨은 2줄까지 허용하고, 중요한 문장을 말줄임하지 않는다.
- Display와 Hero는 마케팅성 화면에만 제한하고, 한 화면에 Display 계층은 하나만 둔다.
- 스토어용 커스텀 폰트를 추가하려면 라이선스 원문, 배포 허용 범위, 파일 출처와 버전을 에셋 등록부에 먼저 남긴다.

## 5. Logo, icon and splash

### Wordmark

- 한글 `대신`을 우선하며, 영문 `DAESIN`은 보조 서명으로만 사용한다.
- 자체 레터링의 한 획에 마스코트의 **pause gap**을 넣어 브랜드 연결성을 만든다. 가독성을 해치는 하트 대체 글자는 사용하지 않는다.
- 워드마크에 그림자, 네온 외곽선, 여러 색 그라디언트를 동시에 사용하지 않는다.
- 최소 여백은 워드마크 `대` 글자 높이의 0.5배다.

### App icon

- Night Bloom canvas 위에 대신이의 머리 실루엣 하나만 둔다. 글자, 문장, 작은 별 군집은 넣지 않는다.
- 하트-타이머 외곽과 pause gap이 작은 크기에서도 읽히도록 디테일을 3개 이하로 제한한다.
- 아이콘 마스터는 벡터로 제작하고, 플랫폼별 마스크를 소스에 굽지 않는다.
- Android adaptive icon은 배경과 foreground를 분리하고 시스템 크롭·패럴랙스의 안전 영역에서 얼굴이 잘리지 않게 검수한다.

### Splash

- 중앙에 대신이 또는 워드마크 하나만 사용한다.
- 앱 초기화보다 긴 장식 시간을 만들지 않는다. 브랜드 모션은 600ms 이내이며 초기화가 끝나면 즉시 전환한다.
- 네트워크 응답을 기다리게 하지 않는다. Reduce Motion에서는 정적 심볼과 짧은 crossfade만 사용한다.

## 6. Original mascot: 대신이

### Character premise

대신이는 하트와 타이머가 결합된 작은 비서다. 사용자를 감시하거나 식사를 막는 존재가 아니라, 결제 버튼 앞에서 “잠깐, 이 선택은 네가 직접 해도 돼”라고 시간을 돌려주는 동료다. 사람이나 특정 동물을 의인화하지 않으며 성별을 부여하지 않는다.

### Signature silhouette

100×100 unit 제작 그리드를 기준으로 한다.

- 몸통은 `x=14…86`, `y=16…92` 안의 비대칭 라운드 하트다. 왼쪽 로브를 오른쪽보다 약 6% 크게 하고, 아래 끝은 뾰족하지 않은 짧은 pill 형태로 마감한다.
- 오른쪽 위 `1시` 방향에 둥근 직사각형 타이머 crown 하나를 붙인다. crown은 귀나 리본처럼 보이지 않게 몸통 폭의 12% 이하로 둔다.
- 몸통 안에는 약 280°의 얇은 타이머 링을 둔다. `4시` 방향을 비워 둔 28°의 **pause gap**이 대신이의 고유 식별자다.
- 두 눈은 세로 capsule 형태이며 얼굴 중심보다 4 unit 아래에 둔다. 과도한 애니메이션 눈이나 속눈썹으로 성별을 암시하지 않는다.
- 기본형은 입을 작은 둥근 획 하나로만 표현한다. 손발은 64px 이상 일러스트에서만 추가하며 앱 아이콘과 32px 이하 UI에서는 생략한다.
- 실루엣만 보아도 하트, 타이머 crown, pause gap 세 요소가 읽혀야 한다.

이 구조는 제작을 위한 오리지널 명세다. 기존 캐릭터의 눈·얼굴 비율, 포즈, 액세서리 또는 상품 실루엣을 참조해 맞추지 않는다.

### Mascot palette

- 기본 body: `color.action.primary`
- 링·하이라이트: Night Bloom에서는 `color.text.primary`, Milk Moon에서는 `color.bg.surface`
- 눈·입: Night Bloom `#2A1320`, Milk Moon `#35263E`
- thinking 보조광: `color.accent.lilac`
- timer 보조광: `color.accent.ice`
- 축하 포인트: `color.accent.lime`는 한 점 또는 한 별에만 사용

48px 이하에서는 그라디언트, 그림자, 볼터치를 제거한다. 24px에서는 body, crown, 눈, pause gap만 남긴다.

### Expression set

| State | Face / pose | Meaning guardrail |
|---|---|---|
| 기본 | 열린 capsule 눈, 짧은 중립 입 | 먼저 말을 걸되 재촉하지 않음 |
| 기다리는 중 | 눈동자만 타이머 진행 방향을 봄 | 사용자를 가두거나 감시하지 않음 |
| 생각 중 | 한쪽 눈이 8° 기울고 lilac 점 1개 | AI가 과장되게 “고민”하는 연출 금지 |
| 안심 | 눈 아래 곡선, 작은 숨 표시 | 먹지 않아서 안심한 것으로 해석하지 않음 |
| 장난 | 한쪽 눈 짧은 wink, pause gap 반짝임 | 사용자가 선택을 확정한 뒤에만 사용 |
| 차분 | 반쯤 닫힌 눈, 입 없음 | 야간·저자극 보기용 |
| 민감 모드 | 같은 크기의 중립 눈, 장식 없음 | 웃음·눈물·밈을 모두 제거 |
| 주간 리포트 축하 | 두 눈 열린 채 별 2개 | “참음”이 아니라 기록과 자기 선택을 축하 |

### Mascot prohibitions

- 먹는 사용자를 비웃기, 고개 젓기, 한숨 쉬기, 실망하거나 화내기
- 체형이 커지거나 마르는 변형, 배를 재거나 몸무게를 재는 포즈
- 굶어서 힘이 빠진 연출, 폭식으로 배가 터지는 연출
- 상처, 붕대, 피, 알약, 주사, 칼날, 해골, 구속구와 결합
- 감시 카메라 같은 눈, 경찰·심판·의사 역할
- 기존 캐릭터 IP의 색 배치, 얼굴 비율, 리본·귀·꼬리·의상 조합 모사

## 7. Motion and haptics

모션은 반응을 빠르게 설명하고 감정을 부드럽게 만드는 도구다. 핵심 행동을 기다리게 만드는 장식이 아니다.

| Interaction | Duration | Motion |
|---|---:|---|
| CTA press | 80–120ms | `scale 1 → .98`, release 140ms |
| Card select | 220–320ms | low-bounce soft spring, border/fill 동시 전환 |
| Tab change | 160–220ms | opacity crossfade + 4px 이하 이동 |
| Modal / sheet | platform default | 플랫폼 제스처와 속도를 우선 |
| Mascot blink | 120–160ms | 8–14초 사이 비주기적 1회, 화면당 최대 2회 |
| Timer ring | 실제 시간과 동기화 | 일정한 연속 진행, 펄스 없음 |
| Completion burst | 280–360ms | 별·하트 합계 최대 6개, 한 번만 |
| Error | 160ms | 색·아이콘 전환, 화면 흔들림 없음 |

- 선택 완료 haptic은 light 한 번, 중요한 확정은 medium 한 번으로 제한한다.
- `5분 보류` 시작과 종료에만 timer haptic을 사용하고 매초 진동하지 않는다.
- 빠른 깜빡임, 강한 흔들림, 무한 네온, 자동 재생 장식 루프, CTA 지연을 금지한다.
- Reduce Motion에서는 scale과 이동을 opacity 120ms 이하로 대체하고, burst와 blink를 제거한다. 타이머는 숫자와 정적 진행 상태로도 정보를 전달해야 한다.

## 8. Prohibited motifs and visual claims

다음 요소는 브랜드의 어떤 화면, 광고, 스토어 이미지, 스티커에도 사용하지 않는다.

- 피, 상처, 칼날, 면도날, 주사기, 알약·약물 페티시, 자해·자살 암시
- 붕대와 상처의 직접 결합, 해골·위험 표식이 붙은 음식
- 지나치게 마른 몸, 뼈가 드러난 신체, 체중계 바늘, 줄자, 신체 치수, before/after 체형
- 빈 접시를 성공으로, 많이 담긴 접시를 실패로 묘사하는 이미지
- 지방 연소 불꽃, 허리 라인, 체중 감량 광고형 수치, 큰 칼로리 숫자
- 음식 선택을 신호등 색, 선악, 천사와 악마로 구분하는 장치
- 공포스러운 눈, 감시 카메라, 감옥·수갑·봉쇄처럼 선택권을 빼앗는 은유
- 게임식 콤보, 연속 참기 streak, 랭킹, 패배 도장
- 과도한 네온, 읽기 어려운 글리치, 화면 전체 글리터, 저가형 스티커 콜라주
- 의료 진단, 식욕 억제, 체중 감량 효과를 암시하는 그래프·배지·인증 마크

## 9. Copy guardrails

### Preferred language

- “지금 가능한 선택을 보여드릴게요.”
- “먹어도 괜찮아요. 주문하기 전에 양과 방법만 먼저 정해볼까요?”
- “치킨이 결재를 올렸습니다. 승인 전에 배고픔부터 확인할게요.”
- “장바구니는 도망가지 않습니다.”
- “먹기로 정했군요. 죄책감은 주문 목록에서 제외하겠습니다.”
- “5분 뒤에도 같은 안건이면 다시 회의를 열어요.”

밈은 상황을 의인화하되 사용자를 의인화하거나 평가하지 않는다. 민감 모드에서는 밈, 과장, 느낌표, 캐릭터 wink를 제거한다.

### Prohibited copy

- “또 실패했네요.” / “의지가 약하네요.” / “이 정도도 못 참나요?”
- “이걸 먹으면 살쪄요.” / “참아야 예뻐져요.” / “운동한 게 아깝지 않아요?”
- “돼지가 될 수 있어요.” / “뚱뚱해질 음식” / “폭식러” / “미친 식욕”
- “정병”, “미친 여자”, “멘헤라” 등 정신 상태나 정체성을 낙인찍는 표현
- “착한 음식”, “나쁜 음식”, “클린하게 먹기”, “치팅”, “죄책감 메뉴”
- “완벽히 참았어요”, “연속 성공”, “오늘도 방어 성공”처럼 먹지 않음을 승리로 만드는 문장
- 진단·치료·완치·식욕 억제·체중 감량을 약속하는 문장
- 사실로 입증되지 않은 절약, 성공률, AI 정확도, 사용자 수, 기간 한정 할인

## 10. Asset inventory

아래는 제작 계약이며 **현재 이미지를 생성하거나 출시 승인한 상태가 아니다**. 모든 항목의 현재 상태는 `SPEC ONLY`다.

| Asset ID | Deliverable | Master / variants | Format | Release gate |
|---|---|---|---|---|
| `brand.logo.ko` | 한글 워드마크 | dark, light, mono | SVG + outlined PDF | 자체 레터링·최소 크기 검수 |
| `brand.logo.en` | DAESIN 보조 서명 | dark, light, mono | SVG + outlined PDF | 한글보다 시각 우선순위 낮음 |
| `brand.symbol` | pause gap 심볼 | 16–256px | SVG | 16px 식별성 |
| `app.icon.ios` | iOS 앱 아이콘 | release portal 요구 export | lossless PNG | alpha·마스크·실기기 검수 |
| `app.icon.android` | adaptive icon | foreground, background, mono | SVG + PNG exports | safe zone·themed icon 검수 |
| `splash.brand` | 정적/짧은 스플래시 | dark, light, reduced motion | SVG / Lottie only if needed | 600ms 이하·오프라인 진입 |
| `mascot.base` | 대신이 기본형 | full, 48px, 24px | SVG | silhouette·pause gap 검수 |
| `mascot.states` | 8개 감정 상태 | dark, light, sensitive | SVG | 표정 의미·일관성 검수 |
| `mascot.motion` | blink, think, wait, celebrate | normal, reduced | vector animation | 반복·성능·Reduce Motion |
| `sticker.core` | 기본 스티커 8종 | dark, light | SVG + transparent PNG | 카피·작은 크기 검수 |
| `illustration.onboarding` | 온보딩 3장 | phone aspect variants | SVG / PNG | 장면·인물·안전 검수 |
| `ui.motifs` | 달·별·커서·영수증·보류 도장 | 16–128px | SVG | 화면당 사용량 제한 |
| `share.weekly` | 주간 리포트 공유 카드 | portrait, square, story | editable master + PNG | 개인정보 기본 숨김 |
| `campaign.5min` | `#결제전5분` 카드 | square, story, reel cover | editable master + PNG | 과장·체중 감량 암시 없음 |
| `store.screens` | 스토어 스크린샷 6장 | iPhone, Android locale variants | editable master + PNG | 실제 앱 캡처·스토어 규격 검수 |

권장 향후 저장 구조는 `assets/brand/`, `assets/mascot/`, `assets/store/`다. 생성물과 원본은 분리하고, export 파일명에는 asset ID, theme, locale, scale, version을 포함한다. 예: `mascot.states_thinking_night_ko-KR_v01.svg`.

## 11. AI asset licensing and QC

AI 도구는 무드·포즈 탐색에 사용할 수 있으나, **로고·앱 아이콘·대신이의 최종 원본은 생성 결과를 그대로 출시하지 않는다.** 최종본은 승인된 탐색안을 바탕으로 사람이 벡터로 다시 구성하고, 고유 실루엣과 각 상태를 일관되게 정리한다.

### Provenance record

각 생성·편집 자산에 다음 정보를 기록한 뒤 출시 여부를 판정한다.

- asset ID, 제작자·검수자, 생성·수정 날짜
- 사용 도구와 모델명·버전, 사용 계정/플랜
- 상업 이용 및 재배포 약관의 확인 날짜와 보관 링크 또는 사본
- 전체 prompt, negative prompt, seed/variation ID가 제공되는 경우 해당 값
- 입력 참조 이미지의 출처, 권리자, 사용 허가 범위
- 원본 생성물과 최종 편집물의 파일 hash
- 사람의 수정 범위, 최종 라이선스·출시 판정, 판정자

약관이 불명확하거나 참조 이미지 권리를 증명할 수 없으면 출시 자산으로 사용하지 않는다. 특정 생존 작가의 화풍, 기존 캐릭터·게임·애니메이션·산리오·LINE FRIENDS 등을 이름으로 요구하거나 시각적으로 근접시키지 않는다.

### Mandatory visual QC

1. **IP similarity** — 실루엣, 얼굴 비율, 색 배치, 액세서리, 이름을 역검색·상표 검색 대상으로 검토한다.
2. **Character consistency** — crown, pause gap, 눈 간격, body 비율이 모든 상태에서 유지되는지 확인한다.
3. **Safety** — 자해, 약물, 섭식장애, 체형 집착, 음식 선악 암시가 없는지 두 명 이상이 검수한다.
4. **Small-size legibility** — 16/24/32/48px와 저해상도 Android 기기에서 확인한다.
5. **Technical** — 투명 배경 halo, 깨진 벡터 path, 색 프로필, banding, compression artifact를 확인한다.
6. **Theme** — Night Bloom과 Milk Moon에서 대비, 테두리, 그림자가 모두 읽히는지 확인한다.
7. **Accessibility** — 정보가 이미지·색·모션에만 의존하지 않고 alt/label로 설명되는지 확인한다.
8. **Store truthfulness** — 실제 앱에 없는 UI, 기능, 결과 수치, 알림을 합성하지 않는다.

출시 에셋 등록부에는 `APPROVED`, `NEEDS EDIT`, `INTERNAL ONLY`, `REJECTED` 중 하나를 명시한다. `APPROVED`가 아닌 자산은 앱 번들·스토어·광고에 포함하지 않는다.

## 12. Store screenshot visual system

스토어 이미지는 “문제 자극 → 멈춤 → 상태 확인 → 세 가지 선택 → 존중 → 패턴 이해”의 한 서사로 읽혀야 한다. 체중, 칼로리, 전후 사진이나 공포를 첫 장의 훅으로 사용하지 않는다.

### Frame grammar

- 상단 24%: 2줄 이하의 짧은 헤드라인. 한 줄 12자 안팎, 핵심어 하나만 accent 처리한다.
- 중앙 66%: 실제 기기에서 캡처한 UI. iPhone과 Android는 각 플랫폼 캡처를 따로 사용한다.
- 하단 10%: 작은 월반원, pause gap, 스티커 1개 중 하나만 배치한다.
- 대신이는 화면 폭의 10~18%로 보조 역할만 하며 UI를 가리지 않는다.
- 1~4장은 Night Bloom, 5장은 Milk Moon, 6장은 두 테마의 공통 리포트 문법을 사용해 테마 페어를 자연스럽게 보여준다.
- 기기 목업은 한 프레임에 최대 1대다. 과도한 원근, 3D 반사, 손 모델은 사용하지 않는다.
- 실제 캡처가 준비되기 전에는 와이어프레임을 외부 공개용 이미지로 export하지 않는다.

### Six-frame narrative

| # | Store headline | Required screen | Visual focus |
|---:|---|---|---|
| 1 | **배달앱보다 5분 먼저 열어요** | 홈 | `지금 땡겨요` CTA와 기본 대신이 |
| 2 | **지금 땡기는 걸 말해줘요** | 음식 입력 | 입력창·최근 음식, 장식 최소화 |
| 3 | **배고픔과 마음을 같이 봐요** | 상태 확인 | 한 번에 질문 하나, lilac focus |
| 4 | **세 가지 중 내가 직접 골라요** | 선택 카드 | 세 카드의 동등한 시각 무게 |
| 5 | **먹기로 해도 실패가 아니에요** | 계획해서 먹기 | Milk Moon, 죄책감 없는 계획 |
| 6 | **내 패턴을 조용히 알아가요** | 주간 리포트 | 선택 분포·한 가지 다음 주 제안 |

### Store execution rules

- 제목은 UI와 겹치지 않고, 한국어 조사나 핵심 의미가 줄바꿈으로 분리되지 않게 한다.
- `AI`는 기능 설명에 필요할 때만 쓰고, 정확도·진단 능력을 시각 배지로 과장하지 않는다.
- 가격, 할인율, 사용자 수, 성과 수치는 실제 데이터와 현재 상품이 확정되기 전 넣지 않는다.
- 개인정보가 포함된 실제 사용자 기록을 사용하지 않는다. 승인된 demo fixture로 캡처한다.
- 스크린샷의 앱 UI는 출시 후보 빌드와 동일해야 하며, 목업 안에 가짜 CTA나 가짜 알림을 추가하지 않는다.
- iPhone/Android 세트는 같은 서사를 유지하되 상태바, 내비게이션, 폰트 렌더링, 기기 프레임을 각 플랫폼에 맞춘다.
- 최종 pixel size, 기기 클래스, 개수, alpha 규칙은 export 시점의 App Store Connect와 Google Play 공식 요구 사항으로 다시 검증한다.

## 13. Release review checklist

- [ ] Night Bloom과 Milk Moon이 동일한 semantic token과 위계를 사용한다.
- [ ] 핵심 본문과 CTA가 대비·큰 글자·색각 조건을 통과한다.
- [ ] 대신이의 crown, pause gap, 비대칭 실루엣이 모든 자산에서 일치한다.
- [ ] 먹기·대신 먹기·5분 보류 어느 선택도 선악 색이나 평가 표정으로 표시하지 않는다.
- [ ] 금지 모티프·금지 카피·의료/체중 감량 암시가 없다.
- [ ] 모든 폰트·이미지·AI 생성물에 출처와 상업 사용 판정이 있다.
- [ ] 앱 아이콘과 마스코트는 기존 캐릭터 유사성 검토를 통과했다.
- [ ] 스토어 이미지가 실제 출시 후보 빌드와 일치한다.
- [ ] Reduce Motion, 시스템 글자 확대, 다크·라이트 테마에서 핵심 정보가 유지된다.
- [ ] 사람이 최종 작은 화면·실기기·스토어 진실성 검수를 완료했다.

