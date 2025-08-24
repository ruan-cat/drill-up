/**
 * 存储图像位图的缓存。
 * Cache for storing image bitmaps.
 *
 * @class ImageCache
 * @constructor
 */
function ImageCache(){
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
ImageCache.prototype.initialize = function(){
    this._items = {};
};

/**
 * 向图像缓存中添加位图。
 * Adds a bitmap to the image cache.
 *
 * @method add
 * @param {String} key 缓存键 The cache key
 * @param {Bitmap} value 要缓存的位图 The bitmap to cache
 */
ImageCache.prototype.add = function(key, value){
    this._items[key] = {
        bitmap: value,
        touch: Date.now(),
        key: key
    };

    this._truncateCache();
};

/**
 * Gets a bitmap from the image cache.
 * 从图像缓存中获取位图。
 *
 * @method get
 * @param {String} key - The cache key
 * @return {Bitmap|null} The cached bitmap or null if not found
 */
ImageCache.prototype.get = function(key){
    if(this._items[key]){
        var item = this._items[key];
        item.touch = Date.now();
        return item.bitmap;
    }

    return null;
};

/**
 * Reserves a bitmap in the image cache.
 * 在图像缓存中保留位图。
 *
 * @method reserve
 * @param {String} key - The cache key
 * @param {Bitmap} value - The bitmap to reserve
 * @param {String} reservationId - The reservation ID
 */
ImageCache.prototype.reserve = function(key, value, reservationId){
    if(!this._items[key]){
        this._items[key] = {
            bitmap: value,
            touch: Date.now(),
            key: key
        };
    }

    this._items[key].reservationId = reservationId;
};

/**
 * Releases items with the specified reservation ID.
 * 释放具有指定保留ID的项目。
 *
 * @method releaseReservation
 * @param {String} reservationId - The reservation ID to release
 */
ImageCache.prototype.releaseReservation = function(reservationId){
    var items = this._items;

    Object.keys(items)
        .map(function(key){return items[key];})
        .forEach(function(item){
            if(item.reservationId === reservationId){
                delete item.reservationId;
            }
        });
};

/**
 * Truncates the cache to fit within the size limit.
 * 截断缓存以适应大小限制。
 *
 * @private
 * @method _truncateCache
 */
ImageCache.prototype._truncateCache = function(){
    var items = this._items;
    var sizeLeft = ImageCache.limit;

    Object.keys(items).map(function(key){
        return items[key];
    }).sort(function(a, b){
        return b.touch - a.touch;
    }).forEach(function(item){
        if(sizeLeft > 0 || this._mustBeHeld(item)){
            var bitmap = item.bitmap;
            sizeLeft -= bitmap.width * bitmap.height;
        }else{
            delete items[item.key];
        }
    }.bind(this));
};

/**
 * Checks whether an item must be held in cache.
 * 检查项目是否必须保留在缓存中。
 *
 * @private
 * @method _mustBeHeld
 * @param {Object} item - The cache item to check
 * @return {Boolean} True if the item must be held
 */
ImageCache.prototype._mustBeHeld = function(item){
    // request only is weak so It's purgeable
    if(item.bitmap.isRequestOnly()) return false;
    // reserved item must be held
    if(item.reservationId) return true;
    // not ready bitmap must be held (because of checking isReady())
    if(!item.bitmap.isReady()) return true;
    // then the item may purgeable
    return false;
};

/**
 * Checks whether all cached bitmaps are ready.
 * 检查所有缓存的位图是否已准备好。
 *
 * @method isReady
 * @return {Boolean} True if all cached bitmaps are ready
 */
ImageCache.prototype.isReady = function(){
    var items = this._items;
    return !Object.keys(items).some(function(key){
        return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
    });
};

/**
 * Gets the first error bitmap from the cache.
 * 从缓存中获取第一个错误位图。
 *
 * @method getErrorBitmap
 * @return {Bitmap|null} The error bitmap or null if no error found
 */
ImageCache.prototype.getErrorBitmap = function(){
    var items = this._items;
    var bitmap = null;
    if(Object.keys(items).some(function(key){
            if(items[key].bitmap.isError()){
                bitmap = items[key].bitmap;
                return true;
            }
            return false;
        })) {
        return bitmap;
    }

    return null;
};