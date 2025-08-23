/**
 * @fileoverview Game_Action - 行动对象类
 * 
 * 战斗行动的游戏对象类。
 * The game object class for a battle action.
 * 
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 行动对象类
 * Game action class
 * 
 * @class Game_Action
 * @constructor
 */
function Game_Action() {
    this.initialize.apply(this, arguments);
}

// 效果常量定义 - Effect Constants
Game_Action.EFFECT_RECOVER_HP       = 11;  // 效果-恢复 HP - Effect: Recover HP
Game_Action.EFFECT_RECOVER_MP       = 12;  // 效果-恢复 MP - Effect: Recover MP
Game_Action.EFFECT_GAIN_TP          = 13;  // 效果-获得 TP - Effect: Gain TP
Game_Action.EFFECT_ADD_STATE        = 21;  // 效果-附加状态 - Effect: Add State
Game_Action.EFFECT_REMOVE_STATE     = 22;  // 效果-解除状态 - Effect: Remove State
Game_Action.EFFECT_ADD_BUFF         = 31;  // 效果-强化 - Effect: Add Buff
Game_Action.EFFECT_ADD_DEBUFF       = 32;  // 效果-弱化 - Effect: Add Debuff
Game_Action.EFFECT_REMOVE_BUFF      = 33;  // 效果-解除强化 - Effect: Remove Buff
Game_Action.EFFECT_REMOVE_DEBUFF    = 34;  // 效果-解除弱化 - Effect: Remove Debuff
Game_Action.EFFECT_SPECIAL          = 41;  // 效果-特殊效果 - Effect: Special
Game_Action.EFFECT_GROW             = 42;  // 效果-成长 - Effect: Grow
Game_Action.EFFECT_LEARN_SKILL      = 43;  // 效果-学会技能 - Effect: Learn Skill
Game_Action.EFFECT_COMMON_EVENT     = 44;  // 效果-公共事件 - Effect: Common Event
Game_Action.SPECIAL_EFFECT_ESCAPE   = 0;   // 特殊效果-逃跑 - Special Effect: Escape
Game_Action.HITTYPE_CERTAIN         = 0;   // 命中类型-必定命中 - Hit Type: Certain
Game_Action.HITTYPE_PHYSICAL        = 1;   // 命中类型-物理攻击 - Hit Type: Physical
Game_Action.HITTYPE_MAGICAL         = 2;   // 命中类型-魔法攻击 - Hit Type: Magical

/**
 * 初始化行动对象
 * Initialize action object
 * 
 * @memberof Game_Action
 * @method initialize
 * @param {Game_Battler} subject - 行动主体 - Action subject
 * @param {Boolean} forcing - 是否强制 - Whether forcing
 */
Game_Action.prototype.initialize = function(subject, forcing) {
    this._subjectActorId = 0;
    this._subjectEnemyIndex = -1;
    this._forcing = forcing || false;
    this.setSubject(subject);
    this.clear();
};

/**
 * 清除行动
 * Clear action
 * 
 * @memberof Game_Action
 * @method clear
 */
Game_Action.prototype.clear = function() {
    this._item = new Game_Item();
    this._targetIndex = -1;
};

/**
 * 设置行动主体
 * Set action subject
 * 
 * @memberof Game_Action
 * @method setSubject
 * @param {Game_Battler} subject - 行动主体 - Action subject
 */
Game_Action.prototype.setSubject = function(subject) {
    if (subject.isActor()) {
        this._subjectActorId = subject.actorId();
        this._subjectEnemyIndex = -1;
    } else {
        this._subjectEnemyIndex = subject.index();
        this._subjectActorId = 0;
    }
};

/**
 * 获取行动主体
 * Get action subject
 * 
 * @memberof Game_Action
 * @method subject
 * @returns {Game_Battler} 行动主体 - Action subject
 */
