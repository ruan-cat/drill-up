//=============================================================================
// Game_Temp.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏_临时
 * Game_Temp
 * 
 * 临时数据（不包含存档数据）的游戏对象类。
 * The game object class for temporary data that is not included in save data.
 *
 * @class Game_Temp
 */
//-----------------------------------------------------------------------------

/**
 * Game_Temp constructor
 * @constructor
 */
function Game_Temp() {
    this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_Temp object
 */
Game_Temp.prototype.initialize = function() {
    this._isPlaytest = Utils.isOptionValid('test');  // 是否玩家测试 | Whether in playtest mode
    this._commonEventId = 0;  // 公共事件 ID | Common event ID
    this._destinationX = null;  // 目的地 X 坐标 | Destination X coordinate
    this._destinationY = null;  // 目的地 Y 坐标 | Destination Y coordinate
};

/**
 * 是否玩家测试
 * Check if in playtest mode
 * @returns {boolean} True if in playtest mode
 */
Game_Temp.prototype.isPlaytest = function() {
    return this._isPlaytest;
};

/**
 * 储存公共事件
 * Reserve a common event
 * @param {number} commonEventId - 公共事件ID | Common event ID
 */
Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    this._commonEventId = commonEventId;
};

/**
 * 清除公共事件
 * Clear the reserved common event
 */
Game_Temp.prototype.clearCommonEvent = function() {
    this._commonEventId = 0;
};

/**
 * 是否有公共事件储存
 * Check if a common event is reserved
 * @returns {boolean} True if a common event is reserved
 */
Game_Temp.prototype.isCommonEventReserved = function() {
    return this._commonEventId > 0;
};

/**
 * 储存的公共事件
 * Get the reserved common event
 * @returns {Object} The reserved common event data
 */
Game_Temp.prototype.reservedCommonEvent = function() {
    return $dataCommonEvents[this._commonEventId];
};

/**
 * 设置目的地
 * Set the destination coordinates
 * @param {number} x - X坐标 | X coordinate
 * @param {number} y - Y坐标 | Y coordinate
 */
Game_Temp.prototype.setDestination = function(x, y) {
    this._destinationX = x;
    this._destinationY = y;
};

/**
 * 清除目的地
 * Clear the destination
 */
Game_Temp.prototype.clearDestination = function() {
    this._destinationX = null;
    this._destinationY = null;
};

/**
 * 是否目的地有效
 * Check if the destination is valid
 * @returns {boolean} True if destination is valid
 */
Game_Temp.prototype.isDestinationValid = function() {
    return this._destinationX !== null;
};

/**
 * 目的地 X 坐标
 * Get destination X coordinate
 * @returns {number|null} The destination X coordinate
 */
Game_Temp.prototype.destinationX = function() {
    return this._destinationX;
};

/**
 * 目的地 Y 坐标
 * Get destination Y coordinate
 * @returns {number|null} The destination Y coordinate
 */
Game_Temp.prototype.destinationY = function() {
    return this._destinationY;
};