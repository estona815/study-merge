# Ilarune Handoff

Last reconciled: 2026-07-15 (Asia/Seoul)  
Project root: `/Users/hantaeheuk/Documents/괄사/IlaruneUnity`

## Scope and non-negotiable boundary

This is a clean-room Unity 2022.3.62f3 portrait vertical slice inspired by generic Match-3 RPG, hero growth and floating-city hub loops. The supplied APK and JPG are audit/reference inputs only. Do not copy APK code, art, audio, tables, branding, endpoint, package identity, signing material or production service configuration into the project.

The intended offline loop is Hub -> stage battle -> Match-3/skill -> victory reward -> Hub -> building collection/upgrade -> persisted local snapshot. PvP and clan boss are local demo variants, not server-authoritative modes.

## Exact current status

| Area | Source present | Verification status |
|---|---|---|
| APK audit | Yes | ZIP integrity and SHA-256 passed; identity/dependency/catalog findings documented |
| Shared/Core | Yes | Full asmdef graph bundled-Roslyn compile and pure Core service harness passed |
| Hub/UI | Yes | Full graph compile passed, including UI tests; no Unity scene/PlayMode visual validation |
| Battle domain/runtime | Yes | Full graph compile, direct pure Battle NUnit 14/14, `BattleEngineSmoke`, auto-turn and reward bridge probes passed |
| Test source | Yes | 24 authored cases: 14 Battle, 4 Core, 4 safe-area resolutions, 2 PlayMode; Unity Test Runner not run |
| Editor automation | Yes | Full graph compile passed; wrappers reached Unity but could not execute entrypoints past licensing |
| Shell automation | Yes | `bash -n Scripts/*.sh` passed |
| Unity package import | Not completed | **Blocked by missing valid Editor license** |
| Generated scenes | No | Bootstrap wrapper rerun exited 1 on licensing; `Assets/Scenes` remains absent |
| Unity Test Runner XML | No | Test wrapper rerun exited 1 on its first EditMode invocation; no XML |
| Android player | No | Build wrapper rerun exited 1 on licensing; no APK or AAB |
| Device/emulator validation | No | No install/run; no authorized adb device was connected |
| Screenshots/video/profile | No | `Captures` is absent; `Artifacts` contains failure logs only; no deliverable was fabricated |

The post-integration compile used the exact Unity 2022.3.62f3 bundled Mono/Roslyn and followed asmdef dependency order for Shared -> Core/UI -> Hub/Battle -> Editor -> EditMode/PlayMode tests. The full graph completed without warnings/errors after the HubCoreBinding `Action` typing fix. This remains a reference-assembly compile, not a Unity importer or serialization result.

The repository contains 24 authored Unity cases: 14 Battle EditMode, 4 Core EditMode, 4 safe-area resolution cases and 2 PlayMode smoke cases. A direct non-Unity harness invoked the 14 pure Battle NUnit methods and reported 14/14 pass; this is not Unity Test Runner evidence. `BattleEngineSmoke` prints `Battle engine standalone smoke passed.` Direct probes also passed: `TryFindAvailableMove`/`TryAutoTurn` selected fixture move `(1,0)->(1,1)`, dealt 49 damage and left a stable board; `RewardService` added 321 soft currency and 45 XP to each in-team hero.

The three Unity wrappers were rerun with the verified Editor:

| Command | Exit | Durable evidence / absence |
|---|---:|---|
| `UNITY_BIN="$UNITY_BIN" ./Scripts/bootstrap_content.sh` | 1 | `Artifacts/BootstrapLogs/content-bootstrap.log`; no scenes |
| `UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh` | 1 | `Artifacts/TestResults/EditMode.log`; no XML, PlayMode not reached |
| `UNITY_BIN="$UNITY_BIN" ./Scripts/build_android.sh` | 1 | `Artifacts/BuildLogs/android-development.log`; no APK |

Each log ends with `No valid Unity Editor license found. Please activate your license.`

## Primary blocker

Verified Editor executable on this machine:

```text
/Users/hantaeheuk/Library/Caches/CodexUnity/2022.3.62f3/EditorExpanded/Unity.pkg.tmp/Payload/Unity/Unity.app/Contents/MacOS/Unity
```

`-version` returns `2022.3.62f3`. Batch mode starts the licensing client, then reports access token unavailable, no ULF license, no cached token and no valid Editor license. It stops before reliable project import.

