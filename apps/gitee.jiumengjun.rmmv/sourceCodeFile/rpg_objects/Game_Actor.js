/**
 * @fileoverview Game_Actor - 游戏角色类
 * @description 游戏角色类，处理角色的属性、技能、装备和经验等
 * The game object class for an actor, handles character attributes, skills, equipment and experience
 * @author RPG Maker MV Development Team
 * @since RPG Maker MV 1.0.0
 */

//-----------------------------------------------------------------------------
// 游戏_角色
// Game_Actor
//
// 角色的游戏对象类。
// The game object class for an actor.

/**
 * Game_Actor - 游戏角色类
 * Game_Actor class - represents a player character in the game
 * 
 * @class Game_Actor
 * @constructor
 * @description 游戏角色类，继承自Game_Battler，用于处理玩家角色的所有功能
 * Game actor class, inherits from Game_Battler, handles all player character functionality
 */
function Game_Actor() {
    this.initialize.apply(this, arguments);
}

Game_Actor.prototype = Object.create(Game_Battler.prototype);
Game_Actor.prototype.constructor = Game_Actor;

/**
 * 等级属性
 * Level property
 * 
 * @memberof Game_Actor
 * @property {number} level - 角色等级 Character level
 * @description 角色的当前等级
 * The character's current level
 */
Object.defineProperty(Game_Actor.prototype, 'level', {
    get: function() {
        return this._level;
    },
    configurable: true
});

/**
 * 初始化
 * Initialize
 * 
 * @memberof Game_Actor
 * @method initialize
 * @param {number} actorId - 角色ID Actor ID
 * @description 初始化角色对象
 * Initialize the actor object
 */
Game_Actor.prototype.initialize = function(actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);
};

/**
 * 初始化成员
 * Initialize members
 * 
 * @memberof Game_Actor
 * @method initMembers
 * @description 初始化角色的成员变量
 * Initialize the actor's member variables
 */
Game_Actor.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._actorId = 0;
    this._name = '';
    this._nickname = '';
    this._classId = 0;
    this._level = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._faceName = '';
    this._faceIndex = 0;
    this._battlerName = '';
    this._exp = {};
    this._skills = [];
    this._equips = [];
    this._actionInputIndex = 0;
    this._lastMenuSkill = new Game_Item();
    this._lastBattleSkill  = new Game_Item();
    this._lastCommandSymbol = '';
};

/**
 * 设置
 * Setup
 * 
 * @memberof Game_Actor
 * @method setup
 * @param {number} actorId - 角色ID Actor ID
 * @description 设置角色的初始数据
 * Setup the actor's initial data
 */
Game_Actor.prototype.setup = function(actorId) {
    var actor = $dataActors[actorId];
    this._actorId = actorId;
    this._name = actor.name;
    this._nickname = actor.nickname;
    this._profile = actor.profile;
    this._classId = actor.classId;
    this._level = actor.initialLevel;
    this.initImages();
    this.initExp();
    this.initSkills();
    this.initEquips(actor.equips);
    this.clearParamPlus();
    this.recoverAll();
};

/**
 * 角色 ID
 * Actor ID
 * 
 * @memberof Game_Actor
 * @method actorId
 * @returns {number} 角色ID Actor ID
 * @description 获取角色ID
 * Get the actor ID
 */
Game_Actor.prototype.actorId = function() {
    return this._actorId;
};

/**
 * 角色
 * Actor
 * 
 * @memberof Game_Actor
 * @method actor
 * @returns {object} 角色数据对象 Actor data object
 * @description 获取角色数据对象
 * Get the actor data object
 */
Game_Actor.prototype.actor = function() {
    return $dataActors[this._actorId];
};

/**
 * 名称
 * Name
 * 
 * @memberof Game_Actor
 * @method name
 * @returns {string} 角色名称 Actor name
 * @description 获取角色名称
 * Get the actor's name
 */
Game_Actor.prototype.name = function() {
    return this._name;
};

/**
 * 设置名称
 * Set name
 * 
 * @memberof Game_Actor
 * @method setName
 * @param {string} name - 角色名称 Actor name
 * @description 设置角色名称
 * Set the actor's name
 */
Game_Actor.prototype.setName = function(name) {
    this._name = name;
};

/**
 * 昵称
 * Nickname
 * 
 * @memberof Game_Actor
 * @method nickname
 * @returns {string} 角色昵称 Actor nickname
 * @description 获取角色昵称
 * Get the actor's nickname
 */
Game_Actor.prototype.nickname = function() {
    return this._nickname;
};

/**
 * 设置昵称
 * Set nickname
 * 
 * @memberof Game_Actor
 * @method setNickname
 * @param {string} nickname - 角色昵称 Actor nickname
 * @description 设置角色昵称
 * Set the actor's nickname
 */
Game_Actor.prototype.setNickname = function(nickname) {
    this._nickname = nickname;
};

/**
 * 简介
 * Profile
 * 
 * @memberof Game_Actor
 * @method profile
 * @returns {string} 角色简介 Actor profile
 * @description 获取角色简介
 * Get the actor's profile
 */
Game_Actor.prototype.profile = function() {
    return this._profile;
};

/**
 * 设置简介
 * Set profile
 * 
 * @memberof Game_Actor
 * @method setProfile
 * @param {string} profile - 角色简介 Actor profile
 * @description 设置角色简介
 * Set the actor's profile
 */
Game_Actor.prototype.setProfile = function(profile) {
    this._profile = profile;
};

/**
 * 行走图名称
 * Character name
 * 
 * @memberof Game_Actor
 * @method characterName
 * @returns {string} 行走图文件名 Character sprite filename
 * @description 获取行走图文件名
 * Get the character sprite filename
 */
Game_Actor.prototype.characterName = function() {
    return this._characterName;
};

/**
 * 行走图索引
 * Character index
 * 
 * @memberof Game_Actor
 * @method characterIndex
 * @returns {number} 行走图索引 Character sprite index
 * @description 获取行走图在文件中的索引位置
 * Get the character sprite index in the file
 */
Game_Actor.prototype.characterIndex = function() {
    return this._characterIndex;
};

/**
 * 脸图名称
 * Face name
 * 
 * @memberof Game_Actor
 * @method faceName
 * @returns {string} 脸图文件名 Face image filename
 * @description 获取脸图文件名
 * Get the face image filename
 */
Game_Actor.prototype.faceName = function() {
    return this._faceName;
};

/**
 * 脸图索引
 * Face index
 * 
 * @memberof Game_Actor
 * @method faceIndex
 * @returns {number} 脸图索引 Face image index
 * @description 获取脸图在文件中的索引位置
 * Get the face image index in the file
 */
