# DAESIN Privacy and Data Handling Contract

> 문서 성격: 제품·개발·QA용 개인정보 계약 및 스토어 공개 초안  
> 상태: 법무 검토 전, production 연동 검증 전 · 2026-07-14

대신은 사용자의 음식 선택을 평가하기 위해 데이터를 모으지 않는다. 필요한 순간에 선택을 돕는 데 필요한 최소 정보만 처리하고, 민감한 원문은 분석·광고 목적으로 전송하지 않는다.

## 1. Scope and principles

1. 게스트 우선이며 첫 추천 전 계정 생성을 요구하지 않는다.
2. mock/demo mode는 외부 AI 없이 동작해야 한다.
3. 음식명, 감정 메모, 알레르기·식이 제한은 민감한 사용자 데이터로 취급한다.
4. 분석은 allowlist event만 사용하고 자유 입력 원문을 금지한다.
5. 추천 안전성, 데이터 export/delete는 구독 여부와 무관하다.
6. 삭제는 부분 성공을 완료로 표시하지 않는다.
7. 앱은 의료 서비스가 아니며 진단·치료·식욕 억제·체중 감량을 제공하지 않는다.

## 2. Guest and account model

### Guest

- 첫 실행 시 추측하기 어려운 random guest profile ID를 만든다.
- 이메일, 전화번호, 실명을 요구하지 않는다.
- demo/local-only mode의 profile, preference, session, save meal은 기기 저장소에만 둔다.
- 앱 삭제, OS 데이터 정리, `내 데이터 삭제`로 local data가 사라질 수 있으며 동기화되지 않은 데이터는 복구할 수 없다.

### Connected account

- 계정 연결은 선택 사항이며 guest history의 동기화·복구가 필요할 때 명시적으로 시작한다.
- guest→account 연결은 사용자 확인 뒤 수행하며 원본을 중복 생성하지 않는다.
- 서버 권한은 사용자 ID와 row ownership으로 검사한다. UI에서 숨기는 것만으로 권한을 보호하지 않는다.
- auth/session token은 앱의 일반 profile snapshot이나 export에 넣지 않는다. provider SDK가 관리하는 token의 수명·회전·logout purge를 별도로 검증한다.

## 3. Data inventory

| Category | Examples | Purpose | Default location | Analytics |
|---|---|---|---|---|
| Profile | random profile ID, adult confirmation | 게스트 식별·성인 범위 | local; 연결 시 server | 가명 analytics ID만 |
| Preferences | theme, tone, meme intensity, calories hidden, low-stimulation | 화면·copy 개인화 | local; 선택적 sync | coarse setting event |
| Dietary safety | allergy IDs, restriction IDs | 금지 후보 hard block | local; 선택적 sync | 원문·조합 전송 금지 |
| Craving session | food text, hunger, reason, timestamps | 세 가지 선택 생성 | local; 선택적 sync | food text 금지, coarse enum만 |
| Outcome | selected option, satisfaction, urge change, note | 주간 리포트·개인화 | local; 선택적 sync | note 금지, bucket만 |
| Save meals | menu, ingredients, tags, use count | 재추천 | local; 선택적 sync | menu/ingredient 원문 금지 |
| AI exchange | 최소화된 structured request/response | 상황 요약·후보 생성 | production server only | prompt/response 원문 금지 |
| Subscription | entitlement, product ID, expiry/status | Pro 기능 접근 | store/provider + cached status | 가격 문자열 대신 product/result enum |
| Diagnostics | app version, non-sensitive error code | 안정성 개선 | error adapter | 사용자 입력·stack 내 token 금지 |

`선택적 sync`는 실제 backend가 활성화되고 사용자가 계정을 연결했을 때만 해당한다. 현재 빌드가 local/mock인지 production-connected인지 release checklist에서 별도로 표시한다.

## 4. Local storage security

