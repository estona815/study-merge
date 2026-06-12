# Design QA

## Verdict

Conditional pass for launch smoke. A source visual target was not provided, so this is not a pixel-fidelity pass against a Figma/mockup. It is a rendered-product QA pass against the current local app.

## Verified Build

- App build: `20260610a02`
- Local target: `http://127.0.0.1:4173/index.html`
- Browser: Playwright Chromium launch gate
- Evidence folder: `output/playwright/20260608-launch-demo/`

## Browser Evidence

- `screen-onboarding-390.png`
- `screen-today-390.png`
- `screen-routines-390.png`
- `screen-log-390.png`
- `screen-settings-390.png`
- `screen-face-scan-390.png`
- `screen-face-routine-390.png`
- `screen-face-guide-390.png`
- `screen-face-complete-390.png`
- `completion-390.png`
- `screen-offline-reload-390.png`
- `public-privacy-offline-390.png`
- `public-terms-offline-390.png`
- `public-support-offline-390.png`
- `desktop/screen-today-1280.png`
- `metrics.json`

## Results

- No console errors or page errors in the captured flows.
- No horizontal overflow at 390px, 430px, or 1280px desktop capture widths.
- Service worker became ready and offline reload returned the Today screen.
- Privacy, terms, and support public pages loaded successfully offline after cache install.
- Launch-risk copy sweep passed for the high-risk medical/analysis/guarantee terms tracked in `metrics.json`.
- Reference guide copy now presents camera/upload output as a local route overlay, not medical, diagnostic, or skin analysis.
- Functional smoke passed for manual log save, backup preview/merge/undo, and face guide upload completion persistence.
- Production face check passed only when the no-reference launch URL produced a MediaPipe result (`provider=mediapipe`, `detectorSource=real`, `referenceOnly=false`).

## Remaining Design Risk

- Final brand/pixel fidelity cannot be judged without a source visual target.
- Store screenshots still need a final curated capture set with exact device sizes required by Apple/Google. Verify latest official Apple/Google screenshot requirements before submission.
