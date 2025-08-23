//-----------------------------------------------------------------------------
/**
 * @fileoverview ConfigManager
 * @author 阮喵喵（翻译）
 * @classdesc
 * 配置管理器 - 管理配置数据的静态类
 * Configuration Manager - The static class that manages the configuration data.
 */

/**
 * @class ConfigManager
 * @classdesc
 * 管理配置数据的静态类。
 * The static class that manages the configuration data.
 * @static
 */
function ConfigManager() {
	throw new Error("This is a static class");
}

/**
 * @static
 * @type {Boolean}
 * @description 始终跑步 - Always dash
 */
ConfigManager.alwaysDash = false;

/**
 * @static
 * @type {Boolean}
 * @description 记住指令 - Remember command
 */
ConfigManager.commandRemember = false;

/**
 * @static
 * @description
 * BGM 音量
 * BGM Volume
 * @type {Number}
 */
Object.defineProperty(ConfigManager, "bgmVolume", {
	get: function () {
		return AudioManager._bgmVolume;
	},
	set: function (value) {
		AudioManager.bgmVolume = value;
	},
	configurable: true,
});

/**
 * @static
 * @description
 * BGS 音量
 * BGS Volume
 * @type {Number}
 */
Object.defineProperty(ConfigManager, "bgsVolume", {
	get: function () {
		return AudioManager.bgsVolume;
	},
	set: function (value) {
		AudioManager.bgsVolume = value;
	},
	configurable: true,
});

/**
 * @static
 * @description
 * ME 音量
 * ME Volume
 * @type {Number}
 */
Object.defineProperty(ConfigManager, "meVolume", {
	get: function () {
		return AudioManager.meVolume;
	},
	set: function (value) {
		AudioManager.meVolume = value;
	},
	configurable: true,
});

/**
 * @static
 * @description
 * SE 音量
 * SE Volume
 * @type {Number}
 */
Object.defineProperty(ConfigManager, "seVolume", {
	get: function () {
		return AudioManager.seVolume;
	},
	set: function (value) {
		AudioManager.seVolume = value;
	},
	configurable: true,
});

/**
 * @static
 * @method load
 * @description
 * 加载配置数据
 * Load configuration data
 */
ConfigManager.load = function () {
	var json;
	var config = {};
	try {
		json = StorageManager.load(-1);
	} catch (e) {
		console.error(e);
	}
	if (json) {
		config = JSON.parse(json);
	}
	this.applyData(config);
};

/**
 * @static
 * @method save
 * @description
 * 保存配置数据
 * Save configuration data
 */
ConfigManager.save = function () {
	StorageManager.save(-1, JSON.stringify(this.makeData()));
};

/**
 * @static
 * @method makeData
 * @description
 * 制作配置数据
 * Make configuration data
 * @returns {Object} The configuration data - 配置数据
 */
ConfigManager.makeData = function () {
	var config = {};
	config.alwaysDash = this.alwaysDash;
	config.commandRemember = this.commandRemember;
	config.bgmVolume = this.bgmVolume;
	config.bgsVolume = this.bgsVolume;
	config.meVolume = this.meVolume;
	config.seVolume = this.seVolume;
	return config;
};

/**
 * @static
 * @method applyData
 * @description
 * 执行数据
 * Apply configuration data
 * @param {Object} config - The configuration data - 配置数据
 */
ConfigManager.applyData = function (config) {
	this.alwaysDash = this.readFlag(config, "alwaysDash");
	this.commandRemember = this.readFlag(config, "commandRemember");
	this.bgmVolume = this.readVolume(config, "bgmVolume");
	this.bgsVolume = this.readVolume(config, "bgsVolume");
	this.meVolume = this.readVolume(config, "meVolume");
	this.seVolume = this.readVolume(config, "seVolume");
};

/**
 * @static
 * @method readFlag
 * @description
 * 读取标志
 * Read flag value
 * @param {Object} config - The configuration data - 配置数据
 * @param {String} name - The property name - 属性名
 * @returns {Boolean} The flag value - 标志值
 */
ConfigManager.readFlag = function (config, name) {
	return !!config[name];
};

/**
 * @static
 * @method readVolume
 * @description
 * 读取音量
 * Read volume value
 * @param {Object} config - The configuration data - 配置数据
 * @param {String} name - The property name - 属性名
 * @returns {Number} The volume value - 音量值
 */
ConfigManager.readVolume = function (config, name) {
	var value = config[name];
	if (value !== undefined) {
		return Number(value).clamp(0, 100);
	} else {
		return 100;
	}
};
