//-----------------------------------------------------------------------------
/**
 * 表示图像的基本对象
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} width - 位图宽度 / The width of the bitmap
 * @param {Number} height - 位图高度 / The height of the bitmap
 */
function Bitmap() {
	this.initialize.apply(this, arguments);
}

/**
 * iOS平台的图片重用数组，避免内存消耗
 * Image reuse array for iOS platform to avoid memory consumption
 * @static
 * @private
 */
Bitmap._reuseImages = [];

/**
 * 位图状态说明 (Bitmap._loadingState):
 * Bitmap states (Bitmap._loadingState):
 *
 * none - 无状态:
 * 空位图
 * Empty Bitmap
 *
 * pending - 等待中:
 * 已请求URL，但等待调用startRequest才开始加载
 * Url requested, but pending to load until startRequest called
 *
 * purged - 已清除:
 * URL请求完成并已清除
 * Url request completed and purged.
 *
 * requesting - 请求中:
 * 正在请求指定的URI
 * Requesting supplied URI now.
 *
 * requestCompleted - 请求完成:
 * 请求完成
 * Request completed
 *
 * decrypting - 解密中:
 * 从指定URI请求加密数据或正在解密
 * requesting encrypted data from supplied URI or decrypting it.
 *
 * decryptCompleted - 解密完成:
 * 解密完成
 * Decrypt completed
 *
 * loaded - 已加载:
 * 加载完成。isReady() === true，可以使用
 * loaded. isReady() === true, so It's usable.
 *
 * error - 错误:
 * 发生错误
 * error occurred
 *
 */

/**
 * Creates the canvas and context for the bitmap.
 * 为位图创建画布和上下文。
 *
 * @private
 * @method _createCanvas
 * @param {Number} width - The width of the canvas
 * @param {Number} height - The height of the canvas
 */
Bitmap.prototype._createCanvas = function (width, height) {
	this.__canvas = this.__canvas || document.createElement("canvas");
	this.__context = this.__canvas.getContext("2d");

	this.__canvas.width = Math.max(width || 0, 1);
	this.__canvas.height = Math.max(height || 0, 1);

	if (this._image) {
		var w = Math.max(this._image.width || 0, 1);
		var h = Math.max(this._image.height || 0, 1);
		this.__canvas.width = w;
		this.__canvas.height = h;
		this._createBaseTexture(this._canvas);

		this.__context.drawImage(this._image, 0, 0);
	}

	this._setDirty();
};

/**
 * Creates the base texture from the given source.
 * 从给定源创建基础纹理。
 *
 * @private
 * @method _createBaseTexture
 * @param {Object} source - 纹理源对象（画布或图片） / The source for the texture (canvas or image)
 */
Bitmap.prototype._createBaseTexture = function (source) {
	this.__baseTexture = new PIXI.BaseTexture(source);
	this.__baseTexture.mipmap = false;
	this.__baseTexture.width = source.width;
	this.__baseTexture.height = source.height;

	if (this._smooth) {
		this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
	} else {
		this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	}
};

/**
 * Clears the image instance and prepares it for reuse.
 * 清除图像实例并准备重用。
 *
 * @private
 * @method _clearImgInstance
 */
Bitmap.prototype._clearImgInstance = function () {
	this._image.src = "";
	this._image.onload = null;
	this._image.onerror = null;
	this._errorListener = null;
	this._loadListener = null;

	Bitmap._reuseImages.push(this._image);
	this._image = null;
};

/**
 * 为了避免内存浪费，画布创建被延迟执行
 * We don't want to waste memory, so creating canvas is deferred.
 */
Object.defineProperties(Bitmap.prototype, {
	/**
	 * 画布属性
	 * Canvas property
	 *
	 * @property _canvas
	 * @type HTMLCanvasElement
	 * @private
	 */
	_canvas: {
		get: function () {
			if (!this.__canvas) this._createCanvas();
			return this.__canvas;
		},
	},
	/**
	 * 2D上下文属性
	 * 2D context property
	 *
	 * @property _context
	 * @type CanvasRenderingContext2D
	 * @private
	 */
	_context: {
		get: function () {
			if (!this.__context) this._createCanvas();
			return this.__context;
		},
	},

	/**
	 * 基础纹理属性
	 * Base texture property
	 *
	 * @property _baseTexture
	 * @type PIXI.BaseTexture
	 * @private
	 */
	_baseTexture: {
		get: function () {
			if (!this.__baseTexture) this._createBaseTexture(this._image || this.__canvas);
			return this.__baseTexture;
		},
	},
});

