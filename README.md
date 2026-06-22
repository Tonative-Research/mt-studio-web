# MTStudio — African Language Translation Engine

MTStudio is an internal MVP tool built by the Tonative team. It lets anyone upload a CSV, pick a text column and target African language, choose a Gemini AI model, and receive a fully translated dataset — no code required.

---

## Table of Contents

1. [Project Purpose](#project-purpose)
2. [Getting Started](#getting-started)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Routing](#routing)
6. [State Management](#state-management)
7. [API Layer](#api-layer)
8. [Styling & Theme](#styling--theme)
9. [Aliases & Path Resolution](#aliases--path-resolution)
10. [Environment Variables](#environment-variables)
11. [Best Practices](#best-practices)

---

## Project Purpose

MTStudio solves a translation bottleneck in the Tonative workflow. The MVP proves the concept before the platform is opened for public contributions. The core user flow is:

1. Upload a CSV file via drag-and-drop
2. Select the text column, source language, and target African language
3. Pick a Gemini model (1.5 Flash, 1.5 Pro, 2.0 Flash)
4. Monitor translation progress in real time
5. Preview and download the translated CSV

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, npm ≥ 9

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment file and request the values from a team member
cp .env.example .env

# 3. Start the dev server (http://localhost:3000)
npm run dev
```

Other scripts:

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start Vite dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript type-check (no emit) |
| `npm run clean` | Remove `dist/` and `server.js` |

---

## Tech Stack

| Tool | Version | Role |
|------|---------|------|
| **React** | 19 | UI framework |
| **TypeScript** | 5.8 | Static typing |
| **Vite** | 6 | Build tool and dev server |
| **Tailwind CSS** | 4 | Utility-first styling (CSS-first config via `@theme` in `index.css`) |
| **@tailwindcss/vite** | 4 | Vite plugin — no `tailwind.config.js` needed |
| **@tailwindcss/forms** | 0.5 | Form element reset plugin |
| **React Router DOM** | 7 | Client-side routing |
| **Redux Toolkit** | 2 | Global state management |
| **React Redux** | 9 | React bindings for Redux |
| **Redux Persist** | 6 | Persists Redux state to `localStorage` |
| **RTK Query** | (bundled with RTK) | Server state, API calls, caching |
| **jwt-decode** | 4 | Decode JWT tokens client-side |
| **Motion (Framer)** | 12 | Animations via `motion/react` |
| **Lucide React** | 0.546 | Icon library |

---

## Folder Structure

```
src/
├── App.tsx                         # Router root. It defines all routes
├── main.tsx                        # React entry point, wraps app in AppProvider
├── index.css                       # Global styles, Tailwind theme tokens, component classes
├── vite-env.d.ts                   # Vite environment variable types
│
├── pages/                          # One file per route
│   ├── LandingPage.tsx             # Route: /
│   └── DashboardPage.tsx           # Route: /dashboard
│
├── components/
│   ├── Header.tsx                  # App header (used on dashboard pages only)
│   ├── landing/                    # Components used exclusively on the landing page
│   │   ├── LandingNav.tsx          # Fixed navbar with scroll-aware transparency
│   │   ├── Hero.tsx                # Full-height hero section
│   │   ├── HowItWorks.tsx          # 4-step workflow explainer
│   │   ├── SupportedLanguages.tsx  # African language card grid
│   │   ├── CallToAction.tsx        # Bottom CTA section
│   │   └── LandingFooter.tsx       # Footer
│   ├── dashboard/                  # Components used on the dashboard
│   │   ├── Dashboard.tsx           # Main dashboard layout container
│   │   ├── UploadZone.tsx          # CSV drag-and-drop upload area
│   │   ├── EngineConfigForm.tsx    # Language, column, and model selectors
│   │   └── PreviewTable.tsx        # Translated output table + CSV download
│   └── common/                     # Shared components used across pages
│       └── ProcessingStatus.tsx    # Real-time translation progress bar
│
├── providers/
│   ├── AppProvider.tsx             # Wraps app with Redux Provider + PersistGate
│   └── index.ts                    # Re-exports AppProvider
│
├── redux/                          # Global client state (Redux Toolkit slices)
│   ├── store.ts                    # Configures store, persistence, and middleware
│   ├── hooks.ts                    # Typed useAppDispatch and useAppSelector
│   ├── baseApiSlice.ts             # RTK Query base API (endpoints injected per feature)
│   ├── appSlice.ts                 # App-wide UI state (sidebar, search)
│   ├── authSlice.ts                # Auth token, decoded claims, user identity
│   ├── accountSlice.ts             # Logged-in user profile
│   ├── translateSlice.ts           # Active translation job and progress
│   ├── uploadSlice.ts              # Uploaded file, columns, language selections
│   └── modelConfigSlice.ts         # Available Gemini models and selected model
│
└── services/
    ├── api/                        # RTK Query endpoint definitions (injected into baseApi)
    │   ├── endpoints.ts            # All URL constants (BASE_URL + ENDPOINTS map)
    │   ├── account.ts              # Profile CRUD
    │   ├── translate.ts            # Start translation job, poll status
    │   ├── model.ts                # Fetch available Gemini models
    │   ├── export.ts               # Download translated CSV
    │   └── country.ts              # Country/states static data (separate createApi)
    └── types/                      # TypeScript interfaces for API data shapes
        ├── account.ts              # IUser, ILoginRequest, IRegisterRequest, etc.
        ├── translate.ts            # ITranslationJob, ITranslationStatus, ETranslationStatus
        ├── upload.ts               # IUploadedFile, ICsvColumn
        └── model.ts                # IGeminiModel, EGeminiModel
```

---

## Routing

Routes are defined in `src/App.tsx` using React Router v7:

```
/             → pages/LandingPage.tsx      (public marketing page)
/dashboard    → pages/DashboardPage.tsx    (app. There is no auth gate yet)
```

**Convention:** Pages live in `src/pages/`. A page file is a thin shell. It composes components and adds the page-level header/layout. No business logic lives in a page file.

---

## State Management

Redux Toolkit is used for global client state. RTK Query handles all server state (fetching, caching, mutations).

**Adding a new slice:**

```ts
// src/redux/myFeatureSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const myFeatureSlice = createSlice({
  name: 'myFeature',
  initialState: { value: '' },
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = myFeatureSlice.actions;
export default myFeatureSlice.reducer;
```

Then register it in `src/redux/store.ts` inside `combineReducers`.

**Adding a new API endpoint:**

RTK Query uses a single `baseApi` instance (`baseApiSlice.ts`). Endpoints are injected per feature file:

```ts
// src/services/api/myFeature.ts
import { ENDPOINTS } from '@/services/api/endpoints';
import { baseApi } from '@/redux/baseApiSlice';

const myApi = baseApi.enhanceEndpoints({ addTagTypes: ['MyTag'] });

export const myFeatureApi = myApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyData: builder.query<MyType, void>({
      query: () => ENDPOINTS.MY_ENDPOINT,
      providesTags: ['MyTag'],
    }),
  }),
});

export const { useGetMyDataQuery } = myFeatureApi;
```

Add the new URL constant to `src/services/api/endpoints.ts`.

**Using Redux in components:**

```ts
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setValue } from '@/redux/myFeatureSlice';

const value = useAppSelector((state) => state.myFeature.value);
const dispatch = useAppDispatch();
dispatch(setValue('hello'));
```

Always import from `@/redux/hooks`. Do not use the untyped `useSelector` / `useDispatch` directly.

---

## API Layer

All API calls go through RTK Query. The `baseApi` in `baseApiSlice.ts`:

- Reads the `auth.authToken` from Redux state and attaches it as a `Bearer` header automatically
- Retries failed requests up to 2 times
- Is extended per feature via `injectEndpoints`. This keeps each service file focused

The `countryApi` in `services/api/country.ts` is a separate `createApi` instance because it fetches static local JSON (no auth header needed).

---

## Styling & Theme

Tailwind CSS v4 is used with a **CSS-first configuration** — there is no `tailwind.config.js`. All theme tokens are declared in `src/index.css` inside `@theme {}`.

**Colour palette:**

| Token | Value | Use |
|-------|-------|-----|
| `primary-500` | `#025464` (deep teal) | Primary actions, headers, active states |
| `primary-900` | Very dark teal | Dark backgrounds (sidebar, hero, footer) |
| `accent-500` | `#E57C23` (warm amber) | CTA buttons, highlights, active indicators |
| `surface` | Near-white teal tint | Page and card backgrounds |
| `gray-*` | Standard neutral scale | Body text, borders, subtle backgrounds |

**Reusable component classes** (defined in `@layer components` in `index.css`):

| Class | Description |
|-------|-------------|
| `.btn-primary` | Teal filled button. For primary actions |
| `.btn-secondary` | White/outlined button. For secondary actions |
| `.btn-accent` | Amber filled button with dark text — CTAs |
| `.card` | White card with border and shadow |
| `.glass-card` | Semi-transparent card with backdrop blur |
| `.input` | Styled text input |
| `.label` | Form field label |
| `.drop-zone` | Dashed drag-and-drop area |
| `.progress-track` / `.progress-fill` | Progress bar pair |
| `.badge`, `.badge-success`, `.badge-warning`, `.badge-error`, `.badge-info` | Status badges |

**Typography:**

- Headings (`h1`–`h6`): **Cirka** (variable font, weights 100–900)
- Body: **Mulish** (Regular 400, Medium 500, SemiBold 600, Bold 700)
- Both fonts are self-hosted from `src/assets/fonts/`

---

## Aliases & Path Resolution

Both Vite and TypeScript are configured to resolve the following aliases, avoiding deeply nested relative imports:

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `services/*` | `src/services/*` |
| `types/*` | `src/types/*` |
| `utils/*` | `src/utils/*` |
| `contexts/*` | `src/contexts/*` |
| `themes/*` | `src/themes/*` |

**Rule:** All imports must use `@/` aliases. Relative imports (`../../`) are not permitted. This is enforced by convention — a lint rule can be added later.

```ts
// Correct
import { useAppSelector } from '@/redux/hooks';
import { ENDPOINTS } from '@/services/api/endpoints';

// Wrong — do not use
import { useAppSelector } from '../../redux/hooks';
```

---

## Environment Variables

All environment variables are prefixed with `VITE_` so Vite exposes them to client code via `import.meta.env`.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_REACT_APP_MTSTUDIO_ENDPOINT` | Yes | Base URL for the MTStudio backend API (e.g. `https://api.mtstudio.tonative.com`) |

Types for `import.meta.env` are declared in `src/vite-env.d.ts`. Add new variables there when introducing them.

Copy `.env.example` to `.env` and populate before running locally. Never commit `.env`.

---

## Best Practices

### Component authorship
- One component per file, named the same as the file
- Pages (`pages/`) are shells. They compose, they do not compute
- Group components by domain: `landing/`, `dashboard/`, `common/`
- Shared/reusable components go in `components/common/`

### TypeScript
- All props must be typed with an explicit interface or type alias
- Avoid `any`. Better to use `unknown` and narrow, or define a proper type in `services/types/`
- API response shapes live in `services/types/`, not inside component files

### State
- Use RTK Query for anything that comes from or goes to the server
- Use Redux slices for global UI state that multiple components need
- Use local `useState` for component-only state (open/closed, hover, form input)
- Never dispatch directly from a service file — only from components or hooks

### Styling
- Use the component classes (`.btn-primary`, `.card`, etc.) before writing custom Tailwind
- Follow the colour palette
- Maintain accessible contrast: dark text (`text-primary-900` or `text-gray-900`) on light/amber backgrounds; white text only on `primary-500` or darker

### Git
- Branch naming: `feat/`, `fix/`, `chore/` prefix (e.g. `feat/upload-csv`)
- Commit messages should be concise and describe what changed, not why
- Do not commit `.env`, `dist/`, or `node_modules/`
