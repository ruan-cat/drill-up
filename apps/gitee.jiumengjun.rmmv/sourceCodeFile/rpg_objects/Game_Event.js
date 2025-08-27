//=============================================================================
// Game_Event.js
//=============================================================================

/**
 * @fileoverview Game_Event - 游戏事件类
 *
 * 事件的游戏对象类。它包含用于事件页切换和运行并行处理事件的功能。
 * The game object class for an event. It contains functionality for event page
 * switching and running parallel process events.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * @class Game_Event
 * @extends Game_Character
 * @description 游戏事件类，用于表示地图上的事件对象
 * Game event class that represents event objects on the map
 */
function Game_Event() {
	this.initialize.apply(this, arguments);
}

Game_Event.prototype = Object.create(Game_Character.prototype);
Game_Event.prototype.constructor = Game_Event;

/**
 * 初始化事件
 * Initialize event
 *
 * @memberof Game_Event
 * @method initialize
 * @param {number} mapId - 地图 ID / Map ID
 * @param {number} eventId - 事件 ID / Event ID
 */
Game_Event.prototype.initialize = function (mapId, eventId) {
	Game_Character.prototype.initialize.call(this);
	this._mapId = mapId;
	this._eventId = eventId;
	this.locate(this.event().x, this.event().y);
	this.refresh();
};

/**
 * 初始化成员变量
 * Initialize member variables
 *
 * @memberof Game_Event
 * @method initMembers
 */
Game_Event.prototype.initMembers = function () {
	Game_Character.prototype.initMembers.call(this);
	this._moveType = 0;
	this._trigger = 0;
	this._starting = false;
	this._erased = false;
	this._pageIndex = -2;
	this._originalPattern = 1;
	this._originalDirection = 2;
	this._prelockDirection = 0;
	this._locked = false;
};

/**
 * 获取事件ID
 * Get event ID
 *
 * @memberof Game_Event
 * @method eventId
 * @returns {number} 事件ID / Event ID
 */
Game_Event.prototype.eventId = function () {
	return this._eventId;
};

/**
 * 获取事件数据
 * Get event data
 *
 * @memberof Game_Event
 * @method event
 * @returns {object} 事件数据 / Event data
 */
Game_Event.prototype.event = function () {
	return $dataMap.events[this._eventId];
};

/**
 * 获取当前事件页
 * Get current event page
 *
 * @memberof Game_Event
 * @method page
 * @returns {object} 事件页数据 / Event page data
 */
Game_Event.prototype.page = function () {
	return this.event().pages[this._pageIndex];
};

/**
 * 获取事件指令列表
 * Get event command list
 *
 * @memberof Game_Event
 * @method list
 * @returns {Array} 指令列表 / Command list
 */
Game_Event.prototype.list = function () {
	return this.page().list;
};

/**
 * 检查是否与人物碰撞（事件、载具和玩家）
 * Check if collided with characters (events, vehicles and player)
 *
 * @memberof Game_Event
 * @method isCollidedWithCharacters
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否碰撞 / Whether collided
 */
Game_Event.prototype.isCollidedWithCharacters = function (x, y) {
	return (
		Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) || this.isCollidedWithPlayerCharacters(x, y)
	);
};

/**
 * 检查是否与事件碰撞
 * Check if collided with events
 *
 * @memberof Game_Event
 * @method isCollidedWithEvents
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否碰撞 / Whether collided
 */
Game_Event.prototype.isCollidedWithEvents = function (x, y) {
	var events = $gameMap.eventsXyNt(x, y);
	return events.length > 0;
};

/**
 * 检查是否与玩家碰撞
 * Check if collided with player
 *
 * @memberof Game_Event
 * @method isCollidedWithPlayerCharacters
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否碰撞 / Whether collided
 */
Game_Event.prototype.isCollidedWithPlayerCharacters = function (x, y) {
	return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
};

/**
 * 锁定事件朝向
 * Lock event direction
 *
 * @memberof Game_Event
 * @method lock
 */
Game_Event.prototype.lock = function () {
	if (!this._locked) {
		this._prelockDirection = this.direction();
		this.turnTowardPlayer();
		this._locked = true;
	}
};

/**
 * 解锁事件朝向
 * Unlock event direction
 *
 * @memberof Game_Event
 * @method unlock
 */
Game_Event.prototype.unlock = function () {
	if (this._locked) {
		this._locked = false;
		this.setDirection(this._prelockDirection);
	}
};

/**
 * 更新停止状态
 * Update stop state
 *
 * @memberof Game_Event
 * @method updateStop
 */
Game_Event.prototype.updateStop = function () {
	if (this._locked) {
		this.resetStopCount();
	}
	Game_Character.prototype.updateStop.call(this);
	if (!this.isMoveRouteForcing()) {
		this.updateSelfMovement();
	}
};

/**
 * 更新自身移动
 * Update self movement
 *
 * @memberof Game_Event
 * @method updateSelfMovement
 */
