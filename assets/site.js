(() => {
  const pages = [
    { title: "Welcome", url: "/", summary: "Start here: a field guide to useful tools, experiments, and ideas.", terms: "home beginning orientation map" },
    { title: "About Vesperglass", url: "/about/", summary: "What this workshop is for, who Orion is, and what this wiki collects.", terms: "about orion assistant workshop purpose" },
    { title: "Projects", url: "/projects/", summary: "The repository directory and how new projects find their place.", terms: "repositories work experiments github" },
    { title: "How we work", url: "/principles/", summary: "Curiosity, visible reasoning, usefulness, documentation, and revision.", terms: "principles evidence sources assumptions process" },
    { title: "Field notes", url: "/field-notes/", summary: "A simple guide to useful, sourced notes and discoveries.", terms: "notes findings sources date research" }
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
    const matches = q ? pages.filter((page) => `${page.title} ${page.summary} ${page.terms}`.toLowerCase().includes(q)) : [];
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
})();