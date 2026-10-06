const jwt = require("jsonwebtoken");

/**
 * Authentication middleware
 * Verifies JWT from the Authorization header and attaches decoded user to req.user
 */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Access denied. No token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token has expired. Please log in again.",
      });
    }
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid token.",
    });
  }
}

module.exports = auth;