Game_Action.prototype.subject = function() {
    if (this._subjectActorId > 0) {
        return $gameActors.actor(this._subjectActorId);
    } else {
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};

/**
 * 获取我方单位
 * Get friends unit
 * 
 * @memberof Game_Action
 * @method friendsUnit
 * @returns {Game_Unit} 我方单位 - Friends unit
 */
Game_Action.prototype.friendsUnit = function() {
    return this.subject().friendsUnit();
};

/**
 * 获取敌方单位
 * Get opponents unit
 * 
 * @memberof Game_Action
 * @method opponentsUnit
 * @returns {Game_Unit} 敌方单位 - Opponents unit
 */
Game_Action.prototype.opponentsUnit = function() {
    return this.subject().opponentsUnit();
};

/**
 * 设置敌人行动
 * Set enemy action
 * 
 * @memberof Game_Action
 * @method setEnemyAction
 * @param {Object} action - 敌人行动数据 - Enemy action data
 */
Game_Action.prototype.setEnemyAction = function(action) {
    if (action) {
        this.setSkill(action.skillId);
    } else {
        this.clear();
    }
};

/**
 * 设置普通攻击
 * Set attack
 * 
 * @memberof Game_Action
 * @method setAttack
 */
Game_Action.prototype.setAttack = function() {
    this.setSkill(this.subject().attackSkillId());
};

/**
 * 设置防御
 * Set guard
 * 
 * @memberof Game_Action
 * @method setGuard
 */
Game_Action.prototype.setGuard = function() {
    this.setSkill(this.subject().guardSkillId());
};

/**
 * 设置技能
 * Set skill
 * 
 * @memberof Game_Action
 * @method setSkill
 * @param {Number} skillId - 技能ID - Skill ID
 */
Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
};

/**
 * 设置物品
 * Set item
 * 
 * @memberof Game_Action
 * @method setItem
 * @param {Number} itemId - 物品ID - Item ID
 */
Game_Action.prototype.setItem = function(itemId) {
    this._item.setObject($dataItems[itemId]);
};

/**
 * 设置项目对象
 * Set item object
 * 
 * @memberof Game_Action
 * @method setItemObject
 * @param {Object} object - 项目对象 - Item object
 */
Game_Action.prototype.setItemObject = function(object) {
    this._item.setObject(object);
};

/**
 * 设置目标
 * Set target
 * 
 * @memberof Game_Action
 * @method setTarget
 * @param {Number} targetIndex - 目标索引 - Target index
 */
Game_Action.prototype.setTarget = function(targetIndex) {
    this._targetIndex = targetIndex;
};

/**
 * 获取项目
 * Get item
 * 
 * @memberof Game_Action
 * @method item
 * @returns {Object} 项目对象 - Item object
 */
Game_Action.prototype.item = function() {
    return this._item.object();
};

/**
 * 是否是技能
 * Check if it is a skill
 * 
 * @memberof Game_Action
 * @method isSkill
 * @returns {Boolean} 是否为技能 - Whether it is a skill
 */
Game_Action.prototype.isSkill = function() {
    return this._item.isSkill();
};

/**
 * 是否是物品
 * Check if it is an item
 * 
 * @memberof Game_Action
 * @method isItem
 * @returns {Boolean} 是否为物品 - Whether it is an item
 */
Game_Action.prototype.isItem = function() {
    return this._item.isItem();
};

/**
 * 获取连续次数
 * Get number of repeats
 * 
 * @memberof Game_Action
 * @method numRepeats
 * @returns {Number} 连续次数 - Number of repeats
 */
