(() => {
  const dataNode = document.getElementById("gallery-image-data");
  const grid = document.getElementById("gallery-grid");
  const tagsNode = document.getElementById("gallery-tags");
  const search = document.getElementById("gallery-search");
  const count = document.getElementById("gallery-count");
  const clear = document.getElementById("gallery-clear");
  if (!dataNode || !grid || !tagsNode || !search || !count || !clear) return;

  let images;
  try { images = JSON.parse(dataNode.textContent); }
  catch { count.textContent = "The image record could not be read."; return; }

  const ignored = new Set(["assets", "image", "images", "plate", "v", "v2", "6144", "square", "superres", "sharp"]);
  const selected = new Set();
  const humanize = value => value.replace(/[._-]+/g, " ").replace(/\b\w/g, letter => letter.toUpperCase()).trim();
  const classify = image => {
    const path = image.path.toLowerCase();
    const tags = new Set([image.extension === "svg" ? "vector" : "raster", image.extension]);
    if (path.includes("/library/")) tags.add("encyclopedia");
    if (path.includes("/library/places/")) tags.add("place folio");
    if (path.includes("atlas") || path.includes("orbit-field") || path.includes("orbit-stars")) tags.add("atlas");
    if (path.includes("orbit-field") || path.includes("orbit-stars")) tags.add("map layer");
    if (path.includes("sprite")) tags.add("sprite");
    if (path.includes("path-")) tags.add("route map");
    if (path.includes("postal") || path.includes("stamp")) tags.add("postal service");
    const tokens = `${image.name} ${path.split("/").slice(-2).join(" ")}`.toLowerCase().match(/[a-z]{3,}/g) || [];
    tokens.forEach(token => { if (!ignored.has(token)) tags.add(token); });
    return [...tags].sort((a, b) => a.localeCompare(b));
  };
  images = images.map(image => ({ ...image, tags: classify(image) }));

  const renderTags = () => {
    tagsNode.replaceChildren();
    const all = document.createElement("button");
    all.type = "button";
    all.className = "gallery-tag";
    all.textContent = "All tags";
    all.setAttribute("aria-pressed", String(selected.size === 0));
    all.addEventListener("click", () => { selected.clear(); renderTags(); renderImages(); });
    tagsNode.append(all);
    const unique = [...new Set(images.flatMap(image => image.tags))].sort((a, b) => a.localeCompare(b));
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
    const visible = images.filter(image => {
      const matchesQuery = !query || `${image.name} ${image.path} ${image.tags.join(" ")}`.toLowerCase().includes(query);
      const matchesTags = [...selected].every(tag => image.tags.includes(tag));
      return matchesQuery && matchesTags;
    });
    count.textContent = `${visible.length} of ${images.length} images shown`;
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
      const meta = document.createElement("p");
      meta.textContent = `${image.extension.toUpperCase()} · ${image.path}`;
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
      card.append(link, title, meta, chipList);
      grid.append(card);
    });
  };

  search.addEventListener("input", renderImages);
  clear.addEventListener("click", () => { selected.clear(); search.value = ""; renderTags(); renderImages(); search.focus(); });
  renderTags();
  renderImages();
})();
