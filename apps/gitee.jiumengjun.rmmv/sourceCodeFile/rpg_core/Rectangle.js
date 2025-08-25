//=============================================================================
// Rectangle.js
//=============================================================================

/**
 * 矩形类，用于表示二维平面上的矩形区域
 * The rectangle class.
 *
 * @class Rectangle
 * @constructor
 * @param {Number} x 左上角的x坐标 - The x coordinate for the upper-left corner
 * @param {Number} y 左上角的y坐标 - The y coordinate for the upper-left corner
 * @param {Number} width 矩形的宽度 - The width of the rectangle
 * @param {Number} height 矩形的高度 - The height of the rectangle
 */
function Rectangle() {
	this.initialize.apply(this, arguments);
}

Rectangle.prototype = Object.create(PIXI.Rectangle.prototype);
Rectangle.prototype.constructor = Rectangle;

/**
 * 初始化矩形
 * Initialize the rectangle.
 *
 * @method initialize
 * @param {Number} x 左上角的x坐标 - The x coordinate for the upper-left corner
 * @param {Number} y 左上角的y坐标 - The y coordinate for the upper-left corner
 * @param {Number} width 矩形的宽度 - The width of the rectangle
 * @param {Number} height 矩形的高度 - The height of the rectangle
 */
Rectangle.prototype.initialize = function (x, y, width, height) {
	PIXI.Rectangle.call(this, x, y, width, height);
};

/**
 * 空矩形静态属性，表示0尺寸的矩形
 * Static empty rectangle property.
 *
 * @static
 * @property {Rectangle} emptyRectangle 空矩形实例 - Empty rectangle instance
 * @private
 */
Rectangle.emptyRectangle = new Rectangle(0, 0, 0, 0);

/**
 * 左上角的x坐标
 * The x coordinate for the upper-left corner.
 *
 * @property {Number} x x坐标 - x coordinate
 */

/**
 * 左上角的y坐标
 * The y coordinate for the upper-left corner.
 *
 * @property {Number} y y坐标 - y coordinate
 */

/**
 * 矩形的宽度
 * The width of the rectangle.
 *
 * @property {Number} width 宽度 - width
 */

/**
 * 矩形的高度
 * The height of the rectangle.
 *
 * @property {Number} height 高度 - height
 */

//-----------------------------------------------------------------------------
