# Launch Audit

## Current Purpose

괄사 루틴 is a Korean-first beauty self-care PWA for guided gua sha routines, local habit tracking, compressed photo notes, reminders, and JSON backup/restore.

## Completed Features

- Onboarding with self-care positioning
- Today screen with weekly goal, condition recommendation, safety checks, plan, timer, face map
- Routine catalog, zone guide, and custom routine builder
- Timer with pause/resume/next, completion panel, and automatic history save
- Manual history records, reactions, before/after values, notes, photo compression, comparison
- Settings for pressure, base, reminder, profile, avoid zones, photo retention, privacy/disclaimer/support, data reset
- Full/light backup, validation code, preview, merge, import, undo
- Service worker cache and installable manifest
- Local face guide reference routes using user-started camera or selected image

## Launch Blockers Addressed

- Removed user-facing development copy such as draft/Drive handoff language
- Added in-app privacy and disclaimer surface
- Added full local data reset
- Added completion panel after timer completion
- Updated cache/build identifiers
- Escaped custom routine and imported backup text before rendering
- Sanitized imported photo data URLs before image rendering
- Added bounded backup import and storage-pressure photo cleanup
- Reframed face guide as a reference route overlay rather than skin/medical analysis

## Residual Risks

- App store release still needs native wrapper, signing, hosted privacy/terms/support URLs, final support contact, and screenshots.
- Browser notification behavior varies by platform.
- Local storage can be cleared by browser settings or storage pressure.
- Legal copy is a draft and should be reviewed before publication.
- App store release policy requirements can change; verify the latest Apple/Google official documentation before submission.

## Launch Evidence (2026-06-07)

- Automated checks: `./scripts/launch-precheck.sh` + `./scripts/launch-readiness-audit.sh` passed.
- Launch screenshots saved under `output/playwright/20260608-launch-demo/`:
  - `screen-onboarding-390.png`, `screen-onboarding-430.png`
  - `screen-today-390.png`, `screen-today-430.png`, `desktop/screen-today-1280.png`
  - `screen-routines-390.png`, `screen-routines-430.png`, `desktop/screen-routines-1280.png`
  - `screen-log-390.png`, `screen-log-430.png`, `desktop/screen-log-1280.png`
  - `screen-settings-390.png`, `screen-settings-430.png`, `desktop/screen-settings-1280.png`
  - `screen-face-guide-390.png`, `screen-face-scan-390.png`, `screen-face-routine-390.png`, `desktop/screen-face-routine-1280.png`
  - `completion-390.png`, `completion-430.png`

추가 참조 증적:
- `output/playwright/20260608-launch-demo/screen-offline-reload-390.png` (오프라인 리로드 체크)
- `output/playwright/20260608-launch-demo` 전체 증적 폴더
- `docs/launch-release-evidence-20260607.md` (자동 게이트 통과 로그)
- `docs/launch-qa-20260607.md` (수동 QA 증적 템플릿 및 미실행 항목 정리)
- `output/playwright/20260608-functional-smoke/functional-smoke-report.json` (수동 기록, 백업, 참고 가이드 완료 기능 smoke)
- `output/store-assets/latest-store-assets.json` (스토어/검수 전달용 에셋 패키지)

### Audit Script Tightening (2026-06-07)
- `scripts/launch-readiness-audit.sh` now also requires one desktop-width (`1280` 또는 `desktop/`) artifact for launch evidence in the mandatory set.
- Evidence scan now records desktop coverage with `has_desktop` in addition to 390/430 coverage.
- `scripts/launch-readiness-audit.sh` now requires launch-qa evidence file (`docs/launch-qa-YYYYMMDD.md`) to be present.
- `scripts/run-functional-smoke.sh` now verifies manual log persistence, light backup generation, backup preview/merge/undo, and face guide upload completion persistence.
- `scripts/package-store-assets.sh` and `scripts/verify-store-assets.sh` now package and verify curated screenshots, icons, metadata, and policy/QA evidence for review handoff.

## Security And Privacy Notes

- No backend, accounts, analytics, payment SDKs, or third-party data transfer were found.
- Camera is invoked only when the user starts the face guide camera; photos use user-selected file input.
- Face guide camera/upload images are processed locally for reference routes and are not persisted as original face images.
- Backups are user-managed JSON and may include compressed photos when full mode is used.
