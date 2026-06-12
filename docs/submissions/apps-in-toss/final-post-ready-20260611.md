# Apps in Toss 최종 게시 Ready Sheet (2026-06-11)

## 제출 전 자동 검증 상태

- final-launch-gate: **passed**
- app build: `20260612a06`
- sw cache: `gwalsa-routine-v20260612a06`
- launch evidence: `docs/launch-release-evidence-20260607.md` (update-launch-evidence output 기준)
- functional smoke: `output/playwright/20260608-functional-smoke/functional-smoke-report.json` (`passed`)
- real model check: `output/playwright/20260610-real-model-check/metrics.json` (`passed`, `provider=mediapipe`, `referenceOnly=false`)

## 업로드 패키지

- Web release zip: `output/release/gwalsa-web-pwa-20260612-141823.zip`
- Web release manifest: `output/release/gwalsa-web-pwa-20260612-141823/release/release-manifest.json`
- Web sha256: `04baa04ac622a8325e42dbc8548a4308257e18316bf7db3ad287a23f30031adc`
- Store assets zip: `output/store-assets/gwalsa-store-assets-20260612-141832.zip`
- Store assets sha256: `a8d5973eeb9c653685a2e50d5ee4b7701a17ec452506c30b73e4b4681541adcc`

## 토스 인앱 최종 단계 체크(콘솔에서 수작업)

1. 앱인토스 콘솔에 로그인 후 앱 개요/버전 등록 진입
2. 앱 이름: `괄사 루틴`
3. 카테고리: Non-game > 뷰티/셀프케어 유틸
4. 제출 빌드: 생성된 런타임 번들/패키지 업로드
5. 공개 URL/지원 URL 입력
   - 현재 앱은 로컬 경로(`./public/*.html`) 기준이므로, 제출 전 **최종 공개 호스팅 URL**만 연결하면 됩니다.
6. 고객/문의 채널, 개발자/회사명, 사업자/개인명, 앱 정책 동의 항목 최종 확인
7. `허용 메일` 수신 상태에서 최종 심사 요청 및 게시

## 핵심 유의사항

- 카메라/업로드 권한은 사용자 시작 동작에서만 요청되며, 거부 시 업로드 폴백은 동작합니다.
- 알림 재요청 버튼은 권한 `denied` 상태에서도 다시 켤 수 있도록 유지했습니다.
- Face guide의 기준 모드는 실서비스 기준에서 실제 랜드마크 경로를 우선 사용합니다.
