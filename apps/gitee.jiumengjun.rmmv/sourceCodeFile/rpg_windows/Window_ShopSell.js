//=============================================================================
// Window_ShopSell.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_商店出售
// Window_ShopSell
//
// 在商店画面上的选择要出售的商品的窗口。
// The window for selecting an item to sell on the shop screen.

function Window_ShopSell() {
	this.initialize.apply(this, arguments);
}

Window_ShopSell.prototype = Object.create(Window_ItemList.prototype);
Window_ShopSell.prototype.constructor = Window_ShopSell;

/* 初始化 */
Window_ShopSell.prototype.initialize = function (x, y, width, height) {
	Window_ItemList.prototype.initialize.call(this, x, y, width, height);
};

/* 是否启用 */
Window_ShopSell.prototype.isEnabled = function (item) {
	return item && item.price > 0;
};
