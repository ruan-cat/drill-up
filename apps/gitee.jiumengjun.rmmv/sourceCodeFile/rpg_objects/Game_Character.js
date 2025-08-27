/**
 * @fileoverview Game_Character - 游戏人物类
 *
 * Game_Player、Game_Follower、GameVehicle 和 Game_Event 的父类。
 * The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 游戏人物类
 * Game character class
 *
 * @class Game_Character
 * @constructor
 * @extends Game_CharacterBase
 * @description 游戏人物类，是Game_Player、Game_Follower、GameVehicle和Game_Event的父类
 * Game character class, the superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event
 */
function Game_Character() {
	this.initialize.apply(this, arguments);
}

Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
Game_Character.prototype.constructor = Game_Character;

/**
 * 移动路线常量 - 结束
 * Route constant - End
 *
 * @static
 * @memberof Game_Character
 * @type {Number}
 */
Game_Character.ROUTE_END = 0;
Game_Character.ROUTE_MOVE_DOWN = 1; // 移动路线-向下移动 / Route move down
Game_Character.ROUTE_MOVE_LEFT = 2; // 移动路线-向左移动 / Route move left
Game_Character.ROUTE_MOVE_RIGHT = 3; // 移动路线-向右移动 / Route move right
Game_Character.ROUTE_MOVE_UP = 4; // 移动路线-向上移动 / Route move up
Game_Character.ROUTE_MOVE_LOWER_L = 5; // 移动路线-向左下移动 / Route move lower left
Game_Character.ROUTE_MOVE_LOWER_R = 6; // 移动路线-向右下移动 / Route move lower right
Game_Character.ROUTE_MOVE_UPPER_L = 7; // 移动路线-向左上移动 / Route move upper left
Game_Character.ROUTE_MOVE_UPPER_R = 8; // 移动路线-向右上移动 / Route move upper right
Game_Character.ROUTE_MOVE_RANDOM = 9; // 移动路线-随机移动 / Route move random
Game_Character.ROUTE_MOVE_TOWARD = 10; // 移动路线-接近玩家 / Route move toward
Game_Character.ROUTE_MOVE_AWAY = 11; // 移动路线-远离玩家 / Route move away
Game_Character.ROUTE_MOVE_FORWARD = 12; // 移动路线-前进一步 / Route move forward
Game_Character.ROUTE_MOVE_BACKWARD = 13; // 移动路线-后退一步 / Route move backward
Game_Character.ROUTE_JUMP = 14; // 移动路线-跳跃 / Route jump
Game_Character.ROUTE_WAIT = 15; // 移动路线-等待 / Route wait
Game_Character.ROUTE_TURN_DOWN = 16; // 移动路线-朝向下方 / Route turn down
Game_Character.ROUTE_TURN_LEFT = 17; // 移动路线-朝向左方 / Route turn left
Game_Character.ROUTE_TURN_RIGHT = 18; // 移动路线-朝向右方 / Route turn right
Game_Character.ROUTE_TURN_UP = 19; // 移动路线-朝向上方 / Route turn up
Game_Character.ROUTE_TURN_90D_R = 20; // 移动路线-右转90° / Route turn 90 degrees right
Game_Character.ROUTE_TURN_90D_L = 21; // 移动路线-左转90° / Route turn 90 degrees left
Game_Character.ROUTE_TURN_180D = 22; // 移动路线-后转180° / Route turn 180 degrees
Game_Character.ROUTE_TURN_90D_R_L = 23; // 移动路线-向左或向右转90° / Route turn 90 degrees right or left
Game_Character.ROUTE_TURN_RANDOM = 24; // 移动路线-随机转向 / Route turn random
Game_Character.ROUTE_TURN_TOWARD = 25; // 移动路线-朝向玩家 / Route turn toward
Game_Character.ROUTE_TURN_AWAY = 26; // 移动路线-背向玩家 / Route turn away
Game_Character.ROUTE_SWITCH_ON = 27; // 移动路线-打开开关 / Route switch on
Game_Character.ROUTE_SWITCH_OFF = 28; // 移动路线-关闭开关 / Route switch off
Game_Character.ROUTE_CHANGE_SPEED = 29; // 移动路线-更改移动速度 / Route change speed
Game_Character.ROUTE_CHANGE_FREQ = 30; // 移动路线-更改移动频率 / Route change frequency
Game_Character.ROUTE_WALK_ANIME_ON = 31; // 移动路线-开启步行动画 / Route walk anime on
Game_Character.ROUTE_WALK_ANIME_OFF = 32; // 移动路线-关闭步行动画 / Route walk anime off
Game_Character.ROUTE_STEP_ANIME_ON = 33; // 移动路线-开启踏步动画 / Route step anime on
Game_Character.ROUTE_STEP_ANIME_OFF = 34; // 移动路线-关闭踏步动画 / Route step anime off
Game_Character.ROUTE_DIR_FIX_ON = 35; // 移动路线-开启固定朝向 / Route direction fix on
Game_Character.ROUTE_DIR_FIX_OFF = 36; // 移动路线-关闭固定朝向 / Route direction fix off
Game_Character.ROUTE_THROUGH_ON = 37; // 移动路线-开启穿透 / Route through on
Game_Character.ROUTE_THROUGH_OFF = 38; // 移动路线-关闭穿透 / Route through off
Game_Character.ROUTE_TRANSPARENT_ON = 39; // 移动路线-开启透明状态 / Route transparent on
Game_Character.ROUTE_TRANSPARENT_OFF = 40; // 移动路线-关闭透明状态 / Route transparent off
Game_Character.ROUTE_CHANGE_IMAGE = 41; // 移动路线-更改图像 / Route change image
Game_Character.ROUTE_CHANGE_OPACITY = 42; // 移动路线-更改不透明度 / Route change opacity
Game_Character.ROUTE_CHANGE_BLEND_MODE = 43; // 移动路线-更改合成方式 / Route change blend mode
Game_Character.ROUTE_PLAY_SE = 44; // 移动路线-播放SE / Route play SE
Game_Character.ROUTE_SCRIPT = 45; // 移动路线-脚本 / Route script

