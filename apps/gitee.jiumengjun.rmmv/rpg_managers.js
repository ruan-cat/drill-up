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

//-----------------------------------------------------------------------------
// 配置管理器
// ConfigManager
//
// 管理配置数据的静态类。
// The static class that manages the configuration data.

function ConfigManager() {
    throw new Error('This is a static class');
}

ConfigManager.alwaysDash        = false;  // 始终跑步 
ConfigManager.commandRemember   = false;  // 记住指令 

/* BGM 音量 */
Object.defineProperty(ConfigManager, 'bgmVolume', {
    get: function() {
        return AudioManager._bgmVolume;
    },
    set: function(value) {
        AudioManager.bgmVolume = value;
    },
    configurable: true
});

/* BGS 音量 */
Object.defineProperty(ConfigManager, 'bgsVolume', {
    get: function() {
        return AudioManager.bgsVolume;
    },
    set: function(value) {
        AudioManager.bgsVolume = value;
    },
    configurable: true
});

/* ME 音量 */
Object.defineProperty(ConfigManager, 'meVolume', {
    get: function() {
        return AudioManager.meVolume;
    },
    set: function(value) {
        AudioManager.meVolume = value;
    },
    configurable: true
});

/* SE 音量 */
Object.defineProperty(ConfigManager, 'seVolume', {
    get: function() {
        return AudioManager.seVolume;
    },
    set: function(value) {
        AudioManager.seVolume = value;
    },
    configurable: true
});

/* 加载 */
ConfigManager.load = function() {
    var json;
    var config = {};
    try {
        json = StorageManager.load(-1);
    } catch (e) {
        console.error(e);
    }
    if (json) {
        config = JSON.parse(json);
    }
    this.applyData(config);
};

/* 保存 */
ConfigManager.save = function() {
    StorageManager.save(-1, JSON.stringify(this.makeData()));
};

/* 制作数据 */
ConfigManager.makeData = function() {
    var config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    return config;
};

/* 执行数据 */
ConfigManager.applyData = function(config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
};

/* 读取标志 */
ConfigManager.readFlag = function(config, name) {
    return !!config[name];
};

/* 读取音量 */
ConfigManager.readVolume = function(config, name) {
    var value = config[name];
    if (value !== undefined) {
        return Number(value).clamp(0, 100);
    } else {
        return 100;
    }
};

//-----------------------------------------------------------------------------
// 存储管理器
// StorageManager
//
// 管理保存游戏数据的存储的静态类。
// The static class that manages storage for saving game data.

function StorageManager() {
    throw new Error('This is a static class');
}

/* 保存 */
StorageManager.save = function(savefileId, json) {
    if (this.isLocalMode()) {
        this.saveToLocalFile(savefileId, json);
    } else {
        this.saveToWebStorage(savefileId, json);
    }
};

/* 加载 */
StorageManager.load = function(savefileId) {
    if (this.isLocalMode()) {
        return this.loadFromLocalFile(savefileId);
    } else {
        return this.loadFromWebStorage(savefileId);
    }
};

/* 是否存在 */
StorageManager.exists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileExists(savefileId);
    } else {
        return this.webStorageExists(savefileId);
    }
};

/* 移除 */
StorageManager.remove = function(savefileId) {
    if (this.isLocalMode()) {
        this.removeLocalFile(savefileId);
    } else {
        this.removeWebStorage(savefileId);
    }
};

/* 备份 */
StorageManager.backup = function(savefileId) {
    if (this.exists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId) + ".bak";
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
        } else {
            var data = this.loadFromWebStorage(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId) + "bak";
            localStorage.setItem(key, compressed);
        }
    }
};

/* 备份是否存在 */
StorageManager.backupExists = function(savefileId) {
    if (this.isLocalMode()) {
        return this.localFileBackupExists(savefileId);
    } else {
        return this.webStorageBackupExists(savefileId);
    }
};

/* 清除备份 */
StorageManager.cleanBackup = function(savefileId) {
	if (this.backupExists(savefileId)) {
		if (this.isLocalMode()) {
			var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            fs.unlinkSync(filePath + ".bak");
		} else {
		    var key = this.webStorageKey(savefileId);
			localStorage.removeItem(key + "bak");
		}
	}
};

/* 还原备份 */
StorageManager.restoreBackup = function(savefileId) {
    if (this.backupExists(savefileId)) {
        if (this.isLocalMode()) {
            var data = this.loadFromLocalBackupFile(savefileId);
            var compressed = LZString.compressToBase64(data);
            var fs = require('fs');
            var dirPath = this.localFileDirectoryPath();
            var filePath = this.localFilePath(savefileId);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
            fs.writeFileSync(filePath, compressed);
            fs.unlinkSync(filePath + ".bak");
        } else {
            var data = this.loadFromWebStorageBackup(savefileId);
            var compressed = LZString.compressToBase64(data);
            var key = this.webStorageKey(savefileId);
            localStorage.setItem(key, compressed);
            localStorage.removeItem(key + "bak");
        }
    }
};

/* 是否本地模式
 * 在 PC 平台上使用 NW.js，即为本地模式。
 */
StorageManager.isLocalMode = function() {
    return Utils.isNwjs();
};

/* 保存到本地文件 */
StorageManager.saveToLocalFile = function(savefileId, json) {
    var data = LZString.compressToBase64(json);
    var fs = require('fs');
    var dirPath = this.localFileDirectoryPath();
    var filePath = this.localFilePath(savefileId);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, data);
};

/* 从本地文件加载 */
StorageManager.loadFromLocalFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

/* 从本地备份文件加载 */
StorageManager.loadFromLocalBackupFile = function(savefileId) {
    var data = null;
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId) + ".bak";
    if (fs.existsSync(filePath)) {
        data = fs.readFileSync(filePath, { encoding: 'utf8' });
    }
    return LZString.decompressFromBase64(data);
};

/* 本地文件备份是否存在 */
StorageManager.localFileBackupExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId) + ".bak");
};

/* 本地文件是否存在 */
StorageManager.localFileExists = function(savefileId) {
    var fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId));
};

/* 移除本地文件 */
StorageManager.removeLocalFile = function(savefileId) {
    var fs = require('fs');
    var filePath = this.localFilePath(savefileId);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

/* 移除浏览器存储 */
StorageManager.saveToWebStorage = function(savefileId, json) {
    var key = this.webStorageKey(savefileId);
    var data = LZString.compressToBase64(json);
    localStorage.setItem(key, data);
};

/* 从浏览器存储加载 */
StorageManager.loadFromWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

/* 从浏览器存备份储加载 */
StorageManager.loadFromWebStorageBackup = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    var data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
};

/* 浏览器存储备份是否存在 */
StorageManager.webStorageBackupExists = function(savefileId) {
    var key = this.webStorageKey(savefileId) + "bak";
    return !!localStorage.getItem(key);
};

/* 浏览器存储是否存在 */
StorageManager.webStorageExists = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    return !!localStorage.getItem(key);
};

/* 移除浏览器存储 */
StorageManager.removeWebStorage = function(savefileId) {
    var key = this.webStorageKey(savefileId);
    localStorage.removeItem(key);
};

/* 本地文件目录路径 */
StorageManager.localFileDirectoryPath = function() {
    var path = require('path');

    var base = path.dirname(process.mainModule.filename);
    return path.join(base, 'save/');
};

/* 本地文件路径 */
StorageManager.localFilePath = function(savefileId) {
    var name;
    if (savefileId < 0) {
        name = 'config.rpgsave';
    } else if (savefileId === 0) {
        name = 'global.rpgsave';
    } else {
        name = 'file%1.rpgsave'.format(savefileId);
    }
    return this.localFileDirectoryPath() + name;
};

/* 浏览器存储文键名 */
StorageManager.webStorageKey = function(savefileId) {
    if (savefileId < 0) {
        return 'RPG Config';
    } else if (savefileId === 0) {
        return 'RPG Global';
    } else {
        return 'RPG File%1'.format(savefileId);
    }
};

//-----------------------------------------------------------------------------
// 图像管理器
// ImageManager
//
// 加载图像，创建位图对象和保存它们的静态类。
// The static class that loads images, creates bitmap objects and retains them.

function ImageManager() {
    throw new Error('This is a static class');
}

