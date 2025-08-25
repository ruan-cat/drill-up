//=============================================================================
// ShaderTilemap.js
//=============================================================================

/**
 * 使用着色器显示2D基于瓦片游戏地图的瓦片地图。
 * The tilemap which displays 2D tile-based game map using shaders.
 *
 * @class ShaderTilemap
 * @constructor
 */
function ShaderTilemap() {
	Tilemap.apply(this, arguments);
	this.roundPixels = true;
}

ShaderTilemap.prototype = Object.create(Tilemap.prototype);
ShaderTilemap.prototype.constructor = ShaderTilemap;

// 一些平台需要这个常量（Samsung S4, S5, Tab4, HTC One H8）
// we need this constant for some platforms (Samsung S4, S5, Tab4, HTC One H8)
PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
PIXI.settings.GC_MODE = PIXI.GC_MODES.AUTO;
PIXI.tilemap.TileRenderer.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
PIXI.tilemap.TileRenderer.DO_CLEAR = true;

/**
 * 在渲染器中上传动画状态。
 * Uploads animation state in renderer.
 *
 * @method _hackRenderer
 * @param {Object} renderer 渲染器 The renderer
 * @return {Object} 修改后的渲染器 The modified renderer
 * @private
 */
ShaderTilemap.prototype._hackRenderer = function (renderer) {
	var af = this.animationFrame % 4;
	if (af == 3) af = 1;
	renderer.plugins.tilemap.tileAnim[0] = af * this._tileWidth;
	renderer.plugins.tilemap.tileAnim[1] = (this.animationFrame % 3) * this._tileHeight;
	return renderer;
};

/**
 * PIXI Canvas渲染方法。
 * PIXI render method.
 *
 * @method renderCanvas
 * @param {Object} renderer PIXI渲染器 PIXI renderer
 */
ShaderTilemap.prototype.renderCanvas = function (renderer) {
	this._hackRenderer(renderer);
	PIXI.Container.prototype.renderCanvas.call(this, renderer);
};

/**
 * PIXI WebGL渲染方法。
 * PIXI render method.
 *
 * @method renderWebGL
 * @param {Object} renderer PIXI渲染器 PIXI renderer
 */
ShaderTilemap.prototype.renderWebGL = function (renderer) {
	this._hackRenderer(renderer);
	PIXI.Container.prototype.renderWebGL.call(this, renderer);
};

/**
 * 强制重绘整个瓦片地图并在需要时更新位图列表。
 * Forces to repaint the entire tilemap AND update bitmaps list if needed.
 *
 * @method refresh
 */
ShaderTilemap.prototype.refresh = function () {
	if (this._lastBitmapLength !== this.bitmaps.length) {
		this._lastBitmapLength = this.bitmaps.length;
		this.refreshTileset();
	}
	this._needsRepaint = true;
};

/**
 * 更新瓦片集后调用。
 * Call after you update tileset.
 *
 * @method refreshTileset
 */
ShaderTilemap.prototype.refreshTileset = function () {
	var bitmaps = this.bitmaps.map(function (x) {
		return x._baseTexture ? new PIXI.Texture(x._baseTexture) : x;
	});
	this.lowerLayer.setBitmaps(bitmaps);
	this.upperLayer.setBitmaps(bitmaps);
};

/**
 * 更新变换。
 * Updates the transform.
 *
 * @method updateTransform
 * @private
 */
ShaderTilemap.prototype.updateTransform = function () {
	if (this.roundPixels) {
		var ox = Math.floor(this.origin.x);
		var oy = Math.floor(this.origin.y);
	} else {
		ox = this.origin.x;
		oy = this.origin.y;
	}
	var startX = Math.floor((ox - this._margin) / this._tileWidth);
	var startY = Math.floor((oy - this._margin) / this._tileHeight);
	this._updateLayerPositions(startX, startY);
	if (this._needsRepaint || this._lastStartX !== startX || this._lastStartY !== startY) {
		this._lastStartX = startX;
		this._lastStartY = startY;
		this._paintAllTiles(startX, startY);
		this._needsRepaint = false;
	}
	this._sortChildren();
	PIXI.Container.prototype.updateTransform.call(this);
};

