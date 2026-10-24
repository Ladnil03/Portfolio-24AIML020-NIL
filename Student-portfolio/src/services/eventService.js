/**
 * Event-Driven Architecture & Background Jobs Service
 * Connects frontend to real-time Server-Sent Events (SSE) stream,
 * background job queues, and asynchronous event telemetry.
 */

import { authHeaders } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Open a real-time Server-Sent Events (SSE) connection to listen for domain events & job progress.
 * @param {Function} onEvent - Callback invoked on each streamed domain event
 * @param {Function} [onError] - Callback invoked on connection error
 * @returns {Function} Unsubscribe function to cleanly close SSE stream
 */
export function subscribeToEventStream(onEvent, onError) {
  const url = `${API_BASE_URL}/api/events/stream`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (onEvent) onEvent(data);
    } catch (err) {
      console.warn("[SSE Warning] Could not parse event chunk:", e.data);
    }
  };

  eventSource.onerror = (err) => {
    if (onError) onError(err);
  };

  return () => {
    eventSource.close();
  };
}

/**
 * Fetch paginated asynchronous activity / audit logs from MongoDB
 */
export async function fetchActivities(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.eventType) query.append("eventType", params.eventType);

  const res = await fetch(`${API_BASE_URL}/api/events/activities?${query.toString()}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data?.data || [];
}

/**
 * Fetch real-time EventBus and JobQueue metrics
 */
export async function fetchEventMetrics() {
  const res = await fetch(`${API_BASE_URL}/api/events/metrics`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data?.data;
}

/**
 * Trigger an asynchronous background job (HTTP 202 Accepted pattern)
 * @param {string} type - 'export_tasks_csv' | 'export_tasks_json' | 'batch_analyze_tasks'
 * @param {Object} [payload] - Optional parameters
 * @returns {Promise<Object>} Job response with jobId and status
 */
export async function enqueueBackgroundJob(type, payload = {}) {
  const res = await fetch(`${API_BASE_URL}/api/jobs`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, payload }),
  });

  const data = await res.json();
  if (!res.ok && res.status !== 202) {
    throw new Error(data?.message || `Job submission failed with status ${res.status}`);
  }
  return data;
}

/**
 * Check status and progress of a background job
 */
export async function fetchJobStatus(jobId) {
  const res = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data?.data;
}

/**
 * List all recent background jobs and queue status
 */
export async function fetchJobsList() {
  const res = await fetch(`${API_BASE_URL}/api/jobs`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  return data;
}

/**
 * Return absolute URL for downloading a completed job export artifact
 */
export function getJobDownloadUrl(jobId) {
  return `${API_BASE_URL}/api/jobs/${jobId}/download`;
}
