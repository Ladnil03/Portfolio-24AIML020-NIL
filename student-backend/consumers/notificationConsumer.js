const EVENT_TYPES = require("../events/eventTypes");

/**
 * Asynchronous Notification & Alert Consumer
 * Simulates external notification services (SMTP Email, SMS Gateway, Webhook dispatch)
 * with realistic asynchronous non-blocking I/O latency.
 */
class NotificationConsumer {
  constructor() {
    this.dispatchedCount = 0;
    this.recentNotifications = [];
  }

  async handleNotification(event, eventBus) {
    const { type, payload } = event;

    let notification = null;

    if (type === EVENT_TYPES.TASK_HIGH_PRIORITY_ALERT) {
      notification = {
        id: `notif-${Date.now()}`,
        channel: "email",
        recipient: "team-lead@example.com",
        title: "🚨 High Priority Task Created",
        body: `Immediate action required: "${payload.task?.title}" was created with HIGH priority.`,
        urgency: "high",
        timestamp: new Date().toISOString(),
      };
    } else if (type === EVENT_TYPES.TASK_STATUS_CHANGED && payload.completed) {
      notification = {
        id: `notif-${Date.now()}`,
        channel: "in-app",
        recipient: payload.actor?.email || "user@example.com",
        title: "🎉 Task Completed",
        body: `Task "${payload.task?.title || payload.taskId}" was marked completed. Great job!`,
        urgency: "normal",
        timestamp: new Date().toISOString(),
      };
    } else if (type === EVENT_TYPES.USER_REGISTERED) {
      notification = {
        id: `notif-${Date.now()}`,
        channel: "email",
        recipient: payload.user?.email,
        title: "👋 Welcome to Task Management System",
        body: `Hello ${payload.user?.name || "Student"}! Your account is active.`,
        urgency: "normal",
        timestamp: new Date().toISOString(),
      };
    } else if (type === EVENT_TYPES.JOB_COMPLETED) {
      notification = {
        id: `notif-${Date.now()}`,
        channel: "in-app",
        recipient: "system",
        title: "📦 Background Job Finished",
        body: `Job ${payload.jobId} (${payload.type}) completed. Artifact ready for download.`,
        urgency: "normal",
        timestamp: new Date().toISOString(),
      };
    }

    if (!notification) return;

    // Simulate external async network roundtrip (e.g. SMTP or Slack webhook)
    // Note: Since this is handled asynchronously via EventBus, the HTTP client
    // is NOT blocked by this delay!
    await new Promise((resolve) => setTimeout(resolve, 350));

    this.dispatchedCount += 1;
    this.recentNotifications.unshift(notification);
    if (this.recentNotifications.length > 20) {
      this.recentNotifications.pop();
    }

    console.log(
      `[NotificationConsumer] Dispatched [${notification.channel.toUpperCase()}] -> ${
        notification.recipient
      }: "${notification.title}"`
    );

    // Emit notification:dispatched event so browser SSE clients receive push alert
    if (eventBus) {
      eventBus.emitAsync(EVENT_TYPES.NOTIFICATION_DISPATCHED, {
        notification,
        sourceEvent: type,
      });
    }
  }

  getMetrics() {
    return {
      dispatchedCount: this.dispatchedCount,
      recent: this.recentNotifications.slice(0, 5),
    };
  }
}

const notificationConsumer = new NotificationConsumer();

module.exports = notificationConsumer;
