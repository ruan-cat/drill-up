/**
 * @fileoverview BattleManager - 战斗管理器
 * @description 管理战斗进程的静态类，控制整个战斗系统的流程和状态
 * The static class that manages battle progress, controls the flow and state of the entire battle system
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * BattleManager - 战斗管理器
 * 
 * 管理战斗进程的静态类。
 * 负责战斗的初始化、回合管理、行动处理、结果计算等核心功能。
 * 
 * The static class that manages battle progress.
 * Responsible for battle initialization, turn management, action processing,
 * result calculation and other core functions.
 */
function BattleManager() {
    throw new Error('This is a static class');
}

/**
 * 设置战斗
 * Setup battle
 * 
 * @param {number} troopId - 敌群 ID / Troop ID
 * @param {boolean} canEscape - 是否可以逃跑 / Whether can escape
 * @param {boolean} canLose - 是否可以失败 / Whether can lose
 */
BattleManager.setup = function(troopId, canEscape, canLose) {
    this.initMembers();
    this._canEscape = canEscape;
    this._canLose = canLose;
    $gameTroop.setup(troopId);
    $gameScreen.onBattleStart();
    this.makeEscapeRatio();
};

/**
 * 初始化成员变量
 * Initialize member variables
 */
BattleManager.initMembers = function() {
    this._phase = 'init';              // 阶段 / Phase
    this._canEscape = false;           // 可以逃跑 / Can escape
    this._canLose = false;             // 可以战败 / Can lose
    this._battleTest = false;          // 战斗测试 / Battle test
    this._eventCallback = null;        // 事件回调 / Event callback
    this._preemptive = false;          // 先发制人 / Preemptive
    this._surprise = false;            // 偷袭 / Surprise
    this._actorIndex = -1;             // 角色索引 / Actor index
    this._actionForcedBattler = null;  // 强制行动战斗者 / Forced action battler
    this._mapBgm = null;               // 地图 BGM / Map BGM
    this._mapBgs = null;               // 地图 BGS / Map BGS
    this._actionBattlers = [];         // 行动战斗者 / Action battlers
    this._subject = null;              // 主体 / Subject
    this._action = null;               // 行动 / Action
    this._targets = [];                // 目标 / Targets
    this._logWindow = null;            // 日志窗口 / Log window
    this._statusWindow = null;         // 状态窗口 / Status window
    this._spriteset = null;            // 精灵组 / Spriteset
    this._escapeRatio = 0;             // 逃跑概率 / Escape ratio
    this._escaped = false;             // 逃跑 / Escaped
    this._rewards = {};                // 奖励 / Rewards
    this._turnForced = false;          // 强制回合 / Turn forced
};

/**
 * 是否战斗测试
 * Check if battle test
 * 
 * @returns {boolean} 是否战斗测试 / Whether battle test
 */
BattleManager.isBattleTest = function() {
    return this._battleTest;
};

/**
 * 设置战斗测试
 * Set battle test
 * 
 * @param {boolean} battleTest - 战斗测试标志 / Battle test flag
 */
BattleManager.setBattleTest = function(battleTest) {
    this._battleTest = battleTest;
};

/**
 * 设置事件回调
 * Set event callback
 * 
 * @param {Function} callback - 回调函数 / Callback function
 */
BattleManager.setEventCallback = function(callback) {
    this._eventCallback = callback;
};

/**
 * 设置日志窗口
 * Set log window
 * 
 * @param {Window_BattleLog} logWindow - 日志窗口 / Log window
 */
BattleManager.setLogWindow = function(logWindow) {
    this._logWindow = logWindow;
};

/**
 * 设置状态窗口
 * Set status window
 * 
 * @param {Window_BattleStatus} statusWindow - 状态窗口 / Status window
 */
BattleManager.setStatusWindow = function(statusWindow) {
    this._statusWindow = statusWindow;
};

/**
 * 设置精灵组
 * Set spriteset
 * 
 * @param {Spriteset_Battle} spriteset - 精灵组 / Spriteset
 */
