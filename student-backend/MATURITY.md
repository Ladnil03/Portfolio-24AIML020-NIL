# Richardson Maturity Model (RMM) Evaluation & API Improvement Report

**Repository**: `student-backend`  
**Project**: Practical 4 Task Management API  
**Date**: August 2026  

---

## 1. Executive Summary

This document evaluates the Task Management API built in Practical 4 (`student-backend`) against Leonard Richardson's **Richardson Maturity Model (RMM)**. The RMM measures the maturity of a Web API across four levels (Level 0 through Level 3) based on its adoption of URIs, standard HTTP verbs, HTTP status codes, and hypermedia controls (HATEOAS).

---

## 2. Richardson Maturity Model Overview

| Level | Name | Description | Key Characteristics |
| :--- | :--- | :--- | :--- |
| **Level 0** | The Swamp of POX | Uses HTTP purely as a transport mechanism for Remote Procedure Calls (RPC). | Single endpoint URI (e.g., `/api`), single HTTP verb (usually `POST`), custom action names in payload. |
| **Level 1** | Resources | Introduces individual URIs for distinct resources instead of a single endpoint. | Multiple URIs (e.g., `/tasks`, `/tasks/1`), but HTTP verbs and status codes are not systematically used. |
| **Level 2** | HTTP Verbs & Status Codes | Uses standard HTTP verbs for CRUD operations and standard HTTP status codes for responses. | Uses `GET` (read), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (delete); proper `200`, `201`, `400`, `404`, `500` status codes. |
| **Level 3** | Hypermedia Controls (HATEOAS) | Enriches responses with hypermedia links enabling dynamic client discovery and state navigation. | Representations include `_links` pointing to related resource URIs and permissible operations. |

---

## 3. Evaluation of original vs. Improved API

### Level 0 Evaluation: **Passed (Exceeded)**
- **Original API**: Did **not** rely on a single endpoint or RPC payload routing.
- **Evaluation**: The original API already surpassed Level 0 because it used dedicated paths (`/tasks` and `/tasks/:id`).

### Level 1 Evaluation: **Passed (Satisfied)**
- **Original API**: Expressed domain entities as addressable resources via distinct URIs:
  - Collection resource: `/tasks`
  - Individual task resource: `/tasks/:id`
- **Evaluation**: Satisfied Level 1 requirements.

### Level 2 Evaluation: **Passed (Satisfied & Enhanced)**
- **Original API**:
  - Used HTTP verbs semantically: `GET` for fetching, `POST` for creation, `PUT` for modification, `DELETE` for removal.
  - Used appropriate status codes: `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`.
- **Identified Gaps & Enhancements**:
  1. **Missing `Location` Header**: On `201 Created` responses, standard REST practice requires a `Location` HTTP header pointing to the newly created resource URI.
  2. **PUT vs. PATCH Semantics**: The original `PUT` endpoint performed partial updates. According to HTTP specifications (RFC 7231 / RFC 5789), `PUT` should represent complete resource replacement, while `PATCH` should handle partial updates.
  3. **Collection Querying**: Missing query parameter support for resource filtering (`GET /tasks?status=completed`).

### Level 3 Evaluation: **Achieved (HATEOAS Added)**
- **Original API**: Did not contain hypermedia links in response objects.
- **Improvement**: Embedded standard HATEOAS `_links` in task resource responses (`self`, `update`, `partialUpdate`, `delete`, `collection`, `create`).

---

## 4. Final Maturity Level Justification

> [!IMPORTANT]
> **Final Rating**: The original Task Management API **satisfied Level 2** of the Richardson Maturity Model. Following our enhancements, the API **fully satisfies Level 2** and incorporates **Level 3 (HATEOAS)** hypermedia controls.

### Justification Breakdown:

