/**
 * @fileoverview Game_CharacterBase - 游戏人物基础类
 *
 * Game_Character 的父类。它处理所有人物共享的基本信息，如坐标和图像。
 * The superclass of Game_Character. It handles basic information, such as
 * coordinates and images, shared by all characters.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 游戏人物基础类
 * Game character base class
 *
 * @class Game_CharacterBase
 * @constructor
 * @description 游戏人物基础类，处理所有人物共享的基本信息，如坐标和图像
 * Game character base class that handles basic information shared by all characters, such as coordinates and images
 */
function Game_CharacterBase() {
	this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_CharacterBase.prototype, {
	x: {
		get: function () {
			return this._x;
		},
		configurable: true,
	},
	y: {
		get: function () {
			return this._y;
		},
		configurable: true,
	},
});

/**
 * 初始化
 * Initialize
 */
Game_CharacterBase.prototype.initialize = function () {
	this.initMembers();
};

/**
 * 初始化成员
 * Initialize members
 */
Game_CharacterBase.prototype.initMembers = function () {
	this._x = 0;
	this._y = 0;
	this._realX = 0;
	this._realY = 0;
	this._moveSpeed = 4;
	this._moveFrequency = 6;
	this._opacity = 255;
	this._blendMode = 0;
	this._direction = 2;
	this._pattern = 1;
	this._priorityType = 1;
	this._tileId = 0;
	this._characterName = "";
	this._characterIndex = 0;
	this._isObjectCharacter = false;
	this._walkAnime = true;
	this._stepAnime = false;
	this._directionFix = false;
	this._through = false;
	this._transparent = false;
	this._bushDepth = 0;
	this._animationId = 0;
	this._balloonId = 0;
	this._animationPlaying = false;
	this._balloonPlaying = false;
	this._animationCount = 0;
	this._stopCount = 0;
	this._jumpCount = 0;
	this._jumpPeak = 0;
	this._movementSuccess = true;
};

/**
 * 是否该位置
 * Check if at specified position
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否在指定位置 / Whether at specified position
 */
Game_CharacterBase.prototype.pos = function (x, y) {
	return this._x === x && this._y === y;
};

/**
 * 是否该位置且不能穿透
 * Check if at position and not through
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否在指定位置且不能穿透 / Whether at position and not through
 */
Game_CharacterBase.prototype.posNt = function (x, y) {
	// No through
	return this.pos(x, y) && !this.isThrough();
};

/**
 * 获取移动速度
 * Get move speed
 *
 * @returns {number} 移动速度 / Move speed
 */
Game_CharacterBase.prototype.moveSpeed = function () {
	return this._moveSpeed;
};

/**
 * 设置移动速度
 * Set move speed
 *
 * @param {number} moveSpeed - 移动速度 / Move speed
 */
Game_CharacterBase.prototype.setMoveSpeed = function (moveSpeed) {
	this._moveSpeed = moveSpeed;
};

/**
 * 获取移动频率
 * Get move frequency
 *
 * @returns {number} 移动频率 / Move frequency
 */
Game_CharacterBase.prototype.moveFrequency = function () {
	return this._moveFrequency;
};

/**
 * 设置移动频率
 * Set move frequency
 *
 * @param {number} moveFrequency - 移动频率 / Move frequency
 */
Game_CharacterBase.prototype.setMoveFrequency = function (moveFrequency) {
	this._moveFrequency = moveFrequency;
};

/**
 * 获取不透明度
 * Get opacity
 *
 * @returns {number} 不透明度 / Opacity
 */
Game_CharacterBase.prototype.opacity = function () {
	return this._opacity;
};

/**
 * 设置不透明度
 * Set opacity
 *
 * @param {number} opacity - 不透明度 / Opacity
 */
Game_CharacterBase.prototype.setOpacity = function (opacity) {
	this._opacity = opacity;
};

/**
 * 获取混合模式
 * Get blend mode
 *
 * @returns {number} 混合模式 / Blend mode
 */
Game_CharacterBase.prototype.blendMode = function () {
	return this._blendMode;
};

/**
 * 设置混合模式
 * Set blend mode
 *
 * @param {number} blendMode - 混合模式 / Blend mode
 */
