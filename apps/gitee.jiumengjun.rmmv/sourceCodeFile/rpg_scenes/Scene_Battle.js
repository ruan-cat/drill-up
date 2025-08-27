/**
 * @fileoverview Scene_Battle - 战斗场景类
 * @description 战斗画面的场景类，处理战斗中的所有界面和交互
 * The scene class of the battle screen, handles all UI and interactions during battle
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * Scene_Battle - 战斗场景类
 *
 * 战斗画面的场景类。
 * 负责战斗中的用户界面、输入处理、窗口管理和战斗流程控制。
 *
 * The scene class of the battle screen.
 * Responsible for battle UI, input handling, window management and battle flow control.
 *
 * @class Scene_Battle
 * @extends Scene_Base
 */
function Scene_Battle() {
	this.initialize.apply(this, arguments);
}

Scene_Battle.prototype = Object.create(Scene_Base.prototype);
Scene_Battle.prototype.constructor = Scene_Battle;

/**
 * 初始化战斗场景
 * Initialize battle scene
 *
 * @memberof Scene_Battle
 * @method initialize
 */
Scene_Battle.prototype.initialize = function () {
	Scene_Base.prototype.initialize.call(this);
};

/**
 * 创建场景
 * Create scene
 *
 * @memberof Scene_Battle
 * @method create
 */
Scene_Battle.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createDisplayObjects();
};

/**
 * 开始场景
 * Start scene
 *
 * @memberof Scene_Battle
 * @method start
 */
Scene_Battle.prototype.start = function () {
	Scene_Base.prototype.start.call(this);
	this.startFadeIn(this.fadeSpeed(), false);
	BattleManager.playBattleBgm();
	BattleManager.startBattle();
};

/**
 * 更新场景
 * Update scene
 *
 * @memberof Scene_Battle
 * @method update
 */
Scene_Battle.prototype.update = function () {
	var active = this.isActive();
	$gameTimer.update(active);
	$gameScreen.update();
	this.updateStatusWindow();
	this.updateWindowPositions();
	if (active && !this.isBusy()) {
		this.updateBattleProcess();
	}
	Scene_Base.prototype.update.call(this);
};

/**
 * 更新战斗流程
 * Update battle process
 *
 * @memberof Scene_Battle
 * @method updateBattleProcess
 */
Scene_Battle.prototype.updateBattleProcess = function () {
	if (!this.isAnyInputWindowActive() || BattleManager.isAborting() || BattleManager.isBattleEnd()) {
		BattleManager.update();
		this.changeInputWindow();
	}
};

/**
 * 检查是否有任何输入窗口处于活动状态
 * Check if any input window is active
 *
 * @memberof Scene_Battle
 * @method isAnyInputWindowActive
 * @returns {Boolean} 是否有活动的输入窗口 - Whether any input window is active
 */
Scene_Battle.prototype.isAnyInputWindowActive = function () {
	return (
		this._partyCommandWindow.active ||
		this._actorCommandWindow.active ||
		this._skillWindow.active ||
		this._itemWindow.active ||
		this._actorWindow.active ||
		this._enemyWindow.active
	);
};

/**
 * 改变输入窗口
 * Change input window
 *
 * @memberof Scene_Battle
 * @method changeInputWindow
 */
Scene_Battle.prototype.changeInputWindow = function () {
	if (BattleManager.isInputting()) {
		if (BattleManager.actor()) {
			this.startActorCommandSelection();
		} else {
			this.startPartyCommandSelection();
		}
	} else {
		this.endCommandSelection();
	}
};

/**
 * 停止场景
 * Stop scene
 *
 * @memberof Scene_Battle
 * @method stop
 */
Scene_Battle.prototype.stop = function () {
	Scene_Base.prototype.stop.call(this);
	if (this.needsSlowFadeOut()) {
		this.startFadeOut(this.slowFadeSpeed(), false);
	} else {
		this.startFadeOut(this.fadeSpeed(), false);
	}
	this._statusWindow.close();
	this._partyCommandWindow.close();
	this._actorCommandWindow.close();
};

