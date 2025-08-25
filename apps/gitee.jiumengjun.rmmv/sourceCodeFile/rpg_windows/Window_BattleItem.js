//=============================================================================
// Window_BattleItem.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_战斗物品
// Window_BattleItem
//
// 在战斗画面上的选择要使用的物品的窗口。
// The window for selecting an item to use on the battle screen.

function Window_BattleItem() {
	this.initialize.apply(this, arguments);
}

Window_BattleItem.prototype = Object.create(Window_ItemList.prototype);
Window_BattleItem.prototype.constructor = Window_BattleItem;

/* 初始化 */
Window_BattleItem.prototype.initialize = function (x, y, width, height) {
	Window_ItemList.prototype.initialize.call(this, x, y, width, height);
	this.hide();
};

/* 包含 */
Window_BattleItem.prototype.includes = function (item) {
	return $gameParty.canUse(item);
};

/* 显示 */
Window_BattleItem.prototype.show = function () {
	this.selectLast();
	this.showHelpWindow();
	Window_ItemList.prototype.show.call(this);
};

/* 隐藏 */
Window_BattleItem.prototype.hide = function () {
	this.hideHelpWindow();
	Window_ItemList.prototype.hide.call(this);
};