/**
 * Renews the canvas if the image size has changed.
 * 如果图像大小已更改，则更新画布。
 *
 * @private
 * @method _renewCanvas
 */
Bitmap.prototype._renewCanvas = function () {
	var newImage = this._image;
	if (newImage && this.__canvas && (this.__canvas.width < newImage.width || this.__canvas.height < newImage.height)) {
		this._createCanvas();
	}
};

/**
 * Initialize the bitmap.
 * 初始化位图。
 *
 * @method initialize
 * @param {Number} width - The width of the bitmap
 * @param {Number} height - The height of the bitmap
 */
Bitmap.prototype.initialize = function (width, height) {
	if (!this._defer) {
		this._createCanvas(width, height);
	}

	this._image = null;
	this._url = "";
	this._paintOpacity = 255;
	this._smooth = false;
	this._loadListeners = [];
	this._loadingState = "none";
	this._decodeAfterRequest = false;

	/**
	 * Cache entry, for images. In all cases _url is the same as cacheEntry.key
	 * 缓存条目，用于图像。在所有情况下，_url 与 cacheEntry.key 相同。
	 * @type CacheEntry
	 */
	this.cacheEntry = null;

	/**
	 * 字体名称
	 * The face name of the font.
	 *
	 * @property fontFace
	 * @type String
	 */
	this.fontFace = "GameFont";

	/**
	 * 字体大小(像素)
	 * The size of the font in pixels.
	 *
	 * @property fontSize
	 * @type Number
	 */
	this.fontSize = 28;

	/**
	 * 字体是否为斜体
	 * Whether the font is italic.
	 *
	 * @property fontItalic
	 * @type Boolean
	 */
	this.fontItalic = false;

	/**
	 * CSS格式的文字颜色
	 * The color of the text in CSS format.
	 *
	 * @property textColor
	 * @type String
	 */
	this.textColor = "#ffffff";

	/**
	 * CSS格式的文字轮廓颜色
	 * The color of the outline of the text in CSS format.
	 *
	 * @property outlineColor
	 * @type String
	 */
	this.outlineColor = "rgba(0, 0, 0, 0.5)";

	/**
	 * 文字轮廓的宽度
	 * The width of the outline of the text.
	 *
	 * @property outlineWidth
	 * @type Number
	 */
	this.outlineWidth = 4;
};

/**
 * 加载图像文件并返回新的位图对象
 * Loads a image file and returns a new bitmap object.
 *
 * @static
 * @method load
 * @param {String} url - 纹理的图像URL / The image url of the texture
 * @return {Bitmap} 新的位图对象 / New bitmap object
 */
Bitmap.load = function (url) {
	var bitmap = Object.create(Bitmap.prototype);
	bitmap._defer = true;
	bitmap.initialize();

	bitmap._decodeAfterRequest = true;
	bitmap._requestImage(url);

	return bitmap;
};

/**
 * 截取游戏画面快照并返回新的位图对象
 * Takes a snapshot of the game screen and returns a new bitmap object.
 *
 * @static
 * @method snap
 * @param {Stage} stage - 舞台对象 / The stage object
 * @return {Bitmap} 新的位图对象 / New bitmap object
 */
Bitmap.snap = function (stage) {
	var width = Graphics.width;
	var height = Graphics.height;
	var bitmap = new Bitmap(width, height);
	var context = bitmap._context;
	var renderTexture = PIXI.RenderTexture.create(width, height);
	if (stage) {
		Graphics._renderer.render(stage, renderTexture);
		stage.worldTransform.identity();
		var canvas = null;
		if (Graphics.isWebGL()) {
			canvas = Graphics._renderer.extract.canvas(renderTexture);
		} else {
			canvas = renderTexture.baseTexture._canvasRenderTarget.canvas;
		}
		context.drawImage(canvas, 0, 0);
	} else {
	}
	renderTexture.destroy({ destroyBase: true });
	bitmap._setDirty();
	return bitmap;
};

/**
 * 检查位图是否准备好渲染
 * Checks whether the bitmap is ready to render.
 *
 * @method isReady
 * @return {Boolean} 如果位图准备好渲染则返回true / True if the bitmap is ready to render
 */
Bitmap.prototype.isReady = function () {
	return this._loadingState === "loaded" || this._loadingState === "none";
};

