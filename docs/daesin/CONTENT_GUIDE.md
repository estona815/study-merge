# DAESIN P0 한국어 콘텐츠 가이드

> 상태: Launch MVP v0.1 · 2026-07-14
> 오너: UX/UI Systems
> 기본 locale: `ko-KR`
> 화면·상태 계약: [UX_SPEC.md](./UX_SPEC.md)
> 제품 용어 계약: [PRODUCT.md](./PRODUCT.md)
> 브랜드 표현 계약: [BRAND_GUIDE.md](./BRAND_GUIDE.md)

## 1. 콘텐츠 원칙

대신의 문장은 사용자의 음식을 통제하지 않는다. 자동 주문 직전의 속도를 조금 늦추고, 현재 상태와 가능한 행동을 짧게 보여준 뒤 선택권을 돌려준다.

1. **판단보다 관찰** — `왜 또`가 아니라 `지금은 어떤 상태인지`를 말한다.
2. **금지보다 선택** — `먹지 마세요`가 아니라 세 가지 실제 선택을 보여준다.
3. **결과보다 주도권** — 먹음/안 먹음을 성공·실패로 나누지 않는다.
4. **친밀하지만 선을 넘지 않음** — 밈은 상황을 웃기고 사용자를 웃음거리로 만들지 않는다.
5. **짧고 구체적** — 제목 1문장, 설명 1~2문장, CTA는 동사형으로 쓴다.
6. **의료적 단정 없음** — 진단, 치료, 식욕 억제, 감량 효과, 영양 처방을 약속하지 않는다.
7. **민감할수록 차분하게** — sensitive mode에서는 밈, 느낌표, 축하, 제한 행동 조언을 제거한다.

## 2. Voice model

### 2.1 말투와 밈 강도

| 값 | 사용자 표시 | 문장 규칙 | 예 |
|---|---|---|---|
| `plain` | 담백 | 짧은 존댓말, 관찰과 행동 중심 | `지금 가능한 선택을 보여드릴게요.` |
| `friend` | 친구 | 따뜻한 존댓말, 허용과 동행 강조 | `먹어도 괜찮아요. 방법만 먼저 정해볼까요?` |
| `meme` + `low` | 밈 · 가볍게 | 화면당 은유 최대 1개, 제품 용어 이해를 방해하지 않음 | `야식 회의가 열렸어요.` |
| `meme` + `full` | 밈 · 충분히 | 상황 의인화 가능, 사용자 평가는 금지, 연속 joke 금지 | `치킨이 결재를 올렸습니다. 배고픔부터 확인할게요.` |
| `sensitive` | 자동 안전 말투 | 짧고 중립적, 느낌표·밈·축하 없음 | `지금은 부담을 줄이는 데 집중해볼게요.` |

- 저장 필드는 `tone_mode = plain | friend | meme`, `meme_level = low | full`을 사용한다.
- Free/Pro 권한에 따라 선택 가능한 밈 강도는 달라질 수 있지만, 담백·친구와 안전 문구는 결제와 무관하다.
- `sensitive`는 사용자 설정이 아니라 세션 단위 safety override다. 민감 모드가 끝나면 저장된 말투로 돌아간다.

### 2.2 카피 resolver 우선순위

```text
sensitive:
  key.sensitive → key.plain → global.safe_generic

meme/full:
  key.meme.full → key.meme.low → key.friend → key.plain

meme/low:
  key.meme.low → key.friend → key.plain

friend:
  key.friend → key.plain

plain:
  key.plain
```

민감 화면이 meme variant로 fallback하는 경로는 절대 만들지 않는다. 안전·오류·삭제·결제·알레르기 화면은 tone과 무관하게 승인된 neutral copy만 사용한다.

## 3. i18n key 계약

### 3.1 구조

- 모든 사용자 표시 문자열은 중앙 resource에서 가져온다. JSX/TSX, native 설정, notification payload에 한국어를 직접 쓰지 않는다.
- key 형식은 `surface.section.element[.state|.variant]`다. 예: `session.analysis.status.first`, `paywall.action.restore`.
- 목록 index 대신 의미 이름을 쓴다. `reason.option.stress`는 허용, `reason.option.2`는 금지다.
- 문장 조각을 이어 붙이지 않는다. 한국어 조사와 향후 영어·일본어 어순을 위해 완전한 문장을 저장한다.
- 화면 줄바꿈은 resource에 `\n`으로 고정하지 않고 layout이 결정한다. 브랜드 워드마크 등 승인된 예외만 별도 key를 둔다.
- 변수는 의미 있는 이름을 쓴다: `{food}`, `{count}`, `{minutes}`, `{value}`, `{price}`, `{date}`, `{productName}`.
- 가격, trial 기간, 할인율은 스토어 metadata와 계산값을 삽입한다. 번들 resource에 숫자를 고정하지 않는다.
- 날짜·시간·숫자는 locale formatter를 사용한다. 한국어 단위도 문자열 결합 대신 message formatter 안에서 처리한다.

### 3.2 권장 resource shape

```json
{
  "session.analysis.status.first": {
    "plain": "지금 상태에 맞는 선택을 정리하고 있어요.",
    "friend": "지금 가능한 걸 같이 정리해볼게요.",
    "meme": {
      "low": "야식 안건을 정리하고 있어요.",
      "full": "장바구니 결재 전에 안건을 검토하고 있어요."
    },
    "sensitive": "지금 부담을 덜 수 있는 선택을 정리하고 있어요."
  }
}
```

