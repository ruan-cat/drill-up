//=============================================================================
// Drill_BattleGif.js
//=============================================================================

/*:
 * @plugindesc [v2.3]        战斗 - 多层战斗GIF
 * @author Drill_up
 * 
 * @Drill_LE_param "GIF样式-%d"
 * @Drill_LE_parentKey "---GIF样式组%d至%d---"
 * @Drill_LE_var "DrillUp.g_BGi_style_length"
 * 
 * 
 * @help 
 * =============================================================================
 * +++ Drill_BattleGif +++
 * 作者：Drill_up
 * 如果你有兴趣，也可以来看看更多我写的drill插件哦ヽ(*。>Д<)o゜
 * https://rpg.blue/thread-409713-1-1.html
 * =============================================================================
 * 你可以在战斗界面中放置一个或者多个GIF。
 * 
 * -----------------------------------------------------------------------------
 * ----插件扩展
 * 该插件 不能 单独使用。
 * 基于：
 *   - Drill_CoreOfBallistics      数学模型-弹道核心★★v2.2及以上★★
 *
 * -----------------------------------------------------------------------------
 * ----设定注意事项
 * 1.插件的作用域：战斗界面。
 *   作用于战斗层级。
 * 2.该插件可以装饰战斗的各种层级。要了解更详细的组合方法，
 *   去看看 "17.主菜单 > 多层组合装饰（界面装饰）.docx"。
 *   还有 "17.主菜单 > 多层组合装饰（界面装饰-战斗界面）.docx"。
 * 3.该插件的指令较多且使用频繁，建议使用小工具：插件信息查看器。
 *   在开启游戏编辑器时，可以并行使用读取器复制指令。
 * 战斗层级：
 *   (1.你可以将贴图放置在战斗的四种层级中，分别为：
 *      下层、上层、图片层、最顶层
 *   (2.战斗层级之间的关系为：
 *      底图 《 战斗背景 《 下层 《 敌人/角色层 《 上层
 *      《 图片对象层 《 图片层 《 对话框集合 《 最顶层
 *   (3.最顶层可以把战斗界面的对话框、窗口也给挡住。
 *   (4.处于同一 战斗层级 时，将根据 图片层级 再先后排序。
 * 位移比：
 *   (1.根据物理相对运动知识，近大远小，近快远慢的原则。要让GIF看起
 *      来真的"远"，那需要设置位移比接近1.00，越接近1.00越远。
 *   (2.去看看最新版本的 文档图解 介绍，
 *      这里是看起来简单但是实际做起来非常复杂的坑。
 * 预加载：
 *   (1.插件中可自定义指定资源是否预加载，
 *      预加载相关介绍可以去看看"1.系统 > 关于预加载.docx"。
 * 细节：
 *   (1.插件指令操作的变化结果，是永久性的。
 *
 * -----------------------------------------------------------------------------
 * ----关联文件
 * 资源路径：img/Battle__layer_gif （Battle后面有两个下划线）
 * 先确保项目img文件夹下是否有Battle__layer_gif文件夹！
 * 要查看所有关联资源文件的插件，可以去看看"插件清单.xlsx"。
 * 如果没有，需要自己建立。需要配置资源文件：
 *
 * GIF样式-1 资源-GIF
 * GIF样式-2 资源-GIF
 * GIF样式-3 资源-GIF
 * ……
 *
 * 所有素材都放在Battle__layer_gif文件夹下。
 * 
 * -----------------------------------------------------------------------------
 * ----激活条件
 * 你需要通过插件指令手动的创建对象：
 * 
 * 插件指令：>战斗GIF : 创建 : GIF[11] : 样式[1]
 * 插件指令：>战斗GIF : 创建 : GIF[11] : 样式[1] //"资源文件为：xxxx"
 * 插件指令：>战斗GIF : 删除 : GIF[11]
 * 插件指令：>战斗GIF : 删除全部
 * 插件指令：>清空全部战斗装饰部件
 * 
 * 1.注意，必须先创建对象，才能再修改属性、移动，否则插件指令无效。
 * 2.由于插件指令配置后，没法直接知道 样式 对应哪个对象，因此你可以在
 *   样式后面写注释说明，注意"样式[1]"后面要有一个空格。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 初始属性调整
 * 创建对象后，可以修改初始属性：
 * 
 * 插件指令：>战斗GIF : GIF[2] : 初始属性调整 : 位置[0,0] : 战斗层级[下层] : 图片层级[2] : 旋转速度[1.0] : 位移比[0.0,0.0]
 * 
 * 1.在插件参数里面一个个配置战斗GIF参数非常麻烦，为了方便微调参数，
 *   你可以使用"初始属性调整"功能，微调插件配置的默认参数。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 延迟修改单属性
 * 你可以通过插件指令手动延迟修改各个属性：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 隐藏(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF变量[21] : 隐藏(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : 批量GIF[7,8] : 隐藏(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : 批量GIF变量[21,22] : 隐藏(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : 全部GIF : 隐藏(延迟) : 延迟执行时间[20]
 * 
 * 插件指令：>战斗GIF : GIF[11] : 显示(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 隐藏(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 暂停(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 继续(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 透明度[255] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 透明度变量[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 旋转[90] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 旋转变量[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 转速[10.0] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 转速变量[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 缩放X[1.2] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 缩放X变量%[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 缩放Y[1.2] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 缩放Y变量%[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 斜切X[0.2] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 斜切X变量%[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 斜切Y[0.2] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性(延迟) : 斜切Y变量%[21] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 还原所有单属性(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 立即取消全部延迟指令
 * 
 * 1.前半部分（GIF变量[21]）和 后半部分（隐藏(延迟) : 延迟执行时间[20]）
 *   的参数可以随意组合。一共有5*20种组合方式。
 * 2.设置延迟指令后，指令会被暂存到延迟队列中，等待延迟时间结束之后，执行指令。
 *   "立即取消全部延迟指令"可以清空排在队列中的所有延迟指令。
 * 3.此功能可以简化 并行事件 的设计，你可以在串行事件中执行延迟，延迟后并行变化贴图。
 * 4.上述指令可以在地图界面中预先执行，只有进入到战斗界面之后，延迟时间才开始计时。
 * 
 * 以下是旧版本的指令，也可以用：
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变透明 : 延迟[150] : 变化时间[60] : 透明度[255]
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变透明 : 延迟[150] : 变化时间[60] : 透明度变量[21]
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变转速 : 延迟[150] : 变化时间[60] : 转速[10.0]
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变转速 : 延迟[150] : 变化时间[60] : 转速变量[21]
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变缩放 : 延迟[150] : 变化时间[60] : 缩放[1.2,1.2]
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变斜切 : 延迟[150] : 变化时间[60] : 斜切[0.5,0.5]
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 延迟移动到
 * 你可以通过插件指令手动设置延迟移动：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-匀速移动 : 位置[100,100] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-匀速移动 : 位置变量[25,26] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-弹性移动 : 位置[100,100] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-弹性移动 : 位置变量[25,26] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-增减速移动 : 位置[100,100] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-增减速移动 : 位置变量[25,26] : 时间[60] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 移动到(延迟)-延迟归位 : 延迟执行时间[20]
 * 
 * 1.前半部分（GIF[11]）和 后半部分（移动到(延迟)-匀速移动 : 位置[100,100] : 时间[60] : 延迟执行时间[20]）
 *   的参数可以随意组合。一共有5*7种组合方式。
 * 2.移动的初始位置以显示在战斗界面的具体位置为基准，在基准位置上再进行移动到。
 *   指令中不含相对移动，比如多次执行移动到[20,20]，贴图只会到达一个固定的位置。
 * 3.上述指令可以在地图界面中预先执行，只有进入到战斗界面之后，延迟时间才开始计时。
 * 
 * 以下是旧版本的指令，也可以用：
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变坐标 : 延迟[150] : 变化时间[60] : 位置[100,100]
 * 插件指令(旧)：>战斗GIF : GIF[11] : 变坐标 : 延迟[150] : 变化时间[60] : 位置变量[25,26]
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 延迟GIF播放
 * 你还可以通过插件指令控制延迟GIF播放：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 锁定帧(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 解锁帧(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 设置帧(延迟) : 当前帧[1] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 设置帧(延迟) : 当前帧变量[21] : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 正向播放一次并停留在末尾帧(延迟) : 延迟执行时间[20]
 * 插件指令：>战斗GIF : GIF[11] : 反向播放一次并停留在起始帧(延迟) : 延迟执行时间[20]
 * 
 * 1.前半部分和后半部分的参数可以随意组合，一共有5*6种组合方式。
 * 2."设置当前帧"的 当前帧，1表示第1帧。
 *   你可以设置GIF锁定在某一帧，帧数与资源配置的id对应。
 * 3."正向播放一次并停留在末尾帧"表示强制该GIF播放重头到尾播放一次。
 *   播放完毕后，自动锁定到末尾帧。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 修改单属性
 * 上述的插件指令中，你也可以在 战斗界面 即时执行修改属性：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 显示
 * 插件指令：>战斗GIF : GIF变量[21] : 显示
 * 插件指令：>战斗GIF : 批量GIF[7,8] : 显示
 * 插件指令：>战斗GIF : 批量GIF变量[21,22] : 显示
 * 插件指令：>战斗GIF : 全部GIF : 显示
 * 
 * 插件指令：>战斗GIF : GIF[11] : 显示
 * 插件指令：>战斗GIF : GIF[11] : 隐藏
 * 插件指令：>战斗GIF : GIF[11] : 暂停
 * 插件指令：>战斗GIF : GIF[11] : 继续
 * 插件指令：>战斗GIF : GIF[11] : 切换混合模式[0]
 * 插件指令：>战斗GIF : GIF[11] : 切换战斗层级[下层]
 * 插件指令：>战斗GIF : GIF[11] : 切换图片层级[10]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 透明度[255] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 透明度变量[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 旋转[90] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 旋转变量[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 转速[10.0] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 转速变量[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 缩放X[1.2] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 缩放X变量%[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 缩放Y[1.2] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 缩放Y变量%[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 斜切X[0.2] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 斜切X变量%[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 斜切Y[0.2] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 修改单属性 : 斜切Y变量%[21] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 立即还原所有单属性
 * 
 * 1.前半部分（GIF变量[21]）和 后半部分（显示）
 *   的参数可以随意组合。一共有5*22种组合方式。
 * 2."旋转"、"转速"的变化效果可以叠加。
 *   "切换战斗层级["能切换的层级为：下层、上层、图片层、最顶层。
 * 3.插件指令的变化是永久性的。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 移动到
 * 上述的插件指令中，你也可以在 战斗界面 即时执行移动：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 移动到-匀速移动 : 位置[100,100] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 移动到-匀速移动 : 位置变量[25,26] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 移动到-弹性移动 : 位置[100,100] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 移动到-弹性移动 : 位置变量[25,26] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 移动到-增减速移动 : 位置[100,100] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 移动到-增减速移动 : 位置变量[25,26] : 时间[60]
 * 插件指令：>战斗GIF : GIF[11] : 移动到-立即归位
 * 
 * 1.前半部分（GIF[11]）和 后半部分（移动到-匀速移动 : 位置[100,100] : 时间[60]）
 *   的参数可以随意组合。一共有5*7种组合方式。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 修改中心锚点
 * 你可以通过插件指令手动修改中心锚点：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 修改中心锚点 : 锚点[0.5,0.5]
 * 插件指令：>战斗GIF : GIF变量[21] : 修改中心锚点 : 锚点[0.5,0.5]
 * 
 * 1.注意，由于中心锚点会影响缩放、旋转效果，
 *   最好在创建后，修改一次中心锚点，就不要再动了。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - 获取属性
 * 你可以通过插件指令来获取 战斗GIF 的属性值：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 位置X : 变量[21]
 * 插件指令：>战斗GIF : GIF变量[21] : 获取属性 : 位置X : 变量[21]
 * 
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 位置X : 变量[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 位置Y : 变量[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 透明度 : 变量[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 旋转 : 变量[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 转速 : 变量[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 缩放X : 变量%[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 缩放Y : 变量%[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 斜切X : 变量%[21]
 * 插件指令：>战斗GIF : GIF[11] : 获取属性 : 斜切Y : 变量%[21]
 * 
 * 1.前半部分（GIF[11]）和 后半部分（获取属性 : 位置X : 变量[21]）
 *   的参数可以随意组合。一共有2*9种组合方式。
 * 2."变量%["表示该变量获取到属性时，会乘以100倍。因为变量只能存整数。
 *   比如缩放值为1.2时，则获取到： 1.2 * 100 = 120。
 * 
 * -----------------------------------------------------------------------------
 * ----可选设定 - GIF播放
 * 你还可以通过插件指令控制GIF播放：
 * 
 * 插件指令：>战斗GIF : GIF[11] : 锁定帧
 * 插件指令：>战斗GIF : GIF[11] : 解锁帧
 * 插件指令：>战斗GIF : GIF[11] : 设置当前帧 : 当前帧[1]
 * 插件指令：>战斗GIF : GIF[11] : 设置当前帧 : 当前帧变量[21]
 * 插件指令：>战斗GIF : GIF[11] : 正向播放一次并停留在末尾帧
 * 插件指令：>战斗GIF : GIF[11] : 反向播放一次并停留在起始帧
 * 
 * 1.前半部分和后半部分的参数可以随意组合，一共有5*6种组合方式。
 * 
 * -----------------------------------------------------------------------------
 * ----插件性能
 * 测试仪器：   4G 内存，Intel Core i5-2520M CPU 2.5GHz 处理器
 *              Intel(R) HD Graphics 3000 集显 的垃圾笔记本
 *              (笔记本的3dmark综合分：571，鲁大师综合分：48456)
 * 总时段：     20000.00ms左右
 * 对照表：     0.00ms  - 40.00ms （几乎无消耗）
 *              40.00ms - 80.00ms （低消耗）
 *              80.00ms - 120.00ms（中消耗）
 *              120.00ms以上      （高消耗）
 * 工作类型：   持续执行
 * 时间复杂度： o(n^2)*o(贴图处理) 每帧
 * 测试方法：   在战斗中放置多个GIF，进行性能测试。
 * 测试结果：   战斗界面中，平均消耗为：【22.30ms】
 *
 * 1.插件只在自己作用域下工作消耗性能，在其它作用域下是不工作的。
 *   测试结果并不是精确值，范围在给定值的10ms范围内波动。
 *   更多性能介绍，去看看 "0.性能测试报告 > 关于插件性能.docx"。
 * 2.从原理上来说，多层GIF只是固定放置的贴图，但由于在战斗中随时可能
 *   需要变换，所以消耗会稍微多一些。
 *
 * -----------------------------------------------------------------------------
 * ----更新日志
 * [v1.0]
 * 完成插件ヽ(*。>Д<)o゜
 * [v1.1]
 * 添加了图片层、最顶层的设置。
 * [v1.2]
 * 添加了设置固定帧、播放帧的插件指令。
 * [v1.3]
 * 修改了插件关联的资源文件夹。
 * [v1.4]
 * 添加了最大值编辑的支持。
 * [v1.5]
 * 优化了内部结构。
 * [v1.6]
 * 优化了战斗层级结构。
 * [v1.7]
 * 优化了与战斗活动镜头的变换关系。
 * [v1.8]
 * 优化了旧存档的识别与兼容。
 * [v1.9]
 * 整理了延迟插件指令的功能。
 * [v2.0]
 * 大幅度优化了底层结构，加强了插件的功能。
 * [v2.1]
 * 修改了插件与屏幕快照的兼容性。
 * [v2.2]
 * 修复了延迟指令报错的bug。
 * [v2.3]
 * 完善了变换功能的插件指令。
 * 
 * 
 * 
 * @param ---GIF样式组 1至20---
 * @default
 *
 * @param GIF样式-1
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-2
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-3
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-4
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-5
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-6
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-7
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-8
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-9
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-10
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-11
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-12
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-13
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-14
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-15
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-16
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-17
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-18
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-19
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-20
 * @parent ---GIF样式组 1至20---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组21至40---
 * @default
 *
 * @param GIF样式-21
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-22
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-23
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-24
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-25
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-26
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-27
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-28
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-29
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-30
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-31
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-32
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-33
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-34
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-35
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-36
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-37
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-38
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-39
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-40
 * @parent ---GIF样式组21至40---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组41至60---
 * @default
 *
 * @param GIF样式-41
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-42
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-43
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-44
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-45
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-46
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-47
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-48
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-49
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-50
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-51
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-52
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-53
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-54
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-55
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-56
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-57
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-58
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-59
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-60
 * @parent ---GIF样式组41至60---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组61至80---
 * @default
 *
 * @param GIF样式-61
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-62
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-63
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-64
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-65
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-66
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-67
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-68
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-69
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-70
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-71
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-72
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-73
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-74
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-75
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-76
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-77
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-78
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-79
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-80
 * @parent ---GIF样式组61至80---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组81至100---
 * @default
 *
 * @param GIF样式-81
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-82
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-83
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-84
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-85
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-86
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-87
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-88
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-89
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-90
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-91
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-92
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-93
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-94
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-95
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-96
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-97
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-98
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-99
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-100
 * @parent ---GIF样式组81至100---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组101至120---
 * @default
 *
 * @param GIF样式-101
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-102
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-103
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-104
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-105
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-106
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-107
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-108
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-109
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-110
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-111
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-112
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-113
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-114
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-115
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-116
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-117
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-118
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-119
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-120
 * @parent ---GIF样式组101至120---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组121至140---
 * @default
 *
 * @param GIF样式-121
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-122
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-123
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-124
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-125
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-126
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-127
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-128
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-129
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-130
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-131
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-132
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-133
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-134
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-135
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-136
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-137
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-138
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-139
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-140
 * @parent ---GIF样式组121至140---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组141至160---
 * @default
 *
 * @param GIF样式-141
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-142
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-143
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-144
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-145
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-146
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-147
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-148
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-149
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-150
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-151
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-152
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-153
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-154
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-155
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-156
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-157
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-158
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-159
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-160
 * @parent ---GIF样式组141至160---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组161至180---
 * @default
 *
 * @param GIF样式-161
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-162
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-163
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-164
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-165
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-166
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-167
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-168
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-169
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-170
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-171
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-172
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-173
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-174
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-175
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-176
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-177
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-178
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-179
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-180
 * @parent ---GIF样式组161至180---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param ---GIF样式组181至200---
 * @default
 *
 * @param GIF样式-181
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-182
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-183
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-184
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-185
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-186
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-187
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-188
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-189
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-190
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-191
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-192
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-193
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-194
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-195
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-196
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-197
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-198
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-199
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 * @param GIF样式-200
 * @parent ---GIF样式组181至200---
 * @type struct<BGiGIF>
 * @desc GIF的详细配置信息。
 * @default 
 *
 */
