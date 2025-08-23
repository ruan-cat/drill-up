/**
 * @fileoverview Game_Switches - 游戏开关对象类
 * @description 负责管理游戏中的开关状态
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_开关
 * Game_Switches
 *
 * 开关的游戏对象类。
 * The game object class for switches.
 *
 * @class Game_Switches
 * @description 管理游戏中所有开关的状态，开关用于控制游戏流程和事件触发
 */
function Game_Switches() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_Switches object
 *
 * @memberof Game_Switches
 * @description 初始化开关对象并清空所有数据
 */
Game_Switches.prototype.initialize = function () {
	this.clear();
};

/**
 * 清空
 * Clear all switches
 *
 * @memberof Game_Switches
 * @description 清空所有开关数据，重置为初始状态
 */
Game_Switches.prototype.clear = function () {
	this._data = []; // 开关数据数组 - Switch data array
};

/**
 * 值
 * Get switch value
 *
 * @memberof Game_Switches
 * @param {number} switchId - 开关ID
 * @returns {boolean} 开关的状态值（true或false）
 * @description 获取指定开关的状态值
 */
Game_Switches.prototype.value = function (switchId) {
	return !!this._data[switchId];
};

/**
 * 设置值
 * Set switch value
 *
 * @memberof Game_Switches
 * @param {number} switchId - 开关ID
 * @param {boolean} value - 要设置的值
 * @description 设置指定开关的状态值，并触发变化事件
 */
Game_Switches.prototype.setValue = function (switchId, value) {
	if (switchId > 0 && switchId < $dataSystem.switches.length) {
		this._data[switchId] = value;
		this.onChange();
	}
};

/**
 * 当改变
 * Called when switch changes
 *
 * @memberof Game_Switches
 * @description 当开关状态发生变化时调用，请求地图刷新以更新相关事件
 */
Game_Switches.prototype.onChange = function () {
	$gameMap.requestRefresh();
};
