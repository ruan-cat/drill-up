//=============================================================================
// rpg_managers.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * The static class that manages the database and game objects.
 * 管理数据和游戏对象的静态类。
 *
 * @class DataManager
 */
function DataManager() {
    throw new Error('This is a static class');
}

var $dataActors       = null;  // 角色数据 
var $dataClasses      = null;  // 职业数据 
var $dataSkills       = null;  // 技能数据 
var $dataItems        = null;  // 物品数据 
var $dataWeapons      = null;  // 武器数据 
var $dataArmors       = null;  // 护甲数据 
var $dataEnemies      = null;  // 敌人数据 
var $dataTroops       = null;  // 敌群数据 
var $dataStates       = null;  // 状态数据 
var $dataAnimations   = null;  // 动画数据 
var $dataTilesets     = null;  // 图块数据 
var $dataCommonEvents = null;  // 公共事件数据 
var $dataSystem       = null;  // 系统数据 
var $dataMapInfos     = null;  // 地图信息数据 
var $dataMap          = null;  // 地图数据 
var $gameTemp         = null;  // 游戏临时 
var $gameSystem       = null;  // 游戏系统 
var $gameScreen       = null;  // 游戏画面 
var $gameTimer        = null;  // 游戏计时器 
var $gameMessage      = null;  // 游戏消息 
var $gameSwitches     = null;  // 游戏开关 
var $gameVariables    = null;  // 游戏变量 
var $gameSelfSwitches = null;  // 游戏独立开关 
var $gameActors       = null;  // 游戏角色 
var $gameParty        = null;  // 游戏队伍 
var $gameTroop        = null;  // 游戏敌群 
var $gameMap          = null;  // 游戏地图 
var $gamePlayer       = null;  // 游戏玩家 
var $testEvent        = null;  // 测试事件 

DataManager._globalId       = 'RPGMV';  //全局 ID 
DataManager._lastAccessedId = 1;  // 上次访问 ID，指存档的 ID 
DataManager._errorUrl       = null;  //错误链接 

DataManager._databaseFiles = [
    { name: '$dataActors',       src: 'Actors.json'       },  // 角色 
    { name: '$dataClasses',      src: 'Classes.json'      },  // 职业 
    { name: '$dataSkills',       src: 'Skills.json'       },  // 技能 
    { name: '$dataItems',        src: 'Items.json'        },  // 物品 
    { name: '$dataWeapons',      src: 'Weapons.json'      },  // 武器 
    { name: '$dataArmors',       src: 'Armors.json'       },  // 护甲 
    { name: '$dataEnemies',      src: 'Enemies.json'      },  // 敌人 
    { name: '$dataTroops',       src: 'Troops.json'       },  // 敌群 
    { name: '$dataStates',       src: 'States.json'       },  // 状态 
    { name: '$dataAnimations',   src: 'Animations.json'   },  // 动画 
    { name: '$dataTilesets',     src: 'Tilesets.json'     },  // 图块 
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },  // 公共事件 
    { name: '$dataSystem',       src: 'System.json'       },  // 系统 
    { name: '$dataMapInfos',     src: 'MapInfos.json'     }   // 地图信息 
];

/**
 * Loads the database files.
 * 加载数据库文件。
 *
 * @static
 * @method loadDatabase
 */
DataManager.loadDatabase = function() {
    var test = this.isBattleTest() || this.isEventTest();
    var prefix = test ? 'Test_' : '';
    for (var i = 0; i < this._databaseFiles.length; i++) {
        var name = this._databaseFiles[i].name;
        var src = this._databaseFiles[i].src;
        this.loadDataFile(name, prefix + src);
    }
    if (this.isEventTest()) {
        this.loadDataFile('$testEvent', prefix + 'Event.json');
    }
};

/**
 * Loads a data file from the server.
 * 从服务器加载数据文件。
 *
 * @static
 * @method loadDataFile
 * @param {String} name - The global variable name to store the data
 * @param {String} src - The source file name
 */