/*~struct~BGiGIF:
 * 
 * @param 标签
 * @desc 只用于方便区分查看的标签，不作用在插件中。
 * @default ==新的战斗GIF==
 * 
 * 
 * @param ---贴图---
 * @default 
 * 
 * @param 初始是否锁定帧
 * @parent ---贴图---
 * @type boolean
 * @on 锁定
 * @off 不锁定
 * @desc true - 锁定，false - 不锁定
 * @default false
 * 
 * @param 锁定帧数
 * @parent 初始是否锁定帧
 * @type number
 * @min 1
 * @desc 该GIF在游戏初始时锁定的帧数id，对应 资源 中的序号。
 * @default 1
 *
 * @param 资源-GIF
 * @parent ---贴图---
 * @desc png图片资源组，多张构成gif。
 * @default ["(需配置)战斗GIF"]
 * @require 1
 * @dir img/Battle__layer_gif/
 * @type file[]
 *
 * @param 帧间隔
 * @parent ---贴图---
 * @type number
 * @min 1
 * @desc gif每帧播放间隔时间，单位帧。（1秒60帧）
 * @default 4
 *
 * @param 是否倒放
 * @parent ---贴图---
 * @type boolean
 * @on 倒放
 * @off 不倒放
 * @desc true - 倒放，false - 不倒放
 * @default false
 *
 * @param 透明度
 * @parent ---贴图---
 * @type number
 * @min 0
 * @max 255
 * @desc 0为完全透明，255为完全不透明。
 * @default 255
 *
 * @param 是否预加载
 * @parent ---贴图---
 * @type boolean
 * @on 开启
 * @off 关闭
 * @desc true - 开启，false - 关闭，预加载详细介绍可见："1.系统 > 关于预加载.docx"。
 * @default false
 *
 * @param 混合模式
 * @parent ---贴图---
 * @type select
 * @option 普通
 * @value 0
 * @option 发光
 * @value 1
 * @option 实色混合(正片叠底)
 * @value 2
 * @option 浅色
 * @value 3
 * @option 叠加
 * @value 4
 * @desc pixi的渲染混合模式。0-普通,1-发光。其他更详细相关介绍，去看看"0.基本定义 > 混合模式.docx"。
 * @default 0
 *
 * @param 图像-色调值
 * @parent ---贴图---
 * @type number
 * @min 0
 * @max 360
 * @desc 资源图像的色调值。
 * @default 0
 *
 * @param 图像-模糊边缘
 * @parent ---贴图---
 * @type boolean
 * @on 模糊
 * @off 关闭
 * @desc 此参数为缩放设置，设置模糊后，缩放时可以模糊资源图像的边缘，防止出现像素锯齿。
 * @default false
 *
 * @param 平移-GIF X
 * @parent ---贴图---
 * @desc x轴方向平移，单位像素。0为贴在最左边。这里用来表示进入战斗时图片的初始位置。
 * @default 0
 *
 * @param 平移-GIF Y
 * @parent ---贴图---
 * @desc y轴方向平移，单位像素。0为贴在最上面。这里用来表示进入战斗时图片的初始位置。
 * @default 0
 *
 * @param 旋转速度
 * @parent ---贴图---
 * @desc 正数逆时针，负数顺时针，单位 角度/帧。(1秒60帧，360.0为一周)
 * @default 0.0
 *
 * @param 位移比X
 * @parent ---贴图---
 * @desc 与玩家战斗的镜头位置有关，设置1.00，GIF和镜头的位移一致。设置0.00则GIF不随镜头移动，紧贴战斗。负数则反向移动。
 * @default 0.00
 *
 * @param 位移比Y
 * @parent ---贴图---
 * @desc 与玩家战斗的镜头位置有关，设置1.00，GIF和镜头的位移一致。设置0.00则GIF不随镜头移动，紧贴战斗。负数则反向移动。
 * @default 0.00
 *
 * @param 战斗层级
 * @parent ---贴图---
 * @type select
 * @option 下层
 * @value 下层
 * @option 上层
 * @value 上层
 * @option 图片层
 * @value 图片层
 * @option 最顶层
 * @value 最顶层
 * @desc 战斗所在的层级位置，具体关系看看插件说明。
 * @default 下层
 *
 * @param 图片层级
 * @parent ---贴图---
 * @type number
 * @min 0
 * @desc GIF在同一个战斗层，先后排序的位置，0表示最后面。
 * @default 4
 * 
 * 
 * @param ---3d效果---
 * @desc 
 * 
 * @param 整体缩放 X
 * @parent ---3d效果---
 * @desc GIF的缩放X值，默认比例1.0。缩放将会使得GIF看起来旋转具有一定透视。
 * @default 1.0
 * 
 * @param 整体缩放 Y
 * @parent ---3d效果---
 * @desc GIF的缩放Y值，默认比例1.0。缩放将会使得GIF看起来旋转具有一定透视。
 * @default 1.0
 * 
 * @param 整体斜切 X
 * @parent ---3d效果---
 * @desc GIF的斜切X值，默认比例0.0。斜切将会使得GIF看起来旋转具有一定角度。
 * @default 0.0
 * 
 * @param 整体斜切 Y
 * @parent ---3d效果---
 * @desc GIF的斜切Y值，默认比例0.0。斜切将会使得GIF看起来旋转具有一定角度。
 * @default 0.0
 * 
 * 
 * @param ---自变化效果---
 * @default 
 *
 * @param 浮动效果
 * @parent ---自变化效果---
 * @type select
 * @option 关闭
 * @value 关闭
 * @option 左右浮动
 * @value 左右浮动
 * @option 上下浮动
 * @value 上下浮动
 * @option 左上右下斜向浮动
 * @value 左上右下斜向浮动
 * @option 右上左下斜向浮动
 * @value 右上左下斜向浮动
 * @desc 当前贴图，会来回浮动。
 * @default 关闭
 * 
 * @param 浮动速度
 * @parent 浮动效果
 * @desc 浮动变化的速度。
 * @default 1.0
 *
 * @param 浮动偏移量
 * @parent 浮动效果
 * @type number
 * @min 1
 * @desc 使用左右或者上下浮动时，浮动偏移的位置量，单位像素。
 * @default 15
 *
 * @param 闪烁效果
 * @parent ---自变化效果---
 * @type select
 * @option 关闭
 * @value 关闭
 * @option 开启
 * @value 开启
 * @desc 当前贴图，会来回闪烁。
 * @default 关闭
 * 
 * @param 闪烁速度
 * @parent 闪烁效果
 * @desc 闪烁明亮变化的速度。
 * @default 6.0
 * 
 * @param 闪烁幅度范围
 * @parent 闪烁效果
 * @type number
 * @min 1
 * @max 255
 * @desc 闪烁变化的透明度幅度范围。
 * @default 35
 * 
 * @param 摇晃效果
 * @parent ---自变化效果---
 * @type select
 * @option 关闭
 * @value 关闭
 * @option 开启
 * @value 开启
 * @desc 当前贴图，会来回摇晃。
 * @default 关闭
 * 
 * @param 摇晃速度
 * @parent 摇晃效果
 * @desc 来回摇晃变化的速度。
 * @default 4.0
 * 
 * @param 摇晃幅度范围
 * @parent 摇晃效果
 * @type number
 * @min 1
 * @desc 来回摇晃的幅度范围。单位角度。
 * @default 12
 *
 * @param 缩放效果
 * @parent ---自变化效果---
 * @type select
 * @option 关闭
 * @value 关闭
 * @option 左右缩放
 * @value 左右缩放
 * @option 上下缩放
 * @value 上下缩放
 * @option 整体缩放
 * @value 整体缩放
 * @desc 当前贴图，会来回缩放。
 * @default 关闭
 * 
 * @param 缩放速度
 * @parent 缩放效果
 * @desc 缩放大小变化的速度。
 * @default 1.0
 * 
 * @param 缩放幅度范围
 * @parent 缩放效果
 * @desc 缩放变化的比例幅度范围。
 * @default 0.2
 * 
 *
 */
 
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//		插件简称		BGi（Battle_GIF）
//		临时全局变量	DrillUp.g_BGi_xxx
//		临时局部变量	this._drill_BGi_xxx
//		存储数据变量	$gameSystem._drill_BGi_xxx
//		全局存储变量	无
//		覆盖重写方法	无
//
//<<<<<<<<性能记录<<<<<<<<
//
//		★工作类型		持续执行
//		★时间复杂度		o(n^2)*o(贴图处理) 每帧
//		★性能测试因素	战斗场景-变化示例
//		★性能测试消耗	2024/6/15：
//							》40.5ms（drill_sprite_updateChange）22.3ms（drill_sprite_updateCommandChange）18.3ms（drill_sprite_updateGIF）
//		★最坏情况		暂无
//		★备注			暂无
//		
//		★优化记录		暂无
//
//<<<<<<<<插件记录<<<<<<<<
//
//		★功能结构树：
//			->☆提示信息
//			->☆静态数据
//			->☆插件指令
//			->☆预加载
//			->☆存储数据
//			->☆战斗层级
//				->添加贴图到层级【标准函数】
//				->去除贴图【标准函数】
//				->图片层级排序【标准函数】
//				->层级与镜头的位移【标准函数】
//			
//			->☆控制器与贴图
//				->界面创建
//				->实时创建
//				->控制器与镜头
//					> 位移比
//					->控制器帧刷新
//				->基础特性
//				->销毁
//			
//			->战斗GIF控制器【Drill_BGi_Controller】
//				->A主体
//				->B变换特性
//				->C镜头参数
//				->D播放GIF
//					->设置帧
//					->锁定帧/解锁帧
//					->单次播放
//				->E随机位置
//				->F指令叠加变化
//				->G延迟指令
//				->H自变化效果
//			->战斗GIF贴图【Drill_BGi_Sprite】
//				->A主体
//				->B变换特性
//				->C对象绑定
//				->D播放GIF
//				->F指令叠加变化-控制器用
//				->G延迟指令
//				->H自变化效果
//
//
//		★家谱：
//			无
//		
//		★脚本文档：
//			17.主菜单 > 多层组合装饰（界面装饰-战斗界面）（脚本）.docx
//		
//		★插件私有类：
//			* 战斗GIF控制器【Drill_BGi_Controller】
//			* 战斗GIF贴图【Drill_BGi_Sprite】
//		
//		★必要注意事项：
//			1.
//
//		★其它说明细节：
//			暂无
//				
//		★存在的问题：
//			暂无
//

//=============================================================================
// ** ☆提示信息
//=============================================================================
	//==============================
	// * 提示信息 - 参数
	//==============================
	var DrillUp = DrillUp || {}; 
	DrillUp.g_BGi_PluginTip_curName = "Drill_BattleGif.js 战斗-多层战斗GIF";
	DrillUp.g_BGi_PluginTip_baseList = ["Drill_CoreOfBallistics.js 数学模型-弹道核心"];
	//==============================
	// * 提示信息 - 报错 - 缺少基础插件
	//			
	//			说明：	此函数只提供提示信息，不校验真实的插件关系。
	//==============================
	DrillUp.drill_BGi_getPluginTip_NoBasePlugin = function(){
		if( DrillUp.g_BGi_PluginTip_baseList.length == 0 ){ return ""; }
		var message = "【" + DrillUp.g_BGi_PluginTip_curName + "】\n缺少基础插件，去看看下列插件是不是 未添加 / 被关闭 / 顺序不对：";
		for(var i=0; i < DrillUp.g_BGi_PluginTip_baseList.length; i++){
			message += "\n- ";
			message += DrillUp.g_BGi_PluginTip_baseList[i];
		}
		return message;
	};
	//==============================
	// * 提示信息 - 报错 - 底层版本过低
	//==============================
	DrillUp.drill_BGi_getPluginTip_LowVersion = function(){
		return "【" + DrillUp.g_BGi_PluginTip_curName + "】\n游戏底层版本过低，插件基本功能无法执行。\n你可以去看\"rmmv软件版本（必看）.docx\"中的 \"旧工程升级至1.6版本\" 章节，来升级你的游戏底层版本。";
	};
	//==============================
	// * 提示信息 - 报错 - 强制更新提示
	//==============================
	DrillUp.drill_BGi_getPluginTip_NeedUpdate_Camera = function(){
		return "【" + DrillUp.g_BGi_PluginTip_curName + "】\n活动战斗镜头插件版本过低，你需要更新 镜头插件 至少v2.2及以上版本。";
	};
	//==============================
	// * 提示信息 - 报错 - 强制更新提示
	//==============================
	DrillUp.drill_BGi_getPluginTip_NeedUpdate_Ballistics = function(){
		return "【" + DrillUp.g_BGi_PluginTip_curName + "】\n弹道核心插件版本过低，你需要更新 弹道核心 至少v2.2及以上版本。";
	};
	//==============================
	// * 提示信息 - 报错 - 控制器的非数字参数
	//==============================
	DrillUp.drill_BGi_getPluginTip_controllerData_NotId = function( class_name ){
		return "【" + DrillUp.g_BGi_PluginTip_curName + "】\n错误，类对象 "+class_name+" 获取到了非数字参数，数据初始化失败。";
	};
	
	
