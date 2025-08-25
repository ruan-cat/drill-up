//=============================================================================
// Window_Base.js
//=============================================================================

//-----------------------------------------------------------------------------
// 窗口_基础 
// Window_Base
//
// 游戏中所有窗口的父类。 
// The superclass of all windows within the game.

function Window_Base() {
    this.initialize.apply(this, arguments);
}

Window_Base.prototype = Object.create(Window.prototype);
Window_Base.prototype.constructor = Window_Base;

/* 初始化 */
Window_Base.prototype.initialize = function(x, y, width, height) {
    Window.prototype.initialize.call(this);
    this.loadWindowskin();
    this.move(x, y, width, height);
    this.updatePadding();
    this.updateBackOpacity();
    this.updateTone();
    this.createContents();
    this._opening = false;
    this._closing = false;
    this._dimmerSprite = null;
};

Window_Base._iconWidth  = 32;  // 图标宽度 
Window_Base._iconHeight = 32;  // 图标高度 
Window_Base._faceWidth  = 144; // 脸图宽度 
Window_Base._faceHeight = 144; // 脸图高度 

/* 行高度 
 * 菜单每一个选项的高度 
 */
Window_Base.prototype.lineHeight = function() {
    return 36;
};

/* 标准字体 */
Window_Base.prototype.standardFontFace = function() {
    if ($gameSystem.isChinese()) {
        return 'SimHei, Heiti TC, sans-serif';
    } else if ($gameSystem.isKorean()) {
        return 'Dotum, AppleGothic, sans-serif';
    } else {
        return 'GameFont';
    }
};

/* 标准字体大小 */
Window_Base.prototype.standardFontSize = function() {
    return 28;
};

/* 标准填充（内边距） 
 * 内容与背景上下左右四边的距离 
 */
Window_Base.prototype.standardPadding = function() {
    return 18;
};

/* 文本填充（内边距） 
 * 文本与内容左右两边的距离
 */
Window_Base.prototype.textPadding = function() {
    return 6;
};

/* 标准背景不透明度 */
Window_Base.prototype.standardBackOpacity = function() {
    return 192;
};

/* 读取窗口皮肤 */
Window_Base.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('Window');
};

/* 更新填充（内边距） */
Window_Base.prototype.updatePadding = function() {
    this.padding = this.standardPadding();
};

/* 更新背景不透明度 */
Window_Base.prototype.updateBackOpacity = function() {
    this.backOpacity = this.standardBackOpacity();
};

/* 内容宽度 */
Window_Base.prototype.contentsWidth = function() {
    return this.width - this.standardPadding() * 2;
};

/* 内容高度 */
Window_Base.prototype.contentsHeight = function() {
    return this.height - this.standardPadding() * 2;
};

/* 合适的高度 */
Window_Base.prototype.fittingHeight = function(numLines) {
    return numLines * this.lineHeight() + this.standardPadding() * 2;
};

/* 更新色调 */
Window_Base.prototype.updateTone = function() {
    var tone = $gameSystem.windowTone();
    this.setTone(tone[0], tone[1], tone[2]);
};

/* 创建内容 */
Window_Base.prototype.createContents = function() {
    this.contents = new Bitmap(this.contentsWidth(), this.contentsHeight());
    this.resetFontSettings();
};

/* 重设字体设置 */
Window_Base.prototype.resetFontSettings = function() {
    this.contents.fontFace = this.standardFontFace();
    this.contents.fontSize = this.standardFontSize();
    this.resetTextColor();
};

/* 重设字体颜色 */
Window_Base.prototype.resetTextColor = function() {
    this.changeTextColor(this.normalColor());
};

/* 更新 */
Window_Base.prototype.update = function() {
    Window.prototype.update.call(this);
    this.updateTone();
    this.updateOpen();
    this.updateClose();
    this.updateBackgroundDimmer();
};

/* 更新打开 */
Window_Base.prototype.updateOpen = function() {
    if (this._opening) {
        this.openness += 32;
        if (this.isOpen()) {
            this._opening = false;
        }
    }
};

/* 更新关闭 */
Window_Base.prototype.updateClose = function() {
    if (this._closing) {
        this.openness -= 32;
        if (this.isClosed()) {
            this._closing = false;
        }
    }
};

