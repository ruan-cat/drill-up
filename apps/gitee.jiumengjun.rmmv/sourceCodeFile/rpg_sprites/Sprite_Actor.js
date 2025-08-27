/**
 * @fileoverview Sprite_Actor - 角色精灵类
 *
 * 显示角色的精灵。
 * The sprite for displaying an actor.
 *
 * @author 作者名
 * @since 1.0.0
 */

/**
 * 角色精灵类
 * Actor sprite class
 *
 * @class Sprite_Actor
 * @constructor
 * @extends Sprite_Battler
 */
function Sprite_Actor() {
	this.initialize.apply(this, arguments);
}
Sprite_Actor.prototype = Object.create(Sprite_Battler.prototype);
Sprite_Actor.prototype.constructor = Sprite_Actor;
/**
 * 动作常量定义
 * Motion constants definition
 *
 * @static
 * @memberof Sprite_Actor
 * @type {Object}
 * @property {Object} walk - 行走动作 Walk motion
 * @property {Object} wait - 待机动作 Wait motion  
 * @property {Object} chant - 吟唱动作 Chant motion
 * @property {Object} guard - 防御动作 Guard motion
 * @property {Object} damage - 受伤动作 Damage motion
 * @property {Object} evade - 躲避动作 Evade motion
 * @property {Object} thrust - 突刺动作 Thrust motion
 * @property {Object} swing - 挥舞动作 Swing motion
 * @property {Object} missile - 飞行道具动作 Missile motion
 * @property {Object} skill - 技能动作 Skill motion
 * @property {Object} spell - 魔法动作 Spell motion
 * @property {Object} item - 物品动作 Item motion
 * @property {Object} escape - 逃跑动作 Escape motion
 * @property {Object} victory - 胜利动作 Victory motion
 * @property {Object} dying - 频死动作 Dying motion
 * @property {Object} abnormal - 状态异常动作 Abnormal motion
 * @property {Object} sleep - 睡眠动作 Sleep motion
 * @property {Object} dead - 死亡动作 Dead motion
 */
Sprite_Actor.MOTIONS = {
	walk: { index: 0, loop: true },
	wait: { index: 1, loop: true },
	chant: { index: 2, loop: true },
	guard: { index: 3, loop: true },
	damage: { index: 4, loop: false },
	evade: { index: 5, loop: false },
	thrust: { index: 6, loop: false },
	swing: { index: 7, loop: false },
	missile: { index: 8, loop: false },
	skill: { index: 9, loop: false },
	spell: { index: 10, loop: false },
	item: { index: 11, loop: false },
	escape: { index: 12, loop: true },
	victory: { index: 13, loop: true },
	dying: { index: 14, loop: true },
	abnormal: { index: 15, loop: true },
	sleep: { index: 16, loop: true },
	dead: { index: 17, loop: true },
};
/**
 * 初始化角色精灵
 * Initialize actor sprite
 *
 * @memberof Sprite_Actor
 * @method initialize
 * @param {Game_Actor} battler - 角色战斗器 - Actor battler
 */
Sprite_Actor.prototype.initialize = function (battler) {
	Sprite_Battler.prototype.initialize.call(this, battler);
	this.moveToStartPosition();
};
/**
 * 初始化成员变量
 * Initialize member variables
 *
 * @memberof Sprite_Actor
 * @method initMembers
 */
Sprite_Actor.prototype.initMembers = function () {
	Sprite_Battler.prototype.initMembers.call(this);
	this._battlerName = "";
	this._motion = null;
	this._motionCount = 0;
	this._pattern = 0;
	this.createShadowSprite();
	this.createWeaponSprite();
	this.createMainSprite();
	this.createStateSprite();
};
/**
 * 创建主精灵
 * Create main sprite
 *
 * @memberof Sprite_Actor
 * @method createMainSprite
 */
Sprite_Actor.prototype.createMainSprite = function () {
	this._mainSprite = new Sprite_Base();
	this._mainSprite.anchor.x = 0.5;
	this._mainSprite.anchor.y = 1;
	this.addChild(this._mainSprite);
	this._effectTarget = this._mainSprite;
};
/**
 * 创建影子精灵
 * Create shadow sprite
 *
 * @memberof Sprite_Actor
 * @method createShadowSprite
 */
Sprite_Actor.prototype.createShadowSprite = function () {
	this._shadowSprite = new Sprite();
	this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
	this._shadowSprite.anchor.x = 0.5;
	this._shadowSprite.anchor.y = 0.5;
	this._shadowSprite.y = -2;
	this.addChild(this._shadowSprite);
};
/**
 * 创建武器精灵
 * Create weapon sprite
 *
 * @memberof Sprite_Actor
 * @method createWeaponSprite
 */
Sprite_Actor.prototype.createWeaponSprite = function () {
	this._weaponSprite = new Sprite_Weapon();
	this.addChild(this._weaponSprite);
};
/**
 * 创建状态精灵
 * Create state sprite
 *
 * @memberof Sprite_Actor
 * @method createStateSprite
 */
