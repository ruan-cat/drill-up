//=============================================================================
// Game_Enemy.js
//=============================================================================

//-----------------------------------------------------------------------------
/**
 * Game_Enemy
 * 敌人对象类
 * 
 * The game object class for an enemy.
 * 敌人的游戏对象类。
 */
//-----------------------------------------------------------------------------

/**
 * @class Game_Enemy
 * @extends Game_Battler
 * @description 敌人对象类，处理敌人的各种属性和行为
 * The game object class for an enemy, handles enemy properties and behaviors
 */
function Game_Enemy() {
    this.initialize.apply(this, arguments);
}

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

/**
 * 初始化敌人对象
 * Initialize the enemy object
 * 
 * @param {number} enemyId - 敌人ID / Enemy ID
 * @param {number} x - 屏幕X坐标 / Screen X coordinate
 * @param {number} y - 屏幕Y坐标 / Screen Y coordinate
 */
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
};

/**
 * 初始化成员变量
 * Initialize member variables
 */
Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = '';
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
};

/**
 * 设置敌人数据
 * Set up enemy data
 * 
 * @param {number} enemyId - 敌人ID / Enemy ID
 * @param {number} x - 屏幕X坐标 / Screen X coordinate
 * @param {number} y - 屏幕Y坐标 / Screen Y coordinate
 */
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this.recoverAll();
};

/**
 * 判断是否为敌人
 * Check if this is an enemy
 * 
 * @returns {boolean} 始终返回true / Always returns true
 */
Game_Enemy.prototype.isEnemy = function() {
    return true;
};

/**
 * 获取友方单位
 * Get the friends unit
 * 
 * @returns {Game_Troop} 敌方队伍对象 / Enemy troop object
 */
Game_Enemy.prototype.friendsUnit = function() {
    return $gameTroop;
};

/**
 * 获取敌对单位
 * Get the opponents unit
 * 
 * @returns {Game_Party} 我方队伍对象 / Player party object
 */
Game_Enemy.prototype.opponentsUnit = function() {
    return $gameParty;
};

/**
 * 获取敌人在队伍中的索引
 * Get the index of this enemy in the troop
 * 
 * @returns {number} 索引值 / Index value
 */
Game_Enemy.prototype.index = function() {
    return $gameTroop.members().indexOf(this);
};

/**
 * 判断是否为战斗成员
 * Check if this is a battle member
 * 
 * @returns {boolean} 是否为战斗成员 / Whether this is a battle member
 */
Game_Enemy.prototype.isBattleMember = function() {
    return this.index() >= 0;
};

/**
 * 获取敌人ID
 * Get the enemy ID
 * 
 * @returns {number} 敌人ID / Enemy ID
 */
Game_Enemy.prototype.enemyId = function() {
    return this._enemyId;
};

/**
 * 获取敌人数据对象
 * Get the enemy data object
 * 
 * @returns {object} 敌人数据对象 / Enemy data object
 */
Game_Enemy.prototype.enemy = function() {
    return $dataEnemies[this._enemyId];
};

/**
 * 获取特性对象列表
 * Get the trait objects list
 * 
 * @returns {Array} 特性对象数组 / Array of trait objects
 */
