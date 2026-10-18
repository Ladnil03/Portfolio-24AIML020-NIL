import { useState, useEffect } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/Decor";

const FIELD =
  "w-full border-[3px] border-ink bg-paper px-4 py-3 text-[0.95rem] text-ink placeholder:text-ink/35 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-coral";

const PRIORITIES = [
  { id: "low", label: "Low", fill: "bg-sky" },
  { id: "medium", label: "Medium", fill: "bg-yellow" },
  { id: "high", label: "High", fill: "bg-coral" },
];

function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
  error = null,
}) {
  const isEditing = Boolean(initialData && (initialData._id || initialData.id));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [completed, setCompleted] = useState(false);
  const [clientError, setClientError] = useState("");

  // Seed the form from props whenever the modal opens. Editing the same task twice
  // must reset fields, so remount-on-key is not enough here.
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || "");
        setDescription(initialData.description || "");
        setPriority(initialData.priority || "medium");
        setCompleted(Boolean(initialData.completed));
      } else {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setCompleted(false);
      }
      setClientError("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setClientError("Task title is required");
      return;
    }
    setClientError("");

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      priority,
      completed,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-ink/70 p-4 py-10 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div className="animate-rise w-full max-w-lg border-[3px] border-ink bg-paper p-6 text-left shadow-brutal-xl sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4 border-b-[3px] border-ink pb-5">
          <h2 id="task-modal-title" className="text-card-title">
            {isEditing ? "Edit task" : "New task"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
            className="grid size-9 shrink-0 place-items-center border-[3px] border-ink bg-coral font-display text-sm brutal-press"
          >
            ×
          </button>
        </div>

        {(clientError || error) && (
          <div
            role="alert"
            className="mb-5 border-[3px] border-ink bg-coral px-4 py-3"
          >
            <span className="label-mono">{clientError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="task-title-input" className="label-mono mb-2 block">
              Task title *
            </label>
            <input
              id="task-title-input"
              type="text"
              placeholder="e.g. Complete Practical 5 MongoDB Integration"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (clientError) setClientError("");
              }}
              disabled={isLoading}
              className={FIELD}
            />
          </div>

          <div>
            <label htmlFor="task-desc-input" className="label-mono mb-2 block">
              Description (optional)
            </label>
            <textarea
              id="task-desc-input"
              rows={3}
              placeholder="Details or notes about the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              className={cn(FIELD, "resize-y")}
            />
          </div>

          <fieldset>
            <legend className="label-mono mb-2">Priority level</legend>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => {
                const isSelected = priority === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    disabled={isLoading}
                    aria-pressed={isSelected}
                    onClick={() => setPriority(p.id)}
                    className={cn(
                      "flex-1 border-[3px] border-ink px-3 py-3 label-mono brutal-press",
                      isSelected ? p.fill : "bg-paper",
                      isSelected && "translate-x-[2px] translate-y-[2px] shadow-none"
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label
            htmlFor="task-completed-check"
            className="flex cursor-pointer items-center gap-3 border-[3px] border-ink bg-muted px-4 py-3"
          >
            <input
              id="task-completed-check"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={isLoading}
              className="size-5 accent-coral"
            />
            <span className="label-mono">Mark as completed</span>
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditing
                  ? "Saving Changes..."
                  : "Creating Task..."
                : isEditing
                  ? "Save Changes"
                  : "Create Task"}
              {!isLoading && <Arrow />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;