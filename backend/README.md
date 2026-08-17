# Heelllo Boxcode — Backend

Minimal Express + SQLite API for the Heelllo Boxcode frontend.

## Stack

- Node.js + Express
- SQLite via `better-sqlite3` (single `users` table)
- bcrypt password hashing
- JWT auth via `jsonwebtoken`
- Keyword-matched chat replies (no external AI)

## Endpoints

| Method | Path | Auth | Body / Response |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | — | `{ name, email, password }` → `{ token, user }` |
| POST | `/api/auth/login` | — | `{ email, password }` → `{ token, user }` (401 on failure) |
| GET | `/api/auth/me` | Bearer token | `{ name, email }` |
| POST | `/api/chat` | Bearer token | `{ message }` → `{ reply }` |
| GET | `/api/chat/history` | Bearer token | mock array of past messages |

## Local setup

```bash
cd backend
npm install
npm start
```

The server listens on `PORT` (default `4000`). `.env` already contains dev defaults.

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
