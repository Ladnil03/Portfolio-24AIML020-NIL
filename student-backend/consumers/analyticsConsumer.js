const EVENT_TYPES = require("../events/eventTypes");

/**
 * Asynchronous Analytics Consumer
 * Aggregates real-time domain event statistics without blocking API endpoints.
 */
class AnalyticsConsumer {
  constructor() {
    this.counters = {
      tasksCreated: 0,
      tasksUpdated: 0,
      tasksCompleted: 0,
      tasksDeleted: 0,
      highPriorityAlerts: 0,
      usersRegistered: 0,
      usersLoggedIn: 0,
      jobsProcessed: 0,
    };
    this.startedAt = new Date().toISOString();
  }

  handleEvent(event) {
    const { type } = event;
    switch (type) {
      case EVENT_TYPES.TASK_CREATED:
        this.counters.tasksCreated += 1;
        break;
      case EVENT_TYPES.TASK_UPDATED:
        this.counters.tasksUpdated += 1;
        break;
      case EVENT_TYPES.TASK_STATUS_CHANGED:
        if (event.payload?.completed) {
          this.counters.tasksCompleted += 1;
        }
        break;
      case EVENT_TYPES.TASK_DELETED:
        this.counters.tasksDeleted += 1;
        break;
      case EVENT_TYPES.TASK_HIGH_PRIORITY_ALERT:
        this.counters.highPriorityAlerts += 1;
        break;
      case EVENT_TYPES.USER_REGISTERED:
        this.counters.usersRegistered += 1;
        break;
      case EVENT_TYPES.USER_LOGGED_IN:
        this.counters.usersLoggedIn += 1;
        break;
      case EVENT_TYPES.JOB_COMPLETED:
        this.counters.jobsProcessed += 1;
        break;
      default:
        break;
    }
  }

  getAnalytics() {
    return {
      counters: this.counters,
      uptimeSeconds: Math.floor((Date.now() - new Date(this.startedAt).getTime()) / 1000),
      startedAt: this.startedAt,
    };
  }

  reset() {
    for (const key in this.counters) {
      this.counters[key] = 0;
    }
    this.startedAt = new Date().toISOString();
  }
}

const analyticsConsumer = new AnalyticsConsumer();

module.exports = analyticsConsumer;
