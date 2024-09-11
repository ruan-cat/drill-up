//-----------------------------------------------------------------------------
// Game_Map
// 游戏地图     $gameMap
// The game object class for a map. It contains scrolling and passage
// determination functions.
// 一个地图的游戏对象类,它包含滚动和通行决定功能

function Game_Map() {
	this.initialize.apply(this, arguments);
}
//初始化
Game_Map.prototype.initialize = function () {
	//事件解释器 = 新 游戏事件解释器()
	this._interpreter = new Game_Interpreter();
	//地图id = 0
	this._mapId = 0;
	//图块组id = 0
	this._tilesetId = 0;
	//事件组 = []
	this._events = [];
	//公共事件组 = []
	this._commonEvents = [];
	//交通工具组 = []
	this._vehicles = [];
	//显示x = 0
	this._displayX = 0;
	//显示y = 0
	this._displayY = 0;
	//名称显示 = true
	this._nameDisplay = true;
	//滚动方向 = 2
	this._scrollDirection = 2;
	//滚动剩余 = 0
	this._scrollRest = 0;
	//滚动速度 = 4
	this._scrollSpeed = 4;
	//远景图名称 = ""
	this._parallaxName = "";
	//远景图0视差 = false
	this._parallaxZero = false;
	//远景图循环x = false
	this._parallaxLoopX = false;
	//远景图循环y = false
	this._parallaxLoopY = false;
	//远景图开始x = 0
	this._parallaxSx = 0;
	//远景图开始y = 0
	this._parallaxSy = 0;
	//远景图x = 0
	this._parallaxX = 0;
	//远景图y = 0
	this._parallaxY = 0;
	//战斗背景1名称 = null
	this._battleback1Name = null;
	//战斗背景2名称 = null
	this._battleback2Name = null;
	//创造交通工具组()
	this.createVehicles();
};