ImageManager.cache = new CacheMap(ImageManager);  //缓存 

ImageManager._imageCache = new ImageCache();  // 图像缓存 
ImageManager._requestQueue = new RequestQueue();  // 请求队列 
ImageManager._systemReservationId = Utils.generateRuntimeId();  // 系统储存 ID 

/* 生成缓存键名 */
ImageManager._generateCacheKey = function(path, hue){
    return  path + ':' + hue;
};

/* 加载动画 */
ImageManager.loadAnimation = function(filename, hue) {
    return this.loadBitmap('img/animations/', filename, hue, true);
};

/* 加载战斗背景 1 */
ImageManager.loadBattleback1 = function(filename, hue) {
    return this.loadBitmap('img/battlebacks1/', filename, hue, true);
};

/* 加载战斗背景 2 */
ImageManager.loadBattleback2 = function(filename, hue) {
    return this.loadBitmap('img/battlebacks2/', filename, hue, true);
};

/* 加载敌人战斗图（正视图） */
ImageManager.loadEnemy = function(filename, hue) {
    return this.loadBitmap('img/enemies/', filename, hue, true);
};

/* 加载角色行走图 */
ImageManager.loadCharacter = function(filename, hue) {
    return this.loadBitmap('img/characters/', filename, hue, false);
};

/* 加载脸图 */
ImageManager.loadFace = function(filename, hue) {
    return this.loadBitmap('img/faces/', filename, hue, true);
};

/* 加载远景图 */
ImageManager.loadParallax = function(filename, hue) {
    return this.loadBitmap('img/parallaxes/', filename, hue, true);
};

/* 加载图片 */
ImageManager.loadPicture = function(filename, hue) {
    return this.loadBitmap('img/pictures/', filename, hue, true);
};

/* 加载我方战斗图（侧面图） 
 * 在战斗场景的 SideView 战斗系统下使用。
 */
ImageManager.loadSvActor = function(filename, hue) {
    return this.loadBitmap('img/sv_actors/', filename, hue, false);
};

/* 加载敌人战斗图（侧面图） 
 * 在战斗场景的 SideView 战斗系统下使用。
 */
ImageManager.loadSvEnemy = function(filename, hue) {
    return this.loadBitmap('img/sv_enemies/', filename, hue, true);
};

/* 加载系统图片 */
ImageManager.loadSystem = function(filename, hue) {
    return this.loadBitmap('img/system/', filename, hue, false);
};

/* 加载地图图块 */
ImageManager.loadTileset = function(filename, hue) {
    return this.loadBitmap('img/tilesets/', filename, hue, false);
};

/* 加载标题图片 1 */
ImageManager.loadTitle1 = function(filename, hue) {
    return this.loadBitmap('img/titles1/', filename, hue, true);
};

/* 加载标题图片 2 */
ImageManager.loadTitle2 = function(filename, hue) {
    return this.loadBitmap('img/titles2/', filename, hue, true);
};

/* 加载位图 */
ImageManager.loadBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.loadNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

/* 加载空白位图 */
ImageManager.loadEmptyBitmap = function() {
    var empty = this._imageCache.get('empty');
    if(!empty){
        empty = new Bitmap();
        this._imageCache.add('empty', empty);
        this._imageCache.reserve('empty', empty, this._systemReservationId);
    }

    return empty;
};

/* 加载标准位图 */
ImageManager.loadNormalBitmap = function(path, hue) {
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if (!bitmap) {
        bitmap = Bitmap.load(decodeURIComponent(path));
        bitmap.addLoadListener(function() {
            bitmap.rotateHue(hue);
        });
        this._imageCache.add(key, bitmap);
    }else if(!bitmap.isReady()){
        bitmap.decode();
    }

    return bitmap;
};

/* 清空 */
ImageManager.clear = function() {
    this._imageCache = new ImageCache();
};

/* 是否准备好 */
ImageManager.isReady = function() {
    return this._imageCache.isReady();
};

/* 是否物体的行走图
 * 图片名字!开头（包括!$），取消角色比地图元件高 6 像素的效果以及经
 * 过流体属性图块时的半透明效果。大多用于物件类的角色，如门和宝箱。
 */
ImageManager.isObjectCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('!');
};

/* 是否大张的行走图
 * 图片名字$开头（包括!$），该文件就只能容纳一个角色元。
 */
ImageManager.isBigCharacter = function(filename) {
    var sign = filename.match(/^[\!\$]+/);
    return sign && sign[0].contains('$');
};

/* 是否零视差图 
 * 视差图也就是远景图，与地面位移存在视差，零视差相当于地面。 
 * 图片名字!开头，将被视作地面来显示。 
 */
ImageManager.isZeroParallax = function(filename) {
    return filename.charAt(0) === '!';
};

/* 储存动画 */
ImageManager.reserveAnimation = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/animations/', filename, hue, true, reservationId);
};

/* 储存战斗背景1 */
ImageManager.reserveBattleback1 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/battlebacks1/', filename, hue, true, reservationId);
};

/* 储存战斗背景2 */
ImageManager.reserveBattleback2 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/battlebacks2/', filename, hue, true, reservationId);
};

/* 储存纵版战斗敌人战斗图 */
ImageManager.reserveEnemy = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/enemies/', filename, hue, true, reservationId);
};

/* 储存角色行走图 */
ImageManager.reserveCharacter = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/characters/', filename, hue, false, reservationId);
};

/* 储存脸图 */
ImageManager.reserveFace = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/faces/', filename, hue, true, reservationId);
};

/* 储存远景图 */
ImageManager.reserveParallax = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/parallaxes/', filename, hue, true, reservationId);
};

/* 储存图片 */
ImageManager.reservePicture = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/pictures/', filename, hue, true, reservationId);
};

/* 储存横版战斗我方战斗图 */
ImageManager.reserveSvActor = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/sv_actors/', filename, hue, false, reservationId);
};

/* 储存横版战斗敌人战斗图 */
ImageManager.reserveSvEnemy = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/sv_enemies/', filename, hue, true, reservationId);
};

/* 储存系统图片 */
ImageManager.reserveSystem = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/system/', filename, hue, false, reservationId || this._systemReservationId);
};

/* 储存地图图块 */
ImageManager.reserveTileset = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/tilesets/', filename, hue, false, reservationId);
};

/* 储存标题图片 1 */
ImageManager.reserveTitle1 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/titles1/', filename, hue, true, reservationId);
};

/* 储存标题图片 2 */
ImageManager.reserveTitle2 = function(filename, hue, reservationId) {
    return this.reserveBitmap('img/titles2/', filename, hue, true, reservationId);
};

/* 储存位图 */
ImageManager.reserveBitmap = function(folder, filename, hue, smooth, reservationId) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

/* 储存标准位图 */
ImageManager.reserveNormalBitmap = function(path, hue, reservationId){
    var bitmap = this.loadNormalBitmap(path, hue);
    this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);

    return bitmap;
};

/* 释放储存*/
ImageManager.releaseReservation = function(reservationId){
    this._imageCache.releaseReservation(reservationId);
};

/* 设置默认储存 ID*/
ImageManager.setDefaultReservationId = function(reservationId){
    this._defaultReservationId = reservationId;
};

/* 请求动画 */
ImageManager.requestAnimation = function(filename, hue) {
    return this.requestBitmap('img/animations/', filename, hue, true);
};

/* 请求战斗背景 1 */
ImageManager.requestBattleback1 = function(filename, hue) {
    return this.requestBitmap('img/battlebacks1/', filename, hue, true);
};

/* 请求战斗背景 2 */
ImageManager.requestBattleback2 = function(filename, hue) {
    return this.requestBitmap('img/battlebacks2/', filename, hue, true);
};

/* 请求纵版战斗敌人战斗图 */
ImageManager.requestEnemy = function(filename, hue) {
    return this.requestBitmap('img/enemies/', filename, hue, true);
};

/* 请求角色行走图 */
ImageManager.requestCharacter = function(filename, hue) {
    return this.requestBitmap('img/characters/', filename, hue, false);
};

/* 请求脸图 */
ImageManager.requestFace = function(filename, hue) {
    return this.requestBitmap('img/faces/', filename, hue, true);
};

/* 请求远景图 */
ImageManager.requestParallax = function(filename, hue) {
    return this.requestBitmap('img/parallaxes/', filename, hue, true);
};

