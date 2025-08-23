//=============================================================================
// Game_Actors.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * Game_Actors
 * 角色管理器类
 *
 * The wrapper class for an actor array.
 * 角色数组的包装类。
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Actors
 * @description 角色管理器类，管理所有角色的实例
 * The wrapper class for an actor array, manages all actor instances
 */
function Game_Actors() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化角色管理器
 * Initialize the actor manager
 */
Game_Actors.prototype.initialize = function () {
	this._data = [];
};

/**
 * 获取指定ID的角色
 * Get the actor by ID
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
