const fs = require("fs");
const path = require("path");

// Loaded once at startup; ~100 entries is small enough to keep fully in memory.
const knowledgeBase = JSON.parse(
  fs.readFileSync(path.join(__dirname, "knowledge-base.json"), "utf8")
);

const MAX_CONTEXT_ENTRIES = Number(process.env.KNOWLEDGE_TOP_K || 4);

// Small stopword list — enough to cut noise without a full NLP dependency.
const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "do",
  "does", "did", "i", "you", "we", "they", "it", "to", "of", "in", "on",
  "for", "with", "how", "what", "when", "where", "why", "my", "me", "your",
  "can", "could", "would", "should", "please", "tell", "about", "get",
  "have", "has", "use", "using", "need", "there", "this", "that",
]);

// Question-framing phrases that appear in most queries — never treated as
// evidence of a topic match, or the phrase bonus would fire on every "what
// is..." / "how do i..." question.
const GENERIC_PHRASES = new Set([
  "what is", "what are", "what does", "what's", "how do i", "how does",
  "how much", "how can i", "how to", "where can i", "where do i",
  "why am i", "why is", "when do i", "can i",
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function scoreEntry(entry, tokens, raw) {
  let score = 0;
  const keywordTokens = (entry.keywords || []).map((k) => k.toLowerCase());
  const questionTokens = tokenize(entry.question);
  const categoryTokens = tokenize(entry.category);

  for (const t of tokens) {
    if (keywordTokens.includes(t)) score += 3;
    if (questionTokens.includes(t)) score += 2;
    if (categoryTokens.includes(t)) score += 1;
  }

  // Multi-word keyword phrases (e.g. "custom domain", "rate limit") get a
  // big bonus when they appear verbatim in the user's message — except
  // generic question-framing phrases, which appear in nearly every query.
  for (const kw of keywordTokens) {
    if (kw.includes(" ") && !GENERIC_PHRASES.has(kw) && raw.toLowerCase().includes(kw)) {
      score += 5;
    }
  }

  return score;
}

/**
 * Returns the top-K knowledge-base entries most relevant to `message`.
 * Scoring is exact token overlap against keywords/question/category plus a
 * bonus for verbatim multi-word phrases. Deliberately dependency-free: at
 * this dataset size (~100 entries) it is fast, transparent and debuggable —
 * embeddings + a vector store would add real complexity for no accuracy gain.
 */
function retrieveContext(message, topK = MAX_CONTEXT_ENTRIES) {
  const raw = String(message || "");
  const tokens = tokenize(raw);
  if (!tokens.length) return [];

  return knowledgeBase.entries
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens, raw) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((x) => x.entry);
}

/**
 * Returns the single best-matching entry plus its score, or null when
 * nothing scored above zero. Callers decide the minimum acceptable score.
 */
function retrieveBestMatch(message) {
  const raw = String(message || "");
  const tokens = tokenize(raw);
  if (!tokens.length) return null;

  const scored = knowledgeBase.entries
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens, raw) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.length ? scored[0] : null;
}

module.exports = { retrieveContext, retrieveBestMatch, knowledgeBase };