//安装
Game_Map.prototype.setup = function (mapId) {
	//如果(不是 数据地图)
	if (!$dataMap) {
		//抛出 新 错误('The map data is not available' // 地图数据不可用  )
		throw new Error("The map data is not available");
	}
	//地图id = mapId//地图id
	this._mapId = mapId;
	//图块组id = 数据地图 图块组id
	this._tilesetId = $dataMap.tilesetId;
	//显示x = 0
	this._displayX = 0;
	//显示y = 0
	this._displayY = 0;
	//刷新交通工具组()
	this.refereshVehicles();
	//安装事件组()
	this.setupEvents();
	//安装滚动()
	this.setupScroll();
	//安装远景图()
	this.setupParallax();
	//安装战斗背景()
	this.setupBattleback();
	//需要刷新 = false
	this._needsRefresh = false;
};
//是事件运转
Game_Map.prototype.isEventRunning = function () {
	//返回 事件解释器 是运转() 或者 是任何事件开始()
	return this._interpreter.isRunning() || this.isAnyEventStarting();
};
//图块宽
Game_Map.prototype.tileWidth = function () {
	//返回 48
	return 48;
};
//图块高
Game_Map.prototype.tileHeight = function () {
	//返回 48
	return 48;
};
//地图id
Game_Map.prototype.mapId = function () {
	//返回 地图id
	return this._mapId;
};
//图块组id
Game_Map.prototype.tilesetId = function () {
	//返回 图块组id
	return this._tilesetId;
};
//显示x
Game_Map.prototype.displayX = function () {
	//返回 显示x
	return this._displayX;
};
//显示y
Game_Map.prototype.displayY = function () {
	//返回 显示y
	return this._displayY;
};
//远景图名称
Game_Map.prototype.parallaxName = function () {
	//返回 远景图名称
	return this._parallaxName;
};
//战斗背景1名称
Game_Map.prototype.battleback1Name = function () {
	//返回 战斗背景1名称
	return this._battleback1Name;
};
//战斗背景2名称
Game_Map.prototype.battleback2Name = function () {
	//返回 战斗背景2名称
	return this._battleback2Name;
};
//请求刷新
Game_Map.prototype.requestRefresh = function (mapId) {
	//需要刷新 = true
	this._needsRefresh = true;
};
//是名称显示允许
Game_Map.prototype.isNameDisplayEnabled = function () {
	//返回 名称显示
	return this._nameDisplay;
};
//禁止名称显示
Game_Map.prototype.disableNameDisplay = function () {
	//名称显示 = false
	this._nameDisplay = false;
};
//能够名称显示
Game_Map.prototype.enableNameDisplay = function () {
	//名称显示 = true
	this._nameDisplay = true;
};
//创造交通工具组
Game_Map.prototype.createVehicles = function () {
	//交通工具组 = []
	this._vehicles = [];
	//交通工具组[0] = 新 游戏交通工具("boat"//小船)
	this._vehicles[0] = new Game_Vehicle("boat");
	//交通工具组[1] = 新 游戏交通工具("ship"//帆船)
	this._vehicles[1] = new Game_Vehicle("ship");
	//交通工具组[2] = 新 游戏交通工具("airship"//天空船)
	this._vehicles[2] = new Game_Vehicle("airship");
};
//刷新交通工具组
Game_Map.prototype.refereshVehicles = function () {
	//交通工具组 对每一个 方法(交通工具)
	this._vehicles.forEach(function (vehicle) {
		//交通工具 刷新()
		vehicle.refresh();
	});
};
//交通工具组
Game_Map.prototype.vehicles = function () {
	//返回 交通工具组
	return this._vehicles;
};
//交通工具
Game_Map.prototype.vehicle = function (type) {
	//如果(种类 === 0 或者 种类 === "boat"//小船 )
	if (type === 0 || type === "boat") {
		//返回 小船()
		return this.boat();
		//否则 如果(种类 === 1 或者 种类 === "ship"//帆船 )
	} else if (type === 1 || type === "ship") {
		//返回 帆船()
		return this.ship();
		//否则 如果(种类 === 2 或者 种类 === "airship"//天空船 )
	} else if (type === 2 || type === "airship") {
		//返回 天空船()
		return this.airship();
		//否则
	} else {
		//返回 null
		return null;
	}
};
//小船
Game_Map.prototype.boat = function () {
	//返回 交通工具组[0]
	return this._vehicles[0];
};
//帆船
Game_Map.prototype.ship = function () {
	//返回 交通工具组[1]
	return this._vehicles[1];
};
//天空船
Game_Map.prototype.airship = function () {
	//返回 交通工具组[2]
	return this._vehicles[2];
};
//安装事件组
Game_Map.prototype.setupEvents = function () {
	//事件组 = []
	this._events = [];
	//循环 (开始时 i = 0 ;当 i < 数据地图 事件组 长度 ; 每一次 i++)
	for (var i = 0; i < $dataMap.events.length; i++) {
		//如果(数据地图 事件组[i])
		if ($dataMap.events[i]) {
			//事件组[i] = 新 游戏事件(地图id , i)
			this._events[i] = new Game_Event(this._mapId, i);
		}
	}
	//公共事件组 = 并行公共事件组() 映射 方法 (公共事件)
	this._commonEvents = this.parallelCommonEvents().map(function (commonEvent) {
		//返回 新 游戏公共事件(公共事件 id)
		return new Game_CommonEvent(commonEvent.id);
	});
	//刷新图块事件()
	this.refreshTileEvents();
};
//事件组
Game_Map.prototype.events = function () {
	//返回 事件组 过滤 方法(事件)
	return this._events.filter(function (event) {
		//返回 !!事件
		return !!event;
	});
};
//事件
Game_Map.prototype.event = function (eventId) {
	//返回 事件组[事件id]
	return this._events[eventId];
};
//抹去事件
Game_Map.prototype.eraseEvent = function (eventId) {
	//事件组[事件id] 抹去()
	this._events[eventId].erase();
};
//并行公共事件组
Game_Map.prototype.parallelCommonEvents = function () {
	//返回 数据公共事件组 过滤 方法(公共事件)
	return $dataCommonEvents.filter(function (commonEvent) {
		//返回 公共事件 并且 公共事件 触发 === 2
		return commonEvent && commonEvent.trigger === 2;
	});
};
//安装滚动
Game_Map.prototype.setupScroll = function () {
	//滚动方向 = 2
	this._scrollDirection = 2;
	//滚动剩余 = 0
	this._scrollRest = 0;
	//滚动速度 = 4
	this._scrollSpeed = 4;
};
//安装远景图
Game_Map.prototype.setupParallax = function () {
	//远景图名称 = 数据地图 远景图名称 或者 ""
	this._parallaxName = $dataMap.parallaxName || "";
	//远景图0视差 = 图像管理器 是0视差(远景图名称)
	this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
	//远景图循环x = 数据地图 远景图循环x
	this._parallaxLoopX = $dataMap.parallaxLoopX;
	//远景图循环y = 数据地图 远景图循环y
	this._parallaxLoopY = $dataMap.parallaxLoopY;
	//远景图开始x = 数据地图 远景图开始x
	this._parallaxSx = $dataMap.parallaxSx;
	//远景图开始y = 数据地图 远景图开始y
	this._parallaxSy = $dataMap.parallaxSy;
	//远景图x = 0
	this._parallaxX = 0;
	//远景图y = 0
	this._parallaxY = 0;
};
//安装战斗背景
Game_Map.prototype.setupBattleback = function () {
	//如果(数据地图 指定战斗背景)
	if ($dataMap.specifyBattleback) {
		//战斗背景1名称 = 数据地图 战斗背景1名称
		this._battleback1Name = $dataMap.battleback1Name;
		//战斗背景2名称 = 数据地图 战斗背景2名称
		this._battleback2Name = $dataMap.battleback2Name;
		//否则
	} else {
		//战斗背景1名称 = null
		this._battleback1Name = null;
		//战斗背景2名称 = null
		this._battleback2Name = null;
	}
};
//设置显示位置
Game_Map.prototype.setDisplayPos = function (x, y) {
	//如果( 是横向循环() )
	if (this.isLoopHorizontal()) {
		//显示x = x 求余数( 宽() )
		this._displayX = x.mod(this.width());
		//远景图x = x
		this._parallaxX = x;
		//否则
	} else {
		//结束x = 宽() - 画面显示图块x()
		var endX = this.width() - this.screenTileX();
		//显示x = 如果 结束x < 0 返回 结束x / 2 否则 返回 x 在之间(0,结束x)
		this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
		//远景图x = 显示x
		this._parallaxX = this._displayX;
	}
	//如果( 是纵向循环() )
	if (this.isLoopVertical()) {
		//显示y = y 求余数( 高() )
		this._displayY = y.mod(this.height());
		//远景图y = y
		this._parallaxY = y;
	} else {
		//结束y = 高() - 画面显示图块y()
		var endY = this.height() - this.screenTileY();
		//显示y = 如果 结束x < 0 返回 结束y / 2 否则 返回 y 在之间(0,结束y)
		this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
		//远景图y = 显示x
		this._parallaxY = this._displayY;
	}
};
//远景图ox
Game_Map.prototype.parallaxOx = function () {
	//如果(远景图0视差)
	if (this._parallaxZero) {
		//返回 远景图x * 图块宽()
		return this._parallaxX * this.tileWidth();
		//否则 如果 ( 远景图循环x )
	} else if (this._parallaxLoopX) {
		//返回 远景图x * 图块宽() / 2
		return (this._parallaxX * this.tileWidth()) / 2;
		//否则
	} else {
		//返回 0
		return 0;
	}
};
//远景图oy
Game_Map.prototype.parallaxOy = function () {
	//如果(远景图0视差)
	if (this._parallaxZero) {
		//返回 远景图y * 图块高()
		return this._parallaxY * this.tileHeight();
		//否则 如果 ( 远景图循环y )
	} else if (this._parallaxLoopY) {
		//返回 远景图y * 图块高() / 2
		return (this._parallaxY * this.tileHeight()) / 2;
		//否则
	} else {
		//返回 0
		return 0;
	}
};
//图块组
Game_Map.prototype.tileset = function () {
	//返回 数据图块组[图块组id]
	return $dataTilesets[this._tilesetId];
};
//图块组标志
Game_Map.prototype.tilesetFlags = function () {
	//图块组 = 图块组()
	var tileset = this.tileset();
	//如果(图块组)
	if (tileset) {
		//返回 图块组 标志组
		return tileset.flags;
		//否则
	} else {
		//返回 []
		return [];
	}
};
//显示名称
Game_Map.prototype.displayName = function () {
	//返回 数据地图 显示名称
	return $dataMap.displayName;
};
//宽
Game_Map.prototype.width = function () {
	//返回 数据地图 宽
	return $dataMap.width;
};
//高
Game_Map.prototype.height = function () {
	//返回 数据地图 高
	return $dataMap.height;
};
//数据
Game_Map.prototype.data = function () {
	//返回 数据地图 数据
	return $dataMap.data;
};
//是横向循环
Game_Map.prototype.isLoopHorizontal = function () {
	//返回 数据地图 滚动种类 === 2 或者 数据地图 滚动种类 === 3
	return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};
