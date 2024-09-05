//=============================================================================
// rpg_objects.js v1.6.1
//=============================================================================

//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

function Game_Temp() {
    this.initialize.apply(this, arguments);
}

Game_Temp.prototype.initialize = function() {
    this._isPlaytest = Utils.isOptionValid('test');
    this._commonEventId = 0;
    this._destinationX = null;
    this._destinationY = null;
};

Game_Temp.prototype.isPlaytest = function() {
    return this._isPlaytest;
};

Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
    this._commonEventId = commonEventId;
};

Game_Temp.prototype.clearCommonEvent = function() {
    this._commonEventId = 0;
};

Game_Temp.prototype.isCommonEventReserved = function() {
    return this._commonEventId > 0;
};

Game_Temp.prototype.reservedCommonEvent = function() {
    return $dataCommonEvents[this._commonEventId];
};

Game_Temp.prototype.setDestination = function(x, y) {
    this._destinationX = x;
    this._destinationY = y;
};

Game_Temp.prototype.clearDestination = function() {
    this._destinationX = null;
    this._destinationY = null;
};

Game_Temp.prototype.isDestinationValid = function() {
    return this._destinationX !== null;
};

Game_Temp.prototype.destinationX = function() {
    return this._destinationX;
};

Game_Temp.prototype.destinationY = function() {
    return this._destinationY;
};

//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

function Game_System() {
    this.initialize.apply(this, arguments);
}

Game_System.prototype.initialize = function() {
    this._saveEnabled = true;
    this._menuEnabled = true;
    this._encounterEnabled = true;
    this._formationEnabled = true;
    this._battleCount = 0;
    this._winCount = 0;
    this._escapeCount = 0;
    this._saveCount = 0;
    this._versionId = 0;
    this._framesOnSave = 0;
    this._bgmOnSave = null;
    this._bgsOnSave = null;
    this._windowTone = null;
    this._battleBgm = null;
    this._victoryMe = null;
    this._defeatMe = null;
    this._savedBgm = null;
    this._walkingBgm = null;
};

Game_System.prototype.isJapanese = function() {
    return $dataSystem.locale.match(/^ja/);
};

Game_System.prototype.isChinese = function() {
    return $dataSystem.locale.match(/^zh/);
};

Game_System.prototype.isKorean = function() {
    return $dataSystem.locale.match(/^ko/);
};

Game_System.prototype.isCJK = function() {
    return $dataSystem.locale.match(/^(ja|zh|ko)/);
};

Game_System.prototype.isRussian = function() {
    return $dataSystem.locale.match(/^ru/);
};

Game_System.prototype.isSideView = function() {
    return $dataSystem.optSideView;
};

Game_System.prototype.isSaveEnabled = function() {
    return this._saveEnabled;
};

Game_System.prototype.disableSave = function() {
    this._saveEnabled = false;
};

Game_System.prototype.enableSave = function() {
    this._saveEnabled = true;
};

Game_System.prototype.isMenuEnabled = function() {
    return this._menuEnabled;
};

Game_System.prototype.disableMenu = function() {
    this._menuEnabled = false;
};

Game_System.prototype.enableMenu = function() {
    this._menuEnabled = true;
};

Game_System.prototype.isEncounterEnabled = function() {
    return this._encounterEnabled;
};

Game_System.prototype.disableEncounter = function() {
    this._encounterEnabled = false;
};

Game_System.prototype.enableEncounter = function() {
    this._encounterEnabled = true;
};

Game_System.prototype.isFormationEnabled = function() {
    return this._formationEnabled;
};

Game_System.prototype.disableFormation = function() {
    this._formationEnabled = false;
};

Game_System.prototype.enableFormation = function() {
    this._formationEnabled = true;
};

Game_System.prototype.battleCount = function() {
    return this._battleCount;
};

Game_System.prototype.winCount = function() {
    return this._winCount;
};

Game_System.prototype.escapeCount = function() {
    return this._escapeCount;
};

Game_System.prototype.saveCount = function() {
    return this._saveCount;
};

Game_System.prototype.versionId = function() {
    return this._versionId;
};

Game_System.prototype.windowTone = function() {
    return this._windowTone || $dataSystem.windowTone;
};

Game_System.prototype.setWindowTone = function(value) {
    this._windowTone = value;
};

Game_System.prototype.battleBgm = function() {
    return this._battleBgm || $dataSystem.battleBgm;
};

Game_System.prototype.setBattleBgm = function(value) {
    this._battleBgm = value;
};

Game_System.prototype.victoryMe = function() {
    return this._victoryMe || $dataSystem.victoryMe;
};

Game_System.prototype.setVictoryMe = function(value) {
    this._victoryMe = value;
};

Game_System.prototype.defeatMe = function() {
    return this._defeatMe || $dataSystem.defeatMe;
};

Game_System.prototype.setDefeatMe = function(value) {
    this._defeatMe = value;
};

Game_System.prototype.onBattleStart = function() {
    this._battleCount++;
};

Game_System.prototype.onBattleWin = function() {
    this._winCount++;
};

Game_System.prototype.onBattleEscape = function() {
    this._escapeCount++;
};

Game_System.prototype.onBeforeSave = function() {
    this._saveCount++;
    this._versionId = $dataSystem.versionId;
    this._framesOnSave = Graphics.frameCount;
    this._bgmOnSave = AudioManager.saveBgm();
    this._bgsOnSave = AudioManager.saveBgs();
};

Game_System.prototype.onAfterLoad = function() {
    Graphics.frameCount = this._framesOnSave;
    AudioManager.playBgm(this._bgmOnSave);
    AudioManager.playBgs(this._bgsOnSave);
};

Game_System.prototype.playtime = function() {
    return Math.floor(Graphics.frameCount / 60);
};

Game_System.prototype.playtimeText = function() {
    var hour = Math.floor(this.playtime() / 60 / 60);
    var min = Math.floor(this.playtime() / 60) % 60;
    var sec = this.playtime() % 60;
    return hour.padZero(2) + ':' + min.padZero(2) + ':' + sec.padZero(2);
};

Game_System.prototype.saveBgm = function() {
    this._savedBgm = AudioManager.saveBgm();
};

Game_System.prototype.replayBgm = function() {
    if (this._savedBgm) {
        AudioManager.replayBgm(this._savedBgm);
    }
};

Game_System.prototype.saveWalkingBgm = function() {
    this._walkingBgm = AudioManager.saveBgm();
};

Game_System.prototype.replayWalkingBgm = function() {
    if (this._walkingBgm) {
        AudioManager.playBgm(this._walkingBgm);
    }
};

Game_System.prototype.saveWalkingBgm2 = function() {
	this._walkingBgm = $dataMap.bgm;
};

//-----------------------------------------------------------------------------
// Game_Timer
//
// The game object class for the timer.

function Game_Timer() {
    this.initialize.apply(this, arguments);
}

Game_Timer.prototype.initialize = function() {
    this._frames = 0;
    this._working = false;
};

Game_Timer.prototype.update = function(sceneActive) {
    if (sceneActive && this._working && this._frames > 0) {
        this._frames--;
        if (this._frames === 0) {
            this.onExpire();
        }
    }
};

Game_Timer.prototype.start = function(count) {
    this._frames = count;
    this._working = true;
};

Game_Timer.prototype.stop = function() {
    this._working = false;
};

Game_Timer.prototype.isWorking = function() {
    return this._working;
};

Game_Timer.prototype.seconds = function() {
    return Math.floor(this._frames / 60);
};

Game_Timer.prototype.onExpire = function() {
    BattleManager.abort();
};

//-----------------------------------------------------------------------------
// Game_Message
//
// The game object class for the state of the message window that displays text
// or selections, etc.

function Game_Message() {
    this.initialize.apply(this, arguments);
}

Game_Message.prototype.initialize = function() {
    this.clear();
};

Game_Message.prototype.clear = function() {
    this._texts = [];
    this._choices = [];
    this._faceName = '';
    this._faceIndex = 0;
    this._background = 0;
    this._positionType = 2;
    this._choiceDefaultType = 0;
    this._choiceCancelType = 0;
    this._choiceBackground = 0;
    this._choicePositionType = 2;
    this._numInputVariableId = 0;
    this._numInputMaxDigits = 0;
    this._itemChoiceVariableId = 0;
    this._itemChoiceItypeId = 0;
    this._scrollMode = false;
    this._scrollSpeed = 2;
    this._scrollNoFast = false;
    this._choiceCallback = null;
};

Game_Message.prototype.choices = function() {
    return this._choices;
};

Game_Message.prototype.faceName = function() {
    return this._faceName;
};

Game_Message.prototype.faceIndex = function() {
    return this._faceIndex;
};

Game_Message.prototype.background = function() {
    return this._background;
};

Game_Message.prototype.positionType = function() {
    return this._positionType;
};

Game_Message.prototype.choiceDefaultType = function() {
    return this._choiceDefaultType;
};

Game_Message.prototype.choiceCancelType = function() {
    return this._choiceCancelType;
};

Game_Message.prototype.choiceBackground = function() {
    return this._choiceBackground;
};

Game_Message.prototype.choicePositionType = function() {
    return this._choicePositionType;
};

Game_Message.prototype.numInputVariableId = function() {
    return this._numInputVariableId;
};

Game_Message.prototype.numInputMaxDigits = function() {
    return this._numInputMaxDigits;
};

Game_Message.prototype.itemChoiceVariableId = function() {
    return this._itemChoiceVariableId;
};

Game_Message.prototype.itemChoiceItypeId = function() {
    return this._itemChoiceItypeId;
};

Game_Message.prototype.scrollMode = function() {
    return this._scrollMode;
};

Game_Message.prototype.scrollSpeed = function() {
    return this._scrollSpeed;
};

Game_Message.prototype.scrollNoFast = function() {
    return this._scrollNoFast;
};

Game_Message.prototype.add = function(text) {
    this._texts.push(text);
};

Game_Message.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

Game_Message.prototype.setBackground = function(background) {
    this._background = background;
};

Game_Message.prototype.setPositionType = function(positionType) {
    this._positionType = positionType;
};

Game_Message.prototype.setChoices = function(choices, defaultType, cancelType) {
    this._choices = choices;
    this._choiceDefaultType = defaultType;
    this._choiceCancelType = cancelType;
};

Game_Message.prototype.setChoiceBackground = function(background) {
    this._choiceBackground = background;
};

Game_Message.prototype.setChoicePositionType = function(positionType) {
    this._choicePositionType = positionType;
};

Game_Message.prototype.setNumberInput = function(variableId, maxDigits) {
    this._numInputVariableId = variableId;
    this._numInputMaxDigits = maxDigits;
};

Game_Message.prototype.setItemChoice = function(variableId, itemType) {
    this._itemChoiceVariableId = variableId;
    this._itemChoiceItypeId = itemType;
};

Game_Message.prototype.setScroll = function(speed, noFast) {
    this._scrollMode = true;
    this._scrollSpeed = speed;
    this._scrollNoFast = noFast;
};

Game_Message.prototype.setChoiceCallback = function(callback) {
    this._choiceCallback = callback;
};

Game_Message.prototype.onChoice = function(n) {
    if (this._choiceCallback) {
        this._choiceCallback(n);
        this._choiceCallback = null;
    }
};

Game_Message.prototype.hasText = function() {
    return this._texts.length > 0;
};

Game_Message.prototype.isChoice = function() {
    return this._choices.length > 0;
};

Game_Message.prototype.isNumberInput = function() {
    return this._numInputVariableId > 0;
};

Game_Message.prototype.isItemChoice = function() {
    return this._itemChoiceVariableId > 0;
};

Game_Message.prototype.isBusy = function() {
    return (this.hasText() || this.isChoice() ||
            this.isNumberInput() || this.isItemChoice());
};

Game_Message.prototype.newPage = function() {
    if (this._texts.length > 0) {
        this._texts[this._texts.length - 1] += '\f';
    }
};

Game_Message.prototype.allText = function() {
    return this._texts.join('\n');
};

//-----------------------------------------------------------------------------
// Game_Switches
//
// The game object class for switches.

function Game_Switches() {
    this.initialize.apply(this, arguments);
}

Game_Switches.prototype.initialize = function() {
    this.clear();
};

Game_Switches.prototype.clear = function() {
    this._data = [];
};

Game_Switches.prototype.value = function(switchId) {
    return !!this._data[switchId];
};

Game_Switches.prototype.setValue = function(switchId, value) {
    if (switchId > 0 && switchId < $dataSystem.switches.length) {
        this._data[switchId] = value;
        this.onChange();
    }
};

Game_Switches.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Variables
//
// The game object class for variables.

function Game_Variables() {
    this.initialize.apply(this, arguments);
}

Game_Variables.prototype.initialize = function() {
    this.clear();
};

Game_Variables.prototype.clear = function() {
    this._data = [];
};

Game_Variables.prototype.value = function(variableId) {
    return this._data[variableId] || 0;
};

Game_Variables.prototype.setValue = function(variableId, value) {
    if (variableId > 0 && variableId < $dataSystem.variables.length) {
        if (typeof value === 'number') {
            value = Math.floor(value);
        }
        this._data[variableId] = value;
        this.onChange();
    }
};

Game_Variables.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_SelfSwitches
//
// The game object class for self switches.

function Game_SelfSwitches() {
    this.initialize.apply(this, arguments);
}

Game_SelfSwitches.prototype.initialize = function() {
    this.clear();
};

Game_SelfSwitches.prototype.clear = function() {
    this._data = {};
};

Game_SelfSwitches.prototype.value = function(key) {
    return !!this._data[key];
};

Game_SelfSwitches.prototype.setValue = function(key, value) {
    if (value) {
        this._data[key] = true;
    } else {
        delete this._data[key];
    }
    this.onChange();
};

Game_SelfSwitches.prototype.onChange = function() {
    $gameMap.requestRefresh();
};

//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

function Game_Screen() {
    this.initialize.apply(this, arguments);
}

Game_Screen.prototype.initialize = function() {
    this.clear();
};

Game_Screen.prototype.clear = function() {
    this.clearFade();
    this.clearTone();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.clearWeather();
    this.clearPictures();
};

Game_Screen.prototype.onBattleStart = function() {
    this.clearFade();
    this.clearFlash();
    this.clearShake();
    this.clearZoom();
    this.eraseBattlePictures();
};

Game_Screen.prototype.brightness = function() {
    return this._brightness;
};

Game_Screen.prototype.tone = function() {
    return this._tone;
};

Game_Screen.prototype.flashColor = function() {
    return this._flashColor;
};

Game_Screen.prototype.shake = function() {
    return this._shake;
};

Game_Screen.prototype.zoomX = function() {
    return this._zoomX;
};

Game_Screen.prototype.zoomY = function() {
    return this._zoomY;
};

Game_Screen.prototype.zoomScale = function() {
    return this._zoomScale;
};

Game_Screen.prototype.weatherType = function() {
    return this._weatherType;
};

Game_Screen.prototype.weatherPower = function() {
    return this._weatherPower;
};

Game_Screen.prototype.picture = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    return this._pictures[realPictureId];
};

Game_Screen.prototype.realPictureId = function(pictureId) {
    if ($gameParty.inBattle()) {
        return pictureId + this.maxPictures();
    } else {
        return pictureId;
    }
};

Game_Screen.prototype.clearFade = function() {
    this._brightness = 255;
    this._fadeOutDuration = 0;
    this._fadeInDuration = 0;
};

Game_Screen.prototype.clearTone = function() {
    this._tone = [0, 0, 0, 0];
    this._toneTarget = [0, 0, 0, 0];
    this._toneDuration = 0;
};

Game_Screen.prototype.clearFlash = function() {
    this._flashColor = [0, 0, 0, 0];
    this._flashDuration = 0;
};

Game_Screen.prototype.clearShake = function() {
    this._shakePower = 0;
    this._shakeSpeed = 0;
    this._shakeDuration = 0;
    this._shakeDirection = 1;
    this._shake = 0;
};

Game_Screen.prototype.clearZoom = function() {
    this._zoomX = 0;
    this._zoomY = 0;
    this._zoomScale = 1;
    this._zoomScaleTarget = 1;
    this._zoomDuration = 0;
};

Game_Screen.prototype.clearWeather = function() {
    this._weatherType = 'none';
    this._weatherPower = 0;
    this._weatherPowerTarget = 0;
    this._weatherDuration = 0;
};

Game_Screen.prototype.clearPictures = function() {
    this._pictures = [];
};

Game_Screen.prototype.eraseBattlePictures = function() {
    this._pictures = this._pictures.slice(0, this.maxPictures() + 1);
};

Game_Screen.prototype.maxPictures = function() {
    return 100;
};

Game_Screen.prototype.startFadeOut = function(duration) {
    this._fadeOutDuration = duration;
    this._fadeInDuration = 0;
};

Game_Screen.prototype.startFadeIn = function(duration) {
    this._fadeInDuration = duration;
    this._fadeOutDuration = 0;
};

Game_Screen.prototype.startTint = function(tone, duration) {
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

Game_Screen.prototype.startFlash = function(color, duration) {
    this._flashColor = color.clone();
    this._flashDuration = duration;
};

Game_Screen.prototype.startShake = function(power, speed, duration) {
    this._shakePower = power;
    this._shakeSpeed = speed;
    this._shakeDuration = duration;
};

Game_Screen.prototype.startZoom = function(x, y, scale, duration) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScaleTarget = scale;
    this._zoomDuration = duration;
};

Game_Screen.prototype.setZoom = function(x, y, scale) {
    this._zoomX = x;
    this._zoomY = y;
    this._zoomScale = scale;
};

Game_Screen.prototype.changeWeather = function(type, power, duration) {
    if (type !== 'none' || duration === 0) {
        this._weatherType = type;
    }
    this._weatherPowerTarget = type === 'none' ? 0 : power;
    this._weatherDuration = duration;
    if (duration === 0) {
        this._weatherPower = this._weatherPowerTarget;
    }
};

Game_Screen.prototype.update = function() {
    this.updateFadeOut();
    this.updateFadeIn();
    this.updateTone();
    this.updateFlash();
    this.updateShake();
    this.updateZoom();
    this.updateWeather();
    this.updatePictures();
};

Game_Screen.prototype.updateFadeOut = function() {
    if (this._fadeOutDuration > 0) {
        var d = this._fadeOutDuration;
        this._brightness = (this._brightness * (d - 1)) / d;
        this._fadeOutDuration--;
    }
};

Game_Screen.prototype.updateFadeIn = function() {
    if (this._fadeInDuration > 0) {
        var d = this._fadeInDuration;
        this._brightness = (this._brightness * (d - 1) + 255) / d;
        this._fadeInDuration--;
    }
};

Game_Screen.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

Game_Screen.prototype.updateFlash = function() {
    if (this._flashDuration > 0) {
        var d = this._flashDuration;
        this._flashColor[3] *= (d - 1) / d;
        this._flashDuration--;
    }
};

Game_Screen.prototype.updateShake = function() {
    if (this._shakeDuration > 0 || this._shake !== 0) {
        var delta = (this._shakePower * this._shakeSpeed * this._shakeDirection) / 10;
        if (this._shakeDuration <= 1 && this._shake * (this._shake + delta) < 0) {
            this._shake = 0;
        } else {
            this._shake += delta;
        }
        if (this._shake > this._shakePower * 2) {
            this._shakeDirection = -1;
        }
        if (this._shake < - this._shakePower * 2) {
            this._shakeDirection = 1;
        }
        this._shakeDuration--;
    }
};

Game_Screen.prototype.updateZoom = function() {
    if (this._zoomDuration > 0) {
        var d = this._zoomDuration;
        var t = this._zoomScaleTarget;
        this._zoomScale = (this._zoomScale * (d - 1) + t) / d;
        this._zoomDuration--;
    }
};

Game_Screen.prototype.updateWeather = function() {
    if (this._weatherDuration > 0) {
        var d = this._weatherDuration;
        var t = this._weatherPowerTarget;
        this._weatherPower = (this._weatherPower * (d - 1) + t) / d;
        this._weatherDuration--;
        if (this._weatherDuration === 0 && this._weatherPowerTarget === 0) {
            this._weatherType = 'none';
        }
    }
};

Game_Screen.prototype.updatePictures = function() {
    this._pictures.forEach(function(picture) {
        if (picture) {
            picture.update();
        }
    });
};

Game_Screen.prototype.startFlashForDamage = function() {
    this.startFlash([255, 0, 0, 128], 8);
};

Game_Screen.prototype.showPicture = function(pictureId, name, origin, x, y,
                                             scaleX, scaleY, opacity, blendMode) {
    var realPictureId = this.realPictureId(pictureId);
    var picture = new Game_Picture();
    picture.show(name, origin, x, y, scaleX, scaleY, opacity, blendMode);
    this._pictures[realPictureId] = picture;
};

Game_Screen.prototype.movePicture = function(pictureId, origin, x, y, scaleX,
                                             scaleY, opacity, blendMode, duration) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.move(origin, x, y, scaleX, scaleY, opacity, blendMode, duration);
    }
};

Game_Screen.prototype.rotatePicture = function(pictureId, speed) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.rotate(speed);
    }
};

Game_Screen.prototype.tintPicture = function(pictureId, tone, duration) {
    var picture = this.picture(pictureId);
    if (picture) {
        picture.tint(tone, duration);
    }
};

Game_Screen.prototype.erasePicture = function(pictureId) {
    var realPictureId = this.realPictureId(pictureId);
    this._pictures[realPictureId] = null;
};

//-----------------------------------------------------------------------------
// Game_Picture
//
// The game object class for a picture.

function Game_Picture() {
    this.initialize.apply(this, arguments);
}

Game_Picture.prototype.initialize = function() {
    this.initBasic();
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.name = function() {
    return this._name;
};

Game_Picture.prototype.origin = function() {
    return this._origin;
};

Game_Picture.prototype.x = function() {
    return this._x;
};

Game_Picture.prototype.y = function() {
    return this._y;
};

Game_Picture.prototype.scaleX = function() {
    return this._scaleX;
};

Game_Picture.prototype.scaleY = function() {
    return this._scaleY;
};

Game_Picture.prototype.opacity = function() {
    return this._opacity;
};

Game_Picture.prototype.blendMode = function() {
    return this._blendMode;
};

Game_Picture.prototype.tone = function() {
    return this._tone;
};

Game_Picture.prototype.angle = function() {
    return this._angle;
};

Game_Picture.prototype.initBasic = function() {
    this._name = '';
    this._origin = 0;
    this._x = 0;
    this._y = 0;
    this._scaleX = 100;
    this._scaleY = 100;
    this._opacity = 255;
    this._blendMode = 0;
};

Game_Picture.prototype.initTarget = function() {
    this._targetX = this._x;
    this._targetY = this._y;
    this._targetScaleX = this._scaleX;
    this._targetScaleY = this._scaleY;
    this._targetOpacity = this._opacity;
    this._duration = 0;
};

Game_Picture.prototype.initTone = function() {
    this._tone = null;
    this._toneTarget = null;
    this._toneDuration = 0;
};

Game_Picture.prototype.initRotation = function() {
    this._angle = 0;
    this._rotationSpeed = 0;
};

Game_Picture.prototype.show = function(name, origin, x, y, scaleX,
                                       scaleY, opacity, blendMode) {
    this._name = name;
    this._origin = origin;
    this._x = x;
    this._y = y;
    this._scaleX = scaleX;
    this._scaleY = scaleY;
    this._opacity = opacity;
    this._blendMode = blendMode;
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.move = function(origin, x, y, scaleX, scaleY,
                                       opacity, blendMode, duration) {
    this._origin = origin;
    this._targetX = x;
    this._targetY = y;
    this._targetScaleX = scaleX;
    this._targetScaleY = scaleY;
    this._targetOpacity = opacity;
    this._blendMode = blendMode;
    this._duration = duration;
};

Game_Picture.prototype.rotate = function(speed) {
    this._rotationSpeed = speed;
};

Game_Picture.prototype.tint = function(tone, duration) {
    if (!this._tone) {
        this._tone = [0, 0, 0, 0];
    }
    this._toneTarget = tone.clone();
    this._toneDuration = duration;
    if (this._toneDuration === 0) {
        this._tone = this._toneTarget.clone();
    }
};

Game_Picture.prototype.erase = function() {
    this._name = '';
    this._origin = 0;
    this.initTarget();
    this.initTone();
    this.initRotation();
};

Game_Picture.prototype.update = function() {
    this.updateMove();
    this.updateTone();
    this.updateRotation();
};

Game_Picture.prototype.updateMove = function() {
    if (this._duration > 0) {
        var d = this._duration;
        this._x = (this._x * (d - 1) + this._targetX) / d;
        this._y = (this._y * (d - 1) + this._targetY) / d;
        this._scaleX  = (this._scaleX  * (d - 1) + this._targetScaleX)  / d;
        this._scaleY  = (this._scaleY  * (d - 1) + this._targetScaleY)  / d;
        this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
        this._duration--;
    }
};

Game_Picture.prototype.updateTone = function() {
    if (this._toneDuration > 0) {
        var d = this._toneDuration;
        for (var i = 0; i < 4; i++) {
            this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
        }
        this._toneDuration--;
    }
};

Game_Picture.prototype.updateRotation = function() {
    if (this._rotationSpeed !== 0) {
        this._angle += this._rotationSpeed / 2;
    }
};

//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.

function Game_Item() {
    this.initialize.apply(this, arguments);
}

Game_Item.prototype.initialize = function(item) {
    this._dataClass = '';
    this._itemId = 0;
    if (item) {
        this.setObject(item);
    }
};

Game_Item.prototype.isSkill = function() {
    return this._dataClass === 'skill';
};

Game_Item.prototype.isItem = function() {
    return this._dataClass === 'item';
};

Game_Item.prototype.isUsableItem = function() {
    return this.isSkill() || this.isItem();
};

Game_Item.prototype.isWeapon = function() {
    return this._dataClass === 'weapon';
};

Game_Item.prototype.isArmor = function() {
    return this._dataClass === 'armor';
};

Game_Item.prototype.isEquipItem = function() {
    return this.isWeapon() || this.isArmor();
};

Game_Item.prototype.isNull = function() {
    return this._dataClass === '';
};

Game_Item.prototype.itemId = function() {
    return this._itemId;
};

Game_Item.prototype.object = function() {
    if (this.isSkill()) {
        return $dataSkills[this._itemId];
    } else if (this.isItem()) {
        return $dataItems[this._itemId];
    } else if (this.isWeapon()) {
        return $dataWeapons[this._itemId];
    } else if (this.isArmor()) {
        return $dataArmors[this._itemId];
    } else {
        return null;
    }
};

Game_Item.prototype.setObject = function(item) {
    if (DataManager.isSkill(item)) {
        this._dataClass = 'skill';
    } else if (DataManager.isItem(item)) {
        this._dataClass = 'item';
    } else if (DataManager.isWeapon(item)) {
        this._dataClass = 'weapon';
    } else if (DataManager.isArmor(item)) {
        this._dataClass = 'armor';
    } else {
        this._dataClass = '';
    }
    this._itemId = item ? item.id : 0;
};

Game_Item.prototype.setEquip = function(isWeapon, itemId) {
    this._dataClass = isWeapon ? 'weapon' : 'armor';
    this._itemId = itemId;
};

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

function Game_Action() {
    this.initialize.apply(this, arguments);
}

Game_Action.EFFECT_RECOVER_HP       = 11;
Game_Action.EFFECT_RECOVER_MP       = 12;
Game_Action.EFFECT_GAIN_TP          = 13;
Game_Action.EFFECT_ADD_STATE        = 21;
Game_Action.EFFECT_REMOVE_STATE     = 22;
Game_Action.EFFECT_ADD_BUFF         = 31;
Game_Action.EFFECT_ADD_DEBUFF       = 32;
Game_Action.EFFECT_REMOVE_BUFF      = 33;
Game_Action.EFFECT_REMOVE_DEBUFF    = 34;
Game_Action.EFFECT_SPECIAL          = 41;
Game_Action.EFFECT_GROW             = 42;
Game_Action.EFFECT_LEARN_SKILL      = 43;
Game_Action.EFFECT_COMMON_EVENT     = 44;
Game_Action.SPECIAL_EFFECT_ESCAPE   = 0;
Game_Action.HITTYPE_CERTAIN         = 0;
Game_Action.HITTYPE_PHYSICAL        = 1;
Game_Action.HITTYPE_MAGICAL         = 2;

Game_Action.prototype.initialize = function(subject, forcing) {
    this._subjectActorId = 0;
    this._subjectEnemyIndex = -1;
    this._forcing = forcing || false;
    this.setSubject(subject);
    this.clear();
};

Game_Action.prototype.clear = function() {
    this._item = new Game_Item();
    this._targetIndex = -1;
};

Game_Action.prototype.setSubject = function(subject) {
    if (subject.isActor()) {
        this._subjectActorId = subject.actorId();
        this._subjectEnemyIndex = -1;
    } else {
        this._subjectEnemyIndex = subject.index();
        this._subjectActorId = 0;
    }
};

Game_Action.prototype.subject = function() {
    if (this._subjectActorId > 0) {
        return $gameActors.actor(this._subjectActorId);
    } else {
        return $gameTroop.members()[this._subjectEnemyIndex];
    }
};

Game_Action.prototype.friendsUnit = function() {
    return this.subject().friendsUnit();
};

Game_Action.prototype.opponentsUnit = function() {
    return this.subject().opponentsUnit();
};

Game_Action.prototype.setEnemyAction = function(action) {
    if (action) {
        this.setSkill(action.skillId);
    } else {
        this.clear();
    }
};

Game_Action.prototype.setAttack = function() {
    this.setSkill(this.subject().attackSkillId());
};

Game_Action.prototype.setGuard = function() {
    this.setSkill(this.subject().guardSkillId());
};

Game_Action.prototype.setSkill = function(skillId) {
    this._item.setObject($dataSkills[skillId]);
};

Game_Action.prototype.setItem = function(itemId) {
    this._item.setObject($dataItems[itemId]);
};

Game_Action.prototype.setItemObject = function(object) {
    this._item.setObject(object);
};

Game_Action.prototype.setTarget = function(targetIndex) {
    this._targetIndex = targetIndex;
};

Game_Action.prototype.item = function() {
    return this._item.object();
};

Game_Action.prototype.isSkill = function() {
    return this._item.isSkill();
};

Game_Action.prototype.isItem = function() {
    return this._item.isItem();
};

Game_Action.prototype.numRepeats = function() {
    var repeats = this.item().repeats;
    if (this.isAttack()) {
        repeats += this.subject().attackTimesAdd();
    }
    return Math.floor(repeats);
};

Game_Action.prototype.checkItemScope = function(list) {
    return list.contains(this.item().scope);
};

Game_Action.prototype.isForOpponent = function() {
    return this.checkItemScope([1, 2, 3, 4, 5, 6]);
};

Game_Action.prototype.isForFriend = function() {
    return this.checkItemScope([7, 8, 9, 10, 11]);
};

Game_Action.prototype.isForDeadFriend = function() {
    return this.checkItemScope([9, 10]);
};

Game_Action.prototype.isForUser = function() {
    return this.checkItemScope([11]);
};

Game_Action.prototype.isForOne = function() {
    return this.checkItemScope([1, 3, 7, 9, 11]);
};

Game_Action.prototype.isForRandom = function() {
    return this.checkItemScope([3, 4, 5, 6]);
};

Game_Action.prototype.isForAll = function() {
    return this.checkItemScope([2, 8, 10]);
};

Game_Action.prototype.needsSelection = function() {
    return this.checkItemScope([1, 7, 9]);
};

Game_Action.prototype.numTargets = function() {
    return this.isForRandom() ? this.item().scope - 2 : 0;
};

Game_Action.prototype.checkDamageType = function(list) {
    return list.contains(this.item().damage.type);
};

Game_Action.prototype.isHpEffect = function() {
    return this.checkDamageType([1, 3, 5]);
};

Game_Action.prototype.isMpEffect = function() {
    return this.checkDamageType([2, 4, 6]);
};

Game_Action.prototype.isDamage = function() {
    return this.checkDamageType([1, 2]);
};

Game_Action.prototype.isRecover = function() {
    return this.checkDamageType([3, 4]);
};

Game_Action.prototype.isDrain = function() {
    return this.checkDamageType([5, 6]);
};

Game_Action.prototype.isHpRecover = function() {
    return this.checkDamageType([3]);
};

Game_Action.prototype.isMpRecover = function() {
    return this.checkDamageType([4]);
};

Game_Action.prototype.isCertainHit = function() {
    return this.item().hitType === Game_Action.HITTYPE_CERTAIN;
};

Game_Action.prototype.isPhysical = function() {
    return this.item().hitType === Game_Action.HITTYPE_PHYSICAL;
};

Game_Action.prototype.isMagical = function() {
    return this.item().hitType === Game_Action.HITTYPE_MAGICAL;
};

Game_Action.prototype.isAttack = function() {
    return this.item() === $dataSkills[this.subject().attackSkillId()];
};

Game_Action.prototype.isGuard = function() {
    return this.item() === $dataSkills[this.subject().guardSkillId()];
};

Game_Action.prototype.isMagicSkill = function() {
    if (this.isSkill()) {
        return $dataSystem.magicSkills.contains(this.item().stypeId);
    } else {
        return false;
    }
};

Game_Action.prototype.decideRandomTarget = function() {
    var target;
    if (this.isForDeadFriend()) {
        target = this.friendsUnit().randomDeadTarget();
    } else if (this.isForFriend()) {
        target = this.friendsUnit().randomTarget();
    } else {
        target = this.opponentsUnit().randomTarget();
    }
    if (target) {
        this._targetIndex = target.index();
    } else {
        this.clear();
    }
};

Game_Action.prototype.setConfusion = function() {
    this.setAttack();
};

Game_Action.prototype.prepare = function() {
    if (this.subject().isConfused() && !this._forcing) {
        this.setConfusion();
    }
};

Game_Action.prototype.isValid = function() {
    return (this._forcing && this.item()) || this.subject().canUse(this.item());
};

Game_Action.prototype.speed = function() {
    var agi = this.subject().agi;
    var speed = agi + Math.randomInt(Math.floor(5 + agi / 4));
    if (this.item()) {
        speed += this.item().speed;
    }
    if (this.isAttack()) {
        speed += this.subject().attackSpeed();
    }
    return speed;
};

Game_Action.prototype.makeTargets = function() {
    var targets = [];
    if (!this._forcing && this.subject().isConfused()) {
        targets = [this.confusionTarget()];
    } else if (this.isForOpponent()) {
        targets = this.targetsForOpponents();
    } else if (this.isForFriend()) {
        targets = this.targetsForFriends();
    }
    return this.repeatTargets(targets);
};

Game_Action.prototype.repeatTargets = function(targets) {
    var repeatedTargets = [];
    var repeats = this.numRepeats();
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if (target) {
            for (var j = 0; j < repeats; j++) {
                repeatedTargets.push(target);
            }
        }
    }
    return repeatedTargets;
};

Game_Action.prototype.confusionTarget = function() {
    switch (this.subject().confusionLevel()) {
    case 1:
        return this.opponentsUnit().randomTarget();
    case 2:
        if (Math.randomInt(2) === 0) {
            return this.opponentsUnit().randomTarget();
        }
        return this.friendsUnit().randomTarget();
    default:
        return this.friendsUnit().randomTarget();
    }
};

Game_Action.prototype.targetsForOpponents = function() {
    var targets = [];
    var unit = this.opponentsUnit();
    if (this.isForRandom()) {
        for (var i = 0; i < this.numTargets(); i++) {
            targets.push(unit.randomTarget());
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget());
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

Game_Action.prototype.targetsForFriends = function() {
    var targets = [];
    var unit = this.friendsUnit();
    if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        if (this.isForOne()) {
            targets.push(unit.smoothDeadTarget(this._targetIndex));
        } else {
            targets = unit.deadMembers();
        }
    } else if (this.isForOne()) {
        if (this._targetIndex < 0) {
            targets.push(unit.randomTarget());
        } else {
            targets.push(unit.smoothTarget(this._targetIndex));
        }
    } else {
        targets = unit.aliveMembers();
    }
    return targets;
};

Game_Action.prototype.evaluate = function() {
    var value = 0;
    this.itemTargetCandidates().forEach(function(target) {
        var targetValue = this.evaluateWithTarget(target);
        if (this.isForAll()) {
            value += targetValue;
        } else if (targetValue > value) {
            value = targetValue;
            this._targetIndex = target.index();
        }
    }, this);
    value *= this.numRepeats();
    if (value > 0) {
        value += Math.random();
    }
    return value;
};

Game_Action.prototype.itemTargetCandidates = function() {
    if (!this.isValid()) {
        return [];
    } else if (this.isForOpponent()) {
        return this.opponentsUnit().aliveMembers();
    } else if (this.isForUser()) {
        return [this.subject()];
    } else if (this.isForDeadFriend()) {
        return this.friendsUnit().deadMembers();
    } else {
        return this.friendsUnit().aliveMembers();
    }
};

Game_Action.prototype.evaluateWithTarget = function(target) {
    if (this.isHpEffect()) {
        var value = this.makeDamageValue(target, false);
        if (this.isForOpponent()) {
            return value / Math.max(target.hp, 1);
        } else {
            var recovery = Math.min(-value, target.mhp - target.hp);
            return recovery / target.mhp;
        }
    }
};

Game_Action.prototype.testApply = function(target) {
    return (this.isForDeadFriend() === target.isDead() &&
            ($gameParty.inBattle() || this.isForOpponent() ||
            (this.isHpRecover() && target.hp < target.mhp) ||
            (this.isMpRecover() && target.mp < target.mmp) ||
            (this.hasItemAnyValidEffects(target))));
};

Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return this.item().effects.some(function(effect) {
        return this.testItemEffect(target, effect);
    }, this);
};

Game_Action.prototype.testItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        return target.hp < target.mhp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_RECOVER_MP:
        return target.mp < target.mmp || effect.value1 < 0 || effect.value2 < 0;
    case Game_Action.EFFECT_ADD_STATE:
        return !target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_STATE:
        return target.isStateAffected(effect.dataId);
    case Game_Action.EFFECT_ADD_BUFF:
        return !target.isMaxBuffAffected(effect.dataId);
    case Game_Action.EFFECT_ADD_DEBUFF:
        return !target.isMaxDebuffAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_BUFF:
        return target.isBuffAffected(effect.dataId);
    case Game_Action.EFFECT_REMOVE_DEBUFF:
        return target.isDebuffAffected(effect.dataId);
    case Game_Action.EFFECT_LEARN_SKILL:
        return target.isActor() && !target.isLearnedSkill(effect.dataId);
    default:
        return true;
    }
};

Game_Action.prototype.itemCnt = function(target) {
    if (this.isPhysical() && target.canMove()) {
        return target.cnt;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemMrf = function(target) {
    if (this.isMagical()) {
        return target.mrf;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemHit = function(target) {
    if (this.isPhysical()) {
        return this.item().successRate * 0.01 * this.subject().hit;
    } else {
        return this.item().successRate * 0.01;
    }
};

Game_Action.prototype.itemEva = function(target) {
    if (this.isPhysical()) {
        return target.eva;
    } else if (this.isMagical()) {
        return target.mev;
    } else {
        return 0;
    }
};

Game_Action.prototype.itemCri = function(target) {
    return this.item().damage.critical ? this.subject().cri * (1 - target.cev) : 0;
};

Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.makeDamageValue(target, result.critical);
			if (value == 0) {
				//result.critical = false; //!!最小伤害为1
				value = 1 ;
			}
            this.executeDamage(target, value);
        }
        this.item().effects.forEach(function(effect) {
            this.applyItemEffect(target, effect);
        }, this);
        this.applyItemUserEffect(target);
    }
};

Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
};

Game_Action.prototype.evalDamageFormula = function(target) {
    try {
        var item = this.item();
        var a = this.subject();
        var b = target;
        var v = $gameVariables._data;
        var sign = ([3, 4].contains(item.damage.type) ? -1 : 1);
        var value = Math.max(eval(item.damage.formula), 0) * sign;
		if (isNaN(value)) value = 0;
		return value;
    } catch (e) {
        return 0;
    }
};

Game_Action.prototype.calcElementRate = function(target) {
    if (this.item().damage.elementId < 0) {
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        return target.elementRate(this.item().damage.elementId);
    }
};

Game_Action.prototype.elementsMaxRate = function(target, elements) {
    if (elements.length > 0) {
        return Math.max.apply(null, elements.map(function(elementId) {
            return target.elementRate(elementId);
        }, this));
    } else {
        return 1;
    }
};

Game_Action.prototype.applyCritical = function(damage) {
    return damage * 2.5;
};

Game_Action.prototype.applyVariance = function(damage, variance) {
    var amp = Math.floor(Math.max(Math.abs(damage) * variance / 100, 0));
    var v = Math.randomInt(amp + 1) + Math.randomInt(amp + 1) - amp;
    return damage >= 0 ? damage + v : damage - v;
};

Game_Action.prototype.applyGuard = function(damage, target) {
    return damage / (damage > 0 && target.isGuard() ? 2 * target.grd : 1);
};

Game_Action.prototype.executeDamage = function(target, value) {
    var result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};

Game_Action.prototype.executeHpDamage = function(target, value) {
    if (this.isDrain()) {
        value = Math.min(target.hp, value);
    }
    this.makeSuccess(target);
    target.gainHp(-value);
    if (value > 0) {
        target.onDamage(value);
    }
    this.gainDrainedHp(value);
};

Game_Action.prototype.executeMpDamage = function(target, value) {
    if (!this.isMpRecover()) {
        value = Math.min(target.mp, value);
    }
    if (value !== 0) {
        this.makeSuccess(target);
    }
    target.gainMp(-value);
    this.gainDrainedMp(value);
};

Game_Action.prototype.gainDrainedHp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
            gainTarget = this._reflectionTarget;
        }
       gainTarget.gainHp(value);
    }
};

Game_Action.prototype.gainDrainedMp = function(value) {
    if (this.isDrain()) {
       var gainTarget = this.subject();
       if (this._reflectionTarget !== undefined) {
           gainTarget = this._reflectionTarget;
       }
       gainTarget.gainMp(value);
    }
};

Game_Action.prototype.applyItemEffect = function(target, effect) {
    switch (effect.code) {
    case Game_Action.EFFECT_RECOVER_HP:
        this.itemEffectRecoverHp(target, effect);
        break;
    case Game_Action.EFFECT_RECOVER_MP:
        this.itemEffectRecoverMp(target, effect);
        break;
    case Game_Action.EFFECT_GAIN_TP:
        this.itemEffectGainTp(target, effect);
        break;
    case Game_Action.EFFECT_ADD_STATE:
        this.itemEffectAddState(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_STATE:
        this.itemEffectRemoveState(target, effect);
        break;
    case Game_Action.EFFECT_ADD_BUFF:
        this.itemEffectAddBuff(target, effect);
        break;
    case Game_Action.EFFECT_ADD_DEBUFF:
        this.itemEffectAddDebuff(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_BUFF:
        this.itemEffectRemoveBuff(target, effect);
        break;
    case Game_Action.EFFECT_REMOVE_DEBUFF:
        this.itemEffectRemoveDebuff(target, effect);
        break;
    case Game_Action.EFFECT_SPECIAL:
        this.itemEffectSpecial(target, effect);
        break;
    case Game_Action.EFFECT_GROW:
        this.itemEffectGrow(target, effect);
        break;
    case Game_Action.EFFECT_LEARN_SKILL:
        this.itemEffectLearnSkill(target, effect);
        break;
    case Game_Action.EFFECT_COMMON_EVENT:
        this.itemEffectCommonEvent(target, effect);
        break;
    }
};

Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRecoverMp = function(target, effect) {
    var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
    if (value !== 0) {
        target.gainMp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGainTp = function(target, effect) {
    var value = Math.floor(effect.value1);
    if (value !== 0) {
        target.gainTp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddState = function(target, effect) {
    if (effect.dataId === 0) {
        this.itemEffectAddAttackState(target, effect);
    } else {
        this.itemEffectAddNormalState(target, effect);
    }
};

Game_Action.prototype.itemEffectAddAttackState = function(target, effect) {
    this.subject().attackStates().forEach(function(stateId) {
        var chance = effect.value1;
        chance *= target.stateRate(stateId);
        chance *= this.subject().attackStatesRate(stateId);
        chance *= this.lukEffectRate(target);
        if (Math.random() < chance) {
            target.addState(stateId);
            this.makeSuccess(target);
        }
    }.bind(this), target);
};

Game_Action.prototype.itemEffectAddNormalState = function(target, effect) {
    var chance = effect.value1;
    if (!this.isCertainHit()) {
        chance *= target.stateRate(effect.dataId);
        chance *= this.lukEffectRate(target);
    }
    if (Math.random() < chance) {
        target.addState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveState = function(target, effect) {
    var chance = effect.value1;
    if (Math.random() < chance) {
        target.removeState(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectAddBuff = function(target, effect) {
    target.addBuff(effect.dataId, effect.value1);
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectAddDebuff = function(target, effect) {
    var chance = target.debuffRate(effect.dataId) * this.lukEffectRate(target);
    if (Math.random() < chance) {
        target.addDebuff(effect.dataId, effect.value1);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveBuff = function(target, effect) {
    if (target.isBuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectRemoveDebuff = function(target, effect) {
    if (target.isDebuffAffected(effect.dataId)) {
        target.removeBuff(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectSpecial = function(target, effect) {
    if (effect.dataId === Game_Action.SPECIAL_EFFECT_ESCAPE) {
        target.escape();
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectGrow = function(target, effect) {
    target.addParam(effect.dataId, Math.floor(effect.value1));
    this.makeSuccess(target);
};

Game_Action.prototype.itemEffectLearnSkill = function(target, effect) {
    if (target.isActor()) {
        target.learnSkill(effect.dataId);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.itemEffectCommonEvent = function(target, effect) {
};

Game_Action.prototype.makeSuccess = function(target) {
    target.result().success = true;
};

Game_Action.prototype.applyItemUserEffect = function(target) {
    var value = Math.floor(this.item().tpGain * this.subject().tcr);
    this.subject().gainSilentTp(value);
};

Game_Action.prototype.lukEffectRate = function(target) {
    //!!幸运：ab差值的根号 * 2% + 100%
	if( this.subject().luk > target.luk ){
		return Math.max( Math.sqrt(this.subject().luk - target.luk) * 0.02 + 1  , 1.8 );
	}else{
		return Math.min( Math.sqrt(target.luk - this.subject().luk) * 0.02 * (-1) + 1  , 0 );
	};
};

Game_Action.prototype.applyGlobal = function() {
    this.item().effects.forEach(function(effect) {
        if (effect.code === Game_Action.EFFECT_COMMON_EVENT) {
            $gameTemp.reserveCommonEvent(effect.dataId);
        }
    }, this);
};

//-----------------------------------------------------------------------------
// Game_ActionResult
//
// The game object class for a result of a battle action. For convinience, all
// member variables in this class are public.

function Game_ActionResult() {
    this.initialize.apply(this, arguments);
}

Game_ActionResult.prototype.initialize = function() {
    this.clear();
};

Game_ActionResult.prototype.clear = function() {
    this.used = false;
    this.missed = false;
    this.evaded = false;
    this.physical = false;
    this.drain = false;
    this.critical = false;
    this.success = false;
    this.hpAffected = false;
    this.hpDamage = 0;
    this.mpDamage = 0;
    this.tpDamage = 0;
    this.addedStates = [];
    this.removedStates = [];
    this.addedBuffs = [];
    this.addedDebuffs = [];
    this.removedBuffs = [];
};

Game_ActionResult.prototype.addedStateObjects = function() {
    return this.addedStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.removedStateObjects = function() {
    return this.removedStates.map(function(id) {
        return $dataStates[id];
    });
};

Game_ActionResult.prototype.isStatusAffected = function() {
    return (this.addedStates.length > 0 || this.removedStates.length > 0 ||
            this.addedBuffs.length > 0 || this.addedDebuffs.length > 0 ||
            this.removedBuffs.length > 0);
};

Game_ActionResult.prototype.isHit = function() {
    return this.used && !this.missed && !this.evaded;
};

Game_ActionResult.prototype.isStateAdded = function(stateId) {
    return this.addedStates.contains(stateId);
};

Game_ActionResult.prototype.pushAddedState = function(stateId) {
    if (!this.isStateAdded(stateId)) {
        this.addedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isStateRemoved = function(stateId) {
    return this.removedStates.contains(stateId);
};

Game_ActionResult.prototype.pushRemovedState = function(stateId) {
    if (!this.isStateRemoved(stateId)) {
        this.removedStates.push(stateId);
    }
};

Game_ActionResult.prototype.isBuffAdded = function(paramId) {
    return this.addedBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushAddedBuff = function(paramId) {
    if (!this.isBuffAdded(paramId)) {
        this.addedBuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isDebuffAdded = function(paramId) {
    return this.addedDebuffs.contains(paramId);
};

Game_ActionResult.prototype.pushAddedDebuff = function(paramId) {
    if (!this.isDebuffAdded(paramId)) {
        this.addedDebuffs.push(paramId);
    }
};

Game_ActionResult.prototype.isBuffRemoved = function(paramId) {
    return this.removedBuffs.contains(paramId);
};

Game_ActionResult.prototype.pushRemovedBuff = function(paramId) {
    if (!this.isBuffRemoved(paramId)) {
        this.removedBuffs.push(paramId);
    }
};

//-----------------------------------------------------------------------------
// Game_BattlerBase
//
// The superclass of Game_Battler. It mainly contains parameters calculation.

function Game_BattlerBase() {
    this.initialize.apply(this, arguments);
}

Game_BattlerBase.TRAIT_ELEMENT_RATE   = 11;
Game_BattlerBase.TRAIT_DEBUFF_RATE    = 12;
Game_BattlerBase.TRAIT_STATE_RATE     = 13;
Game_BattlerBase.TRAIT_STATE_RESIST   = 14;
Game_BattlerBase.TRAIT_PARAM          = 21;
Game_BattlerBase.TRAIT_XPARAM         = 22;
Game_BattlerBase.TRAIT_SPARAM         = 23;
Game_BattlerBase.TRAIT_ATTACK_ELEMENT = 31;
Game_BattlerBase.TRAIT_ATTACK_STATE   = 32;
Game_BattlerBase.TRAIT_ATTACK_SPEED   = 33;
Game_BattlerBase.TRAIT_ATTACK_TIMES   = 34;
Game_BattlerBase.TRAIT_STYPE_ADD      = 41;
Game_BattlerBase.TRAIT_STYPE_SEAL     = 42;
Game_BattlerBase.TRAIT_SKILL_ADD      = 43;
Game_BattlerBase.TRAIT_SKILL_SEAL     = 44;
Game_BattlerBase.TRAIT_EQUIP_WTYPE    = 51;
Game_BattlerBase.TRAIT_EQUIP_ATYPE    = 52;
Game_BattlerBase.TRAIT_EQUIP_LOCK     = 53;
Game_BattlerBase.TRAIT_EQUIP_SEAL     = 54;
Game_BattlerBase.TRAIT_SLOT_TYPE      = 55;
Game_BattlerBase.TRAIT_ACTION_PLUS    = 61;
Game_BattlerBase.TRAIT_SPECIAL_FLAG   = 62;
Game_BattlerBase.TRAIT_COLLAPSE_TYPE  = 63;
Game_BattlerBase.TRAIT_PARTY_ABILITY  = 64;
Game_BattlerBase.FLAG_ID_AUTO_BATTLE  = 0;
Game_BattlerBase.FLAG_ID_GUARD        = 1;
Game_BattlerBase.FLAG_ID_SUBSTITUTE   = 2;
Game_BattlerBase.FLAG_ID_PRESERVE_TP  = 3;
Game_BattlerBase.ICON_BUFF_START      = 32;
Game_BattlerBase.ICON_DEBUFF_START    = 48;

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    hp: { get: function() { return this._hp; }, configurable: true },
    // Magic Points
    mp: { get: function() { return this._mp; }, configurable: true },
    // Tactical Points
    tp: { get: function() { return this._tp; }, configurable: true },
    // Maximum Hit Points
    mhp: { get: function() { return this.param(0); }, configurable: true },
    // Maximum Magic Points
    mmp: { get: function() { return this.param(1); }, configurable: true },
    // ATtacK power
    atk: { get: function() { return this.param(2); }, configurable: true },
    // DEFense power
    def: { get: function() { return this.param(3); }, configurable: true },
    // Magic ATtack power
    mat: { get: function() { return this.param(4); }, configurable: true },
    // Magic DeFense power
    mdf: { get: function() { return this.param(5); }, configurable: true },
    // AGIlity
    agi: { get: function() { return this.param(6); }, configurable: true },
    // LUcK
    luk: { get: function() { return this.param(7); }, configurable: true },
    // HIT rate
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    // EVAsion rate
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    // CRItical rate
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    // Critical EVasion rate
    cev: { get: function() { return this.xparam(3); }, configurable: true },
    // Magic EVasion rate
    mev: { get: function() { return this.xparam(4); }, configurable: true },
    // Magic ReFlection rate
    mrf: { get: function() { return this.xparam(5); }, configurable: true },
    // CouNTer attack rate
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    // Hp ReGeneration rate
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    // Mp ReGeneration rate
    mrg: { get: function() { return this.xparam(8); }, configurable: true },
    // Tp ReGeneration rate
    trg: { get: function() { return this.xparam(9); }, configurable: true },
    // TarGet Rate
    tgr: { get: function() { return this.sparam(0); }, configurable: true },
    // GuaRD effect rate
    grd: { get: function() { return this.sparam(1); }, configurable: true },
    // RECovery effect rate
    rec: { get: function() { return this.sparam(2); }, configurable: true },
    // PHArmacology
    pha: { get: function() { return this.sparam(3); }, configurable: true },
    // Mp Cost Rate
    mcr: { get: function() { return this.sparam(4); }, configurable: true },
    // Tp Charge Rate
    tcr: { get: function() { return this.sparam(5); }, configurable: true },
    // Physical Damage Rate
    pdr: { get: function() { return this.sparam(6); }, configurable: true },
    // Magical Damage Rate
    mdr: { get: function() { return this.sparam(7); }, configurable: true },
    // Floor Damage Rate
    fdr: { get: function() { return this.sparam(8); }, configurable: true },
    // EXperience Rate
    exr: { get: function() { return this.sparam(9); }, configurable: true }
});

Game_BattlerBase.prototype.initialize = function() {
    this.initMembers();
};

Game_BattlerBase.prototype.initMembers = function() {
    this._hp = 1;
    this._mp = 0;
    this._tp = 0;
    this._hidden = false;
    this.clearParamPlus();
    this.clearStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.clearParamPlus = function() {
    this._paramPlus = [0,0,0,0,0,0,0,0];
};

Game_BattlerBase.prototype.clearStates = function() {
    this._states = [];
    this._stateTurns = {};
};

Game_BattlerBase.prototype.eraseState = function(stateId) {
    var index = this._states.indexOf(stateId);
    if (index >= 0) {
        this._states.splice(index, 1);
    }
    delete this._stateTurns[stateId];
};

Game_BattlerBase.prototype.isStateAffected = function(stateId) {
    return this._states.contains(stateId);
};

Game_BattlerBase.prototype.isDeathStateAffected = function() {
    return this.isStateAffected(this.deathStateId());
};

Game_BattlerBase.prototype.deathStateId = function() {
    return 1;
};

Game_BattlerBase.prototype.resetStateCounts = function(stateId) {
    var state = $dataStates[stateId];
    var variance = 1 + Math.max(state.maxTurns - state.minTurns, 0);
    this._stateTurns[stateId] = state.minTurns + Math.randomInt(variance);
};

Game_BattlerBase.prototype.isStateExpired = function(stateId) {
    return this._stateTurns[stateId] === 0;
};

Game_BattlerBase.prototype.updateStateTurns = function() {
    this._states.forEach(function(stateId) {
        if (this._stateTurns[stateId] > 0) {
            this._stateTurns[stateId]--;
        }
    }, this);
};

Game_BattlerBase.prototype.clearBuffs = function() {
    this._buffs = [0,0,0,0,0,0,0,0];
    this._buffTurns = [0,0,0,0,0,0,0,0];
};

Game_BattlerBase.prototype.eraseBuff = function(paramId) {
    this._buffs[paramId] = 0;
    this._buffTurns[paramId] = 0;
};

Game_BattlerBase.prototype.buffLength = function() {
    return this._buffs.length;
};

Game_BattlerBase.prototype.buff = function(paramId) {
    return this._buffs[paramId];
};

Game_BattlerBase.prototype.isBuffAffected = function(paramId) {
    return this._buffs[paramId] > 0;
};

Game_BattlerBase.prototype.isDebuffAffected = function(paramId) {
    return this._buffs[paramId] < 0;
};

Game_BattlerBase.prototype.isBuffOrDebuffAffected = function(paramId) {
    return this._buffs[paramId] !== 0;
};

Game_BattlerBase.prototype.isMaxBuffAffected = function(paramId) {
    return this._buffs[paramId] === 2;
};

Game_BattlerBase.prototype.isMaxDebuffAffected = function(paramId) {
    return this._buffs[paramId] === -2;
};

Game_BattlerBase.prototype.increaseBuff = function(paramId) {
    if (!this.isMaxBuffAffected(paramId)) {
        this._buffs[paramId]++;
    }
};

Game_BattlerBase.prototype.decreaseBuff = function(paramId) {
    if (!this.isMaxDebuffAffected(paramId)) {
        this._buffs[paramId]--;
    }
};

Game_BattlerBase.prototype.overwriteBuffTurns = function(paramId, turns) {
    if (this._buffTurns[paramId] < turns) {
        this._buffTurns[paramId] = turns;
    }
};

Game_BattlerBase.prototype.isBuffExpired = function(paramId) {
    return this._buffTurns[paramId] === 0;
};

Game_BattlerBase.prototype.updateBuffTurns = function() {
    for (var i = 0; i < this._buffTurns.length; i++) {
        if (this._buffTurns[i] > 0) {
            this._buffTurns[i]--;
        }
    }
};

Game_BattlerBase.prototype.die = function() {
    this._hp = 0;
    this.clearStates();
    this.clearBuffs();
};

Game_BattlerBase.prototype.revive = function() {
    if (this._hp === 0) {
        this._hp = 1;
    }
};

Game_BattlerBase.prototype.states = function() {
    return this._states.map(function(id) {
        return $dataStates[id];
    });
};

Game_BattlerBase.prototype.stateIcons = function() {
    return this.states().map(function(state) {
        return state.iconIndex;
    }).filter(function(iconIndex) {
        return iconIndex > 0;
    });
};

Game_BattlerBase.prototype.buffIcons = function() {
    var icons = [];
    for (var i = 0; i < this._buffs.length; i++) {
        if (this._buffs[i] !== 0) {
            icons.push(this.buffIconIndex(this._buffs[i], i));
        }
    }
    return icons;
};

Game_BattlerBase.prototype.buffIconIndex = function(buffLevel, paramId) {
    if (buffLevel > 0) {
        return Game_BattlerBase.ICON_BUFF_START + (buffLevel - 1) * 8 + paramId;
    } else if (buffLevel < 0) {
        return Game_BattlerBase.ICON_DEBUFF_START + (-buffLevel - 1) * 8 + paramId;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.allIcons = function() {
    return this.stateIcons().concat(this.buffIcons());
};

Game_BattlerBase.prototype.traitObjects = function() {
    // Returns an array of the all objects having traits. States only here.
    return this.states();
};

Game_BattlerBase.prototype.allTraits = function() {
    return this.traitObjects().reduce(function(r, obj) {
        return r.concat(obj.traits);
    }, []);
};

Game_BattlerBase.prototype.traits = function(code) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code;
    });
};

Game_BattlerBase.prototype.traitsWithId = function(code, id) {
    return this.allTraits().filter(function(trait) {
        return trait.code === code && trait.dataId === id;
    });
};

Game_BattlerBase.prototype.traitsPi = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r * trait.value;
    }, 1);
};

Game_BattlerBase.prototype.traitsSum = function(code, id) {
    return this.traitsWithId(code, id).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};

Game_BattlerBase.prototype.traitsSumAll = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r + trait.value;
    }, 0);
};

Game_BattlerBase.prototype.traitsSet = function(code) {
    return this.traits(code).reduce(function(r, trait) {
        return r.concat(trait.dataId);
    }, []);
};

Game_BattlerBase.prototype.paramBase = function(paramId) {
    return 0;
};

Game_BattlerBase.prototype.paramPlus = function(paramId) {
    return this._paramPlus[paramId];
};

Game_BattlerBase.prototype.paramMin = function(paramId) {
    if (paramId === 1) {
        return 0;   // MMP
    } else {
        return 1;
    }
};

Game_BattlerBase.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 999999;  // MHP
    } else if (paramId === 1) {
        return 9999;    // MMP
    } else {
        return 999;
    }
};

Game_BattlerBase.prototype.paramRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_PARAM, paramId);
};

Game_BattlerBase.prototype.paramBuffRate = function(paramId) {
    return this._buffs[paramId] * 0.25 + 1.0;
};

Game_BattlerBase.prototype.param = function(paramId) {
    var value = this.paramBase(paramId) + this.paramPlus(paramId);
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_BattlerBase.prototype.xparam = function(xparamId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_XPARAM, xparamId);
};

Game_BattlerBase.prototype.sparam = function(sparamId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_SPARAM, sparamId);
};

Game_BattlerBase.prototype.elementRate = function(elementId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_ELEMENT_RATE, elementId);
};

Game_BattlerBase.prototype.debuffRate = function(paramId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_DEBUFF_RATE, paramId);
};

Game_BattlerBase.prototype.stateRate = function(stateId) {
    return this.traitsPi(Game_BattlerBase.TRAIT_STATE_RATE, stateId);
};

Game_BattlerBase.prototype.stateResistSet = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STATE_RESIST);
};

Game_BattlerBase.prototype.isStateResist = function(stateId) {
    return this.stateResistSet().contains(stateId);
};

Game_BattlerBase.prototype.attackElements = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_ELEMENT);
};

Game_BattlerBase.prototype.attackStates = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_ATTACK_STATE);
};

Game_BattlerBase.prototype.attackStatesRate = function(stateId) {
    return this.traitsSum(Game_BattlerBase.TRAIT_ATTACK_STATE, stateId);
};

Game_BattlerBase.prototype.attackSpeed = function() {
    return this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_SPEED);
};

Game_BattlerBase.prototype.attackTimesAdd = function() {
    return Math.max(this.traitsSumAll(Game_BattlerBase.TRAIT_ATTACK_TIMES), 0);
};

Game_BattlerBase.prototype.addedSkillTypes = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_ADD);
};

Game_BattlerBase.prototype.isSkillTypeSealed = function(stypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_STYPE_SEAL).contains(stypeId);
};

Game_BattlerBase.prototype.addedSkills = function() {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_ADD);
};

Game_BattlerBase.prototype.isSkillSealed = function(skillId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_SKILL_SEAL).contains(skillId);
};

Game_BattlerBase.prototype.isEquipWtypeOk = function(wtypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_WTYPE).contains(wtypeId);
};

Game_BattlerBase.prototype.isEquipAtypeOk = function(atypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_ATYPE).contains(atypeId);
};

Game_BattlerBase.prototype.isEquipTypeLocked = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_LOCK).contains(etypeId);
};

Game_BattlerBase.prototype.isEquipTypeSealed = function(etypeId) {
    return this.traitsSet(Game_BattlerBase.TRAIT_EQUIP_SEAL).contains(etypeId);
};

Game_BattlerBase.prototype.slotType = function() {
    var set = this.traitsSet(Game_BattlerBase.TRAIT_SLOT_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};

Game_BattlerBase.prototype.isDualWield = function() {
    return this.slotType() === 1;
};

Game_BattlerBase.prototype.actionPlusSet = function() {
    return this.traits(Game_BattlerBase.TRAIT_ACTION_PLUS).map(function(trait) {
        return trait.value;
    });
};

Game_BattlerBase.prototype.specialFlag = function(flagId) {
    return this.traits(Game_BattlerBase.TRAIT_SPECIAL_FLAG).some(function(trait) {
        return trait.dataId === flagId;
    });
};

Game_BattlerBase.prototype.collapseType = function() {
    var set = this.traitsSet(Game_BattlerBase.TRAIT_COLLAPSE_TYPE);
    return set.length > 0 ? Math.max.apply(null, set) : 0;
};

Game_BattlerBase.prototype.partyAbility = function(abilityId) {
    return this.traits(Game_BattlerBase.TRAIT_PARTY_ABILITY).some(function(trait) {
        return trait.dataId === abilityId;
    });
};

Game_BattlerBase.prototype.isAutoBattle = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_AUTO_BATTLE);
};

Game_BattlerBase.prototype.isGuard = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_GUARD) && this.canMove();
};

Game_BattlerBase.prototype.isSubstitute = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_SUBSTITUTE) && this.canMove();
};

Game_BattlerBase.prototype.isPreserveTp = function() {
    return this.specialFlag(Game_BattlerBase.FLAG_ID_PRESERVE_TP);
};

Game_BattlerBase.prototype.addParam = function(paramId, value) {
    this._paramPlus[paramId] += value;
    this.refresh();
};

Game_BattlerBase.prototype.setHp = function(hp) {
    this._hp = hp;
    this.refresh();
};

Game_BattlerBase.prototype.setMp = function(mp) {
    this._mp = mp;
    this.refresh();
};

Game_BattlerBase.prototype.setTp = function(tp) {
    this._tp = tp;
    this.refresh();
};

Game_BattlerBase.prototype.maxTp = function() {
    return 100;
};

Game_BattlerBase.prototype.refresh = function() {
    this.stateResistSet().forEach(function(stateId) {
        this.eraseState(stateId);
    }, this);
    this._hp = this._hp.clamp(0, this.mhp);
    this._mp = this._mp.clamp(0, this.mmp);
    this._tp = this._tp.clamp(0, this.maxTp());
};

Game_BattlerBase.prototype.recoverAll = function() {
    this.clearStates();
    this._hp = this.mhp;
    this._mp = this.mmp;
};

Game_BattlerBase.prototype.hpRate = function() {
    return this.hp / this.mhp;
};

Game_BattlerBase.prototype.mpRate = function() {
    return this.mmp > 0 ? this.mp / this.mmp : 0;
};

Game_BattlerBase.prototype.tpRate = function() {
    return this.tp / this.maxTp();
};

Game_BattlerBase.prototype.hide = function() {
    this._hidden = true;
};

Game_BattlerBase.prototype.appear = function() {
    this._hidden = false;
};

Game_BattlerBase.prototype.isHidden = function() {
    return this._hidden;
};

Game_BattlerBase.prototype.isAppeared = function() {
    return !this.isHidden();
};

Game_BattlerBase.prototype.isDead = function() {
    return this.isAppeared() && this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isAlive = function() {
    return this.isAppeared() && !this.isDeathStateAffected();
};

Game_BattlerBase.prototype.isDying = function() {
    return this.isAlive() && this._hp < this.mhp / 4;
};

Game_BattlerBase.prototype.isRestricted = function() {
    return this.isAppeared() && this.restriction() > 0;
};

Game_BattlerBase.prototype.canInput = function() {
    return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle();
};

Game_BattlerBase.prototype.canMove = function() {
    return this.isAppeared() && this.restriction() < 4;
};

Game_BattlerBase.prototype.isConfused = function() {
    return this.isAppeared() && this.restriction() >= 1 && this.restriction() <= 3;
};

Game_BattlerBase.prototype.confusionLevel = function() {
    return this.isConfused() ? this.restriction() : 0;
};

Game_BattlerBase.prototype.isActor = function() {
    return false;
};

Game_BattlerBase.prototype.isEnemy = function() {
    return false;
};

Game_BattlerBase.prototype.sortStates = function() {
    this._states.sort(function(a, b) {
        var p1 = $dataStates[a].priority;
        var p2 = $dataStates[b].priority;
        if (p1 !== p2) {
            return p2 - p1;
        }
        return a - b;
    });
};

Game_BattlerBase.prototype.restriction = function() {
    return Math.max.apply(null, this.states().map(function(state) {
        return state.restriction;
    }).concat(0));
};

Game_BattlerBase.prototype.addNewState = function(stateId) {
    if (stateId === this.deathStateId()) {
        this.die();
    }
    var restricted = this.isRestricted();
    this._states.push(stateId);
    this.sortStates();
    if (!restricted && this.isRestricted()) {
        this.onRestrict();
    }
};

Game_BattlerBase.prototype.onRestrict = function() {
};

Game_BattlerBase.prototype.mostImportantStateText = function() {
    var states = this.states();
    for (var i = 0; i < states.length; i++) {
        if (states[i].message3) {
            return states[i].message3;
        }
    }
    return '';
};

Game_BattlerBase.prototype.stateMotionIndex = function() {
    var states = this.states();
    if (states.length > 0) {
        return states[0].motion;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.stateOverlayIndex = function() {
    var states = this.states();
    if (states.length > 0) {
        return states[0].overlay;
    } else {
        return 0;
    }
};

Game_BattlerBase.prototype.isSkillWtypeOk = function(skill) {
    return true;
};

Game_BattlerBase.prototype.skillMpCost = function(skill) {
    return Math.floor(skill.mpCost * this.mcr);
};

Game_BattlerBase.prototype.skillTpCost = function(skill) {
    return skill.tpCost;
};

Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    return this._tp >= this.skillTpCost(skill) && this._mp >= this.skillMpCost(skill);
};

Game_BattlerBase.prototype.paySkillCost = function(skill) {
    this._mp -= this.skillMpCost(skill);
    this._tp -= this.skillTpCost(skill);
};

Game_BattlerBase.prototype.isOccasionOk = function(item) {
    if ($gameParty.inBattle()) {
        return item.occasion === 0 || item.occasion === 1;
    } else {
        return item.occasion === 0 || item.occasion === 2;
    }
};

Game_BattlerBase.prototype.meetsUsableItemConditions = function(item) {
    return this.canMove() && this.isOccasionOk(item);
};

Game_BattlerBase.prototype.meetsSkillConditions = function(skill) {
    return (this.meetsUsableItemConditions(skill) &&
            this.isSkillWtypeOk(skill) && this.canPaySkillCost(skill) &&
            !this.isSkillSealed(skill.id) && !this.isSkillTypeSealed(skill.stypeId));
};

Game_BattlerBase.prototype.meetsItemConditions = function(item) {
    return this.meetsUsableItemConditions(item) && $gameParty.hasItem(item);
};

Game_BattlerBase.prototype.canUse = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isSkill(item)) {
        return this.meetsSkillConditions(item);
    } else if (DataManager.isItem(item)) {
        return this.meetsItemConditions(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquip = function(item) {
    if (!item) {
        return false;
    } else if (DataManager.isWeapon(item)) {
        return this.canEquipWeapon(item);
    } else if (DataManager.isArmor(item)) {
        return this.canEquipArmor(item);
    } else {
        return false;
    }
};

Game_BattlerBase.prototype.canEquipWeapon = function(item) {
    return this.isEquipWtypeOk(item.wtypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.canEquipArmor = function(item) {
    return this.isEquipAtypeOk(item.atypeId) && !this.isEquipTypeSealed(item.etypeId);
};

Game_BattlerBase.prototype.attackSkillId = function() {
    return 1;
};

Game_BattlerBase.prototype.guardSkillId = function() {
    return 2;
};

Game_BattlerBase.prototype.canAttack = function() {
    return this.canUse($dataSkills[this.attackSkillId()]);
};

Game_BattlerBase.prototype.canGuard = function() {
    return this.canUse($dataSkills[this.guardSkillId()]);
};

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

function Game_Battler() {
    this.initialize.apply(this, arguments);
}

Game_Battler.prototype = Object.create(Game_BattlerBase.prototype);
Game_Battler.prototype.constructor = Game_Battler;

Game_Battler.prototype.initialize = function() {
    Game_BattlerBase.prototype.initialize.call(this);
};

Game_Battler.prototype.initMembers = function() {
    Game_BattlerBase.prototype.initMembers.call(this);
    this._actions = [];
    this._speed = 0;
    this._result = new Game_ActionResult();
    this._actionState = '';
    this._lastTargetIndex = 0;
    this._animations = [];
    this._damagePopup = false;
    this._effectType = null;
    this._motionType = null;
    this._weaponImageId = 0;
    this._motionRefresh = false;
    this._selected = false;
};

Game_Battler.prototype.clearAnimations = function() {
    this._animations = [];
};

Game_Battler.prototype.clearDamagePopup = function() {
    this._damagePopup = false;
};

Game_Battler.prototype.clearWeaponAnimation = function() {
    this._weaponImageId = 0;
};

Game_Battler.prototype.clearEffect = function() {
    this._effectType = null;
};

Game_Battler.prototype.clearMotion = function() {
    this._motionType = null;
    this._motionRefresh = false;
};

Game_Battler.prototype.requestEffect = function(effectType) {
    this._effectType = effectType;
};

Game_Battler.prototype.requestMotion = function(motionType) {
    this._motionType = motionType;
};

Game_Battler.prototype.requestMotionRefresh = function() {
    this._motionRefresh = true;
};

Game_Battler.prototype.select = function() {
    this._selected = true;
};

Game_Battler.prototype.deselect = function() {
    this._selected = false;
};

Game_Battler.prototype.isAnimationRequested = function() {
    return this._animations.length > 0;
};

Game_Battler.prototype.isDamagePopupRequested = function() {
    return this._damagePopup;
};

Game_Battler.prototype.isEffectRequested = function() {
    return !!this._effectType;
};

Game_Battler.prototype.isMotionRequested = function() {
    return !!this._motionType;
};

Game_Battler.prototype.isWeaponAnimationRequested = function() {
    return this._weaponImageId > 0;
};

Game_Battler.prototype.isMotionRefreshRequested = function() {
    return this._motionRefresh;
};

Game_Battler.prototype.isSelected = function() {
    return this._selected;
};

Game_Battler.prototype.effectType = function() {
    return this._effectType;
};

Game_Battler.prototype.motionType = function() {
    return this._motionType;
};

Game_Battler.prototype.weaponImageId = function() {
    return this._weaponImageId;
};

Game_Battler.prototype.shiftAnimation = function() {
    return this._animations.shift();
};

Game_Battler.prototype.startAnimation = function(animationId, mirror, delay) {
    var data = { animationId: animationId, mirror: mirror, delay: delay };
    this._animations.push(data);
};

Game_Battler.prototype.startDamagePopup = function() {
    this._damagePopup = true;
};

Game_Battler.prototype.startWeaponAnimation = function(weaponImageId) {
    this._weaponImageId = weaponImageId;
};

Game_Battler.prototype.action = function(index) {
    return this._actions[index];
};

Game_Battler.prototype.setAction = function(index, action) {
    this._actions[index] = action;
};

Game_Battler.prototype.numActions = function() {
    return this._actions.length;
};

Game_Battler.prototype.clearActions = function() {
    this._actions = [];
};

Game_Battler.prototype.result = function() {
    return this._result;
};

Game_Battler.prototype.clearResult = function() {
    this._result.clear();
};

Game_Battler.prototype.refresh = function() {
    Game_BattlerBase.prototype.refresh.call(this);
    if (this.hp === 0) {
        this.addState(this.deathStateId());
    } else {
        this.removeState(this.deathStateId());
    }
};

Game_Battler.prototype.addState = function(stateId) {
    if (this.isStateAddable(stateId)) {
        if (!this.isStateAffected(stateId)) {
            this.addNewState(stateId);
            this.refresh();
        }
        this.resetStateCounts(stateId);
        this._result.pushAddedState(stateId);
    }
};

Game_Battler.prototype.isStateAddable = function(stateId) {
    return (this.isAlive() && $dataStates[stateId] &&
            !this.isStateResist(stateId) &&
            !this._result.isStateRemoved(stateId) &&
            !this.isStateRestrict(stateId));
};

Game_Battler.prototype.isStateRestrict = function(stateId) {
    return $dataStates[stateId].removeByRestriction && this.isRestricted();
};

Game_Battler.prototype.onRestrict = function() {
    Game_BattlerBase.prototype.onRestrict.call(this);
    this.clearActions();
    this.states().forEach(function(state) {
        if (state.removeByRestriction) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeState = function(stateId) {
    if (this.isStateAffected(stateId)) {
        if (stateId === this.deathStateId()) {
            this.revive();
        }
        this.eraseState(stateId);
        this.refresh();
        this._result.pushRemovedState(stateId);
    }
};

Game_Battler.prototype.escape = function() {
    if ($gameParty.inBattle()) {
        this.hide();
    }
    this.clearActions();
    this.clearStates();
    SoundManager.playEscape();
};

Game_Battler.prototype.addBuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.increaseBuff(paramId);
        if (this.isBuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.addDebuff = function(paramId, turns) {
    if (this.isAlive()) {
        this.decreaseBuff(paramId);
        if (this.isDebuffAffected(paramId)) {
            this.overwriteBuffTurns(paramId, turns);
        }
        this._result.pushAddedDebuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.removeBuff = function(paramId) {
    if (this.isAlive() && this.isBuffOrDebuffAffected(paramId)) {
        this.eraseBuff(paramId);
        this._result.pushRemovedBuff(paramId);
        this.refresh();
    }
};

Game_Battler.prototype.removeBattleStates = function() {
    this.states().forEach(function(state) {
        if (state.removeAtBattleEnd) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeAllBuffs = function() {
    for (var i = 0; i < this.buffLength(); i++) {
        this.removeBuff(i);
    }
};

Game_Battler.prototype.removeStatesAuto = function(timing) {
    this.states().forEach(function(state) {
        if (this.isStateExpired(state.id) && state.autoRemovalTiming === timing) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.removeBuffsAuto = function() {
    for (var i = 0; i < this.buffLength(); i++) {
        if (this.isBuffExpired(i)) {
            this.removeBuff(i);
        }
    }
};

Game_Battler.prototype.removeStatesByDamage = function() {
    this.states().forEach(function(state) {
        if (state.removeByDamage && Math.randomInt(100) < state.chanceByDamage) {
            this.removeState(state.id);
        }
    }, this);
};

Game_Battler.prototype.makeActionTimes = function() {
    return this.actionPlusSet().reduce(function(r, p) {
        return Math.random() < p ? r + 1 : r;
    }, 1);
};

Game_Battler.prototype.makeActions = function() {
    this.clearActions();
    if (this.canMove()) {
        var actionTimes = this.makeActionTimes();
        this._actions = [];
        for (var i = 0; i < actionTimes; i++) {
            this._actions.push(new Game_Action(this));
        }
    }
};

Game_Battler.prototype.speed = function() {
    return this._speed;
};

Game_Battler.prototype.makeSpeed = function() {
    this._speed = Math.min.apply(null, this._actions.map(function(action) {
        return action.speed();
    })) || 0;
};

Game_Battler.prototype.currentAction = function() {
    return this._actions[0];
};

Game_Battler.prototype.removeCurrentAction = function() {
    this._actions.shift();
};

Game_Battler.prototype.setLastTarget = function(target) {
    if (target) {
        this._lastTargetIndex = target.index();
    } else {
        this._lastTargetIndex = 0;
    }
};

Game_Battler.prototype.forceAction = function(skillId, targetIndex) {
    this.clearActions();
    var action = new Game_Action(this, true);
    action.setSkill(skillId);
    if (targetIndex === -2) {
        action.setTarget(this._lastTargetIndex);
    } else if (targetIndex === -1) {
        action.decideRandomTarget();
    } else {
        action.setTarget(targetIndex);
    }
    this._actions.push(action);
};

Game_Battler.prototype.useItem = function(item) {
    if (DataManager.isSkill(item)) {
        this.paySkillCost(item);
    } else if (DataManager.isItem(item)) {
        this.consumeItem(item);
    }
};

Game_Battler.prototype.consumeItem = function(item) {
    $gameParty.consumeItem(item);
};

Game_Battler.prototype.gainHp = function(value) {
    this._result.hpDamage = -value;
    this._result.hpAffected = true;
    this.setHp(this.hp + value);
};

Game_Battler.prototype.gainMp = function(value) {
    this._result.mpDamage = -value;
    this.setMp(this.mp + value);
};

Game_Battler.prototype.gainTp = function(value) {
    this._result.tpDamage = -value;
    this.setTp(this.tp + value);
};

Game_Battler.prototype.gainSilentTp = function(value) {
    this.setTp(this.tp + value);
};

Game_Battler.prototype.initTp = function() {
    this.setTp(Math.randomInt(4));	//!!TP初始值为0-4
};

Game_Battler.prototype.clearTp = function() {
    this.setTp(0);
};

Game_Battler.prototype.chargeTpByDamage = function(damageRate) {
    var value = Math.floor(50 * damageRate * this.tcr);
    this.gainSilentTp(value);
};

Game_Battler.prototype.regenerateHp = function() {
    var value = Math.floor(this.mhp * this.hrg);
    value = Math.max(value, -this.maxSlipDamage());
    if (value !== 0) {
        this.gainHp(value);
    }
};

Game_Battler.prototype.maxSlipDamage = function() {
    return $dataSystem.optSlipDeath ? this.hp : Math.max(this.hp - 1, 0);
};

Game_Battler.prototype.regenerateMp = function() {
    var value = Math.floor(this.mmp * this.mrg);
    if (value !== 0) {
        this.gainMp(value);
    }
};

Game_Battler.prototype.regenerateTp = function() {
    var value = Math.floor(100 * this.trg);
    this.gainSilentTp(value);
};

Game_Battler.prototype.regenerateAll = function() {
    if (this.isAlive()) {
        this.regenerateHp();
        this.regenerateMp();
        this.regenerateTp();
    }
};

Game_Battler.prototype.onBattleStart = function() {
    this.setActionState('undecided');
    this.clearMotion();
    if (!this.isPreserveTp()) {
        this.initTp();
    }
};

Game_Battler.prototype.onAllActionsEnd = function() {
    this.clearResult();
    this.removeStatesAuto(1);
    this.removeBuffsAuto();
};

Game_Battler.prototype.onTurnEnd = function() {
    this.clearResult();
    this.regenerateAll();
    if (!BattleManager.isForcedTurn()) {
        this.updateStateTurns();
        this.updateBuffTurns();
    }
    this.removeStatesAuto(2);
};

Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    if (!this.isPreserveTp()) {
        this.clearTp();
    }
    this.appear();
};

Game_Battler.prototype.onDamage = function(value) {
    this.removeStatesByDamage();
    this.chargeTpByDamage(value / this.mhp);
};

Game_Battler.prototype.setActionState = function(actionState) {
    this._actionState = actionState;
    this.requestMotionRefresh();
};

Game_Battler.prototype.isUndecided = function() {
    return this._actionState === 'undecided';
};

Game_Battler.prototype.isInputting = function() {
    return this._actionState === 'inputting';
};

Game_Battler.prototype.isWaiting = function() {
    return this._actionState === 'waiting';
};

Game_Battler.prototype.isActing = function() {
    return this._actionState === 'acting';
};

Game_Battler.prototype.isChanting = function() {
    if (this.isWaiting()) {
        return this._actions.some(function(action) {
            return action.isMagicSkill();
        });
    }
    return false;
};

Game_Battler.prototype.isGuardWaiting = function() {
    if (this.isWaiting()) {
        return this._actions.some(function(action) {
            return action.isGuard();
        });
    }
    return false;
};

Game_Battler.prototype.performActionStart = function(action) {
    if (!action.isGuard()) {
        this.setActionState('acting');
    }
};

Game_Battler.prototype.performAction = function(action) {
};

Game_Battler.prototype.performActionEnd = function() {
    this.setActionState('done');
};

Game_Battler.prototype.performDamage = function() {
};

Game_Battler.prototype.performMiss = function() {
    SoundManager.playMiss();
};

Game_Battler.prototype.performRecovery = function() {
    SoundManager.playRecovery();
};

Game_Battler.prototype.performEvasion = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performMagicEvasion = function() {
    SoundManager.playMagicEvasion();
};

Game_Battler.prototype.performCounter = function() {
    SoundManager.playEvasion();
};

Game_Battler.prototype.performReflection = function() {
    SoundManager.playReflection();
};

Game_Battler.prototype.performSubstitute = function(target) {
};

Game_Battler.prototype.performCollapse = function() {
};

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

function Game_Actor() {
    this.initialize.apply(this, arguments);
}

Game_Actor.prototype = Object.create(Game_Battler.prototype);
Game_Actor.prototype.constructor = Game_Actor;

Object.defineProperty(Game_Actor.prototype, 'level', {
    get: function() {
        return this._level;
    },
    configurable: true
});

Game_Actor.prototype.initialize = function(actorId) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(actorId);
};

Game_Actor.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._actorId = 0;
    this._name = '';
    this._nickname = '';
    this._classId = 0;
    this._level = 0;
    this._characterName = '';
    this._characterIndex = 0;
    this._faceName = '';
    this._faceIndex = 0;
    this._battlerName = '';
    this._exp = {};
    this._skills = [];
    this._equips = [];
    this._actionInputIndex = 0;
    this._lastMenuSkill = new Game_Item();
    this._lastBattleSkill  = new Game_Item();
    this._lastCommandSymbol = '';
};

Game_Actor.prototype.setup = function(actorId) {
    var actor = $dataActors[actorId];
    this._actorId = actorId;
    this._name = actor.name;
    this._nickname = actor.nickname;
    this._profile = actor.profile;
    this._classId = actor.classId;
    this._level = actor.initialLevel;
    this.initImages();
    this.initExp();
    this.initSkills();
    this.initEquips(actor.equips);
    this.clearParamPlus();
    this.recoverAll();
};

Game_Actor.prototype.actorId = function() {
    return this._actorId;
};

Game_Actor.prototype.actor = function() {
    return $dataActors[this._actorId];
};

Game_Actor.prototype.name = function() {
    return this._name;
};

Game_Actor.prototype.setName = function(name) {
    this._name = name;
};

Game_Actor.prototype.nickname = function() {
    return this._nickname;
};

Game_Actor.prototype.setNickname = function(nickname) {
    this._nickname = nickname;
};

Game_Actor.prototype.profile = function() {
    return this._profile;
};

Game_Actor.prototype.setProfile = function(profile) {
    this._profile = profile;
};

Game_Actor.prototype.characterName = function() {
    return this._characterName;
};

Game_Actor.prototype.characterIndex = function() {
    return this._characterIndex;
};

Game_Actor.prototype.faceName = function() {
    return this._faceName;
};

Game_Actor.prototype.faceIndex = function() {
    return this._faceIndex;
};

Game_Actor.prototype.battlerName = function() {
    return this._battlerName;
};

Game_Actor.prototype.clearStates = function() {
    Game_Battler.prototype.clearStates.call(this);
    this._stateSteps = {};
};

Game_Actor.prototype.eraseState = function(stateId) {
    Game_Battler.prototype.eraseState.call(this, stateId);
    delete this._stateSteps[stateId];
};

Game_Actor.prototype.resetStateCounts = function(stateId) {
    Game_Battler.prototype.resetStateCounts.call(this, stateId);
    this._stateSteps[stateId] = $dataStates[stateId].stepsToRemove;
};

Game_Actor.prototype.initImages = function() {
    var actor = this.actor();
    this._characterName = actor.characterName;
    this._characterIndex = actor.characterIndex;
    this._faceName = actor.faceName;
    this._faceIndex = actor.faceIndex;
    this._battlerName = actor.battlerName;
};

Game_Actor.prototype.expForLevel = function(level) {
    var c = this.currentClass();
    var basis = c.expParams[0];
    var extra = c.expParams[1];
    var acc_a = c.expParams[2];
    var acc_b = c.expParams[3];
	if (level>99) {	//!!这里修改了99级以后的经验
		return 316597+(level-99)*4500;
	}
    return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
            (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
};

Game_Actor.prototype.initExp = function() {
    this._exp[this._classId] = this.currentLevelExp();
};

Game_Actor.prototype.currentExp = function() {
    return this._exp[this._classId];
};

Game_Actor.prototype.currentLevelExp = function() {
    return this.expForLevel(this._level);
};

Game_Actor.prototype.nextLevelExp = function() {
    return this.expForLevel(this._level + 1);
};

Game_Actor.prototype.nextRequiredExp = function() {
    return this.nextLevelExp() - this.currentExp();
};

Game_Actor.prototype.maxLevel = function() {
    return this.actor().maxLevel;
};

Game_Actor.prototype.isMaxLevel = function() {
    return this._level >= this.maxLevel();
};

Game_Actor.prototype.initSkills = function() {
    this._skills = [];
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level <= this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};

Game_Actor.prototype.initEquips = function(equips) {
    var slots = this.equipSlots();
    var maxSlots = slots.length;
    this._equips = [];
    for (var i = 0; i < maxSlots; i++) {
        this._equips[i] = new Game_Item();
    }
    for (var j = 0; j < equips.length; j++) {
        if (j < maxSlots) {
            this._equips[j].setEquip(slots[j] === 1, equips[j]);
        }
    }
    this.releaseUnequippableItems(true);
    this.refresh();
};

Game_Actor.prototype.equipSlots = function() {
    var slots = [];
    for (var i = 1; i < $dataSystem.equipTypes.length; i++) {
        slots.push(i);
    }
    if (slots.length >= 2 && this.isDualWield()) {
        slots[1] = 1;
    }
    return slots;
};

Game_Actor.prototype.equips = function() {
    return this._equips.map(function(item) {
        return item.object();
    });
};

Game_Actor.prototype.weapons = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isWeapon(item);
    });
};

Game_Actor.prototype.armors = function() {
    return this.equips().filter(function(item) {
        return item && DataManager.isArmor(item);
    });
};

Game_Actor.prototype.hasWeapon = function(weapon) {
    return this.weapons().contains(weapon);
};

Game_Actor.prototype.hasArmor = function(armor) {
    return this.armors().contains(armor);
};

Game_Actor.prototype.isEquipChangeOk = function(slotId) {
    return (!this.isEquipTypeLocked(this.equipSlots()[slotId]) &&
            !this.isEquipTypeSealed(this.equipSlots()[slotId]));
};

Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
            (!item || this.equipSlots()[slotId] === item.etypeId)) {
        this._equips[slotId].setObject(item);
        this.refresh();
    }
};

Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
    this._equips[slotId].setObject(item);
    this.releaseUnequippableItems(true);
    this.refresh();
};

Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        $gameParty.gainItem(oldItem, 1);
        $gameParty.loseItem(newItem, 1);
        return true;
    }
};

Game_Actor.prototype.changeEquipById = function(etypeId, itemId) {
    var slotId = etypeId - 1;
    if (this.equipSlots()[slotId] === 1) {
        this.changeEquip(slotId, $dataWeapons[itemId]);
    } else {
        this.changeEquip(slotId, $dataArmors[itemId]);
    }
};

Game_Actor.prototype.isEquipped = function(item) {
    return this.equips().contains(item);
};

Game_Actor.prototype.discardEquip = function(item) {
    var slotId = this.equips().indexOf(item);
    if (slotId >= 0) {
        this._equips[slotId].setObject(null);
    }
};

Game_Actor.prototype.releaseUnequippableItems = function(forcing) {
    for (;;) {
        var slots = this.equipSlots();
        var equips = this.equips();
        var changed = false;
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (item && (!this.canEquip(item) || item.etypeId !== slots[i])) {
                if (!forcing) {
                    this.tradeItemWithParty(null, item);
                }
                this._equips[i].setObject(null);
                changed = true;
            }
        }
        if (!changed) {
            break;
        }
    }
};

Game_Actor.prototype.clearEquipments = function() {
    var maxSlots = this.equipSlots().length;
    for (var i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, null);
        }
    }
};

Game_Actor.prototype.optimizeEquipments = function() {
    var maxSlots = this.equipSlots().length;
    this.clearEquipments();
    for (var i = 0; i < maxSlots; i++) {
        if (this.isEquipChangeOk(i)) {
            this.changeEquip(i, this.bestEquipItem(i));
        }
    }
};

Game_Actor.prototype.bestEquipItem = function(slotId) {
    var etypeId = this.equipSlots()[slotId];
    var items = $gameParty.equipItems().filter(function(item) {
        return item.etypeId === etypeId && this.canEquip(item);
    }, this);
    var bestItem = null;
    var bestPerformance = -1000;
    for (var i = 0; i < items.length; i++) {
        var performance = this.calcEquipItemPerformance(items[i]);
        if (performance > bestPerformance) {
            bestPerformance = performance;
            bestItem = items[i];
        }
    }
    return bestItem;
};

Game_Actor.prototype.calcEquipItemPerformance = function(item) {
    return item.params.reduce(function(a, b) {
        return a + b;
    });
};

Game_Actor.prototype.isSkillWtypeOk = function(skill) {
    var wtypeId1 = skill.requiredWtypeId1;
    var wtypeId2 = skill.requiredWtypeId2;
    if ((wtypeId1 === 0 && wtypeId2 === 0) ||
            (wtypeId1 > 0 && this.isWtypeEquipped(wtypeId1)) ||
            (wtypeId2 > 0 && this.isWtypeEquipped(wtypeId2))) {
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.isWtypeEquipped = function(wtypeId) {
    return this.weapons().some(function(weapon) {
        return weapon.wtypeId === wtypeId;
    });
};

Game_Actor.prototype.refresh = function() {
    this.releaseUnequippableItems(false);
    Game_Battler.prototype.refresh.call(this);
};

Game_Actor.prototype.isActor = function() {
    return true;
};

Game_Actor.prototype.friendsUnit = function() {
    return $gameParty;
};

Game_Actor.prototype.opponentsUnit = function() {
    return $gameTroop;
};

Game_Actor.prototype.index = function() {
    return $gameParty.members().indexOf(this);
};

Game_Actor.prototype.isBattleMember = function() {
    return $gameParty.battleMembers().contains(this);
};

Game_Actor.prototype.isFormationChangeOk = function() {
    return true;
};

Game_Actor.prototype.currentClass = function() {
    return $dataClasses[this._classId];
};

Game_Actor.prototype.isClass = function(gameClass) {
    return gameClass && this._classId === gameClass.id;
};

Game_Actor.prototype.skills = function() {
    var list = [];
    this._skills.concat(this.addedSkills()).forEach(function(id) {
        if (!list.contains($dataSkills[id])) {
            list.push($dataSkills[id]);
        }
    });
    return list;
};

Game_Actor.prototype.usableSkills = function() {
    return this.skills().filter(function(skill) {
        return this.canUse(skill);
    }, this);
};

Game_Actor.prototype.traitObjects = function() {
    var objects = Game_Battler.prototype.traitObjects.call(this);
    objects = objects.concat([this.actor(), this.currentClass()]);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            objects.push(item);
        }
    }
    return objects;
};

Game_Actor.prototype.attackElements = function() {
    var set = Game_Battler.prototype.attackElements.call(this);
    if (this.hasNoWeapons() && !set.contains(this.bareHandsElementId())) {
        set.push(this.bareHandsElementId());
    }
    return set;
};

Game_Actor.prototype.hasNoWeapons = function() {
    return this.weapons().length === 0;
};

Game_Actor.prototype.bareHandsElementId = function() {
    return 1;
};

Game_Actor.prototype.paramMax = function(paramId) {
    if (paramId === 0) {
        return 9999;    // MHP
    }
    return Game_Battler.prototype.paramMax.call(this, paramId);
};

Game_Actor.prototype.paramBase = function(paramId) {
    return this.currentClass().params[paramId][this._level];
};

Game_Actor.prototype.paramPlus = function(paramId) {
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
        var item = equips[i];
        if (item) {
            value += item.params[paramId];
        }
    }
    return value;
};

Game_Actor.prototype.attackAnimationId1 = function() {
    if (this.hasNoWeapons()) {
        return this.bareHandsAnimationId();
    } else {
        var weapons = this.weapons();
        return weapons[0] ? weapons[0].animationId : 0;
    }
};

Game_Actor.prototype.attackAnimationId2 = function() {
    var weapons = this.weapons();
    return weapons[1] ? weapons[1].animationId : 0;
};

Game_Actor.prototype.bareHandsAnimationId = function() {
    return 1;
};

Game_Actor.prototype.changeExp = function(exp, show) {
    this._exp[this._classId] = Math.max(exp, 0);
    var lastLevel = this._level;
    var lastSkills = this.skills();
    while (!this.isMaxLevel() && this.currentExp() >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this.currentExp() < this.currentLevelExp()) {
        this.levelDown();
    }
    if (show && this._level > lastLevel) {
        this.displayLevelUp(this.findNewSkills(lastSkills));
    }
    this.refresh();
};

Game_Actor.prototype.levelUp = function() {
    this._level++;
    this.currentClass().learnings.forEach(function(learning) {
        if (learning.level === this._level) {
            this.learnSkill(learning.skillId);
        }
    }, this);
};

Game_Actor.prototype.levelDown = function() {
    this._level--;
};

Game_Actor.prototype.findNewSkills = function(lastSkills) {
    var newSkills = this.skills();
    for (var i = 0; i < lastSkills.length; i++) {
        var index = newSkills.indexOf(lastSkills[i]);
        if (index >= 0) {
            newSkills.splice(index, 1);
        }
    }
    return newSkills;
};

Game_Actor.prototype.displayLevelUp = function(newSkills) {
    var text = TextManager.levelUp.format(this._name, TextManager.level, this._level);
    $gameMessage.newPage();
    $gameMessage.add(text);
    newSkills.forEach(function(skill) {
        $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
};

Game_Actor.prototype.gainExp = function(exp) {
    var newExp = this.currentExp() + Math.round(exp * this.finalExpRate());
    this.changeExp(newExp, this.shouldDisplayLevelUp());
};

Game_Actor.prototype.finalExpRate = function() {
    return this.exr * (this.isBattleMember() ? 1 : this.benchMembersExpRate());
};

Game_Actor.prototype.benchMembersExpRate = function() {
    return $dataSystem.optExtraExp ? 1 : 0;
};

Game_Actor.prototype.shouldDisplayLevelUp = function() {
    return true;
};

Game_Actor.prototype.changeLevel = function(level, show) {
    level = level.clamp(1, this.maxLevel());
    this.changeExp(this.expForLevel(level), show);
};

Game_Actor.prototype.learnSkill = function(skillId) {
    if (!this.isLearnedSkill(skillId)) {
        this._skills.push(skillId);
        this._skills.sort(function(a, b) {
            return a - b;
        });
    }
};

Game_Actor.prototype.forgetSkill = function(skillId) {
    var index = this._skills.indexOf(skillId);
    if (index >= 0) {
        this._skills.splice(index, 1);
    }
};

Game_Actor.prototype.isLearnedSkill = function(skillId) {
    return this._skills.contains(skillId);
};

Game_Actor.prototype.hasSkill = function(skillId) {
    return this.skills().contains($dataSkills[skillId]);
};

Game_Actor.prototype.changeClass = function(classId, keepExp) {
    if (keepExp) {
        this._exp[classId] = this.currentExp();
    }
    this._classId = classId;
    this.changeExp(this._exp[this._classId] || 0, false);
    this.refresh();
};

Game_Actor.prototype.setCharacterImage = function(characterName, characterIndex) {
    this._characterName = characterName;
    this._characterIndex = characterIndex;
};

Game_Actor.prototype.setFaceImage = function(faceName, faceIndex) {
    this._faceName = faceName;
    this._faceIndex = faceIndex;
};

Game_Actor.prototype.setBattlerImage = function(battlerName) {
    this._battlerName = battlerName;
};

Game_Actor.prototype.isSpriteVisible = function() {
    return $gameSystem.isSideView();
};

Game_Actor.prototype.startAnimation = function(animationId, mirror, delay) {
    mirror = !mirror;
    Game_Battler.prototype.startAnimation.call(this, animationId, mirror, delay);
};

Game_Actor.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
};

Game_Actor.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
    if (action.isAttack()) {
        this.performAttack();
    } else if (action.isGuard()) {
        this.requestMotion('guard');
    } else if (action.isMagicSkill()) {
        this.requestMotion('spell');
    } else if (action.isSkill()) {
        this.requestMotion('skill');
    } else if (action.isItem()) {
        this.requestMotion('item');
    }
};

Game_Actor.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Actor.prototype.performAttack = function() {
    var weapons = this.weapons();
    var wtypeId = weapons[0] ? weapons[0].wtypeId : 0;
    var attackMotion = $dataSystem.attackMotions[wtypeId];
    if (attackMotion) {
        if (attackMotion.type === 0) {
            this.requestMotion('thrust');
        } else if (attackMotion.type === 1) {
            this.requestMotion('swing');
        } else if (attackMotion.type === 2) {
            this.requestMotion('missile');
        }
        this.startWeaponAnimation(attackMotion.weaponImageId);
    }
};

Game_Actor.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    if (this.isSpriteVisible()) {
        this.requestMotion('damage');
    } else {
        $gameScreen.startShake(5, 5, 10);
    }
    SoundManager.playActorDamage();
};

Game_Actor.prototype.performEvasion = function() {
    Game_Battler.prototype.performEvasion.call(this);
    this.requestMotion('evade');
};

Game_Actor.prototype.performMagicEvasion = function() {
    Game_Battler.prototype.performMagicEvasion.call(this);
    this.requestMotion('evade');
};

Game_Actor.prototype.performCounter = function() {
    Game_Battler.prototype.performCounter.call(this);
    this.performAttack();
};

Game_Actor.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    if ($gameParty.inBattle()) {
        SoundManager.playActorCollapse();
    }
};

Game_Actor.prototype.performVictory = function() {
    if (this.canMove()) {
        this.requestMotion('victory');
    }
};

Game_Actor.prototype.performEscape = function() {
    if (this.canMove()) {
        this.requestMotion('escape');
    }
};

Game_Actor.prototype.makeActionList = function() {
    var list = [];
    var action = new Game_Action(this);
    action.setAttack();
    list.push(action);
    this.usableSkills().forEach(function(skill) {
        action = new Game_Action(this);
        action.setSkill(skill.id);
        list.push(action);
    }, this);
    return list;
};

Game_Actor.prototype.makeAutoBattleActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        var list = this.makeActionList();
        var maxValue = Number.MIN_VALUE;
        for (var j = 0; j < list.length; j++) {
            var value = list[j].evaluate();
            if (value > maxValue) {
                maxValue = value;
                this.setAction(i, list[j]);
            }
        }
    }
    this.setActionState('waiting');
};

Game_Actor.prototype.makeConfusionActions = function() {
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setConfusion();
    }
    this.setActionState('waiting');
};

Game_Actor.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        this.setActionState('undecided');
    } else {
        this.setActionState('waiting');
    }
    if (this.isAutoBattle()) {
        this.makeAutoBattleActions();
    } else if (this.isConfused()) {
        this.makeConfusionActions();
    }
};

Game_Actor.prototype.onPlayerWalk = function() {
    this.clearResult();
    this.checkFloorEffect();
    if ($gamePlayer.isNormal()) {
        this.turnEndOnMap();
        this.states().forEach(function(state) {
            this.updateStateSteps(state);
        }, this);
        this.showAddedStates();
        this.showRemovedStates();
    }
};

Game_Actor.prototype.updateStateSteps = function(state) {
    if (state.removeByWalking) {
        if (this._stateSteps[state.id] > 0) {
            if (--this._stateSteps[state.id] === 0) {
                this.removeState(state.id);
            }
        }
    }
};

Game_Actor.prototype.showAddedStates = function() {
    this.result().addedStateObjects().forEach(function(state) {
        if (state.message1) {
            $gameMessage.add(this._name + state.message1);
        }
    }, this);
};

Game_Actor.prototype.showRemovedStates = function() {
    this.result().removedStateObjects().forEach(function(state) {
        if (state.message4) {
            $gameMessage.add(this._name + state.message4);
        }
    }, this);
};

Game_Actor.prototype.stepsForTurn = function() {
    return 20;
};

Game_Actor.prototype.turnEndOnMap = function() {
    if ($gameParty.steps() % this.stepsForTurn() === 0) {
        this.onTurnEnd();
        if (this.result().hpDamage > 0) {
            this.performMapDamage();
        }
    }
};

Game_Actor.prototype.checkFloorEffect = function() {
    if ($gamePlayer.isOnDamageFloor()) {
        this.executeFloorDamage();
    }
};

Game_Actor.prototype.executeFloorDamage = function() {
    var damage = Math.floor(this.basicFloorDamage() * this.fdr);
    damage = Math.min(damage, this.maxFloorDamage());
    this.gainHp(-damage);
    if (damage > 0) {
        this.performMapDamage();
    }
};

Game_Actor.prototype.basicFloorDamage = function() {
    return 10;
};

Game_Actor.prototype.maxFloorDamage = function() {
    return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
};

Game_Actor.prototype.performMapDamage = function() {
    if (!$gameParty.inBattle()) {
        $gameScreen.startFlashForDamage();
    }
};

Game_Actor.prototype.clearActions = function() {
    Game_Battler.prototype.clearActions.call(this);
    this._actionInputIndex = 0;
};

Game_Actor.prototype.inputtingAction = function() {
    return this.action(this._actionInputIndex);
};

Game_Actor.prototype.selectNextCommand = function() {
    if (this._actionInputIndex < this.numActions() - 1) {
        this._actionInputIndex++;
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.selectPreviousCommand = function() {
    if (this._actionInputIndex > 0) {
        this._actionInputIndex--;
        return true;
    } else {
        return false;
    }
};

Game_Actor.prototype.lastMenuSkill = function() {
    return this._lastMenuSkill.object();
};

Game_Actor.prototype.setLastMenuSkill = function(skill) {
    this._lastMenuSkill.setObject(skill);
};

Game_Actor.prototype.lastBattleSkill = function() {
    return this._lastBattleSkill.object();
};

Game_Actor.prototype.setLastBattleSkill = function(skill) {
    this._lastBattleSkill.setObject(skill);
};

Game_Actor.prototype.lastCommandSymbol = function() {
    return this._lastCommandSymbol;
};

Game_Actor.prototype.setLastCommandSymbol = function(symbol) {
    this._lastCommandSymbol = symbol;
};

Game_Actor.prototype.testEscape = function(item) {
    return item.effects.some(function(effect, index, ar) {
        return effect && effect.code === Game_Action.EFFECT_SPECIAL;
    });
};

Game_Actor.prototype.meetsUsableItemConditions = function(item) {
    if ($gameParty.inBattle() && !BattleManager.canEscape() && this.testEscape(item)) {
        return false;
    }
    return Game_BattlerBase.prototype.meetsUsableItemConditions.call(this, item);
};

//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

function Game_Enemy() {
    this.initialize.apply(this, arguments);
}

Game_Enemy.prototype = Object.create(Game_Battler.prototype);
Game_Enemy.prototype.constructor = Game_Enemy;

Game_Enemy.prototype.initialize = function(enemyId, x, y) {
    Game_Battler.prototype.initialize.call(this);
    this.setup(enemyId, x, y);
};

Game_Enemy.prototype.initMembers = function() {
    Game_Battler.prototype.initMembers.call(this);
    this._enemyId = 0;
    this._letter = '';
    this._plural = false;
    this._screenX = 0;
    this._screenY = 0;
};

Game_Enemy.prototype.setup = function(enemyId, x, y) {
    this._enemyId = enemyId;
    this._screenX = x;
    this._screenY = y;
    this.recoverAll();
};

Game_Enemy.prototype.isEnemy = function() {
    return true;
};

Game_Enemy.prototype.friendsUnit = function() {
    return $gameTroop;
};

Game_Enemy.prototype.opponentsUnit = function() {
    return $gameParty;
};

Game_Enemy.prototype.index = function() {
    return $gameTroop.members().indexOf(this);
};

Game_Enemy.prototype.isBattleMember = function() {
    return this.index() >= 0;
};

Game_Enemy.prototype.enemyId = function() {
    return this._enemyId;
};

Game_Enemy.prototype.enemy = function() {
    return $dataEnemies[this._enemyId];
};

Game_Enemy.prototype.traitObjects = function() {
    return Game_Battler.prototype.traitObjects.call(this).concat(this.enemy());
};

Game_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

Game_Enemy.prototype.exp = function() {
    return this.enemy().exp;
};

Game_Enemy.prototype.gold = function() {
    return this.enemy().gold;
};

Game_Enemy.prototype.makeDropItems = function() {
    return this.enemy().dropItems.reduce(function(r, di) {
        if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
            return r.concat(this.itemObject(di.kind, di.dataId));
        } else {
            return r;
        }
    }.bind(this), []);
};

Game_Enemy.prototype.dropItemRate = function() {
    return $gameParty.hasDropItemDouble() ? 2 : 1;
};

Game_Enemy.prototype.itemObject = function(kind, dataId) {
    if (kind === 1) {
        return $dataItems[dataId];
    } else if (kind === 2) {
        return $dataWeapons[dataId];
    } else if (kind === 3) {
        return $dataArmors[dataId];
    } else {
        return null;
    }
};

Game_Enemy.prototype.isSpriteVisible = function() {
    return true;
};

Game_Enemy.prototype.screenX = function() {
    return this._screenX;
};

Game_Enemy.prototype.screenY = function() {
    return this._screenY;
};

Game_Enemy.prototype.battlerName = function() {
    return this.enemy().battlerName;
};

Game_Enemy.prototype.battlerHue = function() {
    return this.enemy().battlerHue;
};

Game_Enemy.prototype.originalName = function() {
    return this.enemy().name;
};

Game_Enemy.prototype.name = function() {
    return this.originalName() + (this._plural ? this._letter : '');
};

Game_Enemy.prototype.isLetterEmpty = function() {
    return this._letter === '';
};

Game_Enemy.prototype.setLetter = function(letter) {
    this._letter = letter;
};

Game_Enemy.prototype.setPlural = function(plural) {
    this._plural = plural;
};

Game_Enemy.prototype.performActionStart = function(action) {
    Game_Battler.prototype.performActionStart.call(this, action);
    this.requestEffect('whiten');
};

Game_Enemy.prototype.performAction = function(action) {
    Game_Battler.prototype.performAction.call(this, action);
};

Game_Enemy.prototype.performActionEnd = function() {
    Game_Battler.prototype.performActionEnd.call(this);
};

Game_Enemy.prototype.performDamage = function() {
    Game_Battler.prototype.performDamage.call(this);
    SoundManager.playEnemyDamage();
    this.requestEffect('blink');
};

Game_Enemy.prototype.performCollapse = function() {
    Game_Battler.prototype.performCollapse.call(this);
    switch (this.collapseType()) {
    case 0:
        this.requestEffect('collapse');
        SoundManager.playEnemyCollapse();
        break;
    case 1:
        this.requestEffect('bossCollapse');
        SoundManager.playBossCollapse1();
        break;
    case 2:
        this.requestEffect('instantCollapse');
        break;
    }
};

Game_Enemy.prototype.transform = function(enemyId) {
    var name = this.originalName();
    this._enemyId = enemyId;
    if (this.originalName() !== name) {
        this._letter = '';
        this._plural = false;
    }
    this.refresh();
    if (this.numActions() > 0) {
        this.makeActions();
    }
};

Game_Enemy.prototype.meetsCondition = function(action) {
    var param1 = action.conditionParam1;
    var param2 = action.conditionParam2;
    switch (action.conditionType) {
    case 1:
        return this.meetsTurnCondition(param1, param2);
    case 2:
        return this.meetsHpCondition(param1, param2);
    case 3:
        return this.meetsMpCondition(param1, param2);
    case 4:
        return this.meetsStateCondition(param1);
    case 5:
        return this.meetsPartyLevelCondition(param1);
    case 6:
        return this.meetsSwitchCondition(param1);
    default:
        return true;
    }
};

Game_Enemy.prototype.meetsTurnCondition = function(param1, param2) {
    var n = $gameTroop.turnCount();
    if (param2 === 0) {
        return n === param1;
    } else {
        return n > 0 && n >= param1 && n % param2 === param1 % param2;
    }
};

Game_Enemy.prototype.meetsHpCondition = function(param1, param2) {
    return this.hpRate() >= param1 && this.hpRate() <= param2;
};

Game_Enemy.prototype.meetsMpCondition = function(param1, param2) {
    return this.mpRate() >= param1 && this.mpRate() <= param2;
};

Game_Enemy.prototype.meetsStateCondition = function(param) {
    return this.isStateAffected(param);
};

Game_Enemy.prototype.meetsPartyLevelCondition = function(param) {
    return $gameParty.highestLevel() >= param;
};

Game_Enemy.prototype.meetsSwitchCondition = function(param) {
    return $gameSwitches.value(param);
};

Game_Enemy.prototype.isActionValid = function(action) {
    return this.meetsCondition(action) && this.canUse($dataSkills[action.skillId]);
};

Game_Enemy.prototype.selectAction = function(actionList, ratingZero) {
    var sum = actionList.reduce(function(r, a) {
        return r + a.rating - ratingZero;
    }, 0);
    if (sum > 0) {
        var value = Math.randomInt(sum);
        for (var i = 0; i < actionList.length; i++) {
            var action = actionList[i];
            value -= action.rating - ratingZero;
            if (value < 0) {
                return action;
            }
        }
    } else {
        return null;
    }
};

Game_Enemy.prototype.selectAllActions = function(actionList) {
    var ratingMax = Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
    var ratingZero = ratingMax - 3;
    actionList = actionList.filter(function(a) {
        return a.rating > ratingZero;
    });
    for (var i = 0; i < this.numActions(); i++) {
        this.action(i).setEnemyAction(this.selectAction(actionList, ratingZero));
    }
};

Game_Enemy.prototype.makeActions = function() {
    Game_Battler.prototype.makeActions.call(this);
    if (this.numActions() > 0) {
        var actionList = this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
        if (actionList.length > 0) {
            this.selectAllActions(actionList);
        }
    }
    this.setActionState('waiting');
};

//-----------------------------------------------------------------------------
// Game_Actors
//
// The wrapper class for an actor array.

function Game_Actors() {
    this.initialize.apply(this, arguments);
}

Game_Actors.prototype.initialize = function() {
    this._data = [];
};

Game_Actors.prototype.actor = function(actorId) {
    if ($dataActors[actorId]) {
        if (!this._data[actorId]) {
            this._data[actorId] = new Game_Actor(actorId);
        }
        return this._data[actorId];
    }
    return null;
};

//=============================================================================
// ** 单位组【Game_Unit】
//			
//			索引：	无（父类）
//			来源：	无（独立数据）
//			实例：	无（父类）
//			应用：	> 被子类 队伍Game_Party 继承。
//					> 被子类 敌群Game_Troop 继承。
//					
//			作用域：	战斗界面、地图界面、菜单界面
//			主功能：	用于存放战斗单位的容器。
//			子功能：	->数据类
//							->不含帧刷新
//						->A战斗设置
//							->战斗开始时
//							->战斗结束时
//							->是否正在战斗
//						->B战斗操作
//							->添加战斗行动
//							->清除全部战斗行动
//							->选择一个单位
//							->掩护
//						->C获取单个
//							->随机目标
//								->随机计算
//							->随机已死亡的目标
//							->校准目标
//						->D获取多个
//							->所有单位
//							->活着的单位
//							->已死亡的单位
//							->可动弹的单位
//							->是否全部已死亡
//						->E单位组属性
//						
//			说明：	> 由于容器作为父类，存储的都是 战斗单位，所以提供了很多战斗相关函数。
//					> 该类没有 地图相关数据 。
//=============================================================================
//==============================
// * 单位组 - 定义
//==============================
function Game_Unit(){
    this.initialize.apply(this, arguments);
}
//==============================
// * 单位组 - 初始化
//==============================
Game_Unit.prototype.initialize = function(){
    this._inBattle = false;			//A战斗设置 - 战斗标记
};

//==============================
// * A战斗设置 - 战斗开始时
//
//			说明：	> 战斗管理器调用的是 子类的队伍、敌群 的函数。
//==============================
Game_Unit.prototype.onBattleStart = function(){
    this.members().forEach(function( member ){
        member.onBattleStart();
    });
    this._inBattle = true;
};
//==============================
// * A战斗设置 - 战斗结束时
//==============================
Game_Unit.prototype.onBattleEnd = function(){
    this._inBattle = false;
    this.members().forEach(function( member ){
        member.onBattleEnd();
    });
};
//==============================
// * A战斗设置 - 是否正在战斗
//==============================
Game_Unit.prototype.inBattle = function(){ return this._inBattle; };


//==============================
// * B战斗操作 - 添加战斗行动
//==============================
Game_Unit.prototype.makeActions = function(){
    this.members().forEach(function( member ){
        member.makeActions();
    });
};
//==============================
// * B战斗操作 - 清除全部战斗行动
//==============================
Game_Unit.prototype.clearActions = function(){
    return this.members().forEach(function( member ){
        return member.clearActions();
    });
};
//==============================
// * B战斗操作 - 清除全部战斗行动效果（未被使用）
//==============================
Game_Unit.prototype.clearResults = function(){
    this.members().forEach(function( member ){
        member.clearResult();
    });
};
//==============================
// * B战斗操作 - 选择一个单位
//==============================
Game_Unit.prototype.select = function( activeMember ){
    this.members().forEach(function( member ){
        if( member === activeMember ){
            member.select();
        }else{
            member.deselect();
        }
    });
};
//==============================
// * B战斗操作 - 掩护
//==============================
Game_Unit.prototype.substituteBattler = function(){
    var members = this.members();
    for( var i = 0; i < members.length; i++ ){
        if( members[i].isSubstitute() ){
            return members[i];
        }
    }
};

//==============================
// * C获取单个 - 组内随机 目标
//
//			说明：	> 组内单位的随机，与 单体被攻击几率 有关。
//==============================
Game_Unit.prototype.randomTarget = function(){
    var tgrRand = Math.random() * this.tgrSum();
    var target = null;
    this.aliveMembers().forEach(function( member ){
        tgrRand -= member.tgr;
        if( tgrRand <= 0 && !target ){
            target = member;
        }
    });
    return target;
};
//==============================
// * C获取单个 - 组内随机 目标 - 单体被攻击几率
//==============================
Game_Unit.prototype.tgrSum = function(){
    return this.aliveMembers().reduce(function( r, member ){
        return r + member.tgr;
    }, 0);
};
//==============================
// * C获取单个 - 组内随机 已死亡目标
//
//			说明：	> 已死亡目标的选中概率是平均的。
//==============================
Game_Unit.prototype.randomDeadTarget = function(){
    var members = this.deadMembers();
    if( members.length === 0 ){
        return null;
    }
    return members[Math.floor(Math.random() * members.length)];
};
//==============================
// * C获取单个 - 根据索引获取 目标
//
//			说明：	> 返回 活着 的目标单位。
//==============================
Game_Unit.prototype.smoothTarget = function( index ){
    if( index < 0 ){
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isAlive()) ? member : this.aliveMembers()[0];
};
//==============================
// * C获取单个 - 根据索引获取 已死亡目标
//
//			说明：	> 返回 已死亡 的目标单位。
//==============================
Game_Unit.prototype.smoothDeadTarget = function( index ){
    if( index < 0 ){
        index = 0;
    }
    var member = this.members()[index];
    return (member && member.isDead()) ? member : this.deadMembers()[0];
};

//==============================
// * D获取多个 - 所有单位（子类需继承）
//==============================
Game_Unit.prototype.members = function(){ return []; };
//==============================
// * D获取多个 - 活着的单位
//==============================
Game_Unit.prototype.aliveMembers = function(){
    return this.members().filter(function( member ){
        return member.isAlive();
    });
};
//==============================
// * D获取多个 - 已死亡的单位
//==============================
Game_Unit.prototype.deadMembers = function(){
    return this.members().filter(function( member ){
        return member.isDead();
    });
};
//==============================
// * D获取多个 - 可动弹的单位（不能动弹则回合则无法做出动作）
//==============================
Game_Unit.prototype.movableMembers = function(){
    return this.members().filter(function( member ){
        return member.canMove();
    });
};
//==============================
// * D获取多个 - 是否全部已死亡
//==============================
Game_Unit.prototype.isAllDead = function(){
    return this.aliveMembers().length === 0;
};

//==============================
// * E单位组属性 - 组内平均敏捷度
//==============================
Game_Unit.prototype.agility = function(){
    var members = this.members();
    if( members.length === 0 ){
        return 1;
    }
    var sum = members.reduce(function( r, member ){
        return r + member.agi;
    }, 0);
    return sum / members.length;
};



//=============================================================================
// ** 队伍（四次元仓库）【Game_Party】
//			
//			索引：	无
//			来源：	继承于Game_Unit
//			实例：	$gameParty
//			应用：	> 被 DataManager.makeSaveContents 作为专门的存储对象类。
//					> 被 Scene_MenuBase 作为专门的 角色对象选择器。
//			
//			作用域：	地图界面、战斗界面
//			主功能：	定义一个队伍，容纳多个实例化的角色单位。
//			子功能：	->数据类
//							->继承 单位组
//							->不含帧刷新
//						->D获取多个（继承）
//							->所有单位（继承）
//							->是否全部已死亡（继承）
//						->E单位组属性
//							->队伍能力
//							->计算先发制人概率
//							->计算偷袭概率
//						->2A仓库
//							->获取
//								> 武器
//								> 防具
//								> 物品
//							->容器
//								->获取容器
//								->获取数量
//								->最大数量
//								->是否数量已满
//								->添加 物品/武器/防具
//								->失去 物品/武器/防具
//								->消耗物品
//								->是否有指定 物品/武器/防具
//						->2B角色穿装备
//						->2C金钱
//						->2D全队员容器
//							->获取队员列表
//							->队伍管理
//								->角色入队
//								->角色离队
//								->切换顺序
//							->是否可使用物品（战斗时/菜单时）
//							->是否可控制（战斗时）
//						->2E玩家队员容器
//							->获取队员列表
//							->获取领队
//							->获取最大人数
//							->队伍名称
//							->初始队伍
//							->死亡的队员恢复1HP
//							->战斗结束移除状态
//						->2F战斗测试模式
//							->队员设置
//							->仓库设置
//						->2G步数累计
//						->2H存档数据
//							->获取 行走图索引
//							->获取 脸图索引
//						->2I菜单界面角色信息
//							->当前选中的物品
//							->当前选中的角色
//							->目标角色
//						->2J战斗姿势SV
//							->播放胜利姿势
//							->播放逃跑姿势
//			
//			说明：	> 2D全队员容器 和 2E玩家队员容器 是同一个容器，2E玩家队员容器 只是前几位的队员而已。
//					> 该类为存储数据，不能在实例中放obj对象。
//=============================================================================
//==============================
// * 队伍 - 定义
//==============================
function Game_Party(){
    this.initialize.apply(this, arguments);
}
Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;
//==============================
// * 队伍 - 初始化
//==============================
Game_Party.prototype.initialize = function(){
	Game_Unit.prototype.initialize.call(this);
	
	this._gold = 0;						//2C金钱
	
	this._steps = 0;					//2G步数累计
	
	this._lastItem = new Game_Item();	//2I菜单界面角色信息 - 当前选中的物品
	this._menuActorId = 0;				//2I菜单界面角色信息 - 当前选中的角色
	this._targetActorId = 0;			//2I菜单界面角色信息 - 目标角色
	
	this._actors = [];					//2D全队员容器 和 2E玩家队员容器
	
	// > 2A仓库 - 初始化
	this.initAllItems();
};

//==============================
// * D获取多个 - 所有单位（继承）
//
//			说明：	> 处于战斗界面时，按 2E玩家队员容器 算。
//					> 处于地图界面时，按 2D全队员容器 算。
//==============================
Game_Party.prototype.members = function(){
    return this.inBattle() ? this.battleMembers() : this.allMembers();
};
//==============================
// * D获取多个 - 是否全部已死亡（继承）
//==============================
Game_Party.prototype.isAllDead = function(){
    if( Game_Unit.prototype.isAllDead.call(this) ){
        return this.inBattle() || !this.isEmpty();
    }else{
        return false;
    }
};

//==============================
// * E单位组属性 - 常量
//==============================
Game_Party.ABILITY_ENCOUNTER_HALF    = 0;
Game_Party.ABILITY_ENCOUNTER_NONE    = 1;
Game_Party.ABILITY_CANCEL_SURPRISE   = 2;
Game_Party.ABILITY_RAISE_PREEMPTIVE  = 3;
Game_Party.ABILITY_GOLD_DOUBLE       = 4;
Game_Party.ABILITY_DROP_ITEM_DOUBLE  = 5;
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】
//==============================
Game_Party.prototype.partyAbility = function( abilityId ){
    return this.battleMembers().some(function( actor ){
        return actor.partyAbility(abilityId);
    });
};
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】 遇敌减半
//==============================
Game_Party.prototype.hasEncounterHalf = function(){
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_HALF);
};
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】 无遇敌
//==============================
Game_Party.prototype.hasEncounterNone = function(){
    return this.partyAbility(Game_Party.ABILITY_ENCOUNTER_NONE);
};
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】 取消遇敌
//==============================
Game_Party.prototype.hasCancelSurprise = function(){
    return this.partyAbility(Game_Party.ABILITY_CANCEL_SURPRISE);
};
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】 增加先发制人率
//==============================
Game_Party.prototype.hasRaisePreemptive = function(){
    return this.partyAbility(Game_Party.ABILITY_RAISE_PREEMPTIVE);
};
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】 双倍金钱
//==============================
Game_Party.prototype.hasGoldDouble = function(){
    return this.partyAbility(Game_Party.ABILITY_GOLD_DOUBLE);
};
//==============================
// * E单位组属性 - 【特性 > 其他 > 队伍能力】 双倍掉落物品
//==============================
Game_Party.prototype.hasDropItemDouble = function(){
    return this.partyAbility(Game_Party.ABILITY_DROP_ITEM_DOUBLE);
};
//==============================
// * E单位组属性 - 队伍中最高等级
//==============================
Game_Party.prototype.highestLevel = function(){
    return Math.max.apply(null, this.members().map(function( actor ){
        return actor.level;
    }));
};
//==============================
// * E单位组属性 - 计算先发制人概率
//==============================
Game_Party.prototype.ratePreemptive = function( troopAgi ){
    var rate = this.agility() >= troopAgi ? 0.05 : 0.03;
    if( this.hasRaisePreemptive() ){
        rate *= 4;
    }
    return rate;
};
//==============================
// * E单位组属性 - 计算偷袭概率
//==============================
Game_Party.prototype.rateSurprise = function( troopAgi ){
    var rate = this.agility() >= troopAgi ? 0.03 : 0.05;
    if( this.hasCancelSurprise() ){
        rate = 0;
    }
    return rate;
};


//==============================
// * 2A仓库 - 初始化
//==============================
Game_Party.prototype.initAllItems = function(){
    this._items = {};
    this._weapons = {};
    this._armors = {};
};
//==============================
// * 2A仓库 - 获取 - 全部武器
//==============================
Game_Party.prototype.weapons = function(){
    var list = [];
    for( var id in this._weapons ){
        list.push($dataWeapons[id]);
    }
    return list;
};
//==============================
// * 2A仓库 - 获取 - 全部防具
//==============================
Game_Party.prototype.armors = function(){
    var list = [];
    for( var id in this._armors ){
        list.push($dataArmors[id]);
    }
    return list;
};
//==============================
// * 2A仓库 - 获取 - 全部物品
//==============================
Game_Party.prototype.items = function(){
    var list = [];
    for( var id in this._items ){
        list.push($dataItems[id]);
    }
    return list;
};
//==============================
// * 2A仓库 - 获取 - 全部 武器+防具
//==============================
Game_Party.prototype.equipItems = function(){
    return this.weapons().concat(this.armors());
};
//==============================
// * 2A仓库 - 获取 - 全部 武器+防具+物品
//==============================
Game_Party.prototype.allItems = function(){
    return this.items().concat(this.equipItems());
};

//==============================
// * 2A仓库 - 容器 - 获取容器（包含 物品/武器/防具 的容器）
//==============================
Game_Party.prototype.itemContainer = function( item ){
    if( !item ){
        return null;
    }else if( DataManager.isItem(item) ){
        return this._items;
    }else if( DataManager.isWeapon(item) ){
        return this._weapons;
    }else if( DataManager.isArmor(item) ){
        return this._armors;
    }else{
        return null;
    }
};
//==============================
// * 2A仓库 - 容器 - 获取数量
//==============================
Game_Party.prototype.numItems = function( item ){
    var container = this.itemContainer(item);
    return container ? container[item.id] || 0 : 0;
};
//==============================
// * 2A仓库 - 容器 - 最大数量
//==============================
Game_Party.prototype.maxItems = function( item ){
    return 99;
};
//==============================
// * 2A仓库 - 容器 - 是否数量已满
//==============================
Game_Party.prototype.hasMaxItems = function( item ){
    return this.numItems(item) >= this.maxItems(item);
};
//==============================
// * 2A仓库 - 容器 - 添加 物品/武器/防具
//
//			参数：	> item 对象         （物品/武器/防具）
//					> amount 数字       （数量）
//					> includeEquip 布尔 （是否包含 队员装备 情况）
//			返回：	> 无
//
//			说明：	> 仓库与队员装备 的容器是分开的，所以要区分控制。
//==============================
Game_Party.prototype.gainItem = function( item, amount, includeEquip ){
    var container = this.itemContainer(item);
    if( container ){
        var lastNumber = this.numItems(item);
        var newNumber = lastNumber + amount;
        container[item.id] = newNumber.clamp(0, this.maxItems(item));
        if( container[item.id] === 0 ){
            delete container[item.id];
        }
        if( includeEquip && newNumber < 0 ){
            this.discardMembersEquip(item, -newNumber);
        }
        $gameMap.requestRefresh();
    }
};
//==============================
// * 2A仓库 - 容器 - 失去 物品/武器/防具
//
//			参数：	> item 对象         （物品/武器/防具）
//					> amount 数字       （数量）
//					> includeEquip 布尔 （是否包含 队员装备 情况）
//			返回：	> 无
//
//			说明：	> 仓库与队员装备 的容器是分开的，所以要区分控制。
//==============================
Game_Party.prototype.loseItem = function( item, amount, includeEquip ){
    this.gainItem(item, -amount, includeEquip);
};
//==============================
// * 2A仓库 - 容器 - 消耗物品
//==============================
Game_Party.prototype.consumeItem = function( item ){
    if( DataManager.isItem(item) && item.consumable ){
        this.loseItem(item, 1);
    }
};
//==============================
// * 2A仓库 - 容器 - 是否有指定 物品/武器/防具
//
//			参数：	> item 对象         （物品/武器/防具）
//					> includeEquip 布尔 （是否包含 队员装备 情况）
//			返回：	> 布尔
//
//			说明：	> 仓库与队员装备 的容器是分开的，所以要区分控制。
//==============================
Game_Party.prototype.hasItem = function( item, includeEquip ){
    if( includeEquip === undefined ){
        includeEquip = false;
    }
    if( this.numItems(item) > 0 ){
        return true;
    }else if( includeEquip && this.isAnyMemberEquipped(item) ){
        return true;
    }else{
        return false;
    }
};

//==============================
// * 2B角色穿装备 - 是否有队员装备物品
//==============================
Game_Party.prototype.isAnyMemberEquipped = function( item ){
    return this.members().some(function( actor ){
        return actor.equips().contains(item);
    });
};
//==============================
// * 2B角色穿装备 - 卸下装备
//==============================
Game_Party.prototype.discardMembersEquip = function( item, amount ){
    var n = amount;
    this.members().forEach(function( actor ){
        while (n > 0 && actor.isEquipped(item) ){
            actor.discardEquip(item);
            n--;
        }
    });
};

//==============================
// * 2C金钱 - 获取当前金钱
//==============================
Game_Party.prototype.gold = function(){
    return this._gold;
};
//==============================
// * 2C金钱 - 添加金钱
//==============================
Game_Party.prototype.gainGold = function( amount ){
    this._gold = (this._gold + amount).clamp(0, this.maxGold());
};
//==============================
// * 2C金钱 - 失去金钱
//==============================
Game_Party.prototype.loseGold = function( amount ){
    this.gainGold(-amount);
};
//==============================
// * 2C金钱 - 最大金钱数量
//==============================
Game_Party.prototype.maxGold = function(){
    return 99999999;
};


//==============================
// * 2D全队员容器 - 队员人数
//==============================
Game_Party.prototype.size = function(){
    return this.members().length;
};
//==============================
// * 2D全队员容器 - 是否为空
//==============================
Game_Party.prototype.isEmpty = function(){
    return this.size() === 0;
};
//==============================
// * 2D全队员容器 - 是否有队员
//==============================
Game_Party.prototype.exists = function(){
    return this._actors.length > 0;
};
//==============================
// * 2D全队员容器 - 获取队员列表
//==============================
Game_Party.prototype.allMembers = function(){
    return this._actors.map(function( id ){
        return $gameActors.actor(id);
    });
};
//==============================
// * 2D全队员容器 - 队伍管理 - 角色入队
//==============================
Game_Party.prototype.addActor = function( actorId ){
    if( !this._actors.contains(actorId) ){
        this._actors.push(actorId);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    }
};
//==============================
// * 2D全队员容器 - 队伍管理 - 角色离队
//==============================
Game_Party.prototype.removeActor = function( actorId ){
    if( this._actors.contains(actorId) ){
        this._actors.splice(this._actors.indexOf(actorId), 1);
        $gamePlayer.refresh();
        $gameMap.requestRefresh();
    }
};
//==============================
// * 2D全队员容器 - 队伍管理 - 切换顺序
//==============================
Game_Party.prototype.swapOrder = function( index1, index2 ){
    var temp = this._actors[index1];
    this._actors[index1] = this._actors[index2];
    this._actors[index2] = temp;
    $gamePlayer.refresh();
};
//==============================
// * 2D全队员容器 - 是否可使用物品（战斗时/菜单时）
//==============================
Game_Party.prototype.canUse = function( item ){
    return this.members().some(function( actor ){
        return actor.canUse(item);
    });
};
//==============================
// * 2D全队员容器 - 是否可控制（战斗时）
//==============================
Game_Party.prototype.canInput = function(){
    return this.members().some(function( actor ){
        return actor.canInput();
    });
};


//==============================
// * 2E玩家队员容器 - 获取队员列表
//==============================
Game_Party.prototype.battleMembers = function(){
    return this.allMembers().slice(0, this.maxBattleMembers()).filter(function( actor ){
        return actor.isAppeared();
    });
};
//==============================
// * 2E玩家队员容器 - 获取领队
//==============================
Game_Party.prototype.leader = function(){
    return this.battleMembers()[0];
};
//==============================
// * 2E玩家队员容器 - 获取最大人数
//==============================
Game_Party.prototype.maxBattleMembers = function(){
    return 4;
};
//==============================
// * 2E玩家队员容器 - 队伍名称（数据库 > 用语 > 队伍名 "%1的队伍"）
//==============================
Game_Party.prototype.name = function(){
    var numBattleMembers = this.battleMembers().length;
    if( numBattleMembers === 0 ){
        return '';
    }else if( numBattleMembers === 1 ){
        return this.leader().name();
    }else{
        return TextManager.partyName.format(this.leader().name());
    }
};
//==============================
// * 2E玩家队员容器 - 初始队伍 初始化（数据库 > 系统 > 初始队伍）
//
//			说明：	> 该函数在 新游戏时 只执行一次。
//==============================
Game_Party.prototype.setupStartingMembers = function(){
    this._actors = [];
    $dataSystem.partyMembers.forEach(function( actorId ){
        if( $gameActors.actor(actorId) ){
            this._actors.push(actorId);
        }
    }, this);
};
//==============================
// * 2E玩家队员容器 - 死亡的队员恢复1HP
//
//			说明：	> 该函数在 设置不可战败时 且战败 才触发，确保所有队员都不死。
//==============================
Game_Party.prototype.reviveBattleMembers = function(){
    this.battleMembers().forEach(function( actor ){
        if( actor.isDead() ){
            actor.setHp(1);
        }
    });
};
//==============================
// * 2E玩家队员容器 - 战斗结束移除状态
//
//			说明：	> 注意此函数值在战斗结束后移除 可移除 的状态。
//==============================
Game_Party.prototype.removeBattleStates = function(){
    this.members().forEach(function( actor ){
        actor.removeBattleStates();
    });
};


//==============================
// * 2F战斗测试模式 - 初始化
//==============================
Game_Party.prototype.setupBattleTest = function(){
    this.setupBattleTestMembers();
    this.setupBattleTestItems();
};
//==============================
// * 2F战斗测试模式 - 初始化 - 队员设置
//==============================
Game_Party.prototype.setupBattleTestMembers = function(){
    $dataSystem.testBattlers.forEach(function( battler ){
        var actor = $gameActors.actor(battler.actorId);
        if( actor ){
            actor.changeLevel(battler.level, false);
            actor.initEquips(battler.equips);
            actor.recoverAll();
            this.addActor(battler.actorId);
        }
    }, this);
};
//==============================
// * 2F战斗测试模式 - 初始化 - 仓库设置
//==============================
Game_Party.prototype.setupBattleTestItems = function(){
    $dataItems.forEach(function( item ){
        if( item && item.name.length > 0 ){
            this.gainItem(item, this.maxItems(item));
        }
    }, this);
};


//==============================
// * 2G步数累计 - 当前步数
//==============================
Game_Party.prototype.steps = function(){
    return this._steps;
};
//==============================
// * 2G步数累计 - 步数添加时
//
//			说明：	> 该函数与 物体基类函数 Game_CharacterBase.prototype.increaseSteps 无关。
//					> 并且只被 玩家函数 Game_Player.prototype.increaseSteps 调用。
//==============================
Game_Party.prototype.increaseSteps = function(){
    this._steps++;
};
//==============================
// * 2G步数累计 - 每步时执行
//==============================
Game_Party.prototype.onPlayerWalk = function(){
    this.members().forEach(function( actor ){
        return actor.onPlayerWalk();
    });
};


//==============================
// * 2H存档数据 - 获取 行走图索引
//==============================
Game_Party.prototype.charactersForSavefile = function(){
    return this.battleMembers().map(function( actor ){
        return [actor.characterName(), actor.characterIndex()];
    });
};
//==============================
// * 2H存档数据 - 获取 脸图索引
//==============================
Game_Party.prototype.facesForSavefile = function(){
    return this.battleMembers().map(function( actor ){
        return [actor.faceName(), actor.faceIndex()];
    });
};


//==============================
// * 2I菜单界面角色信息 - 获取 当前选中的物品
//==============================
Game_Party.prototype.lastItem = function(){
    return this._lastItem.object();
};
//==============================
// * 2I菜单界面角色信息 - 设置 当前选中的物品
//==============================
Game_Party.prototype.setLastItem = function( item ){
    this._lastItem.setObject(item);
};
//==============================
// * 2I菜单界面角色信息 - 获取 当前选中的角色
//==============================
Game_Party.prototype.menuActor = function(){
    var actor = $gameActors.actor(this._menuActorId);
    if( !this.members().contains(actor) ){
        actor = this.members()[0];
    }
    return actor;
};
//==============================
// * 2I菜单界面角色信息 - 设置 当前选中的角色
//==============================
Game_Party.prototype.setMenuActor = function( actor ){
    this._menuActorId = actor.actorId();
};
//==============================
// * 2I菜单界面角色信息 - 设置 下一个选中的角色
//==============================
Game_Party.prototype.makeMenuActorNext = function(){
    var index = this.members().indexOf(this.menuActor());
    if( index >= 0 ){
        index = (index + 1) % this.members().length;
        this.setMenuActor(this.members()[index]);
    }else{
        this.setMenuActor(this.members()[0]);
    }
};
//==============================
// * 2I菜单界面角色信息 - 设置 前一个选中的角色
//==============================
Game_Party.prototype.makeMenuActorPrevious = function(){
    var index = this.members().indexOf(this.menuActor());
    if( index >= 0 ){
        index = (index + this.members().length - 1) % this.members().length;
        this.setMenuActor(this.members()[index]);
    }else{
        this.setMenuActor(this.members()[0]);
    }
};
//==============================
// * 2I菜单界面角色信息 - 获取 目标角色
//==============================
Game_Party.prototype.targetActor = function(){
    var actor = $gameActors.actor(this._targetActorId);
    if( !this.members().contains(actor) ){
        actor = this.members()[0];
    }
    return actor;
};
//==============================
// * 2I菜单界面角色信息 - 设置 目标角色
//==============================
Game_Party.prototype.setTargetActor = function( actor ){
    this._targetActorId = actor.actorId();
};


//==============================
// * 2J战斗姿势SV - 播放胜利姿势
//==============================
Game_Party.prototype.performVictory = function(){
    this.members().forEach(function( actor ){
        actor.performVictory();
    });
};
//==============================
// * 2J战斗姿势SV - 播放逃跑姿势
//==============================
Game_Party.prototype.performEscape = function(){
    this.members().forEach(function( actor ){
        actor.performEscape();
    });
};
//==============================
// * 2J战斗姿势SV - 刷新姿势
//==============================
Game_Party.prototype.requestMotionRefresh = function(){
    this.members().forEach(function( actor ){
        actor.requestMotionRefresh();
    });
};



//=============================================================================
// ** 敌群【Game_Troop】
//			
//			索引：	无
//			来源：	继承于Game_Unit
//			实例：	$gameTroop
//			应用：	> 战斗图层Spriteset_Battle 创建敌人贴图 函数。 
//					> 被 BattleManager 作为全局数据类进行调用。
//			
//			作用域：	战斗界面
//			主功能：	定义一个敌群，容纳多个实例化的敌人单位。
//			子功能：	->数据类
//							->继承 单位组
//							->不含帧刷新
//						->2A数据库
//							> 敌群数据库
//							> 敌人容器
//							->载入敌群数据
//							->清理全部
//						->2B敌群事件
//							->事件指令解释器
//							->直接与敌群数据融合在一起
//						->2C回合
//						->2D唯一命名
//						->2E敌群结算
//							->获取金钱总量
//							->获取经验总量
//							->掉落的物品
//			
//			说明：	> 该类控制敌群数据与相关战斗数据。
//					> 非存储数据，可以在实例中放obj对象。
//					> 注意，由于【$gameTroop不存，而$gameParty存】，所以写 战斗角色和战斗敌人 相关子插件时，
//					  二者的容器结构是完全不同的。
//=============================================================================
//==============================
// * 敌群 - 定义
//==============================
function Game_Troop(){
    this.initialize.apply(this, arguments);
}
Game_Troop.prototype = Object.create(Game_Unit.prototype);
Game_Troop.prototype.constructor = Game_Troop;
//==============================
// * 敌群 - 初始化
//==============================
Game_Troop.prototype.initialize = function(){
    Game_Unit.prototype.initialize.call(this);
	
    this._interpreter = new Game_Interpreter();		//2B敌群事件 - 解释器
    
	this.clear();	//（数据初始化）
};

//==============================
// * 2A数据库 - 数据初始化
//==============================
Game_Troop.prototype.clear = function(){
    this._interpreter.clear();		//2B敌群事件 - 解释器（战斗界面用）
	
    this._troopId = 0;				//2A数据库 - 敌群ID
    this._enemies = [];				//2A数据库 - 敌人数据组
	
    this._eventFlags = {};			//2C回合 - 回合条件
    this._turnCount = 0;			//2C回合 - 回合数
	
    this._namesCount = {};			//2D唯一命名 - 重复名称计数器
};
//==============================
// * 2A数据库 - 载入敌群数据
//
//			说明：	> 该函数被 BattleManager.setup 调用，即每次开始战斗前，会重刷一次。
//==============================
Game_Troop.prototype.setup = function( troopId ){
    this.clear();	//（数据初始化）
	
    this._troopId = troopId;
    this._enemies = [];
	
	// > 建立敌人单位
    this.troop().members.forEach(function( member ){
        if( $dataEnemies[member.enemyId] ){
            var enemyId = member.enemyId;
            var x = member.x;
            var y = member.y;
            var enemy = new Game_Enemy(enemyId, x, y);
			
			// > 中途出现标记
            if( member.hidden ){
                enemy.hide();
            }
            this._enemies.push(enemy);
        }
    }, this);
	
	// > 唯一命名
    this.makeUniqueNames();
};
//==============================
// * 2A数据库 - 属性
//==============================
Game_Troop.prototype.troop = function(){ return $dataTroops[this._troopId]; };	//敌群数据库
Game_Troop.prototype.members = function(){ return this._enemies; };				//敌人容器

//==============================
// * 2B敌群事件 - 帧刷新解释器
//
//			说明：	> 该类 不含帧刷新，该函数被 BattleManager.updateEventMain 执行。
//==============================
Game_Troop.prototype.updateInterpreter = function(){
    this._interpreter.update();
};
//==============================
// * 2B敌群事件 - 是否正在运行串行事件
//==============================
Game_Troop.prototype.isEventRunning = function(){
    return this._interpreter.isRunning();
};
//==============================
// * 2B敌群事件 - 设置战斗事件
//
//			说明：	> 这里的战斗事件页与敌群数据是嵌入在一起的，一个敌群相当于一个事件，含多个事件页。
//==============================
Game_Troop.prototype.setupBattleEvent = function(){
    if( !this._interpreter.isRunning() ){
		
		// > 公共事件情况
        if( this._interpreter.setupReservedCommonEvent() ){
            return;
        }
		
		// > 战斗事件（事件页）
        var pages = this.troop().pages;
        for(var i = 0; i < pages.length; i++ ){
            var page = pages[i];
            if( this.meetsConditions(page) && !this._eventFlags[i] ){
                this._interpreter.setup(page.list);
                if( page.span <= 1 ){
                    this._eventFlags[i] = true;
                }
                break;
            }
        }
    }
};
//==============================
// * 2B敌群事件 - 判断事件页条件
//==============================
Game_Troop.prototype.meetsConditions = function( page ){
    var c = page.conditions;
	
	// > 条件 - 不执行（未定义任何条件时，该事件页作废）
    if( !c.turnEnding && !c.turnValid && !c.enemyValid && !c.actorValid && !c.switchValid ){
        return false; 
    }
	
	// > 条件 - 回合结束
    if( c.turnEnding ){
        if( !BattleManager.isTurnEnd() ){
            return false;
        }
    }
	// > 条件 - 回合
    if( c.turnValid ){
        var n = this._turnCount;
        var a = c.turnA;
        var b = c.turnB;
        if( (b === 0 && n !== a) ){
            return false;
        }
        if( (b > 0 && (n < 1 || n < a || n % b !== a % b)) ){
            return false;
        }
    }
	// > 条件 - 敌人HP
    if( c.enemyValid ){
        var enemy = $gameTroop.members()[c.enemyIndex];
        if( !enemy || enemy.hpRate() * 100 > c.enemyHp ){
            return false;
        }
    }
	// > 条件 - 角色HP
    if( c.actorValid ){
        var actor = $gameActors.actor(c.actorId);
        if( !actor || actor.hpRate() * 100 > c.actorHp ){
            return false;
        }
    }
	// > 条件 - 开关
    if( c.switchValid ){
        if( !$gameSwitches.value(c.switchId) ){
            return false;
        }
    }
    return true;
};

//==============================
// * 2C回合 - 回合数
//==============================
Game_Troop.prototype.turnCount = function(){ return this._turnCount; };
//==============================
// * 2C回合 - 进入下一回合
//==============================
Game_Troop.prototype.increaseTurn = function(){
    var pages = this.troop().pages;
    for( var i = 0; i < pages.length; i++ ){
        var page = pages[i];
        if( page.span === 1 ){
            this._eventFlags[i] = false;
        }
    }
    this._turnCount++;
};

//==============================
// * 2D唯一命名 - 常量
//==============================
Game_Troop.LETTER_TABLE_HALF = [
    ' A',' B',' C',' D',' E',' F',' G',' H',' I',' J',' K',' L',' M',
    ' N',' O',' P',' Q',' R',' S',' T',' U',' V',' W',' X',' Y',' Z'
];
Game_Troop.LETTER_TABLE_FULL = [
    'Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ',
    'Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ'
];
//==============================
// * 2D唯一命名 - 设置命名
//==============================
Game_Troop.prototype.makeUniqueNames = function(){
    var table = this.letterTable();
    this.members().forEach(function( enemy ){
        if( enemy.isAlive() && enemy.isLetterEmpty() ){
            var name = enemy.originalName();
            var n = this._namesCount[name] || 0;
            enemy.setLetter(table[n % table.length]);
            this._namesCount[name] = n + 1;
        }
    }, this);
    this.members().forEach(function( enemy ){
        var name = enemy.originalName();
        if( this._namesCount[name] >= 2 ){
            enemy.setPlural(true);
        }
    }, this);
};
//==============================
// * 2D唯一命名 - 根据语种判断单字符与半字符（用不上）
//==============================
Game_Troop.prototype.letterTable = function(){
    return $gameSystem.isCJK() ? Game_Troop.LETTER_TABLE_FULL :
            Game_Troop.LETTER_TABLE_HALF;
};
//==============================
// * 2D唯一命名 - 获取敌人名称
//==============================
Game_Troop.prototype.enemyNames = function(){
    var names = [];
    this.members().forEach(function( enemy ){
        var name = enemy.originalName();
        if( enemy.isAlive() && !names.contains(name) ){
            names.push(name);
        }
    });
    return names;
};

//==============================
// * 2E敌群结算 - 获取金钱总量
//==============================
Game_Troop.prototype.goldTotal = function(){
    return this.deadMembers().reduce(function( r, enemy ){
        return r + enemy.gold();
    }, 0) * this.goldRate();
};
//==============================
// * 2E敌群结算 - 获取金钱总量 - 金钱倍率（特性 > 队伍能力 > 双倍金钱）
//==============================
Game_Troop.prototype.goldRate = function(){ return $gameParty.hasGoldDouble() ? 2 : 1; };
//==============================
// * 2E敌群结算 - 获取经验总量
//==============================
Game_Troop.prototype.expTotal = function(){
    return this.deadMembers().reduce(function( r, enemy ){
        return r + enemy.exp();
    }, 0);
};
//==============================
// * 2E敌群结算 - 掉落的物品
//==============================
Game_Troop.prototype.makeDropItems = function(){
    return this.deadMembers().reduce(function( r, enemy ){
        return r.concat(enemy.makeDropItems());
    }, []);
};

//-----------------------------------------------------------------------------
// Game_Map
//
// The game object class for a map. It contains scrolling and passage
// determination functions.

function Game_Map() {
    this.initialize.apply(this, arguments);
}

Game_Map.prototype.initialize = function() {
    this._interpreter = new Game_Interpreter();
    this._mapId = 0;
    this._tilesetId = 0;
    this._events = [];
    this._commonEvents = [];
    this._vehicles = [];
    this._displayX = 0;
    this._displayY = 0;
    this._nameDisplay = true;
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
    this._parallaxName = '';
    this._parallaxZero = false;
    this._parallaxLoopX = false;
    this._parallaxLoopY = false;
    this._parallaxSx = 0;
    this._parallaxSy = 0;
    this._parallaxX = 0;
    this._parallaxY = 0;
    this._battleback1Name = null;
    this._battleback2Name = null;
    this.createVehicles();
};

Game_Map.prototype.setup = function(mapId) {
    if (!$dataMap) {
        throw new Error('The map data is not available');
    }
    this._mapId = mapId;
    this._tilesetId = $dataMap.tilesetId;
    this._displayX = 0;
    this._displayY = 0;
    this.refereshVehicles();
    this.setupEvents();
    this.setupScroll();
    this.setupParallax();
    this.setupBattleback();
    this._needsRefresh = false;
};

Game_Map.prototype.isEventRunning = function() {
    return this._interpreter.isRunning() || this.isAnyEventStarting();
};

Game_Map.prototype.tileWidth = function() {
    return 48;
};

Game_Map.prototype.tileHeight = function() {
    return 48;
};

Game_Map.prototype.mapId = function() {
    return this._mapId;
};

Game_Map.prototype.tilesetId = function() {
    return this._tilesetId;
};

Game_Map.prototype.displayX = function() {
    return this._displayX;
};

Game_Map.prototype.displayY = function() {
    return this._displayY;
};

Game_Map.prototype.parallaxName = function() {
    return this._parallaxName;
};

Game_Map.prototype.battleback1Name = function() {
    return this._battleback1Name;
};

Game_Map.prototype.battleback2Name = function() {
    return this._battleback2Name;
};

Game_Map.prototype.requestRefresh = function(mapId) {
    this._needsRefresh = true;
};

Game_Map.prototype.isNameDisplayEnabled = function() {
    return this._nameDisplay;
};

Game_Map.prototype.disableNameDisplay = function() {
    this._nameDisplay = false;
};

Game_Map.prototype.enableNameDisplay = function() {
    this._nameDisplay = true;
};

Game_Map.prototype.createVehicles = function() {
    this._vehicles = [];
    this._vehicles[0] = new Game_Vehicle('boat');
    this._vehicles[1] = new Game_Vehicle('ship');
    this._vehicles[2] = new Game_Vehicle('airship');
};

Game_Map.prototype.refereshVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.refresh();
    });
};

Game_Map.prototype.vehicles = function() {
    return this._vehicles;
};

Game_Map.prototype.vehicle = function(type) {
    if (type ===  0 || type === 'boat') {
        return this.boat();
    } else if (type ===  1 || type === 'ship') {
        return this.ship();
    } else if (type ===  2 || type === 'airship') {
        return this.airship();
    } else {
        return null;
    }
};

Game_Map.prototype.boat = function() {
    return this._vehicles[0];
};

Game_Map.prototype.ship = function() {
    return this._vehicles[1];
};

Game_Map.prototype.airship = function() {
    return this._vehicles[2];
};

Game_Map.prototype.setupEvents = function() {
    this._events = [];
    for (var i = 0; i < $dataMap.events.length; i++) {
        if ($dataMap.events[i]) {
            this._events[i] = new Game_Event(this._mapId, i);
        }
    }
    this._commonEvents = this.parallelCommonEvents().map(function(commonEvent) {
        return new Game_CommonEvent(commonEvent.id);
    });
    this.refreshTileEvents();
};

Game_Map.prototype.events = function() {
    return this._events.filter(function(event) {
        return !!event;
    });
};

Game_Map.prototype.event = function(eventId) {
    return this._events[eventId];
};

Game_Map.prototype.eraseEvent = function(eventId) {
    this._events[eventId].erase();
};

Game_Map.prototype.parallelCommonEvents = function() {
    return $dataCommonEvents.filter(function(commonEvent) {
        return commonEvent && commonEvent.trigger === 2;
    });
};

Game_Map.prototype.setupScroll = function() {
    this._scrollDirection = 2;
    this._scrollRest = 0;
    this._scrollSpeed = 4;
};

Game_Map.prototype.setupParallax = function() {
    this._parallaxName = $dataMap.parallaxName || '';
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    this._parallaxLoopX = $dataMap.parallaxLoopX;
    this._parallaxLoopY = $dataMap.parallaxLoopY;
    this._parallaxSx = $dataMap.parallaxSx;
    this._parallaxSy = $dataMap.parallaxSy;
    this._parallaxX = 0;
    this._parallaxY = 0;
};

Game_Map.prototype.setupBattleback = function() {
    if ($dataMap.specifyBattleback) {
        this._battleback1Name = $dataMap.battleback1Name;
        this._battleback2Name = $dataMap.battleback2Name;
    } else {
        this._battleback1Name = null;
        this._battleback2Name = null;
    }
};

Game_Map.prototype.setDisplayPos = function(x, y) {
    if (this.isLoopHorizontal()) {
        this._displayX = x.mod(this.width());
        this._parallaxX = x;
    } else {
        var endX = this.width() - this.screenTileX();
        this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        this._parallaxX = this._displayX;
    }
    if (this.isLoopVertical()) {
        this._displayY = y.mod(this.height());
        this._parallaxY = y;
    } else {
        var endY = this.height() - this.screenTileY();
        this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        this._parallaxY = this._displayY;
    }
};

Game_Map.prototype.parallaxOx = function() {
    if (this._parallaxZero) {
        return this._parallaxX * this.tileWidth();
    } else if (this._parallaxLoopX) {
        return this._parallaxX * this.tileWidth() / 2;
    } else {
        return 0;
    }
};

Game_Map.prototype.parallaxOy = function() {
    if (this._parallaxZero) {
        return this._parallaxY * this.tileHeight();
    } else if (this._parallaxLoopY) {
        return this._parallaxY * this.tileHeight() / 2;
    } else {
        return 0;
    }
};

Game_Map.prototype.tileset = function() {
    return $dataTilesets[this._tilesetId];
};

Game_Map.prototype.tilesetFlags = function() {
    var tileset = this.tileset();
    if (tileset) {
        return tileset.flags;
    } else {
        return [];
    }
};

Game_Map.prototype.displayName = function() {
    return $dataMap.displayName;
};

Game_Map.prototype.width = function() {
    return $dataMap.width;
};

Game_Map.prototype.height = function() {
    return $dataMap.height;
};

Game_Map.prototype.data = function() {
    return $dataMap.data;
};

Game_Map.prototype.isLoopHorizontal = function() {
    return $dataMap.scrollType === 2 || $dataMap.scrollType === 3;
};

Game_Map.prototype.isLoopVertical = function() {
    return $dataMap.scrollType === 1 || $dataMap.scrollType === 3;
};

Game_Map.prototype.isDashDisabled = function() {
    return $dataMap.disableDashing;
};

Game_Map.prototype.encounterList = function() {
    return $dataMap.encounterList;
};

Game_Map.prototype.encounterStep = function() {
    return $dataMap.encounterStep;
};

Game_Map.prototype.isOverworld = function() {
    return this.tileset() && this.tileset().mode === 0;
};

Game_Map.prototype.screenTileX = function() {
    return Graphics.width / this.tileWidth();
};

Game_Map.prototype.screenTileY = function() {
    return Graphics.height / this.tileHeight();
};

Game_Map.prototype.adjustX = function(x) {
    if (this.isLoopHorizontal() && x < this._displayX -
            (this.width() - this.screenTileX()) / 2) {
        return x - this._displayX + $dataMap.width;
    } else {
        return x - this._displayX;
    }
};

Game_Map.prototype.adjustY = function(y) {
    if (this.isLoopVertical() && y < this._displayY -
            (this.height() - this.screenTileY()) / 2) {
        return y - this._displayY + $dataMap.height;
    } else {
        return y - this._displayY;
    }
};

Game_Map.prototype.roundX = function(x) {
    return this.isLoopHorizontal() ? x.mod(this.width()) : x;
};

Game_Map.prototype.roundY = function(y) {
    return this.isLoopVertical() ? y.mod(this.height()) : y;
};

Game_Map.prototype.xWithDirection = function(x, d) {
    return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
};

Game_Map.prototype.yWithDirection = function(y, d) {
    return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
};

Game_Map.prototype.roundXWithDirection = function(x, d) {
    return this.roundX(x + (d === 6 ? 1 : d === 4 ? -1 : 0));
};

Game_Map.prototype.roundYWithDirection = function(y, d) {
    return this.roundY(y + (d === 2 ? 1 : d === 8 ? -1 : 0));
};

Game_Map.prototype.deltaX = function(x1, x2) {
    var result = x1 - x2;
    if (this.isLoopHorizontal() && Math.abs(result) > this.width() / 2) {
        if (result < 0) {
            result += this.width();
        } else {
            result -= this.width();
        }
    }
    return result;
};

Game_Map.prototype.deltaY = function(y1, y2) {
    var result = y1 - y2;
    if (this.isLoopVertical() && Math.abs(result) > this.height() / 2) {
        if (result < 0) {
            result += this.height();
        } else {
            result -= this.height();
        }
    }
    return result;
};

Game_Map.prototype.distance = function(x1, y1, x2, y2) {
    return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
};

Game_Map.prototype.canvasToMapX = function(x) {
    var tileWidth = this.tileWidth();
    var originX = this._displayX * tileWidth;
    var mapX = Math.floor((originX + x) / tileWidth);
    return this.roundX(mapX);
};

Game_Map.prototype.canvasToMapY = function(y) {
    var tileHeight = this.tileHeight();
    var originY = this._displayY * tileHeight;
    var mapY = Math.floor((originY + y) / tileHeight);
    return this.roundY(mapY);
};

Game_Map.prototype.autoplay = function() {
    if ($dataMap.autoplayBgm) {
        if ($gamePlayer.isInVehicle()) {
            $gameSystem.saveWalkingBgm2();
        } else {
            AudioManager.playBgm($dataMap.bgm);
        }
    }
    if ($dataMap.autoplayBgs) {
        AudioManager.playBgs($dataMap.bgs);
    }
};

Game_Map.prototype.refreshIfNeeded = function() {
    if (this._needsRefresh) {
        this.refresh();
    }
};

Game_Map.prototype.refresh = function() {
    this.events().forEach(function(event) {
        event.refresh();
    });
    this._commonEvents.forEach(function(event) {
        event.refresh();
    });
    this.refreshTileEvents();
    this._needsRefresh = false;
};

Game_Map.prototype.refreshTileEvents = function() {
    this.tileEvents = this.events().filter(function(event) {
        return event.isTile();
    });
};

Game_Map.prototype.eventsXy = function(x, y) {
    return this.events().filter(function(event) {
        return event.pos(x, y);
    });
};

Game_Map.prototype.eventsXyNt = function(x, y) {
    return this.events().filter(function(event) {
        return event.posNt(x, y);
    });
};

Game_Map.prototype.tileEventsXy = function(x, y) {
    return this.tileEvents.filter(function(event) {
        return event.posNt(x, y);
    });
};

Game_Map.prototype.eventIdXy = function(x, y) {
    var list = this.eventsXy(x, y);
    return list.length === 0 ? 0 : list[0].eventId();
};

Game_Map.prototype.scrollDown = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY += distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.min(this._displayY + distance,
            this.height() - this.screenTileY());
        this._parallaxY += this._displayY - lastY;
    }
};

Game_Map.prototype.scrollLeft = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += $dataMap.width - distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX -= distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.max(this._displayX - distance, 0);
        this._parallaxX += this._displayX - lastX;
    }
};

Game_Map.prototype.scrollRight = function(distance) {
    if (this.isLoopHorizontal()) {
        this._displayX += distance;
        this._displayX %= $dataMap.width;
        if (this._parallaxLoopX) {
            this._parallaxX += distance;
        }
    } else if (this.width() >= this.screenTileX()) {
        var lastX = this._displayX;
        this._displayX = Math.min(this._displayX + distance,
            this.width() - this.screenTileX());
        this._parallaxX += this._displayX - lastX;
    }
};

Game_Map.prototype.scrollUp = function(distance) {
    if (this.isLoopVertical()) {
        this._displayY += $dataMap.height - distance;
        this._displayY %= $dataMap.height;
        if (this._parallaxLoopY) {
            this._parallaxY -= distance;
        }
    } else if (this.height() >= this.screenTileY()) {
        var lastY = this._displayY;
        this._displayY = Math.max(this._displayY - distance, 0);
        this._parallaxY += this._displayY - lastY;
    }
};

Game_Map.prototype.isValid = function(x, y) {
    return x >= 0 && x < this.width() && y >= 0 && y < this.height();
};

Game_Map.prototype.checkPassage = function(x, y, bit) {
    var flags = this.tilesetFlags();
    var tiles = this.allTiles(x, y);
    for (var i = 0; i < tiles.length; i++) {
        var flag = flags[tiles[i]];
        if ((flag & 0x10) !== 0)  // [*] No effect on passage
            continue;
        if ((flag & bit) === 0)   // [o] Passable
            return true;
        if ((flag & bit) === bit) // [x] Impassable
            return false;
    }
    return false;
};

Game_Map.prototype.tileId = function(x, y, z) {
    var width = $dataMap.width;
    var height = $dataMap.height;
    return $dataMap.data[(z * height + y) * width + x] || 0;
};

Game_Map.prototype.layeredTiles = function(x, y) {
    var tiles = [];
    for (var i = 0; i < 4; i++) {
        tiles.push(this.tileId(x, y, 3 - i));
    }
    return tiles;
};

Game_Map.prototype.allTiles = function(x, y) {
    var tiles = this.tileEventsXy(x, y).map(function(event) {
        return event.tileId();
    });
    return tiles.concat(this.layeredTiles(x, y));
};

Game_Map.prototype.autotileType = function(x, y, z) {
    var tileId = this.tileId(x, y, z);
    return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
};

Game_Map.prototype.isPassable = function(x, y, d) {
    return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
};

Game_Map.prototype.isBoatPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0200);
};

Game_Map.prototype.isShipPassable = function(x, y) {
    return this.checkPassage(x, y, 0x0400);
};

Game_Map.prototype.isAirshipLandOk = function(x, y) {
    return this.checkPassage(x, y, 0x0800) && this.checkPassage(x, y, 0x0f);
};

Game_Map.prototype.checkLayeredTilesFlags = function(x, y, bit) {
    var flags = this.tilesetFlags();
    return this.layeredTiles(x, y).some(function(tileId) {
        return (flags[tileId] & bit) !== 0;
    });
};

Game_Map.prototype.isLadder = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
};

Game_Map.prototype.isBush = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
};

Game_Map.prototype.isCounter = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
};

Game_Map.prototype.isDamageFloor = function(x, y) {
    return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
};

Game_Map.prototype.terrainTag = function(x, y) {
    if (this.isValid(x, y)) {
        var flags = this.tilesetFlags();
        var tiles = this.layeredTiles(x, y);
        for (var i = 0; i < tiles.length; i++) {
            var tag = flags[tiles[i]] >> 12;
            if (tag > 0) {
                return tag;
            }
        }
    }
    return 0;
};

Game_Map.prototype.regionId = function(x, y) {
    return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
};

Game_Map.prototype.startScroll = function(direction, distance, speed) {
    this._scrollDirection = direction;
    this._scrollRest = distance;
    this._scrollSpeed = speed;
};

Game_Map.prototype.isScrolling = function() {
    return this._scrollRest > 0;
};

Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();
    }
    this.updateScroll();
    this.updateEvents();
    this.updateVehicles();
    this.updateParallax();
};

Game_Map.prototype.updateScroll = function() {
    if (this.isScrolling()) {
        var lastX = this._displayX;
        var lastY = this._displayY;
        this.doScroll(this._scrollDirection, this.scrollDistance());
        if (this._displayX === lastX && this._displayY === lastY) {
            this._scrollRest = 0;
        } else {
            this._scrollRest -= this.scrollDistance();
        }
    }
};

Game_Map.prototype.scrollDistance = function() {
    return Math.pow(2, this._scrollSpeed) / 256;
};

Game_Map.prototype.doScroll = function(direction, distance) {
    switch (direction) {
    case 2:
        this.scrollDown(distance);
        break;
    case 4:
        this.scrollLeft(distance);
        break;
    case 6:
        this.scrollRight(distance);
        break;
    case 8:
        this.scrollUp(distance);
        break;
    }
};

Game_Map.prototype.updateEvents = function() {
    this.events().forEach(function(event) {
        event.update();
    });
    this._commonEvents.forEach(function(event) {
        event.update();
    });
};

Game_Map.prototype.updateVehicles = function() {
    this._vehicles.forEach(function(vehicle) {
        vehicle.update();
    });
};

Game_Map.prototype.updateParallax = function() {
    if (this._parallaxLoopX) {
        this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
    }
    if (this._parallaxLoopY) {
        this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
    }
};

Game_Map.prototype.changeTileset = function(tilesetId) {
    this._tilesetId = tilesetId;
    this.refresh();
};

Game_Map.prototype.changeBattleback = function(battleback1Name, battleback2Name) {
    this._battleback1Name = battleback1Name;
    this._battleback2Name = battleback2Name;
};

Game_Map.prototype.changeParallax = function(name, loopX, loopY, sx, sy) {
    this._parallaxName = name;
    this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
    if (this._parallaxLoopX && !loopX) {
        this._parallaxX = 0;
    }
    if (this._parallaxLoopY && !loopY) {
        this._parallaxY = 0;
    }
    this._parallaxLoopX = loopX;
    this._parallaxLoopY = loopY;
    this._parallaxSx = sx;
    this._parallaxSy = sy;
};

Game_Map.prototype.updateInterpreter = function() {
    for (;;) {
        this._interpreter.update();
        if (this._interpreter.isRunning()) {
            return;
        }
        if (this._interpreter.eventId() > 0) {
            this.unlockEvent(this._interpreter.eventId());
            this._interpreter.clear();
        }
        if (!this.setupStartingEvent()) {
            return;
        }
    }
};

Game_Map.prototype.unlockEvent = function(eventId) {
    if (this._events[eventId]) {
        this._events[eventId].unlock();
    }
};

Game_Map.prototype.setupStartingEvent = function() {
    this.refreshIfNeeded();
    if (this._interpreter.setupReservedCommonEvent()) {
        return true;
    }
    if (this.setupTestEvent()) {
        return true;
    }
    if (this.setupStartingMapEvent()) {
        return true;
    }
    if (this.setupAutorunCommonEvent()) {
        return true;
    }
    return false;
};

Game_Map.prototype.setupTestEvent = function() {
    if ($testEvent) {
        this._interpreter.setup($testEvent, 0);
        $testEvent = null;
        return true;
    }
    return false;
};

Game_Map.prototype.setupStartingMapEvent = function() {
    var events = this.events();
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.isStarting()) {
            event.clearStartingFlag();
            this._interpreter.setup(event.list(), event.eventId());
            return true;
        }
    }
    return false;
};

Game_Map.prototype.setupAutorunCommonEvent = function() {
    for (var i = 0; i < $dataCommonEvents.length; i++) {
        var event = $dataCommonEvents[i];
        if (event && event.trigger === 1 && $gameSwitches.value(event.switchId)) {
            this._interpreter.setup(event.list);
            return true;
        }
    }
    return false;
};

Game_Map.prototype.isAnyEventStarting = function() {
    return this.events().some(function(event) {
        return event.isStarting();
    });
};

//-----------------------------------------------------------------------------
// Game_CommonEvent
//
// The game object class for a common event. It contains functionality for
// running parallel process events.

function Game_CommonEvent() {
    this.initialize.apply(this, arguments);
}

Game_CommonEvent.prototype.initialize = function(commonEventId) {
    this._commonEventId = commonEventId;
    this.refresh();
};

Game_CommonEvent.prototype.event = function() {
    return $dataCommonEvents[this._commonEventId];
};

Game_CommonEvent.prototype.list = function() {
    return this.event().list;
};

Game_CommonEvent.prototype.refresh = function() {
    if (this.isActive()) {
        if (!this._interpreter) {
            this._interpreter = new Game_Interpreter();
        }
    } else {
        this._interpreter = null;
    }
};

Game_CommonEvent.prototype.isActive = function() {
    var event = this.event();
    return event.trigger === 2 && $gameSwitches.value(event.switchId);
};

Game_CommonEvent.prototype.update = function() {
    if (this._interpreter) {
        if (!this._interpreter.isRunning()) {
            this._interpreter.setup(this.list());
        }
        this._interpreter.update();
    }
};


//=============================================================================
// ** 物体基类【Game_CharacterBase】
//			
//			索引：	无
//			来源：	无（独立数据）
//			实例：	无（父类）
//			应用：	只被Game_Character继承。
//					
//			作用域：	地图界面
//			主功能：	定义一个最基本的物体。
//			子功能：
//						->A坐标
//							> 设置坐标
//							> 相对镜头所在位置
//							> 所在图块信息
//							> 所在R图块
//						->B贴图属性
//							> 透明度
//							> 混合模式
//							> 灌木丛
//						->C勾选设置
//						->D动作
//							->静止
//							->朝向
//							->移动
//								->执行接触触发
//							->奔跑
//							->跳跃
//						->E可通行
//							> 可通行判断
//							> 穿透关系
//						->F行走图
//							->动画帧
//								> 朝向
//								> 帧数
//								> 初始帧
//							->类型
//								> 单行走图
//								> 八行走图
//								> 图块行走图
//							->物体行走图标记
//						->G动画
//						->H气泡
//					
//			说明：	> 物体的基类，包含行走图、动作等属性。
//					> 行走图是一个比较大的功能块，相关说明文档去看看："7.行走图 > 关于行走图与图块.docx"
//=============================================================================
//==============================
// * 物体基类 - 定义
//==============================
function Game_CharacterBase(){
    this.initialize.apply(this, arguments);
}
//==============================
// * 物体基类 - 初始化
//==============================
Game_CharacterBase.prototype.initialize = function(){
    this.initMembers();
};
//==============================
// * 物体基类 - 初始化属性
//==============================
Game_CharacterBase.prototype.initMembers = function(){
    this._x = 0;							//A坐标 - 位置X（图块，整数）
    this._y = 0;							//A坐标 - 位置Y（图块，整数）
    this._realX = 0;						//A坐标 - 位置X（图块，精确小数）
    this._realY = 0;						//A坐标 - 位置Y（图块，精确小数）
	
    this._opacity = 255;					//B贴图属性 - 透明度
    this._blendMode = 0;					//B贴图属性 - 混合模式
    this._bushDepth = 0;					//B贴图属性 - 灌木丛高度
	
    this._walkAnime = true;					//C勾选设置 - 步行动画
    this._stepAnime = false;				//C勾选设置 - 踏步动画
    this._directionFix = false;				//C勾选设置 - 固定朝向
    this._through = false;					//C勾选设置 - 是否穿透
    this._transparent = false;				//C勾选设置 - 是否透明（移动路线中）
	
    this._stopCount = 0;					//D动作 - 静止
    this._direction = 2;					//D动作 - 朝向
    this._moveSpeed = 4;					//D动作 - 移动速度
    this._moveFrequency = 6;				//D动作 - 移动频率
    this._jumpCount = 0;					//D动作 - 跳跃时间
    this._jumpPeak = 0;						//D动作 - 跳跃峰值
	
    this._movementSuccess = true;			//E可通行 - 移动成功标记
    this._priorityType = 1;					//E可通行 - 优先级（0：在人物下方，1：与人物相同，2：在人物上方）
	
    this._pattern = 1;						//F行走图 - 动画帧
    this._tileId = 0;						//F行走图 - 图块行走图
    this._characterName = '';				//F行走图 - 名称
    this._characterIndex = 0;				//F行走图 - 图区域
    this._animationCount = 0;				//F行走图 - 计数器
    this._isObjectCharacter = false;		//F行走图 - 物体行走图标记
	
	this._animationId = 0;					//G动画 - 动画id
    this._animationPlaying = false;			//G动画 - 动画播放中
	
    this._balloonId = 0;					//H气泡 - 气泡id
    this._balloonPlaying = false;			//H气泡 - 气泡播放中
};
//==============================
// * 物体基类 - 帧刷新
//==============================
Game_CharacterBase.prototype.update = function(){
	
    if( this.isStopping() ){ this.updateStop(); }		//帧刷新 - D动作 - 静止动作
    if( this.isJumping() ){ this.updateJump(); }		//帧刷新 - D动作 - 跳跃动作
	else if( this.isMoving() ){ this.updateMove(); }	//帧刷新 - D动作 - 移动动作
	
    this.updateAnimation();								//帧刷新 - G动画
};


//==============================
// * A坐标 - 访问器
//==============================
Object.defineProperties(Game_CharacterBase.prototype, {
    x: { get: function(){ return this._x; }, configurable: true },
    y: { get: function(){ return this._y; }, configurable: true }
});
//==============================
// * A坐标 - 坐标初始化
//==============================
Game_CharacterBase.prototype.locate = function( x, y ){
    this.setPosition(x, y);
    this.straighten();			//刷新行走图帧
    this.refreshBushDepth();	//
};
//==============================
// * A坐标 - 判断是否在某坐标（图块单位）
//==============================
Game_CharacterBase.prototype.pos = function( x, y ){
    return this._x === x && this._y === y;
};
//==============================
// * A坐标 - 设置坐标（图块单位）
//==============================
Game_CharacterBase.prototype.setPosition = function( x, y ){
    this._x = Math.round(x);
    this._y = Math.round(y);
    this._realX = x;
    this._realY = y;
};
//==============================
// * A坐标 - 从某个物体上复制 坐标+朝向 
//==============================
Game_CharacterBase.prototype.copyPosition = function( character ){
    this._x = character._x;
    this._y = character._y;
    this._realX = character._realX;
    this._realY = character._realY;
    this._direction = character._direction;
};
//==============================
// * A坐标 - 该物体的 镜头图块位置X
//
//			说明：	> 单位图块。
//==============================
Game_CharacterBase.prototype.scrolledX = function(){
    return $gameMap.adjustX(this._realX);
};
//==============================
// * A坐标 - 该物体的 镜头图块位置Y
//
//			说明：	> 单位图块。
//==============================
Game_CharacterBase.prototype.scrolledY = function(){
    return $gameMap.adjustY(this._realY);
};
//==============================
// * A坐标 - 该物体的 镜头像素位置X
//
//			说明：	> 单位像素。
//==============================
Game_CharacterBase.prototype.screenX = function(){
    var tw = $gameMap.tileWidth();
    return Math.round(this.scrolledX() * tw + tw / 2);
};
//==============================
// * A坐标 - 该物体的 镜头像素位置Y
//
//			说明：	> 单位像素。
//==============================
Game_CharacterBase.prototype.screenY = function(){
    var th = $gameMap.tileHeight();
    return Math.round(this.scrolledY() * th + th -
                      this.shiftY() - this.jumpHeight());
};
//==============================
// * A坐标 - 该物体的 优先级位置Z
//==============================
Game_CharacterBase.prototype.screenZ = function(){
    return this._priorityType * 2 + 1;
};
//==============================
// * A坐标 - 是否接近镜头（超出镜头后，物体默认不执行自主移动）
//==============================
Game_CharacterBase.prototype.isNearTheScreen = function(){
    var gw = Graphics.width;
    var gh = Graphics.height;
    var tw = $gameMap.tileWidth();
    var th = $gameMap.tileHeight();
    var px = this.scrolledX() * tw + tw / 2 - gw / 2;
    var py = this.scrolledY() * th + th / 2 - gh / 2;
    return px >= -gw && px <= gw && py >= -gh && py <= gh;
};
//==============================
// * A坐标 -  所在图块信息
//==============================
Game_CharacterBase.prototype.terrainTag = function(){
    return $gameMap.terrainTag(this._x, this._y);
};
//==============================
// * A坐标 -  所在R图块
//==============================
Game_CharacterBase.prototype.regionId = function(){
    return $gameMap.regionId(this._x, this._y);
};


//==============================
// * B贴图属性 - 访问器
//==============================
Game_CharacterBase.prototype.opacity = function(){ return this._opacity; };							//透明度
Game_CharacterBase.prototype.setOpacity = function( opacity){ this._opacity = opacity; };			//透明度
Game_CharacterBase.prototype.blendMode = function(){ return this._blendMode; };						//混合模式
Game_CharacterBase.prototype.setBlendMode = function( blendMode){ this._blendMode = blendMode; };	//混合模式
Game_CharacterBase.prototype.bushDepth = function(){ return this._bushDepth; };						//灌木丛高度
//==============================
// * B贴图属性 - 在灌木丛中
//==============================
Game_CharacterBase.prototype.isOnBush = function(){ return $gameMap.isBush(this._x, this._y); };
//==============================
// * B贴图属性 - 刷新灌木丛高度
//
//			说明：	> _bushDepth 控制灌木丛的高度，事件进入灌木丛，下半身会透明，该属性控制透明的长方形高度。
//					  详细可见 Sprite_Character行走图贴图 的updateCharacterFrame。
//==============================
Game_CharacterBase.prototype.refreshBushDepth = function(){
    if( this.isNormalPriority() &&		//条件 - 优先级与人物相同 
		!this.isObjectCharacter() &&	//条件 - 非物体行走图标记
		this.isOnBush() && 				//条件 - 在灌木丛上
		!this.isJumping() ){			//条件 - 没跳起
			
        if( !this.isMoving() ){			//条件 - 没移动
			this._bushDepth = 12;
        }
    }else{
        this._bushDepth = 0;
    }
};


//==============================
// * C勾选设置 - 访问器
//
//			说明：	> C勾选设置 类别，用于对应rmmv编辑器中的可勾选参数。
//					  由于这些变量被各个地方都用到了，所以不属于具体的 子功能类别 。
//					  将其当做 简单的、可调的、临时的 状态位即可。
//==============================
Game_CharacterBase.prototype.hasWalkAnime = function(){ return this._walkAnime; };								//步行动画
Game_CharacterBase.prototype.setWalkAnime = function( walkAnime){ this._walkAnime = walkAnime; };				//步行动画
Game_CharacterBase.prototype.hasStepAnime = function(){ return this._stepAnime; };								//踏步动画
Game_CharacterBase.prototype.setStepAnime = function( stepAnime){ this._stepAnime = stepAnime; };				//踏步动画
Game_CharacterBase.prototype.isDirectionFixed = function(){ return this._directionFix; };						//固定朝向
Game_CharacterBase.prototype.setDirectionFix = function( directionFix){ this._directionFix = directionFix; };	//固定朝向
Game_CharacterBase.prototype.isThrough = function(){ return this._through; };									//是否穿透
Game_CharacterBase.prototype.setThrough = function( through){ this._through = through; };						//是否穿透
Game_CharacterBase.prototype.isTransparent = function(){ return this._transparent; };							//是否透明（移动路线中）
Game_CharacterBase.prototype.setTransparent = function( transparent){ this._transparent = transparent; };		//是否透明（移动路线中）


//==============================
// * D动作 - 访问器
//==============================
Game_CharacterBase.prototype.moveSpeed = function(){ return this._moveSpeed; };										//移动速度
Game_CharacterBase.prototype.setMoveSpeed = function( moveSpeed ){ this._moveSpeed = moveSpeed; };					//移动速度
Game_CharacterBase.prototype.moveFrequency = function(){ return this._moveFrequency; };								//移动频率
Game_CharacterBase.prototype.setMoveFrequency = function( moveFrequency ){ this._moveFrequency = moveFrequency; };	//移动频率
//==============================
// * D动作 - 判断静止中
//==============================
Game_CharacterBase.prototype.isStopping = function(){ return !this.isMoving() && !this.isJumping(); };
//==============================
// * D动作 - 判断移动中
//==============================
Game_CharacterBase.prototype.isMoving = function(){ return this._realX !== this._x || this._realY !== this._y; };
//==============================
// * D动作 - 判断奔跑中（只player继承）
//==============================
Game_CharacterBase.prototype.isDashing = function(){ return false; };
//==============================
// * D动作 - 判断跳跃中
//==============================
Game_CharacterBase.prototype.isJumping = function(){ return this._jumpCount > 0; };

//==============================
// * D动作 - 静止 - 帧刷新检查静止状态
//==============================
Game_CharacterBase.prototype.checkStop = function( threshold ){
    return this._stopCount > threshold;	//（静止时间大于某值时才触发移动）
};
//==============================
// * D动作 - 静止 - 重设静止时间
//==============================
Game_CharacterBase.prototype.resetStopCount = function(){
    this._stopCount = 0;
};
//==============================
// * D动作 - 静止 - 帧刷新
//==============================
Game_CharacterBase.prototype.updateStop = function(){
    this._stopCount++;
};
//==============================
// * D动作 - 朝向 - 访问器
//==============================
Game_CharacterBase.prototype.direction = function(){ return this._direction; };
//==============================
// * D动作 - 朝向 - 反方向
//==============================
Game_CharacterBase.prototype.reverseDir = function( d ){ return 10 - d; };
//==============================
// * D动作 - 朝向 - 设置朝向
//==============================
Game_CharacterBase.prototype.setDirection = function( d ){
    if( !this.isDirectionFixed() && d ){
        this._direction = d;
    }
    this.resetStopCount();
};
//==============================
// * D动作 - 移动 - 帧刷新
//==============================
Game_CharacterBase.prototype.updateMove = function(){
	
	// > 向左移动
    if( this._x < this._realX ){
        this._realX = Math.max(this._realX - this.distancePerFrame(), this._x);
    }
	// > 向右移动
    if( this._x > this._realX ){
        this._realX = Math.min(this._realX + this.distancePerFrame(), this._x);
    }
	// > 向上移动
    if( this._y < this._realY ){
        this._realY = Math.max(this._realY - this.distancePerFrame(), this._y);
    }
	// > 向下移动
    if( this._y > this._realY ){
        this._realY = Math.min(this._realY + this.distancePerFrame(), this._y);
    }
	
	// > 刷新灌木丛高度
    if( !this.isMoving() ){
        this.refreshBushDepth();
    }
};
//==============================
// * D动作 - 移动 - 真实移动速度
//==============================
Game_CharacterBase.prototype.realMoveSpeed = function(){
    return this._moveSpeed + (this.isDashing() ? 1 : 0);
};
//==============================
// * D动作 - 移动 - 移动距离（单位 像素每帧）
//==============================
Game_CharacterBase.prototype.distancePerFrame = function(){
    return Math.pow(2, this.realMoveSpeed()) / 256;
};
//==============================
// * D动作 - 移动 - 执行移动
//
//			说明：	> 单独的接口函数，被 子类Game_Character 调用。
//					  （参数d： 2下/4左/6右/8上）
//==============================
Game_CharacterBase.prototype.moveStraight = function( d ){
    this.setMovementSuccess(this.canPass(this._x, this._y, d));
    if( this.isMovementSucceeded() ){
        this.setDirection(d);
        this._x = $gameMap.roundXWithDirection(this._x, d);
        this._y = $gameMap.roundYWithDirection(this._y, d);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(d));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(d));
        this.increaseSteps();
    }else{
        this.setDirection(d);
        this.checkEventTriggerTouchFront(d);
    }
};
//==============================
// * D动作 - 移动 - 执行移动（斜向）
//
//			说明：	> 单独的接口函数，被 子类Game_Character 调用。
//					  （参数horz： 4左/6右，参数vert： 2下/8上）
//==============================
Game_CharacterBase.prototype.moveDiagonally = function( horz, vert ){
    this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
    if( this.isMovementSucceeded() ){
        this._x = $gameMap.roundXWithDirection(this._x, horz);
        this._y = $gameMap.roundYWithDirection(this._y, vert);
        this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
        this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
        this.increaseSteps();
    }
    if( this._direction === this.reverseDir(horz) ){
        this.setDirection(horz);
    }
    if( this._direction === this.reverseDir(vert) ){
        this.setDirection(vert);
    }
};
//==============================
// * D动作 - 移动 - 是否在梯子上
//==============================
Game_CharacterBase.prototype.isOnLadder = function(){
    return $gameMap.isLadder(this._x, this._y);
};
//==============================
// * D动作 - 移动 - 步数添加时
//
//			说明：	> 该函数只刷新 静止时间 和 梯子/灌木丛 情况，并不记录步数，（玩家继承此函数才记录步数）
//==============================
Game_CharacterBase.prototype.increaseSteps = function(){
    if( this.isOnLadder() ){
        this.setDirection(8);		//（在梯子上时，固定朝上）
    }
    this.resetStopCount();
    this.refreshBushDepth();		//（刷新灌木丛高度）
};
//==============================
// * D动作 - 跳跃 - 跳跃高度
//==============================
Game_CharacterBase.prototype.jumpHeight = function(){
    return (this._jumpPeak * this._jumpPeak -
            Math.pow(Math.abs(this._jumpCount - this._jumpPeak), 2)) / 2;
};
//==============================
// * D动作 - 跳跃 - 帧刷新
//==============================
Game_CharacterBase.prototype.updateJump = function(){
    this._jumpCount--;
    this._realX = (this._realX * this._jumpCount + this._x) / (this._jumpCount + 1.0);
    this._realY = (this._realY * this._jumpCount + this._y) / (this._jumpCount + 1.0);
    this.refreshBushDepth();
    if( this._jumpCount === 0 ){
        this._realX = this._x = $gameMap.roundX(this._x);
        this._realY = this._y = $gameMap.roundY(this._y);
    }
};
//==============================
// * D动作 - 跳跃 - 执行跳跃
//
//			说明：	> 单独的接口函数，被 子类Game_Character 调用。
//					  单位图块，可为负数。
//==============================
Game_CharacterBase.prototype.jump = function( xPlus, yPlus ){
    if( Math.abs(xPlus) > Math.abs(yPlus) ){
        if( xPlus !== 0 ){
            this.setDirection(xPlus < 0 ? 4 : 6);
        }
    }else{
        if( yPlus !== 0 ){
            this.setDirection(yPlus < 0 ? 8 : 2);
        }
    }
    this._x += xPlus;
    this._y += yPlus;
    var distance = Math.round(Math.sqrt(xPlus * xPlus + yPlus * yPlus));
    this._jumpPeak = 10 + distance - this._moveSpeed;
    this._jumpCount = this._jumpPeak * 2;
    this.resetStopCount();
    this.straighten();
};
//==============================
// * D动作 - 执行接触触发
//==============================
Game_CharacterBase.prototype.checkEventTriggerTouchFront = function( d ){
    var x2 = $gameMap.roundXWithDirection(this._x, d);
    var y2 = $gameMap.roundYWithDirection(this._y, d);
    this.checkEventTriggerTouch(x2, y2);
};
//==============================
// * D动作 - 接触触发（子类 玩家、事件 继承用）
//==============================
Game_CharacterBase.prototype.checkEventTriggerTouch = function( x, y ){
    return false;
};


//==============================
// * E可通行 - 访问器
//==============================
Game_CharacterBase.prototype.isMovementSucceeded = function( x, y ){ return this._movementSuccess; };		//移动成功标记
Game_CharacterBase.prototype.setMovementSuccess = function( success ){ this._movementSuccess = success; };	//移动成功标记
//==============================
// * E可通行 - 优先级是否为 与人物相同
//==============================
Game_CharacterBase.prototype.isNormalPriority = function(){ return this._priorityType === 1; };
//==============================
// * E可通行 - 设置优先级（0：在人物下方，1：与人物相同，2：在人物上方）
//==============================
Game_CharacterBase.prototype.setPriorityType = function( priorityType ){ this._priorityType = priorityType; };
//==============================
// * E可通行 - 测试游戏按ctrl键实现穿透（只player继承）
//==============================
Game_CharacterBase.prototype.isDebugThrough = function(){ return false; };
//==============================
// * E可通行 - 判断某坐标是否可通行（包括事件阻挡）
//==============================
Game_CharacterBase.prototype.posNt = function( x, y ){
    // No through
    return this.pos(x, y) && !this.isThrough();
};
//==============================
// * E可通行 - 图块可通行检查
//==============================
Game_CharacterBase.prototype.canPass = function( x, y, d ){
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
	
	// > 判断 - 地图边界
    if( !$gameMap.isValid(x2, y2) ){ return false; }
	
	// > 判断 - 自身穿透属性
    if( this.isThrough() || this.isDebugThrough() ){
        return true;
    }
	
	// > 判断 - 图块是否可通行（地图数据）
    if( !this.isMapPassable(x, y, d) ){
        return false;
    }
	// > 判断 - 物体碰撞
    if( this.isCollidedWithCharacters(x2, y2) ){
        return false;
    }
    return true;
};
//==============================
// * E可通行 - 图块可通行检查（斜向）
//==============================
Game_CharacterBase.prototype.canPassDiagonally = function( x, y, horz, vert ){
    var x2 = $gameMap.roundXWithDirection(x, horz);
    var y2 = $gameMap.roundYWithDirection(y, vert);
    if( this.canPass(x, y, vert) && this.canPass(x, y2, horz) ){
        return true;
    }
    if( this.canPass(x, y, horz) && this.canPass(x2, y, vert) ){
        return true;
    }
    return false;
};
//==============================
// * E可通行 - 判断 - 图块是否可通行（地图数据）
//==============================
Game_CharacterBase.prototype.isMapPassable = function( x, y, d ){
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    var d2 = this.reverseDir(d);
    return $gameMap.isPassable(x, y, d) && $gameMap.isPassable(x2, y2, d2);
};
//==============================
// * E可通行 - 判断 - 物体碰撞
//
//			说明：	> 碰撞返回true，没碰撞返回flase。
//==============================
Game_CharacterBase.prototype.isCollidedWithCharacters = function( x, y ){
    return this.isCollidedWithEvents(x, y) || this.isCollidedWithVehicles(x, y);
};
//==============================
// * E可通行 - 判断 - 物体碰撞（与事件）
//==============================
Game_CharacterBase.prototype.isCollidedWithEvents = function( x, y ){
    var events = $gameMap.eventsXyNt(x, y);
    return events.some(function( event ){
        return event.isNormalPriority();
    });
};
//==============================
// * E可通行 - 判断 - 物体碰撞（与载具）
//==============================
Game_CharacterBase.prototype.isCollidedWithVehicles = function( x, y ){
    return $gameMap.boat().posNt(x, y) || $gameMap.ship().posNt(x, y);
};
//==============================
// * E可通行 - 判断 - 物体碰撞（与玩家）
//==============================
// （无，但是Game_Event有 isCollidedWithPlayerCharacters ）


//==============================
// * F行走图 - 访问器
//==============================
Game_CharacterBase.prototype.isObjectCharacter = function(){ return this._isObjectCharacter; };	//物体行走图标记（上移6像素用，资源通过"!"标记）
//==============================
// * F行走图 - 动画帧 - 帧刷新
//
//			说明：	> 动画帧即 多帧行走图 结构。
//					> 计时器达到一定值时，才 updatePattern 推进动画帧一次。
//==============================
Game_CharacterBase.prototype.updateAnimation = function(){
	
	// > 帧刷新计数器
    this.updateAnimationCount();
    
	// > 推进
	if( this._animationCount >= this.animationWait() ){
        this.updatePattern();
        this._animationCount = 0;
    }
};
//==============================
// * F行走图 - 动画帧 - 帧刷新计数器
//==============================
Game_CharacterBase.prototype.updateAnimationCount = function(){
    if( this.isMoving() && this.hasWalkAnime() ){
        this._animationCount += 1.5;		//（奔跑时，计数器加速执行）
    }else if( this.hasStepAnime() || !this.isOriginalPattern() ){
        this._animationCount++;
    }
};
//==============================
// * F行走图 - 动画帧 - 推进（非帧）
//
//			说明：	> 由于这里结构写的太烂，被插件 Drill_EventFrameNumber 多帧行走图 覆写。
//==============================
Game_CharacterBase.prototype.updatePattern = function(){
	
	// > 暂停情况检查
    if( !this.hasStepAnime() && this._stopCount > 0 ){
        this.resetPattern();
		
	// > 帧数推进
    }else{
        this._pattern = (this._pattern + 1) % this.maxPattern();
    }
};
//==============================
// * F行走图 - 动画帧 - 重置
//		
//			说明：	> 该函数在多处被调用刷新。
//==============================
Game_CharacterBase.prototype.straighten = function(){
    if( this.hasWalkAnime() || this.hasStepAnime() ){
        this._pattern = 1;
    }
    this._animationCount = 0;
};
//==============================
// * F行走图 - 动画帧 - 间隔
//==============================
Game_CharacterBase.prototype.animationWait = function(){
    return (9 - this.realMoveSpeed()) * 3;
};
//==============================
// * F行走图 - 动画帧 - 最大帧数
//==============================
Game_CharacterBase.prototype.maxPattern = function(){ return 4; };
//==============================
// * F行走图 - 动画帧 - 当前帧数
//==============================
Game_CharacterBase.prototype.pattern = function(){
    return this._pattern < 3 ? this._pattern : 1;
};
//==============================
// * F行走图 - 动画帧 - 设置帧数
//==============================
Game_CharacterBase.prototype.setPattern = function( pattern ){
    this._pattern = pattern;
};
//==============================
// * F行走图 - 动画帧 - 判断初始帧
//==============================
Game_CharacterBase.prototype.isOriginalPattern = function(){ return this.pattern() === 1; };
//==============================
// * F行走图 - 动画帧 - 恢复初始帧
//==============================
Game_CharacterBase.prototype.resetPattern = function(){ this.setPattern(1); };
//==============================
// * F行走图 - 八行走图 - 访问器
//==============================
Game_CharacterBase.prototype.characterName = function(){ return this._characterName; };
Game_CharacterBase.prototype.characterIndex = function(){ return this._characterIndex; };
//==============================
// * F行走图 - 八行走图 - 设置资源
//==============================
Game_CharacterBase.prototype.setImage = function( characterName, characterIndex ){
    this._tileId = 0;
    this._characterName = characterName;
    this._characterIndex = characterIndex;
    this._isObjectCharacter = ImageManager.isObjectCharacter(characterName);
};
//==============================
// * F行走图 - 图块行走图 - 访问器
//==============================
Game_CharacterBase.prototype.tileId = function(){ return this._tileId; };
//==============================
// * F行走图 - 图块行走图 - 是否为图块行走图
//==============================
Game_CharacterBase.prototype.isTile = function(){ return this._tileId > 0 && this._priorityType === 0; };
//==============================
// * F行走图 - 图块行走图 - 设置资源
//==============================
Game_CharacterBase.prototype.setTileImage = function( tileId ){
    this._tileId = tileId;
    this._characterName = '';
    this._characterIndex = 0;
    this._isObjectCharacter = true;		//物体行走图标记（上移6像素用，资源通过"!"标记）
};
//==============================
// * F行走图 - 物体行走图 向上偏移6像素
//==============================
Game_CharacterBase.prototype.shiftY = function(){
    return this.isObjectCharacter() ? 0 : 6;
};


//==============================
// * G动画 - 访问器
//==============================
Game_CharacterBase.prototype.animationId = function(){ return this._animationId; };
Game_CharacterBase.prototype.requestAnimation = function( animationId){ this._animationId = animationId; };
Game_CharacterBase.prototype.isAnimationPlaying = function(){ return this._animationId > 0 || this._animationPlaying; };
//==============================
// * G动画 - 播放动画
//==============================
Game_CharacterBase.prototype.startAnimation = function(){
    this._animationId = 0;
    this._animationPlaying = true;
};
//==============================
// * G动画 - 停止动画
//==============================
Game_CharacterBase.prototype.endAnimation = function(){
    this._animationPlaying = false;
};


//==============================
// * H气泡 - 访问器
//==============================
Game_CharacterBase.prototype.balloonId = function(){ return this._balloonId; };
Game_CharacterBase.prototype.requestBalloon = function( balloonId){ this._balloonId = balloonId; };
Game_CharacterBase.prototype.isBalloonPlaying = function(){ return this._balloonId > 0 || this._balloonPlaying; };
//==============================
// * H气泡 - 播放气泡
//==============================
Game_CharacterBase.prototype.startBalloon = function(){
    this._balloonId = 0;
    this._balloonPlaying = true;
};
//==============================
// * H气泡 - 停止气泡
//==============================
Game_CharacterBase.prototype.endBalloon = function(){
    this._balloonPlaying = false;
};



//=============================================================================
// ** 物体【Game_Character】
//			
//			索引：	无
//			来源：	继承于Game_CharacterBase
//			实例：	无（父类）
//			应用：	> 被 Game_Player 继承
//					> 被 Game_Follower 继承
//					> 被 Game_Vehicle 继承
//					> 被 Game_Event 继承
//					
//			作用域：	地图界面
//			主功能：	定义一个最基本的物体。
//			子功能：
//						->继承 物体基类
//						->D动作
//						->2A自主移动
//							->设置自主移动
//						->2A自主移动/2B强制路线
//							->是否被强制
//							->帧刷新
//							->结束移动路线
//						->2B强制路线
//							->设置强制路线
//							->暂存移动路线
//							->恢复移动路线
//						->2C自动寻迹
//						->2D路线动作（这些都基于 物体基类 的 D动作 进行扩展）
//							> 随机移动
//							> 随机转向
//							> 接近物体
//							> 远离物体
//							> 朝向物体
//							> 背离物体
//							> 前进一步
//							> 后退一步
//							> 右转90°
//							> 左转90°
//							> 后转180°
//							> 向左或向右转90°
//						->2E交换位置
//				
//			说明：	> 注意，这里要留意 自动寻迹 的功能。
//=============================================================================
//==============================
// * 物体 - 定义
//==============================
function Game_Character(){
    this.initialize.apply(this, arguments);
}
Game_Character.prototype = Object.create(Game_CharacterBase.prototype);
Game_Character.prototype.constructor = Game_Character;
//==============================
// * 物体 - 常量
//==============================
Game_Character.ROUTE_END               = 0;   //结束移动路线（重新自主移动）
Game_Character.ROUTE_MOVE_DOWN         = 1;   //向下移动
Game_Character.ROUTE_MOVE_LEFT         = 2;   //向左移动
Game_Character.ROUTE_MOVE_RIGHT        = 3;   //向右移动
Game_Character.ROUTE_MOVE_UP           = 4;   //向上移动
Game_Character.ROUTE_MOVE_LOWER_L      = 5;   //向左下移动
Game_Character.ROUTE_MOVE_LOWER_R      = 6;   //向右下移动
Game_Character.ROUTE_MOVE_UPPER_L      = 7;   //向左上移动
Game_Character.ROUTE_MOVE_UPPER_R      = 8;   //向右上移动
Game_Character.ROUTE_MOVE_RANDOM       = 9;   //随机移动
Game_Character.ROUTE_MOVE_TOWARD       = 10;  //接近玩家
Game_Character.ROUTE_MOVE_AWAY         = 11;  //远离玩家
Game_Character.ROUTE_MOVE_FORWARD      = 12;  //前进一步
Game_Character.ROUTE_MOVE_BACKWARD     = 13;  //后退一步
Game_Character.ROUTE_JUMP              = 14;  //跳跃...
Game_Character.ROUTE_WAIT              = 15;  //等待...
Game_Character.ROUTE_TURN_DOWN         = 16;  //朝向下方
Game_Character.ROUTE_TURN_LEFT         = 17;  //朝向左方
Game_Character.ROUTE_TURN_RIGHT        = 18;  //朝向右方
Game_Character.ROUTE_TURN_UP           = 19;  //朝向上方
Game_Character.ROUTE_TURN_90D_R        = 20;  //右转90°
Game_Character.ROUTE_TURN_90D_L        = 21;  //左转90°
Game_Character.ROUTE_TURN_180D         = 22;  //后转180°
Game_Character.ROUTE_TURN_90D_R_L      = 23;  //向左或向右转90°
Game_Character.ROUTE_TURN_RANDOM       = 24;  //随机转向
Game_Character.ROUTE_TURN_TOWARD       = 25;  //朝向玩家
Game_Character.ROUTE_TURN_AWAY         = 26;  //背向玩家
Game_Character.ROUTE_SWITCH_ON         = 27;  //打开开关...
Game_Character.ROUTE_SWITCH_OFF        = 28;  //关闭开关...
Game_Character.ROUTE_CHANGE_SPEED      = 29;  //更改移动速度...
Game_Character.ROUTE_CHANGE_FREQ       = 30;  //更改移动频率...
Game_Character.ROUTE_WALK_ANIME_ON     = 31;  //开启步行动画
Game_Character.ROUTE_WALK_ANIME_OFF    = 32;  //关闭步行动画
Game_Character.ROUTE_STEP_ANIME_ON     = 33;  //开启踏步动画
Game_Character.ROUTE_STEP_ANIME_OFF    = 34;  //关闭踏步动画
Game_Character.ROUTE_DIR_FIX_ON        = 35;  //开启固定朝向
Game_Character.ROUTE_DIR_FIX_OFF       = 36;  //关闭固定朝向
Game_Character.ROUTE_THROUGH_ON        = 37;  //开启穿透
Game_Character.ROUTE_THROUGH_OFF       = 38;  //关闭穿透
Game_Character.ROUTE_TRANSPARENT_ON    = 39;  //开启透明状态
Game_Character.ROUTE_TRANSPARENT_OFF   = 40;  //关闭透明状态
Game_Character.ROUTE_CHANGE_IMAGE      = 41;  //更改图像...
Game_Character.ROUTE_CHANGE_OPACITY    = 42;  //更改不透明度...
Game_Character.ROUTE_CHANGE_BLEND_MODE = 43;  //更改合成方式...
Game_Character.ROUTE_PLAY_SE           = 44;  //播放SE...
Game_Character.ROUTE_SCRIPT            = 45;  //脚本...
//==============================
// * 物体 - 初始化
//==============================
Game_Character.prototype.initialize = function(){
    Game_CharacterBase.prototype.initialize.call(this);
};
//==============================
// * 物体 - 初始化属性
//==============================
Game_Character.prototype.initMembers = function(){
    Game_CharacterBase.prototype.initMembers.call(this);
	
    this._moveRoute = null;					//2A自主移动/2B强制路线 - 当前移动路线
    this._moveRouteIndex = 0;				//2A自主移动/2B强制路线 - 当前移动路线索引
    this._waitCount = 0;					//2A自主移动/2B强制路线 - 等待时间
	
    this._moveRouteForcing = false;			//2B强制路线 - 标记
    this._originalMoveRoute = null;			//2B强制路线 - 暂存的移动路线
    this._originalMoveRouteIndex = 0;		//2B强制路线 - 暂存的索引
};

//==============================
// * D动作 - 静止 - 帧刷新（继承）
//==============================
Game_Character.prototype.updateStop = function(){
    Game_CharacterBase.prototype.updateStop.call(this);
    if( this._moveRouteForcing ){
        this.updateRoutineMove();			//帧刷新 - 2B强制路线
    }
};


//==============================
// * 2A自主移动 - 设置自主移动
//
//			说明：	> 该函数只被事件函数 setupPageSettings 使用。
//					> 【核心漏洞修复】Drill_CoreOfMoveRoute 移动路线的参数补充。
//==============================
Game_Character.prototype.setMoveRoute = function( moveRoute ){
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = false;
};


//==============================
// * 2A自主移动/2B强制路线 - 是否被强制
//
//			说明：	> 若为true则表示 2B强制路线，若为false则表示 2A自主移动。
//==============================
Game_Character.prototype.isMoveRouteForcing = function(){ return this._moveRouteForcing; };
//==============================
// * 2A自主移动/2B强制路线 - 帧刷新
//
//			说明：	> 此函数除了在 2B强制路线 中被调用；
//					  还在 事件-自主移动-自定义类型(Game_Event.prototype.moveTypeCustom) 中被调用。
//==============================
Game_Character.prototype.updateRoutineMove = function(){
	
	// > 等待时间（移动路线中的 等待指令 ）
    if( this._waitCount > 0 ){
        this._waitCount--;
		
	// > 执行移动路线
    }else{
        this.setMovementSuccess(true);
        var command = this._moveRoute.list[this._moveRouteIndex];
        if( command ){
            this.processMoveCommand(command);	//执行单条 2D路线动作
            this.advanceMoveRouteIndex();		//索引+1
        }
    }
};
//==============================
// * 2A自主移动/2B强制路线 - 索引+1
//==============================
Game_Character.prototype.advanceMoveRouteIndex = function(){
    var moveRoute = this._moveRoute;
    if( moveRoute && (this.isMovementSucceeded() || moveRoute.skippable) ){
        var numCommands = moveRoute.list.length - 1;
        this._moveRouteIndex++;
        if( moveRoute.repeat && this._moveRouteIndex >= numCommands ){
            this._moveRouteIndex = 0;
        }
    }
};
//==============================
// * 2A自主移动/2B强制路线 - 结束移动路线
//==============================
Game_Character.prototype.processRouteEnd = function(){
	
	// > 重复移动
    if( this._moveRoute.repeat ){
        this._moveRouteIndex = -1;
		
	// > 解除 2B强制路线（恢复 2A自主移动 ）
    }else if( this._moveRouteForcing ){
        this._moveRouteForcing = false;
        this.restoreMoveRoute();
    }
};


//==============================
// * 2B强制路线 - 设置强制路线
//==============================
Game_Character.prototype.forceMoveRoute = function( moveRoute ){
    if( !this._originalMoveRoute ){
        this.memorizeMoveRoute();
    }
    this._moveRoute = moveRoute;
    this._moveRouteIndex = 0;
    this._moveRouteForcing = true;
    this._waitCount = 0;
};
//==============================
// * 2B强制路线 - 暂存移动路线
//==============================
Game_Character.prototype.memorizeMoveRoute = function(){
    this._originalMoveRoute       = this._moveRoute;
    this._originalMoveRouteIndex  = this._moveRouteIndex;
};
//==============================
// * 2B强制路线 - 恢复移动路线
//==============================
Game_Character.prototype.restoreMoveRoute = function(){
    this._moveRoute          = this._originalMoveRoute;
    this._moveRouteIndex     = this._originalMoveRouteIndex;
    this._originalMoveRoute  = null;
};


//==============================
// * 2C自动寻迹 - 执行自动寻迹
//
//			参数：	> goalX 整数 （目标位置X）
//					> goalY 整数 （目标位置X）
//			说明：	> 该函数只提供方向，不执行移动。
//					> 返回 0 表示不移动，返回 2/4/6/8 表示朝着方向继续移动。
//					> 此函数目前只被 玩家鼠标设置目的地并寻迹 功能使用。
//==============================
Game_Character.prototype.findDirectionTo = function( goalX, goalY ){
    var searchLimit = this.searchLimit();
    var mapWidth = $gameMap.width();
    var nodeList = [];
    var openList = [];
    var closedList = [];
    var start = {};
    var best = start;

    if( this.x === goalX && this.y === goalY ){
        return 0;
    }

    start.parent = null;
    start.x = this.x;
    start.y = this.y;
    start.g = 0;
    start.f = $gameMap.distance(start.x, start.y, goalX, goalY);
    nodeList.push(start);
    openList.push(start.y * mapWidth + start.x);

    while (nodeList.length > 0 ){
        var bestIndex = 0;
        for( var i = 0; i < nodeList.length; i++ ){
            if( nodeList[i].f < nodeList[bestIndex].f ){
                bestIndex = i;
            }
        }

        var current = nodeList[bestIndex];
        var x1 = current.x;
        var y1 = current.y;
        var pos1 = y1 * mapWidth + x1;
        var g1 = current.g;

        nodeList.splice(bestIndex, 1);
        openList.splice(openList.indexOf(pos1), 1);
        closedList.push(pos1);

        if( current.x === goalX && current.y === goalY ){
            best = current;
            break;
        }

        if( g1 >= searchLimit ){
            continue;
        }

        for( var j = 0; j < 4; j++ ){
            var direction = 2 + j * 2;
            var x2 = $gameMap.roundXWithDirection(x1, direction);
            var y2 = $gameMap.roundYWithDirection(y1, direction);
            var pos2 = y2 * mapWidth + x2;

            if( closedList.contains(pos2) ){
                continue;
            }
            if( !this.canPass(x1, y1, direction) ){
                continue;
            }

            var g2 = g1 + 1;
            var index2 = openList.indexOf(pos2);

            if( index2 < 0 || g2 < nodeList[index2].g ){
                var neighbor;
                if( index2 >= 0 ){
                    neighbor = nodeList[index2];
                }else{
                    neighbor = {};
                    nodeList.push(neighbor);
                    openList.push(pos2);
                }
                neighbor.parent = current;
                neighbor.x = x2;
                neighbor.y = y2;
                neighbor.g = g2;
                neighbor.f = g2 + $gameMap.distance(x2, y2, goalX, goalY);
                if( !best || neighbor.f - neighbor.g < best.f - best.g ){
                    best = neighbor;
                }
            }
        }
    }

    var node = best;
    while (node.parent && node.parent !== start ){
        node = node.parent;
    }

    var deltaX1 = $gameMap.deltaX(node.x, start.x);
    var deltaY1 = $gameMap.deltaY(node.y, start.y);
    if( deltaY1 > 0 ){
        return 2;
    }else if( deltaX1 < 0 ){
        return 4;
    }else if( deltaX1 > 0 ){
        return 6;
    }else if( deltaY1 < 0 ){
        return 8;
    }

    var deltaX2 = this.deltaXFrom(goalX);
    var deltaY2 = this.deltaYFrom(goalY);
    if( Math.abs(deltaX2) > Math.abs(deltaY2) ){
        return deltaX2 > 0 ? 4 : 6;
    }else if( deltaY2 !== 0 ){
        return deltaY2 > 0 ? 8 : 2;
    }

    return 0;
};
//==============================
// * 2C自动寻迹 - 寻迹上限数
//==============================
Game_Character.prototype.searchLimit = function(){ return 12; };


//==============================
// * 2D路线动作 - 执行单条移动路线
//==============================
Game_Character.prototype.processMoveCommand = function( command ){
    var gc = Game_Character;
    var params = command.parameters;
    switch( command.code ){
		case gc.ROUTE_END:					//结束移动路线（重新自主移动）
			this.processRouteEnd();
			break;
		case gc.ROUTE_MOVE_DOWN:			//向下移动
			this.moveStraight(2);
			break;
		case gc.ROUTE_MOVE_LEFT:			//向左移动
			this.moveStraight(4);
			break;
		case gc.ROUTE_MOVE_RIGHT:			//向右移动
			this.moveStraight(6);
			break;
		case gc.ROUTE_MOVE_UP:				//向上移动
			this.moveStraight(8);
			break;
		case gc.ROUTE_MOVE_LOWER_L:			//向左下移动
			this.moveDiagonally(4, 2);
			break;
		case gc.ROUTE_MOVE_LOWER_R:			//向右下移动
			this.moveDiagonally(6, 2);
			break;
		case gc.ROUTE_MOVE_UPPER_L:			//向左上移动
			this.moveDiagonally(4, 8);
			break;
		case gc.ROUTE_MOVE_UPPER_R:			//向右上移动
			this.moveDiagonally(6, 8);
			break;
		case gc.ROUTE_MOVE_RANDOM:			//随机移动
			this.moveRandom();
			break;
		case gc.ROUTE_MOVE_TOWARD:			//接近玩家
			this.moveTowardPlayer();
			break;
		case gc.ROUTE_MOVE_AWAY:			//远离玩家
			this.moveAwayFromPlayer();
			break;
		case gc.ROUTE_MOVE_FORWARD:			//前进一步
			this.moveForward();
			break;
		case gc.ROUTE_MOVE_BACKWARD:		//后退一步
			this.moveBackward();
			break;
		case gc.ROUTE_JUMP:					//跳跃...
			this.jump(params[0], params[1]);
			break;
		case gc.ROUTE_WAIT:					//等待...
			this._waitCount = params[0] - 1;
			break;
		case gc.ROUTE_TURN_DOWN:			//朝向下方
			this.setDirection(2);
			break;
		case gc.ROUTE_TURN_LEFT:			//朝向左方
			this.setDirection(4);
			break;
		case gc.ROUTE_TURN_RIGHT:			//朝向右方
			this.setDirection(6);
			break;
		case gc.ROUTE_TURN_UP:				//朝向上方
			this.setDirection(8);
			break;
		case gc.ROUTE_TURN_90D_R:			//右转90°
			this.turnRight90();
			break;
		case gc.ROUTE_TURN_90D_L:			//左转90°
			this.turnLeft90();
			break;
		case gc.ROUTE_TURN_180D:			//后转180°
			this.turn180();
			break;
		case gc.ROUTE_TURN_90D_R_L:			//向左或向右转90°
			this.turnRightOrLeft90();
			break;
		case gc.ROUTE_TURN_RANDOM:			//随机转向
			this.turnRandom();
			break;
		case gc.ROUTE_TURN_TOWARD:			//朝向玩家
			this.turnTowardPlayer();
			break;
		case gc.ROUTE_TURN_AWAY:			//背向玩家
			this.turnAwayFromPlayer();
			break;
		case gc.ROUTE_SWITCH_ON:			//打开开关...
			$gameSwitches.setValue(params[0], true);
			break;
		case gc.ROUTE_SWITCH_OFF:			//关闭开关...
			$gameSwitches.setValue(params[0], false);
			break;
		case gc.ROUTE_CHANGE_SPEED:			//更改移动速度...
			this.setMoveSpeed(params[0]);
			break;
		case gc.ROUTE_CHANGE_FREQ:			//更改移动频率...
			this.setMoveFrequency(params[0]);
			break;
		case gc.ROUTE_WALK_ANIME_ON:		//开启步行动画
			this.setWalkAnime(true);
			break;
		case gc.ROUTE_WALK_ANIME_OFF:		//关闭步行动画
			this.setWalkAnime(false);
			break;
		case gc.ROUTE_STEP_ANIME_ON:		//开启踏步动画
			this.setStepAnime(true);
			break;
		case gc.ROUTE_STEP_ANIME_OFF:		//关闭踏步动画
			this.setStepAnime(false);
			break;
		case gc.ROUTE_DIR_FIX_ON:			//开启固定朝向
			this.setDirectionFix(true);
			break;
		case gc.ROUTE_DIR_FIX_OFF:			//关闭固定朝向
			this.setDirectionFix(false);
			break;
		case gc.ROUTE_THROUGH_ON:			//开启穿透
			this.setThrough(true);
			break;
		case gc.ROUTE_THROUGH_OFF:			//关闭穿透
			this.setThrough(false);
			break;
		case gc.ROUTE_TRANSPARENT_ON:		//开启透明状态
			this.setTransparent(true);
			break;
		case gc.ROUTE_TRANSPARENT_OFF:		//关闭透明状态
			this.setTransparent(false);
			break;
		case gc.ROUTE_CHANGE_IMAGE:			//更改图像...
			this.setImage(params[0], params[1]);
			break;
		case gc.ROUTE_CHANGE_OPACITY:		//更改不透明度...
			this.setOpacity(params[0]);
			break;
		case gc.ROUTE_CHANGE_BLEND_MODE:	//更改合成方式...
			this.setBlendMode(params[0]);
			break;
		case gc.ROUTE_PLAY_SE:				//播放SE...
			AudioManager.playSe(params[0]);
			break;
		case gc.ROUTE_SCRIPT:				//脚本...
			eval(params[0]);
			break;
    }
};
//==============================
// * 2D路线动作 - 随机移动
//==============================
Game_Character.prototype.moveRandom = function(){
    var d = 2 + Math.randomInt(4) * 2;
    if( this.canPass(this.x, this.y, d) ){
        this.moveStraight(d);
    }
};
//==============================
// * 2D路线动作 - 随机转向
//==============================
Game_Character.prototype.turnRandom = function(){
    this.setDirection(2 + Math.randomInt(4) * 2);
};
//==============================
// * 2D路线动作 - 接近物体
//
//			说明：	> character参数只要x和y。也就是说给个json对象也可以。
//==============================
Game_Character.prototype.moveTowardCharacter = function( character ){
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if( Math.abs(sx) > Math.abs(sy) ){
        this.moveStraight(sx > 0 ? 4 : 6);
        if( !this.isMovementSucceeded() && sy !== 0 ){
            this.moveStraight(sy > 0 ? 8 : 2);
        }
    }else if( sy !== 0 ){
        this.moveStraight(sy > 0 ? 8 : 2);
        if( !this.isMovementSucceeded() && sx !== 0 ){
            this.moveStraight(sx > 0 ? 4 : 6);
        }
    }
};
//==============================
// * 2D路线动作 - 远离物体
//==============================
Game_Character.prototype.moveAwayFromCharacter = function( character ){
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if( Math.abs(sx) > Math.abs(sy) ){
        this.moveStraight(sx > 0 ? 6 : 4);
        if( !this.isMovementSucceeded() && sy !== 0 ){
            this.moveStraight(sy > 0 ? 2 : 8);
        }
    }else if( sy !== 0 ){
        this.moveStraight(sy > 0 ? 2 : 8);
        if( !this.isMovementSucceeded() && sx !== 0 ){
            this.moveStraight(sx > 0 ? 6 : 4);
        }
    }
};
//==============================
// * 2D路线动作 - 接近玩家
//==============================
Game_Character.prototype.moveTowardPlayer = function(){ this.moveTowardCharacter($gamePlayer); };
//==============================
// * 2D路线动作 - 远离玩家
//==============================
Game_Character.prototype.moveAwayFromPlayer = function(){ this.moveAwayFromCharacter($gamePlayer); };
//==============================
// * 2D路线动作 - 计算 - 距离差值X
//==============================
Game_Character.prototype.deltaXFrom = function( x ){ return $gameMap.deltaX(this.x, x); };
//==============================
// * 2D路线动作 - 计算 - 距离差值Y
//==============================
Game_Character.prototype.deltaYFrom = function( y ){ return $gameMap.deltaY(this.y, y); };

//==============================
// * 2D路线动作 - 朝向物体
//
//			说明：	> 如果 该事件与目标事件 的位置重合，则事件的"朝向物体"指令是无效的，事件仍然保持原朝向。
//==============================
Game_Character.prototype.turnTowardCharacter = function( character ){
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if( Math.abs(sx) > Math.abs(sy) ){
        this.setDirection(sx > 0 ? 4 : 6);
    }else if( sy !== 0 ){
        this.setDirection(sy > 0 ? 8 : 2);
    }
};
//==============================
// * 2D路线动作 - 背离物体
//==============================
Game_Character.prototype.turnAwayFromCharacter = function( character ){
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if( Math.abs(sx) > Math.abs(sy) ){
        this.setDirection(sx > 0 ? 6 : 4);
    }else if( sy !== 0 ){
        this.setDirection(sy > 0 ? 2 : 8);
    }
};
//==============================
// * 2D路线动作 - 朝向玩家
//==============================
Game_Character.prototype.turnTowardPlayer = function(){ this.turnTowardCharacter($gamePlayer); };
//==============================
// * 2D路线动作 - 背离玩家
//==============================
Game_Character.prototype.turnAwayFromPlayer = function(){ this.turnAwayFromCharacter($gamePlayer); };

//==============================
// * 2D路线动作 - 前进一步
//==============================
Game_Character.prototype.moveForward = function(){
    this.moveStraight(this.direction());
};
//==============================
// * 2D路线动作 - 后退一步
//==============================
Game_Character.prototype.moveBackward = function(){
    var lastDirectionFix = this.isDirectionFixed();
    this.setDirectionFix(true);
    this.moveStraight(this.reverseDir(this.direction()));
    this.setDirectionFix(lastDirectionFix);
};
//==============================
// * 2D路线动作 - 右转90°
//==============================
Game_Character.prototype.turnRight90 = function(){
    switch( this.direction() ){
    case 2:
        this.setDirection(4);
        break;
    case 4:
        this.setDirection(8);
        break;
    case 6:
        this.setDirection(2);
        break;
    case 8:
        this.setDirection(6);
        break;
    }
};
//==============================
// * 2D路线动作 - 左转90°
//==============================
Game_Character.prototype.turnLeft90 = function(){
    switch( this.direction() ){
    case 2:
        this.setDirection(6);
        break;
    case 4:
        this.setDirection(2);
        break;
    case 6:
        this.setDirection(8);
        break;
    case 8:
        this.setDirection(4);
        break;
    }
};
//==============================
// * 2D路线动作 - 后转180°
//==============================
Game_Character.prototype.turn180 = function(){
    this.setDirection(this.reverseDir(this.direction()));
};
//==============================
// * 2D路线动作 - 向左或向右转90°
//==============================
Game_Character.prototype.turnRightOrLeft90 = function(){
    switch( Math.randomInt(2) ){
    case 0:
        this.turnRight90();
        break;
    case 1:
        this.turnLeft90();
        break;
    }
};

//==============================
// * 2E交换位置 - 执行交换
//==============================
Game_Character.prototype.swap = function( character ){
    var newX = character.x;
    var newY = character.y;
    character.locate(this.x, this.y);
    this.locate(newX, newY);
};



//=============================================================================
// ** 玩家（领队）【Game_Player】
//			
//			实例：	$gamePlayer
//			索引：	player
//			来源：	继承于Game_Character
//			应用：	> 玩家类，被大量事件处理插件继承
//					> 在Scene_Map.prototype.updateMain中直接被控制 帧刷新
//					
//			作用域：	地图界面
//			主功能：	> 定义一个玩家操作的物体
//						> 定义一个镜头始终跟踪的物体
//						> 定义地图切换/场所移动的功能
//			子功能：
//						->继承 物体
//							->帧刷新 镜头位置
//						->A坐标（继承）
//						->D动作（继承）
//							->移动（继承）
//							->跳跃（继承）
//						->E可通行（继承）
//						->F行走图（继承）
//						->3A场所移动
//							->配置信息
//							->场所移动流程
//							->重刷标记
//						->3B载具
//							> 步行（walk）
//							> 小船（boat）
//							> 大船（ship）
//							> 飞艇（airship）
//							->上载具
//							->下载具
//						->3C遇敌
//							->遇敌计数
//							->遇敌计数加成
//								> 灌木丛中两倍遇敌
//								> 遇敌减半技能
//								> 船上遇敌减半
//							->获取敌群ID
//						->3D奔跑
//							->只影响物体的移动速度
//							->判断奔跑键
//						->3E按键移动
//							->是否允许操作移动
//							->执行移动
//						->3F玩家队员
//							->显示玩家队员
//							->隐藏玩家队员
//							->集合玩家队员
//						->3G触发事件
//							->当前管理的触发类型
//								> 0确定键
//								> 1玩家接触
//								> 2事件接触
//							->脚下情况
//							->前方一图块情况
//							->前方两图块情况（桌子）
//						->3H地形伤害
//						
//			说明：	> 留意 3E按键移动 的功能，包含 玩家是否可移动 的概念。
//					> 留意 玩家-3G触发事件 与 事件-3E触发事件 的概念和函数。
//=============================================================================
//==============================
// * 玩家 - 定义
//==============================
function Game_Player(){
    this.initialize.apply(this, arguments);
}
Game_Player.prototype = Object.create(Game_Character.prototype);
Game_Player.prototype.constructor = Game_Player;
//==============================
// * 玩家 - 初始化
//==============================
Game_Player.prototype.initialize = function(){
    Game_Character.prototype.initialize.call(this);
    this.setTransparent($dataSystem.optTransparent);	//设置透明（系统>选项>透明状态下开始游戏）
};
//==============================
// * 玩家 - 初始化属性
//==============================
Game_Player.prototype.initMembers = function(){
    Game_Character.prototype.initMembers.call(this);
	
    this._transferring = false;					//3A场所移动 - 移动标记
    this._newMapId = 0;							//3A场所移动 - 地图ID
    this._newX = 0;								//3A场所移动 - 坐标X
    this._newY = 0;								//3A场所移动 - 坐标Y
    this._newDirection = 0;						//3A场所移动 - 朝向
    this._fadeType = 0;							//3A场所移动 - 渐变（黑底/白底/无）
    this._needsMapReload = false;				//3A场所移动 - 重刷标记
	
    this._vehicleType = 'walk';					//3B载具 - 类型（四种：walk/boat/ship/airship）
    this._vehicleGettingOn = false;				//3B载具 - 上载具状态
    this._vehicleGettingOff = false;			//3B载具 - 下载具状态
	
    this._encounterCount = 0;					//3C遇敌 - 遇敌计数器
	
    this._dashing = false;						//3D奔跑 - 奔跑状态
	
    this._followers = new Game_Followers();		//3F玩家队员
};
//==============================
// * 玩家 - 帧刷新
//==============================
Game_Player.prototype.update = function( sceneActive ){
    var lastScrolledX = this.scrolledX();
    var lastScrolledY = this.scrolledY();
    var wasMoving = this.isMoving();
	
    this.updateDashing();								//帧刷新 - 3D奔跑
    if( sceneActive ){									//帧刷新 - 3E按键移动
        this.moveByInput();								//
    }													//
	
	// > 原函数
    Game_Character.prototype.update.call(this);
	
    this.updateScroll(lastScrolledX, lastScrolledY);	//帧刷新 - 镜头位置
    this.updateVehicle();								//帧刷新 - 3B载具
    if( !this.isMoving() ){								//帧刷新 - 3G触发事件 - 暂停移动时
        this.updateNonmoving(wasMoving);				//
    }													//
    this._followers.update();							//帧刷新 - 3F玩家队员
};
//==============================
// * 玩家『活动地图镜头』 - 帧刷新 镜头位置
//
//			应用：	调用了 .scrollDown、.scrollLeft、.scrollRight、.scrollUp 函数。
//			说明：	> 注意，地图镜头受两个地方控制，这里为其中一个，玩家移动的影响。
//					  另一个见 Game_Map.prototype.updateScroll 。
//					> 这两处会有【顺序差】，子插件继承时一定要注意。
//					> 这里经常出现【1像素悬浮偏移问题】，很可能是刷的时机早了。
//					  因为 $gamePlayer.updateScroll 函数比 $gameMap.update 的时机 晚 刷。
//					  原因见函数 Scene_Map.prototype.updateMain 。
//					> 注意，此函数被 镜头插件覆写。
//					  子类若要继承，应该继承 Game_Player.prototype.update ，而不是此函数。
//==============================
Game_Player.prototype.updateScroll = function( lastScrolledX, lastScrolledY ){
    var x1 = lastScrolledX;
    var y1 = lastScrolledY;
    var x2 = this.scrolledX();
    var y2 = this.scrolledY();
    if( y2 > y1 && y2 > this.centerY() ){
        $gameMap.scrollDown(y2 - y1);
    }
    if( x2 < x1 && x2 < this.centerX() ){
        $gameMap.scrollLeft(x1 - x2);
    }
    if( x2 > x1 && x2 > this.centerX() ){
        $gameMap.scrollRight(x2 - x1);
    }
    if( y2 < y1 && y2 < this.centerY() ){
        $gameMap.scrollUp(y1 - y2);
    }
};


//==============================
// * A坐标 - 坐标初始化（继承）
//==============================
Game_Player.prototype.locate = function( x, y ){
    Game_Character.prototype.locate.call(this, x, y);
    this.center(x, y);
    this.makeEncounterCount();
    if( this.isInVehicle() ){
        this.vehicle().refresh();
    }
    this._followers.synchronize(x, y, this.direction());
};
//==============================
// * A坐标 - 中心位置X（基函数）
//==============================
Game_Player.prototype.centerX = function(){
    return (Graphics.width / $gameMap.tileWidth() - 1) / 2.0;
};
//==============================
// * A坐标 - 中心位置Y（基函数）
//==============================
Game_Player.prototype.centerY = function(){
    return (Graphics.height / $gameMap.tileHeight() - 1) / 2.0;
};
//==============================
// * A坐标 - 中心位置（基函数）
//==============================
Game_Player.prototype.center = function( x, y ){
    return $gameMap.setDisplayPos(x - this.centerX(), y - this.centerY());
};

//==============================
// * D动作 - 判断静止中（继承）
//==============================
Game_Player.prototype.isStopping = function(){
    if( this._vehicleGettingOn || this._vehicleGettingOff ){
        return false;
    }
    return Game_Character.prototype.isStopping.call(this);
};
//==============================
// * D动作 - 移动 - 步数添加时（继承）
//==============================
Game_Player.prototype.increaseSteps = function(){
    Game_Character.prototype.increaseSteps.call(this);
    if( this.isNormal() ){
        $gameParty.increaseSteps();
    }
};
//==============================
// * D动作 - 移动 - 步数添加条件
//
//			说明：	> 无载具+玩家控制移动 才步数+1。
//					> 该函数只计数步数，与 3C遇敌 无关。
//==============================
Game_Player.prototype.isNormal = function(){
    return this._vehicleType === 'walk' && !this.isMoveRouteForcing();
};
//==============================
// * D动作 - 移动 - 执行移动（继承）
//==============================
Game_Player.prototype.moveStraight = function( d ){
    if( this.canPass(this.x, this.y, d) ){
        this._followers.updateMove();
    }
    Game_Character.prototype.moveStraight.call(this, d);
};
//==============================
// * D动作 - 移动 - 执行斜向移动（继承）
//==============================
Game_Player.prototype.moveDiagonally = function( horz, vert ){
    if( this.canPassDiagonally(this.x, this.y, horz, vert) ){
        this._followers.updateMove();
    }
    Game_Character.prototype.moveDiagonally.call(this, horz, vert);
};
//==============================
// * D动作 - 跳跃 - 执行跳跃（继承）
//==============================
Game_Player.prototype.jump = function( xPlus, yPlus ){
    Game_Character.prototype.jump.call(this, xPlus, yPlus);
    this._followers.jumpAll();
};

//==============================
// * E可通行 - 测试游戏按ctrl键实现穿透（继承）
//==============================
Game_Player.prototype.isDebugThrough = function(){
    return Input.isPressed('control') && $gameTemp.isPlaytest();
};
//==============================
// * E可通行 - 玩家是否碰撞（基函数）
//
//			说明：	> 注意，父类没有该函数，这里是单独建立的函数。
//==============================
Game_Player.prototype.isCollided = function( x, y ){
    if( this.isThrough() ){
        return false;
    }else{
        return this.pos(x, y) || this._followers.isSomeoneCollided(x, y);
    }
};
//==============================
// * E可通行 - 判断 - 图块是否可通行（继承）
//==============================
Game_Player.prototype.isMapPassable = function( x, y, d ){
	
	// > 在载具中时，按载具情况通行
    var vehicle = this.vehicle();
    if( vehicle ){
        return vehicle.isMapPassable(x, y, d);
		
	// > 默认正常判断可通行
    }else{
        return Game_Character.prototype.isMapPassable.call(this, x, y, d);
    }
};

//==============================
// * F行走图 - 刷新（基函数）
//
//			说明：	> 注意，父类没有该函数，这里是单独建立的函数。
//					> 多用于载具切换，队伍切换。
//==============================
Game_Player.prototype.refresh = function(){
    var actor = $gameParty.leader();
    var characterName = actor ? actor.characterName() : '';
    var characterIndex = actor ? actor.characterIndex() : 0;
    this.setImage(characterName, characterIndex);
    this._followers.refresh();
};


//==============================
// * 3A场所移动 - 清理配置信息
//==============================
Game_Player.prototype.clearTransferInfo = function(){
    this._transferring = false;			//3A场所移动 - 移动标记
    this._newMapId = 0;					//3A场所移动 - 地图ID
    this._newX = 0;						//3A场所移动 - 坐标X
    this._newY = 0;						//3A场所移动 - 坐标Y
    this._newDirection = 0;				//3A场所移动 - 朝向
};
//==============================
// * 3A场所移动 - 访问器
//==============================
Game_Player.prototype.isTransferring = function(){ return this._transferring; };	//移动标记
Game_Player.prototype.newMapId = function(){ return this._newMapId; };				//地图ID
Game_Player.prototype.fadeType = function(){ return this._fadeType; };				//渐变（黑底/白底/无）
//==============================
// * 3A场所移动 - 执行移动
//==============================
Game_Player.prototype.reserveTransfer = function( mapId, x, y, d, fadeType ){
    this._transferring = true;
    this._newMapId = mapId;
    this._newX = x;
    this._newY = y;
    this._newDirection = d;
    this._fadeType = fadeType;
};
//==============================
// * 3A场所移动 - 重刷标记
//
//			说明：	> 此函数在 读档界面 Scene_Load.prototype.reloadMapIfUpdated函数 中被调用。
//					（用于存档面对不同的更新版本号时，重刷地图数据）
//==============================
Game_Player.prototype.requestMapReload = function(){
    this._needsMapReload = true;
};
//==============================
// * 3A场所移动 - 场所移动流程
//
//			说明：	> 此函数在 Scene_Map.prototype.onMapLoaded 中被调用。
//==============================
Game_Player.prototype.performTransfer = function(){
    if( this.isTransferring() ){
		
		// > 朝向设置
        this.setDirection(this._newDirection);
        
		// > 切换地图
		if( this._newMapId !== $gameMap.mapId() || 	//（地图id 变化时，重刷地图数据）
			this._needsMapReload ){					//（重刷标记 开启时，重刷地图数据）
            $gameMap.setup(this._newMapId);
            this._needsMapReload = false;
        }
		
		// > 设置位置
        this.locate(this._newX, this._newY);
		
		// > 刷新数据
        this.refresh();
        this.clearTransferInfo();
    }
};


//==============================
// * 3B载具 - 获取载具
//==============================
Game_Player.prototype.vehicle = function(){
    return $gameMap.vehicle(this._vehicleType);
};
//==============================
// * 3B载具 - 判断载具 - 小船
//==============================
Game_Player.prototype.isInBoat = function(){ return this._vehicleType === 'boat'; };
//==============================
// * 3B载具 - 判断载具 - 大船
//==============================
Game_Player.prototype.isInShip = function(){ return this._vehicleType === 'ship'; };
//==============================
// * 3B载具 - 判断载具 - 飞艇
//==============================
Game_Player.prototype.isInAirship = function(){ return this._vehicleType === 'airship'; };
//==============================
// * 3B载具 - 判断是否在载具中
//==============================
Game_Player.prototype.isInVehicle = function(){
    return this.isInBoat() || this.isInShip() || this.isInAirship();
};
//==============================
// * 3B载具 - 帧刷新
//==============================
Game_Player.prototype.updateVehicle = function(){
    if( this.isInVehicle() && !this.areFollowersGathering() ){
		
		// > 帧刷新 上载具
        if( this._vehicleGettingOn ){
            this.updateVehicleGetOn();
			
		// > 帧刷新 下载具
        }else if( this._vehicleGettingOff ){
            this.updateVehicleGetOff();
			
		// > 帧刷新 实时同步位置
        }else{
            this.vehicle().syncWithPlayer();
        }
    }
};
//==============================
// * 3B载具 - 帧刷新 上载具
//==============================
Game_Player.prototype.updateVehicleGetOn = function(){
    if( !this.areFollowersGathering() && !this.isMoving() ){
        this.setDirection(this.vehicle().direction());
        this.setMoveSpeed(this.vehicle().moveSpeed());
        this._vehicleGettingOn = false;
        this.setTransparent(true);
        if( this.isInAirship() ){
            this.setThrough(true);
        }
        this.vehicle().getOn();
    }
};
//==============================
// * 3B载具 - 帧刷新 下载具
//==============================
Game_Player.prototype.updateVehicleGetOff = function(){
    if( !this.areFollowersGathering() && this.vehicle().isLowest() ){
        this._vehicleGettingOff = false;
        this._vehicleType = 'walk';
        this.setTransparent(false);
    }
};
//==============================
// * 3B载具 - 执行 - 载具上下
//==============================
Game_Player.prototype.getOnOffVehicle = function(){
    if( this.isInVehicle() ){
        return this.getOffVehicle();
    }else{
        return this.getOnVehicle();
    }
};
//==============================
// * 3B载具 - 执行 - 上载具
//==============================
Game_Player.prototype.getOnVehicle = function(){
    var direction = this.direction();
    var x1 = this.x;
    var y1 = this.y;
    var x2 = $gameMap.roundXWithDirection(x1, direction);
    var y2 = $gameMap.roundYWithDirection(y1, direction);
    if( $gameMap.airship().pos(x1, y1) ){
        this._vehicleType = 'airship';
    }else if( $gameMap.ship().pos(x2, y2) ){
        this._vehicleType = 'ship';
    }else if( $gameMap.boat().pos(x2, y2) ){
        this._vehicleType = 'boat';
    }
    if( this.isInVehicle() ){
        this._vehicleGettingOn = true;
        if( !this.isInAirship() ){
            this.forceMoveForward();
        }
        this.gatherFollowers();
    }
    return this._vehicleGettingOn;
};
//==============================
// * 3B载具 - 执行 - 下载具
//==============================
Game_Player.prototype.getOffVehicle = function(){
    if( this.vehicle().isLandOk(this.x, this.y, this.direction()) ){
        if( this.isInAirship() ){
            this.setDirection(2);
        }
        this._followers.synchronize(this.x, this.y, this.direction());
        this.vehicle().getOff();
        if( !this.isInAirship() ){
            this.forceMoveForward();
            this.setTransparent(false);
        }
        this._vehicleGettingOff = true;
        this.setMoveSpeed(4);
        this.setThrough(false);
        this.makeEncounterCount();	//（下载具时，重新遇敌计数）
        this.gatherFollowers();
    }
    return this._vehicleGettingOff;
};
//==============================
// * 3B载具 - 强制向前移动
//==============================
Game_Player.prototype.forceMoveForward = function(){
    this.setThrough(true);
    this.moveForward();
    this.setThrough(false);
};


//==============================
// * 3C遇敌 - 帧刷新 遇敌
//
//			说明： > 此函数在 Scene_Map.prototype.updateEncounter 中帧刷新执行。
//==============================
Game_Player.prototype.executeEncounter = function(){
    if( !$gameMap.isEventRunning() && this._encounterCount <= 0 ){
        this.makeEncounterCount();
        var troopId = this.makeEncounterTroopId();
        if( $dataTroops[troopId] ){
            BattleManager.setup(troopId, true, false);
            BattleManager.onEncounter();
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
};
//==============================
// * 3C遇敌 - 遇敌计数初始化
//
//			说明：	> 随机产生 1~最大步数 的值，常规时每步减1，小于零则遇敌。
//==============================
Game_Player.prototype.makeEncounterCount = function(){
    var n = $gameMap.encounterStep();
    this._encounterCount = Math.randomInt(n) + Math.randomInt(n) + 1;
};
//==============================
// * 3C遇敌 - 是否可遇敌
//==============================
Game_Player.prototype.canEncounter = function(){
    return (!$gameParty.hasEncounterNone() && $gameSystem.isEncounterEnabled() &&
            !this.isInAirship() && !this.isMoveRouteForcing() && !this.isDebugThrough());
};
//==============================
// * 3C遇敌 - 帧刷新 遇敌计数
//==============================
Game_Player.prototype.updateEncounterCount = function(){
    if( this.canEncounter() ){
        this._encounterCount -= this.encounterProgressValue();
    }
};
//==============================
// * 3C遇敌 - 每步的进度加成
//==============================
Game_Player.prototype.encounterProgressValue = function(){
	
	// > 灌木丛中两倍遇敌
    var value = $gameMap.isBush(this.x, this.y) ? 2 : 1;
    
	// > 遇敌减半技能
	if( $gameParty.hasEncounterHalf() ){ value *= 0.5; }
	
	// > 船上遇敌减半
    if( this.isInShip() ){ value *= 0.5; }
	
    return value;
};
//==============================
// * 3C遇敌 - 获取敌群ID
//
//			说明：	> 根据地图中的区域以及权重设置，随机抽取遇敌ID。
//==============================
Game_Player.prototype.makeEncounterTroopId = function(){
    var encounterList = [];
    var weightSum = 0;
    $gameMap.encounterList().forEach(function( encounter ){
        if( this.meetsEncounterConditions(encounter) ){
            encounterList.push(encounter);
            weightSum += encounter.weight;
        }
    }, this);
    if( weightSum > 0 ){
        var value = Math.randomInt(weightSum);
        for( var i = 0; i < encounterList.length; i++ ){
            value -= encounterList[i].weight;
            if( value < 0 ){
                return encounterList[i].troopId;
            }
        }
    }
    return 0;
};
//==============================
// * 3C遇敌 - 获取敌群ID - 遇敌条件
//==============================
Game_Player.prototype.meetsEncounterConditions = function( encounter ){
    return (encounter.regionSet.length === 0 ||
            encounter.regionSet.contains(this.regionId()));
};


//==============================
// * 3D奔跑 - D动作 - 判断奔跑中（继承）
//==============================
Game_Player.prototype.isDashing = function(){ return this._dashing; };
//==============================
// * 3D奔跑 - 帧刷新
//
//			说明：	> 奔跑只影响物体的移动速度，见函数 Game_CharacterBase.prototype.realMoveSpeed 。
//==============================
Game_Player.prototype.updateDashing = function(){
    if( this.isMoving() ){
        return;
    }
    if( this.canMove() && !this.isInVehicle() && !$gameMap.isDashDisabled() ){
        this._dashing = this.isDashButtonPressed() || $gameTemp.isDestinationValid();
    }else{
        this._dashing = false;
    }
};
//==============================
// * 3D奔跑 - 判断奔跑键
//==============================
Game_Player.prototype.isDashButtonPressed = function(){
    var shift = Input.isPressed('shift');
    if( ConfigManager.alwaysDash ){		//（选项配置管理器的 保持奔跑 为开时，按键取反。）
        return !shift;
    }else{
        return shift;
    }
};


//==============================
// * 3E按键移动『允许操作玩家移动』 - 帧刷新
//==============================
Game_Player.prototype.moveByInput = function(){
    if( !this.isMoving() && this.canMove() ){
		
		// > 当前若为键盘操作，则 关闭鼠标指向标
        var direction = this.getInputDirection();
        if( direction > 0 ){
            $gameTemp.clearDestination();
		
		// > 当前若为鼠标操作，则设定位置
        }else if( $gameTemp.isDestinationValid() ){
            var x = $gameTemp.destinationX();
            var y = $gameTemp.destinationY();
            direction = this.findDirectionTo(x, y);		//2C自动寻迹
        }
		
		// > 执行移动
        if( direction > 0 ){
            this.executeMove(direction);
        }
    }
};
//==============================
// * 3E按键移动『允许操作玩家移动』 - 是否允许操作移动
//==============================
Game_Player.prototype.canMove = function(){
    if( $gameMap.isEventRunning() || $gameMessage.isBusy() ){
        return false;
    }
    if( this.isMoveRouteForcing() || this.areFollowersGathering() ){
        return false;
    }
    if( this._vehicleGettingOn || this._vehicleGettingOff ){
        return false;
    }
    if( this.isInVehicle() && !this.vehicle().canMove() ){
        return false;
    }
    return true;
};
//==============================
// * 3E按键移动『允许操作玩家移动』 - 获取按键方向
//==============================
Game_Player.prototype.getInputDirection = function(){
    return Input.dir4;
};
//==============================
// * 3E按键移动『允许操作玩家移动』 - 执行移动
//==============================
Game_Player.prototype.executeMove = function( direction ){
    this.moveStraight(direction);
};


//==============================
// * 3F玩家队员 - 获取玩家队员（开放函数）
//==============================
Game_Player.prototype.followers = function(){ return this._followers; };
//==============================
// * 3F玩家队员 - 显示玩家队员（开放函数）
//==============================
Game_Player.prototype.showFollowers = function(){ this._followers.show(); };
//==============================
// * 3F玩家队员 - 隐藏玩家队员（开放函数）
//==============================
Game_Player.prototype.hideFollowers = function(){ this._followers.hide(); };
//==============================
// * 3F玩家队员 - 集合玩家队员（开放函数）
//==============================
Game_Player.prototype.gatherFollowers = function(){
    this._followers.gather();
};
//==============================
// * 3F玩家队员 - 是否正在集合
//==============================
Game_Player.prototype.areFollowersGathering = function(){
    return this._followers.areGathering();
};
//==============================
// * 3F玩家队员 - 是否集合完毕
//==============================
Game_Player.prototype.areFollowersGathered = function(){
    return this._followers.areGathered();
};


//==============================
// * 3G触发事件『允许操作玩家触发』 - 是否允许触发
//==============================
Game_Player.prototype.canStartLocalEvents = function(){
    return !this.isInAirship();
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - D动作 - 接触触发（继承）
//==============================
Game_Player.prototype.checkEventTriggerTouch = function( x, y ){
    if( this.canStartLocalEvents() ){		//（是否允许触发）
        this.startMapEvent(x, y, [1,2], true);
    }
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 执行触发（绑定start标记）
//
//			说明：	> triggers为数组，主要包含[0,1,2]的判断。（0确定键 1玩家接触 2事件接触 3自动执行 4并行处理）
//					> normal为布尔，判断是否为 与人物相同 的优先级。
//					> 该函数本质上只是绑定一个start标记，真实执行位置见函数Game_Map.prototype.setupStartingMapEvent，该函数根据事件start标记，插入 事件指令 序列。
//==============================
Game_Player.prototype.startMapEvent = function( x, y, triggers, normal ){
    if( !$gameMap.isEventRunning() ){
        $gameMap.eventsXy(x, y).forEach(function( event ){
            if( event.isTriggerIn(triggers) && event.isNormalPriority() === normal ){
                event.start();
            }
        });
    }
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 执行触发 - 脚下位置触发
//==============================
Game_Player.prototype.checkEventTriggerHere = function( triggers ){
    if( this.canStartLocalEvents() ){		//（是否允许触发）
        this.startMapEvent(this.x, this.y, triggers, false);
    }
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 执行触发 - 前方位置触发
//==============================
Game_Player.prototype.checkEventTriggerThere = function( triggers ){
    if( this.canStartLocalEvents() ){		//（是否允许触发）
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        this.startMapEvent(x2, y2, triggers, true);
        if( !$gameMap.isAnyEventStarting() && $gameMap.isCounter(x2, y2) ){
            var x3 = $gameMap.roundXWithDirection(x2, direction);
            var y3 = $gameMap.roundYWithDirection(y2, direction);
            this.startMapEvent(x3, y3, triggers, true);
        }
    }
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 暂停移动时（帧刷新）
//
//			说明：	> 注意，wasMoving为true的时候，表示在 玩家移动然后静止 的那一帧执行。
//					  wasMoving为false的时候，才表示在 帧刷新。
//==============================
Game_Player.prototype.updateNonmoving = function( wasMoving ){
    if( !$gameMap.isEventRunning() ){
		
		// > 移动接触触发（非帧刷新，1玩家接触，2事件接触）
        if( wasMoving ){
            
			$gameParty.onPlayerWalk();	//（队伍-每步时执行）
			
            this.checkEventTriggerHere([1,2]);		//（根据图块给事件绑定start标记）
            if( $gameMap.setupStartingEvent() ){	//（如果有事件成功绑定start标记，那么执行事件）
                return;
            }
        }
		
		// > 静止时触发（帧刷新）
        if( this.triggerAction() ){
            return;
        }
		
		// > 3C遇敌 - 遇敌计数（非帧刷新）
        if( wasMoving ){
            this.updateEncounterCount();
			
		// > 关闭鼠标指向标
		//		（注意，静止时触发 约束了关闭条件，此处要理解起来非常绕）
		//		（其实直接判断 isMovementSucceeded() == false 移动失败就行了，移动失败就关闭指向标）
        }else{
            $gameTemp.clearDestination();
        }
    }
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 静止时触发
//
//			说明：	> 静止时，是指玩家站在原地，然后按一下 键盘/手柄 的触发效果。
//					  或者，鼠标/触屏指向目的后，玩家暂停移动时，执行一次 鼠标/触屏 的触发效果。
//==============================
Game_Player.prototype.triggerAction = function(){
    if( this.canMove() ){
        if( this.triggerButtonAction() ){
            return true;
        }
        if( this.triggerTouchAction() ){
            return true;
        }
    }
    return false;
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 静止时触发（键盘/手柄）
//==============================
Game_Player.prototype.triggerButtonAction = function(){
    if( Input.isTriggered('ok') ){
        if( this.getOnOffVehicle() ){
            return true;
        }
        this.checkEventTriggerHere([0]);		//（根据图块给事件绑定start标记）
        if( $gameMap.setupStartingEvent() ){	//（如果有事件成功绑定start标记，那么执行事件）
            return true;
        }
        this.checkEventTriggerThere([0,1,2]);	//（根据图块给事件绑定start标记）
        if( $gameMap.setupStartingEvent() ){	//（如果有事件成功绑定start标记，那么执行事件）
            return true;
        }
    }
    return false;
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 静止时触发（鼠标/触屏）
//==============================
Game_Player.prototype.triggerTouchAction = function(){
    if( $gameTemp.isDestinationValid() ){
        var direction = this.direction();
        var x1 = this.x;
        var y1 = this.y;
        var x2 = $gameMap.roundXWithDirection(x1, direction);
        var y2 = $gameMap.roundYWithDirection(y1, direction);
        var x3 = $gameMap.roundXWithDirection(x2, direction);
        var y3 = $gameMap.roundYWithDirection(y2, direction);
        var destX = $gameTemp.destinationX();
        var destY = $gameTemp.destinationY();
        if( destX === x1 && destY === y1 ){
            return this.triggerTouchActionD1(x1, y1);
        }else if( destX === x2 && destY === y2 ){
            return this.triggerTouchActionD2(x2, y2);
        }else if( destX === x3 && destY === y3 ){
            return this.triggerTouchActionD3(x2, y2);
        }
    }
    return false;
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 静止时触发（鼠标/触屏） - 脚下情况
//==============================
Game_Player.prototype.triggerTouchActionD1 = function( x1, y1 ){
    if( $gameMap.airship().pos(x1, y1) ){
        if( TouchInput.isTriggered() && this.getOnOffVehicle() ){
            return true;
        }
    }
    this.checkEventTriggerHere([0]);		//（根据图块给事件绑定start标记）
    return $gameMap.setupStartingEvent();	//（如果有事件成功绑定start标记，那么执行事件）
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 静止时触发（鼠标/触屏） - 前方一图块情况
//==============================
Game_Player.prototype.triggerTouchActionD2 = function( x2, y2 ){
    if( $gameMap.boat().pos(x2, y2) || $gameMap.ship().pos(x2, y2) ){
        if( TouchInput.isTriggered() && this.getOnVehicle() ){
            return true;
        }
    }
    if( this.isInBoat() || this.isInShip() ){
        if( TouchInput.isTriggered() && this.getOffVehicle() ){
            return true;
        }
    }
    this.checkEventTriggerThere([0,1,2]);	//（根据图块给事件绑定start标记）
    return $gameMap.setupStartingEvent();	//（如果有事件成功绑定start标记，那么执行事件）
};
//==============================
// * 3G触发事件『允许操作玩家触发』 - 静止时触发（鼠标/触屏） - 前方两图块情况（桌子）
//==============================
Game_Player.prototype.triggerTouchActionD3 = function( x2, y2 ){
    if( $gameMap.isCounter(x2, y2) ){
        this.checkEventTriggerThere([0,1,2]);	//（根据图块给事件绑定start标记）
    }											//
    return $gameMap.setupStartingEvent();		//（如果有事件成功绑定start标记，那么执行事件）
};


//==============================
// * 3H地形伤害 - 是否处于伤害地面
//==============================
Game_Player.prototype.isOnDamageFloor = function(){
    return $gameMap.isDamageFloor(this.x, this.y) && !this.isInAirship();
};



//=============================================================================
// ** 玩家队员【Game_Follower】
//			
//			实例：	$gamePlayer._followers._data 列表中对象
//			索引：	follower
//			来源：	继承于Game_Character
//			应用：	只在 Game_Followers 中实例化
//					
//			作用域：	地图界面
//			主功能：	> 定义一个跟随玩家的玩家队员
//			子功能：
//						->继承 物体
//						->角色数据
//						->刷新 行走图（基函数）
//						->是否可见
//						->跟随物体
//					
//			说明：	> 玩家队员不单独创建，而是通过 玩家队员组 一起管理。
//					> 玩家队员 不包括 玩家 自己。
//=============================================================================
//==============================
// * 玩家队员 - 定义
//==============================
function Game_Follower(){
    this.initialize.apply(this, arguments);
}
Game_Follower.prototype = Object.create(Game_Character.prototype);
Game_Follower.prototype.constructor = Game_Follower;
//==============================
// * 玩家队员 - 初始化
//
//			说明：	> 由于不包括玩家，memberIndex从1开始计数。（见Game_Followers.prototype.initialize）
//==============================
Game_Follower.prototype.initialize = function( memberIndex ){
    Game_Character.prototype.initialize.call(this);
    this._memberIndex = memberIndex;
    this.setTransparent($dataSystem.optTransparent);	//设置透明（系统>选项>透明状态下开始游戏）
    this.setThrough(true);								//设置穿透
};
//==============================
// * 玩家队员 - 帧刷新
//==============================
Game_Follower.prototype.update = function(){
    Game_Character.prototype.update.call(this);
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
    this.setOpacity($gamePlayer.opacity());
    this.setBlendMode($gamePlayer.blendMode());
    this.setWalkAnime($gamePlayer.hasWalkAnime());
    this.setStepAnime($gamePlayer.hasStepAnime());
    this.setDirectionFix($gamePlayer.isDirectionFixed());
    this.setTransparent($gamePlayer.isTransparent());
};

//==============================
// * 玩家队员 - 角色数据
//
//			说明：	> 玩家队员与角色队伍的顺序一致。
//==============================
Game_Follower.prototype.actor = function(){
    return $gameParty.battleMembers()[this._memberIndex];
};
//==============================
// * 玩家队员 - 刷新 行走图（基函数）
//
//			说明：	> 注意，父类没有该函数，这里是单独建立的函数。
//==============================
Game_Follower.prototype.refresh = function(){
    var characterName = this.isVisible() ? this.actor().characterName() : '';
    var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
    this.setImage(characterName, characterIndex);
};
//==============================
// * 玩家队员『玩家队员管理』 - 是否可见
//
//			说明：	> 单独的玩家队员不控制可见，由 玩家队员组 统一控制。
//==============================
Game_Follower.prototype.isVisible = function(){
    return this.actor() && $gamePlayer.followers().isVisible();
};
//==============================
// * 玩家队员『玩家队员管理』 - 跟随物体
//==============================
Game_Follower.prototype.chaseCharacter = function( character ){
    var sx = this.deltaXFrom(character.x);
    var sy = this.deltaYFrom(character.y);
    if( sx !== 0 && sy !== 0 ){
        this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
    }else if( sx !== 0 ){
        this.moveStraight(sx > 0 ? 4 : 6);
    }else if( sy !== 0 ){
        this.moveStraight(sy > 0 ? 8 : 2);
    }
    this.setMoveSpeed($gamePlayer.realMoveSpeed());
};


//=============================================================================
// ** 玩家队员组【Game_Followers】
//			
//			实例：	$gamePlayer._followers
//			索引：	follower
//			来源：	无（父类）
//			应用：	只在 Game_Player 中实例化
//					
//			作用域：	地图界面
//			主功能：	> 定义一个跟随玩家的玩家队员组
//			子功能：
//						->A队员可见
//						->B子队员
//							->遍历
//							->反向遍历
//							->帧刷新移动
//						->C队员动作
//							->跳跃
//							->瞬间同步位置
//						->D集合队伍
//						->E队伍可通行
//					
//			说明：	> 玩家队员组与玩家一对一绑定。
//					> 玩家队员 不包括 玩家 自己。
//=============================================================================
//==============================
// * 玩家队员组 - 定义
//==============================
function Game_Followers(){
    this.initialize.apply(this, arguments);
}
//==============================
// * 玩家队员组 - 初始化
//==============================
Game_Followers.prototype.initialize = function(){
	
    this._visible = $dataSystem.optFollowers;	//设置可见（系统>选项>队列行进）
    
	this._gathering = false;					//D集合队伍 - 是否正在集合
    
	this._data = [];							//B子队员 - 队员数据列表
    for( var i = 1; i < $gameParty.maxBattleMembers(); i++ ){
        this._data.push(new Game_Follower(i));
    }
};
//==============================
// * 玩家队员组 - 帧刷新
//==============================
Game_Followers.prototype.update = function(){
	
    if( this.areGathering() ){			//帧刷新 - D集合队伍
        if( !this.areMoving() ){
            this.updateMove();
        }
        if( this.areGathered() ){
            this._gathering = false;
        }
    }
	
    this.forEach(function( follower ){	//帧刷新 - B子队员
        follower.update();
    }, this);
};


//==============================
// * A队员可见 - 是否可见
//==============================
Game_Followers.prototype.isVisible = function(){ return this._visible; };
//==============================
// * A队员可见 - 显示
//==============================
Game_Followers.prototype.show = function(){ this._visible = true; };
//==============================
// * A队员可见 - 隐藏
//==============================
Game_Followers.prototype.hide = function(){ this._visible = false; };


//==============================
// * B子队员 - 获取子队员
//==============================
Game_Followers.prototype.follower = function( index ){
    return this._data[index];
};
//==============================
// * B子队员 - 获取显示的子队员
//
//			说明：	> 不管队伍多少人，初始都会创建 全部玩家队员，只是根据是否有角色来设置 显示/隐藏。
//					> 全部玩家队员数量 = maxBattleMembers() - 1
//==============================
Game_Followers.prototype.visibleFollowers = function(){
    return this._data.filter(function( follower ){
        return follower.isVisible();
    }, this);
};
//==============================
// * B子队员 - 遍历
//==============================
Game_Followers.prototype.forEach = function( callback, thisObject ){
    this._data.forEach(callback, thisObject);
};
//==============================
// * B子队员 - 反向遍历
//==============================
Game_Followers.prototype.reverseEach = function( callback, thisObject ){
    this._data.reverse();
    this._data.forEach(callback, thisObject);
    this._data.reverse();
};
//==============================
// * B子队员 - 遍历 刷新
//==============================
Game_Followers.prototype.refresh = function(){
    this.forEach(function( follower ){
        return follower.refresh();
    }, this);
};
//==============================
// * B子队员 - 帧刷新移动
//==============================
Game_Followers.prototype.updateMove = function(){
    for( var i = this._data.length - 1; i >= 0; i-- ){
        var precedingCharacter = (i > 0 ? this._data[i - 1] : $gamePlayer);
        this._data[i].chaseCharacter(precedingCharacter);
    }
};

//==============================
// * C队员动作 - 跳跃
//==============================
Game_Followers.prototype.jumpAll = function(){
    if( $gamePlayer.isJumping() ){
        for( var i = 0; i < this._data.length; i++ ){
            var follower = this._data[i];
            var sx = $gamePlayer.deltaXFrom(follower.x);
            var sy = $gamePlayer.deltaYFrom(follower.y);
            follower.jump(sx, sy);
        }
    }
};
//==============================
// * C队员动作 - 瞬间同步位置
//==============================
Game_Followers.prototype.synchronize = function( x, y, d ){
    this.forEach(function( follower ){
        follower.locate(x, y);
        follower.setDirection(d);
    }, this);
};

//==============================
// * D集合队伍 - 执行集合
//==============================
Game_Followers.prototype.gather = function(){
    this._gathering = true;
};
//==============================
// * D集合队伍 - 是否正在集合
//==============================
Game_Followers.prototype.areGathering = function(){ return this._gathering; };
//==============================
// * D集合队伍 - 是否集合完毕
//==============================
Game_Followers.prototype.areGathered = function(){
    return this.visibleFollowers().every(function( follower ){
        return !follower.isMoving() && follower.pos($gamePlayer.x, $gamePlayer.y);
    }, this);
};
//==============================
// * D集合队伍 - 是否正在移动
//==============================
Game_Followers.prototype.areMoving = function(){
    return this.visibleFollowers().some(function( follower ){
        return follower.isMoving();
    }, this);
};

//==============================
// * E队伍可通行 - 是否碰撞
//==============================
Game_Followers.prototype.isSomeoneCollided = function( x, y ){
    return this.visibleFollowers().some(function( follower ){
        return follower.pos(x, y);
    }, this);
};



//=============================================================================
// ** 载具【Game_Vehicle】
//			
//			实例：	$gameMap._vehicles
//			索引：	vehicle
//			来源：	继承于Game_Character
//			应用：	> 载具类，分别为 小船$gameMap.boat() 大船$gameMap.ship() 飞艇$gameMap.airship() 
//					> 在Game_Map.prototype.updateVehicles中被控制 帧刷新
//					
//			作用域：	地图界面
//			主功能：	> 定义一个可供玩家乘坐的载具
//			子功能：
//						->继承 物体
//						->A坐标
//						->E可通行
//						->3A载具音乐
//						->3B数据库
//							> 小船（'boat'）
//							> 大船（'ship'）
//							> 飞艇（'airship'）
//							->载具设置中没有'walk'设定
//						->3C乘坐
//						->3D飞艇
//						->3E飞艇阴影
//						
//			说明：	> 玩家上载具后，载具实时同步玩家位置，按键控制功能实际上仍然控制的是玩家对象。
//					> 载具有三种，但每种在整个游戏中都只能设置一个，并且载具能带出地图。
//					  载具直接被定义在$gameMap中，每次刷新地图时，并不会改变载具配置，并且载具通过 this._mapId 区分所在地图。见函数Game_Map.prototype.createVehicles。
//=============================================================================
//==============================
// * 载具 - 定义
//==============================
function Game_Vehicle(){
    this.initialize.apply(this, arguments);
}
Game_Vehicle.prototype = Object.create(Game_Character.prototype);
Game_Vehicle.prototype.constructor = Game_Vehicle;
//==============================
// * 载具 - 初始化
//==============================
Game_Vehicle.prototype.initialize = function( type ){
    Game_Character.prototype.initialize.call(this);
	
    this._type = type;			//3B数据库 - 载具类型
	
    this.resetDirection();		//3C乘坐 - 初始化朝向
    this.initMoveSpeed();		//3C乘坐 - 初始化移动速度
    this.loadSystemSettings();	//3B数据库 - 初始化
};
//==============================
// * 载具 - 初始化属性
//==============================
Game_Vehicle.prototype.initMembers = function(){
    Game_Character.prototype.initMembers.call(this);
	
    this._type = '';			//3B数据库 - 载具类型
	
    this._mapId = 0;			//A坐标 - 载具所在地图
	
    this._altitude = 0;			//3D飞艇 - 海拔
	
    this._driving = false;		//3C乘坐 - 是否在载具中
	
    this._bgm = null;			//3A载具音乐 - 音乐设置
};
//==============================
// * 载具 - 帧刷新
//==============================
Game_Vehicle.prototype.update = function(){
    Game_Character.prototype.update.call(this);
    if( this.isAirship() ){
        this.updateAirship();	//帧刷新 - 3D飞艇
    }
};
//==============================
// * 载具 - 刷新（基函数）
//
//			说明：	> 该函数用于 载具初始化 或 玩家坐标初始化。
//					> 注意，父类没有该函数，这里是单独建立的函数。
//==============================
Game_Vehicle.prototype.refresh = function(){
	
	// > 在载具中时
    if( this._driving ){
        this._mapId = $gameMap.mapId();
        this.syncWithPlayer();
    }else if( this._mapId === $gameMap.mapId() ){
        this.locate(this.x, this.y);
    }
	
	// > 3D飞艇 刷新
    if( this.isAirship() ){
        this.setPriorityType(this._driving ? 2 : 0);
    }else{
        this.setPriorityType(1);
    }
	
	// > 载具行走图刷新
    this.setWalkAnime(this._driving);
    this.setStepAnime(this._driving);
    this.setTransparent(this._mapId !== $gameMap.mapId());
};


//==============================
// * A坐标 - 设置载具位置（基函数）
//
//			说明：	> 注意，父类没有该函数，这里是单独建立的函数。
//==============================
Game_Vehicle.prototype.setLocation = function( mapId, x, y ){
    this._mapId = mapId;
    this.setPosition(x, y);
    this.refresh();
};
//==============================
// * A坐标 - 判断是否在某坐标（继承）
//
//			说明：	> 载具不在当前地图时，返回false。
//==============================
Game_Vehicle.prototype.pos = function( x, y ){
    if( this._mapId === $gameMap.mapId() ){
        return Game_Character.prototype.pos.call(this, x, y);
    }else{
        return false;
    }
};
//==============================
// * A坐标 - 实时同步位置
//
//			说明：	> 此函数在 玩家帧刷新 中执行，上载具后，载具实时同步玩家位置。
//					  表面上在控制载具移动，实际上是控制玩家移动。
//==============================
Game_Vehicle.prototype.syncWithPlayer = function(){
    this.copyPosition($gamePlayer);
    this.refreshBushDepth();
};
//==============================
// * A坐标 - 是否允许操作移动
//
//			说明：	> 载具的允许操作玩家移动 与 玩家的允许操作玩家移动 为叠加关系，见 Game_Player.prototype.canMove 。
//==============================
Game_Vehicle.prototype.canMove = function(){
    if( this.isAirship() ){		//载具条件 - 在飞艇中必须起飞后才能移动
        return this.isHighest();
    }else{
        return true;
    }
};

//==============================
// * E可通行 - 判断 - 图块是否可通行（继承）
//==============================
Game_Vehicle.prototype.isMapPassable = function( x, y, d ){
    var x2 = $gameMap.roundXWithDirection(x, d);
    var y2 = $gameMap.roundYWithDirection(y, d);
    if( this.isBoat() ){			//（小船）
        return $gameMap.isBoatPassable(x2, y2);
    }else if( this.isShip() ){		//（大船）
        return $gameMap.isShipPassable(x2, y2);
    }else if( this.isAirship() ){	//（飞艇）
        return true;
    }else{							//（无，这里已经排除玩家"walk"的情况）
        return false;
    }
};


//==============================
// * 3A载具音乐 - 设置音乐
//==============================
Game_Vehicle.prototype.setBgm = function( bgm ){
    this._bgm = bgm;
};
//==============================
// * 3A载具音乐 - 播放音乐
//==============================
Game_Vehicle.prototype.playBgm = function(){
    AudioManager.playBgm(this._bgm || this.vehicle().bgm);
};


//==============================
// * 3B数据库 - 是否为 小船
//==============================
Game_Vehicle.prototype.isBoat = function(){ return this._type === 'boat'; };
//==============================
// * 3B数据库 - 是否为 大船
//==============================
Game_Vehicle.prototype.isShip = function(){ return this._type === 'ship'; };
//==============================
// * 3B数据库 - 是否为 飞艇
//==============================
Game_Vehicle.prototype.isAirship = function(){ return this._type === 'airship'; };
//==============================
// * 3B数据库 - 获取载具信息
//==============================
Game_Vehicle.prototype.vehicle = function(){
    if( this.isBoat() ){			//（小船）
        return $dataSystem.boat;
    }else if( this.isShip() ){		//（大船）
        return $dataSystem.ship;
    }else if( this.isAirship() ){	//（飞艇）
        return $dataSystem.airship;
    }else{
        return null;
    }
};
//==============================
// * 3B数据库 - 初始化
//
//			说明：	> 该函数只在创建$gameMap时初始化，并且只初始化一次。
//==============================
Game_Vehicle.prototype.loadSystemSettings = function(){
    var vehicle = this.vehicle();
    this._mapId = vehicle.startMapId;
    this.setPosition(vehicle.startX, vehicle.startY);
    this.setImage(vehicle.characterName, vehicle.characterIndex);
};


//==============================
// * 3C乘坐 - 初始化朝向
//
//			说明：	> 载具默认都朝向 正左。
//==============================
Game_Vehicle.prototype.resetDirection = function(){
    this.setDirection(4);
};
//==============================
// * 3C乘坐 - 初始化移动速度
//
//			说明：	> 该函数只在创建$gameMap时初始化，并且只初始化一次。
//==============================
Game_Vehicle.prototype.initMoveSpeed = function(){
    if( this.isBoat() ){			//（小船）
        this.setMoveSpeed(4);
    }else if( this.isShip() ){		//（大船）
        this.setMoveSpeed(5);
    }else if( this.isAirship() ){	//（飞艇）
        this.setMoveSpeed(6);
    }
};
//==============================
// * 3C乘坐 - 执行上载具
//==============================
Game_Vehicle.prototype.getOn = function(){
    this._driving = true;
    this.setWalkAnime(true);
    this.setStepAnime(true);
    $gameSystem.saveWalkingBgm();
    this.playBgm();
};
//==============================
// * 3C乘坐 - 执行下载具
//==============================
Game_Vehicle.prototype.getOff = function(){
    this._driving = false;
    this.setWalkAnime(false);
    this.setStepAnime(false);
    this.resetDirection();
    $gameSystem.replayWalkingBgm();
};
//==============================
// * 3C乘坐 - 是否可以下载具
//==============================
Game_Vehicle.prototype.isLandOk = function( x, y, d ){
	
	// > 飞艇情况
    if( this.isAirship() ){
        if( !$gameMap.isAirshipLandOk(x, y) ){
            return false;
        }
        if( $gameMap.eventsXy(x, y).length > 0 ){
            return false;
        }
		
	// > 小船/大船情况
    }else{
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if( !$gameMap.isValid(x2, y2) ){
            return false;
        }
        if( !$gameMap.isPassable(x2, y2, this.reverseDir(d)) ){
            return false;
        }
        if( this.isCollidedWithCharacters(x2, y2) ){
            return false;
        }
    }
    return true;
};


//==============================
// * 3D飞艇 - 海拔 - 最大海拔
//==============================
Game_Vehicle.prototype.maxAltitude = function(){ return 48; };
//==============================
// * 3D飞艇 - 海拔 - 是否已降落
//==============================
Game_Vehicle.prototype.isLowest = function(){ return this._altitude <= 0; };
//==============================
// * 3D飞艇 - 海拔 - 是否已起飞
//==============================
Game_Vehicle.prototype.isHighest = function(){ return this._altitude >= this.maxAltitude(); };
//==============================
// * 3D飞艇 - 帧刷新
//==============================
Game_Vehicle.prototype.updateAirship = function(){
    this.updateAirshipAltitude();
    this.setStepAnime(this.isHighest());
    this.setPriorityType(this.isLowest() ? 0 : 2);
};
//==============================
// * 3D飞艇 - 帧刷新 海拔
//==============================
Game_Vehicle.prototype.updateAirshipAltitude = function(){
    if( this._driving && !this.isHighest() ){
        this._altitude++;
    }
    if( !this._driving && !this.isLowest() ){
        this._altitude--;
    }
};
//==============================
// * 3D飞艇 - 是否可以起飞
//
//			说明：	> 该函数没有被使用。
//==============================
Game_Vehicle.prototype.isTakeoffOk = function(){
    return $gamePlayer.areFollowersGathered();
};

//==============================
// * 3E飞艇阴影 - A坐标 - 该物体的 镜头像素位置Y（继承）
//==============================
Game_Vehicle.prototype.screenY = function(){
    return Game_Character.prototype.screenY.call(this) - this._altitude;
};
//==============================
// * 3E飞艇阴影 - 阴影的 镜头像素位置X
//==============================
Game_Vehicle.prototype.shadowX = function(){
    return this.screenX();
};
//==============================
// * 3E飞艇阴影 - 阴影的 镜头像素位置Y
//==============================
Game_Vehicle.prototype.shadowY = function(){
    return this.screenY() + this._altitude;
};
//==============================
// * 3E飞艇阴影 - 阴影的 透明度
//==============================
Game_Vehicle.prototype.shadowOpacity = function(){
    return 255 * this._altitude / this.maxAltitude();
};



//=============================================================================
// ** 事件【Game_Event】
//			
//			实例：	> $gameMap.events()
//			索引：	event
//			来源：	继承于Game_Character
//			应用：	> 事件类，被大量事件处理插件继承
//					> 在$gameMap中被控制update刷新
//
//			作用域：	地图界面
//			主功能：	> 事件页，事件页切换
//						> 并行执行指令		
//			子功能：
//						->继承 物体
//						->E可通行（继承）
//						->3A数据库
//							->事件数据信息
//							->当前事件页数据
//							->当前事件页指令列表
//						->3B自主移动（_moveType）
//							> 随机
//							> 接近（玩家）
//							> 自定义
//						->3C锁定朝向（_locked）
//						->3D事件页（_pageIndex）
//							->销毁（_erased）
//							->换页
//								->条件
//								->清除事件页
//								->设置事件页内容
//							->行走图
//								->行走图朝向
//								->行走图帧数（作为初始帧）
//						->3E触发事件
//							->当前管理的触发类型
//								> 2事件接触
//								> 3自动执行
//								> 4并行处理
//							->触发
//								->开始事件指令
//								->开始标记（_starting）
//							->触发类型（_trigger）
//			
//			说明：	> 留意 玩家-3G触发事件 与 事件-3E触发事件 的概念和函数。
//=============================================================================
//==============================
// * 事件 - 定义
//==============================
function Game_Event(){
    this.initialize.apply(this, arguments);
}
Game_Event.prototype = Object.create(Game_Character.prototype);
Game_Event.prototype.constructor = Game_Event;
//==============================
// * 事件 - 初始化
//==============================
Game_Event.prototype.initialize = function( mapId, eventId ){
    Game_Character.prototype.initialize.call(this);
    this._mapId = mapId;							//3A数据库 - 所在地图id
    this._eventId = eventId;						//3A数据库 - 事件id
	
	// > A坐标 - 坐标初始化
    this.locate(this.event().x, this.event().y);	//（根据$data数据库设置坐标）
	
	// > 3D事件页 - 刷新事件页
    this.refresh();
};
//==============================
// * 事件 - 初始化属性
//==============================
Game_Event.prototype.initMembers = function(){
    Game_Character.prototype.initMembers.call(this);
	
    this._moveType = 0;					//3B自主移动 - 类型
	
    this._locked = false;				//3C锁定朝向 - 锁定标记
    this._prelockDirection = 0;			//3C锁定朝向 - 锁定的朝向
	
    this._erased = false;				//3D事件页 - 销毁标记
    this._pageIndex = -2;				//3D事件页 - 当前事件页
    this._originalPattern = 1;			//3D事件页 - 行走图帧数
    this._originalDirection = 2;		//3D事件页 - 行走图朝向
	
    this._trigger = 0;					//3E触发事件 - 触发条件（0确定键 1玩家接触 2事件接触 3自动执行 4并行处理）
    this._starting = false;				//3E触发事件 - 执行状态
};
//==============================
// * 事件 - 帧刷新
//==============================
Game_Event.prototype.update = function(){
    Game_Character.prototype.update.call(this);
    this.checkEventTriggerAuto();		//帧刷新 - 3E触发事件 - 自动执行
    this.updateParallel();				//帧刷新 - 3E触发事件 - 并行处理
};


//==============================
// * E可通行 - 判断 - 物体碰撞（继承）
//==============================
Game_Event.prototype.isCollidedWithCharacters = function( x, y ){
    return (Game_Character.prototype.isCollidedWithCharacters.call(this, x, y) ||
            this.isCollidedWithPlayerCharacters(x, y));
};
//==============================
// * E可通行 - 判断 - 物体碰撞（继承，与事件）
//==============================
Game_Event.prototype.isCollidedWithEvents = function( x, y ){
    var events = $gameMap.eventsXyNt(x, y);
    return events.length > 0;
};
//==============================
// * E可通行 - 判断 - 物体碰撞（与玩家）
//
//			说明：	> 载具的碰撞也基于此函数，只不过飞艇载具在上方，不会碰撞到。
//==============================
Game_Event.prototype.isCollidedWithPlayerCharacters = function( x, y ){
    return this.isNormalPriority() && $gamePlayer.isCollided(x, y);
};


//==============================
// * 3A数据库 - 访问器
//==============================
Game_Event.prototype.eventId = function(){ return this._eventId; };
//==============================
// * 3A数据库 - 事件数据信息
//==============================
Game_Event.prototype.event = function(){ return $dataMap.events[this._eventId]; };
//==============================
// * 3A数据库 - 当前事件页数据
//==============================
Game_Event.prototype.page = function(){ return this.event().pages[this._pageIndex]; };
//==============================
// * 3A数据库 - 当前事件页指令列表
//==============================
Game_Event.prototype.list = function(){ return this.page().list; };


//==============================
// * 3B自主移动 - D动作 - 帧刷新 静止（继承）
//==============================
Game_Event.prototype.updateStop = function(){
    if( this._locked ){
        this.resetStopCount();
    }
    Game_Character.prototype.updateStop.call(this);
    if( !this.isMoveRouteForcing() ){
        this.updateSelfMovement();
    }
};
//==============================
// * 3B自主移动 - 帧刷新
//==============================
Game_Event.prototype.updateSelfMovement = function(){
    if( !this._locked && this.isNearTheScreen() &&
            this.checkStop(this.stopCountThreshold()) ){
        switch( this._moveType ){
        case 1:
            this.moveTypeRandom();			//类型 - 帧刷新 随机
            break;
        case 2:
            this.moveTypeTowardPlayer();	//类型 - 帧刷新 接近（玩家）
            break;
        case 3:
            this.moveTypeCustom();			//类型 - 帧刷新 自定义移动路线
            break;
        }
    }
};
//==============================
// * 3B自主移动 - 移动频率
//
//			说明：	> 此设置只有事件有效，走走停停。
//==============================
Game_Event.prototype.stopCountThreshold = function(){
    return 30 * (5 - this.moveFrequency());
};
//==============================
// * 3B自主移动 - 类型 - 随机
//==============================
Game_Event.prototype.moveTypeRandom = function(){
    switch( Math.randomInt(6) ){
    case 0: case 1:
        this.moveRandom();
        break;
    case 2: case 3: case 4:
        this.moveForward();
        break;
    case 5:
        this.resetStopCount();
        break;
    }
};
//==============================
// * 3B自主移动 - 类型 - 接近（玩家）
//==============================
Game_Event.prototype.moveTypeTowardPlayer = function(){
    if( this.isNearThePlayer() ){
        switch( Math.randomInt(6) ){
        case 0: case 1: case 2: case 3:
            this.moveTowardPlayer();
            break;
        case 4:
            this.moveRandom();
            break;
        case 5:
            this.moveForward();
            break;
        }
    }else{
        this.moveRandom();
    }
};
//==============================
// * 3B自主移动 - 类型 - 接近（玩家） - 判断玩家距离
//==============================
Game_Event.prototype.isNearThePlayer = function(){
    var sx = Math.abs(this.deltaXFrom($gamePlayer.x));
    var sy = Math.abs(this.deltaYFrom($gamePlayer.y));
    return sx + sy < 20;
};
//==============================
// * 3B自主移动 - 类型 - 帧刷新 自定义移动路线
//==============================
Game_Event.prototype.moveTypeCustom = function(){
    this.updateRoutineMove();
};


//==============================
// * 3C锁定朝向 - 锁定
//
//			说明：	> 锁定朝向的功能，是指发生 3E触发事件 时，事件会保持面向玩家。
//					  用于事件朝着你对话的功能。
//==============================
Game_Event.prototype.lock = function(){
    if( !this._locked ){
        this._prelockDirection = this.direction();
        this.turnTowardPlayer();
        this._locked = true;
    }
};
//==============================
// * 3C锁定朝向 - 解锁
//==============================
Game_Event.prototype.unlock = function(){
    if( this._locked ){
        this._locked = false;
        this.setDirection(this._prelockDirection);
    }
};
//==============================
// * 3C锁定朝向 - A坐标 - 坐标初始化（继承）
//==============================
Game_Event.prototype.locate = function( x, y ){
    Game_Character.prototype.locate.call(this, x, y);
    this._prelockDirection = 0;
};
//==============================
// * 3C锁定朝向 - 2B强制路线 - 强制执行移动路线（继承）
//==============================
Game_Event.prototype.forceMoveRoute = function( moveRoute ){
    Game_Character.prototype.forceMoveRoute.call(this, moveRoute);
    this._prelockDirection = 0;
};


//==============================
// * 3D事件页 - 销毁（开放函数）
//
//			说明：	> 销毁后，事件和事件贴图 仍然存在；只是不执行事件页，贴图被隐藏了而已。
//==============================
Game_Event.prototype.erase = function(){
    this._erased = true;
    this.refresh();
};
//==============================
// * 3D事件页 - 刷新（基函数）
//
//			说明：	> 注意，父类没有该函数，这里是单独建立的函数。
//==============================
Game_Event.prototype.refresh = function(){
    var newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    if( this._pageIndex !== newPageIndex ){
        this._pageIndex = newPageIndex;
        this.setupPage();
    }
};

//==============================
// * 3D事件页 - 换页 - 遍历检查
//==============================
Game_Event.prototype.findProperPageIndex = function(){
    var pages = this.event().pages;
    for( var i = pages.length - 1; i >= 0; i-- ){
        var page = pages[i];
        if( this.meetsConditions(page) ){
            return i;
        }
    }
    return -1;
};
//==============================
// * 3D事件页 - 换页 - 条件
//==============================
Game_Event.prototype.meetsConditions = function( page ){
    var c = page.conditions;
	
	// > 条件 - 开关1
    if( c.switch1Valid ){
        if( !$gameSwitches.value(c.switch1Id) ){ return false; }
    }
	// > 条件 - 开关2
    if( c.switch2Valid ){
        if( !$gameSwitches.value(c.switch2Id) ){ return false; }
    }
	// > 条件 - 变量
    if( c.variableValid ){
        if( $gameVariables.value(c.variableId) < c.variableValue ){ return false; }
    }
	// > 条件 - 独立开关
    if( c.selfSwitchValid ){
        var key = [this._mapId, this._eventId, c.selfSwitchCh];
        if( $gameSelfSwitches.value(key) !== true ){ return false; }
    }
	// > 条件 - 物品
    if( c.itemValid ){
        var item = $dataItems[c.itemId];
        if( !$gameParty.hasItem(item) ){ return false; }
    }
	// > 条件 - 角色
    if( c.actorValid ){
        var actor = $gameActors.actor(c.actorId);
        if( !$gameParty.members().contains(actor) ){ return false; }
    }
    return true;
};
//==============================
// * 3D事件页 - 换页 - 执行换页
//==============================
Game_Event.prototype.setupPage = function(){
    if( this._pageIndex >= 0 ){
        this.setupPageSettings();		//设置事件页内容
    }else{
        this.clearPageSettings();		//清除事件页
    }
    this.refreshBushDepth();			//
    this.clearStartingFlag();			//去掉_starting运行标志
    this.checkEventTriggerAuto();		//3E触发事件 - 自动执行（事件页切换后立即执行）
};

//==============================
// * 3D事件页 - 换页 - 清除事件页
//==============================
Game_Event.prototype.clearPageSettings = function(){
    this.setImage('', 0);				//清理行走图
    this._moveType = 0;					//清理自主移动
    this._trigger = null;				//清理触发类型
    this._interpreter = null;			//清理并行处理的解释器
    this.setThrough(true);				//设置穿透
};
//==============================
// * 3D事件页 - 换页 - 设置事件页内容
//==============================
Game_Event.prototype.setupPageSettings = function(){
    var page = this.page();
	
	// > F行走图 - 设置行走图
    var image = page.image;
    if( image.tileId > 0 ){
        this.setTileImage(image.tileId);	//（图块行走图）
    }else{
        this.setImage(image.characterName, image.characterIndex);
    }
	// > F行走图 - 刷新数据 行走图朝向
    if( this._originalDirection !== image.direction ){
        this._originalDirection = image.direction;
        this._prelockDirection = 0;
        this.setDirectionFix(false);
        this.setDirection(image.direction);
    }
	// > F行走图 - 刷新数据 行走图帧数（作为初始帧）
    if( this._originalPattern !== image.pattern ){
        this._originalPattern = image.pattern;
        this.setPattern(image.pattern);
    }
	
    this.setMoveSpeed(page.moveSpeed);				//D动作 - 移动速度
    this.setMoveFrequency(page.moveFrequency);		//D动作 - 移动频率
	
    this.setPriorityType(page.priorityType);		//E可通行 - 优先级
	
    this.setWalkAnime(page.walkAnime);				//C勾选设置 - 步行动画
    this.setStepAnime(page.stepAnime);				//C勾选设置 - 踏步动画
    this.setDirectionFix(page.directionFix);		//C勾选设置 - 固定朝向
    this.setThrough(page.through);					//C勾选设置 - 穿透
													//C勾选设置 - 是否透明（移动路线中控制）
	
    this.setMoveRoute(page.moveRoute);				//3B自主移动 - 设置自主移动
    this._moveType = page.moveType;					//3B自主移动 - 设置自主移动类型
    this._trigger = page.trigger;					//3B自主移动 - 触发类型
	
	// > 3E触发事件 - 并行处理的解释器初始化
    if( this._trigger === 4 ){	
        this._interpreter = new Game_Interpreter();
    }else{
        this._interpreter = null;	//（非并行触发，则关闭事件的解释器）
    }
};

//==============================
// * 3D事件页 - F行走图 - 判断初始帧（继承）
//
//			说明：	> 以事件页配置的 行走图帧数 为准。
//==============================
Game_Event.prototype.isOriginalPattern = function(){
    return this.pattern() === this._originalPattern;
};
//==============================
// * 3D事件页 - F行走图 - 恢复初始帧（继承）
//==============================
Game_Event.prototype.resetPattern = function(){
    this.setPattern(this._originalPattern);
};


//==============================
// * 3E触发事件 - 访问器
//==============================
Game_Event.prototype.isStarting = function(){ return this._starting; };
Game_Event.prototype.clearStartingFlag = function(){ this._starting = false; };
//==============================
// * 3E触发事件 - 开始事件指令（绑定start标记）
//==============================
Game_Event.prototype.start = function(){
    var list = this.list();
    if( list && list.length > 1 ){
        this._starting = true;
		
		// > 如果为接触触发，锁定朝向
        if( this.isTriggerIn([0,1,2]) ){
            this.lock();
        }
    }
};
//==============================
// * 3E触发事件 - 触发类型 判断
//==============================
Game_Event.prototype.isTriggerIn = function( triggers ){
    return triggers.contains(this._trigger);
};
//==============================
// * 3E触发事件 - 帧刷新 - 自动执行
//
//			说明：	> 常规设计流程中，如果没有切换事件页，则会死循环执行当前事件页内容。
//					> 除了帧刷新执行，换页后也会立即执行该函数，防止帧刷新跳1帧问题。
//==============================
Game_Event.prototype.checkEventTriggerAuto = function(){
    if( this._trigger === 3 ){
        this.start();
    }
};
//==============================
// * 3E触发事件 - 帧刷新 - 并行处理
//==============================
Game_Event.prototype.updateParallel = function(){
    if( this._interpreter ){
        if( !this._interpreter.isRunning() ){
            this._interpreter.setup(this.list(), this._eventId);
        }
        this._interpreter.update();
    }
};
//==============================
// * 3E触发事件『允许操作玩家触发』 - D动作 - 接触触发（继承）
//
//			说明：	> 此处为事件激活 触发条件-2事件接触 的功能，其他触发见 玩家-3G触发事件。
//==============================
Game_Event.prototype.checkEventTriggerTouch = function( x, y ){
    if( !$gameMap.isEventRunning() ){
        if( this._trigger === 2 && $gamePlayer.pos(x, y) ){
            if( !this.isJumping() && this.isNormalPriority() ){
                this.start();
            }
        }
    }
};




//=============================================================================
// ** 事件指令解释器【Game_Interpreter】
//			
//			索引：	interpreter
//			来源：	无（独立数据）
//			实例：	$gameMap._interpreter
//					$gameTroop._interpreter
//			应用：	所有插件的事件指令执行的入口。
//					
//			主功能：	> 解析并执行data中的 list 指令序列
//						> 提供 插件指令 功能
//			子功能：
//						->A指令序列
//							->运行指令
//							->加入公共事件的指令序列
//							->分支
//						->B子类嵌套
//							->嵌套深度
//						->C死循环检查
//							->当前人物
//							->当前地图id
//							->当前事件id
//						->D等待
//							->限时帧数等待
//							->不限时类型等待
//						->E地图界面函数（这里存的都为临时对象）
//						->F战斗界面函数
//						->H指令私有函数
//						->I指令
//							->指令集
//							->图像预加载
//						
//			说明：	> 解释器的部分状态有点绕，这里梳理一下。
//						是否正在运行：指 A指令序列 的 指令列表 是否为空，非空则表示正在运行。
//						是否正在等待：指 A指令序列 不执行指令，D等待 的帧刷新 一直返回true。
//						循环执行指令：指解释器帧刷新中，直接使用了 while 死循环，确保指令列表在 不等待 的情况下，在一帧内全部执行完。
//=============================================================================
//==============================
// * 解释器 - 定义
//==============================
function Game_Interpreter(){
    this.initialize.apply(this, arguments);
}
//==============================
// * 解释器 - 初始化
//==============================
Game_Interpreter.prototype.initialize = function( depth ){
    this._depth = depth || 0;		//B子类嵌套 - 嵌套深度
    this.checkOverflow();			//B子类嵌套 - 嵌套检查
    this._childInterpreter = null;	//B子类嵌套 - 子类对象
	
    this._frameCount = 0;			//C死循环检查 - 游戏帧数
    this._freezeChecker = 0;		//C死循环检查 - 持续时间
	
    this._waitCount = 0;			//D等待 - 剩余等待帧数
    this._waitMode = '';			//D等待 - 等待类型
	
    this._character = null;			//E地图界面函数 - 当前物体（事件/玩家/载具）
    this._mapId = 0;				//E地图界面函数 - 当前地图id
    this._eventId = 0;				//E地图界面函数 - 当前事件id
	
    this._list = null;				//A指令序列 - 序列
    this._index = 0;				//A指令序列 - 当前位置
    this._comments = '';			//A指令序列 - 当前注释
    this._branch = {};				//A指令序列 - 分支
    this._indent = 0;				//A指令序列 - 分支缩进值（缩进影响分支结束位置）
    this._params = [];				//A指令序列 - 当前参数
	
    this.clear();					//（重置数据）
};
//==============================
// * 解释器 - 帧刷新
//
//			说明：	> 帧刷新中加了while，作用为 "当前帧执行所有不需要等待的指令"。
//				  	  下列函数中：
//						返回true  跳出循环，表示结束当前帧，进入下一帧；
//						返回false 继续循环，表示继续当前帧的下一个指令。
//==============================
Game_Interpreter.prototype.update = function(){
    while( this.isRunning() ){
		
		// > 帧刷新（执行多次） - B子类嵌套
        if( this.updateChild() ){ break; }
		
		// > 帧刷新（执行多次） - D等待
        if( this.updateWait() ){ break; }
		
		// > 帧刷新（执行多次） - 场景变换时，跳出循环（阻塞后一步的事件指令）
        if( SceneManager.isSceneChanging() ){ break; }
		
		// > 帧刷新（执行多次） - A指令序列
        if( !this.executeCommand() ){ break; }
		
		// > 帧刷新（执行多次） - C死循环检查
        if( this.checkFreeze() ){ break; }
    }
};
//==============================
// * 解释器 - 重置数据
//==============================
Game_Interpreter.prototype.clear = function(){
    this._childInterpreter = null;	//B子类嵌套 - 子类对象
	
    this._waitCount = 0;			//D等待 - 剩余等待帧数
    this._waitMode = '';			//D等待 - 等待类型
	
    this._character = null;			//E地图界面函数 - 当前物体（事件/玩家/载具）
    this._mapId = 0;				//E地图界面函数 - 当前地图id
    this._eventId = 0;				//E地图界面函数 - 当前事件id
	
    this._list = null;				//A指令序列 - 序列
    this._index = 0;				//A指令序列 - 当前位置
    this._comments = '';			//A指令序列 - 当前注释
};


//==============================
// * A指令序列 - 设置指令队列
//
//			参数：	> list 数组
//					> eventId 数字
//			返回：	> 无
//
//			说明：	> 所有 new Game_Interpreter() 的位置，都需要执行此函数。
//==============================
Game_Interpreter.prototype.setup = function( list, eventId ){
    this.clear();							//（重置数据）
    
	this._list = list;						//A指令序列 - 序列
	
    Game_Interpreter.requestImages(list);	//I指令 - 图像预加载
	
    this._mapId = $gameMap.mapId();			//E地图界面函数 - 当前地图id
    this._eventId = eventId || 0;			//E地图界面函数 - 当前事件id
};
//==============================
// * A指令序列 - 帧刷新 执行指令（执行多次）
//
//			参数：	> 无
//			返回：	> 布尔 （返回true 跳出循环进入下一帧，返回false 继续执行指令）
//
//			说明：	> 执行的指令来自于游戏编辑器的 函数编号(code)。
//					  比如 data 中有 {"code":101,"indent":0,"parameters":["",0,0,1]} ，
//					  表示执行函数 "I指令 - 【信息 > 显示文字】"。
//					> 除了函数，还有特殊占位符 "code":0、"code":411、"code":412 ；
//					  这些编号是给编辑器自己读取显示用的，在这里并不是执行用函数。
//==============================
Game_Interpreter.prototype.executeCommand = function(){
    var command = this.currentCommand();				//（获取当前指令）
    if( command ){
        this._params = command.parameters;
        this._indent = command.indent;
        var methodName = 'command' + command.code;		//（拼接函数名）
        if( typeof this[methodName] === 'function' ){
			
			// > 调用对应的函数
            if( !this[methodName]() ){					//	执行的【指令函数command000】返回true，表示继续执行下一条指令。
                return false;							//	执行的【指令函数command000】返回false，表示进入下一帧。
            }
        }
        this._index++;
    }else{
        this.terminate();								//（终止运行）
    }
    return true;
};
//==============================
// * A指令序列 - 获取当前指令
//==============================
Game_Interpreter.prototype.currentCommand = function(){
    return this._list[this._index];
};
//==============================
// * A指令序列 - 终止运行
//==============================
Game_Interpreter.prototype.terminate = function(){
    this._list = null;
    this._comments = '';
};
//==============================
// * A指令序列 - 是否正在运行（开放函数）
//==============================
Game_Interpreter.prototype.isRunning = function(){
    return !!this._list;
};

//==============================
// * A指令序列 - 获取下一条指令的 函数编号(code)
//
//			说明：	> 该函数转用于功能 I指令 。
//==============================
Game_Interpreter.prototype.nextEventCode = function(){
    var command = this._list[this._index + 1];
    if( command ){
        return command.code;
    }else{
        return 0;
    }
};
//==============================
// * A指令序列 - 跳过当前分支
//
//			说明：	> 该函数转用于功能 I指令 。
//==============================
Game_Interpreter.prototype.skipBranch = function(){
    while( this._list[this._index + 1].indent > this._indent ){
        this._index++;
    }
};
//==============================
// * A指令序列 - 将 队列中的公共事件 的指令列表加入运行（开放函数）
//
//			说明：	> 该函数由外部函数控制，执行公共事件的指令序列。
//==============================
Game_Interpreter.prototype.setupReservedCommonEvent = function(){
    if( $gameTemp.isCommonEventReserved() ){
        this.setup($gameTemp.reservedCommonEvent().list);
        $gameTemp.clearCommonEvent();
        return true;
    }else{
        return false;
    }
};


//==============================
// * B子类嵌套 - 设置子类
//
//			说明：	> 只有事件指令 command117 调用。
//					> 每次子类嵌套都是一次 输入/输出 栈。与不断调用子函数原理一样。
//==============================
Game_Interpreter.prototype.setupChild = function( list, eventId ){
    this._childInterpreter = new Game_Interpreter(this._depth + 1);
    this._childInterpreter.setup(list, eventId);
};
//==============================
// * B子类嵌套 - 帧刷新
//
//			参数：	> 无
//			返回：	> 布尔 （返回true 跳出循环进入下一帧，返回false 继续执行指令）
//==============================
Game_Interpreter.prototype.updateChild = function(){
    if( this._childInterpreter ){
        this._childInterpreter.update();
        if( this._childInterpreter.isRunning() ){
            return true;
        }else{
            this._childInterpreter = null;
        }
    }
    return false;
};
//==============================
// * B子类嵌套 - 嵌套检查
//==============================
Game_Interpreter.prototype.checkOverflow = function(){
    if( this._depth >= 100 ){		//（嵌套栈 的长度 超过100时，报错）
        throw new Error('Common event calls exceeded the limit');
    }
};


//==============================
// * C死循环检查 - 帧刷新
//
//			参数：	> 无
//			返回：	> 布尔 （返回true 跳出循环进入下一帧，返回false 继续执行指令）
//
//			说明：	> 解释器如果出现了死循环，则 帧刷新 无法进入下一帧，从而引起游戏卡顿。
//==============================
Game_Interpreter.prototype.checkFreeze = function(){
	
	// > 未卡帧时，刷新统计
    if( this._frameCount !== Graphics.frameCount ){
        this._frameCount = Graphics.frameCount;
        this._freezeChecker = 0;
    }
	
	// > 卡帧执行时，执行次数超过一定值后，跳出循环（大概0.1秒）
    if( this._freezeChecker++ >= 100000 ){
        return true;
    }else{
        return false;
    }
};


//==============================
// * D等待 - 帧刷新
//
//			参数：	> 无
//			返回：	> 布尔 （返回true 跳出循环进入下一帧，返回false 继续执行指令）
//
//			说明：	> 只要有一个条件为true，则表示 等待中 。
//					  等待中 就是指不执行指令，持续等待下一帧。
//					> 并行事件中，如果先切换事件页，然后等待1帧以上，则等待指令后面的指令都【不会】被执行。
//					  这是因为切换事件页之后，当前帧会继续执行指令内容。而下一帧之后，切换页的新指令都会刷新执行对了，那么之前指令就都失效了。
//==============================
Game_Interpreter.prototype.updateWait = function(){
    return this.updateWaitCount() || this.updateWaitMode();
};
//==============================
// * D等待 - 限时帧数等待
//
//			说明：	> 等待时通过计数器_waitCount，来判断当前是否等待。
//==============================
Game_Interpreter.prototype.updateWaitCount = function(){
    if( this._waitCount > 0 ){
        this._waitCount--;
        return true;
    }
    return false;
};
//==============================
// * D等待 - 不限时类型等待
//
//			说明：	> 此等待为不限时等待，只要有一个返回true，则持续等待。
//==============================
Game_Interpreter.prototype.updateWaitMode = function(){
    var waiting = false;
    switch( this._waitMode ){
		case 'message':
			waiting = $gameMessage.isBusy();
			break;
		case 'transfer':
			waiting = $gamePlayer.isTransferring();
			break;
		case 'scroll':
			waiting = $gameMap.isScrolling();
			break;
		case 'route':		//（正在强制路线，物体-2B强制路线）
			waiting = this._character.isMoveRouteForcing();
			break;
		case 'animation':	//（正在播放动画，物体-G动画）
			waiting = this._character.isAnimationPlaying();
			break;
		case 'balloon':		//（正在播放气泡，物体-H气泡）
			waiting = this._character.isBalloonPlaying();
			break;
		case 'gather':		//（正在集合玩家队员，玩家-3F玩家队员）
			waiting = $gamePlayer.areFollowersGathering();
			break;
		case 'action':
			waiting = BattleManager.isActionForced();
			break;
		case 'video':
			waiting = Graphics.isVideoPlaying();
			break;
		case 'image':
			waiting = !ImageManager.isReady();
			break;
    }
    if( !waiting ){
        this._waitMode = '';
    }
    return waiting;
};
//==============================
// * D等待 - 设置等待类型
//==============================
Game_Interpreter.prototype.setWaitMode = function( waitMode ){ this._waitMode = waitMode; };
//==============================
// * D等待 - 设置等待时间
//==============================
Game_Interpreter.prototype.wait = function( duration ){ this._waitCount = duration; };


//==============================
// * E地图界面函数 - 当前事件id
//==============================
Game_Interpreter.prototype.eventId = function(){ return this._eventId; };
//==============================
// * E地图界面函数 - 是否位于当前地图
//==============================
Game_Interpreter.prototype.isOnCurrentMap = function(){ return this._mapId === $gameMap.mapId(); };
//==============================
// * E地图界面函数 - 获取 玩家/事件 对象
//==============================
Game_Interpreter.prototype.character = function( param ){
    if( $gameParty.inBattle() ){
        return null;
    }else if( param < 0 ){
        return $gamePlayer;
    }else if( this.isOnCurrentMap() ){
        return $gameMap.event(param > 0 ? param : this._eventId);
    }else{
        return null;
    }
};


//==============================
// * F战斗界面函数 - 获取战斗中第n个敌人
//==============================
Game_Interpreter.prototype.iterateEnemyIndex = function( param, callback ){
    if( param < 0 ){
        $gameTroop.members().forEach(callback);
    }else{
        var enemy = $gameTroop.members()[param];
        if( enemy ){
            callback(enemy);
        }
    }
};
//==============================
// * F战斗界面函数 - 获取战斗中第n个战斗单位（角色/敌人）
//==============================
Game_Interpreter.prototype.iterateBattler = function( param1, param2, callback ){
    if( $gameParty.inBattle() ){
        if( param1 === 0 ){
            this.iterateEnemyIndex(param2, callback);
        }else{
            this.iterateActorId(param2, callback);		//（获取id为n的角色）
        }
    }
};
//==============================
// * F战斗界面函数 - 获取战斗中第n个角色（未被使用）
//==============================
Game_Interpreter.prototype.iterateActorIndex = function( param, callback ){
    if( param < 0 ){
        $gameParty.members().forEach(callback);
    }else{
        var actor = $gameParty.members()[param];
        if( actor ){
            callback(actor);	//（回调函数）
        }
    }
};


//==============================
// * H指令私有函数 - 变量值操作
//==============================
Game_Interpreter.prototype.operateValue = function( operation, operandType, operand ){
    var value = operandType === 0 ? operand : $gameVariables.value(operand);
    return operation === 0 ? value : -value;
};
//==============================
// * H指令私有函数 - 修改生命值
//
//			说明：	> 该函数在 地图界面/战斗界面 都能执行。
//==============================
Game_Interpreter.prototype.changeHp = function( target, value, allowDeath ){
    if( target.isAlive() ){
        if( !allowDeath && target.hp <= -value ){
            value = 1 - target.hp;
        }
        target.gainHp(value);
        if( target.isDead() ){
            target.performCollapse();
        }
    }
};
//==============================
// * H指令私有函数 - 获取id为n的角色
//
//			说明：	> 该函数在 地图界面/战斗界面 都能执行。
//==============================
Game_Interpreter.prototype.iterateActorId = function( param, callback ){
    if( param === 0 ){
        $gameParty.members().forEach(callback);
    }else{
        var actor = $gameActors.actor(param);
        if( actor ){
            callback(actor);	//（回调函数）
        }
    }
};
//==============================
// * H指令私有函数 - 获取id为n(变量)的角色
//
//			说明：	> 该函数在 地图界面/战斗界面 都能执行。
//==============================
Game_Interpreter.prototype.iterateActorEx = function( param1, param2, callback ){
    if( param1 === 0 ){
        this.iterateActorId(param2, callback);
    }else{
        this.iterateActorId($gameVariables.value(param2), callback);
    }
};


//==============================
// * I指令 - 【信息 > 显示文字】
//==============================
Game_Interpreter.prototype.command101 = function(){
    if( !$gameMessage.isBusy() ){
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
		
        while( this.nextEventCode() === 401 ){  // Text data
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
		
        switch( this.nextEventCode() ){
			case 102:  // 消息选项
				this._index++;
				this.setupChoices(this.currentCommand().parameters);
				break;
			case 103:  // 数字输入
				this._index++;
				this.setupNumInput(this.currentCommand().parameters);
				break;
			case 104:  // 物品选择
				this._index++;
				this.setupItemChoice(this.currentCommand().parameters);
				break;
        }
		
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

//==============================
// * I指令 - 【信息 > 显示选项】
//==============================
Game_Interpreter.prototype.command102 = function(){
    if( !$gameMessage.isBusy() ){
        this.setupChoices(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};
//==============================
// * I指令 - 【信息 > 显示选项】 - 建立选项（私有）
//==============================
Game_Interpreter.prototype.setupChoices = function( params ){
    var choices = params[0].clone();
    var cancelType = params[1];
    var defaultType = params.length > 2 ? params[2] : 0;
    var positionType = params.length > 3 ? params[3] : 2;
    var background = params.length > 4 ? params[4] : 0;
    if( cancelType >= choices.length ){
        cancelType = -2;
    }
    $gameMessage.setChoices(choices, defaultType, cancelType);
    $gameMessage.setChoiceBackground(background);
    $gameMessage.setChoicePositionType(positionType);
    $gameMessage.setChoiceCallback(function( n ){
        this._branch[this._indent] = n;
    }.bind(this));
};
//==============================
// * I指令 - 【信息 > 显示选项】 - "选择 xxx 时"
//==============================
Game_Interpreter.prototype.command402 = function(){
    if( this._branch[this._indent] !== this._params[0] ){
        this.skipBranch();
    }
    return true;
};
//==============================
// * I指令 - 【信息 > 显示选项】 - "当取消(分支)时"
//==============================
Game_Interpreter.prototype.command403 = function(){
    if( this._branch[this._indent] >= 0 ){
        this.skipBranch();
    }
    return true;
};

//==============================
// * I指令 - 【信息 > 数值输入处理】
//==============================
Game_Interpreter.prototype.command103 = function(){
    if( !$gameMessage.isBusy() ){
        this.setupNumInput(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};
//==============================
// * I指令 - 【信息 > 数值输入处理】 - 建立位数数字输入框（私有）
//==============================
Game_Interpreter.prototype.setupNumInput = function( params ){
    $gameMessage.setNumberInput(params[0], params[1]);
};

//==============================
// * I指令 - 【信息 > 物品选择处理】
//==============================
Game_Interpreter.prototype.command104 = function(){
    if( !$gameMessage.isBusy() ){
        this.setupItemChoice(this._params);
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};
//==============================
// * I指令 - 【信息 > 物品选择处理】 - 建立物品选择输入框
//==============================
Game_Interpreter.prototype.setupItemChoice = function( params ){
    $gameMessage.setItemChoice(params[0], params[1] || 2);
};

//==============================
// * I指令 - 【信息 > 显示滚动文字】
//==============================
Game_Interpreter.prototype.command105 = function(){
    if( !$gameMessage.isBusy() ){
        $gameMessage.setScroll(this._params[0], this._params[1]);
        while( this.nextEventCode() === 405 ){
            this._index++;
            $gameMessage.add(this.currentCommand().parameters[0]);
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};


//==============================
// * I指令 - 【流程控制 > 注释】
//==============================
Game_Interpreter.prototype.command108 = function(){
    this._comments = [this._params[0]];
    while( this.nextEventCode() === 408 ){
        this._index++;
        this._comments.push(this.currentCommand().parameters[0]);
    }
    return true;
};
//==============================
// * I指令 - 【流程控制 > 分支条件】
//==============================
Game_Interpreter.prototype.command111 = function(){
	var result = false;
	switch( this._params[0] ){
		case 0:  // Switch
			result = ($gameSwitches.value(this._params[1]) === (this._params[2] === 0));
			break;
		case 1:  // Variable
			var value1 = $gameVariables.value(this._params[1]);
			var value2;
			if( this._params[2] === 0 ){
				value2 = this._params[3];
			}else{
				value2 = $gameVariables.value(this._params[3]);
			}
			switch( this._params[4] ){
				case 0:  // Equal to
					result = (value1 === value2);
					break;
				case 1:  // Greater than or Equal to
					result = (value1 >= value2);
					break;
				case 2:  // Less than or Equal to
					result = (value1 <= value2);
					break;
				case 3:  // Greater than
					result = (value1 > value2);
					break;
				case 4:  // Less than
					result = (value1 < value2);
					break;
				case 5:  // Not Equal to
					result = (value1 !== value2);
					break;
			}
			break;
		case 2:  // Self Switch
			if( this._eventId > 0 ){
				var key = [this._mapId, this._eventId, this._params[1]];
				result = ($gameSelfSwitches.value(key) === (this._params[2] === 0));
			}
			break;
		case 3:  // Timer
			if( $gameTimer.isWorking() ){
				if( this._params[2] === 0 ){
					result = ($gameTimer.seconds() >= this._params[1]);
				}else{
					result = ($gameTimer.seconds() <= this._params[1]);
				}
			}
			break;
		case 4:  // Actor
			var actor = $gameActors.actor(this._params[1]);
			if( actor ){
				var n = this._params[3];
				switch( this._params[2] ){
					case 0:  // In the Party
						result = $gameParty.members().contains(actor);
						break;
					case 1:  // Name
						result = (actor.name() === n);
						break;
					case 2:  // Class
						result = actor.isClass($dataClasses[n]);
						break;
					case 3:  // Skill
						result = actor.hasSkill(n);
						break;
					case 4:  // Weapon
						result = actor.hasWeapon($dataWeapons[n]);
						break;
					case 5:  // Armor
						result = actor.hasArmor($dataArmors[n]);
						break;
					case 6:  // State
						result = actor.isStateAffected(n);
						break;
				}
			}
			break;
		case 5:  // Enemy
			var enemy = $gameTroop.members()[this._params[1]];
			if( enemy ){
				switch( this._params[2] ){
					case 0:  // Appeared
						result = enemy.isAlive();
						break;
					case 1:  // State
						result = enemy.isStateAffected(this._params[3]);
						break;
				}
			}
			break;
		case 6:  // Character
			var character = this.character(this._params[1]);
			if( character ){
				result = (character.direction() === this._params[2]);
			}
			break;
		case 7:  // Gold
			switch( this._params[2] ){
				case 0:  // Greater than or equal to
					result = ($gameParty.gold() >= this._params[1]);
					break;
				case 1:  // Less than or equal to
					result = ($gameParty.gold() <= this._params[1]);
					break;
				case 2:  // Less than
					result = ($gameParty.gold() < this._params[1]);
					break;
			}
			break;
		case 8:  // Item
			result = $gameParty.hasItem($dataItems[this._params[1]]);
			break;
		case 9:  // Weapon
			result = $gameParty.hasItem($dataWeapons[this._params[1]], this._params[2]);
			break;
		case 10:  // Armor
			result = $gameParty.hasItem($dataArmors[this._params[1]], this._params[2]);
			break;
		case 11:  // Button
			result = Input.isPressed(this._params[1]);
			break;
		case 12:  // Script
			result = !!eval(this._params[1]);
			break;
		case 13:  // Vehicle
			result = ($gamePlayer.vehicle() === $gameMap.vehicle(this._params[1]));
			break;
	}
	this._branch[this._indent] = result;
	if( this._branch[this._indent] === false ){
		this.skipBranch();
	}
	return true;
};
//==============================
// * I指令 - 【流程控制 > 分支条件-否则】
//==============================
Game_Interpreter.prototype.command411 = function(){
    if( this._branch[this._indent] !== false ){
        this.skipBranch();
    }
    return true;
};
//==============================
// * I指令 - 【流程控制 > 循环】
//==============================
Game_Interpreter.prototype.command112 = function(){
    return true;
};
//==============================
// * I指令 - 【流程控制 > 循环-重复以上内容】
//==============================
Game_Interpreter.prototype.command413 = function(){
    do {
        this._index--;
    } while( this.currentCommand().indent !== this._indent);
    return true;
};
//==============================
// * I指令 - 【流程控制 > 跳出循环】
//==============================
Game_Interpreter.prototype.command113 = function(){
	var depth = 0;
	while( this._index < this._list.length - 1 ){
		this._index++;
		var command = this.currentCommand();
		
		if( command.code === 112 ){
			depth++;
		}
		
		if( command.code === 413 ){
			if( depth > 0)
				depth--;
			else
				break;
		}
	}
	return true;
};
//==============================
// * I指令 - 【流程控制 > 中止事件处理】
//==============================
Game_Interpreter.prototype.command115 = function(){
    this._index = this._list.length;
    return true;
};
//==============================
// * I指令 - 【流程控制 > 公共事件】
//
//			说明：	> 嵌套执行公共事件。
//==============================
Game_Interpreter.prototype.command117 = function(){
    var commonEvent = $dataCommonEvents[this._params[0]];
    if( commonEvent ){
        var eventId = this.isOnCurrentMap() ? this._eventId : 0;
        this.setupChild(commonEvent.list, eventId);		//设置子解释器
    }
    return true;
};
//==============================
// * I指令 - 【流程控制 > 标签】
//==============================
Game_Interpreter.prototype.command118 = function(){
    return true;
};
//==============================
// * I指令 - 【流程控制 > 转到标签】
//==============================
Game_Interpreter.prototype.command119 = function(){
    var labelName = this._params[0];
    for( var i = 0; i < this._list.length; i++ ){
        var command = this._list[i];
        if( command.code === 118 && command.parameters[0] === labelName ){
            this.jumpTo(i);
            return;
        }
    }
    return true;
};
//==============================
// * I指令 - 【流程控制 > 转到标签】 - 修改指令序列当前位置
//==============================
Game_Interpreter.prototype.jumpTo = function( index ){
    var lastIndex = this._index;
    var startIndex = Math.min(index, lastIndex);
    var endIndex = Math.max(index, lastIndex);
    var indent = this._indent;
    for( var i = startIndex; i <= endIndex; i++ ){
        var newIndent = this._list[i].indent;
        if( newIndent !== indent ){
            this._branch[indent] = null;
            indent = newIndent;
        }
    }
    this._index = index;
};

//==============================
// * I指令 - 【游戏进程 > 开关操作】
//==============================
Game_Interpreter.prototype.command121 = function(){
    for( var i = this._params[0]; i <= this._params[1]; i++ ){
        $gameSwitches.setValue(i, this._params[2] === 0);
    }
    return true;
};
//==============================
// * I指令 - 【游戏进程 > 变量操作】
//==============================
Game_Interpreter.prototype.command122 = function(){
	var value = 0;
	switch( this._params[3] ){ // Operand
		case 0: // Constant
			value = this._params[4];
			break;
		case 1: // Variable
			value = $gameVariables.value(this._params[4]);
			break;
		case 2: // Random
			value = this._params[5] - this._params[4] + 1;
			for( var i = this._params[0]; i <= this._params[1]; i++ ){
				this.operateVariable(i, this._params[2], this._params[4] + Math.randomInt(value));
			}
			return true;
			break;
		case 3: // Game Data
			value = this.gameDataOperand(this._params[4], this._params[5], this._params[6]);
			break;
		case 4: // Script
			value = eval(this._params[4]);
			break;
	}
	for( var i = this._params[0]; i <= this._params[1]; i++ ){
		this.operateVariable(i, this._params[2], value);
	}
	return true;
};
//==============================
// * I指令 - 【游戏进程 > 变量操作】 - 开关的操作
//==============================
Game_Interpreter.prototype.gameDataOperand = function( type, param1, param2 ){
	switch( type ){
		case 0:  // Item
			return $gameParty.numItems($dataItems[param1]);
		case 1:  // Weapon
			return $gameParty.numItems($dataWeapons[param1]);
		case 2:  // Armor
			return $gameParty.numItems($dataArmors[param1]);
		case 3:  // Actor
			var actor = $gameActors.actor(param1);
			if( actor ){
				switch( param2 ){
				case 0:  // Level
					return actor.level;
				case 1:  // EXP
					return actor.currentExp();
				case 2:  // HP
					return actor.hp;
				case 3:  // MP
					return actor.mp;
				default:    // Parameter
					if( param2 >= 4 && param2 <= 11 ){
						return actor.param(param2 - 4);
					}
				}
			}
			break;
		case 4:  // Enemy
			var enemy = $gameTroop.members()[param1];
			if( enemy ){
				switch( param2 ){
				case 0:  // HP
					return enemy.hp;
				case 1:  // MP
					return enemy.mp;
				default:    // Parameter
					if( param2 >= 2 && param2 <= 9 ){
						return enemy.param(param2 - 2);
					}
				}
			}
			break;
		case 5:  // Character
			var character = this.character(param1);
			if( character ){
				switch( param2 ){
				case 0:  // Map X
					return character.x;
				case 1:  // Map Y
					return character.y;
				case 2:  // Direction
					return character.direction();
				case 3:  // Screen X
					return character.screenX();
				case 4:  // Screen Y
					return character.screenY();
				}
			}
			break;
		case 6:  // Party
			actor = $gameParty.members()[param1];
			return actor ? actor.actorId() : 0;
		case 7:  // Other
			switch( param1 ){
			case 0:  // Map ID
				return $gameMap.mapId();
			case 1:  // Party Members
				return $gameParty.size();
			case 2:  // Gold
				return $gameParty.gold();
			case 3:  // Steps
				return $gameParty.steps();
			case 4:  // Play Time
				return $gameSystem.playtime();
			case 5:  // Timer
				return $gameTimer.seconds();
			case 6:  // Save Count
				return $gameSystem.saveCount();
			case 7:  // Battle Count
				return $gameSystem.battleCount();
			case 8:  // Win Count
				return $gameSystem.winCount();
			case 9:  // Escape Count
				return $gameSystem.escapeCount();
			}
			break;
	}
	return 0;
};
//==============================
// * I指令 - 【游戏进程 > 变量操作】 - 变量的操作
//==============================
Game_Interpreter.prototype.operateVariable = function( variableId, operationType, value ){
	try{
		var oldValue = $gameVariables.value(variableId);
		switch( operationType ){
			case 0:  // Set
				$gameVariables.setValue(variableId, oldValue = value);
				break;
			case 1:  // Add
				$gameVariables.setValue(variableId, oldValue + value);
				break;
			case 2:  // Sub
				$gameVariables.setValue(variableId, oldValue - value);
				break;
			case 3:  // Mul
				$gameVariables.setValue(variableId, oldValue * value);
				break;
			case 4:  // Div
				$gameVariables.setValue(variableId, oldValue / value);
				break;
			case 5:  // Mod
				$gameVariables.setValue(variableId, oldValue % value);
				break;
		}
	}catch( e ){
		$gameVariables.setValue(variableId, 0);
	}
};
//==============================
// * I指令 - 【游戏进程 > 独立开关操作】
//==============================
Game_Interpreter.prototype.command123 = function(){
    if( this._eventId > 0 ){
        var key = [this._mapId, this._eventId, this._params[0]];
        $gameSelfSwitches.setValue(key, this._params[1] === 0);
    }
    return true;
};
//==============================
// * I指令 - 【游戏进程 > 计时器操作】
//==============================
Game_Interpreter.prototype.command124 = function(){
    if( this._params[0] === 0 ){  // （开始计时）
        $gameTimer.start(this._params[1] * 60);
    }else{ 				 // （停止计时）
        $gameTimer.stop();
    }
    return true;
};

//==============================
// * I指令 - 【队伍 > 增减金钱】
//==============================
Game_Interpreter.prototype.command125 = function(){
    var value = this.operateValue(this._params[0], this._params[1], this._params[2]);
    $gameParty.gainGold(value);
    return true;
};
//==============================
// * I指令 - 【队伍 > 增减物品】
//==============================
Game_Interpreter.prototype.command126 = function(){
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataItems[this._params[0]], value);
    return true;
};
//==============================
// * I指令 - 【队伍 > 增减武器】
//==============================
Game_Interpreter.prototype.command127 = function(){
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataWeapons[this._params[0]], value, this._params[4]);
    return true;
};
//==============================
// * I指令 - 【队伍 > 增减护甲】
//==============================
Game_Interpreter.prototype.command128 = function(){
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    $gameParty.gainItem($dataArmors[this._params[0]], value, this._params[4]);
    return true;
};
//==============================
// * I指令 - 【队伍 > 队伍管理】
//==============================
Game_Interpreter.prototype.command129 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor ){
        if( this._params[1] === 0 ){  // Add
            if( this._params[2] ){   // Initialize
                $gameActors.actor(this._params[0]).setup(this._params[0]);
            }
            $gameParty.addActor(this._params[0]);
        }else{  // Remove
            $gameParty.removeActor(this._params[0]);
        }
    }
    return true;
};

//==============================
// * I指令 - 【系统设置 > 更改战斗BGM】
//==============================
Game_Interpreter.prototype.command132 = function(){
    $gameSystem.setBattleBgm(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【系统设置 > 更改胜利ME】
//==============================
Game_Interpreter.prototype.command133 = function(){
    $gameSystem.setVictoryMe(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【系统设置 > 更改战败ME】
//==============================
Game_Interpreter.prototype.command139 = function(){
    $gameSystem.setDefeatMe(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【系统设置 > 更改载具BGM】
//==============================
Game_Interpreter.prototype.command140 = function(){
    var vehicle = $gameMap.vehicle(this._params[0]);
    if( vehicle ){
        vehicle.setBgm(this._params[1]);
    }
    return true;
};
//==============================
// * I指令 - 【系统设置 > 启用/禁用存档】
//==============================
Game_Interpreter.prototype.command134 = function(){
    if( this._params[0] === 0 ){
        $gameSystem.disableSave();
    }else{
        $gameSystem.enableSave();
    }
    return true;
};
//==============================
// * I指令 - 【系统设置 > 启用/禁用菜单】
//==============================
Game_Interpreter.prototype.command135 = function(){
    if( this._params[0] === 0 ){
        $gameSystem.disableMenu();
    }else{
        $gameSystem.enableMenu();
    }
    return true;
};
//==============================
// * I指令 - 【系统设置 > 启用/禁用遇敌】
//==============================
Game_Interpreter.prototype.command136 = function(){
    if( this._params[0] === 0 ){
        $gameSystem.disableEncounter();
    }else{
        $gameSystem.enableEncounter();
    }
    $gamePlayer.makeEncounterCount();
    return true;
};
//==============================
// * I指令 - 【系统设置 > 启用/禁用整队】
//==============================
Game_Interpreter.prototype.command137 = function(){
    if( this._params[0] === 0 ){
        $gameSystem.disableFormation();
    }else{
        $gameSystem.enableFormation();
    }
    return true;
};
//==============================
// * I指令 - 【系统设置 > 更改窗口颜色】
//==============================
Game_Interpreter.prototype.command138 = function(){
    $gameSystem.setWindowTone(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【系统设置 > 更改角色图像】
//==============================
Game_Interpreter.prototype.command322 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor ){
        actor.setCharacterImage(this._params[1], this._params[2]);
        actor.setFaceImage(this._params[3], this._params[4]);
        actor.setBattlerImage(this._params[5]);
    }
    $gamePlayer.refresh();
    return true;
};
//==============================
// * I指令 - 【系统设置 > 更改载具图像】
//==============================
Game_Interpreter.prototype.command323 = function(){
    var vehicle = $gameMap.vehicle(this._params[0]);
    if( vehicle ){
        vehicle.setImage(this._params[1], this._params[2]);
    }
    return true;
};

//==============================
// * I指令 - 【移动 > 场所移动】
//==============================
Game_Interpreter.prototype.command201 = function(){
    if( !$gameParty.inBattle() && !$gameMessage.isBusy() ){
        var mapId, x, y;
        if( this._params[0] === 0 ){  // Direct designation
            mapId = this._params[1];
            x = this._params[2];
            y = this._params[3];
        }else{  // Designation with variables
            mapId = $gameVariables.value(this._params[1]);
            x = $gameVariables.value(this._params[2]);
            y = $gameVariables.value(this._params[3]);
        }
        $gamePlayer.reserveTransfer(mapId, x, y, this._params[4], this._params[5]);
        this.setWaitMode('transfer');
        this._index++;
    }
    return false;
};
//==============================
// * I指令 - 【移动 > 设置载具位置】
//==============================
Game_Interpreter.prototype.command202 = function(){
    var mapId, x, y;
    if( this._params[1] === 0 ){  // Direct designation
        mapId = this._params[2];
        x = this._params[3];
        y = this._params[4];
    }else{  // Designation with variables
        mapId = $gameVariables.value(this._params[2]);
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    var vehicle = $gameMap.vehicle(this._params[0]);
    if( vehicle ){
        vehicle.setLocation(mapId, x, y);
    }
    return true;
};
//==============================
// * I指令 - 【移动 > 设置事件位置】
//==============================
Game_Interpreter.prototype.command203 = function(){
    var character = this.character(this._params[0]);
    if( character ){
        if( this._params[1] === 0 ){  // Direct designation
            character.locate(this._params[2], this._params[3]);
        }else if( this._params[1] === 1 ){  // Designation with variables
            var x = $gameVariables.value(this._params[2]);
            var y = $gameVariables.value(this._params[3]);
            character.locate(x, y);
        }else{  // Exchange with another event
            var character2 = this.character(this._params[2]);
            if( character2 ){
                character.swap(character2);
            }
        }
        if( this._params[4] > 0 ){
            character.setDirection(this._params[4]);
        }
    }
    return true;
};
//==============================
// * I指令 - 【移动 > 滚动地图】
//==============================
Game_Interpreter.prototype.command204 = function(){
    if( !$gameParty.inBattle() ){
        if( $gameMap.isScrolling() ){
            this.setWaitMode('scroll');
            return false;
        }
        $gameMap.startScroll(this._params[0], this._params[1], this._params[2]);
    }
    return true;
};
//==============================
// * I指令 - 【移动 > 设置移动路线】
//==============================
Game_Interpreter.prototype.command205 = function(){
    $gameMap.refreshIfNeeded();
    this._character = this.character(this._params[0]);
    if( this._character ){
        this._character.forceMoveRoute(this._params[1]);
        if( this._params[1].wait ){
            this.setWaitMode('route');
        }
    }
    return true;
};
//==============================
// * I指令 - 【移动 > 载具乘降】
//==============================
Game_Interpreter.prototype.command206 = function(){
    $gamePlayer.getOnOffVehicle();
    return true;
};

//==============================
// * I指令 - 【人物 > 更改透明状态】
//
//			说明：	> 修改透明状态的是 玩家 和 玩家队员 。
//==============================
Game_Interpreter.prototype.command211 = function(){
    $gamePlayer.setTransparent(this._params[0] === 0);
    return true;
};
//==============================
// * I指令 - 【人物 > 更改队列行进】
//
//			说明：	> 这里的意思不正确，确切的为：更改队员显示状态。
//==============================
Game_Interpreter.prototype.command216 = function(){
    if( this._params[0] === 0 ){
        $gamePlayer.showFollowers();
    }else{
        $gamePlayer.hideFollowers();
    }
    $gamePlayer.refresh();
    return true;
};
//==============================
// * I指令 - 【人物 > 集合队列成员】
//==============================
Game_Interpreter.prototype.command217 = function(){
    if( !$gameParty.inBattle() ){
        $gamePlayer.gatherFollowers();
        this.setWaitMode('gather');
    }
    return true;
};
//==============================
// * I指令 - 【人物 > 显示动画】
//==============================
Game_Interpreter.prototype.command212 = function(){
    this._character = this.character(this._params[0]);
    if( this._character ){
        this._character.requestAnimation(this._params[1]);
        if( this._params[2] ){
            this.setWaitMode('animation');
        }
    }
    return true;
};
//==============================
// * I指令 - 【人物 > 显示气泡图标】
//==============================
Game_Interpreter.prototype.command213 = function(){
    this._character = this.character(this._params[0]);
    if( this._character ){
        this._character.requestBalloon(this._params[1]);
        if( this._params[2] ){
            this.setWaitMode('balloon');
        }
    }
    return true;
};
//==============================
// * I指令 - 【人物 > 暂时消除事件】
//==============================
Game_Interpreter.prototype.command214 = function(){
    if( this.isOnCurrentMap() && this._eventId > 0 ){
        $gameMap.eraseEvent(this._eventId);
    }
    return true;
};

//==============================
// * I指令 - 【画面 > 淡出画面】
//==============================
Game_Interpreter.prototype.command221 = function(){
    if( !$gameMessage.isBusy() ){	//（屏幕）淡入淡出
        $gameScreen.startFadeOut(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};
//==============================
// * I指令 - 【画面 > 淡入画面】
//==============================
Game_Interpreter.prototype.command222 = function(){
    if( !$gameMessage.isBusy() ){	//（屏幕）淡入淡出
        $gameScreen.startFadeIn(this.fadeSpeed());
        this.wait(this.fadeSpeed());
        this._index++;
    }
    return false;
};
//==============================
// * I指令 - 【画面 > 淡入画面】/【画面 > 淡入画面】 - 持续时间
//==============================
Game_Interpreter.prototype.fadeSpeed = function(){ return 24; };
//==============================
// * I指令 - 【画面 > 更改画面色调】
//==============================
Game_Interpreter.prototype.command223 = function(){
    $gameScreen.startTint(this._params[0], this._params[1]);
    if( this._params[2] ){
        this.wait(this._params[1]);
    }
    return true;
};
//==============================
// * I指令 - 【画面 > 闪烁画面】
//==============================
Game_Interpreter.prototype.command224 = function(){
    $gameScreen.startFlash(this._params[0], this._params[1]);
    if( this._params[2] ){
        this.wait(this._params[1]);
    }
    return true;
};
//==============================
// * I指令 - 【画面 > 震动屏幕】
//==============================
Game_Interpreter.prototype.command225 = function(){
    $gameScreen.startShake(this._params[0], this._params[1], this._params[2]);
    if( this._params[3] ){
        this.wait(this._params[2]);
    }
    return true;
};
//==============================
// * I指令 - 【画面 > 设置天气】
//==============================
Game_Interpreter.prototype.command236 = function(){
    if( !$gameParty.inBattle() ){
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        if( this._params[3] ){
            this.wait(this._params[2]);
        }
    }
    return true;
};

//==============================
// * I指令 - 【计时 > 等待】
//==============================
Game_Interpreter.prototype.command230 = function(){
    this.wait(this._params[0]);
    return true;
};

//==============================
// * I指令 - 【图片 > 显示图片】
//==============================
Game_Interpreter.prototype.command231 = function(){
    var x, y;
    if( this._params[3] === 0 ){  // Direct designation
        x = this._params[4];
        y = this._params[5];
    }else{  // Designation with variables
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.showPicture(this._params[0], this._params[1], this._params[2],
        x, y, this._params[6], this._params[7], this._params[8], this._params[9]);
    return true;
};
//==============================
// * I指令 - 【图片 > 移动图片】
//==============================
Game_Interpreter.prototype.command232 = function(){
    var x, y;
    if( this._params[3] === 0 ){  // Direct designation
        x = this._params[4];
        y = this._params[5];
    }else{  // Designation with variables
        x = $gameVariables.value(this._params[4]);
        y = $gameVariables.value(this._params[5]);
    }
    $gameScreen.movePicture(this._params[0], this._params[2], x, y, this._params[6],
        this._params[7], this._params[8], this._params[9], this._params[10]);
    if( this._params[11] ){
        this.wait(this._params[10]);
    }
    return true;
};
//==============================
// * I指令 - 【图片 > 旋转图片】
//==============================
Game_Interpreter.prototype.command233 = function(){
    $gameScreen.rotatePicture(this._params[0], this._params[1]);
    return true;
};
//==============================
// * I指令 - 【图片 > 更改图片色调】
//==============================
Game_Interpreter.prototype.command234 = function(){
    $gameScreen.tintPicture(this._params[0], this._params[1], this._params[2]);
    if( this._params[3] ){
        this.wait(this._params[2]);
    }
    return true;
};
//==============================
// * I指令 - 【图片 > 消除图片】
//==============================
Game_Interpreter.prototype.command235 = function(){
    $gameScreen.erasePicture(this._params[0]);
    return true;
};

//==============================
// * I指令 - 【音频&视频 > 播放BGM】
//==============================
Game_Interpreter.prototype.command241 = function(){
    AudioManager.playBgm(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 淡出BGM】
//==============================
Game_Interpreter.prototype.command242 = function(){
    AudioManager.fadeOutBgm(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 保存BGM】
//==============================
Game_Interpreter.prototype.command243 = function(){
    $gameSystem.saveBgm();
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 恢复BGM】
//==============================
Game_Interpreter.prototype.command244 = function(){
    $gameSystem.replayBgm();
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 播放BGS】
//==============================
Game_Interpreter.prototype.command245 = function(){
    AudioManager.playBgs(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 淡出BGS】
//==============================
Game_Interpreter.prototype.command246 = function(){
    AudioManager.fadeOutBgs(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 播放ME】
//==============================
Game_Interpreter.prototype.command249 = function(){
    AudioManager.playMe(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 播放SE】
//==============================
Game_Interpreter.prototype.command250 = function(){
    AudioManager.playSe(this._params[0]);
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 停止SE】
//==============================
Game_Interpreter.prototype.command251 = function(){
    AudioManager.stopSe();
    return true;
};
//==============================
// * I指令 - 【音频&视频 > 播放影像】
//==============================
Game_Interpreter.prototype.command261 = function(){
    if( !$gameMessage.isBusy() ){
        var name = this._params[0];
        if( name.length > 0 ){
            var ext = this.videoFileExt();
            Graphics.playVideo('movies/' + name + ext);
            this.setWaitMode('video');
        }
        this._index++;
    }
    return false;
};
//==============================
// * I指令 - 【音频&视频 > 播放影像】 - 影像后缀
//==============================
Game_Interpreter.prototype.videoFileExt = function(){
    if( Graphics.canPlayVideoType('video/webm') && !Utils.isMobileDevice() ){
        return '.webm';
    }else{
        return '.mp4';
    }
};

//==============================
// * I指令 - 【地图 > 启用/禁用显示地图名称】
//==============================
Game_Interpreter.prototype.command281 = function(){
    if( this._params[0] === 0 ){
        $gameMap.enableNameDisplay();
    }else{
        $gameMap.disableNameDisplay();
    }
    return true;
};
//==============================
// * I指令 - 【地图 > 更改地图图块】
//==============================
Game_Interpreter.prototype.command282 = function(){
    var tileset = $dataTilesets[this._params[0]];
    if(!this._imageReservationId){
        this._imageReservationId = Utils.generateRuntimeId();
    }

    var allReady = tileset.tilesetNames.map(function( tilesetName ){
        return ImageManager.reserveTileset(tilesetName, 0, this._imageReservationId);
    }, this).every(function( bitmap ){return bitmap.isReady();});

    if( allReady ){
        $gameMap.changeTileset(this._params[0]);
        ImageManager.releaseReservation(this._imageReservationId);
        this._imageReservationId = null;

        return true;
    }else{
        return false;
    }
};
//==============================
// * I指令『多层战斗背景』 - 【地图 > 更改战斗背景】
//==============================
Game_Interpreter.prototype.command283 = function(){
    $gameMap.changeBattleback(this._params[0], this._params[1]);
    return true;
};
//==============================
// * I指令 - 【地图 > 更改远景】
//==============================
Game_Interpreter.prototype.command284 = function(){
    $gameMap.changeParallax(this._params[0], this._params[1],
        this._params[2], this._params[3], this._params[4]);
    return true;
};
//==============================
// * I指令 - 【地图 > 获取指定位置的信息】
//==============================
Game_Interpreter.prototype.command285 = function(){
    var x, y, value;
    if( this._params[2] === 0 ){  // Direct designation
        x = this._params[3];
        y = this._params[4];
    }else{  // Designation with variables
        x = $gameVariables.value(this._params[3]);
        y = $gameVariables.value(this._params[4]);
    }
    switch( this._params[1] ){
		case 0:     // Terrain Tag
			value = $gameMap.terrainTag(x, y);
			break;
		case 1:     // Event ID
			value = $gameMap.eventIdXy(x, y);
			break;
		case 2:     // Tile ID (Layer 1)
		case 3:     // Tile ID (Layer 2)
		case 4:     // Tile ID (Layer 3)
		case 5:     // Tile ID (Layer 4)
			value = $gameMap.tileId(x, y, this._params[1] - 2);
			break;
		default:    // Region ID
			value = $gameMap.regionId(x, y);
			break;
    }
    $gameVariables.setValue(this._params[0], value);
    return true;
};

//==============================
// * I指令 - 【场景控制 > 战斗处理】
//==============================
Game_Interpreter.prototype.command301 = function(){
	if( !$gameParty.inBattle() ){
		var troopId;
		if( this._params[0] === 0 ){  // Direct designation
			troopId = this._params[1];
		}else if( this._params[0] === 1 ){  // Designation with a variable
			troopId = $gameVariables.value(this._params[1]);
		}else{  // Same as Random Encounter
			troopId = $gamePlayer.makeEncounterTroopId();
		}
		if( $dataTroops[troopId] ){
			
			// > 战斗管理器 - 载入敌群
			BattleManager.setup(troopId, this._params[2], this._params[3]);
			
			// > 战斗管理器 - 回调函数
			BattleManager.setEventCallback(function( n ){
				this._branch[this._indent] = n;
			}.bind(this));
			
			$gamePlayer.makeEncounterCount();
			SceneManager.push(Scene_Battle);		//塞入战斗场景
		}
	}
	return true;
};
//==============================
// * I指令 - 【场景控制 > 战斗处理-胜利时】
//==============================
Game_Interpreter.prototype.command601 = function(){
    if( this._branch[this._indent] !== 0 ){		//分支 - 胜利时
        this.skipBranch();
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 战斗处理-逃跑时】
//==============================
Game_Interpreter.prototype.command602 = function(){
    if( this._branch[this._indent] !== 1 ){		//分支 - 逃跑时
        this.skipBranch();
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 战斗处理-失败时】
//==============================
Game_Interpreter.prototype.command603 = function(){
    if( this._branch[this._indent] !== 2 ){		//分支 - 失败时
        this.skipBranch();
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 商店处理】
//==============================
Game_Interpreter.prototype.command302 = function(){
    if( !$gameParty.inBattle() ){
        var goods = [this._params];
        while( this.nextEventCode() === 605 ){
            this._index++;
            goods.push(this.currentCommand().parameters);
        }
        SceneManager.push(Scene_Shop);
        SceneManager.prepareNextScene(goods, this._params[4]);	//（商店界面 初始化传参）
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 名字输入处理】
//==============================
Game_Interpreter.prototype.command303 = function(){
    if( !$gameParty.inBattle() ){
        if( $dataActors[this._params[0]] ){
            SceneManager.push(Scene_Name);
            SceneManager.prepareNextScene(this._params[0], this._params[1]);	//（名称输入界面 初始化传参）
        }
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 打开菜单画面】
//==============================
Game_Interpreter.prototype.command351 = function(){
    if( !$gameParty.inBattle() ){
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 打开存档画面】
//==============================
Game_Interpreter.prototype.command352 = function(){
    if( !$gameParty.inBattle() ){
        SceneManager.push(Scene_Save);
    }
    return true;
};
//==============================
// * I指令 - 【场景控制 > 游戏结束】
//==============================
Game_Interpreter.prototype.command353 = function(){
    SceneManager.goto(Scene_Gameover);
    return true;
};
//==============================
// * I指令 - 【场景控制 > 返回标题画面】
//==============================
Game_Interpreter.prototype.command354 = function(){
    SceneManager.goto(Scene_Title);
    return true;
};

//==============================
// * I指令 - 【角色 > 增减HP】
//==============================
Game_Interpreter.prototype.command311 = function(){
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        this.changeHp(actor, value, this._params[5]);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 增减MP】
//==============================
Game_Interpreter.prototype.command312 = function(){
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        actor.gainMp(value);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 增减TP】
//==============================
Game_Interpreter.prototype.command326 = function(){
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        actor.gainTp(value);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 更改状态】
//==============================
Game_Interpreter.prototype.command313 = function(){
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        var alreadyDead = actor.isDead();
        if( this._params[2] === 0 ){
            actor.addState(this._params[3]);
        }else{
            actor.removeState(this._params[3]);
        }
        if( actor.isDead() && !alreadyDead ){
            actor.performCollapse();
        }
        actor.clearResult();
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 完全恢复】
//==============================
Game_Interpreter.prototype.command314 = function(){
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        actor.recoverAll();
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 增减经验值】
//==============================
Game_Interpreter.prototype.command315 = function(){
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        actor.changeExp(actor.currentExp() + value, this._params[5]);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 增减等级】
//==============================
Game_Interpreter.prototype.command316 = function(){
    var value = this.operateValue(this._params[2], this._params[3], this._params[4]);
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        actor.changeLevel(actor.level + value, this._params[5]);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 增减能力值】
//==============================
Game_Interpreter.prototype.command317 = function(){
    var value = this.operateValue(this._params[3], this._params[4], this._params[5]);
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        actor.addParam(this._params[2], value);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 增减技能】
//==============================
Game_Interpreter.prototype.command318 = function(){
    this.iterateActorEx(this._params[0], this._params[1], function( actor ){
        if( this._params[2] === 0 ){
            actor.learnSkill(this._params[3]);
        }else{
            actor.forgetSkill(this._params[3]);
        }
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【角色 > 更改装备】
//==============================
Game_Interpreter.prototype.command319 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor ){
        actor.changeEquipById(this._params[1], this._params[2]);
    }
    return true;
};
//==============================
// * I指令 - 【角色 > 更改名字】
//==============================
Game_Interpreter.prototype.command320 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor ){
        actor.setName(this._params[1]);
    }
    return true;
};
//==============================
// * I指令 - 【角色 > 更改职业】
//==============================
Game_Interpreter.prototype.command321 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor && $dataClasses[this._params[1]] ){
        actor.changeClass(this._params[1], this._params[2]);
    }
    return true;
};
//==============================
// * I指令 - 【角色 > 更改昵称】
//==============================
Game_Interpreter.prototype.command324 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor ){
        actor.setNickname(this._params[1]);
    }
    return true;
};
//==============================
// * I指令 - 【角色 > 更改简介】
//==============================
Game_Interpreter.prototype.command325 = function(){
    var actor = $gameActors.actor(this._params[0]);
    if( actor ){
        actor.setProfile(this._params[1]);
    }
    return true;
};

//==============================
// * I指令 - 【战斗 > 增减敌人HP】
//==============================
Game_Interpreter.prototype.command331 = function(){
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        this.changeHp(enemy, value, this._params[4]);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 增减敌人MP】
//==============================
Game_Interpreter.prototype.command332 = function(){
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        enemy.gainMp(value);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 增减敌人TP】
//==============================
Game_Interpreter.prototype.command342 = function(){
    var value = this.operateValue(this._params[1], this._params[2], this._params[3]);
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        enemy.gainTp(value);
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 更改敌人状态】
//==============================
Game_Interpreter.prototype.command333 = function(){
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        var alreadyDead = enemy.isDead();
        if( this._params[1] === 0 ){
            enemy.addState(this._params[2]);
        }else{
            enemy.removeState(this._params[2]);
        }
        if( enemy.isDead() && !alreadyDead ){
            enemy.performCollapse();
        }
        enemy.clearResult();
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 敌人完全恢复】
//==============================
Game_Interpreter.prototype.command334 = function(){
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        enemy.recoverAll();
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 敌人出现】
//==============================
Game_Interpreter.prototype.command335 = function(){
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        enemy.appear();
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 敌人变身】
//==============================
Game_Interpreter.prototype.command336 = function(){
    this.iterateEnemyIndex(this._params[0], function( enemy ){
        enemy.transform(this._params[1]);
        $gameTroop.makeUniqueNames();
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 显示战斗动画】
//==============================
Game_Interpreter.prototype.command337 = function(){
    if( this._params[2] == true ){
        this.iterateEnemyIndex(-1,function( enemy ){
            if( enemy.isAlive() ){
                enemy.startAnimation(this._params[1],false,0);
            }
        }.bind(this));
    }else{
        this.iterateEnemyIndex(this._params[0], function (enemy ){
            if( enemy.isAlive() ){
                enemy.startAnimation(this._params[1], false, 0);
            }
        }.bind(this));
    }
    return true;
};
//==============================
// * I指令 - 【战斗 > 强制战斗行动】
//==============================
Game_Interpreter.prototype.command339 = function(){
    this.iterateBattler(this._params[0], this._params[1], function( battler ){
        if( !battler.isDeathStateAffected() ){
            battler.forceAction(this._params[2], this._params[3]);
            BattleManager.forceAction(battler);
            this.setWaitMode('action');
        }
    }.bind(this));
    return true;
};
//==============================
// * I指令 - 【战斗 > 中断战斗】
//==============================
Game_Interpreter.prototype.command340 = function(){
    BattleManager.abort();
    return true;
};

//==============================
// * I指令 - 【高级 > 脚本】
//==============================
Game_Interpreter.prototype.command355 = function(){
    var script = this.currentCommand().parameters[0] + '\n';
    while( this.nextEventCode() === 655 ){
        this._index++;
        script += this.currentCommand().parameters[0] + '\n';
    }
    eval(script);
    return true;
};
//==============================
// * I指令 - 【高级 > 插件指令】
//==============================
Game_Interpreter.prototype.command356 = function(){
    var args = this._params[0].split(" ");
    var command = args.shift();
    this.pluginCommand(command, args);
    return true;
};
//==============================
// * I指令 - 【高级 > 插件指令】 - 执行插件指令
//==============================
Game_Interpreter.prototype.pluginCommand = function( command, args ){
    // （此函数用于被插件继承）
};


//==============================
// * I指令 - 图像预加载（静态函数）
//
//			说明：	> 此函数的关键词为：request 。
//					> 指令中，所有与ImageManager图片资源有联系的，都需要进行预加载资源。
//					  预加载的时机为：指令输入时（setup函数）。
//==============================
Game_Interpreter.requestImages = function( list, commonList ){
    if( !list ) return;
	
    list.forEach(function( command ){
        var params = command.parameters;
        switch( command.code ){
			
            // > 脸图（来自【信息 > 显示文字】）
            case 101:
                ImageManager.requestFace(params[0]);
                break;

            // > 公共事件的全部图像（来自【流程控制 > 公共事件】）
            case 117:
                var commonEvent = $dataCommonEvents[params[0]];
                if( commonEvent ){
                    if( !commonList ){
                        commonList = [];
                    }
                    if( !commonList.contains(params[0]) ){
                        commonList.push(params[0]);
                        Game_Interpreter.requestImages(commonEvent.list, commonList);		//（子类嵌套时，嵌套关联预加载）
                    }
                }
                break;

            // > 行走图（来自【队伍 > 队伍管理】）
            case 129:
                var actor = $gameActors.actor(params[0]);
                if( actor && params[1] === 0 ){
                    var name = actor.characterName();
                    ImageManager.requestCharacter(name);
                }
                break;

            // > 行走图（来自【移动 > 设置移动路线】）
            case 205:
                if( params[1] ){
                    params[1].list.forEach(function( command ){
                        var params = command.parameters;
                        if(command.code === Game_Character.ROUTE_CHANGE_IMAGE){
                            ImageManager.requestCharacter(params[0]);
                        }
                    });
                }
                break;

            // > 动画图像（来自【人物 > 显示动画】和【战斗 > 显示战斗动画】）
            case 212: case 337:
                if( params[1] ){
                    var animation = $dataAnimations[params[1]];
                    var name1 = animation.animation1Name;
                    var name2 = animation.animation2Name;
                    var hue1 = animation.animation1Hue;
                    var hue2 = animation.animation2Hue;
                    ImageManager.requestAnimation(name1, hue1);
                    ImageManager.requestAnimation(name2, hue2);
                }
                break;

            // > 行走图（来自【人物 > 更改队列行进】）
            case 216:
                if( params[0] === 0 ){
                    $gamePlayer.followers().forEach(function( follower ){
                        var name = follower.characterName();
                        ImageManager.requestCharacter(name);
                    });
                }
                break;

            // > 图片（来自【图片 > 显示图片】）
            case 231:
                ImageManager.requestPicture(params[1]);
                break;

            // > 图块资源（来自【地图 > 更改地图图块】）
            case 282:
                var tileset = $dataTilesets[params[0]];
                tileset.tilesetNames.forEach(function( tilesetName ){
                    ImageManager.requestTileset(tilesetName);
                });
                break;

            // > 战斗背景资源（来自【地图 > 更改战斗背景】）
            case 283:
                if( $gameParty.inBattle() ){
                    ImageManager.requestBattleback1(params[0]);
                    ImageManager.requestBattleback2(params[1]);
                }
                break;

            // > 远景资源（来自【地图 > 更改远景】）
            case 284:
                if( !$gameParty.inBattle() ){
                    ImageManager.requestParallax(params[0]);
                }
                break;

            // > 行走图+脸图+SV图（来自【系统设置 > 更改角色图像】）
            case 322:
                ImageManager.requestCharacter(params[1]);
                ImageManager.requestFace(params[3]);
                ImageManager.requestSvActor(params[5]);
                break;

            // > 行走图（来自【系统设置 > 更改载具图像】）
            case 323:
                var vehicle = $gameMap.vehicle(params[0]);
                if( vehicle ){
                    ImageManager.requestCharacter(params[1]);
                }
                break;

            // > 战斗敌人图像（来自【战斗 > 敌人变身】）
            case 336:
                var enemy = $dataEnemies[params[1]];
                var name = enemy.battlerName;
                var hue = enemy.battlerHue;
                if( $gameSystem.isSideView() ){
                    ImageManager.requestSvEnemy(name, hue);
                }else{
                    ImageManager.requestEnemy(name, hue);
                }
                break;
        }
    });
};
