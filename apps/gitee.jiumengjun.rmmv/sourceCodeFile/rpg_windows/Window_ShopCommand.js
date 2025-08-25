//=============================================================================
// Window_ShopCommand.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_商店指令 
// Window_ShopCommand
//
// 在商店画面上的选择购买/出售的窗口。 
// The window for selecting buy/sell on the shop screen.

function Window_ShopCommand() {
    this.initialize.apply(this, arguments);
}

Window_ShopCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_ShopCommand.prototype.constructor = Window_ShopCommand;

/* 初始化 */
Window_ShopCommand.prototype.initialize = function(width, purchaseOnly) {
    this._windowWidth = width;
    this._purchaseOnly = purchaseOnly;
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};

/* 窗口宽度 */
Window_ShopCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};

/* 最大列数 */
Window_ShopCommand.prototype.maxCols = function() {
    return 3;
};

/* 制作指令列表 */
Window_ShopCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.buy,    'buy');
    this.addCommand(TextManager.sell,   'sell',   !this._purchaseOnly);
    this.addCommand(TextManager.cancel, 'cancel');
};