Android Build Support is present in that same cached Editor: OpenJDK 11.0.14.1+1, SDK platform 36, Build Tools 34.0.0, platform-tools/adb 32.0.0, command-line tools 6.0 and NDK r23b (`23.1.7779620`). The hard build blocker is licensing, not absent Android modules. On Apple Silicon, r23b `ndk-build` needs an `arch -x86_64`/Rosetta wrapper.

## Important paths

### Inputs outside the project

- APK: `/Users/hantaeheuk/Downloads/Ilarune-test002.apk`
- Visual reference: `/Users/hantaeheuk/Downloads/IMG_4471.JPG`
- Original request: `/Users/hantaeheuk/.codex/attachments/e3d7b639-383e-4c16-a430-734602c2ae64/pasted-text.txt`

### Runtime source

- Contracts: `Assets/Ilarune/Shared/Contracts/GameContracts.cs`
- Core composition: `Assets/Ilarune/Core/Runtime/CoreRuntimeBootstrap.cs`
- Save/mock boundary: `Assets/Ilarune/Core/Persistence`, `Assets/Ilarune/Core/Backend`
- Hub entrypoint/binding: `Assets/Ilarune/Hub/Runtime/HubBootstrap.cs`, `HubCoreBinding.cs`
- Procedural hub/UI: `Assets/Ilarune/Hub/Runtime/ProceduralHubArt.cs`, `Assets/Ilarune/UI/Runtime/ProceduralUi.cs`
- Bundled Korean/Latin font: `Assets/Ilarune/UI/Resources/Fonts/NotoSansKR-Variable.ttf`, with `OFL.txt` beside it
- Battle engine: `Assets/Ilarune/Battle/Runtime/Match3Board.cs`, `BattleSession.cs`
- Battle scene entrypoint: `Assets/Ilarune/Battle/Runtime/BattleBootstrap.cs`

### Automation and tests

- Scene bootstrap: `Assets/Ilarune/Editor/IlaruneContentBootstrap.cs`
- Android builder: `Assets/Ilarune/Editor/IlaruneBuildAutomation.cs`
- Test wrapper: `Scripts/run_tests.sh`
- Android wrapper: `Scripts/build_android.sh`
- Device capture: `Scripts/capture_video.sh`
- Scene wrapper: `Scripts/bootstrap_content.sh`
- Standalone battle harness source: `Scripts/BattleEngineSmoke.cs`
- Unity tests: `Assets/Ilarune/Tests/EditMode`, `Assets/Ilarune/Tests/PlayMode`

### Truth sources

- Run/build details: `Docs/BUILD_AND_RUN.md`
- Current blockers: `Docs/KNOWN_LIMITATIONS.md`
- Audit/provenance: `Docs/APK_AUDIT.md`, `Docs/ASSET_PROVENANCE.md`
- Performance status: `Docs/PERFORMANCE_REPORT.md`
- Desired marketing sequence: `Docs/VIDEO_SHOTLIST.md`

### Bundled font provenance

The UI's primary font is the official Google Fonts Noto Sans KR variable TTF, locally named `NotoSansKR-Variable.ttf`. Source: [Google Fonts `ofl/notosanskr`](https://github.com/google/fonts/tree/main/ofl/notosanskr). Font SHA-256: `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`. Included SIL Open Font License 1.1 text SHA-256: `1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9`.

`ProceduralUi` prefers Resources key `Fonts/NotoSansKR-Variable` before its system fallback. This removes OS font availability as the primary Korean-glyph dependency; actual import, TMP generation/rendering, line breaking and overflow remain unverified until licensed Unity and device validation. Preserve `OFL.txt` and review its terms for release.

## Packages and generated state

`Packages/manifest.json` currently declares Addressables 1.22.3, Recorder 4.0.1, Test Framework 1.1.33, TextMeshPro 3.0.6 and UGUI. Package resolution has not run, so `Packages/packages-lock.json` is absent.

No `.meta` files or generated scenes exist yet because the project has not completed its first Unity import. Let Unity generate metadata; do not invent GUIDs manually. `IlaruneContentBootstrap` creates four scenes and Build Settings entries, but it does not build Addressables groups or import production art. `Artifacts/TestResults/EditMode.log`, `Artifacts/BootstrapLogs/content-bootstrap.log` and `Artifacts/BuildLogs/android-development.log` record licensing failures; they are not success artifacts.

