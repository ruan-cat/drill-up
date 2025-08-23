/**
 * @fileoverview ImageManager - 图像管理器
 * @description 管理游戏中所有图像资源的加载、缓存和处理
 * Manages loading, caching and processing of all image resources in the game
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * ImageManager - 图像管理器
 *
 * 这是一个静态类，用于管理游戏中的图像资源，包括角色、敌人、背景、
 * 系统图片等的加载、缓存和预处理。
 *
 * This is a static class that manages image resources in the game, including
 * loading, caching and preprocessing of characters, enemies, backgrounds,
 * system images, etc.
 */
function ImageManager() {
	throw new Error("This is a static class");
}

ImageManager.cache = new CacheMap(ImageManager); // 缓存 / Cache

ImageManager._imageCache = new ImageCache(); // 图像缓存 / Image cache
ImageManager._requestQueue = new RequestQueue(); // 请求队列 / Request queue
ImageManager._systemReservationId = Utils.generateRuntimeId(); // 系统储存 ID / System reservation ID

/**
 * 生成缓存键名
 * Generate cache key
 *
 * @param {string} path - 图像路径 / Image path
 * @param {number} hue - 色调 / Hue
 * @returns {string} 缓存键名 / Cache key
 */
ImageManager._generateCacheKey = function (path, hue) {
	return path + ":" + hue;
};

/**
 * 加载动画图像
 * Load animation image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadAnimation = function (filename, hue) {
	return this.loadBitmap("img/animations/", filename, hue, true);
};

/**
 * 加载战斗背景 1
 * Load battle background 1
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadBattleback1 = function (filename, hue) {
	return this.loadBitmap("img/battlebacks1/", filename, hue, true);
};

/**
 * 加载战斗背景 2
 * Load battle background 2
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadBattleback2 = function (filename, hue) {
	return this.loadBitmap("img/battlebacks2/", filename, hue, true);
};

/**
 * 加载敌人战斗图（正视图）
 * Load enemy battle image (front view)
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadEnemy = function (filename, hue) {
	return this.loadBitmap("img/enemies/", filename, hue, true);
};

/**
 * 加载角色行走图
 * Load character walking sprite
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadCharacter = function (filename, hue) {
	return this.loadBitmap("img/characters/", filename, hue, false);
};

/**
 * 加载脸图
 * Load face image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadFace = function (filename, hue) {
	return this.loadBitmap("img/faces/", filename, hue, true);
};

/**
 * 加载远景图
 * Load parallax image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadParallax = function (filename, hue) {
	return this.loadBitmap("img/parallaxes/", filename, hue, true);
};

/**
 * 加载图片
 * Load picture
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadPicture = function (filename, hue) {
	return this.loadBitmap("img/pictures/", filename, hue, true);
};

/**
 * 加载我方战斗图（侧面图）
 * 在战斗场景的 SideView 战斗系统下使用。
 *
 * Load actor battle image (side view)
 * Used in SideView battle system in battle scenes.
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadSvActor = function (filename, hue) {
	return this.loadBitmap("img/sv_actors/", filename, hue, false);
};

/**
 * 加载敌人战斗图（侧面图）
 * 在战斗场景的 SideView 战斗系统下使用。
 *
 * Load enemy battle image (side view)
 * Used in SideView battle system in battle scenes.
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadSvEnemy = function (filename, hue) {
	return this.loadBitmap("img/sv_enemies/", filename, hue, true);
};

/**
 * 加载系统图片
 * Load system image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadSystem = function (filename, hue) {
	return this.loadBitmap("img/system/", filename, hue, false);
};

/**
 * 加载地图图块
 * Load tileset
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadTileset = function (filename, hue) {
	return this.loadBitmap("img/tilesets/", filename, hue, false);
};

/**
 * 加载标题图片 1
 * Load title image 1
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadTitle1 = function (filename, hue) {
	return this.loadBitmap("img/titles1/", filename, hue, true);
};

/**
 * 加载标题图片 2
 * Load title image 2
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadTitle2 = function (filename, hue) {
	return this.loadBitmap("img/titles2/", filename, hue, true);
};

/**
 * 加载位图
 * Load bitmap
 *
 * @param {string} folder - 文件夹路径 / Folder path
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {boolean} smooth - 是否平滑 / Whether to smooth
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadBitmap = function (folder, filename, hue, smooth) {
	if (filename) {
		var path = folder + encodeURIComponent(filename) + ".png";
		var bitmap = this.loadNormalBitmap(path, hue || 0);
		bitmap.smooth = smooth;
		return bitmap;
	} else {
		return this.loadEmptyBitmap();
	}
};

/**
 * 加载空白位图
 * Load empty bitmap
 *
 * @returns {Bitmap} 空白位图对象 / Empty bitmap object
 */