Game_Actor.prototype.faceIndex = function() {
    return this._faceIndex;
};

/**
 * 战斗图名称
 * Battler name
 * 
 * @memberof Game_Actor
 * @method battlerName
 * @returns {string} 战斗图文件名 Battler sprite filename
 * @description 获取战斗图文件名
 * Get the battler sprite filename
 */
Game_Actor.prototype.battlerName = function() {
    return this._battlerName;
};

/**
 * 清除状态数组
 * Clear states
 * 
 * @memberof Game_Actor
 * @method clearStates
 * @description 清除所有状态，包括状态步数
 * Clear all states, including state steps
 */
Game_Actor.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
};

/**
 * 消除状态
 * Erase state
 * 
 * @memberof Game_Actor
 * @method eraseState
 * @param {number} stateId - 状态ID State ID
 * @description 消除指定状态，包括状态步数
 * Erase the specified state, including state steps
 */
Game_Actor.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
};

/**
 * 重置状态计数
 * Reset state counts
 * 
 * @memberof Game_Actor
 * @method resetStateCounts
 * @param {number} stateId - 状态ID State ID
 * @description 重置状态计数，包括步数计数
 * Reset state counts, including step counts
 */
Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
};

/**
 * 初始化图像
 * Initialize images
 * 
 * @memberof Game_Actor
 * @method initImages
 * @description 初始化角色的图像设置
 * Initialize the actor's image settings
 */
Game_Actor.prototype.initImages = function() {
    var actor = this.actor();
    this._characterName = actor.characterName;
    this._characterIndex = actor.characterIndex;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
};

/**
 * 等级所对应的经验
 * Experience for level
 * 
 * @memberof Game_Actor
 * @method expForLevel
 * @param {number} level - 等级 Level
 * @returns {number} 该等级所需的总经验值 Total experience required for the level
 * @description 计算指定等级所需的总经验值
 * Calculate the total experience required for the specified level
 */
Game_Actor.prototype.expForLevel = function(level) {
    var c = this.currentClass();
    var basis = c.expParams[0];
    var extra = c.expParams[1];
    var acc_a = c.expParams[2];
    var acc_b = c.expParams[3];
    return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
            (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
};

/**
 * 初始化经验
 * Initialize experience
 * 
 * @memberof Game_Actor
 * @method initExp
 * @description 初始化角色的经验值
 * Initialize the actor's experience
 */
Game_Actor.prototype.initExp = function() {
    this._exp[this._classId] = this.currentLevelExp();
};

/**
 * 当前经验
 * Current experience
 * 
 * @memberof Game_Actor
 * @method currentExp
 * @returns {number} 当前经验值 Current experience value
 * @description 获取角色当前的经验值
 * Get the actor's current experience value
 */
Game_Actor.prototype.currentExp = function() {
    return this._exp[this._classId];
};

/**
 * 当前等级所对应的经验
 * Current level experience
 * 
 * @memberof Game_Actor
 * @method currentLevelExp
 * @returns {number} 当前等级的经验值 Experience value for current level
 * @description 获取当前等级所对应的经验值
 * Get the experience value for the current level
 */
Game_Actor.prototype.currentLevelExp = function() {
    return this.expForLevel(this._level);
};

/**
 * 下一个等级所对应的经验
 * Next level experience
 * 
 * @memberof Game_Actor
 * @method nextLevelExp
 * @returns {number} 下一等级的经验值 Experience value for next level
 * @description 获取下一等级所对应的经验值
 * Get the experience value for the next level
 */
Game_Actor.prototype.nextLevelExp = function() {
    return this.expForLevel(this._level + 1);
};

/**
 * 下一个等级所需经验
 * Next required experience
 * 
 * @memberof Game_Actor
 * @method nextRequiredExp
 * @returns {number} 升级所需经验 Experience required for next level
 * @description 获取升到下一等级还需要的经验
 * Get the experience required to reach the next level
 */
Game_Actor.prototype.nextRequiredExp = function() {
    return this.nextLevelExp() - this.currentExp();
};

/**
 * 最大等级
 * Max level
 * 
 * @memberof Game_Actor
 * @method maxLevel
 * @returns {number} 最大等级 Maximum level
 * @description 获取角色的最大等级
 * Get the actor's maximum level
 */
Game_Actor.prototype.maxLevel = function() {
    return this.actor().maxLevel;
};

/**
 * 是否最大等级
 * Is max level
 * 
 * @memberof Game_Actor
 * @method isMaxLevel
 * @returns {boolean} 是否达到最大等级 Whether at maximum level
 * @description 检查角色是否达到最大等级
 * Check if the actor is at maximum level
 */
Game_Actor.prototype.isMaxLevel = function() {
    return this._level >= this.maxLevel();
};

/**
 * 初始化技能
 * Initialize skills
 * 
 * @memberof Game_Actor
 * @method initSkills
 * @description 初始化角色的技能列表
 * Initialize the actor's skill list
 */
Game_Actor.prototype.initSkills = function() {
    this._skills = [];
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};

/**
 * 初始化装备
 * Initialize equipment
 * 
 * @memberof Game_Actor
 * @method initEquips
 * @param {Array} equips - 装备数组 Equipment array
 * @description 初始化角色的装备
 * Initialize the actor's equipment
 */
Game_Actor.prototype.initEquips = function(equips) {
    var slots = this.equipSlots();
    var maxSlots = slots.length;
    this._equips = [];
    for (var i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (var j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
    this.releaseUnequippableItems(true);
    this.refresh();
};

/**
 * 装备槽
 * Equipment slots
 * 
 * @memberof Game_Actor
 * @method equipSlots
 * @returns {Array} 装备槽类型数组 Equipment slot type array
 * @description 获取角色的装备槽配置
 * Get the actor's equipment slot configuration
 */
Game_Actor.prototype.equipSlots = function() {
    var slots = [];
    for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
        slots.push(i);
    }
    if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
    }
    return slots;
};

/**
 * 装备
 * Equipment
 * 
 * @memberof Game_Actor
 * @method equips
 * @returns {Array} 装备数组 Equipment array
 * @description 获取角色当前的装备列表
 * Get the actor's current equipment list
 */
Game_Actor.prototype.equips = function() {
    return this._equips.map(function(item) {
        return item.object();
    });
};

/**
 * 武器
 * Weapons
 * 
 * @memberof Game_Actor
 * @method weapons
 * @returns {Array} 武器数组 Weapon array
 * @description 获取角色装备的所有武器
 * Get all weapons equipped by the actor
 */
Game_Actor.prototype.weapons = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isWeapon(item);
    });
};

