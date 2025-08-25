//=============================================================================
// Game_Unit.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏单位类
 * Game_Unit
 *
 * Game_Party 和 Game_Troop 的父类。
 * The superclass of Game_Party and Game_Troop.
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Unit
 * @description 游戏单位类，是Game_Party和Game_Troop的父类
 * Game unit class, the superclass of Game_Party and Game_Troop
 */
function Game_Unit() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化游戏单位
 * Initialize game unit
 */
Game_Unit.prototype.initialize = function () {
	this._inBattle = false;
};

/**
 * 检查是否在战斗中
 * Check if in battle
 *
 * @returns {boolean} 是否在战斗中 / Whether in battle
 */
Game_Unit.prototype.inBattle = function () {
	return this._inBattle;
};

/**
 * 获取成员数组（子类需重写）
 * Get members array (to be overridden by subclasses)
 *
 * @returns {Array} 成员数组 / Members array
 */
Game_Unit.prototype.members = function () {
	return [];
};

/**
 * 获取活着的成员
 * Get alive members
 *
 * @returns {Array} 活着的成员数组 / Array of alive members
 */
Game_Unit.prototype.aliveMembers = function () {
	return this.members().filter(function (member) {
		return member.isAlive();
	});
};

/**
 * 获取死亡的成员
 * Get dead members
 *
 * @returns {Array} 死亡的成员数组 / Array of dead members
 */
Game_Unit.prototype.deadMembers = function () {
	return this.members().filter(function (member) {
		return member.isDead();
	});
};

/**
 * 获取可移动的成员
 * Get movable members
 *
 * @returns {Array} 可移动的成员数组 / Array of movable members
 */
Game_Unit.prototype.movableMembers = function () {
	return this.members().filter(function (member) {
		return member.canMove();
	});
};

/**
 * 清除所有成员的行动
 * Clear actions of all members
 *
 * @returns {Array} 清除结果 / Clear results
 */
Game_Unit.prototype.clearActions = function () {
	return this.members().forEach(function (member) {
		return member.clearActions();
	});
};

/**
 * 计算平均敏捷度
 * Calculate average agility
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

/**
 * 计算受到攻击几率总和
 * Calculate sum of target rates
 *
 * @returns {number} 受到攻击几率总和 / Sum of target rates
 */
Game_Unit.prototype.tgrSum = function () {
	return this.aliveMembers().reduce(function (r, member) {
		return r + member.tgr;
	}, 0);
};

/**
 * 获取随机目标
 * Get random target
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
 * 获取随机死亡目标
 * Get random dead target
 *
 * @returns {Game_Battler|null} 随机死亡目标 / Random dead target
 */
Game_Unit.prototype.randomDeadTarget = function () {
	var members = this.deadMembers();
	if (members.length === 0) {
		return null;
	}
	return members[Math.floor(Math.random() * members.length)];
};

/**
 * 顺利获取目标
 * Get target smoothly
 * 返回指定索引的目标，当索引对应的目标无效时返回存活队员的首个对象。
 * Returns the target at the specified index, or the first alive member if the target is invalid.
 * PS：smooth 应该是指就算 index 有问题也能顺利返回一个目标。
 * PS: "smooth" means it can smoothly return a target even if there's an issue with the index.
 *
 * @param {number} index - 目标索引 / Target index
 * @returns {Game_Battler|null} 目标成员 / Target member
 */
Game_Unit.prototype.smoothTarget = function (index) {
	if (index < 0) {
		index = 0;
	}
	var member = this.members()[index];
	return member && member.isAlive() ? member : this.aliveMembers()[0];
};

/**
 * 顺利获取死亡目标
 * Get dead target smoothly
 *
 * @param {number} index - 目标索引 / Target index
 * @returns {Game_Battler|null} 死亡目标成员 / Dead target member
 */
Game_Unit.prototype.smoothDeadTarget = function (index) {
	if (index < 0) {
		index = 0;
	}
	var member = this.members()[index];
	return member && member.isDead() ? member : this.deadMembers()[0];
};

/**
 * 清除所有成员的结果
 * Clear results of all members
 */
Game_Unit.prototype.clearResults = function () {
	this.members().forEach(function (member) {
		member.clearResult();
	});
};

/**
 * 当战斗开始时的处理
 * Processing when battle starts
 */
Game_Unit.prototype.onBattleStart = function () {
	this.members().forEach(function (member) {
		member.onBattleStart();
	});
	this._inBattle = true;
};

/**
 * 当战斗结束时的处理
 * Processing when battle ends
 */
Game_Unit.prototype.onBattleEnd = function () {
	this._inBattle = false;
	this.members().forEach(function (member) {
		member.onBattleEnd();
	});
};

/**
 * 制作所有成员的行动
 * Make actions for all members
 */
Game_Unit.prototype.makeActions = function () {
	this.members().forEach(function (member) {
		member.makeActions();
	});
};

/**
 * 选择指定成员（取消选择其他成员）
 * Select specified member (deselect others)
 *
 * @param {Game_Battler} activeMember - 要选择的活动成员 / Active member to select
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
 * 检查是否所有成员都死亡
 * Check if all members are dead
 *
 * @returns {boolean} 是否全部死亡 / Whether all are dead
 */
Game_Unit.prototype.isAllDead = function () {
	return this.aliveMembers().length === 0;
};

/**
 * 获取掩护的战斗者
 * Get substitute battler
 *
 * @returns {Game_Battler|undefined} 掩护的战斗者 / Substitute battler
 */
Game_Unit.prototype.substituteBattler = function () {
	var members = this.members();
	for (var i = 0; i < members.length; i++) {
		if (members[i].isSubstitute()) {
			return members[i];
		}
	}
};
