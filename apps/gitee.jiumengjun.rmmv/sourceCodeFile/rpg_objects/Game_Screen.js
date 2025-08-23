/**
 * @fileoverview Game_Screen - 游戏画面对象类
 * @description 负责管理游戏画面效果，如色调变化、闪烁、震动、天气等
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_画面
 * Game_Screen
 *
 * 画面效果数据（如色调变化和闪烁）的游戏对象类。
 * The game object class for screen effect data, such as changes in color tone
 * and flashes.
 *
 * @class Game_Screen
 * @description 管理各种画面特效，包括淡入淡出、色调调整、闪烁效果、震动效果、缩放、天气和图片显示
 */
function Game_Screen() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_Screen object
 *
 * @memberof Game_Screen
 * @description 初始化画面对象并清空所有效果
 */
Game_Screen.prototype.initialize = function () {
	this.clear();
};

/**
 * 清空
 * Clear all screen effects
 *
 * @memberof Game_Screen
 * @description 清空所有画面效果，重置为初始状态
 */
Game_Screen.prototype.clear = function () {
	this.clearFade(); // 清除淡入淡出效果
	this.clearTone(); // 清除色调效果
	this.clearFlash(); // 清除闪烁效果
	this.clearShake(); // 清除震动效果
	this.clearZoom(); // 清除缩放效果
	this.clearWeather(); // 清除天气效果
	this.clearPictures(); // 清除图片
};

/**
 * 当战斗开始
 * Called when battle starts
 *
 * @memberof Game_Screen
 * @description 战斗开始时清除特定的画面效果
 */
Game_Screen.prototype.onBattleStart = function () {
	this.clearFade();
	this.clearFlash();
	this.clearShake();
	this.clearZoom();
	this.eraseBattlePictures();
};

/**
 * 亮度
 * Get brightness
 *
 * @memberof Game_Screen
 * @returns {number} 当前亮度值
 */
Game_Screen.prototype.brightness = function () {
	return this._brightness;
};

/**
 * 色调
 * Get tone
 *
 * @memberof Game_Screen
 * @returns {Array} 当前色调数组 [红, 绿, 蓝, 灰]
 */
Game_Screen.prototype.tone = function () {
	return this._tone;
};

/**
 * 闪烁颜色
 * Get flash color
 *
 * @memberof Game_Screen
 * @returns {Array} 当前闪烁颜色数组 [红, 绿, 蓝, 强度]
 */
Game_Screen.prototype.flashColor = function () {
	return this._flashColor;
};

/**
 * 震动
 * Get shake
 *
 * @memberof Game_Screen
 * @returns {number} 当前震动偏移值
 */
Game_Screen.prototype.shake = function () {
	return this._shake;
};

/**
 * 缩放 X 坐标
 * Get zoom X coordinate
 *
 * @memberof Game_Screen
 * @returns {number} 缩放中心X坐标
 */
Game_Screen.prototype.zoomX = function () {
	return this._zoomX;
};

/**
 * 缩放 Y 坐标
 * Get zoom Y coordinate
 *
 * @memberof Game_Screen
 * @returns {number} 缩放中心Y坐标
 */
Game_Screen.prototype.zoomY = function () {
	return this._zoomY;
};

/**
 * 缩放比例
 * Get zoom scale
 *
 * @memberof Game_Screen
 * @returns {number} 当前缩放比例
 */
Game_Screen.prototype.zoomScale = function () {
	return this._zoomScale;
};

/**
 * 天气类型
 * Get weather type
 *
 * @memberof Game_Screen
 * @returns {string} 当前天气类型
 */
Game_Screen.prototype.weatherType = function () {
	return this._weatherType;
};

/**
 * 天气强度
 * Get weather power
 *
 * @memberof Game_Screen
 * @returns {number} 当前天气强度
 */
Game_Screen.prototype.weatherPower = function () {
	return this._weatherPower;
};

/**
 * 图片
 * Get picture
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 * @returns {Game_Picture} 指定ID的图片对象
 */
Game_Screen.prototype.picture = function (pictureId) {
	var realPictureId = this.realPictureId(pictureId);
	return this._pictures[realPictureId];
};

