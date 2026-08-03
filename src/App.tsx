import { FoundationResultsTable, GenerationResultsTable } from "./interactive-results";

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const authors: { name: string; affiliation: string; url?: string }[] = [
  { name: "Yiming Huang", affiliation: "1", url: "https://yimingh.top/" },
  { name: "Yujie Zeng", affiliation: "2", url: "http://yujie.world/" },
  { name: "Vijay Prakash Dwivedi", affiliation: "3", url: "https://vijaydwivedi.com.np/" },
  { name: "Simone Foti", affiliation: "1", url: "https://www.simofoti.com/" },
  { name: "Jianmin Wang", affiliation: "4", url: "https://jianmin2drugai.github.io/" },
  { name: "Jure Leskovec", affiliation: "3", url: "https://cs.stanford.edu/~jure/" },
  { name: "Tolga Birdal", affiliation: "1", url: "https://tolgabirdal.github.io/" },
];

const metrics = [
  {
    value: "100%",
    label: "RDKit validity",
    note: "Across all evaluated benchmarks",
    source: "Table 1",
    tone: "mint",
  },
  {
    value: "1.18M",
    label: "RingDiv molecules",
    note: "299,819 in the development subset",
    source: "Fig. 3 · Methods",
    tone: "coral",
  },
  {
    value: "1st",
    label: "on FCD across five benchmarks",
    note: "GuacaMol FCD score (higher is better): 84.4 vs 78.3",
    source: "Abstract · Table 1 · SI tables",
    tone: "sky",
  },
  {
    value: "+8.3",
    label: "Mean AUC points",
    note: "Probing over the strongest baseline",
    source: "Fig. 5b",
    tone: "amber",
  },
];