1. **Resource URIs (Level 1)**: Distinct URIs exist for collections (`/tasks`) and individual elements (`/tasks/:id`).
2. **HTTP Verbs & Status Codes (Level 2)**:
   - `GET /tasks` -> Retrieves task collection (supports `?status=` filtering). Returns `200 OK`.
   - `GET /tasks/:id` -> Retrieves specific task. Returns `200 OK` or `404 Not Found`.
   - `POST /tasks` -> Creates a task. Returns `201 Created` with a `Location: /tasks/:id` response header.
   - `PUT /tasks/:id` -> Performs full resource update/replacement. Returns `200 OK` or `404 Not Found` / `400 Bad Request`.
   - `PATCH /tasks/:id` -> Performs partial resource update. Returns `200 OK` or `404 Not Found` / `400 Bad Request`.
   - `DELETE /tasks/:id` -> Removes a task. Returns `200 OK` or `404 Not Found`.
3. **Hypermedia Controls (Level 3)**: Each resource representation includes a `_links` metadata section guiding clients on available transitions.

---

## 5. Summary of Implemented API Enhancements

1. **`Location` Header on Creation**:
   Added `res.setHeader('Location', '/tasks/' + newTask.id)` in `POST /tasks`.

2. **Differentiated `PUT` and `PATCH` Endpoints**:
   - `PUT /tasks/:id`: Enforces full body validation (requires `title`).
   - `PATCH /tasks/:id`: Allows partial field updates (`title`, `description`, `status`).

3. **Query Parameter Filtering**:
   Enhanced `GET /tasks` to support `?status=pending` or `?status=completed` queries.

4. **HATEOAS Integration (`_links`)**:
   Enriched JSON responses with hypermedia controls:
   ```json
   {
     "success": true,
     "data": {
       "id": 1,
       "title": "Complete Practical 4",
       "description": "Evaluate and improve API against RMM",
       "status": "pending",
       "createdAt": "2026-08-03T21:49:00.000Z",
       "updatedAt": "2026-08-03T21:49:00.000Z",
       "_links": {
         "self": { "href": "http://localhost:3000/tasks/1", "method": "GET" },
         "update": { "href": "http://localhost:3000/tasks/1", "method": "PUT" },
         "partialUpdate": { "href": "http://localhost:3000/tasks/1", "method": "PATCH" },
         "delete": { "href": "http://localhost:3000/tasks/1", "method": "DELETE" },
         "collection": { "href": "http://localhost:3000/tasks", "method": "GET" }
       }
     }
   }
   ```

---

## 6. API Endpoint Specification

| Method | Endpoint | Status Code | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | `200 OK` | Fetch all tasks (optional `?status=...`) | None |
| `GET` | `/tasks/:id` | `200 OK` / `404` | Fetch task by ID | None |
| `POST` | `/tasks` | `201 Created` / `400` | Create a new task (returns `Location` header) | `{ "title": "...", "description": "...", "status": "..." }` |
| `PUT` | `/tasks/:id` | `200 OK` / `400` / `404` | Full update/replacement of task | `{ "title": "...", "description": "...", "status": "..." }` |
| `PATCH` | `/tasks/:id` | `200 OK` / `400` / `404` | Partial update of task fields | `{ "status": "completed" }` |
| `DELETE` | `/tasks/:id` | `200 OK` / `404` | Delete task by ID | None |

---

## 7. Verification & Testing Instructions

To test the API endpoints and verify RMM compliance, launch the server and execute the following PowerShell commands:

### 1. Start Server
```powershell
node server.js
```

### 2. Create Task (POST with Location header check)
```powershell
$body = @{ title = "Learn RMM"; description = "Evaluate against Richardson Maturity Model" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "http://localhost:3000/tasks" -Method POST -Body $body -ContentType "application/json"
$response.Headers["Location"]
$response.Content
```

### 3. Fetch All Tasks (GET)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks" -Method GET | ConvertTo-Json -Depth 5
```

### 4. Partial Update (PATCH)
```powershell
$patchBody = @{ status = "completed" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method PATCH -Body $patchBody -ContentType "application/json" | ConvertTo-Json -Depth 5
```

### 5. Delete Task (DELETE)
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/tasks/1" -Method DELETE
```