/**
 * 检查是否发生加载错误
 * Checks whether a loading error has occurred.
 *
 * @method isError
 * @return {Boolean} 如果发生加载错误则返回true / True if a loading error has occurred
 */
Bitmap.prototype.isError = function () {
	return this._loadingState === "error";
};

/**
 * Touch the resource to prevent it from being removed from cache.
 * 触摸资源以防止其从缓存中移除。
 *
 * @method touch
 */
Bitmap.prototype.touch = function () {
	if (this.cacheEntry) {
		this.cacheEntry.touch();
	}
};

/**
 * [只读] 图像文件的URL
 * [read-only] The url of the image file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(Bitmap.prototype, "url", {
	get: function () {
		return this._url;
	},
	configurable: true,
});

/**
 * [只读] 保存图像的基础纹理
 * [read-only] The base texture that holds the image.
 *
 * @property baseTexture
 * @type PIXI.BaseTexture
 */
Object.defineProperty(Bitmap.prototype, "baseTexture", {
	get: function () {
		return this._baseTexture;
	},
	configurable: true,
});

/**
 * [只读] 位图画布
 * [read-only] The bitmap canvas.
 *
 * @property canvas
 * @type HTMLCanvasElement
 */
Object.defineProperty(Bitmap.prototype, "canvas", {
	get: function () {
		return this._canvas;
	},
	configurable: true,
});

/**
 * [只读] 位图画布的2D上下文
 * [read-only] The 2d context of the bitmap canvas.
 *
 * @property context
 * @type CanvasRenderingContext2D
 */
Object.defineProperty(Bitmap.prototype, "context", {
	get: function () {
		return this._context;
	},
	configurable: true,
});

/**
 * [只读] 位图的宽度
 * [read-only] The width of the bitmap.
 *
 * @property width
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, "width", {
	get: function () {
		if (this.isReady()) {
			return this._image ? this._image.width : this._canvas.width;
		}

		return 0;
	},
	configurable: true,
});

/**
 * [只读] 位图的高度
 * [read-only] The height of the bitmap.
 *
 * @property height
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, "height", {
	get: function () {
		if (this.isReady()) {
			return this._image ? this._image.height : this._canvas.height;
		}

		return 0;
	},
	configurable: true,
});

/**
 * [只读] 位图的矩形区域
 * [read-only] The rectangle of the bitmap.
 *
 * @property rect
 * @type Rectangle
 */
Object.defineProperty(Bitmap.prototype, "rect", {
	get: function () {
		return new Rectangle(0, 0, this.width, this.height);
	},
	configurable: true,
});

/**
 * 是否应用平滑缩放
 * Whether the smooth scaling is applied.
 *
 * @property smooth
 * @type Boolean
 */
Object.defineProperty(Bitmap.prototype, "smooth", {
	get: function () {
		return this._smooth;
	},
	set: function (value) {
		if (this._smooth !== value) {
			this._smooth = value;
			if (this.__baseTexture) {
				if (this._smooth) {
					this._baseTexture.scaleMode = PIXI.SCALE_MODES.LINEAR;
				} else {
					this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
				}
			}
		}
	},
	configurable: true,
});

/**
 * 绘制对象的不透明度，范围为(0, 255)
 * The opacity of the drawing object in the range (0, 255).
 *
 * @property paintOpacity
 * @type Number
 */
Object.defineProperty(Bitmap.prototype, "paintOpacity", {
	get: function () {
		return this._paintOpacity;
	},
	set: function (value) {
		if (this._paintOpacity !== value) {
			this._paintOpacity = value;
			this._context.globalAlpha = this._paintOpacity / 255;
		}
	},
	configurable: true,
});

/**
 * 调整位图大小
 * Resizes the bitmap.
 *
 * @method resize
 * @param {Number} width - 位图的新宽度 / The new width of the bitmap
 * @param {Number} height - 位图的新高度 / The new height of the bitmap
 */
Bitmap.prototype.resize = function (width, height) {
	width = Math.max(width || 0, 1);
	height = Math.max(height || 0, 1);
	this._canvas.width = width;
	this._canvas.height = height;
	this._baseTexture.width = width;
	this._baseTexture.height = height;
};

