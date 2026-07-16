# DAESIN Backlog

> Launch rule: P0가 통과하기 전 아래 항목을 구현하지 않는다.  
> Backlog는 약속이나 `곧 제공` UI가 아니라 범위 통제 기록이다.

## P0 release blockers — 구현 또는 외부 검증 필요

- cold launch에서 통계·온보딩보다 `Craving Gate`를 먼저 표시하고 2시간 cooldown, 진행 세션·딥링크 우선, 설정 opt-out을 상태·테스트로 고정한다.
- 연결 계정 모드에서는 local 5개 제한과 동일한 규칙을 server transaction/RLS로 강제하고 race condition을 검증한다.
- 실제 subscription provider의 offering, 현지 가격, purchase/restore/expiry/refund/grace 상태를 연결하고 sandbox에서 검증한다.
- `docs/MASTER_SPEC.md`의 오늘의 대신 레시피를 mock source → 허용 source adapter → 권리·sanitize·영양 범위·알레르기·중복·게시 gate 순서로 구현하고 피드→저장·조리 계측을 연결한다.
- server-held key 기반 실제 AI와 production analytics transport를 연결한 뒤 schema·fallback·redaction을 재검증한다.
- Supabase migration을 local/staging에 적용하고 두 사용자 owner-isolation, export, cascade delete를 증명한다.
- iOS·Android native smoke, 정책/지원 URL, 양 플랫폼 제출 스크린샷을 완료한다.

## P1 — documented, not in current build

| Item | Why deferred | Entry gate |
|---|---|---|
| 실시간 음성 AI | 비용·민감 음성·오인식·권한 위험 | P0 retention 확인, 음성 privacy review |
| 음식 사진 인식 | 이미지 권한·오분류·알레르기 안전 위험 | server-side image safety와 명시 consent |
| 냉장고 사진 분석 | 가정 환경·위치 단서, 복합 인식 | image retention 0/default와 user study |
| 편의점 실시간 상품 데이터 | 공급사 계약·영양/알레르기 정확도 | 공식 data source와 갱신 SLA |
| 배달앱 실행 자동 감지 | 플랫폼 정책·감시 인상 | 별도 policy/legal review와 opt-in |
| Android 접근성 서비스 앱 감시 | 과도한 권한·store policy 위험 | 원칙적으로 재검토; 핵심 가치로 정당화 필요 |
| iOS Screen Time API | entitlement·심사·권한 제약 | Apple 승인 가능성 및 최소 권한 설계 |
| 위젯 | 핵심 session 밖의 surface 증가 | P0 app flow와 privacy-safe copy 안정화 |
| 운동 기록 | 체중 감량 제품으로 범위 이탈 | 제품 전략 재승인 |
| 물 섭취 기록 | 핵심 충동 브레이크와 직접 관련 낮음 | 제품 전략 재승인 |
| 체중 그래프 | 체형 집착·섭식 안전 위험 | Launch 방향에서는 구현하지 않음 |
| 커뮤니티 | moderation·민감 건강 정보 위험 | trust & safety 운영 인력과 policy |
| 친구 경쟁 | 먹기/참기 선악화 위험 | Launch 방향에서는 구현하지 않음 |
| 웨어러블 | device data·권한·효용 불명 | user demand와 health-data privacy review |
| 의료 상담 | 의료 행위·책임·전문가 검증 | 별도 regulated product 검토 |
| 코치 마켓플레이스 | 신원·자격·결제·안전 운영 | 별도 사업/법무/marketplace 설계 |

## Post-launch experiments, not commitments

- 시간대별 한 가지 micro-action의 재방문 효과
- 사용자가 직접 만든 세이브 메뉴의 추천 우선순위 조절
- 주간 리포트의 low-data 설명과 다음 주 제안 1개
- `#결제전5분` 공유 카드의 privacy-safe 참여율
- Pro value framing: 개인화 vs 상세 패턴, 민감 순간 제외

각 실험은 `docs/daesin/METRICS.md`의 guardrail을 사용하고, 음식 원문·알레르기·메모를 분석 속성으로 추가하지 않는다.

## Backlog safety rules

- 체중 감량, 칼로리 제한, 연속 참기 streak, 랭킹, 신체 before/after는 backlog로도 승격하지 않는다.
- 자동 감지·음성·사진·웨어러블은 명시적 opt-in, 최소 수집, delete/export, provider retention 검토 없이는 시작하지 않는다.
- 유료 기능이 알레르기 필터, 민감 모드, fallback, export/delete를 약화시키지 않는다.
- 새 아이디어는 P0 flow, privacy, native 안정성, RLS, billing 검증을 지연시키면 보류한다.
