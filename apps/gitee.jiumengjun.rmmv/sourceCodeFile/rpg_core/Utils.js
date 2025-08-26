//-----------------------------------------------------------------------------
/**
 * 定义实用方法的静态类。
 * The static class that defines utility methods.
 *
 * @class Utils
 */
function Utils() {
	throw new Error("This is a static class");
}

/**
 * RPG Maker 的名称。当前版本为 'MV'。
 * The name of the RPG Maker. 'MV' in the current version.
 *
 * @static
 * @type {String}
 * @readonly
 */
Utils.RPGMAKER_NAME = "MV";

/**
 * RPG Maker 的版本。
 * The version of the RPG Maker.
 *
 * @static
 * @type {String}
 * @readonly
 */
Utils.RPGMAKER_VERSION = "1.6.1";

/**
 * 检查选项是否在查询字符串中。
 * Checks whether the option is in the query string.
 *
 * @static
 * @method isOptionValid
 * @param {String} name 选项名称 The option name
 * @return {Boolean} 如果选项在查询字符串中则返回true True if the option is in the query string
 */
Utils.isOptionValid = function (name) {
	if (location.search.slice(1).split("&").contains(name)) {
		return 1;
	}
	if (typeof nw !== "undefined" && nw.App.argv.length > 0 && nw.App.argv[0].split("&").contains(name)) {
		return 1;
	}
	return 0;
};

/**
 * 检查平台是否为 NW.js。
 * Checks whether the platform is NW.js.
 *
 * @static
 * @method isNwjs
 * @return {Boolean} 如果平台是 NW.js 则返回true True if the platform is NW.js
 */
Utils.isNwjs = function () {
	return typeof require === "function" && typeof process === "object";
};

/**
 * 检查平台是否为移动设备。
 * Checks whether the platform is a mobile device.
 *
 * @static
 * @method isMobileDevice
 * @return {Boolean} 如果平台是移动设备则返回true True if the platform is a mobile device
 */
Utils.isMobileDevice = function () {
	var r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
	return !!navigator.userAgent.match(r);
};

/**
 * 检查浏览器是否为 Mobile Safari。
 * Checks whether the browser is Mobile Safari.
 *
 * @static
 * @method isMobileSafari
 * @return {Boolean} 如果浏览器是 Mobile Safari 则返回true True if the browser is Mobile Safari
 */
Utils.isMobileSafari = function () {
	var agent = navigator.userAgent;
	return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) && !agent.match("CriOS"));
};

/**
 * 检查浏览器是否为 Android Chrome。
 * Checks whether the browser is Android Chrome.
 *
 * @static
 * @method isAndroidChrome
 * @return {Boolean} 如果浏览器是 Android Chrome 则返回true True if the browser is Android Chrome
 */
Utils.isAndroidChrome = function () {
	var agent = navigator.userAgent;
	return !!(agent.match(/Android/) && agent.match(/Chrome/));
};

/**
 * 检查浏览器是否可以读取游戏文件夹中的文件。
 * Checks whether the browser can read files in the game folder.
 *
 * @static
 * @method canReadGameFiles
 * @return {Boolean} 如果浏览器可以读取游戏文件夹中的文件则返回true True if the browser can read files in the game folder
 */
Utils.canReadGameFiles = function () {
	var scripts = document.getElementsByTagName("script");
	var lastScript = scripts[scripts.length - 1];
	var xhr = new XMLHttpRequest();
	try {
		xhr.open("GET", lastScript.src);
		xhr.overrideMimeType("text/javascript");
		xhr.send();
		return true;
	} catch (e) {
		return false;
	}
};

/**
 * 从 RGB 值创建 CSS 颜色字符串。
 * Makes a CSS color string from RGB values.
 *
 * @static
 * @method rgbToCssColor
 * @param {Number} r 红色值，范围为 (0, 255) The red value in the range (0, 255)
 * @param {Number} g 绿色值，范围为 (0, 255) The green value in the range (0, 255)
 * @param {Number} b 蓝色值，范围为 (0, 255) The blue value in the range (0, 255)
 * @return {String} CSS 颜色字符串 CSS color string
 */
Utils.rgbToCssColor = function (r, g, b) {
	r = Math.round(r);
	g = Math.round(g);
	b = Math.round(b);
	return "rgb(" + r + "," + g + "," + b + ")";
};

Utils._id = 1;

/**
 * 生成一个唯一的运行时ID。
 * Generates a unique runtime ID.
 *
 * @static
 * @method generateRuntimeId
 * @return {Number} 唯一的运行时ID A unique runtime ID
 */
Utils.generateRuntimeId = function () {
	return Utils._id++;
};

Utils._supportPassiveEvent = null;
/**
 * 测试此浏览器是否支持被动事件功能。
 * Test this browser support passive event feature.
 *
 * @static
 * @method isSupportPassiveEvent
 * @return {Boolean} 此浏览器是否支持被动事件 True if this browser supports passive event, false otherwise
 */
Utils.isSupportPassiveEvent = function () {
	if (typeof Utils._supportPassiveEvent === "boolean") {
		return Utils._supportPassiveEvent;
	}
	// test support passive event
	// https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
	var passive = false;
	var options = Object.defineProperty({}, "passive", {
		get: function () {
			passive = true;
		},
	});
	window.addEventListener("test", null, options);
	Utils._supportPassiveEvent = passive;
	return passive;
};
