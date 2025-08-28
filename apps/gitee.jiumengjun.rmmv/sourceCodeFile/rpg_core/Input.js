//=============================================================================
// Input.js
//=============================================================================

/**
 * 处理键盘和手柄输入数据的静态类
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 * @classdesc 负责处理键盘和手柄输入数据的静态类
 */
function Input() {
	throw new Error("This is a static class");
}

/**
 * 初始化输入系统
 * Initializes the input system.
 *
 * @static
 * @method initialize
 */
Input.initialize = function () {
	this.clear();
	this._wrapNwjsAlert();
	this._setupEventHandlers();
};

/**
 * 按键重复的等待时间（帧数）
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
Input.keyRepeatWait = 24;

/**
 * 按键重复的间隔时间（帧数）
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
Input.keyRepeatInterval = 6;

/**
 * 将虚拟键码转换为映射键名的哈希表
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
	9: "tab", // tab
	13: "ok", // enter
	16: "shift", // shift
	17: "control", // control
	18: "control", // alt
	27: "escape", // escape
	32: "ok", // space
	33: "pageup", // pageup
	34: "pagedown", // pagedown
	37: "left", // left arrow
	38: "up", // up arrow
	39: "right", // right arrow
	40: "down", // down arrow
	45: "escape", // insert
	81: "pageup", // Q
	87: "pagedown", // W
	88: "escape", // X
	90: "ok", // Z
	96: "escape", // numpad 0
	98: "down", // numpad 2
	100: "left", // numpad 4
	102: "right", // numpad 6
	104: "up", // numpad 8
	120: "debug", // F9
};

/**
 * 将手柄按钮转换为映射键名的哈希表
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
	0: "ok", // A
	1: "cancel", // B
	2: "shift", // X
	3: "menu", // Y
	4: "pageup", // LB
	5: "pagedown", // RB
	12: "up", // D-pad up
	13: "down", // D-pad down
	14: "left", // D-pad left
	15: "right", // D-pad right
};

/**
 * 清除所有输入数据
 * Clears all the input data.
 *
 * @static
 * @method clear
 */
Input.clear = function () {
	this._currentState = {};
	this._previousState = {};
	this._gamepadStates = [];
	this._latestButton = null;
	this._pressedTime = 0;
	this._dir4 = 0;
	this._dir8 = 0;
	this._preferredAxis = "";
	this._date = 0;
};

/**
 * 更新输入数据
 * Updates the input data.
 *
 * @static
 * @method update
 */
Input.update = function () {
	this._pollGamepads();
	if (this._currentState[this._latestButton]) {
		this._pressedTime++;
	} else {
		this._latestButton = null;
	}
	for (var name in this._currentState) {
		if (this._currentState[name] && !this._previousState[name]) {
			this._latestButton = name;
			this._pressedTime = 0;
			this._date = Date.now();
		}
		this._previousState[name] = this._currentState[name];
	}
	this._updateDirection();
};

/**
 * 检查按键是否当前被按下
 * Checks whether a key is currently pressed down.
 *
 * @static
 * @method isPressed
 * @param {String} keyName - 按键的映射名称 / The mapped name of the key
 * @return {Boolean} 如果按键被按下则返回true / True if the key is pressed
 */
Input.isPressed = function (keyName) {
	if (this._isEscapeCompatible(keyName) && this.isPressed("escape")) {
		return true;
	} else {
		return !!this._currentState[keyName];
	}
};

/**
 * 检查按键是否刚刚被按下
 * Checks whether a key is just pressed.
 *
 * @static
 * @method isTriggered
 * @param {String} keyName - 按键的映射名称 / The mapped name of the key
 * @return {Boolean} 如果按键被触发则返回true / True if the key is triggered
 */
Input.isTriggered = function (keyName) {
	if (this._isEscapeCompatible(keyName) && this.isTriggered("escape")) {
		return true;
	} else {
		return this._latestButton === keyName && this._pressedTime === 0;
	}
};

/**
 * 检查按键是否刚刚被按下或发生了按键重复
 * Checks whether a key is just pressed or a key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @param {String} keyName - 按键的映射名称 / The mapped name of the key
 * @return {Boolean} 如果按键重复则返回true / True if the key is repeated
 */
