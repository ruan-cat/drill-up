//=============================================================================
// Graphics.js
//=============================================================================

/**
 * 执行图形处理的静态类
 * The static class that carries out graphics processing.
 *
 * @class Graphics
 * @classdesc 负责游戏图形渲染、显示和相关处理的静态类
 */
function Graphics() {
	throw new Error("This is a static class");
}

/**
 * CSS字体加载支持检测
 * CSS font loading support detection.
 * @static
 * @private
 * @property _cssFontLoading
 * @type Boolean
 */
Graphics._cssFontLoading = document.fonts && document.fonts.ready;

/**
 * 已加载的字体
 * The loaded fonts.
 * @static
 * @private
 * @property _fontLoaded
 * @type Object
 */
Graphics._fontLoaded = null;

/**
 * 视频音量
 * The video volume.
 * @static
 * @private
 * @property _videoVolume
 * @type Number
 */
Graphics._videoVolume = 1;

/**
 * 初始化图形系统
 * Initializes the graphics system.
 *
 * @static
 * @method initialize
 * @param {Number} width - 游戏屏幕宽度 The width of the game screen
 * @param {Number} height - 游戏屏幕高度 The height of the game screen
 * @param {String} type - 渲染器类型 The type of the renderer.
 *                 'canvas', 'webgl', or 'auto'.
 */
Graphics.initialize = function (width, height, type) {
	this._width = width || 800;
	this._height = height || 600;
	this._rendererType = type || "auto";
	this._boxWidth = this._width;
	this._boxHeight = this._height;

	this._scale = 1;
	this._realScale = 1;

	this._errorShowed = false;
	this._errorPrinter = null;
	this._canvas = null;
	this._video = null;
	this._videoUnlocked = false;
	this._videoLoading = false;
	this._upperCanvas = null;
	this._renderer = null;
	this._fpsMeter = null;
	this._modeBox = null;
	this._skipCount = 0;
	this._maxSkip = 3;
	this._rendered = false;
	this._loadingImage = null;
	this._loadingCount = 0;
	this._fpsMeterToggled = false;
	this._stretchEnabled = this._defaultStretchMode();

	this._canUseDifferenceBlend = false;
	this._canUseSaturationBlend = false;
	this._hiddenCanvas = null;

	this._testCanvasBlendModes();
	this._modifyExistingElements();
	this._updateRealScale();
	this._createAllElements();
	this._disableTextSelection();
	this._disableContextMenu();
	this._setupEventHandlers();
	this._setupCssFontLoading();
};

/**
 * 设置CSS字体加载
 * Sets up CSS font loading.
 *
 * @static
 * @private
 * @method _setupCssFontLoading
 */
Graphics._setupCssFontLoading = function () {
	if (Graphics._cssFontLoading) {
		document.fonts.ready
			.then(function (fonts) {
				Graphics._fontLoaded = fonts;
			})
			.catch(function (error) {
				SceneManager.onError(error);
			});
	}
};

/**
 * 检查是否可以使用CSS字体加载
 * Checks whether CSS font loading can be used.
 *
 * @static
 * @method canUseCssFontLoading
 * @return {Boolean} 如果可以使用CSS字体加载则返回true / True if CSS font loading can be used
 */
Graphics.canUseCssFontLoading = function () {
	return !!this._cssFontLoading;
};

/**
 * 游戏屏幕的总帧数
 * The total frame count of the game screen.
 *
 * @static
 * @property frameCount
 * @type Number
 */
Graphics.frameCount = 0;

/**
 * PIXI.blendModes.NORMAL的别名
 * The alias of PIXI.blendModes.NORMAL.
 *
 * @static
 * @property BLEND_NORMAL
 * @type Number
 * @final
 */
Graphics.BLEND_NORMAL = 0;

/**
 * PIXI.blendModes.ADD的别名
 * The alias of PIXI.blendModes.ADD.
 *
 * @static
 * @property BLEND_ADD
 * @type Number
 * @final
 */
Graphics.BLEND_ADD = 1;

/**
 * PIXI.blendModes.MULTIPLY的别名
 * The alias of PIXI.blendModes.MULTIPLY.
 *
 * @static
 * @property BLEND_MULTIPLY
 * @type Number
 * @final
 */
