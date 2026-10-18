import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProjectCard from "../components/ProjectCard";
import { Reveal, Barcode } from "../components/Decor";
import { Button } from "../components/ui/button";
import { projects, profile } from "../data/profile";
import { cn } from "cn";

const FILTER_TAGS = ["All", "Python", "AI", "React", "TypeScript", "JavaScript", "Security"];

export default function Projects() {
  const [query, setQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        p.repo.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));

      const matchesTag =
        selectedTag === "All" ||
        (p.tags ?? []).some((t) => t.toLowerCase() === selectedTag.toLowerCase()) ||
        (p.language ?? "").toLowerCase() === selectedTag.toLowerCase();

      return matchesQuery && matchesTag;
    });
  }, [query, selectedTag]);

  return (
    <>
      <PageHeader
        index="03"
        label="Repository Index"
        title="All Projects"
        lede={`Complete directory of all 18 public codebases on github.com/${profile.handle}. Search by keyword or filter by tech tag.`}
      />

      {/* Search & Tag Filter Bar */}
      <section className="border-b-[3px] border-ink bg-paper">
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12">
          {/* Top row: Search input + repo counter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-3">
              <label htmlFor="repo-search" className="label-mono shrink-0 text-xs font-bold text-ink">
                SEARCH:
              </label>
              <input
                id="repo-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search repo name, description, or stack…"
                className="w-full border-[3px] border-ink bg-paper px-4 py-2.5 text-base placeholder:text-ink/40 shadow-brutal-xs focus:bg-yellow/10 focus-visible:outline-none sm:max-w-md"
              />
              {query && (
                <Button variant="outline" size="sm" onClick={() => setQuery("")} className="shadow-brutal-xs">
                  Clear
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="border-2 border-ink bg-yellow px-3 py-1 label-mono text-xs font-bold text-ink shadow-brutal-xs">
                {filtered.length} / {projects.length} REPOS
              </span>
              <Barcode className="h-4 text-ink hidden lg:flex" />
            </div>
          </div>

          {/* Bottom row: Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-mono text-xs text-ink/60 mr-1">FILTER:</span>
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "border-2 border-ink px-3 py-1 label-mono text-xs font-bold transition-all shadow-brutal-xs brutal-press",
                  selectedTag === tag
                    ? "bg-ink text-paper"
                    : "bg-paper text-ink hover:bg-yellow"
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid of Projects */}
      <section className="bg-paper">
        <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
          {filtered.length === 0 ? (
            <div className="border-[3px] border-dashed border-ink bg-paper p-12 text-center shadow-brutal">
              <p className="font-display text-2xl uppercase">No repositories found</p>
              <p className="mt-2 text-sm text-ink/70">
                No matching codebases for query &ldquo;{query}&rdquo; with tag &ldquo;{selectedTag}&rdquo;.
              </p>
              <Button
                variant="accent"
                className="mt-5"
                onClick={() => {
                  setQuery("");
                  setSelectedTag("All");
                }}
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project, i) => (
                <Reveal key={project.id} className="h-full">
                  <ProjectCard
                    project={project}
                    index={i + 1}
                    tone={["coral", "sky", "yellow", "paper"][i % 4]}
                    className="h-full"
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
