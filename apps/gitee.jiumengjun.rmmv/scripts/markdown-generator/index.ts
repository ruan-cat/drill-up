#!/usr/bin/env node

import * as path from "path";
import { FileProcessor } from "./file-processor.js";
import { createProjectPaths } from "./utils.js";

async function main(): Promise<void> {
	try {
		console.log("🚀 Starting JSDoc to Markdown generation...");
		console.log("=====================================\n");

		const paths = createProjectPaths();
		const projectRoot = paths.getProjectRoot();
		const sourceDir = paths.getSourceDir();
		const outputDir = paths.getOutputDir();

		console.log(`📂 Project root: ${projectRoot}`);
		console.log(`📂 Source directory: ${sourceDir}`);
		console.log(`📂 Output directory: ${outputDir}\n`);

		const processor = new FileProcessor({
			sourceDir,
			outputDir,
			concurrency: 3, // 并发数设置为3，避免过载
			jsdocOptions: {
				"example-lang": "javascript",
				"param-list-format": "table",
				"property-list-format": "table",
				"member-index-format": "grouped",
				"module-index-format": "table",
				"global-index-format": "table",
				"heading-depth": 2,
				"no-gfm": false,
				separators: true,
				"clever-links": true,
			},
		});

		await processor.processAllFiles();

		console.log("\n🎉 All done! Your documentation is ready.");
		console.log(`   Check the output in: ${outputDir}`);
	} catch (error) {
		console.error("❌ Error during documentation generation:");
		console.error(error);
		process.exit(1);
	}
}

main();