//是纵向循环
Game_Map.prototype.isLoopVertical = function () {
	//返回 数据地图 滚动种类 === 1 或者 数据地图 滚动种类 === 3
	return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};
//是奔跑禁止
Game_Map.prototype.isDashDisabled = function () {
	//返回 数据地图 禁止奔跑
	return $dataMap.disableDashing;
};
//遭遇表
Game_Map.prototype.encounterList = function () {
	//返回 数据地图 遭遇表
	return $dataMap.encounterList;
};
//遭遇步数
Game_Map.prototype.encounterStep = function () {
	//返回 数据地图 遭遇步数
	return $dataMap.encounterStep;
};
//是大地图
Game_Map.prototype.isOverworld = function () {
	//返回 图块组() 并且 图块组() 模式 === 0
	return this.tileset() && this.tileset().mode === 0;
};
//画面显示图块x
Game_Map.prototype.screenTileX = function () {
	//返回 图形 宽 / 图块宽()
	return Graphics.width / this.tileWidth();
};
//画面显示图块y
Game_Map.prototype.screenTileY = function () {
	//返回 图形 高 / 图块高()
	return Graphics.height / this.tileHeight();
};
//校正x(显示区域的x)
Game_Map.prototype.adjustX = function (x) {
	//如果( 是横向循环() 并且 x < 显示x - ( ( 宽() - 画面显示图块x() ) / 2 )      )
	if (this.isLoopHorizontal() && x < this._displayX - (this.width() - this.screenTileX()) / 2) {
		//返回 x - 显示x + 数据地图 宽
		return x - this._displayX + $dataMap.width;
		//否则
	} else {
		//返回 x - 显示x
		return x - this._displayX;
	}
};
//校正y(显示区域的y)
Game_Map.prototype.adjustY = function (y) {
	//如果( 是纵向循环() 并且 y < 显示y - ( ( 高() - 画面显示图块y() ) / 2  )    )
	if (this.isLoopVertical() && y < this._displayY - (this.height() - this.screenTileY()) / 2) {
		//返回 y - 显示y + 数据地图 高
		return y - this._displayY + $dataMap.height;
		//否则
	} else {
		//返回 y - 显示y
		return y - this._displayY;
	}
};
//环x
Game_Map.prototype.roundX = function (x) {
	//返回 如果 是横向循环() 返回 x 求余数( 宽() ) 否则 返回 x
	return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};
