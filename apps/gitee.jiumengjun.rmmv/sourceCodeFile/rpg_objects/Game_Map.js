//=============================================================================
// Game_Map.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * 游戏地图类
 * Game_Map
 *
 * 地图的游戏对象类。它包含滚动和通行决定功能。
 * The game object class for a map. It contains scrolling and passage
 * determination functions.
 *
 * PS：以下翻译，位置(x,y)是以图块为单位的，坐标(x,y)是以像素为单位的。
 * PS: In the following translation, position(x,y) is in tile units, coordinate(x,y) is in pixel units.
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Map
 * @description 游戏地图类，管理地图数据、滚动、事件和载具等
 * Game map class that manages map data, scrolling, events and vehicles
 */
function Game_Map() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化地图
 * Initialize map
 *
 * @memberof Game_Map
 * @method initialize
 */
Game_Map.prototype.initialize = function () {
	this._interpreter = new Game_Interpreter();
	this._mapId = 0;
	this._tilesetId = 0;
	this._events = [];
	this._commonEvents = [];
	this._vehicles = [];
	this._displayX = 0;
	this._displayY = 0;
	this._nameDisplay = true;
	this._scrollDirection = 2;
	this._scrollRest = 0;
	this._scrollSpeed = 4;
	this._parallaxName = "";
	this._parallaxZero = false;
	this._parallaxLoopX = false;
	this._parallaxLoopY = false;
	this._parallaxSx = 0;
	this._parallaxSy = 0;
	this._parallaxX = 0;
	this._parallaxY = 0;
	this._battleback1Name = null;
	this._battleback2Name = null;
	this.createVehicles();
};

/**
 * 设置地图
 * Setup map
 *
 * @memberof Game_Map
 * @method setup
 * @param {number} mapId - 地图ID / Map ID
 */
Game_Map.prototype.setup = function (mapId) {
	if (!$dataMap) {
		throw new Error("The map data is not available");
	}
	this._mapId = mapId;
	this._tilesetId = $dataMap.tilesetId;
	this._displayX = 0;
	this._displayY = 0;
	this.refereshVehicles();
	this.setupEvents();
	this.setupScroll();
	this.setupParallax();
	this.setupBattleback();
	this._needsRefresh = false;
};

/**
 * 检查事件是否运行中
 * Check if event is running
 *
 * @returns {boolean} 事件是否运行中 / Whether event is running
 */
Game_Map.prototype.isEventRunning = function () {
	return this._interpreter.isRunning() || this.isAnyEventStarting();
};

/**
 * 获取图块宽度
 * Get tile width
 *
 * @returns {number} 图块宽度 / Tile width
 */
Game_Map.prototype.tileWidth = function () {
	return 48;
};

/**
 * 获取图块高度
 * Get tile height
 *
 * @returns {number} 图块高度 / Tile height
 */
Game_Map.prototype.tileHeight = function () {
	return 48;
};

/**
 * 获取地图ID
 * Get map ID
 *
 * @returns {number} 地图ID / Map ID
 */
Game_Map.prototype.mapId = function () {
	return this._mapId;
};

/**
 * 获取图块组ID
 * Get tileset ID
 *
 * @returns {number} 图块组ID / Tileset ID
 */
Game_Map.prototype.tilesetId = function () {
	return this._tilesetId;
};

/**
 * 获取显示的X位置
 * Get display X position
 *
 * @returns {number} 显示的X位置 / Display X position
 */
Game_Map.prototype.displayX = function () {
	return this._displayX;
};

/**
 * 获取显示的Y位置
 * Get display Y position
 *
 * @returns {number} 显示的Y位置 / Display Y position
 */
Game_Map.prototype.displayY = function () {
	return this._displayY;
};

/**
 * 获取远景名称
 * Get parallax name
 *
 * @returns {string} 远景名称 / Parallax name
 */
Game_Map.prototype.parallaxName = function () {
	return this._parallaxName;
};

/**
 * 获取战斗背景1名称
 * Get battleback1 name
 *
 * @returns {string} 战斗背景1名称 / Battleback1 name
 */
Game_Map.prototype.battleback1Name = function () {
	return this._battleback1Name;
};

/**
 * 获取战斗背景2名称
 * Get battleback2 name
 *
 * @returns {string} 战斗背景2名称 / Battleback2 name
 */
Game_Map.prototype.battleback2Name = function () {
	return this._battleback2Name;
};

/**
 * 请求刷新
 * Request refresh
 *
 * @param {number} mapId - 地图ID / Map ID
 */
Game_Map.prototype.requestRefresh = function (mapId) {
	this._needsRefresh = true;
};

/**
 * 检查名称显示是否启用
 * Check if name display is enabled
 *
 * @returns {boolean} 名称显示是否启用 / Whether name display is enabled
 */
