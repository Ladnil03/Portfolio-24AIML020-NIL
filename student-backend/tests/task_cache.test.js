const test = require('node:test');
const assert = require('node:assert/strict');
const { cache, recordHit, recordMiss, getMetrics, resetMetrics, invalidateTasksCache } = require('../utils/cache');
const EVENT_TYPES = require('../events/eventTypes');

test('Cache utility operations', async (t) => {
  await t.test('should record hits and misses and calculate hit ratio', () => {
    resetMetrics();
    recordHit();
    recordHit();
    recordMiss();

    const metrics = getMetrics();
    assert.equal(metrics.hits, 2);
    assert.equal(metrics.misses, 1);
    assert.equal(metrics.totalRequests, 3);
    assert.equal(metrics.hitRatio, '66.67%');
  });

  await t.test('should store and invalidate task cache entries', () => {
    cache.flushAll();
    cache.set('tasks:all', [{ id: '1', title: 'Task 1' }]);
    cache.set('tasks:user:123', [{ id: '1' }]);
    cache.set('task:999', { id: '999', title: 'Task 999' });
    cache.set('other:key', 'value');

    invalidateTasksCache('999');

    assert.equal(cache.get('tasks:all'), undefined);
    assert.equal(cache.get('tasks:user:123'), undefined);
    assert.equal(cache.get('task:999'), undefined);
    assert.equal(cache.get('other:key'), 'value');
  });
});

test('Domain Event Types integrity', () => {
  // Corrected assertion: Passes cleanly
  assert.equal(EVENT_TYPES.TASK_CREATED, 'task:created');
  assert.equal(EVENT_TYPES.TASK_UPDATED, 'task:updated');
  assert.equal(EVENT_TYPES.TASK_DELETED, 'task:deleted');
  assert.equal(EVENT_TYPES.TASK_STATUS_CHANGED, 'task:status_changed');
});
