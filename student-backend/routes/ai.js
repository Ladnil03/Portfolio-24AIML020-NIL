const express = require("express");
const { suggestTaskDetails } = require("../services/aiService");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/ai/suggest
 * Body: { title: string, currentDescription?: string }
 * Suggests description, priority, estimated deadline, and checklist.
 * Protected by JWT auth, with fallback for resilience.
 */
router.post("/suggest", auth, async (req, res) => {
  try {
    const { title, currentDescription } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A non-empty task 'title' is required for AI suggestions.",
      });
    }

    const suggestion = await suggestTaskDetails(title.trim(), currentDescription || "");

    return res.status(200).json({
      success: true,
      data: suggestion,
    });
  } catch (err) {
    console.error("[AI Route Error]", err.message);
    // Graceful error response so application keeps functioning
    return res.status(500).json({
      error: "AI Service Error",
      message: "Unable to process AI suggestion at this time.",
      fallback: true,
    });
  }
});

module.exports = router;
