//=============================================================================
// Game_Troop.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏敌群类
 * Game_Troop
 *
 * 敌群和战斗相关数据的游戏对象类。
 * The game object class for a troop and the battle-related data.
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Troop
 * @extends Game_Unit
 * @description 游戏敌群类，管理敌人群组和战斗数据
 * Game troop class that manages enemy groups and battle data
 */
function Game_Troop() {
	this.initialize.apply(this, arguments);
}

Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;

/**
 * 半角字母表
 * Half-width letter table
 * @type {Array}
 */
Game_Troop.LETTER_TABLE_HALF = [
	" A",
	" B",
	" C",
	" D",
	" E",
	" F",
	" G",
	" H",
	" I",
	" J",
	" K",
	" L",
	" M",
	" N",
	" O",
	" P",
	" Q",
	" R",
	" S",
	" T",
	" U",
	" V",
	" W",
	" X",
	" Y",
	" Z",
];

/**
 * 全角字母表
 * Full-width letter table
 * @type {Array}
 */
Game_Troop.LETTER_TABLE_FULL = [
	"Ａ",
	"Ｂ",
	"Ｃ",
	"Ｄ",
	"Ｅ",
	"Ｆ",
	"Ｇ",
	"Ｈ",
	"Ｉ",
	"Ｊ",
	"Ｋ",
	"Ｌ",
	"Ｍ",
	"Ｎ",
	"Ｏ",
	"Ｐ",
	"Ｑ",
	"Ｒ",
	"Ｓ",
	"Ｔ",
	"Ｕ",
	"Ｖ",
	"Ｗ",
	"Ｘ",
	"Ｙ",
	"Ｚ",
];

/**
 * 初始化敌群
 * Initialize troop
 */
Game_Troop.prototype.initialize = function () {
	Game_Unit.prototype.initialize.call(this);
	this._interpreter = new Game_Interpreter();
	this.clear();
};

/**
 * 检查事件是否运行中
 * Check if event is running
 *
 * @returns {boolean} 事件是否运行中 / Whether event is running
 */
Game_Troop.prototype.isEventRunning = function () {
	return this._interpreter.isRunning();
};

/**
 * 更新解释器
 * Update interpreter
 */
Game_Troop.prototype.updateInterpreter = function () {
	this._interpreter.update();
};

/**
 * 获取回合计数
 * Get turn count
 *
 * @returns {number} 回合计数 / Turn count
 */
Game_Troop.prototype.turnCount = function () {
	return this._turnCount;
};

/**
 * 获取敌群成员
 * Get troop members
 *
 * @returns {Array} 敌群成员数组 / Troop members array
 */
Game_Troop.prototype.members = function () {
	return this._enemies;
};

/**
 * 清除敌群数据
 * Clear troop data
 */
Game_Troop.prototype.clear = function () {
	this._interpreter.clear();
	this._troopId = 0;
	this._eventFlags = {};
	this._enemies = [];
	this._turnCount = 0;
	this._namesCount = {};
};

/**
 * 获取敌群数据
 * Get troop data
 *
 * @returns {object} 敌群数据 / Troop data
 */
Game_Troop.prototype.troop = function () {
	return $dataTroops[this._troopId];
};

/**
 * 设置敌群
 * Setup troop
 *
 * @param {number} troopId - 敌群ID / Troop ID
 */
Game_Troop.prototype.setup = function (troopId) {
	this.clear();
	this._troopId = troopId;
	this._enemies = [];
	this.troop().members.forEach(function (member) {
		if ($dataEnemies[member.enemyId]) {
			var enemyId = member.enemyId;
			var x = member.x;
			var y = member.y;
			var enemy = new Game_Enemy(enemyId, x, y);
			if (member.hidden) {
				enemy.hide();
			}
			this._enemies.push(enemy);
		}
	}, this);
	this.makeUniqueNames();
};

/**
 * 制作唯一的名称
 * Make unique names
 */
Game_Troop.prototype.makeUniqueNames = function () {
	var table = this.letterTable();
	this.members().forEach(function (enemy) {
		if (enemy.isAlive() && enemy.isLetterEmpty()) {
			var name = enemy.originalName();
			var n = this._namesCount[name] || 0;
			enemy.setLetter(table[n % table.length]);
			this._namesCount[name] = n + 1;
		}
	}, this);
	this.members().forEach(function (enemy) {
		var name = enemy.originalName();
		if (this._namesCount[name] >= 2) {
			enemy.setPlural(true);
		}
	}, this);
};

