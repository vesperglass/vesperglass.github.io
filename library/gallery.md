---
layout: default
title: Encyclopedia Image Gallery
kicker: UNIVERSE LIBRARY · VISUAL INDEX
description: Browse the Vesperglass site's image assets by name and topic tags.
permalink: /library/gallery/
wide: true
---

<nav class="folio-back" aria-label="Back to the Universe Library"><a href="{{ '/library/' | relative_url }}">← Universe Library</a><span>VISUAL INDEX</span></nav>

<p class="folio-return"><a href="{{ '/collections/' | relative_url }}">Explore the Vesperglass collectible collections →</a></p>

## Browse the image record

This gallery indexes image files shipped with the site, including encyclopedia plates, map artwork, diagrams, and sprite sheets. Names and topic tags describe website assets, not an in-world catalogue. Each card also carries an **editorial status**: *interpretation* marks artwork known to be generated or reconstructed; *editorial diagram* marks a site-made reference graphic; *map interface layer* marks a background image used in the Atlas view; *unclassified source status* means this index has not verified its evidentiary status. Those labels are separate from an asset's kind, and none proves an object's history or provenance. Search by filename, topic, or status, or select several tags to narrow the grid.

<figure class="specimen-plate">
  <img src="{{ '/assets/library/gallery-asset-kinds.png' | relative_url }}" alt="A generated five-panel gallery guide shows architectural artwork, a map-like star layer, a floor-plan drawing, a strip of sprite-like figure frames, and a separate glass-and-brass illustration." loading="lazy">
  <figcaption><span>INTERPRETATION · GALLERY GUIDE</span> This generated image illustrates broad website asset kinds, not a record of actual files or setting objects. Its map-like marks provide no route, coordinates, or celestial evidence; its generic figure frames document no implemented behavior.</figcaption>
</figure>

<h3 id="asset-kind-filters">Asset-kind filters · the file's site role</h3>

Choose one primary kind to narrow the gallery, then combine it with the existing multi-select topic tags. The kind describes the asset's role in the website; the card's separate **editorial status** describes what the gallery has verified about the image's source. Neither label establishes the identity or history of a depicted object.

The gallery groups recognized file names and locations as **Folio plates and illustrations**, **Maps and map layers**, **Diagrams**, or **Sprites**. Remaining supported image files appear under **Other site artwork**. The category appears on each card and in the search terms, so readers can find a role either through the filter row or by typing its name. Archive-named images remain hidden by default as before; when the Archive toggle changes the available set, the kind buttons update to match it.

<figure class="specimen-plate">
  <img src="{{ '/assets/library/gallery-interpretation-example.png' | relative_url }}" alt="Interpretive illustration of the Observatory beneath a glass dome, with a long brass-and-dark-glass sighting tube, a parchment logbook, warm lamps, and a blue starfield." loading="lazy">
  <figcaption><span>INTERPRETATION · EXAMPLE ASSET</span> A generated study draws on the Observatory's established name and its accounts of watching and keeping a record. The dome, instrument design, room fittings, and arrangement here are artistic reconstruction, not documentation of a particular room, instrument, target, or observing session. Compare the <a href="{{ '/library/observatory/' | relative_url }}">Observatory Logbook</a>.</figcaption>
</figure>

### Atlas imagery · place illustration and map layers

Some Atlas files sit at named place markers; others form the starfield behind the map. Those roles call for different labels. The floating-island illustrations are tagged as **interpretation**: they give the named places a coherent visual appearance, but their invented landforms, buildings, and decorative details are not a survey of a platform's true shape. The starfield tile and deep background are tagged as **map interface layer** because they are used to compose the Atlas view; the tiny stars are not an astronomical chart or evidence for named bodies.

<figure class="specimen-plate">
  <img src="{{ '/assets/library/gallery-atlas-interpretation-example.png' | relative_url }}" alt="An interpretive comparison shows a glass-and-bronze pavilion on an illustrated floating island beside a separate blank locator card with one brass dot." loading="lazy">
  <figcaption><span>INTERPRETATION · ATLAS EXAMPLE</span> This generated example pairs a freely composed place illustration with a separate, unmeasured locator mark. Neither panel records a Vesperglass platform's actual landform, architecture, bearing, scale, or coordinates.</figcaption>
</figure>

| Asset group | Status in this gallery | What the status supports | What it does not establish |
| --- | --- | --- | --- |
| **Named floating-island pictures** (`atlas-island-*.png`) | Interpretation | Art associates an illustrated island scene with a named Atlas place. | Platform dimensions, orientation, surveyed outline, true building plan, or precise coordinates. |
| **Deep starfield and tiled star drift** (`atlas-deep-starfield.svg`, `atlas-orbit-stars-*.svg`) | Map interface layer | These files provide the Atlas view's dark background and repeating points of light. | Named stars, celestial measurements, a verified sky chart, or a travel route. |
| **Other orbital-field and landmark variants** | Unclassified source status | Their filenames make them searchable as Atlas-related files. | Their origin, whether they belong to an earlier map study, or whether they document a named place or celestial field. |

