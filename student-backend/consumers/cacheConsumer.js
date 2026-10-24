const { invalidateTasksCache } = require("../utils/cache");
const EVENT_TYPES = require("../events/eventTypes");

/**
 * Asynchronous Cache Invalidation Consumer
 * Reactively clears in-memory cache upon domain events, decoupling cache
 * internals from HTTP route controllers.
 */
function handleCacheInvalidation(event) {
  const { type, payload } = event;
  const taskId = payload.taskId || payload.task?._id || payload.task?.id;

  switch (type) {
    case EVENT_TYPES.TASK_CREATED:
    case EVENT_TYPES.TASK_UPDATED:
    case EVENT_TYPES.TASK_STATUS_CHANGED:
    case EVENT_TYPES.TASK_DELETED:
      invalidateTasksCache(taskId ? taskId.toString() : null);
      break;
    default:
      break;
  }
}

module.exports = {
  handleCacheInvalidation,
};
