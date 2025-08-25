//=============================================================================
// Game_Actors.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏角色们类
 * Game_Actors
 *
 * 角色数组的封装类。
 * The wrapper class for an actor array.
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Actors
 * @description 游戏角色管理器类，管理所有角色实例
 * Game actors manager class that manages all actor instances
 */
function Game_Actors() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化角色管理器
 * Initialize actor manager
 */
Game_Actors.prototype.initialize = function () {
	this._data = [];
};

/**
 * 获取指定ID的角色
 * Get actor by ID
 *
 * @param {number} actorId - 角色ID / Actor ID
 * @returns {Game_Actor|null} 角色对象或null / Actor object or null
 */
Game_Actors.prototype.actor = function (actorId) {
	if ($dataActors[actorId]) {
		if (!this._data[actorId]) {
			this._data[actorId] = new Game_Actor(actorId);
		}
		return this._data[actorId];
	}
	return null;
};
