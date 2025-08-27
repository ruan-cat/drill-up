---
title: 代码示例
description: RPG Maker MV 核心库的使用示例
---

# 代码示例

这里提供了 RPG Maker MV 核心库的常用功能示例。

## 基础操作示例

### 创建和操作位图

```javascript
// 创建一个 100x100 的位图
const bitmap = new Bitmap(100, 100);

// 设置背景色
bitmap.fillAll('#ff0000');

// 绘制文字
bitmap.drawText('Hello World', 0, 0, 100, 32, 'center');

// 保存位图到缓存
ImageManager.cache.setItem('myBitmap', bitmap);
```

### 场景管理

```javascript
// 切换到地图场景
SceneManager.goto(Scene_Map);

// 调用场景并在结束后返回
SceneManager.push(Scene_Menu);

// 返回上一个场景  
SceneManager.pop();
```

### 音频播放

```javascript
// 播放背景音乐
AudioManager.playBgm({
    name: 'Theme1',
    volume: 90,
    pitch: 100,
    pan: 0
});

// 播放音效
AudioManager.playSe({
    name: 'Cursor1', 
    volume: 90,
    pitch: 100,
    pan: 0
});

// 停止背景音乐
AudioManager.stopBgm();
```

### 输入检测

```javascript
// 检测按键按下
if (Input.isTriggered('ok')) {
    console.log('确认键被按下');
}

// 检测按键按住
if (Input.isPressed('left')) {
    console.log('左键正在按住');
}

// 检测触屏输入
if (TouchInput.isTriggered()) {
    console.log('触屏被点击');
    const x = TouchInput.x;
    const y = TouchInput.y;
    console.log(`点击坐标: (${x}, ${y})`);
}
```

## 游戏对象操作

### 角色操作

```javascript
// 获取队伍中的第一个角色
const actor = $gameParty.leader();

// 增加经验值
actor.gainExp(100);

// 学习技能
actor.learnSkill(1);

// 装备物品
actor.changeEquip(0, $dataWeapons[1]);

// 恢复HP
actor.recoverAll();
```

### 地图操作

```javascript
// 获取当前地图
const map = $gameMap;

// 传送玩家到指定位置
$gamePlayer.reserveTransfer(2, 10, 10);

// 显示动画
$gameMap.requestAnimation([1, 2, 3], 10);

// 播放 SE
$gameMap.requestBalloon($gamePlayer, 1);
```

### 变量和开关

```javascript
// 设置开关
$gameSwitches.setValue(1, true);

// 获取开关状态
const switchOn = $gameSwitches.value(1);

// 设置变量
$gameVariables.setValue(1, 100);

// 获取变量值
const value = $gameVariables.value(1);
```

## 自定义窗口示例

### 创建自定义窗口

```javascript
class MyCustomWindow extends Window_Base {
    constructor(rect) {
        super(rect);
        this.refresh();
    }
    
    refresh() {
        this.contents.clear();
        this.drawText('自定义窗口内容', 0, 0);
    }
    
    update() {
        super.update();
        if (Input.isTriggered('cancel')) {
            this.close();
        }
    }
}

// 使用自定义窗口
const rect = new Rectangle(100, 100, 300, 200);
const myWindow = new MyCustomWindow(rect);
SceneManager._scene.addChild(myWindow);
```

### 创建命令窗口

```javascript
class MyCommandWindow extends Window_Command {
    makeCommandList() {
        this.addCommand('选项1', 'option1');
        this.addCommand('选项2', 'option2'); 
        this.addCommand('取消', 'cancel');
    }
    
    processOk() {
        const symbol = this.currentSymbol();
        switch (symbol) {
            case 'option1':
                console.log('选择了选项1');
                break;
            case 'option2':
                console.log('选择了选项2');
                break;
            case 'cancel':
                this.close();
                break;
        }
    }
}
```

## 插件开发示例

### 基础插件结构

```javascript
(() => {
    'use strict';
    
    // 插件参数获取
    const parameters = PluginManager.parameters('YourPluginName');
    const param1 = parameters['param1'] || 'default';
    
    // 扩展现有类
    const _Game_Actor_levelUp = Game_Actor.prototype.levelUp;
    Game_Actor.prototype.levelUp = function() {
        _Game_Actor_levelUp.call(this);
        console.log(`${this.name()} 升级了！`);
    };
    
    // 添加插件命令
    PluginManager.registerCommand('YourPluginName', 'myCommand', args => {
        console.log('插件命令执行:', args);
    });
})();
```

这些示例展示了 RPG Maker MV 核心库的常用功能。更多详细信息请参考 [JSDoc API 文档](/jsdoc/)。