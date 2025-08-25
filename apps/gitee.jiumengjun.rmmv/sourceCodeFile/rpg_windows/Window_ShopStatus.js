//=============================================================================
// Window_ShopStatus.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_商店状态
// Window_ShopStatus
//
// 在商店画面上的显示物品持有数和角色装备的窗口。
// The window for displaying number of items in possession and the actor's
// equipment on the shop screen.

function Window_ShopStatus() {
	this.initialize.apply(this, arguments);
}

Window_ShopStatus.prototype = Object.create(Window_Base.prototype);
Window_ShopStatus.prototype.constructor = Window_ShopStatus;

/* 初始化 */
Window_ShopStatus.prototype.initialize = function (x, y, width, height) {
	Window_Base.prototype.initialize.call(this, x, y, width, height);
	this._item = null;
	this._pageIndex = 0;
	this.refresh();
};

/* 刷新 */
Window_ShopStatus.prototype.refresh = function () {
	this.contents.clear();
	if (this._item) {
		var x = this.textPadding();
		this.drawPossession(x, 0);
		if (this.isEquipItem()) {
			this.drawEquipInfo(x, this.lineHeight() * 2);
		}
	}
};

/* 设置项目 */
Window_ShopStatus.prototype.setItem = function (item) {
	this._item = item;
	this.refresh();
};

/* 是否装备物品 */
Window_ShopStatus.prototype.isEquipItem = function () {
	return DataManager.isWeapon(this._item) || DataManager.isArmor(this._item);
};

/* 绘制持有数 */
Window_ShopStatus.prototype.drawPossession = function (x, y) {
	var width = this.contents.width - this.textPadding() - x;
	var possessionWidth = this.textWidth("0000");
	this.changeTextColor(this.systemColor());
	this.drawText(TextManager.possession, x, y, width - possessionWidth);
	this.resetTextColor();
	this.drawText($gameParty.numItems(this._item), x, y, width, "right");
};

/* 绘制装备信息 */
Window_ShopStatus.prototype.drawEquipInfo = function (x, y) {
	var members = this.statusMembers();
	for (var i = 0; i < members.length; i++) {
		this.drawActorEquipInfo(x, y + this.lineHeight() * (i * 2.4), members[i]);
	}
};

/* 状态成员 */
Window_ShopStatus.prototype.statusMembers = function () {
	var start = this._pageIndex * this.pageSize();
	var end = start + this.pageSize();
	return $gameParty.members().slice(start, end);
};

/* 页面大小
 * 指一页显示几个成员的装备信息。
 */
Window_ShopStatus.prototype.pageSize = function () {
	return 4;
};

/* 最大页数 */
Window_ShopStatus.prototype.maxPages = function () {
	return Math.floor(($gameParty.size() + this.pageSize() - 1) / this.pageSize());
};

/* 绘制角色装备信息 */
Window_ShopStatus.prototype.drawActorEquipInfo = function (x, y, actor) {
	var enabled = actor.canEquip(this._item);
	this.changePaintOpacity(enabled);
	this.resetTextColor();
	this.drawText(actor.name(), x, y, 168);
	var item1 = this.currentEquippedItem(actor, this._item.etypeId);
	if (enabled) {
		this.drawActorParamChange(x, y, actor, item1);
	}
	this.drawItemName(item1, x, y + this.lineHeight());
	this.changePaintOpacity(true);
};

/* 绘制角色能力值变化 */
Window_ShopStatus.prototype.drawActorParamChange = function (x, y, actor, item1) {
	var width = this.contents.width - this.textPadding() - x;
	var paramId = this.paramId();
	var change = this._item.params[paramId] - (item1 ? item1.params[paramId] : 0);
	this.changeTextColor(this.paramchangeTextColor(change));
	this.drawText((change > 0 ? "+" : "") + change, x, y, width, "right");
};

/* 能力值 ID */
Window_ShopStatus.prototype.paramId = function () {
	return DataManager.isWeapon(this._item) ? 2 : 3;
};

/* 当前装备的物品 */
Window_ShopStatus.prototype.currentEquippedItem = function (actor, etypeId) {
	var list = [];
	var equips = actor.equips();
	var slots = actor.equipSlots();
	for (var i = 0; i < slots.length; i++) {
		if (slots[i] === etypeId) {
			list.push(equips[i]);
		}
	}
	var paramId = this.paramId();
	var worstParam = Number.MAX_VALUE;
	var worstItem = null;
	for (var j = 0; j < list.length; j++) {
		if (list[j] && list[j].params[paramId] < worstParam) {
			worstParam = list[j].params[paramId];
			worstItem = list[j];
		}
	}
	return worstItem;
};

/* 更新 */
Window_ShopStatus.prototype.update = function () {
	Window_Base.prototype.update.call(this);
	this.updatePage();
};

/* 更新页面 */
Window_ShopStatus.prototype.updatePage = function () {
	if (this.isPageChangeEnabled() && this.isPageChangeRequested()) {
		this.changePage();
	}
};

/* 是否页面更改启用 */
Window_ShopStatus.prototype.isPageChangeEnabled = function () {
	return this.visible && this.maxPages() >= 2;
};

/* 是否页面更改请求 */
Window_ShopStatus.prototype.isPageChangeRequested = function () {
	if (Input.isTriggered("shift")) {
		return true;
	}
	if (TouchInput.isTriggered() && this.isTouchedInsideFrame()) {
		return true;
	}
	return false;
};

/* 是否触摸在内部框 */
Window_ShopStatus.prototype.isTouchedInsideFrame = function () {
	var x = this.canvasToLocalX(TouchInput.x);
	var y = this.canvasToLocalY(TouchInput.y);
	return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

/* 更改页面 */
Window_ShopStatus.prototype.changePage = function () {
	this._pageIndex = (this._pageIndex + 1) % this.maxPages();
	this.refresh();
	SoundManager.playCursor();
};
