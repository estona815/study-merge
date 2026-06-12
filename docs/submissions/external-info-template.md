# External Submission Information Template

작성 기준: 2026-06-10 KST

## How To Use

이 템플릿은 저장소 안에서 확인할 수 없는 외부 제출 정보를 사람이 채워 넣기 위한 양식입니다. 작성 후에도 제품 설명은 **일반 뷰티 셀프케어 PWA** 범위로 유지합니다.

## Official Program Information

| Field | Owner Input |
| --- | --- |
| Submission target name | 2026년 ICT 스마트 디바이스 전국 공모전 |
| Official website URL | https://www.ondeviceai.or.kr/ |
| Official notice URL | https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=01&groupid=00 |
| Official notice PDF | https://www.ondeviceai.or.kr/contents/downfile.php?file=1 |
| Submission form URL | https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=02&groupid=00 |
| Organizer name | 주최: 과학기술정보통신부 / 공동주관: 정보통신기획평가원, 정보통신산업진흥원, 스마트기술진흥협회 |
| Contact email or phone from official source | 운영사무국: kidia@kidia.or.kr / 02-6248-3502~3 |
| Application opens | 2026-05-26 |
| Application deadline | 2026-06-30 24:00, 접수페이지 서버시간 기준 |
| Review or demo dates | 예선 2026-07-02~2026-07-15, 본선 2026-07-22~2026-07-23, 결선/시상식 2026년 8월 이후 |
| Required file formats | 웹 폼 신청서 업로드: HWP 또는 PDF, 100MB 이하 |
| Required screenshots or video specs | 공식 접수 페이지 기준 별도 스크린샷/영상 업로드 항목 확인 안 됨. 참가신청서 서식 외 별도 제출 자료는 서류심사에 반영하지 않는다고 공고문에 기재됨. |
| Required business documents | 예선심사 이후 일반부문은 사업자등록사실여부 사실증명, 기업부문은 사업자등록증을 요구할 수 있음 |
| Required consent, pledge, or privacy forms | 참가신청서에 공모전 참가 약관, 공모전 참가 동의서, 개인정보 수집ㆍ이용ㆍ제공 동의서 포함 |

## Applicant Information

| Field | Owner Input |
| --- | --- |
| Company or applicant name | TODO: owner input |
| Representative name | TODO: owner input. 일반부문은 대표자 성명 파일명 요구, 기업부문은 기업명 파일명 요구. |
| Business registration number, if required | TODO: owner input. 사업자등록 보유 시 일반부문 참가 불가 여부 확인 필요. |
| Applicant address, if required | TODO: owner input |
| Primary contact name | TODO: owner input |
| Primary contact email | TODO: owner input |
| Primary contact phone | TODO: owner input |
| Public support email | TODO: owner input |
| Public support URL | 배포 전 TODO. 현재 저장소에는 `public/support.html` 로컬 초안만 있음. |
| Hosted privacy URL | 배포 전 TODO. 현재 저장소에는 `public/privacy-policy.html` 로컬 초안만 있음. |
| Hosted terms URL | 배포 전 TODO. 현재 저장소에는 `public/terms-disclaimer.html` 로컬 초안만 있음. |

## Product Information To Recheck

| Field | Current Draft Basis | Owner Confirmation |
| --- | --- | --- |
| Product name | 괄사 루틴 |  |
| Product type | 일반 뷰티 셀프케어 PWA |  |
| Core feature scope | 루틴 안내, 단계별 타이머, 로컬 기록, 선택형 참고 동선 표시 |  |
| Data handling | 현재 브라우저 중심 저장, 서버 계정 없음 |  |
| Camera/upload scope | 사용자가 직접 선택한 경우 참고 동선 표시용 |  |
| QA basis | `output/playwright/20260610-real-model-check/metrics.json` passed |  |
| Build basis | `20260612a06` |  |
| Official application category | TODO: owner selects 기업 또는 일반. 현재 사업자등록 보유 여부에 따라 달라짐. |  |
| Official web form item name | 괄사 루틴 |  |
| Official web form 200-character item description candidate | 브라우저 로컬에서 루틴 타이머, 기록, 백업/삭제, MediaPipe Face Landmarker 기반 참고 동선 표시를 제공하는 일반 뷰티 셀프케어 PWA입니다. |  |
| Web/PWA release zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` |  |
| Web/PWA release SHA-256 | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |  |
| Store asset zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` |  |
| Store asset SHA-256 | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |  |
| Representative screenshots | `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/screenshots/` |  |
| Demo URL candidate | TODO: deploy `output/release/gwalsa-web-pwa-20260610-100147/web/` to a stable HTTPS host. No working public URL is stored in this repository. |  |
| GitHub Pages URL candidate | 확인 필요. `git remote -v` returned no configured remote in this local checkout. |  |
| Target browser candidate | Chrome, Safari, or Edge with camera/upload support and network access to MediaPipe Tasks Vision CDN unless runtime is vendored |  |
| Target device candidate | Mobile browser, tablet browser, or desktop browser demo. Exact device must be owner-confirmed. |  |
| Target network condition | Online network recommended for current build because MediaPipe Tasks Vision JS/WASM runtime is loaded from CDN. Fully offline demo requires vendoring the runtime and rerunning QA. |  |

## Submission-Day Checks

| Check | Status |
| --- | --- |
| Official notice and form requirements rechecked on submission day | To do |
| Hosted privacy/support URLs are live and reachable | To do |
| Final submitted screenshots match the current build and allowed copy | To do |
| Final submitted text avoids medical, diagnostic, treatment, disease-prevention, and guaranteed-result claims | To do |
| Face guide text is limited to reference route display | To do |
| MediaPipe and AI-style wording is framed as technical or visual support only | To do |
| Any external demo URL or QR target has been tested on the target device/network | To do |
| If a native wrapper is used, signing, permissions, SDKs, and store console forms are complete | To do |

## Notes For Owner

- Add official URLs and deadlines only after checking the current organizer source.
- Do not infer eligibility, awards, ranking, or review criteria unless the official notice states them.
- If analytics, cloud sync, ads, payments, remote logging, or server-side image handling are added, update every privacy and QA document before submission.