//=============================================================================
// ** ☆静态数据
//=============================================================================
　　var Imported = Imported || {};
　　Imported.Drill_BattleGif = true;
　　Imported.Drill_LayerGIF = true;
　　var DrillUp = DrillUp || {}; 
    DrillUp.parameters = PluginManager.parameters('Drill_BattleGif');

	//==============================
	// * 静态数据 - GIF
	//				（~struct~BGiGIF）
	//==============================
	DrillUp.drill_BGi_gifInit = function( dataFrom ){
		var data = {};
		
		// > 预加载
		data['preload'] = String( dataFrom["是否预加载"] || "false") == "true";
		
		
		// > A主体 - 基础特性
		if( dataFrom["资源-GIF"] != "" &&
			dataFrom["资源-GIF"] != undefined ){
			data['src_img_gif'] = JSON.parse( dataFrom["资源-GIF"] );
		}else{
			data['src_img_gif'] = [];
		}
		data['src_img_file'] = "img/Battle__layer_gif/";
		data['interval'] = Number( dataFrom["帧间隔"] || 4);
		data['back_run'] = String( dataFrom["是否倒放"] || "false") == "true";
		
		data['tint'] = Number( dataFrom["图像-色调值"] || 0);
		data['smooth'] = String( dataFrom["图像-模糊边缘"] || "false") == "true";
		
		data['visible'] = true;
		data['blendMode'] = Number( dataFrom["混合模式"] || 0);
		data['layerIndex'] = String( dataFrom["战斗层级"] || "下层");
		data['zIndex'] = Number( dataFrom["图片层级"] || 0);
		
		// > A主体 - 其它特性
		data['pause'] = false;
		data['XPer'] = Number( dataFrom["位移比X"] || 0);
		data['YPer'] = Number( dataFrom["位移比Y"] || 0);
		
		
		// > B变换特性
		data['x'] = Number( dataFrom["平移-GIF X"] || 0);
		data['y'] = Number( dataFrom["平移-GIF Y"] || 0);
		data['rotate'] = Number( dataFrom["旋转速度"] || 0.0);
		data['opacity'] = Number( dataFrom["透明度"] || 255);
		data['anchor_x'] = 0.5;
		data['anchor_y'] = 0.5;
		
		// > B变换特性 - 3d效果
		data['scale_x'] = Number( dataFrom["整体缩放 X"] || 1.0);
		data['scale_y'] = Number( dataFrom["整体缩放 Y"] || 1.0);
		data['skew_x'] = Number( dataFrom["整体斜切 X"] || 0);
		data['skew_y'] = Number( dataFrom["整体斜切 Y"] || 0);
		data['parentRotate'] = 0;
		
		
		// > D播放GIF
		data['gif_lock'] = String( dataFrom["初始是否锁定帧"] || "false") == "true";
		data['gif_initFrame'] = Number( dataFrom["锁定帧数"] || 0);
		
		// > E随机位置
		//	（无）
		
		// > H自变化效果
		data['effect_float'] = String( dataFrom["浮动效果"] || "关闭");
		data['effect_floatSpeed'] = Number( dataFrom["浮动速度"] || 1.0);
		data['effect_floatRange'] = Number( dataFrom["浮动偏移量"] || 15);
		data['effect_flicker'] = String( dataFrom["闪烁效果"] || "关闭");
		data['effect_flickerSpeed'] = Number( dataFrom["闪烁速度"] || 6.0);
		data['effect_flickerRange'] = Number( dataFrom["闪烁幅度范围"] || 20);
		data['effect_swing'] = String( dataFrom["摇晃效果"] || "关闭");
		data['effect_swingSpeed'] = Number( dataFrom["摇晃速度"] || 4.0);
		data['effect_swingRange'] = Number( dataFrom["摇晃幅度范围"] || 12);
		data['effect_zoom'] = String( dataFrom["缩放效果"] || "关闭");
		data['effect_zoomSpeed'] = Number( dataFrom["缩放速度"] || 1.0);
		data['effect_zoomRange'] = Number( dataFrom["缩放幅度范围"] || 0.2);
		
		return data;
	}
	
	/*-----------------GIF------------------*/
	DrillUp.g_BGi_style_length = 200;
	DrillUp.g_BGi_style = [];
	for( var i = 0; i < DrillUp.g_BGi_style_length; i++ ){
		if( DrillUp.parameters["GIF样式-" + String(i+1) ] != undefined &&
			DrillUp.parameters["GIF样式-" + String(i+1) ] != "" ){
			var temp = JSON.parse(DrillUp.parameters["GIF样式-" + String(i+1) ]);
			DrillUp.g_BGi_style[i] = DrillUp.drill_BGi_gifInit( temp );
		}else{
			DrillUp.g_BGi_style[i] = undefined;		//（强制设为空值，节约存储资源）
		}
	}
	
	
	
//=============================================================================
// * >>>>基于插件检测>>>>
//=============================================================================
if( Imported.Drill_CoreOfBallistics ){
	
	if( typeof(Drill_COBa_ExtendTool) == "undefined" ){	//（弹道核心版本检测）
		alert( DrillUp.drill_BGi_getPluginTip_NeedUpdate_Ballistics() );
	}
	
	
//=============================================================================
// ** ☆插件指令
//=============================================================================
var _drill_BGi_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
	_drill_BGi_pluginCommand.call(this, command, args);
	
	/*-----------------多插件的指令------------------*/
	if( command === ">清空全部战斗装饰部件" ){
		$gameSystem.drill_BGi_removeControllerAll();
		this.wait(1);	//（『强制等待』1帧，确保全部清空）
	}
	if( command === ">战斗GIF" ){
		
		/*-----------------创建------------------*/
		if( args.length >= 6 ){
			var type = String(args[1]);
			var temp1 = String(args[3]);
			var temp2 = String(args[5]);
			if( type == "创建" ){
				temp1 = temp1.replace("GIF[","");
				temp1 = temp1.replace("]","");
				temp1 = Number( temp1 ) -1;
				temp2 = temp2.replace("样式[","");
				temp2 = temp2.replace("]","");
				temp2 = Number( temp2 ) -1;
				$gameSystem.drill_BGi_createController( temp1, temp2 );
				return;
			}
		}
		if( args.length == 4 ){
			var type = String(args[1]);
			var temp1 = String(args[3]);
			if( type == "删除" ){
				temp1 = temp1.replace("GIF[","");
				temp1 = temp1.replace("]","");
				temp1 = Number( temp1 ) -1;
				$gameSystem.drill_BGi_removeController( temp1 );
			}
		}
		if( args.length == 2 ){
			var type = String(args[1]);
			if( type == "删除全部" ){
				$gameSystem.drill_BGi_removeControllerAll();
				this.wait(1);	//（『强制等待』1帧，确保全部清空）
			}
		}
		
		/*-----------------对象组获取------------------*/
		var controllers = null;
		if( args.length >= 2 ){
			var unit = String(args[1]);
			if( controllers == null && unit.indexOf("批量GIF[") != -1 ){
				unit = unit.replace("批量GIF[","");
				unit = unit.replace("]","");
				controllers = [];
				var temp_arr = unit.split(/[,，]/);
				for( var k=0; k < temp_arr.length; k++ ){
					var controller_id = Number(temp_arr[k]);
					var temp_controller = $gameSystem._drill_BGi_controllerTank[ controller_id -1 ];
					if( temp_controller == undefined ){ continue; }
					controllers.push( temp_controller );
				}
			}
			if( controllers == null && unit.indexOf("批量GIF变量[") != -1 ){
				unit = unit.replace("批量GIF变量[","");
				unit = unit.replace("]","");
				controllers = [];
				var temp_arr = unit.split(/[,，]/);
				for( var k=0; k < temp_arr.length; k++ ){
					var controller_id = $gameVariables.value(Number(temp_arr[k]));
					var temp_controller = $gameSystem._drill_BGi_controllerTank[ controller_id -1 ];
					if( temp_controller == undefined ){ continue; }
					controllers.push( temp_controller );
				}
			}
			if( controllers == null && unit.indexOf("GIF变量[") != -1 ){
				unit = unit.replace("GIF变量[","");
				unit = unit.replace("]","");
				var controller_id = $gameVariables.value(Number(unit));
				var temp_controller = $gameSystem._drill_BGi_controllerTank[ controller_id -1 ];
				if( temp_controller == undefined ){ return; }
				controllers = [ temp_controller ];
			}
			if( controllers == null && unit.indexOf("GIF[") != -1 ){
				unit = unit.replace("GIF[","");
				unit = unit.replace("]","");
				var controller_id = Number(unit);
				var temp_controller = $gameSystem._drill_BGi_controllerTank[ controller_id -1 ];
				if( temp_controller == undefined ){ return; }
				controllers = [ temp_controller ];
			}
			if( controllers == null && unit == "全部GIF" ){
				controllers = [];
				for( var k=0; k < $gameSystem._drill_BGi_controllerTank.length; k++ ){
					var temp_controller = $gameSystem._drill_BGi_controllerTank[ k ];
					if( temp_controller == undefined ){ continue; }
					controllers.push( temp_controller );
				}
			}
		}
		if( controllers == null ){ return; }
		
		/*-----------------常规指令------------------*/
		if( args.length == 4 ){
			var type = String(args[3]);
			if( type == "显示" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setVisible( true );
				}
			}
			if( type == "隐藏" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setVisible( false );
				}
			}
			if( type == "暂停" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setPause( true );
				}
			}
			if( type == "继续" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setPause( false );
				}
			}
			if( type.indexOf("切换混合模式[") != -1 ){
				type = type.replace("切换混合模式[","");
				type = type.replace("]","");
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setBlendMode( Number(type) );
				}
			}
			if( type.indexOf("切换战斗层级[") != -1 ){
				type = type.replace("切换战斗层级[","");
				type = type.replace("]","");
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setLayerIndex( String(type) );
				}
			}
			if( type.indexOf("切换图片层级[") != -1 ){
				type = type.replace("切换图片层级[","");
				type = type.replace("]","");
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setZIndex( Number(type) );
				}
			}
		}
		if( args.length == 6 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			if( type == "修改中心锚点" && temp1.indexOf("锚点[") != -1 ){
				temp1 = temp1.replace("锚点[","");
				temp1 = temp1.replace("]","");
				var temp_arr = temp1.split(/[,，]/);
				if( temp_arr.length >= 2 ){
					for( var k=0; k < controllers.length; k++ ){
						controllers[k]._drill_change_anchor_x = Number(temp_arr[0]);
						controllers[k]._drill_change_anchor_y = Number(temp_arr[1]);
					}
				}
			}
		}
		if( args.length == 14 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			var temp2 = String(args[7]);
			var temp3 = String(args[9]);
			var temp4 = String(args[11]);
			var temp5 = String(args[13]);
			if( type == "初始属性调整" ){
				temp1 = temp1.replace("位置[","");
				temp1 = temp1.replace("]","");
				temp2 = temp2.replace("战斗层级[","");
				temp2 = temp2.replace("]","");
				temp3 = temp3.replace("图片层级[","");
				temp3 = temp3.replace("]","");
				temp4 = temp4.replace("旋转速度[","");
				temp4 = temp4.replace("]","");
				temp5 = temp5.replace("位移比[","");
				temp5 = temp5.replace("]","");
				var temp1_arr = temp1.split(/[,，]/);
				var temp5_arr = temp5.split(/[,，]/);
				if( temp1_arr.length >= 2 &&
					temp5_arr.length >= 2 ){
					for( var k=0; k < controllers.length; k++ ){
						var controller = controllers[k];
						controller.drill_controller_resetData( controller._drill_data_id );
						
						controller.drill_controller_commandChange_setMove( "匀速变化", Number(temp1_arr[0]), Number(temp1_arr[1]), 1 );
						controller.drill_controller_setLayerIndex( temp2 );
						controller.drill_controller_setZIndex( Number(temp3) );
						controller.drill_controller_commandChange_setRotateSpeed( "匀速变化", Number(temp4), 1 );
						controller.drill_controller_setPer( Number(temp5_arr[0]), Number(temp5_arr[1]) );
					}
				}
				this.wait(1);	//（『强制等待』1帧，完成 初始属性调整）
			}
		}
		
		/*-----------------获取属性------------------*/
		if( args.length == 8 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			var temp2 = String(args[7]);
			if( type == "获取属性" ){
				temp2 = temp2.replace("变量[","");
				temp2 = temp2.replace("变量%[","");
				temp2 = temp2.replace("]","");
				if( temp1 == "位置X" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_x );
				}
				if( temp1 == "位置Y" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_y );
				}
				if( temp1 == "透明度" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_opacity );
				}
				if( temp1 == "旋转" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_rotate );
				}
				if( temp1 == "转速" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_childGIF_rotateSpeed );
				}
				if( temp1 == "缩放X" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_scaleX *100 );
				}
				if( temp1 == "缩放Y" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_scaleY *100 );
				}
				if( temp1 == "斜切X" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_skewX *100 );
				}
				if( temp1 == "斜切Y" ){
					$gameVariables.setValue( Number(temp2), controllers[0]._drill_change_skewY *100 );
				}
			}
		}
		
		/*-----------------D播放GIF------------------*/
		if( args.length == 4 ){
			var type = String(args[3]);
			if( type == "锁定帧" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_GIF_setLocked( true );
				}
			}
			if( type == "解锁帧" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_GIF_setLocked( false );
				}
			}
			if( type == "正向播放一次并停留在末尾帧" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_GIF_setOncePlay( "forwardRun" );
				}
			}
			if( type == "反向播放一次并停留在起始帧" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_GIF_setOncePlay( "backRun" );
				}
			}
		}
		if( args.length == 6 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			var num_list = this.drill_BGi_getArgNumList( temp1 );
			
			if( type == "设置帧" || type == "设置当前帧" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_GIF_setFrame( num_list[0]-1 );
				}
			}
		}
		
		/*-----------------F指令叠加变化------------------*/
		if( args.length == 4 ){
			var type = String(args[3]);
			if( type == "立即还原所有单属性" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_commandChange_restoreAttr();
				}
			}
			if( type == "移动到-立即归位" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_commandChange_restoreMove();
				}
			}
		}
		if( args.length == 8 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			var temp2 = String(args[7]);
			if( type == "修改单属性" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				
				if( temp1.indexOf("透明度[") != -1 ||
					temp1.indexOf("透明度变量[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setOpacity(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
				if( temp1.indexOf("旋转[") != -1 ||
					temp1.indexOf("旋转变量[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setRotate(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
				if( temp1.indexOf("转速[") != -1 ||
					temp1.indexOf("转速变量[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setRotateSpeed(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
				if( temp1.indexOf("缩放X[") != -1 ||
					temp1.indexOf("缩放X变量%[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setScaleX(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
				if( temp1.indexOf("缩放Y[") != -1 ||
					temp1.indexOf("缩放Y变量%[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setScaleY(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
				if( temp1.indexOf("斜切X[") != -1 ||
					temp1.indexOf("斜切X变量%[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setSkewX(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
				if( temp1.indexOf("斜切Y[") != -1 ||
					temp1.indexOf("斜切Y变量%[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setSkewY(
							"匀速变化", num_list[0], Number(temp2)
						);
					}
				}
			}
			if( type == "移动到-匀速移动" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				if( temp1.indexOf("位置[") != -1 ||
					temp1.indexOf("位置变量[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setMove(
							"匀速变化", num_list[0], num_list[1], Number(temp2)
						);
					}
				}
			}
			if( type == "移动到-弹性移动" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				if( temp1.indexOf("位置[") != -1 ||
					temp1.indexOf("位置变量[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setMove(
							"弹性变化", num_list[0], num_list[1], Number(temp2)
						);
					}
				}
			}
			if( type == "移动到-增减速移动" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				if( temp1.indexOf("位置[") != -1 ||
					temp1.indexOf("位置变量[") != -1 ){
					var num_list = this.drill_BGi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_commandChange_setMove(
							"增减速变化", num_list[0], num_list[1], Number(temp2)
						);
					}
				}
			}
		}
		
		/*-----------------G延迟指令------------------*/
		if( args.length == 4 ){
			var type = String(args[3]);
			if( type == "立即取消全部延迟指令" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_clearDelayingCommand();
				}
			}
		}
		if( args.length == 6 ){
			var type = String(args[3]);
			var delay_time = String(args[5]);
			if( type == "显示(延迟)" ){
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_setVisible", [true], delay_time
					);
				}
			}
			if( type == "隐藏(延迟)" ){
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_setVisible", [false], delay_time
					);
				}
			}
			if( type == "暂停(延迟)" ){
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_setPause", [true], delay_time
					);
				}
			}
			if( type == "继续(延迟)" ){
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_setPause", [false], delay_time
					);
				}
			}
			if( type == "还原所有单属性(延迟)" ){
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_commandChange_restoreAttr", [], delay_time
					);
				}
			}
			if( type == "移动到(延迟)-延迟归位" ){
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_commandChange_restoreMove", [], delay_time
					);
				}
			}
		}
		if( args.length == 10 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			var temp2 = String(args[7]);
			var delay_time = String(args[9]);
			if( type == "修改单属性(延迟)" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				
				if( temp1.indexOf("透明度[") != -1 ||
					temp1.indexOf("透明度变量[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setOpacity", 
							[ "匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
				if( temp1.indexOf("旋转[") != -1 ||
					temp1.indexOf("旋转变量[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setRotate",
							[ "匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
				if( temp1.indexOf("转速[") != -1 ||
					temp1.indexOf("转速变量[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setRotateSpeed",
							["匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
				if( temp1.indexOf("缩放X[") != -1 ||
					temp1.indexOf("缩放X变量%[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setScaleX",
							[ "匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
				if( temp1.indexOf("缩放Y[") != -1 ||
					temp1.indexOf("缩放Y变量%[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setScaleY",
							[ "匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
				if( temp1.indexOf("斜切X[") != -1 ||
					temp1.indexOf("斜切X变量%[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setSkewX",
							[ "匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
				if( temp1.indexOf("斜切Y[") != -1 ||
					temp1.indexOf("斜切Y变量%[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setSkewY",
							[ "匀速变化", num_list[0], Number(temp2) ], delay_time
						);
					}
				}
			}
			if( type == "移动到(延迟)-匀速移动" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				if( temp1.indexOf("位置[") != -1 ||
					temp1.indexOf("位置变量[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setMove",
							[ "匀速变化", num_list[0], num_list[1], Number(temp2) ], delay_time
						);
					}
				}
			}
			if( type == "移动到(延迟)-弹性移动" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				if( temp1.indexOf("位置[") != -1 ||
					temp1.indexOf("位置变量[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setMove",
							[ "弹性变化", num_list[0], num_list[1], Number(temp2) ], delay_time
						);
					}
				}
			}
			if( type == "移动到(延迟)-增减速移动" ){
				temp2 = temp2.replace("时间[","");
				temp2 = temp2.replace("]","");
				delay_time = delay_time.replace("延迟执行时间[","");
				delay_time = delay_time.replace("]","");
				delay_time = Number( delay_time );
				if( temp1.indexOf("位置[") != -1 ||
					temp1.indexOf("位置变量[") != -1 ){
					var num_list = this.drill_LCi_getArgNumList(temp1);
					for( var k=0; k < controllers.length; k++ ){
						controllers[k].drill_controller_setDelayingCommand(
							"drill_controller_commandChange_setMove",
							[ "增减速变化", num_list[0], num_list[1], Number(temp2) ], delay_time
						);
					}
				}
			}
		}
		if( args.length == 6 ){
			var type = String(args[3]);
			var delay_time = String(args[5]);
			delay_time = delay_time.replace("延迟执行时间[","");
			delay_time = delay_time.replace("]","");
			delay_time = Number( delay_time );
			if( type == "锁定帧(延迟)" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_GIF_setLocked",
						[ true ], delay_time
					);
				}
			}
			if( type == "解锁帧(延迟)" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_GIF_setLocked",
						[ false ], delay_time
					);
				}
			}
			if( type == "正向播放一次并停留在末尾帧(延迟)" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_GIF_setOncePlay",
						[ "forwardRun" ], delay_time
					);
				}
			}
			if( type == "反向播放一次并停留在起始帧(延迟)" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_GIF_setOncePlay",
						[ "backRun" ], delay_time
					);
				}
			}
		}
		if( args.length == 8 ){
			var type = String(args[3]);
			var temp1 = String(args[5]);
			var delay_time = String(args[7]);
			delay_time = delay_time.replace("延迟执行时间[","");
			delay_time = delay_time.replace("]","");
			delay_time = Number( delay_time );
			var num_list = this.drill_BGi_getArgNumList( temp1 );
			
			if( type == "设置帧(延迟)" || type == "设置当前帧(延迟)" ){
				for( var k=0; k < controllers.length; k++ ){
					controllers[k].drill_controller_setDelayingCommand(
						"drill_controller_GIF_setFrame",
						[ num_list[0]-1 ], delay_time
					);
				}
			}
		}
	}
	
	/*-----------------旧指令------------------*/
	if( command === ">战斗GIF" ){
		if( args.length == 10 ){
			var id = -1;
			var temp1 = String(args[1]);
			var type = String(args[3]);
			var delay_time = String(args[5]);
			var change_time = String(args[7]);
			var value_str = String(args[9]);
			
			if( temp1.indexOf("GIF[") != -1 ){
				temp1 = temp1.replace("GIF[","");
				temp1 = temp1.replace("]","");
				id = Number(temp1) -1;
			}
			if( temp1.indexOf("GIF变量[") != -1 ){
				temp1 = temp1.replace("GIF变量[","");
				temp1 = temp1.replace("]","");
				id = $gameVariables.value(Number(temp1)) -1;
			}
			if( id == -1 ){ return; }
			var controller = $gameSystem._drill_BGi_controllerTank[ id ];
			if( controller == undefined ){ return; }
			delay_time = delay_time.replace("延迟[","");
			delay_time = delay_time.replace("]","");
			change_time = change_time.replace("变化时间[","");
			change_time = change_time.replace("]","");
			
			if( type == "变透明" ){
				var num_list = this.drill_BGi_getArgNumList(value_str);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setOpacity", 
					[ "匀速变化", num_list[0], Number(change_time) ], delay_time
				);
				return;
			}
			if( type == "变转速" ){
				var num_list = this.drill_BGi_getArgNumList(value_str);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setRotateSpeed", 
					[ "匀速变化", num_list[0], Number(change_time) ], delay_time
				);
				return;
			}
			if( type == "变缩放" ){
				var num_list = this.drill_BGi_getArgNumList(value_str);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setScaleX", 
					[ "匀速变化", num_list[0], Number(change_time) ], delay_time
				);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setScaleY", 
					[ "匀速变化", num_list[1], Number(change_time) ], delay_time
				);
				return;
			}
			if( type == "变斜切" ){
				var num_list = this.drill_BGi_getArgNumList(value_str);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setSkewX", 
					[ "匀速变化", num_list[0], Number(change_time) ], delay_time
				);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setSkewY", 
					[ "匀速变化", num_list[1], Number(change_time) ], delay_time
				);
				return;
			}
			if( type == "变坐标" ){
				var num_list = this.drill_BGi_getArgNumList(value_str);
				controller.drill_controller_setDelayingCommand(
					"drill_controller_commandChange_setMove", 
					[ "匀速变化", num_list[0], num_list[1], Number(change_time) ], delay_time
				);
				return;
			}
		}
	}
};
//==============================
// * 插件指令 - 获取方括号中的数字
//
//			参数：	> arg_str 字符串
//			返回：	> 数字数组
//
//			说明：	> 能获取到字符串中的数字，且包含 变量 转换情况。
//==============================
Game_Interpreter.prototype.drill_BGi_getArgNumList = function( arg_str ){
	var arr = arg_str.match( /([^\[]+)\[([^\]]+)\]/ );
	if( arr != undefined && arr.length >= 3 ){
	// > 有方括号
		var data_name = arr[1];
		var data_list = arr[2].split(",");
		var result_list = [];
		
		if( data_name.contains("变量%") ){	//（将变量值赋值给目标，需要*0.01）
			for(var i=0; i < data_list.length; i++){ result_list.push( $gameVariables.value(Number(data_list[i]))*0.01 ); }
			return result_list;
		}else if( data_name.contains("变量") ){
			for(var i=0; i < data_list.length; i++){ result_list.push( $gameVariables.value(Number(data_list[i])) ); }
			return result_list;
		}else{
			for(var i=0; i < data_list.length; i++){ result_list.push( Number(data_list[i]) ); }
			return result_list;
		}
	}else{
	// > 没有方括号
		var data_list = arg_str.split(",");
		var result_list = [];
		for(var i=0; i < data_list.length; i++){ result_list.push( Number(data_list[i]) ); }
		return result_list;
	}
};