Game_CharacterBase.prototype.setBlendMode = function (blendMode) {
	this._blendMode = blendMode;
};

/**
 * 是否正常的优先级
 * Check if normal priority
 *
 * @returns {boolean} 是否正常优先级 / Whether normal priority
 */
Game_CharacterBase.prototype.isNormalPriority = function () {
	return this._priorityType === 1;
};

/**
 * 设置优先级类型
 * Set priority type
 *
 * @param {number} priorityType - 优先级类型 / Priority type
 */
Game_CharacterBase.prototype.setPriorityType = function (priorityType) {
	this._priorityType = priorityType;
};

/**
 * 是否移动中
 * Check if moving
 *
 * @returns {boolean} 是否移动中 / Whether moving
 */
Game_CharacterBase.prototype.isMoving = function () {
	return this._realX !== this._x || this._realY !== this._y;
};

/**
 * 是否跳跃中
 * Check if jumping
 *
 * @returns {boolean} 是否跳跃中 / Whether jumping
 */
Game_CharacterBase.prototype.isJumping = function () {
	return this._jumpCount > 0;
};

/**
 * 获取跳跃高度
 * Get jump height
 *
 * @returns {number} 跳跃高度 / Jump height
 */
Game_CharacterBase.prototype.jumpHeight = function () {
	return (this._jumpPeak * this._jumpPeak - Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
};

/**
 * 是否停止中
 * Check if stopping
 *
 * @returns {boolean} 是否停止中 / Whether stopping
 */
Game_CharacterBase.prototype.isStopping = function () {
	return !this.isMoving() && !this.isJumping();
};

/**
 * 检测停止
 * Check stop
 *
 * @param {number} threshold - 阈值 / Threshold
 * @returns {boolean} 是否超过阈值 / Whether exceeds threshold
 */
Game_CharacterBase.prototype.checkStop = function (threshold) {
	return this._stopCount > threshold;
};

/**
 * 重置停止计数
 * Reset stop count
 */
Game_CharacterBase.prototype.resetStopCount = function () {
	this._stopCount = 0;
};

/**
 * 获取实际移动速度
 * Get real move speed
 *
 * @returns {number} 实际移动速度 / Real move speed
 */
Game_CharacterBase.prototype.realMoveSpeed = function () {
	return this._moveSpeed + (this.isDashing() ? 1 : 0);
};

/**
 * 获取每帧距离
 * Get distance per frame
 *
 * @returns {number} 每帧距离 / Distance per frame
 */
Game_CharacterBase.prototype.distancePerFrame = function () {
	return Math.pow(2, this.realMoveSpeed()) / 256;
};

/**
 * 是否冲刺中
 * Check if dashing
 *
 * @returns {boolean} 是否冲刺中 / Whether dashing
 */
Game_CharacterBase.prototype.isDashing = function () {
	return false;
};

/**
 * 是否调试穿透
 * Check if debug through
 *
 * @returns {boolean} 是否调试穿透 / Whether debug through
 */
Game_CharacterBase.prototype.isDebugThrough = function () {
	return false;
};

/**
 * 端正
 * Straighten
 */
Game_CharacterBase.prototype.straighten = function () {
	if (this.hasWalkAnime() || this.hasStepAnime()) {
		this._pattern = 1;
	}
	this._animationCount = 0;
};

/**
 * 翻转方向
 * Reverse direction
 *
 * @param {number} d - 方向（2：下，4：左，6：右，8：上） / Direction (2: down, 4: left, 6: right, 8: up)
 * @returns {number} 翻转后的方向 / Reversed direction
 */
Game_CharacterBase.prototype.reverseDir = function (d) {
	return 10 - d;
};

/**
 * 是否可通行
 * Check if can pass
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @param {number} d - 方向 / Direction
 * @returns {boolean} 是否可通行 / Whether can pass
 */
Game_CharacterBase.prototype.canPass = function (x, y, d) {
	var x2 = $gameMap.roundXWithDirection(x, d);
	var y2 = $gameMap.roundYWithDirection(y, d);
	if (!$gameMap.isValid(x2, y2)) {
		return false;
	}
	if (this.isThrough() || this.isDebugThrough()) {
		return true;
	}
	if (!this.isMapPassable(x, y, d)) {
		return false;
	}
	if (this.isCollidedWithCharacters(x2, y2)) {
		return false;
	}
	return true;
};

/**
 * 斜向是否可通行
 * Check if can pass diagonally
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @param {number} horz - 水平方向 / Horizontal direction
 * @param {number} vert - 垂直方向 / Vertical direction
 * @returns {boolean} 是否可斜向通行 / Whether can pass diagonally
 */
Game_CharacterBase.prototype.canPassDiagonally = function (x, y, horz, vert) {
	var x2 = $gameMap.roundXWithDirection(x, horz);
	var y2 = $gameMap.roundYWithDirection(y, vert);
	if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
		return true;
	}
	if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
		return true;
	}
	return false;
};

