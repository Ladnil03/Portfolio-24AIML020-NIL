const eventBus = require("../events/eventBus");
const EVENT_TYPES = require("../events/eventTypes");
const { handleAuditEvent } = require("./auditConsumer");
const notificationConsumer = require("./notificationConsumer");
const { handleCacheInvalidation } = require("./cacheConsumer");
const analyticsConsumer = require("./analyticsConsumer");

/**
 * Initialize and wire up all domain event consumers.
 * Decouples producers (routes) from consumers (audit, notification, cache, analytics).
 */
function initializeConsumers() {
  console.log("[EventBus] Registering event consumers...");

  // 1. Audit Consumer (Persists event trail in MongoDB asynchronously)
  const auditEventTypes = [
    EVENT_TYPES.TASK_CREATED,
    EVENT_TYPES.TASK_UPDATED,
    EVENT_TYPES.TASK_STATUS_CHANGED,
    EVENT_TYPES.TASK_DELETED,
    EVENT_TYPES.TASK_HIGH_PRIORITY_ALERT,
    EVENT_TYPES.USER_REGISTERED,
    EVENT_TYPES.USER_LOGGED_IN,
    EVENT_TYPES.JOB_COMPLETED,
    EVENT_TYPES.JOB_FAILED,
  ];

  auditEventTypes.forEach((type) => {
    eventBus.on(type, (event) => handleAuditEvent(event));
  });

  // 2. Notification Consumer (Dispatches emails, alerts & broadcasts to SSE)
  const notificationEventTypes = [
    EVENT_TYPES.TASK_HIGH_PRIORITY_ALERT,
    EVENT_TYPES.TASK_STATUS_CHANGED,
    EVENT_TYPES.USER_REGISTERED,
    EVENT_TYPES.JOB_COMPLETED,
  ];

  notificationEventTypes.forEach((type) => {
    eventBus.on(type, (event) => notificationConsumer.handleNotification(event, eventBus));
  });

  // 3. Cache Consumer (Reactively purges in-memory cache upon write mutations)
  const cacheEventTypes = [
    EVENT_TYPES.TASK_CREATED,
    EVENT_TYPES.TASK_UPDATED,
    EVENT_TYPES.TASK_STATUS_CHANGED,
    EVENT_TYPES.TASK_DELETED,
  ];

  cacheEventTypes.forEach((type) => {
    eventBus.on(type, (event) => handleCacheInvalidation(event));
  });

  // 4. Analytics Consumer (Aggregates real-time event stats)
  Object.values(EVENT_TYPES).forEach((type) => {
    eventBus.on(type, (event) => analyticsConsumer.handleEvent(event));
  });

  console.log(
    `[EventBus] Successfully wired ${eventBus.eventNames().length} event topics with decoupled subscribers.`
  );
}

module.exports = {
  initializeConsumers,
};