Sprite_Actor.prototype.createStateSprite = function () {
	this._stateSprite = new Sprite_StateOverlay();
	this.addChild(this._stateSprite);
};
/**
 * 设置战斗者
 * Set battler
 *
 * @memberof Sprite_Actor
 * @method setBattler
 * @param {Game_Actor} battler - 角色战斗者 - Actor battler
 */
Sprite_Actor.prototype.setBattler = function (battler) {
	Sprite_Battler.prototype.setBattler.call(this, battler);
	var changed = battler !== this._actor;
	if (changed) {
		this._actor = battler;
		if (battler) {
			this.setActorHome(battler.index());
		}
		this.startEntryMotion();
		this._stateSprite.setup(battler);
	}
};
/**
 * 移动到开始位置
 * Move to start position
 *
 * @memberof Sprite_Actor
 * @method moveToStartPosition
 */
Sprite_Actor.prototype.moveToStartPosition = function () {
	this.startMove(300, 0, 0);
};
/**
 * 设置角色位置
 * Set actor home position
 *
 * @memberof Sprite_Actor
 * @method setActorHome
 * @param {Number} index - 角色索引 - Actor index
 */
Sprite_Actor.prototype.setActorHome = function (index) {
	this.setHome(600 + index * 32, 280 + index * 48);
};
/**
 * 更新精灵
 * Update sprite
 *
 * @memberof Sprite_Actor
 * @method update
 */
Sprite_Actor.prototype.update = function () {
	Sprite_Battler.prototype.update.call(this);
	this.updateShadow();
	if (this._actor) {
		this.updateMotion();
	}
};
/**
 * 更新影子
 * Update shadow
 *
 * @memberof Sprite_Actor
 * @method updateShadow
 */
Sprite_Actor.prototype.updateShadow = function () {
	this._shadowSprite.visible = !!this._actor;
};
/**
 * 更新主函数
 * Update main
 *
 * @memberof Sprite_Actor
 * @method updateMain
 */
Sprite_Actor.prototype.updateMain = function () {
	Sprite_Battler.prototype.updateMain.call(this);
	if (this._actor.isSpriteVisible() && !this.isMoving()) {
		this.updateTargetPosition();
	}
};
/**
 * 设置动作
 * Setup motion
 *
 * @memberof Sprite_Actor
 * @method setupMotion
 */
Sprite_Actor.prototype.setupMotion = function () {
	if (this._actor.isMotionRequested()) {
		this.startMotion(this._actor.motionType());
		this._actor.clearMotion();
	}
};
/**
 * 设置武器动画
 * Setup weapon animation
 *
 * @memberof Sprite_Actor
 * @method setupWeaponAnimation
 */
Sprite_Actor.prototype.setupWeaponAnimation = function () {
	if (this._actor.isWeaponAnimationRequested()) {
		this._weaponSprite.setup(this._actor.weaponImageId());
		this._actor.clearWeaponAnimation();
	}
};
/**
 * 开始动作
 * Start motion
 *
 * @memberof Sprite_Actor
 * @method startMotion
 * @param {String} motionType - 动作类型 - Motion type
 */
Sprite_Actor.prototype.startMotion = function (motionType) {
	var newMotion = Sprite_Actor.MOTIONS[motionType];
	if (this._motion !== newMotion) {
		this._motion = newMotion;
		this._motionCount = 0;
		this._pattern = 0;
	}
};
/**
 * 更新目标位置
 * Update target position
 *
 * @memberof Sprite_Actor
 * @method updateTargetPosition
 */
Sprite_Actor.prototype.updateTargetPosition = function () {
	if (this._actor.isInputting() || this._actor.isActing()) {
		this.stepForward();
	} else if (this._actor.canMove() && BattleManager.isEscaped()) {
		this.retreat();
	} else if (!this.inHomePosition()) {
		this.stepBack();
	}
};
/**
 * 更新位图
 * Update bitmap
 *
 * @memberof Sprite_Actor
 * @method updateBitmap
 */
Sprite_Actor.prototype.updateBitmap = function () {
	Sprite_Battler.prototype.updateBitmap.call(this);
	var name = this._actor.battlerName();
	if (this._battlerName !== name) {
		this._battlerName = name;
		this._mainSprite.bitmap = ImageManager.loadSvActor(name);
	}
};
/**
 * 更新帧
 * Update frame
 *
 * @memberof Sprite_Actor
 * @method updateFrame
 */
Sprite_Actor.prototype.updateFrame = function () {
	Sprite_Battler.prototype.updateFrame.call(this);
	var bitmap = this._mainSprite.bitmap;
	if (bitmap) {
		var motionIndex = this._motion ? this._motion.index : 0;
		var pattern = this._pattern < 3 ? this._pattern : 1;
		var cw = bitmap.width / 9;
		var ch = bitmap.height / 6;
		var cx = Math.floor(motionIndex / 6) * 3 + pattern;
		var cy = motionIndex % 6;
		this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
	}
};
/**
 * 更新移动
 * Update move
 *
 * @memberof Sprite_Actor
 * @method updateMove
 */