//=============================================================================
// ** ☆预加载
//
//			说明：	> 对指定资源贴图标记不删除，可以防止重建导致的浪费资源，以及资源显示时闪烁问题。
//					（插件完整的功能目录去看看：功能结构树）
//=============================================================================
//==============================
// * 预加载 - 初始化
//==============================
var _drill_BGi_preload_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function(){
	_drill_BGi_preload_initialize.call(this);
	this.drill_BGi_preloadInit();
}
//==============================
// * 预加载 - 版本校验
//==============================
if( Utils.generateRuntimeId == undefined ){
	alert( DrillUp.drill_BGi_getPluginTip_LowVersion() );
}
//==============================
// * 预加载 - 执行资源预加载
//
//			说明：	> 遍历全部资源，提前预加载标记过的资源。
//==============================
Game_Temp.prototype.drill_BGi_preloadInit = function(){
	this._drill_BGi_cacheId = Utils.generateRuntimeId();	//资源缓存id
	this._drill_BGi_preloadTank = [];						//bitmap容器
	for( var i = 0; i < DrillUp.g_BGi_style.length; i++ ){
		var temp_data = DrillUp.g_BGi_style[i];
		if( temp_data == undefined ){ continue; }
		if( temp_data['preload'] != true ){ continue; }
		
		for(var k=0; k < temp_data['src_img_gif'].length; k++){
			this._drill_BGi_preloadTank.push( 
				ImageManager.reserveBitmap( temp_data['src_img_file'], temp_data['src_img_gif'][k], temp_data['tint'], temp_data['smooth'], this._drill_BGi_cacheId ) 
			);
		}
	}
}


//#############################################################################
// ** 【标准模块】存储数据 ☆存储数据
//#############################################################################
//##############################
// * 存储数据 - 参数存储 开关
//          
//			说明：	> 如果该插件开放了用户可以修改的参数，就注释掉。
//##############################
DrillUp.g_BGi_saveEnabled = true;
//##############################
// * 存储数据 - 初始化
//          
//			说明：	> 下方为固定写法，不要动。
//##############################
var _drill_BGi_sys_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function(){
    _drill_BGi_sys_initialize.call(this);
	this.drill_BGi_initSysData();
};
//##############################
// * 存储数据 - 载入存档
//          
//			说明：	> 下方为固定写法，不要动。
//##############################
var _drill_BGi_sys_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function( contents ){
	_drill_BGi_sys_extractSaveContents.call( this, contents );
	
	// > 参数存储 启用时（检查数据）
	if( DrillUp.g_BGi_saveEnabled == true ){	
		$gameSystem.drill_BGi_checkSysData();
		
	// > 参数存储 关闭时（直接覆盖）
	}else{
		$gameSystem.drill_BGi_initSysData();
	}
};
//##############################
// * 存储数据 - 初始化数据【标准函数】
//			
//			参数：	> 无
//			返回：	> 无
//          
//			说明：	> 强行规范的接口，执行数据初始化，并存入存档数据中。
//##############################
Game_System.prototype.drill_BGi_initSysData = function(){
	this.drill_BGi_initSysData_Private();
};
//##############################
// * 存储数据 - 载入存档时检查数据【标准函数】
//			
//			参数：	> 无
//			返回：	> 无
//          
//			说明：	> 强行规范的接口，载入存档时执行的数据检查操作。
//##############################
Game_System.prototype.drill_BGi_checkSysData = function(){
	this.drill_BGi_checkSysData_Private();
};
//=============================================================================
// ** 存储数据（接口实现）
//=============================================================================
//==============================
// * 存储数据 - 初始化数据（私有）
//==============================
Game_System.prototype.drill_BGi_initSysData_Private = function(){
	
    this._drill_BGi_controllerTank = [];
	//（初始为空容器，不需要初始化）
};
//==============================
// * 存储数据 - 载入存档时检查数据（私有）
//==============================
Game_System.prototype.drill_BGi_checkSysData_Private = function(){
	
	// > 旧存档数据自动补充
	if( this._drill_BGi_controllerTank == undefined ){
		this.drill_BGi_initSysData();
	}
	
	// > 容器的 空数据 检查
	//	（容器一直就是空数据，战斗前才赋值，且只在战斗时用到）
};
//==============================
// * 存储数据 - 创建控制器（开放函数）
//==============================
Game_System.prototype.drill_BGi_createController = function( slot_id, style_id ){
	if( this._drill_BGi_controllerTank == undefined ){
		this._drill_BGi_controllerTank = [];
	}
	
	// > 销毁原来的
	this.drill_BGi_removeController( slot_id );
	
	// > 创建控制器
	var temp_controller = new Drill_BGi_Controller( style_id );
	this._drill_BGi_controllerTank[ slot_id ] = temp_controller;
	
	// > 刷新统计
	$gameTemp._drill_BGi_needRestatistics = true;
}
//==============================
// * 存储数据 - 去除控制器（开放函数）
//==============================
Game_System.prototype.drill_BGi_removeController = function( slot_id ){
	if( this._drill_BGi_controllerTank == undefined ){ return; }
	if( this._drill_BGi_controllerTank[ slot_id ] == undefined ){ return; }
	this._drill_BGi_controllerTank[ slot_id ].drill_controller_destroy();
	this._drill_BGi_controllerTank[ slot_id ] = null;
}
//==============================
// * 存储数据 - 去除全部控制器（开放函数）
//==============================
Game_System.prototype.drill_BGi_removeControllerAll = function(){
	if( this._drill_BGi_controllerTank == undefined ){ return; }
	for( var i=0; i < this._drill_BGi_controllerTank.length; i++ ){
		this.drill_BGi_removeController( i );
	}
}


//#############################################################################
// ** 【标准模块】战斗层级 ☆战斗层级
//#############################################################################
//##############################
// * 战斗层级 - 添加贴图到层级【标准函数】
//				
//			参数：	> sprite 贴图        （添加的贴图对象）
//					> layer_index 字符串 （添加到的层级名，下层/上层/图片层/最顶层）
//			返回：	> 无
//          
//			说明：	> 强行规范的接口，将指定贴图添加到目标层级中。
//##############################
Scene_Battle.prototype.drill_BGi_layerAddSprite = function( sprite, layer_index ){
	this.drill_BGi_layerAddSprite_Private( sprite, layer_index );
}
//##############################
// * 战斗层级 - 去除贴图【标准函数】
//				
//			参数：	> sprite 贴图（添加的贴图对象）
//			返回：	> 无
//          
//			说明：	> 强行规范的接口，将指定贴图从战斗层级中移除。
//##############################
Scene_Battle.prototype.drill_BGi_layerRemoveSprite = function( sprite ){
	//（不操作）
}
//##############################
// * 战斗层级 - 图片层级排序【标准函数】
//				
//			参数：	> 无
//			返回：	> 无
//          
//			说明：	> 执行该函数后，战斗层级的子贴图，按照zIndex属性来进行先后排序。值越大，越靠前。
//##############################
Scene_Battle.prototype.drill_BGi_sortByZIndex = function () {
    this.drill_BGi_sortByZIndex_Private();
}
//##############################
// * 战斗层级 - 层级与镜头的位移【标准函数】
//				
//			参数：	> x 数字              （x位置，当前为 战斗参照）
//					> y 数字              （y位置，当前为 战斗参照）
//					> layer 字符串        （层级，下层/上层/图片层/最顶层）
//					> option 动态参数对象 （计算时的必要数据）
//			返回：	> pos 动态参数对象
//                  > pos['x']
//                  > pos['y']
//          
//			说明：	> 强行规范的接口，必须按照接口的结构来，把要考虑的问题全考虑清楚了再去实现。
//##############################
Scene_Battle.prototype.drill_BGi_layerCameraMoving = function( x, y, layer, option ){
	return this.drill_BGi_layerCameraMoving_Private( x, y, layer, option );
}
//=============================================================================
// ** 战斗层级（接口实现）
//=============================================================================
//==============================
// * 战斗层级 - 下层
//==============================
var _drill_BGi_battle_createBattleback = Spriteset_Battle.prototype.createBattleback;
Spriteset_Battle.prototype.createBattleback = function(){    
	_drill_BGi_battle_createBattleback.call(this);
	if( !this._drill_battleDownArea ){
		this._drill_battleDownArea = new Sprite();
		this._drill_battleDownArea.z = 0;	//（yep层级适配，YEP_BattleEngineCore）
		this._battleField.addChild(this._drill_battleDownArea);	
	}
};
//==============================
// * 战斗层级 - 上层
//==============================
var _drill_BGi_battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
Spriteset_Battle.prototype.createLowerLayer = function(){
    _drill_BGi_battle_createLowerLayer.call(this);
	if( !this._drill_battleUpArea ){
		this._drill_battleUpArea = new Sprite();
		this._drill_battleUpArea.z = 9999;	//（yep层级适配，YEP_BattleEngineCore）
		this._battleField.addChild(this._drill_battleUpArea);
	}
};
//==============================
// * 战斗层级 - 图片层
//==============================
var _drill_BGi_battle_createPictures = Spriteset_Battle.prototype.createPictures;
Spriteset_Battle.prototype.createPictures = function(){
	_drill_BGi_battle_createPictures.call(this);		//图片对象层 < 图片层 < 对话框集合
	if( !this._drill_battlePicArea ){
		this._drill_battlePicArea = new Sprite();
		this.addChild(this._drill_battlePicArea);	
	}
}
//==============================
// * 战斗层级 - 最顶层
//==============================
var _drill_BGi_battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function(){
	_drill_BGi_battle_createAllWindows.call(this);	//对话框集合 < 最顶层
	if( !this._drill_SenceTopArea ){
		this._drill_SenceTopArea = new Sprite();
		this.addChild(this._drill_SenceTopArea);	
	}
}
//==============================
// * 战斗层级 - 参数定义
//
//			说明：	> 所有drill插件的贴图都用唯一参数：zIndex（可为小数、负数），其它插件没有此参数定义。
//==============================
if( typeof(_drill_sprite_zIndex) == "undefined" ){						//（防止重复定义）
	var _drill_sprite_zIndex = true;
	Object.defineProperty( Sprite.prototype, 'zIndex', {
		set: function( value ){
			this.__drill_zIndex = value;
		},
		get: function(){
			if( this.__drill_zIndex == undefined ){ return 666422; }	//（如果未定义则放最上面）
			return this.__drill_zIndex;
		},
		configurable: true
	});
};
//==============================
// * 战斗层级 - 图片层级排序（私有）
//==============================
Scene_Battle.prototype.drill_BGi_sortByZIndex_Private = function(){
	this._spriteset._drill_battleDownArea.children.sort(function(a, b){return a.zIndex-b.zIndex});	//比较器
	this._spriteset._drill_battleUpArea.children.sort(function(a, b){return a.zIndex-b.zIndex});
	this._spriteset._drill_battlePicArea.children.sort(function(a, b){return a.zIndex-b.zIndex});
	this._drill_SenceTopArea.children.sort(function(a, b){return a.zIndex-b.zIndex});
};
//==============================
// * 战斗层级 - 添加贴图到层级（私有）
//==============================
Scene_Battle.prototype.drill_BGi_layerAddSprite_Private = function( sprite, layer_index ){
	if( layer_index == "下层" ){
		this._spriteset._drill_battleDownArea.addChild( sprite );
	}
	if( layer_index == "上层" ){
		this._spriteset._drill_battleUpArea.addChild( sprite );
	}
	if( layer_index == "图片层" ){
		this._spriteset._drill_battlePicArea.addChild( sprite );
	}
	if( layer_index == "最顶层" ){
		this._drill_SenceTopArea.addChild( sprite );
	}
}
//==============================
// * 战斗层级 - 层级与镜头的位移（私有）
//==============================
Scene_Battle.prototype.drill_BGi_layerCameraMoving_Private = function( xx, yy, layer, option ){
	
	// > 位移比
	var x_per = option['XPer'];
	var y_per = option['YPer'];
	if( Imported.Drill_BattleCamera ){
		var camera_pos = $gameSystem._drill_BCa_controller.drill_BCa_getCameraPos_Children();
		xx += camera_pos.x * x_per;
		yy += camera_pos.y * y_per;
	}
	//		（*0 表示不跟镜头移动，紧贴战斗底图；*1表示紧贴镜头。）
	
	
	// > 战斗参照 -> 战斗参照
	if( layer == "下层" || layer == "上层" ){
		//（不操作）
		return {'x':xx, 'y':yy };
	}
	
	// > 战斗参照 -> 镜头参照
	if( layer == "图片层" || layer == "最顶层" ){
		xx -= this._spriteset._baseSprite.x;	//（由于 Spriteset_Battle 的 _baseSprite 坐标始终是(0,0)，所以两个参照没有区别。）
		yy -= this._spriteset._baseSprite.y;
		
		// > 战斗镜头位移（在图层内）
		if( Imported.Drill_BattleCamera ){
			var camera_pos = $gameSystem._drill_BCa_controller.drill_BCa_getCameraPos_Children();
			xx -= camera_pos.x;
			yy -= camera_pos.y;
		}else{
			xx -= this._spriteset._battleField.x;	//（处于 Spriteset_Battle 的 _battleField 情况。）
			yy -= this._spriteset._battleField.y;
		}
		return {'x':xx, 'y':yy };
	}
	return {'x':xx, 'y':yy };
}


