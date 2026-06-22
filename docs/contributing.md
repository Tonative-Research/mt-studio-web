# Contributing

## Best practices

### Components

- One component per file, named identically to the file (`Button.tsx` exports `Button`)
- Pages (`src/pages/`) are thin shells — they compose components and set layout. No business logic
- Always use components from `@/components/common` before writing custom markup for buttons, inputs, selects, badges, skeletons, or spinners
- Group by domain: `landing/`, `dashboard/`, `common/`
- Shared/reusable components go in `components/common/`

### TypeScript

- All props require an explicit `interface` or `type` — no inline anonymous types on component signatures
- Avoid `any` — use `unknown` and narrow, or define a proper type in `services/types/`
- API response shapes live in `services/types/`, never inside component files
- Zod schema types are inferred via `z.infer<typeof schema>` — never duplicate them manually

### State

- Server data (fetch / mutate) → RTK Query
- Global UI state shared across components → Redux slice
- Component-only state → `useState`
- Never dispatch from service files — only from components or custom hooks
- Always use `useAppSelector` / `useAppDispatch` from `@/redux/hooks`, never the untyped originals

### Styling

- Use the component utility classes (`.btn-primary`, `.card`, `.input`, etc.) before writing raw Tailwind
- Follow the colour palette defined in `src/index.css` — do not introduce ad-hoc colour classes
- Dark text (`text-primary-900` or `text-gray-900`) on amber/light backgrounds; white text only on `primary-500` or darker
- Use `cn()` from `@/utils/cn` for conditional class merging, never template literals

### Git

- Branch naming: `feat/`, `fix/`, `chore/` prefix — e.g. `feat/upload-csv`
- Commit messages: concise, describe what changed, not why
- Do not commit `.env`, `dist/`, or `node_modules/`
- Use `git commit --no-verify` only on WIP feature branch commits, never on `main`

---

## Pre-commit hooks (Husky)

Husky runs automated checks before every commit and push. They are installed automatically on `npm install`.

| Hook | Triggers on | Runs |
|---|---|---|
| `pre-commit` | `git commit` | README rule checks + TypeScript + lint-staged |
| `pre-push` | `git push` | Full production build |

### Automated checks

Five scripts map directly to README rules:

| Check | Script | Rule |
|---|---|---|
| No `.env` committed | `check-no-env-committed.mjs` | Environment Variables |
| `@/` alias imports only | `check-imports.mjs` | Architecture — Aliases |
| No raw `useSelector`/`useDispatch` | `check-redux-hooks.mjs` | State Management |
| No `dispatch()` in `services/` | `check-no-dispatch-in-services.mjs` | Best Practices — State |
| CSS rules (`strategy:class`, raw `.input`, no `@apply` chaining) | `check-css-rules.mjs` | Styling — Critical rules |

TypeScript (`tsc --noEmit -p tsconfig.app.json`) runs as a full project check in the pre-commit hook — not via lint-staged.

> **Why TypeScript is not in lint-staged:** `tsc -p <config>` and per-file arguments are mutually exclusive — passing both raises `TS5042`. TypeScript must check the whole project at once to resolve cross-file types, so it runs as a single whole-project step. The CSS check has no such constraint and runs per-file via lint-staged.

### Running checks manually

```bash
npm run check    # all README rule checks
npm run lint     # TypeScript only
npm run build    # full production build (same as pre-push)
```

### Passing output

```
Running pre-commit checks...

✓ Env files: no .env files staged
✓ Import aliases: all 53 source files use @/ correctly
✓ Redux hooks: no direct useSelector/useDispatch imports found
✓ Service files: no dispatch calls found
✓ CSS rules: strategy:class present, .input is raw CSS, no @apply component chaining

─────────────────────────────────────────
 Pre-commit checks summary
─────────────────────────────────────────
  ✓ No .env committed
  ✓ Import aliases (@/)
  ✓ Redux typed hooks
  ✓ No dispatch in services
  ✓ CSS rules (forms/input)
─────────────────────────────────────────

All checks passed. Proceeding with commit.
```

### Blocked commit example

```
❌ Relative import violation (README rule: use @/ aliases)

The following files use deep relative imports (../../). Use @/ instead:

  src/components/dashboard/Dashboard.tsx:3
    import { Button } from "../../common/Button"

Example fix:
  ✗  import { Button } from "../../common/Button"
  ✓  import { Button } from "@/components/common"

Commit blocked. Fix the issues above and try again.
```

### Adding a new check

1. Create `scripts/check-your-rule.mjs` — exit `1` on failure, `0` on success
2. Add a JSDoc comment at the top naming the README rule it enforces
3. Add it to the `checks` array in `scripts/check-all.mjs`
