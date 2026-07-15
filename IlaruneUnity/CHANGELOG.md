# Changelog

All notable changes to the clean-room Ilarune vertical slice are recorded here.

## Unreleased - 2026-07-15

### Added

- Unity 2022.3.62f3 project scaffold with separated Shared, Core, UI, Hub, Battle, Editor and test assemblies.
- Local JSON/PlayerPrefs snapshot persistence, mock backend, session, rewards, building production/upgrade, scene navigation and mobile quality services.
- Procedural portrait floating-city Hub source with interactive buildings, camera focus, clouds, airships, NPC pooling, parallax and responsive HUD source.
- Hub-to-Core binding for profile/resources/buildings, safe visual-to-domain ID mapping, collect/upgrade actions, battle routes and explicit development placeholders.
- Deterministic Match-3 board and battle-session source covering swap rollback, matches, cascades, dead-board recovery, mana, skills, waves, enemy turns, victory and rewards.
- Battle runtime controls for auto-turn, speed cycling, retry and Hub return, plus a Core reward/save bridge after victory.
- Editor scene bootstrap and Android Development APK automation.
- Hardened shell wrappers for scene bootstrap, Unity tests, Android build and adb/ffmpeg/ffprobe capture; wrappers reject stale/empty outputs and missing success markers.
- Twenty-four authored Unity test cases: 14 Battle EditMode, 4 Core EditMode, 4 safe-area resolution cases and 2 PlayMode Hub/Battle smoke cases.
- Capture pipeline for native portrait, 1080x1920 60 fps promo, 60 fps idle-loop candidate and preserved device raw recordings, with ffprobe metadata checks and full decode validation.
- Official Google Fonts Noto Sans KR variable TTF and its SIL Open Font License 1.1 text, with source and SHA-256 provenance recorded for the UI's primary Korean/Latin font path.
- APK audit, asset inventory/provenance, architecture, rebuild, build, performance, capture, limitations and durable handoff documentation.

### Audit findings

- Verified the supplied APK package as `com.jbenterprise.skygalleon.puzzle`, version `1.00.12101` (`30001`), rather than the preliminary package stated in the request.
- Confirmed Unity 2022.3.62f3 IL2CPP, portrait orientation, API 24/36, ARM64/ARMv7, Addressables 1.22.3 and the documented middleware inventory.
- Kept all audited media, remote bundles/endpoints, service configuration and signing material out of the clean project.

### Validation completed

- APK ZIP integrity and SHA-256 verification passed.
- Shared/Core standalone bundled-Roslyn compile passed with `-warn:4`; the pure Core service harness passed.
- Final Shared/Core/UI/Hub/Battle/Editor/EditMode/PlayMode assemblies passed an asmdef-faithful Unity 2022.3 bundled-Roslyn compile after integration.
- A direct non-Unity harness invoked the 14 pure Battle NUnit methods and reported 14/14 pass. Standalone `BattleEngineSmoke` passed; direct auto-turn and reward-service probes also passed on their fixed fixtures.
- `bash -n Scripts/*.sh` passed.
- Capture dependency/device preflight reached the explicit zero-authorized-device failure without creating media.

These checks are not Unity importer, Test Runner, PlayMode, Android build or device results.

### Blocked / absent

- `bootstrap_content.sh`, `run_tests.sh` and `build_android.sh` were each rerun and each exited 1 with `No valid Unity Editor license found. Please activate your license.`
- Licensing-failure logs exist under `Artifacts`; no successful Test Runner XML or bootstrap/build success marker exists. The 24 authored cases must not be reported as Unity Test Runner passes.
- Generated scenes, package lock/meta import results, Android APK/AAB, screenshots, profiler captures and MP4 files are absent.
- Device capture is additionally blocked by the lack of a connected authorized adb device and a built APK.
