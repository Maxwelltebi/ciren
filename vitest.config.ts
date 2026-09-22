import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Avoid child-process startup timeouts on constrained Windows environments.
    pool: "threads",
    maxWorkers: 1,
    // Multi-step user-event tests need headroom on slower Windows/CI hosts.
    testTimeout: 30000,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
