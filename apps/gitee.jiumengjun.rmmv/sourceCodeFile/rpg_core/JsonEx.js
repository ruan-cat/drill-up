//=============================================================================
// JsonEx.js
//=============================================================================

/**
 * 处理带有对象信息的JSON的静态类。
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
function JsonEx() {
	throw new Error("This is a static class");
}

/**
 * 对象的最大深度。
 * The maximum depth of objects.
 *
 * @static
 * @property maxDepth
 * @type Number
 * @default 100
 */
JsonEx.maxDepth = 100;

JsonEx._id = 1;
/**
 * 生成唯一ID。
 * Generates a unique ID.
 *
 * @static
 * @method _generateId
 * @return {Number} 唯一ID Unique ID
 * @private
 */
JsonEx._generateId = function () {
	return JsonEx._id++;
};

/**
 * 将对象转换为带有对象信息的JSON字符串。
 * Converts an object to a JSON string with object information.
 *
 * @static
 * @method stringify
 * @param {Object} object 要转换的对象 The object to be converted
 * @return {String} JSON字符串 The JSON string
 */
JsonEx.stringify = function (object) {
	var circular = [];
	JsonEx._id = 1;
	var json = JSON.stringify(this._encode(object, circular, 0));
	this._cleanMetadata(object);
	this._restoreCircularReference(circular);

	return json;
};

JsonEx._restoreCircularReference = function (circulars) {
	circulars.forEach(function (circular) {
		var key = circular[0];
		var value = circular[1];
		var content = circular[2];

		value[key] = content;
	});
};

/**
 * 解析JSON字符串并重构相应的对象。
 * Parses a JSON string and reconstructs the corresponding object.
 *
 * @static
 * @method parse
 * @param {String} json JSON字符串 The JSON string
 * @return {Object} 重构的对象 The reconstructed object
 */
JsonEx.parse = function (json) {
	var circular = [];
	var registry = {};
	var contents = this._decode(JSON.parse(json), circular, registry);
	this._cleanMetadata(contents);
	this._linkCircularReference(contents, circular, registry);

	return contents;
};

JsonEx._linkCircularReference = function (contents, circulars, registry) {
	circulars.forEach(function (circular) {
		var key = circular[0];
		var value = circular[1];
		var id = circular[2];

		value[key] = registry[id];
	});
};

JsonEx._cleanMetadata = function (object) {
	if (!object) return;

	delete object["@"];
	delete object["@c"];

	if (typeof object === "object") {
		Object.keys(object).forEach(function (key) {
			var value = object[key];
			if (typeof value === "object") {
				JsonEx._cleanMetadata(value);
			}
		});
	}
};

/**
 * 创建指定对象的深度副本。
 * Makes a deep copy of the specified object.
 *
 * @static
 * @method makeDeepCopy
 * @param {Object} object 要复制的对象 The object to be copied
 * @return {Object} 复制的对象 The copied object
 */
JsonEx.makeDeepCopy = function (object) {
	return this.parse(this.stringify(object));
};

/**
 * 编码对象以便进行JSON序列化。
 * Encodes an object for JSON serialization.
 *
 * @static
 * @method _encode
 * @param {Object} value 要编码的值 The value to encode
 * @param {Array} circular 循环引用数组 Array for circular references
 * @param {Number} depth 当前深度 Current depth
 * @return {Object} 编码后的对象 The encoded object
 * @private
 */
JsonEx._encode = function (value, circular, depth) {
	depth = depth || 0;
	if (++depth >= this.maxDepth) {
		throw new Error("Object too deep");
	}
	var type = Object.prototype.toString.call(value);
	if (type === "[object Object]" || type === "[object Array]") {
		value["@c"] = JsonEx._generateId();

		var constructorName = this._getConstructorName(value);
		if (constructorName !== "Object" && constructorName !== "Array") {
			value["@"] = constructorName;
		}
		for (var key in value) {
			if (value.hasOwnProperty(key) && !key.match(/^@./)) {
				if (value[key] && typeof value[key] === "object") {
					if (value[key]["@c"]) {
						circular.push([key, value, value[key]]);
						value[key] = { "@r": value[key]["@c"] };
					} else {
						value[key] = this._encode(value[key], circular, depth + 1);

						if (value[key] instanceof Array) {
							// 包装数组
							// wrap array
							circular.push([key, value, value[key]]);

							value[key] = {
								"@c": value[key]["@c"],
								"@a": value[key],
							};
						}
					}
				} else {
					value[key] = this._encode(value[key], circular, depth + 1);
				}
			}
		}
	}
	depth--;
	return value;
};

/**
 * 解码JSON对象以重构原始对象。
 * Decodes a JSON object to reconstruct the original object.
 *
 * @static
 * @method _decode
 * @param {Object} value 要解码的值 The value to decode
 * @param {Array} circular 循环引用数组 Array for circular references
 * @param {Object} registry 对象注册表 Object registry
 * @return {Object} 解码后的对象 The decoded object
 * @private
 */
JsonEx._decode = function (value, circular, registry) {
	var type = Object.prototype.toString.call(value);
	if (type === "[object Object]" || type === "[object Array]") {
		registry[value["@c"]] = value;

		if (value["@"]) {
			var constructor = window[value["@"]];
			if (constructor) {
				value = this._resetPrototype(value, constructor.prototype);
			}
		}
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				if (value[key] && value[key]["@a"]) {
					// 对象是数组包装器
				// object is array wrapper
					var body = value[key]["@a"];
					body["@c"] = value[key]["@c"];
					value[key] = body;
				}
				if (value[key] && value[key]["@r"]) {
					// 对象是引用
				// object is reference
					circular.push([key, value, value[key]["@r"]]);
				}
				value[key] = this._decode(value[key], circular, registry);
			}
		}
	}
	return value;
};

/**
 * 获取对象构造函数的名称。
 * Gets the name of the object's constructor.
 *
 * @static
 * @method _getConstructorName
 * @param {Object} value 对象 The object
 * @return {String} 构造函数名称 The constructor name
 * @private
 */
JsonEx._getConstructorName = function (value) {
	var name = value.constructor.name;
	if (name === undefined) {
		var func = /^\s*function\s*([A-Za-z0-9_$]*)/;
		name = func.exec(value.constructor)[1];
	}
	return name;
};

/**
 * 重置对象的原型。
 * Resets the prototype of an object.
 *
 * @static
 * @method _resetPrototype
 * @param {Object} value 对象 The object
 * @param {Object} prototype 新原型 The new prototype
 * @return {Object} 重置原型后的对象 The object with reset prototype
 * @private
 */
JsonEx._resetPrototype = function (value, prototype) {
	if (Object.setPrototypeOf !== undefined) {
		Object.setPrototypeOf(value, prototype);
	} else if ("__proto__" in value) {
		value.__proto__ = prototype;
	} else {
		var newValue = Object.create(prototype);
		for (var key in value) {
			if (value.hasOwnProperty(key)) {
				newValue[key] = value[key];
			}
		}
		value = newValue;
	}
	return value;
};
