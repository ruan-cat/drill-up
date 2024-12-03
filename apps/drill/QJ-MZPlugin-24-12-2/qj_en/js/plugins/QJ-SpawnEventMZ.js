//=============================================================================
//
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc [Spawn Event][v2.0]
 * @author Qiu Jiu
 *
 * @param preLoad
 * @type number[]
 * @text preLoad map
 * @desc preLoad map id list
 * @default []
 *
 * @param eventSaveData
 * @type text[]
 * @text event save data
 * @desc the data of event needed to save.example:  _x  _y  _direction
 * @default ["_x","_y","_direction"]
 *
 * @help QJ-SpawnEventMZ.js
 * ========================================================
 * The plugin can spawn event from one map to current map and save spawn evnet data.
 * **********You need to write the number of the map that stores the copy event in the plugin parameters 'preLoad map'.**********
 * ========================================================
 * 1.spawn event from another map to the specific position of the current map:
 *
 *   QJ.SE.spawnXy(origin map id,origin event id,current map x,current map y[,save or not]);
 *
 *   origin map id：the id of map that stores the copy event.
 *   origin event id:the id of event to spawn in the origin map.
 *                 you can write the array of ids or range of ids to spawn a random evnet on origin map.
 *                 "1-7" mean 1 2 3 4 5 6 7。
 *                 e.g:    [1,2,3,"4-9",13,15]
 *                 then the event can be 1, 2, 3, 4, 5, 6, 7, 8, 9, 13 or 15 randomly.
 *   current map x:current map target x.   -1 -> current event`s x    -2 -> player`s x
 *   current map y:current map target y.   -1 -> current event`s y    -2 -> player`s y
 *   save or not:save the copied event data or not.the default is false.
 *               you can set the data that you want to save in the plugin parameters 'event save data'.
 *
 *   e.g:
 *      QJ.SE.spawnXy(10,2,7,9);
 *      QJ.SE.spawnXy(7,3,-1,-1);
 *      QJ.SE.spawnXy(4,1,-2,-2);
 *      QJ.SE.spawnXy(12,[1,2,3,"4-9","10-16"],-2,-2);
 *      QJ.SE.spawnXy(15,9,10,17,true);
 * ========================================================
 * 2.spawn event from another map to the specific region of the current map:
 *
 *   QJ.SE.spawnRegion(origin map id,origin event id,region id,probability[,save or not]);
 *
 *   region id: the id of region or the array of region.
 *             e.g:   1   3    [1,2,3,4,5]
 *   probability: the probability(0-1) to spawn on specific position.
 *               the default is 1 (100%)。
 *
 *   e.g:
 *     QJ.SE.spawnRegion(10,3,1,0.5);
 *     QJ.SE.spawnRegion(7,5,3,0.5);
 *     QJ.SE.spawnRegion(9,7,[7,10],0.5);
 *     QJ.SE.spawnRegion(2,9,[1,"4-7"],0.8);
 *     QJ.SE.spawnRegion(13,12,7,0.2);
 *     QJ.SE.spawnRegion(24,3,[2,5],1);
 *     QJ.SE.spawnRegion(19,[1,2,3,"4-9","10-16"],[2,5],1);
 *     QJ.SE.spawnRegion(19,[1,2,3],1,1,true);
 *
 * ========================================================
 * 3.clear the spawn event.
 *
 *   QJ.SE.clearEvent(id);
 *
 *   if you clear the event that need to save data, it will no longer to save data.
 *   id: event id.   -1 -> current event
 * ========================================================
 * 4.clear all event(includes the save event) on the map.
 *
 *   QJ.SE.clearAll(map id);
 *
 *   use QJ.SE.clearAll(-1);  or  QJ.SE.clearAll();  to clear the spawn event on current map.
 *
 * ========================================================
 * 5.get the last spawn event id:
 *
 *   QJ.SE.getLastSpawnEventId();
 *
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 * 
 */
