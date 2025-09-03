import jsdoc2md from "jsdoc-to-markdown";
import * as fs from "fs/promises";
import * as path from "path";
import { ensureDirectoryExists, FileInfo, logProgress, getDirname } from "./utils.js";
import { TemplateManager, TemplateManagerConfig, PresetTemplate } from "./template-manager.js";

// ES 模块中获取 __dirname 的替代方案
const __dirname = getDirname(import.meta.url);

type JsdocOptions = {
	"example-lang"?: string;
	"param-list-format"?: string;
	"property-list-format"?: string;
	"member-index-format"?: string;
	"module-index-format"?: string;
	"global-index-format"?: string;
	"heading-depth"?: number;
	"no-gfm"?: boolean;
	separators?: boolean;
	files?: string[];
	partial?: string[];
	template?: string;
};

export class MarkdownGenerator {
	private readonly options: JsdocOptions;
	private readonly templateManager: TemplateManager;

	constructor(options: Partial<JsdocOptions> = {}, templateConfig?: Partial<TemplateManagerConfig>) {
		this.options = {
			"example-lang": "js",
			"param-list-format": "table",
			"property-list-format": "table",
			"member-index-format": "grouped",
			"module-index-format": "table",
			"global-index-format": "table",
			"heading-depth": 2,
			"no-gfm": false,
			separators: true,
			...options,
		};

		this.templateManager = new TemplateManager(templateConfig);
	}

	async generateMarkdown(filePath: string): Promise<string> {
		try {
			const templateOptions = this.templateManager.buildJsdocOptions();
			const markdown = await jsdoc2md.render({
				...this.options,
				...templateOptions,
				files: [filePath],
			});

			if (!markdown.trim()) {
				return this.createEmptyDocumentation(filePath);
			}

			return markdown;
		} catch (error) {
			console.warn(`Warning: Failed to generate JSDoc for ${filePath}:`, error);
			return this.createErrorDocumentation(filePath, error);
		}
	}

	/**
	 * 启用预设模板
	 * @param preset 预设类型：'clean'（无锚点）或 'default'（默认）
	 * @param templatesDir 可选的模板目录路径
	 */
	enablePresetTemplates(preset: PresetTemplate, templatesDir?: string): void {
		this.templateManager.enablePreset(preset, templatesDir);
	}

	/**
	 * 启用自定义模板
	 * @param partialPaths 模板文件路径数组
	 * @param templatesDir 可选的模板目录路径
	 */
	enableCustomTemplates(partialPaths: string[], templatesDir?: string): void {
		this.templateManager.enableCustom(partialPaths, templatesDir);
	}

	/**
	 * 禁用所有模板
	 */
	disableTemplates(): void {
		this.templateManager.disable();
	}

	/**
	 * 检查是否启用了模板
	 */
	isUsingTemplates(): boolean {
		return this.templateManager.isEnabled();
	}

	/**
	 * 获取模板管理器配置
	 */
	getTemplateConfig(): Readonly<TemplateManagerConfig> {
		return this.templateManager.getConfig();
	}

	/**
	 * 获取模板管理器实例
	 */
	getTemplateManager(): TemplateManager {
		return this.templateManager;
	}

	/**
	 * 验证模板文件是否存在
	 */
	async validateTemplates(): Promise<{ valid: boolean; missingFiles: string[] }> {
		return this.templateManager.validateTemplates();
	}

	/**
	 * 静态工厂方法：创建使用 clean 模板的生成器
	 */
	static createWithCleanTemplates(options: Partial<JsdocOptions> = {}, templatesDir?: string): MarkdownGenerator {
		const templateConfig: Partial<TemplateManagerConfig> = {
			enabled: true,
			preset: "clean",
			templatesBaseDir: templatesDir || path.join(__dirname, "templates"),
		};

		return new MarkdownGenerator(options, templateConfig);
	}

	/**
	 * 静态工厂方法：创建使用默认模板的生成器
	 */
	static createWithDefaultTemplates(options: Partial<JsdocOptions> = {}): MarkdownGenerator {
		const templateConfig: Partial<TemplateManagerConfig> = {
			enabled: false, // 默认模板不需要启用
		};

		return new MarkdownGenerator(options, templateConfig);
	}

	async saveMarkdown(fileInfo: FileInfo, content: string): Promise<void> {
		const outputDir = path.dirname(fileInfo.outputPath);
		await ensureDirectoryExists(outputDir);
		await fs.writeFile(fileInfo.outputPath, content, "utf-8");
	}

	private createEmptyDocumentation(filePath: string): string {
		const fileName = path.basename(filePath);
		return `# ${fileName}

> This file currently has no JSDoc documentation.

**Source:** \`${fileName}\`

## Description

This file appears to contain JavaScript code but no JSDoc comments were found to generate documentation.

To add documentation, please add JSDoc comments to the functions, classes, and methods in this file.

## Example JSDoc Format

\`\`\`javascript
/**
 * Description of the function
 * @param {type} paramName - Description of the parameter
 * @returns {type} Description of the return value
 */
function exampleFunction(paramName) {
  // function implementation
}
\`\`\`
`;
	}

	private createErrorDocumentation(filePath: string, error: any): string {
		const fileName = path.basename(filePath);
		return `# ${fileName}

> Documentation generation failed for this file.

**Source:** \`${fileName}\`

## Error

An error occurred while trying to generate documentation for this file:

\`\`\`
${error.message || "Unknown error"}
\`\`\`

## Suggestions

1. Check if the file contains valid JavaScript syntax
2. Verify that JSDoc comments are properly formatted
3. Ensure the file is not corrupted or empty

Please review the source file and try again.
`;
	}
}