## 4. 고정 용어

| 개념 | 고정 표기 | 쓰지 않는 대체어 |
|---|---|---|
| 제품 category | 충동 브레이크 | 식욕 억제, 야식 차단, 다이어트 처방 |
| 시작 CTA | 지금 땡겨요 | 참아볼래요, 야식 막기 |
| 대안 행동 | 대신 먹기 | 착한 음식, 저칼로리 대체, 클린식 |
| 원래 음식 행동 | 계획해서 먹기 | 치팅, 포기하고 먹기, 실패 식사 |
| 짧은 지연 | 5분 보류 | 버티기, 금식, 강제 잠금 |
| 개인 저장 음식 | 세이브 메뉴 | 다이어트 음식, 안전 음식 |
| 제품 성과 | 의식적 선택 | 참기 성공, 방어 성공, 연속 무야식 |
| 시작 전 강도 | 배고픔 / 당김 | 미친 식욕, 폭식 지수 |
| 결과 강도 | 지금 당김 | 통제 성공률 |
| 음식 이미지 설정 | 저자극 보기 | 식욕 감퇴 모드 |
| 유료 상품 | 대신 Pro | 프리미엄 다이어트, 억제 플랜 |
| mascot | 대신이 | 감시자, 심판, 코치님 |

`폭식`, `섭식장애`, `자해` 같은 표현은 사용자의 자기서술을 그대로 되풀이하거나 장식적으로 사용하지 않는다. 안전 안내에서 꼭 필요할 때만 임상적 과장 없이 쓴다.

## 5. 공통 key

| Key | `ko-KR` 기본값 | 규칙 |
|---|---|---|
| `app.name` | 대신 | 제품명 |
| `app.storeName` | 대신 – 야식·배달 충동 브레이크 | 스토어/법적 표시 |
| `brand.promise` | 배달앱보다 5분 먼저 여는 앱. | 온보딩·스토어 |
| `brand.belief` | 충동 대신, 내가 고른 한 끼. | 브랜드 핵심 문장 |
| `nav.home` | 홈 | 탭 |
| `nav.history` | 기록 | 탭 |
| `nav.saveMeals` | 세이브 | 탭 |
| `nav.my` | 마이 | 탭 |
| `action.next` | 다음 | 일반 진행 |
| `action.back` | 이전 | 화면 진행 |
| `action.close` | 닫기 | modal/paywall |
| `action.cancel` | 취소 | 중립 취소 |
| `action.later` | 나중에 | 권한·비핵심 요청 |
| `action.retry` | 다시 시도 | 기술 오류 |
| `action.save` | 저장 | 일반 저장 |
| `action.done` | 완료 | flow 종료 |
| `action.edit` | 수정 | 편집 진입 |
| `action.delete` | 삭제 | destructive가 아닌 목록 label |
| `action.share` | 공유하기 | 시스템 공유 |
| `action.settings` | 설정 열기 | OS 설정 |
| `action.discard` | 이번 내용 버리기 | draft confirm |
| `status.savedOnDevice` | 기기에 먼저 저장했어요. 연결되면 자동으로 맞출게요. | 원격 저장 실패 |
| `status.offline` | 지금은 오프라인이에요. 기본 추천으로 계속할 수 있어요. | 핵심 flow 유지 |

## 6. Launch·온보딩 key

| Key | `ko-KR` 기본값 | 비고 |
|---|---|---|
| `splash.a11y.label` | 대신을 여는 중 | 로고 자체는 읽지 않음 |
| `onboarding.value.eyebrow` | 충동 브레이크 | category |
| `onboarding.value.title` | 배달앱보다 5분 먼저 열어요 | 2줄 이하 |
| `onboarding.value.body` | 먹지 말라고 혼내는 대신, 지금 상태를 보고 직접 고를 수 있게 도와드려요. | 금지 앱 아님 |
| `onboarding.age.label` | 만 18세 이상이에요 | check label |
| `onboarding.age.action` | 18세 이상이며 시작할게요 | primary |
| `onboarding.age.required` | 대신은 현재 성인만 이용할 수 있어요. | 비난·과잉 설명 없음 |
| `onboarding.medical.note` | 대신은 의료·치료 서비스가 아니에요. 건강 상태에 맞는 전문 조언이 필요하면 전문가와 상의해 주세요. | footer/detail |
| `onboarding.cravings.title` | 자주 당기는 걸 골라주세요 | 선택 없음 허용 |
| `onboarding.cravings.body` | 다음 추천을 조금 더 빠르게 준비할 때만 사용해요. | 목적 설명 |
| `onboarding.cravings.custom.placeholder` | 직접 입력하기 | 자유 입력 |
| `onboarding.cravings.skip` | 지금은 건너뛸게요 | skip |
| `onboarding.diet.title` | 피해야 할 음식이 있나요? | 알레르기·제한식 |
| `onboarding.diet.body` | 알레르기와 식이 제한은 추천보다 먼저 확인해요. | 안전 우선 |
| `onboarding.diet.none` | 해당 없음 | 상호 배타 |
| `onboarding.diet.allergy.label` | 알레르기 | field |
| `onboarding.diet.restriction.label` | 식이 제한 | field |
| `onboarding.diet.unsure` | 잘 모르겠어요 | 전문가 판단 대체 금지 |
| `onboarding.tone.title` | 대신이가 어떻게 말하면 좋을까요? | 말투 선택 |
| `onboarding.tone.plain` | 담백 | option |
| `onboarding.tone.friend` | 친구 | option |
| `onboarding.tone.meme` | 밈 | option |
| `onboarding.meme.level.low` | 가볍게 | intensity |
| `onboarding.meme.level.full` | 충분히 | intensity |
| `onboarding.view.title` | 편하게 볼 방법을 골라주세요 | 보기 설정 |
| `onboarding.view.hideCalories` | 칼로리 숨기기 | 기본 on |
| `onboarding.view.lowStim` | 저자극 보기 | 음식 사진 기본 대체 |
| `onboarding.view.lowStim.help` | 음식 사진 대신 아이콘과 글을 중심으로 보여줘요. 반응은 사람마다 다를 수 있어요. | 효과 단정 금지 |
| `onboarding.theme.label` | 화면 테마 | field |
| `onboarding.theme.night` | Night Bloom | option |
| `onboarding.theme.milk` | Milk Moon | option |
| `onboarding.theme.system` | 기기 설정 따르기 | option |
| `onboarding.complete.action` | 대신 시작하기 | 마지막 primary |

