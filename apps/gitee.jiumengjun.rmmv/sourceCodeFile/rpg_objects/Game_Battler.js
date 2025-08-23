/**
 * @fileoverview Game_Battler - 游戏战斗者类
 * @description 游戏战斗者类，Game_Actor 和 Game_Enemy 的父类，包含精灵和行动的方法
 * The superclass of Game_Actor and Game_Enemy. It contains methods for sprites and actions.
 * @author RPG Maker MV Development Team
 * @since RPG Maker MV 1.0.0
 */

//-----------------------------------------------------------------------------
// 游戏_战斗者
// Game_Battler
//
// Game_Actor 和 Game_Enemy 的父类。它包含精灵和行动的方法。
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

/**
 * Game_Battler - 游戏战斗者类
 * Game_Battler class - represents a battler (actor or enemy) in the game
 *
 * @class Game_Battler
 * @constructor
 * @description 游戏战斗者类，继承自Game_BattlerBase，用于处理战斗中的行动和效果
 * Game battler class, inherits from Game_BattlerBase, handles actions and effects in battle
 */
function Game_Battler() {
	this.initialize.apply(this, arguments);
}

Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.constructor = Game_Battler;

/**
 * 初始化
 * Initialize the battler
 *
 * @memberof Game_Battler
 * @method initialize
 * @description 初始化战斗者对象
 * Initialize the battler object
 */
Game_Battler.prototype.initialize = function () {
	Game_BattlerBase.prototype.initialize.call(this);
};

/**
 * 初始化成员
 * Initialize members
 *
 * @memberof Game_Battler
 * @method initMembers
 * @description 初始化战斗者的成员变量
 * Initialize the battler's member variables
 */
Game_Battler.prototype.initMembers = function () {
	Game_BattlerBase.prototype.initMembers.call(this);
	this._actions = [];
	this._speed = 0;
	this._result = new Game_ActionResult();
	this._actionState = "";
	this._lastTargetIndex = 0;
	this._animations = [];
	this._damagePopup = false;
	this._effectType = null;
	this._motionType = null;
	this._weaponImageId = 0;
	this._motionRefresh = false;
	this._selected = false;
};

/**
 * 清除动画
 * Clear animations
 *
 * @memberof Game_Battler
 * @method clearAnimations
 * @description 清除所有待显示的动画
 * Clear all pending animations
 */
Game_Battler.prototype.clearAnimations = function () {
	this._animations = [];
};

/**
 * 清除伤害弹出层
 * Clear damage popup
 *
 * @memberof Game_Battler
 * @method clearDamagePopup
 * @description 清除伤害弹出层显示标志
 * Clear the damage popup display flag
 */
Game_Battler.prototype.clearDamagePopup = function () {
	this._damagePopup = false;
};

/**
 * 清除武器动画
 * Clear weapon animation
 *
 * @memberof Game_Battler
 * @method clearWeaponAnimation
 * @description 清除武器动画ID
 * Clear the weapon animation ID
 */
Game_Battler.prototype.clearWeaponAnimation = function () {
	this._weaponImageId = 0;
};

/**
 * 清除效果
 * Clear effect
 *
 * @memberof Game_Battler
 * @method clearEffect
 * @description 清除视觉效果类型
 * Clear the visual effect type
 */
Game_Battler.prototype.clearEffect = function () {
	this._effectType = null;
};

/**
 * 清除动作
 * Clear motion
 *
 * @memberof Game_Battler
 * @method clearMotion
 * @description 清除动作类型和刷新标志
 * Clear the motion type and refresh flag
 */
Game_Battler.prototype.clearMotion = function () {
	this._motionType = null;
	this._motionRefresh = false;
};

/**
 * 请求效果
 * Request effect
 *
 * @memberof Game_Battler
 * @method requestEffect
 * @param {string} effectType - 效果类型 Effect type
 * @description 请求显示特定的视觉效果
 * Request to display a specific visual effect
 */
Game_Battler.prototype.requestEffect = function (effectType) {
	this._effectType = effectType;
};

/**
 * 请求动作
 * Request motion
 *
 * @memberof Game_Battler
 * @method requestMotion
 * @param {string} motionType - 动作类型 Motion type
 * @description 请求播放特定的动作
 * Request to play a specific motion
 */
Game_Battler.prototype.requestMotion = function (motionType) {
	this._motionType = motionType;
};

/**
 * 请求动作刷新
 * Request motion refresh
 *
 * @memberof Game_Battler
 * @method requestMotionRefresh
 * @description 请求刷新动作状态
 * Request to refresh the motion state
 */
Game_Battler.prototype.requestMotionRefresh = function () {
	this._motionRefresh = true;
};

