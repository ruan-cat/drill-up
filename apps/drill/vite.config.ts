import { fileURLToPath, URL } from "node:url";
import type { ConfigEnv } from "vite";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { config as dotenvConfig } from "@dotenvx/dotenvx";

import "./types/vite-env.d.ts";

// 拓展返回值
declare module "@dotenvx/dotenvx" {
	interface DotenvParseOutput {
		[name: string]: string;
		publicDir: string;
	}
}

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
		// root

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

		plugins: [
			vue(),

			// 重设index.html的入口 和 全局ts文件的注入
			createHtmlPlugin({
				minify: false,
				template: `${VITE_project_path}/index.html`,

				/**
				 * 需要注入 index.html ejs 模版的数据
				 */
				inject: {
					data: {
						// 出现在模版中的 <%- title %>
						title: "插件集合示例",

						// 出现在模版中的<%- injectScript %>
						// 可以正常打包
						injectScript: `<script async type="module" src="../src/main.ts"></script>`,
					},

					tags: [
						{
							injectTo: "body-prepend",
							tag: "section",
							attrs: {
								id: "vue-root-app",
							},
						},
					],
				},
			}),

			AutoImport({
				imports: ["vue"],
				resolvers: [ElementPlusResolver()],
			}),

			Components({ dts: true, version: 3, resolvers: [ElementPlusResolver()] }),
		],

		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
				components: fileURLToPath(new URL("./src/components ", import.meta.url)),
			},
		},
	};
});