//环y
Game_Map.prototype.roundY = function (y) {
	//返回 如果 是纵向循环() 返回 y 求余数( 高() ) 否则 返回 y
	return this.isLoopVertical() ? y.mod(this.height()) : y;
};
//x和方向
Game_Map.prototype.xWithDirection = function (x, d) {
	//返回 x + ( 如果 d === 6 返回 1 否则 如果 d === 4 返回 -1 否则 返回 0)
	return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};
//y和方向
Game_Map.prototype.yWithDirection = function (y, d) {
	//返回 y + ( 如果 d === 2 返回 1 否则 如果 d === 8 返回 -1 否则 返回 0)
	return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};
//环x和方向
Game_Map.prototype.roundXWithDirection = function (x, d) {
	//返回 环x() + ( 如果 d === 6 返回 1 否则 如果 d === 4 返回 -1 否则 返回 0)
	return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};
//环y和方向
Game_Map.prototype.roundYWithDirection = function (y, d) {
	//返回 环y() + ( 如果 d === 2 返回 1 否则 如果 d === 8 返回 -1 否则 返回 0)
	return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};
//差距x
Game_Map.prototype.deltaX = function (x1, x2) {
	//结果 = x1 - x2
	var result = x1 - x2;
	//如果( 是横向循环() 并且 数学 绝对值(结果) > 宽() / 2  )
	if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
		//如果(结果 < 0 )
		if (result < 0) {
			//结果 += 宽()
			result += this.width();
			//否则
		} else {
			//结果 -= 宽()
			result -= this.width();
		}
	}
	//返回 结果
	return result;
};
//差距y
Game_Map.prototype.deltaY = function (y1, y2) {
	//结果 = y1 - y2
	var result = y1 - y2;
	//如果( 是纵向循环() 并且 数学 绝对值(结果) > 高() / 2  )
	if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
		//如果(结果 < 0 )
		if (result < 0) {
			//结果 += 高()
			result += this.height();
			//否则
		} else {
			//结果 -= 高()
			result -= this.height();
		}
	}
	//返回 结果
	return result;
};
//距离
Game_Map.prototype.distance = function (x1, y1, x2, y2) {
	//返回 数学 绝对值( 差距x(x1,x2) ) + 数学 绝对值( 差距y(y1,y2) )
	return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};
