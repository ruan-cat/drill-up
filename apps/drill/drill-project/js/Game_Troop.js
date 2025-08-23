/**
 * Game_Troop.js
 *
 * @fileoverview RPG Maker MV - Enemy Troop Management
 * @author RPG Maker Team & Community
 * @version 1.0.0
 *
 * @description
 * 敌群管理类 - 负责战斗中敌群的管理、事件处理和结算
 * Enemy Troop Management - Handles enemy group management, event processing and battle results
 *
 * 功能模块 Function Modules:
 * - 2A数据库 Database - Enemy troop data and member management
 * - 2B敌群事件 Troop Events - Battle event interpretation and execution
 * - 2C回合 Turns - Turn counting and management
 * - 2D唯一命名 Unique Naming - Enemy naming system with letter suffixes
 * - 2E敌群结算 Battle Results - Experience, gold and item calculation
 */

//=============================================================================
// ** Game_Troop
//=============================================================================

/**
 * @class Game_Troop
 * @extends Game_Unit
 * @description
 * 敌群类 - 管理战斗中的敌人队伍，包括敌人数据、战斗事件、回合管理等
 * Enemy troop class - Manages enemy group in battle, including enemy data, battle events, turn management
 */
function Game_Troop() {
	this.initialize.apply(this, arguments);
}

Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;

//==============================
// * Enemy Troop - Initialize
// * 敌群 - 初始化
//==============================
/**
 * @method initialize
 * @description
 * 初始化敌群对象
 * Initialize the enemy troop object
 */
Game_Troop.prototype.initialize = function () {
	Game_Unit.prototype.initialize.call(this);

	/**
	 * @property {Game_Interpreter} _interpreter
	 * @description 2B敌群事件 - 解释器 / Troop event interpreter
	 */
	this._interpreter = new Game_Interpreter();

	this.clear(); // Data initialization / 数据初始化
};

//==============================
// * Database - Data Initialization
// * 2A数据库 - 数据初始化
//==============================
/**
 * @method clear
 * @description
 * 清空并初始化所有敌群数据
 * Clear and initialize all troop data
 */
Game_Troop.prototype.clear = function () {
	this._interpreter.clear(); // Troop event interpreter (for battle scene) / 2B敌群事件 - 解释器（战斗界面用）

	/**
	 * @property {number} _troopId
	 * @description 2A数据库 - 敌群ID / Database - Troop ID
	 */
	this._troopId = 0;

	/**
	 * @property {Game_Enemy[]} _enemies
	 * @description 2A数据库 - 敌人数据组 / Database - Enemy data array
	 */
	this._enemies = [];

	/**
	 * @property {Object} _eventFlags
	 * @description 2C回合 - 回合条件 / Turn conditions
	 */
	this._eventFlags = {};

	/**
	 * @property {number} _turnCount
	 * @description 2C回合 - 回合数 / Turn count
	 */
	this._turnCount = 0;

	/**
	 * @property {Object} _namesCount
	 * @description 2D唯一命名 - 重复名称计数器 / Unique naming - Duplicate name counter
	 */
	this._namesCount = {};
};

//==============================
// * Database - Load Troop Data
// * 2A数据库 - 载入敌群数据
//
// Note: This function is called by BattleManager.setup, refreshed before each battle
// 说明：该函数被 BattleManager.setup 调用，即每次开始战斗前，会重刷一次。
//==============================
/**
 * @method setup
 * @param {number} troopId - 敌群ID / Troop ID
 * @description
 * 设置敌群数据，创建敌人实例
 * Setup troop data and create enemy instances
 */
Game_Troop.prototype.setup = function (troopId) {
	this.clear(); // Data initialization / 数据初始化

	this._troopId = troopId;
	this._enemies = [];

	// Create enemy units / 建立敌人单位
	this.troop().members.forEach(function (member) {
		if ($dataEnemies[member.enemyId]) {
			var enemyId = member.enemyId;
			var x = member.x;
			var y = member.y;
			var enemy = new Game_Enemy(enemyId, x, y);

			// Hidden appearance flag / 中途出现标记
			if (member.hidden) {
				enemy.hide();
			}
			this._enemies.push(enemy);
		}
	}, this);

	// Unique naming / 唯一命名
	this.makeUniqueNames();
};