//=============================================================================
// ** ☆控制器与贴图
//
//			说明：	> 此模块专门管理 贴图 的创建与销毁。
//					（插件完整的功能目录去看看：功能结构树）
//=============================================================================
//==============================
// * 控制器与贴图 - 容器初始化
//==============================
var _drill_BGi_temp_initialize2 = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function(){
	_drill_BGi_temp_initialize2.call(this);
	this._drill_BGi_spriteTank = [];			//贴图容器
};
//==============================
// * 控制器与贴图 - 销毁时（战斗界面）
//==============================
var _drill_BGi_smap_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function(){
	_drill_BGi_smap_terminate.call(this);
	$gameTemp._drill_BGi_spriteTank = [];		//贴图容器
};
//==============================
// * 控制器与贴图 - 帧刷新（战斗界面）
//==============================
var _drill_BGi_smap_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function(){
	_drill_BGi_smap_update.call(this);
	this.drill_BGi_updateRestatisticsCreate();	//帧刷新 - 实时创建
	this.drill_BGi_updateControllerCamera();	//帧刷新 - 控制器与镜头
	this.drill_BGi_updateAttr();				//帧刷新 - 基础特性
	this.drill_BGi_updateDestroy();				//帧刷新 - 销毁
};
//==============================
// * 控制器与贴图 - 界面创建时（战斗界面）
//==============================
var _drill_BGi_smap_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function(){
	_drill_BGi_smap_createAllWindows.call(this);
	this.drill_BGi_create();
};
//==============================
// * 控制器与贴图 - 界面创建
//==============================
Scene_Battle.prototype.drill_BGi_create = function(){
	$gameTemp._drill_BGi_spriteTank = [];			//贴图容器（不允许出现null值）
	
	for(var i=0; i< $gameSystem._drill_BGi_controllerTank.length; i++){
		var temp_controller = $gameSystem._drill_BGi_controllerTank[i];
		if( temp_controller == undefined ){ continue; }
		
		
		// > 创建贴图
		var temp_sprite = new Drill_BGi_Sprite();
		temp_sprite.drill_sprite_setController( temp_controller );
		temp_sprite.drill_sprite_initChild();
		
		
		// > 添加贴图到层级
		$gameTemp._drill_BGi_spriteTank.push( temp_sprite );
		this.drill_BGi_layerAddSprite( temp_sprite, temp_controller._drill_layerIndex );
	}
	
	// > 层级排序
	this.drill_BGi_sortByZIndex();
}
//==============================
// * 控制器与贴图 - 实时创建
//
//			说明：	> 插件指令实时创建了控制器后，根据 控制器容器 筛选并创建对应的贴图。
//==============================
Scene_Battle.prototype.drill_BGi_updateRestatisticsCreate = function(){
	if( $gameTemp._drill_BGi_needRestatistics != true ){ return; }
	$gameTemp._drill_BGi_needRestatistics = false;
	
	for( var i=0; i < $gameSystem._drill_BGi_controllerTank.length; i++ ){
		var temp_controller = $gameSystem._drill_BGi_controllerTank[i];
		if( temp_controller == undefined ){ continue; }
		
		// > 过滤生命周期结束情况
		if( temp_controller.drill_controller_isDead() == true ){ continue; }
		
		// > 有绑定控制器的贴图时，跳过
		if( this.drill_BGi_hasSpriteBinding( temp_controller._drill_controllerSerial ) == true ){ continue; }
		
		
		// > 创建贴图
		var temp_sprite = new Drill_BGi_Sprite();
		temp_sprite.drill_sprite_setController( temp_controller );
		temp_sprite.drill_sprite_initChild();
		
		// > 添加贴图到层级
		$gameTemp._drill_BGi_spriteTank.push( temp_sprite );
		this.drill_BGi_layerAddSprite( temp_sprite, temp_controller._drill_layerIndex );
	}
	
	// > 层级排序
	this.drill_BGi_sortByZIndex();
}
//==============================
// * 控制器与贴图 - 实时创建 - 是否含有绑定控制器的贴图
//==============================
Scene_Battle.prototype.drill_BGi_hasSpriteBinding = function( serial ){
	for( var i=0; i < $gameTemp._drill_BGi_spriteTank.length; i++){
		if( $gameTemp._drill_BGi_spriteTank[i]._drill_curSerial == serial ){
			return true;
		}
	}
	return false;
}

//==============================
// * 控制器与贴图 - 帧刷新 控制器与镜头
//==============================
Scene_Battle.prototype.drill_BGi_updateControllerCamera = function(){
	for(var i = 0; i < $gameSystem._drill_BGi_controllerTank.length; i++ ){
		var temp_controller = $gameSystem._drill_BGi_controllerTank[i];
		if( temp_controller == undefined ){ continue; }
		
		// > 控制器帧刷新
		temp_controller.drill_controller_update();
		
		
		// > 镜头位移结果（战斗参照）
		var xx = 0;
		var yy = 0;
		
		// > 镜头位移结果 - 层级与镜头的位移
		var option = {
			"XPer": temp_controller._drill_XPer,
			"YPer": temp_controller._drill_YPer,
		};
		var pos = this.drill_BGi_layerCameraMoving(xx, yy, temp_controller._drill_layerIndex, option );
		xx = pos.x;
		yy = pos.y;
		
		// > 镜头位移结果 - 镜头缩放与位移（此处是场景装饰，不需要考虑缩放）
		//	（无）
		
		// > 镜头位移结果 - 赋值
		//		（控制器位移与镜头位移 独立，这样在控制器暂停时，贴图也仍然能兼容镜头移动）
		temp_controller._drill_cameraResultSpriteX = xx;
		temp_controller._drill_cameraResultSpriteY = yy;
	}
}
//==============================
// * 控制器与贴图 - 帧刷新 基础特性
//==============================
Scene_Battle.prototype.drill_BGi_updateAttr = function(){
	var has_layerChange = false;
	for(var i = 0; i < $gameTemp._drill_BGi_spriteTank.length; i++){
		var temp_sprite = $gameTemp._drill_BGi_spriteTank[i];
		if( temp_sprite == undefined ){ continue; }
		var temp_controller = temp_sprite._drill_controller;
		if( temp_controller == undefined ){ continue; }
		
		// > 基础特性 - 战斗层级
		if( temp_sprite.layerIndex != temp_controller._drill_layerIndex ){
			temp_sprite.layerIndex =  temp_controller._drill_layerIndex;
			this.drill_BGi_layerAddSprite( temp_sprite, temp_controller._drill_layerIndex );
			has_layerChange = true;
		}
		// > 基础特性 - 图片层级
		if( temp_sprite.zIndex != temp_controller._drill_zIndex ){
			temp_sprite.zIndex =  temp_controller._drill_zIndex;
			has_layerChange = true;
		}
	};
	
	// > 层级排序
	if( has_layerChange == true ){
		this.drill_BGi_sortByZIndex();
	}
}
//==============================
// * 控制器与贴图 - 帧刷新 销毁
//==============================
Scene_Battle.prototype.drill_BGi_updateDestroy = function(){
	
	// > 自动销毁 - 控制器
	for(var i = $gameSystem._drill_BGi_controllerTank.length-1; i >= 0; i--){
		var temp_controller = $gameSystem._drill_BGi_controllerTank[i];
		if( temp_controller == undefined ){ continue; }
		if( temp_controller.drill_controller_isDead() ){
			$gameSystem._drill_BGi_controllerTank[i] = null;	//（只置空，不退数组）
			//$gameSystem._drill_BGi_controllerTank.splice(i,1);
		}
	}
	
	// > 自动销毁 - 贴图
	for(var i = $gameTemp._drill_BGi_spriteTank.length-1; i >= 0; i--){
		var temp_sprite = $gameTemp._drill_BGi_spriteTank[i];
		if( temp_sprite.drill_sprite_isNeedDestroy() ){
			this.drill_BGi_layerRemoveSprite( temp_sprite );	//（销毁贴图）
			$gameTemp._drill_BGi_spriteTank.splice(i,1);
			temp_sprite.drill_sprite_destroy();
		}
	}
};


//=============================================================================
// ** 战斗GIF控制器【Drill_BGi_Controller】
// **		
// **		作用域：	战斗界面
// **		主功能：	> 定义一个专门控制战斗GIF的数据类。
// **		子功能：	->控制器
// **						->帧刷新
// **						->重设数据
// **							->序列号
// **						->显示/隐藏
// **						->暂停/继续
// **						->销毁
// **					->A主体『界面装饰最终变换值』『变换特性的规范』
// **						->基础特性
// **							>  资源名
// **							>  可见
// **							>  混合模式
// **							>  层级
// **							>  堆叠级
// **						->其它特性
// **							> 暂停/继续
// **					->B变换特性『变换特性-单贴图』
// **						>  锚点X
// **						>  锚点Y
// **						>  位置X
// **						>  位置Y
// **						>  缩放X
// **						>  缩放Y
// **						>  透明度
// **						>  斜切X
// **						>  斜切Y
// **						>  旋转
// **						>  转速
// **					->C镜头参数
// **					->D播放GIF
// **						->设置帧
// **						->锁定帧/解锁帧
// **						->单次播放
// **					->E随机位置
// **					->F指令叠加变化
// **						> 主体贴图>移动到
// **						> 主体贴图>透明度
// **						> 主体贴图>旋转
// **						> 圈贴图>转速
// **						> 层贴图>缩放X
// **						> 层贴图>缩放Y
// **						> 层贴图>斜切X
// **						> 层贴图>斜切Y
// **					->G延迟指令
// **					->H自变化效果
// **						> 主体贴图>浮动效果
// **						> 主体贴图>闪烁效果
// **						> 圈贴图>摇晃效果
// **						> 层贴图>缩放效果
// **		
// **		说明：	> 注意，该类不能放 物体指针、贴图指针 。
//=============================================================================
//==============================
// * 控制器 - 定义
//==============================
function Drill_BGi_Controller(){
    this.initialize.apply(this, arguments);
};
//==============================
// * 控制器 - 校验标记
//==============================
DrillUp.g_BGi_checkNaN = true;
//==============================
// * 控制器 - 初始化
//==============================
Drill_BGi_Controller.prototype.initialize = function( data_id ){
	this._drill_data_id = data_id;
	this._drill_controllerSerial = new Date().getTime() + Math.random();	//（生成一个不重复的序列号）
    this.drill_controller_initData();										//初始化数据
    this.drill_controller_initChild();										//初始化子功能
    this.drill_controller_resetData( data_id );
}
//##############################
// * 控制器 - 帧刷新【标准函数】
//			
//			参数：	> 无
//			返回：	> 无
//			
//			说明：	> 此函数必须在 帧刷新 中手动调用执行。
//##############################
Drill_BGi_Controller.prototype.drill_controller_update = function(){
	this.drill_controller_updateDelayingCommandImportant();		//帧刷新 - G延迟指令 - 时间流逝
	if( this._drill_pause == true ){ return; }
	this.drill_controller_updateAttr();							//帧刷新 - A主体
	this.drill_controller_updateChange_Rotation();				//帧刷新 - B变换特性 - 旋转
																//帧刷新 - C镜头参数（无）
	this.drill_controller_updateGIF();							//帧刷新 - D播放GIF
	this.drill_controller_updateRandom();						//帧刷新 - E随机位置
	this.drill_controller_updateCommandChange();				//帧刷新 - F指令叠加变化
	this.drill_controller_updateDelayingCommand();				//帧刷新 - G延迟指令 - 执行延迟指令
	this.drill_controller_updateEffect();						//帧刷新 - H自变化效果
	this.drill_controller_updateCheckNaN();						//帧刷新 - A主体 - 校验值
}
//##############################
// * 控制器 - 重设数据【标准函数】
//			
//			参数：	> data_id 数字
//			返回：	> 无
//			
//			说明：	> 通过此函数，你不需要再重新创建一个数据对象，并且贴图能直接根据此数据来变化。
//##############################
Drill_BGi_Controller.prototype.drill_controller_resetData = function( data_id ){
	this.drill_controller_resetData_Private( data_id );
};
//##############################
// * 控制器 - 显示/隐藏【标准函数】
//
//			参数：	> visible 布尔（是否显示）
//			返回：	> 无
//			
//			说明：	> 可放在帧刷新函数中实时调用。
//##############################
Drill_BGi_Controller.prototype.drill_controller_setVisible = function( visible ){
	this._drill_visible = visible;
};
//##############################
// * 控制器 - 暂停/继续【标准函数】
//
//			参数：	> pause 布尔
//			返回：	> 无
//			
//			说明：	> 可放在帧刷新函数中实时调用。
//##############################
Drill_BGi_Controller.prototype.drill_controller_setPause = function( pause ){
	this._drill_pause = pause;
};
//##############################
// * 控制器 - 设置销毁【标准函数】
//
//			参数：	> 无
//			返回：	> 布尔
//##############################
Drill_BGi_Controller.prototype.drill_controller_destroy = function(){
	this._drill_needDestroy = true;
};
//##############################
// * 控制器 - 判断销毁【标准函数】
//
//			参数：	> 无
//			返回：	> 布尔
//##############################
Drill_BGi_Controller.prototype.drill_controller_isDead = function(){
	return this._drill_needDestroy == true;
};

