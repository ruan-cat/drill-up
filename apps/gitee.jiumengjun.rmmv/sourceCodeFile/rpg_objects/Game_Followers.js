//=============================================================================
// Game_Followers.js
//=============================================================================

/**
 * @fileoverview Game_Followers - 游戏跟随者们类
 *
 * 跟随者数组的封装类。
 * The wrapper class for a follower array.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * @class Game_Followers
 * @description 游戏跟随者们类，管理所有跟随者的集合
 * Game followers class that manages the collection of all followers
 */
function Game_Followers() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化跟随者们
 * Initialize followers
 *
 * @memberof Game_Followers
 * @method initialize
 */
Game_Followers.prototype.initialize = function () {
	this._visible = $dataSystem.optFollowers;
	this._gathering = false;
	this._data = [];
	for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
		this._data.push(new Game_Follower(i));
	}
};

/**
 * 检查是否可见
 * Check if visible
 *
 * @memberof Game_Followers
 * @method isVisible
 * @returns {boolean} 是否可见 / Whether visible
 */
Game_Followers.prototype.isVisible = function () {
	return this._visible;
};

/**
 * 显示跟随者们
 * Show followers
 *
 * @memberof Game_Followers
 * @method show
 */
Game_Followers.prototype.show = function () {
	this._visible = true;
};

/**
 * 隐藏跟随者们
 * Hide followers
 *
 * @memberof Game_Followers
 * @method hide
 */
Game_Followers.prototype.hide = function () {
	this._visible = false;
};

/**
 * 获取跟随者
 * Get follower
 *
 * @memberof Game_Followers
 * @method follower
 * @param {number} index - 索引 / Index
 * @returns {Game_Follower} 跟随者对象 / Follower object
 */
Game_Followers.prototype.follower = function (index) {
	return this._data[index];
};

/**
 * 遍历每个跟随者
 * For each follower
 *
 * @memberof Game_Followers
 * @method forEach
 * @param {Function} callback - 回调函数 / Callback function
 * @param {object} thisObject - this对象 / This object
 */
Game_Followers.prototype.forEach = function (callback, thisObject) {
	this._data.forEach(callback, thisObject);
};

/**
 * 翻转遍历每个跟随者
 * Reverse iterate each follower
 *
 * @memberof Game_Followers
 * @method reverseEach
 * @param {Function} callback - 回调函数 / Callback function
 * @param {object} thisObject - this对象 / This object
 */
Game_Followers.prototype.reverseEach = function (callback, thisObject) {
	this._data.reverse();
	this._data.forEach(callback, thisObject);
	this._data.reverse();
};

/**
 * 刷新所有跟随者
 * Refresh all followers
 *
 * @memberof Game_Followers
 * @method refresh
 */
Game_Followers.prototype.refresh = function () {
	this.forEach(function (follower) {
		return follower.refresh();
	}, this);
};

/**
 * 更新跟随者们
 * Update followers
 *
 * @memberof Game_Followers
 * @method update
 */
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

/**
 * 更新移动
 * Update move
 *
 * @memberof Game_Followers
 * @method updateMove
 */
Game_Followers.prototype.updateMove = function () {
	for (var i = this._data.length - 1; i >= 0; i--) {
		var precedingCharacter = i > 0 ? this._data[i - 1] : $gamePlayer;
		this._data[i].chaseCharacter(precedingCharacter);
	}
};

/**
 * 所有跟随者跳跃
 * All followers jump
 *
 * @memberof Game_Followers
 * @method jumpAll
 */
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

/**
 * 同步所有跟随者位置
 * Synchronize all followers position
 *
 * @memberof Game_Followers
 * @method synchronize
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @param {number} d - 方向 / Direction
 */
Game_Followers.prototype.synchronize = function (x, y, d) {
	this.forEach(function (follower) {
		follower.locate(x, y);
		follower.setDirection(d);
	}, this);
};

/**
 * 集合跟随者们
 * Gather followers
 *
 * @memberof Game_Followers
 * @method gather
 */
Game_Followers.prototype.gather = function () {
	this._gathering = true;
};

/**
 * 检查是否正在集合
 * Check if gathering
 *
 * @memberof Game_Followers
 * @method areGathering
 * @returns {boolean} 是否集合中 / Whether gathering
 */
Game_Followers.prototype.areGathering = function () {
	return this._gathering;
};

/**
 * 获取可见的跟随者
 * Get visible followers
 *
 * @memberof Game_Followers
 * @method visibleFollowers
 * @returns {Array} 可见跟随者数组 / Array of visible followers
 */
Game_Followers.prototype.visibleFollowers = function () {
	return this._data.filter(function (follower) {
		return follower.isVisible();
	}, this);
};

/**
 * 检查是否有跟随者在移动
 * Check if any followers are moving
 *
 * @memberof Game_Followers
 * @method areMoving
 * @returns {boolean} 是否移动中 / Whether moving
 */
Game_Followers.prototype.areMoving = function () {
	return this.visibleFollowers().some(function (follower) {
		return follower.isMoving();
	}, this);
};

/**
 * 检查是否已集合
 * Check if gathered
 *
 * @memberof Game_Followers
 * @method areGathered
 * @returns {boolean} 是否已集合 / Whether gathered
 */
Game_Followers.prototype.areGathered = function () {
	return this.visibleFollowers().every(function (follower) {
		return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
	}, this);
};

/**
 * 检查是否有跟随者在指定位置
 * Check if any follower is at specified position
 *
 * @memberof Game_Followers
 * @method isSomeoneCollided
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否有人在此位置 / Whether someone is at this position
 */
Game_Followers.prototype.isSomeoneCollided = function (x, y) {
	return this.visibleFollowers().some(function (follower) {
		return follower.pos(x, y);
	}, this);
};
