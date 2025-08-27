/**
 * @fileoverview Game_Player - 游戏玩家类
 *
 * 玩家的游戏对象类。它包含事件开始判定和地图滚动功能。
 * The game object class for the player. It contains event starting
 * determinants and map scrolling functions.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 游戏玩家类
 * Game player class
 *
 * @class Game_Player
 * @constructor
 * @extends Game_Character
 */
function Game_Player() {
	this.initialize.apply(this, arguments);
}

Game_Player.prototype = Object.create(Game_Character.prototype);
Game_Player.prototype.constructor = Game_Player;

/**
 * 初始化玩家对象
 * Initialize player object
 *
 * @memberof Game_Player
 * @method initialize
 */
Game_Player.prototype.initialize = function () {
	Game_Character.prototype.initialize.call(this);
	this.setTransparent($dataSystem.optTransparent);
};

/**
 * 初始化成员变量
 * Initialize member variables
 *
 * @memberof Game_Player
 * @method initMembers
 */
Game_Player.prototype.initMembers = function () {
	Game_Character.prototype.initMembers.call(this);
	this._vehicleType = "walk";
	this._vehicleGettingOn = false;
	this._vehicleGettingOff = false;
	this._dashing = false;
	this._needsMapReload = false;
	this._transferring = false;
	this._newMapId = 0;
	this._newX = 0;
	this._newY = 0;
	this._newDirection = 0;
	this._fadeType = 0;
	this._followers = new Game_Followers();
	this._encounterCount = 0;
};

/**
 * 清除场所移动信息
 * Clear transfer info
 *
 * @memberof Game_Player
 * @method clearTransferInfo
 */
Game_Player.prototype.clearTransferInfo = function () {
	this._transferring = false;
	this._newMapId = 0;
	this._newX = 0;
	this._newY = 0;
	this._newDirection = 0;
};

/**
 * 获取跟随者
 * Get followers
 *
 * @memberof Game_Player
 * @method followers
 * @returns {Game_Followers} 跟随者对象 - Followers object
 */
Game_Player.prototype.followers = function () {
	return this._followers;
};

/**
 * 刷新
 * Refresh
 *
 * @memberof Game_Player
 * @method refresh
 */
Game_Player.prototype.refresh = function () {
	var actor = $gameParty.leader();
	var characterName = actor ? actor.characterName() : "";
	var characterIndex = actor ? actor.characterIndex() : 0;
	this.setImage(characterName, characterIndex);
	this._followers.refresh();
};

/**
 * 检查是否停止中
 * Check if stopping
 *
 * @memberof Game_Player
 * @method isStopping
 * @returns {Boolean} 是否停止中 - Whether stopping
 */
Game_Player.prototype.isStopping = function () {
	if (this._vehicleGettingOn || this._vehicleGettingOff) {
		return false;
	}
	return Game_Character.prototype.isStopping.call(this);
};

/**
 * 储存场所移动
 * Reserve transfer
 *
 * @memberof Game_Player
 * @method reserveTransfer
 * @param {Number} mapId - 地图ID - Map ID
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 * @param {Number} d - 方向 - Direction
 * @param {Number} fadeType - 渐变类型 - Fade type
 */
Game_Player.prototype.reserveTransfer = function (mapId, x, y, d, fadeType) {
	this._transferring = true;
	this._newMapId = mapId;
	this._newX = x;
	this._newY = y;
	this._newDirection = d;
	this._fadeType = fadeType;
};

/**
 * 请求地图重载
 * Request map reload
 *
 * @memberof Game_Player
 * @method requestMapReload
 */
Game_Player.prototype.requestMapReload = function () {
	this._needsMapReload = true;
};

/**
 * 是否场所移动中
 * Whether transferring
 *
 * @memberof Game_Player
 * @method isTransferring
 * @returns {Boolean} 是否场所移动中 - Whether transferring
 */
