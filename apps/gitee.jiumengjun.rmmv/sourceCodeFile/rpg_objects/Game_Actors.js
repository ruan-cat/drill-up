/**
 * @fileoverview Game_Actors - 游戏角色管理器类
 *
 * 角色数组的封装类。
 * The wrapper class for an actor array.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 游戏角色管理器类
 * Game actors manager class
 *
 * @class Game_Actors
 * @constructor
 * @description 游戏角色管理器类，管理所有角色实例
 * Game actors manager class that manages all actor instances
 */
function Game_Actors() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化角色管理器
 * Initialize actor manager
 *
 * @memberof Game_Actors
 * @method initialize
 */
Game_Actors.prototype.initialize = function () {
	this._data = [];
};

/**
 * 获取指定ID的角色
 * Get actor by ID
 *
 * @memberof Game_Actors
 * @method actor
 * @param {Number} actorId - 角色ID - Actor ID
 * @returns {Game_Actor|null} 角色对象或null - Actor object or null
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
