import React from "react";
import TaskCard from "./TaskCard";

function TaskList({
  tasks = [],
  onToggleStatus,
  onEdit,
  onDelete,
  updatingTaskId,
  deletingTaskId,
  onCreateNew,
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          backgroundColor: "var(--card-bg)",
          borderRadius: "16px",
          border: "2px dashed var(--border)",
          margin: "20px 0",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
        <h3
          style={{
            fontSize: "20px",
            color: "var(--text-h)",
            marginBottom: "8px",
            fontWeight: "600",
          }}
        >
          No tasks found
        </h3>
        <p
          style={{
            fontSize: "15px",
            color: "var(--text)",
            marginBottom: "20px",
          }}
        >
          Try changing your filter settings or create a brand new task.
        </p>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            style={{
              backgroundColor: "#22c55e",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
              transition: "all 0.2s ease",
            }}
          >
            ➕ Create First Task
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "20px",
        marginTop: "10px",
      }}
    >
      {tasks.map((task) => {
        const id = task._id || task.id;
        return (
          <TaskCard
            key={id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
            isUpdating={updatingTaskId === id}
            isDeleting={deletingTaskId === id}
          />
        );
      })}
    </div>
  );
}

export default TaskList;
