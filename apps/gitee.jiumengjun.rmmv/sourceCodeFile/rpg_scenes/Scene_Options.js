//=============================================================================
// 场景_选项
// Scene_Options
//
// 选项画面的场景类。
// The scene class of the options screen.

function Scene_Options() {
	this.initialize.apply(this, arguments);
}

Scene_Options.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Options.prototype.constructor = Scene_Options;

/* 初始化 */
Scene_Options.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
};

/* 创建 */
Scene_Options.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	this.createOptionsWindow();
};

/* 结束 */
Scene_Options.prototype.terminate = function () {
	Scene_MenuBase.prototype.terminate.call(this);
	ConfigManager.save();
};

/* 创建设置窗口 */
Scene_Options.prototype.createOptionsWindow = function () {
	this._optionsWindow = new Window_Options();
	this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
	this.addWindow(this._optionsWindow);
};

//-----------------------------------------------------------------------------
// 场景_文件
