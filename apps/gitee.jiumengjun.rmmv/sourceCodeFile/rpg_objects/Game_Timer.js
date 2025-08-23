/**
 * @fileoverview Game_Timer - 游戏计时器对象类
 * @description 负责管理游戏中的计时器功能
 * @author 原作者未知
 * @since 1.0.0
 */

/**
 * 游戏_计时器
 * Game_Timer
 *
 * 计时器的游戏对象类。
 * The game object class for the timer.
 *
 * @class Game_Timer
 * @description 管理游戏中的计时器，可以设置倒计时并在时间到达时触发事件
 */
function Game_Timer() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化
 * Initialize the Game_Timer object
 *
 * @memberof Game_Timer
 * @description 初始化计时器对象的所有属性
 */
Game_Timer.prototype.initialize = function () {
	this._frames = 0; // 帧数 - Frame count
	this._working = false; // 是否工作中 - Working status
};

/**
 * 更新
 * Update the timer
 *
 * @memberof Game_Timer
 * @param {boolean} sceneActive - 场景是否活跃
 * @description 每帧更新计时器，如果时间到达则触发到期事件
 */
Game_Timer.prototype.update = function (sceneActive) {
	if (sceneActive && this._working && this._frames > 0) {
		this._frames--;
		if (this._frames === 0) {
			this.onExpire();
		}
	}
};

/**
 * 开始
 * Start the timer
 *
 * @memberof Game_Timer
 * @param {number} count - 倒计时帧数
 * @description 启动计时器并设置倒计时时间
 */
Game_Timer.prototype.start = function (count) {
	this._frames = count;
	this._working = true;
};

/**
 * 停止
 * Stop the timer
 *
 * @memberof Game_Timer
 * @description 停止计时器的运行
 */
Game_Timer.prototype.stop = function () {
	this._working = false;
};

/**
 * 是否工作中
 * Check if timer is working
 *
 * @memberof Game_Timer
 * @returns {boolean} 计时器是否正在运行
 */
Game_Timer.prototype.isWorking = function () {
	return this._working;
};

/**
 * 秒数
 * Get seconds remaining
 *
 * @memberof Game_Timer
 * @returns {number} 剩余秒数
 * @description 将剩余帧数转换为秒数（60帧=1秒）
 */
Game_Timer.prototype.seconds = function () {
	return Math.floor(this._frames / 60);
};

/**
 * 当到期
 * Called when timer expires
 *
 * @memberof Game_Timer
 * @description 计时器到期时调用，默认中止战斗
 */
Game_Timer.prototype.onExpire = function () {
	BattleManager.abort();
};
