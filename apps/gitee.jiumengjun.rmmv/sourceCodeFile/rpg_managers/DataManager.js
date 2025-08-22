//-----------------------------------------------------------------------------
/**
 * @fileoverview DataManager
 * @author 阮喵喵（翻译）
 * @classdesc
 * 数据管理器 - 管理数据库和游戏对象的静态类
 * Data Manager - The static class that manages the database and game objects.
 */

/**
 * @class DataManager
 * @classdesc
 * 管理数据库和游戏对象的静态类。
 * The static class that manages the database and game objects.
 * @static
 */
function DataManager() {
    throw new Error('This is a static class');
}

// Game data variables - 游戏数据变量
/**
 * @global
 * @type {Object[]}
 * @description 角色数据 - Actor data
 */
var $dataActors       = null;

/**
 * @global
 * @type {Object[]}
 * @description 职业数据 - Class data
 */
var $dataClasses      = null;

/**
 * @global
 * @type {Object[]}
 * @description 技能数据 - Skill data
 */
var $dataSkills       = null;

/**
 * @global
 * @type {Object[]}
 * @description 物品数据 - Item data
 */
var $dataItems        = null;

/**
 * @global
 * @type {Object[]}
 * @description 武器数据 - Weapon data
 */
var $dataWeapons      = null;

/**
 * @global
 * @type {Object[]}
 * @description 护甲数据 - Armor data
 */
var $dataArmors       = null;

/**
 * @global
 * @type {Object[]}
 * @description 敌人数据 - Enemy data
 */
var $dataEnemies      = null;

/**
 * @global
 * @type {Object[]}
 * @description 敌群数据 - Troop data
 */
var $dataTroops       = null;

/**
 * @global
 * @type {Object[]}
 * @description 状态数据 - State data
 */
var $dataStates       = null;

/**
 * @global
 * @type {Object[]}
 * @description 动画数据 - Animation data
 */
var $dataAnimations   = null;

/**
 * @global
 * @type {Object[]}
 * @description 图块数据 - Tileset data
 */
var $dataTilesets     = null;

/**
 * @global
 * @type {Object[]}
 * @description 公共事件数据 - Common event data
 */
var $dataCommonEvents = null;

/**
 * @global
 * @type {Object}
 * @description 系统数据 - System data
 */
var $dataSystem       = null;

/**
 * @global
 * @type {Object[]}
 * @description 地图信息数据 - Map info data
 */
var $dataMapInfos     = null;

/**
 * @global
 * @type {Object}
 * @description 地图数据 - Map data
 */
var $dataMap          = null;

// Game object variables - 游戏对象变量
/**
 * @global
 * @type {Game_Temp}
 * @description 游戏临时 - Game temporary data
 */
var $gameTemp         = null;

/**
 * @global
 * @type {Game_System}
 * @description 游戏系统 - Game system
 */
var $gameSystem       = null;

/**
 * @global
 * @type {Game_Screen}
 * @description 游戏画面 - Game screen
 */
var $gameScreen       = null;

/**
 * @global
 * @type {Game_Timer}
 * @description 游戏计时器 - Game timer
 */
var $gameTimer        = null;

/**
 * @global
 * @type {Game_Message}
 * @description 游戏消息 - Game message
 */
var $gameMessage      = null;

/**
 * @global
 * @type {Game_Switches}
 * @description 游戏开关 - Game switches
 */
var $gameSwitches     = null;

/**
 * @global
 * @type {Game_Variables}
 * @description 游戏变量 - Game variables
 */
var $gameVariables    = null;

/**
 * @global
 * @type {Game_SelfSwitches}
 * @description 游戏独立开关 - Game self switches
 */
var $gameSelfSwitches = null;

/**
 * @global
 * @type {Game_Actors}
 * @description 游戏角色 - Game actors
 */
var $gameActors       = null;

/**
 * @global
 * @type {Game_Party}
 * @description 游戏队伍 - Game party
 */
var $gameParty        = null;

