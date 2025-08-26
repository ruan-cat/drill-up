//=============================================================================
// TouchInput.js
//=============================================================================

/**
 * 处理来自鼠标和触摸屏输入数据的静态类。
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @class TouchInput
 */
function TouchInput() {
	throw new Error("This is a static class");
}

/**
 * 初始化触摸系统。
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */
TouchInput.initialize = function () {
	this.clear();
	this._setupEventHandlers();
};

/**
 * 伪按键重复的等待时间（帧数）。
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @type {Number}
 */
TouchInput.keyRepeatWait = 24;

/**
 * 伪按键重复的间隔时间（帧数）。
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @type {Number}
 */
TouchInput.keyRepeatInterval = 6;

/**
 * 清除所有触摸数据。
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */
TouchInput.clear = function () {
	this._mousePressed = false;
	this._screenPressed = false;
	this._pressedTime = 0;
	this._events = {};
	this._events.triggered = false;
	this._events.cancelled = false;
	this._events.moved = false;
	this._events.released = false;
	this._events.wheelX = 0;
	this._events.wheelY = 0;
	this._triggered = false;
	this._cancelled = false;
	this._moved = false;
	this._released = false;
	this._wheelX = 0;
	this._wheelY = 0;
	this._x = 0;
	this._y = 0;
	this._date = 0;
};

/**
 * 更新触摸数据。
 * Updates the touch data.
 *
 * @static
 * @method update
 */
TouchInput.update = function () {
	this._triggered = this._events.triggered;
	this._cancelled = this._events.cancelled;
	this._moved = this._events.moved;
	this._released = this._events.released;
	this._wheelX = this._events.wheelX;
	this._wheelY = this._events.wheelY;
	this._events.triggered = false;
	this._events.cancelled = false;
	this._events.moved = false;
	this._events.released = false;
	this._events.wheelX = 0;
	this._events.wheelY = 0;
	if (this.isPressed()) {
		this._pressedTime++;
	}
};

/**
 * 检查鼠标按钮或触摸屏当前是否按下。
 * Checks whether the mouse button or touchscreen is currently pressed down.
 *
 * @static
 * @method isPressed
 * @return {Boolean} 如果鼠标按钮或触摸屏被按下则为true True if the mouse button or touchscreen is pressed
 */
TouchInput.isPressed = function () {
	return this._mousePressed || this._screenPressed;
};

/**
 * 检查左鼠标按钮或触摸屏是否刚刚被按下。
 * Checks whether the left mouse button or touchscreen is just pressed.
 *
 * @static
 * @method isTriggered
 * @return {Boolean} 如果鼠标按钮或触摸屏被触发则为true True if the mouse button or touchscreen is triggered
 */
TouchInput.isTriggered = function () {
	return this._triggered;
};

/**
 * 检查左鼠标按钮或触摸屏是否刚刚被按下或发生了伪按键重复。
 * Checks whether the left mouse button or touchscreen is just pressed or a pseudo key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @return {Boolean} 如果鼠标按钮或触摸屏重复则为true True if the mouse button or touchscreen is repeated
 */
TouchInput.isRepeated = function () {
	return (
		this.isPressed() &&
		(this._triggered || (this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0))
	);
};

/**
 * 检查左鼠标按钮或触摸屏是否保持被按下。
 * Checks whether the left mouse button or touchscreen is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @return {Boolean} 如果左鼠标按钮或触摸屏长按则为true True if the left mouse button or touchscreen is long-pressed
 */
TouchInput.isLongPressed = function () {
	return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
};

/**
 * 检查右鼠标按钮是否刚刚被按下。
 * Checks whether the right mouse button is just pressed.
 *
 * @static
 * @method isCancelled
 * @return {Boolean} 如果右鼠标按钮刚刚被按下则为true True if the right mouse button is just pressed
 */
TouchInput.isCancelled = function () {
	return this._cancelled;
};

/**
 * 检查鼠标或触摸屏上的手指是否移动。
 * Checks whether the mouse or a finger on the touchscreen is moved.
 *
 * @static
 * @method isMoved
 * @return {Boolean} 如果鼠标或触摸屏上的手指移动则为true True if the mouse or a finger on the touchscreen is moved
 */
TouchInput.isMoved = function () {
	return this._moved;
};

/**
 * 检查左鼠标按钮或触摸屏是否被释放。
 * Checks whether the left mouse button or touchscreen is released.
 *
 * @static
 * @method isReleased
 * @return {Boolean} 如果鼠标按钮或触摸屏被释放则为true True if the mouse button or touchscreen is released
 */
TouchInput.isReleased = function () {
	return this._released;
};