/* 打开 */
Window_Base.prototype.open = function() {
    if (!this.isOpen()) {
        this._opening = true;
    }
    this._closing = false;
};

/* 关闭 */
Window_Base.prototype.close = function() {
    if (!this.isClosed()) {
        this._closing = true;
    }
    this._opening = false;
};

/* 是否打开中 */
Window_Base.prototype.isOpening = function() {
    return this._opening;
};

/* 是否关闭中 */
Window_Base.prototype.isClosing = function() {
    return this._closing;
};

/* 显示 */
Window_Base.prototype.show = function() {
    this.visible = true;
};

/* 隐藏 */
Window_Base.prototype.hide = function() {
    this.visible = false;
};

/* 活动 */
Window_Base.prototype.activate = function() {
    this.active = true;
};

/* 不活动 */
Window_Base.prototype.deactivate = function() {
    this.active = false;
};

/* 文本颜色 */
Window_Base.prototype.textColor = function(n) {
    var px = 96 + (n % 8) * 12 + 6;
    var py = 144 + Math.floor(n / 8) * 12 + 6;
    return this.windowskin.getPixel(px, py);
};

/* 普通颜色 */
Window_Base.prototype.normalColor = function() {
    return this.textColor(0);
};

/* 系统颜色 */
Window_Base.prototype.systemColor = function() {
    return this.textColor(16);
};

/* 危机颜色 */
Window_Base.prototype.crisisColor = function() {
    return this.textColor(17);
};

/* 死亡颜色 */
Window_Base.prototype.deathColor = function() {
    return this.textColor(18);
};

/* 计量条背景颜色 */
Window_Base.prototype.gaugeBackColor = function() {
    return this.textColor(19);
};

/* HP 计量条颜色 1 */
Window_Base.prototype.hpGaugeColor1 = function() {
    return this.textColor(20);
};

/* HP 计量条颜色 2 */
Window_Base.prototype.hpGaugeColor2 = function() {
    return this.textColor(21);
};

/* MP 计量条颜色 1 */
Window_Base.prototype.mpGaugeColor1 = function() {
    return this.textColor(22);
};

/* MP 计量条颜色 1 */
Window_Base.prototype.mpGaugeColor2 = function() {
    return this.textColor(23);
};

/* MP 消耗颜色 */
Window_Base.prototype.mpCostColor = function() {
    return this.textColor(23);
};

/* 能力上升颜色 
 * 这里指选中的装备与身上装备高对比能力值时上升的颜色
 */
Window_Base.prototype.powerUpColor = function() {
    return this.textColor(24);
};

/* 能力下降颜色 
 * 这里指选中的装备与身上装备高对比能力值时下降的颜色
 */
Window_Base.prototype.powerDownColor = function() {
    return this.textColor(25);
};

/* TP计量条颜色1 */
Window_Base.prototype.tpGaugeColor1 = function() {
    return this.textColor(28);
};

/* TP计量条颜色2 */
Window_Base.prototype.tpGaugeColor2 = function() {
    return this.textColor(29);
};

/* TP消耗颜色 */
Window_Base.prototype.tpCostColor = function() {
    return this.textColor(29);
};

/* 待定颜色（选中选项的那个背景框） */
Window_Base.prototype.pendingColor = function() {
    return this.windowskin.getPixel(120, 120);
};

/* 半透明的不透明度 */
Window_Base.prototype.translucentOpacity = function() {
    return 160;
};

/* 改变文本颜色 */
Window_Base.prototype.changeTextColor = function(color) {
    this.contents.textColor = color;
};

/* 改变绘制不透明度 
 * @param {Boolean} enabled 指令是否启用 
 */
Window_Base.prototype.changePaintOpacity = function(enabled) {
    this.contents.paintOpacity = enabled ? 255 : this.translucentOpacity();
};

/* 绘制文本 */
Window_Base.prototype.drawText = function(text, x, y, maxWidth, align) {
    this.contents.drawText(text, x, y, maxWidth, this.lineHeight(), align);
};

/* 文本宽度 */
Window_Base.prototype.textWidth = function(text) {
    return this.contents.measureTextWidth(text);
};