/**
 * 地图是否可通行
 * Check if map is passable
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @param {number} d - 方向 / Direction
 * @returns {boolean} 地图是否可通行 / Whether map is passable
 */
Game_CharacterBase.prototype.isMapPassable = function (x, y, d) {
	var x2 = $gameMap.roundXWithDirection(x, d);
	var y2 = $gameMap.roundYWithDirection(y, d);
	var d2 = this.reverseDir(d);
	return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};

/**
 * 是否和人物（事件和载具）碰撞
 * Check if collided with characters (events and vehicles)
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否碰撞 / Whether collided
 */
Game_CharacterBase.prototype.isCollidedWithCharacters = function (x, y) {
	return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};

/**
 * 是否和事件碰撞
 * Check if collided with events
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否和事件碰撞 / Whether collided with events
 */
Game_CharacterBase.prototype.isCollidedWithEvents = function (x, y) {
	var events = $gameMap.eventsXyNt(x, y);
	return events.some(function (event) {
		return event.isNormalPriority();
	});
};

/**
 * 是否和载具碰撞
 * Check if collided with vehicles
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 是否和载具碰撞 / Whether collided with vehicles
 */
Game_CharacterBase.prototype.isCollidedWithVehicles = function (x, y) {
	return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};

/**
 * 设置位置
 * Set position
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 */
Game_CharacterBase.prototype.setPosition = function (x, y) {
	this._x = Math.round(x);
	this._y = Math.round(y);
	this._realX = x;
	this._realY = y;
};

/**
 * 复制位置
 * Copy position
 *
 * @param {Game_CharacterBase} character - 角色对象 / Character object
 */
Game_CharacterBase.prototype.copyPosition = function (character) {
	this._x = character._x;
	this._y = character._y;
	this._realX = character._realX;
	this._realY = character._realY;
	this._direction = character._direction;
};

/**
 * 放置
 * Locate
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 */
Game_CharacterBase.prototype.locate = function (x, y) {
	this.setPosition(x, y);
	this.straighten();
	this.refreshBushDepth();
};

/**
 * 获取方向
 * Get direction
 *
 * @returns {number} 方向 / Direction
 */
Game_CharacterBase.prototype.direction = function () {
	return this._direction;
};

/**
 * 设置方向
 * Set direction
 *
 * @param {number} d - 方向 / Direction
 */
Game_CharacterBase.prototype.setDirection = function (d) {
	if (!this.isDirectionFixed() && d) {
		this._direction = d;
	}
	this.resetStopCount();
};

/**
 * 是否图块
 * Check if tile
 *
 * @returns {boolean} 是否图块 / Whether tile
 */
Game_CharacterBase.prototype.isTile = function () {
	return this._tileId > 0 && this._priorityType === 0;
};

/**
 * 是否物体的行走图
 * Check if object character
 *
 * @returns {boolean} 是否物体行走图 / Whether object character
 */
Game_CharacterBase.prototype.isObjectCharacter = function () {
	return this._isObjectCharacter;
};

/**
 * Y轴偏移像素
 * Y axis offset pixels
 *
 * @returns {number} Y轴偏移 / Y axis shift
 */
Game_CharacterBase.prototype.shiftY = function () {
	return this.isObjectCharacter() ? 0 : 6;
};

/**
 * 获取滚动X坐标
 * Get scrolled X coordinate
 *
 * @returns {number} 滚动X坐标 / Scrolled X coordinate
 */
Game_CharacterBase.prototype.scrolledX = function () {
	return $gameMap.adjustX(this._realX);
};

