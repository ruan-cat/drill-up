/**
 * @fileoverview Game_BattlerBase - 游戏战斗基础对象类
 * @description Game_Battler的父类，主要包括能力值计算和战斗相关的基础功能
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_战斗基础
 * Game_BattlerBase
 *
 * Game_Battler的父类。它主要包括能力值计算。
 * The superclass of Game_Battler. It mainly contains parameters calculation.
 *
 * @class Game_BattlerBase
 * @constructor
 * @description 战斗者基础类，包含所有战斗相关的基础属性、特性和能力值计算
 */
function Game_BattlerBase() {
	this.initialize.apply(this, arguments);
}

/**
 * 特性 - 属性有效度
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_ELEMENT_RATE = 11;

/**
 * 特性 - 弱化有效度
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_DEBUFF_RATE = 12;

/**
 * 特性 - 状态有效度
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_STATE_RATE = 13;

/**
 * 特性 - 状态免疫
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_STATE_RESIST = 14;

/**
 * 特性 - 通常能力值
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_PARAM = 21;

/**
 * 特性 - 追加能力值
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_XPARAM = 22;

/**
 * 特性 - 特殊能力值
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_SPARAM = 23;

/**
 * 特性 - 攻击时属性
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;

/**
 * 特性 - 攻击时状态
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_ATTACK_STATE = 32;

/**
 * 特性 - 攻击时速度补正
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_ATTACK_SPEED = 33;

/**
 * 特性 - 攻击追加次数
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_ATTACK_TIMES = 34;

/**
 * 特性 - 添加技能类型
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_STYPE_ADD = 41;

/**
 * 特性 - 封印技能类型
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_STYPE_SEAL = 42;

/**
 * 特性 - 添加技能
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_SKILL_ADD = 43;

/**
 * 特性 - 封印技能
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_SKILL_SEAL = 44;

/**
 * 特性 - 装备武器类型
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_EQUIP_WTYPE = 51;

/**
 * 特性 - 装备护甲类型
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_EQUIP_ATYPE = 52;

/**
 * 特性 - 固定装备
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_EQUIP_LOCK = 53;

/**
 * 特性 - 封印装备
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_EQUIP_SEAL = 54;

/**
 * 特性 - 装备槽类型
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_SLOT_TYPE = 55;

/**
 * 特性 - 增加行动次数
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_ACTION_PLUS = 61;

/**
 * 特性 - 特殊标志
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_SPECIAL_FLAG = 62;

/**
 * 特性 - 消失效果
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_COLLAPSE_TYPE = 63;

/**
 * 特性 - 队伍能力
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.TRAIT_PARTY_ABILITY = 64;

/**
 * 特殊标志 - 自动战斗
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.FLAG_ID_AUTO_BATTLE = 0;

/**
 * 特殊标志 - 防御
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.FLAG_ID_GUARD = 1;

/**
 * 特殊标志 - 掩护
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.FLAG_ID_SUBSTITUTE = 2;

/**
 * 特殊标志 - 保留 TP
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.FLAG_ID_PRESERVE_TP = 3;

/**
 * 强化状态图标起始索引
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.ICON_BUFF_START = 32;

/**
 * 弱化状态图标起始索引
 * @static
 * @memberof Game_BattlerBase
 * @type {number}
 */
Game_BattlerBase.ICON_DEBUFF_START = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
	/**
	 * 生命值（Hit Points）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	hp: {
		get: function () {
			return this._hp;
		},
		configurable: true,
	},

	/**
	 * 魔法值（Magic Points）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mp: {
		get: function () {
			return this._mp;
		},
		configurable: true,
	},

	/**
	 * 怒气值（Tactical Points）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	tp: {
		get: function () {
			return this._tp;
		},
		configurable: true,
	},

	/**
	 * 最大生命值（Maximum Hit Points）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mhp: {
		get: function () {
			return this.param(0);
		},
		configurable: true,
	},

	/**
	 * 最大魔法值（Maximum Magic Points）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mmp: {
		get: function () {
			return this.param(1);
		},
		configurable: true,
	},

	/**
	 * 攻击力（ATtacK power）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	atk: {
		get: function () {
			return this.param(2);
		},
		configurable: true,
	},

	/**
	 * 防御力（DEFense power）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	def: {
		get: function () {
			return this.param(3);
		},
		configurable: true,
	},

	/**
	 * 魔法攻击（Magic ATtack power）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mat: {
		get: function () {
			return this.param(4);
		},
		configurable: true,
	},

	/**
	 * 魔法防御（Magic DeFense power）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mdf: {
		get: function () {
			return this.param(5);
		},
		configurable: true,
	},

	/**
	 * 敏捷（AGIlity）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	agi: {
		get: function () {
			return this.param(6);
		},
		configurable: true,
	},

	/**
	 * 运气（LUcK）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	luk: {
		get: function () {
			return this.param(7);
		},
		configurable: true,
	},

	/**
	 * 命中率（HIT rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	hit: {
		get: function () {
			return this.xparam(0);
		},
		configurable: true,
	},

	/**
	 * 回避率（EVAsion rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	eva: {
		get: function () {
			return this.xparam(1);
		},
		configurable: true,
	},

	/**
	 * 暴击率（CRItical rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	cri: {
		get: function () {
			return this.xparam(2);
		},
		configurable: true,
	},

	/**
	 * 暴击回避（Critical EVasion rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	cev: {
		get: function () {
			return this.xparam(3);
		},
		configurable: true,
	},

	/**
	 * 魔法回避（Magic EVasion rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mev: {
		get: function () {
			return this.xparam(4);
		},
		configurable: true,
	},

	/**
	 * 魔法反射（Magic ReFlection rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mrf: {
		get: function () {
			return this.xparam(5);
		},
		configurable: true,
	},

	/**
	 * 反击（CouNTer attack rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	cnt: {
		get: function () {
			return this.xparam(6);
		},
		configurable: true,
	},

	/**
	 * HP 自动恢复（Hp ReGeneration rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	hrg: {
		get: function () {
			return this.xparam(7);
		},
		configurable: true,
	},

	/**
	 * MP 自动恢复（Mp ReGeneration rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mrg: {
		get: function () {
			return this.xparam(8);
		},
		configurable: true,
	},

	/**
	 * TP 自动恢复（Tp ReGeneration rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	trg: {
		get: function () {
			return this.xparam(9);
		},
		configurable: true,
	},

	/**
	 * 受到攻击几率（TarGet Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	tgr: {
		get: function () {
			return this.sparam(0);
		},
		configurable: true,
	},

	/**
	 * 防御效果（GuaRD effect rate），影响防御时的伤害，伤害为1/(2*grd)
	 * Guard effect rate, affects damage when defending, damage is 1/(2*grd)
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	grd: {
		get: function () {
			return this.sparam(1);
		},
		configurable: true,
	},

	/**
	 * 恢复效果（RECovery effect rate），影响恢复HP和MP的百分比（取决于被治疗者，物品技能皆有效）
	 * Recovery effect rate, affects HP and MP recovery percentage (depends on the target, effective for both items and skills)
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	rec: {
		get: function () {
			return this.sparam(2);
		},
		configurable: true,
	},

	/**
	 * 药理知识（PHArmacology），影响使用物品时恢复HP和MP的百分比（取决于使用者，技能无效）
	 * Pharmacology, affects HP and MP recovery percentage when using items (depends on user, skills are not affected)
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	pha: {
		get: function () {
			return this.sparam(3);
		},
		configurable: true,
	},

	/**
	 * MP 消耗量（Mp Cost Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mcr: {
		get: function () {
			return this.sparam(4);
		},
		configurable: true,
	},

	/**
	 * TP 补充率（Tp Charge Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	tcr: {
		get: function () {
			return this.sparam(5);
		},
		configurable: true,
	},

	/**
	 * 物理伤害（Physical Damage Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	pdr: {
		get: function () {
			return this.sparam(6);
		},
		configurable: true,
	},

	/**
	 * 魔法伤害（Magical Damage Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	mdr: {
		get: function () {
			return this.sparam(7);
		},
		configurable: true,
	},

	/**
	 * 地形伤害（Floor Damage Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	fdr: {
		get: function () {
			return this.sparam(8);
		},
		configurable: true,
	},

	/**
	 * 经验值（EXperience Rate）
	 * @memberof Game_BattlerBase
	 * @type {number}
	 * @readonly
	 */
	exr: {
		get: function () {
			return this.sparam(9);
		},
		configurable: true,
	},
});

