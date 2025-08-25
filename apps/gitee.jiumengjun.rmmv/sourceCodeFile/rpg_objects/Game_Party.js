//=============================================================================
// Game_Party.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏队伍类
 * Game_Party
 *
 * 队伍的游戏对象类。包括金钱和物品等信息。
 * The game object class for the party. Information such as gold and items is
 * included.
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Party
 * @extends Game_Unit
 * @description 游戏队伍类，管理角色队伍、物品仓库和金钱
 * Game party class that manages actor party, item storage and gold
 */
function Game_Party() {
	this.initialize.apply(this, arguments);
}

Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;

/**
 * 队伍能力常量 - 遇敌减半
 * Party ability constant - Encounter rate half
 * @type {number}
 */
Game_Party.ABILITY_ENCOUNTER_HALF = 0;

/**
 * 队伍能力常量 - 无遇敌
 * Party ability constant - No encounter
 * @type {number}
 */
Game_Party.ABILITY_ENCOUNTER_NONE = 1;

/**
 * 队伍能力常量 - 取消偷袭
 * Party ability constant - Cancel surprise
 * @type {number}
 */
Game_Party.ABILITY_CANCEL_SURPRISE = 2;

/**
 * 队伍能力常量 - 增加先发制人率
 * Party ability constant - Raise preemptive rate
 * @type {number}
 */
Game_Party.ABILITY_RAISE_PREEMPTIVE = 3;

/**
 * 队伍能力常量 - 双倍金钱
 * Party ability constant - Double gold
 * @type {number}
 */
Game_Party.ABILITY_GOLD_DOUBLE = 4;

/**
 * 队伍能力常量 - 双倍掉落物品
 * Party ability constant - Double drop items
 * @type {number}
 */
Game_Party.ABILITY_DROP_ITEM_DOUBLE = 5;

/**
 * 初始化队伍
 * Initialize party
 */
Game_Party.prototype.initialize = function () {
	Game_Unit.prototype.initialize.call(this);
	this._gold = 0;
	this._steps = 0;
	this._lastItem = new Game_Item();
	this._menuActorId = 0;
	this._targetActorId = 0;
	this._actors = [];
	this.initAllItems();
};

/**
 * 初始化所有物品
 * Initialize all items
 */
Game_Party.prototype.initAllItems = function () {
	this._items = {};
	this._weapons = {};
	this._armors = {};
};

/**
 * 检查是否存在角色
 * Check if party exists (has actors)
 *
 * @returns {boolean} 是否存在角色 / Whether actors exist
 */
Game_Party.prototype.exists = function () {
	return this._actors.length > 0;
};

/**
 * 获取队伍大小
 * Get party size
 *
 * @returns {number} 队伍大小 / Party size
 */
Game_Party.prototype.size = function () {
	return this.members().length;
};

/**
 * 检查队伍是否为空
 * Check if party is empty
 *
 * @returns {boolean} 队伍是否为空 / Whether party is empty
 */
Game_Party.prototype.isEmpty = function () {
	return this.size() === 0;
};

/**
 * 获取成员（战斗中返回战斗成员，否则返回所有成员）
 * Get members (battle members in battle, all members otherwise)
 *
 * @returns {Array} 成员数组 / Members array
 */
Game_Party.prototype.members = function () {
	return this.inBattle() ? this.battleMembers() : this.allMembers();
};

/**
 * 获取所有成员
 * Get all members
 *
 * @returns {Array} 所有成员数组 / All members array
 */
Game_Party.prototype.allMembers = function () {
	return this._actors.map(function (id) {
		return $gameActors.actor(id);
	});
};

/**
 * 获取战斗成员
 * Get battle members
 *
 * @returns {Array} 战斗成员数组 / Battle members array
 */
Game_Party.prototype.battleMembers = function () {
	return this.allMembers()
		.slice(0, this.maxBattleMembers())
		.filter(function (actor) {
			return actor.isAppeared();
		});
};

/**
 * 获取最大战斗成员数
 * Get max battle members count
 *
 * @returns {number} 最大战斗成员数 / Max battle members count
 */
Game_Party.prototype.maxBattleMembers = function () {
	return 4;
};

/**
 * 获取队长
 * Get party leader
 *
 * @returns {Game_Actor|undefined} 队长角色 / Leader actor
 */
Game_Party.prototype.leader = function () {
	return this.battleMembers()[0];
};

/**
 * 复活战斗成员
 * Revive battle members
 * 允许战斗失败的情况下，战斗失败后全员复活且 1 血。
 * When battle defeat is allowed, all members revive with 1 HP after defeat.
 */
