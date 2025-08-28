//=============================================================================
// Html5Audio.js
//=============================================================================

/**
 * 处理HTML5音频的静态类
 * The static class that handles HTML5 Audio.
 *
 * @class Html5Audio
 * @constructor
 */
function Html5Audio() {
	throw new Error("This is a static class");
}

/**
 * 是否已初始化
 * Whether initialized.
 * @static
 * @private
 * @property _initialized
 * @type Boolean
 */
Html5Audio._initialized = false;

/**
 * 是否已解锁
 * Whether unlocked.
 * @static
 * @private
 * @property _unlocked
 * @type Boolean
 */
Html5Audio._unlocked = false;

/**
 * 音频元素
 * The audio element.
 * @static
 * @private
 * @property _audioElement
 * @type HTMLAudioElement
 */
Html5Audio._audioElement = null;

/**
 * 增益补间动画间隔
 * Gain tween interval.
 * @static
 * @private
 * @property _gainTweenInterval
 * @type Number
 */
Html5Audio._gainTweenInterval = null;

/**
 * 补间增益
 * Tween gain.
 * @static
 * @private
 * @property _tweenGain
 * @type Number
 */
Html5Audio._tweenGain = 0;

/**
 * 补间目标增益
 * Tween target gain.
 * @static
 * @private
 * @property _tweenTargetGain
 * @type Number
 */
Html5Audio._tweenTargetGain = 0;

/**
 * 补间增益步骤
 * Tween gain step.
 * @static
 * @private
 * @property _tweenGainStep
 * @type Number
 */
Html5Audio._tweenGainStep = 0;

/**
 * 静态SE路径
 * Static SE path.
 * @static
 * @private
 * @property _staticSePath
 * @type String
 */
Html5Audio._staticSePath = null;

/**
 * 设置HTML5音频
 * Sets up the Html5 Audio.
 *
 * @static
 * @method setup
 * @param {String} url - 音频文件的URL / The url of the audio file
 */
Html5Audio.setup = function (url) {
	if (!this._initialized) {
		this.initialize();
	}
	this.clear();

	if (Decrypter.hasEncryptedAudio && this._audioElement.src) {
		window.URL.revokeObjectURL(this._audioElement.src);
	}
	this._url = url;
};

/**
 * 初始化音频系统
 * Initializes the audio system.
 *
 * @static
 * @method initialize
 * @return {Boolean} 如果音频系统可用则返回true / True if the audio system is available
 */
Html5Audio.initialize = function () {
	if (!this._initialized) {
		if (!this._audioElement) {
			try {
				this._audioElement = new Audio();
			} catch (e) {
				this._audioElement = null;
			}
		}
		if (!!this._audioElement) this._setupEventHandlers();
		this._initialized = true;
	}
	return !!this._audioElement;
};

/**
 * 设置事件处理程序
 * Sets up event handlers.
 *
 * @static
 * @private
 * @method _setupEventHandlers
 */
Html5Audio._setupEventHandlers = function () {
	document.addEventListener("touchstart", this._onTouchStart.bind(this));
	document.addEventListener("visibilitychange", this._onVisibilityChange.bind(this));
	this._audioElement.addEventListener("loadeddata", this._onLoadedData.bind(this));
	this._audioElement.addEventListener("error", this._onError.bind(this));
	this._audioElement.addEventListener("ended", this._onEnded.bind(this));
};

/**
 * 处理触摸开始事件
 * Handles touch start event.
 *
 * @static
 * @private
 * @method _onTouchStart
 */
Html5Audio._onTouchStart = function () {
	if (this._audioElement && !this._unlocked) {
		if (this._isLoading) {
			this._load(this._url);
			this._unlocked = true;
		} else {
			if (this._staticSePath) {
				this._audioElement.src = this._staticSePath;
				this._audioElement.volume = 0;
				this._audioElement.loop = false;
				this._audioElement.play();
				this._unlocked = true;
			}
		}
	}
};

/**
 * 处理可见性变化事件
 * Handles visibility change event.
 *
 * @static
 * @private
 * @method _onVisibilityChange
 */
Html5Audio._onVisibilityChange = function () {
	if (document.visibilityState === "hidden") {
		this._onHide();
	} else {
		this._onShow();
	}
};

/**
 * 处理数据加载完成事件
 * Handles loaded data event.
 *
 * @static
 * @private
 * @method _onLoadedData
 */
Html5Audio._onLoadedData = function () {
	this._buffered = true;
	if (this._unlocked) this._onLoad();
};