/**
 * 初始化
 * Initialize the Game_BattlerBase object
 *
 * @memberof Game_BattlerBase
 * @description 初始化战斗者基础对象，设置初始成员变量
 */
Game_BattlerBase.prototype.initialize = function () {
	this.initMembers();
};

/**
 * 初始化成员
 * Initialize member variables
 *
 * @memberof Game_BattlerBase
 * @description 初始化所有成员变量，包括HP、MP、TP和状态数据
 */
Game_BattlerBase.prototype.initMembers = function () {
	this._hp = 1;
	this._mp = 0;
	this._tp = 0;
	this._hidden = false;
	this.clearParamPlus();
	this.clearStates();
	this.clearBuffs();
};

/**
 * 清除增加的能力值
 * Clear parameter plus values
 *
 * @memberof Game_BattlerBase
 * @description 清除所有通过装备或技能增加的能力值修正
 */
Game_BattlerBase.prototype.clearParamPlus = function () {
	this._paramPlus = [0, 0, 0, 0, 0, 0, 0, 0];
};

/**
 * 清除状态
 * Clear all states
 *
 * @memberof Game_BattlerBase
 * @description 清除所有状态异常和状态持续回合数
 */
Game_BattlerBase.prototype.clearStates = function () {
	this._states = [];
	this._stateTurns = {};
};

/**
 * 消除该状态
 * Erase a specific state
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @description 从状态列表中移除指定的状态
 */
Game_BattlerBase.prototype.eraseState = function (stateId) {
	var index = this._states.indexOf(stateId);
	if (index >= 0) {
		this._states.splice(index, 1);
	}
	delete this._stateTurns[stateId];
};

/**
 * 是否受该状态影响
 * Check if affected by a specific state
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @returns {boolean} 是否受该状态影响
 * @description 检查当前是否受指定状态的影响
 */
Game_BattlerBase.prototype.isStateAffected = function (stateId) {
	return this._states.contains(stateId);
};

/**
 * 是否受无法战斗状态影响
 * Check if affected by death state
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否处于死亡状态
 * @description 检查是否处于无法战斗（死亡）状态
 */
Game_BattlerBase.prototype.isDeathStateAffected = function () {
	return this.isStateAffected(this.deathStateId());
};

/**
 * 无法战斗状态ID
 * Get death state ID
 *
 * @memberof Game_BattlerBase
 * @returns {number} 死亡状态的ID
 * @description 返回死亡状态的ID，默认为1
 */
Game_BattlerBase.prototype.deathStateId = function () {
	return 1;
};

/**
 * 重置状态计数
 * Reset state turn count
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @description 重新设置指定状态的持续回合数
 */
Game_BattlerBase.prototype.resetStateCounts = function (stateId) {
	var state = $dataStates[stateId];
	var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
	this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};

/**
 * 该状态是否失效
 * Check if state is expired
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @returns {boolean} 状态是否已失效
 * @description 检查指定状态的持续时间是否已结束
 */
Game_BattlerBase.prototype.isStateExpired = function (stateId) {
	return this._stateTurns[stateId] === 0;
};

/**
 * 更新状态回合
 * Update state turns
 *
 * @memberof Game_BattlerBase
 * @description 减少所有状态的剩余持续回合数
 */
Game_BattlerBase.prototype.updateStateTurns = function () {
	this._states.forEach(function (stateId) {
		if (this._stateTurns[stateId] > 0) {
			this._stateTurns[stateId]--;
		}
	}, this);
};

/**
 * 清除强化效果
 * Clear all buffs
 *
 * @memberof Game_BattlerBase
 * @description 清除所有能力值强化和弱化效果
 */
Game_BattlerBase.prototype.clearBuffs = function () {
	this._buffs = [0, 0, 0, 0, 0, 0, 0, 0];
	this._buffTurns = [0, 0, 0, 0, 0, 0, 0, 0];
};

