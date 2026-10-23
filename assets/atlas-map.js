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
  const fogLayer = document.createElement("div");
  fogLayer.className = "atlas-space-fog";
  const orbitLayer = document.createElement("div");
  orbitLayer.className = "atlas-space-orbit";
  const nebulaLayer = document.createElement("div");
  nebulaLayer.className = "atlas-space-nebula";
  nebulaLayer.setAttribute("role", "presentation");
  for (let row = 1; row <= 3; row += 1) {
    for (let column = 1; column <= 3; column += 1) {
      const tile = document.createElement("img");
      tile.src = `/assets/atlas-orbit-field-v2-r${row}c${column}.png`;
      tile.alt = "";
      tile.draggable = false;
      tile.decoding = "async";
      tile.className = "atlas-space-tile";
      nebulaLayer.appendChild(tile);
    }
  }
  orbitLayer.appendChild(nebulaLayer);
  const effectsCanvas = document.createElement("canvas");
  effectsCanvas.className = "atlas-space-effects";
  effectsCanvas.setAttribute("aria-hidden", "true");
  const effectsContext = effectsCanvas.getContext("2d", { alpha: true });
  const nearLayer = document.createElement("div");
  nearLayer.className = "atlas-space-layer atlas-space-layer--near";
  spaceScene.append(deepLayer, fogLayer, effectsCanvas, orbitLayer, nearLayer);
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
  let effectsFrame = 0;
  let lastEffectsFrameAt = 0;
  let effectStars = [];
  let activeComet = null;
  let nextCometAt = 0;

  const resizeEffects = () => {
    if (!effectsContext || !sceneWidth || !sceneHeight) return;
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    effectsCanvas.width = Math.round(sceneWidth * pixelRatio);
    effectsCanvas.height = Math.round(sceneHeight * pixelRatio);
    effectsCanvas.style.width = `${sceneWidth}px`;
    effectsCanvas.style.height = `${sceneHeight}px`;
    effectsContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const count = Math.min(88, Math.max(48, Math.round(sceneWidth * sceneHeight / 12000)));
    effectStars = Array.from({ length: count }, () => ({
      x: Math.random() * sceneWidth,
      y: Math.random() * sceneHeight,
      radius: 0.35 + Math.random() * 0.65,
      base: 0.035 + Math.random() * 0.045,
      pulse: 0.04 + Math.random() * 0.11,
      speed: 0.35 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() < 0.14 ? "224,198,154" : "194,218,255"
    }));
    drawSpaceEffects(performance.now());
  };

  const drawSpaceEffects = (now) => {
    if (!effectsContext || !sceneWidth || !sceneHeight) return;
    effectsContext.clearRect(0, 0, sceneWidth, sceneHeight);
    effectStars.forEach((star) => {
      const twinkle = motionPreference.matches ? 0.45 : (0.5 + Math.sin(now * 0.001 * star.speed + star.phase) * 0.5);
      effectsContext.beginPath();
      effectsContext.fillStyle = `rgba(${star.color},${star.base + star.pulse * twinkle})`;
      effectsContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      effectsContext.fill();
    });

    if (activeComet && !motionPreference.matches) {
      const progress = (now - activeComet.startedAt) / activeComet.duration;
      if (progress >= 1) {
        activeComet = null;
      } else if (progress >= 0) {
        const x = activeComet.x + activeComet.dx * progress;
        const y = activeComet.y + activeComet.dy * progress;
        const fadeIn = Math.min(1, progress / 0.12);
        const burnOut = Math.max(0, 1 - Math.max(0, progress - 0.28) / 0.72);
        const alpha = Math.min(fadeIn, burnOut) * 0.72;
        const tail = 42;
        const length = Math.hypot(activeComet.dx, activeComet.dy) || 1;
        const tailX = x - activeComet.dx / length * tail;
        const tailY = y - activeComet.dy / length * tail;
        const trail = effectsContext.createLinearGradient(tailX, tailY, x, y);
        trail.addColorStop(0, "rgba(190,218,255,0)");
        trail.addColorStop(0.72, `rgba(190,218,255,${alpha * 0.38})`);
        trail.addColorStop(1, `rgba(231,241,255,${alpha})`);
        effectsContext.beginPath();
        effectsContext.moveTo(tailX, tailY);
        effectsContext.lineTo(x, y);
        effectsContext.strokeStyle = trail;
        effectsContext.lineWidth = 1.15;
        effectsContext.stroke();
        effectsContext.beginPath();
        effectsContext.arc(x, y, 1.35, 0, Math.PI * 2);
        effectsContext.fillStyle = `rgba(238,246,255,${alpha})`;
        effectsContext.fill();
      }
    }
  };

  const animateSpaceEffects = (now) => {
    if (motionPreference.matches) {
      effectsFrame = 0;
      return;
    }
    if (now - lastEffectsFrameAt < 33) {
      effectsFrame = window.requestAnimationFrame(animateSpaceEffects);
      return;
    }
    lastEffectsFrameAt = now;
    if (!activeComet && now >= nextCometAt) {
      activeComet = {
        x: Math.random() * sceneWidth * 0.72,
        y: Math.random() * sceneHeight * 0.64,
        dx: (Math.random() < 0.5 ? -1 : 1) * (75 + Math.random() * 110),
        dy: 55 + Math.random() * 95,
        startedAt: now,
        duration: 1200 + Math.random() * 800
      };
      nextCometAt = now + 15000 + Math.random() * 18000;
    }
    drawSpaceEffects(now);
    effectsFrame = window.requestAnimationFrame(animateSpaceEffects);
  };

  const positionOrbit = () => {
    orbitLayer.style.transform = `translate3d(calc(-50% + ${orbitX}px), calc(-50% + ${orbitY}px), 0)`;
  };

  const updateParallax = () => {
    if (!sceneWidth || !sceneHeight) return;
    const originalCenter = map.latLngToContainerPoint(baseCenter);
    panX = originalCenter.x - sceneWidth / 2;
    panY = originalCenter.y - sceneHeight / 2;
    const zoomDelta = map.getZoom() - baseZoom;
    fogLayer.style.transform = `translate3d(${panX * 0.055}px, ${panY * 0.055}px, 0) scale(${Math.max(0.96, 1 + zoomDelta * 0.035)})`;
    nearLayer.style.transform = `translate3d(${panX * 0.22}px, ${panY * 0.22}px, 0) scale(${Math.max(0.9, 1 + zoomDelta * 0.05)})`;
    effectsCanvas.style.transform = `translate3d(${panX * 0.055}px, ${panY * 0.055}px, 0) scale(${Math.max(0.96, 1 + zoomDelta * 0.035)})`;
    positionOrbit();
  };

  const updateSceneSize = () => {
    const rect = container.getBoundingClientRect();
    sceneWidth = rect.width;
    sceneHeight = rect.height;
    resizeEffects();
    // The nine source tiles are each 1024 × 1024. Keep their 3 × 3 canvas at
    // native resolution so browser scaling does not soften the nebula texture.
    const imageWidth = 3072;
    nebulaLayer.style.width = `${imageWidth}px`;
    nebulaLayer.style.height = `${imageWidth}px`;
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
      if (effectsFrame) window.cancelAnimationFrame(effectsFrame);
      orbitFrame = 0;
      effectsFrame = 0;
      orbitStartedAt = null;
      orbitX = 0;
      orbitY = 0;
      activeComet = null;
      positionOrbit();
      drawSpaceEffects(0);
    } else if (!orbitFrame) {
      orbitStartedAt = null;
      orbitFrame = window.requestAnimationFrame(animateOrbit);
      nextCometAt = performance.now() + 2500 + Math.random() * 4000;
      effectsFrame = window.requestAnimationFrame(animateSpaceEffects);
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
