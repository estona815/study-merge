# Study Merge Store Release Readiness

이 문서는 현재 저장소를 기준으로 App Store / Google Play 릴리즈 준비도를 기록한 엔지니어링 체크 문서다. 값이 없는 항목은 추정하지 않고 `TODO` 로 남긴다.

## Current Expo Config Snapshot

- App name: `Study Merge`
- Slug: `study-merge`
- Scheme: `studymerge`
- Version: `0.1.0`
- Orientation: `portrait`
- User interface style: `light`
- Primary color: `#f06a24`
- Background color: `#f6efe5`
- Platforms: `ios`, `android`, `web`
- iOS `supportsTablet`: present, `true`
- Web favicon: present, `assets/favicon.png`

## Present vs Missing

### Present

- App name
- Slug
- Scheme
- Orientation
- Basic color metadata
- Web favicon

### Missing / TODO

- Icon
  - TODO: add app icon path in Expo config
  - Current repo evidence: no active mobile icon config
- Splash
  - TODO: add splash config and final art
- Adaptive icon
  - TODO: add Android adaptive icon config
- iOS bundleIdentifier
  - TODO: product owner must provide final value
- iOS buildNumber
  - TODO
- Android package
  - TODO: product owner must provide final value
- Android versionCode
  - TODO
- App category
  - TODO
- Privacy policy URL
  - TODO
- Support URL
  - TODO
- Review notes
  - TODO
- Test account or demo mode guidance
  - TODO: likely demo mode explanation only, because no account system exists

## EAS / Build Readiness

- `eas.json`: missing
- EAS profiles: missing
- Credentials setup: missing
- Build channel strategy: missing

Recommended action:

- Create `eas.json` only after bundle identifiers and distribution ownership are decided.
- Do not invent build profiles or credentials in code before product/distribution values are confirmed.

## iOS Readiness

- Bundle identifier: TODO
- Build number: TODO
- Tablet support: currently enabled via `supportsTablet: true`
- Permissions list: no explicit custom permissions declared in current Expo config
- Age rating concerns:
  - Educational content for students may require careful classification
  - No chat, account, payments, or ads detected in current Study Merge app path
- Privacy answers:
  - Must reflect local persistence of learning state and review queue
  - Must confirm whether any student/minor data scenario is targeted

## Android Readiness

- Package name: TODO
- Version code: TODO
- Adaptive icon: TODO
- Play Console data safety answers: TODO
- Low-end Android device QA: TODO

## Store Assets Still Needed

- App icon
- Splash image
- iPhone screenshots
- Android phone screenshots
- Tablet screenshots if tablet support remains enabled
- App preview or promo video
- Google Play feature graphic

## Copy / Metadata Still Needed

- App Store subtitle
- Promotional text
- Short description
- Long description
- Keywords / ASO list
- Review notes for testers
- Content disclaimer copy for sample/MVP educational data

## Privacy / Support URLs

- Privacy policy URL: TODO
- Support URL: TODO

Do not fabricate placeholder production URLs in config. Final URLs should be filled only when a real hosted policy/support page exists.

## Release Evidence Missing

- Final icon/splash assets
- Real-device screenshots
- Store listing copy
- Privacy/legal review artifacts
- Verified content review metadata
- Build/distribution configuration
