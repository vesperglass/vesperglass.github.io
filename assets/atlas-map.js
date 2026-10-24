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
  const starDriftLayer = document.createElement("div");
  starDriftLayer.className = "atlas-space-star-drift";
  starDriftLayer.setAttribute("role", "presentation");
  for (let row = 1; row <= 3; row += 1) {
    for (let column = 1; column <= 3; column += 1) {
      const tile = document.createElement("img");
      tile.src = `/assets/atlas-orbit-stars-r${row}c${column}.svg`;
      tile.alt = "";
      tile.draggable = false;
      tile.decoding = "async";
      tile.className = "atlas-space-tile";
      starDriftLayer.appendChild(tile);
    }
  }
  orbitLayer.appendChild(starDriftLayer);
  const effectsCanvas = document.createElement("canvas");
  effectsCanvas.className = "atlas-space-effects";
  effectsCanvas.setAttribute("aria-hidden", "true");
  const effectsContext = effectsCanvas.getContext("2d", { alpha: true });
  spaceScene.append(deepLayer, fogLayer, orbitLayer, effectsCanvas);
  container.appendChild(spaceScene);

  const places = [
    // Pins, island floor anchors, and courier destinations share these map-space anchors.
    { id: "workshop", floatDuration: 7.4, floatDelay: -0.8, x: 839, y: 410, name: "Vesperglass Workshop", glyph: "⌂", route: "/", section: "Welcome", note: "A workshop set at the crossing of several unfinished paths." },
    { id: "threshold", floatDuration: 8.1, floatDelay: -4.3, x: 487, y: 190, name: "Threshold House", glyph: "◈", route: "/about/", section: "About Vesperglass", note: "A place to learn what this workshop is for and who is building here." },
    { id: "foundry", floatDuration: 9, floatDelay: -6.1, x: 1287, y: 717, name: "Tideglass Foundry", glyph: "▦", route: "/projects/", section: "Projects", note: "A directory of repositories, experiments, and things to try." },
    { id: "compass", floatDuration: 7.7, floatDelay: -2.8, x: 414, y: 717, name: "Compass Garden", glyph: "✳", route: "/principles/", section: "How we work", note: "A few steady habits for making useful things with care." },
    { id: "logbook", floatDuration: 8.6, floatDelay: -5.5, x: 1176, y: 190, name: "Observatory Logbook", glyph: "✎", route: "/field-notes/", section: "Field notes", note: "Short guides, observations, and details worth keeping." },
    { id: "archive", floatDuration: 6.9, floatDelay: -1.9, x: 175, y: 300, name: "Star Archive", glyph: "✧", route: "/research/", section: "Research & Essays", note: "Source-led explorations of the sky, objects, history, and ideas." }
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
      html: '<span class="atlas-pin-float" style="--atlas-float-duration:' + place.floatDuration + 's;--atlas-float-delay:' + place.floatDelay + 's;--atlas-float-distance:-4px"><span class="atlas-pin__mark" aria-hidden="true">' + escapeHtml(place.glyph) + '</span></span>'
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

  const placeById = new Map(places.map((place) => [place.id, place]));
  // floorX/floorY are PNG-native pixels at each island's open landing floor.
  // The image is anchored there, keeping every pin on the usable floor rather
  // than at the center of the taller building or transparent image canvas.
  const landmarkArtwork = [
    { id: "archive", file: "atlas-island-archive.png", width: 330, height: 330, sourceWidth: 1254, sourceHeight: 1254, floorX: 627, floorY: 850, alt: "Star Archive, a glass reading pavilion and armillary on its own crisp floating glass-and-bronze landing island." },
    { id: "threshold", file: "atlas-island-threshold.png", width: 300, height: 300, sourceWidth: 1254, sourceHeight: 1254, floorX: 627, floorY: 850, alt: "Threshold House, a welcoming glass-and-bronze home on its own floating landing island." },
    { id: "workshop", file: "atlas-island-workshop.png", width: 430, height: 430, sourceWidth: 1254, sourceHeight: 1254, floorX: 627, floorY: 875, alt: "Vesperglass Workshop, a glass-and-bronze maker's hall on its own detailed floating landing island." },
    { id: "logbook", file: "atlas-island-observatory.png", width: 270, height: 270, sourceWidth: 1254, sourceHeight: 1254, floorX: 627, floorY: 900, alt: "Observatory Logbook, a glass tower with a copper dome and telescope on its own floating landing island." },
    { id: "compass", file: "atlas-island-garden.png", width: 390, height: 390, sourceWidth: 1254, sourceHeight: 1254, floorX: 627, floorY: 850, alt: "Compass Garden, a glass greenhouse and flowering compass garden on its own floating landing island." },
    { id: "foundry", file: "atlas-island-foundry.png", width: 370, height: 370, sourceWidth: 1254, sourceHeight: 1254, floorX: 627, floorY: 875, alt: "Tideglass Foundry, a glass-and-bronze foundry with a copper chimney and glowing furnace on its own floating landing island." }
  ];
  const islandOverlays = [];
  landmarkArtwork.forEach((artwork) => {
    const place = places.find((candidate) => candidate.id === artwork.id);
    if (!place) return;
    const floorOffsetX = (artwork.floorX / artwork.sourceWidth) * artwork.width;
    const floorOffsetY = (artwork.floorY / artwork.sourceHeight) * artwork.height;
    const west = place.x - floorOffsetX;
    const east = west + artwork.width;
    const imageTop = place.y - floorOffsetY;
    const north = 1024 - imageTop;
    const south = 1024 - (imageTop + artwork.height);
    const overlay = L.imageOverlay(`/assets/${artwork.file}`, [[south, west], [north, east]], {
      alt: artwork.alt,
      interactive: false
    });
    overlay.on("add", () => {
      const element = overlay.getElement();
      if (!element) return;
      element.classList.add("atlas-island-art");
      element.style.setProperty("--atlas-float-duration", `${place.floatDuration}s`);
      element.style.setProperty("--atlas-float-delay", `${place.floatDelay}s`);
      element.style.setProperty("--atlas-float-distance", "-4px");
    });
    overlay.addTo(map);
    overlay.getElement()?.classList.add("atlas-island-art");
    overlay.getElement()?.style.setProperty("--atlas-float-duration", `${place.floatDuration}s`);
    overlay.getElement()?.style.setProperty("--atlas-float-delay", `${place.floatDelay}s`);
    islandOverlays.push(overlay);
  });
  const courierRoutes = [
    { from: "foundry", to: "workshop", item: "⚙", label: "a fresh-forged component", tint: "bronze" },
    { from: "compass", to: "threshold", item: "✿", label: "garden clippings", tint: "green" },
    { from: "archive", to: "logbook", item: "▤", label: "a field book", tint: "blue" },
    { from: "logbook", to: "archive", item: "✧", label: "an annotated star chart", tint: "blue" }
  ];
  const toLatLng = (placeId) => {
    const place = placeById.get(placeId);
    return [1024 - place.y, place.x];
  };
  const courierIcon = L.divIcon({
    className: "atlas-courier",
    iconSize: [14.5, 19.333],
    iconAnchor: [7.25, 16.75],
    html: '<span class="atlas-courier__art" aria-hidden="true">' +
      '<span class="atlas-courier__sprite"></span>' +
      '<span class="atlas-courier__cargo"></span></span>'
  });
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Keep route motion in one stable projection. The map chooses its initial
  // zoom in fitBounds(), so this value is reset to that zoom afterward.
  let courierZoom = 0;
  let courierWorldPosition = map.project(toLatLng("foundry"), courierZoom);
  const firstTarget = map.project(toLatLng("workshop"), courierZoom);
  let courierHeading = Math.atan2(firstTarget.y - courierWorldPosition.y, firstTarget.x - courierWorldPosition.x);
  let courierSpeed = 0;
  let courierRouteIndex = 0;
  let courierFrame = 0;
  let courierTimer = 0;
  let courierSmokeTimer = 0;
  let courierActive = false;
  let courierStarted = false;
  let courierPaused = false;
  let courierGoal = null;
  let courierArrival = null;
  let courierPhase = "delivery";
  let smokeIconId = 0;
  const courierMarker = L.marker(toLatLng("foundry"), {
    icon: courierIcon,
    interactive: false,
    keyboard: false,
    zIndexOffset: 1200,
    opacity: 0.98
  }).addTo(map);
  const courierDebugEnabled = new URLSearchParams(window.location.search).get("courier-debug") === "1";
  let courierDebugMarker = null;
  let courierDebugPanel = null;
  if (courierDebugEnabled) {
    const debugIcon = L.divIcon({
      className: "atlas-courier-debug-marker",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      html: '<span class="atlas-courier-debug-marker__crosshair" aria-hidden="true"></span>'
    });
    courierDebugMarker = L.marker(courierMarker.getLatLng(), {
      icon: debugIcon,
      interactive: false,
      keyboard: false,
      zIndexOffset: 1190
    }).addTo(map);
    courierDebugPanel = document.createElement("output");
    courierDebugPanel.className = "atlas-courier-debug-readout";
    courierDebugPanel.setAttribute("aria-live", "off");
    courierDebugPanel.textContent = "Courier map-position trace";
    container.appendChild(courierDebugPanel);
  }
  // Sprite cells: E, SE, S, SW / W, NE, N, NW. Octants follow screen-space heading.
  const courierSpriteByOctant = [0, 1, 2, 3, 4, 5, 6, 7];
  const setCourierFacing = () => {
    const element = courierMarker.getElement();
    if (!element) return;
    const octant = ((Math.round(courierHeading / (Math.PI / 4)) % 8) + 8) % 8;
    const direction = courierSpriteByOctant[octant];
    const sprite = element.querySelector(".atlas-courier__sprite");
    if (sprite) sprite.style.backgroundPosition = `${-(direction % 4) * 14.5}px ${-Math.floor(direction / 4) * 19.333}px`;
  };
  const updateCourierDebugReadout = () => {
    if (!courierDebugPanel) return;
    const latLng = map.unproject(courierWorldPosition, courierZoom);
    const mapX = latLng.lng;
    const mapY = bounds.getNorth() - latLng.lat;
    const icon = courierMarker.getElement();
    if (!icon) return;
    const iconRect = icon.getBoundingClientRect();
    const mapRect = container.getBoundingClientRect();
    const expected = map.latLngToContainerPoint(latLng);
    const actualX = iconRect.left - mapRect.left + courierIcon.options.iconAnchor[0];
    const actualY = iconRect.top - mapRect.top + courierIcon.options.iconAnchor[1];
    const deltaX = actualX - expected.x;
    const deltaY = actualY - expected.y;
    const renderedLatLng = map.containerPointToLatLng([actualX, actualY]);
    const renderedX = renderedLatLng.lng;
    const renderedY = bounds.getNorth() - renderedLatLng.lat;
    courierDebugMarker?.setLatLng(renderedLatLng);
    courierDebugPanel.textContent = `COURIER TRACE · stored px ${mapX.toFixed(1)}, ${mapY.toFixed(1)} · rendered px ${renderedX.toFixed(1)}, ${renderedY.toFixed(1)} · zoom ${map.getZoom().toFixed(2)} · anchor Δ ${deltaX.toFixed(2)}, ${deltaY.toFixed(2)} px`;
  };
  const setCourierCargo = (route) => {
    const element = courierMarker.getElement();
    if (!element) return;
    const cargo = element.querySelector(".atlas-courier__cargo");
    if (cargo) {
      cargo.textContent = route?.item || "";
      cargo.title = route?.label || "";
      cargo.hidden = !route;
    }
    if (route) element.dataset.cargo = route.tint;
    else delete element.dataset.cargo;
  };
  const setCourierPosition = () => {
    courierMarker.setLatLng(map.unproject(courierWorldPosition, courierZoom));
    setCourierFacing();
    updateCourierDebugReadout();
  };
  let courierReferenceZoom = null;
  const updateCourierArtworkScale = (zoom = map.getZoom()) => {
    if (courierReferenceZoom === null) return;
    const element = courierMarker.getElement();
    if (element) element.style.setProperty("--courier-map-scale", String(Math.pow(2, zoom - courierReferenceZoom)));
  };
  map.on("zoom", () => updateCourierArtworkScale(map.getZoom()));
  map.on("zoomanim", (event) => updateCourierArtworkScale(event.zoom));
  map.on("move zoom", updateCourierDebugReadout);
  const addCourierSmoke = (now) => {
    if (now - courierSmokeTimer < 180) return;
    courierSmokeTimer = now;
    const spread = 3 + Math.random() * 5;
    const trailingDistance = 12 + Math.random() * 6;
    const smokePoint = L.point(
      courierWorldPosition.x - Math.cos(courierHeading) * trailingDistance + (Math.random() - 0.5) * spread,
      courierWorldPosition.y - Math.sin(courierHeading) * trailingDistance + (Math.random() - 0.5) * spread
    );
    const size = 11 + Math.random() * 8;
    const puffIcon = L.divIcon({
      className: `atlas-courier-smoke atlas-courier-smoke--${smokeIconId++ % 3}`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      html: '<span aria-hidden="true"></span>'
    });
    const puff = L.marker(map.unproject(smokePoint, courierZoom), {
      icon: puffIcon,
      interactive: false,
      keyboard: false,
      zIndexOffset: 1120 + Math.round(Math.random() * 20)
    }).addTo(map);
    window.setTimeout(() => map.removeLayer(puff), 3450);
  };
  const courierTuning = {
    maxSpeed: 102,
    acceleration: 108,
    maxTurnRate: 0.92,
    finalApproachRadius: 22,
    finalApproachSpeed: 38,
    arrivalRadius: 3.8,
    progressEpsilon: 1.5,
    // Allow a full turn before treating a route as stalled. The courier keeps
    // its heading between legs, so a return trip can begin with a U-turn.
    progressTimeout: 3800,
    recoverySpeed: 34
  };
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const runCourierFlight = () => {
    if (!courierGoal || motionPreference.matches) return;
    courierActive = true;
    courierPaused = false;
    const element = courierMarker.getElement();
    element?.classList.add("is-flying");
    let previousTime = 0;
    let bestDistance = Infinity;
    let lastProgressAt = 0;
    let recoveryApproach = false;
    const animate = (now) => {
      if (motionPreference.matches) {
        courierActive = false;
        courierPaused = true;
        courierSpeed = 0;
        courierFrame = 0;
        element?.classList.remove("is-flying");
        return;
      }
      const dt = previousTime ? Math.min(0.045, (now - previousTime) / 1000) : 0.016;
      previousTime = now;
      const dx = courierGoal.x - courierWorldPosition.x;
      const dy = courierGoal.y - courierWorldPosition.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= courierTuning.arrivalRadius) {
        courierActive = false;
        courierFrame = 0;
        element?.classList.remove("is-flying");
        const arrived = courierArrival;
        courierGoal = null;
        courierArrival = null;
        courierSpeed = 0;
        arrived?.();
        return;
      }
      if (distance < bestDistance - courierTuning.progressEpsilon) {
        bestDistance = distance;
        lastProgressAt = now;
        recoveryApproach = false;
      } else if (lastProgressAt && now - lastProgressAt >= courierTuning.progressTimeout) {
        recoveryApproach = true;
      }
      const desiredHeading = Math.atan2(dy, dx);
      const difference = Math.atan2(Math.sin(desiredHeading - courierHeading), Math.cos(desiredHeading - courierHeading));
      courierHeading += clamp(difference, -courierTuning.maxTurnRate * dt, courierTuning.maxTurnRate * dt);
      let speedLimit = courierTuning.maxSpeed;
      if (distance < courierTuning.finalApproachRadius) {
        speedLimit = Math.min(speedLimit, courierTuning.finalApproachSpeed);
      }
      if (recoveryApproach) speedLimit = Math.min(speedLimit, courierTuning.recoverySpeed);
      const stoppingDistance = Math.max(0, distance - courierTuning.arrivalRadius);
      const stoppingSpeed = Math.sqrt(2 * courierTuning.acceleration * stoppingDistance);
      const turnPenalty = Math.max(0.4, 1 - Math.abs(difference) * 0.32);
      const desiredSpeed = Math.min(speedLimit * turnPenalty, stoppingSpeed);
      courierSpeed += clamp(desiredSpeed - courierSpeed, -courierTuning.acceleration * dt, courierTuning.acceleration * dt);
      const travel = Math.min(distance, courierSpeed * dt);
      courierWorldPosition = L.point(
        courierWorldPosition.x + Math.cos(courierHeading) * travel,
        courierWorldPosition.y + Math.sin(courierHeading) * travel
      );
      setCourierPosition();
      addCourierSmoke(now);
      courierFrame = window.requestAnimationFrame(animate);
    };
    courierFrame = window.requestAnimationFrame(animate);
  };
  const startCourierFlight = (targetLatLng, onArrival) => {
    courierGoal = map.project(targetLatLng, courierZoom);
    courierArrival = onArrival;
    runCourierFlight();
  };
  const beginCourierDelivery = (routeIndex) => {
    if (motionPreference.matches) return;
    courierStarted = true;
    courierPhase = "delivery";
    courierRouteIndex = routeIndex;
    const route = courierRoutes[routeIndex];
    setCourierCargo(route);
    startCourierFlight(toLatLng(route.to), () => {
      courierPhase = "transfer";
      courierTimer = window.setTimeout(() => {
        courierTimer = 0;
        beginCourierTransfer((routeIndex + 1) % courierRoutes.length);
      }, 1100);
    });
  };
  const beginCourierTransfer = (nextRouteIndex) => {
    if (motionPreference.matches) return;
    courierPhase = "transfer";
    setCourierCargo(null);
    const nextRoute = courierRoutes[nextRouteIndex];
    startCourierFlight(toLatLng(nextRoute.from), () => beginCourierDelivery(nextRouteIndex));
  };
  setCourierCargo(courierRoutes[0]);
  setCourierFacing();
  updateCourierDebugReadout();
  const updateCourierMotion = () => {
    if (motionPreference.matches) {
      if (courierFrame) window.cancelAnimationFrame(courierFrame);
      if (courierTimer) window.clearTimeout(courierTimer);
      courierFrame = 0;
      courierTimer = 0;
      courierPaused = Boolean(courierGoal || courierStarted);
      courierActive = false;
      courierSpeed = 0;
      courierMarker.getElement()?.classList.remove("is-flying");
    } else if (courierPaused && courierGoal) {
      runCourierFlight();
    } else if (courierPaused && courierPhase === "transfer") {
      courierPaused = false;
      beginCourierTransfer((courierRouteIndex + 1) % courierRoutes.length);
    } else if (courierStarted && courierPhase === "delivery") {
      courierPaused = false;
      beginCourierDelivery(courierRouteIndex);
    } else if (!courierStarted) {
      courierTimer = window.setTimeout(() => {
        courierTimer = 0;
        beginCourierDelivery(0);
      }, 1800);
    }
  };

  L.control.zoom({ position: "bottomright" }).addTo(map);
  map.fitBounds(bounds, { padding: [14, 14] });
  // fitBounds establishes the real initial view. Seed route coordinates only
  // after that, then keep this projection zoom fixed for every later pan/zoom.
  courierZoom = map.getZoom();
  courierWorldPosition = map.project(toLatLng("foundry"), courierZoom);
  const initialTarget = map.project(toLatLng("workshop"), courierZoom);
  courierHeading = Math.atan2(initialTarget.y - courierWorldPosition.y, initialTarget.x - courierWorldPosition.x);
  courierGoal = null;
  courierReferenceZoom = courierZoom;
  courierMarker.setLatLng(toLatLng("foundry"));
  updateCourierArtworkScale(map.getZoom());
  setCourierPosition();

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
  let effectClusters = [];
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
    const count = Math.min(260, Math.max(150, Math.round(sceneWidth * sceneHeight / 3200)));
    effectStars = Array.from({ length: count }, () => ({
      x: Math.random() * sceneWidth,
      y: Math.random() * sceneHeight,
      radius: 0.35 + Math.random() * 0.85,
      base: 0.045 + Math.random() * 0.075,
      pulse: 0.06 + Math.random() * 0.16,
      speed: 0.35 + Math.random() * 0.65,
      phase: Math.random() * Math.PI * 2,
      color: ["194,218,255", "194,218,255", "194,218,255", "224,198,154", "133,211,218"][Math.floor(Math.random() * 5)]
    }));
    effectClusters = Array.from({ length: 7 }, () => {
      const x = Math.random() * sceneWidth;
      const y = Math.random() * sceneHeight;
      const radius = 22 + Math.random() * 42;
      const color = Math.random() < 0.5 ? "111,184,230" : "173,142,220";
      const stars = Array.from({ length: 14 + Math.floor(Math.random() * 16) }, () => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.sqrt(Math.random()) * radius;
        return { x: x + Math.cos(angle) * distance, y: y + Math.sin(angle) * distance, radius: 0.35 + Math.random() * 0.9, alpha: 0.1 + Math.random() * 0.35, phase: Math.random() * Math.PI * 2 };
      });
      return { x, y, radius, color, stars };
    });
    drawSpaceEffects(performance.now());
  };

  const drawSpaceEffects = (now) => {
    if (!effectsContext || !sceneWidth || !sceneHeight) return;
    effectsContext.clearRect(0, 0, sceneWidth, sceneHeight);
    effectClusters.forEach((cluster) => {
      const haze = effectsContext.createRadialGradient(cluster.x, cluster.y, 0, cluster.x, cluster.y, cluster.radius);
      haze.addColorStop(0, `rgba(${cluster.color},0.10)`);
      haze.addColorStop(0.42, `rgba(${cluster.color},0.035)`);
      haze.addColorStop(1, `rgba(${cluster.color},0)`);
      effectsContext.fillStyle = haze;
      effectsContext.fillRect(cluster.x - cluster.radius, cluster.y - cluster.radius, cluster.radius * 2, cluster.radius * 2);
      cluster.stars.forEach((star) => {
        const pulse = motionPreference.matches ? 0.65 : 0.55 + Math.sin(now * 0.0012 + star.phase) * 0.45;
        effectsContext.beginPath();
        effectsContext.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        effectsContext.fillStyle = `rgba(222,236,255,${star.alpha * pulse})`;
        effectsContext.fill();
      });
    });
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
    const zoomScale = Math.max(0.985, 1 + (map.getZoom() - baseZoom) * 0.012);
    orbitLayer.style.transform = `translate3d(calc(-50% + ${orbitX + panX * 0.025}px), calc(-50% + ${orbitY + panY * 0.025}px), 0) scale(${zoomScale})`;
  };

  const updateParallax = () => {
    if (!sceneWidth || !sceneHeight) return;
    const originalCenter = map.latLngToContainerPoint(baseCenter);
    panX = originalCenter.x - sceneWidth / 2;
    panY = originalCenter.y - sceneHeight / 2;
    const zoomDelta = map.getZoom() - baseZoom;
    fogLayer.style.transform = `translate3d(${panX * 0.02}px, ${panY * 0.02}px, 0) scale(${Math.max(0.99, 1 + zoomDelta * 0.01)})`;
    effectsCanvas.style.transform = `translate3d(${panX * 0.075}px, ${panY * 0.075}px, 0) scale(${Math.max(0.97, 1 + zoomDelta * 0.025)})`;
    positionOrbit();
  };

  const updateSceneSize = () => {
    const rect = container.getBoundingClientRect();
    sceneWidth = rect.width;
    sceneHeight = rect.height;
    resizeEffects();
    // The nine source tiles each cover a 1024 × 1024 viewBox. Keep their
    // seamless 3 × 3 star field at native resolution.
    const imageWidth = 3072;
    starDriftLayer.style.width = `${imageWidth}px`;
    starDriftLayer.style.height = `${imageWidth}px`;
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
    updateCourierMotion();
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