/**
 * 真正的图片 ID
 * Get real picture ID
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 * @returns {number} 实际的图片ID（战斗中会有偏移）
 */
Game_Screen.prototype.realPictureId = function (pictureId) {
	if ($gameParty.inBattle()) {
		return pictureId + this.maxPictures();
	} else {
		return pictureId;
	}
};

/**
 * 清除变淡
 * Clear fade effect
 *
 * @memberof Game_Screen
 * @description 清除淡入淡出效果
 */
Game_Screen.prototype.clearFade = function () {
	this._brightness = 255;
	this._fadeOutDuration = 0;
	this._fadeInDuration = 0;
};

/**
 * 清除色调
 * Clear tone effect
 *
 * @memberof Game_Screen
 * @description 清除色调调整效果
 */
Game_Screen.prototype.clearTone = function () {
	this._tone = [0, 0, 0, 0];
	this._toneTarget = [0, 0, 0, 0];
	this._toneDuration = 0;
};

/**
 * 清除闪烁
 * Clear flash effect
 *
 * @memberof Game_Screen
 * @description 清除闪烁效果
 */
Game_Screen.prototype.clearFlash = function () {
	this._flashColor = [0, 0, 0, 0];
	this._flashDuration = 0;
};

/**
 * 清除震动
 * Clear shake effect
 *
 * @memberof Game_Screen
 * @description 清除震动效果
 */
Game_Screen.prototype.clearShake = function () {
	this._shakePower = 0;
	this._shakeSpeed = 0;
	this._shakeDuration = 0;
	this._shakeDirection = 1;
	this._shake = 0;
};

/**
 * 清除缩放
 * Clear zoom effect
 *
 * @memberof Game_Screen
 * @description 清除缩放效果
 */
Game_Screen.prototype.clearZoom = function () {
	this._zoomX = 0;
	this._zoomY = 0;
	this._zoomScale = 1;
	this._zoomScaleTarget = 1;
	this._zoomDuration = 0;
};

/**
 * 清除天气
 * Clear weather effect
 *
 * @memberof Game_Screen
 * @description 清除天气效果
 */
Game_Screen.prototype.clearWeather = function () {
	this._weatherType = "none";
	this._weatherPower = 0;
	this._weatherPowerTarget = 0;
	this._weatherDuration = 0;
};

/**
 * 清除图片
 * Clear pictures
 *
 * @memberof Game_Screen
 * @description 清除所有图片
 */
Game_Screen.prototype.clearPictures = function () {
	this._pictures = [];
};

/**
 * 消除战斗图片
 * Erase battle pictures
 *
 * @memberof Game_Screen
 * @description 清除战斗中显示的图片
 */
Game_Screen.prototype.eraseBattlePictures = function () {
	this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
};

/**
 * 最大图片数
 * Get max pictures
 *
 * @memberof Game_Screen
 * @returns {number} 最大图片数量
 */
Game_Screen.prototype.maxPictures = function () {
	return 100;
};

/**
 * 开始淡出
 * Start fade out
 *
 * @memberof Game_Screen
 * @param {number} duration - 淡出持续时间（帧数）
 */
Game_Screen.prototype.startFadeOut = function (duration) {
	this._fadeOutDuration = duration;
	this._fadeInDuration = 0;
};

/**
 * 开始淡入
 * Start fade in
 *
 * @memberof Game_Screen
 * @param {number} duration - 淡入持续时间（帧数）
 */
Game_Screen.prototype.startFadeIn = function (duration) {
	this._fadeInDuration = duration;
	this._fadeOutDuration = 0;
};

/**
 * 开始着色
 * Start tint
 *
 * @memberof Game_Screen
 * @param {Array} tone - 目标色调 [红, 绿, 蓝, 灰]
 * @param {number} duration - 变化持续时间（帧数）
 */
Game_Screen.prototype.startTint = function (tone, duration) {
	this._toneTarget = tone.clone();
	this._toneDuration = duration;
	if (this._toneDuration === 0) {
		this._tone = this._toneTarget.clone();
	}
};

