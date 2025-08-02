import tsAlias from "@ruan-cat/vite-plugin-ts-alias";

export default tsAlias({
	/**
	 * tsconfig name, optional.
	 * @default 'tsconfig.json'
	 */
	tsConfigName: "tsconfig.app.json",
});