ImageManager.loadEmptyBitmap = function () {
	var empty = this._imageCache.get("empty");
	if (!empty) {
		empty = new Bitmap();
		this._imageCache.add("empty", empty);
		this._imageCache.reserve("empty", empty, this._systemReservationId);
	}

	return empty;
};

/**
 * 加载标准位图
 * Load normal bitmap
 *
 * @param {string} path - 图像路径 / Image path
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.loadNormalBitmap = function (path, hue) {
	var key = this._generateCacheKey(path, hue);
	var bitmap = this._imageCache.get(key);
	if (!bitmap) {
		bitmap = Bitmap.load(decodeURIComponent(path));
		bitmap.addLoadListener(function () {
			bitmap.rotateHue(hue);
		});
		this._imageCache.add(key, bitmap);
	} else if (!bitmap.isReady()) {
		bitmap.decode();
	}

	return bitmap;
};

/**
 * 清空缓存
 * Clear cache
 */
ImageManager.clear = function () {
	this._imageCache = new ImageCache();
};

/**
 * 是否准备好
 * Check if ready
 *
 * @returns {boolean} 是否准备好 / Whether ready
 */
ImageManager.isReady = function () {
	return this._imageCache.isReady();
};

/**
 * 是否物体的行走图
 * 图片名字!开头（包括!$），取消角色比地图元件高 6 像素的效果以及经
 * 过流体属性图块时的半透明效果。大多用于物件类的角色，如门和宝箱。
 *
 * Check if object character
 * Image names starting with ! (including !$), cancel the effect of characters being 6 pixels higher than map elements
 * and the semi-transparent effect when passing through fluid attribute tiles. Mostly used for object-like characters such as doors and treasure chests.
 *
 * @param {string} filename - 文件名 / Filename
 * @returns {boolean} 是否物体行走图 / Whether object character
 */
ImageManager.isObjectCharacter = function (filename) {
	var sign = filename.match(/^[\!\$]+/);
	return sign && sign[0].contains("!");
};

/**
 * 是否大张的行走图
 * 图片名字$开头（包括!$），该文件就只能容纳一个角色元。
 *
 * Check if big character
 * Image names starting with $ (including !$), the file can only contain one character element.
 *
 * @param {string} filename - 文件名 / Filename
 * @returns {boolean} 是否大张行走图 / Whether big character
 */
ImageManager.isBigCharacter = function (filename) {
	var sign = filename.match(/^[\!\$]+/);
	return sign && sign[0].contains("$");
};

/**
 * 是否零视差图
 * 视差图也就是远景图，与地面位移存在视差，零视差相当于地面。
 * 图片名字!开头，将被视作地面来显示。
 *
 * Check if zero parallax
 * Parallax images are distant view images, with parallax displacement from the ground. Zero parallax is equivalent to the ground.
 * Image names starting with ! will be displayed as ground.
 *
 * @param {string} filename - 文件名 / Filename
 * @returns {boolean} 是否零视差图 / Whether zero parallax
 */
