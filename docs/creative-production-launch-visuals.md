# Creative Production Launch Visuals

Checked: 2026-06-09 KST

## Brand Direction

괄사 루틴 should read as a calm beauty self-care app, not a clinic, treatment, or diagnostic tool.

- Tone: quiet, careful, warm, polished, local-first.
- Color posture: soft jade, blush, warm off-white, charcoal text, restrained accent contrast.
- Visual language: real app screens, gentle routine movement, clean privacy cues, no medical crosses, clinical charts, before/after guarantee framing, or dramatic transformation imagery.
- Copy posture: "참고", "루틴", "기록", "로컬", "셀프케어" over "분석", "진단", "개선 보장", "치료", "예측".

## Icon Assessment

Current icons are acceptable for a PWA launch package:

- `assets/icon.svg`
- `assets/icon-192.png`
- `assets/icon-512.png`
- `assets/apple-touch-icon.png`

Should-fix before native store submission:

- Re-export the icon from a sharp vector source at store-required sizes.
- Check maskable safe area in iOS/Android icon previews.
- Avoid medical or clinical symbols.
- Keep the icon legible at 48px and 96px; the current soft texture is pleasant but may lose edge clarity in small store/search contexts.

## Recommended Store Screenshot Cuts

Use product screens first. Avoid a marketing landing page feel.

1. Today screen, 430px capture: "오늘 루틴을 부드럽게 시작"
2. Routine screen, 430px capture: "단계별 타이머와 부위별 안내"
3. Completion screen, 430px capture: "완료 후 바로 남기는 로컬 기록"
4. Log screen, 430px capture: "사진 메모와 느낌 기록은 브라우저 안에"
5. Settings screen, 430px capture: "사진 보관, 백업, 삭제를 직접 관리"
6. Reference guide screen, 390px capture: "참고 동선은 로컬에서만 표시"
7. Privacy/support page capture for review packet only: "정책과 지원 안내를 앱 안에서 확인"

Desktop PWA optional cut:

- Today screen at 1280px for web launch page, review notes, or press/support materials.

## Store Caption Copy

Korean:

- 오늘 루틴을 부드럽게 시작
- 단계별 타이머로 차분하게 진행
- 전후 느낌과 사진 메모를 로컬 기록으로
- 참고 동선은 브라우저 안에서만 표시
- 사진 보관, 백업, 삭제를 직접 관리
- 일반 뷰티 셀프케어용, 의료 목적 아님

English:

- Start today's routine gently
- Follow calm step-by-step timing
- Keep notes and photo memos locally
- Reference routes stay in your browser
- Manage photo retention, backups, and reset
- General beauty self-care, not medical advice

## Launch Visual Formats

Create these after the final public URL and store target are confirmed:

- 1080x1920 vertical launch visual using the Today screen and one short caption.
- 1200x630 web/social card using the app icon, product name, and Today screen crop.
- 1024x500 Google Play feature graphic with a clean product screen composition and no medical claims.
- App Store/Play Store screenshots cropped to the current official device-size requirements immediately before upload.

## Review Risk Guardrails

- Do not show dramatic before/after transformations.
- Do not imply facial measurement, skin diagnosis, guaranteed lifting, disease prevention, treatment, or medical efficacy.
- Do not use "AI analysis" or "face analysis" in captions unless the implementation and review disclosures are changed.
- For camera/photo visuals, show local reference and privacy cues near the screen.
- If using lifestyle imagery, keep it secondary to the actual app UI.
