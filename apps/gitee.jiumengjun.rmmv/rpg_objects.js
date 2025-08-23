//=============================================================================
// rpg_objects.js v1.6.1
//=============================================================================















//-----------------------------------------------------------------------------
// 游戏_敌人
// Game_Enemy
//
// 敌人的游戏对象类。
// The game object class for an enemy.

function Game_Enemy() {
    this.initialize.apply(this, arguments);
}

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

/* 初始化 */
Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
};

/* 初始化成员 */
Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = '';
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
};

/* 设置 */
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this.recoverAll();
};

/* 是否是敌人 */
Game_Enemy.prototype.isEnemy = function() {
    return true;
};

/* 我方单位 */
Game_Enemy.prototype.friendsUnit = function() {
    return $gameTroop;
};

/* 敌方单位 */
Game_Enemy.prototype.opponentsUnit = function() {
    return $gameParty;
};

/* 索引 */
Game_Enemy.prototype.index = function() {
    return $gameTroop.members().indexOf(this);
};

/* 是否是战斗成员 */
Game_Enemy.prototype.isBattleMember = function() {
    return this.index() >= 0;
};

/* 敌人 ID */
Game_Enemy.prototype.enemyId = function() {
    return this._enemyId;
};

/* 敌人 */
Game_Enemy.prototype.enemy = function() {
    return $dataEnemies[this._enemyId];
};

/* 特征对象 */
Game_Enemy.prototype.traitObjects = function() {
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

/* 基础能力值 */
Game_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

/* 经验 */
Game_Enemy.prototype.exp = function() {
    return this.enemy().exp;
};

/* 金币 */
Game_Enemy.prototype.gold = function() {
    return this.enemy().gold;
};

/* 制作掉落物品 */
Game_Enemy.prototype.makeDropItems = function() {
    return this.enemy().dropItems.reduce(function(r, di) {
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }.bind(this), []);
};

/* 掉落物品比例 */
Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

/* 物品对象 */
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

/* 精灵是否可见 */
Game_Enemy.prototype.isSpriteVisible = function() {
    return true;
};

/* 画面 X 坐标 */
Game_Enemy.prototype.screenX = function() {
    return this._screenX;
};

/* 画面 Y 坐标 */
Game_Enemy.prototype.screenY = function() {
    return this._screenY;
};

/* 战斗图名字 */
Game_Enemy.prototype.battlerName = function() {
    return this.enemy().battlerName;
};

/* 战斗图色相 */
Game_Enemy.prototype.battlerHue = function() {
    return this.enemy().battlerHue;
};

/* 原名 */
Game_Enemy.prototype.originalName = function() {
    return this.enemy().name;
};

/* 战斗者名称  
 * 多只同样的敌人时，会在敌人原名后面加字母来区分。
 */
Game_Enemy.prototype.name = function() {
    return this.originalName() + (this._plural ? this._letter : '');
};

/* 是否字母为空 */
Game_Enemy.prototype.isLetterEmpty = function() {
    return this._letter === '';
};

/* 设置字母 */
Game_Enemy.prototype.setLetter = function(letter) {
    this._letter = letter;
};

/* 设置复数的 */
Game_Enemy.prototype.setPlural = function(plural) {
    this._plural = plural;
};

/* 表现行动开始 */
Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect('whiten');
};

/* 表现行动 */
Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

/* 表现行动结束 */
Game_Enemy.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

/* 表现伤害 */
Game_Enemy.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playEnemyDamage();
    this.requestEffect('blink');
};

/* 表现倒下（死亡后的消失效果） */
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

/* 变身 */
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

/* 是否符合条件 */
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

/* 是否符合回合条件 */
Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    var n = $gameTroop.turnCount();
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

/* 是否符合 HP 条件 */
Game_Enemy.prototype.meetsHpCondition = function(param1, param2) {
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

/* 是否符合 MP 条件 */
Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

/* 是否符合状态条件 */
Game_Enemy.prototype.meetsStateCondition = function(param) {
    return this.isStateAffected(param);
};

/* 是否符合队伍等级条件 */
Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    return $gameParty.highestLevel() >= param;
};

/* 是否符合开关条件 */
Game_Enemy.prototype.meetsSwitchCondition = function(param) {
    return $gameSwitches.value(param);
};

/* 是否有效的行动 */
Game_Enemy.prototype.isActionValid = function(action) {
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

/* 选择行动 */
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

/* 选择所有行动 */
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

/* 制作行动 */
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

//-----------------------------------------------------------------------------
// 游戏_角色们
// Game_Actors
//
// 角色数组的封装类。
// The wrapper class for an actor array.

function Game_Actors() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Actors.prototype.initialize = function() {
    this._data = [];
};

/* 角色 */
Game_Actors.prototype.actor = function(actorId) {
    if ($dataActors[actorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
        return this._data[actorId];
    }
    return null;
};

//-----------------------------------------------------------------------------
// 游戏_单位
// Game_Unit
// 
// Game_Party 和 Game_Troop 的父类。
// The superclass of Game_Party and Game_Troop.

function Game_Unit() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Unit.prototype.initialize = function() {
    this._inBattle = false;
};

/* 是否在战斗中 */
Game_Unit.prototype.inBattle = function() {
    return this._inBattle;
};

/* 成员 */
Game_Unit.prototype.members = function() {
    return [];
};

/* 活着的成员 */
Game_Unit.prototype.aliveMembers = function() {
    return this.members().filter(function(member) {
        return member.isAlive();
    });
};

/* 死亡的成员 */
Game_Unit.prototype.deadMembers = function() {
    return this.members().filter(function(member) {
        return member.isDead();
    });
};

/* 可移动的成员 */
Game_Unit.prototype.movableMembers = function() {
    return this.members().filter(function(member) {
        return member.canMove();
    });
};

/* 清除行动 */
Game_Unit.prototype.clearActions = function() {
    return this.members().forEach(function(member) {
        return member.clearActions();
    });
};

/* 敏捷 */
Game_Unit.prototype.agility = function() {
    var members = this.members();
    if (members.length === 0) {
        return 1;
    }
    var sum = members.reduce(function(r, member) {
        return r + member.agi;
    }, 0);
    return sum / members.length;
};

/* 受到攻击几率总和 */
Game_Unit.prototype.tgrSum = function() {
    return this.aliveMembers().reduce(function(r, member) {
        return r + member.tgr;
    }, 0);
};

/* 随机目标 */
Game_Unit.prototype.randomTarget = function() {
    var tgrRand = Math.random() * this.tgrSum();
    var target = null;
    this.aliveMembers().forEach(function(member) {
        tgrRand -= member.tgr;
        if (tgrRand <= 0 && !target) {
            target = member;
        }
    });
    return target;
};

/* 随机死亡目标 */
Game_Unit.prototype.randomDeadTarget = function() {
    var members = this.deadMembers();
    if (members.length === 0) {
        return null;
    }
    return members[Math.floor(Math.random() * members.length)];
};

/* 顺利获取目标 
 * 返回指定索引的目标，当索引对应的目标无效时返回存活队员的首个对象。
 * PS：smooth 应该是指就算 index 有问题也能顺利返回一个目标。
 */
Game_Unit.prototype.smoothTarget = function(index) {
    if (index < 0) {
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isAlive()) ? member : this.aliveMembers()[0];
};

/* 顺利获取死亡目标 */
Game_Unit.prototype.smoothDeadTarget = function(index) {
    if (index < 0) {
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isDead()) ? member : this.deadMembers()[0];
};

/* 清除结果 */
Game_Unit.prototype.clearResults = function() {
    this.members().forEach(function(member) {
        member.clearResult();
    });
};

/* 当战斗开始 */
Game_Unit.prototype.onBattleStart = function() {
    this.members().forEach(function(member) {
        member.onBattleStart();
    });
    this._inBattle = true;
};

/* 当战斗结束 */
Game_Unit.prototype.onBattleEnd = function() {
    this._inBattle = false;
    this.members().forEach(function(member) {
        member.onBattleEnd();
    });
};

/* 制作行动 */
Game_Unit.prototype.makeActions = function() {
    this.members().forEach(function(member) {
        member.makeActions();
    });
};

/* 选择 */
Game_Unit.prototype.select = function(activeMember) {
    this.members().forEach(function(member) {
        if (member === activeMember) {
            member.select();
        } else {
            member.deselect();
        }
    });
};

/* 是否全部死亡 */
Game_Unit.prototype.isAllDead = function() {
    return this.aliveMembers().length === 0;
};

/* 掩护的战斗者 */
Game_Unit.prototype.substituteBattler = function() {
    var members = this.members();
    for (var i = 0; i < members.length; i++) {
        if (members[i].isSubstitute()) {
            return members[i];
        }
    }
};

//-----------------------------------------------------------------------------
// 游戏_队伍
// Game_Party
//
// 队伍的游戏对象类。包括金钱和物品等信息。
// The game object class for the party. Information such as gold and items is
// included.

function Game_Party() {
    this.initialize.apply(this, arguments);
}

Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;

Game_Party.ABILITY_ENCOUNTER_HALF    = 0;  // 队伍能力-遇敌减半 
Game_Party.ABILITY_ENCOUNTER_NONE    = 1;  // 队伍能力-无遇敌 
Game_Party.ABILITY_CANCEL_SURPRISE   = 2;  // 队伍能力-取消偷袭 
Game_Party.ABILITY_RAISE_PREEMPTIVE  = 3;  // 队伍能力-增加先发制人率 
Game_Party.ABILITY_GOLD_DOUBLE       = 4;  // 队伍能力-双倍金钱 
Game_Party.ABILITY_DROP_ITEM_DOUBLE  = 5;  // 队伍能力-双倍掉落物品 

/* 初始化 */
Game_Party.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._gold = 0;
    this._steps = 0;
    this._lastItem = new Game_Item();
    this._menuActorId = 0;
    this._targetActorId = 0;
    this._actors = [];
    this.initAllItems();
};

/* 初始化所有物品 */
Game_Party.prototype.initAllItems = function() {
    this._items = {};
    this._weapons = {};
    this._armors = {};
};

/* 是否存在角色 */
Game_Party.prototype.exists = function() {
    return this._actors.length > 0;
};

/* 大小 */
Game_Party.prototype.size = function() {
    return this.members().length;
};

/* 是否为空 */
Game_Party.prototype.isEmpty = function() {
    return this.size() === 0;
};

/* 成员 */
Game_Party.prototype.members = function() {
    return this.inBattle() ? this.battleMembers() : this.allMembers();
};

/* 所有成员 */
Game_Party.prototype.allMembers = function() {
    return this._actors.map(function(id) {
        return $gameActors.actor(id);
    });
};

/* 战斗成员 */
Game_Party.prototype.battleMembers = function() {
    return this.allMembers().slice(0, this.maxBattleMembers()).filter(function(actor) {
        return actor.isAppeared();
    });
};

/* 最大战斗成员数 */
Game_Party.prototype.maxBattleMembers = function() {
    return 4;
};

/* 队长 */
Game_Party.prototype.leader = function() {
    return this.battleMembers()[0];
};

/* 复活战斗成员 
 * 允许战斗失败的情况下，战斗失败后全员复活且 1 血。
 */
Game_Party.prototype.reviveBattleMembers = function() {
    this.battleMembers().forEach(function(actor) {
        if (actor.isDead()) {
            actor.setHp(1);
        }
    });
};

/* 物品 */
Game_Party.prototype.items = function() {
    var list = [];
    for (var id in this._items) {
        list.push($dataItems[id]);
    }
    return list;
};

/* 武器 */
Game_Party.prototype.weapons = function() {
    var list = [];
    for (var id in this._weapons) {
        list.push($dataWeapons[id]);
    }
    return list;
};

/* 护甲 */
Game_Party.prototype.armors = function() {
    var list = [];
    for (var id in this._armors) {
        list.push($dataArmors[id]);
    }
    return list;
};

/* 装备物品（武器和护甲） */
Game_Party.prototype.equipItems = function() {
    return this.weapons().concat(this.armors());
};

/* 所有物品（物品、武器和护甲） */
Game_Party.prototype.allItems = function() {
    return this.items().concat(this.equipItems());
};

/* 物品容器 */
Game_Party.prototype.itemContainer = function(item) {
    if (!item) {
        return null;
    } else if (DataManager.isItem(item)) {
        return this._items;
    } else if (DataManager.isWeapon(item)) {
        return this._weapons;
    } else if (DataManager.isArmor(item)) {
        return this._armors;
    } else {
        return null;
    }
};

/* 设置初始成员 */
Game_Party.prototype.setupStartingMembers = function() {
    this._actors = [];
    $dataSystem.partyMembers.forEach(function(actorId) {
        if ($gameActors.actor(actorId)) {
            this._actors.push(actorId);
        }
    }, this);
};

/* 名字 */
Game_Party.prototype.name = function() {
    var numBattleMembers = this.battleMembers().length;
    if (numBattleMembers === 0) {
        return '';
    } else if (numBattleMembers === 1) {
        return this.leader().name();
    } else {
        return TextManager.partyName.format(this.leader().name());
    }
};

/* 设置战斗测试 */
Game_Party.prototype.setupBattleTest = function() {
    this.setupBattleTestMembers();
    this.setupBattleTestItems();
};

/* 设置战斗测试成员 */
Game_Party.prototype.setupBattleTestMembers = function() {
    $dataSystem.testBattlers.forEach(function(battler) {
        var actor = $gameActors.actor(battler.actorId);
        if (actor) {
            actor.changeLevel(battler.level, false);
            actor.initEquips(battler.equips);
            actor.recoverAll();
            this.addActor(battler.actorId);
        }
    }, this);
};

/* 设置战斗测试物品 */
Game_Party.prototype.setupBattleTestItems = function() {
    $dataItems.forEach(function(item) {
        if (item && item.name.length > 0) {
            this.gainItem(item, this.maxItems(item));
        }
    }, this);
};

/* 最高的等级
 * 返回队伍中等级最高的成员的等级。
 */
Game_Party.prototype.highestLevel = function() {
    return Math.max.apply(null, this.members().map(function(actor) {
        return actor.level;
    }));
};

/* 添加角色 */
Game_Party.prototype.addActor = function(actorId) {
    if (!this._actors.contains(actorId)) {
        this._actors.push(actorId);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    }
};

/* 移除角色 */
Game_Party.prototype.removeActor = function(actorId) {
    if (this._actors.contains(actorId)) {
        this._actors.splice(this._actors.indexOf(actorId), 1);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    }
};

/* 金钱 */
Game_Party.prototype.gold = function() {
    return this._gold;
};

/* 获得金钱 */
Game_Party.prototype.gainGold = function(amount) {
    this._gold = (this._gold + amount).clamp(0, this.maxGold());
};

/* 失去金钱 */
Game_Party.prototype.loseGold = function(amount) {
    this.gainGold(-amount);
};

/* 金钱上限 */
Game_Party.prototype.maxGold = function() {
    return 99999999;
};

/* 步数 */
Game_Party.prototype.steps = function() {
    return this._steps;
};

/* 增加步数 */
Game_Party.prototype.increaseSteps = function() {
    this._steps++;
};

/* 物品数量 */
Game_Party.prototype.numItems = function(item) {
    var container = this.itemContainer(item);
    return container ? container[item.id] || 0 : 0;
};

/* 物品上限 */
Game_Party.prototype.maxItems = function(item) {
    return 99;
};

/* 是否该物品数量超过上限*/
Game_Party.prototype.hasMaxItems = function(item) {
    return this.numItems(item) >= this.maxItems(item);
};

/* 是否拥有该物品 */
Game_Party.prototype.hasItem = function(item, includeEquip) {
    if (includeEquip === undefined) {
        includeEquip = false;
    }
    if (this.numItems(item) > 0) {
        return true;
    } else if (includeEquip && this.isAnyMemberEquipped(item)) {
        return true;
    } else {
        return false;
    }
};

/* 是否所有成员装备该物品 */
Game_Party.prototype.isAnyMemberEquipped = function(item) {
    return this.members().some(function(actor) {
        return actor.equips().contains(item);
    });
};

/* 获得物品 */
Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    var container = this.itemContainer(item);
    if (container) {
        var lastNumber = this.numItems(item);
        var newNumber = lastNumber + amount;
        container[item.id] = newNumber.clamp(0, this.maxItems(item));
        if (container[item.id] === 0) {
            delete container[item.id];
        }
        if (includeEquip && newNumber < 0) {
            this.discardMembersEquip(item, -newNumber);
        }
        $gameMap.requestRefresh();
    }
};

/* 丢弃成员装备 */
Game_Party.prototype.discardMembersEquip = function(item, amount) {
    var n = amount;
    this.members().forEach(function(actor) {
        while (n > 0 && actor.isEquipped(item)) {
            actor.discardEquip(item);
            n--;
        }
    });
};

/* 失去物品 */
Game_Party.prototype.loseItem = function(item, amount, includeEquip) {
    this.gainItem(item, -amount, includeEquip);
};

/* 消耗物品 */
Game_Party.prototype.consumeItem = function(item) {
    if (DataManager.isItem(item) && item.consumable) {
        this.loseItem(item, 1);
    }
};

/* 是否可使用 */
Game_Party.prototype.canUse = function(item) {
    return this.members().some(function(actor) {
        return actor.canUse(item);
    });
};

/* 是否可输入 */
Game_Party.prototype.canInput = function() {
    return this.members().some(function(actor) {
        return actor.canInput();
    });
};

/* 是否全死亡 */
Game_Party.prototype.isAllDead = function() {
    if (Game_Unit.prototype.isAllDead.call(this)) {
        return this.inBattle() || !this.isEmpty();
    } else {
        return false;
    }
};

/* 当玩家行走 */
Game_Party.prototype.onPlayerWalk = function() {
    this.members().forEach(function(actor) {
        return actor.onPlayerWalk();
    });
};

/* 菜单角色
 * 菜单界面中选中的角色。
 */
Game_Party.prototype.menuActor = function() {
    var actor = $gameActors.actor(this._menuActorId);
    if (!this.members().contains(actor)) {
        actor = this.members()[0];
    }
    return actor;
};

/* 设置菜单角色  
 * 设置菜单界面中选中的角色。
 */
Game_Party.prototype.setMenuActor = function(actor) {
    this._menuActorId = actor.actorId();
};

/* 制作下一个菜单角色 
 * 技能、装备和状态界面按 PageDown 后切换下一个角色。
 */
Game_Party.prototype.makeMenuActorNext = function() {
    var index = this.members().indexOf(this.menuActor());
    if (index >= 0) {
        index = (index + 1) % this.members().length;
        this.setMenuActor(this.members()[index]);
    } else {
        this.setMenuActor(this.members()[0]);
    }
};

/* 制作上一个菜单角色 
 * 技能、装备和状态界面按 PageUp 后切换上一个角色。
 */
Game_Party.prototype.makeMenuActorPrevious = function() {
    var index = this.members().indexOf(this.menuActor());
    if (index >= 0) {
        index = (index + this.members().length - 1) % this.members().length;
        this.setMenuActor(this.members()[index]);
    } else {
        this.setMenuActor(this.members()[0]);
    }
};

/* 目标角色 */
Game_Party.prototype.targetActor = function() {
    var actor = $gameActors.actor(this._targetActorId);
    if (!this.members().contains(actor)) {
        actor = this.members()[0];
    }
    return actor;
};

/* 设置目标角色 */
Game_Party.prototype.setTargetActor = function(actor) {
    this._targetActorId = actor.actorId();
};

/* 上个项目 */
Game_Party.prototype.lastItem = function() {
    return this._lastItem.object();
};

/* 设置上个项目 */
Game_Party.prototype.setLastItem = function(item) {
    this._lastItem.setObject(item);
};

/* 交换顺序 */
Game_Party.prototype.swapOrder = function(index1, index2) {
    var temp = this._actors[index1];
    this._actors[index1] = this._actors[index2];
    this._actors[index2] = temp;
    $gamePlayer.refresh();
};

/* 存档的人物行走图 */
Game_Party.prototype.charactersForSavefile = function() {
    return this.battleMembers().map(function(actor) {
        return [actor.characterName(), actor.characterIndex()];
    });
};

/* 存档的脸图 */
Game_Party.prototype.facesForSavefile = function() {
    return this.battleMembers().map(function(actor) {
        return [actor.faceName(), actor.faceIndex()];
    });
};

/* 队伍能力 */
Game_Party.prototype.partyAbility = function(abilityId) {
    return this.battleMembers().some(function(actor) {
        return actor.partyAbility(abilityId);
    });
};

/* 是否遇敌减半 */
Game_Party.prototype.hasEncounterHalf = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};

/* 是否无遇敌 */
Game_Party.prototype.hasEncounterNone = function() {
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};

/* 是否取消偷袭 */
Game_Party.prototype.hasCancelSurprise = function() {
    return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};

/* 是否增加先发制人率 */
Game_Party.prototype.hasRaisePreemptive = function() {
    return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};

/* 是否双倍金钱 */
Game_Party.prototype.hasGoldDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};

/* 是否双倍掉落物品 */
Game_Party.prototype.hasDropItemDouble = function() {
    return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};

/* 先发制人概率 */
Game_Party.prototype.ratePreemptive = function(troopAgi) {
    var rate = this.agility() >= troopAgi ? 0.05 : 0.03;
    if (this.hasRaisePreemptive()) {
        rate *= 4;
    }
    return rate;
};

/* 偷袭概率 */
Game_Party.prototype.rateSurprise = function(troopAgi) {
    var rate = this.agility() >= troopAgi ? 0.03 : 0.05;
    if (this.hasCancelSurprise()) {
        rate = 0;
    }
    return rate;
};

/* 表现胜利 */
Game_Party.prototype.performVictory = function() {
    this.members().forEach(function(actor) {
        actor.performVictory();
    });
};

/* 表现逃跑 */
Game_Party.prototype.performEscape = function() {
    this.members().forEach(function(actor) {
        actor.performEscape();
    });
};

/* 移除战斗状态 */
Game_Party.prototype.removeBattleStates = function() {
    this.members().forEach(function(actor) {
        actor.removeBattleStates();
    });
};

/* 请求动作刷新 */
Game_Party.prototype.requestMotionRefresh = function() {
    this.members().forEach(function(actor) {
        actor.requestMotionRefresh();
    });
};

//-----------------------------------------------------------------------------
// 游戏_敌群 
// Game_Troop
//
// 敌群和战斗相关数据的游戏对象类。 
// The game object class for a troop and the battle-related data.

function Game_Troop() {
    this.initialize.apply(this, arguments);
}

Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;

Game_Troop.LETTER_TABLE_HALF = [
    ' A',' B',' C',' D',' E',' F',' G',' H',' I',' J',' K',' L',' M',
    ' N',' O',' P',' Q',' R',' S',' T',' U',' V',' W',' X',' Y',' Z'
];  // 半角字母表 
Game_Troop.LETTER_TABLE_FULL = [
    'Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ',
    'Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'
];  // 全角字母表 

/* 初始化 */
Game_Troop.prototype.initialize = function() {
    Game_Unit.prototype.initialize.call(this);
    this._interpreter = new Game_Interpreter();
    this.clear();
};

/* 是否事件运行中 */
Game_Troop.prototype.isEventRunning = function() {
    return this._interpreter.isRunning();
};

/* 更新解释器 */
Game_Troop.prototype.updateInterpreter = function() {
    this._interpreter.update();
};

