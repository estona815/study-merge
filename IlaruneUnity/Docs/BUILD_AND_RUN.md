# Build and Run

Status date: 2026-07-15.

## Current gate

The exact Unity `2022.3.62f3` Editor binary and its Android toolchain are present, but the Editor has no valid license. Batch mode stops before project import with access-token/ULF/cache-token errors. The scene-bootstrap, test and Android-build wrappers were invoked again; each exited 1 with `No valid Unity Editor license found. Please activate your license.` before producing scenes, Test Runner XML or an APK. Package resolution, installation and runtime capture have not completed.

The full Shared/Core/UI/Hub/Battle/Editor/EditMode/PlayMode asmdef graph passed an asmdef-faithful compile with this Editor's bundled Roslyn. A direct non-Unity harness reported 14/14 for the pure Battle NUnit methods; standalone `BattleEngineSmoke` and pure Core/auto-turn/reward probes also passed. These checks are useful evidence, but they do not replace a licensed Unity import, serialization or Unity Test Runner execution.

## Requirements

- Unity Editor `2022.3.62f3` with a valid license.
- Matching Android Build Support, SDK, NDK and OpenJDK modules.
- `adb` plus one authorized device/emulator for installation and capture.
- `ffmpeg` and `ffprobe` for the current device-capture script.
- No API key, production login, ad account or payment configuration is required for local demo mode.

## Verified cached toolchain

The machine-specific cached Editor reports `2022.3.62f3` and contains:

- OpenJDK `11.0.14.1+1`;
- SDK platform 36;
- Build Tools `34.0.0`, including `aapt2`;
- Platform Tools / `adb` `32.0.0`;
- Android command-line tools `6.0`;
- NDK r23b, package revision `23.1.7779620`.

On Apple Silicon, the official r23b `ndk-build` launcher needs Rosetta via an `arch -x86_64` wrapper; the bundled Clang is universal. Cached paths are transient and must not be committed into build scripts.

## Select the Editor

Prefer the normal Unity Hub installation. The current cache path is a fallback for this machine:

```bash
cd "/Users/hantaeheuk/Documents/괄사/IlaruneUnity"

export UNITY_BIN="/Applications/Unity/Hub/Editor/2022.3.62f3/Unity.app/Contents/MacOS/Unity"

# Machine-specific fallback used during this audit:
# export UNITY_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/2022.3.62f3/EditorExpanded/Unity.pkg.tmp/Payload/Unity/Unity.app/Contents/MacOS/Unity"

"$UNITY_BIN" -version
```

`Scripts/unity_common.sh` also accepts `UNITY_EDITOR` and checks the standard Hub path automatically.

## First licensed import and bootstrap

After activating Unity, perform a plain import first:

```bash
"$UNITY_BIN" -projectPath "$PWD" -batchmode -quit -logFile /tmp/ilarune-import.log
```

Review the exit code and log. Then create and verify the demo scenes with the hardened wrapper:

```bash
UNITY_BIN="$UNITY_BIN" ./Scripts/bootstrap_content.sh
```

It removes the old log, calls the entrypoint, requires all four non-empty scene files and requires the bootstrap success marker. Equivalent manual choices are:

- Editor menu: **Ilarune > Bootstrap Project & Demo Content**; or
- batch entrypoint:

```bash
"$UNITY_BIN" -projectPath "$PWD" -batchmode -quit \
  -executeMethod Ilarune.Editor.IlaruneContentBootstrap.BootstrapProject \
  -logFile /tmp/ilarune-bootstrap.log
```

The bootstrap is expected to create and enable exactly these scenes:

- `Assets/Scenes/Main.unity`
- `Assets/Scenes/Battle_Stage.unity`
- `Assets/Scenes/Battle_PvP.unity`
- `Assets/Scenes/Battle_ClanBoss.unity`

They are currently absent. The wrapper was rerun with the verified Editor, exited 1 on the license check and left only `Artifacts/BootstrapLogs/content-bootstrap.log`. The bootstrap does not create Addressables groups or production art assets.

## Unity tests

The repository authors 24 Unity test cases:

- 14 Battle EditMode cases across board and battle-session fixtures;
- 4 Core EditMode service cases;
- 4 parameterized EditMode safe-area resolution cases;
- 2 PlayMode smoke cases for Battle bootstrap and Hub UI.

The full test assemblies compile in the asmdef-faithful bundled-Roslyn check. Separately, a direct non-Unity harness invoked the 14 pure Battle NUnit methods and reported 14/14 pass. That result is not Unity Test Runner evidence.

