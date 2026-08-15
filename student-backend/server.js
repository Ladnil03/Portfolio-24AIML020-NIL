require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskdb";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Location"],
  })
);

app.use(express.json());

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected successfully to MongoDB at ${MONGODB_URI}`);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Task Schema Definition
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required and must be a non-empty string"],
    },
    description: {
      type: String,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "`{VALUE}` is not a valid priority. Allowed values: 'low', 'medium', 'high'",
      },
      default: "medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

// Pre-save hook that automatically trims whitespace from the title field
taskSchema.pre("save", function () {
  if (this.title && typeof this.title === "string") {
    this.title = this.title.trim();
  }
});

// Task Model
const Task = mongoose.model("Task", taskSchema);

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

// ID Validation middleware for Mongoose ObjectId
function validateTaskId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Bad Request",
      message: `Invalid task ID format: "${id}". Must be a valid 24-character hexadecimal ObjectId.`,
    });
  }
  next();
}

// Helper function to format Mongoose validation errors into structured JSON
function formatValidationError(err) {
  if (err.name === "ValidationError") {
    const formattedErrors = {};
    for (const field in err.errors) {
      formattedErrors[field] = err.errors[field].message;
    }
    return {
      error: "Validation Error",
      message: err.message,
      errors: formattedErrors,
    };
  }
  return {
    error: "Bad Request",
    message: err.message,
  };
}

// Helper function to attach HATEOAS hypermedia links (Richardson Maturity Level 3)
function addHypermediaLinks(taskDoc, req) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const task = taskDoc.toObject ? taskDoc.toObject() : { ...taskDoc };
  const id = task._id ? task._id.toString() : task.id;

  return {
    ...task,
    id: id,
    _links: {
      self: { href: `${baseUrl}/tasks/${id}`, method: "GET" },
      update: { href: `${baseUrl}/tasks/${id}`, method: "PUT" },
      partialUpdate: { href: `${baseUrl}/tasks/${id}`, method: "PATCH" },
      delete: { href: `${baseUrl}/tasks/${id}`, method: "DELETE" },
      collection: { href: `${baseUrl}/tasks`, method: "GET" },
    },
  };
}

// GET /tasks - Fetch all tasks (supports optional filtering by status/completed/priority)
app.get("/tasks", async (req, res, next) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const filter = {};

    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    } else if (req.query.status !== undefined) {
      filter.completed = req.query.status.toLowerCase() === "completed";
    }

    if (req.query.priority) {
      filter.priority = req.query.priority.toLowerCase();
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    const tasksWithLinks = tasks.map((task) => addHypermediaLinks(task, req));

    res.status(200).json({
      success: true,
      count: tasksWithLinks.length,
      data: tasksWithLinks,
      _links: {
        self: { href: `${baseUrl}${req.originalUrl}`, method: "GET" },
        create: { href: `${baseUrl}/tasks`, method: "POST" },
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id - Fetch single task by ID (returns 404 JSON if not found)
app.get("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with ID ${req.params.id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: addHypermediaLinks(task, req),
    });
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Create a new task using Mongoose model
app.post("/tasks", async (req, res, next) => {
  try {
    const { title, description, completed, priority, status } = req.body;

    const taskData = {
      title,
      description: description !== undefined ? description : "",
      completed: completed !== undefined ? completed : status === "completed",
      priority: priority !== undefined ? priority : "medium",
    };

    const newTask = new Task(taskData);
    await newTask.save();

    const resourceUrl = `/tasks/${newTask._id}`;
    res.setHeader("Location", resourceUrl);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: addHypermediaLinks(newTask, req),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(formatValidationError(err));
    }
    next(err);
  }
});

// PUT /tasks/:id - Full resource update/replacement
app.put("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with ID ${req.params.id} not found`,
      });
    }

    const { title, description, completed, priority, status } = req.body;

    task.title = title;
    task.description = description !== undefined ? description : "";
    task.completed = completed !== undefined ? completed : status === "completed";
    task.priority = priority !== undefined ? priority : "medium";

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: addHypermediaLinks(task, req),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(formatValidationError(err));
    }
    next(err);
  }
});

// PATCH /tasks/:id - Partial resource update
app.patch("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with ID ${req.params.id} not found`,
      });
    }

    const { title, description, completed, priority, status } = req.body;

    if (title !== undefined) {
      task.title = title;
    }
    if (description !== undefined) {
      task.description = description;
    }
    if (completed !== undefined) {
      task.completed = completed;
    } else if (status !== undefined) {
      task.completed = status === "completed";
    }
    if (priority !== undefined) {
      task.priority = priority;
    }

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task partially updated successfully",
      data: addHypermediaLinks(task, req),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(formatValidationError(err));
    }
    next(err);
  }
});

// DELETE /tasks/:id - Remove task
app.delete("/tasks/:id", validateTaskId, async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({
        error: "Not Found",
        message: `Task with ID ${req.params.id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Task with ID ${req.params.id} deleted successfully`,
      data: addHypermediaLinks(deletedTask, req),
    });
  } catch (err) {
    next(err);
  }
});

// 404 Route handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    return res.status(400).json(formatValidationError(err));
  }
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});

app.listen(PORT, () => {
  console.log(`Task Management API running on http://localhost:${PORT}`);
});