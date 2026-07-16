# Architecture

## Module boundaries

| Assembly | Responsibility | May depend on |
|---|---|---|
| `Ilarune.Shared` | Cross-feature contracts, snapshot DTOs, scene IDs | .NET only |
| `Ilarune.Core` | Session, persistence, local backend, rewards, buildings, navigation, quality, local asset boundary | `Ilarune.Shared`, Unity runtime |
| `Ilarune.UI` | Responsive HUD, panels, safe area and reusable controls | UGUI, TextMeshPro |
| `Ilarune.Hub` | Lobby world and building presentation | Core, Shared, UI, UGUI |
| `Ilarune.Battle` | Board domain, combat domain and battle presentation | Core, Shared, UI, UGUI, TextMeshPro |
| `Ilarune.Editor` | Deterministic scene bootstrap and Android build commands | Battle, Core, Hub, Editor only |
| `Ilarune.Battle.EditModeTests` | 22 authored EditMode cases across Battle, Core and UI safe-area behavior | Battle, Core, Shared, UI, UGUI, TextMeshPro, test framework |
| `Ilarune.Battle.PlayModeTests` | 2 authored Hub/Battle PlayMode smoke cases | Battle, Hub, UI, UGUI, TextMeshPro, test framework |

Runtime code must not reference `Ilarune.Editor` or tests. Hub and Battle communicate through Core/Shared state rather than referencing each other's presentation classes.

Both test assemblies are included in the successful asmdef-faithful bundled-Roslyn compile. The 24 authored cases have not run through Unity Test Runner because licensing stops the Editor before import.

## Core composition

`CoreRuntimeBootstrap` is created before the first scene and survives scene changes. It composes:

- `GameContentConfig.CreateLocalDemo()` for independently authored demo definitions.
- `PlayerPrefsJsonSnapshotStore` for JSON persistence.
- `MockBackendAdapter` as the offline implementation of `IBackendAdapter`.
- `GameSessionService` as the single mutable snapshot owner.
- `RewardService` for saturating currency/experience grants and hero level-up.
- `BuildingService` for time-based production, collection and upgrades.
- `UnitySceneNavigator` as the `ISceneNavigator` implementation.
- `MobileQualityService` for Low/Medium/High budgets.
- `LocalResourcesAssetProvider` as the offline content boundary.

Consumers should wait for `CoreRuntimeBootstrap.IsReady` or subscribe to `Ready` before reading `Session.Snapshot`.

`HubCoreBinding` follows that readiness boundary, mirrors profile/resource/building state into the procedural HUD, maps only four explicit visual IDs into `BuildingService`, and routes battle destinations through the scene navigator. Unknown or unavailable destinations produce visible development placeholders. `BattleBootstrap` forwards the one-time victory reward into Core, requests a save, and provides retry, auto-turn, speed and Hub-return controls.

## State flow

```text
UI / Battle / Hub action
        |
        v
domain service -> GameSessionService.Mutate -> GameSnapshot
        |                         |
        |                         +-> SnapshotChanged
        v
RewardService / BuildingService
        |
        v
GameSessionService.SaveAsync
        |
        v
IBackendAdapter -> MockBackendAdapter -> JSON -> PlayerPrefs
```

The snapshot schema is explicitly versioned (`schemaVersion=1`). `SnapshotUtility.Normalize` repairs null collections and clamps invalid negative values. `SnapshotUtility.Clone` prevents mock backend callers from sharing the store's mutable reference.

## Data model

Shared persisted state:

- Player name, level, currencies, energy and selected stage.
- Hero ID, level, experience and team membership.
- Building ID, level, stored production and production start time.

Core static demo definitions:

- Hero display/power/mana configuration.
- Building upgrade, capacity and production configuration.
- Stage wave and reward configuration.

Definitions and state are separate so future owned JSON or ScriptableObjects can replace demo definitions without changing persistence contracts.

## Scene navigation

`UnitySceneNavigator` keeps an in-memory back stack, ignores duplicate navigation and checks `Application.CanStreamedLevelBeLoaded` before loading. Its delegate-injection constructor allows EditMode tests without opening a real scene. The default fallback is `SceneIds.Main`.

The current implementation targets scenes in Build Settings. A future Addressables scene navigator should be a separate adapter and must handle asynchronous failures, handle release and offline fallback; it must not use the audited catalog.

## Content loading

`IAssetProvider` defines an asynchronous, cancellation-aware load boundary. `LocalResourcesAssetProvider` resolves only clean project-owned `Resources` keys. Addressables 1.22.3 is declared, but package resolution and any project-owned groups/catalog remain absent and unverified. The current Editor bootstrap creates scenes only.

## Quality policy

| Tier | FPS | NPC | Airships | Parallax layers | Particle multiplier | High-cost post FX |
|---|---:|---:|---:|---:|---:|---|
| Low | 30 | 4 | 1 | 2 | 0.50 | Off |
| Medium | 60 | 8 | 2 | 3 | 0.75 | Off |
| High | 60 | 12 | 3 | 4 | 1.00 | On |

The service applies a matching Unity Quality level when one exists, disables v-sync for deterministic mobile frame caps and persists only the tier integer. Presentation systems are responsible for consuming the budgets; merely selecting a tier does not cull objects automatically.

## Threading and lifecycle

- Unity APIs and mutation calls are expected on the main thread.
- Backend and asset APIs accept cancellation tokens.
- Local persistence is synchronous inside the mock adapter; application pause/quit requests a save.
- Production network adapters must return immutable/copy-isolated results and marshal Unity-facing events to the main thread.

## Failure policy

- Invalid local JSON is ignored and replaced by a demo snapshot on the next load.
- Unknown building IDs throw immediately to expose content wiring errors.
- Missing local assets throw with their key.
- Missing scenes log a warning and do not alter navigation history.
- Runtime initialization captures and logs `InitializationError`; UI should show a recoverable error state rather than a dead screen.
