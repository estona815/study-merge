# DAESIN Release Checklist

> Current verdict: **NO-GO — production release evidence incomplete**  
> Updated: 2026-07-14  
> Rule: checked means verified against the current release candidate, not merely implemented or documented.

## 1. Current release blockers

- iOS Simulator, Android Emulator and physical-device evidence is not available.
- DAESIN-specific RLS migration has not yet been proven on local, staging and production environments.
- Real AI provider schema/fallback behavior has not been verified with a server-held key.
- Store sandbox purchase, entitlement activation, restore, expiry and refund states are unverified.
- 자동·수동 paywall 진입, 7일 cooldown 영속 상태와 Free 세이브 메뉴 5개 제한은 local app/store에 연결됐다. 실제 store offering·구매·복원·만료는 여전히 미검증이다.
- 마스터 고정 결정인 cold-launch Craving Gate 선노출·cooldown·딥링크 우선·설정 opt-out은 미검증이다.
- 마스터 명세의 오늘의 대신 레시피 source/rights/nutrition publication pipeline은 아직 구현되지 않았다.
- Web 릴리스 후보 핵심 상태 6장은 실제 캡처했지만 iPhone·Android 제출 규격 자산은 각 native 플랫폼에서 캡처하지 않았다.
- Production privacy policy URL, support contact, operator identity, retention and cross-border processing details are not final.

Mock mode, unit tests and web export can reduce risk but do not clear these blockers.

## 2. Product and core flow

- [ ] Cold launch presents the Craving Gate before 설명·통계·온보딩 and respects cooldown, active-session/deep-link priority and settings opt-out.
- [x] Guest can complete onboarding and first recommendation without sign-up. (web RC)
- [x] `지금 땡겨요 → 음식 → 배고픔 → 이유 → 분석 → 세 선택 → 결과 저장` works offline with rule fallback. (web RC)
- [x] `대신 먹기`, `계획해서 먹기`, `5분 보류` have equal visual weight and none is treated as failure. (390/320 web visual)
- [x] Timer can be exited immediately and restored state is covered by persistence tests; native background/foreground remains unverified.
- [x] Saved outcome updates home and weekly report once, without duplicate counts. (web RC + deterministic tests)
- [ ] AI/provider/network/storage failures have actionable recovery and do not strand the session.
- [ ] No P1 teaser, disabled control or TODO blocks the P0 flow.

## 3. Safety and content

- [x] Allergy and dietary hard blocks pass the full fixture set in mock mode; connected mode remains unverified.
- [x] Parsed AI output cannot bypass client safety filters; production server remains unverified.
- [x] No-safe-candidate state keeps planned eating and delay choices instead of relaxing restrictions.
- [x] Calories are hidden by default and removed from accessibility labels, share cards and analytics when hidden.
- [x] Sensitive mode overrides meme tone, calories, celebration and share in the tested web flow; local paywall UI is suppressed while sensitive mode is active.
- [ ] Sensitive copy has only `sensitive → plain → safe_generic` fallback.
- [ ] No diagnosis, treatment, weight-loss promise, restriction instruction or stigmatizing copy appears.
- [ ] Help information is reviewed for Korea, localized, reachable and not presented as medical diagnosis.

## 4. Deterministic quality gates

- [x] `pnpm install --frozen-lockfile`
- [x] DAESIN domain, AI, persistence, monetization and analytics tests pass with no real time/network/API. (5 suites, 39/39)
- [x] `pnpm typecheck`
- [x] `pnpm lint`
- [x] `pnpm test:smoke` (8/8)
- [x] `pnpm check:secrets`
- [x] `pnpm web:daesin:export`
- [x] `pnpm verify:fast`
- [x] Test failures, skipped tests and known warnings are recorded in `docs/daesin/QA.md`.
- [x] Free 신규 세이브 메뉴는 5개에서 원자적으로 차단되고 기존 항목 편집과 Pro 신규 추가는 유지된다. (local deterministic tests)

## 5. Persistence, export and delete

- [x] Snapshot has a schema version and corrupted/unknown storage recovers safely.
- [x] AsyncStorage의 별도 field-level 암호화 부재, 기기 접근자·backup 노출 위험과 OS 화면 잠금 권고가 privacy copy와 risk acceptance에 기록됐다.
- [x] Web reload keeps a completed outcome and active session without duplication; native restart remains unverified.
- [ ] Export includes user-visible preferences, restrictions, sessions, outcomes and save meals.
- [ ] Export excludes auth tokens, provider secrets, receipt raw data, analytics ID and internal stack traces.
- [ ] Guest delete-all removes every local namespace and resets analytics identity.
- [ ] Connected account deletion verifies remote cascade before reporting completion and then purges local/auth state.
- [ ] Partial deletion failure is never reported as success.
- [ ] User sees that app-data deletion may not cancel an App Store/Google Play subscription.
- [ ] Temporary export files and cached share cards are removed according to the documented lifecycle.

