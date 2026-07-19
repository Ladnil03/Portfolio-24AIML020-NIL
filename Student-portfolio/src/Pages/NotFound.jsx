import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section style={{ padding: "80px 20px", textAlign: "center" }}>
      <div
        style={{
          backgroundColor: "#111",
          color: "white",
          maxWidth: "500px",
          margin: "0 auto",
          padding: "40px",
          borderRadius: "20px",
          border: "3px solid #22c55e",
          boxShadow: "0 10px 25px rgba(0,0,0,.2)"
        }}
      >
        <h1 style={{ color: "#22c55e", fontSize: "72px", margin: "0 0 20px" }}>
          404
        </h1>
        <h2 style={{ color: "white", fontSize: "28px", margin: "0 0 15px" }}>
          Page Not Found
        </h2>
        <p style={{ color: "#aaa", fontSize: "18px", lineHeight: "1.6", marginBottom: "30px" }}>
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            backgroundColor: "#22c55e",
            color: "white",
            textDecoration: "none",
            padding: "12px 24px",
            fontSize: "18px",
            fontWeight: "bold",
            borderRadius: "8px",
            transition: "0.3s",
            boxShadow: "0 4px 10px rgba(34, 197, 94, 0.3)"
          }}
        >
          Go Back Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