Game_Action.prototype.numRepeats = function() {
    var repeats = this.item().repeats;
    if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

/**
 * 检测项目范围
 * Check item scope
 * 
 * @memberof Game_Action
 * @method checkItemScope
 * @param {Array} list - 范围列表 - Scope list
 * @returns {Boolean} 是否在范围内 - Whether in scope
 */
Game_Action.prototype.checkItemScope = function(list) {
    return list.contains(this.item().scope);
};

/**
 * 是否作用于敌方
 * Check if for opponent
 * 
 * @memberof Game_Action
 * @method isForOpponent
 * @returns {Boolean} 是否作用于敌方 - Whether for opponent
 */
Game_Action.prototype.isForOpponent = function() {
    return this.checkItemScope([1, 2, 3, 4, 5, 6]);
};

/**
 * 是否作用于我方
 * Check if for friend
 * 
 * @memberof Game_Action
 * @method isForFriend
 * @returns {Boolean} 是否作用于我方 - Whether for friend
 */
Game_Action.prototype.isForFriend = function() {
    return this.checkItemScope([7, 8, 9, 10, 11]);
};

/**
 * 是否作用于我方无法战斗的
 * Check if for dead friend
 * 
 * @memberof Game_Action
 * @method isForDeadFriend
 * @returns {Boolean} 是否作用于死亡我方 - Whether for dead friend
 */
Game_Action.prototype.isForDeadFriend = function() {
    return this.checkItemScope([9, 10]);
};

/**
 * 是否作用于使用者
 * Check if for user
 * 
 * @memberof Game_Action
 * @method isForUser
 * @returns {Boolean} 是否作用于使用者 - Whether for user
 */
Game_Action.prototype.isForUser = function() {
    return this.checkItemScope([11]);
};

/**
 * 是否作用于单体
 * Check if for one target
 * 
 * @memberof Game_Action
 * @method isForOne
 * @returns {Boolean} 是否作用于单体 - Whether for one target
 */
Game_Action.prototype.isForOne = function() {
    return this.checkItemScope([1, 3, 7, 9, 11]);
};

/**
 * 是否作用于随机目标
 * Check if for random targets
 * 
 * @memberof Game_Action
 * @method isForRandom
 * @returns {Boolean} 是否作用于随机目标 - Whether for random targets
 */
Game_Action.prototype.isForRandom = function() {
    return this.checkItemScope([3, 4, 5, 6]);
};

/**
 * 是否作用于全体
 * Check if for all targets
 * 
 * @memberof Game_Action
 * @method isForAll
 * @returns {Boolean} 是否作用于全体 - Whether for all targets
 */
Game_Action.prototype.isForAll = function() {
    return this.checkItemScope([2, 8, 10]);
};

/**
 * 是否需要选择目标
 * Check if needs selection
 * 
 * @memberof Game_Action
 * @method needsSelection
 * @returns {Boolean} 是否需要选择 - Whether needs selection
 */
Game_Action.prototype.needsSelection = function() {
    return this.checkItemScope([1, 7, 9]);
};

/**
 * 获取目标数量
 * Get number of targets
 * 
 * @memberof Game_Action
 * @method numTargets
 * @returns {Number} 目标数量 - Number of targets
 */
Game_Action.prototype.numTargets = function() {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

/**
 * 检测伤害类型
 * Check damage type
 * 
 * @memberof Game_Action
 * @method checkDamageType
 * @param {Array} list - 伤害类型列表 - Damage type list
 * @returns {Boolean} 是否匹配 - Whether matches
 */
Game_Action.prototype.checkDamageType = function(list) {
    return list.contains(this.item().damage.type);
};

/**
 * 是否是HP效果
 * Check if HP effect
 * 
 * @memberof Game_Action
 * @method isHpEffect
 * @returns {Boolean} 是否为HP效果 - Whether HP effect
 */
Game_Action.prototype.isHpEffect = function() {
    return this.checkDamageType([1, 3, 5]);
};

/**
 * 是否是MP效果
 * Check if MP effect
 * 
 * @memberof Game_Action
 * @method isMpEffect
 * @returns {Boolean} 是否为MP效果 - Whether MP effect
 */
Game_Action.prototype.isMpEffect = function() {
    return this.checkDamageType([2, 4, 6]);
};

/**
 * 是否是伤害
 * Check if damage
 * 
 * @memberof Game_Action
 * @method isDamage
 * @returns {Boolean} 是否为伤害 - Whether damage
 */
Game_Action.prototype.isDamage = function() {
    return this.checkDamageType([1, 2]);
};

/**
 * 是否是恢复
 * Check if recover
 * 
 * @memberof Game_Action
 * @method isRecover
 * @returns {Boolean} 是否为恢复 - Whether recover
 */
Game_Action.prototype.isRecover = function() {
    return this.checkDamageType([3, 4]);
};

/**
 * 是否是吸收
 * Check if drain
 * 
 * @memberof Game_Action
 * @method isDrain
 * @returns {Boolean} 是否为吸收 - Whether drain
 */
Game_Action.prototype.isDrain = function() {
    return this.checkDamageType([5, 6]);
};

/**
 * 是否是HP恢复
 * Check if HP recover
 * 
 * @memberof Game_Action
 * @method isHpRecover
 * @returns {Boolean} 是否为HP恢复 - Whether HP recover
 */
Game_Action.prototype.isHpRecover = function() {
    return this.checkDamageType([3]);
};

/**
 * 是否是MP恢复
 * Check if MP recover
 * 
 * @memberof Game_Action
 * @method isMpRecover
 * @returns {Boolean} 是否为MP恢复 - Whether MP recover
 */
Game_Action.prototype.isMpRecover = function() {
    return this.checkDamageType([4]);
};

/**
 * 是否是必定命中
 * Check if certain hit
 * 
 * @memberof Game_Action
 * @method isCertainHit
 * @returns {Boolean} 是否必定命中 - Whether certain hit
 */
Game_Action.prototype.isCertainHit = function() {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

/**
 * 是否是物理攻击
 * Check if physical attack
 * 
 * @memberof Game_Action
 * @method isPhysical
 * @returns {Boolean} 是否为物理攻击 - Whether physical attack
 */
Game_Action.prototype.isPhysical = function() {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

/**
 * 是否是魔法攻击
 * Check if magical attack
 * 
 * @memberof Game_Action
 * @method isMagical
 * @returns {Boolean} 是否为魔法攻击 - Whether magical attack
 */
Game_Action.prototype.isMagical = function() {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

/**
 * 是否是普通攻击
 * Check if normal attack
 * 
 * @memberof Game_Action
 * @method isAttack
 * @returns {Boolean} 是否为普通攻击 - Whether normal attack
 */
Game_Action.prototype.isAttack = function() {
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};

/**
 * 是否是防御
 * Check if guard
 * 
 * @memberof Game_Action
 * @method isGuard
 * @returns {Boolean} 是否为防御 - Whether guard
 */
Game_Action.prototype.isGuard = function() {
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};

/**
 * 是否是魔法技能
 * Check if magic skill
 * 
 * @memberof Game_Action
 * @method isMagicSkill
 * @returns {Boolean} 是否为魔法技能 - Whether magic skill
 */
Game_Action.prototype.isMagicSkill = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.contains(this.item().stypeId);
    } else {
        return false;
    }
};

/**
 * 决定随机目标
 * Decide random target
 * 
 * @memberof Game_Action
 * @method decideRandomTarget
 */
Game_Action.prototype.decideRandomTarget = function() {
    var target;
    if (this.isForDeadFriend()) {
        target = this.friendsUnit().randomDeadTarget();
    } else if (this.isForFriend()) {
        target = this.friendsUnit().randomTarget();
    } else {
        target = this.opponentsUnit().randomTarget();
    }
    if (target) {
        this._targetIndex = target.index();
    } else {
        this.clear();
    }
};

/**
 * 设置混乱行动
 * Set confusion action
 * 
 * @memberof Game_Action
 * @method setConfusion
 */
Game_Action.prototype.setConfusion = function() {
    this.setAttack();
};

/**
 * 准备行动
 * Prepare action
 * 
 * @memberof Game_Action
 * @method prepare
 */
Game_Action.prototype.prepare = function() {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

/**
 * 是否有效
 * Check if valid
 * 
 * @memberof Game_Action
 * @method isValid
 * @returns {Boolean} 是否有效 - Whether valid
 */
Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

/**
 * 获取速度
 * Get speed
 * 
 * @memberof Game_Action
 * @method speed
 * @returns {Number} 速度值 - Speed value
 */
Game_Action.prototype.speed = function() {
    var agi = this.subject().agi;
    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

/**
 * 制作目标列表
 * Make targets
 * 
 * @memberof Game_Action
 * @method makeTargets
 * @returns {Array} 目标列表 - Target list
 */
Game_Action.prototype.makeTargets = function() {
    var targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets = [this.confusionTarget()];
    } else if (this.isForOpponent()) {
        targets = this.targetsForOpponents();
    } else if (this.isForFriend()) {
        targets = this.targetsForFriends();
    }
    return this.repeatTargets(targets);
};

/**
 * 处理连续目标
 * Process repeat targets
 * 
 * @memberof Game_Action
 * @method repeatTargets
 * @param {Array} targets - 目标列表 - Target list
 * @returns {Array} 重复目标列表 - Repeated target list
 */
Game_Action.prototype.repeatTargets = function(targets) {
    var repeatedTargets = [];
    var repeats = this.numRepeats();
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (target) {
            for (var j = 0; j < repeats; j++) {
                repeatedTargets.push(target);
            }
        }
    }
    return repeatedTargets;
};

/**
 * 获取混乱目标
 * Get confusion target
 * 
 * @memberof Game_Action
 * @method confusionTarget
 * @returns {Game_Battler} 混乱目标 - Confusion target
 */
Game_Action.prototype.confusionTarget = function() {
    switch (this.subject().confusionLevel()) {
    case 1:
        return this.opponentsUnit().randomTarget();
    case 2:
        if (Math.randomInt(2) === 0) {
            return this.opponentsUnit().randomTarget();
        }
        return this.friendsUnit().randomTarget();
    default:
        return this.friendsUnit().randomTarget();
    }
};

/**
 * 获取敌方目标
 * Get targets for opponents
 * 
 * @memberof Game_Action
 * @method targetsForOpponents
 * @returns {Array} 敌方目标列表 - Opponent target list
 */
Game_Action.prototype.targetsForOpponents = function() {
    var targets = [];
    var unit = this.opponentsUnit();
    if (this.isForRandom()) {
        for (var i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget());
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget());
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

/**
 * 获取我方目标
 * Get targets for friends
 * 
 * @memberof Game_Action
 * @method targetsForFriends
 * @returns {Array} 我方目标列表 - Friend target list
 */
Game_Action.prototype.targetsForFriends = function() {
    var targets = [];
    var unit = this.friendsUnit();
    if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        if (this.isForOne()) {
            targets.push(unit.smoothDeadTarget(this._targetIndex));
        } else {
            targets = unit.deadMembers();
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget());
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

/**
 * 评估行动价值
 * Evaluate action
 * 
 * @memberof Game_Action
 * @method evaluate
 * @returns {Number} 评估值 - Evaluation value
 */
Game_Action.prototype.evaluate = function() {
    var value = 0;
    this.itemTargetCandidates().forEach(function(target) {
        var targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index();
        }
    }, this);
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};

/**
 * 获取项目目标候选
 * Get item target candidates
 * 
 * @memberof Game_Action
 * @method itemTargetCandidates
 * @returns {Array} 候选目标列表 - Candidate target list
 */
Game_Action.prototype.itemTargetCandidates = function() {
    if (!this.isValid()) {
        return [];
    } else if (this.isForOpponent()) {
        return this.opponentsUnit().aliveMembers();
    } else if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.friendsUnit().deadMembers();
    } else {
        return this.friendsUnit().aliveMembers();
    }
};

/**
 * 对目标进行评估
 * Evaluate with target
 * 
 * @memberof Game_Action
 * @method evaluateWithTarget
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 评估值 - Evaluation value
 */
Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        var value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            var recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

/**
 * 测试是否可应用
 * Test if can apply
 * 
 * @memberof Game_Action
 * @method testApply
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Boolean} 是否可应用 - Whether can apply
 */
Game_Action.prototype.testApply = function(target) {
    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));
};

/**
 * 项目是否有任何有效效果
 * Check if item has any valid effects
 * 
 * @memberof Game_Action
 * @method hasItemAnyValidEffects
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Boolean} 是否有效果 - Whether has effects
 */
Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(function(effect) {
        return this.testItemEffect(target, effect);
    }, this);
};

