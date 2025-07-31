interface GameEvent {
	type: string;
	data: any;
	timestamp: number;
}

interface RPGMVEventData {
	variables?: Record<number, any>;
	switches?: Record<number, boolean>;
	playerData?: {
		name: string;
		level: number;
		hp: number;
		mp: number;
		exp: number;
	};
	currentScene?: string;
	mapId?: number;
}

export class GameBridge {
	private eventBus = new EventTarget();
	private rpgmvReady = false;
	private vueReady = false;
	private messageQueue: GameEvent[] = [];

	constructor() {
		this.init();
	}

	// 初始化桥接器
	private init() {
		this.setupRPGMVListener();
		this.setupVueListener();
		this.exposeGlobalAPI();
		console.log("GameBridge initialized");
	}

	// 设置RPGMV事件监听
	private setupRPGMVListener() {
		window.addEventListener("rpgmv-ready", () => {
			this.rpgmvReady = true;
			console.log("RPGMV is ready for communication");
			this.processMessageQueue();
		});

		window.addEventListener("rpgmv-to-vue", (event: CustomEvent) => {
			this.handleRPGMVEvent(event.detail);
		});
	}

	// 设置Vue事件监听
	private setupVueListener() {
		this.vueReady = true;
		console.log("Vue is ready for communication");
	}

	// 暴露全局API
	private exposeGlobalAPI() {
		window.gameBridge = this;
	}

	// 处理消息队列
	private processMessageQueue() {
		while (this.messageQueue.length > 0) {
			const event = this.messageQueue.shift()!;
			this.sendToRPGMV(event.type, event.data);
		}
	}

	// 处理来自RPGMV的事件
	private handleRPGMVEvent(eventData: GameEvent) {
		console.log("Received event from RPGMV:", eventData);
		this.eventBus.dispatchEvent(
			new CustomEvent(eventData.type, {
				detail: eventData,
			}),
		);
	}

	// 从 Vue 发送到 RPGMV
	sendToRPGMV(type: string, data: any) {
		const event: GameEvent = { type, data, timestamp: Date.now() };

		if (!this.rpgmvReady) {
			console.warn("RPGMV not ready, queueing message:", event);
			this.messageQueue.push(event);
			return;
		}

		console.log("Sending to RPGMV:", event);
		window.dispatchEvent(new CustomEvent("vue-to-rpgmv", { detail: event }));
	}

	// 从 RPGMV 发送到 Vue
	sendToVue(type: string, data: any) {
		const event: GameEvent = { type, data, timestamp: Date.now() };
		console.log("Sending to Vue:", event);
		this.eventBus.dispatchEvent(new CustomEvent(type, { detail: event }));
	}

	// Vue 监听 RPGMV 事件
	onRPGMVEvent(type: string, callback: (data: any) => void) {
		this.eventBus.addEventListener(type, (e: Event) => {
			const customEvent = e as CustomEvent;
			callback(customEvent.detail.data);
		});
	}

	// 移除事件监听
	offRPGMVEvent(type: string, callback: (data: any) => void) {
		this.eventBus.removeEventListener(type, callback as EventListener);
	}

	// 获取RPGMV状态
	isRPGMVReady(): boolean {
		return this.rpgmvReady;
	}

	// 获取Vue状态
	isVueReady(): boolean {
		return this.vueReady;
	}

	// 获取当前游戏状态快照
	getGameSnapshot(): RPGMVEventData | null {
		if (!this.rpgmvReady) return null;

		try {
			const snapshot: RPGMVEventData = {};

			// 获取变量数据
			if (window.$gameVariables) {
				snapshot.variables = {};
				for (let i = 1; i < 100; i++) {
					if (window.$gameVariables._data[i] !== undefined) {
						snapshot.variables[i] = window.$gameVariables._data[i];
					}
				}
			}

			// 获取开关数据
			if (window.$gameSwitches) {
				snapshot.switches = {};
				for (let i = 1; i < 100; i++) {
					if (window.$gameSwitches._data[i] !== undefined) {
						snapshot.switches[i] = window.$gameSwitches._data[i];
					}
				}
			}

			// 获取玩家数据
			if (window.$gameParty && window.$gameParty._actors[0]) {
				const actor = window.$gameActors.actor(window.$gameParty._actors[0]);
				if (actor) {
					snapshot.playerData = {
						name: actor._name || "",
						level: actor._level || 1,
						hp: actor._hp || 0,
						mp: actor._mp || 0,
						exp: actor._exp[actor._classId] || 0,
					};
				}
			}

			// 获取当前场景
			if (window.SceneManager && window.SceneManager._scene) {
				snapshot.currentScene = window.SceneManager._scene.constructor.name;
			}

			// 获取地图ID
			if (window.$gameMap) {
				snapshot.mapId = window.$gameMap._mapId;
			}

			return snapshot;
		} catch (error) {
			console.error("Error getting game snapshot:", error);
			return null;
		}
	}
}
