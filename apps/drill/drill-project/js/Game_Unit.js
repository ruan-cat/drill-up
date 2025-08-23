//=============================================================================
// Game_Unit.js
//=============================================================================

//=============================================================================
/**
 * Game_Unit
 * 单位组类
 *
 * 索引：	无（父类）
 * 来源：	无（独立数据）
 * 实例：	无（父类）
 * 应用：	> 被子类 队伍Game_Party 继承。
 * 			> 被子类 敌群Game_Troop 继承。
 *
 * 作用域：	战斗界面、地图界面、菜单界面
 * 主功能：	用于存放战斗单位的容器。
 * 子功能：	->数据类
 * 				->不含帧刷新
 * 			->A战斗设置
 * 				->战斗开始时
 * 				->战斗结束时
 * 				->是否正在战斗
 * 			->B战斗操作
 * 				->添加战斗行动
 * 				->清除全部战斗行动
 * 				->选择一个单位
 * 				->掩护
 * 			->C获取单个
 * 				->随机目标
 * 					->随机计算
 * 				->随机已死亡的目标
 * 				->校准目标
 * 			->D获取多个
 * 				->所有单位
 * 				->活着的单位
 * 				->已死亡的单位
 * 				->可动弹的单位
 * 				->是否全部已死亡
 * 			->E单位组属性
 *
 * 说明：	> 由于容器作为父类，存储的都是 战斗单位，所以提供了很多战斗相关函数。
 * 		> 该类没有 地图相关数据 。
 */
//=============================================================================

/**
 * @class Game_Unit
 * @description 单位组类，用于存放战斗单位的容器基类
 * Base class for units that contain battlers
 */
function Game_Unit() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化单位组
 * Initialize the unit
 */
Game_Unit.prototype.initialize = function () {
	this._inBattle = false; //A战斗设置 - 战斗标记 / Battle flag
};

//==============================
// * A战斗设置 - Battle Settings
//==============================

/**
 * 战斗开始时的处理
 * Processing when battle starts
 *
 * 说明：	> 战斗管理器调用的是 子类的队伍、敌群 的函数。
 * Note: Battle manager calls the functions of subclasses (party, troop)
 */
Game_Unit.prototype.onBattleStart = function () {
	this.members().forEach(function (member) {
		member.onBattleStart();
	});
	this._inBattle = true;
};

/**
 * 战斗结束时的处理
 * Processing when battle ends
 */
Game_Unit.prototype.onBattleEnd = function () {
	this._inBattle = false;
	this.members().forEach(function (member) {
		member.onBattleEnd();
	});
};

/**
 * 是否正在战斗
 * Check if currently in battle
 *
 * @returns {boolean} 是否正在战斗 / Whether in battle
 */
Game_Unit.prototype.inBattle = function () {
	return this._inBattle;
};

//==============================
// * B战斗操作 - Battle Operations
//==============================

/**
 * 添加战斗行动
 * Generate battle actions for all members
 */
Game_Unit.prototype.makeActions = function () {
	this.members().forEach(function (member) {
		member.makeActions();
	});
};

/**
 * 清除全部战斗行动
 * Clear all battle actions
 */
Game_Unit.prototype.clearActions = function () {
	return this.members().forEach(function (member) {
		return member.clearActions();
	});
};

/**
 * 清除全部战斗行动效果（未被使用）
 * Clear all battle action results (unused)
 */
Game_Unit.prototype.clearResults = function () {
	this.members().forEach(function (member) {
		member.clearResult();
	});
};

/**
 * 选择一个单位
 * Select one unit (deselect others)
 *
 * @param {Game_Battler} activeMember - 要选择的单位 / Member to select
 */
Game_Unit.prototype.select = function (activeMember) {
	this.members().forEach(function (member) {
		if (member === activeMember) {
			member.select();
		} else {
			member.deselect();
		}
	});
};

/**
 * 掩护 - 获取替身战斗者
 * Get substitute battler for protection
 *
 * @returns {Game_Battler|undefined} 替身战斗者 / Substitute battler
 */
Game_Unit.prototype.substituteBattler = function () {
	var members = this.members();
	for (var i = 0; i < members.length; i++) {
		if (members[i].isSubstitute()) {
			return members[i];
		}
	}
};

//==============================
// * C获取单个 - Get Single Member
//==============================

