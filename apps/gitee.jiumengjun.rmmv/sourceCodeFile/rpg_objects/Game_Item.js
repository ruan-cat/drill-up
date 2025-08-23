/**
 * @fileoverview Game_Item - 项目对象类
 * 
 * 处理技能、物品、武器和护甲的游戏对象类。这是必须的，因为保存数据不应包含数据库对象本身。
 * The game object class for handling skills, items, weapons, and armor. It is
 * required because save data should not include the database object itself.
 * 
 * PS：Item 指代很多，翻译的时候把仅包含物品（Item）、武器和护甲的 Item 称为物品（有
 * 的 Item 不含武器和护甲），包含技能或者其他（如指令窗口的选项）的 Item 翻译为项目。
 * 
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 项目对象类
 * Game item class
 * 
 * @class Game_Item
 * @constructor
 */
function Game_Item() {
    this.initialize.apply(this, arguments);
}

/**
 * 初始化项目对象
 * Initialize item object
 * 
 * @memberof Game_Item
 * @method initialize
 * @param {Object} item - 项目数据对象 - Item data object
 */
Game_Item.prototype.initialize = function(item) {
    this._dataClass = '';
    this._itemId = 0;
    if (item) {
        this.setObject(item);
    }
};

/**
 * 是否是技能
 * Check if it is a skill
 * 
 * @memberof Game_Item
 * @method isSkill
 * @returns {Boolean} 是否为技能 - Whether it is a skill
 */
Game_Item.prototype.isSkill = function() {
    return this._dataClass === 'skill';
};

/**
 * 是否是物品
 * Check if it is an item
 * 
 * @memberof Game_Item
 * @method isItem
 * @returns {Boolean} 是否为物品 - Whether it is an item
 */
Game_Item.prototype.isItem = function() {
    return this._dataClass === 'item';
};

/**
 * 是否是可使用的项目
 * Check if it is a usable item
 * 
 * @memberof Game_Item
 * @method isUsableItem
 * @returns {Boolean} 是否为可使用项目 - Whether it is a usable item
 */
Game_Item.prototype.isUsableItem = function() {
    return this.isSkill() || this.isItem();
};

/**
 * 是否是武器
 * Check if it is a weapon
 * 
 * @memberof Game_Item
 * @method isWeapon
 * @returns {Boolean} 是否为武器 - Whether it is a weapon
 */
Game_Item.prototype.isWeapon = function() {
    return this._dataClass === 'weapon';
};

/**
 * 是否是护甲
 * Check if it is armor
 * 
 * @memberof Game_Item
 * @method isArmor
 * @returns {Boolean} 是否为护甲 - Whether it is armor
 */
Game_Item.prototype.isArmor = function() {
    return this._dataClass === 'armor';
};

/**
 * 是否是可装备的项目
 * Check if it is an equippable item
 * 
 * @memberof Game_Item
 * @method isEquipItem
 * @returns {Boolean} 是否为可装备项目 - Whether it is an equippable item
 */
Game_Item.prototype.isEquipItem = function() {
    return this.isWeapon() || this.isArmor();
};

/**
 * 是否为空
 * Check if it is null
 * 
 * @memberof Game_Item
 * @method isNull
 * @returns {Boolean} 是否为空 - Whether it is null
 */
Game_Item.prototype.isNull = function() {
    return this._dataClass === '';
};

/**
 * 获取项目ID
 * Get item ID
 * 
 * @memberof Game_Item
 * @method itemId
 * @returns {Number} 项目ID - Item ID
 */
Game_Item.prototype.itemId = function() {
    return this._itemId;
};

/**
 * 获取对象
 * Get object
 * 
 * @memberof Game_Item
 * @method object
 * @returns {Object|null} 数据库对象 - Database object
 */
Game_Item.prototype.object = function() {
    if (this.isSkill()) {
        return $dataSkills[this._itemId];
    } else if (this.isItem()) {
        return $dataItems[this._itemId];
    } else if (this.isWeapon()) {
        return $dataWeapons[this._itemId];
    } else if (this.isArmor()) {
        return $dataArmors[this._itemId];
    } else {
        return null;
    }
};

/**
 * 设置对象
 * Set object
 * 
 * @memberof Game_Item
 * @method setObject
 * @param {Object} item - 项目数据对象 - Item data object
 */
Game_Item.prototype.setObject = function(item) {
    if (DataManager.isSkill(item)) {
        this._dataClass = 'skill';
    } else if (DataManager.isItem(item)) {
        this._dataClass = 'item';
    } else if (DataManager.isWeapon(item)) {
        this._dataClass = 'weapon';
    } else if (DataManager.isArmor(item)) {
        this._dataClass = 'armor';
    } else {
        this._dataClass = '';
    }
    this._itemId = item ? item.id : 0;
};

/**
 * 设置装备
 * Set equipment
 * 
 * @memberof Game_Item
 * @method setEquip
 * @param {Boolean} isWeapon - 是否为武器 - Whether it is a weapon
 * @param {Number} itemId - 项目ID - Item ID
 */
Game_Item.prototype.setEquip = function(isWeapon, itemId) {
    this._dataClass = isWeapon ? 'weapon' : 'armor';
    this._itemId = itemId;
};