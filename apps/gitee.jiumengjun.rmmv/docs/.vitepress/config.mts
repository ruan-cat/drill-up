import { setUserConfig, setGenerateSidebar, addChangelog2doc } from "@ruan-cat/vitepress-preset-config/config";

import { description, version } from "../../package.json";

// 为文档添加自动生成的changelog
addChangelog2doc({
	target: "./docs",
	data: {
		order: 1000,
		dir: {
			order: 1000,
		},
	},
});

const userConfig = setUserConfig({
	title: `RPG Maker MV 核心库文档 v${version}`,
	description,

	themeConfig: {
		nav: [
			{ text: "首页", link: "/" },
			{ text: "JSDoc API", link: "/jsdoc/" },
		],

		socialLinks: [
			{
				icon: "github",
				link: "https://github.com/ruan-cat/drill-up",
			},
		],
	},
});

// @ts-ignore
userConfig.themeConfig.sidebar = setGenerateSidebar({
	documentRootPath: "./docs",
});

export default userConfig;