BattleManager.setSpriteset = function(spriteset) {
    this._spriteset = spriteset;
};

/**
 * 当遇敌时处理
 * Handle encounter
 */
BattleManager.onEncounter = function() {
    this._preemptive = (Math.random() < this.ratePreemptive());
    this._surprise = (Math.random() < this.rateSurprise() && !this._preemptive);
};

/**
 * 先发制人概率
 * Preemptive rate
 * 
 * @returns {number} 先发制人概率 / Preemptive rate
 */
BattleManager.ratePreemptive = function() {
    return $gameParty.ratePreemptive($gameTroop.agility());
};

/**
 * 偷袭概率
 * Surprise rate
 * 
 * @returns {number} 偷袭概率 / Surprise rate
 */
BattleManager.rateSurprise = function() {
    return $gameParty.rateSurprise($gameTroop.agility());
};

/**
 * 保存 BGM 和 BGS
 * Save BGM and BGS
 */
BattleManager.saveBgmAndBgs = function() {
    this._mapBgm = AudioManager.saveBgm();
    this._mapBgs = AudioManager.saveBgs();
};

/**
 * 播放战斗 BGM
 * Play battle BGM
 */
BattleManager.playBattleBgm = function() {
    AudioManager.playBgm($gameSystem.battleBgm());
    AudioManager.stopBgs();
};

/**
 * 播放胜利 ME
 * Play victory ME
 */
BattleManager.playVictoryMe = function() {
    AudioManager.playMe($gameSystem.victoryMe());
};

/**
 * 播放失败 ME
 * Play defeat ME
 */
BattleManager.playDefeatMe = function() {
    AudioManager.playMe($gameSystem.defeatMe());
};

/**
 * 还原战斗 BGM 和 BGS
 * Replay BGM and BGS
 */
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

/**
 * 制作逃跑概率
 * Make escape ratio
 */
BattleManager.makeEscapeRatio = function() {
    this._escapeRatio = 0.5 * $gameParty.agility() / $gameTroop.agility();
};

/**
 * 更新战斗管理器
 * Update battle manager
 */
BattleManager.update = function() {
    if (!this.isBusy() && !this.updateEvent()) {
        switch (this._phase) {
        case 'start': // 开始 / Start
            this.startInput();
            break;
        case 'turn': // 回合 / Turn
            this.updateTurn();
            break;
        case 'action': // 行动 / Action
            this.updateAction();
            break;
        case 'turnEnd': // 回合结束 / Turn end
            this.updateTurnEnd();
            break;
        case 'battleEnd': // 战斗结束 / Battle end
            this.updateBattleEnd();
            break;
        }
    }
};

/**
 * 更新事件
 * Update event
 * 
 * @returns {boolean} 是否有事件在执行 / Whether event is running
 */
BattleManager.updateEvent = function() {
    switch (this._phase) {
        case 'start': // 开始 / Start
        case 'turn': // 回合 / Turn
        case 'turnEnd': // 回合结束 / Turn end
            if (this.isActionForced()) {
                this.processForcedAction();
                return true;
            } else {
                return this.updateEventMain();
            }
    }
    return this.checkAbort();
};

/**
 * 更新事件主函数
 * Update event main
 * 
 * @returns {boolean} 是否有事件在执行 / Whether event is running
 */
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

/**
 * 是否繁忙
 * Check if busy
 * 
 * @returns {boolean} 是否繁忙 / Whether busy
 */
BattleManager.isBusy = function() {
    return ($gameMessage.isBusy() || this._spriteset.isBusy() ||
            this._logWindow.isBusy());
};

/**
 * 是否输入中
 * Check if inputting
 * 
 * @returns {boolean} 是否输入中 / Whether inputting
 */
BattleManager.isInputting = function() {
    return this._phase === 'input';
};

/**
 * 是否在回合中
 * Check if in turn
 * 
 * @returns {boolean} 是否在回合中 / Whether in turn
 */