/**
 * @global
 * @type {Game_Troop}
 * @description 游戏敌群 - Game troop
 */
var $gameTroop        = null;

/**
 * @global
 * @type {Game_Map}
 * @description 游戏地图 - Game map
 */
var $gameMap          = null;

/**
 * @global
 * @type {Game_Player}
 * @description 游戏玩家 - Game player
 */
var $gamePlayer       = null;

/**
 * @global
 * @type {Object}
 * @description 测试事件 - Test event
 */
var $testEvent        = null;

/**
 * @static
 * @type {String}
 * @description 全局 ID - Global ID
 */
DataManager._globalId       = 'RPGMV';

/**
 * @static
 * @type {Number}
 * @description 上次访问 ID，指存档的 ID - Last accessed ID, refers to save file ID
 */
DataManager._lastAccessedId = 1;

/**
 * @static
 * @type {String}
 * @description 错误链接 - Error URL
 */
DataManager._errorUrl       = null;

/**
 * @static
 * @type {Object[]}
 * @description 数据库文件配置 - Database file configuration
 */
DataManager._databaseFiles = [
    { name: '$dataActors',       src: 'Actors.json'       },  // 角色 - Actors
    { name: '$dataClasses',      src: 'Classes.json'      },  // 职业 - Classes
    { name: '$dataSkills',       src: 'Skills.json'       },  // 技能 - Skills
    { name: '$dataItems',        src: 'Items.json'        },  // 物品 - Items
    { name: '$dataWeapons',      src: 'Weapons.json'      },  // 武器 - Weapons
    { name: '$dataArmors',       src: 'Armors.json'       },  // 护甲 - Armors
    { name: '$dataEnemies',      src: 'Enemies.json'      },  // 敌人 - Enemies
    { name: '$dataTroops',       src: 'Troops.json'       },  // 敌群 - Troops
    { name: '$dataStates',       src: 'States.json'       },  // 状态 - States
    { name: '$dataAnimations',   src: 'Animations.json'   },  // 动画 - Animations
    { name: '$dataTilesets',     src: 'Tilesets.json'     },  // 图块 - Tilesets
    { name: '$dataCommonEvents', src: 'CommonEvents.json' },  // 公共事件 - Common Events
    { name: '$dataSystem',       src: 'System.json'       },  // 系统 - System
    { name: '$dataMapInfos',     src: 'MapInfos.json'     }   // 地图信息 - Map Infos
];

/**
 * @static
 * @method loadDatabase
 * @description
 * 加载数据库文件。
 * Loads the database files.
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
 * @static
 * @method loadDataFile
 * @description
 * 从服务器加载数据文件。
 * Loads a data file from the server.
 * @param {String} name - The global variable name to store the data - 存储数据的全局变量名
 * @param {String} src - The source file name - 源文件名
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
 * @static
 * @method isDatabaseLoaded
 * @description
 * 检查数据库是否完全加载。
 * Checks whether the database is loaded completely.
 * @returns {Boolean} True if the database is loaded - 如果数据库已加载则为true
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
 * @static
 * @method loadMapData
 * @description
 * 加载指定地图ID的地图数据。
 * Loads map data for the specified map ID.
 * @param {Number} mapId - The map ID to load - 要加载的地图ID
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
 * @static
 * @method makeEmptyMap
 * @description
 * 创建空的地图数据。
 * Creates an empty map data.
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
 * @static
 * @method isMapLoaded
 * @description
 * 检查地图数据是否已加载。
 * Checks whether the map data is loaded.
 * @returns {Boolean} True if the map data is loaded - 如果地图数据已加载则为true
 */
DataManager.isMapLoaded = function() {
    this.checkError();
    return !!$dataMap;
};