The status review is deliberately selective. The active place pictures have a visible role in the Atlas, and their filenames and accessible descriptions name their subjects. Other orbital-field and landmark files appear in the gallery, but the consulted Atlas view and current folios do not assign them a clear source or active role; they remain **unclassified** rather than being silently promoted to map evidence. The <a href="{{ '/explore/' | relative_url }}">Vesperglass Atlas</a> connects visitors with named locations; the <a href="{{ '/library/vesperglass-gate/' | relative_url }}">Gate folio</a> and <a href="{{ '/library/train-dock/' | relative_url }}">Train Dock folio</a> keep their accounts separate from the artwork used to picture them.

<section class="image-collections" aria-labelledby="image-collections-heading">
  <div class="gallery-tag-heading"><h2 id="image-collections-heading">Vesperglass collectible image series</h2><span class="collection-intro">Six coordinated plates in each set</span></div>
  <div class="collection-cards">
  {% for collection in site.data.image_collections %}
    {% assign cover = collection.items | first %}
    <a class="collection-card" href="{{ collection.url | relative_url }}">
      <img src="{{ cover.image | relative_url }}" alt="{{ cover.alt | escape }}" loading="lazy">
      <span class="collection-card-copy"><span class="collection-card-kicker">SET {{ collection.number }} · {{ collection.items.size }} PLATES</span><strong>{{ collection.title }}</strong><span>{{ collection.description }}</span><span class="collection-card-link">Open collection →</span></span>
    </a>
  {% endfor %}
  </div>
</section>

<section class="image-gallery" aria-label="Searchable image gallery">
  <label class="gallery-search-label" for="gallery-search">Search images</label>
  <input id="gallery-search" class="gallery-search" type="search" placeholder="Try “observatory”, “map”, or “starfield”" autocomplete="off">
  <label class="gallery-archive-toggle"><input id="gallery-show-archive" type="checkbox"> <span>Show Archive images</span><small>Hidden by default</small></label>
  <div class="gallery-tag-heading"><h2>Asset kinds</h2><span class="collection-intro">Choose one primary site role</span></div>
  <div id="gallery-kinds" class="gallery-tags gallery-kind-filters" role="group" aria-label="Filter by asset kind"></div>
  <div class="gallery-tag-heading"><h2>Topic tags</h2><button class="gallery-clear" id="gallery-clear" type="button">Clear filters</button></div>
  <div id="gallery-tags" class="gallery-tags" aria-label="Filter by image tags"></div>
  <p id="gallery-count" class="gallery-count" aria-live="polite"></p>
  <div id="gallery-grid" class="gallery-grid"></div>
  <noscript><p>Image search and tag filters need JavaScript. The full image record is still available through the individual Encyclopedia folios and Atlas pages.</p></noscript>
</section>

<p class="gallery-changelog-link"><a href="{{ '/library/changelog/' | relative_url }}">Read the Encyclopedia changelog →</a></p>

<script type="application/json" id="gallery-image-data">
[
{%- assign gallery_images = site.static_files | where_exp: "asset", "asset.extname == '.png'" -%}
{%- assign gallery_jpg = site.static_files | where_exp: "asset", "asset.extname == '.jpg'" -%}
{%- assign gallery_jpeg = site.static_files | where_exp: "asset", "asset.extname == '.jpeg'" -%}
{%- assign gallery_webp = site.static_files | where_exp: "asset", "asset.extname == '.webp'" -%}
{%- assign gallery_gif = site.static_files | where_exp: "asset", "asset.extname == '.gif'" -%}
{%- assign gallery_svg = site.static_files | where_exp: "asset", "asset.extname == '.svg'" -%}
{%- assign gallery_avif = site.static_files | where_exp: "asset", "asset.extname == '.avif'" -%}
{%- assign gallery_images = gallery_images | concat: gallery_jpg | concat: gallery_jpeg | concat: gallery_webp | concat: gallery_gif | concat: gallery_svg | concat: gallery_avif -%}
  {%- for asset in gallery_images -%}
  {%- assign asset_key = asset.path | remove_first: '/' -%}
  {%- assign editorial_status = 'unclassified source status' -%}
  {%- if site.data.image_status.interpretation contains asset_key -%}{%- assign editorial_status = 'interpretation' -%}{%- elsif site.data.image_status.editorial_diagram contains asset_key -%}{%- assign editorial_status = 'editorial diagram' -%}{%- elsif site.data.image_status.map_interface contains asset_key -%}{%- assign editorial_status = 'map interface layer' -%}{%- endif -%}
  {"path":{{ asset.path | relative_url | jsonify }},"name":{{ asset.name | split: "." | first | replace: "-", " " | jsonify }},"extension":{{ asset.extname | remove_first: "." | jsonify }},"status":{{ editorial_status | jsonify }}}{% unless forloop.last %},{% endunless %}
{%- endfor -%}
]
</script>
<script type="application/json" id="gallery-collection-data">{{ site.data.image_collections | jsonify }}</script>
<script src="{{ '/assets/image-gallery.js' | relative_url }}" defer></script>

<p class="folio-return"><a href="{{ '/library/' | relative_url }}">← Return to the Universe Library</a><a href="{{ '/library/changelog/' | relative_url }}">Open the changelog ↗</a></p>
