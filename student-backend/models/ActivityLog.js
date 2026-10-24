const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ["task", "user", "job", "system"],
      default: "task",
      index: true,
    },
    entityId: {
      type: String,
      default: null,
      index: true,
    },
    actor: {
      id: { type: String, default: "anonymous" },
      email: { type: String, default: null },
      name: { type: String, default: null },
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    processingDurationMs: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

// Index for query sorting by latest logs
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