Game_Player.prototype.isTransferring = function () {
	return this._transferring;
};

/**
 * 新地图 ID
 * New map ID
 *
 * @memberof Game_Player
 * @method newMapId
 * @returns {Number} 新地图ID - New map ID
 */
Game_Player.prototype.newMapId = function () {
	return this._newMapId;
};

/**
 * 渐变类型
 * Fade type
 *
 * @memberof Game_Player
 * @method fadeType
 * @returns {Number} 渐变类型 - Fade type
 */
Game_Player.prototype.fadeType = function () {
	return this._fadeType;
};

/**
 * 表现场所移动
 * Perform transfer
 *
 * @memberof Game_Player
 * @method performTransfer
 */
Game_Player.prototype.performTransfer = function () {
	if (this.isTransferring()) {
		this.setDirection(this._newDirection);
		if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
			$gameMap.setup(this._newMapId);
			this._needsMapReload = false;
		}
		this.locate(this._newX, this._newY);
		this.refresh();
		this.clearTransferInfo();
	}
};

/**
 * 是否地图可通行
 * Whether map passable
 *
 * @memberof Game_Player
 * @method isMapPassable
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 * @param {Number} d - 方向 - Direction
 * @returns {Boolean} 是否可通行 - Whether passable
 */
Game_Player.prototype.isMapPassable = function (x, y, d) {
	var vehicle = this.vehicle();
	if (vehicle) {
		return vehicle.isMapPassable(x, y, d);
	} else {
		return Game_Character.prototype.isMapPassable.call(this, x, y, d);
	}
};

/**
 * 载具
 * Vehicle
 *
 * @memberof Game_Player
 * @method vehicle
 * @returns {Game_Vehicle} 载具对象 - Vehicle object
 */
Game_Player.prototype.vehicle = function () {
	return $gameMap.vehicle(this._vehicleType);
};

/**
 * 是否在小舟
 * Whether in boat
 *
 * @memberof Game_Player
 * @method isInBoat
 * @returns {Boolean} 是否在小舟 - Whether in boat
 */
Game_Player.prototype.isInBoat = function () {
	return this._vehicleType === "boat";
};

/**
 * 是否在大船
 * Whether in ship
 *
 * @memberof Game_Player
 * @method isInShip
 * @returns {Boolean} 是否在大船 - Whether in ship
 */
Game_Player.prototype.isInShip = function () {
	return this._vehicleType === "ship";
};

/**
 * 是否在飞艇
 * Whether in airship
 *
 * @memberof Game_Player
 * @method isInAirship
 * @returns {Boolean} 是否在飞艇 - Whether in airship
 */
Game_Player.prototype.isInAirship = function () {
	return this._vehicleType === "airship";
};

/**
 * 是否在载具
 * Whether in vehicle
 *
 * @memberof Game_Player
 * @method isInVehicle
 * @returns {Boolean} 是否在载具 - Whether in vehicle
 */
Game_Player.prototype.isInVehicle = function () {
	return this.isInBoat() || this.isInShip() || this.isInAirship();
};

/**
 * 是否普通
 * Whether normal
 *
 * @memberof Game_Player
 * @method isNormal
 * @returns {Boolean} 是否普通 - Whether normal
 */
Game_Player.prototype.isNormal = function () {
	return this._vehicleType === "walk" && !this.isMoveRouteForcing();
};

/**
 * 是否奔跑
 * Whether dashing
 *
 * @memberof Game_Player
 * @method isDashing
 * @returns {Boolean} 是否奔跑 - Whether dashing
 */
Game_Player.prototype.isDashing = function () {
	return this._dashing;
};

/**
 * 是否调试穿透
 * Whether debug through
 * 在调试模式下，按 ctrl 可使玩家穿透。
 * In debug mode, pressing ctrl allows player to pass through.
 *
 * @memberof Game_Player
 * @method isDebugThrough
 * @returns {Boolean} 是否调试穿透 - Whether debug through
 */