Graphics.BLEND_MULTIPLY = 2;

/**
 * PIXI.blendModes.SCREEN的别名
 * The alias of PIXI.blendModes.SCREEN.
 *
 * @static
 * @property BLEND_SCREEN
 * @type Number
 * @final
 */
Graphics.BLEND_SCREEN = 3;

/**
 * 标记FPS计量器每帧的开始
 * Marks the beginning of each frame for FPSMeter.
 *
 * @static
 * @method tickStart
 */
Graphics.tickStart = function () {
	if (this._fpsMeter) {
		this._fpsMeter.tickStart();
	}
};

/**
 * 标记FPS计量器每帧的结束
 * Marks the end of each frame for FPSMeter.
 *
 * @static
 * @method tickEnd
 */
Graphics.tickEnd = function () {
	if (this._fpsMeter && this._rendered) {
		this._fpsMeter.tick();
	}
};

/**
 * 将舞台渲染到游戏屏幕
 * Renders the stage to the game screen.
 *
 * @static
 * @method render
 * @param {Stage} stage - 要渲染的舞台对象 The stage object to be rendered
 */
Graphics.render = function (stage) {
	if (this._skipCount === 0) {
		var startTime = Date.now();
		if (stage) {
			this._renderer.render(stage);
			if (this._renderer.gl && this._renderer.gl.flush) {
				this._renderer.gl.flush();
			}
		}
		var endTime = Date.now();
		var elapsed = endTime - startTime;
		this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
		this._rendered = true;
	} else {
		this._skipCount--;
		this._rendered = false;
	}
	this.frameCount++;
};

/**
 * 检查渲染器类型是否为WebGL
 * Checks whether the renderer type is WebGL.
 *
 * @static
 * @method isWebGL
 * @return {Boolean} 如果渲染器类型是WebGL则返回true / True if the renderer type is WebGL
 */
Graphics.isWebGL = function () {
	return this._renderer && this._renderer.type === PIXI.RENDERER_TYPE.WEBGL;
};

/**
 * 检查当前浏览器是否支持WebGL
 * Checks whether the current browser supports WebGL.
 *
 * @static
 * @method hasWebGL
 * @return {Boolean} 如果当前浏览器支持WebGL则返回true / True if the current browser supports WebGL.
 */
Graphics.hasWebGL = function () {
	try {
		var canvas = document.createElement("canvas");
		return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
	} catch (e) {
		return false;
	}
};

/**
 * 检查是否支持画布混合模式'difference'
 * Checks whether the canvas blend mode 'difference' is supported.
 *
 * @static
 * @method canUseDifferenceBlend
 * @return {Boolean} 如果支持画布混合模式'difference'则返回true / True if the canvas blend mode 'difference' is supported
 */
Graphics.canUseDifferenceBlend = function () {
	return this._canUseDifferenceBlend;
};

/**
 * 检查是否支持画布混合模式'saturation'
 * Checks whether the canvas blend mode 'saturation' is supported.
 *
 * @static
 * @method canUseSaturationBlend
 * @return {Boolean} 如果支持画布混合模式'saturation'则返回true / True if the canvas blend mode 'saturation' is supported
 */
Graphics.canUseSaturationBlend = function () {
	return this._canUseSaturationBlend;
};

/**
 * 设置"正在加载"图像的来源
 * Sets the source of the "Now Loading" image.
 *
 * @static
 * @method setLoadingImage
 * @param {String} src - 图像来源路径 / The source path of the image
 */
Graphics.setLoadingImage = function (src) {
	this._loadingImage = new Image();
	this._loadingImage.src = src;
};

/**
 * 初始化用于显示"正在加载"图像的计数器
 * Initializes the counter for displaying the "Now Loading" image.
 *
 * @static
 * @method startLoading
 */
Graphics.startLoading = function () {
	this._loadingCount = 0;
};

/**
 * 增加加载计数器并在必要时显示"正在加载"图像
 * Increments the loading counter and displays the "Now Loading" image if necessary.
 *
 * @static
 * @method updateLoading
 */
Graphics.updateLoading = function () {
	this._loadingCount++;
	this._paintUpperCanvas();
	this._upperCanvas.style.opacity = 1;
};

