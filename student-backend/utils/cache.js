const NodeCache = require("node-cache");

// Default TTL is 60 seconds, checkperiod 120 seconds
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

// Hit / Miss metrics counter
const metrics = {
  hits: 0,
  misses: 0,
  totalRequests: 0,
};

function recordHit() {
  metrics.hits += 1;
  metrics.totalRequests += 1;
}

function recordMiss() {
  metrics.misses += 1;
  metrics.totalRequests += 1;
}

function getMetrics() {
  const hitRatio =
    metrics.totalRequests > 0
      ? ((metrics.hits / metrics.totalRequests) * 100).toFixed(2) + "%"
      : "0%";

  return {
    hits: metrics.hits,
    misses: metrics.misses,
    totalRequests: metrics.totalRequests,
    hitRatio,
    cachedKeys: cache.keys(),
    stats: cache.getStats(),
  };
}

function resetMetrics() {
  metrics.hits = 0;
  metrics.misses = 0;
  metrics.totalRequests = 0;
}

/**
 * Invalidate cache:
 * Clears all-tasks list cache keys and optionally a specific single-task key
 * @param {string} [taskId] - Optional specific task ID to invalidate
 */
function invalidateTasksCache(taskId = null) {
  const keys = cache.keys();
  // Clear any task list queries (e.g. tasks:all, tasks:query:...)
  const keysToDelete = keys.filter((key) => key.startsWith("tasks:"));

  if (taskId) {
    keysToDelete.push(`task:${taskId}`);
  }

  // Deduplicate and delete
  const uniqueKeys = [...new Set(keysToDelete)];
  if (uniqueKeys.length > 0) {
    cache.del(uniqueKeys);
  }
}

module.exports = {
  cache,
  recordHit,
  recordMiss,
  getMetrics,
  resetMetrics,
  invalidateTasksCache,
};
