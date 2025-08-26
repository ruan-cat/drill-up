//=============================================================================
// Sprite.js
//=============================================================================

/**
 * 渲染到游戏屏幕的基本对象。
 * The basic object that is rendered to the game screen.
 *
 * @class Sprite
 * @extends PIXI.Sprite
 * @param {Bitmap} bitmap 精灵的图像 The image for the sprite
 */
function Sprite() {
	this.initialize.apply(this, arguments);
}

Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

/**
 * 空滤镜实例。
 * Void filter instance.
 *
 * @static
 * @type {PIXI.filters.VoidFilter}
 */
Sprite.voidFilter = new PIXI.filters.VoidFilter();

/**
 * 初始化精灵。
 * Initializes the sprite.
 *
 * @method initialize
 * @param {Bitmap} bitmap 精灵的图像 The image for the sprite
 */
Sprite.prototype.initialize = function (bitmap) {
	var texture = new PIXI.Texture(new PIXI.BaseTexture());

	PIXI.Sprite.call(this, texture);

	this._bitmap = null;
	this._frame = new Rectangle();
	this._realFrame = new Rectangle();
	this._blendColor = [0, 0, 0, 0];
	this._colorTone = [0, 0, 0, 0];
	this._canvas = null;
	this._context = null;
	this._tintTexture = null;

	/**
	 * 使用重量渲染器，减少边界伪影并应用高级混合模式。
	 * Use heavy renderer that will reduce border artifacts and apply advanced blendModes.
	 * @type {boolean}
	 * @private
	 */
	this._isPicture = false;

	this.spriteId = Sprite._counter++;
	this.opaque = false;

	this.bitmap = bitmap;
};

/**
 * 已创建对象的数量。
 * Number of the created objects.
 *
 * @static
 * @type {Number}
 * @private
 */
Sprite._counter = 0;

/**
 * 精灵的图像。
 * The image for the sprite.
 *
 * @type {Bitmap}
 */
Object.defineProperty(Sprite.prototype, "bitmap", {
	get: function () {
		return this._bitmap;
	},
	set: function (value) {
		if (this._bitmap !== value) {
			this._bitmap = value;

			if (value) {
				this._refreshFrame = true;
				value.addLoadListener(this._onBitmapLoad.bind(this));
			} else {
				this._refreshFrame = false;
				this.texture.frame = Rectangle.emptyRectangle;
			}
		}
	},
	configurable: true,
});

/**
 * 精灵不含缩放的宽度。
 * The width of the sprite without the scale.
 *
 * @type {Number}
 */
Object.defineProperty(Sprite.prototype, "width", {
	get: function () {
		return this._frame.width;
	},
	set: function (value) {
		this._frame.width = value;
		this._refresh();
	},
	configurable: true,
});

/**
 * 精灵不含缩放的高度。
 * The height of the sprite without the scale.
 *
 * @type {Number}
 */
Object.defineProperty(Sprite.prototype, "height", {
	get: function () {
		return this._frame.height;
	},
	set: function (value) {
		this._frame.height = value;
		this._refresh();
	},
	configurable: true,
});

/**
 * 精灵的不透明度（0到255）。
 * The opacity of the sprite (0 to 255).
 *
 * @type {Number}
 */
Object.defineProperty(Sprite.prototype, "opacity", {
	get: function () {
		return this.alpha * 255;
	},
	set: function (value) {
		this.alpha = value.clamp(0, 255) / 255;
	},
	configurable: true,
});

/**
 * 为每一帧更新精灵。
 * Updates the sprite for each frame.
 *
 * @method update
 */
Sprite.prototype.update = function () {
	this.children.forEach(function (child) {
		if (child.update) {
			child.update();
		}
	});
};

/**
 * 一次设置x和y坐标。
 * Sets the x and y at once.
 *
 * @method move
 * @param {Number} x 精灵的x坐标 The x coordinate of the sprite
 * @param {Number} y 精灵的y坐标 The y coordinate of the sprite
 */
Sprite.prototype.move = function (x, y) {
	this.x = x;
	this.y = y;
};

