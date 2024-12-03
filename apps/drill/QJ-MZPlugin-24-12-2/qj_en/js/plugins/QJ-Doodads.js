//==========================================================
// RPG Maker MZ
//==========================================================
/*:
 * @target MZ
 * @plugindesc [Doodads][V1.3]
 * @author Qiu Jiu
 *
 *
 * @help
 * ============================================================================
 * Menu:
 *Ⅰ-> Notice
 *Ⅱ-> Introduction
 *Ⅲ-> Features And Simple Description
 *Ⅳ-> The terms of use
 * ============================================================================
 * ⅠNotice:
 * 1.The detail help is in the file QJ-Doodads-Help.docx in Demo.
 *   The Demo can be found in page :
 *   https://forums.rpgmakerweb.com/index.php?threads/rmmz-grid-free-doodads-work-with-my-lighting-plugin-dramatic-shadow.145387/
 *   https://qiujiu.itch.io/doodads
 * 2.This plugin can read the doodads data of VisuMZ_2_DoodadsSystem/VisuMZ_3_DoodadsEditor, then the data will
 *   be translated to the new format.VisuMZ_2_DoodadsSystem/VisuMZ_3_DoodadsEditor can no longer read the new format
 *   of data.
 *   You need to change the plugin parameter Data File Name to Doodads to load the data of VS` doodads plugin.
 * 3.Because I offer the more powerful attribute Condition and you can input js code as you want, I abandon the attribute Party.
 * 4.This plugin can work with UM7(Blizzard`s UltraMode7), please put this plugin after UltraMode7.
 * 5.This plugin can work with QJ-Lighting, please put this plugin before it.
 *   https://forums.rpgmakerweb.com/index.php?threads/rmmv-rmmz-dynamic-light-ultra-shadow-event-shadow-particle.144763/
 * ============================================================================
 * Ⅱ.Introduction:
 * It`s a doodads plugin for MZ, the main purpose is to replace the obfuscated VisuMZ Doodads plugin.
 * I add the more features and design a more easy-to-use editor.
 * What`s more, other plugins can be extended based on the doodads plugin.
 * ============================================================================
 * Ⅲ.Features (But Not Limited To) And Simple Description:
 * 1.The editor in game. But it only works when in Windows or mac.
 * 2.Place doodads free of grid or lock them to grid when press alt.
 *   You can quickly arrange doodads with grids.
 * 3.Apply a variety of settings to doodads and they can be input directly!
 * 4.Ket Delete, Ctrl C and Ctrl V can be used when editing the doodads.
 *   Select multiple doodads at once to move them.
 * 5.The image of doodads can be IconSet, current map tilesets and specail image. 
 *   The frame of IconSet and tilesets can be free based on the grid 32/48!
 * 6.The doodads can be animated. (xFrame yFrame FrameUpdate)
 * ============================================================================
 * Ⅳ.The terms of use:
 * This plugin is below MIT License.
 * This plugin is free for non-commercial and commercial use.
 * ============================================================================
 *
 * @param chaos
 * @default
 *
 * @param editKey
 * @type select
 * @text editor key
 * @desc the key to open the editor.
 * @default F10
 * @parent chaos
 * @option F1
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 *
 * @param folderName
 * @type text
 * @text folder url
 * @desc the folder in img/
 * @default doodads/
 * @parent chaos
 *
 * @param dataFileName
 * @type text
 * @text Data File Name
 * @desc Data File`s Name.You can change this to Doodads to read VS`s doodads data directly.
 * @default DoodadsQJ
 * @parent chaos
 *
 * @param editorMode
 * @type boolean
 * @text editor Mode
 * @desc editorMode
 * @default true
 * @parent chaos
 *
 * @param doodadScaleMode
 * @type boolean
 * @text doodad scale mode
 * @desc doodad scale mode
 * @on smooth/linear
 * @off nearest
 * @default true
 * @parent chaos
 *
 * @param saveMode
 * @type boolean
 * @text save file format
 * @desc true for lower size of json data, while false for bigger size but easier to see.
 * @on low
 * @off big but separate
 * @default true
 * @parent chaos
 *
 * @param gridSnap
 * @default
 *
 * @param gridSnapShow
 * @type boolean
 * @text show grid snap by default
 * @desc show grid snap by default
 * @default false
 * @parent gridSnap
 *
 * @param gridSnapWidth
 * @type number
 * @text Grid Snap Width
 * @desc Grid Snap Width
 * @default 48
 * @parent gridSnap
 *
 * @param gridSnapHeight
 * @type number
 * @text Grid Snap Height
 * @desc Grid Snap Height
 * @default 48
 * @parent gridSnap
 *
 * @param gridSnapOpacity
 * @type number
 * @text Grid Snap Opacity
 * @desc Grid Snap Opacity
 * @default 50
 * @parent gridSnap
 *
 * @param gridSnapRegionShow
 * @type boolean
 * @text show region grid by default
 * @desc show region grid by default
 * @default false
 * @parent gridSnap
 *
 * @param gridRegionO
 * @type number
 * @text region Grid Opacity
 * @desc region Grid Opacity
 * @default 100
 * @parent gridSnap
 *
 *
*/
//==========================================================
//Traditional Habit.
//==========================================================
var QJ = QJ || {};
QJ.DD = QJ.DD || {reWrite:{}};
var Imported = Imported || {};
Imported.QJDoodads = true;
//==========================================================
//
//==========================================================
function Sprite_DoodadQJ() {
    this.initialize(...arguments);
}
function Sprite_MouseDoodadsCursorQJ() {
    this.initialize(...arguments);
}
//==========================================================
//
//==========================================================
(($)=>{
//==========================================================
//preset
//==========================================================
const pluginName = "QJ-Doodads";
const parameters = PluginManager.parameters(pluginName);
const editKey = String(parameters.editKey);
const folderName = "img/"+parameters.folderName;
const editorMode = eval(parameters.editorMode);
const dataFileName = String(parameters.dataFileName)+'.json';
const pluginVersion = 1.0;
const doodadScaleMode = eval(parameters.doodadScaleMode);
const saveMode = eval(parameters.saveMode);
//==========================================================
//
//==========================================================
QJ.DD.standardStructData = {
    bit:[1],
    index:0,
    anchorX:0.5,
    anchorY:1,
    posMode:1,//0screen 1map
    x:0,
    y:0,
    z:0,
    scaleX:1,
    scaleY:1,
    blend:0,
    opacity:1,
    rotation:0,
    rotateSpeed:0,
    r:0,
    g:0,
    b:0,
    grey:0,
    xFrame:1,
    yFrame:1,
    frameUpdate:0,
    frameX:0,
    frameY:0,
    frameW:32,
    frameH:32,
    switch:[],
    condition:"",
    blur:0,
    contrast:0,
    sepia:false,
    hue:0,
    bright:false
};
QJ.DD.standardStruct = function() {
    return JsonEx.makeDeepCopy(QJ.DD.standardStructData);
}
QJ.DD.initPluginData = {
    version:pluginVersion
}
//==========================================================
//
//==========================================================
$dataDoodadsQJ = {};
DataManager._databaseFiles.push({ name: '$dataDoodadsQJ', src: dataFileName });
$.DataManager_loadDataFile = DataManager.loadDataFile;
DataManager.loadDataFile = function(name, src) {
    if (name=='$dataDoodadsQJ') {
        const xhr = new XMLHttpRequest();
        const url = "data/" + src;
        window[name] = {};
        xhr.open("GET", url);
        xhr.overrideMimeType("application/json");
        xhr.onload = () => {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
                DataManager.checkDoodadsDataQJ();
            }
        }
        xhr.onerror = () => {
            DataManager.createNewDoodadsDataFileQJ();
        };
        xhr.send();
    } else return $.DataManager_loadDataFile.call(this,name,src);
};
DataManager.loadMapDataSynDoodadsQJ = function(type,name) {
    const xhr = new XMLHttpRequest();
    let url;
    if (type==0) {
        url = "data/Map%1.json".format(name.padZero(3));
    } else if (type==1) {
        url = "data/"+name+".json";
    }
    xhr.open("GET",url,false);
    xhr.overrideMimeType("application/json");
    xhr.send();
    if (type==0) {
        if(xhr.status !== 200) throw new Error("Load Doodads Map Data Error.Map Id:"+name);
    } else if (type==1) {
        if(xhr.status !== 200) throw new Error("Load Map Info Error.");
    }
    return JSON.parse(xhr.responseText);
};
DataManager.saveDoodadsDataQJ = function() {
    let fs = require('fs');
    if (saveMode) {
        fs.writeFile('./data/' + dataFileName,JSON.stringify($dataDoodadsQJ?$dataDoodadsQJ:{
            data:JsonEx.makeDeepCopy(QJ.DD.initPluginData)
        }),(value)=>{
            //
        });
    } else {
        fs.writeFile('./data/' + dataFileName,JSON.stringify($dataDoodadsQJ?$dataDoodadsQJ:{
            data:JsonEx.makeDeepCopy(QJ.DD.initPluginData)
        },null,4),(value)=>{
            //
        });
    }
};
DataManager.createNewDoodadsDataFileQJ = function() {
    if (!$dataDoodadsQJ) {
        $dataDoodadsQJ = {
            data:JsonEx.makeDeepCopy(QJ.DD.initPluginData)
        };
    }
    DataManager.saveDoodadsDataQJ();
};
DataManager.checkDoodadsDataQJ = function() {//translate VS to QJ
    if (typeof $dataDoodadsQJ.length == "number") {//isArray
        let mapInfoData = DataManager.loadMapDataSynDoodadsQJ(1,"MapInfos");
        let tilesetsData = DataManager.loadMapDataSynDoodadsQJ(1,"Tilesets");
        let doodadsData = {
            data:JsonEx.makeDeepCopy(QJ.DD.initPluginData)
        };
        for (let i=1,detail,il=$dataDoodadsQJ.length,mapDoodadsData,mapTilesetData;i<il;i++) {
            detail = $dataDoodadsQJ[i];
            if (!detail||!mapInfoData[i]) continue;
            doodadsData[i] = [];
            mapDoodadsData = doodadsData[i];
            mapTilesetData = [];
            for (let tilesetsName = tilesetsData[DataManager.loadMapDataSynDoodadsQJ(0,i).tilesetId].tilesetNames,_i1=tilesetsName.length-1;
                _i1>=tilesetsName.length-4;_i1--) {
                if (tilesetsName[_i1]&&tilesetsName[_i1].length>0) {
                    mapTilesetData.unshift(tilesetsName[_i1]);
                }
            }
            for (let j of detail) {//a doodad
                let doodadData = {};
                for (let k in QJ.DD.standardStructData) {
                    if (k=="bit"){
                        if (j.iconIndex>0) {
                            doodadData.bit = [1];
                            doodadData.frameX = j.iconIndex%16*32;
                            doodadData.frameY = Math.floor(j.iconIndex/16)*32;
                            doodadData.frameW = 32;
                            doodadData.frameH = 32;
                        } else if (j.folder.length==0&&j.bitmap=="TileSet") {
                            doodadData.bit = [2,mapTilesetData[Math.floor(j.tileId/256)]];
                            doodadData.frameX = j.tileId%256%16*48;
                            doodadData.frameY = Math.floor(j.tileId%256/16)*48;
                            doodadData.frameW = Math.min(16,j.tileCols)*48;
                            doodadData.frameH = Math.min(16-Math.floor(j.tileId%256/16),j.tileRows)*48;
                        } else {
                            doodadData.bit = [0,j.folder,j.bitmap];
                            doodadData.frameX = 0;
                            doodadData.frameY = 0;
                            doodadData.frameW = 0;
                            doodadData.frameH = 0;
                        }
                    } else if (k=="posMode") {
                        doodadData[k] = j.positionType=="map"?1:0;
                    } else if (k=="scaleX"||k=="scaleY") {
                        doodadData[k] = Math.floor(j[k]/100);
                    } else if (k=="opacity") {
                        doodadData[k] = Math.floor(j[k]/255);
                    } else if (k=="r") {
                        doodadData[k] = j.toneRed||0;
                    } else if (k=="g") {
                        doodadData[k] = j.toneGreen||0;
                    } else if (k=="b") {
                        doodadData[k] = j.toneBlue||0;
                    } else if (k=="switch") {
                        let switchText = "";
                        if (j.switchOn) {
                            for (let l of j.switchOn) {
                                if (switchText.length>0) switchText+="~"+l+"|true";
                                else switchText+=l+"|true";
                            }
                        }
                        if (j.switchOff) {
                            for (let l of j.switchOff) {
                                if (switchText.length>0) switchText+="~"+l+"|false";
                                else switchText+=l+"|false";
                            }
                        }
                        doodadData[k] = switchText;
                    } else if (k=="frameX"||k=="frameY"||k=="frameW"||k=="frameH") {
                        //
                    } else if (k=="blur") {
                        doodadData[k] = j[k]?50:0;
                    } else if (k=="contrast") {
                        doodadData[k] = j[k]?50:0;
                    } else if (k=="bright") {
                        doodadData[k] = j.glow;
                    } else if (j[k]==undefined||j[k]==null) {
                        doodadData[k] = QJ.DD.standardStructData[k];
                    } else {
                        doodadData[k] = j[k];
                    }
                }
                mapDoodadsData.push(doodadData);
            }
        }
        $dataDoodadsQJ = doodadsData;
        DataManager.saveDoodadsDataQJ();
    }
};
//==========================================================
//bitmap->baseTexture
//==========================================================
let preLoadData = {};
ImageManager.loadDoodadsQJ = function(filename) {
    if (filename[0]==0) return preLoadData[filename[1]+filename[2]];
    else if (filename[0]==1) return preLoadData["*1/IconSet/"];
    else if (filename[0]==2) return preLoadData["*2/"+filename[1]];
};
$.Scene_Boot_isReady = Scene_Boot.prototype.isReady;
Scene_Boot.prototype.isReady = function() {
    if (!$.Scene_Boot_isReady.apply(this,arguments)) {
        return false;
    }
    if (!DataManager.DoodadsQJPreLoad) {
        preLoadData["*1/IconSet/"] = ImageManager.loadSystem("IconSet");
        for (let i in $dataDoodadsQJ) {
            for (let j=0,jData=$dataDoodadsQJ[i],jl=jData.length,detail;j<jl;j++) {
                detail = jData[j];
                if (detail.bit) {
                    if (detail.bit[0]==0) {
                        preLoadData[detail.bit[1]+detail.bit[2]] = ImageManager.loadBitmap(folderName+detail.bit[1],detail.bit[2]);
                    } else if (detail.bit[0]==2&&typeof detail.bit[1] == "string") {
                        preLoadData["*2/"+detail.bit[1]] = ImageManager.loadTileset(detail.bit[1]);
                    }
                }
            }
        }
        DataManager.DoodadsQJPreLoad = true;
    }
    for (let i in preLoadData) {
        if (!preLoadData[i]) return false;
        if (!preLoadData[i].width) return false;
        if (!preLoadData[i].hasPreLoadedQJ) {
            preLoadData[i] = QJ.DD.addTexture(preLoadData[i]);
        }
    }
    //==================================
    return true;
};
QJ.DD.addTexture = function(bitmap) {
    let lsCanvas = document.createElement('canvas');
    let lscontext = lsCanvas.getContext('2d');
    let lsBaseTexture = null;
    let w=bitmap.width,h=bitmap.height;
    lsCanvas.width = w;
    lsCanvas.height = h;
    lsBaseTexture = new PIXI.BaseTexture(lsCanvas);
    lsBaseTexture.scaleMode = doodadScaleMode?PIXI.SCALE_MODES.LINEAR:PIXI.SCALE_MODES.NEAREST;
    lsBaseTexture.width = w;
    lsBaseTexture.height = h;
    lscontext.globalCompositeOperation = 'source-over';
    lscontext.drawImage(bitmap._canvas?bitmap._canvas:bitmap._image,0,0,w,h,0,0,w,h);
    lsBaseTexture.update();
    lsBaseTexture.hasPreLoadedQJ = true;
    return lsBaseTexture;
};
//==========================================================
//
//==========================================================
QJ.DD.doodads = function() {
    if (!$gameMap||!$dataDoodadsQJ) return {};
    return $dataDoodadsQJ[$gameMap.mapId()];
}
//==========================================================
//
//==========================================================
Bitmap.prototype.bltDoodadsQJ = function(source,sx, sy, sw, sh, dx, dy, dw, dh) {
    dw = dw || sw;
    dh = dh || sh;
    try {
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
        this._baseTexture.update();
    } catch (e) {
        //
    }
};
//==========================================================
//Sprite_DoodadQJ
//========================================================== 
Sprite_DoodadQJ.prototype = Object.create(PIXI.Sprite.prototype);
Sprite_DoodadQJ.prototype.constructor = Sprite_DoodadQJ;
Sprite_DoodadQJ.prototype.initialize = function(data,_spriteset) {
    this._spriteset = _spriteset;
    this.data = this.fixNewValueNull(data);
    PIXI.Sprite.call(this,new PIXI.Texture(ImageManager.loadDoodadsQJ(this.data.bit)));
    this.setBase();
};
Sprite_DoodadQJ.prototype.setBase = function() {
    //=========================================
    this.doodadIndex = this.data.index;
    this.anchor.set(this.data.anchorX,this.data.anchorY);
    this.scale.x = this.data.scaleX;
    this.scale.y = this.data.scaleY;
    this.z = this.data.z;
    this.blendMode = this.data.blend;
    this.alpha = this.data.opacity;
    this.alphaTrue = this.alpha;//select
    this.rotation = this.data.rotation*Math.PI/180;
    this.rotateSpeed = this.data.rotateSpeed*Math.PI/180;
    this.rotationRem = this.rotation;
    this.posMode = this.data.posMode;
    //=========================================
    this.x = this.screenX();
    this.y = this.screenY();
    //=========================================
    this.startX = this.data.frameX;
    this.startY = this.data.frameY;
    let orginWidth = this.data.bit[0]==0?this.texture.baseTexture.width:this.data.frameW;
    let orginHeight = this.data.bit[0]==0?this.texture.baseTexture.height:this.data.frameH;
    this.frameUpdateNow = 0;
    this.xFrameNow = 0;
    this.yFrameNow = 0;
    this.widthNum = orginWidth/this.data.xFrame;
    this.heightNum = orginHeight/this.data.yFrame;
    this.setBitFrame();
    this.needUpdateFrame = this.data.xFrame>1||this.data.yFrame>1;
    this.bodyQJ = null;
    this.showSwitch = [];
    this.showCondition = null;
    try{
        for (let i of this.data.switch.split("~")) {
            let detail = i.split("|");
            this.showSwitch.push([Number(detail[0]),(detail[1]=="on"||detail[1]=="true")?true:false]);
        }
    } catch(e) {
        this.showSwitch = [];
    }
    try{
        if (this.data.condition.length>0) this.showCondition = eval("()=>{ return "+this.data.condition+";}")
        this.showCondition();
    } catch(e) {
        this.showCondition = null;
    }
    this.setAllDoodadFilter();
    //=========================================
    if (editorMode) this.updateBody();
    //=========================================
};
Sprite_DoodadQJ.prototype.setAllDoodadFilter = function() {
    let filtersList = [];
    if (this.data.r!=0||this.data.g!=0||this.data.b!=0||this.data.grey!=0||
        this.data.hue!=0||this.blendColor) {
        let colorFilter = new ColorFilter();
        if (this.data.r!=0||this.data.g!=0||this.data.b!=0||this.data.grey!=0) {
            colorFilter.setColorTone([this.data.r,this.data.g,this.data.b,this.data.grey]);
        }
        if (this.data.hue!=0) {
            colorFilter.setHue(this.data.hue);
        }
        if (this.blendColor&&(this.blendColor[0]>0||this.blendColor[1]>0||this.blendColor[2]>0||this.blendColor[3]>0)) {
            colorFilter.setBlendColor(this.blendColor);
        }
        filtersList.push(colorFilter);
    }
    if (this.data.blur>0) {
        filtersList.push(new PIXI.filters.BlurFilter(0.00001*this.data.blur, 2e-4));
    }
    if (this.data.contrast>0||this.data.sepia||this.data.bright) {
        let colorFilter = new PIXI.filters.ColorMatrixFilter();
        let firstColorMax = false;
        if (this.data.contrast>0) {colorFilter.contrast(0.01*this.data.contrast,firstColorMax);firstColorMax=true;}
        if (this.data.sepia) {colorFilter.sepia(firstColorMax);firstColorMax=true;}
        if (this.data.bright) {
            colorFilter._loadMatrix([
                2, 0, 0, 0, 0,
                0, 2, 0, 0, 0,
                0, 0, 2, 0, 0,
                0, 0, 0, 1, 0
            ],firstColorMax);
            firstColorMax=true;
        }
        filtersList.push(colorFilter);
    }
    this.dealMoreFilter(filtersList);
    this.filters = filtersList;
};
Sprite_DoodadQJ.prototype.dealMoreFilter = function(filtersList) {
    
};
Sprite_DoodadQJ.prototype.update = function() {
    this.updatePosition();
    this.updateScale();
    this.updateRotation();
    this.updateVisible();
    this.updateFrame();
    this.updateEditData();
};
Sprite_DoodadQJ.prototype.updateRotation = function() {
    this.rotationRem += this.rotateSpeed;
    this.rotation = this.rotationRem;
};
Sprite_DoodadQJ.prototype.updateScale = function() {
    this.scale.x = this.data.scaleX;
    this.scale.y = this.data.scaleY;
};
Sprite_DoodadQJ.prototype.updatePosition = function() {
    this.x = this.screenX();
    this.y = this.screenY();
};
Sprite_DoodadQJ.prototype.updateVisible = function() {
    if ($gameSystem.doodadsQJ.editing) {
        this.visible = true;
    } else {
        this.visible = this.showCondition?this.showCondition():true;
        if (this.showSwitch&&this.visible) {
            for (let i of this.showSwitch) {
                if ($gameSwitches.value(i[0])!=i[1]) {
                    this.visible = false;
                    break;
                }
            }
        }
    }
};
Sprite_DoodadQJ.prototype.screenX = function() {
    if (this.posMode==1) return this.data.x - $gameMap.displayX()*48;
    else return this.data.x;
};
Sprite_DoodadQJ.prototype.screenY = function() {
    if (this.posMode==1) return this.data.y - $gameMap.displayY()*48;
    else return this.data.y;
};
Sprite_DoodadQJ.prototype.updateFrame = function() {
    if (!this.needUpdateFrame) return; 
    this.frameUpdateNow++;
    if (this.frameUpdateNow>=this.data.frameUpdate) {
        this.frameUpdateNow=0;
        this.xFrameNow++;
        if (this.xFrameNow>=this.data.xFrame) {
            this.xFrameNow=0;
            this.yFrameNow++;
            if (this.yFrameNow>=this.data.yFrame) {
                this.yFrameNow=0;
            }
        }
        this.setBitFrame();
    }
};
Sprite_DoodadQJ.prototype.setBitFrame = function() {
    this.texture.frame = new Rectangle(
        this.startX+this.widthNum*this.xFrameNow,
        this.startY+this.heightNum*this.yFrameNow,
        this.widthNum,this.heightNum);
};
Sprite_DoodadQJ.prototype.destroy = function() {
    PIXI.Sprite.prototype.destroy.call(this);

};
Sprite_DoodadQJ.prototype.updateBody = function() {
    this.updatePosition();
    this.updateScale();
    this.updateRotation();
    this.bodyQJ = QJ.DD.setData(this.x,this.y,
        this.widthNum,this.heightNum,
        this.anchor.x,this.anchor.y,
        this.scale.x,this.scale.y,this.rotation)
};
Sprite_DoodadQJ.prototype.updateEditData = function() {
    if (!editorMode) return;
    if ($gameSystem.doodadsQJ.selecting) {
        if ($gameSystem.doodadsQJ.selecting.indexOf(this)>-1) {
            this.alpha = 1*this.alphaTrue;
        } else {
            this.alpha = 0.4*this.alphaTrue;
        }
    } else this.alpha = 1*this.alphaTrue;
};
Sprite_DoodadQJ.prototype.drawOnOtherBitmap = function(bitmap,x,y,w,h) {
    if (!this.texture||!this.texture.baseTexture||!this.texture.baseTexture.resource.source) return;
    let baseTexture = this.texture.baseTexture;
    let frame = this.texture.frame;
    let scaleSize = Math.max(Math.min(w/frame.width,h/frame.height)-0.05,0.2);
    bitmap.bltDoodadsQJ(baseTexture.resource.source,frame.x,frame.y,frame.width,frame.height,
        (w-frame.width*scaleSize)/2+x,(h-frame.height*scaleSize)/2+y,frame.width*scaleSize,frame.height*scaleSize);
};
Sprite_DoodadQJ.prototype.setDead = function() {
    for (let idata=SceneManager._scene._spriteset._doodadsQJ,i=0,il=idata.length;i<il;i++) {
        if (idata[i]==this) {
            idata.splice(i,1);
            break;
        }
    }
    if (this.parent) this.parent.removeChild(this);
    this.destroy();
};
Sprite_DoodadQJ.prototype.fixNewValueNull = function(data) {
    //if (typeof data.switch != 'string') data.switch = "";
    return data;
};
//=============================================================================
//UM7 others
//=============================================================================
if (Imported.Blizzard_UltraMode7) {
    //=============================================================================
    //
    //=============================================================================
    Sprite_DoodadQJ.prototype._makeLoopedScreenPosition = function() {
        const loopedPosition = $gameMap.adjustUltraMode7LoopedPosition(this.data.x/48,this.data.y/48);
        return {x:loopedPosition.x*$gameMap.tileWidth(),y:loopedPosition.y*$gameMap.tileHeight()};
    };
    Sprite_DoodadQJ.prototype.updatePosition = function() {
        this.x = this.screenX();
        this.y = this.screenY();
        if ($gameMap.useUltraMode7) {
            const oldData = this._makeLoopedScreenPosition();
            const position = UltraMode7.mapToScreen(oldData.x, oldData.y);
            this.x = position.x;
            this.y = position.y;
        }
    };
    Sprite_DoodadQJ.prototype.updateScale = function() {
        this.scale.x = this.data.scaleX;
        this.scale.y = this.data.scaleY;
        if ($gameMap.useUltraMode7) {
            const scale = UltraMode7.mapToScreenScale(this.screenX(),this.screenY());
            this.scale.x *= scale;
            this.scale.y *= scale;
        }
    };
    Sprite_DoodadQJ.prototype.updateVisible = function() {
        if ($gameSystem.doodadsQJ.editing) {
            this.visible = true;
        } else {
            this.visible = this.showCondition?this.showCondition():true;
            if (this.showSwitch&&this.visible) {
                for (let i of this.showSwitch) {
                    if ($gameSwitches.value(i[0])!=i[1]) {
                        this.visible = false;
                        break;
                    }
                }
            }
        }
        if (!this.isUltraMode7Visible()) this.visible = false;
        let blendColor = this.screenBlendColor();
        if (blendColor) {
            if (!this.blendColor||this.blendColor[0]!=blendColor[0]||this.blendColor[1]!=blendColor[1]
                ||this.blendColor[2]!=blendColor[2]||this.blendColor[3]!=blendColor[3]) {
                this.blendColor = blendColor;
                this.setAllDoodadFilter();
            }
        } else {
            this.blendColor = null;
        }
    };
    Sprite_DoodadQJ.prototype.updateRotation = function() {
        this.rotationRem += this.rotateSpeed;
        this.rotation = this.rotationRem;
        if ($gameMap.useUltraMode7) this.rotation += Math.PI*$gameMap.ultraMode7Roll/180;
    };
    Sprite_DoodadQJ.prototype.screenBlendColor = function() {
        if (!$gameMap.useUltraMode7 || !UltraMode7.CHARACTERS_USE_FADE_Z) return null;
        const position = this._makeLoopedScreenPosition();
        const z = UltraMode7.mapToScreen(position.x, position.y).z;
        const fadeBegin = $gameMap.ultraMode7FadeBegin;
        const fadeEnd = $gameMap.ultraMode7FadeEnd;
        const fadeColor = $gameMap.ultraMode7FadeColor;
        const result = [Math.round(fadeColor[0] * 255), Math.round(fadeColor[1] * 255), Math.round(fadeColor[2] * 255), 0];
        if (z >= fadeEnd) {
            result[3] = 255;
        } else if (z > fadeBegin && z < fadeEnd) {
            result[3] = Math.round((z - fadeBegin) / (fadeEnd - fadeBegin) * (z - fadeBegin) / (fadeEnd - fadeBegin) * 255);
        }
        return result;
    };
    Sprite_DoodadQJ.prototype.isUltraMode7Visible = function() {
        if (!$gameMap.useUltraMode7)return true;
        if ($gameMap.ultraMode7Fov <= 0) return true;
        const position = this._makeLoopedScreenPosition();
        return UltraMode7.isVisibleByZ(UltraMode7.mapToScreen(position.x, position.y).z);
    };
    //=============================================================================
    //
    //=============================================================================
}
//=============================================================================
//Box Sprite.
//=============================================================================
if (false) {
$.Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
Spriteset_Map.prototype.createLowerLayer = function() {
    $.Spriteset_Map_createLowerLayer.call(this);
    this._DoodadsBoxSpriteQJ = new Sprite_DoodadsBoxQJ();
    this.addChild(this._DoodadsBoxSpriteQJ);
};
function Sprite_DoodadsBoxQJ() {
    this.initialize.apply(this, arguments);
}
Sprite_DoodadsBoxQJ.prototype = Object.create(Sprite.prototype);
Sprite_DoodadsBoxQJ.prototype.constructor = Sprite_DoodadsBoxQJ;
Sprite_DoodadsBoxQJ.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.visible = true;
    this.opacity = 100;
    this.bitmap = new Bitmap(Graphics.width,Graphics.height);
    this.bitmap.paintOpacity = 80;
};
Sprite_DoodadsBoxQJ.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this.visible&&SceneManager._scene._spriteset&&SceneManager._scene._spriteset._doodadsQJ) {
        this.bitmap.clear();
        for (let i of SceneManager._scene._spriteset._doodadsQJ) {
            this.drawBody(i.bodyQJ,this.bitmap._context,0,0,"#ff0000");
        }
    }
};
Sprite_DoodadsBoxQJ.prototype.drawBody = function(body,c,dx,dy,color) {
    let posX = body.pos.x+dx,posY = body.pos.y+dy;
    c.beginPath();
    let bounds = body.calcPoints;
    c.moveTo(bounds[0].x+posX,bounds[0].y+posY);
    for (let j=1,jl=bounds.length;j<jl;j++) {
        c.lineTo(bounds[j].x+posX,bounds[j].y+posY);
    }
    c.lineTo(bounds[0].x+posX,bounds[0].y+posY);
    c.closePath();
    c.fillStyle = color?color:(body.color?body.color:"#00FF00");
    c.fill();
    c.lineWidth = 2;
    c.strokeStyle = "#000000";
    c.stroke();
};
}
//==========================================================
//Spriteset_Map
//========================================================== 
$.Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
Spriteset_Map.prototype.createCharacters = function() {
    $.Spriteset_Map_createCharacters.call(this);
    this.addDoodadsQJ();
};
Spriteset_Map.prototype.addDoodadsQJ = function() {
    this._doodadsQJ = [];
    let doodadsList = QJ.DD.doodads();
    if (!doodadsList) return;
    for (let i=0,il=doodadsList.length,detail,sprite;i<il;i++) {
        detail = doodadsList[i];
        sprite = new Sprite_DoodadQJ(detail,this);
        this._doodadsQJ.push(sprite);
        this._tilemap.addChild(sprite);
    }
};
Spriteset_Map.prototype.removeDoodadsQJ = function() {
    for (let i=0,il=this._doodadsQJ.length,sprite;i<il;i++) {
        sprite = this._doodadsQJ[i];
        this._tilemap.removeChild(sprite);
        sprite.destroy();
    }
    this._doodadsQJ = [];
};
//==========================================================
//
//==========================================================
$.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    $.Game_System_initialize.apply(this);
    this.initializeDoodadsQJ();
}
Game_System.prototype.initializeDoodadsQJ = function() {
    this.doodadsQJ = {
        editing:false,
        selecting:null,
        rectSelect:[0,0,0,0,false,false],//sx sy es ey ifPress ifMap
        movingItem:[0,0,false,null],
        grid:eval(parameters.gridSnapShow),
        gridX:Number(parameters.gridSnapWidth),
        gridY:Number(parameters.gridSnapHeight),
        gridO:Number(parameters.gridSnapOpacity),
        gridRegion:eval(parameters.gridSnapRegionShow),
        gridRegionO:Number(parameters.gridRegionO),
        lastData:null,
        pasteData:null,
        addData:null
    };
}
Game_System.prototype.showOrHideDoodadsWindow = function(status) {
    if (status==null||status==undefined) $gameSystem.doodadsQJ.editing = !$gameSystem.doodadsQJ.editing;
    else $gameSystem.doodadsQJ.editing = !!status;
}
//================================================================================================================================
//==========((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((
//================================================================================================================================
if (editorMode) {
//==========================================================
//
//==========================================================
delete Input.keyMapper[96];
delete Input.keyMapper[98];
delete Input.keyMapper[100];
delete Input.keyMapper[102];
delete Input.keyMapper[104];
$.Input__shouldPreventDefault = Input._shouldPreventDefault;
$.Input__shouldPreventDefault_New = function(keyCode) {
    switch (keyCode) {
        case 9: // tab
            return true;
    }
    return false;
};
Input.setPreventDefaultQJ = function(bo) {
    if (bo) {
        Input._shouldPreventDefault = $.Input__shouldPreventDefault;
    } else {
        Input._shouldPreventDefault = $.Input__shouldPreventDefault_New;
    }
};
//==========================================================
//
//==========================================================
window.saveFilesDoodadsQJ = {};
(()=>{
    let fs = require('fs');
    loadAndFindFile = function(path,tarObject) {
        let files = fs.readdirSync(path),name;
        files.forEach((content,index)=>{
            if (fs.statSync(path+content).isFile()) {
                name = content.substr(0,content.indexOf('.'));
                tarObject[name] = name;
            } else {
                tarObject[content] = {};
                loadAndFindFile(path+content+"/",tarObject[content]);
            }
        });
    };
    loadAndFindFile('./'+folderName,saveFilesDoodadsQJ);
})();
//==========================================================
//
//==========================================================
$.Graphics__onKeyDown = Graphics._onKeyDown;
Graphics._onKeyDown = function(event) {
    $.Graphics__onKeyDown.call(this,event);
    if (!event.ctrlKey && !event.altKey) {
        QJ.DD.dealKey(event);
    }
};
Input.keyMapper[17] = 'control';
Input.keyMapper[18] = 'alt';
Input.keyMapper[46] = 'del';
Input.keyMapper[67] = 'C';
Input.keyMapper[86] = 'V';
Input.keyMapper[68] = 'D';
Input.keyMapper[83] = 'S';
Input.keyMapper[65] = 'A';
Input.keyMapper[87] = 'W';
Input.keyMapper[72] = 'H';
Input.keyMapper[16] = 'shift';
Input.keyMapper[71] = 'G';
Input.keyMapper[85] = 'U';
Input.keyMapper[73] = 'I';
Input.keyMapper[79] = 'O';
Input.keyMapper[80] = 'P';
//==========================================================
//QJ.DD
//========================================================== 
QJ.DD.dealKey = function(event) {
    if (!$gameSystem||!$dataDoodadsQJ) return;
    if (event.code === editKey) {
        if (SceneManager._scene) {
            if (SceneManager._scene._doodadsWindowIndex==0) {
                $gameSystem.showOrHideDoodadsWindow();
            }
        }
    }
}
//==========================================================
//Game_Map
//========================================================== 
$.Game_Map_isEventRunning = Game_Map.prototype.isEventRunning;
Game_Map.prototype.isEventRunning = function() {
    if ($gameSystem.doodadsQJ.editing) return true;
    return $.Game_Map_isEventRunning.call(this);
};
Game_Map.prototype.centerScreenQJ = function(id,x,y) {
    if (id==0) {
        $gamePlayer.center($gamePlayer.x,$gamePlayer.y);
    }else if (id==1) {
        this.setDisplayPos(this.displayX()+x,this.displayY()+y);
    } else if (id==2) {
        $gamePlayer.center(Math.floor(x/48),Math.floor(y/48));
    }
};
//==========================================================
//Game_Event
//========================================================== 
$.Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
Game_Event.prototype.updateSelfMovement = function() {
    if ($gameSystem.doodadsQJ.editing) return;
    $.Game_Event_updateSelfMovement.call(this);
};
//==========================================================
//Game_Player
//========================================================== 
$.Game_Player_canMove = Game_Player.prototype.canMove;
Game_Player.prototype.canMove = function() {
    if ($gameSystem.doodadsQJ.editing) return false;
    return $.Game_Player_canMove.call(this);
};
//=============================================================================
//SAT.js
//=============================================================================
/*!
 * SAT.js - v0.9.0
 * License MIT
 */
if (!SATVector) {
    function SATVector(x, y) {  this['x'] = x || 0;  this['y'] = y || 0;}SATVector.prototype.copy = function (other) {  this['x'] = other['x'];  this['y'] = other['y'];  return this;};SATVector.prototype.clone = function () {  return new SATVector(this['x'], this['y']);};SATVector.prototype.perp = function () {  var x = this['x'];  this['x'] = this['y'];  this['y'] = -x;  return this;};SATVector.prototype.rotate = function (angle) {  var x = this['x'];  var y = this['y'];  this['x'] = x * Math.cos(angle) - y * Math.sin(angle);  this['y'] = x * Math.sin(angle) + y * Math.cos(angle);  return this;};SATVector.prototype.reverse = function () {  this['x'] = -this['x'];  this['y'] = -this['y'];  return this;};SATVector.prototype.normalize = function () {  var d = this.len();  if (d > 0) {    this['x'] = this['x'] / d;    this['y'] = this['y'] / d;  }  return this;};SATVector.prototype.add = function (other) {  this['x'] += other['x'];  this['y'] += other['y'];  return this;};SATVector.prototype.sub = function (other) {  this['x'] -= other['x'];  this['y'] -= other['y'];  return this;};SATVector.prototype.scale = function (x, y) {  this['x'] *= x;  this['y'] *= typeof y != 'undefined' ? y : x;  return this;};SATVector.prototype.project = function (other) {  var amt = this.dot(other) / other.len2();  this['x'] = amt * other['x'];  this['y'] = amt * other['y'];  return this;};SATVector.prototype.projectN = function (other) {  var amt = this.dot(other);  this['x'] = amt * other['x'];  this['y'] = amt * other['y'];  return this;};SATVector.prototype.reflect = function (axis) {  var x = this['x'];  var y = this['y'];  this.project(axis).scale(2);  this['x'] -= x;  this['y'] -= y;  return this;};SATVector.prototype.reflectN = function (axis) {  var x = this['x'];  var y = this['y'];  this.projectN(axis).scale(2);  this['x'] -= x;  this['y'] -= y;  return this;};SATVector.prototype.dot = function (other) {  return this['x'] * other['x'] + this['y'] * other['y'];};SATVector.prototype.len2 = function () {  return this.dot(this);};SATVector.prototype.len = function () {  return Math.sqrt(this.len2());};function SATCircle(pos, r) {  this['pos'] = pos || new SATVector();  this['r'] = r || 0;  this['offset'] = new SATVector();}SATCircle.prototype.getAABBAsBox = function () {  var r = this['r'];  var corner = this['pos'].clone().add(this['offset']).sub(new SATVector(r, r));  return new SATBox(corner, r * 2, r * 2);};SATCircle.prototype.getAABB = function () {  return this.getAABBAsBox().toPolygon();};SATCircle.prototype.setOffset = function (offset) {  this['offset'] = offset;  return this;};function SATPolygon(pos, points) {  this['pos'] = pos || new SATVector();  this['angle'] = 0;  this['offset'] = new SATVector();  this.setPoints(points || []);}SATPolygon.prototype.setPoints = function (points) {  var lengthChanged = !this['points'] || this['points'].length !== points.length;  if (lengthChanged) {    var i;    var calcPoints = this['calcPoints'] = [];    var edges = this['edges'] = [];    var normals = this['normals'] = [];    for (i = 0; i < points.length; i++) {      var p1 = points[i];      var p2 = i < points.length - 1 ? points[i + 1] : points[0];      if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {        points.splice(i, 1);        i -= 1;        continue;      }      calcPoints.push(new SATVector());      edges.push(new SATVector());      normals.push(new SATVector());    }  }  this['points'] = points;  this._recalc();  return this;};SATPolygon.prototype.setAngle = function (angle) {  this['angle'] = angle;  this._recalc();  return this;};SATPolygon.prototype.setOffset = function (offset) {  this['offset'] = offset;  this._recalc();  return this;};SATPolygon.prototype.rotate = function (angle) {  var points = this['points'];  var len = points.length;  for (var i = 0; i < len; i++) {    points[i].rotate(angle);  }  this._recalc();  return this;};SATPolygon.prototype.translate = function (x, y) {  var points = this['points'];  var len = points.length;  for (var i = 0; i < len; i++) {    points[i]['x'] += x;    points[i]['y'] += y;  }  this._recalc();  return this;};SATPolygon.prototype._recalc = function () {  var calcPoints = this['calcPoints'];  var edges = this['edges'];  var normals = this['normals'];  var points = this['points'];  var offset = this['offset'];  var angle = this['angle'];  var len = points.length;  var i;  for (i = 0; i < len; i++) {    var calcPoint = calcPoints[i].copy(points[i]);    calcPoint['x'] += offset['x'];    calcPoint['y'] += offset['y'];    if (angle !== 0) {      calcPoint.rotate(angle);    }  }  for (i = 0; i < len; i++) {    var p1 = calcPoints[i];    var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];    var e = edges[i].copy(p2).sub(p1);    normals[i].copy(e).perp().normalize();  }  return this;};SATPolygon.prototype.getAABBAsBox = function () {  var points = this['calcPoints'];  var len = points.length;  var xMin = points[0]['x'];  var yMin = points[0]['y'];  var xMax = points[0]['x'];  var yMax = points[0]['y'];  for (var i = 1; i < len; i++) {    var point = points[i];    if (point['x'] < xMin) {      xMin = point['x'];    }    else if (point['x'] > xMax) {      xMax = point['x'];    }    if (point['y'] < yMin) {      yMin = point['y'];    }    else if (point['y'] > yMax) {      yMax = point['y'];    }  }  return new SATBox(this['pos'].clone().add(new SATVector(xMin, yMin)), xMax - xMin, yMax - yMin);};SATPolygon.prototype.getAABB = function () {  return this.getAABBAsBox().toPolygon();};SATPolygon.prototype.getCentroid = function () {  var points = this['calcPoints'];  var len = points.length;  var cx = 0;  var cy = 0;  var ar = 0;  for (var i = 0; i < len; i++) {    var p1 = points[i];    var p2 = i === len - 1 ? points[0] : points[i + 1];    var a = p1['x'] * p2['y'] - p2['x'] * p1['y'];    cx += (p1['x'] + p2['x']) * a;    cy += (p1['y'] + p2['y']) * a;    ar += a;  }  ar = ar * 3;  cx = cx / ar;  cy = cy / ar;  return new SATVector(cx, cy);};function SATBox(pos, w, h) {  this['pos'] = pos || new SATVector();  this['w'] = w || 0;  this['h'] = h || 0;}SATBox.prototype.toPolygon = function () {  var pos = this['pos'];  var w = this['w'];  var h = this['h'];  return new SATPolygon(new SATVector(pos['x'], pos['y']), [    new SATVector(), new SATVector(w, 0),    new SATVector(w, h), new SATVector(0, h)  ]);};function SATResponse() {  this['a'] = null;  this['b'] = null;  this['overlapN'] = new SATVector();  this['overlapV'] = new SATVector();  this.clear();}SATResponse.prototype.clear = function () {  this['aInB'] = true;  this['bInA'] = true;  this['overlap'] = Number.MAX_VALUE;  return this;};var T_VECTORS = [];for (var i = 0; i < 10; i++) { T_VECTORS.push(new SATVector()); }var T_ARRAYS = [];for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }var T_RESPONSE = new SATResponse();var TEST_POINT = new SATBox(new SATVector(), 0.000001, 0.000001).toPolygon();function flattenPointsOn(points, normal, result) {  var min = Number.MAX_VALUE;  var max = -Number.MAX_VALUE;  var len = points.length;  for (var i = 0; i < len; i++) {    var dot = points[i].dot(normal);    if (dot < min) { min = dot; }    if (dot > max) { max = dot; }  }  result[0] = min; result[1] = max;}function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {  var rangeA = T_ARRAYS.pop();  var rangeB = T_ARRAYS.pop();  var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);  var projectedOffset = offsetV.dot(axis);  flattenPointsOn(aPoints, axis, rangeA);  flattenPointsOn(bPoints, axis, rangeB);  rangeB[0] += projectedOffset;  rangeB[1] += projectedOffset;  if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {    T_VECTORS.push(offsetV);    T_ARRAYS.push(rangeA);    T_ARRAYS.push(rangeB);    return true;  }  if (response) {    var overlap = 0;    if (rangeA[0] < rangeB[0]) {      response['aInB'] = false;      if (rangeA[1] < rangeB[1]) {        overlap = rangeA[1] - rangeB[0];        response['bInA'] = false;      } else {        var option1 = rangeA[1] - rangeB[0];        var option2 = rangeB[1] - rangeA[0];        overlap = option1 < option2 ? option1 : -option2;      }    } else {      response['bInA'] = false;      if (rangeA[1] > rangeB[1]) {        overlap = rangeA[0] - rangeB[1];        response['aInB'] = false;      } else {        var option1 = rangeA[1] - rangeB[0];        var option2 = rangeB[1] - rangeA[0];        overlap = option1 < option2 ? option1 : -option2;      }    }    var absOverlap = Math.abs(overlap);    if (absOverlap < response['overlap']) {      response['overlap'] = absOverlap;      response['overlapN'].copy(axis);      if (overlap < 0) {        response['overlapN'].reverse();      }    }  }  T_VECTORS.push(offsetV);  T_ARRAYS.push(rangeA);  T_ARRAYS.push(rangeB);  return false;}function voronoiRegion(line, point) {  var len2 = line.len2();  var dp = point.dot(line);  if (dp < 0) { return LEFT_VORONOI_REGION; }  else if (dp > len2) { return RIGHT_VORONOI_REGION; }  else { return MIDDLE_VORONOI_REGION; }}var LEFT_VORONOI_REGION = -1;var MIDDLE_VORONOI_REGION = 0;var RIGHT_VORONOI_REGION = 1;function pointInCircle(p, c) {  var differenceV = T_VECTORS.pop().copy(p).sub(c['pos']).sub(c['offset']);  var radiusSq = c['r'] * c['r'];  var distanceSq = differenceV.len2();  T_VECTORS.push(differenceV);  return distanceSq <= radiusSq;}function pointInPolygon(p, poly) {  TEST_POINT['pos'].copy(p);  T_RESPONSE.clear();  var result = SATtestPolygonPolygon(TEST_POINT, poly, T_RESPONSE);  if (result) {    result = T_RESPONSE['aInB'];  }  return result;}function SATtestCircleCircle(a, b, response) {  var differenceV = T_VECTORS.pop().copy(b['pos']).add(b['offset']).sub(a['pos']).sub(a['offset']);  var totalRadius = a['r'] + b['r'];  var totalRadiusSq = totalRadius * totalRadius;  var distanceSq = differenceV.len2();  if (distanceSq > totalRadiusSq) {    T_VECTORS.push(differenceV);    return false;  }  if (response) {    var dist = Math.sqrt(distanceSq);    response['a'] = a;    response['b'] = b;    response['overlap'] = totalRadius - dist;    response['overlapN'].copy(differenceV.normalize());    response['overlapV'].copy(differenceV).scale(response['overlap']);    response['aInB'] = a['r'] <= b['r'] && dist <= b['r'] - a['r'];    response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];  }  T_VECTORS.push(differenceV);  return true;}function SATtestPolygonCircle(polygon, circle, response) {  var circlePos = T_VECTORS.pop().copy(circle['pos']).add(circle['offset']).sub(polygon['pos']);  var radius = circle['r'];  var radius2 = radius * radius;  var points = polygon['calcPoints'];  var len = points.length;  var edge = T_VECTORS.pop();  var point = T_VECTORS.pop();  for (var i = 0; i < len; i++) {    var next = i === len - 1 ? 0 : i + 1;    var prev = i === 0 ? len - 1 : i - 1;    var overlap = 0;    var overlapN = null;    edge.copy(polygon['edges'][i]);    point.copy(circlePos).sub(points[i]);    if (response && point.len2() > radius2) {      response['aInB'] = false;    }    var region = voronoiRegion(edge, point);    if (region === LEFT_VORONOI_REGION) {      edge.copy(polygon['edges'][prev]);      var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);      region = voronoiRegion(edge, point2);      if (region === RIGHT_VORONOI_REGION) {        var dist = point.len();        if (dist > radius) {          T_VECTORS.push(circlePos);          T_VECTORS.push(edge);          T_VECTORS.push(point);          T_VECTORS.push(point2);          return false;        } else if (response) {          response['bInA'] = false;          overlapN = point.normalize();          overlap = radius - dist;        }      }      T_VECTORS.push(point2);    } else if (region === RIGHT_VORONOI_REGION) {      edge.copy(polygon['edges'][next]);      point.copy(circlePos).sub(points[next]);      region = voronoiRegion(edge, point);      if (region === LEFT_VORONOI_REGION) {        var dist = point.len();        if (dist > radius) {          T_VECTORS.push(circlePos);          T_VECTORS.push(edge);          T_VECTORS.push(point);          return false;        } else if (response) {          response['bInA'] = false;          overlapN = point.normalize();          overlap = radius - dist;        }      }    } else {      var normal = edge.perp().normalize();      var dist = point.dot(normal);      var distAbs = Math.abs(dist);      if (dist > 0 && distAbs > radius) {        T_VECTORS.push(circlePos);        T_VECTORS.push(normal);        T_VECTORS.push(point);        return false;      } else if (response) {        overlapN = normal;        overlap = radius - dist;        if (dist >= 0 || overlap < 2 * radius) {          response['bInA'] = false;        }      }    }    if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {      response['overlap'] = overlap;      response['overlapN'].copy(overlapN);    }  }  if (response) {    response['a'] = polygon;    response['b'] = circle;    response['overlapV'].copy(response['overlapN']).scale(response['overlap']);  }  T_VECTORS.push(circlePos);  T_VECTORS.push(edge);  T_VECTORS.push(point);  return true;}function SATtestCirclePolygon(circle, polygon, response) {  var result = SATtestPolygonCircle(polygon, circle, response);  if (result && response) {    var a = response['a'];    var aInB = response['aInB'];    response['overlapN'].reverse();    response['overlapV'].reverse();    response['a'] = response['b'];    response['b'] = a;    response['aInB'] = response['bInA'];    response['bInA'] = aInB;  }  return result;}function SATtestPolygonPolygon(a, b, response) {  var aPoints = a['calcPoints'];  var aLen = aPoints.length;  var bPoints = b['calcPoints'];  var bLen = bPoints.length;  for (var i = 0; i < aLen; i++) {    if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {      return false;    }  }  for (var i = 0; i < bLen; i++) {    if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {      return false;    }  }  if (response) {    response['a'] = a;    response['b'] = b;    response['overlapV'].copy(response['overlapN']).scale(response['overlap']);  }  return true;}
}
QJ.DD.box = function(x,y,w,h){
    let body = new SATPolygon(
        new SATVector(x,y), [
        new SATVector(-w/2,-h/2),
        new SATVector(+w/2,-h/2),
        new SATVector(+w/2,+h/2),
        new SATVector(-w/2,+h/2)
    ]);
    body.w = w;
    body.h = h;
    return body;
};
QJ.DD.mouseBox = new SATCircle(new SATVector(0,0),1);
QJ.DD.setData = function(x,y,w,h,ax,ay,sx,sy,rotate) {
    let body = QJ.DD.box(0,0,w*sx,h*sy);
    body.pos.x = x;
    body.pos.y = y;
    body.setOffset(new SATVector(w*sx*(0.5-ax),h*sy*(0.5-ay)));
    body.setAngle(rotate);
    return body;
};
QJ.DD.sat = new SATResponse();
QJ.DD.judge = function(body,bodyX){
    QJ.DD.sat.clear();
    if (bodyX) {
        return SATtestPolygonPolygon(bodyX,body,QJ.DD.sat);
    } else {
        return SATtestCirclePolygon(QJ.DD.mouseBox,body,QJ.DD.sat);
    }
};
//==========================================================
//mouse
//==========================================================
let mouseX=0,mouseY=0;
$.TouchInput__onTouchMove = TouchInput._onTouchMove;
TouchInput._onTouchMove = function(event) {
    $.TouchInput__onTouchMove.call(this,event);
    mouseX = Graphics.pageToCanvasX(event.pageX);
    mouseY = Graphics.pageToCanvasY(event.pageY);
    QJ.DD.mouseBox.pos.x = mouseX;
    QJ.DD.mouseBox.pos.y = mouseY;
};
$.TouchInput__onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
    $.TouchInput__onMouseMove.call(this,event);
    mouseX = Graphics.pageToCanvasX(event.pageX);
    mouseY = Graphics.pageToCanvasY(event.pageY);
    QJ.DD.mouseBox.pos.x = mouseX;
    QJ.DD.mouseBox.pos.y = mouseY;
};
//==========================================================
//
//==========================================================
Spriteset_Map.prototype.updateAllDoodadsBodyQJ = function() {
    for (let i=0,il=this._doodadsQJ.length;i<il;i++) {
        this._doodadsQJ[i].updateBody();
    }
};
//==========================================================
//
//==========================================================
$.Scene_Map_initialize = Scene_Map.prototype.initialize;
Scene_Map.prototype.initialize = function() {
    $.Scene_Map_initialize.call(this);
    this.doodadsActionWaitQJ = 0;
    this.doodadsEditorStatus = false;
};
$.Scene_Map_updateScene = Scene_Map.prototype.updateScene;
Scene_Map.prototype.updateScene = function() {
    if ($gameSystem.doodadsQJ.editing!=this.doodadsEditorStatus) {
        if (this.doodadsEditorStatus) {
            this.hideDoodadsMainObject();
        } else {
            this.openDoodadsMainObject();
        }
        this.doodadsEditorStatus=$gameSystem.doodadsQJ.editing;
    }
    if (this.doodadsActionWaitQJ>0) {
        this.doodadsActionWaitQJ--;
        return;
    }
    if ($gameSystem.doodadsQJ.editing) {
        if (Input.isPressed("G")) {
            $gameSystem.doodadsQJ.grid = !$gameSystem.doodadsQJ.grid;
            this.refreshDoodadsGridSnap();
            this.doodadsActionWaitQJ = 10;
        }
        if (Input.isPressed("R")) {
            $gameSystem.doodadsQJ.gridRegion = !$gameSystem.doodadsQJ.gridRegion;
            this.refreshDoodadsGridSnap();
            this.doodadsActionWaitQJ = 10;
        }
        if (this._doodadsWindowIndex==1) {//edit
            this.updateSelectDoodads();
            this.updateSelectDoodadsRect();
            this.updateWASDMoveScreenQJ(true);
            if (this.isCancalDoodadsQJ()) {
                this.selectDoodadsPage(0);
                SoundManager.playCursor();
            }
        } else if (this._doodadsWindowIndex==3) {//put
            this.updatePutNewDoodadsQJ();
            this.updateSelectDoodadsRect();
            this.updateWASDMoveScreenQJ(false);
            if (this.isCancalDoodadsQJ()) {
                SoundManager.playCursor();
                this._selectDoodadsImgWindowQJ.visible = true;
                this._selectDoodadsImgWindowQJ.activate();
                this._selectDoodadsImgWindowQJ.activate();
                this._doodadsWindowIndex=2;
                $gameSystem.doodadsQJ.addData = null;
                this._mouseCursorSpriteQJ.visible = false;
                this._editDoodadsWindowQJ.hide();
            }
        }
        return;
    }
    $.Scene_Map_updateScene.call(this);
};
$.Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
Scene_Map.prototype.isMenuEnabled = function() {
    if ($gameSystem.doodadsQJ.editing) return;
    return $.Scene_Map_isMenuEnabled.call(this);
};
$.Scene_Map_isDebugCalled = Scene_Map.prototype.isDebugCalled;
Scene_Map.prototype.isDebugCalled = function() {
    if ($gameSystem.doodadsQJ.editing) return;
    return $.Scene_Map_isDebugCalled.call(this);
};
Scene_Map.prototype.isCancalDoodadsQJ = function() {
    return Input.isPressed("cancel")||TouchInput.isCancelled();
};
Scene_Map.prototype.addNewDoodadsQJ = function(data) {
    $dataDoodadsQJ[$gameMap.mapId()].push(data);
    let sprite = new Sprite_DoodadQJ(data,this._spriteset);
    this._spriteset._doodadsQJ.push(sprite);
    this._spriteset._tilemap.addChild(sprite);
    return sprite;
};
Scene_Map.prototype.deleteSelectedDoodadsQJ = function() {
    if (!$gameSystem.doodadsQJ.selecting) return;
    for (let j=0,jData=$gameSystem.doodadsQJ.selecting,jl=jData.length,i,idata=QJ.DD.doodads();j<jl;j++) {
        i = idata.indexOf(jData[j].data);
        if (i>-1) {
            $dataDoodadsQJ[$gameMap.mapId()].splice(i,1);
            jData[j].setDead();
        }
   }
    $gameSystem.doodadsQJ.selecting = null;
    this.drawHelpWindowItems();
    this.refreshEditWindow();
    this.drawHelpWindow(1);
};
Scene_Map.prototype.updateWASDMoveScreenQJ = function(updateBody) {
    if (Input.isPressed("D")) {
        $gameMap.doScroll(6,1);
        this.doodadsActionWaitQJ = 5;
        if (updateBody) this._spriteset.updateAllDoodadsBodyQJ();
        this.refreshDoodadsGridSnap();
    } else if (Input.isPressed("S")) {
        $gameMap.doScroll(2,1);
        this.doodadsActionWaitQJ = 5;
        if (updateBody) this._spriteset.updateAllDoodadsBodyQJ();
        this.refreshDoodadsGridSnap();
    } else if (Input.isPressed("W")) {
        $gameMap.doScroll(8,1);
        this.doodadsActionWaitQJ = 5;
        if (updateBody) this._spriteset.updateAllDoodadsBodyQJ();
        this.refreshDoodadsGridSnap();
    } else if (Input.isPressed("A")) {
        $gameMap.doScroll(4,1);
        this.doodadsActionWaitQJ = 5;
        if (updateBody) this._spriteset.updateAllDoodadsBodyQJ();
        this.refreshDoodadsGridSnap();
    }
};
//==========================================================
//
//==========================================================
Scene_Map.prototype.updateSelectDoodads = function() {
    if (!this._spriteset) return;
    if ($gameSystem.doodadsQJ.movingItem[2]) {
        if (!TouchInput.isPressed()) {
            $gameSystem.doodadsQJ.movingItem = [0,0,false,null];
            for (let i of $gameSystem.doodadsQJ.selecting) {
                i.updateBody();
            }
        } else {
            let moveItemData = $gameSystem.doodadsQJ.movingItem;
            if (Input.isPressed("alt")) {
                let gridWidth = $gameSystem.doodadsQJ.gridX;
                let gridHeight = $gameSystem.doodadsQJ.gridY;
                let startX = ($gameMap.displayX()-Math.floor($gameMap.displayX()))*48;
                let startY = ($gameMap.displayY()-Math.floor($gameMap.displayY()))*48;
                let x = Math.floor(mouseX/gridWidth)*gridWidth+Math.floor(gridWidth/2)+startX;
                let y = Math.floor(mouseY/gridHeight)*gridHeight+Math.floor(gridHeight)+startY;
                let mx = x-moveItemData[3].x;
                let my = y-moveItemData[3].y;
                for (let i of $gameSystem.doodadsQJ.selecting) {
                    i.data.x += mx;
                    i.data.y += my;
                }
                moveItemData[0] = moveItemData[3].x;
                moveItemData[1] = moveItemData[3].y;
            } else {
                for (let i of $gameSystem.doodadsQJ.selecting) {
                    i.data.x += mouseX - moveItemData[0];
                    i.data.y += mouseY - moveItemData[1];
                }
                moveItemData[0] = mouseX;
                moveItemData[1] = mouseY;
            }
            //Opposite direction setting
            if (Input.isPressed("up")) moveItemData[1] += 1;
            if (Input.isPressed("down")) moveItemData[1] -= 1;
            if (Input.isPressed("left")) moveItemData[0] += 1;
            if (Input.isPressed("right")) moveItemData[0] -= 1;
            if ($gameSystem.doodadsQJ.selecting&&$gameSystem.doodadsQJ.selecting.length==1) {
                if (mouseX>=this._editDoodadsWindowQJ.screenWidth-this._editDoodadsWindowQJ.width) {
                    this._editDoodadsWindowQJ.animType = 0;
                    this._editDoodadsWindowQJ.x = 0;
                } else if (mouseX<=this._editDoodadsWindowQJ.width) {
                    this._editDoodadsWindowQJ.animType = 1;
                    this._editDoodadsWindowQJ.x = this._editDoodadsWindowQJ.screenWidth-this._editDoodadsWindowQJ.width;
                }
            }
        }
        this.refreshEditWindow();
        return;
    }
    if ($gameSystem.doodadsQJ.rectSelect[4]) {
        let data = $gameSystem.doodadsQJ.rectSelect;
        data[2] = mouseX;
        data[3] = mouseY;
        if (!TouchInput.isPressed()) {
            //===========================================
            data[4] = false;
            let box = (Math.abs(data[0]-data[2])<=2&&Math.abs(data[1]-data[3])<=2)?null:
                QJ.DD.box((data[0]+data[2])/2,(data[1]+data[3])/2,Math.abs(data[0]-data[2]),Math.abs(data[1]-data[3]));
            let sprites = this._spriteset._doodadsQJ,clickList=[];
            for (let i=0,id=sprites,il=sprites.length;i<il;i++) {
                if (sprites[i]&&sprites[i].bodyQJ) {
                    if (box) {
                        if (QJ.DD.judge(sprites[i].bodyQJ,box)) clickList.push(sprites[i]);
                    } else {
                        if (QJ.DD.judge(sprites[i].bodyQJ)) {
                            clickList.push(sprites[i]);
                            break;
                        }
                    }
                }
            }
            SoundManager.playCursor();
            $gameSystem.doodadsQJ.selecting = clickList.length==0?null:clickList;
            this.refreshEditWindow();
            this.drawHelpWindow(1);
            $gameSystem.doodadsQJ.rectSelect = [0,0,0,0,false,false];
            this.drawHelpWindowItems();
            //===========================================
        }
    } else {
        if (TouchInput.isPressed()) {
            if (Input.isPressed('control')&&Input.isPressed('V')&&$gameSystem.doodadsQJ.pasteData) {
                let newData = JsonEx.makeDeepCopy($gameSystem.doodadsQJ.pasteData);
                if (newData.posMode==0) {
                    newData.x = mouseX;
                    newData.y = mouseY;
                } else {
                    newData.x = mouseX+$gameMap.displayX()*48;
                    newData.y = mouseY+$gameMap.displayY()*48;
                }
                let sprite = this.addNewDoodadsQJ(newData);
                this.doodadsActionWaitQJ = 5;
                $gameSystem.doodadsQJ.selecting = [sprite];
                this.refreshEditWindow();
                return;
            }
            if ($gameSystem.doodadsQJ.selecting&&$gameSystem.doodadsQJ.selecting.length>0) {
                if ((this._editDoodadsWindowQJ.animType==1&&mouseX<=this._editDoodadsWindowQJ.screenWidth-this._editDoodadsWindowQJ.width)||
                    (this._editDoodadsWindowQJ.animType==0&&mouseX>=this._editDoodadsWindowQJ.width)) {
                    let newOrMove = true;
                    let sprites = $gameSystem.doodadsQJ.selecting;
                    for (let i=0,id=sprites,il=sprites.length;i<il;i++) {
                        if (sprites[i]&&sprites[i].bodyQJ) {
                            if (QJ.DD.judge(sprites[i].bodyQJ)) {
                                $gameSystem.doodadsQJ.movingItem = [mouseX,mouseY,true,sprites[i]];
                                newOrMove = false;
                                break;
                            }
                        }
                    }
                    if (newOrMove) {
                        $gameSystem.doodadsQJ.rectSelect = [mouseX,mouseY,mouseX,mouseY,true,false];
                    }
                }
            } else {
                if (mouseX>=this._editDoodadsWindowQJ.screenWidth-this._editDoodadsWindowQJ.width) {
                    this._editDoodadsWindowQJ.animType = 0;
                    this._editDoodadsWindowQJ.x = 0;
                } else if (mouseX<=this._editDoodadsWindowQJ.width) {
                    this._editDoodadsWindowQJ.animType = 1;
                    this._editDoodadsWindowQJ.x = this._editDoodadsWindowQJ.screenWidth-this._editDoodadsWindowQJ.width;
                }
                $gameSystem.doodadsQJ.rectSelect = [mouseX,mouseY,mouseX,mouseY,true,false];
            }
        } else {
            if ($gameSystem.doodadsQJ.selecting&&$gameSystem.doodadsQJ.selecting.length==1) {
                if (Input.isPressed('control')&&Input.isPressed('C')) {
                    $gameSystem.doodadsQJ.pasteData = JsonEx.makeDeepCopy($gameSystem.doodadsQJ.selecting[0].data);
                }
            }
            if ($gameSystem.doodadsQJ.selecting&&Input.isPressed('del')) {
                this.deleteSelectedDoodadsQJ();
                this.doodadsActionWaitQJ = 5;
            }
        }
    }
    if (!TouchInput.isPressed()&&$gameSystem.doodadsQJ.selecting&&$gameSystem.doodadsQJ.selecting.length==1) {
        if (Input.isPressed("H")) {
            if (this._editDoodadsWindowQJ.animStatus==0) {
                if (this._editDoodadsWindowQJ.visible) {
                    this._editDoodadsWindowQJ.hide();
                } else {
                    this.setEditWindow($gameSystem.doodadsQJ.selecting[0]);
                    this._editDoodadsWindowQJ.show();
                }
            }
        }
    }
};
Scene_Map.prototype.updatePutNewDoodadsQJ = function() {
    if (!this._spriteset) return;
    if (Input.isPressed("H")) {
        if (this._editDoodadsWindowQJ.animStatus==0) {
            if (this._editDoodadsWindowQJ.visible) {
                this._editDoodadsWindowQJ.hide();
            } else {
                this.setEditWindow(this._mouseCursorSpriteQJ,true);
                this._editDoodadsWindowQJ.show();
            }
        }
    }
    let sprite = this._mouseCursorSpriteQJ;
    let rectData = $gameSystem.doodadsQJ.rectSelect;
    let gridWidth = $gameSystem.doodadsQJ.gridX;
    let gridHeight = $gameSystem.doodadsQJ.gridY;
    let dx = $gameMap.displayX();
    let dy = $gameMap.displayY();
    if (rectData[4]&&!TouchInput.isPressed()) {
        rectData[2] = this._mouseCursorSpriteQJ.x+dx*48-gridWidth/2;
        rectData[3] = this._mouseCursorSpriteQJ.y+dy*48-gridHeight;
        //=====================================================
        let startX = Math.min(rectData[0],rectData[2])+gridWidth/2;
        let startY = Math.min(rectData[1],rectData[3])+gridHeight;
        let xNumber = Math.floor(Math.abs(rectData[0]-rectData[2])/gridWidth);
        let yNumber = Math.floor(Math.abs(rectData[1]-rectData[3])/gridHeight);
        for (let i=0;i<xNumber;i++) {
            for (let j=0;j<yNumber;j++) {
                let newData = JsonEx.makeDeepCopy($gameSystem.doodadsQJ.addData);
                if (newData.posMode==1) {
                    newData.x = startX+i*gridWidth;
                    newData.y = startY+j*gridHeight;
                } else {
                    newData.x = startX+i*gridWidth-dx*48;
                    newData.y = startY+j*gridHeight-dy*48;
                }
                this.addNewDoodadsQJ(newData);
            }
        }
        //=====================================================
        this.doodadsActionWaitQJ = 10;
        this._selectRectSpriteQJ.visible = false;
        $gameSystem.doodadsQJ.rectSelect = [0,0,0,0,false,false];
        return;
    } else if (rectData[4]&&!Input.isPressed("shift")) {
        this._selectRectSpriteQJ.visible = false;
        $gameSystem.doodadsQJ.rectSelect = [0,0,0,0,false,false];
        return;
    }
    if (Input.isPressed("shift")) {
        if (TouchInput.isPressed()) {
            if (!rectData[4]) {
                rectData[4] = true;
                rectData[5] = true;
                rectData[0] = this._mouseCursorSpriteQJ.x+dx*48-gridWidth/2;
                rectData[1] = this._mouseCursorSpriteQJ.y+dy*48-gridHeight;
                rectData[2] = rectData[0];
                rectData[3] = rectData[1];
                this._selectRectSpriteQJ.visible = true;
                if (this._editDoodadsWindowQJ.visible) {this._editDoodadsWindowQJ.hide();}
            } else {
                rectData[2] = this._mouseCursorSpriteQJ.x+dx*48-gridWidth/2;
                rectData[3] = this._mouseCursorSpriteQJ.y+dy*48-gridHeight;
            }
        }
    } else {
        if (TouchInput.isClicked()) {
            if ((this._editDoodadsWindowQJ.visible&&mouseX<Graphics.width-this._editDoodadsWindowQJ.width)||
                (!this._editDoodadsWindowQJ.visible)) {
                let newData = JsonEx.makeDeepCopy($gameSystem.doodadsQJ.addData);
                if (newData.posMode==1) {
                    newData.x = this._mouseCursorSpriteQJ.x+dx*48;
                    newData.y = this._mouseCursorSpriteQJ.y+dy*48;
                } else {
                    newData.x = this._mouseCursorSpriteQJ.x;
                    newData.y = this._mouseCursorSpriteQJ.y;
                }
                this.addNewDoodadsQJ(newData);
                this.doodadsActionWaitQJ = 2;
            }
        }
    }
};
//==========================================================
//
//==========================================================
$.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    $.Scene_Map_createAllWindows.call(this);
    this.createDoodadsEditor();
    this.hideDoodadsMainObject();
};
Scene_Map.prototype.createDoodadsEditor = function() {
    this._doodadsWindowsQJ = [];
    this.createDoodadsHelpWindow();
    this.createDoodadsMainWindow();
    this.createDoodadsEditWindow();
    this.createDoodadsImgSelectWindow();
    this.createDoodadsMouseCursorWindow();
    this.createDoodadsIconSelectWindow();
    this.createDoodadsTilesetSelectWindow();
    this.createDoodadsMapImportSelectWindow();
    this.createDoodadsGridSnapWindow();
    this.createDoodadsFindWindow();
    this.createDoodadsConfirmWindow();
};
Scene_Map.prototype.openDoodadsMainObject = function() {
    this._helpSpriteQJ.showQJ();
    this.clearDoodadsEditorData();
    this._mainDoodadsWindowQJ.show();
    this._doodadsWindowIndex = 0;
    this._spriteset.removeDoodadsQJ();
    if (!$dataDoodadsQJ[$gameMap.mapId()]) $dataDoodadsQJ[$gameMap.mapId()] = [];
    $gameSystem.doodadsQJ.lastData = JsonEx.makeDeepCopy($dataDoodadsQJ[$gameMap.mapId()]);
    this._spriteset.addDoodadsQJ();
    this.refreshDoodadsGridSnap();
    SoundManager.playCursor();
};
Scene_Map.prototype.hideDoodadsMainObject = function() {
    this._helpSpriteQJ.hideQJ();
    this.clearDoodadsEditorData();
    this._mainDoodadsWindowQJ.hide();
    this._doodadsWindowIndex = 0;
    this._gridSpriteQJ.visible = false;
    this._gridRegionSpriteQJ.visible = false;
    $gameSystem.doodadsQJ.pasteData = null;
};
Scene_Map.prototype.clearDoodadsEditorData = function() {
    $gameSystem.doodadsQJ.selecting = null;
    this.refreshEditWindow();
    $gameSystem.doodadsQJ.rectSelect = [0,0,0,0,false,false];
    this.doodadsMoveScreenXQJ = 0;
    this.doodadsMoveScreenYQJ = 0;
    $gameMap.centerScreenQJ(0);
    this._spriteset.updateAllDoodadsBodyQJ();
};
Scene_Map.prototype.createDoodadsHelpWindow = function() {
    //======================================================
    this._helpBitmapDoodadsQJ = new Bitmap(Graphics.width,72);
    this._itemBitmapDoodadsQJ = new Bitmap(72,72);
    let sprite = new Sprite(this._helpBitmapDoodadsQJ);
    let itemSprite = new Sprite(this._itemBitmapDoodadsQJ);
    itemSprite.x = Graphics.width - 72;
    sprite.addChild(itemSprite);
    let animDur = 15;
    sprite.visible = false;
    sprite.animStatus = 0;
    this.addChild(sprite);
    this.drawHelpWindow(0);
    sprite.showQJ = ()=>{
        sprite.opacity = 0;
        sprite.animStatus = 1;//0no 1show 2hide
        sprite.y = Graphics.height;
        sprite.animCount = animDur;
        sprite.visible = true;
    };
    sprite.hideQJ = ()=>{
        sprite.opacity = 255;
        sprite.animStatus = 2;
        sprite.y = Graphics.height - sprite.height;
        sprite.animCount = animDur;
    };
    sprite.update = ()=>{
        if (sprite.visible) {
            if (sprite.animStatus==2) {
                sprite.y+=sprite.height/animDur;
                sprite.opacity-=255/animDur;
                sprite.animCount--;
                if (sprite.animCount==0) {
                    sprite.animStatus=0;
                    sprite.visible = false;
                }
            }
            if (sprite.animStatus==1) {
                sprite.y-= sprite.height/animDur;
                sprite.opacity+=255/animDur;
                sprite.animCount--;
                if (sprite.animCount==0) sprite.animStatus=0;
            }
            if (sprite.animStatus==0) {
                if (mouseY>=Graphics.height-sprite.height) {
                    sprite.opacity = 100;
                } else {
                    sprite.opacity = 255;
                }
            }
        }
    };
    this._helpSpriteQJ = sprite;
    //======================================================
    this._selectRectBitmapDoodadsQJ = new Bitmap(Graphics.width,Graphics.height);
    this._selectRectSpriteQJ = new Sprite(this._selectRectBitmapDoodadsQJ);
    this._selectRectSpriteQJ.opacity = 100;
    this.addChild(this._selectRectSpriteQJ);
    //======================================================
    this._gridBitmapDoodadsQJ = new Bitmap(Graphics.width,Graphics.height);
    this._gridSpriteQJ = new Sprite(this._gridBitmapDoodadsQJ);
    this._gridSpriteQJ.visible = false;
    this.addChild(this._gridSpriteQJ);
    //======================================================
    this._gridRegionBitmapDoodadsQJ = new Bitmap(Graphics.width,Graphics.height);
    this._gridRegionBitmapDoodadsQJ.fontSize = 28;
    this._gridRegionSpriteQJ = new Sprite(this._gridRegionBitmapDoodadsQJ);
    this._gridRegionSpriteQJ.visible = false;
    this.addChild(this._gridRegionSpriteQJ);
    //======================================================
    this.refreshDoodadsGridSnap();
    //======================================================
};
Scene_Map.prototype.updateSelectDoodadsRect = function() {
    let data = $gameSystem.doodadsQJ.rectSelect;
    let bit = this._selectRectBitmapDoodadsQJ;
    let sprite = this._selectRectSpriteQJ;
    if (data[4]) {
        let dx = $gameMap.displayX();
        let dy = $gameMap.displayY();
        this._selectRectSpriteQJ.visible = true;
        let x = Math.min(data[0],data[2])//-(dx-Math.floor(dx));
        if (data[5]) x-=dx*48;
        let y = Math.min(data[1],data[3])//-(dy-Math.floor(dy));
        if (data[5]) y-=dy*48;
        let w = Math.abs(data[0]-data[2]),h = Math.abs(data[1]-data[3]);
        if (bit.width!=w||bit.height!=h) {
            bit.clear();
            bit.gradientFillRect(x,y,w,h,"#0a9eeb","#00517a",true);
            bit.fillRect(x,y,w,4,"#167adf");
            bit.fillRect(x,y+h-4,w,4,"#167adf");
            bit.fillRect(x,y,4,h,"#167adf");
            bit.fillRect(x+w-4,y,4,h,"#167adf");
        }
    } else {
        this._selectRectSpriteQJ.visible = false;
    }
};
Scene_Map.prototype.drawHelpWindow = function(id) {
    let bit = this._helpBitmapDoodadsQJ;
    let bw = bit.height;
    bit.clear();
    bit.paintOpacity = 180;
    bit.gradientFillRect(0,0,Graphics.width,bw,"#0a9eeb","#00517a",true);
    bit.gradientFillRect(Graphics.width-bw,0,bw,bw,"#eb990a","#eb4c0a",true);
    bit.fillRect(Graphics.width-bw,0,bw,2,"#a83100");
    bit.fillRect(Graphics.width-bw,bw-2,bw,2,"#a83100");
    bit.fillRect(Graphics.width-bw,0,2,bw,"#a83100");
    bit.fillRect(Graphics.width-2,0,2,bw,"#a83100");
    bit.paintOpacity = 230;
    if (typeof id == "number") {
        if (id==0) {
            id = ["Click the button to select."];
        } else if (id==1) {
            id = ["Click the doodads to select.  Press and release to select doodads in certain rectangle region.",
            "Press WASD to move screen.  Press H to hide/show edit window.",
            "Press the selected doodads and move mouse or press ←→↑↓ to move them."];
        } else if (id==2) {
            id = ["Select img and add new doodads.",
            "Press WASD to move Screen.",
            "Press H to hide or show edit window."];
        } else if (id==3) {
            id = ["Select a map to paste it`s doodads to the current map."];
        } else if (id==4) {
            id = ["Set the grid snap.",
            "Press G to show/hide grid snap.",
            "Press alt to adjust the doodad to grid."];
        } else if (id==5) {
            id = ["Find the doodad."];
        } else if (id==6) {
            id = ["Do you want to close doodads editing window without saving?",
                "If you choose Cancel And Close, all changes will not be save!"];
        }
    }
    if (id) {
        if (id[0]) bit.drawText(id[0],0,0,Graphics.width-bw,24,"center");
        if (id[1]) bit.drawText(id[1],0,24,Graphics.width-bw,24,"center");
        if (id[2]) bit.drawText(id[2],0,48,Graphics.width-bw,24,"center");
    }
};
Scene_Map.prototype.drawHelpWindowItems = function() {
    let bit = this._itemBitmapDoodadsQJ;
    bit.clear();
    let doodads = $gameSystem.doodadsQJ.selecting;
    if (doodads) {
        for (let i of doodads) {
            i.drawOnOtherBitmap(bit,0,0,72,72);
        }
        bit.fontSize = 18;
        bit.drawText(doodads.length,2,48,44,24,"right");
    }
};
Scene_Map.prototype.createDoodadsMouseCursorWindow = function() {
    //======================================================
    this._mouseCursorSpriteQJ = new Sprite_MouseDoodadsCursorQJ();
    this._mouseCursorSpriteQJ.visible = false;
    this.addChild(this._mouseCursorSpriteQJ);
    //======================================================
};
Scene_Map.prototype.selectDoodadsPage = function(index) {
    //======================================================
    if (index==5) {
        DataManager.saveDoodadsDataQJ();
        $gameSystem.showOrHideDoodadsWindow(false);
        this.hideDoodadsMainObject();
    } else if (index==6) {
        this._mainDoodadsWindowQJ.hide();
        this._doodadsWindowIndex = 9;
        this._confirmDoodadWindowQJ.activate();
        this._confirmDoodadWindowQJ.show();
        this.drawHelpWindow(6);
    } else if (index==1) {
        this._mainDoodadsWindowQJ.hide();
        this._doodadsWindowIndex = 2;
        this.drawHelpWindow(2);
        //==============================================place
        this._selectDoodadsImgWindowQJ.show();
        this.refreshSelectDoodadsImgWindowQJ();
    } else if (index==2) {
        this.updateWASDMoveScreenQJ(false);
        this._mainDoodadsWindowQJ.hide();
        this._doodadsWindowIndex = 1;
        this.drawHelpWindow(1);
    } else if (index==3) {
        this._spriteset.removeDoodadsQJ();
        $dataDoodadsQJ[$gameMap.mapId()] = [];
        this._mainDoodadsWindowQJ.activate();
    } else if (index==4) {
        this._mainDoodadsWindowQJ.deactivate();
        this._doodadsWindowIndex = 6;
        this.drawHelpWindow(3);
        //==============================================place
        this._selectMapImportWindowQJ.show();
    } else if (index==0) {
        this._mainDoodadsWindowQJ.show();
        this._doodadsWindowIndex = 0;
        $gameSystem.doodadsQJ.selecting = null;
        $gameSystem.doodadsQJ.rectSelect = [0,0,0,0,false,false];
        this.refreshEditWindow();
        this.refreshDoodadsMainWindowHelpQJ();
        this.drawHelpWindowItems();
    } else if (index==7) {
        this._mainDoodadsWindowQJ.hide();
        this._doodadsWindowIndex = 7;
        this.drawHelpWindow(4);
        this.refreshDoodadsGridSnapWindow();
    } else if (index==8) {
        this._mainDoodadsWindowQJ.hide();
        this._doodadsWindowIndex = 8;
        this.drawHelpWindow(5);
        //==============================================place
        this._findDoodadWindowQJ.show();
        this._findDoodadWindowQJ.working = true;
        this._findDoodadWindowQJ.refresh();
    }
    //this._mainDoodadsWindowQJ.activate();
    //======================================================
};
Scene_Map.prototype.refreshDoodadsMainWindowHelpQJ= function() {
    let win = this._mainDoodadsWindowQJ;
    let index= win.index();
    if (index>=0) {
        if (index==0) this.drawHelpWindow(["Select image and place doodads."]);
        else if (index==1) this.drawHelpWindow(["Edit doodads or paste the doodad."]);
        else if (index==2) this.drawHelpWindow(["Show doodads list."]);
        else if (index==3) this.drawHelpWindow(["Set the grid snap."]);
        else if (index==4) this.drawHelpWindow(["Clear all doodads."]);
        else if (index==5) this.drawHelpWindow(["Add all doodads in another map to current map."]);
        else if (index==6) this.drawHelpWindow(["Save setting and close."]);
        else if (index==7) this.drawHelpWindow(["Close without saving."]);
    } else {
        this.drawHelpWindow([]);
    }
};
//==========================================================
//
//==========================================================
Scene_Map.prototype.createDoodadsMainWindow = function() {
    let list = [
        {name:"Place Doodads",handler:()=>this.selectDoodadsPage(1)},
        {name:"Edit Doodads",handler:()=>this.selectDoodadsPage(2)},//
        {name:"Find Doodads",handler:()=>this.selectDoodadsPage(8)},//
        {name:"Grid Snap Setting",handler:()=>this.selectDoodadsPage(7)},//
        {name:"Clear All Doodads",handler:()=>this.selectDoodadsPage(3)},//
        {name:"Import From Another Map",handler:()=>this.selectDoodadsPage(4)},
        {name:"Save And Close",handler:()=>this.selectDoodadsPage(5)},//
        {name:"Cancel And Close",handler:()=>this.selectDoodadsPage(6)}//
    ];
    this._mainDoodadsWindowQJ = new Window_DoodadsSelectQJ({
        animType:0,
        list:list
    });
    this._mainDoodadsWindowQJ.select = function(index) {
        Window_Selectable.prototype.select.call(this,index);
        if (this.active&&SceneManager._scene&&
            SceneManager._scene.refreshDoodadsMainWindowHelpQJ) 
            SceneManager._scene.refreshDoodadsMainWindowHelpQJ();
    };
    for (let i of list) {
        this._mainDoodadsWindowQJ.setHandler(i.name,i.handler);
        this._mainDoodadsWindowQJ.addCommand(i.name,i.name);
    }
    this._mainDoodadsWindowQJ.setHandler("cancel",()=>this.selectDoodadsPage(6));
    this.addWindow(this._mainDoodadsWindowQJ)
    this._doodadsWindowsQJ.push(this._mainDoodadsWindowQJ);
};
Scene_Map.prototype.createDoodadsEditWindow = function() {
    this._editDoodadsWindowQJ = new Window_DoodadsEditQJ({
        animType:1,
        list:[],
        width:280,
        selectFun:(value)=>this.drawHelpWindow(value)
    });
    this.addWindow(this._editDoodadsWindowQJ)
    this._doodadsWindowsQJ.push(this._editDoodadsWindowQJ);
};
Scene_Map.prototype.refreshEditWindow = function() {
    let data = $gameSystem.doodadsQJ.selecting;
    let win = this._editDoodadsWindowQJ;
    if (data&&data.length>0) {
        win._handlers = {};
        win._list = [];
        if (data.length==1) {
            /*$gameSystem.doodadsQJ.oldSelectData = [$gameSystem.doodadsQJ.selecting[0].data,
                JsonEx.makeDeepCopy($gameSystem.doodadsQJ.selecting[0].data)];*/
            this.setEditWindow(data[0]);
            if (!win.visible) win.show();
            else win.refresh();
        } else {
            if (win.visible) win.hide();
        }
    } else {
        if (win.visible) win.hide();
    }
};
Scene_Map.prototype.setEditWindow = function(item,type) {//←→↑↓
    let itemData = item.data,list = [];
    let win = this._editDoodadsWindowQJ;
    win._handlers = {};
    win._list = [];
    if (!type) {
        list = list.concat([/*{name:"Reserve",enable:true,ext:{
            content:"Setting",
            inputType:0,
            help:["Reserve Setting.",""],
        },handler:()=>{
            let newData = JsonEx.makeDeepCopy($gameSystem.doodadsQJ.oldSelectData[1]);
            for (let i of QJ.DD.doodads()) {
                if (i==$gameSystem.doodadsQJ.oldSelectData[0]) {
                    $dataDoodadsQJ[$gameMap.mapId()][i] = newData;
                    break;
                }
            }
            $gameSystem.doodadsQJ.selecting[0].data = newData;
        }},*/
        {name:"Delete",enable:true,ext:{
            content:"Doodad",
            inputType:0,
            help:["Delete doodad.",""],
        },handler:()=>{
            this.deleteSelectedDoodadsQJ();
        }}]);
    } else {
        //
    }
    list = list.concat([
        {name:"Type",enable:false,ext:{
            content:itemData.bit[0]==0?"Doodads Img":(itemData.bit[0]==1?"IconSet":"Tileset"),
            inputType:0,
            help:["Doodads Img, IconSet or Tileset.",""],
        },handler:null},
        /*{name:"Url",enable:false,ext:{
            content:itemData.bit[0]==0?(parameters.folderName+itemData.bit[1]+itemData.bit[2]):(itemData.bit[0]==1?"system/IconSet":("tilesets/"+itemData.bit[1])),
            inputType:0,
            help:["The img url.",""],
        },handler:null},*/
        {name:"Pos Mode",enable:true,ext:{
            content:itemData.posMode,inputType:1,attribute:['posMode'],
            fixValue:(value)=>{
                value = (value==0||value==1)?value:1;
                if (value!=itemData.posMode) {
                    if (value==0) {//screen
                        itemData.x -= $gameMap.displayX()*48;
                        itemData.y -= $gameMap.displayY()*48;
                    } else if (value==1) {
                        itemData.x += $gameMap.displayX()*48;
                        itemData.y += $gameMap.displayY()*48;
                    }
                }
                return value;},
            left:(value)=>{value--;return value<0?1:value;},
            right:(value)=>{value++;return value>1?0:value;},
            help:["The position mode of doodad.   0->screen 1->map","Press ← or → to change. "],
        },handler:null}]);
    if (!type) {
        list = list.concat([
        {name:"X",enable:true,ext:{
            content:itemData.x,inputType:1,attribute:['x'],
            fixValue:(value)=>{value=Number(value);return (isNaN(Number(value))||!value)?(itemData.x?itemData.x:0):value;},
            left:(value)=>{return Number(value)-1;},
            right:(value)=>{return Number(value)+1;},
            help:["The x coordinate of doodad.","Press ← to subtract 1.Press → to add 1. "],
        },handler:null},
        {name:"Y",enable:true,ext:{
            content:itemData.y,inputType:1,attribute:['y'],
            fixValue:(value)=>{value=Number(value);return (isNaN(Number(value))||!value)?(itemData.x?itemData.x:0):value;},
            left:(value)=>{return Number(value)-1;},
            right:(value)=>{return Number(value)+1;},
            help:["The y coordinate of doodad.","Press ← to subtract 1.Press → to add 1. "],
        },handler:null}]);
    } else {
        //
    }
    list = list.concat([
        {name:"Z",enable:true,ext:{
            content:itemData.z,inputType:1,attribute:['z'],
            fixValue:(value)=>{value=Number(value);return (value>=0)?Math.floor(value*1000)/1000:3;},
            left:(value)=>{return Number(value)-1;},
            right:(value)=>{return Number(value)+1;},
            help:["The z of doodad.   Press ← to subtract 1.Press → to add 1.","0->lowest 3->player"],
        },handler:null},
        {name:"Rotation",enable:true,ext:{
            content:itemData.rotation,inputType:1,attribute:['rotation'],
            fixValue:(value)=>{value=Number(value);return (value<0||value>=360)?(Math.floor((value%360)*1000)/1000):((isNaN(Number(value))||!value)?0:(Math.floor(value*1000)/1000));},
            left:(value)=>{return Number(value)-5;},
            right:(value)=>{return Number(value)+5;},
            help:["The rotation of doodad. range 0-360.","Press ← to subtract 5 degree.Press → to add 5 degree. "],
        },handler:null},
        {name:"rotateSpeed",enable:true,ext:{
            content:itemData.rotateSpeed,inputType:1,attribute:['rotateSpeed'],
            fixValue:(value)=>{value=Number(value);return (value<0||value>=360)?(Math.floor((value%360)*1000)/1000):((isNaN(Number(value))||!value)?0:(Math.floor(value*1000)/1000));},
            left:(value)=>{return Number(value)-5;},
            right:(value)=>{return Number(value)+5;},
            help:["The rotation of doodad. range 0-360.","Press ← to subtract 5 degree.Press → to add 5 degree. "],
        },handler:null},
        {name:"Blend",enable:true,ext:{
            content:itemData.blend,inputType:1,attribute:['blend'],
            fixValue:(value)=>{value=Number(value);return (value==0||value==1||value==2||value==3)?value:0;},
            left:(value)=>{value--;return value<0?3:value;},
            right:(value)=>{value++;return value>3?0:value;},
            help:["The blend mode of doodad.   0->normal 1->add 2->multiply 3->screen","Press ← or → to change. "],
        },handler:null},
        {name:"Anchor X",enable:true,ext:{
            content:itemData.anchorX,inputType:1,attribute:['anchorX'],
            fixValue:(value)=>{value=Number(value);return (isNaN(Number(value))||!value)?1:Math.floor(value*1000)/1000;},
            left:(value)=>{return Math.floor((Number(value)-0.01)*1000)/1000;},
            right:(value)=>{return Math.floor((Number(value)+0.01)*1000)/1000;},
            help:["The x anchor of doodad.","Press ← to subtract 0.01.Press → to add 0.01. "],
        },handler:null},
        {name:"Anchor Y",enable:true,ext:{
            content:itemData.anchorY,inputType:1,attribute:['anchorY'],
            fixValue:(value)=>{value=Number(value);return (isNaN(Number(value))||!value)?1:Math.floor(value*1000)/1000;},
            left:(value)=>{return Math.floor((Number(value)-0.01)*1000)/1000;},
            right:(value)=>{return Math.floor((Number(value)+0.01)*1000)/1000;},
            help:["The y anchor of doodad.","Press ← to subtract 0.01.Press → to add 0.01. "],
        },handler:null},
        {name:"Opacity",enable:true,ext:{
            content:itemData.opacity,inputType:1,attribute:['opacity'],
            fixValue:(value)=>{value=Number(value);return (value>=0&&value<=1)?Math.floor(value*1000)/1000:1;},
            left:(value)=>{return Number(value)-0.05;},
            right:(value)=>{return Number(value)+0.05;},
            help:["The opacity of doodad. range 0-1.","Press ← to subtract 0.05.Press → to add 0.05. "],
        },handler:null},
        {name:"Red",enable:true,ext:{
            content:itemData.r,inputType:1,attribute:['r'],color:"#ff0000",
            fixValue:(value)=>{value=Number(value);return value>255?255:(value<-255?-255:Math.floor(value));},
            left:(value)=>{return Number(value)-15;},
            right:(value)=>{return Number(value)+15;},
            help:["The red tone of doodad. range -255 to 255.","Press ← to subtract 15.Press → to add 15. "],
        },handler:null},
        {name:"Green",enable:true,ext:{
            content:itemData.g,inputType:1,attribute:['g'],color:"#00ff00",
            fixValue:(value)=>{value=Number(value);return value>255?255:(value<-255?-255:Math.floor(value));},
            left:(value)=>{return Number(value)-15;},
            right:(value)=>{return Number(value)+15;},
            help:["The green tone of doodad. range -255 to 255.","Press ← to subtract 15.Press → to add 15. "],
        },handler:null},
        {name:"Blue",enable:true,ext:{
            content:itemData.b,inputType:1,attribute:['b'],color:"#0000ff",
            fixValue:(value)=>{value=Number(value);return value>255?255:(value<-255?-255:Math.floor(value));},
            left:(value)=>{return Number(value)-15;},
            right:(value)=>{return Number(value)+15;},
            help:["The blue tone of doodad. range -255 to 255.","Press ← to subtract 15.Press → to add 15. "],
        },handler:null},
        {name:"Grey",enable:true,ext:{
            content:itemData.grey,inputType:1,attribute:['grey'],color:"#888888",
            fixValue:(value)=>{value=Number(value);return (value>=0&&value<=255)?value:0;},
            left:(value)=>{return Number(value)-15;},
            right:(value)=>{return Number(value)+15;},
            help:["The grid tone of doodad. range 0 to 255.","Press ← to subtract 15.Press → to add 15. "],
        },handler:null},
        {name:"Scale X",enable:true,ext:{
            content:itemData.scaleX,inputType:1,attribute:['scaleX'],
            fixValue:(value)=>{value=Number(value);return (isNaN(Number(value))||!value)?1:Math.floor(value*1000)/1000;},
            left:(value)=>{return Math.floor((Number(value)-0.01)*1000)/1000;},
            right:(value)=>{return Math.floor((Number(value)+0.01)*1000)/1000;},
            help:["The x scale of doodad. 1 is initial scale.","Press ← to subtract 0.01.Press → to add 0.01. "],
        },handler:null},
        {name:"Scale Y",enable:true,ext:{
            content:itemData.scaleY,inputType:1,attribute:['scaleY'],
            fixValue:(value)=>{value=Number(value);return (isNaN(Number(value))||!value)?1:Math.floor(value*1000)/1000;},
            left:(value)=>{return Math.floor((Number(value)-0.01)*1000)/1000;},
            right:(value)=>{return Math.floor((Number(value)+0.01)*1000)/1000;},
            help:["The y scale of doodad. 1 is initial scale.","Press ← to subtract 0.01.Press → to add 0.01. "],
        },handler:null},
        {name:"X Frame",enable:true,ext:{
            content:itemData.xFrame,inputType:1,attribute:['xFrame'],
            fixValue:(value)=>{value=Number(value);return (value>=1)?Math.floor(value):1;},
            left:(value)=>{return Number(value)-1;},
            right:(value)=>{return Number(value)+1;},
            help:["The x frame.Please see the help of plugin.",""],
        },handler:null},
        {name:"Y Frame",enable:true,ext:{
            content:itemData.yFrame,inputType:1,attribute:['yFrame'],
            fixValue:(value)=>{value=Number(value);return (value>=1)?Math.floor(value):1;},
            left:(value)=>{return Number(value)-1;},
            right:(value)=>{return Number(value)+1;},
            help:["The y frame.Please see the help of plugin.",""],
        },handler:null},
        {name:"FrameUpdate",enable:true,ext:{
            content:itemData.frameUpdate,inputType:1,attribute:['frameUpdate'],
            fixValue:(value)=>{value=Number(value);return (value>=0)?Math.floor(value):0;},
            left:(value)=>{return Number(value)-1;},
            right:(value)=>{return Number(value)+1;},
            help:["The interval time of two frame.",""],
        },handler:null},
        {name:"Switch",enable:true,ext:{
            content:itemData.switch,inputType:1,attribute:['switch'],
            fixValue:(value)=>{return value;},
            help:["The switch that control the visiblility of doodads.",
            "Write switchId|status to add a control switch, use ~ to separate two or more switch.",
            "e.g: 5|true refer the doodad shows when switch 5 is on/true.   5|false~6|true~7/false"],
        },handler:null},
        {name:"Condition",enable:true,ext:{
            content:itemData.condition,inputType:1,attribute:['condition'],
            fixValue:(value)=>{return value;},
            help:["The js script.",
            "e.g: $gameVariables.value(5)>10 "],
        },handler:null},
    ]);
    list = list.concat([
        {name:"Blur",enable:true,ext:{
            content:itemData.blur,inputType:1,attribute:['blur'],
            fixValue:(value)=>{value=Number(value);return (value>=0&&value<=200)?Math.floor(value):0;},
            left:(value)=>{return Number(value)-10;},
            right:(value)=>{return Number(value)+10;},
            help:["The blur of doodad.(0-200)","Press ← to subtract 10.Press → to add 10. "],
        },handler:null},
        {name:"Contrast",enable:true,ext:{
            content:itemData.contrast,inputType:1,attribute:['contrast'],
            fixValue:(value)=>{value=Number(value);return (value>=0&&value<=100)?Math.floor(value):0;},
            left:(value)=>{return Number(value)-10;},
            right:(value)=>{return Number(value)+10;},
            help:["The contrast of doodad.(0-100)","Press ← to subtract 10.Press → to add 10. "],
        },handler:null},
        {name:"Sepia",enable:true,ext:{
            content:itemData.sepia?"true":"false",inputType:3,attribute:['sepia'],
            fixValue:(value)=>{return !eval(value);},
            help:["The sepia of doodad.(true/false)"],
        },handler:null},
        {name:"Hue",enable:true,ext:{
            content:itemData.hue,inputType:1,attribute:['hue'],
            fixValue:(value)=>{value=Number(value);return (value>=0&&value<=360)?Math.floor(value):0;},
            left:(value)=>{return Number(value)-15;},
            right:(value)=>{return Number(value)+15;},
            help:["The hue of doodad.(0-360)","Press ← to subtract 15.Press → to add 15. "],
        },handler:null},
        {name:"Bright",enable:true,ext:{
            content:itemData.bright?"true":"false",inputType:3,attribute:['bright'],
            fixValue:(value)=>{return !eval(value);},
            help:["The brightness of doodad.(true/false)"],
        },handler:null},
    ]);
    list = this.addNewDoodadEditAttribute(list,itemData,win);
    for (let i of list) {
        win.setHandler(i.name,i.handler);
        win.addCommand(i.name,i.name,i.enable,i.ext);
    }
    win.editingData = item;
    win.height = win.calculateHeight(list.length);
    win.createContents();
    win.paint();
};
Scene_Map.prototype.addNewDoodadEditAttribute = function(list,doodadData,editWindow) {
    return list;
}
Scene_Map.prototype.createDoodadsImgSelectWindow = function() {
    this._selectDoodadsImgWindowQJ = new Window_DoodadsImgSelectQJ({
        animType:0,
        list:[],
        width:280,
    });
    this.addWindow(this._selectDoodadsImgWindowQJ)
    this._doodadsWindowsQJ.push(this._selectDoodadsImgWindowQJ);
};
Scene_Map.prototype.doodadsImgSelect = function(name) {
    this._selectDoodadsImgWindowQJ.folderLayer++;
    this.refreshSelectDoodadsImgWindowQJ(name);
};
Scene_Map.prototype.doodadsImgCancel = function() {
    this._selectDoodadsImgWindowQJ.folderLayer--;
    if (this._selectDoodadsImgWindowQJ.folderLayer<0) {
        this._selectDoodadsImgWindowQJ.hide();
        this.selectDoodadsPage(0);
    } else {
        this.refreshSelectDoodadsImgWindowQJ();
    }
};
Scene_Map.prototype.selectDoodadsImgQJ = function(id,data1,data2) {
    let win = this._selectDoodadsImgWindowQJ;
    if (id==0) {
        let dir = data1.substr(folderName.length);
        let url = dir+data2;
        this._doodadsWindowIndex = 3;
        if (!preLoadData[url]) preLoadData[url] = QJ.DD.addTexture(ImageManager.loadBitmap(data1,data2));
        win.visible = false;
        win.deactivate();
        let newData = QJ.DD.standardStruct();
        newData.bit=[0,dir,data2];
        $gameSystem.doodadsQJ.addData = newData;
        this._mouseCursorSpriteQJ.setBase(newData)
        this._mouseCursorSpriteQJ.visible = true;
        this._editDoodadsWindowQJ.animType = 1;
        this.setEditWindow(this._mouseCursorSpriteQJ,true);
        this._editDoodadsWindowQJ.show();
        this.drawHelpWindow(2);
    } else if (id==1) {
        this._doodasIconSelectWindowQJ.show();
        this._doodadsWindowIndex = 4;
    } else if (id==2) {
        let tilesetsName = $gameMap.tileset().tilesetNames;
        for (let i=tilesetsName.length-1;i>=tilesetsName.length-4;i--) {
            if (tilesetsName[i]&&tilesetsName[i].length>0&&!preLoadData["*2/"+tilesetsName[i]]) 
                preLoadData["*2/"+tilesetsName[i]] = QJ.DD.addTexture(ImageManager.loadTileset(tilesetsName[i]));
        }
        this._doodasTilesetSelectWindowQJ.show();
        this._doodasTilesetSelectWindowQJ.paint();
        this._doodadsWindowIndex = 5;
    }
};
Scene_Map.prototype.refreshSelectDoodadsImgWindowQJ = function(name) {
    let win = this._selectDoodadsImgWindowQJ,layerData;
    win._handlers = {};
    win._list = [];
    win.setHandler("cancel",()=>this.doodadsImgCancel());
    if (win.folderData.length-1==win.folderLayer) {
        layerData = win.folderData[win.folderData.length-1];
    } else if (win.folderData.length-1>win.folderLayer) {//subtract
        if (win.folderData.length>=2) {
            layerData = win.folderData[win.folderData.length-2];
            win.folderData.splice(win.folderData.length-1,1);
            win.folderNameData.splice(win.folderNameData.length-1,1);
        } else layerData = {};
    } else if (win.folderData.length-1<win.folderLayer) {//add
        layerData = win.folderData[win.folderData.length-1][name];
        win.folderData.push(layerData);
        win.folderNameData.push(name);
    } else return;
    let folderIndex = 0;
    if (win.folderLayer==0) {
        folderIndex += 2;
        win.setHandler("IconSet Img",()=>this.selectDoodadsImgQJ(1));
        win.addCommandHead("IconSet Img","IconSet Img",true,{isFolder:true});
        win.setHandler("Tilesets Img",()=>this.selectDoodadsImgQJ(2));
        win.addCommandHead("Tilesets Img","Tilesets Img",true,{isFolder:true});
    }
    folderIndex += 1;
    win.setHandler("../Previous Folder",()=>this.doodadsImgCancel());
    win.addCommandHead("../Previous Folder","../Previous Folder",true,{isFolder:true});
    for (let i in layerData) {
        if (typeof layerData[i] == "string") {
            win.setHandler(i,()=>this.selectDoodadsImgQJ(0,win.getUrlNameNow(),win.commandName(win.index())));
            win.addCommand(i,i,true,{isFolder:false});
        } else {
            win.setHandler(i,()=>this.doodadsImgSelect(win.commandName(win.index())));
            win.addCommandHead(i,i,true,{isFolder:true},folderIndex);
            folderIndex++;
        }
    }
    win.height = win.calculateHeight(win._list.length);
    win.createContents();
    win.select(0);
    win.activate();
    win.refresh();
};
Scene_Map.prototype.createDoodadsIconSelectWindow = function() {
    //======================================================
    this._doodasIconSelectWindowQJ = new Window_DoodadsIconSelectQJ();
    this._doodasIconSelectWindowQJ.setHandler('cancel',()=>{
        this._doodasIconSelectWindowQJ.hide();
        this._selectDoodadsImgWindowQJ.activate();
        this._doodadsWindowIndex=2;
        $gameSystem.doodadsQJ.addData = null;
        this._mouseCursorSpriteQJ.visible = false;
    });
    this._doodasIconSelectWindowQJ.setHandler('ok',()=>{
        let iconWin = this._doodasIconSelectWindowQJ;
        let extraData = iconWin.rangeSelect;
        let win = this._selectDoodadsImgWindowQJ;
        this._doodadsWindowIndex = 3;
        win.visible = false;
        win.deactivate();
        let newData = QJ.DD.standardStruct();
        newData.bit=[1];
        newData.frameX = extraData[1];
        newData.frameY = extraData[2];
        newData.frameW = extraData[3];
        newData.frameH = extraData[4];
        $gameSystem.doodadsQJ.addData = newData;
        this._mouseCursorSpriteQJ.setBase(newData)
        this._mouseCursorSpriteQJ.visible = true;
        this._editDoodadsWindowQJ.animType = 1;
        this.setEditWindow(this._mouseCursorSpriteQJ,true);
        this._editDoodadsWindowQJ.show();
        this.drawHelpWindow(2);
        iconWin.hide();
    });
    this.addWindow(this._doodasIconSelectWindowQJ);
    this._doodadsWindowsQJ.push(this._doodasIconSelectWindowQJ);
    //======================================================
};
Scene_Map.prototype.createDoodadsTilesetSelectWindow = function() {
    //======================================================
    this._doodasTilesetSelectWindowQJ = new Window_DoodadsTilesetSelectQJ();
    this._doodasTilesetSelectWindowQJ.setHandler('cancel',()=>{
        this._doodasTilesetSelectWindowQJ.hide();
        this._selectDoodadsImgWindowQJ.activate();
        this._doodadsWindowIndex=2;
        $gameSystem.doodadsQJ.addData = null;
        this._mouseCursorSpriteQJ.visible = false;
    });
    this._doodasTilesetSelectWindowQJ.setHandler('ok',()=>{
        let iconWin = this._doodasTilesetSelectWindowQJ;
        let extraData = iconWin.rangeSelect;
        let win = this._selectDoodadsImgWindowQJ;
        this._doodadsWindowIndex = 3;
        win.visible = false;
        win.deactivate();
        let newData = QJ.DD.standardStruct();
        newData.bit=[2,extraData[0]];
        newData.frameX = extraData[1];
        newData.frameY = extraData[2]%(48*16);
        newData.frameW = extraData[3];
        newData.frameH = extraData[4];
        $gameSystem.doodadsQJ.addData = newData;
        this._mouseCursorSpriteQJ.setBase(newData)
        this._mouseCursorSpriteQJ.visible = true;
        this._editDoodadsWindowQJ.animType = 1;
        this.setEditWindow(this._mouseCursorSpriteQJ,true);
        this._editDoodadsWindowQJ.show();
        this.drawHelpWindow(2);
        iconWin.hide();
    });
    this.addWindow(this._doodasTilesetSelectWindowQJ);
    this._doodadsWindowsQJ.push(this._doodasTilesetSelectWindowQJ);
    //======================================================
};
Scene_Map.prototype.createDoodadsMapImportSelectWindow = function() {
    //======================================================
    this._selectMapImportWindowQJ = new Window_DoodadsSelectQJ({
        animType:1,
        list:[]
    });
    this._selectMapImportWindowQJ.refresh = function() {
        this._list = [];
        let mapInfoDatas = $dataMapInfos;
        for (let i=1,il=mapInfoDatas.length,mapInfom,nowMapId=$gameMap.mapId();i<il;i++) {
            mapInfo = mapInfoDatas[i];
            if (!mapInfo) continue;
            if (mapInfo.id==nowMapId||!$dataDoodadsQJ[mapInfo.id]) continue;
            let mapId = mapInfo.id.padZero(3);
            let mapName = mapInfo.name;
            this.addCommand(mapId+":"+mapName, 'ok', true,{mapId:mapInfo.id});
        }
        this.height = this.calculateHeight(this._list.length);
        this.createContents();
        Window_Selectable.prototype.refresh.call(this);
    };
    this._selectMapImportWindowQJ.setHandler("cancel",()=>{
        this._mainDoodadsWindowQJ.activate();
        this._selectMapImportWindowQJ.hide();
        this._doodadsWindowIndex=2;
    });
    this._selectMapImportWindowQJ.setHandler('ok',()=>{
        let win = this._selectMapImportWindowQJ;
        this._spriteset.removeDoodadsQJ();
        $dataDoodadsQJ[$gameMap.mapId()] = $dataDoodadsQJ[$gameMap.mapId()].concat(
            $dataDoodadsQJ[win._list[win.index()].ext.mapId]);
        this._mainDoodadsWindowQJ.activate();
        this._selectMapImportWindowQJ.hide();
        this._doodadsWindowIndex=2;
        this._spriteset.addDoodadsQJ();
    });
    this.addWindow(this._selectMapImportWindowQJ)
    this._doodadsWindowsQJ.push(this._selectMapImportWindowQJ);
    //======================================================
};
Scene_Map.prototype.createDoodadsFindWindow = function() {
    //======================================================
    this._findDoodadWindowQJ = new Window_DoodadsSelectQJ({
        animType:1,
        list:[],
        width:320
    });
    this._findDoodadWindowQJ.select = function(index) {
        Window_Selectable.prototype.select.call(this,index);
        if (!(this._list&&this._list.length>0&&this.index()>=0&&this.working)) return;
        let doodadSprite = this._list[this.index()].ext.data;
        if (doodadSprite.data.posMode==1) $gameMap.centerScreenQJ(2,doodadSprite.data.x,doodadSprite.data.y);
        $gameSystem.doodadsQJ.selecting = [doodadSprite];
    };
    this._findDoodadWindowQJ.refresh = function() {
        if (!this.working) return;
        this._list = [];
        let doodadsData = SceneManager._scene._spriteset._doodadsQJ;//QJ.DD.doodads();
        let index = 0;
        for (let i of doodadsData) {
            if (i.data.bit[0]==0) {
                this.addCommand(index+"-"+i.data.bit[2]+"-"+i.data.x+" "+i.data.y,'ok',true,{data:i});
            } else if (i.data.bit[0]==1) {
                this.addCommand(index+"-IconSet "+i.data.x+"-"+i.data.y,'ok',true,{data:i});
            } else if (i.data.bit[0]==2) {
                this.addCommand(index+"-"+i.data.bit[1]+"-"+i.data.x+" "+i.y,'ok',true,{data:i});
            }
            index++;
        }
        this.height = this.calculateHeight(this._list.length);
        this.createContents();
        Window_Selectable.prototype.refresh.call(this);
    };
    this._findDoodadWindowQJ.itemTextAlign = function() {
        return "left";
    };
    this._findDoodadWindowQJ.setHandler("cancel",()=>{
        this._mainDoodadsWindowQJ.show();
        this._findDoodadWindowQJ.hide();
        this._doodadsWindowIndex=2;
        $gameSystem.doodadsQJ.selecting = null;
        this._findDoodadWindowQJ.working = false;
    });
    this._findDoodadWindowQJ.setHandler('ok',()=>{
        this._findDoodadWindowQJ.activate();
    });
    this.addWindow(this._findDoodadWindowQJ)
    this._doodadsWindowsQJ.push(this._findDoodadWindowQJ);
    //======================================================
};
Scene_Map.prototype.createDoodadsGridSnapWindow = function() {
    //======================================================
    this._doodadsGridSnapWindow = new Window_DoodadsGridSnapQJ();
    this._doodadsGridSnapWindow.setHandler("cancel",()=>this.refreshDoodadsGridSnapWindow());
    this._doodadsGridSnapWindow.setHandler("ok",()=>this.refreshDoodadsGridSnap());
    this.addWindow(this._doodadsGridSnapWindow)
    this._doodadsWindowsQJ.push(this._doodadsGridSnapWindow);
    //======================================================
};
Scene_Map.prototype.refreshDoodadsGridSnapWindow = function() {
    if (this._doodadsGridSnapWindow.visible) {
        this._doodadsGridSnapWindow.deactivate();
        this._doodadsGridSnapWindow.hide();
        this.selectDoodadsPage(0);
    } else {
        this._doodadsGridSnapWindow.activate();
        this._doodadsGridSnapWindow.show();
    }
};
Scene_Map.prototype.refreshDoodadsGridSnap = function() {
    //======================================================
    this._gridBitmapDoodadsQJ.clear();
    this._gridSpriteQJ.opacity = $gameSystem.doodadsQJ.gridO;
    this._gridSpriteQJ.visible = $gameSystem.doodadsQJ.grid;
    let dx = $gameMap.displayX();
    let dy = $gameMap.displayY();
    let w = $gameSystem.doodadsQJ.gridX;
    let h = $gameSystem.doodadsQJ.gridY;
    let startX = -(dx-Math.floor(dx))*48;
    let startY = -(dy-Math.floor(dy))*48;
    let endX = Math.ceil(Graphics.width/w);
    let endY = Math.ceil(Graphics.height/h);
    for (let i=0,il=endX;i<il;i++) {
        this._gridBitmapDoodadsQJ.fillRect(startX+i*w-1,startY+0,2,Graphics.height,"#000000");
    }
    for (let j=0,jl=endY;j<jl;j++) {
        this._gridBitmapDoodadsQJ.fillRect(startX+0,startY+j*h-1,Graphics.width,2,"#000000");
    }
    //======================================================
    this._gridRegionBitmapDoodadsQJ.clear();
    this._gridRegionSpriteQJ.opacity = $gameSystem.doodadsQJ.gridRegionO;
    this._gridRegionSpriteQJ.visible = $gameSystem.doodadsQJ.gridRegion;
    const regionColorList = ['#c17575','#c19b75','#c1c175','#9bc175','#75c175','#75c19b','#75c1c1','#759bc1','#7575c1','#9b75c1','#9b75c1','#c175c1'];
    w = $gameMap.tileWidth();
    h = $gameMap.tileHeight();
    startX = Math.floor(dx);
    startY = Math.floor(dy);
    endX = startX+Math.ceil(Graphics.width/w);
    endY = startY+Math.ceil(Graphics.height/h);
    let regionId,color,getRegion = $gameMap.regionId.bind($gameMap);
    for (let i=startX;i<endX;i++) {
        for (let j=startY;j<endY;j++) {
            regionId = getRegion(i,j);
            if (regionId>0) {
                color = regionColorList[(regionId-1) % 12];
                this._gridRegionBitmapDoodadsQJ.fillRect((i-dx)*w,(j-dy)*h,w,h,color);
                this._gridRegionBitmapDoodadsQJ.drawText(regionId,(i-dx)*w,(j-dy)*h,w,h,"center");
            }
        }
    }
    //======================================================
};
Scene_Map.prototype.createDoodadsConfirmWindow = function() {
    //======================================================
    this._confirmDoodadWindowQJ = new Window_DoodadsConfirmQJ();
    this._confirmDoodadWindowQJ.setHandler("back",()=>{
        this._spriteset.removeDoodadsQJ();
        $dataDoodadsQJ[$gameMap.mapId()] = JsonEx.makeDeepCopy($gameSystem.doodadsQJ.lastData);
        this._spriteset.addDoodadsQJ();
        $gameSystem.showOrHideDoodadsWindow(false);
        this.hideDoodadsMainObject();
        this._confirmDoodadWindowQJ.deactivate();
        this._confirmDoodadWindowQJ.hide();
    });
    this._confirmDoodadWindowQJ.setHandler("cancel",()=>{
        this._confirmDoodadWindowQJ.deactivate();
        this._confirmDoodadWindowQJ.hide();
        this.selectDoodadsPage(0);
    });
    this._confirmDoodadWindowQJ.setHandler("ok",()=>{
        this.selectDoodadsPage(5);
        this._confirmDoodadWindowQJ.deactivate();
        this._confirmDoodadWindowQJ.hide();
    });
    this.addWindow(this._confirmDoodadWindowQJ)
    this._doodadsWindowsQJ.push(this._confirmDoodadWindowQJ);
    //======================================================
};
//==========================================================
//
//==========================================================
function Window_DoodadsConfirmQJ() {
    this.initialize(...arguments);
}
Window_DoodadsConfirmQJ.prototype = Object.create(Window_Command.prototype);
Window_DoodadsConfirmQJ.prototype.constructor = Window_DoodadsGridSnapQJ;
Window_DoodadsConfirmQJ.prototype.initialize = function() {
    let height = 2*this.itemHeight()+8*3;
    let width = 280;
    Window_Command.prototype.initialize.call(this, new Rectangle(
        Math.floor((Graphics.boxWidth-width)/2),Math.floor((Graphics.boxHeight-height)/2),
        width,height));
    this.deactivate();
    this.hide();
};
Window_DoodadsConfirmQJ.prototype.makeCommandList = function() {
    this.addCommand("Save And Close", "ok");
    this.addCommand("Cancel And Close","back");
};
Window_DoodadsConfirmQJ.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    this.resetTextColor();
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, "center");
};
//==========================================================
//
//==========================================================
function Window_DoodadsGridSnapQJ() {
    this.initialize(...arguments);
}
Window_DoodadsGridSnapQJ.prototype = Object.create(Window_Command.prototype);
Window_DoodadsGridSnapQJ.prototype.constructor = Window_DoodadsGridSnapQJ;
Window_DoodadsGridSnapQJ.prototype.initialize = function() {
    let height = 6*this.itemHeight()+8*3;
    let width = 280;
    Window_Command.prototype.initialize.call(this, new Rectangle(
        Math.floor((Graphics.boxWidth-width)/2),Math.floor((Graphics.boxHeight-height)/2),
        width,height));
    this.deactivate();
    this.hide();
};
Window_DoodadsGridSnapQJ.prototype.makeCommandList = function() {
    this.addCommand("Show Grid", "show");
    this.addCommand("Width","width");
    this.addCommand("Height","height");
    this.addCommand("Opacity","opacity");
    this.addCommand("Region Grid", "regionShow");
    this.addCommand("Region Opacity", "regionOpacity");
};
Window_DoodadsGridSnapQJ.prototype.drawItem = function(index) {
    const title = this.commandName(index);
    const status = this.statusText(index);
    const rect = this.itemLineRect(index);
    const statusWidth = this.statusWidth();
    const titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.drawText(title, rect.x, rect.y, titleWidth, "left");
    this.drawText(status, rect.x + titleWidth, rect.y, statusWidth, "right");
};
Window_DoodadsGridSnapQJ.prototype.statusWidth = function() {
    return 120;
};
Window_DoodadsGridSnapQJ.prototype.statusText = function(index) {
    if (index==0) return $gameSystem.doodadsQJ.grid?"show":"hide";
    else if (index==1) return $gameSystem.doodadsQJ.gridX;
    else if (index==2) return $gameSystem.doodadsQJ.gridY;
    else if (index==3) return $gameSystem.doodadsQJ.gridO;
    else if (index==4) return $gameSystem.doodadsQJ.gridRegion?"show":"hide";
    else if (index==5) return $gameSystem.doodadsQJ.gridRegionO;
};
Window_DoodadsGridSnapQJ.prototype.processOk = function() {
    if (this.index()==0) {
        $gameSystem.doodadsQJ.grid=!$gameSystem.doodadsQJ.grid;
        this.refresh();
        this.callHandler("ok");
    } else if (this.index()==4) {
        $gameSystem.doodadsQJ.gridRegion=!$gameSystem.doodadsQJ.gridRegion;
        this.refresh();
        this.callHandler("ok");
    }
};
Window_DoodadsGridSnapQJ.prototype.cursorRight = function() {
    let index = this.index();
    if (index==0) $gameSystem.doodadsQJ.grid=!$gameSystem.doodadsQJ.grid;
    else if (index==1) $gameSystem.doodadsQJ.gridX=Math.min(Math.floor(Graphics.width/2),$gameSystem.doodadsQJ.gridX+1);
    else if (index==2) $gameSystem.doodadsQJ.gridY=Math.min(Math.floor(Graphics.height/2),$gameSystem.doodadsQJ.gridY+1);
    else if (index==3) $gameSystem.doodadsQJ.gridO=Math.min(255,$gameSystem.doodadsQJ.gridO+5);
    else if (index==4) $gameSystem.doodadsQJ.gridRegion=!$gameSystem.doodadsQJ.gridRegion;
    else if (index==5) $gameSystem.doodadsQJ.gridRegionO=Math.min(255,$gameSystem.doodadsQJ.gridRegionO+5);
    this.refresh();
    this.callHandler("ok");
};
Window_DoodadsGridSnapQJ.prototype.cursorLeft = function() {
    let index = this.index();
    if (index==0) $gameSystem.doodadsQJ.grid=!$gameSystem.doodadsQJ.grid;
    else if (index==1) $gameSystem.doodadsQJ.gridX=Math.max(2,$gameSystem.doodadsQJ.gridX-1);
    else if (index==2) $gameSystem.doodadsQJ.gridY=Math.max(2,$gameSystem.doodadsQJ.gridY-1);
    else if (index==3) $gameSystem.doodadsQJ.gridO=Math.max(0,$gameSystem.doodadsQJ.gridO-5);
    else if (index==4) $gameSystem.doodadsQJ.gridRegion=!$gameSystem.doodadsQJ.gridRegion;
    else if (index==5) $gameSystem.doodadsQJ.gridRegionO=Math.max(0,$gameSystem.doodadsQJ.gridRegionO-5);
    this.refresh();
    this.callHandler("ok");
};
//==========================================================
//
//==========================================================
function Window_DoodadsTilesetSelectQJ() {
    this.initialize(...arguments);
}
Window_DoodadsTilesetSelectQJ.prototype = Object.create(Window_Command.prototype);
Window_DoodadsTilesetSelectQJ.prototype.constructor = Window_DoodadsTilesetSelectQJ;
Window_DoodadsTilesetSelectQJ.prototype.initialize = function() {
    let width = 16*48+16*2;
    Window_Command.prototype.initialize.call(this,new Rectangle(
        Math.floor((Graphics.boxWidth-width)/2),0,width,Graphics.height-8));
    this.hide();
    this._clientArea.removeChild(this._cursorSprite);
    this._clientArea.addChild(this._cursorSprite);
    this.rectSelectData = [-1,-1];
    this.cursorScale = [1,1];
    this.rangeSelect = null;
};
Window_DoodadsTilesetSelectQJ.prototype.isTouchScrollEnabled = function() {
    return this.isScrollEnabled()&&!Input.isPressed('shift');
};
Window_DoodadsTilesetSelectQJ.prototype.hoverHitIndex = function() {
    const touchPos = new Point(mouseX, mouseY);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y);
};
Window_DoodadsTilesetSelectQJ.prototype.processOk = function() {
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    if (!this.rangeSelect) {
        let extraData = this._list[this.index()].ext;
        this.rangeSelect = [extraData.tilesetName,extraData.index%16*48,Math.floor(extraData.index/16)*48,48,48];
    }
    this.callOkHandler();
};
Window_DoodadsTilesetSelectQJ.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (this.rectSelectData[0]>=0) {
            let col = this.maxCols();
            if (!TouchInput.isPressed()) {
                this.rectSelectData[1] = this.hitIndex();
                this.setCursorRect(0,0,48,48);
                let extraData = this._list[this.index()].ext;
                let startX = this.rectSelectData[0]%col;
                let startY = Math.floor(this.rectSelectData[0]/col);
                let endX = this.rectSelectData[1]%col;
                let endY = Math.floor(this.rectSelectData[1]/col);
                if (Math.floor(endY/16)!=Math.floor(startY/16)) {
                    if (startY>endY) {
                        endY = Math.floor(startY/16)*16;
                    } else if (startY<endY) {
                        endY = Math.floor(startY/16)*16+15;
                    }
                }
                let xDis = Math.abs(endX-startX);
                let yDis = Math.abs(endY-startY);
                this.rangeSelect = [extraData.tilesetName,
                    startX*48-(endX>=startX?0:48*xDis),
                    startY*48-(endY>=startY?0:48*yDis),
                    48*xDis+48,
                    48*yDis+48];
                this.processOk();
                this.rectSelectData[0] = -1;
                this.rectSelectData[1] = -1;
            } else {
                let lastIndex = this.rectSelectData[0];
                let hitIndex = this.hoverHitIndex();
                let startX = lastIndex%col;
                let startY = Math.floor(lastIndex/col);
                let endX = hitIndex%col;
                let endY = Math.floor(hitIndex/col);
                if (Math.floor(endY/16)!=Math.floor(startY/16)) {
                    if (startY>endY) {
                        endY = Math.floor(startY/16)*16;
                    } else if (startY<endY) {
                        endY = Math.floor(startY/16)*16+15;
                    }
                }
                let xDis = Math.abs(endX-startX);
                let yDis= Math.abs(endY-startY);
                const rect = this.itemRect(lastIndex);
                this.setCursorRect(
                    rect.x-(endX>=startX?0:48*xDis),
                    rect.y-(endY>=startY?0:48*yDis),
                    48*xDis+48,
                    48*yDis+48);
            }
            return;
        }
        if (this.isHoverEnabled() && TouchInput.isHovered()) {
            this.onTouchSelect(false);
        } else if (TouchInput.isTriggered()) {
            this.onTouchSelect(true);
        }
        if (TouchInput.isClicked()) {
            this.onTouchOk();
        } else if (TouchInput.isCancelled()) {
            this.onTouchCancel();
        } else if (Input.isPressed('shift')&&TouchInput.isPressed()) {
            if (this.rectSelectData[0]<0) this.rectSelectData[0] = this.hitIndex();
        }
    }
};
Window_DoodadsTilesetSelectQJ.prototype.colSpacing = function() {
    return 0;
};
Window_DoodadsTilesetSelectQJ.prototype.show = function() {
    Window_Command.prototype.show.call(this);
    this.rangeSelect = null;
    this.activate();
};
Window_DoodadsTilesetSelectQJ.prototype.hide = function() {
    Window_Command.prototype.hide.call(this);
    this.rangeSelect = null;
    this.deactivate();
};
Window_DoodadsTilesetSelectQJ.prototype.rowSpacing = function() {
    return 0;
};
Window_DoodadsTilesetSelectQJ.prototype.maxCols = function() {
    return 16;
};
Window_DoodadsTilesetSelectQJ.prototype.itemWidth = function() {
    return 48;
};
Window_DoodadsTilesetSelectQJ.prototype.itemHeight = function() {
    return 48;
};
Window_DoodadsTilesetSelectQJ.prototype.makeCommandList = function() {
    let tilesetsName = $gameMap.tileset().tilesetNames,imgList = [];
    for (let i=tilesetsName.length-1;i>=tilesetsName.length-4;i--) {
        if (tilesetsName[i]&&tilesetsName[i].length>0) {
            imgList.unshift(tilesetsName[i]);
            for (let j=0;j<256;j++) {
                this.addCommand('','Tileset',true,{tilesetName:tilesetsName[i],index:j});
            }
        }
    }
};
Window_DoodadsTilesetSelectQJ.prototype.drawItem = function(index) {
    const rect = this.itemRect(index);
    const extraData = this._list[index].ext;
    const sx = extraData.index%16;
    const sy = Math.floor(extraData.index/16);
    this.contents.blt(ImageManager.loadTileset(extraData.tilesetName),sx*48,sy*48,48,48,rect.x,rect.y);
};
Window_DoodadsTilesetSelectQJ.prototype.processCursorMove = function() {

};
//==========================================================
//
//==========================================================
function Window_DoodadsIconSelectQJ() {
    this.initialize(...arguments);
}
Window_DoodadsIconSelectQJ.prototype = Object.create(Window_Command.prototype);
Window_DoodadsIconSelectQJ.prototype.constructor = Window_DoodadsIconSelectQJ;
Window_DoodadsIconSelectQJ.prototype.initialize = function() {
    let width = this.maxCols()*(32+4)+16*2;
    Window_Command.prototype.initialize.call(this,new Rectangle(
        Math.floor((Graphics.boxWidth-width)/2),0,width,Graphics.height-8));
    this.hide();
    this._clientArea.removeChild(this._cursorSprite);
    this._clientArea.addChild(this._cursorSprite);
    this.rectSelectData = [-1,-1];
    this.cursorScale = [1,1];
    this.rangeSelect = null;
};
Window_DoodadsIconSelectQJ.prototype.isTouchScrollEnabled = function() {
    return this.isScrollEnabled()&&!Input.isPressed('shift');
};
Window_DoodadsIconSelectQJ.prototype.hoverHitIndex = function() {
    const touchPos = new Point(mouseX, mouseY);
    const localPos = this.worldTransform.applyInverse(touchPos);
    return this.hitTest(localPos.x, localPos.y);
};
Window_DoodadsIconSelectQJ.prototype.processOk = function() {
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    if (!this.rangeSelect) {
        let iconIndex = this._list[this.index()].ext.iconIndex;
        this.rangeSelect = [null,(iconIndex%16)*32,Math.floor(iconIndex/16)*32,32,32];
    }
    this.callOkHandler();
};
Window_DoodadsIconSelectQJ.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (this.rectSelectData[0]>=0) {
            let col = this.maxCols();
            if (!TouchInput.isPressed()) {
                this.rectSelectData[1] = this.hitIndex();
                this.setCursorRect(0,0,36,36);
                let extraData = this._list[this.index()].ext;
                let startX = this.rectSelectData[0]%col;
                let startY = Math.floor(this.rectSelectData[0]/col);
                let endX = this.rectSelectData[1]%col;
                let endY = Math.floor(this.rectSelectData[1]/col);
                let xDis = Math.abs(endX-startX);
                let yDis = Math.abs(endY-startY);
                this.rangeSelect = [extraData.tilesetName,
                    startX*32-(endX>=startX?0:32*xDis),
                    startY*32-(endY>=startY?0:32*yDis),
                    32*xDis+32,
                    32*yDis+32];
                this.processOk();
                this.rectSelectData[0] = -1;
                this.rectSelectData[1] = -1;
            } else {
                let lastIndex = this.rectSelectData[0];
                let hitIndex = this.hoverHitIndex();
                let startX = lastIndex%col;
                let startY = Math.floor(lastIndex/col);
                let endX = hitIndex%col;
                let endY = Math.floor(hitIndex/col);
                let xDis = Math.abs(endX-startX);
                let yDis= Math.abs(endY-startY);
                const rect = this.itemRect(lastIndex);
                this.setCursorRect(
                    rect.x-(endX>=startX?0:36*xDis),
                    rect.y-(endY>=startY?0:36*yDis),
                    36*xDis+36,
                    36*yDis+36);
            }
            return;
        }
        if (this.isHoverEnabled() && TouchInput.isHovered()) {
            this.onTouchSelect(false);
        } else if (TouchInput.isTriggered()) {
            this.onTouchSelect(true);
        }
        if (TouchInput.isClicked()) {
            this.onTouchOk();
        } else if (TouchInput.isCancelled()) {
            this.onTouchCancel();
        } else if (Input.isPressed('shift')&&TouchInput.isPressed()) {
            if (this.rectSelectData[0]<0) this.rectSelectData[0] = this.hitIndex();
        }
    }
};
Window_DoodadsIconSelectQJ.prototype.colSpacing = function() {
    return 0;
};
Window_DoodadsIconSelectQJ.prototype.show = function() {
    Window_Command.prototype.show.call(this);
    this.rangeSelect = null;
    this.activate();
};
Window_DoodadsIconSelectQJ.prototype.hide = function() {
    Window_Command.prototype.hide.call(this);
    this.rangeSelect = null;
    this.deactivate();
};
Window_DoodadsIconSelectQJ.prototype.rowSpacing = function() {
    return 0;
};
Window_DoodadsIconSelectQJ.prototype.maxCols = function() {
    return 16;
};
Window_DoodadsIconSelectQJ.prototype.itemWidth = function() {
    return 36;
};
Window_DoodadsIconSelectQJ.prototype.itemHeight = function() {
    return 36;
};
Window_DoodadsIconSelectQJ.prototype.makeCommandList = function() {
    let bitmap = ImageManager.loadSystem('IconSet');
    let rows = Math.floor(bitmap.height/32);
    for (let i=0,length=rows*this.maxCols();i<length;i++) {
        this.addCommand(i,'IconSet',true,{iconIndex:i});
    }
};
Window_DoodadsIconSelectQJ.prototype.drawItem = function(index) {
    const rect = this.itemRect(index);
    const icon = this._list[index].ext.iconIndex;
    this.drawIcon(icon,rect.x+2,rect.y+2);
};
Window_DoodadsIconSelectQJ.prototype.processCursorMove = function() {

};
//==========================================================
//
//==========================================================
function Window_DoodadsSelectQJ() {
    this.initialize(...arguments);
}
Window_DoodadsSelectQJ.prototype = Object.create(Window_Command.prototype);
Window_DoodadsSelectQJ.prototype.constructor = Window_DoodadsSelectQJ;
Window_DoodadsSelectQJ.prototype.initialize = function(data) {
    this.data = data;
    this.animType = data.animType;
    this.animCountMax = 15;
    this.animCount = 15;
    this.animStatus = 0;
    this.screenWidth = Graphics.width-8;
    Window_Selectable.prototype.initialize.call(this, new Rectangle(0,0,data.width?data.width:280,
        this.calculateHeight(data.list?data.list.length:0)));
    this._list = [];
    this.select(0);
    this.visible = false;
};
Window_DoodadsSelectQJ.prototype.calculateHeight = function(length) {
    return Math.min(Graphics.height-72-16,32*length+12*2)
};
Window_DoodadsSelectQJ.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
};
Window_DoodadsSelectQJ.prototype.itemHeight = function() {
    return 24+8;
};
Window_DoodadsSelectQJ.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    this.resetFontSettings();
    this.contents.fontSize = 24;
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};
Window_DoodadsSelectQJ.prototype.show = function() {
    this.opacity = 0;
    this.animStatus = 1;
    if (this.animType==0) {
        this.x = -this.width;
    } else {
        this.x = this.screenWidth;
    }
    this.animCount = this.animCountMax;
    this.visible = true;
    this.refresh();
    this.activate();
};
Window_DoodadsSelectQJ.prototype.hide = function() {
    this.opacity = 255;
    this.animStatus = 2;
    if (this.animType==0) {
        this.x = 0;
    } else {
        this.x = this.screenWidth-this.width;
    }
    this.animCount = this.animCountMax;
};
Window_DoodadsSelectQJ.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    if (this.visible) {
        if (this.animStatus==2) {
            if (this.animType==0) {
                this.x-=this.width/this.animCountMax;
            } else {
                this.x+=this.width/this.animCountMax;
            }
            this.opacity-=255/this.animCountMax;
            this.animCount--;
            if (this.animCount<=0) {
                this.animStatus=0;
                this.visible = false;
                this.deactivate();
            }
        }
        if (this.animStatus==1) {
            if (this.animType==0) {
                this.x+=this.width/this.animCountMax;
            } else {
                this.x-=this.width/this.animCountMax;
            }
            this.opacity+=255/this.animCountMax;
            this.animCount--;
            if (this.animCount<=0) {
                this.animStatus=0;
                this.openRefresh();
            }
        }
    }
};
Window_DoodadsSelectQJ.prototype.openRefresh = function() {

};
//==========================================================
//
//==========================================================
function Window_DoodadsEditQJ() {
    this.initialize(...arguments);
}
Window_DoodadsEditQJ.prototype = Object.create(Window_DoodadsSelectQJ.prototype);
Window_DoodadsEditQJ.prototype.constructor = Window_DoodadsEditQJ;
Window_DoodadsEditQJ.prototype.initialize = function(data) {
    this.defaultCssData = `
        position: absolute;
        z-index:12;
        color: #FFFFFF;
        transform: translate(-100%, 0%);
        text-align: right;
        font-family: GameFont;
        background: rgba(100,100,100,1);
    `;
    this.selectFun = data.selectFun;
    this.inputElement = document.createElement("input");
    this.focusInput = false;
    this.inputElement.onfocus = ()=>this.focusInput = true;
    this.inputElement.onblur = ()=>this.focusInput = false;
    document.body.appendChild(this.inputElement);
    this.hideElements();
    window.addEventListener("resize",this.refreshElements.bind(this), false);
    this.inputtingStatus = false;
    Window_DoodadsSelectQJ.prototype.initialize.call(this,data);
    this.editingData = null;
    this.buttonChangeValueCool = 0;
};
Window_DoodadsEditQJ.prototype.destroy = function(options) {
    Window_Base.prototype.destroy.call(this, options);
    window.removeEventListener("resize",this.refreshElements.bind(this));
    this.inputElement.remove();
    this.editingData = null;
};
Window_DoodadsEditQJ.prototype.hide = function() {
    Window_DoodadsSelectQJ.prototype.hide.call(this);
    this.select(-1);
    this.editingData = null;
};
Window_DoodadsEditQJ.prototype.scrollTo = function(x, y) {
    Window_Scrollable.prototype.scrollTo.call(this,x,y);
    this.refreshElements(!this.inputtingStatus);
    this.hideElements();
};
Window_DoodadsEditQJ.prototype.smoothScrollTo = function(x, y) {
    Window_Scrollable.prototype.smoothScrollTo.call(this,x,y);
    this.refreshElements(!this.inputtingStatus);
    this.hideElements();
};
Window_DoodadsEditQJ.prototype.refreshElements = function(hide) {
    if (hide||!this.inputtingStatus||!this._list||this.index()<0||this.animStatus!=0) {
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
                this.setElement(this.inputElement,this.x+rect.x+rect.width+22,this.y+rect.y+22+
                    (-this.scrollY()%this.itemHeight()));
                if (this.editingData) {
                    let attribute = this._list[this.index()].ext.attribute;
                    if (attribute.length==1) {
                        this.inputElement.value = this.editingData.data[attribute[0]];
                    } else if (attribute.length==2) {
                        this.inputElement.value = this.editingData.data[attribute[0]][attribute[1]];
                    } else if (attribute.length==3) {
                        this.inputElement.value = this.editingData.data[attribute[0]][attribute[1]][attribute[2]];
                    }
                }
                Input.setPreventDefaultQJ(false);
            }
        }
        this.selectFun(this._list[this.index()].ext.help);
        //==========================================
    }
};
Window_DoodadsEditQJ.prototype.hideElements = function() {
    this.setElement(this.inputElement,Graphics.width/2,Graphics.height/2,true);
};
Window_DoodadsEditQJ.prototype.openRefresh = function() {

};
Window_DoodadsEditQJ.prototype.setElement = function(ele,px,py,hide) {
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
Window_DoodadsEditQJ.prototype.loadInputElement = function() {
    return this.inputElement.value;
};
Window_DoodadsEditQJ.prototype.update = function() {
    Window_DoodadsSelectQJ.prototype.update.call(this);
    if (this.buttonChangeValueCool>0) this.buttonChangeValueCool--;
    else if (this.editingData){
        if (this.inputtingStatus&&this.index()>-1&&(
            (this.animType==1&&mouseX>=this.screenWidth-this.width)||
            (this.animType==0&&mouseX<=this.width))) {
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
                        oldValue = this.editingData.data[attribute[0]];
                    } else if (attribute.length==2) {
                        oldValue = this.editingData.data[attribute[0]][attribute[1]];
                    } else if (attribute.length==3) {
                        oldValue = this.editingData.data[attribute[0]][attribute[1]][attribute[2]];
                    }
                    newValue = ext.fixValue(oldValue);
                    if (attribute.length==1) {
                        this.editingData.data[attribute[0]] = newValue;
                    } else if (attribute.length==2) {
                        this.editingData.data[attribute[0]][attribute[1]] = newValue;
                    } else if (attribute.length==3) {
                        this.editingData.data[attribute[0]][attribute[1]][attribute[2]] = newValue;
                    }
                    ext.content = newValue?"true":"false";
                    this.onloadElementData();
                    this.buttonChangeValueCool = 8;
                    SoundManager.playCursor();
                }
            }
        }
    }
};
Window_DoodadsEditQJ.prototype.select = function(index) {
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
        Input.setPreventDefaultQJ(true);
        //this.selectFun(1);
    }
};
Window_DoodadsEditQJ.prototype.onloadElementData = function() {
    if (!this.editingData) return;
    let newValue,attribute;
    let type = this._list[this.index()].ext.inputType;
    if (type==1) {
        newValue = this._list[this.index()].ext.fixValue(this.inputElement.value);
        attribute = this._list[this.index()].ext.attribute;
        if (attribute.length==1) {
            this.editingData.data[attribute[0]] = newValue;
        } else if (attribute.length==2) {
            this.editingData.data[attribute[0]][attribute[1]] = newValue;
        } else if (attribute.length==3) {
            this.editingData.data[attribute[0]][attribute[1]][attribute[2]] = newValue;
        }
        this._list[this.index()].ext.content = newValue;
        this.inputElement.value = newValue;
    } else if (type==2) {
        //
    } else if (type==3) {
        //
    } else return;
    this.editingData.setBase();
    this.paint();
};
Window_DoodadsEditQJ.prototype.drawItem = function(index) {
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
Window_DoodadsEditQJ.prototype.processCursorMove = function() {

};
//==========================================================
//
//==========================================================
function Window_DoodadsImgSelectQJ() {
    this.initialize(...arguments);
}
Window_DoodadsImgSelectQJ.prototype = Object.create(Window_DoodadsSelectQJ.prototype);
Window_DoodadsImgSelectQJ.prototype.constructor = Window_DoodadsImgSelectQJ;
Window_DoodadsImgSelectQJ.prototype.initialize = function(data) {
    this.folderLayer = 0;
    this.folderData = null;
    this.folderNameData = null;
    Window_DoodadsSelectQJ.prototype.initialize.call(this,data);
};
Window_DoodadsImgSelectQJ.prototype.itemHeight = function() {
    return 36;
};
Window_DoodadsImgSelectQJ.prototype.hide = function() {
    Window_DoodadsSelectQJ.prototype.hide.call(this);
    this.select(-1);
    this.folderNameData = null;
    this.folderData = null;
    this.folderLayer = 0;
};
Window_DoodadsImgSelectQJ.prototype.show = function() {
    Window_DoodadsSelectQJ.prototype.show.call(this);
    this.folderNameData = [folderName.substr(0,folderName.length-1)];
    this.folderData = [saveFilesDoodadsQJ];
    this.folderLayer = 0;
    this.select(0);
};
Window_DoodadsImgSelectQJ.prototype.getUrlNameNow = function() {
    return this.folderNameData.join("/")+"/";
};
Window_DoodadsImgSelectQJ.prototype.drawItem = function(index) {
    const rect = this.itemLineRect(index);
    const align = this.itemTextAlign();
    const ext = this._list[index].ext;
    this.resetFontSettings();
    if (ext.color) this.changeTextColor(ext.color);
    this.contents.fontSize = 24;
    this.changePaintOpacity(this.isCommandEnabled(index));
    if (ext.isFolder) {
        this.drawText(this.commandName(index)+"/", rect.x, rect.y, rect.width,"left");
    } else {
        let img = ImageManager.loadBitmap(this.getUrlNameNow(),this.commandName(index));
        this.drawDoodadsImg(img,rect.x+2,rect.y+2,32,32);
        this.drawText(this.commandName(index), rect.x+36, rect.y, rect.width-36,"left");
    }
};
Window_DoodadsImgSelectQJ.prototype.addCommandHead = function(name, symbol, enabled = true, ext = null, index) {
    this._list.splice(index,0,{ name: name, symbol: symbol, enabled: enabled, ext: ext });
};
Window_DoodadsImgSelectQJ.prototype.drawDoodadsImg = function(img,x,y,w,h) {
    if (!img.isReady()) {
        setTimeout(this.drawDoodadsImg.bind(this,img,x,y,w,h),5);
        return
    }
    let bw = img.width;
    let bh = img.height;
    let scale = Math.min(w/bw,h/bh);
    this.contents.blt(img,0,0,bw,bh,
        x+(w-bw*scale)/2,
        y+(h-bh*scale)/2,
        bw*scale,bh*scale);
};
//==========================================================
//
//==========================================================
Sprite_MouseDoodadsCursorQJ.prototype = Object.create(Sprite_DoodadQJ.prototype);
Sprite_MouseDoodadsCursorQJ.prototype.constructor = Sprite_MouseDoodadsCursorQJ;
Sprite_MouseDoodadsCursorQJ.prototype.initialize = function(data) {
    PIXI.Sprite.call(this);//new PIXI.Texture(ImageManager.loadDoodadsQJ(this.data.bit))
};
Sprite_MouseDoodadsCursorQJ.prototype.setBase = function(data) {
    //=========================================
    if (data) this.data = data;
    if (!this.data) return;
    this.texture = new PIXI.Texture(ImageManager.loadDoodadsQJ(this.data.bit))
    Sprite_DoodadQJ.prototype.setBase.call(this);
    this.update();
    //=========================================
};
Sprite_MouseDoodadsCursorQJ.prototype.update = function() {
    if (!this.visible) return;
    if (Input.isPressed("alt")||Input.isPressed("shift")) {
        let dx = $gameMap.displayX();
        let dy = $gameMap.displayY();
        let startX = -(dx-Math.floor(dx))*48;
        let startY = -(dy-Math.floor(dy))*48;
        let gridWidth = $gameSystem.doodadsQJ.gridX;
        let gridHeight = $gameSystem.doodadsQJ.gridY;
        let x = Math.floor((mouseX-startX)/gridWidth)*gridWidth+Math.floor(gridWidth/2)+startX;
        let y = Math.floor((mouseY-startY)/gridHeight)*gridHeight+Math.floor(gridHeight)+startY;
        this.x = x;
        this.y = y;
    } else {
        this.x = mouseX;
        this.y = mouseY;
    }
};
Sprite_MouseDoodadsCursorQJ.prototype.updateBody = function() {

};
//==========================================================
//
//==========================================================
//==========================================================
//
//==========================================================
}
//================================================================================================================================
//==========)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))
//================================================================================================================================
})(QJ.DD.reWrite);
//==========================================================
//
//==========================================================