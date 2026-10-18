import { cn } from "cn";
import { useReveal } from "@/hooks/useReveal";

/** The recurring hairline rule + cross mark used to stitch sections together. */
export function Cross({ className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none font-display leading-none",
        className
      )}
    >
      +
    </span>
  );
}

export function Arrow({ className }) {
  return (
    <span aria-hidden="true" className={cn("inline-block", className)}>
      →
    </span>
  );
}

/** Small mono metadata chip, e.g. "LANG / PYTHON". */
export function Meta({ children, className }) {
  return (
    <span className={cn("label-mono text-ink/70", className)}>{children}</span>
  );
}

/** Playful tilted brutalist stamp / sticker badge */
export function Sticker({
  children,
  tone = "yellow",
  rotate = "-2deg",
  className,
}) {
  const tones = {
    yellow: "bg-yellow text-ink",
    coral: "bg-coral text-ink",
    sky: "bg-sky text-ink",
    paper: "bg-paper text-ink",
    ink: "bg-ink text-paper",
  };
  return (
    <span
      className={cn(
        "inline-flex select-none items-center gap-1.5 border-[3px] border-ink px-3 py-1 label-mono shadow-brutal-xs font-bold uppercase transition-transform hover:scale-105",
        tones[tone] || tones.yellow,
        className
      )}
      style={{ transform: `rotate(${rotate})` }}
    >
      {children}
    </span>
  );
}

/** Industrial technical barcode visual */
export function Barcode({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-6 items-stretch gap-[2px] opacity-75 select-none", className)}
    >
      {[2, 1, 3, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3].map((w, i) => (
        <span
          key={i}
          className="bg-current"
          style={{ width: `${w * 1.5}px` }}
        />
      ))}
    </div>
  );
}

/** Corner registration brackets for industrial / blueprint look */
export function CornerMarks({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-2 select-none", className)}
    >
      <span className="absolute top-0 left-0 font-mono text-xs leading-none text-ink/35">┌</span>
      <span className="absolute top-0 right-0 font-mono text-xs leading-none text-ink/35">┐</span>
      <span className="absolute bottom-0 left-0 font-mono text-xs leading-none text-ink/35">└</span>
      <span className="absolute bottom-0 right-0 font-mono text-xs leading-none text-ink/35">┘</span>
    </div>
  );
}

/** Caution / hazard striped bar */
export function HazardBar({ tone = "yellow", className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-3 w-full border-y-2 border-ink",
        tone === "coral" ? "pattern-stripes-coral" : "pattern-stripes",
        className
      )}
    />
  );
}

const TONES = {
  paper: "bg-paper text-ink",
  coral: "bg-coral text-ink",
  sky: "bg-sky text-ink",
  yellow: "bg-yellow text-ink",
  ink: "bg-ink text-paper",
};

/**
 * Section shell. Every band on the page is separated by a 3px ink rule so the
 * layout reads like a printed sheet rather than a stack of floating boxes.
 */
export function Section({
  id,
  index,
  label,
  title,
  aside,
  tone = "paper",
  grid = true,
  children,
  className,
}) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={cn(
        "relative scroll-mt-24 border-t-[3px] border-ink",
        TONES[tone],
        className
      )}
    >
      {grid && (
        <div
          aria-hidden="true"
          className="grid-paper pointer-events-none absolute inset-0 opacity-60"
        />
      )}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-16 sm:px-8 md:py-24 lg:px-12">
        <header className="mb-10 flex flex-col gap-6 md:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="label-mono flex items-center gap-2">
              <span className="border-2 border-ink bg-ink px-2 py-1 text-paper">
                {index}
              </span>
              <span className="text-ink/60">/ {label}</span>
            </p>
            <h2 id={id ? `${id}-title` : undefined} className="text-section mt-5">
              {title}
            </h2>
          </div>
          {aside && (
            <p className="label-mono max-w-xs text-ink/60 lg:text-right">
              {aside}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

/** Wrapper that fades + lifts a block into place on first scroll. */
export function Reveal({ as: Tag = "div", className, children, ...props }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={cn("reveal", className)} {...props}>
      {children}
    </Tag>
  );
}