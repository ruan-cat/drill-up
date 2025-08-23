//=============================================================================
// rpg_objects.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------
// 游戏_玩家 
// Game_Player
//
// 玩家的游戏对象类。它包含事件开始判定和地图滚动功能。
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.

function Game_Player() {
    this.initialize.apply(this, arguments);
}

Game_Player.prototype = Object.create(Game_Character.prototype);
Game_Player.prototype.constructor = Game_Player;

/* 初始化 */
Game_Player.prototype.initialize = function() {
    Game_Character.prototype.initialize.call(this);
    this.setTransparent($dataSystem.optTransparent);
};

/* 初始化成员 */
Game_Player.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._vehicleType = 'walk';
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

/* 清除场所移动信息 */
Game_Player.prototype.clearTransferInfo = function() {
    this._transferring = false;
    this._newMapId = 0;
    this._newX = 0;
    this._newY = 0;
    this._newDirection = 0;
};

/* 跟随者 */
Game_Player.prototype.followers = function() {
    return this._followers;
};

/* 刷新 */
Game_Player.prototype.refresh = function() {
    var actor = $gameParty.leader();
    var characterName = actor ? actor.characterName() : '';
    var characterIndex = actor ? actor.characterIndex() : 0;
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
};

/* 是否停止中 */
Game_Player.prototype.isStopping = function() {
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    return Game_Character.prototype.isStopping.call(this);
};

/* 储存场所移动 */
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    this._transferring = true;
    this._newMapId = mapId;
    this._newX = x;
    this._newY = y;
    this._newDirection = d;
    this._fadeType = fadeType;
};

/* 请求地图重载 */
Game_Player.prototype.requestMapReload = function() {
    this._needsMapReload = true;
};

/* 是否场所移动中 */
Game_Player.prototype.isTransferring = function() {
    return this._transferring;
};

/* 新地图 ID */
Game_Player.prototype.newMapId = function() {
    return this._newMapId;
};

/* 渐变类型 */
Game_Player.prototype.fadeType = function() {
    return this._fadeType;
};

/* 表现场所移动 */
Game_Player.prototype.performTransfer = function() {
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

/* 是否地图可通行 */
Game_Player.prototype.isMapPassable = function(x, y, d) {
    var vehicle = this.vehicle();
    if (vehicle) {
        return vehicle.isMapPassable(x, y, d);
    } else {
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};

/* 载具 */
Game_Player.prototype.vehicle = function() {
    return $gameMap.vehicle(this._vehicleType);
};

/* 是否在小舟 */
Game_Player.prototype.isInBoat = function() {
    return this._vehicleType === 'boat';
};

/* 是否在大船 */
Game_Player.prototype.isInShip = function() {
    return this._vehicleType === 'ship';
};

/* 是否在飞艇 */
Game_Player.prototype.isInAirship = function() {
    return this._vehicleType === 'airship';
};

/* 是否在载具 */
Game_Player.prototype.isInVehicle = function() {
    return this.isInBoat() || this.isInShip() || this.isInAirship();
};

/* 是否普通 */
Game_Player.prototype.isNormal = function() {
    return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
};

/* 是否奔跑 */
Game_Player.prototype.isDashing = function() {
    return this._dashing;
};

/* 是否调试穿透 
 * 在调试模式下，按 ctrl 可使玩家穿透。
 */
Game_Player.prototype.isDebugThrough = function() {
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};

/* 是否碰撞 */
Game_Player.prototype.isCollided = function(x, y) {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
};

/* 中心 X 位置*/
Game_Player.prototype.centerX = function() {
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};

/* 中心 Y 位置*/
Game_Player.prototype.centerY = function() {
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};

/* 中心位置 */
Game_Player.prototype.center = function(x, y) {
    return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};

/* 放置 */
Game_Player.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    this.makeEncounterCount();
    if (this.isInVehicle()) {
        this.vehicle().refresh();
    }
    this._followers.synchronize(x, y, this.direction());
};

/* 增加步数 */
Game_Player.prototype.increaseSteps = function() {
    Game_Character.prototype.increaseSteps.call(this);
    if (this.isNormal()) {
        $gameParty.increaseSteps();
    }
};

/* 制作遇敌计数 */
Game_Player.prototype.makeEncounterCount = function() {
    var n = $gameMap.encounterStep();
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};

/* 制作遇敌敌群 ID */
Game_Player.prototype.makeEncounterTroopId = function() {
    var encounterList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function(encounter) {
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

/* 是否满足遇敌条件 */
Game_Player.prototype.meetsEncounterConditions = function(encounter) {
    return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
};

/* 执行遇敌 */
Game_Player.prototype.executeEncounter = function() {
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

/* 开始地图事件 */
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                event.start();
            }
        });
    }
};

/* 随着输入移动 */
Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        var direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
            var x = $gameTemp.destinationX();
            var y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);
        }
        if (direction > 0) {
            this.executeMove(direction);
        }
    }
};

/* 是否可移动 */
Game_Player.prototype.canMove = function() {
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

/* 获取输入的方向 */
Game_Player.prototype.getInputDirection = function() {
    return Input.dir4;
};

/* 执行移动 */
Game_Player.prototype.executeMove = function(direction) {
    this.moveStraight(direction);
};

/* 更新 */
Game_Player.prototype.update = function(sceneActive) {
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

/* 更新奔跑 */
Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
        return;
    }
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    } else {
        this._dashing = false;
    }
};

/* 是否奔跑按键按下 */
Game_Player.prototype.isDashButtonPressed = function() {
    var shift = Input.isPressed('shift');
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};

/* 更新滚动 */
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
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

/* 更新载具 */
Game_Player.prototype.updateVehicle = function() {
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

/* 更新上载具 */
Game_Player.prototype.updateVehicleGetOn = function() {
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

/* 更新下载具 */
Game_Player.prototype.updateVehicleGetOff = function() {
    if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
        this._vehicleGettingOff = false;
        this._vehicleType = 'walk';
        this.setTransparent(false);
    }
};

/* 更新不移动 */
Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
            $gameParty.onPlayerWalk();
            this.checkEventTriggerHere([1,2]);
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

/* 触发行动 */
Game_Player.prototype.triggerAction = function() {
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

/* 触发按键行为 */
Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered('ok')) {
        if (this.getOnOffVehicle()) {
            return true;
        }
        this.checkEventTriggerHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
        this.checkEventTriggerThere([0,1,2]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};

/* 触发触摸行为 */
Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
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

/* 触发触摸行为 D1 */
Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
    if ($gameMap.airship().pos(x1, y1)) {
        if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerHere([0]);
    return $gameMap.setupStartingEvent();
};

/* 触发触摸行为 D2 */
Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
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
    this.checkEventTriggerThere([0,1,2]);
    return $gameMap.setupStartingEvent();
};

/* 触发触摸行为 D3 */
Game_Player.prototype.triggerTouchActionD3 = function(x2, y2) {
    if ($gameMap.isCounter(x2, y2)) {
        this.checkEventTriggerThere([0,1,2]);
    }
    return $gameMap.setupStartingEvent();
};

/* 更新遇敌计数 */
Game_Player.prototype.updateEncounterCount = function() {
    if (this.canEncounter()) {
        this._encounterCount -= this.encounterProgressValue();
    }
};

/* 是否能遇敌 */
Game_Player.prototype.canEncounter = function() {
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
};

/* 遇敌进度值 */
Game_Player.prototype.encounterProgressValue = function() {
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    if ($gameParty.hasEncounterHalf()) {
        value *= 0.5;
    }
    if (this.isInShip()) {
        value *= 0.5;
    }
    return value;
};

/* 检测这里（玩家位置）的事件触发条件 */
Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};

/* 检测那里（玩家前方位置）的事件触发条件 */
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
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

/* 检测接触的事件触发条件 */
Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(x, y, [1,2], true);
    }
};

/* 是否能开始本地事件 */
Game_Player.prototype.canStartLocalEvents = function() {
    return !this.isInAirship();
};

/* 上下载具 */
Game_Player.prototype.getOnOffVehicle = function() {
    if (this.isInVehicle()) {
        return this.getOffVehicle();
    } else {
        return this.getOnVehicle();
    }
};

