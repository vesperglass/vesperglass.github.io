---
layout: default
title: Vesperglass Workshop Tools · Collectible Image Series
kicker: UNIVERSE LIBRARY · VESPERGLASS COLLECTION 01
description: Six interpretive still lifes inspired by the unnamed wall-tool group in the proposed Vesperglass Workshop cutaway.
permalink: /library/collections/tools/
wide: true
---

{% assign collection = site.data.image_collections | where: "slug", "tools" | first %}
<nav class="folio-back" aria-label="Back to the image gallery"><a href="{{ '/library/gallery/' | relative_url }}">← Image gallery</a><span>SET {{ collection.number }} · {{ collection.code }}</span></nav>

## Tools of the Vesperglass Workshop

{{ collection.description }} Plate II shows a row of narrow objects but does not identify their individual forms, materials, makers, or uses. The names below are editorial labels for this coordinated set; its serials identify website plates, not a recovered inventory.

<section class="collectible-grid" aria-label="{{ collection.title }} collection, six images">
{% for item in collection.items %}
  <figure class="collectible-card">
    <a class="collectible-art" href="{{ item.image | relative_url }}" target="_blank" rel="noopener" aria-label="Open {{ item.name }} image full size">
      <img src="{{ item.image | relative_url }}" alt="{{ item.alt | escape }}" loading="lazy">
    </a>
    <figcaption>
      <span class="collectible-serial">{{ item.serial }}</span>
      <h2>{{ item.name }}</h2>
      <p>Vesperglass Workshop · Interpretive series {{ collection.number }} · Plate {{ forloop.index }} of {{ collection.items.size }}</p>
    </figcaption>
  </figure>
{% endfor %}
</section>

<p class="folio-return"><a href="{{ '/library/gallery/' | relative_url }}">← Return to the image gallery</a><a href="{{ '/library/changelog/' | relative_url }}">Open the changelog ↗</a></p>