//##############################
// * 控制器 - 切换混合模式【标准函数】
//
//			参数：	> blendMode 数字
//			返回：	> 无
//##############################
Drill_BGi_Controller.prototype.drill_controller_setBlendMode = function( blendMode ){
	this._drill_blendMode = blendMode;
};
//##############################
// * 控制器 - 切换战斗层级【标准函数】
//
//			参数：	> layerIndex 字符串
//			返回：	> 无
//##############################
Drill_BGi_Controller.prototype.drill_controller_setLayerIndex = function( layerIndex ){
	this._drill_layerIndex = layerIndex;
};
//##############################
// * 控制器 - 切换图片层级【标准函数】
//
//			参数：	> zIndex 数字
//			返回：	> 无
//##############################
Drill_BGi_Controller.prototype.drill_controller_setZIndex = function( zIndex ){
	this._drill_zIndex = zIndex;
};
//##############################
// * 控制器 - 修改位移比【标准函数】
//
//			参数：	> xPer,yPer 数字
//			返回：	> 无
//##############################
Drill_BGi_Controller.prototype.drill_controller_setPer = function( xPer, yPer ){
	this._drill_XPer = xPer;
	this._drill_YPer = yPer;
};

//##############################
// * D播放GIF - 设置帧【标准函数】
//
//			参数：	> cur_frame 数字（当前帧）
//			返回：	> 无
//			
//			说明：	> 从帧数0开始计数。
//##############################
Drill_BGi_Controller.prototype.drill_controller_GIF_setFrame = function( cur_frame ){
	var data = this.drill_data();
	
	// > 设置帧
	this._drill_GIF_time = cur_frame * data['interval'];
	if( this._drill_GIF_time < 0 ){ this._drill_GIF_time = 0; }
	
	// > 刷新索引
	var inter = this._drill_GIF_time;
	inter = inter / data['interval'];
	inter = Math.floor(inter);
	inter = inter % data['src_img_gif'].length;
	if( data['back_run'] == true ){
		inter = data['src_img_gif'].length - 1 - inter;
	}
	this._drill_GIF_index = Math.floor(inter);
};
//##############################
// * D播放GIF - 锁定帧/解锁帧【标准函数】
//
//			参数：	> locked 布尔
//			返回：	> 无
//##############################
Drill_BGi_Controller.prototype.drill_controller_GIF_setLocked = function( locked ){
	this._drill_GIF_lockEnabled = locked;
	this._drill_GIF_oncePlay = false;
};
//##############################
// * D播放GIF - 单次播放【标准函数】
//
//			参数：	> once_type 字符串（forwardRun正向播放/backRun反向播放）
//			返回：	> 无
//##############################
Drill_BGi_Controller.prototype.drill_controller_GIF_setOncePlay = function( once_type ){
	var data = this.drill_data();
	this._drill_GIF_oncePlay = true;
	this._drill_GIF_onceType = once_type;
	this._drill_GIF_time = 0;
	this._drill_GIF_onceTarTime = data['src_img_gif'].length * data['interval'];
};

//##############################
// * 控制器 - 初始化数据【标准默认值】
//
//			参数：	> 无
//			返回：	> 无
//			
//			说明：	> 该对象初始化 静态数据，提供所需的所有默认值。
//##############################
Drill_BGi_Controller.prototype.drill_controller_initData = function(){
	var data = this.drill_data();		//（此处会修改到 静态数据 的指针值）
	
	// > A主体 - 基础特性
	if( data['src_img_gif'] == undefined ){ data['src_img_gif'] = [] };								//A主体 - 资源
	if( data['src_img_file'] == undefined ){ data['src_img_file'] = "img/Battle__layer_gif/" };		//A主体 - 文件夹
	if( data['interval'] == undefined ){ data['interval'] = 4 };									//A主体 - 帧间隔
	if( data['back_run'] == undefined ){ data['back_run'] = false };								//A主体 - 是否倒放
	
	if( data['tint'] == undefined ){ data['tint'] = 0 };											//A主体 - 图像-色调值
	if( data['smooth'] == undefined ){ data['smooth'] = false };									//A主体 - 图像-模糊边缘
	
	if( data['visible'] == undefined ){ data['visible'] = true };									//A主体 - 显示情况
	if( data['blendMode'] == undefined ){ data['blendMode'] = 0 };									//A主体 - 混合模式
	if( data['layerIndex'] == undefined ){ data['layerIndex'] = "上层" };							//A主体 - 战斗层级
	if( data['zIndex'] == undefined ){ data['zIndex'] = 0 };										//A主体 - 图片层级
	
	// > A主体 - 其它特性
	if( data['pause'] == undefined ){ data['pause'] = false };										//A主体 - 暂停情况
	if( data['XPer'] == undefined ){ data['XPer'] = 0 };											//A主体 - 位移比X
	if( data['YPer'] == undefined ){ data['YPer'] = 0 };											//A主体 - 位移比Y
	
	
	// > B变换特性
	if( data['x'] == undefined ){ data['x'] = 0 };													//B变换特性 - 平移X
	if( data['y'] == undefined ){ data['y'] = 0 };													//B变换特性 - 平移Y
	if( data['rotate'] == undefined ){ data['rotate'] = 0 };										//B变换特性 - 转速（单位角度）
	if( data['opacity'] == undefined ){ data['opacity'] = 255 };									//B变换特性 - 透明度
	if( data['anchor_x'] == undefined ){ data['anchor_x'] = 0.5 };									//B变换特性 - 锚点X
	if( data['anchor_y'] == undefined ){ data['anchor_y'] = 0.5 };									//B变换特性 - 锚点Y
	
	// > B变换特性 - 3d效果
	if( data['scale_x'] == undefined ){ data['scale_x'] = 1.0 };									//B变换特性 - 3d效果 - 整体缩放X
	if( data['scale_y'] == undefined ){ data['scale_y'] = 1.0 };									//B变换特性 - 3d效果 - 整体缩放Y
	if( data['skew_x'] == undefined ){ data['skew_x'] = 0 };										//B变换特性 - 3d效果 - 整体斜切X
	if( data['skew_y'] == undefined ){ data['skew_y'] = 0 };										//B变换特性 - 3d效果 - 整体斜切Y
	if( data['parentRotate'] == undefined ){ data['parentRotate'] = 0 };							//B变换特性 - 3d效果 - 整体再旋转角度（单位角度）
	
	
	// > C镜头参数（无）
	
	// > D播放GIF
	if( data['gif_lock'] == undefined ){ data['gif_lock'] = false };								//D播放GIF - 初始是否锁定帧
	if( data['gif_initFrame'] == undefined ){ data['gif_initFrame'] = 0 };							//D播放GIF - 锁定帧数
	
	// > E随机位置
	if( data['randomPos_enable'] == undefined ){ data['randomPos_enable'] = false };				//E随机位置 - 是否启用随机位置
	if( data['randomPos_width'] == undefined ){ data['randomPos_width'] = 50 };						//E随机位置 - 随机位置的范围宽度
	if( data['randomPos_height'] == undefined ){ data['randomPos_height'] = 50 };					//E随机位置 - 随机位置的范围高度
	if( data['randomPos_autoChange'] == undefined ){ data['randomPos_autoChange'] = false };		//E随机位置 - 是否在每次播放GIF完毕后变化位置
	if( data['randomPos_gifFrame'] == undefined ){ data['randomPos_gifFrame'] = false };			//E随机位置 - 是否随机GIF初始帧
	
	// > F指令叠加变化（无）
	
	// > G延迟指令（无）
	
	// > H自变化效果
	if( data['effect_float'] == undefined ){ data['effect_float'] = "关闭" };						//H自变化效果 - 浮动效果
	if( data['effect_floatSpeed'] == undefined ){ data['effect_floatSpeed'] = 1.0 };				//H自变化效果 - 浮动速度
	if( data['effect_floatRange'] == undefined ){ data['effect_floatRange'] = 15 };					//H自变化效果 - 浮动偏移量
	if( data['effect_flicker'] == undefined ){ data['effect_flicker'] = "关闭" };					//H自变化效果 - 闪烁效果
	if( data['effect_flickerSpeed'] == undefined ){ data['effect_flickerSpeed'] = 6.0 };			//H自变化效果 - 闪烁速度
	if( data['effect_flickerRange'] == undefined ){ data['effect_flickerRange'] = 20 };				//H自变化效果 - 闪烁幅度范围
	if( data['effect_swing'] == undefined ){ data['effect_swing'] = "关闭" };						//H自变化效果 - 摇晃效果
	if( data['effect_swingSpeed'] == undefined ){ data['effect_swingSpeed'] = 4.0 };				//H自变化效果 - 摇晃速度
	if( data['effect_swingRange'] == undefined ){ data['effect_swingRange'] = 12 };					//H自变化效果 - 摇晃幅度范围
	if( data['effect_zoom'] == undefined ){ data['effect_zoom'] = "关闭" };							//H自变化效果 - 缩放效果
	if( data['effect_zoomSpeed'] == undefined ){ data['effect_zoomSpeed'] = 1.0 };					//H自变化效果 - 缩放速度
	if( data['effect_zoomRange'] == undefined ){ data['effect_zoomRange'] = 0.2 };					//H自变化效果 - 缩放幅度范围
}
//==============================
// * 初始化 - 初始化子功能
//==============================
Drill_BGi_Controller.prototype.drill_controller_initChild = function(){
	this.drill_controller_initAttr();				//初始化子功能 - A主体
	this.drill_controller_initChange();				//初始化子功能 - B变换特性
	this.drill_controller_initCamera();				//初始化子功能 - C镜头参数
	this.drill_controller_initGIF();				//初始化子功能 - D播放GIF
	this.drill_controller_initRandom();				//初始化子功能 - E随机位置
	this.drill_controller_initCommandChange();		//初始化子功能 - F指令叠加变化
	this.drill_controller_initDelayingCommand();	//初始化子功能 - G延迟指令
	this.drill_controller_initEffect();				//初始化子功能 - H自变化效果
}
//==============================
// * 控制器 - 重设数据（私有）
//==============================
Drill_BGi_Controller.prototype.drill_controller_resetData_Private = function( data_id ){
	
	// > 参数检查
	if( typeof data_id != "number" ){
		alert( DrillUp.drill_BGi_getPluginTip_controllerData_NotId("Drill_BGi_Controller") );
		throw Error( DrillUp.drill_BGi_getPluginTip_controllerData_NotId("Drill_BGi_Controller") );
		return;
	}
	
	// > 执行重置
	this._drill_data_id = data_id;
	this._drill_controllerSerial = new Date().getTime() + Math.random();	//（生成一个不重复的序列号）
    this.drill_controller_initData();										//初始化数据
    this.drill_controller_initChild();										//初始化子功能
}
//##############################
// * 控制器 - 空的静态数据
//			
//			说明：	> 空数据会在initData时会进行默认值初始化，在其他地方只读。
//##############################
Drill_BGi_Controller.emptyData = {};
//##############################
// * 控制器 - 获取静态数据【标准函数】
//			
//			参数：	> 无
//			返回：	> 对象指针
//			
//			说明：	> 由于数据量巨大，不要存储到存档中，也不要直接挂载到Controller身上。
//					> 静态数据会在initData时会进行默认值初始化，在其他地方只读。
//					> 【此函数不含遍历，而是直接获取值，可以放在帧刷新中使用】
//##############################
Drill_BGi_Controller.prototype.drill_data = function(){
	var data = DrillUp.g_BGi_style[ this._drill_data_id ];
	if( data == undefined ){ return Drill_BGi_Controller.emptyData; }
	return data;
};


//==============================
// * A主体 - 初始化子功能
//==============================
Drill_BGi_Controller.prototype.drill_controller_initAttr = function(){
	var data = this.drill_data();
	
	// > A主体 - 基础特性
	this._drill_visible = data['visible'];
	this._drill_blendMode = data['blendMode'];
	this._drill_layerIndex = data['layerIndex'];
	this._drill_zIndex = data['zIndex'];
	
	// > A主体 - 其它特性
	this._drill_pause = data['pause'];
	this._drill_XPer = data['XPer'];
	this._drill_YPer = data['YPer'];
	
	// > 常规
	this._drill_curTime = 0;			//常规 - 当前时间
	this._drill_needDestroy = false;	//常规 - 销毁
}
//==============================
// * A主体 - 帧刷新
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateAttr = function(){
	
	// > 时间流逝
	this._drill_curTime += 1;
}
//==============================
// * A主体 - 帧刷新 - 校验值
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateCheckNaN = function(){
	if( $gameTemp == undefined ){ return; }		//（测试版开启功能，发布版关闭功能）
	if( $gameTemp.isPlaytest() != true ){ return; }
	
	// > 校验值
	if( DrillUp.g_BGi_checkNaN == true ){
		if( isNaN( this.drill_controller_finalTransform_x() ) ){
			DrillUp.g_BGi_checkNaN = false;
			alert( DrillUp.drill_BGi_getPluginTip_ParamIsNaN( "drill_controller_finalTransform_x" ) );
		}
		if( isNaN( this.drill_controller_finalTransform_y() ) ){
			DrillUp.g_BGi_checkNaN = false;
			alert( DrillUp.drill_BGi_getPluginTip_ParamIsNaN( "drill_controller_finalTransform_y" ) );
		}
		if( isNaN( this.drill_controller_finalTransform_opacity() ) ){
			DrillUp.g_BGi_checkNaN = false;
			alert( DrillUp.drill_BGi_getPluginTip_ParamIsNaN( "drill_controller_finalTransform_opacity" ) );
		}
		if( isNaN( this.drill_controller_finalTransform_rotate() ) ){
			DrillUp.g_BGi_checkNaN = false;
			alert( DrillUp.drill_BGi_getPluginTip_ParamIsNaN( "drill_controller_finalTransform_rotate" ) );
		}
	}
}

//==============================
// * B变换特性 - 初始化子功能
//==============================
Drill_BGi_Controller.prototype.drill_controller_initChange = function(){
	var data = this.drill_data();
	
	// > 变换值 - 锚点
	this._drill_change_anchor_x = data['anchor_x'];
	this._drill_change_anchor_y = data['anchor_y'];
	
	// > 变换值 - 位置
	this._drill_change_x = data['x'];
	this._drill_change_y = data['y'];
	
	
	// > 变换值 - 缩放
	this._drill_change_scaleX = data['scale_x'];	//（3d效果）
	this._drill_change_scaleY = data['scale_y'];
	
	// > 变换值 - 缩放（圈贴图）
	//	（无）
	
	
	// > 变换值 - 透明度
	this._drill_change_opacity = data['opacity'];
	
	
	// > 变换值 - 斜切
	this._drill_change_skewX = data['skew_x'];		//（3d效果）
	this._drill_change_skewY = data['skew_y'];
	
	// > 变换值 - 斜切（圈贴图）
	//	（无）
	
	
	// > 变换值 - 旋转
	this._drill_change_rotate = data['parentRotate'];		//（整体再旋转角度）
	
	// > 变换值 - 旋转（圈贴图）
	this._drill_childGIF_rotation = 0;					//（自旋转）
	this._drill_childGIF_rotateSpeed = data['rotate'];	//（自旋转速度）
}
//==============================
// * B变换特性 - 帧刷新 旋转
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateChange_Rotation = function(){
	
	// > 变换值 - 帧刷新 旋转（圈贴图）
	this._drill_childGIF_rotation += this._drill_childGIF_rotateSpeed;
}
//##############################
// * B变换特性 - 数据最终变换值 - 位置X（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_x = function(){
	return this._drill_change_x
		+ this._drill_cameraResultSpriteX;	//（镜头位移结果，见函数 drill_BGi_updateControllerCamera ）
}
//##############################
// * B变换特性 - 数据最终变换值 - 位置Y（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_y = function(){
	return this._drill_change_y
		+ this._drill_cameraResultSpriteY;	//（镜头位移结果，见函数 drill_BGi_updateControllerCamera ）
}
//##############################
// * B变换特性 - 数据最终变换值 - 缩放X（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_scaleX = function(){
	return this._drill_change_scaleX;
}
//##############################
// * B变换特性 - 数据最终变换值 - 缩放Y（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_scaleY = function(){
	return this._drill_change_scaleY;
}
//##############################
// * B变换特性 - 数据最终变换值 - 透明度（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_opacity = function(){
	return this._drill_change_opacity;
}
//##############################
// * B变换特性 - 数据最终变换值 - 斜切X（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_skewX = function(){
	return this._drill_change_skewX;
}
//##############################
// * B变换特性 - 数据最终变换值 - 斜切Y（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_skewY = function(){
	return this._drill_change_skewY;
}
//##############################
// * B变换特性 - 数据最终变换值 - 旋转（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_rotate = function(){
	return this._drill_change_rotate;
}
//##############################
// * B变换特性 - 数据最终变换值 - 转速（可继承，开放函数）
//##############################
Drill_BGi_Controller.prototype.drill_controller_finalTransform_rotateSpeed = function(){
	return this._drill_childGIF_rotateSpeed;
}