/**
 * 组内随机目标
 * Get random target from unit
 *
 * 说明：	> 组内单位的随机，与 单体被攻击几率 有关。
 * Note: Random selection is related to individual target rate
 *
 * @returns {Game_Battler|null} 随机目标 / Random target
 */
Game_Unit.prototype.randomTarget = function () {
	var tgrRand = Math.random() * this.tgrSum();
	var target = null;
	this.aliveMembers().forEach(function (member) {
		tgrRand -= member.tgr;
		if (tgrRand <= 0 && !target) {
			target = member;
		}
	});
	return target;
};

/**
 * 组内随机目标 - 单体被攻击几率总和
 * Sum of target rates for random selection
 *
 * @returns {number} 被攻击几率总和 / Sum of target rates
 */
Game_Unit.prototype.tgrSum = function () {
	return this.aliveMembers().reduce(function (r, member) {
		return r + member.tgr;
	}, 0);
};

/**
 * 组内随机已死亡目标
 * Get random dead target from unit
 *
 * 说明：	> 已死亡目标的选中概率是平均的。
 * Note: Dead targets have equal probability of being selected
 *
 * @returns {Game_Battler|null} 随机已死亡目标 / Random dead target
 */
Game_Unit.prototype.randomDeadTarget = function () {
	var members = this.deadMembers();
	if (members.length === 0) {
		return null;
	}
	return members[Math.floor(Math.random() * members.length)];
};

/**
 * 根据索引获取目标
 * Get target by index (smooth targeting for alive members)
 *
 * 说明：	> 返回 活着 的目标单位。
 * Note: Returns alive target unit
 *
 * @param {number} index - 索引 / Index
 * @returns {Game_Battler|null} 目标单位 / Target battler
 */
Game_Unit.prototype.smoothTarget = function (index) {
	if (index < 0) {
		index = 0;
	}
	var member = this.members()[index];
	return member && member.isAlive() ? member : this.aliveMembers()[0];
};

/**
 * 根据索引获取已死亡目标
 * Get dead target by index (smooth targeting for dead members)
 *
 * 说明：	> 返回 已死亡 的目标单位。
 * Note: Returns dead target unit
 *
 * @param {number} index - 索引 / Index
 * @returns {Game_Battler|null} 已死亡目标单位 / Dead target battler
 */
Game_Unit.prototype.smoothDeadTarget = function (index) {
	if (index < 0) {
		index = 0;
	}
	var member = this.members()[index];
	return member && member.isDead() ? member : this.deadMembers()[0];
};

//==============================
// * D获取多个 - Get Multiple Members
//==============================

/**
 * 所有单位（子类需继承）
 * Get all members (must be overridden by subclasses)
 *
 * @returns {Array} 所有单位数组 / Array of all members
 */
Game_Unit.prototype.members = function () {
	return [];
};

/**
 * 活着的单位
 * Get alive members
 *
 * @returns {Array} 活着的单位数组 / Array of alive members
 */
Game_Unit.prototype.aliveMembers = function () {
	return this.members().filter(function (member) {
		return member.isAlive();
	});
};

/**
 * 已死亡的单位
 * Get dead members
 *
 * @returns {Array} 已死亡的单位数组 / Array of dead members
 */
Game_Unit.prototype.deadMembers = function () {
	return this.members().filter(function (member) {
		return member.isDead();
	});
};

/**
 * 可动弹的单位（不能动弹则回合则无法做出动作）
 * Get movable members (immobile members cannot act in battle)
 *
 * @returns {Array} 可动弹的单位数组 / Array of movable members
 */
Game_Unit.prototype.movableMembers = function () {
	return this.members().filter(function (member) {
		return member.canMove();
	});
};

/**
 * 是否全部已死亡
 * Check if all members are dead
 *
 * @returns {boolean} 是否全部已死亡 / Whether all members are dead
 */
Game_Unit.prototype.isAllDead = function () {
	return this.aliveMembers().length === 0;
};

//==============================
// * E单位组属性 - Unit Properties
//==============================

/**
 * 组内平均敏捷度
 * Average agility of all members
 *
 * @returns {number} 平均敏捷度 / Average agility
 */
Game_Unit.prototype.agility = function () {
	var members = this.members();
	if (members.length === 0) {
		return 1;
	}
	var sum = members.reduce(function (r, member) {
		return r + member.agi;
	}, 0);
	return sum / members.length;
};
