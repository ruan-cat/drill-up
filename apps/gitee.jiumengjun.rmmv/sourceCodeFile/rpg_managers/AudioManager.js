/**
 * @fileoverview AudioManager - 音频管理器
 * @description 管理游戏中所有音频资源，包括BGM、BGS、ME和SE的播放控制
 * Manages all audio resources in the game, including playback control of BGM, BGS, ME and SE
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * AudioManager - 音频管理器
 * 
 * 操作 BGM, BGS, ME 和 SE 的静态类。
 * BGM：背景音乐，ME：效果音乐，BGS：背景音效，SE：音效
 * 
 * The static class that handles BGM, BGS, ME and SE.
 * BGM: Background Music, ME: Music Effect, BGS: Background Sound, SE: Sound Effect
 */
function AudioManager() {
    throw new Error('This is a static class');
}

AudioManager._masterVolume   = 1;         // 主音量（最小：0，最大：1）/ Master volume (min: 0, max: 1)
AudioManager._bgmVolume      = 100;       // BGM 音量 / BGM volume
AudioManager._bgsVolume      = 100;       // BGS 音量 / BGS volume
AudioManager._meVolume       = 100;       // ME 音量 / ME volume
AudioManager._seVolume       = 100;       // SE 音量 / SE volume
AudioManager._currentBgm     = null;      // 当前 BGM / Current BGM
AudioManager._currentBgs     = null;      // 当前 BGS / Current BGS
AudioManager._bgmBuffer      = null;      // BGM 缓冲区 / BGM buffer
AudioManager._bgsBuffer      = null;      // BGS 缓冲区 / BGS buffer
AudioManager._meBuffer       = null;      // ME 缓冲区 / ME buffer
AudioManager._seBuffers      = [];        // SE 缓冲区 / SE buffers
AudioManager._staticBuffers  = [];        // 静态缓冲区 / Static buffers
AudioManager._replayFadeTime = 0.5;       // 重播的淡入时间 / Replay fade time
AudioManager._path           = 'audio/';  // 路径 / Path
AudioManager._blobUrl        = null;      // 二进制大对象地址 / Blob URL

/**
 * 主音量属性
 * Master volume property
 */
Object.defineProperty(AudioManager, 'masterVolume', {
    get: function() {
        return this._masterVolume;
    },
    set: function(value) {
        this._masterVolume = value;
        WebAudio.setMasterVolume(this._masterVolume);
        Graphics.setVideoVolume(this._masterVolume);
    },
    configurable: true
});

/**
 * BGM 音量属性
 * BGM volume property
 */
Object.defineProperty(AudioManager, 'bgmVolume', {
    get: function() {
        return this._bgmVolume;
    },
    set: function(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    },
    configurable: true
});

/**
 * BGS 音量属性
 * BGS volume property
 */
Object.defineProperty(AudioManager, 'bgsVolume', {
    get: function() {
        return this._bgsVolume;
    },
    set: function(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    },
    configurable: true
});

/**
 * ME 音量属性
 * ME volume property
 */
Object.defineProperty(AudioManager, 'meVolume', {
    get: function() {
        return this._meVolume;
    },
    set: function(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    },
    configurable: true
});

/**
 * SE 音量属性
 * SE volume property
 */
Object.defineProperty(AudioManager, 'seVolume', {
    get: function() {
        return this._seVolume;
    },
    set: function(value) {
        this._seVolume = value;
    },
    configurable: true
});

/**
 * 播放 BGM
 * Play BGM
 * 
 * @param {Object} bgm - BGM对象 / BGM object
 * @param {number} pos - 播放位置 / Play position
 */
AudioManager.playBgm = function(bgm, pos) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.stopBgm();
        if (bgm.name) { 
            if(Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()){
                this.playEncryptedBgm(bgm, pos);
            }
            else {
                this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                this.updateBgmParameters(bgm);
                if (!this._meBuffer) {
                    this._bgmBuffer.play(true, pos || 0);
                }
            }
        }
    }
    this.updateCurrentBgm(bgm, pos);
};

/**
 * 播放加密的 BGM
 * Play encrypted BGM
 * 
 * @param {Object} bgm - BGM对象 / BGM object
 * @param {number} pos - 播放位置 / Play position
 */
AudioManager.playEncryptedBgm = function(bgm, pos) {
    var ext = this.audioFileExt();
    var url = this._path + 'bgm/' + encodeURIComponent(bgm.name) + ext;
    url = Decrypter.extToEncryptExt(url);
    Decrypter.decryptHTML5Audio(url, bgm, pos);
};

/**
 * 创建解密的缓冲区
 * Create decrypted buffer
 * 
 * @param {string} url - URL地址 / URL
 * @param {Object} bgm - BGM对象 / BGM object
 * @param {number} pos - 播放位置 / Play position
 */
