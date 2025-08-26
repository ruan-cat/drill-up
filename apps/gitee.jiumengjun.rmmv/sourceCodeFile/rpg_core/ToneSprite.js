//=============================================================================
// ToneSprite.js
//=============================================================================

/**
 * 在2D canvas模式下改变屏幕颜色的精灵。
 * The sprite which changes the screen color in 2D canvas mode.
 *
 * @class ToneSprite
 * @extends PIXI.Container
 */
function ToneSprite() {
	this.initialize.apply(this, arguments);
}

ToneSprite.prototype = Object.create(PIXI.Container.prototype);
ToneSprite.prototype.constructor = ToneSprite;

/**
 * 初始化色调精灵。
 * Initializes the tone sprite.
 *
 * @method initialize
 */
ToneSprite.prototype.initialize = function () {
	PIXI.Container.call(this);
	this.clear();
};

/**
 * 清除色调。
 * Clears the tone.
 *
 * @method clear
 */
ToneSprite.prototype.clear = function () {
	this._red = 0;
	this._green = 0;
	this._blue = 0;
	this._gray = 0;
};

/**
 * 设置色调。
 * Sets the tone.
 *
 * @method setTone
 * @param {Number} r 红色强度，范围(-255, 255) The red strength in the range (-255, 255)
 * @param {Number} g 绿色强度，范围(-255, 255) The green strength in the range (-255, 255)
 * @param {Number} b 蓝色强度，范围(-255, 255) The blue strength in the range (-255, 255)
 * @param {Number} gray 灰度级别，范围(0, 255) The grayscale level in the range (0, 255)
 */
ToneSprite.prototype.setTone = function (r, g, b, gray) {
	this._red = Math.round(r || 0).clamp(-255, 255);
	this._green = Math.round(g || 0).clamp(-255, 255);
	this._blue = Math.round(b || 0).clamp(-255, 255);
	this._gray = Math.round(gray || 0).clamp(0, 255);
};

/**
 * Canvas渲染色调精灵。
 * Renders the tone sprite with Canvas.
 *
 * @method _renderCanvas
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
ToneSprite.prototype._renderCanvas = function (renderer) {
	if (this.visible) {
		var context = renderer.context;
		var t = this.worldTransform;
		var r = renderer.resolution;
		var width = Graphics.width;
		var height = Graphics.height;
		context.save();
		context.setTransform(t.a, t.b, t.c, t.d, t.tx * r, t.ty * r);
		if (Graphics.canUseSaturationBlend() && this._gray > 0) {
			context.globalCompositeOperation = "saturation";
			context.globalAlpha = this._gray / 255;
			context.fillStyle = "#ffffff";
			context.fillRect(0, 0, width, height);
		}
		context.globalAlpha = 1;
		var r1 = Math.max(0, this._red);
		var g1 = Math.max(0, this._green);
		var b1 = Math.max(0, this._blue);
		if (r1 || g1 || b1) {
			context.globalCompositeOperation = "lighter";
			context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
			context.fillRect(0, 0, width, height);
		}
		if (Graphics.canUseDifferenceBlend()) {
			var r2 = Math.max(0, -this._red);
			var g2 = Math.max(0, -this._green);
			var b2 = Math.max(0, -this._blue);
			if (r2 || g2 || b2) {
				context.globalCompositeOperation = "difference";
				context.fillStyle = "#ffffff";
				context.fillRect(0, 0, width, height);
				context.globalCompositeOperation = "lighter";
				context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
				context.fillRect(0, 0, width, height);
				context.globalCompositeOperation = "difference";
				context.fillStyle = "#ffffff";
				context.fillRect(0, 0, width, height);
			}
		}
		context.restore();
	}
};

/**
 * WebGL渲染色调精灵（不支持）。
 * Renders the tone sprite with WebGL (not supported).
 *
 * @method _renderWebGL
 * @param {Object} renderer 渲染器 The renderer
 * @private
 */
ToneSprite.prototype._renderWebGL = function (renderer) {
	// Not supported
};

//-----------------------------------------------------------------------------
