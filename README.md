# 🎬 AI Movie Plot Generator

**🔗 Live Site: [ai-movie-plot-generator.vercel.app](https://ai-movie-plot-generator.vercel.app/)**

An AI-powered movie plot generator. Give it a vague story idea, and it uses Google's Gemini models to figure out what's missing, ask a few smart clarifying questions, and generate a fully structured plot — complete with characters, locations, and a three-act breakdown — ready to export as a PDF.

---

## ✨ Features

- **Idea → Plot pipeline** — enter a rough concept plus genre/tone, and the AI decides on its own whether it needs more detail before writing.
- **Smart clarifying questions** — the AI only asks about what's genuinely ambiguous (character names, ages, relationships, setting, conflict), capped at 6 questions, and skips straight to plot generation if your idea is already detailed enough.
- **Structured plot generation** — title, genre, logline, a full character roster (name, age, gender, role, arc), key locations, and a three-act structure that weaves in every detail you provided.
- **One-click PDF export** — generates a clean, readable PDF entirely in the browser (via `jsPDF`) and downloads it straight to your device. No server round-trip, no data stored anywhere.
- **Resilient API handling** — automatic retry with exponential backoff on transient rate limits, with a fallback to a lighter Gemini model if the primary one is temporarily unavailable.
- **Streaming-platform aesthetic** — a dark, synthwave-themed UI built with Tailwind + DaisyUI.

---

## 🧱 Tech Stack

| Layer      | Tech                                          |
|------------|------------------------------------------------|
| Frontend   | React (Vite), Tailwind CSS, DaisyUI             |
| Backend    | Node.js, Express                                |
| AI         | Google Gemini API (`@google/genai`)             |
| PDF Export | jsPDF (client-side, no server involved)         |
| Hosting    | Render (backend) · Vercel (frontend)            |

---

## 📁 Project Structure

ai-movie-plot-generator/
├── backend/
│ ├── controllers/
│ │ └── plotController.js # Request handlers
│ ├── prompts/
│ │ └── systemPrompts.js # Prompt engineering for Gemini
│ ├── routes/
│ │ └── plotRoutes.js # API route definitions
│ ├── services/
│ │ └── geminiService.js # Gemini API calls, retry/fallback logic
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

| Method | Endpoint             | Description                                       |
|--------|-----------------------|---------------------------------------------------|
| GET    | `/health`             | Basic health check                                 |
| POST   | `/api/analyze-idea`   | Determines if clarifying questions are needed      |
| POST   | `/api/generate-plot`  | Generates the full structured plot                 |

---

## 🚀 Getting Started (local development)

### Prerequisites
- Node.js (v18+)
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/ai-movie-plot-generator.git
cd ai-movie-plot-generator
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `backend/.env`:
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-flash-latest
PORT=5000
FRONTEND_ORIGIN=http://localhost:5173

Run it:
```bash
npm run dev
```

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

Visit `http://localhost:5173` — make sure the backend is running at the same time.

---

## ☁️ Deployment

- **Backend** is deployed on [Render](https://render.com) (free tier). Note: free-tier services sleep after inactivity — the first request after idle can take 30–60 seconds to respond.
- **Frontend** is deployed on [Vercel](https://vercel.com), pulling `VITE_API_URL` from its project environment variables at build time.

---

## 🗺️ Not Included (by design)

- **Persistent storage** — plots aren't saved to a database; each session is stateless.
- **AI poster art** — removed to conserve free-tier Gemini API quota.

---

## 📄 License

Not yet licensed — add a `LICENSE` file if you'd like to open-source this formally.

git add README.md
git commit -m "docs: add project README"
git push