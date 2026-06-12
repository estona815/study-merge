# External Store Inputs

이 문서는 Apps in Toss 제출 직전에 소유자가 확정해야 하는 외부 입력 원장입니다. 현재 웹/PWA 빌드 자체는 로컬 정적 앱으로 검증하지만, 아래 항목은 저장소 안에서 임의로 완성할 수 없습니다. App Store / Google Play 제출 항목은 별도 네이티브 래핑을 할 때만 다시 사용합니다.

## Submission Status

- Web/PWA release package: conditional go after `./scripts/final-launch-gate.sh`
- Apps in Toss submission: external-blocked until every console field, asset, sandbox test, and final `.ait` upload is confirmed
- Latest Apps in Toss non-game guide and service open policy: official documentation must be checked again immediately before submission

## Apps in Toss Console

| Field | Required Value | Current Draft | Owner Confirmation |
|---|---|---|---|
| appName | Console-confirmed unique key | `sagwal` in `granite.config.ts` | |
| Display name | Korean app name | `싸괄` | |
| Brand color | Console-visible brand color | `#2F7D72` | |
| Icon URL | URL copied from console-uploaded icon | Empty in `granite.config.ts` | |
| Category | Non-game category matching the service | Beauty/wellness-like self-care, final console choice needed | |
| Sandbox test | At least one sandbox/Toss app run | Not run in this repo | |
| Final bundle | Official `.ait` bundle uploaded | Existing `gwalsa-routine.ait` is old; regenerate after final build | |

## Public URLs

| Field | Required Value | Current Local Draft | Owner Confirmation |
|---|---|---|---|
| Privacy policy URL | Stable public HTTPS URL, non-PDF | `public/privacy-policy.html` | |
| Terms/disclaimer URL | Stable public HTTPS URL | `public/terms-disclaimer.html` | |
| Support URL | Stable public HTTPS URL | `public/support.html` | |
| User privacy choices/deletion URL | Stable public HTTPS URL if requested by store form | `public/support.html` | |

## Identity And Contact

| Field | Required Value | Owner Confirmation |
|---|---|---|
| Public developer/seller name | Store-visible legal or developer name | |
| Support contact | Email, form, or support page that users can reach | |
| Privacy contact | Email or inquiry channel for privacy requests | |
| Copyright/rights holder | Name to show in store metadata if required | |

## Apps in Toss Assets

| Field | Required Value | Current Local Draft | Owner Confirmation |
|---|---|---|---|
| App logo | 600x600 PNG, no transparent background | Existing PWA icons are not final console logo assets | |
| Thumbnail | 1932x828 PNG | Needs production asset | |
| Vertical screenshots | 636x1048 PNG, at least 3 if vertical set is used | Needs crop/export from latest screenshots | |
| Horizontal screenshots | 1504x741 PNG, at least 1 if horizontal set is used | Needs crop/export from latest screenshots | |

## Native Wrapper

| Field | Required Value | Owner Confirmation |
|---|---|---|
| iOS bundle identifier | Reverse-DNS bundle id | |
| Android package name | Reverse-DNS package name | |
| App version | Store-facing version | |
| Build number/version code | Incrementing build value | |
| Signing identity/keystore | Configured and backed up securely | |
| Release track | Production, staged rollout, TestFlight, internal, or closed test | |
| Hosted web vs bundled static files | Must match privacy answers and offline promises | |

## Wrapper SDK Audit

If any wrapper, plugin, analytics, crash, push, ads, billing, cloud sync, logging, remote config, or WebView bridge SDK is added, redo `docs/store-privacy-answers.md` before submission.

| SDK/Service | Purpose | Sends Data Off Device? | Privacy/Data Safety Updated? |
|---|---|---|---|
| | | | |

## Permission Strings

Use the Korean drafts in `docs/store-privacy-answers.md` as starting copy, then confirm the exact native manifest fields during wrapper implementation.

| Permission | Needed Only If | Owner Confirmation |
|---|---|---|
| Camera | Native wrapper exposes face guide camera | |
| Photos / Photo Picker | Native wrapper exposes user-selected before/after photos or face guide upload | |
| Notifications | Native wrapper supports routine reminders | |

## Store Metadata

| Field | Source/Draft | Owner Confirmation |
|---|---|---|
| App name | `싸괄` | |
| Subtitle/short description | `STORE_LISTING_DRAFT.md` | |
| Full description | `STORE_LISTING_DRAFT.md` | |
| Keywords/tags/category | `STORE_LISTING_DRAFT.md`, final store console | |
| Screenshots | `output/playwright/20260608-launch-demo/` plus store-specific crops if needed | |
| App icon | `assets/icon-512.png`, `assets/icon-192.png`, `assets/apple-touch-icon.png` | |

## Final Submission Rule

Do not answer store privacy, data safety, permission, or tracking questions from the web/PWA repository alone after native wrapping begins. Answer from the final signed binary and every bundled SDK.
