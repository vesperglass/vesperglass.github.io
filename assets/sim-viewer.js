(() => {
  const scenes = Array.from(document.querySelectorAll("[data-sim-scene]"));
  const buttons = Array.from(document.querySelectorAll("[data-sim-navigate]"));
  const label = document.getElementById("sim-view-label");
  if (!scenes.length || !buttons.length) return;

  const activate = (requested, updateLocation) => {
    const view = requested === "galaxy" ? "galaxy" : "vesperglass";
    scenes.forEach((scene) => {
      const active = scene.dataset.simScene === view;
      scene.hidden = !active;
      scene.setAttribute("aria-hidden", String(!active));
    });
    buttons.forEach((button) => {
      if (button.dataset.simNavigate === view) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    label.textContent = view === "galaxy" ? "EXPLORATION · PROCEDURAL GALAXY" : "HOME · THE ELSEWHERE ATLAS";
    document.documentElement.dataset.simView = view;
    if (updateLocation) {
      const hash = view === "galaxy" ? "#galaxy" : "#vesperglass";
      if (window.location.hash !== hash) window.location.hash = hash;
    }
    window.requestAnimationFrame(() => {
      if (view === "galaxy") window.VesperglassGalaxyMap?.invalidate();
      else window.VesperglassAtlasMap?.invalidate();
    });
  };

  buttons.forEach((button) => button.addEventListener("click", () => activate(button.dataset.simNavigate, true)));
  window.addEventListener("hashchange", () => activate(window.location.hash.slice(1), false));
  activate(window.location.hash.slice(1), false);
})();
