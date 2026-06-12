# ICT Smart Device Official Notice Research

작성 기준: 2026-06-10 KST

## Verification Scope

This file records official-source research for the 2026 ICT Smart Device submission packet. It is not a submission receipt. Recheck the official website on the actual submission day before uploading.

Primary official sources checked:

- Official website: https://www.ondeviceai.or.kr/
- Official overview page: https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=01&groupid=00
- Official submission form page: https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=02&groupid=00
- Official notice PDF download: https://www.ondeviceai.or.kr/contents/downfile.php?file=1
- General application form download: https://www.ondeviceai.or.kr/contents/downfile.php?file=4
- Company application form download: https://www.ondeviceai.or.kr/contents/downfile.php?file=5

Local official files saved for evidence:

- `output/submission/ict-smart-device/official-forms/2026-ondeviceai-official-notice.pdf`
- `output/submission/ict-smart-device/official-forms/application-general.docx`
- `output/submission/ict-smart-device/official-forms/application-company.docx`

## Official Program Summary

| Field | Officially Observed Information |
| --- | --- |
| Program name | 2026년 ICT 스마트 디바이스 전국 공모전 |
| Subtitle | 지능 온디바이스 혁신 아이디어 발굴 |
| Host | 과학기술정보통신부 |
| Joint organizers | 정보통신기획평가원, 정보통신산업진흥원, 스마트기술진흥협회 |
| Supporters | 한국정보통신기술협회, 3D프린팅연구조합 |
| Official contact | 스마트기술진흥협회 운영사무국, kidia@kidia.or.kr, 02-6248-3502~3 |
| Application period | 2026-05-26 to 2026-06-30 24:00 |
| Deadline basis | Submission page server time |
| Submission channel | Official website participation page |
| Submission form URL | https://www.ondeviceai.or.kr/main/main.php?categoryid=02&menuid=02&groupid=00 |

## Eligibility And Category Notes

- The official notice targets currently non-commercialized intelligent on-device ideas and technologies.
- General applicants and pre-founders participate in the general category when they do not hold business registration as of 2026-06-30.
- Applicants with business registration participate in the company category.
- The owner must confirm whether to submit as `기업` or `일반`; this repository cannot infer business-registration status.

## Schedule

| Step | Official Schedule |
| --- | --- |
| Application | 2026-05-26 to 2026-06-30 |
| Preliminary review | 2026-07-02 to 2026-07-15 |
| Main review | 2026-07-22 to 2026-07-23 |
| Final review and award ceremony | 2026년 8월 이후 |

Schedules can change, so verify them on the official site before final upload.

## Submission Requirements

Official upload page fields observed:

- Category: `기업` or `일반`
- Password and password confirmation for later receipt check
- Representative name
- Mobile number
- Email
- Item name
- Item description, within 200 characters
- Application upload
- Confirmation checkbox for competition terms, participation consent, and personal information consent
- Final confirmation radio button

Official upload file rules observed:

- Upload format: HWP or PDF
- Maximum file size: 100MB
- File name: company category uses company name; general category uses representative name
- The notice states that separately submitted materials outside the application form are not reflected in document review.

Official application form includes:

- Application page
- Idea details
- Competition participation terms
- Participation consent
- Personal information collection, use, and provision consent

## Form Behavior And Revision Risk

The official web form shows a confirmation message that saved submissions cannot be modified. The receipt-check page asks for representative name, mobile number, and password. Treat final submission as a legal/irreversible action and stop for owner approval before pressing the final save button.

## Source Conflicts To Recheck

- The official notice PDF states the application period as 2026-05-26 to 2026-06-30. The web overview page also has countdown metadata for 2026-06-30, but one rendered line in the web body displayed an outdated `2025` year. Use the official PDF and live server countdown as the primary basis, then recheck on submission day.
- The official PDF award table sums to 3,700만원. One web line appeared to state 3,500만원. Award amount is not needed for the app copy and should not be claimed unless rechecked.

## Fit For Gwalsa Routine

Submission copy should position 괄사 루틴 as a static Web/PWA concept and demo for general beauty self-care. The repository evidence supports:

- App build `20260612a06`
- Browser-local routine timer and local records
- User-selected camera/upload flow for reference route display
- MediaPipe Face Landmarker production QA with `referenceOnly=false`
- Web/PWA release zip and QA evidence

Do not state that the app is approved, selected, certified, or submitted until the official receipt page confirms it.
