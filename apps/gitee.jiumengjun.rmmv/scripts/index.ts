#!/usr/bin/env node

import * as path from "path";
import { fileURLToPath } from "url";
import { FileProcessor } from "./file-processor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main(): Promise<void> {
	try {
		console.log("🚀 Starting JSDoc to Markdown generation...");
		console.log("=====================================\n");

		const projectRoot = path.resolve(__dirname, "..");
		const sourceDir = path.join(projectRoot, "sourceCodeFile");
		const outputDir = path.join(projectRoot, "docs", "jsdoc");

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
				"heading-depth": 1,
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

if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch(console.error);
}