The repository script runs EditMode and PlayMode tests, removes stale XML/logs first, rejects an empty result and requires evidence that at least one test was discovered:

```bash
UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh
```

Useful overrides:

```bash
ILARUNE_TEST_PLATFORM=EditMode UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh
ILARUNE_TEST_PLATFORM=PlayMode UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh
ILARUNE_TEST_FILTER=Ilarune.Battle UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh
```

Default output is `Artifacts/TestResults/{EditMode,PlayMode}.{xml,log}`. Validate process status, logs and NUnit XML before claiming a pass. The wrapper was rerun, exited 1 during its first EditMode Unity invocation with the exact license error, and therefore did not advance to PlayMode. A licensing-failure `EditMode.log` exists; no Unity XML result exists.

## Android Development APK

Primary command:

```bash
UNITY_BIN="$UNITY_BIN" ./Scripts/build_android.sh
```

This calls:

```text
Ilarune.Editor.IlaruneBuildAutomation.BuildAndroidDevelopment
```

The builder bootstraps scenes, switches to Android and configures:

- package `com.ilarune.demo` unless `ILARUNE_APPLICATION_ID` overrides it;
- version `0.1.0-demo`, code 1 unless overridden;
- portrait orientation;
- IL2CPP;
- ARMv7 and ARM64;
- minimum Android API 26;
- Development Build;
- `ILARUNE_DEMO`, `ILARUNE_DISABLE_ADS`, `ILARUNE_DISABLE_IAP` defines.

Default output is `Builds/Android/Ilarune-development.apk`; default log is `Artifacts/BuildLogs/android-development.log`. The script rejects a non-APK extension, stale output, missing log success marker, empty file and invalid APK ZIP. The wrapper was rerun and exited 1 with the exact license error. The current log contains only that licensing failure; no APK exists.

Do not reuse the audited APK's signature or any production keystore.

## Install and capture

After a successful build, install and inspect logs:

```bash
adb install -r Builds/Android/Ilarune-development.apk
adb logcat -c
# Complete the lobby -> battle -> reward -> lobby smoke flow.
adb logcat -d | rg -i "Unity|AndroidRuntime|FATAL EXCEPTION|Ilarune"
```

The current capture script requires exactly one authorized device unless `ANDROID_SERIAL` is set. Use the verified cached tools on this machine:

```bash
ADB_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/2022.3.62f3/EditorExpanded/Unity.pkg.tmp/Payload/Unity/Unity.app/Contents/PlaybackEngines/AndroidPlayer/SDK/platform-tools/adb" \
FFMPEG_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/tools/ffmpeg-7.1-arm64/ffmpeg" \
FFPROBE_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/tools/ffmpeg-8.1.2/ffprobe" \
ILARUNE_APK_PATH="$PWD/Builds/Android/Ilarune-development.apk" \
ILARUNE_CAPTURE_MODE=all \
./Scripts/capture_video.sh
```

Default `all` mode creates:

- `Captures/Ilarune_Hub_Native.mp4`: native portrait ratio, source frame rate, 30-second default promo segment;
- `Captures/Ilarune_Promo_9x16_60fps.mp4`: 1080x1920 H.264, 60 fps, 30 seconds by default;
- `Captures/Ilarune_Hub_IdleLoop.mp4`: native portrait ratio, H.264 60 fps, 15 seconds by default;
- `Captures/Raw/*.mp4`: unmodified device recordings, retained by default.

The script validates H.264, portrait geometry, approximate duration and required delivery frame rate, then fully decodes each file with ffmpeg before moving it into place. It supports `all|promo|idle`; promo is constrained to 30-60 seconds and idle to 12-15 seconds. Seamless idle continuity still requires human visual QC. Screenshot capture remains separate.

Tool preflight succeeds up to adb device selection and then honestly reports zero authorized devices. No APK or device was available, so no video was created.

Screenshot command: **PENDING INTEGRATION**. No screenshot wrapper is currently present under `Scripts/`; do not substitute an invented command or claim the requested resolution set exists.

The Editor menu **Ilarune > Capture > Explain Marketing Capture Prerequisites** intentionally throws an explanatory build exception and creates no media.

## Active blocker

The verified Editor licensing client reports:

- access token unavailable;
- no ULF license found;
- token not found in cache;
- no valid Unity Editor license.

Activate through Unity Hub or use the project owner's approved CI licensing mechanism. Then follow the ordered checklist in `HANDOFF.md`.
