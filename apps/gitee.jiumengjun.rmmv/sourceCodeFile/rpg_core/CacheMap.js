/**
 * 图像、音频或任何其他类型资源的缓存。
 * Cache for images, audio, or any other kind of resource.
 *
 * @class CacheMap
 * @constructor
 * @param {Object} manager 缓存管理器 The cache manager
 */
function CacheMap(manager) {
	this.manager = manager;
	this._inner = {};
	this._lastRemovedEntries = {};
	this.updateTicks = 0;
	this.lastCheckTTL = 0;
	this.delayCheckTTL = 100.0;
	this.updateSeconds = Date.now();
}

/**
 * 检查所有元素的TTL并移除失效的条目。
 * Checks TTL of all elements and removes dead ones.
 *
 * @method checkTTL
 */
CacheMap.prototype.checkTTL = function () {
	var cache = this._inner;
	var temp = this._lastRemovedEntries;
	if (!temp) {
		temp = [];
		this._lastRemovedEntries = temp;
	}
	for (var key in cache) {
		var entry = cache[key];
		if (!entry.isStillAlive()) {
			temp.push(entry);
		}
	}
	for (var i = 0; i < temp.length; i++) {
		temp[i].free(true);
	}
	temp.length = 0;
};

/**
 * 通过键获取缓存项。
 * Gets a cached item by key.
 *
 * @method getItem
 * @param {String} key 缓存元素的URL URL of cache element
 * @return {Object|null} 缓存项，如果未找到则返回null The cached item or null if not found
 */
CacheMap.prototype.getItem = function (key) {
	var entry = this._inner[key];
	if (entry) {
		return entry.item;
	}
	return null;
};

CacheMap.prototype.clear = function () {
	var keys = Object.keys(this._inner);
	for (var i = 0; i < keys.length; i++) {
		this._inner[keys[i]].free();
	}
};

CacheMap.prototype.setItem = function (key, item) {
	return new CacheEntry(this, key, item).allocate();
};

CacheMap.prototype.update = function (ticks, delta) {
	this.updateTicks += ticks;
	this.updateSeconds += delta;
	if (this.updateSeconds >= this.delayCheckTTL + this.lastCheckTTL) {
		this.lastCheckTTL = this.updateSeconds;
		this.checkTTL();
	}
};
