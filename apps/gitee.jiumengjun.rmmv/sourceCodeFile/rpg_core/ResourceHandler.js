//=============================================================================
// ResourceHandler.js
//=============================================================================

/**
 * The static class that handles resource loading.
 *
 * @class ResourceHandler
 */
function ResourceHandler() {
	throw new Error("This is a static class");
}

ResourceHandler._reloaders = [];
ResourceHandler._defaultRetryInterval = [500, 1000, 3000];

/**
 * Creates a loader function that handles retries for resource loading.
 * 创建一个处理资源加载重试的加载器函数。
 *
 * @static
 * @method createLoader
 * @param {String} url - The URL of the resource
 * @param {Function} retryMethod - The method to call for retry
 * @param {Function} resignMethod - The method to call when giving up
 * @param {Array} retryInterval - Array of retry intervals in milliseconds
 * @return {Function} The loader function
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
 * Checks whether any reloaders exist.
 * 检查是否存在任何重加载器。
 *
 * @static
 * @method exists
 * @return {Boolean} True if reloaders exist
 */
ResourceHandler.exists = function () {
	return this._reloaders.length > 0;
};

/**
 * Retries all failed resource loading operations.
 * 重试所有失败的资源加载操作。
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
