# 싸괄

얼굴 컨디션을 가볍게 확인하며 루틴을 이어가는 괄사 셀프케어 정적 PWA입니다. 괄사 루틴 안내, 단계별 타이머, 로컬 기록, 전후 사진 메모, 백업/복원, 알림 리마인더를 제공합니다.

이 앱은 일반적인 뷰티 루틴과 셀프케어 참고용입니다. 의료 조언, 진단, 치료, 질병 예방 목적이 아닙니다.

## 기술 스택

- HTML, CSS, vanilla JavaScript
- Service Worker 기반 오프라인 캐시
- Web App Manifest 기반 설치형 PWA
- 브라우저 `localStorage` 저장
- MediaPipe Face Landmarker 기반 얼굴 참고 동선 표시
- 정적 웹 배포 기준으로 동작하며, 앱인토스 제출 준비 파일은 `granite.config.ts`와 `TOSS_INAPP_RELEASE_TODO.md`에 분리

## 실행

```bash
python3 -m http.server 4173
```

브라우저에서 `http://localhost:4173`을 엽니다.

## 검증

```bash
node --check app.js
curl -s http://localhost:4173/index.html | rg "싸괄|20260612a06"
curl -s http://localhost:4173/service-worker.js | rg "gwalsa-routine-v20260612a06|20260612a06"
```

## 저장 데이터

- 루틴 기록, 설정, 커스텀 루틴, 압축 사진은 현재 브라우저의 `localStorage`에 저장됩니다.
- 서버, 계정, 분석 SDK, 결제 SDK는 없습니다.
- 백업 JSON은 사용자가 직접 만들고 보관합니다.
- 설정 화면에서 사진만 삭제, 기록 삭제, 전체 앱 데이터 초기화가 가능합니다.
- 참고 가이드용 카메라/업로드 이미지는 브라우저 안에서 참고 동선 표시용으로만 처리하며, 원본 카메라/업로드 이미지는 기록이나 백업에 저장하지 않습니다.
- 얼굴 참고 가이드의 출시 모드 성공 기준은 MediaPipe Face Landmarker의 실제 랜드마크 결과입니다. `?referenceGuide=1` 또는 `?faceGuideMode=reference`는 자동 QA용 reference 경로에서만 사용합니다.

## 주요 문서

- [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)
- [STORE_LISTING_DRAFT.md](STORE_LISTING_DRAFT.md)
- [PRIVACY_POLICY_DRAFT.md](PRIVACY_POLICY_DRAFT.md)
- [TERMS_DISCLAIMER.md](TERMS_DISCLAIMER.md)
- 공개 버전: [개인정보 처리방침](./public/privacy-policy.html), [이용약관](./public/terms-disclaimer.html), [지원 안내](./public/support.html)
- [MANUAL_QA_CHECKLIST.md](MANUAL_QA_CHECKLIST.md)
- [docs/launch-audit.md](docs/launch-audit.md)
- [docs/store-submission-packet.md](docs/store-submission-packet.md)
- [docs/store-privacy-answers.md](docs/store-privacy-answers.md)
- [docs/external-store-inputs.md](docs/external-store-inputs.md)

## 런칭 증적 생성

```bash
./scripts/final-launch-gate.sh
```

또는 단계별로 실행합니다.

```bash
./scripts/generate-launch-screenshots.sh
./scripts/run-functional-smoke.sh
./scripts/run-real-face-model-check.sh
./scripts/launch-readiness-audit.sh
./scripts/launch-blocker-report.sh
./scripts/package-web-release.sh
./scripts/verify-web-release.sh
./scripts/package-store-assets.sh
./scripts/verify-store-assets.sh
./scripts/write-launch-evidence.sh
```

스크린샷과 브라우저 검증 결과는 `output/playwright/20260608-launch-demo/`에 생성됩니다.
기능 smoke 결과는 `output/playwright/20260608-functional-smoke/functional-smoke-report.json`에 생성됩니다.
운영 모드 MediaPipe 실감지 결과는 `output/playwright/20260610-real-model-check/metrics.json`에 생성됩니다.
정적 웹 배포용 zip과 해시 증적은 `output/release/`에 생성됩니다. zip 안의 `web/` 폴더 내용이 호스팅 루트에 올릴 파일입니다.
스토어/검수 전달용 에셋 zip은 `output/store-assets/`에 생성됩니다.
`verify-web-release.sh`는 최신 zip을 임시 폴더에 풀고 HTTP로 다시 띄워 배포 루트 응답, 해시, manifest 설치 필드, 서비스워커 메타데이터, 패키지 내부 기능/스크린샷 증적, 오프라인 공개 페이지 fallback을 확인합니다.
`write-launch-evidence.sh`는 현재 빌드, 스크린샷 메트릭, 최신 릴리스 zip 기준으로 `docs/launch-release-evidence-20260607.md`와 `docs/launch-qa-20260607.md`를 갱신합니다.

## 알려진 제한

- 현재는 로컬 전용 웹앱이며 계정 동기화가 없습니다.
- 전후 사진 원본은 저장하지 않고 브라우저에서 축소/압축한 데이터만 저장합니다. 기본 사진 보관은 최근 10건입니다.
- 카메라 권한은 사용자가 참고 가이드 카메라를 직접 시작할 때만 요청됩니다.
- 브라우저 알림은 브라우저 권한과 실행 환경에 따라 동작이 제한될 수 있습니다.
- 앱스토어/플레이스토어 제출에는 별도 래핑, 서명, 스크린샷 제작이 필요합니다.
- 완전 오프라인 얼굴 감지까지 요구되는 배포에서는 MediaPipe Tasks Vision JS/WASM 런타임을 CDN 대신 앱 자산으로 vendoring해야 합니다.
