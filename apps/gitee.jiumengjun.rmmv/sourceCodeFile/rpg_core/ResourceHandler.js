//=============================================================================
// ResourceHandler.js
//=============================================================================

/**
 * 处理资源加载的静态类。
 * The static class that handles resource loading.
 *
 * @class ResourceHandler
 */
function ResourceHandler() {
	throw new Error("This is a static class");
}

/**
 * 重加载器数组。
 * Array of reloaders.
 *
 * @static
 * @property _reloaders
 * @type Array
 * @private
 */
ResourceHandler._reloaders = [];

/**
 * 默认的重试间隔数组。
 * Default retry interval array.
 *
 * @static
 * @property _defaultRetryInterval
 * @type Array
 * @private
 */
ResourceHandler._defaultRetryInterval = [500, 1000, 3000];

/**
 * 创建一个处理资源加载重试的加载器函数。
 * Creates a loader function that handles retries for resource loading.
 *
 * @static
 * @method createLoader
 * @param {String} url 资源的URL The URL of the resource
 * @param {Function} retryMethod 用于重试的方法 The method to call for retry
 * @param {Function} resignMethod 放弃时调用的方法 The method to call when giving up
 * @param {Array} retryInterval 重试间隔数组（毫秒） Array of retry intervals in milliseconds
 * @return {Function} 加载器函数 The loader function
 */
ResourceHandler.createLoader = function (url, retryMethod, resignMethod, retryInterval) {
	retryInterval = retryInterval || this._defaultRetryInterval;
	var reloaders = this._reloaders;
	var retryCount = 0;
	return function () {
		if (retryCount < retryInterval.length) {
			setTimeout(retryMethod, retryInterval[retryCount]);
			retryCount++;
		} else {
			if (resignMethod) {
				resignMethod();
			}
			if (url) {
				if (reloaders.length === 0) {
					Graphics.printLoadingError(url);
					SceneManager.stop();
				}
				reloaders.push(function () {
					retryCount = 0;
					retryMethod();
				});
			}
		}
	};
};

/**
 * 检查是否存在任何重加载器。
 * Checks whether any reloaders exist.
 *
 * @static
 * @method exists
 * @return {Boolean} 如果重加载器存在则返回true True if reloaders exist
 */
ResourceHandler.exists = function () {
	return this._reloaders.length > 0;
};

/**
 * 重试所有失败的资源加载操作。
 * Retries all failed resource loading operations.
 *
 * @static
 * @method retry
 */
ResourceHandler.retry = function () {
	if (this._reloaders.length > 0) {
		Graphics.eraseLoadingError();
		SceneManager.resume();
		this._reloaders.forEach(function (reloader) {
			reloader();
		});
		this._reloaders.length = 0;
	}
};
