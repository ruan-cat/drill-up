//=============================================================================
// Sprite_Base.js
//=============================================================================

//-----------------------------------------------------------------------------
// 精灵_基础 
// Sprite_Base
//
// 具有显示动画功能的精灵类。 
// The sprite class with a feature which displays animations.

function Sprite_Base() {
    this.initialize.apply(this, arguments);
}

Sprite_Base.prototype = Object.create(Sprite.prototype);
Sprite_Base.prototype.constructor = Sprite_Base;

/* 初始化 */
Sprite_Base.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._animationSprites = [];
    this._effectTarget = this;
    this._hiding = false;
};

/* 更新 */
Sprite_Base.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisibility();
    this.updateAnimationSprites();
};

/* 隐藏 */
Sprite_Base.prototype.hide = function() {
    this._hiding = true;
    this.updateVisibility();
};

/* 显示 */
Sprite_Base.prototype.show = function() {
    this._hiding = false;
    this.updateVisibility();
};

/* 更新可见性 */
Sprite_Base.prototype.updateVisibility = function() {
    this.visible = !this._hiding;
};

/* 更新动画精灵 */
Sprite_Base.prototype.updateAnimationSprites = function() {
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

/* 开始动画 */
Sprite_Base.prototype.startAnimation = function(animation, mirror, delay) {
    var sprite = new Sprite_Animation();
    sprite.setup(this._effectTarget, animation, mirror, delay);
    this.parent.addChild(sprite);
    this._animationSprites.push(sprite);
};

/* 是否动画播放中 */
Sprite_Base.prototype.isAnimationPlaying = function() {
    return this._animationSprites.length > 0;
};