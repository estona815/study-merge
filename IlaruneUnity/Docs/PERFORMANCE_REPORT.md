# Performance Report

## Status

No runtime profile has been captured. Unity batch mode is blocked by a missing license; although the cached Android toolchain is present, no player can be built yet. FPS, frame time, memory, GC allocation, thermal behavior and scene-load timing are therefore **unverified**. This document records budgets and the exact measurements still required; it is not a benchmark result.

## Targets

| Scenario | Target | Measurement required |
|---|---|---|
| Medium Android lobby | 60 FPS, 16.7 ms frame | 60-second device profile after warm-up |
| Low tier lobby | Stable 30 FPS, 33.3 ms frame | 60-second device profile with reduced budgets |
| Battle interaction | Input-to-visible response under 100 ms | Input marker to rendered frame |
| Lobby entry | No long main-thread stall | Scene/load timeline and longest frame |
| Scene transition | No visible freeze outside transition | Async-load timeline and frame pacing |
| Managed allocation | No repeating per-frame GC allocations in idle lobby | Unity Profiler GC Alloc column |

## Implemented static quality budgets

| Tier | FPS cap | NPC | Airships | Parallax | Particles | Post FX |
|---|---:|---:|---:|---:|---:|---|
| Low | 30 | 4 | 1 | 2 layers | 50% | Expensive effects off |
| Medium | 60 | 8 | 2 | 3 layers | 75% | Expensive effects off |
| High | 60 | 12 | 3 | 4 layers | 100% | Enabled where implemented |

`MobileQualityService` publishes these budgets and applies a frame cap. Hub/Battle renderers must explicitly consume the budgets; this static policy does not prove that particles, NPCs or post effects are actually reduced.

## Static risk review

- Core production and reward math runs only on interaction/status queries, not every frame.
- Local saves serialize the complete snapshot and call `PlayerPrefs.Save`; invoke on meaningful checkpoints, pause and quit, not per frame.
- `LocalResourcesAssetProvider` is async from the caller's perspective but still uses Unity Resources and has no unload policy. Replace large content with owned Addressables groups after validation.
- Scene navigation currently uses `LoadSceneAsync`, but no progress UI or unload instrumentation is implemented in Core.
- 2.5D motion systems should use pooled objects and central tickers; independent `Update` methods for every NPC/cloud remain a likely CPU cost.
- Sprite Atlas, texture compression, shader variants, overdraw and Canvas rebuild costs cannot be assessed until generated content exists.

## Required device matrix

At minimum capture Low and Medium on one lower-mid Android device and High on one upper-mid device. For each requested resolution (720x1600, 1080x1920, 1080x2400, 1440x3200), record:

- median, 95th and 99th percentile CPU/GPU frame time;
- total and graphics memory;
- GC allocations and collection count;
- main-thread maximum frame;
- lobby entry and battle transition time;
- thermal state after five minutes;
- screenshot confirming safe-area and text layout.

## Pass criteria

- No repeatable frame over 100 ms during idle lobby.
- 95th percentile frame time within the selected tier budget after warm-up.
- No sustained memory growth across five lobby/battle cycles.
- No per-frame managed allocation in an untouched lobby.
- Low tier visibly reduces work and maintains stable 30 FPS.

Fill this report with profiler captures and device identifiers before making any performance-complete claim.