/**
 * 设置精灵显示的位图矩形。
 * Sets the rectangle of the bitmap that the sprite displays.
 *
 * @method setFrame
 * @param {Number} x 帧的x坐标 The x coordinate of the frame
 * @param {Number} y 帧的y坐标 The y coordinate of the frame
 * @param {Number} width 帧的宽度 The width of the frame
 * @param {Number} height 帧的高度 The height of the frame
 */
Sprite.prototype.setFrame = function (x, y, width, height) {
	this._refreshFrame = false;
	var frame = this._frame;
	if (x !== frame.x || y !== frame.y || width !== frame.width || height !== frame.height) {
		frame.x = x;
		frame.y = y;
		frame.width = width;
		frame.height = height;
		this._refresh();
	}
};

/**
 * 获取精灵的混合颜色。
 * Gets the blend color for the sprite.
 *
 * @method getBlendColor
 * @return {Array} 混合颜色 [r, g, b, a] The blend color [r, g, b, a]
 */
Sprite.prototype.getBlendColor = function () {
	return this._blendColor.clone();
};

/**
 * 设置精灵的混合颜色。
 * Sets the blend color for the sprite.
 *
 * @method setBlendColor
 * @param {Array} color 混合颜色 [r, g, b, a] The blend color [r, g, b, a]
 */
Sprite.prototype.setBlendColor = function (color) {
	if (!(color instanceof Array)) {
		throw new Error("Argument must be an array");
	}
	if (!this._blendColor.equals(color)) {
		this._blendColor = color.clone();
		this._refresh();
	}
};

/**
 * 获取精灵的颜色色调。
 * Gets the color tone for the sprite.
 *
 * @method getColorTone
 * @return {Array} 颜色色调 [r, g, b, gray] The color tone [r, g, b, gray]
 */
Sprite.prototype.getColorTone = function () {
	return this._colorTone.clone();
};

/**
 * 设置精灵的颜色色调。
 * Sets the color tone for the sprite.
 *
 * @method setColorTone
 * @param {Array} tone 颜色色调 [r, g, b, gray] The color tone [r, g, b, gray]
 */
Sprite.prototype.setColorTone = function (tone) {
	if (!(tone instanceof Array)) {
		throw new Error("Argument must be an array");
	}
	if (!this._colorTone.equals(tone)) {
		this._colorTone = tone.clone();
		this._refresh();
	}
};

/**
 * 位图加载完成时的回调。
 * Callback when bitmap loading is completed.
 * 
 * @method _onBitmapLoad
 * @param {Bitmap} bitmapLoaded 已加载的位图 The loaded bitmap
 * @private
 */
Sprite.prototype._onBitmapLoad = function (bitmapLoaded) {
	if (bitmapLoaded === this._bitmap) {
		if (this._refreshFrame && this._bitmap) {
			this._refreshFrame = false;
			this._frame.width = this._bitmap.width;
			this._frame.height = this._bitmap.height;
		}
	}

	this._refresh();
};

/**
 * 刷新精灵显示。
 * Refreshes the sprite display.
 * 
 * @method _refresh
 * @private
 */
Sprite.prototype._refresh = function () {
	var frameX = Math.floor(this._frame.x);
	var frameY = Math.floor(this._frame.y);
	var frameW = Math.floor(this._frame.width);
	var frameH = Math.floor(this._frame.height);
	var bitmapW = this._bitmap ? this._bitmap.width : 0;
	var bitmapH = this._bitmap ? this._bitmap.height : 0;
	var realX = frameX.clamp(0, bitmapW);
	var realY = frameY.clamp(0, bitmapH);
	var realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
	var realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

	this._realFrame.x = realX;
	this._realFrame.y = realY;
	this._realFrame.width = realW;
	this._realFrame.height = realH;
	this.pivot.x = frameX - realX;
	this.pivot.y = frameY - realY;

	if (realW > 0 && realH > 0) {
		if (this._needsTint()) {
			this._createTinter(realW, realH);
			this._executeTint(realX, realY, realW, realH);
			this._tintTexture.update();
			this.texture.baseTexture = this._tintTexture;
			this.texture.frame = new Rectangle(0, 0, realW, realH);
		} else {
			if (this._bitmap) {
				this.texture.baseTexture = this._bitmap.baseTexture;
			}
			this.texture.frame = this._realFrame;
		}
	} else if (this._bitmap) {
		this.texture.frame = Rectangle.emptyRectangle;
	} else {
		this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
		this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
		this.texture.frame = this._frame;
	}
	this.texture._updateID++;
};

