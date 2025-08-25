//=============================================================================
// Point.js
//=============================================================================

/**
 * 点类
 * The point class.
 *
 * @class Point
 * @classdesc 表示二维坐标点的类
 * @constructor
 * @param {Number} x - X坐标 The x coordinate
 * @param {Number} y - Y坐标 The y coordinate
 */
function Point() {
	this.initialize.apply(this, arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

/**
 * 初始化点对象
 * Initialize the point.
 *
 * @method initialize
 * @param {Number} x - X坐标 The x coordinate
 * @param {Number} y - Y坐标 The y coordinate
 */
Point.prototype.initialize = function (x, y) {
	PIXI.Point.call(this, x, y);
};

/**
 * X坐标
 * The x coordinate.
 *
 * @property x
 * @type Number
 */

/**
 * Y坐标
 * The y coordinate.
 *
 * @property y
 * @type Number
 */

//-----------------------------------------------------------------------------
