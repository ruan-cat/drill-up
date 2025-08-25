//=============================================================================
// Window_Selectable.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_可选择
// Window_Selectable
//
// 具有光标移动和滚动功能的窗口类。
// The window class with cursor movement and scroll functions.

function Window_Selectable() {
	this.initialize.apply(this, arguments);
}

Window_Selectable.prototype = Object.create(Window_Base.prototype);
Window_Selectable.prototype.constructor = Window_Selectable;

/* 初始化 */
Window_Selectable.prototype.initialize = function (x, y, width, height) {
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this._index = -1;
	this._cursorFixed = false;
	this._cursorAll = false;
	this._stayCount = 0;
	this._helpWindow = null;
	this._handlers = {};
	this._touching = false;
	this._scrollX = 0;
	this._scrollY = 0;
	this.deactivate();
};

/* 索引 */
Window_Selectable.prototype.index = function () {
	return this._index;
};

/* 光标固定
 * 选中对象，光标固定不再闪烁。
 */
Window_Selectable.prototype.cursorFixed = function () {
	return this._cursorFixed;
};

/* 设置光标固定 */
Window_Selectable.prototype.setCursorFixed = function (cursorFixed) {
	this._cursorFixed = cursorFixed;
};

/* 光标所有
 * 选中所有对象。
 */
Window_Selectable.prototype.cursorAll = function () {
	return this._cursorAll;
};

/* 设置光标所有 */
Window_Selectable.prototype.setCursorAll = function (cursorAll) {
	this._cursorAll = cursorAll;
};

/* 最大列数 */
Window_Selectable.prototype.maxCols = function () {
	return 1;
};

/* 最大项目数 */
Window_Selectable.prototype.maxItems = function () {
	return 0;
};

/* 间隔 */
Window_Selectable.prototype.spacing = function () {
	return 12;
};

/* 项目宽度 */
Window_Selectable.prototype.itemWidth = function () {
	return Math.floor((this.width - this.padding * 2 + this.spacing()) / this.maxCols() - this.spacing());
};

/* 项目高度 */
Window_Selectable.prototype.itemHeight = function () {
	return this.lineHeight();
};

/* 最大行数 */
Window_Selectable.prototype.maxRows = function () {
	return Math.max(Math.ceil(this.maxItems() / this.maxCols()), 1);
};

/* 活动 */
Window_Selectable.prototype.activate = function () {
	Window_Base.prototype.activate.call(this);
	this.reselect();
};

/* 不活动 */
Window_Selectable.prototype.deactivate = function () {
	Window_Base.prototype.deactivate.call(this);
	this.reselect();
};

/* 选择 */
Window_Selectable.prototype.select = function (index) {
	this._index = index;
	this._stayCount = 0;
	this.ensureCursorVisible();
	this.updateCursor();
	this.callUpdateHelp();
};

/* 不选择 */
Window_Selectable.prototype.deselect = function () {
	this.select(-1);
};

/* 重新选择 */
Window_Selectable.prototype.reselect = function () {
	this.select(this._index);
};

/* 行数 */
Window_Selectable.prototype.row = function () {
	return Math.floor(this.index() / this.maxCols());
};

/* 顶部行数 */
Window_Selectable.prototype.topRow = function () {
	return Math.floor(this._scrollY / this.itemHeight());
};

/* 最大顶部行数 */
Window_Selectable.prototype.maxTopRow = function () {
	return Math.max(0, this.maxRows() - this.maxPageRows());
};

/* 设置顶部行数 */
Window_Selectable.prototype.setTopRow = function (row) {
	var scrollY = row.clamp(0, this.maxTopRow()) * this.itemHeight();
	if (this._scrollY !== scrollY) {
		this._scrollY = scrollY;
		this.refresh();
		this.updateCursor();
	}
};

/* 重设滚动 */
Window_Selectable.prototype.resetScroll = function () {
	this.setTopRow(0);
};

/* 最大页面行数 */
Window_Selectable.prototype.maxPageRows = function () {
	var pageHeight = this.height - this.padding * 2;
	return Math.floor(pageHeight / this.itemHeight());
};

/* 最大页面项目数 */
Window_Selectable.prototype.maxPageItems = function () {
	return this.maxPageRows() * this.maxCols();
};

/* 是否横向 */
Window_Selectable.prototype.isHorizontal = function () {
	return this.maxPageRows() === 1;
};

/* 底部行数 */
Window_Selectable.prototype.bottomRow = function () {
	return Math.max(0, this.topRow() + this.maxPageRows() - 1);
};

/* 设置底部行数 */
Window_Selectable.prototype.setBottomRow = function (row) {
	this.setTopRow(row - (this.maxPageRows() - 1));
};

