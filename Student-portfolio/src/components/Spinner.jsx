import { cn } from "cn";

/** Square brutalist spinner — reads as part of the system, not a stock loader. */
function Spinner({ message = "Loading tasks from MongoDB...", size = "default" }) {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <span className="inline-flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-4 animate-spin border-2 border-ink border-t-coral"
        />
        {message && <span className="label-mono text-ink/70">{message}</span>}
      </span>
    );
  }

  return (
    <div
      role="status"
      className="flex min-h-[260px] flex-col items-center justify-center gap-5 p-10"
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-14 animate-spin border-[3px] border-ink",
          "border-t-coral border-r-coral"
        )}
      />
      <p className="label-mono text-ink/70">{message}</p>
    </div>
  );
}

export default Spinner;