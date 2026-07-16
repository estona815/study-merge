# Known Limitations

Status date: 2026-07-15.

## Blocking verification issues

- The exact Unity `2022.3.62f3` binary was version-verified, but batch mode cannot acquire a valid license. It reports unavailable access token, no ULF file and no cached token.
- Android Build Support, OpenJDK 11, SDK platform 36/build-tools 34 and NDK r23b are present in the exact Editor cache, but no Android player build, install or device run has occurred because the Editor license blocks project import.
- Final Shared/Core/UI/Hub/Battle/Editor/EditMode/PlayMode assemblies passed an asmdef-faithful bundled-Roslyn compile. A direct non-Unity harness passed 14/14 pure Battle NUnit methods; Core, `BattleEngineSmoke`, auto-turn and reward-service probes passed. Unity's importer/assembly pipeline, package resolution, serialization, EditMode Test Runner and PlayMode Test Runner are still not executed.
- Twenty-four Unity cases are authored: 14 Battle EditMode, 4 Core EditMode, 4 safe-area resolution cases and 2 PlayMode smoke cases. Authored/compiled is not equivalent to a Unity Test Runner pass.
- `bash -n Scripts/*.sh` passed. `bootstrap_content.sh`, `run_tests.sh` and `build_android.sh` were each rerun and each exited 1 with the exact no-valid-license message; they produced no scenes, XML or APK.
- `Artifacts` contains licensing-failure logs and `Builds` may contain an empty output directory. `Assets/Scenes` and `Captures` are absent; no successful Test Runner XML, APK/AAB, screenshot or MP4 deliverable exists.

## Core limitations

- Persistence is local JSON in PlayerPrefs. It has no encryption, cloud sync, multi-account merge or migration beyond schema normalization.
- `MockBackendAdapter` is deliberately offline. HIVE, Firebase, AppsFlyer, LevelPlay, IAP, Google sign-in, Socket.IO and WebSocket flows are not implemented.
- Application pause/quit requests an async save. Production persistence should add an explicit checkpoint policy and platform-specific quit testing.
- Building production uses whole-minute ticks and soft currency only; it is demo tuning, not a released economy.
- Hero experience is distributed to all active team members with a simple local curve.
- The default scene navigator loads Build Settings scenes. Addressable scene handle lifecycle is not implemented.
- `LocalResourcesAssetProvider` has no unload/cache policy and is suitable only for the small offline demo.
- Quality profiles publish budgets, but presentation systems must consume them; Core cannot guarantee actual culling or effect changes.

## Content limitations

- The APK's remote catalog and bundles were not contacted or copied. Most cataloged art, audio, scene and table entries are not locally available.
- The supplied APK package is `com.jbenterprise.skygalleon.puzzle`, contrary to the preliminary package listed in the request.
- Asset ownership and licensing are not proven by possession of the APK or JPG. Both remain reference-only.
- Generated scenes and Build Settings are unverified until the Editor bootstrap command runs successfully. That bootstrap does not create prefabs or Addressables groups.
- Addressables 1.22.3 and Recorder 4.0.1 are declared, but package resolution/lockfile and owned Addressables/Recorder configuration are unverified.
- Exact parity with the APK is neither possible nor a goal; the project uses original clean-room names, tuning, visual construction and code.

## Runtime/UI/battle limitations

- Safe area, text overflow and tap targets are not runtime-validated at 720x1600, 1080x1920, 1080x2400 or 1440x3200.
- Lobby animation density, idle-loop quality and mobile frame rate are not measured.
- The bundled Noto Sans KR variable font removes OS font availability as the primary Korean-glyph dependency. Its Unity import, TMP generation/rendering, line breaking and overflow still require licensed PlayMode and device validation.
- Battle route availability depends on the four generated scenes being enabled in Build Settings; absent routes show a development placeholder but have not been exercised in PlayMode.
- The standalone Battle smoke covered stable board generation, invalid-swap rollback, a valid damaging match, mana, victory reward and dead-board recovery. Unity scene/UI/input/PlayMode behavior remains unverified.
- PvP and clan boss are intended as local mocks; authoritative matchmaking, guild state and anti-cheat require owned server specifications.

## Release limitations

- No production signing, store configuration, privacy review, age rating, consent flow or service terms review is complete.
- Device capture has no built APK and no connected authorized adb device. The expanded native/promo60/idle/raw script and durable ffmpeg/ffprobe binaries reached the explicit zero-authorized-device preflight result only; no actual recording exists. Screenshot automation is pending integration and no screenshots exist.
- Do not enable ads, analytics, push, login or purchases in Development builds without explicit product/security review.
- Do not ship generated media until visual, music and SFX provenance records are complete. The bundled Noto Sans KR font and OFL are recorded separately in `ASSET_PROVENANCE.md`.

See `BUILD_AND_RUN.md` for the commands to rerun after resolving the Unity license blocker and confirming the cached Android toolchain paths.
