//=============================================================================
// Window_PartyCommand.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_队伍指令 
// Window_PartyCommand
//
// 在战斗画面上的选择是战斗还是逃跑的窗口。 
// The window for selecting whether to fight or escape on the battle screen.

function Window_PartyCommand() {
    this.initialize.apply(this, arguments);
}

Window_PartyCommand.prototype = Object.create(Window_Command.prototype);
Window_PartyCommand.prototype.constructor = Window_PartyCommand;

/* 初始化 */
Window_PartyCommand.prototype.initialize = function() {
    var y = Graphics.boxHeight - this.windowHeight();
    Window_Command.prototype.initialize.call(this, 0, y);
    this.openness = 0;
    this.deactivate();
};

/* 窗口宽度 */
Window_PartyCommand.prototype.windowWidth = function() {
    return 192;
};

/* 可见的行数 */
Window_PartyCommand.prototype.numVisibleRows = function() {
    return 4;
};

/* 制作指令列表 */
Window_PartyCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.fight,  'fight');
    this.addCommand(TextManager.escape, 'escape', BattleManager.canEscape());
};

/* 设置 */
Window_PartyCommand.prototype.setup = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.select(0);
    this.activate();
    this.open();
};
