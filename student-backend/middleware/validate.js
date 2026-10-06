/**
 * Input validation middlewares
 * Reject malformed requests before they reach the database layer.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_PRIORITIES = ["low", "medium", "high"];

/**
 * Validate user registration payload
 */
function validateRegister(req, res, next) {
  const errors = {};
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.name = "Name is required and must be a non-empty string";
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required and must be a non-empty string";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please provide a valid email address";
  }

  if (!password || typeof password !== "string") {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Request validation failed",
      errors,
    });
  }

  next();
}

/**
 * Validate user login payload
 */
function validateLogin(req, res, next) {
  const errors = {};
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.email = "Email is required";
  }

  if (!password || typeof password !== "string" || !password.trim()) {
    errors.password = "Password is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Request validation failed",
      errors,
    });
  }

  next();
}

/**
 * Validate task creation / full update payload
 * Used on POST /tasks and PUT /tasks/:id
 */
function validateTask(req, res, next) {
  const errors = {};
  const { title, priority } = req.body || {};

  if (!title || typeof title !== "string" || !title.trim()) {
    errors.title = "Title is required and must be a non-empty string";
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    errors.priority = `Invalid priority. Allowed values: ${VALID_PRIORITIES.join(", ")}`;
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: "Validation Error",
      message: "Request validation failed",
      errors,
    });
  }

  next();
}

module.exports = { validateRegister, validateLogin, validateTask };