/**
 * 创建图层。
 * Creates the layers.
 *
 * @method _createLayers
 * @private
 */
ShaderTilemap.prototype._createLayers = function () {
	var width = this._width;
	var height = this._height;
	var margin = this._margin;
	var tileCols = Math.ceil(width / this._tileWidth) + 1;
	var tileRows = Math.ceil(height / this._tileHeight) + 1;
	var layerWidth = (this._layerWidth = tileCols * this._tileWidth);
	var layerHeight = (this._layerHeight = tileRows * this._tileHeight);
	this._needsRepaint = true;

	if (!this.lowerZLayer) {
		// @hackerham: 仅在初始化时创建图层。不依赖于宽/高
		// @hackerham: create layers only in initialization. Doesn't depend on width/height
		this.addChild((this.lowerZLayer = new PIXI.tilemap.ZLayer(this, 0)));
		this.addChild((this.upperZLayer = new PIXI.tilemap.ZLayer(this, 4)));

		var parameters = PluginManager.parameters("ShaderTilemap");
		var useSquareShader = Number(parameters.hasOwnProperty("squareShader") ? parameters["squareShader"] : 0);

		this.lowerZLayer.addChild((this.lowerLayer = new PIXI.tilemap.CompositeRectTileLayer(0, [], useSquareShader)));
		this.lowerLayer.shadowColor = new Float32Array([0.0, 0.0, 0.0, 0.5]);
		this.upperZLayer.addChild((this.upperLayer = new PIXI.tilemap.CompositeRectTileLayer(4, [], useSquareShader)));
	}
};

/**
 * 更新图层位置。
 * Updates layer positions.
 *
 * @method _updateLayerPositions
 * @param {Number} startX 起始 X 坐标 Starting X coordinate
 * @param {Number} startY 起始 Y 坐标 Starting Y coordinate
 * @private
 */
ShaderTilemap.prototype._updateLayerPositions = function (startX, startY) {
	if (this.roundPixels) {
		var ox = Math.floor(this.origin.x);
		var oy = Math.floor(this.origin.y);
	} else {
		ox = this.origin.x;
		oy = this.origin.y;
	}
	this.lowerZLayer.position.x = startX * this._tileWidth - ox;
	this.lowerZLayer.position.y = startY * this._tileHeight - oy;
	this.upperZLayer.position.x = startX * this._tileWidth - ox;
	this.upperZLayer.position.y = startY * this._tileHeight - oy;
};

/**
 * 绘制所有瓦片。
 * Paints all tiles.
 *
 * @method _paintAllTiles
 * @param {Number} startX 起始 X 坐标 Starting X coordinate
 * @param {Number} startY 起始 Y 坐标 Starting Y coordinate
 * @private
 */
ShaderTilemap.prototype._paintAllTiles = function (startX, startY) {
	this.lowerZLayer.clear();
	this.upperZLayer.clear();
	var tileCols = Math.ceil(this._width / this._tileWidth) + 1;
	var tileRows = Math.ceil(this._height / this._tileHeight) + 1;
	for (var y = 0; y < tileRows; y++) {
		for (var x = 0; x < tileCols; x++) {
			this._paintTiles(startX, startY, x, y);
		}
	}
};

/**
 * 绘制瓦片。
 * Paints tiles.
 *
 * @method _paintTiles
 * @param {Number} startX 起始 X 坐标 Starting X coordinate
 * @param {Number} startY 起始 Y 坐标 Starting Y coordinate
 * @param {Number} x X 坐标 X coordinate
 * @param {Number} y Y 坐标 Y coordinate
 * @private
 */