/**
 * 测试项目效果
 * Test item effect
 * 
 * @memberof Game_Action
 * @method testItemEffect
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 * @returns {Boolean} 是否有效 - Whether valid
 */
Game_Action.prototype.testItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_RECOVER_MP:
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_ADD_STATE:
        return !target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_STATE:
        return target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_ADD_BUFF:
        return !target.isMaxBuffAffected(effect.dataId);
    case Game_Action.EFFECT_ADD_DEBUFF:
        return !target.isMaxDebuffAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_BUFF:
        return target.isBuffAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_DEBUFF:
        return target.isDebuffAffected(effect.dataId);
    case Game_Action.EFFECT_LEARN_SKILL:
        return target.isActor() && !target.isLearnedSkill(effect.dataId);
    default:
        return true;
    }
};

/**
 * 获取项目反击值
 * Get item counter attack value
 * 
 * @memberof Game_Action
 * @method itemCnt
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 反击值 - Counter attack value
 */
Game_Action.prototype.itemCnt = function(target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};

/**
 * 获取项目魔法反射值
 * Get item magic reflection value
 * 
 * @memberof Game_Action
 * @method itemMrf
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 魔法反射值 - Magic reflection value
 */
Game_Action.prototype.itemMrf = function(target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};

/**
 * 获取项目命中率值
 * Get item hit rate value
 * 
 * @memberof Game_Action
 * @method itemHit
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 命中率值 - Hit rate value
 */
