# Final Plugin-Based Production Review

Date: 2026-06-10
Build: `20260612a06`
Service worker cache: `gwalsa-routine-v20260612a06`
Verdict: **Web/PWA ship candidate; store submission remains external-blocked**

## Executive Summary

The app is now a working local-first beauty routine PWA with real face landmark detection wired through MediaPipe Face Landmarker, AI-style reference simulation visuals, clearer safety copy, stronger onboarding accessibility, and verified launch scripts.

The implementation no longer treats mock geometry as a normal production success path. Reference/mock detection is available only through explicit QA query paths (`?referenceGuide=1` or `?faceGuideMode=reference`). Normal user flows use the real landmark model and block weak/non-face images with honest messages.

## Plugin Lens

### Product Design

- Flow: Today -> face scan -> routine -> guide remains usable on mobile and desktop.
- Face upload UX: detection runs on the original selected image instead of the compressed history-photo version, preserving detail for real landmarks.
- Accessibility: onboarding now traps focus, supports Escape, marks background inert, restores focus after close, and locks background scroll.
- Touch ergonomics: routine guide action buttons are 44px tall.
- Layout: mobile and desktop face-routine screens no longer have bottom navigation overlapping AI simulation media.
- Evidence: `output/playwright/20260610-implementation-check/`.
- Final gate evidence: `output/playwright/20260608-launch-demo/metrics.json`.

### Creative Production

- Visual direction: the AI reference image now reads as a productized beauty-care simulation rather than a plain overlay.
- Added visual language: AI scan bands, landmark mesh, softly framed future cards, and persistent `AI 참고 · 보장 불가` cues.
- Copy safety: future/improvement visuals are framed as reference scenarios with uncertainty, not promised physical results.
- Brand consistency: kept the existing calm local-care palette and restrained rounded card language instead of switching into a flashy ad aesthetic.

### OpenAI Developers

- No OpenAI API key is required for this release.
- OpenAI Platform connector was not used to create a key because the current app intentionally performs local browser processing and does not need server-side OpenAI calls.
- Future OpenAI extension candidates:
  - Optional routine explanation assistant.
  - Optional user-written note summarizer.
  - Optional creative export copy generator.
- Guardrail for future OpenAI work: never send camera/upload images to an API unless the product copy, consent flow, privacy policy, and storage policy are explicitly updated.

### GitHub

- GitHub connector is installed for account `estona815`.
- Local repo has no configured remote, so no PR or GitHub issue was created from this run.
- Ready-to-use PR title:
  - `Finalize real face landmark guide and AI reference simulation`
- Ready-to-use PR body:

```md
## Summary

- Add MediaPipe Face Landmarker model and real-detection-first face guide flow.
- Prevent mock/reference geometry from succeeding in normal production use.
- Add production-mode MediaPipe smoke proving `provider=mediapipe`, `detectorSource=real`, `source=upload-landmark`, `referenceOnly=false`, and `478` raw landmarks.
- Add AI-style reference simulation overlays with clear no-guarantee copy.
- Improve onboarding accessibility with focus trap, inert background, Escape close, and focus restore.
- Fix mobile touch targets and face routine bottom navigation overlap.
- Harden launch scripts so bundled Node is used when `node` is not in PATH.

## Verification

- `./scripts/launch-precheck.sh`
- `./scripts/run-functional-smoke.sh`
- `./scripts/run-real-face-model-check.sh`
- `./scripts/generate-launch-screenshots.sh`
- `./scripts/launch-readiness-audit.sh`
- `./scripts/package-web-release.sh`
- `./scripts/verify-web-release.sh`
- `./scripts/package-store-assets.sh`
- `./scripts/verify-store-assets.sh`
- `./scripts/final-launch-gate.sh`
- Visual evidence: `output/playwright/20260610-implementation-check/`
- Latest release pointers: `output/release/latest-web-release.json`, `output/store-assets/latest-store-assets.json`

## Known Caveat

MediaPipe Tasks Vision runtime/WASM is loaded on demand from CDN version `0.10.35`; the face model itself is local. For fully offline face scanning, vendor the Tasks Vision runtime/WASM locally.
```

