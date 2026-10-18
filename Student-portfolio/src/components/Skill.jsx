import { useState } from "react";
import { Section, Reveal, Cross, Barcode, CornerMarks } from "@/components/Decor";
import { skillGroups } from "@/data/profile";
import { cn } from "cn";

// Rich metadata for Nil's exact real technologies
const SKILL_DETAILS = {
  "Machine Learning": {
    category: "AI / ML",
    tone: "coral",
    note: "Model Training & Feature Pipelines",
    level: "Core",
  },
  Python: {
    category: "AI / ML & Lang",
    tone: "yellow",
    note: "RAG Systems, ML & Automation Scripts",
    level: "Primary",
  },
  React: {
    category: "Frontend",
    tone: "sky",
    note: "React 19, Component Architecture & Hooks",
    level: "Primary",
  },
  JavaScript: {
    category: "Frontend & Fullstack",
    tone: "yellow",
    note: "ESNext, DOM APIs & Node.js Runtimes",
    level: "Core",
  },
  HTML: {
    category: "Frontend",
    tone: "paper",
    note: "Semantic Structure & Accessibility (A11y)",
    level: "Foundation",
  },
  CSS: {
    category: "Frontend",
    tone: "sky",
    note: "Neo-Brutalist Layouts, Responsive Grids",
    level: "Core",
  },
  "C++": {
    category: "Languages",
    tone: "coral",
    note: "Data Structures & Competitive Programming",
    level: "Core",
  },
  Git: {
    category: "Tools & DevOps",
    tone: "paper",
    note: "Version Control, GitHub & CI/CD",
    level: "Essential",
  },
};

const ALL_SKILLS = [
  "Machine Learning",
  "Python",
  "React",
  "JavaScript",
  "C++",
  "HTML",
  "CSS",
  "Git",
];

const TONE_CLASSES = {
  paper: "bg-paper text-ink",
  coral: "bg-coral text-ink",
  sky: "bg-sky text-ink",
  yellow: "bg-yellow text-ink",
};

function Skill() {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "All Skills (08)" },
    ...skillGroups.map((g) => ({
      id: g.id,
      label: `${g.label} (${g.skills.length})`,
    })),
  ];

  const visibleSkills =
    activeTab === "all"
      ? ALL_SKILLS
      : skillGroups.find((g) => g.id === activeTab)?.skills || ALL_SKILLS;

  return (
    <Section
      id="skills"
      index="02"
      label="Skills"
      title="The Technical Toolkit"
      aside="Eight verified technologies from the existing portfolio. Styled as physical brutalist modules."
    >
      {/* Category Filter Buttons */}
      <div className="mb-8 flex flex-wrap gap-2 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTab(cat.id)}
            className={cn(
              "border-[3px] border-ink px-4 py-2.5 label-mono transition-all brutal-press shadow-brutal-xs text-xs font-bold",
              activeTab === cat.id
                ? "bg-ink text-paper"
                : "bg-paper text-ink hover:bg-yellow"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Brutalist Skill Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleSkills.map((skill, i) => {
          const detail = SKILL_DETAILS[skill] || {
            category: "Tech",
            tone: "paper",
            note: "Standard Stack",
            level: "Core",
          };
          const toneClass = TONE_CLASSES[detail.tone] || TONE_CLASSES.paper;

          return (
            <Reveal key={`${activeTab}-${skill}-${i}`} className="h-full">
              <article
                className={cn(
                  "group relative flex h-full flex-col justify-between border-[3px] border-ink p-6 shadow-brutal brutal-press sm:p-7 select-none",
                  toneClass
                )}
              >
                <CornerMarks />

                {/* Card Top Rail */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="border-2 border-ink bg-ink px-2 py-0.5 label-mono text-[0.625rem] text-paper">
                      #{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="border border-ink bg-paper/90 px-2 py-0.5 label-mono text-[0.6rem] text-ink font-bold">
                      {detail.category}
                    </span>
                  </div>

                  <Cross
                    aria-hidden="true"
                    className="text-2xl opacity-40 transition-transform duration-300 group-hover:rotate-90 group-hover:opacity-100"
                  >
                    +
                  </Cross>
                </div>

                {/* Main Skill Display Typography */}
                <div className="my-6">
                  <h3 className="font-display text-3xl leading-none tracking-tight uppercase sm:text-4xl">
                    {skill}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed opacity-85 font-sans font-medium">
                    {detail.note}
                  </p>
                </div>

                {/* Bottom Spec Footer */}
                <div className="flex items-center justify-between border-t-2 border-ink pt-3">
                  <span className="label-mono text-[0.625rem] opacity-60">
                    PROFICIENCY // {detail.level.toUpperCase()}
                  </span>
                  <span className="font-mono text-xs font-bold">● ACTIVE</span>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {/* Supporting Architecture Spec Banner */}
      <Reveal className="mt-8 border-[3px] border-ink bg-paper p-5 shadow-brutal flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center border-2 border-ink bg-yellow font-display text-sm">
            ⚡
          </span>
          <div>
            <p className="label-mono font-bold text-ink">SYSTEM ARCHITECTURE READY</p>
            <p className="text-xs text-ink/70">
              Also experienced in Node.js, Express, MongoDB REST APIs with HATEOAS controls.
            </p>
          </div>
        </div>
        <Barcode className="h-5 text-ink shrink-0 hidden md:flex" />
      </Reveal>
    </Section>
  );
}

export default Skill;