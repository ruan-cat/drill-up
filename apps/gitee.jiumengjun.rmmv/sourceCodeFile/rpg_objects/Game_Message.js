/**
 * @fileoverview Game_Message - 游戏信息对象类
 * @description 负责管理游戏中的信息窗口状态，包括文本显示、选项、数值输入等
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_信息
 * Game_Message
 *
 * 显示文本或选项等的信息窗口的情况的游戏对象类。
 * The game object class for the state of the message window that displays text
 * or selections, etc.
 *
 * @class Game_Message
 * @description 管理信息窗口的各种状态，包括文本内容、脸图、背景、位置、选项、数值输入等功能
 */
function Game_Message() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_Message object
 *
 * @memberof Game_Message
 * @description 初始化信息对象并清空所有数据
 */
Game_Message.prototype.initialize = function () {
	this.clear();
};

/**
 * 清空
 * Clear all message data
 *
 * @memberof Game_Message
 * @description 重置所有信息窗口相关的属性为默认值
 */
Game_Message.prototype.clear = function () {
	this._texts = []; // 文本 - Text lines
	this._choices = []; // 选项 - Choice options
	this._faceName = ""; // 脸图名字 - Face image name
	this._faceIndex = 0; // 脸图索引 - Face image index
	this._background = 0; // 背景 - Background type
	this._positionType = 2; // 位置类型 - Position type
	this._choiceDefaultType = 0; // 选项默认类型 - Choice default type
	this._choiceCancelType = 0; // 选项取消类型 - Choice cancel type
	this._choiceBackground = 0; // 选项背景 - Choice background
	this._choicePositionType = 2; // 选项位置类型 - Choice position type
	this._numInputVariableId = 0; // 数值输入变量 ID - Number input variable ID
	this._numInputMaxDigits = 0; // 数值输入最大位数 - Number input max digits
	this._itemChoiceVariableId = 0; // 物品选择变量 ID - Item choice variable ID
	this._itemChoiceItypeId = 0; // 物品选择类型 ID - Item choice type ID
	this._scrollMode = false; // 滚动模式 - Scroll mode
	this._scrollSpeed = 2; // 滚动速度 - Scroll speed
	this._scrollNoFast = false; // 滚动禁止快进 - Scroll no fast
	this._choiceCallback = null; // 选择回调 - Choice callback
};

/**
 * 选择
 * Get choices
 *
 * @memberof Game_Message
 * @returns {Array} 选择选项数组
 */
Game_Message.prototype.choices = function () {
	return this._choices;
};

/**
 * 脸图名
 * Get face name
 *
 * @memberof Game_Message
 * @returns {string} 脸图文件名
 */
Game_Message.prototype.faceName = function () {
	return this._faceName;
};

/**
 * 脸图索引
 * Get face index
 *
 * @memberof Game_Message
 * @returns {number} 脸图在文件中的索引
 */
Game_Message.prototype.faceIndex = function () {
	return this._faceIndex;
};

/**
 * 背景
 * Get background type
 *
 * @memberof Game_Message
 * @returns {number} 背景类型（0:窗口 1:暗色 2:透明）
 */
Game_Message.prototype.background = function () {
	return this._background;
};

/**
 * 位置类型
 * Get position type
 *
 * @memberof Game_Message
 * @returns {number} 位置类型（0:上 1:中 2:下）
 */
Game_Message.prototype.positionType = function () {
	return this._positionType;
};

/**
 * 选项默认类型
 * Get choice default type
 *
 * @memberof Game_Message
 * @returns {number} 选项默认类型
 */
Game_Message.prototype.choiceDefaultType = function () {
	return this._choiceDefaultType;
};

/**
 * 选项取消类型
 * Get choice cancel type
 *
 * @memberof Game_Message
 * @returns {number} 选项取消类型
 */
Game_Message.prototype.choiceCancelType = function () {
	return this._choiceCancelType;
};

/**
 * 选项背景
 * Get choice background
 *
 * @memberof Game_Message
 * @returns {number} 选项背景类型
 */