ShaderTilemap.prototype._paintTiles = function (startX, startY, x, y) {
	var mx = startX + x;
	var my = startY + y;
	var dx = x * this._tileWidth,
		dy = y * this._tileHeight;
	var tileId0 = this._readMapData(mx, my, 0);
	var tileId1 = this._readMapData(mx, my, 1);
	var tileId2 = this._readMapData(mx, my, 2);
	var tileId3 = this._readMapData(mx, my, 3);
	var shadowBits = this._readMapData(mx, my, 4);
	var upperTileId1 = this._readMapData(mx, my - 1, 1);
	var lowerLayer = this.lowerLayer.children[0];
	var upperLayer = this.upperLayer.children[0];

	if (this._isHigherTile(tileId0)) {
		this._drawTile(upperLayer, tileId0, dx, dy);
	} else {
		this._drawTile(lowerLayer, tileId0, dx, dy);
	}
	if (this._isHigherTile(tileId1)) {
		this._drawTile(upperLayer, tileId1, dx, dy);
	} else {
		this._drawTile(lowerLayer, tileId1, dx, dy);
	}

	this._drawShadow(lowerLayer, shadowBits, dx, dy);
	if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
		if (!Tilemap.isShadowingTile(tileId0)) {
			this._drawTableEdge(lowerLayer, upperTileId1, dx, dy);
		}
	}

	if (this._isOverpassPosition(mx, my)) {
		this._drawTile(upperLayer, tileId2, dx, dy);
		this._drawTile(upperLayer, tileId3, dx, dy);
	} else {
		if (this._isHigherTile(tileId2)) {
			this._drawTile(upperLayer, tileId2, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId2, dx, dy);
		}
		if (this._isHigherTile(tileId3)) {
			this._drawTile(upperLayer, tileId3, dx, dy);
		} else {
			this._drawTile(lowerLayer, tileId3, dx, dy);
		}
	}
};

/**
 * 绘制瓦片。
 * Draws a tile.
 *
 * @method _drawTile
 * @param {Object} layer 图层 The layer
 * @param {Number} tileId 瓦片ID Tile ID
 * @param {Number} dx X偏移量 Delta X
 * @param {Number} dy Y偏移量 Delta Y
 * @private
 */
ShaderTilemap.prototype._drawTile = function (layer, tileId, dx, dy) {
	if (Tilemap.isVisibleTile(tileId)) {
		if (Tilemap.isAutotile(tileId)) {
			this._drawAutotile(layer, tileId, dx, dy);
		} else {
			this._drawNormalTile(layer, tileId, dx, dy);
		}
	}
};

/**
 * 绘制普通瓦片。
 * Draws a normal tile.
 *
 * @method _drawNormalTile
 * @param {Object} layer 图层 The layer
 * @param {Number} tileId 瓦片ID Tile ID
 * @param {Number} dx X偏移量 Delta X
 * @param {Number} dy Y偏移量 Delta Y
 * @private
 */
ShaderTilemap.prototype._drawNormalTile = function (layer, tileId, dx, dy) {
	var setNumber = 0;

	if (Tilemap.isTileA5(tileId)) {
		setNumber = 4;
	} else {
		setNumber = 5 + Math.floor(tileId / 256);
	}

	var w = this._tileWidth;
	var h = this._tileHeight;
	var sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
	var sy = (Math.floor((tileId % 256) / 8) % 16) * h;

	layer.addRect(setNumber, sx, sy, dx, dy, w, h);
};

/**
 * 绘制自动瓦片。
 * Draws an autotile.
 *
 * @method _drawAutotile
 * @param {Object} layer 图层 The layer
 * @param {Number} tileId 瓦片ID Tile ID
 * @param {Number} dx X偏移量 Delta X
 * @param {Number} dy Y偏移量 Delta Y
 * @private
 */
