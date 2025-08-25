//=============================================================================
// 场景_菜单基础
// Scene_MenuBase
//
// 所有菜单类型场景的父类。
// The superclass of all the menu-type scenes.

function Scene_MenuBase() {
	this.initialize.apply(this, arguments);
}

Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
Scene_MenuBase.prototype.constructor = Scene_MenuBase;

/* 初始化 */
Scene_MenuBase.prototype.initialize = function () {
	Scene_Base.prototype.initialize.call(this);
};

/* 创建 */
Scene_MenuBase.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
	this.updateActor();
	this.createWindowLayer();
};

/* 角色 */
Scene_MenuBase.prototype.actor = function () {
	return this._actor;
};

/* 更新角色 */
Scene_MenuBase.prototype.updateActor = function () {
	this._actor = $gameParty.menuActor();
};

/* 创建背景 */
Scene_MenuBase.prototype.createBackground = function () {
	this._backgroundSprite = new Sprite();
	this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
	this.addChild(this._backgroundSprite);
};

/* 设置背景不透明度 */
Scene_MenuBase.prototype.setBackgroundOpacity = function (opacity) {
	this._backgroundSprite.opacity = opacity;
};

/* 创建帮助窗口 */
Scene_MenuBase.prototype.createHelpWindow = function () {
	this._helpWindow = new Window_Help();
	this.addWindow(this._helpWindow);
};

/* 下一个角色 */
Scene_MenuBase.prototype.nextActor = function () {
	$gameParty.makeMenuActorNext();
	this.updateActor();
	this.onActorChange();
};

/* 上一个角色 */
Scene_MenuBase.prototype.previousActor = function () {
	$gameParty.makeMenuActorPrevious();
	this.updateActor();
	this.onActorChange();
};

/* 当角色改变 */
Scene_MenuBase.prototype.onActorChange = function () {};