Game_Event.prototype.updateSelfMovement = function () {
	if (!this._locked && this.isNearTheScreen() && this.checkStop(this.stopCountThreshold())) {
		switch (this._moveType) {
			case 1:
				this.moveTypeRandom();
				break;
			case 2:
				this.moveTypeTowardPlayer();
				break;
			case 3:
				this.moveTypeCustom();
				break;
		}
	}
};

/**
 * 获取停止计数的阈值
 * Get stop count threshold
 *
 * @memberof Game_Event
 * @method stopCountThreshold
 * @returns {number} 阈值 / Threshold
 */
Game_Event.prototype.stopCountThreshold = function () {
	return 30 * (5 - this.moveFrequency());
};

/**
 * 随机移动类型
 * Random movement type
 *
 * @memberof Game_Event
 * @method moveTypeRandom
 */
Game_Event.prototype.moveTypeRandom = function () {
	switch (Math.randomInt(6)) {
		case 0:
		case 1:
			this.moveRandom();
			break;
		case 2:
		case 3:
		case 4:
			this.moveForward();
			break;
		case 5:
			this.resetStopCount();
			break;
	}
};

/**
 * 朝向玩家移动类型
 * Movement type toward player
 *
 * @memberof Game_Event
 * @method moveTypeTowardPlayer
 */
Game_Event.prototype.moveTypeTowardPlayer = function () {
	if (this.isNearThePlayer()) {
		switch (Math.randomInt(6)) {
			case 0:
			case 1:
			case 2:
			case 3:
				this.moveTowardPlayer();
				break;
			case 4:
				this.moveRandom();
				break;
			case 5:
				this.moveForward();
				break;
		}
	} else {
		this.moveRandom();
	}
};

/**
 * 检查是否在玩家附近
 * Check if near the player
 *
 * @memberof Game_Event
 * @method isNearThePlayer
 * @returns {boolean} 是否在附近 / Whether near
 */
Game_Event.prototype.isNearThePlayer = function () {
	var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
	var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
	return sx + sy < 20;
};

/**
 * 自定义移动类型
 * Custom movement type
 *
 * @memberof Game_Event
 * @method moveTypeCustom
 */
Game_Event.prototype.moveTypeCustom = function () {
	this.updateRoutineMove();
};

/**
 * 检查是否开始
 * Check if starting
 *
 * @memberof Game_Event
 * @method isStarting
 * @returns {boolean} 是否开始 / Whether starting
 */
Game_Event.prototype.isStarting = function () {
	return this._starting;
};

/**
 * 清除开始标志
 * Clear starting flag
 *
 * @memberof Game_Event
 * @method clearStartingFlag
 */
Game_Event.prototype.clearStartingFlag = function () {
	this._starting = false;
};

/**
 * 检查是否触发条件在其中
 * Check if trigger condition is in
 *
 * @memberof Game_Event
 * @method isTriggerIn
 * @param {Array} triggers - 触发条件数组 / Trigger conditions array
 * @returns {boolean} 是否在其中 / Whether in
 */
Game_Event.prototype.isTriggerIn = function (triggers) {
	return triggers.contains(this._trigger);
};

/**
 * 开始事件
 * Start event
 *
 * @memberof Game_Event
 * @method start
 */
Game_Event.prototype.start = function () {
	var list = this.list();
	if (list && list.length > 1) {
		this._starting = true;
		if (this.isTriggerIn([0, 1, 2])) {
			this.lock();
		}
	}
};

/**
 * 消除事件
 * Erase event
 *
 * @memberof Game_Event
 * @method erase
 */
Game_Event.prototype.erase = function () {
	this._erased = true;
	this.refresh();
};

/**
 * 刷新事件
 * Refresh event
 *
 * @memberof Game_Event
 * @method refresh
 */
Game_Event.prototype.refresh = function () {
	var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
	if (this._pageIndex !== newPageIndex) {
		this._pageIndex = newPageIndex;
		this.setupPage();
	}
};

/**
 * 寻找适当的页面索引
 * Find proper page index
 *
 * @memberof Game_Event
 * @method findProperPageIndex
 * @returns {number} 页面索引 / Page index
 */
Game_Event.prototype.findProperPageIndex = function () {
	var pages = this.event().pages;
	for (var i = pages.length - 1; i >= 0; i--) {
		var page = pages[i];
		if (this.meetsConditions(page)) {
			return i;
		}
	}
	return -1;
};

/**
 * 检查是否满足条件
 * Check if meets conditions
 *
 * @memberof Game_Event
 * @method meetsConditions
 * @param {object} page - 事件页数据 / Event page data
 * @returns {boolean} 是否满足 / Whether meets
 */
