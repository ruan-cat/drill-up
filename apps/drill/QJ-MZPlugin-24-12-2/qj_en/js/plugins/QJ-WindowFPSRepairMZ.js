//==========================================================
// RPG Maker MZ QJ-WindowFPSRepairMZ
//==========================================================
/*:
 * @target MZ
 * @plugindesc [Window_xxx FPS Repair][v1.0]
 * @author Qiu Jiu
 *
 *
 * @help
 * 
 * The window_xxx is heavy in MZ because of the filter, especially in the compute whose screen refresh rate is more than 60.
 * This plugins resolv the problem.
 *
*/
/*:zh
 * @target MZ
 * @plugindesc [窗口掉帧优化][v1.0]
 * @author Qiu Jiu
 *
 *
 * @help
 * 
 * 本插件优化了窗口性能
 *
 * 1.截取窗口区域的地方使用了AlphaFilter故而卡，但我只是改了个Filter，
 *   改成Frame可能会更好，有时间再改ORZ。
 * 2.绘制窗口背景图案的地方使用了TileingSprite，我只是改成了mv的画布绘
 *   制方式，不帧刷新绘制或者使用webgl绘制会更好，有时间再改ORZ。
 * 3.最好放在插件列表的最上面。
 * 4.重写函数：
 *     Window.prototype._refreshBack
 *
*/
//==========================================================
//
//==========================================================
(($ = {})=>{
//==========================================================
//
//==========================================================
$.Window__createBackSprite = Window.prototype._createBackSprite;
Window.prototype._createBackSprite = function() {
    $.Window__createBackSprite.apply(this,arguments);
    this._backSprite.removeChild(this._backSprite.children[0]);
    //如果不预设一个1*1的bitmap那么这个sprite就不会正常显示
    this._backSprite.addChildAt(new Sprite(new Bitmap(1,1)),0);
};
//==========================================================
//不太理解为什么使用AlphaFilter来实现这个效果，这个AlphaFilter在别处并没有使用到（？大概？）。
//this._clientArea.filters = [new PIXI.filters.AlphaFilter()];
//==========================================================
$.Window__createClientArea = Window.prototype._createClientArea;
Window.prototype._createClientArea = function() {
    $.Window__createClientArea.apply(this,arguments);
    this._clientArea.filters = [new PIXI.Filter()];
};
//==========================================================
//这个东西没法修改只能重写了。
//这里我只是改成了mv的实现方式，但肯定还有大的优化空间。
//这种修改方式应该影响不了其他UI插件吧。
//==========================================================
Window.prototype._refreshBack = function() {
    const m = this._margin;
    const w = Math.max(0, this._width - m * 2);
    const h = Math.max(0, this._height - m * 2);
    const sprite = this._backSprite;
    const tilingSprite = sprite.children[0];
    sprite.bitmap = this._windowskin;
    sprite.setFrame(0, 0, 95, 95);
    sprite.move(m, m);
    sprite.scale.x = w / 95;
    sprite.scale.y = h / 95;

    //因为MZ中每次blt时baseTexture都进行更新，很拖慢帧率，所以这里不直接使用blt。
    let bitmap = tilingSprite.bitmap;
    let skinBitmap = this._windowskin._canvas || this._windowskin._image;
    bitmap.clear();
    if (w > 0 && h > 0 && skinBitmap) {
        if (tilingSprite.bitmap.width!=w) {
            tilingSprite.bitmap = new Bitmap(w,h);
            //mz相比mv这里的显示起点不一样了，所以不需要这句了。
            //tilingSprite.move(m, m);
        }
        let p = 96;
        for (let y = 0; y < h; y += p) {
            for (let x = 0; x < w; x += p) {
                bitmap._context.drawImage(skinBitmap, 0, p, p, p, x, y, p, p);
            }
        }
        bitmap._baseTexture.update();
        tilingSprite.scale.x = 1 / sprite.scale.x;
        tilingSprite.scale.y = 1 / sprite.scale.y;
    }
    //sprite设置了色调后其子类也会自动有那个色调所以tilingSprite没有必要再设置色调了

    sprite.setColorTone(this._colorTone);
};
//==========================================================
//
//==========================================================
})();
//==========================================================
//
//==========================================================