/* 回合计数 */
Game_Troop.prototype.turnCount = function() {
    return this._turnCount;
};

/* 成员 */
Game_Troop.prototype.members = function() {
    return this._enemies;
};

/* 清除 */
Game_Troop.prototype.clear = function() {
    this._interpreter.clear();
    this._troopId = 0;
    this._eventFlags = {};
    this._enemies = [];
    this._turnCount = 0;
    this._namesCount = {};
};

/* 敌群 */
Game_Troop.prototype.troop = function() {
    return $dataTroops[this._troopId];
};

/* 设置 */
Game_Troop.prototype.setup = function(troopId) {
    this.clear();
    this._troopId = troopId;
    this._enemies = [];
    this.troop().members.forEach(function(member) {
        if ($dataEnemies[member.enemyId]) {
            var enemyId = member.enemyId;
            var x = member.x;
            var y = member.y;
            var enemy = new Game_Enemy(enemyId, x, y);
            if (member.hidden) {
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }, this);
    this.makeUniqueNames();
};

/* 制作唯一的名称 */
Game_Troop.prototype.makeUniqueNames = function() {
    var table = this.letterTable();
    this.members().forEach(function(enemy) {
        if (enemy.isAlive() && enemy.isLetterEmpty()) {
            var name = enemy.originalName();
            var n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
    }, this);
    this.members().forEach(function(enemy) {
        var name = enemy.originalName();
        if (this._namesCount[name] >= 2) {
            enemy.setPlural(true);
        }
    }, this);
};

/* 字母表 */
Game_Troop.prototype.letterTable = function() {
    return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
};

/* 敌人名称 */
Game_Troop.prototype.enemyNames = function() {
    var names = [];
    this.members().forEach(function(enemy) {
        var name = enemy.originalName();
        if (enemy.isAlive() && !names.contains(name)) {
            names.push(name);
        }
    });
    return names;
};

/* 是否满足条件 */
Game_Troop.prototype.meetsConditions = function(page) {
    var c = page.conditions;
    if (!c.turnEnding && !c.turnValid && !c.enemyValid &&
            !c.actorValid && !c.switchValid) {
        return false;  // Conditions not set
    }
    if (c.turnEnding) {
        if (!BattleManager.isTurnEnd()) {
            return false;
        }
    }
    if (c.turnValid) {
        var n = this._turnCount;
        var a = c.turnA;
        var b = c.turnB;
        if ((b === 0 && n !== a)) {
            return false;
        }
        if ((b > 0 && (n < 1 || n < a || n % b !== a % b))) {
            return false;
        }
    }
    if (c.enemyValid) {
        var enemy = $gameTroop.members()[c.enemyIndex];
        if (!enemy || enemy.hpRate() * 100 > c.enemyHp) {
            return false;
        }
    }
    if (c.actorValid) {
        var actor = $gameActors.actor(c.actorId);
        if (!actor || actor.hpRate() * 100 > c.actorHp) {
            return false;
        }
    }
    if (c.switchValid) {
        if (!$gameSwitches.value(c.switchId)) {
            return false;
        }
    }
    return true;
};

/* 设置战斗事件 */
Game_Troop.prototype.setupBattleEvent = function() {
    if (!this._interpreter.isRunning()) {
        if (this._interpreter.setupReservedCommonEvent()) {
            return;
        }
        var pages = this.troop().pages;
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            if (this.meetsConditions(page) && !this._eventFlags[i]) {
                this._interpreter.setup(page.list);
                if (page.span <= 1) {
                    this._eventFlags[i] = true;
                }
                break;
            }
        }
    }
};

/* 增加回合 */
Game_Troop.prototype.increaseTurn = function() {
    var pages = this.troop().pages;
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (page.span === 1) {
            this._eventFlags[i] = false;
        }
    }
    this._turnCount++;
};

/* 总经验 */
Game_Troop.prototype.expTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.exp();
    }, 0);
};

/* 总金钱 */
Game_Troop.prototype.goldTotal = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r + enemy.gold();
    }, 0) * this.goldRate();
};

/* 金钱倍率 */
Game_Troop.prototype.goldRate = function() {
    return $gameParty.hasGoldDouble() ? 2 : 1;
};

/* 制作掉落物品 */
Game_Troop.prototype.makeDropItems = function() {
    return this.deadMembers().reduce(function(r, enemy) {
        return r.concat(enemy.makeDropItems());
    }, []);
};

//-----------------------------------------------------------------------------
// 游戏_地图
// Game_Map
//
// 地图的游戏对象类。它包含滚动和通行决定功能。
// The game object class for a map. It contains scrolling and passage
// determination functions.
//
// PS：以下翻译，位置(x,y)是以图块为单位的，坐标(x,y)是以像素为单位的。

function Game_Map() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Map.prototype.initialize = function() {
    this._interpreter = new Game_Interpreter();
    this._mapId = 0;
    this._tilesetId = 0;
    this._events = [];
    this._commonEvents = [];
    this._vehicles = [];
    this._displayX = 0;
    this._displayY = 0;
    this._nameDisplay = true;
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
    this._parallaxName = '';
    this._parallaxZero = false;
    this._parallaxLoopX = false;
    this._parallaxLoopY = false;
    this._parallaxSx = 0;
    this._parallaxSy = 0;
    this._parallaxX = 0;
    this._parallaxY = 0;
    this._battleback1Name = null;
    this._battleback2Name = null;
    this.createVehicles();
};

/* 设置 */
Game_Map.prototype.setup = function(mapId) {
    if (!$dataMap) {
        throw new Error('The map data is not available');
    }
    this._mapId = mapId;
    this._tilesetId = $dataMap.tilesetId;
    this._displayX = 0;
    this._displayY = 0;
    this.refereshVehicles();
    this.setupEvents();
    this.setupScroll();
    this.setupParallax();
    this.setupBattleback();
    this._needsRefresh = false;
};

/* 是否事件运行中 */
Game_Map.prototype.isEventRunning = function() {
    return this._interpreter.isRunning() || this.isAnyEventStarting();
};

/* 图块宽 */
Game_Map.prototype.tileWidth = function() {
    return 48;
};

/* 图块高 */
Game_Map.prototype.tileHeight = function() {
    return 48;
};

/* 地图 ID */
Game_Map.prototype.mapId = function() {
    return this._mapId;
};

/* 图块组 ID */
Game_Map.prototype.tilesetId = function() {
    return this._tilesetId;
};

/* 显示的 X 位置 */
Game_Map.prototype.displayX = function() {
    return this._displayX;
};

/* 显示的 Y 位置 */
Game_Map.prototype.displayY = function() {
    return this._displayY;
};

/* 远景名称 */
Game_Map.prototype.parallaxName = function() {
    return this._parallaxName;
};

/* 战斗背景 1 名称 */
Game_Map.prototype.battleback1Name = function() {
    return this._battleback1Name;
};

/* 战斗背景 2 名称 */
Game_Map.prototype.battleback2Name = function() {
    return this._battleback2Name;
};

/* 请求刷新 */
Game_Map.prototype.requestRefresh = function(mapId) {
    this._needsRefresh = true;
};

/* 是否名称显示启用 */
Game_Map.prototype.isNameDisplayEnabled = function() {
    return this._nameDisplay;
};

/* 禁用名称显示 */
Game_Map.prototype.disableNameDisplay = function() {
    this._nameDisplay = false;
};

/* 启用名称显示 */
Game_Map.prototype.enableNameDisplay = function() {
    this._nameDisplay = true;
};

/* 创建载具 */
Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle('boat');
    this._vehicles[1] = new Game_Vehicle('ship');
    this._vehicles[2] = new Game_Vehicle('airship');
};

/* 刷新载具 */
Game_Map.prototype.refereshVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.refresh();
    });
};

/* 载具数组 
 * 返回载具的数组。
 */
Game_Map.prototype.vehicles = function() {
    return this._vehicles;
};

/* 载具 
 * 返回该类型对应的载具的对象。
 */
Game_Map.prototype.vehicle = function(type) {
    if (type ===  0 || type === 'boat') {
        return this.boat();
    } else if (type ===  1 || type === 'ship') {
        return this.ship();
    } else if (type ===  2 || type === 'airship') {
        return this.airship();
    } else {
        return null;
    }
};

/* 小舟 */
Game_Map.prototype.boat = function() {
    return this._vehicles[0];
};

/* 大船 */
Game_Map.prototype.ship = function() {
    return this._vehicles[1];
};

/* 飞艇 */
Game_Map.prototype.airship = function() {
    return this._vehicles[2];
};

/* 设置事件 */
Game_Map.prototype.setupEvents = function() {
    this._events = [];
    for (var i = 0; i < $dataMap.events.length; i++) {
        if ($dataMap.events[i]) {
            this._events[i] = new Game_Event(this._mapId, i);
        }
    }
    this._commonEvents = this.parallelCommonEvents().map(function(commonEvent) {
        return new Game_CommonEvent(commonEvent.id);
    });
    this.refreshTileEvents();
};

/* 事件数组 
 * 返回数组元素对象非空的事件数组。
 */
Game_Map.prototype.events = function() {
    return this._events.filter(function(event) {
        return !!event;
    });
};

/* 事件 
 * 返回事件 ID 所对应的事件对象。
 */
Game_Map.prototype.event = function(eventId) {
    return this._events[eventId];
};

/* 消除事件 */
Game_Map.prototype.eraseEvent = function(eventId) {
    this._events[eventId].erase();
};

/* 是否并行处理的公共事件 */
Game_Map.prototype.parallelCommonEvents = function() {
    return $dataCommonEvents.filter(function(commonEvent) {
        return commonEvent && commonEvent.trigger === 2;
    });
};

/* 设置滚动 */
Game_Map.prototype.setupScroll = function() {
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
};

/* 设置远景 */
Game_Map.prototype.setupParallax = function() {
    this._parallaxName = $dataMap.parallaxName || '';
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    this._parallaxSx = $dataMap.parallaxSx;
    this._parallaxSy = $dataMap.parallaxSy;
    this._parallaxX = 0;
    this._parallaxY = 0;
};

/* 设置战斗背景 */
Game_Map.prototype.setupBattleback = function() {
    if ($dataMap.specifyBattleback) {
        this._battleback1Name = $dataMap.battleback1Name;
        this._battleback2Name = $dataMap.battleback2Name;
    } else {
        this._battleback1Name = null;
        this._battleback2Name = null;
    }
};

/* 设置显示坐标 */
Game_Map.prototype.setDisplayPos = function(x, y) {
    if (this.isLoopHorizontal()) {
        this._displayX = x.mod(this.width());
        this._parallaxX = x;
    } else {
        var endX = this.width() - this.screenTileX();
        this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        this._parallaxX = this._displayX;
    }
    if (this.isLoopVertical()) {
        this._displayY = y.mod(this.height());
        this._parallaxY = y;
    } else {
        var endY = this.height() - this.screenTileY();
        this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        this._parallaxY = this._displayY;
    }
};

/* 远景原点 X 坐标 */
Game_Map.prototype.parallaxOx = function() {
    if (this._parallaxZero) {
        return this._parallaxX * this.tileWidth();
    } else if (this._parallaxLoopX) {
        return this._parallaxX * this.tileWidth() / 2;
    } else {
        return 0;
    }
};

/* 远景原点 Y 坐标 */
Game_Map.prototype.parallaxOy = function() {
    if (this._parallaxZero) {
        return this._parallaxY * this.tileHeight();
    } else if (this._parallaxLoopY) {
        return this._parallaxY * this.tileHeight() / 2;
    } else {
        return 0;
    }
};

/* 图块组 */
Game_Map.prototype.tileset = function() {
    return $dataTilesets[this._tilesetId];
};

/* 图块组标志 */
Game_Map.prototype.tilesetFlags = function() {
    var tileset = this.tileset();
    if (tileset) {
        return tileset.flags;
    } else {
        return [];
    }
};

/* 显示名称 */
Game_Map.prototype.displayName = function() {
    return $dataMap.displayName;
};

/* 宽 */
Game_Map.prototype.width = function() {
    return $dataMap.width;
};

/* 高 */
Game_Map.prototype.height = function() {
    return $dataMap.height;
};

/* 数据 */
Game_Map.prototype.data = function() {
    return $dataMap.data;
};

/* 是否横向循环 */
Game_Map.prototype.isLoopHorizontal = function() {
    return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};

/* 是否纵向循环 */
Game_Map.prototype.isLoopVertical = function() {
    return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};

/* 是否禁止奔跑启用 */
Game_Map.prototype.isDashDisabled = function() {
    return $dataMap.disableDashing;
};

/* 遇敌列表 */
Game_Map.prototype.encounterList = function() {
    return $dataMap.encounterList;
};

/* 遇敌步数 */
Game_Map.prototype.encounterStep = function() {
    return $dataMap.encounterStep;
};

/* 是否主世界 
 * 数据库-图块-基本设置-模式是否为世界类型。
 */
Game_Map.prototype.isOverworld = function() {
    return this.tileset() && this.tileset().mode === 0;
};

/* 画面 X 轴方向图块数 */
Game_Map.prototype.screenTileX = function() {
    return Graphics.width / this.tileWidth();
};

/* 画面 Y 轴方向图块数 */
Game_Map.prototype.screenTileY = function() {
    return Graphics.height / this.tileHeight();
};

/* 自适应 X 坐标 */
Game_Map.prototype.adjustX = function(x) {
    if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
        return x - this._displayX + $dataMap.width;
    } else {
        return x - this._displayX;
    }
};

/* 自适应 Y 坐标 */
Game_Map.prototype.adjustY = function(y) {
    if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
        return y - this._displayY + $dataMap.height;
    } else {
        return y - this._displayY;
    }
};

/* 环形 X 位置 
 * 当横向循环时将位置转换为原地图位置。 假设地图宽为 17 图块时，-1 则为 16，17 则为 0 。
 */
Game_Map.prototype.roundX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};

/* 环形 Y 位置 
 * 当纵向循环时将位置转换为原地图位置。 假设地图高为 13 图块时，-1 则为 12，13 则为 0 。
 */
Game_Map.prototype.roundY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height()) : y;
};

/* 该方向的 X 位置
 * @param {Number} x 在地图上的 X 位置
 * @param {Number} d 移动的方向（4：向左，6：向右） 
 */
Game_Map.prototype.xWithDirection = function(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};

/* 该方向的 Y 位置 
 * @param {Number} y 在地图上的 Y 位置
 * @param {Number} d 移动的方向（2：向下，8：向上） 
 */
Game_Map.prototype.yWithDirection = function(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};

/* 该方向的环形 X 位置 */
Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};

/* 该方向的环形 Y 位置 */
Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};

/* X 位置差值 */
Game_Map.prototype.deltaX = function(x1, x2) {
    var result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
        if (result < 0) {
            result += this.width();
        } else {
            result -= this.width();
        }
    }
    return result;
};

/* Y 位置差值 */
Game_Map.prototype.deltaY = function(y1, y2) {
    var result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
        if (result < 0) {
            result += this.height();
        } else {
            result -= this.height();
        }
    }
    return result;
};

/* 距离 
 * (x1,y1) 和 (x2,y2) 两点之间的距离。 
 */
Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};

/* 画布 X 坐标转换到地图 X 位置 */
Game_Map.prototype.canvasToMapX = function(x) {
    var tileWidth = this.tileWidth();
    var originX = this._displayX * tileWidth;
    var mapX = Math.floor((originX + x) / tileWidth);
    return this.roundX(mapX);
};

/* 画布 Y 坐标转换到地图 Y 位置 */
Game_Map.prototype.canvasToMapY = function(y) {
    var tileHeight = this.tileHeight();
    var originY = this._displayY * tileHeight;
    var mapY = Math.floor((originY + y) / tileHeight);
    return this.roundY(mapY);
};

/* 自动播放 */
Game_Map.prototype.autoplay = function() {
    if ($dataMap.autoplayBgm) {
        if ($gamePlayer.isInVehicle()) {
            $gameSystem.saveWalkingBgm2();
        } else {
            AudioManager.playBgm($dataMap.bgm);
        }
    }
    if ($dataMap.autoplayBgs) {
        AudioManager.playBgs($dataMap.bgs);
    }
};

/* 如果需要就刷新 */
Game_Map.prototype.refreshIfNeeded = function() {
    if (this._needsRefresh) {
        this.refresh();
    }
};

/* 刷新 */
Game_Map.prototype.refresh = function() {
    this.events().forEach(function(event) {
        event.refresh();
    });
    this._commonEvents.forEach(function(event) {
        event.refresh();
    });
    this.refreshTileEvents();
    this._needsRefresh = false;
};

/* 刷新图块事件 */
Game_Map.prototype.refreshTileEvents = function() {
    this.tileEvents = this.events().filter(function(event) {
        return event.isTile();
    });
};

/* 位置 X,Y 的事件 */
Game_Map.prototype.eventsXy = function(x, y) {
    return this.events().filter(function(event) {
        return event.pos(x, y);
    });
};

/* 位置 X,Y 不可穿透的事件 */
Game_Map.prototype.eventsXyNt = function(x, y) {
    return this.events().filter(function(event) {
        return event.posNt(x, y);
    });
};

/* 位置 X,Y 不可穿透的图块事件 */
Game_Map.prototype.tileEventsXy = function(x, y) {
    return this.tileEvents.filter(function(event) {
        return event.posNt(x, y);
    });
};

/* 位置 X,Y 的事件 ID */
Game_Map.prototype.eventIdXy = function(x, y) {
    var list = this.eventsXy(x, y);
    return list.length === 0 ? 0 : list[0].eventId();
};

/* 向下滚动 */
Game_Map.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.min(this._displayY + distance,
            this.height() - this.screenTileY());
        this._parallaxY += this._displayY - lastY;
    }
};

/* 向左滚动 */
Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, 0);
        this._parallaxX += this._displayX - lastX;
    }
};

/* 向右滚动 */
Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.min(this._displayX + distance,
            this.width() - this.screenTileX());
        this._parallaxX += this._displayX - lastX;
    }
};

/* 向上滚动 */
Game_Map.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, 0);
        this._parallaxY += this._displayY - lastY;
    }
};

/* 是否有效的 */
Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};

/* 检测通行 */
Game_Map.prototype.checkPassage = function(x, y, bit) {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];
        if ((flag & 0x10) !== 0)  // [*] 对通行无影响（No effect on passage） 
            continue;
        if ((flag & bit) === 0)   // [o] 可通行（Passable） 
            return true;
        if ((flag & bit) === bit) // [x] 不可通行（Impassable） 
            return false;
    }
    return false;
};

/* 图块 ID */
Game_Map.prototype.tileId = function(x, y, z) {
    var width = $dataMap.width;
    var height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
};

/* 层叠图块
 * 地图有 4 个图层，返回该位置所有图层的图块。
 */
Game_Map.prototype.layeredTiles = function(x, y) {
    var tiles = [];
    for (var i = 0; i < 4; i++) {
        tiles.push(this.tileId(x, y, 3 - i));
    }
    return tiles;
};

/* 所有图块 
 * 该位置的图块事件加上该位置的层叠图块。
 */
Game_Map.prototype.allTiles = function(x, y) {
    var tiles = this.tileEventsXy(x, y).map(function(event) {
        return event.tileId();
    });
    return tiles.concat(this.layeredTiles(x, y));
};

/* 自动识别图块类型 */
Game_Map.prototype.autotileType = function(x, y, z) {
    var tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};

/* 是否可通行的 */
Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};

/* 是否小舟可通行 */
Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0200);
};

/* 是否大船可通行 */
Game_Map.prototype.isShipPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0400);
};

/* 是否飞艇可通行的陆地 */
Game_Map.prototype.isAirshipLandOk = function(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};

/* 检测层叠图层标志 */
Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    var flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(function(tileId) {
        return (flags[tileId] & bit) !== 0;
    });
};

/* 是否梯子 */
Game_Map.prototype.isLadder = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};

/* 是否草木繁茂处 */
Game_Map.prototype.isBush = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};

/* 是否柜台 */
Game_Map.prototype.isCounter = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};

/* 是否有害地形 */
Game_Map.prototype.isDamageFloor = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};

/* 地形标志 */
Game_Map.prototype.terrainTag = function(x, y) {
    if (this.isValid(x, y)) {
        var flags = this.tilesetFlags();
        var tiles = this.layeredTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
            var tag = flags[tiles[i]] >> 12;
            if (tag > 0) {
                return tag;
            }
        }
    }
    return 0;
};

/* 区域 ID */
Game_Map.prototype.regionId = function(x, y) {
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};

/* 开始滚动 */
Game_Map.prototype.startScroll = function(direction, distance, speed) {
    this._scrollDirection = direction;
    this._scrollRest = distance;
    this._scrollSpeed = speed;
};

/* 是否滚动中 */
Game_Map.prototype.isScrolling = function() {
    return this._scrollRest > 0;
};

/* 更新 */
Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();
    }
    this.updateScroll();
    this.updateEvents();
    this.updateVehicles();
    this.updateParallax();
};

/* 更新滚动 */
Game_Map.prototype.updateScroll = function() {
    if (this.isScrolling()) {
        var lastX = this._displayX;
        var lastY = this._displayY;
        this.doScroll(this._scrollDirection, this.scrollDistance());
        if (this._displayX === lastX && this._displayY === lastY) {
            this._scrollRest = 0;
        } else {
            this._scrollRest -= this.scrollDistance();
        }
    }
};

/* 滚动距离 */
Game_Map.prototype.scrollDistance = function() {
    return Math.pow(2, this._scrollSpeed) / 256;
};

/* 进行滚动 */
Game_Map.prototype.doScroll = function(direction, distance) {
    switch (direction) {
    case 2:
        this.scrollDown(distance);
        break;
    case 4:
        this.scrollLeft(distance);
        break;
    case 6:
        this.scrollRight(distance);
        break;
    case 8:
        this.scrollUp(distance);
        break;
    }
};

/* 更新事件 */
Game_Map.prototype.updateEvents = function() {
    this.events().forEach(function(event) {
        event.update();
    });
    this._commonEvents.forEach(function(event) {
        event.update();
    });
};

/* 更新载具 */
Game_Map.prototype.updateVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.update();
    });
};

/* 更新远景 */
Game_Map.prototype.updateParallax = function() {
    if (this._parallaxLoopX) {
        this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
    }
    if (this._parallaxLoopY) {
        this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
    }
};

/* 更改图块组 */
Game_Map.prototype.changeTileset = function(tilesetId) {
    this._tilesetId = tilesetId;
    this.refresh();
};

/* 更改战斗背景 */
Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
    this._battleback1Name = battleback1Name;
    this._battleback2Name = battleback2Name;
};

/* 更改远景 */
Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy) {
    this._parallaxName = name;
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    if (this._parallaxLoopX && !loopX) {
        this._parallaxX = 0;
    }
    if (this._parallaxLoopY && !loopY) {
        this._parallaxY = 0;
    }
    this._parallaxLoopX = loopX;
    this._parallaxLoopY = loopY;
    this._parallaxSx = sx;
    this._parallaxSy = sy;
};

/* 更新解释器 */
Game_Map.prototype.updateInterpreter = function() {
    for (;;) {
        this._interpreter.update();
        if (this._interpreter.isRunning()) {
            return;
        }
        if (this._interpreter.eventId() > 0) {
            this.unlockEvent(this._interpreter.eventId());
            this._interpreter.clear();
        }
        if (!this.setupStartingEvent()) {
            return;
        }
    }
};

