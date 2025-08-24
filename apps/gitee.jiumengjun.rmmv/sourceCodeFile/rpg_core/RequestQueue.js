/**
 * The request queue class for managing asynchronous requests.
 * 用于管理异步请求的请求队列类。
 *
 * @class RequestQueue
 * @constructor
 */
function RequestQueue(){
    this.initialize.apply(this, arguments);
}

/**
 * Initialize the request queue.
 * 初始化请求队列。
 *
 * @method initialize
 */
RequestQueue.prototype.initialize = function(){
    this._queue = [];
};

/**
 * Enqueues a request.
 * 将请求加入队列。
 *
 * @method enqueue
 * @param {String} key - The request key
 * @param {Object} value - The request value
 */
RequestQueue.prototype.enqueue = function(key, value){
    this._queue.push({
        key: key,
        value: value,
    });
};

/**
 * Updates the request queue, processing requests sequentially.
 * 更新请求队列，顺序处理请求。
 *
 * @method update
 */
RequestQueue.prototype.update = function(){
    if(this._queue.length === 0) return;

    var top = this._queue[0];
    if(top.value.isRequestReady()){
        this._queue.shift();
        if(this._queue.length !== 0){
            this._queue[0].value.startRequest();
        }
    }else{
        top.value.startRequest();
    }
};

/**
 * Raises the priority of a request by moving it to the front of the queue.
 * 通过将请求移动到队列前端来提高其优先级。
 *
 * @method raisePriority
 * @param {String} key - The request key to prioritize
 */
RequestQueue.prototype.raisePriority = function(key){
    for(var n = 0; n < this._queue.length; n++){
        var item = this._queue[n];
        if(item.key === key){
            this._queue.splice(n, 1);
            this._queue.unshift(item);
            break;
        }
    }
};

/**
 * Clears all requests from the queue.
 * 清除队列中的所有请求。
 *
 * @method clear
 */
RequestQueue.prototype.clear = function(){
    this._queue.splice(0);
};