## 7. 홈 key와 tone variant

### 7.1 고정 key

| Key | `ko-KR` 기본값 |
|---|---|
| `home.primaryAction` | 지금 땡겨요 |
| `home.todayChoices.title` | 오늘 멈춰본 횟수 |
| `home.todayChoices.value` | 오늘 {count}번, 자동으로 넘기지 않고 골랐어요 |
| `home.saveMeal.title` | 최근 효과가 좋았던 세이브 메뉴 |
| `home.history.title` | 최근 기록 |
| `home.weekly.title` | 이번 주 선택 보기 |
| `home.weekly.action` | 주간 리포트 보기 |
| `home.empty.title` | 아직 남긴 선택이 없어요 |
| `home.empty.body` | 다음에 무언가 당길 때, 한 번만 멈춰서 골라봐요. |
| `home.resume.title` | 이어서 볼 세션이 있어요 |
| `home.resume.action` | 이어서 하기 |
| `home.resume.discard` | 이번 세션 끝내기 |

### 7.2 `home.greeting` variants

| Variant | 문구 |
|---|---|
| `plain` | 지금 무언가 당기면 바로 시작해도 좋아요. |
| `friend` | 뭔가 당겨요? 오래 묻지 않고 같이 골라볼게요. |
| `meme.low` | 야식 안건이 생기면 대신이를 불러주세요. |
| `meme.full` | 장바구니가 결재를 올리기 전에 대신이를 호출해 주세요. |
| `sensitive` | 필요하면 지금 가능한 선택을 차분히 살펴볼게요. |

## 8. 충동 세션 key

### 8.1 음식 입력

| Key | `ko-KR` 기본값 |
|---|---|
| `session.progress.food` | 음식 확인 |
| `session.food.title` | 지금 뭐가 당겨요? |
| `session.food.body` | 음식 이름 하나면 충분해요. |
| `session.food.placeholder` | 예: 치킨, 떡볶이, 아이스크림 |
| `session.food.recent` | 최근 입력 |
| `session.food.frequent` | 자주 찾은 음식 |
| `session.food.generic` | 그냥 뭔가 먹고 싶어요 |
| `session.food.action` | 상태 확인하기 |
| `session.food.error.required` | 음식 이름을 적거나 `그냥 뭔가 먹고 싶어요`를 골라주세요. |

### 8.2 배고픔

| Key | `ko-KR` 기본값 |
|---|---|
| `session.progress.hunger` | 배고픔 확인 |
| `session.hunger.title` | 지금 배고픔은 어느 정도예요? |
| `session.hunger.body` | 정답은 없어요. 지금 느껴지는 값으로 골라주세요. |
| `session.hunger.scale.min` | 0 · 배고프지 않아요 |
| `session.hunger.scale.max` | 10 · 아주 많이 배고파요 |
| `session.hunger.value.low` | {value}/10 · 낮은 편 |
| `session.hunger.value.mid` | {value}/10 · 중간 정도 |
| `session.hunger.value.high` | {value}/10 · 높은 편 |
| `session.hunger.error.required` | 지금 배고픔 값을 골라주세요. |

### 8.3 이유

| Key | `ko-KR` 기본값 |
|---|---|
| `session.progress.reason` | 이유 확인 |
| `session.reason.title` | 가장 가까운 이유는 뭐예요? |
| `session.reason.body` | 하나만 골라도 충분해요. |
| `session.reason.option.hunger` | 정말 배고파요 |
| `session.reason.option.stress` | 스트레스받았어요 |
| `session.reason.option.boredom` | 심심해요 |
| `session.reason.option.habit` | 습관적으로 찾았어요 |
| `session.reason.option.exposure` | 보고 나서 먹고 싶어졌어요 |
| `session.reason.option.unknown` | 잘 모르겠어요 |
| `session.reason.action` | 선택 보기 |
| `session.reason.error.required` | 지금 가장 가까운 이유를 하나 골라주세요. |

### 8.4 분석 중 tone variant

