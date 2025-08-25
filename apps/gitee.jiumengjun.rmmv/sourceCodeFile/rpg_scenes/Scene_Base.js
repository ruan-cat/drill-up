//=============================================================================

/**
 * 游戏中所有场景的父类。 
 * The Superclass of all scene within the game.
 * 
 * @class Scene_Base
 * @constructor 
 * @extends Stage
 */
function Scene_Base() {
    this.initialize.apply(this, arguments);
}

Scene_Base.prototype = Object.create(Stage.prototype);
Scene_Base.prototype.constructor = Scene_Base;


/**
 * 创建一个 Scene_Base 的实例。 
 * Create a instance of Scene_Base.
 * 
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.initialize = function() {
    Stage.prototype.initialize.call(this);
    this._active = false;
    this._fadeSign = 0;
    this._fadeDuration = 0;
    this._fadeSprite = null;
    this._imageReservationId = Utils.generateRuntimeId();
};

/**
 * 附加一个预留到预留队列。 
 * Attach a reservation to the reserve queue.
 * 
 * @method attachReservation
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.attachReservation = function() {
    ImageManager.setDefaultReservationId(this._imageReservationId);
};

/**
 * 从预留队列移除一个预留。 
 * Remove the reservation from the Reserve queue.
 * 
 * @method detachReservation
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.detachReservation = function() {
    ImageManager.releaseReservation(this._imageReservationId);
};

/**
 * 创建组件并将其添加到渲染流程中。 
 * Create the components and add them to the rendering process.
 * 
 * @method create
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.create = function() {
};

/**
 * 返回场景是否处于活动状态。 
 * Returns whether the scene is active or not.
 * 
 * @method isActive
 * @instance 
 * @memberof Scene_Base
 * @return {Boolean} return true if the scene is active
 */
Scene_Base.prototype.isActive = function() {
    return this._active;
};

/**
 * 返回场景是否准备好开始。 
 * Return whether the scene is ready to start or not.
 * 
 * @method isReady
 * @instance 
 * @memberof Scene_Base
 * @return {Boolean} 如果场景准备好开始则返回 true（Return true if the scene is ready to start）
 */
Scene_Base.prototype.isReady = function() {
    return ImageManager.isReady();
};

/**
 * 开始场景流程。 
 * Start the scene processing.
 * 
 * @method start
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.start = function() {
    this._active = true;
};

/**
 * 每个新帧更新场景流程。 
 * Update the scene processing each new frame.
 * 
 * @method update
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.update = function() {
    this.updateFade();
    this.updateChildren();
};

/**
 * 停止场景流程。 
 * Stop the scene processing.
 * 
 * @method stop
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.stop = function() {
    this._active = false;
};


/**
 * 返回场景是否繁忙。 
 * Return whether the scene is busy or not.
 * 
 * @method isBusy
 * @instance
 * @memberof Scene_Base
 * @return {Boolean} 如果场景当前正繁忙则返回 true（Return true if the scene is currently busy）
 */
Scene_Base.prototype.isBusy = function() {
    return this._fadeDuration > 0;
};

/**
 * 在切换到另一个场景之前结束场景。 
 * Terminate the scene before switching to a another scene.
 * 
 * @method terminate
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.terminate = function() {
};

/**
 * 创建子窗口图层并将其添加到渲染流程里。 
 * Create the layer for the windows children
 * and add it to the rendering process.
 * 
 * @method createWindowLayer
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.createWindowLayer = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._windowLayer = new WindowLayer();
    this._windowLayer.move(x, y, width, height);
    this.addChild(this._windowLayer);
};

/**
 * 将子窗口添加到 WindowLayer 流程。 
 * Add the children window to the windowLayer processing.
 * 
 * @method addWindow
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.addWindow = function(window) {
    this._windowLayer.addChild(window);
};

/**
 * 请求淡入画面流程。 
 * Request a fadeIn screen process.
 * 
 * @method startFadeIn
 * @param {Number} [duration=30] 在画面上进行淡入处理所需的时间（TThe time the process will take for fadeIn the screen） 
 * @param {Boolean} [white=false] 如果为真，淡入将用白色处理，否则将是黑色（If true the fadein will be process with a white color else it's will be black）
 * 
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.startFadeIn = function(duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = 1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 255;
};

/**
 * 请求淡出画面流程。 
 * Request a fadeOut screen process.
 * 
 * @method startFadeOut
 * @param {Number} [duration=30] 在画面上进行淡出处理所需的时间（The time the process will take for fadeOut the screen）
 * @param {Boolean} [white=false] 如果为真，淡出将用白色处理，否则将是黑色（If true the fadeOut will be process with a white color else it's will be black）
 * 
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.startFadeOut = function(duration, white) {
    this.createFadeSprite(white);
    this._fadeSign = -1;
    this._fadeDuration = duration || 30;
    this._fadeSprite.opacity = 0;
};

/**
 * 为淡入和淡出创建一个画面精灵，并将其添加到渲染流程中。 
 * Create a Screen sprite for the fadein and fadeOut purpose and
 * add it to the rendering process.
 * 
 * @method createFadeSprite
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.createFadeSprite = function(white) {
    if (!this._fadeSprite) {
        this._fadeSprite = new ScreenSprite();
        this.addChild(this._fadeSprite);
    }
    if (white) {
        this._fadeSprite.setWhite();
    } else {
        this._fadeSprite.setBlack();
    }
};

/**
 * 更新画面渐变流程。 
 * Update the screen fade processing.
 * 
 * @method updateFade
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.updateFade = function() {
    if (this._fadeDuration > 0) {
        var d = this._fadeDuration;
        if (this._fadeSign > 0) {
            this._fadeSprite.opacity -= this._fadeSprite.opacity / d;
        } else {
            this._fadeSprite.opacity += (255 - this._fadeSprite.opacity) / d;
        }
        this._fadeDuration--;
    }
};

/**
 * 每帧更新场景的子元素。 
 * Update the children of the scene EACH frame.
 * 
 * @method updateChildren
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.updateChildren = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};

/**
 * 从堆栈数组中弹出场景并切换到上一个场景。 
 * Pop the scene from the stack array and switch to the
 * previous scene.
 * 
 * @method popScene
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.popScene = function() {
    SceneManager.pop();
};

/**
 * 检查游戏是否应该触发游戏结束。 
 * Check whether the game should be triggering a gameover.
 * 
 * @method checkGameover
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.checkGameover = function() {
    if ($gameParty.isAllDead()) {
        SceneManager.goto(Scene_Gameover);
    }
};

/**
 * 缓慢地淡出场景的所有视觉和音频。 
 * Slowly fade out all the visual and audio of the scene.
 * 
 * @method fadeOutAll
 * @instance 
 * @memberof Scene_Base
 */
Scene_Base.prototype.fadeOutAll = function() {
    var time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
};

/**
 * 返回画面渐变速度值。 
 * Return the screen fade speed value.
 * 
 * @method fadeSpeed
 * @instance 
 * @memberof Scene_Base
 * @return {Number} 返回渐变速度（Return the fade speed） 
 */
Scene_Base.prototype.fadeSpeed = function() {
    return 24;
};

/**
 * 返回一个缓慢的画面渐变速度值。 
 * Return a slow screen fade speed value.
 * 
 * @method slowFadeSpeed
 * @instance 
 * @memberof Scene_Base
 * @return {Number} 返回渐变速度（Return the fade speed） 
 */
Scene_Base.prototype.slowFadeSpeed = function() {
    return this.fadeSpeed() * 2;
};