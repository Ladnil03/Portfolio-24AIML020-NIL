import { Section, Reveal, Cross, Arrow, Barcode, Sticker, CornerMarks } from "@/components/Decor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/data/profile";

function About() {
  const interests = [
    { title: "Artificial Intelligence", tag: "CORE" },
    { title: "Machine Learning", tag: "MODELS" },
    { title: "Web Development", tag: "FULL-STACK" },
    { title: "Competitive Programming", tag: "DSA & LOGIC" },
  ];

  return (
    <Section
      id="about"
      index="01"
      label="About Me"
      title="Engineering Profile"
      aside="Verbatim from published profile and coursework repositories — authentic developer identity."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* ── Block 1: Main Statement & Bio (7 cols, 2 rows) ── */}
        <Reveal className="lg:col-span-7 lg:row-span-2">
          <article className="relative flex h-full flex-col justify-between gap-8 border-[3px] border-ink bg-paper p-7 shadow-brutal-lg sm:p-9">
            <CornerMarks />
            <div>
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <span className="label-mono flex items-center gap-2 text-ink/60">
                  <span className="size-2 bg-coral" />
                  BIO_STATEMENT // LAD_NIL
                </span>
                <Barcode className="h-4 text-ink" />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Sticker tone="yellow" rotate="-2deg">
                  CREATIVE DEV
                </Sticker>
                <Badge variant="sky">AIML STUDENT</Badge>
              </div>

              <h3 className="font-display mt-5 text-3xl leading-[1.05] tracking-tight uppercase sm:text-5xl">
                {profile.greeting}
                <span className="ml-2 inline-block">👋</span>
              </h3>
            </div>

            <p className="border-l-[4px] border-coral pl-5 text-lg leading-relaxed text-ink/90 sm:text-xl">
              {profile.intro}
            </p>

            <div className="border-t-2 border-ink pt-5">
              <p className="font-mono text-xs font-bold text-ink/70">
                &gt; FOCUS: Intelligent machine learning systems &amp; robust, responsive web applications.
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="label-mono text-xs text-ink/50">LOCATION: GUJARAT, INDIA</span>
                <Cross className="text-3xl text-coral" aria-hidden="true">
                  +
                </Cross>
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Block 2: Coral Current Role Block (5 cols) ── */}
        <Reveal className="lg:col-span-5">
          <article className="flex h-full flex-col justify-between gap-5 border-[3px] border-ink bg-coral p-7 shadow-brutal brutal-press sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="label-mono bg-ink px-2 py-0.5 text-xs text-paper">
                  CURRENT ROLE
                </span>
                <span className="font-display text-xl text-ink">01</span>
              </div>
              <h3 className="text-card-title mt-4 text-ink">{profile.role}</h3>
              <p className="font-mono mt-3 text-sm font-bold text-ink/90">
                Status: {profile.status}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="border-2 border-ink bg-paper px-3 py-1 label-mono text-xs text-ink shadow-brutal-xs">
                ● OPEN TO WORK
              </span>
              <span className="border-2 border-ink bg-yellow px-3 py-1 label-mono text-xs text-ink shadow-brutal-xs">
                INTERNSHIPS &amp; BUILDS
              </span>
            </div>
          </article>
        </Reveal>

        {/* ── Block 3: Sky Blue Coursework Block (5 cols) ── */}
        <Reveal className="lg:col-span-5">
          <article className="flex h-full flex-col justify-between gap-5 border-[3px] border-ink bg-sky p-7 shadow-brutal brutal-press sm:p-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="label-mono bg-ink px-2 py-0.5 text-xs text-paper">
                  COURSEWORK TRACK
                </span>
                <span className="font-display text-xl text-ink">02</span>
              </div>
              <h3 className="text-card-title mt-4 text-ink">24AIML020</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/85">
                AI &amp; Machine Learning curriculum and ITUE301 Examination Project — both published in public repositories.
              </p>
            </div>

            <Button asChild variant="outline" size="sm" className="self-start shadow-brutal-xs">
              <a
                href="https://github.com/Ladnil03/itue301-exam-24aiml020-B"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inspect Exam Repo <Arrow />
              </a>
            </Button>
          </article>
        </Reveal>

        {/* ── Block 4: Bold Yellow Core Passions (12 cols) ── */}
        <Reveal className="lg:col-span-12">
          <article className="border-[3px] border-ink bg-yellow p-7 shadow-brutal-lg sm:p-9">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="shrink-0">
                <span className="label-mono bg-ink px-2.5 py-1 text-xs text-paper">
                  CORE PASSIONS
                </span>
                <h3 className="text-card-title mt-3 text-ink">Four Technical Pillars</h3>
                <p className="label-mono mt-1 text-xs text-ink/65">
                  THE EXACT INTERESTS FROM THE ORIGINAL PORTFOLIO
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {interests.map((item, idx) => (
                  <div
                    key={item.title}
                    className="flex flex-col justify-between gap-3 border-[3px] border-ink bg-paper p-4 shadow-brutal-xs brutal-press"
                  >
                    <div className="flex items-center justify-between">
                      <span className="label-mono text-[0.625rem] text-ink/50">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="border border-ink bg-sky px-1.5 py-0.5 label-mono text-[0.6rem] text-ink">
                        {item.tag}
                      </span>
                    </div>
                    <span className="font-display text-base leading-tight uppercase text-ink">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Block 5: Technical Stance & Code Philosophy (12 cols) ── */}
        <Reveal className="lg:col-span-12">
          <div className="grid grid-cols-1 border-[3px] border-ink bg-ink text-paper shadow-brutal sm:grid-cols-3">
            <div className="border-b-[3px] border-ink p-6 sm:border-r-[3px] sm:border-b-0">
              <p className="label-mono text-coral text-xs">BACKEND MATURITY</p>
              <h4 className="font-display mt-2 text-xl uppercase">RMM Level 3 REST API</h4>
              <p className="mt-2 text-xs leading-relaxed text-paper/75">
                Engineered with HATEOAS hypermedia controls, JWT auth, and separation of PUT vs PATCH verbs.
              </p>
            </div>
            <div className="border-b-[3px] border-ink p-6 sm:border-r-[3px] sm:border-b-0">
              <p className="label-mono text-yellow text-xs">PERFORMANCE WINS</p>
              <h4 className="font-display mt-2 text-xl uppercase">In-Memory Caching</h4>
              <p className="mt-2 text-xs leading-relaxed text-paper/75">
                Benchmarked with node-cache, write-through invalidation, and custom X-Cache response headers.
              </p>
            </div>
            <div className="p-6">
              <p className="label-mono text-sky text-xs">MODERN FRONTEND</p>
              <h4 className="font-display mt-2 text-xl uppercase">React 19 + Vite</h4>
              <p className="mt-2 text-xs leading-relaxed text-paper/75">
                Route code-splitting, optimistic UI mutations, and lazy data analytics visualisations.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default About;