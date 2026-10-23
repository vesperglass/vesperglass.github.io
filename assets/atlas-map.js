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

  const spaceScene = document.createElement("div");
  spaceScene.className = "atlas-space-scene";
  spaceScene.setAttribute("aria-hidden", "true");
  const deepLayer = document.createElement("div");
  deepLayer.className = "atlas-space-layer atlas-space-layer--deep";
  const orbitLayer = document.createElement("div");
  orbitLayer.className = "atlas-space-orbit";
  const nebulaLayer = document.createElement("div");
  nebulaLayer.className = "atlas-space-nebula";
  orbitLayer.appendChild(nebulaLayer);
  const nearLayer = document.createElement("div");
  nearLayer.className = "atlas-space-layer atlas-space-layer--near";
  spaceScene.append(deepLayer, orbitLayer, nearLayer);
  container.appendChild(spaceScene);

  L.imageOverlay("/assets/atlas-platform-transparent.webp", bounds, {
    alt: "The Elsewhere Atlas of Vesperglass: a fictional glass-and-bronze workshop platform floating through a starry void, viewed from above at an angle.",
    interactive: false
  }).addTo(map);

  const places = [
    { id: "workshop", x: 775, y: 560, name: "Vesperglass Workshop", glyph: "⌂", route: "/", section: "Welcome", note: "A workshop set at the crossing of several unfinished paths." },
    { id: "threshold", x: 480, y: 330, name: "Threshold House", glyph: "◈", route: "/about/", section: "About Vesperglass", note: "A place to learn what this workshop is for and who is building here." },
    { id: "foundry", x: 1310, y: 790, name: "Tideglass Foundry", glyph: "▦", route: "/projects/", section: "Projects", note: "A directory of repositories, experiments, and things to try." },
    { id: "compass", x: 420, y: 745, name: "Compass Garden", glyph: "✳", route: "/principles/", section: "How we work", note: "A few steady habits for making useful things with care." },
    { id: "logbook", x: 1100, y: 265, name: "Observatory Logbook", glyph: "✎", route: "/field-notes/", section: "Field notes", note: "Short guides, observations, and details worth keeping." },
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

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  let sceneWidth = 0;
  let sceneHeight = 0;
  let baseZoom = map.getZoom();
  const baseCenter = map.getCenter();
  let panX = 0;
  let panY = 0;
  let orbitX = 0;
  let orbitY = 0;
  let orbitRadius = 0;
  let orbitStartedAt = null;
  let orbitFrame = 0;

  const positionOrbit = () => {
    const zoomScale = Math.max(0.92, 1 + (map.getZoom() - baseZoom) * 0.025);
    orbitLayer.style.transform = `translate3d(calc(-50% + ${orbitX + panX * 0.12}px), calc(-50% + ${orbitY + panY * 0.12}px), 0) scale(${zoomScale})`;
  };

  const updateParallax = () => {
    if (!sceneWidth || !sceneHeight) return;
    const originalCenter = map.latLngToContainerPoint(baseCenter);
    panX = originalCenter.x - sceneWidth / 2;
    panY = originalCenter.y - sceneHeight / 2;
    const zoomDelta = map.getZoom() - baseZoom;
    deepLayer.style.transform = `translate3d(${panX * 0.035}px, ${panY * 0.035}px, 0) scale(${Math.max(0.94, 1 + zoomDelta * 0.012)})`;
    nearLayer.style.transform = `translate3d(${panX * 0.22}px, ${panY * 0.22}px, 0) scale(${Math.max(0.9, 1 + zoomDelta * 0.05)})`;
    positionOrbit();
  };

  const updateSceneSize = () => {
    const rect = container.getBoundingClientRect();
    sceneWidth = rect.width;
    sceneHeight = rect.height;
    const diagonal = Math.hypot(sceneWidth, sceneHeight);
    const imageWidth = diagonal * 1.34;
    nebulaLayer.style.width = `${imageWidth}px`;
    nebulaLayer.style.height = `${imageWidth * 2 / 3}px`;
    orbitRadius = Math.min(sceneWidth, sceneHeight) * 0.055;
    updateParallax();
  };

  const animateOrbit = (now) => {
    if (motionPreference.matches) {
      orbitFrame = 0;
      return;
    }
    if (orbitStartedAt === null) orbitStartedAt = now;
    const phase = ((now - orbitStartedAt) % 360000) / 360000 * Math.PI * 2;
    orbitX = Math.cos(phase) * orbitRadius;
    orbitY = Math.sin(phase) * orbitRadius;
    positionOrbit();
    orbitFrame = window.requestAnimationFrame(animateOrbit);
  };

  const updateMotionPreference = () => {
    if (motionPreference.matches) {
      if (orbitFrame) window.cancelAnimationFrame(orbitFrame);
      orbitFrame = 0;
      orbitStartedAt = null;
      orbitX = 0;
      orbitY = 0;
      positionOrbit();
    } else if (!orbitFrame) {
      orbitStartedAt = null;
      orbitFrame = window.requestAnimationFrame(animateOrbit);
    }
  };

  map.on("move zoom", updateParallax);
  if (window.ResizeObserver) new ResizeObserver(updateSceneSize).observe(container);
  updateSceneSize();
  updateMotionPreference();
  motionPreference.addEventListener?.("change", updateMotionPreference);

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
    window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      map.fitBounds(bounds, { padding: [14, 14], animate: false });
    });
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
