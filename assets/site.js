(() => {
  const pages = [
    { title: "Vesperglass Atlas", url: "/", summary: "Explore the floating home, its landmarks, the Vesperglass Gate, and the train dock.", terms: "home atlas map workshop threshold house tideglass foundry garden observatory archive portal train dock" },
    { title: "Galaxy Explorer", url: "/sim/#galaxy", summary: "Chart a repeatable procedural galaxy and inspect stars and their planetary systems.", terms: "galaxy stars planets systems exploration survey worlds map" },
    { title: "Universe Guide", url: "/universe/", summary: "A guide to known space, materials, vessels, and the planned expedition cycle.", terms: "universe guide lore atlas galaxy worlds systems starshards stardust train expeditions" },
    { title: "Universe Encyclopedia", url: "/library/", summary: "An illustrated reference to the places, materials, and journeys of Vesperglass.", terms: "library encyclopedia lore atlas universe fiction reference book" },
    { title: "Starshards & the Gate Train", url: "/library/starshards/", summary: "How starshards become stardust, and how the Gate train carries it between worlds.", terms: "starshard stardust fuel train portal gate tideglass foundry galaxy resource" },
    { title: "Vesperglass Workshop", url: "/library/workshop/", summary: "The central home platform and a place to prepare for the wider universe.", terms: "workshop home making gathering table tools" },
    { title: "Threshold House", url: "/library/threshold-house/", summary: "A named atlas place imagined around arrival and passage.", terms: "threshold house arrival passage shelter" },
    { title: "Tideglass Foundry", url: "/library/tideglass-foundry/", summary: "The lore of refining starshards into stardust, with imagined tools.", terms: "tideglass foundry starshards stardust refining craft mill" },
    { title: "Compass Garden", url: "/library/compass-garden/", summary: "A conservatory and a proposed planting plan for the garden platform.", terms: "compass garden conservatory plants glasshouse planting" },
    { title: "Observatory Logbook", url: "/library/observatory/", summary: "Instruments and a room imagined around observing and recording the sky.", terms: "observatory logbook instruments orrery telescope charts" },
    { title: "Star Archive", url: "/library/star-archive/", summary: "A reference room for the knowledge of the sky, with an interpretive cutaway.", terms: "star archive books maps memory library" },
    { title: "The Vesperglass Gate", url: "/library/vesperglass-gate/", summary: "The detached portal platform and its passage into the Galaxy.", terms: "vesperglass gate portal transit galaxy ring" },
    { title: "Vesperglass Train Dock", url: "/library/train-dock/", summary: "A clear landing apron and alongside berth for the Gate train.", terms: "train dock berth station locomotive platform train" }
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
