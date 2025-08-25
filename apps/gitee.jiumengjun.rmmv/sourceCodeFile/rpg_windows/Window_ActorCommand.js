//=============================================================================
// Window_ActorCommand.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_角色指令
// Window_ActorCommand
//
// 在战斗画面上的选择角色行动的窗口。
// The window for selecting an actor's action on the battle screen.

function Window_ActorCommand() {
	this.initialize.apply(this, arguments);
}

Window_ActorCommand.prototype = Object.create(Window_Command.prototype);
Window_ActorCommand.prototype.constructor = Window_ActorCommand;

/* 初始化 */
Window_ActorCommand.prototype.initialize = function () {
	var y = Graphics.boxHeight - this.windowHeight();
	Window_Command.prototype.initialize.call(this, 0, y);
	this.openness = 0;
	this.deactivate();
	this._actor = null;
};

/* 窗口宽度 */
Window_ActorCommand.prototype.windowWidth = function () {
	return 192;
};

/* 可见的行数 */
Window_ActorCommand.prototype.numVisibleRows = function () {
	return 4;
};

/* 制作指令列表 */
Window_ActorCommand.prototype.makeCommandList = function () {
	if (this._actor) {
		this.addAttackCommand();
		this.addSkillCommands();
		this.addGuardCommand();
		this.addItemCommand();
	}
};

/* 增加攻击指令 */
Window_ActorCommand.prototype.addAttackCommand = function () {
	this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
};

/* 增加技能指令 */
Window_ActorCommand.prototype.addSkillCommands = function () {
	var skillTypes = this._actor.addedSkillTypes();
	skillTypes.sort(function (a, b) {
		return a - b;
	});
	skillTypes.forEach(function (stypeId) {
		var name = $dataSystem.skillTypes[stypeId];
		this.addCommand(name, "skill", true, stypeId);
	}, this);
};

/* 增加防御指令 */
Window_ActorCommand.prototype.addGuardCommand = function () {
	this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
};

/* 增加物品指令 */
Window_ActorCommand.prototype.addItemCommand = function () {
	this.addCommand(TextManager.item, "item");
};

/* 设置 */
Window_ActorCommand.prototype.setup = function (actor) {
	this._actor = actor;
	this.clearCommandList();
	this.makeCommandList();
	this.refresh();
	this.selectLast();
	this.activate();
	this.open();
};

/* 处理确定 */
Window_ActorCommand.prototype.processOk = function () {
	if (this._actor) {
		if (ConfigManager.commandRemember) {
			this._actor.setLastCommandSymbol(this.currentSymbol());
		} else {
			this._actor.setLastCommandSymbol("");
		}
	}
	Window_Command.prototype.processOk.call(this);
};

/* 选择上一个 */
Window_ActorCommand.prototype.selectLast = function () {
	this.select(0);
	if (this._actor && ConfigManager.commandRemember) {
		var symbol = this._actor.lastCommandSymbol();
		this.selectSymbol(symbol);
		if (symbol === "skill") {
			var skill = this._actor.lastBattleSkill();
			if (skill) {
				this.selectExt(skill.stypeId);
			}
		}
	}
};
