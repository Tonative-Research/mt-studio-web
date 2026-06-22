#!/usr/bin/env node
/**
 * check-no-dispatch-in-services.mjs
 *
 * Enforces: "Never dispatch from service files —
 * only from components or custom hooks."
 *
 * Scans all files in src/services/ and fails if any of them
 * call dispatch( or useAppDispatch.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const SERVICES_DIR = new URL('../src/services', import.meta.url)
  .pathname.replace(/^\/([A-Z]:)/, '$1');

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
  const src = readFileSync(filePath, 'utf8');
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    if (/\bdispatch\s*\(/.test(line) || /useAppDispatch/.test(line)) {
      VIOLATIONS.push(
        `  ${filePath.replace(SERVICES_DIR, 'src/services')}:${i + 1}\n    ${line.trim()}`,
      );
    }
  });
}

walk(SERVICES_DIR);

if (VIOLATIONS.length > 0) {
  console.error('\n❌ Dispatch in service file (README rule: Best Practices — State)\n');
  console.error('The following service files call dispatch or useAppDispatch.\n');
  console.error('Service files must not dispatch to Redux — do that in components or hooks:\n');
  VIOLATIONS.forEach(v => console.error(v));
  process.exit(1);
}

console.log('✓ Service files: no dispatch calls found');
