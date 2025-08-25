//=============================================================================
// Window_BattleSkill.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_战斗技能 
// Window_BattleSkill
//
// 在战斗画面上的选择要使用的技能的窗口。 
// The window for selecting a skill to use on the battle screen.

function Window_BattleSkill() {
    this.initialize.apply(this, arguments);
}

Window_BattleSkill.prototype = Object.create(Window_SkillList.prototype);
Window_BattleSkill.prototype.constructor = Window_BattleSkill;

/* 初始化 */
Window_BattleSkill.prototype.initialize = function(x, y, width, height) {
    Window_SkillList.prototype.initialize.call(this, x, y, width, height);
    this.hide();
};

/* 显示 */
Window_BattleSkill.prototype.show = function() {
    this.selectLast();
    this.showHelpWindow();
    Window_SkillList.prototype.show.call(this);
};

/* 隐藏 */
Window_BattleSkill.prototype.hide = function() {
    this.hideHelpWindow();
    Window_SkillList.prototype.hide.call(this);
};