/**
 * 处理错误事件
 * Handles error event.
 *
 * @static
 * @private
 * @method _onError
 */
Html5Audio._onError = function () {
	this._hasError = true;
};

/**
 * 处理播放结束事件
 * Handles ended event.
 *
 * @static
 * @private
 * @method _onEnded
 */
Html5Audio._onEnded = function () {
	if (!this._audioElement.loop) {
		this.stop();
	}
};

/**
 * 处理隐藏事件
 * Handles hide event.
 *
 * @static
 * @private
 * @method _onHide
 */
Html5Audio._onHide = function () {
	this._audioElement.volume = 0;
	this._tweenGain = 0;
};

/**
 * 处理显示事件
 * Handles show event.
 *
 * @static
 * @private
 * @method _onShow
 */
Html5Audio._onShow = function () {
	this.fadeIn(0.5);
};

/**
 * 清除音频数据
 * Clears the audio data.
 *
 * @static
 * @method clear
 */
Html5Audio.clear = function () {
	this.stop();
	this._volume = 1;
	this._loadListeners = [];
	this._hasError = false;
	this._autoPlay = false;
	this._isLoading = false;
	this._buffered = false;
};

/**
 * 设置静态SE的URL
 * Set the URL of static se.
 *
 * @static
 * @method setStaticSe
 * @param {String} url - 静态SE的URL / The URL of static se
 */
Html5Audio.setStaticSe = function (url) {
	if (!this._initialized) {
		this.initialize();
		this.clear();
	}
	this._staticSePath = url;
};

/**
 * [只读] 音频文件的URL
 * [read-only] The url of the audio file.
 *
 * @property url
 * @type String
 */
Object.defineProperty(Html5Audio, "url", {
	get: function () {
		return Html5Audio._url;
	},
	configurable: true,
});

/**
 * 音频的音量
 * The volume of the audio.
 *
 * @property volume
 * @type Number
 */
Object.defineProperty(Html5Audio, "volume", {
	get: function () {
		return Html5Audio._volume;
	}.bind(this),
	set: function (value) {
		Html5Audio._volume = value;
		if (Html5Audio._audioElement) {
			Html5Audio._audioElement.volume = this._volume;
		}
	},
	configurable: true,
});

/**
 * 检查音频数据是否准备好播放
 * Checks whether the audio data is ready to play.
 *
 * @static
 * @method isReady
 * @return {Boolean} 如果音频数据准备好播放则返回true / True if the audio data is ready to play
 */
Html5Audio.isReady = function () {
	return this._buffered;
};

/**
 * 检查是否发生了加载错误
 * Checks whether a loading error has occurred.
 *
 * @static
 * @method isError
 * @return {Boolean} 如果发生了加载错误则返回true / True if a loading error has occurred
 */
Html5Audio.isError = function () {
	return this._hasError;
};

/**
 * 检查音频是否正在播放
 * Checks whether the audio is playing.
 *
 * @static
 * @method isPlaying
 * @return {Boolean} 如果音频正在播放则返回true / True if the audio is playing
 */
Html5Audio.isPlaying = function () {
	return !this._audioElement.paused;
};

/**
 * 播放音频
 * Plays the audio.
 *
 * @static
 * @method play
 * @param {Boolean} loop - 音频数据是否循环播放 / Whether the audio data play in a loop
 * @param {Number} offset - 播放开始位置（秒） / The start position to play in seconds
 */
Html5Audio.play = function (loop, offset) {
	if (this.isReady()) {
		offset = offset || 0;
		this._startPlaying(loop, offset);
	} else if (Html5Audio._audioElement) {
		this._autoPlay = true;
		this.addLoadListener(
			function () {
				if (this._autoPlay) {
					this.play(loop, offset);
					if (this._gainTweenInterval) {
						clearInterval(this._gainTweenInterval);
						this._gainTweenInterval = null;
					}
				}
			}.bind(this),
		);
		if (!this._isLoading) this._load(this._url);
	}
};

/**
 * 停止音频
 * Stops the audio.
 *
 * @static
 * @method stop
 */
Html5Audio.stop = function () {
	if (this._audioElement) this._audioElement.pause();
	this._autoPlay = false;
	if (this._tweenInterval) {
		clearInterval(this._tweenInterval);
		this._tweenInterval = null;
		this._audioElement.volume = 0;
	}
};

/**
 * 执行音频淡入
 * Performs the audio fade-in.
 *
 * @static
 * @method fadeIn
 * @param {Number} duration - 淡入时间（秒） / Fade-in time in seconds
 */
