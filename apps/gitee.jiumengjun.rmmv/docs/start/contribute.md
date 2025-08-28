# 参与贡献

## 安装依赖

```bash
npm install
```

## 开发模式

启动开发服务器，实时预览文档：

```bash
npm run docs:dev
```

## 构建文档

生成静态文档站点：

```bash
npm run docs:build
# 或简化命令
npm run build
```

# 可用命令

| 命令                     | 描述                       |
| ------------------------ | -------------------------- |
| `npm run jsdoc:generate` | 仅生成 JSDoc markdown 文档 |
| `npm run docs:dev`       | 启动开发服务器             |
| `npm run docs:build`     | 构建静态文档站点           |
| `npm run docs:preview`   | 预览构建后的站点           |
| `npm run docs:clean`     | 清理生成的文档和缓存       |

# 项目结构

```plain
├── sourceCodeFile/          # JavaScript 源文件
├── scripts/                 # 文档生成脚本（TypeScript）
├── docs/                   # 文档目录
│   ├── .vitepress/        # VitePress 配置
│   ├── jsdoc/            # 自动生成的 JSDoc 文档
└── package.json
```

# 文档生成工作流

本项目实现了完整的文档生成工作流：

1. **TypeScript 脚本** - 使用模块化的 TypeScript 脚本处理 JSDoc 生成
2. **一一对应** - 每个 JavaScript 文件生成对应的 Markdown 文档
3. **目录层级保留** - 保持原有的目录结构
4. **VitePress 集成** - 使用 VitePress 构建美观的文档站点