/* 顶部索引 */
Window_Selectable.prototype.topIndex = function () {
	return this.topRow() * this.maxCols();
};

/* 项目矩形区域 */
Window_Selectable.prototype.itemRect = function (index) {
	var rect = new Rectangle();
	var maxCols = this.maxCols();
	rect.width = this.itemWidth();
	rect.height = this.itemHeight();
	rect.x = (index % maxCols) * (rect.width + this.spacing()) - this._scrollX;
	rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
	return rect;
};

/* 关于文本的项目矩形区域 */
Window_Selectable.prototype.itemRectForText = function (index) {
	var rect = this.itemRect(index);
	rect.x += this.textPadding();
	rect.width -= this.textPadding() * 2;
	return rect;
};

/* 设置帮助窗口 */
Window_Selectable.prototype.setHelpWindow = function (helpWindow) {
	this._helpWindow = helpWindow;
	this.callUpdateHelp();
};

/* 显示帮助窗口 */
Window_Selectable.prototype.showHelpWindow = function () {
	if (this._helpWindow) {
		this._helpWindow.show();
	}
};

/* 设隐藏帮助窗口 */
Window_Selectable.prototype.hideHelpWindow = function () {
	if (this._helpWindow) {
		this._helpWindow.hide();
	}
};

/* 设置处理者 */
Window_Selectable.prototype.setHandler = function (symbol, method) {
	this._handlers[symbol] = method;
};

/* 是否有处理者 */
Window_Selectable.prototype.isHandled = function (symbol) {
	return !!this._handlers[symbol];
};

/* 呼叫处理者 */
Window_Selectable.prototype.callHandler = function (symbol) {
	if (this.isHandled(symbol)) {
		this._handlers[symbol]();
	}
};

/* 是否打开并且活动 */
Window_Selectable.prototype.isOpenAndActive = function () {
	return this.isOpen() && this.active;
};

/* 是否光标可移动 */
Window_Selectable.prototype.isCursorMovable = function () {
	return this.isOpenAndActive() && !this._cursorFixed && !this._cursorAll && this.maxItems() > 0;
};

/* 光标向下 */
Window_Selectable.prototype.cursorDown = function (wrap) {
	var index = this.index();
	var maxItems = this.maxItems();
	var maxCols = this.maxCols();
	if (index < maxItems - maxCols || (wrap && maxCols === 1)) {
		this.select((index + maxCols) % maxItems);
	}
};

/* 光标向上 */
Window_Selectable.prototype.cursorUp = function (wrap) {
	var index = this.index();
	var maxItems = this.maxItems();
	var maxCols = this.maxCols();
	if (index >= maxCols || (wrap && maxCols === 1)) {
		this.select((index - maxCols + maxItems) % maxItems);
	}
};

/* 光标向右 */
Window_Selectable.prototype.cursorRight = function (wrap) {
	var index = this.index();
	var maxItems = this.maxItems();
	var maxCols = this.maxCols();
	if (maxCols >= 2 && (index < maxItems - 1 || (wrap && this.isHorizontal()))) {
		this.select((index + 1) % maxItems);
	}
};

/* 光标向左 */
Window_Selectable.prototype.cursorLeft = function (wrap) {
	var index = this.index();
	var maxItems = this.maxItems();
	var maxCols = this.maxCols();
	if (maxCols >= 2 && (index > 0 || (wrap && this.isHorizontal()))) {
		this.select((index - 1 + maxItems) % maxItems);
	}
};

/* 光标下翻页 */
Window_Selectable.prototype.cursorPagedown = function () {
	var index = this.index();
	var maxItems = this.maxItems();
	if (this.topRow() + this.maxPageRows() < this.maxRows()) {
		this.setTopRow(this.topRow() + this.maxPageRows());
		this.select(Math.min(index + this.maxPageItems(), maxItems - 1));
	}
};

/* 光标上翻页 */
Window_Selectable.prototype.cursorPageup = function () {
	var index = this.index();
	if (this.topRow() > 0) {
		this.setTopRow(this.topRow() - this.maxPageRows());
		this.select(Math.max(index - this.maxPageItems(), 0));
	}
};

/* 滚动向下 */
Window_Selectable.prototype.scrollDown = function () {
	if (this.topRow() + 1 < this.maxRows()) {
		this.setTopRow(this.topRow() + 1);
	}
};

/* 滚动向上 */
Window_Selectable.prototype.scrollUp = function () {
	if (this.topRow() > 0) {
		this.setTopRow(this.topRow() - 1);
	}
};

/* 更新 */
Window_Selectable.prototype.update = function () {
	Window_Base.prototype.update.call(this);
	this.updateArrows();
	this.processCursorMove();
	this.processHandling();
	this.processWheel();
	this.processTouch();
	this._stayCount++;
};