Game_Action.prototype.itemHit = function(target) {
    if (this.isPhysical()) {
        return this.item().successRate * 0.01 * this.subject().hit;
    } else {
        return this.item().successRate * 0.01;
    }
};

/**
 * 获取项目回避率值
 * Get item evasion rate value
 * 
 * @memberof Game_Action
 * @method itemEva
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 回避率值 - Evasion rate value
 */
Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        return target.eva;
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};

/**
 * 获取项目暴击率值
 * Get item critical rate value
 * 
 * @memberof Game_Action
 * @method itemCri
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 暴击率值 - Critical rate value
 */
Game_Action.prototype.itemCri = function(target) {
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
};

/**
 * 应用行动
 * Apply action
 * 
 * @memberof Game_Action
 * @method apply
 * @param {Game_Battler} target - 目标 - Target
 */
Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

/**
 * 制作伤害值
 * Make damage value
 * 
 * @memberof Game_Action
 * @method makeDamageValue
 * @param {Game_Battler} target - 目标 - Target
 * @param {Boolean} critical - 是否暴击 - Whether critical
 * @returns {Number} 伤害值 - Damage value
 */
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

/**
 * 计算伤害公式
 * Evaluate damage formula
 * 
 * @memberof Game_Action
 * @method evalDamageFormula
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 计算结果 - Calculation result
 */
Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        var item = this.item();
        var a = this.subject();
        var b = target;
        var v = $gameVariables._data;
        var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
        var value = Math.max(eval(item.damage.formula), 0) * sign;
        if (isNaN(value)) value = 0;
        return value;
    } catch (e) {
        return 0;
    }
};