Game_Party.prototype.reviveBattleMembers = function () {
	this.battleMembers().forEach(function (actor) {
		if (actor.isDead()) {
			actor.setHp(1);
		}
	});
};

/**
 * 获取物品列表
 * Get items list
 *
 * @returns {Array} 物品列表 / Items list
 */
Game_Party.prototype.items = function () {
	var list = [];
	for (var id in this._items) {
		list.push($dataItems[id]);
	}
	return list;
};

/**
 * 获取武器列表
 * Get weapons list
 *
 * @returns {Array} 武器列表 / Weapons list
 */
Game_Party.prototype.weapons = function () {
	var list = [];
	for (var id in this._weapons) {
		list.push($dataWeapons[id]);
	}
	return list;
};

/**
 * 获取护甲列表
 * Get armors list
 *
 * @returns {Array} 护甲列表 / Armors list
 */
Game_Party.prototype.armors = function () {
	var list = [];
	for (var id in this._armors) {
		list.push($dataArmors[id]);
	}
	return list;
};

/**
 * 获取装备物品（武器和护甲）
 * Get equipment items (weapons and armors)
 *
 * @returns {Array} 装备物品列表 / Equipment items list
 */
Game_Party.prototype.equipItems = function () {
	return this.weapons().concat(this.armors());
};

/**
 * 获取所有物品（物品、武器和护甲）
 * Get all items (items, weapons and armors)
 *
 * @returns {Array} 所有物品列表 / All items list
 */
Game_Party.prototype.allItems = function () {
	return this.items().concat(this.equipItems());
};

/**
 * 获取物品容器
 * Get item container
 *
 * @param {object} item - 物品对象 / Item object
 * @returns {object|null} 物品容器 / Item container
 */
Game_Party.prototype.itemContainer = function (item) {
	if (!item) {
		return null;
	} else if (DataManager.isItem(item)) {
		return this._items;
	} else if (DataManager.isWeapon(item)) {
		return this._weapons;
	} else if (DataManager.isArmor(item)) {
		return this._armors;
	} else {
		return null;
	}
};

/**
 * 设置初始成员
 * Setup starting members
 */
Game_Party.prototype.setupStartingMembers = function () {
	this._actors = [];
	$dataSystem.partyMembers.forEach(function (actorId) {
		if ($gameActors.actor(actorId)) {
			this._actors.push(actorId);
		}
	}, this);
};

/**
 * 获取队伍名称
 * Get party name
 *
 * @returns {string} 队伍名称 / Party name
 */
Game_Party.prototype.name = function () {
	var numBattleMembers = this.battleMembers().length;
	if (numBattleMembers === 0) {
		return "";
	} else if (numBattleMembers === 1) {
		return this.leader().name();
	} else {
		return TextManager.partyName.format(this.leader().name());
	}
};

/**
 * 设置战斗测试
 * Setup battle test
 */
Game_Party.prototype.setupBattleTest = function () {
	this.setupBattleTestMembers();
	this.setupBattleTestItems();
};

/**
 * 设置战斗测试成员
 * Setup battle test members
 */
Game_Party.prototype.setupBattleTestMembers = function () {
	$dataSystem.testBattlers.forEach(function (battler) {
		var actor = $gameActors.actor(battler.actorId);
		if (actor) {
			actor.changeLevel(battler.level, false);
			actor.initEquips(battler.equips);
			actor.recoverAll();
			this.addActor(battler.actorId);
		}
	}, this);
};

/**
 * 设置战斗测试物品
 * Setup battle test items
 */
Game_Party.prototype.setupBattleTestItems = function () {
	$dataItems.forEach(function (item) {
		if (item && item.name.length > 0) {
			this.gainItem(item, this.maxItems(item));
		}
	}, this);
};

/**
 * 获取最高等级
 * Get highest level
 * 返回队伍中等级最高的成员的等级。
 * Returns the level of the highest-level member in the party.
 *
 * @returns {number} 最高等级 / Highest level
 */
Game_Party.prototype.highestLevel = function () {
	return Math.max.apply(
		null,
		this.members().map(function (actor) {
			return actor.level;
		}),
	);
};

/**
 * 添加角色
 * Add actor
 *
 * @param {number} actorId - 角色ID / Actor ID
 */
Game_Party.prototype.addActor = function (actorId) {
	if (!this._actors.contains(actorId)) {
		this._actors.push(actorId);
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	}
};

/**
 * 移除角色
 * Remove actor
 *
 * @param {number} actorId - 角色ID / Actor ID
 */