Game_Player.prototype.isDebugThrough = function () {
	return Input.isPressed("control") && $gameTemp.isPlaytest();
};

/**
 * 是否碰撞
 * Whether collided
 *
 * @memberof Game_Player
 * @method isCollided
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 * @returns {Boolean} 是否碰撞 - Whether collided
 */
Game_Player.prototype.isCollided = function (x, y) {
	if (this.isThrough()) {
		return false;
	} else {
		return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
	}
};

/**
 * 中心 X 位置
 * Center X position
 *
 * @memberof Game_Player
 * @method centerX
 * @returns {Number} 中心X位置 - Center X position
 */
Game_Player.prototype.centerX = function () {
	return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};

/**
 * 中心 Y 位置
 * Center Y position
 *
 * @memberof Game_Player
 * @method centerY
 * @returns {Number} 中心Y位置 - Center Y position
 */
Game_Player.prototype.centerY = function () {
	return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};

/**
 * 中心位置
 * Center position
 *
 * @memberof Game_Player
 * @method center
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 */
Game_Player.prototype.center = function (x, y) {
	return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};

/**
 * 放置
 * Locate
 *
 * @memberof Game_Player
 * @method locate
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 */
Game_Player.prototype.locate = function (x, y) {
	Game_Character.prototype.locate.call(this, x, y);
	this.center(x, y);
	this.makeEncounterCount();
	if (this.isInVehicle()) {
		this.vehicle().refresh();
	}
	this._followers.synchronize(x, y, this.direction());
};

/**
 * 增加步数
 * Increase steps
 *
 * @memberof Game_Player
 * @method increaseSteps
 */
Game_Player.prototype.increaseSteps = function () {
	Game_Character.prototype.increaseSteps.call(this);
	if (this.isNormal()) {
		$gameParty.increaseSteps();
	}
};

/**
 * 制作遇敌计数
 * Make encounter count
 *
 * @memberof Game_Player
 * @method makeEncounterCount
 */
Game_Player.prototype.makeEncounterCount = function () {
	var n = $gameMap.encounterStep();
	this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};

/**
 * 制作遇敌敌群 ID
 * Make encounter troop ID
 *
 * @memberof Game_Player
 * @method makeEncounterTroopId
 * @returns {Number} 敌群ID - Troop ID
 */
Game_Player.prototype.makeEncounterTroopId = function () {
	var encounterList = [];
	var weightSum = 0;
	$gameMap.encounterList().forEach(function (encounter) {
		if (this.meetsEncounterConditions(encounter)) {
			encounterList.push(encounter);
			weightSum += encounter.weight;
		}
	}, this);
	if (weightSum > 0) {
		var value = Math.randomInt(weightSum);
		for (var i = 0; i < encounterList.length; i++) {
			value -= encounterList[i].weight;
			if (value < 0) {
				return encounterList[i].troopId;
			}
		}
	}
	return 0;
};

/**
 * 是否满足遇敌条件
 * Whether meets encounter conditions
 *
 * @memberof Game_Player
 * @method meetsEncounterConditions
 * @param {Object} encounter - 遇敌数据 - Encounter data
 * @returns {Boolean} 是否满足条件 - Whether meets conditions
 */
Game_Player.prototype.meetsEncounterConditions = function (encounter) {
	return encounter.regionSet.length === 0 || encounter.regionSet.contains(this.regionId());
};

/**
 * 执行遇敌
 * Execute encounter
 *
 * @memberof Game_Player
 * @method executeEncounter
 * @returns {Boolean} 是否执行成功 - Whether executed successfully
 */
