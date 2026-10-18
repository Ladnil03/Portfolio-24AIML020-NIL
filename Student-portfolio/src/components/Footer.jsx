import { Barcode, HazardBar } from "@/components/Decor";
import { profile } from "@/data/profile";
import { Link } from "react-router-dom";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t-[3px] border-ink bg-paper">
      <HazardBar tone="yellow" />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
          {/* Brand & Wordmark (5 cols) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center border-[3px] border-ink bg-coral font-display text-lg text-ink shadow-brutal-xs">
                NL
              </span>
              <div>
                <p className="font-display text-2xl leading-none uppercase tracking-tight sm:text-3xl">
                  Nil Lad
                </p>
                <p className="label-mono mt-1 text-xs text-ink/65">{profile.role}</p>
              </div>
            </div>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/80 font-medium">
              Artificial Intelligence &amp; Machine Learning developer building robust web applications and intelligent data pipelines.
            </p>

            <div className="mt-5 flex items-center gap-2">
              <span className="border-2 border-ink bg-yellow px-2.5 py-1 label-mono text-xs text-ink font-bold shadow-brutal-xs">
                ROLL // 24AIML020
              </span>
              <span className="border-2 border-ink bg-sky px-2.5 py-1 label-mono text-xs text-ink font-bold shadow-brutal-xs">
                GITHUB // @Ladnil03
              </span>
            </div>
          </div>

          {/* Site Navigation Links (4 cols) */}
          <div className="md:col-span-4">
            <p className="label-mono text-xs text-ink/50 mb-3 font-bold">DIRECTORY INDEX</p>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              <Link to="/" className="brutal-link label-mono text-xs font-bold text-ink py-1">
                Home →
              </Link>
              <Link to="/projects" className="brutal-link label-mono text-xs font-bold text-ink py-1">
                Projects →
              </Link>
              <Link to="/tasks" className="brutal-link label-mono text-xs font-bold text-ink py-1">
                Tasks App →
              </Link>
              <Link to="/contact" className="brutal-link label-mono text-xs font-bold text-ink py-1">
                Contact →
              </Link>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-link label-mono text-xs font-bold text-ink py-1"
              >
                GitHub Profile ↗
              </a>
              <a
                href="https://github.com/Ladnil03?tab=repositories"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-link label-mono text-xs font-bold text-ink py-1"
              >
                All Repos ↗
              </a>
            </nav>
          </div>

          {/* Action & Colophon (3 cols) */}
          <div className="flex flex-col items-start md:items-end justify-between gap-6 md:col-span-3">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 border-[3px] border-ink bg-paper px-4 py-3 label-mono text-xs font-bold text-ink shadow-brutal brutal-press"
            >
              Back to Top ↑
            </button>

            <div className="flex flex-col items-start md:items-end gap-1">
              <Barcode className="h-4 text-ink opacity-70" />
              <p className="label-mono text-[0.625rem] text-ink/60 mt-1">
                SYSTEM // ONLINE &bull; REACT 19 &bull; VITE
              </p>
              <p className="label-mono text-[0.625rem] text-ink/50">
                &copy; 2026 NIL LAD &bull; 24AIML020
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;