/*:zh
 * @target MV MZ
 * @plugindesc [复制事件脚本][v2.0]
 * @author 仇九
 *
 * @param preLoad
 * @type number[]
 * @text 预载地图编号列表
 * @desc 预载地图编号列表
 * @default []
 *
 * @param eventSaveData
 * @type text[]
 * @text 储存事件信息
 * @desc 储存复制事件时需要储存的信息.
 * @default ["_x","_y","_direction"]
 *
 * @help QJ-SpawnEventMZ.js
 * ========================================================
 * 这个事件可以将某个事件从指定的地图中复制过来。
 * **********您需要在插件参数的“预载地图编号列表”中写上储存着复制事件的地图的编号。**********
 * ========================================================
 * 1.从某个地图将某个事件复制到当前地图的某个坐标上，只复制一个事件
 *
 *   QJ.SE.spawnXy(origin map id,origin event id,current map x,current map y[,save or not]);
 *
 *   origin map id：储存需要复制的事件的源地图编号
 *   origin event id:在源地图中要复制的事件的编号
 *                 你可以通过写编号或者范围来从目标地图将随机的事件复制过来。
 *                 "1-7" 就是一个范围，意味着 1 2 3 4 5 6 7 这些事件。
 *                 例如:    [1,2,3,"4-9",13,15]
 *                 那么源地图中的事件 1, 2, 3, 4, 5, 6, 7, 8, 9, 13 or 15 将会被随机选一个来复制到当前地图。
 *   current map x:目标x坐标.   -1 -> 当前地图的x坐标    -2 -> 玩家的x坐标
 *   current map y:目标y坐标.   -1 -> 当前地图的y坐标    -2 -> 玩家的y坐标
 *   save or not:是否储存此复制事件。您可以在插件参数“储存事件信息”中设置要储存的信息。
 *
 *   e.g:
 *      QJ.SE.spawnXy(10,2,7,9);
 *      QJ.SE.spawnXy(7,3,-1,-1);
 *      QJ.SE.spawnXy(4,1,-2,-2);
 *      QJ.SE.spawnXy(12,[1,2,3,"4-9","10-16"],-2,-2);
 *      QJ.SE.spawnXy(15,9,10,17,true);
 * ========================================================
 * 2.从某个地图将某个事件复制到当前地图的某个区域中，复制多个事件
 *
 *   QJ.SE.spawnRegion(origin map id,origin event id,region id,probability[,save or not]);
 *
 *   region id: 区域编号或者区域编号数组
 *             e.g:   1   3    [1,2,3,4,5]
 *   probability: 在目标区域的某个地方复制事件的概率。
 *
 *   e.g:
 *     QJ.SE.spawnRegion(10,3,1,0.5);
 *     QJ.SE.spawnRegion(7,5,3,0.5);
 *     QJ.SE.spawnRegion(9,7,[7,10],0.5);
 *     QJ.SE.spawnRegion(2,9,[1,"4-7"],0.8);
 *     QJ.SE.spawnRegion(13,12,7,0.2);
 *     QJ.SE.spawnRegion(24,3,[2,5],1);
 *     QJ.SE.spawnRegion(19,[1,2,3,"4-9","10-16"],[2,5],1);
 *     QJ.SE.spawnRegion(19,[1,2,3],1,1,true);
 *
 * ========================================================
 * 3.清除复制事件
 *
 *   QJ.SE.clearEvent(id);
 *
 *   若您使用此指令清除了需要保存信息的事件，那么系统将不再保存其信息。
 *   id: event id.   -1 -> 当前事件的编号
 * ========================================================
 * 4.清除某个地图上的所有复制事件
 *
 *   QJ.SE.clearAll(map id);
 *
 *   使用 QJ.SE.clearAll(-1);  或者  QJ.SE.clearAll();  来清除当前地图上的所有事件.
 *
 * ========================================================
 * 5.获取上一次复制的事件的事件id:
 *
 *   QJ.SE.getLastSpawnEventId();
 *
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 * 
 */