BattleManager.isInTurn = function() {
    return this._phase === 'turn';
};

/**
 * 是否回合结束
 * Check if turn end
 * 
 * @returns {boolean} 是否回合结束 / Whether turn end
 */
BattleManager.isTurnEnd = function() {
    return this._phase === 'turnEnd';
};

/**
 * 是否终止
 * Check if aborting
 * 
 * @returns {boolean} 是否终止 / Whether aborting
 */
BattleManager.isAborting = function() {
    return this._phase === 'aborting';
};

/**
 * 是否战斗结束
 * Check if battle end
 * 
 * @returns {boolean} 是否战斗结束 / Whether battle end
 */
BattleManager.isBattleEnd = function() {
    return this._phase === 'battleEnd';
};

/**
 * 能否逃跑
 * Check if can escape
 * 
 * @returns {boolean} 能否逃跑 / Whether can escape
 */
BattleManager.canEscape = function() {
    return this._canEscape;
};

/**
 * 能否失败
 * Check if can lose
 * 
 * @returns {boolean} 能否失败 / Whether can lose
 */
BattleManager.canLose = function() {
    return this._canLose;
};

/**
 * 是否逃跑
 * Check if escaped
 * 
 * @returns {boolean} 是否逃跑 / Whether escaped
 */
BattleManager.isEscaped = function() {
    return this._escaped;
};

/**
 * 获取当前角色
 * Get current actor
 * 
 * @returns {Game_Actor} 角色对象 / Actor object
 */
BattleManager.actor = function() {
    return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
};

/**
 * 清除角色
 * Clear actor
 */
BattleManager.clearActor = function() {
    this.changeActor(-1, '');
};

/**
 * 切换角色
 * Change actor
 * 
 * @param {number} newActorIndex - 新角色索引 / New actor index
 * @param {string} lastActorActionState - 上一个角色的行动状态 / Last actor action state
 */
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

/**
 * 开始战斗
 * Start battle
 */
BattleManager.startBattle = function() {
    this._phase = 'start';
    $gameSystem.onBattleStart();
    $gameParty.onBattleStart();
    $gameTroop.onBattleStart();
    this.displayStartMessages();
};

/**
 * 显示开始信息
 * Display start messages
 */
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

/**
 * 开始输入
 * Start input
 */
BattleManager.startInput = function() {
    this._phase = 'input';
    $gameParty.makeActions();
    $gameTroop.makeActions();
    this.clearActor();
    if (this._surprise || !$gameParty.canInput()) {
        this.startTurn();
    }
};

/**
 * 输入行动
 * Get inputting action
 * 
 * @returns {Game_Action} 行动对象 / Action object
 */
BattleManager.inputtingAction = function() {
    return this.actor() ? this.actor().inputtingAction() : null;
};

/**
 * 选择下一个命令
 * Select next command
 */
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

/**
 * 选择上一个命令
 * Select previous command
 */
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

/**
 * 刷新状态
 * Refresh status
 */
BattleManager.refreshStatus = function() {
    this._statusWindow.refresh();
};

/**
 * 开始回合
 * Start turn
 */
BattleManager.startTurn = function() {
    this._phase = 'turn';
    this.clearActor();
    $gameTroop.increaseTurn();
    this.makeActionOrders();
    $gameParty.requestMotionRefresh();
    this._logWindow.startTurn();
};

/**
 * 更新回合
 * Update turn
 */
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

/**
 * 处理回合
 * Process turn
 */
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

/**
 * 结束回合
 * End turn
 */
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

/**
 * 是否强制回合
 * Check if forced turn
 * 
 * @returns {boolean} 是否强制回合 / Whether forced turn
 */
BattleManager.isForcedTurn = function () {
    return this._turnForced;
};

/**
 * 更新回合结束
 * Update turn end
 */
BattleManager.updateTurnEnd = function() {
    this.startInput();
};

/**
 * 获取下一个主体
 * Get next subject
 * 
 * @returns {Game_Battler} 战斗者对象 / Battler object
 */
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

