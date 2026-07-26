import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section style={{ padding: "80px 20px", textAlign: "center", width: "100%", boxSizing: "border-box" }}>
      <div
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-h)",
          maxWidth: "500px",
          margin: "0 auto",
          padding: "40px 30px",
          borderRadius: "20px",
          border: "2px solid #22c55e",
          boxShadow: "var(--shadow)",
          boxSizing: "border-box"
        }}
      >
        <h1 style={{ color: "#22c55e", fontSize: "72px", margin: "0 0 10px", fontWeight: "800" }}>
          404
        </h1>
        <h2 style={{ color: "var(--text-h)", fontSize: "28px", margin: "0 0 15px", fontWeight: "700" }}>
          Page Not Found
        </h2>
        <p style={{ color: "var(--text)", fontSize: "17px", lineHeight: "1.6", marginBottom: "30px" }}>
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            backgroundColor: "#22c55e",
            color: "#ffffff",
            textDecoration: "none",
            padding: "12px 24px",
            fontSize: "17px",
            fontWeight: "600",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
          }}
        >
          Go Back Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