//=============================================================================
//
//=============================================================================
var QJ = QJ || {};
QJ.SE = QJ.SE || {};
var Imported = Imported || {};
Imported.QJSpawnEvent = true;
//=============================================================================
//
//=============================================================================
$dataSpawnMapList = {};
//=============================================================================
//
//=============================================================================
function Game_SpawnEvent() {
    this.initialize.apply(this, arguments);
}
//=============================================================================
//
//=============================================================================
(($ = {})=>{
//=============================================================================
//
//=============================================================================
const pluginName = "QJ-SpawnEventMZ";
const parameters = PluginManager.parameters(pluginName);
const preLoad = eval(parameters["preLoad"]);
const saveData = eval(parameters["eventSaveData"]);
let isMZ = Utils.RPGMAKER_NAME=='MZ';
//=============================================================================
//
//=============================================================================
if (!Imported.QJCore) {
QJ.getPointer = function() {
    return QJ.Pointer?((typeof QJ.Pointer == "number")?QJ.getCharacter(QJ.Pointer):
        (QJ.Pointer.eventId?$gameMap.event(QJ.Pointer.eventId()):QJ.Pointer)):null;
};
QJ.getPointerId = function() {
    return (typeof QJ.Pointer == "number")?$gameMap.event(QJ.Pointer).eventId():$gameMap.event(QJ.Pointer.eventId()).eventId();
};
QJ.getCharacter = function(value) {
    return value==0?QJ.getPointer():(value==-1?$gamePlayer:$gameMap.event(value));
};
QJ.buildCharacter = function(target) {
    return target?(target==$gamePlayer?-1:target.eventId()):0;
};
QJ.calculateRangeAndInt = function(list) {
    let standardList = [],detail;
    for (let i of list) {
        if (typeof i == "number") {
            standardList.push(i);
        } else if (typeof i == "string") {
            detail = i.split('-');
            for (let j=Number(detail[0]),jl=Number(detail[1]);j<=jl;j++) {
                standardList.push(j);
            }
        }
    }
    return standardList;
}
$.Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
Game_Interpreter.prototype.executeCommand = function() {
    QJ.Pointer=this;
    return $.Game_Interpreter_executeCommand.apply(this,arguments);
};
}
//=============================================================================
//
//=============================================================================
$.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!$.DataManager_isDatabaseLoaded.call(this)) return false;
    //==================================
    for (let i of preLoad) DataManager.loadSpawnMapData(i);
    //==================================
    return true;
};
DataManager.loadSpawnMapData = function(mapId) {
    if (mapId<=0) return null;
    let src = 'Map%1.json'.format(mapId.padZero(3));
    let xhr = new XMLHttpRequest();
    let url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = ()=>{
        if (xhr.status < 400) {
            $dataSpawnMapList[mapId] = JSON.parse(xhr.responseText);
            if (isMZ) {
                DataManager.extractMetadata($dataSpawnMapList[mapId]);
                DataManager.extractArrayMetadata($dataSpawnMapList[mapId].events);
            } else {
                DataManager.onLoad($dataSpawnMapList[mapId]);
            }
        }
    };
    xhr.send();
};
//=============================================================================
//
//=============================================================================
QJ.SE.spawnXy = function(mapId,eventId,x,y,save = false) {
	if (!$dataSpawnMapList[mapId]) return;
	if (typeof eventId == "number") eventId = [eventId];
	else eventId = QJ.calculateRangeAndInt(eventId);
	if (eventId.length == 1) eventId = eventId[0];
	else eventId = eventId[Math.floor(Math.random()*eventId.length)];
	if (!$dataSpawnMapList[mapId].events[eventId]) return;
	let currentEvent = QJ.getPointer();
	if (x==-1) x = currentEvent.x;
	else if (x==-2) x = $gamePlayer.x;
	if (x<0||x>=$gameMap.width()) return;
	if (y==-1) y = currentEvent.y;
	else if (y==-2) x = $gamePlayer.y;
	if (y<0||y>=$gameMap.height()) return;
	$gameMap.spawnEventQJ(mapId,eventId,x,y,save);
}
QJ.SE.spawnRegion = function(mapId,eventId,regionId,probability = 1,save = false) {
	if (!$dataSpawnMapList[mapId]) return;
	if (typeof eventId == "number") eventId = [eventId];
	else eventId = QJ.calculateRangeAndInt(eventId);
	if (typeof regionId == "number") regionId = [regionId];
	else regionId = QJ.calculateRangeAndInt(regionId);
	let eId;
	for (let i=0,il=$gameMap.width();i<il;i++) {
		for (let j=0,jl=$gameMap.height();j<jl;j++) {
			if (regionId.includes($gameMap.regionId(i,j))) {
				if (eventId.length == 1) eId = eventId[0];
				else eId = eventId[Math.floor(Math.random()*eventId.length)];
				if (!$dataSpawnMapList[mapId].events[eId]) continue;
				QJ.SE.spawnXy(mapId,eId,i,j,save);
			}
		}
	}
}
QJ.SE.clearEvent = function(eventId = -1) {
	if (eventId==-1) eventId = QJ.getPointerId();
	if (eventId<=0) return;
	$gameMap.clearSpawnEventQJ(eventId);
}
QJ.SE.clearAll = function(mapId = -1) {
	if (mapId==-1) mapId = $gameMap.mapId();
	if (typeof mapId == "number") mapId = [mapId];
	$gameSystem.deleteSaveDataSpawnEventMapQJ(mapId);
	if (mapId==$gameMap.mapId()) $gameMap.clearMapQJ(mapId);
}
QJ.SE.getLastSpawnEventId = function() {
	return $gameMap.lastestSpawnEventIdQJ();
}
//=============================================================================
//
//=============================================================================
Game_SelfSwitches.prototype.clearMapSelfSwitchesQJ = function(mapIdList) {
    let mapIdString,splitData;
    for (let i of mapIdList) {
        mapIdString = String(i);
        for (let j in this._data) {
            splitData = j.split(',');
            if (splitData&&splitData[0]==mapIdString) {
                delete this._data[j];
            }
        }
    }
};
Game_SelfSwitches.prototype.clearEventSelfSwitchesQJ = function(mapId,eventId) {
    mapId = String(mapId);
    eventId = String(eventId);
    let splitData;
    for (let j in this._data) {
        splitData = j.split(',');
        if (splitData&&splitData[0]==mapId&&splitData[1]==eventId) {
            delete this._data[j];
            return;
        }
    }
};
//=============================================================================
//
//=============================================================================
$.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
	$.Game_System_initialize.apply(this,arguments);
	this.initSpawnEventSaveDataListQJ();
};
Game_System.prototype.initSpawnEventSaveDataListQJ = function() {
	this._spawnEventSaveDataListQJ = {};
};
Game_System.prototype.initNewSaveDataSpawnEventMapQJ = function(mapId) {
	if (!this._spawnEventSaveDataListQJ[mapId]) this._spawnEventSaveDataListQJ[mapId] = [];
};
Game_System.prototype.addSpawnEventSaveDataQJ = function(data,mapId) {
	mapId = mapId||$gameMap.mapId();
	this._spawnEventSaveDataListQJ[mapId].push(data);
};
Game_System.prototype.getSaveDataSpawnEventMapQJ = function(mapId) {
	mapId = mapId||$gameMap.mapId();
	return this._spawnEventSaveDataListQJ[mapId];
};
Game_System.prototype.deleteSaveDataSpawnEventMapQJ = function(mapIdList) {
	for (let i of mapIdList) {
		delete this._spawnEventSaveDataListQJ[i];
	}
};
//=============================================================================
//
//=============================================================================
$.Game_Player_performTransfer = Game_Player.prototype.performTransfer;
Game_Player.prototype.performTransfer = function() {
    $gameMap.saveSpawnEventDataQJ();
    $.Game_Player_performTransfer.apply(this,arguments);
};
Game_Map.prototype.saveSpawnEventDataQJ = function() {
	$gameSystem.initNewSaveDataSpawnEventMapQJ();
	for (let i of this._events) {
		if (i&&i.constructor==Game_SpawnEvent) {
			if (i.needSaveData()) {//若储存就不删除数据且储存信息
				$gameSystem.addSpawnEventSaveDataQJ(i.makeSaveData());
			} else {//若不储存就删除所有数据
				$gameSelfSwitches.clearEventSelfSwitchesQJ(this.mapId(),i.eventId());
			}
		}
	}
};
$.Game_Map_setupEvents = Game_Map.prototype.setupEvents;
Game_Map.prototype.setupEvents = function() {
	$.Game_Map_setupEvents.apply(this,arguments);
	this.executeSpawnEventDataQJ();
};
Game_Map.prototype.executeSpawnEventDataQJ = function() {
	let spawnEventList = $gameSystem.getSaveDataSpawnEventMapQJ();
    if (spawnEventList) {
    	for (let i of spawnEventList) {
    		this.spawnEventQJ.apply(this,i);
    	}
    }
};
//=============================================================================
//
//=============================================================================
Game_Map.prototype.spawnEventQJ = function(mapId,eventId,x,y,save = false,extraData = {}) {
    let maxId = this._events.length;
    this._events.push(new Game_SpawnEvent(mapId,eventId,maxId,this.mapId(),x,y,save,extraData = {}));
    if (SceneManager._scene&&SceneManager._scene._spriteset) {
    	SceneManager._scene._spriteset.createSpawnEvent(maxId);
    }
    this.lastestSpawnEventIdRemQJ = maxId;
    return maxId;
};
Game_Map.prototype.lastestSpawnEventIdQJ = function() {
    return this.lastestSpawnEventIdRemQJ;
};
Game_Map.prototype.clearSpawnEventQJ = function(id) {
	if (this._events[id]) {
        if (SceneManager._scene&&SceneManager._scene._spriteset) {
            SceneManager._scene._spriteset.clearSpawnEvent(id);
        }
		this._events[id] = null;
		$gameSelfSwitches.clearEventSelfSwitchesQJ(this.mapId(),id);
	}
};
Game_Map.prototype.clearMapQJ = function() {
	for (let i of this._events) {
		if (i&&i.constructor==Game_SpawnEvent) {
			this.clearSpawnEventQJ(i);
		}
	}
};
//=============================================================================
//
//=============================================================================
$.Sprite_Animation_targetSpritePosition = Sprite_Animation.prototype.targetSpritePosition;
Sprite_Animation.prototype.targetSpritePosition = function(sprite) {
	if (sprite.unspawn) return new Point(this._targets[0].x, this._targets[0].y);
    return $.Sprite_Animation_targetSpritePosition.apply(this,arguments);
};
Spriteset_Map.prototype.clearSpawnEvent = function(id) {
	for (let i = 0,sprite,event; i < this._characterSprites.length; i++) {
		sprite = this._characterSprites[i];
		event = sprite._character;
		if (event && event.isSpawnEvent && event.isSpawnEvent() && id == event.eventId()) {
			sprite.unspawn = true;
			this._tilemap.removeChild(sprite);
			return;
		};
	};
};
Spriteset_Map.prototype.createSpawnEvent = function(id) {
	let event = $gameMap._events[id];
	let sprite = new Sprite_Character(event);
	sprite.update();
	this._tilemap.addChild(sprite)
	this._characterSprites.push(sprite);
};
//=============================================================================
//
//=============================================================================
Game_Event.prototype.isSpawnEvent = function() {
    return false;
};
//=============================================================================
//
//=============================================================================
Game_SpawnEvent.prototype = Object.create(Game_Event.prototype);
Game_SpawnEvent.prototype.constructor = Game_SpawnEvent;
Game_SpawnEvent.prototype.initialize = function(mapId,eventId,currentEventId,currentMapId,x,y,save,extraData = null) {
	this._sourceMapId = mapId;
	this._sourceeventId = eventId;
	this._eventId = currentEventId;
	this._mapId = currentMapId;
	this._sourceX = x;
	this._sourceY = y;
	this.__event = JsonEx.makeDeepCopy($dataSpawnMapList[mapId].events[eventId]);
	this.__event.x = x;
	this.__event.y = y;
	this._saveSpawnEventData = save;
	Game_Event.prototype.initialize.call(this,currentMapId,currentEventId);
	if (extraData) {
		let newData = extraData;
		for (let i in newData) {
			this[i] = newData[i];
		}
	}
};
Game_SpawnEvent.prototype.isSpawnEvent = function() {
    return true;
};
Game_SpawnEvent.prototype.event = function() {
    return this.__event;
};
Game_SpawnEvent.prototype.needSaveData = function() {
	return this._saveSpawnEventData;
};
Game_SpawnEvent.prototype.makeSaveData = function() {
	//bid,sourcemapid,sourceid,x,y,extraData
	let saveList = [this._sourceMapId,this._sourceeventId,this._sourceX,this._sourceY,this.needSaveData()];
	let saveAttributeList = {};
	for (let i in saveData) {
		saveAttributeList[i] = this[i];
	}
	saveList.push(saveAttributeList);
	return saveList;
};
//=============================================================================
//
//=============================================================================
})();
//=============================================================================
//
//=============================================================================