### Linear

No callable Linear tool was exposed in this session, so issues were not created directly. Suggested backlog:

1. `GWA-1 Vendor MediaPipe Tasks Vision runtime/WASM locally`
   - Priority: Medium
   - Why: removes the last external runtime dependency for fully offline face scanning.
   - Acceptance: `vision_bundle.mjs` and required `wasm/` files are served from app assets and cached by the service worker.

2. `GWA-2 Add real-photo landmark QA set`
   - Priority: Medium
   - Why: current production smoke uses an official MediaPipe sample image cropped into a consent-safe QA fixture; a broader local fixture set would improve regression coverage.
   - Acceptance: at least 3 local non-identifying fixtures cover bright front face, too-dark, and no-face.

3. `GWA-3 Add consent-safe production landmark fixtures`
   - Priority: Medium
   - Why: automated release smoke uses the explicit reference QA path; production detection should also be regression-tested against non-identifying real-photo fixtures.
   - Acceptance: fixtures cover bright front face, too-dark, and no-face; real mode passes/blocks each case without using mock fallback.

## Implementation Notes

- Real model path: `assets/models/face-landmarker/face-landmarker.task`
- Model SHA-256: `64184e229b263107bc2b804c6625db1341ff2bb731874b0bcc2fe6544e0bc9ff`
- Runtime: `@mediapipe/tasks-vision@0.10.35`, loaded on demand.
- Face Landmarker mode: `runningMode: "IMAGE"` with official `detect()` call; CPU delegate defaults for stable image detection.
- Production model check: `./scripts/run-real-face-model-check.sh`
- QA-only reference modes: `?referenceGuide=1`, `?faceGuideMode=reference`

## Verification Results

| Check | Result |
| --- | --- |
| Static syntax checks | Passed |
| Launch precheck | Passed |
| Functional smoke | Passed |
| Launch readiness audit | Passed |
| Final launch gate | Passed |
| Screenshot gate | Passed, 28 files |
| Web release package + verify | Passed |
| Store asset package + verify | Passed |
| Real model production upload check | Passed: MediaPipe, 478 landmarks, referenceOnly=false |
| SVG/non-face real-model check | Correctly blocked |
| Mobile/desktop overflow check | Passed |
| Bottom nav overlap check | Passed |

## Release Artifacts

- Latest web release pointer: `output/release/latest-web-release.json`
- Latest store asset pointer: `output/store-assets/latest-store-assets.json`
- Launch evidence: `docs/launch-release-evidence-20260607.md`
- QA evidence: `docs/launch-qa-20260607.md`

## Evidence

- Functional smoke report: `output/playwright/20260608-functional-smoke/functional-smoke-report.json`
- Production MediaPipe report: `output/playwright/20260610-real-model-check/metrics.json`
- Launch screenshot metrics: `output/playwright/20260608-launch-demo/metrics.json`
- Final implementation screenshots: `output/playwright/20260610-implementation-check/`
- Real model check screenshots: `output/playwright/20260610-real-model-check/`
- Model source note: `assets/models/face-landmarker/README.md`

## Residual Risk

- Fully offline face scanning is not complete while the MediaPipe JS/WASM runtime is loaded from CDN.
- The app is not a medical, diagnostic, skin analysis, face identity, or guaranteed-result system.
- Automated production landmark validation still needs consent-safe real-photo fixtures.

## Final Recommendation

Proceed as a web/PWA ship candidate for functional review using the latest generated release pointers. For App Store or Google Play submission, finish the external items: hosted public policy/support URLs, developer/support contact, native wrapper/signing, store console forms, Google health declaration posture, and a same-day official policy recheck.
