/*:
 *
 * @plugindesc (v3.1.1) 玩家探索插件
 * @author マンカインド
 *
 * @help = 玩家探索插件 =
 * MKR_PlayerSensor.js
 *
 * 绘制目标事件（以下称为探索者）的视野范围，
 * 当玩家位于范围内时，
 * 该探索者进入发现状态并将指定的开关设为ON。
 * （开关为ON期间，探索者不会转向被搭话的方向）
 *
 * 当玩家移出视野范围格子外时，
 * 进入丢失状态，已开启的开关变为OFF。
 * （可通过设置调整状态转换的时间）
 *
 * ※ 当触发器[自动执行]的事件运行中时，考虑到游戏运行负荷，
 *    探索处理会停止。
 *    （可在事件备注栏中更改设置）
 *
 *
 * 简单使用说明:
 *   设置想要作为探索者的事件的备注栏，
 *   在有探索者的地图上执行插件命令 PSS start 时，
 *   该地图上的所有探索者开始探索。
 *   （探索临时无效状态的探索者除外）
 *
 *   在有探索者的地图上执行插件命令 PSS force_start 时，
 *   该地图上的所有探索者开始探索。
 *   （探索临时无效状态的探索者也会开始探索）

 *   在探索者的事件内执行插件命令 PSS t_start 时，
 *   该探索者开始探索。
 *   （对处于探索临时无效状态的探索者也会开始探索。）
 *
 *   在探索者的事件内执行插件命令 PSS t_stop 时，
 *   该探索者停止探索。
 *   （状态更新为玩家未发现。）
 *
 *   在有探索者的地图上执行插件命令 PSS stop 时，
 *   该地图上的所有探索者停止探索。
 *   （状态更新为玩家未发现。）
 *
 *
 * 备注栏_基本设置(X为正整数):
 *   <PsensorL:X>
 *     ・探索者前方X格的范围。
 *
 *   <PsensorF:X>
 *     ・以探索者为顶点，向前方X格、
 *       左右各X格的点连接形成的
 *       三角形图形范围内进行探索。
 *
 *   <PsensorD:X>
 *     ・探索者上下左右各X格的点连接形成的
 *       菱形图形范围内进行探索。
 *
 *     ・此形状的情况下，忽略地形的通行可能状态。
 *       （始终处于Td选项为1的状态。）
 *
 *   <PsensorS:X>
 *     ・探索者上下各X格、
 *       左右各X格的点连接形成的
 *       四角形图形范围内进行探索。
 *
 *     ・此形状的情况下，忽略地形的通行可能状态。
 *       （始终处于Td选项为1的状态）
 *
 *   <PsensorL:\V[n]>
 *     ・指定视野范围格数的部分，
 *       可以使用表示变量的控制字符 \V[n]。
 *       使用变量编号N的变量中存储的值
 *       作为范围值。
 *       （变量的更改会实时反映）
 *
 *   <!PsensorL:X>
 *     ・探索者前方X格为范围，但
 *       在开头添加!时会变为探索临时无效状态。
 *
 *     ・此状态下，在后述插件命令:PSS start执行时
 *       不会开始探索，
 *         需要通过插件命令:PSS t_start 或
 *         脚本命令:$gameSystem.onSensor(eventId)
 *       单独开始探索。
 *
 *
 * 备注栏_选项(各选项用空格分隔):
 *     ・各选项用空格分隔。
 *     ・不指定时将应用初始值设置。
 *
 *   Sw[数字或A～D]
 *     ・探索者发现玩家时
 *       要开启的开关编号或自开关
 *       为每个探索者指定。
 *
 *     ・玩家丢失时开启的开关，
 *       在发现玩家时会自动关闭。
 *
 *     例)
 *       Sw10 : 将开关编号10的开关设为ON。
 *       SwC  : 将探索者的自开关C设为ON。
 *
 *   Bo[0～1的数字，或\S[n]]
 *     ・探索者两侧不作为探索范围(0)/作为探索范围(1)。
 *       为1时，探索者的左右格成为探索范围。
 *
 *     ・\S[n]是获取开关状态的控制字符。
 *       N可输入数值或A～D的字母。(A～D是自开关)
 *       开关N的状态为ON = 与指定1相同。
 *
 *   Rv[0～1的数字，或\S[n]]
 *     ・不绘制(0)/绘制(1)探索者的视野范围。
 *       为0时，探索者的视野范围不会在画面上绘制。
 *       (只是视觉上看不见，探索仍会进行)
 *
 *     ・\S[n]是获取开关状态的控制字符。
 *       N可输入数值或A～D的字母。(A～D是自开关)
 *       开关N的状态为ON = 与指定1相同。
 *
 *   Td[0或1，或\S[n]]
 *     ・视野范围的计算不考虑(0)/考虑(1)视野范围内的地形/事件
 *       通行可能状态。
 *       为1时，视野范围内有不可通行格时视野范围会发生变化。
 *
 *     ・考虑地形通行可能状态时，
 *       不可通行格不成为视野范围的对象，
 *       从探索者看因不可通行格而形成的
 *       死角格也不成为视觉范围的对象。
 *
 *     ・\S[n]是获取开关状态的控制字符。
 *       N可输入数值或A～D的字母。(A～D是自开关)
 *       开关N的状态为ON = 与指定1相同。
 *
 *   Di[U,R,L,D中的1个字符]
 *     ・不考虑探索者的朝向，固定探索方向。
 *       U表示上，R表示右，L表示左，D表示下。
 *
 *   Ev[0或1，或\S[n]]
 *     ・探索者的视野范围受到(1)/不受到(0)地图上不可通行事件
 *       (优先度为"与普通角色相同")的
 *       影响。
 *       为1时，视野范围内有不可通行的地图事件时
 *       视野范围会发生变化。
 *
 *     ・将[图块集 B]以后的图块指定为事件的图像且
 *       事件的优先度为"普通角色下方"时，
 *       图块集的通行可能设置会影响视野范围，
 *       图块集设置为不可通行时，会变为视野范围外。
 *
 *     ・设为不考虑视野范围内的通行可能状态时，
 *       此设置会被忽略。
 *
 *   Rg[区域编号，或\V[n]]
 *     ・指定时探索者的视野范围会受到地图上区域图块的
 *       影响。
 *       例如指定1时，放置区域编号1的图块的格子
 *       被视为墙壁，变为视野范围外。
 *
 *     ・设为不考虑视野范围内的通行可能状态时，
 *       此设置会被忽略。
 *
 *   Fb[气泡编号，或\V[n]]
 *     ・指定时，探索者发现玩家时
 *       在探索者头上显示气泡。
 *
 *   Fc[公共事件编号，或\V[n]]
 *     ・指定时，探索者发现玩家时
 *       执行指定的公共事件。
 *
 *   Fd[延迟帧数，或\V[n]]
 *     ・指定时，探索者发现玩家的时间
 *       延迟指定的帧数。
 *
 *   Lb[气泡编号，或\V[n]]
 *     ・指定时，探索者丢失玩家时
 *       在探索者头上显示气泡。
 *
 *   Lc[公共事件编号，或\V[n]]
 *     ・指定时，探索者丢失玩家时
 *       执行指定的公共事件。
 *
 *   Ld[延迟帧数，或\V[n]]
 *     ・指定时，探索者丢失玩家的时间
 *       延迟指定的帧数。
 *
 *   Li
 *     ・指定时，即使玩家移出探索者的视野外
 *       探索者也不会转换为玩家丢失状态。
 *
 *     ・适用于一旦被发现就在同一地图内
 *       持续追踪玩家的事件等。
 *
 *     ・可以使用脚本等方式转换为玩家丢失状态。
 *
 *   Am[0或1，或\S[n]]
 *     ・自动执行事件运行中，设置了此选项的探索者的
 *       探索处理继续(1)/不继续(0)
 *       默认为0。
 *
 *     ・继续探索时，即使自动执行事件运行中
 *       也会进行视野范围内是否有玩家的判定。
 *       (仅限目标探索者处于探索开始状态时)
 *
 *     ・此选项设为1的探索者，在探索开始状态期间
 *       会持续探索，因此游戏运行负荷会增加。
 *       请谨慎设置。
 *
 *   Lsw[数字或A～D]
 *     ・探索者丢失玩家时
 *       要开启的开关编号或自开关
 *       为每个探索者指定。
 *
 *     ・发现玩家时开启的开关，
 *       在丢失玩家时会自动关闭。
 *
 *     例)
 *       Lsw11 : 将开关编号11的开关设为ON。
 *       LswB  : 将探索者的自开关B设为ON。
 *
 *
 * 备注栏的设置示例:
 *   <PsensorL:7>
 *     ・探索者前方7格的范围。
 *
 *   <PsensorF:3>
 *     ・以探索者为顶点，前方3格左右3格的点
 *       连接形成的三角形图形范围内进行探索。
 *
 *   <PsensorL:\V[100]>
 *     ・探索者前方[变量编号100]格的范围。
 *
 *   <PsensorL:4 SwC>
 *     ・探索者前方4格的范围。
 *       发现玩家时将探索者的自开关C设为ON。
 *
 *   <PsensorF:5 Bo1>
 *     ・以探索者为顶点，前方3格左右3格的点
 *       连接形成的三角形图形范围内进行探索。
 *
 *     ・此外将探索者的两侧作为探索范围。
 *
 *   <PsensorL:10 Rv0>
 *     ・探索者前方10格的范围，但
 *       不绘制视野范围。
 *
 *   <PsensorL:10 Rv\s[20]>
 *     ・探索者前方10格的范围。
 *
 *     ・开关20号状态为OFF时
 *       不绘制视野范围。
 *
 *   <PsensorL:10 Td0>
 *     ・探索者前方10格的范围，但
 *       不考虑视野范围内的通行可能格状态。
 *
 *   <PsensorL:10 Td\s[A]>
 *     ・探索者前方10格的范围。
 *
 *     ・自开关A状态为OFF时
 *       不考虑视野范围内的通行可能格状态。
 *
 *   <PsensorF:&2 Bo0 Sw1>
 *     ・以探索者为顶点，前方[变量编号2]格
 *       左右[变量编号2]格的点连接形成的
 *       三角形图形范围内进行探索，但
 *       不将探索者的两侧作为范围。
 *
 *     ・发现玩家时将开关编号1的开关设为ON。
 *
 *   <PsensorL:7 DiR>
 *     ・探索者右侧7格的范围。
 *
 *   <PsensorF:7 DiU>
 *     ・以探索者为顶点，上方3格左右3格的点
 *       连接形成的三角形图形范围内进行探索。
 *
 *   <PsensorL:10 Ev1 Rg10>
 *     ・探索者前方10格的范围，但
 *       考虑视野范围内地图事件的存在。
 *       此外将区域编号10的图块识别为墙壁。
 *
 *
 * 插件命令:
 *   PSS start
 *     ・执行命令的地图上存在的所有探索者
 *       进入探索开始处理。
 *       (探索临时无效状态的探索者除外)
 *
 *   PSS force_start
 *     ・执行命令的地图上存在的所有探索者
 *       进入探索开始处理。
 *       (探索临时无效状态的探索者也成为对象)
 *
 *   PSS stop
 *     ・执行命令的地图上存在的所有探索者
 *       进入探索停止处理状态。
 *       (状态更新为玩家未发现。)
 *
 *   PSS reset X Y ...
 *     ・对执行命令的地图上存在的所有探索者，
 *       将插件参数[发现后操作开关]
 *       指定的(自)开关，
 *       或Sw选项指定的(自)开关
 *       其中之一设为OFF。(Sw选项的设置优先)
 *
 *     ・此外，reset后指定的(自)开关也
 *       同样设为OFF。要一起设为OFF时请指定。
 *       (X,Y 为自开关/开关编号。
 *        请用空格分隔记载)
 *
 *   PSS lost
 *     ・将执行命令的地图上存在的玩家发现状态的探索者
 *       强制转移到丢失状态。
 *
 *   PSS found
 *     ・将执行命令的地图上存在的玩家未发现状态的探索者
 *       强制转移到发现状态。
 *
 *   PSS t_start
 *     ・将执行此命令的探索者
 *       设为探索开始状态。
 *
 *     ・为了实际进行探索，需要事先执行PSS start命令。
 *
 *   PSS t_stop
 *     ・将执行此命令的探索者设为探索停止状态。
 *       (状态更新为玩家未发现。)
 *
 *   PSS t_reset X Y ...
 *     ・对执行此命令的探索者，
 *       将插件参数[发现后操作开关]
 *       指定的(自)开关，
 *       或备注栏Sw选项指定的(自)开关
 *       其中之一设为OFF。(备注栏的设置优先)
 *
 *     ・"X", "Y" 表示(自)开关，此处记载的(自)开关
 *       也同样设为OFF。要一起设为OFF时请指定。
 *       (自开关/开关编号请用空格分隔记载)
 *
 *   PSS t_lost
 *     ・将执行此命令的玩家发现状态的探索者
 *       强制转移到丢失状态。
 *
 *   PSS t_find
 *     ・将执行此命令的玩家未发现状态的探索者
 *       强制转移到发现状态。
 *
 *   PSS t_move X
 *     ・将执行此命令的事件移动到
 *       执行此命令时玩家位置的相邻位置。
 *
 *     ・X为移动速度。对应1～6，
 *       未指定时使用事件设置的速度。
 *
 *     ・插件参数[不可通行图块考虑]为OFF或
 *       备注栏Td选项为0时
 *       可能无法正确移动。
 *       (可通过启用事件的穿透来移动)
 *
 *
 * 脚本命令:
 *   $gameSystem.getEventSensorStatus(eventId)
 *     ・获取指定事件ID的探索者的探索状态。
 *       [返回值] | [含义]
 *          -1    | 探索临时无效状态
 *           0    | 探索停止状态
 *           1    | 探索执行状态
 *
 *   $gameSystem.onSensor(eventId)
 *     ・将指定事件ID的探索者设为探索开始状态。
 *       用于让探索停止/临时无效状态的探索者重新开始探索。
 *
 *     ・为了开始探索，需要事先执行PSS start(PSS force_start)命令。
 *
 *   $gameSystem.offSensor(eventId)
 *     ・将指定事件ID的探索者设为探索停止状态。
 *       (状态更新为玩家未发现。)
 *
 *   $gameSystem.neutralSensor(eventId, ["X","Y",...])
 *     ・对当前地图存在的、指定事件ID的探索者，
 *       将[发现后操作开关]指定的(自)开关或
 *       Sw选项指定的自开关
 *       其中之一设为OFF。(备注栏的设置优先)
 *
 *     ・"X", "Y" 表示(自)开关，此处记载的(自)开关
 *       也同样设为OFF。要一起设为OFF时请指定。
 *       (请用逗号分隔指定)
 *
 *   $gameSystem.isFoundPlayer()
 *     ・当前地图中，玩家被探索者发现时返回true。
 *       (其他情况返回false)
 *
 *   $gameSystem.allForceLost()
 *     ・将当前地图存在的玩家发现状态的探索者
 *       强制转移到丢失状态。
 *
 *   $gameSystem.forceLost(eventId)
 *     ・指定事件ID的探索者处于玩家发现状态时，
 *       强制转移到丢失状态。
 *
 *   $gameSystem.allForceFound()
 *     ・将当前地图存在的玩家未发现状态的探索者
 *       强制转移到发现状态。
 *
 *   $gameSystem.forceFound(eventId)
 *     ・指定事件ID的探索者处于玩家未发现状态时，
 *       强制转移到发现状态。
 *
 *
 * 补充说明：
 *   ・关于此插件的备注栏设置、插件命令
 *     不区分大小写。
 *
 *   ・插件参数说明中标有[初始值]的
 *     可在备注栏进行个别设置。
 *     设置时，备注栏的设置优先于[初始值]，
 *     请注意。
 *
 *   ・插件参数说明中标有[变量可]的
 *     设置值可使用表示变量的控制字符\V[n]。
 *     设置变量时，该参数使用时会
 *     参照变量的值，因此可在游戏中更改参数设置。
 *
 *   ・插件参数说明中标有[开关可]的
 *     设置值可使用表示开关的控制字符\S[n]。(N为数值)
 *     指定的开关为ON时与在插件参数中
 *     指定ON或1,true相同。
 *     设置开关时，该参数使用时会
 *     参照开关的值，因此可在游戏中更改参数设置。
 *
 *
 * 使用条款:
 *   ・可在不通知作者的情况下修改、再发布本插件。
 *     (但请保留头部的版权显示部分。)
 *
 *   ・使用形态(免费游戏、商用游戏、R-18作品等)无限制。
 *     请自由使用。
 *
 *   ・因使用本插件而产生的问题，作者不承担任何责任。
 *
 *   ・有要求等情况时，可能会对本插件进行版本升级，
 *     但版本升级可能会改变本插件的规格。
 *     请谅解。
 *
 * @param 探索設定
 * @default ====================================
 *
 * @param Sensor_Switch
 * @text 发现后操作开关
 * @desc [初始值] 指定玩家发现时开启的开关编号或自开关。(丢失后操作开关会关闭)
 * @type combo
 * @option A
 * @option B
 * @option C
 * @option D
 * @default D
 * @parent 探索設定
 *
 * @param Lost_Sensor_Switch
 * @text 丢失后操作开关
 * @desc [初始值] 指定玩家丢失时开启的开关编号或自开关。(发现后操作开关会关闭)
 * @type combo
 * @option A
 * @option B
 * @option C
 * @option D
 * @default
 * @parent 探索設定
 *
 * @param Both_Sensor
 * @text 两侧视野
 * @desc [初始值:开关可] 将探索者两侧作为探索范围时指定ON，不作为时指定OFF。
 * @type combo
 * @option ON
 * @option OFF
 * @default OFF
 * @parent 探索設定
 *
 * @param Terrain_Decision
 * @text 不可通行图块考虑
 * @desc [初始值:开关可] 视野范围考虑不可通行图块存在时指定ON，不考虑时指定OFF。
 * @type combo
 * @option ON
 * @option OFF
 * @default ON
 * @parent 探索設定
 *
 * @param Auto_Sensor
 * @text 探索自动开始
 * @desc 地图绘制时自动开始探索处理的设置。默认:不开始
 * @type boolean
 * @on 开始
 * @off 不开始
 * @default false
 * @parent 探索設定
 *
 * @param Event_Decision
 * @text 其他事件考虑
 * @desc [初始值:开关可] 视野范围考虑地图事件存在时指定ON，不考虑时指定OFF。
 * @type combo
 * @option ON
 * @option OFF
 * @default OFF
 * @parent 探索設定
 *
 * @param Region_Decision
 * @text 区域设置
 * @desc [初始值:变量可] 指定作为视野范围外(墙壁)的区域编号。
 * @type string[]
 * @default []
 * @parent 探索設定
 *
 * @param Real_Range_X
 * @text 探索范围X扩展
 * @desc 将探索范围向横向扩展指定数值(视野绘制以格为单位)。玩家以像素单位移动时有效。(默认:0)
 * @type number
 * @decimals 3
 * @max 0.999
 * @min 0.000
 * @default 0.000
 * @parent 探索設定
 *
 * @param Real_Range_Y
 * @text 探索范围Y扩展
 * @desc 将探索范围向纵向扩展指定数值(视野绘制以格为单位)。玩家以像素单位移动时有效。(默认:0)
 * @type number
 * @decimals 3
 * @max 0.999
 * @min 0.000
 * @default 0.000
 * @parent 探索設定
 *
 * @param 視界設定
 * @default ====================================
 *
 * @param Range_Visible
 * @text 视野范围绘制
 * @desc [初始值:开关可] 绘制探索者视野范围时指定ON，不绘制时指定OFF。
 * @type combo
 * @option ON
 * @option OFF
 * @default ON
 * @parent 視界設定
 *
 * @param Range_Color
 * @text 视野范围颜色
 * @desc 选择绘制视野范围时的颜色。默认:白色
 * @type select
 * @option 白色
 * @value white
 * @option 红色
 * @value red
 * @option 蓝色
 * @value blue
 * @option 黄色
 * @value yellow
 * @default white
 * @parent 視界設定
 *
 * @param Range_Opacity
 * @text 视野范围不透明度
 * @desc 用数字指定绘制视野范围时的不透明度。默认:80(0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 80
 * @parent 視界設定
 *
 * @param Range_Position
 * @text 视野范围位置
 * @desc 选择显示探索者视野范围的位置。默认:1(在事件上方显示)
 * @type select
 * @option 在事件上方显示
 * @value 1
 * @option 在事件下方显示
 * @value 2
 * @default 1
 * @parent 視界設定
 *
 * @param Player_Found
 * @text 玩家发现设置
 * @desc 探索者发现玩家相关的设置。
 * @type struct<AlertFound>
 * @default {"Ballon":"0","Se":"{\"Name\":\"\",\"Volume\":\"90\",\"Pitch\":\"100\",\"Pan\":\"0\"}","Common_Event":"0","Delay":"0"}
 *
 * @param Player_Lost
 * @text 玩家丢失设置
 * @desc 探索者丢失玩家相关的设置。
 * @type struct<AlertLost>
 * @default {"Ballon":"0","Se":"{\"Name\":\"\",\"Volume\":\"90\",\"Pitch\":\"100\",\"Pan\":\"0\"}","Common_Event":"0","Delay":"0","Invalid":"false"}
 *
 * @param マップ設定
 * @default ====================================
 *
 * @param Tracking_Priority
 * @text 追踪优先度
 * @desc 设置玩家发现状态的事件是否可通行其他事件的上方或下方。(默认:不可通行)
 * @type boolean
 * @on 可通行
 * @off 不可通行
 * @default false
 * @parent マップ設定
 *
 * @param Follower_Through
 * @text 跟随者无视
 * @desc 设置玩家发现状态的事件是否穿透玩家的跟随者(队列)。(默认:不可穿透)
 * @type boolean
 * @on 可穿透
 * @off 不可穿透
 * @default false
 * @parent マップ設定
 *
 * @param Location_Reset
 * @text 地图移动时重置
 * @desc 使用场所移动命令时，是否重置原地图配置的探索者追踪状态。(默认:不重置)
 * @type boolean
 * @on 重置
 * @off 不重置
 * @default false
 * @parent マップ設定
 *
*/
/*~struct~AlertFound:
 *
 * @param Ballon
 * @text [初始值] 气泡显示
 * @desc 在探索者上显示气泡时指定图标编号。默认:不显示
 * @type select
 * @option 不显示
 * @value 0
 * @option 惊讶
 * @value 1
 * @option 疑问
 * @value 2
 * @option 音符
 * @value 3
 * @option 心形
 * @value 4
 * @option 愤怒
 * @value 5
 * @option 汗水
 * @value 6
 * @option 烦恼
 * @value 7
 * @option 沉默
 * @value 8
 * @option 灯泡
 * @value 9
 * @option Zzz
 * @value 10
 * @option 用户定义1
 * @value 11
 * @option 用户定义2
 * @value 12
 * @option 用户定义3
 * @value 13
 * @option 用户定义4
 * @value 14
 * @option 用户定义5
 * @value 15
 * @default 0
 *
 * @param Se
 * @text SE设置
 * @desc SE相关的设置。
 * @type struct<Se>
 *
 * @param Common_Event
 * @text [初始值] 公共事件执行
 * @desc 要执行公共事件时请指定。默认:0(无)
 * @type common_event
 * @default 0
 *
 * @param Delay
 * @text [初始值] 状态转移延迟
 * @desc 将转移到玩家发现状态的时机
 * 延迟指定的帧数(60帧=1秒)。默认:0
 * @type number
 * @min 0
 * @default 0
 *
 */