/**
 * 消除该强化效果
 * Erase a specific buff
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @description 移除指定能力值的强化或弱化效果
 */
Game_BattlerBase.prototype.eraseBuff = function (paramId) {
	this._buffs[paramId] = 0;
	this._buffTurns[paramId] = 0;
};

/**
 * 强化效果个数
 * Get buff array length
 *
 * @memberof Game_BattlerBase
 * @returns {number} 强化效果数组的长度
 * @description 返回强化效果数组的长度
 */
Game_BattlerBase.prototype.buffLength = function () {
	return this._buffs.length;
};

/**
 * 强化效果
 * Get buff level
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 强化等级（-2到2）
 * @description 获取指定能力值的强化等级
 */
Game_BattlerBase.prototype.buff = function (paramId) {
	return this._buffs[paramId];
};

/**
 * 是否受该强化效果影响
 * Check if affected by buff
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {boolean} 是否受强化影响
 * @description 检查指定能力值是否受到强化效果影响
 */
Game_BattlerBase.prototype.isBuffAffected = function (paramId) {
	return this._buffs[paramId] > 0;
};

/**
 * 是否受该弱化效果影响
 * Check if affected by debuff
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {boolean} 是否受弱化影响
 * @description 检查指定能力值是否受到弱化效果影响
 */
Game_BattlerBase.prototype.isDebuffAffected = function (paramId) {
	return this._buffs[paramId] < 0;
};

/**
 * 是否受该强化或弱化效果影响
 * Check if affected by buff or debuff
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {boolean} 是否受强化或弱化影响
 * @description 检查指定能力值是否受到强化或弱化效果影响
 */
Game_BattlerBase.prototype.isBuffOrDebuffAffected = function (paramId) {
	return this._buffs[paramId] !== 0;
};

/**
 * 该受影响的强化效果是否达到最大级数
 * Check if buff is at maximum level
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {boolean} 强化是否达到最大等级
 * @description 检查强化效果是否已达到最大等级（2级）
 */
Game_BattlerBase.prototype.isMaxBuffAffected = function (paramId) {
	return this._buffs[paramId] === 2;
};

/**
 * 该受影响的弱化效果是否达到最大级数
 * Check if debuff is at maximum level
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {boolean} 弱化是否达到最大等级
 * @description 检查弱化效果是否已达到最大等级（-2级）
 */
Game_BattlerBase.prototype.isMaxDebuffAffected = function (paramId) {
	return this._buffs[paramId] === -2;
};

/**
 * 增加强化效果级数
 * Increase buff level
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @description 增加指定能力值的强化等级，最大为2级
 */
Game_BattlerBase.prototype.increaseBuff = function (paramId) {
	if (!this.isMaxBuffAffected(paramId)) {
		this._buffs[paramId]++;
	}
};

/**
 * 减少强化效果级数
 * Decrease buff level
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @description 减少指定能力值的强化等级，最小为-2级
 */
Game_BattlerBase.prototype.decreaseBuff = function (paramId) {
	if (!this.isMaxDebuffAffected(paramId)) {
		this._buffs[paramId]--;
	}
};

/**
 * 重写强化效果回合数
 * Overwrite buff turns
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @param {number} turns - 持续回合数
 * @description 设置强化效果的持续回合数，只有在新回合数更大时才设置
 */
Game_BattlerBase.prototype.overwriteBuffTurns = function (paramId, turns) {
	if (this._buffTurns[paramId] < turns) {
		this._buffTurns[paramId] = turns;
	}
};

/**
 * 该强化效果是否失效
 * Check if buff is expired
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {boolean} 强化效果是否已失效
 * @description 检查强化效果的持续时间是否已结束
 */
Game_BattlerBase.prototype.isBuffExpired = function (paramId) {
	return this._buffTurns[paramId] === 0;
};

/**
 * 更新强化效果回合数
 * Update buff turns
 *
 * @memberof Game_BattlerBase
 * @description 减少所有强化效果的剩余持续回合数
 */
Game_BattlerBase.prototype.updateBuffTurns = function () {
	for (var i = 0; i < this._buffTurns.length; i++) {
		if (this._buffTurns[i] > 0) {
			this._buffTurns[i]--;
		}
	}
};

/**
 * 死亡
 * Die
 *
 * @memberof Game_BattlerBase
 * @description 设置角色死亡状态，清除所有状态和强化效果
 */
Game_BattlerBase.prototype.die = function () {
	this._hp = 0;
	this.clearStates();
	this.clearBuffs();
};

/**
 * 复活
 * Revive
 *
 * @memberof Game_BattlerBase
 * @description 如果角色已死亡，则将HP设为1进行复活
 */
Game_BattlerBase.prototype.revive = function () {
	if (this._hp === 0) {
		this._hp = 1;
	}
};

/**
 * 状态
 * Get states array
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 状态对象数组
 * @description 返回当前所有生效状态的数据对象数组
 */
Game_BattlerBase.prototype.states = function () {
	return this._states.map(function (id) {
		return $dataStates[id];
	});
};

/**
 * 状态图标
 * Get state icons
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 状态图标索引数组
 * @description 返回所有状态的图标索引数组，过滤掉无效图标
 */
Game_BattlerBase.prototype.stateIcons = function () {
	return this.states()
		.map(function (state) {
			return state.iconIndex;
		})
		.filter(function (iconIndex) {
			return iconIndex > 0;
		});
};

/**
 * 强化效果图标
 * Get buff icons
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 强化效果图标索引数组
 * @description 返回所有强化和弱化效果的图标索引数组
 */
Game_BattlerBase.prototype.buffIcons = function () {
	var icons = [];
	for (var i = 0; i < this._buffs.length; i++) {
		if (this._buffs[i] !== 0) {
			icons.push(this.buffIconIndex(this._buffs[i], i));
		}
	}
	return icons;
};

/**
 * 强化效果图标索引
 * Get buff icon index
 *
 * @memberof Game_BattlerBase
 * @param {number} buffLevel - 强化等级（-2到2）
 * @param {number} paramId - 能力值ID
 * @returns {number} 图标索引
 * @description 根据强化等级和能力值ID计算对应的图标索引
 */
