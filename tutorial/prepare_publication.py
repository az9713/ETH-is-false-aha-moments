"""Prepare public manifests without requiring excluded source files in a clone."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = [
    ".gitattributes", ".gitignore", ".nojekyll", "README.md", "index.html", "analysis-ir.json",
    "source-manifest.json", "assets/preview.png", "assets/circuit-preview.png",
    "tutorial/style.css", "tutorial/reader.js", "tutorial/mathjax-tex-svg.js",
    "tutorial/mathjax-LICENSE", "tutorial/check_examples.py", "tutorial/verify_reader.py",
    "tutorial/visuals.js", "tutorial/visual-data.js", "tutorial/visual-data.json",
    "tutorial/build_visual_data.py", "tutorial/verify_visuals.py", "tutorial/prepare_publication.py",
    "tutorial/vendor/d3.js", "tutorial/vendor/D3-LICENSES.md",
    "tutorial/evidence/source-notes.md", "tutorial/evidence/aaronson-reading.md",
    "tutorial/evidence/example-results.json", "tutorial/evidence/browser-checks.json",
    "tutorial/evidence/visual-checks.json", "tutorial/evidence/tutorial-print.pdf",
]


def write(name, value):
    (ROOT / name).write_bytes((json.dumps(value, ensure_ascii=False, indent=2)+"\n").encode("utf-8"))


def main():
    source = json.loads((ROOT / "source-manifest.json").read_text(encoding="utf-8"))
    source["boundary"] = "Five original local inputs and subsequently supplied Samuel transcript; raw inputs excluded from publication"
    for s in source["sources"]:
        if s["id"].startswith("S"):
            s["published_representation"] = False
    if not any(s["id"] == "S06" for s in source["sources"]):
        p = ROOT / "transcript_samuel.txt"
        source["sources"].append({
            "id": "S06", "input": p.name, "status": "read",
            "role": "Samuel Allen Alexander commentary transcript",
            "canonical_locator": "https://www.youtube.com/watch?v=ZbxC0412cys",
            "bytes": p.stat().st_size if p.exists() else None,
            "sha256": hashlib.sha256(p.read_bytes()).hexdigest() if p.exists() else None,
            "published_representation": False,
            "coverage": {"textual": "full", "audio": "not-performed", "visual": "not-performed",
                         "citation": "timestamp-addressable", "verification": "partial"}})
    if not any(s["id"] == "V07" for s in source["sources"]):
        source["sources"].append({
            "id": "V07", "input": "https://github.com/az9713/animate-libs",
            "status": "inspected", "role": "Animation toolkit and vendored D3 bundle",
            "git_blob_sha": "93ab9daf94ecd8dd7788c1bdb00140045df6ff14",
            "coverage": {"textual": "full for README and library inventory", "verification": "bundle inspected and used"}})
    write("source-manifest.json", source)
    analysis = json.loads((ROOT / "analysis-ir.json").read_text(encoding="utf-8"))
    analysis["visual_teaching_constructions"] = {
        "data": "tutorial/visual-data.json", "generator": "tutorial/build_visual_data.py",
        "checks": "tutorial/evidence/visual-checks.json",
        "limits": "Finite teaching examples; no implementation or benchmark of the research solver"}
    write("analysis-ir.json", analysis)
    # Public hashes describe the LF bytes stored by Git, even on Windows.
    for name in PUBLIC:
        p = ROOT / name
        if p.is_file() and p.suffix.lower() not in {".png", ".pdf"}:
            p.write_bytes(p.read_bytes().replace(b"\r\n", b"\n"))
    artifacts = []
    for name in PUBLIC:
        p = ROOT / name
        if not p.is_file():
            raise FileNotFoundError(name)
        assert not name.lower().endswith(".txt"), name
        artifacts.append({"path": name, "primary": name == "index.html",
                          "purpose": "Published tutorial, supporting assets, provenance, or reproducible checks",
                          "source_dependencies": ["S01", "S02", "S03", "S04", "S05", "S06", "V02", "V07"],
                          "sha256": hashlib.sha256(p.read_bytes()).hexdigest()})
    write("artifact-manifest.json", {"artifacts": artifacts,
                                    "site": "https://az9713.github.io/ETH-is-false-aha-moments/",
                                    "excluded": ["all *.txt", "original source PDFs and screenshot", "local editorial drafts and diagnostic screenshots"]})
    print(f"Prepared public manifests for {len(PUBLIC)} files; every *.txt excluded.")


if __name__ == "__main__":
    main()
