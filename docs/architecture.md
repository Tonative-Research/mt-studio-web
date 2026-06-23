# Architecture

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
│   ├── DashboardPage.tsx            # Route: /dashboard
│   ├── HistoryPage.tsx              # Route: /dashboard/history
│   └── ComponentShowcasePage.tsx    # Route: /dev/components (dev only)
│
├── components/
│   ├── Header.tsx                   # App header (dashboard pages only)
│   ├── common/                      # Reusable UI primitives — use these everywhere
│   │   ├── index.ts                 # Barrel export — import from here, not individual files
│   │   ├── Button.tsx
│   │   ├── Spinner.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx
│   │   ├── TextInput.tsx
│   │   ├── Textarea.tsx
│   │   ├── Select.tsx
│   │   ├── Checkbox.tsx
│   │   ├── RadioGroup.tsx
│   │   ├── ToastContainer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── ProcessingStatus.tsx
│   ├── landing/                     # Components used exclusively on the landing page
│   │   ├── LandingNav.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── SupportedLanguages.tsx
│   │   ├── CallToAction.tsx
│   │   └── LandingFooter.tsx
│   └── dashboard/                   # Components used on the dashboard
│       ├── Dashboard.tsx
│       ├── UploadZone.tsx
│       ├── EngineConfigForm.tsx
│       ├── HistoryContent.tsx       # Session history list with expandable detail rows
│       └── PreviewTable.tsx
│
├── providers/
│   ├── AppProvider.tsx              # Redux Provider + PersistGate + ErrorBoundary + ToastContainer
│   └── index.ts
│
├── redux/                           # Global client state (Redux Toolkit slices)
│   ├── store.ts                     # Store config, persistence, middleware
│   ├── hooks.ts                     # Typed useAppDispatch / useAppSelector
│   ├── baseApiSlice.ts              # RTK Query base API (endpoints injected per feature)
│   ├── appSlice.ts
│   ├── authSlice.ts
│   ├── accountSlice.ts
│   ├── translateSlice.ts
│   ├── uploadSlice.ts
│   ├── modelConfigSlice.ts
│   └── toastSlice.ts
│
├── services/
│   ├── api/
│   │   ├── endpoints.ts             # All URL constants
│   │   ├── account.ts
│   │   ├── translate.ts
│   │   ├── model.ts
│   │   ├── export.ts
│   │   └── country.ts
│   └── types/                       # TypeScript interfaces for API shapes
│       ├── account.ts
│       ├── translate.ts
│       ├── upload.ts
│       └── model.ts
│
├── utils/
│   ├── cn.ts                        # Class name merge utility
│   └── sessionStorage.ts            # localStorage helpers for session history (getSessions, saveSession, updateSessionStatus)
│
└── scripts/                         # Pre-commit enforcement scripts
    ├── check-all.mjs
    ├── check-imports.mjs
    ├── check-css-rules.mjs
    ├── check-redux-hooks.mjs
    ├── check-no-dispatch-in-services.mjs
    └── check-no-env-committed.mjs
```

## Routing

Routes are defined in `src/App.tsx` using React Router v7. The router outlet is wrapped in `ErrorBoundary` so any page-level render crash shows a recovery UI instead of a blank screen.

```
/                   → pages/LandingPage.tsx       public marketing page
/dashboard          → pages/DashboardPage.tsx      app (no auth gate yet)
/dashboard/history  → pages/HistoryPage.tsx         session history (localStorage-backed)
/dev/components     → ComponentShowcasePage.tsx    dev only — never in production
```

**Convention:** Pages live in `src/pages/` and are thin shells. They compose components and add page-level layout. No business logic lives in a page file.

## Aliases & Path Resolution

Both Vite (`vite.config.ts`) and TypeScript (`tsconfig.json`) are configured with these aliases:

| Alias | Resolves to |
|---|---|
| `@/*` | `src/*` |
| `services/*` | `src/services/*` |
| `utils/*` | `src/utils/*` |
| `types/*` | `src/types/*` |
| `contexts/*` | `src/contexts/*` |
| `themes/*` | `src/themes/*` |

**Rule:** All imports must use `@/` aliases. Deep relative imports (`../../`) are not permitted and are blocked by the pre-commit hook.

```ts
// Correct
import { Button } from '@/components/common';
import { useAppSelector } from '@/redux/hooks';

// Wrong — blocked by pre-commit
import { Button } from '../../components/common';
```

## Environment Variables

All variables are prefixed `VITE_` so Vite exposes them via `import.meta.env`.

| Variable | Required | Description |
|---|---|---|
| `VITE_REACT_APP_MTSTUDIO_ENDPOINT` | Yes | Base URL for the MTStudio backend API |

Types are declared in `src/vite-env.d.ts`. Add new variables there whenever you introduce them. Copy `.env.example` to `.env` before running locally. Never commit `.env`.
