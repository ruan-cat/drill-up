//=============================================================================
// 场景_标题
// Scene_Title
//
// 标题场景的场景类。
// The scene class of the title screen.

function Scene_Title() {
	this.initialize.apply(this, arguments);
}

Scene_Title.prototype = Object.create(Scene_Base.prototype);
Scene_Title.prototype.constructor = Scene_Title;

/* 初始化 */
Scene_Title.prototype.initialize = function () {
	Scene_Base.prototype.initialize.call(this);
};

/* 创建 */
Scene_Title.prototype.create = function () {
	Scene_Base.prototype.create.call(this);
	this.createBackground();
	this.createForeground();
	this.createWindowLayer();
	this.createCommandWindow();
};

/* 开始 */
Scene_Title.prototype.start = function () {
	Scene_Base.prototype.start.call(this);
	SceneManager.clearStack();
	this.centerSprite(this._backSprite1);
	this.centerSprite(this._backSprite2);
	this.playTitleMusic();
	this.startFadeIn(this.fadeSpeed(), false);
};

/* 更新 */
Scene_Title.prototype.update = function () {
	if (!this.isBusy()) {
		this._commandWindow.open();
	}
	Scene_Base.prototype.update.call(this);
};

/* 是否繁忙 */
Scene_Title.prototype.isBusy = function () {
	return this._commandWindow.isClosing() || Scene_Base.prototype.isBusy.call(this);
};

/* 结束 */
Scene_Title.prototype.terminate = function () {
	Scene_Base.prototype.terminate.call(this);
	SceneManager.snapForBackground();
};

/* 创建背景 */
Scene_Title.prototype.createBackground = function () {
	this._backSprite1 = new Sprite(ImageManager.loadTitle1($dataSystem.title1Name));
	this._backSprite2 = new Sprite(ImageManager.loadTitle2($dataSystem.title2Name));
	this.addChild(this._backSprite1);
	this.addChild(this._backSprite2);
};

/* 创建前景 */
Scene_Title.prototype.createForeground = function () {
	this._gameTitleSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
	this.addChild(this._gameTitleSprite);
	if ($dataSystem.optDrawTitle) {
		this.drawGameTitle();
	}
};

/* 绘制游戏标题 */
Scene_Title.prototype.drawGameTitle = function () {
	var x = 20;
	var y = Graphics.height / 4;
	var maxWidth = Graphics.width - x * 2;
	var text = $dataSystem.gameTitle;
	this._gameTitleSprite.bitmap.outlineColor = "black";
	this._gameTitleSprite.bitmap.outlineWidth = 8;
	this._gameTitleSprite.bitmap.fontSize = 72;
	this._gameTitleSprite.bitmap.drawText(text, x, y, maxWidth, 48, "center");
};

/* 中心精灵
 * 将精灵放置在画面中心。
 */
Scene_Title.prototype.centerSprite = function (sprite) {
	sprite.x = Graphics.width / 2;
	sprite.y = Graphics.height / 2;
	sprite.anchor.x = 0.5;
	sprite.anchor.y = 0.5;
};

/* 创建指令窗口 */
Scene_Title.prototype.createCommandWindow = function () {
	this._commandWindow = new Window_TitleCommand();
	this._commandWindow.setHandler("newGame", this.commandNewGame.bind(this));
	this._commandWindow.setHandler("continue", this.commandContinue.bind(this));
	this._commandWindow.setHandler("options", this.commandOptions.bind(this));
	this.addWindow(this._commandWindow);
};

/* 开始游戏的指令 */
Scene_Title.prototype.commandNewGame = function () {
	DataManager.setupNewGame();
	this._commandWindow.close();
	this.fadeOutAll();
	SceneManager.goto(Scene_Map);
};

/* 继续游戏的指令 */
Scene_Title.prototype.commandContinue = function () {
	this._commandWindow.close();
	SceneManager.push(Scene_Load);
};

/* 设置的指令 */
Scene_Title.prototype.commandOptions = function () {
	this._commandWindow.close();
	SceneManager.push(Scene_Options);
};

/* 播放标题音乐 */
Scene_Title.prototype.playTitleMusic = function () {
	AudioManager.playBgm($dataSystem.titleBgm);
	AudioManager.stopBgs();
	AudioManager.stopMe();
};
