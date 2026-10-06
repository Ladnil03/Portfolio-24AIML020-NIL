/**
 * Authentication API Service
 * Handles user registration, login, token management, and session state.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

// ── Token Management ─────────────────────────────────────────────────

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  removeToken();
}

// ── Auth Headers ─────────────────────────────────────────────────────

export function authHeaders() {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// ── API Helpers ──────────────────────────────────────────────────────

async function handleAuthResponse(response) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    if (data) {
      if (data.errors) {
        const validationMessages = Object.entries(data.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("; ");
        errorMessage = validationMessages || data.message || errorMessage;
      } else if (data.message) {
        errorMessage = data.message;
      }
    }
    const error = new Error(errorMessage.trim());
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// ── API Calls ────────────────────────────────────────────────────────

/**
 * Register a new user
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user, token }>}
 */
export async function register(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await handleAuthResponse(response);

  if (data.token) {
    setToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

/**
 * Log in an existing user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user, token }>}
 */
export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleAuthResponse(response);

  if (data.token) {
    setToken(data.token);
    setStoredUser(data.user);
  }

  return data;
}

/**
 * Get current user details from JWT
 * @returns {Promise<{ user }>}
 */
export async function getMe() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (response.status === 401) {
    removeToken();
    window.location.href = "/login";
    return null;
  }

  const data = await handleAuthResponse(response);
  if (data?.user) {
    setStoredUser(data.user);
  }
  return data;
}
