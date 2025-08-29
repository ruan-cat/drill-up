# Bug 001: 标题重复的锚点导致 vitepress 构建搜索失败

如图，这里故意在别的文档项目内启动项目，仍旧可以稳定诱发故障。

![2025-08-28-10-47-58](https://s2.loli.net/2025/08/28/7cS3DnIMQdj6BTR.png)

::: details 报错日志

<<< ./error.log

:::

## 已处理

诱发该故障的原因是因为文档生成器使用的默认模板不合适，所以才导致生成效果不好。

阅读 jsdoc2md [内部默认使用的模板](https://github.com/jsdoc2md/dmd)，发现来自 jsdoc-to-markdown 库的 `jsdoc2md.render` 函数是提供自定义模板的功能的，所以选择自定义模板。