Game_Map.prototype.isNameDisplayEnabled = function () {
	return this._nameDisplay;
};

/**
 * 禁用名称显示
 * Disable name display
 */
Game_Map.prototype.disableNameDisplay = function () {
	this._nameDisplay = false;
};

/**
 * 启用名称显示
 * Enable name display
 */
Game_Map.prototype.enableNameDisplay = function () {
	this._nameDisplay = true;
};

/**
 * 创建载具
 * Create vehicles
 */
Game_Map.prototype.createVehicles = function () {
	this._vehicles = [];
	this._vehicles[0] = new Game_Vehicle("boat");
	this._vehicles[1] = new Game_Vehicle("ship");
	this._vehicles[2] = new Game_Vehicle("airship");
};

/**
 * 刷新载具
 * Refresh vehicles
 */
Game_Map.prototype.refereshVehicles = function () {
	this._vehicles.forEach(function (vehicle) {
		vehicle.refresh();
	});
};

/**
 * 获取载具数组
 * Get vehicles array
 * 返回载具的数组。
 * Returns the array of vehicles.
 *
 * @returns {Array} 载具数组 / Vehicles array
 */
Game_Map.prototype.vehicles = function () {
	return this._vehicles;
};

/**
 * 获取载具
 * Get vehicle
 * 返回该类型对应的载具的对象。
 * Returns the vehicle object corresponding to the type.
 *
 * @param {number|string} type - 载具类型 / Vehicle type
 * @returns {Game_Vehicle|null} 载具对象 / Vehicle object
 */
Game_Map.prototype.vehicle = function (type) {
	if (type === 0 || type === "boat") {
		return this.boat();
	} else if (type === 1 || type === "ship") {
		return this.ship();
	} else if (type === 2 || type === "airship") {
		return this.airship();
	} else {
		return null;
	}
};

/**
 * 获取小舟
 * Get boat
 *
 * @returns {Game_Vehicle} 小舟对象 / Boat object
 */
Game_Map.prototype.boat = function () {
	return this._vehicles[0];
};

/**
 * 获取大船
 * Get ship
 *
 * @returns {Game_Vehicle} 大船对象 / Ship object
 */
Game_Map.prototype.ship = function () {
	return this._vehicles[1];
};

/**
 * 获取飞艇
 * Get airship
 *
 * @returns {Game_Vehicle} 飞艇对象 / Airship object
 */
Game_Map.prototype.airship = function () {
	return this._vehicles[2];
};

/**
 * 设置事件
 * Setup events
 */
Game_Map.prototype.setupEvents = function () {
	this._events = [];
	for (var i = 0; i < $dataMap.events.length; i++) {
		if ($dataMap.events[i]) {
			this._events[i] = new Game_Event(this._mapId, i);
		}
	}
	this._commonEvents = this.parallelCommonEvents().map(function (commonEvent) {
		return new Game_CommonEvent(commonEvent.id);
	});
	this.refreshTileEvents();
};

/**
 * 获取事件数组
 * Get events array
 * 返回数组元素对象非空的事件数组。
 * Returns array of events with non-null elements.
 *
 * @returns {Array} 事件数组 / Events array
 */
Game_Map.prototype.events = function () {
	return this._events.filter(function (event) {
		return !!event;
	});
};

/**
 * 获取事件
 * Get event
 * 返回事件ID所对应的事件对象。
 * Returns the event object corresponding to the event ID.
 *
 * @param {number} eventId - 事件ID / Event ID
 * @returns {Game_Event} 事件对象 / Event object
 */
Game_Map.prototype.event = function (eventId) {
	return this._events[eventId];
};

/**
 * 消除事件
 * Erase event
 *
 * @param {number} eventId - 事件ID / Event ID
 */
Game_Map.prototype.eraseEvent = function (eventId) {
	this._events[eventId].erase();
};

/**
 * 获取并行处理的公共事件
 * Get parallel common events
 *
 * @returns {Array} 并行处理的公共事件数组 / Parallel common events array
 */
Game_Map.prototype.parallelCommonEvents = function () {
	return $dataCommonEvents.filter(function (commonEvent) {
		return commonEvent && commonEvent.trigger === 2;
	});
};

/**
 * 设置滚动
 * Setup scroll
 */
Game_Map.prototype.setupScroll = function () {
	this._scrollDirection = 2;
	this._scrollRest = 0;
	this._scrollSpeed = 4;
};

/**
 * 设置远景
 * Setup parallax
 */
Game_Map.prototype.setupParallax = function () {
	this._parallaxName = $dataMap.parallaxName || "";
	this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
	this._parallaxLoopX = $dataMap.parallaxLoopX;
	this._parallaxLoopY = $dataMap.parallaxLoopY;
	this._parallaxSx = $dataMap.parallaxSx;
	this._parallaxSy = $dataMap.parallaxSy;
	this._parallaxX = 0;
	this._parallaxY = 0;
};

