import { Link } from "react-router-dom";
import { Section, Reveal, Arrow, Barcode } from "@/components/Decor";
import { Button } from "@/components/ui/button";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/profile";

/**
 * The editorial grid. Six real repositories, six deliberately different card
 * shapes — nothing is uniform, and the featured project gets the full width.
 */
const GRID = [
  { id: "vidsnap", span: "lg:col-span-12", shape: "feature", tone: "coral" },
  { id: "student-backend", span: "lg:col-span-7", shape: "tall", tone: "sky" },
  { id: "rag", span: "lg:col-span-5", shape: "tall", tone: "paper" },
  { id: "horsemen", span: "lg:col-span-12", shape: "wide", tone: "ink" },
  { id: "insider", span: "lg:col-span-5", shape: "offset", tone: "yellow" },
  { id: "nagarseva", span: "lg:col-span-7", shape: "tall", tone: "paper" },
];

function Projects() {
  const byId = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <Section
      id="projects"
      index="03"
      label="Projects"
      title="Selected Engineering Work"
      aside="Authentic repositories from github.com/Ladnil03 with verified source code links."
      tone="paper"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        {GRID.map((slot, i) => {
          const project = byId[slot.id];
          if (!project) return null;
          return (
            <Reveal key={slot.id} className={slot.span}>
              <ProjectCard
                project={project}
                index={i + 1}
                shape={slot.shape}
                tone={slot.tone}
                className="h-full"
              />
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-10 flex flex-col items-start gap-4 border-[3px] border-ink bg-paper p-6 shadow-brutal sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center border-2 border-ink bg-coral font-display text-sm text-ink shadow-brutal-xs">
            18
          </span>
          <div>
            <p className="label-mono font-bold text-ink">18 PUBLIC REPOSITORIES PUBLISHED</p>
            <p className="text-xs text-ink/70">
              Browse the complete repository index, filter by language, tag, or topic.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Barcode className="h-5 text-ink shrink-0 hidden md:flex" />
          <Button asChild variant="accent" className="shadow-brutal-sm">
            <Link to="/projects">
              Explore All 18 Repositories <Arrow />
            </Link>
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}

export default Projects;