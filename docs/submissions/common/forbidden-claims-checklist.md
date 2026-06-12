# Common Submission Forbidden Claims Checklist

작성 기준: 2026-06-10 KST

## Build And Artifact Basis

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
| Web zip SHA-256 | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store assets zip SHA-256 | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |
| Latest QA result | `output/playwright/20260610-real-model-check/metrics.json` passed |

## Approved Positioning

Use this framing across store metadata, screenshots, review notes, permission prompts, and support text:

- General beauty self-care PWA
- Routine guide and timer
- Local routine log and optional photo note
- User-controlled reminders
- Browser-based reference route display
- Local-first data handling

## Forbidden Claim Review

| Check | Status |
| --- | --- |
| Store copy does not present the app as a medical product. | To verify before submission |
| Store copy does not say or imply diagnosis. | To verify before submission |
| Store copy does not say or imply treatment, cure, recovery, or disease prevention. | To verify before submission |
| Store copy does not guarantee body, face, or skin results. | To verify before submission |
| Screenshot captions do not claim proven before/after change. | To verify before submission |
| Face guide copy is limited to reference route display. | To verify before submission |
| MediaPipe or AI-style visuals are not described as a confirmed assessment. | To verify before submission |
| Timer, log, backup, and reminder features are described as user tools, not outcome promises. | To verify before submission |
| Permission prompts explain functional use only. | To verify before submission |
| Review notes keep the app in the general beauty self-care category. | To verify before submission |

## Copy Boundaries

Allowed wording direction:

- "뷰티 셀프케어 루틴을 기록하고 따라가기 위한 PWA"
- "단계별 타이머와 로컬 기록"
- "사용자가 선택한 사진 메모"
- "참고 동선을 화면에 표시"
- "데이터는 현재 브라우저에 저장"
- "알림은 사용자가 켠 경우에만 사용"

Do not use wording that creates any of these impressions:

- The app gives medical advice.
- The app detects or diagnoses a condition.
- The app treats, cures, prevents, or manages a disease.
- The app guarantees a visible result.
- The app proves a before/after change.
- The face guide identifies a person or produces a health assessment.
- The reference simulation predicts a future result.

## Submission Review Steps

Before any final store upload, review these surfaces:

- App title, subtitle, short description, long description
- Screenshot captions and overlay text
- App preview or promotional text
- Review notes
- Privacy policy and support pages
- Permission prompts
- Native wrapper strings
- Google Play declarations and App Store privacy answers
- Any paid ads, landing pages, or press copy using the same assets

## Current Evidence Linkage

- Latest web release pointer: `output/release/latest-web-release.json`
- Latest store asset pointer: `output/store-assets/latest-store-assets.json`
- Production model QA evidence: `output/playwright/20260610-real-model-check/metrics.json`
- Store privacy answer draft: `docs/store-privacy-answers.md`
- Existing store submission packet: `docs/store-submission-packet.md`
