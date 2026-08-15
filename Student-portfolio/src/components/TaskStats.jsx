import React from "react";

function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === "high" && !t.completed).length;

  const statCards = [
    {
      label: "Total Tasks",
      value: total,
      icon: "📋",
      color: "var(--accent)",
      bg: "rgba(34, 197, 94, 0.1)",
      border: "rgba(34, 197, 94, 0.3)",
    },
    {
      label: "Pending",
      value: pending,
      icon: "⏳",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.3)",
    },
    {
      label: "Completed",
      value: completed,
      icon: "✅",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.3)",
    },
    {
      label: "High Priority",
      value: highPriority,
      icon: "🔥",
      color: "#ef4444",
      bg: "rgba(239, 68, 68, 0.1)",
      border: "rgba(239, 68, 68, 0.3)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginBottom: "28px",
        width: "100%",
      }}
    >
      {statCards.map((stat, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "var(--card-bg)",
            border: `1px solid ${stat.border}`,
            borderRadius: "14px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "var(--shadow)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          <div style={{ textAlign: "left" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "var(--text)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                margin: "0 0 4px",
              }}
            >
              {stat.label}
            </p>
            <h3
              style={{
                fontSize: "26px",
                fontWeight: "700",
                color: "var(--text-h)",
                margin: 0,
              }}
            >
              {stat.value}
            </h3>
          </div>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              backgroundColor: stat.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
            }}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskStats;