/* 解锁事件 */
Game_Map.prototype.unlockEvent = function(eventId) {
    if (this._events[eventId]) {
        this._events[eventId].unlock();
    }
};

/* 设置开始的事件 */
Game_Map.prototype.setupStartingEvent = function() {
    this.refreshIfNeeded();
    if (this._interpreter.setupReservedCommonEvent()) {
        return true;
    }
    if (this.setupTestEvent()) {
        return true;
    }
    if (this.setupStartingMapEvent()) {
        return true;
    }
    if (this.setupAutorunCommonEvent()) {
        return true;
    }
    return false;
};

/* 设置测试事件 */
Game_Map.prototype.setupTestEvent = function() {
    if ($testEvent) {
        this._interpreter.setup($testEvent, 0);
        $testEvent = null;
        return true;
    }
    return false;
};

/* 设置开始的地图事件 */
Game_Map.prototype.setupStartingMapEvent = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.isStarting()) {
            event.clearStartingFlag();
            this._interpreter.setup(event.list(), event.eventId());
            return true;
        }
    }
    return false;
};

/* 设置自动运行的公共事件 */
Game_Map.prototype.setupAutorunCommonEvent = function() {
    for (var i = 0; i < $dataCommonEvents.length; i++) {
        var event = $dataCommonEvents[i];
        if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
            this._interpreter.setup(event.list);
            return true;
        }
    }
    return false;
};

/* 是否有事件开始 */
Game_Map.prototype.isAnyEventStarting = function() {
    return this.events().some(function(event) {
        return event.isStarting();
    });
};

//-----------------------------------------------------------------------------
// 游戏_公共事件
// Game_CommonEvent
//
// 公共事件的游戏对象类。它包含运行并行处理事件的功能。
// The game object class for a common event. It contains functionality for
// running parallel process events.

function Game_CommonEvent() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_CommonEvent.prototype.initialize = function(commonEventId) {
    this._commonEventId = commonEventId;
    this.refresh();
};

/* 事件 */
Game_CommonEvent.prototype.event = function() {
    return $dataCommonEvents[this._commonEventId];
};

/* 列表 */
Game_CommonEvent.prototype.list = function() {
    return this.event().list;
};

/* 刷新 */
Game_CommonEvent.prototype.refresh = function() {
    if (this.isActive()) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
        }
    } else {
        this._interpreter = null;
    }
};

/* 是否激活 */
Game_CommonEvent.prototype.isActive = function() {
    var event = this.event();
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};

/* 更新 */
Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list());
        }
        this._interpreter.update();
    }
};

//-----------------------------------------------------------------------------
// 游戏_人物基础 
// Game_CharacterBase
//
// Game_Character 的父类。它处理所有人物共享的基本信息，如坐标和图像。 
// The superclass of Game_Character. It handles basic information, such as
// coordinates and images, shared by all characters.

function Game_CharacterBase() {
    this.initialize.apply(this, arguments);
}

Object.defineProperties(Game_CharacterBase.prototype, {
    x: { get: function() { return this._x; }, configurable: true },
    y: { get: function() { return this._y; }, configurable: true }
});

/* 初始化 */
Game_CharacterBase.prototype.initialize = function() {
    this.initMembers();
};

/* 初始化成员 */
Game_CharacterBase.prototype.initMembers = function() {
    this._x = 0;
    this._y = 0;
    this._realX = 0;
    this._realY = 0;
    this._moveSpeed = 4;
    this._moveFrequency = 6;
    this._opacity = 255;
    this._blendMode = 0;
    this._direction = 2;
    this._pattern = 1;
    this._priorityType = 1;
    this._tileId = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._isObjectCharacter = false;
    this._walkAnime = true;
    this._stepAnime = false;
    this._directionFix = false;
    this._through = false;
    this._transparent = false;
    this._bushDepth = 0;
    this._animationId = 0;
    this._balloonId = 0;
    this._animationPlaying = false;
    this._balloonPlaying = false;
    this._animationCount = 0;
    this._stopCount = 0;
    this._jumpCount = 0;
    this._jumpPeak = 0;
    this._movementSuccess = true;
};

/* 是否该位置 */
Game_CharacterBase.prototype.pos = function(x, y) {
    return this._x === x && this._y === y;
};

/* 是否该位置且不能穿透 */
Game_CharacterBase.prototype.posNt = function(x, y) {
    // No through
    return this.pos(x, y) && !this.isThrough();
};

/* 移动速度 */
Game_CharacterBase.prototype.moveSpeed = function() {
    return this._moveSpeed;
};

/* 设置移动速度 */
Game_CharacterBase.prototype.setMoveSpeed = function(moveSpeed) {
    this._moveSpeed = moveSpeed;
};

/* 移动频率 */
Game_CharacterBase.prototype.moveFrequency = function() {
    return this._moveFrequency;
};

/* 设置移动频率 */
Game_CharacterBase.prototype.setMoveFrequency = function(moveFrequency) {
    this._moveFrequency = moveFrequency;
};

/* 不透明度 */
Game_CharacterBase.prototype.opacity = function() {
    return this._opacity;
};

/* 设置不透明度 */
Game_CharacterBase.prototype.setOpacity = function(opacity) {
    this._opacity = opacity;
};

/* 混合模式 */
Game_CharacterBase.prototype.blendMode = function() {
    return this._blendMode;
};

/* 设置混合模式 */
Game_CharacterBase.prototype.setBlendMode = function(blendMode) {
    this._blendMode = blendMode;
};

/* 是否正常的优先级 */
Game_CharacterBase.prototype.isNormalPriority = function() {
    return this._priorityType === 1;
};

/* 设置优先级类型  */
Game_CharacterBase.prototype.setPriorityType = function(priorityType) {
    this._priorityType = priorityType;
};

/* 是否移动 */
Game_CharacterBase.prototype.isMoving = function() {
    return this._realX !== this._x || this._realY !== this._y;
};

/* 是否跳跃 */
Game_CharacterBase.prototype.isJumping = function() {
    return this._jumpCount > 0;
};

/* 跳跃高度 */
Game_CharacterBase.prototype.jumpHeight = function() {
    return (this._jumpPeak * this._jumpPeak -
            Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
};

/* 是否停止中 */
Game_CharacterBase.prototype.isStopping = function() {
    return !this.isMoving() && !this.isJumping();
};

/* 检测停止 */
Game_CharacterBase.prototype.checkStop = function(threshold) {
    return this._stopCount > threshold;
};

/* 重置停止计数 */
Game_CharacterBase.prototype.resetStopCount = function() {
    this._stopCount = 0;
};

/* 实际移动速度 */
Game_CharacterBase.prototype.realMoveSpeed = function() {
    return this._moveSpeed + (this.isDashing() ? 1 : 0);
};

/* 每帧距离 */
Game_CharacterBase.prototype.distancePerFrame = function() {
    return Math.pow(2, this.realMoveSpeed()) / 256;
};

/* 是否奔跑 */
Game_CharacterBase.prototype.isDashing = function() {
    return false;
};

/* 是否调试穿透 */
Game_CharacterBase.prototype.isDebugThrough = function() {
    return false;
};

/* 端正 */
Game_CharacterBase.prototype.straighten = function() {
    if (this.hasWalkAnime() || this.hasStepAnime()) {
        this._pattern = 1;
    }
    this._animationCount = 0;
};

/* 翻转方向 
 * @param {Number} d 方向（2：下，4：左，6：右，8：上） 
 */
Game_CharacterBase.prototype.reverseDir = function(d) {
    return 10 - d;
};

/* 是否可通行 */
Game_CharacterBase.prototype.canPass = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (!$gameMap.isValid(x2, y2)) {
        return false;
    }
    if (this.isThrough() || this.isDebugThrough()) {
        return true;
    }
    if (!this.isMapPassable(x, y, d)) {
        return false;
    }
    if (this.isCollidedWithCharacters(x2, y2)) {
        return false;
    }
    return true;
};

/* 斜向是否可通行 */
Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
    var x2 = $gameMap.roundXWithDirection(x, horz);
    var y2 = $gameMap.roundYWithDirection(y, vert);
    if (this.canPass(x, y, vert) && this.canPass(x, y2, horz)) {
        return true;
    }
    if (this.canPass(x, y, horz) && this.canPass(x2, y, vert)) {
        return true;
    }
    return false;
};

/* 地图是否可通行 */
Game_CharacterBase.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = this.reverseDir(d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};

/* 是否和人物（事件和载具）碰撞 */
Game_CharacterBase.prototype.isCollidedWithCharacters = function(x, y) {
    return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};

/* 是否和事件碰撞 */
Game_CharacterBase.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.some(function(event) {
        return event.isNormalPriority();
    });
};

/* 是否和载具碰撞 */
Game_CharacterBase.prototype.isCollidedWithVehicles = function(x, y) {
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};

/* 设置位置 */
Game_CharacterBase.prototype.setPosition = function(x, y) {
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._realX = x;
    this._realY = y;
};

/* 复制位置 */
Game_CharacterBase.prototype.copyPosition = function(character) {
    this._x = character._x;
    this._y = character._y;
    this._realX = character._realX;
    this._realY = character._realY;
    this._direction = character._direction;
};

/* 放置 */
Game_CharacterBase.prototype.locate = function(x, y) {
    this.setPosition(x, y);
    this.straighten();
    this.refreshBushDepth();
};

/* 距离 */
Game_CharacterBase.prototype.direction = function() {
    return this._direction;
};

/* 设置距离 */
Game_CharacterBase.prototype.setDirection = function(d) {
    if (!this.isDirectionFixed() && d) {
        this._direction = d;
    }
    this.resetStopCount();
};

/* 是否图块 */
Game_CharacterBase.prototype.isTile = function() {
    return this._tileId > 0 && this._priorityType === 0;
};

/* 是否物体的行走图 */
Game_CharacterBase.prototype.isObjectCharacter = function() {
    return this._isObjectCharacter;
};

/* Y 轴偏移像素 */
Game_CharacterBase.prototype.shiftY = function() {
    return this.isObjectCharacter() ? 0 : 6;
};

/* 滚动 X 坐标 */
Game_CharacterBase.prototype.scrolledX = function() {
    return $gameMap.adjustX(this._realX);
};

/* 滚动 Y 坐标 */
Game_CharacterBase.prototype.scrolledY = function() {
    return $gameMap.adjustY(this._realY);
};

/* 画面 X 坐标 */
Game_CharacterBase.prototype.screenX = function() {
    var tw = $gameMap.tileWidth();
    return Math.round(this.scrolledX() * tw + tw / 2);
};

/* 画面 Y 坐标 */
Game_CharacterBase.prototype.screenY = function() {
    var th = $gameMap.tileHeight();
    return Math.round(this.scrolledY() * th + th -
                      this.shiftY() - this.jumpHeight());
};

/* 画面 Z 坐标 */
Game_CharacterBase.prototype.screenZ = function() {
    return this._priorityType * 2 + 1;
}; 

/* 是否在画面附近 */
Game_CharacterBase.prototype.isNearTheScreen = function() {
    var gw = Graphics.width;
    var gh = Graphics.height;
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var px = this.scrolledX() * tw + tw / 2 - gw / 2;
    var py = this.scrolledY() * th + th / 2 - gh / 2;
    return px >= -gw && px <= gw && py >= -gh && py <= gh;
};

/* 更新 */
Game_CharacterBase.prototype.update = function() {
    if (this.isStopping()) {
        this.updateStop();
    }
    if (this.isJumping()) {
        this.updateJump();
    } else if (this.isMoving()) {
        this.updateMove();
    }
    this.updateAnimation();
};

/* 更新停止 */
Game_CharacterBase.prototype.updateStop = function() {
    this._stopCount++;
};

/* 更新跳跃 */
Game_CharacterBase.prototype.updateJump = function() {
    this._jumpCount--;
    this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
    this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
    this.refreshBushDepth();
    if (this._jumpCount === 0) {
        this._realX = this._x = $gameMap.roundX(this._x);
        this._realY = this._y = $gameMap.roundY(this._y);
    }
};

/* 更新移动 */
Game_CharacterBase.prototype.updateMove = function() {
    if (this._x < this._realX) {
        this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
    }
    if (this._x > this._realX) {
        this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
    }
    if (this._y < this._realY) {
        this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
    }
    if (this._y > this._realY) {
        this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
    }
    if (!this.isMoving()) {
        this.refreshBushDepth();
    }
};

/* 更新动画 */
Game_CharacterBase.prototype.updateAnimation = function() {
    this.updateAnimationCount();
    if (this._animationCount >= this.animationWait()) {
        this.updatePattern();
        this._animationCount = 0;
    }
};

/* 动画等待 */
Game_CharacterBase.prototype.animationWait = function() {
    return (9 - this.realMoveSpeed()) * 3;
};

/* 更新动画计数 */
Game_CharacterBase.prototype.updateAnimationCount = function() {
    if (this.isMoving() && this.hasWalkAnime()) {
        this._animationCount += 1.5;
    } else if (this.hasStepAnime() || !this.isOriginalPattern()) {
        this._animationCount++;
    }
};

/* 更新图案 */
Game_CharacterBase.prototype.updatePattern = function() {
    if (!this.hasStepAnime() && this._stopCount > 0) {
        this.resetPattern();
    } else {
        this._pattern = (this._pattern + 1) % this.maxPattern();
    }
};

/* 最大图案数
 * 行走图一个动画的最大图案数，也可以说是帧数。
 */
Game_CharacterBase.prototype.maxPattern = function() {
    return 4;
};

/* 图案
 * 当前行走图动画显示第几帧图案。一个动画 4 帧，资源图片只有 3 帧，第 4 帧与第 2 帧一样（ 第 1 帧 _pattern 为 0）。
 */
Game_CharacterBase.prototype.pattern = function() {
    return this._pattern < 3 ? this._pattern : 1;
};

/* 设置图案 */
Game_CharacterBase.prototype.setPattern = function(pattern) {
    this._pattern = pattern;
};

/* 是否起始图案 */
Game_CharacterBase.prototype.isOriginalPattern = function() {
    return this.pattern() === 1;
};

/* 重置图案 */
Game_CharacterBase.prototype.resetPattern = function() {
    this.setPattern(1);
};

/* 刷新草木繁茂处深度 */
Game_CharacterBase.prototype.refreshBushDepth = function() {
    if (this.isNormalPriority() && !this.isObjectCharacter() &&
            this.isOnBush() && !this.isJumping()) {
        if (!this.isMoving()) {
            this._bushDepth = 12;
        }
    } else {
        this._bushDepth = 0;
    }
};

/* 是否在梯子上 */
Game_CharacterBase.prototype.isOnLadder = function() {
    return $gameMap.isLadder(this._x, this._y);
};

/* 是否在草木繁茂处上 */
Game_CharacterBase.prototype.isOnBush = function() {
    return $gameMap.isBush(this._x, this._y);
};

/* 地形标志 */
Game_CharacterBase.prototype.terrainTag = function() {
    return $gameMap.terrainTag(this._x, this._y);
};

/* 区域 ID */
Game_CharacterBase.prototype.regionId = function() {
    return $gameMap.regionId(this._x, this._y);
};

/* 增加步数 */
Game_CharacterBase.prototype.increaseSteps = function() {
    if (this.isOnLadder()) {
        this.setDirection(8);
    }
    this.resetStopCount();
    this.refreshBushDepth();
};

/* 图块 ID */
Game_CharacterBase.prototype.tileId = function() {
    return this._tileId;
};

/* 行走图名称 */
Game_CharacterBase.prototype.characterName = function() {
    return this._characterName;
};

/* 行走图索引 */
Game_CharacterBase.prototype.characterIndex = function() {
    return this._characterIndex;
};

/* 设置图像 */
Game_CharacterBase.prototype.setImage = function(characterName, characterIndex) {
    this._tileId = 0;
    this._characterName = characterName;
    this._characterIndex = characterIndex;
    this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
};

/* 设置图块图像 */
Game_CharacterBase.prototype.setTileImage = function(tileId) {
    this._tileId = tileId;
    this._characterName = '';
    this._characterIndex = 0;
    this._isObjectCharacter = true;
};

/* 检测前方的接触的事件触发条件 */
Game_CharacterBase.prototype.checkEventTriggerTouchFront = function(d) {
    var x2 = $gameMap.roundXWithDirection(this._x, d);
    var y2 = $gameMap.roundYWithDirection(this._y, d);
    this.checkEventTriggerTouch(x2, y2);
};

/* 检测接触的事件触发条件*/
Game_CharacterBase.prototype.checkEventTriggerTouch = function(x, y) {
    return false;
};

/* 是否移动成功 */
Game_CharacterBase.prototype.isMovementSucceeded = function(x, y) {
    return this._movementSuccess;
};

/* 设置移动成功*/
Game_CharacterBase.prototype.setMovementSuccess = function(success) {
    this._movementSuccess = success;
};

/* 直线移动 */
Game_CharacterBase.prototype.moveStraight = function(d) {
    this.setMovementSuccess(this.canPass(this._x, this._y, d));
    if (this.isMovementSucceeded()) {
        this.setDirection(d);
        this._x = $gameMap.roundXWithDirection(this._x, d);
        this._y = $gameMap.roundYWithDirection(this._y, d);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        this.increaseSteps();
    } else {
        this.setDirection(d);
        this.checkEventTriggerTouchFront(d);
    }
};

/* 斜线移动 */
Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
    this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
    if (this.isMovementSucceeded()) {
        this._x = $gameMap.roundXWithDirection(this._x, horz);
        this._y = $gameMap.roundYWithDirection(this._y, vert);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
        this.increaseSteps();
    }
    if (this._direction === this.reverseDir(horz)) {
        this.setDirection(horz);
    }
    if (this._direction === this.reverseDir(vert)) {
        this.setDirection(vert);
    }
};