/**
 * 获取滚动Y坐标
 * Get scrolled Y coordinate
 *
 * @returns {number} 滚动Y坐标 / Scrolled Y coordinate
 */
Game_CharacterBase.prototype.scrolledY = function () {
	return $gameMap.adjustY(this._realY);
};

/**
 * 获取画面X坐标
 * Get screen X coordinate
 *
 * @returns {number} 画面X坐标 / Screen X coordinate
 */
Game_CharacterBase.prototype.screenX = function () {
	var tw = $gameMap.tileWidth();
	return Math.round(this.scrolledX() * tw + tw / 2);
};

/**
 * 获取画面Y坐标
 * Get screen Y coordinate
 *
 * @returns {number} 画面Y坐标 / Screen Y coordinate
 */
Game_CharacterBase.prototype.screenY = function () {
	var th = $gameMap.tileHeight();
	return Math.round(this.scrolledY() * th + th - this.shiftY() - this.jumpHeight());
};

/**
 * 获取画面Z坐标
 * Get screen Z coordinate
 *
 * @returns {number} 画面Z坐标 / Screen Z coordinate
 */
Game_CharacterBase.prototype.screenZ = function () {
	return this._priorityType * 2 + 1;
};

/**
 * 是否在画面附近
 * Check if near the screen
 *
 * @returns {boolean} 是否在画面附近 / Whether near the screen
 */
Game_CharacterBase.prototype.isNearTheScreen = function () {
	var gw = Graphics.width;
	var gh = Graphics.height;
	var tw = $gameMap.tileWidth();
	var th = $gameMap.tileHeight();
	var px = this.scrolledX() * tw + tw / 2 - gw / 2;
	var py = this.scrolledY() * th + th / 2 - gh / 2;
	return px >= -gw && px <= gw && py >= -gh && py <= gh;
};

/**
 * 更新
 * Update
 */
Game_CharacterBase.prototype.update = function () {
	if (this.isStopping()) {
		this.updateStop();
	}
	if (this.isJumping()) {
		this.updateJump();
	} else if (this.isMoving()) {
		this.updateMove();
	}
	this.updateAnimation();
};

/**
 * 更新停止
 * Update stop
 */
Game_CharacterBase.prototype.updateStop = function () {
	this._stopCount++;
};

/**
 * 更新跳跃
 * Update jump
 */
Game_CharacterBase.prototype.updateJump = function () {
	this._jumpCount--;
	this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
	this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
	this.refreshBushDepth();
	if (this._jumpCount === 0) {
		this._realX = this._x = $gameMap.roundX(this._x);
		this._realY = this._y = $gameMap.roundY(this._y);
	}
};

/**
 * 更新移动
 * Update move
 */
Game_CharacterBase.prototype.updateMove = function () {
	if (this._x < this._realX) {
		this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
	}
	if (this._x > this._realX) {
		this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
	}
	if (this._y < this._realY) {
		this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
	}
	if (this._y > this._realY) {
		this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
	}
	if (!this.isMoving()) {
		this.refreshBushDepth();
	}
};

/**
 * 更新动画
 * Update animation
 */
Game_CharacterBase.prototype.updateAnimation = function () {
	this.updateAnimationCount();
	if (this._animationCount >= this.animationWait()) {
		this.updatePattern();
		this._animationCount = 0;
	}
};

/**
 * 获取动画等待时间
 * Get animation wait time
 *
 * @returns {number} 动画等待时间 / Animation wait time
 */
Game_CharacterBase.prototype.animationWait = function () {
	return (9 - this.realMoveSpeed()) * 3;
};

/**
 * 更新动画计数
 * Update animation count
 */
Game_CharacterBase.prototype.updateAnimationCount = function () {
	if (this.isMoving() && this.hasWalkAnime()) {
		this._animationCount += 1.5;
	} else if (this.hasStepAnime() || !this.isOriginalPattern()) {
		this._animationCount++;
	}
};

/**
 * 更新图案
 * Update pattern
 */
Game_CharacterBase.prototype.updatePattern = function () {
	if (!this.hasStepAnime() && this._stopCount > 0) {
		this.resetPattern();
	} else {
		this._pattern = (this._pattern + 1) % this.maxPattern();
	}
};

