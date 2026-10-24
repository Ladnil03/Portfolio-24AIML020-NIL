const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const eventBus = require("../events/eventBus");
const EVENT_TYPES = require("../events/eventTypes");
const Task = require("../models/Task");

/**
 * Enterprise Asynchronous Background Job Queue
 * Implements producer-consumer queue pattern with:
 * - Concurrency throttling
 * - Step-by-step progress reporting (broadcast via EventBus & SSE)
 * - Automatic retries with exponential backoff
 * - Dead Letter Queue (DLQ) for failed jobs
 * - Asynchronous file generation (CSV / JSON exports)
 */
class JobQueue {
  constructor(concurrency = 2) {
    this.concurrency = concurrency;
    this.activeWorkers = 0;

    // Queue storage
    this.queue = [];
    this.jobs = new Map(); // All jobs by ID
    this.deadLetterQueue = new Map(); // Failed jobs exceeding retry limit

    // Directory for generated job artifacts
    this.exportDir = path.join(__dirname, "..", "exports");
    if (!fs.existsSync(this.exportDir)) {
      fs.mkdirSync(this.exportDir, { recursive: true });
    }

    // Handlers registry
    this.handlers = {
      export_tasks_csv: this.handleExportCsv.bind(this),
      export_tasks_json: this.handleExportJson.bind(this),
      batch_analyze_tasks: this.handleBatchAnalysis.bind(this),
      simulate_failure: this.handleSimulatedFailure.bind(this),
    };
  }

  /**
   * Enqueue a new background job. Returns immediately with job metadata (HTTP 202 pattern).
   *
   * @param {string} type - Job type identifier
   * @param {Object} payload - Input payload for job execution
   * @param {Object} [options] - Configuration (maxRetries, priority)
   * @returns {Object} Job descriptor
   */
  enqueue(type, payload = {}, options = {}) {
    if (!this.handlers[type]) {
      throw new Error(`Unsupported job type: "${type}". Supported: ${Object.keys(this.handlers).join(", ")}`);
    }

    const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const job = {
      id: jobId,
      type,
      payload,
      status: "queued", // 'queued' | 'processing' | 'completed' | 'failed' | 'dead_letter'
      progress: 0,
      progressMessage: "Enqueued in background worker pool",
      result: null,
      error: null,
      attempts: 0,
      maxRetries: options.maxRetries ?? 2,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
    };

    this.jobs.set(jobId, job);
    this.queue.push(jobId);

    // Emit event
    eventBus.emitAsync(EVENT_TYPES.JOB_ENQUEUED, {
      jobId,
      type,
      status: "queued",
      queuePosition: this.queue.length,
    });

    // Trigger queue processor asynchronously
    setImmediate(() => this.processNext());

    return job;
  }

