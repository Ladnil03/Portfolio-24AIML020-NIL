# CI/CD Pipeline & Automated Testing Report

## 1. Overview
This report documents the continuous integration (CI) pipeline setup using **GitHub Actions** for the Task Management Application. The workflow triggers on every push and pull request targeting the `main` branch, automates dependency installation, executes automated tests, builds the application, and surfaces status feedback.

---

## 2. GitHub Actions Workflow Configuration
File: [`.github/workflows/ci.yml`](file:///d:/AWDF/Week1/.github/workflows/ci.yml)

```yaml
name: Task Management CI Pipeline

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  backend-test:
    name: Backend Build & Test
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: student-backend

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: student-backend/package-lock.json

      - name: Install Dependencies
        run: npm install

      - name: Run Automated Tests
        run: npm test

  frontend-build:
    name: Frontend Lint & Build
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: Student-portfolio

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
          cache-dependency-path: Student-portfolio/package-lock.json

      - name: Install Dependencies
        run: npm install

      - name: Build Frontend Application
        run: npm run build
```

---

## 3. Automated Test Suite Setup
Created unit test suite: [`student-backend/tests/task_cache.test.js`](file:///d:/AWDF/Week1/student-backend/tests/task_cache.test.js)  
Updated [`student-backend/package.json`](file:///d:/AWDF/Week1/student-backend/package.json) test script:
```json
"scripts": {
  "test": "node --test tests/*.test.js"
}
```

The automated tests validate:
1. **Cache metrics & hit-rate calculation**: Verifies cache hits, misses, and ratio calculations.
2. **Task cache invalidation**: Verifies specific task keys and wildcard prefixes (`tasks:*`) are invalidated upon mutations.
3. **Domain Event integrity**: Verifies EDA event topics (`task:created`, `task:updated`, etc.).

---

## 4. Pipeline Failure Demonstration (Deliberately Broken Test)

### Broken Test Snippet
```javascript
test('Domain Event Types integrity', () => {
  // DELIBERATE FAILURE DEMONSTRATION: Expected value is intentionally wrong
  assert.equal(EVENT_TYPES.TASK_CREATED, 'invalid_task_event_type');
  assert.equal(EVENT_TYPES.TASK_UPDATED, 'task:updated');
});
```

### CI / Test Output (Exit Code 1)
```
> student-backend@1.0.0 test
> node --test tests/*.test.js

▶ Cache utility operations
  ✔ should record hits and misses and calculate hit ratio (0.5648ms)
  ✔ should store and invalidate task cache entries (1.2604ms)
✔ Cache utility operations (2.5029ms)
✖ Domain Event Types integrity (0.9243ms)
ℹ tests 4
ℹ suites 0
ℹ pass 3
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 86.6618

✖ failing tests:

test at tests\task_cache.test.js:36:1
✖ Domain Event Types integrity (0.9243ms)
  AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
  + actual - expected
  
  + 'task:created'
  - 'invalid_task_event_type'
```
**Result**: The pipeline terminates with exit code `1`, blocking merge/deployment and alerting developers immediately.

---

## 5. Pipeline Fix Demonstration (Passing Test Suite)

### Corrected Test Snippet
```javascript
test('Domain Event Types integrity', () => {
  // Corrected assertion: Passes cleanly
  assert.equal(EVENT_TYPES.TASK_CREATED, 'task:created');
  assert.equal(EVENT_TYPES.TASK_UPDATED, 'task:updated');
  assert.equal(EVENT_TYPES.TASK_DELETED, 'task:deleted');
  assert.equal(EVENT_TYPES.TASK_STATUS_CHANGED, 'task:status_changed');
});
```

### CI / Test Output (Exit Code 0)
```
> student-backend@1.0.0 test
> node --test tests/*.test.js

▶ Cache utility operations
  ✔ should record hits and misses and calculate hit ratio (0.5559ms)
  ✔ should store and invalidate task cache entries (1.3174ms)
✔ Cache utility operations (2.5587ms)
✔ Domain Event Types integrity (0.1432ms)
ℹ tests 4
ℹ suites 0
ℹ pass 4
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 82.6067
```
**Result**: All 4 tests pass cleanly, returning exit code `0`, allowing the CI workflow to succeed with a green checkmark.