/**
 * 清除"正在加载"图像
 * Erases the "Now Loading" image.
 *
 * @static
 * @method endLoading
 */
Graphics.endLoading = function () {
	this._clearUpperCanvas();
	this._upperCanvas.style.opacity = 0;
};

/**
 * 在屏幕上显示加载错误文本
 * Displays the loading error text to the screen.
 *
 * @static
 * @method printLoadingError
 * @param {String} url - 加载失败的资源URL / The url of the resource failed to load
 */
Graphics.printLoadingError = function (url) {
	if (this._errorPrinter && !this._errorShowed) {
		this._errorPrinter.innerHTML = this._makeErrorHtml("Loading Error", "Failed to load: " + url);
		var button = document.createElement("button");
		button.innerHTML = "Retry";
		button.style.fontSize = "24px";
		button.style.color = "#ffffff";
		button.style.backgroundColor = "#000000";
		button.onmousedown = button.ontouchstart = function (event) {
			ResourceHandler.retry();
			event.stopPropagation();
		};
		this._errorPrinter.appendChild(button);
		this._loadingCount = -Infinity;
	}
};

/**
 * 清除加载错误文本
 * Erases the loading error text.
 *
 * @static
 * @method eraseLoadingError
 */
Graphics.eraseLoadingError = function () {
	if (this._errorPrinter && !this._errorShowed) {
		this._errorPrinter.innerHTML = "";
		this.startLoading();
	}
};

/**
 * 在屏幕上显示错误文本
 * Displays the error text to the screen.
 *
 * @static
 * @method printError
 * @param {String} name - 错误名称 / The name of the error
 * @param {String} message - 错误消息 / The message of the error
 */
Graphics.printError = function (name, message) {
	this._errorShowed = true;
	if (this._errorPrinter) {
		this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
	}
	this._applyCanvasFilter();
	this._clearUpperCanvas();
};

/**
 * 显示FPS计量器元素
 * Shows the FPSMeter element.
 *
 * @static
 * @method showFps
 */
Graphics.showFps = function () {
	if (this._fpsMeter) {
		this._fpsMeter.show();
		this._modeBox.style.opacity = 1;
	}
};

/**
 * 隐藏FPS计量器元素
 * Hides the FPSMeter element.
 *
 * @static
 * @method hideFps
 */
Graphics.hideFps = function () {
	if (this._fpsMeter) {
		this._fpsMeter.hide();
		this._modeBox.style.opacity = 0;
	}
};

/**
 * 加载字体文件
 * Loads a font file.
 *
 * @static
 * @method loadFont
 * @param {String} name - 字体的名称 / The face name of the font
 * @param {String} url - 字体文件的URL / The url of the font file
 */
Graphics.loadFont = function (name, url) {
	var style = document.createElement("style");
	var head = document.getElementsByTagName("head");
	var rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
	style.type = "text/css";
	head.item(0).appendChild(style);
	style.sheet.insertRule(rule, 0);
	this._createFontLoader(name);
};

/**
 * 检查字体文件是否已加载
 * Checks whether the font file is loaded.
 *
 * @static
 * @method isFontLoaded
 * @param {String} name - 字体的名称 / The face name of the font
 * @return {Boolean} 如果字体文件已加载则返回true / True if the font file is loaded
 */
Graphics.isFontLoaded = function (name) {
	if (Graphics._cssFontLoading) {
		if (Graphics._fontLoaded) {
			return Graphics._fontLoaded.check('10px "' + name + '"');
		}

		return false;
	} else {
		if (!this._hiddenCanvas) {
			this._hiddenCanvas = document.createElement("canvas");
		}
		var context = this._hiddenCanvas.getContext("2d");
		var text = "abcdefghijklmnopqrstuvwxyz";
		var width1, width2;
		context.font = "40px " + name + ", sans-serif";
		width1 = context.measureText(text).width;
		context.font = "40px sans-serif";
		width2 = context.measureText(text).width;
		return width1 !== width2;
	}
};

/**
 * 开始播放视频
 * Starts playback of a video.
 *
 * @static
 * @method playVideo
 * @param {String} src - 视频源路径 / The video source path
 */
