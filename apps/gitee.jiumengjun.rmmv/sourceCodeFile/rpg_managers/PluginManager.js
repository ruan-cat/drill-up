/**
 * @fileoverview PluginManager - 插件管理器
 * @description 管理插件的静态类，负责插件的加载、参数管理和错误处理
 * The static class that manages plugins, responsible for plugin loading, parameter management and error handling
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * PluginManager - 插件管理器
 *
 * 管理插件的静态类。
 * 负责插件脚本的动态加载、参数配置管理、错误检测等功能。
 *
 * The static class that manages plugins.
 * Responsible for dynamic loading of plugin scripts, parameter configuration
 * management, error detection and other functions.
 */
function PluginManager() {
	throw new Error("This is a static class");
}

PluginManager._path = "js/plugins/"; // 路径 / Path
PluginManager._scripts = []; // 脚本 / Scripts
PluginManager._errorUrls = []; // 错误链接 / Error URLs
PluginManager._parameters = {}; // 参数 / Parameters

/**
 * 设置插件
 * Setup plugins
 *
 * @param {Array} plugins - 插件配置数组 / Plugin configuration array
 */
PluginManager.setup = function (plugins) {
	plugins.forEach(function (plugin) {
		if (plugin.status && !this._scripts.contains(plugin.name)) {
			this.setParameters(plugin.name, plugin.parameters);
			this.loadScript(plugin.name + ".js");
			this._scripts.push(plugin.name);
		}
	}, this);
};

/**
 * 检测错误
 * 检查是否有插件加载失败
 *
 * Check errors
 * Check if any plugins failed to load
 */
PluginManager.checkErrors = function () {
	var url = this._errorUrls.shift();
	if (url) {
		throw new Error("Failed to load: " + url);
	}
};

/**
 * 获取插件参数
 * Get plugin parameters
 *
 * @param {string} name - 插件名称 / Plugin name
 * @returns {Object} 插件参数对象 / Plugin parameters object
 */
PluginManager.parameters = function (name) {
	return this._parameters[name.toLowerCase()] || {};
};

/**
 * 设置插件参数
 * Set plugin parameters
 *
 * @param {string} name - 插件名称 / Plugin name
 * @param {Object} parameters - 参数对象 / Parameters object
 */
PluginManager.setParameters = function (name, parameters) {
	this._parameters[name.toLowerCase()] = parameters;
};

/**
 * 加载插件脚本
 * Load plugin script
 *
 * @param {string} name - 脚本文件名 / Script filename
 */
PluginManager.loadScript = function (name) {
	var url = this._path + name;
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = url;
	script.async = false;
	script.onerror = this.onError.bind(this);
	script._url = url;
	document.body.appendChild(script);
};

/**
 * 错误处理
 * 当插件脚本加载失败时调用
 *
 * Error handler
 * Called when plugin script fails to load
 *
 * @param {Event} e - 错误事件 / Error event
 */
PluginManager.onError = function (e) {
	this._errorUrls.push(e.target._url);
};