/**
 * 选择
 * Select
 *
 * @memberof Game_Battler
 * @method select
 * @description 选择此战斗者（通常用于目标选择）
 * Select this battler (usually for target selection)
 */
Game_Battler.prototype.select = function () {
	this._selected = true;
};

/**
 * 取消选择
 * Deselect
 *
 * @memberof Game_Battler
 * @method deselect
 * @description 取消选择此战斗者
 * Deselect this battler
 */
Game_Battler.prototype.deselect = function () {
	this._selected = false;
};

/**
 * 是否有动画请求
 * Is animation requested
 *
 * @memberof Game_Battler
 * @method isAnimationRequested
 * @returns {boolean} 是否有待播放的动画 Whether there are animations to play
 * @description 检查是否有待播放的动画
 * Check if there are animations waiting to be played
 */
Game_Battler.prototype.isAnimationRequested = function () {
	return this._animations.length > 0;
};

/**
 * 是否有伤害弹出层请求
 * Is damage popup requested
 *
 * @memberof Game_Battler
 * @method isDamagePopupRequested
 * @returns {boolean} 是否需要显示伤害弹出层 Whether damage popup should be displayed
 * @description 检查是否需要显示伤害弹出层
 * Check if damage popup should be displayed
 */
Game_Battler.prototype.isDamagePopupRequested = function () {
	return this._damagePopup;
};

/**
 * 是否有效果请求
 * Is effect requested
 *
 * @memberof Game_Battler
 * @method isEffectRequested
 * @returns {boolean} 是否有待显示的效果 Whether there is an effect to display
 * @description 检查是否有待显示的视觉效果
 * Check if there is a visual effect waiting to be displayed
 */
Game_Battler.prototype.isEffectRequested = function () {
	return !!this._effectType;
};

/**
 * 是否有动作请求
 * Is motion requested
 *
 * @memberof Game_Battler
 * @method isMotionRequested
 * @returns {boolean} 是否有待播放的动作 Whether there is a motion to play
 * @description 检查是否有待播放的动作
 * Check if there is a motion waiting to be played
 */
Game_Battler.prototype.isMotionRequested = function () {
	return !!this._motionType;
};

/**
 * 是否有武器动画请求
 * Is weapon animation requested
 *
 * @memberof Game_Battler
 * @method isWeaponAnimationRequested
 * @returns {boolean} 是否有武器动画请求 Whether weapon animation is requested
 * @description 检查是否有武器动画需要播放
 * Check if weapon animation needs to be played
 */
Game_Battler.prototype.isWeaponAnimationRequested = function () {
	return this._weaponImageId > 0;
};

/**
 * 是否有动作刷新请求
 * Is motion refresh requested
 *
 * @memberof Game_Battler
 * @method isMotionRefreshRequested
 * @returns {boolean} 是否需要刷新动作 Whether motion refresh is needed
 * @description 检查是否需要刷新动作状态
 * Check if motion state needs to be refreshed
 */
Game_Battler.prototype.isMotionRefreshRequested = function () {
	return this._motionRefresh;
};

/**
 * 是否选择
 * Is selected
 *
 * @memberof Game_Battler
 * @method isSelected
 * @returns {boolean} 是否被选择 Whether the battler is selected
 * @description 检查战斗者是否被选择
 * Check if the battler is selected
 */
Game_Battler.prototype.isSelected = function () {
	return this._selected;
};

/**
 * 效果类型
 * Effect type
 *
 * @memberof Game_Battler
 * @method effectType
 * @returns {string|null} 当前效果类型 Current effect type
 * @description 获取当前的视觉效果类型
 * Get the current visual effect type
 */
Game_Battler.prototype.effectType = function () {
	return this._effectType;
};

/**
 * 动作类型
 * Motion type
 *
 * @memberof Game_Battler
 * @method motionType
 * @returns {string|null} 当前动作类型 Current motion type
 * @description 获取当前的动作类型
 * Get the current motion type
 */
Game_Battler.prototype.motionType = function () {
	return this._motionType;
};

/**
 * 武器图像 ID
 * Weapon image ID
 *
 * @memberof Game_Battler
 * @method weaponImageId
 * @returns {number} 武器图像ID Weapon image ID
 * @description 获取武器图像ID
 * Get the weapon image ID
 */
Game_Battler.prototype.weaponImageId = function () {
	return this._weaponImageId;
};

/**
 * 转移动画
 * Shift animation
 *
 * @memberof Game_Battler
 * @method shiftAnimation
 * @returns {object|undefined} 动画数据 Animation data
 * @description 将动画数组的第一个元素从其中删除，并返回第一个元素的值
 * Remove and return the first element from the animations array
 */
