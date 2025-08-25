//=============================================================================
// Window_Command.js
//=============================================================================

/**
 * 窗口_指令
 * 选择指令的窗口的父类。
 * The superclass of windows for selecting a command.
 *
 * @class Window_Command
 * @extends Window_Selectable
 */

function Window_Command() {
    this.initialize.apply(this, arguments);
}

Window_Command.prototype = Object.create(Window_Selectable.prototype);
Window_Command.prototype.constructor = Window_Command;

/**
 * 初始化
 * Initialize the window.
 *
 * @method initialize
 * @param {Number} x - X坐标 The x coordinate
 * @param {Number} y - Y坐标 The y coordinate
 */
Window_Command.prototype.initialize = function(x, y) {
    this.clearCommandList();
    this.makeCommandList();
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.select(0);
    this.activate();
};

/**
 * 窗口宽度
 * Returns the width of the window.
 *
 * @method windowWidth
 * @returns {Number} 窗口的宽度 The width of the window
 */
Window_Command.prototype.windowWidth = function() {
    return 240;
};

/**
 * 窗口高度
 * Returns the height of the window.
 *
 * @method windowHeight
 * @returns {Number} 窗口的高度 The height of the window
 */
Window_Command.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

/**
 * 可见的行数
 * Returns the number of visible rows.
 *
 * @method numVisibleRows
 * @returns {Number} 可见的行数 The number of visible rows
 */
Window_Command.prototype.numVisibleRows = function() {
    return Math.ceil(this.maxItems() / this.maxCols());
};

/**
 * 最大项目数
 * Returns the maximum number of items.
 *
 * @method maxItems
 * @returns {Number} 最大项目数 The maximum number of items
 */
Window_Command.prototype.maxItems = function() {
    return this._list.length;
};

/**
 * 清空指令列表
 * Clears the command list.
 *
 * @method clearCommandList
 */
Window_Command.prototype.clearCommandList = function() {
    this._list = [];
};

/**
 * 制作指令列表
 * Makes the command list.
 *
 * @method makeCommandList
 */
Window_Command.prototype.makeCommandList = function() {
};

/**
 * 增加指令
 * Adds a command to the list.
 *
 * @method addCommand
 * @param {String} name - 指令名称 The command name
 * @param {String} symbol - 指令标识 The command symbol
 * @param {Boolean} [enabled=true] - 是否启用 Whether enabled
 * @param {*} [ext=null] - 扩展数据 Extension data
 */
Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
    if (enabled === undefined) {
        enabled = true;
    }
    if (ext === undefined) {
        ext = null;
    }
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext});
};

/**
 * 指令名字
 * Returns the command name at the specified index.
 *
 * @method commandName
 * @param {Number} index - 索引 The index
 * @returns {String} 指令名称 The command name
 */
Window_Command.prototype.commandName = function(index) {
    return this._list[index].name;
};

/**
 * 指令标识
 * Returns the command symbol at the specified index.
 *
 * @method commandSymbol
 * @param {Number} index - 索引 The index
 * @returns {String} 指令标识 The command symbol
 */
Window_Command.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};

/**
 * 是否指令启用
 * Checks whether the command is enabled.
 *
 * @method isCommandEnabled
 * @param {Number} index - 索引 The index
 * @returns {Boolean} 是否启用 Whether the command is enabled
 */
Window_Command.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};

/**
 * 当前数据
 * Returns the current command data.
 *
 * @method currentData
 * @returns {Object|null} 当前命令数据 The current command data
 */
Window_Command.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};

/**
 * 是否当前项目启用
 * Checks whether the current item is enabled.
 *
 * @method isCurrentItemEnabled
 * @returns {Boolean} 是否启用 Whether the current item is enabled
 */
Window_Command.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};

/**
 * 当前标识
 * Returns the current command symbol.
 *
 * @method currentSymbol
 * @returns {String|null} 当前标识 The current command symbol
 */
Window_Command.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};

/**
 * 当前扩展
 * Returns the current command extension data.
 *
 * @method currentExt
 * @returns {*} 当前扩展数据 The current command extension data
 */
Window_Command.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};

/**
 * 寻找标识
 * Finds the index of the command with the specified symbol.
 *
 * @method findSymbol
 * @param {String} symbol - 要查找的标识 The symbol to find
 * @returns {Number} 命令索引，未找到返回-1 The command index, -1 if not found
 */
Window_Command.prototype.findSymbol = function(symbol) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].symbol === symbol) {
            return i;
        }
    }
    return -1;
};

/**
 * 选择标识
 * Selects the command with the specified symbol.
 *
 * @method selectSymbol
 * @param {String} symbol - 要选择的标识 The symbol to select
 */
Window_Command.prototype.selectSymbol = function(symbol) {
    var index = this.findSymbol(symbol);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

/**
 * 寻找扩展
 * Finds the index of the command with the specified extension data.
 *
 * @method findExt
 * @param {*} ext - 要查找的扩展数据 The extension data to find
 * @returns {Number} 命令索引，未找到返回-1 The command index, -1 if not found
 */
Window_Command.prototype.findExt = function(ext) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].ext === ext) {
            return i;
        }
    }
    return -1;
};

/**
 * 选择扩展
 * Selects the command with the specified extension data.
 *
 * @method selectExt
 * @param {*} ext - 要选择的扩展数据 The extension data to select
 */
Window_Command.prototype.selectExt = function(ext) {
    var index = this.findExt(ext);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

/**
 * 绘制项目
 * Draws the item at the specified index.
 *
 * @method drawItem
 * @param {Number} index - 项目索引 The item index
 */
Window_Command.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

/**
 * 项目文本对齐
 * Returns the text alignment for items.
 *
 * @method itemTextAlign
 * @returns {String} 文本对齐方式 The text alignment
 */
Window_Command.prototype.itemTextAlign = function() {
    return 'left';
};

/**
 * 是否确定启用
 * Checks whether the OK handler is enabled.
 *
 * @method isOkEnabled
 * @returns {Boolean} 是否启用 Whether the OK handler is enabled
 */
Window_Command.prototype.isOkEnabled = function() {
    return true;
};

/**
 * 呼叫确定处理者
 * Calls the OK handler.
 *
 * @method callOkHandler
 */
Window_Command.prototype.callOkHandler = function() {
    var symbol = this.currentSymbol();
    if (this.isHandled(symbol)) {
        this.callHandler(symbol);
    } else if (this.isHandled('ok')) {
        Window_Selectable.prototype.callOkHandler.call(this);
    } else {
        this.activate();
    }
};

/**
 * 刷新
 * Refreshes the window.
 *
 * @method refresh
 */
Window_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};