Game_BattlerBase.prototype.buffIconIndex = function (buffLevel, paramId) {
	if (buffLevel > 0) {
		return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
	} else if (buffLevel < 0) {
		return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
	} else {
		return 0;
	}
};

/**
 * 所有图标
 * Get all icons
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 所有图标索引数组
 * @description 返回状态图标和强化效果图标的合并数组
 */
Game_BattlerBase.prototype.allIcons = function () {
	return this.stateIcons().concat(this.buffIcons());
};

/**
 * 特征对象
 * Get trait objects
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 具有特征的对象数组
 * @description 返回所有具有特征的对象数组，基础类只返回状态
 */
Game_BattlerBase.prototype.traitObjects = function () {
	return this.states();
};

/**
 * 所有特征
 * Get all traits
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 所有特征数组
 * @description 返回所有特征对象的特征数据合并数组
 */
Game_BattlerBase.prototype.allTraits = function () {
	return this.traitObjects().reduce(function (r, obj) {
		return r.concat(obj.traits);
	}, []);
};

/**
 * 特征
 * Get traits by code
 *
 * @memberof Game_BattlerBase
 * @param {number} code - 特征代码
 * @returns {Array} 指定代码的特征数组
 * @description 返回指定特征代码的所有特征
 */
Game_BattlerBase.prototype.traits = function (code) {
	return this.allTraits().filter(function (trait) {
		return trait.code === code;
	});
};

/**
 * 根据ID获取特征
 * Get traits by code and ID
 *
 * @memberof Game_BattlerBase
 * @param {number} code - 特征代码
 * @param {number} id - 数据ID
 * @returns {Array} 匹配条件的特征数组
 * @description 返回指定特征代码和数据ID的所有特征
 */
Game_BattlerBase.prototype.traitsWithId = function (code, id) {
	return this.allTraits().filter(function (trait) {
		return trait.code === code && trait.dataId === id;
	});
};

/**
 * 特征值求积
 * Calculate traits product
 *
 * @memberof Game_BattlerBase
 * @param {number} code - 特征代码
 * @param {number} id - 数据ID
 * @returns {number} 特征值的乘积
 * @description 计算指定特征的所有值的乘积
 */
Game_BattlerBase.prototype.traitsPi = function (code, id) {
	return this.traitsWithId(code, id).reduce(function (r, trait) {
		return r * trait.value;
	}, 1);
};

/**
 * 特征值求和
 * Calculate traits sum
 *
 * @memberof Game_BattlerBase
 * @param {number} code - 特征代码
 * @param {number} id - 数据ID
 * @returns {number} 特征值的总和
 * @description 计算指定特征的所有值的总和
 */
Game_BattlerBase.prototype.traitsSum = function (code, id) {
	return this.traitsWithId(code, id).reduce(function (r, trait) {
		return r + trait.value;
	}, 0);
};

/**
 * 所有特征值求和
 * Calculate all traits sum
 *
 * @memberof Game_BattlerBase
 * @param {number} code - 特征代码
 * @returns {number} 所有特征值的总和
 * @description 计算指定特征代码的所有特征值的总和
 */
Game_BattlerBase.prototype.traitsSumAll = function (code) {
	return this.traits(code).reduce(function (r, trait) {
		return r + trait.value;
	}, 0);
};

/**
 * 特征设置
 * Get traits data ID set
 *
 * @memberof Game_BattlerBase
 * @param {number} code - 特征代码
 * @returns {Array} 特征数据ID数组
 * @description 返回指定特征代码的所有数据ID数组
 */
Game_BattlerBase.prototype.traitsSet = function (code) {
	return this.traits(code).reduce(function (r, trait) {
		return r.concat(trait.dataId);
	}, []);
};

/**
 * 基础能力值
 * Get base parameter
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 基础能力值
 * @description 获取指定能力值的基础数值，基础类返回0
 */
Game_BattlerBase.prototype.paramBase = function (paramId) {
	return 0;
};

/**
 * 增加的能力值
 * Get parameter plus
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 增加的能力值
 * @description 获取通过装备或技能增加的能力值
 */
Game_BattlerBase.prototype.paramPlus = function (paramId) {
	return this._paramPlus[paramId];
};

/**
 * 能力值最小值
 * Get parameter minimum
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 能力值最小值
 * @description 获取指定能力值的最小限制值
 */
Game_BattlerBase.prototype.paramMin = function (paramId) {
	if (paramId === 1) {
		return 0; // MMP
	} else {
		return 1;
	}
};

/**
 * 能力值最大值
 * Get parameter maximum
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 能力值最大值
 * @description 获取指定能力值的最大限制值
 */
Game_BattlerBase.prototype.paramMax = function (paramId) {
	if (paramId === 0) {
		return 999999; // MHP
	} else if (paramId === 1) {
		return 9999; // MMP
	} else {
		return 999;
	}
};

/**
 * 能力值变化率
 * Get parameter rate
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 能力值倍率
 * @description 获取特征影响的能力值倍率
 */
Game_BattlerBase.prototype.paramRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};

/**
 * 能力值强化倍率
 * Get parameter buff rate
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 强化倍率
 * @description 获取强化效果影响的能力值倍率
 */
Game_BattlerBase.prototype.paramBuffRate = function (paramId) {
	return this._buffs[paramId] * 0.25 + 1.0;
};

/**
 * 能力值（各种加成计算后的最终值）
 * Get final parameter value
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 最终能力值
 * @description 计算包含基础值、增加值、特征倍率、强化倍率的最终能力值
 */
Game_BattlerBase.prototype.param = function (paramId) {
	var value = this.paramBase(paramId) + this.paramPlus(paramId);
	value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
	var maxValue = this.paramMax(paramId);
	var minValue = this.paramMin(paramId);
	return Math.round(value.clamp(minValue, maxValue));
};

/**
 * 追加能力值
 * Get extra parameter
 *
 * @memberof Game_BattlerBase
 * @param {number} xparamId - 追加能力值ID
 * @returns {number} 追加能力值
 * @description 获取指定追加能力值（命中率、回避率等）
 */
