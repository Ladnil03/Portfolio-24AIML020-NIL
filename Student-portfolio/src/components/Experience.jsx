import { Section, Reveal, Arrow, CornerMarks, Barcode } from "@/components/Decor";
import { experience, profile } from "@/data/profile";

const RAILS = [
  { tone: "bg-coral text-ink", badge: "bg-ink text-paper" },
  { tone: "bg-sky text-ink", badge: "bg-ink text-paper" },
  { tone: "bg-yellow text-ink", badge: "bg-ink text-paper" },
];

function Experience() {
  return (
    <Section
      id="experience"
      index="04"
      label="Experience"
      title="Engineering Timeline"
      aside="Dated from this repository's commit history and published technical documentation."
    >
      <ol className="flex flex-col gap-8">
        {experience.map((item, i) => {
          const rail = RAILS[i % RAILS.length];
          return (
            <Reveal as="li" key={`${item.period}-${item.role}`}>
              <article className="group relative grid grid-cols-1 border-[3px] border-ink bg-paper shadow-brutal brutal-press lg:grid-cols-12 transition-all">
                <CornerMarks />

                {/* Left Period & Number Rail (3 cols) */}
                <div
                  className={`flex items-center justify-between gap-3 border-b-[3px] border-ink p-6 lg:col-span-3 lg:flex-col lg:items-start lg:justify-between lg:border-r-[3px] lg:border-b-0 lg:p-8 ${rail.tone}`}
                >
                  <div className="flex flex-col">
                    <span className="label-mono font-bold text-xs">MILESTONE</span>
                    <span className="font-display text-5xl leading-none text-ink sm:text-6xl mt-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col items-end lg:items-start">
                    <span className="border-2 border-ink bg-paper px-3 py-1 label-mono text-xs text-ink font-bold shadow-brutal-xs">
                      {item.period}
                    </span>
                    <span className="label-mono mt-2 text-[0.625rem] opacity-75">
                      VERIFIED REPO
                    </span>
                  </div>
                </div>

                {/* Right Content Area (9 cols) */}
                <div className="flex flex-col justify-between gap-5 p-6 sm:p-8 lg:col-span-9">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink pb-3">
                      <div>
                        <span className="label-mono text-xs text-coral font-bold">
                          SYSTEM MODULE // {item.org.toUpperCase()}
                        </span>
                        <h3 className="text-card-title mt-1 text-ink">{item.role}</h3>
                      </div>
                      <Barcode className="h-4 hidden sm:flex text-ink" />
                    </div>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed sm:text-base text-ink/90 font-medium">
                      {item.summary}
                    </p>
                  </div>

                  {/* Bullet Points Grid */}
                  <div>
                    <p className="label-mono mb-2.5 text-[0.625rem] text-ink/60">
                      KEY DELIVERABLES &amp; STANDARDS:
                    </p>
                    <ul className="flex flex-wrap gap-2.5">
                      {item.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-center gap-2 border-2 border-ink bg-paper px-3 py-1.5 label-mono text-xs text-ink shadow-brutal-xs"
                        >
                          <span className="text-coral font-bold">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Link */}
                  <div className="border-t-2 border-ink/40 pt-4 flex items-center justify-between">
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-2 border-ink bg-yellow px-4 py-2 label-mono text-xs font-bold text-ink shadow-brutal-xs brutal-press"
                    >
                      View Source on GitHub <Arrow />
                    </a>
                    <span className="label-mono text-[0.625rem] text-ink/50 hidden sm:inline-block">
                      ORG // {item.org}
                    </span>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </ol>
    </Section>
  );
}

export default Experience;