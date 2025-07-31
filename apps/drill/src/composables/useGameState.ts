import { ref, reactive, readonly, onMounted, onUnmounted } from "vue";

interface GameState {
	variables: Record<number, any>;
	switches: Record<number, boolean>;
	playerData: {
		name: string;
		level: number;
		hp: number;
		mp: number;
		exp: number;
	};
	currentScene: string;
	mapId: number;
	isConnected: boolean;
}

const gameState = reactive<GameState>({
	variables: {},
	switches: {},
	playerData: {
		name: "",
		level: 1,
		hp: 100,
		mp: 50,
		exp: 0,
	},
	currentScene: "",
	mapId: 0,
	isConnected: false,
});

let eventListeners: Array<{ type: string; callback: (data: any) => void }> = [];

export function useGameState() {
	const isLoading = ref(false);
	const lastError = ref<string | null>(null);

	// 获取桥接器
	const getBridge = () => {
		if (!window.gameBridge) {
			console.warn("GameBridge not available");
			return null;
		}
		return window.gameBridge;
	};

	// 清除错误
	const clearError = () => {
		lastError.value = null;
	};

	// 错误处理
	const handleError = (error: string) => {
		lastError.value = error;
		console.error("GameState Error:", error);
	};

	// 修改游戏变量
	const setVariable = (id: number, value: any) => {
		try {
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			gameState.variables[id] = value;
			bridge.sendToRPGMV("change-variable", { id, value });
			clearError();
		} catch (error) {
			handleError(`Failed to set variable ${id}: ${error}`);
		}
	};

	// 修改游戏开关
	const setSwitch = (id: number, value: boolean) => {
		try {
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			gameState.switches[id] = value;
			bridge.sendToRPGMV("change-switch", { id, value });
			clearError();
		} catch (error) {
			handleError(`Failed to set switch ${id}: ${error}`);
		}
	};

	// 显示消息
	const showMessage = (text: string) => {
		try {
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			bridge.sendToRPGMV("show-message", { text });
			clearError();
		} catch (error) {
			handleError(`Failed to show message: ${error}`);
		}
	};

	// 播放音效
	const playSE = (filename: string, volume = 90, pitch = 100, pan = 0) => {
		try {
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			bridge.sendToRPGMV("play-se", { filename, volume, pitch, pan });
			clearError();
		} catch (error) {
			handleError(`Failed to play SE: ${error}`);
		}
	};

	// 切换场景
	const changeScene = (sceneName: string, ...args: any[]) => {
		try {
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			bridge.sendToRPGMV("change-scene", { sceneName, args });
			clearError();
		} catch (error) {
			handleError(`Failed to change scene: ${error}`);
		}
	};

	// 传送到指定地图
	const transferPlayer = (mapId: number, x: number, y: number, direction = 2) => {
		try {
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			bridge.sendToRPGMV("transfer-player", { mapId, x, y, direction });
			clearError();
		} catch (error) {
			handleError(`Failed to transfer player: ${error}`);
		}
	};

	// 获取游戏状态快照
	const refreshGameState = async () => {
		try {
			isLoading.value = true;
			const bridge = getBridge();
			if (!bridge) {
				handleError("Bridge not available");
				return;
			}

			const snapshot = bridge.getGameSnapshot();
			if (snapshot) {
				if (snapshot.variables) {
					Object.assign(gameState.variables, snapshot.variables);
				}
				if (snapshot.switches) {
					Object.assign(gameState.switches, snapshot.switches);
				}
				if (snapshot.playerData) {
					Object.assign(gameState.playerData, snapshot.playerData);
				}
				if (snapshot.currentScene) {
					gameState.currentScene = snapshot.currentScene;
				}
				if (snapshot.mapId !== undefined) {
					gameState.mapId = snapshot.mapId;
				}
			}
			clearError();
		} catch (error) {
			handleError(`Failed to refresh game state: ${error}`);
		} finally {
			isLoading.value = false;
		}
	};

	// 监听游戏状态变化
	const setupListeners = () => {
		const bridge = getBridge();
		if (!bridge) {
			console.warn("Bridge not available for setting up listeners");
			return;
		}

		// 变量变化监听
		const onVariableChange = (data: { id: number; value: any }) => {
			gameState.variables[data.id] = data.value;
		};
		bridge.onRPGMVEvent("variable-changed", onVariableChange);
		eventListeners.push({ type: "variable-changed", callback: onVariableChange });

		// 开关变化监听
		const onSwitchChange = (data: { id: number; value: boolean }) => {
			gameState.switches[data.id] = data.value;
		};
		bridge.onRPGMVEvent("switch-changed", onSwitchChange);
		eventListeners.push({ type: "switch-changed", callback: onSwitchChange });

		// 玩家数据变化监听
		const onPlayerDataChange = (data: Partial<GameState["playerData"]>) => {
			Object.assign(gameState.playerData, data);
		};
		bridge.onRPGMVEvent("player-data-changed", onPlayerDataChange);
		eventListeners.push({ type: "player-data-changed", callback: onPlayerDataChange });

		// 场景变化监听
		const onSceneChange = (data: { sceneName: string }) => {
			gameState.currentScene = data.sceneName;
		};
		bridge.onRPGMVEvent("scene-changed", onSceneChange);
		eventListeners.push({ type: "scene-changed", callback: onSceneChange });

		// 地图变化监听
		const onMapChange = (data: { mapId: number }) => {
			gameState.mapId = data.mapId;
		};
		bridge.onRPGMVEvent("map-changed", onMapChange);
		eventListeners.push({ type: "map-changed", callback: onMapChange });

		// 连接状态监听
		const onConnectionChange = (data: { connected: boolean }) => {
			gameState.isConnected = data.connected;
		};
		bridge.onRPGMVEvent("connection-changed", onConnectionChange);
		eventListeners.push({ type: "connection-changed", callback: onConnectionChange });

		console.log("Game state listeners set up");
	};

	// 清理事件监听
	const cleanupListeners = () => {
		const bridge = getBridge();
		if (bridge && eventListeners.length > 0) {
			eventListeners.forEach(({ type, callback }) => {
				bridge.offRPGMVEvent(type, callback);
			});
			eventListeners = [];
			console.log("Game state listeners cleaned up");
		}
	};

	// 检查连接状态
	const checkConnection = () => {
		const bridge = getBridge();
		if (bridge) {
			gameState.isConnected = bridge.isRPGMVReady();
		}
	};

	return {
		// 状态
		gameState: readonly(gameState),
		isLoading,
		lastError,

		// 方法
		setVariable,
		setSwitch,
		showMessage,
		playSE,
		changeScene,
		transferPlayer,
		refreshGameState,
		setupListeners,
		cleanupListeners,
		checkConnection,
		clearError,

		// 计算属性
		isConnected: computed(() => gameState.isConnected),
		hasError: computed(() => !!lastError.value),
	};
}