/**
 * 执行块传输
 * Performs a block transfer.
 *
 * @method blt
 * @param {Bitmap} source - 要绘制的位图 / The bitmap to draw
 * @param {Number} sx - 源中的x坐标 / The x coordinate in the source
 * @param {Number} sy - 源中的y坐标 / The y coordinate in the source
 * @param {Number} sw - 源图像的宽度 / The width of the source image
 * @param {Number} sh - 源图像的高度 / The height of the source image
 * @param {Number} dx - 目标中的x坐标 / The x coordinate in the destination
 * @param {Number} dy - 目标中的y坐标 / The y coordinate in the destination
 * @param {Number} [dw=sw] - 在目标中绘制图像的宽度 / The width to draw the image in the destination
 * @param {Number} [dh=sh] - 在目标中绘制图像的高度 / The height to draw the image in the destination
 */
Bitmap.prototype.blt = function (source, sx, sy, sw, sh, dx, dy, dw, dh) {
	dw = dw || sw;
	dh = dh || sh;
	if (
		sx >= 0 &&
		sy >= 0 &&
		sw > 0 &&
		sh > 0 &&
		dw > 0 &&
		dh > 0 &&
		sx + sw <= source.width &&
		sy + sh <= source.height
	) {
		this._context.globalCompositeOperation = "source-over";
		this._context.drawImage(source._canvas, sx, sy, sw, sh, dx, dy, dw, dh);
		this._setDirty();
	}
};

/**
 * 执行块传输，假设原始图像未被修改(无色相变化)
 * Performs a block transfer, using assumption that original image was not modified (no hue)
 *
 * @method bltImage
 * @param {Bitmap} source - 要绘制的位图 / The bitmap to draw
 * @param {Number} sx - 源中的x坐标 / The x coordinate in the source
 * @param {Number} sy - 源中的y坐标 / The y coordinate in the source
 * @param {Number} sw - 源图像的宽度 / The width of the source image
 * @param {Number} sh - 源图像的高度 / The height of the source image
 * @param {Number} dx - 目标中的x坐标 / The x coordinate in the destination
 * @param {Number} dy - 目标中的y坐标 / The y coordinate in the destination
 * @param {Number} [dw=sw] - 在目标中绘制图像的宽度 / The width to draw the image in the destination
 * @param {Number} [dh=sh] - 在目标中绘制图像的高度 / The height to draw the image in the destination
 */
Bitmap.prototype.bltImage = function (source, sx, sy, sw, sh, dx, dy, dw, dh) {
	dw = dw || sw;
	dh = dh || sh;
	if (
		sx >= 0 &&
		sy >= 0 &&
		sw > 0 &&
		sh > 0 &&
		dw > 0 &&
		dh > 0 &&
		sx + sw <= source.width &&
		sy + sh <= source.height
	) {
		this._context.globalCompositeOperation = "source-over";
		this._context.drawImage(source._image, sx, sy, sw, sh, dx, dy, dw, dh);
		this._setDirty();
	}
};

/**
 * 返回指定点的像素颜色
 * Returns pixel color at the specified point.
 *
 * @method getPixel
 * @param {Number} x - 位图中像素的x坐标 / The x coordinate of the pixel in the bitmap
 * @param {Number} y - 位图中像素的y坐标 / The y coordinate of the pixel in the bitmap
 * @return {String} 像素颜色(十六进制格式) / The pixel color (hex format)
 */
Bitmap.prototype.getPixel = function (x, y) {
	var data = this._context.getImageData(x, y, 1, 1).data;
	var result = "#";
	for (var i = 0; i < 3; i++) {
		result += data[i].toString(16).padZero(2);
	}
	return result;
};

/**
 * 返回指定点的像素透明度值
 * Returns alpha pixel value at the specified point.
 *
 * @method getAlphaPixel
 * @param {Number} x - 位图中像素的x坐标 / The x coordinate of the pixel in the bitmap
 * @param {Number} y - 位图中像素的y坐标 / The y coordinate of the pixel in the bitmap
 * @return {Number} 透明度值 / The alpha value
 */
Bitmap.prototype.getAlphaPixel = function (x, y) {
	var data = this._context.getImageData(x, y, 1, 1).data;
	return data[3];
};

/**
 * 清除指定的矩形区域
 * Clears the specified rectangle.
 *
 * @method clearRect
 * @param {Number} x - 左上角的x坐标 / The x coordinate for the upper-left corner
 * @param {Number} y - 左上角的y坐标 / The y coordinate for the upper-left corner
 * @param {Number} width - 要清除的矩形宽度 / The width of the rectangle to clear
 * @param {Number} height - 要清除的矩形高度 / The height of the rectangle to clear
 */
