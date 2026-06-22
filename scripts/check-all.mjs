#!/usr/bin/env node
/**
 * check-all.mjs
 *
 * Runs every README-enforcement script in sequence.
 * Used by the pre-commit hook.
 *
 * Each individual script exits with code 1 on failure — this runner
 * collects them all and summarises at the end so developers see every
 * violation at once rather than fixing one at a time.
 */

import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));

const checks = [
  { name: "No .env committed", script: "check-no-env-committed.mjs" },
  { name: "Import aliases (@/)", script: "check-imports.mjs" },
  { name: "Redux typed hooks", script: "check-redux-hooks.mjs" },
  {
    name: "No dispatch in services",
    script: "check-no-dispatch-in-services.mjs",
  },
  // { name: 'CSS rules (forms/input)',     script: 'check-css-rules.mjs' },
];

const results = [];
let anyFailed = false;

for (const check of checks) {
  const result = spawnSync("node", [join(__dir, check.script)], {
    stdio: "inherit",
    encoding: "utf8",
  });

  const passed = result.status === 0;
  if (!passed) anyFailed = true;
  results.push({ name: check.name, passed });
}

// Summary line
console.log("\n─────────────────────────────────────────");
console.log(" Pre-commit checks summary");
console.log("─────────────────────────────────────────");
for (const { name, passed } of results) {
  console.log(`  ${passed ? "✓" : "✗"} ${name}`);
}
console.log("─────────────────────────────────────────\n");

if (anyFailed) {
  console.error("Commit blocked. Fix the issues above and try again.\n");
  process.exit(1);
}

console.log("All checks passed. Proceeding with commit.\n");
