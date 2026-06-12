# Apps In Toss Monetization Checklist

작성 기준: 2026-06-10 KST

## Monetization Posture

The first miniapp should keep the core 3분 루틴 usable without payment. Monetization, if added, should be optional and should not change the product from a general beauty self-care timer into a stronger claim-led product.

Recommended paid surfaces:

- Optional routine packs
- Theme packs
- Journal organization helpers
- Export templates
- Optional reminder or streak presentation features, if platform support is confirmed

Avoid paid surfaces:

- Copy that implies a stronger visible outcome
- Locked safety, privacy, delete, reset, or support controls
- Paid face guide wording that sounds like judgement
- Forced ads during timer, loading, permission, or completion-critical moments

## Option 1: No Monetization For First Review

Use this when fastest review is the priority.

Checklist:

- Keep no payment SDK.
- Keep no advertising SDK.
- Keep no Toss login unless required by the chosen miniapp flow.
- Submit as a simple 3분 루틴 timer and local record tool.
- Defer revenue features to a later version after baseline approval.

## Option 2: One-Time In-App Purchase

Candidate items:

- Extra routine presets
- Visual themes
- Journal export templates

Checklist:

- Confirm current Apps in Toss IAP guide.
- Define product IDs and display names.
- Add purchase, cancel, failure, restore, and order-state flows.
- Confirm whether Toss login and server-side status checks are required.
- Run sandbox tests before review.
- Update privacy, QA, and support docs.

## Option 3: Subscription

Candidate value:

- Expanded routine library
- More journal organization
- Advanced export layouts

Checklist:

- Confirm subscription support and current sandbox limitations in the official docs.
- Define renewal, cancellation, restore, and access rules.
- Make unpaid experience clear and useful.
- Provide support copy for billing questions.
- Update privacy, QA, and support docs.

## Option 4: In-App Ads

Candidate use:

- Optional rewarded unlock for a theme or routine pack
- Light banner only on scrollable non-timer screens, if platform guidance allows

Checklist:

- Do not show ads on timer start, permission prompt, loading screen, or forced modal.
- Preload ads before display.
- Return users to the same miniapp state after ad close.
- Pause any media if future media is added.
- Keep reward wording simple and verifiable.
- Update privacy, QA, and support docs.

## Data And Policy Impact

Adding Toss login, payment, ads, push, server APIs, remote logging, or promotion features changes the current local-only basis.

Before submitting a monetized bundle:

- Update `docs/submissions/apps-in-toss/privacy-safety-summary.md`.
- Update `docs/submissions/apps-in-toss/qa-evidence.md`.
- Update hosted privacy/support pages.
- Record every SDK/API and whether data leaves the device.
- Retest failure, cancellation, restore, refund-support, and reopen states.

## Revenue Copy Guardrail

Allowed direction:

- "추가 루틴 팩"
- "테마 팩"
- "기록 정리 기능"
- "내보내기 템플릿"

Avoid direction:

- Stronger appearance promise for paid users
- Before/after proof
- Time-limited pressure that hides what is paid
- Any claim that paid features produce a specific user outcome