Bitmap.prototype.clearRect = function (x, y, width, height) {
	this._context.clearRect(x, y, width, height);
	this._setDirty();
};

/**
 * 清除整个位图
 * Clears the entire bitmap.
 *
 * @method clear
 */
Bitmap.prototype.clear = function () {
	this.clearRect(0, 0, this.width, this.height);
};

/**
 * 填充指定的矩形区域
 * Fills the specified rectangle.
 *
 * @method fillRect
 * @param {Number} x - 左上角的x坐标 / The x coordinate for the upper-left corner
 * @param {Number} y - 左上角的y坐标 / The y coordinate for the upper-left corner
 * @param {Number} width - 要填充的矩形宽度 / The width of the rectangle to fill
 * @param {Number} height - 要填充的矩形高度 / The height of the rectangle to fill
 * @param {String} color - CSS格式的矩形颜色 / The color of the rectangle in CSS format
 */
Bitmap.prototype.fillRect = function (x, y, width, height, color) {
	var context = this._context;
	context.save();
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
	context.restore();
	this._setDirty();
};

/**
 * 填充整个位图
 * Fills the entire bitmap.
 *
 * @method fillAll
 * @param {String} color - CSS格式的矩形颜色 / The color of the rectangle in CSS format
 */
Bitmap.prototype.fillAll = function (color) {
	this.fillRect(0, 0, this.width, this.height, color);
};

/**
 * 绘制具有渐变效果的矩形
 * Draws the rectangle with a gradation.
 *
 * @method gradientFillRect
 * @param {Number} x - 左上角的x坐标 / The x coordinate for the upper-left corner
 * @param {Number} y - 左上角的y坐标 / The y coordinate for the upper-left corner
 * @param {Number} width - 要填充的矩形宽度 / The width of the rectangle to fill
 * @param {Number} height - 要填充的矩形高度 / The height of the rectangle to fill
 * @param {String} color1 - 渐变起始颜色 / The gradient starting color
 * @param {String} color2 - 渐变结束颜色 / The gradient ending color
 * @param {Boolean} vertical - 渐变是否为垂直方向 / Whether the gradient should be draw as vertical or not
 */
Bitmap.prototype.gradientFillRect = function (x, y, width, height, color1, color2, vertical) {
	var context = this._context;
	var grad;
	if (vertical) {
		grad = context.createLinearGradient(x, y, x, y + height);
	} else {
		grad = context.createLinearGradient(x, y, x + width, y);
	}
	grad.addColorStop(0, color1);
	grad.addColorStop(1, color2);
	context.save();
	context.fillStyle = grad;
	context.fillRect(x, y, width, height);
	context.restore();
	this._setDirty();
};

/**
 * 绘制圆形位图
 * Draw a bitmap in the shape of a circle
 *
 * @method drawCircle
 * @param {Number} x - 基于圆心的x坐标 / The x coordinate based on the circle center
 * @param {Number} y - 基于圆心的y坐标 / The y coordinate based on the circle center
 * @param {Number} radius - 圆的半径 / The radius of the circle
 * @param {String} color - CSS格式的圆的颜色 / The color of the circle in CSS format
 */
Bitmap.prototype.drawCircle = function (x, y, radius, color) {
	var context = this._context;
	context.save();
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, radius, 0, Math.PI * 2, false);
	context.fill();
	context.restore();
	this._setDirty();
};

/**
 * 向位图绘制轮廓文字
 * Draws the outline text to the bitmap.
 *
 * @method drawText
 * @param {String} text - 将要绘制的文字 / The text that will be drawn
 * @param {Number} x - 文字左侧的x坐标 / The x coordinate for the left of the text
 * @param {Number} y - 文字顶部的y坐标 / The y coordinate for the top of the text
 * @param {Number} maxWidth - 文字的最大允许宽度 / The maximum allowed width of the text
 * @param {Number} lineHeight - 文字行的高度 / The height of the text line
 * @param {String} align - 文字的对齐方式 / The alignment of the text
 */
