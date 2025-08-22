/**
 * @fileoverview SceneManager - 场景管理器
 * @description 管理场景切换的静态类，控制游戏场景的生命周期和转换
 * The static class that manages scene transitions, controls the lifecycle and transitions of game scenes
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * SceneManager - 场景管理器
 * 
 * 管理场景切换的静态类。
 * 负责游戏中不同场景的切换、更新、渲染，以及错误处理和系统初始化。
 * 
 * The static class that manages scene transitions.
 * Responsible for switching, updating, rendering different scenes in the game,
 * as well as error handling and system initialization.
 */
function SceneManager() {
    throw new Error('This is a static class');
}

/**
 * 在 iOS Safari 之外以毫秒为单位获取当前时间
 * Gets the current time in ms without on iOS Safari
 * @private
 */
SceneManager._getTimeInMsWithoutMobileSafari = function() {
    return performance.now();
};

SceneManager._scene             = null;   // 当前场景 / Current scene
SceneManager._nextScene         = null;   // 下一个场景 / Next scene
SceneManager._stack             = [];     // 栈 / Stack
SceneManager._stopped           = false;  // 停止 / Stopped
SceneManager._sceneStarted      = false;  // 场景开始 / Scene started
SceneManager._exiting           = false;  // 退出 / Exiting
SceneManager._previousClass     = null;   // 上一个场景类 / Previous scene class
SceneManager._backgroundBitmap  = null;   // 背景位图 / Background bitmap
SceneManager._screenWidth       = 816;    // 场景宽 / Screen width
SceneManager._screenHeight      = 624;    // 场景高 / Screen height
SceneManager._boxWidth          = 816;    // 盒宽（盒指的 CSS 的盒模型，这里相当于窗口显示区域）/ Box width (CSS box model, window display area)
SceneManager._boxHeight         = 624;    // 盒高 / Box height
SceneManager._deltaTime = 1.0 / 60.0;     // 增量时间（指多少秒一帧）/ Delta time (seconds per frame)
if (!Utils.isMobileSafari()) SceneManager._currentTime = SceneManager._getTimeInMsWithoutMobileSafari();  // 当前时间（毫秒单位的 10 位时间戳）/ Current time (10-digit timestamp in milliseconds)
SceneManager._accumulator = 0.0;          // 累加器（累加时间的）/ Accumulator (time accumulator)

/**
 * 运行游戏
 * Run the game
 * 
 * @param {Function} sceneClass - 初始场景类 / Initial scene class
 */
SceneManager.run = function(sceneClass) {
    try {
        this.initialize();
        this.goto(sceneClass);
        this.requestUpdate();
    } catch (e) {
        this.catchException(e);
    }
};

/**
 * 初始化游戏系统
 * Initialize game system
 */
SceneManager.initialize = function() {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
};

/**
 * 初始化图形系统
 * Initialize graphics system
 */
SceneManager.initGraphics = function() {
    var type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage('img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
        Graphics.showFps();
    }
    if (type === 'webgl') {
        this.checkWebGL();
    }
};

/**
 * 获取较好的渲染器类型
 * Get preferable renderer type
 * 
 * @returns {string} 渲染器类型 / Renderer type
 */
SceneManager.preferableRendererType = function() {
    if (Utils.isOptionValid('canvas')) {
        return 'canvas';
    } else if (Utils.isOptionValid('webgl')) {
        return 'webgl';
    } else {
        return 'auto';
    }
};

/**
 * 是否应该使用 Canvas 渲染
 * Whether should use Canvas renderer
 * 
 * @returns {boolean} 是否使用Canvas / Whether use Canvas
 */
SceneManager.shouldUseCanvasRenderer = function() {
    return Utils.isMobileDevice();
};

/**
 * 检测是否支持 WebGL
 * Check WebGL support
 */
SceneManager.checkWebGL = function() {
    if (!Graphics.hasWebGL()) {
        throw new Error('Your browser does not support WebGL.');
    }
};

/**
 * 检测是否拥有文件访问权限
 * Check file access permission
 */
SceneManager.checkFileAccess = function() {
    if (!Utils.canReadGameFiles()) {
        throw new Error('Your browser does not allow to read local files.');
    }
};

/**
 * 初始化音频系统
 * Initialize audio system
 */
SceneManager.initAudio = function() {
    var noAudio = Utils.isOptionValid('noaudio');
    if (!WebAudio.initialize(noAudio) && !noAudio) {
        throw new Error('Your browser does not support Web Audio API.');
    }
};

/**
 * 初始化输入系统
 * Initialize input system
 */
SceneManager.initInput = function() {
    Input.initialize();
    TouchInput.initialize();
};

/**
 * 初始化 NW.js 环境
 * Initialize NW.js environment
 */
