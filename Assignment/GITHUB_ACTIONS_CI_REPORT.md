# Practical Lab File: GitHub Actions CI/CD Pipeline & Automated Testing

**Course**: Advanced Web Development Frameworks (AWDF)  
**Topic**: Continuous Integration and Continuous Deployment (CI/CD) with GitHub Actions  
**Application**: Task Management & Student Portfolio  
**Date**: October 2026  
**Status**: Completed & Verified  

---

## 1. Objective of the Practical
1. **Automated CI/CD Workflow Setup**: Design and configure a declarative GitHub Actions workflow for the Task Management system that automatically triggers on every `push` and `pull_request` targeting the `main` branch.
2. **Explicit Dependency Installation**: Integrate explicit step-by-step installation of dependencies (`npm install`) with cache validation.
3. **Automated Unit Testing & Validation**: Develop an automated unit test suite and execute `npm test` reporting an explicit pass/fail exit status code.
4. **Failure Pipeline Simulation**: Intentionally break an automated test assertion to demonstrate pipeline failure (Exit Code 1), preventing erroneous code merges.
5. **Recovery & Passing Pipeline**: Correct the broken test assertion and demonstrate a clean, successful pipeline run (Exit Code 0).

---

## 2. CI/CD Architecture & Workflow Design

```mermaid
graph TD
    A[Developer Pushes to main Branch] --> B[GitHub Actions Runner Initiates]
    
    subgraph "Job 1: Backend Build & Test (ubuntu-latest)"
        C1[Checkout Repository] --> C2[Setup Node.js 20 & npm Cache]
        C2 --> C3[Install Backend Dependencies: npm install]
        C3 --> C4[Execute Automated Unit Tests: npm test]
        C4 -->|Assertion Fails| C5[Pipeline Status: FAILED (Exit Code 1)]
        C4 -->|Assertions Pass| C6[Pipeline Status: SUCCESS (Exit Code 0)]
    end

    subgraph "Job 2: Frontend Lint & Build (ubuntu-latest)"
        D1[Checkout Repository] --> D2[Setup Node.js 20 & npm Cache]
        D2 --> D3[Install Frontend Dependencies: npm install]
        D3 --> D4[Production Build: npm run build]
        D4 --> D5[Vite Production Bundle Verification]
    end
```

---

## 3. Configuration & Implementation

### 3.1 GitHub Actions Workflow (`.github/workflows/ci.yml`)
Path: [`.github/workflows/ci.yml`](file:///d:/AWDF/Week1/.github/workflows/ci.yml)

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

### 3.2 Automated Unit Test File (`student-backend/tests/task_cache.test.js`)
Path: [`student-backend/tests/task_cache.test.js`](file:///d:/AWDF/Week1/student-backend/tests/task_cache.test.js)

```javascript
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
  assert.equal(EVENT_TYPES.TASK_CREATED, 'task:created');
  assert.equal(EVENT_TYPES.TASK_UPDATED, 'task:updated');
  assert.equal(EVENT_TYPES.TASK_DELETED, 'task:deleted');
  assert.equal(EVENT_TYPES.TASK_STATUS_CHANGED, 'task:status_changed');
});
```

### 3.3 Test Command in `package.json`
Path: [`student-backend/package.json`](file:///d:/AWDF/Week1/student-backend/package.json)
```json
"scripts": {
  "test": "node --test tests/*.test.js",
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## 4. Verification Screenshots for Practical Submission

The following 5 verification screenshots have been captured and saved to the [`screenshot/`](file:///d:/AWDF/Week1/screenshot) directory:

| Screenshot # | Name / Label | Description | Image File |
|---|---|---|---|
| **Screenshot 1** | **Workflow File Setup** | GitHub Actions YAML file (`.github/workflows/ci.yml`) triggering on push to `main` with explicit `npm install` and `npm test` steps. | [`screenshot1_github_actions_workflow.png`](file:///d:/AWDF/Week1/screenshot/screenshot1_github_actions_workflow.png) |
| **Screenshot 2** | **Test Script Definition** | `student-backend/package.json` showing the configured automated test runner script. | [`screenshot2_test_script_package_json.png`](file:///d:/AWDF/Week1/screenshot/screenshot2_test_script_package_json.png) |
| **Screenshot 3** | **Deliberately Broken Test** | Test assertion deliberately expecting an invalid value (`invalid_task_event_type`) to simulate a code defect. | [`screenshot3_deliberately_broken_test.png`](file:///d:/AWDF/Week1/screenshot/screenshot3_deliberately_broken_test.png) |
| **Screenshot 4** | **Pipeline Failure Run** | Terminal test output showing explicit test failure report (`✖ fail 1`, Exit Code 1) preventing erroneous merges. | [`screenshot4_pipeline_failed_demonstration.png`](file:///d:/AWDF/Week1/screenshot/screenshot4_pipeline_failed_demonstration.png) |
| **Screenshot 5** | **Fixed Pipeline Passing Run** | Terminal test output showing all 4 unit tests passing cleanly (`✔ pass 4, fail 0`, Exit Code 0). | [`screenshot5_pipeline_fixed_passing.png`](file:///d:/AWDF/Week1/screenshot/screenshot5_pipeline_fixed_passing.png) |

---

### Screenshot 1: GitHub Actions CI Workflow Setup
![Screenshot 1: GitHub Actions CI Workflow](file:///d:/AWDF/Week1/screenshot/screenshot1_github_actions_workflow.png)

### Screenshot 2: Package.json Configuration & Test Script
![Screenshot 2: Package.json Test Script](file:///d:/AWDF/Week1/screenshot/screenshot2_test_script_package_json.png)

### Screenshot 3: Deliberately Broken Test Assertion
![Screenshot 3: Deliberately Broken Test](file:///d:/AWDF/Week1/screenshot/screenshot3_deliberately_broken_test.png)

### Screenshot 4: Pipeline Failure Demonstration (Exit Code 1)
![Screenshot 4: Pipeline Failure Demonstration](file:///d:/AWDF/Week1/screenshot/screenshot4_pipeline_failed_demonstration.png)

### Screenshot 5: Pipeline Fixed & Passing (Exit Code 0)
![Screenshot 5: Pipeline Fixed & Passing](file:///d:/AWDF/Week1/screenshot/screenshot5_pipeline_fixed_passing.png)

---

## 5. Execution Proof & Verification Logs

### 5.1 Test Failure Output (Deliberate Error)
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

### 5.2 Test Success Output (Fixed Test)
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

---

## 6. Key Learnings & Conclusion
- Continuous Integration ensures code quality by automatically validating every change before it enters production.
- Automated tests prevent regression and breakages from slipping through.
- Defining dependencies installation (`npm install`) with cache mechanisms speeds up pipeline execution and provides deterministic reproducible builds.
- Clear pass/fail exit codes (`0` vs `1`) enable the CI orchestrator to immediately halt and protect downstream deployment stages.
