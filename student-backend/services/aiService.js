/**
 * AI Assistant Service (Gemini API & OpenAI API)
 * Generates structured task insights:
 *  - Professional task description
 *  - Intelligent priority level recommendation (low, medium, high)
 *  - Suggested estimated deadline / timeframe
 *  - Key action checklist steps
 *
 * Implements fallback heuristic engine to guarantee zero downtime
 * if external API keys are missing, timeout, or fail.
 */

/**
 * Heuristic AI-fallback rule engine
 * When external API is unreachable or key is not provided,
 * generates meaningful semantic suggestions based on task title keywords.
 */
function generateRuleBasedSuggestion(title) {
  const lower = (title || "").toLowerCase();

  let priority = "medium";
  let daysUntilDue = 3;
  let reason = "Standard task complexity based on task scope.";

  if (
    lower.includes("urgent") ||
    lower.includes("critical") ||
    lower.includes("fix") ||
    lower.includes("bug") ||
    lower.includes("crash") ||
    lower.includes("security") ||
    lower.includes("exam") ||
    lower.includes("tomorrow") ||
    lower.includes("asap")
  ) {
    priority = "high";
    daysUntilDue = 1;
    reason = "High urgency detected: Keywords indicate time-critical resolution, defect, or deadline.";
  } else if (
    lower.includes("learn") ||
    lower.includes("explore") ||
    lower.includes("read") ||
    lower.includes("research") ||
    lower.includes("idea") ||
    lower.includes("someday") ||
    lower.includes("cleanup")
  ) {
    priority = "low";
    daysUntilDue = 7;
    reason = "Low urgency: Exploratory, research, or ongoing self-paced task.";
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + daysUntilDue);
  const formattedDueDate = dueDate.toISOString().split("T")[0];

  const suggestedDescription = `Execute and complete "${title.trim()}". Ensure all requirements, quality verifications, and documentation are thoroughly satisfied.`;

  const checklist = [
    `Analyze requirements and dependencies for "${title.trim()}"`,
    "Implement core solution and conduct validation checks",
    "Review final deliverable and mark task as completed",
  ];

  return {
    source: "smart-engine",
    title: title.trim(),
    suggestedDescription,
    suggestedPriority: priority,
    suggestedDueDate: formattedDueDate,
    estimatedDays: daysUntilDue,
    reasoning: reason,
    checklist,
  };
}

/**
 * Call Google Gemini API (gemini-1.5-flash or gemini-2.0-flash)
 */
async function callGeminiApi(apiKey, title, currentDescription = "") {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `You are an expert productivity assistant for a Task Management app.
Given the task title "${title}" and optional context "${currentDescription}", generate a JSON response with:
1. "suggestedDescription": A clear, professional, 2-3 sentence task description.
2. "suggestedPriority": Exactly one of "low", "medium", or "high".
3. "estimatedDays": Number of days (integer, e.g. 1 to 14) recommended to complete this task.
4. "reasoning": 1 concise sentence explaining the priority choice.
5. "checklist": An array of 3 actionable sub-tasks/steps.

Return ONLY raw valid JSON without markdown fences, matching this schema:
{
  "suggestedDescription": "...",
  "suggestedPriority": "low" | "medium" | "high",
  "estimatedDays": 3,
  "reasoning": "...",
  "checklist": ["step 1", "step 2", "step 3"]
}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
          responseMimeType: "application/json",
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(`Gemini API HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error("No candidate returned by Gemini API");
    }

    const cleaned = candidateText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validPriority = ["low", "medium", "high"].includes(parsed.suggestedPriority?.toLowerCase())
      ? parsed.suggestedPriority.toLowerCase()
      : "medium";

    const days = Number.isInteger(parsed.estimatedDays) ? parsed.estimatedDays : 3;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    return {
      source: "gemini-api",
      title: title.trim(),
      suggestedDescription: parsed.suggestedDescription || `Execute "${title}" to completion.`,
      suggestedPriority: validPriority,
      suggestedDueDate: dueDate.toISOString().split("T")[0],
      estimatedDays: days,
      reasoning: parsed.reasoning || "Generated by Gemini AI based on task context.",
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Call OpenAI API (gpt-3.5-turbo / gpt-4o-mini)
 */
async function callOpenAiApi(apiKey, title, currentDescription = "") {
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const systemPrompt = `You are a productivity AI. Output valid JSON with keys:
- "suggestedDescription": string (2-3 sentences)
- "suggestedPriority": "low" | "medium" | "high"
- "estimatedDays": integer
- "reasoning": string
- "checklist": array of 3 strings`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Task Title: "${title}". Context: "${currentDescription}"` },
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`OpenAI API HTTP ${res.status}`);
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    const validPriority = ["low", "medium", "high"].includes(parsed.suggestedPriority?.toLowerCase())
      ? parsed.suggestedPriority.toLowerCase()
      : "medium";

    const days = Number.isInteger(parsed.estimatedDays) ? parsed.estimatedDays : 3;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    return {
      source: "openai-api",
      title: title.trim(),
      suggestedDescription: parsed.suggestedDescription || `Execute "${title}" to completion.`,
      suggestedPriority: validPriority,
      suggestedDueDate: dueDate.toISOString().split("T")[0],
      estimatedDays: days,
      reasoning: parsed.reasoning || "Generated by OpenAI based on task context.",
      checklist: Array.isArray(parsed.checklist) ? parsed.checklist : [],
    };
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Main AI Assistant Entry Point
 * Gracefully handles timeouts and missing API keys with fallback to ensure
 * the application ALWAYS continues to function normally.
 */
async function suggestTaskDetails(title, currentDescription = "") {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      return await callGeminiApi(geminiKey, title, currentDescription);
    } catch (err) {
      console.warn(`[AI Service] Gemini API call failed: ${err.message}. Falling back to smart engine.`);
    }
  }

  if (openAiKey) {
    try {
      return await callOpenAiApi(openAiKey, title, currentDescription);
    } catch (err) {
      console.warn(`[AI Service] OpenAI API call failed: ${err.message}. Falling back to smart engine.`);
    }
  }

  // Graceful fallback: Never crash or block core application
  return generateRuleBasedSuggestion(title);
}

module.exports = {
  suggestTaskDetails,
  generateRuleBasedSuggestion,
};
