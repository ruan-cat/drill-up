//=============================================================================
// MOG_BattleCry.js
//=============================================================================

/*:
 * @plugindesc (v1.4)[v1.0]  战斗UI - 角色音效
 * @author Moghunter （Drill_up翻译）
 *
 * @param 音量
 * @type number
 * @min 0
 * @desc 角色发动动作的默认音量。
 * @default 120 
 * 
 * @help  
 * =============================================================================
 * +++ MOG - Battle Cry (v1.4) +++
 * By Moghunter 
 * https://mogplugins.wordpress.com/
 * =============================================================================
 * 发动招式时，会发出指定角色的配音。
 * ★★需要关联外部声音文件★★
 * ★★需要配置大量资源（角色每个动作都可拥有多个随机音效）★★
 * ★★该插件需要直接在脚本中配置★★
 * ★★该插件与事件中的开关变量0018有关系★★
 *
 * -----------------------------------------------------------------------------
 * ----设定注意事项
 * 1.插件的作用域：战斗界面。
 *   在每次战斗行动时，播放声音。
 * 2.配音的脚本位置在 /js/plugins/MOG_BattleCry.js 。
 * 
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================

    // Não modifique essa parte.
    // ☢CAUTION!!☢ Don't Touch.^_^ ----------------------------------------
　　var Imported = Imported || {};
　　Imported.MOG_BattleCry = true;
　　var Moghunter = Moghunter || {}; 	
	Moghunter.parameters = PluginManager.parameters('MOG_BattleCry');
	Moghunter.v_volume = Number(Moghunter.parameters['音量'] || 100);
    Moghunter.v_actor_start = [];
	Moghunter.v_actor_turn = [];
	Moghunter.v_actor_default_action = [];
	Moghunter.v_actor_skill = [];
	Moghunter.v_actor_item = [];
	Moghunter.v_actor_damage = [];
	Moghunter.v_actor_evaded = [];
	Moghunter.v_actor_dead = [];
    Moghunter.v_actor_recover = [];
	Moghunter.v_actor_counter = [];
	Moghunter.v_actor_reflection = [];
	Moghunter.v_actor_victory = [];
	Moghunter.v_actor_levelup = [];
	Moghunter.v_actor_escape = [];
	Moghunter.v_enemy_default_action = [];
	Moghunter.v_enemy_damage = [];
	Moghunter.v_enemy_evaded = [];
	Moghunter.v_enemy_counter = [];
	Moghunter.v_enemy_reflection = [];	
	Moghunter.v_enemy_dead = [];
    Moghunter.v_enemy_recover = [];
	Moghunter.v_enemy_skill = [];
    // ☢CAUTION!!☢ Don't Touch.^_^ ----------------------------------------
	
	
	
	
	// 设置 ----------------------------------------------------------------
	// 格式设置如下：
	//
	// Moghunter.v_actor_start[A] = [B,B,B,B...]
	//
	// A - 角色的编号（填1,2,3,4,不能填0001）
	// B - 声音文件（可以填数个文件，战斗时会随机引用声音文件）
	//
	// -----------------------------------------------------------------------
	
	// -----------------------------------------------------------------------
	// 角色 - 战斗开始
	// -----------------------------------------------------------------------
	Moghunter.v_actor_start[1] = [];//按照[5]的格式填入声音文件名，要用双引号和逗号分隔
	Moghunter.v_actor_start[2] = [];
	Moghunter.v_actor_start[3] = [];
	Moghunter.v_actor_start[4] = [];
	Moghunter.v_actor_start[5] = ["角色_量子妹_开始战斗_01_[未知]","角色_量子妹_开始战斗_02_[未知]","角色_量子妹_开始战斗_03_[未知]"];
	Moghunter.v_actor_start[6] = ["角色_珍妮_开始战斗_01_[未知]","角色_珍妮_开始战斗_02_[未知]","角色_珍妮_开始战斗_03_[未知]"];
	Moghunter.v_actor_start[7] = [];
	Moghunter.v_actor_start[8] = Moghunter.v_actor_start[9] = [];	//两个角色用同一种声音文件可以这样写
	// -----------------------------------------------------------------------
	// 角色 - 战斗回合
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_turn[1] = [];
	Moghunter.v_actor_turn[2] = [];
	Moghunter.v_actor_turn[3] = [];
	Moghunter.v_actor_turn[4] = [];
	Moghunter.v_actor_turn[5] = ["角色_量子妹_开始回合_01_[未知]","角色_量子妹_开始回合_02_[未知]","角色_量子妹_开始回合_03_[未知]"];
	Moghunter.v_actor_turn[6] = ["角色_珍妮_开始回合_01_[未知]","角色_珍妮_开始回合_02_[未知]"];
	Moghunter.v_actor_turn[7] = [];
	Moghunter.v_actor_turn[8] = Moghunter.v_actor_turn[9] = [];
	// -----------------------------------------------------------------------
	// 角色 - 攻击/释放技能/使用物品 默认声音
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_default_action[1] = [];
	Moghunter.v_actor_default_action[2] = [];
	Moghunter.v_actor_default_action[3] = [];
	Moghunter.v_actor_default_action[4] = [];
	Moghunter.v_actor_default_action[5] = ["角色_量子妹_攻击_01_[未知]","角色_量子妹_攻击_02_[未知]","角色_量子妹_攻击_03_[未知]","角色_量子妹_攻击_04_[未知]","角色_量子妹_攻击_05_[未知]","角色_量子妹_攻击_06_[未知]"];
	Moghunter.v_actor_default_action[6] = ["角色_珍妮_攻击_01_[未知]","角色_珍妮_攻击_02_[未知]","角色_珍妮_攻击_03_[未知]","角色_珍妮_攻击_04_[未知]"];
	Moghunter.v_actor_default_action[7] = [];
	Moghunter.v_actor_default_action[8] = Moghunter.v_actor_default_action[9] = [];
	// -----------------------------------------------------------------------
	// 角色 - 释放技能 指定技能单独配音
	// -----------------------------------------------------------------------	
	// 格式设置如下：
	// Moghunter.v_actor_skill[A] = {B:[C,C,C,C,...] }
	// 
	// A - 角色的编号（填1,2,3,4,不能填0001）
	// B - 技能的编号（填1,2,3,4,不能填0001）
	// C - 声音文件（可以填数个文件，战斗时会随机引用声音文件）
	// -----------------------------------------------------------------------	
    Moghunter.v_actor_skill[1] = {
		 2:[""], // 技能-防御（这里设置防御不发音）
	};
	Moghunter.v_actor_skill[2] = {
		 2:[""], // 技能-防御
    };
	Moghunter.v_actor_skill[3] = {
		 2:[""], // 技能-防御
	};
	Moghunter.v_actor_skill[4] = {
		 2:[""], // 技能-防御
	};
	Moghunter.v_actor_skill[5] = {
		 2:[""], // 技能-防御
	};
	Moghunter.v_actor_skill[6] = {
		 2:[""], // 技能-防御
	};
	Moghunter.v_actor_skill[7] = {
		 2:[""], // 技能-防御
	};
	Moghunter.v_actor_skill[8] = Moghunter.v_actor_skill[9] = {
		 2:[""], // 技能-防御
	};
	// -----------------------------------------------------------------------
	// 角色 - 使用物品 指定物品单独配音
	// -----------------------------------------------------------------------	
    Moghunter.v_actor_item[1] = {};
	Moghunter.v_actor_item[2] = {};
	Moghunter.v_actor_item[3] = {};
	Moghunter.v_actor_item[4] = {};	
	Moghunter.v_actor_item[5] = {	
		//这里的设置为：量子妹使用药品，会发出援助的配音，而使用其他物品，则默认
		//（所有物品的声音要一个一个设置）
		1:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],2:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    3:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],4:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    5:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],6:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    7:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],8:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    9:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],10:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    11:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    16:["角色_量子妹_使用道具_01_[未知]"],17:["角色_量子妹_使用道具_01_[未知]"],18:["角色_量子妹_使用道具_01_[未知]"],
	    19:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],20:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    21:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],22:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    23:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],24:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
	    25:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],26:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
		29:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],30:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"],
		31:["角色_量子妹_使用道具_01_[未知]","角色_量子妹_使用道具_02_[未知]"]
		};
	Moghunter.v_actor_item[6] = {
		1:["角色_珍妮_使用道具_01_[未知]"],2:["角色_珍妮_使用道具_01_[未知]"],3:["角色_珍妮_使用道具_01_[未知]"],
		4:["角色_珍妮_使用道具_01_[未知]"],5:["角色_珍妮_使用道具_01_[未知]"],6:["角色_珍妮_使用道具_01_[未知]"],
		7:["角色_珍妮_使用道具_01_[未知]"],8:["角色_珍妮_使用道具_01_[未知]"],9:["角色_珍妮_使用道具_01_[未知]"],
		10:["角色_珍妮_使用道具_01_[未知]"],11:["角色_珍妮_使用道具_01_[未知]"],
		16:["角色_珍妮_使用道具_01_[未知]"],17:["角色_珍妮_使用道具_01_[未知]"],18:["角色_珍妮_使用道具_01_[未知]"],
		19:["角色_珍妮_使用道具_01_[未知]"],20:["角色_珍妮_使用道具_01_[未知]"],21:["角色_珍妮_使用道具_01_[未知]"],
		22:["角色_珍妮_使用道具_01_[未知]"],23:["角色_珍妮_使用道具_01_[未知]"],24:["角色_珍妮_使用道具_01_[未知]"],
		25:["角色_珍妮_使用道具_01_[未知]"],26:["角色_珍妮_使用道具_01_[未知]"],29:["角色_珍妮_使用道具_01_[未知]"],
		30:["角色_珍妮_使用道具_01_[未知]"],31:["角色_珍妮_使用道具_01_[未知]"]
		};
	Moghunter.v_actor_item[7] = {};
	Moghunter.v_actor_item[8] = Moghunter.v_actor_item[9] = {};
	// -----------------------------------------------------------------------
	// 角色 - 受伤
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_damage[1] = [];
	Moghunter.v_actor_damage[2] = [];
	Moghunter.v_actor_damage[3] = [];
	Moghunter.v_actor_damage[4] = [];
	Moghunter.v_actor_damage[5] = ["角色_量子妹_受伤_01_[未知]","角色_量子妹_受伤_02_[未知]","角色_量子妹_受伤_03_[未知]","角色_量子妹_受伤_04_[未知]","角色_量子妹_受伤_05_[未知]"];
	Moghunter.v_actor_damage[6] = ["角色_珍妮_受伤_01_[未知]","角色_珍妮_受伤_02_[未知]","角色_珍妮_受伤_03_[未知]","角色_珍妮_受伤_04_[未知]","角色_珍妮_受伤_05_[未知]"];
	Moghunter.v_actor_damage[7] = [];
	Moghunter.v_actor_damage[8] = Moghunter.v_actor_damage[9] = [];
	// -----------------------------------------------------------------------
	// 角色 - 闪避
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_evaded[1] = [""];
	Moghunter.v_actor_evaded[2] = [""];
	Moghunter.v_actor_evaded[3] = [""];
	Moghunter.v_actor_evaded[4] = [""];	
	Moghunter.v_actor_evaded[5] = [""];	//这里设置闪避不发音
	Moghunter.v_actor_evaded[6] = [""];	
	Moghunter.v_actor_evaded[7] = [""];	
	Moghunter.v_actor_evaded[8] = Moghunter.v_actor_evaded[9] = [""];
	// -----------------------------------------------------------------------
	// 角色 - 物理反击
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_counter[1] = [];
	Moghunter.v_actor_counter[2] = [];
	Moghunter.v_actor_counter[3] = [];
	Moghunter.v_actor_counter[4] = [];
	Moghunter.v_actor_counter[5] = ["角色_量子妹_攻击_02_[未知]","角色_量子妹_攻击_03_[未知]","角色_量子妹_攻击_04_[未知]","角色_量子妹_攻击_06_[未知]"];	
	Moghunter.v_actor_counter[6] = ["角色_珍妮_攻击_01_[未知]","角色_珍妮_攻击_02_[未知]","角色_珍妮_攻击_03_[未知]","角色_珍妮_攻击_04_[未知]"];
	Moghunter.v_actor_counter[7] = [];
	Moghunter.v_actor_counter[8] = Moghunter.v_actor_counter[9] = [];
	// -----------------------------------------------------------------------
	// 角色 - 魔法反射
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_reflection[1] = [""];
	Moghunter.v_actor_reflection[2] = [""];
	Moghunter.v_actor_reflection[3] = [""];
	Moghunter.v_actor_reflection[4] = [""];
	Moghunter.v_actor_reflection[5] = [""];//这里设置反射不发音
	Moghunter.v_actor_reflection[6] = [""];
	Moghunter.v_actor_reflection[7] = [""];
	Moghunter.v_actor_reflection[8] = Moghunter.v_actor_reflection[9] = [""];
	// -----------------------------------------------------------------------
	// 角色 - 复活
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_recover[1] = [""];
	Moghunter.v_actor_recover[2] = [""];
	Moghunter.v_actor_recover[3] = [""];
	Moghunter.v_actor_recover[4] = [""];
	Moghunter.v_actor_recover[5] = [""];//这里设置复活不发音
	Moghunter.v_actor_recover[6] = [""];
	Moghunter.v_actor_recover[7] = [""];
	Moghunter.v_actor_recover[8] = Moghunter.v_actor_recover[9] = [""];
	// -----------------------------------------------------------------------
	// 角色 - 死亡
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_dead[1] = [];
	Moghunter.v_actor_dead[2] = [];
	Moghunter.v_actor_dead[3] = [];
	Moghunter.v_actor_dead[4] = [];
	Moghunter.v_actor_dead[5] = ["角色_量子妹_死亡_01_[未知]","角色_量子妹_死亡_02_[未知]"];
	Moghunter.v_actor_dead[6] = ["角色_珍妮_死亡_01_[未知]","角色_珍妮_死亡_02_[未知]"];
	Moghunter.v_actor_dead[7] = [];
	Moghunter.v_actor_dead[8] = Moghunter.v_actor_dead[9] = [];
	// -----------------------------------------------------------------------
	// 角色 - 逃跑
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_escape[1] = [];
	Moghunter.v_actor_escape[2] = [];
	Moghunter.v_actor_escape[3] = [];
	Moghunter.v_actor_escape[4] = [];
	Moghunter.v_actor_escape[5] = ["角色_量子妹_逃跑_01_[未知]"];
	Moghunter.v_actor_escape[6] = ["角色_珍妮_逃跑_01_[未知]"];
	Moghunter.v_actor_escape[7] = [];
	Moghunter.v_actor_escape[8] = Moghunter.v_actor_escape[9] = [""];
	// -----------------------------------------------------------------------
	// 角色 - 胜利
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_victory[1] = [];
	Moghunter.v_actor_victory[2] = [];
	Moghunter.v_actor_victory[3] = [];
	Moghunter.v_actor_victory[4] = [];
	Moghunter.v_actor_victory[5] = ["角色_量子妹_战斗胜利_01_[未知]","角色_量子妹_战斗胜利_02_[未知]"];
	Moghunter.v_actor_victory[6] = ["角色_珍妮_战斗胜利_01_[未知]","角色_珍妮_战斗胜利_02_[未知]"];
	Moghunter.v_actor_victory[7] = [];
	Moghunter.v_actor_victory[8] = Moghunter.v_actor_victory[9] = [];
	// -----------------------------------------------------------------------
	// 角色 - 升级
	// -----------------------------------------------------------------------		
	Moghunter.v_actor_levelup[1] = [];
	Moghunter.v_actor_levelup[2] = [];
	Moghunter.v_actor_levelup[3] = [];
	Moghunter.v_actor_levelup[4] = [];
	Moghunter.v_actor_levelup[5] = ["角色_量子妹_升级_01_[未知]","角色_量子妹_升级_02_[未知]"];	
	Moghunter.v_actor_levelup[6] = ["角色_珍妮_升级_01_[未知]"];
	Moghunter.v_actor_levelup[7] = [];;	
	Moghunter.v_actor_levelup[8] = Moghunter.v_actor_levelup[9] = [];
	
	
	// -----------------------------------------------------------------------
	// 敌人 - 默认声音（敌人和角色一样，需要一个一个配。）
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_default_action[1] = [""];
	Moghunter.v_enemy_default_action[2] = [""];
	// -----------------------------------------------------------------------
	// 敌人 - 技能
	// -----------------------------------------------------------------------	
    Moghunter.v_enemy_skill[1] = {
		 2:[""], // 技能-防御
	};
    Moghunter.v_enemy_skill[2] = {
		 2:[""], // 技能-防御
	};
	// -----------------------------------------------------------------------
	// 敌人 - 受伤
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_damage[1] = [""];
	Moghunter.v_enemy_damage[2] = [""];
	// -----------------------------------------------------------------------
	// 敌人 - 闪避
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_evaded[1] = [""];	
	Moghunter.v_enemy_evaded[2] = [""];
	// -----------------------------------------------------------------------
	// 敌人 - 反击
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_counter[1] = [""];
	Moghunter.v_enemy_counter[2] = [""];
	// -----------------------------------------------------------------------
	// 敌人 - 反射
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_reflection[1] = [""];
	Moghunter.v_enemy_reflection[2] = [""];
	// -----------------------------------------------------------------------
	// 敌人 - 复活
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_recover[1] = [""];
	Moghunter.v_enemy_recover[2] = [""];
	// -----------------------------------------------------------------------
	// 敌人 - 死亡
	// -----------------------------------------------------------------------		
	Moghunter.v_enemy_dead[1] = [""];
	Moghunter.v_enemy_dead[2] = [""];	
  
  
  
  
  
//=============================================================================
// ** Sound Manager
//=============================================================================	

//==============================
// * select Voice
//==============================
SoundManager.selectVoice = function(voices){ 
   if (!voices) {return};
   if (voices.length === 0) {return};
   if (!$gameSwitches.value(18)) {return};	//!!第18个开关（战斗音效打开/关闭）
   var voiceIndex = Math.randomInt(voices.length);
   var fileName = voices[voiceIndex];
   this.playVoice(fileName);
};

//==============================
// * Play Voice
//==============================
SoundManager.playVoice = function(fileName){
   var se = {};
   se.name = fileName;
   se.pitch = 100;
   se.volume = Moghunter.v_volume;
   AudioManager.playSe(se);
};   
  
//=============================================================================
// ** BattleManager
//=============================================================================	

//================================
// ** Random Actor
//================================
BattleManager.randomActor = function() {
    var actorIndex = Math.randomInt($gameParty.aliveMembers().length);
    return $gameParty.aliveMembers()[actorIndex];
};

//==================================
// ** Start Battle
//==================================
var _alias_mog_bmngr_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
     _alias_mog_bmngr_startBattle.call(this);
	 if (!Imported.MOG_BattleTransitions || 
	      (Imported.MOG_BattleTransitions && $gameSystem._treType[1] === -1)) {
	     var actor = this.randomActor();
        if (actor) {SoundManager.selectVoice(actor._v_start)};
     };
};

//==================================
// ** Process Victory
//==================================
var _alias_mog_bcry_processVictory = BattleManager.processVictory;
BattleManager.processVictory = function() {
	 var actor = this.randomActor();
     if (actor) {SoundManager.selectVoice(actor._v_victory)};	
     _alias_mog_bcry_processVictory.call(this);	 
};

//==================================
// ** Process Escape
//==================================
var _alias_mog_bcry_processEscape = BattleManager.processEscape;
BattleManager.processEscape = function() {
	 var actor = this.randomActor();
     if (actor) {SoundManager.selectVoice(actor._v_escape)};		
	 _alias_mog_bcry_processEscape.call(this);	 
};

//=============================================================================
// ** Game Battler
//=============================================================================

//==============================
// * InitMembers
//==============================
var _alias_mog_batcry_gbattler_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    _alias_mog_batcry_gbattler_initMembers.call(this);
    this.battleCrySetup();
};

//==============================
// * Battle Cry Setup
//==============================
Game_Battler.prototype.battleCrySetup = function() {
	this._v_start = [];
	this._v_turn = [];
	this._v_default_action = [];
	this._v_damage = [];
	this._v_evaded = [];
	this._v_counter = [];
	this._v_reflection = [];
	this._v_dead = [];
	this._v_recover = [];
	this._v_escape = [];
	this._v_victory = [];
	this._v_levelup = [];
};

//==============================
// * Battle Cry Setup Actor
//==============================
Game_Battler.prototype.battleCrySetupActor = function() {
	if (Moghunter.v_actor_start[this._actorId]) {this._v_start = Moghunter.v_actor_start[this._actorId]}; 
	if (Moghunter.v_actor_turn[this._actorId]) {this._v_turn = Moghunter.v_actor_turn[this._actorId]};
	if (Moghunter.v_actor_default_action[this._actorId]) {
		this._v_default_action = Moghunter.v_actor_default_action[this._actorId]};
	if (Moghunter.v_actor_damage[this._actorId]) {this._v_damage = Moghunter.v_actor_damage[this._actorId]};
	if (Moghunter.v_actor_evaded[this._actorId]) {this._v_evaded = Moghunter.v_actor_evaded[this._actorId]};
	if (Moghunter.v_actor_counter[this._actorId]) {this._v_counter = Moghunter.v_actor_counter[this._actorId]};
	if (Moghunter.v_actor_reflection[this._actorId]) {this._v_reflection = Moghunter.v_actor_reflection[this._actorId]};
	if (Moghunter.v_actor_dead[this._actorId]) {this._v_dead = Moghunter.v_actor_dead[this._actorId]};
	if (Moghunter.v_actor_recover[this._actorId]) {this._v_recover = Moghunter.v_actor_recover[this._actorId]};
	if (Moghunter.v_actor_escape[this._actorId]) {this._v_escape = Moghunter.v_actor_escape[this._actorId]};
	if (Moghunter.v_actor_victory[this._actorId]) {this._v_victory = Moghunter.v_actor_victory[this._actorId]};
	if (Moghunter.v_actor_levelup[this._actorId]) {this._v_levelup = Moghunter.v_actor_levelup[this._actorId]};
};

//==============================
// * Battle Cry Setup Enemy
//==============================
Game_Battler.prototype.battleCrySetupEnemy = function() {
	if (Moghunter.v_enemy_default_action[this._enemyId]) {
		this._v_default_action = Moghunter.v_enemy_default_action[this._enemyId]};
	if (Moghunter.v_enemy_damage[this._enemyId]) {this._v_damage = Moghunter.v_enemy_damage[this._enemyId]};
	if (Moghunter.v_enemy_evaded[this._enemyId]) {this._v_evaded = Moghunter.v_enemy_evaded[this._enemyId]};
	if (Moghunter.v_enemy_counter[this._enemyId]) {this._v_counter = Moghunter.v_enemy_counter[this._enemyId]};
	if (Moghunter.v_enemy_reflection[this._enemyId]) {this._v_reflection = Moghunter.v_enemy_reflection[this._enemyId]};
	if (Moghunter.v_enemy_dead[this._enemyId]) {this._v_dead = Moghunter.v_enemy_dead[this._enemyId]};
	if (Moghunter.v_enemy_recover[this._enemyId]) {this._v_recover = Moghunter.v_enemy_recover[this._enemyId]};
};

//===============================
// ** PerfotmAction
//===============================
var _alias_mog_bcry_performActionStart = Game_Battler.prototype.performActionStart;
Game_Battler.prototype.performActionStart = function(action) {
   if (action) {this.playVoiceAction(action)};
   _alias_mog_bcry_performActionStart.call(this, action);
};

//===============================
// ** play Voice Action
//===============================
Game_Battler.prototype.playVoiceAction = function(action) {
     var actionID = action.item().id
	 if (this.isActor()) {
		 if (action.isSkill() && Moghunter.v_actor_skill[this._actorId] && 
		     Moghunter.v_actor_skill[this._actorId][actionID]) {
    		 SoundManager.selectVoice(Moghunter.v_actor_skill[this._actorId][actionID]);
			 return;
		 } else if (action.isItem() && Moghunter.v_actor_item[this._actorId] &&
		     Moghunter.v_actor_item[this._actorId][actionID]) {
			 SoundManager.selectVoice(Moghunter.v_actor_item[this._actorId][actionID]); 
			 return;
		 };
	 } else if (this.isEnemy()) {
		 if (Moghunter.v_enemy_skill[this._enemyId] && Moghunter.v_enemy_skill[this._enemyId][actionID]) {
    		 SoundManager.selectVoice(Moghunter.v_enemy_skill[this._enemyId][actionID]);
			 return;
		 };		 
	 };
	  SoundManager.selectVoice(this._v_default_action);
};

//==============================
// ** perform Counter
//==============================
var _mog_btcry_gbat_performCounter = Game_Battler.prototype.performCounter;
Game_Battler.prototype.performCounter = function() {
    _mog_btcry_gbat_performCounter.call(this);
    SoundManager.selectVoice(this._v_counter);	
};


//==============================
// ** perform Reflection
//==============================
var _mog_btcry_gbat_performReflection = Game_Battler.prototype.performReflection;
Game_Battler.prototype.performReflection = function() {
	_mog_btcry_gbat_performReflection.call(this);
    SoundManager.selectVoice(this._v_reflection);
};

//=============================================================================
// ** Game Actor
//=============================================================================	

//==============================
// * Setup
//==============================
var _mog_bcry_gact_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
	_mog_bcry_gact_setup.call(this,actorId);
	this.battleCrySetupActor();
};

//=============================================================================
// ** Game Enemy
//=============================================================================	

//==============================
// * Setup
//==============================
var _mog_bcry_gemy_setup = Game_Enemy.prototype.setup; 
Game_Enemy.prototype.setup = function(enemyId, x, y) {
	_mog_bcry_gemy_setup.call(this,enemyId, x, y);
	this.battleCrySetupEnemy();
};

//===============================
// ** transform
//===============================
var _mog_battlecry_genemy_transform = Game_Enemy.prototype.transform;
Game_Enemy.prototype.transform = function(enemyId) {
	_mog_battlecry_genemy_transform.call(this,enemyId);
	this.battleCrySetupEnemy();
};

//=============================================================================
// ** Scene Battle
//=============================================================================	

//==============================
// * select Voice
//==============================
var _alias_mog_bcry_scbat_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
	_alias_mog_bcry_scbat_start.call(this);
	this._actorvoice = null;  
};

//==============================
// * Update Battle Process
//==============================
var _alias_mog_bcry_updateBattleProcess = Scene_Battle.prototype.updateBattleProcess;
Scene_Battle.prototype.updateBattleProcess = function() {
	if (this._actorvoice != BattleManager.actor()) {this.playActorTurn()};
	_alias_mog_bcry_updateBattleProcess.call(this);	
};

//==============================
// * Play Actor Turn
//==============================
Scene_Battle.prototype.playActorTurn = function() {
	 this._actorvoice = BattleManager.actor();	 
     if (this._actorvoice) {
		if (this._actorvoice._v_turn && this._actorvoice._v_turn.length > 0) {
		     AudioManager.stopSe(); 
		     SoundManager.selectVoice(this._actorvoice._v_turn)
		};
     };
};

//=============================================================================
// ** Game Action
//=============================================================================

//==============================
// * Apply
//==============================
var _alias_mog_bcry_gaction_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	 var old_hp = target.hp
	 _alias_mog_bcry_gaction_apply.call(this,target);
	 if ($gameParty.inBattle()) {
        if (old_hp != target.hp || this.item().damage.type === 3) {this.playVoiceHP(old_hp,target.hp,target)};
	    if (target.result().missed || target.result().evaded) {SoundManager.selectVoice(target._v_evaded)};
	 };
};

//==============================
// * Play Voice HP
//==============================
Game_Action.prototype.playVoiceHP = function(old_hp,now_hp,target) {
   if (target.isDead()) {
       SoundManager.selectVoice(target._v_dead);
   } else if (old_hp < now_hp || this.item().damage.type === 3) {
	   SoundManager.selectVoice(target._v_recover);
   } else if (old_hp > now_hp) {
       SoundManager.selectVoice(target._v_damage);
   };
};

//==============================
// * Item Effect Recover HP
//==============================
var _alias_mog_btcry_gact_itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
	var old_hp = target.hp;
	_alias_mog_btcry_gact_itemEffectRecoverHp.call(this,target, effect)
	if (old_hp <= target.hp) {SoundManager.selectVoice(target._v_recover)};
};
