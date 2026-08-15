import React from "react";

function Spinner({ message = "Loading tasks from MongoDB...", size = "default" }) {
  const isSmall = size === "small";

  if (isSmall) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            border: "2px solid rgba(34, 197, 94, 0.2)",
            borderTop: "2px solid #22c55e",
            borderRadius: "50%",
            width: "16px",
            height: "16px",
            animation: "spin 0.8s linear infinite",
          }}
        />
        {message && <span style={{ fontSize: "14px", color: "var(--text)" }}>{message}</span>}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        minHeight: "300px",
      }}
    >
      <div className="spinner-loader"></div>
      <p
        style={{
          color: "var(--text-h)",
          fontSize: "18px",
          fontWeight: "600",
          marginTop: "10px",
        }}
      >
        {message}
      </p>
    </div>
  );
}

export default Spinner;
