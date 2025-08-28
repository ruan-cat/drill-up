/**
 * 存储图像位图的缓存。
 * Cache for storing image bitmaps.
 *
 * @class ImageCache
 * @constructor
 */
function ImageCache() {
	this.initialize.apply(this, arguments);
}

/**
 * 缓存大小限制（字节）。
 * The cache size limit in bytes.
 *
 * @static
 * @property limit
 * @type Number
 * @default 10485760
 */
ImageCache.limit = 10 * 1000 * 1000;

/**
 * 初始化图像缓存。
 * Initialize the image cache.
 *
 * @method initialize
 */
ImageCache.prototype.initialize = function () {
	this._items = {};
};

/**
 * 向图像缓存中添加位图。
 * Adds a bitmap to the image cache.
 *
 * @method add
 * @param {String} key - 缓存键 / The cache key
 * @param {Bitmap} value - 要缓存的位图 / The bitmap to cache
 */
ImageCache.prototype.add = function (key, value) {
	this._items[key] = {
		bitmap: value,
		touch: Date.now(),
		key: key,
	};

	this._truncateCache();
};

/**
 * 从图像缓存中获取位图。
 * Gets a bitmap from the image cache.
 *
 * @method get
 * @param {String} key - 缓存键 / The cache key
 * @return {Bitmap|null} 缓存的位图或找不到时返回null / The cached bitmap or null if not found
 */
ImageCache.prototype.get = function (key) {
	if (this._items[key]) {
		var item = this._items[key];
		item.touch = Date.now();
		return item.bitmap;
	}

	return null;
};

/**
 * 在图像缓存中保留位图。
 * Reserves a bitmap in the image cache.
 *
 * @method reserve
 * @param {String} key - 缓存键 / The cache key
 * @param {Bitmap} value - 要保留的位图 / The bitmap to reserve
 * @param {String} reservationId - 保留ID / The reservation ID
 */
ImageCache.prototype.reserve = function (key, value, reservationId) {
	if (!this._items[key]) {
		this._items[key] = {
			bitmap: value,
			touch: Date.now(),
			key: key,
		};
	}

	this._items[key].reservationId = reservationId;
};

/**
 * 释放具有指定保留ID的项目。
 * Releases items with the specified reservation ID.
 *
 * @method releaseReservation
 * @param {String} reservationId - 要释放的保留ID / The reservation ID to release
 */
ImageCache.prototype.releaseReservation = function (reservationId) {
	var items = this._items;

	Object.keys(items)
		.map(function (key) {
			return items[key];
		})
		.forEach(function (item) {
			if (item.reservationId === reservationId) {
				delete item.reservationId;
			}
		});
};

/**
 * 截断缓存以适应大小限制。
 * Truncates the cache to fit within the size limit.
 *
 * @private
 * @method _truncateCache
 */
ImageCache.prototype._truncateCache = function () {
	var items = this._items;
	var sizeLeft = ImageCache.limit;

	Object.keys(items)
		.map(function (key) {
			return items[key];
		})
		.sort(function (a, b) {
			return b.touch - a.touch;
		})
		.forEach(
			function (item) {
				if (sizeLeft > 0 || this._mustBeHeld(item)) {
					var bitmap = item.bitmap;
					sizeLeft -= bitmap.width * bitmap.height;
				} else {
					delete items[item.key];
				}
			}.bind(this),
		);
};

/**
 * 检查项目是否必须保留在缓存中。
 * Checks whether an item must be held in cache.
 *
 * @private
 * @method _mustBeHeld
 * @param {Object} item - 要检查的缓存项 / The cache item to check
 * @return {Boolean} 如果必须保留项目则返回true / True if the item must be held
 */
ImageCache.prototype._mustBeHeld = function (item) {
	// 仅请求的项目是弱引用，可以被清除 / Request only is weak so it's purgeable
	if (item.bitmap.isRequestOnly()) return false;
	// 保留的项目必须保持 / Reserved item must be held
	if (item.reservationId) return true;
	// 未准备好的位图必须保持（因为需要检查isReady()）/ Not ready bitmap must be held (because of checking isReady())
	if (!item.bitmap.isReady()) return true;
	// 然后该项目可能是可清除的 / Then the item may be purgeable
	return false;
};

/**
 * 检查所有缓存的位图是否已准备好。
 * Checks whether all cached bitmaps are ready.
 *
 * @method isReady
 * @return {Boolean} 如果所有缓存的位图都准备好则返回true / True if all cached bitmaps are ready
 */
ImageCache.prototype.isReady = function () {
	var items = this._items;
	return !Object.keys(items).some(function (key) {
		return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
	});
};

/**
 * 从缓存中获取第一个错误位图。
 * Gets the first error bitmap from the cache.
 *
 * @method getErrorBitmap
 * @return {Bitmap|null} 错误位图或找不到错误时返回null / The error bitmap or null if no error found
 */
ImageCache.prototype.getErrorBitmap = function () {
	var items = this._items;
	var bitmap = null;
	if (
		Object.keys(items).some(function (key) {
			if (items[key].bitmap.isError()) {
				bitmap = items[key].bitmap;
				return true;
			}
			return false;
		})
	) {
		return bitmap;
	}

	return null;
};