/**
 * 初始化
 * Initialize
 *
 * @memberof Game_Character
 * @method initialize
 */
Game_Character.prototype.initialize = function () {
	Game_CharacterBase.prototype.initialize.call(this);
};

/**
 * 初始化成员
 * Initialize members
 *
 * @memberof Game_Character
 * @method initMembers
 */
Game_Character.prototype.initMembers = function () {
	Game_CharacterBase.prototype.initMembers.call(this);
	this._moveRouteForcing = false;
	this._moveRoute = null;
	this._moveRouteIndex = 0;
	this._originalMoveRoute = null;
	this._originalMoveRouteIndex = 0;
	this._waitCount = 0;
};

/**
 * 记录移动路线
 * Memorize move route
 *
 * @memberof Game_Character
 * @method memorizeMoveRoute
 */
Game_Character.prototype.memorizeMoveRoute = function () {
	this._originalMoveRoute = this._moveRoute;
	this._originalMoveRouteIndex = this._moveRouteIndex;
};

/**
 * 恢复移动路线
 * Restore move route
 *
 * @memberof Game_Character
 * @method restoreMoveRoute
 */
Game_Character.prototype.restoreMoveRoute = function () {
	this._moveRoute = this._originalMoveRoute;
	this._moveRouteIndex = this._originalMoveRouteIndex;
	this._originalMoveRoute = null;
};

/**
 * 是否强制移动
 * Check if move route forcing
 *
 * @returns {boolean} 是否强制移动 / Whether move route forcing
 */
Game_Character.prototype.isMoveRouteForcing = function () {
	return this._moveRouteForcing;
};

/**
 * 设置移动路线
 * Set move route
 *
 * @param {object} moveRoute - 移动路线对象 / Move route object
 */
Game_Character.prototype.setMoveRoute = function (moveRoute) {
	this._moveRoute = moveRoute;
	this._moveRouteIndex = 0;
	this._moveRouteForcing = false;
};

/**
 * 强制移动路线
 * Force move route
 *
 * @param {object} moveRoute - 移动路线对象 / Move route object
 */