Game_Battler.prototype.shiftAnimation = function () {
	return this._animations.shift();
};

/**
 * 开始动画
 * Start animation
 *
 * @memberof Game_Battler
 * @method startAnimation
 * @param {number} animationId - 动画ID Animation ID
 * @param {boolean} mirror - 是否镜像 Whether to mirror
 * @param {number} delay - 延迟时间 Delay time
 * @description 开始播放指定的动画
 * Start playing the specified animation
 */
Game_Battler.prototype.startAnimation = function (animationId, mirror, delay) {
	var data = { animationId: animationId, mirror: mirror, delay: delay };
	this._animations.push(data);
};

/**
 * 开始伤害弹出层
 * Start damage popup
 *
 * @memberof Game_Battler
 * @method startDamagePopup
 * @description 开始显示伤害弹出层
 * Start displaying the damage popup
 */
Game_Battler.prototype.startDamagePopup = function () {
	this._damagePopup = true;
};

/**
 * 开始武器动画
 * Start weapon animation
 *
 * @memberof Game_Battler
 * @method startWeaponAnimation
 * @param {number} weaponImageId - 武器图像ID Weapon image ID
 * @description 开始播放武器动画
 * Start playing weapon animation
 */
Game_Battler.prototype.startWeaponAnimation = function (weaponImageId) {
	this._weaponImageId = weaponImageId;
};

/**
 * 行动
 * Action
 *
 * @memberof Game_Battler
 * @method action
 * @param {number} index - 行动索引 Action index
 * @returns {Game_Action} 指定索引的行动 Action at the specified index
 * @description 获取指定索引的行动
 * Get the action at the specified index
 */
Game_Battler.prototype.action = function (index) {
	return this._actions[index];
};

/**
 * 设置行动
 * Set action
 *
 * @memberof Game_Battler
 * @method setAction
 * @param {number} index - 行动索引 Action index
 * @param {Game_Action} action - 行动对象 Action object
 * @description 设置指定索引的行动
 * Set the action at the specified index
 */
Game_Battler.prototype.setAction = function (index, action) {
	this._actions[index] = action;
};

/**
 * 行动个数
 * Number of actions
 *
 * @memberof Game_Battler
 * @method numActions
 * @returns {number} 行动数量 Number of actions
 * @description 获取行动的总数量
 * Get the total number of actions
 */
Game_Battler.prototype.numActions = function () {
	return this._actions.length;
};

/**
 * 清除行动
 * Clear actions
 *
 * @memberof Game_Battler
 * @method clearActions
 * @description 清除所有行动
 * Clear all actions
 */
Game_Battler.prototype.clearActions = function () {
	this._actions = [];
};

/**
 * 结果
 * Result
 *
 * @memberof Game_Battler
 * @method result
 * @returns {Game_ActionResult} 行动结果 Action result
 * @description 获取行动结果对象
 * Get the action result object
 */
Game_Battler.prototype.result = function () {
	return this._result;
};

/**
 * 清除结果
 * Clear result
 *
 * @memberof Game_Battler
 * @method clearResult
 * @description 清除行动结果
 * Clear the action result
 */
Game_Battler.prototype.clearResult = function () {
	this._result.clear();
};

/**
 * 刷新
 * Refresh
 *
 * @memberof Game_Battler
 * @method refresh
 * @description 刷新战斗者状态，检查死亡状态
 * Refresh the battler's state, check death state
 */
Game_Battler.prototype.refresh = function () {
	Game_BattlerBase.prototype.refresh.call(this);
	if (this.hp === 0) {
		this.addState(this.deathStateId());
	} else {
		this.removeState(this.deathStateId());
	}
};

/**
 * 添加状态
 * Add state
 *
 * @memberof Game_Battler
 * @method addState
 * @param {number} stateId - 状态ID State ID
 * @description 为战斗者添加指定的状态
 * Add the specified state to the battler
 */
Game_Battler.prototype.addState = function (stateId) {
	if (this.isStateAddable(stateId)) {
		if (!this.isStateAffected(stateId)) {
			this.addNewState(stateId);
			this.refresh();
		}
		this.resetStateCounts(stateId);
		this._result.pushAddedState(stateId);
	}
};

/**
 * 该状态是否可添加
 * Is state addable
 *
 * @memberof Game_Battler
 * @method isStateAddable
 * @param {number} stateId - 状态ID State ID
 * @returns {boolean} 是否可以添加状态 Whether the state can be added
 * @description 检查指定状态是否可以添加
 * Check if the specified state can be added
 */
