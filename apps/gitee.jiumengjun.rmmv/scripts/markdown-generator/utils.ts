import * as path from "path";
import * as fs from "fs/promises";
import { fileURLToPath } from "url";

export interface FileInfo {
	sourcePath: string;
	relativePath: string;
	outputPath: string;
}

export async function ensureDirectoryExists(dirPath: string): Promise<void> {
	try {
		await fs.access(dirPath);
	} catch {
		await fs.mkdir(dirPath, { recursive: true });
	}
}

export async function getAllJsFiles(sourceDir: string): Promise<string[]> {
	const files: string[] = [];

	async function scanDirectory(dir: string): Promise<void> {
		const entries = await fs.readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);

			if (entry.isDirectory()) {
				await scanDirectory(fullPath);
			} else if (entry.isFile() && entry.name.endsWith(".js")) {
				files.push(fullPath);
			}
		}
	}

	await scanDirectory(sourceDir);
	return files;
}

export function createFileInfo(sourcePath: string, sourceDir: string, outputDir: string): FileInfo {
	const relativePath = path.relative(sourceDir, sourcePath);
	const outputPath = path.join(outputDir, relativePath.replace(/\.js$/, ".md"));

	return {
		sourcePath,
		relativePath,
		outputPath,
	};
}

/**
 * 获取项目根目录（使用process.cwd()）
 * @returns 项目根目录的绝对路径
 */
export function getProjectRoot(): string {
	return process.cwd();
}

export function logProgress(current: number, total: number, fileName: string): void {
	const percentage = ((current / total) * 100).toFixed(1);
	console.log(`[${current}/${total}] (${percentage}%) Processing: ${fileName}`);
}

// ==================== 路径处理工具函数 ====================

/**
 * ES 模块中获取当前文件的目录路径
 * 替代 CommonJS 的 __dirname
 * @param importMetaUrl import.meta.url
 * @returns 当前文件所在目录的绝对路径
 */
export function getDirname(importMetaUrl: string): string {
	const __filename = fileURLToPath(importMetaUrl);
	return path.dirname(__filename);
}

/**
 * ES 模块中获取当前文件的文件路径
 * 替代 CommonJS 的 __filename
 * @param importMetaUrl import.meta.url
 * @returns 当前文件的绝对路径
 */
export function getFilename(importMetaUrl: string): string {
	return fileURLToPath(importMetaUrl);
}

/**
 * 项目路径管理器
 * 统一管理项目中各种路径的构建
 */
export class ProjectPaths {
	private readonly projectRoot: string;
	private readonly scriptsDir: string;

	constructor(projectRoot?: string) {
		this.projectRoot = projectRoot || process.cwd();
		this.scriptsDir = path.join(this.projectRoot, "scripts", "markdown-generator");
	}

	/**
	 * 获取项目根目录
	 */
	getProjectRoot(): string {
		return this.projectRoot;
	}

	/**
	 * 获取脚本目录
	 */
	getScriptsDir(): string {
		return this.scriptsDir;
	}

	/**
	 * 获取源代码目录
	 * @param subDir 可选的子目录，默认为 "sourceCodeFile"
	 */
	getSourceDir(subDir: string = "sourceCodeFile"): string {
		return path.join(this.projectRoot, subDir);
	}

	/**
	 * 获取输出文档目录
	 * @param subDir 可选的子目录，默认为 "docs/jsdoc"
	 */
	getOutputDir(subDir: string = "docs/jsdoc"): string {
		return path.join(this.projectRoot, subDir);
	}

	/**
	 * 获取模板目录
	 * @param templatesSubDir 可选的模板子目录，默认为 "templates"
	 */
	getTemplatesDir(templatesSubDir: string = "templates"): string {
		return path.join(this.scriptsDir, templatesSubDir);
	}

	/**
	 * 获取相对于项目根目录的相对路径
	 */
	getRelativePath(absolutePath: string): string {
		return path.relative(this.projectRoot, absolutePath);
	}

	/**
	 * 解析相对于项目根目录的路径
	 */
	resolve(...pathSegments: string[]): string {
		return path.resolve(this.projectRoot, ...pathSegments);
	}
}

/**
 * 创建默认的项目路径管理器实例
 */
export function createProjectPaths(projectRoot?: string): ProjectPaths {
	return new ProjectPaths(projectRoot);
}

/**
 * 模板路径构建器
 * 专门用于构建模板相关的路径
 */
export class TemplatePaths {
	private readonly baseDir: string;

	constructor(baseDir: string) {
		this.baseDir = baseDir;
	}

	/**
	 * 构建 clean 模板的路径数组
	 */
	getCleanTemplatePaths(): string[] {
		return [
			path.join(this.baseDir, "partials/shared/signature/sig-link.hbs"),
			path.join(this.baseDir, "partials/shared/value/linked-type-list.hbs"),
			path.join(this.baseDir, "partials/shared/value/link.hbs"),
		];
	}

	/**
	 * 获取特定模板文件路径
	 */
	getTemplatePath(relativePath: string): string {
		return path.join(this.baseDir, relativePath);
	}

	/**
	 * 获取模板基础目录
	 */
	getBaseDir(): string {
		return this.baseDir;
	}
}