- AsyncStorage/Web Storage는 암호 금고가 아니며 조작 가능하다고 가정한다.
- service-role key, AI provider key, private key, webhook secret, 장기 bearer token을 앱 소유 storage에 저장하지 않는다.
- 저장 payload에는 schema version을 두고 hydrate 전에 strict validation과 migration을 수행한다.
- storage의 문자열을 HTML, URL, dynamic code로 직접 실행하거나 삽입하지 않는다.
- 기기 잠금·OS 암호화가 없는 환경에서 local data가 노출될 수 있음을 개인정보 안내에 투명하게 설명한다.
- AsyncStorage의 앱 데이터는 별도 field-level 암호화를 제공하지 않는다. 기기에 접근할 수 있는 사람, 탈옥·루팅, 취약한 backup 환경에서는 알레르기와 메모가 노출될 위험이 있으므로 사용자에게 OS 화면 잠금과 최신 보안 업데이트 사용을 권고한다.
- 민감도가 높은 계정 자격 증명이 필요하면 플랫폼 보안 저장소와 provider 권장 token 관리 방식을 별도 threat review 후 사용한다.

## 5. AI and network boundary

- 앱 번들에서 외부 AI provider를 직접 호출하지 않는다.
- production AI 호출은 server-side adapter가 수행하며 client에는 provider secret가 없다.
- server는 strict schema, 길이, enum, 알레르기·식이, 민감 모드 규칙을 검증한 뒤 필요한 field만 반환한다.
- provider timeout, invalid response, network error이면 rule-based fallback으로 핵심 흐름을 계속한다.
- provider에 보내는 데이터는 기능에 필요한 최소 field로 제한한다. 사용자 자유 메모, 계정 식별자, 전체 history는 기본 전송하지 않는다.
- AI provider, 처리 지역, 보존 기간, 학습 사용 여부는 실제 계약이 정해진 뒤 공개 문구와 스토어 disclosure에 반영한다. 확정 전에는 추정해 쓰지 않는다.

## 6. Analytics and diagnostics allowlist

### Allowed

- 승인된 event name과 schema version
- 가명 analytics profile ID와 session ID
- option/reason/provider/error의 승인된 enum
- count, boolean, duration bucket, app version, platform
- paywall trigger, offering/product ID, entitlement result

### Never send as event properties or ordinary logs

- 음식명, 재료명, 최근 음식 목록, 검색어
- 자유 메모, AI prompt, AI raw response, support message
- 알레르기·식이 제한 원문 또는 조합
- 정확한 배고픔·충동 점수의 사용자별 시계열
- 이메일, 이름, 전화번호, auth/session token
- export 파일 내용, 삭제 확인 문구, subscription receipt 원문

analytics consent가 꺼져 있으면 필수 운영에 필요하지 않은 analytics 전송을 중지한다. 오류 수집이 별도 필수 처리로 운영된다면 수집 항목·목적·보존 기간을 구분해서 공개한다.

## 7. Supabase and row-level access

- profile, craving session, outcome, save meal은 owner ID 기준 RLS를 강제한다.
- client는 public/anon 범위의 설정만 알 수 있으며 service-role key는 서버에서만 사용한다.
- 사용자 A가 사용자 B의 row를 `select/insert/update/delete`할 수 없어야 한다.
- delete/export RPC는 현재 인증 사용자 본인의 row만 처리하고, 대상 profile ID를 client 입력만으로 신뢰하지 않는다.
- storage bucket이 추가되면 object path와 ownership 정책도 같은 사용자 경계를 적용한다.
- migration 파일 존재는 배포 증거가 아니다. local reset, staging history, 두 사용자 isolation test를 각각 기록한다.

## 8. Data export

`내 데이터 내보내기`는 구독 없이 사용할 수 있다.

포함:

- export schema/version과 생성 시각
- 사용자 설정과 식이 안전 설정
- craving sessions, 선택, outcomes, notes
- save meals와 사용 기록

제외:

- auth/session token, provider secret, subscription receipt 원문
- 내부 error stack, server-only ID, analytics profile ID
- 다른 사용자의 데이터

