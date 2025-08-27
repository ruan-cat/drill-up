//=============================================================================
// Game_Enemy.js
//=============================================================================

/**
 * @fileoverview Game_Enemy - 游戏敌人类
 *
 * 敌人的游戏对象类。
 * The game object class for an enemy.
 *
 * @author 作者名
 * @since 1.0.0
 */

//-----------------------------------------------------------------------------

/**
 * @class Game_Enemy
 * @extends Game_Battler
 * @description 游戏敌人类，用于表示战斗中的敌人角色
 * Game enemy class that represents enemy characters in battle
 */
function Game_Enemy() {
	this.initialize.apply(this, arguments);
}

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

/**
 * 初始化敌人
 * Initialize enemy
 *
 * @memberof Game_Enemy
 * @method initialize
 * @param {number} enemyId - 敌人ID / Enemy ID
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 */
Game_Enemy.prototype.initialize = function (enemyId, x, y) {
	Game_Battler.prototype.initialize.call(this);
	this.setup(enemyId, x, y);
};

/**
 * 初始化成员变量
 * Initialize member variables
 *
 * @memberof Game_Enemy
 * @method initMembers
 */
Game_Enemy.prototype.initMembers = function () {
	Game_Battler.prototype.initMembers.call(this);
	this._enemyId = 0;
	this._letter = "";
	this._plural = false;
	this._screenX = 0;
	this._screenY = 0;
};

/**
 * 设置敌人属性
 * Setup enemy properties
 *
 * @memberof Game_Enemy
 * @method setup
 * @param {number} enemyId - 敌人ID / Enemy ID
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 */
Game_Enemy.prototype.setup = function (enemyId, x, y) {
	this._enemyId = enemyId;
	this._screenX = x;
	this._screenY = y;
	this.recoverAll();
};

/**
 * 检查是否为敌人
 * Check if this is an enemy
 *
 * @memberof Game_Enemy
 * @method isEnemy
 * @returns {boolean} 始终返回true / Always returns true
 */
Game_Enemy.prototype.isEnemy = function () {
	return true;
};

/**
 * 获取友方单位组
 * Get friends unit group
 *
 * @memberof Game_Enemy
 * @method friendsUnit
 * @returns {Game_Troop} 敌群对象 / Troop object
 */
Game_Enemy.prototype.friendsUnit = function () {
	return $gameTroop;
};

/**
 * 获取敌方单位组
 * Get opponents unit group
 *
 * @memberof Game_Enemy
 * @method opponentsUnit
 * @returns {Game_Party} 队伍对象 / Party object
 */
Game_Enemy.prototype.opponentsUnit = function () {
	return $gameParty;
};

/**
 * 获取在敌群中的索引
 * Get index in the troop
 *
 * @memberof Game_Enemy
 * @method index
 * @returns {number} 索引位置 / Index position
 */
Game_Enemy.prototype.index = function () {
	return $gameTroop.members().indexOf(this);
};

/**
 * 检查是否为战斗成员
 * Check if this is a battle member
 *
 * @memberof Game_Enemy
 * @method isBattleMember
 * @returns {boolean} 是否为战斗成员 / Whether is a battle member
 */
Game_Enemy.prototype.isBattleMember = function () {
	return this.index() >= 0;
};

/**
 * 获取敌人ID
 * Get enemy ID
 *
 * @returns {number} 敌人ID / Enemy ID
 */
Game_Enemy.prototype.enemyId = function () {
	return this._enemyId;
};

/**
 * 获取敌人数据对象
 * Get enemy data object
 *
 * @returns {object} 敌人数据 / Enemy data
 */
Game_Enemy.prototype.enemy = function () {
	return $dataEnemies[this._enemyId];
};

/**
 * 获取特征对象数组
 * Get trait objects array
 *
 * @returns {Array} 特征对象数组 / Array of trait objects
 */
Game_Enemy.prototype.traitObjects = function () {
	return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

/**
 * 获取基础能力值
 * Get base parameter value
 *
 * @param {number} paramId - 参数ID / Parameter ID
 * @returns {number} 基础能力值 / Base parameter value
 */
Game_Enemy.prototype.paramBase = function (paramId) {
	return this.enemy().params[paramId];
};

/**
 * 获取经验值
 * Get experience points
 *
 * @returns {number} 经验值 / Experience points
 */
Game_Enemy.prototype.exp = function () {
	return this.enemy().exp;
};

/**
 * 获取金币数量
 * Get gold amount
 *
 * @returns {number} 金币数量 / Gold amount
 */
Game_Enemy.prototype.gold = function () {
	return this.enemy().gold;
};

/**
 * 制作掉落物品
 * Make drop items
 *
 * @returns {Array} 掉落物品数组 / Array of drop items
 */
Game_Enemy.prototype.makeDropItems = function () {
	return this.enemy().dropItems.reduce(
		function (r, di) {
			if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
				return r.concat(this.itemObject(di.kind, di.dataId));
			} else {
				return r;
			}
		}.bind(this),
		[],
	);
};

