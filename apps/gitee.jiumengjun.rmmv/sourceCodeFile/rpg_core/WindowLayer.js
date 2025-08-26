//=============================================================================
// WindowLayer.js
//=============================================================================

/**
 * 包含游戏窗口的层。
 * The layer which contains game windows.
 *
 * @class WindowLayer
 * @extends PIXI.Container
 */
function WindowLayer() {
	this.initialize.apply(this, arguments);
}

WindowLayer.prototype = Object.create(PIXI.Container.prototype);
WindowLayer.prototype.constructor = WindowLayer;

WindowLayer.prototype.initialize = function () {
	PIXI.Container.call(this);
	this._width = 0;
	this._height = 0;
	this._tempCanvas = null;
	this._translationMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];

	this._windowMask = new PIXI.Graphics();
	this._windowMask.beginFill(0xffffff, 1);
	this._windowMask.drawRect(0, 0, 0, 0);
	this._windowMask.endFill();
	this._windowRect = this._windowMask.graphicsData[0].shape;

	this._renderSprite = null;
	this.filterArea = new PIXI.Rectangle();
	this.filters = [WindowLayer.voidFilter];

	//temporary fix for memory leak bug
	this.on("removed", this.onRemoveAsAChild);
};

WindowLayer.prototype.onRemoveAsAChild = function () {
	this.removeChildren();
};

WindowLayer.voidFilter = new PIXI.filters.VoidFilter();

/**
 * 窗口层的宽度（像素）。
 * The width of the window layer in pixels.
 *
 * @type {Number}
 */
Object.defineProperty(WindowLayer.prototype, "width", {
	get: function () {
		return this._width;
	},
	set: function (value) {
		this._width = value;
	},
	configurable: true,
});

/**
 * 窗口层的高度（像素）。
 * The height of the window layer in pixels.
 *
 * @type {Number}
 */
Object.defineProperty(WindowLayer.prototype, "height", {
	get: function () {
		return this._height;
	},
	set: function (value) {
		this._height = value;
	},
	configurable: true,
});

/**
 * 同时设置 x、y、宽度和高度。
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x 窗口层的x坐标 The x coordinate of the window layer
 * @param {Number} y 窗口层的y坐标 The y coordinate of the window layer
 * @param {Number} width 窗口层的宽度 The width of the window layer
 * @param {Number} height 窗口层的高度 The height of the window layer
 */
