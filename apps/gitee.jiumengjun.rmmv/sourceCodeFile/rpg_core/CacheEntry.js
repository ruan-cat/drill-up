//-----------------------------------------------------------------------------
/**
 * 资源类。如果在一段时间或滴答数内未使用，则允许被垃圾回收。
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks.
 *
 * @class CacheEntry
 * @constructor
 * @param {Object} cache 缓存管理器 The cache manager
 * @param {String} key 资源的URL URL of the resource
 * @param {Object} item 要存储在缓存中的项目 Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
 */
function CacheEntry(cache, key, item) {
	this.cache = cache;
	this.key = key;
	this.item = item;
	this.cached = false;
	this.touchTicks = 0;
	this.touchSeconds = 0;
	this.ttlTicks = 0;
	this.ttlSeconds = 0;
	this.freedByTTL = false;
}

/**
 * 从缓存中释放资源。
 * Frees the resource from cache.
 *
 * @method free
 * @param {Boolean} byTTL 是否通过TTL释放资源 Whether the resource is freed by TTL
 */
CacheEntry.prototype.free = function (byTTL) {
	this.freedByTTL = byTTL || false;
	if (this.cached) {
		this.cached = false;
		delete this.cache._inner[this.key];
	}
};

/**
 * 在缓存中分配资源。
 * Allocates the resource in cache.
 *
 * @method allocate
 * @return {CacheEntry} 返回此缓存条目 Returns this cache entry
 */
CacheEntry.prototype.allocate = function () {
	if (!this.cached) {
		this.cache._inner[this.key] = this;
		this.cached = true;
	}
	this.touch();
	return this;
};

/**
 * 设置缓存条目的生存时间。
 * Sets the time to live for the cache entry.
 *
 * @method setTimeToLive
 * @param {Number} ticks 滴答时间TTL，未设置时为0 TTL in ticks, 0 if not set
 * @param {Number} seconds 秒数TTL，未设置时为0 TTL in seconds, 0 if not set
 * @return {CacheEntry} 返回此缓存条目 Returns this cache entry
 */
CacheEntry.prototype.setTimeToLive = function (ticks, seconds) {
	this.ttlTicks = ticks || 0;
	this.ttlSeconds = seconds || 0;
	return this;
};

/**
 * 检查缓存条目是否仍然有效（未过期）。
 * Checks whether the cache entry is still alive (not expired).
 *
 * @method isStillAlive
 * @return {Boolean} 如果缓存条目仍然有效则返回true True if the cache entry is still alive
 */
CacheEntry.prototype.isStillAlive = function () {
	var cache = this.cache;
	return (
		(this.ttlTicks == 0 || this.touchTicks + this.ttlTicks < cache.updateTicks) &&
		(this.ttlSeconds == 0 || this.touchSeconds + this.ttlSeconds < cache.updateSeconds)
	);
};

/**
 * 确保资源不会被生存时间释放。如果资源已经被TTL释放，则重新放入缓存。
 * Makes sure that resource won't be freed by Time To Live.
 * If resource was already freed by TTL, put it in cache again.
 *
 * @method touch
 */
CacheEntry.prototype.touch = function () {
	var cache = this.cache;
	if (this.cached) {
		this.touchTicks = cache.updateTicks;
		this.touchSeconds = cache.updateSeconds;
	} else if (this.freedByTTL) {
		this.freedByTTL = false;
		if (!cache._inner[this.key]) {
			cache._inner[this.key] = this;
		}
	}
};
