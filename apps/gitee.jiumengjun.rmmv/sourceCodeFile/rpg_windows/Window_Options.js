//=============================================================================
// Window_Options.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_设置
// Window_Options
//
// 设置画面上的更改各种设置的窗口。
// The window for changing various settings on the options screen.

function Window_Options() {
	this.initialize.apply(this, arguments);
}

Window_Options.prototype = Object.create(Window_Command.prototype);
Window_Options.prototype.constructor = Window_Options;

/* 初始化 */
Window_Options.prototype.initialize = function () {
	Window_Command.prototype.initialize.call(this, 0, 0);
	this.updatePlacement();
};

/* 窗口宽度 */
Window_Options.prototype.windowWidth = function () {
	return 400;
};

/* 窗口高度 */
Window_Options.prototype.windowHeight = function () {
	return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
};

/* 更新位置 */
Window_Options.prototype.updatePlacement = function () {
	this.x = (Graphics.boxWidth - this.width) / 2;
	this.y = (Graphics.boxHeight - this.height) / 2;
};

/* 制作指令列表 */
Window_Options.prototype.makeCommandList = function () {
	this.addGeneralOptions();
	this.addVolumeOptions();
};

/* 增加一般选项 */
Window_Options.prototype.addGeneralOptions = function () {
	this.addCommand(TextManager.alwaysDash, "alwaysDash");
	this.addCommand(TextManager.commandRemember, "commandRemember");
};

/* 增加音量选项 */
Window_Options.prototype.addVolumeOptions = function () {
	this.addCommand(TextManager.bgmVolume, "bgmVolume");
	this.addCommand(TextManager.bgsVolume, "bgsVolume");
	this.addCommand(TextManager.meVolume, "meVolume");
	this.addCommand(TextManager.seVolume, "seVolume");
};

/* 绘制项目 */
Window_Options.prototype.drawItem = function (index) {
	var rect = this.itemRectForText(index);
	var statusWidth = this.statusWidth();
	var titleWidth = rect.width - statusWidth;
	this.resetTextColor();
	this.changePaintOpacity(this.isCommandEnabled(index));
	this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, "left");
	this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, "right");
};

/* 状态宽度 */
Window_Options.prototype.statusWidth = function () {
	return 120;
};

/* 状态文本 */
Window_Options.prototype.statusText = function (index) {
	var symbol = this.commandSymbol(index);
	var value = this.getConfigValue(symbol);
	if (this.isVolumeSymbol(symbol)) {
		return this.volumeStatusText(value);
	} else {
		return this.booleanStatusText(value);
	}
};

/* 是否音量标识 */
Window_Options.prototype.isVolumeSymbol = function (symbol) {
	return symbol.contains("Volume");
};

/* 布尔值状态文本 */
Window_Options.prototype.booleanStatusText = function (value) {
	return value ? "ON" : "OFF";
};

/* 音量状态文本 */
Window_Options.prototype.volumeStatusText = function (value) {
	return value + "%";
};

/* 处理确定 */
Window_Options.prototype.processOk = function () {
	var index = this.index();
	var symbol = this.commandSymbol(index);
	var value = this.getConfigValue(symbol);
	if (this.isVolumeSymbol(symbol)) {
		value += this.volumeOffset();
		if (value > 100) {
			value = 0;
		}
		value = value.clamp(0, 100);
		this.changeValue(symbol, value);
	} else {
		this.changeValue(symbol, !value);
	}
};

/* 光标向右 */
Window_Options.prototype.cursorRight = function (wrap) {
	var index = this.index();
	var symbol = this.commandSymbol(index);
	var value = this.getConfigValue(symbol);
	if (this.isVolumeSymbol(symbol)) {
		value += this.volumeOffset();
		value = value.clamp(0, 100);
		this.changeValue(symbol, value);
	} else {
		this.changeValue(symbol, true);
	}
};

/* 光标向左 */
Window_Options.prototype.cursorLeft = function (wrap) {
	var index = this.index();
	var symbol = this.commandSymbol(index);
	var value = this.getConfigValue(symbol);
	if (this.isVolumeSymbol(symbol)) {
		value -= this.volumeOffset();
		value = value.clamp(0, 100);
		this.changeValue(symbol, value);
	} else {
		this.changeValue(symbol, false);
	}
};

/* 光标偏移
 * 一次增减百分几的音量。
 */
Window_Options.prototype.volumeOffset = function () {
	return 20;
};

/* 改变值 */
Window_Options.prototype.changeValue = function (symbol, value) {
	var lastValue = this.getConfigValue(symbol);
	if (lastValue !== value) {
		this.setConfigValue(symbol, value);
		this.redrawItem(this.findSymbol(symbol));
		SoundManager.playCursor();
	}
};

/* 获取配置值 */
Window_Options.prototype.getConfigValue = function (symbol) {
	return ConfigManager[symbol];
};

/* 设置配置值 */
Window_Options.prototype.setConfigValue = function (symbol, volume) {
	ConfigManager[symbol] = volume;
};