Game_Enemy.prototype.traitObjects = function() {
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

/**
 * 获取基础参数值
 * Get the base parameter value
 * 
 * @param {number} paramId - 参数ID / Parameter ID
 * @returns {number} 基础参数值 / Base parameter value
 */
Game_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

/**
 * 获取经验值
 * Get the experience points
 * 
 * @returns {number} 经验值 / Experience points
 */
Game_Enemy.prototype.exp = function() {
    return this.enemy().exp;
};

/**
 * 获取金币数
 * Get the gold amount
 * 
 * @returns {number} 金币数 / Gold amount
 */
Game_Enemy.prototype.gold = function() {
    return this.enemy().gold;
};

/**
 * 生成掉落物品
 * Generate drop items
 * 
 * @returns {Array} 掉落物品数组 / Array of drop items
 */
Game_Enemy.prototype.makeDropItems = function() {
    return this.enemy().dropItems.reduce(function(r, di) {
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }.bind(this), []);
};

/**
 * 获取掉落物品倍率
 * Get the drop item rate
 * 
 * @returns {number} 掉落倍率 / Drop rate multiplier
 */
Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

/**
 * 根据种类和ID获取物品对象
 * Get the item object by kind and data ID
 * 
 * @param {number} kind - 物品种类 / Item kind (1: item, 2: weapon, 3: armor)
 * @param {number} dataId - 数据ID / Data ID
 * @returns {object|null} 物品对象 / Item object or null
 */
Game_Enemy.prototype.itemObject = function(kind, dataId) {
    if (kind === 1) {
        return $dataItems[dataId];
    } else if (kind === 2) {
        return $dataWeapons[dataId];
    } else if (kind === 3) {
        return $dataArmors[dataId];
    } else {
        return null;
    }
};

/**
 * 判断精灵是否可见
 * Check if the sprite is visible
 * 
 * @returns {boolean} 始终返回true / Always returns true
 */
Game_Enemy.prototype.isSpriteVisible = function() {
    return true;
};

/**
 * 获取屏幕X坐标
 * Get the screen X coordinate
 * 
 * @returns {number} 屏幕X坐标 / Screen X coordinate
 */
Game_Enemy.prototype.screenX = function() {
    return this._screenX;
};

/**
 * 获取屏幕Y坐标
 * Get the screen Y coordinate
 * 
 * @returns {number} 屏幕Y坐标 / Screen Y coordinate
 */
Game_Enemy.prototype.screenY = function() {
    return this._screenY;
};

/**
 * 获取战斗图名称
 * Get the battler graphic name
 * 
 * @returns {string} 战斗图名称 / Battler graphic name
 */
Game_Enemy.prototype.battlerName = function() {
    return this.enemy().battlerName;
};

/**
 * 获取战斗图色调
 * Get the battler graphic hue
 * 
 * @returns {number} 战斗图色调 / Battler graphic hue
 */
Game_Enemy.prototype.battlerHue = function() {
    return this.enemy().battlerHue;
};

/**
 * 获取原始名称
 * Get the original name
 * 
 * @returns {string} 原始名称 / Original name
 */
Game_Enemy.prototype.originalName = function() {
    return this.enemy().name;
};

/**
 * 获取显示名称（包含字母后缀）
 * Get the display name (including letter suffix)
 * 
 * @returns {string} 显示名称 / Display name
 */
Game_Enemy.prototype.name = function() {
    return this.originalName() + (this._plural ? this._letter : '');
};

/**
 * 判断字母后缀是否为空
 * Check if the letter suffix is empty
 * 
 * @returns {boolean} 字母后缀是否为空 / Whether letter suffix is empty
 */
Game_Enemy.prototype.isLetterEmpty = function() {
    return this._letter === '';
};

/**
 * 设置字母后缀
 * Set the letter suffix
 * 
 * @param {string} letter - 字母后缀 / Letter suffix
 */
Game_Enemy.prototype.setLetter = function(letter) {
    this._letter = letter;
};

/**
 * 设置复数标志
 * Set the plural flag
 * 
 * @param {boolean} plural - 复数标志 / Plural flag
 */
Game_Enemy.prototype.setPlural = function(plural) {
    this._plural = plural;
};

/**
 * 执行动作开始表现
 * Perform action start animation
 * 
 * @param {Game_Action} action - 动作对象 / Action object
 */
Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect('whiten');
};

/**
 * 执行动作表现
 * Perform action animation
 * 
 * @param {Game_Action} action - 动作对象 / Action object
 */
Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

/**
 * 执行动作结束表现
 * Perform action end animation
 */
Game_Enemy.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

/**
 * 执行受伤表现
 * Perform damage animation
 */
Game_Enemy.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playEnemyDamage();
    this.requestEffect('blink');
};

/**
 * 执行倒下表现
 * Perform collapse animation
 */
