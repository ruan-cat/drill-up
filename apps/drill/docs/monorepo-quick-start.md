# 🚀 Monorepo 快速启动指南

## 📁 项目结构

这是一个基于 pnpm workspace 的 monorepo 项目：

```plain
gh.ruancat.drill-up.v3.62/
├── package.json                    # 根目录配置
├── pnpm-workspace.yaml            # 工作区配置
├── apps/
│   └── drill/                     # Vue + RPGMV 项目
│       ├── package.json           # drill 项目配置
│       ├── src/                   # Vue 源码
│       ├── drill-project/         # RPGMV 项目
│       └── plugins/               # Vite 插件
└── ...
```

## 🎯 快速启动

### 方式 1：从项目根目录启动（推荐）

```bash
# 在项目根目录下运行
pnpm run dev:drill
```

### 方式 2：从 apps/drill 目录启动

```bash
# 切换到 drill 项目目录
cd apps/drill

# 启动开发服务器
pnpm run dev:drill
```

## 🔧 可用的根目录脚本

在项目根目录下，你可以使用以下便捷脚本：

```bash
# 开发相关
pnpm run dev:drill                  # 启动 drill 项目开发服务器
pnpm run build:drill                # 构建 drill 项目
pnpm run build:rpgmv-plugins       # 构建 RPGMV 插件

# 其他项目脚本
pnpm run lint                       # 代码检查
pnpm run lint:fix                   # 自动修复代码问题
pnpm run prettier                   # 代码格式化
```

## 🎮 开发体验

### 自动构建特性

- ✅ **零配置启动**：`pnpm run dev:drill` 一键启动
- ✅ **自动插件构建**：Vite 插件自动构建 TypeScript RPGMV 插件
- ✅ **热重载支持**：修改 TypeScript 插件源码自动重新构建
- ✅ **智能缓存**：避免重复构建，提升开发效率

### 开发流程

1. **启动开发**：

   ```bash
   pnpm run dev:drill
   ```

2. **修改 Vue 组件**：
   - 编辑 `apps/drill/src/components/` 下的 Vue 文件
   - 浏览器自动热重载

3. **修改 RPGMV 插件**：
   - 编辑 `apps/drill/src/rpgmv-plugins/` 下的 TypeScript 文件
   - 插件自动重新构建并热重载

4. **查看效果**：
   - 浏览器访问 `http://localhost:8080`
   - 查看 Vue 控制面板和 RPGMV 游戏

## 🛠️ 故障排除

### 问题 1：找不到 dev:drill 脚本

**解决方案**：确保在正确的目录下运行命令

```bash
# 在项目根目录下运行
pnpm run dev:drill

# 或者在 apps/drill 目录下运行
cd apps/drill
pnpm run dev:drill
```

### 问题 2：依赖缺失错误

**解决方案**：安装缺失的依赖

```bash
# 在 apps/drill 目录下安装依赖
cd apps/drill
pnpm install

# 或者从根目录安装所有依赖
pnpm install
```

### 问题 3：TypeScript 编译错误

**解决方案**：检查类型声明和配置

```bash
# 检查 TypeScript 配置
cd apps/drill
pnpm run vue-tsc
```

## 📚 相关文档

- [TypeScript 插件开发指南](./typescript-plugin-development.md)
- [Vue 与 RPGMV 双向通信系统](./vue-rpgmv-communication.md)
- [README - TypeScript 插件开发](./../README-TYPESCRIPT-PLUGINS.md)

## 🎉 开始开发

现在你可以享受现代化的 monorepo 开发体验：

```bash
# 一键启动
pnpm run dev:drill
```

🎮✨ **开发从未如此简单！**
