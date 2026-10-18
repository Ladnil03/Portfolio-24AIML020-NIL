import { Section, Reveal, Arrow, CornerMarks, Barcode, Sticker } from "@/components/Decor";
import { education } from "@/data/profile";

function Education() {
  return (
    <Section
      id="education"
      index="05"
      label="Education"
      title="Academic &amp; Exam Track"
      aside="Course codes derived directly from published repositories. Real academic milestones."
      tone="paper"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {education.map((item, i) => (
          <Reveal key={item.code} className="h-full">
            <article
              className={`group relative flex h-full flex-col justify-between gap-6 border-[3px] border-ink p-7 shadow-brutal-lg brutal-press sm:p-9 transition-all ${
                i === 0 ? "bg-yellow" : "bg-sky"
              }`}
            >
              <CornerMarks />

              {/* Card Header Rail */}
              <div>
                <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                  <span className="label-mono bg-ink px-2 py-0.5 text-xs text-paper font-bold">
                    MODULE // {String(i + 1).padStart(2, "0")}
                  </span>
                  <Sticker tone="paper" rotate={i === 0 ? "-2deg" : "2deg"} className="text-[0.625rem]">
                    {i === 0 ? "AIML TRACK" : "FINAL SUBMISSION"}
                  </Sticker>
                </div>

                {/* Big Display Code */}
                <p className="font-display mt-5 text-5xl leading-none tracking-tight sm:text-6xl text-ink">
                  {item.code}
                </p>

                <h3 className="text-card-title mt-3 text-ink">{item.title}</h3>

                <p className="mt-3 max-w-md text-sm leading-relaxed sm:text-base text-ink/85 font-medium">
                  {item.note}
                </p>
              </div>

              {/* Card Footer Rail */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-5 mt-auto">
                <Barcode className="h-4 text-ink opacity-70" />

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-[3px] border-ink bg-paper px-4 py-2.5 label-mono text-xs font-bold text-ink shadow-brutal-xs brutal-press"
                >
                  Inspect on GitHub <Arrow />
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export default Education;