Graphics.playVideo = function (src) {
	this._videoLoader = ResourceHandler.createLoader(
		null,
		this._playVideo.bind(this, src),
		this._onVideoError.bind(this),
	);
	this._playVideo(src);
};

/**
 * 播放视频（私有方法）
 * Plays the video (private method).
 *
 * @static
 * @private
 * @method _playVideo
 * @param {String} src - 视频源路径 / The video source path
 */
Graphics._playVideo = function (src) {
	this._video.src = src;
	this._video.onloadeddata = this._onVideoLoad.bind(this);
	this._video.onerror = this._videoLoader;
	this._video.onended = this._onVideoEnd.bind(this);
	this._video.load();
	this._videoLoading = true;
};

/**
 * 检查视频是否正在播放
 * Checks whether the video is playing.
 *
 * @static
 * @method isVideoPlaying
 * @return {Boolean} 如果视频正在播放则返回true / True if the video is playing
 */
Graphics.isVideoPlaying = function () {
	return this._videoLoading || this._isVideoVisible();
};

/**
 * 检查浏览器是否可以播放指定的视频类型
 * Checks whether the browser can play the specified video type.
 *
 * @static
 * @method canPlayVideoType
 * @param {String} type - 要测试支持的视频类型 / The video type to test support for
 * @return {Boolean} 如果浏览器可以播放指定的视频类型则返回true / True if the browser can play the specified video type
 */
Graphics.canPlayVideoType = function (type) {
	return this._video && this._video.canPlayType(type);
};

/**
 * 设置视频的音量
 * Sets volume of a video.
 *
 * @static
 * @method setVideoVolume
 * @param {Number} value - 音量值 / The volume value
 */
Graphics.setVideoVolume = function (value) {
	this._videoVolume = value;
	if (this._video) {
		this._video.volume = this._videoVolume;
	}
};

/**
 * 将页面上的x坐标转换为画布区域上对应的x坐标
 * Converts an x coordinate on the page to the corresponding x coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasX
 * @param {Number} x - 要转换的页面x坐标 / The x coordinate on the page to be converted
 * @return {Number} 画布区域上的x坐标 / The x coordinate on the canvas area
 */
Graphics.pageToCanvasX = function (x) {
	if (this._canvas) {
		var left = this._canvas.offsetLeft;
		return Math.round((x - left) / this._realScale);
	} else {
		return 0;
	}
};

/**
 * 将页面上的y坐标转换为画布区域上对应的y坐标
 * Converts a y coordinate on the page to the corresponding y coordinate on the canvas area.
 *
 * @static
 * @method pageToCanvasY
 * @param {Number} y - 要转换的页面y坐标 / The y coordinate on the page to be converted
 * @return {Number} 画布区域上的y坐标 / The y coordinate on the canvas area
 */
Graphics.pageToCanvasY = function (y) {
	if (this._canvas) {
		var top = this._canvas.offsetTop;
		return Math.round((y - top) / this._realScale);
	} else {
		return 0;
	}
};

/**
 * 检查指定的点是否在游戏画布区域内
 * Checks whether the specified point is inside the game canvas area.
 *
 * @static
 * @method isInsideCanvas
 * @param {Number} x - 画布区域上的x坐标 / The x coordinate on the canvas area
 * @param {Number} y - 画布区域上的y坐标 / The y coordinate on the canvas area
 * @return {Boolean} 如果指定的点在游戏画布区域内则返回true / True if the specified point is inside the game canvas area
 */
Graphics.isInsideCanvas = function (x, y) {
	return x >= 0 && x < this._width && y >= 0 && y < this._height;
};

/**
 * 调用PIXI.js垃圾回收器
 * Calls pixi.js garbage collector.
 *
 * @static
 * @method callGC
 */
Graphics.callGC = function () {
	if (Graphics.isWebGL()) {
		Graphics._renderer.textureGC.run();
	}
};

/**
 * 游戏屏幕的宽度
 * The width of the game screen.
 *
 * @static
 * @property width
 * @type Number
 */
Object.defineProperty(Graphics, "width", {
	get: function () {
		return this._width;
	},
	set: function (value) {
		if (this._width !== value) {
			this._width = value;
			this._updateAllElements();
		}
	},
	configurable: true,
});