/**
 * 开始闪烁
 * Start flash
 *
 * @memberof Game_Screen
 * @param {Array} color - 闪烁颜色 [红, 绿, 蓝, 强度]
 * @param {number} duration - 闪烁持续时间（帧数）
 */
Game_Screen.prototype.startFlash = function (color, duration) {
	this._flashColor = color.clone();
	this._flashDuration = duration;
};

/**
 * 开始震动
 * Start shake
 *
 * @memberof Game_Screen
 * @param {number} power - 震动强度
 * @param {number} speed - 震动速度
 * @param {number} duration - 震动持续时间（帧数）
 */
Game_Screen.prototype.startShake = function (power, speed, duration) {
	this._shakePower = power;
	this._shakeSpeed = speed;
	this._shakeDuration = duration;
};

/**
 * 开始缩放
 * Start zoom
 *
 * @memberof Game_Screen
 * @param {number} x - 缩放中心X坐标
 * @param {number} y - 缩放中心Y坐标
 * @param {number} scale - 目标缩放比例
 * @param {number} duration - 缩放持续时间（帧数）
 */
Game_Screen.prototype.startZoom = function (x, y, scale, duration) {
	this._zoomX = x;
	this._zoomY = y;
	this._zoomScaleTarget = scale;
	this._zoomDuration = duration;
};

/**
 * 设置缩放
 * Set zoom
 *
 * @memberof Game_Screen
 * @param {number} x - 缩放中心X坐标
 * @param {number} y - 缩放中心Y坐标
 * @param {number} scale - 缩放比例
 */
Game_Screen.prototype.setZoom = function (x, y, scale) {
	this._zoomX = x;
	this._zoomY = y;
	this._zoomScale = scale;
};

/**
 * 改变天气
 * Change weather
 *
 * @memberof Game_Screen
 * @param {string} type - 天气类型
 * @param {number} power - 天气强度
 * @param {number} duration - 变化持续时间（帧数）
 */
Game_Screen.prototype.changeWeather = function (type, power, duration) {
	if (type !== "none" || duration === 0) {
		this._weatherType = type;
	}
	this._weatherPowerTarget = type === "none" ? 0 : power;
	this._weatherDuration = duration;
	if (duration === 0) {
		this._weatherPower = this._weatherPowerTarget;
	}
};

/**
 * 更新
 * Update all screen effects
 *
 * @memberof Game_Screen
 * @description 每帧更新所有画面效果
 */
Game_Screen.prototype.update = function () {
	this.updateFadeOut();
	this.updateFadeIn();
	this.updateTone();
	this.updateFlash();
	this.updateShake();
	this.updateZoom();
	this.updateWeather();
	this.updatePictures();
};

/**
 * 更新淡出
 * Update fade out
 *
 * @memberof Game_Screen
 * @description 更新淡出效果
 */
Game_Screen.prototype.updateFadeOut = function () {
	if (this._fadeOutDuration > 0) {
		var d = this._fadeOutDuration;
		this._brightness = (this._brightness * (d - 1)) / d;
		this._fadeOutDuration--;
	}
};

/**
 * 更新淡入
 * Update fade in
 *
 * @memberof Game_Screen
 * @description 更新淡入效果
 */
Game_Screen.prototype.updateFadeIn = function () {
	if (this._fadeInDuration > 0) {
		var d = this._fadeInDuration;
		this._brightness = (this._brightness * (d - 1) + 255) / d;
		this._fadeInDuration--;
	}
};

/**
 * 更新色调
 * Update tone
 *
 * @memberof Game_Screen
 * @description 更新色调调整效果
 */
Game_Screen.prototype.updateTone = function () {
	if (this._toneDuration > 0) {
		var d = this._toneDuration;
		for (var i = 0; i < 4; i++) {
			this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
		}
		this._toneDuration--;
	}
};

/**
 * 更新闪烁
 * Update flash
 *
 * @memberof Game_Screen
 * @description 更新闪烁效果
 */
Game_Screen.prototype.updateFlash = function () {
	if (this._flashDuration > 0) {
		var d = this._flashDuration;
		this._flashColor[3] *= (d - 1) / d;
		this._flashDuration--;
	}
};

