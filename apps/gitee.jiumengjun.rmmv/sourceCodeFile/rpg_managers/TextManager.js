/**
 * @fileoverview TextManager - 文本管理器
 * @description 操作用语和信息的静态类，管理游戏中的所有文本显示
 * The static class that handles terms and messages, manages all text display in the game
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * TextManager - 文本管理器
 *
 * 操作用语和信息的静态类。
 * 负责从数据库中获取各种文本，包括基本术语、指令、消息等，
 * 并提供统一的访问接口。
 *
 * The static class that handles terms and messages.
 * Responsible for retrieving various texts from the database, including basic terms,
 * commands, messages, etc., and providing a unified access interface.
 */
function TextManager() {
	throw new Error("This is a static class");
}

/**
 * 基本状态文本
 * Get basic status text
 *
 * @param {number} basicId - 基本状态ID / Basic status ID
 * @returns {string} 基本状态文本 / Basic status text
 */
TextManager.basic = function (basicId) {
	return $dataSystem.terms.basic[basicId] || "";
};

/**
 * 能力值文本
 * Get parameter text
 *
 * @param {number} paramId - 能力值ID / Parameter ID
 * @returns {string} 能力值文本 / Parameter text
 */
TextManager.param = function (paramId) {
	return $dataSystem.terms.params[paramId] || "";
};

/**
 * 指令文本
 * Get command text
 *
 * @param {number} commandId - 指令ID / Command ID
 * @returns {string} 指令文本 / Command text
 */
TextManager.command = function (commandId) {
	return $dataSystem.terms.commands[commandId] || "";
};

/**
 * 信息文本
 * Get message text
 *
 * @param {string} messageId - 信息ID / Message ID
 * @returns {string} 信息文本 / Message text
 */
TextManager.message = function (messageId) {
	return $dataSystem.terms.messages[messageId] || "";
};

/**
 * 获取器函数
 * 用于创建属性的getter方法
 *
 * Getter function
 * Used to create getter methods for properties
 *
 * @param {string} method - 方法名 / Method name
 * @param {*} param - 参数 / Parameter
 * @returns {Object} 属性描述符 / Property descriptor
 */
TextManager.getter = function (method, param) {
	return {
		get: function () {
			return this[method](param);
		},
		configurable: true,
	};
};

/**
 * 货币单位属性
 * Currency unit property
 */
Object.defineProperty(TextManager, "currencyUnit", {
	get: function () {
		return $dataSystem.currencyUnit;
	},
	configurable: true,
});

/**
 * 定义所有文本属性
 * 使用getter方法动态获取数据库中的文本
 *
 * Define all text properties
 * Use getter methods to dynamically retrieve text from database
 */