/**
 * 游戏屏幕的高度
 * The height of the game screen.
 *
 * @static
 * @property height
 * @type Number
 */
Object.defineProperty(Graphics, "height", {
	get: function () {
		return this._height;
	},
	set: function (value) {
		if (this._height !== value) {
			this._height = value;
			this._updateAllElements();
		}
	},
	configurable: true,
});

/**
 * 窗口显示区域的宽度
 * The width of the window display area.
 *
 * @static
 * @property boxWidth
 * @type Number
 */
Object.defineProperty(Graphics, "boxWidth", {
	get: function () {
		return this._boxWidth;
	},
	set: function (value) {
		this._boxWidth = value;
	},
	configurable: true,
});

/**
 * 窗口显示区域的高度
 * The height of the window display area.
 *
 * @static
 * @property boxHeight
 * @type Number
 */
Object.defineProperty(Graphics, "boxHeight", {
	get: function () {
		return this._boxHeight;
	},
	set: function (value) {
		this._boxHeight = value;
	},
	configurable: true,
});

/**
 * 游戏屏幕的缩放比例
 * The zoom scale of the game screen.
 *
 * @static
 * @property scale
 * @type Number
 */
Object.defineProperty(Graphics, "scale", {
	get: function () {
		return this._scale;
	},
	set: function (value) {
		if (this._scale !== value) {
			this._scale = value;
			this._updateAllElements();
		}
	},
	configurable: true,
});

/**
 * 创建所有元素
 * Creates all elements.
 *
 * @static
 * @private
 * @method _createAllElements
 */
Graphics._createAllElements = function () {
	this._createErrorPrinter();
	this._createCanvas();
	this._createVideo();
	this._createUpperCanvas();
	this._createRenderer();
	this._createFPSMeter();
	this._createModeBox();
	this._createGameFontLoader();
};

/**
 * 更新所有元素
 * Updates all elements.
 *
 * @static
 * @private
 * @method _updateAllElements
 */
Graphics._updateAllElements = function () {
	this._updateRealScale();
	this._updateErrorPrinter();
	this._updateCanvas();
	this._updateVideo();
	this._updateUpperCanvas();
	this._updateRenderer();
	this._paintUpperCanvas();
};

/**
 * 更新真实缩放比例
 * Updates the real scale.
 *
 * @static
 * @private
 * @method _updateRealScale
 */
Graphics._updateRealScale = function () {
	if (this._stretchEnabled) {
		var h = window.innerWidth / this._width;
		var v = window.innerHeight / this._height;
		if (h >= 1 && h - 0.01 <= 1) h = 1;
		if (v >= 1 && v - 0.01 <= 1) v = 1;
		this._realScale = Math.min(h, v);
	} else {
		this._realScale = this._scale;
	}
};

/**
 * @static
 * @method _makeErrorHtml
 * @param {String} name
 * @param {String} message
 * @return {String}
 * @private
 */
Graphics._makeErrorHtml = function (name, message) {
	return '<font color="yellow"><b>' + name + "</b></font><br>" + '<font color="white">' + message + "</font><br>";
};

/**
 * @static
 * @method _defaultStretchMode
 * @private
 */
Graphics._defaultStretchMode = function () {
	return Utils.isNwjs() || Utils.isMobileDevice();
};

/**
 * @static
 * @method _testCanvasBlendModes
 * @private
 */
Graphics._testCanvasBlendModes = function () {
	var canvas, context, imageData1, imageData2;
	canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	context = canvas.getContext("2d");
	context.globalCompositeOperation = "source-over";
	context.fillStyle = "white";
	context.fillRect(0, 0, 1, 1);
	context.globalCompositeOperation = "difference";
	context.fillStyle = "white";
	context.fillRect(0, 0, 1, 1);
	imageData1 = context.getImageData(0, 0, 1, 1);
	context.globalCompositeOperation = "source-over";
	context.fillStyle = "black";
	context.fillRect(0, 0, 1, 1);
	context.globalCompositeOperation = "saturation";
	context.fillStyle = "white";
	context.fillRect(0, 0, 1, 1);
	imageData2 = context.getImageData(0, 0, 1, 1);
	this._canUseDifferenceBlend = imageData1.data[0] === 0;
	this._canUseSaturationBlend = imageData2.data[0] === 0;
};

