//=============================================================================
// Window_MenuStatus.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_菜单状态
// Window_MenuStatus
//
// 在菜单画面上显示的队伍状态的窗口。
// The window for displaying party member status on the menu screen.

function Window_MenuStatus() {
	this.initialize.apply(this, arguments);
}

Window_MenuStatus.prototype = Object.create(Window_Selectable.prototype);
Window_MenuStatus.prototype.constructor = Window_MenuStatus;

/* 初始化 */
Window_MenuStatus.prototype.initialize = function (x, y) {
	var width = this.windowWidth();
	var height = this.windowHeight();
	Window_Selectable.prototype.initialize.call(this, x, y, width, height);
	this._formationMode = false;
	this._pendingIndex = -1;
	this.refresh();
};

/* 窗口宽度 */
Window_MenuStatus.prototype.windowWidth = function () {
	return Graphics.boxWidth - 240;
};

/* 窗口高度 */
Window_MenuStatus.prototype.windowHeight = function () {
	return Graphics.boxHeight;
};

/* 最大项目数 */
Window_MenuStatus.prototype.maxItems = function () {
	return $gameParty.size();
};

/* 项目高度 */
Window_MenuStatus.prototype.itemHeight = function () {
	var clientHeight = this.height - this.padding * 2;
	return Math.floor(clientHeight / this.numVisibleRows());
};

/* 可见的行数 */
Window_MenuStatus.prototype.numVisibleRows = function () {
	return 4;
};

/* 加载图像 */
Window_MenuStatus.prototype.loadImages = function () {
	$gameParty.members().forEach(function (actor) {
		ImageManager.reserveFace(actor.faceName());
	}, this);
};

/* 绘制项目 */
Window_MenuStatus.prototype.drawItem = function (index) {
	this.drawItemBackground(index);
	this.drawItemImage(index);
	this.drawItemStatus(index);
};

/* 绘制项目背景 */
Window_MenuStatus.prototype.drawItemBackground = function (index) {
	if (index === this._pendingIndex) {
		var rect = this.itemRect(index);
		var color = this.pendingColor();
		this.changePaintOpacity(false);
		this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
		this.changePaintOpacity(true);
	}
};

/* 绘制项目图像 */
Window_MenuStatus.prototype.drawItemImage = function (index) {
	var actor = $gameParty.members()[index];
	var rect = this.itemRect(index);
	this.changePaintOpacity(actor.isBattleMember());
	this.drawActorFace(actor, rect.x + 1, rect.y + 1, Window_Base._faceWidth, Window_Base._faceHeight);
	this.changePaintOpacity(true);
};

/* 绘制项目状态 */
Window_MenuStatus.prototype.drawItemStatus = function (index) {
	var actor = $gameParty.members()[index];
	var rect = this.itemRect(index);
	var x = rect.x + 162;
	var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
	var width = rect.width - x - this.textPadding();
	this.drawActorSimpleStatus(actor, x, y, width);
};

/* 处理确定 */
Window_MenuStatus.prototype.processOk = function () {
	Window_Selectable.prototype.processOk.call(this);
	$gameParty.setMenuActor($gameParty.members()[this.index()]);
};

/* 是否当前项目启用 */
Window_MenuStatus.prototype.isCurrentItemEnabled = function () {
	if (this._formationMode) {
		var actor = $gameParty.members()[this.index()];
		return actor && actor.isFormationChangeOk();
	} else {
		return true;
	}
};

/* 选择上一个 */
Window_MenuStatus.prototype.selectLast = function () {
	this.select($gameParty.menuActor().index() || 0);
};

/* 整队模式 */
Window_MenuStatus.prototype.formationMode = function () {
	return this._formationMode;
};

/* 设置整队模式 */
Window_MenuStatus.prototype.setFormationMode = function (formationMode) {
	this._formationMode = formationMode;
};

/* 待定索引
 * pending 指那个背景光标闪烁的选项。
 */
Window_MenuStatus.prototype.pendingIndex = function () {
	return this._pendingIndex;
};

/* 设置待定索引 */
Window_MenuStatus.prototype.setPendingIndex = function (index) {
	var lastPendingIndex = this._pendingIndex;
	this._pendingIndex = index;
	this.redrawItem(this._pendingIndex);
	this.redrawItem(lastPendingIndex);
};
