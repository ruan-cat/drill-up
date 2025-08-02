/**
 * Vite插件集合
 *
 * 统一导出所有自定义的Vite插件
 */

import type { PluginOption, ConfigEnv } from "vite";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createHtmlPlugin } from "vite-plugin-html";

// 开发调试插件
import vueDevTools from "vite-plugin-vue-devtools";

import { vitePluginTsupRpgmv } from "./vite-plugin-tsup-rpgmv/index";
// 集中封装后的 别名插件
import tsAlias from "./vite-plugin-ts-alias/index";

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

		/**
		 * 开发调试插件
		 * @description
		 * vueDevTools 必须在 createHtmlPlugin 的前面导入
		 *
		 * @see https://devtools.vuejs.org/help/troubleshooting#devtools-vite-plugin-doesn-t-render-as-expected
		 * @see https://github.com/vuejs/devtools/issues/278#issuecomment-2167415057
		 */
		vueDevTools(),

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

		// 路径别名插件
		// tsAlias,

		tsAliasSelf({
			tsConfigName: "tsconfig.app.json",
			// tsConfigName: "tsconfig.json",
		}),
	];
}
