(() => {
  const mapElement = document.getElementById("vesperglass-galaxy");
  const seedInput = document.getElementById("galaxy-seed");
  const generateButton = document.getElementById("galaxy-generate");
  const newSeedButton = document.getElementById("galaxy-new-seed");
  const centerButton = document.getElementById("galaxy-center");
  const backButton = document.getElementById("galaxy-back");
  const fullscreenButton = document.getElementById("galaxy-fullscreen");
  const mapShell = mapElement?.closest(".galaxy-map-shell");
  const mapStatus = document.getElementById("galaxy-map-status");
  const inspector = document.getElementById("galaxy-inspector");
  if (!mapElement || !window.L) return;
  const isSharedViewer = Boolean(mapElement.closest(".sim-viewer"));

  let seed = seedInput.value.trim() || "VESPERGLASS-01";
  let mode = "galaxy";
  let redrawTimer = 0;
  let galaxyStarCount = 0;
  let recentViews = [];
  let objectiveStep = 0;
  let objectiveDismissed = false;
  let inspectorCollapsed = false;
  const map = L.map(mapElement, {
    crs: L.CRS.Simple,
    zoomControl: false,
    attributionControl: false,
    minZoom: -2.2,
    maxZoom: 5,
    zoomSnap: 0.1,
    zoomDelta: 0.25,
    wheelPxPerZoomLevel: 100,
    preferCanvas: true
  });
  L.control.zoom({ position: "bottomright" }).addTo(map);
  map.setView([0, 0], 0);
  const starLayer = L.layerGroup().addTo(map);
  const planetLayer = L.layerGroup().addTo(map);
  const orbitLayer = L.layerGroup().addTo(map);
  const portalLayer = L.layerGroup().addTo(map);
  const filterInputs = Array.from(document.querySelectorAll("[data-galaxy-filter]"));
  const filterReset = document.querySelector("[data-galaxy-filter-reset]");
  const layerVisibility = {
    stars: true,
    planets: true,
    portal: true
  };
  const syncLayerVisibility = () => {
    const visibleLayers = [
      [starLayer, layerVisibility.stars],
      [planetLayer, layerVisibility.planets],
      [orbitLayer, layerVisibility.planets],
      [portalLayer, layerVisibility.portal]
    ];
    visibleLayers.forEach(([layer, visible]) => {
      if (visible && !map.hasLayer(layer)) layer.addTo(map);
      else if (!visible && map.hasLayer(layer)) map.removeLayer(layer);
    });
  };
  const updateGalaxyStatus = () => {
    if (mode !== "galaxy") return;
    const starStatus = layerVisibility.stars ? galaxyStarCount.toLocaleString() + " stars charted in view" : "Stars hidden";
    const portalStatus = layerVisibility.portal ? "Vesperglass portal marked" : "Vesperglass portal hidden";
    mapStatus.textContent = starStatus + " · " + portalStatus;
  };
  const setLayerVisibility = (category, visible) => {
    layerVisibility[category] = visible;
    syncLayerVisibility();
    updateGalaxyStatus();
  };
  const cellSize = 190;
  const spectral = [
    { className: "o", label: "Blue giant", color: "#9bc8ff", temperature: [24000, 38000] },
    { className: "a", label: "White star", color: "#d7e7ff", temperature: [8500, 12000] },
    { className: "f", label: "Pale star", color: "#fff1d2", temperature: [6200, 7600] },
    { className: "g", label: "Yellow star", color: "#ffd783", temperature: [5200, 6100] },
    { className: "k", label: "Amber star", color: "#ffad72", temperature: [3700, 5000] },
    { className: "m", label: "Red dwarf", color: "#f17979", temperature: [2400, 3600] }
  ];
  const planetTypes = [
    { name: "Barren", color: "#c9a887" },
    { name: "Terrestrial", color: "#85c7bc" },
    { name: "Ocean", color: "#72bdf2" },
    { name: "Ice", color: "#c6e9ff" },
    { name: "Gas giant", color: "#dfaa75" },
    { name: "Carbon", color: "#bd91d8" }
  ];
  const resources = ["Ice", "Iron", "Silicates", "Carbon", "Rare metals", "Volatiles"];
  const syllablesA = ["Aster", "Bel", "Cael", "Dara", "Eri", "Fara", "Galen", "Hesper", "Iona", "Juno", "Keth", "Luma", "Mira", "Nara", "Orin", "Pela", "Quorin", "Rhea", "Sola", "Tavi", "Uma", "Vela", "Wren", "Xant", "Yara", "Zori"];
  const syllablesB = ["reach", "mere", "vale", "haven", "spire", "fall", "cross", "wake", "rest", "well", "drift", "light", "field", "song", "shore", "glass", "gate", "home", "tide", "watch", "end", "pass", "ward", "rise"];
  const hash = (value) => {
    let result = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      result ^= value.charCodeAt(i);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  };
  const randomFor = (key) => {
    let state = hash(seed + "|" + key) || 0x6d2b79f5;
    return () => {
      state += 0x6d2b79f5;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    };
  };
  const makeStar = (cellX, cellY) => {
    const key = cellX + "," + cellY;
    const random = randomFor("star:" + key);
    if (random() > 0.82) return null;
    const type = spectral[Math.floor(Math.pow(random(), 1.4) * spectral.length)];
    const id = "VG-" + hash(seed + "|" + key).toString(36).toUpperCase();
    const name = syllablesA[Math.floor(random() * syllablesA.length)] + syllablesB[Math.floor(random() * syllablesB.length)] + " " + (12 + Math.floor(random() * 88));
    return {
      id: id,
      seedKey: key,
      name: name,
      x: (cellX + 0.5 + (random() - 0.5) * 0.72) * cellSize,
      y: (cellY + 0.5 + (random() - 0.5) * 0.72) * cellSize,
      type: type,
      temperature: Math.round(type.temperature[0] + random() * (type.temperature[1] - type.temperature[0])),
      mass: (0.25 + Math.pow(random(), 2.8) * 30).toFixed(2),
      planets: 3 + Math.floor(random() * 6)
    };
  };
  const createPlanets = (star) => Array.from({ length: star.planets }, (_, index) => {
    const random = randomFor("planet:" + star.seedKey + ":" + index);
    const type = planetTypes[Math.floor(random() * planetTypes.length)];
    const orbit = 12 + index * 8;
    const angle = random() * Math.PI * 2;
    const name = star.name + " " + ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"][index];
    const resourceCount = 2 + Math.floor(random() * 2);
    const available = resources.slice();
    const deposits = [];
    while (deposits.length < resourceCount && available.length) {
      const position = Math.floor(random() * available.length);
      deposits.push({ name: available.splice(position, 1)[0], richness: 25 + Math.floor(random() * 76) });
    }
    return {
      id: star.id + "-P" + (index + 1),
      name: name,
      type: type,
      x: star.x + Math.cos(angle) * orbit,
      y: star.y + Math.sin(angle) * orbit,
      orbit: orbit,
      radius: +(0.35 + random() * 2.4).toFixed(2),
      temperature: Math.round(-190 + random() * 530 - index * 13),
      gravity: +(0.15 + random() * 2.1).toFixed(2),
      deposits: deposits
    };
  });
  const addFact = (list, label, value) => {
    const row = document.createElement("div");
    row.className = "galaxy-fact";
    const term = document.createElement("dt");
    term.textContent = label;
    const detail = document.createElement("dd");
    detail.textContent = value;
    row.append(term, detail);
    list.appendChild(row);
  };
  const appendObjective = (card) => {
    if (!isSharedViewer) return;
    const panel = document.createElement("section");
    panel.className = "galaxy-objective";
    const render = () => {
      panel.replaceChildren();
      if (objectiveStep >= 2) {
        const heading = document.createElement("span");
        heading.className = "galaxy-objective__eyebrow";
        heading.textContent = "SURVEY COMPLETE";
        const message = document.createElement("p");
        message.className = "galaxy-objective__text";
        message.textContent = "You examined a star system and one of its planets.";
        const replay = document.createElement("button");
        replay.type = "button";
        replay.className = "galaxy-objective__replay";
        replay.textContent = "Replay tip";
        replay.addEventListener("click", () => {
          objectiveStep = 0;
          objectiveDismissed = false;
          render();
          panel.querySelector(".galaxy-objective__dismiss")?.focus();
        });
        panel.append(heading, message, replay);
      } else if (objectiveDismissed) {
        const replay = document.createElement("button");
        replay.type = "button";
        replay.className = "galaxy-objective__replay";
        replay.textContent = "Replay tip";
        replay.addEventListener("click", () => {
          objectiveStep = 0;
          objectiveDismissed = false;
          render();
          panel.querySelector(".galaxy-objective__dismiss")?.focus();
        });
        panel.appendChild(replay);
      } else {
        const heading = document.createElement("span");
        heading.className = "galaxy-objective__eyebrow";
        heading.textContent = objectiveStep === 0 ? "EXPLORATION TIP · 1 OF 2" : "EXPLORATION TIP · 2 OF 2";
        const dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.className = "galaxy-objective__dismiss";
        dismiss.textContent = "Dismiss";
        dismiss.setAttribute("aria-label", "Dismiss exploration tip");
        dismiss.addEventListener("click", () => {
          objectiveDismissed = true;
          render();
          panel.querySelector(".galaxy-objective__replay")?.focus();
        });
        const top = document.createElement("div");
        top.className = "galaxy-objective__top";
        top.append(heading, dismiss);
        const title = document.createElement("strong");
        title.className = "galaxy-objective__title";
        title.textContent = objectiveStep === 0 ? "Inspect a star" : "Inspect a planet";
        const message = document.createElement("p");
        message.className = "galaxy-objective__text";
        message.textContent = objectiveStep === 0
          ? "Select a glowing star to reveal its planets."
          : "Select a planet to read its recorded conditions.";
        panel.append(top, title, message);
      }
    };
    render();
    card.appendChild(panel);
  };
  const createInspector = (eyebrowText, titleText, summaryText) => {
    inspectorCollapsed = false;
    inspector.classList.remove("is-collapsed");
    inspector.replaceChildren();
    const heading = document.createElement("div");
    heading.className = "galaxy-inspector__heading";
    const eyebrow = document.createElement("p");
    eyebrow.className = "galaxy-inspector__eyebrow";
    eyebrow.textContent = eyebrowText;
    const mode = document.createElement("span");
    mode.className = "galaxy-inspector__mode";
    mode.textContent = "CHARTED";
    const title = document.createElement("h2");
    title.textContent = titleText;
    const summary = document.createElement("p");
    summary.className = "galaxy-inspector__lead";
    summary.textContent = summaryText;
    const collapseButton = document.createElement("button");
    collapseButton.type = "button";
    collapseButton.className = "galaxy-inspector__collapse";
    collapseButton.setAttribute("aria-expanded", "true");
    collapseButton.setAttribute("aria-label", "Collapse survey details");
    collapseButton.textContent = "−";
    collapseButton.addEventListener("click", () => {
      inspectorCollapsed = !inspectorCollapsed;
      inspector.classList.toggle("is-collapsed", inspectorCollapsed);
      collapseButton.setAttribute("aria-expanded", String(!inspectorCollapsed));
      collapseButton.setAttribute("aria-label", inspectorCollapsed ? "Expand survey details" : "Collapse survey details");
      collapseButton.textContent = inspectorCollapsed ? "+" : "−";
      if (inspectorCollapsed) inspector.scrollTop = 0;
    });
    heading.append(eyebrow, mode, collapseButton);
    inspector.append(heading, title, summary);
    appendObjective(inspector);
    return inspector;
  };
  const rememberView = (entry) => {
    recentViews = [entry, ...recentViews.filter((item) => item.id !== entry.id)].slice(0, 4);
  };
  const appendRecentViews = (card) => {
    const section = document.createElement("section");
    section.className = "galaxy-recent";
    const heading = document.createElement("h3");
    heading.className = "galaxy-inspector__subhead";
    heading.textContent = "Recently viewed";
    section.appendChild(heading);
    if (!recentViews.length) {
      const empty = document.createElement("p");
      empty.className = "galaxy-recent__empty";
      empty.textContent = "Bodies you inspect in this session will appear here.";
      section.appendChild(empty);
    } else {
      const list = document.createElement("ul");
      list.className = "galaxy-recent__list";
      recentViews.forEach((entry) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "galaxy-recent__item";
        button.setAttribute("aria-label", "View " + (entry.planet ? "planet " : "star system ") + entry.name);
        const name = document.createElement("strong");
        name.textContent = entry.name;
        const kind = document.createElement("span");
        kind.textContent = entry.planet ? "PLANET" : "STAR SYSTEM";
        button.append(name, kind);
        button.addEventListener("click", () => {
          if (entry.planet) {
            openSystem(entry.star);
            showPlanet(entry.planet, entry.star);
          } else {
            openSystem(entry.star);
          }
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      section.appendChild(list);
    }
    card.appendChild(section);
  };
  const showStar = (star) => {
    if (objectiveStep === 0) objectiveStep = 1;
    rememberView({ id: star.id, name: star.name, star: star, planet: null });
    const card = createInspector("STELLAR SYSTEM", star.name, star.type.label + " · " + star.planets + " planets in this system");
    const facts = document.createElement("dl");
    facts.className = "galaxy-facts galaxy-facts--metrics";
    addFact(facts, "Planets", star.planets);
    addFact(facts, "Surface temperature", star.temperature.toLocaleString() + " K");
    addFact(facts, "Stellar mass", star.mass + " solar masses");
    card.appendChild(facts);
    const identity = document.createElement("p");
    identity.className = "galaxy-inspector__identity";
    identity.textContent = "Catalog " + star.id + " · Chart " + seed;
    card.appendChild(identity);
    const note = document.createElement("p");
    note.className = "galaxy-inspector__note";
    note.textContent = "Select a planet to read its recorded conditions and resource indications.";
    card.appendChild(note);
    appendRecentViews(card);
  };
  const showPlanet = (planet, star) => {
    objectiveStep = 2;
    rememberView({ id: planet.id, name: planet.name, star: star, planet: planet });
    const card = createInspector("PLANETARY BODY · " + star.name, planet.name, planet.type.name + " world · orbital radius " + (planet.orbit / 10).toFixed(1) + " model units");
    const facts = document.createElement("dl");
    facts.className = "galaxy-facts galaxy-facts--metrics";
    addFact(facts, "Radius", planet.radius + " Earth radii");
    addFact(facts, "Surface temperature", planet.temperature + " °C");
    addFact(facts, "Gravity", planet.gravity + " g");
    card.appendChild(facts);
    const depositHeading = document.createElement("h3");
    depositHeading.className = "galaxy-inspector__subhead";
    depositHeading.textContent = "Resource signals";
    card.appendChild(depositHeading);
    const deposits = document.createElement("ul");
    deposits.className = "galaxy-deposits";
    planet.deposits.forEach((deposit) => {
      const item = document.createElement("li");
      const label = document.createElement("span");
      label.textContent = deposit.name;
      const value = document.createElement("strong");
      value.textContent = deposit.richness + " / 100";
      item.append(label, value);
      deposits.appendChild(item);
    });
    card.appendChild(deposits);
    const identity = document.createElement("p");
    identity.className = "galaxy-inspector__identity";
    identity.textContent = "Catalog " + planet.id + " · Chart " + seed;
    card.appendChild(identity);
    const note = document.createElement("p");
    note.className = "galaxy-inspector__note";
    note.textContent = "Resource indications are estimates; they do not record a recovered sample.";
    card.appendChild(note);
    appendRecentViews(card);
  };
  const clearInspector = () => {
    const card = createInspector("GALAXY SURVEY", "Choose a star", "Drag to pan, scroll or pinch to zoom, then select a star to read its planets. Use Center to return to Vesperglass.");
    const seedLine = document.createElement("div");
    seedLine.className = "galaxy-inspector__seed";
    const label = document.createElement("span");
    label.textContent = "CHART REFERENCE";
    const value = document.createElement("strong");
    value.textContent = seed;
    seedLine.append(label, value);
    card.appendChild(seedLine);
    const note = document.createElement("p");
    note.className = "galaxy-inspector__note";
    note.textContent = "Survey selections are associated with the chart reference shown above.";
    card.appendChild(note);
    appendRecentViews(card);
  };
  const renderGalaxy = () => {
    if (mode !== "galaxy") return;
    starLayer.clearLayers();
    planetLayer.clearLayers();
    orbitLayer.clearLayers();
    portalLayer.clearLayers();
    const bounds = map.getBounds();
    const minX = Math.floor(bounds.getWest() / cellSize) - 1;
    const maxX = Math.ceil(bounds.getEast() / cellSize) + 1;
    const minY = Math.floor(bounds.getSouth() / cellSize) - 1;
    const maxY = Math.ceil(bounds.getNorth() / cellSize) + 1;
    let count = 0;
    for (let cellY = minY; cellY <= maxY; cellY += 1) {
      for (let cellX = minX; cellX <= maxX; cellX += 1) {
        const star = makeStar(cellX, cellY);
        if (!star) continue;
        const marker = L.circleMarker([star.y, star.x], {
          radius: 3.2 + Math.min(2.4, Math.log10(Number(star.mass) + 1) * 1.4),
          color: star.type.color,
          weight: 1,
          opacity: 0.92,
          fillColor: star.type.color,
          fillOpacity: 0.88,
          className: "galaxy-dot galaxy-dot--star galaxy-dot--" + star.type.className
        }).addTo(starLayer);
        marker.bindTooltip(star.name + " · " + star.type.label, { direction: "top", offset: [0, -7], opacity: 0.94 });
        marker.on("click", () => openSystem(star));
        count += 1;
      }
    }
    const portalIcon = L.divIcon({
      className: "galaxy-portal-marker",
      html: '<span class="galaxy-portal-icon" aria-hidden="true"><svg viewBox="0 0 64 64" focusable="false"><circle class="galaxy-portal-aura" cx="32" cy="32" r="29"/><circle class="galaxy-portal-ring" cx="32" cy="32" r="22"/><circle class="galaxy-portal-core" cx="32" cy="32" r="16"/><path class="galaxy-portal-v" d="M25 23l7 18 7-18"/><circle class="galaxy-portal-star" cx="46" cy="17" r="2.5"/></svg></span><span class="galaxy-portal-label">VESPERGLASS</span>',
      iconSize: [96, 78],
      iconAnchor: [48, 39]
    });
    const portal = L.marker([0, 0], { icon: portalIcon, keyboard: true, title: "Portal to Vesperglass home", alt: "Portal to Vesperglass home", riseOnHover: true, zIndexOffset: 1500 }).addTo(portalLayer);
    portal.bindTooltip("Portal to Vesperglass", { direction: "top", offset: [0, -34], opacity: 0.96 });
    portal.on("click", () => { window.location.href = "/explore/#vesperglass"; });
    syncLayerVisibility();
    galaxyStarCount = count;
    updateGalaxyStatus();
    backButton.hidden = true;
  };
  const openSystem = (star) => {
    mode = "system";
    starLayer.clearLayers();
    planetLayer.clearLayers();
    orbitLayer.clearLayers();
    portalLayer.clearLayers();
    const planets = createPlanets(star);
    planets.forEach((planet) => {
      const orbitPoints = Array.from({ length: 65 }, (_, pointIndex) => {
        const angle = pointIndex / 64 * Math.PI * 2;
        return [star.y + Math.sin(angle) * planet.orbit, star.x + Math.cos(angle) * planet.orbit];
      });
      L.polyline(orbitPoints, { color: "#a9cce5", weight: 1, opacity: 0.18, interactive: false, className: "galaxy-orbit" }).addTo(orbitLayer);
      const marker = L.circleMarker([planet.y, planet.x], {
        radius: planet.type.name === "Gas giant" ? 6.5 : 4.6,
        color: planet.type.color,
        weight: 1.2,
        opacity: 1,
        fillColor: planet.type.color,
        fillOpacity: 0.94,
        className: "galaxy-dot galaxy-dot--planet"
      }).addTo(planetLayer);
      marker.bindTooltip(planet.name + " · " + planet.type.name, { direction: "top", offset: [0, -7], opacity: 0.94 });
      marker.on("click", () => showPlanet(planet, star));
    });
    const starMarker = L.circleMarker([star.y, star.x], {
      radius: 10,
      color: star.type.color,
      weight: 2,
      opacity: 1,
      fillColor: star.type.color,
      fillOpacity: 0.98,
      className: "galaxy-dot galaxy-dot--star galaxy-dot--system-star galaxy-dot--" + star.type.className
    }).addTo(starLayer);
    syncLayerVisibility();
    starMarker.bindTooltip(star.name + " · " + star.type.label, { direction: "top", offset: [0, -12], opacity: 0.94 });
    showStar(star);
    backButton.hidden = false;
    mapStatus.textContent = star.name + " · " + planets.length + " planets";
    map.fitBounds([[star.y - 76, star.x - 76], [star.y + 76, star.x + 76]], { padding: [45, 45], maxZoom: 2.7 });
  };
  const returnToGalaxy = () => {
    mode = "galaxy";
    starLayer.clearLayers();
    planetLayer.clearLayers();
    orbitLayer.clearLayers();
    portalLayer.clearLayers();
    selectedStar = null;
    clearInspector();
    map.setView([0, 0], 0);
    renderGalaxy();
  };
  const centerOnVesperglass = () => {
    if (mode !== "galaxy") returnToGalaxy();
    else map.panTo([0, 0], { animate: true, duration: 0.45 });
    if (!layerVisibility.portal) setLayerVisibility("portal", true);
  };
  const scheduleGalaxyRender = () => {
    if (mode !== "galaxy") return;
    window.clearTimeout(redrawTimer);
    redrawTimer = window.setTimeout(renderGalaxy, 80);
  };
  const syncFullscreenButton = () => {
    const active = document.fullscreenElement === mapShell || document.webkitFullscreenElement === mapShell || mapShell.classList.contains("is-fullscreen");
    fullscreenButton.setAttribute("aria-pressed", String(active));
    fullscreenButton.setAttribute("aria-label", active ? "Exit galaxy map fullscreen" : "Open galaxy map fullscreen");
    fullscreenButton.textContent = active ? "⛶ Exit full screen" : "⛶ Fullscreen";
    window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
  };
  const toggleFullscreen = async () => {
    if (mapShell.classList.contains("is-fullscreen")) {
      mapShell.classList.remove("is-fullscreen");
      syncFullscreenButton();
      return;
    }
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else document.webkitExitFullscreen?.();
      } else if (mapShell.requestFullscreen) {
        await mapShell.requestFullscreen({ navigationUI: "hide" });
      } else {
        mapShell.webkitRequestFullscreen?.();
      }
    } catch (_) {
      mapShell.classList.add("is-fullscreen");
      syncFullscreenButton();
    }
  };
  const applySeed = () => {
    seed = seedInput.value.trim() || "VESPERGLASS-01";
    seedInput.value = seed;
    recentViews = [];
    objectiveStep = 0;
    objectiveDismissed = false;
    returnToGalaxy();
  };
  const makeNewSeed = () => {
    const values = new Uint32Array(2);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(values);
    else { values[0] = Date.now(); values[1] = Math.floor(Math.random() * 0xffffffff); }
    seedInput.value = "VESPER-" + values[0].toString(36).toUpperCase() + values[1].toString(36).toUpperCase();
    applySeed();
  };
  fullscreenButton.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  document.addEventListener("webkitfullscreenchange", syncFullscreenButton);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mapShell.classList.contains("is-fullscreen")) {
      mapShell.classList.remove("is-fullscreen");
      syncFullscreenButton();
    }
  });
  generateButton.addEventListener("click", applySeed);
  centerButton.addEventListener("click", centerOnVesperglass);
  seedInput.addEventListener("keydown", (event) => { if (event.key === "Enter") applySeed(); });
  newSeedButton.addEventListener("click", makeNewSeed);
  backButton.addEventListener("click", returnToGalaxy);
  filterInputs.forEach((input) => {
    input.addEventListener("change", () => setLayerVisibility(input.dataset.galaxyFilter, input.checked));
  });
  filterReset?.addEventListener("click", () => {
    filterInputs.forEach((input) => {
      input.checked = true;
      layerVisibility[input.dataset.galaxyFilter] = true;
    });
    syncLayerVisibility();
    updateGalaxyStatus();
  });
  map.on("moveend zoomend", scheduleGalaxyRender);
  clearInspector();
  renderGalaxy();
  window.VesperglassGalaxyMap = {
    invalidate: () => window.requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      scheduleGalaxyRender();
    })
  };
  window.requestAnimationFrame(() => map.invalidateSize({ pan: false }));
})();
