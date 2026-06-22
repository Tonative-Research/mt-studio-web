# MT Studio

**African Language Translation Engine** — built by the Tonative team.

Upload a CSV, pick a text column and target African language, choose a Gemini AI model, and download a fully translated dataset. No code required.

---

## What it does

| Step | Feature |
|---|---|
| 1 | Drag-and-drop CSV upload with automatic column detection |
| 2 | Select source language, target African language, and text column |
| 3 | Choose a Gemini model (1.5 Flash · 1.5 Pro · 2.0 Flash) |
| 4 | Real-time progress bar tracking every translated row |
| 5 | Preview translated output and download the final CSV |

---

## Getting started

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# 1. Clone and install
npm install

# 2. Set up environment variables by creating an .env file
cp .env.example .env
# To fill in the values, ask a team member for the variables.

# 3. Start the dev server
npm run dev
# → http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript type-check |
| `npm run check` | Run all pre-commit rule checks manually |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## Tech stack

| Tool | Version | Role |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.8 | Static typing |
| Vite | 6 | Build tool and dev server |
| Tailwind CSS | 4 | Utility-first styling |
| React Router DOM | 7 | Client-side routing |
| Redux Toolkit + RTK Query | 2 | Global state + server state |
| Redux Persist | 6 | Persists state to `localStorage` |
| React Hook Form + Zod | latest | Form management and validation |
| Motion (Framer) | 12 | Animations |
| Lucide React | 0.546 | Icons |
| Husky + lint-staged | latest | Pre-commit enforcement |

---

## Documentation

| Document | What's in it |
|---|---|
| [Architecture](./docs/architecture.md) | Folder structure, routing, aliases, environment variables |
| [State Management](./docs/state-management.md) | Redux slices, RTK Query, API layer patterns |
| [Styling](./docs/styling.md) | Theme tokens, colour palette, CSS classes, typography, critical CSS rules |
| [Components](./docs/components.md) | Full API reference for every common component, form validation |
| [Dev Tools](./docs/dev-tools.md) | Component showcase (`/dev/components`), toast usage |
| [Contributing](./docs/contributing.md) | Best practices, Git workflow, pre-commit hooks |
