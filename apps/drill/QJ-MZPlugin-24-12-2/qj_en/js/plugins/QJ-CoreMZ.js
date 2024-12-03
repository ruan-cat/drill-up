//=============================================================================
// RPG Maker MZ - QJ-CoreMZ.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [Core Of QJPlugin MZ][仇九的核心MZ插件][V2.3.1]
 * @author Qiu Jiu
 *
 * @help QJ-CoreMZ.js
* ======================================================
 * This plugin container the follow function.
 * [这个插件主要有如下功能]
 * Ⅰ.Simple js script.[便捷指令]
 * Ⅱ.Add Input.[增加按键]
 * Ⅲ.Dramatic effect core.[动态效果核心]
 * Ⅳ.SAT.[SAT算法核心]
 * Ⅴ.Filter.[滤镜核心]
 * ⅥⅦⅧⅨⅩⅪⅫ
* ======================================================
 * Ⅰ.Simple js script.[便捷指令]
 *
 * This plugin offer the easy-to-use js command below:
 * [这个插件提供了如下便捷脚本指令：]
 * The params in code [] are the Optional parameters.
 * [下方被包在符号[]中的参数是可选参数.]
 *
 * 1.open/close the self switch.[打开或者关闭独立开关]
 *
 *   QJ.ss(eventId,selfSwitchName,value[,mapId]);
 *
 *   eventId: 0 refer to the current eventId.
 *   selfSwitchName: 'A','B','C' or 'D'.
 *   value: true/1 or false/0.
 *   mapId: the map id.Don`t write or write 0 represents the current map.
 *          [地图编号。不写或者写0时代表当前地图。]
* ======================================================
 * Ⅱ.Add Input.[增加按键]
 *
 *  Press    [判断是否按着某个按键]: Input.isPressed(keyName)
 *  Trigger  [判断是否按下某个按键]: Input.isTriggered(keyName)
 *  Repeat   [判断是否重复按某按键]: Input.isRepeated(keyName)
 *  LongPress[判断是否长按某个按键]: Input.isLongPressed(keyName) 
 *
 *  Note:
 *  1.The js don`t differentiate the left and right shift/ctrl/alt.
 *    [js不区分左右shift/ctrl/alt按键]
 *  2.prefer not to use print screen and Num Lock.
 *    [最好不要区分截图键(print screen)和数字锁定键(Num Lock)] 
 * --------------------------------------------------------
 * key code | key name | note
 * [键值]    |  [键码]  | [备注]
 * --------------------------------------------------------
 *    8   ->  backspace
 *    9   ->  tab
 *    12  ->  clear 
 *    13  ->  enter
 *    16  ->  shift
 *    17  ->  control
 *    18  ->  alt
 *    19  ->  pause
 *    20  ->  caps lock
 *    27  ->  esc
 *    32  ->  space
 *    33  ->  pageup
 *    34  ->  pagedown
 *    35  ->  end
 *    36  ->  home
 *    37  ->  left
 *    38  ->  up            
 *    39  ->  right
 *    40  ->  down
 *    44  ->  print screen  ->  invalid[无效]
 *    45  ->  insert
 *    46  ->  del
 *    48  ->  num 0
 *    49  ->  num 1
 *    50  ->  num 2
 *    51  ->  num 3
 *    52  ->  num 4
 *    53  ->  num 5
 *    54  ->  num 6
 *    55  ->  num 7
 *    56  ->  num 8
 *    57  ->  num 9
 *    65  ->  A
 *    66  ->  B
 *    67  ->  C
 *    68  ->  D
 *    69  ->  E
 *    70  ->  F
 *    71  ->  G
 *    72  ->  H
 *    73  ->  I
 *    74  ->  J
 *    75  ->  K
 *    76  ->  L
 *    77  ->  M
 *    78  ->  N
 *    79  ->  O
 *    80  ->  P
 *    81  ->  Q  ->  page up
 *    82  ->  R
 *    83  ->  S
 *    84  ->  T
 *    85  ->  U
 *    86  ->  V
 *    87  ->  W  ->  page down
 *    88  ->  X  ->  escape
 *    89  ->  Y
 *    90  ->  Z
 *    91  ->  L Win  ->  prefer not to use[最好不要用]
 *    92  ->  R Win  ->  prefer not to use[最好不要用]
 *    93  ->  select
 *    96  ->  numpad 0
 *    97  ->  numpad 1
 *    98  ->  numpad 2
 *    99  ->  numpad 3
 *    100 ->  numpad 4
 *    101 ->  numpad 5
 *    102 ->  numpad 6
 *    103 ->  numpad 7
 *    104 ->  numpad 8
 *    105 ->  numpad 9
 *    106 ->  numpad *
 *    107 ->  numpad +
 *    109 ->  numpad -
 *    110 ->  numpad .
 *    111 ->  numpad /
 *    112 ->  F1
 *    113 ->  F2  ->  used to open FPS window[被用来打开帧率显示]
 *    114 ->  F3  ->  prefer not to use[最好不要用]
 *    115 ->  F4  ->  prefer not to use[最好不要用]
 *    116 ->  F5  ->  prefer not to use[最好不要用]
 *    117 ->  F6
 *    118 ->  F7
 *    119 ->  F8
 *    120 ->  F9
 *    121 ->  F10
 *    122 ->  F11
 *    123 ->  F12  ->  prefer not to use[最好不要用]
 *    144 ->  num lock  ->  prefer not to use[最好不要用]
 *    145 ->  scroll lock  ->  prefer not to use[最好不要用]
 *    186 ->  ;
 *    187 ->  =
 *    188 ->  ,
 *    189 ->  -
 *    190 ->  .
 *    191 ->  /
 *    192 ->  `
 *    219 ->  [
 *    220 ->  \
 *    221 ->  ]
 *    222 ->  '
 * --------------------------------------------------------
* ======================================================
 * Ⅲ.Dramatic effect core.[动态效果核心]
 *   The function of making dramatic effect can be used in my other plugin.
 *   [这个插件包含一个制作动态效果的核心功能，这个功能被其他插件普遍使用]
* ======================================================
 * Ⅳ.SAT.[SAT算法核心]
 *   The SAT used in my other plugin.
 *   [我的其他插件需要的SAT算法]
* ======================================================
 * Ⅵ.Filter.[滤镜核心]
 *   The filter effect used in my other plugin.
 *   In order to be compatible with other plugins, I choose the PIXI Filter in the 
 *   version '3.1.0' which is the same as the plugin 'FilterControllerMZ.js' by Tsukimi.
 *   [我的其他插件需要的滤镜库]
 *   [为了保证不与其他插件冲突，我使用了与Tsukimi写的'FilterControllerMZ.js'一样版本的PIXI的滤镜库]
 *
* ======================================================
* ======================================================
 *
 * @param tileSize
 * @type number
 * @text 图块大小
 * @desc 图块大小。必须在这里设置，不然游戏无法初始化。
 * @default 48
 *
*/
//=============================================================================
//Traditional Habit from......Yep?May be.
//=============================================================================
var QJ = QJ || {};
var Imported = Imported || {};
Imported.QJCore = true;
//======================
QJ.reWrite = {};//The main reWrite function.
QJ.Pointer = null;//The pointer.
QJ.PI180 = Math.PI/180;
//======================
//=============================================================================
//
//=============================================================================
QJ.getPointer = function() {
    if (!!QJ.Pointer) {
        if (typeof QJ.Pointer == "number") {
            if (QJ.Pointer>0) {
                return QJ.getCharacter(QJ.Pointer);
            } else if (QJ.Pointer==-1) {
                return $gamePlayer;
            } else {
                return null;
            }
        } else if (QJ.Pointer.eventId) {
            return $gameMap.event(QJ.Pointer.eventId());
        }
    }
    return null;
};
QJ.getPointerId = function() {
    if (!!QJ.Pointer) {
        if (typeof QJ.Pointer == "number"&&QJ.Pointer>0) {
            let eData = $gameMap.event(QJ.Pointer);
            return eData?eData.eventId():0;
        } else if (QJ.Pointer.eventId()>0) {
            let eData = $gameMap.event(QJ.Pointer.eventId());
            return eData?eData.eventId():0;
        }
    }
    return 0;
};
QJ.getCharacter = function(value) {
    return value==0?QJ.getPointer():(value==-1?$gamePlayer:(value>0?$gameMap.event(value):null));
};
QJ.buildCharacter = function(target) {
    return target?(target==$gamePlayer?-1:target.eventId()):0;
};
QJ.createTexture = function(bit,name,container) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    let w=bit.width,h=bit.height;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.globalCompositeOperation = 'source-over';
    lscontext.drawImage(bit._canvas?bit._canvas:bit._image,0,0);//,w,h,0,0,w,h
    lsBaseTexture.update();
    if (name&&container) container[name] = lsBaseTexture;
    return lsBaseTexture;
};
QJ.gainItemEx = function(type,itemId,number) {
    //====================================
    let itemData;
    if (type==0||type=="item") itemData = $dataItems[itemId];
    else if (type==1||type=="weapon") itemData = $dataWeapons[itemId];
    else if (type==2||type=="armor") itemData = $dataArmors[itemId];
    else if (type==3||type=="gold") itemData = null;
    else return;
    //====================================
    if (type==3||type=="gold") $gameParty.gainGold(number);
    else $gameParty.gainItem(itemData,number,false);
    //====================================
}
QJ.gainItem = function(value1,value2,value3) {
    for(var i=value1;i<=value2;i++){
        $gameParty.gainItem($dataItems[i],value3);
  }
};
QJ.gainWeapon = function(value1,value2,value3) {
    for(var i=value1;i<=value2;i++){
        $gameParty.gainItem($dataWeapons[i],value3,true);
  }
};
QJ.gainArmor = function(value1,value2,value3) {
    for(var i=value1;i<=value2;i++){
        $gameParty.gainItem($dataArmors[i],value3,true);
  }
};
QJ.ss = function(eventId,name,value,mapId) {
    $gameSelfSwitches.setValue([mapId||$gameMap.mapId(),eventId,name.toUpperCase()],value);
};
QJ.ssv = function(eid,name,mapId) {
    return $gameSelfSwitches.value([mapId?mapId:$gameMap.mapId(),eid==0?QJPointer:eid,name]);
};
QJ.se = function(name,pan = 0,pitch = 100,volume = 100) {
    AudioManager.playSe({name:name,pan:pan,pitch:pitch,volume:volume});
};
QJ.calculateDirectionValueGet = function(value,direction) {
    value = String(value);
    if (value.includes('~')) {
        let detail = value.split('~');
        if (detail.length==4) {
            return [0,0,Number(detail[0]),0,Number(detail[1]),0,Number(detail[2]),0,Number(detail[3]),0][direction];
        } else if (detail.length==8) {
            return [0,Number(detail[0]),Number(detail[1]),Number(detail[2]),Number(detail[3]),
                0,Number(detail[4]),Number(detail[5]),Number(detail[6]),Number(detail[7])][direction];
        }
    }
    return Number(value);
};
QJ.buildDirectionValue = function(value) {
    value = String(value);
    if (value.includes('~')) {
        let detail = value.split('~');

        if (detail.length==4) {
            return [0,0,Number(detail[0]),0,Number(detail[1]),0,Number(detail[2]),0,Number(detail[3]),0];
        } else if (detail.length==8) {
            return [0,Number(detail[0]),Number(detail[1]),Number(detail[2]),Number(detail[3]),
                0,Number(detail[4]),Number(detail[5]),Number(detail[6]),Number(detail[7])];
        }
    }
    value = Number(value);
    return [0,value,value,value,value,0,value,value,value,value];
};
QJ.gainItemData = function(type,id) {
    if (type=='skill') {
        return $dataSkills[id];
    } else if (type=='item') {
        return $dataItems[id];
    } else if (type=='weapon') {
        return $dataWeapons[id];
    } else if (type=='armor') {
        return $dataArmors[id];
    } else {
        return null;
    }
};
//=============================================================================
//
//=============================================================================
/*!
 * SAT.js - v0.9.0
 * License MIT
 * url https://github.com/jriecken/sat-js
 * build by QiuJiu
*/
if (true) {
    //=================================================
    function SATVector(x, y) {
        this['x'] = x || 0;
        this['y'] = y || 0;
    }
    SATVector.prototype.copy = function (other) {
        this['x'] = other['x'];
        this['y'] = other['y'];
        return this;
    };
    SATVector.prototype.clone = function () {
        return new SATVector(this['x'], this['y']);
    };
    SATVector.prototype.perp = function () {
        var x = this['x'];
        this['x'] = this['y'];
        this['y'] = -x;
        return this;
    };
    SATVector.prototype.rotate = function (angle) {
        var x = this['x'];
        var y = this['y'];
        this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
        this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
        return this;
    };
    SATVector.prototype.reverse = function () {
        this['x'] = -this['x'];
        this['y'] = -this['y'];
        return this;
    };
    SATVector.prototype.normalize = function () {
        var d = this.len();
        if (d > 0) {
            this['x'] = this['x'] / d;
            this['y'] = this['y'] / d;
        }
        return this;
    };
    SATVector.prototype.add = function (other) {
        this['x'] += other['x'];
        this['y'] += other['y'];
        return this;
    };
    SATVector.prototype.sub = function (other) {
        this['x'] -= other['x'];
        this['y'] -= other['y'];
        return this;
    };
    SATVector.prototype.scale = function (x, y) {
        this['x'] *= x;
        this['y'] *= typeof y != 'undefined' ? y : x;
        return this;
    };
    SATVector.prototype.project = function (other) {
        var amt = this.dot(other) / other.len2();
        this['x'] = amt * other['x'];
        this['y'] = amt * other['y'];
        return this;
    };
    SATVector.prototype.projectN = function (other) {
        var amt = this.dot(other);
        this['x'] = amt * other['x'];
        this['y'] = amt * other['y'];
        return this;
    };
    SATVector.prototype.reflect = function (axis) {
        var x = this['x'];
        var y = this['y'];
        this.project(axis).scale(2);
        this['x'] -= x;
        this['y'] -= y;
        return this;
    };
    SATVector.prototype.reflectN = function (axis) {
        var x = this['x'];
        var y = this['y'];
        this.projectN(axis).scale(2);
        this['x'] -= x;
        this['y'] -= y;
        return this;
    };
    SATVector.prototype.dot = function (other) {
        return this['x'] * other['x'] + this['y'] * other['y'];
    };
    SATVector.prototype.len2 = function () {
        return this.dot(this);
    };
    SATVector.prototype.len = function () {
        return Math.sqrt(this.len2());
    };
    //=================================================
    function SATCircle(pos, r) {
        this['pos'] = pos || new SATVector();
        this['r'] = r || 0;
        this['offset'] = new SATVector();
    }
    SATCircle.prototype.getAABBAsBox = function () {
        var r = this['r'];
        var corner = this['pos'].clone().add(this['offset']).sub(new SATVector(r, r));
        return new SATBox(corner, r * 2, r * 2);
    };
    SATCircle.prototype.getAABB = function () {
        return this.getAABBAsBox().toPolygon();
    };
    SATCircle.prototype.setOffset = function (offset) {
        this['offset'] = offset;
        return this;
    };
    //=================================================
    function SATPolygon(pos, points) {
        this['pos'] = pos || new SATVector();
        this['angle'] = 0;
        this['offset'] = new SATVector();
        this.setPoints(points || []);
    }
    SATPolygon.prototype.setPoints = function (points) {
        var lengthChanged = !this['points'] || this['points'].length !== points.length;
        if (lengthChanged) {
            var i;
            var calcPoints = this['calcPoints'] = []; 
            var edges = this['edges'] = [];
            var normals = this['normals'] = [];
            for (i = 0; i < points.length; i++) {
                var p1 = points[i];
                var p2 = i < points.length - 1 ? points[i + 1] : points[0];
                if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
                    points.splice(i, 1);
                    i -= 1;
                    continue;
                }
                calcPoints.push(new SATVector());
                edges.push(new SATVector());
                normals.push(new SATVector());
            }
        }
        this['points'] = points;
        this._recalc();
        return this;
    };
    SATPolygon.prototype.setAngle = function (angle) {
        this['angle'] = angle;
        this._recalc();
        return this;
    };
    SATPolygon.prototype.setOffset = function (offset) {
        this['offset'] = offset;
        this._recalc();
        return this;
    };
    SATPolygon.prototype.rotate = function (angle) {
        var points = this['points'];
        var len = points.length;
        for (var i = 0; i < len; i++) {    
            points[i].rotate(angle);  
        }  
        this._recalc();  
        return this;
    };
    SATPolygon.prototype.translate = function (x, y) {  
        var points = this['points'];  
        var len = points.length;  
        for (var i = 0; i < len; i++) {    
            points[i]['x'] += x;    
            points[i]['y'] += y;  
        }  
        this._recalc();  
        return this;
    };
    SATPolygon.prototype._recalc = function () {  
        var calcPoints = this['calcPoints'];  
        var edges = this['edges'];  
        var normals = this['normals'];  
        var points = this['points'];  
        var offset = this['offset'];  
        var angle = this['angle'];  
        var len = points.length;  
        var i;  
        for (i = 0; i < len; i++) {    
            var calcPoint = calcPoints[i].copy(points[i]);    
            calcPoint['x'] += offset['x'];    
            calcPoint['y'] += offset['y'];    
            if (angle !== 0) {      
                calcPoint.rotate(angle);    
            }  
        }  
        for (i = 0; i < len; i++) {    
            var p1 = calcPoints[i];    
            var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];    
            var e = edges[i].copy(p2).sub(p1);    
            normals[i].copy(e).perp().normalize();  
        }  
        return this;
    };
    SATPolygon.prototype.centerWithOffsetAndRotation = function () {  
        var calcPoints = this['calcPoints'];
        var centerPoint = [0,0]; 
        for (let i of calcPoints) {
            centerPoint[0]+=i.x;
            centerPoint[1]+=i.y;
        }
        centerPoint[0]/=calcPoints.length;
        centerPoint[1]/=calcPoints.length;
        centerPoint[0]+=this.pos.x;
        centerPoint[1]+=this.pos.y;
        return centerPoint;
    };
    SATPolygon.prototype.getAABBAsBox = function () {  
        var points = this['calcPoints'];  
        var len = points.length;  
        var xMin = points[0]['x'];  
        var yMin = points[0]['y'];  
        var xMax = points[0]['x'];  
        var yMax = points[0]['y'];  
        for (var i = 1; i < len; i++) {    
            var point = points[i];    
            if (point['x'] < xMin) {      
                xMin = point['x'];    
            } else if (point['x'] > xMax) {      
                xMax = point['x'];    
            }    
            if (point['y'] < yMin) {      
                yMin = point['y'];    
            } else if (point['y'] > yMax) {      
                yMax = point['y'];    
            }  
        }
        return new SATBox(this['pos'].clone().add(new SATVector(xMin, yMin)), xMax - xMin, yMax - yMin);
    };
    SATPolygon.prototype.getAABB = function () {  
        return this.getAABBAsBox().toPolygon();
    };
    SATPolygon.prototype.getCentroid = function () {  
        var points = this['calcPoints'];  
        var len = points.length;  
        var cx = 0;  
        var cy = 0;  
        var ar = 0;  
        for (var i = 0; i < len; i++) {    
            var p1 = points[i];    
            var p2 = i === len - 1 ? points[0] : points[i + 1];    
            var a = p1['x'] * p2['y'] - p2['x'] * p1['y'];    
            cx += (p1['x'] + p2['x']) * a;    
            cy += (p1['y'] + p2['y']) * a;    
            ar += a;  
        }  
        ar = ar * 3;  
        cx = cx / ar;  
        cy = cy / ar;  
        return new SATVector(cx, cy);
    };
    //=================================================
    function SATBox(pos, w, h) {  
        this['pos'] = pos || new SATVector();  
        this['w'] = w || 0;  
        this['h'] = h || 0;
    }
    SATBox.prototype.toPolygon = function () {  
        var pos = this['pos'];  
        var w = this['w'];  
        var h = this['h'];  
        return new SATPolygon(new SATVector(pos['x'], pos['y']), [    
            new SATVector(), new SATVector(w, 0),    
            new SATVector(w, h), 
            new SATVector(0, h)  ]);
    };
    //=================================================
    function SATResponse() {  
        this['a'] = null;  
        this['b'] = null;  
        this['overlapN'] = new SATVector();  
        this['overlapV'] = new SATVector();  
        this.clear();
    }
    SATResponse.prototype.clear = function () {  
        this['aInB'] = true;  
        this['bInA'] = true;  
        this['overlap'] = Number.MAX_VALUE;  
        return this;
    };
    //=================================================
    var T_VECTORS = [];
    for (var i = 0; i < 10; i++) { 
        T_VECTORS.push(new SATVector()); 
    }
    var T_ARRAYS = [];
    for (var i = 0; i < 5; i++) { 
        T_ARRAYS.push([]); 
    }
    var T_RESPONSE = new SATResponse();
    var TEST_POINT = new SATBox(new SATVector(), 0.000001, 0.000001).toPolygon();
    //=================================================
    function flattenPointsOn(points, normal, result) {  
        var min = Number.MAX_VALUE;  
        var max = -Number.MAX_VALUE;  
        var len = points.length;  
        for (var i = 0; i < len; i++) {    
            var dot = points[i].dot(normal);    
            if (dot < min) { 
                min = dot; 
            }    
            if (dot > max) { 
                max = dot; 
            }  
        }  
        result[0] = min; 
        result[1] = max;
    }
    //=================================================
    function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {  
        var rangeA = T_ARRAYS.pop();  
        var rangeB = T_ARRAYS.pop();  
        var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);  
        var projectedOffset = offsetV.dot(axis);  
        flattenPointsOn(aPoints, axis, rangeA);  
        flattenPointsOn(bPoints, axis, rangeB);  
        rangeB[0] += projectedOffset;  
        rangeB[1] += projectedOffset;  
        if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {    
            T_VECTORS.push(offsetV);    
            T_ARRAYS.push(rangeA);    
            T_ARRAYS.push(rangeB);    
            return true;  
        }  
        if (response) {    
            var overlap = 0;    
            if (rangeA[0] < rangeB[0]) {      
                response['aInB'] = false;      
                if (rangeA[1] < rangeB[1]) {        
                    overlap = rangeA[1] - rangeB[0];        
                    response['bInA'] = false;      
                } else {        
                    var option1 = rangeA[1] - rangeB[0];        
                    var option2 = rangeB[1] - rangeA[0];        
                    overlap = option1 < option2 ? option1 : -option2;      
                }    
            } else {      
                response['bInA'] = false;      
                if (rangeA[1] > rangeB[1]) {        
                    overlap = rangeA[0] - rangeB[1];        
                    response['aInB'] = false;      
                } else {        
                    var option1 = rangeA[1] - rangeB[0];        
                    var option2 = rangeB[1] - rangeA[0];        
                    overlap = option1 < option2 ? option1 : -option2;      
                }    
            }    
            var absOverlap = Math.abs(overlap);    
            if (absOverlap < response['overlap']) {      
                response['overlap'] = absOverlap;      
                response['overlapN'].copy(axis);      
                if (overlap < 0) {        
                    response['overlapN'].reverse();
                }    
            }  
        }  
        T_VECTORS.push(offsetV);  
        T_ARRAYS.push(rangeA);  
        T_ARRAYS.push(rangeB);  
        return false;
    }
    //=================================================
    function voronoiRegion(line, point) {  
        var len2 = line.len2();  
        var dp = point.dot(line);  
        if (dp < 0) { 
            return LEFT_VORONOI_REGION; 
        } else if (dp > len2) { 
            return RIGHT_VORONOI_REGION; 
        } else { 
            return MIDDLE_VORONOI_REGION; 
        }
    }
    //=================================================
    var LEFT_VORONOI_REGION = -1;
    var MIDDLE_VORONOI_REGION = 0;
    var RIGHT_VORONOI_REGION = 1;
    //=================================================
    function pointInCircle(p, c) {  
        var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']).sub(c['offset']);  
        var radiusSq = c['r'] * c['r'];  
        var distanceSq = differenceV.len2();  
        T_VECTORS.push(differenceV);  
        return distanceSq <= radiusSq;
    }
    //=================================================
    function pointInPolygon(p, poly) {  
        TEST_POINT['pos'].copy(p);  
        T_RESPONSE.clear();  
        var result = SATtestPolygonPolygon(TEST_POINT, poly, T_RESPONSE);  
        if (result) {    
            result = T_RESPONSE['aInB'];  
        }  
        return result;
    }
    //=================================================
    function SATtestCircleCircle(a, b, response) {  
        var differenceV = T_VECTORS.pop().copy(b['pos']).add(b['offset']).sub(a['pos']).sub(a['offset']);  
        var totalRadius = a['r'] + b['r'];  
        var totalRadiusSq = totalRadius * totalRadius;  
        var distanceSq = differenceV.len2();  
        if (distanceSq > totalRadiusSq) {    
            T_VECTORS.push(differenceV);    
            return false;  
        }  
        if (response) {    
            var dist = Math.sqrt(distanceSq);    
            response['a'] = a;    
            response['b'] = b;    
            response['overlap'] = totalRadius - dist;    
            response['overlapN'].copy(differenceV.normalize());    
            response['overlapV'].copy(differenceV).scale(response['overlap']);    
            response['aInB'] = a['r'] <= b['r'] && dist <= b['r'] - a['r'];    
            response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];  
        }  
        T_VECTORS.push(differenceV);  
        return true;
    }
    //=================================================
    function SATtestPolygonCircle(polygon, circle, response) {  
        var circlePos = T_VECTORS.pop().copy(circle['pos']).add(circle['offset']).sub(polygon['pos']);  
        var radius = circle['r'];  
        var radius2 = radius * radius;  
        var points = polygon['calcPoints'];  
        var len = points.length;  
        var edge = T_VECTORS.pop();  
        var point = T_VECTORS.pop();  
        for (var i = 0; i < len; i++) {    
            var next = i === len - 1 ? 0 : i + 1;    
            var prev = i === 0 ? len - 1 : i - 1;    
            var overlap = 0;    var overlapN = null;    
            edge.copy(polygon['edges'][i]);    
            point.copy(circlePos).sub(points[i]);    
            if (response && point.len2() > radius2) {      
                response['aInB'] = false;    
            }    
            var region = voronoiRegion(edge, point);    
            if (region === LEFT_VORONOI_REGION) {      
                edge.copy(polygon['edges'][prev]);      
                var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);      
                region = voronoiRegion(edge, point2);      
                if (region === RIGHT_VORONOI_REGION) {        
                    var dist = point.len();        
                    if (dist > radius) {          
                        T_VECTORS.push(circlePos);          
                        T_VECTORS.push(edge);          
                        T_VECTORS.push(point);          
                        T_VECTORS.push(point2);          
                        return false;        
                    } else if (response) {          
                        response['bInA'] = false;          
                        overlapN = point.normalize();          
                        overlap = radius - dist;        
                    }      
                }      
                T_VECTORS.push(point2);    
            } else if (region === RIGHT_VORONOI_REGION) {      
                edge.copy(polygon['edges'][next]);      
                point.copy(circlePos).sub(points[next]);      
                region = voronoiRegion(edge, point);      
                if (region === LEFT_VORONOI_REGION) {        
                    var dist = point.len();        
                    if (dist > radius) {          
                        T_VECTORS.push(circlePos);          
                        T_VECTORS.push(edge);          
                        T_VECTORS.push(point);          
                        return false;        
                    } else if (response) {          
                        response['bInA'] = false;          
                        overlapN = point.normalize();          
                        overlap = radius - dist;        
                    }      
                }    
            } else {      
                var normal = edge.perp().normalize();      
                var dist = point.dot(normal);      
                var distAbs = Math.abs(dist);      
                if (dist > 0 && distAbs > radius) {        
                    T_VECTORS.push(circlePos);        
                    T_VECTORS.push(normal);        
                    T_VECTORS.push(point);        
                    return false;      
                } else if (response) {        
                    overlapN = normal;        
                    overlap = radius - dist;        
                    if (dist >= 0 || overlap < 2 * radius) {          
                        response['bInA'] = false;        
                    }      
                }    
            }    
            if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {      
                response['overlap'] = overlap;      
                response['overlapN'].copy(overlapN);    
            }  
        }  
        if (response) {    
            response['a'] = polygon;    
            response['b'] = circle;    
            response['overlapV'].copy(response['overlapN']).scale(response['overlap']);  
        }
        T_VECTORS.push(circlePos);  
        T_VECTORS.push(edge);  
        T_VECTORS.push(point);  
        return true;
    }
    //=================================================
    function SATtestCirclePolygon(circle, polygon, response) {  
        var result = SATtestPolygonCircle(polygon, circle, response);  
        if (result && response) {    
            var a = response['a'];    
            var aInB = response['aInB'];    
            response['overlapN'].reverse();    
            response['overlapV'].reverse();    
            response['a'] = response['b'];    
            response['b'] = a;    
            response['aInB'] = response['bInA'];    
            response['bInA'] = aInB;  
        }  
        return result;
    }
    //=================================================
    function SATtestPolygonPolygon(a, b, response) {  
        var aPoints = a['calcPoints'];  
        var aLen = aPoints.length;  
        var bPoints = b['calcPoints'];  
        var bLen = bPoints.length;  
        for (var i = 0; i < aLen; i++) {    
            if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {      
                return false;    
            }  
        }  
        for (var i = 0; i < bLen; i++) {    
            if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {      
                return false;    
            }  
        }  
        if (response) {    
            response['a'] = a;    
            response['b'] = b;    
            response['overlapV'].copy(response['overlapN']).scale(response['overlap']);  
        }  
        return true;
    }
    //=================================================
}
if (true) {
    QJ.SAT = QJ.SAT || {};
    QJ.SAT.box = function(x,y,boxType){
        let body = null;
        if (boxType[0]==='C') {
            body = new SATCircle(new SATVector(x,y),boxType[1]);
            body.type = 0;
            body.dia = boxType[1];
        } else if (boxType[0]==='R') {
            body = new SATPolygon(
                new SATVector(x,y), [
                new SATVector(-boxType[1]/2,-boxType[2]/2),
                new SATVector(+boxType[1]/2,-boxType[2]/2),
                new SATVector(+boxType[1]/2,+boxType[2]/2),
                new SATVector(-boxType[1]/2,+boxType[2]/2)
            ]);
            body.type = 1;
            body.w = boxType[1];
            body.h = boxType[2];
            body.dl = Math.atan(body.w/body.h);//Diagonal line angle
            body.dia = Math.sqrt(body.w*body.w+body.h*body.h)/2;//Diagonal length
        }
        return body;
    };
    QJ.SAT.boxX = function(x,y,body,sx,sy,ax,ay,r){
        let newSATBody;
        if (body[0]==='C') {
            newSATBody = QJ.SAT.box(x,y,['C',body[1]*(sx+sy)/2]);
        } else if (body[0]==='R') {
            newSATBody = QJ.SAT.box(x,y,['R',body[1]*sx,body[2]*sy]);
            newSATBody.setOffset(
                new SATVector(
                    body[1]*sx*(0.5-ax),
                    body[2]*sy*(0.5-ay)
                )
            );
            newSATBody.setAngle(r);
        }
        return newSATBody;
    };
    QJ.SAT.sat = new SATResponse();
    QJ.SAT.judge = function(bodyA,bodyB){
        QJ.SAT.sat.clear();
        if (bodyA.type===0&&bodyB.type===0) {
            QJ.SAT.sat.result = SATtestCircleCircle(bodyA,bodyB,QJ.SAT.sat);
        } else if (bodyA.type===1&&bodyB.type===1) {
            QJ.SAT.sat.result = SATtestPolygonPolygon(bodyA,bodyB,QJ.SAT.sat);
        } else if (bodyA.type===1&&bodyB.type===0) {
            QJ.SAT.sat.result = SATtestPolygonCircle(bodyA,bodyB,QJ.SAT.sat);
        }  else if (bodyA.type===0&&bodyB.type===1) {
            QJ.SAT.sat.result = SATtestCirclePolygon(bodyA,bodyB,QJ.SAT.sat);
        } 
        return QJ.SAT.sat;
    };
    QJ.SAT.setPostion = function(body,x,y){
        body.pos.x = x;
        body.pos.y = y;
    };
    QJ.SAT.pointInBody = function(point,body){
        if (body.type===0) {
            return this.pointInCircle(point,body);
        } else if (body.type===1) {
            return this.pointInPolygon(point,body);
        }
        return false;
    };
}
//=============================================================================
//
//=============================================================================
(()=>{
    let floor = Math.floor,min = Math.min;
    let insort = function(a, x, lo, hi, cmp) {
      let mid;
      if (lo == null) lo = 0;
      if (lo < 0) throw new Error('lo must be non-negative');
      if (hi == null) hi = a.length;
      while (lo < hi) {
        mid = floor((lo + hi) / 2);
        if (cmp(x, a[mid]) < 0) hi = mid;
        else lo = mid + 1;
      }
      return ([].splice.apply(a, [lo, lo - lo].concat(x)), x);
    },heappush = function(array, item, cmp) {
      array.push(item);
      return _siftdown(array, 0, array.length - 1, cmp);
    },heappop = function(array, cmp) {
      var lastelt, returnitem;
      lastelt = array.pop();
      if (array.length) {
        returnitem = array[0];
        array[0] = lastelt;
        _siftup(array, 0, cmp);
      } else {
        returnitem = lastelt;
      }
      return returnitem;
    },heapreplace = function(array, item, cmp) {
      var returnitem;
      returnitem = array[0];
      array[0] = item;
      _siftup(array, 0, cmp);
      return returnitem;
    },heappushpop = function(array, item, cmp) {
      var _ref;
      if (array.length && cmp(array[0], item) < 0) {
        _ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
        _siftup(array, 0, cmp);
      }
      return item;
    },heapify = function(array, cmp) {
      var i, _i, _j, _len, _ref, _ref1, _results, _results1;
      _ref1 = (function() {
        _results1 = [];
        for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--){ _results1.push(_j); }
        return _results1;
      }).apply(this).reverse();
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        i = _ref1[_i];
        _results.push(_siftup(array, i, cmp));
      }
      return _results;
    },updateItem = function(array, item, cmp) {
      var pos = array.indexOf(item);
      if (pos === -1) return;
      _siftdown(array, 0, pos, cmp);
      return _siftup(array, pos, cmp);
    },nlargest = function(array, n, cmp) {
      var elem, result, _i, _len, _ref;
      result = array.slice(0, n);
      if (!result.length) return result;
      heapify(result, cmp);
      _ref = array.slice(n);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        heappushpop(result, elem, cmp);
      }
      return result.sort(cmp).reverse();
    },nsmallest = function(array, n, cmp) {
      var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
      if (n * 10 <= array.length) {
        result = array.slice(0, n).sort(cmp);
        if (!result.length) return result;
        los = result[result.length - 1];
        _ref = array.slice(n);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          if (cmp(elem, los) < 0) {
            insort(result, elem, 0, null, cmp);
            result.pop();
            los = result[result.length - 1];
          }
        }
        return result;
      }
      heapify(array, cmp);
      _results = [];
      for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        _results.push(heappop(array, cmp));
      }
      return _results;
    },_siftdown = function(array, startpos, pos, cmp) {
      var newitem, parent, parentpos;
      newitem = array[pos];
      while (pos > startpos) {
        parentpos = (pos - 1) >> 1;
        parent = array[parentpos];
        if (cmp(newitem, parent) < 0) {
          array[pos] = parent;
          pos = parentpos;
          continue;
        }
        break;
      }
      return array[pos] = newitem;
    },_siftup = function(array, pos, cmp) {
      var childpos, endpos, newitem, rightpos, startpos;
      endpos = array.length;
      startpos = pos;
      newitem = array[pos];
      childpos = 2 * pos + 1;
      while (childpos < endpos) {
        rightpos = childpos + 1;
        if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
          childpos = rightpos;
        }
        array[pos] = array[childpos];
        pos = childpos;
        childpos = 2 * pos + 1;
      }
      array[pos] = newitem;
      return _siftdown(array, startpos, pos, cmp);
    };
    function Heap(cmp) {
      this.cmp = cmp;
      this.nodes = [];
    }
    Heap.prototype.push = function(x) {
      return heappush(this.nodes, x, this.cmp);
    };
    Heap.prototype.pop = function() {
      return heappop(this.nodes, this.cmp);
    };
    Heap.prototype.peek = function() {
      return this.nodes[0];
    };
    Heap.prototype.contains = function(x) {
      return this.nodes.indexOf(x) !== -1;
    };
    Heap.prototype.replace = function(x) {
      return heapreplace(this.nodes, x, this.cmp);
    };
    Heap.prototype.pushpop = function(x) {
      return heappushpop(this.nodes, x, this.cmp);
    };
    Heap.prototype.heapify = function() {
      return heapify(this.nodes, this.cmp);
    };
    Heap.prototype.updateItem = function(x) {
      return updateItem(this.nodes, x, this.cmp);
    };
    Heap.prototype.clear = function() {
      return this.nodes = [];
    };
    Heap.prototype.empty = function() {
      return this.nodes.length === 0;
    };
    Heap.prototype.size = function() {
      return this.nodes.length;
    };
    Heap.prototype.clone = function() {
      var heap;
      heap = new Heap();
      heap.nodes = this.nodes.slice(0);
      return heap;
    };
    Heap.prototype.toArray = function() {
      return this.nodes.slice(0);
    };
    Heap.prototype.insert = Heap.prototype.push;
    Heap.prototype.top = Heap.prototype.peek;
    Heap.prototype.front = Heap.prototype.peek;
    Heap.prototype.has = Heap.prototype.contains;
    Heap.prototype.copy = Heap.prototype.clone;
    Heap.push = heappush;
    Heap.pop = heappop;
    Heap.replace = heapreplace;
    Heap.pushpop = heappushpop;
    Heap.heapify = heapify;
    Heap.updateItem = updateItem;
    Heap.nlargest = nlargest;
    Heap.nsmallest = nsmallest;
    QJ.Heap = Heap;
})();
//=============================================================================
//AnimatedQJ [v,h,f]  [v,f] 先竖后横
//=============================================================================
function AnimatedQJ() {
    this.initialize.apply(this, arguments);
}
AnimatedQJ.prototype.initialize = function(nameOrVertical,horizontal,frames,skipFrames = 0) {
    this.v = 1;
    this.h = 1;
    this.f = 1;
    this.s = 0;
    if (typeof nameOrVertical == 'number') {
        this.v = nameOrVertical;
        this.h = horizontal;
        this.f = frames;
        this.s = skipFrames;
    } else if (typeof nameOrVertical == 'string') {
        let detail = nameOrVertical.match(/\[([\d]*),([\d]*),([\d]*)\]/i);
        if (detail) {
            this.v = Number(detail[1]);
            this.h = Number(detail[2]);
            this.f = Number(detail[3]);
        } else {
            detail = nameOrVertical.match(/\[([\d]*),([\d]*)\]/i);
            if (detail) {
                this.v = Number(detail[1]);
                this.h = 1;
                this.f = Number(detail[2]);
            } else {
                detail = nameOrVertical.match(/\[([\d]*),([\d]*),([\d]*),([\d]*)\]/i);
                if (detail) {
                    this.v = Number(detail[1]);
                    this.h = Number(detail[2]);
                    this.f = Number(detail[3]);
                    this.s = Number(detail[4]);
                }
            }
        }
    }
    this.m = this.h*this.v-this.s;
    this.reset();
};
//=========================================================================
AnimatedQJ.prototype.reset = function() {
    this.n = 0;
    this.c = 0;
};
AnimatedQJ.prototype.add = function() {
    this.c++;
    if (this.c>=this.f) {
        this.c = 0;
        this.n++;
        if (this.n>=this.m) {
            this.n = 0;
        }
        return true;
    }
    return false;
};
//=========================================================================
AnimatedQJ.prototype.get = function(w,h) {
    return {x:w/this.v*(this.n%this.v),y:h/this.h*Math.floor(this.n/this.v),w:w/this.v,h:h/this.h};
};
AnimatedQJ.prototype.set = function(objectData,w,h,force = false) {
    if (objectData.AnimatedQJIndex!=this.n || force) {
        objectData.setFrame(w/this.v*(this.n%this.v),h/this.h*Math.floor(this.n/this.v),w/this.v,h/this.h);
        objectData.AnimatedQJIndex = this.n;
    }
};
//=========================================================================
AnimatedQJ.prototype.saveWH = function(w,h) {
    this.wi = w;
    this.he = h;
};
AnimatedQJ.prototype.getSaveWH = function() {
    return {x:this.wi/this.v*(this.n%this.v),y:this.he/this.h*Math.floor(this.n/this.v),w:this.wi/this.v,h:this.he/this.h};
};
AnimatedQJ.prototype.setSaveWH = function(objectData,force = false) {
    if (objectData.AnimatedQJIndex!=this.n || force) {
        objectData.setFrame(this.wi/this.v*(this.n%this.v),this.he/this.h*Math.floor(this.n/this.v),this.wi/this.v,this.he/this.h);
        objectData.AnimatedQJIndex = this.n;
    }
};
//======================================================================
AnimatedQJ.prototype.addGetSetBaseSaveWH = function(objectData,force = false) {
    this.c++;
    if (this.c>=this.f) {
        this.c = 0;
        this.n++;
        if (this.n>=this.m) {
            this.n = 0;
        }
    }
    if (objectData.AnimatedQJIndex!=this.n || force) {
        objectData.frame = new Rectangle(
            this.wi/this.v*(this.n%this.v),
            this.he/this.h*Math.floor(this.n/this.v),
            this.wi/this.v,
            this.he/this.h
        );
    }
};
//======================================================================
AnimatedQJ.isAnimated = function(name) {
    return name.includes('[')&&name.includes(']');
};
//=============================================================================
//Dramtic effect   |direction effect    /fade effect    %circle effect
//=============================================================================
function DEFrameQJ() {
    this.initialize.apply(this, arguments);
}
DEFrameQJ.prototype.initialize = function(name,originData,dataType,noFadeCopy) {
    noFadeCopy = noFadeCopy||false;
    this.i = dataType;//0-number 1-text 2-degree
    this.n = name;
    this.d = {};
    this.m = 0;
    this.t = 0;
    this.rt = 0;
    this.isMode = true;
    if (typeof originData == "string"&&originData.includes("~")) {
        let data = originData.split("~"),num=0,fadeT=0,last;
        for (let i=0,il=data.length,detail;i<il;i++) {
            if (data[i].includes("|")) {
                detail = data[i].split("|");
                if (dataType==0) num = Number(detail[1]);
                else if (dataType==1) num = detail[1];
                else if (dataType==2) num = Number(detail[1])*Math.PI/180;
                this.d[this.m] = num;
                if (noFadeCopy) {
                    for (let i=this.m,ll=i+Number(detail[0]);i<ll;i++) {
                        this.d[i] = num;
                    }
                }
                this.m+=Number(detail[0]);
                this.d[this.m] = num;
            } else if (data[i].includes("/")) {
                detail = data[i].split("/");
                fadeT = Number(detail[0]);
                if (dataType==0) {
                    num = Number(detail[1]);
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = last+(num-last)*j/fadeT;
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                } else if (dataType==1) {
                    num = QJ.hexToRgb(detail[1]);
                    last = QJ.hexToRgb(this.d[this.m])//[0,{r:0,g:0,b:0}];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = QJ.rgbToHex({
                            r:Math.floor(last.r+(num.r-last.r)*j/fadeT),
                            g:Math.floor(last.g+(num.g-last.g)*j/fadeT),
                            b:Math.floor(last.b+(num.b-last.b)*j/fadeT)
                        });
                    }
                    this.m+=fadeT;
                    this.d[this.m] = detail[1];
                } else if (dataType==2) {
                    num = Number(detail[1])*Math.PI/180;
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = last+(num-last)*j/fadeT;
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                }
            } else if (data[i].includes("%")) {
                detail = data[i].split("%");
                fadeT = Number(detail[0]);
                if (dataType==0) {
                    num = Number(detail[1]);
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = num-(num-last)*Math.sqrt(1-Math.pow(j/fadeT,2));
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                } else if (dataType==1) {
                    num = QJ.hexToRgb(detail[1]);
                    last = QJ.hexToRgb(this.d[this.m])//[0,{r:0,g:0,b:0}];
                    for (let j=1,xs;j<=fadeT;j++) {
                        xs = Math.sqrt(1-Math.pow(j/fadeT,2));
                        this.d[this.m+j] = QJ.rgbToHex({
                            r:Math.floor(num.r-(num.r-last.r)*xs),
                            g:Math.floor(num.g-(num.g-last.g)*xs),
                            b:Math.floor(num.b-(num.b-last.b)*xs)
                        });
                    }
                    this.m+=fadeT;
                    this.d[this.m] = detail[1];
                } else if (dataType==2) {
                    num = Number(detail[1])*Math.PI/180;
                    last = this.d[this.m];
                    for (let j=1;j<=fadeT;j++) {
                        this.d[this.m+j] = num-(num-last)*Math.sqrt(1-Math.pow(j/fadeT,2));
                    }
                    this.m+=fadeT;
                    this.d[this.m] = num;
                }
            }
        }
    } else {
        this.isMode = false;
        let num;
        if (dataType==0) num = Number(originData);
        else if (dataType==1) num = originData;
        else if (dataType==2) num = Number(originData)*Math.PI/180;
        this.d[this.m] = num;
    }
};
DEFrameQJ.prototype.get = function() {
    if (this.t>this.m) this.t = 0;
    if (this.d[this.t]!=undefined) this.rt = this.t;
    this.t++;
    return this.d[this.rt];
};
DEFrameQJ.prototype.getOnly = function() {
    return this.d[this.rt];
};
DEFrameQJ.prototype.getTar = function(i) {
    return this.d[i>this.m?0:i];
};
DEFrameQJ.prototype.setZero = function() {
    this.t = 0;
    if (this.d[0]!=undefined) {
        this.rt = 0;
    }
};
//=============================================================================
//
//=============================================================================
function Game_InterpreterCEQJ() {
    this.initialize.apply(this, arguments);
}
Game_InterpreterCEQJ.prototype = Object.create(Game_Interpreter.prototype);
Game_InterpreterCEQJ.prototype.constructor = Game_InterpreterCEQJ;
Game_InterpreterCEQJ.prototype.initialize = function(pageIndex,reSetData,extraData) {
    Game_Interpreter.prototype.initialize.call(this,0);
    this.pageIndex=pageIndex;
    for (let i in reSetData) this[i] = reSetData[i];
    this.extraData = extraData;
};
Game_InterpreterCEQJ.prototype.terminate = function() {
    //$gameMap.event(this.eventId())._commonEventQJ.splice($gameMap.event(this.eventId())._commonEventQJ.indexOf(this),1);
    this.overLifeQJ = true;
    Game_Interpreter.prototype.terminate.call(this);
};
//============================================================
function Game_InterpreterCEQJX() {
    this.initialize.apply(this, arguments);
}
Game_InterpreterCEQJX.prototype = Object.create(Game_Interpreter.prototype);
Game_InterpreterCEQJX.prototype.constructor = Game_InterpreterCEQJX;
Game_InterpreterCEQJX.prototype.initialize = function(id,reSetData,extraData) {
    Game_Interpreter.prototype.initialize.call(this,0);
    this.commonEventId=id;
    for (let i in reSetData) this[i] = reSetData[i];
    this.extraData = extraData;
};
Game_InterpreterCEQJX.prototype.terminate = function() {
    //$gameMap._commonEventQJ.splice($gameMap._commonEventQJ.indexOf(this),1);
    this.overLifeQJ = true;
    Game_Interpreter.prototype.terminate.call(this);
};
//============================================================
Object.defineProperty(Game_Interpreter.prototype, "e", {
    get: function() {
        return this.character(0);
    },
    configurable: true
});
//=============================================================================
//
//=============================================================================
function Sprite_QJButton() {
    this.initialize(...arguments);
}
Sprite_QJButton.prototype = Object.create(Sprite_Clickable.prototype);
Sprite_QJButton.prototype.constructor = Sprite_QJButton;
Sprite_QJButton.prototype.initialize = function(originalData) {
    Sprite_Clickable.prototype.initialize.call(this);
    let data = {
        click:null,
        press:null,
        havePressAnim:false,
        alpha:1,
        scaleX:1,
        scaleY:1,
        getBitampFunction:null,
        bitmapName:null,
        defaultImg:null,
        playerInShow:false
    };
    for (let i in originalData) data[i] = originalData[i];
    this._waitTime = 0;
    this._data = data;
    this._haveHandler = !!data.click||!!data.press;
    this._havePressAnim = this._haveHandler&&data.havePressAnim;
    this._pressStatus = false;
    this._clickHandler = data.click;
    this._pressHandler = data.press;
    this._haveNotLoadBitmap = true;
    this.setupData();
};
Sprite_QJButton.prototype.setupData = function() {
    let bit;
    if (typeof this._data.bitmapName == 'string') {
        bit = (this._data.getBitampFunction)(this._data.bitmapName);
        if (!bit||!bit.isReady()) {
            if (this._waitTime>=6) {
                bit = (this._data.getBitampFunction)(this._data.defaultImg);
            } else {
                this._waitTime++;
                setTimeout(this.setupData.bind(this),5);
                return;
            }
        }
    } else {
        for (let i of this._data.bitmapName) {
            bit = (this._data.getBitampFunction)(i);
            if (!bit||!bit.isReady()) {
                if (this._waitTime>=24) {
                    bit = (this._data.getBitampFunction)(this._data.defaultImg);
                } else {
                    this._waitTime++;
                    setTimeout(this.setupData.bind(this),5);
                    return;
                }
            }
        }
        bit = (this._data.getBitampFunction)(this._data.bitmapName[0]);
    }
    this.bitmap = bit;
    this._haveNotLoadBitmap = false;
    this.loadedBitmapBase();
    this.loadedBitmapExtra();
    this.update();
};
Sprite_QJButton.prototype.loadedBitmapBase = function() {
    this.alpha = this._data.hasOwnProperty('alpha')?this._data.alpha:1;
    this.scale.x = this._data.hasOwnProperty('scaleX')?this._data.scaleX:1;
    this.scale.y = this._data.hasOwnProperty('scaleY')?this._data.scaleY:1;
};
Sprite_QJButton.prototype.loadedBitmapExtra = function() {
    //
};
Sprite_QJButton.prototype.update = function() {
    Sprite_Clickable.prototype.update.call(this);
    if (this._haveNotLoadBitmap) {
        //nothing->loading bitmap.
    } else {
        if (this._havePressAnim) this.updateFrame();
        this.updateOpacity();
        this.updateOpacityExtra();
        //this.processTouch();
    }
};
Sprite_QJButton.prototype.updateFrame = function() {
    if (this._pressStatus!=this.isPressed()) {
        this._pressStatus=this.isPressed();
        let bitmap = this.bitmap;
        if (this._pressStatus) {
            this.setFrame(bitmap.width/2,0,bitmap.width/2,bitmap.height);
        } else {
            this.setFrame(0,0,bitmap.width/2,bitmap.height);
        }
    }
};
Sprite_QJButton.prototype.updateOpacity = function() {
    this.opacity = this._pressed ? 255 : 192;
};
Sprite_QJButton.prototype.updateOpacityExtra = function() {
    if (this._data.playerInShow) {
        if (this.bitmap) {
            let sx = $gamePlayer.screenX();
            let sy = $gamePlayer.screenY();
            if (sx>this.x&&sx<this.x+this.width&&sy>this.y&&sy<this.y+this.height) {
                this.opacity *= 0.2;
            }
        }
    }
};
Sprite_QJButton.prototype.onPress = function() {
    if (this._pressHandler) this._pressHandler();
};
Sprite_QJButton.prototype.onClick = function() {
    if (this._clickHandler) this._clickHandler();
};
//=============================================================================
//
//=============================================================================
Sprite.prototype.getIconFrameQJ = function(index) {
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (index % 16) * pw;
    const sy = Math.floor(index / 16) * ph;
    return new Rectangle(sx, sy, pw, ph);
};
Sprite.prototype.getFaceFrameQJ = function(faceIndex) {
    const pw = ImageManager.faceWidth;
    const ph = ImageManager.faceHeight;
    const sx = Math.floor((faceIndex % 4) * pw);
    const sy = Math.floor(Math.floor(faceIndex / 4) * ph);
    return new Rectangle(sx, sy, pw, ph);
};
Bitmap.prototype.bltQJ = function(source,type=null, sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        const image = source._canvas || source._image;
        this.context.globalCompositeOperation = type||"source-over";
        this.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        this._baseTexture.update();
        this.context.globalCompositeOperation = "source-over";
    } catch (e) {
        //
    }
};
Bitmap.prototype.drawIconQJ = function(iconIndex,x,y) {
    const bitmap = ImageManager.loadSystem("IconSet");
    const pw = ImageManager.iconWidth;
    const ph = ImageManager.iconHeight;
    const sx = (iconIndex % 16) * pw;
    const sy = Math.floor(iconIndex / 16) * ph;
    this.blt(bitmap, sx, sy, pw, ph, x, y);
};
//=============================================================================
//
//=============================================================================
function Window_QJEditor() {
    this.initialize(...arguments);
}
Window_QJEditor.prototype = Object.create(Window_Command.prototype);
Window_QJEditor.prototype.constructor = Window_QJEditor;
Window_QJEditor.prototype.initialize = function(data = {}) {
    //========================================
    this.defaultCssData = `
        position: absolute;
        z-index:12;
        color: #FFFFFF;
        transform: translate(-100%, 0%);
        text-align: right;
        font-family: GameFont;
        background: rgba(100,100,100,1);
    `;
    this.data = data;
    this.selectFun = data.selectFun;
    this.overFun = data.overFun;
    this.onloadFun = data.onloadFun;
    this.inputElement = document.createElement("input");
    this.focusInput = false;
    this.inputElement.onfocus = ()=>this.focusInput = true;
    this.inputElement.onblur = ()=>this.focusInput = false;
    document.body.appendChild(this.inputElement);
    //========================================
    this.hideElements();
    window.addEventListener("resize",this.refreshElements.bind(this), false);
    this.inputtingStatus = false;
    //========================================
    Window_Command.prototype.initialize.call(this,new Rectangle(0,0,0,0));
    //========================================
    this.editingData = null;
    this.buttonChangeValueCool = 0;
    //========================================
};
Window_QJEditor.prototype.destroy = function(options) {
    Window_Command.prototype.destroy.call(this, options);
    window.removeEventListener("resize",this.refreshElements.bind(this));
    this.inputElement.remove();
    this.editingData = null;
};
Window_QJEditor.prototype.hide = function() {
    Window_Command.prototype.hide.call(this);
    this.select(-1);
    this.editingData = null;
};
Window_QJEditor.prototype.scrollTo = function(x, y) {
    Window_Command.prototype.scrollTo.call(this,x,y);
    this.refreshElements(!this.inputtingStatus);
};
Window_QJEditor.prototype.smoothScrollTo = function(x, y) {
    Window_Command.prototype.smoothScrollTo.call(this,x,y);
    this.refreshElements(!this.inputtingStatus);
};
Window_QJEditor.prototype.refreshElements = function(hide) {
    if (hide||!this.inputtingStatus||!this._list||(this._list&&this._list.length<=0)||this.index()<0) {
        this.hideElements();
    } else {
        this.hideElements();
        const ext = this._list[this.index()].ext;
        if (ext.inputType==0) {
            //
        } else {
            const rect = this.itemLineRect(this.index());
            const typeWidth = 60;
            if (ext.inputType==1) {
                this.setElement(this.inputElement,this.x+rect.x+rect.width+18,this.y+rect.y+18+
                    (-this.scrollY()%this.itemHeight()));
                if (this.editingData) {
                    let attribute = this._list[this.index()].ext.attribute;
                    if (attribute.length==1) {
                        this.inputElement.value = this.editingData[attribute[0]];
                    } else if (attribute.length==2) {
                        this.inputElement.value = this.editingData[attribute[0]][attribute[1]];
                    } else if (attribute.length==3) {
                        this.inputElement.value = this.editingData[attribute[0]][attribute[1]][attribute[2]];
                    }
                }
                Input.setPreventDefaultCoreQJ(false);
            }
        }
        if (this.selectFun) this.selectFun(this._list[this.index()].ext.help);
        //==========================================
    }
};
Window_QJEditor.prototype.hideElements = function() {
    this.setElement(this.inputElement,Graphics.width/2,Graphics.height/2,true);
};
Window_QJEditor.prototype.setElement = function(ele,px,py,hide) {
    let scale = Graphics._realScale;
    if (!hide) {
        px = ((Graphics._canvas.offsetLeft + px*scale) / window.innerWidth  * 100) + "%";
        py = ((Graphics._canvas.offsetTop  + py*scale) / window.innerHeight * 100) + "%";
    }
    ele.style.cssText = this.defaultCssData+
        'font-size'+32*scale+'px;\n'+
        'width:'+140*scale+'px;\n'+
        'height:'+18*scale+'px;\n'+
        'left:'+px+';\n'+
        'top:'+py+';\n'+
        'visibility:'+(hide?'hidden':'visible')+';'
    ;
};
Window_QJEditor.prototype.loadInputElement = function() {
    return this.inputElement.value;
};
Window_QJEditor.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this.buttonChangeValueCool>0) this.buttonChangeValueCool--;
    else if (this.editingData) {
        const hitIndex = this.hitIndex();
        if (hitIndex<0) this.select(-1);
        if (TouchInput.x>=this.x&&TouchInput.x<=this.x+this.width&&
            TouchInput.y>=this.y&&TouchInput.y<=this.y+this.height) {
            if (this.inputtingStatus&&this.index()>-1) {
                if (this._list[this.index()].ext.inputType==1) {
                    if (!this.focusInput) {
                        let ext = this._list[this.index()].ext;
                        if (ext.left&&Input.isPressed("left")) {
                            this.inputElement.value = ext.left(this.inputElement.value);
                            this.onloadElementData();
                            this.buttonChangeValueCool = 8;
                            SoundManager.playCursor();
                        }
                        if (ext.right&&Input.isPressed("right")) {
                            this.inputElement.value = ext.right(this.inputElement.value);
                            this.onloadElementData();
                            this.buttonChangeValueCool = 8;
                            SoundManager.playCursor();
                        }
                    } else {
                        if (Input.isPressed("ok")) {
                            this.onloadElementData();
                            this.buttonChangeValueCool = 2;
                            SoundManager.playCursor();
                        }
                    }
                } else if (this._list[this.index()].ext.inputType==2) {
                    let ext = this._list[this.index()].ext;
                    if (ext.left&&Input.isPressed("left")) {
                        this.inputElement.value = ext.left(this.inputElement.value);
                        this.onloadElementData();
                        this.buttonChangeValueCool = 8;
                        SoundManager.playCursor();
                    }
                    if (ext.right&&Input.isPressed("right")) {
                        this.inputElement.value = ext.right(this.inputElement.value);
                        this.onloadElementData();
                        this.buttonChangeValueCool = 8;
                        SoundManager.playCursor();
                    }
                    if (ext.ok&&Input.isPressed("ok")) {
                        this.inputElement.value = ext.ok(this.inputElement.value);
                        this.onloadElementData();
                        this.buttonChangeValueCool = 8;
                        SoundManager.playCursor();
                    }
                } else if (this._list[this.index()].ext.inputType==3) {
                    let ext = this._list[this.index()].ext;
                    if (Input.isPressed("left")||Input.isPressed("right")||Input.isPressed("ok")) {
                        let attribute = ext.attribute,newValue,oldValue;
                        if (attribute.length==1) {
                            oldValue = this.editingData[attribute[0]];
                        } else if (attribute.length==2) {
                            oldValue = this.editingData[attribute[0]][attribute[1]];
                        } else if (attribute.length==3) {
                            oldValue = this.editingData[attribute[0]][attribute[1]][attribute[2]];
                        }
                        newValue = ext.fixValue(oldValue);
                        if (attribute.length==1) {
                            this.editingData[attribute[0]] = newValue;
                        } else if (attribute.length==2) {
                            this.editingData[attribute[0]][attribute[1]] = newValue;
                        } else if (attribute.length==3) {
                            this.editingData[attribute[0]][attribute[1]][attribute[2]] = newValue;
                        }
                        ext.content = newValue?"true":"false";
                        this.onloadElementData();
                        this.buttonChangeValueCool = 8;
                        SoundManager.playCursor();
                    }
                }
            }
        } else if (TouchInput.isPressed()) {
            if (this.overFun) this.overFun();
        }
    }
};
Window_QJEditor.prototype.select = function(index) {
    if (this.focusInput) return;
    index = Math.min(this._list?(this._list.length-1):-1,index);
    let ifUpdate = index!=this._index;
    if (this._list&&this.index()>-1&&ifUpdate) {
        if (this._list[this.index()].ext.attribute) this.onloadElementData();
    }
    Window_Selectable.prototype.select.call(this,index);
    if (this._index>=0) {
        this.inputtingStatus = true;
        if (ifUpdate) this.refreshElements();
    } else {
        this.inputtingStatus = false;
        this.refreshElements(true);
        Input.setPreventDefaultCoreQJ(true);
    }
};
Window_QJEditor.prototype.onloadElementData = function() {
    if (!this.editingData) return;
    let newValue,attribute;
    let type = this._list[this.index()].ext.inputType;
    if (type==1) {
        newValue = this._list[this.index()].ext.fixValue(this.inputElement.value);
        attribute = this._list[this.index()].ext.attribute;
        if (attribute.length==1) {
            this.editingData[attribute[0]] = newValue;
        } else if (attribute.length==2) {
            this.editingData[attribute[0]][attribute[1]] = newValue;
        } else if (attribute.length==3) {
            this.editingData[attribute[0]][attribute[1]][attribute[2]] = newValue;
        }
        this._list[this.index()].ext.content = newValue;
        this.inputElement.value = newValue;
    } else if (type==2) {
        //
    } else if (type==3) {
        //
    } else return;
    if (this.onloadFun) this.onloadFun();
    this.paint();
};
Window_QJEditor.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    const ext = this._list[index].ext;
    const typeWidth = 120;
    this.resetFontSettings();
    if (ext.color) this.changeTextColor(ext.color);
    this.contents.fontSize = 18;
    this.changePaintOpacity(this.isCommandEnabled(index));
    if ((typeof ext.content == "number")||
        (typeof ext.content == "string"&&ext.content.length>0)) {
        this.drawText(this.commandName(index), rect.x, rect.y, typeWidth,"left");
        this.drawText(ext.content, rect.x+typeWidth, rect.y, rect.width-typeWidth,"right");
    } else {
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width,"left");
    }
};
Window_QJEditor.prototype.processCursorMove = function() {

};
Window_QJEditor.prototype.calculateHeight = function(length) {
    return Math.min(Graphics.height-72-this.y,32*length+12*2)
};
Window_QJEditor.prototype.itemHeight = function() {
    return 24+8;
};
Window_QJEditor.prototype.calculateWidth = function() {
    return this.data.width;
};
Window_QJEditor.prototype.refreshAllData = function(item,functionData) {//←→↑↓
    let list = [];
    this._handlers = {};
    this._list = [];
    if (functionData) {
        this.show();
        functionData.call(this,item,list);
    } else {
        this.hide();
    }
    for (let i of list) {
        this.setHandler(i.name,i.handler);
        this.addCommand(i.name,i.name,i.enable,i.ext);
    }
    this.editingData = item;
    this.height = this.calculateHeight(list.length);
    this.width = this.calculateWidth();
    this.createContents();
    this.paint();
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
ParticleQJContainer = function (data) {
    //scale position rotation uvs tint maxSize batchSize autoResize baseTexture
    PIXI.Container.call(this);
    this._properties = [//dynamic (true) / static (false)
        'scale' in data ? data.scale : false,
        'position' in data ? data.position : true,
        'rotation' in data ? data.rotation : false,
        'uvs' in data ? data.uvs : false,
        'tint' in data ? data.tint : false
        //'alpha' in data ? data.alpha : false
    ];
    this._maxSize = data.maxSize || 1500;
    this._batchSize = (data.batchSize && data.batchSize <= 16384) ? data.batchSize : 16384;
    this._buffers = null;
    //for every batch stores _updateID corresponding to the last change in that batch
    this._bufferUpdateIDs = [];
    this._updateID = 0;
    this.interactiveChildren = false;
    this.blendMode = PIXI.BLEND_MODES.NORMAL;
    this.autoResize = data.autoResize || false;
    this.roundPixels = true;
    this.baseTexture = data.baseTexture || null;
    this._tint = 0;
    this.tintRgb = new Float32Array(4);
    this.tint = 0xFFFFFF;
}
ParticleQJContainer.__proto__ = PIXI.Container;
ParticleQJContainer.prototype = Object.create(PIXI.Container && PIXI.Container.prototype);
ParticleQJContainer.prototype.constructor = ParticleQJContainer;
Object.defineProperties(ParticleQJContainer.prototype,{ 
    tint: { 
        configurable: true ,
        get: function () {
            return this._tint;
        },
        set: function (value) {
            this._tint = value;
            PIXI.utils.hex2rgb(value, this.tintRgb);
        }
    } 
});
ParticleQJContainer.prototype.updateTransform = function() {
    this.displayObjectUpdateTransform();
};
ParticleQJContainer.prototype.render = function(renderer) {
    if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable || !this.baseTexture) {
        return;
    }
    renderer.batch.setObjectRenderer(renderer.plugins.particleQJ);
    renderer.plugins.particleQJ.render(this);
};
ParticleQJContainer.prototype.onChildrenChange = function(smallestChildIndex) {
    var bufferIndex = Math.floor(smallestChildIndex / this._batchSize);
    while (this._bufferUpdateIDs.length < bufferIndex) {
        this._bufferUpdateIDs.push(0);
    }
    this._bufferUpdateIDs[bufferIndex] = ++this._updateID;
};
ParticleQJContainer.prototype.dispose = function() {
    if (this._buffers) {
        for (var i = 0; i < this._buffers.length; ++i) {
            this._buffers[i].destroy();
        }
        this._buffers = null;
    }
};
ParticleQJContainer.prototype.destroy = function(options) {
    //children texture baseTexture
    PIXI.Container.prototype.destroy.call(this, options);
    this.dispose();
    this._properties = null;
    this._buffers = null;
    this._bufferUpdateIDs = null;
};
//=============================================================================
//
//=============================================================================
ParticleQJBuffer = function(properties, dynamicPropertyFlags, size) {
    this.geometry = new PIXI.Geometry();
    this.indexBuffer = null;
    this.size = size;
    this.dynamicProperties = [];
    this.staticProperties = [];
    for (var i = 0; i < properties.length; ++i) {
        var property = properties[i];
        property = {
            attributeName: property.attributeName,
            size: property.size,
            uploadFunction: property.uploadFunction,
            type: property.type || PIXI.TYPES.FLOAT,
            offset: property.offset,
        };
        if (dynamicPropertyFlags[i]) {
            this.dynamicProperties.push(property);
        } else {
            this.staticProperties.push(property);
        }
    }
    //==================================================================
    this.staticStride = 0;
    this.staticBuffer = null;
    this.staticData = null;
    this.staticDataUint32 = null;
    //==================================================================
    this.dynamicStride = 0;
    this.dynamicBuffer = null;
    this.dynamicData = null;
    this.dynamicDataUint32 = null;
    //==================================================================
    this._updateID = 0;
    this.initBuffers();
};
ParticleQJBuffer.prototype.initBuffers = function() {
    var geometry = this.geometry;
    this.indexBuffer = new PIXI.Buffer(PIXI.utils.createIndicesForQuads(this.size), true, true);
    geometry.addIndex(this.indexBuffer);
    //==================================================================
    var dynamicOffset = 0;
    this.dynamicStride = 0;
    for (var i = 0; i < this.dynamicProperties.length; ++i) {
        var property = this.dynamicProperties[i];
        property.offset = dynamicOffset;
        dynamicOffset += property.size;
        this.dynamicStride += property.size;
    }
    var dynBuffer = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
    this.dynamicData = new Float32Array(dynBuffer);
    this.dynamicDataUint32 = new Uint32Array(dynBuffer);
    this.dynamicBuffer = new PIXI.Buffer(this.dynamicData, false, false);
    for (var i$2 = 0; i$2 < this.dynamicProperties.length; ++i$2) {
        var property$2 = this.dynamicProperties[i$2];
        geometry.addAttribute(
            property$2.attributeName,
            this.dynamicBuffer,
            0,
            property$2.type === PIXI.TYPES.UNSIGNED_BYTE,
            property$2.type,
            this.dynamicStride * 4,
            property$2.offset * 4
        );
    }
    //==================================================================
    var staticOffset = 0;
    this.staticStride = 0;
    for (var i$1 = 0; i$1 < this.staticProperties.length; ++i$1) {
        var property$1 = this.staticProperties[i$1];
        property$1.offset = staticOffset;
        staticOffset += property$1.size;
        this.staticStride += property$1.size;
    }
    var statBuffer = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
    this.staticData = new Float32Array(statBuffer);
    this.staticDataUint32 = new Uint32Array(statBuffer);
    this.staticBuffer = new PIXI.Buffer(this.staticData, true, false);
    for (var i$3 = 0; i$3 < this.staticProperties.length; ++i$3) {
        var property$3 = this.staticProperties[i$3];
        geometry.addAttribute(
            property$3.attributeName,
            this.staticBuffer,
            0,
            property$3.type === PIXI.TYPES.UNSIGNED_BYTE,
            property$3.type,
            this.staticStride * 4,
            property$3.offset * 4
        );
    }
    //==================================================================
};
ParticleQJBuffer.prototype.uploadDynamic = function(children, startIndex, amount) {
    for (var i = 0; i < this.dynamicProperties.length; i++) {
        var property = this.dynamicProperties[i];
        property.uploadFunction(children, startIndex, amount,
            property.type === PIXI.TYPES.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData,
            this.dynamicStride, property.offset);
    }
    this.dynamicBuffer._updateID++;
};
ParticleQJBuffer.prototype.uploadStatic = function(children, startIndex, amount) {
    for (var i = 0; i < this.staticProperties.length; i++) {
        var property = this.staticProperties[i];
        property.uploadFunction(children, startIndex, amount,
            property.type === PIXI.TYPES.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData,
            this.staticStride, property.offset);
    }
    this.staticBuffer._updateID++;
};
ParticleQJBuffer.prototype.destroy = function() {
    this.indexBuffer = null;
    this.dynamicProperties = null;
    this.dynamicBuffer = null;
    this.dynamicData = null;
    this.dynamicDataUint32 = null;
    this.staticProperties = null;
    this.staticBuffer = null;
    this.staticData = null;
    this.staticDataUint32 = null;
    this.geometry.destroy();
};
//=============================================================================
//
//=============================================================================
function ParticleQJRenderer(renderer) {
    PIXI.ObjectRenderer.call(this, renderer);
    var vertex$1 = `
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    attribute vec4 aColor;
    attribute vec2 aPositionCoord;
    attribute float aRotation;
    uniform mat3 translationMatrix;
    uniform vec4 uColor;
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    void main(void){
        float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);
        float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);
        vec2 v = vec2(x, y);
        v = v + aPositionCoord;
        gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
        vColor = aColor * uColor;
    }`;
    var fragment$1 = `
    varying vec2 vTextureCoord;
    varying vec4 vColor;
    uniform sampler2D uSampler;
    void main(void){
        vec4 color = texture2D(uSampler, vTextureCoord) * vColor;
        gl_FragColor = color;
    }`;
    this.shader = new PIXI.Shader(PIXI.Program.from(vertex$1, fragment$1), {})
    this.state = PIXI.State.for2d();
    this.tempMatrix = new PIXI.Matrix();
    this.properties = [
        {attributeName: 'aVertexPosition',size: 2,uploadFunction: this.uploadVertices,offset: 0},
        {attributeName: 'aPositionCoord',size: 2,uploadFunction: this.uploadPosition,offset: 0},
        {attributeName: 'aRotation',size: 1,uploadFunction: this.uploadRotation,offset: 0},
        {attributeName: 'aTextureCoord',size: 2,uploadFunction: this.uploadUvs,offset: 0},
        {attributeName: 'aColor',size: 1,type: PIXI.TYPES.UNSIGNED_BYTE,uploadFunction: this.uploadTint,offset: 0}
    ];
}
ParticleQJRenderer.__proto__ = PIXI.ObjectRenderer;
ParticleQJRenderer.prototype = Object.create(PIXI.ObjectRenderer && PIXI.ObjectRenderer.prototype);
ParticleQJRenderer.prototype.constructor = ParticleQJRenderer;
ParticleQJRenderer.prototype.render = function render (container) {
    //==================================================================
    var children = container.children;
    var maxSize = container._maxSize;
    var totalChildren = children.length;
    var utils = PIXI.utils;
    //==================================================================
    if (totalChildren === 0) {
        return;
    } else if (totalChildren > maxSize && !container.autoResize) {
        totalChildren = maxSize;
    }
    //==================================================================
    var buffers = container._buffers;
    if (!buffers) {
        buffers = container._buffers = this.generateBuffers(container);
    }
    //==================================================================
    var batchSize = container._batchSize;
    var renderer = this.renderer;
    var baseTexture = container.baseTexture;
    //==================================================================
    this.state.blendMode = utils.correctBlendMode(container.blendMode, baseTexture.alphaMode);
    renderer.state.set(this.state);
    //==================================================================
    var gl = renderer.gl;
    var m = container.worldTransform.copyTo(this.tempMatrix);
    m.prepend(renderer.globalUniforms.uniforms.projectionMatrix);
    //==================================================================
    this.shader.uniforms.translationMatrix = m.toArray(true);
    this.shader.uniforms.uColor = utils.premultiplyRgba(container.tintRgb, container.worldAlpha, this.shader.uniforms.uColor, baseTexture.alphaMode);
    this.shader.uniforms.uSampler = baseTexture;
    this.renderer.shader.bind(this.shader);
    //==================================================================
    var updateStatic = false;
    //==================================================================
    for (var i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
        var amount = (totalChildren - i);
        if (amount > batchSize) { amount = batchSize; }
        if (j >= buffers.length) { buffers.push(this._generateOneMoreBuffer(container)); }
        var buffer = buffers[j];
        buffer.uploadDynamic(children, i, amount);
        var bid = container._bufferUpdateIDs[j] || 0;
        updateStatic = updateStatic || (buffer._updateID < bid);
        if (updateStatic) {
            buffer._updateID = container._updateID;
            buffer.uploadStatic(children, i, amount);
        }
        // bind the buffer
        renderer.geometry.bind(buffer.geometry);
        gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
    }
    //==================================================================
};
ParticleQJRenderer.prototype.generateBuffers = function(container) {
    var buffers = [];
    var size = container._maxSize;
    var batchSize = container._batchSize;
    var dynamicPropertyFlags = container._properties;
    for (var i = 0; i < size; i += batchSize) {
        buffers.push(new ParticleQJBuffer(this.properties, dynamicPropertyFlags, batchSize));
    }
    return buffers;
};
ParticleQJRenderer.prototype._generateOneMoreBuffer = function(container) {
    var batchSize = container._batchSize;
    var dynamicPropertyFlags = container._properties;
    return new ParticleQJBuffer(this.properties, dynamicPropertyFlags, batchSize);
};
//==================================================================
ParticleQJRenderer.prototype.uploadVertices = function(children, startIndex, amount, array, stride, offset) {
    for (var i = 0,w0 = 0,w1 = 0,h0 = 0,h1 = 0; i < amount; ++i) {
        var sprite = children[startIndex + i];
        var texture = sprite._texture;
        var sx = sprite.scale.x;
        var sy = sprite.scale.y;
        var trim = texture.trim;
        var orig = texture.orig;
        if (trim) {
            w1 = trim.x - (sprite.anchor.x * orig.width);
            w0 = w1 + trim.width;
            h1 = trim.y - (sprite.anchor.y * orig.height);
            h0 = h1 + trim.height;
        } else {
            w0 = (orig.width) * (1 - sprite.anchor.x);
            w1 = (orig.width) * -sprite.anchor.x;
            h0 = orig.height * (1 - sprite.anchor.y);
            h1 = orig.height * -sprite.anchor.y;
        }
        array[offset] = w1 * sx;
        array[offset + 1] = h1 * sy;
        array[offset + stride] = w0 * sx;
        array[offset + stride + 1] = h1 * sy;
        array[offset + (stride * 2)] = w0 * sx;
        array[offset + (stride * 2) + 1] = h0 * sy;
        array[offset + (stride * 3)] = w1 * sx;
        array[offset + (stride * 3) + 1] = h0 * sy;
        offset += stride * 4;
    }
};
ParticleQJRenderer.prototype.uploadPosition = function(children, startIndex, amount, array, stride, offset) {
    for (var i = 0; i < amount; i++) {
        var spritePosition = children[startIndex + i].position;
        array[offset] = spritePosition.x;
        array[offset + 1] = spritePosition.y;
        array[offset + stride] = spritePosition.x;
        array[offset + stride + 1] = spritePosition.y;
        array[offset + (stride * 2)] = spritePosition.x;
        array[offset + (stride * 2) + 1] = spritePosition.y;
        array[offset + (stride * 3)] = spritePosition.x;
        array[offset + (stride * 3) + 1] = spritePosition.y;
        offset += stride * 4;
    }
};
ParticleQJRenderer.prototype.uploadRotation = function(children, startIndex, amount, array, stride, offset) {
    for (var i = 0; i < amount; i++) {
        var spriteRotation = children[startIndex + i].rotation;
        array[offset] = spriteRotation;
        array[offset + stride] = spriteRotation;
        array[offset + (stride * 2)] = spriteRotation;
        array[offset + (stride * 3)] = spriteRotation;
        offset += stride * 4;
    }
};
ParticleQJRenderer.prototype.uploadUvs = function(children, startIndex, amount, array, stride, offset) {
    for (var i = 0; i < amount; ++i) {
        var textureUvs = children[startIndex + i]._texture._uvs;
        if (textureUvs) {
            array[offset] = textureUvs.x0;
            array[offset + 1] = textureUvs.y0;
            array[offset + stride] = textureUvs.x1;
            array[offset + stride + 1] = textureUvs.y1;
            array[offset + (stride * 2)] = textureUvs.x2;
            array[offset + (stride * 2) + 1] = textureUvs.y2;
            array[offset + (stride * 3)] = textureUvs.x3;
            array[offset + (stride * 3) + 1] = textureUvs.y3;
            offset += stride * 4;
        } else {
            array[offset] = 0;
            array[offset + 1] = 0;
            array[offset + stride] = 0;
            array[offset + stride + 1] = 0;
            array[offset + (stride * 2)] = 0;
            array[offset + (stride * 2) + 1] = 0;
            array[offset + (stride * 3)] = 0;
            array[offset + (stride * 3) + 1] = 0;
            offset += stride * 4;
        }
    }
};
ParticleQJRenderer.prototype.uploadTint = function(children, startIndex, amount, array, stride, offset) {
    let premultiplyTint = PIXI.utils.premultiplyTint;
    for (var i = 0; i < amount; ++i) {
        var sprite = children[startIndex + i];
        var premultiplied = sprite._texture.baseTexture.alphaMode > 0;
        var alpha = sprite.alpha;
        var argb = alpha < 1.0 && premultiplied ? PIXI.utils.premultiplyTint(sprite._tintRGB, alpha) : sprite._tintRGB + (alpha * 255 << 24);
        array[offset] = argb;
        array[offset + stride] = argb;
        array[offset + (stride * 2)] = argb;
        array[offset + (stride * 3)] = argb;
        offset += stride * 4;
    }
};
//==================================================================
ParticleQJRenderer.prototype.destroy = function() {
    PIXI.ObjectRenderer.prototype.destroy.call(this);
    if (this.shader) {
        this.shader.destroy();
        this.shader = null;
    }
    this.tempMatrix = null;
};
PIXI.Renderer.registerPlugin("particleQJ", ParticleQJRenderer);
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
(($) => {
//=============================================================================
//
//=============================================================================
const pluginName = "QJ-CoreMZ";
const parameters = PluginManager.parameters(pluginName);
let tileSize = QJ.tileSize = Number(parameters.tileSize || 48);
//=============================================================================
//
//=============================================================================
$.Input__shouldPreventDefault = Input._shouldPreventDefault;
$.Input__shouldPreventDefault_New = function(keyCode) {
    switch (keyCode) {
        case 9: // tab
            return true;
    }
    return false;
};
Input.setPreventDefaultCoreQJ = function(bo) {
    if (bo) {
        Input._shouldPreventDefault = $.Input__shouldPreventDefault;
    } else {
        Input._shouldPreventDefault = $.Input__shouldPreventDefault_New;
    }
};
//=============================================================================
//
//=============================================================================
$.Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
Game_Interpreter.prototype.executeCommand = function() {
    QJ.Pointer=this;
    return $.Game_Interpreter_executeCommand.apply(this,arguments);
};
//=============================================================================
//Key
//=============================================================================
QJ.originKeyCodes = {
    8: 'backspace',9: 'tab',12: 'clear',13: 'ok',16: 'shift',17: 'control',18: 'alt',19: 'pause',20: 'caps lock', 27: 'escape',           32: 'ok',         33: 'pageup',        34: 'pagedown',      35: 'end',36: 'home',
    37: 'left',           38: 'up',             39: 'right',          40: 'down',           
    44: 'print screen',45: 'escape',         46: 'del',
    48: 'num 0',49: 'num 1',50: 'num 2',51: 'num 3',52: 'num 4',53: 'num 5',54: 'num 6',55: 'num 7',56: 'num 8',57: 'num 9',
    65: 'A',66: 'B',67: 'C',68: 'D',69: 'E',70: 'F',71: 'G',72: 'H',73: 'I',74: 'J',75: 'K',76: 'L',77: 'M',78: 'N',79: 'O',80: 'P',81: 'Q',
    82: 'R',83: 'S',84: 'T',85: 'U',86: 'V',87: 'W',       88: 'X',       89: 'Y',90: 'Z',       
    91: 'L Win',92: 'R Win',93: 'select',96: 'escape',     
    97: 'numpad 1',     98: 'numpad 2',     99: 'numpad 3',     100: 'numpad 4',    101: 'numpad 5',     102: 'numpad 6',     103: 'numpad 7',     104: 'numpad 8',      105: 'numpad 9',     
    106: 'numpad *',107: 'numpad +',109: 'numpad -',110: 'numpad .',111: 'numpad /',
    112: 'F1',113: 'F2',114: 'F3',115: 'F4',116: 'F5',117: 'F6',118: 'F7',119: 'F8',120: 'F9',121: 'F10',122: 'F11',123: 'F12',
    144: 'num lock',145: 'scroll lock',
    186: ';',187: '=',188: ',',189: '-',190: '.',191: '/',192: '`',219: '[',220: '\\',221: ']',222: "'"
};
for (let i in QJ.originKeyCodes) {
    //in order not to conflict.[为了防止冲突]
    if (!Input.keyMapper[i]) {
        Input.keyMapper[i] = QJ.originKeyCodes[i];
    }
}
//=============================================================================
//
//=============================================================================
QJ.randomColor = function(start,length) {
    return QJ.rgbToHex({
        r:start+Math.floor(Math.random()*length),
        g:start+Math.floor(Math.random()*length),
        b:start+Math.floor(Math.random()*length)});
}
QJ.colorGrad = function(bitmap,content,x,y,w,h,ro = 0,offset = 0) {
    if (content.constructor == Bitmap) {
        const grad = bitmap._context.createPattern(content._canvas || content._image,"repeat");
        if (grad&&grad.setTransform) {
            grad.setTransform(new DOMMatrix().
                translateSelf(x+offset*Math.sin(ro),y-offset*Math.cos(ro),0).
                rotateSelf(ro*180/Math.PI));
        }
        return grad;
    } else if (content.includes("|")) {
        const list=content.split("~");
        const colorNum = list.length;
        let k = Math.atan(w/h),diaL = Math.sqrt(w*w+h*h)/2,noSoildRadius;
        ro = ro%(Math.PI*2);
        if (ro<Math.PI/2) noSoildRadius = diaL*Math.cos(k-ro);
        else if (ro<Math.PI) noSoildRadius = -diaL*Math.cos(k+ro);
        else if (ro<Math.PI*3/2) noSoildRadius = -diaL*Math.cos(k-ro);
        else noSoildRadius = diaL*Math.cos(k+ro);
        const grad = bitmap._context.createLinearGradient(
            Math.floor(x+w/2+noSoildRadius*Math.sin(ro)),Math.floor(y+h/2-noSoildRadius*Math.cos(ro)),
            Math.floor(x+w/2-noSoildRadius*Math.sin(ro)),Math.floor(y+h/2+noSoildRadius*Math.cos(ro)));
        if (offset==0) {
            for(let i=0,detail,point;i<colorNum; i++) {
                detail = list[i].split("|");
                grad.addColorStop(detail[0],detail[1]);
            }
        } else {
            offset %= 1;//转为小数
            let hasNotMoveUp = true;
            //let listConsole = {};
            for(let i=0,detail,point; i<colorNum; i++) {
                detail = list[i].split("|");
                detail[0] = Number(detail[0]);
                point = Math.floor((detail[0]+offset)*100)/100;
                if (hasNotMoveUp&&point>1) {
                    hasNotMoveUp = false;
                    let lastColorDetail = list[(i-1<0)?(colorNum-1):(i-1)].split("|");
                    lastColorDetail[0] = Number(lastColorDetail[0]);
                    let trueColor = QJ.gradientPointCalculate(lastColorDetail[1],detail[1],(1-lastColorDetail[0]-offset)/(detail[0]-lastColorDetail[0]));
                    grad.addColorStop(1,trueColor);
                    grad.addColorStop(Math.round((point==1?1:point%1)*100)/100,detail[1]);
                    grad.addColorStop(0,trueColor);
                    //listConsole[1]=trueColor;
                    //listConsole[Math.round((point==1?1:point%1)*100)/100]=detail[1];
                    //listConsole[0]=trueColor;
                } else {
                    grad.addColorStop(Math.round((point==1?1:point%1)*100)/100,detail[1]);
                    //listConsole[Math.round((point==1?1:point%1)*100)/100]=detail[1];
                }
            }
            //console.log(listConsole);
        }
        return grad;
    } else {
        return content;
    }
}
QJ.gradientPointCalculate = function (start,end,rate) {
    let rgb1 = QJ.hexToRgb(start);
    let rgb2 = QJ.hexToRgb(end);
    let r = Math.floor(rgb1.r-(rgb1.r-rgb2.r)*rate).clamp(0,255);
    let g = Math.floor(rgb1.g-(rgb1.g-rgb2.g)*rate).clamp(0,255);
    let b = Math.floor(rgb1.b-(rgb1.b-rgb2.b)*rate).clamp(0,255);
    return QJ.rgbToHex({r:r,g:g,b:b});
}
QJ.hexToRgb = function (hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {r: parseInt(result[1],16),g: parseInt(result[2], 16),b: parseInt(result[3], 16)};
}
QJ.rgbToHex = function (rgb) {
    let r=rgb.r.toString(16),g=rgb.g.toString(16),b=rgb.b.toString(16);
    return "#"+(r.length==1?("0"+r):r)+(g.length==1?("0"+g):g)+(b.length==1?("0"+b):b);
}
QJ.calculateAngleByTwoPoint=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)));
    else if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    else if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)));
    else if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)));
    else if (ex==x&&ey>y) ro=Math.PI;
    else if (ex==x&&ey<y) ro=0;
    else if (ex>x&&ey==y) ro=Math.PI/2;
    else if (ex<x&&ey==y) ro=Math.PI*3/2;
    else if (ex==x&&ey==y)ro=NaN;
    return ro;
};
QJ.calculateAngleByDirection=function(direction){
    if (direction==1) return Math.PI*5/4;//左下
    else if (direction==2) return Math.PI;
    else if (direction==3) return Math.PI*3/4;//右下
    else if (direction==4) return Math.PI*3/2;
    else if (direction==6) return Math.PI/2;
    else if (direction==7) return Math.PI*7/4;//左上
    else if (direction==8) return 0;
    else if (direction==9) return Math.PI/4;//右上
    return 0;
};
let transAngle = 180/Math.PI;
QJ.calculateAngleByTwoPointAngle=function(x,y,ex,ey){
    let ro;
    if (ex>x&&ey<y)  ro=(-Math.atan((x-ex)/(y-ey)))         *transAngle;
    else if (ex>x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)))  *transAngle;
    else if (ex<x&&ey>y)  ro=(Math.PI-Math.atan((x-ex)/(y-ey)))  *transAngle;
    else if (ex<x&&ey<y)  ro=(2*Math.PI-Math.atan((x-ex)/(y-ey)))*transAngle;
    else if (ex==x&&ey>y) ro=180;
    else if (ex==x&&ey<y) ro=0;
    else if (ex>x&&ey==y) ro=90;
    else if (ex<x&&ey==y) ro=270;
    else if (ex==x&&ey==y)ro=NaN;
    return ro;
};
QJ.calculateAngleByDirectionAngle=function(direction){
    if (direction==1) return 225;//左下
    else if (direction==2) return 180;
    else if (direction==3) return 135;//右下
    else if (direction==4) return 270;
    else if (direction==6) return 90;
    else if (direction==7) return 315;//左上
    else if (direction==8) return 0;
    else if (direction==9) return 45;//右上
    return 0;
};
QJ.calculateAnnotation = function(event) {
    let page=null,content="";
    try{
        page=event.page();
    } catch(e) {
        page=null;
    }
    if (page) {
        if (page.list[0].code === 108) {
            let i=0;
            while (page.list[i].code === 408 || page.list[i].code === 108) {
                content=content + page.list[i].parameters[0];
                i++;
            }
        }
    }
    return content;
};
QJ.calculateRangeAndInt = function(list) {
    let standardList = [],detail;
    for (let i of list) {
        if (typeof i == "number") {
            standardList.push(i);
        } else if (typeof i == "string") {
            detail = i.split('-');
            for (let j=Number(detail[0]),jl=Number(detail[1]);j<=jl;j++) {
                standardList.push(j);
            }
        }
    }
    return standardList;
}
//=============================================================================
//
//=============================================================================
$.Game_Event_initialize = Game_Event.prototype.initialize;
Game_Event.prototype.initialize = function(mapId, eventId) {
    this._commonEventQJ = new Array();
    $.Game_Event_initialize.apply(this,arguments);
};
Game_Event.prototype.steupCEQJ = function(value,reSetData,extraData) {
    let listData = this.event().pages[value-1];
    if (listData) {
        let interpreter = new Game_InterpreterCEQJ(value-1,reSetData,extraData);
        interpreter.setup(listData.list,this.eventId());
        if (!interpreter.isRunning()) interpreter.terminate();
        this._commonEventQJ.push(interpreter);
    }
};
$.Game_Event_updateParallel = Game_Event.prototype.updateParallel;
Game_Event.prototype.updateParallel = function() {
    $.Game_Event_updateParallel.apply(this,arguments);
    this.updateCEQJ();
};
Game_Event.prototype.updateCEQJ = function() {
    if (this._commonEventQJ.length>0) {
        for (let idata=this._commonEventQJ,il=idata.length,i=0;i<il;i++) {
            if (idata[i]) {
                idata[i].update();
                if (idata[i].overLifeQJ) {
                    idata.splice(i,1);
                    i--;
                    il--;
                }
            }
        }
    }
};
//=============================================================================
//
//=============================================================================
$.Game_Map_initialize = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function() {
    this._commonEventQJ = new Array();
    $.Game_Map_initialize.apply(this,arguments);
};
Game_Map.prototype.steupCEQJ = function(value,eid,reSetData,extraData) {
    if (!!$dataCommonEvents[value]) {
        let interpreter = new Game_InterpreterCEQJX(value,reSetData||{},extraData||{});
        interpreter.setup($dataCommonEvents[value].list,eid);
        if (!interpreter.isRunning()) interpreter.terminate();
        this._commonEventQJ.push(interpreter);
    }
};
$.Game_Map_update = Game_Map.prototype.update;
Game_Map.prototype.update = function(sceneActive) {
    $.Game_Map_update.apply(this,arguments);
    if (this._commonEventQJ.length>0) {
        for (let idata=this._commonEventQJ,il=idata.length,i=0;i<il;i++) {
            if (idata[i]) {
                idata[i].update();
                if (idata[i].overLifeQJ) {
                    idata.splice(i,1);
                    i--;
                    il--;
                }
            }
        }
    }
}
//=============================================================================
//
//=============================================================================
Spriteset_Base.prototype.startAnimationQJ = function(target,targetSprite,animationId) {
    const animationData = $dataAnimations[animationId];
    if (animationData) {
        target.startAnimation();
        const mv = this.isMVAnimation(animationData);
        const sprite = new (mv ? Sprite_AnimationMV : Sprite_Animation)();
        sprite.targetObjects = [target];
        sprite.setup([targetSprite], animationData,false,0,null);
        this._effectsContainer.addChild(sprite);
        this._animationSprites.push(sprite);
        return sprite;
    }
    return null;
};
//=============================================================================
//
//=============================================================================
$.Sprite_Animation_targetSpritePosition = Sprite_Animation.prototype.targetSpritePosition;
Sprite_Animation.prototype.targetSpritePosition = function(sprite) {
    if (sprite._changePositionQJ) {
        return {x:sprite.changePositionXQJ(),y:sprite.changePositionYQJ()};
    } else {
        return $.Sprite_Animation_targetSpritePosition.apply(this,arguments);
    }
};
$.Sprite_Animation_updateEffectGeometry = Sprite_Animation.prototype.updateEffectGeometry;
Sprite_Animation.prototype.updateEffectGeometry = function() {
    if (this._targets&&this._targets[0]&&this._targets[0]._changePositionQJ) {
        const scale = this._animation.scale / 100;
        const r = Math.PI / 180;
        const rx = this._animation.rotation.x * r;
        const ry = this._animation.rotation.y * r;
        const rz = this._targets[0].changeRotationQJ() * r;
        if (this._handle) {
            this._handle.setLocation(0, 0, 0);
            this._handle.setRotation(rx, ry, rz);
            this._handle.setScale(scale, scale, scale);
            this._handle.setSpeed(this._animation.speed / 100);
            this.z = this._targets[0].z;
        }
    } else {
        $.Sprite_Animation_updateEffectGeometry.apply(this,arguments);
    }
};
//=============================================================================
//
//=============================================================================
$.Sprite_AnimationMV_updatePosition = Sprite_AnimationMV.prototype.updatePosition;
Sprite_AnimationMV.prototype.updatePosition = function() {
    if (this._targets&&this._targets[0]&&this._targets[0]._changePositionQJ) {
        this.x = this._targets[0].changePositionXQJ();
        this.y = this._targets[0].changePositionYQJ();
        this.rotation = - this._targets[0].changeRotationQJ() * Math.PI / 180;
        this.z = this._targets[0].z;
    } else {
        $.Sprite_AnimationMV_updatePosition.apply(this,arguments);
    }
};
//=============================================================================
//
//=============================================================================
Game_Character.prototype.requestAnimationQJ = function(animId) {
    $gameTemp.requestAnimation([this],animId);
};
//=============================================================================
//
//=============================================================================
Bitmap.prototype.measureTextHeight = function(text) {
    return this.fontSize;
};
Bitmap.prototype.drawTextVerticalQJ = function(text, x, y, maxWidth, lineHeight, align) {
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || this.fontSize;
    lineHeight = lineHeight || this.fontSize;
    let tx = x,ty = y;
    if (align === "center") tx += maxWidth / 2;
    if (align === "right")  tx += maxWidth;
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    for (let i=0;i<text.length;i++) {
        this._drawTextOutline(text[i], tx, ty+i*this.fontSize, maxWidth);
        context.globalAlpha = alpha;
        this._drawTextBody(text[i], tx, ty+i*this.fontSize, maxWidth);
    }
    context.restore();
    this._baseTexture.update();
};
//=============================================================================
//
//=============================================================================
Bitmap.blankBitmap = new Bitmap(0,0);
Bitmap.measureTextSizeQJ = function(text,arrangement,fontSize,fontFace,fontItalic,fontBold) {
    fontItalic=fontItalic == null ? Bitmap.blankBitmap.fontItalic : fontItalic;
    fontSize=fontSize == null ? Bitmap.blankBitmap.fontSize : fontSize;
    fontItalic=fontFace == null ? Bitmap.blankBitmap.fontFace : fontFace;
    fontBold=fontBold == null ? Bitmap.blankBitmap.fontBold : fontBold;
    let tempData = {width:0,height:0};
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = Bitmap.prototype._makeFontNameText.call({fontItalic:fontItalic,fontSize:fontSize,fontItalic:fontItalic,fontBold:fontBold});
    if (arrangement==0) {//横排
        let result = tempCtx.measureText(text);
        tempData.width = result.width;
        tempData.height = Math.floor(fontSize*96/72);
    } else {//竖排
        let maxWidth = 0;
        for (let i=0,result;i<text.length;i++) {
            result = tempCtx.measureText(text[i]);
            if (result.width>maxWidth) {
                maxWidth=result.width;
            }
        }
        tempData.width = maxWidth;
        tempData.height = fontSize * text.length;
    }
    return tempData;
};
//=============================================================================
//
//=============================================================================
Bitmap.prototype.drawTextOnlyBodyQJ = function(text, x, y, maxWidth, lineHeight, align) {
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = alpha;
    this._drawTextBody(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};
Bitmap.prototype.drawTextOnlyOutLineQJ = function(text, x, y, maxWidth, lineHeight, align) {
    const context = this.context;
    const alpha = context.globalAlpha;
    maxWidth = maxWidth || 0xffffffff;
    let tx = x;
    let ty = Math.round(y + lineHeight / 2 + this.fontSize * 0.35);
    if (align === "center") {
        tx += maxWidth / 2;
    }
    if (align === "right") {
        tx += maxWidth;
    }
    context.save();
    context.font = this._makeFontNameText();
    context.textAlign = align;
    context.textBaseline = "alphabetic";
    context.globalAlpha = 1;
    this._drawTextOutline(text, tx, ty, maxWidth);
    context.restore();
    this._baseTexture.update();
};
//=============================================================================
//
//=============================================================================
Game_Event.prototype.directResetPageQJ = function() {
    const newPageIndex = this._erased ? -1 : this.findProperPageIndex();
    this._pageIndex = newPageIndex;
    this.setupPage();
};
//=============================================================================
//
//=============================================================================
Sprite.prototype.snapForCardRenderTextureQJ = function(scaleSize = 1.4) {
    if (!this.bitmap) return null;
    const width = Math.floor(this.bitmap.width*scaleSize);
    const height = Math.floor(this.bitmap.height*scaleSize);
    const renderTexture = PIXI.RenderTexture.create(width, height);
    const renderer = Graphics.app.renderer;
    let remX = this.x;
    let remY = this.y;
    this.x = Math.floor(this.bitmap.width*(0.5-this.anchor.x)+width*0.5);
    this.y = Math.floor(this.bitmap.height*(0.5-this.anchor.y)+height*0.5);
    renderer.render(this, renderTexture);
    this.x = remX;
    this.y = remY;
    return renderTexture;
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
})(QJ.reWrite);
//=============================================================================
//
//=============================================================================
if (!PIXI.filters.EmbossFilter) {
/*!
 * pixi-filters - v3.1.0
 * Compiled Wed, 11 Mar 2020 20:38:18 UTC
 *
 * pixi-filters is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var __filters=function(e,t,n,r,o,i,l,s){"use strict";var a="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",u="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float gamma;\nuniform float contrast;\nuniform float saturation;\nuniform float brightness;\nuniform float red;\nuniform float green;\nuniform float blue;\nuniform float alpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (c.a > 0.0) {\n        c.rgb /= c.a;\n\n        vec3 rgb = pow(c.rgb, vec3(1. / gamma));\n        rgb = mix(vec3(.5), mix(vec3(dot(vec3(.2125, .7154, .0721), rgb)), rgb, saturation), contrast);\n        rgb.r *= red;\n        rgb.g *= green;\n        rgb.b *= blue;\n        c.rgb = rgb * brightness;\n\n        c.rgb *= c.a;\n    }\n\n    gl_FragColor = c * alpha;\n}\n",c=function(e){function t(t){e.call(this,a,u),Object.assign(this,{gamma:1,saturation:1,contrast:1,brightness:1,red:1,green:1,blue:1,alpha:1},t)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.apply=function(e,t,n,r){this.uniforms.gamma=Math.max(this.gamma,1e-4),this.uniforms.saturation=this.saturation,this.uniforms.contrast=this.contrast,this.uniforms.brightness=this.brightness,this.uniforms.red=this.red,this.uniforms.green=this.green,this.uniforms.blue=this.blue,this.uniforms.alpha=this.alpha,e.applyFilter(this,t,n,r)},t}(t.Filter),f=a,h="\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}",p="\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 uOffset;\nuniform vec4 filterClamp;\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n\n    // Sample top left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample top right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y + uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom right pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x + uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Sample bottom left pixel\n    color += texture2D(uSampler, clamp(vec2(vTextureCoord.x - uOffset.x, vTextureCoord.y - uOffset.y), filterClamp.xy, filterClamp.zw));\n\n    // Average\n    color *= 0.25;\n\n    gl_FragColor = color;\n}\n",d=function(e){function t(t,r,o){void 0===t&&(t=4),void 0===r&&(r=3),void 0===o&&(o=!1),e.call(this,f,o?p:h),this.uniforms.uOffset=new Float32Array(2),this._pixelSize=new n.Point,this.pixelSize=1,this._clamp=o,this._kernels=null,Array.isArray(t)?this.kernels=t:(this._blur=t,this.quality=r)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var r={kernels:{configurable:!0},clamp:{configurable:!0},pixelSize:{configurable:!0},quality:{configurable:!0},blur:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){var o,i=this.pixelSize.x/t._frame.width,l=this.pixelSize.y/t._frame.height;if(1===this._quality||0===this._blur)o=this._kernels[0]+.5,this.uniforms.uOffset[0]=o*i,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,t,n,r);else{for(var s,a=e.getFilterTexture(),u=t,c=a,f=this._quality-1,h=0;h<f;h++)o=this._kernels[h]+.5,this.uniforms.uOffset[0]=o*i,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,u,c,1),s=u,u=c,c=s;o=this._kernels[f]+.5,this.uniforms.uOffset[0]=o*i,this.uniforms.uOffset[1]=o*l,e.applyFilter(this,u,n,r),e.returnFilterTexture(a)}},t.prototype._generateKernels=function(){var e=this._blur,t=this._quality,n=[e];if(e>0)for(var r=e,o=e/t,i=1;i<t;i++)r-=o,n.push(r);this._kernels=n},r.kernels.get=function(){return this._kernels},r.kernels.set=function(e){Array.isArray(e)&&e.length>0?(this._kernels=e,this._quality=e.length,this._blur=Math.max.apply(Math,e)):(this._kernels=[0],this._quality=1)},r.clamp.get=function(){return this._clamp},r.pixelSize.set=function(e){"number"==typeof e?(this._pixelSize.x=e,this._pixelSize.y=e):Array.isArray(e)?(this._pixelSize.x=e[0],this._pixelSize.y=e[1]):e instanceof n.Point?(this._pixelSize.x=e.x,this._pixelSize.y=e.y):(this._pixelSize.x=1,this._pixelSize.y=1)},r.pixelSize.get=function(){return this._pixelSize},r.quality.get=function(){return this._quality},r.quality.set=function(e){this._quality=Math.max(1,Math.round(e)),this._generateKernels()},r.blur.get=function(){return this._blur},r.blur.set=function(e){this._blur=e,this._generateKernels()},Object.defineProperties(t.prototype,r),t}(t.Filter),m=a,g="\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform float threshold;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    // A simple & fast algorithm for getting brightness.\n    // It's inaccuracy , but good enought for this feature.\n    float _max = max(max(color.r, color.g), color.b);\n    float _min = min(min(color.r, color.g), color.b);\n    float brightness = (_max + _min) * 0.5;\n\n    if(brightness > threshold) {\n        gl_FragColor = color;\n    } else {\n        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);\n    }\n}\n",v=function(e){function t(t){void 0===t&&(t=.5),e.call(this,m,g),this.threshold=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={threshold:{configurable:!0}};return n.threshold.get=function(){return this.uniforms.threshold},n.threshold.set=function(e){this.uniforms.threshold=e},Object.defineProperties(t.prototype,n),t}(t.Filter),x="uniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D bloomTexture;\nuniform float bloomScale;\nuniform float brightness;\n\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    color.rgb *= brightness;\n    vec4 bloomColor = vec4(texture2D(bloomTexture, vTextureCoord).rgb, 0.0);\n    bloomColor.rgb *= bloomScale;\n    gl_FragColor = color + bloomColor;\n}\n",y=function(e){function t(t){e.call(this,m,x),"number"==typeof t&&(t={threshold:t}),t=Object.assign({threshold:.5,bloomScale:1,brightness:1,kernels:null,blur:8,quality:4,pixelSize:1,resolution:r.settings.RESOLUTION},t),this.bloomScale=t.bloomScale,this.brightness=t.brightness;var n=t.kernels,o=t.blur,i=t.quality,l=t.pixelSize,s=t.resolution;this._extractFilter=new v(t.threshold),this._extractFilter.resolution=s,this._blurFilter=n?new d(n):new d(o,i),this.pixelSize=l,this.resolution=s}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={resolution:{configurable:!0},threshold:{configurable:!0},kernels:{configurable:!0},blur:{configurable:!0},quality:{configurable:!0},pixelSize:{configurable:!0}};return t.prototype.apply=function(e,t,n,r,o){var i=e.getFilterTexture();this._extractFilter.apply(e,t,i,1,o);var l=e.getFilterTexture();this._blurFilter.apply(e,i,l,1,o),this.uniforms.bloomScale=this.bloomScale,this.uniforms.brightness=this.brightness,this.uniforms.bloomTexture=l,e.applyFilter(this,t,n,r),e.returnFilterTexture(l),e.returnFilterTexture(i)},n.resolution.get=function(){return this._resolution},n.resolution.set=function(e){this._resolution=e,this._extractFilter&&(this._extractFilter.resolution=e),this._blurFilter&&(this._blurFilter.resolution=e)},n.threshold.get=function(){return this._extractFilter.threshold},n.threshold.set=function(e){this._extractFilter.threshold=e},n.kernels.get=function(){return this._blurFilter.kernels},n.kernels.set=function(e){this._blurFilter.kernels=e},n.blur.get=function(){return this._blurFilter.blur},n.blur.set=function(e){this._blurFilter.blur=e},n.quality.get=function(){return this._blurFilter.quality},n.quality.set=function(e){this._blurFilter.quality=e},n.pixelSize.get=function(){return this._blurFilter.pixelSize},n.pixelSize.set=function(e){this._blurFilter.pixelSize=e},Object.defineProperties(t.prototype,n),t}(t.Filter),_=a,b="varying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform float pixelSize;\nuniform sampler2D uSampler;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n    return floor( coord / size ) * size;\n}\n\nvec2 getMod(vec2 coord, vec2 size)\n{\n    return mod( coord , size) / size;\n}\n\nfloat character(float n, vec2 p)\n{\n    p = floor(p*vec2(4.0, -4.0) + 2.5);\n\n    if (clamp(p.x, 0.0, 4.0) == p.x)\n    {\n        if (clamp(p.y, 0.0, 4.0) == p.y)\n        {\n            if (int(mod(n/exp2(p.x + 5.0*p.y), 2.0)) == 1) return 1.0;\n        }\n    }\n    return 0.0;\n}\n\nvoid main()\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    // get the rounded color..\n    vec2 pixCoord = pixelate(coord, vec2(pixelSize));\n    pixCoord = unmapCoord(pixCoord);\n\n    vec4 color = texture2D(uSampler, pixCoord);\n\n    // determine the character to use\n    float gray = (color.r + color.g + color.b) / 3.0;\n\n    float n =  65536.0;             // .\n    if (gray > 0.2) n = 65600.0;    // :\n    if (gray > 0.3) n = 332772.0;   // *\n    if (gray > 0.4) n = 15255086.0; // o\n    if (gray > 0.5) n = 23385164.0; // &\n    if (gray > 0.6) n = 15252014.0; // 8\n    if (gray > 0.7) n = 13199452.0; // @\n    if (gray > 0.8) n = 11512810.0; // #\n\n    // get the mod..\n    vec2 modd = getMod(coord, vec2(pixelSize));\n\n    gl_FragColor = color * character( n, vec2(-1.0) + modd * 2.0);\n\n}\n",C=function(e){function t(t){void 0===t&&(t=8),e.call(this,_,b),this.size=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={size:{configurable:!0}};return n.size.get=function(){return this.uniforms.pixelSize},n.size.set=function(e){this.uniforms.pixelSize=e},Object.defineProperties(t.prototype,n),t}(t.Filter),S=a,F="precision mediump float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float transformX;\nuniform float transformY;\nuniform vec3 lightColor;\nuniform float lightAlpha;\nuniform vec3 shadowColor;\nuniform float shadowAlpha;\n\nvoid main(void) {\n    vec2 transform = vec2(1.0 / filterArea) * vec2(transformX, transformY);\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float light = texture2D(uSampler, vTextureCoord - transform).a;\n    float shadow = texture2D(uSampler, vTextureCoord + transform).a;\n\n    color.rgb = mix(color.rgb, lightColor, clamp((color.a - light) * lightAlpha, 0.0, 1.0));\n    color.rgb = mix(color.rgb, shadowColor, clamp((color.a - shadow) * shadowAlpha, 0.0, 1.0));\n    gl_FragColor = vec4(color.rgb * color.a, color.a);\n}\n",z=function(e){function t(t){void 0===t&&(t={}),e.call(this,S,F),this.uniforms.lightColor=new Float32Array(3),this.uniforms.shadowColor=new Float32Array(3),t=Object.assign({rotation:45,thickness:2,lightColor:16777215,lightAlpha:.7,shadowColor:0,shadowAlpha:.7},t),this.rotation=t.rotation,this.thickness=t.thickness,this.lightColor=t.lightColor,this.lightAlpha=t.lightAlpha,this.shadowColor=t.shadowColor,this.shadowAlpha=t.shadowAlpha}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var r={rotation:{configurable:!0},thickness:{configurable:!0},lightColor:{configurable:!0},lightAlpha:{configurable:!0},shadowColor:{configurable:!0},shadowAlpha:{configurable:!0}};return t.prototype._updateTransform=function(){this.uniforms.transformX=this._thickness*Math.cos(this._angle),this.uniforms.transformY=this._thickness*Math.sin(this._angle)},r.rotation.get=function(){return this._angle/n.DEG_TO_RAD},r.rotation.set=function(e){this._angle=e*n.DEG_TO_RAD,this._updateTransform()},r.thickness.get=function(){return this._thickness},r.thickness.set=function(e){this._thickness=e,this._updateTransform()},r.lightColor.get=function(){return o.rgb2hex(this.uniforms.lightColor)},r.lightColor.set=function(e){o.hex2rgb(e,this.uniforms.lightColor)},r.lightAlpha.get=function(){return this.uniforms.lightAlpha},r.lightAlpha.set=function(e){this.uniforms.lightAlpha=e},r.shadowColor.get=function(){return o.rgb2hex(this.uniforms.shadowColor)},r.shadowColor.set=function(e){o.hex2rgb(e,this.uniforms.shadowColor)},r.shadowAlpha.get=function(){return this.uniforms.shadowAlpha},r.shadowAlpha.set=function(e){this.uniforms.shadowAlpha=e},Object.defineProperties(t.prototype,r),t}(t.Filter),A=function(e){function t(t,o,a,u){var c,f;void 0===t&&(t=2),void 0===o&&(o=4),void 0===a&&(a=r.settings.RESOLUTION),void 0===u&&(u=5),e.call(this),"number"==typeof t?(c=t,f=t):t instanceof n.Point?(c=t.x,f=t.y):Array.isArray(t)&&(c=t[0],f=t[1]),this.blurXFilter=new s.BlurFilterPass(!0,c,o,a,u),this.blurYFilter=new s.BlurFilterPass(!1,f,o,a,u),this.blurYFilter.blendMode=i.BLEND_MODES.SCREEN,this.defaultFilter=new l.AlphaFilter}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var o={blur:{configurable:!0},blurX:{configurable:!0},blurY:{configurable:!0}};return t.prototype.apply=function(e,t,n){var r=e.getFilterTexture(!0);this.defaultFilter.apply(e,t,n),this.blurXFilter.apply(e,t,r),this.blurYFilter.apply(e,r,n),e.returnFilterTexture(r)},o.blur.get=function(){return this.blurXFilter.blur},o.blur.set=function(e){this.blurXFilter.blur=this.blurYFilter.blur=e},o.blurX.get=function(){return this.blurXFilter.blur},o.blurX.set=function(e){this.blurXFilter.blur=e},o.blurY.get=function(){return this.blurYFilter.blur},o.blurY.set=function(e){this.blurYFilter.blur=e},Object.defineProperties(t.prototype,o),t}(t.Filter),w=a,T="uniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nvarying vec2 vTextureCoord;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nvoid main()\n{\n    vec2 coord = vTextureCoord * filterArea.xy;\n    coord -= center * dimensions.xy;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius / distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center * dimensions.xy;\n    coord /= filterArea.xy;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    gl_FragColor = color;\n}\n",O=function(e){function t(t){if(e.call(this,w,T),"object"!=typeof t){var n=arguments[0],r=arguments[1],o=arguments[2];t={},void 0!==n&&(t.center=n),void 0!==r&&(t.radius=r),void 0!==o&&(t.strength=o)}this.uniforms.dimensions=new Float32Array(2),Object.assign(this,{center:[.5,.5],radius:100,strength:1},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={radius:{configurable:!0},strength:{configurable:!0},center:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.filterFrame.width,this.uniforms.dimensions[1]=t.filterFrame.height,e.applyFilter(this,t,n,r)},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e},n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e},Object.defineProperties(t.prototype,n),t}(t.Filter),D=a,P="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D colorMap;\nuniform float _mix;\nuniform float _size;\nuniform float _sliceSize;\nuniform float _slicePixelSize;\nuniform float _sliceInnerSize;\nvoid main() {\n    vec4 color = texture2D(uSampler, vTextureCoord.xy);\n\n    vec4 adjusted;\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n        float innerWidth = _size - 1.0;\n        float zSlice0 = min(floor(color.b * innerWidth), innerWidth);\n        float zSlice1 = min(zSlice0 + 1.0, innerWidth);\n        float xOffset = _slicePixelSize * 0.5 + color.r * _sliceInnerSize;\n        float s0 = xOffset + (zSlice0 * _sliceSize);\n        float s1 = xOffset + (zSlice1 * _sliceSize);\n        float yOffset = _sliceSize * 0.5 + color.g * (1.0 - _sliceSize);\n        vec4 slice0Color = texture2D(colorMap, vec2(s0,yOffset));\n        vec4 slice1Color = texture2D(colorMap, vec2(s1,yOffset));\n        float zOffset = fract(color.b * innerWidth);\n        adjusted = mix(slice0Color, slice1Color, zOffset);\n\n        color.rgb *= color.a;\n    }\n    gl_FragColor = vec4(mix(color, adjusted, _mix).rgb, color.a);\n\n}",M=function(e){function n(t,n,r){void 0===n&&(n=!1),void 0===r&&(r=1),e.call(this,D,P),this._size=0,this._sliceSize=0,this._slicePixelSize=0,this._sliceInnerSize=0,this._scaleMode=null,this._nearest=!1,this.nearest=n,this.mix=r,this.colorMap=t}e&&(n.__proto__=e),n.prototype=Object.create(e&&e.prototype),n.prototype.constructor=n;var r={colorSize:{configurable:!0},colorMap:{configurable:!0},nearest:{configurable:!0}};return n.prototype.apply=function(e,t,n,r){this.uniforms._mix=this.mix,e.applyFilter(this,t,n,r)},r.colorSize.get=function(){return this._size},r.colorMap.get=function(){return this._colorMap},r.colorMap.set=function(e){e instanceof t.Texture||(e=t.Texture.from(e)),e&&e.baseTexture&&(e.baseTexture.scaleMode=this._scaleMode,e.baseTexture.mipmap=!1,this._size=e.height,this._sliceSize=1/this._size,this._slicePixelSize=this._sliceSize/this._size,this._sliceInnerSize=this._slicePixelSize*(this._size-1),this.uniforms._size=this._size,this.uniforms._sliceSize=this._sliceSize,this.uniforms._slicePixelSize=this._slicePixelSize,this.uniforms._sliceInnerSize=this._sliceInnerSize,this.uniforms.colorMap=e),this._colorMap=e},r.nearest.get=function(){return this._nearest},r.nearest.set=function(e){this._nearest=e,this._scaleMode=e?i.SCALE_MODES.NEAREST:i.SCALE_MODES.LINEAR;var t=this._colorMap;t&&t.baseTexture&&(t.baseTexture._glTextures={},t.baseTexture.scaleMode=this._scaleMode,t.baseTexture.mipmap=!1,t._updateID++,t.baseTexture.emit("update",t.baseTexture))},n.prototype.updateColorMap=function(){var e=this._colorMap;e&&e.baseTexture&&(e._updateID++,e.baseTexture.emit("update",e.baseTexture),this.colorMap=e)},n.prototype.destroy=function(t){this._colorMap&&this._colorMap.destroy(t),e.prototype.destroy.call(this)},Object.defineProperties(n.prototype,r),n}(t.Filter),R=a,k="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 color;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorOverlay = color * currentColor.a;\n    gl_FragColor = vec4(colorOverlay.r, colorOverlay.g, colorOverlay.b, currentColor.a);\n}\n",j=function(e){function t(t){void 0===t&&(t=0),e.call(this,R,k),this.uniforms.color=new Float32Array(3),this.color=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={color:{configurable:!0}};return n.color.set=function(e){var t=this.uniforms.color;"number"==typeof e?(o.hex2rgb(e,t),this._color=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],this._color=o.rgb2hex(t))},n.color.get=function(){return this._color},Object.defineProperties(t.prototype,n),t}(t.Filter),E=a,L="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(uSampler, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n",I=function(e){function t(t,n,r){void 0===t&&(t=16711680),void 0===n&&(n=0),void 0===r&&(r=.4),e.call(this,E,L),this.uniforms.originalColor=new Float32Array(3),this.uniforms.newColor=new Float32Array(3),this.originalColor=t,this.newColor=n,this.epsilon=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={originalColor:{configurable:!0},newColor:{configurable:!0},epsilon:{configurable:!0}};return n.originalColor.set=function(e){var t=this.uniforms.originalColor;"number"==typeof e?(o.hex2rgb(e,t),this._originalColor=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],this._originalColor=o.rgb2hex(t))},n.originalColor.get=function(){return this._originalColor},n.newColor.set=function(e){var t=this.uniforms.newColor;"number"==typeof e?(o.hex2rgb(e,t),this._newColor=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],this._newColor=o.rgb2hex(t))},n.newColor.get=function(){return this._newColor},n.epsilon.set=function(e){this.uniforms.epsilon=e},n.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(t.prototype,n),t}(t.Filter),X=a,B="precision mediump float;\n\nvarying mediump vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec2 texelSize;\nuniform float matrix[9];\n\nvoid main(void)\n{\n   vec4 c11 = texture2D(uSampler, vTextureCoord - texelSize); // top left\n   vec4 c12 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - texelSize.y)); // top center\n   vec4 c13 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y - texelSize.y)); // top right\n\n   vec4 c21 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y)); // mid left\n   vec4 c22 = texture2D(uSampler, vTextureCoord); // mid center\n   vec4 c23 = texture2D(uSampler, vec2(vTextureCoord.x + texelSize.x, vTextureCoord.y)); // mid right\n\n   vec4 c31 = texture2D(uSampler, vec2(vTextureCoord.x - texelSize.x, vTextureCoord.y + texelSize.y)); // bottom left\n   vec4 c32 = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + texelSize.y)); // bottom center\n   vec4 c33 = texture2D(uSampler, vTextureCoord + texelSize); // bottom right\n\n   gl_FragColor =\n       c11 * matrix[0] + c12 * matrix[1] + c13 * matrix[2] +\n       c21 * matrix[3] + c22 * matrix[4] + c23 * matrix[5] +\n       c31 * matrix[6] + c32 * matrix[7] + c33 * matrix[8];\n\n   gl_FragColor.a = c22.a;\n}\n",N=function(e){function t(t,n,r){void 0===n&&(n=200),void 0===r&&(r=200),e.call(this,X,B),this.uniforms.texelSize=new Float32Array(2),this.uniforms.matrix=new Float32Array(9),void 0!==t&&(this.matrix=t),this.width=n,this.height=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={matrix:{configurable:!0},width:{configurable:!0},height:{configurable:!0}};return n.matrix.get=function(){return this.uniforms.matrix},n.matrix.set=function(e){var t=this;e.forEach(function(e,n){return t.uniforms.matrix[n]=e})},n.width.get=function(){return 1/this.uniforms.texelSize[0]},n.width.set=function(e){this.uniforms.texelSize[0]=1/e},n.height.get=function(){return 1/this.uniforms.texelSize[1]},n.height.set=function(e){this.uniforms.texelSize[1]=1/e},Object.defineProperties(t.prototype,n),t}(t.Filter),G=a,q="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);\n\n    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);\n\n    if (lum < 1.00)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.75)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.50)\n    {\n        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n\n    if (lum < 0.3)\n    {\n        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0)\n        {\n            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);\n        }\n    }\n}\n",W=function(e){function t(){e.call(this,G,q)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t}(t.Filter),K=a,Y="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nconst float SQRT_2 = 1.414213;\n\nconst float light = 1.0;\n\nuniform float curvature;\nuniform float lineWidth;\nuniform float lineContrast;\nuniform bool verticalLine;\nuniform float noise;\nuniform float noiseSize;\n\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\n\nuniform float seed;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    vec2 dir = vec2(coord - vec2(0.5, 0.5));\n\n    float _c = curvature > 0. ? curvature : 1.;\n    float k = curvature > 0. ?(length(dir * dir) * 0.25 * _c * _c + 0.935 * _c) : 1.;\n    vec2 uv = dir * k;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 rgb = gl_FragColor.rgb;\n\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        rgb += _noise * noise;\n    }\n\n    if (lineWidth > 0.0) {\n        float v = (verticalLine ? uv.x * dimensions.x : uv.y * dimensions.y) * min(1.0, 2.0 / lineWidth ) / _c;\n        float j = 1. + cos(v * 1.2 - time) * 0.5 * lineContrast;\n        rgb *= j;\n        float segment = verticalLine ? mod((dir.x + .5) * dimensions.x, 4.) : mod((dir.y + .5) * dimensions.y, 4.);\n        rgb *= 0.99 + ceil(segment) * 0.015;\n    }\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    gl_FragColor.rgb = rgb;\n}\n",Z=function(e){function t(t){e.call(this,K,Y),this.uniforms.dimensions=new Float32Array(2),this.time=0,this.seed=0,Object.assign(this,{curvature:1,lineWidth:1,lineContrast:.25,verticalLine:!1,noise:0,noiseSize:1,seed:0,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3,time:0},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={curvature:{configurable:!0},lineWidth:{configurable:!0},lineContrast:{configurable:!0},verticalLine:{configurable:!0},noise:{configurable:!0},noiseSize:{configurable:!0},vignetting:{configurable:!0},vignettingAlpha:{configurable:!0},vignettingBlur:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.filterFrame.width,this.uniforms.dimensions[1]=t.filterFrame.height,this.uniforms.seed=this.seed,this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},n.curvature.set=function(e){this.uniforms.curvature=e},n.curvature.get=function(){return this.uniforms.curvature},n.lineWidth.set=function(e){this.uniforms.lineWidth=e},n.lineWidth.get=function(){return this.uniforms.lineWidth},n.lineContrast.set=function(e){this.uniforms.lineContrast=e},n.lineContrast.get=function(){return this.uniforms.lineContrast},n.verticalLine.set=function(e){this.uniforms.verticalLine=e},n.verticalLine.get=function(){return this.uniforms.verticalLine},n.noise.set=function(e){this.uniforms.noise=e},n.noise.get=function(){return this.uniforms.noise},n.noiseSize.set=function(e){this.uniforms.noiseSize=e},n.noiseSize.get=function(){return this.uniforms.noiseSize},n.vignetting.set=function(e){this.uniforms.vignetting=e},n.vignetting.get=function(){return this.uniforms.vignetting},n.vignettingAlpha.set=function(e){this.uniforms.vignettingAlpha=e},n.vignettingAlpha.get=function(){return this.uniforms.vignettingAlpha},n.vignettingBlur.set=function(e){this.uniforms.vignettingBlur=e},n.vignettingBlur.get=function(){return this.uniforms.vignettingBlur},Object.defineProperties(t.prototype,n),t}(t.Filter),Q=a,U="precision mediump float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform vec4 filterArea;\nuniform sampler2D uSampler;\n\nuniform float angle;\nuniform float scale;\n\nfloat pattern()\n{\n   float s = sin(angle), c = cos(angle);\n   vec2 tex = vTextureCoord * filterArea.xy;\n   vec2 point = vec2(\n       c * tex.x - s * tex.y,\n       s * tex.x + c * tex.y\n   ) * scale;\n   return (sin(point.x) * sin(point.y)) * 4.0;\n}\n\nvoid main()\n{\n   vec4 color = texture2D(uSampler, vTextureCoord);\n   float average = (color.r + color.g + color.b) / 3.0;\n   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);\n}\n",V=function(e){function t(t,n){void 0===t&&(t=1),void 0===n&&(n=5),e.call(this,Q,U),this.scale=t,this.angle=n}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={scale:{configurable:!0},angle:{configurable:!0}};return n.scale.get=function(){return this.uniforms.scale},n.scale.set=function(e){this.uniforms.scale=e},n.angle.get=function(){return this.uniforms.angle},n.angle.set=function(e){this.uniforms.angle=e},Object.defineProperties(t.prototype,n),t}(t.Filter),H=a,$="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float alpha;\nuniform vec3 color;\n\nuniform vec2 shift;\nuniform vec4 inputSize;\n\nvoid main(void){\n    vec4 sample = texture2D(uSampler, vTextureCoord - shift * inputSize.zw);\n\n    // Premultiply alpha\n    sample.rgb = color.rgb * sample.a;\n\n    // alpha user alpha\n    sample *= alpha;\n\n    gl_FragColor = sample;\n}",J=function(e){function t(t){t&&t.constructor!==Object&&(console.warn("DropShadowFilter now uses options instead of (rotation, distance, blur, color, alpha)"),t={rotation:t},void 0!==arguments[1]&&(t.distance=arguments[1]),void 0!==arguments[2]&&(t.blur=arguments[2]),void 0!==arguments[3]&&(t.color=arguments[3]),void 0!==arguments[4]&&(t.alpha=arguments[4])),t=Object.assign({rotation:45,distance:5,color:0,alpha:.5,shadowOnly:!1,kernels:null,blur:2,quality:3,pixelSize:1,resolution:r.settings.RESOLUTION},t),e.call(this);var o=t.kernels,i=t.blur,l=t.quality,s=t.pixelSize,a=t.resolution;this._tintFilter=new e(H,$),this._tintFilter.uniforms.color=new Float32Array(4),this._tintFilter.uniforms.shift=new n.Point,this._tintFilter.resolution=a,this._blurFilter=o?new d(o):new d(i,l),this.pixelSize=s,this.resolution=a;var u=t.shadowOnly,c=t.rotation,f=t.distance,h=t.alpha,p=t.color;this.shadowOnly=u,this.rotation=c,this.distance=f,this.alpha=h,this.color=p,this._updatePadding()}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var i={resolution:{configurable:!0},distance:{configurable:!0},rotation:{configurable:!0},alpha:{configurable:!0},color:{configurable:!0},kernels:{configurable:!0},blur:{configurable:!0},quality:{configurable:!0},pixelSize:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){var o=e.getFilterTexture();this._tintFilter.apply(e,t,o,1),this._blurFilter.apply(e,o,n,r),!0!==this.shadowOnly&&e.applyFilter(this,t,n,0),e.returnFilterTexture(o)},t.prototype._updatePadding=function(){this.padding=this.distance+2*this.blur},t.prototype._updateShift=function(){this._tintFilter.uniforms.shift.set(this.distance*Math.cos(this.angle),this.distance*Math.sin(this.angle))},i.resolution.get=function(){return this._resolution},i.resolution.set=function(e){this._resolution=e,this._tintFilter&&(this._tintFilter.resolution=e),this._blurFilter&&(this._blurFilter.resolution=e)},i.distance.get=function(){return this._distance},i.distance.set=function(e){this._distance=e,this._updatePadding(),this._updateShift()},i.rotation.get=function(){return this.angle/n.DEG_TO_RAD},i.rotation.set=function(e){this.angle=e*n.DEG_TO_RAD,this._updateShift()},i.alpha.get=function(){return this._tintFilter.uniforms.alpha},i.alpha.set=function(e){this._tintFilter.uniforms.alpha=e},i.color.get=function(){return o.rgb2hex(this._tintFilter.uniforms.color)},i.color.set=function(e){o.hex2rgb(e,this._tintFilter.uniforms.color)},i.kernels.get=function(){return this._blurFilter.kernels},i.kernels.set=function(e){this._blurFilter.kernels=e},i.blur.get=function(){return this._blurFilter.blur},i.blur.set=function(e){this._blurFilter.blur=e,this._updatePadding()},i.quality.get=function(){return this._blurFilter.quality},i.quality.set=function(e){this._blurFilter.quality=e},i.pixelSize.get=function(){return this._blurFilter.pixelSize},i.pixelSize.set=function(e){this._blurFilter.pixelSize=e},Object.defineProperties(t.prototype,i),t}(t.Filter),ee=a,te="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float strength;\nuniform vec4 filterArea;\n\n\nvoid main(void)\n{\n\tvec2 onePixel = vec2(1.0 / filterArea);\n\n\tvec4 color;\n\n\tcolor.rgb = vec3(0.5);\n\n\tcolor -= texture2D(uSampler, vTextureCoord - onePixel) * strength;\n\tcolor += texture2D(uSampler, vTextureCoord + onePixel) * strength;\n\n\tcolor.rgb = vec3((color.r + color.g + color.b) / 3.0);\n\n\tfloat alpha = texture2D(uSampler, vTextureCoord).a;\n\n\tgl_FragColor = vec4(color.rgb * alpha, alpha);\n}\n",ne=function(e){function t(t){void 0===t&&(t=5),e.call(this,ee,te),this.strength=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={strength:{configurable:!0}};return n.strength.get=function(){return this.uniforms.strength},n.strength.set=function(e){this.uniforms.strength=e},Object.defineProperties(t.prototype,n),t}(t.Filter),re=a,oe="// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n",ie=function(e){function r(n){void 0===n&&(n={}),e.call(this,re,oe),this.uniforms.dimensions=new Float32Array(2),n=Object.assign({slices:5,offset:100,direction:0,fillMode:0,average:!1,seed:0,red:[0,0],green:[0,0],blue:[0,0],minSize:8,sampleSize:512},n),this.direction=n.direction,this.red=n.red,this.green=n.green,this.blue=n.blue,this.offset=n.offset,this.fillMode=n.fillMode,this.average=n.average,this.seed=n.seed,this.minSize=n.minSize,this.sampleSize=n.sampleSize,this._canvas=document.createElement("canvas"),this._canvas.width=4,this._canvas.height=this.sampleSize,this.texture=t.Texture.from(this._canvas,{scaleMode:i.SCALE_MODES.NEAREST}),this._slices=0,this.slices=n.slices}e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r;var o={sizes:{configurable:!0},offsets:{configurable:!0},slices:{configurable:!0},direction:{configurable:!0},red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return r.prototype.apply=function(e,t,n,r){var o=t.filterFrame.width,i=t.filterFrame.height;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=i,this.uniforms.aspect=i/o,this.uniforms.seed=this.seed,this.uniforms.offset=this.offset,this.uniforms.fillMode=this.fillMode,e.applyFilter(this,t,n,r)},r.prototype._randomizeSizes=function(){var e=this._sizes,t=this._slices-1,n=this.sampleSize,r=Math.min(this.minSize/n,.9/this._slices);if(this.average){for(var o=this._slices,i=1,l=0;l<t;l++){var s=i/(o-l),a=Math.max(s*(1-.6*Math.random()),r);e[l]=a,i-=a}e[t]=i}else{for(var u=1,c=Math.sqrt(1/this._slices),f=0;f<t;f++){var h=Math.max(c*u*Math.random(),r);e[f]=h,u-=h}e[t]=u}this.shuffle()},r.prototype.shuffle=function(){for(var e=this._sizes,t=this._slices-1;t>0;t--){var n=Math.random()*t>>0,r=e[t];e[t]=e[n],e[n]=r}},r.prototype._randomizeOffsets=function(){for(var e=0;e<this._slices;e++)this._offsets[e]=Math.random()*(Math.random()<.5?-1:1)},r.prototype.refresh=function(){this._randomizeSizes(),this._randomizeOffsets(),this.redraw()},r.prototype.redraw=function(){var e,t=this.sampleSize,n=this.texture,r=this._canvas.getContext("2d");r.clearRect(0,0,8,t);for(var o=0,i=0;i<this._slices;i++){e=Math.floor(256*this._offsets[i]);var l=this._sizes[i]*t,s=e>0?e:0,a=e<0?-e:0;r.fillStyle="rgba("+s+", "+a+", 0, 1)",r.fillRect(0,o>>0,t,l+1>>0),o+=l}n.baseTexture.update(),this.uniforms.displacementMap=n},o.sizes.set=function(e){for(var t=Math.min(this._slices,e.length),n=0;n<t;n++)this._sizes[n]=e[n]},o.sizes.get=function(){return this._sizes},o.offsets.set=function(e){for(var t=Math.min(this._slices,e.length),n=0;n<t;n++)this._offsets[n]=e[n]},o.offsets.get=function(){return this._offsets},o.slices.get=function(){return this._slices},o.slices.set=function(e){this._slices!==e&&(this._slices=e,this.uniforms.slices=e,this._sizes=this.uniforms.slicesWidth=new Float32Array(e),this._offsets=this.uniforms.slicesOffset=new Float32Array(e),this.refresh())},o.direction.get=function(){return this._direction},o.direction.set=function(e){if(this._direction!==e){this._direction=e;var t=e*n.DEG_TO_RAD;this.uniforms.sinDir=Math.sin(t),this.uniforms.cosDir=Math.cos(t)}},o.red.get=function(){return this.uniforms.red},o.red.set=function(e){this.uniforms.red=e},o.green.get=function(){return this.uniforms.green},o.green.set=function(e){this.uniforms.green=e},o.blue.get=function(){return this.uniforms.blue},o.blue.set=function(e){this.uniforms.blue=e},r.prototype.destroy=function(){this.texture.destroy(!0),this.texture=null,this._canvas=null,this.red=null,this.green=null,this.blue=null,this._sizes=null,this._offsets=null},Object.defineProperties(r.prototype,o),r}(t.Filter);ie.TRANSPARENT=0,ie.ORIGINAL=1,ie.LOOP=2,ie.CLAMP=3,ie.MIRROR=4;var le=a,se="varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float outerStrength;\nuniform float innerStrength;\n\nuniform vec4 glowColor;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform bool knockout;\n\nconst float PI = 3.14159265358979323846264;\n\nconst float DIST = __DIST__;\nconst float ANGLE_STEP_SIZE = min(__ANGLE_STEP_SIZE__, PI * 2.0);\nconst float ANGLE_STEP_NUM = ceil(PI * 2.0 / ANGLE_STEP_SIZE);\n\nconst float MAX_TOTAL_ALPHA = ANGLE_STEP_NUM * DIST * (DIST + 1.0) / 2.0;\n\nvoid main(void) {\n    vec2 px = vec2(1.0 / filterArea.x, 1.0 / filterArea.y);\n\n    float totalAlpha = 0.0;\n\n    vec2 direction;\n    vec2 displaced;\n    vec4 curColor;\n\n    for (float angle = 0.0; angle < PI * 2.0; angle += ANGLE_STEP_SIZE) {\n       direction = vec2(cos(angle), sin(angle)) * px;\n\n       for (float curDistance = 0.0; curDistance < DIST; curDistance++) {\n           displaced = clamp(vTextureCoord + direction * \n                   (curDistance + 1.0), filterClamp.xy, filterClamp.zw);\n\n           curColor = texture2D(uSampler, displaced);\n\n           totalAlpha += (DIST - curDistance) * curColor.a;\n       }\n    }\n    \n    curColor = texture2D(uSampler, vTextureCoord);\n\n    float alphaRatio = (totalAlpha / MAX_TOTAL_ALPHA);\n\n    float innerGlowAlpha = (1.0 - alphaRatio) * innerStrength * curColor.a;\n    float innerGlowStrength = min(1.0, innerGlowAlpha);\n    \n    vec4 innerColor = mix(curColor, glowColor, innerGlowStrength);\n\n    float outerGlowAlpha = alphaRatio * outerStrength * (1. - curColor.a);\n    float outerGlowStrength = min(1.0 - innerColor.a, outerGlowAlpha);\n\n    vec4 outerGlowColor = outerGlowStrength * glowColor.rgba;\n    \n    if (knockout) {\n      float resultAlpha = outerGlowAlpha + innerGlowAlpha;\n      gl_FragColor = vec4(glowColor.rgb * resultAlpha, resultAlpha);\n    }\n    else {\n      gl_FragColor = innerColor + outerGlowColor;\n    }\n}\n",ae=function(e){function t(n){var r=Object.assign({},t.defaults,n),o=r.distance,i=r.outerStrength,l=r.innerStrength,s=r.color,a=r.knockout,u=r.quality;o=Math.round(o),e.call(this,le,se.replace(/__ANGLE_STEP_SIZE__/gi,""+(1/u/o).toFixed(7)).replace(/__DIST__/gi,o.toFixed(0)+".0")),this.uniforms.glowColor=new Float32Array([0,0,0,1]),Object.assign(this,{color:s,outerStrength:i,innerStrength:l,padding:o,knockout:a})}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={color:{configurable:!0},outerStrength:{configurable:!0},innerStrength:{configurable:!0},knockout:{configurable:!0}};return n.color.get=function(){return o.rgb2hex(this.uniforms.glowColor)},n.color.set=function(e){o.hex2rgb(e,this.uniforms.glowColor)},n.outerStrength.get=function(){return this.uniforms.outerStrength},n.outerStrength.set=function(e){this.uniforms.outerStrength=e},n.innerStrength.get=function(){return this.uniforms.innerStrength},n.innerStrength.set=function(e){this.uniforms.innerStrength=e},n.knockout.get=function(){return this.uniforms.knockout},n.knockout.set=function(e){this.uniforms.knockout=e},Object.defineProperties(t.prototype,n),t}(t.Filter);ae.defaults={distance:10,outerStrength:4,innerStrength:0,color:16777215,quality:.1,knockout:!1};var ue=a,ce="vec3 mod289(vec3 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 mod289(vec4 x)\n{\n    return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec4 permute(vec4 x)\n{\n    return mod289(((x * 34.0) + 1.0) * x);\n}\nvec4 taylorInvSqrt(vec4 r)\n{\n    return 1.79284291400159 - 0.85373472095314 * r;\n}\nvec3 fade(vec3 t)\n{\n    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);\n}\n// Classic Perlin noise, periodic variant\nfloat pnoise(vec3 P, vec3 rep)\n{\n    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period\n    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period\n    Pi0 = mod289(Pi0);\n    Pi1 = mod289(Pi1);\n    vec3 Pf0 = fract(P); // Fractional part for interpolation\n    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n    vec4 iy = vec4(Pi0.yy, Pi1.yy);\n    vec4 iz0 = Pi0.zzzz;\n    vec4 iz1 = Pi1.zzzz;\n    vec4 ixy = permute(permute(ix) + iy);\n    vec4 ixy0 = permute(ixy + iz0);\n    vec4 ixy1 = permute(ixy + iz1);\n    vec4 gx0 = ixy0 * (1.0 / 7.0);\n    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;\n    gx0 = fract(gx0);\n    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n    vec4 sz0 = step(gz0, vec4(0.0));\n    gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n    gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n    vec4 gx1 = ixy1 * (1.0 / 7.0);\n    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;\n    gx1 = fract(gx1);\n    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n    vec4 sz1 = step(gz1, vec4(0.0));\n    gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n    gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n    vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);\n    vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);\n    vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);\n    vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);\n    vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);\n    vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);\n    vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);\n    vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);\n    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n    g000 *= norm0.x;\n    g010 *= norm0.y;\n    g100 *= norm0.z;\n    g110 *= norm0.w;\n    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n    g001 *= norm1.x;\n    g011 *= norm1.y;\n    g101 *= norm1.z;\n    g111 *= norm1.w;\n    float n000 = dot(g000, Pf0);\n    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n    float n111 = dot(g111, Pf1);\n    vec3 fade_xyz = fade(Pf0);\n    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);\n    return 2.2 * n_xyz;\n}\nfloat turb(vec3 P, vec3 rep, float lacunarity, float gain)\n{\n    float sum = 0.0;\n    float sc = 1.0;\n    float totalgain = 1.0;\n    for (float i = 0.0; i < 6.0; i++)\n    {\n        sum += totalgain * pnoise(P * sc, rep);\n        sc *= lacunarity;\n        totalgain *= gain;\n    }\n    return abs(sum);\n}\n",fe="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform vec2 light;\nuniform bool parallel;\nuniform float aspect;\n\nuniform float gain;\nuniform float lacunarity;\nuniform float time;\n\n${perlin}\n\nvoid main(void) {\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    float d;\n\n    if (parallel) {\n        float _cos = light.x;\n        float _sin = light.y;\n        d = (_cos * coord.x) + (_sin * coord.y * aspect);\n    } else {\n        float dx = coord.x - light.x / dimensions.x;\n        float dy = (coord.y - light.y / dimensions.y) * aspect;\n        float dis = sqrt(dx * dx + dy * dy) + 0.00001;\n        d = dy / dis;\n    }\n\n    vec3 dir = vec3(d, d, 0.0);\n\n    float noise = turb(dir + vec3(time, 0.0, 62.1 + time) * 0.05, vec3(480.0, 320.0, 480.0), lacunarity, gain);\n    noise = mix(noise, 0.0, 0.3);\n    //fade vertically.\n    vec4 mist = vec4(noise, noise, noise, 1.0) * (1.0 - coord.y);\n    mist.a = 1.0;\n\n    gl_FragColor = texture2D(uSampler, vTextureCoord) + mist;\n}\n",he=function(e){function t(t){e.call(this,ue,fe.replace("${perlin}",ce)),this.uniforms.dimensions=new Float32Array(2),"number"==typeof t&&(console.warn("GodrayFilter now uses options instead of (angle, gain, lacunarity, time)"),t={angle:t},void 0!==arguments[1]&&(t.gain=arguments[1]),void 0!==arguments[2]&&(t.lacunarity=arguments[2]),void 0!==arguments[3]&&(t.time=arguments[3])),t=Object.assign({angle:30,gain:.5,lacunarity:2.5,time:0,parallel:!0,center:[0,0]},t),this._angleLight=new n.Point,this.angle=t.angle,this.gain=t.gain,this.lacunarity=t.lacunarity,this.parallel=t.parallel,this.center=t.center,this.time=t.time}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var r={angle:{configurable:!0},gain:{configurable:!0},lacunarity:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){var o=t.filterFrame,i=o.width,l=o.height;this.uniforms.light=this.parallel?this._angleLight:this.center,this.uniforms.parallel=this.parallel,this.uniforms.dimensions[0]=i,this.uniforms.dimensions[1]=l,this.uniforms.aspect=l/i,this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},r.angle.get=function(){return this._angle},r.angle.set=function(e){this._angle=e;var t=e*n.DEG_TO_RAD;this._angleLight.x=Math.cos(t),this._angleLight.y=Math.sin(t)},r.gain.get=function(){return this.uniforms.gain},r.gain.set=function(e){this.uniforms.gain=e},r.lacunarity.get=function(){return this.uniforms.lacunarity},r.lacunarity.set=function(e){this.uniforms.lacunarity=e},Object.defineProperties(t.prototype,r),t}(t.Filter),pe=a,de="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uVelocity;\nuniform int uKernelSize;\nuniform float uOffset;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\n// Notice:\n// the perfect way:\n//    int kernelSize = min(uKernelSize, MAX_KERNELSIZE);\n// BUT in real use-case , uKernelSize < MAX_KERNELSIZE almost always.\n// So use uKernelSize directly.\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    vec2 velocity = uVelocity / filterArea.xy;\n    float offset = -uOffset / length(uVelocity) - 0.5;\n    int k = uKernelSize - 1;\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n        vec2 bias = velocity * (float(i) / float(k) + offset);\n        color += texture2D(uSampler, vTextureCoord + bias);\n    }\n    gl_FragColor = color / float(uKernelSize);\n}\n",me=function(e){function t(t,r,o){void 0===t&&(t=[0,0]),void 0===r&&(r=5),void 0===o&&(o=0),e.call(this,pe,de),this.uniforms.uVelocity=new Float32Array(2),this._velocity=new n.ObservablePoint(this.velocityChanged,this),this.velocity=t,this.kernelSize=r,this.offset=o}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var r={velocity:{configurable:!0},offset:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){var o=this.velocity,i=o.x,l=o.y;this.uniforms.uKernelSize=0!==i||0!==l?this.kernelSize:0,e.applyFilter(this,t,n,r)},r.velocity.set=function(e){Array.isArray(e)?this._velocity.set(e[0],e[1]):(e instanceof n.Point||e instanceof n.ObservablePoint)&&this._velocity.copyFrom(e)},r.velocity.get=function(){return this._velocity},t.prototype.velocityChanged=function(){this.uniforms.uVelocity[0]=this._velocity.x,this.uniforms.uVelocity[1]=this._velocity.y},r.offset.set=function(e){this.uniforms.uOffset=e},r.offset.get=function(){return this.uniforms.uOffset},Object.defineProperties(t.prototype,r),t}(t.Filter),ge=a,ve="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float epsilon;\n\nconst int MAX_COLORS = %maxColors%;\n\nuniform vec3 originalColors[MAX_COLORS];\nuniform vec3 targetColors[MAX_COLORS];\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n\n    float alpha = gl_FragColor.a;\n    if (alpha < 0.0001)\n    {\n      return;\n    }\n\n    vec3 color = gl_FragColor.rgb / alpha;\n\n    for(int i = 0; i < MAX_COLORS; i++)\n    {\n      vec3 origColor = originalColors[i];\n      if (origColor.r < 0.0)\n      {\n        break;\n      }\n      vec3 colorDiff = origColor - color;\n      if (length(colorDiff) < epsilon)\n      {\n        vec3 targetColor = targetColors[i];\n        gl_FragColor = vec4((targetColor + colorDiff) * alpha, alpha);\n        return;\n      }\n    }\n}\n",xe=function(e){function t(t,n,r){void 0===n&&(n=.05),void 0===r&&(r=null),r=r||t.length,e.call(this,ge,ve.replace(/%maxColors%/g,r)),this.epsilon=n,this._maxColors=r,this._replacements=null,this.uniforms.originalColors=new Float32Array(3*r),this.uniforms.targetColors=new Float32Array(3*r),this.replacements=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={replacements:{configurable:!0},maxColors:{configurable:!0},epsilon:{configurable:!0}};return n.replacements.set=function(e){var t=this.uniforms.originalColors,n=this.uniforms.targetColors,r=e.length;if(r>this._maxColors)throw"Length of replacements ("+r+") exceeds the maximum colors length ("+this._maxColors+")";t[3*r]=-1;for(var i=0;i<r;i++){var l=e[i],s=l[0];"number"==typeof s?s=o.hex2rgb(s):l[0]=o.rgb2hex(s),t[3*i]=s[0],t[3*i+1]=s[1],t[3*i+2]=s[2];var a=l[1];"number"==typeof a?a=o.hex2rgb(a):l[1]=o.rgb2hex(a),n[3*i]=a[0],n[3*i+1]=a[1],n[3*i+2]=a[2]}this._replacements=e},n.replacements.get=function(){return this._replacements},t.prototype.refresh=function(){this.replacements=this._replacements},n.maxColors.get=function(){return this._maxColors},n.epsilon.set=function(e){this.uniforms.epsilon=e},n.epsilon.get=function(){return this.uniforms.epsilon},Object.defineProperties(t.prototype,n),t}(t.Filter),ye=a,_e="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\n\nuniform float sepia;\nuniform float noise;\nuniform float noiseSize;\nuniform float scratch;\nuniform float scratchDensity;\nuniform float scratchWidth;\nuniform float vignetting;\nuniform float vignettingAlpha;\nuniform float vignettingBlur;\nuniform float seed;\n\nconst float SQRT_2 = 1.414213;\nconst vec3 SEPIA_RGB = vec3(112.0 / 255.0, 66.0 / 255.0, 20.0 / 255.0);\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvec3 Overlay(vec3 src, vec3 dst)\n{\n    // if (dst <= 0.5) then: 2 * src * dst\n    // if (dst > 0.5) then: 1 - 2 * (1 - dst) * (1 - src)\n    return vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)),\n                (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)),\n                (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)));\n}\n\n\nvoid main()\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord);\n    vec3 color = gl_FragColor.rgb;\n\n    if (sepia > 0.0)\n    {\n        float gray = (color.x + color.y + color.z) / 3.0;\n        vec3 grayscale = vec3(gray);\n\n        color = Overlay(SEPIA_RGB, grayscale);\n\n        color = grayscale + sepia * (color - grayscale);\n    }\n\n    vec2 coord = vTextureCoord * filterArea.xy / dimensions.xy;\n\n    if (vignetting > 0.0)\n    {\n        float outter = SQRT_2 - vignetting * SQRT_2;\n        vec2 dir = vec2(vec2(0.5, 0.5) - coord);\n        dir.y *= dimensions.y / dimensions.x;\n        float darker = clamp((outter - length(dir) * SQRT_2) / ( 0.00001 + vignettingBlur * SQRT_2), 0.0, 1.0);\n        color.rgb *= darker + (1.0 - darker) * (1.0 - vignettingAlpha);\n    }\n\n    if (scratchDensity > seed && scratch != 0.0)\n    {\n        float phase = seed * 256.0;\n        float s = mod(floor(phase), 2.0);\n        float dist = 1.0 / scratchDensity;\n        float d = distance(coord, vec2(seed * dist, abs(s - seed * dist)));\n        if (d < seed * 0.6 + 0.4)\n        {\n            highp float period = scratchDensity * 10.0;\n\n            float xx = coord.x * period + phase;\n            float aa = abs(mod(xx, 0.5) * 4.0);\n            float bb = mod(floor(xx / 0.5), 2.0);\n            float yy = (1.0 - bb) * aa + bb * (2.0 - aa);\n\n            float kk = 2.0 * period;\n            float dw = scratchWidth / dimensions.x * (0.75 + seed);\n            float dh = dw * kk;\n\n            float tine = (yy - (2.0 - dh));\n\n            if (tine > 0.0) {\n                float _sign = sign(scratch);\n\n                tine = s * tine / period + scratch + 0.1;\n                tine = clamp(tine + 1.0, 0.5 + _sign * 0.5, 1.5 + _sign * 0.5);\n\n                color.rgb *= tine;\n            }\n        }\n    }\n\n    if (noise > 0.0 && noiseSize > 0.0)\n    {\n        vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n        pixelCoord.x = floor(pixelCoord.x / noiseSize);\n        pixelCoord.y = floor(pixelCoord.y / noiseSize);\n        // vec2 d = pixelCoord * noiseSize * vec2(1024.0 + seed * 512.0, 1024.0 - seed * 512.0);\n        // float _noise = snoise(d) * 0.5;\n        float _noise = rand(pixelCoord * noiseSize * seed) - 0.5;\n        color += _noise * noise;\n    }\n\n    gl_FragColor.rgb = color;\n}\n",be=function(e){function t(t,n){void 0===n&&(n=0),e.call(this,ye,_e),this.uniforms.dimensions=new Float32Array(2),"number"==typeof t?(this.seed=t,t=null):this.seed=n,Object.assign(this,{sepia:.3,noise:.3,noiseSize:1,scratch:.5,scratchDensity:.3,scratchWidth:1,vignetting:.3,vignettingAlpha:1,vignettingBlur:.3},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={sepia:{configurable:!0},noise:{configurable:!0},noiseSize:{configurable:!0},scratch:{configurable:!0},scratchDensity:{configurable:!0},scratchWidth:{configurable:!0},vignetting:{configurable:!0},vignettingAlpha:{configurable:!0},vignettingBlur:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.filterFrame.width,this.uniforms.dimensions[1]=t.filterFrame.height,this.uniforms.seed=this.seed,e.applyFilter(this,t,n,r)},n.sepia.set=function(e){this.uniforms.sepia=e},n.sepia.get=function(){return this.uniforms.sepia},n.noise.set=function(e){this.uniforms.noise=e},n.noise.get=function(){return this.uniforms.noise},n.noiseSize.set=function(e){this.uniforms.noiseSize=e},n.noiseSize.get=function(){return this.uniforms.noiseSize},n.scratch.set=function(e){this.uniforms.scratch=e},n.scratch.get=function(){return this.uniforms.scratch},n.scratchDensity.set=function(e){this.uniforms.scratchDensity=e},n.scratchDensity.get=function(){return this.uniforms.scratchDensity},n.scratchWidth.set=function(e){this.uniforms.scratchWidth=e},n.scratchWidth.get=function(){return this.uniforms.scratchWidth},n.vignetting.set=function(e){this.uniforms.vignetting=e},n.vignetting.get=function(){return this.uniforms.vignetting},n.vignettingAlpha.set=function(e){this.uniforms.vignettingAlpha=e},n.vignettingAlpha.get=function(){return this.uniforms.vignettingAlpha},n.vignettingBlur.set=function(e){this.uniforms.vignettingBlur=e},n.vignettingBlur.get=function(){return this.uniforms.vignettingBlur},Object.defineProperties(t.prototype,n),t}(t.Filter),Ce=a,Se="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec2 thickness;\nuniform vec4 outlineColor;\nuniform vec4 filterClamp;\n\nconst float DOUBLE_PI = 3.14159265358979323846264 * 2.;\n\nvoid main(void) {\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    vec2 displaced;\n    for (float angle = 0.; angle <= DOUBLE_PI; angle += ${angleStep}) {\n        displaced.x = vTextureCoord.x + thickness.x * cos(angle);\n        displaced.y = vTextureCoord.y + thickness.y * sin(angle);\n        curColor = texture2D(uSampler, clamp(displaced, filterClamp.xy, filterClamp.zw));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n",Fe=function(e){function t(n,r,o){void 0===n&&(n=1),void 0===r&&(r=0),void 0===o&&(o=.1);var i=Math.max(o*t.MAX_SAMPLES,t.MIN_SAMPLES),l=(2*Math.PI/i).toFixed(7);e.call(this,Ce,Se.replace(/\$\{angleStep\}/,l)),this.uniforms.thickness=new Float32Array([0,0]),this.thickness=n,this.uniforms.outlineColor=new Float32Array([0,0,0,1]),this.color=r,this.quality=o}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={color:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.thickness[0]=this.thickness/t._frame.width,this.uniforms.thickness[1]=this.thickness/t._frame.height,e.applyFilter(this,t,n,r)},n.color.get=function(){return o.rgb2hex(this.uniforms.outlineColor)},n.color.set=function(e){o.hex2rgb(e,this.uniforms.outlineColor)},Object.defineProperties(t.prototype,n),t}(t.Filter);Fe.MIN_SAMPLES=1,Fe.MAX_SAMPLES=100;var ze=a,Ae="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform vec2 size;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 pixelate(vec2 coord, vec2 size)\n{\n\treturn floor( coord / size ) * size;\n}\n\nvoid main(void)\n{\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = pixelate(coord, size);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord);\n}\n",we=function(e){function t(t){void 0===t&&(t=10),e.call(this,ze,Ae),this.size=t}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={size:{configurable:!0}};return n.size.get=function(){return this.uniforms.size},n.size.set=function(e){"number"==typeof e&&(e=[e,e]),this.uniforms.size=e},Object.defineProperties(t.prototype,n),t}(t.Filter),Te=a,Oe="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform float uRadian;\nuniform vec2 uCenter;\nuniform float uRadius;\nuniform int uKernelSize;\n\nconst int MAX_KERNEL_SIZE = 2048;\n\nvoid main(void)\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n\n    if (uKernelSize == 0)\n    {\n        gl_FragColor = color;\n        return;\n    }\n\n    float aspect = filterArea.y / filterArea.x;\n    vec2 center = uCenter.xy / filterArea.xy;\n    float gradient = uRadius / filterArea.x * 0.3;\n    float radius = uRadius / filterArea.x - gradient * 0.5;\n    int k = uKernelSize - 1;\n\n    vec2 coord = vTextureCoord;\n    vec2 dir = vec2(center - coord);\n    float dist = length(vec2(dir.x, dir.y * aspect));\n\n    float radianStep = uRadian;\n    if (radius >= 0.0 && dist > radius) {\n        float delta = dist - radius;\n        float gap = gradient;\n        float scale = 1.0 - abs(delta / gap);\n        if (scale <= 0.0) {\n            gl_FragColor = color;\n            return;\n        }\n        radianStep *= scale;\n    }\n    radianStep /= float(k);\n\n    float s = sin(radianStep);\n    float c = cos(radianStep);\n    mat2 rotationMatrix = mat2(vec2(c, -s), vec2(s, c));\n\n    for(int i = 0; i < MAX_KERNEL_SIZE - 1; i++) {\n        if (i == k) {\n            break;\n        }\n\n        coord -= center;\n        coord.y *= aspect;\n        coord = rotationMatrix * coord;\n        coord.y /= aspect;\n        coord += center;\n\n        vec4 sample = texture2D(uSampler, coord);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample;\n    }\n\n    gl_FragColor = color / float(uKernelSize);\n}\n",De=function(e){function t(t,n,r,o){void 0===t&&(t=0),void 0===n&&(n=[0,0]),void 0===r&&(r=5),void 0===o&&(o=-1),e.call(this,Te,Oe),this._angle=0,this.angle=t,this.center=n,this.kernelSize=r,this.radius=o}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={angle:{configurable:!0},center:{configurable:!0},radius:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.uKernelSize=0!==this._angle?this.kernelSize:0,e.applyFilter(this,t,n,r)},n.angle.set=function(e){this._angle=e,this.uniforms.uRadian=e*Math.PI/180},n.angle.get=function(){return this._angle},n.center.get=function(){return this.uniforms.uCenter},n.center.set=function(e){this.uniforms.uCenter=e},n.radius.get=function(){return this.uniforms.uRadius},n.radius.set=function(e){(e<0||e===1/0)&&(e=-1),this.uniforms.uRadius=e},Object.defineProperties(t.prototype,n),t}(t.Filter),Pe=a,Me="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\n\nuniform bool mirror;\nuniform float boundary;\nuniform vec2 amplitude;\nuniform vec2 waveLength;\nuniform vec2 alpha;\nuniform float time;\n\nfloat rand(vec2 co) {\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main(void)\n{\n    vec2 pixelCoord = vTextureCoord.xy * filterArea.xy;\n    vec2 coord = pixelCoord / dimensions;\n\n    if (coord.y < boundary) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    float k = (coord.y - boundary) / (1. - boundary + 0.0001);\n    float areaY = boundary * dimensions.y / filterArea.y;\n    float v = areaY + areaY - vTextureCoord.y;\n    float y = mirror ? v : vTextureCoord.y;\n\n    float _amplitude = ((amplitude.y - amplitude.x) * k + amplitude.x ) / filterArea.x;\n    float _waveLength = ((waveLength.y - waveLength.x) * k + waveLength.x) / filterArea.y;\n    float _alpha = (alpha.y - alpha.x) * k + alpha.x;\n\n    float x = vTextureCoord.x + cos(v * 6.28 / _waveLength - time) * _amplitude;\n    x = clamp(x, filterClamp.x, filterClamp.z);\n\n    vec4 color = texture2D(uSampler, vec2(x, y));\n\n    gl_FragColor = color * _alpha;\n}\n",Re=function(e){function t(t){e.call(this,Pe,Me),this.uniforms.amplitude=new Float32Array(2),this.uniforms.waveLength=new Float32Array(2),this.uniforms.alpha=new Float32Array(2),this.uniforms.dimensions=new Float32Array(2),Object.assign(this,{mirror:!0,boundary:.5,amplitude:[0,20],waveLength:[30,100],alpha:[1,1],time:0},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={mirror:{configurable:!0},boundary:{configurable:!0},amplitude:{configurable:!0},waveLength:{configurable:!0},alpha:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.filterFrame.width,this.uniforms.dimensions[1]=t.filterFrame.height,this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},n.mirror.set=function(e){this.uniforms.mirror=e},n.mirror.get=function(){return this.uniforms.mirror},n.boundary.set=function(e){this.uniforms.boundary=e},n.boundary.get=function(){return this.uniforms.boundary},n.amplitude.set=function(e){this.uniforms.amplitude[0]=e[0],this.uniforms.amplitude[1]=e[1]},n.amplitude.get=function(){return this.uniforms.amplitude},n.waveLength.set=function(e){this.uniforms.waveLength[0]=e[0],this.uniforms.waveLength[1]=e[1]},n.waveLength.get=function(){return this.uniforms.waveLength},n.alpha.set=function(e){this.uniforms.alpha[0]=e[0],this.uniforms.alpha[1]=e[1]},n.alpha.get=function(){return this.uniforms.alpha},Object.defineProperties(t.prototype,n),t}(t.Filter),ke=a,je="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",Ee=function(e){function t(t,n,r){void 0===t&&(t=[-10,0]),void 0===n&&(n=[0,10]),void 0===r&&(r=[0,0]),e.call(this,ke,je),this.red=t,this.green=n,this.blue=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return n.red.get=function(){return this.uniforms.red},n.red.set=function(e){this.uniforms.red=e},n.green.get=function(){return this.uniforms.green},n.green.set=function(e){this.uniforms.green=e},n.blue.get=function(){return this.uniforms.blue},n.blue.set=function(e){this.uniforms.blue=e},Object.defineProperties(t.prototype,n),t}(t.Filter),Le=a,Ie="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n\n    gl_FragColor = color;\n}\n",Xe=function(e){function t(t,n,r){void 0===t&&(t=[0,0]),void 0===n&&(n={}),void 0===r&&(r=0),e.call(this,Le,Ie),this.center=t,Array.isArray(n)&&(console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."),n={}),n=Object.assign({amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1},n),this.amplitude=n.amplitude,this.wavelength=n.wavelength,this.brightness=n.brightness,this.speed=n.speed,this.radius=n.radius,this.time=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={center:{configurable:!0},amplitude:{configurable:!0},wavelength:{configurable:!0},brightness:{configurable:!0},speed:{configurable:!0},radius:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},n.center.get=function(){return this.uniforms.center},n.center.set=function(e){this.uniforms.center=e},n.amplitude.get=function(){return this.uniforms.amplitude},n.amplitude.set=function(e){this.uniforms.amplitude=e},n.wavelength.get=function(){return this.uniforms.wavelength},n.wavelength.set=function(e){this.uniforms.wavelength=e},n.brightness.get=function(){return this.uniforms.brightness},n.brightness.set=function(e){this.uniforms.brightness=e},n.speed.get=function(){return this.uniforms.speed},n.speed.set=function(e){this.uniforms.speed=e},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e},Object.defineProperties(t.prototype,n),t}(t.Filter),Be=a,Ne="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform sampler2D uLightmap;\nuniform vec4 filterArea;\nuniform vec2 dimensions;\nuniform vec4 ambientColor;\nvoid main() {\n    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);\n    vec2 lightCoord = (vTextureCoord * filterArea.xy) / dimensions;\n    vec4 light = texture2D(uLightmap, lightCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vec4(finalColor, diffuseColor.a);\n}\n",Ge=function(e){function t(t,n,r){void 0===n&&(n=0),void 0===r&&(r=1),e.call(this,Be,Ne),this.uniforms.dimensions=new Float32Array(2),this.uniforms.ambientColor=new Float32Array([0,0,0,r]),this.texture=t,this.color=n}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={texture:{configurable:!0},color:{configurable:!0},alpha:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.dimensions[0]=t.filterFrame.width,this.uniforms.dimensions[1]=t.filterFrame.height,e.applyFilter(this,t,n,r)},n.texture.get=function(){return this.uniforms.uLightmap},n.texture.set=function(e){this.uniforms.uLightmap=e},n.color.set=function(e){var t=this.uniforms.ambientColor;"number"==typeof e?(o.hex2rgb(e,t),this._color=e):(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],this._color=o.rgb2hex(t))},n.color.get=function(){return this._color},n.alpha.get=function(){return this.uniforms.ambientColor[3]},n.alpha.set=function(e){this.uniforms.ambientColor[3]=e},Object.defineProperties(t.prototype,n),t}(t.Filter),qe=a,We="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float blur;\nuniform float gradientBlur;\nuniform vec2 start;\nuniform vec2 end;\nuniform vec2 delta;\nuniform vec2 texSize;\n\nfloat random(vec3 scale, float seed)\n{\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main(void)\n{\n    vec4 color = vec4(0.0);\n    float total = 0.0;\n\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n    vec2 normal = normalize(vec2(start.y - end.y, end.x - start.x));\n    float radius = smoothstep(0.0, 1.0, abs(dot(vTextureCoord * texSize - start, normal)) / gradientBlur) * blur;\n\n    for (float t = -30.0; t <= 30.0; t++)\n    {\n        float percent = (t + offset - 0.5) / 30.0;\n        float weight = 1.0 - abs(percent);\n        vec4 sample = texture2D(uSampler, vTextureCoord + delta / texSize * percent * radius);\n        sample.rgb *= sample.a;\n        color += sample * weight;\n        total += weight;\n    }\n\n    color /= total;\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n",Ke=function(e){function t(t,r,o,i){void 0===t&&(t=100),void 0===r&&(r=600),void 0===o&&(o=null),void 0===i&&(i=null),e.call(this,qe,We),this.uniforms.blur=t,this.uniforms.gradientBlur=r,this.uniforms.start=o||new n.Point(0,window.innerHeight/2),this.uniforms.end=i||new n.Point(600,window.innerHeight/2),this.uniforms.delta=new n.Point(30,30),this.uniforms.texSize=new n.Point(1024,1024),this.updateDelta()}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var r={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return t.prototype.updateDelta=function(){this.uniforms.delta.x=0,this.uniforms.delta.y=0},r.blur.get=function(){return this.uniforms.blur},r.blur.set=function(e){this.uniforms.blur=e},r.gradientBlur.get=function(){return this.uniforms.gradientBlur},r.gradientBlur.set=function(e){this.uniforms.gradientBlur=e},r.start.get=function(){return this.uniforms.start},r.start.set=function(e){this.uniforms.start=e,this.updateDelta()},r.end.get=function(){return this.uniforms.end},r.end.set=function(e){this.uniforms.end=e,this.updateDelta()},Object.defineProperties(t.prototype,r),t}(t.Filter),Ye=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.updateDelta=function(){var e=this.uniforms.end.x-this.uniforms.start.x,t=this.uniforms.end.y-this.uniforms.start.y,n=Math.sqrt(e*e+t*t);this.uniforms.delta.x=e/n,this.uniforms.delta.y=t/n},t}(Ke),Ze=function(e){function t(){e.apply(this,arguments)}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.updateDelta=function(){var e=this.uniforms.end.x-this.uniforms.start.x,t=this.uniforms.end.y-this.uniforms.start.y,n=Math.sqrt(e*e+t*t);this.uniforms.delta.x=-t/n,this.uniforms.delta.y=e/n},t}(Ke),Qe=function(e){function t(t,n,r,o){void 0===t&&(t=100),void 0===n&&(n=600),void 0===r&&(r=null),void 0===o&&(o=null),e.call(this),this.tiltShiftXFilter=new Ye(t,n,r,o),this.tiltShiftYFilter=new Ze(t,n,r,o)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={blur:{configurable:!0},gradientBlur:{configurable:!0},start:{configurable:!0},end:{configurable:!0}};return t.prototype.apply=function(e,t,n){var r=e.getFilterTexture();this.tiltShiftXFilter.apply(e,t,r),this.tiltShiftYFilter.apply(e,r,n),e.returnFilterTexture(r)},n.blur.get=function(){return this.tiltShiftXFilter.blur},n.blur.set=function(e){this.tiltShiftXFilter.blur=this.tiltShiftYFilter.blur=e},n.gradientBlur.get=function(){return this.tiltShiftXFilter.gradientBlur},n.gradientBlur.set=function(e){this.tiltShiftXFilter.gradientBlur=this.tiltShiftYFilter.gradientBlur=e},n.start.get=function(){return this.tiltShiftXFilter.start},n.start.set=function(e){this.tiltShiftXFilter.start=this.tiltShiftYFilter.start=e},n.end.get=function(){return this.tiltShiftXFilter.end},n.end.set=function(e){this.tiltShiftXFilter.end=this.tiltShiftYFilter.end=e},Object.defineProperties(t.prototype,n),t}(t.Filter),Ue=a,Ve="varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float radius;\nuniform float angle;\nuniform vec2 offset;\nuniform vec4 filterArea;\n\nvec2 mapCoord( vec2 coord )\n{\n    coord *= filterArea.xy;\n    coord += filterArea.zw;\n\n    return coord;\n}\n\nvec2 unmapCoord( vec2 coord )\n{\n    coord -= filterArea.zw;\n    coord /= filterArea.xy;\n\n    return coord;\n}\n\nvec2 twist(vec2 coord)\n{\n    coord -= offset;\n\n    float dist = length(coord);\n\n    if (dist < radius)\n    {\n        float ratioDist = (radius - dist) / radius;\n        float angleMod = ratioDist * ratioDist * angle;\n        float s = sin(angleMod);\n        float c = cos(angleMod);\n        coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);\n    }\n\n    coord += offset;\n\n    return coord;\n}\n\nvoid main(void)\n{\n\n    vec2 coord = mapCoord(vTextureCoord);\n\n    coord = twist(coord);\n\n    coord = unmapCoord(coord);\n\n    gl_FragColor = texture2D(uSampler, coord );\n\n}\n",He=function(e){function t(t,n,r){void 0===t&&(t=200),void 0===n&&(n=4),void 0===r&&(r=20),e.call(this,Ue,Ve),this.radius=t,this.angle=n,this.padding=r}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={offset:{configurable:!0},radius:{configurable:!0},angle:{configurable:!0}};return n.offset.get=function(){return this.uniforms.offset},n.offset.set=function(e){this.uniforms.offset=e},n.radius.get=function(){return this.uniforms.radius},n.radius.set=function(e){this.uniforms.radius=e},n.angle.get=function(){return this.uniforms.angle},n.angle.set=function(e){this.uniforms.angle=e},Object.defineProperties(t.prototype,n),t}(t.Filter),$e=a,Je="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\n// author: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand(vec2 co, float seed) {\n    const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n    highp float dt = dot(co + seed, vec2(a, b)), sn = mod(dt, 3.14159);\n    return fract(sin(sn) * c + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = rand(vTextureCoord, 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    color /= total;\n    // switch back from pre-multiplied alpha\n    // color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n",et=function(e){function t(t){if(e.call(this,$e,Je),"object"!=typeof t){var n=arguments[0],r=arguments[1],o=arguments[2],i=arguments[3];t={},void 0!==n&&(t.strength=n),void 0!==r&&(t.center=r),void 0!==o&&(t.innerRadius=o),void 0!==i&&(t.radius=i)}Object.assign(this,{strength:.1,center:[0,0],innerRadius:0,radius:-1},t)}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var n={center:{configurable:!0},strength:{configurable:!0},innerRadius:{configurable:!0},radius:{configurable:!0}};return n.center.get=function(){return this.uniforms.uCenter},n.center.set=function(e){this.uniforms.uCenter=e},n.strength.get=function(){return this.uniforms.uStrength},n.strength.set=function(e){this.uniforms.uStrength=e},n.innerRadius.get=function(){return this.uniforms.uInnerRadius},n.innerRadius.set=function(e){this.uniforms.uInnerRadius=e},n.radius.get=function(){return this.uniforms.uRadius},n.radius.set=function(e){(e<0||e===1/0)&&(e=-1),this.uniforms.uRadius=e},Object.defineProperties(t.prototype,n),t}(t.Filter);return e.AdjustmentFilter=c,e.AdvancedBloomFilter=y,e.AsciiFilter=C,e.BevelFilter=z,e.BloomFilter=A,e.BulgePinchFilter=O,e.CRTFilter=Z,e.ColorMapFilter=M,e.ColorOverlayFilter=j,e.ColorReplaceFilter=I,e.ConvolutionFilter=N,e.CrossHatchFilter=W,e.DotFilter=V,e.DropShadowFilter=J,e.EmbossFilter=ne,e.GlitchFilter=ie,e.GlowFilter=ae,e.GodrayFilter=he,e.KawaseBlurFilter=d,e.MotionBlurFilter=me,e.MultiColorReplaceFilter=xe,e.OldFilmFilter=be,e.OutlineFilter=Fe,e.PixelateFilter=we,e.RGBSplitFilter=Ee,e.RadialBlurFilter=De,e.ReflectionFilter=Re,e.ShockwaveFilter=Xe,e.SimpleLightmapFilter=Ge,e.TiltShiftAxisFilter=Ke,e.TiltShiftFilter=Qe,e.TiltShiftXFilter=Ye,e.TiltShiftYFilter=Ze,e.TwistFilter=He,e.ZoomBlurFilter=et,e}({},PIXI,PIXI,PIXI,PIXI.utils,PIXI,PIXI.filters,PIXI.filters);Object.assign(PIXI.filters,__filters);
/*# sourceMappingURL=pixi-filters.js.map*/
}
//=============================================================================
//
//=============================================================================
//=============================================================================
//Sprite_ParticleContainerQJ
//=============================================================================
function Sprite_ParticleContainerQJ() {
    this.initialize(...arguments);
}
Sprite_ParticleContainerQJ.prototype = Object.create(PIXI.ParticleContainer.prototype);
Sprite_ParticleContainerQJ.prototype.constructor = Sprite_ParticleContainerQJ;
Sprite_ParticleContainerQJ.prototype.initialize = function(data = {}) {
    PIXI.ParticleContainer.call(this,data.maxNumber||10000,{
        rotation:data.rotation||true,
        scale:data.scale||true,
        alpha:data.alpha||true,
        uvs:data.uvs||true
    });
};
Sprite_ParticleContainerQJ.prototype.destroy = function() {
    PIXI.ParticleContainer.prototype.destroy.call(this,{
        children: true
    });
};
Sprite_ParticleContainerQJ.prototype.update = function() {
    this.children.forEach(function(child) {
        if (child.update) {
            child.update();
        }
    });
};
//=============================================================================
//Sprite_ParticleContainerQJ
//=============================================================================
function Sprite_ParticleShatterQJ() {
    this.initialize(...arguments);
}
Sprite_ParticleShatterQJ.prototype = Object.create(Sprite_ParticleContainerQJ.prototype);
Sprite_ParticleShatterQJ.prototype.constructor = Sprite_ParticleShatterQJ;
Sprite_ParticleShatterQJ.prototype.initialize = function(baseTexture,frame = '0|0~90/30~30/600') {//baseTexture or renderTexture
    Sprite_ParticleContainerQJ.prototype.initialize.call(this,{
        rotation:false,
        scale:false,
        alpha:false,
        uvs:true,
        maxNumber:40000
    });
    this._particlesCol = 50;
    this._particlesRow = 50;
    this._anchorX = 0.5;
    this._anchorY = 0.5;
    this._sx = -baseTexture.width*this._anchorX;
    this._sy = -baseTexture.height*this._anchorY;
    this._ex = baseTexture.width*(1-this._anchorX);
    this._ey = baseTexture.height*(1-this._anchorY);
    this._bitWidth=baseTexture.width/this._particlesCol;
    this._bitHeight=baseTexture.height/this._particlesRow;
    for (let i=0,il=this._particlesCol,bitWidth=this._bitWidth,sx=this._sx;i<il;i++) {
        for (let j=0,jl=this._particlesRow,bitHeight=this._bitHeight,sy=this._sy;j<jl;j++) {
            let newTexture = new PIXI.Texture(baseTexture);
            newTexture.frame = new Rectangle(i*bitWidth,j*bitHeight,bitWidth,bitHeight);
            let newSprite = new PIXI.Sprite(newTexture);
            newSprite.x = sx+i*bitWidth;
            newSprite.y = sy+j*bitHeight;
            newSprite.ox = newSprite.x;
            newSprite.oy = newSprite.y;
            newSprite.moveRotationX = -1;
            newSprite.moveRotationY = 1;
            newSprite._xIndex = i;
            newSprite._yIndex = j;
            this.addChild(newSprite);
        }
    }
    this._speedAnimation = new DEFrameQJ(null,frame,0);
};
Sprite_ParticleShatterQJ.prototype.update = function() {
    let speedDir = this._speedAnimation.get();
    this.children.forEach((child)=>{
        if (child) {
            child.x += 0.01*speedDir*(child._xIndex-this._particlesCol/2);
            child.y += 0.01*speedDir*(child._yIndex-this._particlesRow/2);
            /*child.x += this._bitWidth*Math.random()*child.moveRotationX;
            if (child.x>=this._ex*0.5) child.moveRotationX = -1;
            else if (child.x<=this._sx*0.5) child.moveRotationX = 1;
            child.y += this._bitHeight*Math.random()*child.moveRotationY;
            if (child.y>=this._ey*0.5) child.moveRotationY = -1;
            else if (child.y<=this._sy*0.5) child.moveRotationY = 1;*/
        }
    });
};
//=============================================================================
//Sprite_ParticleContainerQJ
//=============================================================================
function Sprite_ParticleShatter2QJ() {
    this.initialize(...arguments);
}
Sprite_ParticleShatter2QJ.prototype = Object.create(Sprite_ParticleContainerQJ.prototype);
Sprite_ParticleShatter2QJ.prototype.constructor = Sprite_ParticleShatter2QJ;
Sprite_ParticleShatter2QJ.prototype.initialize = function(baseTexture,frame1 = '0|0~80/5',frame2 = '0|1~20/0.3~60/0') {//baseTexture or renderTexture
    Sprite_ParticleContainerQJ.prototype.initialize.call(this,{
        rotation:false,
        scale:false,
        alpha:true,
        uvs:true,
        maxNumber:40000
    });
    this._particlesCol = 18;
    this._particlesRow = 18;
    this._anchorX = 0.5;
    this._anchorY = 0.5;
    this._sx = -baseTexture.width*this._anchorX;
    this._sy = -baseTexture.height*this._anchorY;
    this._ex = baseTexture.width*(1-this._anchorX);
    this._ey = baseTexture.height*(1-this._anchorY);
    this._bitWidth=baseTexture.width/this._particlesCol;
    this._bitHeight=baseTexture.height/this._particlesRow;
    for (let i=0,il=this._particlesCol,bitWidth=this._bitWidth,sx=this._sx;i<il;i++) {
        for (let j=0,jl=this._particlesRow,bitHeight=this._bitHeight,sy=this._sy;j<jl;j++) {
            let newTexture = new PIXI.Texture(baseTexture);
            newTexture.frame = new Rectangle(i*bitWidth,j*bitHeight,bitWidth,bitHeight);
            let newSprite = new PIXI.Sprite(newTexture);
            newSprite.x = sx+i*bitWidth;
            newSprite.y = sy+j*bitHeight;
            newSprite.ox = newSprite.x;
            newSprite.oy = newSprite.y;
            newSprite.moveRotationX = -1;
            newSprite.moveRotationY = 1;
            newSprite._xIndex = i;
            newSprite._yIndex = j;
            this.addChild(newSprite);
        }
    }
    this._offsetAnimation = new DEFrameQJ(null,frame1,0);
    this._alphaAnimation = new DEFrameQJ(null,frame2,0);
};
Sprite_ParticleShatter2QJ.prototype.update = function() {
    let offsetDir = this._offsetAnimation.get();
    let alphaDir = this._alphaAnimation.get();
    this.children.forEach((child)=>{
        if (child) {
            child.x = child.ox + offsetDir*(child._xIndex-this._particlesCol/2)
            child.y = child.oy + offsetDir*(child._yIndex-this._particlesRow/2)
            child.alpha = alphaDir;
        }
    });
};
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================
//=============================================================================
//
//=============================================================================