Game_Player.prototype.executeEncounter = function () {
	if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
		this.makeEncounterCount();
		var troopId = this.makeEncounterTroopId();
		if ($dataTroops[troopId]) {
			BattleManager.setup(troopId, true, false);
			BattleManager.onEncounter();
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
};

/**
 * 开始地图事件
 * Start map event
 *
 * @memberof Game_Player
 * @method startMapEvent
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 * @param {Array} triggers - 触发器列表 - Trigger list
 * @param {Boolean} normal - 是否普通优先级 - Whether normal priority
 */
Game_Player.prototype.startMapEvent = function (x, y, triggers, normal) {
	if (!$gameMap.isEventRunning()) {
		$gameMap.eventsXy(x, y).forEach(function (event) {
			if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
				event.start();
			}
		});
	}
};

/**
 * 随着输入移动
 * Move by input
 *
 * @memberof Game_Player
 * @method moveByInput
 */
Game_Player.prototype.moveByInput = function () {
	if (!this.isMoving() && this.canMove()) {
		var direction = this.getInputDirection();
		if (direction > 0) {
			$gameTemp.clearDestination();
		} else if ($gameTemp.isDestinationValid()) {
			var x = $gameTemp.destinationX();
			var y = $gameTemp.destinationY();
			direction = this.findDirectionTo(x, y);
		}
		if (direction > 0) {
			this.executeMove(direction);
		}
	}
};

/**
 * 是否可移动
 * Whether can move
 *
 * @memberof Game_Player
 * @method canMove
 * @returns {Boolean} 是否可移动 - Whether can move
 */
Game_Player.prototype.canMove = function () {
	if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
		return false;
	}
	if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
		return false;
	}
	if (this._vehicleGettingOn || this._vehicleGettingOff) {
		return false;
	}
	if (this.isInVehicle() && !this.vehicle().canMove()) {
		return false;
	}
	return true;
};

/**
 * 获取输入的方向
 * Get input direction
 *
 * @memberof Game_Player
 * @method getInputDirection
 * @returns {Number} 输入方向 - Input direction
 */
Game_Player.prototype.getInputDirection = function () {
	return Input.dir4;
};

/**
 * 执行移动
 * Execute move
 *
 * @memberof Game_Player
 * @method executeMove
 * @param {Number} direction - 方向 - Direction
 */
Game_Player.prototype.executeMove = function (direction) {
	this.moveStraight(direction);
};

/**
 * 更新
 * Update
 *
 * @memberof Game_Player
 * @method update
 * @param {Boolean} sceneActive - 场景是否活跃 - Whether scene active
 */
Game_Player.prototype.update = function (sceneActive) {
	var lastScrolledX = this.scrolledX();
	var lastScrolledY = this.scrolledY();
	var wasMoving = this.isMoving();
	this.updateDashing();
	if (sceneActive) {
		this.moveByInput();
	}
	Game_Character.prototype.update.call(this);
	this.updateScroll(lastScrolledX, lastScrolledY);
	this.updateVehicle();
	if (!this.isMoving()) {
		this.updateNonmoving(wasMoving);
	}
	this._followers.update();
};

/**
 * 更新奔跑
 * Update dashing
 *
 * @memberof Game_Player
 * @method updateDashing
 */
Game_Player.prototype.updateDashing = function () {
	if (this.isMoving()) {
		return;
	}
	if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
		this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
	} else {
		this._dashing = false;
	}
};

/**
 * 是否奔跑按键按下
 * Whether dash button pressed
 *
 * @memberof Game_Player
 * @method isDashButtonPressed
 * @returns {Boolean} 是否按下 - Whether pressed
 */
Game_Player.prototype.isDashButtonPressed = function () {
	var shift = Input.isPressed("shift");
	if (ConfigManager.alwaysDash) {
		return !shift;
	} else {
		return shift;
	}
};

/**
 * 更新滚动
 * Update scroll
 *
 * @memberof Game_Player
 * @method updateScroll
 * @param {Number} lastScrolledX - 上次滚动X - Last scrolled X
 * @param {Number} lastScrolledY - 上次滚动Y - Last scrolled Y
 */