//==============================
// * C镜头参数 - 初始化子功能
//
//			说明：	> 战斗界面 不具备循环积累值 的位移。
//==============================
Drill_BGi_Controller.prototype.drill_controller_initCamera = function(){
	this._drill_cameraResultSpriteX = 0;	//镜头位移结果
	this._drill_cameraResultSpriteY = 0;
}


//==============================
// * D播放GIF - 初始化子功能
//==============================
Drill_BGi_Controller.prototype.drill_controller_initGIF = function(){
	var data = this.drill_data();
	
	// > 播放GIF
	this.drill_controller_GIF_setFrame( data['gif_initFrame'] -1 );		//播放GIF - 当前时间
	this._drill_GIF_index = 0;											//播放GIF - 当前索引
	this._drill_GIF_lockEnabled = data['gif_lock'];						//播放GIF - 是否锁定帧
	
	// > 单次播放
	this._drill_GIF_oncePlay = false;
	this._drill_GIF_onceType = "forwardRun";	//（forwardRun正向播放/backRun反向播放）
	this._drill_GIF_onceTarTime = 0;
}
//==============================
// * D播放GIF - 帧刷新
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateGIF = function(){
	var data = this.drill_data();
	
	// > 单次播放
	if( this._drill_GIF_oncePlay == true ){
		
		// > 播放GIF
		var inter = this._drill_GIF_time;
		inter = inter / data['interval'];
		inter = Math.floor(inter);
		inter = inter % data['src_img_gif'].length;
		if( this._drill_GIF_onceType == "backRun" ){
			inter = data['src_img_gif'].length - 1 - inter;
		}
		this._drill_GIF_index = Math.floor(inter);
		
		// > 时间+1（放后面）
		this._drill_GIF_time += 1;
		
		// > 播放完毕后，锁定帧
		if( this._drill_GIF_time > this._drill_GIF_onceTarTime ){
			this._drill_GIF_oncePlay = false;
			this.drill_controller_GIF_setLocked( true );
		}
		return;
	}
	
	
	// > 锁定帧时（注意，锁定帧时 _drill_GIF_index 不刷新）
	if( this._drill_GIF_lockEnabled == true ){ return; }
	
	// > 播放GIF
	var inter = this._drill_GIF_time;
	inter = inter / data['interval'];
	inter = Math.floor(inter);
	inter = inter % data['src_img_gif'].length;
	if( data['back_run'] == true ){
		inter = data['src_img_gif'].length - 1 - inter;
	}
	this._drill_GIF_index = Math.floor(inter);
	
	// > 时间+1（放后面）
	this._drill_GIF_time += 1;
}

//==============================
// * E随机位置 - 初始化子功能
//
//			说明：	> 此功能对 B变换特性 和 D播放GIF 进行组合控制。
//==============================
Drill_BGi_Controller.prototype.drill_controller_initRandom = function(){
	var data = this.drill_data();
	
	// > 随机位置
	this._drill_randomPos_x = 0;			//随机位置 - 位置X
	this._drill_randomPos_y = 0;			//随机位置 - 位置Y
	this._drill_randomPos_lastInter = 0;	//随机位置 - 上一次时间
	if( data['randomPos_enable'] == true ){
		this._drill_randomPos_x = Math.floor( data['randomPos_width'] *( Math.random()-0.5 ));
		this._drill_randomPos_y = Math.floor( data['randomPos_height']*( Math.random()-0.5 ));
	}
	if( data['randomPos_gifFrame'] == true ){
		this._drill_GIF_time = Math.floor( data['interval']*data['src_img_gif'].length * Math.random() );
	}
}
//==============================
// * E随机位置 - 帧刷新
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateRandom = function(){
	var data = this.drill_data();
	
	// > 每次播放结束后变化
	if( data['randomPos_enable'] == true ){
		var inter = Math.floor(this._drill_GIF_time / data['interval'] / data['src_img_gif'].length);
		if( this._drill_randomPos_lastInter != inter ){
			this._drill_randomPos_lastInter = inter;
			this._drill_randomPos_x = Math.floor( data['randomPos_width'] *( Math.random()-0.5 ));
			this._drill_randomPos_y = Math.floor( data['randomPos_height']*( Math.random()-0.5 ));
		}
	}
}


