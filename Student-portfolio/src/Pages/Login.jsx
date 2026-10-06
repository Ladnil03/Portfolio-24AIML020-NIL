import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.login(formData.email, formData.password);
      if (onLogin) onLogin(data.user);
      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      style={{
        minHeight: "calc(100vh - 160px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          padding: "40px 36px",
          boxShadow: "var(--shadow)",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "rgba(34, 197, 94, 0.12)",
              color: "#22c55e",
              fontSize: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            🔐
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "var(--text-h)",
              margin: "0 0 8px",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text)", margin: 0 }}>
            Sign in to manage your tasks
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              borderRadius: "10px",
              padding: "12px 16px",
              fontSize: "14px",
              marginBottom: "20px",
              fontWeight: "500",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="login-email"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-h)",
                marginBottom: "8px",
              }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "15px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              htmlFor="login-password"
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-h)",
                marginBottom: "8px",
              }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={{
                width: "100%",
                padding: "12px 14px",
                fontSize: "15px",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--code-bg)",
                color: "var(--text-h)",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "16px",
              fontWeight: "700",
              borderRadius: "12px",
              border: "none",
              backgroundColor: isLoading ? "#16a34a" : "#22c55e",
              color: "#ffffff",
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
              transition: "background-color 0.2s ease, transform 0.2s ease",
            }}
          >
            {isLoading && (
              <div
                style={{
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  width: "16px",
                  height: "16px",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Register Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "14px",
            color: "var(--text)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#22c55e",
              fontWeight: "600",
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default Login;
