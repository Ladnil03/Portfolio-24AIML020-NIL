import { useEffect } from "react";

const TONES = {
  error: "bg-coral",
  success: "bg-sky",
  info: "bg-yellow",
};

const ICONS = { error: "✕", success: "✓", info: "⏳" };

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const duration = toast.duration || (toast.type === "error" ? 5000 : 3500);
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`animate-rise fixed top-20 right-4 left-4 z-[9999] flex items-center gap-4 border-[3px] border-ink p-4 shadow-brutal-lg sm:left-auto sm:max-w-md ${
        TONES[toast.type] ?? TONES.info
      }`}
    >
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center border-[3px] border-ink bg-paper font-display text-sm"
      >
        {ICONS[toast.type] ?? ICONS.info}
      </span>

      <p className="flex-1 text-left text-sm font-semibold text-ink">
        {toast.message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="grid size-8 shrink-0 place-items-center border-[3px] border-ink bg-paper font-display text-sm text-ink brutal-press"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;