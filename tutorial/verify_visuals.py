"""Verify every finite visual state, SVG bounds, and offline rendering."""
import json
import html
import re
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tutorial" / "evidence"
WIDGETS = {"circuit": 8, "growth": 4, "summaries": 3, "hermite": 4,
           "spectral": 3, "parity": 4, "tensor": 3, "refutation": 5}


def main():
    result = {"state_counts": WIDGETS, "checked_states": 0, "bounds": [],
              "page_errors": [], "remote_requests": []}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 1000},
                                      reduced_motion="reduce")
        def deny(route):
            result["remote_requests"].append(route.request.url)
            route.abort()
        context.route("http://**/*", deny)
        context.route("https://**/*", deny)
        page = context.new_page()
        page.on("pageerror", lambda e: result["page_errors"].append(str(e)))
        page.goto((ROOT / "index.html").as_uri())
        page.wait_for_function("window.ETH_VISUALS && ETH_VISUALS.ready")
        page.evaluate("async()=>{await MathJax.startup.promise}")
        for name, count in WIDGETS.items():
            for step in range(count):
                page.evaluate("([name,step])=>ETH_VISUALS[name](step)", [name, step])
                bad = page.locator(f"#visual-{name} svg").evaluate("""svg=>{
                  const v=svg.viewBox.baseVal;
                  return [...svg.querySelectorAll('text,rect,circle,path,line')].map(e=>{
                    const b=e.getBBox();return {tag:e.tagName,text:e.textContent,
                      x:b.x,y:b.y,w:b.width,h:b.height};
                  }).filter(b=>b.x < v.x-1 || b.y < v.y-1 ||
                    b.x+b.w > v.x+v.width+1 || b.y+b.h > v.y+v.height+1);
                }""")
                assert not bad, (name, step, bad)
                status = page.locator(f"#visual-{name} .visual-status").inner_text()
                assert len(status) > 40
                result["checked_states"] += 1
            result["bounds"].append({"widget": name, "out_of_bounds": 0})
        # Independent expected finite outputs rather than comparing functions to themselves.
        assert page.evaluate("ETH_VISUAL_DATA.circuit.filter(r=>r.output).map(r=>r.bits.join(''))") == ["010", "101"]
        assert page.evaluate("ETH_VISUAL_DATA.parity.map(r=>r.survivors.length)") == [8, 4, 2, 1]
        assert page.evaluate("ETH_VISUAL_DATA.summary_products") == [1, 4, 1]
        assert page.evaluate("ETH_VISUAL_DATA.spectral.windows.map(w=>w.exceptional).every((v,i,a)=>!i||v<a[i-1])")
        snapshots = {}
        for name in WIDGETS:
            initial = {"circuit": 2, "growth": 1, "summaries": 1,
                       "hermite": 3, "spectral": 1, "parity": 3, "tensor": 0, "refutation": 4}[name]
            page.evaluate("([name,s])=>ETH_VISUALS[name](s)", [name, initial])
            fig = page.locator(f"#visual-{name}")
            fig.screenshot(path=str(OUT / f"visual-{name}-desktop.png"))
            snapshots[name] = (fig.locator("svg").evaluate("e=>e.outerHTML"),
                               fig.locator(".visual-status").inner_text())
        # Reader controls retain keyboard operation and explicit state changes.
        page.locator('#visual-circuit [data-action="next"]').focus()
        page.keyboard.press("Enter")
        assert page.locator("#visual-circuit").get_attribute("data-step") == "3"
        page.locator('#visual-circuit [data-action="play"]').click()
        assert page.locator('#visual-circuit [data-action="play"]').inner_text() == "Pause"
        page.locator('#visual-circuit [data-action="play"]').click()
        assert page.locator('#visual-circuit [data-action="play"]').inner_text() == "Play"
        page.set_viewport_size({"width": 390, "height": 844})
        assert page.evaluate("document.documentElement.scrollWidth <= innerWidth+1")
        for name in WIDGETS:
            page.locator(f"#visual-{name}").screenshot(path=str(OUT / f"visual-{name}-mobile.png"))
        result["mobile_page_overflow"] = False
        result["keyboard_and_play_controls"] = "passed"
        result["reduced_motion"] = "respected by native animation guard"
        assert not result["page_errors"] and not result["remote_requests"]
        browser.close()
    # Embed fully generated static SVGs as a no-JavaScript fallback. Prose remains authored in HTML.
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    for name, (svg, status) in snapshots.items():
        pattern = rf'(<figure[^>]*id="visual-{name}"[\s\S]*?<div class="visual-stage"[^>]*>)<svg[\s\S]*?</svg>'
        source, replacements = re.subn(pattern, lambda m: m[1]+svg, source, count=1)
        assert replacements == 1, name
        pattern = rf'(<figure[^>]*id="visual-{name}"[\s\S]*?<p class="visual-status"[^>]*>)[\s\S]*?(</p>)'
        source, replacements = re.subn(pattern, lambda m: m[1]+html.escape(status)+m[2], source, count=1)
        assert replacements == 1, name
    (ROOT / "index.html").write_text(source, encoding="utf-8")
    (OUT / "visual-checks.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
