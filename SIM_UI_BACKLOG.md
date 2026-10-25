# Vesperglass simulation viewer: game UI backlog

Working backlog for making the shared Atlas/Galaxy viewer feel more game-like while keeping exploration clear and atmospheric. Priorities reflect player value, dependency order, and whether the feature can work with the current browser-only simulation.

## Scope and guardrails

- The current Galaxy is deterministic and browser-only. Its stars and planets can be inspected, but world edits and gameplay state are not persisted.
- Build interface around capabilities that exist today before presenting planned gameplay as available.
- Missions, gathering, inventory, refining, fuel checks, and expedition dispatch depend on gameplay rules and state. Their UI stays planned until those systems are implemented.
- Keep the shared Atlas/Galaxy shell, theme behavior, keyboard access, responsive layout, and reduced-motion support intact.
- Keep the glass-and-bronze visual language. Make essential status and actions readable without color, hover, animation, or sound alone.

## Priority guide

- **P0 — Foundation:** improves the current exploration loop and clarifies what the viewer can do.
- **P1 — Play loop:** adds a goal and feedback loop once the minimum supporting gameplay state exists.
- **P2 — Operations:** supports longer-running expeditions, logistics, and simulation controls after those mechanics exist.

## Backlog

### Shared UI acceptance checklist

Apply this checklist to every backlog item before marking it complete. Define which states matter for the feature; explain why any state does not apply.

- [ ] **States and behavior:** Specify the default, selected, empty, loading, error, and disabled states that apply. Include open/close behavior, keyboard and touch interaction, and what happens after the action.
- [ ] **Truthful status:** Keep controls, labels, and feedback aligned with implemented simulation behavior. Mark unavailable or planned mechanics clearly and do not imply that they changed game state.
- [ ] **Shared visual language:** Reuse the tokens and components in `DESIGN_SYSTEM.md` and `assets/site.css`. Add or update shared patterns when the same control appears in multiple places.
- [ ] **Whole-viewer fit:** Check the feature alongside both Atlas and Galaxy views, including overlays and fullscreen. Ensure it does not obstruct map navigation, selection, or view switching.
- [ ] **Access and layout:** Review keyboard operation, visible focus, readable contrast and labels, narrow/mobile layout, light and dark themes, and reduced-motion behavior.
- [ ] **Task check:** Try the feature's main task from start to finish in the rendered viewer. If practical, observe a few people using it and revise confusing labels or steps.

### P0 — Foundation

- [ ] **Refine the selected-body inspector** — Give generated star and planet statistics a clear visual hierarchy, label their procedural status, and explain that resource signals are estimates rather than collected materials. **Depends on:** existing generated body data and inspector. Implementation updated 2026-10-25 in `assets/galaxy-map.js`, `assets/galaxy-map.css`, `assets/sim-viewer.css`, `_layouts/default.html`, and the standalone/shared viewer labels; rendered review remains pending.
- [ ] **Add a discovery log** — Show recent selections, scans, or newly revealed bodies as they become supported by the current exploration model; clearly distinguish a viewed body from a discovered or scanned one. **Depends on:** a defined discovery state; do not imply that merely selecting a body changes the world. **Done when:** entries have a clear event and target, can be revisited, and empty state explains how the log fills.
- [x] **Add Galaxy map filters and legend** — Explain map symbols and allow visitors to show or hide available categories such as stars, planets, and the Vesperglass portal. **Depends on:** stable category data. **Done when:** filters have labeled controls, usable keyboard support, and a reset path; color is not the only category cue. Implemented 2026-10-25 in `_includes/galaxy-map-key.html`, `_includes/sim-viewer.html`, `galaxy.html`, `assets/galaxy-map.js`, and `assets/galaxy-map.css`; rendered review remains pending.
- [ ] **Streamline the viewer switcher** — Keep Atlas/Galaxy navigation in one compact segmented control and retain a short Guide link. **Depends on:** existing view switch and portal links. **Done when:** active view remains clear, keyboard and mobile use work, and the control does not crowd the map. Implementation updated 2026-10-25 in `_includes/sim-viewer.html` and `assets/sim-viewer.css`; rendered review remains pending.
- [ ] **Add an optional objective prompt** — Present one short exploration suggestion, such as selecting a body or changing the Galaxy seed, with dismiss and replay controls. **Depends on:** actions currently supported by the viewer. **Done when:** every suggestion can be completed with existing functionality and the prompt never implies gathering or missions are playable.

### P1 — Play loop

- [ ] **Create a mission board** — List deterministic expedition opportunities with destination, objective, duration or effort, and possible reward. **Depends on:** mission definitions, eligibility rules, and a resolved outcome model. **Done when:** the board explains unavailable missions, previews the consequences of dispatch, and reports results from actual simulation state.
- [ ] **Add resource inventory** — Show owned materials, quantities, capacity if applicable, and recent gains or spends. **Depends on:** implemented resource state and persistence decision. **Done when:** displayed totals match game state and empty/new-player states are clear.
- [ ] **Add mission result cards and activity alerts** — Report expedition completion, discoveries, and resource changes in a dismissible activity tray. **Depends on:** missions and events. **Done when:** each alert links to its destination or relevant inventory item and can be cleared without losing underlying state.
- [ ] **Add a refinery interaction** — Show valid starshard-to-stardust recipes, requirements, output, and confirmation before refining. **Depends on:** recipe rules, inventory mutation, and refinery availability. **Done when:** the interface prevents invalid actions and reports the actual resulting quantities.

### P2 — Operations

- [ ] **Add expedition status and route view** — Show dispatched crews or vehicles, their destination, progress, and return state. **Depends on:** travel timing and expedition state. **Done when:** active and completed trips are distinct and progress remains coherent after reload if persistence is supported.
- [ ] **Add Gate train fuel and travel preview** — Show a trip's fuel cost, available stardust, and whether travel can proceed. **Depends on:** fuel costs, train state, and travel rules. **Done when:** the preview matches the action result and explains how to resolve a shortfall.
- [ ] **Add simulation time controls** — Offer pause and speed controls for timed travel and other events. **Depends on:** a simulation clock and well-defined behavior while paused or sped up. **Done when:** current speed is visible, keyboard-operable, and does not cause event or persistence inconsistencies.
- [ ] **Add persistent objectives and tutorial/help** — Track a short campaign or player-chosen objective and provide a concise control reference. **Depends on:** implemented objective progression and a save-state decision. **Done when:** progress survives the supported session boundary and help remains available without blocking exploration.
- [ ] **Add player-facing settings for interface scale and optional sound** — Allow comfortable panel sizing and opt-in sound where sound effects exist. **Depends on:** validated layout range and actual audio assets. **Done when:** preferences are accessible, saved consistently with the site's theme behavior, and respect reduced-motion and browser audio constraints.

## Suggested delivery order

1. Refine the existing inspector and add the legend/filters.
2. Add the discovery log and compact navigation panel.
3. Add the optional objective prompt as a guided way to learn current controls.
4. Define mission and resource state before building the mission board and inventory UI.
5. Add refinery, expedition, fuel, and time controls alongside their underlying mechanics.

## Review checklist

- Verify the UI against implemented simulation behavior; label planned mechanics as planned until they work.
- Check desktop and mobile layouts, light and dark themes, keyboard navigation, visible focus, fullscreen, and reduced-motion behavior.
- Confirm overlays remain readable over the map and do not block map pan, zoom, selection, or view switching.
- Confirm labels and links use established place, material, and vessel names.
