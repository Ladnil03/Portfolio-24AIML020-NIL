/**
 * Task API Service
 * Handles all HTTP communication with the Node.js + Express + MongoDB backend.
 * All requests include JWT authentication headers.
 */

import { authHeaders, removeToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Helper to process JSON response or throw formatted Error.
 * Redirects to /login on 401 (expired/invalid token).
 */
async function handleResponse(response) {
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    // Token expired or invalid — redirect to login
    if (response.status === 401) {
      removeToken();
      window.location.href = "/login";
      return null;
    }

    let errorMessage = `Request failed with status ${response.status}`;
    if (data) {
      if (data.errors) {
        // Collect Mongoose validation field errors
        const validationMessages = Object.entries(data.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("; ");
        errorMessage = validationMessages || data.message || errorMessage;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = `${data.error}: ${data.message || ""}`;
      }
    }
    const error = new Error(errorMessage.trim());
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch all tasks from MongoDB with optional query filters
 * @param {Object} [filters] - { completed, status, priority }
 * @returns {Promise<Array>} List of tasks
 */
export async function fetchTasks(filters = {}) {
  const params = new URLSearchParams();
  if (filters.completed !== undefined && filters.completed !== null && filters.completed !== "") {
    params.append("completed", filters.completed.toString());
  } else if (filters.status && filters.status !== "all") {
    params.append("status", filters.status);
  }

  if (filters.priority && filters.priority !== "all") {
    params.append("priority", filters.priority);
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const response = await fetch(`${API_BASE_URL}/tasks${queryString}`, {
    headers: authHeaders(),
  });
  const result = await handleResponse(response);
  return result?.data || [];
}

/**
 * Fetch a single task by ID
 * @param {string} id - Task ObjectId
 * @returns {Promise<Object>} Task object
 */
export async function fetchTaskById(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: authHeaders(),
  });
  const result = await handleResponse(response);
  return result?.data;
}

/**
 * Create a new task in MongoDB
 * @param {Object} taskData - { title, description, priority, completed }
 * @returns {Promise<Object>} Created task object
 */
export async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });
  const result = await handleResponse(response);
  return result?.data;
}

/**
 * Perform a full update on an existing task (PUT)
 * @param {string} id - Task ObjectId
 * @param {Object} taskData - Full task payload
 * @returns {Promise<Object>} Updated task object
 */
export async function updateTask(id, taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(taskData),
  });
  const result = await handleResponse(response);
  return result?.data;
}

/**
 * Perform a partial update on an existing task (PATCH)
 * @param {string} id - Task ObjectId
 * @param {Object} partialData - Partial fields to update
 * @returns {Promise<Object>} Updated task object
 */
export async function patchTask(id, partialData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(partialData),
  });
  const result = await handleResponse(response);
  return result?.data;
}

/**
 * Delete a task from MongoDB
 * @param {string} id - Task ObjectId
 * @returns {Promise<Object>} Deleted task info
 */
export async function deleteTask(id) {
  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const result = await handleResponse(response);
  return result?.data;
}