AudioManager.createDecryptBuffer = function(url, bgm, pos){
    this._blobUrl = url;
    this._bgmBuffer = this.createBuffer('bgm', bgm.name);
    this.updateBgmParameters(bgm);
    if (!this._meBuffer) {
        this._bgmBuffer.play(true, pos || 0);
    }
    this.updateCurrentBgm(bgm, pos);
};

/**
 * 还原 BGM
 * Replay BGM
 * 
 * @param {Object} bgm - BGM对象 / BGM object
 */
AudioManager.replayBgm = function(bgm) {
    if (this.isCurrentBgm(bgm)) {
        this.updateBgmParameters(bgm);
    } else {
        this.playBgm(bgm, bgm.pos);
        if (this._bgmBuffer) {
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/**
 * 是否当前的 BGM
 * Check if current BGM
 * 
 * @param {Object} bgm - BGM对象 / BGM object
 * @returns {boolean} 是否当前BGM / Whether current BGM
 */
AudioManager.isCurrentBgm = function(bgm) {
    return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
};

/**
 * 更新 BGM 的参数
 * Update BGM parameters
 * 
 * @param {Object} bgm - BGM对象 / BGM object
 */
AudioManager.updateBgmParameters = function(bgm) {
    this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
};

/**
 * 更新当前的 BGM
 * Update current BGM
 * 
 * @param {Object} bgm - BGM对象 / BGM object
 * @param {number} pos - 播放位置 / Play position
 */
AudioManager.updateCurrentBgm = function(bgm, pos) {
    this._currentBgm = {
        name: bgm.name,      // 名字 / Name
        volume: bgm.volume,  // 音量 / Volume
        pitch: bgm.pitch,    // 音调 / Pitch
        pan: bgm.pan,        // 声像 / Pan
        pos: pos             // 缓冲区位置（播放的位置）/ Buffer position (playback position)
    };
};

/**
 * 停止 BGM
 * Stop BGM
 */
AudioManager.stopBgm = function() {
    if (this._bgmBuffer) {
        this._bgmBuffer.stop();
        this._bgmBuffer = null;
        this._currentBgm = null;
    }
};

/**
 * 淡出 BGM
 * Fade out BGM
 * 
 * @param {number} duration - 淡出时长 / Fade out duration
 */
AudioManager.fadeOutBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeOut(duration);
        this._currentBgm = null;
    }
};

/**
 * 淡入 BGM
 * Fade in BGM
 * 
 * @param {number} duration - 淡入时长 / Fade in duration
 */
AudioManager.fadeInBgm = function(duration) {
    if (this._bgmBuffer && this._currentBgm) {
        this._bgmBuffer.fadeIn(duration);
    }
};

/**
 * 播放 BGS
 * Play BGS
 * 
 * @param {Object} bgs - BGS对象 / BGS object
 * @param {number} pos - 播放位置 / Play position
 */
AudioManager.playBgs = function(bgs, pos) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.stopBgs();
        if (bgs.name) {
            this._bgsBuffer = this.createBuffer('bgs', bgs.name);
            this.updateBgsParameters(bgs);
            this._bgsBuffer.play(true, pos || 0);
        }
    }
    this.updateCurrentBgs(bgs, pos);
};

/**
 * 还原 BGS
 * Replay BGS
 * 
 * @param {Object} bgs - BGS对象 / BGS object
 */
