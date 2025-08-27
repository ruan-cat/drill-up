# RPG Maker MV 核心库文档

## 介绍

基于 jsdoc-to-markdown 和 VitePress 的 RPG Maker MV 核心 JavaScript 库文档生成项目。

自己添加的 RMMV 脚本框架的中文注释。B 站 ID: 9 梦菌

## 原仓库

- https://gitee.com/jiumengjun/rmmv

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器，实时预览文档：

```bash
npm run docs:dev
```

### 构建文档

生成静态文档站点：

```bash
npm run docs:build
# 或简化命令
npm run build
```

## 可用命令

| 命令 | 描述 |
|------|------|
| `npm run jsdoc:generate` | 仅生成 JSDoc markdown 文档 |
| `npm run docs:dev` | 启动开发服务器 |
| `npm run docs:build` | 构建静态文档站点 |
| `npm run docs:preview` | 预览构建后的站点 |
| `npm run docs:clean` | 清理生成的文档和缓存 |

## 项目结构

```
├── sourceCodeFile/          # JavaScript 源文件
├── scripts/                 # 文档生成脚本（TypeScript）
├── docs/                   # 文档目录
│   ├── .vitepress/        # VitePress 配置
│   ├── jsdoc/            # 自动生成的 JSDoc 文档
│   └── examples/         # 代码示例
└── package.json
```

## 文档生成工作流

本项目实现了完整的文档生成工作流：

1. **TypeScript 脚本** - 使用模块化的 TypeScript 脚本处理 JSDoc 生成
2. **一一对应** - 每个 JavaScript 文件生成对应的 Markdown 文档
3. **目录层级保留** - 保持原有的目录结构
4. **VitePress 集成** - 使用 VitePress 构建美观的文档站点

## 原有方案的问题和解决

### typedoc 方案不可行

首先要通过类型检查才行。如果目标 js 文件没有普遍通过类型检查，是不能用 typedoc 生成文件的。

如果跳过类型检查，那么几乎没有文档生成出来。

rmmv 的源码普遍无法通过严格的类型检查。无法继续实现文档生成。

### 严格 jsdoc 格式太少

jsdoc-to-markdown 方案，理论上可行，但是实际上发现大多数目标文件，没有足够数量的，严格 jsdoc 格式的注释，所以无法生成完整覆盖源码的文档。

**解决方案**: 新的文档生成脚本会为没有 JSDoc 注释的文件生成说明文档，并提供 JSDoc 格式示例。

## 借助 AI 批量生成的文档

本项目的 api 文档，是用 claude code + gemini cli 的方式来生成的。

- jsdoc 格式是借助 AI 批量转换生成的。少部分是 claude code，大部分是 gemini 生成的。
- 中英文翻译是借助 gemini 翻译的。

项目会不可避免的出现代码缺漏，翻译不准的情况。如果有缺漏，请在本项目的 issue 或 discussion 栏目下反馈，作者尽量补全。

作者并不是深度钻研 rpgmv/mz 源码的开发者。不对翻译注释负责，只对文档生成，文档组织方式负责。至于文档内容，作者并不在乎是否正确。