/**
 * 获取最大图案数
 * Get maximum pattern count
 * 行走图一个动画的最大图案数，也可以说是帧数。
 * The maximum number of patterns for a walking animation, also known as frame count.
 *
 * @returns {number} 最大图案数 / Maximum pattern count
 */
Game_CharacterBase.prototype.maxPattern = function () {
	return 4;
};

/**
 * 获取当前图案
 * Get current pattern
 * 当前行走图动画显示第几帧图案。一个动画4帧，资源图片只有3帧，第4帧与第2帧一样（第1帧_pattern为0）。
 * Current walking animation pattern frame. An animation has 4 frames, but the resource image only has 3 frames, so the 4th frame is the same as the 2nd frame.
 *
 * @returns {number} 当前图案 / Current pattern
 */
Game_CharacterBase.prototype.pattern = function () {
	return this._pattern < 3 ? this._pattern : 1;
};

/**
 * 设置图案
 * Set pattern
 *
 * @param {number} pattern - 图案 / Pattern
 */
Game_CharacterBase.prototype.setPattern = function (pattern) {
	this._pattern = pattern;
};

/**
 * 是否起始图案
 * Check if original pattern
 *
 * @returns {boolean} 是否起始图案 / Whether original pattern
 */
Game_CharacterBase.prototype.isOriginalPattern = function () {
	return this.pattern() === 1;
};

/**
 * 重置图案
 * Reset pattern
 */
Game_CharacterBase.prototype.resetPattern = function () {
	this.setPattern(1);
};

/**
 * 刷新草木繁茂处深度
 * Refresh bush depth
 */
Game_CharacterBase.prototype.refreshBushDepth = function () {
	if (this.isNormalPriority() && !this.isObjectCharacter() && this.isOnBush() && !this.isJumping()) {
		if (!this.isMoving()) {
			this._bushDepth = 12;
		}
	} else {
		this._bushDepth = 0;
	}
};

/**
 * 是否在梯子上
 * Check if on ladder
 *
 * @returns {boolean} 是否在梯子上 / Whether on ladder
 */
Game_CharacterBase.prototype.isOnLadder = function () {
	return $gameMap.isLadder(this._x, this._y);
};

/**
 * 是否在草木繁茂处上
 * Check if on bush
 *
 * @returns {boolean} 是否在草木繁茂处 / Whether on bush
 */
Game_CharacterBase.prototype.isOnBush = function () {
	return $gameMap.isBush(this._x, this._y);
};

/**
 * 获取地形标志
 * Get terrain tag
 *
 * @returns {number} 地形标志 / Terrain tag
 */
Game_CharacterBase.prototype.terrainTag = function () {
	return $gameMap.terrainTag(this._x, this._y);
};

/**
 * 获取区域ID
 * Get region ID
 *
 * @returns {number} 区域ID / Region ID
 */
Game_CharacterBase.prototype.regionId = function () {
	return $gameMap.regionId(this._x, this._y);
};

/**
 * 增加步数
 * Increase steps
 */
Game_CharacterBase.prototype.increaseSteps = function () {
	if (this.isOnLadder()) {
		this.setDirection(8);
	}
	this.resetStopCount();
	this.refreshBushDepth();
};

/**
 * 获取图块ID
 * Get tile ID
 *
 * @returns {number} 图块ID / Tile ID
 */
Game_CharacterBase.prototype.tileId = function () {
	return this._tileId;
};

/**
 * 获取行走图名称
 * Get character name
 *
 * @returns {string} 行走图名称 / Character name
 */
Game_CharacterBase.prototype.characterName = function () {
	return this._characterName;
};

/**
 * 获取行走图索引
 * Get character index
 *
 * @returns {number} 行走图索引 / Character index
 */
Game_CharacterBase.prototype.characterIndex = function () {
	return this._characterIndex;
};

/**
 * 设置图像
 * Set image
 *
 * @param {string} characterName - 行走图名称 / Character name
 * @param {number} characterIndex - 行走图索引 / Character index
 */
Game_CharacterBase.prototype.setImage = function (characterName, characterIndex) {
	this._tileId = 0;
	this._characterName = characterName;
	this._characterIndex = characterIndex;
	this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
};

