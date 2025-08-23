/**
 * @fileoverview Game_Variables - 游戏变量对象类
 * @description 负责管理游戏中的变量数据
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_变量
 * Game_Variables
 *
 * 变量的游戏对象类。
 * The game object class for variables.
 *
 * @class Game_Variables
 * @description 管理游戏中所有变量的数值，变量用于存储数值数据和控制游戏逻辑
 */
function Game_Variables() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_Variables object
 *
 * @memberof Game_Variables
 * @description 初始化变量对象并清空所有数据
 */
Game_Variables.prototype.initialize = function () {
	this.clear();
};

/**
 * 清空
 * Clear all variables
 *
 * @memberof Game_Variables
 * @description 清空所有变量数据，重置为初始状态
 */
Game_Variables.prototype.clear = function () {
	this._data = []; // 变量数据数组 - Variable data array
};

/**
 * 值
 * Get variable value
 *
 * @memberof Game_Variables
 * @param {number} variableId - 变量ID
 * @returns {number} 变量的数值（如果未设置则返回0）
 * @description 获取指定变量的数值
 */
Game_Variables.prototype.value = function (variableId) {
	return this._data[variableId] || 0;
};

/**
 * 设置值
 * Set variable value
 *
 * @memberof Game_Variables
 * @param {number} variableId - 变量ID
 * @param {number} value - 要设置的数值
 * @description 设置指定变量的数值，自动向下取整并触发变化事件
 */
Game_Variables.prototype.setValue = function (variableId, value) {
	if (variableId > 0 && variableId < $dataSystem.variables.length) {
		if (typeof value === "number") {
			value = Math.floor(value);
		}
		this._data[variableId] = value;
		this.onChange();
	}
};

/**
 * 当改变
 * Called when variable changes
 *
 * @memberof Game_Variables
 * @description 当变量数值发生变化时调用，请求地图刷新以更新相关事件
 */
Game_Variables.prototype.onChange = function () {
	$gameMap.requestRefresh();
};