/**
 * @static
 * @method _modifyExistingElements
 * @private
 */
Graphics._modifyExistingElements = function () {
	var elements = document.getElementsByTagName("*");
	for (var i = 0; i < elements.length; i++) {
		if (elements[i].style.zIndex > 0) {
			elements[i].style.zIndex = 0;
		}
	}
};

/**
 * @static
 * @method _createErrorPrinter
 * @private
 */
Graphics._createErrorPrinter = function () {
	this._errorPrinter = document.createElement("p");
	this._errorPrinter.id = "ErrorPrinter";
	this._updateErrorPrinter();
	document.body.appendChild(this._errorPrinter);
};

/**
 * @static
 * @method _updateErrorPrinter
 * @private
 */
Graphics._updateErrorPrinter = function () {
	this._errorPrinter.width = this._width * 0.9;
	this._errorPrinter.height = 40;
	this._errorPrinter.style.textAlign = "center";
	this._errorPrinter.style.textShadow = "1px 1px 3px #000";
	this._errorPrinter.style.fontSize = "20px";
	this._errorPrinter.style.zIndex = 99;
	this._centerElement(this._errorPrinter);
};

/**
 * @static
 * @method _createCanvas
 * @private
 */
Graphics._createCanvas = function () {
	this._canvas = document.createElement("canvas");
	this._canvas.id = "GameCanvas";
	this._updateCanvas();
	document.body.appendChild(this._canvas);
};

/**
 * @static
 * @method _updateCanvas
 * @private
 */
Graphics._updateCanvas = function () {
	this._canvas.width = this._width;
	this._canvas.height = this._height;
	this._canvas.style.zIndex = 1;
	this._centerElement(this._canvas);
};

/**
 * @static
 * @method _createVideo
 * @private
 */
Graphics._createVideo = function () {
	this._video = document.createElement("video");
	this._video.id = "GameVideo";
	this._video.style.opacity = 0;
	this._video.setAttribute("playsinline", "");
	this._video.volume = this._videoVolume;
	this._updateVideo();
	makeVideoPlayableInline(this._video);
	document.body.appendChild(this._video);
};

/**
 * @static
 * @method _updateVideo
 * @private
 */
Graphics._updateVideo = function () {
	this._video.width = this._width;
	this._video.height = this._height;
	this._video.style.zIndex = 2;
	this._centerElement(this._video);
};

/**
 * @static
 * @method _createUpperCanvas
 * @private
 */
Graphics._createUpperCanvas = function () {
	this._upperCanvas = document.createElement("canvas");
	this._upperCanvas.id = "UpperCanvas";
	this._updateUpperCanvas();
	document.body.appendChild(this._upperCanvas);
};

/**
 * @static
 * @method _updateUpperCanvas
 * @private
 */
Graphics._updateUpperCanvas = function () {
	this._upperCanvas.width = this._width;
	this._upperCanvas.height = this._height;
	this._upperCanvas.style.zIndex = 3;
	this._centerElement(this._upperCanvas);
};

/**
 * @static
 * @method _clearUpperCanvas
 * @private
 */
Graphics._clearUpperCanvas = function () {
	var context = this._upperCanvas.getContext("2d");
	context.clearRect(0, 0, this._width, this._height);
};

/**
 * @static
 * @method _paintUpperCanvas
 * @private
 */
Graphics._paintUpperCanvas = function () {
	this._clearUpperCanvas();
	if (this._loadingImage && this._loadingCount >= 20) {
		var context = this._upperCanvas.getContext("2d");
		var dx = (this._width - this._loadingImage.width) / 2;
		var dy = (this._height - this._loadingImage.height) / 2;
		var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
		context.save();
		context.globalAlpha = alpha;
		context.drawImage(this._loadingImage, dx, dy);
		context.restore();
	}
};

/**
 * @static
 * @method _createRenderer
 * @private
 */
