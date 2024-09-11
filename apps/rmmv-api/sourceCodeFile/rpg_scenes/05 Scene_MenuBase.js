/*
 * @Author: your name
 * @Date: 2022-01-03 22:09:41
 * @LastEditTime: 2022-04-23 11:06:29
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \RPGMV-project\sourceCodeFile\rpg_scenes\05 Scene_MenuBase.js
 */
//-----------------------------------------------------------------------------
// Scene_MenuBase
// 菜单基础场景
// The superclass of all the menu-type scenes.
// 所有 菜单种类 的 超级类

function Scene_MenuBase() {
  this.initialize.apply(this, arguments);
}

//设置原形
Scene_MenuBase.prototype = Object.create(Scene_Base.prototype);
//设置创造者
Scene_MenuBase.prototype.constructor = Scene_MenuBase;
//初始化
Scene_MenuBase.prototype.initialize = function () {
  Scene_Base.prototype.initialize.call(this);
};
//创建
Scene_MenuBase.prototype.create = function () {
  Scene_Base.prototype.create.call(this);
  this.createBackground();
  this.updateActor();
  this.createWindowLayer();
};
//角色
Scene_MenuBase.prototype.actor = function () {
  return this._actor;
};
//更新角色
Scene_MenuBase.prototype.updateActor = function () {
  this._actor = $gameParty.menuActor();
};

/**
 * @description
 * 创建背景
 *
 * 菜单场景的背景图其实是一个截图。
 */
Scene_MenuBase.prototype.createBackground = function () {
  this._backgroundSprite = new Sprite();
  this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
  this.addChild(this._backgroundSprite);
};
//设置背景不透明度
Scene_MenuBase.prototype.setBackgroundOpacity = function (opacity) {
  this._backgroundSprite.opacity = opacity;
};
//创建帮助窗口
Scene_MenuBase.prototype.createHelpWindow = function () {
  this._helpWindow = new Window_Help();
  this.addWindow(this._helpWindow);
};
//下一个角色
Scene_MenuBase.prototype.nextActor = function () {
  $gameParty.makeMenuActorNext();
  this.updateActor();
  this.onActorChange();
};
//之前的角色
Scene_MenuBase.prototype.previousActor = function () {
  $gameParty.makeMenuActorPrevious();
  this.updateActor();
  this.onActorChange();
};
//当角色改变
Scene_MenuBase.prototype.onActorChange = function () {};