## Runnable entrypoints after licensing

```bash
cd "/Users/hantaeheuk/Documents/괄사/IlaruneUnity"
export UNITY_BIN="/Applications/Unity/Hub/Editor/2022.3.62f3/Unity.app/Contents/MacOS/Unity"

# 1. Import and expose compile/package errors.
"$UNITY_BIN" -projectPath "$PWD" -batchmode -quit -logFile /tmp/ilarune-import.log

# 2. Generate Main plus three battle scenes and verify files/log marker.
UNITY_BIN="$UNITY_BIN" ./Scripts/bootstrap_content.sh

# 3. Unity EditMode + PlayMode suites.
UNITY_BIN="$UNITY_BIN" ./Scripts/run_tests.sh

# 4. Bootstrap again as needed and build the Development APK.
UNITY_BIN="$UNITY_BIN" ./Scripts/build_android.sh
```

Editor menus:

- **Ilarune > Bootstrap Project & Demo Content**
- **Ilarune > Build > Android Development APK**
- **Ilarune > Capture > Explain Marketing Capture Prerequisites** — explanatory failure only; creates no media.

Default Android package is `com.ilarune.demo`; default output is `Builds/Android/Ilarune-development.apk`. The builder uses portrait, IL2CPP, ARMv7+ARM64, API 26 minimum and Development/ads-off/IAP-off defines.

The current `capture_video.sh` defaults to a 30-second native-ratio promo recording, a native stream-copy delivery, a 1080x1920 H.264 60 fps promo, a separate 15-second native-ratio H.264 60 fps idle candidate, and preserved raw recordings. It requires a built/installed app, exactly one authorized device (or `ANDROID_SERIAL`), ffmpeg and ffprobe. It verifies metadata/duration and fully decodes each output before replacement. Idle-loop seamlessness still needs human visual QC; no screenshot wrapper is integrated yet.

Durable tool paths on this machine:

```text
ADB:      /Users/hantaeheuk/Library/Caches/CodexUnity/2022.3.62f3/EditorExpanded/Unity.pkg.tmp/Payload/Unity/Unity.app/Contents/PlaybackEngines/AndroidPlayer/SDK/platform-tools/adb
ffmpeg 7.1:   /Users/hantaeheuk/Library/Caches/CodexUnity/tools/ffmpeg-7.1-arm64/ffmpeg
ffprobe 8.1.2: /Users/hantaeheuk/Library/Caches/CodexUnity/tools/ffmpeg-8.1.2/ffprobe
```

Exact all-output capture command after the APK is built and an adb device is authorized:

```bash
ADB_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/2022.3.62f3/EditorExpanded/Unity.pkg.tmp/Payload/Unity/Unity.app/Contents/PlaybackEngines/AndroidPlayer/SDK/platform-tools/adb" \
FFMPEG_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/tools/ffmpeg-7.1-arm64/ffmpeg" \
FFPROBE_BIN="/Users/hantaeheuk/Library/Caches/CodexUnity/tools/ffmpeg-8.1.2/ffprobe" \
ILARUNE_APK_PATH="$PWD/Builds/Android/Ilarune-development.apk" \
ILARUNE_CAPTURE_MODE=all \
./Scripts/capture_video.sh
```

Dependency preflight with these binaries reached the honest `found 0` authorized-device exit. No media was created.

Screenshot command: **PENDING INTEGRATION**. No screenshot wrapper is currently present under `Scripts/`; do not fabricate the requested four-resolution and battle screenshot set.

## File ownership for parallel continuation

Use these boundaries to avoid collisions:

| Owner | Paths |
|---|---|
| Core/architecture | `Assets/Ilarune/Core/**` |
| Hub/UI/visual | `Assets/Ilarune/Hub/**`, `Assets/Ilarune/UI/**` |
| Battle/release | `Assets/Ilarune/Battle/**`, `Assets/Ilarune/Tests/**`, `Assets/Ilarune/Editor/**`, `Scripts/**` |
| Integration/contracts | `Assets/Ilarune/Shared/**`, `Packages/**`, `ProjectSettings/**` |
| Documentation/release truth | `Docs/**`, `README.md`, `CHANGELOG.md` |
| Generated only | `Assets/Scenes/**`, `Artifacts/**`, `Builds/**`, `Captures/**` |

