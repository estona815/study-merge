# ICT Smart Device Privacy And Safety Summary

작성 기준: 2026-06-10 KST

## Build Under Review

| 항목 | 값 |
| --- | --- |
| App build | `20260612a06` |
| Service worker cache | `gwalsa-routine-v20260612a06` |
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
- Stored locally: routine logs, settings, custom routines, compressed photo notes, reminder preferences
- User-generated backup: JSON file created only by the user
- Light backup: excludes photos
- Full backup: may include compressed photo notes

## Camera, Upload, And MediaPipe Face Guide

- Camera or upload access is user initiated.
- Camera/upload images are used for reference route display in the browser.
- Original camera/upload images for the face guide are not stored in history or backups.
- The production face guide check uses MediaPipe real landmark detection, with `referenceOnly=false`.
- The app does not identify a person, verify identity, or create a persistent face template.
- MediaPipe is described only as a technical dependency for reference route display.
- QA-only reference paths are limited to explicit query modes such as `?referenceGuide=1` or `?faceGuideMode=reference`.
- mock/reference evidence is QA-only and is not a production success basis.

Latest relevant QA evidence:

- Source: `output/playwright/20260610-real-model-check/metrics.json`
- Result: `passed`
- Provider: `mediapipe`
- Detector source: `real`
- Source: `upload-landmark`
- Reference-only mode: `false`
- Contains mock marker: `false`
- Packaged evidence SHA-256: `6da698be05a50b93c6078988a8e7357ed59fa8fecb7e462cb01f4598f173d58a`

## User Controls

- Users can create their own backup files.
- Users can choose light backup when they do not want photos included.
- Settings provide local deletion and reset options.
- Notifications are used only after the user enables reminders.
- Browser or device settings can revoke camera, file, and notification permissions.
- If camera access is blocked, routine timer and local record flows should remain usable.

## ICT Submission Notes

- Use browser-local or on-device wording only for the current implementation basis.
- Keep the face guide framed as a reference route display.
- Do not imply that the app evaluates appearance, skin, health, or user condition.
- Do not add external tracking, analytics, cloud sync, remote image handling, or device telemetry to a demo without updating this summary.
- If a native wrapper is added, update permissions, SDK inventory, hosted policy URLs, and QA evidence.

## External Items Still Required

- Official ICT submission notice and form requirements
- Applicant/company identity, representative, and contact fields
- Public demo URL, local device demo plan, or QR target, if required
- Hosted privacy/support URLs for public distribution
- Final device and browser compatibility check
- Native wrapper, signing, and store console forms if this package is reused for app store submission