/* 更新箭头 */
Window_Selectable.prototype.updateArrows = function () {
	var topRow = this.topRow();
	var maxTopRow = this.maxTopRow();
	this.downArrowVisible = maxTopRow > 0 && topRow < maxTopRow;
	this.upArrowVisible = topRow > 0;
};

/* 处理光标移动 */
Window_Selectable.prototype.processCursorMove = function () {
	if (this.isCursorMovable()) {
		var lastIndex = this.index();
		if (Input.isRepeated("down")) {
			this.cursorDown(Input.isTriggered("down"));
		}
		if (Input.isRepeated("up")) {
			this.cursorUp(Input.isTriggered("up"));
		}
		if (Input.isRepeated("right")) {
			this.cursorRight(Input.isTriggered("right"));
		}
		if (Input.isRepeated("left")) {
			this.cursorLeft(Input.isTriggered("left"));
		}
		if (!this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
			this.cursorPagedown();
		}
		if (!this.isHandled("pageup") && Input.isTriggered("pageup")) {
			this.cursorPageup();
		}
		if (this.index() !== lastIndex) {
			SoundManager.playCursor();
		}
	}
};

/* 处理处理 */
Window_Selectable.prototype.processHandling = function () {
	if (this.isOpenAndActive()) {
		if (this.isOkEnabled() && this.isOkTriggered()) {
			this.processOk();
		} else if (this.isCancelEnabled() && this.isCancelTriggered()) {
			this.processCancel();
		} else if (this.isHandled("pagedown") && Input.isTriggered("pagedown")) {
			this.processPagedown();
		} else if (this.isHandled("pageup") && Input.isTriggered("pageup")) {
			this.processPageup();
		}
	}
};

/* 处理鼠标滚轮 */
Window_Selectable.prototype.processWheel = function () {
	if (this.isOpenAndActive()) {
		var threshold = 20;
		if (TouchInput.wheelY >= threshold) {
			this.scrollDown();
		}
		if (TouchInput.wheelY <= -threshold) {
			this.scrollUp();
		}
	}
};

/* 处理触摸 */
Window_Selectable.prototype.processTouch = function () {
	if (this.isOpenAndActive()) {
		if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
			this._touching = true;
			this.onTouch(true);
		} else if (TouchInput.isCancelled()) {
			if (this.isCancelEnabled()) {
				this.processCancel();
			}
		}
		if (this._touching) {
			if (TouchInput.isPressed()) {
				this.onTouch(false);
			} else {
				this._touching = false;
			}
		}
	} else {
		this._touching = false;
	}
};

/* 是否触摸在内部框 */
Window_Selectable.prototype.isTouchedInsideFrame = function () {
	var x = this.canvasToLocalX(TouchInput.x);
	var y = this.canvasToLocalY(TouchInput.y);
	return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

/* 当触摸 */
Window_Selectable.prototype.onTouch = function (triggered) {
	var lastIndex = this.index();
	var x = this.canvasToLocalX(TouchInput.x);
	var y = this.canvasToLocalY(TouchInput.y);
	var hitIndex = this.hitTest(x, y);
	if (hitIndex >= 0) {
		if (hitIndex === this.index()) {
			if (triggered && this.isTouchOkEnabled()) {
				this.processOk();
			}
		} else if (this.isCursorMovable()) {
			this.select(hitIndex);
		}
	} else if (this._stayCount >= 10) {
		if (y < this.padding) {
			this.cursorUp();
		} else if (y >= this.height - this.padding) {
			this.cursorDown();
		}
	}
	if (this.index() !== lastIndex) {
		SoundManager.playCursor();
	}
};

/* 命中测试
 * 判断点是在哪个项目的矩形区域内，返回该项目索引。
 */
Window_Selectable.prototype.hitTest = function (x, y) {
	if (this.isContentsArea(x, y)) {
		var cx = x - this.padding;
		var cy = y - this.padding;
		var topIndex = this.topIndex();
		for (var i = 0; i < this.maxPageItems(); i++) {
			var index = topIndex + i;
			if (index < this.maxItems()) {
				var rect = this.itemRect(index);
				var right = rect.x + rect.width;
				var bottom = rect.y + rect.height;
				if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
					return index;
				}
			}
		}
	}
	return -1;
};

/* 是否内容区域 */
Window_Selectable.prototype.isContentsArea = function (x, y) {
	var left = this.padding;
	var top = this.padding;
	var right = this.width - this.padding;
	var bottom = this.height - this.padding;
	return x >= left && y >= top && x < right && y < bottom;
};

/* 是否触摸确定启用 */
Window_Selectable.prototype.isTouchOkEnabled = function () {
	return this.isOkEnabled();
};