Game_Message.prototype.choiceBackground = function () {
	return this._choiceBackground;
};

/**
 * 选项位置类型
 * Get choice position type
 *
 * @memberof Game_Message
 * @returns {number} 选项位置类型
 */
Game_Message.prototype.choicePositionType = function () {
	return this._choicePositionType;
};

/**
 * 数值输入变量 ID
 * Get number input variable ID
 *
 * @memberof Game_Message
 * @returns {number} 数值输入结果存储的变量ID
 */
Game_Message.prototype.numInputVariableId = function () {
	return this._numInputVariableId;
};

/**
 * 数值输入最大位数
 * Get number input max digits
 *
 * @memberof Game_Message
 * @returns {number} 数值输入的最大位数
 */
Game_Message.prototype.numInputMaxDigits = function () {
	return this._numInputMaxDigits;
};

/**
 * 物品选择变量 ID
 * Get item choice variable ID
 *
 * @memberof Game_Message
 * @returns {number} 物品选择结果存储的变量ID
 */
Game_Message.prototype.itemChoiceVariableId = function () {
	return this._itemChoiceVariableId;
};

/**
 * 物品选择类型 ID
 * Get item choice type ID
 *
 * @memberof Game_Message
 * @returns {number} 物品选择的类型ID
 */
Game_Message.prototype.itemChoiceItypeId = function () {
	return this._itemChoiceItypeId;
};

/**
 * 滚动模式
 * Get scroll mode
 *
 * @memberof Game_Message
 * @returns {boolean} 是否为滚动模式
 */
Game_Message.prototype.scrollMode = function () {
	return this._scrollMode;
};

/**
 * 滚动速度
 * Get scroll speed
 *
 * @memberof Game_Message
 * @returns {number} 滚动速度
 */
Game_Message.prototype.scrollSpeed = function () {
	return this._scrollSpeed;
};

/**
 * 滚动禁止快进
 * Get scroll no fast
 *
 * @memberof Game_Message
 * @returns {boolean} 是否禁止快进滚动
 */
Game_Message.prototype.scrollNoFast = function () {
	return this._scrollNoFast;
};

/**
 * 增加
 * Add text line
 *
 * @memberof Game_Message
 * @param {string} text - 要添加的文本行
 * @description 向信息窗口添加一行文本
 */
Game_Message.prototype.add = function (text) {
	this._texts.push(text);
};

/**
 * 设置脸图图像
 * Set face image
 *
 * @memberof Game_Message
 * @param {string} faceName - 脸图文件名
 * @param {number} faceIndex - 脸图索引
 * @description 设置信息窗口显示的脸图
 */
Game_Message.prototype.setFaceImage = function (faceName, faceIndex) {
	this._faceName = faceName;
	this._faceIndex = faceIndex;
};

/**
 * 设置背景
 * Set background
 *
 * @memberof Game_Message
 * @param {number} background - 背景类型
 * @description 设置信息窗口的背景类型
 */
Game_Message.prototype.setBackground = function (background) {
	this._background = background;
};

/**
 * 设置位置类型
 * Set position type
 *
 * @memberof Game_Message
 * @param {number} positionType - 位置类型
 * @description 设置信息窗口的显示位置
 */
Game_Message.prototype.setPositionType = function (positionType) {
	this._positionType = positionType;
};

/**
 * 设置选项
 * Set choices
 *
 * @memberof Game_Message
 * @param {Array} choices - 选项数组
 * @param {number} defaultType - 默认选择类型
 * @param {number} cancelType - 取消选择类型
 * @description 设置选择选项的内容和行为
 */
Game_Message.prototype.setChoices = function (choices, defaultType, cancelType) {
	this._choices = choices;
	this._choiceDefaultType = defaultType;
	this._choiceCancelType = cancelType;
};

/**
 * 设置选项背景
 * Set choice background
 *
 * @memberof Game_Message
 * @param {number} background - 背景类型
 * @description 设置选项窗口的背景类型
 */
Game_Message.prototype.setChoiceBackground = function (background) {
	this._choiceBackground = background;
};