/**
 * [只读] 水平滚动量。
 * [read-only] The horizontal scroll amount.
 *
 * @static
 * @type {Number}
 */
Object.defineProperty(TouchInput, "wheelX", {
	get: function () {
		return this._wheelX;
	},
	configurable: true,
});

/**
 * [只读] 垂直滚动量。
 * [read-only] The vertical scroll amount.
 *
 * @static
 * @type {Number}
 */
Object.defineProperty(TouchInput, "wheelY", {
	get: function () {
		return this._wheelY;
	},
	configurable: true,
});

/**
 * [只读] 最新触摸事件在画布区域的x坐标。
 * [read-only] The x coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @type {Number}
 */
Object.defineProperty(TouchInput, "x", {
	get: function () {
		return this._x;
	},
	configurable: true,
});

/**
 * [只读] 最新触摸事件在画布区域的y坐标。
 * [read-only] The y coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @type {Number}
 */
Object.defineProperty(TouchInput, "y", {
	get: function () {
		return this._y;
	},
	configurable: true,
});

/**
 * [只读] 最后一次输入的时间（毫秒）。
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @type {Number}
 */
Object.defineProperty(TouchInput, "date", {
	get: function () {
		return this._date;
	},
	configurable: true,
});

/**
 * 设置事件处理程序。
 * Sets up event handlers.
 * 
 * @static
 * @method _setupEventHandlers
 * @private
 */
TouchInput._setupEventHandlers = function () {
	var isSupportPassive = Utils.isSupportPassiveEvent();
	document.addEventListener("mousedown", this._onMouseDown.bind(this));
	document.addEventListener("mousemove", this._onMouseMove.bind(this));
	document.addEventListener("mouseup", this._onMouseUp.bind(this));
	document.addEventListener("wheel", this._onWheel.bind(this));
	document.addEventListener("touchstart", this._onTouchStart.bind(this), isSupportPassive ? { passive: false } : false);
	document.addEventListener("touchmove", this._onTouchMove.bind(this), isSupportPassive ? { passive: false } : false);
	document.addEventListener("touchend", this._onTouchEnd.bind(this));
	document.addEventListener("touchcancel", this._onTouchCancel.bind(this));
	document.addEventListener("pointerdown", this._onPointerDown.bind(this));
};

/**
 * 鼠标按下事件处理。
 * Handles mouse down event.
 * 
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event 鼠标事件 The mouse event
 * @private
 */
TouchInput._onMouseDown = function (event) {
	if (event.button === 0) {
		this._onLeftButtonDown(event);
	} else if (event.button === 1) {
		this._onMiddleButtonDown(event);
	} else if (event.button === 2) {
		this._onRightButtonDown(event);
	}
};

/**
 * 左鼠标按钮按下事件处理。
 * Handles left mouse button down event.
 * 
 * @static
 * @method _onLeftButtonDown
 * @param {MouseEvent} event 鼠标事件 The mouse event
 * @private
 */
TouchInput._onLeftButtonDown = function (event) {
	var x = Graphics.pageToCanvasX(event.pageX);
	var y = Graphics.pageToCanvasY(event.pageY);
	if (Graphics.isInsideCanvas(x, y)) {
		this._mousePressed = true;
		this._pressedTime = 0;
		this._onTrigger(x, y);
	}
};

/**
 * 中鼠标按钮按下事件处理。
 * Handles middle mouse button down event.
 * 
 * @static
 * @method _onMiddleButtonDown
 * @param {MouseEvent} event 鼠标事件 The mouse event
 * @private
 */
TouchInput._onMiddleButtonDown = function (event) {};

/**
 * 右鼠标按钮按下事件处理。
 * Handles right mouse button down event.
 * 
 * @static
 * @method _onRightButtonDown
 * @param {MouseEvent} event 鼠标事件 The mouse event
 * @private
 */
TouchInput._onRightButtonDown = function (event) {
	var x = Graphics.pageToCanvasX(event.pageX);
	var y = Graphics.pageToCanvasY(event.pageY);
	if (Graphics.isInsideCanvas(x, y)) {
		this._onCancel(x, y);
	}
};

/**
 * 鼠标移动事件处理。
 * Handles mouse move event.
 * 
 * @static
 * @method _onMouseMove
 * @param {MouseEvent} event 鼠标事件 The mouse event
 * @private
 */
TouchInput._onMouseMove = function (event) {
	if (this._mousePressed) {
		var x = Graphics.pageToCanvasX(event.pageX);
		var y = Graphics.pageToCanvasY(event.pageY);
		this._onMove(x, y);
	}
};

/**
 * 鼠标释放事件处理。
 * Handles mouse up event.
 * 
 * @static
 * @method _onMouseUp
 * @param {MouseEvent} event 鼠标事件 The mouse event
 * @private
 */