/* 请求图片 */
ImageManager.requestPicture = function(filename, hue) {
    return this.requestBitmap('img/pictures/', filename, hue, true);
};

/* 请求横版战斗我方战斗图 */
ImageManager.requestSvActor = function(filename, hue) {
    return this.requestBitmap('img/sv_actors/', filename, hue, false);
};

/* 请求横版战斗敌人战斗图 */
ImageManager.requestSvEnemy = function(filename, hue) {
    return this.requestBitmap('img/sv_enemies/', filename, hue, true);
};

/* 请求系统图片 */
ImageManager.requestSystem = function(filename, hue) {
    return this.requestBitmap('img/system/', filename, hue, false);
};

/* 请求地图图块 */
ImageManager.requestTileset = function(filename, hue) {
    return this.requestBitmap('img/tilesets/', filename, hue, false);
};

/* 请求标题图片 1 */
ImageManager.requestTitle1 = function(filename, hue) {
    return this.requestBitmap('img/titles1/', filename, hue, true);
};

/* 请求标题图片 2 */
ImageManager.requestTitle2 = function(filename, hue) {
    return this.requestBitmap('img/titles2/', filename, hue, true);
};

/* 请求位图 */
ImageManager.requestBitmap = function(folder, filename, hue, smooth) {
    if (filename) {
        var path = folder + encodeURIComponent(filename) + '.png';
        var bitmap = this.requestNormalBitmap(path, hue || 0);
        bitmap.smooth = smooth;
        return bitmap;
    } else {
        return this.loadEmptyBitmap();
    }
};

/* 请求标准位图 */
ImageManager.requestNormalBitmap = function(path, hue){
    var key = this._generateCacheKey(path, hue);
    var bitmap = this._imageCache.get(key);
    if(!bitmap){
        bitmap = Bitmap.request(path);
        bitmap.addLoadListener(function(){
            bitmap.rotateHue(hue);
        });
        this._imageCache.add(key, bitmap);
        this._requestQueue.enqueue(key, bitmap);
    }else{
        this._requestQueue.raisePriority(key);
    }

    return bitmap;
};

/* 更新 */
ImageManager.update = function(){
    this._requestQueue.update();
};

/* 清空请求 */
ImageManager.clearRequest = function(){
    this._requestQueue.clear();
};

//-----------------------------------------------------------------------------
// 音频管理器
// AudioManager
//
// 操作 BGM, BGS, ME 和 SE 的静态类。
// The static class that handles BGM, BGS, ME and SE.

function AudioManager() {
    throw new Error('This is a static class');
}

AudioManager._masterVolume   = 1;         // （最小：0，最大：1）(min: 0, max: 1)
AudioManager._bgmVolume      = 100;       // BGM 音量 
AudioManager._bgsVolume      = 100;       // BGS 音量 
AudioManager._meVolume       = 100;       // ME 音量 
AudioManager._seVolume       = 100;       // SE 音量 
AudioManager._currentBgm     = null;      // 当前 BGM 
AudioManager._currentBgs     = null;      // 当前 BGS 
AudioManager._bgmBuffer      = null;      // BGM 缓冲区 
AudioManager._bgsBuffer      = null;      // BGS 缓冲区 
AudioManager._meBuffer       = null;      // ME 缓冲区 
AudioManager._seBuffers      = [];        // SE 缓冲区 
AudioManager._staticBuffers  = [];        // 静态缓冲区 
AudioManager._replayFadeTime = 0.5;       // 重播的淡入时间 
AudioManager._path           = 'audio/';  // 路径 
AudioManager._blobUrl        = null;      // 二进制大对象地址 

/* 主音量 */
Object.defineProperty(AudioManager, 'masterVolume', {
    get: function() {
        return this._masterVolume;
    },
    set: function(value) {
        this._masterVolume = value;
        WebAudio.setMasterVolume(this._masterVolume);
        Graphics.setVideoVolume(this._masterVolume);
    },
    configurable: true
});

/* BGM 音量 */
Object.defineProperty(AudioManager, 'bgmVolume', {
    get: function() {
        return this._bgmVolume;
    },
    set: function(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    },
    configurable: true
});

/* BGS 音量 */
Object.defineProperty(AudioManager, 'bgsVolume', {
    get: function() {
        return this._bgsVolume;
    },
    set: function(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    },
    configurable: true
});

/* ME 音量 */
Object.defineProperty(AudioManager, 'meVolume', {
    get: function() {
        return this._meVolume;
    },
    set: function(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    },
    configurable: true
});

/* SE 音量 */
Object.defineProperty(AudioManager, 'seVolume', {
    get: function() {
        return this._seVolume;
    },
    set: function(value) {
        this._seVolume = value;
    },
    configurable: true
});

/* 播放 BGM */
AudioManager.playBgm = function(bgm, pos) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.stopBgm();
        if (bgm.name) { 
            if(Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()){
                this.playEncryptedBgm(bgm, pos);
            }
            else {
                this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

/* 播放加密的 BGM */
AudioManager.playEncryptedBgm = function(bgm, pos) {
    var ext = this.audioFileExt();
    var url = this._path + 'bgm/' + encodeURIComponent(bgm.name) + ext;
    url = Decrypter.extToEncryptExt(url);
    Decrypter.decryptHTML5Audio(url, bgm, pos);
};

/* 创建解密的缓冲区 */
AudioManager.createDecryptBuffer = function(url, bgm, pos){
    this._blobUrl = url;
    this._bgmBuffer = this.createBuffer('bgm', bgm.name);
    this.updateBgmParameters(bgm);
    if (!this._meBuffer) {
        this._bgmBuffer.play(true, pos || 0);
    }
    this.updateCurrentBgm(bgm, pos);
};

/* 还原 BGM */
AudioManager.replayBgm = function(bgm) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.playBgm(bgm, bgm.pos);
        if (this._bgmBuffer) {
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/* 是否当前的 BGM */
AudioManager.isCurrentBgm = function(bgm) {
    return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
};

/* 更新 BGM 的参数 */
AudioManager.updateBgmParameters = function(bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
};

/* 更新当前的 BGM */
AudioManager.updateCurrentBgm = function(bgm, pos) {
    this._currentBgm = {
        name: bgm.name,      // 名字 
        volume: bgm.volume,  // 音量 
        pitch: bgm.pitch,    // 音调 
        pan: bgm.pan,        // 声像 
        pos: pos             // 缓冲区位置（播放的位置） 
    };
};

/* 停止 BGM */
AudioManager.stopBgm = function() {
    if (this._bgmBuffer) {
        this._bgmBuffer.stop();
        this._bgmBuffer = null;
        this._currentBgm = null;
    }
};

/* 淡出 BGM */
AudioManager.fadeOutBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeOut(duration);
        this._currentBgm = null;
    }
};

/* 淡入 BGM */
AudioManager.fadeInBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeIn(duration);
    }
};

/* 播放 BGS */
AudioManager.playBgs = function(bgs, pos) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};

/* 还原 BGS */
AudioManager.replayBgs = function(bgs) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.playBgs(bgs, bgs.pos);
        if (this._bgsBuffer) {
            this._bgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/* 是否当前的 BGS */
AudioManager.isCurrentBgs = function(bgs) {
    return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
};

/* 更新 BGS 的参数 */
AudioManager.updateBgsParameters = function(bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
};

/* 更新当前的 BGS */
AudioManager.updateCurrentBgs = function(bgs, pos) {
    this._currentBgs = {
        name: bgs.name,      // 名字 
        volume: bgs.volume,  // 音量
        pitch: bgs.pitch,    // 音调 
        pan: bgs.pan,        // 声像
        pos: pos             // 缓冲区位置（播放的位置） 
    };
};

/* 停止 BGS */
AudioManager.stopBgs = function() {
    if (this._bgsBuffer) {
        this._bgsBuffer.stop();
        this._bgsBuffer = null;
        this._currentBgs = null;
    }
};

/* 淡出 BGS */
AudioManager.fadeOutBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeOut(duration);
        this._currentBgs = null;
    }
};

/* 淡入 BGS */
AudioManager.fadeInBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeIn(duration);
    }
};

