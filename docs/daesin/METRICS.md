# DAESIN 지표·분석 계약

- 문서 상태: Launch MVP v0.1
- 오너: Product & Growth
- 기준일: 2026-07-14
- 운영 주기: 주간 제품 리뷰, 월간 수익화 리뷰

## 1. 지표가 답해야 할 결정

대신의 지표 체계는 다음 세 가지 결정만 우선 지원한다.

1. 사용자가 자동 주문 직전에 **의식적 선택을 실제로 완료하는가?**
2. 첫 가치 경험이 충분히 빠르고 명확해 **다음 충동 순간에 다시 오는가?**
3. 핵심 개입을 무료로 유지하면서도 고급 개인화에 **자발적으로 비용을 지불하는가?**

`안 먹은 횟수`, 체중 변화, 칼로리 절감 추정치는 제품 성공 지표로 사용하지 않는다.

## 2. 측정 단위와 시간 규칙

- `profile_id`: 게스트와 연결 계정을 아우르는 내부 익명 프로필. 분석 도구에는 해시 또는 분석 전용 ID만 보낸다.
- `craving_session_id`: `craving_started`부터 `outcome_logged` 또는 명시적 이탈까지의 한 개입.
- 원시 이벤트 시간: UTC.
- 제품 주간: Asia/Seoul 기준 월요일 00:00~일요일 23:59:59.
- 신규 사용자: 해당 기기·계정에서 최초 `guest_session_created` 또는 `account_linked`가 발생한 프로필.
- 게스트가 계정을 연결할 때 과거 이벤트의 사람 수는 한 프로필로 병합하되 이벤트 자체를 중복 생성하지 않는다.
- 테스트·개발·직원 계정은 `environment`와 `is_internal`로 운영 집계에서 제외한다.

## 3. 핵심 KPI

### 3.1 북극성: 주간 의식적 선택 완료 수

**영문 키:** `weekly_conscious_choices_completed` (`WCCC`)

**정의:** 해당 제품 주간에 `option_selected`와 `outcome_logged`가 모두 존재하는 고유 `craving_session_id` 수.

```text
WCCC = COUNT(DISTINCT craving_session_id)
       WHERE option_selected exists
         AND outcome_logged exists
         AND event_week = target KST week
```

**왜 이 지표인가:** 사용자가 먹지 않았는지가 아니라, 자동 행동을 멈추고 선택과 결과 확인까지 마쳤다는 제품 가치에 가장 가깝다.

**함께 볼 정규화 지표:**

- `WCCC / WAU`: 주간 활성 프로필당 의식적 선택 완료 수
- `conscious_choice_users / WAU`: 주간에 1회 이상 의식적 선택을 완료한 프로필 비율

**오해 위험:** 잦은 충동 자체가 좋은 것은 아니다. WCCC 총량은 획득 증가만으로 오를 수 있으므로 활성 사용자당 값과 재방문율을 함께 본다.

### 3.2 활성화율

**정의:** 신규 프로필 중 최초 생성 후 24시간 안에 한 세션에서 음식 입력, 상태 확인, 행동 선택, 결과 기록을 완료한 비율.

```text
activation_rate_24h = activated_new_profiles_24h / eligible_new_profiles
```

활성화에는 `food_entered`, `hunger_selected`, `reason_selected`, `option_selected`, `outcome_logged`가 같은 세션에 필요하다. 온보딩 완료나 추천 조회만으로 활성화 처리하지 않는다.

### 3.3 7일 반복 선택 사용자율

**정의:** 활성화한 신규 프로필 중 활성화 시점부터 7×24시간 안에 서로 다른 두 개 이상의 세션에서 의식적 선택을 완료한 비율.

```text
repeat_choice_user_rate_7d = activated_profiles_with_2plus_WCCC_sessions_7d
                             / activated_profiles_eligible_for_full_7d
```

단순 앱 재실행보다 제품의 반복 가치를 측정한다. 관찰 기간이 끝나지 않은 코호트는 분모에서 제외한다.

## 4. 진단용 드라이버

