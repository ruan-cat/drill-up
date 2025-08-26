//=============================================================================
// Stage.js
//=============================================================================

/**
 * 显示树的根对象。
 * The root object of the display tree.
 *
 * @class Stage
 * @extends PIXI.Container
 */
function Stage() {
	this.initialize.apply(this, arguments);
}

Stage.prototype = Object.create(PIXI.Container.prototype);
Stage.prototype.constructor = Stage;

/**
 * 初始化舞台。
 * Initializes the stage.
 *
 * @method initialize
 */
Stage.prototype.initialize = function () {
	PIXI.Container.call(this);

	// The interactive flag causes a memory leak.
	this.interactive = false;
};

/**
 * [只读] 舞台的子对象数组。
 * [read-only] The array of children of the stage.
 *
 * @type {Array}
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
