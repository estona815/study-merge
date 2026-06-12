# 싸괄 Apps in Toss 제출 TODO

기준 빌드: `20260612a06`

이 저장소에는 `granite.config.ts`와 정적 `dist` 빌드 스크립트를 추가했습니다. 공식 앱인토스 문서 기준으로 기존 웹 프로젝트는 `@apps-in-toss/web-framework` 설치, `ait init`, `granite.config.ts` 설정, 빌드 후 콘솔 업로드 흐름이 필요합니다. 이 로컬 환경에는 ax MCP와 npm 실행 파일이 없어 `.ait` 최종 번들 재생성은 검증하지 않았습니다.

## 콘솔에서 확정할 값

- `appName`: 현재 placeholder는 `sagwal`입니다. 콘솔에서 확정한 값과 `granite.config.ts`를 일치시켜야 합니다.
- 앱 이름: `싸괄`
- 브랜드 색상: 현재 placeholder는 `#2F7D72`입니다.
- 아이콘 URL: 콘솔에 업로드한 아이콘 URL을 `granite.config.ts`의 `brand.icon`에 입력해야 합니다.
- 앱 카테고리: 비게임, 뷰티/웰니스 성격으로 정책 검토가 필요합니다.
- 개발자명, 연락처, 사업자 여부
- 공개 개인정보처리방침 URL
- 공개 이용약관 URL
- 공개 지원/고객센터 URL 또는 이메일

## 권한 및 기능 검토

- 카메라: 참고 동선 표시를 사용자가 직접 시작할 때만 요청합니다.
- 사진첩/파일: 사용자가 직접 전후 사진 또는 참고 동선용 이미지를 선택할 때만 사용합니다.
- 권한 거부 시 기본 루틴, 수동 기록, 사진 업로드, 백업은 계속 사용할 수 있어야 합니다.
- 운영 모드 성공 기준은 real MediaPipe 감지뿐입니다. `?referenceGuide=1` 또는 `?faceGuideMode=reference`는 QA 전용입니다.

## 외부 제출 에셋

- 앱 로고: 600x600 PNG, 투명 배경 불가
- 썸네일: 1932x828 PNG
- 스크린샷: 세로 636x1048 PNG 최소 3장 또는 가로 1504x741 PNG 최소 1장
- 스크린샷에는 치료, 진단, 결과 보장, 얼굴 변화 단정 문구를 넣지 않습니다.
- 토스에서 제공하는 아이콘 또는 이미지 리소스를 싸괄 로고/썸네일로 사용하지 않습니다.
- 최신 Apps in Toss 제출 이미지 패킷: `output/apps-in-toss/gwalsa-apps-in-toss-submission-20260612-141845.zip`
- 이미지/콘솔 초안의 표시명은 요청에 따라 `싸괄`로 제작했습니다. 최종 콘솔 앱 이름을 `싸괄`로 확정하면 `manifest.json`, `index.html`, `granite.config.ts`, 앱 내 브랜드 문구도 같은 이름으로 맞춘 뒤 `.ait`를 다시 만들어야 합니다.

## 제출 전 차단 항목

- npm 또는 pnpm이 있는 환경에서 `npm install` 후 `npx ait init`/빌드 흐름을 공식 문서대로 실행해야 합니다.
- `npm run build:web`이 `dist/`를 생성하는지 확인해야 합니다.
- 샌드박스 앱에서 `intoss://{appName}` 또는 콘솔 QR 흐름으로 1회 이상 실기기 테스트해야 합니다.
- 최종 `.ait` 번들을 콘솔에 업로드하고 토스앱 테스트를 완료해야 출시 요청이 가능합니다.
- 제출 당일 비게임 출시 가이드와 서비스 오픈 정책을 다시 확인해야 합니다.

## 현재 완화한 리스크

- MediaPipe Tasks Vision JS/WASM 런타임을 `assets/vendor/mediapipe/tasks-vision/0.10.35/`로 vendoring했습니다.
- 앱은 서버, 계정, 결제, 광고, 분석 SDK를 추가하지 않았습니다.
- 카메라/사진 데이터는 브라우저 로컬에서 처리하며 원본 얼굴 이미지는 기록/백업에 저장하지 않습니다.
- 서비스워커 navigation fallback은 same-origin HTTP(S) 요청에만 적용됩니다.
