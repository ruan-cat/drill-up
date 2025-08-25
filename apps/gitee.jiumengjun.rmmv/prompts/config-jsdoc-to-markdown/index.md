# 配置基于 `jsdoc-to-markdown` 的文档生成工作流

请深度思考。

## 目录与术语说明

- **jsdoc-to-markdown**： 是一个 node 库。
- **`jsdoc2md文档`**： https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md
- **`jsdoc2md的wiki文档`**： https://github.com/jsdoc2md/jsdoc-to-markdown/wiki
- **目标项目**： 即 apps\gitee.jiumengjun.rmmv\package.json 这个 node 项目。又被成为`本项目`，`该项目`。
- **`目标md文件目录`**：`apps\gitee.jiumengjun.rmmv\docs\jsdoc`
- **`目标js文件`**： `apps\gitee.jiumengjun.rmmv\sourceCodeFile` 。均在这个目录内。都是 .js 后缀的 javascript 文件。

## 一阶段任务： 阅读上下文

1. 请你主动使用现有的工具，或 mcp 工具，主动阅读 `jsdoc2md文档` ，了解清楚你可用的 api 函数。
2. 阅读 `jsdoc2md的wiki文档` ，大概清楚有哪些使用方式即可。
3. 粗略的，大致的阅读 `目标md文件目录` ，大概清楚有哪些 javascript 文件即可，这些文件要被提取 jsdoc 信息，生成文档。了解弃文件目录结构即可，不需要你全面的阅读。避免消耗过多的 token。

## 二阶段任务： 编撰文档生成脚本

## 三阶段任务： 配置运行命令