/**
 * 设置战斗背景
 * Setup battleback
 */
Game_Map.prototype.setupBattleback = function () {
	if ($dataMap.specifyBattleback) {
		this._battleback1Name = $dataMap.battleback1Name;
		this._battleback2Name = $dataMap.battleback2Name;
	} else {
		this._battleback1Name = null;
		this._battleback2Name = null;
	}
};

/**
 * 设置显示位置
 * Set display position
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 */
Game_Map.prototype.setDisplayPos = function (x, y) {
	if (this.isLoopHorizontal()) {
		this._displayX = x.mod(this.width());
		this._parallaxX = x;
	} else {
		var endX = this.width() - this.screenTileX();
		this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
		this._parallaxX = this._displayX;
	}
	if (this.isLoopVertical()) {
		this._displayY = y.mod(this.height());
		this._parallaxY = y;
	} else {
		var endY = this.height() - this.screenTileY();
		this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
		this._parallaxY = this._displayY;
	}
};

/**
 * 获取远景原点X坐标
 * Get parallax origin X coordinate
 *
 * @returns {number} 远景原点X坐标 / Parallax origin X coordinate
 */
Game_Map.prototype.parallaxOx = function () {
	if (this._parallaxZero) {
		return this._parallaxX * this.tileWidth();
	} else if (this._parallaxLoopX) {
		return (this._parallaxX * this.tileWidth()) / 2;
	} else {
		return 0;
	}
};

/**
 * 获取远景原点Y坐标
 * Get parallax origin Y coordinate
 *
 * @returns {number} 远景原点Y坐标 / Parallax origin Y coordinate
 */
Game_Map.prototype.parallaxOy = function () {
	if (this._parallaxZero) {
		return this._parallaxY * this.tileHeight();
	} else if (this._parallaxLoopY) {
		return (this._parallaxY * this.tileHeight()) / 2;
	} else {
		return 0;
	}
};

/**
 * 获取图块组
 * Get tileset
 *
 * @returns {object} 图块组对象 / Tileset object
 */
Game_Map.prototype.tileset = function () {
	return $dataTilesets[this._tilesetId];
};

/**
 * 获取图块组标志
 * Get tileset flags
 *
 * @returns {Array} 图块组标志数组 / Tileset flags array
 */
Game_Map.prototype.tilesetFlags = function () {
	var tileset = this.tileset();
	if (tileset) {
		return tileset.flags;
	} else {
		return [];
	}
};

/**
 * 获取显示名称
 * Get display name
 *
 * @returns {string} 显示名称 / Display name
 */
Game_Map.prototype.displayName = function () {
	return $dataMap.displayName;
};

/**
 * 获取地图宽度
 * Get map width
 *
 * @returns {number} 地图宽度 / Map width
 */
Game_Map.prototype.width = function () {
	return $dataMap.width;
};

/**
 * 获取地图高度
 * Get map height
 *
 * @returns {number} 地图高度 / Map height
 */
Game_Map.prototype.height = function () {
	return $dataMap.height;
};

/**
 * 获取地图数据
 * Get map data
 *
 * @returns {Array} 地图数据数组 / Map data array
 */
Game_Map.prototype.data = function () {
	return $dataMap.data;
};

/**
 * 检查是否横向循环
 * Check if loop horizontal
 *
 * @returns {boolean} 是否横向循环 / Whether loop horizontal
 */
Game_Map.prototype.isLoopHorizontal = function () {
	return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};

/**
 * 检查是否纵向循环
 * Check if loop vertical
 *
 * @returns {boolean} 是否纵向循环 / Whether loop vertical
 */
Game_Map.prototype.isLoopVertical = function () {
	return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};

/**
 * 检查是否禁止奔跑
 * Check if dash is disabled
 *
 * @returns {boolean} 是否禁止奔跑 / Whether dash is disabled
 */
Game_Map.prototype.isDashDisabled = function () {
	return $dataMap.disableDashing;
};

/**
 * 获取遇敌列表
 * Get encounter list
 *
 * @returns {Array} 遇敌列表 / Encounter list
 */
Game_Map.prototype.encounterList = function () {
	return $dataMap.encounterList;
};

/**
 * 获取遇敌步数
 * Get encounter step
 *
 * @returns {number} 遇敌步数 / Encounter step
 */
Game_Map.prototype.encounterStep = function () {
	return $dataMap.encounterStep;
};

/**
 * 检查是否为主世界
 * Check if is overworld
 * 数据库-图块-基本设置-模式是否为世界类型。
 * Whether the mode in Database-Tileset-Basic Settings is world type.
 *
 * @returns {boolean} 是否为主世界 / Whether is overworld
 */
