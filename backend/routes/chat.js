const express = require("express");
const requireAuth = require("../middleware/auth");
const db = require("../db");
const { retrieveBestMatch } = require("../knowledge");

const router = express.Router();

// All chat routes require a valid JWT.
router.use(requireAuth);

// Minimum retrieval score before an answer is trusted. A score below this
// means the message only overlapped weakly (e.g. a lone category word), so
// we fall back instead of returning a wrong answer.
const MIN_RELEVANCE_SCORE = 3;

const MAX_MESSAGE_LENGTH = 2000;
const FALLBACK_REPLY = "I don't have an answer for that yet.";

function persistTurn(userId, userContent, assistantContent) {
  const insert = db.prepare(
    "INSERT INTO chat_messages (user_id, role, content) VALUES (?, ?, ?)"
  );
  const persist = db.transaction(() => {
    insert.run(userId, "user", userContent);
    insert.run(userId, "assistant", assistantContent);
  });
  try {
    persist();
  } catch (err) {
    console.error("Failed to persist chat messages:", err);
  }
}

router.post("/", (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  const trimmed = message.trim().slice(0, MAX_MESSAGE_LENGTH);
  const best = retrieveBestMatch(trimmed);

  const matched = best && best.score >= MIN_RELEVANCE_SCORE;
  const reply = matched ? best.entry.answer : FALLBACK_REPLY;

  // Persist both turns so the sidebar history stays real — the fallback is
  // stored too, so history never ends up one-sided.
  persistTurn(req.user.id, trimmed, reply);

  // Sources are only meaningful when the answer actually came from an entry;
  // the fallback is not grounded in anything.
  res.json({ reply, sources: matched ? [best.entry.id] : [] });
});

router.get("/history", (req, res) => {
  const rows = db
    .prepare(
      `SELECT id, role, content, created_at FROM chat_messages
       WHERE user_id = ? ORDER BY id DESC LIMIT 100`
    )
    .all(req.user.id)
    .reverse();

  // Map assistant -> bot to match the frontend's ChatHistoryItem type.
  res.json(
    rows.map((r) => ({
      id: String(r.id),
      role: r.role === "assistant" ? "bot" : "user",
      content: r.content,
      createdAt: r.created_at,
    }))
  );
});

module.exports = router;
