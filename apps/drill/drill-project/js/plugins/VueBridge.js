//=============================================================================
// VueBridge.js - 由TypeScript编译生成
// Vue与RPGMV双向通信桥接插件
// 编译时间: 2025-07-31T10:01:50.523Z
//=============================================================================
"use strict";
function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
}
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var VueBridgePlugin = function() {
    // src/rpgmv-plugins/VueBridge.ts
    var VueBridge = {
        // 插件版本
        version: "1.0.0",
        // 初始化标志
        initialized: false,
        // 监听来自 Vue 的事件
        init: function init() {
            var _this = this;
            if (this.initialized) return;
            console.log("VueBridge initializing...");
            window.addEventListener("vue-to-rpgmv", function(event) {
                var customEvent = event;
                _this.handleVueEvent(customEvent.detail);
            });
            this.setupDataWatchers();
            this.notifyReady();
            this.initialized = true;
            console.log("VueBridge initialized successfully");
        },
        // 处理来自Vue的事件
        handleVueEvent: function handleVueEvent(eventData) {
            var type = eventData.type, data = eventData.data, timestamp = eventData.timestamp;
            console.log("Received event from Vue:", type, data);
            try {
                switch(type){
                    case "change-variable":
                        this.changeVariable(data.id, data.value);
                        break;
                    case "change-switch":
                        this.changeSwitch(data.id, data.value);
                        break;
                    case "show-message":
                        this.showMessage(data.text);
                        break;
                    case "play-se":
                        this.playSE(data.filename, data.volume, data.pitch, data.pan);
                        break;
                    case "change-scene":
                        this.changeScene(data.sceneName, data.args);
                        break;
                    case "transfer-player":
                        this.transferPlayer(data.mapId, data.x, data.y, data.direction);
                        break;
                    default:
                        console.warn("Unknown event type from Vue:", type);
                }
            } catch (error) {
                console.error("Error handling Vue event:", error);
                this.sendToVue("error", {
                    message: error.message,
                    type: type,
                    timestamp: timestamp
                });
            }
        },
        // 修改游戏变量
        changeVariable: function changeVariable(id, value) {
            if ($gameVariables && typeof id === "number" && id > 0) {
                var oldValue = $gameVariables.value(id);
                $gameVariables.setValue(id, value);
                console.log("Variable ".concat(id, " changed from ").concat(oldValue, " to ").concat(value));
                this.sendToVue("variable-changed", {
                    id: id,
                    value: value,
                    oldValue: oldValue
                });
            }
        },
        // 修改游戏开关
        changeSwitch: function changeSwitch(id, value) {
            if ($gameSwitches && typeof id === "number" && id > 0) {
                var oldValue = $gameSwitches.value(id);
                $gameSwitches.setValue(id, value);
                console.log("Switch ".concat(id, " changed from ").concat(oldValue, " to ").concat(value));
                this.sendToVue("switch-changed", {
                    id: id,
                    value: value,
                    oldValue: oldValue
                });
            }
        },
        // 显示消息
        showMessage: function showMessage(text) {
            if ($gameMessage && !$gameMessage.isBusy()) {
                $gameMessage.add(text);
                console.log("Message displayed:", text);
            } else {
                console.warn("Cannot display message: message system busy");
            }
        },
        // 播放音效
        playSE: function playSE(filename) {
            var volume = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 90, pitch = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 100, pan = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
            if (filename) {
                var audio = {
                    name: filename,
                    volume: volume,
                    pitch: pitch,
                    pan: pan,
                    pos: 0
                };
                AudioManager.playSe(audio);
                console.log("SE played:", audio);
            }
        },
        // 切换场景
        changeScene: function changeScene(sceneName) {
            var args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
            try {
                var SceneClass = window[sceneName];
                if (SceneClass && typeof SceneClass === "function") {
                    var _SceneManager;
                    (_SceneManager = SceneManager).goto.apply(_SceneManager, [
                        SceneClass
                    ].concat(_to_consumable_array(args)));
                    console.log("Scene changed to:", sceneName);
                } else {
                    console.error("Scene not found:", sceneName);
                }
            } catch (error) {
                console.error("Error changing scene:", error);
            }
        },
        // 传送玩家
        transferPlayer: function transferPlayer(mapId, x, y) {
            var direction = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 2;
            if ($gamePlayer && typeof mapId === "number" && typeof x === "number" && typeof y === "number") {
                $gamePlayer.reserveTransfer(mapId, x, y, direction, 0);
                console.log("Player transfer reserved to map ".concat(mapId, " at (").concat(x, ", ").concat(y, ")"));
            }
        },
        // 设置数据监听器
        setupDataWatchers: function setupDataWatchers() {
            this.watchSceneChanges();
            this.watchMapChanges();
            this.watchPlayerDataChanges();
        },
        // 监听场景变化
        watchSceneChanges: function watchSceneChanges() {
            var originalGoto = SceneManager.goto;
            SceneManager.goto = function(sceneClass) {
                for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
                    args[_key - 1] = arguments[_key];
                }
                var _originalGoto;
                (_originalGoto = originalGoto).call.apply(_originalGoto, [
                    this,
                    sceneClass
                ].concat(_to_consumable_array(args)));
                setTimeout(function() {
                    if (VueBridge.sendToVue) {
                        VueBridge.sendToVue("scene-changed", {
                            sceneName: sceneClass.name
                        });
                    }
                }, 100);
            };
        },
        // 监听地图变化
        watchMapChanges: function watchMapChanges() {
            if ($gameMap) {
                var originalSetup = $gameMap.setup;
                $gameMap.setup = function(mapId) {
                    originalSetup.call(this, mapId);
                    if (VueBridge.sendToVue) {
                        VueBridge.sendToVue("map-changed", {
                            mapId: mapId
                        });
                    }
                };
            }
        },
        // 监听玩家数据变化
        watchPlayerDataChanges: function watchPlayerDataChanges() {
            if ($gameParty) {
                var originalGainExp = Game_Actor.prototype.gainExp;
                Game_Actor.prototype.gainExp = function(exp) {
                    var oldLevel = this._level;
                    originalGainExp.call(this, exp);
                    if (this._actorId === $gameParty.leader()._actorId) {
                        VueBridge.sendPlayerDataUpdate();
                        if (this._level > oldLevel) {
                            VueBridge.sendToVue("player-level-up", {
                                oldLevel: oldLevel,
                                newLevel: this._level,
                                actorId: this._actorId
                            });
                        }
                    }
                };
                var originalSetHp = Game_Actor.prototype.setHp;
                Game_Actor.prototype.setHp = function(hp) {
                    originalSetHp.call(this, hp);
                    if (this._actorId === $gameParty.leader()._actorId) {
                        VueBridge.sendPlayerDataUpdate();
                    }
                };
                var originalSetMp = Game_Actor.prototype.setMp;
                Game_Actor.prototype.setMp = function(mp) {
                    originalSetMp.call(this, mp);
                    if (this._actorId === $gameParty.leader()._actorId) {
                        VueBridge.sendPlayerDataUpdate();
                    }
                };
            }
        },
        // 发送玩家数据更新
        sendPlayerDataUpdate: function sendPlayerDataUpdate() {
            if ($gameParty && $gameParty.leader()) {
                var actor = $gameParty.leader();
                var playerData = {
                    name: actor._name || "",
                    level: actor._level || 1,
                    hp: actor._hp || 0,
                    mp: actor._mp || 0,
                    exp: actor._exp[actor._classId] || 0
                };
                this.sendToVue("player-data-changed", playerData);
            }
        },
        // 发送事件到 Vue
        sendToVue: function sendToVue(type, data) {
            if (window.gameBridge) {
                window.gameBridge.sendToVue(type, data);
            } else {
                var event = new CustomEvent("rpgmv-to-vue", {
                    detail: {
                        type: type,
                        data: data,
                        timestamp: Date.now()
                    }
                });
                window.dispatchEvent(event);
            }
        },
        // 通知Vue RPGMV已准备就绪
        notifyReady: function notifyReady() {
            var _this = this;
            this.sendToVue("connection-changed", {
                connected: true
            });
            window.dispatchEvent(new CustomEvent("rpgmv-ready"));
            setTimeout(function() {
                _this.sendInitialGameState();
            }, 500);
        },
        // 发送初始游戏状态
        sendInitialGameState: function sendInitialGameState() {
            try {
                if (SceneManager._scene) {
                    this.sendToVue("scene-changed", {
                        sceneName: SceneManager._scene.constructor.name
                    });
                }
                if ($gameMap && $gameMap._mapId) {
                    this.sendToVue("map-changed", {
                        mapId: $gameMap._mapId
                    });
                }
                this.sendPlayerDataUpdate();
                console.log("Initial game state sent to Vue");
            } catch (error) {
                console.error("Error sending initial game state:", error);
            }
        }
    };
    (function() {
        "use strict";
        var _Scene_Boot_start = Scene_Boot.prototype.start;
        Scene_Boot.prototype.start = function() {
            _Scene_Boot_start.call(this);
            setTimeout(function() {
                VueBridge.init();
            }, 1e3);
        };
        window.VueBridge = VueBridge;
        console.log("VueBridge plugin loaded (TypeScript version)");
    })();
}();