/* 是否确定启用 */
Window_Selectable.prototype.isOkEnabled = function () {
	return this.isHandled("ok");
};

/* 是否取消启用 */
Window_Selectable.prototype.isCancelEnabled = function () {
	return this.isHandled("cancel");
};

/* 是否确定触发 */
Window_Selectable.prototype.isOkTriggered = function () {
	return Input.isRepeated("ok");
};

/* 是否取消触发 */
Window_Selectable.prototype.isCancelTriggered = function () {
	return Input.isRepeated("cancel");
};

/* 处理确定 */
Window_Selectable.prototype.processOk = function () {
	if (this.isCurrentItemEnabled()) {
		this.playOkSound();
		this.updateInputData();
		this.deactivate();
		this.callOkHandler();
	} else {
		this.playBuzzerSound();
	}
};

/* 播放确定声音 */
Window_Selectable.prototype.playOkSound = function () {
	SoundManager.playOk();
};

/* 播放蜂鸣器声音 */
Window_Selectable.prototype.playBuzzerSound = function () {
	SoundManager.playBuzzer();
};

/* 呼叫确定处理者 */
Window_Selectable.prototype.callOkHandler = function () {
	this.callHandler("ok");
};

/* 处理取消 */
Window_Selectable.prototype.processCancel = function () {
	SoundManager.playCancel();
	this.updateInputData();
	this.deactivate();
	this.callCancelHandler();
};

/* 呼叫取消处理者 */
Window_Selectable.prototype.callCancelHandler = function () {
	this.callHandler("cancel");
};

/* 处理上翻页 */
Window_Selectable.prototype.processPageup = function () {
	SoundManager.playCursor();
	this.updateInputData();
	this.deactivate();
	this.callHandler("pageup");
};

/* 处理下翻页 */
Window_Selectable.prototype.processPagedown = function () {
	SoundManager.playCursor();
	this.updateInputData();
	this.deactivate();
	this.callHandler("pagedown");
};

/* 更新输入数据 */
Window_Selectable.prototype.updateInputData = function () {
	Input.update();
	TouchInput.update();
};

/* 更新光标 */
Window_Selectable.prototype.updateCursor = function () {
	if (this._cursorAll) {
		var allRowsHeight = this.maxRows() * this.itemHeight();
		this.setCursorRect(0, 0, this.contents.width, allRowsHeight);
		this.setTopRow(0);
	} else if (this.isCursorVisible()) {
		var rect = this.itemRect(this.index());
		this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
	} else {
		this.setCursorRect(0, 0, 0, 0);
	}
};

/* 是否光标可见的 */
Window_Selectable.prototype.isCursorVisible = function () {
	var row = this.row();
	return row >= this.topRow() && row <= this.bottomRow();
};

/* 保证光标可见的 */
Window_Selectable.prototype.ensureCursorVisible = function () {
	var row = this.row();
	if (row < this.topRow()) {
		this.setTopRow(row);
	} else if (row > this.bottomRow()) {
		this.setBottomRow(row);
	}
};

/* 呼叫更新帮助 */
Window_Selectable.prototype.callUpdateHelp = function () {
	if (this.active && this._helpWindow) {
		this.updateHelp();
	}
};

/* 更新帮助 */
Window_Selectable.prototype.updateHelp = function () {
	this._helpWindow.clear();
};

/* 设置帮助窗口项目 */
Window_Selectable.prototype.setHelpWindowItem = function (item) {
	if (this._helpWindow) {
		this._helpWindow.setItem(item);
	}
};

/* 是否当前项目启用 */
Window_Selectable.prototype.isCurrentItemEnabled = function () {
	return true;
};

/* 绘制所有项目 */
Window_Selectable.prototype.drawAllItems = function () {
	var topIndex = this.topIndex();
	for (var i = 0; i < this.maxPageItems(); i++) {
		var index = topIndex + i;
		if (index < this.maxItems()) {
			this.drawItem(index);
		}
	}
};

/* 绘制项目 */
Window_Selectable.prototype.drawItem = function (index) {};

/* 清除项目 */
Window_Selectable.prototype.clearItem = function (index) {
	var rect = this.itemRect(index);
	this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
};

/* 重绘项目 */
Window_Selectable.prototype.redrawItem = function (index) {
	if (index >= 0) {
		this.clearItem(index);
		this.drawItem(index);
	}
};

/* 重绘当前项目 */
Window_Selectable.prototype.redrawCurrentItem = function () {
	this.redrawItem(this.index());
};

/* 刷新 */
Window_Selectable.prototype.refresh = function () {
	if (this.contents) {
		this.contents.clear();
		this.drawAllItems();
	}
};
