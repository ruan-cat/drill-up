import { type Config } from "@ruan-cat/vercel-deploy-tool/src/config.ts";

const config: Config = {
	vercelProjetName: "vercel-monorepo-test-1-zn20",
	vercelToken: "",
	vercelOrgId: "",
	vercelProjectId: "",

	deployTargets: [
		// 仇九rmmz项目
		{
			type: "userCommands",
			outputDirectory: "dist",
			targetCWD: "./apps/drill",
			url: [
				//
				"qj-rmmz.ruancat6312.top",
				//
				"qj-mz-plugins-24-12-2.ruancat6312.top",
			],
			userCommands: ["pnpm -C=./apps/drill build"],
		},
	],
};

export default config;