Game_Battler.prototype.isStateAddable = function (stateId) {
	return (
		this.isAlive() &&
		$dataStates[stateId] &&
		!this.isStateResist(stateId) &&
		!this._result.isStateRemoved(stateId) &&
		!this.isStateRestrict(stateId)
	);
};

/**
 * 该状态是否受到行动限制时解除
 * Is state restrict
 *
 * @memberof Game_Battler
 * @method isStateRestrict
 * @param {number} stateId - 状态ID State ID
 * @returns {boolean} 是否在行动限制时解除 Whether removed when restricted
 * @description 检查状态是否在行动受限时解除
 * Check if the state is removed when actions are restricted
 */
Game_Battler.prototype.isStateRestrict = function (stateId) {
	return $dataStates[stateId].removeByRestriction && this.isRestricted();
};

/**
 * 当行动限制
 * On restrict
 *
 * @memberof Game_Battler
 * @method onRestrict
 * @description 当战斗者行动受限时的处理
 * Handle when the battler's actions are restricted
 */
Game_Battler.prototype.onRestrict = function () {
	Game_BattlerBase.prototype.onRestrict.call(this);
	this.clearActions();
	this.states().forEach(function (state) {
		if (state.removeByRestriction) {
			this.removeState(state.id);
		}
	}, this);
};

/**
 * 解除状态
 * Remove state
 *
 * @memberof Game_Battler
 * @method removeState
 * @param {number} stateId - 状态ID State ID
 * @description 解除指定的状态
 * Remove the specified state
 */
Game_Battler.prototype.removeState = function (stateId) {
	if (this.isStateAffected(stateId)) {
		if (stateId === this.deathStateId()) {
			this.revive();
		}
		this.eraseState(stateId);
		this.refresh();
		this._result.pushRemovedState(stateId);
	}
};

/**
 * 逃跑
 * Escape
 *
 * @memberof Game_Battler
 * @method escape
 * @description 战斗者逃跑
 * The battler escapes from battle
 */
Game_Battler.prototype.escape = function () {
	if ($gameParty.inBattle()) {
		this.hide();
	}
	this.clearActions();
	this.clearStates();
	SoundManager.playEscape();
};

/**
 * 添加强化
 * Add buff
 *
 * @memberof Game_Battler
 * @method addBuff
 * @param {number} paramId - 参数ID Parameter ID
 * @param {number} turns - 持续回合数 Duration in turns
 * @description 添加强化效果
 * Add a buff effect
 */
Game_Battler.prototype.addBuff = function (paramId, turns) {
	if (this.isAlive()) {
		this.increaseBuff(paramId);
		if (this.isBuffAffected(paramId)) {
			this.overwriteBuffTurns(paramId, turns);
		}
		this._result.pushAddedBuff(paramId);
		this.refresh();
	}
};

/**
 * 添加弱化
 * Add debuff
 *
 * @memberof Game_Battler
 * @method addDebuff
 * @param {number} paramId - 参数ID Parameter ID
 * @param {number} turns - 持续回合数 Duration in turns
 * @description 添加弱化效果
 * Add a debuff effect
 */
Game_Battler.prototype.addDebuff = function (paramId, turns) {
	if (this.isAlive()) {
		this.decreaseBuff(paramId);
		if (this.isDebuffAffected(paramId)) {
			this.overwriteBuffTurns(paramId, turns);
		}
		this._result.pushAddedDebuff(paramId);
		this.refresh();
	}
};

/**
 * 解除强化
 * Remove buff
 *
 * @memberof Game_Battler
 * @method removeBuff
 * @param {number} paramId - 参数ID Parameter ID
 * @description 解除强化或弱化效果
 * Remove buff or debuff effect
 */
Game_Battler.prototype.removeBuff = function (paramId) {
	if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
		this.eraseBuff(paramId);
		this._result.pushRemovedBuff(paramId);
		this.refresh();
	}
};

/**
 * 解除战斗状态
 * Remove battle states
 *
 * @memberof Game_Battler
 * @method removeBattleStates
 * @description 解除所有战斗结束时应该移除的状态
 * Remove all states that should be removed at battle end
 */
Game_Battler.prototype.removeBattleStates = function () {
	this.states().forEach(function (state) {
		if (state.removeAtBattleEnd) {
			this.removeState(state.id);
		}
	}, this);
};

/**
 * 解除所有强化
 * Remove all buffs
 *
 * @memberof Game_Battler
 * @method removeAllBuffs
 * @description 解除所有的强化和弱化效果
 * Remove all buff and debuff effects
 */
Game_Battler.prototype.removeAllBuffs = function () {
	for (var i = 0; i < this.buffLength(); i++) {
		this.removeBuff(i);
	}
};

