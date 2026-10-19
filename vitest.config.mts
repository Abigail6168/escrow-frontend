import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Native Vite tsconfig-path resolution. The 40+ test files in __tests__/
// rely on `@/app/...` aliases defined in tsconfig.json (`paths: { "@/*":
// ["./*"] }`); this `resolve.tsconfigPaths` flag replaces the legacy
// `vite-tsconfig-paths` plugin. The flag is nested under `resolve` because
// this Vite version's `ViteUserConfigExport` type only exposes it there
// (the top-level shorthand `tsconfigPaths: true` is rejected by tsc as an
// unknown property and by vitest startup at runtime).
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    // Default to the lightweight Node environment so pure-TS helper tests
    // (app/lib/* mapping, sanitize, badges, export, toasts, etc.) skip jsdom
    // startup entirely. Component / rendering tests opt in below.
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    // Apply jsdom only to files that actually render React components or
    // interact with the DOM / browser APIs.
    environmentMatchGlobs: [
      // All .tsx test files use React Testing Library and need jsdom.
      ["**/*.test.tsx", "jsdom"],
      // Component-level __tests__ subdirectories.
      ["app/components/__tests__/**", "jsdom"],
      // Any test file that explicitly opts in via the inline docblock comment
      // (e.g. // @vitest-environment jsdom) is handled automatically by Vitest
      // — no glob entry needed for those.
    ],
    server: {
      deps: {
        // `@stellar/freighter-api` ships CommonJS (main: build/index.min.js,
        // no "exports"/"module"), so its named exports cannot be resolved
        // statically. `@creit.tech/stellar-wallets-kit` re-exports them, which
        // is how `WalletContext` pulls them in — every test that renders a
        // context-dependent component hits this. Inlining both routes them
        // through the dep optimizer, which interops the named exports.
        inline: ["@stellar/freighter-api", /@creit\.tech\/stellar-wallets-kit/],
      },
    },
  },
});