/* 上载具 */
Game_Player.prototype.getOnVehicle = function() {
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = 'airship';
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = 'ship';
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = 'boat';
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

/* 下载具 */
Game_Player.prototype.getOffVehicle = function() {
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

/* 强制向前移动 */
Game_Player.prototype.forceMoveForward = function() {
    this.setThrough(true);
    this.moveForward();
    this.setThrough(false);
};

/* 是否在有害地形 */
Game_Player.prototype.isOnDamageFloor = function() {
    return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};

/* 直线移动 */
Game_Player.prototype.moveStraight = function(d) {
    if (this.canPass(this.x, this.y, d)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveStraight.call(this, d);
};

/* 斜线移动 */
Game_Player.prototype.moveDiagonally = function(horz, vert) {
    if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};

/* 跳跃 */
Game_Player.prototype.jump = function(xPlus, yPlus) {
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    this._followers.jumpAll();
};

/* 显示跟随者 */
Game_Player.prototype.showFollowers = function() {
    this._followers.show();
};

/* 隐藏跟随者 */
Game_Player.prototype.hideFollowers = function() {
    this._followers.hide();
};

/* 集合跟随者 */
Game_Player.prototype.gatherFollowers = function() {
    this._followers.gather();
};

/* 是否跟随者集合中 */
Game_Player.prototype.areFollowersGathering = function() {
    return this._followers.areGathering();
};

/* 是否跟随者集合了 */
Game_Player.prototype.areFollowersGathered = function() {
    return this._followers.areGathered();
};

//-----------------------------------------------------------------------------
// 游戏_跟随者
// Game_Follower
//
// 跟随者的游戏对象类。
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.

function Game_Follower() {
    this.initialize.apply(this, arguments);
}

Game_Follower.prototype = Object.create(Game_Character.prototype);
Game_Follower.prototype.constructor = Game_Follower;

/* 初始化 */
Game_Follower.prototype.initialize = function(memberIndex) {
    Game_Character.prototype.initialize.call(this);
    this._memberIndex = memberIndex;
    this.setTransparent($dataSystem.optTransparent);
    this.setThrough(true);
};

/* 刷新 */
Game_Follower.prototype.refresh = function() {
    var characterName = this.isVisible() ? this.actor().characterName() : '';
    var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
    this.setImage(characterName, characterIndex);
};

/* 角色 */
Game_Follower.prototype.actor = function() {
    return $gameParty.battleMembers()[this._memberIndex];
};

/* 是否可见的 */
Game_Follower.prototype.isVisible = function() {
    return this.actor() && $gamePlayer.followers().isVisible();
};

/* 更新 */
Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
};

/* 追逐人物 */
Game_Follower.prototype.chaseCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (sx !== 0 && sy !== 0) {
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    } else if (sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
};

//-----------------------------------------------------------------------------
// 游戏_跟随者们 
// Game_Followers
//
// 跟随者数组的封装类。 
// The wrapper class for a follower array.

function Game_Followers() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Followers.prototype.initialize = function() {
    this._visible = $dataSystem.optFollowers;
    this._gathering = false;
    this._data = [];
    for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
        this._data.push(new Game_Follower(i));
    }
};

/* 是否可见的 */
Game_Followers.prototype.isVisible = function() {
    return this._visible;
};

/* 显示 */
Game_Followers.prototype.show = function() {
    this._visible = true;
};

/* 隐藏 */
Game_Followers.prototype.hide = function() {
    this._visible = false;
};

/* 跟随者 */
Game_Followers.prototype.follower = function(index) {
    return this._data[index];
};

/* 遍历每个 */
Game_Followers.prototype.forEach = function(callback, thisObject) {
    this._data.forEach(callback, thisObject);
};

/* 翻转每个 */
Game_Followers.prototype.reverseEach = function(callback, thisObject) {
    this._data.reverse();
    this._data.forEach(callback, thisObject);
    this._data.reverse();
};

/* 刷新 */
Game_Followers.prototype.refresh = function() {
    this.forEach(function(follower) {
        return follower.refresh();
    }, this);
};

/* 更新 */
Game_Followers.prototype.update = function() {
    if (this.areGathering()) {
        if (!this.areMoving()) {
            this.updateMove();
        }
        if (this.areGathered()) {
            this._gathering = false;
        }
    }
    this.forEach(function(follower) {
        follower.update();
    }, this);
};

/* 更新移动 */
Game_Followers.prototype.updateMove = function() {
    for (var i = this._data.length - 1; i >= 0; i--) {
        var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
        this._data[i].chaseCharacter(precedingCharacter);
    }
};

/* 所有跳跃 */
Game_Followers.prototype.jumpAll = function() {
    if ($gamePlayer.isJumping()) {
        for (var i = 0; i < this._data.length; i++) {
            var follower = this._data[i];
            var sx = $gamePlayer.deltaXFrom(follower.x);
            var sy = $gamePlayer.deltaYFrom(follower.y);
            follower.jump(sx, sy);
        }
    }
};

/* 同步 */
Game_Followers.prototype.synchronize = function(x, y, d) {
    this.forEach(function(follower) {
        follower.locate(x, y);
        follower.setDirection(d);
    }, this);
};

/* 集合 */
Game_Followers.prototype.gather = function() {
    this._gathering = true;
};

/* 是否集合中 */
Game_Followers.prototype.areGathering = function() {
    return this._gathering;
};

/* 可见的跟随者 */
Game_Followers.prototype.visibleFollowers = function() {
    return this._data.filter(function(follower) {
        return follower.isVisible();
    }, this);
};

/* 是否移动中 */
Game_Followers.prototype.areMoving = function() {
    return this.visibleFollowers().some(function(follower) {
        return follower.isMoving();
    }, this);
};

/* 是否集合了 */
Game_Followers.prototype.areGathered = function() {
    return this.visibleFollowers().every(function(follower) {
        return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
    }, this);
};

/* 是否有人碰撞 */
Game_Followers.prototype.isSomeoneCollided = function(x, y) {
    return this.visibleFollowers().some(function(follower) {
        return follower.pos(x, y);
    }, this);
};

//-----------------------------------------------------------------------------
// 游戏_载具 
// Game_Vehicle
//
// 载具的游戏对象类。 
// The game object class for a vehicle.

function Game_Vehicle() {
    this.initialize.apply(this, arguments);
}

Game_Vehicle.prototype = Object.create(Game_Character.prototype);
Game_Vehicle.prototype.constructor = Game_Vehicle;

/* 初始化 */
Game_Vehicle.prototype.initialize = function(type) {
    Game_Character.prototype.initialize.call(this);
    this._type = type;
    this.resetDirection();
    this.initMoveSpeed();
    this.loadSystemSettings();
};

/* 初始化成员 */
Game_Vehicle.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._type = '';
    this._mapId = 0;
    this._altitude = 0;
    this._driving = false;
    this._bgm = null;
};

/* 是否是小舟 */
Game_Vehicle.prototype.isBoat = function() {
    return this._type === 'boat';
};

/* 是否是大船 */
Game_Vehicle.prototype.isShip = function() {
    return this._type === 'ship';
};

/* 是否是飞艇 */
Game_Vehicle.prototype.isAirship = function() {
    return this._type === 'airship';
};

/* 重置方向 */
Game_Vehicle.prototype.resetDirection = function() {
    this.setDirection(4);
};

/* 初始化移动速度 */
Game_Vehicle.prototype.initMoveSpeed = function() {
    if (this.isBoat()) {
        this.setMoveSpeed(4);
    } else if (this.isShip()) {
        this.setMoveSpeed(5);
    } else if (this.isAirship()) {
        this.setMoveSpeed(6);
    }
};

/* 载具 */
Game_Vehicle.prototype.vehicle = function() {
    if (this.isBoat()) {
        return $dataSystem.boat;
    } else if (this.isShip()) {
        return $dataSystem.ship;
    } else if (this.isAirship()) {
        return $dataSystem.airship;
    } else {
        return null;
    }
};

/* 读取系统设置 */
Game_Vehicle.prototype.loadSystemSettings = function() {
    var vehicle = this.vehicle();
    this._mapId = vehicle.startMapId;
    this.setPosition(vehicle.startX, vehicle.startY);
    this.setImage(vehicle.characterName, vehicle.characterIndex);
};

/* 刷新 */
Game_Vehicle.prototype.refresh = function() {
    if (this._driving) {
        this._mapId = $gameMap.mapId();
        this.syncWithPlayer();
    } else if (this._mapId === $gameMap.mapId()) {
        this.locate(this.x, this.y);
    }
    if (this.isAirship()) {
        this.setPriorityType(this._driving ? 2 : 0);
    } else {
        this.setPriorityType(1);
    }
    this.setWalkAnime(this._driving);
    this.setStepAnime(this._driving);
    this.setTransparent(this._mapId !== $gameMap.mapId());
};

/* 设置位置 */
Game_Vehicle.prototype.setLocation = function(mapId, x, y) {
    this._mapId = mapId;
    this.setPosition(x, y);
    this.refresh();
};

/* 位置 */
Game_Vehicle.prototype.pos = function(x, y) {
    if (this._mapId === $gameMap.mapId()) {
        return Game_Character.prototype.pos.call(this, x, y);
    } else {
        return false;
    }
};

/* 是否地图可通行 */
Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isBoat()) {
        return $gameMap.isBoatPassable(x2, y2);
    } else if (this.isShip()) {
        return $gameMap.isShipPassable(x2, y2);
    } else if (this.isAirship()) {
        return true;
    } else {
        return false;
    }
};

/* 上 */
Game_Vehicle.prototype.getOn = function() {
    this._driving = true;
    this.setWalkAnime(true);
    this.setStepAnime(true);
    $gameSystem.saveWalkingBgm();
    this.playBgm();
};

/* 下 */
Game_Vehicle.prototype.getOff = function() {
    this._driving = false;
    this.setWalkAnime(false);
    this.setStepAnime(false);
    this.resetDirection();
    $gameSystem.replayWalkingBgm();
};

/* 设置 BGM */
Game_Vehicle.prototype.setBgm = function(bgm) {
    this._bgm = bgm;
};

/* 播放 BGM */
Game_Vehicle.prototype.playBgm = function() {
    AudioManager.playBgm(this._bgm || this.vehicle().bgm);
};

/* 同步玩家 */
Game_Vehicle.prototype.syncWithPlayer = function() {
    this.copyPosition($gamePlayer);
    this.refreshBushDepth();
};

/* 画面 Y 坐标 */
Game_Vehicle.prototype.screenY = function() {
    return Game_Character.prototype.screenY.call(this) - this._altitude;
};

/* 影子 X 坐标 */
Game_Vehicle.prototype.shadowX = function() {
    return this.screenX();
};

/* 影子 Y 坐标 */
Game_Vehicle.prototype.shadowY = function() {
    return this.screenY() + this._altitude;
};

/* 影子不透明度 */
Game_Vehicle.prototype.shadowOpacity = function() {
    return 255 * this._altitude / this.maxAltitude();
};

/* 是否可移动 */
Game_Vehicle.prototype.canMove = function() {
    if (this.isAirship()) {
        return this.isHighest();
    } else {
        return true;
    }
};

/* 更新 */
Game_Vehicle.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    if (this.isAirship()) {
        this.updateAirship();
    }
};

/* 更新飞艇 */
Game_Vehicle.prototype.updateAirship = function() {
    this.updateAirshipAltitude();
    this.setStepAnime(this.isHighest());
    this.setPriorityType(this.isLowest() ? 0 : 2);
};

/* 更新飞艇高度 */
Game_Vehicle.prototype.updateAirshipAltitude = function() {
    if (this._driving && !this.isHighest()) {
        this._altitude++;
    }
    if (!this._driving && !this.isLowest()) {
        this._altitude--;
    }
};

/* 最大高度 */
Game_Vehicle.prototype.maxAltitude = function() {
    return 48;
};

/* 是否最低 */
Game_Vehicle.prototype.isLowest = function() {
    return this._altitude <= 0;
};

/* 是否最高 */
Game_Vehicle.prototype.isHighest = function() {
    return this._altitude >= this.maxAltitude();
};

/* 是否可以起飞 */
Game_Vehicle.prototype.isTakeoffOk = function() {
    return $gamePlayer.areFollowersGathered();
};

/* 是否陆地可下载具 */
Game_Vehicle.prototype.isLandOk = function(x, y, d) {
    if (this.isAirship()) {
        if (!$gameMap.isAirshipLandOk(x, y)) {
            return false;
        }
        if ($gameMap.eventsXy(x, y).length > 0) {
            return false;
        }
    } else {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
    }
    return true;
};

//-----------------------------------------------------------------------------
// 游戏_事件 
// Game_Event
//
// 事件的游戏对象类。它包含用于事件页切换和运行并行处理事件的功能。 
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

function Game_Event() {
    this.initialize.apply(this, arguments);
}

Game_Event.prototype = Object.create(Game_Character.prototype);
Game_Event.prototype.constructor = Game_Event;

/* 初始化 */
Game_Event.prototype.initialize = function(mapId, eventId) {
    Game_Character.prototype.initialize.call(this);
    this._mapId = mapId;
    this._eventId = eventId;
    this.locate(this.event().x, this.event().y);
    this.refresh();
};