Game_Map.prototype.isOverworld = function () {
	return this.tileset() && this.tileset().mode === 0;
};

/**
 * 获取画面X轴方向图块数
 * Get screen tile X count
 *
 * @returns {number} 画面X轴方向图块数 / Screen tile X count
 */
Game_Map.prototype.screenTileX = function () {
	return Graphics.width / this.tileWidth();
};

/**
 * 获取画面Y轴方向图块数
 * Get screen tile Y count
 *
 * @returns {number} 画面Y轴方向图块数 / Screen tile Y count
 */
Game_Map.prototype.screenTileY = function () {
	return Graphics.height / this.tileHeight();
};

/**
 * 自适应X坐标
 * Adjust X coordinate
 *
 * @param {number} x - X坐标 / X coordinate
 * @returns {number} 自适应X坐标 / Adjusted X coordinate
 */
Game_Map.prototype.adjustX = function (x) {
	if (this.isLoopHorizontal() && x < this._displayX - (this.width() - this.screenTileX()) / 2) {
		return x - this._displayX + $dataMap.width;
	} else {
		return x - this._displayX;
	}
};

/**
 * 自适应Y坐标
 * Adjust Y coordinate
 *
 * @param {number} y - Y坐标 / Y coordinate
 * @returns {number} 自适应Y坐标 / Adjusted Y coordinate
 */
Game_Map.prototype.adjustY = function (y) {
	if (this.isLoopVertical() && y < this._displayY - (this.height() - this.screenTileY()) / 2) {
		return y - this._displayY + $dataMap.height;
	} else {
		return y - this._displayY;
	}
};

/**
 * 环形X位置
 * Round X position
 * 当横向循环时将位置转换为原地图位置。假设地图宽为17图块时，-1则为16，17则为0。
 * When looping horizontally, converts position to original map position. Assuming map width is 17 tiles, -1 becomes 16, 17 becomes 0.
 *
 * @param {number} x - X位置 / X position
 * @returns {number} 环形X位置 / Round X position
 */
Game_Map.prototype.roundX = function (x) {
	return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};

/**
 * 环形Y位置
 * Round Y position
 * 当纵向循环时将位置转换为原地图位置。假设地图高为13图块时，-1则为12，13则为0。
 * When looping vertically, converts position to original map position. Assuming map height is 13 tiles, -1 becomes 12, 13 becomes 0.
 *
 * @param {number} y - Y位置 / Y position
 * @returns {number} 环形Y位置 / Round Y position
 */
Game_Map.prototype.roundY = function (y) {
	return this.isLoopVertical() ? y.mod(this.height()) : y;
};

/**
 * 该方向的X位置
 * Get X position with direction
 *
 * @param {number} x - 在地图上的X位置 / X position on map
 * @param {number} d - 移动的方向（4：向左，6：向右） / Movement direction (4: left, 6: right)
 * @returns {number} 该方向的X位置 / X position with direction
 */
Game_Map.prototype.xWithDirection = function (x, d) {
	return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};

/**
 * 该方向的Y位置
 * Get Y position with direction
 *
 * @param {number} y - 在地图上的Y位置 / Y position on map
 * @param {number} d - 移动的方向（2：向下，8：向上） / Movement direction (2: down, 8: up)
 * @returns {number} 该方向的Y位置 / Y position with direction
 */
Game_Map.prototype.yWithDirection = function (y, d) {
	return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};

/**
 * 该方向的环形X位置
 * Get round X position with direction
 *
 * @param {number} x - X位置 / X position
 * @param {number} d - 方向 / Direction
 * @returns {number} 该方向的环形X位置 / Round X position with direction
 */
Game_Map.prototype.roundXWithDirection = function (x, d) {
	return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};

/**
 * 该方向的环形Y位置
 * Get round Y position with direction
 *
 * @param {number} y - Y位置 / Y position
 * @param {number} d - 方向 / Direction
 * @returns {number} 该方向的环形Y位置 / Round Y position with direction
 */
Game_Map.prototype.roundYWithDirection = function (y, d) {
	return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};

/**
 * 计算X位置差值
 * Calculate X position delta
 *
 * @param {number} x1 - X位置1 / X position 1
 * @param {number} x2 - X位置2 / X position 2
 * @returns {number} X位置差值 / X position delta
 */
Game_Map.prototype.deltaX = function (x1, x2) {
	var result = x1 - x2;
	if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
		if (result < 0) {
			result += this.width();
		} else {
			result -= this.width();
		}
	}
	return result;
};

/**
 * 计算Y位置差值
 * Calculate Y position delta
 *
 * @param {number} y1 - Y位置1 / Y position 1
 * @param {number} y2 - Y位置2 / Y position 2
 * @returns {number} Y位置差值 / Y position delta
 */
