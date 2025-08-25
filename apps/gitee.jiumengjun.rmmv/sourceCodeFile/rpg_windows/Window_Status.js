//=============================================================================
// Window_Status.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_状态 
// Window_Status
//
// 在状态画面上的显示完整状态的窗口。 
// The window for displaying full status on the status screen.

function Window_Status() {
    this.initialize.apply(this, arguments);
}

Window_Status.prototype = Object.create(Window_Selectable.prototype);
Window_Status.prototype.constructor = Window_Status;

/* 初始化 */
Window_Status.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._actor = null;
    this.refresh();
    this.activate();
};

/* 设置角色 */
Window_Status.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

/* 刷新 */
Window_Status.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var lineHeight = this.lineHeight();
        this.drawBlock1(lineHeight * 0);
        this.drawHorzLine(lineHeight * 1);
        this.drawBlock2(lineHeight * 2);
        this.drawHorzLine(lineHeight * 6);
        this.drawBlock3(lineHeight * 7);
        this.drawHorzLine(lineHeight * 13);
        this.drawBlock4(lineHeight * 14);
    }
};

/* 绘制块 1 */
Window_Status.prototype.drawBlock1 = function(y) {
    this.drawActorName(this._actor, 6, y);
    this.drawActorClass(this._actor, 192, y);
    this.drawActorNickname(this._actor, 432, y);
};

/* 绘制块 2 */
Window_Status.prototype.drawBlock2 = function(y) {
    this.drawActorFace(this._actor, 12, y);
    this.drawBasicInfo(204, y);
    this.drawExpInfo(456, y);
};

/* 绘制块 3 */
Window_Status.prototype.drawBlock3 = function(y) {
    this.drawParameters(48, y);
    this.drawEquipments(432, y);
};

/* 绘制块 4 */
Window_Status.prototype.drawBlock4 = function(y) {
    this.drawProfile(6, y);
};

/* 绘制水平线 */
Window_Status.prototype.drawHorzLine = function(y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.lineColor());
    this.contents.paintOpacity = 255;
};

/* 线颜色 */
Window_Status.prototype.lineColor = function() {
    return this.normalColor();
};

/* 绘制基本信息 */
Window_Status.prototype.drawBasicInfo = function(x, y) {
    var lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, x, y + lineHeight * 0);
    this.drawActorIcons(this._actor, x, y + lineHeight * 1);
    this.drawActorHp(this._actor, x, y + lineHeight * 2);
    this.drawActorMp(this._actor, x, y + lineHeight * 3);
};

/* 绘制能力值 */
Window_Status.prototype.drawParameters = function(x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 6; i++) {
        var paramId = i + 2;
        var y2 = y + lineHeight * i;
        this.changeTextColor(this.systemColor());
        this.drawText(TextManager.param(paramId), x, y2, 160);
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x + 160, y2, 60, 'right');
    }
};

/* 绘制经验信息 */
Window_Status.prototype.drawExpInfo = function(x, y) {
    var lineHeight = this.lineHeight();
    var expTotal = TextManager.expTotal.format(TextManager.exp);
    var expNext = TextManager.expNext.format(TextManager.level);
    var value1 = this._actor.currentExp();
    var value2 = this._actor.nextRequiredExp();
    if (this._actor.isMaxLevel()) {
        value1 = '-------';
        value2 = '-------';
    }
    this.changeTextColor(this.systemColor());
    this.drawText(expTotal, x, y + lineHeight * 0, 270);
    this.drawText(expNext, x, y + lineHeight * 2, 270);
    this.resetTextColor();
    this.drawText(value1, x, y + lineHeight * 1, 270, 'right');
    this.drawText(value2, x, y + lineHeight * 3, 270, 'right');
};

/* 绘制装备 */
Window_Status.prototype.drawEquipments = function(x, y) {
    var equips = this._actor.equips();
    var count = Math.min(equips.length, this.maxEquipmentLines());
    for (var i = 0; i < count; i++) {
        this.drawItemName(equips[i], x, y + this.lineHeight() * i);
    }
};

/* 绘制简介 */
Window_Status.prototype.drawProfile = function(x, y) {
    this.drawTextEx(this._actor.profile(), x, y);
};

/* 最大装备行 */
Window_Status.prototype.maxEquipmentLines = function() {
    return 6;
};