/* 初始化成员 */
Game_Event.prototype.initMembers = function() {
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

/* 事件 ID */
Game_Event.prototype.eventId = function() {
    return this._eventId;
};

/* 事件 */
Game_Event.prototype.event = function() {
    return $dataMap.events[this._eventId];
};

/* 页 */
Game_Event.prototype.page = function() {
    return this.event().pages[this._pageIndex];
};

/* 列表 */
Game_Event.prototype.list = function() {
    return this.page().list;
};

/* 是否和人物（事件、载具和玩家）碰撞 */
Game_Event.prototype.isCollidedWithCharacters = function(x, y) {
    return (Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) ||
            this.isCollidedWithPlayerCharacters(x, y));
};

/* 是否和事件碰撞 */
Game_Event.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.length > 0;
};

/* 是否和玩家碰撞 */
Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
    return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
};

/* 锁定 */
Game_Event.prototype.lock = function() {
    if (!this._locked) {
        this._prelockDirection = this.direction();
        this.turnTowardPlayer();
        this._locked = true;
    }
};

/* 解锁 */
Game_Event.prototype.unlock = function() {
    if (this._locked) {
        this._locked = false;
        this.setDirection(this._prelockDirection);
    }
};

/* 更新停止 */
Game_Event.prototype.updateStop = function() {
    if (this._locked) {
        this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
        this.updateSelfMovement();
    }
};

/* 更新自身移动 */
Game_Event.prototype.updateSelfMovement = function() {
    if (!this._locked && this.isNearTheScreen() &&
            this.checkStop(this.stopCountThreshold())) {
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

/* 停止计数的阈值 */
Game_Event.prototype.stopCountThreshold = function() {
    return 30 * (5 - this.moveFrequency());
};

/* 移动类型随机 */
Game_Event.prototype.moveTypeRandom = function() {
    switch (Math.randomInt(6)) {
    case 0: case 1:
        this.moveRandom();
        break;
    case 2: case 3: case 4:
        this.moveForward();
        break;
    case 5:
        this.resetStopCount();
        break;
    }
};

/* 移动类型朝向玩家 */
Game_Event.prototype.moveTypeTowardPlayer = function() {
    if (this.isNearThePlayer()) {
        switch (Math.randomInt(6)) {
        case 0: case 1: case 2: case 3:
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

/* 是否在玩家附近 */
Game_Event.prototype.isNearThePlayer = function() {
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    return sx + sy < 20;
};

/* 移动类型自定义 */
Game_Event.prototype.moveTypeCustom = function() {
    this.updateRoutineMove();
};

/* 是否开始 */
Game_Event.prototype.isStarting = function() {
    return this._starting;
};

/* 清除开始标志 */
Game_Event.prototype.clearStartingFlag = function() {
    this._starting = false;
};

/* 是否触发条件在其中 */
Game_Event.prototype.isTriggerIn = function(triggers) {
    return triggers.contains(this._trigger);
};

/* 开始 */
Game_Event.prototype.start = function() {
    var list = this.list();
    if (list && list.length > 1) {
        this._starting = true;
        if (this.isTriggerIn([0,1,2])) {
            this.lock();
        }
    }
};

/* 消除 */
Game_Event.prototype.erase = function() {
    this._erased = true;
    this.refresh();
};

/* 刷新 */
Game_Event.prototype.refresh = function() {
    var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex) {
        this._pageIndex = newPageIndex;
        this.setupPage();
    }
};

/* 寻找适当的页面索引 */
Game_Event.prototype.findProperPageIndex = function() {
    var pages = this.event().pages;
    for (var i = pages.length - 1; i >= 0; i--) {
        var page = pages[i];
        if (this.meetsConditions(page)) {
            return i;
        }
    }
    return -1;
};

/* 是否满足条件 */
Game_Event.prototype.meetsConditions = function(page) {
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

/* 设置页面 */
Game_Event.prototype.setupPage = function() {
    if (this._pageIndex >= 0) {
        this.setupPageSettings();
    } else {
        this.clearPageSettings();
    }
    this.refreshBushDepth();
    this.clearStartingFlag();
    this.checkEventTriggerAuto();
};

/* 清除页面设置 */
Game_Event.prototype.clearPageSettings = function() {
    this.setImage('', 0);
    this._moveType = 0;
    this._trigger = null;
    this._interpreter = null;
    this.setThrough(true);
};

/* 设置页面设置 */
Game_Event.prototype.setupPageSettings = function() {
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

/* 是否起始图案 */
Game_Event.prototype.isOriginalPattern = function() {
    return this.pattern() === this._originalPattern;
};

/* 重置图案 */
Game_Event.prototype.resetPattern = function() {
    this.setPattern(this._originalPattern);
};

/* 检测接触的事件触发条件 */
Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
        if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
            if (!this.isJumping() && this.isNormalPriority()) {
                this.start();
            }
        }
    }
};

/* 检测自动执行的事件触发条件 */
Game_Event.prototype.checkEventTriggerAuto = function() {
    if (this._trigger === 3) {
        this.start();
    }
};

/* 更新 */
Game_Event.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();
};

/* 更新并行 */
Game_Event.prototype.updateParallel = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list(), this._eventId);
        }
        this._interpreter.update();
    }
};

/* 放置 */
Game_Event.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this._prelockDirection = 0;
};

/* 强制移动路线 */
Game_Event.prototype.forceMoveRoute = function(moveRoute) {
    Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
    this._prelockDirection = 0;
};

//-----------------------------------------------------------------------------
// 游戏_解释器 
// Game_Interpreter
//
// 运行事件指令的解释器。 
// The interpreter for running event commands.

function Game_Interpreter() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Interpreter.prototype.initialize = function(depth) {
    this._depth = depth || 0;
    this.checkOverflow();
    this.clear();
    this._branch = {};
    this._params = [];
    this._indent = 0;
    this._frameCount = 0;
    this._freezeChecker = 0;
};

/* 检测溢出 */
Game_Interpreter.prototype.checkOverflow = function() {
    if (this._depth >= 100) {
        throw new Error('Common event calls exceeded the limit');
    }
};

/* 清除 */
Game_Interpreter.prototype.clear = function() {
    this._mapId = 0;
    this._eventId = 0;
    this._list = null;
    this._index = 0;
    this._waitCount = 0;
    this._waitMode = '';
    this._comments = '';
    this._character = null;
    this._childInterpreter = null;
};

Game_Interpreter.prototype.setup = function(list, eventId) {
    this.clear();
    this._mapId = $gameMap.mapId();
    this._eventId = eventId || 0;
    this._list = list;
    Game_Interpreter.requestImages(list);
};

/* 事件 ID */
Game_Interpreter.prototype.eventId = function() {
    return this._eventId;
};

/* 是否在当前地图 */
Game_Interpreter.prototype.isOnCurrentMap = function() {
    return this._mapId === $gameMap.mapId();
};

/* 设置储存的公共事件 */
Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        this.setup($gameTemp.reservedCommonEvent().list);
        $gameTemp.clearCommonEvent();
        return true;
    } else {
        return false;
    }
};

/* 是否运行 */
Game_Interpreter.prototype.isRunning = function() {
    return !!this._list;
};

/* 更新 */
Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};

/* 更新子解释器 */
Game_Interpreter.prototype.updateChild = function() {
    if (this._childInterpreter) {
        this._childInterpreter.update();
        if (this._childInterpreter.isRunning()) {
            return true;
        } else {
            this._childInterpreter = null;
        }
    }
    return false;
};

/* 更新等待 */
Game_Interpreter.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

/* 更新等待计数 */
Game_Interpreter.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

/* 更新等待模式 */
Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false;
    switch (this._waitMode) {
    case 'message':
        waiting = $gameMessage.isBusy();
        break;
    case 'transfer':
        waiting = $gamePlayer.isTransferring();
        break;
    case 'scroll':
        waiting = $gameMap.isScrolling();
        break;
    case 'route':
        waiting = this._character.isMoveRouteForcing();
        break;
    case 'animation':
        waiting = this._character.isAnimationPlaying();
        break;
    case 'balloon':
        waiting = this._character.isBalloonPlaying();
        break;
    case 'gather':
        waiting = $gamePlayer.areFollowersGathering();
        break;
    case 'action':
        waiting = BattleManager.isActionForced();
        break;
    case 'video':
        waiting = Graphics.isVideoPlaying();
        break;
    case 'image':
        waiting = !ImageManager.isReady();
        break;
    }
    if (!waiting) {
        this._waitMode = '';
    }
    return waiting;
};

/* 设置等待模式 */
Game_Interpreter.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};

/* 等待 */
Game_Interpreter.prototype.wait = function(duration) {
    this._waitCount = duration;
};

/* 渐变速度 */
Game_Interpreter.prototype.fadeSpeed = function() {
    return 24;
};

/* 执行指令 */
Game_Interpreter.prototype.executeCommand = function() {
    var command = this.currentCommand();
    if (command) {
        this._params = command.parameters;
        this._indent = command.indent;
        var methodName = 'command' + command.code;
        if (typeof this[methodName] === 'function') {
            if (!this[methodName]()) {
                return false;
            }
        }
        this._index++;
    } else {
        this.terminate();
    }
    return true;
};

/* 检测冻结 */
Game_Interpreter.prototype.checkFreeze = function() {
    if (this._frameCount !== Graphics.frameCount) {
        this._frameCount = Graphics.frameCount;
        this._freezeChecker = 0;
    }
    if (this._freezeChecker++ >= 100000) {
        return true;
    } else {
        return false;
    }
};

/* 结束 */
Game_Interpreter.prototype.terminate = function() {
    this._list = null;
    this._comments = '';
};

/* 跳出分支 */
Game_Interpreter.prototype.skipBranch = function() {
    while (this._list[this._index + 1].indent > this._indent) {
        this._index++;
    }
};

/* 当前指令 */
Game_Interpreter.prototype.currentCommand = function() {
    return this._list[this._index];
};

/* 下一个事件码 */
Game_Interpreter.prototype.nextEventCode = function() {
    var command = this._list[this._index + 1];
    if (command) {
        return command.code;
    } else {
        return 0;
    }
};

/* 循环遍历角色 ID */
Game_Interpreter.prototype.iterateActorId = function(param, callback) {
    if (param === 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameActors.actor(param);
        if (actor) {
            callback(actor);
        }
    }
};
/* 循环遍历角色 ID 扩展*/
Game_Interpreter.prototype.iterateActorEx = function(param1, param2, callback) {
    if (param1 === 0) {
        this.iterateActorId(param2, callback);
    } else {
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};

/* 循环遍历角色索引 */
Game_Interpreter.prototype.iterateActorIndex = function(param, callback) {
    if (param < 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameParty.members()[param];
        if (actor) {
            callback(actor);
        }
    }
};

/* 循环遍历敌人索引 */
Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
    if (param < 0) {
        $gameTroop.members().forEach(callback);
    } else {
        var enemy = $gameTroop.members()[param];
        if (enemy) {
            callback(enemy);
        }
    }
};

