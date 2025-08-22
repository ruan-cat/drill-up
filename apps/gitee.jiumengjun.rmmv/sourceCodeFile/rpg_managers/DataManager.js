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