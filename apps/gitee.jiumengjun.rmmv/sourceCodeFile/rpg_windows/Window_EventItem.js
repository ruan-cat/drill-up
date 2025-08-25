//=============================================================================
// Window_EventItem.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_事件物品 
// Window_EventItem
//
// 用于事件指令[物品选择处理]的窗口。 
// The window used for the event command [Select Item].

function Window_EventItem() {
    this.initialize.apply(this, arguments);
}

Window_EventItem.prototype = Object.create(Window_ItemList.prototype);
Window_EventItem.prototype.constructor = Window_EventItem;

/* 初始化 */
Window_EventItem.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    var width = Graphics.boxWidth;
    var height = this.windowHeight();
    Window_ItemList.prototype.initialize.call(this, 0, 0, width, height);
    this.openness = 0;
    this.deactivate();
    this.setHandler('ok',     this.onOk.bind(this));
    this.setHandler('cancel', this.onCancel.bind(this));
};

/* 窗口高度 */
Window_EventItem.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

/* 可见的行数 */
Window_EventItem.prototype.numVisibleRows = function() {
    return 4;
};

/* 开始 */
Window_EventItem.prototype.start = function() {
    this.refresh();
    this.updatePlacement();
    this.select(0);
    this.open();
    this.activate();
};

/* 更新位置 */
Window_EventItem.prototype.updatePlacement = function() {
    if (this._messageWindow.y >= Graphics.boxHeight / 2) {
        this.y = 0;
    } else {
        this.y = Graphics.boxHeight - this.height;
    }
};

/* 包含 */
Window_EventItem.prototype.includes = function(item) {
    var itypeId = $gameMessage.itemChoiceItypeId();
    return DataManager.isItem(item) && item.itypeId === itypeId;
};

/* 是否启用 */
Window_EventItem.prototype.isEnabled = function(item) {
    return true;
};

/* 当确定 */
Window_EventItem.prototype.onOk = function() {
    var item = this.item();
    var itemId = item ? item.id : 0;
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), itemId);
    this._messageWindow.terminateMessage();
    this.close();
};

/* 当取消 */
Window_EventItem.prototype.onCancel = function() {
    $gameVariables.setValue($gameMessage.itemChoiceVariableId(), 0);
    this._messageWindow.terminateMessage();
    this.close();
};
