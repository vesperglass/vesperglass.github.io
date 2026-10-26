# Public-world framing audit

## Requirement

Published Vesperglass pages must speak of Vesperglass as a real world. They must not call the universe a game or simulation or explain its underlying game/simulation implementation. That implementation framing belongs only in repository documentation explicitly excluded from the published site. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md#public-world-framing) for the ongoing editorial rule.

The rule covers every visitor-visible or visitor-accessible surface: page text, headings, navigation, page titles and descriptions, image captions and alt text, ARIA labels, search summaries, changelogs, help/status messages, error pages, and generated HTML. Interface instructions may describe map actions without characterizing the world as artificial.

## Changes applied

The source cleanup was applied on 2026-10-25:

- Reframed the home page, Atlas/Galaxy entry, Universe Guide, Galaxy chart, navigation, search index, map descriptions, and metadata in world-facing language.
- Replaced public game/simulation labels and moved the alternate Atlas/Galaxy entry from `/sim/` to `/explore/`.
- Rewrote Encyclopedia folios and edition notes to describe uncertain provenance, missing records, and interpretation without calling Vesperglass fictional or describing site implementation.
- Updated visitor-facing status and accessible labels in the shared Atlas/Galaxy interface.
- A later wording sweep found and removed one remaining hypothetical “Imagine” paragraph in `library/starshards.md`; it also changed “observed forms” to “proposed cabinet notes” to avoid claiming undocumented observations.
- The same sweep replaced a few page-making cues in `library/compass-garden.md`, `library/workshop.md`, `library/observatory.md`, and `library/threshold-house.md`—such as “artwork,” “canonical,” and “established in the setting”—with descriptions grounded in maps and surviving accounts.
- Kept implementation and contributor context in repository documentation and explicitly excluded `README.md`, `DESIGN_SYSTEM.md`, `ENCYCLOPEDIA_BACKLOG.md`, `SIM_UI_BACKLOG.md`, and this report in `_config.yml`.

## Verification status

The latest source searches found no visitor-facing use of game/simulation or fictional/imagined/hypothetical framing in published Markdown, HTML, JavaScript strings, and CSS comments. The remaining `canonical` match is the standard `<link rel="canonical">` metadata in the shared HTML layout, not visitor copy. Internal filenames and code identifiers such as `sim-viewer` remain implementation details, not displayed copy. Contributor documents that use this terminology are explicitly excluded from Jekyll output.

Rendered-output verification remains pending because Jekyll and Bundler are not installed in the current environment. When the site is next built, confirm that contributor files are absent and review generated HTML, page metadata, dynamic labels, link destinations, and responsive/accessibility behavior.