Game_Character.prototype.forceMoveRoute = function (moveRoute) {
	if (!this._originalMoveRoute) {
		this.memorizeMoveRoute();
	}
	this._moveRoute = moveRoute;
	this._moveRouteIndex = 0;
	this._moveRouteForcing = true;
	this._waitCount = 0;
};

/**
 * 更新停止
 * Update stop
 */
Game_Character.prototype.updateStop = function () {
	Game_CharacterBase.prototype.updateStop.call(this);
	if (this._moveRouteForcing) {
		this.updateRoutineMove();
	}
};

/**
 * 更新一系列移动
 * Update routine move
 */
Game_Character.prototype.updateRoutineMove = function () {
	if (this._waitCount > 0) {
		this._waitCount--;
	} else {
		this.setMovementSuccess(true);
		var command = this._moveRoute.list[this._moveRouteIndex];
		if (command) {
			this.processMoveCommand(command);
			this.advanceMoveRouteIndex();
		}
	}
};

/**
 * 处理移动指令
 * Process move command
 *
 * @param {object} command - 移动指令对象 / Move command object
 */
Game_Character.prototype.processMoveCommand = function (command) {
	var gc = Game_Character;
	var params = command.parameters;
	switch (command.code) {
		case gc.ROUTE_END:
			this.processRouteEnd();
			break;
		case gc.ROUTE_MOVE_DOWN:
			this.moveStraight(2);
			break;
		case gc.ROUTE_MOVE_LEFT:
			this.moveStraight(4);
			break;
		case gc.ROUTE_MOVE_RIGHT:
			this.moveStraight(6);
			break;
		case gc.ROUTE_MOVE_UP:
			this.moveStraight(8);
			break;
		case gc.ROUTE_MOVE_LOWER_L:
			this.moveDiagonally(4, 2);
			break;
		case gc.ROUTE_MOVE_LOWER_R:
			this.moveDiagonally(6, 2);
			break;
		case gc.ROUTE_MOVE_UPPER_L:
			this.moveDiagonally(4, 8);
			break;
		case gc.ROUTE_MOVE_UPPER_R:
			this.moveDiagonally(6, 8);
			break;
		case gc.ROUTE_MOVE_RANDOM:
			this.moveRandom();
			break;
		case gc.ROUTE_MOVE_TOWARD:
			this.moveTowardPlayer();
			break;
		case gc.ROUTE_MOVE_AWAY:
			this.moveAwayFromPlayer();
			break;
		case gc.ROUTE_MOVE_FORWARD:
			this.moveForward();
			break;
		case gc.ROUTE_MOVE_BACKWARD:
			this.moveBackward();
			break;
		case gc.ROUTE_JUMP:
			this.jump(params[0], params[1]);
			break;
		case gc.ROUTE_WAIT:
			this._waitCount = params[0] - 1;
			break;
		case gc.ROUTE_TURN_DOWN:
			this.setDirection(2);
			break;
		case gc.ROUTE_TURN_LEFT:
			this.setDirection(4);
			break;
		case gc.ROUTE_TURN_RIGHT:
			this.setDirection(6);
			break;
		case gc.ROUTE_TURN_UP:
			this.setDirection(8);
			break;
		case gc.ROUTE_TURN_90D_R:
			this.turnRight90();
			break;
		case gc.ROUTE_TURN_90D_L:
			this.turnLeft90();
			break;
		case gc.ROUTE_TURN_180D:
			this.turn180();
			break;
		case gc.ROUTE_TURN_90D_R_L:
			this.turnRightOrLeft90();
			break;
		case gc.ROUTE_TURN_RANDOM:
			this.turnRandom();
			break;
		case gc.ROUTE_TURN_TOWARD:
			this.turnTowardPlayer();
			break;
		case gc.ROUTE_TURN_AWAY:
			this.turnAwayFromPlayer();
			break;
		case gc.ROUTE_SWITCH_ON:
			$gameSwitches.setValue(params[0], true);
			break;
		case gc.ROUTE_SWITCH_OFF:
			$gameSwitches.setValue(params[0], false);
			break;
		case gc.ROUTE_CHANGE_SPEED:
			this.setMoveSpeed(params[0]);
			break;
		case gc.ROUTE_CHANGE_FREQ:
			this.setMoveFrequency(params[0]);
			break;
		case gc.ROUTE_WALK_ANIME_ON:
			this.setWalkAnime(true);
			break;
		case gc.ROUTE_WALK_ANIME_OFF:
			this.setWalkAnime(false);
			break;
		case gc.ROUTE_STEP_ANIME_ON:
			this.setStepAnime(true);
			break;
		case gc.ROUTE_STEP_ANIME_OFF:
			this.setStepAnime(false);
			break;
		case gc.ROUTE_DIR_FIX_ON:
			this.setDirectionFix(true);
			break;
		case gc.ROUTE_DIR_FIX_OFF:
			this.setDirectionFix(false);
			break;
		case gc.ROUTE_THROUGH_ON:
			this.setThrough(true);
			break;
		case gc.ROUTE_THROUGH_OFF:
			this.setThrough(false);
			break;
		case gc.ROUTE_TRANSPARENT_ON:
			this.setTransparent(true);
			break;
		case gc.ROUTE_TRANSPARENT_OFF:
			this.setTransparent(false);
			break;
		case gc.ROUTE_CHANGE_IMAGE:
			this.setImage(params[0], params[1]);
			break;
		case gc.ROUTE_CHANGE_OPACITY:
			this.setOpacity(params[0]);
			break;
		case gc.ROUTE_CHANGE_BLEND_MODE:
			this.setBlendMode(params[0]);
			break;
		case gc.ROUTE_PLAY_SE:
			AudioManager.playSe(params[0]);
			break;
		case gc.ROUTE_SCRIPT:
			eval(params[0]);
			break;
	}
};

