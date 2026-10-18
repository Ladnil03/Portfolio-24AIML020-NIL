import { cn } from "cn";
import { Arrow, Cross, CornerMarks, Barcode } from "@/components/Decor";
import { humanize, formatMonth } from "@/data/profile";

const TONES = {
  paper: {
    card: "bg-paper text-ink",
    meta: "text-ink/65",
    chip: "border-2 border-ink bg-paper text-ink",
    index: "text-ink/25",
    btn: "bg-coral text-ink hover:bg-yellow",
  },
  coral: {
    card: "bg-coral text-ink",
    meta: "text-ink/75",
    chip: "border-2 border-ink bg-paper text-ink",
    index: "text-ink/30",
    btn: "bg-yellow text-ink hover:bg-paper",
  },
  sky: {
    card: "bg-sky text-ink",
    meta: "text-ink/75",
    chip: "border-2 border-ink bg-paper text-ink",
    index: "text-ink/30",
    btn: "bg-coral text-ink hover:bg-yellow",
  },
  yellow: {
    card: "bg-yellow text-ink",
    meta: "text-ink/75",
    chip: "border-2 border-ink bg-paper text-ink",
    index: "text-ink/30",
    btn: "bg-coral text-ink hover:bg-paper",
  },
  ink: {
    card: "bg-ink text-paper",
    meta: "text-paper/70",
    chip: "border-2 border-paper bg-ink text-paper",
    index: "text-coral",
    btn: "bg-coral text-ink hover:bg-yellow",
  },
};

const SHAPES = {
  feature: "p-7 sm:p-10",
  tall: "p-6 sm:p-8",
  offset: "p-6 sm:p-8 lg:-translate-y-6",
  wide: "p-6 sm:p-9",
};

export default function ProjectCard({
  project,
  index,
  shape = "tall",
  tone = "paper",
  className,
}) {
  const t = TONES[tone] ?? TONES.paper;
  const num = String(index).padStart(2, "0");
  const title = humanize(project.repo);

  return (
    <article
      className={cn(
        "group relative flex flex-col border-[3px] border-ink shadow-brutal brutal-press transition-all",
        t.card,
        SHAPES[shape] ?? SHAPES.tall,
        className
      )}
    >
      <CornerMarks />

      {/* Top Header Rail: Index Number, Status Badge, Cross */}
      <div className="flex items-start justify-between gap-3 border-b-2 border-current pb-4">
        <div className="flex items-center gap-3">
          <span className={cn("font-display text-3xl leading-none sm:text-4xl", t.index)}>
            PROJECT // {num}
          </span>
          {shape === "feature" && (
            <span className="border-2 border-ink bg-yellow px-2 py-0.5 label-mono text-[0.625rem] text-ink font-bold shadow-brutal-xs">
              ★ FEATURED WORK
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {shape === "feature" && <Barcode className="h-4 hidden sm:flex" />}
          <Cross
            aria-hidden="true"
            className="text-2xl opacity-40 transition-transform duration-300 group-hover:rotate-90 group-hover:opacity-100"
          >
            +
          </Cross>
        </div>
      </div>

      {/* Project Title */}
      <div className="mt-5">
        <h3
          className={cn(
            "font-display leading-[0.95] tracking-tight uppercase",
            shape === "feature"
              ? "text-3xl sm:text-5xl lg:text-6xl"
              : shape === "wide"
                ? "text-2xl sm:text-4xl"
                : "text-2xl sm:text-3xl"
          )}
        >
          {title}
        </h3>

        {/* Technical Slug */}
        <p className={cn("label-mono mt-2 text-xs", t.meta)}>
          REPO: {project.repo}
        </p>
      </div>

      {/* Description / Summary */}
      {project.description ? (
        <p className="mt-4 max-w-prose text-sm leading-relaxed sm:text-base opacity-90 font-medium">
          {project.description}
        </p>
      ) : (
        <p className={cn("label-mono mt-4 text-xs", t.meta)}>
          {project.language ? `PRIMARY: ${project.language}` : "MULTILINGUAL"}
          <span aria-hidden="true"> · </span>
          {project.fork ? "FORKED SOURCE" : `LAST COMMIT: ${formatMonth(project.updated)}`}
        </p>
      )}

      {/* Tech Chips + External Action Link */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 border-t-2 border-current/30">
        <div className="flex flex-wrap items-center gap-2">
          {(project.tags ?? []).map((tag) => (
            <span
              key={tag}
              className={cn("px-2.5 py-1 label-mono text-[0.65rem] font-bold shadow-brutal-xs", t.chip)}
            >
              {tag}
            </span>
          ))}
        </div>

        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 border-[2px] border-ink px-4 py-2 label-mono text-xs font-bold shadow-brutal-xs brutal-press",
            t.btn
          )}
        >
          View Project <Arrow />
          <span className="sr-only">— {title} on GitHub (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}