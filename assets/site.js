(() => {
  const pages = [
    { title: "Vesperglass Atlas", url: "/", summary: "Explore the floating home, its landmarks, the Vesperglass Gate, and the train dock.", terms: "home atlas map workshop threshold house tideglass foundry garden observatory archive portal train dock" },
    { title: "Galaxy Chart", url: "/explore/#galaxy", summary: "Consult the stars and read about the planets in their systems.", terms: "galaxy stars planets systems exploration survey worlds map" },
    { title: "Universe Guide", url: "/universe/", summary: "A guide to known space, materials, vessels, and the train's passage through the Gate.", terms: "universe guide atlas galaxy worlds systems starshards stardust train expeditions" },
    { title: "Universe Encyclopedia", url: "/library/", summary: "An illustrated reference to the places, materials, and journeys of Vesperglass.", terms: "library encyclopedia atlas universe reference book" },
    { title: "Starshards & the Gate Train", url: "/library/starshards/", summary: "A field account of starshards and stardust, with source-aware comparisons of the transit case, sealed vessel, train's starwell pulse, and Gate bloom.", terms: "starshard stardust starwell fuel crystal mineral transit case padded dark glass case label sealed vessel aurora pulse Gate bloom outward expanding light conceal train inner outer event timing cause mechanism Foundry grinding sifting tempering locomotive crossing chamber glass heart contents container role transfer loading receipt" },
    { title: "Vesperglass Workshop", url: "/library/workshop/", summary: "The central home platform, with an Atlas-placement concordance, a proposed cutaway inventory, and a comparison of the spoken departure custom with the blank Train Dock docket.", terms: "workshop home making gathering centrality map atlas placement composition island landmark pin map view projection measured scale distance bearing adjacency direction route table tools blueprint plan sheet cabinet vessel glassware wall tool cutaway inventory departure custom Name the passage destination spoken keepers Train Dock docket record passenger names origin route" },
    { title: "Threshold House", url: "/library/threshold-house/", summary: "A named platform with proposed interior and plan readings, arrival phrases, a room-sound audit, and comparisons with the Gate aperture and Compass Garden flora.", terms: "threshold house arrival passage shelter interior plan concordance arch framed opening aperture bench lamp niches axis floor plan elevation threshold opening phrases greetings room sounds acoustic echo reverberation footfall listener hush lamp noise sound-source cue provenance plate support audit image-based inference unknown material dimensions occupancy potted greenery plants foliage container planters flora Compass Garden garden beds starflower fern fronds keeper tending cultivation species botanical glow same specimens Vesperglass Gate separate platform freestanding ring portal transit crossing bloom room feature shared construction route connection Shall we leave the crossing unnamed place name event identity traveler itinerary" },
    { title: "Tideglass Foundry", url: "/library/tideglass-foundry/", summary: "The recorded making of stardust, reconstructed tools, a phrase-level terminology note, and a source-aware bridge from tempering to the separate starwell account.", terms: "tideglass foundry starshards stardust refining craft mill process cleaning grinding mirrored plates reflective surfaces pair grinding surfaces sifting fine even powder grain size sieve mesh tempering resonance low singing resonance scattered glints quiet color hue brightness color standard metric acoustic source instrument frequency measurement mechanism plate II reconstructed tools starwell sealed glass heart measured thread pulse Gate separate accounts transfer batch loading quantity" },
    { title: "Compass Garden", url: "/library/compass-garden/", summary: "A glasshouse folio with a plan key and pictured-flora notes, plus comparisons of its compass rose, architecture, and planting composition with the Observatory, proposed stamp, and Threshold House.", terms: "compass garden conservatory plants glasshouse planting flora starflower starflowers fern ferns pale bloom luminous foliage botanical species bed keeper compass rose image visual plate star compass instrument Observatory directional bearing motif dome telescope arches glass roof architecture construction postal stamp flower emblem badge icon motif abstraction source illustration Threshold House potted greenery container plants foliage garden beds arrangement compositional comparison shared specimens cultivation care species" },
    { title: "Observatory Logbook", url: "/library/observatory/", summary: "A source-aware Observatory record with a pictured instrument inventory, second-watch comparison, and a comparison of the room telescope with its stamp-scale rendering.", terms: "observatory logbook instruments orrery telescope charts comparison follow-up color sighting tube drift eyepiece blue field pale band point observation target calibration plate II sample leaf image wording instrument identity second watch repeated noted again Star Archive phrase concordance Vesperglass Postal Service postage stamp dome telescope motif source plates diagonal stamp scale maker target session observer room framing crop relative visual prominence architecture panel human scale focal length dimensions optical specification measured size" },
    { title: "Star Archive", url: "/library/star-archive/", summary: "A reference room for knowledge of the sky, with a shelf-content key, evidence matrix, chart-mark comparison, and phrase concordance with the Observatory.", terms: "star archive books maps memory library shelves radial stacks central reading table chart cabinet shelf number collection titles subject division catalog Unfixed Meridian annotations notation marginalia margin marks returned to uncertain reading unverified place evidence provenance source title scope maker compiler date coordinates postal stamp decorative corner stars constellation comparison symbol design pale band noted again blue-field point wording phrase concordance repeated light color observation Observatory sample leaves" },
    { title: "The Vesperglass Gate", url: "/library/vesperglass-gate/", summary: "The detached Gate platform, pictured aperture, bloom account, proposed recollections, and comparisons with Threshold House and the Train Dock docket.", terms: "vesperglass gate portal transit galaxy detached platform freestanding ring aperture arch cutaway construction bloom opening crossing keeper traveler hush singing recollection threshold sound Threshold House framed opening room feature shared construction route connection return journey light emergence cargo return-load Train Dock docket manifest" },
    { title: "Vesperglass Train Dock", url: "/library/train-dock/", summary: "A clear landing apron, alongside berth, approach-to-berth alignment key, and source-aware docket comparing return light in the Gate account with an unfilled cargo field.", terms: "train dock berth station locomotive platform train journey docket departure crossing Gate bloom emergence passage itinerary date time passenger destination schedule duration cargo manifest blank return load return journey light sealed stardust starwell inventory descriptive phrase account ledger field route guide path alignment approach curve alongside offset orientation" },
    { title: "Vesperglass Postal Service", url: "/library/postal-service/", summary: "Four proposed stamps with source-linked motif studies, an overprint comparison with the Gate bloom, and an envelope mock-up overlap audit.", terms: "postal service post postage stamp seal cancellation mark postmark mail correspondence letter envelope sender addressee Gate ring motif architectural source crown star bands perforation Foundry furnace circle mill sifting tray tempering resonance Observatory telescope dome tube pivoting support sighting instrument observer instrument motif diagonal stamp scale simplified instrument mounting optics target observing session stamp design plate position index upper left upper right lower left lower right layout arrangement sequence denomination date issue source folio cross-source palette color lineage teal blue brass gold parchment print stock material specification construction printing standard crescent moon starfield stars star scatter corner stars sky field celestial chart constellation grouping distribution orientation chart margin marks notation symbol decorative framing return mark question mark open square uncertain reading unverified place chart annotation pattern date orientation authorship logbook date bright cloud region Workshop Compass Garden starflower floral motif flora emblem flower badge icon abstraction illustration Tideglass Vesperglass Sealed at the Gate SEALED AT THE GATE sealed starwell starshards stardust fuel chamber glass heart sealing material closure method sender addressee postal dispatch stamp phrase letter cancellation route unspecified overprint double ring four point star four horizontal strokes cancellation-like lines Gate bloom gathering light concealing opening outward crossing event no postal route blank envelope overlay overlap aperture central opening ring border stamp legibility visibility placement postage postal standard mark use envelope mockup" },
    { title: "Words of Passage", url: "/library/words-of-passage/", summary: "A reference to travel terms, the Dock's same passage versus the Gate's interworld crossing, the distinction between platforms and berth, and reader pronunciation cues.", terms: "stardust starwell gate bloom guide path passage same passage same word two passages Dock departure Gate crossing between worlds interworld crosswalk glossary train dock platform floating place berth alongside gate platform crossing route track rails continuous route physical connection equivalence pronunciation how to say stress syllables Vesperglass Tideglass" }
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