/* 循环遍历战斗者 */
Game_Interpreter.prototype.iterateBattler = function(param1, param2, callback) {
    if ($gameParty.inBattle()) {
        if (param1 === 0) {
            this.iterateEnemyIndex(param2, callback);
        } else {
            this.iterateActorId(param2, callback);
        }
    }
};

/* 人物 */
Game_Interpreter.prototype.character = function(param) {
    if ($gameParty.inBattle()) {
        return null;
    } else if (param < 0) {
        return $gamePlayer;
    } else if (this.isOnCurrentMap()) {
        return $gameMap.event(param > 0 ? param : this._eventId);
    } else {
        return null;
    }
};

/* 操作值 
 * @param {Number} operation 操作（0：增加，1：减少）
 * @param {Number} operandType 操作数类型（0：常量，1：变量）
 * @param {Number} operand 操作数
 */
Game_Interpreter.prototype.operateValue = function(operation, operandType, operand) {
    var value = operandType === 0 ? operand : $gameVariables.value(operand);
    return operation === 0 ? value : -value;
};

/* 改变 HP */
Game_Interpreter.prototype.changeHp = function(target, value, allowDeath) {
    if (target.isAlive()) {
        if (!allowDeath && target.hp <= -value) {
            value = 1 - target.hp;
        }
        target.gainHp(value);
        if (target.isDead()) {
            target.performCollapse();
        }
    }
};

/* 显示文字 
 * @param {String} _params[0] 脸图名
 * @param {Number} _params[1] 脸图索引
 * @param {Number} _params[2] 背景（0：窗口，1：暗淡，2：透明）
 * @param {Number} _params[3] 窗口位置（0：顶部，1：中间，2：底部）
 */
// Show Text
Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // 文本数据（Text data） 
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
        case 102:  // 显示选项（Show Choices） 
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // 数值输入处理（Input Number） 
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // 物品选择处理（Select Item） 
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 显示选项 
 * @param {String} _params[0][n] 选项 
 * @param {Number} _params[1] 取消（-2：分支，-1：不允许，0：选项 #1，1：选项 #2，2：选项 #3，3：选项 #4，4：选项 #5，5：选项 #6） 
 * @param {Number} _params[2] 默认（-1：无，0：选项 #1，1：选项 #2，2：选项 #3，3：选项 #4，4：选项 #5，5：选项 #6）  
 * @param {Number} _params[3] 窗口位置（0：左侧，1：中间，2：右侧）
 * @param {Number} _params[4] 背景（0：窗口，1：暗淡，2：透明） 
 */