Game_Map.prototype.deltaY = function (y1, y2) {
	var result = y1 - y2;
	if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
		if (result < 0) {
			result += this.height();
		} else {
			result -= this.height();
		}
	}
	return result;
};

/**
 * 计算距离
 * Calculate distance
 * (x1,y1) 和 (x2,y2) 两点之间的距离。
 * Distance between two points (x1,y1) and (x2,y2).
 *
 * @param {number} x1 - X位置1 / X position 1
 * @param {number} y1 - Y位置1 / Y position 1
 * @param {number} x2 - X位置2 / X position 2
 * @param {number} y2 - Y位置2 / Y position 2
 * @returns {number} 距离 / Distance
 */
Game_Map.prototype.distance = function (x1, y1, x2, y2) {
	return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};

/**
 * 画布X坐标转换到地图X位置
 * Convert canvas X coordinate to map X position
 *
 * @param {number} x - 画布X坐标 / Canvas X coordinate
 * @returns {number} 地图X位置 / Map X position
 */
Game_Map.prototype.canvasToMapX = function (x) {
	var tileWidth = this.tileWidth();
	var originX = this._displayX * tileWidth;
	var mapX = Math.floor((originX + x) / tileWidth);
	return this.roundX(mapX);
};

/**
 * 画布Y坐标转换到地图Y位置
 * Convert canvas Y coordinate to map Y position
 *
 * @param {number} y - 画布Y坐标 / Canvas Y coordinate
 * @returns {number} 地图Y位置 / Map Y position
 */
Game_Map.prototype.canvasToMapY = function (y) {
	var tileHeight = this.tileHeight();
	var originY = this._displayY * tileHeight;
	var mapY = Math.floor((originY + y) / tileHeight);
	return this.roundY(mapY);
};

/**
 * 自动播放音频
 * Autoplay audio
 */
Game_Map.prototype.autoplay = function () {
	if ($dataMap.autoplayBgm) {
		if ($gamePlayer.isInVehicle()) {
			$gameSystem.saveWalkingBgm2();
		} else {
			AudioManager.playBgm($dataMap.bgm);
		}
	}
	if ($dataMap.autoplayBgs) {
		AudioManager.playBgs($dataMap.bgs);
	}
};

/**
 * 如果需要就刷新
 * Refresh if needed
 */
Game_Map.prototype.refreshIfNeeded = function () {
	if (this._needsRefresh) {
		this.refresh();
	}
};

/**
 * 刷新地图
 * Refresh map
 */
Game_Map.prototype.refresh = function () {
	this.events().forEach(function (event) {
		event.refresh();
	});
	this._commonEvents.forEach(function (event) {
		event.refresh();
	});
	this.refreshTileEvents();
	this._needsRefresh = false;
};

/**
 * 刷新图块事件
 * Refresh tile events
 */
Game_Map.prototype.refreshTileEvents = function () {
	this.tileEvents = this.events().filter(function (event) {
		return event.isTile();
	});
};

/**
 * 获取位置X,Y的事件
 * Get events at position X,Y
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {Array} 事件数组 / Events array
 */
Game_Map.prototype.eventsXy = function (x, y) {
	return this.events().filter(function (event) {
		return event.pos(x, y);
	});
};

/**
 * 获取位置X,Y不可穿透的事件
 * Get non-through events at position X,Y
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {Array} 不可穿透的事件数组 / Non-through events array
 */
Game_Map.prototype.eventsXyNt = function (x, y) {
	return this.events().filter(function (event) {
		return event.posNt(x, y);
	});
};

/**
 * 获取位置X,Y不可穿透的图块事件
 * Get non-through tile events at position X,Y
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {Array} 不可穿透的图块事件数组 / Non-through tile events array
 */
Game_Map.prototype.tileEventsXy = function (x, y) {
	return this.tileEvents.filter(function (event) {
		return event.posNt(x, y);
	});
};

/**
 * 获取位置X,Y的事件ID
 * Get event ID at position X,Y
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {number} 事件ID / Event ID
 */
Game_Map.prototype.eventIdXy = function (x, y) {
	var list = this.eventsXy(x, y);
	return list.length === 0 ? 0 : list[0].eventId();
};

/**
 * 向下滚动
 * Scroll down
 *
 * @param {number} distance - 滚动距离 / Scroll distance
 */
Game_Map.prototype.scrollDown = function (distance) {
	if (this.isLoopVertical()) {
		this._displayY += distance;
		this._displayY %= $dataMap.height;
		if (this._parallaxLoopY) {
			this._parallaxY += distance;
		}
	} else if (this.height() >= this.screenTileY()) {
		var lastY = this._displayY;
		this._displayY = Math.min(this._displayY + distance, this.height() - this.screenTileY());
		this._parallaxY += this._displayY - lastY;
	}
};

/**
 * 向左滚动
 * Scroll left
 *
 * @param {number} distance - 滚动距离 / Scroll distance
 */