/* 绘制文本（扩展） */
Window_Base.prototype.drawTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

/* 转换转义字符 */
Window_Base.prototype.convertEscapeCharacters = function(text) {
    // \ 替换为 \x1b（ASCII 表对应的是转义符 ESC） 
    text = text.replace(/\\/g, '\x1b');
    // \\ 替换为反斜杠字符 
    text = text.replace(/\x1b\x1b/g, '\\');
    // \V[n] 替换为第 n 个变量的值 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    // \V[n] 替换为第 n 个变量的值 
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    // \N[n] 替换为第 n 个角色的名字 
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    // \P[n] 替换为第 n 个队伍成员 
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    // \G 替换为货币单位 
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

/* 角色名称 */
Window_Base.prototype.actorName = function(n) {
    var actor = n >= 1 ? $gameActors.actor(n) : null;
    return actor ? actor.name() : '';
};

/* 队伍成员名称 */
Window_Base.prototype.partyMemberName = function(n) {
    var actor = n >= 1 ? $gameParty.members()[n - 1] : null;
    return actor ? actor.name() : '';
};

/* 处理字符 */
Window_Base.prototype.processCharacter = function(textState) {
    switch (textState.text[textState.index]) {
    case '\n':
        this.processNewLine(textState);
        break;
    case '\f':
        this.processNewPage(textState);
        break;
    case '\x1b':
        this.processEscapeCharacter(this.obtainEscapeCode(textState), textState);
        break;
    default:
        this.processNormalCharacter(textState);
        break;
    }
};

/* 处理普通字符 */
Window_Base.prototype.processNormalCharacter = function(textState) {
    var c = textState.text[textState.index++];
    var w = this.textWidth(c);
    this.contents.drawText(c, textState.x, textState.y, w * 2, textState.height);
    textState.x += w;
};

/* 处理新行 */
Window_Base.prototype.processNewLine = function(textState) {
    textState.x = textState.left;
    textState.y += textState.height;
    textState.height = this.calcTextHeight(textState, false);
    textState.index++;
};

/* 处理新页 */
Window_Base.prototype.processNewPage = function(textState) {
    textState.index++;
};

/* 获取转义码 */
Window_Base.prototype.obtainEscapeCode = function(textState) {
    textState.index++;
    // 匹配开头是 $ . | ^ ! > < { } \ 或 1 个或多个字母（不区分大小写） 
    var regExp = /^[\$\.\|\^!><\{\}\\]|^[A-Z]+/i;
    var arr = regExp.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return arr[0].toUpperCase();
    } else {
        return '';
    }
};

/* 获取转义参数 */
Window_Base.prototype.obtainEscapeParam = function(textState) {
    var arr = /^\[\d+\]/.exec(textState.text.slice(textState.index));
    if (arr) {
        textState.index += arr[0].length;
        return parseInt(arr[0].slice(1));
    } else {
        return '';
    }
};

/* 处理转义符 */
Window_Base.prototype.processEscapeCharacter = function(code, textState) {
    switch (code) {
    case 'C':
        this.changeTextColor(this.textColor(this.obtainEscapeParam(textState)));
        break;
    case 'I':
        this.processDrawIcon(this.obtainEscapeParam(textState), textState);
        break;
    case '{':
        this.makeFontBigger();
        break;
    case '}':
        this.makeFontSmaller();
        break;
    }
};

/* 处理绘制图标 */
Window_Base.prototype.processDrawIcon = function(iconIndex, textState) {
    this.drawIcon(iconIndex, textState.x + 2, textState.y + 2);
    textState.x += Window_Base._iconWidth + 4;
};

/* 使字体更大 */
Window_Base.prototype.makeFontBigger = function() {
    if (this.contents.fontSize <= 96) {
        this.contents.fontSize += 12;
    }
};

/* 使字体更小 */
Window_Base.prototype.makeFontSmaller = function() {
    if (this.contents.fontSize >= 24) {
        this.contents.fontSize -= 12;
    }
};

