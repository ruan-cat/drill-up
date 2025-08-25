//=============================================================================
// Window_EquipCommand.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_装备指令 
// Window_EquipCommand
//
// 在装备画面上的选择指令的窗口。 
// The window for selecting a command on the equipment screen.

function Window_EquipCommand() {
    this.initialize.apply(this, arguments);
}

Window_EquipCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_EquipCommand.prototype.constructor = Window_EquipCommand;

/* 初始化 */
Window_EquipCommand.prototype.initialize = function(x, y, width) {
    this._windowWidth = width;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

/* 窗口宽度 */
Window_EquipCommand.prototype.windowWidth = function() {
    return this._windowWidth;
};

/* 最大列数 */
Window_EquipCommand.prototype.maxCols = function() {
    return 3;
};

/* 制作指令列表 */
Window_EquipCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2,   'equip');
    this.addCommand(TextManager.optimize, 'optimize');
    this.addCommand(TextManager.clear,    'clear');
};
