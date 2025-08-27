//=============================================================================
// TilingSprite.js
//=============================================================================

/**
 * 平铺图像的精灵对象。
 * The sprite object for a tiling image.
 *
 * @class TilingSprite
 * @extends PIXI.extras.PictureTilingSprite
 * @param {Bitmap} bitmap 平铺精灵的图像 The image for the tiling sprite
 */
function TilingSprite() {
	this.initialize.apply(this, arguments);
}

TilingSprite.prototype = Object.create(PIXI.extras.PictureTilingSprite.prototype);
TilingSprite.prototype.constructor = TilingSprite;

/**
 * 初始化平铺精灵。
 * Initializes the tiling sprite.
 *
 * @method initialize
 * @param {Bitmap} bitmap 平铺精灵的图像 The image for the tiling sprite
 */
TilingSprite.prototype.initialize = function (bitmap) {
	var texture = new PIXI.Texture(new PIXI.BaseTexture());

	PIXI.extras.PictureTilingSprite.call(this, texture);

	this._bitmap = null;
	this._width = 0;
	this._height = 0;
	this._frame = new Rectangle();
	this.spriteId = Sprite._counter++;
	/**
	 * 用于滚动的平铺精灵原点。
	 * The origin point of the tiling sprite for scrolling.
	 *
	 * @type {Point}
	 */
	this.origin = new Point();

	this.bitmap = bitmap;
};

TilingSprite.prototype._renderCanvas_PIXI = PIXI.extras.PictureTilingSprite.prototype._renderCanvas;
TilingSprite.prototype._renderWebGL_PIXI = PIXI.extras.PictureTilingSprite.prototype._renderWebGL;

/**
 * Canvas渲染平铺精灵。
 * Renders the tiling sprite with Canvas.
 *
 * @method _renderCanvas
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
TilingSprite.prototype._renderCanvas = function (renderer) {
	if (this._bitmap) {
		this._bitmap.touch();
	}
	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
		this._renderCanvas_PIXI(renderer);
	}
};

/**
 * WebGL渲染平铺精灵。
 * Renders the tiling sprite with WebGL.
 *
 * @method _renderWebGL
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
TilingSprite.prototype._renderWebGL = function (renderer) {
	if (this._bitmap) {
		this._bitmap.touch();
	}
	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
		if (this._bitmap) {
			this._bitmap.checkDirty();
		}
		this._renderWebGL_PIXI(renderer);
	}
};

/**
 * 平铺精灵的图像。
 * The image for the tiling sprite.
 *
 * @type {Bitmap}
 */
Object.defineProperty(TilingSprite.prototype, "bitmap", {
	get: function () {
		return this._bitmap;
	},
	set: function (value) {
		if (this._bitmap !== value) {
			this._bitmap = value;
			if (this._bitmap) {
				this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
			} else {
				this.texture.frame = Rectangle.emptyRectangle;
			}
		}
	},
	configurable: true,
});

/**
 * 平铺精灵的不透明度（0到255）。
 * The opacity of the tiling sprite (0 to 255).
 *
 * @type {Number}
 */
Object.defineProperty(TilingSprite.prototype, "opacity", {
	get: function () {
		return this.alpha * 255;
	},
	set: function (value) {
		this.alpha = value.clamp(0, 255) / 255;
	},
	configurable: true,
});

/**
 * 为每一帧更新平铺精灵。
 * Updates the tiling sprite for each frame.
 *
 * @method update
 */
TilingSprite.prototype.update = function () {
	this.children.forEach(function (child) {
		if (child.update) {
			child.update();
		}
	});
};

/**
 * 一次性设置x、y、宽度和高度。
 * Sets the x, y, width, and height all at once.
 *
 * @method move
 * @param {Number} x 平铺精灵的x坐标 The x coordinate of the tiling sprite
 * @param {Number} y 平铺精灵的y坐标 The y coordinate of the tiling sprite
 * @param {Number} width 平铺精灵的宽度 The width of the tiling sprite
 * @param {Number} height 平铺精灵的高度 The height of the tiling sprite
 */
TilingSprite.prototype.move = function (x, y, width, height) {
	this.x = x || 0;
	this.y = y || 0;
	this._width = width || 0;
	this._height = height || 0;
};

/**
 * 指定平铺精灵将使用的图像区域。
 * Specifies the region of the image that the tiling sprite will use.
 *
 * @method setFrame
 * @param {Number} x 帧的x坐标 The x coordinate of the frame
 * @param {Number} y 帧的y坐标 The y coordinate of the frame
 * @param {Number} width 帧的宽度 The width of the frame
 * @param {Number} height 帧的高度 The height of the frame
 */
TilingSprite.prototype.setFrame = function (x, y, width, height) {
	this._frame.x = x;
	this._frame.y = y;
	this._frame.width = width;
	this._frame.height = height;
	this._refresh();
};

/**
 * 更新变换。
 * Updates transform.
 *
 * @method updateTransform
 * @private
 */
TilingSprite.prototype.updateTransform = function () {
	this.tilePosition.x = Math.round(-this.origin.x);
	this.tilePosition.y = Math.round(-this.origin.y);
	this.updateTransformTS();
};

TilingSprite.prototype.updateTransformTS = PIXI.extras.TilingSprite.prototype.updateTransform;

/**
 * 位图加载完成时的回调。
 * Callback when bitmap loading is completed.
 *
 * @method _onBitmapLoad
 * @private
 */
TilingSprite.prototype._onBitmapLoad = function () {
	this.texture.baseTexture = this._bitmap.baseTexture;
	this._refresh();
};

/**
 * 刷新平铺精灵显示。
 * Refreshes the tiling sprite display.
 *
 * @method _refresh
 * @private
 */
TilingSprite.prototype._refresh = function () {
	var frame = this._frame.clone();
	if (frame.width === 0 && frame.height === 0 && this._bitmap) {
		frame.width = this._bitmap.width;
		frame.height = this._bitmap.height;
	}
	this.texture.frame = frame;
	this.texture._updateID++;
	this.tilingTexture = null;
};

TilingSprite.prototype._speedUpCustomBlendModes = Sprite.prototype._speedUpCustomBlendModes;

/**
 * WebGL渲染平铺精灵（优化版本）。
 * Renders the tiling sprite with WebGL (optimized version).
 *
 * @method _renderWebGL
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
TilingSprite.prototype._renderWebGL = function (renderer) {
	if (this._bitmap) {
		this._bitmap.touch();
		this._bitmap.checkDirty();
	}

	this._speedUpCustomBlendModes(renderer);

	this._renderWebGL_PIXI(renderer);
};

// The important members from Pixi.js

/**
 * 平铺精灵的可见性。
 * The visibility of the tiling sprite.
 *
 * @type {Boolean}
 */

/**
 * 平铺精灵的x坐标。
 * The x coordinate of the tiling sprite.
 *
 * @type {Number}
 */

/**
 * 平铺精灵的y坐标。
 * The y coordinate of the tiling sprite.
 *
 * @type {Number}
 */

//-----------------------------------------------------------------------------
