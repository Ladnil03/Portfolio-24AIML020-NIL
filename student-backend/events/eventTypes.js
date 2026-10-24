/**
 * Domain Event Types Constants
 * Standardized event topics for the Event-Driven Architecture.
 */

const EVENT_TYPES = {
  // Task Domain Events
  TASK_CREATED: "task:created",
  TASK_UPDATED: "task:updated",
  TASK_STATUS_CHANGED: "task:status_changed",
  TASK_DELETED: "task:deleted",
  TASK_HIGH_PRIORITY_ALERT: "task:high_priority_alert",

  // User Domain Events
  USER_REGISTERED: "user:registered",
  USER_LOGGED_IN: "user:logged_in",

  // Background Job Queue Events
  JOB_ENQUEUED: "job:enqueued",
  JOB_STARTED: "job:started",
  JOB_PROGRESS: "job:progress",
  JOB_COMPLETED: "job:completed",
  JOB_FAILED: "job:failed",
  JOB_RETRY: "job:retry",

  // System & Notification Events
  NOTIFICATION_DISPATCHED: "notification:dispatched",
  AUDIT_LOGGED: "audit:logged",
};

module.exports = EVENT_TYPES;
