import React, { useState, useEffect } from "react";

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

  const priorityColors = {
    low: { bg: "rgba(34, 197, 94, 0.15)", border: "#22c55e", text: "#22c55e" },
    medium: { bg: "rgba(245, 158, 11, 0.15)", border: "#f59e0b", text: "#f59e0b" },
    high: { bg: "rgba(239, 68, 68, 0.15)", border: "#ef4444", text: "#ef4444" },
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        zIndex: 2000,
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          borderRadius: "18px",
          border: "2px solid var(--border)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "520px",
          padding: "30px",
          boxSizing: "border-box",
          color: "var(--text-h)",
          textAlign: "left",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            id="task-modal-title"
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "var(--text-h)",
              margin: 0,
            }}
          >
            {isEditing ? "✏️ Edit Task" : "✨ Create New Task"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
            style={{
              backgroundColor: "transparent",
              border: "none",
              color: "var(--text)",
              fontSize: "24px",
              cursor: isLoading ? "not-allowed" : "pointer",
              padding: "4px 8px",
              borderRadius: "6px",
            }}
          >
            ×
          </button>
        </div>

        {(clientError || error) && (
          <div
            role="alert"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              padding: "10px 14px",
              marginBottom: "18px",
              color: "#ef4444",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            <span>{clientError || error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title Field */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="task-title-input"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-h)",
                marginBottom: "6px",
              }}
            >
              Task Title <span style={{ color: "#ef4444" }}>*</span>
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
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "15px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Description Field */}
          <div style={{ marginBottom: "18px" }}>
            <label
              htmlFor="task-desc-input"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-h)",
                marginBottom: "6px",
              }}
            >
              Description (optional)
            </label>
            <textarea
              id="task-desc-input"
              rows={3}
              placeholder="Details or notes about the task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                outline: "none",
                boxSizing: "border-box",
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Priority Selector */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-h)",
                marginBottom: "8px",
              }}
            >
              Priority Level
            </label>
            <div style={{ display: "flex", gap: "10px" }}>
              {["low", "medium", "high"].map((p) => {
                const isSelected = priority === p;
                const config = priorityColors[p];
                return (
                  <button
                    key={p}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setPriority(p)}
                    style={{
                      flex: 1,
                      padding: "10px 12px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "capitalize",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      border: isSelected
                        ? `2px solid ${config.border}`
                        : "1px solid var(--border)",
                      backgroundColor: isSelected ? config.bg : "var(--code-bg)",
                      color: isSelected ? config.text : "var(--text)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {p === "high" ? "🔥 High" : p === "medium" ? "⚡ Medium" : "🌱 Low"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Checkbox */}
          <div
            style={{
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              backgroundColor: "var(--code-bg)",
              borderRadius: "8px",
              border: "1px solid var(--border)",
            }}
          >
            <input
              id="task-completed-check"
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              disabled={isLoading}
              style={{
                width: "18px",
                height: "18px",
                accentColor: "#22c55e",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            />
            <label
              htmlFor="task-completed-check"
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-h)",
                cursor: isLoading ? "not-allowed" : "pointer",
                margin: 0,
              }}
            >
              Mark as completed
            </label>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: "10px 22px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#22c55e",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
                opacity: isLoading ? 0.8 : 1,
              }}
            >
              {isLoading && (
                <div
                  style={{
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    borderTop: "2px solid #ffffff",
                    borderRadius: "50%",
                    width: "14px",
                    height: "14px",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              )}
              {isLoading
                ? isEditing
                  ? "Saving Changes..."
                  : "Creating Task..."
                : isEditing
                ? "Save Changes"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
