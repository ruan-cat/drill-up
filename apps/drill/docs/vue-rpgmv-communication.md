# Vue 与 RPGMV 双向通信系统

## 概述

这个通信系统实现了 Vue 应用与 RPGMV 游戏之间的双向数据通信，允许 Vue 组件直接控制游戏状态，同时监听游戏状态的变化。

## 系统架构

```plain
Vue App (前端界面)
    ↕ (事件通信)
GameBridge (桥接器)
    ↕ (自定义事件)
VueBridge (RPGMV插件)
    ↕ (直接调用)
RPGMV Game (游戏引擎)
```

## 文件结构

```plain
src/
├── bridge/
│   └── GameBridge.ts          # 核心通信桥接器
├── composables/
│   └── useGameState.ts        # Vue状态管理
├── components/
│   └── GamePanel.vue          # 示例控制面板
├── types/
│   └── global.d.ts           # TypeScript类型声明
└── main.ts                   # 应用入口(已修改)

drill-project/
├── index.html                # HTML模板(已添加插件引用)
└── js/plugins/
    └── VueBridge.js          # RPGMV端通信插件
```

## 核心功能

### 1. 数据双向同步

- ✅ 游戏变量 (Variables)
- ✅ 游戏开关 (Switches)
- ✅ 玩家数据 (HP, MP, Level, EXP)
- ✅ 当前场景 (Scene)
- ✅ 当前地图 (Map ID)

### 2. 游戏控制

- ✅ 修改变量和开关
- ✅ 显示游戏消息
- ✅ 播放音效
- ✅ 切换场景
- ✅ 玩家传送

### 3. 实时监听

- ✅ 游戏状态变化自动同步到 Vue
- ✅ 等级提升事件
- ✅ 场景切换事件
- ✅ 地图切换事件

## 使用方法

### 在 Vue 组件中使用

```vue
<script setup lang="ts">
import { useGameState } from "@/composables/useGameState";

const { gameState, setVariable, setSwitch, showMessage, setupListeners } = useGameState();

// 修改游戏变量
const updateVar = () => {
	setVariable(1, "Hello from Vue!");
};

// 修改游戏开关
const toggleSwitch = () => {
	setSwitch(1, true);
};

// 显示消息
const sendMessage = () => {
	showMessage("来自Vue的消息");
};

onMounted(() => {
	setupListeners();
});
</script>
```

### 监听游戏事件

```typescript
// 监听特定事件
const bridge = window.gameBridge;

bridge.onRPGMVEvent("player-level-up", (data) => {
	console.log("玩家升级了！", data);
});

bridge.onRPGMVEvent("variable-changed", (data) => {
	console.log("变量变化：", data);
});
```

### 从 RPGMV 发送事件到 Vue

```javascript
// 在RPGMV插件中
VueBridge.sendToVue("custom-event", {
	message: "来自RPGMV的自定义事件",
	data: { value: 42 },
});
```

## API 参考

### GameBridge 类

#### 方法

- `sendToRPGMV(type: string, data: any)` - 发送事件到 RPGMV
- `onRPGMVEvent(type: string, callback: Function)` - 监听 RPGMV 事件
- `getGameSnapshot()` - 获取当前游戏状态快照
- `isRPGMVReady()` - 检查 RPGMV 是否准备就绪

### useGameState Composable

#### 状态

- `gameState` - 游戏状态响应式对象
- `isLoading` - 加载状态
- `lastError` - 最后的错误信息
- `isConnected` - 连接状态

#### 方法

- `setVariable(id, value)` - 设置游戏变量
- `setSwitch(id, value)` - 设置游戏开关
- `showMessage(text)` - 显示游戏消息
- `playSE(filename, volume, pitch, pan)` - 播放音效
- `changeScene(sceneName, ...args)` - 切换场景
- `transferPlayer(mapId, x, y, direction)` - 传送玩家

### 支持的事件类型

#### Vue → RPGMV

- `change-variable` - 修改变量
- `change-switch` - 修改开关
- `show-message` - 显示消息
- `play-se` - 播放音效
- `change-scene` - 切换场景
- `transfer-player` - 传送玩家

#### RPGMV → Vue

- `variable-changed` - 变量已变化
- `switch-changed` - 开关已变化
- `player-data-changed` - 玩家数据已变化
- `scene-changed` - 场景已切换
- `map-changed` - 地图已切换
- `player-level-up` - 玩家升级
- `connection-changed` - 连接状态变化

## 开发调试

### 启用调试日志

通信系统会在浏览器控制台输出详细日志：

```plain
🚀 Vue app initialized with GameBridge
VueBridge plugin loaded
VueBridge initializing...
VueBridge initialized successfully
🎮 RPGMV is ready for communication
📊 Initial game state snapshot: {...}
```

### 检查连接状态

```typescript
const { checkConnection, isConnected } = useGameState();

// 手动检查连接
checkConnection();

// 响应式连接状态
watch(isConnected, (connected) => {
	console.log("连接状态：", connected ? "已连接" : "未连接");
});
```

## 注意事项

1. **初始化顺序**：确保 RPGMV 完全加载后再进行通信
2. **错误处理**：使用 try-catch 包装所有通信代码
3. **性能考虑**：避免频繁的状态同步，使用防抖机制
4. **类型安全**：充分利用 TypeScript 类型检查
5. **内存管理**：组件卸载时清理事件监听器

## 扩展开发

### 添加自定义事件

1. 在`GameBridge.ts`中添加新的事件类型
2. 在`VueBridge.js`中添加对应的处理逻辑
3. 在`useGameState.ts`中添加相应的方法和监听器

### 添加新的游戏控制

```typescript
// 在useGameState.ts中添加新方法
const customGameAction = (params: any) => {
	const bridge = getBridge();
	bridge?.sendToRPGMV("custom-action", params);
};
```

```javascript
// 在VueBridge.js中处理
case 'custom-action':
  this.handleCustomAction(data);
  break;
```

## 故障排除

### 常见问题

1. **连接失败**：检查插件是否正确加载
2. **事件不触发**：确认事件监听器已设置
3. **状态不同步**：检查 RPGMV 对象是否存在
4. **TypeScript 错误**：确保类型声明文件已导入

### 检查清单

- [ ] VueBridge.js 已在 index.html 中引用
- [ ] GameBridge 已在 main.ts 中初始化
- [ ] 组件中已调用 setupListeners()
- [ ] RPGMV 游戏已完全加载
- [ ] 浏览器控制台无错误信息

## 更新日志

### v1.0.0

- ✅ 基础双向通信系统
- ✅ 游戏状态同步
- ✅ 示例控制面板
- ✅ TypeScript 类型支持
- ✅ 错误处理和调试日志
