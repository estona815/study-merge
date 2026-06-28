# Study Merge Privacy / Data Safety Inventory

이 문서는 법률 문서가 아니라, 스토어 privacy form 과 정책 작성 전에 엔지니어링 관점에서 무엇이 저장/전송되는지 파악하기 위한 인벤토리다.

## Scope

- Active app entrypoint: `App.tsx` -> `src/StudyMergeApp.tsx`
- Note: repository also contains `src/adhd/*` prototype code, but it is not the active app entrypoint for Study Merge.

## Data Stored Locally

Current Study Merge path uses `@react-native-async-storage/async-storage` through Zustand persist.

Persisted fields in `src/store/useAppStore.ts`:

- `onboardingComplete`
- `selectedMode`
- `focusPreset`
- `selectedSubjectId`
- `selectedUnitId`
- `subjectSearch`
- `subjectFilter`
- `difficulty`
- `goal`
- `masteryByConceptId`
- `subjectProgress`
- `reviewQueue`
- `sessionHistory`
- `currentGame`
- `lastResult`
- `streakDays`
- `lastStudyDate`

### What this means in plain terms

- Learning preferences are stored locally.
- Progress and mastery are stored locally.
- Wrong-answer review queue is stored locally.
- In-progress session state is stored locally.
- Recent session history and result summary are stored locally.

## Data Sent Over Network

Current active Study Merge app path appears to send no network requests.

Repo inspection notes:

- No `fetch(...)` calls found in active Study Merge path.
- No API client libraries detected in active Study Merge app dependencies.
- No auth flow in active Study Merge path.
- No analytics SDK in active Study Merge path.
- No crash reporting SDK in active Study Merge path.

## Account / Identity

- No sign-up flow detected
- No sign-in flow detected
- No account profile model detected
- No remote user identifier detected
- No obvious device identifier collection detected

## Notifications

- No Study Merge notification package or active notification integration detected

## Ads / Purchases

- No ads SDK detected
- No in-app purchase SDK detected

## External SDKs

In the active Study Merge app path:

- `expo`
- `react-native`
- `react-native-web`
- `zustand`
- `@react-native-async-storage/async-storage`

No evidence found for:

- Firebase
- Sentry
- Amplitude
- Mixpanel
- Segment
- AdMob
- RevenueCat

## Permissions

Current Expo config does not declare explicit custom iOS/Android permissions beyond default platform behavior.

Open questions:

- If future notifications are added, store disclosures must change.
- If analytics/crash SDKs are added later, store disclosures must change.

## Student / Minor Risk Notes

Study Merge is an educational learning game and may be used by students or minors. Even without account systems, this raises additional product and policy considerations:

- Content accuracy risk matters more because educational trust claims can affect minors.
- Store age rating and educational category choices should be reviewed carefully.
- Marketing copy must not overclaim curriculum accuracy without verified review.

## What Must Be Answered Later In Store Privacy Forms

- Is any data collected off-device? Current code suggests no for Study Merge.
- Is any user data linked to identity? Current code suggests no.
- Is any data used for tracking? Current code suggests no.
- Is progress data only stored on-device? Current code suggests yes.
- Are minors specifically targeted? Product/legal decision required.

## Unknowns / Product-Legal Decisions Needed

- Whether future public release will include account sync
- Whether future public release will include analytics or crash reporting
- Whether minors are an explicit target audience
- Final privacy policy URL
- Final support/contact URL
- Final store disclosure wording for educational sample content
