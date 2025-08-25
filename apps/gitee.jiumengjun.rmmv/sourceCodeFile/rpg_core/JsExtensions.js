//-----------------------------------------------------------------------------
/**
 * 这不是一个类，但包含一些将被添加到标准JavaScript对象中的方法。
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 *
 * @class JsExtensions
 */
function JsExtensions() {
	throw new Error("This is not a class");
}

/**
 * 返回一个值被限制在给定范围内的数字。
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min 下边界 The lower boundary
 * @param {Number} max 上边界 The upper boundary
 * @return {Number} 范围内的数字 A number in the range (min, max)
 */
Number.prototype.clamp = function (min, max) {
	return Math.min(Math.max(this, min), max);
};

/**
 * 返回一个始终为正数的模运算值。
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n 除数 The divisor
 * @return {Number} 模运算值 A modulo value
 */
Number.prototype.mod = function (n) {
	return ((this % n) + n) % n;
};

/**
 * 将字符串中的 %1、%2 等替换为参数。
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args 用于格式化的对象 The objects to format
 * @return {String} 格式化后的字符串 A formatted string
 */
String.prototype.format = function () {
	var args = arguments;
	return this.replace(/%([0-9]+)/g, function (s, n) {
		return args[Number(n) - 1];
	});
};

/**
 * 生成带前导零的数字字符串。
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length 输出字符串的长度 The length of the output string
 * @return {String} 带前导零的字符串 A string with leading zeros
 */
String.prototype.padZero = function (length) {
	var s = this;
	while (s.length < length) {
		s = "0" + s;
	}
	return s;
};

/**
 * 生成带前导零的数字字符串。
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length 输出字符串的长度 The length of the output string
 * @return {String} 带前导零的字符串 A string with leading zeros
 */
Number.prototype.padZero = function (length) {
	return String(this).padZero(length);
};

Object.defineProperties(Array.prototype, {
	/**
	 * 检查两个数组是否相同。
	 * Checks whether the two arrays are same.
	 *
	 * @method Array.prototype.equals
	 * @param {Array} array 要比较的数组 The array to compare to
	 * @return {Boolean} 如果两个数组相同则返回true True if the two arrays are same
	 */
	equals: {
		enumerable: false,
		value: function (array) {
			if (!array || this.length !== array.length) {
				return false;
			}
			for (var i = 0; i < this.length; i++) {
				if (this[i] instanceof Array && array[i] instanceof Array) {
					if (!this[i].equals(array[i])) {
						return false;
					}
				} else if (this[i] !== array[i]) {
					return false;
				}
			}
			return true;
		},
	},
	/**
	 * 创建数组的浅层副本。
	 * Makes a shallow copy of the array.
	 *
	 * @method Array.prototype.clone
	 * @return {Array} 数组的浅层副本 A shallow copy of the array
	 */
	clone: {
		enumerable: false,
		value: function () {
			return this.slice(0);
		},
	},
	/**
	 * 检查数组是否包含给定的元素。
	 * Checks whether the array contains a given element.
	 *
	 * @method Array.prototype.contains
	 * @param {Any} element 要搜索的元素 The element to search for
	 * @return {Boolean} 如果数组包含该元素则返回true True if the array contains a given element
	 */
	contains: {
		enumerable: false,
		value: function (element) {
			return this.indexOf(element) >= 0;
		},
	},
});

/**
 * 检查字符串是否包含给定的字符串。
 * Checks whether the string contains a given string.
 *
 * @method String.prototype.contains
 * @param {String} string 要搜索的字符串 The string to search for
 * @return {Boolean} 如果字符串包含该字符串则返回true True if the string contains a given string
 */
String.prototype.contains = function (string) {
	return this.indexOf(string) >= 0;
};

/**
 * 生成一个在范围 (0, max-1) 内的随机整数。
 * Generates a random integer in the range (0, max-1).
 *
 * @static
 * @method Math.randomInt
 * @param {Number} max 上边界（不包含） The upper boundary (excluded)
 * @return {Number} 随机整数 A random integer
 */
Math.randomInt = function (max) {
	return Math.floor(max * Math.random());
};
