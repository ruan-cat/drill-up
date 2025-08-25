//=============================================================================
// Sprite_Battler.js
//=============================================================================

//-----------------------------------------------------------------------------
// 精灵_战斗者 
// Sprite_Battler
//
// Sprite_Actor 和 Sprite_Enemy 的父类。 
// The superclass of Sprite_Actor and Sprite_Enemy.
function Sprite_Battler() {
    this.initialize.apply(this, arguments);
}
Sprite_Battler.prototype = Object.create(Sprite_Base.prototype);
Sprite_Battler.prototype.constructor = Sprite_Battler;
/* 初始化 */
Sprite_Battler.prototype.initialize = function(battler) {
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers();
    this.setBattler(battler);
};
/* 初始化成员 */
Sprite_Battler.prototype.initMembers = function() {
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this._battler = null;
    this._damages = [];
    this._homeX = 0;
    this._homeY = 0;
    this._offsetX = 0;
    this._offsetY = 0;
    this._targetOffsetX = NaN;
    this._targetOffsetY = NaN;
    this._movementDuration = 0;
    this._selectionEffectCount = 0;
};
/* 设置战斗者 */
Sprite_Battler.prototype.setBattler = function(battler) {
    this._battler = battler;
};
/* 设置家 
 * 以该位置为原点来设置战斗者的偏移位置。 
 */
Sprite_Battler.prototype.setHome = function(x, y) {
    this._homeX = x;
    this._homeY = y;
    this.updatePosition();
};
/* 更新 */
Sprite_Battler.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (this._battler) {
        this.updateMain();
        this.updateAnimation();
        this.updateDamagePopup();
        this.updateSelectionEffect();
    } else {
        this.bitmap = null;
    }
};
/* 更新可见性 */
Sprite_Battler.prototype.updateVisibility = function() {
    Sprite_Base.prototype.updateVisibility.call(this);
    if (!this._battler || !this._battler.isSpriteVisible()) {
        this.visible = false;
    }
};
/* 更新主函数 */
Sprite_Battler.prototype.updateMain = function() {
    if (this._battler.isSpriteVisible()) {
        this.updateBitmap();
        this.updateFrame();
    }
    this.updateMove();
    this.updatePosition();
};
/* 更新位图 */
Sprite_Battler.prototype.updateBitmap = function() {
};
/* 更新帧 */
Sprite_Battler.prototype.updateFrame = function() {
};
/* 更新移动 */
Sprite_Battler.prototype.updateMove = function() {
    if (this._movementDuration > 0) {
        var d = this._movementDuration;
        this._offsetX = (this._offsetX * (d - 1) + this._targetOffsetX) / d;
        this._offsetY = (this._offsetY * (d - 1) + this._targetOffsetY) / d;
        this._movementDuration--;
        if (this._movementDuration === 0) {
            this.onMoveEnd();
        }
    }
};
/* 更新位置 */
Sprite_Battler.prototype.updatePosition = function() {
    this.x = this._homeX + this._offsetX;
    this.y = this._homeY + this._offsetY;
};
/* 更新动画 */
Sprite_Battler.prototype.updateAnimation = function() {
    this.setupAnimation();
};
/* 更新伤害弹出层 */
Sprite_Battler.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
        for (var i = 0; i < this._damages.length; i++) {
            this._damages[i].update();
        }
        if (!this._damages[0].isPlaying()) {
            this.parent.removeChild(this._damages[0]);
            this._damages.shift();
        }
    }
};
/* 更新选择效果 */
Sprite_Battler.prototype.updateSelectionEffect = function() {
    var target = this._effectTarget;
    if (this._battler.isSelected()) {
        this._selectionEffectCount++;
        if (this._selectionEffectCount % 30 < 15) {
            target.setBlendColor([255, 255, 255, 64]);
        } else {
            target.setBlendColor([0, 0, 0, 0]);
        }
    } else if (this._selectionEffectCount > 0) {
        this._selectionEffectCount = 0;
        target.setBlendColor([0, 0, 0, 0]);
    }
};
/* 设置动画 */
Sprite_Battler.prototype.setupAnimation = function() {
    while (this._battler.isAnimationRequested()) {
        var data = this._battler.shiftAnimation();
        var animation = $dataAnimations[data.animationId];
        var mirror = data.mirror;
        var delay = animation.position === 3 ? 0 : data.delay;
        this.startAnimation(animation, mirror, delay);
        for (var i = 0; i < this._animationSprites.length; i++) {
            var sprite = this._animationSprites[i];
            sprite.visible = this._battler.isSpriteVisible();
        }
    }
};
/* 设置伤害弹出层 */
Sprite_Battler.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        if (this._battler.isSpriteVisible()) {
            var sprite = new Sprite_Damage();
            sprite.x = this.x + this.damageOffsetX();
            sprite.y = this.y + this.damageOffsetY();
            sprite.setup(this._battler);
            this._damages.push(sprite);
            this.parent.addChild(sprite);
        }
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
};
/* 伤害的偏移坐标 X */
Sprite_Battler.prototype.damageOffsetX = function() {
    return 0;
};
/* 伤害的偏移坐标 Y */
Sprite_Battler.prototype.damageOffsetY = function() {
    return 0;
};
/* 开始移动 */
Sprite_Battler.prototype.startMove = function(x, y, duration) {
    if (this._targetOffsetX !== x || this._targetOffsetY !== y) {
        this._targetOffsetX = x;
        this._targetOffsetY = y;
        this._movementDuration = duration;
        if (duration === 0) {
            this._offsetX = x;
            this._offsetY = y;
        }
    }
};
/* 当移动结束 */
Sprite_Battler.prototype.onMoveEnd = function() {
};
/* 是否效果中 */
Sprite_Battler.prototype.isEffecting = function() {
    return false;
};
/* 是否移动中 */
Sprite_Battler.prototype.isMoving = function() {
    return this._movementDuration > 0;
};
/* 是否在家的坐标中 */
Sprite_Battler.prototype.inHomePosition = function() {
    return this._offsetX === 0 && this._offsetY === 0;
};