Game_Player.prototype.updateScroll = function (lastScrolledX, lastScrolledY) {
	var x1 = lastScrolledX;
	var y1 = lastScrolledY;
	var x2 = this.scrolledX();
	var y2 = this.scrolledY();
	if (y2 > y1 && y2 > this.centerY()) {
		$gameMap.scrollDown(y2 - y1);
	}
	if (x2 < x1 && x2 < this.centerX()) {
		$gameMap.scrollLeft(x1 - x2);
	}
	if (x2 > x1 && x2 > this.centerX()) {
		$gameMap.scrollRight(x2 - x1);
	}
	if (y2 < y1 && y2 < this.centerY()) {
		$gameMap.scrollUp(y1 - y2);
	}
};

/**
 * 更新载具
 * Update vehicle
 *
 * @memberof Game_Player
 * @method updateVehicle
 */
Game_Player.prototype.updateVehicle = function () {
	if (this.isInVehicle() && !this.areFollowersGathering()) {
		if (this._vehicleGettingOn) {
			this.updateVehicleGetOn();
		} else if (this._vehicleGettingOff) {
			this.updateVehicleGetOff();
		} else {
			this.vehicle().syncWithPlayer();
		}
	}
};

/**
 * 更新上载具
 * Update vehicle get on
 *
 * @memberof Game_Player
 * @method updateVehicleGetOn
 */
Game_Player.prototype.updateVehicleGetOn = function () {
	if (!this.areFollowersGathering() && !this.isMoving()) {
		this.setDirection(this.vehicle().direction());
		this.setMoveSpeed(this.vehicle().moveSpeed());
		this._vehicleGettingOn = false;
		this.setTransparent(true);
		if (this.isInAirship()) {
			this.setThrough(true);
		}
		this.vehicle().getOn();
	}
};

/**
 * 更新下载具
 * Update vehicle get off
 *
 * @memberof Game_Player
 * @method updateVehicleGetOff
 */
Game_Player.prototype.updateVehicleGetOff = function () {
	if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
		this._vehicleGettingOff = false;
		this._vehicleType = "walk";
		this.setTransparent(false);
	}
};

/**
 * 更新不移动
 * Update nonmoving
 *
 * @memberof Game_Player
 * @method updateNonmoving
 * @param {Boolean} wasMoving - 是否正在移动 - Whether was moving
 */
Game_Player.prototype.updateNonmoving = function (wasMoving) {
	if (!$gameMap.isEventRunning()) {
		if (wasMoving) {
			$gameParty.onPlayerWalk();
			this.checkEventTriggerHere([1, 2]);
			if ($gameMap.setupStartingEvent()) {
				return;
			}
		}
		if (this.triggerAction()) {
			return;
		}
		if (wasMoving) {
			this.updateEncounterCount();
		} else {
			$gameTemp.clearDestination();
		}
	}
};

/**
 * 触发行动
 * Trigger action
 *
 * @memberof Game_Player
 * @method triggerAction
 * @returns {Boolean} 是否触发成功 - Whether triggered successfully
 */
Game_Player.prototype.triggerAction = function () {
	if (this.canMove()) {
		if (this.triggerButtonAction()) {
			return true;
		}
		if (this.triggerTouchAction()) {
			return true;
		}
	}
	return false;
};

/**
 * 触发按键行为
 * Trigger button action
 *
 * @memberof Game_Player
 * @method triggerButtonAction
 * @returns {Boolean} 是否触发成功 - Whether triggered successfully
 */
Game_Player.prototype.triggerButtonAction = function () {
	if (Input.isTriggered("ok")) {
		if (this.getOnOffVehicle()) {
			return true;
		}
		this.checkEventTriggerHere([0]);
		if ($gameMap.setupStartingEvent()) {
			return true;
		}
		this.checkEventTriggerThere([0, 1, 2]);
		if ($gameMap.setupStartingEvent()) {
			return true;
		}
	}
	return false;
};

