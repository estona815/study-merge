# Seoul Beauty Week Privacy And Safety Summary

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

## Local-First Position

괄사 루틴은 일반 뷰티 셀프케어 PWA입니다. 현재 구현 기준의 데이터 처리 방향은 서버 계정 없이 현재 브라우저 안에서 저장 및 관리하는 것입니다.

Current implementation basis:

- Backend server: none
- Account system: none
- Analytics SDK: none
- Advertising SDK: none
- Payment SDK: none
- Primary storage: browser `localStorage`
- Stored locally: routine logs, settings, custom routines, compressed photo notes, reminder preferences
- User-created backup: JSON file created only by the user
- Light backup: excludes photos
- Full backup: may include compressed photo notes

## Camera, Upload, And Face Guide

- Camera or upload access is user initiated.
- Camera/upload images are used to display reference routes in the browser.
- Original camera/upload images for the face guide are not stored in history or backups.
- The app does not identify a person or create a persistent face template.
- MediaPipe is described only as a technical dependency for reference route display.
- QA-only reference modes are limited to explicit query modes such as `?referenceGuide=1` or `?faceGuideMode=reference`.

Latest relevant QA evidence:

- Source: `output/playwright/20260610-real-model-check/metrics.json`
- Result: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## User Controls

- Users can create their own backup files.
- Users can choose light backup when they do not want photos included.
- Settings provide local deletion and reset options.
- Notifications are used only after the user enables reminders.
- Browser or device settings can revoke camera, file, and notification permissions.

## Seoul Beauty Week Submission Notes

- Use local-first privacy language in product materials and booth scripts.
- Keep the face guide framed as a reference route display.
- Do not imply that the app evaluates appearance changes.
- Do not add external tracking, lead forms, analytics, cloud sync, or remote image handling to an event demo without updating this summary.

## External Items Still Required

- Public demo URL or booth QR target, if requested by the organizer
- Hosted privacy/support URLs for public distribution
- Company identity, representative, contact, and event application fields
- Final organizer form answers and any required consent or pledge forms
- Native wrapper, signing, and store console forms if this package is reused for app store submission
