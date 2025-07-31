# 🎮 TypeScript RPGMV 插件开发环境

## 🎯 项目改进概述

本项目已完成从 JavaScript 到 TypeScript 的 RPGMV 插件开发环境升级，实现了现代化的类型安全插件开发流程。

## ✨ 主要改进

### 1. 类型安全优化

- ✅ 复用现有的完整 RPGMV 类型声明
- ✅ 优化 `global.d.ts`，替换 `any` 类型为具体类型
- ✅ 完整的 TypeScript 编译时类型检查

### 2. 现代化开发流程

- ✅ TypeScript 源码：`src/rpgmv-plugins/`
- ✅ 自动构建输出：`drill-project/js/plugins/`
- ✅ 配置化构建：`tsup.config.ts`
- ✅ 热重载开发模式

### 3. 增强的开发体验

```bash
# 🚀 一键启动完整开发环境
pnpm run dev:full

# 🔄 监听模式构建插件
pnpm run build:rpgmv-plugins:watch

# 🔨 手动构建所有插件
pnpm run build:rpgmv-plugins
```

## 📁 文件结构对比

### 之前 (JavaScript)

```plain
drill-project/js/plugins/
└── VueBridge.js  ❌ 手动编写JS，缺乏类型安全
```

### 现在 (TypeScript)

```plain
src/rpgmv-plugins/
└── VueBridge.ts  ✅ TypeScript源码，类型安全

drill-project/js/plugins/
└── VueBridge.js  ✅ 自动编译生成，ES5兼容
```

## 🔧 技术栈

| 技术       | 用途         | 版本       |
| ---------- | ------------ | ---------- |
| TypeScript | 插件源码语言 | 最新       |
| tsup       | 插件构建工具 | v8.5.0     |
| ES5        | 目标兼容性   | RPGMV 兼容 |
| IIFE       | 输出格式     | 插件标准   |

## 🎯 开发流程

### 开发新插件

1. 在 `src/rpgmv-plugins/` 创建 `.ts` 文件
2. 在 `tsup.config.ts` 添加入口配置
3. 运行 `pnpm run build:rpgmv-plugins`
4. 在 `index.html` 引用生成的 `.js` 文件

### 修改现有插件

1. 编辑 `src/rpgmv-plugins/VueBridge.ts`
2. 运行构建命令重新生成
3. 刷新浏览器查看效果

## 📊 构建配置特性

### 输出优化

- **格式**: IIFE (立即执行函数)
- **目标**: ES5 (RPGMV 兼容)
- **压缩**: 可配置 (当前关闭保持可读性)
- **Source Maps**: 关闭

### 外部依赖

自动排除 RPGMV 全局对象，避免重复打包：

- `$gameVariables`, `$gameSwitches`, `$gameMessage`
- `SceneManager`, `AudioManager`
- `Scene_Boot`, `Game_Actor`

### 构建横幅

自动添加构建信息：

```javascript
//=============================================================================
// VueBridge.js - 由TypeScript编译生成
// Vue与RPGMV双向通信桥接插件
// 编译时间: 2025-07-31T09:40:10.358Z
//=============================================================================
```

## 🔍 类型安全示例

### 之前 (any 类型)

```typescript
// ❌ 缺乏类型安全
$gameVariables: any;
$gameSwitches: any;
SceneManager: any;
```

### 现在 (具体类型)

```typescript
// ✅ 完整类型安全
$gameVariables: Game_Variables;
$gameSwitches: Game_Switches;
SceneManager: SceneManagerStatic;

// ✅ 类型安全的API调用
$gameVariables.setValue(1, "Hello World");
$gameSwitches.setValue(1, true);

const audio: MV.AudioParameters = {
	name: "Decision1",
	volume: 90,
	pitch: 100,
	pan: 0,
	pos: 0,
};
AudioManager.playSe(audio);
```

## 📖 相关文档

- [TypeScript 插件开发指南](./docs/typescript-plugin-development.md) - 详细开发指南
- [Vue 与 RPGMV 双向通信系统](./docs/vue-rpgmv-communication.md) - 通信系统文档

## 🎉 使用建议

### 推荐开发流程

```bash
# 1. 启动完整开发环境 (自动构建插件+启动服务器)
pnpm run dev:full

# 2. 在另一个终端监听插件变化 (可选)
pnpm run build:rpgmv-plugins:watch
```

### 生产环境构建

```bash
# 构建所有插件用于生产环境
pnpm run build:rpgmv-plugins
```

## 🚀 立即开始

运行以下命令启动完整的 TypeScript 开发环境：

```bash
cd apps/drill
pnpm run dev:full
```

现在你可以享受类型安全、热重载的现代化 RPGMV 插件开发体验！ 🎮✨