DataManager.loadDataFile = function(name, src) {
    var xhr = new XMLHttpRequest();
    var url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            window[name] = JSON.parse(xhr.responseText);
            DataManager.onLoad(window[name]);
        }
    };
    xhr.onerror = this._mapLoader || function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
};

/**
 * Checks whether the database is loaded completely.
 * 检查数据库是否完全加载。
 *
 * @static
 * @method isDatabaseLoaded
 * @return {Boolean} True if the database is loaded
 */
DataManager.isDatabaseLoaded = function() {
    this.checkError();
    for (var i = 0; i < this._databaseFiles.length; i++) {
        if (!window[this._databaseFiles[i].name]) {
            return false;
        }
    }
    return true;
};

/**
 * Loads map data for the specified map ID.
 * 加载指定地图ID的地图数据。
 *
 * @static
 * @method loadMapData
 * @param {Number} mapId - The map ID to load
 */
DataManager.loadMapData = function(mapId) {
    if (mapId > 0) {
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
        this.loadDataFile('$dataMap', filename);
    } else {
        this.makeEmptyMap();
    }
};

/**
 * Creates an empty map data.
 * 创建空的地图数据。
 *
 * @static
 * @method makeEmptyMap
 */
DataManager.makeEmptyMap = function() {
    $dataMap = {};
    $dataMap.data = [];
    $dataMap.events = [];
    $dataMap.width = 100;
    $dataMap.height = 100;
    $dataMap.scrollType = 3;
};

/**
 * Checks whether the map data is loaded.
 * 检查地图数据是否已加载。
 *
 * @static
 * @method isMapLoaded
 * @return {Boolean} True if the map data is loaded
 */
DataManager.isMapLoaded = function() {
    this.checkError();
    return !!$dataMap;
};

/**
 * Called when a data file is loaded.
 * 当数据文件加载时调用。
 *
 * @static
 * @method onLoad
 * @param {Object} object - The loaded data object
 */
DataManager.onLoad = function(object) {
    var array;
    if (object === $dataMap) {
        this.extractMetadata(object);
        array = object.events;
    } else {
        array = object;
    }
    if (Array.isArray(array)) {
        for (var i = 0; i < array.length; i++) {
            var data = array[i];
            if (data && data.note !== undefined) {
                this.extractMetadata(data);
            }
        }
    }
    if (object === $dataSystem) {
        Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
        Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
        Scene_Boot.loadSystemImages();
    }
};

/**
 * Extracts metadata from note strings in <key:value> or <key> format.
 * 从备注字符串中提取<key:value>或<key>格式的元数据。
 *
 * @static
 * @method extractMetadata
 * @param {Object} data - The data object containing a note property
 */
DataManager.extractMetadata = function(data) {
    var re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (;;) {
        var match = re.exec(data.note);
        if (match) {
            if (match[2] === ':') {
                data.meta[match[1]] = match[3];
            } else {
                data.meta[match[1]] = true;
            }
        } else {
            break;
        }
    }
};

/**
 * Checks for loading errors and throws an exception if any.
 * 检查加载错误，如果有错误则抛出异常。
 *
 * @static
 * @method checkError
 */
DataManager.checkError = function() {
    if (DataManager._errorUrl) {
        throw new Error('Failed to load: ' + DataManager._errorUrl);
    }
};

/**
 * Checks whether the game is running in battle test mode.
 * 检查游戏是否在战斗测试模式下运行。
 *
 * @static
 * @method isBattleTest
 * @return {Boolean} True if in battle test mode
 */
DataManager.isBattleTest = function() {
    return Utils.isOptionValid('btest');
};

/**
 * Checks whether the game is running in event test mode.
 * 检查游戏是否在事件测试模式下运行。
 *
 * @static
 * @method isEventTest
 * @return {Boolean} True if in event test mode
 */
DataManager.isEventTest = function() {
    return Utils.isOptionValid('etest');
};

/**
 * Checks whether the specified item is a skill.
 * 检查指定物品是否为技能。
 *
 * @static
 * @method isSkill
 * @param {Object} item - The item to check
 * @return {Boolean} True if the item is a skill
 */
DataManager.isSkill = function(item) {
    return item && $dataSkills.contains(item);
};