AudioManager.replayBgs = function(bgs) {
    if (this.isCurrentBgs(bgs)) {
        this.updateBgsParameters(bgs);
    } else {
        this.playBgs(bgs, bgs.pos);
        if (this._bgsBuffer) {
            this._bgsBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/**
 * 是否当前的 BGS
 * Check if current BGS
 * 
 * @param {Object} bgs - BGS对象 / BGS object
 * @returns {boolean} 是否当前BGS / Whether current BGS
 */
AudioManager.isCurrentBgs = function(bgs) {
    return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
};

/**
 * 更新 BGS 的参数
 * Update BGS parameters
 * 
 * @param {Object} bgs - BGS对象 / BGS object
 */
AudioManager.updateBgsParameters = function(bgs) {
    this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
};

/**
 * 更新当前的 BGS
 * Update current BGS
 * 
 * @param {Object} bgs - BGS对象 / BGS object
 * @param {number} pos - 播放位置 / Play position
 */
AudioManager.updateCurrentBgs = function(bgs, pos) {
    this._currentBgs = {
        name: bgs.name,      // 名字 / Name
        volume: bgs.volume,  // 音量 / Volume
        pitch: bgs.pitch,    // 音调 / Pitch
        pan: bgs.pan,        // 声像 / Pan
        pos: pos             // 缓冲区位置（播放的位置）/ Buffer position (playback position)
    };
};

/**
 * 停止 BGS
 * Stop BGS
 */
AudioManager.stopBgs = function() {
    if (this._bgsBuffer) {
        this._bgsBuffer.stop();
        this._bgsBuffer = null;
        this._currentBgs = null;
    }
};

/**
 * 淡出 BGS
 * Fade out BGS
 * 
 * @param {number} duration - 淡出时长 / Fade out duration
 */
AudioManager.fadeOutBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeOut(duration);
        this._currentBgs = null;
    }
};

/**
 * 淡入 BGS
 * Fade in BGS
 * 
 * @param {number} duration - 淡入时长 / Fade in duration
 */
AudioManager.fadeInBgs = function(duration) {
    if (this._bgsBuffer && this._currentBgs) {
        this._bgsBuffer.fadeIn(duration);
    }
};

/**
 * 播放 ME
 * Play ME
 * 
 * @param {Object} me - ME对象 / ME object
 */
AudioManager.playMe = function(me) {
    this.stopMe();
    if (me.name) {
        if (this._bgmBuffer && this._currentBgm) {
            this._currentBgm.pos = this._bgmBuffer.seek();
            this._bgmBuffer.stop();
        }
        this._meBuffer = this.createBuffer('me', me.name);
        this.updateMeParameters(me);
        this._meBuffer.play(false);
        this._meBuffer.addStopListener(this.stopMe.bind(this));
    }
};

/**
 * 更新 ME 的参数
 * Update ME parameters
 * 
 * @param {Object} me - ME对象 / ME object
 */
AudioManager.updateMeParameters = function(me) {
    this.updateBufferParameters(this._meBuffer, this._meVolume, me);
};

/**
 * 淡出 ME
 * Fade out ME
 * 
 * @param {number} duration - 淡出时长 / Fade out duration
 */
AudioManager.fadeOutMe = function(duration) {
    if (this._meBuffer) {
        this._meBuffer.fadeOut(duration);
    }
};

/**
 * 停止 ME
 * Stop ME
 */
AudioManager.stopMe = function() {
    if (this._meBuffer) {
        this._meBuffer.stop();
        this._meBuffer = null;
        if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
            this._bgmBuffer.play(true, this._currentBgm.pos);
            this._bgmBuffer.fadeIn(this._replayFadeTime);
        }
    }
};

/**
 * 播放 SE
 * Play SE
 * 
 * @param {Object} se - SE对象 / SE object
 */
AudioManager.playSe = function(se) {
    if (se.name) {
        this._seBuffers = this._seBuffers.filter(function(audio) {
            return audio.isPlaying();
        });
        var buffer = this.createBuffer('se', se.name);
        this.updateSeParameters(buffer, se);
        buffer.play(false);
        this._seBuffers.push(buffer);
    }
};

/**
 * 更新 SE 的参数
 * Update SE parameters
 * 
 * @param {Object} buffer - 缓冲区对象 / Buffer object
 * @param {Object} se - SE对象 / SE object
 */
AudioManager.updateSeParameters = function(buffer, se) {
    this.updateBufferParameters(buffer, this._seVolume, se);
};

/**
 * 停止 SE
 * Stop SE
 */
AudioManager.stopSe = function() {
    this._seBuffers.forEach(function(buffer) {
        buffer.stop();
    });
    this._seBuffers = [];
};

/**
 * 播放静态 SE
 * Play static SE
 * 
 * @param {Object} se - SE对象 / SE object
 */
AudioManager.playStaticSe = function(se) {
    if (se.name) {
        this.loadStaticSe(se);
        for (var i = 0; i < this._staticBuffers.length; i++) {
            var buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                buffer.stop();
                this.updateSeParameters(buffer, se);
                buffer.play(false);
                break;
            }
        }
    }
};

/**
 * 加载静态 SE
 * Load static SE
 * 
 * @param {Object} se - SE对象 / SE object
 */
AudioManager.loadStaticSe = function(se) {
    if (se.name && !this.isStaticSe(se)) {
        var buffer = this.createBuffer('se', se.name);
        buffer._reservedSeName = se.name;
        this._staticBuffers.push(buffer);
        if (this.shouldUseHtml5Audio()) {
            Html5Audio.setStaticSe(buffer._url);
        }
    }
};

/**
 * 是否静态 SE
 * Check if static SE
 * 
 * @param {Object} se - SE对象 / SE object
 * @returns {boolean} 是否静态SE / Whether static SE
 */
AudioManager.isStaticSe = function(se) {
    for (var i = 0; i < this._staticBuffers.length; i++) {
        var buffer = this._staticBuffers[i];
        if (buffer._reservedSeName === se.name) {
            return true;
        }
    }
    return false;
};

