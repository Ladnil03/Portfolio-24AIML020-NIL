import React, { useEffect } from "react";

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";
  const isSuccess = toast.type === "success";

  const borderColor = isError ? "#ef4444" : isSuccess ? "#22c55e" : "#3b82f6";
  const bgColor = isError
    ? "rgba(239, 68, 68, 0.95)"
    : isSuccess
    ? "rgba(22, 163, 74, 0.95)"
    : "rgba(37, 99, 235, 0.95)";
  const icon = isError ? "✕" : isSuccess ? "✓" : "ℹ";

  return (
    <div
      role="alert"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        backgroundColor: bgColor,
        color: "#ffffff",
        padding: "14px 20px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        border: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "420px",
        animation: "slideIn 0.3s ease-out",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flexGrow: 1, fontSize: "15px", fontWeight: "500", lineHeight: "1.4" }}>
        {toast.message}
      </div>
      <button
        onClick={onClose}
        aria-label="Close notification"
        style={{
          background: "transparent",
          border: "none",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: "18px",
          padding: "0 4px",
          lineHeight: "1",
          opacity: 0.8,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
