"""Internal checks of teaching examples; no implementation of the research solver."""
from fractions import Fraction
from itertools import product
from math import comb, log2
import json
from pathlib import Path


def main():
    rows = []
    for x, y, z in product((0, 1), repeat=3):
        clauses = (int(bool(x or y)), int(bool((1-x) or z)),
                   int(bool((1-y) or (1-z))))
        polys = (1-(1-x)*(1-y), 1-x*(1-z), 1-y*z)
        assert clauses == polys
        rows.append([x, y, z, *clauses, int(all(clauses))])
    assert [r[:3] for r in rows if r[-1]] == [[0, 1, 0], [1, 0, 1]]
    # Every parity fiber is counted, including fibers of size greater than one.
    shared = {}
    for y, z in product((0, 1), repeat=2):
        shared[y+z] = shared.get(y+z, 0) + 1
    assert shared == {0: 1, 1: 2, 2: 1}
    # The paper's four-coordinate identity, Remark 4.4 (not its asymptotic regime).
    for a, b, c, d in product(range(3), repeat=4):
        measurement = a-b-c+d
        assert a-Fraction(1, 2)*b-c == measurement+Fraction(1, 2)*b-d
        assert a-b-2*c == measurement-c-d
    # Toy Hermite polynomial: H(0)=2, H(1)=8, H'(1)=11.
    assert 2+1+5 == 8 and 1+2*5 == 11
    assert 8-11+5 == 2
    assert sum(comb(5, j)*2**j for j in range(3)) == 51
    # Mod-4 parity indicator from Lemma 5.2, including negative inputs.
    p2 = lambda a: 1-3*a*a+2*a*a*a
    for a in range(-12, 13):
        assert p2(a) % 4 == int(a % 2 == 0)
        for b in range(-12, 13):
            h = lambda t: t*(t-1)
            retained = ((1-a)*(1-b) + (2*a-1)*h(a)*(1-b)
                        + (1-a)*(2*b-1)*h(b))
            assert retained % 4 == (p2(a)*p2(b)) % 4
    # Deterministic rejection proof and geometric recursion cost.
    assert Fraction(3, 4)**3 * 2 == Fraction(27, 32) < 1
    assert Fraction(27, 32)**20 < 1
    result = {
        "truth_table": rows,
        "solution_count": 2,
        "summary_fiber_sizes": shared,
        "Cq_n5_q2": 51,
        "constant_base_exponent_1_3": log2(1.3),
        "recursion_ratio": 2**0.5 / 8,
        "recursion_geometric_sum": 1/(1-2**0.5/8),
        "growth_log2": [
            {"n": n, "n_cubed": 3*log2(n), "two_sqrt_n": n**0.5,
             "one_point_three_n": n*log2(1.3), "two_n": n}
            for n in (16, 64, 256, 1024)
        ],
        "scope": "Teaching identities only; no ETH algorithm reproduced."
    }
    target = Path(__file__).parent / "evidence" / "example-results.json"
    target.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