// Show Choices
Game_Interpreter.prototype.command102 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupChoices(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 设置选项 */
Game_Interpreter.prototype.setupChoices = function(params) {
    var choices = params[0].clone();
    var cancelType = params[1];
    var defaultType = params.length > 2 ? params[2] : 0;
    var positionType = params.length > 3 ? params[3] : 2;
    var background = params.length > 4 ? params[4] : 0;
    if (cancelType >= choices.length) {
        cancelType = -2;
    }
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(function(n) {
        this._branch[this._indent] = n;
    }.bind(this));
};

/* 显示选项-选择[**]时 
 * @param {Number} _params[0] 选项索引 
 * @param {String} _params[1] 选项文本 
 */
// When [**]
Game_Interpreter.prototype.command402 = function() {
    if (this._branch[this._indent] !== this._params[0]) {
        this.skipBranch();
    }
    return true;
};

/* 显示选项-当取消时 */
// When Cancel
Game_Interpreter.prototype.command403 = function() {
    if (this._branch[this._indent] >= 0) {
        this.skipBranch();
    }
    return true;
};

/* 数值输入处理 
 * @param {Number} _params[0] 变量 ID 
 * @param {Number} _params[1] 位数 
 */
// Input Number
Game_Interpreter.prototype.command103 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupNumInput(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 设置数值输入 */
Game_Interpreter.prototype.setupNumInput = function(params) {
    $gameMessage.setNumberInput(params[0], params[1]);
};

/* 物品选择处理 
 * @param {Number} _params[0] 变量 ID 
 * @param {Number} _params[1] 物品类型（1：普通物品，2：重要物品，3：隐藏物品 A，4：隐藏物品 B） 
 */
// Select Item
Game_Interpreter.prototype.command104 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupItemChoice(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 设置物品选项 */
Game_Interpreter.prototype.setupItemChoice = function(params) {
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

/* 显示滚动文字 
 * @param {Number} _params[0] 速度 
 * @param {Boolean} _params[1] 是否禁止快进 
 */
// Show Scrolling Text
Game_Interpreter.prototype.command105 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setScroll(this._params[0], this._params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 注释 
 * @param {String} _params[0] 注释文本 
 */
// Comment
Game_Interpreter.prototype.command108 = function() {
    this._comments = [this._params[0]];
    while (this.nextEventCode() === 408) {
        this._index++;
        this._comments.push(this.currentCommand().parameters[0]);
    }
    return true;
};

/* 分支条件 
 * @param {Number} _params[0] 条件类型 
 * @param {Any} _params[1] 参数（不同条件不一样） 
 * @param {Any} _params[2] 参数（不同条件不一样） 
 */
// Conditional Branch
Game_Interpreter.prototype.command111 = function() {
    var result = false;
    switch (this._params[0]) {
        case 0:  // 开关（Switch） 
            result = ($gameSwitches.value(this._params[1]) === (this._params[2] === 0));
            break;
        case 1:  // 变量（Variable） 
            var value1 = $gameVariables.value(this._params[1]);
            var value2;
            if (this._params[2] === 0) {
                value2 = this._params[3];
            } else {
                value2 = $gameVariables.value(this._params[3]);
            }
            switch (this._params[4]) {
                case 0:  // 等于（Equal to） 
                    result = (value1 === value2);
                    break;
                case 1:  // 大于或等于（Greater than or Equal to） 
                    result = (value1 >= value2);
                    break;
                case 2:  // 小于或等于（Less than or Equal to） 
                    result = (value1 <= value2);
                    break;
                case 3:  // 大于（Greater than） 
                    result = (value1 > value2);
                    break;
                case 4:  // 小于（Less than） 
                    result = (value1 < value2);
                    break;
                case 5:  // 不等于（Not Equal to） 
                    result = (value1 !== value2);
                    break;
            }
            break;
        case 2:  // 独立开关（Self Switch） 
            if (this._eventId > 0) {
                var key = [this._mapId, this._eventId, this._params[1]];
                result = ($gameSelfSwitches.value(key) === (this._params[2] === 0));
            }
            break;
        case 3:  // 计时器（Timer） 
            if ($gameTimer.isWorking()) {
                if (this._params[2] === 0) {
                    result = ($gameTimer.seconds() >= this._params[1]);
                } else {
                    result = ($gameTimer.seconds() <= this._params[1]);
                }
            }
            break;
        case 4:  // 角色（Actor） 
            var actor = $gameActors.actor(this._params[1]);
            if (actor) {
                var n = this._params[3];
                switch (this._params[2]) {
                    case 0:  // 在队伍中（In the Party） 
                        result = $gameParty.members().contains(actor);
                        break;
                    case 1:  // 名字（Name） 
                        result = (actor.name() === n);
                        break;
                    case 2:  // 职业（Class） 
                        result = actor.isClass($dataClasses[n]);
                        break;
                    case 3:  // 技能（Skill） 
                        result = actor.hasSkill(n);
                        break;
                    case 4:  // 武器（Weapon） 
                        result = actor.hasWeapon($dataWeapons[n]);
                        break;
                    case 5:  // 护甲（Armor） 
                        result = actor.hasArmor($dataArmors[n]);
                        break;
                    case 6:  // 状态（State） 
                        result = actor.isStateAffected(n);
                        break;
                }
            }
            break;
        case 5:  // 敌人（Enemy） 
            var enemy = $gameTroop.members()[this._params[1]];
            if (enemy) {
                switch (this._params[2]) {
                    case 0:  // 出现（Appeared） 
                        result = enemy.isAlive();
                        break;
                    case 1:  // 状态（State） 
                        result = enemy.isStateAffected(this._params[3]);
                        break;
                }
            }
            break;
        case 6:  // 人物（Character） 
            var character = this.character(this._params[1]);
            if (character) {
                result = (character.direction() === this._params[2]);
            }
            break;
        case 7:  // 金钱（Gold） 
            switch (this._params[2]) {
                case 0:  // 大于或等于（Greater than or equal to） 
                    result = ($gameParty.gold() >= this._params[1]);
                    break;
                case 1:  // 小于或等于（Less than or equal to） 
                    result = ($gameParty.gold() <= this._params[1]);
                    break;
                case 2:  // 小于（Less than） 
                    result = ($gameParty.gold() < this._params[1]);
                    break;
            }
            break;
        case 8:  // 物品（Item） 
            result = $gameParty.hasItem($dataItems[this._params[1]]);
            break;
        case 9:  // 武器（Weapon） 
            result = $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
            break;
        case 10:  // 护甲（Armor） 
            result = $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
            break;
        case 11:  // 按键（Button） 
            result = Input.isPressed(this._params[1]);
            break;
        case 12:  // 脚本（Script） 
            result = !!eval(this._params[1]);
            break;
        case 13:  // 载具（Vehicle） 
            result = ($gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]));
            break;
    }
    this._branch[this._indent] = result;
    if (this._branch[this._indent] === false) {
        this.skipBranch();
    }
    return true;
};

/* 否则 */
// Else
Game_Interpreter.prototype.command411 = function() {
    if (this._branch[this._indent] !== false) {
        this.skipBranch();
    }
    return true;
};

/* 循环 */
// Loop
Game_Interpreter.prototype.command112 = function() {
    return true;
};

/* 重复以上内容 */
// Repeat Above
Game_Interpreter.prototype.command413 = function() {
    do {
        this._index--;
    } while (this.currentCommand().indent !== this._indent);
    return true;
};

/* 跳出循环 */
// Break Loop
Game_Interpreter.prototype.command113 = function() {
    var depth = 0;
    while (this._index < this._list.length - 1) {
        this._index++;
        var command = this.currentCommand();

        if (command.code === 112)
            depth++;

        if (command.code === 413) {
            if (depth > 0)
                depth--;
            else
                break;
        }
    }
    return true;
};

/* 中止事件处理 */
// Exit Event Processing
Game_Interpreter.prototype.command115 = function() {
    this._index = this._list.length;
    return true;
};

/* 公共事件 
 * @param {Number} _params[0] 公共事件 ID  
 */
// Common Event
Game_Interpreter.prototype.command117 = function() {
    var commonEvent = $dataCommonEvents[this._params[0]];
    if (commonEvent) {
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
    }
    return true;
};

/* 设置子对象 */
Game_Interpreter.prototype.setupChild = function(list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
};

/* 标签 */
// Label
Game_Interpreter.prototype.command118 = function() {
    return true;
};

/* 转到标签 
 * @param {String} _params[0] 标签名称 
 */
// Jump to Label
Game_Interpreter.prototype.command119 = function() {
    var labelName = this._params[0];
    for (var i = 0; i < this._list.length; i++) {
        var command = this._list[i];
        if (command.code === 118 && command.parameters[0] === labelName) {
            this.jumpTo(i);
            return;
        }
    }
    return true;
};

/* 跳转到该索引 */
Game_Interpreter.prototype.jumpTo = function(index) {
    var lastIndex = this._index;
    var startIndex = Math.min(index, lastIndex);
    var endIndex = Math.max(index, lastIndex);
    var indent = this._indent;
    for (var i = startIndex; i <= endIndex; i++) {
        var newIndent = this._list[i].indent;
        if (newIndent !== indent) {
            this._branch[indent] = null;
            indent = newIndent;
        }
    }
    this._index = index;
};

/* 开关操作 
 * @param {Number} _params[0] 起始开关 ID 
 * @param {Number} _params[1] 结尾开关 ID 
 * @param {Number} _params[2] 操作（0：ON，1：OFF） 
 */
// Control Switches
Game_Interpreter.prototype.command121 = function() {
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        $gameSwitches.setValue(i, this._params[2] === 0);
    }
    return true;
};

/* 变量操作 
 * @param {Number} _params[0] 起始变量 ID 
 * @param {Number} _params[1] 结尾变量 ID 
 * @param {Number} _params[2] 操作（0：代入，1：加法，2：减法，3：乘法，4：除法，5：取模） 
 * @param {Number} _params[3] 操作数（0：常量，1：变量，2：随机，3：游戏数据，4：脚本） 
 * @param {Any} _params[4] 参数（不同操作数不一样） 
 * @param {Any} _params[5] 参数（不同操作数不一样） 
 * @param {Any} _params[6] 参数（不同操作数不一样） 
 */
// Control Variables
Game_Interpreter.prototype.command122 = function() {
    var value = 0;
    switch (this._params[3]) { // 操作符（Operand） 
        case 0: // 常量（Constant） 
            value = this._params[4];
            break;
        case 1: // 变量（Variable） 
            value = $gameVariables.value(this._params[4]);
            break;
        case 2: // 随机数（Random） 
            value = this._params[5] - this._params[4] + 1;
            for (var i = this._params[0]; i <= this._params[1]; i++) {
                this.operateVariable(i, this._params[2], this._params[4] + Math.randomInt(value));
            }
            return true;
            break;
        case 3: // 游戏数据（Game Data） 
            value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
            break;
        case 4: // 脚本（Script） 
            value = eval(this._params[4]);
            break;
    }
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        this.operateVariable(i, this._params[2], value);
    }
    return true;
};

/* 游戏数据操作 */
Game_Interpreter.prototype.gameDataOperand = function(type, param1, param2) {
    switch (type) {
    case 0:  // 物品（Item） 
        return $gameParty.numItems($dataItems[param1]);
    case 1:  // 武器（Weapon） 
        return $gameParty.numItems($dataWeapons[param1]);
    case 2:  // 护甲（Armor） 
        return $gameParty.numItems($dataArmors[param1]);
    case 3:  // 角色（Actor） 
        var actor = $gameActors.actor(param1);
        if (actor) {
            switch (param2) {
            case 0:  // 等级（Level） 
                return actor.level;
            case 1:  // 经验值（EXP） 
                return actor.currentExp();
            case 2:  // HP
                return actor.hp;
            case 3:  // MP
                return actor.mp;
            default:    // 能力值（Parameter） 
                if (param2 >= 4 && param2 <= 11) {
                    return actor.param(param2 - 4);
                }
            }
        }
        break;
    case 4:  // 敌人（Enemy） 
        var enemy = $gameTroop.members()[param1];
        if (enemy) {
            switch (param2) {
            case 0:  // HP
                return enemy.hp;
            case 1:  // MP
                return enemy.mp;
            default:    // 能力值（Parameter） 
                if (param2 >= 2 && param2 <= 9) {
                    return enemy.param(param2 - 2);
                }
            }
        }
        break;
    case 5:  // 人物（Character） 
        var character = this.character(param1);
        if (character) {
            switch (param2) {
            case 0:  // 地图 X（Map X） 
                return character.x;
            case 1:  // 地图 Y（Map Y） 
                return character.y;
            case 2:  // 方向（Direction） 
                return character.direction();
            case 3:  // 画面 X（Screen X） 
                return character.screenX();
            case 4:  // 画面 Y（Screen Y） 
                return character.screenY();
            }
        }
        break;
    case 6:  // 队伍（Party） 
        actor = $gameParty.members()[param1];
        return actor ? actor.actorId() : 0;
    case 7:  // 其他（Other） 
        switch (param1) {
        case 0:  // 地图 ID（Map ID） 
            return $gameMap.mapId();
        case 1:  // 队伍成员（Party Members） 
            return $gameParty.size();
        case 2:  // 金钱（Gold） 
            return $gameParty.gold();
        case 3:  // 步数（Steps） 
            return $gameParty.steps();
        case 4:  // 游戏时间（Play Time） 
            return $gameSystem.playtime();
        case 5:  // 计时器（Timer） 
            return $gameTimer.seconds();
        case 6:  // 保存次数（Save Count） 
            return $gameSystem.saveCount();
        case 7:  // 战斗次数（Battle Count） 
            return $gameSystem.battleCount();
        case 8:  // 胜利次数（Win Count） 
            return $gameSystem.winCount();
        case 9:  // 逃跑次数（Escape Count） 
            return $gameSystem.escapeCount();
        }
        break;
    }
    return 0;
};

/* 操作变量 */
Game_Interpreter.prototype.operateVariable = function(variableId, operationType, value) {
    try {
        var oldValue = $gameVariables.value(variableId);
        switch (operationType) {
        case 0:  // 代入（Set） 
            $gameVariables.setValue(variableId, oldValue = value);
            break;
        case 1:  // 加法（Add） 
            $gameVariables.setValue(variableId, oldValue + value);
            break;
        case 2:  // 减法（Sub） 
            $gameVariables.setValue(variableId, oldValue - value);
            break;
        case 3:  // 乘法（Mul） 
            $gameVariables.setValue(variableId, oldValue * value);
            break;
        case 4:  // 除法（Div） 
            $gameVariables.setValue(variableId, oldValue / value);
            break;
        case 5:  // 取模（Mod） 
            $gameVariables.setValue(variableId, oldValue % value);
            break;
        }
    } catch (e) {
        $gameVariables.setValue(variableId, 0);
    }
};

/* 独立开关操作 
 * @param {String} _params[0] 独立开关（A：独立开关 A，B：独立开关 B，C：独立开关 C，D：独立开关 D） 
 * @param {Number} _params[1] 操作（0：ON，1：OFF） 
 */
// Control Self Switch
Game_Interpreter.prototype.command123 = function() {
    if (this._eventId > 0) {
        var key = [this._mapId, this._eventId, this._params[0]];
        $gameSelfSwitches.setValue(key, this._params[1] === 0);
    }
    return true;
};

/* 计时器操作 
 * @param {Number} _params[0] 操作（0：开始，1：停止） 
 * @param {Number} _params[1] 时间（单位秒） 
 */
// Control Timer
Game_Interpreter.prototype.command124 = function() {
    if (this._params[0] === 0) {  // 开始（Start） 
        $gameTimer.start(this._params[1] * 60);
    } else {  // 停止（Stop） 
        $gameTimer.stop();
    }
    return true;
};

/* 增减金钱 
 * @param {Number} _params[0] 操作（0：增加，1：减少） 
 * @param {Number} _params[1] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[2] 操作数 
 */
// Change Gold
Game_Interpreter.prototype.command125 = function() {
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    $gameParty.gainGold(value);
    return true;
};

/* 增减物品 
 * @param {Number} _params[0] 物品 ID 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 */
// Change Items
Game_Interpreter.prototype.command126 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    return true;
};

/* 增减武器 
 * @param {Number} _params[0] 武器 ID 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 * @param {Boolean} _params[4] 是否包括装备 
 */
// Change Weapons
Game_Interpreter.prototype.command127 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
    return true;
};

/* 增减护甲
 * @param {Number} _params[0] 护甲 ID 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 * @param {Boolean} _params[4] 是否包括装备 
 */
// Change Armors
Game_Interpreter.prototype.command128 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
    return true;
};

/* 队伍管理 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 操作（0：入队，1：离队） 
 * @param {Boolean} _params[2] 是否初始化 
 */
// Change Party Member
Game_Interpreter.prototype.command129 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        if (this._params[1] === 0) {  // 入队（Add） 
            if (this._params[2]) {   // 初始化（Initialize） 
                $gameActors.actor(this._params[0]).setup(this._params[0]);
            }
            $gameParty.addActor(this._params[0]);
        } else {  // 离队（Remove） 
            $gameParty.removeActor(this._params[0]);
        }
    }
    return true;
};

/* 更改战斗 BGM 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Change Battle BGM
Game_Interpreter.prototype.command132 = function() {
    $gameSystem.setBattleBgm(this._params[0]);
    return true;
};

/* 更改胜利 ME 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Change Victory ME
Game_Interpreter.prototype.command133 = function() {
    $gameSystem.setVictoryMe(this._params[0]);
    return true;
};

/* 启动/禁用存档
 * @param {Number} _params[0] 存档（0：禁用，1：启用） 
 */
// Change Save Access
Game_Interpreter.prototype.command134 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableSave();
    } else {
        $gameSystem.enableSave();
    }
    return true;
};

/* 启动/禁用菜单 
 * @param {Number} _params[0] 菜单（0：禁用，1：启用） 
 */
// Change Menu Access
Game_Interpreter.prototype.command135 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableMenu();
    } else {
        $gameSystem.enableMenu();
    }
    return true;
};

/* 启动/禁用遇敌 
 * @param {Number} _params[0] 遇敌（0：禁用，1：启用） 
 */
// Change Encounter Disable
Game_Interpreter.prototype.command136 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableEncounter();
    } else {
        $gameSystem.enableEncounter();
    }
    $gamePlayer.makeEncounterCount();
    return true;
};

/* 启动/禁用整队
 * @param {Number} _params[0] 整队（0：禁用，1：启用） 
 */
