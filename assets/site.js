(() => {
  const pages = [
    { title: "Vesperglass Atlas", url: "/", summary: "Explore the floating home, its landmarks, the Vesperglass Gate, and the train dock.", terms: "home atlas map workshop threshold house tideglass foundry garden observatory archive portal train dock" },
    { title: "Galaxy Chart", url: "/explore/#galaxy", summary: "Consult the stars and read about the planets in their systems.", terms: "galaxy stars planets systems exploration survey worlds map" },
    { title: "Universe Guide", url: "/universe/", summary: "A guide to known space, materials, vessels, and the train's passage through the Gate.", terms: "universe guide atlas galaxy worlds systems starshards stardust train expeditions" },
    { title: "Universe Encyclopedia", url: "/library/", summary: "An illustrated reference to the places, materials, and journeys of Vesperglass.", terms: "library encyclopedia atlas universe reference book" },
    { title: "Starshards & the Gate Train", url: "/library/starshards/", summary: "A field account of starshards and stardust, with source-aware comparisons of the transit case, sealed vessel, train's starwell pulse, and Gate bloom.", terms: "starshard stardust starwell fuel crystal mineral transit case padded dark glass case label sealed vessel aurora pulse Gate bloom outward expanding light conceal train inner outer event timing cause mechanism Foundry grinding sifting tempering locomotive crossing chamber glass heart contents container role transfer loading receipt" },
    { title: "Vesperglass Workshop", url: "/library/workshop/", summary: "The central home platform, with an Atlas-placement concordance, a proposed cutaway inventory, and a comparison of the spoken departure custom with the blank Train Dock docket.", terms: "workshop home making gathering centrality map atlas placement composition island landmark pin map view projection measured scale distance bearing adjacency direction route table tools blueprint plan sheet cabinet vessel glassware wall tool cutaway inventory departure custom Name the passage destination spoken keepers Train Dock docket record passenger names origin route" },
    { title: "Threshold House", url: "/library/threshold-house/", summary: "A named platform with proposed interior and plan readings, arrival phrases, sound notes, and a comparison distinguishing the Gate's place-name from an unnamed crossing.", terms: "threshold house arrival passage shelter interior plan concordance arch bench lamp niches axis floor plan elevation threshold opening phrases greetings room sounds acoustic Shall we leave the crossing unnamed Vesperglass Gate place name proper noun event identity unnamed crossing traveler itinerary" },
    { title: "Tideglass Foundry", url: "/library/tideglass-foundry/", summary: "The recorded making of stardust, reconstructed tools, and a source-aware bridge from tempering to its separate starwell use.", terms: "tideglass foundry starshards stardust refining craft mill process cleaning grinding mirrored plates sifting tempering resonance plate II tools starwell sealed glass heart measured thread pulse quiet color Gate low singing resonance transfer batch loading quantity" },
    { title: "Compass Garden", url: "/library/compass-garden/", summary: "A glasshouse folio with a plan key, pictured-flora notes, and comparisons of its compass rose and conservatory architecture with the Observatory and a proposed stamp motif.", terms: "compass garden conservatory plants glasshouse planting flora starflower starflowers fern ferns pale bloom luminous foliage botanical species bed keeper compass rose image visual plate star compass instrument Observatory directional bearing motif dome telescope arches glass roof architecture construction postal stamp flower emblem badge icon motif abstraction source illustration" },
    { title: "Observatory Logbook", url: "/library/observatory/", summary: "A source-aware Observatory record with an instrument inventory and a comparison of the imagined second watch with the pictured sighting tube.", terms: "observatory logbook instruments orrery telescope charts comparison follow-up color sighting tube drift eyepiece blue field observation target calibration plate II sample leaf image wording instrument identity" },
    { title: "Star Archive", url: "/library/star-archive/", summary: "A reference room for knowledge of the sky, with a shelf-content boundary card and evidence matrix for the proposed Unfixed Meridian chart.", terms: "star archive books maps memory library shelves radial stacks central reading table chart cabinet shelf number collection titles subject division catalog Unfixed Meridian annotations uncertain reading unverified place evidence provenance source title scope maker compiler date coordinates" },
    { title: "The Vesperglass Gate", url: "/library/vesperglass-gate/", summary: "The detached Gate platform, pictured aperture, bloom account, and two contrasting proposed threshold recollections.", terms: "vesperglass gate portal transit galaxy ring aperture arch cutaway construction bloom opening crossing keeper traveler hush singing recollection threshold sound" },
    { title: "Vesperglass Train Dock", url: "/library/train-dock/", summary: "A clear landing apron, alongside berth, proposed approach-to-berth alignment key, and journey docket that separates departure, Gate bloom, and emergence from unrecorded itinerary details.", terms: "train dock berth station locomotive platform train journey docket departure crossing Gate bloom emergence passage itinerary date time passenger destination schedule duration cargo manifest route guide path alignment approach curve alongside offset orientation" },
    { title: "Vesperglass Postal Service", url: "/library/postal-service/", summary: "Four proposed stamps with a source-linked position index, palette and motif comparisons, and an Observatory sky-field note, plus an overprint and blank envelope layout.", terms: "postal service post postage stamp seal cancellation mark postmark mail correspondence letter envelope sender addressee Gate ring motif architectural source crown star bands perforation Foundry furnace circle mill sifting tray tempering resonance Observatory telescope dome stamp design plate position index upper left upper right lower left lower right layout arrangement sequence denomination date issue source folio cross-source palette color lineage teal blue brass gold parchment print stock material specification construction printing standard crescent moon starfield sky body galaxy decorative field celestial chart constellation phase orientation observation logbook date Workshop Compass Garden starflower floral motif flora emblem flower badge icon abstraction illustration Tideglass Vesperglass Sealed at the Gate overprint double ring four point star strokes blank envelope crossing" },
    { title: "Words of Passage", url: "/library/words-of-passage/", summary: "A reference to travel terms, the distinction between platforms and berth, and reader pronunciation cues.", terms: "stardust starwell gate bloom guide path passage train dock platform floating place berth alongside gate platform crossing route pronunciation how to say stress syllables Vesperglass Tideglass" }
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
