# 괄사 앱 출시 후보 체크리스트

이 문서는 현재 정적 PWA가 실제 사용자 테스트에 들어갈 수 있는지 빠르게 확인하기 위한 기준입니다.

## 완료 기준

- 첫 실행 안내가 표시되고 뷰티 셀프케어/비의료 안내가 포함된다.
- 오늘 화면에서 주간 목표, 컨디션 추천, 시작 전 피부 체크, 7일 플랜, 타이머가 동작한다.
- 루틴 화면에서 기본 루틴, 부위별 가이드, 커스텀 루틴 추가/삭제가 가능하다.
- 기록 화면에서 세션 저장, 피부 반응, 전후 느낌 값, 사진 압축 저장, 사진 비교, 삭제/복원이 가능하다.
- 루틴 완료 후 완료 패널이 표시되고 기록 화면으로 이동할 수 있다.
- 설정 화면에서 피부 프로필, 압력, 베이스, 알림, 정책/개인정보, 사진 보관, 데이터 초기화가 가능하다.
- 백업은 전체/사진 제외 모드를 지원하고, 검증 코드 불일치 시 미리보기/병합/가져오기를 막는다.
- 참고 가이드는 로컬 참고 동선 표시로 설명되며 의료/피부 분석처럼 보이지 않는다.
- 운영 URL에서 참고 가이드 성공은 MediaPipe Face Landmarker의 실제 랜드마크 결과일 때만 인정한다.
- mock/reference 경로는 `?referenceGuide=1` 또는 `?faceGuideMode=reference` QA 쿼리에서만 허용한다.
- 병합은 현재 기록을 유지하고 새 기록을 더하며, 가져오기는 백업 상태로 교체하되 직전 상태로 되돌릴 수 있다.
- 서비스워커 캐시 버전과 앱 빌드가 일치한다.
- 설정의 "개인정보 처리방침", "이용약관", "지원 안내" 버튼이 `/public/privacy-policy.html`, `/public/terms-disclaimer.html`, `/public/support.html`로 연결된다.
- manifest와 iOS 홈 화면용 PNG 아이콘 파일이 존재한다.
- 모바일 390px 폭에서 가로 overflow가 없어야 한다.

## 현재 빌드

- 앱 빌드: `20260612a06`
- 서비스워커 캐시: `gwalsa-routine-v20260612a06`
- 저장 방식: 브라우저 로컬 저장소
- Apps in Toss 준비: `granite.config.ts`, `TOSS_INAPP_RELEASE_TODO.md`

## 검증 명령

```bash
node --check app.js
./scripts/launch-precheck.sh
./scripts/run-real-face-model-check.sh
python3 -m http.server 4173
curl -s http://localhost:4173/index.html | rg "20260612a06|싸괄"
curl -s http://localhost:4173/service-worker.js | rg "gwalsa-routine-v20260612a06|20260612a06"
./scripts/make-handoff-snapshot.sh
./scripts/write-launch-evidence.sh
```

추가 증적:

- `docs/launch-release-evidence-20260607.md`
- `docs/launch-audit.md`

스냅샷은 필요한 경우에만 만들고, 업로드 또는 보관 후 `/tmp/gwalsa-handoff`에서 삭제합니다.