/* 播放 ME */
AudioManager.playMe = function(me) {
    this.stopMe();
    if (me.name) {
        if (this._bgmBuffer && this._currentBgm) {
            this._currentBgm.pos = this._bgmBuffer.seek();
            this._bgmBuffer.stop();
        }
        this._meBuffer = this.createBuffer('me', me.name);
        this.updateMeParameters(me);
        this._meBuffer.play(false);
        this._meBuffer.addStopListener(this.stopMe.bind(this));
    }
};

/* 更新 ME 的参数 */
AudioManager.updateMeParameters = function(me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me);
};

/* 淡出 ME */
AudioManager.fadeOutMe = function(duration) {
    if (this._meBuffer) {
        this._meBuffer.fadeOut(duration);
    }
};

/* 停止 ME */
AudioManager.stopMe = function() {
    if (this._meBuffer) {
        this._meBuffer.stop();
        this._meBuffer = null;
        if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
            this._bgmBuffer.play(true, this._currentBgm.pos);
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/* 播放 SE */
AudioManager.playSe = function(se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function(audio) {
            return audio.isPlaying();
        });
        var buffer = this.createBuffer('se', se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};

/* 更新 SE 的参数 */
AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};

/* 停止 SE */
AudioManager.stopSe = function() {
    this._seBuffers.forEach(function(buffer) {
        buffer.stop();
    });
    this._seBuffers = [];
};

/* 播放静态 SE */
AudioManager.playStaticSe = function(se) {
    if (se.name) {
        this.loadStaticSe(se);
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                buffer.play(false);
                break;
            }
        }
    }
};

/* 加载静态 SE */
AudioManager.loadStaticSe = function(se) {
    if (se.name && !this.isStaticSe(se)) {
        var buffer = this.createBuffer('se', se.name);
        buffer._reservedSeName = se.name;
        this._staticBuffers.push(buffer);
        if (this.shouldUseHtml5Audio()) {
            Html5Audio.setStaticSe(buffer._url);
        }
    }
};

/* 是否静态 SE */
AudioManager.isStaticSe = function(se) {
    for (var i = 0; i < this._staticBuffers.length; i++) {
        var buffer = this._staticBuffers[i];
        if (buffer._reservedSeName === se.name) {
            return true;
        }
    }
    return false;
};

/* 停止所有 */
AudioManager.stopAll = function() {
    this.stopMe();
    this.stopBgm();
    this.stopBgs();
    this.stopSe();
};

/* 保存 BGM */
AudioManager.saveBgm = function() {
    if (this._currentBgm) {
        var bgm = this._currentBgm;
        return {
            name: bgm.name,      // 名字 
            volume: bgm.volume,  // 音量 
            pitch: bgm.pitch,    // 音调 
            pan: bgm.pan,        // 声像
            pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0  // 缓冲区位置（播放的位置） 
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

/* 保存 BGS */
AudioManager.saveBgs = function() {
    if (this._currentBgs) {
        var bgs = this._currentBgs;
        return {
            name: bgs.name,      // 名字 
            volume: bgs.volume,  // 音量 
            pitch: bgs.pitch,    // 音调 
            pan: bgs.pan,        // 声像 
            pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0  // 缓冲区位置（播放的位置） 
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

/* 制作空音频对象 */
AudioManager.makeEmptyAudioObject = function() {
    return { name: '', volume: 0, pitch: 0 };
};

/* 创建缓冲区 */
AudioManager.createBuffer = function(folder, name) {
    var ext = this.audioFileExt();
    var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        if(this._blobUrl) Html5Audio.setup(this._blobUrl);
        else Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};

/* 更新缓冲区参数 */
AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};

/* 音频文件扩展名 */
AudioManager.audioFileExt = function() {
    if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
        return '.ogg';
    } else {
        return '.m4a';
    }
};

/* 是否应该使用 Html5Audio */
AudioManager.shouldUseHtml5Audio = function() {
    // 唯一需要 Html5Audio 的情况是 android/不加密
    // Atsuma-ru 要求强制 WebAudio 也在那里，所以全部只需返回 false 就可以了
    // The only case where we wanted html5audio was android/ no encrypt
    // Atsuma-ru asked to force webaudio there too, so just return false for ALL
    // return Utils.isAndroidChrome() && !Decrypter.hasEncryptedAudio;
    return false;
};

/* 检测错误 */
AudioManager.checkErrors = function() {
    this.checkWebAudioError(this._bgmBuffer);
    this.checkWebAudioError(this._bgsBuffer);
    this.checkWebAudioError(this._meBuffer);
    this._seBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
    this._staticBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
};

/* 检测 WebAudio 错误 */
AudioManager.checkWebAudioError = function(webAudio) {
    if (webAudio && webAudio.isError()) {
        throw new Error('Failed to load: ' + webAudio.url);
    }
};

//-----------------------------------------------------------------------------
// 声音管理器
// SoundManager
//
// 播放在数据库中定义的音效的静态类。
// The static class that plays sound effects defined in the database.

function SoundManager() {
    throw new Error('This is a static class');
}

/* 预加载重要声音 */
SoundManager.preloadImportantSounds = function() {
    this.loadSystemSound(0);
    this.loadSystemSound(1);
    this.loadSystemSound(2);
    this.loadSystemSound(3);
};

/* 加载系统声音 */
SoundManager.loadSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.loadStaticSe($dataSystem.sounds[n]);
    }
};

/* 播放系统声音 */
SoundManager.playSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.playStaticSe($dataSystem.sounds[n]);
    }
};

/* 播放光标音效 */
SoundManager.playCursor = function() {
    this.playSystemSound(0);
};

/* 播放确认音效 */
SoundManager.playOk = function() {
    this.playSystemSound(1);
};

/* 播放取消音效 */
SoundManager.playCancel = function() {
    this.playSystemSound(2);
};

/* 播放蜂鸣器音效 */
SoundManager.playBuzzer = function() {
    this.playSystemSound(3);
};

/* 播放装备音效 */
SoundManager.playEquip = function() {
    this.playSystemSound(4);
};

/* 播放保存音效 */
SoundManager.playSave = function() {
    this.playSystemSound(5);
};

/* 播放加载音效 */
SoundManager.playLoad = function() {
    this.playSystemSound(6);
};

/* 播放战斗开始音效 */
SoundManager.playBattleStart = function() {
    this.playSystemSound(7);
};

/* 播放逃跑音效 */
SoundManager.playEscape = function() {
    this.playSystemSound(8);
};

/* 播放敌人攻击音效 */
SoundManager.playEnemyAttack = function() {
    this.playSystemSound(9);
};

/* 播放敌人受到伤害音效 */
SoundManager.playEnemyDamage = function() {
    this.playSystemSound(10);
};

/* 播放敌人倒下音效 */
SoundManager.playEnemyCollapse = function() {
    this.playSystemSound(11);
};

/* 播放 Boss 倒下音效 1 */
SoundManager.playBossCollapse1 = function() {
    this.playSystemSound(12);
};

/* 播放 Boss 倒下音效 2 */
SoundManager.playBossCollapse2 = function() {
    this.playSystemSound(13);
};

/* 播放角色受到伤害音效 */
SoundManager.playActorDamage = function() {
    this.playSystemSound(14);
};

/* 播放角色倒下音效 */
SoundManager.playActorCollapse = function() {
    this.playSystemSound(15);
};

/* 播放恢复音效音效 */
SoundManager.playRecovery = function() {
    this.playSystemSound(16);
};

/* 播放未击中音效 */
SoundManager.playMiss = function() {
    this.playSystemSound(17);
};

/* 播放闪避音效 */
SoundManager.playEvasion = function() {
    this.playSystemSound(18);
};

/* 播放魔法闪避音效 */
SoundManager.playMagicEvasion = function() {
    this.playSystemSound(19);
};

/* 播放反射音效 */
SoundManager.playReflection = function() {
    this.playSystemSound(20);
};

/* 播放商店音效 */
SoundManager.playShop = function() {
    this.playSystemSound(21);
};

/* 播放使用物品音效 */
SoundManager.playUseItem = function() {
    this.playSystemSound(22);
};

/* 播放使用技能音效 */
SoundManager.playUseSkill = function() {
    this.playSystemSound(23);
};

//-----------------------------------------------------------------------------
// 文本管理器
// TextManager
//
// 操作用语和信息的静态类。
// The static class that handles terms and messages.