| Key / Variant | 문구 |
|---|---|
| `session.analysis.status.first.plain` | 지금 상태에 맞는 선택을 정리하고 있어요. |
| `session.analysis.status.first.friend` | 지금 가능한 걸 같이 정리해볼게요. |
| `session.analysis.status.first.meme.low` | 야식 안건을 정리하고 있어요. |
| `session.analysis.status.first.meme.full` | 장바구니 결재 전에 안건을 검토하고 있어요. |
| `session.analysis.status.first.sensitive` | 지금 부담을 덜 수 있는 선택을 정리하고 있어요. |
| `session.analysis.status.second.plain` | 곧 세 가지 선택을 보여드릴게요. |
| `session.analysis.status.second.friend` | 오래 기다리지 않게 바로 골라볼게요. |
| `session.analysis.status.second.meme.low` | 안건은 세 가지로 줄이는 중이에요. |
| `session.analysis.status.second.meme.full` | 결재 라인을 세 가지 선택으로 정리하는 중입니다. |
| `session.analysis.status.second.sensitive` | 잠시 뒤 안전한 선택을 보여드릴게요. |
| `session.analysis.fallback` | 연결이 늦어 기본 추천으로 바로 이어갈게요. |
| `session.analysis.cancel` | 분석 그만두기 |

### 8.5 결과와 세 선택

| Key | `ko-KR` 기본값 |
|---|---|
| `session.result.title` | 지금 가능한 세 가지예요 |
| `session.result.body` | 순서는 상황에 맞춘 것이고, 어느 선택이 더 착한 건 아니에요. |
| `session.result.calories.action` | 칼로리 정보 보기 |
| `session.result.calories.range` | 예상 범위 {low}~{high} kcal |
| `session.result.calories.confidence.low` | 정보가 적어 차이가 클 수 있어요. |
| `session.result.calories.confidence.medium` | 양과 조리법에 따라 달라질 수 있어요. |
| `session.result.calories.confidence.high` | 알려진 양을 기준으로 한 예상치예요. |
| `session.option.swap.title` | 대신 먹기 |
| `session.option.swap.body` | 비슷한 감각을 주는, 지금 준비 가능한 메뉴를 봐요. |
| `session.option.planned.title` | 계획해서 먹기 |
| `session.option.planned.body` | 원래 음식을 먹되 양과 방법을 먼저 정해요. |
| `session.option.delay.title` | 5분 보류 |
| `session.option.delay.body` | 잠깐 미뤄두고 같은 마음인지 다시 확인해요. |
| `session.option.selected` | 이 선택으로 보기 |

상황 요약과 추천 이유는 서버의 검증된 구조화 field를 사용한다. `situation_summary`, `why_it_matches`, `coach_message`는 금지어·길이·safety 검사를 통과한 값만 렌더링하고, 자유 형식 모델 응답이나 raw JSON을 직접 출력하지 않는다.

## 9. 세 선택 상세 key

### 9.1 대신 먹기

| Key | `ko-KR` 기본값 |
|---|---|
| `swap.title` | 이 메뉴는 어때요? |
| `swap.prepTime` | 준비 {minutes}분 |
| `swap.why` | 지금 잘 맞는 이유 |
| `swap.ingredients` | 필요한 것 |
| `swap.steps` | 만드는 순서 |
| `swap.save.action` | 세이브 메뉴에 저장 |
| `swap.save.saved` | 세이브 메뉴에 저장했어요 |
| `swap.choose.action` | 이걸로 할게요 |
| `swap.allergy.blocked.title` | 설정한 알레르기와 맞지 않아요 |
| `swap.allergy.blocked.body` | 이 메뉴는 제외하고 다른 선택을 준비할게요. |

### 9.2 계획해서 먹기

| Key | `ko-KR` 기본값 |
|---|---|
| `planned.title` | 먹기로 했다면, 방법을 먼저 정해볼까요? |
| `planned.body.plain` | 원래 음식을 먹는 선택도 괜찮아요. 지금 가능한 계획만 골라주세요. |
| `planned.body.friend` | 먹어도 괜찮아요. 주문하기 전에 양과 방법만 먼저 정해볼까요? |
| `planned.body.meme.low` | 먹는 안건도 승인할 수 있어요. 방법만 먼저 정해봐요. |
| `planned.body.meme.full` | 먹기로 정했군요. 죄책감은 주문 목록에서 제외하고 방법만 결재할게요. |
| `planned.body.sensitive` | 먹는 선택도 괜찮아요. 부담이 적은 방법만 정해볼 수 있어요. |
| `planned.portion.label` | 먹을 양 |
| `planned.side.label` | 함께 먹을 것 |
| `planned.leftover.label` | 남길 몫 |
| `planned.skip` | 지금은 정하지 않을게요 |
| `planned.action` | 이대로 계획할게요 |
| `planned.saved` | 계획을 저장했어요 |

### 9.3 5분 보류

| Key | `ko-KR` 기본값 |
|---|---|
| `delay.title` | 5분만 보류할게요 |
| `delay.body.plain` | 기다리는 동안 한 가지만 해봐요. 언제든 끝낼 수 있어요. |
| `delay.body.friend` | 장바구니는 그대로 있어요. 5분 뒤에도 원하면 다시 고르면 돼요. |
| `delay.body.meme.low` | 장바구니는 도망가지 않아요. 5분 뒤 다시 볼게요. |
| `delay.body.meme.full` | 자동결제 방지 시스템이 잠시 작동 중입니다. 언제든 회의를 다시 열 수 있어요. |
| `delay.body.sensitive` | 잠시 멈춰도 되고, 바로 다시 골라도 괜찮아요. |
| `delay.microAction.label` | 지금 할 한 가지 |
| `delay.endNow` | 지금 다시 고를래요 |
| `delay.background.title` | 타이머를 계속 둘까요? |
| `delay.background.keep` | 계속 두기 |
| `delay.background.stop` | 타이머 끝내기 |
| `delay.completed.title` | 5분이 지났어요 |
| `delay.completed.body` | 지금 마음이 어떻게 달라졌는지 확인해볼까요? |
| `delay.recheck.title` | 지금 당김은 어느 정도예요? |
| `delay.recheck.action` | 다시 선택하기 |