/**
 * 护甲
 * Armors
 * 
 * @memberof Game_Actor
 * @method armors
 * @returns {Array} 护甲数组 Armor array
 * @description 获取角色装备的所有护甲
 * Get all armors equipped by the actor
 */
Game_Actor.prototype.armors = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isArmor(item);
    });
};

/**
 * 是否有该武器
 * Has weapon
 * 
 * @memberof Game_Actor
 * @method hasWeapon
 * @param {object} weapon - 武器对象 Weapon object
 * @returns {boolean} 是否装备该武器 Whether the weapon is equipped
 * @description 检查角色是否装备了指定武器
 * Check if the actor has the specified weapon equipped
 */
Game_Actor.prototype.hasWeapon = function(weapon) {
    return this.weapons().contains(weapon);
};

/**
 * 是否有该护甲
 * Has armor
 * 
 * @memberof Game_Actor
 * @method hasArmor
 * @param {object} armor - 护甲对象 Armor object
 * @returns {boolean} 是否装备该护甲 Whether the armor is equipped
 * @description 检查角色是否装备了指定护甲
 * Check if the actor has the specified armor equipped
 */
Game_Actor.prototype.hasArmor = function(armor) {
    return this.armors().contains(armor);
};

/**
 * 该装备槽是否可以更换装备
 * Is equipment change OK
 * 
 * @memberof Game_Actor
 * @method isEquipChangeOk
 * @param {number} slotId - 装备槽ID Slot ID
 * @returns {boolean} 是否可以更换装备 Whether equipment can be changed
 * @description 检查指定装备槽是否可以更换装备
 * Check if equipment can be changed in the specified slot
 */
Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
};

/**
 * 更换装备
 * Change equipment
 * 
 * @memberof Game_Actor
 * @method changeEquip
 * @param {number} slotId - 装备槽ID Slot ID
 * @param {object} item - 装备物品 Equipment item
 * @description 更换指定槽位的装备
 * Change the equipment in the specified slot
 */
Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};

/**
 * 强制更换装备
 * Force change equipment
 * 
 * @memberof Game_Actor
 * @method forceChangeEquip
 * @param {number} slotId - 装备槽ID Slot ID
 * @param {object} item - 装备物品 Equipment item
 * @description 强制更换指定槽位的装备
 * Force change the equipment in the specified slot
 */
Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
    this._equips[slotId].setObject(item);
    this.releaseUnequippableItems(true);
    this.refresh();
};

/**
 * 队伍交换物品
 * Trade item with party
 * 
 * @memberof Game_Actor
 * @method tradeItemWithParty
 * @param {object} newItem - 新物品 New item
 * @param {object} oldItem - 旧物品 Old item
 * @returns {boolean} 是否成功交换 Whether trade was successful
 * @description 与队伍背包交换物品
 * Trade items with the party's inventory
 */
Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        $gameParty.gainItem(oldItem, 1);
        $gameParty.loseItem(newItem, 1);
        return true;
    }
};

/**
 * 通过 ID 更换装备
 * Change equipment by ID
 * 
 * @memberof Game_Actor
 * @method changeEquipById
 * @param {number} etypeId - 装备类型ID Equipment type ID
 * @param {number} itemId - 物品ID Item ID
 * @description 通过装备类型ID和物品ID更换装备
 * Change equipment by equipment type ID and item ID
 */
Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
    var slotId = etypeId - 1;
    if (this.equipSlots()[slotId] === 1) {
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};

/**
 * 是否装备
 * Is equipped
 * 
 * @memberof Game_Actor
 * @method isEquipped
 * @param {object} item - 装备物品 Equipment item
 * @returns {boolean} 是否装备该物品 Whether the item is equipped
 * @description 检查角色是否装备了指定物品
 * Check if the actor has the specified item equipped
 */
Game_Actor.prototype.isEquipped = function(item) {
    return this.equips().contains(item);
};

/**
 * 丢弃装备
 * Discard equipment
 * 
 * @memberof Game_Actor
 * @method discardEquip
 * @param {object} item - 装备物品 Equipment item
 * @description 丢弃指定的装备
 * Discard the specified equipment
 */
Game_Actor.prototype.discardEquip = function(item) {
    var slotId = this.equips().indexOf(item);
    if (slotId >= 0) {
        this._equips[slotId].setObject(null);
    }
};

/**
 * 解除不能装备的物品
 * Release unequippable items
 * 
 * @memberof Game_Actor
 * @method releaseUnequippableItems
 * @param {boolean} forcing - 是否强制 Whether forcing
 * @description 解除角色无法装备的物品
 * Release items that the actor cannot equip
 */
Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};

/**
 * 清空装备
 * Clear equipment
 * 
 * @memberof Game_Actor
 * @method clearEquipments
 * @description 清空所有可更换的装备
 * Clear all changeable equipment
 */
Game_Actor.prototype.clearEquipments = function() {
    var maxSlots = this.equipSlots().length;
    for (var i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, null);
        }
    }
};

/**
 * 最强装备
 * Optimize equipment
 * 
 * @memberof Game_Actor
 * @method optimizeEquipments
 * @description 自动装备最强的装备
 * Automatically equip the strongest equipment
 */
Game_Actor.prototype.optimizeEquipments = function() {
    var maxSlots = this.equipSlots().length;
    this.clearEquipments();
    for (var i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, this.bestEquipItem(i));
        }
    }
};

/**
 * 最强装备物品
 * Best equipment item
 * 
 * @memberof Game_Actor
 * @method bestEquipItem
 * @param {number} slotId - 装备槽ID Slot ID
 * @returns {object} 最强的装备物品 Best equipment item
 * @description 获取指定槽位的最强装备
 * Get the best equipment for the specified slot
 */
Game_Actor.prototype.bestEquipItem = function(slotId) {
    var etypeId = this.equipSlots()[slotId];
    var items = $gameParty.equipItems().filter(function(item) {
        return item.etypeId === etypeId && this.canEquip(item);
    }, this);
    var bestItem = null;
    var bestPerformance = -1000;
    for (var i = 0; i < items.length; i++) {
        var performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};

/**
 * 计算装备物品性能
 * Calculate equipment item performance
 * 
 * @memberof Game_Actor
 * @method calcEquipItemPerformance
 * @param {object} item - 装备物品 Equipment item
 * @returns {number} 装备性能值 Equipment performance value
 * @description 计算装备物品的性能值
 * Calculate the performance value of the equipment item
 */
Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    return item.params.reduce(function(a, b) {
        return a + b;
    });
};

