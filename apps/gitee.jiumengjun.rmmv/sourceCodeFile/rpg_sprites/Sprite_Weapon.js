//=============================================================================
// Sprite_Weapon.js
//=============================================================================

//-----------------------------------------------------------------------------
// 精灵_武器
// Sprite_Weapon
//
// 显示攻击的武器图像的精灵。
// The sprite for displaying a weapon image for attacking.
function Sprite_Weapon() {
	this.initialize.apply(this, arguments);
}
Sprite_Weapon.prototype = Object.create(Sprite_Base.prototype);
Sprite_Weapon.prototype.constructor = Sprite_Weapon;
/* 初始化 */
Sprite_Weapon.prototype.initialize = function () {
	Sprite_Base.prototype.initialize.call(this);
	this.initMembers();
};
/* 初始化成员 */
Sprite_Weapon.prototype.initMembers = function () {
	this._weaponImageId = 0;
	this._animationCount = 0;
	this._pattern = 0;
	this.anchor.x = 0.5;
	this.anchor.y = 1;
	this.x = -16;
};
/* 设置 */
Sprite_Weapon.prototype.setup = function (weaponImageId) {
	this._weaponImageId = weaponImageId;
	this._animationCount = 0;
	this._pattern = 0;
	this.loadBitmap();
	this.updateFrame();
};
/* 更新 */
Sprite_Weapon.prototype.update = function () {
	Sprite_Base.prototype.update.call(this);
	this._animationCount++;
	if (this._animationCount >= this.animationWait()) {
		this.updatePattern();
		this.updateFrame();
		this._animationCount = 0;
	}
};
/* 动画等待帧数 */
Sprite_Weapon.prototype.animationWait = function () {
	return 12;
};
/* 更新图案 */
Sprite_Weapon.prototype.updatePattern = function () {
	this._pattern++;
	if (this._pattern >= 3) {
		this._weaponImageId = 0;
	}
};
/* 加载位图 */
Sprite_Weapon.prototype.loadBitmap = function () {
	var pageId = Math.floor((this._weaponImageId - 1) / 12) + 1;
	if (pageId >= 1) {
		this.bitmap = ImageManager.loadSystem("Weapons" + pageId);
	} else {
		this.bitmap = ImageManager.loadSystem("");
	}
};
/* 更新帧 */
Sprite_Weapon.prototype.updateFrame = function () {
	if (this._weaponImageId > 0) {
		var index = (this._weaponImageId - 1) % 12;
		var w = 96;
		var h = 64;
		var sx = (Math.floor(index / 6) * 3 + this._pattern) * w;
		var sy = Math.floor(index % 6) * h;
		this.setFrame(sx, sy, w, h);
	} else {
		this.setFrame(0, 0, 0, 0);
	}
};
/* 是否播放中 */
Sprite_Weapon.prototype.isPlaying = function () {
	return this._weaponImageId > 0;
};
