# Heelllo Boxcode — Backend

Minimal Express + SQLite API for the Heelllo Boxcode frontend.

## Stack

- Node.js + Express
- SQLite via `better-sqlite3` (`users` + `chat_messages` tables)
- bcrypt password hashing
- JWT auth via `jsonwebtoken`
- Dataset-lookup chat replies from a local JSON knowledge base (`knowledge-base.json`) — no external API calls

## Endpoints

| Method | Path | Auth | Body / Response |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | — | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | — | `{ email, password }` → `{ token, user }` (401 on failure) |
| GET | `/api/auth/me` | Bearer token | `{ name, email }` |
| POST | `/api/chat` | Bearer token | `{ message }` → `{ reply, sources }` — reply is the best-matching knowledge-base entry's answer (fallback string when nothing scores above the threshold); persists both turns to SQLite |
| GET | `/api/chat/history` | Bearer token | real per-user conversation history from SQLite |

## Local setup

```bash
cd backend
npm install
npm start
```

The server listens on `PORT` (default `4000`). Copy `.env.example` to `.env` and set `JWT_SECRET`. Chat runs on local dataset lookup only — no external API calls or API keys required.

## Deploy to Render

### Option A — Blueprint

1. Push this repo to GitHub or GitLab.
2. In Render, choose **New → Blueprint** and select the repo. Render reads the `render.yaml` at the repo root and creates the Web Service.

### Option B — Manual Web Service

1. In Render, choose **New → Web Service** and select the repo.
2. Configure it with:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `node server.js`
3. Add environment variables:
   - `JWT_SECRET` — click **Generate** for a random value
   - `CORS_ORIGIN` — your frontend origin, e.g. `https://your-app.vercel.app`

Then point the frontend's API base URL at the Render URL.

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Port to listen on (Render sets this automatically) | `4000` |
| `JWT_SECRET` | Secret used to sign JWTs | — |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:3000` |
| `DB_PATH` | SQLite file path (`:memory:` for tests) | `backend/heelllo.db` |
| `KNOWLEDGE_TOP_K` | Max entries the retriever returns per query | `4` |
