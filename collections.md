---
layout: default
title: Vesperglass Collections
kicker: UNIVERSE LIBRARY · COLLECTIBLE IMAGE SERIES
description: Explore coordinated six-image collections inspired by places, objects, and accounts from Vesperglass.
permalink: /collections/
wide: true
---

<nav class="folio-back" aria-label="Back to the Universe Library"><a href="{{ '/library/' | relative_url }}">← Universe Library</a><span>COLLECTIBLE SERIES</span></nav>

## Six plates, one visual thread

Each collection is a coordinated set of six interpretive images. Serial numbers identify plates on this site; they do not imply a recovered in-world catalogue. The descriptions distinguish established Vesperglass details from visual invention.

<section class="image-collections" aria-label="Vesperglass image collections">
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

<p class="folio-return"><a href="{{ '/library/gallery/' | relative_url }}">Browse every image in the gallery ↗</a></p>
