#!/usr/bin/env node
/**
 * check-imports.mjs
 *
 * Enforces: "All imports must use @/ aliases. Relative imports (../../) are not permitted."
 *
 * Scans all .ts/.tsx files in src/ and fails if any import goes up more than
 * one directory level (i.e. contains "../..").
 * Single-level relative imports like "./sibling" are still allowed for
 * co-located files (e.g. a component importing its own types file).
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';

const ROOT = new URL('../src', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
const VIOLATIONS = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
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
    // Match any import/export/require that uses ../..
    if (/from\s+['"]\.\.\/\.\./.test(line) || /require\(['"]\.\.\/\.\./.test(line)) {
      VIOLATIONS.push(`  ${filePath.replace(ROOT, 'src')}:${i + 1}\n    ${line.trim()}`);
    }
  });
}

walk(ROOT);

if (VIOLATIONS.length > 0) {
  console.error('\n❌ Relative import violation (README rule: use @/ aliases)\n');
  console.error('The following files use deep relative imports (../../). Use @/ instead:\n');
  VIOLATIONS.forEach(v => console.error(v));
  console.error('\nExample fix:');
  console.error('  ✗  import { foo } from "../../utils/cn"');
  console.error('  ✓  import { foo } from "@/utils/cn"\n');
  process.exit(1);
}

console.log(`✓ Import aliases: all ${countFiles(ROOT)} source files use @/ correctly`);

function countFiles(dir, count = 0) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) count = countFiles(full, count);
    else if (['.ts', '.tsx'].includes(extname(entry))) count++;
  }
  return count;
}