Game_Party.prototype.removeActor = function (actorId) {
	if (this._actors.contains(actorId)) {
		this._actors.splice(this._actors.indexOf(actorId), 1);
		$gamePlayer.refresh();
		$gameMap.requestRefresh();
	}
};

/**
 * 获取金钱数量
 * Get gold amount
 *
 * @returns {number} 金钱数量 / Gold amount
 */
Game_Party.prototype.gold = function () {
	return this._gold;
};

/**
 * 获得金钱
 * Gain gold
 *
 * @param {number} amount - 金钱数量 / Gold amount
 */
Game_Party.prototype.gainGold = function (amount) {
	this._gold = (this._gold + amount).clamp(0, this.maxGold());
};

/**
 * 失去金钱
 * Lose gold
 *
 * @param {number} amount - 金钱数量 / Gold amount
 */
Game_Party.prototype.loseGold = function (amount) {
	this.gainGold(-amount);
};

/**
 * 获取金钱上限
 * Get max gold
 *
 * @returns {number} 金钱上限 / Max gold
 */
Game_Party.prototype.maxGold = function () {
	return 99999999;
};

/**
 * 获取步数
 * Get steps count
 *
 * @returns {number} 步数 / Steps count
 */
Game_Party.prototype.steps = function () {
	return this._steps;
};

/**
 * 增加步数
 * Increase steps
 */
Game_Party.prototype.increaseSteps = function () {
	this._steps++;
};

/**
 * 获取物品数量
 * Get item amount
 *
 * @param {object} item - 物品对象 / Item object
 * @returns {number} 物品数量 / Item amount
 */
Game_Party.prototype.numItems = function (item) {
	var container = this.itemContainer(item);
	return container ? container[item.id] || 0 : 0;
};

/**
 * 获取物品上限
 * Get max items
 *
 * @param {object} item - 物品对象 / Item object
 * @returns {number} 物品上限 / Max items
 */
Game_Party.prototype.maxItems = function (item) {
	return 99;
};

/**
 * 检查是否该物品数量超过上限
 * Check if item amount has reached max
 *
 * @param {object} item - 物品对象 / Item object
 * @returns {boolean} 是否已达上限 / Whether max is reached
 */
Game_Party.prototype.hasMaxItems = function (item) {
	return this.numItems(item) >= this.maxItems(item);
};

/**
 * 检查是否拥有该物品
 * Check if party has item
 *
 * @param {object} item - 物品对象 / Item object
 * @param {boolean} includeEquip - 是否包含装备 / Whether to include equipment
 * @returns {boolean} 是否拥有物品 / Whether has item
 */
Game_Party.prototype.hasItem = function (item, includeEquip) {
	if (includeEquip === undefined) {
		includeEquip = false;
	}
	if (this.numItems(item) > 0) {
		return true;
	} else if (includeEquip && this.isAnyMemberEquipped(item)) {
		return true;
	} else {
		return false;
	}
};

/**
 * 检查是否有成员装备该物品
 * Check if any member has item equipped
 *
 * @param {object} item - 物品对象 / Item object
 * @returns {boolean} 是否有成员装备 / Whether any member equipped
 */
Game_Party.prototype.isAnyMemberEquipped = function (item) {
	return this.members().some(function (actor) {
		return actor.equips().contains(item);
	});
};

/**
 * 获得物品
 * Gain item
 *
 * @param {object} item - 物品对象 / Item object
 * @param {number} amount - 数量 / Amount
 * @param {boolean} includeEquip - 是否包含装备 / Whether to include equipment
 */
Game_Party.prototype.gainItem = function (item, amount, includeEquip) {
	var container = this.itemContainer(item);
	if (container) {
		var lastNumber = this.numItems(item);
		var newNumber = lastNumber + amount;
		container[item.id] = newNumber.clamp(0, this.maxItems(item));
		if (container[item.id] === 0) {
			delete container[item.id];
		}
		if (includeEquip && newNumber < 0) {
			this.discardMembersEquip(item, -newNumber);
		}
		$gameMap.requestRefresh();
	}
};

/**
 * 丢弃成员装备
 * Discard members' equipment
 *
 * @param {object} item - 物品对象 / Item object
 * @param {number} amount - 数量 / Amount
 */
Game_Party.prototype.discardMembersEquip = function (item, amount) {
	var n = amount;
	this.members().forEach(function (actor) {
		while (n > 0 && actor.isEquipped(item)) {
			actor.discardEquip(item);
			n--;
		}
	});
};

