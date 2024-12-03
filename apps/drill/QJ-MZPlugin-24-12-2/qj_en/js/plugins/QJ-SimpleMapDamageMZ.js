//=============================================================================
//QJ-SimpleMapDamage.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc [Simple Map Damage][22-4-30]
 * @author Qiu Jiu
 * @help
 * QJ-SimpleMapDamage.js
 *
 * a simple plugin for generating image of damage number.
 * need damageQJ.png under img/system下。
 *
 * SimpleMapDamageQJ.put(index,eventId,number,ox,oy);
 *
 * index:，what line of img/system/damageQJ.png are the damage is
 * eventId: -1 refer to player, 0 refer to current event.
 * number: value of damage
 * ox: offset x
 * oy: offset y, -96 by default
 *
 * @param lineNum
 * @type number
 * @text max lines of damageQJ.png
 * @min 1
 * @default 6
 *
*/

/*:zh
 * @target MZ
 * @plugindesc [简易地图伤害数字][22-4-30]
 * @author Qiu Jiu
 * @help
 * QJ-SimpleMapDamage.js
 *
 * 一个极度简单的伤害显示插件。
 * 需要将一个名叫damageQJ.png的图片放在img/system下。
 *
 * SimpleMapDamageQJ.put(index,eventId,number,ox,oy);
 *
 * index:行数，img/system/damageQJ.png图中第几行的伤害数字
 * eventId:显示在谁的头顶上，写-1时代表玩家，写0时代表当前事件
 * number:伤害数字
 * ox:起始点x偏移
 * oy:起始点y偏移，默认为-96
 *
 * @param lineNum
 * @type number
 * @text damageQJ.png图片横线最大行数
 * @min 1
 * @default 6
 *
*/
//=============================================================================
// 
//=============================================================================
const SimpleMapDamageQJ = {
    damageTextList:[],
    saveDamagePosition:[
        [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
        [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
        [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
        [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
        [0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],
        [0,-2],[0,-4],[0,-6],[0,-8],[0,-10],[0,-12],[0,-14],[0,-16],[0,-18],[0,-20],[0,-22],[0,-24],[0,-26],
    ],
    createTexture:function(bitmap) {
        return QJ.createTexture(bitmap);
    },
    baseTexture:null,
    put:function(index,eventId,number,ox = 0,oy = -96) {
        if (eventId==-1) {
            ox+=$gamePlayer.screenX()+$gameMap.displayX()*48;
            oy+=$gamePlayer.screenY()+$gameMap.displayY()*48;
        } else {
            if (eventId==0) eventId = QJ.getPointerId();
            if ($gameMap.event(eventId)) {
                ox+=$gameMap.event(eventId).screenX()+$gameMap.displayX()*48;
                oy+=$gameMap.event(eventId).screenY()+$gameMap.displayY()*48;
            } else {
                return;
            }
        }
        SimpleMapDamageQJ.damageTextList.push([index,typeof number == "number"?number:null,ox,oy]);
    }
};
//=============================================================================
//
//=============================================================================
SimpleMapDamageQJ.Spriteset_Map_createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
Spriteset_Map.prototype.createUpperLayer = function() {
    SimpleMapDamageQJ.Spriteset_Map_createUpperLayer.apply(this,arguments);
    this.createSimpleMapDamageQJ();
};
Spriteset_Map.prototype.createSimpleMapDamageQJ = function() {
    let sprite = new Spriteset_SimpleMapDamageQJ();
    this._simpleMapDamageQJ = sprite;
    this.addChild(sprite);
}
//=============================================================================
//
//=============================================================================
function Spriteset_SimpleMapDamageQJ() {
    this.initialize(...arguments);
}
Spriteset_SimpleMapDamageQJ.prototype = Object.create(PIXI.ParticleContainer.prototype);
Spriteset_SimpleMapDamageQJ.prototype.constructor = Spriteset_SimpleMapDamageQJ;
Spriteset_SimpleMapDamageQJ.prototype.initialize = function() {
    PIXI.ParticleContainer.call(this,10000,{
        rotation:false,
        scale:true,
        alpha:true,
        uvs:true
    });
    let parameters = PluginManager.parameters("QJ-SimpleMapDamageMZ.js");
    let lineNum = parameters?Number(parameters.lineNum||6):6;
    if (isNaN(lineNum) || !lineNum) lineNum = 6;
    if (!SimpleMapDamageQJ.baseTexture) {
        ImageManager.loadSystem("damageQJ").addLoadListener((bit)=>{
            SimpleMapDamageQJ.baseTexture = SimpleMapDamageQJ.createTexture(bit);
            this._saveDamageTextTexture = SimpleMapDamageQJ.baseTexture;
            this._kSize = [this._saveDamageTextTexture.width/10,this._saveDamageTextTexture.height/lineNum];
            SimpleMapDamageQJ.damageTextList = [];
        });
    } else {
        this._saveDamageTextTexture = SimpleMapDamageQJ.baseTexture;
        this._kSize = [this._saveDamageTextTexture.width/10,this._saveDamageTextTexture.height/lineNum];
        SimpleMapDamageQJ.damageTextList = [];
    }
};
Spriteset_SimpleMapDamageQJ.prototype.destroy = function() {
    PIXI.ParticleContainer.prototype.destroy.call(this,{
        children: true
    });
};
Spriteset_SimpleMapDamageQJ.prototype.update = function() {
    if (!this._saveDamageTextTexture) {
        return;
    }
    while (SimpleMapDamageQJ.damageTextList.length>0) {
        this.createNewDamageText(SimpleMapDamageQJ.damageTextList.shift());
    }
    let dx = $gameMap.displayX()*48;
    let dy = $gameMap.displayY()*48;
    this.children.forEach((child)=>{
        if (child) {
            this.updateDamage(child,dx,dy);
        }
    });
};
Spriteset_SimpleMapDamageQJ.prototype.pi = Math.PI*2/3;
Spriteset_SimpleMapDamageQJ.prototype.createNewDamageText = function(data) {
    let ro = Math.random()*this.pi-this.pi/2;
    let moveStep = [5*Math.sin(ro),-5*Math.cos(ro)];
    if (data[1]==null) {
        let rect = new PIXI.Rectangle(0,this._kSize[1]*data[0],this._kSize[0]*10,this._kSize[1]);
        let texture = new PIXI.Texture(this._saveDamageTextTexture,rect);
        let sprite = new PIXI.Sprite(texture);
        sprite.anchor.x = 0.5;
        sprite.anchor.y = 1;
        sprite.time = -1;
        sprite._data = [data[2],data[3]-this._kSize[1]];
        sprite.scale.set(0.8,0.8);
        sprite.moveStep = moveStep;
        this.addChild(sprite);
    } else {
        for (let stringData=String(data[1]),il=stringData.length,sx=-il*this._kSize[0]/2,i=0;i<il;i++) {
            let detail = Number(stringData[i]);
            let rect = new PIXI.Rectangle(detail*this._kSize[0],this._kSize[1]*data[0],this._kSize[0],this._kSize[1]);
            let texture = new PIXI.Texture(this._saveDamageTextTexture,rect);
            let sprite = new PIXI.Sprite(texture);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 1;
            sprite.time = -1;
            sprite._data = [data[2]+sx+i*this._kSize[0],data[3]];
            sprite.scale.set(0.8,0.8);
            sprite.moveStep = moveStep;
            this.addChild(sprite);
        }
    }
};
Spriteset_SimpleMapDamageQJ.prototype.updateDamage = function(child,dx,dy) {
    child.time++;
    if (child.time===25) {
        child.destroy();
    } else if (child.time<=4) {
        child.scale.set(child.scale.x+0.2/4,child.scale.y+0.2/4);
        child.position.set(
            child._data[0]+child.time*child.moveStep[0]-dx,
            child._data[1]+child.time*child.moveStep[1]-dy);
    } else if (child.time<=10) {
        child.scale.set(child.scale.x+0.2/6,child.scale.y+0.2/6);
    } else if (child.time<=20) {
        //nothing
    } else if (child.time<=25) {
        child.alpha -= 1/5;
        child.scale.set(child.scale.x+1/5,child.scale.y+1/5);
    }

    /*if (child.time>=40) {
        child.destroy();
    } else {
        child.x = child._data[0] + child.time*child.moveStep[0] - dx;
        child.y = child._data[1] + child.time*child.moveStep[1] - dy;
        if (child.time>=20) {
            child.alpha = 1 - (child.time-20)/20;
        }
        //child.x = child._data[0]+SimpleMapDamageQJ.saveDamagePosition[child.time][0]-dx;
        //child.y = child._data[1]+SimpleMapDamageQJ.saveDamagePosition[child.time][1]-dy;
        child._data[3]+=child._data[2];
        if (child.time>=SimpleMapDamageQJ.saveDamagePosition.length*2/3) {
            child.alpha -= 3/SimpleMapDamageQJ.saveDamagePosition.length;
        }
    }*/
};
//=============================================================================
//
//=============================================================================