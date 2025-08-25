//=============================================================================
// 场景_姓名
// Scene_Name
//
// 姓名输入画面的场景类。
// The scene class of the name input screen.

function Scene_Name() {
	this.initialize.apply(this, arguments);
}

Scene_Name.prototype = Object.create(Scene_MenuBase.prototype);
Scene_Name.prototype.constructor = Scene_Name;

/* 初始化 */
Scene_Name.prototype.initialize = function () {
	Scene_MenuBase.prototype.initialize.call(this);
};

/* 准备 */
Scene_Name.prototype.prepare = function (actorId, maxLength) {
	this._actorId = actorId;
	this._maxLength = maxLength;
};

/* 创建 */
Scene_Name.prototype.create = function () {
	Scene_MenuBase.prototype.create.call(this);
	this._actor = $gameActors.actor(this._actorId);
	this.createEditWindow();
	this.createInputWindow();
};

/* 开始 */
Scene_Name.prototype.start = function () {
	Scene_MenuBase.prototype.start.call(this);
	this._editWindow.refresh();
};

/* 创建编辑窗口 */
Scene_Name.prototype.createEditWindow = function () {
	this._editWindow = new Window_NameEdit(this._actor, this._maxLength);
	this.addWindow(this._editWindow);
};

/* 创建输入窗口 */
Scene_Name.prototype.createInputWindow = function () {
	this._inputWindow = new Window_NameInput(this._editWindow);
	this._inputWindow.setHandler("ok", this.onInputOk.bind(this));
	this.addWindow(this._inputWindow);
};

/* 当输入确定 */
Scene_Name.prototype.onInputOk = function () {
	this._actor.setName(this._editWindow.name());
	this.popScene();
};

//-----------------------------------------------------------------------------
// 场景_调试
