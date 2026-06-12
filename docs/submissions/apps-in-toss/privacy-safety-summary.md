# Apps In Toss Privacy And Safety Summary

작성 기준: 2026-06-12 KST

## Build Under Review

| 항목 | 값 |
| --- | --- |
| Current app build | `20260612a06` |
| Current service worker cache | `gwalsa-routine-v20260612a06` |
| Current web release package | Regenerate after final verification |
| Current web zip SHA-256 | Regenerate after final verification |
| Current store asset package | Regenerate after final verification |
| Current store assets zip SHA-256 | Regenerate after final verification |

## Current PWA Data Handling

- Backend server: none
- Account system: none
- Analytics SDK: none
- Advertising SDK: none
- Payment SDK: none
- Primary storage: browser `localStorage`
- Stored locally: routine logs, settings, custom routines, compressed photo notes, reminder preferences
- User-created backup: JSON file created only by the user
- Camera/upload images for the face guide: user initiated
- Original camera/upload images for the face guide: not stored in history or backups
- MediaPipe Tasks Vision runtime: vendored locally in `assets/vendor/mediapipe/tasks-vision/0.10.35/`

## Apps In Toss Porting Assumption

For the first miniapp review, keep the same local-first posture where possible:

- No Toss login unless needed for the chosen feature scope
- No payment SDK for the first review unless monetization is intentionally added
- No advertising SDK unless the monetization plan requires it
- No server storage unless a later feature needs it
- No remote image handling

If the miniapp adds Toss login, in-app purchase, ads, push, promotion, server APIs, remote logging, or cloud sync, this summary must be updated from the final implementation.

## Camera, Upload, And Face Guide

- The face guide remains optional.
- Camera/upload access must be user initiated.
- If permission is denied, the 3분 루틴 timer must remain usable.
- MediaPipe may be mentioned only as a technical dependency for reference route display.
- The miniapp copy should describe the face guide only as reference route display.
- Production success evidence must use a normal URL without `?referenceGuide=1` or `?faceGuideMode=reference`.

## User Controls

- Users should be able to delete local records.
- Users should be able to reset local app data.
- Privacy and support links must be reachable from the miniapp.
- If paid features are added, purchase history, restore, cancellation, and support paths must be documented according to the final Apps in Toss flow.

## Required Updates Before Apps In Toss Submission

| Trigger | Required Update |
| --- | --- |
| Toss login added | Data map, terms URL, disconnect behavior, QA |
| IAP or subscription added | Product list, restore flow, payment QA, support copy |
| Ads added | SDK/data map, display timing QA, reward QA |
| Server API added | Data transfer map, mTLS/server setup, hosted policy |
| Push or promotion added | Consent flow, message content, opt-out path |
| Remote image handling added | Privacy summary, user notice, QA, support copy |

## External Items Still Required

- Apps in Toss workspace and app registration
- Final `appName`
- Hosted privacy/support URL
- Hosted terms URL
- Apps in Toss logo, thumbnail, and screenshot assets
- Customer support email
- Final SDK/API inventory
- Miniapp sandbox QA
- Apps in Toss review forms
- Native wrapper, signing, and store console forms if reused for app store submission
