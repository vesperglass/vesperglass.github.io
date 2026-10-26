# Vesperglass site consistency guide

Use this guide when adding or changing a page, map destination, interface, or piece of universe lore. The goal is to make the site feel like one navigable place and to keep readers clear about what exists in the setting and what is interpretation.

## Public-world framing

- Write every published page as a reference to a real place and world. Treat Vesperglass, its people, materials, vessels, journeys, and surrounding worlds as real within the encyclopedia's account.
- Do not describe Vesperglass or its universe as a game, simulation, fiction, fictional setting, or imagined world in published copy, navigation, captions, accessibility labels, page metadata, search summaries, or visitor-facing status notes.
- Keep explanations of game or simulation implementation, planned mechanics, and the distinction between the authored world and the website in repository documentation that is explicitly excluded from the published Jekyll site.
- Public pages may describe what a visitor can do with a map or chart in direct interface language (for example, open, select, inspect, pan, or zoom). Keep those controls separate from claims about how life or travel works in the world.
- Within the encyclopedia, distinguish established accounts from interpretation or records of uncertain provenance using in-world editorial language. Do not use website implementation as evidence about the world.
- Before publishing, search all visitor-facing source and generated output for game/simulation framing, including metadata, accessibility text, captions, search data, changelogs, and fallback pages. A public-facing exception requires a new explicit decision.

## Site structure

- **Explore** is the shared Atlas/Galaxy map. The home page and `/explore/` are entry points to the same experience.
- **Universe Guide** at `/universe/` introduces the setting and points into the atlas, Galaxy, and encyclopedia.
- **Universe Library** at `/library/` is the illustrated reference collection. Individual entries live under `/library/<entry>/`.
- Keep these surfaces connected with the shared navigation, search, atlas destinations, and contextual links. When a destination changes, update all of its entry points in the same change.

## Visual language

- Keep the existing quiet glass-and-bronze mood: deep night backgrounds, warm paper surfaces, muted sea-glass greens, and restrained brass or gold accents.
- Use the shared CSS custom properties and typography in `assets/site.css`. Add a new token there when a value needs to be reused; avoid repeating one-off colors and spacing values across pages.
- Use the shared page shell and components from `_layouts/default.html` and `assets/site.css`. Add page-specific styles only for a genuinely distinct feature, and keep them scoped to that feature.
- Keep map and simulation controls readable over artwork, visible in both themes, and positioned as part of the map experience.
- Treat generated images as part of the same world: use coherent materials, lighting, scale, and palette. Vary image composition when an entry needs multiple plates (for example, an interior view plus a plan or cutaway).

## Lore and editorial rules

- Use established names consistently across prose, headings, navigation, search, map pins, and popup links.
- Distinguish **established lore**, **interpretation**, and **implemented simulation behavior**. Label proposals and reconstructions clearly; do not describe planned gathering, crafting, persistence, or mission systems as working features.
- Keep the voice curious, practical, and source-conscious. State uncertainty plainly and do not invent project capabilities to fill a gap.
- Encyclopedia entries should read like reference folios: clear title and subject, concise context, useful sections, descriptive image captions or alt text, and links to related places or concepts.
- Give images meaningful alt text that describes the information they convey. Decorative images should use empty alt text.

## Shared behavior and accessibility

- Preserve responsive navigation and layouts, keyboard access, visible focus, semantic headings, and accessible names for controls.
- Preserve the saved light/dark theme behavior across pages and map overlays.
- Respect `prefers-reduced-motion` for animated backdrops, floating platforms, trains, couriers, and transitions.
- Do not make essential information available only through color, animation, hover, or sound. Audio remains optional and should have an accessible control where offered.
- Preserve map interaction and coordinate alignment when changing artwork, layers, pins, labels, or routes.

## Update checklist

Before considering a site change complete:

1. Identify the page's role in the structure above and reuse the established layout and components.
2. Check names, lore status, descriptions, image captions/alt text, and links against related pages.
3. Update navigation, search content, index cards, atlas pins/popups, and related links wherever the destination appears.
4. Check the change at desktop and mobile sizes, in light and dark themes, and with reduced motion enabled. For interactive maps, also check keyboard use, fullscreen behavior, overlays, and pin/art alignment.
5. Open the rendered page and follow its links. Confirm that removed or renamed content does not leave stale links or orphaned pages.

## Where styles and behavior live

- Shared shell and navigation: `_layouts/default.html`
- Shared colors, type, layout, and reusable page patterns: `assets/site.css`
- Shared search and site interactions: `assets/site.js`
- Atlas rendering and interaction: `assets/atlas-map.css`, `assets/atlas-map.js`
- Galaxy rendering and interaction: `assets/galaxy-map.css`, `assets/galaxy-map.js`
- Combined viewer shell: `assets/sim-viewer.css`, `assets/sim-viewer.js`, `_includes/sim-viewer.html`
- Library index and entries: `library.md`, `library/`
