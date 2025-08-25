//=============================================================================
// Sprite_Timer.js
//=============================================================================

//-----------------------------------------------------------------------------
// 精灵_计时器 
// Sprite_Timer
//
// 显示计时器的精灵。 
// The sprite for displaying the timer.
function Sprite_Timer() {
    this.initialize.apply(this, arguments);
}
Sprite_Timer.prototype = Object.create(Sprite.prototype);
Sprite_Timer.prototype.constructor = Sprite_Timer;
/* 初始化 */
Sprite_Timer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._seconds = 0;
    this.createBitmap();
    this.update();
};
/* 创建位图 */
Sprite_Timer.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(96, 48);
    this.bitmap.fontSize = 32;
};
/* 更新 */
Sprite_Timer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
    this.updatePosition();
    this.updateVisibility();
};
/* 更新位图 */
Sprite_Timer.prototype.updateBitmap = function() {
    if (this._seconds !== $gameTimer.seconds()) {
        this._seconds = $gameTimer.seconds();
        this.redraw();
    }
};
/* 重绘 */
Sprite_Timer.prototype.redraw = function() {
    var text = this.timerText();
    var width = this.bitmap.width;
    var height = this.bitmap.height;
    this.bitmap.clear();
    this.bitmap.drawText(text, 0, 0, width, height, 'center');
};
/* 计时器文本 */
Sprite_Timer.prototype.timerText = function() {
    var min = Math.floor(this._seconds / 60) % 60;
    var sec = this._seconds % 60;
    return min.padZero(2) + ':' + sec.padZero(2);
};
/* 更新位置 */
Sprite_Timer.prototype.updatePosition = function() {
    this.x = Graphics.width - this.bitmap.width;
    this.y = 0;
};
/* 更新可见性 */
Sprite_Timer.prototype.updateVisibility = function() {
    this.visible = $gameTimer.isWorking();
};