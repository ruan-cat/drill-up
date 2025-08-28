//=============================================================================
// ScreenSprite.js
//=============================================================================

/**
 * 覆盖整个游戏屏幕的精灵。
 * The sprite which covers the entire game screen.
 *
 * @class ScreenSprite
 * @constructor
 */
function ScreenSprite() {
	this.initialize.apply(this, arguments);
}

ScreenSprite.prototype = Object.create(PIXI.Container.prototype);
ScreenSprite.prototype.constructor = ScreenSprite;

/**
 * 初始化屏幕精灵。
 * Initializes the screen sprite.
 *
 * @method initialize
 */
ScreenSprite.prototype.initialize = function () {
	PIXI.Container.call(this);

	this._graphics = new PIXI.Graphics();
	this.addChild(this._graphics);
	this.opacity = 0;

	this._red = -1;
	this._green = -1;
	this._blue = -1;
	this._colorText = "";
	this.setBlack();
};

/**
 * 精灵的不透明度（0到255）。
 * The opacity of the sprite (0 to 255).
 *
 * @property opacity
 * @type Number
 */
Object.defineProperty(ScreenSprite.prototype, "opacity", {
	get: function () {
		return this.alpha * 255;
	},
	set: function (value) {
		this.alpha = value.clamp(0, 255) / 255;
	},
	configurable: true,
});

/**
 * YEP警告标志。
 * YEP warning flag.
 *
 * @static
 * @property YEPWarned
 * @type Boolean
 * @private
 */
ScreenSprite.YEPWarned = false;

/**
 * 显示YEP弃用警告。
 * Shows YEP deprecation warning.
 *
 * @static
 * @method warnYep
 * @private
 */
ScreenSprite.warnYep = function () {
	if (!ScreenSprite.YEPWarned) {
		console.log(
			"Deprecation warning. Please update YEP_CoreEngine. ScreenSprite is not a sprite, it has graphics inside.",
		);
		ScreenSprite.YEPWarned = true;
	}
};

/**
 * 精灵的锚点（对YEP引擎兼容）。
 * The anchor of the sprite (for YEP engine compatibility).
 *
 * @property anchor
 * @type Object
 */
Object.defineProperty(ScreenSprite.prototype, "anchor", {
	get: function () {
		ScreenSprite.warnYep();
		this.scale.x = 1;
		this.scale.y = 1;
		return { x: 0, y: 0 };
	},
	set: function (value) {
		this.alpha = value.clamp(0, 255) / 255;
	},
	configurable: true,
});

/**
 * 精灵的混合模式。
 * The blend mode of the sprite.
 *
 * @property blendMode
 * @type Number
 */
Object.defineProperty(ScreenSprite.prototype, "blendMode", {
	get: function () {
		return this._graphics.blendMode;
	},
	set: function (value) {
		this._graphics.blendMode = value;
	},
	configurable: true,
});

/**
 * 将屏幕精灵的颜色设置为黑色。
 * Sets black to the color of the screen sprite.
 *
 * @method setBlack
 */
ScreenSprite.prototype.setBlack = function () {
	this.setColor(0, 0, 0);
};

/**
 * 将屏幕精灵的颜色设置为白色。
 * Sets white to the color of the screen sprite.
 *
 * @method setWhite
 */
ScreenSprite.prototype.setWhite = function () {
	this.setColor(255, 255, 255);
};

/**
 * 通过数值设置屏幕精灵的颜色。
 * Sets the color of the screen sprite by values.
 *
 * @method setColor
 * @param {Number} r 红色值（范围0-255） The red value in the range (0, 255)
 * @param {Number} g 绿色值（范围0-255） The green value in the range (0, 255)
 * @param {Number} b 蓝色值（范围0-255） The blue value in the range (0, 255)
 */
ScreenSprite.prototype.setColor = function (r, g, b) {
	if (this._red !== r || this._green !== g || this._blue !== b) {
		r = Math.round(r || 0).clamp(0, 255);
		g = Math.round(g || 0).clamp(0, 255);
		b = Math.round(b || 0).clamp(0, 255);
		this._red = r;
		this._green = g;
		this._blue = b;
		this._colorText = Utils.rgbToCssColor(r, g, b);

		var graphics = this._graphics;
		graphics.clear();
		var intColor = (r << 16) | (g << 8) | b;
		graphics.beginFill(intColor, 1);
		// 带缩放的全屏幕 / whole screen with zoom
		graphics.drawRect(-Graphics.width * 5, -Graphics.height * 5, Graphics.width * 10, Graphics.height * 10);
	}
};

//-----------------------------------------------------------------------------
