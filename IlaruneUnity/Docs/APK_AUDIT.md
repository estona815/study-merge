# APK Audit

Audit date: 2026-07-15 (Asia/Seoul)  
Input: `/Users/hantaeheuk/Downloads/Ilarune-test002.apk`  
Scope: read-only structural inspection; no production endpoint was contacted and no APK asset was copied into the Unity project.

## Identity and integrity

| Field | Directly observed value |
|---|---|
| File size | 277,977,231 bytes |
| SHA-256 | `2aaa5417e4060e6b98974f7fcafd38cfb899467f2aafe3cc98c3215624679304` |
| ZIP entries | 1,492 |
| Uncompressed ZIP payload | 450,729,909 bytes |
| Package | `com.jbenterprise.skygalleon.puzzle` |
| Version name / code | `1.00.12101` / `30001` |
| Signature | APK Signature Scheme v2; certificate SHA-256 `afe39a980e3a0917e87ff9a3cc6950239f4effabf989665ee2c0a1ffb65ac70b` |

The prompt's preliminary package value, `com.utoplanet.skygalleon.puzzle`, is **not** the package encoded in this APK. The value above was independently parsed from the binary Android manifest.

## Android runtime

| Field | Directly observed value |
|---|---|
| Minimum API | 24 |
| Target / compile API | 36 / 36 |
| Main activity | `com.hive.HiveUnityPlayerActivity` |
| Main orientation | `screenOrientation=1`, Android portrait |
| Native ABIs | `arm64-v8a`, `armeabi-v7a` |
| Rendering feature | OpenGL ES 3.0 declared; Vulkan version feature is optional |
| Cleartext traffic | Allowed by the audited manifest |
| Permissions | 22 total, including Internet, network state, notifications, billing, advertising ID, wake lock and Firebase messaging |

The clean-room demo does not inherit the audited permissions wholesale. Billing, advertising IDs, push notifications and cleartext networking are unnecessary for local demo mode.

## Unity player and code backend

- `libunity.so` and `data.unity3d` both expose Unity `2022.3.62f3`; the native player also exposes revision `96770f904ca7`.
- Both ABIs contain `libil2cpp.so`, `libunity.so` and `libmain.so`; IL2CPP is directly confirmed.
- `global-metadata.dat` is present, as expected for an IL2CPP player.
- `ScriptingAssemblies.json` was used only as an assembly inventory. No attempt was made to reconstruct or copy game code.

## Scenes

Two scene groups are visible and must not be conflated:

1. Unity BuildSettings strings expose three built-in bootstrap scenes:
   - `Assets/Scenes/Start.unity`
   - `Assets/Scenes/Intro.unity`
   - `Assets/Scenes/Restart.unity`
2. The Addressables catalog exposes four remote scene asset addresses:
   - `Assets/AddressableAssetBundles/RemoteAssetsGroups/Scenes/Main.unity`
   - `Assets/AddressableAssetBundles/RemoteAssetsGroups/Scenes/Battle_Stage.unity`
   - `Assets/AddressableAssetBundles/RemoteAssetsGroups/Scenes/Battle_PvP.unity`
   - `Assets/AddressableAssetBundles/RemoteAssetsGroups/Scenes/Battle_ClanBoss.unity`

The catalog names confirm intended scene identifiers, not that the remote scene payloads are available offline or legally reusable.

## Addressables

| Field | Directly observed value |
|---|---|
| Runtime version | `1.22.3` |
| Catalog locator | `AddressablesMainContentCatalog` |
| Internal IDs | 2,006 |
| Local APK bundles | 2 duplicate-asset-isolation bundles, approximately 66.4 MB and 4.0 MB |
| Remote bundle IDs | 19 HTTP bundle locations |
| Catalog update on start | Disabled |
| Local catalog bundled | False |

The settings contain a cleartext, numeric-host remote catalog endpoint. It is intentionally omitted here and was neither contacted nor copied. The clean project now declares Addressables `1.22.3`, matching the observed runtime package version, but has no imported package lock, owned groups or generated catalog yet. No audited catalog is imported.

## Catalog inventory

Catalog path counts are metadata, not proof that each payload is embedded in the APK:

- 4 `.unity` scenes
- 19 `.spriteatlas` paths
- 900 `.png` paths
- 390 `.prefab` paths
- 228 audio paths (226 Ogg Vorbis, 2 WAV)
- 208 `.mat` paths
- 95 `.json` paths
- 31 `.asset` paths
- 26 `.fbx` paths
- 1 explicit `.controller` path
- 21 bundle locations in total (2 local plus 19 remote)

Eighty remote table JSON addresses are present. Names indicate card, card growth, skill, enemy, stage, dungeon, boss, reward, research, stronghold/building, shop/pricing, summon, tournament, clan, login reward, mission, item, weapon, talent, tutorial and localization/config domains. Approximately 111 JSON/text data-like addresses appear when Spine text data and other text resources are included.

The catalog includes four named BGM addresses (`BGM_Main`, `BGM_Battle`, `BGM_PVP`, `BGM_Shop`) and many skill-effect audio addresses. Audio content, duration, loudness, ownership and licensing were not inspected or validated.

## Middleware and external dependencies

| Dependency | Evidence | Confidence |
|---|---|---|
| Spine | `spine-unity.dll` plus 93 catalog paths matching Spine/runtime/monster skeleton resources | Confirmed present |
| Live2D Cubism | `libLive2DCubismCore.so` for both ABIs plus 23 runtime material/shader/mask addresses | Confirmed present |
| DOTween | `DOTween.dll`, `DOTweenSettings` address | Confirmed present |
| Firebase | App/Messaging managed assemblies, native C++ libraries and Android services | Confirmed present |
| AppsFlyer | `AppsFlyer.dll`, Android asset/package entries | Confirmed present |
| Unity LevelPlay / ironSource | `Unity.LevelPlay.dll`, ironSource Android activities/provider | Confirmed present |
| Unity IAP / Google Billing | Unity Purchasing assemblies, Billing Client 7.0.0, billing permission and activities | Confirmed present |
| Samsung IAP | Android IAP activities | Confirmed present |
| Socket.IO / WebSocket | `SocketIOUnityAssembly.dll` and `websocket-sharp.dll` | Client libraries confirmed; actual protocol/session flow unverified |
| HIVE | Main activity and auth/push/promotion UI components | SDK presence confirmed; production account flow unverified |
| Google sign-in / games | Native sign-in library and Android activities | SDK presence confirmed; server linkage unverified |

Firebase Analytics property metadata reports `22.4.0`; Firebase IID reports `21.1.0`; the native Firebase App library name includes `12_10_1`. These are component observations, not a complete dependency lockfile.

## What remains unverified

- Server API schemas, account migration, Socket.IO event names and authentication rules.
- Whether the observed remote content host is still live, complete or authorized for this work. It was not queried.
- Exact Sprite Atlas contents, texture import settings, animation clip counts, audio duration/quality and runtime memory use.
- Original source hierarchy, scripts, prefabs and Addressables group settings beyond serialized runtime metadata.
- Ownership or reuse rights for any APK art, audio, font, animation, table or model.
- Runtime behavior on a device; this audit did not install or launch the supplied APK.

## Reproducible inspection methods

The audit used `file`, `shasum -a 256`, `zipinfo`, `unzip -p`, `strings`, JSON parsing and Androguard binary-manifest parsing. Archive payloads were streamed or placed in temporary audit storage only. No uncertain media was extracted into `Assets/`.
