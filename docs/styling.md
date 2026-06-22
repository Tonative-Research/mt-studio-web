# Styling & Theme

MTStudio uses **Tailwind CSS v4** with a CSS-first configuration — there is no `tailwind.config.js`. All design tokens are defined in `src/index.css` inside `@theme {}`.

## Colour palette

| Token | Approx. hex | Use |
|---|---|---|
| `primary-500` | `#025464` | Primary actions, header backgrounds, active states |
| `primary-900` | Very dark teal | Dark section backgrounds (hero, footer, app header) |
| `accent-500` | `#E57C23` | CTA buttons, active nav indicators, highlights |
| `surface` | Near-white teal tint | Page and card backgrounds |
| `gray-*` | Neutral scale | Body text, borders, subtle fills |

**Accessibility rule:** `btn-accent` uses `text-primary-900` (dark) on the amber background — ~4.9:1 contrast ratio, passing WCAG AA. Never use `text-white` on `accent-500` or lighter accent shades.

## Typography

Both fonts are self-hosted from `src/assets/fonts/`.

| Font | Weights | Usage |
|---|---|---|
| **Cirka** | Variable 100–900 | Headings (`h1`–`h6`) |
| **Mulish** | 400, 500, 600, 700 | Body text, UI labels |

## Component utility classes

These classes are defined in `src/index.css` under `@layer components`. Use them before writing raw Tailwind utilities.

### Buttons

| Class | Description |
|---|---|
| `.btn-primary` | Teal filled — primary actions |
| `.btn-secondary` | White outlined — secondary actions |
| `.btn-accent` | Amber filled with dark text — CTAs and highlights |

Prefer the `Button` React component over these classes directly — see [components.md](./components.md).

### Cards

| Class | Description |
|---|---|
| `.card` | White card with border and shadow |
| `.glass-card` | Semi-transparent card with backdrop blur |

### Form fields

| Class | Description |
|---|---|
| `.input` | Base style for `<input>`, `<textarea>`, `<select>` |
| `.input--error` | Red border and focus ring — error state |
| `.label` | Form field label |
| `.label--required` | Appends a red asterisk after the label text |
| `.field-error` | Inline error message row with icon |
| `.field-hint` | Hint text below a field when there is no error |

Prefer the `TextInput`, `Textarea`, `Select` React components over applying these classes manually — they wire up labels, errors, and accessibility attributes automatically.

### Other

| Class | Description |
|---|---|
| `.drop-zone` / `.drop-zone-active` | CSV drag-and-drop target area |
| `.progress-track` / `.progress-fill` | Progress bar pair |
| `.badge-info` / `.badge-success` / `.badge-warning` / `.badge-error` | Status badges |

## Critical CSS rules — do not break

### 1. `@tailwindcss/forms` must use `strategy: class`

```css
@plugin "@tailwindcss/forms" { strategy: class }
```

Without this, the plugin sets `border-radius: 0` on all bare `<input>` elements at the base layer, overriding our `.input` class and making fields render as unstyled flat boxes. The `class` strategy restricts the plugin to only style `.form-input` / `.form-select` / `.form-textarea` — it never touches elements using our `.input` class.

### 2. `.input` must be written as raw CSS

The `.input` class uses raw CSS properties (`border-radius: 0.5rem`, etc.) not `@apply` utilities. In Tailwind v4, `@apply` inside `@layer components` can be overridden by plugin base resets. Raw CSS inside a layer wins unconditionally.

### 3. No `@apply` chaining between component classes

In Tailwind v4, `@apply` can only reference utility classes — not other `@layer components` classes. This is wrong and will break the build:

```css
/* BROKEN — @apply cannot reference another component class */
.badge-success {
  @apply badge bg-green-100 text-green-700;
}
```

Write each component class in full instead:

```css
/* Correct — self-contained */
.badge-success {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #dcfce7;
  color: #15803d;
}
```

All three rules are enforced by the pre-commit hook via `scripts/check-css-rules.mjs`.

## `cn()` utility

Use `cn()` from `@/utils/cn` for all conditional class merging. Never use template literals for conditional classes.

```ts
import { cn } from '@/utils/cn';

// Correct
className={cn('base-class', isError && 'input--error', className)}

// Wrong
className={`base-class ${isError ? 'input--error' : ''} ${className}`}
```
