# 在 rpgmv 项目中与 vue 的 app 实例之间实现数据通信

项目 apps\drill 是一个 vite 项目，其中静态模板 index.html 通过 vite 插件 createHtmlPlugin 移动到了 apps\drill\drill-project 目录内。`apps\drill\drill-project` 目录内的代码是一个独立的 RPGMV 项目，是一个前端 H5 项目，可以独立运行。

位于 apps\drill 目录的项目，可以理解为借用 RPGMV 游戏项目为 index.html 模板的 vite 项目。

请你帮我设计一个数据通信方案，实现数据的双向通信。

比如 vite 项目的 vue 组件可以修改 RPGMV 的全局变量，RPGMV 内的变量发生变化时，也能够通过函数或者是事件监听的方式，通知到 vue 组件做出相应。
