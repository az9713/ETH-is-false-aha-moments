"""Compute finite teaching examples used by the SVG explanations."""
import json
from math import comb, sqrt
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def bits(a):
    return [(a >> 2) & 1, (a >> 1) & 1, a & 1]


def main():
    circuit = []
    for a in range(8):
        x, y, z = bits(a)
        clauses = [int(bool(x or y)), int(bool((1-x) or z)),
                   int(bool((1-y) or (1-z)))]
        circuit.append({"bits": [x, y, z], "clauses": clauses,
                        "output": int(all(clauses))})
    assert sum(r["output"] for r in circuit) == 2
    fibers = {s: [f"{a}{b}" for a in range(2) for b in range(2)
                  if a+b == s] for s in range(3)}
    products = [len(fibers[s])**2 for s in range(3)]
    assert products == [1, 4, 1] and sum(products) == 6
    # Counting the orthogonal product-basis directions, not sampling assignments.
    q, p = 120, 3/8
    probabilities = [comb(q, j)*p**j*(1-p)**(q-j) for j in range(q+1)]
    assert abs(sum(probabilities)-1) < 1e-12
    windows = []
    for width in [12, 24, 40]:
        lo = int(q*p-(width-1)/2)
        hi = lo+width-1
        retained = sum(probabilities[lo:hi+1])
        windows.append({"width": width, "lo": lo, "hi": hi,
                        "degree": width-1, "exceptional": 1-retained})
    survivors = list(range(8))
    filters = []
    rows = []
    for round_index in range(4):
        candidates = []
        for mask in range(1, 8):
            passing = [a for a in survivors
                       if sum(((mask >> j) & 1)*(1-bits(a)[j])
                              for j in range(3)) % 2 == 0]
            candidates.append({"mask": mask, "passing": passing,
                               "count": len(passing)})
        best = min(candidates, key=lambda c: (c["count"], c["mask"]))
        rows.append({"survivors": survivors[:], "filters": filters[:],
                     "candidates": candidates, "next": best["mask"]})
        if round_index < 3:
            survivors = best["passing"]
            filters.append(best["mask"])
    assert [len(r["survivors"]) for r in rows] == [8, 4, 2, 1]
    assert survivors == [7] and filters == [1, 2, 4]
    for a in (1, 3, 5, 7):
        assert 8-11+a == a-3
    ratio = sqrt(2)/8
    obj = {"circuit": circuit, "fibers": fibers, "summary_products": products,
           "spectral": {"Q": q, "r": 4, "p": p,
                        "probabilities": probabilities, "windows": windows},
           "parity": rows,
           "recursion": [ratio**d for d in range(6)],
           "scope": "Finite teaching constructions, not an implementation of the research algorithm."}
    (ROOT / "visual-data.json").write_text(json.dumps(obj, indent=2), encoding="utf-8")
    # External script assignment works with file:// and a restrictive CSP.
    (ROOT / "visual-data.js").write_text(
        "window.ETH_VISUAL_DATA="+json.dumps(obj, separators=(",", ":"))+";\n",
        encoding="utf-8")
    print(json.dumps({"solutions": 2, "summary_count": 6,
                      "spectral_windows": windows,
                      "parity_counts": [len(r["survivors"]) for r in rows],
                      "recursion_ratio": ratio}, indent=2))


if __name__ == "__main__":
    main()