/**
 * 是否该技能满足需要的武器类型
 * Is skill weapon type OK
 * 
 * @memberof Game_Actor
 * @method isSkillWtypeOk
 * @param {object} skill - 技能对象 Skill object
 * @returns {boolean} 是否满足武器类型要求 Whether weapon type requirements are met
 * @description 检查技能所需的武器类型是否满足
 * Check if the skill's weapon type requirements are met
 */
Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    var wtypeId1 = skill.requiredWtypeId1;
    var wtypeId2 = skill.requiredWtypeId2;
    if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
        return true;
    } else {
        return false;
    }
};

/**
 * 是否装备的武器类型
 * Is weapon type equipped
 * 
 * @memberof Game_Actor
 * @method isWtypeEquipped
 * @param {number} wtypeId - 武器类型ID Weapon type ID
 * @returns {boolean} 是否装备该武器类型 Whether the weapon type is equipped
 * @description 检查是否装备了指定类型的武器
 * Check if a weapon of the specified type is equipped
 */
Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(function(weapon) {
        return weapon.wtypeId === wtypeId;
    });
};

/**
 * 刷新
 * Refresh
 * 
 * @memberof Game_Actor
 * @method refresh
 * @description 刷新角色状态，检查装备有效性
 * Refresh the actor's state and check equipment validity
 */
Game_Actor.prototype.refresh = function() {
    this.releaseUnequippableItems(false);
    Game_Battler.prototype.refresh.call(this);
};

/**
 * 是否角色
 * Is actor
 * 
 * @memberof Game_Actor
 * @method isActor
 * @returns {boolean} 始终返回true Always returns true
 * @description 标识此对象是角色
 * Identifies this object as an actor
 */
Game_Actor.prototype.isActor = function() {
    return true;
};

/**
 * 我方单位
 * Friends unit
 * 
 * @memberof Game_Actor
 * @method friendsUnit
 * @returns {Game_Party} 队伍对象 Party object
 * @description 获取角色所属的我方单位（队伍）
 * Get the friends unit (party) the actor belongs to
 */
Game_Actor.prototype.friendsUnit = function() {
    return $gameParty;
};

/**
 * 敌方单位
 * Opponents unit
 * 
 * @memberof Game_Actor
 * @method opponentsUnit
 * @returns {Game_Troop} 敌群对象 Troop object
 * @description 获取敌方单位（敌群）
 * Get the opponents unit (troop)
 */
Game_Actor.prototype.opponentsUnit = function() {
    return $gameTroop;
};

/**
 * 索引
 * Index
 * 
 * @memberof Game_Actor
 * @method index
 * @returns {number} 在队伍中的索引 Index in the party
 * @description 获取角色在队伍中的索引位置
 * Get the actor's index position in the party
 */
Game_Actor.prototype.index = function() {
    return $gameParty.members().indexOf(this);
};

/**
 * 是否战斗成员
 * Is battle member
 * 
 * @memberof Game_Actor
 * @method isBattleMember
 * @returns {boolean} 是否是战斗成员 Whether is a battle member
 * @description 检查角色是否是战斗成员
 * Check if the actor is a battle member
 */
Game_Actor.prototype.isBattleMember = function() {
    return $gameParty.battleMembers().contains(this);
};

/**
 * 是否可以改变队形
 * Is formation change OK
 * 
 * @memberof Game_Actor
 * @method isFormationChangeOk
 * @returns {boolean} 是否可以改变队形 Whether formation can be changed
 * @description 检查角色是否可以改变队形
 * Check if the actor's formation can be changed
 */
Game_Actor.prototype.isFormationChangeOk = function() {
    return true;
};

/**
 * 当前职业
 * Current class
 * 
 * @memberof Game_Actor
 * @method currentClass
 * @returns {object} 职业数据对象 Class data object
 * @description 获取角色的当前职业
 * Get the actor's current class
 */
Game_Actor.prototype.currentClass = function() {
    return $dataClasses[this._classId];
};

/**
 * 是否是该职业
 * Is class
 * 
 * @memberof Game_Actor
 * @method isClass
 * @param {object} gameClass - 职业对象 Class object
 * @returns {boolean} 是否是该职业 Whether is the specified class
 * @description 检查角色是否是指定职业
 * Check if the actor is the specified class
 */
Game_Actor.prototype.isClass = function(gameClass) {
    return gameClass && this._classId === gameClass.id;
};

/**
 * 技能
 * Skills
 * 
 * @memberof Game_Actor
 * @method skills
 * @returns {Array} 技能列表 Skill list
 * @description 获取角色的所有技能
 * Get all of the actor's skills
 */
Game_Actor.prototype.skills = function() {
    var list = [];
    this._skills.concat(this.addedSkills()).forEach(function(id) {
        if (!list.contains($dataSkills[id])) {
            list.push($dataSkills[id]);
        }
    });
    return list;
};

/**
 * 可用的技能
 * Usable skills
 * 
 * @memberof Game_Actor
 * @method usableSkills
 * @returns {Array} 可用技能列表 Usable skill list
 * @description 获取角色可以使用的技能
 * Get the skills the actor can use
 */
Game_Actor.prototype.usableSkills = function() {
    return this.skills().filter(function(skill) {
        return this.canUse(skill);
    }, this);
};

/**
 * 特征对象
 * Trait objects
 * 
 * @memberof Game_Actor
 * @method traitObjects
 * @returns {Array} 特征对象数组 Trait object array
 * @description 获取提供特征的所有对象
 * Get all objects that provide traits
 */
Game_Actor.prototype.traitObjects = function() {
    var objects = Game_Battler.prototype.traitObjects.call(this);
    objects = objects.concat([this.actor(), this.currentClass()]);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            objects.push(item);
        }
    }
    return objects;
};

/**
 * 攻击时属性
 * Attack elements
 * 
 * @memberof Game_Actor
 * @method attackElements
 * @returns {Array} 攻击属性数组 Attack element array
 * @description 获取攻击时的属性
 * Get the elements for attacks
 */
Game_Actor.prototype.attackElements = function() {
    var set = Game_Battler.prototype.attackElements.call(this);
    if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
        set.push(this.bareHandsElementId());
    }
    return set;
};

/**
 * 是否没武器
 * Has no weapons
 * 
 * @memberof Game_Actor
 * @method hasNoWeapons
 * @returns {boolean} 是否没有武器 Whether has no weapons
 * @description 检查角色是否没有装备武器
 * Check if the actor has no weapons equipped
 */
Game_Actor.prototype.hasNoWeapons = function() {
    return this.weapons().length === 0;
};