// Change Formation Access
Game_Interpreter.prototype.command137 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableFormation();
    } else {
        $gameSystem.enableFormation();
    }
    return true;
};

/* 更改窗口颜色
 * @param {Number} _params[0][0] 红 
 * @param {Number} _params[0][1] 绿 
 * @param {Number} _params[0][2] 蓝 
 * @param {Number} _params[0][3] 不透明度 
 */
// Change Window Color
Game_Interpreter.prototype.command138 = function() {
    $gameSystem.setWindowTone(this._params[0]);
    return true;
};

/* 更改战败 ME 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Change Defeat ME
Game_Interpreter.prototype.command139 = function() {
    $gameSystem.setDefeatMe(this._params[0]);
    return true;
};

/* 更改载具 BGM 
 * @param {Number} _params[0] 载具（0：小舟，1：大船，2：飞艇） 
 * @param {String} _params[1].name 名称 
 * @param {Number} _params[1].volume 音量 
 * @param {Number} _params[1].pitch 音调 
 * @param {Number} _params[1].pan 声像 
 */
// Change Vehicle BGM
Game_Interpreter.prototype.command140 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setBgm(this._params[1]);
    }
    return true;
};

/* 场所移动 
 * @param {Number} _params[0] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[1] 地图 ID【直接指定】，或地图 ID 的变量 ID【变量指定】 
 * @param {Number} _params[2] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[3] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 * @param {Number} _params[4] 方向（0：不变，2：下，4：左，6：右，8：上） 
 * @param {Number} _params[5] 淡入淡出（0：黑，1：白，无：2） 
 */