/**
 * 触发触摸行为
 * Trigger touch action
 *
 * @memberof Game_Player
 * @method triggerTouchAction
 * @returns {Boolean} 是否触发成功 - Whether triggered successfully
 */
Game_Player.prototype.triggerTouchAction = function () {
	if ($gameTemp.isDestinationValid()) {
		var direction = this.direction();
		var x1 = this.x;
		var y1 = this.y;
		var x2 = $gameMap.roundXWithDirection(x1, direction);
		var y2 = $gameMap.roundYWithDirection(y1, direction);
		var x3 = $gameMap.roundXWithDirection(x2, direction);
		var y3 = $gameMap.roundYWithDirection(y2, direction);
		var destX = $gameTemp.destinationX();
		var destY = $gameTemp.destinationY();
		if (destX === x1 && destY === y1) {
			return this.triggerTouchActionD1(x1, y1);
		} else if (destX === x2 && destY === y2) {
			return this.triggerTouchActionD2(x2, y2);
		} else if (destX === x3 && destY === y3) {
			return this.triggerTouchActionD3(x2, y2);
		}
	}
	return false;
};

/**
 * 触发触摸行为 D1
 * Trigger touch action D1
 *
 * @memberof Game_Player
 * @method triggerTouchActionD1
 * @param {Number} x1 - X1坐标 - X1 coordinate
 * @param {Number} y1 - Y1坐标 - Y1 coordinate
 * @returns {Boolean} 是否触发成功 - Whether triggered successfully
 */
Game_Player.prototype.triggerTouchActionD1 = function (x1, y1) {
	if ($gameMap.airship().pos(x1, y1)) {
		if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
			return true;
		}
	}
	this.checkEventTriggerHere([0]);
	return $gameMap.setupStartingEvent();
};

/**
 * 触发触摸行为 D2
 * Trigger touch action D2
 *
 * @memberof Game_Player
 * @method triggerTouchActionD2
 * @param {Number} x2 - X2坐标 - X2 coordinate
 * @param {Number} y2 - Y2坐标 - Y2 coordinate
 * @returns {Boolean} 是否触发成功 - Whether triggered successfully
 */
Game_Player.prototype.triggerTouchActionD2 = function (x2, y2) {
	if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
		if (TouchInput.isTriggered() && this.getOnVehicle()) {
			return true;
		}
	}
	if (this.isInBoat() || this.isInShip()) {
		if (TouchInput.isTriggered() && this.getOffVehicle()) {
			return true;
		}
	}
	this.checkEventTriggerThere([0, 1, 2]);
	return $gameMap.setupStartingEvent();
};

/**
 * 触发触摸行为 D3
 * Trigger touch action D3
 *
 * @memberof Game_Player
 * @method triggerTouchActionD3
 * @param {Number} x2 - X2坐标 - X2 coordinate
 * @param {Number} y2 - Y2坐标 - Y2 coordinate
 * @returns {Boolean} 是否触发成功 - Whether triggered successfully
 */
Game_Player.prototype.triggerTouchActionD3 = function (x2, y2) {
	if ($gameMap.isCounter(x2, y2)) {
		this.checkEventTriggerThere([0, 1, 2]);
	}
	return $gameMap.setupStartingEvent();
};

/**
 * 更新遇敌计数
 * Update encounter count
 *
 * @memberof Game_Player
 * @method updateEncounterCount
 */
Game_Player.prototype.updateEncounterCount = function () {
	if (this.canEncounter()) {
		this._encounterCount -= this.encounterProgressValue();
	}
};

/**
 * 是否能遇敌
 * Whether can encounter
 *
 * @memberof Game_Player
 * @method canEncounter
 * @returns {Boolean} 是否能遇敌 - Whether can encounter
 */
Game_Player.prototype.canEncounter = function () {
	return (
		!$gameParty.hasEncounterNone() &&
		$gameSystem.isEncounterEnabled() &&
		!this.isInAirship() &&
		!this.isMoveRouteForcing() &&
		!this.isDebugThrough()
	);
};

