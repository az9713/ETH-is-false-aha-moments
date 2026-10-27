# Aaronson source reading and editorial brief

Source: `../../pnp.pdf`, Scott Aaronson, **P ?= NP**, survey of the field in 2017. All 122 PDF pages were read as extracted embedded text, including the bibliography and glossary. PDF page indices and printed page numbers coincide. Text extraction loses some overbars, fraction layout, and graph geometry; those losses must not be copied as mathematical notation. This is a source reading, not an independent verification of all cited theorems or a claim that every historical open problem remains open in 2026.

The source is an explanatory survey, not the source of the October 2026 ETH claim. It can support definitions, historical context, and the logical distinctions needed to understand the new manuscript. The contemporary manuscript needs separate attribution and evidence grading.

## Findings that matter for this tutorial

| Question | Exact source location | Supported teaching point |
|---|---|---|
| What does Aaronson believe? | Abstract, p. 1; §3, pp. 24–26 | He argues for the conjecture **P ≠ NP**, while acknowledging uncertainty. Attributing a belief in P = NP to him on the basis of this source reverses his stated position. The survey names Knuth as a dissenter and Lipton as agnostic. |
| What are P and NP? | §2, pp. 10–12 | P and NP classify decision problems, meaning families of yes/no instances. P has deterministic polynomial-time decision algorithms. NP has polynomial-length witnesses whose validity a deterministic algorithm checks in polynomial time. NP does not mean “not polynomial.” The witness guarantee concerns yes-instances. |
| Why is P contained in NP? | p. 12 | A verifier can ignore the witness and run the P algorithm. This is a small proof worth showing in the tutorial. |
| What is an instance, language, and input size? | p. 11 | An instance is a finite encoded input. A language is a set of yes-instances represented by finite strings. Complexity is measured using encoding length, not the numerical magnitude of an integer written in binary. |
| Why 3-SAT? | §2.1, pp. 13–15, Theorem 2 | SAT can encode computations. Boolean circuits become 3-CNF by adding gate-value variables and enforcing their local truth tables. The gate encoding is a concrete bridge between computation and logic. The “3” comes from a two-input gate plus its output. |
| What is a reduction? | pp. 12–15 and footnote 9 | A problem A reduces to B when an algorithm for B can solve A using controlled overhead. Aaronson usually uses Turing reductions; most standard NP-completeness presentations use many-one reductions. The tutorial should explicitly choose one. |
| Is deciding existence the same as finding an object? | §2.2.1, p. 16, Proposition 4 | Under P = NP, an accepting witness can be reconstructed one bit at a time by asking whether a completion exists with the next bit fixed to zero. For SAT this self-reduction is also useful with a subexponential solver. Do not generalize this blindly to all total search tasks. |
| What about optimization? | p. 17 | Threshold decision plus binary search finds the best efficiently represented objective value. Verifying feasibility at a threshold and certifying global optimality are different tasks. |
| Why is counting stronger? | §2.2.6, p. 21 | #P consists of integer-valued counting functions rather than decision languages. Exact counting yields decision by testing positivity. The converse need not be efficient: matching existence is in P, while exact perfect-matching counting is #P-complete. P = NP alone does not establish exact polynomial-time #P counting. |
| How to define O, Ω, Θ, and o? | §2.2.7, p. 22 | Big O is an asymptotic upper bound; Ω a lower bound; Θ both. Little o says the ratio vanishes for positive asymptotic comparison functions. The tutorial needs the difference between 2^{cn} for fixed c > 0 and 2^{o(n)}. |
| Why asymptotics are useful but insufficient | §1.2.1–2, pp. 6–7; p. 102, footnote 107 | Asymptotic efficiency is robust under reasonable model changes. Polynomial time can have impractical degrees/constants; exponential time can win at accessible sizes. “Galactic” asymptotic improvements are possible. No practical runtime follows from an unspecified Big O bound. |
| Is counting 2^n candidates an exponential lower bound? | §4, pp. 29–31 | No. The same superficial argument would “prove” hardness for 2-SAT and XOR-SAT, which have efficient algorithms. Algebra and structural reasoning can aggregate many candidates without visiting each individually. Even the 2017 survey gives 3-SAT algorithms faster than 2^n. |
| How does ETH differ from P ≠ NP? | §5.1, p. 31, Conjecture 23 | ETH is a stronger conjecture: 3-SAT requires a fixed exponential rate. P ≠ NP rules out polynomial-time solving but permits intermediate possibilities such as 2^{O(√n)}. Aaronson explicitly warns that ETH had less consensus than P ≠ NP even in 2017. |
| Why does refuting a hypothesis matter for other problems? | §5.1, pp. 31–32 | Reductions transport conditional lower bounds. The failure of a premise removes that conditional argument; it does not mechanically give fast algorithms for every target problem. Quantitative size growth in the reduction matters. |
| Does P ≠ NP establish cryptographic security? | §5.3–5.3.1, pp. 34–37 | No. Worst-case hardness, hardness on efficiently samplable distributions, existence of one-way functions, and public-key assumptions are progressively distinct requirements. One-wayness is about average-case inversion. Factoring is not known NP-complete; the survey places its decision variant in NP ∩ coNP (p. 19). |
| What does arithmetization buy? | §6.3.1, pp. 59–60 | AND becomes multiplication, NOT becomes 1 − x, and OR becomes x + y − xy on Boolean inputs. The resulting polynomial also makes sense away from the Boolean cube. Polynomial degree and root constraints create global structure absent in a black-box list of answers. This is a historical antecedent, not the new paper’s complete algorithm. |
| Can faster algorithms imply lower bounds? | §6.4, pp. 64–72 | Yes, through precise algorithm-to-lower-bound arguments and hierarchy theorems. Williams’s NEXP-versus-ACC example combines better SAT algorithms with an assumption about small circuits to derive a contradiction. It does not show that every improvement in SAT proves P ≠ NP or P = NP. |

