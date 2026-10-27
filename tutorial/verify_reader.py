"""Check the actual local reader with a network-blocked headless browser."""
import json
from pathlib import Path
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "tutorial" / "evidence"


def main():
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    soup = BeautifulSoup(source, "html.parser")
    ids = [e["id"] for e in soup.select("[id]")]
    assert len(ids) == len(set(ids)), "Duplicate IDs"
    for a in soup.select('a[href^="#"]'):
        assert a["href"][1:] in ids, a["href"]
    results = {"offline": True, "static_ids": len(ids),
               "source_words": len(soup.get_text(" ", strip=True).split()),
               "viewports": []}
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context()
        requests = []
        def deny(route):
            requests.append(route.request.url)
            route.abort()
        context.route("https://**/*", deny)
        context.route("http://**/*", deny)
        page = context.new_page()
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        for width, height, label in [(1440, 1000, "desktop"),
                                     (390, 844, "mobile")]:
            page.set_viewport_size({"width": width, "height": height})
            page.goto((ROOT / "index.html").as_uri())
            page.wait_for_function("window.MathJax && MathJax.startup && MathJax.startup.promise")
            page.evaluate("async () => { await MathJax.startup.promise; }")
            count = page.locator("mjx-container").count()
            assert count > 150, count
            assert page.locator("mjx-merror").count() == 0
            assert page.locator('[data-mjx-error]').count() == 0
            assert "$" not in page.locator("body").inner_text(), "Stray math delimiter"
            overflow = page.evaluate("document.documentElement.scrollWidth > innerWidth + 1")
            if overflow:
                print(page.evaluate("""() => ({width:innerWidth, scroll:document.documentElement.scrollWidth,
                  offenders:[...document.querySelectorAll('p,div,h1,h2,h3,details,summary,li,mjx-container')].filter(e=>
                  e.scrollWidth>e.clientWidth+2 && getComputedStyle(e).overflowX==='visible').slice(0,30).map(e=>
                  ({tag:e.tagName,cls:String(e.className),text:e.textContent.slice(0,90),
                  right:e.getBoundingClientRect().right,width:e.clientWidth,scroll:e.scrollWidth}))})"""))
                page.screenshot(path=str(OUT / f"{label}-overflow.png"))
            assert not overflow, label
            # Check that disclosures respond and the final solution is readable.
            page.locator("#show-solutions").click()
            assert page.locator("details[open]").count() == 18
            page.locator("#hide-solutions").click()
            assert page.locator("details[open]").count() == 0
            page.locator("#problem-18 summary").focus()
            page.keyboard.press("Enter")
            assert page.locator("#problem-18").get_attribute("open") is not None
            # Exercise navigation, not just static fragment parsing.
            page.locator('.rail a[href="#paper-map"]').first.click()
            assert page.evaluate("location.hash") == "#paper-map"
            for target in ["#paper-map", "#three-costs", "#four-coordinates"]:
                page.locator(target).scroll_into_view_if_needed()
                page.screenshot(path=str(OUT / f"{label}-{target[1:]}.png"))
            page.evaluate("window.scrollTo(0,0)")
            page.screenshot(path=str(OUT / f"{label}-start.png"))
            # All equations must be present even if a narrow table scrolls locally.
            empty_math = page.locator("mjx-container").evaluate_all(
                "els => els.filter(e => !e.querySelector('svg')).length")
            assert empty_math == 0
            results["viewports"].append({"name": label, "width": width,
                "math_expressions": count, "math_errors": 0,
                "page_overflow": False, "solutions": 18,
                "keyboard_disclosure": "passed", "fragment_navigation": "passed"})
        # Capture print state and reset to avoid hidden solutions in exported copies.
        page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
        assert page.locator("details[open]").count() == 18
        page.emulate_media(media="print")
        page.set_viewport_size({"width": 680, "height": 900})
        print_overflows = page.locator('mjx-container[display="true"]').evaluate_all(
            "els => els.filter(e=>e.querySelector('svg').getBoundingClientRect().width > e.clientWidth + 1).length")
        assert print_overflows == 0, print_overflows
        results["print_display_equation_overflows"] = print_overflows
        page.pdf(path=str(OUT / "tutorial-print.pdf"), format="A4",
                 margin={"top":"15mm","right":"15mm","bottom":"15mm","left":"15mm"},
                 print_background=True)
        results["print_pdf"] = "tutorial/evidence/tutorial-print.pdf"
        results["page_errors"] = errors
        results["remote_requests"] = requests
        assert not errors, errors
        assert not requests, requests
        browser.close()
    (OUT / "browser-checks.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