Html5Audio.fadeIn = function (duration) {
	if (this.isReady()) {
		if (this._audioElement) {
			this._tweenTargetGain = this._volume;
			this._tweenGain = 0;
			this._startGainTween(duration);
		}
	} else if (this._autoPlay) {
		this.addLoadListener(
			function () {
				this.fadeIn(duration);
			}.bind(this),
		);
	}
};

/**
 * 执行音频淡出
 * Performs the audio fade-out.
 *
 * @static
 * @method fadeOut
 * @param {Number} duration - 淡出时间（秒） / Fade-out time in seconds
 */
Html5Audio.fadeOut = function (duration) {
	if (this._audioElement) {
		this._tweenTargetGain = 0;
		this._tweenGain = this._volume;
		this._startGainTween(duration);
	}
};

/**
 * 获取音频的寻找位置
 * Gets the seek position of the audio.
 *
 * @static
 * @method seek
 * @return {Number} 当前播放位置（秒） / Current playback position in seconds
 */
Html5Audio.seek = function () {
	if (this._audioElement) {
		return this._audioElement.currentTime;
	} else {
		return 0;
	}
};

/**
 * 添加在音频数据加载完成时调用的回调函数
 * Add a callback function that will be called when the audio data is loaded.
 *
 * @static
 * @method addLoadListener
 * @param {Function} listener - 回调函数 / The callback function
 */
Html5Audio.addLoadListener = function (listner) {
	this._loadListeners.push(listner);
};

/**
 * 加载音频数据
 * Loads audio data.
 *
 * @static
 * @private
 * @method _load
 * @param {String} url - 音频URL / The audio URL
 */
Html5Audio._load = function (url) {
	if (this._audioElement) {
		this._isLoading = true;
		this._audioElement.src = url;
		this._audioElement.load();
	}
};

/**
 * 开始播放音频
 * Starts playing audio.
 *
 * @static
 * @private
 * @method _startPlaying
 * @param {Boolean} loop - 是否循环 / Whether to loop
 * @param {Number} offset - 起始位置 / Start offset
 */
Html5Audio._startPlaying = function (loop, offset) {
	this._audioElement.loop = loop;
	if (this._gainTweenInterval) {
		clearInterval(this._gainTweenInterval);
		this._gainTweenInterval = null;
	}
	if (this._audioElement) {
		this._audioElement.volume = this._volume;
		this._audioElement.currentTime = offset;
		this._audioElement.play();
	}
};

/**
 * 处理加载完成事件
 * Handles load complete event.
 *
 * @static
 * @private
 * @method _onLoad
 */
Html5Audio._onLoad = function () {
	this._isLoading = false;
	while (this._loadListeners.length > 0) {
		var listener = this._loadListeners.shift();
		listener();
	}
};

/**
 * 开始增益补间动画
 * Starts gain tween animation.
 *
 * @static
 * @private
 * @method _startGainTween
 * @param {Number} duration - 持续时间 / Duration
 */
Html5Audio._startGainTween = function (duration) {
	this._audioElement.volume = this._tweenGain;
	if (this._gainTweenInterval) {
		clearInterval(this._gainTweenInterval);
		this._gainTweenInterval = null;
	}
	this._tweenGainStep = (this._tweenTargetGain - this._tweenGain) / (60 * duration);
	this._gainTweenInterval = setInterval(function () {
		Html5Audio._applyTweenValue(Html5Audio._tweenTargetGain);
	}, 1000 / 60);
};

/**
 * 应用补间值
 * Applies tween value.
 *
 * @static
 * @private
 * @method _applyTweenValue
 * @param {Number} volume - 音量值 / The volume value
 */
Html5Audio._applyTweenValue = function (volume) {
	Html5Audio._tweenGain += Html5Audio._tweenGainStep;
	if (Html5Audio._tweenGain < 0 && Html5Audio._tweenGainStep < 0) {
		Html5Audio._tweenGain = 0;
	} else if (Html5Audio._tweenGain > volume && Html5Audio._tweenGainStep > 0) {
		Html5Audio._tweenGain = volume;
	}

	if (Math.abs(Html5Audio._tweenTargetGain - Html5Audio._tweenGain) < 0.01) {
		Html5Audio._tweenGain = Html5Audio._tweenTargetGain;
		clearInterval(Html5Audio._gainTweenInterval);
		Html5Audio._gainTweenInterval = null;
	}

	Html5Audio._audioElement.volume = Html5Audio._tweenGain;
};

//-----------------------------------------------------------------------------