Game_Map.prototype.scrollLeft = function (distance) {
	if (this.isLoopHorizontal()) {
		this._displayX += $dataMap.width - distance;
		this._displayX %= $dataMap.width;
		if (this._parallaxLoopX) {
			this._parallaxX -= distance;
		}
	} else if (this.width() >= this.screenTileX()) {
		var lastX = this._displayX;
		this._displayX = Math.max(this._displayX - distance, 0);
		this._parallaxX += this._displayX - lastX;
	}
};

/**
 * 向右滚动
 * Scroll right
 *
 * @param {number} distance - 滚动距离 / Scroll distance
 */
Game_Map.prototype.scrollRight = function (distance) {
	if (this.isLoopHorizontal()) {
		this._displayX += distance;
		this._displayX %= $dataMap.width;
		if (this._parallaxLoopX) {
			this._parallaxX += distance;
		}
	} else if (this.width() >= this.screenTileX()) {
		var lastX = this._displayX;
		this._displayX = Math.min(this._displayX + distance, this.width() - this.screenTileX());
		this._parallaxX += this._displayX - lastX;
	}
};

/**
 * 向上滚动
 * Scroll up
 *
 * @param {number} distance - 滚动距离 / Scroll distance
 */
Game_Map.prototype.scrollUp = function (distance) {
	if (this.isLoopVertical()) {
		this._displayY += $dataMap.height - distance;
		this._displayY %= $dataMap.height;
		if (this._parallaxLoopY) {
			this._parallaxY -= distance;
		}
	} else if (this.height() >= this.screenTileY()) {
		var lastY = this._displayY;
		this._displayY = Math.max(this._displayY - distance, 0);
		this._parallaxY += this._displayY - lastY;
	}
};

/**
 * 检查坐标是否有效
 * Check if coordinates are valid
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 坐标是否有效 / Whether coordinates are valid
 */
Game_Map.prototype.isValid = function (x, y) {
	return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};

/**
 * 检测通行
 * Check passage
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @param {number} bit - 检测位 / Check bit
 * @returns {boolean} 是否可通行 / Whether passable
 */
Game_Map.prototype.checkPassage = function (x, y, bit) {
	var flags = this.tilesetFlags();
	var tiles = this.allTiles(x, y);
	for (var i = 0; i < tiles.length; i++) {
		var flag = flags[tiles[i]];
		if ((flag & 0x10) !== 0)
			// [*] 对通行无影响（No effect on passage）
			continue;
		if ((flag & bit) === 0)
			// [o] 可通行（Passable）
			return true;
		if ((flag & bit) === bit)
			// [x] 不可通行（Impassable）
			return false;
	}
	return false;
};

/**
 * 获取图块ID
 * Get tile ID
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @param {number} z - Z层级 / Z level
 * @returns {number} 图块ID / Tile ID
 */
Game_Map.prototype.tileId = function (x, y, z) {
	var width = $dataMap.width;
	var height = $dataMap.height;
	return $dataMap.data[(z * height + y) * width + x] || 0;
};

/**
 * 获取层叠图块
 * Get layered tiles
 * 地图有4个图层，返回该位置所有图层的图块。
 * Map has 4 layers, returns tiles from all layers at the position.
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {Array} 层叠图块数组 / Layered tiles array
 */
Game_Map.prototype.layeredTiles = function (x, y) {
	var tiles = [];
	for (var i = 0; i < 4; i++) {
		tiles.push(this.tileId(x, y, 3 - i));
	}
	return tiles;
};

/**
 * 获取所有图块
 * Get all tiles
 * 该位置的图块事件加上该位置的层叠图块。
 * Tile events at the position plus layered tiles at the position.
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {Array} 所有图块数组 / All tiles array
 */
Game_Map.prototype.allTiles = function (x, y) {
	var tiles = this.tileEventsXy(x, y).map(function (event) {
		return event.tileId();
	});
	return tiles.concat(this.layeredTiles(x, y));
};

/**
 * 获取自动识别图块类型
 * Get autotile type
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @param {number} z - Z层级 / Z level
 * @returns {number} 自动识别图块类型 / Autotile type
 */
Game_Map.prototype.autotileType = function (x, y, z) {
	var tileId = this.tileId(x, y, z);
	return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};

/**
 * 检查是否可通行
 * Check if passable
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @param {number} d - 方向 / Direction
 * @returns {boolean} 是否可通行 / Whether passable
 */
Game_Map.prototype.isPassable = function (x, y, d) {
	return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};

/**
 * 检查小舟是否可通行
 * Check if boat passable
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 小舟是否可通行 / Whether boat passable
 */
Game_Map.prototype.isBoatPassable = function (x, y) {
	return this.checkPassage(x, y, 0x0200);
};

