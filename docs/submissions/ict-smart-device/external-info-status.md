# ICT Smart Device External Information Status

작성 기준: 2026-06-10 KST

## Auto-Filled From Official Sources

| Field | Status |
| --- | --- |
| Submission target | 2026년 ICT 스마트 디바이스 전국 공모전 |
| Official site | https://www.ondeviceai.or.kr/ |
| Official overview | https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=01&groupid=00 |
| Submission form | https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=02&groupid=00 |
| Official notice PDF | https://www.ondeviceai.or.kr/contents/downfile.php?file=1 |
| General form DOCX | https://www.ondeviceai.or.kr/contents/downfile.php?file=4 |
| Company form DOCX | https://www.ondeviceai.or.kr/contents/downfile.php?file=5 |
| Host and organizers | 과학기술정보통신부 / 정보통신기획평가원, 정보통신산업진흥원, 스마트기술진흥협회 |
| Contact | kidia@kidia.or.kr / 02-6248-3502~3 |
| Deadline | 2026-06-30 24:00, server-time basis |
| Upload format | HWP or PDF, 100MB 이하 |

## Auto-Filled From Repository

| Field | Value |
| --- | --- |
| Product name | 괄사 루틴 |
| Product type | 일반 뷰티 셀프케어 PWA |
| Build | `20260612a06` |
| Service worker cache | `gwalsa-routine-v20260612a06` |
| Technology stack | HTML, CSS, vanilla JavaScript, localStorage, service worker, Web App Manifest, MediaPipe Face Landmarker |
| Web release zip | `output/release/gwalsa-web-pwa-20260610-100147.zip` |
| Web release SHA-256 | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store asset zip | `output/store-assets/gwalsa-store-assets-20260610-100154.zip` |
| Store asset SHA-256 | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |
| Latest QA evidence | `output/playwright/20260610-real-model-check/metrics.json` |
| Latest QA status | `passed` |
| Representative screenshots | `output/store-assets/gwalsa-store-assets-20260610-100154/store-assets/screenshots/` |
| Local policy pages | `public/privacy-policy.html`, `public/terms-disclaimer.html`, `public/support.html` |

## Owner Inputs Still Required

| Required Input | Why It Cannot Be Inferred |
| --- | --- |
| Applicant category: 기업 or 일반 | Depends on business-registration status |
| Applicant/team/company name | Personal or legal identity |
| Representative name | Personal identity and official form signature |
| Business registration number, if company category | Legal/business information |
| Address, if required in the final form | Personal or company information |
| Primary contact phone | Personal contact information |
| Primary contact email | Personal contact information |
| Submission password | Used for official receipt check |
| Signature or seal | Legal confirmation |
| Agreement to competition terms and personal information consent | Owner must review and agree |
| Hosted demo URL | No working public demo URL is stored in this repository |
| Hosted privacy/support URLs | Current files are local drafts only |
| Final HWP or PDF application form | Official form requires owner identity and signature |

## Demo And Hosting Status

- No Git remote is configured in this local checkout, so GitHub Pages URL cannot be inferred.
- `manifest.json` uses `start_url: ./index.html`; this is a package-relative PWA path, not a public URL.
- The release README says to upload `output/release/gwalsa-web-pwa-20260610-100147/web/` to a static hosting root.
- Current MediaPipe Tasks Vision runtime is loaded from CDN, so the demo environment needs network access unless that runtime is vendored and QA is rerun.

## Submission Upload Status

Official page expects one completed application file in HWP or PDF. The repository can support the application narrative and evidence, but it does not yet contain a completed owner-signed official application file.

Do not upload the web release zip or store asset zip as the official application file unless the organizer explicitly requests a separate artifact. The notice says materials outside the official application form are not reflected in document review.