/**
 * 更新震动
 * Update shake
 *
 * @memberof Game_Screen
 * @description 更新震动效果
 */
Game_Screen.prototype.updateShake = function () {
	if (this._shakeDuration > 0 || this._shake !== 0) {
		var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
		if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
			this._shake = 0;
		} else {
			this._shake += delta;
		}
		if (this._shake > this._shakePower * 2) {
			this._shakeDirection = -1;
		}
		if (this._shake < -this._shakePower * 2) {
			this._shakeDirection = 1;
		}
		this._shakeDuration--;
	}
};

/**
 * 更新缩放
 * Update zoom
 *
 * @memberof Game_Screen
 * @description 更新缩放效果
 */
Game_Screen.prototype.updateZoom = function () {
	if (this._zoomDuration > 0) {
		var d = this._zoomDuration;
		var t = this._zoomScaleTarget;
		this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
		this._zoomDuration--;
	}
};

/**
 * 更新天气
 * Update weather
 *
 * @memberof Game_Screen
 * @description 更新天气效果
 */
Game_Screen.prototype.updateWeather = function () {
	if (this._weatherDuration > 0) {
		var d = this._weatherDuration;
		var t = this._weatherPowerTarget;
		this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
		this._weatherDuration--;
		if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
			this._weatherType = "none";
		}
	}
};

/**
 * 更新图片
 * Update pictures
 *
 * @memberof Game_Screen
 * @description 更新所有图片对象
 */
Game_Screen.prototype.updatePictures = function () {
	this._pictures.forEach(function (picture) {
		if (picture) {
			picture.update();
		}
	});
};

/**
 * 开始伤害的闪烁
 * Start flash for damage
 *
 * @memberof Game_Screen
 * @description 开始受伤时的红色闪烁效果
 */
Game_Screen.prototype.startFlashForDamage = function () {
	this.startFlash([255, 0, 0, 128], 8);
};

/**
 * 显示图片
 * Show picture
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 * @param {string} name - 图片文件名
 * @param {number} origin - 原点（0:左上角 1:中心）
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} scaleX - X轴缩放
 * @param {number} scaleY - Y轴缩放
 * @param {number} opacity - 不透明度
 * @param {number} blendMode - 混合模式
 */
Game_Screen.prototype.showPicture = function (pictureId, name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
	var realPictureId = this.realPictureId(pictureId);
	var picture = new Game_Picture();
	picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
	this._pictures[realPictureId] = picture;
};

/**
 * 移动图片
 * Move picture
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 * @param {number} origin - 原点
 * @param {number} x - 目标X坐标
 * @param {number} y - 目标Y坐标
 * @param {number} scaleX - 目标X轴缩放
 * @param {number} scaleY - 目标Y轴缩放
 * @param {number} opacity - 目标不透明度
 * @param {number} blendMode - 混合模式
 * @param {number} duration - 移动持续时间（帧数）
 */
Game_Screen.prototype.movePicture = function (pictureId, origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
	var picture = this.picture(pictureId);
	if (picture) {
		picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
	}
};

/**
 * 旋转图片
 * Rotate picture
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 * @param {number} speed - 旋转速度
 */
Game_Screen.prototype.rotatePicture = function (pictureId, speed) {
	var picture = this.picture(pictureId);
	if (picture) {
		picture.rotate(speed);
	}
};

/**
 * 着色图片
 * Tint picture
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 * @param {Array} tone - 色调 [红, 绿, 蓝, 灰]
 * @param {number} duration - 着色持续时间（帧数）
 */
Game_Screen.prototype.tintPicture = function (pictureId, tone, duration) {
	var picture = this.picture(pictureId);
	if (picture) {
		picture.tint(tone, duration);
	}
};

/**
 * 消除图片
 * Erase picture
 *
 * @memberof Game_Screen
 * @param {number} pictureId - 图片ID
 */
Game_Screen.prototype.erasePicture = function (pictureId) {
	var realPictureId = this.realPictureId(pictureId);
	this._pictures[realPictureId] = null;
};
