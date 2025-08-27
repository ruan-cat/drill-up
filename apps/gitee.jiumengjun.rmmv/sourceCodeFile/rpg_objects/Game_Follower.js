//=============================================================================
// Game_Follower.js
//=============================================================================

/**
 * @fileoverview Game_Follower - 游戏跟随者类
 *
 * 跟随者的游戏对象类。
 * The game object class for a follower. A follower is an allied character,
 * other than the front character, displayed in the party.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * @class Game_Follower
 * @extends Game_Character
 * @description 游戏跟随者类，用于表示队伍中的跟随成员
 * Game follower class that represents following members in the party
 */
function Game_Follower() {
	this.initialize.apply(this, arguments);
}

Game_Follower.prototype = Object.create(Game_Character.prototype);
Game_Follower.prototype.constructor = Game_Follower;

/**
 * 初始化跟随者
 * Initialize follower
 *
 * @memberof Game_Follower
 * @method initialize
 * @param {number} memberIndex - 成员索引 / Member index
 */
Game_Follower.prototype.initialize = function (memberIndex) {
	Game_Character.prototype.initialize.call(this);
	this._memberIndex = memberIndex;
	this.setTransparent($dataSystem.optTransparent);
	this.setThrough(true);
};

/**
 * 刷新跟随者
 * Refresh follower
 *
 * @memberof Game_Follower
 * @method refresh
 */
Game_Follower.prototype.refresh = function () {
	var characterName = this.isVisible() ? this.actor().characterName() : "";
	var characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
	this.setImage(characterName, characterIndex);
};

/**
 * 获取角色
 * Get actor
 *
 * @memberof Game_Follower
 * @method actor
 * @returns {Game_Actor} 角色对象 / Actor object
 */
Game_Follower.prototype.actor = function () {
	return $gameParty.battleMembers()[this._memberIndex];
};

/**
 * 检查是否可见
 * Check if visible
 *
 * @memberof Game_Follower
 * @method isVisible
 * @returns {boolean} 是否可见 / Whether visible
 */
Game_Follower.prototype.isVisible = function () {
	return this.actor() && $gamePlayer.followers().isVisible();
};

/**
 * 更新跟随者
 * Update follower
 *
 * @memberof Game_Follower
 * @method update
 */
Game_Follower.prototype.update = function () {
	Game_Character.prototype.update.call(this);
	this.setMoveSpeed($gamePlayer.realMoveSpeed());
	this.setOpacity($gamePlayer.opacity());
	this.setBlendMode($gamePlayer.blendMode());
	this.setWalkAnime($gamePlayer.hasWalkAnime());
	this.setStepAnime($gamePlayer.hasStepAnime());
	this.setDirectionFix($gamePlayer.isDirectionFixed());
	this.setTransparent($gamePlayer.isTransparent());
};

/**
 * 追逐人物
 * Chase character
 *
 * @memberof Game_Follower
 * @method chaseCharacter
 * @param {Game_Character} character - 要追逐的人物 / Character to chase
 */
Game_Follower.prototype.chaseCharacter = function (character) {
	var sx = this.deltaXFrom(character.x);
	var sy = this.deltaYFrom(character.y);
	if (sx !== 0 && sy !== 0) {
		this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
	} else if (sx !== 0) {
		this.moveStraight(sx > 0 ? 4 : 6);
	} else if (sy !== 0) {
		this.moveStraight(sy > 0 ? 8 : 2);
	}
	this.setMoveSpeed($gamePlayer.realMoveSpeed());
};
