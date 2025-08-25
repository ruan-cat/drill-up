//=============================================================================
// Window_SavefileList.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_存档列表 
// Window_SavefileList
//
// 在存档和读档画面上的选择存档的窗口。 
// The window for selecting a save file on the save and load screens.

function Window_SavefileList() {
    this.initialize.apply(this, arguments);
}

Window_SavefileList.prototype = Object.create(Window_Selectable.prototype);
Window_SavefileList.prototype.constructor = Window_SavefileList;

/* 初始化 */
Window_SavefileList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this._mode = null;
};

/* 设置模式 
 * @param {String} mode 模式（save：保存，load：读取） 
 */
Window_SavefileList.prototype.setMode = function(mode) {
    this._mode = mode;
};

/* 最大项目数 */
Window_SavefileList.prototype.maxItems = function() {
    return DataManager.maxSavefiles();
};

/* 最大可见的项目数 */
Window_SavefileList.prototype.maxVisibleItems = function() {
    return 5;
};

/* 项目高度 */
Window_SavefileList.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};

/* 绘制项目 */
Window_SavefileList.prototype.drawItem = function(index) {
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (this._mode === 'load') {
        this.changePaintOpacity(valid);
    }
    this.drawFileId(id, rect.x, rect.y);
    if (info) {
        this.changePaintOpacity(valid);
        this.drawContents(info, rect, valid);
        this.changePaintOpacity(true);
    }
};

/* 绘制文件 ID */
Window_SavefileList.prototype.drawFileId = function(id, x, y) {
    this.drawText(TextManager.file + ' ' + id, x, y, 180);
};

/* 绘制内容 */
Window_SavefileList.prototype.drawContents = function(info, rect, valid) {
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
        if (valid) {
            this.drawPartyCharacters(info, rect.x + 220, bottom - 4);
        }
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    if (y2 >= lineHeight) {
        this.drawPlaytime(info, rect.x, y2, rect.width);
    }
};

/* 绘制游戏标题 */
Window_SavefileList.prototype.drawGameTitle = function(info, x, y, width) {
    if (info.title) {
        this.drawText(info.title, x, y, width);
    }
};

/* 绘制队伍行走图 */
Window_SavefileList.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            var data = info.characters[i];
            this.drawCharacter(data[0], data[1], x + i * 48, y);
        }
    }
};

/* 绘制游戏时间 */
Window_SavefileList.prototype.drawPlaytime = function(info, x, y, width) {
    if (info.playtime) {
        this.drawText(info.playtime, x, y, width, 'right');
    }
};

/* 播放确定声音 */
Window_SavefileList.prototype.playOkSound = function() {
};
