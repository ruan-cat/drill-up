//=============================================================================
// Game_Followers.js
//=============================================================================

//-----------------------------------------------------------------------------
// 游戏_跟随者们
// Game_Followers
//
// 跟随者数组的封装类。
// The wrapper class for a follower array.

function Game_Followers() {
	this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Followers.prototype.initialize = function () {
	this._visible = $dataSystem.optFollowers;
	this._gathering = false;
	this._data = [];
	for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
		this._data.push(new Game_Follower(i));
	}
};

/* 是否可见的 */
Game_Followers.prototype.isVisible = function () {
	return this._visible;
};

/* 显示 */
Game_Followers.prototype.show = function () {
	this._visible = true;
};

/* 隐藏 */
Game_Followers.prototype.hide = function () {
	this._visible = false;
};

/* 跟随者 */
Game_Followers.prototype.follower = function (index) {
	return this._data[index];
};

/* 遍历每个 */
Game_Followers.prototype.forEach = function (callback, thisObject) {
	this._data.forEach(callback, thisObject);
};

/* 翻转每个 */
Game_Followers.prototype.reverseEach = function (callback, thisObject) {
	this._data.reverse();
	this._data.forEach(callback, thisObject);
	this._data.reverse();
};

/* 刷新 */
Game_Followers.prototype.refresh = function () {
	this.forEach(function (follower) {
		return follower.refresh();
	}, this);
};

/* 更新 */
Game_Followers.prototype.update = function () {
	if (this.areGathering()) {
		if (!this.areMoving()) {
			this.updateMove();
		}
		if (this.areGathered()) {
			this._gathering = false;
		}
	}
	this.forEach(function (follower) {
		follower.update();
	}, this);
};

/* 更新移动 */
Game_Followers.prototype.updateMove = function () {
	for (var i = this._data.length - 1; i >= 0; i--) {
		var precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
		this._data[i].chaseCharacter(precedingCharacter);
	}
};

/* 所有跳跃 */
Game_Followers.prototype.jumpAll = function () {
	if ($gamePlayer.isJumping()) {
		for (var i = 0; i < this._data.length; i++) {
			var follower = this._data[i];
			var sx = $gamePlayer.deltaXFrom(follower.x);
			var sy = $gamePlayer.deltaYFrom(follower.y);
			follower.jump(sx, sy);
		}
	}
};

/* 同步 */
Game_Followers.prototype.synchronize = function (x, y, d) {
	this.forEach(function (follower) {
		follower.locate(x, y);
		follower.setDirection(d);
	}, this);
};

/* 集合 */
Game_Followers.prototype.gather = function () {
	this._gathering = true;
};

/* 是否集合中 */
Game_Followers.prototype.areGathering = function () {
	return this._gathering;
};

/* 可见的跟随者 */
Game_Followers.prototype.visibleFollowers = function () {
	return this._data.filter(function (follower) {
		return follower.isVisible();
	}, this);
};

/* 是否移动中 */
Game_Followers.prototype.areMoving = function () {
	return this.visibleFollowers().some(function (follower) {
		return follower.isMoving();
	}, this);
};

/* 是否集合了 */
Game_Followers.prototype.areGathered = function () {
	return this.visibleFollowers().every(function (follower) {
		return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
	}, this);
};

/* 是否有人碰撞 */
Game_Followers.prototype.isSomeoneCollided = function (x, y) {
	return this.visibleFollowers().some(function (follower) {
		return follower.pos(x, y);
	}, this);
};
