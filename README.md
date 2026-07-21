# 🎬 AI Movie Plot Generator

**🔗 Live Site: [ai-movie-plot-generator.vercel.app](https://ai-movie-plot-generator.vercel.app/)**


An AI-powered movie plot generator. Give it a vague story idea, and it uses Google's Gemini models to figure out what's missing, ask a few smart clarifying questions, and generate a fully structured plot — complete with characters, locations, and a three-act breakdown — ready to export as a PDF.

> **Note on the backend:** this project originally shipped with a Node/Express backend, then was migrated to a Python/FastAPI backend to satisfy a coursework requirement. The Python backend (`backend-python/`) is what's live in production today. The original Node backend (`backend/`) is kept in the repo, untouched and still deployable, as a reference implementation and rollback option — see [Backend History](#-backend-history) below.

---

## ✨ Features

- **Idea → Plot pipeline** — enter a rough concept plus genre/tone, and the AI decides on its own whether it needs more detail before writing.
- **Smart clarifying questions** — the AI only asks about what's genuinely ambiguous (character names, ages, relationships, setting, conflict), capped at 6 questions, and skips straight to plot generation if your idea is already detailed enough.
- **Structured plot generation** — title, genre, logline, a full character roster (name, age, gender, role, arc), key locations, and a three-act structure that weaves in every detail you provided.
- **One-click PDF export** — generates a clean, readable PDF entirely in the browser (via `jsPDF`) and downloads it straight to your device. No server round-trip, no data stored anywhere.
- **Resilient API handling** — retry with exponential backoff on transient rate limits, a daily-quota short-circuit that fails fast with a clear message, and automatic fallback to a lighter Gemini model if the primary one is temporarily unavailable.
- **Streaming-platform aesthetic** — a dark, synthwave-themed UI built with Tailwind + DaisyUI.

---

## 🧱 Tech Stack

| Layer      | Tech                                              |
|------------|----------------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, DaisyUI                 |
| Backend    | Python, FastAPI, Uvicorn, Pydantic                  |
| AI         | Google Gemini API (`google-genai`)                  |
| PDF Export | jsPDF (client-side, no server involved)             |
| Hosting    | Render (backend) · Vercel (frontend)                |

---

## 📁 Project Structure

ai-movie-plot-generator/
├── backend-python/ # ⭐ Live backend (FastAPI)
│ ├── controllers/
│ │ └── plot_controller.py # Request handlers + Pydantic request models
│ ├── prompts/
│ │ └── system_prompts.py # Prompt engineering for Gemini
│ ├── routers/
│ │ └── plot_routes.py # API route definitions
│ ├── services/
│ │ └── gemini_service.py # Gemini calls, retry/backoff, fallback model
│ ├── .env.example
│ ├── requirements.txt
│ └── main.py
├── backend/ # Legacy Node/Express backend (kept for reference)
│ ├── controllers/
│ ├── prompts/
│ ├── routes/
│ ├── services/
│ ├── .env.example
│ ├── package.json
│ └── server.js
└── frontend/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── IdeaInput.jsx
│ │ ├── ClarifyingQuestions.jsx
│ │ ├── LoadingSkeleton.jsx
│ │ └── PlotDisplay.jsx
│ ├── utils/
│ │ └── exportPdf.js # Client-side PDF generation
│ ├── api.js # Backend API helper functions
│ └── App.jsx # Stage/state machine
└── package.json


---

## 🔌 API Endpoints

Served by `backend-python` (FastAPI). Same paths and JSON shapes as the original Node implementation.

| Method | Endpoint             | Description                                       |
|--------|-----------------------|---------------------------------------------------|
| GET    | `/health`             | Basic health check                                 |
| POST   | `/api/analyze-idea`   | Determines if clarifying questions are needed      |
| POST   | `/api/generate-plot`  | Generates the full structured plot                 |

---

## 🚀 Getting Started (local development)

### Prerequisites
- Python 3.10+
- Node.js (v18+) — for the frontend
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/ai-movie-plot-generator.git
cd ai-movie-plot-generator
```

### 2. Backend setup (Python — this is the live backend)
```bash
cd backend-python
python -m venv venv
venv\Scripts\Activate.ps1      # Windows PowerShell — see note below for other shells
pip install -r requirements.txt
cp .env.example .env
```
Fill in `backend-python/.env`:
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-flash-latest
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173

Run it:
```bash
uvicorn main:app --reload --port 5000
```
Visit `http://localhost:5000/health` — should return `{"status":"ok"}`.

### 3. Frontend setup
```bash
cd ../frontend
npm install
```
Create `frontend/.env`:
VITE_API_URL=http://localhost:5000/api

Run it:
```bash
npm run dev
```

Visit `http://localhost:5173` — make sure the Python backend is running at the same time.

---

## ☁️ Deployment

- **Backend** (`backend-python`) is deployed on [Render](https://render.com) as a Python 3 Web Service (free tier) — Build Command `pip install -r requirements.txt`, Start Command `uvicorn main:app --host 0.0.0.0 --port $PORT`. Free-tier services sleep after inactivity; the first request after idle can take 30–60 seconds.
- **Frontend** is deployed on [Vercel](https://vercel.com), pulling `VITE_API_URL` from its project environment variables at build time, pointed at the Python backend's `/api` path.

---

## 🕓 Backend History

This project shipped its first working version with a Node/Express backend, fully deployed and functional. It was then rebuilt in Python/FastAPI (`backend-python/`) to satisfy a course requirement, following the same architecture (routes → controllers → services → prompts) and identical API contracts, so the frontend needed zero changes beyond one environment variable.

The Node backend (`backend/`) is left in the repo, still deployable independently, and was used as the source of truth when porting the prompt-engineering logic and retry/fallback behavior line-for-line into Python.

---

## 🗺️ Not Included (by design)

- **Persistent storage** — plots aren't saved to a database; each session is stateless.
- **AI poster art** — removed to conserve free-tier Gemini API quota.

---

## 📄 License

Not yet licensed — add a `LICENSE` file if you'd like to open-source this formally.