/* 跳跃 */
Game_CharacterBase.prototype.jump = function(xPlus, yPlus) {
    if (Math.abs(xPlus) > Math.abs(yPlus)) {
        if (xPlus !== 0) {
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    } else {
        if (yPlus !== 0) {
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    this._x += xPlus;
    this._y += yPlus;
    var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
    this._jumpPeak = 10 + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
    this.resetStopCount();
    this.straighten();
};

/* 是否有行走动画 */
Game_CharacterBase.prototype.hasWalkAnime = function() {
    return this._walkAnime;
};

/* 设置行走动画 */
Game_CharacterBase.prototype.setWalkAnime = function(walkAnime) {
    this._walkAnime = walkAnime;
};

/* 是否有踏步动画 */
Game_CharacterBase.prototype.hasStepAnime = function() {
    return this._stepAnime;
};

/* 设置踏步动画 */
Game_CharacterBase.prototype.setStepAnime = function(stepAnime) {
    this._stepAnime = stepAnime;
};

/* 是否方向固定 */
Game_CharacterBase.prototype.isDirectionFixed = function() {
    return this._directionFix;
};

/* 设置方向固定 */
Game_CharacterBase.prototype.setDirectionFix = function(directionFix) {
    this._directionFix = directionFix;
};

/* 是否穿透 */
Game_CharacterBase.prototype.isThrough = function() {
    return this._through;
};

/* 设置穿透 */
Game_CharacterBase.prototype.setThrough = function(through) {
    this._through = through;
};

/* 是否透明 */
Game_CharacterBase.prototype.isTransparent = function() {
    return this._transparent;
};

/* 草木繁茂处深度 */
Game_CharacterBase.prototype.bushDepth = function() {
    return this._bushDepth;
};

/* 设置透明 */
Game_CharacterBase.prototype.setTransparent = function(transparent) {
    this._transparent = transparent;
};

/* 请求动画 */
Game_CharacterBase.prototype.requestAnimation = function(animationId) {
    this._animationId = animationId;
};

/* 请求气泡图标 */
Game_CharacterBase.prototype.requestBalloon = function(balloonId) {
    this._balloonId = balloonId;
};

/* 动画 ID */
Game_CharacterBase.prototype.animationId = function() {
    return this._animationId;
};

/* 气泡图标 ID */
Game_CharacterBase.prototype.balloonId = function() {
    return this._balloonId;
};

/* 开始动画 */
Game_CharacterBase.prototype.startAnimation = function() {
    this._animationId = 0;
    this._animationPlaying = true;
};

/* 开始气泡图标 */
Game_CharacterBase.prototype.startBalloon = function() {
    this._balloonId = 0;
    this._balloonPlaying = true;
};

/* 是否动画播放中 */
Game_CharacterBase.prototype.isAnimationPlaying = function() {
    return this._animationId > 0 || this._animationPlaying;
};

/* 是否气泡图标播放中 */
Game_CharacterBase.prototype.isBalloonPlaying = function() {
    return this._balloonId > 0 || this._balloonPlaying;
};

/* 结束动画 */
Game_CharacterBase.prototype.endAnimation = function() {
    this._animationPlaying = false;
};

/* 结束气泡图标 */
Game_CharacterBase.prototype.endBalloon = function() {
    this._balloonPlaying = false;
};

//-----------------------------------------------------------------------------
// 游戏_人物
// Game_Character
// 
// Game_Player、Game_Follower、GameVehicle 和 Game_Event 的父类。
// The superclass of Game_Player, Game_Follower, GameVehicle, and Game_Event.

function Game_Character() {
    this.initialize.apply(this, arguments);
}

Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
Game_Character.prototype.constructor = Game_Character;

Game_Character.ROUTE_END               = 0;   // 移动路线-结束 
Game_Character.ROUTE_MOVE_DOWN         = 1;   // 移动路线-向下移动 
Game_Character.ROUTE_MOVE_LEFT         = 2;   // 移动路线-向左移动 
Game_Character.ROUTE_MOVE_RIGHT        = 3;   // 移动路线-向右移动 
Game_Character.ROUTE_MOVE_UP           = 4;   // 移动路线-向上移动 
Game_Character.ROUTE_MOVE_LOWER_L      = 5;   // 移动路线-向左下移动 
Game_Character.ROUTE_MOVE_LOWER_R      = 6;   // 移动路线-向右下移动 
Game_Character.ROUTE_MOVE_UPPER_L      = 7;   // 移动路线-向左上移动 
Game_Character.ROUTE_MOVE_UPPER_R      = 8;   // 移动路线-向右上移动 
Game_Character.ROUTE_MOVE_RANDOM       = 9;   // 移动路线-随机移动 
Game_Character.ROUTE_MOVE_TOWARD       = 10;  // 移动路线-接近玩家 
Game_Character.ROUTE_MOVE_AWAY         = 11;  // 移动路线-远离玩家 
Game_Character.ROUTE_MOVE_FORWARD      = 12;  // 移动路线-前进一步 
Game_Character.ROUTE_MOVE_BACKWARD     = 13;  // 移动路线-后退一步 
Game_Character.ROUTE_JUMP              = 14;  // 移动路线-跳跃 
Game_Character.ROUTE_WAIT              = 15;  // 移动路线-等待 
Game_Character.ROUTE_TURN_DOWN         = 16;  // 移动路线-朝向下方 
Game_Character.ROUTE_TURN_LEFT         = 17;  // 移动路线-朝向左方 
Game_Character.ROUTE_TURN_RIGHT        = 18;  // 移动路线-朝向右方 
Game_Character.ROUTE_TURN_UP           = 19;  // 移动路线-朝向上方 
Game_Character.ROUTE_TURN_90D_R        = 20;  // 移动路线-右转 90° 
Game_Character.ROUTE_TURN_90D_L        = 21;  // 移动路线-左转 90° 
Game_Character.ROUTE_TURN_180D         = 22;  // 移动路线-后转 180° 
Game_Character.ROUTE_TURN_90D_R_L      = 23;  // 移动路线-向左或向右转 90° 
Game_Character.ROUTE_TURN_RANDOM       = 24;  // 移动路线-随机转向 
Game_Character.ROUTE_TURN_TOWARD       = 25;  // 移动路线-朝向玩家 
Game_Character.ROUTE_TURN_AWAY         = 26;  // 移动路线-背向玩家 
Game_Character.ROUTE_SWITCH_ON         = 27;  // 移动路线-打开开关 
Game_Character.ROUTE_SWITCH_OFF        = 28;  // 移动路线-关闭开关 
Game_Character.ROUTE_CHANGE_SPEED      = 29;  // 移动路线-更改移动速度 
Game_Character.ROUTE_CHANGE_FREQ       = 30;  // 移动路线-更改移动频率 
Game_Character.ROUTE_WALK_ANIME_ON     = 31;  // 移动路线-开启步行动画 
Game_Character.ROUTE_WALK_ANIME_OFF    = 32;  // 移动路线-关闭步行动画 
Game_Character.ROUTE_STEP_ANIME_ON     = 33;  // 移动路线-开启踏步动画 
Game_Character.ROUTE_STEP_ANIME_OFF    = 34;  // 移动路线-关闭踏步动画 
Game_Character.ROUTE_DIR_FIX_ON        = 35;  // 移动路线-开启固定朝向 
Game_Character.ROUTE_DIR_FIX_OFF       = 36;  // 移动路线-关闭固定朝向 
Game_Character.ROUTE_THROUGH_ON        = 37;  // 移动路线-开启穿透 
Game_Character.ROUTE_THROUGH_OFF       = 38;  // 移动路线-关闭穿透 
Game_Character.ROUTE_TRANSPARENT_ON    = 39;  // 移动路线-开启透明状态 
Game_Character.ROUTE_TRANSPARENT_OFF   = 40;  // 移动路线-关闭透明状态 
Game_Character.ROUTE_CHANGE_IMAGE      = 41;  // 移动路线-更改图像 
Game_Character.ROUTE_CHANGE_OPACITY    = 42;  // 移动路线-更改不透明度 
Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;  // 移动路线-更改合成方式 
Game_Character.ROUTE_PLAY_SE           = 44;  // 移动路线-播放 SE 
Game_Character.ROUTE_SCRIPT            = 45;  // 移动路线-脚本 

/* 初始化 */
Game_Character.prototype.initialize = function() {
    Game_CharacterBase.prototype.initialize.call(this);
};

/* 初始化成员 */
Game_Character.prototype.initMembers = function() {
    Game_CharacterBase.prototype.initMembers.call(this);
    this._moveRouteForcing = false;
    this._moveRoute = null;
    this._moveRouteIndex = 0;
    this._originalMoveRoute = null;
    this._originalMoveRouteIndex = 0;
    this._waitCount = 0;
};

/* 记录移动路线 */
Game_Character.prototype.memorizeMoveRoute = function() {
    this._originalMoveRoute       = this._moveRoute;
    this._originalMoveRouteIndex  = this._moveRouteIndex;
};

/* 恢复移动路线 */
Game_Character.prototype.restoreMoveRoute = function() {
    this._moveRoute          = this._originalMoveRoute;
    this._moveRouteIndex     = this._originalMoveRouteIndex;
    this._originalMoveRoute  = null;
};

/* 是否强制移动 */
Game_Character.prototype.isMoveRouteForcing = function() {
    return this._moveRouteForcing;
};

/* 设置移动路线 */
Game_Character.prototype.setMoveRoute = function(moveRoute) {
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = false;
};

/* 强制移动路线 */
Game_Character.prototype.forceMoveRoute = function(moveRoute) {
    if (!this._originalMoveRoute) {
        this.memorizeMoveRoute();
    }
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = true;
    this._waitCount = 0;
};

/* 更新停止 */
Game_Character.prototype.updateStop = function() {
    Game_CharacterBase.prototype.updateStop.call(this);
    if (this._moveRouteForcing) {
        this.updateRoutineMove();
    }
};

/* 更新一系列移动 */
Game_Character.prototype.updateRoutineMove = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
    } else {
        this.setMovementSuccess(true);
        var command = this._moveRoute.list[this._moveRouteIndex];
        if (command) {
            this.processMoveCommand(command);
            this.advanceMoveRouteIndex();
        }
    }
};

/* 处理移动指令 */
Game_Character.prototype.processMoveCommand = function(command) {
    var gc = Game_Character;
    var params = command.parameters;
    switch (command.code) {
    case gc.ROUTE_END:
        this.processRouteEnd();
        break;
    case gc.ROUTE_MOVE_DOWN:
        this.moveStraight(2);
        break;
    case gc.ROUTE_MOVE_LEFT:
        this.moveStraight(4);
        break;
    case gc.ROUTE_MOVE_RIGHT:
        this.moveStraight(6);
        break;
    case gc.ROUTE_MOVE_UP:
        this.moveStraight(8);
        break;
    case gc.ROUTE_MOVE_LOWER_L:
        this.moveDiagonally(4, 2);
        break;
    case gc.ROUTE_MOVE_LOWER_R:
        this.moveDiagonally(6, 2);
        break;
    case gc.ROUTE_MOVE_UPPER_L:
        this.moveDiagonally(4, 8);
        break;
    case gc.ROUTE_MOVE_UPPER_R:
        this.moveDiagonally(6, 8);
        break;
    case gc.ROUTE_MOVE_RANDOM:
        this.moveRandom();
        break;
    case gc.ROUTE_MOVE_TOWARD:
        this.moveTowardPlayer();
        break;
    case gc.ROUTE_MOVE_AWAY:
        this.moveAwayFromPlayer();
        break;
    case gc.ROUTE_MOVE_FORWARD:
        this.moveForward();
        break;
    case gc.ROUTE_MOVE_BACKWARD:
        this.moveBackward();
        break;
    case gc.ROUTE_JUMP:
        this.jump(params[0], params[1]);
        break;
    case gc.ROUTE_WAIT:
        this._waitCount = params[0] - 1;
        break;
    case gc.ROUTE_TURN_DOWN:
        this.setDirection(2);
        break;
    case gc.ROUTE_TURN_LEFT:
        this.setDirection(4);
        break;
    case gc.ROUTE_TURN_RIGHT:
        this.setDirection(6);
        break;
    case gc.ROUTE_TURN_UP:
        this.setDirection(8);
        break;
    case gc.ROUTE_TURN_90D_R:
        this.turnRight90();
        break;
    case gc.ROUTE_TURN_90D_L:
        this.turnLeft90();
        break;
    case gc.ROUTE_TURN_180D:
        this.turn180();
        break;
    case gc.ROUTE_TURN_90D_R_L:
        this.turnRightOrLeft90();
        break;
    case gc.ROUTE_TURN_RANDOM:
        this.turnRandom();
        break;
    case gc.ROUTE_TURN_TOWARD:
        this.turnTowardPlayer();
        break;
    case gc.ROUTE_TURN_AWAY:
        this.turnAwayFromPlayer();
        break;
    case gc.ROUTE_SWITCH_ON:
        $gameSwitches.setValue(params[0], true);
        break;
    case gc.ROUTE_SWITCH_OFF:
        $gameSwitches.setValue(params[0], false);
        break;
    case gc.ROUTE_CHANGE_SPEED:
        this.setMoveSpeed(params[0]);
        break;
    case gc.ROUTE_CHANGE_FREQ:
        this.setMoveFrequency(params[0]);
        break;
    case gc.ROUTE_WALK_ANIME_ON:
        this.setWalkAnime(true);
        break;
    case gc.ROUTE_WALK_ANIME_OFF:
        this.setWalkAnime(false);
        break;
    case gc.ROUTE_STEP_ANIME_ON:
        this.setStepAnime(true);
        break;
    case gc.ROUTE_STEP_ANIME_OFF:
        this.setStepAnime(false);
        break;
    case gc.ROUTE_DIR_FIX_ON:
        this.setDirectionFix(true);
        break;
    case gc.ROUTE_DIR_FIX_OFF:
        this.setDirectionFix(false);
        break;
    case gc.ROUTE_THROUGH_ON:
        this.setThrough(true);
        break;
    case gc.ROUTE_THROUGH_OFF:
        this.setThrough(false);
        break;
    case gc.ROUTE_TRANSPARENT_ON:
        this.setTransparent(true);
        break;
    case gc.ROUTE_TRANSPARENT_OFF:
        this.setTransparent(false);
        break;
    case gc.ROUTE_CHANGE_IMAGE:
        this.setImage(params[0], params[1]);
        break;
    case gc.ROUTE_CHANGE_OPACITY:
        this.setOpacity(params[0]);
        break;
    case gc.ROUTE_CHANGE_BLEND_MODE:
        this.setBlendMode(params[0]);
        break;
    case gc.ROUTE_PLAY_SE:
        AudioManager.playSe(params[0]);
        break;
    case gc.ROUTE_SCRIPT:
        eval(params[0]);
        break;
    }
};

/* 与该 X 位置差值 */
Game_Character.prototype.deltaXFrom = function(x) {
    return $gameMap.deltaX(this.x, x);
};

/* 与该 Y 位置差值 */
Game_Character.prototype.deltaYFrom = function(y) {
    return $gameMap.deltaY(this.y, y);
};

/* 随机移动 */
Game_Character.prototype.moveRandom = function() {
    var d = 2 + Math.randomInt(4) * 2;
    if (this.canPass(this.x, this.y, d)) {
        this.moveStraight(d);
    }
};

/* 接近该人物移动 */
Game_Character.prototype.moveTowardCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 4 : 6);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};

/* 远离该人物移动 */
Game_Character.prototype.moveAwayFromCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.moveStraight(sx > 0 ? 6 : 4);
        if (!this.isMovementSucceeded() && sy !== 0) {
            this.moveStraight(sy > 0 ? 2 : 8);
        }
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 2 : 8);
        if (!this.isMovementSucceeded() && sx !== 0) {
            this.moveStraight(sx > 0 ? 6 : 4);
        }
    }
};

/* 朝向该人物 */
Game_Character.prototype.turnTowardCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 8 : 2);
    }
};

/* 背向该人物 */
Game_Character.prototype.turnAwayFromCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (Math.abs(sx) > Math.abs(sy)) {
        this.setDirection(sx > 0 ? 6 : 4);
    } else if (sy !== 0) {
        this.setDirection(sy > 0 ? 2 : 8);
    }
};

/* 朝向玩家 */
Game_Character.prototype.turnTowardPlayer = function() {
    this.turnTowardCharacter($gamePlayer);
};

/* 背向玩家 */
Game_Character.prototype.turnAwayFromPlayer = function() {
    this.turnAwayFromCharacter($gamePlayer);
};

/* 接近玩家 */
Game_Character.prototype.moveTowardPlayer = function() {
    this.moveTowardCharacter($gamePlayer);
};

/* 远离玩家 */
Game_Character.prototype.moveAwayFromPlayer = function() {
    this.moveAwayFromCharacter($gamePlayer);
};

/* 前进一步 */
Game_Character.prototype.moveForward = function() {
    this.moveStraight(this.direction());
};

/* 后退一步 */
Game_Character.prototype.moveBackward = function() {
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.moveStraight(this.reverseDir(this.direction()));
    this.setDirectionFix(lastDirectionFix);
};

/* 处理路线结束 */
Game_Character.prototype.processRouteEnd = function() {
    if (this._moveRoute.repeat) {
        this._moveRouteIndex = -1;
    } else if (this._moveRouteForcing) {
        this._moveRouteForcing = false;
        this.restoreMoveRoute();
    }
};

/* 增加移动路线索引 */
Game_Character.prototype.advanceMoveRouteIndex = function() {
    var moveRoute = this._moveRoute;
    if (moveRoute && (this.isMovementSucceeded() || moveRoute.skippable)) {
        var numCommands = moveRoute.list.length - 1;
        this._moveRouteIndex++;
        if (moveRoute.repeat && this._moveRouteIndex >= numCommands) {
            this._moveRouteIndex = 0;
        }
    }
};

/* 右转 90° */
Game_Character.prototype.turnRight90 = function() {
    switch (this.direction()) {
    case 2:
        this.setDirection(4);
        break;
    case 4:
        this.setDirection(8);
        break;
    case 6:
        this.setDirection(2);
        break;
    case 8:
        this.setDirection(6);
        break;
    }
};

/* 左转 90° */
Game_Character.prototype.turnLeft90 = function() {
    switch (this.direction()) {
    case 2:
        this.setDirection(6);
        break;
    case 4:
        this.setDirection(2);
        break;
    case 6:
        this.setDirection(8);
        break;
    case 8:
        this.setDirection(4);
        break;
    }
};

/* 后转 180° */
Game_Character.prototype.turn180 = function() {
    this.setDirection(this.reverseDir(this.direction()));
};

/* 向左或向右转 90° */
Game_Character.prototype.turnRightOrLeft90 = function() {
    switch (Math.randomInt(2)) {
    case 0:
        this.turnRight90();
        break;
    case 1:
        this.turnLeft90();
        break;
    }
};

/* 随机转向 */
Game_Character.prototype.turnRandom = function() {
    this.setDirection(2 + Math.randomInt(4) * 2);
};

/* 交换
 * 交换两个人的位置。
 */
Game_Character.prototype.swap = function(character) {
    var newX = character.x;
    var newY = character.y;
    character.locate(this.x, this.y);
    this.locate(newX, newY);
};

/* 寻找朝着该位置的方向 
 * 该寻路是 A* 算法的魔改，每走一步查找 12 步内的路径，取出第一步进行行走。 
 */
Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
    var searchLimit = this.searchLimit();
    var mapWidth = $gameMap.width();
    var nodeList = [];
    var openList = [];
    var closedList = [];
    var start = {};
    var best = start;

    if (this.x === goalX && this.y === goalY) {
        return 0;
    }

    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0) {
        var bestIndex = 0;
        for (var i = 0; i < nodeList.length; i++) {
            if (nodeList[i].f < nodeList[bestIndex].f) {
                bestIndex = i;
            }
        }

        var current = nodeList[bestIndex];
        var x1 = current.x;
        var y1 = current.y;
        var pos1 = y1 * mapWidth + x1;
        var g1 = current.g;

        nodeList.splice(bestIndex, 1);
        openList.splice(openList.indexOf(pos1), 1);
        closedList.push(pos1);

        if (current.x === goalX && current.y === goalY) {
            best = current;
            break;
        }

        if (g1 >= searchLimit) {
            continue;
        }

        for (var j = 0; j < 4; j++) {
            var direction = 2 + j * 2;
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            var y2 = $gameMap.roundYWithDirection(y1, direction);
            var pos2 = y2 * mapWidth + x2;

            if (closedList.contains(pos2)) {
                continue;
            }
            if (!this.canPass(x1, y1, direction)) {
                continue;
            }

            var g2 = g1 + 1;
            var index2 = openList.indexOf(pos2);

            if (index2 < 0 || g2 < nodeList[index2].g) {
                var neighbor;
                if (index2 >= 0) {
                    neighbor = nodeList[index2];
                } else {
                    neighbor = {};
                    nodeList.push(neighbor);
                    openList.push(pos2);
                }
                neighbor.parent = current;
                neighbor.x = x2;
                neighbor.y = y2;
                neighbor.g = g2;
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                    best = neighbor;
                }
            }
        }
    }

    var node = best;
    while (node.parent && node.parent !== start) {
        node = node.parent;
    }

    var deltaX1 = $gameMap.deltaX(node.x, start.x);
    var deltaY1 = $gameMap.deltaY(node.y, start.y);
    if (deltaY1 > 0) {
        return 2;
    } else if (deltaX1 < 0) {
        return 4;
    } else if (deltaX1 > 0) {
        return 6;
    } else if (deltaY1 < 0) {
        return 8;
    }

    var deltaX2 = this.deltaXFrom(goalX);
    var deltaY2 = this.deltaYFrom(goalY);
    if (Math.abs(deltaX2) > Math.abs(deltaY2)) {
        return deltaX2 > 0 ? 4 : 6;
    } else if (deltaY2 !== 0) {
        return deltaY2 > 0 ? 8 : 2;
    }

    return 0;
};

/* 查找上限 */
Game_Character.prototype.searchLimit = function() {
    return 12;
};

//-----------------------------------------------------------------------------
// 游戏_玩家 
// Game_Player
//
// 玩家的游戏对象类。它包含事件开始判定和地图滚动功能。
// The game object class for the player. It contains event starting
// determinants and map scrolling functions.

function Game_Player() {
    this.initialize.apply(this, arguments);
}

Game_Player.prototype = Object.create(Game_Character.prototype);
Game_Player.prototype.constructor = Game_Player;

/* 初始化 */
Game_Player.prototype.initialize = function() {
    Game_Character.prototype.initialize.call(this);
    this.setTransparent($dataSystem.optTransparent);
};

/* 初始化成员 */
Game_Player.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._vehicleType = 'walk';
    this._vehicleGettingOn = false;
    this._vehicleGettingOff = false;
    this._dashing = false;
    this._needsMapReload = false;
    this._transferring = false;
    this._newMapId = 0;
    this._newX = 0;
    this._newY = 0;
    this._newDirection = 0;
    this._fadeType = 0;
    this._followers = new Game_Followers();
    this._encounterCount = 0;
};

/* 清除场所移动信息 */
Game_Player.prototype.clearTransferInfo = function() {
    this._transferring = false;
    this._newMapId = 0;
    this._newX = 0;
    this._newY = 0;
    this._newDirection = 0;
};

/* 跟随者 */
Game_Player.prototype.followers = function() {
    return this._followers;
};

/* 刷新 */
Game_Player.prototype.refresh = function() {
    var actor = $gameParty.leader();
    var characterName = actor ? actor.characterName() : '';
    var characterIndex = actor ? actor.characterIndex() : 0;
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
};

/* 是否停止中 */
Game_Player.prototype.isStopping = function() {
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    return Game_Character.prototype.isStopping.call(this);
};

/* 储存场所移动 */
Game_Player.prototype.reserveTransfer = function(mapId, x, y, d, fadeType) {
    this._transferring = true;
    this._newMapId = mapId;
    this._newX = x;
    this._newY = y;
    this._newDirection = d;
    this._fadeType = fadeType;
};

/* 请求地图重载 */
Game_Player.prototype.requestMapReload = function() {
    this._needsMapReload = true;
};

/* 是否场所移动中 */
Game_Player.prototype.isTransferring = function() {
    return this._transferring;
};

/* 新地图 ID */
Game_Player.prototype.newMapId = function() {
    return this._newMapId;
};

/* 渐变类型 */
Game_Player.prototype.fadeType = function() {
    return this._fadeType;
};

/* 表现场所移动 */
Game_Player.prototype.performTransfer = function() {
    if (this.isTransferring()) {
        this.setDirection(this._newDirection);
        if (this._newMapId !== $gameMap.mapId() || this._needsMapReload) {
            $gameMap.setup(this._newMapId);
            this._needsMapReload = false;
        }
        this.locate(this._newX, this._newY);
        this.refresh();
        this.clearTransferInfo();
    }
};

/* 是否地图可通行 */
Game_Player.prototype.isMapPassable = function(x, y, d) {
    var vehicle = this.vehicle();
    if (vehicle) {
        return vehicle.isMapPassable(x, y, d);
    } else {
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};

/* 载具 */
Game_Player.prototype.vehicle = function() {
    return $gameMap.vehicle(this._vehicleType);
};

/* 是否在小舟 */
Game_Player.prototype.isInBoat = function() {
    return this._vehicleType === 'boat';
};

/* 是否在大船 */
Game_Player.prototype.isInShip = function() {
    return this._vehicleType === 'ship';
};

/* 是否在飞艇 */
Game_Player.prototype.isInAirship = function() {
    return this._vehicleType === 'airship';
};

/* 是否在载具 */
Game_Player.prototype.isInVehicle = function() {
    return this.isInBoat() || this.isInShip() || this.isInAirship();
};

/* 是否普通 */
Game_Player.prototype.isNormal = function() {
    return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
};

/* 是否奔跑 */
Game_Player.prototype.isDashing = function() {
    return this._dashing;
};

/* 是否调试穿透 
 * 在调试模式下，按 ctrl 可使玩家穿透。
 */
Game_Player.prototype.isDebugThrough = function() {
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};

/* 是否碰撞 */
Game_Player.prototype.isCollided = function(x, y) {
    if (this.isThrough()) {
        return false;
    } else {
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
};

/* 中心 X 位置*/
Game_Player.prototype.centerX = function() {
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};

/* 中心 Y 位置*/
Game_Player.prototype.centerY = function() {
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};

/* 中心位置 */
Game_Player.prototype.center = function(x, y) {
    return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};

/* 放置 */
Game_Player.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    this.makeEncounterCount();
    if (this.isInVehicle()) {
        this.vehicle().refresh();
    }
    this._followers.synchronize(x, y, this.direction());
};

/* 增加步数 */
Game_Player.prototype.increaseSteps = function() {
    Game_Character.prototype.increaseSteps.call(this);
    if (this.isNormal()) {
        $gameParty.increaseSteps();
    }
};

/* 制作遇敌计数 */
Game_Player.prototype.makeEncounterCount = function() {
    var n = $gameMap.encounterStep();
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};

/* 制作遇敌敌群 ID */
Game_Player.prototype.makeEncounterTroopId = function() {
    var encounterList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function(encounter) {
        if (this.meetsEncounterConditions(encounter)) {
            encounterList.push(encounter);
            weightSum += encounter.weight;
        }
    }, this);
    if (weightSum > 0) {
        var value = Math.randomInt(weightSum);
        for (var i = 0; i < encounterList.length; i++) {
            value -= encounterList[i].weight;
            if (value < 0) {
                return encounterList[i].troopId;
            }
        }
    }
    return 0;
};

/* 是否满足遇敌条件 */
Game_Player.prototype.meetsEncounterConditions = function(encounter) {
    return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
};

/* 执行遇敌 */
Game_Player.prototype.executeEncounter = function() {
    if (!$gameMap.isEventRunning() && this._encounterCount <= 0) {
        this.makeEncounterCount();
        var troopId = this.makeEncounterTroopId();
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, true, false);
            BattleManager.onEncounter();
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

/* 开始地图事件 */
Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
    if (!$gameMap.isEventRunning()) {
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isTriggerIn(triggers) && event.isNormalPriority() === normal) {
                event.start();
            }
        });
    }
};

/* 随着输入移动 */
Game_Player.prototype.moveByInput = function() {
    if (!this.isMoving() && this.canMove()) {
        var direction = this.getInputDirection();
        if (direction > 0) {
            $gameTemp.clearDestination();
        } else if ($gameTemp.isDestinationValid()){
            var x = $gameTemp.destinationX();
            var y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);
        }
        if (direction > 0) {
            this.executeMove(direction);
        }
    }
};