function TextManager() {
    throw new Error('This is a static class');
}

/* 基本状态 */
TextManager.basic = function(basicId) {
    return $dataSystem.terms.basic[basicId] || '';
};

/* 能力值 */
TextManager.param = function(paramId) {
    return $dataSystem.terms.params[paramId] || '';
};

/* 指令 */
TextManager.command = function(commandId) {
    return $dataSystem.terms.commands[commandId] || '';
};

/* 信息 */
TextManager.message = function(messageId) {
    return $dataSystem.terms.messages[messageId] || '';
};

/* 获取器 */
TextManager.getter = function(method, param) {
    return {
        get: function() {
            return this[method](param);
        },
        configurable: true
    };
};

/* 货币单位 */
Object.defineProperty(TextManager, 'currencyUnit', {
    get: function() { return $dataSystem.currencyUnit; },
    configurable: true
});

Object.defineProperties(TextManager, {
    level           : TextManager.getter('basic', 0),                     // 等级 
    levelA          : TextManager.getter('basic', 1),                     // 等级（缩写） 
    hp              : TextManager.getter('basic', 2),                     // HP 
    hpA             : TextManager.getter('basic', 3),                     // HP（缩写） 
    mp              : TextManager.getter('basic', 4),                     // MP 
    mpA             : TextManager.getter('basic', 5),                     // MP（缩写） 
    tp              : TextManager.getter('basic', 6),                     // TP 
    tpA             : TextManager.getter('basic', 7),                     // TP（缩写） 
    exp             : TextManager.getter('basic', 8),                     // 经验值 
    expA            : TextManager.getter('basic', 9),                     // 经验值（缩写） 
    fight           : TextManager.getter('command', 0),                   // 战斗 
    escape          : TextManager.getter('command', 1),                   // 逃跑 
    attack          : TextManager.getter('command', 2),                   // 攻击 
    guard           : TextManager.getter('command', 3),                   // 防御 
    item            : TextManager.getter('command', 4),                   // 物品 
    skill           : TextManager.getter('command', 5),                   // 技能 
    equip           : TextManager.getter('command', 6),                   // 装备 
    status          : TextManager.getter('command', 7),                   // 状态 
    formation       : TextManager.getter('command', 8),                   // 整队 
    save            : TextManager.getter('command', 9),                   // 保存 
    gameEnd         : TextManager.getter('command', 10),                  // 游戏结束 
    options         : TextManager.getter('command', 11),                  // 设置 
    weapon          : TextManager.getter('command', 12),                  // 武器 
    armor           : TextManager.getter('command', 13),                  // 护甲 
    keyItem         : TextManager.getter('command', 14),                  // 重要物品 
    equip2          : TextManager.getter('command', 15),                  // 装备 
    optimize        : TextManager.getter('command', 16),                  // 最强装备 
    clear           : TextManager.getter('command', 17),                  // 清空 
    newGame         : TextManager.getter('command', 18),                  // 开始游戏 
    continue_       : TextManager.getter('command', 19),                  // 继续游戏 
    toTitle         : TextManager.getter('command', 21),                  // 回到标题 
    cancel          : TextManager.getter('command', 22),                  // 取消 
    buy             : TextManager.getter('command', 24),                  // 购买 
    sell            : TextManager.getter('command', 25),                  // 出售 
    alwaysDash      : TextManager.getter('message', 'alwaysDash'),        // 始终跑步 
    commandRemember : TextManager.getter('message', 'commandRemember'),   // 记住指令 
    bgmVolume       : TextManager.getter('message', 'bgmVolume'),         // BGM 音量 
    bgsVolume       : TextManager.getter('message', 'bgsVolume'),         // BGS 音量 
    meVolume        : TextManager.getter('message', 'meVolume'),          // ME 音量 
    seVolume        : TextManager.getter('message', 'seVolume'),          // SE 音量 
    possession      : TextManager.getter('message', 'possession'),        // 持有数 
    expTotal        : TextManager.getter('message', 'expTotal'),          // 现在的经验值 
    expNext         : TextManager.getter('message', 'expNext'),           // 距离下一级还有 
    saveMessage     : TextManager.getter('message', 'saveMessage'),       // 存档信息 
    loadMessage     : TextManager.getter('message', 'loadMessage'),       // 读挡信息 
    file            : TextManager.getter('message', 'file'),              // 文件 
    partyName       : TextManager.getter('message', 'partyName'),         // 队伍名 
    emerge          : TextManager.getter('message', 'emerge'),            // 出现 
    preemptive      : TextManager.getter('message', 'preemptive'),        // 先发制人 
    surprise        : TextManager.getter('message', 'surprise'),          // 偷袭 
    escapeStart     : TextManager.getter('message', 'escapeStart'),       // 开始逃跑 
    escapeFailure   : TextManager.getter('message', 'escapeFailure'),     // 逃跑失败 
    victory         : TextManager.getter('message', 'victory'),           // 胜利 
    defeat          : TextManager.getter('message', 'defeat'),            // 战败 
    obtainExp       : TextManager.getter('message', 'obtainExp'),         // 获得经验值 
    obtainGold      : TextManager.getter('message', 'obtainGold'),        // 获得金钱 
    obtainItem      : TextManager.getter('message', 'obtainItem'),        // 获得物品 
    levelUp         : TextManager.getter('message', 'levelUp'),           // 升级 
    obtainSkill     : TextManager.getter('message', 'obtainSkill'),       // 学会技能 
    useItem         : TextManager.getter('message', 'useItem'),           // 使用物品 
    criticalToEnemy : TextManager.getter('message', 'criticalToEnemy'),   // 对敌人暴击 
    criticalToActor : TextManager.getter('message', 'criticalToActor'),   // 对角色暴击 
    actorDamage     : TextManager.getter('message', 'actorDamage'),       // 我方受伤 
    actorRecovery   : TextManager.getter('message', 'actorRecovery'),     // 我方恢复 
    actorGain       : TextManager.getter('message', 'actorGain'),         // 我方点数增加 
    actorLoss       : TextManager.getter('message', 'actorLoss'),         // 我方点数减少 
    actorDrain      : TextManager.getter('message', 'actorDrain'),        // 我方点数吸收 
    actorNoDamage   : TextManager.getter('message', 'actorNoDamage'),     // 我方无伤 
    actorNoHit      : TextManager.getter('message', 'actorNoHit'),        // 没有命中我方 
    enemyDamage     : TextManager.getter('message', 'enemyDamage'),       // 敌人受伤 
    enemyRecovery   : TextManager.getter('message', 'enemyRecovery'),     // 敌人恢复 
    enemyGain       : TextManager.getter('message', 'enemyGain'),         // 敌人点数增加 
    enemyLoss       : TextManager.getter('message', 'enemyLoss'),         // 敌人点数减少 
    enemyDrain      : TextManager.getter('message', 'enemyDrain'),        // 敌人点数吸收 
    enemyNoDamage   : TextManager.getter('message', 'enemyNoDamage'),     // 敌人无伤 
    enemyNoHit      : TextManager.getter('message', 'enemyNoHit'),        // 没有命中敌人 
    evasion         : TextManager.getter('message', 'evasion'),           // 回避 
    magicEvasion    : TextManager.getter('message', 'magicEvasion'),      // 魔法回避 
    magicReflection : TextManager.getter('message', 'magicReflection'),   // 魔法反射 
    counterAttack   : TextManager.getter('message', 'counterAttack'),     // 反击 
    substitute      : TextManager.getter('message', 'substitute'),        // 掩护 
    buffAdd         : TextManager.getter('message', 'buffAdd'),           // 强化 
    debuffAdd       : TextManager.getter('message', 'debuffAdd'),         // 弱化 
    buffRemove      : TextManager.getter('message', 'buffRemove'),        // 解除强化/弱化 
    actionFailure   : TextManager.getter('message', 'actionFailure'),     // 行动失败 
});

//-----------------------------------------------------------------------------
// 场景管理器
// SceneManager
//
// 管理场景切换的静态类。
// The static class that manages scene transitions.

function SceneManager() {
    throw new Error('This is a static class');
}

/*
 * 在 iOS Safari 之外以毫秒为单位获取当前时间。
 * Gets the current time in ms without on iOS Safari.
 * @private
 */