/**
 * 自动解除状态
 * Remove states auto
 *
 * @memberof Game_Battler
 * @method removeStatesAuto
 * @param {number} timing - 时机 Timing
 * @description 自动解除符合条件的状态
 * Automatically remove states that meet the conditions
 */
Game_Battler.prototype.removeStatesAuto = function (timing) {
	this.states().forEach(function (state) {
		if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
			this.removeState(state.id);
		}
	}, this);
};

/**
 * 自动解除强化
 * Remove buffs auto
 *
 * @memberof Game_Battler
 * @method removeBuffsAuto
 * @description 自动解除过期的强化和弱化效果
 * Automatically remove expired buff and debuff effects
 */
Game_Battler.prototype.removeBuffsAuto = function () {
	for (var i = 0; i < this.buffLength(); i++) {
		if (this.isBuffExpired(i)) {
			this.removeBuff(i);
		}
	}
};

/**
 * 受伤时解除状态
 * Remove states by damage
 *
 * @memberof Game_Battler
 * @method removeStatesByDamage
 * @description 受到伤害时可能解除的状态
 * Remove states that may be removed when taking damage
 */
Game_Battler.prototype.removeStatesByDamage = function () {
	this.states().forEach(function (state) {
		if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
			this.removeState(state.id);
		}
	}, this);
};

/**
 * 制作行动次数
 * Make action times
 *
 * @memberof Game_Battler
 * @method makeActionTimes
 * @returns {number} 行动次数 Number of actions
 * @description 根据行动次数追加计算实际行动次数
 * Calculate actual number of actions based on action plus
 */
Game_Battler.prototype.makeActionTimes = function () {
	return this.actionPlusSet().reduce(function (r, p) {
		return Math.random() < p ? r + 1 : r;
	}, 1);
};

/**
 * 制作行动
 * Make actions
 *
 * @memberof Game_Battler
 * @method makeActions
 * @description 创建战斗者的行动列表
 * Create the battler's action list
 */
Game_Battler.prototype.makeActions = function () {
	this.clearActions();
	if (this.canMove()) {
		var actionTimes = this.makeActionTimes();
		this._actions = [];
		for (var i = 0; i < actionTimes; i++) {
			this._actions.push(new Game_Action(this));
		}
	}
};

/**
 * 速度
 * Speed
 *
 * @memberof Game_Battler
 * @method speed
 * @returns {number} 速度值 Speed value
 * @description 获取战斗者的速度
 * Get the battler's speed
 */
Game_Battler.prototype.speed = function () {
	return this._speed;
};

/**
 * 制作速度
 * Make speed
 *
 * @memberof Game_Battler
 * @method makeSpeed
 * @description 计算战斗者的速度值
 * Calculate the battler's speed value
 */
Game_Battler.prototype.makeSpeed = function () {
	this._speed =
		Math.min.apply(
			null,
			this._actions.map(function (action) {
				return action.speed();
			}),
		) || 0;
};

/**
 * 当前行动
 * Current action
 *
 * @memberof Game_Battler
 * @method currentAction
 * @returns {Game_Action} 当前行动 Current action
 * @description 获取当前的行动
 * Get the current action
 */
Game_Battler.prototype.currentAction = function () {
	return this._actions[0];
};

/**
 * 移除当前行动
 * Remove current action
 *
 * @memberof Game_Battler
 * @method removeCurrentAction
 * @description 移除当前行动（第一个行动）
 * Remove the current action (first action)
 */
Game_Battler.prototype.removeCurrentAction = function () {
	this._actions.shift();
};

/**
 * 设置上次目标
 * Set last target
 *
 * @memberof Game_Battler
 * @method setLastTarget
 * @param {Game_Battler} target - 目标战斗者 Target battler
 * @description 设置上次选择的目标
 * Set the last selected target
 */
Game_Battler.prototype.setLastTarget = function (target) {
	if (target) {
		this._lastTargetIndex = target.index();
	} else {
		this._lastTargetIndex = 0;
	}
};

/**
 * 强制行动
 * Force action
 *
 * @memberof Game_Battler
 * @method forceAction
 * @param {number} skillId - 技能ID Skill ID
 * @param {number} targetIndex - 目标索引 Target index
 * @description 强制战斗者执行指定行动
 * Force the battler to perform the specified action
 */
Game_Battler.prototype.forceAction = function (skillId, targetIndex) {
	this.clearActions();
	var action = new Game_Action(this, true);
	action.setSkill(skillId);
	if (targetIndex === -2) {
		action.setTarget(this._lastTargetIndex);
	} else if (targetIndex === -1) {
		action.decideRandomTarget();
	} else {
		action.setTarget(targetIndex);
	}
	this._actions.push(action);
};

