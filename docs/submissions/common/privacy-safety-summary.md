# Common Submission Privacy And Safety Summary

작성 기준: 2026-06-10 KST

## Build Under Review

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Service worker cache | `gwalsa-routine-v20260612a05` |
| Web release package | `gwalsa-web-pwa-20260610-100147` |
| Web zip SHA-256 | `4254c05459f5c6be3c79058c79e5688527586f4a79547d4ee397d4abf1b455c0` |
| Store asset package | `gwalsa-store-assets-20260610-100154` |
| Store assets zip SHA-256 | `0ed6019ff70baa7d6e4ed0f0f485c653d0e868c84ab3b52d1fd9649bb3a01eb4` |

## App Scope

괄사 루틴은 일반 뷰티 셀프케어 PWA입니다. 사용자가 직접 루틴을 고르고, 단계별 타이머를 따라가며, 로컬 기록과 리마인더를 관리하는 앱으로 설명합니다.

Submission copy must keep this scope. It must not describe the app as a medical, diagnostic, treatment, disease-prevention, or guaranteed-result product.

## Current Data Handling

- Backend server: none
- Account system: none
- Analytics SDK: none
- Advertising SDK: none
- Payment SDK: none
- Third-party sharing code in the static app: none found in the current implementation basis
- Primary storage: browser `localStorage`
- Stored locally: routine logs, settings, custom routines, compressed before/after photo notes, reminder preferences
- User-generated backup: JSON file created only by the user
- Light backup: excludes photos
- Full backup: may include compressed before/after photos

## Camera, Uploads, And Face Guide

- Camera or upload access is user initiated.
- Camera/upload images are used for reference route display in the browser.
- Original camera/upload images for the face guide are not stored in history or backups.
- The production face guide check uses MediaPipe real landmark detection, with `referenceOnly=false`.
- The app does not identify a person, verify identity, or create a persistent face template.
- QA-only reference paths are limited to explicit query modes such as `?referenceGuide=1` or `?faceGuideMode=reference`.

Latest relevant QA evidence:

- Source: `output/playwright/20260610-real-model-check/metrics.json`
- Result: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## User Controls

- Users can create and keep their own backup files.
- Users can choose light backup when they do not want photos included.
- Settings provide local deletion and reset options.
- Notifications are used only after the user enables reminders.
- Browser or device settings can revoke camera, photo/file, and notification permissions.

## Permission Copy Direction

Camera:

참고 가이드에서 동선을 화면 위에 표시하기 위해 사용합니다. 이미지는 기기 안에서 처리되며 원본 카메라 이미지는 기록이나 백업에 저장하지 않습니다.

Photos/files:

전후 사진 기록 또는 참고 동선용 이미지를 사용자가 직접 선택할 때만 사용합니다. 전후 사진은 브라우저 안에서 압축되어 로컬 저장됩니다.

Notifications:

사용자가 설정한 괄사 루틴 리마인더를 보내기 위해 사용합니다. 알림은 사용자가 직접 켜거나 끌 수 있습니다.

## Safety Copy Direction

- Use: general beauty self-care, routine guide, timer, local log, reminder, reference route.
- Use: results may vary, user-controlled routine, optional photo note, local-only storage.
- Do not use: medical advice, diagnosis, treatment, disease prevention, body or skin result guarantee, or confirmed outcome language.
- Face guide language must stay framed as a reference route display, not a health or skin assessment.

## Store Submission Conditions

The current repo package includes local public page drafts and metadata drafts. Before final app store submission, replace local policy/support paths with stable hosted URLs and confirm the exact behavior of the final native wrapper.

Update this privacy and safety summary if the wrapper adds any of the following:

- Remote WebView hosting
- Analytics or crash reporting
- Ads or attribution SDKs
- Cloud sync
- Remote logging
- Account creation
- Payments
- Server-side image processing
- Any data transfer outside the user's device
