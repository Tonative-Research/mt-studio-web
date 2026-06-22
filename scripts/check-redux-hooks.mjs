#!/usr/bin/env node
/**
 * check-redux-hooks.mjs
 *
 * Enforces: "Always use the typed hooks from @/redux/hooks —
 * never the untyped useSelector / useDispatch directly."
 *
 * Scans all .ts/.tsx files in src/ (except the hooks definition file itself)
 * and fails if any file imports useSelector or useDispatch from react-redux.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('../src', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const HOOKS_FILE = 'redux/hooks.ts';
const VIOLATIONS = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full);
    } else if (['.ts', '.tsx'].includes(extname(entry))) {
      check(full);
    }
  }
}

function check(filePath) {
  // Skip the hooks definition file itself
  if (filePath.replace(/\\/g, '/').endsWith(HOOKS_FILE)) return;

  const src = readFileSync(filePath, 'utf8');
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    // Catch: import { useSelector ... } from 'react-redux'
    // or:    import { useDispatch ... } from 'react-redux'
    if (
      /from\s+['"]react-redux['"]/.test(line) &&
      /useSelector|useDispatch/.test(line)
    ) {
      VIOLATIONS.push(
        `  ${filePath.replace(ROOT, 'src')}:${i + 1}\n    ${line.trim()}`,
      );
    }
  });
}

walk(ROOT);

if (VIOLATIONS.length > 0) {
  console.error('\n❌ Untyped Redux hook violation (README rule: State Management)\n');
  console.error('The following files import useSelector or useDispatch directly from react-redux.\n');
  console.error('Use the typed wrappers from @/redux/hooks instead:\n');
  VIOLATIONS.forEach(v => console.error(v));
  console.error('\nExample fix:');
  console.error('  ✗  import { useSelector, useDispatch } from "react-redux"');
  console.error('  ✓  import { useAppSelector, useAppDispatch } from "@/redux/hooks"\n');
  process.exit(1);
}

console.log('✓ Redux hooks: no direct useSelector/useDispatch imports found');