SceneManager.initNwjs = function() {
    if (Utils.isNwjs()) {
        var gui = require('nw.gui');
        var win = gui.Window.get();
        if (process.platform === 'darwin' && !win.menu) {
            var menubar = new gui.Menu({ type: 'menubar' });
            var option = { hideEdit: true, hideWindow: true };
            menubar.createMacBuiltin('Game', option);
            win.menu = menubar;
        }
    }
};

/**
 * 检测插件错误
 * Check plugin errors
 */
SceneManager.checkPluginErrors = function() {
    PluginManager.checkErrors();
};

/**
 * 设置错误处理者
 * Setup error handlers
 */
SceneManager.setupErrorHandlers = function() {
    window.addEventListener('error', this.onError.bind(this)); // 监听错误事件 / Listen for error events
    document.addEventListener('keydown', this.onKeyDown.bind(this));  // 监听按键按下事件 / Listen for keydown events
};

/**
 * 请求更新
 * Request update
 */
SceneManager.requestUpdate = function() {
    if (!this._stopped) {
        requestAnimationFrame(this.update.bind(this));
    }
};

/**
 * 更新游戏
 * Update game
 */
SceneManager.update = function() {
    try {
        this.tickStart();
        if (Utils.isMobileSafari()) {
            this.updateInputData();
        }
        this.updateManagers();
        this.updateMain();
        this.tickEnd();
    } catch (e) {
        this.catchException(e);
    }
};

/**
 * 终止游戏
 * Terminate game
 */
SceneManager.terminate = function() {
    window.close();
};

/**
 * 错误事件处理
 * Error event handler
 * 
 * @param {Event} e - 错误事件 / Error event
 */
SceneManager.onError = function(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
        this.stop();
        Graphics.printError('Error', e.message);
        AudioManager.stopAll();
    } catch (e2) {
    }
};

/**
 * 按键按下事件处理
 * F5 刷新游戏，F8 显示开发者工具（调试模式下有效）
 * 
 * Key down event handler
 * F5 refreshes the game, F8 shows developer tools (valid in debug mode)
 * 
 * @param {Event} event - 键盘事件 / Keyboard event
 */
SceneManager.onKeyDown = function(event) {
    if (!event.ctrlKey && !event.altKey) {
        switch (event.keyCode) {
        case 116:   // F5
            if (Utils.isNwjs()) {
                location.reload();
            }
            break;
        case 119:   // F8
            if (Utils.isNwjs() && Utils.isOptionValid('test')) {
                require('nw.gui').Window.get().showDevTools();
            }
            break;
        }
    }
};

/**
 * 捕捉异常
 * 终止游戏，并在游戏界面里显示出错误日志。
 * 
 * Catch exception
 * Terminate the game and display error log in the game interface.
 * 
 * @param {Error} e - 异常对象 / Exception object
 */
SceneManager.catchException = function(e) {
    if (e instanceof Error) {
        Graphics.printError(e.name, e.message);
        console.error(e.stack);
    } else {
        Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
};

/**
 * tick 开始
 * tick 为系统的相对时间单位，每执行一次 update 即为一次 tick。
 * 
 * Tick start
 * Tick is the relative time unit of the system. Each update execution is one tick.
 */
SceneManager.tickStart = function() {
    Graphics.tickStart();
};

/**
 * tick 结束
 * Tick end
 */
SceneManager.tickEnd = function() {
    Graphics.tickEnd();
};

/**
 * 更新输入数据
 * Update input data
 */
SceneManager.updateInputData = function() {
    Input.update();
    TouchInput.update();
};

/**
 * 更新主函数
 * Update main function
 */
SceneManager.updateMain = function() {
    if (Utils.isMobileSafari()) {
        this.changeScene();
        this.updateScene();
    } else {
        var newTime = this._getTimeInMsWithoutMobileSafari();
        var fTime = (newTime - this._currentTime) / 1000;
        if (fTime > 0.25) fTime = 0.25;
        this._currentTime = newTime;
        this._accumulator += fTime;
        while (this._accumulator >= this._deltaTime) {
            this.updateInputData();
            this.changeScene();
            this.updateScene();
            this._accumulator -= this._deltaTime;
        }
    }
    this.renderScene();
    this.requestUpdate();
};

/**
 * 更新管理器
 * Update managers
 */
SceneManager.updateManagers = function() {
    ImageManager.update();
};

/**
 * 切换场景
 * Change scene
 */
SceneManager.changeScene = function() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
        if (this._scene) {
            this._scene.terminate();
            this._scene.detachReservation();
            this._previousClass = this._scene.constructor;
        }
        this._scene = this._nextScene;
        if (this._scene) {
            this._scene.attachReservation();
            this._scene.create();
            this._nextScene = null;
            this._sceneStarted = false;
            this.onSceneCreate();
        }
        if (this._exiting) {
            this.terminate();
        }
    }
};