//==============================
// * Database - Properties
// * 2A数据库 - 属性
//==============================
/**
 * @method troop
 * @returns {Object} 敌群数据库对象 / Troop database object
 * @description 获取当前敌群的数据库信息 / Get current troop database info
 */
Game_Troop.prototype.troop = function () {
	return $dataTroops[this._troopId];
};

/**
 * @method members
 * @returns {Game_Enemy[]} 敌人容器 / Enemy container
 * @description 获取敌群中的所有敌人 / Get all enemies in the troop
 */
Game_Troop.prototype.members = function () {
	return this._enemies;
};

//==============================
// * Troop Events - Update Interpreter Frame
// * 2B敌群事件 - 帧刷新解释器
//
// Note: This class does not contain frame refresh, this function is executed by BattleManager.updateEventMain
// 说明：该类 不含帧刷新，该函数被 BattleManager.updateEventMain 执行。
//==============================
/**
 * @method updateInterpreter
 * @description
 * 更新事件解释器
 * Update the event interpreter
 */
Game_Troop.prototype.updateInterpreter = function () {
	this._interpreter.update();
};

//==============================
// * Troop Events - Check if Serial Event is Running
// * 2B敌群事件 - 是否正在运行串行事件
//==============================
/**
 * @method isEventRunning
 * @returns {boolean} 是否有事件正在运行 / Whether an event is running
 * @description 检查是否有敌群事件正在执行 / Check if a troop event is executing
 */
Game_Troop.prototype.isEventRunning = function () {
	return this._interpreter.isRunning();
};

//==============================
// * Troop Events - Setup Battle Event
// * 2B敌群事件 - 设置战斗事件
//
// Note: Battle event pages are embedded with troop data, one troop equals one event with multiple event pages
// 说明：这里的战斗事件页与敌群数据是嵌入在一起的，一个敌群相当于一个事件，含多个事件页。
//==============================
/**
 * @method setupBattleEvent
 * @description
 * 设置并启动符合条件的战斗事件
 * Setup and start battle events that meet conditions
 */
