import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { config as dotenvConfig } from "@dotenvx/dotenvx";

// 拓展返回值
declare module "@dotenvx/dotenvx" {
	interface DotenvParseOutput {
		[name: string]: string;
		publicDir: string;
	}
}

const res = dotenvConfig().parsed;
// console.log(res);
const publicDir = res!.publicDir;

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",

	publicDir,

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
			template: `${publicDir}/index.html`,

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
});
