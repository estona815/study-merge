# Apps in Toss 최종 게시 실행 가이드 (즉시 게시용)

## 1) 내부 검증 요약(이미 통과)

- final-launch-gate: passed
- app build: 20260612a05
- sw cache: gwalsa-routine-v20260612a05
- launch evidence: docs/launch-release-evidence-20260607.md
- functional smoke: output/playwright/20260608-functional-smoke/functional-smoke-report.json
- real model check: output/playwright/20260610-real-model-check/metrics.json
- web zip: output/release/gwalsa-web-pwa-20260611-020247.zip
- web sha256: 04baa04ac622a8325e42dbc8548a4308257e18316bf7db3ad287a23f30031adc
- store assets zip: output/store-assets/gwalsa-store-assets-20260611-020255.zip
- store assets sha256: a8d5973eeb9c653685a2e50d5ee4b7701a17ec452506c30b73e4b4681541adcc

## 2) 콘솔 제출 입력값 (복붙용)

- 앱 이름: 괄사 루틴
- 앱 카테고리: Non-game > beauty/self-care(또는 유사 카테고리)
- 핵심 설명(짧은 소개):
  - `토스 안에서 바로 여는 3분 괄사 루틴 타이머`
- 긴 설명(권장):
  - `괄사 루틴은 설치 없이 바로 실행되는 뷰티 셀프케어 미니앱입니다. 3분 루틴, 단계별 타이머, 로컬 기록, 선택형 참고 동선 표시를 제공합니다. 서버 계정/분석/광고/결제 의존 기능은 포함하지 않습니다.`
- 검색 키워드: 괄사, 셀프케어, 뷰티 루틴, 타이머, 기록, 데일리 루틴, 미니앱
- 지원 채널: 앱별/사업체 안내 채널(최종 배포용 URL 또는 이메일)
- 개인정보/약관/지원 URL: 최종 호스팅 공개 URL(현재 local 경로가 아닌 외부 공개 URL)
- 화면 캡처/아이콘: `output/playwright/20260608-launch-demo/*`, 아이콘 `assets/icon-192.png`, `assets/icon-512.png`, `assets/apple-touch-icon.png`
- 권한 안내 텍스트: `카메라/사진은 사용자가 직접 시작할 때만 요청, 거부 시 업로드 대체 가능`

## 3) 최종 클릭 순서(토스 인앱 승인 메일 수신 후)

1. 앱 in Toss 콘솔 로그인 → 앱 등록/버전 등록 화면 열기
2. 위 패키지 업로드
3. 앱 정보 입력(2항) → 저장
4. 앱 상세/심사 제출 체크박스 최종 확인
5. `최종 심사 요청` → `즉시 게시`

## 4) 완료 판단 기준

- 제출 후 리뷰 상태가 승인/게시(또는 게시 반영 알림)로 바뀌면 완료
- 증적은 `docs/launch-release-evidence-20260607.md` 및 위 패키지로 보존

## 5) 앱내 기능 리마인더(이미 반영)

- 카메라 권한 거부 시 업로드 폴백
- 알림은 denied 상태에서도 재요청 동작
- face guide는 실측 기준 우선 사용
