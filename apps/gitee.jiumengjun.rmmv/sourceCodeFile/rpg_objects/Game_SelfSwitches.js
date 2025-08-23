/**
 * @fileoverview Game_SelfSwitches - 游戏独立开关对象类
 * @description 负责管理游戏中的独立开关状态
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_独立开关
 * Game_SelfSwitches
 *
 * 独立开关的游戏对象类。
 * The game object class for self switches.
 *
 * @class Game_SelfSwitches
 * @description 管理游戏中的独立开关，独立开关是与特定事件绑定的开关
 */
function Game_SelfSwitches() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_SelfSwitches object
 *
 * @memberof Game_SelfSwitches
 * @description 初始化独立开关对象并清空所有数据
 */
Game_SelfSwitches.prototype.initialize = function () {
	this.clear();
};

/**
 * 清空
 * Clear all self switches
 *
 * @memberof Game_SelfSwitches
 * @description 清空所有独立开关数据，重置为初始状态
 */
Game_SelfSwitches.prototype.clear = function () {
	this._data = {}; // 独立开关数据对象 - Self switch data object
};

/**
 * 值
 * Get self switch value
 *
 * @memberof Game_SelfSwitches
 * @param {Array} key - 独立开关的键值 [mapId, eventId, switchName]
 * @returns {boolean} 独立开关的状态值
 * @description 获取指定独立开关的状态值
 */
Game_SelfSwitches.prototype.value = function (key) {
	return !!this._data[key];
};

/**
 * 设置值
 * Set self switch value
 *
 * @memberof Game_SelfSwitches
 * @param {Array} key - 独立开关的键值 [mapId, eventId, switchName]
 * @param {boolean} value - 要设置的值
 * @description 设置指定独立开关的状态值，并触发变化事件
 */
Game_SelfSwitches.prototype.setValue = function (key, value) {
	if (value) {
		this._data[key] = true;
	} else {
		delete this._data[key];
	}
	this.onChange();
};

/**
 * 当改变
 * Called when self switch changes
 *
 * @memberof Game_SelfSwitches
 * @description 当独立开关状态发生变化时调用，请求地图刷新以更新相关事件
 */
Game_SelfSwitches.prototype.onChange = function () {
	$gameMap.requestRefresh();
};