Game_BattlerBase.prototype.xparam = function (xparamId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

/**
 * 特殊能力值
 * Get special parameter
 *
 * @memberof Game_BattlerBase
 * @param {number} sparamId - 特殊能力值ID
 * @returns {number} 特殊能力值
 * @description 获取指定特殊能力值（经验获得率、伤害率等）
 */
Game_BattlerBase.prototype.sparam = function (sparamId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

/**
 * 属性有效度
 * Get element rate
 *
 * @memberof Game_BattlerBase
 * @param {number} elementId - 属性ID
 * @returns {number} 属性有效度
 * @description 获取指定属性的有效度（抗性）
 */
Game_BattlerBase.prototype.elementRate = function (elementId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

/**
 * 弱化有效度
 * Get debuff rate
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @returns {number} 弱化有效度
 * @description 获取指定能力值的弱化抗性
 */
Game_BattlerBase.prototype.debuffRate = function (paramId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};

/**
 * 状态有效度
 * Get state rate
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @returns {number} 状态有效度
 * @description 获取指定状态的有效度（抗性）
 */
Game_BattlerBase.prototype.stateRate = function (stateId) {
	return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

/**
 * 状态免疫设置
 * Get state resist set
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 免疫状态ID数组
 * @description 获取所有免疫的状态ID数组
 */
Game_BattlerBase.prototype.stateResistSet = function () {
	return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};

/**
 * 是否免疫该状态
 * Check if state is resisted
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @returns {boolean} 是否免疫该状态
 * @description 检查是否对指定状态免疫
 */
Game_BattlerBase.prototype.isStateResist = function (stateId) {
	return this.stateResistSet().contains(stateId);
};

/**
 * 攻击时属性
 * Get attack elements
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 攻击属性ID数组
 * @description 获取攻击时附带的所有属性ID
 */
Game_BattlerBase.prototype.attackElements = function () {
	return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

/**
 * 攻击时状态
 * Get attack states
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 攻击状态ID数组
 * @description 获取攻击时可能施加的所有状态ID
 */
Game_BattlerBase.prototype.attackStates = function () {
	return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

/**
 * 攻击时状态有效度
 * Get attack state rate
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @returns {number} 攻击时状态施加几率
 * @description 获取攻击时施加指定状态的几率
 */
Game_BattlerBase.prototype.attackStatesRate = function (stateId) {
	return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

/**
 * 攻击时速度补正
 * Get attack speed
 *
 * @memberof Game_BattlerBase
 * @returns {number} 攻击速度补正
 * @description 获取攻击时的速度补正值
 */
Game_BattlerBase.prototype.attackSpeed = function () {
	return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

/**
 * 攻击追加次数
 * Get additional attack times
 *
 * @memberof Game_BattlerBase
 * @returns {number} 追加攻击次数
 * @description 获取攻击时的额外攻击次数
 */
Game_BattlerBase.prototype.attackTimesAdd = function () {
	return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

/**
 * 添加的技能类型
 * Get added skill types
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 添加的技能类型ID数组
 * @description 获取通过特征添加的所有技能类型ID
 */
Game_BattlerBase.prototype.addedSkillTypes = function () {
	return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};

/**
 * 是否被封印的技能类型
 * Check if skill type is sealed
 *
 * @memberof Game_BattlerBase
 * @param {number} stypeId - 技能类型ID
 * @returns {boolean} 技能类型是否被封印
 * @description 检查指定技能类型是否被封印无法使用
 */
Game_BattlerBase.prototype.isSkillTypeSealed = function (stypeId) {
	return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};

/**
 * 添加的技能
 * Get added skills
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 添加的技能ID数组
 * @description 获取通过特征添加的所有技能ID
 */
Game_BattlerBase.prototype.addedSkills = function () {
	return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};

/**
 * 是否被封印该技能
 * Check if skill is sealed
 *
 * @memberof Game_BattlerBase
 * @param {number} skillId - 技能ID
 * @returns {boolean} 技能是否被封印
 * @description 检查指定技能是否被封印无法使用
 */
Game_BattlerBase.prototype.isSkillSealed = function (skillId) {
	return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};

/**
 * 是否允许装备该武器类型
 * Check if weapon type can be equipped
 *
 * @memberof Game_BattlerBase
 * @param {number} wtypeId - 武器类型ID
 * @returns {boolean} 是否可装备该武器类型
 * @description 检查是否允许装备指定类型的武器
 */
Game_BattlerBase.prototype.isEquipWtypeOk = function (wtypeId) {
	return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};

/**
 * 是否允许装备该护甲类型
 * Check if armor type can be equipped
 *
 * @memberof Game_BattlerBase
 * @param {number} atypeId - 护甲类型ID
 * @returns {boolean} 是否可装备该护甲类型
 * @description 检查是否允许装备指定类型的护甲
 */
Game_BattlerBase.prototype.isEquipAtypeOk = function (atypeId) {
	return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};

/**
 * 是否固定该部位的装备
 * Check if equipment type is locked
 *
 * @memberof Game_BattlerBase
 * @param {number} etypeId - 装备类型ID
 * @returns {boolean} 该部位装备是否被固定
 * @description 检查指定装备部位是否被锁定无法更换
 */
Game_BattlerBase.prototype.isEquipTypeLocked = function (etypeId) {
	return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};

/**
 * 是否封印该部位的装备
 * Check if equipment type is sealed
 *
 * @memberof Game_BattlerBase
 * @param {number} etypeId - 装备类型ID
 * @returns {boolean} 该部位装备是否被封印
 * @description 检查指定装备部位是否被封印无法装备
 */
Game_BattlerBase.prototype.isEquipTypeSealed = function (etypeId) {
	return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};

/**
 * 装备槽类型
 * Get slot type
 *
 * @memberof Game_BattlerBase
 * @returns {number} 装备槽类型
 * @description 获取装备槽的类型，决定是否为二刀流
 */
Game_BattlerBase.prototype.slotType = function () {
	var set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
	return set.length > 0 ? Math.max.apply(null, set) : 0;
};

/**
 * 是否二刀流
 * Check if dual wield
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否为二刀流
 * @description 检查是否为二刀流装备方式
 */
Game_BattlerBase.prototype.isDualWield = function () {
	return this.slotType() === 1;
};

/**
 * 增加行动次数设置
 * Get action plus set
 *
 * @memberof Game_BattlerBase
 * @returns {Array} 行动次数增加值数组
 * @description 获取所有增加行动次数的特征值
 */
Game_BattlerBase.prototype.actionPlusSet = function () {
	return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function (trait) {
		return trait.value;
	});
};

/**
 * 是否有该特殊标志
 * Check if has special flag
 *
 * @memberof Game_BattlerBase
 * @param {number} flagId - 特殊标志ID
 * @returns {boolean} 是否拥有该特殊标志
 * @description 检查是否拥有指定的特殊标志
 */
Game_BattlerBase.prototype.specialFlag = function (flagId) {
	return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function (trait) {
		return trait.dataId === flagId;
	});
};

/**
 * 消失效果类型
 * Get collapse type
 *
 * @memberof Game_BattlerBase
 * @returns {number} 消失效果类型
 * @description 获取角色死亡时的消失效果类型
 */
Game_BattlerBase.prototype.collapseType = function () {
	var set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
	return set.length > 0 ? Math.max.apply(null, set) : 0;
};

/**
 * 是否有该队伍能力
 * Check if has party ability
 *
 * @memberof Game_BattlerBase
 * @param {number} abilityId - 队伍能力ID
 * @returns {boolean} 是否拥有该队伍能力
 * @description 检查是否拥有指定的队伍能力
 */
Game_BattlerBase.prototype.partyAbility = function (abilityId) {
	return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function (trait) {
		return trait.dataId === abilityId;
	});
};

/**
 * 是否自动战斗
 * Check if auto battle
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否为自动战斗
 * @description 检查是否处于自动战斗状态
 */
Game_BattlerBase.prototype.isAutoBattle = function () {
	return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

/**
 * 是否防御
 * Check if guarding
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否处于防御状态
 * @description 检查是否处于防御状态且能够移动
 */
Game_BattlerBase.prototype.isGuard = function () {
	return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

/**
 * 是否掩护
 * Check if substitute
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否处于掩护状态
 * @description 检查是否处于掩护状态且能够移动
 */
Game_BattlerBase.prototype.isSubstitute = function () {
	return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};

/**
 * 是否保留TP
 * Check if preserve TP
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否保留TP
 * @description 检查战斗结束后是否保留TP值
 */
Game_BattlerBase.prototype.isPreserveTp = function () {
	return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

/**
 * 增加能力值
 * Add parameter
 *
 * @memberof Game_BattlerBase
 * @param {number} paramId - 能力值ID
 * @param {number} value - 增加的数值
 * @description 增加指定能力值的数值并刷新状态
 */
Game_BattlerBase.prototype.addParam = function (paramId, value) {
	this._paramPlus[paramId] += value;
	this.refresh();
};

/**
 * 设置HP
 * Set HP
 *
 * @memberof Game_BattlerBase
 * @param {number} hp - HP值
 * @description 设置当前HP值并刷新状态
 */
Game_BattlerBase.prototype.setHp = function (hp) {
	this._hp = hp;
	this.refresh();
};

/**
 * 设置MP
 * Set MP
 *
 * @memberof Game_BattlerBase
 * @param {number} mp - MP值
 * @description 设置当前MP值并刷新状态
 */
Game_BattlerBase.prototype.setMp = function (mp) {
	this._mp = mp;
	this.refresh();
};

/**
 * 设置TP
 * Set TP
 *
 * @memberof Game_BattlerBase
 * @param {number} tp - TP值
 * @description 设置当前TP值并刷新状态
 */
Game_BattlerBase.prototype.setTp = function (tp) {
	this._tp = tp;
	this.refresh();
};

/**
 * TP最大值
 * Get maximum TP
 *
 * @memberof Game_BattlerBase
 * @returns {number} TP最大值
 * @description 获取TP的最大值，默认为100
 */
Game_BattlerBase.prototype.maxTp = function () {
	return 100;
};

/**
 * 刷新
 * Refresh battler
 *
 * @memberof Game_BattlerBase
 * @description 刷新战斗者状态，清除免疫状态并限制数值范围
 */
Game_BattlerBase.prototype.refresh = function () {
	this.stateResistSet().forEach(function (stateId) {
		this.eraseState(stateId);
	}, this);
	this._hp = this._hp.clamp(0, this.mhp);
	this._mp = this._mp.clamp(0, this.mmp);
	this._tp = this._tp.clamp(0, this.maxTp());
};

/**
 * 恢复全部
 * Recover all
 *
 * @memberof Game_BattlerBase
 * @description 恢复所有HP和MP，清除所有状态异常
 */
Game_BattlerBase.prototype.recoverAll = function () {
	this.clearStates();
	this._hp = this.mhp;
	this._mp = this.mmp;
};

/**
 * HP比例
 * Get HP rate
 *
 * @memberof Game_BattlerBase
 * @returns {number} HP比例（0-1）
 * @description 获取当前HP占最大HP的比例
 */
Game_BattlerBase.prototype.hpRate = function () {
	return this.hp / this.mhp;
};

/**
 * MP比例
 * Get MP rate
 *
 * @memberof Game_BattlerBase
 * @returns {number} MP比例（0-1）
 * @description 获取当前MP占最大MP的比例
 */
Game_BattlerBase.prototype.mpRate = function () {
	return this.mmp > 0 ? this.mp / this.mmp : 0;
};

/**
 * TP比例
 * Get TP rate
 *
 * @memberof Game_BattlerBase
 * @returns {number} TP比例（0-1）
 * @description 获取当前TP占最大TP的比例
 */
Game_BattlerBase.prototype.tpRate = function () {
	return this.tp / this.maxTp();
};

/**
 * 隐藏
 * Hide battler
 *
 * @memberof Game_BattlerBase
 * @description 隐藏战斗者，使其不可见
 */
Game_BattlerBase.prototype.hide = function () {
	this._hidden = true;
};

/**
 * 出现
 * Show battler
 *
 * @memberof Game_BattlerBase
 * @description 显示战斗者，使其可见
 */
Game_BattlerBase.prototype.appear = function () {
	this._hidden = false;
};

/**
 * 是否隐藏
 * Check if hidden
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否隐藏
 * @description 检查战斗者是否处于隐藏状态
 */
Game_BattlerBase.prototype.isHidden = function () {
	return this._hidden;
};

/**
 * 是否出现
 * Check if appeared
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否出现
 * @description 检查战斗者是否处于可见状态
 */
Game_BattlerBase.prototype.isAppeared = function () {
	return !this.isHidden();
};

/**
 * 是否死亡
 * Check if dead
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否死亡
 * @description 检查战斗者是否死亡（出现且受死亡状态影响）
 */
Game_BattlerBase.prototype.isDead = function () {
	return this.isAppeared() && this.isDeathStateAffected();
};

/**
 * 是否活着
 * Check if alive
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否活着
 * @description 检查战斗者是否活着（出现且未受死亡状态影响）
 */
Game_BattlerBase.prototype.isAlive = function () {
	return this.isAppeared() && !this.isDeathStateAffected();
};

/**
 * 是否频死
 * Check if dying
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否频死
 * @description 检查是否处于频死状态（HP低于最大值的1/4）
 */
Game_BattlerBase.prototype.isDying = function () {
	return this.isAlive() && this._hp < this.mhp / 4;
};

/**
 * 是否行动被限制
 * Check if restricted
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 行动是否被限制
 * @description 检查是否受到行动限制状态的影响
 */
Game_BattlerBase.prototype.isRestricted = function () {
	return this.isAppeared() && this.restriction() > 0;
};

/**
 * 是否可输入指令
 * Check if can input
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否可输入指令
 * @description 检查是否可以接受玩家的指令输入
 */
Game_BattlerBase.prototype.canInput = function () {
	return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};

/**
 * 是否可移动
 * Check if can move
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否可移动
 * @description 检查是否能够进行移动和行动
 */
Game_BattlerBase.prototype.canMove = function () {
	return this.isAppeared() && this.restriction() < 4;
};

/**
 * 是否混乱
 * Check if confused
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否混乱
 * @description 检查是否处于混乱状态
 */
Game_BattlerBase.prototype.isConfused = function () {
	return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};

/**
 * 混乱等级
 * Get confusion level
 *
 * @memberof Game_BattlerBase
 * @returns {number} 混乱等级
 * @description 获取混乱状态的等级（0-3）
 */
Game_BattlerBase.prototype.confusionLevel = function () {
	return this.isConfused() ? this.restriction() : 0;
};

/**
 * 是否是玩家
 * Check if actor
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否是玩家角色
 * @description 检查是否为玩家控制的角色，基础类返回false
 */
Game_BattlerBase.prototype.isActor = function () {
	return false;
};

/**
 * 是否是敌人
 * Check if enemy
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否是敌人
 * @description 检查是否为敌人，基础类返回false
 */
Game_BattlerBase.prototype.isEnemy = function () {
	return false;
};

/**
 * 排序状态
 * Sort states
 *
 * @memberof Game_BattlerBase
 * @description 按优先级对状态进行排序，优先级高的状态排在前面
 */
Game_BattlerBase.prototype.sortStates = function () {
	this._states.sort(function (a, b) {
		var p1 = $dataStates[a].priority;
		var p2 = $dataStates[b].priority;
		if (p1 !== p2) {
			return p2 - p1;
		}
		return a - b;
	});
};

/**
 * 限制
 * Get restriction level
 *
 * @memberof Game_BattlerBase
 * @returns {number} 限制等级
 * @description 获取当前的行动限制等级，返回所有状态中最高的限制等级
 */
Game_BattlerBase.prototype.restriction = function () {
	return Math.max.apply(
		null,
		this.states()
			.map(function (state) {
				return state.restriction;
			})
			.concat(0),
	);
};

/**
 * 增加新状态
 * Add new state
 *
 * @memberof Game_BattlerBase
 * @param {number} stateId - 状态ID
 * @description 添加新的状态异常，如果是死亡状态则执行死亡流程
 */
Game_BattlerBase.prototype.addNewState = function (stateId) {
	if (stateId === this.deathStateId()) {
		this.die();
	}
	var restricted = this.isRestricted();
	this._states.push(stateId);
	this.sortStates();
	if (!restricted && this.isRestricted()) {
		this.onRestrict();
	}
};

/**
 * 当限制
 * Called when restricted
 *
 * @memberof Game_BattlerBase
 * @description 当角色被行动限制时调用，基础类为空实现
 */
Game_BattlerBase.prototype.onRestrict = function () {};

/**
 * 最重要的状态文本
 * Get most important state text
 *
 * @memberof Game_BattlerBase
 * @returns {string} 状态持续时的文本
 * @description 获取最重要状态的持续文本，指的是状态-信息-状态持续时
 */
Game_BattlerBase.prototype.mostImportantStateText = function () {
	var states = this.states();
	for (var i = 0; i < states.length; i++) {
		if (states[i].message3) {
			return states[i].message3;
		}
	}
	return "";
};

/**
 * 状态动作索引
 * Get state motion index
 *
 * @memberof Game_BattlerBase
 * @returns {number} 动作索引
 * @description 获取状态对应的SV动作索引：0正常，1状态异常，2睡眠，3无法战斗
 */
Game_BattlerBase.prototype.stateMotionIndex = function () {
	var states = this.states();
	if (states.length > 0) {
		return states[0].motion;
	} else {
		return 0;
	}
};

/**
 * 状态遮罩索引
 * Get state overlay index
 *
 * @memberof Game_BattlerBase
 * @returns {number} 遮罩索引
 * @description 获取状态对应的SV遮罩索引：0无，1中毒，2黑暗，3沉默，4愤怒，5混乱，6魅惑，7睡眠，8麻痹，9诅咒，10恐惧
 */
Game_BattlerBase.prototype.stateOverlayIndex = function () {
	var states = this.states();
	if (states.length > 0) {
		return states[0].overlay;
	} else {
		return 0;
	}
};

/**
 * 是否该技能满足需要的武器类型
 * Check if skill weapon type is OK
 *
 * @memberof Game_BattlerBase
 * @param {Object} skill - 技能对象
 * @returns {boolean} 武器类型是否满足
 * @description 检查技能所需的武器类型是否满足，Game_Actor会重写该函数
 */
Game_BattlerBase.prototype.isSkillWtypeOk = function (skill) {
	return true;
};

/**
 * 技能MP消耗
 * Get skill MP cost
 *
 * @memberof Game_BattlerBase
 * @param {Object} skill - 技能对象
 * @returns {number} MP消耗量
 * @description 计算技能的实际MP消耗量，考虑MP消耗率
 */
Game_BattlerBase.prototype.skillMpCost = function (skill) {
	return Math.floor(skill.mpCost * this.mcr);
};

/**
 * 技能TP消耗
 * Get skill TP cost
 *
 * @memberof Game_BattlerBase
 * @param {Object} skill - 技能对象
 * @returns {number} TP消耗量
 * @description 获取技能的TP消耗量
 */
Game_BattlerBase.prototype.skillTpCost = function (skill) {
	return skill.tpCost;
};

/**
 * 是否能够支付技能消耗
 * Check if can pay skill cost
 *
 * @memberof Game_BattlerBase
 * @param {Object} skill - 技能对象
 * @returns {boolean} 是否能支付消耗
 * @description 检查当前MP和TP是否足够支付技能消耗
 */
Game_BattlerBase.prototype.canPaySkillCost = function (skill) {
	return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
};

/**
 * 支付技能消耗
 * Pay skill cost
 *
 * @memberof Game_BattlerBase
 * @param {Object} skill - 技能对象
 * @description 扣除使用技能所需的MP和TP
 */
Game_BattlerBase.prototype.paySkillCost = function (skill) {
	this._mp -= this.skillMpCost(skill);
	this._tp -= this.skillTpCost(skill);
};

/**
 * 是否该物品可使用的场合
 * Check if item occasion is OK
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 物品对象
 * @returns {boolean} 使用场合是否合适
 * @description 检查物品的使用场合是否符合当前情况：0随时，1战斗中，2菜单中，3不能使用
 */
Game_BattlerBase.prototype.isOccasionOk = function (item) {
	if ($gameParty.inBattle()) {
		return item.occasion === 0 || item.occasion === 1;
	} else {
		return item.occasion === 0 || item.occasion === 2;
	}
};

/**
 * 是否符合可用物品条件
 * Check if meets usable item conditions
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 物品对象
 * @returns {boolean} 是否符合使用条件
 * @description 检查是否满足物品使用的基本条件
 */
Game_BattlerBase.prototype.meetsUsableItemConditions = function (item) {
	return this.canMove() && this.isOccasionOk(item);
};

/**
 * 是否符合技能条件
 * Check if meets skill conditions
 *
 * @memberof Game_BattlerBase
 * @param {Object} skill - 技能对象
 * @returns {boolean} 是否符合使用条件
 * @description 检查是否满足技能使用的所有条件
 */
Game_BattlerBase.prototype.meetsSkillConditions = function (skill) {
	return (
		this.meetsUsableItemConditions(skill) &&
		this.isSkillWtypeOk(skill) &&
		this.canPaySkillCost(skill) &&
		!this.isSkillSealed(skill.id) &&
		!this.isSkillTypeSealed(skill.stypeId)
	);
};

/**
 * 是否符合物品条件
 * Check if meets item conditions
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 物品对象
 * @returns {boolean} 是否符合使用条件
 * @description 检查是否满足物品使用的所有条件
 */
Game_BattlerBase.prototype.meetsItemConditions = function (item) {
	return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

/**
 * 是否可使用
 * Check if can use item
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 物品对象
 * @returns {boolean} 是否可使用
 * @description 检查是否可以使用指定的物品或技能
 */
Game_BattlerBase.prototype.canUse = function (item) {
	if (!item) {
		return false;
	} else if (DataManager.isSkill(item)) {
		return this.meetsSkillConditions(item);
	} else if (DataManager.isItem(item)) {
		return this.meetsItemConditions(item);
	} else {
		return false;
	}
};

/**
 * 是否可装备
 * Check if can equip
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 装备对象
 * @returns {boolean} 是否可装备
 * @description 检查是否可以装备指定的装备
 */
Game_BattlerBase.prototype.canEquip = function (item) {
	if (!item) {
		return false;
	} else if (DataManager.isWeapon(item)) {
		return this.canEquipWeapon(item);
	} else if (DataManager.isArmor(item)) {
		return this.canEquipArmor(item);
	} else {
		return false;
	}
};

/**
 * 是否可装备该武器
 * Check if can equip weapon
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 武器对象
 * @returns {boolean} 是否可装备该武器
 * @description 检查是否可以装备指定的武器
 */
Game_BattlerBase.prototype.canEquipWeapon = function (item) {
	return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};

/**
 * 是否可装备该护甲
 * Check if can equip armor
 *
 * @memberof Game_BattlerBase
 * @param {Object} item - 护甲对象
 * @returns {boolean} 是否可装备该护甲
 * @description 检查是否可以装备指定的护甲
 */
Game_BattlerBase.prototype.canEquipArmor = function (item) {
	return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};

/**
 * 普通攻击技能ID
 * Get attack skill ID
 *
 * @memberof Game_BattlerBase
 * @returns {number} 攻击技能ID
 * @description 获取普通攻击对应的技能ID，默认为1
 */
Game_BattlerBase.prototype.attackSkillId = function () {
	return 1;
};

/**
 * 防御技能ID
 * Get guard skill ID
 *
 * @memberof Game_BattlerBase
 * @returns {number} 防御技能ID
 * @description 获取防御对应的技能ID，默认为2
 */
Game_BattlerBase.prototype.guardSkillId = function () {
	return 2;
};

/**
 * 是否可以普通攻击
 * Check if can attack
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否可以攻击
 * @description 检查是否可以进行普通攻击
 */
Game_BattlerBase.prototype.canAttack = function () {
	return this.canUse($dataSkills[this.attackSkillId()]);
};

/**
 * 是否可以防御
 * Check if can guard
 *
 * @memberof Game_BattlerBase
 * @returns {boolean} 是否可以防御
 * @description 检查是否可以进行防御
 */
Game_BattlerBase.prototype.canGuard = function () {
	return this.canUse($dataSkills[this.guardSkillId()]);
};
