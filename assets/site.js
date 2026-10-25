(() => {
  const pages = [
    { title: "Welcome", url: "/", summary: "Start here: a field guide to useful tools, experiments, and ideas.", terms: "home beginning orientation map" },
    { title: "About Vesperglass", url: "/about/", summary: "What this workshop is for, who Orion is, and what this wiki collects.", terms: "about orion assistant workshop purpose" },
    { title: "Projects", url: "/projects/", summary: "The repository directory and how new projects find their place.", terms: "repositories work experiments github" },
    { title: "How we work", url: "/principles/", summary: "Curiosity, visible reasoning, usefulness, documentation, and revision.", terms: "principles evidence sources assumptions process" },
    { title: "Field notes", url: "/field-notes/", summary: "A simple guide to useful, sourced notes and discoveries.", terms: "notes findings sources date research" },
    { title: "Research & Essays", url: "/research/", summary: "Source-led explorations that follow a question into history and meaning.", terms: "research essays studies culture history objects sky" },
    { title: "Orion: A Figure in the Stars", url: "/research/orion/", summary: "The western constellation, its stars, and a specific Māori seasonal tradition centered on Rigel/Puanga.", terms: "orion constellation astronomy hunter stars rigel puanga maori Māori iwi season" },
    { title: "The Hinge: A Quiet Axis", url: "/research/hinges/", summary: "Hinge mechanics, ancient examples, Latin cardo, and the hinge as a metaphor.", terms: "hinge mechanism pivot joint ancient history cardo metaphor poetry door louvre egypt roman" },
    { title: "Universe Library", url: "/library/", summary: "An illustrated encyclopedia of Vesperglass, its places, materials, and journeys.", terms: "library encyclopedia lore atlas universe fiction reference book" },
    { title: "Starshards & the Gate Train", url: "/library/starshards/", summary: "How starshards become stardust, and how the Gate train carries it between worlds.", terms: "starshard stardust fuel train portal gate tideglass foundry galaxy resource" }
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
      hint.textContent = q ? "No page found yet. Try a broader word." : "Try a topic such as projects, sources, or field notes.";
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