/**
 * 结束场景
 * Terminate scene
 *
 * @memberof Scene_Battle
 * @method terminate
 */
Scene_Battle.prototype.terminate = function () {
	Scene_Base.prototype.terminate.call(this);
	$gameParty.onBattleEnd();
	$gameTroop.onBattleEnd();
	AudioManager.stopMe();

	ImageManager.clearRequest();
};

/**
 * 检查是否需要缓慢淡出
 * Check if needs slow fade out
 *
 * @memberof Scene_Battle
 * @method needsSlowFadeOut
 * @returns {Boolean} 是否需要缓慢淡出 - Whether needs slow fade out
 */
Scene_Battle.prototype.needsSlowFadeOut = function () {
	return SceneManager.isNextScene(Scene_Title) || SceneManager.isNextScene(Scene_Gameover);
};

/**
 * 更新状态窗口
 * Update status window
 *
 * @memberof Scene_Battle
 * @method updateStatusWindow
 */
Scene_Battle.prototype.updateStatusWindow = function () {
	if ($gameMessage.isBusy()) {
		this._statusWindow.close();
		this._partyCommandWindow.close();
		this._actorCommandWindow.close();
	} else if (this.isActive() && !this._messageWindow.isClosing()) {
		this._statusWindow.open();
	}
};

/**
 * 更新窗口位置
 * Update window positions
 *
 * @memberof Scene_Battle
 * @method updateWindowPositions
 */
Scene_Battle.prototype.updateWindowPositions = function () {
	var statusX = 0;
	if (BattleManager.isInputting()) {
		statusX = this._partyCommandWindow.width;
	} else {
		statusX = this._partyCommandWindow.width / 2;
	}
	if (this._statusWindow.x < statusX) {
		this._statusWindow.x += 16;
		if (this._statusWindow.x > statusX) {
			this._statusWindow.x = statusX;
		}
	}
	if (this._statusWindow.x > statusX) {
		this._statusWindow.x -= 16;
		if (this._statusWindow.x < statusX) {
			this._statusWindow.x = statusX;
		}
	}
};

/**
 * 创建显示对象
 * Create display objects
 *
 * @memberof Scene_Battle
 * @method createDisplayObjects
 */
Scene_Battle.prototype.createDisplayObjects = function () {
	this.createSpriteset();
	this.createWindowLayer();
	this.createAllWindows();
	BattleManager.setLogWindow(this._logWindow);
	BattleManager.setStatusWindow(this._statusWindow);
	BattleManager.setSpriteset(this._spriteset);
	this._logWindow.setSpriteset(this._spriteset);
};

/**
 * 创建精灵组
 * Create spriteset
 *
 * @memberof Scene_Battle
 * @method createSpriteset
 */
Scene_Battle.prototype.createSpriteset = function () {
	this._spriteset = new Spriteset_Battle();
	this.addChild(this._spriteset);
};

/**
 * 创建所有窗口
 * Create all windows
 *
 * @memberof Scene_Battle
 * @method createAllWindows
 */
Scene_Battle.prototype.createAllWindows = function () {
	this.createLogWindow();
	this.createStatusWindow();
	this.createPartyCommandWindow();
	this.createActorCommandWindow();
	this.createHelpWindow();
	this.createSkillWindow();
	this.createItemWindow();
	this.createActorWindow();
	this.createEnemyWindow();
	this.createMessageWindow();
	this.createScrollTextWindow();
};

/**
 * 创建日志窗口
 * Create log window
 *
 * @memberof Scene_Battle
 * @method createLogWindow
 */
Scene_Battle.prototype.createLogWindow = function () {
	this._logWindow = new Window_BattleLog();
	this.addWindow(this._logWindow);
};

/**
 * 创建状态窗口
 * Create status window
 *
 * @memberof Scene_Battle
 * @method createStatusWindow
 */
Scene_Battle.prototype.createStatusWindow = function () {
	this._statusWindow = new Window_BattleStatus();
	this.addWindow(this._statusWindow);
};

/**
 * 创建队伍指令窗口
 * Create party command window
 *
 * @memberof Scene_Battle
 * @method createPartyCommandWindow
 */