## 6. Privacy and security

- [ ] Actual network capture matches `docs/daesin/PRIVACY.md`.
- [x] Analytics transport only receives event-specific allowlisted properties; raw food, note, AI text, allergy/restriction and PII aliases are rejected.
- [ ] Analytics opt-out stops non-essential analytics.
- [x] Client bundle/source secret scan finds no AI key, service-role key, private key or webhook secret.
- [ ] Every `EXPO_PUBLIC_*` value is intentionally public and least-privileged.
- [x] Persisted snapshots and AI responses are treated as untrusted and schema-validated; production network adapter remains unverified.
- [x] Targeted source scan found no unsafe HTML injection, dynamic code execution or unvalidated outbound URL.
- [ ] Dependencies install from `pnpm-lock.yaml` with frozen lockfile in CI.
- [ ] Production web host security headers are checked at runtime; repo absence is not treated as proof either way.
- [ ] Edge runtime에서 CSP, `nosniff`, clickjacking, Referrer-Policy, Permissions-Policy를 직접 확인했다. 정적 export 성공이나 repo 설정 부재로 통과를 추정하지 않는다.
- [ ] Privacy/support/delete URLs use production HTTPS endpoints and contain final operator/contact details.

## 7. Supabase and RLS evidence

These rows must be checked independently.

- [x] **Source exists:** `20260714_daesin_p0.sql`에 DAESIN tables, indexes, ownership columns, cascade와 policies가 정의되어 있다. 파일 존재는 적용 증거가 아니다.
- [ ] **Local applied:** a clean `supabase db reset` applies the migration successfully.
- [ ] **Local isolation:** user A cannot read/write/delete user B profile, sessions, outcomes or save meals.
- [ ] **Local function security:** export/delete functions derive identity from auth context and do not trust a client-supplied owner ID.
- [ ] **Staging applied:** staging migration history contains the exact version/hash.
- [ ] **Staging isolation:** two real staging users pass owner isolation and delete/export tests.
- [ ] **Production approved:** migration deployment has explicit user/owner approval and rollback/backup plan.
- [ ] **Production applied:** production migration history and post-deploy smoke are captured.

Never infer a checked environment from another row. Do not apply production migrations without explicit instruction.

## 8. AI backend

- [ ] Provider secret exists only in server runtime and secret management.
- [ ] Request minimization excludes full history, free notes and account identifiers by default.
- [ ] Response is parsed by a strict schema that rejects unknown keys and invalid ranges/enums.
- [ ] Timeout, parse, schema, safety and provider errors each fall back without blocking core flow.
- [ ] Prompt/response raw text is excluded from analytics and ordinary logs.
- [ ] Rate limit, abuse control, provider cost limit and timeout are configured server-side.
- [ ] Mock, rule-based and production provider types are distinguishable in QA evidence.
- [ ] Provider retention, training-use terms, region and subprocessors are reflected in privacy copy.

## 9. Subscription and paywall

- [ ] Single entitlement `daesin_pro` maps correctly to approved monthly and annual products.
- [ ] Store-returned locale price and period are the only displayed source of truth.
- [ ] Savings appear only when both prices load and the positive value is calculated correctly.
- [x] First session, active session, sensitive mode, error recovery, delete and restore suppress paywall. (local policy + app wiring; real store transport excluded)
- [x] Automatic paywall requires 3 completed sessions and a persisted 7-day cooldown. (local deterministic tests)
- [ ] Close, restore, terms and privacy are always visible and accessible.
- [ ] Purchase, pending, cancelled, failed, active, expired and restored states are tested in both store sandboxes.
- [ ] Provider success without active entitlement shows recovery, not another purchase prompt.
- [ ] Free core, allergy safety, export and delete remain available after expiry.
- [ ] Mock subscription is visibly and analytically separated from real billing.

## 10. Analytics and operations

