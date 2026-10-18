import React from "react";
import { CornerMarks } from "@/components/Decor";

const TONES = ["bg-paper", "bg-yellow", "bg-sky", "bg-coral"];

const TaskStats = React.memo(function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter((t) => t.priority === "high" && !t.completed).length;

  const statCards = [
    { label: "Total tasks", value: total },
    { label: "Pending", value: pending },
    { label: "Completed", value: completed },
    { label: "High priority", value: highPriority },
  ];

  return (
    <div className="mb-8 grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <div
          key={stat.label}
          className={`relative flex flex-col justify-between gap-5 border-[3px] border-ink p-5 shadow-brutal brutal-press transition-all ${TONES[index % TONES.length]}`}
        >
          <CornerMarks />
          <p className="label-mono font-bold text-xs text-ink/70">{stat.label.toUpperCase()}</p>
          <p className="font-display text-5xl leading-none text-ink">{stat.value}</p>
        </div>
      ))}
    </div>
  );
});

export default TaskStats;