/**
 * 检查指定矩形是否在位图范围内。
 * Checks whether the specified rectangle is within the bitmap bounds.
 * 
 * @method _isInBitmapRect
 * @param {Number} x x坐标 The x coordinate
 * @param {Number} y y坐标 The y coordinate  
 * @param {Number} w 宽度 The width
 * @param {Number} h 高度 The height
 * @return {Boolean} 是否在位图范围内 Whether within bitmap bounds
 * @private
 */
Sprite.prototype._isInBitmapRect = function (x, y, w, h) {
	return this._bitmap && x + w > 0 && y + h > 0 && x < this._bitmap.width && y < this._bitmap.height;
};

/**
 * 检查是否需要色调处理。
 * Checks whether tinting is needed.
 * 
 * @method _needsTint
 * @return {Boolean} 是否需要色调处理 Whether tinting is needed
 * @private
 */
Sprite.prototype._needsTint = function () {
	var tone = this._colorTone;
	return tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0;
};

/**
 * 创建色调处理器。
 * Creates a tinter.
 * 
 * @method _createTinter
 * @param {Number} w 宽度 The width
 * @param {Number} h 高度 The height
 * @private
 */
Sprite.prototype._createTinter = function (w, h) {
	if (!this._canvas) {
		this._canvas = document.createElement("canvas");
		this._context = this._canvas.getContext("2d");
	}

	this._canvas.width = w;
	this._canvas.height = h;

	if (!this._tintTexture) {
		this._tintTexture = new PIXI.BaseTexture(this._canvas);
	}

	this._tintTexture.width = w;
	this._tintTexture.height = h;
	this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;
};

/**
 * 执行色调处理。
 * Executes tinting.
 * 
 * @method _executeTint
 * @param {Number} x x坐标 The x coordinate
 * @param {Number} y y坐标 The y coordinate
 * @param {Number} w 宽度 The width
 * @param {Number} h 高度 The height
 * @private
 */
Sprite.prototype._executeTint = function (x, y, w, h) {
	var context = this._context;
	var tone = this._colorTone;
	var color = this._blendColor;

	context.globalCompositeOperation = "copy";
	context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

	if (Graphics.canUseSaturationBlend()) {
		var gray = Math.max(0, tone[3]);
		context.globalCompositeOperation = "saturation";
		context.fillStyle = "rgba(255,255,255," + gray / 255 + ")";
		context.fillRect(0, 0, w, h);
	}

	var r1 = Math.max(0, tone[0]);
	var g1 = Math.max(0, tone[1]);
	var b1 = Math.max(0, tone[2]);
	context.globalCompositeOperation = "lighter";
	context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
	context.fillRect(0, 0, w, h);

	if (Graphics.canUseDifferenceBlend()) {
		context.globalCompositeOperation = "difference";
		context.fillStyle = "white";
		context.fillRect(0, 0, w, h);

		var r2 = Math.max(0, -tone[0]);
		var g2 = Math.max(0, -tone[1]);
		var b2 = Math.max(0, -tone[2]);
		context.globalCompositeOperation = "lighter";
		context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
		context.fillRect(0, 0, w, h);

		context.globalCompositeOperation = "difference";
		context.fillStyle = "white";
		context.fillRect(0, 0, w, h);
	}

	var r3 = Math.max(0, color[0]);
	var g3 = Math.max(0, color[1]);
	var b3 = Math.max(0, color[2]);
	var a3 = Math.max(0, color[3]);
	context.globalCompositeOperation = "source-atop";
	context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
	context.globalAlpha = a3 / 255;
	context.fillRect(0, 0, w, h);

	context.globalCompositeOperation = "destination-in";
	context.globalAlpha = 1;
	context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);
};

