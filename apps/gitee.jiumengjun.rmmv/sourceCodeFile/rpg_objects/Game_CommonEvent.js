//=============================================================================
// Game_CommonEvent.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏公共事件类
 * Game_CommonEvent
 *
 * 公共事件的游戏对象类。它包含运行并行处理事件的功能。 
 * The game object class for a common event. It contains functionality for
 * running parallel process events.
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_CommonEvent
 * @description 游戏公共事件类，管理公共事件的执行和状态
 * Game common event class that manages the execution and state of common events
 */
function Game_CommonEvent() {
    this.initialize.apply(this, arguments);
}

/**
 * 初始化公共事件
 * Initialize common event
 *
 * @param {number} commonEventId - 公共事件ID / Common event ID
 */
Game_CommonEvent.prototype.initialize = function(commonEventId) {
    this._commonEventId = commonEventId;
    this.refresh();
};

/**
 * 获取事件数据
 * Get event data
 *
 * @returns {object} 事件数据 / Event data
 */
Game_CommonEvent.prototype.event = function() {
    return $dataCommonEvents[this._commonEventId];
};

/**
 * 获取事件指令列表
 * Get event command list
 *
 * @returns {Array} 指令列表 / Command list
 */
Game_CommonEvent.prototype.list = function() {
    return this.event().list;
};

/**
 * 刷新公共事件状态
 * Refresh common event state
 */
Game_CommonEvent.prototype.refresh = function() {
    if (this.isActive()) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
        }
    } else {
        this._interpreter = null;
    }
};

/**
 * 检查公共事件是否激活
 * Check if common event is active
 *
 * @returns {boolean} 是否激活 / Whether active
 */
Game_CommonEvent.prototype.isActive = function() {
    var event = this.event();
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};

/**
 * 更新公共事件
 * Update common event
 */
Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list());
        }
        this._interpreter.update();
    }
};