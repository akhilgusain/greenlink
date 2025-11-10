# GreenLink 2.0 — Smart Sustainability Dashboard

- `backend/` — Minimal Express backend serving a `/api/stats` endpoint with sample CO2/build data and a simple plugin example.
- `frontend/` — Minimal React + Vite app (JSX) that fetches `/api/stats` and shows charts & GreenScore badge.
- `.gitignore` — Common ignores.
- Instructions to run locally and how to wire a GitHub Action plugin.

## Quick Start
You'll need Node.js (v18+) and npm/yarn.

### Backend
```bash
cd backend
npm install
# start server on port 4000
npm run dev
```
The backend serves a demo API at `http://localhost:4000/api/stats`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite app runs on `http://localhost:5173` by default and expects the backend proxied or running at `http://localhost:4000`.

## What to customize before submission
- Replace `SLACK_WEBHOOK_URL` in `.env` or your CI secrets if you want Slack tips enabled.
- Hook `plugin/example_plugin.js` into your GitHub Actions or Jenkins pipeline to POST build metrics to the backend.
- Optionally enable `GreenAI` suggestions: backend includes a placeholder for integrating an AI model.

## Files overview (high level)
- `backend/index.js` — Express server, simple POST endpoint `/api/ingest` (for plugin) and GET `/api/stats`.
- `backend/plugin/example_plugin.js` — Example Node script to send metrics from CI to backend.
- `frontend/src/App.jsx` — Main React app, loads charts (Recharts) and shows GreenScore.
- `frontend/src/components/Dashboard.jsx` — Dashboard UI components and charting.

## License
MIT — use this as a starting point for your hackathon submission.