/**
 * 使用项目（技能和物品）
 * Use item (skills and items)
 *
 * @memberof Game_Battler
 * @method useItem
 * @param {object} item - 项目对象 Item object
 * @description 使用技能或物品
 * Use skill or item
 */
Game_Battler.prototype.useItem = function (item) {
	if (DataManager.isSkill(item)) {
		this.paySkillCost(item);
	} else if (DataManager.isItem(item)) {
		this.consumeItem(item);
	}
};

/**
 * 消耗物品
 * Consume item
 *
 * @memberof Game_Battler
 * @method consumeItem
 * @param {object} item - 物品对象 Item object
 * @description 消耗指定的物品
 * Consume the specified item
 */
Game_Battler.prototype.consumeItem = function (item) {
	$gameParty.consumeItem(item);
};

/**
 * 获得 HP
 * Gain HP
 *
 * @memberof Game_Battler
 * @method gainHp
 * @param {number} value - HP值 HP value
 * @description 增加或减少HP
 * Increase or decrease HP
 */
Game_Battler.prototype.gainHp = function (value) {
	this._result.hpDamage = -value;
	this._result.hpAffected = true;
	this.setHp(this.hp + value);
};

/**
 * 获得 MP
 * Gain MP
 *
 * @memberof Game_Battler
 * @method gainMp
 * @param {number} value - MP值 MP value
 * @description 增加或减少MP
 * Increase or decrease MP
 */
Game_Battler.prototype.gainMp = function (value) {
	this._result.mpDamage = -value;
	this.setMp(this.mp + value);
};

/**
 * 获得 TP
 * Gain TP
 *
 * @memberof Game_Battler
 * @method gainTp
 * @param {number} value - TP值 TP value
 * @description 增加或减少TP
 * Increase or decrease TP
 */
Game_Battler.prototype.gainTp = function (value) {
	this._result.tpDamage = -value;
	this.setTp(this.tp + value);
};

/**
 * 静默获得 TP
 * Gain silent TP
 *
 * @memberof Game_Battler
 * @method gainSilentTp
 * @param {number} value - TP值 TP value
 * @description 静默增加TP值（不显示在结果中）
 * Silently increase TP value (not shown in results)
 */
Game_Battler.prototype.gainSilentTp = function (value) {
	this.setTp(this.tp + value);
};

/**
 * 初始化 TP
 * Initialize TP
 *
 * @memberof Game_Battler
 * @method initTp
 * @description 初始化TP值为随机值
 * Initialize TP to a random value
 */
Game_Battler.prototype.initTp = function () {
	this.setTp(Math.randomInt(25));
};

/**
 * 清除 TP
 * Clear TP
 *
 * @memberof Game_Battler
 * @method clearTp
 * @description 将TP值设为0
 * Set TP value to 0
 */
Game_Battler.prototype.clearTp = function () {
	this.setTp(0);
};

/**
 * 受伤害时改变 TP
 * Charge TP by damage
 *
 * @memberof Game_Battler
 * @method chargeTpByDamage
 * @param {number} damageRate - 伤害比例 Damage rate
 * @description 根据受到的伤害增加TP
 * Increase TP based on damage taken
 */
Game_Battler.prototype.chargeTpByDamage = function (damageRate) {
	var value = Math.floor(50 * damageRate * this.tcr);
	this.gainSilentTp(value);
};

/**
 * 自动恢复 HP
 * Regenerate HP
 *
 * @memberof Game_Battler
 * @method regenerateHp
 * @description 自动恢复HP
 * Automatically regenerate HP
 */
Game_Battler.prototype.regenerateHp = function () {
	var value = Math.floor(this.mhp * this.hrg);
	value = Math.max(value, -this.maxSlipDamage());
	if (value !== 0) {
		this.gainHp(value);
	}
};

/**
 * 最大移动伤害
 * Max slip damage
 *
 * @memberof Game_Battler
 * @method maxSlipDamage
 * @returns {number} 最大移动伤害 Maximum slip damage
 * @description 计算最大的滑移伤害（持续伤害）
 * Calculate the maximum slip damage (continuous damage)
 */
Game_Battler.prototype.maxSlipDamage = function () {
	return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};

/**
 * 自动恢复 MP
 * Regenerate MP
 *
 * @memberof Game_Battler
 * @method regenerateMp
 * @description 自动恢复MP
 * Automatically regenerate MP
 */
Game_Battler.prototype.regenerateMp = function () {
	var value = Math.floor(this.mmp * this.mrg);
	if (value !== 0) {
		this.gainMp(value);
	}
};

