# Asset Provenance

## Policy

This is a clean-room rebuild. Technical behavior, generic game loops and non-expressive identifiers may inform the new architecture; original code, art, audio, animation, text, economy values, branding and exact screen composition may not be copied.

## Provenance register

| Source class | Custody / evidence | Permitted use | Current status |
|---|---|---|---|
| Supplied APK | User supplied the binary for audit; ownership and third-party licenses were not independently proven | Read-only behavior and dependency inventory | No payload imported into project |
| Supplied JPG | User supplied a 682x1440 visual reference; original creator/license not independently proven | High-level art direction and information-density reference | Reference-only; not copied into `Assets/` |
| Core C# source | Authored for this workspace from public Unity APIs and the project-owned `Ilarune.Shared` contracts | Ship in clean-room demo | Approved project source |
| Demo names and tuning | Independently authored (`Astral Guard`, `Aether Mine`, etc.) | Ship in clean-room demo, subject to product review | Approved project source |
| Unity packages | Declared in `Packages/manifest.json` | Use under each package's license | Package/license review required before release |
| Newly generated or drawn visuals | Must be accompanied by tool/source, date and license/usage record | Use only after review | Record per asset before release |
| Bundled UI font | Official Google Fonts `ofl/notosanskr`; local variable TTF plus its OFL text | Use under the included SIL Open Font License 1.1, subject to its terms | Recorded clean-room dependency; preserve `OFL.txt` |
| Music/SFX | Must be original, commissioned or covered by an explicit commercial license | Use only after review | No APK media approved for reuse |

## Bundled font evidence

- Source: [Google Fonts — Noto Sans KR](https://github.com/google/fonts/tree/main/ofl/notosanskr).
- Imported font: `Assets/Ilarune/UI/Resources/Fonts/NotoSansKR-Variable.ttf` (the official variable TTF, locally renamed); SHA-256 `194018e6b2b293a7964f037b25c0249ce1418bc9ab3c971060a03aa57861e252`.
- License copy: `Assets/Ilarune/UI/Resources/Fonts/OFL.txt`; SIL Open Font License 1.1; SHA-256 `1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9`.
- Runtime use: `ProceduralUi` first requests the Resources key `Fonts/NotoSansKR-Variable`, then uses its existing system-font fallback only if the bundled asset cannot be loaded.
- Release condition: retain the included license and comply with its terms. This record does not replace a release-time legal/license review.

## Quarantine rules

- Do not copy files or decoded objects from the APK into `Assets/`, `StreamingAssets/`, Addressables groups, captures or marketing exports.
- Do not connect the clean project to the remote catalog host found in the APK.
- Do not reuse the APK's package name, signing certificate, production configuration, API keys or service identifiers.
- Do not redraw the JPG's named icons, characters, exact frames or exact layout. Use only its broad floating-city, bronze/gothic, cyan-energy and portrait-density direction.
- File/path names listed in audit documents are an inventory trail, not reuse approval.

## Required record for each release asset

Before an asset is marked releasable, record:

1. Project-relative path and asset type.
2. Creator or generation tool/model.
3. Creation/import date.
4. Source URL or source file, if any.
5. License and commercial-use terms.
6. Required attribution.
7. Reviewer and review date.

Anything without this record remains development-only.