/**
 * 与该X位置差值
 * Get delta X from specified position
 *
 * @param {number} x - X坐标 / X coordinate
 * @returns {number} X坐标差值 / Delta X
 */
Game_Character.prototype.deltaXFrom = function (x) {
	return $gameMap.deltaX(this.x, x);
};

/**
 * 与该Y位置差值
 * Get delta Y from specified position
 *
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {number} Y坐标差值 / Delta Y
 */
Game_Character.prototype.deltaYFrom = function (y) {
	return $gameMap.deltaY(this.y, y);
};

/**
 * 随机移动
 * Move random
 */
Game_Character.prototype.moveRandom = function () {
	var d = 2 + Math.randomInt(4) * 2;
	if (this.canPass(this.x, this.y, d)) {
		this.moveStraight(d);
	}
};

/**
 * 接近该人物移动
 * Move toward character
 *
 * @param {Game_CharacterBase} character - 目标人物 / Target character
 */
Game_Character.prototype.moveTowardCharacter = function (character) {
	var sx = this.deltaXFrom(character.x);
	var sy = this.deltaYFrom(character.y);
	if (Math.abs(sx) > Math.abs(sy)) {
		this.moveStraight(sx > 0 ? 4 : 6);
		if (!this.isMovementSucceeded() && sy !== 0) {
			this.moveStraight(sy > 0 ? 8 : 2);
		}
	} else if (sy !== 0) {
		this.moveStraight(sy > 0 ? 8 : 2);
		if (!this.isMovementSucceeded() && sx !== 0) {
			this.moveStraight(sx > 0 ? 4 : 6);
		}
	}
};

/**
 * 远离该人物移动
 * Move away from character
 *
 * @param {Game_CharacterBase} character - 目标人物 / Target character
 */
Game_Character.prototype.moveAwayFromCharacter = function (character) {
	var sx = this.deltaXFrom(character.x);
	var sy = this.deltaYFrom(character.y);
	if (Math.abs(sx) > Math.abs(sy)) {
		this.moveStraight(sx > 0 ? 6 : 4);
		if (!this.isMovementSucceeded() && sy !== 0) {
			this.moveStraight(sy > 0 ? 2 : 8);
		}
	} else if (sy !== 0) {
		this.moveStraight(sy > 0 ? 2 : 8);
		if (!this.isMovementSucceeded() && sx !== 0) {
			this.moveStraight(sx > 0 ? 6 : 4);
		}
	}
};

/**
 * 朝向该人物
 * Turn toward character
 *
 * @param {Game_CharacterBase} character - 目标人物 / Target character
 */
