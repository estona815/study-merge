# Study Merge Agent Guide

## Product Summary

Study Merge is an Expo + React Native educational 2048-style learning game MVP.
Players move concept blocks, merge related concepts, answer a quiz, and confirm learning.

## Core Learning Loop

1. Pick a learning track, subject, and unit.
2. Move concept blocks on a 4x4 or 5x5 board.
3. Merge valid concept pairs or same-group progressions.
4. Resolve a quiz to confirm the merge.
5. Update mastery, review queue, stats, and session result.

## Package Manager And Commands

Use `pnpm` for every install and script.

Primary commands:

```bash
pnpm install
pnpm dev
pnpm ios
pnpm android
pnpm web
pnpm typecheck
pnpm test
pnpm doctor
pnpm validate:content
pnpm check
pnpm web:export
```

## Required Validation Before Handoff

Run these commands unless the task clearly does not affect them:

```bash
pnpm check
pnpm typecheck
pnpm test
pnpm validate:content
pnpm web:export
```

If `pnpm validate:content` fails because release metadata is incomplete, report that clearly instead of faking content approval.

## React Native / Expo Coding Rules

- Keep changes small and reviewable.
- Prefer existing Expo and React Native primitives over new dependencies.
- Do not add a backend, analytics SDK, crash SDK, auth SDK, ads SDK, or purchase SDK unless already present.
- Preserve web keyboard support for board play.
- Preserve mobile swipe and touch ergonomics.
- Avoid risky navigation rewrites.
- Keep Safe Area behavior intact on small phones and modern gesture devices.

## Hook-Order Rules

- Never place hooks after conditional returns.
- Keep hook order stable across renders.
- If lifecycle logic needs testing, extract a small pure helper instead of duplicating hook logic.

## Persistence And Session Restore Rules

- `currentGame` persistence must remain deterministic.
- Restored sessions must always come back with `paused = true`.
- Background or inactive AppState transitions must pause an active game.
- Do not mutate persisted state directly during rehydration.
- Prefer pure helper functions for persistence shaping and restore logic.

## Content Quality Rules

- Do not invent official curriculum facts or real exam facts.
- Do not mark content release-ready unless review metadata supports it.
- Treat current built-in content as sample/MVP content unless explicitly reviewed.
- Add validators, fixtures, and docs instead of blindly editing thousands of generated records.

## Copyright And Source Rules

- Do not copy textbook or exam material verbatim.
- Do not fabricate `sourceRef`, `reviewStatus`, or `copyrightStatus`.
- If release metadata is missing, add validation failures and TODO documentation rather than fake values.

## Testing Rules

- Prefer pure-function tests for game rules, scoring, persistence transforms, and lifecycle guards.
- Add targeted store tests only when the behavior cannot be verified safely through pure helpers.
- Keep board movement deterministic in tests by passing a fixed RNG.
- Cover quiz correctness, review queue insertion, score/combo updates, and session end behavior when touched.

## Release-Readiness Rules

- Do not claim public App Store / Google Play readiness from unit tests alone.
- Real-device QA, store assets, bundle identifiers, privacy answers, and content review are separate release gates.
- Missing privacy URLs, support URLs, bundle IDs, or package names must stay as explicit TODO items until provided by the product owner.