//画布到地图x
Game_Map.prototype.canvasToMapX = function (x) {
	//图块宽 = 图块宽()
	var tileWidth = this.tileWidth();
	//原点x = 显示x * 图块宽
	var originX = this._displayX * tileWidth;
	//地图x = 数学 向下取整( (原点x + x) / 图块宽 )
	var mapX = Math.floor((originX + x) / tileWidth);
	//返回 环x(地图x)
	return this.roundX(mapX);
};
//画布到地图y
Game_Map.prototype.canvasToMapY = function (y) {
	//图块高 = 图块高()
	var tileHeight = this.tileHeight();
	//原点y = 显示y * 图块高
	var originY = this._displayY * tileHeight;
	//地图y = 数学 向下取整( (原点y + y) / 图块高 )
	var mapY = Math.floor((originY + y) / tileHeight);
	//返回 环y(地图y)
	return this.roundY(mapY);
};
//自动播放
Game_Map.prototype.autoplay = function () {
	//如果(数据地图 自动播放bgm)
	if ($dataMap.autoplayBgm) {
		//音频管理器 播放bgm(数据地图 bgm)
		AudioManager.playBgm($dataMap.bgm);
	}
	//如果(数据地图 自动播放bgs)
	if ($dataMap.autoplayBgs) {
		//音频管理器 播放bgs(数据地图 bgs)
		AudioManager.playBgs($dataMap.bgs);
	}
};
//刷新如果需要
Game_Map.prototype.refreshIfNeeded = function () {
	//如果(需要刷新 )
	if (this._needsRefresh) {
		//刷新()
		this.refresh();
	}
};
//刷新
Game_Map.prototype.refresh = function () {
	//事件组() 对每一个 方法(事件)
	this.events().forEach(function (event) {
		//事件 刷新()
		event.refresh();
	});
	//公共事件组() 对每一个 方法(事件)
	this._commonEvents.forEach(function (event) {
		//事件 刷新()
		event.refresh();
	});
	//刷新图块事件组()
	this.refreshTileEvents();
	//需要刷新 = false
	this._needsRefresh = false;
};
//刷新图块事件组
Game_Map.prototype.refreshTileEvents = function () {
	//图块事件组 = 事件组() 过滤 方法(事件)
	this.tileEvents = this.events().filter(function (event) {
		//返回 事件 是图块()
		return event.isTile();
	});
};
//事件组xy
Game_Map.prototype.eventsXy = function (x, y) {
	//返回 事件组 过滤 方法(事件)
	return this.events().filter(function (event) {
		//返回 事件 位于(x,y)
		return event.pos(x, y);
	});
};
//事件组xy无穿越
Game_Map.prototype.eventsXyNt = function (x, y) {
	//返回 事件组 过滤 方法(事件)
	return this.events().filter(function (event) {
		//返回 事件 位于无穿越(x,y)
		return event.posNt(x, y);
	});
};
//图块事件组xy无穿越
Game_Map.prototype.tileEventsXy = function (x, y) {
	//返回 图块事件组 过滤 方法(事件)
	return this.tileEvents.filter(function (event) {
		//返回 事件 位于无穿越(x,y)
		return event.posNt(x, y);
	});
};
//xy处事件id
Game_Map.prototype.eventIdXy = function (x, y) {
	//列表 = 事件组xy(x,y)
	var list = this.eventsXy(x, y);
	//返回 如果 列表 长度 ===  0 返回 0 否则 返回 列表[0] 事件id
	return list.length === 0 ? 0 : list[0].eventId();
};
//滚动向下
Game_Map.prototype.scrollDown = function (distance) {
	//如果( 是纵向循环() )
	if (this.isLoopVertical()) {
		//显示y += 距离
		this._displayY += distance;
		//显示y %= 数据地图 高
		this._displayY %= $dataMap.height;
		//如果(远景图循环y )
		if (this._parallaxLoopY) {
			//远景图x += 距离
			this._parallaxY += distance;
		}
		//否则 如果( 高 >= 画面显示图块y() )
	} else if (this.height() >= this.screenTileY()) {
		//最后y = 显示y
		var lastY = this._displayY;
		//显示y = 数学 最小值(显示y + 距离 , 高() - 画面显示图块y() )
		this._displayY = Math.min(this._displayY + distance, this.height() - this.screenTileY());
		//远景图x += 显示y - 最后y
		this._parallaxY += this._displayY - lastY;
	}
};
//滚动向左
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
//滚动向右
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
//滚动向上
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
//是有效的
Game_Map.prototype.isValid = function (x, y) {
	return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};