/**
 * 设置图块图像
 * Set tile image
 *
 * @param {number} tileId - 图块ID / Tile ID
 */
Game_CharacterBase.prototype.setTileImage = function (tileId) {
	this._tileId = tileId;
	this._characterName = "";
	this._characterIndex = 0;
	this._isObjectCharacter = true;
};

/**
 * 检测前方的接触的事件触发条件
 * Check event trigger touch front
 *
 * @param {number} d - 方向 / Direction
 */
Game_CharacterBase.prototype.checkEventTriggerTouchFront = function (d) {
	var x2 = $gameMap.roundXWithDirection(this._x, d);
	var y2 = $gameMap.roundYWithDirection(this._y, d);
	this.checkEventTriggerTouch(x2, y2);
};

/**
 * 检测接触的事件触发条件
 * Check event trigger touch
 *
 * @param {number} x - X坐标 / X coordinate
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {boolean} 检测结果 / Check result
 */
Game_CharacterBase.prototype.checkEventTriggerTouch = function (x, y) {
	return false;
};

/**
 * 是否移动成功
 * Check if movement succeeded
 *
 * @returns {boolean} 是否移动成功 / Whether movement succeeded
 */
Game_CharacterBase.prototype.isMovementSucceeded = function () {
	return this._movementSuccess;
};

/**
 * 设置移动成功状态
 * Set movement success
 *
 * @param {boolean} success - 移动成功状态 / Movement success state
 */
Game_CharacterBase.prototype.setMovementSuccess = function (success) {
	this._movementSuccess = success;
};

/**
 * 直线移动
 * Move straight
 *
 * @param {number} d - 方向 / Direction
 */
Game_CharacterBase.prototype.moveStraight = function (d) {
	this.setMovementSuccess(this.canPass(this._x, this._y, d));
	if (this.isMovementSucceeded()) {
		this.setDirection(d);
		this._x = $gameMap.roundXWithDirection(this._x, d);
		this._y = $gameMap.roundYWithDirection(this._y, d);
		this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
		this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
		this.increaseSteps();
	} else {
		this.setDirection(d);
		this.checkEventTriggerTouchFront(d);
	}
};

/**
 * 斜线移动
 * Move diagonally
 *
 * @param {number} horz - 水平方向 / Horizontal direction
 * @param {number} vert - 垂直方向 / Vertical direction
 */
Game_CharacterBase.prototype.moveDiagonally = function (horz, vert) {
	this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
	if (this.isMovementSucceeded()) {
		this._x = $gameMap.roundXWithDirection(this._x, horz);
		this._y = $gameMap.roundYWithDirection(this._y, vert);
		this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
		this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
		this.increaseSteps();
	}
	if (this._direction === this.reverseDir(horz)) {
		this.setDirection(horz);
	}
	if (this._direction === this.reverseDir(vert)) {
		this.setDirection(vert);
	}
};

/**
 * 跳跃
 * Jump
 *
 * @param {number} xPlus - X增量 / X plus
 * @param {number} yPlus - Y增量 / Y plus
 */
Game_CharacterBase.prototype.jump = function (xPlus, yPlus) {
	if (Math.abs(xPlus) > Math.abs(yPlus)) {
		if (xPlus !== 0) {
			this.setDirection(xPlus < 0 ? 4 : 6);
		}
	} else {
		if (yPlus !== 0) {
			this.setDirection(yPlus < 0 ? 8 : 2);
		}
	}
	this._x += xPlus;
	this._y += yPlus;
	var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
	this._jumpPeak = 10 + distance - this._moveSpeed;
	this._jumpCount = this._jumpPeak * 2;
	this.resetStopCount();
	this.straighten();
};

/**
 * 是否有行走动画
 * Check if has walk anime
 *
 * @returns {boolean} 是否有行走动画 / Whether has walk anime
 */
Game_CharacterBase.prototype.hasWalkAnime = function () {
	return this._walkAnime;
};

/**
 * 设置行走动画
 * Set walk anime
 *
 * @param {boolean} walkAnime - 行走动画 / Walk anime
 */
Game_CharacterBase.prototype.setWalkAnime = function (walkAnime) {
	this._walkAnime = walkAnime;
};