Bitmap.prototype.drawText = function (text, x, y, maxWidth, lineHeight, align) {
	// Note: Firefox has a bug with textBaseline: Bug 737852
	//       So we use 'alphabetic' here.
	if (text !== undefined) {
		var tx = x;
		var ty = y + lineHeight - (lineHeight - this.fontSize * 0.7) / 2;
		var context = this._context;
		var alpha = context.globalAlpha;
		maxWidth = maxWidth || 0xffffffff;
		if (align === "center") {
			tx += maxWidth / 2;
		}
		if (align === "right") {
			tx += maxWidth;
		}
		context.save();
		context.font = this._makeFontNameText();
		context.textAlign = align;
		context.textBaseline = "alphabetic";
		context.globalAlpha = 1;
		this._drawTextOutline(text, tx, ty, maxWidth);
		context.globalAlpha = alpha;
		this._drawTextBody(text, tx, ty, maxWidth);
		context.restore();
		this._setDirty();
	}
};

/**
 * 返回指定文字的宽度
 * Returns the width of the specified text.
 *
 * @method measureTextWidth
 * @param {String} text - 要测量的文字 / The text to be measured
 * @return {Number} 文字的宽度(像素) / The width of the text in pixels
 */
Bitmap.prototype.measureTextWidth = function (text) {
	var context = this._context;
	context.save();
	context.font = this._makeFontNameText();
	var width = context.measureText(text).width;
	context.restore();
	return width;
};

/**
 * 改变整个位图的色调
 * Changes the color tone of the entire bitmap.
 *
 * @method adjustTone
 * @param {Number} r - 红色强度，范围(-255, 255) / The red strength in the range (-255, 255)
 * @param {Number} g - 绿色强度，范围(-255, 255) / The green strength in the range (-255, 255)
 * @param {Number} b - 蓝色强度，范围(-255, 255) / The blue strength in the range (-255, 255)
 */
Bitmap.prototype.adjustTone = function (r, g, b) {
	if ((r || g || b) && this.width > 0 && this.height > 0) {
		var context = this._context;
		var imageData = context.getImageData(0, 0, this.width, this.height);
		var pixels = imageData.data;
		for (var i = 0; i < pixels.length; i += 4) {
			pixels[i + 0] += r;
			pixels[i + 1] += g;
			pixels[i + 2] += b;
		}
		context.putImageData(imageData, 0, 0);
		this._setDirty();
	}
};

/**
 * 旋转整个位图的色相
 * Rotates the hue of the entire bitmap.
 *
 * @method rotateHue
 * @param {Number} offset - 色相偏移量，以360度为单位 / The hue offset in 360 degrees
 */
Bitmap.prototype.rotateHue = function (offset) {
	function rgbToHsl(r, g, b) {
		var cmin = Math.min(r, g, b);
		var cmax = Math.max(r, g, b);
		var h = 0;
		var s = 0;
		var l = (cmin + cmax) / 2;
		var delta = cmax - cmin;

		if (delta > 0) {
			if (r === cmax) {
				h = 60 * (((g - b) / delta + 6) % 6);
			} else if (g === cmax) {
				h = 60 * ((b - r) / delta + 2);
			} else {
				h = 60 * ((r - g) / delta + 4);
			}
			s = delta / (255 - Math.abs(2 * l - 255));
		}
		return [h, s, l];
	}

	function hslToRgb(h, s, l) {
		var c = (255 - Math.abs(2 * l - 255)) * s;
		var x = c * (1 - Math.abs(((h / 60) % 2) - 1));
		var m = l - c / 2;
		var cm = c + m;
		var xm = x + m;

		if (h < 60) {
			return [cm, xm, m];
		} else if (h < 120) {
			return [xm, cm, m];
		} else if (h < 180) {
			return [m, cm, xm];
		} else if (h < 240) {
			return [m, xm, cm];
		} else if (h < 300) {
			return [xm, m, cm];
		} else {
			return [cm, m, xm];
		}
	}

	if (offset && this.width > 0 && this.height > 0) {
		offset = ((offset % 360) + 360) % 360;
		var context = this._context;
		var imageData = context.getImageData(0, 0, this.width, this.height);
		var pixels = imageData.data;
		for (var i = 0; i < pixels.length; i += 4) {
			var hsl = rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);
			var h = (hsl[0] + offset) % 360;
			var s = hsl[1];
			var l = hsl[2];
			var rgb = hslToRgb(h, s, l);
			pixels[i + 0] = rgb[0];
			pixels[i + 1] = rgb[1];
			pixels[i + 2] = rgb[2];
		}
		context.putImageData(imageData, 0, 0);
		this._setDirty();
	}
};

