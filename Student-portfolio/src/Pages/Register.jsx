import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import AuthShell, { AuthField } from "../components/AuthShell";
import { Button } from "../components/ui/button";
import { Arrow } from "../components/Decor";

function Register({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.register(
        formData.name,
        formData.email,
        formData.password
      );
      if (onLogin) onLogin(data.user);
      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      index="09"
      title="Create account"
      lede="Sign up to start managing your tasks."
      error={error}
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="brutal-link text-ink underline decoration-[3px] underline-offset-4"
          >
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <AuthField
          id="register-name"
          name="name"
          label="Full name"
          autoComplete="name"
          placeholder="John Doe"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <AuthField
          id="register-email"
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
          id="register-password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          minLength={6}
          required
          hint="Must be at least 6 characters"
          value={formData.password}
          onChange={handleChange}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto sm:self-start">
          {isLoading ? "Creating Account..." : "Create Account"}
          {!isLoading && <Arrow />}
        </Button>
      </form>
    </AuthShell>
  );
}

export default Register;