/**
 * 计算属性有效度
 * Calculate element rate
 * 
 * @memberof Game_Action
 * @method calcElementRate
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 属性有效度 - Element rate
 */
Game_Action.prototype.calcElementRate = function(target) {
    if (this.item().damage.elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        return target.elementRate(this.item().damage.elementId);
    }
};

/**
 * 计算属性最高有效度
 * Calculate max element rate
 * 
 * @memberof Game_Action
 * @method elementsMaxRate
 * @param {Game_Battler} target - 目标 - Target
 * @param {Array} elements - 属性列表 - Element list
 * @returns {Number} 最高有效度 - Max rate
 */
Game_Action.prototype.elementsMaxRate = function(target, elements) {
    if (elements.length > 0) {
        return Math.max.apply(null, elements.map(function(elementId) {
            return target.elementRate(elementId);
        }, this));
    } else {
        return 1;
    }
};

/**
 * 应用暴击
 * Apply critical
 * 
 * @memberof Game_Action
 * @method applyCritical
 * @param {Number} damage - 伤害值 - Damage value
 * @returns {Number} 暴击伤害值 - Critical damage value
 */
Game_Action.prototype.applyCritical = function(damage) {
    return damage * 3;
};

/**
 * 应用分散度
 * Apply variance
 * 
 * @memberof Game_Action
 * @method applyVariance
 * @param {Number} damage - 伤害值 - Damage value
 * @param {Number} variance - 分散度 - Variance
 * @returns {Number} 最终伤害值 - Final damage value
 */