/**
 * 获取字母表
 * Get letter table
 *
 * @returns {Array} 字母表 / Letter table
 */
Game_Troop.prototype.letterTable = function () {
	return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL : Game_Troop.LETTER_TABLE_HALF;
};

/**
 * 获取敌人名称列表
 * Get enemy names list
 *
 * @returns {Array} 敌人名称数组 / Enemy names array
 */
Game_Troop.prototype.enemyNames = function () {
	var names = [];
	this.members().forEach(function (enemy) {
		var name = enemy.originalName();
		if (enemy.isAlive() && !names.contains(name)) {
			names.push(name);
		}
	});
	return names;
};

/**
 * 检查是否满足事件页条件
 * Check if meets event page conditions
 *
 * @param {object} page - 事件页 / Event page
 * @returns {boolean} 是否满足条件 / Whether meets conditions
 */
Game_Troop.prototype.meetsConditions = function (page) {
	var c = page.conditions;
	if (!c.turnEnding && !c.turnValid && !c.enemyValid && !c.actorValid && !c.switchValid) {
		return false; // Conditions not set
	}
	if (c.turnEnding) {
		if (!BattleManager.isTurnEnd()) {
			return false;
		}
	}
	if (c.turnValid) {
		var n = this._turnCount;
		var a = c.turnA;
		var b = c.turnB;
		if (b === 0 && n !== a) {
			return false;
		}
		if (b > 0 && (n < 1 || n < a || n % b !== a % b)) {
			return false;
		}
	}
	if (c.enemyValid) {
		var enemy = $gameTroop.members()[c.enemyIndex];
		if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
			return false;
		}
	}
	if (c.actorValid) {
		var actor = $gameActors.actor(c.actorId);
		if (!actor || actor.hpRate() * 100 > c.actorHp) {
			return false;
		}
	}
	if (c.switchValid) {
		if (!$gameSwitches.value(c.switchId)) {
			return false;
		}
	}
	return true;
};

/**
 * 设置战斗事件
 * Setup battle event
 */
Game_Troop.prototype.setupBattleEvent = function () {
	if (!this._interpreter.isRunning()) {
		if (this._interpreter.setupReservedCommonEvent()) {
			return;
		}
		var pages = this.troop().pages;
		for (var i = 0; i < pages.length; i++) {
			var page = pages[i];
			if (this.meetsConditions(page) && !this._eventFlags[i]) {
				this._interpreter.setup(page.list);
				if (page.span <= 1) {
					this._eventFlags[i] = true;
				}
				break;
			}
		}
	}
};

/**
 * 增加回合数
 * Increase turn count
 */
Game_Troop.prototype.increaseTurn = function () {
	var pages = this.troop().pages;
	for (var i = 0; i < pages.length; i++) {
		var page = pages[i];
		if (page.span === 1) {
			this._eventFlags[i] = false;
		}
	}
	this._turnCount++;
};

/**
 * 计算总经验值
 * Calculate total experience
 *
 * @returns {number} 总经验值 / Total experience
 */
Game_Troop.prototype.expTotal = function () {
	return this.deadMembers().reduce(function (r, enemy) {
		return r + enemy.exp();
	}, 0);
};

/**
 * 计算总金钱
 * Calculate total gold
 *
 * @returns {number} 总金钱 / Total gold
 */
Game_Troop.prototype.goldTotal = function () {
	return (
		this.deadMembers().reduce(function (r, enemy) {
			return r + enemy.gold();
		}, 0) * this.goldRate()
	);
};

/**
 * 获取金钱倍率
 * Get gold rate
 *
 * @returns {number} 金钱倍率 / Gold rate
 */
Game_Troop.prototype.goldRate = function () {
	return $gameParty.hasGoldDouble() ? 2 : 1;
};

/**
 * 制作掉落物品
 * Make drop items
 *
 * @returns {Array} 掉落物品数组 / Drop items array
 */
Game_Troop.prototype.makeDropItems = function () {
	return this.deadMembers().reduce(function (r, enemy) {
		return r.concat(enemy.makeDropItems());
	}, []);
};
