import { defineConfig } from "vitest/config";
import path from "node:path";

try {
  process.loadEnvFile(path.resolve(__dirname, ".env.local"));
} catch {
  // .env.local missing is fine locally if the keys are already exported some other way
}

// Deliberately separate from vitest.config.ts: these tests make real,
// billed Anthropic API calls and take several seconds each, so they must
// never run as part of the fast/free `npm test`. Only an explicit
// `npm run eval:assistant` picks this config up.
export default defineConfig({
  test: {
    environment: "node",
    include: ["scripts/eval/**/*.eval.ts"],
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@vismap": path.resolve(__dirname, "./src/vismap"),
    },
  },
});