//==============================
// * F指令叠加变化 - 初始化子功能
//
//			说明：	> 此处使用弹道核心提供的 弹道扩展工具-A叠加变化宏定义 控制器部分。
//					> 参数使用字符串进行控制，默认为 null 值。
//==============================
Drill_BGi_Controller.prototype.drill_controller_initCommandChange = function(){
	
	// > 控制器参数 - 移动到
	this["_drill_command_move_data"] = undefined;
	
	// > 控制器参数 - 透明度
	this["_drill_command_opacity_data"] = undefined;
	
	// > 控制器参数 - 旋转
	this["_drill_command_rotate_data"] = undefined;
	// > 控制器参数 - 转速
	this["_drill_command_rotateSpeed_data"] = undefined;
	
	// > 控制器参数 - 缩放X
	this["_drill_command_scaleX_data"] = undefined;
	// > 控制器参数 - 缩放Y
	this["_drill_command_scaleY_data"] = undefined;
	
	// > 控制器参数 - 斜切X
	this["_drill_command_skewX_data"] = undefined;
	// > 控制器参数 - 斜切Y
	this["_drill_command_skewY_data"] = undefined;
}
//==============================
// * F指令叠加变化 - 帧刷新
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateCommandChange = function(){
	
	// > 帧刷新 - 移动到（二维弹道）
	Drill_COBa_ExtendTool.drill_COBa_Planimetry_controller_update( this, "_drill_command_move_data" );
	
	// > 帧刷新 - 透明度
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_opacity_data" );
	
	// > 帧刷新 - 旋转
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_rotate_data" );
	// > 帧刷新 - 转速
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_rotateSpeed_data" );
	
	// > 帧刷新 - 缩放X
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_scaleX_data" );
	// > 帧刷新 - 缩放Y
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_scaleY_data" );
	
	// > 帧刷新 - 斜切X
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_skewX_data" );
	// > 帧刷新 - 斜切Y
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_update( this, "_drill_command_skewY_data" );
}
//==============================
// * F指令叠加变化 - 立即还原所有单属性
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_restoreAttr = function(){
	
	// > 控制器参数 - 移动到
	//	（这里不含）
	
	// > 控制器参数 - 透明度
	this["_drill_command_opacity_data"] = undefined;
	
	// > 控制器参数 - 旋转
	this["_drill_command_rotate_data"] = undefined;
	// > 控制器参数 - 转速
	this["_drill_command_rotateSpeed_data"] = undefined;
	
	// > 控制器参数 - 缩放X
	this["_drill_command_scaleX_data"] = undefined;
	// > 控制器参数 - 缩放Y
	this["_drill_command_scaleY_data"] = undefined;
	
	// > 控制器参数 - 斜切X
	this["_drill_command_skewX_data"] = undefined;
	// > 控制器参数 - 斜切Y
	this["_drill_command_skewY_data"] = undefined;
}
//==============================
// * F指令叠加变化 - 立即归位
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_restoreMove = function(){
	this["_drill_command_move_data"] = undefined;
}
//==============================
// * F指令叠加变化 - 修改单属性 - 移动到
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setMove = function( change_type, tar_valueA, tar_valueB, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Planimetry_controller_setTarget(
		this, "_drill_command_move_data", data['x'], data['y'],		//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_valueA, tar_valueB, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 透明度
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setOpacity = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_opacity_data", data['opacity'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 旋转
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setRotate = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_rotate_data", data['parentRotate'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 转速
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setRotateSpeed = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_rotateSpeed_data", data['rotate'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 缩放X
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setScaleX = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_scaleX_data", data['scale_x'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 缩放Y
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setScaleY = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_scaleY_data", data['scale_y'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 斜切X
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setSkewX = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_skewX_data", data['skew_x'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}
//==============================
// * F指令叠加变化 - 修改单属性 - 斜切Y
//==============================
Drill_BGi_Controller.prototype.drill_controller_commandChange_setSkewY = function( change_type, tar_value, tar_time ){
	var data = this.drill_data();
	Drill_COBa_ExtendTool.drill_COBa_Common_controller_setTarget(
		this, "_drill_command_skewY_data", data['skew_y'],	//（调用时要给定 初始值，虽然初始值只在第一次调用指令时有效，但必须要给）
		change_type, tar_value, tar_time
	);
}


//==============================
// * G延迟指令 - 初始化子功能
//==============================
Drill_BGi_Controller.prototype.drill_controller_initDelayingCommand = function(){
	this._drill_curDelayingCommandTank = [];
}
//==============================
// * G延迟指令 - 帧刷新 - 时间流逝
//
//			说明：	> 此处的时间流逝不会因为 暂停 而停止流逝。
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateDelayingCommandImportant = function(){
	if( this._drill_curDelayingCommandTank.length == 0 ){ return; }
	
	// > 帧刷新 时间流逝
	for(var i = 0; i < this._drill_curDelayingCommandTank.length; i++ ){
		var dc_data = this._drill_curDelayingCommandTank[i];
		
		// > 时间-1
		dc_data['left_time'] -= 1;
		
	}
	
	// > 执行延迟指令（暂停/继续）
	for(var i = 0; i < this._drill_curDelayingCommandTank.length; i++ ){
		var dc_data = this._drill_curDelayingCommandTank[i];
		if( dc_data['left_time'] < 0 ){
			var method = dc_data['method'];
			var paramList = dc_data['paramList'];
			if( method == "drill_controller_setPause" ){
				this.drill_controller_setPause( paramList[0] );
			}
		}
	}
}
//==============================
// * G延迟指令 - 帧刷新 - 执行延迟指令
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateDelayingCommand = function(){
	if( this._drill_curDelayingCommandTank.length == 0 ){ return; }
	
	// > 执行延迟指令
	for(var i = 0; i < this._drill_curDelayingCommandTank.length; i++ ){
		var dc_data = this._drill_curDelayingCommandTank[i];
		if( dc_data['left_time'] < 0 ){
			var method = dc_data['method'];
			var paramList = dc_data['paramList'];
			
			if( method == "drill_controller_setVisible" ){
				this.drill_controller_setVisible( paramList[0] );
			
			}else if( method == "drill_controller_commandChange_setOpacity" ){
				this.drill_controller_commandChange_setOpacity( paramList[0], paramList[1], paramList[2] );
			}else if( method == "drill_controller_commandChange_setRotate" ){
				this.drill_controller_commandChange_setRotate( paramList[0], paramList[1], paramList[2] );
			}else if( method == "drill_controller_commandChange_setRotateSpeed" ){
				this.drill_controller_commandChange_setRotateSpeed( paramList[0], paramList[1], paramList[2] );
				
			}else if( method == "drill_controller_commandChange_setScaleX" ){
				this.drill_controller_commandChange_setScaleX( paramList[0], paramList[1], paramList[2] );
			}else if( method == "drill_controller_commandChange_setScaleY" ){
				this.drill_controller_commandChange_setScaleY( paramList[0], paramList[1], paramList[2] );
			}else if( method == "drill_controller_commandChange_setSkewX" ){
				this.drill_controller_commandChange_setSkewX( paramList[0], paramList[1], paramList[2] );
			}else if( method == "drill_controller_commandChange_setSkewY" ){
				this.drill_controller_commandChange_setSkewY( paramList[0], paramList[1], paramList[2] );
			}else if( method == "drill_controller_commandChange_restoreAttr" ){
				this.drill_controller_commandChange_restoreAttr();
			
			}else if( method == "drill_controller_commandChange_setMove" ){
				this.drill_controller_commandChange_setMove( paramList[0], paramList[1], paramList[2], paramList[3] );
			}else if( method == "drill_controller_commandChange_restoreMove" ){
				this.drill_controller_commandChange_restoreMove();
			
			}else if( method == "drill_controller_GIF_setLocked" ){
				this.drill_controller_GIF_setLocked( paramList[0] );
			}else if( method == "drill_controller_GIF_setOncePlay" ){
				this.drill_controller_GIF_setOncePlay( paramList[0] );
			}else if( method == "drill_controller_GIF_setFrame" ){
				this.drill_controller_GIF_setFrame( paramList[0] );
			}
		}
	}
	
	// > 销毁延迟指令
	for(var i = this._drill_curDelayingCommandTank.length-1; i >= 0; i-- ){
		var dc_data = this._drill_curDelayingCommandTank[i];
		if( dc_data['left_time'] < 0 ){
			this._drill_curDelayingCommandTank.splice( i, 1 );
		}
	}
}
//==============================
// * G延迟指令 - 设置指令（开放函数）
//==============================
Drill_BGi_Controller.prototype.drill_controller_setDelayingCommand = function( method, paramList, delay_time ){
	if( method != "drill_controller_setVisible" &&
		method != "drill_controller_setPause" &&
		
		method != "drill_controller_commandChange_setOpacity" &&
		method != "drill_controller_commandChange_setRotate" &&
		method != "drill_controller_commandChange_setRotateSpeed" &&
		
		method != "drill_controller_commandChange_setScaleX" &&
		method != "drill_controller_commandChange_setScaleY" &&
		method != "drill_controller_commandChange_setSkewX" &&
		method != "drill_controller_commandChange_setSkewY" &&
		method != "drill_controller_commandChange_restoreAttr" &&
		
		method != "drill_controller_commandChange_setMove" &&
		method != "drill_controller_commandChange_restoreMove" &&
		
		method != "drill_controller_GIF_setLocked" &&
		method != "drill_controller_GIF_setOncePlay" &&
		method != "drill_controller_GIF_setFrame"
	){ return; }
	
	var dc_data = {};
	dc_data['method'] = method;
	dc_data['paramList'] = paramList;
	dc_data['left_time'] = delay_time;
	this._drill_curDelayingCommandTank.push( dc_data );
}
//==============================
// * G延迟指令 - 清空全部（开放函数）
//==============================
Drill_BGi_Controller.prototype.drill_controller_clearDelayingCommand = function(){
	this._drill_curDelayingCommandTank = [];
}


//==============================
// * H自变化效果 - 初始化子功能
//==============================
Drill_BGi_Controller.prototype.drill_controller_initEffect = function(){
	this._drill_curEffectTime = 0;
}
//==============================
// * H自变化效果 - 帧刷新
//==============================
Drill_BGi_Controller.prototype.drill_controller_updateEffect = function(){
	this._drill_curEffectTime += 1;
}



//=============================================================================
// ** 战斗GIF贴图【Drill_BGi_Sprite】
// **
// **		作用域：	战斗界面
// **		主功能：	> 定义一个GIF贴图。
// **		子功能：	->贴图
// **						->是否就绪
// **						->优化策略
// **						->是否需要销毁（未使用）
// **						->销毁（手动）
// **					->A主体
// **					->B变换特性
// **					->C对象绑定
// **						->设置控制器
// **						->贴图初始化（手动）
// **					->D播放GIF
// **					->F指令叠加变化-控制器用
// **					->G延迟指令
// **					->H自变化效果
// **
// **		说明：	> 你必须在创建贴图后，手动初始化。（还需要先设置 控制器 ）
// **
// **		代码：	> 范围 - 该类显示单独的贴图。
// **				> 结构 - [合并/ ●分离 /混乱] 使用 控制器-贴图 结构。
// **				> 数量 - [单个/ ●多个] 
// **				> 创建 - [ ●一次性 /自延迟/外部延迟] 先创建控制器，再创建此贴图，通过 C对象绑定 进行连接。
// **				> 销毁 - [不考虑/自销毁/ ●外部销毁 ] 通过 控制器与贴图 模块来销毁。
// **				> 样式 - [ ●不可修改 /自变化/外部变化] 
//=============================================================================
//==============================
// * GIF贴图 - 定义
//==============================
function Drill_BGi_Sprite() {
    this.initialize.apply(this, arguments);
};
Drill_BGi_Sprite.prototype = Object.create(Sprite.prototype);
Drill_BGi_Sprite.prototype.constructor = Drill_BGi_Sprite;
//==============================
// * GIF贴图 - 初始化
//==============================
Drill_BGi_Sprite.prototype.initialize = function(){
	Sprite.prototype.initialize.call(this);
	this.drill_sprite_initSelf();				//初始化自身
};
//==============================
// * GIF贴图 - 帧刷新
//==============================
Drill_BGi_Sprite.prototype.update = function(){
	if( this.drill_sprite_isReady() == false ){ return; }
	if( this.drill_sprite_isOptimizationPassed() == false ){ return; }
	Sprite.prototype.update.call(this);
	this.drill_sprite_updateAttr();					//帧刷新 - A主体
	this.drill_sprite_updateChange();				//帧刷新 - B变换特性
													//帧刷新 - C对象绑定（无）
	this.drill_sprite_updateGIF();					//帧刷新 - D播放GIF
	this.drill_sprite_updateCommandChange();		//帧刷新 - F指令叠加变化-控制器用
													//帧刷新 - G延迟指令（无）
	this.drill_sprite_updateEffect();				//帧刷新 - H自变化效果
}

//##############################
// * C对象绑定 - 设置控制器【开放函数】
//			
//			参数：	> controller 控制器对象
//			返回：	> 无
//			
//			说明：	> 由于贴图与数据分离，贴图必须依赖一个数据对象。
//##############################
Drill_BGi_Sprite.prototype.drill_sprite_setController = function( controller ){
	this._drill_controller = controller;
	this._drill_curSerial = controller._drill_controllerSerial;
};
//##############################
// * C对象绑定 - 贴图初始化【开放函数】
//			
//			参数：	> 无
//			返回：	> 无
//			
//			说明：	> 需要设置 控制器 之后，才能进行初始化。
//##############################
Drill_BGi_Sprite.prototype.drill_sprite_initChild = function(){
	this.drill_sprite_initAttr();				//初始化子功能 - A主体
	this.drill_sprite_initChange();				//初始化子功能 - B变换特性
												//初始化子功能 - C对象绑定（无）
	this.drill_sprite_initGIF();				//初始化子功能 - D播放GIF
	this.drill_sprite_initCommandChange();		//初始化子功能 - F指令叠加变化-控制器用
	this.drill_sprite_initDelayingCommand();	//初始化子功能 - G延迟指令
	this.drill_sprite_initEffect();				//初始化子功能 - H自变化效果
};

//##############################
// * GIF贴图 - 是否就绪【标准函数】
//			
//			参数：	> 无
//			返回：	> 布尔（是否显示）
//			
//			说明：	> 这里完全 不考虑 延迟加载问题。
//##############################
Drill_BGi_Sprite.prototype.drill_sprite_isReady = function(){
	if( this._drill_controller == undefined ){ return false; }
    return true;
};
//##############################
// * GIF贴图 - 优化策略【标准函数】
//			
//			参数：	> 无
//			返回：	> 布尔（是否通过）
//			
//			说明：	> 通过时，正常帧刷新；未通过时，不执行帧刷新。
//##############################
Drill_BGi_Sprite.prototype.drill_sprite_isOptimizationPassed = function(){
	return true;
};
//##############################
// * GIF贴图 - 是否需要销毁【标准函数】
//			
//			参数：	> 无
//			返回：	> 布尔（是否需要销毁）
//			
//			说明：	> 此函数可用于监听 控制器数据 是否被销毁，数据销毁后，贴图可自动销毁。
//##############################
Drill_BGi_Sprite.prototype.drill_sprite_isNeedDestroy = function(){
	if( this._drill_controller == undefined ){ return false; }	//（未绑定时，不销毁）
	if( this._drill_controller._drill_needDestroy == true ){ return true; }
    return false;
};
//##############################
// * GIF贴图 - 销毁【标准函数】
//			
//			参数：	> 无
//			返回：	> 无
//			
//			说明：	> 销毁不是必要的，但最好随时留意给 旧贴图 执行销毁函数。
//##############################
Drill_BGi_Sprite.prototype.drill_sprite_destroy = function(){
	this.drill_sprite_destroyChild();			//销毁 - 销毁子功能
	this.drill_sprite_destroySelf();			//销毁 - 销毁自身
};
//==============================
// * GIF贴图 - 贴图初始化（私有）
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initSelf = function(){
	this._drill_controller = null;				//控制器对象
	this._drill_curSerial = -1;					//当前序列号
};
//==============================
// * GIF贴图 - 销毁子功能（私有）
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_destroyChild = function(){
	if( this._drill_controller == null ){ return; }
	
	// > 销毁 - A主体
	this.visible = false;
	this._drill_layerSprite.removeChild( this._drill_childGIFSprite );
	this.removeChild( this._drill_layerSprite );
	this._drill_childGIFSprite = null;
	this._drill_layerSprite = null;
	
	// > 销毁 - B变换特性
	//	（无）
	
	// > 销毁 - C对象绑定
	//	（无）
	
	// > 销毁 - D播放GIF
	//	（无）
};
//==============================
// * GIF贴图 - 销毁自身（私有）
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_destroySelf = function(){
	this._drill_controller = null;				//控制器对象
	this._drill_curSerial = -1;					//当前序列号
};


//==============================
// * A主体 - 初始化子功能
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initAttr = function(){
	var data = this._drill_controller.drill_data();
	/*
		贴图的层级如下：
			- 主体贴图
			- - 层贴图
			- - - 圈贴图
		
		其中，圈贴图专门用于旋转（所以缩放必须为1.0），层贴图可以带遮罩，
		主体贴图和层贴图的缩放旋转效果一样，可以看情况自定义，不需要刻意区分。
	*/
	
	// > 主体贴图
	this.anchor.x = 0.5;
	this.anchor.y = 0.5;
	this.visible = this._drill_controller._drill_visible;
	this.blendMode = this._drill_controller._drill_blendMode;
	this.layerIndex = this._drill_controller._drill_layerIndex;
	this.zIndex = this._drill_controller._drill_zIndex;
	
	// > 圈贴图 - 资源对象组
	this._drill_bitmapTank = [];
	for(var j = 0; j < data['src_img_gif'].length; j++ ){
		var bitmap = ImageManager.loadBitmap( data['src_img_file'], data['src_img_gif'][j], data['tint'], data['smooth'] );
		this._drill_bitmapTank.push( bitmap );
	}
	
	// > 圈贴图
	var temp_sprite = new Sprite(); 
	temp_sprite.anchor.x = 0.5;
	temp_sprite.anchor.y = 0.5;
	temp_sprite.blendMode = this._drill_controller._drill_blendMode;
	temp_sprite.bitmap = this._drill_bitmapTank[0];
	this._drill_childGIFSprite = temp_sprite;
	
	// > 层贴图
	var temp_layer = new Sprite();		//GIF样式两层容器
	temp_layer.anchor.x = 0.5;
	temp_layer.anchor.y = 0.5;
	temp_layer.blendMode = this._drill_controller._drill_blendMode;
	this._drill_layerSprite = temp_layer;
	
	this._drill_layerSprite.addChild( this._drill_childGIFSprite );
	this.addChild( this._drill_layerSprite );
}
//==============================
// * A主体 - 帧刷新
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_updateAttr = function(){
	
	// > 基础特性 - 可见
	this.visible = this._drill_controller._drill_visible;
	
	// > 基础特性 - 混合模式
	if( this.blendMode != this._drill_controller._drill_blendMode ){
		this.blendMode =  this._drill_controller._drill_blendMode;
		this._drill_layerSprite.blendMode = this._drill_controller._drill_blendMode;
		this._drill_childGIFSprite.blendMode = this._drill_controller._drill_blendMode;
	}
	
	//（其它 基础特性 的帧刷新赋值见：drill_BGi_updateAttr）
}


//==============================
// * B变换特性 - 初始化子功能
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initChange = function(){
	//（无）
}
//==============================
// * B变换特性 - 帧刷新
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_updateChange = function(){
	
	// > 贴图 - 锚点（圈贴图）
	//		（锚点只能放 圈贴图 才能有效）
	this._drill_childGIFSprite.anchor.x = this._drill_controller._drill_change_anchor_x;
	this._drill_childGIFSprite.anchor.y = this._drill_controller._drill_change_anchor_y;
	
	
	// > 贴图 - 位置
	var xx = this._drill_controller.drill_controller_finalTransform_x();
	var yy = this._drill_controller.drill_controller_finalTransform_y();
	this.x = xx;
	this.y = yy;
	
	
	// > 贴图 - 缩放
	this._drill_layerSprite.scale.x  = this._drill_controller.drill_controller_finalTransform_scaleX();
	this._drill_layerSprite.scale.y  = this._drill_controller.drill_controller_finalTransform_scaleY();
	
	// > 贴图 - 缩放（圈贴图）
	//	（无）
	
	
	// > 贴图 - 透明度
	this.opacity = this._drill_controller.drill_controller_finalTransform_opacity();
	
	
	// > 贴图 - 斜切
	this._drill_layerSprite.skew.x   = this._drill_controller.drill_controller_finalTransform_skewX();
	this._drill_layerSprite.skew.y   = this._drill_controller.drill_controller_finalTransform_skewY();
	
	// > 贴图 - 斜切（圈贴图）
	//	（无）
	
	
	// > 贴图 - 旋转
	this.rotation = this._drill_controller.drill_controller_finalTransform_rotate() *Math.PI/180;
	
	// > 贴图 - 旋转（圈贴图）
	this._drill_childGIFSprite.rotation = this._drill_controller._drill_childGIF_rotation *Math.PI/180;
}


//==============================
// * C对象绑定 - 初始化子功能
//==============================
//（无，此处不要赋值）


//==============================
// * D播放GIF - 初始化子功能
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initGIF = function(){
	//	（无）
}
//==============================
// * D播放GIF - 帧刷新
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_updateGIF = function(){
	
	// > 贴图Bitmap
	this._drill_childGIFSprite.bitmap = this._drill_bitmapTank[ this._drill_controller._drill_GIF_index ];
}


//==============================
// * F指令叠加变化-控制器用 - 初始化子功能
//
//			说明：	> 此处使用弹道核心提供的 弹道扩展工具-A叠加变化宏定义 贴图部分。
//					> 之所以把代码放这里，是因为 控制器-贴图 一对一，且可以节约弹道计算的存储空间。
//					> 参数使用字符串进行控制，默认为 null 值。
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initCommandChange = function(){
	
	// > 贴图参数 - 移动到
	this["_drill_command_move_spriteData"] = undefined;
	
	// > 贴图参数 - 透明度
	this["_drill_command_opacity_spriteData"] = undefined;
	
	// > 贴图参数 - 旋转
	this["_drill_command_rotate_spriteData"] = undefined;
	// > 贴图参数 - 转速
	this["_drill_command_rotateSpeed_spriteData"] = undefined;
	
	// > 贴图参数 - 缩放X
	this["_drill_command_scaleX_spriteData"] = undefined;
	// > 贴图参数 - 缩放Y
	this["_drill_command_scaleY_spriteData"] = undefined;
	
	// > 贴图参数 - 斜切X
	this["_drill_command_skewX_spriteData"] = undefined;
	// > 贴图参数 - 斜切Y
	this["_drill_command_skewY_spriteData"] = undefined;
}
//==============================
// * F指令叠加变化-控制器用 - 帧刷新
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_updateCommandChange = function(){
	var data = this._drill_controller.drill_data();
	var controller = this._drill_controller;
	
	// > 移动到 - 帧刷新
	var CDataName = "_drill_command_move_data";
	var SDataName = "_drill_command_move_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Planimetry_sprite_update( this, SDataName, controller, CDataName );
	
	// > 移动到 - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_x = controller[CDataName]['cur_valueA'];
		controller._drill_change_y = controller[CDataName]['cur_valueB'];
	}else{
		controller._drill_change_x = data['x'];	//（没有数据时，赋值为 初始值）
		controller._drill_change_y = data['y'];
	}
	
	
	// > 透明度 - 帧刷新
	var CDataName = "_drill_command_opacity_data";
	var SDataName = "_drill_command_opacity_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 透明度 - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_opacity = controller[CDataName]['cur_value'];
	}else{
		controller._drill_change_opacity = data['opacity'];	//（没有数据时，赋值为 初始值）
	}
	
	
	// > 旋转 - 帧刷新
	var CDataName = "_drill_command_rotate_data";
	var SDataName = "_drill_command_rotate_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 旋转 - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_rotate = controller[CDataName]['cur_value'];	//（整体再旋转角度）
	}else{
		controller._drill_change_rotate = data['parentRotate'];	//（没有数据时，赋值为 初始值）
	}
	
	
	// > 转速 - 帧刷新
	var CDataName = "_drill_command_rotateSpeed_data";
	var SDataName = "_drill_command_rotateSpeed_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 转速 - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_childGIF_rotateSpeed = controller[CDataName]['cur_value'];
	}else{
		controller._drill_childGIF_rotateSpeed = data['rotate'];	//（没有数据时，赋值为 初始值）
	}
	
	
	// > 缩放X - 帧刷新
	var CDataName = "_drill_command_scaleX_data";
	var SDataName = "_drill_command_scaleX_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 缩放X - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_scaleX = controller[CDataName]['cur_value'];
	}else{
		controller._drill_change_scaleX = data['scale_x'];	//（没有数据时，赋值为 初始值）
	}
	
	
	// > 缩放Y - 帧刷新
	var CDataName = "_drill_command_scaleY_data";
	var SDataName = "_drill_command_scaleY_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 缩放Y - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_scaleY = controller[CDataName]['cur_value'];
	}else{
		controller._drill_change_scaleY = data['scale_y'];	//（没有数据时，赋值为 初始值）
	}
	
	
	// > 斜切X - 帧刷新
	var CDataName = "_drill_command_skewX_data";
	var SDataName = "_drill_command_skewX_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 斜切X - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_skewX = controller[CDataName]['cur_value'];
	}else{
		controller._drill_change_skewX = data['skew_x'];	//（没有数据时，赋值为 初始值）
	}
	
	
	// > 斜切Y - 帧刷新
	var CDataName = "_drill_command_skewY_data";
	var SDataName = "_drill_command_skewY_spriteData";
	Drill_COBa_ExtendTool.drill_COBa_Common_sprite_update( this, SDataName, controller, CDataName );
	
	// > 斜切Y - 控制器赋值（覆盖）
	if( controller[CDataName] != undefined ){
		controller._drill_change_skewY = controller[CDataName]['cur_value'];
	}else{
		controller._drill_change_skewY = data['skew_y'];	//（没有数据时，赋值为 初始值）
	}
}


//==============================
// * G延迟指令 - 初始化子功能
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initDelayingCommand = function(){
	//（无）
}


//==============================
// * H自变化效果 - 初始化子功能
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_initEffect = function(){
	//（无）
}
//==============================
// * H自变化效果 - 帧刷新
//==============================
Drill_BGi_Sprite.prototype.drill_sprite_updateEffect = function(){
	var data = this._drill_controller.drill_data();
	var cur_time = this._drill_controller._drill_curEffectTime;
	
	// > 浮动效果
	if( data['effect_float'] == "左右浮动" ){
		var speed = data['effect_floatSpeed'];
		var range = data['effect_floatRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this.x += value;
	}
	if( data['effect_float'] == "上下浮动" ){
		var speed = data['effect_floatSpeed'];
		var range = data['effect_floatRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this.y += value;
	}
	if( data['effect_float'] == "左上右下斜向浮动" ){
		var speed = data['effect_floatSpeed'];
		var range = data['effect_floatRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this.x += value;
		this.y += value;
	}
	if( data['effect_float'] == "右上左下斜向浮动" ){
		var speed = data['effect_floatSpeed'];
		var range = data['effect_floatRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this.x -= value;
		this.y += value;
	}
	// > 闪烁效果
	if( data['effect_flicker'] == "开启" ){
		var speed = data['effect_flickerSpeed'];
		var range = data['effect_flickerRange'];
		this.opacity += range * Math.sin( cur_time * speed /180*Math.PI );
	}
	// > 摇晃效果
	if( data['effect_swing'] == "开启" ){
		var speed = data['effect_swingSpeed'];
		var range = data['effect_swingRange'];
		var value = range / 180 * Math.PI * Math.sin( cur_time * speed /180*Math.PI );
		this._drill_childGIFSprite.rotation += value;
	}
	// > 缩放效果
	if( data['effect_zoom'] == "左右缩放" ){
		var speed = data['effect_zoomSpeed'];
		var range = data['effect_zoomRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this._drill_layerSprite.scale.x += value;
	}
	if( data['effect_zoom'] == "上下缩放" ){
		var speed = data['effect_zoomSpeed'];
		var range = data['effect_zoomRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this._drill_layerSprite.scale.y += value;
	}
	if( data['effect_zoom'] == "整体缩放" ){
		var speed = data['effect_zoomSpeed'];
		var range = data['effect_zoomRange'];
		var value = range * Math.sin( cur_time * speed /180*Math.PI );
		this._drill_layerSprite.scale.x += value;
		this._drill_layerSprite.scale.y += value;
	}
}


//=============================================================================
// * <<<<基于插件检测<<<<
//=============================================================================
}else{
		Imported.Drill_BattleGif = false;
		Imported.Drill_LayerGIF = false;
		var pluginTip = DrillUp.drill_BGi_getPluginTip_NoBasePlugin();
		alert( pluginTip );
}