/**
 * 获取掉落物品倍率
 * Get drop item rate
 *
 * @returns {number} 掉落物品倍率 / Drop item rate
 */
Game_Enemy.prototype.dropItemRate = function () {
	return $gameParty.hasDropItemDouble() ? 2 : 1;
};

/**
 * 获取物品对象
 * Get item object
 *
 * @param {number} kind - 物品种类 / Item kind
 * @param {number} dataId - 数据ID / Data ID
 * @returns {object|null} 物品对象 / Item object
 */
Game_Enemy.prototype.itemObject = function (kind, dataId) {
	if (kind === 1) {
		return $dataItems[dataId];
	} else if (kind === 2) {
		return $dataWeapons[dataId];
	} else if (kind === 3) {
		return $dataArmors[dataId];
	} else {
		return null;
	}
};

/**
 * 检查精灵是否可见
 * Check if sprite is visible
 *
 * @returns {boolean} 始终返回true / Always returns true
 */
Game_Enemy.prototype.isSpriteVisible = function () {
	return true;
};

/**
 * 获取屏幕X坐标
 * Get screen X coordinate
 *
 * @returns {number} 屏幕X坐标 / Screen X coordinate
 */
Game_Enemy.prototype.screenX = function () {
	return this._screenX;
};

/**
 * 获取屏幕Y坐标
 * Get screen Y coordinate
 *
 * @returns {number} 屏幕Y坐标 / Screen Y coordinate
 */
Game_Enemy.prototype.screenY = function () {
	return this._screenY;
};

/**
 * 获取战斗图名称
 * Get battler name
 *
 * @returns {string} 战斗图名称 / Battler name
 */
Game_Enemy.prototype.battlerName = function () {
	return this.enemy().battlerName;
};

/**
 * 获取战斗图色相
 * Get battler hue
 *
 * @returns {number} 战斗图色相 / Battler hue
 */
Game_Enemy.prototype.battlerHue = function () {
	return this.enemy().battlerHue;
};

/**
 * 获取原始名称
 * Get original name
 *
 * @returns {string} 原始名称 / Original name
 */
Game_Enemy.prototype.originalName = function () {
	return this.enemy().name;
};

/**
 * 获取敌人名称（包含字母后缀）
 * Get enemy name (with letter suffix)
 * 多只同样的敌人时，会在敌人原名后面加字母来区分。
 * When there are multiple same enemies, letters are added after the original name to distinguish them.
 *
 * @returns {string} 敌人名称 / Enemy name
 */
Game_Enemy.prototype.name = function () {
	return this.originalName() + (this._plural ? this._letter : "");
};

/**
 * 检查字母是否为空
 * Check if letter is empty
 *
 * @returns {boolean} 字母是否为空 / Whether letter is empty
 */
Game_Enemy.prototype.isLetterEmpty = function () {
	return this._letter === "";
};

/**
 * 设置字母后缀
 * Set letter suffix
 *
 * @param {string} letter - 字母后缀 / Letter suffix
 */
Game_Enemy.prototype.setLetter = function (letter) {
	this._letter = letter;
};

/**
 * 设置是否为复数
 * Set whether is plural
 *
 * @param {boolean} plural - 是否为复数 / Whether is plural
 */
Game_Enemy.prototype.setPlural = function (plural) {
	this._plural = plural;
};

/**
 * 表现行动开始
 * Perform action start
 *
 * @param {Game_Action} action - 行动对象 / Action object
 */
Game_Enemy.prototype.performActionStart = function (action) {
	Game_Battler.prototype.performActionStart.call(this, action);
	this.requestEffect("whiten");
};

/**
 * 表现行动
 * Perform action
 *
 * @param {Game_Action} action - 行动对象 / Action object
 */
Game_Enemy.prototype.performAction = function (action) {
	Game_Battler.prototype.performAction.call(this, action);
};

/**
 * 表现行动结束
 * Perform action end
 */
Game_Enemy.prototype.performActionEnd = function () {
	Game_Battler.prototype.performActionEnd.call(this);
};

/**
 * 表现伤害
 * Perform damage
 */
Game_Enemy.prototype.performDamage = function () {
	Game_Battler.prototype.performDamage.call(this);
	SoundManager.playEnemyDamage();
	this.requestEffect("blink");
};

/**
 * 表现倒下（死亡后的消失效果）
 * Perform collapse (disappearing effect after death)
 */
Game_Enemy.prototype.performCollapse = function () {
	Game_Battler.prototype.performCollapse.call(this);
	switch (this.collapseType()) {
		case 0:
			this.requestEffect("collapse");
			SoundManager.playEnemyCollapse();
			break;
		case 1:
			this.requestEffect("bossCollapse");
			SoundManager.playBossCollapse1();
			break;
		case 2:
			this.requestEffect("instantCollapse");
			break;
	}
};

