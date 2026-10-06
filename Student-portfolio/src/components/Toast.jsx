import React, { useEffect } from "react";

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

  const isError = toast.type === "error";
  const isSuccess = toast.type === "success";
  const isInfo = toast.type === "info";

  const borderColor = isError
    ? "#ef4444"
    : isSuccess
    ? "#22c55e"
    : isInfo
    ? "#3b82f6"
    : "#f59e0b";

  const bgColor = isError
    ? "rgba(220, 38, 38, 0.95)"
    : isSuccess
    ? "rgba(22, 163, 74, 0.95)"
    : isInfo
    ? "rgba(37, 99, 235, 0.95)"
    : "rgba(217, 119, 6, 0.95)";

  const icon = isError ? "✕" : isSuccess ? "✓" : isInfo ? "⏳" : "ℹ";

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        backgroundColor: bgColor,
        color: "#ffffff",
        padding: "14px 18px",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
        border: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        gap: "12px",
        maxWidth: "440px",
        minWidth: "280px",
        animation: "slideIn 0.3s ease-out",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.22)",
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

      <div
        style={{
          flexGrow: 1,
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.4",
          textAlign: "left",
        }}
      >
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
          fontSize: "20px",
          padding: "0 4px",
          lineHeight: "1",
          opacity: 0.85,
          transition: "opacity 0.2s",
        }}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;