/* 是否可移动 */
Game_Player.prototype.canMove = function() {
    if ($gameMap.isEventRunning() || $gameMessage.isBusy()) {
        return false;
    }
    if (this.isMoveRouteForcing() || this.areFollowersGathering()) {
        return false;
    }
    if (this._vehicleGettingOn || this._vehicleGettingOff) {
        return false;
    }
    if (this.isInVehicle() && !this.vehicle().canMove()) {
        return false;
    }
    return true;
};

/* 获取输入的方向 */
Game_Player.prototype.getInputDirection = function() {
    return Input.dir4;
};

/* 执行移动 */
Game_Player.prototype.executeMove = function(direction) {
    this.moveStraight(direction);
};

/* 更新 */
Game_Player.prototype.update = function(sceneActive) {
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this.isMoving();
    this.updateDashing();
    if (sceneActive) {
        this.moveByInput();
    }
    Game_Character.prototype.update.call(this);
    this.updateScroll(lastScrolledX, lastScrolledY);
    this.updateVehicle();
    if (!this.isMoving()) {
        this.updateNonmoving(wasMoving);
    }
    this._followers.update();
};

/* 更新奔跑 */
Game_Player.prototype.updateDashing = function() {
    if (this.isMoving()) {
        return;
    }
    if (this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled()) {
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    } else {
        this._dashing = false;
    }
};

/* 是否奔跑按键按下 */
Game_Player.prototype.isDashButtonPressed = function() {
    var shift = Input.isPressed('shift');
    if (ConfigManager.alwaysDash) {
        return !shift;
    } else {
        return shift;
    }
};

/* 更新滚动 */
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    if (y2 > y1 && y2 > this.centerY()) {
        $gameMap.scrollDown(y2 - y1);
    }
    if (x2 < x1 && x2 < this.centerX()) {
        $gameMap.scrollLeft(x1 - x2);
    }
    if (x2 > x1 && x2 > this.centerX()) {
        $gameMap.scrollRight(x2 - x1);
    }
    if (y2 < y1 && y2 < this.centerY()) {
        $gameMap.scrollUp(y1 - y2);
    }
};

/* 更新载具 */
Game_Player.prototype.updateVehicle = function() {
    if (this.isInVehicle() && !this.areFollowersGathering()) {
        if (this._vehicleGettingOn) {
            this.updateVehicleGetOn();
        } else if (this._vehicleGettingOff) {
            this.updateVehicleGetOff();
        } else {
            this.vehicle().syncWithPlayer();
        }
    }
};

/* 更新上载具 */
Game_Player.prototype.updateVehicleGetOn = function() {
    if (!this.areFollowersGathering() && !this.isMoving()) {
        this.setDirection(this.vehicle().direction());
        this.setMoveSpeed(this.vehicle().moveSpeed());
        this._vehicleGettingOn = false;
        this.setTransparent(true);
        if (this.isInAirship()) {
            this.setThrough(true);
        }
        this.vehicle().getOn();
    }
};

/* 更新下载具 */
Game_Player.prototype.updateVehicleGetOff = function() {
    if (!this.areFollowersGathering() && this.vehicle().isLowest()) {
        this._vehicleGettingOff = false;
        this._vehicleType = 'walk';
        this.setTransparent(false);
    }
};

/* 更新不移动 */
Game_Player.prototype.updateNonmoving = function(wasMoving) {
    if (!$gameMap.isEventRunning()) {
        if (wasMoving) {
            $gameParty.onPlayerWalk();
            this.checkEventTriggerHere([1,2]);
            if ($gameMap.setupStartingEvent()) {
                return;
            }
        }
        if (this.triggerAction()) {
            return;
        }
        if (wasMoving) {
            this.updateEncounterCount();
        } else {
            $gameTemp.clearDestination();
        }
    }
};

/* 触发行动 */
Game_Player.prototype.triggerAction = function() {
    if (this.canMove()) {
        if (this.triggerButtonAction()) {
            return true;
        }
        if (this.triggerTouchAction()) {
            return true;
        }
    }
    return false;
};

/* 触发按键行为 */
Game_Player.prototype.triggerButtonAction = function() {
    if (Input.isTriggered('ok')) {
        if (this.getOnOffVehicle()) {
            return true;
        }
        this.checkEventTriggerHere([0]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
        this.checkEventTriggerThere([0,1,2]);
        if ($gameMap.setupStartingEvent()) {
            return true;
        }
    }
    return false;
};

/* 触发触摸行为 */
Game_Player.prototype.triggerTouchAction = function() {
    if ($gameTemp.isDestinationValid()){
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        var x3 = $gameMap.roundXWithDirection(x2, direction);
        var y3 = $gameMap.roundYWithDirection(y2, direction);
        var destX = $gameTemp.destinationX();
        var destY = $gameTemp.destinationY();
        if (destX === x1 && destY === y1) {
            return this.triggerTouchActionD1(x1, y1);
        } else if (destX === x2 && destY === y2) {
            return this.triggerTouchActionD2(x2, y2);
        } else if (destX === x3 && destY === y3) {
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    return false;
};

/* 触发触摸行为 D1 */
Game_Player.prototype.triggerTouchActionD1 = function(x1, y1) {
    if ($gameMap.airship().pos(x1, y1)) {
        if (TouchInput.isTriggered() && this.getOnOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerHere([0]);
    return $gameMap.setupStartingEvent();
};

/* 触发触摸行为 D2 */
Game_Player.prototype.triggerTouchActionD2 = function(x2, y2) {
    if ($gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2)) {
        if (TouchInput.isTriggered() && this.getOnVehicle()) {
            return true;
        }
    }
    if (this.isInBoat() || this.isInShip()) {
        if (TouchInput.isTriggered() && this.getOffVehicle()) {
            return true;
        }
    }
    this.checkEventTriggerThere([0,1,2]);
    return $gameMap.setupStartingEvent();
};

/* 触发触摸行为 D3 */
Game_Player.prototype.triggerTouchActionD3 = function(x2, y2) {
    if ($gameMap.isCounter(x2, y2)) {
        this.checkEventTriggerThere([0,1,2]);
    }
    return $gameMap.setupStartingEvent();
};

/* 更新遇敌计数 */
Game_Player.prototype.updateEncounterCount = function() {
    if (this.canEncounter()) {
        this._encounterCount -= this.encounterProgressValue();
    }
};

/* 是否能遇敌 */
Game_Player.prototype.canEncounter = function() {
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
};

/* 遇敌进度值 */
Game_Player.prototype.encounterProgressValue = function() {
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    if ($gameParty.hasEncounterHalf()) {
        value *= 0.5;
    }
    if (this.isInShip()) {
        value *= 0.5;
    }
    return value;
};

/* 检测这里（玩家位置）的事件触发条件 */
Game_Player.prototype.checkEventTriggerHere = function(triggers) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};

/* 检测那里（玩家前方位置）的事件触发条件 */
Game_Player.prototype.checkEventTriggerThere = function(triggers) {
    if (this.canStartLocalEvents()) {
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        this.startMapEvent(x2, y2, triggers, true);
        if (!$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2)) {
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};

/* 检测接触的事件触发条件 */
Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
    if (this.canStartLocalEvents()) {
        this.startMapEvent(x, y, [1,2], true);
    }
};

/* 是否能开始本地事件 */
Game_Player.prototype.canStartLocalEvents = function() {
    return !this.isInAirship();
};

/* 上下载具 */
Game_Player.prototype.getOnOffVehicle = function() {
    if (this.isInVehicle()) {
        return this.getOffVehicle();
    } else {
        return this.getOnVehicle();
    }
};

/* 上载具 */
Game_Player.prototype.getOnVehicle = function() {
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if ($gameMap.airship().pos(x1, y1)) {
        this._vehicleType = 'airship';
    } else if ($gameMap.ship().pos(x2, y2)) {
        this._vehicleType = 'ship';
    } else if ($gameMap.boat().pos(x2, y2)) {
        this._vehicleType = 'boat';
    }
    if (this.isInVehicle()) {
        this._vehicleGettingOn = true;
        if (!this.isInAirship()) {
            this.forceMoveForward();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};

/* 下载具 */
Game_Player.prototype.getOffVehicle = function() {
    if (this.vehicle().isLandOk(this.x, this.y, this.direction())) {
        if (this.isInAirship()) {
            this.setDirection(2);
        }
        this._followers.synchronize(this.x, this.y, this.direction());
        this.vehicle().getOff();
        if (!this.isInAirship()) {
            this.forceMoveForward();
            this.setTransparent(false);
        }
        this._vehicleGettingOff = true;
        this.setMoveSpeed(4);
        this.setThrough(false);
        this.makeEncounterCount();
        this.gatherFollowers();
    }
    return this._vehicleGettingOff;
};

/* 强制向前移动 */
Game_Player.prototype.forceMoveForward = function() {
    this.setThrough(true);
    this.moveForward();
    this.setThrough(false);
};

/* 是否在有害地形 */
Game_Player.prototype.isOnDamageFloor = function() {
    return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};

/* 直线移动 */
Game_Player.prototype.moveStraight = function(d) {
    if (this.canPass(this.x, this.y, d)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveStraight.call(this, d);
};

/* 斜线移动 */
Game_Player.prototype.moveDiagonally = function(horz, vert) {
    if (this.canPassDiagonally(this.x, this.y, horz, vert)) {
        this._followers.updateMove();
    }
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};

/* 跳跃 */
Game_Player.prototype.jump = function(xPlus, yPlus) {
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    this._followers.jumpAll();
};

/* 显示跟随者 */
Game_Player.prototype.showFollowers = function() {
    this._followers.show();
};

/* 隐藏跟随者 */
Game_Player.prototype.hideFollowers = function() {
    this._followers.hide();
};

/* 集合跟随者 */
Game_Player.prototype.gatherFollowers = function() {
    this._followers.gather();
};

/* 是否跟随者集合中 */
Game_Player.prototype.areFollowersGathering = function() {
    return this._followers.areGathering();
};

/* 是否跟随者集合了 */
Game_Player.prototype.areFollowersGathered = function() {
    return this._followers.areGathered();
};

//-----------------------------------------------------------------------------
// 游戏_跟随者
// Game_Follower
//
// 跟随者的游戏对象类。
// The game object class for a follower. A follower is an allied character,
// other than the front character, displayed in the party.

function Game_Follower() {
    this.initialize.apply(this, arguments);
}

Game_Follower.prototype = Object.create(Game_Character.prototype);
Game_Follower.prototype.constructor = Game_Follower;

/* 初始化 */
Game_Follower.prototype.initialize = function(memberIndex) {
    Game_Character.prototype.initialize.call(this);
    this._memberIndex = memberIndex;
    this.setTransparent($dataSystem.optTransparent);
    this.setThrough(true);
};

/* 刷新 */
Game_Follower.prototype.refresh = function() {
    var characterName = this.isVisible() ? this.actor().characterName() : '';
    var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
    this.setImage(characterName, characterIndex);
};

/* 角色 */
Game_Follower.prototype.actor = function() {
    return $gameParty.battleMembers()[this._memberIndex];
};

/* 是否可见的 */
Game_Follower.prototype.isVisible = function() {
    return this.actor() && $gamePlayer.followers().isVisible();
};

/* 更新 */
Game_Follower.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
};

/* 追逐人物 */
Game_Follower.prototype.chaseCharacter = function(character) {
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if (sx !== 0 && sy !== 0) {
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    } else if (sx !== 0) {
        this.moveStraight(sx > 0 ? 4 : 6);
    } else if (sy !== 0) {
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
};

//-----------------------------------------------------------------------------
// 游戏_跟随者们 
// Game_Followers
//
// 跟随者数组的封装类。 
// The wrapper class for a follower array.

function Game_Followers() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Followers.prototype.initialize = function() {
    this._visible = $dataSystem.optFollowers;
    this._gathering = false;
    this._data = [];
    for (var i = 1; i < $gameParty.maxBattleMembers(); i++) {
        this._data.push(new Game_Follower(i));
    }
};

/* 是否可见的 */
Game_Followers.prototype.isVisible = function() {
    return this._visible;
};

/* 显示 */
Game_Followers.prototype.show = function() {
    this._visible = true;
};

/* 隐藏 */
Game_Followers.prototype.hide = function() {
    this._visible = false;
};

/* 跟随者 */
Game_Followers.prototype.follower = function(index) {
    return this._data[index];
};

/* 遍历每个 */
Game_Followers.prototype.forEach = function(callback, thisObject) {
    this._data.forEach(callback, thisObject);
};

/* 翻转每个 */
Game_Followers.prototype.reverseEach = function(callback, thisObject) {
    this._data.reverse();
    this._data.forEach(callback, thisObject);
    this._data.reverse();
};

/* 刷新 */
Game_Followers.prototype.refresh = function() {
    this.forEach(function(follower) {
        return follower.refresh();
    }, this);
};

/* 更新 */
Game_Followers.prototype.update = function() {
    if (this.areGathering()) {
        if (!this.areMoving()) {
            this.updateMove();
        }
        if (this.areGathered()) {
            this._gathering = false;
        }
    }
    this.forEach(function(follower) {
        follower.update();
    }, this);
};

/* 更新移动 */
Game_Followers.prototype.updateMove = function() {
    for (var i = this._data.length - 1; i >= 0; i--) {
        var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
        this._data[i].chaseCharacter(precedingCharacter);
    }
};

/* 所有跳跃 */
Game_Followers.prototype.jumpAll = function() {
    if ($gamePlayer.isJumping()) {
        for (var i = 0; i < this._data.length; i++) {
            var follower = this._data[i];
            var sx = $gamePlayer.deltaXFrom(follower.x);
            var sy = $gamePlayer.deltaYFrom(follower.y);
            follower.jump(sx, sy);
        }
    }
};

/* 同步 */
Game_Followers.prototype.synchronize = function(x, y, d) {
    this.forEach(function(follower) {
        follower.locate(x, y);
        follower.setDirection(d);
    }, this);
};

/* 集合 */
Game_Followers.prototype.gather = function() {
    this._gathering = true;
};

/* 是否集合中 */
Game_Followers.prototype.areGathering = function() {
    return this._gathering;
};

/* 可见的跟随者 */
Game_Followers.prototype.visibleFollowers = function() {
    return this._data.filter(function(follower) {
        return follower.isVisible();
    }, this);
};

/* 是否移动中 */
Game_Followers.prototype.areMoving = function() {
    return this.visibleFollowers().some(function(follower) {
        return follower.isMoving();
    }, this);
};

/* 是否集合了 */
Game_Followers.prototype.areGathered = function() {
    return this.visibleFollowers().every(function(follower) {
        return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
    }, this);
};

/* 是否有人碰撞 */
Game_Followers.prototype.isSomeoneCollided = function(x, y) {
    return this.visibleFollowers().some(function(follower) {
        return follower.pos(x, y);
    }, this);
};

//-----------------------------------------------------------------------------
// 游戏_载具 
// Game_Vehicle
//
// 载具的游戏对象类。 
// The game object class for a vehicle.

function Game_Vehicle() {
    this.initialize.apply(this, arguments);
}

Game_Vehicle.prototype = Object.create(Game_Character.prototype);
Game_Vehicle.prototype.constructor = Game_Vehicle;

/* 初始化 */
Game_Vehicle.prototype.initialize = function(type) {
    Game_Character.prototype.initialize.call(this);
    this._type = type;
    this.resetDirection();
    this.initMoveSpeed();
    this.loadSystemSettings();
};

/* 初始化成员 */
Game_Vehicle.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._type = '';
    this._mapId = 0;
    this._altitude = 0;
    this._driving = false;
    this._bgm = null;
};

/* 是否是小舟 */
Game_Vehicle.prototype.isBoat = function() {
    return this._type === 'boat';
};

/* 是否是大船 */
Game_Vehicle.prototype.isShip = function() {
    return this._type === 'ship';
};

/* 是否是飞艇 */
Game_Vehicle.prototype.isAirship = function() {
    return this._type === 'airship';
};

/* 重置方向 */
Game_Vehicle.prototype.resetDirection = function() {
    this.setDirection(4);
};

/* 初始化移动速度 */
Game_Vehicle.prototype.initMoveSpeed = function() {
    if (this.isBoat()) {
        this.setMoveSpeed(4);
    } else if (this.isShip()) {
        this.setMoveSpeed(5);
    } else if (this.isAirship()) {
        this.setMoveSpeed(6);
    }
};

/* 载具 */
Game_Vehicle.prototype.vehicle = function() {
    if (this.isBoat()) {
        return $dataSystem.boat;
    } else if (this.isShip()) {
        return $dataSystem.ship;
    } else if (this.isAirship()) {
        return $dataSystem.airship;
    } else {
        return null;
    }
};

/* 读取系统设置 */
Game_Vehicle.prototype.loadSystemSettings = function() {
    var vehicle = this.vehicle();
    this._mapId = vehicle.startMapId;
    this.setPosition(vehicle.startX, vehicle.startY);
    this.setImage(vehicle.characterName, vehicle.characterIndex);
};

/* 刷新 */
Game_Vehicle.prototype.refresh = function() {
    if (this._driving) {
        this._mapId = $gameMap.mapId();
        this.syncWithPlayer();
    } else if (this._mapId === $gameMap.mapId()) {
        this.locate(this.x, this.y);
    }
    if (this.isAirship()) {
        this.setPriorityType(this._driving ? 2 : 0);
    } else {
        this.setPriorityType(1);
    }
    this.setWalkAnime(this._driving);
    this.setStepAnime(this._driving);
    this.setTransparent(this._mapId !== $gameMap.mapId());
};

/* 设置位置 */
Game_Vehicle.prototype.setLocation = function(mapId, x, y) {
    this._mapId = mapId;
    this.setPosition(x, y);
    this.refresh();
};

/* 位置 */
Game_Vehicle.prototype.pos = function(x, y) {
    if (this._mapId === $gameMap.mapId()) {
        return Game_Character.prototype.pos.call(this, x, y);
    } else {
        return false;
    }
};

/* 是否地图可通行 */
Game_Vehicle.prototype.isMapPassable = function(x, y, d) {
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if (this.isBoat()) {
        return $gameMap.isBoatPassable(x2, y2);
    } else if (this.isShip()) {
        return $gameMap.isShipPassable(x2, y2);
    } else if (this.isAirship()) {
        return true;
    } else {
        return false;
    }
};

/* 上 */
Game_Vehicle.prototype.getOn = function() {
    this._driving = true;
    this.setWalkAnime(true);
    this.setStepAnime(true);
    $gameSystem.saveWalkingBgm();
    this.playBgm();
};

/* 下 */
Game_Vehicle.prototype.getOff = function() {
    this._driving = false;
    this.setWalkAnime(false);
    this.setStepAnime(false);
    this.resetDirection();
    $gameSystem.replayWalkingBgm();
};

/* 设置 BGM */
Game_Vehicle.prototype.setBgm = function(bgm) {
    this._bgm = bgm;
};

/* 播放 BGM */
Game_Vehicle.prototype.playBgm = function() {
    AudioManager.playBgm(this._bgm || this.vehicle().bgm);
};

/* 同步玩家 */
Game_Vehicle.prototype.syncWithPlayer = function() {
    this.copyPosition($gamePlayer);
    this.refreshBushDepth();
};

/* 画面 Y 坐标 */
Game_Vehicle.prototype.screenY = function() {
    return Game_Character.prototype.screenY.call(this) - this._altitude;
};

/* 影子 X 坐标 */
Game_Vehicle.prototype.shadowX = function() {
    return this.screenX();
};

/* 影子 Y 坐标 */
Game_Vehicle.prototype.shadowY = function() {
    return this.screenY() + this._altitude;
};

/* 影子不透明度 */
Game_Vehicle.prototype.shadowOpacity = function() {
    return 255 * this._altitude / this.maxAltitude();
};

/* 是否可移动 */
Game_Vehicle.prototype.canMove = function() {
    if (this.isAirship()) {
        return this.isHighest();
    } else {
        return true;
    }
};

/* 更新 */
Game_Vehicle.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    if (this.isAirship()) {
        this.updateAirship();
    }
};

/* 更新飞艇 */
Game_Vehicle.prototype.updateAirship = function() {
    this.updateAirshipAltitude();
    this.setStepAnime(this.isHighest());
    this.setPriorityType(this.isLowest() ? 0 : 2);
};

/* 更新飞艇高度 */
Game_Vehicle.prototype.updateAirshipAltitude = function() {
    if (this._driving && !this.isHighest()) {
        this._altitude++;
    }
    if (!this._driving && !this.isLowest()) {
        this._altitude--;
    }
};

/* 最大高度 */
Game_Vehicle.prototype.maxAltitude = function() {
    return 48;
};

/* 是否最低 */
Game_Vehicle.prototype.isLowest = function() {
    return this._altitude <= 0;
};

/* 是否最高 */
Game_Vehicle.prototype.isHighest = function() {
    return this._altitude >= this.maxAltitude();
};

/* 是否可以起飞 */
Game_Vehicle.prototype.isTakeoffOk = function() {
    return $gamePlayer.areFollowersGathered();
};

/* 是否陆地可下载具 */
Game_Vehicle.prototype.isLandOk = function(x, y, d) {
    if (this.isAirship()) {
        if (!$gameMap.isAirshipLandOk(x, y)) {
            return false;
        }
        if ($gameMap.eventsXy(x, y).length > 0) {
            return false;
        }
    } else {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
    }
    return true;
};

//-----------------------------------------------------------------------------
// 游戏_事件 
// Game_Event
//
// 事件的游戏对象类。它包含用于事件页切换和运行并行处理事件的功能。 
// The game object class for an event. It contains functionality for event page
// switching and running parallel process events.

function Game_Event() {
    this.initialize.apply(this, arguments);
}

Game_Event.prototype = Object.create(Game_Character.prototype);
Game_Event.prototype.constructor = Game_Event;

/* 初始化 */
Game_Event.prototype.initialize = function(mapId, eventId) {
    Game_Character.prototype.initialize.call(this);
    this._mapId = mapId;
    this._eventId = eventId;
    this.locate(this.event().x, this.event().y);
    this.refresh();
};

/* 初始化成员 */
Game_Event.prototype.initMembers = function() {
    Game_Character.prototype.initMembers.call(this);
    this._moveType = 0;
    this._trigger = 0;
    this._starting = false;
    this._erased = false;
    this._pageIndex = -2;
    this._originalPattern = 1;
    this._originalDirection = 2;
    this._prelockDirection = 0;
    this._locked = false;
};

/* 事件 ID */
Game_Event.prototype.eventId = function() {
    return this._eventId;
};

/* 事件 */
Game_Event.prototype.event = function() {
    return $dataMap.events[this._eventId];
};

/* 页 */
Game_Event.prototype.page = function() {
    return this.event().pages[this._pageIndex];
};

/* 列表 */
Game_Event.prototype.list = function() {
    return this.page().list;
};

/* 是否和人物（事件、载具和玩家）碰撞 */
Game_Event.prototype.isCollidedWithCharacters = function(x, y) {
    return (Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) ||
            this.isCollidedWithPlayerCharacters(x, y));
};

/* 是否和事件碰撞 */
Game_Event.prototype.isCollidedWithEvents = function(x, y) {
    var events = $gameMap.eventsXyNt(x, y);
    return events.length > 0;
};

/* 是否和玩家碰撞 */
Game_Event.prototype.isCollidedWithPlayerCharacters = function(x, y) {
    return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
};

/* 锁定 */
Game_Event.prototype.lock = function() {
    if (!this._locked) {
        this._prelockDirection = this.direction();
        this.turnTowardPlayer();
        this._locked = true;
    }
};

/* 解锁 */
Game_Event.prototype.unlock = function() {
    if (this._locked) {
        this._locked = false;
        this.setDirection(this._prelockDirection);
    }
};

/* 更新停止 */
Game_Event.prototype.updateStop = function() {
    if (this._locked) {
        this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if (!this.isMoveRouteForcing()) {
        this.updateSelfMovement();
    }
};

/* 更新自身移动 */
Game_Event.prototype.updateSelfMovement = function() {
    if (!this._locked && this.isNearTheScreen() &&
            this.checkStop(this.stopCountThreshold())) {
        switch (this._moveType) {
        case 1:
            this.moveTypeRandom();
            break;
        case 2:
            this.moveTypeTowardPlayer();
            break;
        case 3:
            this.moveTypeCustom();
            break;
        }
    }
};

/* 停止计数的阈值 */
Game_Event.prototype.stopCountThreshold = function() {
    return 30 * (5 - this.moveFrequency());
};

/* 移动类型随机 */
Game_Event.prototype.moveTypeRandom = function() {
    switch (Math.randomInt(6)) {
    case 0: case 1:
        this.moveRandom();
        break;
    case 2: case 3: case 4:
        this.moveForward();
        break;
    case 5:
        this.resetStopCount();
        break;
    }
};

/* 移动类型朝向玩家 */
Game_Event.prototype.moveTypeTowardPlayer = function() {
    if (this.isNearThePlayer()) {
        switch (Math.randomInt(6)) {
        case 0: case 1: case 2: case 3:
            this.moveTowardPlayer();
            break;
        case 4:
            this.moveRandom();
            break;
        case 5:
            this.moveForward();
            break;
        }
    } else {
        this.moveRandom();
    }
};

/* 是否在玩家附近 */
Game_Event.prototype.isNearThePlayer = function() {
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    return sx + sy < 20;
};

/* 移动类型自定义 */
Game_Event.prototype.moveTypeCustom = function() {
    this.updateRoutineMove();
};

/* 是否开始 */
Game_Event.prototype.isStarting = function() {
    return this._starting;
};

/* 清除开始标志 */
Game_Event.prototype.clearStartingFlag = function() {
    this._starting = false;
};

/* 是否触发条件在其中 */
Game_Event.prototype.isTriggerIn = function(triggers) {
    return triggers.contains(this._trigger);
};

/* 开始 */
Game_Event.prototype.start = function() {
    var list = this.list();
    if (list && list.length > 1) {
        this._starting = true;
        if (this.isTriggerIn([0,1,2])) {
            this.lock();
        }
    }
};

/* 消除 */
Game_Event.prototype.erase = function() {
    this._erased = true;
    this.refresh();
};

/* 刷新 */
Game_Event.prototype.refresh = function() {
    var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if (this._pageIndex !== newPageIndex) {
        this._pageIndex = newPageIndex;
        this.setupPage();
    }
};

/* 寻找适当的页面索引 */
Game_Event.prototype.findProperPageIndex = function() {
    var pages = this.event().pages;
    for (var i = pages.length - 1; i >= 0; i--) {
        var page = pages[i];
        if (this.meetsConditions(page)) {
            return i;
        }
    }
    return -1;
};

/* 是否满足条件 */
Game_Event.prototype.meetsConditions = function(page) {
    var c = page.conditions;
    if (c.switch1Valid) {
        if (!$gameSwitches.value(c.switch1Id)) {
            return false;
        }
    }
    if (c.switch2Valid) {
        if (!$gameSwitches.value(c.switch2Id)) {
            return false;
        }
    }
    if (c.variableValid) {
        if ($gameVariables.value(c.variableId) < c.variableValue) {
            return false;
        }
    }
    if (c.selfSwitchValid) {
        var key = [this._mapId, this._eventId, c.selfSwitchCh];
        if ($gameSelfSwitches.value(key) !== true) {
            return false;
        }
    }
    if (c.itemValid) {
        var item = $dataItems[c.itemId];
        if (!$gameParty.hasItem(item)) {
            return false;
        }
    }
    if (c.actorValid) {
        var actor = $gameActors.actor(c.actorId);
        if (!$gameParty.members().contains(actor)) {
            return false;
        }
    }
    return true;
};

/* 设置页面 */
Game_Event.prototype.setupPage = function() {
    if (this._pageIndex >= 0) {
        this.setupPageSettings();
    } else {
        this.clearPageSettings();
    }
    this.refreshBushDepth();
    this.clearStartingFlag();
    this.checkEventTriggerAuto();
};

/* 清除页面设置 */
Game_Event.prototype.clearPageSettings = function() {
    this.setImage('', 0);
    this._moveType = 0;
    this._trigger = null;
    this._interpreter = null;
    this.setThrough(true);
};

/* 设置页面设置 */
Game_Event.prototype.setupPageSettings = function() {
    var page = this.page();
    var image = page.image;
    if (image.tileId > 0) {
        this.setTileImage(image.tileId);
    } else {
        this.setImage(image.characterName, image.characterIndex);
    }
    if (this._originalDirection !== image.direction) {
        this._originalDirection = image.direction;
        this._prelockDirection = 0;
        this.setDirectionFix(false);
        this.setDirection(image.direction);
    }
    if (this._originalPattern !== image.pattern) {
        this._originalPattern = image.pattern;
        this.setPattern(image.pattern);
    }
    this.setMoveSpeed(page.moveSpeed);
    this.setMoveFrequency(page.moveFrequency);
    this.setPriorityType(page.priorityType);
    this.setWalkAnime(page.walkAnime);
    this.setStepAnime(page.stepAnime);
    this.setDirectionFix(page.directionFix);
    this.setThrough(page.through);
    this.setMoveRoute(page.moveRoute);
    this._moveType = page.moveType;
    this._trigger = page.trigger;
    if (this._trigger === 4) {
        this._interpreter = new Game_Interpreter();
    } else {
        this._interpreter = null;
    }
};

/* 是否起始图案 */
Game_Event.prototype.isOriginalPattern = function() {
    return this.pattern() === this._originalPattern;
};

/* 重置图案 */
Game_Event.prototype.resetPattern = function() {
    this.setPattern(this._originalPattern);
};

/* 检测接触的事件触发条件 */
Game_Event.prototype.checkEventTriggerTouch = function(x, y) {
    if (!$gameMap.isEventRunning()) {
        if (this._trigger === 2 && $gamePlayer.pos(x, y)) {
            if (!this.isJumping() && this.isNormalPriority()) {
                this.start();
            }
        }
    }
};

/* 检测自动执行的事件触发条件 */
Game_Event.prototype.checkEventTriggerAuto = function() {
    if (this._trigger === 3) {
        this.start();
    }
};

/* 更新 */
Game_Event.prototype.update = function() {
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();
    this.updateParallel();
};

/* 更新并行 */
Game_Event.prototype.updateParallel = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list(), this._eventId);
        }
        this._interpreter.update();
    }
};

