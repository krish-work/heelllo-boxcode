const express = require("express");
const requireAuth = require("../middleware/auth");
const dataset = require("../chat-dataset.json");

const router = express.Router();

// All chat routes require a valid JWT.
router.use(requireAuth);

// Static mock history for the sidebar — no persistence needed.
const history = [
  { id: "1", role: "bot", content: "Hi! I'm Boxcode. How can I help you today?" },
  { id: "2", role: "user", content: "How do I invite teammates?" },
  { id: "3", role: "bot", content: "Head to Team → Invite in the sidebar, then enter their email addresses." },
  { id: "4", role: "user", content: "Perfect, thanks!" },
];

router.post("/", (req, res) => {
  const { message } = req.body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "message is required" });
  }

  const text = message.toLowerCase();
  const match = dataset.pairs.find((pair) =>
    text.includes(pair.keyword.toLowerCase())
  );

  res.json({ reply: match ? match.reply : dataset.default });
});

router.get("/history", (req, res) => {
  res.json(history);
});

module.exports = router;