Game_Troop.prototype.setupBattleEvent = function () {
	if (!this._interpreter.isRunning()) {
		// Common event case / 公共事件情况
		if (this._interpreter.setupReservedCommonEvent()) {
			return;
		}

		// Battle events (event pages) / 战斗事件（事件页）
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

//==============================
// * Troop Events - Check Event Page Conditions
// * 2B敌群事件 - 判断事件页条件
//==============================
/**
 * @method meetsConditions
 * @param {Object} page - 事件页对象 / Event page object
 * @returns {boolean} 是否满足触发条件 / Whether trigger conditions are met
 * @description 检查事件页的触发条件是否满足 / Check if event page trigger conditions are satisfied
 */
Game_Troop.prototype.meetsConditions = function (page) {
	var c = page.conditions;

	// Condition - Do not execute (when no conditions are defined, this event page is invalid)
	// 条件 - 不执行（未定义任何条件时，该事件页作废）
	if (!c.turnEnding && !c.turnValid && !c.enemyValid && !c.actorValid && !c.switchValid) {
		return false;
	}

	// Condition - Turn ending / 条件 - 回合结束
	if (c.turnEnding) {
		if (!BattleManager.isTurnEnd()) {
			return false;
		}
	}

	// Condition - Turn / 条件 - 回合
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

	// Condition - Enemy HP / 条件 - 敌人HP
	if (c.enemyValid) {
		var enemy = $gameTroop.members()[c.enemyIndex];
		if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
			return false;
		}
	}

	// Condition - Actor HP / 条件 - 角色HP
	if (c.actorValid) {
		var actor = $gameActors.actor(c.actorId);
		if (!actor || actor.hpRate() * 100 > c.actorHp) {
			return false;
		}
	}

	// Condition - Switch / 条件 - 开关
	if (c.switchValid) {
		if (!$gameSwitches.value(c.switchId)) {
			return false;
		}
	}
	return true;
};

//==============================
// * Turns - Turn Count
// * 2C回合 - 回合数
//==============================
/**
 * @method turnCount
 * @returns {number} 当前回合数 / Current turn count
 * @description 获取当前战斗回合数 / Get current battle turn count
 */
Game_Troop.prototype.turnCount = function () {
	return this._turnCount;
};

//==============================
// * Turns - Advance to Next Turn
// * 2C回合 - 进入下一回合
//==============================
/**
 * @method increaseTurn
 * @description
 * 进入下一回合，重置相关事件标记
 * Advance to next turn and reset related event flags
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

//==============================
// * Unique Naming - Constants
// * 2D唯一命名 - 常量
//==============================
/**
 * @static
 * @property {string[]} LETTER_TABLE_HALF
 * @description 半角字母表 / Half-width letter table
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
 * @static
 * @property {string[]} LETTER_TABLE_FULL
 * @description 全角字母表 / Full-width letter table
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

//==============================
// * Unique Naming - Setup Naming
// * 2D唯一命名 - 设置命名
//==============================
/**
 * @method makeUniqueNames
 * @description
 * 为同名敌人设置唯一的字母后缀
 * Set unique letter suffixes for enemies with same names
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

//==============================
// * Unique Naming - Letter Table by Language (Unused)
// * 2D唯一命名 - 根据语种判断单字符与半字符（用不上）
//==============================
/**
 * @method letterTable
 * @returns {string[]} 字母表数组 / Letter table array
 * @description 根据语言设置返回相应的字母表 / Return appropriate letter table based on language settings
 */
Game_Troop.prototype.letterTable = function () {
	return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL : Game_Troop.LETTER_TABLE_HALF;
};

//==============================
// * Unique Naming - Get Enemy Names
// * 2D唯一命名 - 获取敌人名称
//==============================
/**
 * @method enemyNames
 * @returns {string[]} 敌人名称数组 / Enemy names array
 * @description 获取所有存活敌人的不重复名称列表 / Get unique names list of all alive enemies
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

//==============================
// * Battle Results - Get Total Gold
// * 2E敌群结算 - 获取金钱总量
//==============================
/**
 * @method goldTotal
 * @returns {number} 总金钱数 / Total gold amount
 * @description 计算战斗胜利后获得的总金钱 / Calculate total gold gained after battle victory
 */
Game_Troop.prototype.goldTotal = function () {
	return (
		this.deadMembers().reduce(function (r, enemy) {
			return r + enemy.gold();
		}, 0) * this.goldRate()
	);
};

//==============================
// * Battle Results - Gold Rate (Traits > Party Ability > Double Gold)
// * 2E敌群结算 - 获取金钱总量 - 金钱倍率（特性 > 队伍能力 > 双倍金钱）
//==============================
/**
 * @method goldRate
 * @returns {number} 金钱倍率 / Gold rate multiplier
 * @description 获取金钱获得倍率 / Get gold gain multiplier
 */
Game_Troop.prototype.goldRate = function () {
	return $gameParty.hasGoldDouble() ? 2 : 1;
};

//==============================
// * Battle Results - Get Total Experience
// * 2E敌群结算 - 获取经验总量
//==============================
/**
 * @method expTotal
 * @returns {number} 总经验值 / Total experience points
 * @description 计算战斗胜利后获得的总经验值 / Calculate total experience gained after battle victory
 */
Game_Troop.prototype.expTotal = function () {
	return this.deadMembers().reduce(function (r, enemy) {
		return r + enemy.exp();
	}, 0);
};

//==============================
// * Battle Results - Dropped Items
// * 2E敌群结算 - 掉落的物品
//==============================
/**
 * @method makeDropItems
 * @returns {Object[]} 掉落物品数组 / Dropped items array
 * @description 生成战斗胜利后的掉落物品列表 / Generate dropped items list after battle victory
 */
Game_Troop.prototype.makeDropItems = function () {
	return this.deadMembers().reduce(function (r, enemy) {
		return r.concat(enemy.makeDropItems());
	}, []);
};
