const ActivityLog = require("../models/ActivityLog");
const EVENT_TYPES = require("../events/eventTypes");

/**
 * Asynchronous Audit & Activity Log Consumer
 * Decouples database audit persistence from synchronous API request handling.
 *
 * @param {Object} event - Structured event object from EventBus
 */
async function handleAuditEvent(event) {
  const { id, type, payload, meta } = event;

  let entityType = "task";
  let entityId = null;

  if (type.startsWith("user:")) {
    entityType = "user";
    entityId = payload.user?.id || payload.user?._id || payload.userId;
  } else if (type.startsWith("job:")) {
    entityType = "job";
    entityId = payload.jobId || payload.id;
  } else {
    entityType = "task";
    entityId = payload.task?._id || payload.task?.id || payload.taskId;
  }

  const logEntry = {
    eventId: id,
    eventType: type,
    entityType,
    entityId: entityId ? entityId.toString() : null,
    actor: {
      id: meta?.actor?.id || meta?.actor?._id || "system",
      email: meta?.actor?.email || null,
      name: meta?.actor?.name || null,
    },
    details: {
      summary: getEventSummary(type, payload),
      data: sanitizeDetails(payload),
    },
    processingDurationMs: meta?.durationMs || 0,
    createdAt: new Date(meta?.timestamp || Date.now()),
  };

  try {
    // Asynchronously insert log in MongoDB without blocking primary response
    await ActivityLog.create(logEntry);
  } catch (err) {
    // Failure in audit logging must never crash the server
    console.error(`[AuditConsumer Warning] Failed to persist audit log for ${type}:`, err.message);
  }
}

/**
 * Helper to generate human-readable event summary
 */
function getEventSummary(type, payload) {
  switch (type) {
    case EVENT_TYPES.TASK_CREATED:
      return `Task "${payload.task?.title || "Untitled"}" was created with ${payload.task?.priority || "medium"} priority`;
    case EVENT_TYPES.TASK_UPDATED:
      return `Task "${payload.task?.title || payload.taskId}" was updated`;
    case EVENT_TYPES.TASK_STATUS_CHANGED:
      return `Task "${payload.task?.title || payload.taskId}" status changed to ${
        payload.completed ? "COMPLETED" : "PENDING"
      }`;
    case EVENT_TYPES.TASK_DELETED:
      return `Task ID ${payload.taskId} was deleted`;
    case EVENT_TYPES.TASK_HIGH_PRIORITY_ALERT:
      return `⚠️ High Priority alert triggered for "${payload.task?.title || "Task"}"`;
    case EVENT_TYPES.USER_REGISTERED:
      return `New user registered: ${payload.user?.email || payload.email}`;
    case EVENT_TYPES.USER_LOGGED_IN:
      return `User authenticated: ${payload.user?.email || payload.email}`;
    case EVENT_TYPES.JOB_COMPLETED:
      return `Background job ${payload.jobId} (${payload.type}) completed successfully`;
    case EVENT_TYPES.JOB_FAILED:
      return `Background job ${payload.jobId} (${payload.type}) failed: ${payload.error}`;
    default:
      return `Event ${type} processed`;
  }
}

/**
 * Remove sensitive or overly large properties
 */
function sanitizeDetails(payload) {
  if (!payload || typeof payload !== "object") return {};
  const clean = { ...payload };
  delete clean.password;
  delete clean.token;
  delete clean._links;
  return clean;
}

module.exports = {
  handleAuditEvent,
};