SceneManager._getTimeInMsWithoutMobileSafari = function() {
    return performance.now();
};

SceneManager._scene             = null;   // 当前场景 
SceneManager._nextScene         = null;   // 下一个场景 
SceneManager._stack             = [];     // 栈 
SceneManager._stopped           = false;  // 停止 
SceneManager._sceneStarted      = false;  // 场景开始 
SceneManager._exiting           = false;  // 退出 
SceneManager._previousClass     = null;   // 上一个场景类 
SceneManager._backgroundBitmap  = null;   // 背景位图 
SceneManager._screenWidth       = 816;    // 场景宽 
SceneManager._screenHeight      = 624;    // 场景高 
SceneManager._boxWidth          = 816;    // 盒宽（盒指的 CSS 的盒模型，这里相当于窗口显示区域）
SceneManager._boxHeight         = 624;    // 盒高 
SceneManager._deltaTime = 1.0 / 60.0;     // 增量时间（指多少秒一帧） 
if (!Utils.isMobileSafari()) SceneManager._currentTime = SceneManager._getTimeInMsWithoutMobileSafari();  // 当前时间（毫秒单位的 10 位时间戳）
SceneManager._accumulator = 0.0;          // 累加器（累加时间的）

/* 运行 */
SceneManager.run = function(sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};

/* 初始化 */
SceneManager.initialize = function() {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
};

/* 初始化图形 */
SceneManager.initGraphics = function() {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage('img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};

/* 较好的渲染器类型 */
SceneManager.preferableRendererType = function() {
    if (Utils.isOptionValid('canvas')) {
        return 'canvas';
    } else if (Utils.isOptionValid('webgl')) {
        return 'webgl';
    } else {
        return 'auto';
    }
};

/* 是否应该使用 Canvas 渲染 */
SceneManager.shouldUseCanvasRenderer = function() {
    return Utils.isMobileDevice();
};

/* 检测是否支持 WebGL */
SceneManager.checkWebGL = function() {
    if (!Graphics.hasWebGL()) {
        throw new Error('Your browser does not support WebGL.');
    }
};

/* 检测是否拥有文件访问权限 */
SceneManager.checkFileAccess = function() {
    if (!Utils.canReadGameFiles()) {
        throw new Error('Your browser does not allow to read local files.');
    }
};

/* 初始化音频 */
SceneManager.initAudio = function() {
    var noAudio = Utils.isOptionValid('noaudio');
    if (!WebAudio.initialize(noAudio) && !noAudio) {
        throw new Error('Your browser does not support Web Audio API.');
    }
};

/* 初始化输入 */
SceneManager.initInput = function() {
    Input.initialize();
    TouchInput.initialize();
};

/* 初始化 NW.js */
SceneManager.initNwjs = function() {
    if (Utils.isNwjs()) {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (process.platform === 'darwin' && !win.menu) {
            var menubar = new gui.Menu({ type: 'menubar' });
            var option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin('Game', option);
            win.menu = menubar;
        }
    }
};

/* 检测插件错误 */
SceneManager.checkPluginErrors = function() {
    PluginManager.checkErrors();
};

/* 设置错误处理者 */
SceneManager.setupErrorHandlers = function() {
    window.addEventListener('error', this.onError.bind(this)); // 监听错误事件 
    document.addEventListener('keydown', this.onKeyDown.bind(this));  // 监听按键按下事件 
};

/* 请求更新 */
SceneManager.requestUpdate = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
};

/* 更新 */
SceneManager.update = function() {
    try {
        this.tickStart();
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        this.updateManagers();
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

/* 结束 */
SceneManager.terminate = function() {
    window.close();
};

/* 当错误 */
SceneManager.onError = function(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        Graphics.printError('Error', e.message);
        AudioManager.stopAll();
    } catch (e2) {
    }
};

/* 当按键按下 
 * F5 刷新游戏，F8 显示开发者工具（调试模式下有效） 
 */
SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 116:   // F5
            if (Utils.isNwjs()) {
                location.reload();
            }
            break;
        case 119:   // F8
            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                require('nw.gui').Window.get().showDevTools();
            }
            break;
        }
    }
};

/* 捕捉异常 
 * 终止游戏，并在游戏界面里显示出错误日志。 
 */
SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};

/* tick 开始 
 * tick 为系统的相对时间单位，每执行一次 update 即为一次 tick。 
 */
SceneManager.tickStart = function() {
    Graphics.tickStart();
};

/* tick 结束 */
SceneManager.tickEnd = function() {
    Graphics.tickEnd();
};

/* 更新输入数据 */
SceneManager.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

/* 更新主函数 */
SceneManager.updateMain = function() {
    if (Utils.isMobileSafari()) {
        this.changeScene();
        this.updateScene();
    } else {
        var newTime = this._getTimeInMsWithoutMobileSafari();
        var fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) fTime = 0.25;
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
    }
    this.renderScene();
    this.requestUpdate();
};

/* 更新管理器 */
SceneManager.updateManagers = function() {
    ImageManager.update();
};

/* 切换场景 */
SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.terminate();
            this._scene.detachReservation();
            this._previousClass = this._scene.constructor;
        }
        this._scene = this._nextScene;
        if (this._scene) {
            this._scene.attachReservation();
            this._scene.create();
            this._nextScene = null;
            this._sceneStarted = false;
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

/* 更新场景 */
SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
        }
    }
};

/* 渲染场景 */
SceneManager.renderScene = function() {
    if (this.isCurrentSceneStarted()) {
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};

/* 当场景创建 */
SceneManager.onSceneCreate = function() {
    Graphics.startLoading();
};

/* 当场景开始 */
SceneManager.onSceneStart = function() {
    Graphics.endLoading();
};

/* 当场景加载中 */
SceneManager.onSceneLoading = function() {
    Graphics.updateLoading();
};

/* 是否场景切换中 */
SceneManager.isSceneChanging = function() {
    return this._exiting || !!this._nextScene;
};

/* 当前场景是否繁忙 */
SceneManager.isCurrentSceneBusy = function() {
    return this._scene && this._scene.isBusy();
};

/* 当前场景是否开始 */
SceneManager.isCurrentSceneStarted = function() {
    return this._scene && this._sceneStarted;
};

/* 是否下一个场景 */
SceneManager.isNextScene = function(sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
};

/* 是否上一个场景 */
SceneManager.isPreviousScene = function(sceneClass) {
    return this._previousClass === sceneClass;
};

/* 跳转 */
SceneManager.goto = function(sceneClass) {
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};

/* 往栈末尾添加元素 */
SceneManager.push = function(sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
};

/* 取出栈末尾的元素 */
SceneManager.pop = function() {
    if (this._stack.length > 0) {
        this.goto(this._stack.pop());
    } else {
        this.exit();
    }
};

/* 退出 */
SceneManager.exit = function() {
    this.goto(null);
    this._exiting = true;
};

/* 清空栈 */
SceneManager.clearStack = function() {
    this._stack = [];
};

/* 停止 */
SceneManager.stop = function() {
    this._stopped = true;
};

/* 准备下一个场景 */
SceneManager.prepareNextScene = function() {
    this._nextScene.prepare.apply(this._nextScene, arguments);
};

/* 快照 
 * 将场景绘制成位图。 
 */
SceneManager.snap = function() {
    return Bitmap.snap(this._scene);
};

/* 快照作为背景
 * 在切换场景的时候将当前场景绘制成图片作为背景。 
 */
SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();
    this._backgroundBitmap.blur();
};

/* 背景位图 */
SceneManager.backgroundBitmap = function() {
    return this._backgroundBitmap;
};

/* 继续 */
SceneManager.resume = function() {
    this._stopped = false;
    this.requestUpdate();
    if (!Utils.isMobileSafari()) {
        this._currentTime = this._getTimeInMsWithoutMobileSafari();
        this._accumulator = 0;
    }
};

//-----------------------------------------------------------------------------
// 战斗管理器
// BattleManager
//
// 管理战斗进程的静态类。
// The static class that manages battle progress.

function BattleManager() {
    throw new Error('This is a static class');
}

/* 设置
 * @param {Number} troopId 敌群 ID
 * @param {Boolean} canEscape 是否可以逃跑
 * @param {Boolean} canLose 是否可以失败
 */
