//=============================================================================
// Window_ScrollText.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_滚动文本 
// Window_ScrollText
//
// 显示滚动文本的窗口。没有边框显示，但为了方便起见，将其作为窗口处理。 
// The window for displaying scrolling text. No frame is displayed, but it
// is handled as a window for convenience.

function Window_ScrollText() {
    this.initialize.apply(this, arguments);
}

Window_ScrollText.prototype = Object.create(Window_Base.prototype);
Window_ScrollText.prototype.constructor = Window_ScrollText;

/* 初始化 */
Window_ScrollText.prototype.initialize = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this.hide();
    this._text = '';
    this._allTextHeight = 0;
};

/* 更新 */
Window_ScrollText.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if ($gameMessage.scrollMode()) {
        if (this._text) {
            this.updateMessage();
        }
        if (!this._text && $gameMessage.hasText()) {
            this.startMessage();
        }
    }
};

/* 开始信息 */
Window_ScrollText.prototype.startMessage = function() {
    this._text = $gameMessage.allText();
    this.refresh();
    this.show();
};

/* 刷新 */
Window_ScrollText.prototype.refresh = function() {
    var textState = { index: 0 };
    textState.text = this.convertEscapeCharacters(this._text);
    this.resetFontSettings();
    this._allTextHeight = this.calcTextHeight(textState, true);
    this.createContents();
    this.origin.y = -this.height;
    this.drawTextEx(this._text, this.textPadding(), 1);
};

/* 内容高度 */
Window_ScrollText.prototype.contentsHeight = function() {
    return Math.max(this._allTextHeight, 1);
};

/* 更新信息 */
Window_ScrollText.prototype.updateMessage = function() {
    this.origin.y += this.scrollSpeed();
    if (this.origin.y >= this.contents.height) {
        this.terminateMessage();
    }
};

/* 滚动速度 */
Window_ScrollText.prototype.scrollSpeed = function() {
    var speed = $gameMessage.scrollSpeed() / 2;
    if (this.isFastForward()) {
        speed *= this.fastForwardRate();
    }
    return speed;
};

/* 是否快进 */
Window_ScrollText.prototype.isFastForward = function() {
    if ($gameMessage.scrollNoFast()) {
        return false;
    } else {
        return (Input.isPressed('ok') || Input.isPressed('shift') ||
                TouchInput.isPressed());
    }
};

/* 快进倍率 */
Window_ScrollText.prototype.fastForwardRate = function() {
    return 3;
};

/* 结束信息 */
Window_ScrollText.prototype.terminateMessage = function() {
    this._text = null;
    $gameMessage.clear();
    this.hide();
};
