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
9. [Common Components](#common-components)
10. [Form Validation](#form-validation)
11. [Error Handling & Notifications](#error-handling--notifications)
12. [Aliases & Path Resolution](#aliases--path-resolution)
13. [Environment Variables](#environment-variables)
14. [Best Practices](#best-practices)

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

# 2. Copy the environment file with the command below and request the values from a team member
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
| **@tailwindcss/forms** | 0.5 | Form element baseline reset |
| **React Router DOM** | 7 | Client-side routing |
| **Redux Toolkit** | 2 | Global state management |
| **React Redux** | 9 | React bindings for Redux |
| **Redux Persist** | 6 | Persists Redux state to `localStorage` |
| **RTK Query** | (bundled with RTK) | Server state, API calls, caching |
| **React Hook Form** | latest | Performant, uncontrolled form management |
| **Zod** | latest | TypeScript-first schema validation |
| **@hookform/resolvers** | latest | Connects Zod schemas to React Hook Form |
| **jwt-decode** | 4 | Decode JWT tokens client-side |
| **Motion (Framer)** | 12 | Animations via `motion/react` |
| **Lucide React** | 0.546 | Icon library |
| **Express** | 4 | Minimal server for production serving |

---

## Folder Structure

```
src/
├── App.tsx                          # Router root — defines all routes, wraps in ErrorBoundary
├── main.tsx                         # React entry point, wraps app in AppProvider
├── index.css                        # Global styles, Tailwind theme tokens, component classes
├── vite-env.d.ts                    # Vite environment variable types
│
├── pages/                           # One file per route (thin shells — compose, don't compute)
│   ├── LandingPage.tsx              # Route: /
│   └── DashboardPage.tsx            # Route: /dashboard
│
├── components/
│   ├── Header.tsx                   # App header (dashboard pages only) — uses Button component
│   │
│   ├── common/                      # Reusable UI primitives — use these everywhere
│   │   ├── index.ts                 # Barrel export for all common components
│   │   ├── Button.tsx               # Button: 5 variants, 3 sizes, loading state, icons
│   │   ├── Spinner.tsx              # Loading spinner (used inside Button)
│   │   ├── Badge.tsx                # Status badge: 5 variants, dot indicator
│   │   ├── Skeleton.tsx             # Loading skeleton: line, circle, card, button
│   │   ├── TextInput.tsx            # Text input with label, error, hint, addons
│   │   ├── Textarea.tsx             # Textarea with label, error, character count
│   │   ├── Select.tsx               # Native select with custom chevron, error state
│   │   ├── Checkbox.tsx             # Checkbox with label and description
│   │   ├── RadioGroup.tsx           # Radio button group (vertical or horizontal)
│   │   ├── ToastContainer.tsx       # Toast notification stack (reads from toastSlice)
│   │   ├── ErrorBoundary.tsx        # React error boundary with themed fallback UI
│   │   └── ProcessingStatus.tsx     # Translation progress bar component
│   │
│   ├── landing/                     # Components used exclusively on the landing page
│   │   ├── LandingNav.tsx           # Fixed navbar, scroll-aware — uses Button component
│   │   ├── Hero.tsx                 # Full-height hero section — uses Button component
│   │   ├── HowItWorks.tsx           # 4-step workflow explainer
│   │   ├── SupportedLanguages.tsx   # African language card grid
│   │   ├── CallToAction.tsx         # Bottom CTA section — uses Button component
│   │   └── LandingFooter.tsx        # Footer
│   │
│   └── dashboard/                   # Components used on the dashboard
│       ├── Dashboard.tsx            # Main dashboard layout container
│       ├── UploadZone.tsx           # CSV drag-and-drop upload area
│       ├── EngineConfigForm.tsx     # Language/column/model config — uses Select + Button
│       └── PreviewTable.tsx         # Translated output table — uses Button component
│
├── providers/
│   ├── AppProvider.tsx              # Redux Provider + PersistGate + ErrorBoundary + ToastContainer
│   └── index.ts                     # Re-exports AppProvider
│
├── redux/                           # Global client state (Redux Toolkit slices)
│   ├── store.ts                     # Store config, persistence, middleware
│   ├── hooks.ts                     # Typed useAppDispatch / useAppSelector
│   ├── baseApiSlice.ts              # RTK Query base API (endpoints injected per feature)
│   ├── appSlice.ts                  # App-wide UI state
│   ├── authSlice.ts                 # Auth token, decoded JWT claims
│   ├── accountSlice.ts              # Logged-in user profile
│   ├── translateSlice.ts            # Active translation job and progress
│   ├── uploadSlice.ts               # Uploaded file, columns, language selections
│   ├── modelConfigSlice.ts          # Available Gemini models and selected model
│   └── toastSlice.ts                # Toast notification queue + convenience helpers
│
├── services/
│   ├── api/                         # RTK Query endpoint definitions
│   │   ├── endpoints.ts             # All URL constants (BASE_URL + ENDPOINTS map)
│   │   ├── account.ts               # Profile CRUD
│   │   ├── translate.ts             # Start translation job, poll status
│   │   ├── model.ts                 # Fetch available Gemini models
│   │   ├── export.ts                # Download translated CSV
│   │   └── country.ts               # Country/states static data
│   └── types/                       # TypeScript interfaces for API data shapes
│       ├── account.ts               # IUser, ILoginRequest, etc.
│       ├── translate.ts             # ITranslationJob, ITranslationStatus, ETranslationStatus
│       ├── upload.ts                # IUploadedFile, ICsvColumn
│       └── model.ts                 # IGeminiModel, EGeminiModel
│
└── utils/
    └── cn.ts                        # Class name merge utility (use instead of template literals)
```

---

## Routing

Routes are defined in `src/App.tsx` using React Router v7. The router outlet is wrapped in `ErrorBoundary` so any page-level render crash shows the themed fallback instead of a blank screen:

```
/             → pages/LandingPage.tsx      (public marketing page)
/dashboard    → pages/DashboardPage.tsx    (app — no auth gate yet)
```

**Convention:** Pages live in `src/pages/`. A page file is a thin shell — it composes components and adds page-level layout. No business logic lives in a page file.

---

## State Management

Redux Toolkit handles global client state. RTK Query handles all server state (fetching, caching, mutations).

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

Register it in `src/redux/store.ts` inside `combineReducers`, then add it to the `blacklist` in `persistConfig` if it should not be persisted.

**Adding a new API endpoint:**

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

Add the new URL to `src/services/api/endpoints.ts`.

**Using Redux in components:**

```ts
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setValue } from '@/redux/myFeatureSlice';

const value = useAppSelector((state) => state.myFeature.value);
const dispatch = useAppDispatch();
dispatch(setValue('hello'));
```

Always use the typed hooks from `@/redux/hooks` — never the untyped `useSelector` / `useDispatch`.

---

## API Layer

All API calls go through RTK Query. `baseApiSlice.ts`:

- Reads `auth.authToken` from Redux and attaches it as a `Bearer` header automatically
- Retries failed requests up to 2 times
- Is extended per feature via `injectEndpoints`

`countryApi` in `services/api/country.ts` is a separate `createApi` instance for static local JSON (no auth needed).

---

## Styling & Theme

Tailwind CSS v4 uses **CSS-first configuration** — no `tailwind.config.js`. All tokens are in `src/index.css` inside `@theme {}`.

**Colour palette:**

| Token | Hex approx. | Use |
|-------|-------------|-----|
| `primary-500` | `#025464` (deep teal) | Primary actions, header backgrounds, active states |
| `primary-900` | Very dark teal | Dark section backgrounds (hero, footer, app header) |
| `accent-500` | `#E57C23` (warm amber) | CTA buttons, active nav indicators, highlights |
| `surface` | Near-white teal tint | Page and card backgrounds |
| `gray-*` | Neutral scale | Body text, borders, subtle fills |

**Accessibility rule:** `btn-accent` uses `text-primary-900` (dark) on the amber background — ~4.9:1 contrast ratio, passing WCAG AA. Never use `text-white` on `accent-500` or lighter shades.

**Component utility classes** (in `@layer components`):

| Class | Description |
|-------|-------------|
| `.btn-primary` | Teal filled — primary actions |
| `.btn-secondary` | White outlined — secondary actions |
| `.btn-accent` | Amber filled with dark text — CTAs |
| `.card` | White card with border and shadow |
| `.glass-card` | Semi-transparent card with backdrop blur |
| `.input` | Base text input style |
| `.input--error` | Red border/ring error state |
| `.label` | Form label |
| `.label--required` | Appends red asterisk |
| `.field-error` | Inline error message row |
| `.field-hint` | Hint text below inputs |
| `.drop-zone` / `.drop-zone-active` | CSV drop target |
| `.progress-track` / `.progress-fill` | Progress bar pair |
| `.badge-*` | Status badges (success, warning, error, info) |

**Typography:**
- Headings: **Cirka** (variable, 100–900 weight) — self-hosted from `src/assets/fonts/`
- Body: **Mulish** (400, 500, 600, 700) — self-hosted

---

## Common Components

All reusable components are in `src/components/common/` and exported from the barrel `src/components/common/index.ts`.

**Import pattern:**
```ts
import { Button, TextInput, Select, Badge, Skeleton } from '@/components/common';
```

### Button

Five variants, three sizes, loading spinner state, leading/trailing icons, full-width mode.

```tsx
<Button variant="primary" size="md" loading={isSubmitting}>Save</Button>
<Button variant="accent" leadingIcon={<Download size={16} />}>Export</Button>
<Button variant="danger" size="sm">Delete</Button>
```

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `variant` | `primary \| secondary \| accent \| ghost \| danger` | `primary` | |
| `size` | `sm \| md \| lg` | `md` | |
| `loading` | `boolean` | `false` | Replaces leading icon with spinner, sets `aria-busy` |
| `leadingIcon` | `ReactNode` | — | Hidden while loading |
| `trailingIcon` | `ReactNode` | — | Always visible |
| `fullWidth` | `boolean` | `false` | |

### Form fields (TextInput, Textarea, Select, Checkbox, RadioGroup)

All field components accept:
- `label` — renders a `<label>` with `htmlFor` wired to the input
- `required` — appends red asterisk to label
- `error` — accepts a React Hook Form `FieldError` object or a plain string; renders inline error with icon
- `hint` — shown below the field when there is no error

```tsx
<TextInput label="Email" required error={errors.email} {...register('email')} />
<Select label="Language" options={languageOptions} error={errors.language} {...register('language')} />
<Checkbox label="I agree to the terms" {...register('terms')} />
```

### Spinner

Used inside Button automatically. Also usable standalone:

```tsx
<Spinner size="md" label="Loading results…" />
```

### Badge

```tsx
<Badge variant="success" dot>Completed</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="warning" size="sm">Processing</Badge>
```

### Skeleton

```tsx
<Skeleton variant="line" lines={3} />   // paragraph placeholder
<Skeleton variant="card" />              // card placeholder
<Skeleton variant="button" />            // button placeholder
<Skeleton variant="circle" width="w-10" height="h-10" />
```

---

## Form Validation

Forms use **React Hook Form + Zod**. Define a schema once — get both runtime validation and the TypeScript type automatically.

```ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type FormData = z.infer<typeof schema>; // { email: string; password: string }

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput label="Email" required error={errors.email} {...register('email')} />
      <TextInput label="Password" type="password" required error={errors.password} {...register('password')} />
      <Button type="submit" loading={isSubmitting} fullWidth>Sign in</Button>
    </form>
  );
}
```

**Rules:**
- All form schemas live in the same file as the form component or in a co-located `*.schema.ts` file
- Never use uncontrolled HTML validation attributes (`required`, `minLength`) on inputs that are managed by RHF — Zod handles all validation
- `error` prop on field components accepts `FieldError` directly — no need to extract `.message` manually

---

## Error Handling & Notifications

### ErrorBoundary

`ErrorBoundary` is a React class component that catches unhandled render errors.

It is applied in **two places**:

1. `src/providers/AppProvider.tsx` — wraps the entire app including the Redux provider tree
2. `src/App.tsx` — wraps the `<Routes>` outlet specifically, providing route-level recovery

When an error is caught, it renders a themed fallback with the error message, a "Reload page" button, and a "Try again" button that resets the boundary state.

```tsx
// Custom fallback for a specific subtree:
<ErrorBoundary fallback={(err, reset) => (
  <div>
    <p>{err.message}</p>
    <button onClick={reset}>Retry</button>
  </div>
)}>
  <SomeFeature />
</ErrorBoundary>
```

### Toast notifications

Toast state lives in `src/redux/toastSlice.ts`. Dispatch from any component using the convenience helpers:

```ts
import { toast } from '@/redux/toastSlice';
import { useAppDispatch } from '@/redux/hooks';

const dispatch = useAppDispatch();

dispatch(toast.success({ message: 'Translation complete!' }));
dispatch(toast.error({ message: 'API call failed. Please try again.' }));
dispatch(toast.info({ message: 'Job queued for processing.' }));
dispatch(toast.warning({ message: 'File exceeds recommended size.' }));
```

- `success`, `info`, `warning` auto-dismiss after 4 seconds
- `error` toasts persist until manually dismissed (duration: 0)
- `ToastContainer` is mounted once in `AppProvider` — do not add it to individual pages

---

## Aliases & Path Resolution

Both Vite and TypeScript are configured with these aliases:

| Alias | Resolves to |
|-------|-------------|
| `@/*` | `src/*` |
| `services/*` | `src/services/*` |
| `types/*` | `src/types/*` |
| `utils/*` | `src/utils/*` |
| `contexts/*` | `src/contexts/*` |
| `themes/*` | `src/themes/*` |

**Rule:** All imports must use `@/` aliases. Relative imports (`../../`) are not permitted.

```ts
// Correct
import { Button } from '@/components/common';
import { useAppSelector } from '@/redux/hooks';
import { ENDPOINTS } from '@/services/api/endpoints';

// Wrong
import { Button } from '../../components/common';
```

---

## Environment Variables

All variables are prefixed `VITE_` for Vite client exposure via `import.meta.env`.

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_REACT_APP_MTSTUDIO_ENDPOINT` | Yes | Base URL for the MTStudio backend API |

Types are declared in `src/vite-env.d.ts`. Add new variables there whenever introducing them. Copy `.env.example` to `.env` before running locally. Never commit `.env`.

---

## Best Practices

### Components
- One component per file, named identically to the file
- Pages (`pages/`) compose components — no business logic
- Always use components from `@/components/common` before writing custom markup for buttons, inputs, selects, badges, skeletons, or spinners
- Group by domain: `landing/`, `dashboard/`, `common/`

### TypeScript
- All props require an explicit `interface` or `type`
- Avoid `any` — use `unknown` and narrow, or define a type in `services/types/`
- API response shapes belong in `services/types/`, never inside component files
- Zod schema types are inferred — never duplicate them manually

### State
- Server state (fetch/mutate) → RTK Query
- Global UI state shared across components → Redux slice
- Local component state → `useState`
- Never dispatch from service files — only from components or custom hooks

### Styling
- Use component utility classes first (`.btn-primary`, `.card`, `.input`, etc.) before writing raw Tailwind utilities
- Follow the colour palette — do not introduce ad-hoc colour classes outside `index.css`
- Dark text (`text-primary-900` or `text-gray-900`) on amber/light backgrounds; white text only on `primary-500` or darker
- Use `cn()` from `@/utils/cn` for all conditional class merging

### Git
- Branch naming: `feat/`, `fix/`, `chore/` prefix
- Commit messages: concise, describe what changed
- Do not commit `.env`, `dist/`, or `node_modules/`
