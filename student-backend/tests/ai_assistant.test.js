const test = require('node:test');
const assert = require('node:assert/strict');
const { suggestTaskDetails, generateRuleBasedSuggestion } = require('../services/aiService');

test('AI Assistant Service - Resilience & Heuristic Intelligence', async (t) => {
  await t.test('should intelligently suggest high priority and 1-day deadline for urgent tasks', async () => {
    const urgentResult = await suggestTaskDetails('Critical bug fix: database connection dropping');
    assert.equal(urgentResult.suggestedPriority, 'high');
    assert.equal(urgentResult.estimatedDays, 1);
    assert.ok(urgentResult.suggestedDescription.length > 10);
    assert.ok(Array.isArray(urgentResult.checklist));
    assert.equal(urgentResult.checklist.length, 3);
  });

  await t.test('should suggest low priority and longer timeframe for learning/research tasks', async () => {
    const lowResult = await suggestTaskDetails('Learn and research WebAssembly performance');
    assert.equal(lowResult.suggestedPriority, 'low');
    assert.equal(lowResult.estimatedDays, 7);
    assert.ok(lowResult.reasoning.includes('Low urgency'));
  });

  await t.test('should handle standard tasks with medium priority and valid formatted due date', async () => {
    const medResult = await suggestTaskDetails('Prepare presentation slides for portfolio project');
    assert.equal(medResult.suggestedPriority, 'medium');
    assert.match(medResult.suggestedDueDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(medResult.suggestedDescription.includes('Prepare presentation slides for portfolio project'));
  });

  await t.test('should guarantee graceful degradation and never throw on empty context', () => {
    const fallback = generateRuleBasedSuggestion('General task update');
    assert.ok(fallback.source === 'smart-engine');
    assert.equal(fallback.suggestedPriority, 'medium');
  });
});