ImageManager.isZeroParallax = function (filename) {
	return filename.charAt(0) === "!";
};

/**
 * 储存动画图像
 * Reserve animation image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveAnimation = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/animations/", filename, hue, true, reservationId);
};

/**
 * 储存战斗背景1
 * Reserve battle background 1
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveBattleback1 = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/battlebacks1/", filename, hue, true, reservationId);
};

/**
 * 储存战斗背景2
 * Reserve battle background 2
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveBattleback2 = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/battlebacks2/", filename, hue, true, reservationId);
};

/**
 * 储存纵版战斗敌人战斗图
 * Reserve front view battle enemy image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveEnemy = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/enemies/", filename, hue, true, reservationId);
};

/**
 * 储存角色行走图
 * Reserve character walking sprite
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveCharacter = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/characters/", filename, hue, false, reservationId);
};

/**
 * 储存脸图
 * Reserve face image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveFace = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/faces/", filename, hue, true, reservationId);
};

/**
 * 储存远景图
 * Reserve parallax image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveParallax = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/parallaxes/", filename, hue, true, reservationId);
};

/**
 * 储存图片
 * Reserve picture
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reservePicture = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/pictures/", filename, hue, true, reservationId);
};

/**
 * 储存横版战斗我方战斗图
 * Reserve side view actor battle image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveSvActor = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/sv_actors/", filename, hue, false, reservationId);
};

/**
 * 储存横版战斗敌人战斗图
 * Reserve side view enemy battle image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveSvEnemy = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/sv_enemies/", filename, hue, true, reservationId);
};

/**
 * 储存系统图片
 * Reserve system image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveSystem = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/system/", filename, hue, false, reservationId || this._systemReservationId);
};

/**
 * 储存地图图块
 * Reserve tileset
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveTileset = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/tilesets/", filename, hue, false, reservationId);
};

/**
 * 储存标题图片 1
 * Reserve title image 1
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveTitle1 = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/titles1/", filename, hue, true, reservationId);
};

/**
 * 储存标题图片 2
 * Reserve title image 2
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveTitle2 = function (filename, hue, reservationId) {
	return this.reserveBitmap("img/titles2/", filename, hue, true, reservationId);
};

/**
 * 储存位图
 * Reserve bitmap
 *
 * @param {string} folder - 文件夹路径 / Folder path
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {boolean} smooth - 是否平滑 / Whether to smooth
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveBitmap = function (folder, filename, hue, smooth, reservationId) {
	if (filename) {
		var path = folder + encodeURIComponent(filename) + ".png";
		var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
		bitmap.smooth = smooth;
		return bitmap;
	} else {
		return this.loadEmptyBitmap();
	}
};

/**
 * 储存标准位图
 * Reserve normal bitmap
 *
 * @param {string} path - 图像路径 / Image path
 * @param {number} hue - 色调 / Hue
 * @param {string} reservationId - 储存ID / Reservation ID
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.reserveNormalBitmap = function (path, hue, reservationId) {
	var bitmap = this.loadNormalBitmap(path, hue);
	this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);

	return bitmap;
};

/**
 * 释放储存
 * Release reservation
 *
 * @param {string} reservationId - 储存ID / Reservation ID
 */
ImageManager.releaseReservation = function (reservationId) {
	this._imageCache.releaseReservation(reservationId);
};

/**
 * 设置默认储存 ID
 * Set default reservation ID
 *
 * @param {string} reservationId - 储存ID / Reservation ID
 */
ImageManager.setDefaultReservationId = function (reservationId) {
	this._defaultReservationId = reservationId;
};