Game_Character.prototype.turnTowardCharacter = function (character) {
	var sx = this.deltaXFrom(character.x);
	var sy = this.deltaYFrom(character.y);
	if (Math.abs(sx) > Math.abs(sy)) {
		this.setDirection(sx > 0 ? 4 : 6);
	} else if (sy !== 0) {
		this.setDirection(sy > 0 ? 8 : 2);
	}
};

/**
 * 背向该人物
 * Turn away from character
 *
 * @param {Game_CharacterBase} character - 目标人物 / Target character
 */
Game_Character.prototype.turnAwayFromCharacter = function (character) {
	var sx = this.deltaXFrom(character.x);
	var sy = this.deltaYFrom(character.y);
	if (Math.abs(sx) > Math.abs(sy)) {
		this.setDirection(sx > 0 ? 6 : 4);
	} else if (sy !== 0) {
		this.setDirection(sy > 0 ? 2 : 8);
	}
};

/**
 * 朝向玩家
 * Turn toward player
 */
Game_Character.prototype.turnTowardPlayer = function () {
	this.turnTowardCharacter($gamePlayer);
};

/**
 * 背向玩家
 * Turn away from player
 */
Game_Character.prototype.turnAwayFromPlayer = function () {
	this.turnAwayFromCharacter($gamePlayer);
};

/**
 * 接近玩家
 * Move toward player
 */
Game_Character.prototype.moveTowardPlayer = function () {
	this.moveTowardCharacter($gamePlayer);
};

/**
 * 远离玩家
 * Move away from player
 */
Game_Character.prototype.moveAwayFromPlayer = function () {
	this.moveAwayFromCharacter($gamePlayer);
};

/**
 * 前进一步
 * Move forward
 */
Game_Character.prototype.moveForward = function () {
	this.moveStraight(this.direction());
};

/**
 * 后退一步
 * Move backward
 */
Game_Character.prototype.moveBackward = function () {
	var lastDirectionFix = this.isDirectionFixed();
	this.setDirectionFix(true);
	this.moveStraight(this.reverseDir(this.direction()));
	this.setDirectionFix(lastDirectionFix);
};

/**
 * 处理路线结束
 * Process route end
 */
Game_Character.prototype.processRouteEnd = function () {
	if (this._moveRoute.repeat) {
		this._moveRouteIndex = -1;
	} else if (this._moveRouteForcing) {
		this._moveRouteForcing = false;
		this.restoreMoveRoute();
	}
};

/**
 * 增加移动路线索引
 * Advance move route index
 */
Game_Character.prototype.advanceMoveRouteIndex = function () {
	var moveRoute = this._moveRoute;
	if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
		var numCommands = moveRoute.list.length - 1;
		this._moveRouteIndex++;
		if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
			this._moveRouteIndex = 0;
		}
	}
};

/**
 * 右转90°
 * Turn right 90 degrees
 */
Game_Character.prototype.turnRight90 = function () {
	switch (this.direction()) {
		case 2:
			this.setDirection(4);
			break;
		case 4:
			this.setDirection(8);
			break;
		case 6:
			this.setDirection(2);
			break;
		case 8:
			this.setDirection(6);
			break;
	}
};

/**
 * 左转90°
 * Turn left 90 degrees
 */
Game_Character.prototype.turnLeft90 = function () {
	switch (this.direction()) {
		case 2:
			this.setDirection(6);
			break;
		case 4:
			this.setDirection(2);
			break;
		case 6:
			this.setDirection(8);
			break;
		case 8:
			this.setDirection(4);
			break;
	}
};

/**
 * 后转180°
 * Turn 180 degrees
 */
Game_Character.prototype.turn180 = function () {
	this.setDirection(this.reverseDir(this.direction()));
};

/**
 * 向左或向右转90°
 * Turn right or left 90 degrees
 */
Game_Character.prototype.turnRightOrLeft90 = function () {
	switch (Math.randomInt(2)) {
		case 0:
			this.turnRight90();
			break;
		case 1:
			this.turnLeft90();
			break;
	}
};

/**
 * 随机转向
 * Turn random
 */
