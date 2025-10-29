# MVC Movie Search Demo (Client + Server)

This repo gives you a minimal **MVC** skeleton to satisfy your demo requirements:

1) **Run test cases** (backend + frontend)
2) **Auto-generated class diagram**: `class-diagram.puml` (PlantUML source)
3) **GitHub Network**: follow the branch/merge workflow below.

---

## Structure

```
mvc-movie-demo/
├─ client/                 # React + Vite + Tailwind UI
├─ server/                 # Node + Express API (MVC-ish)
├─ class-diagram.puml      # PlantUML class diagram source
├─ .gitignore
└─ README.md
```

### Server (MVC)
- **Model**: `server/src/models/Movie.js`
- **Controller**: `server/src/controllers/SearchController.js`
- **Services**: `server/src/services/TmdbService.js` (real), `AiQueryService.js` (stub)
- **Routes**: `server/src/routes/searchRoutes.js`
- **App**: `server/src/server.js`

### Client
- **UI**: `client/src/App.jsx` with `SearchBar` and `MovieList`
- Buttons: **Search** (calls TMDb via backend) and **AI Search** (stub)

---

## Quick Start

> Requirements: Node 18+

### 1) Set your TMDb API key
Create `server/.env` from the example and paste your key:
```
cp server/.env.example server/.env
# then edit server/.env -> TMDB_API_KEY=YOUR_KEY
```

### 2) Install deps
```
npm --prefix server install
npm --prefix client install
```

### 3) Run dev servers
```
npm --prefix server run dev
npm --prefix client run dev
```
- Server runs on **http://127.0.0.1:8000**
- Client runs on **http://127.0.0.1:5173**
- The client calls the server at `/api/search?query=...`

### 4) Run tests
- **Backend**
```
npm --prefix server test
```
- **Frontend**
```
npm --prefix client test
```
- **Both from repo root**
```
npm run test
```

---

## Git Branching Flow for the GitHub Network Tab

Use these steps so the **Network** graph shows feature branches and merges after each iteration.

```bash
# 0) Initialize git (if starting fresh)
git init
git add .
git commit -m "chore: initial scaffold (iteration 0)"
git branch -M main

# 1) Iteration 1: basic TMDb search
git checkout -b feat/basic-search
# (edit code; commit as you go)
git add .
git commit -m "feat: basic search endpoint + React UI wiring"
git checkout main
git merge --no-ff feat/basic-search -m "merge: iteration 1 into main"

# 2) Iteration 2: AI search stub wiring
git checkout -b feat/ai-search-stub
# (add stub files/tests; commit)
git add .
git commit -m "feat: ai search stub and tests placeholder"
git checkout main
git merge --no-ff feat/ai-search-stub -m "merge: iteration 2 into main"

# 3) Iteration 3: test coverage improvements
git checkout -b chore/tests
# (add/improve tests; commit)
git add .
git commit -m "chore: improve tests"
git checkout main
git merge --no-ff chore/tests -m "merge: iteration 3 into main"

# (Push to GitHub to see the Network graph)
git remote add origin <YOUR_REPO_URL>
git push -u origin main
git push origin feat/basic-search feat/ai-search-stub chore/tests
```
> Tip: You can also open PRs for each feature branch and use the **Merge** button to create merge commits.

---

## Class Diagram (PlantUML)

Open `class-diagram.puml` in a PlantUML viewer (VS Code extension works great). It diagrams the core MVC relationships:
- `SearchController` → uses `TmdbService`
- `TmdbService` → returns `Movie` models
- `AiQueryService` → placeholder for CSV/NLP
- `searchRoutes` → wires HTTP to controller

To render a PNG locally (if you have PlantUML + Java):
```
plantuml class-diagram.puml
```
This outputs `class-diagram.png` in the repo.
