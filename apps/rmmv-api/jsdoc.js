"use strict";

module.exports = {
	tags: {
		allowUnknownTags: true,
		dictionaries: ["jsdoc", "closure"],
	},

	source: {
		include: ["sourceCodeFile"],
		exclude: [],
		includePattern: ".+\\.js(doc)?$",
		excludePattern: "(^|\\/|\\\\)_",
	},

	plugins: ["jsdoc-mermaid"],

	templates: {
		cleverLinks: false,
		monospaceLinks: false,
		search: true,

		// 使用主题插件 better-docs 的名称配置
		"better-docs": {
			// 顶部导航栏 总标题
			name: "rmmv源码翻译",

			// 浏览器选项卡 标题
			title: "rmmv源码翻译",

			// 隐藏底部生成器
			hideGenerator: false,
			navLinks: [
				{
					label: "Gitee",
					href: "https://gitee.com/HechiCollegeComputerAssociation/rmmv-api",
				},
				{
					label: "Bilibili",
					href: "https://space.bilibili.com/359907572",
				},
				{
					label: "阮喵喵的rmmv开发笔记",
					// label: 'ruanCat-rmmv-dev-note',
					href: "https://hechicollegecomputerassociation.gitee.io/rpgmv-dev-notes/",
				},
			],
		},

		// 使用主题插件 tui-jsdoc-template 的配置
		// name: '阮中楠的文档',
		// footerText: '底部导航栏文字',
	},

	// 使用主题插件 docdash 的配置 这个配置要放到templates配置外部
	// docdash: {
	//   sort: true,
	//   search: true,
	//   collapse: true,
	//   meta: {
	//     title: 'rzn-docdash',
	//     description: 'rzn-docdash-desc',
	//     keyword: 'rzn,rmmv,drill',
	//   },
	// },

	opts: {
		/**
		 * 可用的一些模板 需要自行安装下载 自行去github搜索相关细节
		 * templates/default
		 * node_modules/minami
		 * node_modules/better-docs
		 * node_modules/tui-jsdoc-template
		 * node_modules/docdash
		 */
		template: "node_modules/better-docs",
		encoding: "utf8",
		destination: "rpgmv-api-doc",
		readme: "./README.md",
		tutorials: "./tutorials",
		recurse: true,
		verbose: true,
	},
};
