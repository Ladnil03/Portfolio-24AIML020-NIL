const mongoose = require("mongoose");

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
        message:
          "`{VALUE}` is not a valid priority. Allowed values: 'low', 'medium', 'high'",
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

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
