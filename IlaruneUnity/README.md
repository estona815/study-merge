# Ilarune Clean-room Vertical Slice

Unity 2022.3.62f3 portrait mobile fantasy demo rebuilt from a read-only APK behavior audit. It uses independently authored procedural visuals, deterministic Match-3 logic, local mock services and JSON/PlayerPrefs persistence. No audited APK art, audio, code, catalog endpoint, credentials or signing material is included.

## Current status

The complete Shared/Core/UI/Hub/Battle/Editor/EditMode/PlayMode asmdef graph passes an asmdef-faithful compile with the exact Editor's bundled Roslyn. A direct non-Unity harness passes all 14 pure Battle NUnit methods, the standalone `BattleEngineSmoke` passes, and pure Core probes pass. The repository authors 24 Unity test cases: 14 Battle EditMode, 4 Core EditMode, 4 safe-area resolution cases and 2 PlayMode smoke cases. Unity Test Runner has **not** run because the available Editor lacks a valid license. Consequently generated scenes, Test Runner XML, Android APK/AAB, screenshots and videos do not exist yet.

See [Docs/HANDOFF.md](Docs/HANDOFF.md) for exact status and the continuation checklist.

## Source layout

- `Assets/Ilarune/Core`: local session, save/mock backend, rewards, buildings, navigation and quality policy.
- `Assets/Ilarune/Hub`: procedural 2.5D floating-city lobby, camera, buildings and ambient motion.
- `Assets/Ilarune/UI`: procedural HUD, safe area and world-tracked labels, with the official OFL-licensed Noto Sans KR variable font bundled for deterministic Korean/Latin source coverage.
- `Assets/Ilarune/Battle`: deterministic board/combat domain and runtime battle presentation.
- `Assets/Ilarune/Editor`: scene bootstrap and Android Development build entrypoints.
- `Assets/Ilarune/Tests`: 22 authored EditMode cases and 2 authored PlayMode smoke cases.
- `Scripts`: scene bootstrap, Unity test, Android build and validated adb/ffmpeg/ffprobe capture wrappers.

## First run after licensing

```bash
cd "/Users/hantaeheuk/Documents/괄사/IlaruneUnity"
export UNITY_BIN="/Applications/Unity/Hub/Editor/2022.3.62f3/Unity.app/Contents/MacOS/Unity"

"$UNITY_BIN" -projectPath "$PWD" -batchmode -quit -logFile /tmp/ilarune-import.log
UNITY_BIN="$UNITY_BIN" ./Scripts/bootstrap_content.sh
UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh
UNITY_BIN="$UNITY_BIN" ./Scripts/build_android.sh
```

In the Editor, run **Ilarune > Bootstrap Project & Demo Content** before entering Play Mode. The Android builder also invokes this bootstrap automatically.

Detailed environment, overrides and capture commands are in [Docs/BUILD_AND_RUN.md](Docs/BUILD_AND_RUN.md). Audit and provenance boundaries are in [Docs/APK_AUDIT.md](Docs/APK_AUDIT.md) and [Docs/ASSET_PROVENANCE.md](Docs/ASSET_PROVENANCE.md).