/**
 * 是否有踏步动画
 * Check if has step anime
 *
 * @returns {boolean} 是否有踏步动画 / Whether has step anime
 */
Game_CharacterBase.prototype.hasStepAnime = function () {
	return this._stepAnime;
};

/**
 * 设置踏步动画
 * Set step anime
 *
 * @param {boolean} stepAnime - 踏步动画 / Step anime
 */
Game_CharacterBase.prototype.setStepAnime = function (stepAnime) {
	this._stepAnime = stepAnime;
};

/**
 * 是否方向固定
 * Check if direction is fixed
 *
 * @returns {boolean} 是否方向固定 / Whether direction is fixed
 */
Game_CharacterBase.prototype.isDirectionFixed = function () {
	return this._directionFix;
};

/**
 * 设置方向固定
 * Set direction fix
 *
 * @param {boolean} directionFix - 方向固定 / Direction fix
 */
Game_CharacterBase.prototype.setDirectionFix = function (directionFix) {
	this._directionFix = directionFix;
};

/**
 * 是否穿透
 * Check if through
 *
 * @returns {boolean} 是否穿透 / Whether through
 */
Game_CharacterBase.prototype.isThrough = function () {
	return this._through;
};

/**
 * 设置穿透
 * Set through
 *
 * @param {boolean} through - 穿透 / Through
 */
Game_CharacterBase.prototype.setThrough = function (through) {
	this._through = through;
};

/**
 * 是否透明
 * Check if transparent
 *
 * @returns {boolean} 是否透明 / Whether transparent
 */
Game_CharacterBase.prototype.isTransparent = function () {
	return this._transparent;
};

/**
 * 获取草木繁茂处深度
 * Get bush depth
 *
 * @returns {number} 草木繁茂处深度 / Bush depth
 */
Game_CharacterBase.prototype.bushDepth = function () {
	return this._bushDepth;
};

/**
 * 设置透明
 * Set transparent
 *
 * @param {boolean} transparent - 透明 / Transparent
 */
Game_CharacterBase.prototype.setTransparent = function (transparent) {
	this._transparent = transparent;
};

/**
 * 请求动画
 * Request animation
 *
 * @param {number} animationId - 动画ID / Animation ID
 */
Game_CharacterBase.prototype.requestAnimation = function (animationId) {
	this._animationId = animationId;
};

/**
 * 请求气泡图标
 * Request balloon
 *
 * @param {number} balloonId - 气泡图标ID / Balloon ID
 */
Game_CharacterBase.prototype.requestBalloon = function (balloonId) {
	this._balloonId = balloonId;
};

/**
 * 获取动画ID
 * Get animation ID
 *
 * @returns {number} 动画ID / Animation ID
 */
Game_CharacterBase.prototype.animationId = function () {
	return this._animationId;
};

/**
 * 获取气泡图标ID
 * Get balloon ID
 *
 * @returns {number} 气泡图标ID / Balloon ID
 */
Game_CharacterBase.prototype.balloonId = function () {
	return this._balloonId;
};

/**
 * 开始动画
 * Start animation
 */
Game_CharacterBase.prototype.startAnimation = function () {
	this._animationId = 0;
	this._animationPlaying = true;
};

/**
 * 开始气泡图标
 * Start balloon
 */
Game_CharacterBase.prototype.startBalloon = function () {
	this._balloonId = 0;
	this._balloonPlaying = true;
};

/**
 * 是否动画播放中
 * Check if animation playing
 *
 * @returns {boolean} 是否动画播放中 / Whether animation playing
 */
Game_CharacterBase.prototype.isAnimationPlaying = function () {
	return this._animationId > 0 || this._animationPlaying;
};

/**
 * 是否气泡图标播放中
 * Check if balloon playing
 *
 * @returns {boolean} 是否气泡图标播放中 / Whether balloon playing
 */
Game_CharacterBase.prototype.isBalloonPlaying = function () {
	return this._balloonId > 0 || this._balloonPlaying;
};

/**
 * 结束动画
 * End animation
 */
Game_CharacterBase.prototype.endAnimation = function () {
	this._animationPlaying = false;
};

/**
 * 结束气泡图标
 * End balloon
 */
Game_CharacterBase.prototype.endBalloon = function () {
	this._balloonPlaying = false;
};
