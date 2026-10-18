import { Section, Reveal, Cross, Arrow, CornerMarks, Barcode, Sticker } from "@/components/Decor";
import ContactForm from "@/components/ContactForm";
import { profile } from "@/data/profile";

function ContactSection() {
  return (
    <Section
      id="contact"
      index="07"
      label="Contact"
      title="Initiate Contact"
      aside="Direct communication channel. GitHub issues and messages welcome."
      tone="paper"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* ── Statement Side (5 cols) ── */}
        <Reveal className="lg:col-span-5">
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sticker tone="yellow" rotate="-2deg" className="text-xs">
                  OPEN FOR WORK
                </Sticker>
                <span className="label-mono text-xs text-ink/60">COLLABORATION 2026</span>
              </div>

              {/* Massive Visual Statement */}
              <p className="font-display text-[clamp(3.5rem,9.5vw,6.5rem)] leading-[0.84] tracking-[-0.04em] uppercase text-ink select-none">
                <span className="block">Let&rsquo;s</span>
                <span className="block pl-[0.08em] my-1">
                  <span className="relative inline-block">
                    <span
                      aria-hidden="true"
                      className="absolute -inset-x-[0.06em] top-[0.1em] -z-10 h-[0.82em] border-[3px] border-ink bg-coral shadow-brutal-sm"
                    />
                    Build
                  </span>
                </span>
                <span className="block">
                  <span className="relative inline-block">
                    <span
                      aria-hidden="true"
                      className="absolute -inset-x-[0.06em] top-[0.1em] -z-10 h-[0.82em] border-[3px] border-ink bg-yellow shadow-brutal-sm"
                    />
                    Something.
                  </span>
                </span>
              </p>

              <p className="mt-8 max-w-sm text-base leading-relaxed sm:text-lg text-ink/85 font-medium border-l-[3px] border-ink pl-4">
                Open to internships, freelance development, research collaborations, and full-stack AI/ML systems.
              </p>
            </div>

            {/* Quick Contact Cards */}
            <div className="flex flex-col gap-3">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between border-[3px] border-ink bg-sky p-4 label-mono text-xs font-bold text-ink shadow-brutal brutal-press"
              >
                <span>GITHUB // @LADNIL03</span>
                <Arrow className="-rotate-45" />
              </a>

              <div className="flex items-center justify-between border-[3px] border-ink bg-paper p-4 label-mono text-xs text-ink/80 shadow-brutal-xs">
                <span>STATUS // AIML STUDENT</span>
                <span className="flex items-center gap-1.5 font-bold">
                  <span className="size-2 animate-blink bg-coral" />
                  ONLINE
                </span>
              </div>
            </div>

            <Cross
              aria-hidden="true"
              className="absolute -top-3 -right-3 hidden text-5xl text-ink/20 lg:block"
            >
              +
            </Cross>
          </div>
        </Reveal>

        {/* ── Form Side (7 cols) ── */}
        <Reveal className="lg:col-span-7">
          <div
            id="contact-form"
            className="relative scroll-mt-28 border-[3px] border-ink bg-paper p-6 shadow-brutal-xl sm:p-9"
          >
            <CornerMarks />

            <div className="mb-7 flex flex-wrap items-center justify-between gap-3 border-b-[3px] border-ink pb-5">
              <div>
                <span className="label-mono text-coral text-xs font-bold">TRANSMISSION CHANNEL</span>
                <h3 className="text-card-title mt-1 text-ink">Send a message</h3>
              </div>
              <div className="flex items-center gap-3">
                <Barcode className="h-4 hidden sm:flex text-ink" />
                <span className="border border-ink bg-yellow px-2 py-0.5 label-mono text-[0.625rem] text-ink font-bold">
                  250 CHAR MAX
                </span>
              </div>
            </div>

            <ContactForm />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

export default ContactSection;