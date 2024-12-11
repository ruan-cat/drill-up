import { defineConfig } from "tsup";

export default defineConfig({
	// entry: ["./src/rmmv-code-ts/index.ts"],
	// entry: ["./src/rmmv-code-ts/rpg_core/Utils.ts"],
	sourcemap: false,
	outDir: "dist",
	format: ["iife", "cjs"],
	clean: true,
	dts: false,
	tsconfig: "./tsconfig.json",
	target: "es5",
});