/**
 * 失去物品
 * Lose item
 *
 * @param {object} item - 物品对象 / Item object
 * @param {number} amount - 数量 / Amount
 * @param {boolean} includeEquip - 是否包含装备 / Whether to include equipment
 */
Game_Party.prototype.loseItem = function (item, amount, includeEquip) {
	this.gainItem(item, -amount, includeEquip);
};

/**
 * 消耗物品
 * Consume item
 *
 * @param {object} item - 物品对象 / Item object
 */
Game_Party.prototype.consumeItem = function (item) {
	if (DataManager.isItem(item) && item.consumable) {
		this.loseItem(item, 1);
	}
};

/**
 * 检查是否可使用物品
 * Check if item can be used
 *
 * @param {object} item - 物品对象 / Item object
 * @returns {boolean} 是否可使用 / Whether can use
 */
Game_Party.prototype.canUse = function (item) {
	return this.members().some(function (actor) {
		return actor.canUse(item);
	});
};

/**
 * 检查是否可输入
 * Check if can input
 *
 * @returns {boolean} 是否可输入 / Whether can input
 */
Game_Party.prototype.canInput = function () {
	return this.members().some(function (actor) {
		return actor.canInput();
	});
};

/**
 * 检查是否全部死亡
 * Check if all members are dead
 *
 * @returns {boolean} 是否全部死亡 / Whether all are dead
 */
Game_Party.prototype.isAllDead = function () {
	if (Game_Unit.prototype.isAllDead.call(this)) {
		return this.inBattle() || !this.isEmpty();
	} else {
		return false;
	}
};

/**
 * 当玩家行走时的处理
 * Processing when player walks
 */
Game_Party.prototype.onPlayerWalk = function () {
	this.members().forEach(function (actor) {
		return actor.onPlayerWalk();
	});
};

/**
 * 获取菜单角色
 * Get menu actor
 * 菜单界面中选中的角色。
 * The actor selected in menu scene.
 *
 * @returns {Game_Actor} 菜单角色 / Menu actor
 */
Game_Party.prototype.menuActor = function () {
	var actor = $gameActors.actor(this._menuActorId);
	if (!this.members().contains(actor)) {
		actor = this.members()[0];
	}
	return actor;
};

/**
 * 设置菜单角色
 * Set menu actor
 * 设置菜单界面中选中的角色。
 * Set the actor selected in menu scene.
 *
 * @param {Game_Actor} actor - 角色对象 / Actor object
 */
Game_Party.prototype.setMenuActor = function (actor) {
	this._menuActorId = actor.actorId();
};

/**
 * 制作下一个菜单角色
 * Make next menu actor
 * 技能、装备和状态界面按 PageDown 后切换下一个角色。
 * Switch to next actor when PageDown is pressed in skill, equip and status scenes.
 */
Game_Party.prototype.makeMenuActorNext = function () {
	var index = this.members().indexOf(this.menuActor());
	if (index >= 0) {
		index = (index + 1) % this.members().length;
		this.setMenuActor(this.members()[index]);
	} else {
		this.setMenuActor(this.members()[0]);
	}
};

/**
 * 制作上一个菜单角色
 * Make previous menu actor
 * 技能、装备和状态界面按 PageUp 后切换上一个角色。
 * Switch to previous actor when PageUp is pressed in skill, equip and status scenes.
 */
Game_Party.prototype.makeMenuActorPrevious = function () {
	var index = this.members().indexOf(this.menuActor());
	if (index >= 0) {
		index = (index + this.members().length - 1) % this.members().length;
		this.setMenuActor(this.members()[index]);
	} else {
		this.setMenuActor(this.members()[0]);
	}
};

/**
 * 获取目标角色
 * Get target actor
 *
 * @returns {Game_Actor} 目标角色 / Target actor
 */
Game_Party.prototype.targetActor = function () {
	var actor = $gameActors.actor(this._targetActorId);
	if (!this.members().contains(actor)) {
		actor = this.members()[0];
	}
	return actor;
};

/**
 * 设置目标角色
 * Set target actor
 *
 * @param {Game_Actor} actor - 角色对象 / Actor object
 */
Game_Party.prototype.setTargetActor = function (actor) {
	this._targetActorId = actor.actorId();
};

/**
 * 获取上次使用的物品
 * Get last item used
 *
 * @returns {object} 上次使用的物品 / Last item used
 */
Game_Party.prototype.lastItem = function () {
	return this._lastItem.object();
};

/**
 * 设置上次使用的物品
 * Set last item used
 *
 * @param {object} item - 物品对象 / Item object
 */
Game_Party.prototype.setLastItem = function (item) {
	this._lastItem.setObject(item);
};