Scene_Battle.prototype.createPartyCommandWindow = function () {
	this._partyCommandWindow = new Window_PartyCommand();
	this._partyCommandWindow.setHandler("fight", this.commandFight.bind(this));
	this._partyCommandWindow.setHandler("escape", this.commandEscape.bind(this));
	this._partyCommandWindow.deselect();
	this.addWindow(this._partyCommandWindow);
};

/**
 * 创建角色指令窗口
 * Create actor command window
 *
 * @memberof Scene_Battle
 * @method createActorCommandWindow
 */
Scene_Battle.prototype.createActorCommandWindow = function () {
	this._actorCommandWindow = new Window_ActorCommand();
	this._actorCommandWindow.setHandler("attack", this.commandAttack.bind(this));
	this._actorCommandWindow.setHandler("skill", this.commandSkill.bind(this));
	this._actorCommandWindow.setHandler("guard", this.commandGuard.bind(this));
	this._actorCommandWindow.setHandler("item", this.commandItem.bind(this));
	this._actorCommandWindow.setHandler("cancel", this.selectPreviousCommand.bind(this));
	this.addWindow(this._actorCommandWindow);
};

/**
 * 创建帮助窗口
 * Create help window
 *
 * @memberof Scene_Battle
 * @method createHelpWindow
 */
Scene_Battle.prototype.createHelpWindow = function () {
	this._helpWindow = new Window_Help();
	this._helpWindow.visible = false;
	this.addWindow(this._helpWindow);
};

/**
 * 创建技能窗口
 * Create skill window
 *
 * @memberof Scene_Battle
 * @method createSkillWindow
 */
Scene_Battle.prototype.createSkillWindow = function () {
	var wy = this._helpWindow.y + this._helpWindow.height;
	var wh = this._statusWindow.y - wy;
	this._skillWindow = new Window_BattleSkill(0, wy, Graphics.boxWidth, wh);
	this._skillWindow.setHelpWindow(this._helpWindow);
	this._skillWindow.setHandler("ok", this.onSkillOk.bind(this));
	this._skillWindow.setHandler("cancel", this.onSkillCancel.bind(this));
	this.addWindow(this._skillWindow);
};

/**
 * 创建物品窗口
 * Create item window
 *
 * @memberof Scene_Battle
 * @method createItemWindow
 */
Scene_Battle.prototype.createItemWindow = function () {
	var wy = this._helpWindow.y + this._helpWindow.height;
	var wh = this._statusWindow.y - wy;
	this._itemWindow = new Window_BattleItem(0, wy, Graphics.boxWidth, wh);
	this._itemWindow.setHelpWindow(this._helpWindow);
	this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
	this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
	this.addWindow(this._itemWindow);
};

/**
 * 创建角色窗口
 * Create actor window
 *
 * @memberof Scene_Battle
 * @method createActorWindow
 */
Scene_Battle.prototype.createActorWindow = function () {
	this._actorWindow = new Window_BattleActor(0, this._statusWindow.y);
	this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
	this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
	this.addWindow(this._actorWindow);
};

/**
 * 创建敌人窗口
 * Create enemy window
 *
 * @memberof Scene_Battle
 * @method createEnemyWindow
 */
Scene_Battle.prototype.createEnemyWindow = function () {
	this._enemyWindow = new Window_BattleEnemy(0, this._statusWindow.y);
	this._enemyWindow.x = Graphics.boxWidth - this._enemyWindow.width;
	this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
	this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
	this.addWindow(this._enemyWindow);
};

/**
 * 创建信息窗口
 * Create message window
 *
 * @memberof Scene_Battle
 * @method createMessageWindow
 */
Scene_Battle.prototype.createMessageWindow = function () {
	this._messageWindow = new Window_Message();
	this.addWindow(this._messageWindow);
	this._messageWindow.subWindows().forEach(function (window) {
		this.addWindow(window);
	}, this);
};

/**
 * 创建滚动文本窗口
 * Create scroll text window
 *
 * @memberof Scene_Battle
 * @method createScrollTextWindow
 */
