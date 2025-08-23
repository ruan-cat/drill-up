/**
 * @fileoverview Game_Picture - 图片对象类
 *
 * 用于管理游戏中显示图片的游戏对象类。
 * 处理图片的显示、移动、缩放、旋转、色调变化等功能。
 * The game object class for handling pictures.
 * Manages display, movement, scaling, rotation, and tone changes of pictures.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 图片对象类
 * Game picture class
 *
 * @class Game_Picture
 * @constructor
 */
function Game_Picture() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化图片对象
 * Initialize picture object
 *
 * @memberof Game_Picture
 * @method initialize
 */
Game_Picture.prototype.initialize = function () {
	this.initBasic();
	this.initTarget();
	this.initTone();
	this.initRotation();
};

/**
 * 获取图片名字
 * Get picture name
 *
 * @memberof Game_Picture
 * @method name
 * @returns {String} 图片名字 - Picture name
 */
Game_Picture.prototype.name = function () {
	return this._name;
};

/**
 * 获取图片原点
 * Get picture origin
 *
 * @memberof Game_Picture
 * @method origin
 * @returns {Number} 原点 (0:左上角, 1:中心) - Origin (0:top-left, 1:center)
 */
Game_Picture.prototype.origin = function () {
	return this._origin;
};

/**
 * 获取X坐标
 * Get X coordinate
 *
 * @memberof Game_Picture
 * @method x
 * @returns {Number} X坐标 - X coordinate
 */
Game_Picture.prototype.x = function () {
	return this._x;
};

/**
 * 获取Y坐标
 * Get Y coordinate
 *
 * @memberof Game_Picture
 * @method y
 * @returns {Number} Y坐标 - Y coordinate
 */
Game_Picture.prototype.y = function () {
	return this._y;
};

/**
 * 获取X轴方向的缩放比例
 * Get X axis scale ratio
 *
 * @memberof Game_Picture
 * @method scaleX
 * @returns {Number} X轴缩放比例 - X axis scale ratio
 */
Game_Picture.prototype.scaleX = function () {
	return this._scaleX;
};

/**
 * 获取Y轴方向的缩放比例
 * Get Y axis scale ratio
 *
 * @memberof Game_Picture
 * @method scaleY
 * @returns {Number} Y轴缩放比例 - Y axis scale ratio
 */
Game_Picture.prototype.scaleY = function () {
	return this._scaleY;
};

/**
 * 获取不透明度
 * Get opacity
 *
 * @memberof Game_Picture
 * @method opacity
 * @returns {Number} 不透明度 (0-255) - Opacity (0-255)
 */
Game_Picture.prototype.opacity = function () {
	return this._opacity;
};

/**
 * 获取混合模式
 * Get blend mode
 *
 * @memberof Game_Picture
 * @method blendMode
 * @returns {Number} 混合模式 - Blend mode
 */
Game_Picture.prototype.blendMode = function () {
	return this._blendMode;
};

/**
 * 获取色调
 * Get tone
 *
 * @memberof Game_Picture
 * @method tone
 * @returns {Array} 色调数组 [红, 绿, 蓝, 灰] - Tone array [red, green, blue, gray]
 */
Game_Picture.prototype.tone = function () {
	return this._tone;
};

/**
 * 获取角度
 * Get angle
 *
 * @memberof Game_Picture
 * @method angle
 * @returns {Number} 角度 - Angle
 */
Game_Picture.prototype.angle = function () {
	return this._angle;
};

/**
 * 初始化基本参数
 * Initialize basic parameters
 *
 * @memberof Game_Picture
 * @method initBasic
 */
Game_Picture.prototype.initBasic = function () {
	this._name = "";
	this._origin = 0;
	this._x = 0;
	this._y = 0;
	this._scaleX = 100;
	this._scaleY = 100;
	this._opacity = 255;
	this._blendMode = 0;
};

/**
 * 初始化目标参数
 * Initialize target parameters
 *
 * @memberof Game_Picture
 * @method initTarget
 */
Game_Picture.prototype.initTarget = function () {
	this._targetX = this._x;
	this._targetY = this._y;
	this._targetScaleX = this._scaleX;
	this._targetScaleY = this._scaleY;
	this._targetOpacity = this._opacity;
	this._duration = 0;
};

/**
 * 初始化色调
 * Initialize tone
 *
 * @memberof Game_Picture
 * @method initTone
 */
Game_Picture.prototype.initTone = function () {
	this._tone = null;
	this._toneTarget = null;
	this._toneDuration = 0;
};

/**
 * 初始化旋转
 * Initialize rotation
 *
 * @memberof Game_Picture
 * @method initRotation
 */