Graphics._createRenderer = function () {
	PIXI.dontSayHello = true;
	var width = this._width;
	var height = this._height;
	var options = { view: this._canvas };
	try {
		switch (this._rendererType) {
			case "canvas":
				this._renderer = new PIXI.CanvasRenderer(width, height, options);
				break;
			case "webgl":
				this._renderer = new PIXI.WebGLRenderer(width, height, options);
				break;
			default:
				this._renderer = PIXI.autoDetectRenderer(width, height, options);
				break;
		}

		if (this._renderer && this._renderer.textureGC) this._renderer.textureGC.maxIdle = 1;
	} catch (e) {
		this._renderer = null;
	}
};

/**
 * @static
 * @method _updateRenderer
 * @private
 */
Graphics._updateRenderer = function () {
	if (this._renderer) {
		this._renderer.resize(this._width, this._height);
	}
};

/**
 * @static
 * @method _createFPSMeter
 * @private
 */
Graphics._createFPSMeter = function () {
	var options = { graph: 1, decimals: 0, theme: "transparent", toggleOn: null };
	this._fpsMeter = new FPSMeter(options);
	this._fpsMeter.hide();
};

/**
 * @static
 * @method _createModeBox
 * @private
 */
Graphics._createModeBox = function () {
	var box = document.createElement("div");
	box.id = "modeTextBack";
	box.style.position = "absolute";
	box.style.left = "5px";
	box.style.top = "5px";
	box.style.width = "119px";
	box.style.height = "58px";
	box.style.background = "rgba(0,0,0,0.2)";
	box.style.zIndex = 9;
	box.style.opacity = 0;

	var text = document.createElement("div");
	text.id = "modeText";
	text.style.position = "absolute";
	text.style.left = "0px";
	text.style.top = "41px";
	text.style.width = "119px";
	text.style.fontSize = "12px";
	text.style.fontFamily = "monospace";
	text.style.color = "white";
	text.style.textAlign = "center";
	text.style.textShadow = "1px 1px 0 rgba(0,0,0,0.5)";
	text.innerHTML = this.isWebGL() ? "WebGL mode" : "Canvas mode";

	document.body.appendChild(box);
	box.appendChild(text);

	this._modeBox = box;
};

/**
 * @static
 * @method _createGameFontLoader
 * @private
 */
Graphics._createGameFontLoader = function () {
	this._createFontLoader("GameFont");
};

/**
 * @static
 * @method _createFontLoader
 * @param {String} name
 * @private
 */
Graphics._createFontLoader = function (name) {
	var div = document.createElement("div");
	var text = document.createTextNode(".");
	div.style.fontFamily = name;
	div.style.fontSize = "0px";
	div.style.color = "transparent";
	div.style.position = "absolute";
	div.style.margin = "auto";
	div.style.top = "0px";
	div.style.left = "0px";
	div.style.width = "1px";
	div.style.height = "1px";
	div.appendChild(text);
	document.body.appendChild(div);
};

/**
 * @static
 * @method _centerElement
 * @param {HTMLElement} element
 * @private
 */
Graphics._centerElement = function (element) {
	var width = element.width * this._realScale;
	var height = element.height * this._realScale;
	element.style.position = "absolute";
	element.style.margin = "auto";
	element.style.top = 0;
	element.style.left = 0;
	element.style.right = 0;
	element.style.bottom = 0;
	element.style.width = width + "px";
	element.style.height = height + "px";
};

/**
 * @static
 * @method _disableTextSelection
 * @private
 */
Graphics._disableTextSelection = function () {
	var body = document.body;
	body.style.userSelect = "none";
	body.style.webkitUserSelect = "none";
	body.style.msUserSelect = "none";
	body.style.mozUserSelect = "none";
};

/**
 * @static
 * @method _disableContextMenu
 * @private
 */
Graphics._disableContextMenu = function () {
	var elements = document.body.getElementsByTagName("*");
	var oncontextmenu = function () {
		return false;
	};
	for (var i = 0; i < elements.length; i++) {
		elements[i].oncontextmenu = oncontextmenu;
	}
};

/**
 * @static
 * @method _applyCanvasFilter
 * @private
 */
Graphics._applyCanvasFilter = function () {
	if (this._canvas) {
		this._canvas.style.opacity = 0.5;
		this._canvas.style.filter = "blur(8px)";
		this._canvas.style.webkitFilter = "blur(8px)";
	}
};