/**
 * 所有战斗成员（我方+敌人）
 * Get all battle members (party + troop)
 * 
 * @returns {Game_Battler[]} 战斗者数组 / Battler array
 */
BattleManager.allBattleMembers = function() {
    return $gameParty.members().concat($gameTroop.members());
};

/**
 * 制作行动次序
 * Make action orders
 */
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

/**
 * 开始行动
 * Start action
 */
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

/**
 * 更新行动
 * Update action
 */
BattleManager.updateAction = function() {
    var target = this._targets.shift();
    if (target) {
        this.invokeAction(this._subject, target);
    } else {
        this.endAction();
    }
};

/**
 * 结束行动
 * End action
 */
BattleManager.endAction = function() {
    this._logWindow.endAction(this._subject);
    this._phase = 'turn';
};

/**
 * 调用行动
 * Invoke action
 * 
 * @param {Game_Battler} subject - 行动主体 / Action subject
 * @param {Game_Battler} target - 目标 / Target
 */
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

/**
 * 调用普通行动
 * Invoke normal action
 * 
 * @param {Game_Battler} subject - 行动主体 / Action subject
 * @param {Game_Battler} target - 目标 / Target
 */
BattleManager.invokeNormalAction = function(subject, target) {
    var realTarget = this.applySubstitute(target);
    this._action.apply(realTarget);
    this._logWindow.displayActionResults(subject, realTarget);
};

/**
 * 调用反击
 * Invoke counter attack
 * 
 * @param {Game_Battler} subject - 行动主体 / Action subject
 * @param {Game_Battler} target - 目标 / Target
 */
BattleManager.invokeCounterAttack = function(subject, target) {
    var action = new Game_Action(target);
    action.setAttack();
    action.apply(subject);
    this._logWindow.displayCounter(target);
    this._logWindow.displayActionResults(target, subject);
};

/**
 * 调用魔法反射
 * Invoke magic reflection
 * 
 * @param {Game_Battler} subject - 行动主体 / Action subject
 * @param {Game_Battler} target - 目标 / Target
 */
BattleManager.invokeMagicReflection = function(subject, target) {
	this._action._reflectionTarget = target;
    this._logWindow.displayReflection(target);
    this._action.apply(subject);
    this._logWindow.displayActionResults(target, subject);
};

/**
 * 应用掩护
 * Apply substitute
 * 
 * @param {Game_Battler} target - 目标 / Target
 * @returns {Game_Battler} 实际目标 / Real target
 */
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

/**
 * 检测掩护
 * Check substitute
 * 
 * @param {Game_Battler} target - 目标 / Target
 * @returns {boolean} 是否可掩护 / Whether can substitute
 */
BattleManager.checkSubstitute = function(target) {
    return target.isDying() && !this._action.isCertainHit();
};

/**
 * 是否强制行动
 * Check if action forced
 * 
 * @returns {boolean} 是否强制行动 / Whether action forced
 */
BattleManager.isActionForced = function() {
    return !!this._actionForcedBattler;
};

/**
 * 强制行动
 * Force action
 * 
 * @param {Game_Battler} battler - 战斗者 / Battler
 */
BattleManager.forceAction = function(battler) {
    this._actionForcedBattler = battler;
    var index = this._actionBattlers.indexOf(battler);
    if (index >= 0) {
        this._actionBattlers.splice(index, 1);
    }
};

/**
 * 处理强制行动
 * Process forced action
 */
BattleManager.processForcedAction = function() {
    if (this._actionForcedBattler) {
        this._turnForced = true;
        this._subject = this._actionForcedBattler;
        this._actionForcedBattler = null;
        this.startAction();
        this._subject.removeCurrentAction();
    }
};

/**
 * 中止战斗
 * Abort battle
 */
BattleManager.abort = function() {
    this._phase = 'aborting';
};

/**
 * 检测战斗结束
 * Check battle end
 * 
 * @returns {boolean} 是否战斗结束 / Whether battle end
 */
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