micro action은 provider가 생성한 임의 건강 조언이 아니라 승인된 P0 목록에서 하나만 선택한다. 예: `물 한 모금 마시고 몸의 느낌 확인하기`, `배달앱을 닫고 한 번 천천히 숨 쉬기`, `지금 원하는 감각을 한 단어로 고르기`. 제한 식사·운동 보상·의료 조언은 넣지 않는다.

## 10. 결과 기록·완료 key

| Key | `ko-KR` 기본값 |
|---|---|
| `outcome.title` | 실제로 어떻게 했어요? |
| `outcome.body` | 계획과 달라도 괜찮아요. 지금 한 선택만 남겨주세요. |
| `outcome.action.swap` | 대신 메뉴를 먹었어요 |
| `outcome.action.planned` | 원래 음식을 계획해서 먹었어요 |
| `outcome.action.delayed` | 5분 뒤 다시 골랐어요 |
| `outcome.action.other` | 다른 선택을 했어요 |
| `outcome.food.label` | 실제로 먹은 음식 · 선택 |
| `outcome.food.placeholder` | 적고 싶을 때만 입력해요 |
| `outcome.craving.label` | 지금 당김 |
| `outcome.satisfaction.label` | 지금 선택의 만족도 |
| `outcome.note.label` | 짧은 메모 · 선택 |
| `outcome.note.placeholder` | 다음의 나에게 남길 말 |
| `outcome.save.action` | 기록 저장 |
| `outcome.error.actionRequired` | 실제로 한 선택을 하나 골라주세요. |
| `completion.title.plain` | 선택을 기록했어요 |
| `completion.title.friend` | 오늘의 선택은 여기까지예요 |
| `completion.title.meme.low` | 오늘 안건을 정리했어요 |
| `completion.title.meme.full` | 결재 완료. 선택권은 본인에게 돌아갔습니다. |
| `completion.title.sensitive` | 기록을 저장했어요 |
| `completion.body` | 먹었는지보다 직접 고른 순간을 남겼어요. |
| `completion.homeAction` | 홈으로 |

## 11. 기록·세이브·리포트·공유 key

### 11.1 기록

| Key | `ko-KR` 기본값 |
|---|---|
| `history.title` | 기록 |
| `history.empty.title` | 아직 남긴 선택이 없어요 |
| `history.empty.body` | 첫 세션을 마치면 당시 상태와 선택이 여기에 보여요. |
| `history.empty.action` | 첫 선택 남기기 |
| `history.card.reason` | 이유 · {reason} |
| `history.card.change` | 당김 {before} → {after} |
| `history.detail.title` | 그때의 선택 |
| `history.detail.delete` | 이 기록 삭제 |
| `history.delete.title` | 이 기록을 삭제할까요? |
| `history.delete.body` | 주간 리포트 집계에서도 빠져요. 이 작업은 되돌릴 수 없어요. |

### 11.2 세이브 메뉴

| Key | `ko-KR` 기본값 |
|---|---|
| `saveMeals.title` | 세이브 메뉴 |
| `saveMeals.add` | 메뉴 추가 |
| `saveMeals.empty.title` | 아직 세이브 메뉴가 없어요 |
| `saveMeals.empty.body` | 자주 도움 되는 메뉴를 직접 넣거나 추천에서 저장해보세요. |
| `saveMeals.form.name` | 메뉴 이름 |
| `saveMeals.form.ingredients` | 재료 |
| `saveMeals.form.steps` | 만드는 순서 · 최대 3단계 |
| `saveMeals.form.minutes` | 준비 시간 |
| `saveMeals.form.sensory` | 감각 태그 |
| `saveMeals.form.context` | 잘 맞는 상황 |
| `saveMeals.form.favorite` | 즐겨찾기 |
| `saveMeals.form.save` | 메뉴 저장 |
| `saveMeals.use` | 이 메뉴 사용하기 |
| `saveMeals.limit.title` | Free 세이브 메뉴를 모두 저장했어요 |
| `saveMeals.limit.body` | 기존 5개는 계속 쓰고 수정할 수 있어요. 더 추가하려면 대신 Pro를 살펴보세요. |
| `saveMeals.limit.proAction` | Pro 살펴보기 |
| `saveMeals.limit.manageAction` | 기존 메뉴 관리 |

`5`는 현재 remote config 기본값이다. 실제 UI 문장은 `{limit}` 변수로 렌더링하고 hard-code하지 않는다.

### 11.3 주간 리포트·공유

