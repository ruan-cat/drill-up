//=============================================================================
// Game_Party.js
//=============================================================================

//=============================================================================
/**
 * Game_Party
 * 队伍（四次元仓库）类
 *
 * 索引：	无
 * 来源：	继承于Game_Unit
 * 实例：	$gameParty
 * 应用：	> 被 DataManager.makeSaveContents 作为专门的存储对象类。
 * 			> 被 Scene_MenuBase 作为专门的 角色对象选择器。
 *
 * 作用域：	地图界面、战斗界面
 * 主功能：	定义一个队伍，容纳多个实例化的角色单位。
 * 子功能：	->数据类
 * 				->继承 单位组
 * 				->不含帧刷新
 * 			->D获取多个（继承）
 * 				->所有单位（继承）
 * 				->是否全部已死亡（继承）
 * 			->E单位组属性
 * 				->队伍能力
 * 				->计算先发制人概率
 * 				->计算偷袭概率
 * 			->2A仓库
 * 				->获取
 * 					> 武器
 * 					> 防具
 * 					> 物品
 * 				->容器
 * 					->获取容器
 * 					->获取数量
 * 					->最大数量
 * 					->是否数量已满
 * 					->添加 物品/武器/防具
 * 					->失去 物品/武器/防具
 * 					->消耗物品
 * 					->是否有指定 物品/武器/防具
 * 			->2B角色穿装备
 * 			->2C金钱
 * 			->2D全队员容器
 * 				->获取队员列表
 * 				->队伍管理
 * 					->角色入队
 * 					->角色离队
 * 					->切换顺序
 * 				->是否可使用物品（战斗时/菜单时）
 * 				->是否可控制（战斗时）
 * 			->2E玩家队员容器
 * 				->获取队员列表
 * 				->获取领队
 * 				->获取最大人数
 * 				->队伍名称
 * 				->初始队伍
 * 				->死亡的队员恢复1HP
 * 				->战斗结束移除状态
 * 			->2F战斗测试模式
 * 				->队员设置
 * 				->仓库设置
 * 			->2G步数累计
 * 			->2H存档数据
 * 				->获取 行走图索引
 * 				->获取 脸图索引
 * 			->2I菜单界面角色信息
 * 				->当前选中的物品
 * 				->当前选中的角色
 * 				->目标角色
 * 			->2J战斗姿势SV
 * 				->播放胜利姿势
 * 				->播放逃跑姿势
 *
 * 说明：	> 2D全队员容器 和 2E玩家队员容器 是同一个容器，2E玩家队员容器 只是前几位的队员而已。
 * 		> 该类为存储数据，不能在实例中放obj对象。
 */
//=============================================================================

/**
 * @class Game_Party
 * @extends Game_Unit
 * @description 队伍类，管理角色队伍、物品仓库和金钱
 * The party class that manages actor party, item storage and gold
 */
function Game_Party() {
	this.initialize.apply(this, arguments);
}

Game_Party.prototype = Object.create(Game_Unit.prototype);
Game_Party.prototype.constructor = Game_Party;

/**
 * 初始化队伍
 * Initialize the party
 */
Game_Party.prototype.initialize = function () {
	Game_Unit.prototype.initialize.call(this);

	this._gold = 0; //2C金钱 / Gold amount

	this._steps = 0; //2G步数累计 / Step counter

	this._lastItem = new Game_Item(); //2I菜单界面角色信息 - 当前选中的物品 / Last selected item
	this._menuActorId = 0; //2I菜单界面角色信息 - 当前选中的角色 / Current menu actor ID
	this._targetActorId = 0; //2I菜单界面角色信息 - 目标角色 / Target actor ID

	this._actors = []; //2D全队员容器 和 2E玩家队员容器 / Actor container

	// > 2A仓库 - 初始化 / Initialize storage
	this.initAllItems();
};
