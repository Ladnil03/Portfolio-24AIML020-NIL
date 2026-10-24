import { useState, useEffect } from "react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Arrow } from "@/components/Decor";
import { getAiTaskSuggestions } from "../services/taskService";

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

  // AI Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [aiError, setAiError] = useState(null);

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
      setAiSuggestion(null);
      setAiError(null);
    }
  }, [isOpen, initialData]);

  const handleAiAssist = async () => {
    if (!title.trim()) {
      setClientError("Please enter a task title first so the AI can generate suggestions.");
      return;
    }
    setAiLoading(true);
    setAiError(null);
    setClientError("");
    try {
      const suggestion = await getAiTaskSuggestions(title.trim(), description.trim());
      if (suggestion) {
        setAiSuggestion(suggestion);
      } else {
        setAiError("Could not generate AI suggestions.");
      }
    } catch (err) {
      console.warn("AI suggestion fetch failed:", err);
      setAiError(err.message || "AI assist is momentarily unavailable. You can still create tasks normally.");
    } finally {
      setAiLoading(false);
    }
  };

  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    if (aiSuggestion.suggestedDescription) {
      setDescription(aiSuggestion.suggestedDescription);
    }
    if (aiSuggestion.suggestedPriority) {
      setPriority(aiSuggestion.suggestedPriority);
    }
  };

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
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="task-title-input" className="label-mono block">
                Task title *
              </label>
              <button
                type="button"
                onClick={handleAiAssist}
                disabled={isLoading || aiLoading}
                className="inline-flex items-center gap-1.5 border-[2px] border-ink bg-sky px-2.5 py-1 text-xs font-mono font-bold text-ink shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow transition-colors brutal-press disabled:opacity-50"
                title="Auto-generate description, priority, and deadline"
              >
                <span>✨</span>
                <span>{aiLoading ? "AI Analyzing..." : "AI Auto-Complete"}</span>
              </button>
            </div>
            <input
              id="task-title-input"
              type="text"
              placeholder="e.g. Critical bug fix: database connection dropping"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (clientError) setClientError("");
              }}
              disabled={isLoading}
              className={FIELD}
            />
          </div>

          {/* Meaningful AI-generated Suggestion Display (Not raw JSON) */}
          {aiSuggestion && (
            <div className="border-[3px] border-ink bg-muted/30 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <span className="label-mono text-xs font-bold uppercase tracking-wider text-ink">
                    AI Task Insights ({aiSuggestion.source})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={applyAiSuggestion}
                  className="border-[2px] border-ink bg-lime-400 px-2.5 py-1 text-xs font-mono font-bold text-ink hover:bg-lime-300 brutal-press shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Apply AI Suggestions
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="border-2 border-ink bg-paper p-2">
                  <span className="text-ink/60 block text-[10px] uppercase">Recommended Priority</span>
                  <span className={cn(
                    "font-bold uppercase px-1.5 py-0.5 inline-block mt-1 border border-ink text-[11px]",
                    aiSuggestion.suggestedPriority === "high" && "bg-coral text-white",
                    aiSuggestion.suggestedPriority === "medium" && "bg-yellow text-ink",
                    aiSuggestion.suggestedPriority === "low" && "bg-sky text-ink"
                  )}>
                    {aiSuggestion.suggestedPriority}
                  </span>
                </div>
                <div className="border-2 border-ink bg-paper p-2">
                  <span className="text-ink/60 block text-[10px] uppercase">Proposed Due Date</span>
                  <span className="font-bold text-ink text-xs block mt-1">
                    📅 {aiSuggestion.suggestedDueDate} ({aiSuggestion.estimatedDays} days)
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono bg-paper border-2 border-ink p-2.5">
                <span className="text-ink/60 block text-[10px] uppercase mb-1">Generated Description</span>
                <p className="text-ink text-[12px] leading-relaxed">{aiSuggestion.suggestedDescription}</p>
              </div>

              {aiSuggestion.checklist && aiSuggestion.checklist.length > 0 && (
                <div className="text-xs font-mono bg-paper border-2 border-ink p-2.5">
                  <span className="text-ink/60 block text-[10px] uppercase mb-1.5">Proposed Action Steps</span>
                  <ul className="list-disc pl-4 space-y-1 text-ink/90 text-[11px]">
                    {aiSuggestion.checklist.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSuggestion.reasoning && (
                <p className="text-[11px] font-mono italic text-ink/70">
                  💡 Reasoning: {aiSuggestion.reasoning}
                </p>
              )}
            </div>
          )}

          {aiError && (
            <div className="border-2 border-ink bg-yellow/40 p-2.5 text-xs font-mono text-ink">
              ⚠️ {aiError}
            </div>
          )}

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