| Key | `ko-KR` 기본값 |
|---|---|
| `weekly.title` | 이번 주 내가 고른 순간 |
| `weekly.consciousChoices` | 충동을 멈춰본 횟수 |
| `weekly.swap` | 대신 선택 |
| `weekly.planned` | 계획해서 먹기 |
| `weekly.delay` | 5분 보류 |
| `weekly.timePattern` | 자주 시작한 시간 |
| `weekly.reasonPattern` | 자주 고른 이유 |
| `weekly.bestMethod` | 효과가 좋았던 방법 |
| `weekly.nextSuggestion` | 다음 주에 해볼 한 가지 |
| `weekly.lowData.title` | 패턴을 말하기엔 기록이 조금 더 필요해요 |
| `weekly.lowData.body` | 한 번 더 선택을 남기면 비교할 수 있는 맥락이 생겨요. |
| `weekly.share.action` | 공유 카드 만들기 |
| `share.title` | 공유할 모습을 골라주세요 |
| `share.privacy.note` | 이름, 메모, 칼로리와 음식 상세는 기본으로 빼요. |
| `share.ratio.story` | 스토리 |
| `share.ratio.square` | 정사각형 |
| `share.preview.action` | 이 카드 공유하기 |
| `share.error` | 카드를 만들지 못했어요. 기록은 그대로 저장되어 있어요. |

## 12. 설정·권한·데이터 key

| Key | `ko-KR` 기본값 |
|---|---|
| `settings.title` | 마이 |
| `settings.appearance` | 화면과 말투 |
| `settings.dietary` | 알레르기와 식이 제한 |
| `settings.notifications` | 알림 |
| `settings.subscription` | 구독 |
| `settings.dataPrivacy` | 데이터와 개인정보 |
| `settings.serviceLimits` | 서비스 안내 |
| `settings.calories.hide` | 칼로리 숨기기 |
| `settings.lowStim` | 저자극 보기 |
| `settings.analyticsConsent` | 사용 패턴 분석 허용 |
| `settings.aiConsent` | AI 개선을 위한 익명 데이터 허용 |
| `settings.account.link` | 계정 연결 |
| `settings.data.export` | 내 데이터 내보내기 |
| `settings.data.delete` | 내 데이터 삭제 |
| `settings.data.exporting` | 내보낼 파일을 준비하고 있어요. |
| `settings.data.exportReady` | 내보낼 파일이 준비됐어요. |
| `settings.data.delete.title` | 내 데이터를 모두 삭제할까요? |
| `settings.data.delete.body` | 프로필, 세션, 세이브 메뉴와 설정이 삭제돼요. 완료 후에는 되돌릴 수 없어요. |
| `settings.data.delete.confirmLabel` | 삭제를 확인하려면 `삭제`를 입력하세요 |
| `settings.data.delete.action` | 내 데이터 삭제 |
| `settings.data.delete.success` | 데이터 삭제를 완료했어요. |
| `settings.data.delete.error` | 삭제를 완료하지 못했어요. 데이터는 그대로예요. 다시 시도해 주세요. |

### 알림 pre-prompt

| Key | `ko-KR` 기본값 |
|---|---|
| `notification.preprompt.title` | 필요한 시간에만 불러드릴까요? |
| `notification.preprompt.body` | 원하는 시간과 횟수를 먼저 정할 수 있어요. 알림을 켜지 않아도 모든 핵심 기능을 쓸 수 있어요. |
| `notification.preprompt.action` | 알림 시간 정하기 |
| `notification.permission.action` | 기기 알림 허용하기 |
| `notification.permission.denied` | 알림이 꺼져 있어요. 원할 때 기기 설정에서 켤 수 있어요. |
| `notification.quietHours` | 방해 금지 시간 |
| `notification.maxDaily` | 하루 최대 알림 |
| `notification.example.meeting` | 야식 회의 예정 시간이에요. 참석 여부는 자유예요. |
| `notification.example.pattern` | 오후 10시 이후 매운 음식이 자주 당겼어요. 배고픔만 한 번 확인할까요? |
| `notification.example.saveMeal` | 세이브 메뉴가 준비되어 있어요. 필요할 때 꺼내보세요. |

죄책감, streak 손실, `요즘 왜 안 들어오세요?`, 체중·칼로리 경고를 알림에 쓰지 않는다.

## 13. Paywall·구독 key

Paywall은 세션 밖의 eligibility에서만 사용한다. 첫 세션, 진행 중 세션, sensitive mode, 복원/삭제 오류 중에는 이 key를 호출하지 않는다.

| Key | `ko-KR` 기본값 |
|---|---|
| `paywall.title.personalization` | 내 선택을 더 오래 기억해요 |
| `paywall.title.patterns` | 내 패턴을 더 자세히 볼 수 있어요 |
| `paywall.body.freeCore` | 핵심 충동 브레이크는 무료로 계속 사용할 수 있어요. |
| `paywall.feature.saveMeals` | 세이브 메뉴 무제한 |
| `paywall.feature.personalization` | 시간대와 실제 선택을 반영한 고급 개인화 |
| `paywall.feature.reports` | 상세 월간 패턴 리포트 |
| `paywall.feature.themes` | 추가 테마와 대신이 스킨 |
| `paywall.feature.share` | 공유 카드 커스터마이징 |
| `paywall.plan.monthly` | 월간 · {price} |
| `paywall.plan.annual` | 연간 · {price} |
| `paywall.plan.savings` | 월간 대비 {percent} 절약 |
| `paywall.trial.disclosure` | 오늘 시작하면 {trialEndDate}까지 무료이고, 이후 {price}/{period}로 자동 갱신돼요. |
| `paywall.action.purchase` | 선택한 플랜으로 계속 |
| `paywall.action.close` | 지금은 괜찮아요 |
| `paywall.action.restore` | 구독 복원 |
| `paywall.action.terms` | 이용약관 |
| `paywall.action.privacy` | 개인정보처리방침 |
| `paywall.renewal.note` | 구독은 스토어 설정에서 언제든 관리하거나 해지할 수 있어요. |
| `paywall.price.loading` | 가격을 불러오는 중이에요. |
| `paywall.price.error` | 가격을 불러오지 못했어요. 핵심 기능은 그대로 사용할 수 있어요. |
| `subscription.restore.loading` | 구독 정보를 확인하고 있어요. |
| `subscription.restore.success` | 구독을 복원했어요. |
| `subscription.restore.none` | 복원할 구독을 찾지 못했어요. 스토어 계정을 확인해 주세요. |
| `subscription.restore.error` | 구독을 확인하지 못했어요. 중복 결제하지 말고 다시 시도해 주세요. |
| `subscription.cancel.note` | 해지해도 남은 이용 기간에는 Pro를 쓸 수 있고, 기록과 기존 세이브 메뉴는 유지돼요. |

