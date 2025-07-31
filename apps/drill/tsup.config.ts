import { defineConfig } from "tsup";

export default defineConfig({
	// RPGMV插件入口配置
	entry: {
		VueBridge: "./src/rpgmv-plugins/VueBridge.ts",
		// 可以在这里添加更多插件
		// "OtherPlugin": "./src/rpgmv-plugins/OtherPlugin.ts",
	},

	// 输出配置
	outDir: "./drill-project/js/plugins",
	format: ["iife"], // RPGMV插件需要IIFE格式

	// 代码优化配置
	sourcemap: false,
	clean: false, // 不清理输出目录，避免删除其他插件
	dts: false, // RPGMV插件不需要类型定义文件
	minify: false, // 保持代码可读性，便于调试

	// TypeScript配置
	tsconfig: "./tsconfig.json",
	target: "es5", // RPGMV兼容ES5

	// 全局变量配置 - RPGMV插件需要访问全局对象
	globalName: "VueBridgePlugin",

	// 文件扩展名
	outExtension({ format }) {
		return {
			js: `.js`,
		};
	},

	// 插件配置
	plugins: [],

	// 外部依赖 - RPGMV全局对象不需要打包
	external: [
		// 这些是RPGMV的全局对象，不需要打包进插件
		"$gameVariables",
		"$gameSwitches",
		"$gameMessage",
		"$gameParty",
		"$gamePlayer",
		"$gameMap",
		"SceneManager",
		"AudioManager",
		"Scene_Boot",
		"Game_Actor",
	],

	// 环境配置
	env: {
		NODE_ENV: "production",
	},

	// 自定义横幅注释
	banner: {
		js: `//=============================================================================
// VueBridge.js - 由TypeScript编译生成
// Vue与RPGMV双向通信桥接插件
// 编译时间: ${new Date().toISOString()}
//=============================================================================`,
	},

	// 监听模式配置（开发时使用）
	watch: process.env.NODE_ENV === "development" ? ["./src/rpgmv-plugins/**/*.ts"] : false,

	// 构建完成回调
	onSuccess: async () => {
		console.log("🎮 RPGMV插件构建完成！");
		console.log("📁 输出目录: apps/drill/drill-project/js/plugins/");
		console.log("📋 生成的插件文件: VueBridge.js");
	},
});