export는 사용자가 명시적으로 요청한 뒤 기기 내 임시 파일로 만들고 OS share sheet로 전달한다. 임시 파일의 삭제 시점과 실패 처리를 검증하고, 앱이 임의의 외부 목적지로 업로드하지 않는다.

## 9. Delete-all

### Guest local-only

1. 사용자가 `삭제`를 직접 입력해 확인한다.
2. profile, onboarding, preference, draft, session, outcome, save meal, cached report를 제거한다.
3. analytics identifier를 reset하고 새 guest 상태를 만든다.
4. 삭제가 모두 끝난 뒤에만 완료를 표시한다.

### Connected account

1. 재인증 또는 이에 준하는 확인을 거친다.
2. server가 owner 범위의 profile과 종속 데이터를 transaction/cascade 정책으로 삭제한다.
3. remote 완료를 확인한 뒤 local snapshot, cache, auth session을 purge한다.
4. 일부 단계가 실패하면 완료로 표시하지 않고 재시도·지원 경로를 제공한다.

앱 데이터 삭제가 App Store 또는 Google Play 구독을 자동 해지하지 않을 수 있음을 삭제 전에 알리고, 별도의 스토어 구독 관리 경로를 제공한다. 삭제 완료 이벤트는 개인 식별 속성 없이 한 번만 보낸다.

## 10. Retention and sharing

- guest local data는 사용자가 삭제하거나 앱/OS가 제거할 때까지 기기에 남을 수 있다.
- account server retention과 backup purge 기간은 production 운영 정책이 확정되기 전 `TBD`이며 출시 전 반드시 수치와 예외를 공개한다.
- analytics/error provider retention은 vendor 설정과 실제 계약에 맞춰 출시 전 기록한다.
- 주간 공유 카드는 기본적으로 이름, 음식 상세, 메모, 칼로리, 정확한 시간을 제외한다.
- 법적 의무 보존이 필요한 결제 기록은 앱의 식사·감정 데이터와 분리하고, 스토어/provider의 정책을 따른다.

## 11. User-facing privacy copy draft

> 대신은 회원가입 없이 시작할 수 있어요. 음식 입력, 선택 기록, 알레르기·식이 제한은 추천과 기록을 위해 사용됩니다. 게스트 기록은 기본적으로 이 기기에 저장되며, 계정을 연결한 경우에만 동기화 대상이 될 수 있어요. 입력한 음식명, 메모, 알레르기·식이 제한 원문은 제품 분석이나 광고 이벤트로 보내지 않습니다. 설정에서 내 데이터를 내보내거나 삭제할 수 있습니다.

> 대신은 의료 서비스가 아니며 진단, 치료 또는 체중 감량을 제공하지 않습니다. 음식이나 몸에 대한 생각으로 일상이 버겁다면 자격을 갖춘 전문가나 신뢰하는 사람에게 도움을 요청할 수 있습니다.

이 문구는 실제 shipping SDK, backend 처리, 보존 기간, 문의처, 사업자 정보, 국외 이전 여부가 확정된 뒤 법무 검토를 받아야 한다.

## 12. Release privacy gate

- [ ] 실제 network capture가 이 데이터 맵과 일치한다.
- [ ] App Store/Google Play privacy disclosure가 실제 SDK 수집과 일치한다.
- [ ] analytics와 error payload에 금지 원문이 없다.
- [ ] guest와 account export/delete가 각각 통과한다.
- [ ] RLS migration이 local/staging에서 owner isolation을 통과한다.
- [ ] AI·analytics·error·subscription provider와 보존 기간, 처리 지역, opt-out이 공개됐다.
- [ ] 앱 bundle과 repo secret scan이 통과했다.
- [ ] local 민감 데이터의 평문-at-rest 위험, OS 잠금 권고, backup 정책이 사용자 안내와 내부 risk acceptance에 반영됐다.
- [ ] 문의처·사업자·정책 URL과 시행일이 확정됐다.
- [ ] 법무/개인정보 담당자가 최종 문구를 승인했다.
