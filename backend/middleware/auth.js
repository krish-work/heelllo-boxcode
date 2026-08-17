const jwt = require("jsonwebtoken");
const db = require("../db");

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(payload.id);

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.user = user;
  next();
};