/**
 * 空手属性 ID
 * Bare hands element ID
 * 
 * @memberof Game_Actor
 * @method bareHandsElementId
 * @returns {number} 空手属性ID Bare hands element ID
 * @description 获取空手攻击的属性ID
 * Get the element ID for bare-handed attacks
 */
Game_Actor.prototype.bareHandsElementId = function() {
    return 1;
};

/**
 * 能力值最大值
 * Parameter maximum
 * 
 * @memberof Game_Actor
 * @method paramMax
 * @param {number} paramId - 参数ID Parameter ID
 * @returns {number} 参数最大值 Parameter maximum value
 * @description 获取指定参数的最大值
 * Get the maximum value for the specified parameter
 */
Game_Actor.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 9999;    // MHP
    }
    return Game_Battler.prototype.paramMax.call(this, paramId);
};

/**
 * 基础能力值
 * Parameter base
 * 
 * @memberof Game_Actor
 * @method paramBase
 * @param {number} paramId - 参数ID Parameter ID
 * @returns {number} 基础参数值 Base parameter value
 * @description 获取指定参数的基础值
 * Get the base value for the specified parameter
 */
Game_Actor.prototype.paramBase = function(paramId) {
    return this.currentClass().params[paramId][this._level];
};

/**
 * 增加的能力值
 * Parameter plus
 * 
 * @memberof Game_Actor
 * @method paramPlus
 * @param {number} paramId - 参数ID Parameter ID
 * @returns {number} 增加的参数值 Added parameter value
 * @description 获取指定参数的增加值（包括装备）
 * Get the added value for the specified parameter (including equipment)
 */
Game_Actor.prototype.paramPlus = function(paramId) {
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            value += item.params[paramId];
        }
    }
    return value;
};

/**
 * 攻击动画 1 ID
 * Attack animation 1 ID
 * 
 * @memberof Game_Actor
 * @method attackAnimationId1
 * @returns {number} 攻击动画1的ID Attack animation 1 ID
 * @description 获取第一个武器的攻击动画ID
 * Get the attack animation ID for the first weapon
 */
Game_Actor.prototype.attackAnimationId1 = function() {
    if (this.hasNoWeapons()) {
        return this.bareHandsAnimationId();
    } else {
        var weapons = this.weapons();
        return weapons[0] ? weapons[0].animationId : 0;
    }
};

/**
 * 攻击动画 2 ID
 * Attack animation 2 ID
 * 
 * @memberof Game_Actor
 * @method attackAnimationId2
 * @returns {number} 攻击动画2的ID Attack animation 2 ID
 * @description 获取第二个武器的攻击动画ID
 * Get the attack animation ID for the second weapon
 */
Game_Actor.prototype.attackAnimationId2 = function() {
    var weapons = this.weapons();
    return weapons[1] ? weapons[1].animationId : 0;
};

/**
 * 空手动画 ID
 * Bare hands animation ID
 * 
 * @memberof Game_Actor
 * @method bareHandsAnimationId
 * @returns {number} 空手动画ID Bare hands animation ID
 * @description 获取空手攻击的动画ID
 * Get the animation ID for bare-handed attacks
 */
Game_Actor.prototype.bareHandsAnimationId = function() {
    return 1;
};

/**
 * 更改经验
 * Change experience
 * 
 * @memberof Game_Actor
 * @method changeExp
 * @param {number} exp - 经验值 Experience value
 * @param {boolean} show - 是否显示 Whether to show
 * @description 更改角色的经验值
 * Change the actor's experience
 */
Game_Actor.prototype.changeExp = function(exp, show) {
    this._exp[this._classId] = Math.max(exp, 0);
    var lastLevel = this._level;
    var lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
};

/**
 * 升级
 * Level up
 * 
 * @memberof Game_Actor
 * @method levelUp
 * @description 角色升级，学习新技能
 * Level up the actor and learn new skills
 */
Game_Actor.prototype.levelUp = function() {
    this._level++;
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level === this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};

/**
 * 降级
 * Level down
 * 
 * @memberof Game_Actor
 * @method levelDown
 * @description 角色降级
 * Level down the actor
 */
Game_Actor.prototype.levelDown = function() {
    this._level--;
};

/**
 * 寻找新技能
 * Find new skills
 * 
 * @memberof Game_Actor
 * @method findNewSkills
 * @param {Array} lastSkills - 上次的技能列表 Previous skill list
 * @returns {Array} 新技能列表 New skill list
 * @description 找出升级后新学的技能
 * Find skills learned after leveling up
 */
Game_Actor.prototype.findNewSkills = function(lastSkills) {
    var newSkills = this.skills();
    for (var i = 0; i < lastSkills.length; i++) {
        var index = newSkills.indexOf(lastSkills[i]);
        if (index >= 0) {
            newSkills.splice(index, 1);
        }
    }
    return newSkills;
};

/**
 * 显示升级
 * Display level up
 * 
 * @memberof Game_Actor
 * @method displayLevelUp
 * @param {Array} newSkills - 新技能列表 New skill list
 * @description 显示升级信息和新学的技能
 * Display level up information and newly learned skills
 */
