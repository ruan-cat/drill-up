//=============================================================================
// Sprite_Button.js
//=============================================================================

//-----------------------------------------------------------------------------
// 精灵_按钮
// Sprite_Button
//
// 显示按钮的精灵。
// The sprite for displaying a button.

function Sprite_Button() {
	this.initialize.apply(this, arguments);
}

Sprite_Button.prototype = Object.create(Sprite.prototype);
Sprite_Button.prototype.constructor = Sprite_Button;

/* 初始化 */
Sprite_Button.prototype.initialize = function () {
	Sprite.prototype.initialize.call(this);
	this._touching = false;
	this._coldFrame = null;
	this._hotFrame = null;
	this._clickHandler = null;
};

/* 更新 */
Sprite_Button.prototype.update = function () {
	Sprite.prototype.update.call(this);
	this.updateFrame();
	this.processTouch();
};

/* 更新帧 */
Sprite_Button.prototype.updateFrame = function () {
	var frame;
	if (this._touching) {
		frame = this._hotFrame;
	} else {
		frame = this._coldFrame;
	}
	if (frame) {
		this.setFrame(frame.x, frame.y, frame.width, frame.height);
	}
};

/* 设置冷帧
 * 按钮未按下时的显示区域。
 */
Sprite_Button.prototype.setColdFrame = function (x, y, width, height) {
	this._coldFrame = new Rectangle(x, y, width, height);
};

/* 设置热帧
 * 按钮按下时的显示区域。
 */
Sprite_Button.prototype.setHotFrame = function (x, y, width, height) {
	this._hotFrame = new Rectangle(x, y, width, height);
};

/* 设置点击处理者 */
Sprite_Button.prototype.setClickHandler = function (method) {
	this._clickHandler = method;
};

/* 呼叫点击处理者 */
Sprite_Button.prototype.callClickHandler = function () {
	if (this._clickHandler) {
		this._clickHandler();
	}
};

/* 处理触摸 */
Sprite_Button.prototype.processTouch = function () {
	if (this.isActive()) {
		if (TouchInput.isTriggered() && this.isButtonTouched()) {
			this._touching = true;
		}
		if (this._touching) {
			if (TouchInput.isReleased() || !this.isButtonTouched()) {
				this._touching = false;
				if (TouchInput.isReleased()) {
					this.callClickHandler();
				}
			}
		}
	} else {
		this._touching = false;
	}
};

/* 是否活动的 */
Sprite_Button.prototype.isActive = function () {
	var node = this;
	while (node) {
		if (!node.visible) {
			return false;
		}
		node = node.parent;
	}
	return true;
};

/* 是否按钮被触摸 */
Sprite_Button.prototype.isButtonTouched = function () {
	var x = this.canvasToLocalX(TouchInput.x);
	var y = this.canvasToLocalY(TouchInput.y);
	return x >= 0 && y >= 0 && x < this.width && y < this.height;
};

/* 画布 X 坐标转换到本地 X 坐标 */
Sprite_Button.prototype.canvasToLocalX = function (x) {
	var node = this;
	while (node) {
		x -= node.x;
		node = node.parent;
	}
	return x;
};

/* 画布 Y 坐标转换到本地 Y 坐标 */
Sprite_Button.prototype.canvasToLocalY = function (y) {
	var node = this;
	while (node) {
		y -= node.y;
		node = node.parent;
	}
	return y;
};
