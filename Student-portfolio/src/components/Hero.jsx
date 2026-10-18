import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Arrow, Cross, Sticker, Barcode, CornerMarks, HazardBar } from "@/components/Decor";
import { profile } from "@/data/profile";
import luffy from "@/assets/luffy.jpg";

/** One word of the name, sitting on an offset accent block with hard shadow. */
function NameWord({ children, accent = "bg-yellow" }) {
  return (
    <span className="relative inline-block select-none">
      <span
        aria-hidden="true"
        className={`absolute -left-[0.06em] top-[0.14em] -z-10 h-[0.78em] w-[1.04em] border-[3px] border-ink shadow-brutal-sm ${accent}`}
      />
      <span className="relative drop-shadow-[2px_2px_0_rgba(0,0,0,0.15)]">{children}</span>
    </span>
  );
}

function Hero() {
  // Real technologies Nil builds with — deduplicated and cleanly arranged
  const tickerItems = [
    "Machine Learning",
    "Python",
    "React",
    "Node.js",
    "REST APIs",
    "MongoDB",
    "C++",
    "JavaScript",
    "Git",
    "HATEOAS / RMM Level 3",
  ];

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b-[3px] border-ink bg-paper"
    >
      <div
        aria-hidden="true"
        className="grid-paper pointer-events-none absolute inset-0 opacity-70"
      />

      {/* Decorative brutalist background accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none">
        <div className="absolute top-[14%] right-[5%] hidden size-28 rotate-12 border-[3px] border-ink bg-sky shadow-brutal-lg lg:block" />
        <div className="absolute bottom-[22%] left-[2%] hidden size-20 -rotate-6 border-[3px] border-ink bg-yellow shadow-brutal lg:block" />
        <Cross className="absolute top-[6%] left-[3%] hidden text-5xl text-ink/30 lg:block">
          +
        </Cross>
        <Cross className="absolute bottom-[16%] right-[8%] hidden text-4xl text-coral lg:block">
          +
        </Cross>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1400px] gap-12 px-5 pt-12 pb-12 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-12 lg:pt-16 lg:pb-16">
        {/* ── Main Editorial Column (7 / 8 cols) ── */}
        <div className="lg:col-span-7 xl:col-span-8">
          {/* Top Metadata Header Rail */}
          <div className="animate-slide-in flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Badge variant="inverted" className="text-xs">
              AI / ML ENGINEER
            </Badge>
            <Badge variant="sky" className="text-xs">
              REACT DEVELOPER
            </Badge>
            <Sticker tone="yellow" rotate="-2deg" className="text-[0.65rem]">
              24AIML020
            </Sticker>
            <span className="label-mono inline-flex items-center gap-2 border-2 border-ink bg-paper px-2.5 py-1 text-xs text-ink shadow-brutal-xs">
              <span className="size-2 animate-blink bg-coral" aria-hidden="true" />
              STATUS: {profile.status.toUpperCase()}
            </span>
          </div>

          {/* Huge Neo-Brutalist Typography */}
          <h1
            id="hero-title"
            className="text-display animate-rise mt-8 text-ink [animation-delay:60ms]"
          >
            <span className="block">
              <NameWord accent="bg-yellow">Nil</NameWord>
            </span>
            <span className="block pl-[0.1em] sm:pl-[0.16em]">
              <NameWord accent="bg-coral">Lad</NameWord>
            </span>
          </h1>

          {/* Secondary Title Ribbon */}
          <div className="animate-rise mt-4 flex items-center gap-3 [animation-delay:120ms]">
            <span className="border-[3px] border-ink bg-ink px-3 py-1 label-mono text-xs text-paper shadow-brutal-xs">
              PORTFOLIO 2026
            </span>
            <span className="label-mono text-xs text-ink/75">
              BUILDING INTELLIGENT SYSTEMS &amp; MODERN WEB ARCHITECTURE
            </span>
          </div>

          {/* Verbatim Intro Paragraph */}
          <p className="animate-rise mt-7 max-w-xl border-l-[4px] border-coral bg-paper/80 p-4 pl-5 text-lg leading-relaxed text-ink shadow-brutal-xs [animation-delay:180ms] sm:text-xl">
            {profile.intro}
          </p>

          {/* Brutalist Action Buttons */}
          <div className="animate-rise mt-8 flex flex-wrap gap-4 [animation-delay:240ms]">
            <Button asChild size="lg" className="shadow-brutal-lg">
              <a href="#projects">
                Explore Work [06] <Arrow />
              </a>
            </Button>
            <Button asChild size="lg" variant="accent" className="shadow-brutal">
              <a href="#contact">
                Contact Me <Arrow className="-rotate-45" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="shadow-brutal-sm">
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                GitHub @Ladnil03 ↗
              </a>
            </Button>
          </div>

          {/* Technical Spec Matrix Box */}
          <div className="animate-rise mt-9 max-w-2xl border-[3px] border-ink bg-paper p-5 shadow-brutal [animation-delay:300ms]">
            <div className="mb-3 flex items-center justify-between border-b-2 border-ink pb-2">
              <span className="label-mono flex items-center gap-2 text-ink">
                <span className="size-2 bg-coral" />
                SYSTEM_SPECS // NIL_LAD.SYS
              </span>
              <Barcode className="h-4 text-ink" />
            </div>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="label-mono text-ink/50 text-[0.625rem]">ROLL NUMBER</dt>
                <dd className="font-mono text-sm font-bold text-ink">24AIML020</dd>
              </div>
              <div>
                <dt className="label-mono text-ink/50 text-[0.625rem]">REPOSITORIES</dt>
                <dd className="font-mono text-sm font-bold text-coral">18 Public</dd>
              </div>
              <div>
                <dt className="label-mono text-ink/50 text-[0.625rem]">FOCUS</dt>
                <dd className="font-mono text-sm font-bold text-ink">AI / ML / Web</dd>
              </div>
              <div>
                <dt className="label-mono text-ink/50 text-[0.625rem]">AVAILABILITY</dt>
                <dd className="font-mono text-sm font-bold text-ink">Open to Work</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* ── Portrait & Identity Showcase (5 / 4 cols) ── */}
        <div className="animate-rise lg:col-span-5 xl:col-span-4 [animation-delay:200ms]">
          <div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-none">
            {/* Multi-layered offset brutalist background panels */}
            <div
              aria-hidden="true"
              className="absolute -top-4 -right-4 bottom-4 left-4 -z-20 border-[3px] border-ink bg-sky"
            />
            <div
              aria-hidden="true"
              className="absolute -top-2 -right-2 bottom-2 left-2 -z-10 border-[3px] border-ink bg-coral"
            />

            {/* Main Portrait Frame */}
            <div className="relative border-[3px] border-ink bg-paper p-2 shadow-brutal-xl">
              <CornerMarks />

              {/* Tilted Sticker Stamp */}
              <div className="absolute -top-4 -left-4 z-20">
                <Sticker tone="yellow" rotate="-6deg">
                  ★ VERIFIED DEV
                </Sticker>
              </div>

              <div className="relative overflow-hidden border-[3px] border-ink bg-paper">
                <img
                  src={luffy}
                  alt="Portrait of Nil Lad"
                  width={420}
                  height={420}
                  fetchPriority="high"
                  decoding="async"
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Identity Strip underneath portrait */}
              <div className="mt-2 flex items-center justify-between border-[3px] border-ink bg-yellow px-3 py-2 text-ink shadow-brutal-xs">
                <span className="label-mono font-bold">NIL LAD // 24AIML020</span>
                <span className="label-mono bg-ink px-1.5 py-0.5 text-[0.625rem] text-paper">
                  GUJARAT, IN
                </span>
              </div>
            </div>

            {/* Quick Stats Banner under portrait */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="border-[3px] border-ink bg-coral p-2 shadow-brutal-xs">
                <p className="font-display text-2xl leading-none text-ink">18</p>
                <p className="label-mono mt-1 text-[0.6rem] text-ink">Repos</p>
              </div>
              <div className="border-[3px] border-ink bg-yellow p-2 shadow-brutal-xs">
                <p className="font-display text-2xl leading-none text-ink">03</p>
                <p className="label-mono mt-1 text-[0.6rem] text-ink">Stars</p>
              </div>
              <div className="border-[3px] border-ink bg-sky p-2 shadow-brutal-xs">
                <p className="font-display text-2xl leading-none text-ink">06</p>
                <p className="label-mono mt-1 text-[0.6rem] text-ink">Followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kinetic Dual-Layer Neo-Brutalist Ticker ── */}
      <div className="relative border-t-[3px] border-ink bg-ink py-3 text-paper">
        <div className="flex w-max animate-ticker">
          {[0, 1].map((loop) => (
            <ul
              key={loop}
              aria-hidden={loop === 1 ? "true" : undefined}
              className="flex shrink-0 items-center"
            >
              {tickerItems.map((skill, idx) => (
                <li
                  key={`${loop}-${skill}-${idx}`}
                  className="label-mono flex items-center gap-6 px-6 whitespace-nowrap text-xs font-bold sm:text-sm"
                >
                  <span className="text-yellow">▶</span>
                  <span>{skill}</span>
                  <span className="text-coral">✳</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Hazard Caution Tape Accent Ribbon */}
      <HazardBar tone="yellow" />
    </section>
  );
}

export default Hero;