Game_Actor.prototype.displayLevelUp = function(newSkills) {
    var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    $gameMessage.newPage();
    $gameMessage.add(text);
    newSkills.forEach(function(skill) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
};

/**
 * 获得经验
 * Gain experience
 * 
 * @memberof Game_Actor
 * @method gainExp
 * @param {number} exp - 经验值 Experience value
 * @description 获得指定数量的经验值
 * Gain the specified amount of experience
 */
Game_Actor.prototype.gainExp = function(exp) {
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};

/**
 * 最终经验比例
 * Final experience rate
 * 
 * @memberof Game_Actor
 * @method finalExpRate
 * @returns {number} 最终经验比例 Final experience rate
 * @description 获取最终的经验获得比例
 * Get the final experience gain rate
 */
Game_Actor.prototype.finalExpRate = function() {
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};

/**
 * 替补队友经验比例
 * Bench members experience rate
 * 
 * @memberof Game_Actor
 * @method benchMembersExpRate
 * @returns {number} 替补经验比例 Bench experience rate
 * @description 获取替补队员的经验比例
 * Get the experience rate for bench members
 */
Game_Actor.prototype.benchMembersExpRate = function() {
    return $dataSystem.optExtraExp ? 1 : 0;
};

/**
 * 是否应该显示升级
 * Should display level up
 * 
 * @memberof Game_Actor
 * @method shouldDisplayLevelUp
 * @returns {boolean} 是否应该显示升级 Whether should display level up
 * @description 检查是否应该显示升级信息
 * Check if level up should be displayed
 */
Game_Actor.prototype.shouldDisplayLevelUp = function() {
    return true;
};

/**
 * 更改等级
 * Change level
 * 
 * @memberof Game_Actor
 * @method changeLevel
 * @param {number} level - 等级 Level
 * @param {boolean} show - 是否显示 Whether to show
 * @description 直接更改角色等级
 * Directly change the actor's level
 */
Game_Actor.prototype.changeLevel = function(level, show) {
    level = level.clamp(1, this.maxLevel());
    this.changeExp(this.expForLevel(level), show);
};

/**
 * 学习技能
 * Learn skill
 * 
 * @memberof Game_Actor
 * @method learnSkill
 * @param {number} skillId - 技能ID Skill ID
 * @description 学习指定的技能
 * Learn the specified skill
 */
Game_Actor.prototype.learnSkill = function(skillId) {
    if (!this.isLearnedSkill(skillId)) {
        this._skills.push(skillId);
        this._skills.sort(function(a, b) {
            return a - b;
        });
    }
};

/**
 * 遗忘技能
 * Forget skill
 * 
 * @memberof Game_Actor
 * @method forgetSkill
 * @param {number} skillId - 技能ID Skill ID
 * @description 遗忘指定的技能
 * Forget the specified skill
 */
Game_Actor.prototype.forgetSkill = function(skillId) {
    var index = this._skills.indexOf(skillId);
    if (index >= 0) {
        this._skills.splice(index, 1);
    }
};

/**
 * 是否已学的技能（不包括数据库直接添加的技能）
 * Is learned skill (not including database-added skills)
 * 
 * @memberof Game_Actor
 * @method isLearnedSkill
 * @param {number} skillId - 技能ID Skill ID
 * @returns {boolean} 是否已学该技能 Whether the skill is learned
 * @description 检查是否已学习指定技能
 * Check if the specified skill is learned
 */
Game_Actor.prototype.isLearnedSkill = function(skillId) {
    return this._skills.contains(skillId);
};

/**
 * 是否有该技能
 * Has skill
 * 
 * @memberof Game_Actor
 * @method hasSkill
 * @param {number} skillId - 技能ID Skill ID
 * @returns {boolean} 是否有该技能 Whether has the skill
 * @description 检查是否拥有指定技能
 * Check if the actor has the specified skill
 */
Game_Actor.prototype.hasSkill = function(skillId) {
    return this.skills().contains($dataSkills[skillId]);
};

/**
 * 更改职业
 * Change class
 * 
 * @memberof Game_Actor
 * @method changeClass
 * @param {number} classId - 职业ID Class ID
 * @param {boolean} keepExp - 是否保留经验 Whether to keep experience
 * @description 更改角色的职业
 * Change the actor's class
 */
Game_Actor.prototype.changeClass = function(classId, keepExp) {
    if (keepExp) {
        this._exp[classId] = this.currentExp();
    }
    this._classId = classId;
    this.changeExp(this._exp[this._classId] || 0, false);
    this.refresh();
};

/**
 * 设置行走图图像
 * Set character image
 * 
 * @memberof Game_Actor
 * @method setCharacterImage
 * @param {string} characterName - 行走图文件名 Character filename
 * @param {number} characterIndex - 行走图索引 Character index
 * @description 设置角色的行走图
 * Set the actor's character sprite
 */
Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
    this._characterName = characterName;
    this._characterIndex = characterIndex;
};

/**
 * 设置脸图图像
 * Set face image
 * 
 * @memberof Game_Actor
 * @method setFaceImage
 * @param {string} faceName - 脸图文件名 Face filename
 * @param {number} faceIndex - 脸图索引 Face index
 * @description 设置角色的脸图
 * Set the actor's face image
 */
Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

/**
 * 设置战斗图图像
 * Set battler image
 * 
 * @memberof Game_Actor
 * @method setBattlerImage
 * @param {string} battlerName - 战斗图文件名 Battler filename
 * @description 设置角色的战斗图
 * Set the actor's battler sprite
 */
Game_Actor.prototype.setBattlerImage = function(battlerName) {
    this._battlerName = battlerName;
};

/**
 * 精灵是否可见
 * Is sprite visible
 * 
 * @memberof Game_Actor
 * @method isSpriteVisible
 * @returns {boolean} 精灵是否可见 Whether sprite is visible
 * @description 检查角色精灵是否可见（侧视图战斗模式下）
 * Check if the actor sprite is visible (in side-view battle mode)
 */
Game_Actor.prototype.isSpriteVisible = function() {
    return $gameSystem.isSideView();
};

/**
 * 开始动画
 * Start animation
 * 
 * @memberof Game_Actor
 * @method startAnimation
 * @param {number} animationId - 动画ID Animation ID
 * @param {boolean} mirror - 是否镜像 Whether to mirror
 * @param {number} delay - 延迟时间 Delay time
 * @description 开始播放动画（角色版本会反转镜像）
 * Start animation (actor version reverses mirror)
 */
Game_Actor.prototype.startAnimation = function(animationId, mirror, delay) {
    mirror = !mirror;
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay);
};

/**
 * 表现行动开始
 * Perform action start
 * 
 * @memberof Game_Actor
 * @method performActionStart
 * @param {Game_Action} action - 行动对象 Action object
 * @description 表现行动开始的效果
 * Perform the effects of action start
 */
Game_Actor.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
};

/**
 * 表现行动
 * Perform action
 * 
 * @memberof Game_Actor
 * @method performAction
 * @param {Game_Action} action - 行动对象 Action object
 * @description 表现行动的效果
 * Perform the effects of the action
 */
Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion('guard');
    } else if (action.isMagicSkill()) {
        this.requestMotion('spell');
    } else if (action.isSkill()) {
        this.requestMotion('skill');
    } else if (action.isItem()) {
        this.requestMotion('item');
    }
};

/**
 * 表现行动结束
 * Perform action end
 * 
 * @memberof Game_Actor
 * @method performActionEnd
 * @description 表现行动结束的效果
 * Perform the effects of action end
 */
Game_Actor.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

/**
 * 表现攻击
 * Perform attack
 * 
 * @memberof Game_Actor
 * @method performAttack
 * @description 表现攻击动作
 * Perform the attack motion
 */
Game_Actor.prototype.performAttack = function() {
    var weapons = this.weapons();
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion('thrust');
        } else if (attackMotion.type === 1) {
            this.requestMotion('swing');
        } else if (attackMotion.type === 2) {
            this.requestMotion('missile');
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};

/**
 * 表现伤害
 * Perform damage
 * 
 * @memberof Game_Actor
 * @method performDamage
 * @description 表现受到伤害的效果
 * Perform the effects of taking damage
 */
Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};

