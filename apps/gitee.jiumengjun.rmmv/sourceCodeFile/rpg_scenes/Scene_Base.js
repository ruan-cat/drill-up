/**
 * @fileoverview Scene_Base - 场景基类
 *
 * 游戏中所有场景的父类。
 * The superclass of all scenes within the game.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 场景基类
 * Scene base class
 *
 * @class Scene_Base
 * @constructor
 * @extends Stage
 */
function Scene_Base() {
	this.initialize.apply(this, arguments);
}

Scene_Base.prototype = Object.create(Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;

/**
 * 初始化场景基类
 * Initialize scene base
 *
 * @memberof Scene_Base
 * @method initialize
 */
Scene_Base.prototype.initialize = function () {
	Stage.prototype.initialize.call(this);
	this._active = false;
	this._fadeSign = 0;
	this._fadeDuration = 0;
	this._fadeSprite = null;
	this._imageReservationId = Utils.generateRuntimeId();
};

/**
 * 附加预留到预留队列
 * Attach reservation to reserve queue
 *
 * @memberof Scene_Base
 * @method attachReservation
 */
Scene_Base.prototype.attachReservation = function () {
	ImageManager.setDefaultReservationId(this._imageReservationId);
};

/**
 * 从预留队列移除预留
 * Remove reservation from reserve queue
 *
 * @memberof Scene_Base
 * @method detachReservation
 */
Scene_Base.prototype.detachReservation = function () {
	ImageManager.releaseReservation(this._imageReservationId);
};

/**
 * 创建组件并添加到渲染流程
 * Create components and add to rendering process
 *
 * @memberof Scene_Base
 * @method create
 */
Scene_Base.prototype.create = function () {};

/**
 * 检查场景是否活动
 * Check if scene is active
 *
 * @memberof Scene_Base
 * @method isActive
 * @returns {Boolean} 如果场景活动则返回true - Returns true if scene is active
 */
Scene_Base.prototype.isActive = function () {
	return this._active;
};

/**
 * 检查场景是否准备就绪
 * Check if scene is ready to start
 *
 * @memberof Scene_Base
 * @method isReady
 * @returns {Boolean} 如果场景准备就绪则返回true - Returns true if scene is ready to start
 */
Scene_Base.prototype.isReady = function () {
	return ImageManager.isReady();
};

/**
 * 开始场景处理
 * Start scene processing
 *
 * @memberof Scene_Base
 * @method start
 */
Scene_Base.prototype.start = function () {
	this._active = true;
};

/**
 * 更新场景处理
 * Update scene processing
 *
 * @memberof Scene_Base
 * @method update
 */
Scene_Base.prototype.update = function () {
	this.updateFade();
	this.updateChildren();
};

/**
 * 停止场景处理
 * Stop scene processing
 *
 * @memberof Scene_Base
 * @method stop
 */
Scene_Base.prototype.stop = function () {
	this._active = false;
};

/**
 * 检查场景是否繁忙
 * Check if scene is busy
 *
 * @memberof Scene_Base
 * @method isBusy
 * @returns {Boolean} 如果场景繁忙则返回true - Returns true if scene is busy
 */
Scene_Base.prototype.isBusy = function () {
	return this._fadeDuration > 0;
};

/**
 * 终止场景处理
 * Terminate scene processing
 *
 * @memberof Scene_Base
 * @method terminate
 */
Scene_Base.prototype.terminate = function () {};

/**
 * 创建窗口图层
 * Create window layer
 *
 * @memberof Scene_Base
 * @method createWindowLayer
 */
Scene_Base.prototype.createWindowLayer = function () {
	var width = Graphics.boxWidth;
	var height = Graphics.boxHeight;
	var x = (Graphics.width - width) / 2;
	var y = (Graphics.height - height) / 2;
	this._windowLayer = new WindowLayer();
	this._windowLayer.move(x, y, width, height);
	this.addChild(this._windowLayer);
};

/**
 * 添加窗口到窗口图层
 * Add window to window layer
 *
 * @memberof Scene_Base
 * @method addWindow
 * @param {Window} window - 窗口对象 - Window object
 */
Scene_Base.prototype.addWindow = function (window) {
	this._windowLayer.addChild(window);
};

/**
 * 开始淡入效果
 * Start fade in effect
 *
 * @memberof Scene_Base
 * @method startFadeIn
 * @param {Number} [duration=30] - 淡入时间 - Fade in duration
 * @param {Boolean} [white=false] - 是否使用白色 - Whether to use white color
 */
Scene_Base.prototype.startFadeIn = function (duration, white) {
	this.createFadeSprite(white);
	this._fadeSign = 1;
	this._fadeDuration = duration || 30;
	this._fadeSprite.opacity = 255;
};

/**
 * 开始淡出效果
 * Start fade out effect
 *
 * @memberof Scene_Base
 * @method startFadeOut
 * @param {Number} [duration=30] - 淡出时间 - Fade out duration
 * @param {Boolean} [white=false] - 是否使用白色 - Whether to use white color
 */
Scene_Base.prototype.startFadeOut = function (duration, white) {
	this.createFadeSprite(white);
	this._fadeSign = -1;
	this._fadeDuration = duration || 30;
	this._fadeSprite.opacity = 0;
};

/**
 * 创建淡化精灵
 * Create fade sprite
 *
 * @memberof Scene_Base
 * @method createFadeSprite
 * @param {Boolean} white - 是否使用白色 - Whether to use white color
 */
Scene_Base.prototype.createFadeSprite = function (white) {
	if (!this._fadeSprite) {
		this._fadeSprite = new ScreenSprite();
		this.addChild(this._fadeSprite);
	}
	if (white) {
		this._fadeSprite.setWhite();
	} else {
		this._fadeSprite.setBlack();
	}
};

/**
 * 更新淡化效果
 * Update fade effect
 *
 * @memberof Scene_Base
 * @method updateFade
 */
Scene_Base.prototype.updateFade = function () {
	if (this._fadeDuration > 0) {
		var d = this._fadeDuration;
		if (this._fadeSign > 0) {
			this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
		} else {
			this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
		}
		this._fadeDuration--;
	}
};

/**
 * 更新子元素
 * Update children elements
 *
 * @memberof Scene_Base
 * @method updateChildren
 */
Scene_Base.prototype.updateChildren = function () {
	this.children.forEach(function (child) {
		if (child.update) {
			child.update();
		}
	});
};

/**
 * 弹出场景
 * Pop scene
 *
 * @memberof Scene_Base
 * @method popScene
 */
Scene_Base.prototype.popScene = function () {
	SceneManager.pop();
};

/**
 * 检查游戏结束
 * Check game over
 *
 * @memberof Scene_Base
 * @method checkGameover
 */
Scene_Base.prototype.checkGameover = function () {
	if ($gameParty.isAllDead()) {
		SceneManager.goto(Scene_Gameover);
	}
};

/**
 * 淡出所有内容
 * Fade out all content
 *
 * @memberof Scene_Base
 * @method fadeOutAll
 */
Scene_Base.prototype.fadeOutAll = function () {
	var time = this.slowFadeSpeed() / 60;
	AudioManager.fadeOutBgm(time);
	AudioManager.fadeOutBgs(time);
	AudioManager.fadeOutMe(time);
	this.startFadeOut(this.slowFadeSpeed());
};

/**
 * 获取淡化速度
 * Get fade speed
 *
 * @memberof Scene_Base
 * @method fadeSpeed
 * @returns {Number} 淡化速度 - Fade speed value
 */
Scene_Base.prototype.fadeSpeed = function () {
	return 24;
};

/**
 * 获取慢速淡化速度
 * Get slow fade speed
 *
 * @memberof Scene_Base
 * @method slowFadeSpeed
 * @returns {Number} 慢速淡化速度 - Slow fade speed value
 */
Scene_Base.prototype.slowFadeSpeed = function () {
	return this.fadeSpeed() * 2;
};
