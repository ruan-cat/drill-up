//=============================================================================
// Window_BattleEnemy.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_战斗敌人 
// Window_BattleEnemy
//
// 在战斗画面上的选择目标敌人的窗口。 
// The window for selecting a target enemy on the battle screen.

function Window_BattleEnemy() {
    this.initialize.apply(this, arguments);
}

Window_BattleEnemy.prototype = Object.create(Window_Selectable.prototype);
Window_BattleEnemy.prototype.constructor = Window_BattleEnemy;

/* 初始化 */
Window_BattleEnemy.prototype.initialize = function(x, y) {
    this._enemies = [];
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.hide();
};

/* 窗口宽度 */
Window_BattleEnemy.prototype.windowWidth = function() {
    return Graphics.boxWidth - 192;
};

/* 窗口高度 */
Window_BattleEnemy.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

/* 可见的行数 */
Window_BattleEnemy.prototype.numVisibleRows = function() {
    return 4;
};

/* 最大行数 */
Window_BattleEnemy.prototype.maxCols = function() {
    return 2;
};

/* 最大项目数 */
Window_BattleEnemy.prototype.maxItems = function() {
    return this._enemies.length;
};

/* 敌人 */
Window_BattleEnemy.prototype.enemy = function() {
    return this._enemies[this.index()];
};

/* 敌人索引 */
Window_BattleEnemy.prototype.enemyIndex = function() {
    var enemy = this.enemy();
    return enemy ? enemy.index() : -1;
};

/* 绘制项目 */
Window_BattleEnemy.prototype.drawItem = function(index) {
    this.resetTextColor();
    var name = this._enemies[index].name();
    var rect = this.itemRectForText(index);
    this.drawText(name, rect.x, rect.y, rect.width);
};

/* 显示 */
Window_BattleEnemy.prototype.show = function() {
    this.refresh();
    this.select(0);
    Window_Selectable.prototype.show.call(this);
};

/* 隐藏 */
Window_BattleEnemy.prototype.hide = function() {
    Window_Selectable.prototype.hide.call(this);
    $gameTroop.select(null);
};

/* 刷新 */
Window_BattleEnemy.prototype.refresh = function() {
    this._enemies = $gameTroop.aliveMembers();
    Window_Selectable.prototype.refresh.call(this);
};

/* 选择 */
Window_BattleEnemy.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
    $gameTroop.select(this.enemy());
};
