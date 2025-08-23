/**
 * @fileoverview Game_System - 游戏系统对象类
 * @description 负责管理游戏的系统设置和状态数据
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_系统
 * Game_System
 *
 * 系统数据的游戏对象类。
 * The game object class for the system data.
 *
 * @class Game_System
 * @description 管理游戏的系统设置，包括存档、菜单、遇敌等功能的启用状态，
 *              以及战斗统计、音频设置等系统级数据
 */
function Game_System() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_System object
 *
 * @memberof Game_System
 * @description 初始化系统对象的所有属性，设置默认状态
 */
Game_System.prototype.initialize = function () {
	this._saveEnabled = true; // 保存启用 - Save enabled
	this._menuEnabled = true; // 菜单启用 - Menu enabled
	this._encounterEnabled = true; // 遇敌启用 - Encounter enabled
	this._formationEnabled = true; // 整队启用 - Formation enabled
	this._battleCount = 0; // 战斗次数 - Battle count
	this._winCount = 0; // 胜利次数 - Win count
	this._escapeCount = 0; // 逃跑次数 - Escape count
	this._saveCount = 0; // 保存次数 - Save count
	this._versionId = 0; // 版本 ID - Version ID
	this._framesOnSave = 0; // 保存时的帧数 - Frames on save
	this._bgmOnSave = null; // 保存时的 BGM - BGM on save
	this._bgsOnSave = null; // 保存时的 BGS - BGS on save
	this._windowTone = null; // 窗口色调 - Window tone
	this._battleBgm = null; // 战斗 BGM - Battle BGM
	this._victoryMe = null; // 胜利 ME - Victory ME
	this._defeatMe = null; // 战败 ME - Defeat ME
	this._savedBgm = null; // 保存 BGM - Saved BGM
	this._walkingBgm = null; // 行走 BGM - Walking BGM
};

/**
 * 是否日文
 * Check if the language is Japanese
 *
 * @memberof Game_System
 * @returns {boolean} 如果是日文环境返回true
 */
Game_System.prototype.isJapanese = function () {
	return $dataSystem.locale.match(/^ja/);
};

/**
 * 是否中文
 * Check if the language is Chinese
 *
 * @memberof Game_System
 * @returns {boolean} 如果是中文环境返回true
 */
Game_System.prototype.isChinese = function () {
	return $dataSystem.locale.match(/^zh/);
};

/**
 * 是否韩文
 * Check if the language is Korean
 *
 * @memberof Game_System
 * @returns {boolean} 如果是韩文环境返回true
 */
Game_System.prototype.isKorean = function () {
	return $dataSystem.locale.match(/^ko/);
};

/**
 * 是否日文/中文/韩文
 * Check if the language is CJK (Chinese, Japanese, Korean)
 *
 * @memberof Game_System
 * @returns {boolean} 如果是CJK语言环境返回true
 */
Game_System.prototype.isCJK = function () {
	return $dataSystem.locale.match(/^(ja|zh|ko)/);
};

/**
 * 是否俄文
 * Check if the language is Russian
 *
 * @memberof Game_System
 * @returns {boolean} 如果是俄文环境返回true
 */
Game_System.prototype.isRussian = function () {
	return $dataSystem.locale.match(/^ru/);
};

/**
 * 是否侧面图
 * Check if using side view battle system
 * 数据库-系统-选项-使用 SideView 战斗系统
 *
 * @memberof Game_System
 * @returns {boolean} 如果使用侧面战斗系统返回true
 */
Game_System.prototype.isSideView = function () {
	return $dataSystem.optSideView;
};

/**
 * 是否存档启用
 * Check if save is enabled
 *
 * @memberof Game_System
 * @returns {boolean} 如果存档功能启用返回true
 */
Game_System.prototype.isSaveEnabled = function () {
	return this._saveEnabled;
};

/**
 * 禁用存档
 * Disable save function
 *
 * @memberof Game_System
 */
Game_System.prototype.disableSave = function () {
	this._saveEnabled = false;
};

/**
 * 启用存档
 * Enable save function
 *
 * @memberof Game_System
 */
Game_System.prototype.enableSave = function () {
	this._saveEnabled = true;
};

