import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  // Explicit root avoids drive-letter casing mismatches on Windows shells.
  root,
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    root,
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
