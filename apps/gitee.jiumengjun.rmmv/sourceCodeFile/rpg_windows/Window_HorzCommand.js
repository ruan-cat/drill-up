//=============================================================================
// Window_HorzCommand.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_水平指令 
// Window_HorzCommand
//
// 水平选择格式的指令窗口。 
// The command window for the horizontal selection format.

function Window_HorzCommand() {
    this.initialize.apply(this, arguments);
}

Window_HorzCommand.prototype = Object.create(Window_Command.prototype);
Window_HorzCommand.prototype.constructor = Window_HorzCommand;

/* 初始化 */
Window_HorzCommand.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
};

/* 可见的行数 */
Window_HorzCommand.prototype.numVisibleRows = function() {
    return 1;
};

/* 最大列数 */
Window_HorzCommand.prototype.maxCols = function() {
    return 4;
};

/* 项目文本对齐 */
Window_HorzCommand.prototype.itemTextAlign = function() {
    return 'center';
};