/**
 * 更新场景
 * Update scene
 */
SceneManager.updateScene = function() {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
        }
    }
};

/**
 * 渲染场景
 * Render scene
 */
SceneManager.renderScene = function() {
    if (this.isCurrentSceneStarted()) {
        Graphics.render(this._scene);
    } else if (this._scene) {
        this.onSceneLoading();
    }
};

/**
 * 当场景创建
 * On scene create
 */
SceneManager.onSceneCreate = function() {
    Graphics.startLoading();
};

/**
 * 当场景开始
 * On scene start
 */
SceneManager.onSceneStart = function() {
    Graphics.endLoading();
};

/**
 * 当场景加载中
 * On scene loading
 */
SceneManager.onSceneLoading = function() {
    Graphics.updateLoading();
};

/**
 * 是否场景切换中
 * Check if scene is changing
 * 
 * @returns {boolean} 是否切换中 / Whether changing
 */
SceneManager.isSceneChanging = function() {
    return this._exiting || !!this._nextScene;
};

/**
 * 当前场景是否繁忙
 * Check if current scene is busy
 * 
 * @returns {boolean} 是否繁忙 / Whether busy
 */
SceneManager.isCurrentSceneBusy = function() {
    return this._scene && this._scene.isBusy();
};

/**
 * 当前场景是否开始
 * Check if current scene is started
 * 
 * @returns {boolean} 是否开始 / Whether started
 */
SceneManager.isCurrentSceneStarted = function() {
    return this._scene && this._sceneStarted;
};

/**
 * 是否下一个场景
 * Check if next scene
 * 
 * @param {Function} sceneClass - 场景类 / Scene class
 * @returns {boolean} 是否下一个场景 / Whether next scene
 */
SceneManager.isNextScene = function(sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
};

/**
 * 是否上一个场景
 * Check if previous scene
 * 
 * @param {Function} sceneClass - 场景类 / Scene class
 * @returns {boolean} 是否上一个场景 / Whether previous scene
 */
SceneManager.isPreviousScene = function(sceneClass) {
    return this._previousClass === sceneClass;
};

/**
 * 跳转到场景
 * Go to scene
 * 
 * @param {Function} sceneClass - 场景类 / Scene class
 */
SceneManager.goto = function(sceneClass) {
    if (sceneClass) {
        this._nextScene = new sceneClass();
    }
    if (this._scene) {
        this._scene.stop();
    }
};

/**
 * 往栈末尾添加元素
 * Push scene to stack
 * 
 * @param {Function} sceneClass - 场景类 / Scene class
 */
SceneManager.push = function(sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
};

/**
 * 取出栈末尾的元素
 * Pop scene from stack
 */
SceneManager.pop = function() {
    if (this._stack.length > 0) {
        this.goto(this._stack.pop());
    } else {
        this.exit();
    }
};

/**
 * 退出游戏
 * Exit game
 */
SceneManager.exit = function() {
    this.goto(null);
    this._exiting = true;
};

/**
 * 清空栈
 * Clear stack
 */
SceneManager.clearStack = function() {
    this._stack = [];
};

/**
 * 停止游戏
 * Stop game
 */
SceneManager.stop = function() {
    this._stopped = true;
};

/**
 * 准备下一个场景
 * Prepare next scene
 */
SceneManager.prepareNextScene = function() {
    this._nextScene.prepare.apply(this._nextScene, arguments);
};

/**
 * 快照
 * 将场景绘制成位图。
 * 
 * Snapshot
 * Draw the scene as a bitmap.
 * 
 * @returns {Bitmap} 快照位图 / Snapshot bitmap
 */
SceneManager.snap = function() {
    return Bitmap.snap(this._scene);
};

/**
 * 快照作为背景
 * 在切换场景的时候将当前场景绘制成图片作为背景。
 * 
 * Snapshot for background
 * Draw the current scene as an image for background when switching scenes.
 */
SceneManager.snapForBackground = function() {
    this._backgroundBitmap = this.snap();
    this._backgroundBitmap.blur();
};

/**
 * 获取背景位图
 * Get background bitmap
 * 
 * @returns {Bitmap} 背景位图 / Background bitmap
 */
SceneManager.backgroundBitmap = function() {
    return this._backgroundBitmap;
};

/**
 * 继续游戏
 * Resume game
 */
SceneManager.resume = function() {
    this._stopped = false;
    this.requestUpdate();
    if (!Utils.isMobileSafari()) {
        this._currentTime = this._getTimeInMsWithoutMobileSafari();
        this._accumulator = 0;
    }
};