BattleManager.setup = function(troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

/* 初始化成员 */
BattleManager.initMembers = function() {
    this._phase = 'init';              // 阶段 
    this._canEscape = false;           // 可以逃跑 
    this._canLose = false;             // 可以战败 
    this._battleTest = false;          // 战斗测试 
    this._eventCallback = null;        // 事件回调 
    this._preemptive = false;          // 先发制人 
    this._surprise = false;            // 偷袭 
    this._actorIndex = -1;             // 角色索引 
    this._actionForcedBattler = null;  // 强制行动战斗者 
    this._mapBgm = null;               // 地图 BGM 
    this._mapBgs = null;               // 地图 BGS 
    this._actionBattlers = [];         // 行动战斗者 
    this._subject = null;              // 主体 
    this._action = null;               // 行动 
    this._targets = [];                // 目标 
    this._logWindow = null;            // 日志窗口 
    this._statusWindow = null;         // 状态窗口 
    this._spriteset = null;            // 精灵组 
    this._escapeRatio = 0;             // 逃跑概率 
    this._escaped = false;             // 逃跑 
    this._rewards = {};                // 奖励 
    this._turnForced = false;          // 强制回合 
};

/* 是否战斗测试 */
BattleManager.isBattleTest = function() {
    return this._battleTest;
};

/* 设置战斗测试 */
BattleManager.setBattleTest = function(battleTest) {
    this._battleTest = battleTest;
};

/* 设置事件回调 */
BattleManager.setEventCallback = function(callback) {
    this._eventCallback = callback;
};

/* 设置日志窗口 */
BattleManager.setLogWindow = function(logWindow) {
    this._logWindow = logWindow;
};

/* 设置状态窗口 */
BattleManager.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

/* 设置精灵组 */
BattleManager.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

/* 当遇敌 */
BattleManager.onEncounter = function() {
    this._preemptive = (Math.random() < this.ratePreemptive());
    this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
};

/* 先发制人概率 */
BattleManager.ratePreemptive = function() {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

/* 偷袭概率 */
BattleManager.rateSurprise = function() {
    return $gameParty.rateSurprise($gameTroop.agility());
};

/* 保存 BGM 和 BGS */
BattleManager.saveBgmAndBgs = function() {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

/* 播放战斗 BGM */
BattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

/* 播放胜利 ME */
BattleManager.playVictoryMe = function() {
    AudioManager.playMe($gameSystem.victoryMe());
};

/* 播放失败 ME */
BattleManager.playDefeatMe = function() {
    AudioManager.playMe($gameSystem.defeatMe());
};

/* 还原战斗 BGM 和 BGS */
BattleManager.replayBgmAndBgs = function() {
    if (this._mapBgm) {
        AudioManager.replayBgm(this._mapBgm);
    } else {
        AudioManager.stopBgm();
    }
    if (this._mapBgs) {
        AudioManager.replayBgs(this._mapBgs);
    }
};

/* 制作逃跑概率 */
BattleManager.makeEscapeRatio = function() {
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};

/* 更新 */
BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start': // 开始 
            this.startInput();
            break;
        case 'turn': // 回合
            this.updateTurn();
            break;
        case 'action': // 行动 
            this.updateAction();
            break;
        case 'turnEnd': // 回合结束
            this.updateTurnEnd();
            break;
        case 'battleEnd': // 战斗结束
            this.updateBattleEnd();
            break;
        }
    }
};

/* 更新事件 */
BattleManager.updateEvent = function() {
    switch (this._phase) {
        case 'start': // 开始 
        case 'turn': // 回合 
        case 'turnEnd': // 回合结束
            if (this.isActionForced()) {
                this.processForcedAction();
                return true;
            } else {
                return this.updateEventMain();
            }
    }
    return this.checkAbort();
};

/* 更新事件主函数 */
BattleManager.updateEventMain = function() {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
        return true;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return true;
    }
    return false;
};

/* 是否繁忙 */
BattleManager.isBusy = function() {
    return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
};

/* 是否输入中 */
BattleManager.isInputting = function() {
    return this._phase === 'input';
};

/* 是否在回合中 */
BattleManager.isInTurn = function() {
    return this._phase === 'turn';
};

/* 是否回合结束 */
BattleManager.isTurnEnd = function() {
    return this._phase === 'turnEnd';
};

/* 是否终止 */
BattleManager.isAborting = function() {
    return this._phase === 'aborting';
};

/* 是否战斗结束 */
BattleManager.isBattleEnd = function() {
    return this._phase === 'battleEnd';
};

/* 能否逃跑 */
BattleManager.canEscape = function() {
    return this._canEscape;
};

/* 能否失败 */
BattleManager.canLose = function() {
    return this._canLose;
};

/* 是否逃跑 */
BattleManager.isEscaped = function() {
    return this._escaped;
};

/* 角色 */
BattleManager.actor = function() {
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};

/* 清除角色 */
BattleManager.clearActor = function() {
    this.changeActor(-1, '');
};

/* 切换角色 */
BattleManager.changeActor = function(newActorIndex, lastActorActionState) {
    var lastActor = this.actor();
    this._actorIndex = newActorIndex;
    var newActor = this.actor();
    if (lastActor) {
        lastActor.setActionState(lastActorActionState);
    }
    if (newActor) {
        newActor.setActionState('inputting');
    }
};

/* 开始战斗 */
BattleManager.startBattle = function() {
    this._phase = 'start';
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    this.displayStartMessages();
};

/* 显示开始信息 */
BattleManager.displayStartMessages = function() {
    $gameTroop.enemyNames().forEach(function(name) {
        $gameMessage.add(TextManager.emerge.format(name));
    });
    if (this._preemptive) {
        $gameMessage.add(TextManager.preemptive.format($gameParty.name()));
    } else if (this._surprise) {
        $gameMessage.add(TextManager.surprise.format($gameParty.name()));
    }
};