// Transfer Player
Game_Interpreter.prototype.command201 = function() {
    if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
        var mapId, x, y;
        if (this._params[0] === 0) {  // 直接指定（Direct designation） 
            mapId = this._params[1];
            x = this._params[2];
            y = this._params[3];
        } else {  // 变量指定（Designation with variables） 
            mapId = $gameVariables.value(this._params[1]);
            x = $gameVariables.value(this._params[2]);
            y = $gameVariables.value(this._params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
        this.setWaitMode('transfer');
        this._index++;
    }
    return false;
};

/* 设置载具位置 
 * @param {Number} _params[0] 载具（0：小舟，1：大船，2：飞艇） 
 * @param {Number} _params[1] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[2] 地图 ID【直接指定】，或地图 ID 的变量 ID【变量指定】 
 * @param {Number} _params[3] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[4] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 */
// Set Vehicle Location
Game_Interpreter.prototype.command202 = function() {
    var mapId, x, y;
    if (this._params[1] === 0) {  // 直接指定（Direct designation） 
        mapId = this._params[2];
        x = this._params[3];
        y = this._params[4];
    } else {  // 变量指定（Designation with variables） 
        mapId = $gameVariables.value(this._params[2]);
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setLocation(mapId, x, y);
    }
    return true;
};

/* 设置事件位置 
 * @param {Number} _params[0] 人物（0：本事件，大于 0：其他事件）
 * @param {Number} _params[1] 指定方式（0：直接指定，1：变量指定，2：与其他事件交换） 
 * @param {Number} _params[2] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】，或事件 ID（0：本事件，大于 0：其他事件）【与其他事件交换】 
 * @param {Number} _params[3] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】
 * @param {Number} _params[4] 方向（0：不变，2：下，4：左，6：右，8：上） 
 */
// Set Event Location
Game_Interpreter.prototype.command203 = function() {
    var character = this.character(this._params[0]);
    if (character) {
        if (this._params[1] === 0) {  // 直接指定（Direct designation） 
            character.locate(this._params[2], this._params[3]);
        } else if (this._params[1] === 1) {  //变量指定（Designation with variables） 
            var x = $gameVariables.value(this._params[2]);
            var y = $gameVariables.value(this._params[3]);
            character.locate(x, y);
        } else {  // 与其他事件交换（Exchange with another event） 
            var character2 = this.character(this._params[2]);
            if (character2) {
                character.swap(character2);
            }
        }
        if (this._params[4] > 0) {
            character.setDirection(this._params[4]);
        }
    }
    return true;
};

/* 滚动地图 
 * @param {Number} _params[0] 方向（2：下，4：左，6：右，8：上） 
 * @param {Number} _params[1] 距离 
 * @param {Number} _params[2] 速度（1：1/8 倍速，2：1/4 倍速，3：1/2 倍速，4：标准速度，5：2 倍速，6：4 倍速） 
 */
// Scroll Map
Game_Interpreter.prototype.command204 = function() {
    if (!$gameParty.inBattle()) {
        if ($gameMap.isScrolling()) {
            this.setWaitMode('scroll');
            return false;
        }
        $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
    }
    return true;
};

/* 设置移动路线 
 * @param {Number} _params[0] 人物（小于 0：玩家，0：本事件，大于 0：其他事件） 
 * @param {Array} _params[1].list 移动路线 
 * @param {Boolean} _params[1].repeat 是否循环执行 
 * @param {Boolean} _params[1].skippable 是否无法移动时跳过指令 
 * @param {Boolean} _params[1].wait 是否等待完成 
 */
// Set Movement Route
Game_Interpreter.prototype.command205 = function() {
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    return true;
};

/* 载具乘降 */
// Getting On and Off Vehicles
Game_Interpreter.prototype.command206 = function() {
    $gamePlayer.getOnOffVehicle();
    return true;
};

/* 更改透明状态 
 * @param {Number} _params[0] 透明状态（0：ON，1：OFF） 
 */
// Change Transparency
Game_Interpreter.prototype.command211 = function() {
    $gamePlayer.setTransparent(this._params[0] === 0);
    return true;
};

/* 显示动画 
 * @param {Number} _params[0] 人物（小于 0：玩家，0：本事件，大于 0：其他事件） 
 * @param {Number} _params[1] 动画 ID 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Show Animation
Game_Interpreter.prototype.command212 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestAnimation(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('animation');
        }
    }
    return true;
};

/* 显示气泡图标
 * @param {Number} _params[0] 人物（小于 0：玩家，0：本事件，大于 0：其他事件） 
 * @param {Number} _params[1] 气泡图标 ID 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Show Balloon Icon
Game_Interpreter.prototype.command213 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestBalloon(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('balloon');
        }
    }
    return true;
};

/* 暂时消除事件 */
// Erase Event
Game_Interpreter.prototype.command214 = function() {
    if (this.isOnCurrentMap() && this._eventId > 0) {
        $gameMap.eraseEvent(this._eventId);
    }
    return true;
};

/* 更改队列行进 
 * @param {Number} _params[0] 队列步行（0：ON，1：OFF） 
 */
// Change Player Followers
Game_Interpreter.prototype.command216 = function() {
    if (this._params[0] === 0) {
        $gamePlayer.showFollowers();
    } else {
        $gamePlayer.hideFollowers();
    }
    $gamePlayer.refresh();
    return true;
};

/* 集合队列成员 */
// Gather Followers
Game_Interpreter.prototype.command217 = function() {
    if (!$gameParty.inBattle()) {
        $gamePlayer.gatherFollowers();
        this.setWaitMode('gather');
    }
    return true;
};

/* 淡出画面 */
// Fadeout Screen
Game_Interpreter.prototype.command221 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

/* 淡入画面 */
// Fadein Screen
Game_Interpreter.prototype.command222 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

/* 更改画面色调 
 * @param {Number} _params[0][0] 红 
 * @param {Number} _params[0][1] 绿 
 * @param {Number} _params[0][2] 蓝 
 * @param {Number} _params[0][3] 灰度 
 * @param {Number} _params[1] 持续时间（单位帧） 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Tint Screen
Game_Interpreter.prototype.command223 = function() {
    $gameScreen.startTint(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

/* 闪烁画面 
 * @param {Number} _params[0][0] 红 
 * @param {Number} _params[0][1] 绿 
 * @param {Number} _params[0][2] 蓝 
 * @param {Number} _params[0][3] 强度 
 * @param {Number} _params[1] 持续时间（单位帧） 
 * @param {Boolean} _params[2] 是否等待完成 
*/
// Flash Screen
Game_Interpreter.prototype.command224 = function() {
    $gameScreen.startFlash(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

/* 震动屏幕 
 * @param {Number} _params[0][0] 强度 
 * @param {Number} _params[0][1] 速度 
 * @param {Number} _params[1] 持续时间（单位帧） 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Shake Screen
Game_Interpreter.prototype.command225 = function() {
    $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

/* 等待 
 * @param {Number} _params[0] 持续时间（单位帧） 
 */
// Wait
Game_Interpreter.prototype.command230 = function() {
    this.wait(this._params[0]);
    return true;
};

/* 显示图片
 * @param {Number} _params[0] 编号 
 * @param {String} _params[1] 图像名称 
 * @param {Number} _params[2] 原点（0：左上，1：中心） 
 * @param {Number} _params[3] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[4] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[5] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 * @param {Number} _params[6] 宽缩放率（百分比） 
 * @param {Number} _params[7] 高缩放率（百分比） 
 * @param {Number} _params[8] 不透明度 
 * @param {Number} _params[9] 合成方式（0：正常，1：叠加，2：正片叠底，3：滤色） 
 */
// Show Picture
Game_Interpreter.prototype.command231 = function() {
    var x, y;
    if (this._params[3] === 0) {  // 直接指定（Direct designation） 
        x = this._params[4];
        y = this._params[5];
    } else {  // 变量指定（Designation with variables） 
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.showPicture(this._params[0], this._params[1], this._params[2],
        x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
    return true;
};

/* 移动图片 
 * @param {Number} _params[0] 编号 
 * @param {Number} _params[1] 0 
 * @param {Number} _params[2] 原点（0：左上，1：中心） 
 * @param {Number} _params[3] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[4] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[5] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 * @param {Number} _params[6] 宽缩放率（百分比） 
 * @param {Number} _params[7] 高缩放率（百分比） 
 * @param {Number} _params[8] 不透明度 
 * @param {Number} _params[9] 合成方式（0：正常，1：叠加，2：正片叠底，3：滤色） 
 * @param {Number} _params[10] 持续时间（单位帧） 
 * @param {Boolean} _params[11] 是否等待完成 
*/
// Move Picture
Game_Interpreter.prototype.command232 = function() {
    var x, y;
    if (this._params[3] === 0) {  // 直接指定（Direct designation） 
        x = this._params[4];
        y = this._params[5];
    } else {  // 变量指定（Designation with variables） 
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6],
        this._params[7], this._params[8], this._params[9], this._params[10]);
    if (this._params[11]) {
        this.wait(this._params[10]);
    }
    return true;
};

/* 旋转图片 
 * @param {Number} _params[0] 编号 
 * @param {Number} _params[1] 速度 
 */
// Rotate Picture
Game_Interpreter.prototype.command233 = function() {
    $gameScreen.rotatePicture(this._params[0], this._params[1]);
    return true;
};

/* 更改图片色调 
 * @param {Number} _params[0] 编号 
 * @param {Number} _params[1][0] 红 
 * @param {Number} _params[1][1] 绿 
 * @param {Number} _params[1][2] 蓝 
 * @param {Number} _params[1][3] 灰度 
 * @param {Number} _params[2] 持续时间（单位帧） 
 * @param {Boolean} _params[3] 是否等待完成 
 */
// Tint Picture
Game_Interpreter.prototype.command234 = function() {
    $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

/* 消除图片 
 * @param {Number} _params[0] 编号 
 */
// Erase Picture
Game_Interpreter.prototype.command235 = function() {
    $gameScreen.erasePicture(this._params[0]);
    return true;
};

/* 设置天气 
 * @param {String} _params[0] 类型（none：无，rain：雨，storm：风暴，snow：雪） 
 * @param {Number} _params[1] 强度 
 * @param {Number} _params[2] 持续时间（单位帧） 
 * @param {Boolean} _params[3] 是否等待完成 
 */
// Set Weather Effect
Game_Interpreter.prototype.command236 = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
    }
    return true;
};

/* 播放 BGM 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play BGM
Game_Interpreter.prototype.command241 = function() {
    AudioManager.playBgm(this._params[0]);
    return true;
};

/* 淡出 BGM 
 * @param {Number} _params[0] 持续时间（单位秒） 
 */
// Fadeout BGM
Game_Interpreter.prototype.command242 = function() {
    AudioManager.fadeOutBgm(this._params[0]);
    return true;
};

/* 保存 BGM */
// Save BGM
Game_Interpreter.prototype.command243 = function() {
    $gameSystem.saveBgm();
    return true;
};

/* 还原 BGM */
// Resume BGM
Game_Interpreter.prototype.command244 = function() {
    $gameSystem.replayBgm();
    return true;
};

/* 播放 BGS 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play BGS
Game_Interpreter.prototype.command245 = function() {
    AudioManager.playBgs(this._params[0]);
    return true;
};

/* 淡出 BGS 
 * @param {Number} _params[0] 持续时间（单位秒） 
 */
// Fadeout BGS
Game_Interpreter.prototype.command246 = function() {
    AudioManager.fadeOutBgs(this._params[0]);
    return true;
};

/* 播放 ME 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play ME
Game_Interpreter.prototype.command249 = function() {
    AudioManager.playMe(this._params[0]);
    return true;
};

/* 播放 SE 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play SE
Game_Interpreter.prototype.command250 = function() {
    AudioManager.playSe(this._params[0]);
    return true;
};

/* 停止 SE */
// Stop SE
Game_Interpreter.prototype.command251 = function() {
    AudioManager.stopSe();
    return true;
};

/* 播放影像 
 * @param {String} _params[0] 影像名称 
 */
// Play Movie
Game_Interpreter.prototype.command261 = function() {
    if (!$gameMessage.isBusy()) {
        var name = this._params[0];
        if (name.length > 0) {
            var ext = this.videoFileExt();
            Graphics.playVideo('movies/' + name + ext);
            this.setWaitMode('video');
        }
        this._index++;
    }
    return false;
};

/* 影像文件扩展名 */
Game_Interpreter.prototype.videoFileExt = function() {
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        return '.webm';
    } else {
        return '.mp4';
    }
};

/* 启动/禁用显示地图名称 
 * @param {Number} _params[0] 显示地图名称（0：ON，1：OFF） 
 */
// Change Map Name Display
Game_Interpreter.prototype.command281 = function() {
    if (this._params[0] === 0) {
        $gameMap.enableNameDisplay();
    } else {
        $gameMap.disableNameDisplay();
    }
    return true;
};

/* 更改地图图块 
 * @param {Number} _params[0] 图块 ID 
 */
// Change Tileset
Game_Interpreter.prototype.command282 = function() {
    var tileset = $dataTilesets[this._params[0]];
    if(!this._imageReservationId){
        this._imageReservationId = Utils.generateRuntimeId();
    }

    var allReady = tileset.tilesetNames.map(function(tilesetName) {
        return ImageManager.reserveTileset(tilesetName, 0, this._imageReservationId);
    }, this).every(function(bitmap) {return bitmap.isReady();});

    if (allReady) {
        $gameMap.changeTileset(this._params[0]);
        ImageManager.releaseReservation(this._imageReservationId);
        this._imageReservationId = null;

        return true;
    } else {
        return false;
    }
};

/* 更改战斗背景 
 * @param {String} _params[0] 图像 1 名称 
 * @param {String} _params[1] 图像 2 名称 
 */
// Change Battle Back
Game_Interpreter.prototype.command283 = function() {
    $gameMap.changeBattleback(this._params[0], this._params[1]);
    return true;
};

/* 更改远景 
 * @param {String} _params[0] 图像名称 
 * @param {Boolean} _params[1] 是否横向循环 
 * @param {Boolean} _params[2] 是否纵向循环 
 * @param {Number} _params[3] 横向滚动速度 
 * @param {Number} _params[4] 纵向滚动速度 
 */
// Change Parallax
Game_Interpreter.prototype.command284 = function() {
    $gameMap.changeParallax(this._params[0], this._params[1],
        this._params[2], this._params[3], this._params[4]);
    return true;
};

/* 获取指定位置的信息 
 * @param {Number} _params[0] 变量 ID 
 * @param {Number} _params[1] 信息类型（0：地形标志，1：事件 ID，2：图块 ID（第 1 层），3：图块 ID（第 2 层）4：图块 ID（第 3 层）5：图块 ID（第 4 层），6：区域 ID） 
 * @param {Number} _params[2] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[3] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[4] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 */
// Get Location Info
Game_Interpreter.prototype.command285 = function() {
    var x, y, value;
    if (this._params[2] === 0) {  // 直接指定（Direct designation） 
        x = this._params[3];
        y = this._params[4];
    } else {  // 变量指定（Designation with variables） 
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    switch (this._params[1]) {
    case 0:     // 地形标志（Terrain Tag） 
        value = $gameMap.terrainTag(x, y);
        break;
    case 1:     // 事件 ID（Event ID） 
        value = $gameMap.eventIdXy(x, y);
        break;
    case 2:     // 图块 ID（第 1 层）（Tile ID (Layer 1)） 
    case 3:     // 图块 ID（第 2 层）（Tile ID (Layer 2)） 
    case 4:     // 图块 ID（第 3 层）（Tile ID (Layer 3)） 
    case 5:     // 图块 ID（第 4 层）（Tile ID (Layer 4)） 
        value = $gameMap.tileId(x, y, this._params[1] - 2);
        break;
    default:    // 区域 ID （Region ID） 
        value = $gameMap.regionId(x, y);
        break;
    }
    $gameVariables.setValue(this._params[0], value);
    return true;
};

/* 战斗处理 
 * @param {Number} _params[0] 指定方式（0：直接指定，1：变量指定，3：与随机遇敌相同） 
 * @param {Number} _params[1] 敌群 ID【直接指定】，或敌群 ID 的变量 ID【变量指定】 
 * @param {Boolean} _params[2] 是否允许逃跑 
 * @param {Boolean} _params[3] 是否允许失败 
 */
// Battle Processing
Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        var troopId;
        if (this._params[0] === 0) {  // 直接指定（Direct designation） 
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // 变量指定（Designation with variables） 
            troopId = $gameVariables.value(this._params[1]);
        } else {  // 与随机遇敌相同（Same as Random Encounter） 
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            BattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        }
    }
    return true;
};

/* 战斗处理-胜利时（允许战败或逃跑时） */
// If Win
Game_Interpreter.prototype.command601 = function() {
    if (this._branch[this._indent] !== 0) {
        this.skipBranch();
    }
    return true;
};

/* 战斗处理-逃跑时（允许逃跑时） */
// If Escape
Game_Interpreter.prototype.command602 = function() {
    if (this._branch[this._indent] !== 1) {
        this.skipBranch();
    }
    return true;
};

/* 战斗处理-战败时（允许战败时） */
// If Lose
Game_Interpreter.prototype.command603 = function() {
    if (this._branch[this._indent] !== 2) {
        this.skipBranch();
    }
    return true;
};

/* 商店处理 
 * @param {Number} _params[0] 商品类型（0：物品，1：武器，2：护甲） 
 * @param {Number} _params[1] 物品 ID 
 * @param {Number} _params[2] 价格方式（0：标准，1：指定） 
 * @param {Number} _params[3] 价格 
 * @param {Number} _params[4] 是否只能购买 
 */
// Shop Processing
Game_Interpreter.prototype.command302 = function() {
    if (!$gameParty.inBattle()) {
        var goods = [this._params];
        while (this.nextEventCode() === 605) {
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, this._params[4]);
    }
    return true;
};

/* 名字输入处理 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 最大字符数 
 */
// Name Input Processing
Game_Interpreter.prototype.command303 = function() {
    if (!$gameParty.inBattle()) {
        if ($dataActors[this._params[0]]) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    return true;
};

/* 增减 HP 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】,或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 * @param {Boolean} _params[5] 是否允许导致无法战斗 
 */
// Change HP
Game_Interpreter.prototype.command311 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));
    return true;
};

/* 增减 MP 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】,或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 */
// Change MP
Game_Interpreter.prototype.command312 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainMp(value);
    }.bind(this));
    return true;
};

/* 增减 TP
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 */
// Change TP
Game_Interpreter.prototype.command326 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainTp(value);
    }.bind(this));
    return true;
};

/* 更改状态
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：附加，1：解除） 
 * @param {Number} _params[3] 状态 ID 
 */
// Change State
Game_Interpreter.prototype.command313 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        var alreadyDead = actor.isDead();
        if (this._params[2] === 0) {
            actor.addState(this._params[3]);
        } else {
            actor.removeState(this._params[3]);
        }
        if (actor.isDead() && !alreadyDead) {
            actor.performCollapse();
        }
        actor.clearResult();
    }.bind(this));
    return true;
};

/* 完全恢复 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 */
// Recover All
Game_Interpreter.prototype.command314 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.recoverAll();
    }.bind(this));
    return true;
};

/* 增减经验值 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 * @param {Boolean} _params[5] 是否显示升级信息 
 */
// Change EXP
Game_Interpreter.prototype.command315 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeExp(actor.currentExp() + value, this._params[5]);
    }.bind(this));
    return true;
};

/* 增减等级 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 * @param {Boolean} _params[5] 是否显示升级信息 
 */