/**
 * Checks whether the specified item is an item.
 * 检查指定物品是否为物品。
 *
 * @static
 * @method isItem
 * @param {Object} item - The item to check
 * @return {Boolean} True if the item is an item
 */
DataManager.isItem = function(item) {
    return item && $dataItems.contains(item);
};

/**
 * Checks whether the specified item is a weapon.
 * 检查指定物品是否为武器。
 *
 * @static
 * @method isWeapon
 * @param {Object} item - The item to check
 * @return {Boolean} True if the item is a weapon
 */
DataManager.isWeapon = function(item) {
    return item && $dataWeapons.contains(item);
};

/**
 * Checks whether the specified item is an armor.
 * 检查指定物品是否为护甲。
 *
 * @static
 * @method isArmor
 * @param {Object} item - The item to check
 * @return {Boolean} True if the item is an armor
 */
DataManager.isArmor = function(item) {
    return item && $dataArmors.contains(item);
};

/**
 * Creates all the game objects.
 * 创建所有游戏对象。
 *
 * @static
 * @method createGameObjects
 */
DataManager.createGameObjects = function() {
    $gameTemp          = new Game_Temp();
    $gameSystem        = new Game_System();
    $gameScreen        = new Game_Screen();
    $gameTimer         = new Game_Timer();
    $gameMessage       = new Game_Message();
    $gameSwitches      = new Game_Switches();
    $gameVariables     = new Game_Variables();
    $gameSelfSwitches  = new Game_SelfSwitches();
    $gameActors        = new Game_Actors();
    $gameParty         = new Game_Party();
    $gameTroop         = new Game_Troop();
    $gameMap           = new Game_Map();
    $gamePlayer        = new Game_Player();
};

/**
 * Sets up a new game.
 * 设置新游戏。
 *
 * @static
 * @method setupNewGame
 */
DataManager.setupNewGame = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer($dataSystem.startMapId,
        $dataSystem.startX, $dataSystem.startY);
    Graphics.frameCount = 0;
};

/**
 * Sets up a battle test.
 * 设置战斗测试。
 *
 * @static
 * @method setupBattleTest
 */
DataManager.setupBattleTest = function() {
    this.createGameObjects();
    $gameParty.setupBattleTest();
    BattleManager.setup($dataSystem.testTroopId, true, false);
    BattleManager.setBattleTest(true);
    BattleManager.playBattleBgm();
};

/**
 * Sets up an event test.
 * 设置事件测试。
 *
 * @static
 * @method setupEventTest
 */
DataManager.setupEventTest = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(-1, 8, 6);
    $gamePlayer.setTransparent(false);
};

/**
 * Loads global info for all save files.
 * 加载所有存档文件的全局信息。
 *
 * @static
 * @method loadGlobalInfo
 * @return {Array} The global info array
 */
DataManager.loadGlobalInfo = function() {
    var json;
    try {
        json = StorageManager.load(0);
    } catch (e) {
        console.error(e);
        return [];
    }
    if (json) {
        var globalInfo = JSON.parse(json);
        for (var i = 1; i <= this.maxSavefiles(); i++) {
            if (!StorageManager.exists(i)) {
                delete globalInfo[i];
            }
        }
        return globalInfo;
    } else {
        return [];
    }
};

/* 保存全局信息 */
DataManager.saveGlobalInfo = function(info) {
    StorageManager.save(0, JSON.stringify(info));
};

/*是否这个游戏文件 */
DataManager.isThisGameFile = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo && globalInfo[savefileId]) {
        if (StorageManager.isLocalMode()) {
            return true;
        } else {
            var savefile = globalInfo[savefileId];
            return (savefile.globalId === this._globalId &&
                    savefile.title === $dataSystem.gameTitle);
        }
    } else {
        return false;
    }
};

/* 是否存在存档 */
DataManager.isAnySavefileExists = function() {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i)) {
                return true;
            }
        }
    }
    return false;
};