/**
 * 对位图应用模糊效果
 * Applies a blur effect to the bitmap.
 *
 * @method blur
 */
Bitmap.prototype.blur = function () {
	for (var i = 0; i < 2; i++) {
		var w = this.width;
		var h = this.height;
		var canvas = this._canvas;
		var context = this._context;
		var tempCanvas = document.createElement("canvas");
		var tempContext = tempCanvas.getContext("2d");
		tempCanvas.width = w + 2;
		tempCanvas.height = h + 2;
		tempContext.drawImage(canvas, 0, 0, w, h, 1, 1, w, h);
		tempContext.drawImage(canvas, 0, 0, w, 1, 1, 0, w, 1);
		tempContext.drawImage(canvas, 0, 0, 1, h, 0, 1, 1, h);
		tempContext.drawImage(canvas, 0, h - 1, w, 1, 1, h + 1, w, 1);
		tempContext.drawImage(canvas, w - 1, 0, 1, h, w + 1, 1, 1, h);
		context.save();
		context.fillStyle = "black";
		context.fillRect(0, 0, w, h);
		context.globalCompositeOperation = "lighter";
		context.globalAlpha = 1 / 9;
		for (var y = 0; y < 3; y++) {
			for (var x = 0; x < 3; x++) {
				context.drawImage(tempCanvas, x, y, w, h, 0, 0, w, h);
			}
		}
		context.restore();
	}
	this._setDirty();
};

/**
 * 添加在位图加载完成时调用的回调函数
 * Add a callback function that will be called when the bitmap is loaded.
 *
 * @method addLoadListener
 * @param {Function} listener - 回调函数 / The callback function
 */
Bitmap.prototype.addLoadListener = function (listner) {
	if (!this.isReady()) {
		this._loadListeners.push(listner);
	} else {
		listner(this);
	}
};

/**
 * 生成字体名称文本
 * Creates the font name text.
 *
 * @private
 * @method _makeFontNameText
 * @return {String} 字体名称文本 / The font name text
 */
Bitmap.prototype._makeFontNameText = function () {
	return (this.fontItalic ? "Italic " : "") + this.fontSize + "px " + this.fontFace;
};

/**
 * 绘制文字轮廓
 * Draws the text outline.
 *
 * @private
 * @method _drawTextOutline
 * @param {String} text - 文字内容 / The text content
 * @param {Number} tx - x坐标 / The x coordinate
 * @param {Number} ty - y坐标 / The y coordinate
 * @param {Number} maxWidth - 最大宽度 / The maximum width
 */
Bitmap.prototype._drawTextOutline = function (text, tx, ty, maxWidth) {
	var context = this._context;
	context.strokeStyle = this.outlineColor;
	context.lineWidth = this.outlineWidth;
	context.lineJoin = "round";
	context.strokeText(text, tx, ty, maxWidth);
};

/**
 * 绘制文字主体
 * Draws the text body.
 *
 * @private
 * @method _drawTextBody
 * @param {String} text - 文字内容 / The text content
 * @param {Number} tx - x坐标 / The x coordinate
 * @param {Number} ty - y坐标 / The y coordinate
 * @param {Number} maxWidth - 最大宽度 / The maximum width
 */
Bitmap.prototype._drawTextBody = function (text, tx, ty, maxWidth) {
	var context = this._context;
	context.fillStyle = this.textColor;
	context.fillText(text, tx, ty, maxWidth);
};

/**
 * 处理加载完成事件
 * Handles the load completion event.
 *
 * @private
 * @method _onLoad
 */
Bitmap.prototype._onLoad = function () {
	this._image.removeEventListener("load", this._loadListener);
	this._image.removeEventListener("error", this._errorListener);

	this._renewCanvas();

	switch (this._loadingState) {
		case "requesting":
			this._loadingState = "requestCompleted";
			if (this._decodeAfterRequest) {
				this.decode();
			} else {
				this._loadingState = "purged";
				this._clearImgInstance();
			}
			break;

		case "decrypting":
			window.URL.revokeObjectURL(this._image.src);
			this._loadingState = "decryptCompleted";
			if (this._decodeAfterRequest) {
				this.decode();
			} else {
				this._loadingState = "purged";
				this._clearImgInstance();
			}
			break;
	}
};

/**
 * 解码位图数据
 * Decodes the bitmap data.
 *
 * @method decode
 */
