//-----------------------------------------------------------------------------
/**
 * The resource class. Allows to be collected as a garbage if not use for some time or ticks.
 * 资源类。如果在一段时间或滴答数内未使用，则允许被垃圾回收。
 *
 * @class CacheEntry
 * @constructor
 * @param {Object} cache - The cache manager
 * @param {String} key - URL of the resource
 * @param {Object} item - Bitmap, HTML5Audio, WebAudio - whatever you want to store in the cache
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
 * Frees the resource from cache.
 * 从缓存中释放资源。
 *
 * @method free
 * @param {Boolean} byTTL - Whether the resource is freed by TTL
 */
CacheEntry.prototype.free = function (byTTL) {
    this.freedByTTL = byTTL || false;
    if (this.cached) {
        this.cached = false;
        delete this.cache._inner[this.key];
    }
};

/**
 * Allocates the resource in cache.
 * 在缓存中分配资源。
 *
 * @method allocate
 * @return {CacheEntry} Returns this cache entry
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
 * Sets the time to live for the cache entry.
 * 设置缓存条目的生存时间。
 *
 * @method setTimeToLive
 * @param {Number} ticks - TTL in ticks, 0 if not set
 * @param {Number} seconds - TTL in seconds, 0 if not set
 * @return {CacheEntry} Returns this cache entry
 */
CacheEntry.prototype.setTimeToLive = function (ticks, seconds) {
    this.ttlTicks = ticks || 0;
    this.ttlSeconds = seconds || 0;
    return this;
};

/**
 * Checks whether the cache entry is still alive (not expired).
 * 检查缓存条目是否仍然有效（未过期）。
 *
 * @method isStillAlive
 * @return {Boolean} True if the cache entry is still alive
 */
CacheEntry.prototype.isStillAlive = function () {
    var cache = this.cache;
    return ((this.ttlTicks == 0) || (this.touchTicks + this.ttlTicks < cache.updateTicks )) &&
        ((this.ttlSeconds == 0) || (this.touchSeconds + this.ttlSeconds < cache.updateSeconds ));
};

/**
 * Makes sure that resource won't be freed by Time To Live.
 * If resource was already freed by TTL, put it in cache again.
 * 确保资源不会被生存时间释放。如果资源已经被TTL释放，则重新放入缓存。
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