//检查通道
Game_Map.prototype.checkPassage = function (x, y, bit) {
	//标志组 = 图块组标志
	var flags = this.tilesetFlags();
	//图块组 = 所有图块(x,y)
	var tiles = this.allTiles(x, y);
	//循环 开始时 i=0 ; 当 i < 图块组 长度 ; 每一次 i++
	for (var i = 0; i < tiles.length; i++) {
		//标志  = 标志组 [ 图块组[i]]
		var flag = flags[tiles[i]];
		//如果 ( 标志 & 0x10//10000  !=== 0 ) //不影响通行
		if ((flag & 0x10) !== 0)
			// [*] No effect on passage'
			//下一个
			continue;
		//如果  标志 & 比特 === 0 //通过
		if ((flag & bit) === 0)
			// [o] Passable
			//返回 true
			return true;
		//如果  标志 & 比特 === 比特 //不能通过
		if ((flag & bit) === bit)
			// [x] Impassable
			//返回 false
			return false;
	}
	//返回 false
	return false;
};
//图块id
Game_Map.prototype.tileId = function (x, y, z) {
	var width = $dataMap.width;
	var height = $dataMap.height;
	return $dataMap.data[(z * height + y) * width + x] || 0;
};
//层图块
Game_Map.prototype.layeredTiles = function (x, y) {
	var tiles = [];
	for (var i = 0; i < 4; i++) {
		tiles.push(this.tileId(x, y, 3 - i));
	}
	return tiles;
};
//所有图块
Game_Map.prototype.allTiles = function (x, y) {
	var tiles = this.tileEventsXy(x, y).map(function (event) {
		return event.tileId();
	});
	return tiles.concat(this.layeredTiles(x, y));
};
//自动图块种类
Game_Map.prototype.autotileType = function (x, y, z) {
	var tileId = this.tileId(x, y, z);
	return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};
