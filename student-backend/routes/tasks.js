const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const auth = require("../middleware/auth");
const { validateTask } = require("../middleware/validate");

const router = express.Router();

// ── Helpers ──────────────────────────────────────────────────────────

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

// ── All task routes are protected by auth middleware ──────────────────
router.use(auth);

// GET /tasks - Fetch all tasks (supports optional filtering by status/completed/priority)
router.get("/", async (req, res, next) => {
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
router.get("/:id", validateTaskId, async (req, res, next) => {
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
router.post("/", validateTask, async (req, res, next) => {
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
router.put("/:id", validateTaskId, validateTask, async (req, res, next) => {
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
router.patch("/:id", validateTaskId, async (req, res, next) => {
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
router.delete("/:id", validateTaskId, async (req, res, next) => {
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

module.exports = router;