/**
 * 检查大船是否可通行
 * Check if ship passable
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 大船是否可通行 / Whether ship passable
 */
Game_Map.prototype.isShipPassable = function (x, y) {
	return this.checkPassage(x, y, 0x0400);
};

/**
 * 检查是否为飞艇可降落的陆地
 * Check if airship land ok
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 是否为飞艇可降落的陆地 / Whether airship land ok
 */
Game_Map.prototype.isAirshipLandOk = function (x, y) {
	return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};

/**
 * 检测层叠图层标志
 * Check layered tiles flags
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @param {number} bit - 检测位 / Check bit
 * @returns {boolean} 是否匹配标志 / Whether matches flag
 */
Game_Map.prototype.checkLayeredTilesFlags = function (x, y, bit) {
	var flags = this.tilesetFlags();
	return this.layeredTiles(x, y).some(function (tileId) {
		return (flags[tileId] & bit) !== 0;
	});
};

/**
 * 检查是否为梯子
 * Check if is ladder
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 是否为梯子 / Whether is ladder
 */
Game_Map.prototype.isLadder = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};

/**
 * 检查是否为草木繁茂处
 * Check if is bush
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 是否为草木繁茂处 / Whether is bush
 */
Game_Map.prototype.isBush = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};

/**
 * 检查是否为柜台
 * Check if is counter
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 是否为柜台 / Whether is counter
 */
Game_Map.prototype.isCounter = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};

/**
 * 检查是否为有害地形
 * Check if is damage floor
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {boolean} 是否为有害地形 / Whether is damage floor
 */
Game_Map.prototype.isDamageFloor = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};

/**
 * 获取地形标志
 * Get terrain tag
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {number} 地形标志 / Terrain tag
 */
Game_Map.prototype.terrainTag = function (x, y) {
	if (this.isValid(x, y)) {
		var flags = this.tilesetFlags();
		var tiles = this.layeredTiles(x, y);
		for (var i = 0; i < tiles.length; i++) {
			var tag = flags[tiles[i]] >> 12;
			if (tag > 0) {
				return tag;
			}
		}
	}
	return 0;
};

/**
 * 获取区域ID
 * Get region ID
 *
 * @param {number} x - X位置 / X position
 * @param {number} y - Y位置 / Y position
 * @returns {number} 区域ID / Region ID
 */
Game_Map.prototype.regionId = function (x, y) {
	return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};

/**
 * 开始滚动
 * Start scroll
 *
 * @param {number} direction - 方向 / Direction
 * @param {number} distance - 距离 / Distance
 * @param {number} speed - 速度 / Speed
 */
Game_Map.prototype.startScroll = function (direction, distance, speed) {
	this._scrollDirection = direction;
	this._scrollRest = distance;
	this._scrollSpeed = speed;
};

/**
 * 检查是否滚动中
 * Check if scrolling
 *
 * @returns {boolean} 是否滚动中 / Whether scrolling
 */
Game_Map.prototype.isScrolling = function () {
	return this._scrollRest > 0;
};

/**
 * 更新地图
 * Update map
 *
 * @param {boolean} sceneActive - 场景是否活跃 / Whether scene is active
 */
Game_Map.prototype.update = function (sceneActive) {
	this.refreshIfNeeded();
	if (sceneActive) {
		this.updateInterpreter();
	}
	this.updateScroll();
	this.updateEvents();
	this.updateVehicles();
	this.updateParallax();
};

/**
 * 更新滚动
 * Update scroll
 */
Game_Map.prototype.updateScroll = function () {
	if (this.isScrolling()) {
		var lastX = this._displayX;
		var lastY = this._displayY;
		this.doScroll(this._scrollDirection, this.scrollDistance());
		if (this._displayX === lastX && this._displayY === lastY) {
			this._scrollRest = 0;
		} else {
			this._scrollRest -= this.scrollDistance();
		}
	}
};

/**
 * 获取滚动距离
 * Get scroll distance
 *
 * @returns {number} 滚动距离 / Scroll distance
 */
Game_Map.prototype.scrollDistance = function () {
	return Math.pow(2, this._scrollSpeed) / 256;
};

/**
 * 进行滚动
 * Do scroll
 *
 * @param {number} direction - 方向 / Direction
 * @param {number} distance - 距离 / Distance
 */
Game_Map.prototype.doScroll = function (direction, distance) {
	switch (direction) {
		case 2:
			this.scrollDown(distance);
			break;
		case 4:
			this.scrollLeft(distance);
			break;
		case 6:
			this.scrollRight(distance);
			break;
		case 8:
			this.scrollUp(distance);
			break;
	}
};

/**
 * 更新事件
 * Update events
 */
Game_Map.prototype.updateEvents = function () {
	this.events().forEach(function (event) {
		event.update();
	});
	this._commonEvents.forEach(function (event) {
		event.update();
	});
};

