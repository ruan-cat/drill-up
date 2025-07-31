#!/usr/bin/env tsx

/**
 * 自动构建RPGMV插件并启动开发服务器
 * 用于开发时的便捷脚本
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const PLUGIN_OUTPUT_PATH = "./drill-project/js/plugins/VueBridge.js";

async function buildPlugins(): Promise<boolean> {
	console.log("🔨 构建RPGMV插件...");

	return new Promise((resolve) => {
		const buildProcess = spawn("pnpm", ["run", "build:rpgmv-plugins"], {
			stdio: "inherit",
			shell: true,
		});

		buildProcess.on("close", (code) => {
			if (code === 0) {
				console.log("✅ 插件构建成功！");
				resolve(true);
			} else {
				console.error("❌ 插件构建失败！");
				resolve(false);
			}
		});
	});
}

async function startDevServer(): Promise<void> {
	console.log("🚀 启动开发服务器...");

	const devProcess = spawn("pnpm", ["run", "dev:drill"], {
		stdio: "inherit",
		shell: true,
	});

	// 监听进程退出
	process.on("SIGINT", () => {
		console.log("\n🛑 停止开发服务器...");
		devProcess.kill("SIGINT");
		process.exit(0);
	});
}

async function checkPluginExists(): Promise<boolean> {
	const pluginExists = existsSync(PLUGIN_OUTPUT_PATH);
	if (!pluginExists) {
		console.log("⚠️  插件文件不存在，需要先构建");
		return false;
	}

	console.log("✅ 插件文件已存在");
	return true;
}

async function main(): Promise<void> {
	console.log("🎮 Vue + RPGMV 开发环境启动器");
	console.log("=====================================");

	// 检查插件是否存在
	const pluginExists = await checkPluginExists();

	// 如果插件不存在或者强制重新构建，则构建插件
	const shouldBuild = !pluginExists || process.argv.includes("--rebuild");

	if (shouldBuild) {
		const buildSuccess = await buildPlugins();
		if (!buildSuccess) {
			console.error("构建失败，无法启动开发服务器");
			process.exit(1);
		}
	}

	// 启动开发服务器
	await startDevServer();
}

// 运行主函数
main().catch((error) => {
	console.error("❌ 启动失败：", error);
	process.exit(1);
});