//是可通行的
Game_Map.prototype.isPassable = function (x, y, d) {
	//返回 检查通道(x,y, ( 1<<(d/2-1)) //2的(d/2-1)次方  & 0x0f //1111  )
	return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};
//是小船可通行的
Game_Map.prototype.isBoatPassable = function (x, y) {
	//返回 检查通道(x,y, 0x0200 //1000000000  )
	return this.checkPassage(x, y, 0x0200);
};
//是帆船可通行的
Game_Map.prototype.isShipPassable = function (x, y) {
	//返回 检查通道(x,y, 0x0400 //10000000000  )
	return this.checkPassage(x, y, 0x0400);
};
//是天空船陆地可以
Game_Map.prototype.isAirshipLandOk = function (x, y) {
	//返回 检查通道(x,y, 0x0800 //100000000000  ) 并且 检查通道(x, y,  0x0f //1111 )
	return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};
//检查层图块标志
Game_Map.prototype.checkLayeredTilesFlags = function (x, y, bit) {
	var flags = this.tilesetFlags();
	return this.layeredTiles(x, y).some(function (tileId) {
		return (flags[tileId] & bit) !== 0;
	});
};
//是梯子
Game_Map.prototype.isLadder = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};
//是灌木丛
Game_Map.prototype.isBush = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};
//是柜台
Game_Map.prototype.isCounter = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};
//是伤害地形
Game_Map.prototype.isDamageFloor = function (x, y) {
	return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};
//地域标签
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
//区域id
Game_Map.prototype.regionId = function (x, y) {
	return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};
//开始滚动
Game_Map.prototype.startScroll = function (direction, distance, speed) {
	this._scrollDirection = direction;
	this._scrollRest = distance;
	this._scrollSpeed = speed;
};
//是滚动中
Game_Map.prototype.isScrolling = function () {
	return this._scrollRest > 0;
};
//更新
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
//更新滚动
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
//滚动距离
Game_Map.prototype.scrollDistance = function () {
	return Math.pow(2, this._scrollSpeed) / 256;
};
//做滚动
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
//更新事件
Game_Map.prototype.updateEvents = function () {
	this.events().forEach(function (event) {
		event.update();
	});
	this._commonEvents.forEach(function (event) {
		event.update();
	});
};
//更新交通工具
Game_Map.prototype.updateVehicles = function () {
	this._vehicles.forEach(function (vehicle) {
		vehicle.update();
	});
};
//更新远景图
Game_Map.prototype.updateParallax = function () {
	if (this._parallaxLoopX) {
		this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
	}
	if (this._parallaxLoopY) {
		this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
	}
};
//改变图块组
Game_Map.prototype.changeTileset = function (tilesetId) {
	this._tilesetId = tilesetId;
	this.refresh();
};
//改变战斗背景
Game_Map.prototype.changeBattleback = function (battleback1Name, battleback2Name) {
	this._battleback1Name = battleback1Name;
	this._battleback2Name = battleback2Name;
};
//改变远景图
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
//更新事件解释器
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
//解锁事件
Game_Map.prototype.unlockEvent = function (eventId) {
	if (this._events[eventId]) {
		this._events[eventId].unlock();
	}
};
//安装开始事件
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
//安装测试事件
Game_Map.prototype.setupTestEvent = function () {
	if ($testEvent) {
		this._interpreter.setup($testEvent, 0);
		$testEvent = null;
		return true;
	}
	return false;
};
//安装开始地图事件
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
//安装自动公共事件
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
//是任何事件开始
Game_Map.prototype.isAnyEventStarting = function () {
	return this.events().some(function (event) {
		return event.isStarting();
	});
};