Coordinate before changing Shared contracts, asmdef dependencies, package versions or ProjectSettings. Never treat generated output as source truth.

## Next tasks, in order

1. Activate the exact Unity Editor license, then run a plain batch import. Fix actual importer/package/asmdef errors before any feature work.
2. Reconcile `Packages/packages-lock.json` and generated `.meta` files from the licensed import; review, do not fabricate.
3. Run `Scripts/bootstrap_content.sh`. Confirm all four scenes exist, open `Main`, and inspect Console for repeating exceptions.
4. Run `Scripts/run_tests.sh`. Confirm all 24 authored cases are discovered, preserve XML/logs and fix any failures.
5. Manually verify Hub idle motion, building focus/back/action, lobby-to-stage routing, auto/speed controls, battle swap/cascade/skill/victory/reward, lobby return and persistence after restart. Visually validate the bundled Noto Sans KR TMP rendering, line breaking and overflow at every target resolution.
6. Run `Scripts/build_android.sh`. Confirm non-empty APK, inspect package/version/API/ABI/orientation with Android tools, then install via adb.
7. Run the full flow on device/emulator and review logcat. Record device/API/GPU and any errors.
8. Capture the four lobby resolutions plus battle screenshot. Run the native/promo/idle capture pipeline with the durable adb/ffmpeg/ffprobe overrides; then visually review the full files and idle seam even after automated decode checks.
9. Profile Low/Medium/High on Android and replace estimates in `PERFORMANCE_REPORT.md` with measured evidence.
10. Update this handoff, README, changelog and limitations with exact commands, hashes and artifact paths. Only then claim build/test/video completion.

## Paste-ready Korean continuation prompt

```text
/Users/hantaeheuk/Documents/괄사/IlaruneUnity 작업을 이어서 진행해줘.

먼저 README.md, Docs/HANDOFF.md, Docs/BUILD_AND_RUN.md, Docs/KNOWN_LIMITATIONS.md, AGENTS.md를 읽고 현재 상태를 그대로 인계해. 전체 Shared/Core/UI/Hub/Battle/Editor/EditMode/PlayMode asmdef 그래프는 Unity 번들 Roslyn 정적 컴파일을 통과했고, Unity 외부 직접 실행에서는 순수 Battle NUnit 메서드 14/14와 BattleEngineSmoke가 통과했어. Unity 테스트 소스는 총 24케이스(배틀 14, Core 4, 안전영역 해상도 4, PlayMode 2)지만 Unity Test Runner는 실행되지 않았어. 유효한 Unity Editor 라이선스가 없어 bootstrap/test/build 래퍼가 모두 exit 1로 끝났고 프로젝트 import, 씬 생성, Test Runner XML, Android APK, 설치, 스크린샷, MP4 캡처는 아직 완료하지 못했어. APK/MP4/Unity 테스트 성공을 추측하거나 조작하지 마.

우선순위:
1) 정확한 Unity 2022.3.62f3 라이선스를 활성화한 뒤 plain batch import를 실행하고 실제 compile/package 오류를 수정.
2) Scripts/bootstrap_content.sh로 4개 씬을 생성하고 Main Play Mode/Console 확인.
3) Scripts/run_tests.sh로 총 24케이스 EditMode+PlayMode 실행, XML/로그 근거 보존.
4) Scripts/build_android.sh로 Development APK 실제 빌드, adb 설치 및 lobby→battle→reward→lobby→save 흐름 검증.
5) HANDOFF에 기록된 실제 스크린샷 래퍼(현재 통합 대기 표시)와 Scripts/capture_video.sh를 사용해 요청 해상도 이미지 및 native/9:16 60fps/idle-loop 영상을 실제로 캡처하고 ffprobe+전체 재생 검증.
6) 실행한 명령, 결과, 산출물 해시/경로, 남은 제한을 Docs/HANDOFF.md와 CHANGELOG.md에 즉시 반영.

APK와 JPG는 읽기 전용 참고다. APK 에셋/코드/원격 endpoint/서명/비밀키를 재사용하지 마. 합리적인 기본값으로 계속 진행하되, 확인하지 못한 항목은 반드시 미검증으로 표시해.
```