ShaderTilemap.prototype._drawAutotile = function (layer, tileId, dx, dy) {
	var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
	var kind = Tilemap.getAutotileKind(tileId);
	var shape = Tilemap.getAutotileShape(tileId);
	var tx = kind % 8;
	var ty = Math.floor(kind / 8);
	var bx = 0;
	var by = 0;
	var setNumber = 0;
	var isTable = false;
	var animX = 0,
		animY = 0;

	if (Tilemap.isTileA1(tileId)) {
		setNumber = 0;
		if (kind === 0) {
			animX = 2;
			by = 0;
		} else if (kind === 1) {
			animX = 2;
			by = 3;
		} else if (kind === 2) {
			bx = 6;
			by = 0;
		} else if (kind === 3) {
			bx = 6;
			by = 3;
		} else {
			bx = Math.floor(tx / 4) * 8;
			by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
			if (kind % 2 === 0) {
				animX = 2;
			} else {
				bx += 6;
				autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
				animY = 1;
			}
		}
	} else if (Tilemap.isTileA2(tileId)) {
		setNumber = 1;
		bx = tx * 2;
		by = (ty - 2) * 3;
		isTable = this._isTableTile(tileId);
	} else if (Tilemap.isTileA3(tileId)) {
		setNumber = 2;
		bx = tx * 2;
		by = (ty - 6) * 2;
		autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
	} else if (Tilemap.isTileA4(tileId)) {
		setNumber = 3;
		bx = tx * 2;
		by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
		if (ty % 2 === 1) {
			autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
		}
	}

	var table = autotileTable[shape];
	var w1 = this._tileWidth / 2;
	var h1 = this._tileHeight / 2;
	for (var i = 0; i < 4; i++) {
		var qsx = table[i][0];
		var qsy = table[i][1];
		var sx1 = (bx * 2 + qsx) * w1;
		var sy1 = (by * 2 + qsy) * h1;
		var dx1 = dx + (i % 2) * w1;
		var dy1 = dy + Math.floor(i / 2) * h1;
		if (isTable && (qsy === 1 || qsy === 5)) {
			var qsx2 = qsx;
			var qsy2 = 3;
			if (qsy === 1) {
				// qsx2 = [0, 3, 2, 1][qsx];
				qsx2 = (4 - qsx) % 4;
			}
			var sx2 = (bx * 2 + qsx2) * w1;
			var sy2 = (by * 2 + qsy2) * h1;
			layer.addRect(setNumber, sx2, sy2, dx1, dy1, w1, h1, animX, animY);
			layer.addRect(setNumber, sx1, sy1, dx1, dy1 + h1 / 2, w1, h1 / 2, animX, animY);
		} else {
			layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1, animX, animY);
		}
	}
};

/**
 * 绘制桌子边缘。
 * Draws table edge.
 *
 * @method _drawTableEdge
 * @param {Object} layer 图层 The layer
 * @param {Number} tileId 瓦片ID Tile ID
 * @param {Number} dx X偏移量 Delta X
 * @param {Number} dy Y偏移量 Delta Y
 * @private
 */
ShaderTilemap.prototype._drawTableEdge = function (layer, tileId, dx, dy) {
	if (Tilemap.isTileA2(tileId)) {
		var autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
		var kind = Tilemap.getAutotileKind(tileId);
		var shape = Tilemap.getAutotileShape(tileId);
		var tx = kind % 8;
		var ty = Math.floor(kind / 8);
		var setNumber = 1;
		var bx = tx * 2;
		var by = (ty - 2) * 3;
		var table = autotileTable[shape];
		var w1 = this._tileWidth / 2;
		var h1 = this._tileHeight / 2;
		for (var i = 0; i < 2; i++) {
			var qsx = table[2 + i][0];
			var qsy = table[2 + i][1];
			var sx1 = (bx * 2 + qsx) * w1;
			var sy1 = (by * 2 + qsy) * h1 + h1 / 2;
			var dx1 = dx + (i % 2) * w1;
			var dy1 = dy + Math.floor(i / 2) * h1;
			layer.addRect(setNumber, sx1, sy1, dx1, dy1, w1, h1 / 2);
		}
	}
};

/**
 * 绘制阴影。
 * Draws shadows.
 *
 * @method _drawShadow
 * @param {Object} layer 图层 The layer
 * @param {Number} shadowBits 阴影位 Shadow bits
 * @param {Number} dx X偏移量 Delta X
 * @param {Number} dy Y偏移量 Delta Y
 * @private
 */
ShaderTilemap.prototype._drawShadow = function (layer, shadowBits, dx, dy) {
	if (shadowBits & 0x0f) {
		var w1 = this._tileWidth / 2;
		var h1 = this._tileHeight / 2;
		for (var i = 0; i < 4; i++) {
			if (shadowBits & (1 << i)) {
				var dx1 = dx + (i % 2) * w1;
				var dy1 = dy + Math.floor(i / 2) * h1;
				layer.addRect(-1, 0, 0, dx1, dy1, w1, h1);
			}
		}
	}
};
//-----------------------------------------------------------------------------