  /**
   * Worker loop: picks next job from queue if worker slots are available
   */
  async processNext() {
    if (this.activeWorkers >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const jobId = this.queue.shift();
    const job = this.jobs.get(jobId);
    if (!job) return;

    this.activeWorkers += 1;
    job.status = "processing";
    job.startedAt = new Date().toISOString();
    job.attempts += 1;
    job.progress = 5;
    job.progressMessage = "Worker assigned, starting execution";

    eventBus.emitAsync(EVENT_TYPES.JOB_STARTED, {
      jobId: job.id,
      type: job.type,
      attempt: job.attempts,
    });

    try {
      const handler = this.handlers[job.type];
      const result = await handler(job, (percent, msg) => {
        this.updateProgress(job, percent, msg);
      });

      job.status = "completed";
      job.progress = 100;
      job.progressMessage = "Job finished successfully";
      job.result = result;
      job.completedAt = new Date().toISOString();

      eventBus.emitAsync(EVENT_TYPES.JOB_COMPLETED, {
        jobId: job.id,
        type: job.type,
        result,
        durationMs: new Date(job.completedAt) - new Date(job.startedAt),
      });
    } catch (err) {
      console.error(`[JobQueue] Job ${job.id} failed on attempt ${job.attempts}:`, err.message);
      job.error = err.message;

      if (job.attempts <= job.maxRetries) {
        // Retry with backoff
        job.status = "queued";
        job.progressMessage = `Attempt ${job.attempts} failed. Scheduled for retry...`;
        const backoffMs = Math.pow(2, job.attempts) * 200;

        eventBus.emitAsync(EVENT_TYPES.JOB_RETRY, {
          jobId: job.id,
          attempt: job.attempts,
          nextAttemptInMs: backoffMs,
          error: err.message,
        });

        setTimeout(() => {
          this.queue.push(job.id);
          this.processNext();
        }, backoffMs);
      } else {
        // Retries exhausted -> route to Dead Letter Queue
        job.status = "dead_letter";
        job.progressMessage = `Failed after ${job.attempts} attempts. Routed to Dead-Letter Queue.`;
        job.completedAt = new Date().toISOString();
        this.deadLetterQueue.set(job.id, job);

        eventBus.emitAsync(EVENT_TYPES.JOB_FAILED, {
          jobId: job.id,
          type: job.type,
          error: err.message,
          routedToDlq: true,
        });
      }
    } finally {
      this.activeWorkers -= 1;
      // Continue draining queue
      setImmediate(() => this.processNext());
    }
  }

  /**
   * Update progress of active job and broadcast via event bus
   */
  updateProgress(job, percent, message) {
    job.progress = percent;
    job.progressMessage = message;

    eventBus.emitAsync(EVENT_TYPES.JOB_PROGRESS, {
      jobId: job.id,
      type: job.type,
      progress: percent,
      message,
    });
  }

  // ── Handler Implementations ──────────────────────────────────────────

  /**
   * Handler: Asynchronous Task CSV Export
   */
  async handleExportCsv(job, reportProgress) {
    reportProgress(20, "Querying tasks from database...");
    await new Promise((r) => setTimeout(r, 200));

    let tasks = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      tasks = await Task.find({}).sort({ createdAt: -1 });
    } else {
      tasks = [
        { _id: "6837a1b2c3d4e5f6a7b8c9d0", title: "Complete AWDF Assignment", description: "Event-driven architecture implementation", completed: false, priority: "high", createdAt: new Date() },
        { _id: "6837a1b2c3d4e5f6a7b8c9d1", title: "Setup SSE Consumer", description: "Stream real-time events to frontend", completed: true, priority: "medium", createdAt: new Date() },
        { _id: "6837a1b2c3d4e5f6a7b8c9d2", title: "Verify RMM Level 3", description: "Ensure HATEOAS controls exist", completed: true, priority: "low", createdAt: new Date() }
      ];
    }

    reportProgress(50, `Formatting ${tasks.length} tasks into CSV structure...`);
    await new Promise((r) => setTimeout(r, 200));

    const csvHeaders = "ID,Title,Description,Status,Priority,CreatedAt\n";
    const csvRows = tasks
      .map((t) => {
        const desc = (t.description || "").replace(/"/g, '""').replace(/\n/g, " ");
        const title = (t.title || "").replace(/"/g, '""');
        const status = t.completed ? "Completed" : "Pending";
        return `"${t._id}","${title}","${desc}","${status}","${t.priority}","${t.createdAt.toISOString()}"`;
      })
      .join("\n");

    const fullCsv = csvHeaders + csvRows;

    reportProgress(80, "Writing CSV export file to storage...");
    await new Promise((r) => setTimeout(r, 300));

    const filename = `tasks_export_${job.id}.csv`;
    const filePath = path.join(this.exportDir, filename);
    fs.writeFileSync(filePath, fullCsv, "utf8");

    const stats = fs.statSync(filePath);

    return {
      filename,
      rowCount: tasks.length,
      fileSizeBytes: stats.size,
      downloadUrl: `/api/jobs/${job.id}/download`,
    };
  }

  /**
   * Handler: Asynchronous Task JSON Export
   */
  async handleExportJson(job, reportProgress) {
    reportProgress(25, "Extracting full dataset from database...");
    await new Promise((r) => setTimeout(r, 150));

    let tasks = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      tasks = await Task.find({}).sort({ createdAt: -1 });
    } else {
      tasks = [
        { _id: "6837a1b2c3d4e5f6a7b8c9d0", title: "Complete AWDF Assignment", description: "Event-driven architecture implementation", completed: false, priority: "high", createdAt: new Date() },
        { _id: "6837a1b2c3d4e5f6a7b8c9d1", title: "Setup SSE Consumer", description: "Stream real-time events to frontend", completed: true, priority: "medium", createdAt: new Date() }
      ];
    }

    reportProgress(60, "Serializing dataset with metadata...");
    await new Promise((r) => setTimeout(r, 200));

    const exportData = {
      exportedAt: new Date().toISOString(),
      count: tasks.length,
      tasks: tasks.map((t) => ({
        id: t._id,
        title: t.title,
        description: t.description,
        completed: t.completed,
        priority: t.priority,
        createdAt: t.createdAt,
      })),
    };

    reportProgress(85, "Writing JSON dump to disk...");
    await new Promise((r) => setTimeout(r, 200));

    const filename = `tasks_export_${job.id}.json`;
    const filePath = path.join(this.exportDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2), "utf8");

    const stats = fs.statSync(filePath);

    return {
      filename,
      rowCount: tasks.length,
      fileSizeBytes: stats.size,
      downloadUrl: `/api/jobs/${job.id}/download`,
    };
  }

