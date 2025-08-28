import * as path from "path";
import { getAllJsFiles, createFileInfo, logProgress, FileInfo } from "./utils.js";
import { MarkdownGenerator } from "./markdown-generator.js";

export interface ProcessorConfig {
	sourceDir: string;
	outputDir: string;
	concurrency?: number;
	jsdocOptions?: any;
}

export class FileProcessor {
	private readonly config: Required<ProcessorConfig>;
	private readonly generator: MarkdownGenerator;

	constructor(config: ProcessorConfig) {
		this.config = {
			concurrency: 5,
			jsdocOptions: {},
			...config,
		};

		// 使用 clean 模板（无锚点链接）
		this.generator = MarkdownGenerator.createWithCleanTemplates(this.config.jsdocOptions);
	}

	async processAllFiles(): Promise<void> {
		console.log("🔍 Scanning for JavaScript files...");
		const jsFiles = await getAllJsFiles(this.config.sourceDir);

		if (jsFiles.length === 0) {
			console.log("❌ No JavaScript files found in source directory");
			return;
		}

		console.log(`📁 Found ${jsFiles.length} JavaScript files`);

		const fileInfos = jsFiles.map((filePath) => createFileInfo(filePath, this.config.sourceDir, this.config.outputDir));

		console.log("📖 Generating markdown documentation...");
		await this.processBatch(fileInfos);

		console.log("✅ Documentation generation completed!");
		this.printSummary(fileInfos);
	}

	private async processBatch(fileInfos: FileInfo[]): Promise<void> {
		const batches = this.createBatches(fileInfos, this.config.concurrency);

		for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
			const batch = batches[batchIndex];
			const promises = batch.map(async (fileInfo, index) => {
				const globalIndex = batchIndex * this.config.concurrency + index + 1;
				logProgress(globalIndex, fileInfos.length, fileInfo.relativePath);

				const markdown = await this.generator.generateMarkdown(fileInfo.sourcePath);
				await this.generator.saveMarkdown(fileInfo, markdown);
			});

			await Promise.all(promises);
		}
	}

	private createBatches<T>(items: T[], batchSize: number): T[][] {
		const batches: T[][] = [];
		for (let i = 0; i < items.length; i += batchSize) {
			batches.push(items.slice(i, i + batchSize));
		}
		return batches;
	}

	private printSummary(fileInfos: FileInfo[]): void {
		console.log("\n📊 Summary:");
		console.log(`   Source directory: ${this.config.sourceDir}`);
		console.log(`   Output directory: ${this.config.outputDir}`);
		console.log(`   Files processed: ${fileInfos.length}`);

		const groupedByDir = fileInfos.reduce(
			(acc, fileInfo) => {
				const dir = path.dirname(fileInfo.relativePath);
				acc[dir] = (acc[dir] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		console.log("\n   Files by directory:");
		Object.entries(groupedByDir)
			.sort(([a], [b]) => a.localeCompare(b))
			.forEach(([dir, count]) => {
				console.log(`     ${dir}: ${count} files`);
			});
	}
}