/**
 * 是否菜单启用
 * Check if menu is enabled
 *
 * @memberof Game_System
 * @returns {boolean} 如果菜单功能启用返回true
 */
Game_System.prototype.isMenuEnabled = function () {
	return this._menuEnabled;
};

/**
 * 禁用菜单
 * Disable menu function
 *
 * @memberof Game_System
 */
Game_System.prototype.disableMenu = function () {
	this._menuEnabled = false;
};

/**
 * 启用菜单
 * Enable menu function
 *
 * @memberof Game_System
 */
Game_System.prototype.enableMenu = function () {
	this._menuEnabled = true;
};

/**
 * 是否遇敌启用
 * Check if encounter is enabled
 *
 * @memberof Game_System
 * @returns {boolean} 如果遇敌功能启用返回true
 */
Game_System.prototype.isEncounterEnabled = function () {
	return this._encounterEnabled;
};

/**
 * 禁用遇敌
 * Disable encounter function
 *
 * @memberof Game_System
 */
Game_System.prototype.disableEncounter = function () {
	this._encounterEnabled = false;
};

/**
 * 启用遇敌
 * Enable encounter function
 *
 * @memberof Game_System
 */
Game_System.prototype.enableEncounter = function () {
	this._encounterEnabled = true;
};

/**
 * 是否整队启用
 * Check if formation is enabled
 *
 * @memberof Game_System
 * @returns {boolean} 如果整队功能启用返回true
 */
Game_System.prototype.isFormationEnabled = function () {
	return this._formationEnabled;
};

/**
 * 禁用整队
 * Disable formation function
 *
 * @memberof Game_System
 */
Game_System.prototype.disableFormation = function () {
	this._formationEnabled = false;
};

/**
 * 启用整队
 * Enable formation function
 *
 * @memberof Game_System
 */
Game_System.prototype.enableFormation = function () {
	this._formationEnabled = true;
};

/**
 * 战斗次数
 * Get battle count
 *
 * @memberof Game_System
 * @returns {number} 战斗总次数
 */
Game_System.prototype.battleCount = function () {
	return this._battleCount;
};

/**
 * 胜利次数
 * Get win count
 *
 * @memberof Game_System
 * @returns {number} 胜利总次数
 */
Game_System.prototype.winCount = function () {
	return this._winCount;
};

/**
 * 逃跑次数
 * Get escape count
 *
 * @memberof Game_System
 * @returns {number} 逃跑总次数
 */
Game_System.prototype.escapeCount = function () {
	return this._escapeCount;
};

/**
 * 保存次数
 * Get save count
 *
 * @memberof Game_System
 * @returns {number} 保存总次数
 */
Game_System.prototype.saveCount = function () {
	return this._saveCount;
};

/**
 * 版本 ID
 * Get version ID
 *
 * @memberof Game_System
 * @returns {number} 游戏版本ID
 */
Game_System.prototype.versionId = function () {
	return this._versionId;
};

/**
 * 窗口色调
 * Get window tone
 *
 * @memberof Game_System
 * @returns {Array} 窗口色调数组或系统默认色调
 */
Game_System.prototype.windowTone = function () {
	return this._windowTone || $dataSystem.windowTone;
};

/**
 * 设置窗口色调
 * Set window tone
 *
 * @memberof Game_System
 * @param {Array} value - 色调值数组
 */
Game_System.prototype.setWindowTone = function (value) {
	this._windowTone = value;
};

/**
 * 战斗 BGM
 * Get battle BGM
 *
 * @memberof Game_System
 * @returns {Object} 战斗背景音乐对象或系统默认BGM
 */
Game_System.prototype.battleBgm = function () {
	return this._battleBgm || $dataSystem.battleBgm;
};

/**
 * 设置战斗 BGM
 * Set battle BGM
 *
 * @memberof Game_System
 * @param {Object} value - 背景音乐对象
 */
Game_System.prototype.setBattleBgm = function (value) {
	this._battleBgm = value;
};

/**
 * 胜利 ME
 * Get victory ME
 *
 * @memberof Game_System
 * @returns {Object} 胜利音效对象或系统默认ME
 */
Game_System.prototype.victoryMe = function () {
	return this._victoryMe || $dataSystem.victoryMe;
};