/**
 * @static
 * @method onLoad
 * @description
 * 当数据文件加载时调用。
 * Called when a data file is loaded.
 * @param {Object} object - The loaded data object - 加载的数据对象
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
 * @static
 * @method extractMetadata
 * @description
 * 从备注字符串中提取<key:value>或<key>格式的元数据。
 * Extracts metadata from note strings in <key:value> or <key> format.
 * @param {Object} data - The data object containing a note property - 包含note属性的数据对象
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
 * @static
 * @method checkError
 * @description
 * 检查加载错误，如果有错误则抛出异常。
 * Checks for loading errors and throws an exception if any.
 */
DataManager.checkError = function() {
    if (DataManager._errorUrl) {
        throw new Error('Failed to load: ' + DataManager._errorUrl);
    }
};

/**
 * @static
 * @method isBattleTest
 * @description
 * 检查游戏是否在战斗测试模式下运行。
 * Checks whether the game is running in battle test mode.
 * @returns {Boolean} True if in battle test mode - 如果在战斗测试模式则为true
 */
DataManager.isBattleTest = function() {
    return Utils.isOptionValid('btest');
};

/**
 * @static
 * @method isEventTest
 * @description
 * 检查游戏是否在事件测试模式下运行。
 * Checks whether the game is running in event test mode.
 * @returns {Boolean} True if in event test mode - 如果在事件测试模式则为true
 */
DataManager.isEventTest = function() {
    return Utils.isOptionValid('etest');
};

/**
 * @static
 * @method isSkill
 * @description
 * 检查指定物品是否为技能。
 * Checks whether the specified item is a skill.
 * @param {Object} item - The item to check - 要检查的物品
 * @returns {Boolean} True if the item is a skill - 如果物品是技能则为true
 */
DataManager.isSkill = function(item) {
    return item && $dataSkills.contains(item);
};

/**
 * @static
 * @method isItem
 * @description
 * 检查指定物品是否为物品。
 * Checks whether the specified item is an item.
 * @param {Object} item - The item to check - 要检查的物品
 * @returns {Boolean} True if the item is an item - 如果物品是物品则为true
 */
DataManager.isItem = function(item) {
    return item && $dataItems.contains(item);
};

/**
 * @static
 * @method isWeapon
 * @description
 * 检查指定物品是否为武器。
 * Checks whether the specified item is a weapon.
 * @param {Object} item - The item to check - 要检查的物品
 * @returns {Boolean} True if the item is a weapon - 如果物品是武器则为true
 */
DataManager.isWeapon = function(item) {
    return item && $dataWeapons.contains(item);
};

/**
 * @static
 * @method isArmor
 * @description
 * 检查指定物品是否为护甲。
 * Checks whether the specified item is an armor.
 * @param {Object} item - The item to check - 要检查的物品
 * @returns {Boolean} True if the item is an armor - 如果物品是护甲则为true
 */
DataManager.isArmor = function(item) {
    return item && $dataArmors.contains(item);
};

/**
 * @static
 * @method createGameObjects
 * @description
 * 创建所有游戏对象。
 * Creates all the game objects.
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
 * @static
 * @method setupNewGame
 * @description
 * 设置新游戏。
 * Sets up a new game.
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
 * @static
 * @method setupBattleTest
 * @description
 * 设置战斗测试。
 * Sets up a battle test.
 */
DataManager.setupBattleTest = function() {
    this.createGameObjects();
    $gameParty.setupBattleTest();
    BattleManager.setup($dataSystem.testTroopId, true, false);
    BattleManager.setBattleTest(true);
    BattleManager.playBattleBgm();
};

/**
 * @static
 * @method setupEventTest
 * @description
 * 设置事件测试。
 * Sets up an event test.
 */
DataManager.setupEventTest = function() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    $gameParty.setupStartingMembers();
    $gamePlayer.reserveTransfer(-1, 8, 6);
    $gamePlayer.setTransparent(false);
};

/**
 * @static
 * @method loadGlobalInfo
 * @description
 * 加载所有存档文件的全局信息。
 * Loads global info for all save files.
 * @returns {Array} The global info array - 全局信息数组
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

/**
 * @static
 * @method saveGlobalInfo
 * @description
 * 保存全局信息
 * Save global information
 * @param {Object} info - The global info to save - 要保存的全局信息
 */