| 드라이버 | 계산식 | 진단하는 문제 |
|---|---|---|
| 온보딩 완료율 | `onboarding_completed / onboarding_started` | 초기 설정 마찰 |
| Craving Gate 입력 시작률 | `food_input_started / craving_gate_viewed` | cold launch 진입 약속과 `나중에 하기` 이탈 |
| 첫 음식 입력 소요시간 | `food_input_started - craving_gate_viewed`, p50/p90 | 실행 직후 입력 가능성 |
| 첫 추천 도달률 | 첫 `craving_started` 중 `recommendation_viewed` 도달 세션 비율 | 입력·분석 단계 이탈 |
| 첫 추천 소요시간 | `recommendation_viewed - craving_started`, p50/p90 | 가치 도달 속도 |
| 추천 연속성 | `(recommendation_succeeded + recommendation_fallback_used) / recommendation_requested` | AI 장애 시 흐름 유지 |
| 선택률 | `option_selected / recommendation_viewed` 세션 | 세 카드의 명확성·적합성 |
| 결과 기록률 | `outcome_logged / option_selected` 세션 | 회고 마찰, 북극성 누락 |
| 세이브 메뉴 재사용률 | `save_meal_selected / save_meal_recommendation_viewed` | 개인화의 실제 가치 |
| 주간 리포트 조회율 | 대상 프로필 중 `weekly_report_viewed` 비율 | 패턴 피드백 가치 |
| 리포트 후 재개입률 | 리포트 조회 후 7일 내 새 WCCC 세션 보유 비율 | 리포트의 재방문 기여 |
| 알림 열람 후 완료율 | `notification_opened` 후 2시간 내 WCCC 완료 비율 | 알림의 실용성 |
| 레시피 저장률 | `recipe_saved / recipe_detail_viewed` | 선별 피드의 관련성 |
| 레시피 조리 시작률 | `recipe_cook_started / recipe_detail_viewed` | 레시피의 실제 실행 가능성 |
| 레시피 재방문율 | 레시피 조회·저장·조리 후 7일 내 다시 레시피 또는 WCCC를 완료한 프로필 비율 | 충동이 없는 날의 반복 가치 |

`save_meal_recommendation_viewed`는 일반 추천과 세이브 메뉴 추천을 구분하기 위해 필요한 지원 이벤트다. 구현이 어렵다면 `recommendation_viewed.source = saved_meal` 속성으로 대체한다.

## 5. 가드레일

### 안전·신뢰 가드레일

| 가드레일 | 기준 | 해석·조치 |
|---|---|---|
| 알려진 알레르기 추천 사고 | 출시 차단 기준 0건 | 발생 시 실험·배포 중지, 규칙과 저장 데이터 감사 |
| 핵심 흐름 연속성 | AI 성공+fallback 도달 세션 99.5% 이상을 내부 품질 목표로 사용 | 미달 시 AI 기능보다 fallback 복구 우선 |
| 민감 모드 paywall 노출 | 0건 | 이벤트 조인으로 자동 검증, 발생 시 P0 결함 |
| 기술 실패 노출 | 내부 오류·JSON·프롬프트 사용자 노출 0건 | 오류 메시지와 로깅 분리 |
| 데이터 삭제 성공률 | 요청 처리 대상 100% | 부분 실패는 완료로 표시하지 않음 |

### 성장 가드레일

| 가드레일 | 계산식 | 주의 기준 |
|---|---|---|
| 알림 비활성화율 | 알림 동의자 중 7일 내 앱 알림을 끈 프로필 비율 | 실험군이 기준군보다 5%p 이상 악화하면 중단 검토 |
| paywall 후 세션 이탈 | paywall 노출 뒤 24시간 내 핵심 세션 시작 감소 | 전주·홀드아웃 대비 하락 시 노출 빈도 축소 |
| 선택 편향 | 선택 유형별 노출 대비 선택률 | 카드 순서가 한 선택을 구조적으로 강요하는지 진단; 좋은/나쁜 선택 판정 금지 |
| 칼로리 숨김 채택 | `calories_hidden / eligible_profiles` | 성공·실패가 아닌 선호와 안전성 진단 지표 |
| sensitive mode 발생률 | `safety_mode_triggered / craving_started` | 낮추는 목표 금지; 분류 변화·지원 경로 용량만 관찰 |

## 6. 리텐션 정의

두 종류를 분리한다.

- `D1/D7/D30 app retention`: 해당 달력일에 `app_opened`가 있는 신규 코호트 비율.
- `D1/D7/D30 value retention`: 해당 달력일에 WCCC 조건을 만족한 신규 코호트 비율.

제품 판단에는 value retention을 우선하고 app retention은 푸시·딥링크 진단에 사용한다. 날짜 경계는 사용자의 마지막 알려진 시간대가 아니라 Asia/Seoul로 고정한다.

## 7. 수익화 지표

| 지표 | 정의 |
|---|---|
| Paywall 도달률 | eligibility를 충족한 프로필 중 `paywall_viewed` 비율 |
| Paywall→trial | paywall 조회 후 24시간 내 `trial_started` 비율 |
| Paywall→paid | paywall 조회 후 7일 내 `subscription_started` 비율 |
| Trial→paid | 만료 가능한 trial 중 유료 entitlement로 전환한 비율 |
| D30 유료 전환 | 활성화 프로필 중 30일 내 유료 구독 시작 비율 |
| 월간 churn | 월초 유료 구독자 중 기간 내 비자발적 실패를 제외하고 해지·만료된 비율 |
| 복원 성공률 | `subscription_restored / restore_attempted` |
| 순수익 ARPPU | 스토어 수수료·세금 반영 후 유료 사용자당 실현 수익; 영수증 원장 기준 |

