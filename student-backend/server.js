const express = require("express");
const app = express();
const PORT = 3000;

let tasks = [];
let nextId = 1;

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  if ((req.method === "POST" || req.method === "PUT") && !req.is("application/json")) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Content-Type header must be application/json for POST/PUT requests",
    });
  }
  next();
});


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


app.get("/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

app.get("/tasks/:id", validateTaskId, (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }
  res.status(200).json({ success: true, data: task });
});

app.post("/tasks", (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Title is required to create a task",
    });
  }

  const newTask = {
    id: nextId++,
    title,
    description: description || "",
    status: status || "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

app.put("/tasks/:id", validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }

  const { title, description, status } = req.body;
  if (title !== undefined) tasks[index].title = title;
  if (description !== undefined) tasks[index].description = description;
  if (status !== undefined) tasks[index].status = status;
  tasks[index].updatedAt = new Date().toISOString();

  res.status(200).json({ success: true, data: tasks[index] });
});

app.delete("/tasks/:id", validateTaskId, (req, res) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({
      error: "Not Found",
      message: `Task with ID ${req.params.id} not found`,
    });
  }

  const [deletedTask] = tasks.splice(index, 1);
  res.status(200).json({ success: true, data: deletedTask });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

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