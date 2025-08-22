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
