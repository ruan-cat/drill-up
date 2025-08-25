//=============================================================================
// Window_GameEnd.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_游戏结束
// Window_GameEnd
//
// 在游戏结束画面上的选择“回到标题”的窗口。
// The window for selecting "Go to Title" on the game end screen.

function Window_GameEnd() {
	this.initialize.apply(this, arguments);
}

Window_GameEnd.prototype = Object.create(Window_Command.prototype);
Window_GameEnd.prototype.constructor = Window_GameEnd;

/* 初始化 */
Window_GameEnd.prototype.initialize = function () {
	Window_Command.prototype.initialize.call(this, 0, 0);
	this.updatePlacement();
	this.openness = 0;
	this.open();
};

/* 窗口宽 */
Window_GameEnd.prototype.windowWidth = function () {
	return 240;
};

/* 更新位置 */
Window_GameEnd.prototype.updatePlacement = function () {
	this.x = (Graphics.boxWidth - this.width) / 2;
	this.y = (Graphics.boxHeight - this.height) / 2;
};

/* 制作指令列表 */
Window_GameEnd.prototype.makeCommandList = function () {
	this.addCommand(TextManager.toTitle, "toTitle");
	this.addCommand(TextManager.cancel, "cancel");
};