## Barriers: what to say and what not to say

- **Relativization**, §6.1.2, pp. 46–47: some proof methods survive giving every machine the same arbitrary oracle. There are oracle worlds with P = NP and others with P ≠ NP. Therefore a proof that works unchanged for every oracle cannot resolve the ordinary question. This limits proof techniques, not mathematical truth or AI capability.
- **Natural proofs**, §6.2.5, pp. 54–58: certain efficiently recognizable properties that certify many functions as hard would also distinguish sufficiently strong pseudorandom functions from truly random functions. Under the relevant cryptographic assumptions, such properties cannot prove the desired broad circuit lower bounds. The word “natural” has a technical definition, not its ordinary meaning.
- **Algebrization**, §6.3.3, pp. 63–64: allowing oracle access to low-degree extensions captures the reach of many arithmetization arguments; some major separations require techniques beyond those arguments. This is not a prohibition on using polynomials to design faster SAT algorithms.
- **Restricted-model lower bounds**, pp. 48–54: exponential lower bounds for resolution, monotone circuits, or bounded-depth circuits do not automatically transfer to unrestricted algorithms. A new general SAT algorithm need not contradict those results.
- **Geometric complexity theory**, pp. 84–99: a research program using symmetries, orbit closures, and representation-theoretic obstructions. Its conjectures, algorithms, partial successes, and no-go results are carefully distinguished. It belongs in optional perspective, not in the prerequisites of a first ETH tutorial.

## Coverage log

All ranges below were read in order; pp. 2–3 and 55 were read again separately after a combined tool output truncated their first display. No source page was replaced by a keyword search or generated abstract.