Game_Action.prototype.applyVariance = function(damage, variance) {
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

/**
 * 应用防御
 * Apply guard
 * 
 * @memberof Game_Action
 * @method applyGuard
 * @param {Number} damage - 伤害值 - Damage value
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 防御后伤害值 - Damage after guard
 */
Game_Action.prototype.applyGuard = function(damage, target) {
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};

/**
 * 执行伤害
 * Execute damage
 * 
 * @memberof Game_Action
 * @method executeDamage
 * @param {Game_Battler} target - 目标 - Target
 * @param {Number} value - 伤害值 - Damage value
 */
Game_Action.prototype.executeDamage = function(target, value) {
    var result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};

/**
 * 执行HP伤害
 * Execute HP damage
 * 
 * @memberof Game_Action
 * @method executeHpDamage
 * @param {Game_Battler} target - 目标 - Target
 * @param {Number} value - 伤害值 - Damage value
 */
Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    this.gainDrainedHp(value);
};

/**
 * 执行MP伤害
 * Execute MP damage
 * 
 * @memberof Game_Action
 * @method executeMpDamage
 * @param {Game_Battler} target - 目标 - Target
 * @param {Number} value - 伤害值 - Damage value
 */
Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

/**
 * 获得吸收的HP
 * Gain drained HP
 * 
 * @memberof Game_Action
 * @method gainDrainedHp
 * @param {Number} value - 吸收值 - Drained value
 */
Game_Action.prototype.gainDrainedHp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
            gainTarget = this._reflectionTarget;
        }
       gainTarget.gainHp(value);
    }
};

/**
 * 获得吸收的MP
 * Gain drained MP
 * 
 * @memberof Game_Action
 * @method gainDrainedMp
 * @param {Number} value - 吸收值 - Drained value
 */
Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
           gainTarget = this._reflectionTarget;
       }
       gainTarget.gainMp(value);
    }
};

