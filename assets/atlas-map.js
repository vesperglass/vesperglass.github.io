(() => {
  const container = document.getElementById("vesperglass-atlas");
  const resetButton = document.getElementById("atlas-reset");
  if (!container || !window.L) return;

  const bounds = L.latLngBounds([[0, 0], [1000, 1400]]);
  const map = L.map(container, {
    crs: L.CRS.Simple,
    zoomControl: false,
    attributionControl: false,
    minZoom: -2,
    maxZoom: 1.5,
    maxBounds: bounds.pad(0.12),
    maxBoundsViscosity: 0.72,
    zoomSnap: 0.25,
    wheelPxPerZoomLevel: 90,
    keyboard: true
  });

  const artworkParts = [
    '<svg class="atlas-artwork" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 1000" role="img" aria-labelledby="atlas-art-title atlas-art-desc">',
    '<title id="atlas-art-title">The Elsewhere Atlas of Vesperglass</title>',
    '<desc id="atlas-art-desc">An invented archipelago of workshop places in a starry sea, without real-world coordinates.</desc>',
    '<defs>',
    '<linearGradient id="atlas-water-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--map-ocean)"/><stop offset="1" stop-color="var(--map-ocean-deep)"/></linearGradient>',
    '<pattern id="atlas-star-pattern" width="118" height="112" patternUnits="userSpaceOnUse"><circle cx="17" cy="27" r="1.8" fill="var(--map-star)" opacity=".56"/><circle cx="81" cy="18" r="1" fill="var(--map-star)" opacity=".45"/><circle cx="57" cy="82" r="1.3" fill="var(--map-star)" opacity=".5"/><path d="M106 58h7m-3.5-3.5v7" stroke="var(--map-star)" stroke-width=".8" opacity=".48"/></pattern>',
    '</defs>',
    '<rect width="1400" height="1000" fill="url(#atlas-water-glow)"/>',
    '<rect width="1400" height="1000" fill="url(#atlas-star-pattern)"/>',
    '<g class="atlas-chartline"><path d="M0 180C340 215 720 145 1400 192"/><path d="M0 760C390 680 970 814 1400 733"/><path d="M170 0C270 284 247 631 335 1000"/><path d="M1110 0C1030 310 1160 673 1080 1000"/><ellipse cx="720" cy="500" rx="570" ry="355" stroke-dasharray="2 12"/><ellipse cx="720" cy="500" rx="440" ry="268" stroke-dasharray="2 10"/></g>',
    '<g class="atlas-waterline"><path d="M85 310c93-56 190-58 273-22s131 42 204 17"/><path d="M1020 204c106-43 177-32 254 21"/><path d="M1090 774c94-39 178-27 246 26"/><path d="M129 805c81-30 143-22 196 15"/></g>',
    '<path class="atlas-land-shadow" d="M352 494c-29-75 17-145 98-165 29-82 127-106 205-59 69-68 182-42 201 31 101-5 169 71 140 151 70 47 57 133-12 171 24 82-46 145-126 128-43 82-146 91-206 34-71 75-179 46-204-35-92 7-147-62-111-136-73-36-74-101 15-120Z"/>',
    '<path class="atlas-land" d="M342 470c-29-75 17-145 98-165 29-82 127-106 205-59 69-68 182-42 201 31 101-5 169 71 140 151 70 47 57 133-12 171 24 82-46 145-126 128-43 82-146 91-206 34-71 75-179 46-204-35-92 7-147-62-111-136-73-36-74-101 15-120Z"/>',
    '<path class="atlas-land-small" d="M155 206c28-39 91-44 126-15 45-13 89 21 81 58 39 33 17 83-22 90-27 37-82 34-105 6-47 13-88-24-73-61-34-23-37-57-7-78Z"/>',
    '<path class="atlas-land-small" d="M1112 166c31-33 79-28 98 4 42-8 71 28 54 59 14 38-21 69-56 59-33 22-75 4-73-31-39-21-47-63-23-91Z"/>',
    '<path class="atlas-land-small" d="M1127 774c36-39 92-34 110 3 39-7 72 29 51 61 13 39-25 70-59 56-37 23-79 1-72-35-39-20-49-57-30-85Z"/>',
    '<path class="atlas-land-small" d="M208 777c26-30 73-29 92 1 34-7 58 23 44 49 10 31-20 54-48 43-28 19-62 2-59-25-34-17-42-45-29-68Z"/>',
    '<g class="atlas-contour"><path d="M420 422c43-82 132-100 191-52 55-57 145-36 156 29 84-1 128 57 106 115 46 37 36 90-18 115 9 62-44 101-101 81-35 63-110 69-158 25-57 53-133 32-151-29-67 5-106-43-79-99-56-27-57-73 11-91Z"/><path d="M477 442c33-59 97-73 142-38 42-41 105-25 112 23 61-1 92 41 76 83 34 26 25 64-13 82 6 43-31 69-70 55-25 45-78 50-112 18-41 39-96 23-108-21-48 4-76-30-57-70-40-19-41-52 8-65Z"/><path d="M574 472c22-37 61-45 88-24 25-25 65-16 70 15 37 0 56 25 46 50 21 16 16 39-8 49 4 27-19 44-44 35-16 28-49 31-71 11-26 24-60 14-68-13-30 2-47-19-35-44-25-12-26-33 5-41Z"/></g>',
    '<g class="atlas-coast-detail"><path d="M384 343c46-50 114-58 160-28m74-33c49-21 104-4 123 28m138 35c51 14 75 52 65 91m20 103c20 39 7 78-26 94m-125 40c-43 28-94 22-122-8m-118 13c-43 3-73-19-78-54m-74-95c-34-19-43-55-26-82"/></g>',
    '<g class="atlas-route"><path d="M419 404C514 358 578 447 681 485s175-136 262-139 72 161 98 185-104 137-214 146-180 81-253 19-71-191-155-292Z"/><path d="M125 615c107-76 178-82 265-45m689 153c89 39 145 19 207-25"/></g>',
    '<g class="atlas-rosette" transform="translate(177 524)"><circle r="44"/><circle r="30" stroke-dasharray="2 5"/><path d="M0-54 8-6 0 0-8-6ZM54 0 6 8 0 0 6-8ZM0 54-8 6 0 0 8 6ZM-54 0-6-8 0 0-6 8Z"/><circle r="5" fill="var(--map-route)"/></g>',
    '<g class="atlas-svg-label"><text x="104" y="119">THE LIMINAL SEA</text><text x="439" y="280">MOSSGLASS REACH</text><text x="1050" y="358">THE STAR-TIDE</text><text x="372" y="638">THE UNFINISHED SHORE</text><text x="793" y="815">THE SECOND MERIDIAN</text></g>',
    '<g class="atlas-svg-note"><text x="88" y="587">no fixed north</text><text x="1080" y="705">the long way home</text></g>',
    '<g class="atlas-svg-tiny"><text x="78" y="915">CHART 00 / ALL HOURS</text><text x="1150" y="920">SCALE: A STORY</text><text x="1050" y="113">OUTSIDE THE CLOCK</text></g>',
    '<path class="atlas-rosette" d="M1125 562c31-28 67-28 98 0m-49-57v114m-57-57h114"/><circle class="atlas-rosette" cx="1174" cy="562" r="20"/>',
    '</svg>'
  ];
  const artwork = new DOMParser().parseFromString(artworkParts.join(""), "image/svg+xml").documentElement;
  L.svgOverlay(artwork, bounds, { interactive: false }).addTo(map);

  const places = [
    { id: "workshop", x: 680, y: 480, name: "Vesperglass Workshop", glyph: "⌂", route: "/", section: "Welcome", note: "A workshop set at the crossing of several unfinished paths." },
    { id: "threshold", x: 425, y: 405, name: "Threshold House", glyph: "◈", route: "/about/", section: "About Vesperglass", note: "A place to learn what this workshop is for and who is building here." },
    { id: "foundry", x: 820, y: 650, name: "Tideglass Foundry", glyph: "▦", route: "/projects/", section: "Projects", note: "A directory of repositories, experiments, and things to try." },
    { id: "compass", x: 590, y: 705, name: "Compass Garden", glyph: "✳", route: "/principles/", section: "How we work", note: "A few steady habits for making useful things with care." },
    { id: "logbook", x: 1010, y: 500, name: "Observatory Logbook", glyph: "✎", route: "/field-notes/", section: "Field notes", note: "Short guides, observations, and details worth keeping." },
    { id: "archive", x: 855, y: 330, name: "Star Archive", glyph: "✧", route: "/research/", section: "Research & Essays", note: "Source-led explorations of the sky, objects, history, and ideas." }
  ];

  const escapeHtml = (value) => {
    const node = document.createElement("span");
    node.textContent = value;
    return node.innerHTML;
  };

  const markers = new Map();
  places.forEach((place) => {
    const position = [1000 - place.y, place.x];
    const icon = L.divIcon({
      className: "atlas-pin",
      iconSize: [168, 34],
      iconAnchor: [14, 17],
      html: '<span class="atlas-pin__mark" aria-hidden="true">' + escapeHtml(place.glyph) + '</span><span class="atlas-pin__label">' + escapeHtml(place.name) + '</span>'
    });
    const marker = L.marker(position, {
      title: place.name + " — " + place.section,
      alt: place.name + ", " + place.section,
      icon: icon,
      keyboard: true,
      riseOnHover: true
    }).addTo(map);
    const popup = document.createElement("div");
    popup.className = "atlas-popup";
    const kicker = document.createElement("span");
    kicker.className = "atlas-popup-kicker";
    kicker.textContent = "A PLACE IN VESPERGLASS";
    const heading = document.createElement("h3");
    heading.textContent = place.name;
    const summary = document.createElement("p");
    summary.textContent = place.note;
    const link = document.createElement("a");
    link.href = place.route;
    link.textContent = "Open " + place.section + " →";
    popup.append(kicker, heading, summary, link);
    marker.bindPopup(popup, { closeButton: true, autoPan: true, maxWidth: 260, minWidth: 210 });
    markers.set(place.id, marker);
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);
  map.fitBounds(bounds, { padding: [14, 14] });
  resetButton?.addEventListener("click", () => map.flyToBounds(bounds, { padding: [14, 14], duration: 0.55 }));
  container.querySelector("#atlas-map-fallback")?.remove();
  window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
})();