Game_Event.prototype.meetsConditions = function (page) {
	var c = page.conditions;
	if (c.switch1Valid) {
		if (!$gameSwitches.value(c.switch1Id)) {
			return false;
		}
	}
	if (c.switch2Valid) {
		if (!$gameSwitches.value(c.switch2Id)) {
			return false;
		}
	}
	if (c.variableValid) {
		if ($gameVariables.value(c.variableId) < c.variableValue) {
			return false;
		}
	}
	if (c.selfSwitchValid) {
		var key = [this._mapId, this._eventId, c.selfSwitchCh];
		if ($gameSelfSwitches.value(key) !== true) {
			return false;
		}
	}
	if (c.itemValid) {
		var item = $dataItems[c.itemId];
		if (!$gameParty.hasItem(item)) {
			return false;
		}
	}
	if (c.actorValid) {
		var actor = $gameActors.actor(c.actorId);
		if (!$gameParty.members().contains(actor)) {
			return false;
		}
	}
	return true;
};

/**
 * 设置事件页
 * Setup event page
 *
 * @memberof Game_Event
 * @method setupPage
 */
Game_Event.prototype.setupPage = function () {
	if (this._pageIndex >= 0) {
		this.setupPageSettings();
	} else {
		this.clearPageSettings();
	}
	this.refreshBushDepth();
	this.clearStartingFlag();
	this.checkEventTriggerAuto();
};

/**
 * 清除页面设置
 * Clear page settings
 *
 * @memberof Game_Event
 * @method clearPageSettings
 */
Game_Event.prototype.clearPageSettings = function () {
	this.setImage("", 0);
	this._moveType = 0;
	this._trigger = null;
	this._interpreter = null;
	this.setThrough(true);
};

/**
 * 设置页面设置
 * Setup page settings
 *
 * @memberof Game_Event
 * @method setupPageSettings
 */
Game_Event.prototype.setupPageSettings = function () {
	var page = this.page();
	var image = page.image;
	if (image.tileId > 0) {
		this.setTileImage(image.tileId);
	} else {
		this.setImage(image.characterName, image.characterIndex);
	}
	if (this._originalDirection !== image.direction) {
		this._originalDirection = image.direction;
		this._prelockDirection = 0;
		this.setDirectionFix(false);
		this.setDirection(image.direction);
	}
	if (this._originalPattern !== image.pattern) {
		this._originalPattern = image.pattern;
		this.setPattern(image.pattern);
	}
	this.setMoveSpeed(page.moveSpeed);
	this.setMoveFrequency(page.moveFrequency);
	this.setPriorityType(page.priorityType);
	this.setWalkAnime(page.walkAnime);
	this.setStepAnime(page.stepAnime);
	this.setDirectionFix(page.directionFix);
	this.setThrough(page.through);
	this.setMoveRoute(page.moveRoute);
	this._moveType = page.moveType;
	this._trigger = page.trigger;
	if (this._trigger === 4) {
		this._interpreter = new Game_Interpreter();
	} else {
		this._interpreter = null;
	}
};

/**
 * 检查是否为起始图案
 * Check if original pattern
 *
 * @memberof Game_Event
 * @method isOriginalPattern
 * @returns {boolean} 是否为起始图案 / Whether original pattern
 */
Game_Event.prototype.isOriginalPattern = function () {
	return this.pattern() === this._originalPattern;
};

/**
 * 重置图案
 * Reset pattern
 *
 * @memberof Game_Event
 * @method resetPattern
 */
Game_Event.prototype.resetPattern = function () {
	this.setPattern(this._originalPattern);
};

/**
 * 检测接触的事件触发条件
 * Check event trigger on touch
 *
 * @memberof Game_Event
 * @method checkEventTriggerTouch
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 */
Game_Event.prototype.checkEventTriggerTouch = function (x, y) {
	if (!$gameMap.isEventRunning()) {
		if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
			if (!this.isJumping() && this.isNormalPriority()) {
				this.start();
			}
		}
	}
};

/**
 * 检测自动执行的事件触发条件
 * Check event trigger auto
 *
 * @memberof Game_Event
 * @method checkEventTriggerAuto
 */
Game_Event.prototype.checkEventTriggerAuto = function () {
	if (this._trigger === 3) {
		this.start();
	}
};

/**
 * 更新事件
 * Update event
 *
 * @memberof Game_Event
 * @method update
 */
Game_Event.prototype.update = function () {
	Game_Character.prototype.update.call(this);
	this.checkEventTriggerAuto();
	this.updateParallel();
};

/**
 * 更新并行处理
 * Update parallel processing
 *
 * @memberof Game_Event
 * @method updateParallel
 */
Game_Event.prototype.updateParallel = function () {
	if (this._interpreter) {
		if (!this._interpreter.isRunning()) {
			this._interpreter.setup(this.list(), this._eventId);
		}
		this._interpreter.update();
	}
};

/**
 * 放置事件
 * Locate event
 *
 * @memberof Game_Event
 * @method locate
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 */
Game_Event.prototype.locate = function (x, y) {
	Game_Character.prototype.locate.call(this, x, y);
	this._prelockDirection = 0;
};

/**
 * 强制移动路线
 * Force move route
 *
 * @memberof Game_Event
 * @method forceMoveRoute
 * @param {object} moveRoute - 移动路线 / Move route
 */
Game_Event.prototype.forceMoveRoute = function (moveRoute) {
	Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
	this._prelockDirection = 0;
};
