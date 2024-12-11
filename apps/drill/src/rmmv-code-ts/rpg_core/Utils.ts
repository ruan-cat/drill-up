//-----------------------------------------------------------------------------
/**静态的类 定义公用程序方法
 * The static class that defines utility methods.
 * 公用程序
 * @class Utils
 */
class Utils {
	private constructor() {
		throw new Error("This is a static class");
	}

	/** RPG Maker 的名称 ,mv 是当前版本
	 * The name of the RPG Maker. 'MV' in the current version.
	 *
	 * @static
	 * @property RPGMAKER_NAME
	 * @type String
	 * @final
	 */
	static RPGMAKER_NAME: string = "MV";

	/** RPG Maker  版本
	 * The version of the RPG Maker.
	 *
	 * @static
	 * @property RPGMAKER_VERSION
	 * @type String
	 * @final
	 */
	static RPGMAKER_VERSION: string = "1.3.1";

	/**检查 项目URL字符串是否有(name) 测试游戏时会带
	 * Checks whether the option is in the query string.
	 *
	 * @static
	 * @method isOptionValid
	 * @param {String} name The option name
	 * @return {Boolean} True if the option is in the query string
	 */
	static isOptionValid(name: string): boolean {
		return location.search.slice(1).split("&").includes(name);
	}

	/**检查是不是nw.js平台
	 * Checks whether the platform is NW.js.
	 *
	 * @static
	 * @method isNwjs
	 * @return {Boolean} True if the platform is NW.js
	 */
	static isNwjs(): boolean {
		return typeof require === "function" && typeof process === "object";
	}

	/**检查平台是不是移动设备
	 * Checks whether the platform is a mobile device.
	 *
	 * @static
	 * @method isMobileDevice
	 * @return {Boolean} True if the platform is a mobile device
	 */
	static isMobileDevice(): boolean {
		const r = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
		return !!navigator.userAgent.match(r);
	}

	/**检查浏览器是Mobile Safari(苹果Safari浏览器)
	 * Checks whether the browser is Mobile Safari.
	 *
	 * @static
	 * @method isMobileSafari
	 * @return {Boolean} True if the browser is Mobile Safari
	 */
	static isMobileSafari(): boolean {
		const agent = navigator.userAgent;
		return !!(agent.match(/iPhone|iPad|iPod/) && agent.match(/AppleWebKit/) && !agent.match("CriOS"));
	}

	/**检查浏览器是Android Chrome(安卓Chrome浏览器)
	 * Checks whether the browser is Android Chrome.
	 *
	 * @static
	 * @method isAndroidChrome
	 * @return {Boolean} True if the browser is Android Chrome
	 */
	static isAndroidChrome(): boolean {
		const agent = navigator.userAgent;
		return !!(agent.match(/Android/) && agent.match(/Chrome/));
	}

	/**检查浏览器能够读文件在游戏文件夹
	 * Checks whether the browser can read files in the game folder.
	 *
	 * @static
	 * @method canReadGameFiles
	 * @return {Boolean} True if the browser can read files in the game folder
	 */
	static canReadGameFiles(): boolean {
		const scripts = document.getElementsByTagName("script");
		const lastScript = scripts[scripts.length - 1];
		const xhr = new XMLHttpRequest();
		try {
			xhr.open("GET", lastScript.src);
			xhr.overrideMimeType("text/javascript");
			xhr.send();
			return true;
		} catch (e) {
			return false;
		}
	}

	/**制作html 颜色字符串 从 rgb数值
	 * Makes a CSS color string from RGB values.
	 *
	 * @static
	 * @method rgbToCssColor
	 * @param {Number} r The red value in the range (0, 255)
	 * @param {Number} g The green value in the range (0, 255)
	 * @param {Number} b The blue value in the range (0, 255)
	 * @return {String} CSS color string
	 */
	static rgbToCssColor(r: number, g: number, b: number): string {
		r = Math.round(r);
		g = Math.round(g);
		b = Math.round(b);
		return `rgb(${r},${g},${b})`;
	}
}
