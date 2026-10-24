const express = require("express");
const eventBus = require("../events/eventBus");
const ActivityLog = require("../models/ActivityLog");
const notificationConsumer = require("../consumers/notificationConsumer");
const analyticsConsumer = require("../consumers/analyticsConsumer");
const jobQueue = require("../jobs/jobQueue");

const router = express.Router();

/**
 * GET /api/events/stream
 * Server-Sent Events (SSE) real-time streaming endpoint.
 * Pushes live domain events and background worker updates directly to connected browsers.
 */
router.get("/stream", (req, res) => {
  // Set SSE HTTP Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders?.();

  // Send initial handshake event
  const initialPayload = {
    type: "connection:open",
    message: "Connected to real-time Event-Driven Architecture stream",
    timestamp: new Date().toISOString(),
  };
  res.write(`data: ${JSON.stringify(initialPayload)}\n\n`);

  // Register client stream with EventBus
  eventBus.addSseClient(res);

  // Keep-alive heartbeat ping every 25 seconds
  const heartbeatInterval = setInterval(() => {
    res.write(`: heartbeat ${Date.now()}\n\n`);
  }, 25000);

  // Clean up on client disconnection
  req.on("close", () => {
    clearInterval(heartbeatInterval);
    eventBus.removeSseClient(res);
    res.end();
  });
});

/**
 * GET /api/events/activities
 * Retrieve paginated asynchronous audit and activity logs from MongoDB
 */
router.get("/activities", async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.eventType) {
      filter.eventType = req.query.eventType;
    }
    if (req.query.entityType) {
      filter.entityType = req.query.entityType;
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/events/metrics
 * Comprehensive telemetry on EventBus throughput, consumers, and background queue
 */
router.get("/metrics", (req, res) => {
  const busMetrics = eventBus.getMetrics();
  const notificationMetrics = notificationConsumer.getMetrics();
  const analyticsMetrics = analyticsConsumer.getAnalytics();
  const queueStats = jobQueue.getStats();

  res.status(200).json({
    success: true,
    data: {
      eventBus: busMetrics,
      notifications: notificationMetrics,
      analytics: analyticsMetrics,
      jobQueue: queueStats,
    },
  });
});

/**
 * POST /api/events/metrics/reset
 * Reset telemetry counters for benchmarking
 */
router.post("/metrics/reset", (req, res) => {
  eventBus.resetMetrics();
  analyticsConsumer.reset();
  res.status(200).json({
    success: true,
    message: "EventBus and analytics metrics reset successfully",
  });
});

module.exports = router;
