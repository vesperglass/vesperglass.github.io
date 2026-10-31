---
layout: default
title: Encyclopedia Image Gallery
kicker: UNIVERSE LIBRARY · VISUAL INDEX
description: Browse the Vesperglass site's image assets by name and topic tags.
permalink: /library/gallery/
wide: true
---

<nav class="folio-back" aria-label="Back to the Universe Library"><a href="{{ '/library/' | relative_url }}">← Universe Library</a><span>VISUAL INDEX</span></nav>

## Browse the image record

This gallery indexes image files shipped with the site, including encyclopedia plates, map artwork, diagrams, and sprite sheets. Its names and tags describe website assets for retrieval; they are not an in-world catalogue or evidence of an object's provenance. Use the search field for words in a filename or topic tag, or select several tags to narrow the grid.

<section class="image-gallery" aria-label="Searchable image gallery">
  <label class="gallery-search-label" for="gallery-search">Search images</label>
  <input id="gallery-search" class="gallery-search" type="search" placeholder="Try “observatory”, “map”, or “starfield”" autocomplete="off">
  <div class="gallery-tag-heading"><h2>Topic tags</h2><button class="gallery-clear" id="gallery-clear" type="button">Clear filters</button></div>
  <div id="gallery-tags" class="gallery-tags" aria-label="Filter by image tags"></div>
  <p id="gallery-count" class="gallery-count" aria-live="polite"></p>
  <div id="gallery-grid" class="gallery-grid"></div>
  <noscript><p>Image search and tag filters need JavaScript. The full image record is still available through the individual Encyclopedia folios and Atlas pages.</p></noscript>
</section>

<p class="gallery-changelog-link"><a href="{{ '/library/changelog/' | relative_url }}">Read the Encyclopedia changelog →</a></p>

<script type="application/json" id="gallery-image-data">
[
{%- assign gallery_images = site.static_files | where_exp: "asset", "asset.extname == '.png' or asset.extname == '.jpg' or asset.extname == '.jpeg' or asset.extname == '.webp' or asset.extname == '.gif' or asset.extname == '.svg' or asset.extname == '.avif'" -%}
{%- for asset in gallery_images -%}
  {"path":{{ asset.path | relative_url | jsonify }},"name":{{ asset.name | split: "." | first | replace: "-", " " | jsonify }},"extension":{{ asset.extname | remove_first: "." | jsonify }}}{% unless forloop.last %},{% endunless %}
{%- endfor -%}
]
</script>
<script src="{{ '/assets/image-gallery.js' | relative_url }}" defer></script>

<p class="folio-return"><a href="{{ '/library/' | relative_url }}">← Return to the Universe Library</a><a href="{{ '/library/changelog/' | relative_url }}">Open the changelog ↗</a></p>
