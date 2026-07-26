import React from "react";

function ErrorMessage({ message, onRetry }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 30px",
        margin: "40px auto",
        maxWidth: "600px",
        backgroundColor: "var(--card-bg)",
        border: "2px solid #ef4444",
        borderRadius: "16px",
        boxShadow: "var(--shadow)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ef4444",
          fontSize: "30px",
          marginBottom: "15px",
        }}
      >
        ⚠️
      </div>
      <h2 style={{ color: "#ef4444", fontSize: "24px", margin: "0 0 10px" }}>
        Failed to Load Repositories
      </h2>
      <p
        style={{
          color: "var(--text)",
          fontSize: "16px",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        {message || "An unexpected error occurred while fetching data from the API."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: "#22c55e",
            color: "#ffffff",
            border: "none",
            padding: "10px 22px",
            fontSize: "16px",
            fontWeight: "600",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