/**
 * 表现闪避
 * Perform evasion
 * 
 * @memberof Game_Actor
 * @method performEvasion
 * @description 表现闪避的效果
 * Perform the effects of evasion
 */
Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    this.requestMotion('evade');
};

/**
 * 表现魔法闪避
 * Perform magic evasion
 * 
 * @memberof Game_Actor
 * @method performMagicEvasion
 * @description 表现魔法闪避的效果
 * Perform the effects of magic evasion
 */
Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    this.requestMotion('evade');
};

/**
 * 表现反击
 * Perform counter
 * 
 * @memberof Game_Actor
 * @method performCounter
 * @description 表现反击的效果
 * Perform the effects of counter attack
 */
Game_Actor.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};

/**
 * 表现倒下（死亡后的消失效果）
 * Perform collapse (disappearance effect after death)
 * 
 * @memberof Game_Actor
 * @method performCollapse
 * @description 表现倒下的效果
 * Perform the effects of collapse
 */
Game_Actor.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    if ($gameParty.inBattle()) {
        SoundManager.playActorCollapse();
    }
};

/**
 * 表现胜利
 * Perform victory
 * 
 * @memberof Game_Actor
 * @method performVictory
 * @description 表现胜利动作
 * Perform the victory motion
 */
Game_Actor.prototype.performVictory = function() {
    if (this.canMove()) {
        this.requestMotion('victory');
    }
};

/**
 * 表现逃跑
 * Perform escape
 * 
 * @memberof Game_Actor
 * @method performEscape
 * @description 表现逃跑动作
 * Perform the escape motion
 */
Game_Actor.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion('escape');
    }
};

/**
 * 制作行动列表
 * Make action list
 * 
 * @memberof Game_Actor
 * @method makeActionList
 * @returns {Array} 行动列表 Action list
 * @description 制作可用的行动列表
 * Create a list of available actions
 */
Game_Actor.prototype.makeActionList = function() {
    var list = [];
    var action = new Game_Action(this);
    action.setAttack();
    list.push(action);
    this.usableSkills().forEach(function(skill) {
        action = new Game_Action(this);
        action.setSkill(skill.id);
        list.push(action);
    }, this);
    return list;
};

/**
 * 制作自动战斗行动
 * Make auto battle actions
 * 
 * @memberof Game_Actor
 * @method makeAutoBattleActions
 * @description 制作自动战斗时的行动
 * Create actions for auto battle
 */
Game_Actor.prototype.makeAutoBattleActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        var list = this.makeActionList();
        var maxValue = Number.MIN_VALUE;
        for (var j = 0; j < list.length; j++) {
            var value = list[j].evaluate();
            if (value > maxValue) {
                maxValue = value;
                this.setAction(i, list[j]);
            }
        }
    }
    this.setActionState('waiting');
};

/**
 * 制作混乱行动
 * Make confusion actions
 * 
 * @memberof Game_Actor
 * @method makeConfusionActions
 * @description 制作混乱状态时的行动
 * Create actions when confused
 */
Game_Actor.prototype.makeConfusionActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setConfusion();
    }
    this.setActionState('waiting');
};

/**
 * 制作行动
 * Make actions
 * 
 * @memberof Game_Actor
 * @method makeActions
 * @description 制作战斗行动
 * Create battle actions
 */
Game_Actor.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        this.setActionState('undecided');
    } else {
        this.setActionState('waiting');
    }
    if (this.isAutoBattle()) {
        this.makeAutoBattleActions();
    } else if (this.isConfused()) {
        this.makeConfusionActions();
    }
};

/**
 * 当玩家行走
 * On player walk
 * 
 * @memberof Game_Actor
 * @method onPlayerWalk
 * @description 玩家行走时的处理
 * Handle when player walks
 */
Game_Actor.prototype.onPlayerWalk = function() {
    this.clearResult();
    this.checkFloorEffect();
    if ($gamePlayer.isNormal()) {
        this.turnEndOnMap();
        this.states().forEach(function(state) {
            this.updateStateSteps(state);
        }, this);
        this.showAddedStates();
        this.showRemovedStates();
    }
};

/**
 * 更新状态步数
 * Update state steps
 * 
 * @memberof Game_Actor
 * @method updateStateSteps
 * @param {object} state - 状态对象 State object
 * @description 更新状态的步数计数
 * Update the step count for the state
 */
Game_Actor.prototype.updateStateSteps = function(state) {
    if (state.removeByWalking) {
        if (this._stateSteps[state.id] > 0) {
            if (--this._stateSteps[state.id] === 0) {
                this.removeState(state.id);
            }
        }
    }
};

/**
 * 显示附加的状态
 * Show added states
 * 
 * @memberof Game_Actor
 * @method showAddedStates
 * @description 显示新增加的状态消息
 * Show messages for newly added states
 */
Game_Actor.prototype.showAddedStates = function() {
    this.result().addedStateObjects().forEach(function(state) {
        if (state.message1) {
            $gameMessage.add(this._name + state.message1);
        }
    }, this);
};

/**
 * 显示解除的状态
 * Show removed states
 * 
 * @memberof Game_Actor
 * @method showRemovedStates
 * @description 显示解除的状态消息
 * Show messages for removed states
 */
Game_Actor.prototype.showRemovedStates = function() {
    this.result().removedStateObjects().forEach(function(state) {
        if (state.message4) {
            $gameMessage.add(this._name + state.message4);
        }
    }, this);
};

/**
 * 回合的步数
 * Steps for turn
 * 
 * @memberof Game_Actor
 * @method stepsForTurn
 * @returns {number} 一回合的步数 Steps per turn
 * @description 获取一个回合需要的步数
 * Get the number of steps per turn
 */
Game_Actor.prototype.stepsForTurn = function() {
    return 20;
};

/**
 * 地图上回合结束
 * Turn end on map
 * 
 * @memberof Game_Actor
 * @method turnEndOnMap
 * @description 在地图上的回合结束处理
 * Handle turn end on the map
 */
Game_Actor.prototype.turnEndOnMap = function() {
    if ($gameParty.steps() % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        if (this.result().hpDamage > 0) {
            this.performMapDamage();
        }
    }
};

/**
 * 检测地形效果
 * Check floor effect
 * 
 * @memberof Game_Actor
 * @method checkFloorEffect
 * @description 检测并执行地形效果
 * Check and execute floor effects
 */
Game_Actor.prototype.checkFloorEffect = function() {
    if ($gamePlayer.isOnDamageFloor()) {
        this.executeFloorDamage();
    }
};

