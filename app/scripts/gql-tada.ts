import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = resolve(appDir, "node_modules/gql.tada/bin/cli.js");
const args = process.argv.slice(2);

const result = spawnSync("node", [cliPath, ...args], {
  cwd: process.cwd(),
  env: process.env,
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"],
});

if (result.error && result.status === null) {
  throw result.error;
}

if (result.status === 0) {
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  process.exit(0);
}

const output = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
const isPostSuccessCleanupBug =
  output.includes("TypeError: t.unref is not a function") &&
  (output.includes("✓ Schema was generated successfully") ||
    output.includes("✓ Introspection output was generated successfully") ||
    output.includes("✓ No problems found"));

if (isPostSuccessCleanupBug) {
  process.stdout.write(result.stdout ?? "");
  process.exit(0);
}

process.stdout.write(result.stdout ?? "");
process.stderr.write(result.stderr ?? "");
process.exit(result.status ?? 1);