// Change Level
Game_Interpreter.prototype.command316 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeLevel(actor.level + value, this._params[5]);
    }.bind(this));
    return true;
};

/* 增减能力值 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 能力值 ID
 * @param {Number} _params[3] 操作（0：增加，1：减少） 
 * @param {Number} _params[4] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[5] 操作数
 */
// Change Parameter
Game_Interpreter.prototype.command317 = function() {
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.addParam(this._params[2], value);
    }.bind(this));
    return true;
};

/* 增减技能 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：学习，1：遗忘） 
 * @param {Number} _params[3] 技能 ID 
 */
// Change Skill
Game_Interpreter.prototype.command318 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        if (this._params[2] === 0) {
            actor.learnSkill(this._params[3]);
        } else {
            actor.forgetSkill(this._params[3]);
        }
    }.bind(this));
    return true;
};

/* 更改装备 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 装备类型 ID 
 * @param {Number} _params[2] 装备物品 ID 
 */
// Change Equipment
Game_Interpreter.prototype.command319 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.changeEquipById(this._params[1], this._params[2]);
    }
    return true;
};

/* 更改名字
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 名字 
 */
// Change Name
Game_Interpreter.prototype.command320 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setName(this._params[1]);
    }
    return true;
};

/* 更改职业 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 职业 ID 
 * @param {Boolean} _params[2] 是否保存等级 
 */
// Change Class
Game_Interpreter.prototype.command321 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor && $dataClasses[this._params[1]]) {
        actor.changeClass(this._params[1], this._params[2]);
    }
    return true;
};

/* 更改角色图像 
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 行走图名称 
 * @param {Number} _params[2] 行走图索引 
 * @param {String} _params[3] 脸图名称 
 * @param {Number} _params[4] 脸图索引 
 * @param {String} _params[5] 战斗图名称 
 */
// Change Actor Images
Game_Interpreter.prototype.command322 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setCharacterImage(this._params[1], this._params[2]);
        actor.setFaceImage(this._params[3], this._params[4]);
        actor.setBattlerImage(this._params[5]);
    }
    $gamePlayer.refresh();
    return true;
};

/* 更改载具图像 
 * @param {Number} _params[0] 载具（0：小舟，1：大船，2：飞艇） 
 * @param {String} _params[1] 图像名称 
 */
// Change Vehicle Image
Game_Interpreter.prototype.command323 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setImage(this._params[1], this._params[2]);
    }
    return true;
};

/* 更改昵称
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 昵称 
 */
// Change Nickname
Game_Interpreter.prototype.command324 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setNickname(this._params[1]);
    }
    return true;
};

/* 更改简介 
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 简介 
 */
// Change Profile
Game_Interpreter.prototype.command325 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setProfile(this._params[1]);
    }
    return true;
};

/* 增减敌人 HP 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 * @param {Boolean} _params[4] 是否允许导致无法战斗 
 */
// Change Enemy HP
Game_Interpreter.prototype.command331 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        this.changeHp(enemy, value, this._params[4]);
    }.bind(this));
    return true;
};

/* 增减敌人 MP 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 */
// Change Enemy MP
Game_Interpreter.prototype.command332 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainMp(value);
    }.bind(this));
    return true;
};

/* 增减敌人 TP 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 */
// Change Enemy TP
Game_Interpreter.prototype.command342 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainTp(value);
    }.bind(this));
    return true;
};

/* 更改敌人状态 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：附加，1：解除） 
 * @param {Number} _params[2] 状态 ID 
 */
// Change Enemy State
Game_Interpreter.prototype.command333 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        var alreadyDead = enemy.isDead();
        if (this._params[1] === 0) {
            enemy.addState(this._params[2]);
        } else {
            enemy.removeState(this._params[2]);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
    return true;
};

/* 敌人完全恢复 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 */
// Enemy Recover All
Game_Interpreter.prototype.command334 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.recoverAll();
    }.bind(this));
    return true;
};

/* 敌人出现 
 * @param {Number} _params[0] 敌人索引 
 */
// Enemy Appear
Game_Interpreter.prototype.command335 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.appear();
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

/* 敌人变身 
 * @param {Number} _params[0] 敌人索引 
 * @param {Number} _params[0] 敌群 ID 
 */
// Enemy Transform
Game_Interpreter.prototype.command336 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.transform(this._params[1]);
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

/* 显示战斗动画 
 * @param {Number} _params[0] 敌人索引 
 * @param {Number} _params[1] 动画 ID 
 * @param {Boolean} _params[2] 是否以敌方全体为目标 
 */
// Show Battle Animation
Game_Interpreter.prototype.command337 = function() {
    if (this._params[2] == true) {
        this.iterateEnemyIndex(-1,function(enemy) {
            if (enemy.isAlive()) {
                enemy.startAnimation(this._params[1],false,0);
            }
        }.bind(this));
    } else {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            if (enemy.isAlive()) {
                enemy.startAnimation(this._params[1], false, 0);
            }
        }.bind(this));
    }
    return true;
};

/* 强制战斗行动 
 * @param {Number} _params[0] 行动主体类型（0：敌人，1：角色） 
 * @param {Number} _params[1] 敌人索引【敌人】，或角色 ID【角色】 
 * @param {Number} _params[2] 技能 ID 
 * @param {Number} _params[3] 目标（-2：上一个目标，-1：随机，0：索引 1，1：索引 2，2：索引 3，3：索引 4，4：索引 5，5：索引 6，6：索引 7，7：索引 8） 
 */
// Force Action
Game_Interpreter.prototype.command339 = function() {
    this.iterateBattler(this._params[0], this._params[1], function(battler) {
        if (!battler.isDeathStateAffected()) {
            battler.forceAction(this._params[2], this._params[3]);
            BattleManager.forceAction(battler);
            this.setWaitMode('action');
        }
    }.bind(this));
    return true;
};

/* 中断战斗 */
// Abort Battle
Game_Interpreter.prototype.command340 = function() {
    BattleManager.abort();
    return true;
};

/* 打开菜单画面 */
// Open Menu Screen
Game_Interpreter.prototype.command351 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
    }
    return true;
};

/* 打开存档画面 */
// Open Save Screen
Game_Interpreter.prototype.command352 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
    return true;
};

/* 游戏结束 */
// Game Over
Game_Interpreter.prototype.command353 = function() {
    SceneManager.goto(Scene_Gameover);
    return true;
};

/* 返回标题画面 */
// Return to Title Screen
Game_Interpreter.prototype.command354 = function() {
    SceneManager.goto(Scene_Title);
    return true;
};

/* 脚本 */
// Script
Game_Interpreter.prototype.command355 = function() {
    var script = this.currentCommand().parameters[0] + '\n';
    while (this.nextEventCode() === 655) {
        this._index++;
        script += this.currentCommand().parameters[0] + '\n';
    }
    eval(script);
    return true;
};

/* 插件指令 
 * @param {String} _params[0] 插件指令 
 */
// Plugin Command
Game_Interpreter.prototype.command356 = function() {
    var args = this._params[0].split(" ");
    var command = args.shift();
    this.pluginCommand(command, args);
    return true;
};

/* 插件指令 
 * 插件通过重写该方法来实现插件指令的功能。
 */
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // 被插件重写 
    // to be overridden by plugins
};

/* 请求图像 */
Game_Interpreter.requestImages = function(list, commonList){
    if(!list) return;

    list.forEach(function(command){
        var params = command.parameters;
        switch(command.code){
            // 显示文字（Show Text）
            case 101:
                ImageManager.requestFace(params[0]);
                break;

            // 公共事件（Common Event）
            case 117:
                var commonEvent = $dataCommonEvents[params[0]];
                if (commonEvent) {
                    if (!commonList) {
                        commonList = [];
                    }
                    if (!commonList.contains(params[0])) {
                        commonList.push(params[0]);
                        Game_Interpreter.requestImages(commonEvent.list, commonList);
                    }
                }
                break;

            // 队伍管理（Change Party Member）
            case 129:
                var actor = $gameActors.actor(params[0]);
                if (actor && params[1] === 0) {
                    var name = actor.characterName();
                    ImageManager.requestCharacter(name);
                }
                break;

            // 设置移动路线（Set Movement Route）
            case 205:
                if(params[1]){
                    params[1].list.forEach(function(command){
                        var params = command.parameters;
                        if(command.code === Game_Character.ROUTE_CHANGE_IMAGE){
                            ImageManager.requestCharacter(params[0]);
                        }
                    });
                }
                break;

            // 显示动画，显示战斗动画（Show Animation, Show Battle Animation）
            case 212: case 337:
                if(params[1]) {
                    var animation = $dataAnimations[params[1]];
                    var name1 = animation.animation1Name;
                    var name2 = animation.animation2Name;
                    var hue1 = animation.animation1Hue;
                    var hue2 = animation.animation2Hue;
                    ImageManager.requestAnimation(name1, hue1);
                    ImageManager.requestAnimation(name2, hue2);
                }
                break;

            // 更改队列行进（Change Player Followers）
            case 216:
                if (params[0] === 0) {
                    $gamePlayer.followers().forEach(function(follower) {
                        var name = follower.characterName();
                        ImageManager.requestCharacter(name);
                    });
                }
                break;

            // 显示图片（Show Picture）
            case 231:
                ImageManager.requestPicture(params[1]);
                break;

            // 更改地图图块（Change Tileset）
            case 282:
                var tileset = $dataTilesets[params[0]];
                tileset.tilesetNames.forEach(function(tilesetName){
                    ImageManager.requestTileset(tilesetName);
                });
                break;

            // 更改战斗背景（Change Battle Back）
            case 283:
                if ($gameParty.inBattle()) {
                    ImageManager.requestBattleback1(params[0]);
                    ImageManager.requestBattleback2(params[1]);
                }
                break;

            // 更改远景（Change Parallax）
            case 284:
                if (!$gameParty.inBattle()) {
                    ImageManager.requestParallax(params[0]);
                }
                break;

            // 更改角色图像（Change Actor Images）
            case 322:
                ImageManager.requestCharacter(params[1]);
                ImageManager.requestFace(params[3]);
                ImageManager.requestSvActor(params[5]);
                break;

            // 更改载具图像（Change Vehicle Image）
            case 323:
                var vehicle = $gameMap.vehicle(params[0]);
                if(vehicle){
                    ImageManager.requestCharacter(params[1]);
                }
                break;

            // 敌人变身（Enemy Transform）
            case 336:
                var enemy = $dataEnemies[params[1]];
                var name = enemy.battlerName;
                var hue = enemy.battlerHue;
                if ($gameSystem.isSideView()) {
                    ImageManager.requestSvEnemy(name, hue);
                } else {
                    ImageManager.requestEnemy(name, hue);
                }
                break;
        }
    });
};