/**
 * 执行地形伤害
 * Execute floor damage
 * 
 * @memberof Game_Actor
 * @method executeFloorDamage
 * @description 执行地形伤害
 * Execute damage from floor terrain
 */
Game_Actor.prototype.executeFloorDamage = function() {
    var damage = Math.floor(this.basicFloorDamage() * this.fdr);
    damage = Math.min(damage, this.maxFloorDamage());
    this.gainHp(-damage);
    if (damage > 0) {
        this.performMapDamage();
    }
};

/**
 * 基础地形伤害
 * Basic floor damage
 * 
 * @memberof Game_Actor
 * @method basicFloorDamage
 * @returns {number} 基础地形伤害 Basic floor damage
 * @description 获取基础地形伤害值
 * Get the basic floor damage value
 */
Game_Actor.prototype.basicFloorDamage = function() {
    return 10;
};

/**
 * 最高地形伤害
 * Max floor damage
 * 
 * @memberof Game_Actor
 * @method maxFloorDamage
 * @returns {number} 最高地形伤害 Maximum floor damage
 * @description 获取最高地形伤害值
 * Get the maximum floor damage value
 */
Game_Actor.prototype.maxFloorDamage = function() {
    return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
};

/**
 * 表现地图伤害
 * Perform map damage
 * 
 * @memberof Game_Actor
 * @method performMapDamage
 * @description 表现地图上受到伤害的效果
 * Perform the effects of taking damage on the map
 */
Game_Actor.prototype.performMapDamage = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.startFlashForDamage();
    }
};

/**
 * 清除行动
 * Clear actions
 * 
 * @memberof Game_Actor
 * @method clearActions
 * @description 清除所有行动并重置输入索引
 * Clear all actions and reset input index
 */
Game_Actor.prototype.clearActions = function() {
    Game_Battler.prototype.clearActions.call(this);
    this._actionInputIndex = 0;
};

/**
 * 行动输入中
 * Inputting action
 * 
 * @memberof Game_Actor
 * @method inputtingAction
 * @returns {Game_Action} 当前输入的行动 Currently inputting action
 * @description 获取当前正在输入的行动
 * Get the action currently being input
 */
Game_Actor.prototype.inputtingAction = function() {
    return this.action(this._actionInputIndex);
};

/**
 * 选择下一个指令
 * Select next command
 * 
 * @memberof Game_Actor
 * @method selectNextCommand
 * @returns {boolean} 是否成功选择 Whether selection was successful
 * @description 选择下一个指令
 * Select the next command
 */
Game_Actor.prototype.selectNextCommand = function() {
    if (this._actionInputIndex < this.numActions() - 1) {
        this._actionInputIndex++;
        return true;
    } else {
        return false;
    }
};

/**
 * 选择先前的指令
 * Select previous command
 * 
 * @memberof Game_Actor
 * @method selectPreviousCommand
 * @returns {boolean} 是否成功选择 Whether selection was successful
 * @description 选择先前的指令
 * Select the previous command
 */
Game_Actor.prototype.selectPreviousCommand = function() {
    if (this._actionInputIndex > 0) {
        this._actionInputIndex--;
        return true;
    } else {
        return false;
    }
};

/**
 * 上个菜单技能
 * Last menu skill
 * 
 * @memberof Game_Actor
 * @method lastMenuSkill
 * @returns {object} 上个菜单技能 Last menu skill
 * @description 获取上次在菜单中使用的技能
 * Get the last skill used in menu
 */
Game_Actor.prototype.lastMenuSkill = function() {
    return this._lastMenuSkill.object();
};

/**
 * 设置上个菜单技能
 * Set last menu skill
 * 
 * @memberof Game_Actor
 * @method setLastMenuSkill
 * @param {object} skill - 技能对象 Skill object
 * @description 设置上次在菜单中使用的技能
 * Set the last skill used in menu
 */
Game_Actor.prototype.setLastMenuSkill = function(skill) {
    this._lastMenuSkill.setObject(skill);
};

/**
 * 上个战斗技能
 * Last battle skill
 * 
 * @memberof Game_Actor
 * @method lastBattleSkill
 * @returns {object} 上个战斗技能 Last battle skill
 * @description 获取上次在战斗中使用的技能
 * Get the last skill used in battle
 */
Game_Actor.prototype.lastBattleSkill = function() {
    return this._lastBattleSkill.object();
};

/**
 * 设置上个战斗技能
 * Set last battle skill
 * 
 * @memberof Game_Actor
 * @method setLastBattleSkill
 * @param {object} skill - 技能对象 Skill object
 * @description 设置上次在战斗中使用的技能
 * Set the last skill used in battle
 */
Game_Actor.prototype.setLastBattleSkill = function(skill) {
    this._lastBattleSkill.setObject(skill);
};

/**
 * 上个指令标识
 * Last command symbol
 * 
 * @memberof Game_Actor
 * @method lastCommandSymbol
 * @returns {string} 上个指令标识 Last command symbol
 * @description 获取上次使用的指令标识
 * Get the last command symbol used
 */
Game_Actor.prototype.lastCommandSymbol = function() {
    return this._lastCommandSymbol;
};

/**
 * 设置上个指令标识
 * Set last command symbol
 * 
 * @memberof Game_Actor
 * @method setLastCommandSymbol
 * @param {string} symbol - 指令标识 Command symbol
 * @description 设置上次使用的指令标识
 * Set the last command symbol used
 */
Game_Actor.prototype.setLastCommandSymbol = function(symbol) {
    this._lastCommandSymbol = symbol;
};

/**
 * 检验逃跑
 * Test escape
 * 
 * @memberof Game_Actor
 * @method testEscape
 * @param {object} item - 物品对象 Item object
 * @returns {boolean} 是否有逃跑效果 Whether has escape effect
 * @description 检验物品是否有逃跑效果
 * Test if the item has escape effect
 */
Game_Actor.prototype.testEscape = function(item) {
    return item.effects.some(function(effect, index, ar) {
        return effect && effect.code === Game_Action.EFFECT_SPECIAL;
    });
};

/**
 * 是否符合可用物品条件
 * Meets usable item conditions
 * 
 * @memberof Game_Actor
 * @method meetsUsableItemConditions
 * @param {object} item - 物品对象 Item object
 * @returns {boolean} 是否符合条件 Whether conditions are met
 * @description 检查是否符合使用物品的条件
 * Check if the conditions for using the item are met
 */
Game_Actor.prototype.meetsUsableItemConditions = function(item) {
    if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
        return false;
    }
    return Game_BattlerBase.prototype.meetsUsableItemConditions.call(this, item);
};