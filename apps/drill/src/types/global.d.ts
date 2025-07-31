import type { GameBridge } from "@/bridge/GameBridge";

declare global {
	interface Window {
		gameBridge: GameBridge;
		VueBridge: any;
		// RPGMV 全局对象
		$dataSystem: any;
		$gameMessage: any;
		$gameVariables: any;
		$gameSwitches: any;
		$gamePlayer: any;
		$gameScreen: any;
		$gameMap: any;
		$gameParty: any;
		$gameActors: any;
		SceneManager: any;
		Scene_Boot: any;
		Scene_Map: any;
		Scene_Menu: any;
	}
}

export {};