/**
 * 请求动画图像
 * Request animation image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestAnimation = function (filename, hue) {
	return this.requestBitmap("img/animations/", filename, hue, true);
};

/**
 * 请求战斗背景 1
 * Request battle background 1
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestBattleback1 = function (filename, hue) {
	return this.requestBitmap("img/battlebacks1/", filename, hue, true);
};

/**
 * 请求战斗背景 2
 * Request battle background 2
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestBattleback2 = function (filename, hue) {
	return this.requestBitmap("img/battlebacks2/", filename, hue, true);
};

/**
 * 请求纵版战斗敌人战斗图
 * Request front view battle enemy image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestEnemy = function (filename, hue) {
	return this.requestBitmap("img/enemies/", filename, hue, true);
};

/**
 * 请求角色行走图
 * Request character walking sprite
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestCharacter = function (filename, hue) {
	return this.requestBitmap("img/characters/", filename, hue, false);
};

/**
 * 请求脸图
 * Request face image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestFace = function (filename, hue) {
	return this.requestBitmap("img/faces/", filename, hue, true);
};

/**
 * 请求远景图
 * Request parallax image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestParallax = function (filename, hue) {
	return this.requestBitmap("img/parallaxes/", filename, hue, true);
};

/**
 * 请求图片
 * Request picture
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestPicture = function (filename, hue) {
	return this.requestBitmap("img/pictures/", filename, hue, true);
};

/**
 * 请求横版战斗我方战斗图
 * Request side view actor battle image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestSvActor = function (filename, hue) {
	return this.requestBitmap("img/sv_actors/", filename, hue, false);
};

/**
 * 请求横版战斗敌人战斗图
 * Request side view enemy battle image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestSvEnemy = function (filename, hue) {
	return this.requestBitmap("img/sv_enemies/", filename, hue, true);
};

/**
 * 请求系统图片
 * Request system image
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestSystem = function (filename, hue) {
	return this.requestBitmap("img/system/", filename, hue, false);
};

/**
 * 请求地图图块
 * Request tileset
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestTileset = function (filename, hue) {
	return this.requestBitmap("img/tilesets/", filename, hue, false);
};

/**
 * 请求标题图片 1
 * Request title image 1
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestTitle1 = function (filename, hue) {
	return this.requestBitmap("img/titles1/", filename, hue, true);
};

/**
 * 请求标题图片 2
 * Request title image 2
 *
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestTitle2 = function (filename, hue) {
	return this.requestBitmap("img/titles2/", filename, hue, true);
};

/**
 * 请求位图
 * Request bitmap
 *
 * @param {string} folder - 文件夹路径 / Folder path
 * @param {string} filename - 文件名 / Filename
 * @param {number} hue - 色调 / Hue
 * @param {boolean} smooth - 是否平滑 / Whether to smooth
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestBitmap = function (folder, filename, hue, smooth) {
	if (filename) {
		var path = folder + encodeURIComponent(filename) + ".png";
		var bitmap = this.requestNormalBitmap(path, hue || 0);
		bitmap.smooth = smooth;
		return bitmap;
	} else {
		return this.loadEmptyBitmap();
	}
};

/**
 * 请求标准位图
 * Request normal bitmap
 *
 * @param {string} path - 图像路径 / Image path
 * @param {number} hue - 色调 / Hue
 * @returns {Bitmap} 位图对象 / Bitmap object
 */
ImageManager.requestNormalBitmap = function (path, hue) {
	var key = this._generateCacheKey(path, hue);
	var bitmap = this._imageCache.get(key);
	if (!bitmap) {
		bitmap = Bitmap.request(path);
		bitmap.addLoadListener(function () {
			bitmap.rotateHue(hue);
		});
		this._imageCache.add(key, bitmap);
		this._requestQueue.enqueue(key, bitmap);
	} else {
		this._requestQueue.raisePriority(key);
	}

	return bitmap;
};

/**
 * 更新请求队列
 * Update request queue
 */
ImageManager.update = function () {
	this._requestQueue.update();
};

/**
 * 清空请求队列
 * Clear request queue
 */
ImageManager.clearRequest = function () {
	this._requestQueue.clear();
};
