(() => {
  const dataNode = document.getElementById("gallery-image-data");
  const grid = document.getElementById("gallery-grid");
  const tagsNode = document.getElementById("gallery-tags");
  const kindsNode = document.getElementById("gallery-kinds");
  const search = document.getElementById("gallery-search");
  const count = document.getElementById("gallery-count");
  const clear = document.getElementById("gallery-clear");
  const showArchive = document.getElementById("gallery-show-archive");
  const collectionNode = document.getElementById("gallery-collection-data");
  if (!dataNode || !grid || !tagsNode || !kindsNode || !search || !count || !clear || !showArchive) return;

  let images, collections;
  try { images = JSON.parse(dataNode.textContent); }
  catch { count.textContent = "The image record could not be read."; return; }
  try { collections = collectionNode ? JSON.parse(collectionNode.textContent) : []; }
  catch { collections = []; }

  const ignored = new Set(["assets", "image", "images", "plate", "v", "v2", "6144", "square", "superres", "sharp"]);
  const selected = new Set();
  let selectedKind = "";
  const collectibleByPath = new Map();
  collections.forEach(collection => collection.items.forEach(item => collectibleByPath.set(item.image, { serial: item.serial, collection: collection.title })));
  const humanize = value => value.replace(/[._-]+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()).trim();
  const kindFor = image => {
    const path = image.path.toLowerCase();
    const filename = path.split("/").pop();
    if (path.includes("sprite")) return "Sprites";
    if (path.includes("/leaflet/") || filename === "atlas-deep-starfield.svg" || /^atlas-orbit-stars-/.test(filename)) return "Maps and map layers";
    if (/(?:plan|cutaway|comparison|overprint|asset-kinds|motifs|relationships-plate|boundary)/.test(filename) || (path.includes("/library/") && filename.endsWith("-plate.svg"))) return "Diagrams";
    if (path.includes("/library/") || filename.includes("-plate.")) return "Folio plates and illustrations";
    return "Other site artwork";
  };
  const classify = image => {
    const path = image.path.toLowerCase();
    const tags = new Set([image.extension === "svg" ? "vector" : "raster", image.extension, image.status || "unclassified source status", image.assetKind.toLowerCase()]);
    if (path.includes("/library/")) tags.add("encyclopedia");
    if (path.includes("/library/places/")) tags.add("place folio");
    if (path.includes("atlas") || path.includes("orbit-field") || path.includes("orbit-stars")) tags.add("atlas");
    if (path.includes("orbit-field") || path.includes("orbit-stars")) tags.add("map layer");
    if (path.includes("sprite")) tags.add("sprite");
    if (path.includes("path-")) tags.add("route map");
    if (path.includes("postal") || path.includes("stamp")) tags.add("postal service");
    if (path.includes("/collections/")) tags.add("collectible series");
    const tokens = `${image.name} ${path.split("/").slice(-2).join(" ")}`.toLowerCase().match(/[a-z]{3,}/g) || [];
    tokens.forEach(token => { if (!ignored.has(token)) tags.add(token); });
    return [...tags].sort((a, b) => a.localeCompare(b));
  };
  images = images.map(image => ({
    ...image,
    isArchive: image.path.toLowerCase().includes("archive"),
    assetKind: kindFor(image),
    collectible: collectibleByPath.get(image.path),
  })).map(image => ({ ...image, tags: classify(image) }));
  const availableImages = () => images.filter(image => showArchive.checked || !image.isArchive);

  const renderKinds = () => {
    kindsNode.replaceChildren();
    const addKindButton = (label, value) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-tag";
      button.textContent = label;
      button.setAttribute("aria-pressed", String(selectedKind === value));
      button.addEventListener("click", () => {
        selectedKind = value;
        renderKinds();
        renderImages();
      });
      kindsNode.append(button);
    };
    addKindButton("All asset kinds", "");
    const unique = [...new Set(availableImages().map(image => image.assetKind))].sort((a, b) => a.localeCompare(b));
    unique.forEach(kind => addKindButton(kind, kind));
  };

  const renderTags = () => {
    tagsNode.replaceChildren();
    const all = document.createElement("button");
    all.type = "button";
    all.className = "gallery-tag";
    all.textContent = "All tags";
    all.setAttribute("aria-pressed", String(selected.size === 0));
    all.addEventListener("click", () => { selected.clear(); renderTags(); renderImages(); });
    tagsNode.append(all);
    const unique = [...new Set(availableImages().flatMap(image => image.tags))].sort((a, b) => a.localeCompare(b));
    unique.forEach(tag => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-tag";
      button.textContent = humanize(tag);
      button.setAttribute("aria-pressed", String(selected.has(tag)));
      button.addEventListener("click", () => {
        selected.has(tag) ? selected.delete(tag) : selected.add(tag);
        renderTags(); renderImages();
      });
      tagsNode.append(button);
    });
  };

  const renderImages = () => {
    const query = search.value.trim().toLowerCase();
    const available = availableImages();
    const visible = available.filter(image => {
      const matchesQuery = !query || `${image.name} ${image.path} ${image.assetKind} ${image.status || ""} ${image.tags.join(" ")} ${image.collectible?.serial || ""} ${image.collectible?.collection || ""}`.toLowerCase().includes(query);
      const matchesTags = [...selected].every(tag => image.tags.includes(tag));
      const matchesKind = !selectedKind || image.assetKind === selectedKind;
      return matchesQuery && matchesTags && matchesKind;
    });
    const hiddenArchiveCount = images.length - images.filter(image => !image.isArchive).length;
    const selectedKindSummary = selectedKind ? ` · ${selectedKind}` : "";
    count.textContent = showArchive.checked
      ? `${visible.length} of ${images.length} images shown${selectedKindSummary}`
      : `${visible.length} of ${available.length} images shown${selectedKindSummary} · ${hiddenArchiveCount} Archive images hidden by default`;
    grid.replaceChildren();
    visible.forEach(image => {
      const card = document.createElement("article");
      card.className = "gallery-card";
      const link = document.createElement("a");
      link.className = "gallery-card-image";
      link.href = image.path;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `Open image file: ${humanize(image.name)} (${image.extension})`);
      const img = document.createElement("img");
      img.src = image.path;
      img.alt = `Site image asset: ${humanize(image.name)}.`;
      img.loading = "lazy";
      link.append(img);
      const title = document.createElement("h3");
      title.textContent = humanize(image.name);
      const serial = image.collectible ? document.createElement("p") : null;
      if (serial) {
        serial.className = "gallery-card-serial";
        serial.textContent = `${image.collectible.serial} · ${image.collectible.collection}`;
      }
      const meta = document.createElement("p");
      meta.textContent = `${image.extension.toUpperCase()} · ${image.path}`;
      const kind = document.createElement("p");
      kind.className = "gallery-card-kind";
      kind.textContent = `Asset kind · ${image.assetKind}`;
      const status = document.createElement("p");
      status.className = "gallery-card-status";
      status.textContent = `Editorial status · ${image.status || "unclassified source status"}`;
      const chipList = document.createElement("div");
      chipList.className = "gallery-card-tags";
      image.tags.slice(0, 6).forEach(tag => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "gallery-tag gallery-tag--small";
        chip.textContent = humanize(tag);
        chip.setAttribute("aria-label", `Filter by ${humanize(tag)}`);
        chip.addEventListener("click", () => { selected.add(tag); renderTags(); renderImages(); });
        chipList.append(chip);
      });
      card.append(link, title);
      if (serial) card.append(serial);
      card.append(meta, kind, status, chipList);
      grid.append(card);
    });
  };

  search.addEventListener("input", renderImages);
  showArchive.addEventListener("change", () => {
    if (!showArchive.checked && !availableImages().some(image => image.assetKind === selectedKind)) selectedKind = "";
    renderKinds();
    renderTags();
    renderImages();
  });
  clear.addEventListener("click", () => { selected.clear(); selectedKind = ""; search.value = ""; renderKinds(); renderTags(); renderImages(); search.focus(); });
  renderKinds();
  renderTags();
  renderImages();
})();
