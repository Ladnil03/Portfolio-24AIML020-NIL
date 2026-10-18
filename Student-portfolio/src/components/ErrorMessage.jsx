import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/Decor";

function ErrorMessage({
  title = "Failed to Load Tasks",
  message,
  onRetry,
}) {
  return (
    <div
      role="alert"
      className="mx-auto my-10 flex max-w-xl flex-col items-center gap-5 border-[3px] border-ink bg-coral p-8 text-center shadow-brutal-lg sm:p-10"
    >
      <span
        aria-hidden="true"
        className="font-display text-5xl leading-none text-ink"
      >
        !
      </span>
      <h2 className="text-card-title">{title}</h2>
      <p className="leading-relaxed text-ink/85">
        {message ||
          "An unexpected error occurred while communicating with the MongoDB API."}
      </p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="mt-1">
          Try Again <Arrow />
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;