# 构建基于 turbo 的任务调度配置

::: tip 已使用

该提示词已使用，已完成任务。未来基本不会再继续迭代了。

:::

请深度思考。

我希望在指定项目内配置基于 turbopack 的任务调度机制。

1. 请你先阅读 turbopack 的技术文档。 https://turborepo.com/docs
2. 本仓库是基于 pnpm 的 monorepo 架构的前端项目。
3. 在本仓库的根目录内，安装 turbopack。
4. 新建根 turbo.json 配置文件。
5. 在 apps\gitee.jiumengjun.rmmv\package.json 内，做命令拆分。
   - 新建 format 格式化命令。格式化 apps\gitee.jiumengjun.rmmv 的全部文件。
   - 使用 prettier 完成格式化。
   - prettier 的格式化配置选用项目根目录的 prettier.config.js 文件。
   - 从 `prettier --experimental-cli --write .` 命令的基础上开始配置。

6. 继续做命令拆分。在 apps\gitee.jiumengjun.rmmv\package.json 内，将 docs:build 命令拆分成独立干净的命令。只负责运行 `vitepress build docs` 命令即可。
7. 明确 apps\gitee.jiumengjun.rmmv\package.json 内的三个命令，这三个命令等待被 turbo.json 调度。
   - jsdoc:generate
   - format
   - docs:build

8. 在 apps\gitee.jiumengjun.rmmv 目录内，新建 turbo.json 配置文件。并完成任务调度。
   - 先开始 jsdoc:generate 命令。该命令不需要缓存。
   - 然后再开始 format 格式化命令。格式化全部文件，也包括 jsdoc:generate 生成的文件。该命令不需要缓存。
   - 最后开始 docs:build 文档构建任务。该命令**需要缓存**。

9. 改写 apps\gitee.jiumengjun.rmmv\package.json 的 build 命令，使其使用来自 turbo 调度的命令。
10. 自主运行这个 build 命令，测试任务调度效果。
