/**
 * @fileoverview Sprite_Base - 精灵基类
 *
 * 具有显示动画功能的精灵类。
 * The sprite class with a feature which displays animations.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 精灵基类
 * Sprite base class
 *
 * @class Sprite_Base
 * @constructor
 * @extends Sprite
 */
function Sprite_Base() {
	this.initialize.apply(this, arguments);
}

Sprite_Base.prototype = Object.create(Sprite.prototype);
Sprite_Base.prototype.constructor = Sprite_Base;

/**
 * 初始化精灵基类
 * Initialize sprite base
 *
 * @memberof Sprite_Base
 * @method initialize
 */
Sprite_Base.prototype.initialize = function () {
	Sprite.prototype.initialize.call(this);
	this._animationSprites = [];
	this._effectTarget = this;
	this._hiding = false;
};

/**
 * 更新精灵
 * Update sprite
 *
 * @memberof Sprite_Base
 * @method update
 */
Sprite_Base.prototype.update = function () {
	Sprite.prototype.update.call(this);
	this.updateVisibility();
	this.updateAnimationSprites();
};

/**
 * 隐藏精灵
 * Hide sprite
 *
 * @memberof Sprite_Base
 * @method hide
 */
Sprite_Base.prototype.hide = function () {
	this._hiding = true;
	this.updateVisibility();
};

/**
 * 显示精灵
 * Show sprite
 *
 * @memberof Sprite_Base
 * @method show
 */
Sprite_Base.prototype.show = function () {
	this._hiding = false;
	this.updateVisibility();
};

/**
 * 更新可见性
 * Update visibility
 *
 * @memberof Sprite_Base
 * @method updateVisibility
 */
Sprite_Base.prototype.updateVisibility = function () {
	this.visible = !this._hiding;
};

/**
 * 更新动画精灵
 * Update animation sprites
 *
 * @memberof Sprite_Base
 * @method updateAnimationSprites
 */
Sprite_Base.prototype.updateAnimationSprites = function () {
	if (this._animationSprites.length > 0) {
		var sprites = this._animationSprites.clone();
		this._animationSprites = [];
		for (var i = 0; i < sprites.length; i++) {
			var sprite = sprites[i];
			if (sprite.isPlaying()) {
				this._animationSprites.push(sprite);
			} else {
				sprite.remove();
			}
		}
	}
};

/**
 * 开始动画
 * Start animation
 *
 * @memberof Sprite_Base
 * @method startAnimation
 * @param {Object} animation - 动画数据 - Animation data
 * @param {Boolean} mirror - 是否镜像 - Whether to mirror
 * @param {Number} delay - 延迟时间 - Delay time
 */
Sprite_Base.prototype.startAnimation = function (animation, mirror, delay) {
	var sprite = new Sprite_Animation();
	sprite.setup(this._effectTarget, animation, mirror, delay);
	this.parent.addChild(sprite);
	this._animationSprites.push(sprite);
};

/**
 * 检查是否正在播放动画
 * Check if animation is playing
 *
 * @memberof Sprite_Base
 * @method isAnimationPlaying
 * @returns {Boolean} 是否正在播放动画 - Whether animation is playing
 */
Sprite_Base.prototype.isAnimationPlaying = function () {
	return this._animationSprites.length > 0;
};