Game_Character.prototype.turnRandom = function () {
	this.setDirection(2 + Math.randomInt(4) * 2);
};

/**
 * 交换
 * Swap
 * 交换两个人的位置。
 * Exchange positions of two characters.
 *
 * @param {Game_CharacterBase} character - 要交换位置的人物 / Character to swap positions with
 */
Game_Character.prototype.swap = function (character) {
	var newX = character.x;
	var newY = character.y;
	character.locate(this.x, this.y);
	this.locate(newX, newY);
};

/**
 * 寻找朝着该位置的方向
 * Find direction to specified position
 * 该寻路是A*算法的魔改，每走一步查找12步内的路径，取出第一步进行行走。
 * This pathfinding is a modified A* algorithm that searches for a path within 12 steps for each move.
 *
 * @param {number} goalX - 目标X坐标 / Goal X coordinate
 * @param {number} goalY - 目标Y坐标 / Goal Y coordinate
 * @returns {number} 移动方向 / Movement direction
 */
Game_Character.prototype.findDirectionTo = function (goalX, goalY) {
	var searchLimit = this.searchLimit();
	var mapWidth = $gameMap.width();
	var nodeList = [];
	var openList = [];
	var closedList = [];
	var start = {};
	var best = start;

	if (this.x === goalX && this.y === goalY) {
		return 0;
	}

	start.parent = null;
	start.x = this.x;
	start.y = this.y;
	start.g = 0;
	start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
	nodeList.push(start);
	openList.push(start.y * mapWidth + start.x);

	while (nodeList.length > 0) {
		var bestIndex = 0;
		for (var i = 0; i < nodeList.length; i++) {
			if (nodeList[i].f < nodeList[bestIndex].f) {
				bestIndex = i;
			}
		}

		var current = nodeList[bestIndex];
		var x1 = current.x;
		var y1 = current.y;
		var pos1 = y1 * mapWidth + x1;
		var g1 = current.g;

		nodeList.splice(bestIndex, 1);
		openList.splice(openList.indexOf(pos1), 1);
		closedList.push(pos1);

		if (current.x === goalX && current.y === goalY) {
			best = current;
			break;
		}

		if (g1 >= searchLimit) {
			continue;
		}

		for (var j = 0; j < 4; j++) {
			var direction = 2 + j * 2;
			var x2 = $gameMap.roundXWithDirection(x1, direction);
			var y2 = $gameMap.roundYWithDirection(y1, direction);
			var pos2 = y2 * mapWidth + x2;

			if (closedList.contains(pos2)) {
				continue;
			}
			if (!this.canPass(x1, y1, direction)) {
				continue;
			}

			var g2 = g1 + 1;
			var index2 = openList.indexOf(pos2);

			if (index2 < 0 || g2 < nodeList[index2].g) {
				var neighbor;
				if (index2 >= 0) {
					neighbor = nodeList[index2];
				} else {
					neighbor = {};
					nodeList.push(neighbor);
					openList.push(pos2);
				}
				neighbor.parent = current;
				neighbor.x = x2;
				neighbor.y = y2;
				neighbor.g = g2;
				neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
				if (!best || neighbor.f - neighbor.g < best.f - best.g) {
					best = neighbor;
				}
			}
		}
	}

	var node = best;
	while (node.parent && node.parent !== start) {
		node = node.parent;
	}

	var deltaX1 = $gameMap.deltaX(node.x, start.x);
	var deltaY1 = $gameMap.deltaY(node.y, start.y);
	if (deltaY1 > 0) {
		return 2;
	} else if (deltaX1 < 0) {
		return 4;
	} else if (deltaX1 > 0) {
		return 6;
	} else if (deltaY1 < 0) {
		return 8;
	}

	var deltaX2 = this.deltaXFrom(goalX);
	var deltaY2 = this.deltaYFrom(goalY);
	if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
		return deltaX2 > 0 ? 4 : 6;
	} else if (deltaY2 !== 0) {
		return deltaY2 > 0 ? 8 : 2;
	}

	return 0;
};

/**
 * 获取查找上限
 * Get search limit
 *
 * @returns {number} 查找上限 / Search limit
 */
Game_Character.prototype.searchLimit = function () {
	return 12;
};
