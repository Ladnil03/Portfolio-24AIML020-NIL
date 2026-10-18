const jwt = require("jsonwebtoken");
require("dotenv").config();

const token = jwt.sign(
  { id: "benchmarker-123", email: "benchmark@test.com" },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

async function runBenchmark() {
  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  console.log("==================================================");
  console.log("   API IN-MEMORY CACHING BENCHMARK REPORT         ");
  console.log("==================================================");

  // 1. Initial debug status
  const initDebug = await (await fetch("http://localhost:3000/api/cache/debug")).json();
  console.log("\n[1] Initial Cache Status:", initDebug.data);

  // Reset metrics
  await fetch("http://localhost:3000/api/cache/debug/reset", { method: "POST" });

  // 2. Measure GET /tasks Uncached vs Cached
  console.log("\n[2] Benchmarking GET /tasks (All Tasks)");
  console.log("-----------------------------------------");

  // Fetch list of tasks first
  const initialReq = await fetch("http://localhost:3000/tasks", { headers });
  const initialData = await initialReq.json();
  let sampleTaskId = null;
  if (initialData.data && initialData.data.length > 0) {
    sampleTaskId = initialData.data[0].id || initialData.data[0]._id;
  }

  // A. Uncached Readings (Force miss by invalidating with a dummy PATCH or checking fresh)
  const uncachedReadings = [];
  for (let i = 1; i <= 3; i++) {
    // Invalidate cache by updating a task or creating one
    if (sampleTaskId) {
      await fetch(`http://localhost:3000/tasks/${sampleTaskId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ priority: i % 2 === 0 ? "high" : "medium" }),
      });
    }

    const t0 = performance.now();
    const res = await fetch("http://localhost:3000/tasks", { headers });
    const t1 = performance.now();
    const xCache = res.headers.get("x-cache");
    const duration = parseFloat((t1 - t0).toFixed(2));
    uncachedReadings.push(duration);
    console.log(`  Uncached Sample ${i}: ${duration.toFixed(2)} ms | X-Cache: ${xCache} | Status: ${res.status}`);
  }

  // B. Cached Readings
  const cachedReadings = [];
  for (let i = 1; i <= 3; i++) {
    const t0 = performance.now();
    const res = await fetch("http://localhost:3000/tasks", { headers });
    const t1 = performance.now();
    const xCache = res.headers.get("x-cache");
    const duration = parseFloat((t1 - t0).toFixed(2));
    cachedReadings.push(duration);
    console.log(`  Cached Sample ${i}:   ${duration.toFixed(2)} ms | X-Cache: ${xCache} | Status: ${res.status}`);
  }

  const avgUncached = (uncachedReadings.reduce((a, b) => a + b, 0) / uncachedReadings.length).toFixed(2);
  const avgCached = (cachedReadings.reduce((a, b) => a + b, 0) / cachedReadings.length).toFixed(2);
  console.log(`  -> Average Uncached: ${avgUncached} ms`);
  console.log(`  -> Average Cached:   ${avgCached} ms`);
  console.log(`  -> Latency Reduction: ${((1 - avgCached / avgUncached) * 100).toFixed(1)}%`);

  // 3. Measure GET /tasks/:id Single-Task Endpoint
  console.log("\n[3] Benchmarking GET /tasks/:id (Single Task)");
  console.log("-----------------------------------------------");
  if (sampleTaskId) {
    const singleUncached = [];
    for (let i = 1; i <= 3; i++) {
      // Invalidate single task cache
      await fetch(`http://localhost:3000/tasks/${sampleTaskId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ priority: i % 2 === 0 ? "low" : "medium" }),
      });

      const t0 = performance.now();
      const res = await fetch(`http://localhost:3000/tasks/${sampleTaskId}`, { headers });
      const t1 = performance.now();
      const xCache = res.headers.get("x-cache");
      const duration = parseFloat((t1 - t0).toFixed(2));
      singleUncached.push(duration);
      console.log(`  Uncached Single Sample ${i}: ${duration.toFixed(2)} ms | X-Cache: ${xCache}`);
    }

    const singleCached = [];
    for (let i = 1; i <= 3; i++) {
      const t0 = performance.now();
      const res = await fetch(`http://localhost:3000/tasks/${sampleTaskId}`, { headers });
      const t1 = performance.now();
      const xCache = res.headers.get("x-cache");
      const duration = parseFloat((t1 - t0).toFixed(2));
      singleCached.push(duration);
      console.log(`  Cached Single Sample ${i}:   ${duration.toFixed(2)} ms | X-Cache: ${xCache}`);
    }

    const avgSingleUncached = (singleUncached.reduce((a, b) => a + b, 0) / singleUncached.length).toFixed(2);
    const avgSingleCached = (singleCached.reduce((a, b) => a + b, 0) / singleCached.length).toFixed(2);
    console.log(`  -> Single Average Uncached: ${avgSingleUncached} ms`);
    console.log(`  -> Single Average Cached:   ${avgSingleCached} ms`);
    console.log(`  -> Single Latency Reduction: ${((1 - avgSingleCached / avgSingleUncached) * 100).toFixed(1)}%`);
  }

  // 4. Test Invalidation on write operation (POST / PUT / DELETE)
  console.log("\n[4] Invalidation Verification");
  console.log("-------------------------------");
  // Prime cache
  await fetch("http://localhost:3000/tasks", { headers });
  let preKeys = (await (await fetch("http://localhost:3000/api/cache/debug")).json()).data.cachedKeys;
  console.log("  Cache keys before write:", preKeys);

  // Trigger POST write operation
  const createRes = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers,
    body: JSON.stringify({
      title: "Cache Invalidation Test Task",
      description: "Verifying that POST invalidates list cache",
      priority: "medium",
    }),
  });
  const createdData = await createRes.json();
  const createdId = createdData.data.id || createdData.data._id;
  console.log(`  Created test task ${createdId} (Status: ${createRes.status})`);

  let postKeys = (await (await fetch("http://localhost:3000/api/cache/debug")).json()).data.cachedKeys;
  console.log("  Cache keys after POST write (invalidated):", postKeys);

  const checkGet = await fetch("http://localhost:3000/tasks", { headers });
  console.log("  Subsequent GET /tasks header X-Cache:", checkGet.headers.get("x-cache"), "(Fresh from DB)");

  // Cleanup created task (triggers DELETE invalidation)
  if (createdId) {
    const delRes = await fetch(`http://localhost:3000/tasks/${createdId}`, {
      method: "DELETE",
      headers,
    });
    console.log(`  Deleted test task ${createdId} (Status: ${delRes.status})`);
  }

  // 5. Final Cache Debug Endpoint Output
  console.log("\n[5] Debug Endpoint Response (/api/cache/debug):");
  console.log("-------------------------------------------------");
  const finalDebug = await (await fetch("http://localhost:3000/api/cache/debug")).json();
  console.log(JSON.stringify(finalDebug, null, 2));
}

runBenchmark().catch(console.error);
