# Vesperglass Field Guide

A public, searchable wiki for the Vesperglass organization, published at [vesperglass.github.io](https://vesperglass.github.io).

## Structure

- Markdown files hold the pages.
- `_layouts/default.html` provides the shared wiki layout.
- `assets/site.css` contains the visual system.
- `assets/site.js` provides client-side page search.
- `index.md` and `/sim/` share `_includes/sim-viewer.html` as the full-screen Explore surface.
- `universe.md` is the universe hub; `library.md` and `library/` hold encyclopedia entries.

The site is published from the `main` branch using GitHub Pages and Jekyll. No external runtime services or analytics are used.
