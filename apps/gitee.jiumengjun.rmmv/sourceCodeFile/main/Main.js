//-----------------------------------------------------------------------------
/**
 * @fileoverview Main.js
 * @author 阮喵喵（翻译）
 * @classdesc
 * 主入口文件，负责插件初始化和应用程序启动
 * Main entry file responsible for plugin initialization and application startup
 */
//=============================================================================

/**
 * @description 初始化所有插件系统
 * Initialize all plugin systems
 * @static
 */
PluginManager.setup($plugins);

/**
 * @description 窗口加载完成后启动场景管理器
 * Start scene manager after window loading is complete
 * @event window#onload
 */
window.onload = function () {
	/**
	 * @description 运行启动场景开始游戏
	 * Run boot scene to start the game
	 */
	SceneManager.run(Scene_Boot);
};