/**
 * 变身为另一种敌人
 * Transform to another enemy
 *
 * @param {number} enemyId - 新的敌人ID / New enemy ID
 */
Game_Enemy.prototype.transform = function (enemyId) {
	var name = this.originalName();
	this._enemyId = enemyId;
	if (this.originalName() !== name) {
		this._letter = "";
		this._plural = false;
	}
	this.refresh();
	if (this.numActions() > 0) {
		this.makeActions();
	}
};

/**
 * 检查是否符合行动条件
 * Check if meets action condition
 *
 * @param {object} action - 行动数据 / Action data
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsCondition = function (action) {
	var param1 = action.conditionParam1;
	var param2 = action.conditionParam2;
	switch (action.conditionType) {
		case 1:
			return this.meetsTurnCondition(param1, param2);
		case 2:
			return this.meetsHpCondition(param1, param2);
		case 3:
			return this.meetsMpCondition(param1, param2);
		case 4:
			return this.meetsStateCondition(param1);
		case 5:
			return this.meetsPartyLevelCondition(param1);
		case 6:
			return this.meetsSwitchCondition(param1);
		default:
			return true;
	}
};

/**
 * 检查是否符合回合条件
 * Check if meets turn condition
 *
 * @param {number} param1 - 参数1 / Parameter 1
 * @param {number} param2 - 参数2 / Parameter 2
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsTurnCondition = function (param1, param2) {
	var n = $gameTroop.turnCount();
	if (param2 === 0) {
		return n === param1;
	} else {
		return n > 0 && n >= param1 && n % param2 === param1 % param2;
	}
};

/**
 * 检查是否符合HP条件
 * Check if meets HP condition
 *
 * @param {number} param1 - HP最小值 / HP minimum value
 * @param {number} param2 - HP最大值 / HP maximum value
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsHpCondition = function (param1, param2) {
	return this.hpRate() >= param1 && this.hpRate() <= param2;
};

/**
 * 检查是否符合MP条件
 * Check if meets MP condition
 *
 * @param {number} param1 - MP最小值 / MP minimum value
 * @param {number} param2 - MP最大值 / MP maximum value
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsMpCondition = function (param1, param2) {
	return this.mpRate() >= param1 && this.mpRate() <= param2;
};

/**
 * 检查是否符合状态条件
 * Check if meets state condition
 *
 * @param {number} param - 状态ID / State ID
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsStateCondition = function (param) {
	return this.isStateAffected(param);
};

/**
 * 检查是否符合队伍等级条件
 * Check if meets party level condition
 *
 * @param {number} param - 最小等级 / Minimum level
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsPartyLevelCondition = function (param) {
	return $gameParty.highestLevel() >= param;
};

/**
 * 检查是否符合开关条件
 * Check if meets switch condition
 *
 * @param {number} param - 开关ID / Switch ID
 * @returns {boolean} 是否符合条件 / Whether meets condition
 */
Game_Enemy.prototype.meetsSwitchCondition = function (param) {
	return $gameSwitches.value(param);
};

/**
 * 检查行动是否有效
 * Check if action is valid
 *
 * @param {object} action - 行动数据 / Action data
 * @returns {boolean} 行动是否有效 / Whether action is valid
 */
Game_Enemy.prototype.isActionValid = function (action) {
	return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

/**
 * 选择行动
 * Select action
 *
 * @param {Array} actionList - 行动列表 / Action list
 * @param {number} ratingZero - 基准评级 / Base rating
 * @returns {object|null} 选中的行动 / Selected action
 */
Game_Enemy.prototype.selectAction = function (actionList, ratingZero) {
	var sum = actionList.reduce(function (r, a) {
		return r + a.rating - ratingZero;
	}, 0);
	if (sum > 0) {
		var value = Math.randomInt(sum);
		for (var i = 0; i < actionList.length; i++) {
			var action = actionList[i];
			value -= action.rating - ratingZero;
			if (value < 0) {
				return action;
			}
		}
	} else {
		return null;
	}
};

/**
 * 选择所有行动
 * Select all actions
 *
 * @param {Array} actionList - 行动列表 / Action list
 */
Game_Enemy.prototype.selectAllActions = function (actionList) {
	var ratingMax = Math.max.apply(
		null,
		actionList.map(function (a) {
			return a.rating;
		}),
	);
	var ratingZero = ratingMax - 3;
	actionList = actionList.filter(function (a) {
		return a.rating > ratingZero;
	});
	for (var i = 0; i < this.numActions(); i++) {
		this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
	}
};

/**
 * 制作行动
 * Make actions
 */
Game_Enemy.prototype.makeActions = function () {
	Game_Battler.prototype.makeActions.call(this);
	if (this.numActions() > 0) {
		var actionList = this.enemy().actions.filter(function (a) {
			return this.isActionValid(a);
		}, this);
		if (actionList.length > 0) {
			this.selectAllActions(actionList);
		}
	}
	this.setActionState("waiting");
};
