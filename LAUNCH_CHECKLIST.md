# Launch Checklist

## Build Status

- App build: `20260612a05`
- Service worker cache: `gwalsa-routine-v20260612a05`
- Dependency install: not required for static local QA; npm or pnpm is required only to run the Apps in Toss `@apps-in-toss/web-framework` workflow
- Required smoke checks: `./scripts/launch-precheck.sh`, `./scripts/verify-web-release.sh`, local HTTP QA on target devices
- Functional smoke checks: `./scripts/run-functional-smoke.sh`
- Production face model check: `./scripts/run-real-face-model-check.sh`
- Store asset checks: `./scripts/package-store-assets.sh`, `./scripts/verify-store-assets.sh`

## Core Feature Status

- Onboarding: ready, includes non-medical self-care positioning
- Home: ready, includes today routine, weekly goal, safety check, condition guide, timer
- Routine guide: ready, includes zone guide, steps, pressure cues, custom routines
- Timer: ready, includes start, pause, next step, reset, completion panel, saved history
- History: ready, includes reaction, before/after feeling values, notes, compressed photos
- Reference guide: ready as local route overlay; production success requires real MediaPipe Face Landmarker output, while mock/reference mode is limited to QA query URLs
- Settings: ready, includes profile, reminders, storage policy, backup, privacy/disclaimer/support summary, data reset
- Backup: ready, supports full and photo-light JSON, validation code, preview, bounded import, merge, import, undo

## Privacy And Safety

- No backend, account system, analytics SDK, payment SDK, or third-party data sharing in code
- Apps in Toss config draft exists at `granite.config.ts` with camera/photos permissions only
- Photos and logs are stored locally in the current browser
- Camera access is requested only when the user starts the face guide camera; photo access uses user-selected file inputs
- Face guide camera/upload images are processed locally for reference route display and are not persisted as original face images
- MediaPipe Tasks Vision JS/WASM runtime is vendored under `assets/vendor/mediapipe/tasks-vision/0.10.35/`
- `?referenceGuide=1` and `?faceGuideMode=reference` are QA-only. Normal launch URLs must not use mock/reference geometry.
- Browser notification permission is requested only when the user enables reminders
- Medical/diagnosis/treatment claims were removed from app copy

## Store Listing

- Draft listing: `STORE_LISTING_DRAFT.md`
- Privacy draft: `PRIVACY_POLICY_DRAFT.md`
- Terms/disclaimer draft: `TERMS_DISCLAIMER.md`
- Submission packet: `docs/store-submission-packet.md`
- Store privacy answers: `docs/store-privacy-answers.md`
- External store inputs: `docs/external-store-inputs.md`
- Required screenshots: onboarding, today, routine timer, completion panel, history, settings/privacy
- Required icon assets: `assets/icon-192.png`, `assets/icon-512.png`, `assets/apple-touch-icon.png`

## Remaining Manual Tasks

- Run full manual QA on target mobile browsers
- Run `./scripts/run-real-face-model-check.sh` and confirm provider `mediapipe`, detectorSource `real`, source `upload-landmark`, and `referenceOnly=false`
- Produce final store screenshots
  - Regenerate with `./scripts/generate-launch-screenshots.sh`
  - Package review assets with `./scripts/package-store-assets.sh`
  - Verify packaged review assets with `./scripts/verify-store-assets.sh`
  - Launch evidence now includes completion panel screenshots and launch-demo pack:
    - `output/playwright/20260608-launch-demo/completion-390.png`
    - `output/playwright/20260608-launch-demo/completion-430.png`
    - `output/playwright/20260608-launch-demo/screen-onboarding-390.png`
    - `output/playwright/20260608-launch-demo/screen-onboarding-430.png`
    - `output/playwright/20260608-launch-demo/screen-today-390.png`
    - `output/playwright/20260608-launch-demo/screen-routines-390.png`
    - `output/playwright/20260608-launch-demo/screen-log-390.png`
    - `output/playwright/20260608-launch-demo/screen-settings-390.png`
    - `output/playwright/20260608-launch-demo/screen-face-guide-390.png`
    - `output/playwright/20260608-launch-demo/desktop/screen-today-1280.png`
- Produce a static web release package
  - Run `./scripts/package-web-release.sh` or the full `./scripts/final-launch-gate.sh`
  - Run `./scripts/verify-web-release.sh` before uploading the package; it rechecks the extracted `web/` root plus packaged smoke evidence
  - Upload the zip's `web/` folder contents to the static hosting root
  - Keep `release/release-manifest.json`, `release/SHA256SUMS`, `release/evidence/`, and the `.sha256` file as release evidence
- Confirm final app name and icon treatment
  - Verified by manifest and required references in code (`manifest.json`, `index.html`)
- Confirm app settings links resolve to stable public URLs
  - Current wiring: `/public/privacy-policy.html`, `/public/terms-disclaimer.html`, `/public/support.html` (HTTP smoke/launch check passed)
- If wrapping for app stores, configure bundle id, signing, privacy nutrition labels/data safety answers, camera/photo/notification permission text, and review the latest Apple/Google official submission policy docs
- Host final privacy policy, terms, and support pages at stable public URLs before submission
- Complete `TOSS_INAPP_RELEASE_TODO.md`, run Apps in Toss sandbox QA, and upload the final `.ait` bundle from an environment with the official tooling available
- Fill `docs/external-store-inputs.md` from the final signed wrapper before store submission
- Complete Google Play Health apps declaration and keep metadata/screenshot captions free of medical or guaranteed-outcome claims