/**
 * 设置选项位置类型
 * Set choice position type
 *
 * @memberof Game_Message
 * @param {number} positionType - 位置类型
 * @description 设置选项窗口的显示位置
 */
Game_Message.prototype.setChoicePositionType = function (positionType) {
	this._choicePositionType = positionType;
};

/**
 * 设置数值输入
 * Set number input
 *
 * @memberof Game_Message
 * @param {number} variableId - 变量ID
 * @param {number} maxDigits - 最大位数
 * @description 设置数值输入的参数
 */
Game_Message.prototype.setNumberInput = function (variableId, maxDigits) {
	this._numInputVariableId = variableId;
	this._numInputMaxDigits = maxDigits;
};

/**
 * 设置物品选项
 * Set item choice
 *
 * @memberof Game_Message
 * @param {number} variableId - 变量ID
 * @param {number} itemType - 物品类型
 * @description 设置物品选择的参数
 */
Game_Message.prototype.setItemChoice = function (variableId, itemType) {
	this._itemChoiceVariableId = variableId;
	this._itemChoiceItypeId = itemType;
};

/**
 * 设置滚动
 * Set scroll
 *
 * @memberof Game_Message
 * @param {number} speed - 滚动速度
 * @param {boolean} noFast - 是否禁止快进
 * @description 设置文本滚动的参数
 */
Game_Message.prototype.setScroll = function (speed, noFast) {
	this._scrollMode = true;
	this._scrollSpeed = speed;
	this._scrollNoFast = noFast;
};

/**
 * 设置选择回调
 * Set choice callback
 *
 * @memberof Game_Message
 * @param {Function} callback - 回调函数
 * @description 设置选择选项时的回调函数
 */
Game_Message.prototype.setChoiceCallback = function (callback) {
	this._choiceCallback = callback;
};

/**
 * 当选择
 * Called when choice is made
 *
 * @memberof Game_Message
 * @param {number} n - 选择的选项索引
 * @description 当玩家选择选项时调用
 */
Game_Message.prototype.onChoice = function (n) {
	if (this._choiceCallback) {
		this._choiceCallback(n);
		this._choiceCallback = null;
	}
};

/**
 * 是否有文本
 * Check if has text
 *
 * @memberof Game_Message
 * @returns {boolean} 是否有文本内容
 */
Game_Message.prototype.hasText = function () {
	return this._texts.length > 0;
};

/**
 * 是否是选项
 * Check if is choice
 *
 * @memberof Game_Message
 * @returns {boolean} 是否有选择选项
 */
Game_Message.prototype.isChoice = function () {
	return this._choices.length > 0;
};

/**
 * 是否数值输入
 * Check if is number input
 *
 * @memberof Game_Message
 * @returns {boolean} 是否为数值输入模式
 */
Game_Message.prototype.isNumberInput = function () {
	return this._numInputVariableId > 0;
};

/**
 * 是否是物品选择
 * Check if is item choice
 *
 * @memberof Game_Message
 * @returns {boolean} 是否为物品选择模式
 */
Game_Message.prototype.isItemChoice = function () {
	return this._itemChoiceVariableId > 0;
};

/**
 * 是否繁忙
 * Check if busy
 *
 * @memberof Game_Message
 * @returns {boolean} 信息窗口是否处于繁忙状态
 * @description 检查是否有任何待处理的信息窗口内容
 */
Game_Message.prototype.isBusy = function () {
	return this.hasText() || this.isChoice() || this.isNumberInput() || this.isItemChoice();
};

/**
 * 新页
 * Add new page
 *
 * @memberof Game_Message
 * @description 在当前文本末尾添加换页符
 */
Game_Message.prototype.newPage = function () {
	if (this._texts.length > 0) {
		this._texts[this._texts.length - 1] += "\f";
	}
};

/**
 * 所有文本
 * Get all text
 *
 * @memberof Game_Message
 * @returns {string} 所有文本行合并的字符串
 * @description 将所有文本行合并为一个字符串，用换行符分隔
 */
Game_Message.prototype.allText = function () {
	return this._texts.join("\n");
};