/**
 * 检测中止
 * Check abort
 * 
 * @returns {boolean} 是否中止 / Whether abort
 */
BattleManager.checkAbort = function() {
    if ($gameParty.isEmpty() || this.isAborting()) {
        SoundManager.playEscape();
        this._escaped = true;
        this.processAbort();
    }
    return false;
};

/**
 * 处理胜利
 * Process victory
 */
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

/**
 * 处理逃跑
 * Process escape
 * 
 * @returns {boolean} 逃跑是否成功 / Whether escape success
 */
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

/**
 * 处理中止
 * Process abort
 */
BattleManager.processAbort = function() {
    $gameParty.removeBattleStates();
    this.replayBgmAndBgs();
    this.endBattle(1);
};

/**
 * 处理战败
 * Process defeat
 */
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

/**
 * 结束战斗
 * End battle
 * 
 * @param {number} result - 战斗结果 / Battle result
 */
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

/**
 * 更新战斗结束
 * Update battle end
 */
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

/**
 * 制作奖励
 * Make rewards
 */
BattleManager.makeRewards = function() {
    this._rewards = {};
    this._rewards.gold = $gameTroop.goldTotal();
    this._rewards.exp = $gameTroop.expTotal();
    this._rewards.items = $gameTroop.makeDropItems();
};

/**
 * 显示胜利信息
 * Display victory message
 */
BattleManager.displayVictoryMessage = function() {
    $gameMessage.add(TextManager.victory.format($gameParty.name()));
};

/**
 * 显示战败信息
 * Display defeat message
 */
BattleManager.displayDefeatMessage = function() {
    $gameMessage.add(TextManager.defeat.format($gameParty.name()));
};

/**
 * 显示逃跑成功信息
 * Display escape success message
 */
BattleManager.displayEscapeSuccessMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
};

/**
 * 显示逃跑失败信息
 * Display escape failure message
 */
BattleManager.displayEscapeFailureMessage = function() {
    $gameMessage.add(TextManager.escapeStart.format($gameParty.name()));
    $gameMessage.add('\\.' + TextManager.escapeFailure);
};

/**
 * 显示奖励
 * Display rewards
 */
BattleManager.displayRewards = function() {
    this.displayExp();
    this.displayGold();
    this.displayDropItems();
};

/**
 * 显示经验
 * Display experience
 */
BattleManager.displayExp = function() {
    var exp = this._rewards.exp;
    if (exp > 0) {
        var text = TextManager.obtainExp.format(exp, TextManager.exp);
        $gameMessage.add('\\.' + text);
    }
};

/**
 * 显示金币
 * Display gold
 */
BattleManager.displayGold = function() {
    var gold = this._rewards.gold;
    if (gold > 0) {
        $gameMessage.add('\\.' + TextManager.obtainGold.format(gold));
    }
};

/**
 * 显示掉落物品
 * Display drop items
 */
BattleManager.displayDropItems = function() {
    var items = this._rewards.items;
    if (items.length > 0) {
        $gameMessage.newPage();
        items.forEach(function(item) {
            $gameMessage.add(TextManager.obtainItem.format(item.name));
        });
    }
};

/**
 * 获得奖励
 * Gain rewards
 */
BattleManager.gainRewards = function() {
    this.gainExp();
    this.gainGold();
    this.gainDropItems();
};

/**
 * 获得经验
 * Gain experience
 */
BattleManager.gainExp = function() {
    var exp = this._rewards.exp;
    $gameParty.allMembers().forEach(function(actor) {
        actor.gainExp(exp);
    });
};

/**
 * 获得金币
 * Gain gold
 */
BattleManager.gainGold = function() {
    $gameParty.gainGold(this._rewards.gold);
};

/**
 * 获得掉落物品
 * Gain drop items
 */
BattleManager.gainDropItems = function() {
    var items = this._rewards.items;
    items.forEach(function(item) {
        $gameParty.gainItem(item, 1);
    });
};