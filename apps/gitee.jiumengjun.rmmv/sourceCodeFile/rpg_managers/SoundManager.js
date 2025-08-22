/**
 * @fileoverview SoundManager - 声音管理器
 * @description 播放在数据库中定义的音效的静态类，管理系统音效
 * The static class that plays sound effects defined in the database, manages system sound effects
 * @author RPG Maker MV
 * @version 1.0.0
 */

//-----------------------------------------------------------------------------
/**
 * SoundManager - 声音管理器
 * 
 * 播放在数据库中定义的音效的静态类。
 * 这个类专门处理系统预定义的各种音效，如确认、取消、战斗音效等。
 * 
 * The static class that plays sound effects defined in the database.
 * This class specifically handles various predefined system sound effects such as
 * confirmation, cancellation, battle sounds, etc.
 */
function SoundManager() {
    throw new Error('This is a static class');
}

/**
 * 预加载重要声音
 * 加载光标、确认、取消、蜂鸣器等基础系统音效
 * 
 * Preload important sounds
 * Load basic system sound effects such as cursor, confirm, cancel, buzzer, etc.
 */
SoundManager.preloadImportantSounds = function() {
    this.loadSystemSound(0);
    this.loadSystemSound(1);
    this.loadSystemSound(2);
    this.loadSystemSound(3);
};

/**
 * 加载系统声音
 * Load system sound
 * 
 * @param {number} n - 系统音效索引 / System sound index
 */
SoundManager.loadSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.loadStaticSe($dataSystem.sounds[n]);
    }
};

/**
 * 播放系统声音
 * Play system sound
 * 
 * @param {number} n - 系统音效索引 / System sound index
 */
SoundManager.playSystemSound = function(n) {
    if ($dataSystem) {
        AudioManager.playStaticSe($dataSystem.sounds[n]);
    }
};

/**
 * 播放光标音效
 * 当用户在菜单中移动光标时播放
 * 
 * Play cursor sound effect
 * Played when user moves cursor in menu
 */
SoundManager.playCursor = function() {
    this.playSystemSound(0);
};

/**
 * 播放确认音效
 * 当用户确认选择时播放
 * 
 * Play OK sound effect
 * Played when user confirms selection
 */
SoundManager.playOk = function() {
    this.playSystemSound(1);
};

/**
 * 播放取消音效
 * 当用户取消操作时播放
 * 
 * Play cancel sound effect
 * Played when user cancels operation
 */
SoundManager.playCancel = function() {
    this.playSystemSound(2);
};

/**
 * 播放蜂鸣器音效
 * 当操作无效或出错时播放
 * 
 * Play buzzer sound effect
 * Played when operation is invalid or error occurs
 */
SoundManager.playBuzzer = function() {
    this.playSystemSound(3);
};

/**
 * 播放装备音效
 * 当角色装备物品时播放
 * 
 * Play equip sound effect
 * Played when character equips item
 */
SoundManager.playEquip = function() {
    this.playSystemSound(4);
};

/**
 * 播放保存音效
 * 当游戏保存时播放
 * 
 * Play save sound effect
 * Played when game is saved
 */
SoundManager.playSave = function() {
    this.playSystemSound(5);
};

/**
 * 播放加载音效
 * 当游戏载入时播放
 * 
 * Play load sound effect
 * Played when game is loaded
 */
SoundManager.playLoad = function() {
    this.playSystemSound(6);
};

/**
 * 播放战斗开始音效
 * 当战斗开始时播放
 * 
 * Play battle start sound effect
 * Played when battle starts
 */
SoundManager.playBattleStart = function() {
    this.playSystemSound(7);
};

/**
 * 播放逃跑音效
 * 当从战斗中逃跑时播放
 * 
 * Play escape sound effect
 * Played when escaping from battle
 */
SoundManager.playEscape = function() {
    this.playSystemSound(8);
};

/**
 * 播放敌人攻击音效
 * 当敌人攻击时播放
 * 
 * Play enemy attack sound effect
 * Played when enemy attacks
 */
SoundManager.playEnemyAttack = function() {
    this.playSystemSound(9);
};

/**
 * 播放敌人受到伤害音效
 * 当敌人受到伤害时播放
 * 
 * Play enemy damage sound effect
 * Played when enemy takes damage
 */
SoundManager.playEnemyDamage = function() {
    this.playSystemSound(10);
};

/**
 * 播放敌人倒下音效
 * 当普通敌人被击败时播放
 * 
 * Play enemy collapse sound effect
 * Played when normal enemy is defeated
 */
SoundManager.playEnemyCollapse = function() {
    this.playSystemSound(11);
};

/**
 * 播放 Boss 倒下音效 1
 * 当Boss被击败时播放（第一种音效）
 * 
 * Play Boss collapse sound effect 1
 * Played when Boss is defeated (first sound effect)
 */
SoundManager.playBossCollapse1 = function() {
    this.playSystemSound(12);
};

/**
 * 播放 Boss 倒下音效 2
 * 当Boss被击败时播放（第二种音效）
 * 
 * Play Boss collapse sound effect 2
 * Played when Boss is defeated (second sound effect)
 */
SoundManager.playBossCollapse2 = function() {
    this.playSystemSound(13);
};

/**
 * 播放角色受到伤害音效
 * 当我方角色受到伤害时播放
 * 
 * Play actor damage sound effect
 * Played when party member takes damage
 */
SoundManager.playActorDamage = function() {
    this.playSystemSound(14);
};

/**
 * 播放角色倒下音效
 * 当我方角色被击败时播放
 * 
 * Play actor collapse sound effect
 * Played when party member is defeated
 */
SoundManager.playActorCollapse = function() {
    this.playSystemSound(15);
};

/**
 * 播放恢复音效
 * 当角色恢复HP/MP或状态时播放
 * 
 * Play recovery sound effect
 * Played when character recovers HP/MP or status
 */
SoundManager.playRecovery = function() {
    this.playSystemSound(16);
};

/**
 * 播放未击中音效
 * 当攻击未命中目标时播放
 * 
 * Play miss sound effect
 * Played when attack misses target
 */
SoundManager.playMiss = function() {
    this.playSystemSound(17);
};

/**
 * 播放闪避音效
 * 当物理攻击被闪避时播放
 * 
 * Play evasion sound effect
 * Played when physical attack is evaded
 */
SoundManager.playEvasion = function() {
    this.playSystemSound(18);
};

/**
 * 播放魔法闪避音效
 * 当魔法攻击被闪避时播放
 * 
 * Play magic evasion sound effect
 * Played when magic attack is evaded
 */
SoundManager.playMagicEvasion = function() {
    this.playSystemSound(19);
};

/**
 * 播放反射音效
 * 当攻击被反射时播放
 * 
 * Play reflection sound effect
 * Played when attack is reflected
 */
SoundManager.playReflection = function() {
    this.playSystemSound(20);
};

/**
 * 播放商店音效
 * 当进入商店或进行商店交易时播放
 * 
 * Play shop sound effect
 * Played when entering shop or making shop transaction
 */
SoundManager.playShop = function() {
    this.playSystemSound(21);
};

/**
 * 播放使用物品音效
 * 当使用物品时播放
 * 
 * Play use item sound effect
 * Played when using item
 */
SoundManager.playUseItem = function() {
    this.playSystemSound(22);
};

/**
 * 播放使用技能音效
 * 当使用技能时播放
 * 
 * Play use skill sound effect
 * Played when using skill
 */
SoundManager.playUseSkill = function() {
    this.playSystemSound(23);
};