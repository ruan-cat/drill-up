//-----------------------------------------------------------------------------
/**
 * The point class.
 *
 * @class Point
 * @constructor
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 */
function Point() {
    this.initialize.apply(this, arguments);
}

Point.prototype = Object.create(PIXI.Point.prototype);
Point.prototype.constructor = Point;

/**
 * Initialize the point.
 * 初始化点。
 *
 * @method initialize
 * @param {Number} x - The x coordinate
 * @param {Number} y - The y coordinate
 */
Point.prototype.initialize = function(x, y) {
    PIXI.Point.call(this, x, y);
};

/**
 * The x coordinate.
 *
 * @property x
 * @type Number
 */

/**
 * The y coordinate.
 *
 * @property y
 * @type Number
 */