- [ ] Event names/properties follow `docs/daesin/METRICS.md` allowlist.
- [ ] Guest→account merge does not duplicate events or change experiment cell.
- [ ] `option_selected + outcome_logged` count one conscious choice per session.
- [ ] `recommendation_succeeded + recommendation_fallback_used` continuity is measurable.
- [ ] Sensitive/paywall exclusion has an automated zero-occurrence monitor.
- [ ] Allergy recommendation incident alert and response owner are configured.
- [ ] Crash/error release version, platform and non-sensitive code are available.
- [ ] Rollback, feature disable and provider fallback paths are documented and rehearsed.

## 11. iOS and Android validation

### iOS

- [ ] Current supported iOS Simulator launches release candidate from clean install.
- [ ] Guest flow, background timer, notification permission, share/export and delete pass.
- [ ] Dynamic Type, VoiceOver, Reduce Motion, dark/light/system theme pass.
- [ ] Subscription purchase/restore passes StoreKit sandbox.
- [ ] App icon, splash, privacy manifest/usage strings, bundle ID and signing are final.

### Android

- [ ] Current supported Android Emulator launches release candidate from clean install.
- [ ] Guest flow, back gesture, background timer, notification permission, share/export and delete pass.
- [ ] Font scaling, TalkBack, Remove Animations, dark/light/system theme pass.
- [ ] Subscription purchase/restore passes Play test track.
- [ ] Adaptive/themed icon, splash, permissions, package name, signing and target API are final.

### Physical devices

- [ ] At least one small/older and one current device per platform pass the P0 flow.
- [ ] Low-memory resume, offline fallback, Korean keyboard and OLED Night Bloom are checked.

## 12. Store submission

- [ ] Korean title, subtitle/short description, keywords and full description are approved.
- [ ] Privacy nutrition labels/data safety form match shipping SDK and network behavior.
- [ ] Six screenshots are actual release-candidate captures on required device classes.
- [ ] Screenshot copy has no fake UI, fake price, medical claim or weight-loss implication.
- [ ] App icon, adaptive icon, feature graphic and preview assets pass current portal validation.
- [ ] Support, privacy, terms and delete-account URLs are public and final.
- [ ] App review notes explain guest flow, mock/demo exclusion and how to reach subscription/delete.
- [ ] Age rating and 18+ product positioning are reviewed against current store questionnaires.
- [ ] Metadata and export dimensions are rechecked against official portals at submission time.

## 13. Evidence record

| Item | Build/commit | Command or device | Date | Result | Evidence path | Owner |
|---|---|---|---|---|---|---|
| DAESIN unit tests | current worktree | `pnpm test:daesin`, 39/39 | 2026-07-14 | `PASS` | `docs/daesin/QA.md` | QA |
| Workspace smoke | current worktree | `pnpm test:smoke`, 8/8 | 2026-07-14 | `PASS` | `docs/daesin/QA.md` | QA |
| Fast gate | current worktree | `pnpm verify:fast` | 2026-07-14 | `PASS` | 4 app exports | QA |
| Web export | current worktree | `pnpm web:daesin:export` | 2026-07-14 | `PASS` | local `dist/` only | QA |
| Web visual flow | current worktree | Playwright CLI, 390/320/1280 widths | 2026-07-14 | `PASS` | `assets/daesin/store/` + `output/playwright/daesin-final/` + `output/playwright/daesin-monetization-qa/` | QA |
| iOS Simulator | — | `xcrun simctl` | 2026-07-14 | `BLOCKED` | utility unavailable | QA |
| Android Emulator | — | `adb`, `emulator` | 2026-07-14 | `BLOCKED` | utilities unavailable | QA |
| RLS source | current worktree | static migration inspection | 2026-07-14 | `PASS` | `20260714_daesin_p0.sql` | Backend/QA |
| Local RLS | — | `supabase db reset` + two-user policy test | — | `NOT RUN` | — | Backend/QA |
| Staging RLS | — | — | — | `BLOCKED` | — | Backend/QA |
| Store sandbox | — | — | — | `BLOCKED` | — | Mobile/QA |
| Full workspace gate | current worktree | `pnpm verify:full` | 2026-07-14 | `EXPECTED FAIL` | Study Merge metadata 47,511 missing | QA |

## 14. Release decision

- **GO:** every P0, safety, privacy, RLS, real billing, native and store gate has evidence; no unresolved critical/high issue.
- **CONDITIONAL GO:** only explicitly accepted non-safety operational risk remains, with owner and deadline. Cannot waive allergy, deletion, RLS, secret, billing truthfulness or native launch gates.
- **NO-GO:** any blocker above remains, evidence is missing, or mock/web result is being used to claim production/native readiness.
