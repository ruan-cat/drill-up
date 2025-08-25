//=============================================================================
// Sprite_StateIcon.js
//=============================================================================

//-----------------------------------------------------------------------------
// 精灵_状态图标 
// Sprite_StateIcon
//
// 显示状态图标的精灵。 
// The sprite for displaying state icons.
function Sprite_StateIcon() {
    this.initialize.apply(this, arguments);
}
Sprite_StateIcon.prototype = Object.create(Sprite.prototype);
Sprite_StateIcon.prototype.constructor = Sprite_StateIcon;
/* 初始化 */
Sprite_StateIcon.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.loadBitmap();
};
Sprite_StateIcon._iconWidth  = 32;  // 图标宽度 
Sprite_StateIcon._iconHeight = 32;  // 图标高度 
/* 初始化成员 */
Sprite_StateIcon.prototype.initMembers = function() {
    this._battler = null;
    this._iconIndex = 0;
    this._animationCount = 0;
    this._animationIndex = 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};
/* 加载位图 */
Sprite_StateIcon.prototype.loadBitmap = function() {
    this.bitmap = ImageManager.loadSystem('IconSet');
    this.setFrame(0, 0, 0, 0);
};
/* 设置 */
Sprite_StateIcon.prototype.setup = function(battler) {
    this._battler = battler;
};
/* 更新 */
Sprite_StateIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this._animationCount++;
    if (this._animationCount >= this.animationWait()) {
        this.updateIcon();
        this.updateFrame();
        this._animationCount = 0;
    }
};
/* 动画等待帧数 */
Sprite_StateIcon.prototype.animationWait = function() {
    return 40;
};
/* 更新图标 */
Sprite_StateIcon.prototype.updateIcon = function() {
    var icons = [];
    if (this._battler && this._battler.isAlive()) {
        icons = this._battler.allIcons();
    }
    if (icons.length > 0) {
        this._animationIndex++;
        if (this._animationIndex >= icons.length) {
            this._animationIndex = 0;
        }
        this._iconIndex = icons[this._animationIndex];
    } else {
        this._animationIndex = 0;
        this._iconIndex = 0;
    }
};
/* 更新帧 */
Sprite_StateIcon.prototype.updateFrame = function() {
    var pw = Sprite_StateIcon._iconWidth;
    var ph = Sprite_StateIcon._iconHeight;
    var sx = this._iconIndex % 16 * pw;
    var sy = Math.floor(this._iconIndex / 16) * ph;
    this.setFrame(sx, sy, pw, ph);
};