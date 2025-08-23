/**
 * @fileoverview Game_ActionResult - 行动结果类
 * 
 * 战斗行动结果的游戏对象类。为了方便起见，此类中的所有成员变量都是公共的。
 * The game object class for a result of a battle action. For convenience, all
 * member variables in this class are public.
 * 
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 行动结果类
 * Game action result class
 * 
 * @class Game_ActionResult
 * @constructor
 */
function Game_ActionResult() {
    this.initialize.apply(this, arguments);
}

/**
 * 初始化行动结果
 * Initialize action result
 * 
 * @memberof Game_ActionResult
 * @method initialize
 */
Game_ActionResult.prototype.initialize = function() {
    this.clear();
};

/**
 * 清除结果数据
 * Clear result data
 * 
 * @memberof Game_ActionResult
 * @method clear
 */
Game_ActionResult.prototype.clear = function() {
    this.used = false;          // 是否使用 - Whether used
    this.missed = false;        // 是否未命中 - Whether missed
    this.evaded = false;        // 是否闪避 - Whether evaded
    this.physical = false;      // 是否物理攻击 - Whether physical
    this.drain = false;         // 是否吸收 - Whether drain
    this.critical = false;      // 是否暴击 - Whether critical
    this.success = false;       // 是否成功 - Whether success
    this.hpAffected = false;    // HP是否受影响 - Whether HP affected
    this.hpDamage = 0;          // HP伤害值 - HP damage value
    this.mpDamage = 0;          // MP伤害值 - MP damage value
    this.tpDamage = 0;          // TP伤害值 - TP damage value
    this.addedStates = [];      // 附加状态列表 - Added states list
    this.removedStates = [];    // 解除状态列表 - Removed states list
    this.addedBuffs = [];       // 附加强化列表 - Added buffs list
    this.addedDebuffs = [];     // 附加弱化列表 - Added debuffs list
    this.removedBuffs = [];     // 解除强化列表 - Removed buffs list
};

/**
 * 获取附加状态对象列表
 * Get added state objects
 * 
 * @memberof Game_ActionResult
 * @method addedStateObjects
 * @returns {Array} 附加状态对象数组 - Added state objects array
 */
Game_ActionResult.prototype.addedStateObjects = function() {
    return this.addedStates.map(function(id) {
        return $dataStates[id];
    });
};

/**
 * 获取移除状态对象列表
 * Get removed state objects
 * 
 * @memberof Game_ActionResult
 * @method removedStateObjects
 * @returns {Array} 移除状态对象数组 - Removed state objects array
 */
Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(function(id) {
        return $dataStates[id];
    });
};

/**
 * 是否有受影响的状态
 * Check if status is affected
 * 
 * @memberof Game_ActionResult
 * @method isStatusAffected
 * @returns {Boolean} 是否有状态影响 - Whether status is affected
 */
Game_ActionResult.prototype.isStatusAffected = function() {
    return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
};

/**
 * 是否命中
 * Check if hit
 * 
 * @memberof Game_ActionResult
 * @method isHit
 * @returns {Boolean} 是否命中 - Whether hit
 */
Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed && !this.evaded;
};

/**
 * 检查状态是否被附加
 * Check if state is added
 * 
 * @memberof Game_ActionResult
 * @method isStateAdded
 * @param {Number} stateId - 状态ID - State ID
 * @returns {Boolean} 是否附加该状态 - Whether the state is added
 */
Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.contains(stateId);
};

/**
 * 添加附加状态
 * Push added state
 * 
 * @memberof Game_ActionResult
 * @method pushAddedState
 * @param {Number} stateId - 状态ID - State ID
 */
Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};

/**
 * 检查状态是否被解除
 * Check if state is removed
 * 
 * @memberof Game_ActionResult
 * @method isStateRemoved
 * @param {Number} stateId - 状态ID - State ID
 * @returns {Boolean} 是否解除该状态 - Whether the state is removed
 */
Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.contains(stateId);
};

/**
 * 添加解除状态
 * Push removed state
 * 
 * @memberof Game_ActionResult
 * @method pushRemovedState
 * @param {Number} stateId - 状态ID - State ID
 */
Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};

/**
 * 检查强化是否被附加
 * Check if buff is added
 * 
 * @memberof Game_ActionResult
 * @method isBuffAdded
 * @param {Number} paramId - 参数ID - Parameter ID
 * @returns {Boolean} 是否附加该强化 - Whether the buff is added
 */
Game_ActionResult.prototype.isBuffAdded = function(paramId) {
    return this.addedBuffs.contains(paramId);
};

/**
 * 添加附加强化
 * Push added buff
 * 
 * @memberof Game_ActionResult
 * @method pushAddedBuff
 * @param {Number} paramId - 参数ID - Parameter ID
 */
Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
    if (!this.isBuffAdded(paramId)) {
        this.addedBuffs.push(paramId);
    }
};

/**
 * 检查弱化是否被附加
 * Check if debuff is added
 * 
 * @memberof Game_ActionResult
 * @method isDebuffAdded
 * @param {Number} paramId - 参数ID - Parameter ID
 * @returns {Boolean} 是否附加该弱化 - Whether the debuff is added
 */
Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
    return this.addedDebuffs.contains(paramId);
};

/**
 * 添加附加弱化
 * Push added debuff
 * 
 * @memberof Game_ActionResult
 * @method pushAddedDebuff
 * @param {Number} paramId - 参数ID - Parameter ID
 */
Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
    if (!this.isDebuffAdded(paramId)) {
        this.addedDebuffs.push(paramId);
    }
};

/**
 * 检查强化是否被解除
 * Check if buff is removed
 * 
 * @memberof Game_ActionResult
 * @method isBuffRemoved
 * @param {Number} paramId - 参数ID - Parameter ID
 * @returns {Boolean} 是否解除该强化 - Whether the buff is removed
 */
Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
    return this.removedBuffs.contains(paramId);
};

/**
 * 添加解除强化
 * Push removed buff
 * 
 * @memberof Game_ActionResult
 * @method pushRemovedBuff
 * @param {Number} paramId - 参数ID - Parameter ID
 */
Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
    if (!this.isBuffRemoved(paramId)) {
        this.removedBuffs.push(paramId);
    }
};