  /**
   * Handler: Asynchronous Batch Analysis & Prioritization
   */
  async handleBatchAnalysis(job, reportProgress) {
    reportProgress(20, "Loading task records...");
    await new Promise((r) => setTimeout(r, 300));

    const tasks = await Task.find({});
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;

    reportProgress(50, "Calculating priority distributions and velocity...");
    await new Promise((r) => setTimeout(r, 400));

    const highPriorityPending = tasks.filter((t) => t.priority === "high" && !t.completed).length;
    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    reportProgress(80, "Generating operational recommendations...");
    await new Promise((r) => setTimeout(r, 300));

    return {
      totalTasks: total,
      completedTasks: completed,
      pendingTasks: total - completed,
      highPriorityPending,
      completionRate: `${completionRate}%`,
      systemHealth: highPriorityPending > 5 ? "WARNING" : "HEALTHY",
      recommendedAction:
        highPriorityPending > 0
          ? `Address ${highPriorityPending} urgent items before adding new tasks.`
          : "Workload balanced.",
    };
  }

  /**
   * Handler: Simulated Failure to demonstrate Retry & DLQ
   */
  async handleSimulatedFailure(job, reportProgress) {
    reportProgress(30, "Simulating unstable remote microservice...");
    await new Promise((r) => setTimeout(r, 200));
    throw new Error("Simulated upstream timeout: 504 Gateway Timeout from external payment gateway");
  }

  // ── Public Accessors ─────────────────────────────────────────────────

  getJob(jobId) {
    return this.jobs.get(jobId) || this.deadLetterQueue.get(jobId) || null;
  }

  getJobArtifactPath(jobId) {
    const job = this.getJob(jobId);
    if (!job || !job.result?.filename) return null;
    const filePath = path.join(this.exportDir, job.result.filename);
    return fs.existsSync(filePath) ? filePath : null;
  }

  listJobs() {
    return Array.from(this.jobs.values()).slice(-30).reverse();
  }

  getStats() {
    let queued = 0;
    let processing = 0;
    let completed = 0;
    let failed = 0;

    for (const job of this.jobs.values()) {
      if (job.status === "queued") queued += 1;
      else if (job.status === "processing") processing += 1;
      else if (job.status === "completed") completed += 1;
      else if (job.status === "failed" || job.status === "dead_letter") failed += 1;
    }

    return {
      activeWorkers: this.activeWorkers,
      maxConcurrency: this.concurrency,
      queued,
      processing,
      completed,
      failed,
      dlqCount: this.deadLetterQueue.size,
      totalJobs: this.jobs.size,
    };
  }
}

// Singleton instance
const jobQueue = new JobQueue(2);

module.exports = jobQueue;
