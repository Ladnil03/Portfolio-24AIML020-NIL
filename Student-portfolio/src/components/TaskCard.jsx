import React from "react";
import { cn } from "cn";

// Priority is encoded with palette fills instead of four unrelated hues.
const PRIORITY = {
  high: { fill: "bg-coral", label: "High" },
  medium: { fill: "bg-yellow", label: "Medium" },
  low: { fill: "bg-sky", label: "Low" },
};

// Memoized TaskCard prevents re-rendering all cards when one task is updated or when search/filter text changes without changing this card's props
const TaskCard = React.memo(function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) {
  const isCompleted = Boolean(task.completed);
  const isOptimistic = Boolean(task.isOptimistic);
  const priority = (task.priority || "medium").toLowerCase();
  const currentPriority = PRIORITY[priority] ?? PRIORITY.medium;
  const busy = isUpdating || isDeleting || isOptimistic;

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article
      className={cn(
        "flex h-full flex-col border-[3px] border-ink bg-paper p-5 text-left shadow-brutal brutal-press",
        isOptimistic && "border-dashed opacity-80",
        isDeleting && "opacity-45"
      )}
    >
      {/* Priority + status rail */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            "border-2 border-ink px-2.5 py-1 label-mono",
            currentPriority.fill
          )}
        >
          {currentPriority.label}
        </span>

        <span
          className={cn(
            "border-2 border-ink px-2.5 py-1 label-mono",
            isCompleted ? "bg-ink text-paper" : "bg-paper text-ink"
          )}
        >
          {isCompleted ? "✓ Completed" : "Pending"}
        </span>

        {isOptimistic && (
          <span className="border-2 border-ink bg-sky px-2.5 py-1 label-mono">
            Syncing…
          </span>
        )}
      </div>

      {/* Title + checkbox */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          aria-label={`Mark task "${task.title}" as ${isCompleted ? "pending" : "completed"}`}
          disabled={busy}
          onClick={() => onToggleStatus(task)}
          className={cn(
            "mt-1 grid size-7 shrink-0 place-items-center border-[3px] border-ink brutal-press",
            isCompleted ? "bg-ink text-paper" : "bg-paper text-ink"
          )}
        >
          {isUpdating ? (
            <span
              aria-hidden="true"
              className="size-3.5 animate-spin border-2 border-ink border-t-coral"
            />
          ) : isCompleted ? (
            <span aria-hidden="true" className="text-xs leading-none">
              ✓
            </span>
          ) : null}
        </button>

        <h3
          className={cn(
            "font-display text-lg leading-tight tracking-tight break-words uppercase",
            isCompleted && "line-through opacity-60"
          )}
        >
          {task.title}
        </h3>
      </div>

      <p
        className={cn(
          "mt-3 text-sm leading-relaxed break-words text-ink/75",
          !task.description && "italic text-ink/45"
        )}
      >
        {task.description || "No description provided."}
      </p>

      {/* Footer */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t-[3px] border-ink pt-4">
        <span className="label-mono text-ink/50">
          {formattedDate ? formattedDate : ""}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(task)}
            disabled={busy}
            aria-label={`Edit task ${task.title}`}
            className="border-2 border-ink bg-yellow px-3 py-1.5 label-mono brutal-press"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={busy}
            aria-label={`Delete task ${task.title}`}
            className="border-2 border-ink bg-coral px-3 py-1.5 label-mono brutal-press"
          >
            {isDeleting ? "…" : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
});

export default TaskCard;