/* 放置 */
Game_Event.prototype.locate = function(x, y) {
    Game_Character.prototype.locate.call(this, x, y);
    this._prelockDirection = 0;
};

/* 强制移动路线 */
Game_Event.prototype.forceMoveRoute = function(moveRoute) {
    Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
    this._prelockDirection = 0;
};

//-----------------------------------------------------------------------------
// 游戏_解释器 
// Game_Interpreter
//
// 运行事件指令的解释器。 
// The interpreter for running event commands.

function Game_Interpreter() {
    this.initialize.apply(this, arguments);
}

/* 初始化 */
Game_Interpreter.prototype.initialize = function(depth) {
    this._depth = depth || 0;
    this.checkOverflow();
    this.clear();
    this._branch = {};
    this._params = [];
    this._indent = 0;
    this._frameCount = 0;
    this._freezeChecker = 0;
};

/* 检测溢出 */
Game_Interpreter.prototype.checkOverflow = function() {
    if (this._depth >= 100) {
        throw new Error('Common event calls exceeded the limit');
    }
};

/* 清除 */
Game_Interpreter.prototype.clear = function() {
    this._mapId = 0;
    this._eventId = 0;
    this._list = null;
    this._index = 0;
    this._waitCount = 0;
    this._waitMode = '';
    this._comments = '';
    this._character = null;
    this._childInterpreter = null;
};

/* 设置 */
Game_Interpreter.prototype.setup = function(list, eventId) {
    this.clear();
    this._mapId = $gameMap.mapId();
    this._eventId = eventId || 0;
    this._list = list;
    Game_Interpreter.requestImages(list);
};

/* 事件 ID */
Game_Interpreter.prototype.eventId = function() {
    return this._eventId;
};

/* 是否在当前地图 */
Game_Interpreter.prototype.isOnCurrentMap = function() {
    return this._mapId === $gameMap.mapId();
};

/* 设置储存的公共事件 */
Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        this.setup($gameTemp.reservedCommonEvent().list);
        $gameTemp.clearCommonEvent();
        return true;
    } else {
        return false;
    }
};

/* 是否运行 */
Game_Interpreter.prototype.isRunning = function() {
    return !!this._list;
};

/* 更新 */
Game_Interpreter.prototype.update = function() {
    while (this.isRunning()) {
        if (this.updateChild() || this.updateWait()) {
            break;
        }
        if (SceneManager.isSceneChanging()) {
            break;
        }
        if (!this.executeCommand()) {
            break;
        }
        if (this.checkFreeze()) {
            break;
        }
    }
};

/* 更新子解释器 */
Game_Interpreter.prototype.updateChild = function() {
    if (this._childInterpreter) {
        this._childInterpreter.update();
        if (this._childInterpreter.isRunning()) {
            return true;
        } else {
            this._childInterpreter = null;
        }
    }
    return false;
};

/* 更新等待 */
Game_Interpreter.prototype.updateWait = function() {
    return this.updateWaitCount() || this.updateWaitMode();
};

/* 更新等待计数 */
Game_Interpreter.prototype.updateWaitCount = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    }
    return false;
};

/* 更新等待模式 */
Game_Interpreter.prototype.updateWaitMode = function() {
    var waiting = false;
    switch (this._waitMode) {
    case 'message':
        waiting = $gameMessage.isBusy();
        break;
    case 'transfer':
        waiting = $gamePlayer.isTransferring();
        break;
    case 'scroll':
        waiting = $gameMap.isScrolling();
        break;
    case 'route':
        waiting = this._character.isMoveRouteForcing();
        break;
    case 'animation':
        waiting = this._character.isAnimationPlaying();
        break;
    case 'balloon':
        waiting = this._character.isBalloonPlaying();
        break;
    case 'gather':
        waiting = $gamePlayer.areFollowersGathering();
        break;
    case 'action':
        waiting = BattleManager.isActionForced();
        break;
    case 'video':
        waiting = Graphics.isVideoPlaying();
        break;
    case 'image':
        waiting = !ImageManager.isReady();
        break;
    }
    if (!waiting) {
        this._waitMode = '';
    }
    return waiting;
};

/* 设置等待模式 */
Game_Interpreter.prototype.setWaitMode = function(waitMode) {
    this._waitMode = waitMode;
};

/* 等待 */
Game_Interpreter.prototype.wait = function(duration) {
    this._waitCount = duration;
};

/* 渐变速度 */
Game_Interpreter.prototype.fadeSpeed = function() {
    return 24;
};

/* 执行指令 */
Game_Interpreter.prototype.executeCommand = function() {
    var command = this.currentCommand();
    if (command) {
        this._params = command.parameters;
        this._indent = command.indent;
        var methodName = 'command' + command.code;
        if (typeof this[methodName] === 'function') {
            if (!this[methodName]()) {
                return false;
            }
        }
        this._index++;
    } else {
        this.terminate();
    }
    return true;
};

/* 检测冻结 */
Game_Interpreter.prototype.checkFreeze = function() {
    if (this._frameCount !== Graphics.frameCount) {
        this._frameCount = Graphics.frameCount;
        this._freezeChecker = 0;
    }
    if (this._freezeChecker++ >= 100000) {
        return true;
    } else {
        return false;
    }
};

/* 结束 */
Game_Interpreter.prototype.terminate = function() {
    this._list = null;
    this._comments = '';
};

/* 跳出分支 */
Game_Interpreter.prototype.skipBranch = function() {
    while (this._list[this._index + 1].indent > this._indent) {
        this._index++;
    }
};

/* 当前指令 */
Game_Interpreter.prototype.currentCommand = function() {
    return this._list[this._index];
};

/* 下一个事件码 */
Game_Interpreter.prototype.nextEventCode = function() {
    var command = this._list[this._index + 1];
    if (command) {
        return command.code;
    } else {
        return 0;
    }
};

