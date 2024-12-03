/// <reference types="vite/client" />

interface ImportMetaEnv {
	/** 项目标识名 */
	readonly VITE_project_flag_name: string;

	/** 项目地址 */
	readonly VITE_project_path: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
