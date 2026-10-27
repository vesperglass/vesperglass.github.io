(() => {
  const pages = [
    { title: "Vesperglass Atlas", url: "/", summary: "Explore the floating home, its landmarks, the Vesperglass Gate, and the train dock.", terms: "home atlas map workshop threshold house tideglass foundry garden observatory archive portal train dock" },
    { title: "Galaxy Chart", url: "/explore/#galaxy", summary: "Consult the stars and read about the planets in their systems.", terms: "galaxy stars planets systems exploration survey worlds map" },
    { title: "Universe Guide", url: "/universe/", summary: "A guide to known space, materials, vessels, and the train's passage through the Gate.", terms: "universe guide atlas galaxy worlds systems starshards stardust train expeditions" },
    { title: "Universe Encyclopedia", url: "/library/", summary: "An illustrated reference to the places, materials, and journeys of Vesperglass.", terms: "library encyclopedia atlas universe reference book" },
    { title: "Starshards & the Gate Train", url: "/library/starshards/", summary: "How starshards become stardust, including the sealed-vessel and tipped-vessel descriptions, and how the Gate train carries it between worlds.", terms: "starshard stardust sealed vessel tipped aurora fuel train portal gate tideglass foundry galaxy resource" },
    { title: "Vesperglass Workshop", url: "/library/workshop/", summary: "The central home platform and a place to prepare for the wider universe.", terms: "workshop home making gathering table tools" },
    { title: "Threshold House", url: "/library/threshold-house/", summary: "A quiet place at the edge of arrival and passage.", terms: "threshold house arrival passage shelter" },
    { title: "Tideglass Foundry", url: "/library/tideglass-foundry/", summary: "The making of stardust, with a process-to-plate key separating the recorded steps from reconstructed Foundry tools.", terms: "tideglass foundry starshards stardust refining craft mill process cleaning grinding mirrored plates sifting tempering resonance plate II tools" },
    { title: "Compass Garden", url: "/library/compass-garden/", summary: "A conservatory and a proposed planting plan for the garden platform.", terms: "compass garden conservatory plants glasshouse planting" },
    { title: "Observatory Logbook", url: "/library/observatory/", summary: "Instruments, observations, comparisons, and records of the sky.", terms: "observatory logbook instruments orrery telescope charts comparison follow-up color sighting tube" },
    { title: "Star Archive", url: "/library/star-archive/", summary: "A reference room for the knowledge of the sky, with an evidence matrix for the proposed Unfixed Meridian chart and its margin-mark legend.", terms: "star archive books maps memory library Unfixed Meridian annotations uncertain reading unverified place evidence provenance source title scope maker compiler date coordinates chart catalog cataloguer" },
    { title: "The Vesperglass Gate", url: "/library/vesperglass-gate/", summary: "The detached portal platform, pictured aperture, and account of the Gate bloom.", terms: "vesperglass gate portal transit galaxy ring aperture arch cutaway construction bloom opening crossing" },
    { title: "Vesperglass Train Dock", url: "/library/train-dock/", summary: "A clear landing apron and alongside berth for the Gate train.", terms: "train dock berth station locomotive platform train" },
    { title: "Vesperglass Postal Service", url: "/library/postal-service/", summary: "A proposed postal service, architectural seal, four-stamp issue, cancellation marks, and blank envelope-face layout.", terms: "postal service post postage stamp seal cancellation mark postmark mail correspondence letter envelope sender addressee Gate Workshop Observatory Compass Garden Tideglass Foundry" },
    { title: "Words of Passage", url: "/library/words-of-passage/", summary: "A reference to stardust, the starwell, Gate bloom, the Train Dock guide path, and reader pronunciation cues.", terms: "stardust starwell gate bloom guide path passage train dock pronunciation how to say stress syllables Vesperglass Tideglass" }
  ];
  const dialog = document.getElementById("search-dialog");
  const openButton = document.getElementById("open-search");
  const closeButton = document.getElementById("close-search");
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  if (!dialog || !openButton || !input || !results) return;
  const openSearch = () => { if (!dialog.open) dialog.showModal(); input.focus(); };
  const render = (query) => {
    results.replaceChildren();
    const q = query.trim().toLowerCase();
    const matches = q ? pages.filter((page) => [page.title, page.summary, page.terms].join(" ").toLowerCase().includes(q)) : [];
    if (!q || !matches.length) {
      const hint = document.createElement("p");
      hint.className = "search-hint";
      hint.textContent = q ? "No page found yet. Try a broader word." : "Try a place, material, vessel, or world.";
      results.append(hint);
      return;
    }
    matches.forEach((page) => {
      const link = document.createElement("a"); link.className = "result-link"; link.href = page.url;
      const title = document.createElement("strong"); title.textContent = page.title;
      const summary = document.createElement("span"); summary.textContent = page.summary;
      link.append(title, summary); results.append(link);
    });
  };
  openButton.addEventListener("click", openSearch);
  closeButton?.addEventListener("click", () => dialog.close());
  input.addEventListener("input", () => render(input.value));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  document.addEventListener("keydown", (event) => {
    const typing = event.target instanceof HTMLElement && (event.target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName));
    if (event.key === "/" && !typing) { event.preventDefault(); openSearch(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); openSearch(); }
  });
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    const root = document.documentElement;
    const icon = document.getElementById("theme-icon");
    const label = document.getElementById("theme-label");
    const colorMeta = document.getElementById("theme-color");
    let hasSavedChoice = false;
    try { hasSavedChoice = Boolean(localStorage.getItem("vesperglass-theme")); } catch (_) {}
    const updateThemeControl = () => {
      const dark = root.dataset.theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(dark));
      themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      icon.textContent = dark ? "☀" : "☾";
      label.textContent = dark ? "Light" : "Dark";
      if (colorMeta) colorMeta.content = dark ? "#111923" : "#f5f3ed";
    };
    const setTheme = (theme, save) => {
      root.dataset.theme = theme;
      if (save) {
        hasSavedChoice = true;
        try { localStorage.setItem("vesperglass-theme", theme); } catch (_) {}
      }
      updateThemeControl();
    };
    updateThemeControl();
    themeToggle.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark", true));
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    preference.addEventListener?.("change", event => {
      if (!hasSavedChoice) setTheme(event.matches ? "dark" : "light", false);
    });
  }
})();