/* 开始输入 */
BattleManager.startInput = function() {
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

/* 输入行动 */
BattleManager.inputtingAction = function() {
    return this.actor() ? this.actor().inputtingAction() : null;
};

/* 选择下一个命令 */
BattleManager.selectNextCommand = function() {
    do {
        if (!this.actor() || !this.actor().selectNextCommand()) {
            this.changeActor(this._actorIndex + 1, 'waiting');
            if (this._actorIndex >= $gameParty.size()) {
                this.startTurn();
                break;
            }
        }
    } while (!this.actor().canInput());
};

/* 选择上一个命令 */
BattleManager.selectPreviousCommand = function() {
    do {
        if (!this.actor() || !this.actor().selectPreviousCommand()) {
            this.changeActor(this._actorIndex - 1, 'undecided');
            if (this._actorIndex < 0) {
                return;
            }
        }
    } while (!this.actor().canInput());
};

/* 刷新状态 */
BattleManager.refreshStatus = function() {
    this._statusWindow.refresh();
};

/* 开始回合 */
BattleManager.startTurn = function() {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

/* 更新回合 */
BattleManager.updateTurn = function() {
    $gameParty.requestMotionRefresh();
    if (!this._subject) {
        this._subject = this.getNextSubject();
    }
    if (this._subject) {
        this.processTurn();
    } else {
        this.endTurn();
    }
};

/* 处理回合 */
BattleManager.processTurn = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    if (action) {
        action.prepare();
        if (action.isValid()) {
            this.startAction();
        }
        subject.removeCurrentAction();
    } else {
        subject.onAllActionsEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(subject);
        this._logWindow.displayCurrentState(subject);
        this._logWindow.displayRegeneration(subject);
        this._subject = this.getNextSubject();
    }
};

/* 结束回合 */
BattleManager.endTurn = function() {
    this._phase = 'turnEnd';
    this._preemptive = false;
    this._surprise = false;
    this.allBattleMembers().forEach(function(battler) {
        battler.onTurnEnd();
        this.refreshStatus();
        this._logWindow.displayAutoAffectedStatus(battler);
        this._logWindow.displayRegeneration(battler);
    }, this);
    if (this.isForcedTurn()) {
        this._turnForced = false;
    }
};

/* 是否强制回合 */
BattleManager.isForcedTurn = function () {
    return this._turnForced;
};

/* 更新回合结束 */
BattleManager.updateTurnEnd = function() {
    this.startInput();
};

/* 获取下一个主体 */
BattleManager.getNextSubject = function() {
    for (;;) {
        var battler = this._actionBattlers.shift();
        if (!battler) {
            return null;
        }
        if (battler.isBattleMember() && battler.isAlive()) {
            return battler;
        }
    }
};

/* 所有战斗成员（我方+敌人） */
BattleManager.allBattleMembers = function() {
    return $gameParty.members().concat($gameTroop.members());
};

/* 制作行动次序 */
BattleManager.makeActionOrders = function() {
    var battlers = [];
    if (!this._surprise) {
        battlers = battlers.concat($gameParty.members());
    }
    if (!this._preemptive) {
        battlers = battlers.concat($gameTroop.members());
    }
    battlers.forEach(function(battler) {
        battler.makeSpeed();
    });
    battlers.sort(function(a, b) {
        return b.speed() - a.speed();
    });
    this._actionBattlers = battlers;
};

/* 开始行动 */
BattleManager.startAction = function() {
    var subject = this._subject;
    var action = subject.currentAction();
    var targets = action.makeTargets();
    this._phase = 'action';
    this._action = action;
    this._targets = targets;
    subject.useItem(action.item());
    this._action.applyGlobal();
    this.refreshStatus();
    this._logWindow.startAction(subject, action, targets);
};

/* 更新行动 */
BattleManager.updateAction = function() {
    var target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

/* 结束行动 */
BattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = 'turn';
};

/* 调用行动 */
BattleManager.invokeAction = function(subject, target) {
    this._logWindow.push('pushBaseLine');
    if (Math.random() < this._action.itemCnt(target)) {
        this.invokeCounterAttack(subject, target);
    } else if (Math.random() < this._action.itemMrf(target)) {
        this.invokeMagicReflection(subject, target);
    } else {
        this.invokeNormalAction(subject, target);
    }
    subject.setLastTarget(target);
    this._logWindow.push('popBaseLine');
    this.refreshStatus();
};

/* 调用普通行动 */
BattleManager.invokeNormalAction = function(subject, target) {
    var realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

/* 调用反击 */
BattleManager.invokeCounterAttack = function(subject, target) {
    var action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

/* 调用魔法反射 */
BattleManager.invokeMagicReflection = function(subject, target) {
	this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(target, subject);
};

/* 应用掩护 */
BattleManager.applySubstitute = function(target) {
    if (this.checkSubstitute(target)) {
        var substitute = target.friendsUnit().substituteBattler();
        if (substitute && target !== substitute) {
            this._logWindow.displaySubstitute(substitute, target);
            return substitute;
        }
    }
    return target;
};

/* 检测掩护 */
BattleManager.checkSubstitute = function(target) {
    return target.isDying() && !this._action.isCertainHit();
};

/* 是否强制行动 */
BattleManager.isActionForced = function() {
    return !!this._actionForcedBattler;
};

/* 强制行动 */
BattleManager.forceAction = function(battler) {
    this._actionForcedBattler = battler;
    var index = this._actionBattlers.indexOf(battler);
    if (index >= 0) {
        this._actionBattlers.splice(index, 1);
    }
};

/* 处理强制行动 */
BattleManager.processForcedAction = function() {
    if (this._actionForcedBattler) {
        this._turnForced = true;
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

/* 中止 */
BattleManager.abort = function() {
    this._phase = 'aborting';
};

/* 检测战斗结束 */
BattleManager.checkBattleEnd = function() {
    if (this._phase) {
        if (this.checkAbort()) {
            return true;
        } else if ($gameParty.isAllDead()) {
            this.processDefeat();
            return true;
        } else if ($gameTroop.isAllDead()) {
            this.processVictory();
            return true;
        }
    }
    return false;
};

/* 检测中止 */
BattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};

/* 处理胜利 */
BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    this.displayVictoryMessage();
    this.displayRewards();
    this.gainRewards();
    this.endBattle(0);
};

/* 处理逃跑 */
BattleManager.processEscape = function() {
    $gameParty.performEscape();
    SoundManager.playEscape();
    var success = this._preemptive ? true : (Math.random() < this._escapeRatio);
    if (success) {
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    } else {
        this.displayEscapeFailureMessage();
        this._escapeRatio += 0.1;
        $gameParty.clearActions();
        this.startTurn();
    }
    return success;
};

/* 处理中止 */
BattleManager.processAbort = function() {
    $gameParty.removeBattleStates();
    this.replayBgmAndBgs();
    this.endBattle(1);
};

/* 处理战败 */
BattleManager.processDefeat = function() {
    this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

/* 结束战斗 */
BattleManager.endBattle = function(result) {
    this._phase = 'battleEnd';
    if (this._eventCallback) {
        this._eventCallback(result);
    }
    if (result === 0) {
        $gameSystem.onBattleWin();
    } else if (this._escaped) {
        $gameSystem.onBattleEscape();
    }
};

/* 更新战斗结束 */
BattleManager.updateBattleEnd = function() {
    if (this.isBattleTest()) {
        AudioManager.stopBgm();
        SceneManager.exit();
    } else if (!this._escaped && $gameParty.isAllDead()) {
        if (this._canLose) {
            $gameParty.reviveBattleMembers();
            SceneManager.pop();
        } else {
            SceneManager.goto(Scene_Gameover);
        }
    } else {
        SceneManager.pop();
    }
    this._phase = null;
};

/* 制作奖励 */
BattleManager.makeRewards = function() {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};

/* 显示胜利信息 */
BattleManager.displayVictoryMessage = function() {
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

/* 显示战败信息 */
BattleManager.displayDefeatMessage = function() {
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};

/* 显示逃跑成功信息 */
BattleManager.displayEscapeSuccessMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};

/* 显示逃跑失败信息 */
BattleManager.displayEscapeFailureMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    $gameMessage.add('\\.' + TextManager.escapeFailure);
};

/* 显示奖励 */
BattleManager.displayRewards = function() {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

/* 显示经验 */
BattleManager.displayExp = function() {
    var exp = this._rewards.exp;
    if (exp > 0) {
        var text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add('\\.' + text);
    }
};

/* 显示金币 */
BattleManager.displayGold = function() {
    var gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
    }
};

/* 显示掉落物品 */
BattleManager.displayDropItems = function() {
    var items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function(item) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};

/* 获得奖励 */
BattleManager.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

/* 获得经验 */
BattleManager.gainExp = function() {
    var exp = this._rewards.exp;
    $gameParty.allMembers().forEach(function(actor) {
        actor.gainExp(exp);
    });
};

/* 获得金币 */
BattleManager.gainGold = function() {
    $gameParty.gainGold(this._rewards.gold);
};

/* 获得掉落物品 */
BattleManager.gainDropItems = function() {
    var items = this._rewards.items;
    items.forEach(function(item) {
        $gameParty.gainItem(item, 1);
    });
};

//-----------------------------------------------------------------------------
// 插件管理器
// PluginManager
//
// 管理插件的静态类。
// The static class that manages the plugins.

function PluginManager() {
    throw new Error('This is a static class');
}

PluginManager._path         = 'js/plugins/';  // 路径 
PluginManager._scripts      = [];             // 脚本 
PluginManager._errorUrls    = [];             // 错误链接 
PluginManager._parameters   = {};             // 参数 

/* 设置 */
PluginManager.setup = function(plugins) {
    plugins.forEach(function(plugin) {
        if (plugin.status && !this._scripts.contains(plugin.name)) {
            this.setParameters(plugin.name, plugin.parameters);
            this.loadScript(plugin.name + '.js');
            this._scripts.push(plugin.name);
        }
    }, this);
};

/* 检测错误 */
PluginManager.checkErrors = function() {
    var url = this._errorUrls.shift();
    if (url) {
        throw new Error('Failed to load: ' + url);
    }
};

/* 参数 */
PluginManager.parameters = function(name) {
    return this._parameters[name.toLowerCase()] || {};
};

/* 设置参数 */
PluginManager.setParameters = function(name, parameters) {
    this._parameters[name.toLowerCase()] = parameters;
};

/* 加载脚本 */
PluginManager.loadScript = function(name) {
    var url = this._path + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};

/* 当错误 */
PluginManager.onError = function(e) {
    this._errorUrls.push(e.target._url);
};
