/// <reference path="./rpg_core.d.ts" />
/// <reference path="./rpg_objects.d.ts" />
/// <reference path="./rpg_managers.d.ts" />
/// <reference path="./rpg_scenes.d.ts" />
/// <reference path="./rpg_sprites.d.ts" />
/// <reference path="./rpg_windows.d.ts" />
/// <reference path="./rpg_mv.d.ts" />

import type { GameBridge } from "@/bridge/GameBridge";

declare global {
	interface Window {
		gameBridge: GameBridge;
		VueBridge: any;

		// RPGMV 全局对象 - 使用已定义的类型而非any
		$dataSystem: Game_System;
		$gameMessage: Game_Message;
		$gameVariables: Game_Variables;
		$gameSwitches: Game_Switches;
		$gamePlayer: Game_Player;
		$gameScreen: Game_Screen;
		$gameMap: Game_Map;
		$gameParty: Game_Party;
		$gameActors: Game_Actors;
		$gameTemp: Game_Temp;
		$gameTimer: Game_Timer;
		$gameSelfSwitches: Game_SelfSwitches;
		$gameTroop: Game_Troop;

		// 管理器类
		SceneManager: SceneManagerStatic;
		SoundManager: SoundManagerStatic;
		StorageManager: SoundManagerStatic;
		AudioManager: AudioManagerStatic;
		ImageManager: ImageManagerStatic;
		PluginManager: PluginManagerStatic;

		// 场景类
		Scene_Boot: typeof Scene_Boot;
		Scene_Map: typeof Scene_Map;
		Scene_Menu: typeof Scene_Menu;
		Scene_Title: typeof Scene_Title;
		Scene_Gameover: typeof Scene_Gameover;
		Scene_Item: typeof Scene_Item;
		Scene_Skill: typeof Scene_Skill;
		Scene_Equip: typeof Scene_Equip;
		Scene_Status: typeof Scene_Status;
		Scene_Options: typeof Scene_Options;
		Scene_Save: typeof Scene_Save;
		Scene_Load: typeof Scene_Load;
		Scene_Battle: typeof Scene_Battle;

		// 游戏对象类
		Game_Actor: typeof Game_Actor;
		Game_Party: typeof Game_Party;
		Game_Troop: typeof Game_Troop;
		Game_Map: typeof Game_Map;
		Game_Player: typeof Game_Player;
		Game_Event: typeof Game_Event;
		Game_Interpreter: typeof Game_Interpreter;
		Game_Message: typeof Game_Message;
		Game_Switches: typeof Game_Switches;
		Game_Variables: typeof Game_Variables;
		Game_SelfSwitches: typeof Game_SelfSwitches;
		Game_Screen: typeof Game_Screen;
		Game_Timer: typeof Game_Timer;
		Game_System: typeof Game_System;
		Game_Temp: typeof Game_Temp;
	}
}

export {};
