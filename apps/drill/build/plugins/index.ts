/**
 * Vite插件集合
 *
 * 统一导出所有自定义的Vite插件
 */

export { vitePluginTsupRpgmv } from "./vite-plugin-tsup-rpgmv";

import type { PluginOption, ConfigEnv } from "vite";
import { vitePluginTsupRpgmv } from "./vite-plugin-tsup-rpgmv";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createHtmlPlugin } from "vite-plugin-html";

export interface GetPluginsListParams {
	/**
	 * 环境变量
	 * @description
	 * 原框架没有 这里额外拓展的
	 * 用来获取vite配置的环境变量
	 */
	env: ImportMetaEnv;
}

export function getPluginsList(params: GetPluginsListParams): PluginOption[] {
	const { env } = params;

	const VITE_project_flag_name = env.VITE_project_flag_name;
	const VITE_project_path = env.VITE_project_path;

	return [
		vitePluginTsupRpgmv({
			verbose: true, // 启用详细日志
			forceRebuild: false, // 仅在需要时构建
		}) as any,

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
	];
}
