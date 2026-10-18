import { Section, Reveal, Cross, Arrow, CornerMarks, Barcode, Sticker } from "@/components/Decor";
import { Button } from "@/components/ui/button";
import { achievements, stats, profile } from "@/data/profile";

const BADGE_CONFIG = [
  { tone: "bg-yellow text-ink", icon: "🦈", desc: "Merged Pull Requests" },
  { tone: "bg-sky text-ink", icon: "⚡", desc: "Rapid Review & Merge" },
  { tone: "bg-coral text-ink", icon: "🎯", desc: "Direct Production Push" },
];

const STAT_CONFIG = [
  { tone: "bg-coral text-ink", subtitle: "Active Codebases" },
  { tone: "bg-yellow text-ink", subtitle: "Community Stargazers" },
  { tone: "bg-sky text-ink", subtitle: "Developers Following" },
];

function Achievements() {
  return (
    <Section
      id="achievements"
      index="06"
      label="Achievements"
      title="Verified Receipts"
      aside="Official badges, hackathon builds, and metrics from github.com/Ladnil03."
      tone="paper"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {/* ── Big Stat Counters (7 cols) ── */}
        <Reveal className="lg:col-span-7">
          <div className="grid h-full grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((stat, i) => {
              const conf = STAT_CONFIG[i % STAT_CONFIG.length];
              return (
                <div
                  key={stat.label}
                  className={`group relative flex flex-col justify-between gap-6 border-[3px] border-ink p-6 shadow-brutal brutal-press transition-all ${conf.tone}`}
                >
                  <CornerMarks />
                  <div className="flex items-center justify-between">
                    <span className="label-mono bg-ink px-2 py-0.5 text-[0.625rem] text-paper">
                      METRIC #{i + 1}
                    </span>
                    <span className="font-display text-lg text-ink">★</span>
                  </div>

                  <span className="font-display text-6xl leading-none sm:text-7xl">
                    {stat.value}
                  </span>

                  <div className="border-t-2 border-ink pt-3">
                    <span className="label-mono block font-bold text-xs">
                      {stat.label.toUpperCase()}
                    </span>
                    <span className="label-mono block text-[0.625rem] opacity-75 mt-0.5">
                      {conf.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ── GitHub Achievements Showcase (5 cols) ── */}
        <Reveal className="lg:col-span-5">
          <div className="relative flex h-full flex-col justify-between gap-5 border-[3px] border-ink bg-ink p-7 text-paper shadow-brutal-lg">
            <CornerMarks />
            <div>
              <div className="flex items-center justify-between border-b-2 border-paper/40 pb-3">
                <span className="label-mono text-xs text-yellow font-bold">
                  GITHUB BADGES // LAD_NIL
                </span>
                <Barcode className="h-4 text-paper opacity-80" />
              </div>

              <h3 className="font-display mt-4 text-2xl uppercase tracking-tight text-paper">
                Profile Badges
              </h3>

              <ul className="mt-5 flex flex-col gap-3">
                {achievements.map((badge, i) => {
                  const conf = BADGE_CONFIG[i % BADGE_CONFIG.length];
                  return (
                    <li
                      key={badge.label}
                      className={`flex items-center justify-between gap-3 border-[3px] border-paper p-3 shadow-brutal-xs brutal-press ${conf.tone}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl select-none">{conf.icon}</span>
                        <div>
                          <span className="font-display text-base tracking-tight uppercase block leading-none">
                            {badge.label}
                          </span>
                          <span className="label-mono text-[0.6rem] opacity-75 block mt-0.5">
                            {conf.desc}
                          </span>
                        </div>
                      </div>

                      {badge.detail ? (
                        <span className="border-2 border-ink bg-paper px-2.5 py-0.5 label-mono text-xs font-bold text-ink">
                          {badge.detail}
                        </span>
                      ) : (
                        <span className="border-2 border-ink bg-paper px-2 py-0.5 label-mono text-[0.625rem] text-ink font-bold">
                          EARNED
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between border-t-2 border-paper/30 pt-3">
              <span className="label-mono text-[0.625rem] text-paper/60">
                SOURCE: GITHUB REST API
              </span>
              <Cross aria-hidden="true" className="text-2xl text-coral">
                +
              </Cross>
            </div>
          </div>
        </Reveal>

        {/* ── Bob AI Hackathon Showcase (12 cols) ── */}
        <Reveal className="lg:col-span-12">
          <article className="relative flex flex-col gap-6 border-[3px] border-ink bg-paper p-7 shadow-brutal brutal-press sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <CornerMarks />
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center border-[3px] border-ink bg-yellow font-display text-2xl text-ink shadow-brutal-xs">
                🏆
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <Sticker tone="coral" rotate="-1deg" className="text-[0.625rem]">
                    HACKATHON BUILD
                  </Sticker>
                  <span className="label-mono text-xs text-ink/60">TEAM REPO</span>
                </div>
                <h3 className="text-card-title mt-2 text-ink">
                  Bob AI Hackathon — TheFourHorsemen
                </h3>
                <p className="mt-2 text-sm text-ink/80 max-w-2xl font-medium">
                  Team engineering repository submitted for the Bob AI Hackathon challenge. Live JavaScript codebase published to GitHub.
                </p>
              </div>
            </div>

            <Button asChild variant="secondary" size="lg" className="shrink-0 shadow-brutal-sm">
              <a
                href="https://github.com/Ladnil03/bob-ai-hackathon-TheFourHorsemen"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inspect Hackathon Build <Arrow />
              </a>
            </Button>
          </article>
        </Reveal>
      </div>

      <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-4 border-[2px] border-ink bg-yellow p-4 shadow-brutal-xs">
        <p className="label-mono flex flex-wrap items-center gap-2 text-ink text-xs font-bold">
          <span>PUBLIC PROFILE VERIFICATION:</span>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[2px] underline-offset-4 hover:text-coral"
          >
            github.com/{profile.handle} <Arrow />
          </a>
        </p>
        <span className="label-mono text-xs text-ink/70">
          ALL METRICS RETRIEVED FROM PUBLIC GITHUB ENDPOINTS
        </span>
      </Reveal>
    </Section>
  );
}

export default Achievements;