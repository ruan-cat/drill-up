//=============================================================================
// VueBridge.ts
// Vue与RPGMV双向通信桥接插件 - TypeScript版本
//=============================================================================

interface GameEvent {
	type: string;
	data: any;
	timestamp: number;
}

interface VueBridgeStatic {
	version: string;
	initialized: boolean;

	init(): void;
	handleVueEvent(eventData: GameEvent): void;
	changeVariable(id: number, value: any): void;
	changeSwitch(id: number, value: boolean): void;
	showMessage(text: string): void;
	playSE(filename: string, volume?: number, pitch?: number, pan?: number): void;
	changeScene(sceneName: string, args?: any[]): void;
	transferPlayer(mapId: number, x: number, y: number, direction?: number): void;
	setupDataWatchers(): void;
	watchSceneChanges(): void;
	watchMapChanges(): void;
	watchPlayerDataChanges(): void;
	sendPlayerDataUpdate(): void;
	sendToVue(type: string, data: any): void;
	notifyReady(): void;
	sendInitialGameState(): void;
}

// 创建VueBridge对象
const VueBridge: VueBridgeStatic = {
	// 插件版本
	version: "1.0.0",

	// 初始化标志
	initialized: false,

	// 监听来自 Vue 的事件
	init(): void {
		if (this.initialized) return;

		console.log("VueBridge initializing...");

		// 监听Vue发来的事件
		window.addEventListener("vue-to-rpgmv", (event: Event) => {
			const customEvent = event as CustomEvent<GameEvent>;
			this.handleVueEvent(customEvent.detail);
		});

		// 设置数据变化监听
		this.setupDataWatchers();

		// 通知 Vue RPGMV 已准备就绪
		this.notifyReady();

		this.initialized = true;
		console.log("VueBridge initialized successfully");
	},

	// 处理来自Vue的事件
	handleVueEvent(eventData: GameEvent): void {
		const { type, data, timestamp } = eventData;
		console.log("Received event from Vue:", type, data);

		try {
			switch (type) {
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
		} catch (error: any) {
			console.error("Error handling Vue event:", error);
			this.sendToVue("error", {
				message: error.message,
				type: type,
				timestamp: timestamp,
			});
		}
	},

	// 修改游戏变量
	changeVariable(id: number, value: any): void {
		if ($gameVariables && typeof id === "number" && id > 0) {
			const oldValue = $gameVariables.value(id);
			$gameVariables.setValue(id, value);
			console.log(`Variable ${id} changed from ${oldValue} to ${value}`);

			// 通知Vue变量已更改
			this.sendToVue("variable-changed", { id, value, oldValue });
		}
	},

	// 修改游戏开关
	changeSwitch(id: number, value: boolean): void {
		if ($gameSwitches && typeof id === "number" && id > 0) {
			const oldValue = $gameSwitches.value(id);
			$gameSwitches.setValue(id, value);
			console.log(`Switch ${id} changed from ${oldValue} to ${value}`);

			// 通知Vue开关已更改
			this.sendToVue("switch-changed", { id, value, oldValue });
		}
	},

	// 显示消息
	showMessage(text: string): void {
		if ($gameMessage && !$gameMessage.isBusy()) {
			$gameMessage.add(text);
			console.log("Message displayed:", text);
		} else {
			console.warn("Cannot display message: message system busy");
		}
	},

	// 播放音效
	playSE(filename: string, volume: number = 90, pitch: number = 100, pan: number = 0): void {
		if (filename) {
			const audio: MV.AudioParameters = {
				name: filename,
				volume: volume,
				pitch: pitch,
				pan: pan,
				pos: 0,
			};
			AudioManager.playSe(audio);
			console.log("SE played:", audio);
		}
	},

	// 切换场景
	changeScene(sceneName: string, args: any[] = []): void {
		try {
			const SceneClass = (window as any)[sceneName];
			if (SceneClass && typeof SceneClass === "function") {
				(SceneManager.goto as any)(SceneClass, ...args);
				console.log("Scene changed to:", sceneName);
			} else {
				console.error("Scene not found:", sceneName);
			}
		} catch (error) {
			console.error("Error changing scene:", error);
		}
	},

	// 传送玩家
	transferPlayer(mapId: number, x: number, y: number, direction: number = 2): void {
		if ($gamePlayer && typeof mapId === "number" && typeof x === "number" && typeof y === "number") {
			$gamePlayer.reserveTransfer(mapId, x, y, direction, 0);
			console.log(`Player transfer reserved to map ${mapId} at (${x}, ${y})`);
		}
	},

	// 设置数据监听器
	setupDataWatchers(): void {
		// 监听场景变化
		this.watchSceneChanges();

		// 监听地图变化
		this.watchMapChanges();

		// 监听玩家数据变化
		this.watchPlayerDataChanges();
	},

	// 监听场景变化
	watchSceneChanges(): void {
		const originalGoto = SceneManager.goto;
		(SceneManager.goto as any) = function (this: any, sceneClass: any, ...args: any[]) {
			(originalGoto as any).call(this, sceneClass, ...args);

			// 延迟发送场景变化事件，确保场景已切换
			setTimeout(() => {
				if (VueBridge.sendToVue) {
					VueBridge.sendToVue("scene-changed", {
						sceneName: sceneClass.name,
					});
				}
			}, 100);
		};
	},

	// 监听地图变化
	watchMapChanges(): void {
		if ($gameMap) {
			const originalSetup = $gameMap.setup;
			$gameMap.setup = function (mapId: number) {
				originalSetup.call(this, mapId);

				// 发送地图变化事件
				if (VueBridge.sendToVue) {
					VueBridge.sendToVue("map-changed", { mapId });
				}
			};
		}
	},

	// 监听玩家数据变化
	watchPlayerDataChanges(): void {
		if ($gameParty) {
			// 监听经验值变化
			const originalGainExp = Game_Actor.prototype.gainExp;
			Game_Actor.prototype.gainExp = function (this: Game_Actor, exp: number) {
				const oldLevel = this._level;
				originalGainExp.call(this, exp);

				if (this._actorId === $gameParty.leader()._actorId) {
					VueBridge.sendPlayerDataUpdate();

					// 如果等级提升，发送特殊事件
					if (this._level > oldLevel) {
						VueBridge.sendToVue("player-level-up", {
							oldLevel,
							newLevel: this._level,
							actorId: this._actorId,
						});
					}
				}
			};

			// 监听HP/MP变化
			const originalSetHp = Game_Actor.prototype.setHp;
			Game_Actor.prototype.setHp = function (this: Game_Actor, hp: number) {
				originalSetHp.call(this, hp);
				if (this._actorId === $gameParty.leader()._actorId) {
					VueBridge.sendPlayerDataUpdate();
				}
			};

			const originalSetMp = Game_Actor.prototype.setMp;
			Game_Actor.prototype.setMp = function (this: Game_Actor, mp: number) {
				originalSetMp.call(this, mp);
				if (this._actorId === $gameParty.leader()._actorId) {
					VueBridge.sendPlayerDataUpdate();
				}
			};
		}
	},

	// 发送玩家数据更新
	sendPlayerDataUpdate(): void {
		if ($gameParty && $gameParty.leader()) {
			const actor = $gameParty.leader() as any;
			const playerData = {
				name: actor._name || "",
				level: actor._level || 1,
				hp: actor._hp || 0,
				mp: actor._mp || 0,
				exp: actor._exp[actor._classId] || 0,
			};

			this.sendToVue("player-data-changed", playerData);
		}
	},

	// 发送事件到 Vue
	sendToVue(type: string, data: any): void {
		if (window.gameBridge) {
			window.gameBridge.sendToVue(type, data);
		} else {
			// 如果桥接器还未准备好，创建自定义事件
			const event = new CustomEvent("rpgmv-to-vue", {
				detail: { type, data, timestamp: Date.now() },
			});
			window.dispatchEvent(event);
		}
	},

	// 通知Vue RPGMV已准备就绪
	notifyReady(): void {
		// 发送连接状态
		this.sendToVue("connection-changed", { connected: true });

		// 发送就绪事件
		window.dispatchEvent(new CustomEvent("rpgmv-ready"));

		// 发送初始游戏状态
		setTimeout(() => {
			this.sendInitialGameState();
		}, 500);
	},

	// 发送初始游戏状态
	sendInitialGameState(): void {
		try {
			// 发送当前场景
			if (SceneManager._scene) {
				this.sendToVue("scene-changed", {
					sceneName: SceneManager._scene.constructor.name,
				});
			}

			// 发送当前地图
			if ($gameMap && ($gameMap as any)._mapId) {
				this.sendToVue("map-changed", {
					mapId: ($gameMap as any)._mapId,
				});
			}

			// 发送玩家数据
			this.sendPlayerDataUpdate();

			console.log("Initial game state sent to Vue");
		} catch (error) {
			console.error("Error sending initial game state:", error);
		}
	},
};

// IIFE wrapper for plugin
(() => {
	"use strict";

	// 在游戏启动后初始化
	const _Scene_Boot_start = Scene_Boot.prototype.start;
	Scene_Boot.prototype.start = function () {
		_Scene_Boot_start.call(this);

		// 延迟初始化，确保所有系统已加载
		setTimeout(() => {
			VueBridge.init();
		}, 1000);
	};

	// 暴露给全局
	window.VueBridge = VueBridge;

	console.log("VueBridge plugin loaded (TypeScript version)");
})();
