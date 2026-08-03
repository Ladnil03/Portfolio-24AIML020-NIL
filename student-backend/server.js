const express = require("express");
const app = express();
const PORT = 3000;

let tasks = [];
let nextId = 1;

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// JSON Content-Type validation middleware for mutation requests
app.use((req, res, next) => {
  if (["POST", "PUT", "PATCH"].includes(req.method) && !req.is("application/json")) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Content-Type header must be application/json for POST, PUT, and PATCH requests",
    });
  }
  next();
});

// ID Validation middleware
function validateTaskId(req, res, next) {
  const { id } = req.params;
  if (!/^\d+$/.test(id) || Number(id) <= 0) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid task ID format: "${id}". ID must be a positive integer.`,
    });
  }
  req.params.id = Number(id);
  next();
}

// Helper function to attach HATEOAS hypermedia links (Richardson Maturity Level 3)
function addHypermediaLinks(task, req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return {
    ...task,
    _links: {
      self: { href: `${baseUrl}/tasks/${task.id}`, method: "GET" },
      update: { href: `${baseUrl}/tasks/${task.id}`, method: "PUT" },
      partialUpdate: { href: `${baseUrl}/tasks/${task.id}`, method: "PATCH" },
      delete: { href: `${baseUrl}/tasks/${task.id}`, method: "DELETE" },
      collection: { href: `${baseUrl}/tasks`, method: "GET" },
    },
  };
}

// GET /tasks - Fetch all tasks (supports optional ?status= filtering)
app.get("/tasks", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  let result = tasks;

  if (req.query.status) {
    result = tasks.filter(
      (t) => t.status.toLowerCase() === req.query.status.toLowerCase()
    );
  }

  const tasksWithLinks = result.map((task) => addHypermediaLinks(task, req));

  res.status(200).json({
    success: true,
    count: tasksWithLinks.length,
    data: tasksWithLinks,
    _links: {
      self: { href: `${baseUrl}${req.originalUrl}`, method: "GET" },
      create: { href: `${baseUrl}/tasks`, method: "POST" },
    },
  });
});

// GET /tasks/:id - Fetch single task by ID
app.get("/tasks/:id", validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }
  res.status(200).json({ success: true, data: addHypermediaLinks(task, req) });
});

// POST /tasks - Create a new task (Sets Location header for Level 2 REST compliance)
app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Title is required to create a task and must be a non-empty string",
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description || "",
    status: status || "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  const resourceUrl = `/tasks/${newTask.id}`;
  res.setHeader("Location", resourceUrl);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: addHypermediaLinks(newTask, req),
  });
});

// PUT /tasks/:id - Full resource update/replacement
app.put("/tasks/:id", validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }

  const { title, description, status } = req.body;
  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Title is required for full resource update (PUT)",
    });
  }

  tasks[index] = {
    id: req.params.id,
    title: title.trim(),
    description: description !== undefined ? description : "",
    status: status || "pending",
    createdAt: tasks[index].createdAt,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: addHypermediaLinks(tasks[index], req),
  });
});

// PATCH /tasks/:id - Partial resource update
app.patch("/tasks/:id", validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }

  const { title, description, status } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Title must be a non-empty string",
      });
    }
    tasks[index].title = title.trim();
  }

  if (description !== undefined) {
    tasks[index].description = description;
  }

  if (status !== undefined) {
    tasks[index].status = status;
  }

  tasks[index].updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    message: "Task partially updated successfully",
    data: addHypermediaLinks(tasks[index], req),
  });
});

// DELETE /tasks/:id - Remove task
app.delete("/tasks/:id", validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }

  const [deletedTask] = tasks.splice(index, 1);
  res.status(200).json({
    success: true,
    message: `Task with ID ${req.params.id} deleted successfully`,
    data: addHypermediaLinks(deletedTask, req),
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Task Management API running on http://localhost:${PORT}`);
});