/**
 * 更新载具
 * Update vehicles
 */
Game_Map.prototype.updateVehicles = function () {
	this._vehicles.forEach(function (vehicle) {
		vehicle.update();
	});
};

/**
 * 更新远景
 * Update parallax
 */
Game_Map.prototype.updateParallax = function () {
	if (this._parallaxLoopX) {
		this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
	}
	if (this._parallaxLoopY) {
		this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
	}
};

/**
 * 更改图块组
 * Change tileset
 *
 * @param {number} tilesetId - 图块组ID / Tileset ID
 */
Game_Map.prototype.changeTileset = function (tilesetId) {
	this._tilesetId = tilesetId;
	this.refresh();
};

/**
 * 更改战斗背景
 * Change battleback
 *
 * @param {string} battleback1Name - 战斗背景1名称 / Battleback1 name
 * @param {string} battleback2Name - 战斗背景2名称 / Battleback2 name
 */
Game_Map.prototype.changeBattleback = function (battleback1Name, battleback2Name) {
	this._battleback1Name = battleback1Name;
	this._battleback2Name = battleback2Name;
};

/**
 * 更改远景
 * Change parallax
 *
 * @param {string} name - 远景名称 / Parallax name
 * @param {boolean} loopX - 是否X轴循环 / Whether loop X
 * @param {boolean} loopY - 是否Y轴循环 / Whether loop Y
 * @param {number} sx - X轴滚动速度 / X axis scroll speed
 * @param {number} sy - Y轴滚动速度 / Y axis scroll speed
 */
Game_Map.prototype.changeParallax = function (name, loopX, loopY, sx, sy) {
	this._parallaxName = name;
	this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
	if (this._parallaxLoopX && !loopX) {
		this._parallaxX = 0;
	}
	if (this._parallaxLoopY && !loopY) {
		this._parallaxY = 0;
	}
	this._parallaxLoopX = loopX;
	this._parallaxLoopY = loopY;
	this._parallaxSx = sx;
	this._parallaxSy = sy;
};

/**
 * 更新解释器
 * Update interpreter
 */
Game_Map.prototype.updateInterpreter = function () {
	for (;;) {
		this._interpreter.update();
		if (this._interpreter.isRunning()) {
			return;
		}
		if (this._interpreter.eventId() > 0) {
			this.unlockEvent(this._interpreter.eventId());
			this._interpreter.clear();
		}
		if (!this.setupStartingEvent()) {
			return;
		}
	}
};

/**
 * 解锁事件
 * Unlock event
 *
 * @param {number} eventId - 事件ID / Event ID
 */
Game_Map.prototype.unlockEvent = function (eventId) {
	if (this._events[eventId]) {
		this._events[eventId].unlock();
	}
};

/**
 * 设置开始的事件
 * Setup starting event
 *
 * @returns {boolean} 是否成功设置 / Whether successfully setup
 */
Game_Map.prototype.setupStartingEvent = function () {
	this.refreshIfNeeded();
	if (this._interpreter.setupReservedCommonEvent()) {
		return true;
	}
	if (this.setupTestEvent()) {
		return true;
	}
	if (this.setupStartingMapEvent()) {
		return true;
	}
	if (this.setupAutorunCommonEvent()) {
		return true;
	}
	return false;
};

/**
 * 设置测试事件
 * Setup test event
 *
 * @returns {boolean} 是否成功设置 / Whether successfully setup
 */
Game_Map.prototype.setupTestEvent = function () {
	if ($testEvent) {
		this._interpreter.setup($testEvent, 0);
		$testEvent = null;
		return true;
	}
	return false;
};

/**
 * 设置开始的地图事件
 * Setup starting map event
 *
 * @returns {boolean} 是否成功设置 / Whether successfully setup
 */
Game_Map.prototype.setupStartingMapEvent = function () {
	var events = this.events();
	for (var i = 0; i < events.length; i++) {
		var event = events[i];
		if (event.isStarting()) {
			event.clearStartingFlag();
			this._interpreter.setup(event.list(), event.eventId());
			return true;
		}
	}
	return false;
};

/**
 * 设置自动运行的公共事件
 * Setup autorun common event
 *
 * @returns {boolean} 是否成功设置 / Whether successfully setup
 */
Game_Map.prototype.setupAutorunCommonEvent = function () {
	for (var i = 0; i < $dataCommonEvents.length; i++) {
		var event = $dataCommonEvents[i];
		if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
			this._interpreter.setup(event.list);
			return true;
		}
	}
	return false;
};

/**
 * 检查是否有事件开始
 * Check if any event is starting
 *
 * @returns {boolean} 是否有事件开始 / Whether any event is starting
 */
Game_Map.prototype.isAnyEventStarting = function () {
	return this.events().some(function (event) {
		return event.isStarting();
	});
};
