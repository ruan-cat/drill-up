//=============================================================================
// Window_Command.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_指令 
// Window_Command
//
// 选择指令的窗口的父类。 
// The superclass of windows for selecting a command.

function Window_Command() {
    this.initialize.apply(this, arguments);
}

Window_Command.prototype = Object.create(Window_Selectable.prototype);
Window_Command.prototype.constructor = Window_Command;

/* 初始化 */
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

/* 窗口宽度 */
Window_Command.prototype.windowWidth = function() {
    return 240;
};

/* 窗口高度 */
Window_Command.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

/* 可见的行数 */
Window_Command.prototype.numVisibleRows = function() {
    return Math.ceil(this.maxItems() / this.maxCols());
};

/* 最大项目数 */
Window_Command.prototype.maxItems = function() {
    return this._list.length;
};

/* 清空指令列表 */
Window_Command.prototype.clearCommandList = function() {
    this._list = [];
};

/* 制作指令列表 */
Window_Command.prototype.makeCommandList = function() {
};

/* 增加指令 */
Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
    if (enabled === undefined) {
        enabled = true;
    }
    if (ext === undefined) {
        ext = null;
    }
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext});
};

/* 指令名字 */
Window_Command.prototype.commandName = function(index) {
    return this._list[index].name;
};

/* 指令标识 */
Window_Command.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};

/* 是否指令启用 */
Window_Command.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};

/* 当前数据 */
Window_Command.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};

/* 是否当前项目启用 */
Window_Command.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};

/* 当前标识 */
Window_Command.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};

/* 当前扩展 */
Window_Command.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};

/* 寻找标识 */
Window_Command.prototype.findSymbol = function(symbol) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].symbol === symbol) {
            return i;
        }
    }
    return -1;
};

/* 选择标识 */
Window_Command.prototype.selectSymbol = function(symbol) {
    var index = this.findSymbol(symbol);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

/* 寻找扩展 */
Window_Command.prototype.findExt = function(ext) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].ext === ext) {
            return i;
        }
    }
    return -1;
};

/* 选择扩展 */
Window_Command.prototype.selectExt = function(ext) {
    var index = this.findExt(ext);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

/* 绘制项目 */
Window_Command.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

/* 项目文本对齐 */
Window_Command.prototype.itemTextAlign = function() {
    return 'left';
};

/* 是否确定启用 */
Window_Command.prototype.isOkEnabled = function() {
    return true;
};

/* 呼叫确定处理者 */
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

/* 刷新 */
Window_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};