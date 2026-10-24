const express = require("express");
const path = require("path");
const fs = require("fs");
const jobQueue = require("../jobs/jobQueue");

const router = express.Router();

/**
 * POST /api/jobs
 * Enqueue a heavy or long-running operation for asynchronous background processing.
 * Demonstrates standard RESTful HTTP 202 Accepted pattern.
 */
router.post("/", (req, res) => {
  const { type, payload = {}, options = {} } = req.body;

  if (!type) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Job 'type' is required (e.g., 'export_tasks_csv', 'export_tasks_json', 'batch_analyze_tasks', 'simulate_failure')",
    });
  }

  try {
    const job = jobQueue.enqueue(type, payload, options);

    const statusUrl = `/api/jobs/${job.id}`;
    res.setHeader("Location", statusUrl);

    // Return HTTP 202 Accepted immediately
    res.status(202).json({
      success: true,
      message: "Job accepted and enqueued for asynchronous background processing",
      data: {
        jobId: job.id,
        type: job.type,
        status: job.status,
        progress: job.progress,
        progressMessage: job.progressMessage,
        createdAt: job.createdAt,
        checkStatusUrl: statusUrl,
        eventsStreamUrl: "/api/events/stream",
      },
    });
  } catch (err) {
    return res.status(400).json({
      error: "Bad Request",
      message: err.message,
    });
  }
});

/**
 * GET /api/jobs
 * List recent background jobs and overall queue health statistics
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    stats: jobQueue.getStats(),
    data: jobQueue.listJobs(),
  });
});

/**
 * GET /api/jobs/:id
 * Poll/Check status and progress of a background job
 */
router.get("/:id", (req, res) => {
  const job = jobQueue.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({
      error: "Not Found",
      message: `Background job with ID "${req.params.id}" not found`,
    });
  }

  res.status(200).json({
    success: true,
    data: job,
  });
});

/**
 * GET /api/jobs/:id/download
 * Download the generated artifact (e.g. CSV, JSON) of a completed job
 */
router.get("/:id/download", (req, res) => {
  const job = jobQueue.getJob(req.params.id);
  if (!job) {
    return res.status(404).json({
      error: "Not Found",
      message: `Job ${req.params.id} not found`,
    });
  }

  if (job.status !== "completed") {
    return res.status(400).json({
      error: "Bad Request",
      message: `Cannot download artifact: job status is "${job.status}" (must be "completed")`,
    });
  }

  const filePath = jobQueue.getJobArtifactPath(req.params.id);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({
      error: "Not Found",
      message: "Artifact file does not exist on server storage",
    });
  }

  const filename = job.result?.filename || path.basename(filePath);
  res.download(filePath, filename);
});

module.exports = router;