Game_Picture.prototype.initRotation = function () {
	this._angle = 0;
	this._rotationSpeed = 0;
};

/**
 * 显示图片
 * Show picture
 *
 * @memberof Game_Picture
 * @method show
 * @param {String} name - 图片文件名 - Picture filename
 * @param {Number} origin - 原点 (0:左上角, 1:中心) - Origin (0:top-left, 1:center)
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 * @param {Number} scaleX - X轴缩放比例 - X axis scale ratio
 * @param {Number} scaleY - Y轴缩放比例 - Y axis scale ratio
 * @param {Number} opacity - 不透明度 - Opacity
 * @param {Number} blendMode - 混合模式 - Blend mode
 */
Game_Picture.prototype.show = function (name, origin, x, y, scaleX, scaleY, opacity, blendMode) {
	this._name = name;
	this._origin = origin;
	this._x = x;
	this._y = y;
	this._scaleX = scaleX;
	this._scaleY = scaleY;
	this._opacity = opacity;
	this._blendMode = blendMode;
	this.initTarget();
	this.initTone();
	this.initRotation();
};

/**
 * 移动图片
 * Move picture
 *
 * @memberof Game_Picture
 * @method move
 * @param {Number} origin - 原点 - Origin
 * @param {Number} x - 目标X坐标 - Target X coordinate
 * @param {Number} y - 目标Y坐标 - Target Y coordinate
 * @param {Number} scaleX - 目标X轴缩放比例 - Target X axis scale ratio
 * @param {Number} scaleY - 目标Y轴缩放比例 - Target Y axis scale ratio
 * @param {Number} opacity - 目标不透明度 - Target opacity
 * @param {Number} blendMode - 混合模式 - Blend mode
 * @param {Number} duration - 持续时间(帧数) - Duration in frames
 */
Game_Picture.prototype.move = function (origin, x, y, scaleX, scaleY, opacity, blendMode, duration) {
	this._origin = origin;
	this._targetX = x;
	this._targetY = y;
	this._targetScaleX = scaleX;
	this._targetScaleY = scaleY;
	this._targetOpacity = opacity;
	this._blendMode = blendMode;
	this._duration = duration;
};

/**
 * 旋转图片
 * Rotate picture
 *
 * @memberof Game_Picture
 * @method rotate
 * @param {Number} speed - 旋转速度 - Rotation speed
 */
Game_Picture.prototype.rotate = function (speed) {
	this._rotationSpeed = speed;
};

/**
 * 着色图片
 * Tint picture
 *
 * @memberof Game_Picture
 * @method tint
 * @param {Array} tone - 目标色调 [红, 绿, 蓝, 灰] - Target tone [red, green, blue, gray]
 * @param {Number} duration - 持续时间(帧数) - Duration in frames
 */
Game_Picture.prototype.tint = function (tone, duration) {
	if (!this._tone) {
		this._tone = [0, 0, 0, 0];
	}
	this._toneTarget = tone.clone();
	this._toneDuration = duration;
	if (this._toneDuration === 0) {
		this._tone = this._toneTarget.clone();
	}
};

/**
 * 消除图片
 * Erase picture
 *
 * @memberof Game_Picture
 * @method erase
 */
Game_Picture.prototype.erase = function () {
	this._name = "";
	this._origin = 0;
	this.initTarget();
	this.initTone();
	this.initRotation();
};

/**
 * 更新图片
 * Update picture
 *
 * @memberof Game_Picture
 * @method update
 */
Game_Picture.prototype.update = function () {
	this.updateMove();
	this.updateTone();
	this.updateRotation();
};

/**
 * 更新移动
 * Update movement
 *
 * @memberof Game_Picture
 * @method updateMove
 */
Game_Picture.prototype.updateMove = function () {
	if (this._duration > 0) {
		var d = this._duration;
		this._x = (this._x * (d - 1) + this._targetX) / d;
		this._y = (this._y * (d - 1) + this._targetY) / d;
		this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
		this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
		this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
		this._duration--;
	}
};

/**
 * 更新色调
 * Update tone
 *
 * @memberof Game_Picture
 * @method updateTone
 */
Game_Picture.prototype.updateTone = function () {
	if (this._toneDuration > 0) {
		var d = this._toneDuration;
		for (var i = 0; i < 4; i++) {
			this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
		}
		this._toneDuration--;
	}
};

/**
 * 更新旋转
 * Update rotation
 *
 * @memberof Game_Picture
 * @method updateRotation
 */
Game_Picture.prototype.updateRotation = function () {
	if (this._rotationSpeed !== 0) {
		this._angle += this._rotationSpeed / 2;
	}
};