- `paywall.plan.savings`는 두 현지 가격이 정상 로드되고 실제 계산값이 양수일 때만 표시한다.
- 가짜 마감 시간, 취소 방해, `Pro가 아니면 실패`, 감량·억제 효과, 구현 전 P1 기능은 쓰지 않는다.

## 14. Loading·empty·error key

| Key | `ko-KR` 기본값 | 행동 |
|---|---|---|
| `loading.generic` | 내용을 불러오고 있어요. | 2초 이상 반복 금지 |
| `loading.saving` | 저장하고 있어요. | 원 label 폭 유지 |
| `error.network.title` | 연결이 원활하지 않아요 | retry + offline continue |
| `error.network.body` | 기본 추천과 기기 저장으로 계속할 수 있어요. | 핵심 flow |
| `error.server.title` | 지금은 불러오지 못했어요 | section/full |
| `error.server.body` | 입력한 내용은 그대로예요. 다시 시도하거나 나중에 이어갈 수 있어요. | draft 보존 |
| `error.ai.title` | 기본 추천으로 이어갈게요 | info/fallback |
| `error.ai.body` | AI 연결이 늦어도 세 가지 선택은 그대로 볼 수 있어요. | provider 숨김 |
| `error.storage.title` | 기기에 저장하지 못했어요 | blocking |
| `error.storage.body` | 앱을 닫기 전에 다시 시도해 주세요. 입력은 화면에 남겨둘게요. | retry/exit |
| `error.unknown.title` | 잠시 멈췄어요 | generic |
| `error.unknown.body` | 입력한 내용은 유지했어요. 다시 시도해 주세요. | stack 숨김 |
| `error.action.retry` | 다시 시도 | action |
| `error.action.offlineContinue` | 기본 추천으로 계속 | AI/network |
| `error.action.backSafe` | 이전 화면으로 | safe exit |
| `empty.filtered.title` | 조건에 맞는 내용이 없어요 | filter |
| `empty.filtered.action` | 조건 지우기 | filter reset |

오류 문장은 `내가 잘못했다`는 인상을 만들지 않는다. `실패`, `잘못 입력`, `또`, `문제 사용자` 대신 시스템 상태와 다음 행동을 말한다.

## 15. Sensitive·긴급 지원 key

이 섹션은 tone resolver와 별개로 승인된 neutral resource만 사용한다.

| Key | `ko-KR` 기본값 |
|---|---|
| `safety.sensitive.title` | 지금은 부담을 줄이는 데 집중해볼게요 |
| `safety.sensitive.body` | 음식이나 몸에 대한 생각이 많이 버겁다면, 제한을 더하는 조언보다 안전하고 편안한 선택이 먼저예요. |
| `safety.sensitive.calories.title` | 칼로리 정보는 잠시 숨길까요? |
| `safety.sensitive.calories.body` | 이 세션에서는 숫자 없이 선택할 수 있어요. 설정은 나중에 다시 바꿀 수 있어요. |
| `safety.sensitive.calories.action` | 이번에는 숫자 숨기기 |
| `safety.sensitive.continue` | 차분히 선택 계속하기 |
| `safety.sensitive.support` | 도움 정보 보기 |
| `safety.sensitive.exit` | 이번 세션 끝내기 |
| `safety.support.title` | 혼자 감당하지 않아도 괜찮아요 |
| `safety.support.body` | 음식이나 몸에 대한 생각이 일상을 버겁게 만든다면, 신뢰하는 사람이나 자격을 갖춘 전문가에게 도움을 요청할 수 있어요. |
| `safety.support.nonMedical` | 대신은 의료·치료·응급 서비스가 아니에요. |
| `safety.escalate.title` | 지금 안전을 먼저 확인해 주세요 |
| `safety.escalate.body` | 지금 당장 자신을 해칠 가능성이 있거나 안전하지 않다면, 지역 긴급전화 또는 가까운 응급실에 연락하세요. |
| `safety.escalate.localAction` | 지역 긴급 지원 보기 |
| `safety.escalate.trustedPerson` | 신뢰하는 사람에게 연락하기 |
| `safety.escalate.close` | 앱으로 돌아가기 |
| `safety.support.unavailable` | 지역 지원 정보를 불러오지 못했어요. 즉시 위험하면 지역 긴급전화나 가까운 응급실에 직접 연락해 주세요. |

- 긴급 번호는 검증된 지역별 데이터로 삽입한다. 번호를 추측하거나 locale만 보고 단정하지 않는다.
- 이 화면에는 마스코트 joke, emoji, 축하, 공유, 리뷰, 알림, paywall을 넣지 않는다.
- 사용자의 입력 문장을 analytics 또는 오류 로그에 원문으로 보내지 않는다.