/* 计算文本高度 */
Window_Base.prototype.calcTextHeight = function(textState, all) {
    var lastFontSize = this.contents.fontSize;
    var textHeight = 0;
    var lines = textState.text.slice(textState.index).split('\n');
    var maxLines = all ? lines.length : 1;

    for (var i = 0; i < maxLines; i++) {
        var maxFontSize = this.contents.fontSize;
        var regExp = /\x1b[\{\}]/g;
        for (;;) {
            var array = regExp.exec(lines[i]);
            if (array) {
                if (array[0] === '\x1b{') {
                    this.makeFontBigger();
                }
                if (array[0] === '\x1b}') {
                    this.makeFontSmaller();
                }
                if (maxFontSize < this.contents.fontSize) {
                    maxFontSize = this.contents.fontSize;
                }
            } else {
                break;
            }
        }
        textHeight += maxFontSize + 8;
    }

    this.contents.fontSize = lastFontSize;
    return textHeight;
};

/* 绘制图标 */
Window_Base.prototype.drawIcon = function(iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};

/* 绘制脸图 
 * 当长宽小于脸图长宽时，截取脸图中间部分；当长宽大于脸图长宽时，脸图居中显示。 
 */
Window_Base.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};
/* 绘制人物 
 * 人物行走图的正面朝向的图，例如存档界面里绘制的人物图。 
 */
Window_Base.prototype.drawCharacter = function(characterName, characterIndex, x, y) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = characterIndex;
    var sx = (n % 4 * 3 + 1) * pw;
    var sy = (Math.floor(n / 4) * 4) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
};

/* 绘制计量条（HP、MP、TP的计量条） */
Window_Base.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y + this.lineHeight() - 8;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

/* HP 颜色 
 * 普通、频死、死亡三种状态下HP的数值的颜色不同。 
 */
Window_Base.prototype.hpColor = function(actor) {
    if (actor.isDead()) {
        return this.deathColor();
    } else if (actor.isDying()) {
        return this.crisisColor();
    } else {
        return this.normalColor();
    }
};

/* MP 颜色 */
Window_Base.prototype.mpColor = function(actor) {
    return this.normalColor();
};

/* TP 颜色 */
Window_Base.prototype.tpColor = function(actor) {
    return this.normalColor();
};

/* 绘制角色行走图 */
Window_Base.prototype.drawActorCharacter = function(actor, x, y) {
    this.drawCharacter(actor.characterName(), actor.characterIndex(), x, y);
};

/* 绘制角色脸图 */
Window_Base.prototype.drawActorFace = function(actor, x, y, width, height) {
    this.drawFace(actor.faceName(), actor.faceIndex(), x, y, width, height);
};

/* 绘制角色名字 */
Window_Base.prototype.drawActorName = function(actor, x, y, width) {
    width = width || 168;
    this.changeTextColor(this.hpColor(actor));
    this.drawText(actor.name(), x, y, width);
};

/* 绘制角色职业 */
Window_Base.prototype.drawActorClass = function(actor, x, y, width) {
    width = width || 168;
    this.resetTextColor();
    this.drawText(actor.currentClass().name, x, y, width);
};

/* 绘制角色昵称 */
Window_Base.prototype.drawActorNickname = function(actor, x, y, width) {
    width = width || 270;
    this.resetTextColor();
    this.drawText(actor.nickname(), x, y, width);
};

/* 绘制角色等级 */
Window_Base.prototype.drawActorLevel = function(actor, x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 84, y, 36, 'right');
};

/* 绘制角色图标（状态的图标，如中毒） */
Window_Base.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
    }
};

/* 绘制当前值与最大值（HP 和 MP 的值，如 1/100） */
Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    var valueWidth = this.textWidth('0000');
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
};

/* 绘制角色 HP */
Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width,
                           this.hpColor(actor), this.normalColor());
};

/* 绘制角色 MP */
Window_Base.prototype.drawActorMp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.mpA, x, y, 44);
    this.drawCurrentAndMax(actor.mp, actor.mmp, x, y, width,
                           this.mpColor(actor), this.normalColor());
};

/* 绘制角色 TP */
Window_Base.prototype.drawActorTp = function(actor, x, y, width) {
    width = width || 96;
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.tpA, x, y, 44);
    this.changeTextColor(this.tpColor(actor));
    this.drawText(actor.tp, x + width - 64, y, 64, 'right');
};

