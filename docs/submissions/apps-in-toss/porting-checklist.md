# Apps In Toss Porting Checklist

작성 기준: 2026-06-12 KST

## Current PWA Basis

| 항목 | 값 |
| --- | --- |
| App build | `20260612a05` |
| Web release package | Regenerate with `./scripts/package-web-release.sh` |
| Static asset size | Recheck after release packaging; current `assets/` includes vendored MediaPipe runtime |
| Current stack | HTML, CSS, vanilla JavaScript |
| Current storage | Browser `localStorage` |
| Current backend | none |
| Current analytics/ads/payment SDK | none |

## Official Guide Items To Recheck

- Create or adapt the project with Apps in Toss tooling. This repo now includes `package.json`, `granite.config.ts`, and `scripts/build-static-dist.js` as a minimal WebView draft.
- Use a non-game release path unless the final concept changes.
- Keep the app client-side or statically generated.
- Do not use external-code execution patterns such as `eval`.
- Do not rely on SSR.
- Keep the miniapp in light mode.
- Use the Apps in Toss navigation expectations.
- Verify bundle size against the current Apps in Toss policy.
- Test at least once before requesting review.
- Request review with only one intended bundle version.

## Initial Static Scan

Checked on 2026-06-10:

- `rg` found no `eval` usage in `app.js`, `index.html`, `service-worker.js`, or `manifest.json`.
- `rg` found no `new Function` usage in the same files.
- `rg` found no `window.location.replace` usage in the same files.
- Final unzipped web/miniapp bundle size must be checked after the official `.ait` build.

## Product Flow Changes

| Area | Required Porting Work |
| --- | --- |
| First screen | Prioritize a 3분 루틴 entry instead of a broad PWA home flow |
| Onboarding | Keep brief; avoid forced modal flows on miniapp entry |
| Navigation | Use Apps in Toss navigation behavior and verify back/close actions |
| Timer | Keep all steps responsive under miniapp WebView conditions |
| Records | Verify persistence after closing and reopening the miniapp |
| Settings | Keep privacy/support/reset controls reachable |
| External links | Open only necessary hosted privacy/support pages |

## Technical Porting Items

| Item | Checklist |
| --- | --- |
| App shell | Keep static app as the WebView root and verify `npm run build:web` output in `dist/` |
| Assets | Include only assets needed for first miniapp scope |
| Service worker | Verify whether service worker behavior is supported or should be disabled in miniapp build |
| Manifest | Do not depend on PWA install prompts inside Toss |
| Local storage | Test persistence across close/reopen and app updates |
| Camera/upload | Keep user initiated; provide a working fallback if permission is denied |
| Notifications | Reassess; browser notification behavior may not map to Toss miniapp runtime |
| MediaPipe runtime | Use vendored runtime under `assets/vendor/mediapipe/tasks-vision/0.10.35/`; recheck loading time and final bundle size |
| CORS | Configure final service origins if any server/API is added |
| Performance | Check cold load, timer responsiveness, memory, and asset loading on target devices |

## Apps In Toss API And SDK Boundary

Current PWA does not use Toss login, Toss Pay, in-app purchase, functional push, promotion, or Apps in Toss APIs.

If any of these are added:

- Define the exact SDK and API surface.
- Add partner server requirements where needed.
- Configure mTLS where required by Apps in Toss API docs.
- Update privacy and QA documents.
- Retest data persistence, failure states, and review flows.

## Pre-Review QA

| Check | Status |
| --- | --- |
| Miniapp opens in sandbox | To do |
| 3분 루틴 completes | To do |
| Back button behavior is clear | To do |
| Close behavior is clear | To do |
| Local record persists after reopen | To do |
| Delete/reset controls work | To do |
| Camera/upload denial does not block timer | To do |
| Privacy/support links open correctly | To do |
| No unexpected external navigation | To do |
| Bundle size passes current Apps in Toss policy | To do |
| Console review fields match final bundle | To do |
| `TOSS_INAPP_RELEASE_TODO.md` complete | To do |

## App Store Carryover Boundary

Apps in Toss submission does not complete App Store or Google Play submission. If this project is also wrapped for native stores, hosted privacy/support URLs, native wrapper, signing, and store console forms remain separate external items.
