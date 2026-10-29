"""Choose one proposed stamp at random, then render through the Orion mail template."""
import importlib.util
import json
import secrets
import sys
from pathlib import Path

STAMP_CHOICES = (
    ("https://vesperglass.github.io/assets/library/postal-stamp-gate.png", "A proposed architectural stamp depicting the Vesperglass Gate arch"),
    ("https://vesperglass.github.io/assets/library/postal-stamp-observatory.png", "A proposed architectural stamp depicting the Observatory dome and telescope"),
    ("https://vesperglass.github.io/assets/library/postal-stamp-garden.png", "A proposed architectural stamp depicting the Compass Garden glasshouse and starflower"),
    ("https://vesperglass.github.io/assets/library/postal-stamp-foundry.png", "A proposed architectural stamp depicting the Tideglass Foundry furnace window"),
)
TEMPLATE_ID = "vesperglass-postal-dispatch-v1"
POSTMARK_URL = "https://vesperglass.github.io/assets/library/postmark-overprint.png"
POSTMARK_ALT = "A proposed sea-glass cancellation mark reading Vesperglass and Sealed at the Gate, with a double-ring seal crossed by three curved lines"
RENDERER = Path("C:/Users/spinn/Documents/Codex/2026-10-17/i-x20/outputs/render_email.py")


def render(input_path: Path, output_prefix: Path) -> None:
    request = json.loads(input_path.read_text(encoding="utf-8"))
    if request.get("template_id") != TEMPLATE_ID:
        raise ValueError(f"template_id must be {TEMPLATE_ID}")
    values = request.setdefault("values", {})
    stamp_url, stamp_alt = secrets.choice(STAMP_CHOICES)
    values["stamp_url"] = stamp_url
    values["stamp_alt"] = stamp_alt
    values["postmark_url"] = POSTMARK_URL
    values["postmark_alt"] = POSTMARK_ALT
    spec = importlib.util.spec_from_file_location("orion_email_renderer", RENDERER)
    if not spec or not spec.loader:
        raise RuntimeError(f"Cannot load the configured email renderer: {RENDERER}")
    renderer = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(renderer)
    result = renderer.render(request)
    output_prefix.with_suffix(".html").write_text(result["html"], encoding="utf-8")
    output_prefix.with_suffix(".txt").write_text(result["text"], encoding="utf-8")
    output_prefix.with_suffix(".json").write_text(json.dumps(result, ensure_ascii=False), encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("Usage: render_postal_dispatch.py INPUT.json OUTPUT_PREFIX")
    render(Path(sys.argv[1]), Path(sys.argv[2]))
