(() => {
  const container = document.getElementById("vesperglass-atlas");
  const resetButton = document.getElementById("atlas-reset");
  const fullscreenButton = document.getElementById("atlas-fullscreen");
  const mapCard = container?.closest(".atlas-map-card");
  if (!container || !window.L) return;

  const bounds = L.latLngBounds([[0, 0], [1024, 1536]]);
  const map = L.map(container, {
    crs: L.CRS.Simple,
    zoomControl: false,
    attributionControl: false,
    minZoom: -2,
    maxZoom: 1.5,
    maxBounds: bounds.pad(0.12),
    maxBoundsViscosity: 0.72,
    zoomSnap: 0.1,
    zoomDelta: 0.25,
    wheelPxPerZoomLevel: 90,
    keyboard: true
  });

  L.imageOverlay("/assets/atlas-platform.webp", bounds, {
    alt: "The Elsewhere Atlas of Vesperglass: a fictional glass-and-bronze workshop platform floating through a starry void, viewed from above at an angle.",
    interactive: false
  }).addTo(map);

  const places = [
    { id: "workshop", x: 775, y: 560, name: "Vesperglass Workshop", glyph: "⌂", route: "/", section: "Welcome", note: "A workshop set at the crossing of several unfinished paths." },
    { id: "threshold", x: 480, y: 330, name: "Threshold House", glyph: "◈", route: "/about/", section: "About Vesperglass", note: "A place to learn what this workshop is for and who is building here." },
    { id: "foundry", x: 1190, y: 745, name: "Tideglass Foundry", glyph: "▦", route: "/projects/", section: "Projects", note: "A directory of repositories, experiments, and things to try." },
    { id: "compass", x: 535, y: 590, name: "Compass Garden", glyph: "✳", route: "/principles/", section: "How we work", note: "A few steady habits for making useful things with care." },
    { id: "logbook", x: 1015, y: 250, name: "Observatory Logbook", glyph: "✎", route: "/field-notes/", section: "Field notes", note: "Short guides, observations, and details worth keeping." },
    { id: "archive", x: 155, y: 360, name: "Star Archive", glyph: "✧", route: "/research/", section: "Research & Essays", note: "Source-led explorations of the sky, objects, history, and ideas." }
  ];

  const escapeHtml = (value) => {
    const node = document.createElement("span");
    node.textContent = value;
    return node.innerHTML;
  };

  const markers = new Map();
  places.forEach((place) => {
    const position = [1024 - place.y, place.x];
    const icon = L.divIcon({
      className: "atlas-pin",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      html: '<span class="atlas-pin__mark" aria-hidden="true">' + escapeHtml(place.glyph) + '</span>'
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
  const updateFullscreenButton = () => {
    const active = document.fullscreenElement === mapCard;
    if (fullscreenButton) {
      fullscreenButton.setAttribute("aria-pressed", String(active));
      fullscreenButton.setAttribute("aria-label", active ? "Exit full screen" : "View map full screen");
      fullscreenButton.innerHTML = active
        ? 'Exit full screen <span aria-hidden="true">⛶</span>'
        : 'Full screen <span aria-hidden="true">⛶</span>';
    }
    window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
  };
  fullscreenButton?.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement === mapCard) await document.exitFullscreen();
      else if (mapCard?.requestFullscreen) await mapCard.requestFullscreen();
    } catch (_) {
      // The browser may deny fullscreen; the embedded map remains usable.
    }
  });
  document.addEventListener("fullscreenchange", updateFullscreenButton);
  container.querySelector("#atlas-map-fallback")?.remove();
  window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
})();