/**
 * 自动恢复 TP
 * Regenerate TP
 *
 * @memberof Game_Battler
 * @method regenerateTp
 * @description 自动恢复TP
 * Automatically regenerate TP
 */
Game_Battler.prototype.regenerateTp = function () {
	var value = Math.floor(100 * this.trg);
	this.gainSilentTp(value);
};

/**
 * 自动恢复所有
 * Regenerate all
 *
 * @memberof Game_Battler
 * @method regenerateAll
 * @description 自动恢复HP、MP、TP
 * Automatically regenerate HP, MP, and TP
 */
Game_Battler.prototype.regenerateAll = function () {
	if (this.isAlive()) {
		this.regenerateHp();
		this.regenerateMp();
		this.regenerateTp();
	}
};

/**
 * 当战斗开始
 * On battle start
 *
 * @memberof Game_Battler
 * @method onBattleStart
 * @description 战斗开始时的处理
 * Handle when battle starts
 */
Game_Battler.prototype.onBattleStart = function () {
	this.setActionState("undecided");
	this.clearMotion();
	if (!this.isPreserveTp()) {
		this.initTp();
	}
};

/**
 * 当所有行动结束
 * On all actions end
 *
 * @memberof Game_Battler
 * @method onAllActionsEnd
 * @description 所有行动结束时的处理
 * Handle when all actions end
 */
Game_Battler.prototype.onAllActionsEnd = function () {
	this.clearResult();
	this.removeStatesAuto(1);
	this.removeBuffsAuto();
};

/**
 * 当回合结束
 * On turn end
 *
 * @memberof Game_Battler
 * @method onTurnEnd
 * @description 回合结束时的处理
 * Handle when turn ends
 */
Game_Battler.prototype.onTurnEnd = function () {
	this.clearResult();
	this.regenerateAll();
	if (!BattleManager.isForcedTurn()) {
		this.updateStateTurns();
		this.updateBuffTurns();
	}
	this.removeStatesAuto(2);
};

/**
 * 当战斗结束
 * On battle end
 *
 * @memberof Game_Battler
 * @method onBattleEnd
 * @description 战斗结束时的处理
 * Handle when battle ends
 */
Game_Battler.prototype.onBattleEnd = function () {
	this.clearResult();
	this.removeBattleStates();
	this.removeAllBuffs();
	this.clearActions();
	if (!this.isPreserveTp()) {
		this.clearTp();
	}
	this.appear();
};

/**
 * 当受到伤害
 * On damage
 *
 * @memberof Game_Battler
 * @method onDamage
 * @param {number} value - 伤害值 Damage value
 * @description 受到伤害时的处理
 * Handle when taking damage
 */
Game_Battler.prototype.onDamage = function (value) {
	this.removeStatesByDamage();
	this.chargeTpByDamage(value / this.mhp);
};

/**
 * 设置行动状态
 * Set action state
 *
 * @memberof Game_Battler
 * @method setActionState
 * @param {string} actionState - 行动状态 Action state
 * @description 设置战斗者的行动状态
 * Set the battler's action state
 */
Game_Battler.prototype.setActionState = function (actionState) {
	this._actionState = actionState;
	this.requestMotionRefresh();
};

/**
 * 行动状态是否为未决定
 * Is undecided
 *
 * @memberof Game_Battler
 * @method isUndecided
 * @returns {boolean} 是否未决定行动 Whether action is undecided
 * @description 检查行动状态是否为未决定
 * Check if action state is undecided
 */
Game_Battler.prototype.isUndecided = function () {
	return this._actionState === "undecided";
};

/**
 * 行动状态是否为输入中
 * Is inputting
 *
 * @memberof Game_Battler
 * @method isInputting
 * @returns {boolean} 是否在输入中 Whether inputting
 * @description 检查行动状态是否为输入中
 * Check if action state is inputting
 */
Game_Battler.prototype.isInputting = function () {
	return this._actionState === "inputting";
};

/**
 * 行动状态是否为等待中
 * Is waiting
 *
 * @memberof Game_Battler
 * @method isWaiting
 * @returns {boolean} 是否在等待中 Whether waiting
 * @description 检查行动状态是否为等待中
 * Check if action state is waiting
 */
Game_Battler.prototype.isWaiting = function () {
	return this._actionState === "waiting";
};

/**
 * 行动状态是否为行动中
 * Is acting
 *
 * @memberof Game_Battler
 * @method isActing
 * @returns {boolean} 是否在行动中 Whether acting
 * @description 检查行动状态是否为行动中
 * Check if action state is acting
 */
Game_Battler.prototype.isActing = function () {
	return this._actionState === "acting";
};

