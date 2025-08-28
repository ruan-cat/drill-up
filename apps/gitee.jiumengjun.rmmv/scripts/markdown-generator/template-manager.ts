import * as path from "path";

/**
 * 预设模板类型
 */
export type PresetTemplate = "clean" | "default";

/**
 * 模板管理器配置接口
 */
export interface TemplateManagerConfig {
	enabled: boolean;
	preset?: PresetTemplate;
	customPartials?: string[];
	templatesBaseDir: string;
}

/**
 * jsdoc2md 模板选项接口
 */
export interface JsdocTemplateOptions {
	partial?: string[];
	template?: string;
}

/**
 * 模板管理器 - 负责管理 jsdoc2md 的自定义模板
 * 
 * 工作原理：
 * - 通过提供同名模板文件覆盖 dmd 默认模板
 * - 支持预设模板和完全自定义模板
 */
export class TemplateManager {
	private config: TemplateManagerConfig;

	constructor(config: Partial<TemplateManagerConfig> = {}) {
		this.config = {
			enabled: false,
			preset: "clean",
			templatesBaseDir: path.join(__dirname, "templates"),
			...config,
		};
	}

	/**
	 * 启用预设模板
	 * @param preset 预设类型：'clean' 或 'default'
	 * @param templatesDir 可选的模板目录路径
	 */
	enablePreset(preset: PresetTemplate, templatesDir?: string): void {
		if (templatesDir) {
			this.config.templatesBaseDir = templatesDir;
		}
		
		this.config.enabled = true;
		this.config.preset = preset;
		this.config.customPartials = undefined;
	}

	/**
	 * 启用自定义模板
	 * @param partials 自定义模板文件路径数组
	 * @param templatesDir 可选的模板基础目录
	 */
	enableCustom(partials: string[], templatesDir?: string): void {
		if (templatesDir) {
			this.config.templatesBaseDir = templatesDir;
		}
		
		this.config.enabled = true;
		this.config.preset = undefined;
		this.config.customPartials = [...partials];
	}

	/**
	 * 禁用所有模板
	 */
	disable(): void {
		this.config.enabled = false;
	}

	/**
	 * 检查是否启用了模板
	 */
	isEnabled(): boolean {
		return this.config.enabled;
	}

	/**
	 * 获取当前配置
	 */
	getConfig(): Readonly<TemplateManagerConfig> {
		return { ...this.config };
	}

	/**
	 * 构建 jsdoc2md 的模板选项
	 */
	buildJsdocOptions(): JsdocTemplateOptions {
		if (!this.config.enabled) {
			return {};
		}

		if (this.config.preset) {
			return this.buildPresetOptions();
		}

		if (this.config.customPartials) {
			return this.buildCustomOptions();
		}

		return {};
	}

	/**
	 * 构建预设模板选项
	 */
	private buildPresetOptions(): JsdocTemplateOptions {
		switch (this.config.preset) {
			case "clean":
				return this.buildCleanTemplateOptions();
			case "default":
				return {}; // 使用默认模板，不需要额外配置
			default:
				return {};
		}
	}

	/**
	 * 构建 clean 模板选项（无锚点链接）
	 */
	private buildCleanTemplateOptions(): JsdocTemplateOptions {
		const templatesDir = this.config.templatesBaseDir;
		
		return {
			partial: [
				path.join(templatesDir, "partials/shared/signature/sig-link.hbs"),
				path.join(templatesDir, "partials/shared/value/linked-type-list.hbs"),
				path.join(templatesDir, "partials/shared/value/link.hbs"),
			],
		};
	}

	/**
	 * 构建自定义模板选项
	 */
	private buildCustomOptions(): JsdocTemplateOptions {
		return {
			partial: [...(this.config.customPartials || [])],
		};
	}

	/**
	 * 验证模板文件是否存在
	 */
	async validateTemplates(): Promise<{ valid: boolean; missingFiles: string[] }> {
		const fs = await import("fs/promises");
		const missingFiles: string[] = [];

		if (!this.config.enabled) {
			return { valid: true, missingFiles: [] };
		}

		const options = this.buildJsdocOptions();
		const filesToCheck = options.partial || [];

		// 检查文件是否存在
		for (const filePath of filesToCheck) {
			try {
				await fs.access(filePath);
			} catch {
				missingFiles.push(filePath);
			}
		}

		return {
			valid: missingFiles.length === 0,
			missingFiles,
		};
	}

	/**
	 * 获取当前使用的模板文件列表
	 */
	getTemplateFiles(): string[] {
		if (!this.config.enabled) {
			return [];
		}

		const options = this.buildJsdocOptions();
		return options.partial || [];
	}

	/**
	 * 静态工厂方法：创建 clean 模板管理器
	 */
	static createClean(templatesDir?: string): TemplateManager {
		const manager = new TemplateManager({
			templatesBaseDir: templatesDir || path.join(__dirname, "templates"),
		});
		
		manager.enablePreset("clean");
		return manager;
	}

	/**
	 * 静态工厂方法：创建自定义模板管理器
	 */
	static createCustom(partials: string[], templatesDir?: string): TemplateManager {
		const manager = new TemplateManager({
			templatesBaseDir: templatesDir || path.join(__dirname, "templates"),
		});
		
		manager.enableCustom(partials);
		return manager;
	}

	/**
	 * 重置到默认配置
	 */
	reset(): void {
		this.config = {
			enabled: false,
			preset: "clean",
			templatesBaseDir: path.join(__dirname, "templates"),
		};
	}
}