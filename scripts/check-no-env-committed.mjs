#!/usr/bin/env node
/**
 * check-no-env-committed.mjs
 *
 * Enforces: "Never commit .env"
 *
 * Checks the git staging area for any .env file (but not .env.example).
 * Fails the commit if one is found.
 */

import { execSync } from 'child_process';

let staged;
try {
  staged = execSync('git diff --cached --name-only', { encoding: 'utf8' });
} catch {
  // Not a git repo or git not available — skip silently
  console.log('✓ Env files: git not available, skipping check');
  process.exit(0);
}

const violations = staged
  .split('\n')
  .map(f => f.trim())
  .filter(f => f === '.env' || (f.startsWith('.env.') && !f.startsWith('.env.example')));

if (violations.length > 0) {
  console.error('\n❌ Committed .env file detected (README rule: Environment Variables)\n');
  console.error('The following secret files are staged for commit:\n');
  violations.forEach(f => console.error(`  ${f}`));
  console.error('\nAdd these to .gitignore and remove them from staging:');
  console.error('  git rm --cached .env\n');
  process.exit(1);
}

console.log('✓ Env files: no .env files staged');
