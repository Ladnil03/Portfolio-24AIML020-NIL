import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Arrow, Cross, Sticker, CornerMarks, HazardBar } from "@/components/Decor";

function NotFound() {
  return (
    <section className="relative overflow-hidden border-b-[3px] border-ink bg-paper">
      <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0 opacity-70" />
      <HazardBar tone="coral" />

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-start gap-8 px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="flex items-center gap-3">
          <span className="border-[3px] border-ink bg-ink px-3 py-1.5 label-mono text-paper font-bold shadow-brutal-xs">
            HTTP_STATUS_404
          </span>
          <Sticker tone="yellow" rotate="-2deg" className="text-xs">
            PAGE NOT FOUND
          </Sticker>
        </div>

        <div className="relative border-[3px] border-ink bg-yellow p-6 sm:p-10 shadow-brutal-xl">
          <CornerMarks />
          <p className="font-display text-[clamp(5rem,20vw,14rem)] leading-[0.8] tracking-[-0.05em] text-ink select-none">
            404
          </p>
        </div>

        <h1 className="text-section max-w-3xl text-ink">Route Not Found</h1>

        <p className="max-w-xl text-lg leading-relaxed text-ink/85 font-medium border-l-[3px] border-coral pl-4">
          The requested URL path does not exist on this portfolio server. Please return to the homepage or explore public repositories.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="shadow-brutal brutal-press">
            <Link to="/">
              Return Home <Arrow />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="shadow-brutal-xs">
            <Link to="/projects">
              Explore Projects ↗
            </Link>
          </Button>
        </div>

        <Cross
          aria-hidden="true"
          className="absolute top-20 right-[10%] hidden text-6xl text-coral/40 lg:block select-none"
        >
          +
        </Cross>
      </div>
    </section>
  );
}

export default NotFound;