/**
 * 交换角色顺序
 * Swap actor order
 *
 * @param {number} index1 - 索引1 / Index 1
 * @param {number} index2 - 索引2 / Index 2
 */
Game_Party.prototype.swapOrder = function (index1, index2) {
	var temp = this._actors[index1];
	this._actors[index1] = this._actors[index2];
	this._actors[index2] = temp;
	$gamePlayer.refresh();
};

/**
 * 获取存档用的角色行走图
 * Get characters for save file
 *
 * @returns {Array} 角色行走图数组 / Characters array for save file
 */
Game_Party.prototype.charactersForSavefile = function () {
	return this.battleMembers().map(function (actor) {
		return [actor.characterName(), actor.characterIndex()];
	});
};

/**
 * 获取存档用的脸图
 * Get faces for save file
 *
 * @returns {Array} 脸图数组 / Faces array for save file
 */
Game_Party.prototype.facesForSavefile = function () {
	return this.battleMembers().map(function (actor) {
		return [actor.faceName(), actor.faceIndex()];
	});
};

/**
 * 检查队伍能力
 * Check party ability
 *
 * @param {number} abilityId - 能力ID / Ability ID
 * @returns {boolean} 是否拥有该能力 / Whether has the ability
 */
Game_Party.prototype.partyAbility = function (abilityId) {
	return this.battleMembers().some(function (actor) {
		return actor.partyAbility(abilityId);
	});
};

/**
 * 检查是否遇敌减半
 * Check if has encounter rate half
 *
 * @returns {boolean} 是否遇敌减半 / Whether has encounter rate half
 */
Game_Party.prototype.hasEncounterHalf = function () {
	return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};

/**
 * 检查是否无遇敌
 * Check if has no encounter
 *
 * @returns {boolean} 是否无遇敌 / Whether has no encounter
 */
Game_Party.prototype.hasEncounterNone = function () {
	return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};

/**
 * 检查是否取消偷袭
 * Check if can cancel surprise
 *
 * @returns {boolean} 是否取消偷袭 / Whether can cancel surprise
 */
Game_Party.prototype.hasCancelSurprise = function () {
	return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};

/**
 * 检查是否增加先发制人率
 * Check if can raise preemptive rate
 *
 * @returns {boolean} 是否增加先发制人率 / Whether can raise preemptive rate
 */
Game_Party.prototype.hasRaisePreemptive = function () {
	return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};

/**
 * 检查是否双倍金钱
 * Check if has double gold
 *
 * @returns {boolean} 是否双倍金钱 / Whether has double gold
 */
Game_Party.prototype.hasGoldDouble = function () {
	return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};

/**
 * 检查是否双倍掉落物品
 * Check if has double drop items
 *
 * @returns {boolean} 是否双倍掉落物品 / Whether has double drop items
 */
Game_Party.prototype.hasDropItemDouble = function () {
	return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};

/**
 * 计算先发制人概率
 * Calculate preemptive rate
 *
 * @param {number} troopAgi - 敌群敏捷度 / Troop agility
 * @returns {number} 先发制人概率 / Preemptive rate
 */
Game_Party.prototype.ratePreemptive = function (troopAgi) {
	var rate = this.agility() >= troopAgi ? 0.05 : 0.03;
	if (this.hasRaisePreemptive()) {
		rate *= 4;
	}
	return rate;
};

/**
 * 计算偷袭概率
 * Calculate surprise rate
 *
 * @param {number} troopAgi - 敌群敏捷度 / Troop agility
 * @returns {number} 偷袭概率 / Surprise rate
 */
Game_Party.prototype.rateSurprise = function (troopAgi) {
	var rate = this.agility() >= troopAgi ? 0.03 : 0.05;
	if (this.hasCancelSurprise()) {
		rate = 0;
	}
	return rate;
};

/**
 * 表现胜利
 * Perform victory
 */
Game_Party.prototype.performVictory = function () {
	this.members().forEach(function (actor) {
		actor.performVictory();
	});
};

/**
 * 表现逃跑
 * Perform escape
 */
Game_Party.prototype.performEscape = function () {
	this.members().forEach(function (actor) {
		actor.performEscape();
	});
};

/**
 * 移除战斗状态
 * Remove battle states
 */
Game_Party.prototype.removeBattleStates = function () {
	this.members().forEach(function (actor) {
		actor.removeBattleStates();
	});
};

/**
 * 请求动作刷新
 * Request motion refresh
 */
Game_Party.prototype.requestMotionRefresh = function () {
	this.members().forEach(function (actor) {
		actor.requestMotionRefresh();
	});
};
