# Clean-room Rebuild Strategy

## Decision

Rebuild the vertical slice from source in Unity 2022.3 LTS. Do not patch, resign or ship the supplied APK. The APK is evidence for feature boundaries only.

## First playable

The smallest complete loop is:

1. Start in an offline portrait lobby.
2. Select a stage and confirm a local hero team.
3. Enter a deterministic Match-3 battle.
4. Charge and use a hero skill.
5. Win, grant a clean-room reward and return to the lobby.
6. Spend or collect currency at a building.
7. Save the changed snapshot as local JSON in PlayerPrefs.

PvP and clan boss remain local simulations until an independently specified backend exists.

## Architecture sequence

### P0: dependable offline shell

- Pin Unity `2022.3.62f3` and keep the declared package versions.
- Keep `Ilarune.Shared` contracts dependency-free.
- Use `MockBackendAdapter` and `PlayerPrefsJsonSnapshotStore`; require no key, account or network.
- Generate clean `Main`, `Battle_Stage`, `Battle_PvP` and `Battle_ClanBoss` scenes through project tooling.
- Establish EditMode tests before Android build work.

### P1: readable hub

- Use an original 2.5D layered city rather than reconstructing APK imagery.
- Treat 1080x2400 as the authoring reference and validate all requested portrait sizes.
- Give every visible action an actual hit target and route unfinished actions to explicit development placeholders.
- Drive NPC, airship, parallax and particle counts from the Core quality profile.

### P2: battle loop

- Keep board rules and combat resolution in pure C#.
- Make scene/presentation code consume board events rather than own game rules.
- Use independently authored hero, stage, reward and board configuration.
- Persist the result through `GameSessionService`.

### P3: content and capture

- Add local building, research, dungeon, shop, inbox, PvP and clan-boss mock routes.
- Run EditMode/PlayMode tests, then a Development IL2CPP Android build.
- Capture real runtime output only after the build is installable and free of repeating errors.

## Addressables boundary

The audited player used Addressables `1.22.3` and an external HTTP catalog. The clean project also declares `1.22.3`, but must create its own project-owned groups and catalog after licensed package import. It must never import the audited catalog, bundle hash, endpoint or cached content.

Core exposes `IAssetProvider`; local demo mode uses `LocalResourcesAssetProvider`. A future `AddressablesAssetProvider` may be added only for project-owned groups and must support an offline fallback. The current bootstrap creates scenes and Build Settings only; no Addressables group automation exists. Groups/settings are not verified until Unity imports the project and an owned Addressables content build succeeds.

## Backend boundary

`IBackendAdapter` is the only persistence-facing contract. Production HIVE, Firebase, Socket.IO, advertising and billing SDKs are deliberately absent. Introducing any of them requires:

- an owned API/schema specification;
- test/staging credentials outside source control;
- privacy and consent review;
- failure/offline behavior;
- separate Development Build switches;
- platform-store compliance review.

## Exit gates

- Unity imports without compile errors.
- Core EditMode save/load, reward, building and scene tests pass.
- Battle EditMode and PlayMode smoke tests pass.
- Main and battle scenes are present in Build Settings or deliberately loaded from the clean catalog.
- Android Development APK builds, installs and completes the first-playable loop offline.
- Captures are decoded and visually reviewed; no placeholder/debug UI is visible.

At the time of this document, the source architecture is implemented and the cached Android toolchain is present, but the Unity license blocker prevents project import and any claim that these runtime gates passed.