Game_Enemy.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    switch (this.collapseType()) {
    case 0:
        this.requestEffect('collapse');
        SoundManager.playEnemyCollapse();
        break;
    case 1:
        this.requestEffect('bossCollapse');
        SoundManager.playBossCollapse1();
        break;
    case 2:
        this.requestEffect('instantCollapse');
        break;
    }
};

/**
 * 变身为其他敌人
 * Transform into another enemy
 * 
 * @param {number} enemyId - 目标敌人ID / Target enemy ID
 */
Game_Enemy.prototype.transform = function(enemyId) {
    var name = this.originalName();
    this._enemyId = enemyId;
    if (this.originalName() !== name) {
        this._letter = '';
        this._plural = false;
    }
    this.refresh();
    if (this.numActions() > 0) {
        this.makeActions();
    }
};

/**
 * 检查是否满足动作条件
 * Check if the action condition is met
 * 
 * @param {object} action - 动作对象 / Action object
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsCondition = function(action) {
    var param1 = action.conditionParam1;
    var param2 = action.conditionParam2;
    switch (action.conditionType) {
    case 1:
        return this.meetsTurnCondition(param1, param2);
    case 2:
        return this.meetsHpCondition(param1, param2);
    case 3:
        return this.meetsMpCondition(param1, param2);
    case 4:
        return this.meetsStateCondition(param1);
    case 5:
        return this.meetsPartyLevelCondition(param1);
    case 6:
        return this.meetsSwitchCondition(param1);
    default:
        return true;
    }
};

/**
 * 检查回合条件
 * Check turn condition
 * 
 * @param {number} param1 - 参数1 / Parameter 1
 * @param {number} param2 - 参数2 / Parameter 2
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    var n = $gameTroop.turnCount();
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

/**
 * 检查HP条件
 * Check HP condition
 * 
 * @param {number} param1 - HP最小比例 / Minimum HP ratio
 * @param {number} param2 - HP最大比例 / Maximum HP ratio
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsHpCondition = function(param1, param2) {
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

/**
 * 检查MP条件
 * Check MP condition
 * 
 * @param {number} param1 - MP最小比例 / Minimum MP ratio
 * @param {number} param2 - MP最大比例 / Maximum MP ratio
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

/**
 * 检查状态条件
 * Check state condition
 * 
 * @param {number} param - 状态ID / State ID
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsStateCondition = function(param) {
    return this.isStateAffected(param);
};

/**
 * 检查队伍等级条件
 * Check party level condition
 * 
 * @param {number} param - 等级要求 / Level requirement
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    return $gameParty.highestLevel() >= param;
};

/**
 * 检查开关条件
 * Check switch condition
 * 
 * @param {number} param - 开关ID / Switch ID
 * @returns {boolean} 是否满足条件 / Whether condition is met
 */
Game_Enemy.prototype.meetsSwitchCondition = function(param) {
    return $gameSwitches.value(param);
};

/**
 * 检查动作是否有效
 * Check if the action is valid
 * 
 * @param {object} action - 动作对象 / Action object
 * @returns {boolean} 动作是否有效 / Whether action is valid
 */
Game_Enemy.prototype.isActionValid = function(action) {
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

/**
 * 选择动作
 * Select an action
 * 
 * @param {Array} actionList - 动作列表 / Action list
 * @param {number} ratingZero - 评分基准 / Rating baseline
 * @returns {object|null} 选择的动作 / Selected action
 */
Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    var sum = actionList.reduce(function(r, a) {
        return r + a.rating - ratingZero;
    }, 0);
    if (sum > 0) {
        var value = Math.randomInt(sum);
        for (var i = 0; i < actionList.length; i++) {
            var action = actionList[i];
            value -= action.rating - ratingZero;
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};

/**
 * 选择所有动作
 * Select all actions
 * 
 * @param {Array} actionList - 动作列表 / Action list
 */
Game_Enemy.prototype.selectAllActions = function(actionList) {
    var ratingMax = Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
    var ratingZero = ratingMax - 3;
    actionList = actionList.filter(function(a) {
        return a.rating > ratingZero;
    });
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};

/**
 * 生成动作列表
 * Generate action list
 */
Game_Enemy.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        var actionList = this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
    this.setActionState('waiting');
};