Sprite_Actor.prototype.updateMove = function () {
	var bitmap = this._mainSprite.bitmap;
	if (!bitmap || bitmap.isReady()) {
		Sprite_Battler.prototype.updateMove.call(this);
	}
};
/**
 * 更新动作
 * Update motion
 *
 * @memberof Sprite_Actor
 * @method updateMotion
 */
Sprite_Actor.prototype.updateMotion = function () {
	this.setupMotion();
	this.setupWeaponAnimation();
	if (this._actor.isMotionRefreshRequested()) {
		this.refreshMotion();
		this._actor.clearMotion();
	}
	this.updateMotionCount();
};
/**
 * 更新动作计数
 * Update motion count
 *
 * @memberof Sprite_Actor
 * @method updateMotionCount
 */
Sprite_Actor.prototype.updateMotionCount = function () {
	if (this._motion && ++this._motionCount >= this.motionSpeed()) {
		if (this._motion.loop) {
			this._pattern = (this._pattern + 1) % 4;
		} else if (this._pattern < 2) {
			this._pattern++;
		} else {
			this.refreshMotion();
		}
		this._motionCount = 0;
	}
};
/**
 * 获取动作速度
 * Get motion speed
 *
 * @memberof Sprite_Actor
 * @method motionSpeed
 * @returns {Number} 动作速度 - Motion speed
 */
Sprite_Actor.prototype.motionSpeed = function () {
	return 12;
};
/**
 * 刷新动作
 * Refresh motion
 *
 * @memberof Sprite_Actor
 * @method refreshMotion
 */
Sprite_Actor.prototype.refreshMotion = function () {
	var actor = this._actor;
	var motionGuard = Sprite_Actor.MOTIONS["guard"];
	if (actor) {
		if (this._motion === motionGuard && !BattleManager.isInputting()) {
			return;
		}
		var stateMotion = actor.stateMotionIndex();
		if (actor.isInputting() || actor.isActing()) {
			this.startMotion("walk");
		} else if (stateMotion === 3) {
			this.startMotion("dead");
		} else if (stateMotion === 2) {
			this.startMotion("sleep");
		} else if (actor.isChanting()) {
			this.startMotion("chant");
		} else if (actor.isGuard() || actor.isGuardWaiting()) {
			this.startMotion("guard");
		} else if (stateMotion === 1) {
			this.startMotion("abnormal");
		} else if (actor.isDying()) {
			this.startMotion("dying");
		} else if (actor.isUndecided()) {
			this.startMotion("walk");
		} else {
			this.startMotion("wait");
		}
	}
};
/**
 * 开始进入动作
 * Start entry motion
 *
 * @memberof Sprite_Actor
 * @method startEntryMotion
 */
Sprite_Actor.prototype.startEntryMotion = function () {
	if (this._actor && this._actor.canMove()) {
		this.startMotion("walk");
		this.startMove(0, 0, 30);
	} else if (!this.isMoving()) {
		this.refreshMotion();
		this.startMove(0, 0, 0);
	}
};
/**
 * 踏步向前
 * Step forward
 *
 * @memberof Sprite_Actor
 * @method stepForward
 */
Sprite_Actor.prototype.stepForward = function () {
	this.startMove(-48, 0, 12);
};
/**
 * 踏步向后
 * Step back
 *
 * @memberof Sprite_Actor
 * @method stepBack
 */
Sprite_Actor.prototype.stepBack = function () {
	this.startMove(0, 0, 12);
};
/**
 * 撤退
 * Retreat
 *
 * @memberof Sprite_Actor
 * @method retreat
 */
Sprite_Actor.prototype.retreat = function () {
	this.startMove(300, 0, 30);
};
/**
 * 当移动结束
 * On move end
 *
 * @memberof Sprite_Actor
 * @method onMoveEnd
 */
Sprite_Actor.prototype.onMoveEnd = function () {
	Sprite_Battler.prototype.onMoveEnd.call(this);
	if (!BattleManager.isBattleEnd()) {
		this.refreshMotion();
	}
};
/**
 * 伤害显示X偏移
 * Damage offset X
 *
 * @memberof Sprite_Actor
 * @method damageOffsetX
 * @returns {Number} X偏移值 - X offset value
 */
Sprite_Actor.prototype.damageOffsetX = function () {
	return -32;
};
/**
 * 伤害显示Y偏移
 * Damage offset Y
 *
 * @memberof Sprite_Actor
 * @method damageOffsetY
 * @returns {Number} Y偏移值 - Y offset value
 */
Sprite_Actor.prototype.damageOffsetY = function () {
	return 0;
};
