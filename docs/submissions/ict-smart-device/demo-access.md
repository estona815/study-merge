# ICT Smart Device Demo Access

작성 기준: 2026-06-10 KST

## Current Status

No working public demo URL is stored in this repository. `git remote -v` returned no configured remote in this local checkout, so a GitHub Pages URL cannot be inferred.

## Local Demo Candidate

For local review only:

```sh
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173/index.html
```

This local URL is not suitable for official submission unless the organizer explicitly accepts a local-device demo.

## Public Demo Preparation

To create a public demo, upload the contents of:

```text
output/release/gwalsa-web-pwa-20260610-100147/web/
```

to a stable HTTPS static hosting root.

After deployment, verify:

- `/index.html`
- `/manifest.json`
- `/service-worker.js`
- `/public/privacy-policy.html`
- `/public/terms-disclaimer.html`
- `/public/support.html`
- camera permission on the target device
- upload fallback on the target device
- MediaPipe runtime loading on the target network

## QR Status

QR code was not generated because there is no verified public demo URL. Generate QR only after the public URL is live and tested on the exact target device/network.

## Offline Note

The app shell is cached by the service worker, but the current MediaPipe Tasks Vision JS/WASM runtime is loaded from CDN. For a fully offline device demonstration, vendor the runtime into app assets and rerun QA.
