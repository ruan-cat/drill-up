
//-----------------------------------------------------------------------------
// Window_Command
// 窗口命令
// The superclass of windows for selecting a command.
// 窗口选择命令的超级类

function Window_Command() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_Command.prototype = Object.create(Window_Selectable.prototype);
//设置创造者
Window_Command.prototype.constructor = Window_Command;
//初始化
Window_Command.prototype.initialize = function(x, y) {
    //清除命令列表
    this.clearCommandList();
    //建造命令列表
    this.makeCommandList();
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    //这个内容负责将全体列表的内容输出。
    this.refresh();
    //暂时感受不出来该语句的作用。
    this.select(0);
    //这个内容负责让列表变得可以移动。
    this.activate();
};

//窗口宽
Window_Command.prototype.windowWidth = function() {
    return 240;
};
//窗口高
Window_Command.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};
//可见行数
Window_Command.prototype.numVisibleRows = function() {
    return Math.ceil(this.maxItems() / this.maxCols());
};
//最大项目数
Window_Command.prototype.maxItems = function() {
    return this._list.length;
};

/**
 * @description
 * 清除命令列表。
 * 
 * _list变量被首次定义与此方法。这是一个数组。被认为是：清除命令列表。可以猜想：_list数组是一个命令列表。
 * 
 * 这个命令列表怎么被赋值的？
 */
Window_Command.prototype.clearCommandList = function() {
    this._list = [];
};



//制作命令列表
Window_Command.prototype.makeCommandList = function() {
};
//
/**
 * @description
 * 添加命令。_list命令列表数组 在这里首次被赋值。可以猜想，这个方法的本质是设置_list数组。
 * 
 * 主调方法：多个。均在Window_MenuCommand类内部，这个类还是Window_Command的子类。
 * 
 * addCommand方法为_list命令列表数组添加具体的命令。
 * 
 * @param {*} name 
 * @param {*} symbol 
 * @param {*} enabled 
 * @param {*} ext 
 */
Window_Command.prototype.addCommand = function(name, symbol, enabled, ext) {
    if (enabled === undefined) {
        enabled = true;
    }
    if (ext === undefined) {
        ext = null;
    }
    //将一个对象添加到 命令列表数组 内。这个对象是谁？
    this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext});
};



//命令名
Window_Command.prototype.commandName = function(index) {
    return this._list[index].name;
};
//命令标记
Window_Command.prototype.commandSymbol = function(index) {
    return this._list[index].symbol;
};
//是命令允许
Window_Command.prototype.isCommandEnabled = function(index) {
    return this._list[index].enabled;
};




/**
 * @description
 * 当前数据。
 * 
 * 主调方法：多个。
 * 
 * 想要了解本方法，关键在于：
 * 
 * this.index()是什么？是Window_Selectable.prototype.index方法。本质是Window_Selectable._index。
 * 是一个整形数据。
 * 
 * this._list[this.index()]是什么？先要搞清楚什么是_list数组。
 * 
 * 现在暂且给出这个方法的功能描述：返回当前索引值所指向的 命令列表数组 的元素，这个元素是一个对象。
 */
Window_Command.prototype.currentData = function() {
    return this.index() >= 0 ? this._list[this.index()] : null;
};
//是当前项目允许
Window_Command.prototype.isCurrentItemEnabled = function() {
    return this.currentData() ? this.currentData().enabled : false;
};
/**
 * @description
 * 当前标记。
 * 
 * 主调方法：Window_Command.prototype.callOkHandler
 * @returns 当前的索引。
 */
Window_Command.prototype.currentSymbol = function() {
    return this.currentData() ? this.currentData().symbol : null;
};
//当前提取
Window_Command.prototype.currentExt = function() {
    return this.currentData() ? this.currentData().ext : null;
};
//寻找标记
Window_Command.prototype.findSymbol = function(symbol) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].symbol === symbol) {
            return i;
        }
    }
    return -1;
};
//选择标记
Window_Command.prototype.selectSymbol = function(symbol) {
    var index = this.findSymbol(symbol);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};
//寻找提取
Window_Command.prototype.findExt = function(ext) {
    for (var i = 0; i < this._list.length; i++) {
        if (this._list[i].ext === ext) {
            return i;
        }
    }
    return -1;
};
//选择提取
Window_Command.prototype.selectExt = function(ext) {
    var index = this.findExt(ext);
    if (index >= 0) {
        this.select(index);
    } else {
        this.select(0);
    }
};

//绘制项目
/**
 * @description
 * 主调方法：Window_Selectable.prototype.drawAllItems
 * 
 * 这个方法确切来说，是重写了方法。
 * 
 * 是父类的代码调用他。
 * @param {*} index 
 */
Window_Command.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    //Window_Base.prototype.resetTextColor
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
//项目文本排列
Window_Command.prototype.itemTextAlign = function() {
    return 'left';
};
//是确定允许
Window_Command.prototype.isOkEnabled = function() {
    return true;
};



/**
 * @description
 * 主调方法：
 * 
 * 这个方法的本质是重写Window_Selectable.prototype.callOkHandler。然后调用此方法，开始具体的执行。
 * 
 * 看看从这个方法，能不能调用到 callHandler 方法。
 * 
 * 通过调试，发现很多场景类都会默认地编写关于ok字段的导向代码。换句话说，只要有场景类将ok字段与一个方法对应，
 * 就会执行其对应的代码。
 * 
 * 这个方法是用来调用其对应的方法的。
 */
Window_Command.prototype.callOkHandler = function() {
    //找到当前的方法数组的索引。找到关键的symbol字符串。
    var symbol = this.currentSymbol();
    if (this.isHandled(symbol)) {
        // 呼叫 "执行句柄方法"。
        this.callHandler(symbol);
    } else if (this.isHandled('ok')) {
        Window_Selectable.prototype.callOkHandler.call(this);
    } else {
        this.activate();
    }
};




Window_Command.prototype.refresh = function() {
    this.clearCommandList();
    this.makeCommandList();
    this.createContents();
    Window_Selectable.prototype.refresh.call(this);
};
