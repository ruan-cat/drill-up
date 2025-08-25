//=============================================================================
// 场景_读档
// Scene_Load
//
// 读档画面的场景类。
// The scene class of the load screen.

function Scene_Load() {
	this.initialize.apply(this, arguments);
}

Scene_Load.prototype = Object.create(Scene_File.prototype);
Scene_Load.prototype.constructor = Scene_Load;

/* 初始化 */
Scene_Load.prototype.initialize = function () {
	Scene_File.prototype.initialize.call(this);
	this._loadSuccess = false;
};

/* 结束 */
Scene_Load.prototype.terminate = function () {
	Scene_File.prototype.terminate.call(this);
	if (this._loadSuccess) {
		$gameSystem.onAfterLoad();
	}
};

/* 模式 */
Scene_Load.prototype.mode = function () {
	return "load";
};

/* 帮助窗口文本 */
Scene_Load.prototype.helpWindowText = function () {
	return TextManager.loadMessage;
};

/* 第一个存档索引 */
Scene_Load.prototype.firstSavefileIndex = function () {
	return DataManager.latestSavefileId() - 1;
};

/* 当存档确定 */
Scene_Load.prototype.onSavefileOk = function () {
	Scene_File.prototype.onSavefileOk.call(this);
	if (DataManager.loadGame(this.savefileId())) {
		this.onLoadSuccess();
	} else {
		this.onLoadFailure();
	}
};

/* 当加载成功 */
Scene_Load.prototype.onLoadSuccess = function () {
	SoundManager.playLoad();
	this.fadeOutAll();
	this.reloadMapIfUpdated();
	SceneManager.goto(Scene_Map);
	this._loadSuccess = true;
};

/* 当加载失败 */
Scene_Load.prototype.onLoadFailure = function () {
	SoundManager.playBuzzer();
	this.activateListWindow();
};

/* 如果更新则重载地图 */
Scene_Load.prototype.reloadMapIfUpdated = function () {
	if ($gameSystem.versionId() !== $dataSystem.versionId) {
		$gamePlayer.reserveTransfer($gameMap.mapId(), $gamePlayer.x, $gamePlayer.y);
		$gamePlayer.requestMapReload();
	}
};

//-----------------------------------------------------------------------------
// 场景_游戏结束
