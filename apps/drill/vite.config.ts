import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { getPluginsList } from "./build/plugins";

import "./types/vite-env.d.ts";

// const res = dotenvConfig().parsed;
// // console.log(res);
// const publicDir = res!.publicDir;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	// 提供类型声明 便于得到使用提示
	const env = loadEnv(mode, process.cwd()) as unknown as ImportMetaEnv;

	const VITE_project_flag_name = env.VITE_project_flag_name;
	const VITE_project_path = env.VITE_project_path;

	// console.log(" ??? env ", env);
	// console.log(" ??? import.meta.env ", import.meta.env);
	// console.log(" ??? process.env ", process.env);
	console.log(" process.env.isSingleDomain=true ", process.env?.isSingleDomain);

	/**
	 * 是否是单一域名的场景？
	 * 如果是，就需要在base路径前面加上项目标识名。
	 */
	const base = process.env?.isSingleDomain === "true" ? `/${VITE_project_flag_name}/` : "/";

	const outDir = process.env?.isSingleDomain === "true" ? `dist/${VITE_project_flag_name}` : "dist";

	return {
		/**
		 * TODO: 尝试使用root配置 完成项目路径配置
		 * https://cn.vite.dev/config/shared-options#root
		 * https://cn.vite.dev/guide/#specifying-alternative-root
		 *
		 * 配置root 配置vite命令运行时期望的根目录
		 */
		root: process.cwd(),

		base,

		publicDir: VITE_project_path,

		build: {
			outDir,
		},

		server: {
			port: 8080,
			open: true,
		},

		preview: {
			port: 8080,
			open: true,
		},

		plugins: getPluginsList({ env }),
	};
});
