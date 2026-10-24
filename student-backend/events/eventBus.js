const EventEmitter = require("events");

/**
 * Enterprise Asynchronous Event Bus
 * Provides decoupled Publish-Subscribe (Pub/Sub) messaging with:
 * - Non-blocking asynchronous subscriber execution
 * - Subscriber error isolation (using Promise.allSettled)
 * - Telemetry & metrics aggregation
 * - Rolling event history log for observability and SSE streaming
 */
class EventBus extends EventEmitter {
  constructor() {
    super();
    // Allow ample listeners for multi-consumer microservice architecture
    this.setMaxListeners(50);

    // Telemetry & metrics state
    this.metrics = {
      totalEmitted: 0,
      totalHandled: 0,
      totalErrors: 0,
      startedAt: new Date().toISOString(),
      byType: {},
      latencies: [],
    };

    // Rolling circular buffer of recent events for live monitoring & SSE
    this.maxHistory = 50;
    this.recentEvents = [];

    // Registered SSE client response streams
    this.sseClients = new Set();
  }

  /**
   * Publish an event asynchronously to all subscribers without blocking the caller.
   * Isolates failures so one misbehaving consumer doesn't affect others.
   *
   * @param {string} eventType - Domain event topic
   * @param {Object} payload - Event data payload
   * @param {Object} [meta] - Optional context metadata (actor, traceId, etc.)
   */
  emitAsync(eventType, payload = {}, meta = {}) {
    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const timestamp = new Date().toISOString();
    const eventObj = {
      id: eventId,
      type: eventType,
      payload,
      meta: {
        ...meta,
        timestamp,
      },
    };

    // Update telemetry
    this.metrics.totalEmitted += 1;
    this.metrics.byType[eventType] = (this.metrics.byType[eventType] || 0) + 1;

    // Broadcast to connected SSE browser clients
    this.broadcastToSse(eventObj);

    // Execute listeners asynchronously
    const listeners = this.rawListeners(eventType);
    const wildcardListeners = this.rawListeners("*");
    const allListeners = [...listeners, ...wildcardListeners];

    if (allListeners.length === 0) {
      this.recordHistory(eventObj, 0, []);
      return Promise.resolve([]);
    }

    const startTime = Date.now();

    const invocationPromises = allListeners.map(async (fn) => {
      try {
        await fn(eventObj);
        return { status: "fulfilled" };
      } catch (err) {
        this.metrics.totalErrors += 1;
        console.error(
          `[EventBus Error] Consumer failed handling "${eventType}" (ID: ${eventId}):`,
          err.message
        );
        return { status: "rejected", reason: err.message };
      }
    });

    // Execute in non-blocking fashion
    const executionPromise = Promise.allSettled(invocationPromises).then((results) => {
      const durationMs = Date.now() - startTime;
      this.metrics.totalHandled += results.filter((r) => r.status === "fulfilled").length;

      // Track last 100 latency measurements
      this.metrics.latencies.push(durationMs);
      if (this.metrics.latencies.length > 100) {
        this.metrics.latencies.shift();
      }

      this.recordHistory(eventObj, durationMs, results);
      return results;
    });

    return executionPromise;
  }

  /**
   * Fire-and-forget asynchronous emit.
   * Immediately returns control to HTTP handler so API response is not blocked.
   */
  publish(eventType, payload, meta) {
    // Intentionally un-awaited to ensure non-blocking HTTP cycles
    this.emitAsync(eventType, payload, meta).catch((err) => {
      console.error(`[EventBus Fatal] Unhandled error publishing "${eventType}":`, err);
    });
  }

  /**
   * Save event record in circular buffer
   */
  recordHistory(eventObj, durationMs, consumerResults) {
    this.recentEvents.unshift({
      id: eventObj.id,
      type: eventObj.type,
      timestamp: eventObj.meta.timestamp,
      payloadSummary: this.summarizePayload(eventObj.payload),
      durationMs,
      consumersCount: consumerResults.length,
      successCount: consumerResults.filter((r) => r.value?.status === "fulfilled").length,
      failureCount: consumerResults.filter((r) => r.value?.status === "rejected").length,
    });

    if (this.recentEvents.length > this.maxHistory) {
      this.recentEvents.pop();
    }
  }

  /**
   * Safe payload summary without leaking large binary / sensitive fields
   */
  summarizePayload(payload) {
    if (!payload) return null;
    if (typeof payload !== "object") return payload;
    const summary = {};
    for (const [key, value] of Object.entries(payload)) {
      if (key === "password" || key === "token") continue;
      if (typeof value === "object" && value !== null) {
        summary[key] = value._id || value.id || `[Object: ${Object.keys(value).slice(0, 3).join(",")}]`;
      } else {
        summary[key] = value;
      }
    }
    return summary;
  }

  /**
   * Register an SSE (Server-Sent Events) HTTP response stream
   */
  addSseClient(res) {
    this.sseClients.add(res);
  }

  /**
   * Remove an SSE client on disconnect
   */
  removeSseClient(res) {
    this.sseClients.delete(res);
  }

  /**
   * Broadcast an event payload to all open SSE connections
   */
  broadcastToSse(eventObj) {
    if (this.sseClients.size === 0) return;

    const dataString = `data: ${JSON.stringify(eventObj)}\n\n`;
    for (const client of this.sseClients) {
      try {
        client.write(dataString);
      } catch (err) {
        this.sseClients.delete(client);
      }
    }
  }

  /**
   * Return real-time event bus performance and telemetry statistics
   */
  getMetrics() {
    const latencies = this.metrics.latencies;
    const avgLatency =
      latencies.length > 0
        ? (latencies.reduce((sum, val) => sum + val, 0) / latencies.length).toFixed(2)
        : 0;

    return {
      status: "healthy",
      totalEmitted: this.metrics.totalEmitted,
      totalHandled: this.metrics.totalHandled,
      totalErrors: this.metrics.totalErrors,
      averageDurationMs: Number(avgLatency),
      connectedSseClients: this.sseClients.size,
      byType: this.metrics.byType,
      activeSubscribers: this.eventNames().reduce((acc, name) => {
        acc[name] = this.listenerCount(name);
        return acc;
      }, {}),
      recentEvents: this.recentEvents.slice(0, 15),
    };
  }

  /**
   * Reset telemetry (useful for benchmarking runs)
   */
  resetMetrics() {
    this.metrics = {
      totalEmitted: 0,
      totalHandled: 0,
      totalErrors: 0,
      startedAt: new Date().toISOString(),
      byType: {},
      latencies: [],
    };
    this.recentEvents = [];
  }
}

// Export singleton instance
const eventBus = new EventBus();

module.exports = eventBus;
