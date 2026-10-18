import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import AuthShell, { AuthField } from "../components/AuthShell";
import { Button } from "../components/ui/button";
import { Arrow } from "../components/Decor";

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
    <AuthShell
      index="08"
      title="Welcome back"
      lede="Sign in to manage your tasks against the Node.js + MongoDB backend."
      error={error}
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link
            to="/register"
            className="brutal-link text-ink underline decoration-[3px] underline-offset-4"
          >
            Create Account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AuthField
          id="login-email"
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <AuthField
          id="login-password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto sm:self-start">
          {isLoading ? "Signing In..." : "Sign In"}
          {!isLoading && <Arrow />}
        </Button>
      </form>
    </AuthShell>
  );
}

export default Login;