TouchInput._onMouseUp = function (event) {
	if (event.button === 0) {
		var x = Graphics.pageToCanvasX(event.pageX);
		var y = Graphics.pageToCanvasY(event.pageY);
		this._mousePressed = false;
		this._onRelease(x, y);
	}
};

/**
 * 鼠标滚轮事件处理。
 * Handles mouse wheel event.
 * 
 * @static
 * @method _onWheel
 * @param {WheelEvent} event 滚轮事件 The wheel event
 * @private
 */
TouchInput._onWheel = function (event) {
	this._events.wheelX += event.deltaX;
	this._events.wheelY += event.deltaY;
	event.preventDefault();
};

/**
 * 触摸开始事件处理。
 * Handles touch start event.
 * 
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event 触摸事件 The touch event
 * @private
 */
TouchInput._onTouchStart = function (event) {
	for (var i = 0; i < event.changedTouches.length; i++) {
		var touch = event.changedTouches[i];
		var x = Graphics.pageToCanvasX(touch.pageX);
		var y = Graphics.pageToCanvasY(touch.pageY);
		if (Graphics.isInsideCanvas(x, y)) {
			this._screenPressed = true;
			this._pressedTime = 0;
			if (event.touches.length >= 2) {
				this._onCancel(x, y);
			} else {
				this._onTrigger(x, y);
			}
			event.preventDefault();
		}
	}
	if (window.cordova || window.navigator.standalone) {
		event.preventDefault();
	}
};

/**
 * 触摸移动事件处理。
 * Handles touch move event.
 * 
 * @static
 * @method _onTouchMove
 * @param {TouchEvent} event 触摸事件 The touch event
 * @private
 */
TouchInput._onTouchMove = function (event) {
	for (var i = 0; i < event.changedTouches.length; i++) {
		var touch = event.changedTouches[i];
		var x = Graphics.pageToCanvasX(touch.pageX);
		var y = Graphics.pageToCanvasY(touch.pageY);
		this._onMove(x, y);
	}
};

/**
 * 触摸结束事件处理。
 * Handles touch end event.
 * 
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event 触摸事件 The touch event
 * @private
 */
TouchInput._onTouchEnd = function (event) {
	for (var i = 0; i < event.changedTouches.length; i++) {
		var touch = event.changedTouches[i];
		var x = Graphics.pageToCanvasX(touch.pageX);
		var y = Graphics.pageToCanvasY(touch.pageY);
		this._screenPressed = false;
		this._onRelease(x, y);
	}
};

/**
 * 触摸取消事件处理。
 * Handles touch cancel event.
 * 
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event 触摸事件 The touch event
 * @private
 */
TouchInput._onTouchCancel = function (event) {
	this._screenPressed = false;
};

/**
 * 指针按下事件处理。
 * Handles pointer down event.
 * 
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event 指针事件 The pointer event
 * @private
 */
TouchInput._onPointerDown = function (event) {
	if (event.pointerType === "touch" && !event.isPrimary) {
		var x = Graphics.pageToCanvasX(event.pageX);
		var y = Graphics.pageToCanvasY(event.pageY);
		if (Graphics.isInsideCanvas(x, y)) {
			// For Microsoft Edge
			this._onCancel(x, y);
			event.preventDefault();
		}
	}
};

/**
 * 触发事件处理。
 * Handles trigger event.
 * 
 * @static
 * @method _onTrigger
 * @param {Number} x x坐标 The x coordinate
 * @param {Number} y y坐标 The y coordinate
 * @private
 */
TouchInput._onTrigger = function (x, y) {
	this._events.triggered = true;
	this._x = x;
	this._y = y;
	this._date = Date.now();
};

/**
 * 取消事件处理。
 * Handles cancel event.
 * 
 * @static
 * @method _onCancel
 * @param {Number} x x坐标 The x coordinate
 * @param {Number} y y坐标 The y coordinate
 * @private
 */
TouchInput._onCancel = function (x, y) {
	this._events.cancelled = true;
	this._x = x;
	this._y = y;
};

/**
 * 移动事件处理。
 * Handles move event.
 * 
 * @static
 * @method _onMove
 * @param {Number} x x坐标 The x coordinate
 * @param {Number} y y坐标 The y coordinate
 * @private
 */
TouchInput._onMove = function (x, y) {
	this._events.moved = true;
	this._x = x;
	this._y = y;
};

/**
 * @static
 * @method _onRelease
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onRelease = function (x, y) {
	this._events.released = true;
	this._x = x;
	this._y = y;
};

//-----------------------------------------------------------------------------
