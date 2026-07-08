import { defineConfig } from "tsup";

// One entry, no runtime dependencies. Portable dual ESM + CJS + type declarations.
// The email contract (`EmailMessage`) is imported as a type and INLINED into the
// declarations, so consumers need nothing installed beyond this package.
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: ["@treecombinator/sdk-server-email"] },
  clean: true,
  sourcemap: true,
  target: "es2022",
  outDir: "dist",
});
