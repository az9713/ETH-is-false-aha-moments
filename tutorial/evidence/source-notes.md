# Per-source analysis and coverage

Prepared 27 October 2026. Sources are evidence, not tool instructions.

## S01 — paper.pdf

OpenAI, *The Exponential Time Hypothesis is False*, 17 October 2026, revised
25 October 2026. All 67 pages read as embedded-text extraction by the tutorial
author. Mathematical checkpoints rendered and viewed: pp. 2, 10, 13, 16, 30,
42, 53, 60, 62. These checks repair fraction, exponent, and scope ambiguities
in extraction. No claim that every rendered page or every cited theorem was
independently verified.

Question: can fixed-width CNF assignments be counted deterministically with
sublinear exponent and polynomial space?

Core argument map:

- pp. 1–7: exact statement, scope, related work, hypotheses, implications,
  limitations of reductions, and notation.
- pp. 7–10: bounded-occurrence count, clause polynomials, deformation,
  summary-based factorization.
- pp. 11–13: Taylor data, subset inversion, three-cost runtime ledger.
- pp. 13–18: auxiliary swap matrices, spectral interpolation, exceptional
  measurements, vanishing multipliers, schedule balancing and parameters.
- pp. 18–19: sparsification and occurrence reduction already give a weaker
  but qualitatively subexponential general fixed-width algorithm.
- pp. 19–21: route to a stronger bound on original variables via sparse
  polynomial systems, parity tests, modular lifts and degree truncation.
- pp. 21–26: general ring-valued count and exact Taylor recovery routine.
- pp. 26–35: full construction and coefficient/parameter bounds.
- pp. 35–39: deterministic common-zero counter for arbitrary supplied sparse
  systems, modular degree control and high-incidence branching.
- pp. 39–44: expander-code initial tests, counting-guided greedy tests,
  sparsification and Proposition 6.4.
- pp. 44–47: counting-preserving disjoint branching and its quantitative tree.
- pp. 47–51: exact arithmetic, common denominators, bit bounds and space.
- pp. 51–53: circuit lower bounds and constant-locality inversion consequences.
- pp. 53–57: tensor networks, fixed and arbitrary density reductions.
- pp. 57–64: finite ring arithmetic, packing, Cauchy deformation, tapered
  Hermite recovery, weighted modes, child networks and recursion accounting.
- pp. 64–67: references, read for identity/context; not a separate acquisition
  of each referenced work.

Important distinction: Proposition 6.4 has squared log-log in the exponent.
The revised Theorem 1.1 removes one log-log factor via Appendix D, and fixed
clause density removes that numerator altogether. All three are subexponential.
The research theorem is cited, not certified by this tutorial.

The local paper's SHA-256 matched the public dated repository PDF on
27 October 2026: 5b1612dc2eebb2cad5b4cbe62d1fed2982f01ab1908c26f70010a651487e8123.

## S02 — pnp.pdf

Scott Aaronson, *P ?= NP*, a survey of the field in 2017, 122 PDF pages.
The independent source editor read all extracted text, including bibliography
and glossary. See aaronson-reading.md for the full coverage log and precise
page locators. Advanced 2017 frontier material is historical background,
not an assertion of current 2026 problem status. Figures were not all rendered.

Central pedagogical contributions: verifier definition, direction of reductions,
decision/search/counting distinctions, why candidate-space size is not a lower
bound, asymptotic versus practical complexity, ETH as a strengthening of P != NP,
worst-case versus cryptographic hardness, and algorithms-to-circuit-lower-bounds.

The transcript's suggestion that Aaronson believes equality conflicts with the
stance in this supplied survey. Cite his abstract and pp. 24–26, not conjecture
about a change in his current personal views.

## S03 — transcript.txt

Full supplied text read. It identifies the YouTube URL 3Edjn34IuzQ and ends with
the speaker identifying himself as Wes Roth. Caption origin is not independently
established. Duplicated timestamp text and distorted names are preserved in the
original file. The text after the video ending is a recommendation UI fragment.