/**
 * 遇敌进度值
 * Encounter progress value
 *
 * @memberof Game_Player
 * @method encounterProgressValue
 * @returns {Number} 遇敌进度值 - Encounter progress value
 */
Game_Player.prototype.encounterProgressValue = function () {
	var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
	if ($gameParty.hasEncounterHalf()) {
		value *= 0.5;
	}
	if (this.isInShip()) {
		value *= 0.5;
	}
	return value;
};

/**
 * 检测这里（玩家位置）的事件触发条件
 * Check event trigger here (player position)
 *
 * @memberof Game_Player
 * @method checkEventTriggerHere
 * @param {Array} triggers - 触发器列表 - Trigger list
 */
Game_Player.prototype.checkEventTriggerHere = function (triggers) {
	if (this.canStartLocalEvents()) {
		this.startMapEvent(this.x, this.y, triggers, false);
	}
};

/**
 * 检测那里（玩家前方位置）的事件触发条件
 * Check event trigger there (player front position)
 *
 * @memberof Game_Player
 * @method checkEventTriggerThere
 * @param {Array} triggers - 触发器列表 - Trigger list
 */
Game_Player.prototype.checkEventTriggerThere = function (triggers) {
	if (this.canStartLocalEvents()) {
		var direction = this.direction();
		var x1 = this.x;
		var y1 = this.y;
		var x2 = $gameMap.roundXWithDirection(x1, direction);
		var y2 = $gameMap.roundYWithDirection(y1, direction);
		this.startMapEvent(x2, y2, triggers, true);
		if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
			var x3 = $gameMap.roundXWithDirection(x2, direction);
			var y3 = $gameMap.roundYWithDirection(y2, direction);
			this.startMapEvent(x3, y3, triggers, true);
		}
	}
};

/**
 * 检测接触的事件触发条件
 * Check event trigger touch
 *
 * @memberof Game_Player
 * @method checkEventTriggerTouch
 * @param {Number} x - X坐标 - X coordinate
 * @param {Number} y - Y坐标 - Y coordinate
 */
Game_Player.prototype.checkEventTriggerTouch = function (x, y) {
	if (this.canStartLocalEvents()) {
		this.startMapEvent(x, y, [1, 2], true);
	}
};

/**
 * 是否能开始本地事件
 * Whether can start local events
 *
 * @memberof Game_Player
 * @method canStartLocalEvents
 * @returns {Boolean} 是否能开始 - Whether can start
 */
Game_Player.prototype.canStartLocalEvents = function () {
	return !this.isInAirship();
};

/**
 * 上下载具
 * Get on/off vehicle
 *
 * @memberof Game_Player
 * @method getOnOffVehicle
 * @returns {Boolean} 是否成功 - Whether successful
 */
Game_Player.prototype.getOnOffVehicle = function () {
	if (this.isInVehicle()) {
		return this.getOffVehicle();
	} else {
		return this.getOnVehicle();
	}
};

/**
 * 上载具
 * Get on vehicle
 *
 * @memberof Game_Player
 * @method getOnVehicle
 * @returns {Boolean} 是否成功 - Whether successful
 */
Game_Player.prototype.getOnVehicle = function () {
	var direction = this.direction();
	var x1 = this.x;
	var y1 = this.y;
	var x2 = $gameMap.roundXWithDirection(x1, direction);
	var y2 = $gameMap.roundYWithDirection(y1, direction);
	if ($gameMap.airship().pos(x1, y1)) {
		this._vehicleType = "airship";
	} else if ($gameMap.ship().pos(x2, y2)) {
		this._vehicleType = "ship";
	} else if ($gameMap.boat().pos(x2, y2)) {
		this._vehicleType = "boat";
	}
	if (this.isInVehicle()) {
		this._vehicleGettingOn = true;
		if (!this.isInAirship()) {
			this.forceMoveForward();
		}
		this.gatherFollowers();
	}
	return this._vehicleGettingOn;
};