/**
 * 是否为吟唱中
 * Is chanting
 *
 * @memberof Game_Battler
 * @method isChanting
 * @returns {boolean} 是否在吟唱 Whether chanting
 * @description 检查是否在吟唱魔法技能
 * Check if chanting a magic skill
 */
Game_Battler.prototype.isChanting = function () {
	if (this.isWaiting()) {
		return this._actions.some(function (action) {
			return action.isMagicSkill();
		});
	}
	return false;
};

/**
 * 是否防御等待中
 * Is guard waiting
 *
 * @memberof Game_Battler
 * @method isGuardWaiting
 * @returns {boolean} 是否在防御等待 Whether guard waiting
 * @description 检查是否在防御等待状态
 * Check if in guard waiting state
 */
Game_Battler.prototype.isGuardWaiting = function () {
	if (this.isWaiting()) {
		return this._actions.some(function (action) {
			return action.isGuard();
		});
	}
	return false;
};

/**
 * 表现行动开始
 * Perform action start
 *
 * @memberof Game_Battler
 * @method performActionStart
 * @param {Game_Action} action - 行动对象 Action object
 * @description 表现行动开始的效果
 * Perform the effects of action start
 */
Game_Battler.prototype.performActionStart = function (action) {
	if (!action.isGuard()) {
		this.setActionState("acting");
	}
};

/**
 * 表现行动
 * Perform action
 *
 * @memberof Game_Battler
 * @method performAction
 * @param {Game_Action} action - 行动对象 Action object
 * @description 表现行动的效果（子类中实现）
 * Perform the effects of the action (implemented in subclasses)
 */
Game_Battler.prototype.performAction = function (action) {};

/**
 * 表现行动结束
 * Perform action end
 *
 * @memberof Game_Battler
 * @method performActionEnd
 * @description 表现行动结束的效果
 * Perform the effects of action end
 */
Game_Battler.prototype.performActionEnd = function () {
	this.setActionState("done");
};

/**
 * 表现伤害
 * Perform damage
 *
 * @memberof Game_Battler
 * @method performDamage
 * @description 表现受到伤害的效果（子类中实现）
 * Perform the effects of taking damage (implemented in subclasses)
 */
Game_Battler.prototype.performDamage = function () {};

/**
 * 表现未命中
 * Perform miss
 *
 * @memberof Game_Battler
 * @method performMiss
 * @description 表现未命中的效果
 * Perform the effects of missing
 */
Game_Battler.prototype.performMiss = function () {
	SoundManager.playMiss();
};

/**
 * 表现恢复
 * Perform recovery
 *
 * @memberof Game_Battler
 * @method performRecovery
 * @description 表现恢复的效果
 * Perform the effects of recovery
 */
Game_Battler.prototype.performRecovery = function () {
	SoundManager.playRecovery();
};

/**
 * 表现闪避
 * Perform evasion
 *
 * @memberof Game_Battler
 * @method performEvasion
 * @description 表现物理闪避的效果
 * Perform the effects of physical evasion
 */
Game_Battler.prototype.performEvasion = function () {
	SoundManager.playEvasion();
};

/**
 * 表现魔法闪避
 * Perform magic evasion
 *
 * @memberof Game_Battler
 * @method performMagicEvasion
 * @description 表现魔法闪避的效果
 * Perform the effects of magic evasion
 */
Game_Battler.prototype.performMagicEvasion = function () {
	SoundManager.playMagicEvasion();
};

/**
 * 表现反击
 * Perform counter
 *
 * @memberof Game_Battler
 * @method performCounter
 * @description 表现反击的效果
 * Perform the effects of counter attack
 */
Game_Battler.prototype.performCounter = function () {
	SoundManager.playEvasion();
};

/**
 * 表现反射
 * Perform reflection
 *
 * @memberof Game_Battler
 * @method performReflection
 * @description 表现技能反射的效果
 * Perform the effects of skill reflection
 */
Game_Battler.prototype.performReflection = function () {
	SoundManager.playReflection();
};

/**
 * 表现掩护
 * Perform substitute
 *
 * @memberof Game_Battler
 * @method performSubstitute
 * @param {Game_Battler} target - 目标战斗者 Target battler
 * @description 表现掩护的效果（子类中实现）
 * Perform the effects of substitution (implemented in subclasses)
 */
Game_Battler.prototype.performSubstitute = function (target) {};

/**
 * 表现倒下（死亡后的消失效果）
 * Perform collapse (disappearance effect after death)
 *
 * @memberof Game_Battler
 * @method performCollapse
 * @description 表现倒下的效果（子类中实现）
 * Perform the effects of collapse (implemented in subclasses)
 */
Game_Battler.prototype.performCollapse = function () {};
