import React from "react";

function TaskCard({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) {
  const id = task._id || task.id;
  const isCompleted = Boolean(task.completed);
  const priority = (task.priority || "medium").toLowerCase();

  const priorityStyles = {
    high: {
      bg: "rgba(239, 68, 68, 0.12)",
      color: "#ef4444",
      border: "rgba(239, 68, 68, 0.35)",
      label: "🔥 High",
    },
    medium: {
      bg: "rgba(245, 158, 11, 0.12)",
      color: "#f59e0b",
      border: "rgba(245, 158, 11, 0.35)",
      label: "⚡ Medium",
    },
    low: {
      bg: "rgba(34, 197, 94, 0.12)",
      color: "#22c55e",
      border: "rgba(34, 197, 94, 0.35)",
      label: "🌱 Low",
    },
  };

  const currentPriority = priorityStyles[priority] || priorityStyles.medium;

  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      style={{
        backgroundColor: "var(--card-bg)",
        color: "var(--text-h)",
        padding: "22px",
        borderRadius: "16px",
        border: isCompleted
          ? "2px solid rgba(34, 197, 94, 0.4)"
          : "2px solid var(--border)",
        boxShadow: "var(--shadow)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "left",
        position: "relative",
        opacity: isDeleting ? 0.5 : 1,
        transition: "all 0.25s ease",
        boxSizing: "border-box",
      }}
    >
      <div>
        {/* Top bar with Priority and Status Badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              backgroundColor: currentPriority.bg,
              color: currentPriority.color,
              border: `1px solid ${currentPriority.border}`,
              padding: "3px 10px",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {currentPriority.label}
          </span>

          <span
            style={{
              fontSize: "12px",
              fontWeight: "600",
              backgroundColor: isCompleted
                ? "rgba(34, 197, 94, 0.15)"
                : "rgba(100, 116, 139, 0.15)",
              color: isCompleted ? "#22c55e" : "var(--text)",
              border: isCompleted
                ? "1px solid rgba(34, 197, 94, 0.4)"
                : "1px solid var(--border)",
              padding: "3px 10px",
              borderRadius: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            {isCompleted ? "✓ Completed" : "⏳ Pending"}
          </span>
        </div>

        {/* Checkbox and Task Title */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "10px",
          }}
        >
          <button
            type="button"
            role="checkbox"
            aria-checked={isCompleted}
            aria-label={`Mark task "${task.title}" as ${isCompleted ? "pending" : "completed"}`}
            disabled={isUpdating || isDeleting}
            onClick={() => onToggleStatus(task)}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              border: isCompleted ? "2px solid #22c55e" : "2px solid var(--border)",
              backgroundColor: isCompleted ? "#22c55e" : "transparent",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isUpdating || isDeleting ? "not-allowed" : "pointer",
              fontSize: "13px",
              fontWeight: "bold",
              marginTop: "2px",
              flexShrink: 0,
              transition: "all 0.2s ease",
            }}
          >
            {isUpdating ? (
              <div
                style={{
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  borderTop: "2px solid #22c55e",
                  borderRadius: "50%",
                  width: "10px",
                  height: "10px",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : isCompleted ? (
              "✓"
            ) : null}
          </button>

          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700",
              color: isCompleted ? "var(--text)" : "var(--text-h)",
              textDecoration: isCompleted ? "line-through" : "none",
              wordBreak: "break-word",
              lineHeight: "1.3",
            }}
          >
            {task.title}
          </h3>
        </div>

        {/* Task Description */}
        <p
          style={{
            color: "var(--text)",
            fontSize: "14px",
            lineHeight: "1.6",
            margin: "0 0 16px 34px",
            wordBreak: "break-word",
            opacity: isCompleted ? 0.75 : 1,
          }}
        >
          {task.description || (
            <span style={{ fontStyle: "italic", opacity: 0.6 }}>
              No description provided.
            </span>
          )}
        </p>
      </div>

      {/* Card Footer: Metadata and Action Buttons */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "var(--text)",
            opacity: 0.8,
          }}
        >
          {formattedDate ? `📅 ${formattedDate}` : ""}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => onEdit(task)}
            disabled={isUpdating || isDeleting}
            aria-label={`Edit task ${task.title}`}
            style={{
              backgroundColor: "var(--code-bg)",
              color: "var(--text-h)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: isUpdating || isDeleting ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease",
            }}
          >
            ✏️ Edit
          </button>

          <button
            onClick={() => onDelete(task)}
            disabled={isUpdating || isDeleting}
            aria-label={`Delete task ${task.title}`}
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "8px",
              padding: "6px 12px",
              fontSize: "13px",
              fontWeight: "600",
              cursor: isUpdating || isDeleting ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              transition: "all 0.2s ease",
            }}
          >
            {isDeleting ? (
              <div
                style={{
                  border: "2px solid rgba(239, 68, 68, 0.3)",
                  borderTop: "2px solid #ef4444",
                  borderRadius: "50%",
                  width: "12px",
                  height: "12px",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            ) : (
              "🗑️ Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