| PDF pages | Section coverage |
|---|---|
| 1–3 | Abstract, complete contents, Nash/Hilbert motivation and finite witness search |
| 4–5 | Importance of P versus NP; cryptographic and proof-search consequences with practical and verification caveats |
| 6–10 | Objections: asymptotic, polynomial, computational-model, mathematical-status, progress, obviousness, constructivity; further reading |
| 11–12 | Computation-model robustness; languages, instances, P, NP, witnesses, oracle/Turing reducibility |
| 13–15 | NP-hard/complete; SAT, graph and number problems; Cook–Levin and gate encoding; quantifier restatement |
| 16–19 | Search/decision/optimization; Ladner; coNP; polynomial hierarchy; factoring and graph isomorphism |
| 20–23 | Quasipolynomial isomorphism; space; counting; asymptotics and resource hierarchies; padding |
| 24–28 | Reasons for P ≠ NP; approximation thresholds; independence and proof-technique limitations |
| 29–31 | Why proving hardness is difficult; efficient nearby problems; failed exhaustive-search reasoning; ETH introduction |
| 32–34 | Fine-grained consequences; advice and nonuniform circuits; size/depth; random-instance hardness |
| 35–39 | Average-case distributions; one-way functions; public-key distinctions; randomized algorithms, PIT, BPP, derandomization, quantum classes |
| 40–43 | Quantum search caveats; overview of lower-bound approaches; communication complexity, rigidity, tensor rank; hierarchy theorem |
| 44–47 | Deterministic/nondeterministic hierarchies; Shannon counting argument; explicitness; relativization barrier |
| 48–50 | Resolution and DPLL; monotone lower bounds and the power of NOT; bounded-depth circuit setup |
| 51–54 | AC0, parity, random restrictions, formula bounds, polynomial method, barriers from stronger lower bounds |
| 55–58 | Natural proof definitions and pseudorandomness argument; escape routes; interactive-proof setup |
| 59–60 | Interactive protocols; IP = PSPACE; Boolean polynomial encoding and sum-check |
| 61–64 | MA/hybrid lower bounds; algebraic oracles and algebrization; transition to algorithms implying hardness |
| 65–68 | RAM time-space lower bounds, alternation trading, model caveats; NEXP versus ACC introduction |
| 69–72 | Williams’s faster ACC-SAT algorithm, succinct computations, witness circuits, contradiction, derandomization extensions |
| 73–76 | Arithmetic circuit model; Boolean/field distinctions; permanent/determinant, Hessians, formula/circuit relationships |
| 77–80 | Monotone/homogeneous/multilinear arithmetic lower bounds; depth reductions, elusive functions |
| 81–84 | Roots and arithmetic lower bounds; arithmetic natural proofs, pseudorandom-polynomial candidates; GCT introduction |
| 85–88 | Restricted max-flow bound; GCT literature caveats; orbit closures and padded permanent; symmetry characterization |
| 89–91 | Coordinate rings and representations; multiplicity/occurrence obstructions; explicitness; Boolean GCT objects |
| 92–94 | No-go result for occurrence obstructions; symmetry algorithms; tensor border rank; separating modules and uniformity limits |
| 95–99 | GCT lessons and conjectural extrapolations; critique of inevitability; flip theorems; conclusion |
| 100–102 | Future directions as of 2017; possible experimental complexity and galactic constants; acknowledgments; beginning bibliography |
| 103–118 | Bibliography entries 7–278, read for identity and locator context; cited works themselves were not thereby read |
| 119–122 | Final references and complete complexity-class glossary; inclusion diagram text extraction, without geometry validation |

## Boundaries for the independent tutorial review

The new OpenAI theorem must be attributed to its manuscript and repository, not certified using this survey. The textbook explanations should separate proved teaching lemmas from cited research results. A subexponential upper bound does not prove a matching lower bound or establish a separation from P. The reader should be able to derive why an exponent g(n) = o(n) contradicts a positive fixed exponential lower rate, without being asked to accept an analogy about locks or mountains.

The survey has been read in full at text level. Figures have not all been rendered and visually inspected, its bibliography has not been independently revalidated, and its 2017 frontier claims have not been promoted to present-day facts. The video transcript was already read in full by the parent author; this child did not duplicate its audiovisual inspection.
