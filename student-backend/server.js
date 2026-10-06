require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

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

// ── Routes ───────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/tasks", taskRoutes);

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
    const formattedErrors = {};
    for (const field in err.errors) {
      formattedErrors[field] = err.errors[field].message;
    }
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      errors: formattedErrors,
    });
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