/* 循环遍历角色 ID */
Game_Interpreter.prototype.iterateActorId = function(param, callback) {
    if (param === 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameActors.actor(param);
        if (actor) {
            callback(actor);
        }
    }
};
/* 循环遍历角色 ID 扩展*/
Game_Interpreter.prototype.iterateActorEx = function(param1, param2, callback) {
    if (param1 === 0) {
        this.iterateActorId(param2, callback);
    } else {
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};

/* 循环遍历角色索引 */
Game_Interpreter.prototype.iterateActorIndex = function(param, callback) {
    if (param < 0) {
        $gameParty.members().forEach(callback);
    } else {
        var actor = $gameParty.members()[param];
        if (actor) {
            callback(actor);
        }
    }
};

/* 循环遍历敌人索引 */
Game_Interpreter.prototype.iterateEnemyIndex = function(param, callback) {
    if (param < 0) {
        $gameTroop.members().forEach(callback);
    } else {
        var enemy = $gameTroop.members()[param];
        if (enemy) {
            callback(enemy);
        }
    }
};

/* 循环遍历战斗者 */
Game_Interpreter.prototype.iterateBattler = function(param1, param2, callback) {
    if ($gameParty.inBattle()) {
        if (param1 === 0) {
            this.iterateEnemyIndex(param2, callback);
        } else {
            this.iterateActorId(param2, callback);
        }
    }
};

/* 人物 */
Game_Interpreter.prototype.character = function(param) {
    if ($gameParty.inBattle()) {
        return null;
    } else if (param < 0) {
        return $gamePlayer;
    } else if (this.isOnCurrentMap()) {
        return $gameMap.event(param > 0 ? param : this._eventId);
    } else {
        return null;
    }
};

/* 操作值 
 * @param {Number} operation 操作（0：增加，1：减少）
 * @param {Number} operandType 操作数类型（0：常量，1：变量）
 * @param {Number} operand 操作数
 */
Game_Interpreter.prototype.operateValue = function(operation, operandType, operand) {
    var value = operandType === 0 ? operand : $gameVariables.value(operand);
    return operation === 0 ? value : -value;
};

/* 改变 HP */
Game_Interpreter.prototype.changeHp = function(target, value, allowDeath) {
    if (target.isAlive()) {
        if (!allowDeath && target.hp <= -value) {
            value = 1 - target.hp;
        }
        target.gainHp(value);
        if (target.isDead()) {
            target.performCollapse();
        }
    }
};

/* 显示文字 
 * @param {String} _params[0] 脸图名
 * @param {Number} _params[1] 脸图索引
 * @param {Number} _params[2] 背景（0：窗口，1：暗淡，2：透明）
 * @param {Number} _params[3] 窗口位置（0：顶部，1：中间，2：底部）
 */
// Show Text
Game_Interpreter.prototype.command101 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // 文本数据（Text data） 
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        switch (this.nextEventCode()) {
        case 102:  // 显示选项（Show Choices） 
            this._index++;
            this.setupChoices(this.currentCommand().parameters);
            break;
        case 103:  // 数值输入处理（Input Number） 
            this._index++;
            this.setupNumInput(this.currentCommand().parameters);
            break;
        case 104:  // 物品选择处理（Select Item） 
            this._index++;
            this.setupItemChoice(this.currentCommand().parameters);
            break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 显示选项 
 * @param {String} _params[0][n] 选项 
 * @param {Number} _params[1] 取消（-2：分支，-1：不允许，0：选项 #1，1：选项 #2，2：选项 #3，3：选项 #4，4：选项 #5，5：选项 #6） 
 * @param {Number} _params[2] 默认（-1：无，0：选项 #1，1：选项 #2，2：选项 #3，3：选项 #4，4：选项 #5，5：选项 #6）  
 * @param {Number} _params[3] 窗口位置（0：左侧，1：中间，2：右侧）
 * @param {Number} _params[4] 背景（0：窗口，1：暗淡，2：透明） 
 */
// Show Choices
Game_Interpreter.prototype.command102 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupChoices(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 设置选项 */
Game_Interpreter.prototype.setupChoices = function(params) {
    var choices = params[0].clone();
    var cancelType = params[1];
    var defaultType = params.length > 2 ? params[2] : 0;
    var positionType = params.length > 3 ? params[3] : 2;
    var background = params.length > 4 ? params[4] : 0;
    if (cancelType >= choices.length) {
        cancelType = -2;
    }
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(function(n) {
        this._branch[this._indent] = n;
    }.bind(this));
};

/* 显示选项-选择[**]时 
 * @param {Number} _params[0] 选项索引 
 * @param {String} _params[1] 选项文本 
 */
// When [**]
Game_Interpreter.prototype.command402 = function() {
    if (this._branch[this._indent] !== this._params[0]) {
        this.skipBranch();
    }
    return true;
};

/* 显示选项-当取消时 */
// When Cancel
Game_Interpreter.prototype.command403 = function() {
    if (this._branch[this._indent] >= 0) {
        this.skipBranch();
    }
    return true;
};

/* 数值输入处理 
 * @param {Number} _params[0] 变量 ID 
 * @param {Number} _params[1] 位数 
 */
// Input Number
Game_Interpreter.prototype.command103 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupNumInput(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 设置数值输入 */
Game_Interpreter.prototype.setupNumInput = function(params) {
    $gameMessage.setNumberInput(params[0], params[1]);
};

/* 物品选择处理 
 * @param {Number} _params[0] 变量 ID 
 * @param {Number} _params[1] 物品类型（1：普通物品，2：重要物品，3：隐藏物品 A，4：隐藏物品 B） 
 */
// Select Item
Game_Interpreter.prototype.command104 = function() {
    if (!$gameMessage.isBusy()) {
        this.setupItemChoice(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 设置物品选项 */
Game_Interpreter.prototype.setupItemChoice = function(params) {
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

/* 显示滚动文字 
 * @param {Number} _params[0] 速度 
 * @param {Boolean} _params[1] 是否禁止快进 
 */
// Show Scrolling Text
Game_Interpreter.prototype.command105 = function() {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setScroll(this._params[0], this._params[1]);
        while (this.nextEventCode() === 405) {
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

/* 注释 
 * @param {String} _params[0] 注释文本 
 */
// Comment
Game_Interpreter.prototype.command108 = function() {
    this._comments = [this._params[0]];
    while (this.nextEventCode() === 408) {
        this._index++;
        this._comments.push(this.currentCommand().parameters[0]);
    }
    return true;
};

/* 分支条件 
 * @param {Number} _params[0] 条件类型 
 * @param {Any} _params[1] 参数（不同条件不一样） 
 * @param {Any} _params[2] 参数（不同条件不一样） 
 */
// Conditional Branch
Game_Interpreter.prototype.command111 = function() {
    var result = false;
    switch (this._params[0]) {
        case 0:  // 开关（Switch） 
            result = ($gameSwitches.value(this._params[1]) === (this._params[2] === 0));
            break;
        case 1:  // 变量（Variable） 
            var value1 = $gameVariables.value(this._params[1]);
            var value2;
            if (this._params[2] === 0) {
                value2 = this._params[3];
            } else {
                value2 = $gameVariables.value(this._params[3]);
            }
            switch (this._params[4]) {
                case 0:  // 等于（Equal to） 
                    result = (value1 === value2);
                    break;
                case 1:  // 大于或等于（Greater than or Equal to） 
                    result = (value1 >= value2);
                    break;
                case 2:  // 小于或等于（Less than or Equal to） 
                    result = (value1 <= value2);
                    break;
                case 3:  // 大于（Greater than） 
                    result = (value1 > value2);
                    break;
                case 4:  // 小于（Less than） 
                    result = (value1 < value2);
                    break;
                case 5:  // 不等于（Not Equal to） 
                    result = (value1 !== value2);
                    break;
            }
            break;
        case 2:  // 独立开关（Self Switch） 
            if (this._eventId > 0) {
                var key = [this._mapId, this._eventId, this._params[1]];
                result = ($gameSelfSwitches.value(key) === (this._params[2] === 0));
            }
            break;
        case 3:  // 计时器（Timer） 
            if ($gameTimer.isWorking()) {
                if (this._params[2] === 0) {
                    result = ($gameTimer.seconds() >= this._params[1]);
                } else {
                    result = ($gameTimer.seconds() <= this._params[1]);
                }
            }
            break;
        case 4:  // 角色（Actor） 
            var actor = $gameActors.actor(this._params[1]);
            if (actor) {
                var n = this._params[3];
                switch (this._params[2]) {
                    case 0:  // 在队伍中（In the Party） 
                        result = $gameParty.members().contains(actor);
                        break;
                    case 1:  // 名字（Name） 
                        result = (actor.name() === n);
                        break;
                    case 2:  // 职业（Class） 
                        result = actor.isClass($dataClasses[n]);
                        break;
                    case 3:  // 技能（Skill） 
                        result = actor.hasSkill(n);
                        break;
                    case 4:  // 武器（Weapon） 
                        result = actor.hasWeapon($dataWeapons[n]);
                        break;
                    case 5:  // 护甲（Armor） 
                        result = actor.hasArmor($dataArmors[n]);
                        break;
                    case 6:  // 状态（State） 
                        result = actor.isStateAffected(n);
                        break;
                }
            }
            break;
        case 5:  // 敌人（Enemy） 
            var enemy = $gameTroop.members()[this._params[1]];
            if (enemy) {
                switch (this._params[2]) {
                    case 0:  // 出现（Appeared） 
                        result = enemy.isAlive();
                        break;
                    case 1:  // 状态（State） 
                        result = enemy.isStateAffected(this._params[3]);
                        break;
                }
            }
            break;
        case 6:  // 人物（Character） 
            var character = this.character(this._params[1]);
            if (character) {
                result = (character.direction() === this._params[2]);
            }
            break;
        case 7:  // 金钱（Gold） 
            switch (this._params[2]) {
                case 0:  // 大于或等于（Greater than or equal to） 
                    result = ($gameParty.gold() >= this._params[1]);
                    break;
                case 1:  // 小于或等于（Less than or equal to） 
                    result = ($gameParty.gold() <= this._params[1]);
                    break;
                case 2:  // 小于（Less than） 
                    result = ($gameParty.gold() < this._params[1]);
                    break;
            }
            break;
        case 8:  // 物品（Item） 
            result = $gameParty.hasItem($dataItems[this._params[1]]);
            break;
        case 9:  // 武器（Weapon） 
            result = $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
            break;
        case 10:  // 护甲（Armor） 
            result = $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
            break;
        case 11:  // 按键（Button） 
            result = Input.isPressed(this._params[1]);
            break;
        case 12:  // 脚本（Script） 
            result = !!eval(this._params[1]);
            break;
        case 13:  // 载具（Vehicle） 
            result = ($gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]));
            break;
    }
    this._branch[this._indent] = result;
    if (this._branch[this._indent] === false) {
        this.skipBranch();
    }
    return true;
};

/* 否则 */
// Else
Game_Interpreter.prototype.command411 = function() {
    if (this._branch[this._indent] !== false) {
        this.skipBranch();
    }
    return true;
};

/* 循环 */
// Loop
Game_Interpreter.prototype.command112 = function() {
    return true;
};

/* 重复以上内容 */
// Repeat Above
Game_Interpreter.prototype.command413 = function() {
    do {
        this._index--;
    } while (this.currentCommand().indent !== this._indent);
    return true;
};

/* 跳出循环 */
// Break Loop
Game_Interpreter.prototype.command113 = function() {
    var depth = 0;
    while (this._index < this._list.length - 1) {
        this._index++;
        var command = this.currentCommand();

        if (command.code === 112)
            depth++;

        if (command.code === 413) {
            if (depth > 0)
                depth--;
            else
                break;
        }
    }
    return true;
};

/* 中止事件处理 */
// Exit Event Processing
Game_Interpreter.prototype.command115 = function() {
    this._index = this._list.length;
    return true;
};

/* 公共事件 
 * @param {Number} _params[0] 公共事件 ID  
 */
// Common Event
Game_Interpreter.prototype.command117 = function() {
    var commonEvent = $dataCommonEvents[this._params[0]];
    if (commonEvent) {
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);
    }
    return true;
};

/* 设置子对象 */
Game_Interpreter.prototype.setupChild = function(list, eventId) {
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
};

/* 标签 */
// Label
Game_Interpreter.prototype.command118 = function() {
    return true;
};

/* 转到标签 
 * @param {String} _params[0] 标签名称 
 */
// Jump to Label
Game_Interpreter.prototype.command119 = function() {
    var labelName = this._params[0];
    for (var i = 0; i < this._list.length; i++) {
        var command = this._list[i];
        if (command.code === 118 && command.parameters[0] === labelName) {
            this.jumpTo(i);
            return;
        }
    }
    return true;
};

/* 跳转到该索引 */
Game_Interpreter.prototype.jumpTo = function(index) {
    var lastIndex = this._index;
    var startIndex = Math.min(index, lastIndex);
    var endIndex = Math.max(index, lastIndex);
    var indent = this._indent;
    for (var i = startIndex; i <= endIndex; i++) {
        var newIndent = this._list[i].indent;
        if (newIndent !== indent) {
            this._branch[indent] = null;
            indent = newIndent;
        }
    }
    this._index = index;
};

/* 开关操作 
 * @param {Number} _params[0] 起始开关 ID 
 * @param {Number} _params[1] 结尾开关 ID 
 * @param {Number} _params[2] 操作（0：ON，1：OFF） 
 */
// Control Switches
Game_Interpreter.prototype.command121 = function() {
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        $gameSwitches.setValue(i, this._params[2] === 0);
    }
    return true;
};

/* 变量操作 
 * @param {Number} _params[0] 起始变量 ID 
 * @param {Number} _params[1] 结尾变量 ID 
 * @param {Number} _params[2] 操作（0：代入，1：加法，2：减法，3：乘法，4：除法，5：取模） 
 * @param {Number} _params[3] 操作数（0：常量，1：变量，2：随机，3：游戏数据，4：脚本） 
 * @param {Any} _params[4] 参数（不同操作数不一样） 
 * @param {Any} _params[5] 参数（不同操作数不一样） 
 * @param {Any} _params[6] 参数（不同操作数不一样） 
 */
// Control Variables
Game_Interpreter.prototype.command122 = function() {
    var value = 0;
    switch (this._params[3]) { // 操作符（Operand） 
        case 0: // 常量（Constant） 
            value = this._params[4];
            break;
        case 1: // 变量（Variable） 
            value = $gameVariables.value(this._params[4]);
            break;
        case 2: // 随机数（Random） 
            value = this._params[5] - this._params[4] + 1;
            for (var i = this._params[0]; i <= this._params[1]; i++) {
                this.operateVariable(i, this._params[2], this._params[4] + Math.randomInt(value));
            }
            return true;
            break;
        case 3: // 游戏数据（Game Data） 
            value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
            break;
        case 4: // 脚本（Script） 
            value = eval(this._params[4]);
            break;
    }
    for (var i = this._params[0]; i <= this._params[1]; i++) {
        this.operateVariable(i, this._params[2], value);
    }
    return true;
};

/* 游戏数据操作 */
Game_Interpreter.prototype.gameDataOperand = function(type, param1, param2) {
    switch (type) {
    case 0:  // 物品（Item） 
        return $gameParty.numItems($dataItems[param1]);
    case 1:  // 武器（Weapon） 
        return $gameParty.numItems($dataWeapons[param1]);
    case 2:  // 护甲（Armor） 
        return $gameParty.numItems($dataArmors[param1]);
    case 3:  // 角色（Actor） 
        var actor = $gameActors.actor(param1);
        if (actor) {
            switch (param2) {
            case 0:  // 等级（Level） 
                return actor.level;
            case 1:  // 经验值（EXP） 
                return actor.currentExp();
            case 2:  // HP
                return actor.hp;
            case 3:  // MP
                return actor.mp;
            default:    // 能力值（Parameter） 
                if (param2 >= 4 && param2 <= 11) {
                    return actor.param(param2 - 4);
                }
            }
        }
        break;
    case 4:  // 敌人（Enemy） 
        var enemy = $gameTroop.members()[param1];
        if (enemy) {
            switch (param2) {
            case 0:  // HP
                return enemy.hp;
            case 1:  // MP
                return enemy.mp;
            default:    // 能力值（Parameter） 
                if (param2 >= 2 && param2 <= 9) {
                    return enemy.param(param2 - 2);
                }
            }
        }
        break;
    case 5:  // 人物（Character） 
        var character = this.character(param1);
        if (character) {
            switch (param2) {
            case 0:  // 地图 X（Map X） 
                return character.x;
            case 1:  // 地图 Y（Map Y） 
                return character.y;
            case 2:  // 方向（Direction） 
                return character.direction();
            case 3:  // 画面 X（Screen X） 
                return character.screenX();
            case 4:  // 画面 Y（Screen Y） 
                return character.screenY();
            }
        }
        break;
    case 6:  // 队伍（Party） 
        actor = $gameParty.members()[param1];
        return actor ? actor.actorId() : 0;
    case 7:  // 其他（Other） 
        switch (param1) {
        case 0:  // 地图 ID（Map ID） 
            return $gameMap.mapId();
        case 1:  // 队伍成员（Party Members） 
            return $gameParty.size();
        case 2:  // 金钱（Gold） 
            return $gameParty.gold();
        case 3:  // 步数（Steps） 
            return $gameParty.steps();
        case 4:  // 游戏时间（Play Time） 
            return $gameSystem.playtime();
        case 5:  // 计时器（Timer） 
            return $gameTimer.seconds();
        case 6:  // 保存次数（Save Count） 
            return $gameSystem.saveCount();
        case 7:  // 战斗次数（Battle Count） 
            return $gameSystem.battleCount();
        case 8:  // 胜利次数（Win Count） 
            return $gameSystem.winCount();
        case 9:  // 逃跑次数（Escape Count） 
            return $gameSystem.escapeCount();
        }
        break;
    }
    return 0;
};

/* 操作变量 */
Game_Interpreter.prototype.operateVariable = function(variableId, operationType, value) {
    try {
        var oldValue = $gameVariables.value(variableId);
        switch (operationType) {
        case 0:  // 代入（Set） 
            $gameVariables.setValue(variableId, oldValue = value);
            break;
        case 1:  // 加法（Add） 
            $gameVariables.setValue(variableId, oldValue + value);
            break;
        case 2:  // 减法（Sub） 
            $gameVariables.setValue(variableId, oldValue - value);
            break;
        case 3:  // 乘法（Mul） 
            $gameVariables.setValue(variableId, oldValue * value);
            break;
        case 4:  // 除法（Div） 
            $gameVariables.setValue(variableId, oldValue / value);
            break;
        case 5:  // 取模（Mod） 
            $gameVariables.setValue(variableId, oldValue % value);
            break;
        }
    } catch (e) {
        $gameVariables.setValue(variableId, 0);
    }
};

/* 独立开关操作 
 * @param {String} _params[0] 独立开关（A：独立开关 A，B：独立开关 B，C：独立开关 C，D：独立开关 D） 
 * @param {Number} _params[1] 操作（0：ON，1：OFF） 
 */
// Control Self Switch
Game_Interpreter.prototype.command123 = function() {
    if (this._eventId > 0) {
        var key = [this._mapId, this._eventId, this._params[0]];
        $gameSelfSwitches.setValue(key, this._params[1] === 0);
    }
    return true;
};

/* 计时器操作 
 * @param {Number} _params[0] 操作（0：开始，1：停止） 
 * @param {Number} _params[1] 时间（单位秒） 
 */
// Control Timer
Game_Interpreter.prototype.command124 = function() {
    if (this._params[0] === 0) {  // 开始（Start） 
        $gameTimer.start(this._params[1] * 60);
    } else {  // 停止（Stop） 
        $gameTimer.stop();
    }
    return true;
};

/* 增减金钱 
 * @param {Number} _params[0] 操作（0：增加，1：减少） 
 * @param {Number} _params[1] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[2] 操作数 
 */
// Change Gold
Game_Interpreter.prototype.command125 = function() {
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    $gameParty.gainGold(value);
    return true;
};

/* 增减物品 
 * @param {Number} _params[0] 物品 ID 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 */
// Change Items
Game_Interpreter.prototype.command126 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    return true;
};

/* 增减武器 
 * @param {Number} _params[0] 武器 ID 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 * @param {Boolean} _params[4] 是否包括装备 
 */
// Change Weapons
Game_Interpreter.prototype.command127 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
    return true;
};

/* 增减护甲
 * @param {Number} _params[0] 护甲 ID 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 * @param {Boolean} _params[4] 是否包括装备 
 */
// Change Armors
Game_Interpreter.prototype.command128 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
    return true;
};

/* 队伍管理 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 操作（0：入队，1：离队） 
 * @param {Boolean} _params[2] 是否初始化 
 */
// Change Party Member
Game_Interpreter.prototype.command129 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        if (this._params[1] === 0) {  // 入队（Add） 
            if (this._params[2]) {   // 初始化（Initialize） 
                $gameActors.actor(this._params[0]).setup(this._params[0]);
            }
            $gameParty.addActor(this._params[0]);
        } else {  // 离队（Remove） 
            $gameParty.removeActor(this._params[0]);
        }
    }
    return true;
};

/* 更改战斗 BGM 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Change Battle BGM
Game_Interpreter.prototype.command132 = function() {
    $gameSystem.setBattleBgm(this._params[0]);
    return true;
};

/* 更改胜利 ME 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Change Victory ME
Game_Interpreter.prototype.command133 = function() {
    $gameSystem.setVictoryMe(this._params[0]);
    return true;
};

/* 启动/禁用存档
 * @param {Number} _params[0] 存档（0：禁用，1：启用） 
 */
// Change Save Access
Game_Interpreter.prototype.command134 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableSave();
    } else {
        $gameSystem.enableSave();
    }
    return true;
};

/* 启动/禁用菜单 
 * @param {Number} _params[0] 菜单（0：禁用，1：启用） 
 */
// Change Menu Access
Game_Interpreter.prototype.command135 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableMenu();
    } else {
        $gameSystem.enableMenu();
    }
    return true;
};

/* 启动/禁用遇敌 
 * @param {Number} _params[0] 遇敌（0：禁用，1：启用） 
 */
// Change Encounter Disable
Game_Interpreter.prototype.command136 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableEncounter();
    } else {
        $gameSystem.enableEncounter();
    }
    $gamePlayer.makeEncounterCount();
    return true;
};

/* 启动/禁用整队
 * @param {Number} _params[0] 整队（0：禁用，1：启用） 
 */
// Change Formation Access
Game_Interpreter.prototype.command137 = function() {
    if (this._params[0] === 0) {
        $gameSystem.disableFormation();
    } else {
        $gameSystem.enableFormation();
    }
    return true;
};

/* 更改窗口颜色
 * @param {Number} _params[0][0] 红 
 * @param {Number} _params[0][1] 绿 
 * @param {Number} _params[0][2] 蓝 
 * @param {Number} _params[0][3] 不透明度 
 */
// Change Window Color
Game_Interpreter.prototype.command138 = function() {
    $gameSystem.setWindowTone(this._params[0]);
    return true;
};

/* 更改战败 ME 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Change Defeat ME
Game_Interpreter.prototype.command139 = function() {
    $gameSystem.setDefeatMe(this._params[0]);
    return true;
};

/* 更改载具 BGM 
 * @param {Number} _params[0] 载具（0：小舟，1：大船，2：飞艇） 
 * @param {String} _params[1].name 名称 
 * @param {Number} _params[1].volume 音量 
 * @param {Number} _params[1].pitch 音调 
 * @param {Number} _params[1].pan 声像 
 */
// Change Vehicle BGM
Game_Interpreter.prototype.command140 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setBgm(this._params[1]);
    }
    return true;
};

/* 场所移动 
 * @param {Number} _params[0] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[1] 地图 ID【直接指定】，或地图 ID 的变量 ID【变量指定】 
 * @param {Number} _params[2] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[3] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 * @param {Number} _params[4] 方向（0：不变，2：下，4：左，6：右，8：上） 
 * @param {Number} _params[5] 淡入淡出（0：黑，1：白，无：2） 
 */
