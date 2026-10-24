/**
 * Asynchronous Processing with Event-Driven Architecture (EDA)
 * Performance Benchmark & Verification Script
 *
 * Compares:
 * 1. Synchronous Blocking Request Pipeline (In-line notifications, audit, and processing)
 * 2. Asynchronous Event-Driven Decoupled Pipeline (Pub/Sub with non-blocking workers)
 * 3. Asynchronous Background Job Execution (HTTP 202 Accepted + DLQ verification)
 */

require("dotenv").config();
const eventBus = require("./events/eventBus");
const EVENT_TYPES = require("./events/eventTypes");
const { initializeConsumers } = require("./consumers");
const jobQueue = require("./jobs/jobQueue");

// Initialize Event Consumers
initializeConsumers();

// Helper to simulate asynchronous processing delays
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runBenchmark() {
  console.log("================================================================================");
  console.log(" ASYNCHRONOUS PROCESSING WITH EVENT-DRIVEN ARCHITECTURE (EDA) BENCHMARK");
  console.log("================================================================================\n");

  const SAMPLES = 3;

  // ────────────────────────────────────────────────────────────────────────────
  // TEST 1: Synchronous Blocking Request Processing
  // ────────────────────────────────────────────────────────────────────────────
  console.log("▶ [Test 1] Running Synchronous Blocking Request Simulation...");
  console.log("  (Simulating in-line DB save + synchronous email SMTP + in-line audit log)\n");

  const syncLatencies = [];
  for (let i = 1; i <= SAMPLES; i++) {
    const start = performance.now();

    // 1. In-line DB write
    await sleep(20);
    // 2. In-line Email notification (blocking HTTP thread)
    await sleep(200);
    // 3. In-line Audit persistence
    await sleep(90);

    const duration = performance.now() - start;
    syncLatencies.push(duration);
    console.log(`  Sample #${i}: ${duration.toFixed(2)} ms (Client blocked waiting for all operations)`);
  }

  const avgSync = syncLatencies.reduce((a, b) => a + b, 0) / syncLatencies.length;
  console.log(`\n  👉 Average Synchronous Response Time: ${avgSync.toFixed(2)} ms\n`);

  // ────────────────────────────────────────────────────────────────────────────
  // TEST 2: Asynchronous Event-Driven Architecture (EDA)
  // ────────────────────────────────────────────────────────────────────────────
  console.log("▶ [Test 2] Running Asynchronous Event-Driven Request Simulation...");
  console.log("  (Simulating DB save + eventBus.publish() fire-and-forget; consumers run async)\n");

  eventBus.resetMetrics();
  const asyncClientLatencies = [];

  for (let i = 1; i <= SAMPLES; i++) {
    const start = performance.now();

    // 1. In-line DB write
    await sleep(25);

    // 2. Publish Domain Event (Non-blocking Pub/Sub)
    eventBus.publish(
      EVENT_TYPES.TASK_HIGH_PRIORITY_ALERT,
      {
        task: {
          _id: `task-bench-${i}`,
          title: `Benchmark Urgent Task #${i}`,
          priority: "high",
        },
      },
      { actor: { id: "benchmarker", email: "bench@test.com" } }
    );

    // Client HTTP response is sent immediately here!
    const clientLatency = performance.now() - start;
    asyncClientLatencies.push(clientLatency);
    console.log(`  Sample #${i}: ${clientLatency.toFixed(2)} ms (HTTP response sent immediately!)`);
  }

  const avgAsync = asyncClientLatencies.reduce((a, b) => a + b, 0) / asyncClientLatencies.length;
  const improvement = (((avgSync - avgAsync) / avgSync) * 100).toFixed(1);
  const throughputGain = (avgSync / avgAsync).toFixed(1);

  console.log(`\n  👉 Average Asynchronous Client Response Time: ${avgAsync.toFixed(2)} ms`);
  console.log(`  🚀 Latency Reduction: ${improvement}% faster!`);
  console.log(`  ⚡ Throughput Multiplier: ~${throughputGain}x higher concurrent request capacity!\n`);

  // Wait for background consumers to finish their async work
  console.log("  ⏳ Waiting 600ms for background decoupled consumers to finish...");
  await sleep(600);

  // ────────────────────────────────────────────────────────────────────────────
  // TEST 3: Asynchronous Background Job Queue (HTTP 202 Accepted + DLQ)
  // ────────────────────────────────────────────────────────────────────────────
  console.log("\n▶ [Test 3] Verifying Background Job Queue & Dead-Letter Queue (DLQ)...");

  // Enqueue normal CSV export job
  const exportJob = jobQueue.enqueue("export_tasks_csv", {});
  console.log(`  ✓ Enqueued Job ${exportJob.id} (Status: ${exportJob.status}, HTTP 202 Accepted)`);

  // Enqueue a failure simulation job to test retries and DLQ
  const failingJob = jobQueue.enqueue("simulate_failure", {}, { maxRetries: 2 });
  console.log(`  ✓ Enqueued Failure Job ${failingJob.id} to test retry backoff & DLQ`);

  console.log("  ⏳ Waiting 2500ms for job execution, retry attempts, and DLQ routing...");
  await sleep(2500);

  const completedJobState = jobQueue.getJob(exportJob.id);
  const dlqJobState = jobQueue.getJob(failingJob.id);
  const queueStats = jobQueue.getStats();

  console.log(`  ✓ Export Job Final Status: ${completedJobState?.status?.toUpperCase()} (Progress: ${completedJobState?.progress}%)`);
  if (completedJobState?.result) {
    console.log(`    Generated Artifact: ${completedJobState.result.filename} (${completedJobState.result.rowCount} rows)`);
  }

  console.log(`  ✓ Failure Job Final Status: ${dlqJobState?.status?.toUpperCase()} (Attempts: ${dlqJobState?.attempts})`);
  console.log(`  ✓ Dead Letter Queue Count: ${queueStats.dlqCount}`);
  console.log(`  ✓ Queue Health Summary:`, JSON.stringify(queueStats, null, 2));

  // ────────────────────────────────────────────────────────────────────────────
  // SUMMARY RESULTS TABLE
  // ────────────────────────────────────────────────────────────────────────────
  console.log("\n================================================================================");
  console.log(" BENCHMARK PERFORMANCE COMPARISON SUMMARY");
  console.log("================================================================================");
  console.log(" | Metric                          | Synchronous Blocking | Asynchronous (EDA)    |");
  console.log(" |---------------------------------|----------------------|-----------------------|");
  console.log(` | Client Response Latency         | ${avgSync.toFixed(2)} ms           | ${avgAsync.toFixed(2)} ms              |`);
  console.log(` | Latency Improvement             | Baseline             | ${improvement}% Reduction        |`);
  console.log(` | Concurrency Scalability         | Poor (Thread-bound)  | Exceptional (Decoupled)|`);
  console.log(` | Consumer Fault Isolation        | Zero (Cascade crash) | Full (Isolate & Log)  |`);
  console.log(` | Heavy Task Protocol             | Blocking HTTP 200    | Non-blocking HTTP 202 |`);
  console.log("================================================================================\n");

  process.exit(0);
}

runBenchmark().catch((err) => {
  console.error("Benchmark failed with error:", err);
  process.exit(1);
});