/**
 * 下载具
 * Get off vehicle
 *
 * @memberof Game_Player
 * @method getOffVehicle
 * @returns {Boolean} 是否成功 - Whether successful
 */
Game_Player.prototype.getOffVehicle = function () {
	if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
		if (this.isInAirship()) {
			this.setDirection(2);
		}
		this._followers.synchronize(this.x, this.y, this.direction());
		this.vehicle().getOff();
		if (!this.isInAirship()) {
			this.forceMoveForward();
			this.setTransparent(false);
		}
		this._vehicleGettingOff = true;
		this.setMoveSpeed(4);
		this.setThrough(false);
		this.makeEncounterCount();
		this.gatherFollowers();
	}
	return this._vehicleGettingOff;
};

/**
 * 强制向前移动
 * Force move forward
 *
 * @memberof Game_Player
 * @method forceMoveForward
 */
Game_Player.prototype.forceMoveForward = function () {
	this.setThrough(true);
	this.moveForward();
	this.setThrough(false);
};

/**
 * 是否在有害地形
 * Whether on damage floor
 *
 * @memberof Game_Player
 * @method isOnDamageFloor
 * @returns {Boolean} 是否在有害地形 - Whether on damage floor
 */
Game_Player.prototype.isOnDamageFloor = function () {
	return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};

/**
 * 直线移动
 * Move straight
 *
 * @memberof Game_Player
 * @method moveStraight
 * @param {Number} d - 方向 - Direction
 */
Game_Player.prototype.moveStraight = function (d) {
	if (this.canPass(this.x, this.y, d)) {
		this._followers.updateMove();
	}
	Game_Character.prototype.moveStraight.call(this, d);
};

/**
 * 斜线移动
 * Move diagonally
 *
 * @memberof Game_Player
 * @method moveDiagonally
 * @param {Number} horz - 水平方向 - Horizontal direction
 * @param {Number} vert - 垂直方向 - Vertical direction
 */
Game_Player.prototype.moveDiagonally = function (horz, vert) {
	if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
		this._followers.updateMove();
	}
	Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};

/**
 * 跳跃
 * Jump
 *
 * @memberof Game_Player
 * @method jump
 * @param {Number} xPlus - X偏移 - X offset
 * @param {Number} yPlus - Y偏移 - Y offset
 */
Game_Player.prototype.jump = function (xPlus, yPlus) {
	Game_Character.prototype.jump.call(this, xPlus, yPlus);
	this._followers.jumpAll();
};

/**
 * 显示跟随者
 * Show followers
 *
 * @memberof Game_Player
 * @method showFollowers
 */
Game_Player.prototype.showFollowers = function () {
	this._followers.show();
};

/**
 * 隐藏跟随者
 * Hide followers
 *
 * @memberof Game_Player
 * @method hideFollowers
 */
Game_Player.prototype.hideFollowers = function () {
	this._followers.hide();
};

/**
 * 集合跟随者
 * Gather followers
 *
 * @memberof Game_Player
 * @method gatherFollowers
 */
Game_Player.prototype.gatherFollowers = function () {
	this._followers.gather();
};

/**
 * 是否跟随者集合中
 * Whether followers gathering
 *
 * @memberof Game_Player
 * @method areFollowersGathering
 * @returns {Boolean} 是否集合中 - Whether gathering
 */
Game_Player.prototype.areFollowersGathering = function () {
	return this._followers.areGathering();
};

/**
 * 是否跟随者集合了
 * Whether followers gathered
 *
 * @memberof Game_Player
 * @method areFollowersGathered
 * @returns {Boolean} 是否集合了 - Whether gathered
 */
Game_Player.prototype.areFollowersGathered = function () {
	return this._followers.areGathered();
};
