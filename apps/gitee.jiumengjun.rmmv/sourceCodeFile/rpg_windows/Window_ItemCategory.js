//=============================================================================
// Window_ItemCategory.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_物品类型 
// Window_ItemCategory
//
// 在物品和商店画面上的选择物品类型的窗口。 
// The window for selecting a category of items on the item and shop screens.

function Window_ItemCategory() {
    this.initialize.apply(this, arguments);
}

Window_ItemCategory.prototype = Object.create(Window_HorzCommand.prototype);
Window_ItemCategory.prototype.constructor = Window_ItemCategory;

/* 初始化 */
Window_ItemCategory.prototype.initialize = function() {
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
};

/* 窗口宽度 */
Window_ItemCategory.prototype.windowWidth = function() {
    return Graphics.boxWidth;
};

/* 最大列数 */
Window_ItemCategory.prototype.maxCols = function() {
    return 4;
};

/* 更新 */
Window_ItemCategory.prototype.update = function() {
    Window_HorzCommand.prototype.update.call(this);
    if (this._itemWindow) {
        this._itemWindow.setCategory(this.currentSymbol());
    }
};

/* 制作指令列表 */
Window_ItemCategory.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item,    'item');
    this.addCommand(TextManager.weapon,  'weapon');
    this.addCommand(TextManager.armor,   'armor');
    this.addCommand(TextManager.keyItem, 'keyItem');
};

/* 设置物品窗口 */
Window_ItemCategory.prototype.setItemWindow = function(itemWindow) {
    this._itemWindow = itemWindow;
};
