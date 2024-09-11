


/**
 * @classdesc
 * Window_MapName
 * 窗口地图名称
 * The window for displaying the map name on the map screen.
 * 地图画面显示地图名称的窗口
 * 
 * @author 阮中楠（JSDoc注释翻译作者）
 * 
 * @description
 * 这个类的背景画图是画在_windowContentsSprite上，即contents
 * 故控制其是或否长期显现的算法就是控制contentsOpacity，其刷新算法也是控制这个变量。
 */
function Window_MapName() {
    this.initialize.apply(this, arguments);
}

//设置原形 
Window_MapName.prototype = Object.create(Window_Base.prototype);
//设置创造者
Window_MapName.prototype.constructor = Window_MapName;

/**
 * 初始化
 * @description
 * this._showCount = 0; _showCount的含义，目前猜测是用来控制窗口淡入淡出时间的变量。
 */
Window_MapName.prototype.initialize = function() {
    var wight = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, wight, height);
    
    /**
     * @description
     * 这个变量使得窗口没有窗口皮肤和背景。
     * 这个变量的本质是opacity变量的本质是 _windowSpriteContainer.alpha 
     * 窗口精灵容器的透明度。只要修改了opacity的值，就修改了窗口的框和其背景的透明度
     */
    this.opacity = 0;
    this.contentsOpacity = 0;
    this._showCount = 0;
    this.refresh();
};
//窗口宽
Window_MapName.prototype.windowWidth = function() {
    return 360;
};
//窗口高
Window_MapName.prototype.windowHeight = function() {
    return this.fittingHeight(1);
};


/**
 * @description
 * 这是地图名称文字更新的最核心算法，其本质就是修改contentsOpacity的数值。
 * 
 * 涉及到一个新的东西：_windowContentsSprite
 * 
 * contentsOpacity 的本质是：
 * Window类的 this._windowContentsSprite.alpha 窗口内容精灵的透明度
 * 
 */
Window_MapName.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    if (this._showCount > 0 && $gameMap.isNameDisplayEnabled()) {
        this.updateFadeIn();
        this._showCount--;
    } else {
        this.updateFadeOut();
    }
};
//更新淡入
Window_MapName.prototype.updateFadeIn = function() {
    this.contentsOpacity += 16;
};
//更新淡出
Window_MapName.prototype.updateFadeOut = function() {
    this.contentsOpacity -= 16;
};

/**
 * 打开
 * @description
 * 主调方法：
 * 在本文件内找不到主调方法。
 * Scene_Map.prototype.start
 * 这说明了，该窗口在地图切换的时候，被显性地打开了。
 * 
 * 重写方法：Window_Base.prototype.open
 * 
 * 重写的方法并没有去处理_opening、_closing和openness变量的值。也没有回调，而是彻底的重写。
 * 该方法重新刷新了窗口的显示内容，并开始给出计数的值。随后的刷新会让该窗口逐步计数，
 * 逐步下降其显示内容透明度。
 * @override 
 */
Window_MapName.prototype.open = function() {
    this.refresh();
    this._showCount = 150;
};
//关闭
Window_MapName.prototype.close = function() {
    this._showCount = 0;
};


/**
 * @description
 * 刷新
 *  
 * 主调方法： 
 * Window_MapName.prototype.open 
 * Window_MapName.prototype.initialize
 */
Window_MapName.prototype.refresh = function() {
    this.contents.clear();
    if ($gameMap.displayName()) {
        var width = this.contentsWidth();
        /**
         * 先画背景，再画文字。
         * 因为背景和文字的绘制都是在contents绘制，即_windowContentsSprite。
         * 只有这样才能保证内容不会遮挡。
         */
        this.drawBackground(0, 0, width, this.lineHeight());
        this.drawText($gameMap.displayName(), 0, 0, width, 'center');
    }
};

/**
 * @description
 * 绘制背景
 * 
 * 理解：dimColor1(),dimColor2()方法的内容？设置一个rgba的数据。
 * 
 * 主调方法：Window_MapName.prototype.refresh
 * 
 * 这个算法是对窗口的contents，也就是_windowContentsSprite.bitmap进行绘制。
 * 
 * 很奇怪的是，这个方法并不是对背景精灵绘制。
 * 
 * @param {*} x 
 * @param {*} y 
 * @param {*} width 
 * @param {*} height 
 */
Window_MapName.prototype.drawBackground = function(x, y, width, height) {
    var color1 = this.dimColor1();
    var color2 = this.dimColor2();
    this.contents.gradientFillRect(x, y, width / 2, height, color2, color1);
    this.contents.gradientFillRect(x + width / 2, y, width / 2, height, color1, color2);
};