Scene_Battle.prototype.createScrollTextWindow = function () {
	this._scrollTextWindow = new Window_ScrollText();
	this.addWindow(this._scrollTextWindow);
};

/**
 * 刷新状态
 * Refresh status
 *
 * @memberof Scene_Battle
 * @method refreshStatus
 */
Scene_Battle.prototype.refreshStatus = function () {
	this._statusWindow.refresh();
};

/**
 * 开始队伍指令选择
 * Start party command selection
 *
 * @memberof Scene_Battle
 * @method startPartyCommandSelection
 */
Scene_Battle.prototype.startPartyCommandSelection = function () {
	this.refreshStatus();
	this._statusWindow.deselect();
	this._statusWindow.open();
	this._actorCommandWindow.close();
	this._partyCommandWindow.setup();
};

/**
 * 战斗指令
 * Fight command
 *
 * @memberof Scene_Battle
 * @method commandFight
 */
Scene_Battle.prototype.commandFight = function () {
	this.selectNextCommand();
};

/**
 * 逃跑指令
 * Escape command
 *
 * @memberof Scene_Battle
 * @method commandEscape
 */
Scene_Battle.prototype.commandEscape = function () {
	BattleManager.processEscape();
	this.changeInputWindow();
};

/**
 * 开始角色指令选择
 * Start actor command selection
 *
 * @memberof Scene_Battle
 * @method startActorCommandSelection
 */
Scene_Battle.prototype.startActorCommandSelection = function () {
	this._statusWindow.select(BattleManager.actor().index());
	this._partyCommandWindow.close();
	this._actorCommandWindow.setup(BattleManager.actor());
};

/**
 * 攻击指令
 * Attack command
 *
 * @memberof Scene_Battle
 * @method commandAttack
 */
Scene_Battle.prototype.commandAttack = function () {
	BattleManager.inputtingAction().setAttack();
	this.selectEnemySelection();
};

/**
 * 技能指令
 * Skill command
 *
 * @memberof Scene_Battle
 * @method commandSkill
 */
Scene_Battle.prototype.commandSkill = function () {
	this._skillWindow.setActor(BattleManager.actor());
	this._skillWindow.setStypeId(this._actorCommandWindow.currentExt());
	this._skillWindow.refresh();
	this._skillWindow.show();
	this._skillWindow.activate();
};

/**
 * 防御指令
 * Guard command
 *
 * @memberof Scene_Battle
 * @method commandGuard
 */
Scene_Battle.prototype.commandGuard = function () {
	BattleManager.inputtingAction().setGuard();
	this.selectNextCommand();
};

/**
 * 物品指令
 * Item command
 *
 * @memberof Scene_Battle
 * @method commandItem
 */
Scene_Battle.prototype.commandItem = function () {
	this._itemWindow.refresh();
	this._itemWindow.show();
	this._itemWindow.activate();
};

/**
 * 选择下一个指令
 * Select next command
 *
 * @memberof Scene_Battle
 * @method selectNextCommand
 */
Scene_Battle.prototype.selectNextCommand = function () {
	BattleManager.selectNextCommand();
	this.changeInputWindow();
};

/**
 * 选择上一个指令
 * Select previous command
 *
 * @memberof Scene_Battle
 * @method selectPreviousCommand
 */
Scene_Battle.prototype.selectPreviousCommand = function () {
	BattleManager.selectPreviousCommand();
	this.changeInputWindow();
};

/**
 * 选择角色
 * Select actor selection
 *
 * @memberof Scene_Battle
 * @method selectActorSelection
 */
Scene_Battle.prototype.selectActorSelection = function () {
	this._actorWindow.refresh();
	this._actorWindow.show();
	this._actorWindow.activate();
};

/**
 * 当角色确定
 * On actor ok
 *
 * @memberof Scene_Battle
 * @method onActorOk
 */
Scene_Battle.prototype.onActorOk = function () {
	var action = BattleManager.inputtingAction();
	action.setTarget(this._actorWindow.index());
	this._actorWindow.hide();
	this._skillWindow.hide();
	this._itemWindow.hide();
	this.selectNextCommand();
};