## 16. 접근성 key

| Key | `ko-KR` 기본값 |
|---|---|
| `a11y.tab.selected` | {tabName}, 선택됨 |
| `a11y.button.loading` | {label}, 처리 중 |
| `a11y.slider.hunger` | 배고픔, {value}/10, {description} |
| `a11y.slider.craving` | 지금 당김, {value}/10, {description} |
| `a11y.slider.increment` | 1 올리기 |
| `a11y.slider.decrement` | 1 내리기 |
| `a11y.option.position` | 세 가지 중 {position}번째 |
| `a11y.option.selected` | {title}, 선택됨 |
| `a11y.option.notSelected` | {title}, 선택되지 않음 |
| `a11y.timer.running` | 5분 보류 타이머, {minutes}분 {seconds}초 남음 |
| `a11y.timer.completed` | 5분 보류 타이머 완료 |
| `a11y.timer.endHint` | 두 번 탭하면 지금 타이머를 끝내고 다시 선택해요. |
| `a11y.field.error` | {label}, 오류, {message} |
| `a11y.dialog.close` | 창 닫기 |
| `a11y.disclosure.expand` | {title} 펼치기 |
| `a11y.disclosure.collapse` | {title} 접기 |
| `a11y.mascot.thinking` | 대신이가 선택을 준비 중이에요 |
| `a11y.decorative.hidden` | 빈 문자열. 장식 이미지는 접근성 트리에서 제외 |

접근성 label에 화면의 모든 본문을 중복해서 넣지 않는다. 보이는 label을 이름으로 재사용하고 상태·hint만 보충한다.

## 17. 금지 카피와 교정표

| 금지 | 이유 | 교정 |
|---|---|---|
| 또 실패했네요 | 반복 비난 | `계획과 달라도 괜찮아요. 지금 한 선택을 남겨주세요.` |
| 의지가 약하네요 | 사용자 낙인 | `습관적으로 손이 먼저 움직였을 수 있어요.` |
| 이걸 먹으면 살쪄요 | 체중 공포 | `먹기로 했다면 양과 방법을 먼저 정해볼까요?` |
| 참아야 예뻐져요 | 외모 압박 | 사용 금지, 대체 불필요 |
| 운동한 게 아깝지 않아요? | 운동 보상 유도 | 사용 금지, 대체 불필요 |
| 돼지가 될 수 있어요 | 혐오·모욕 | 사용 금지, 대체 불필요 |
| 이 정도도 못 참나요? | 수치심 | `언제든 다시 고를 수 있어요.` |
| 폭식러 / 정병 / 미친 식욕 | 낙인·미화 | `당김`, `충동`, `버거운 생각` |
| 착한 음식 / 나쁜 음식 | 음식 도덕화 | `현재 감각과 상황에 맞는 메뉴` |
| 완벽히 참았어요 | 안 먹음을 승리화 | `직접 고른 순간을 기록했어요.` |
| 연속 성공 / streak 방어 | 실패 공포 | `이번 주 의식적 선택 {count}회` |
| AI가 정확히 진단했어요 | 의료·기술 과장 | `입력한 상태를 바탕으로 선택을 정리했어요.` |
| 식욕 감퇴 효과 | 근거 없는 효능 | `사진 표시를 줄이는 저자극 보기` |
| 오늘만 할인 | 가짜 긴급성 | 실제 스토어 조건만 표시 |

## 18. 카피 QA 체크리스트

- [ ] 모든 화면 문구가 key로 호출되고 코드에 직접 쓰인 한국어가 없다.
- [ ] 기본 `ko-KR`과 tone fallback에서 누락 key가 빌드/테스트로 검출된다.
- [ ] 변수와 조사 때문에 어색한 문장이 생기지 않고 영어·일본어에서 문장 재조합이 가능하다.
- [ ] 먹음/안 먹음, 세 선택, 리포트에서 성공·실패·선악 표현이 없다.
- [ ] meme copy는 화면당 1개 이하이고 사용자·정신 상태·체형을 웃음거리로 만들지 않는다.
- [ ] sensitive, 알레르기, 오류, 삭제, 결제 문구는 neutral resource만 사용한다.
- [ ] 칼로리 숨김과 저자극 보기에서 숨긴 정보가 title·alt·accessibility label로 새지 않는다.
- [ ] paywall 가격·trial·절약률이 실제 스토어 metadata와 일치하며 닫기·복원이 보인다.
- [ ] notification과 공유 카드에서 음식명·메모·칼로리·사용자명이 기본 노출되지 않는다.
- [ ] 200% 글자 크기에서 제목·CTA가 잘리지 않도록 짧은 대체가 아니라 유연한 layout을 사용한다.

## 19. 구현 handoff

1. `ko-KR`을 완성된 기본 resource로 만들고 `en`, `ja`는 key parity test를 통과할 때만 배포한다.
2. tone variant가 없는 key는 resolver 규칙에 따라 `plain`을 사용한다. 임의의 meme를 런타임 생성하지 않는다.
3. AI가 만드는 문장은 구조화 schema, 길이, 금지어, 알레르기, safety 검증 뒤 승인된 field에만 넣는다.
4. notification, share image, native permission pre-prompt, paywall에도 같은 resource와 safety filter를 사용한다.
5. P1 기능 카피와 잠금 티저는 Launch P0 resource에 추가하지 않는다.