Input.isRepeated = function (keyName) {
	if (this._isEscapeCompatible(keyName) && this.isRepeated("escape")) {
		return true;
	} else {
		return (
			this._latestButton === keyName &&
			(this._pressedTime === 0 ||
				(this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0))
		);
	}
};

/**
 * 检查按键是否被长按
 * Checks whether a key is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @param {String} keyName - 按键的映射名称 / The mapped name of the key
 * @return {Boolean} 如果按键被长按则返回true / True if the key is long-pressed
 */
Input.isLongPressed = function (keyName) {
	if (this._isEscapeCompatible(keyName) && this.isLongPressed("escape")) {
		return true;
	} else {
		return this._latestButton === keyName && this._pressedTime >= this.keyRepeatWait;
	}
};

/**
 * [只读] 四方向值，作为数字键盘的数字，中性时为0
 * [read-only] The four direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir4
 * @type Number
 */
Object.defineProperty(Input, "dir4", {
	get: function () {
		return this._dir4;
	},
	configurable: true,
});

/**
 * [只读] 八方向值，作为数字键盘的数字，中性时为0
 * [read-only] The eight direction value as a number of the numpad, or 0 for neutral.
 *
 * @static
 * @property dir8
 * @type Number
 */
Object.defineProperty(Input, "dir8", {
	get: function () {
		return this._dir8;
	},
	configurable: true,
});

/**
 * [只读] 最后一次输入的时间（毫秒）
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */
Object.defineProperty(Input, "date", {
	get: function () {
		return this._date;
	},
	configurable: true,
});

/**
 * 包装NW.js的警告框以确保窗口焦点
 * Wraps NW.js alert to ensure window focus.
 *
 * @static
 * @private
 * @method _wrapNwjsAlert
 */
Input._wrapNwjsAlert = function () {
	if (Utils.isNwjs()) {
		var _alert = window.alert;
		window.alert = function () {
			var gui = require("nw.gui");
			var win = gui.Window.get();
			_alert.apply(this, arguments);
			win.focus();
			Input.clear();
		};
	}
};

/**
 * 设置事件处理程序
 * Sets up event handlers.
 *
 * @static
 * @private
 * @method _setupEventHandlers
 */
Input._setupEventHandlers = function () {
	document.addEventListener("keydown", this._onKeyDown.bind(this));
	document.addEventListener("keyup", this._onKeyUp.bind(this));
	window.addEventListener("blur", this._onLostFocus.bind(this));
};

/**
 * 处理按键按下事件
 * Handles key down event.
 *
 * @static
 * @private
 * @method _onKeyDown
 * @param {KeyboardEvent} event - 键盘事件 / The keyboard event
 */
Input._onKeyDown = function (event) {
	if (this._shouldPreventDefault(event.keyCode)) {
		event.preventDefault();
	}
	if (event.keyCode === 144) {
		// Numlock
		this.clear();
	}
	var buttonName = this.keyMapper[event.keyCode];
	if (ResourceHandler.exists() && buttonName === "ok") {
		ResourceHandler.retry();
	} else if (buttonName) {
		this._currentState[buttonName] = true;
	}
};

/**
 * 检查是否应该阻止按键的默认行为
 * Checks whether the default behavior of the key should be prevented.
 *
 * @static
 * @private
 * @method _shouldPreventDefault
 * @param {Number} keyCode - 按键码 / The key code
 * @return {Boolean} 如果应该阻止默认行为则返回true / True if default behavior should be prevented
 */
Input._shouldPreventDefault = function (keyCode) {
	switch (keyCode) {
		case 8: // backspace
		case 33: // pageup
		case 34: // pagedown
		case 37: // left arrow
		case 38: // up arrow
		case 39: // right arrow
		case 40: // down arrow
			return true;
	}
	return false;
};

/**
 * 处理按键释放事件
 * Handles key up event.
 *
 * @static
 * @private
 * @method _onKeyUp
 * @param {KeyboardEvent} event - 键盘事件 / The keyboard event
 */
Input._onKeyUp = function (event) {
	var buttonName = this.keyMapper[event.keyCode];
	if (buttonName) {
		this._currentState[buttonName] = false;
	}
	if (event.keyCode === 0) {
		// For QtWebEngine on OS X
		this.clear();
	}
};

/**
 * 处理窗口失去焦点事件
 * Handles lost focus event.
 *
 * @static
 * @private
 * @method _onLostFocus
 */
