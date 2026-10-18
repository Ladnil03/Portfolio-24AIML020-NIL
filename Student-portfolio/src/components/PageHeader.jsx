import { cn } from "cn";
import { HazardBar } from "@/components/Decor";

export default function PageHeader({ index, label, title, lede, tone = "paper", children }) {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b-[3px] border-ink",
        tone === "ink" ? "bg-ink text-paper" : "bg-paper text-ink"
      )}
    >
      {tone !== "ink" && (
        <div aria-hidden="true" className="grid-paper pointer-events-none absolute inset-0 opacity-70" />
      )}
      <div className="relative mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-8 md:py-16 lg:px-12">
        {index && (
          <p className="label-mono flex items-center gap-2">
            <span
              className={cn(
                "border-2 px-2.5 py-1 font-bold shadow-brutal-xs text-xs",
                tone === "ink"
                  ? "border-paper bg-paper text-ink"
                  : "border-ink bg-ink text-paper"
              )}
            >
              {index}
            </span>
            <span className={tone === "ink" ? "text-paper/70 font-bold" : "text-ink/70 font-bold"}>
              / {label}
            </span>
          </p>
        )}
        <h1 className="text-section mt-4 tracking-tight uppercase">{title}</h1>
        {lede && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-base sm:text-lg leading-relaxed font-medium border-l-[3px] border-coral pl-4",
              tone === "ink" ? "text-paper/85" : "text-ink/85"
            )}
          >
            {lede}
          </p>
        )}
        {children}
      </div>
      <HazardBar tone="yellow" />
    </header>
  );
}