가격 문자열이나 클라이언트 표시값으로 수익을 계산하지 않는다. 스토어·구독 provider의 검증된 transaction과 entitlement가 source of truth다.

## 8. 이벤트 공통 계약

### 모든 이벤트의 필수 속성

- `event_id`: 재전송 중복 제거용 UUID
- `occurred_at`: UTC ISO-8601
- `analytics_profile_id`: 분석 전용 가명 ID
- `craving_session_id`: 세션 이벤트일 때만
- `app_version`, `build_number`, `platform`, `os_version`
- `locale`, `environment`
- `experiment_assignments`: 활성 실험 ID와 셀
- `is_internal`: 운영 집계 제외 여부

### 허용된 범주형 속성

- `hunger_bucket`: `0_3 | 4_6 | 7_10`
- `reason_category`: 사전 정의된 6개 카테고리
- `option_type`: `swap | planned_portion | delay`
- `provider_type`: `production_ai | mock | rule_based`
- `latency_bucket`, `meme_level`, `tone_mode`, `theme_mode`
- 음식은 필요할 때 넓은 익명 카테고리만 허용하며 원문을 보내지 않는다.

### 분석 서비스 전송 금지

- 자유 입력 음식명과 메모
- 알레르기·식이 제한의 원문 또는 조합
- 정확한 생년월일, 체중, 의료 상태
- AI 프롬프트·응답 원문
- 안전 신호 원문과 구체적 위기 표현
- 이메일, 전화번호, 광고 식별자와의 불필요한 결합

## 9. 이벤트 사전

| 단계 | 이벤트 | 최소 속성 또는 의미 |
|---|---|---|
| 진입 | `app_opened` | `entry_source` |
| 진입 | `craving_gate_viewed` | `launch_type`, `has_active_session`, `entry_source` |
| 진입 | `food_input_started` | `input_mode`; 원문 음식명 금지 |
| 진입 | `craving_gate_dismissed` | `reason=later`; cooldown·설정 opt-out과 구분 |
| 온보딩 | `onboarding_started` | `version` |
| 온보딩 | `onboarding_completed` | `steps_seen`, `duration_bucket` |
| 계정 | `guest_session_created` | 분석 프로필 생성; 민감 정보 없음 |
| 계정 | `account_linked` | `link_method`, `merge_result` |
| 세션 | `craving_started` | `entry_source` |
| 세션 | `food_entered` | `input_mode`; 원문 음식명 금지 |
| 세션 | `hunger_selected` | `hunger_bucket`; 원점수는 제품 DB에만 |
| 세션 | `reason_selected` | `reason_category` |
| 추천 | `recommendation_requested` | `provider_type`, `saved_meal_candidate_count_bucket` |
| 추천 | `recommendation_succeeded` | `provider_type`, `latency_bucket` |
| 추천 | `recommendation_failed` | 비민감 오류 코드; 응답 원문 금지 |
| 추천 | `recommendation_fallback_used` | `failure_stage`, `rule_version` |
| 추천 | `recommendation_viewed` | `provider_type`, `option_order`, `has_saved_meal` |
| 선택 | `option_selected` | `option_type`, `position` |
| 보류 | `timer_started` | `minutes` |
| 보류 | `timer_completed` | `elapsed_bucket`, `backgrounded` |
| 보류 | `timer_cancelled` | `elapsed_bucket`; 취소를 실패로 표현하지 않음 |
| 계획 | `planned_portion_created` | 계획 유형만; 양 원문 금지 |
| 결과 | `outcome_logged` | `option_type`, `craving_change_bucket`, `satisfaction_bucket` |
| 세이브 | `save_meal_created` | 태그 수·준비시간 bucket; 메뉴명 금지 |
| 세이브 | `save_meal_selected` | `source`, `sensory_match_bucket` |
| 레시피 | `daily_recipe_feed_viewed` | `feed_date`, `item_count`, `source_status` |
| 레시피 | `recipe_detail_viewed` | `slot`, `rights_status`, `nutrition_confidence` |
| 레시피 | `recipe_saved` | `slot`; 제목·URL 원문 금지 |
| 레시피 | `recipe_cook_started` | `prep_time_bucket`, `difficulty` |
| 레시피 | `recipe_cook_completed` | `completion_source`, `satisfaction_bucket` |
| 레시피 | `recipe_not_interested` | 넓은 사유 범주; 자유 입력 금지 |
| 리포트 | `weekly_report_viewed` | `week_offset`, `entry_source` |
| 공유 | `share_card_created` | `template_id`, `aspect_ratio`, `redaction_applied` |
| 공유 | `share_started` | `share_surface`; 수신자 정보 금지 |
| 알림 | `notification_opted_in` | `prompt_context`; 시스템 토큰 금지 |
| 알림 | `notification_opened` | `notification_type`, `scheduled_time_bucket` |
| 결제 | `paywall_viewed` | `trigger`, `offering_id`, `session_state`, `sensitive_mode=false` |
| 결제 | `trial_started` | `product_id`, `offering_id` |
| 결제 | `subscription_started` | `product_id`, `offer_type` |
| 결제 | `subscription_restored` | `entitlement`, `result` |
| 결제 | `subscription_cancelled` | provider webhook 기준; 가능할 때 이유 범주 |
| 안전 | `safety_mode_triggered` | `signal_category`, `detector_version`; 원문 금지 |
| 설정 | `calories_hidden` | `source` |
| 권리 | `data_export_requested` | `request_channel` |
| 권리 | `account_deleted` | 완료된 삭제만; 삭제 뒤 개인 식별자 전송 금지 |