/**
 * 设置胜利 ME
 * Set victory ME
 *
 * @memberof Game_System
 * @param {Object} value - 音效对象
 */
Game_System.prototype.setVictoryMe = function (value) {
	this._victoryMe = value;
};

/**
 * 战败 ME
 * Get defeat ME
 *
 * @memberof Game_System
 * @returns {Object} 战败音效对象或系统默认ME
 */
Game_System.prototype.defeatMe = function () {
	return this._defeatMe || $dataSystem.defeatMe;
};

/**
 * 设置战败 ME
 * Set defeat ME
 *
 * @memberof Game_System
 * @param {Object} value - 音效对象
 */
Game_System.prototype.setDefeatMe = function (value) {
	this._defeatMe = value;
};

/**
 * 当战斗开始
 * Called when battle starts
 *
 * @memberof Game_System
 */
Game_System.prototype.onBattleStart = function () {
	this._battleCount++;
};

/**
 * 当战斗胜利
 * Called when battle is won
 *
 * @memberof Game_System
 */
Game_System.prototype.onBattleWin = function () {
	this._winCount++;
};

/**
 * 当战斗逃跑
 * Called when escaping from battle
 *
 * @memberof Game_System
 */
Game_System.prototype.onBattleEscape = function () {
	this._escapeCount++;
};

/**
 * 当保存之前
 * Called before saving
 *
 * @memberof Game_System
 */
Game_System.prototype.onBeforeSave = function () {
	this._saveCount++;
	this._versionId = $dataSystem.versionId;
	this._framesOnSave = Graphics.frameCount;
	this._bgmOnSave = AudioManager.saveBgm();
	this._bgsOnSave = AudioManager.saveBgs();
};

/**
 * 当加载之后
 * Called after loading
 *
 * @memberof Game_System
 */
Game_System.prototype.onAfterLoad = function () {
	Graphics.frameCount = this._framesOnSave;
	AudioManager.playBgm(this._bgmOnSave);
	AudioManager.playBgs(this._bgsOnSave);
};

/**
 * 游戏时间
 * Get playtime in seconds
 *
 * @memberof Game_System
 * @returns {number} 游戏时间（秒）
 */
Game_System.prototype.playtime = function () {
	return Math.floor(Graphics.frameCount / 60);
};

/**
 * 游戏时间文本
 * Get playtime as formatted text
 *
 * @memberof Game_System
 * @returns {string} 格式化的游戏时间文本（HH:MM:SS）
 */
Game_System.prototype.playtimeText = function () {
	var hour = Math.floor(this.playtime() / 60 / 60);
	var min = Math.floor(this.playtime() / 60) % 60;
	var sec = this.playtime() % 60;
	return hour.padZero(2) + ":" + min.padZero(2) + ":" + sec.padZero(2);
};

/**
 * 保存 BGM
 * Save current BGM
 *
 * @memberof Game_System
 */
Game_System.prototype.saveBgm = function () {
	this._savedBgm = AudioManager.saveBgm();
};

/**
 * 还原 BGM
 * Restore saved BGM
 *
 * @memberof Game_System
 */
Game_System.prototype.replayBgm = function () {
	if (this._savedBgm) {
		AudioManager.replayBgm(this._savedBgm);
	}
};

/**
 * 保存行走 BGM
 * Save walking BGM
 * 上载具的时候保存当前的 BGM。
 * Save current BGM when getting on vehicle.
 *
 * @memberof Game_System
 */
Game_System.prototype.saveWalkingBgm = function () {
	this._walkingBgm = AudioManager.saveBgm();
};

/**
 * 还原行走 BGM
 * Restore walking BGM
 *
 * @memberof Game_System
 */
Game_System.prototype.replayWalkingBgm = function () {
	if (this._walkingBgm) {
		AudioManager.playBgm(this._walkingBgm);
	}
};

/**
 * 保存行走 BGM 2
 * Save walking BGM 2
 * 地图场景刚开始的时候如果在载具中就保存地图的 BGM。
 * Save map BGM when starting map scene if in vehicle.
 *
 * @memberof Game_System
 */
Game_System.prototype.saveWalkingBgm2 = function () {
	this._walkingBgm = $dataMap.bgm;
};