Object.defineProperties(TextManager, {
	level: TextManager.getter("basic", 0), // 等级 / Level
	levelA: TextManager.getter("basic", 1), // 等级（缩写）/ Level (abbreviated)
	hp: TextManager.getter("basic", 2), // HP / HP
	hpA: TextManager.getter("basic", 3), // HP（缩写）/ HP (abbreviated)
	mp: TextManager.getter("basic", 4), // MP / MP
	mpA: TextManager.getter("basic", 5), // MP（缩写）/ MP (abbreviated)
	tp: TextManager.getter("basic", 6), // TP / TP
	tpA: TextManager.getter("basic", 7), // TP（缩写）/ TP (abbreviated)
	exp: TextManager.getter("basic", 8), // 经验值 / Experience
	expA: TextManager.getter("basic", 9), // 经验值（缩写）/ Experience (abbreviated)
	fight: TextManager.getter("command", 0), // 战斗 / Fight
	escape: TextManager.getter("command", 1), // 逃跑 / Escape
	attack: TextManager.getter("command", 2), // 攻击 / Attack
	guard: TextManager.getter("command", 3), // 防御 / Guard
	item: TextManager.getter("command", 4), // 物品 / Item
	skill: TextManager.getter("command", 5), // 技能 / Skill
	equip: TextManager.getter("command", 6), // 装备 / Equip
	status: TextManager.getter("command", 7), // 状态 / Status
	formation: TextManager.getter("command", 8), // 整队 / Formation
	save: TextManager.getter("command", 9), // 保存 / Save
	gameEnd: TextManager.getter("command", 10), // 游戏结束 / Game End
	options: TextManager.getter("command", 11), // 设置 / Options
	weapon: TextManager.getter("command", 12), // 武器 / Weapon
	armor: TextManager.getter("command", 13), // 护甲 / Armor
	keyItem: TextManager.getter("command", 14), // 重要物品 / Key Item
	equip2: TextManager.getter("command", 15), // 装备 / Equip
	optimize: TextManager.getter("command", 16), // 最强装备 / Optimize
	clear: TextManager.getter("command", 17), // 清空 / Clear
	newGame: TextManager.getter("command", 18), // 开始游戏 / New Game
	continue_: TextManager.getter("command", 19), // 继续游戏 / Continue
	toTitle: TextManager.getter("command", 21), // 回到标题 / To Title
	cancel: TextManager.getter("command", 22), // 取消 / Cancel
	buy: TextManager.getter("command", 24), // 购买 / Buy
	sell: TextManager.getter("command", 25), // 出售 / Sell
	alwaysDash: TextManager.getter("message", "alwaysDash"), // 始终跑步 / Always Dash
	commandRemember: TextManager.getter("message", "commandRemember"), // 记住指令 / Command Remember
	bgmVolume: TextManager.getter("message", "bgmVolume"), // BGM 音量 / BGM Volume
	bgsVolume: TextManager.getter("message", "bgsVolume"), // BGS 音量 / BGS Volume
	meVolume: TextManager.getter("message", "meVolume"), // ME 音量 / ME Volume
	seVolume: TextManager.getter("message", "seVolume"), // SE 音量 / SE Volume
	possession: TextManager.getter("message", "possession"), // 持有数 / Possession
	expTotal: TextManager.getter("message", "expTotal"), // 现在的经验值 / Current Experience
	expNext: TextManager.getter("message", "expNext"), // 距离下一级还有 / Experience to Next Level
	saveMessage: TextManager.getter("message", "saveMessage"), // 存档信息 / Save Message
	loadMessage: TextManager.getter("message", "loadMessage"), // 读挡信息 / Load Message
	file: TextManager.getter("message", "file"), // 文件 / File
	partyName: TextManager.getter("message", "partyName"), // 队伍名 / Party Name
	emerge: TextManager.getter("message", "emerge"), // 出现 / Emerge
	preemptive: TextManager.getter("message", "preemptive"), // 先发制人 / Preemptive
	surprise: TextManager.getter("message", "surprise"), // 偷袭 / Surprise
	escapeStart: TextManager.getter("message", "escapeStart"), // 开始逃跑 / Escape Start
	escapeFailure: TextManager.getter("message", "escapeFailure"), // 逃跑失败 / Escape Failure
	victory: TextManager.getter("message", "victory"), // 胜利 / Victory
	defeat: TextManager.getter("message", "defeat"), // 战败 / Defeat
	obtainExp: TextManager.getter("message", "obtainExp"), // 获得经验值 / Obtain Experience
	obtainGold: TextManager.getter("message", "obtainGold"), // 获得金钱 / Obtain Gold
	obtainItem: TextManager.getter("message", "obtainItem"), // 获得物品 / Obtain Item
	levelUp: TextManager.getter("message", "levelUp"), // 升级 / Level Up
	obtainSkill: TextManager.getter("message", "obtainSkill"), // 学会技能 / Obtain Skill
	useItem: TextManager.getter("message", "useItem"), // 使用物品 / Use Item
	criticalToEnemy: TextManager.getter("message", "criticalToEnemy"), // 对敌人暴击 / Critical to Enemy
	criticalToActor: TextManager.getter("message", "criticalToActor"), // 对角色暴击 / Critical to Actor
	actorDamage: TextManager.getter("message", "actorDamage"), // 我方受伤 / Actor Damage
	actorRecovery: TextManager.getter("message", "actorRecovery"), // 我方恢复 / Actor Recovery
	actorGain: TextManager.getter("message", "actorGain"), // 我方点数增加 / Actor Gain
	actorLoss: TextManager.getter("message", "actorLoss"), // 我方点数减少 / Actor Loss
	actorDrain: TextManager.getter("message", "actorDrain"), // 我方点数吸收 / Actor Drain
	actorNoDamage: TextManager.getter("message", "actorNoDamage"), // 我方无伤 / Actor No Damage
	actorNoHit: TextManager.getter("message", "actorNoHit"), // 没有命中我方 / Actor No Hit
	enemyDamage: TextManager.getter("message", "enemyDamage"), // 敌人受伤 / Enemy Damage
	enemyRecovery: TextManager.getter("message", "enemyRecovery"), // 敌人恢复 / Enemy Recovery
	enemyGain: TextManager.getter("message", "enemyGain"), // 敌人点数增加 / Enemy Gain
	enemyLoss: TextManager.getter("message", "enemyLoss"), // 敌人点数减少 / Enemy Loss
	enemyDrain: TextManager.getter("message", "enemyDrain"), // 敌人点数吸收 / Enemy Drain
	enemyNoDamage: TextManager.getter("message", "enemyNoDamage"), // 敌人无伤 / Enemy No Damage
	enemyNoHit: TextManager.getter("message", "enemyNoHit"), // 没有命中敌人 / Enemy No Hit
	evasion: TextManager.getter("message", "evasion"), // 回避 / Evasion
	magicEvasion: TextManager.getter("message", "magicEvasion"), // 魔法回避 / Magic Evasion
	magicReflection: TextManager.getter("message", "magicReflection"), // 魔法反射 / Magic Reflection
	counterAttack: TextManager.getter("message", "counterAttack"), // 反击 / Counter Attack
	substitute: TextManager.getter("message", "substitute"), // 掩护 / Substitute
	buffAdd: TextManager.getter("message", "buffAdd"), // 强化 / Buff Add
	debuffAdd: TextManager.getter("message", "debuffAdd"), // 弱化 / Debuff Add
	buffRemove: TextManager.getter("message", "buffRemove"), // 解除强化/弱化 / Buff Remove
	actionFailure: TextManager.getter("message", "actionFailure"), // 行动失败 / Action Failure
});