/**
 * @static
 * @method _onVideoLoad
 * @private
 */
Graphics._onVideoLoad = function () {
	this._video.play();
	this._updateVisibility(true);
	this._videoLoading = false;
};

/**
 * @static
 * @method _onVideoError
 * @private
 */
Graphics._onVideoError = function () {
	this._updateVisibility(false);
	this._videoLoading = false;
};

/**
 * @static
 * @method _onVideoEnd
 * @private
 */
Graphics._onVideoEnd = function () {
	this._updateVisibility(false);
};

/**
 * @static
 * @method _updateVisibility
 * @param {Boolean} videoVisible
 * @private
 */
Graphics._updateVisibility = function (videoVisible) {
	this._video.style.opacity = videoVisible ? 1 : 0;
	this._canvas.style.opacity = videoVisible ? 0 : 1;
};

/**
 * @static
 * @method _isVideoVisible
 * @return {Boolean}
 * @private
 */
Graphics._isVideoVisible = function () {
	return this._video.style.opacity > 0;
};

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
Graphics._setupEventHandlers = function () {
	window.addEventListener("resize", this._onWindowResize.bind(this));
	document.addEventListener("keydown", this._onKeyDown.bind(this));
	document.addEventListener("keydown", this._onTouchEnd.bind(this));
	document.addEventListener("mousedown", this._onTouchEnd.bind(this));
	document.addEventListener("touchend", this._onTouchEnd.bind(this));
};

/**
 * @static
 * @method _onWindowResize
 * @private
 */
Graphics._onWindowResize = function () {
	this._updateAllElements();
};

/**
 * @static
 * @method _onKeyDown
 * @param {KeyboardEvent} event
 * @private
 */
Graphics._onKeyDown = function (event) {
	if (!event.ctrlKey && !event.altKey) {
		switch (event.keyCode) {
			case 113: // F2
				event.preventDefault();
				this._switchFPSMeter();
				break;
			case 114: // F3
				event.preventDefault();
				this._switchStretchMode();
				break;
			case 115: // F4
				event.preventDefault();
				this._switchFullScreen();
				break;
		}
	}
};

/**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
Graphics._onTouchEnd = function (event) {
	if (!this._videoUnlocked) {
		this._video.play();
		this._videoUnlocked = true;
	}
	if (this._isVideoVisible() && this._video.paused) {
		this._video.play();
	}
};

/**
 * @static
 * @method _switchFPSMeter
 * @private
 */
Graphics._switchFPSMeter = function () {
	if (this._fpsMeter.isPaused) {
		this.showFps();
		this._fpsMeter.showFps();
		this._fpsMeterToggled = false;
	} else if (!this._fpsMeterToggled) {
		this._fpsMeter.showDuration();
		this._fpsMeterToggled = true;
	} else {
		this.hideFps();
	}
};

/**
 * @static
 * @method _switchStretchMode
 * @return {Boolean}
 * @private
 */
Graphics._switchStretchMode = function () {
	this._stretchEnabled = !this._stretchEnabled;
	this._updateAllElements();
};

/**
 * @static
 * @method _switchFullScreen
 * @private
 */
Graphics._switchFullScreen = function () {
	if (this._isFullScreen()) {
		this._requestFullScreen();
	} else {
		this._cancelFullScreen();
	}
};

/**
 * @static
 * @method _isFullScreen
 * @return {Boolean}
 * @private
 */
Graphics._isFullScreen = function () {
	return (
		(document.fullScreenElement && document.fullScreenElement !== null) ||
		(!document.mozFullScreen && !document.webkitFullscreenElement && !document.msFullscreenElement)
	);
};

/**
 * @static
 * @method _requestFullScreen
 * @private
 */
Graphics._requestFullScreen = function () {
	var element = document.body;
	if (element.requestFullScreen) {
		element.requestFullScreen();
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if (element.webkitRequestFullScreen) {
		element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
	} else if (element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
};

/**
 * @static
 * @method _cancelFullScreen
 * @private
 */
Graphics._cancelFullScreen = function () {
	if (document.cancelFullScreen) {
		document.cancelFullScreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
};

//-----------------------------------------------------------------------------
