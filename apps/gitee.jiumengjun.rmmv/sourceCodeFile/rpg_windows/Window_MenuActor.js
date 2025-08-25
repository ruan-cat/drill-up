//=============================================================================
// Window_MenuActor.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_菜单角色
// Window_MenuActor
//
// 在物品和技能画面上的选择目标角色的窗口。
// The window for selecting a target actor on the item and skill screens.

function Window_MenuActor() {
	this.initialize.apply(this, arguments);
}

Window_MenuActor.prototype = Object.create(Window_MenuStatus.prototype);
Window_MenuActor.prototype.constructor = Window_MenuActor;

/* 初始化 */
Window_MenuActor.prototype.initialize = function () {
	Window_MenuStatus.prototype.initialize.call(this, 0, 0);
	this.hide();
};

/* 处理确定 */
Window_MenuActor.prototype.processOk = function () {
	if (!this.cursorAll()) {
		$gameParty.setTargetActor($gameParty.members()[this.index()]);
	}
	this.callOkHandler();
};

/* 选择上一个 */
Window_MenuActor.prototype.selectLast = function () {
	this.select($gameParty.targetActor().index() || 0);
};

/* 选择该项目 */
Window_MenuActor.prototype.selectForItem = function (item) {
	var actor = $gameParty.menuActor();
	var action = new Game_Action(actor);
	action.setItemObject(item);
	this.setCursorFixed(false);
	this.setCursorAll(false);
	if (action.isForUser()) {
		if (DataManager.isSkill(item)) {
			this.setCursorFixed(true);
			this.select(actor.index());
		} else {
			this.selectLast();
		}
	} else if (action.isForAll()) {
		this.setCursorAll(true);
		this.select(0);
	} else {
		this.selectLast();
	}
};
