/**
 * 用于管理异步请求的请求队列类。
 * The request queue class for managing asynchronous requests.
 *
 * @class RequestQueue
 * @constructor
 */
function RequestQueue() {
	this.initialize.apply(this, arguments);
}

/**
 * 初始化请求队列。
 * Initialize the request queue.
 *
 * @method initialize
 */
RequestQueue.prototype.initialize = function () {
	this._queue = [];
};

/**
 * 将请求加入队列。
 * Enqueues a request.
 *
 * @method enqueue
 * @param {String} key 请求键 The request key
 * @param {Object} value 请求值 The request value
 */
RequestQueue.prototype.enqueue = function (key, value) {
	this._queue.push({
		key: key,
		value: value,
	});
};

/**
 * 更新请求队列，顺序处理请求。
 * Updates the request queue, processing requests sequentially.
 *
 * @method update
 */
RequestQueue.prototype.update = function () {
	if (this._queue.length === 0) return;

	var top = this._queue[0];
	if (top.value.isRequestReady()) {
		this._queue.shift();
		if (this._queue.length !== 0) {
			this._queue[0].value.startRequest();
		}
	} else {
		top.value.startRequest();
	}
};

/**
 * 通过将请求移动到队列前端来提高其优先级。
 * Raises the priority of a request by moving it to the front of the queue.
 *
 * @method raisePriority
 * @param {String} key 要提高优先级的请求键 The request key to prioritize
 */
RequestQueue.prototype.raisePriority = function (key) {
	for (var n = 0; n < this._queue.length; n++) {
		var item = this._queue[n];
		if (item.key === key) {
			this._queue.splice(n, 1);
			this._queue.unshift(item);
			break;
		}
	}
};

/**
 * 清除队列中的所有请求。
 * Clears all requests from the queue.
 *
 * @method clear
 */
RequestQueue.prototype.clear = function () {
	this._queue.splice(0);
};