WindowLayer.prototype.move = function (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

/**
 * 每帧更新窗口层。
 * Updates the window layer for each frame.
 *
 * @method update
 */
WindowLayer.prototype.update = function () {
	this.children.forEach(function (child) {
		if (child.update) {
			child.update();
		}
	});
};

/**
 * Canvas渲染。
 * Renders with Canvas.
 *
 * @method renderCanvas
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
WindowLayer.prototype.renderCanvas = function (renderer) {
	if (!this.visible || !this.renderable) {
		return;
	}

	if (!this._tempCanvas) {
		this._tempCanvas = document.createElement("canvas");
	}

	this._tempCanvas.width = Graphics.width;
	this._tempCanvas.height = Graphics.height;

	var realCanvasContext = renderer.context;
	var context = this._tempCanvas.getContext("2d");

	context.save();
	context.clearRect(0, 0, Graphics.width, Graphics.height);
	context.beginPath();
	context.rect(this.x, this.y, this.width, this.height);
	context.closePath();
	context.clip();

	renderer.context = context;

	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if (child._isWindow && child.visible && child.openness > 0) {
			this._canvasClearWindowRect(renderer, child);
			context.save();
			child.renderCanvas(renderer);
			context.restore();
		}
	}

	context.restore();

	renderer.context = realCanvasContext;
	renderer.context.setTransform(1, 0, 0, 1, 0, 0);
	renderer.context.globalCompositeOperation = "source-over";
	renderer.context.globalAlpha = 1;
	renderer.context.drawImage(this._tempCanvas, 0, 0);

	for (var j = 0; j < this.children.length; j++) {
		if (!this.children[j]._isWindow) {
			this.children[j].renderCanvas(renderer);
		}
	}
};

/**
 * Canvas清除窗口矩形。
 * Clears window rectangle on Canvas.
 *
 * @method _canvasClearWindowRect
 * @param {Object} renderSession 渲染会话 The render session
 * @param {Window} window 窗口 The window
 * @private
 */
WindowLayer.prototype._canvasClearWindowRect = function (renderSession, window) {
	var rx = this.x + window.x;
	var ry = this.y + window.y + (window.height / 2) * (1 - window._openness / 255);
	var rw = window.width;
	var rh = (window.height * window._openness) / 255;
	renderSession.context.clearRect(rx, ry, rw, rh);
};

/**
 * WebGL渲染。
 * Renders with WebGL.
 *
 * @method renderWebGL
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
WindowLayer.prototype.renderWebGL = function (renderer) {
	if (!this.visible || !this.renderable) {
		return;
	}

	if (this.children.length == 0) {
		return;
	}

	renderer.flush();
	this.filterArea.copy(this);
	renderer.filterManager.pushFilter(this, this.filters);
	renderer.currentRenderer.start();

	var shift = new PIXI.Point();
	var rt = renderer._activeRenderTarget;
	var projectionMatrix = rt.projectionMatrix;
	shift.x = Math.round(((projectionMatrix.tx + 1) / 2) * rt.sourceFrame.width);
	shift.y = Math.round(((projectionMatrix.ty + 1) / 2) * rt.sourceFrame.height);

	for (var i = 0; i < this.children.length; i++) {
		var child = this.children[i];
		if (child._isWindow && child.visible && child.openness > 0) {
			this._maskWindow(child, shift);
			renderer.maskManager.pushScissorMask(this, this._windowMask);
			renderer.clear();
			renderer.maskManager.popScissorMask();
			renderer.currentRenderer.start();
			child.renderWebGL(renderer);
			renderer.currentRenderer.flush();
		}
	}

	renderer.flush();
	renderer.filterManager.popFilter();
	renderer.maskManager.popScissorMask();

	for (var j = 0; j < this.children.length; j++) {
		if (!this.children[j]._isWindow) {
			this.children[j].renderWebGL(renderer);
		}
	}
};

/**
 * 窗口遮罩。
 * Masks the window.
 *
 * @method _maskWindow
 * @param {Window} window 窗口 The window
 * @param {PIXI.Point} shift 偏移 The shift
 * @private
 */
WindowLayer.prototype._maskWindow = function (window, shift) {
	this._windowMask._currentBounds = null;
	this._windowMask.boundsDirty = true;
	var rect = this._windowRect;
	rect.x = this.x + shift.x + window.x;
	rect.y = this.x + shift.y + window.y + (window.height / 2) * (1 - window._openness / 255);
	rect.width = window.width;
	rect.height = (window.height * window._openness) / 255;
};

// The important members from Pixi.js

/**
 * 窗口层的x坐标。
 * The x coordinate of the window layer.
 *
 * @type {Number}
 */

/**
 * 窗口层的y坐标。
 * The y coordinate of the window layer.
 *
 * @type {Number}
 */

/**
 * [只读] 窗口层的子对象数组。
 * [read-only] The array of children of the window layer.
 *
 * @type {Array}
 */

/**
 * [只读] 包含窗口层的对象。
 * [read-only] The object that contains the window layer.
 *
 * @type {Object}
 */

/**
 * 向容器中添加子对象。
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child 要添加的子对象 The child to add
 * @return {Object} 被添加的子对象 The child that was added
 */

/**
 * 在指定索引处向容器中添加子对象。
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child 要添加的子对象 The child to add
 * @param {Number} index 放置子对象的索引 The index to place the child in
 * @return {Object} 被添加的子对象 The child that was added
 */

/**
 * 从容器中移除子对象。
 * Removes a child from the container.
 *
 * @method removeChild
 * @param {Object} child 要移除的子对象 The child to remove
 * @return {Object} 被移除的子对象 The child that was removed
 */

/**
 * 从指定索引位置移除子对象。
 * Removes a child from the specified index position.
 *
 * @method removeChildAt
 * @param {Number} index 获取子对象的索引 The index to get the child from
 * @return {Object} 被移除的子对象 The child that was removed
 */

//-----------------------------------------------------------------------------
