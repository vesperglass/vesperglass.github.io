---
layout: default
title: Gate Bloom Studies · Collectible Image Series
kicker: UNIVERSE LIBRARY · VESPERGLASS COLLECTION 02
description: Six interpretive sci-fi studies of the Vesperglass Gate's described bloom.
permalink: /library/collections/gate-bloom/
wide: true
---

{% assign collection = site.data.image_collections | where: "slug", "gate-bloom" | first %}
<nav class="folio-back" aria-label="Back to collections"><a href="{{ '/collections/' | relative_url }}">← Vesperglass Collections</a><span>SET {{ collection.number }} · {{ collection.code }}</span></nav>

## A luminous event, studied in six plates

{{ collection.description }} The Gate account describes a bloom, but does not establish this artwork's visual sequence, physical structure, or colors. The serials identify this website's collectible plates, not a historical record.

<section class="collectible-grid" aria-label="{{ collection.title }} collection, six images">
{% for item in collection.items %}
  <figure class="collectible-card">
    <a class="collectible-art" href="{{ item.image | relative_url }}" target="_blank" rel="noopener" aria-label="Open {{ item.name }} image full size">
      <img src="{{ item.image | relative_url }}" alt="{{ item.alt | escape }}" loading="lazy">
    </a>
    <figcaption>
      <span class="collectible-serial">{{ item.serial }}</span>
      <h2>{{ item.name }}</h2>
      <p>Vesperglass Gate · Interpretive series {{ collection.number }} · Plate {{ forloop.index }} of {{ collection.items.size }}</p>
    </figcaption>
  </figure>
{% endfor %}
</section>

<p class="folio-return"><a href="{{ '/collections/' | relative_url }}">← Return to Vesperglass Collections</a><a href="{{ '/library/gallery/' | relative_url }}">Open the searchable image gallery ↗</a></p>
