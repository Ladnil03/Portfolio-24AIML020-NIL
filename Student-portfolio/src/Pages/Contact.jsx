import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";
import { Button } from "../components/ui/button";
import { Arrow, CornerMarks, Sticker } from "../components/Decor";
import { profile } from "../data/profile";

function Contact() {
  return (
    <>
      <PageHeader
        index="07"
        label="Contact"
        title="Let's Talk &amp; Build"
        lede="Questions, internships, freelance work, or collaboration on machine learning and full-stack systems — all welcome."
      />

      <section className="bg-paper">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-16">
          <div className="relative border-[3px] border-ink bg-paper p-6 shadow-brutal-xl sm:p-9 lg:col-span-7">
            <CornerMarks />
            <div className="mb-6 flex items-center justify-between border-b-2 border-ink pb-4">
              <h2 className="text-card-title text-ink">Send a message</h2>
              <Sticker tone="yellow" rotate="-2deg" className="text-[0.625rem]">
                DIRECT BUFFER
              </Sticker>
            </div>
            <ContactForm />
          </div>

          <aside className="flex flex-col gap-6 lg:col-span-5">
            <div className="group relative border-[3px] border-ink bg-coral p-7 shadow-brutal brutal-press transition-all">
              <CornerMarks />
              <p className="label-mono font-bold text-xs text-ink">PRIMARY ROUTE</p>
              <h2 className="text-card-title mt-2 text-ink">GitHub Direct</h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-ink/90 font-medium">
                Issues, pull requests or direct repository interactions — fastest response time.
              </p>
              <Button asChild variant="outline" className="mt-6 shadow-brutal-xs">
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  github.com/{profile.handle} <Arrow />
                </a>
              </Button>
            </div>

            <div className="group relative border-[3px] border-ink bg-sky p-7 shadow-brutal brutal-press transition-all">
              <CornerMarks />
              <p className="label-mono font-bold text-xs text-ink">LOOKING FOR</p>
              <h3 className="font-display text-2xl uppercase mt-2 text-ink">Opportunities</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {[
                  "AI / ML Internships",
                  "Full-Stack Web Builds",
                  "Open Source Contributions",
                  "Competitive Coding Collaboration",
                ].map((item) => (
                  <li key={item} className="label-mono flex items-center gap-2.5 text-xs font-bold text-ink">
                    <span aria-hidden="true" className="font-display text-base text-coral">
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-[3px] border-ink bg-yellow p-6 shadow-brutal">
              <p className="label-mono text-xs font-bold text-ink">LOCATION</p>
              <p className="font-display text-xl uppercase mt-1 text-ink">Gujarat, India</p>
              <p className="label-mono text-[0.625rem] text-ink/75 mt-1">
                COURSEWORK CODE: 24AIML020 &bull; OPEN TO REMOTE / HYBRID
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

export default Contact;