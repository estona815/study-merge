# Apps In Toss Submission Packet

작성 기준: 2026-06-12 KST

## Packet Scope

이 패키지는 싸괄을 앱인토스 비게임 미니앱으로 검토하기 위한 제출 초안입니다. 제품 설명은 **일반 뷰티 셀프케어 PWA** 범위로만 유지합니다.

핵심 메시지:

- 설치 없는 3분 괄사 루틴 미니앱
- 토스 안에서 바로 여는 단계별 타이머 경험
- 로컬 기록과 사용자 제어 중심
- 앱인토스 포팅과 콘솔 제출 준비는 `granite.config.ts`와 `TOSS_INAPP_RELEASE_TODO.md`로 분리

## Files

- `miniapp-brief.md`: 앱인토스용 제품 설명과 3분 루틴 흐름
- `porting-checklist.md`: PWA에서 앱인토스 미니앱으로 옮길 때의 개발 체크리스트
- `monetization-checklist.md`: 인앱 결제, 광고, 유료 기능 검토 체크리스트
- `privacy-safety-summary.md`: 앱인토스 포팅 시 개인정보와 권한 경계
- `qa-evidence.md`: 현재 PWA QA 증적과 앱인토스 추가 QA 항목
- `copy-claims-checklist.md`: 미니앱 문구 검수 체크리스트
- `final-post-playbook-20260611.md`: 토스 인앱 최종 게시 실행 가이드(즉시 제출용)
- `../../../granite.config.ts`: WebView 미니앱 설정 draft
- `../../../TOSS_INAPP_RELEASE_TODO.md`: 콘솔 입력값, 에셋, 샌드박스 QA, `.ait` 업로드 TODO
- `../../../output/apps-in-toss/latest-apps-in-toss-submission.json`: Apps in Toss 콘솔 업로드용 이미지/문안 패킷 최신 포인터

## Official References Checked

- Apps in Toss developer center: `https://developers-apps-in-toss.toss.im/`
- Apps in Toss landing page: `https://toss.im/apps-in-toss`
- Non-game release guide: `https://developers-apps-in-toss.toss.im/checklist/app-nongame.html`
- Miniapp release guide: `https://developers-apps-in-toss.toss.im/development/deploy.html`
- API integration process: `https://developers-apps-in-toss.toss.im/development/integration-process.html`
- In-app purchase development guide: `https://developers-apps-in-toss.toss.im/iap/develop.html`
- FAQ: `https://developers-apps-in-toss.toss.im/faq.html`

앱인토스 문서는 지속적으로 바뀔 수 있으므로 콘솔 제출 당일 다시 확인해야 합니다.

## Current Fit

- Current app is a static PWA with HTML, CSS, and vanilla JavaScript.
- Current build basis is `20260612a06`; release package must be regenerated after this packet is verified.
- Current implementation has no backend, account system, analytics SDK, advertising SDK, or payment SDK.
- Current app uses browser `localStorage`, camera/upload only by user action, and service worker caching for web/PWA distribution.
- MediaPipe Tasks Vision JS/WASM runtime is vendored under `assets/vendor/mediapipe/tasks-vision/0.10.35/`.
- Latest Apps in Toss image package: `gwalsa-apps-in-toss-submission-20260612-141845`, generated with `싸괄` visual branding.

## External Items Still Required

- Apps in Toss console access, workspace, business registration, app registration, and `appName`
- Final Apps in Toss console `appName`, icon URL, category, public policy/support URLs, and developer contact
- Miniapp bundle creation and sandbox testing with official tooling
- Apps in Toss design and release review
- Monetization integration, if used
- Hosted privacy/support URL, native wrapper, signing, and store console forms if this package is reused for app store submission

## Toss 바로 게시 실행 상태

내부 검증은 `final-launch-gate` 기준으로 통과 상태이며, 제출은 아래 문서의 순서로 콘솔에서 진행하세요.

- `docs/submissions/apps-in-toss/final-post-playbook-20260611.md`

## Copy Guardrail

Use:

- "설치 없이 바로 여는 3분 괄사 루틴"
- "뷰티 셀프케어 타이머"
- "현재 브라우저 또는 미니앱 환경의 로컬 기록"
- "참고 동선 표시"

Avoid:

- Appearance change promises
- Before/after proof language
- Face guide language that sounds like judgement
- Paid feature copy that implies a stronger visible outcome
- Any data handling claim that has not been rechecked after Toss SDK/API integration