export default function App() {
  return (
    <main>
      <div className="prototype-ribbon">
        Visual direction prototype <span>·</span> Links and selected copy are placeholders
      </div>

      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="HGR home">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>HGR</span>
        </a>
        <div className="nav-links">
          <a href="#method">Method</a>
          <a href="#ringdiv">RingDiv</a>
          <a href="#results">Generation</a>
          <a href="#foundation-model">Foundation</a>
          <a href="#resources">Resources</a>
          <a href="#citation">Citation</a>
        </div>
        <span className="nav-status">Preprint in preparation</span>
      </nav>

      <header className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span /> Higher-order Grammar Representation · HGR</p>
          <h1>
            Higher-Order Molecular Grammars
            <span>{" "}for Generative and Foundation Models in Chemistry</span>
          </h1>
          <p className="hero-hook"><em>Higher-order</em> molecular topology, rewritten as a <em>rule sequence.</em></p>
          <p className="hero-deck">
            HGR turns higher-order topology—such as ring systems and recurring motifs—into compact,
            losslessly decodable production-rule sequences—one representation for
            molecular generation and transferable learning.
          </p>
          <div className="hero-actions" aria-label="Project resources">
            <span className="button primary unavailable" aria-disabled="true">
              Paper <small>coming soon</small>
            </span>
            <a
              className="button"
              href="https://github.com/circle-group/HGR"
              target="_blank"
              rel="noreferrer"
            >
              Code <small>GitHub ↗</small>
            </a>
            <span className="button unavailable" aria-disabled="true">
              RingDiv dataset <small>coming soon</small>
            </span>
            <span className="button unavailable" aria-disabled="true">
              BibTeX <small>· coming soon</small>
            </span>
          </div>
          <p className="authors">
            {authors.map((author, index) => (
              <span key={author.name}>
                {author.url ? (
                  <a href={author.url} target="_blank" rel="noreferrer">
                    {author.name}
                  </a>
                ) : (
                  author.name
                )}
                <sup>{author.affiliation}</sup>{index < authors.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
          <p className="affiliation-line" aria-label="Author affiliations">
            <span><sup>1</sup> Imperial College London</span>
            <span><sup>2</sup> Queen Mary University of London</span>
            <span><sup>3</sup> Stanford University</span>
            <span><sup>4</sup> Yonsei University</span>
          </p>
          <div className="institution-logos" aria-label="Participating institutions">
            <img className="imperial-logo" src={assetPath("/logos/imperial-wordmark.svg")} alt="Imperial" />
            <img className="qmul-logo" src={assetPath("/logos/qmul-no-year.png")} alt="Queen Mary University of London" />
            <span className="stanford-logo">
              <img src={assetPath("/logos/stanford.png")} alt="" aria-hidden="true" />
              <b>Stanford University</b>
            </span>
            <img className="yonsei-logo" src={assetPath("/logos/yonsei-light.png")} alt="Yonsei University" />
          </div>
        </div>

        <figure className="hero-visual" aria-label="Overview of higher-order lifting">
          <div className="visual-topline">
            <span>Representation pipeline</span>
            <span className="visual-badge">lossless</span>
          </div>
          <div className="visual-image-wrap">
            <img
              src={assetPath("/fig/hgr-overview.webp")}
              alt="A molecule lifted into a combinatorial complex, parsed into grammar rules, serialized, and reconstructed"
            />
          </div>
          <figcaption>HGR makes higher-order topology explicit, reusable, sequential, and exactly decodable.</figcaption>
        </figure>
      </header>

      <section className="metric-strip" aria-label="Key findings">
        {metrics.map((metric, index) => (
          <article className={`metric-card ${metric.tone}`} key={metric.label}>
            <span className="metric-index">0{index + 1}</span>
            <strong>{metric.value}</strong>
            <h2>{metric.label}</h2>
            <p>{metric.note}</p>
            <small className="metric-source">{metric.source}</small>
          </article>
        ))}
      </section>

      <section className="content-section method-section" id="method">
        <div className="section-intro">
          <p className="eyebrow"><span /> 01 — Method</p>
          <h2>How HGR works</h2>
          <p>
            Sequential and graph formalisms encode atoms and bonds, but leave ring
            systems and recurring motifs implicit. HGR makes that structure explicit
            in four steps—and every step is reversible.
          </p>
        </div>

        <figure className="method-master-figure">
          <div className="master-figure-label">Figure 1 · Framework overview</div>
          <a
            href={assetPath("/fig/hgr-overview-large.webp")}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Figure 1 at full size in a new tab"
          >
            <img
              src={assetPath("/fig/hgr-overview-large.webp")}
              alt="Complete HGR framework, from molecular representations and higher-order lifting to grammar induction, serialization, and lossless reconstruction"
              loading="lazy"
            />
            <span>Open full size ↗</span>
          </a>
          <figcaption>
            <strong>Overview of molecular representations and our HGR framework.</strong>{" "}
            Panels a–b introduce the molecule and representation landscape; panels c–f
            trace higher-order lifting, grammar induction, sequence serialization, and
            reverse derivation.
          </figcaption>
        </figure>

        <div className="step-by-step-heading">
          <p>Figure 1c–f</p>
          <h3>Step by step</h3>
          <span>Each stage below enlarges one part of the framework and explains its role.</span>
        </div>

        <ol className="method-steps">
          <li className="method-step step-lift">
            <span className="step-number">1</span>
            <div className="step-copy">
              <h3>Lift</h3>
              <p className="step-flow">molecule → combinatorial complex</p>
              <p>
                Higher-order lifting groups atoms into the units chemists actually reason
                about: rings, fused ring systems, and recurring motifs. The result is a
                <strong> combinatorial complex</strong> whose cells form a contraction
                hierarchy, from individual atoms up to the whole molecular scaffold.
              </p>
              <p>
                Two complementary lifting strategies—MIG and RSG—trade topological
                expressiveness against how compact the resulting grammar is, with RSG
                used throughout the main experiments and MIG reported as an ablation.
              </p>
            </div>
            <figure>
              <img src={assetPath("/fig/claude-lift.webp")} alt="A molecule lifted into nested higher-order cells" loading="lazy" />
              <figcaption>Cell colour encodes rank in the hierarchy. Fig. 1c.</figcaption>
            </figure>
          </li>

          <li className="method-step step-induce">
            <span className="step-number">2</span>
            <div className="step-copy">
              <h3>Induce</h3>
              <p className="step-flow">complex → production rules</p>
              <p>
                Parsing the hierarchy induces a context-free higher-order grammar. Each
                production rule maps a non-terminal site and its <strong>ordered anchor
                interface</strong> to a right-hand-side local graph.
              </p>
              <p>
                Rules induced across a molecular library are pooled into one shared corpus,
                so recurring motifs become <strong>reusable, interpretable tokens</strong>.
              </p>
            </div>
            <figure>
              <div className="stacked-method-images">
                <img src={assetPath("/fig/claude-rule.webp")} alt="A single higher-order production rule" loading="lazy" />
                <img src={assetPath("/fig/claude-corpus.webp")} alt="A shared corpus of higher-order production rules" loading="lazy" />
              </div>
              <figcaption>A rule maps an ordered anchor interface to a local graph. Fig. 1d.</figcaption>
            </figure>
          </li>

          <li className="method-step step-serialize">
            <span className="step-number">3</span>
            <div className="step-copy">
              <h3>Serialize</h3>
              <p className="step-flow">complex → HGR string</p>
              <p>
                The derivation is written as an ordered string of rule tokens. An HGR string
                is <strong>just a sequence</strong>, so standard sequence architectures consume
                it directly—without incidence matrices or bespoke higher-order layers.
              </p>
              <p>
                One representation then serves grammar-constrained generation and molecular
                foundation-model pretraining.
              </p>
            </div>
            <figure>
              <img src={assetPath("/fig/claude-string.webp")} alt="HGR rule strings used by generative and foundation models" loading="lazy" />
              <figcaption>The same sequence representation serves generation and pretraining. Fig. 1e.</figcaption>
            </figure>
          </li>

          <li className="method-step step-decode">
            <span className="step-number">4</span>
            <div className="step-copy">
              <h3>Decode</h3>
              <p className="step-flow">HGR string → molecule</p>
              <p>
                Applying the recorded rules in reverse <strong>losslessly reconstructs</strong>
                the combinatorial complex and molecular graph. The ordered anchor interface
                fixes the boundary correspondence, so reverse derivation is exact.
              </p>
              <p>
                Because every rule is induced from a real molecular subgraph, decoding
                preserves recorded bonds and valency by construction.
              </p>
            </div>
            <figure>
              <img src={assetPath("/fig/claude-decode.webp")} alt="Successive rule applications reconstructing the original molecular complex" loading="lazy" />
              <figcaption>Reverse derivation rebuilds the molecule exactly. Fig. 1f.</figcaption>
            </figure>
          </li>
        </ol>

      </section>

      <section className="content-section ringdiv-section" id="ringdiv">
        <div className="ringdiv-copy">
          <p className="eyebrow coral"><span /> RingDiv benchmark</p>
          <h2>A harder benchmark for ring-rich chemical space.</h2>
          <p>
            RingDiv is constructed from approximately 143 million candidates and
            enriches rare but informative ring topologies through quota-first sampling
            and diversity-aware selection.
          </p>
          <dl className="ring-stats">
            <div><dt>1.18M</dt><dd>curated molecules</dd></div>
            <div><dt>299,819</dt><dd>RingDiv300k subset</dd></div>
            <div><dt>RDI</dt><dd>ring diversity index</dd></div>
          </dl>
          <span className="inline-resource">Dataset release <b>coming soon</b></span>
        </div>
        <figure className="paper-figure ringdiv-figure">
          <div className="figure-label">Figure 02 · Benchmark landscape</div>
          <img
            src={assetPath("/fig/ringdiv.webp")}
            alt="Comparison of ring diversity, ring-system counts, QRCI, and ring substructures across molecular benchmarks"
            loading="lazy"
          />
          <figcaption>
            RingDiv broadens coverage across medium, spiro, fused, condensed, and bridged ring systems.
          </figcaption>
        </figure>
      </section>

      <section className="content-section result-story generation-story" id="results">
        <header className="result-story-heading">
          <p className="eyebrow"><span /> 02 — Molecular generation</p>
          <h2>Grammar-constrained generation across diverse chemical spaces.</h2>
          <p>
            HGR-VAE uses grammar-constrained decoding, while HGR-LDF improves
            distributional alignment across standard and ring-rich benchmarks.
          </p>
        </header>

        <div className="result-story-grid">
          <div className="result-visual-column">
            <figure className="generation-framework">
              <div className="framework-label">Model workflow</div>
              <img
                src={assetPath("/fig/generation-framework.webp")}
                alt="Molecules parsed into HGR rule sequences, encoded and reconstructed by a grammar autoencoder, with optional latent diffusion for sampling"
                loading="lazy"
              />
              <figcaption>
                <strong>Workflow of HGR-based molecular generative models.</strong>
              </figcaption>
            </figure>
            <div className="result-callouts">
              <span><strong>1st</strong> on FCD across five benchmarks</span>
              <span><strong>100%</strong> validity in all evaluated benchmarks</span>
            </div>
            <figure className="result-figure">
              <img
                src={assetPath("/fig/generation.webp")}
                alt="Functional-group, ring-size, synthetic-accessibility, and chemical-space generation results"
                loading="lazy"
              />
              <figcaption>Generation fidelity and chemical-space coverage on RingDiv300k.</figcaption>
            </figure>
          </div>

          <div className="result-table-panel"><GenerationResultsTable /></div>
        </div>
      </section>

      <section className="content-section result-story foundation-story" id="foundation-model">
        <header className="result-story-heading">
          <p className="eyebrow"><span /> 03 — Foundation model</p>
          <h2>Higher-order grammar tokens transfer across molecular property tasks.</h2>
          <p>
            HGR-FM couples reusable rule tokens with structural attention biases to
            produce transferable molecular fingerprints across seven benchmarks.
          </p>
        </header>

        <div className="result-story-grid">
          <div className="result-visual-column">
            <div className="result-callouts">
              <span><strong>+8.3</strong> mean AUC · probing</span>
              <span><strong>+3.3</strong> mean AUC · fine-tuning</span>
            </div>
            <figure className="result-figure">
              <img
                src={assetPath("/fig/foundation.webp")}
                alt="HGR foundation-model architecture, transfer results, and ablation studies"
                loading="lazy"
              />
              <figcaption>HGR-FM architecture, transfer results, and ablation studies.</figcaption>
            </figure>
          </div>

          <div className="result-table-panel"><FoundationResultsTable /></div>
        </div>
      </section>

      <section className="resource-section" id="resources">
        <div>
          <p className="eyebrow light"><span /> Resources</p>
          <h2>Everything needed to inspect, reproduce, and extend HGR.</h2>
        </div>
        <div className="resource-list">
          <span><b>01</b> Paper <small>preprint coming soon</small></span>
          <span>
            <b>02</b>
            <a href="https://github.com/circle-group/HGR" target="_blank" rel="noreferrer">
              Reference code
            </a>
            <small>GitHub repository ↗</small>
          </span>
          <span><b>03</b> RingDiv dataset <small>hosting to be confirmed</small></span>
          <span><b>04</b> Checkpoints <small>release in preparation</small></span>
        </div>
      </section>

      <section className="citation-section" id="citation">
        <div className="citation-copy">
          <p className="eyebrow"><span /> Publication</p>
          <h2>Citation</h2>
          <p>Citation metadata will be available with the public preprint.</p>
        </div>
      </section>

      <footer>
        <a className="brand footer-brand" href="#top"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>HGR</a>
        <p>Higher-order topology, made learnable.</p>
        <p>Visual prototype · August 2026</p>
      </footer>
    </main>
  );
}