Input._onLostFocus = function () {
	this.clear();
};

/**
 * 轮询手柄状态
 * Polls gamepad states.
 *
 * @static
 * @private
 * @method _pollGamepads
 */
Input._pollGamepads = function () {
	if (navigator.getGamepads) {
		var gamepads = navigator.getGamepads();
		if (gamepads) {
			for (var i = 0; i < gamepads.length; i++) {
				var gamepad = gamepads[i];
				if (gamepad && gamepad.connected) {
					this._updateGamepadState(gamepad);
				}
			}
		}
	}
};

/**
 * 更新手柄状态
 * Updates gamepad state.
 *
 * @static
 * @private
 * @method _updateGamepadState
 * @param {Gamepad} gamepad - 手柄对象 / The gamepad object
 */
Input._updateGamepadState = function (gamepad) {
	var lastState = this._gamepadStates[gamepad.index] || [];
	var newState = [];
	var buttons = gamepad.buttons;
	var axes = gamepad.axes;
	var threshold = 0.5;
	newState[12] = false;
	newState[13] = false;
	newState[14] = false;
	newState[15] = false;
	for (var i = 0; i < buttons.length; i++) {
		newState[i] = buttons[i].pressed;
	}
	if (axes[1] < -threshold) {
		newState[12] = true; // up
	} else if (axes[1] > threshold) {
		newState[13] = true; // down
	}
	if (axes[0] < -threshold) {
		newState[14] = true; // left
	} else if (axes[0] > threshold) {
		newState[15] = true; // right
	}
	for (var j = 0; j < newState.length; j++) {
		if (newState[j] !== lastState[j]) {
			var buttonName = this.gamepadMapper[j];
			if (buttonName) {
				this._currentState[buttonName] = newState[j];
			}
		}
	}
	this._gamepadStates[gamepad.index] = newState;
};

/**
 * 更新方向状态
 * Updates direction state.
 *
 * @static
 * @private
 * @method _updateDirection
 */
Input._updateDirection = function () {
	var x = this._signX();
	var y = this._signY();

	this._dir8 = this._makeNumpadDirection(x, y);

	if (x !== 0 && y !== 0) {
		if (this._preferredAxis === "x") {
			y = 0;
		} else {
			x = 0;
		}
	} else if (x !== 0) {
		this._preferredAxis = "y";
	} else if (y !== 0) {
		this._preferredAxis = "x";
	}

	this._dir4 = this._makeNumpadDirection(x, y);
};

/**
 * 获取X轴方向符号
 * Gets the X-axis direction sign.
 *
 * @static
 * @private
 * @method _signX
 * @return {Number} X轴方向符号 / The X-axis direction sign
 */
Input._signX = function () {
	var x = 0;

	if (this.isPressed("left")) {
		x--;
	}
	if (this.isPressed("right")) {
		x++;
	}
	return x;
};

/**
 * 获取Y轴方向符号
 * Gets the Y-axis direction sign.
 *
 * @static
 * @private
 * @method _signY
 * @return {Number} Y轴方向符号 / The Y-axis direction sign
 */
Input._signY = function () {
	var y = 0;

	if (this.isPressed("up")) {
		y--;
	}
	if (this.isPressed("down")) {
		y++;
	}
	return y;
};

/**
 * 根据X和Y坐标创建数字键盘方向值
 * Creates numpad direction value from X and Y coordinates.
 *
 * @static
 * @private
 * @method _makeNumpadDirection
 * @param {Number} x - X坐标值 / The X coordinate value
 * @param {Number} y - Y坐标值 / The Y coordinate value
 * @return {Number} 数字键盘方向值 / The numpad direction value
 */
Input._makeNumpadDirection = function (x, y) {
	if (x !== 0 || y !== 0) {
		return 5 - y * 3 + x;
	}
	return 0;
};

/**
 * 检查按键是否与Escape键兼容
 * Checks whether the key is escape-compatible.
 *
 * @static
 * @private
 * @method _isEscapeCompatible
 * @param {String} keyName - 按键名称 / The key name
 * @return {Boolean} 如果与Escape键兼容则返回true / True if escape-compatible
 */
Input._isEscapeCompatible = function (keyName) {
	return keyName === "cancel" || keyName === "menu";
};

//-----------------------------------------------------------------------------