Sprite.prototype._renderCanvas_PIXI = PIXI.Sprite.prototype._renderCanvas;
Sprite.prototype._renderWebGL_PIXI = PIXI.Sprite.prototype._renderWebGL;

/**
 * Canvas渲染精灵。
 * Renders the sprite with Canvas.
 * 
 * @method _renderCanvas
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
Sprite.prototype._renderCanvas = function (renderer) {
	if (this.bitmap) {
		this.bitmap.touch();
	}
	if (this.bitmap && !this.bitmap.isReady()) {
		return;
	}

	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
		this._renderCanvas_PIXI(renderer);
	}
};

/**
 * 检查是否需要加速自定义混合模式。
 * Checks if we need to speed up custom blendmodes.
 * 
 * @method _speedUpCustomBlendModes
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
Sprite.prototype._speedUpCustomBlendModes = function (renderer) {
	var picture = renderer.plugins.picture;
	var blend = this.blendMode;
	if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
		if (picture.drawModes[blend]) {
			var stage = renderer._lastObjectRendered;
			var f = stage._filters;
			if (!f || !f[0]) {
				setTimeout(function () {
					var f = stage._filters;
					if (!f || !f[0]) {
						stage.filters = [Sprite.voidFilter];
						stage.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
					}
				}, 0);
			}
		}
	}
};

/**
 * WebGL渲染精灵。
 * Renders the sprite with WebGL.
 * 
 * @method _renderWebGL
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
Sprite.prototype._renderWebGL = function (renderer) {
	if (this.bitmap) {
		this.bitmap.touch();
	}
	if (this.bitmap && !this.bitmap.isReady()) {
		return;
	}
	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
		if (this._bitmap) {
			this._bitmap.checkDirty();
		}

		//copy of pixi-v4 internal code
		this.calculateVertices();

		if (this.pluginName === "sprite" && this._isPicture) {
			// use heavy renderer, which reduces artifacts and applies corrent blendMode,
			// but does not use multitexture optimization
			this._speedUpCustomBlendModes(renderer);
			renderer.setObjectRenderer(renderer.plugins.picture);
			renderer.plugins.picture.render(this);
		} else {
			// use pixi super-speed renderer
			renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
			renderer.plugins[this.pluginName].render(this);
		}
	}
};

// The important members from Pixi.js

/**
 * 精灵的可见性。
 * The visibility of the sprite.
 *
 * @type {Boolean}
 */

/**
 * 精灵的x坐标。
 * The x coordinate of the sprite.
 *
 * @type {Number}
 */

/**
 * 精灵的y坐标。
 * The y coordinate of the sprite.
 *
 * @type {Number}
 */

/**
 * 精灵的锚点，范围(0,0)到(1,1)。
 * The origin point of the sprite. (0,0) to (1,1).
 *
 * @type {Point}
 */

/**
 * 精灵的缩放因子。
 * The scale factor of the sprite.
 *
 * @type {Point}
 */

/**
 * 精灵的旋转角度（弧度）。
 * The rotation of the sprite in radians.
 *
 * @type {Number}
 */

/**
 * 应用于精灵的混合模式。
 * The blend mode to be applied to the sprite.
 *
 * @type {Number}
 */

/**
 * 精灵的滤镜设置。
 * Sets the filters for the sprite.
 *
 * @type {Array}
 */

/**
 * [只读] 精灵的子对象数组。
 * [read-only] The array of children of the sprite.
 *
 * @type {Array}
 */

/**
 * [只读] 包含该精灵的对象。
 * [read-only] The object that contains the sprite.
 *
 * @type {Object}
 */

/**
 * 向容器添加子对象。
 * Adds a child to the container.
 *
 * @method addChild
 * @param {Object} child 要添加的子对象 The child to add
 * @return {Object} 添加的子对象 The child that was added
 */

/**
 * 在指定索引位置向容器添加子对象。
 * Adds a child to the container at a specified index.
 *
 * @method addChildAt
 * @param {Object} child 要添加的子对象 The child to add
 * @param {Number} index 放置子对象的索引 The index to place the child in
 * @return {Object} 添加的子对象 The child that was added
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