Bitmap.prototype.decode = function () {
	switch (this._loadingState) {
		case "requestCompleted":
		case "decryptCompleted":
			this._loadingState = "loaded";

			if (!this.__canvas) this._createBaseTexture(this._image);
			this._setDirty();
			this._callLoadListeners();
			break;

		case "requesting":
		case "decrypting":
			this._decodeAfterRequest = true;
			if (!this._loader) {
				this._loader = ResourceHandler.createLoader(
					this._url,
					this._requestImage.bind(this, this._url),
					this._onError.bind(this),
				);
				this._image.removeEventListener("error", this._errorListener);
				this._image.addEventListener("error", (this._errorListener = this._loader));
			}
			break;

		case "pending":
		case "purged":
		case "error":
			this._decodeAfterRequest = true;
			this._requestImage(this._url);
			break;
	}
};

/**
 * 调用加载监听器
 * Calls all load listeners.
 *
 * @private
 * @method _callLoadListeners
 */
Bitmap.prototype._callLoadListeners = function () {
	while (this._loadListeners.length > 0) {
		var listener = this._loadListeners.shift();
		listener(this);
	}
};

/**
 * 处理加载错误事件
 * Handles the load error event.
 *
 * @private
 * @method _onError
 */
Bitmap.prototype._onError = function () {
	this._image.removeEventListener("load", this._loadListener);
	this._image.removeEventListener("error", this._errorListener);
	this._loadingState = "error";
};

/**
 * 设置为脏状态
 * Sets the bitmap as dirty.
 *
 * @private
 * @method _setDirty
 */
Bitmap.prototype._setDirty = function () {
	this._dirty = true;
};

/**
 * 如果位图为脏状态则更新纹理
 * Updates texture if bitmap was dirty.
 *
 * @method checkDirty
 */
Bitmap.prototype.checkDirty = function () {
	if (this._dirty) {
		this._baseTexture.update();
		this._dirty = false;
	}
};

/**
 * 请求位图资源
 * Requests a bitmap resource.
 *
 * @static
 * @method request
 * @param {String} url - 要请求的URL / The URL to request
 * @return {Bitmap} 新的位图对象 / New bitmap object
 */
Bitmap.request = function (url) {
	var bitmap = Object.create(Bitmap.prototype);
	bitmap._defer = true;
	bitmap.initialize();

	bitmap._url = url;
	bitmap._loadingState = "pending";

	return bitmap;
};

/**
 * 请求图像数据
 * Requests image data.
 *
 * @private
 * @method _requestImage
 * @param {String} url - 图像URL / The image URL
 */
Bitmap.prototype._requestImage = function (url) {
	if (Bitmap._reuseImages.length !== 0) {
		this._image = Bitmap._reuseImages.pop();
	} else {
		this._image = new Image();
	}

	if (this._decodeAfterRequest && !this._loader) {
		this._loader = ResourceHandler.createLoader(url, this._requestImage.bind(this, url), this._onError.bind(this));
	}

	this._image = new Image();
	this._url = url;
	this._loadingState = "requesting";

	if (!Decrypter.checkImgIgnore(url) && Decrypter.hasEncryptedImages) {
		this._loadingState = "decrypting";
		Decrypter.decryptImg(url, this);
	} else {
		this._image.src = url;

		this._image.addEventListener("load", (this._loadListener = Bitmap.prototype._onLoad.bind(this)));
		this._image.addEventListener("error", (this._errorListener = this._loader || Bitmap.prototype._onError.bind(this)));
	}
};

/**
 * 检查是否仅为请求状态
 * Checks if the bitmap is request-only.
 *
 * @method isRequestOnly
 * @return {Boolean} 是否仅为请求状态 / Whether the bitmap is request-only
 */
Bitmap.prototype.isRequestOnly = function () {
	return !(this._decodeAfterRequest || this.isReady());
};

/**
 * 检查请求是否准备就绪
 * Checks if the request is ready.
 *
 * @method isRequestReady
 * @return {Boolean} 请求是否准备就绪 / Whether the request is ready
 */
Bitmap.prototype.isRequestReady = function () {
	return this._loadingState !== "pending" && this._loadingState !== "requesting" && this._loadingState !== "decrypting";
};

/**
 * 开始请求操作
 * Starts the request operation.
 *
 * @method startRequest
 */
Bitmap.prototype.startRequest = function () {
	if (this._loadingState === "pending") {
		this._decodeAfterRequest = false;
		this._requestImage(this._url);
	}
};
