# 配置基于 `jsdoc-to-markdown` 的文档生成工作流

请深度思考。

## 目录与术语说明

- **jsdoc-to-markdown**： 是一个 node 库。
- **`jsdoc2md文档`**： https://github.com/jsdoc2md/jsdoc-to-markdown/blob/master/docs/API.md
- **`jsdoc2md的wiki文档`**： https://github.com/jsdoc2md/jsdoc-to-markdown/wiki
- **目标项目**： 即 apps\gitee.jiumengjun.rmmv\package.json 这个 node 项目。又被成为`本项目`，`该项目`。
- **`目标md文件目录`**：`apps\gitee.jiumengjun.rmmv\docs\jsdoc`
- **`目标js文件`**： `apps\gitee.jiumengjun.rmmv\sourceCodeFile` 。均在这个目录内。都是 .js 后缀的 javascript 文件。
- **脚本目录**： `apps\gitee.jiumengjun.rmmv\scripts`
- **`vitepress文档生成库`**： https://vitepress-preset.ruancat6312.top/
- **文档根目录**： `apps\gitee.jiumengjun.rmmv\docs`
- **`git忽略文件`**： `apps\gitee.jiumengjun.rmmv\.gitignore`

## 一阶段任务： 阅读上下文

1. 请你主动使用现有的工具，或 mcp 工具，主动阅读 `jsdoc2md文档` ，了解清楚你可用的 api 函数。
2. 阅读 `jsdoc2md的wiki文档` ，大概清楚有哪些使用方式即可。
3. 粗略的，大致的阅读 `目标md文件目录` ，大概清楚有哪些 javascript 文件即可，这些文件要被提取 jsdoc 信息，生成文档。了解弃文件目录结构即可，不需要你全面的阅读。避免消耗过多的 token。

## 二阶段任务： 编撰文档生成脚本

请你在 `脚本目录` 内为我编写一个基于 jsdoc-to-markdown api 的文档生成脚本。用 jsdoc-to-markdown 的能力，将 `目标js文件` 都转换成 markdown 文档，并都存储在 `目标md文件目录` 内。

### 生成文档的要求

在你生成 markdown 文档时，请满足以下要求：

1. **一一对应的文件**： 我不希望出现全部 javascript 代码都被合成到一份 markdown 文件内，我希望一份 javascript 代码就有一份 markdown 文档。并且
2. **保留文件目录层级**： 在生成 markdown 文档时，请保留文件的目录结构。比如文件 `apps\gitee.jiumengjun.rmmv\sourceCodeFile\rpg_core\CacheMap.js` ，我希望生成的 markdown 文档的目录结构在 `apps\gitee.jiumengjun.rmmv\docs\jsdoc\rpg_core\CacheMap.md` 内。
3. **生成文件到指定的目录内**： 生成的 markdown 文档必须要在 `目标md文件目录` 内。
4. **主动补全文件忽略**： 生成的 markdown 文件不应该提交到 git 仓库内，请在 `git忽略文件` 主动添加 `目标md文件目录` 。

### 生成脚本的要求

1. **正确的存储位置**： 务必存储在 `脚本目录` 内。
2. **指定格式**： 必须是 typescript 文件。生成脚本必须是 typescript 文件。
3. **恰当的文件拆分**： 请不要新建一个单独的，巨大的，冗长的 typescript 脚本。请你做好恰当的文件拆分，将脚本拆分成几个模块。
4. **指定的入口命名**： 脚本的入口文件应该命名为 `index.ts` 文件。

## 三阶段任务： 配置文档生成框架

请你阅读 `vitepress文档生成库` 文档，在本项目内，配置简单的，基础的 vitepress 文档配置。基于 `文档根目录` 新建 vitepress 文档项目。

1. 不要重复新建 package.json。在本项目内，增加 vitepress 文档配置。让本项目能够渲染出文档。而不是从头新建一个独立的 node 项目。
2. vitepress 项目的文档目录是 `文档根目录`，预期的 `.vitepress` 文件配置也应该在 `文档根目录` 内。
3. 请你在 `git忽略文件` 内自主添加 vitepress 项目常见的缓存忽略配置。

## 四阶段任务： 配置运行命令

在 `目标项目` 的 package.json 内，增加合适的运行命令，完成文档生成和文档构建。

1. 先运行基于 jsdoc-to-markdown 的文档生成脚本。用 `tsx` 来运行 typescript 文件。
2. 然后再运行 vitepress 的 build 命令，实现文档构建。
