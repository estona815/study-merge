# Store Privacy Answers Draft

Checked against official Apple and Google documentation on 2026-06-09 KST. Store policy pages can change; verify the linked official pages again immediately before submission.

## Official References

- Apple App privacy details: `https://developer.apple.com/app-store/app-privacy-details/`
- Apple Manage app privacy: `https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy`
- Apple App privacy reference: `https://developer.apple.com/help/app-store-connect/reference/app-privacy/`
- Apple screenshot upload/specs: `https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots`, `https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications`
- Google Play Data safety form: `https://support.google.com/googleplay/android-developer/answer/10787469`
- Google Play User Data policy: `https://support.google.com/googleplay/android-developer/answer/10144311`
- Google Play Health Content and Services policy: `https://support.google.com/googleplay/android-developer/answer/16679511`
- Google Play Health apps declaration: `https://support.google.com/googleplay/android-developer/answer/14738291`
- Google Play preview assets: `https://support.google.com/googleplay/android-developer/answer/9866151`
- Google Play account deletion requirement: `https://support.google.com/googleplay/android-developer/answer/13327111`
- Google Play Console requirements: `https://support.google.com/googleplay/android-developer/answer/10788890`

## Current Implementation Basis

- No backend.
- No account system.
- No analytics SDK.
- No advertising SDK.
- No payment SDK.
- No third-party sharing code found in the static app.
- Routine logs, settings, custom routines, compressed before/after photos, and reminders are stored in browser `localStorage`.
- Reference guide camera/upload images are processed locally for reference route display only; original camera/upload images are not persisted in history or backups.
- The current implementation does not identify a person, verify identity, create biometric templates, diagnose skin condition, or predict future skin changes.
- Full JSON backup is user-generated and may include compressed before/after photos. Light backup excludes photos.
- Notifications are requested only after the user enables reminders.

## Apple App Privacy Draft

Candidate answer if the App Store wrapper bundles the static app locally and does not transmit user data off-device:

- Data collection: No, this app does not collect data from the app.
- Tracking: No.
- Third-party data sharing: No.
- Third-party SDK privacy manifests: Not applicable unless a wrapper SDK is added.

Important condition:

- If the wrapper loads the app from a remote web URL, uses analytics, crash reporting, ads, cloud sync, remote logging, or any SDK that transmits user data, the answers must be updated.
- Apple treats on-device-only processing differently from transmitted collection, but the final App Store Connect answer must reflect the exact binary and all third-party code in the wrapper.
- Keep the app positioned as beauty self-care. Do not use medical, diagnostic, treatment, or guaranteed outcome claims in metadata, screenshots, review notes, or permission copy.

Privacy policy URL:

- Required for all apps.
- Current local draft: `public/privacy-policy.html`.
- Submission blocker: replace with a stable public URL before App Review.

User privacy choices URL:

- Optional.
- Candidate: `public/support.html` explains local reset, photo deletion, backup deletion, and browser site-data deletion. Replace with a stable hosted support URL before submission.

## Google Play Data Safety Draft

Candidate answer if the Android wrapper bundles the static app locally and does not transmit user data off-device:

- Does the app collect user data? No.
- Does the app share user data? No.
- Is all user data encrypted in transit? Not applicable if no user data is transmitted. If any remote hosting, sync, crash, analytics, or logging is added, answer based on the actual transport.
- Can users request data deletion? No account is created. In-app controls allow local photo deletion, record deletion, and full local app reset.
- Account creation: No.

Important condition:

- Google Play still requires a Data safety form and privacy policy even when the app does not collect user data.
- Google's User Data policy requires a public, active, non-PDF privacy policy URL and a privacy contact or inquiry mechanism.
- Current local support page: `public/support.html`; final submission still needs a hosted support URL and reachable support contact channel.
- Owner-provided public URLs, identity, wrapper, and contact fields should be recorded in `docs/external-store-inputs.md` before submission.
- If the app is wrapped with SDKs, analytics, crash reporting, cloud sync, ad libraries, or remote WebView hosting, update Data safety answers to include those practices.

## Google Play Health Declaration Draft

- Google Play requires the Health apps declaration for all submitted apps, even if the developer declares that the app does not provide health features.
- Recommended posture for the current app: submit as a general beauty self-care/wellness utility, not as a medical device or diagnostic app.
- If Play Console flags gua sha, skin comfort checks, reminders, or wellness copy as health-related, complete the declaration conservatively and keep the disclaimer: not a medical device, does not diagnose, treat, cure, or prevent disease, and users should consult a qualified professional for medical concerns.
- Do not claim disease prevention, treatment, clinical efficacy, guaranteed appearance changes, or confirmed skin-condition analysis.

## Native Permission Strings

Use these as starting copy in the wrapper. Confirm exact platform fields during native implementation.

### iOS

`NSCameraUsageDescription`

참고 가이드에서 동선을 화면 위에 표시하기 위해 카메라를 사용합니다. 이미지는 기기 안에서 처리되며 원본 카메라 이미지는 기록이나 백업에 저장하지 않습니다.

`NSPhotoLibraryUsageDescription`

사용자가 선택한 전후 사진 기록 또는 참고 동선용 이미지를 불러오기 위해 사진 보관함 접근을 사용합니다. 전후 사진은 압축되어 로컬 저장됩니다.

Notifications permission prompt/context:

사용자가 설정한 괄사 루틴 리마인더를 보내기 위해 알림을 사용합니다. 알림은 설정에서 언제든 끌 수 있습니다.

### Android

Camera permission rationale:

참고 가이드에서 동선을 화면 위에 표시하기 위해 카메라를 사용합니다. 이미지는 기기 안에서 처리되며 원본 카메라 이미지는 기록이나 백업에 저장하지 않습니다.

Photos/files permission or Photo Picker rationale:

사용자가 선택한 전후 사진 기록 또는 참고 동선용 이미지를 불러오기 위해 사용합니다. 전후 사진은 압축되어 로컬 저장됩니다.

Notification permission rationale:

사용자가 설정한 괄사 루틴 리마인더를 보내기 위해 알림을 사용합니다. 알림은 설정에서 언제든 끌 수 있습니다.

## Submission Blockers That Cannot Be Solved In This Repo

- Hosted public privacy policy URL.
- Hosted public terms/support URL.
- Real developer/company name and privacy point of contact.
- Native bundle/package ID and signing.
- Google Play Health apps declaration and final category choice.
- Final App Store Connect / Play Console form answers after wrapper SDKs are known.
