//=============================================================================
// Window_SkillType.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_物品列表 
// Window_ItemList
//
// 在物品画面上的选择物品的窗口。 
// The window for selecting an item on the item screen.

function Window_ItemList() {
    this.initialize.apply(this, arguments);
}

Window_ItemList.prototype = Object.create(Window_Selectable.prototype);
Window_ItemList.prototype.constructor = Window_ItemList;

/* 初始化 */
Window_ItemList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

/* 设置类别 */
Window_ItemList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

/* 最大列数 */
Window_ItemList.prototype.maxCols = function() {
    return 2;
};

/* 间距 */
Window_ItemList.prototype.spacing = function() {
    return 48;
};

/* 最大项目数 */
Window_ItemList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

/* 项目 */
Window_ItemList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

/* 是否当前项目启用 */
Window_ItemList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

/* 包含 */
Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
    case 'item':
        return DataManager.isItem(item) && item.itypeId === 1;
    case 'weapon':
        return DataManager.isWeapon(item);
    case 'armor':
        return DataManager.isArmor(item);
    case 'keyItem':
        return DataManager.isItem(item) && item.itypeId === 2;
    default:
        return false;
    }
};

/* 是否需要数量 */
Window_ItemList.prototype.needsNumber = function() {
    return true;
};

/* 是否启用 */
Window_ItemList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};

/* 制作项目列表 */
Window_ItemList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

/* 选择上一个 */
Window_ItemList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

/* 绘制项目 */
Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.drawItemNumber(item, rect.x, rect.y, rect.width);
        this.changePaintOpacity(1);
    }
};

/* 数字宽度 */
Window_ItemList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

/* 绘制物品数量 */
Window_ItemList.prototype.drawItemNumber = function(item, x, y, width) {
    if (this.needsNumber()) {
        this.drawText(':', x, y, width - this.textWidth('00'), 'right');
        this.drawText($gameParty.numItems(item), x, y, width, 'right');
    }
};

/* 更新帮助 */
Window_ItemList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

/* 刷新 */
Window_ItemList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

//----------------------------------------------------------------------------
// 窗口技能类型 
// Window_SkillType
//
// 在技能画面上的选择技能类型的窗口。 
// The window for selecting a skill type on the skill screen.

function Window_SkillType() {
    this.initialize.apply(this, arguments);
}

Window_SkillType.prototype = Object.create(Window_Command.prototype);
Window_SkillType.prototype.constructor = Window_SkillType;

/* 初始化 */
Window_SkillType.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this._actor = null;
};

/* 窗口宽度 */
Window_SkillType.prototype.windowWidth = function() {
    return 240;
};

/* 设置角色 */
Window_SkillType.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
        this.selectLast();
    }
};

/* 可见的行数 */
Window_SkillType.prototype.numVisibleRows = function() {
    return 4;
};

/* 制作指令列表 */
Window_SkillType.prototype.makeCommandList = function() {
    if (this._actor) {
        var skillTypes = this._actor.addedSkillTypes();
        skillTypes.sort(function(a, b) {
            return a - b;
        });
        skillTypes.forEach(function(stypeId) {
            var name = $dataSystem.skillTypes[stypeId];
            this.addCommand(name, 'skill', true, stypeId);
        }, this);
    }
};

/* 更新 */
Window_SkillType.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this._skillWindow) {
        this._skillWindow.setStypeId(this.currentExt());
    }
};

/* 设置技能窗口 */
Window_SkillType.prototype.setSkillWindow = function(skillWindow) {
    this._skillWindow = skillWindow;
};

/* 选择上一个 */
Window_SkillType.prototype.selectLast = function() {
    var skill = this._actor.lastMenuSkill();
    if (skill) {
        this.selectExt(skill.stypeId);
    } else {
        this.select(0);
    }
};