// Transfer Player
Game_Interpreter.prototype.command201 = function() {
    if (!$gameParty.inBattle() && !$gameMessage.isBusy()) {
        var mapId, x, y;
        if (this._params[0] === 0) {  // 直接指定（Direct designation） 
            mapId = this._params[1];
            x = this._params[2];
            y = this._params[3];
        } else {  // 变量指定（Designation with variables） 
            mapId = $gameVariables.value(this._params[1]);
            x = $gameVariables.value(this._params[2]);
            y = $gameVariables.value(this._params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
        this.setWaitMode('transfer');
        this._index++;
    }
    return false;
};

/* 设置载具位置 
 * @param {Number} _params[0] 载具（0：小舟，1：大船，2：飞艇） 
 * @param {Number} _params[1] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[2] 地图 ID【直接指定】，或地图 ID 的变量 ID【变量指定】 
 * @param {Number} _params[3] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[4] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 */
// Set Vehicle Location
Game_Interpreter.prototype.command202 = function() {
    var mapId, x, y;
    if (this._params[1] === 0) {  // 直接指定（Direct designation） 
        mapId = this._params[2];
        x = this._params[3];
        y = this._params[4];
    } else {  // 变量指定（Designation with variables） 
        mapId = $gameVariables.value(this._params[2]);
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setLocation(mapId, x, y);
    }
    return true;
};

/* 设置事件位置 
 * @param {Number} _params[0] 人物（0：本事件，大于 0：其他事件）
 * @param {Number} _params[1] 指定方式（0：直接指定，1：变量指定，2：与其他事件交换） 
 * @param {Number} _params[2] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】，或事件 ID（0：本事件，大于 0：其他事件）【与其他事件交换】 
 * @param {Number} _params[3] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】
 * @param {Number} _params[4] 方向（0：不变，2：下，4：左，6：右，8：上） 
 */
// Set Event Location
Game_Interpreter.prototype.command203 = function() {
    var character = this.character(this._params[0]);
    if (character) {
        if (this._params[1] === 0) {  // 直接指定（Direct designation） 
            character.locate(this._params[2], this._params[3]);
        } else if (this._params[1] === 1) {  //变量指定（Designation with variables） 
            var x = $gameVariables.value(this._params[2]);
            var y = $gameVariables.value(this._params[3]);
            character.locate(x, y);
        } else {  // 与其他事件交换（Exchange with another event） 
            var character2 = this.character(this._params[2]);
            if (character2) {
                character.swap(character2);
            }
        }
        if (this._params[4] > 0) {
            character.setDirection(this._params[4]);
        }
    }
    return true;
};

/* 滚动地图 
 * @param {Number} _params[0] 方向（2：下，4：左，6：右，8：上） 
 * @param {Number} _params[1] 距离 
 * @param {Number} _params[2] 速度（1：1/8 倍速，2：1/4 倍速，3：1/2 倍速，4：标准速度，5：2 倍速，6：4 倍速） 
 */
// Scroll Map
Game_Interpreter.prototype.command204 = function() {
    if (!$gameParty.inBattle()) {
        if ($gameMap.isScrolling()) {
            this.setWaitMode('scroll');
            return false;
        }
        $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
    }
    return true;
};

/* 设置移动路线 
 * @param {Number} _params[0] 人物（小于 0：玩家，0：本事件，大于 0：其他事件） 
 * @param {Array} _params[1].list 移动路线 
 * @param {Boolean} _params[1].repeat 是否循环执行 
 * @param {Boolean} _params[1].skippable 是否无法移动时跳过指令 
 * @param {Boolean} _params[1].wait 是否等待完成 
 */
// Set Movement Route
Game_Interpreter.prototype.command205 = function() {
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.forceMoveRoute(this._params[1]);
        if (this._params[1].wait) {
            this.setWaitMode('route');
        }
    }
    return true;
};

/* 载具乘降 */
// Getting On and Off Vehicles
Game_Interpreter.prototype.command206 = function() {
    $gamePlayer.getOnOffVehicle();
    return true;
};

/* 更改透明状态 
 * @param {Number} _params[0] 透明状态（0：ON，1：OFF） 
 */
// Change Transparency
Game_Interpreter.prototype.command211 = function() {
    $gamePlayer.setTransparent(this._params[0] === 0);
    return true;
};

/* 显示动画 
 * @param {Number} _params[0] 人物（小于 0：玩家，0：本事件，大于 0：其他事件） 
 * @param {Number} _params[1] 动画 ID 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Show Animation
Game_Interpreter.prototype.command212 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestAnimation(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('animation');
        }
    }
    return true;
};

/* 显示气泡图标
 * @param {Number} _params[0] 人物（小于 0：玩家，0：本事件，大于 0：其他事件） 
 * @param {Number} _params[1] 气泡图标 ID 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Show Balloon Icon
Game_Interpreter.prototype.command213 = function() {
    this._character = this.character(this._params[0]);
    if (this._character) {
        this._character.requestBalloon(this._params[1]);
        if (this._params[2]) {
            this.setWaitMode('balloon');
        }
    }
    return true;
};

/* 暂时消除事件 */
// Erase Event
Game_Interpreter.prototype.command214 = function() {
    if (this.isOnCurrentMap() && this._eventId > 0) {
        $gameMap.eraseEvent(this._eventId);
    }
    return true;
};

/* 更改队列行进 
 * @param {Number} _params[0] 队列步行（0：ON，1：OFF） 
 */
// Change Player Followers
Game_Interpreter.prototype.command216 = function() {
    if (this._params[0] === 0) {
        $gamePlayer.showFollowers();
    } else {
        $gamePlayer.hideFollowers();
    }
    $gamePlayer.refresh();
    return true;
};

/* 集合队列成员 */
// Gather Followers
Game_Interpreter.prototype.command217 = function() {
    if (!$gameParty.inBattle()) {
        $gamePlayer.gatherFollowers();
        this.setWaitMode('gather');
    }
    return true;
};

/* 淡出画面 */
// Fadeout Screen
Game_Interpreter.prototype.command221 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

/* 淡入画面 */
// Fadein Screen
Game_Interpreter.prototype.command222 = function() {
    if (!$gameMessage.isBusy()) {
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};

/* 更改画面色调 
 * @param {Number} _params[0][0] 红 
 * @param {Number} _params[0][1] 绿 
 * @param {Number} _params[0][2] 蓝 
 * @param {Number} _params[0][3] 灰度 
 * @param {Number} _params[1] 持续时间（单位帧） 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Tint Screen
Game_Interpreter.prototype.command223 = function() {
    $gameScreen.startTint(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

/* 闪烁画面 
 * @param {Number} _params[0][0] 红 
 * @param {Number} _params[0][1] 绿 
 * @param {Number} _params[0][2] 蓝 
 * @param {Number} _params[0][3] 强度 
 * @param {Number} _params[1] 持续时间（单位帧） 
 * @param {Boolean} _params[2] 是否等待完成 
*/
// Flash Screen
Game_Interpreter.prototype.command224 = function() {
    $gameScreen.startFlash(this._params[0], this._params[1]);
    if (this._params[2]) {
        this.wait(this._params[1]);
    }
    return true;
};

/* 震动屏幕 
 * @param {Number} _params[0][0] 强度 
 * @param {Number} _params[0][1] 速度 
 * @param {Number} _params[1] 持续时间（单位帧） 
 * @param {Boolean} _params[2] 是否等待完成 
 */
// Shake Screen
Game_Interpreter.prototype.command225 = function() {
    $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

/* 等待 
 * @param {Number} _params[0] 持续时间（单位帧） 
 */
// Wait
Game_Interpreter.prototype.command230 = function() {
    this.wait(this._params[0]);
    return true;
};

/* 显示图片
 * @param {Number} _params[0] 编号 
 * @param {String} _params[1] 图像名称 
 * @param {Number} _params[2] 原点（0：左上，1：中心） 
 * @param {Number} _params[3] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[4] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[5] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 * @param {Number} _params[6] 宽缩放率（百分比） 
 * @param {Number} _params[7] 高缩放率（百分比） 
 * @param {Number} _params[8] 不透明度 
 * @param {Number} _params[9] 合成方式（0：正常，1：叠加，2：正片叠底，3：滤色） 
 */
// Show Picture
Game_Interpreter.prototype.command231 = function() {
    var x, y;
    if (this._params[3] === 0) {  // 直接指定（Direct designation） 
        x = this._params[4];
        y = this._params[5];
    } else {  // 变量指定（Designation with variables） 
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.showPicture(this._params[0], this._params[1], this._params[2],
        x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
    return true;
};

/* 移动图片 
 * @param {Number} _params[0] 编号 
 * @param {Number} _params[1] 0 
 * @param {Number} _params[2] 原点（0：左上，1：中心） 
 * @param {Number} _params[3] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[4] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[5] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 * @param {Number} _params[6] 宽缩放率（百分比） 
 * @param {Number} _params[7] 高缩放率（百分比） 
 * @param {Number} _params[8] 不透明度 
 * @param {Number} _params[9] 合成方式（0：正常，1：叠加，2：正片叠底，3：滤色） 
 * @param {Number} _params[10] 持续时间（单位帧） 
 * @param {Boolean} _params[11] 是否等待完成 
*/
// Move Picture
Game_Interpreter.prototype.command232 = function() {
    var x, y;
    if (this._params[3] === 0) {  // 直接指定（Direct designation） 
        x = this._params[4];
        y = this._params[5];
    } else {  // 变量指定（Designation with variables） 
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6],
        this._params[7], this._params[8], this._params[9], this._params[10]);
    if (this._params[11]) {
        this.wait(this._params[10]);
    }
    return true;
};

/* 旋转图片 
 * @param {Number} _params[0] 编号 
 * @param {Number} _params[1] 速度 
 */
// Rotate Picture
Game_Interpreter.prototype.command233 = function() {
    $gameScreen.rotatePicture(this._params[0], this._params[1]);
    return true;
};

/* 更改图片色调 
 * @param {Number} _params[0] 编号 
 * @param {Number} _params[1][0] 红 
 * @param {Number} _params[1][1] 绿 
 * @param {Number} _params[1][2] 蓝 
 * @param {Number} _params[1][3] 灰度 
 * @param {Number} _params[2] 持续时间（单位帧） 
 * @param {Boolean} _params[3] 是否等待完成 
 */
// Tint Picture
Game_Interpreter.prototype.command234 = function() {
    $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
    if (this._params[3]) {
        this.wait(this._params[2]);
    }
    return true;
};

/* 消除图片 
 * @param {Number} _params[0] 编号 
 */
// Erase Picture
Game_Interpreter.prototype.command235 = function() {
    $gameScreen.erasePicture(this._params[0]);
    return true;
};

/* 设置天气 
 * @param {String} _params[0] 类型（none：无，rain：雨，storm：风暴，snow：雪） 
 * @param {Number} _params[1] 强度 
 * @param {Number} _params[2] 持续时间（单位帧） 
 * @param {Boolean} _params[3] 是否等待完成 
 */
// Set Weather Effect
Game_Interpreter.prototype.command236 = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
    }
    return true;
};

/* 播放 BGM 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play BGM
Game_Interpreter.prototype.command241 = function() {
    AudioManager.playBgm(this._params[0]);
    return true;
};

/* 淡出 BGM 
 * @param {Number} _params[0] 持续时间（单位秒） 
 */
// Fadeout BGM
Game_Interpreter.prototype.command242 = function() {
    AudioManager.fadeOutBgm(this._params[0]);
    return true;
};

/* 保存 BGM */
// Save BGM
Game_Interpreter.prototype.command243 = function() {
    $gameSystem.saveBgm();
    return true;
};

/* 还原 BGM */
// Resume BGM
Game_Interpreter.prototype.command244 = function() {
    $gameSystem.replayBgm();
    return true;
};

/* 播放 BGS 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play BGS
Game_Interpreter.prototype.command245 = function() {
    AudioManager.playBgs(this._params[0]);
    return true;
};

/* 淡出 BGS 
 * @param {Number} _params[0] 持续时间（单位秒） 
 */
// Fadeout BGS
Game_Interpreter.prototype.command246 = function() {
    AudioManager.fadeOutBgs(this._params[0]);
    return true;
};

/* 播放 ME 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play ME
Game_Interpreter.prototype.command249 = function() {
    AudioManager.playMe(this._params[0]);
    return true;
};

/* 播放 SE 
 * @param {String} _params[0].name 名称 
 * @param {Number} _params[0].volume 音量 
 * @param {Number} _params[0].pitch 音调 
 * @param {Number} _params[0].pan 声像 
 */
// Play SE
Game_Interpreter.prototype.command250 = function() {
    AudioManager.playSe(this._params[0]);
    return true;
};

/* 停止 SE */
// Stop SE
Game_Interpreter.prototype.command251 = function() {
    AudioManager.stopSe();
    return true;
};

/* 播放影像 
 * @param {String} _params[0] 影像名称 
 */
// Play Movie
Game_Interpreter.prototype.command261 = function() {
    if (!$gameMessage.isBusy()) {
        var name = this._params[0];
        if (name.length > 0) {
            var ext = this.videoFileExt();
            Graphics.playVideo('movies/' + name + ext);
            this.setWaitMode('video');
        }
        this._index++;
    }
    return false;
};

/* 影像文件扩展名 */
Game_Interpreter.prototype.videoFileExt = function() {
    if (Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice()) {
        return '.webm';
    } else {
        return '.mp4';
    }
};

/* 启动/禁用显示地图名称 
 * @param {Number} _params[0] 显示地图名称（0：ON，1：OFF） 
 */
// Change Map Name Display
Game_Interpreter.prototype.command281 = function() {
    if (this._params[0] === 0) {
        $gameMap.enableNameDisplay();
    } else {
        $gameMap.disableNameDisplay();
    }
    return true;
};

/* 更改地图图块 
 * @param {Number} _params[0] 图块 ID 
 */
// Change Tileset
Game_Interpreter.prototype.command282 = function() {
    var tileset = $dataTilesets[this._params[0]];
    if(!this._imageReservationId){
        this._imageReservationId = Utils.generateRuntimeId();
    }

    var allReady = tileset.tilesetNames.map(function(tilesetName) {
        return ImageManager.reserveTileset(tilesetName, 0, this._imageReservationId);
    }, this).every(function(bitmap) {return bitmap.isReady();});

    if (allReady) {
        $gameMap.changeTileset(this._params[0]);
        ImageManager.releaseReservation(this._imageReservationId);
        this._imageReservationId = null;

        return true;
    } else {
        return false;
    }
};

/* 更改战斗背景 
 * @param {String} _params[0] 图像 1 名称 
 * @param {String} _params[1] 图像 2 名称 
 */
// Change Battle Back
Game_Interpreter.prototype.command283 = function() {
    $gameMap.changeBattleback(this._params[0], this._params[1]);
    return true;
};

/* 更改远景 
 * @param {String} _params[0] 图像名称 
 * @param {Boolean} _params[1] 是否横向循环 
 * @param {Boolean} _params[2] 是否纵向循环 
 * @param {Number} _params[3] 横向滚动速度 
 * @param {Number} _params[4] 纵向滚动速度 
 */
// Change Parallax
Game_Interpreter.prototype.command284 = function() {
    $gameMap.changeParallax(this._params[0], this._params[1],
        this._params[2], this._params[3], this._params[4]);
    return true;
};

/* 获取指定位置的信息 
 * @param {Number} _params[0] 变量 ID 
 * @param {Number} _params[1] 信息类型（0：地形标志，1：事件 ID，2：图块 ID（第 1 层），3：图块 ID（第 2 层）4：图块 ID（第 3 层）5：图块 ID（第 4 层），6：区域 ID） 
 * @param {Number} _params[2] 指定方式（0：直接指定，1：变量指定） 
 * @param {Number} _params[3] 坐标 X【直接指定】，或坐标 X 的变量 ID【变量指定】 
 * @param {Number} _params[4] 坐标 Y【直接指定】，或坐标 Y 的变量 ID【变量指定】 
 */
// Get Location Info
Game_Interpreter.prototype.command285 = function() {
    var x, y, value;
    if (this._params[2] === 0) {  // 直接指定（Direct designation） 
        x = this._params[3];
        y = this._params[4];
    } else {  // 变量指定（Designation with variables） 
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    switch (this._params[1]) {
    case 0:     // 地形标志（Terrain Tag） 
        value = $gameMap.terrainTag(x, y);
        break;
    case 1:     // 事件 ID（Event ID） 
        value = $gameMap.eventIdXy(x, y);
        break;
    case 2:     // 图块 ID（第 1 层）（Tile ID (Layer 1)） 
    case 3:     // 图块 ID（第 2 层）（Tile ID (Layer 2)） 
    case 4:     // 图块 ID（第 3 层）（Tile ID (Layer 3)） 
    case 5:     // 图块 ID（第 4 层）（Tile ID (Layer 4)） 
        value = $gameMap.tileId(x, y, this._params[1] - 2);
        break;
    default:    // 区域 ID （Region ID） 
        value = $gameMap.regionId(x, y);
        break;
    }
    $gameVariables.setValue(this._params[0], value);
    return true;
};

/* 战斗处理 
 * @param {Number} _params[0] 指定方式（0：直接指定，1：变量指定，3：与随机遇敌相同） 
 * @param {Number} _params[1] 敌群 ID【直接指定】，或敌群 ID 的变量 ID【变量指定】 
 * @param {Boolean} _params[2] 是否允许逃跑 
 * @param {Boolean} _params[3] 是否允许失败 
 */
// Battle Processing
Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        var troopId;
        if (this._params[0] === 0) {  // 直接指定（Direct designation） 
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // 变量指定（Designation with variables） 
            troopId = $gameVariables.value(this._params[1]);
        } else {  // 与随机遇敌相同（Same as Random Encounter） 
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            BattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        }
    }
    return true;
};

/* 战斗处理-胜利时（允许战败或逃跑时） */
// If Win
Game_Interpreter.prototype.command601 = function() {
    if (this._branch[this._indent] !== 0) {
        this.skipBranch();
    }
    return true;
};

/* 战斗处理-逃跑时（允许逃跑时） */
// If Escape
Game_Interpreter.prototype.command602 = function() {
    if (this._branch[this._indent] !== 1) {
        this.skipBranch();
    }
    return true;
};

/* 战斗处理-战败时（允许战败时） */
// If Lose
Game_Interpreter.prototype.command603 = function() {
    if (this._branch[this._indent] !== 2) {
        this.skipBranch();
    }
    return true;
};

/* 商店处理 
 * @param {Number} _params[0] 商品类型（0：物品，1：武器，2：护甲） 
 * @param {Number} _params[1] 物品 ID 
 * @param {Number} _params[2] 价格方式（0：标准，1：指定） 
 * @param {Number} _params[3] 价格 
 * @param {Number} _params[4] 是否只能购买 
 */
// Shop Processing
Game_Interpreter.prototype.command302 = function() {
    if (!$gameParty.inBattle()) {
        var goods = [this._params];
        while (this.nextEventCode() === 605) {
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, this._params[4]);
    }
    return true;
};

/* 名字输入处理 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 最大字符数 
 */
// Name Input Processing
Game_Interpreter.prototype.command303 = function() {
    if (!$gameParty.inBattle()) {
        if ($dataActors[this._params[0]]) {
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);
        }
    }
    return true;
};

/* 增减 HP 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】,或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 * @param {Boolean} _params[5] 是否允许导致无法战斗 
 */
// Change HP
Game_Interpreter.prototype.command311 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));
    return true;
};

/* 增减 MP 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】,或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 */
// Change MP
Game_Interpreter.prototype.command312 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainMp(value);
    }.bind(this));
    return true;
};

/* 增减 TP
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 */
// Change TP
Game_Interpreter.prototype.command326 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.gainTp(value);
    }.bind(this));
    return true;
};

/* 更改状态
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：附加，1：解除） 
 * @param {Number} _params[3] 状态 ID 
 */
// Change State
Game_Interpreter.prototype.command313 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        var alreadyDead = actor.isDead();
        if (this._params[2] === 0) {
            actor.addState(this._params[3]);
        } else {
            actor.removeState(this._params[3]);
        }
        if (actor.isDead() && !alreadyDead) {
            actor.performCollapse();
        }
        actor.clearResult();
    }.bind(this));
    return true;
};

/* 完全恢复 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 */
// Recover All
Game_Interpreter.prototype.command314 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.recoverAll();
    }.bind(this));
    return true;
};

/* 增减经验值 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 * @param {Boolean} _params[5] 是否显示升级信息 
 */
// Change EXP
Game_Interpreter.prototype.command315 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeExp(actor.currentExp() + value, this._params[5]);
    }.bind(this));
    return true;
};

/* 增减等级 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：增加，1：减少） 
 * @param {Number} _params[3] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[4] 操作数 
 * @param {Boolean} _params[5] 是否显示升级信息 
 */
// Change Level
Game_Interpreter.prototype.command316 = function() {
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.changeLevel(actor.level + value, this._params[5]);
    }.bind(this));
    return true;
};

/* 增减能力值 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 能力值 ID
 * @param {Number} _params[3] 操作（0：增加，1：减少） 
 * @param {Number} _params[4] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[5] 操作数
 */
// Change Parameter
Game_Interpreter.prototype.command317 = function() {
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        actor.addParam(this._params[2], value);
    }.bind(this));
    return true;
};

/* 增减技能 
 * @param {Number} _params[0] 角色指定方式（0：固定，1：变量） 
 * @param {Number} _params[1] 角色 ID（0 为全体队友）【固定】，或角色 ID 的变量 ID【变量】 
 * @param {Number} _params[2] 操作（0：学习，1：遗忘） 
 * @param {Number} _params[3] 技能 ID 
 */
// Change Skill
Game_Interpreter.prototype.command318 = function() {
    this.iterateActorEx(this._params[0], this._params[1], function(actor) {
        if (this._params[2] === 0) {
            actor.learnSkill(this._params[3]);
        } else {
            actor.forgetSkill(this._params[3]);
        }
    }.bind(this));
    return true;
};

/* 更改装备 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 装备类型 ID 
 * @param {Number} _params[2] 装备物品 ID 
 */
// Change Equipment
Game_Interpreter.prototype.command319 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.changeEquipById(this._params[1], this._params[2]);
    }
    return true;
};

/* 更改名字
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 名字 
 */
// Change Name
Game_Interpreter.prototype.command320 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setName(this._params[1]);
    }
    return true;
};

/* 更改职业 
 * @param {Number} _params[0] 角色 ID 
 * @param {Number} _params[1] 职业 ID 
 * @param {Boolean} _params[2] 是否保存等级 
 */
// Change Class
Game_Interpreter.prototype.command321 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor && $dataClasses[this._params[1]]) {
        actor.changeClass(this._params[1], this._params[2]);
    }
    return true;
};

/* 更改角色图像 
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 行走图名称 
 * @param {Number} _params[2] 行走图索引 
 * @param {String} _params[3] 脸图名称 
 * @param {Number} _params[4] 脸图索引 
 * @param {String} _params[5] 战斗图名称 
 */
// Change Actor Images
Game_Interpreter.prototype.command322 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setCharacterImage(this._params[1], this._params[2]);
        actor.setFaceImage(this._params[3], this._params[4]);
        actor.setBattlerImage(this._params[5]);
    }
    $gamePlayer.refresh();
    return true;
};

/* 更改载具图像 
 * @param {Number} _params[0] 载具（0：小舟，1：大船，2：飞艇） 
 * @param {String} _params[1] 图像名称 
 */
// Change Vehicle Image
Game_Interpreter.prototype.command323 = function() {
    var vehicle = $gameMap.vehicle(this._params[0]);
    if (vehicle) {
        vehicle.setImage(this._params[1], this._params[2]);
    }
    return true;
};

/* 更改昵称
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 昵称 
 */
// Change Nickname
Game_Interpreter.prototype.command324 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setNickname(this._params[1]);
    }
    return true;
};

/* 更改简介 
 * @param {Number} _params[0] 角色 ID 
 * @param {String} _params[1] 简介 
 */
// Change Profile
Game_Interpreter.prototype.command325 = function() {
    var actor = $gameActors.actor(this._params[0]);
    if (actor) {
        actor.setProfile(this._params[1]);
    }
    return true;
};

/* 增减敌人 HP 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 * @param {Boolean} _params[4] 是否允许导致无法战斗 
 */
// Change Enemy HP
Game_Interpreter.prototype.command331 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        this.changeHp(enemy, value, this._params[4]);
    }.bind(this));
    return true;
};

/* 增减敌人 MP 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 */
// Change Enemy MP
Game_Interpreter.prototype.command332 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainMp(value);
    }.bind(this));
    return true;
};

/* 增减敌人 TP 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：增加，1：减少） 
 * @param {Number} _params[2] 操作数类型（0：常量，1：变量） 
 * @param {Number} _params[3] 操作数 
 */
// Change Enemy TP
Game_Interpreter.prototype.command342 = function() {
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.gainTp(value);
    }.bind(this));
    return true;
};

/* 更改敌人状态 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 * @param {Number} _params[1] 操作（0：附加，1：解除） 
 * @param {Number} _params[2] 状态 ID 
 */
// Change Enemy State
Game_Interpreter.prototype.command333 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        var alreadyDead = enemy.isDead();
        if (this._params[1] === 0) {
            enemy.addState(this._params[2]);
        } else {
            enemy.removeState(this._params[2]);
        }
        if (enemy.isDead() && !alreadyDead) {
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
    return true;
};

/* 敌人完全恢复 
 * @param {Number} _params[0] 敌人索引（-1 为敌方全体） 
 */
// Enemy Recover All
Game_Interpreter.prototype.command334 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.recoverAll();
    }.bind(this));
    return true;
};

/* 敌人出现 
 * @param {Number} _params[0] 敌人索引 
 */
// Enemy Appear
Game_Interpreter.prototype.command335 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.appear();
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

/* 敌人变身 
 * @param {Number} _params[0] 敌人索引 
 * @param {Number} _params[0] 敌群 ID 
 */
// Enemy Transform
Game_Interpreter.prototype.command336 = function() {
    this.iterateEnemyIndex(this._params[0], function(enemy) {
        enemy.transform(this._params[1]);
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};

/* 显示战斗动画 
 * @param {Number} _params[0] 敌人索引 
 * @param {Number} _params[1] 动画 ID 
 * @param {Boolean} _params[2] 是否以敌方全体为目标 
 */
// Show Battle Animation
Game_Interpreter.prototype.command337 = function() {
    if (this._params[2] == true) {
        this.iterateEnemyIndex(-1,function(enemy) {
            if (enemy.isAlive()) {
                enemy.startAnimation(this._params[1],false,0);
            }
        }.bind(this));
    } else {
        this.iterateEnemyIndex(this._params[0], function (enemy) {
            if (enemy.isAlive()) {
                enemy.startAnimation(this._params[1], false, 0);
            }
        }.bind(this));
    }
    return true;
};

/* 强制战斗行动 
 * @param {Number} _params[0] 行动主体类型（0：敌人，1：角色） 
 * @param {Number} _params[1] 敌人索引【敌人】，或角色 ID【角色】 
 * @param {Number} _params[2] 技能 ID 
 * @param {Number} _params[3] 目标（-2：上一个目标，-1：随机，0：索引 1，1：索引 2，2：索引 3，3：索引 4，4：索引 5，5：索引 6，6：索引 7，7：索引 8） 
 */
// Force Action
Game_Interpreter.prototype.command339 = function() {
    this.iterateBattler(this._params[0], this._params[1], function(battler) {
        if (!battler.isDeathStateAffected()) {
            battler.forceAction(this._params[2], this._params[3]);
            BattleManager.forceAction(battler);
            this.setWaitMode('action');
        }
    }.bind(this));
    return true;
};

/* 中断战斗 */
// Abort Battle
Game_Interpreter.prototype.command340 = function() {
    BattleManager.abort();
    return true;
};

/* 打开菜单画面 */
// Open Menu Screen
Game_Interpreter.prototype.command351 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
    }
    return true;
};

/* 打开存档画面 */
// Open Save Screen
Game_Interpreter.prototype.command352 = function() {
    if (!$gameParty.inBattle()) {
        SceneManager.push(Scene_Save);
    }
    return true;
};

/* 游戏结束 */
// Game Over
Game_Interpreter.prototype.command353 = function() {
    SceneManager.goto(Scene_Gameover);
    return true;
};

/* 返回标题画面 */
// Return to Title Screen
Game_Interpreter.prototype.command354 = function() {
    SceneManager.goto(Scene_Title);
    return true;
};

/* 脚本 */
// Script
Game_Interpreter.prototype.command355 = function() {
    var script = this.currentCommand().parameters[0] + '\n';
    while (this.nextEventCode() === 655) {
        this._index++;
        script += this.currentCommand().parameters[0] + '\n';
    }
    eval(script);
    return true;
};

/* 插件指令 
 * @param {String} _params[0] 插件指令 
 */
// Plugin Command
Game_Interpreter.prototype.command356 = function() {
    var args = this._params[0].split(" ");
    var command = args.shift();
    this.pluginCommand(command, args);
    return true;
};

/* 插件指令 
 * 插件通过重写该方法来实现插件指令的功能。
 */
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    // 被插件重写 
    // to be overridden by plugins
};

/* 请求图像 */
Game_Interpreter.requestImages = function(list, commonList){
    if(!list) return;

    list.forEach(function(command){
        var params = command.parameters;
        switch(command.code){
            // 显示文字（Show Text）
            case 101:
                ImageManager.requestFace(params[0]);
                break;

            // 公共事件（Common Event）
            case 117:
                var commonEvent = $dataCommonEvents[params[0]];
                if (commonEvent) {
                    if (!commonList) {
                        commonList = [];
                    }
                    if (!commonList.contains(params[0])) {
                        commonList.push(params[0]);
                        Game_Interpreter.requestImages(commonEvent.list, commonList);
                    }
                }
                break;

            // 队伍管理（Change Party Member）
            case 129:
                var actor = $gameActors.actor(params[0]);
                if (actor && params[1] === 0) {
                    var name = actor.characterName();
                    ImageManager.requestCharacter(name);
                }
                break;

            // 设置移动路线（Set Movement Route）
            case 205:
                if(params[1]){
                    params[1].list.forEach(function(command){
                        var params = command.parameters;
                        if(command.code === Game_Character.ROUTE_CHANGE_IMAGE){
                            ImageManager.requestCharacter(params[0]);
                        }
                    });
                }
                break;

            // 显示动画，显示战斗动画（Show Animation, Show Battle Animation）
            case 212: case 337:
                if(params[1]) {
                    var animation = $dataAnimations[params[1]];
                    var name1 = animation.animation1Name;
                    var name2 = animation.animation2Name;
                    var hue1 = animation.animation1Hue;
                    var hue2 = animation.animation2Hue;
                    ImageManager.requestAnimation(name1, hue1);
                    ImageManager.requestAnimation(name2, hue2);
                }
                break;

            // 更改队列行进（Change Player Followers）
            case 216:
                if (params[0] === 0) {
                    $gamePlayer.followers().forEach(function(follower) {
                        var name = follower.characterName();
                        ImageManager.requestCharacter(name);
                    });
                }
                break;

            // 显示图片（Show Picture）
            case 231:
                ImageManager.requestPicture(params[1]);
                break;

            // 更改地图图块（Change Tileset）
            case 282:
                var tileset = $dataTilesets[params[0]];
                tileset.tilesetNames.forEach(function(tilesetName){
                    ImageManager.requestTileset(tilesetName);
                });
                break;

            // 更改战斗背景（Change Battle Back）
            case 283:
                if ($gameParty.inBattle()) {
                    ImageManager.requestBattleback1(params[0]);
                    ImageManager.requestBattleback2(params[1]);
                }
                break;

            // 更改远景（Change Parallax）
            case 284:
                if (!$gameParty.inBattle()) {
                    ImageManager.requestParallax(params[0]);
                }
                break;

            // 更改角色图像（Change Actor Images）
            case 322:
                ImageManager.requestCharacter(params[1]);
                ImageManager.requestFace(params[3]);
                ImageManager.requestSvActor(params[5]);
                break;

            // 更改载具图像（Change Vehicle Image）
            case 323:
                var vehicle = $gameMap.vehicle(params[0]);
                if(vehicle){
                    ImageManager.requestCharacter(params[1]);
                }
                break;

            // 敌人变身（Enemy Transform）
            case 336:
                var enemy = $dataEnemies[params[1]];
                var name = enemy.battlerName;
                var hue = enemy.battlerHue;
                if ($gameSystem.isSideView()) {
                    ImageManager.requestSvEnemy(name, hue);
                } else {
                    ImageManager.requestEnemy(name, hue);
                }
                break;
        }
    });
};