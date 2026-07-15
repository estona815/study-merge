# Asset Inventory

This inventory separates supplied references, APK metadata and clean-room project assets. A catalog address is not equivalent to a locally available or reusable source asset.

## Supplied references

| Item | Technical inventory | Project use |
|---|---|---|
| `Ilarune-test002.apk` | 277,977,231 bytes; SHA-256 `2aaa5417e4060e6b98974f7fcafd38cfb899467f2aafe3cc98c3215624679304` | Behavior and package-structure audit only |
| `IMG_4471.JPG` | 682x1440 RGB JPEG; 455,997 bytes; SHA-256 `78615c7ea0ca453583a9670232e4cb93640a32b7fdbfc43bc8b894f849c73dec` | Composition, density and art-direction reference only |

The JPG shows a portrait floating-city lobby with a central city, surrounding building islands, resource bars, side actions and bottom navigation. Labels, iconography, layout geometry and pictured art are not source material for direct reproduction.

## APK catalog metadata

### Scenes

- Built-in bootstrap strings: `Start`, `Intro`, `Restart`.
- Remote Addressables scene paths: `Main`, `Battle_Stage`, `Battle_PvP`, `Battle_ClanBoss`.

### Sprite atlases (19 paths)

`Battle`, `Common`, `ResHeroCardsSmall`, `ClanIcons`, `ClanPatterns`, `ClanSymbols`, `DungeonBanners`, `EffectIcons`, `EventBanner`, `HeroCardsSmall`, `Items`, `MainScene`, `MissionIcons`, `ShopResources`, `SkillIcons`, `SkyPathIcons`, `SummonThemes`, `WeaponCardsSmall`, plus a second catalog path for `Battle` under the remote atlas group.

These are address/path names only. Atlas sprite contents and legal provenance are unverified.

### Data tables

The 80 remote table JSON addresses cover these functional families:

- Player/content: user level, strings, config, area, theme, avatar shop.
- Heroes/cards/skills: card, ascend, level, mint, skill, skill function/status/string/level, talent grids.
- Combat/world: stage, stage bot, enemy, enemy level, ground, special rules.
- Meta: stronghold, structure info/level-up, research, item, weapon and weapon progression.
- Modes: dungeon, boss/rare boss, tournament, tiers/ranking, clan war and wanted quests.
- Economy: rewards, prices, daily shop, promotions, summon pricing/rates/themes, ad rewards.
- Engagement: login rewards, missions, season quests, mail strings, tutorials, forbidden words.

No table body was imported. Names are retained only to scope new, independently authored schemas.

### Media and animation indicators

| Category | Catalog observation | Local reuse status |
|---|---:|---|
| PNG | 900 paths | Quarantined; not imported |
| Prefab | 390 paths | Quarantined; not imported |
| Audio | 226 OGG + 2 WAV paths | Quarantined; not imported |
| Materials | 208 paths | Quarantined; not imported |
| FBX | 26 paths | Quarantined; not imported |
| Spine-related | 93 matching paths | Quarantined; not imported |
| Live2D runtime resources | 23 matching addresses | SDK evidence only; not imported |
| Explicit Animator Controller | 1 path | Clip inventory still unverified |

The APK contains two local duplicate-isolation bundles. Most named gameplay content points at remote bundles. No remote content was downloaded.

## Clean-room project inventory

- `Assets/Ilarune/Shared`: project-authored contracts and scene IDs.
- `Assets/Ilarune/Core`: project-authored local demo models, persistence, mock backend, services, navigation and quality policies.
- `Assets/Ilarune/Hub` and `Assets/Ilarune/UI`: independently authored procedural city/HUD source; no APK texture is imported.
- `Assets/Ilarune/UI/Resources/Fonts/NotoSansKR-Variable.ttf`: official Google Fonts Noto Sans KR variable font, locally renamed; SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`.
- `Assets/Ilarune/UI/Resources/Fonts/OFL.txt`: bundled SIL Open Font License 1.1 text; SHA-256 `1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9`. Source: [Google Fonts `ofl/notosanskr`](https://github.com/google/fonts/tree/main/ofl/notosanskr).
- `Assets/Ilarune/Battle`: independently authored board/combat/presentation source.
- `Assets/Ilarune/Editor` and `Assets/Ilarune/Tests`: scene/build automation and test source.
- The Core local asset provider resolves only assets intentionally placed in this clean project. It does not know the APK catalog or endpoint.

`Assets/Scenes`, `.meta` files and `Packages/packages-lock.json` are currently absent because licensed Unity import/bootstrap has not completed. The bootstrap is designed to generate four scenes with runtime bootstrap components; it does not generate prefabs, textures or Addressables groups. Update this document only after those files actually exist.