필요한 운영 보조 이벤트는 `notification_prompt_viewed`, `restore_attempted`, `data_deletion_failed` 세 개로 제한해 추가한다.

## 10. 대시보드 최소 구성

### 주간 제품 리뷰

1. WCCC, WCCC/WAU, 의식적 선택 사용자 수
2. 활성화율과 단계별 funnel
3. 7일 반복 선택 사용자율과 D1/D7 value retention
4. 첫 추천 p50/p90, AI 성공률, fallback 사용률
5. 선택 유형별 노출·선택·결과 기록률
6. 레시피 피드→상세→저장·조리 funnel과 레시피 재방문율
7. 알림·paywall·sensitive mode 가드레일

### 월간 수익화 리뷰

1. eligibility→paywall→trial→paid funnel
2. 상품·오퍼별 trial→paid와 D30 유료 전환
3. 갱신, 자발적 churn, 결제 실패
4. 유료/무료 코호트의 WCCC와 D30 value retention
5. 환불·지원 문의·paywall 후 세션 이탈

## 11. 초기 목표 설정 원칙

현재 내부 베이스라인과 검증된 시장 비교치가 없으므로 성장 목표를 확정값으로 두지 않는다. 아래 값은 외부 벤치마크가 아니라 **private beta의 임시 판정선**이다.

| 지표 | 임시 판정선 | 근거와 재설정 시점 |
|---|---|---|
| 핵심 흐름 연속성 | 99.5% 이상 | AI 장애가 사용자를 막지 않아야 한다는 제품 계약 |
| 첫 추천 시간 | p50 60초 이하, p90 120초 이하 | 배달앱 직전 사용 맥락의 내부 UX 가설 |
| 24시간 활성화율 | 40% 이상 | 첫 200명 또는 4주 뒤 실제 단계 이탈로 재설정 |
| 결과 기록률 | 50% 이상 | 결과 반영이 북극성 계산과 개인화에 필요한 최소 가설 |
| 7일 반복 선택 사용자율 | 15% 이상 | 첫 200명 또는 4주 뒤 코호트별 재설정 |

가격 전환 목표는 상품·스토어·trial 조건이 확정되고 최소 100회 이상의 적격 paywall 노출이 쌓이기 전에는 두지 않는다. 표본이 작으면 전환율보다 인터뷰·이탈 이유·지원 문의를 함께 본다.

## 12. 실험 규칙

- 실험 할당 단위는 `analytics_profile_id`; 게스트→계정 연결 뒤 셀을 유지한다.
- 한 사용자가 동시에 두 가격 셀을 보지 않게 한다.
- 진행 중 세션, sensitive mode, 삭제 요청 상태의 사용자는 수익화 실험에서 제외한다.
- 성공 지표 1개, 진단 1~2개, 안전 가드레일 1~2개를 사전에 고정한다.
- 표본 수와 최소 검출 효과를 정하지 않은 채 작은 차이를 승리로 선언하지 않는다.
- 실험 종료 뒤 이벤트 정의, 기간, 셀, 제외 기준, 결과를 함께 보존한다.
- 선택 카드 순서 실험은 `먹지 않음` 비율이 아니라 WCCC와 결과 기록률을 성공 지표로 삼는다.

## 13. 알려진 측정 한계

- 앱은 실제 배달 결제 여부를 자동 감지하지 않으므로 행동 결과는 사용자의 짧은 자기 기록에 의존한다.
- 알림을 열지 않고 앱을 직접 연 경우 알림 기여를 단정할 수 없다.
- 안전 신호 발생률은 실제 유병률이나 진단값이 아니며 detector 변경에 민감하다.
- 초기 코호트는 다크 큐트 미감 선호층에 편향될 수 있다.
- 앱스토어 개인정보 동의와 분석 opt-out 때문에 전체 사용자 수와 분석 대상 수가 다를 수 있다.
