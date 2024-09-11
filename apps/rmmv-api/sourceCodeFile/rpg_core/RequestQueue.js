
/**
 * @classdesc 
 * 需求队列类 这是一个典型的数据结构——队列，在rpg_core.js v1.6.2中出现，
 * 目前仅在 ImageManager._requestQueue = new RequestQueue(); 语句上被使用。
 * 
 * 该类仅仅被设计用于管理ImageManager类的数据。
 * 
 * @author 翻译注释作者：阮中楠
 */

 /**
  * @description
  * 构造方法，该类并没有从其他类继承下来。
  */
function RequestQueue(){
    this.initialize.apply(this, arguments);
}

/**
 * @description
 * 初始化方法。该方法给类定义了一个队列。
 */
RequestQueue.prototype.initialize = function(){
    this._queue = [];
};

/**
 * @description
 * 队列的入队方法。
 * 
 * @param {*} key 
 * @param {*} value 
 */
RequestQueue.prototype.enqueue = function(key, value){
    this._queue.push({
        key: key,
        value: value,
    });
};

/**
 * @description
 * 队列的刷新方法。
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

RequestQueue.prototype.clear = function(){
    this._queue.splice(0);
};