DataManager.saveGlobalInfo = function(info) {
    StorageManager.save(0, JSON.stringify(info));
};

/**
 * @static
 * @method isThisGameFile
 * @description
 * 检查是否这个游戏文件
 * Check if this is a game file
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if this is a game file - 如果是游戏文件则为true
 */
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

/**
 * @static
 * @method isAnySavefileExists
 * @description
 * 检查是否存在存档
 * Check if any save file exists
 * @returns {Boolean} True if any save file exists - 如果存在存档则为true
 */
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

/**
 * @static
 * @method latestSavefileId
 * @description
 * 获取最新的存档 ID
 * Get the latest save file ID
 * @returns {Number} The latest save file ID - 最新的存档文件ID
 */
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

/**
 * @static
 * @method loadAllSavefileImages
 * @description
 * 加载所有存档图像
 * Load all save file images
 */
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

/**
 * @static
 * @method loadSavefileImages
 * @description
 * 加载存档图像
 * Load save file images
 * @param {Object} info - The save file info - 存档文件信息
 */
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

/**
 * @static
 * @method maxSavefiles
 * @description
 * 获取最大存档数
 * Get maximum number of save files
 * @returns {Number} Maximum number of save files - 最大存档数
 */
DataManager.maxSavefiles = function() {
    return 20;
};

/**
 * @static
 * @method saveGame
 * @description
 * 保存游戏
 * Save game
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if save succeeded - 如果保存成功则为true
 */
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

/**
 * @static
 * @method loadGame
 * @description
 * 加载游戏
 * Load game
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if load succeeded - 如果加载成功则为true
 */
DataManager.loadGame = function(savefileId) {
    try {
        return this.loadGameWithoutRescue(savefileId);
    } catch (e) {
        console.error(e);
        return false;
    }
};

/**
 * @static
 * @method loadSavefileInfo
 * @description
 * 加载存档信息
 * Load save file info
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Object} The save file info - 存档文件信息
 */
DataManager.loadSavefileInfo = function(savefileId) {
    var globalInfo = this.loadGlobalInfo();
    return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
};

/**
 * @static
 * @method lastAccessedSavefileId
 * @description
 * 获取上次访问的存档 ID
 * Get last accessed save file ID
 * @returns {Number} The last accessed save file ID - 上次访问的存档文件ID
 */
DataManager.lastAccessedSavefileId = function() {
    return this._lastAccessedId;
};

/**
 * @static
 * @method saveGameWithoutRescue
 * @description
 * 无异常处理的保存游戏
 * 函数名的 rescue 指 ruby 的 begin rescue，相当于 js 的 try catch，也就是异常处理。
 * Save game without rescue (exception handling)
 * The rescue in function name refers to ruby's begin rescue, equivalent to js try catch.
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if save succeeded - 如果保存成功则为true
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

/**
 * @static
 * @method loadGameWithoutRescue
 * @description
 * 无异常处理的加载游戏
 * Load game without rescue (exception handling)
 * @param {Number} savefileId - The save file ID - 存档文件ID
 * @returns {Boolean} True if load succeeded - 如果加载成功则为true
 */
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

/**
 * @static
 * @method selectSavefileForNewGame
 * @description
 * 为新游戏选择存档
 * Select save file for new game
 */
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

/**
 * @static
 * @method makeSavefileInfo
 * @description
 * 制作存档信息
 * Make save file info
 * @returns {Object} The save file info - 存档文件信息
 */
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

/**
 * @static
 * @method makeSaveContents
 * @description
 * 制作保存内容
 * 保存的数据不包含 $gameTemp、$gameMessage 和 $gameTroop。
 * Make save contents
 * A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
 * @returns {Object} The save contents - 保存内容
 */
DataManager.makeSaveContents = function() {
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

/**
 * @static
 * @method extractSaveContents
 * @description
 * 提取保存内容
 * Extract save contents
 * @param {Object} contents - The save contents - 保存内容
 */
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