/* 最新的存档 ID */
DataManager.latestSavefileId = function() {
    var globalInfo = this.loadGlobalInfo();
    var savefileId = 1;
    var timestamp = 0;
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                timestamp = globalInfo[i].timestamp;
                savefileId = i;
            }
        }
    }
    return savefileId;
};

/* 加载所有存档图像 */
DataManager.loadAllSavefileImages = function() {
    var globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
        for (var i = 1; i < globalInfo.length; i++) {
            if (this.isThisGameFile(i)) {
                var info = globalInfo[i];
                this.loadSavefileImages(info);
            }
        }
    }
};

/* 加载存档图像 */
DataManager.loadSavefileImages = function(info) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            ImageManager.reserveCharacter(info.characters[i][0]);
        }
    }
    if (info.faces) {
        for (var j = 0; j < info.faces.length; j++) {
            ImageManager.reserveFace(info.faces[j][0]);
        }
    }
};

/* 最大存档数 */
DataManager.maxSavefiles = function() {
    return 20;
};

/* 保存游戏 */
DataManager.saveGame = function(savefileId) {
    try {
        StorageManager.backup(savefileId);
        return this.saveGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        try {
            StorageManager.remove(savefileId);
            StorageManager.restoreBackup(savefileId);
        } catch (e2) {
        }
        return false;
    }
};

/* 加载游戏 */
DataManager.loadGame = function(savefileId) {
    try {
        return this.loadGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        return false;
    }
};

/* 加载存档信息 */
DataManager.loadSavefileInfo = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
};

/* 上次访问的存档 ID */
DataManager.lastAccessedSavefileId = function() {
    return this._lastAccessedId;
};

/* 无异常处理的保存游戏
 * 函数名的 rescue 指 ruby 的 begin rescue，相当于 js 的 try catch，也就是异常处理。
 */
DataManager.saveGameWithoutRescue = function(savefileId) {
    var json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
        console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    var globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
};

/* 无异常处理的加载游戏 */
DataManager.loadGameWithoutRescue = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
        var json = StorageManager.load(savefileId);
        this.createGameObjects();
        this.extractSaveContents(JsonEx.parse(json));
        this._lastAccessedId = savefileId;
        return true;
    } else {
        return false;
    }
};

/* 为新游戏选择存档 */
DataManager.selectSavefileForNewGame = function() {
    var globalInfo = this.loadGlobalInfo();
    this._lastAccessedId = 1;
    if (globalInfo) {
        var numSavefiles = Math.max(0, globalInfo.length - 1);
        if (numSavefiles < this.maxSavefiles()) {
            this._lastAccessedId = numSavefiles + 1;
        } else {
            var timestamp = Number.MAX_VALUE;
            for (var i = 1; i < globalInfo.length; i++) {
                if (!globalInfo[i]) {
                    this._lastAccessedId = i;
                    break;
                }
                if (globalInfo[i].timestamp < timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    this._lastAccessedId = i;
                }
            }
        }
    }
};

/* 制作存档信息 */
DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    info.timestamp  = Date.now();
    return info;
};

/* 制作保存内容 */
DataManager.makeSaveContents = function() {
    // 保存的数据不包含 $gameTemp、$gameMessage 和 $gameTroop。 
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    var contents = {};
    contents.system       = $gameSystem;
    contents.screen       = $gameScreen;
    contents.timer        = $gameTimer;
    contents.switches     = $gameSwitches;
    contents.variables    = $gameVariables;
    contents.selfSwitches = $gameSelfSwitches;
    contents.actors       = $gameActors;
    contents.party        = $gameParty;
    contents.map          = $gameMap;
    contents.player       = $gamePlayer;
    return contents;
};

/* 提取保存内容 */
DataManager.extractSaveContents = function(contents) {
    $gameSystem        = contents.system;
    $gameScreen        = contents.screen;
    $gameTimer         = contents.timer;
    $gameSwitches      = contents.switches;
    $gameVariables     = contents.variables;
    $gameSelfSwitches  = contents.selfSwitches;
    $gameActors        = contents.actors;
    $gameParty         = contents.party;
    $gameMap           = contents.map;
    $gamePlayer        = contents.player;
};









