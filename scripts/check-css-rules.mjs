#!/usr/bin/env node
/**
 * check-css-rules.mjs
 *
 * Enforces three CSS rules from the README:
 *
 * 1. `strategy: class` must be present in index.css — prevents the forms
 *    plugin from zeroing border-radius on bare inputs.
 *
 * 2. `.input` class must not use `@apply` — must be raw CSS to guarantee
 *    styles are not overridden by plugin base resets.
 *
 * 3. `@apply` must not reference another component class name — e.g.
 *    `@apply badge` inside `.badge-success` is forbidden in Tailwind v4.
 *    Component class names are: badge, btn-primary, btn-secondary, btn-accent,
 *    card, glass-card, input, label, drop-zone, progress-track, progress-fill.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const CSS_PATH = join(ROOT, 'src', 'index.css');

let css;
try {
  css = readFileSync(CSS_PATH, 'utf8');
} catch {
  console.error(`❌ Could not read ${CSS_PATH}`);
  process.exit(1);
}

const errors = [];

// ── Rule 1: strategy: class must be present ───────────────────────────────
if (!css.includes('strategy: class')) {
  errors.push(
    'Rule 1 — Missing `strategy: class` on @tailwindcss/forms plugin.\n' +
    '  Without it, the forms plugin sets border-radius:0 on all inputs.\n' +
    '  Fix: @plugin "@tailwindcss/forms" { strategy: class }',
  );
}

// ── Rule 2: .input class must not use @apply ──────────────────────────────
// Find the .input { ... } block (not textarea.input or .input--error)
const inputBlockMatch = css.match(/(?<![a-z.])\.input\s*\{([^}]+)\}/);
if (inputBlockMatch) {
  const inputBlock = inputBlockMatch[1];
  if (/@apply/.test(inputBlock)) {
    errors.push(
      'Rule 2 — `.input` class uses @apply.\n' +
      '  The .input class must be written as raw CSS properties, not @apply utilities.\n' +
      '  Reason: @apply utilities can lose to plugin base resets in Tailwind v4.',
    );
  }
}

// ── Rule 3: @apply must not reference component class names ───────────────
const COMPONENT_CLASSES = [
  'badge', 'btn-primary', 'btn-secondary', 'btn-accent',
  'card', 'glass-card', 'input', 'label',
  'drop-zone', 'progress-track', 'progress-fill',
];

const lines = css.split('\n');
lines.forEach((line, i) => {
  const applyMatch = line.match(/@apply\s+(.+)/);
  if (!applyMatch) return;
  const applied = applyMatch[1];
  for (const cls of COMPONENT_CLASSES) {
    // Match the class name as a whole word in the @apply list
    if (new RegExp(`(?<![a-z-])${cls}(?![a-z-])`).test(applied)) {
      errors.push(
        `Rule 3 — Line ${i + 1}: \`@apply ${cls}\` references a component class.\n` +
        `  In Tailwind v4, @apply cannot reference @layer components classes.\n` +
        `  Fix: copy the styles from .${cls} directly into this rule instead.`,
      );
    }
  }
});

if (errors.length > 0) {
  console.error('\n❌ CSS rule violations (README: Styling & Theme)\n');
  errors.forEach((e, i) => console.error(`${i + 1}. ${e}\n`));
  process.exit(1);
}

console.log('✓ CSS rules: strategy:class present, .input is raw CSS, no @apply component chaining');