/**
 * 当角色取消
 * On actor cancel
 *
 * @memberof Scene_Battle
 * @method onActorCancel
 */
Scene_Battle.prototype.onActorCancel = function () {
	this._actorWindow.hide();
	switch (this._actorCommandWindow.currentSymbol()) {
		case "skill":
			this._skillWindow.show();
			this._skillWindow.activate();
			break;
		case "item":
			this._itemWindow.show();
			this._itemWindow.activate();
			break;
	}
};

/**
 * 选择敌人
 * Select enemy selection
 *
 * @memberof Scene_Battle
 * @method selectEnemySelection
 */
Scene_Battle.prototype.selectEnemySelection = function () {
	this._enemyWindow.refresh();
	this._enemyWindow.show();
	this._enemyWindow.select(0);
	this._enemyWindow.activate();
};

/**
 * 当敌人确定
 * On enemy ok
 *
 * @memberof Scene_Battle
 * @method onEnemyOk
 */
Scene_Battle.prototype.onEnemyOk = function () {
	var action = BattleManager.inputtingAction();
	action.setTarget(this._enemyWindow.enemyIndex());
	this._enemyWindow.hide();
	this._skillWindow.hide();
	this._itemWindow.hide();
	this.selectNextCommand();
};

/**
 * 当敌人取消
 * On enemy cancel
 *
 * @memberof Scene_Battle
 * @method onEnemyCancel
 */
Scene_Battle.prototype.onEnemyCancel = function () {
	this._enemyWindow.hide();
	switch (this._actorCommandWindow.currentSymbol()) {
		case "attack":
			this._actorCommandWindow.activate();
			break;
		case "skill":
			this._skillWindow.show();
			this._skillWindow.activate();
			break;
		case "item":
			this._itemWindow.show();
			this._itemWindow.activate();
			break;
	}
};

/**
 * 当技能确定
 * On skill ok
 *
 * @memberof Scene_Battle
 * @method onSkillOk
 */
Scene_Battle.prototype.onSkillOk = function () {
	var skill = this._skillWindow.item();
	var action = BattleManager.inputtingAction();
	action.setSkill(skill.id);
	BattleManager.actor().setLastBattleSkill(skill);
	this.onSelectAction();
};

/**
 * 当技能取消
 * On skill cancel
 *
 * @memberof Scene_Battle
 * @method onSkillCancel
 */
Scene_Battle.prototype.onSkillCancel = function () {
	this._skillWindow.hide();
	this._actorCommandWindow.activate();
};

/**
 * 当物品确定
 * On item ok
 *
 * @memberof Scene_Battle
 * @method onItemOk
 */
Scene_Battle.prototype.onItemOk = function () {
	var item = this._itemWindow.item();
	var action = BattleManager.inputtingAction();
	action.setItem(item.id);
	$gameParty.setLastItem(item);
	this.onSelectAction();
};

/**
 * 当物品取消
 * On item cancel
 *
 * @memberof Scene_Battle
 * @method onItemCancel
 */
Scene_Battle.prototype.onItemCancel = function () {
	this._itemWindow.hide();
	this._actorCommandWindow.activate();
};

/**
 * 当选择行动
 * On select action
 *
 * @memberof Scene_Battle
 * @method onSelectAction
 */
Scene_Battle.prototype.onSelectAction = function () {
	var action = BattleManager.inputtingAction();
	this._skillWindow.hide();
	this._itemWindow.hide();
	if (!action.needsSelection()) {
		this.selectNextCommand();
	} else if (action.isForOpponent()) {
		this.selectEnemySelection();
	} else {
		this.selectActorSelection();
	}
};

/**
 * 结束指令选择
 * End command selection
 *
 * @memberof Scene_Battle
 * @method endCommandSelection
 */
Scene_Battle.prototype.endCommandSelection = function () {
	this._partyCommandWindow.close();
	this._actorCommandWindow.close();
	this._statusWindow.deselect();
};

//-----------------------------------------------------------------------------
// 场景_游戏结束