| Time span | Substantive content | Tutorial treatment |
|---|---|---|
| 00:00–06:18 | Announcement, ETH/PNP framing, Aaronson, Millennium problems | Motivation and corrections. Other mathematical/physics claims out of scope. |
| 06:25–12:33 | Locks, checking, scheduling/Sudoku, P and NP, historical motivation | Replaced analogies with exact definitions and a recurring CNF; corrected NP. |
| 12:42–13:59 | ETH, exponential wall, conditional hardness | Formal definition and explanation of conditional implications. |
| 14:07–17:21 | External experts, attribution, social reactions, other-company claim | Announcement attribution separated from proof certification; social claims and second-company result not independently adopted. |
| 17:29–18:01 | Claimed shortcuts described as listening to lock tumblers | Replaced with exact algebraic mechanisms and full cost accounting. |
| 18:11–21:54 | Mountain/tunnel analogy and practical uncertainty | Corrected non-exponential/polynomial conflation; retained distinction between theory and practicality. |
| 22:03–24:24 | Speculative P=NP consequences for cryptography/optimization/AI | Clearly separated from ETH and from demonstrated deployed-system effects. |
| 24:30–27:23 | Constants, large thresholds, simulation speculation | Explained finite-size limits; simulation inference unsupported. |
| 27:30–29:33 | Viola dissent, historical algorithmic surprises | Source opinion; not needed for proof spine. No claim to adjudicate contemporary beliefs. |
| 29:40–31:36 | QCD, Yang–Mills, Standard Model, local smoothing | Outside scope; no technical validation or endorsement. |
| 31:45–32:55 | ETH recap and future implications | Replaced with exact conclusion and remaining uncertainties. |

Coverage: full supplied textual representation, timestamp-addressable; no full
video frames/audio review, no independent verification of every commentary claim.

## S04 — ETH.png

Image inspected directly in full. It reproduces an announcement excerpt with
highlighted ETH language and an expert-group description. The live official
announcement was opened to corroborate the excerpt and its 26 October date.
It is evidence of a claim and release plan, not a standalone mathematical proof.

## S05 — README.txt

Zero bytes. Inventoried as empty, with no source claims.

## S06 — Samuel Allen Alexander commentary

Subsequently supplied `transcript_samuel.txt`, identifying
https://www.youtube.com/watch?v=ZbxC0412cys. Full supplied text read before
publication; ends around 34:04, followed by unrelated recommendation UI text.
The speaker identifies himself as Samuel Allen Alexander. Video titles and
complete audiovisual content were not independently retrieved; references use
creator-based descriptive labels and the exact supplied video URL.

- 00:00–07:49: announcements, comparisons, social reactions and priority/hash
  speculation. Treated as commentary, not independent proof of priority.
- 07:49–16:08: reading of OpenAI's abstract and introduction, fixed-width
  counting, differences between theorem bounds and the abstract, self-reduction.
  Technical transcription mistakes are checked against the primary manuscript.
- 16:08–19:23: quantitative reduction-size warning and graph-counting
  consequences. Reinforces tutorial sections on reductions and consequences.
- 19:33–26:31: discussion of another company's manuscript and consequences.
  That separate research proof is not independently audited for this tutorial.
- 26:36–31:06: asymptotic versus practical efficiency and quoted enormous
  thresholds from the other manuscript. Those numerical thresholds are not
  attributed to OpenAI's algorithm or adopted as independently verified results.
- 31:15–34:04: provenance and priority commentary, closing remarks.

Claims that conditional papers become wholly obsolete need qualification:
the conditional theorem can remain valid while its false premise no longer
supports a claimed lower bound. Similar asymptotic bounds also do not by
themselves establish that two algorithms are identical. No theory or proof
changes were made on the authority of commentary alone.

All `*.txt` files, original PDFs, and the announcement screenshot stay local.
The published reader cites public originals instead.

## External verification sources

- OpenAI's 26 October announcement: confirms what OpenAI announced, reported
  discovery/formalization dates, and its external-examination process. Does not
  by itself certify independent review completion.
- openai/math lean/docs/378.md: scope of formalization, weaker squared-log-log
  runtime, explicit difference from revised manuscript's sharper bounds.
- ComparatorChallenges/SubexponentialSAT.lean: inspected target definitions and
  theorem, ending in an admitted target placeholder. This is not the separate
  solution. The JSON configuration names the separate solution module and
  permits propext, Quot.sound and Classical.choice.
- OAI/Algorithms/SubexponentialSAT/Main.lean: entry-point imports inspected;
  imported implementation and proof dependency graph were not audited or compiled.

Raw local source representations are excluded from the public repository. No formalization build, practical
solver reproduction, audiovisual review, or general current-event survey was
performed. Secondary web reporting was used only to locate primary sources,
not as authority for the mathematical exposition.