/*~struct~AlertLost:
 *
 * @param Ballon
 * @text [初始值] 气泡显示
 * @desc 在探索者上显示气泡时指定图标编号。默认:不显示
 * @type select
 * @option 不显示
 * @value 0
 * @option 惊讶
 * @value 1
 * @option 疑问
 * @value 2
 * @option 音符
 * @value 3
 * @option 心形
 * @value 4
 * @option 愤怒
 * @value 5
 * @option 汗水
 * @value 6
 * @option 烦恼
 * @value 7
 * @option 沉默
 * @value 8
 * @option 灯泡
 * @value 9
 * @option Zzz
 * @value 10
 * @option 用户定义1
 * @value 11
 * @option 用户定义2
 * @value 12
 * @option 用户定义3
 * @value 13
 * @option 用户定义4
 * @value 14
 * @option 用户定义5
 * @value 15
 * @default 0
 *
 * @param Se
 * @text SE设置
 * @desc SE相关的设置。
 * @type struct<Se>
 *
 * @param Common_Event
 * @text [初始值] 公共事件执行
 * @desc 要执行公共事件时请指定。默认:0(无)
 * @type common_event
 * @default 0
 *
 * @param Delay
 * @text [初始值] 状态转移延迟
 * @desc 将转移到玩家丢失状态的时机
 * 延迟指定的帧数(60帧=1秒)。默认:0
 * @type number
 * @min 0
 * @default 0
 *
 * @param Invalid
 * @text [初始值] 状态转移无效功能
 * @desc 玩家丢失时不转移状态
 * (可通过脚本等手动转移)。默认:无效
 * @type boolean
 * @on 有效
 * @off 无效
 * @default false
 *
 */
/*~struct~Se:
 *
 * @param Name
 * @text ファイル名
 * @desc 再生するファイルを指定します。デフォルト:空(再生しない)
 * @type file
 * @require 1
 * @dir audio/se
 *
 * @param Volume
 * @text 再生時音量
 * @desc ファイルを再生するときの音量を指定します(0から100までの数値)。デフォルト:90
 * @type number
 * @max 100
 * @min 0
 * @default 90
 *
 * @param Pitch
 * @text 再生時ピッチ
 * @desc ファイルを再生するときのピッチを指定します(50から150までの数値)。デフォルト:100
 * @type number
 * @max 150
 * @min 50
 * @default 100
 *
 * @param Pan
 * @text 再生時位相
 * @desc ファイルを再生するときの位相を指定します(-100から100までの数値)。デフォルト:0
 * @type number
 * @max 100
 * @min -100
 * @default 0
 *
 */