/* 绘制角色简单的状态（名字、等级、图标、职业、HP、MP） */
Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var x2 = x + 180;
    var width2 = Math.min(200, width - 180 - this.textPadding());
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, y + lineHeight * 1, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2, width2);
};

/* 绘制物品名字 */
Window_Base.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        var iconBoxWidth = Window_Base._iconWidth + 4;
        this.resetTextColor();
        this.drawIcon(item.iconIndex, x + 2, y + 2);
        this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
    }
};

/* 绘制货币值 */
Window_Base.prototype.drawCurrencyValue = function(value, unit, x, y, width) {
    var unitWidth = Math.min(80, this.textWidth(unit));
    this.resetTextColor();
    this.drawText(value, x, y, width - unitWidth - 6, 'right');
    this.changeTextColor(this.systemColor());
    this.drawText(unit, x + width - unitWidth, y, unitWidth, 'right');
};

/* 参数改变文本颜色 
 * 装备界面或商店界面比较装备能力值时会使用
 * @param {Number} change 能力值是否改变（正数：能力值上升颜色，负数：能力值下降颜色，0：能力值不变的普通颜色）
 */
Window_Base.prototype.paramchangeTextColor = function(change) {
    if (change > 0) {
        return this.powerUpColor();
    } else if (change < 0) {
        return this.powerDownColor();
    } else {
        return this.normalColor();
    }
};

/* 设置背景类型 
 * @param {Number} type 类型（0：窗口，1：暗淡，2：透明） 
 */
Window_Base.prototype.setBackgroundType = function(type) {
    if (type === 0) {
        this.opacity = 255;
    } else {
        this.opacity = 0;
    }
    if (type === 1) {
        this.showBackgroundDimmer();
    } else {
        this.hideBackgroundDimmer();
    }
};

/* 设置暗淡背景 */
Window_Base.prototype.showBackgroundDimmer = function() {
    if (!this._dimmerSprite) {
        this._dimmerSprite = new Sprite();
        this._dimmerSprite.bitmap = new Bitmap(0, 0);
        this.addChildToBack(this._dimmerSprite);
    }
    var bitmap = this._dimmerSprite.bitmap;
    if (bitmap.width !== this.width || bitmap.height !== this.height) {
        this.refreshDimmerBitmap();
    }
    this._dimmerSprite.visible = true;
    this.updateBackgroundDimmer();
};

/* 隐藏暗淡背景 */
Window_Base.prototype.hideBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.visible = false;
    }
};

/* 更新暗淡背景 */
Window_Base.prototype.updateBackgroundDimmer = function() {
    if (this._dimmerSprite) {
        this._dimmerSprite.opacity = this.openness;
    }
};

/* 刷新暗淡位图 */
Window_Base.prototype.refreshDimmerBitmap = function() {
    if (this._dimmerSprite) {
        var bitmap = this._dimmerSprite.bitmap;
        var w = this.width;
        var h = this.height;
        var m = this.padding;
        var c1 = this.dimColor1();
        var c2 = this.dimColor2();
        bitmap.resize(w, h);
        bitmap.gradientFillRect(0, 0, w, m, c2, c1, true);
        bitmap.fillRect(0, m, w, h - m * 2, c1);
        bitmap.gradientFillRect(0, h - m, w, m, c1, c2, true);
        this._dimmerSprite.setFrame(0, 0, w, h);
    }
};

/* 暗淡颜色 1 */
Window_Base.prototype.dimColor1 = function() {
    return 'rgba(0, 0, 0, 0.6)';
};

/* 暗淡颜色 2 */
Window_Base.prototype.dimColor2 = function() {
    return 'rgba(0, 0, 0, 0)';
};

 /* 画布 X 坐标转换到本地 X 坐标 */
Window_Base.prototype.canvasToLocalX = function(x) {
    var node = this;
    while (node) {
        x -= node.x;
        node = node.parent;
    }
    return x;
};

 /* 画布 Y 坐标转换到本地 Y 坐标 */
Window_Base.prototype.canvasToLocalY = function(y) {
    var node = this;
    while (node) {
        y -= node.y;
        node = node.parent;
    }
    return y;
};

/* 储存脸图图像 */
Window_Base.prototype.reserveFaceImages = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.reserveFace(actor.faceName());
    }, this);
};