/**
 * 应用项目效果
 * Apply item effect
 * 
 * @memberof Game_Action
 * @method applyItemEffect
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.applyItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        this.itemEffectRecoverHp(target, effect);
        break;
    case Game_Action.EFFECT_RECOVER_MP:
        this.itemEffectRecoverMp(target, effect);
        break;
    case Game_Action.EFFECT_GAIN_TP:
        this.itemEffectGainTp(target, effect);
        break;
    case Game_Action.EFFECT_ADD_STATE:
        this.itemEffectAddState(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_STATE:
        this.itemEffectRemoveState(target, effect);
        break;
    case Game_Action.EFFECT_ADD_BUFF:
        this.itemEffectAddBuff(target, effect);
        break;
    case Game_Action.EFFECT_ADD_DEBUFF:
        this.itemEffectAddDebuff(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_BUFF:
        this.itemEffectRemoveBuff(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_DEBUFF:
        this.itemEffectRemoveDebuff(target, effect);
        break;
    case Game_Action.EFFECT_SPECIAL:
        this.itemEffectSpecial(target, effect);
        break;
    case Game_Action.EFFECT_GROW:
        this.itemEffectGrow(target, effect);
        break;
    case Game_Action.EFFECT_LEARN_SKILL:
        this.itemEffectLearnSkill(target, effect);
        break;
    case Game_Action.EFFECT_COMMON_EVENT:
        this.itemEffectCommonEvent(target, effect);
        break;
    }
};

/**
 * 项目效果 - 恢复HP
 * Item effect - recover HP
 * 
 * @memberof Game_Action
 * @method itemEffectRecoverHp
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 恢复MP
 * Item effect - recover MP
 * 
 * @memberof Game_Action
 * @method itemEffectRecoverMp
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 获得TP
 * Item effect - gain TP
 * 
 * @memberof Game_Action
 * @method itemEffectGainTp
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    var value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 附加状态
 * Item effect - add state
 * 
 * @memberof Game_Action
 * @method itemEffectAddState
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectAddState = function(target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};

/**
 * 项目效果 - 附加普通攻击状态
 * Item effect - add attack state
 * 
 * @memberof Game_Action
 * @method itemEffectAddAttackState
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    this.subject().attackStates().forEach(function(stateId) {
        var chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }.bind(this), target);
};

/**
 * 项目效果 - 附加普通状态
 * Item effect - add normal state
 * 
 * @memberof Game_Action
 * @method itemEffectAddNormalState
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    var chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 解除状态
 * Item effect - remove state
 * 
 * @memberof Game_Action
 * @method itemEffectRemoveState
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    var chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 强化
 * Item effect - add buff
 * 
 * @memberof Game_Action
 * @method itemEffectAddBuff
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};

/**
 * 项目效果 - 弱化
 * Item effect - add debuff
 * 
 * @memberof Game_Action
 * @method itemEffectAddDebuff
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 解除强化
 * Item effect - remove buff
 * 
 * @memberof Game_Action
 * @method itemEffectRemoveBuff
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 解除弱化
 * Item effect - remove debuff
 * 
 * @memberof Game_Action
 * @method itemEffectRemoveDebuff
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 特殊效果
 * Item effect - special
 * 
 * @memberof Game_Action
 * @method itemEffectSpecial
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 成长
 * Item effect - grow
 * 
 * @memberof Game_Action
 * @method itemEffectGrow
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectGrow = function(target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};

/**
 * 项目效果 - 学会技能
 * Item effect - learn skill
 * 
 * @memberof Game_Action
 * @method itemEffectLearnSkill
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};

/**
 * 项目效果 - 公共事件
 * Item effect - common event
 * 
 * @memberof Game_Action
 * @method itemEffectCommonEvent
 * @param {Game_Battler} target - 目标 - Target
 * @param {Object} effect - 效果 - Effect
 */
Game_Action.prototype.itemEffectCommonEvent = function(target, effect) {
};

/**
 * 制作成功结果
 * Make success result
 * 
 * @memberof Game_Action
 * @method makeSuccess
 * @param {Game_Battler} target - 目标 - Target
 */
Game_Action.prototype.makeSuccess = function(target) {
    target.result().success = true;
};

/**
 * 应用项目使用者效果
 * Apply item user effect
 * 
 * @memberof Game_Action
 * @method applyItemUserEffect
 * @param {Game_Battler} target - 目标 - Target
 */
Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

/**
 * 获取幸运效果变化率
 * Get luck effect rate
 * 
 * @memberof Game_Action
 * @method lukEffectRate
 * @param {Game_Battler} target - 目标 - Target
 * @returns {Number} 幸运效果率 - Luck effect rate
 */
Game_Action.prototype.lukEffectRate = function(target) {
    return Math.max(1.0 + (this.subject().luk - target.luk) * 0.001, 0.0);
};

/**
 * 应用全局效果
 * Apply global effects
 * 
 * @memberof Game_Action
 * @method applyGlobal
 */
Game_Action.prototype.applyGlobal = function() {
    this.item().effects.forEach(function(effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};