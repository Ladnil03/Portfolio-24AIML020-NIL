import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/**
 * TaskAnalyticsChart - Heavy third-party component using Recharts
 * This component is dynamically lazy-loaded only when rendered or requested on the dashboard.
 */
export default function TaskAnalyticsChart({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const highPriority = tasks.filter((t) => t.priority === "high").length;
  const mediumPriority = tasks.filter((t) => t.priority === "medium").length;
  const lowPriority = tasks.filter((t) => t.priority === "low").length;

  const statusData = [
    { name: "Completed", value: completed, color: "#10b981" },
    { name: "Pending", value: pending, color: "#f59e0b" },
  ];

  const priorityData = [
    { priority: "High", count: highPriority, fill: "#ef4444" },
    { priority: "Medium", count: mediumPriority, fill: "#f59e0b" },
    { priority: "Low", count: lowPriority, fill: "#22c55e" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "24px 20px",
        marginBottom: "28px",
        boxShadow: "var(--shadow)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "20px",
              color: "var(--text-h)",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            📊 Task Analytics & Breakdown
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: "13px",
              color: "var(--text)",
            }}
          >
            Dynamically loaded third-party charting module (Recharts library)
          </p>
        </div>
        <span
          style={{
            fontSize: "12px",
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            color: "#22c55e",
            padding: "4px 10px",
            borderRadius: "12px",
            fontWeight: "600",
            border: "1px solid rgba(34, 197, 94, 0.3)",
          }}
        >
          ⚡ Lazy Chunk Active
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {/* Status Distribution Pie Chart */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--code-bg)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px",
              fontSize: "15px",
              color: "var(--text-h)",
              textAlign: "center",
            }}
          >
            Completion Ratio
          </h4>
          <div style={{ width: "100%", height: 220 }}>
            {total === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "80px",
                  fontSize: "14px",
                  color: "var(--text)",
                }}
              >
                No tasks available to chart
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card-bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--text-h)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Breakdown Bar Chart */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--code-bg)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
          }}
        >
          <h4
            style={{
              margin: "0 0 12px",
              fontSize: "15px",
              color: "var(--text-h)",
              textAlign: "center",
            }}
          >
            Tasks by Priority
          </h4>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="priority" stroke="var(--text)" fontSize={12} />
                <YAxis allowDecimals={false} stroke="var(--text)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card-bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    color: "var(--text-h)",
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