/**
 * 停止所有音频
 * Stop all audio
 */
AudioManager.stopAll = function() {
    this.stopMe();
    this.stopBgm();
    this.stopBgs();
    this.stopSe();
};

/**
 * 保存 BGM 状态
 * Save BGM state
 * 
 * @returns {Object} BGM状态对象 / BGM state object
 */
AudioManager.saveBgm = function() {
    if (this._currentBgm) {
        var bgm = this._currentBgm;
        return {
            name: bgm.name,      // 名字 / Name
            volume: bgm.volume,  // 音量 / Volume
            pitch: bgm.pitch,    // 音调 / Pitch
            pan: bgm.pan,        // 声像 / Pan
            pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0  // 缓冲区位置（播放的位置）/ Buffer position (playback position)
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

/**
 * 保存 BGS 状态
 * Save BGS state
 * 
 * @returns {Object} BGS状态对象 / BGS state object
 */
AudioManager.saveBgs = function() {
    if (this._currentBgs) {
        var bgs = this._currentBgs;
        return {
            name: bgs.name,      // 名字 / Name
            volume: bgs.volume,  // 音量 / Volume
            pitch: bgs.pitch,    // 音调 / Pitch
            pan: bgs.pan,        // 声像 / Pan
            pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0  // 缓冲区位置（播放的位置）/ Buffer position (playback position)
        };
    } else {
        return this.makeEmptyAudioObject();
    }
};

/**
 * 制作空音频对象
 * Make empty audio object
 * 
 * @returns {Object} 空音频对象 / Empty audio object
 */
AudioManager.makeEmptyAudioObject = function() {
    return { name: '', volume: 0, pitch: 0 };
};

/**
 * 创建缓冲区
 * Create buffer
 * 
 * @param {string} folder - 文件夹名 / Folder name
 * @param {string} name - 文件名 / File name
 * @returns {Object} 音频缓冲区对象 / Audio buffer object
 */
AudioManager.createBuffer = function(folder, name) {
    var ext = this.audioFileExt();
    var url = this._path + folder + '/' + encodeURIComponent(name) + ext;
    if (this.shouldUseHtml5Audio() && folder === 'bgm') {
        if(this._blobUrl) Html5Audio.setup(this._blobUrl);
        else Html5Audio.setup(url);
        return Html5Audio;
    } else {
        return new WebAudio(url);
    }
};

/**
 * 更新缓冲区参数
 * Update buffer parameters
 * 
 * @param {Object} buffer - 缓冲区对象 / Buffer object
 * @param {number} configVolume - 配置音量 / Config volume
 * @param {Object} audio - 音频对象 / Audio object
 */
AudioManager.updateBufferParameters = function(buffer, configVolume, audio) {
    if (buffer && audio) {
        buffer.volume = configVolume * (audio.volume || 0) / 10000;
        buffer.pitch = (audio.pitch || 0) / 100;
        buffer.pan = (audio.pan || 0) / 100;
    }
};

/**
 * 音频文件扩展名
 * Audio file extension
 * 
 * @returns {string} 文件扩展名 / File extension
 */
AudioManager.audioFileExt = function() {
    if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
        return '.ogg';
    } else {
        return '.m4a';
    }
};

/**
 * 是否应该使用 Html5Audio
 * Whether should use Html5Audio
 * 
 * @returns {boolean} 是否使用Html5Audio / Whether use Html5Audio
 */
AudioManager.shouldUseHtml5Audio = function() {
    // 唯一需要 Html5Audio 的情况是 android/不加密
    // Atsuma-ru 要求强制 WebAudio 也在那里，所以全部只需返回 false 就可以了
    // The only case where we wanted html5audio was android/ no encrypt
    // Atsuma-ru asked to force webaudio there too, so just return false for ALL
    // return Utils.isAndroidChrome() && !Decrypter.hasEncryptedAudio;
    return false;
};

/**
 * 检测错误
 * Check errors
 */
AudioManager.checkErrors = function() {
    this.checkWebAudioError(this._bgmBuffer);
    this.checkWebAudioError(this._bgsBuffer);
    this.checkWebAudioError(this._meBuffer);
    this._seBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
    this._staticBuffers.forEach(function(buffer) {
        this.checkWebAudioError(buffer);
    }.bind(this));
};

/**
 * 检测 WebAudio 错误
 * Check WebAudio error
 * 
 * @param {Object} webAudio - WebAudio对象 / WebAudio object
 */
AudioManager.checkWebAudioError = function(webAudio) {
    if (webAudio && webAudio.isError()) {
        throw new Error('Failed to load: ' + webAudio.url);
    }
};