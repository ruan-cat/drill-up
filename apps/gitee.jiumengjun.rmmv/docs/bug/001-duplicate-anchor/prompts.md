# 提示词

以下是解决此问题时沟通用的提示词。

## 001

请深度思考。

这是一个模板库，请问我在使用来自 jsdoc-to-markdown 的 jsdoc2md.render 函数时，要如何传递自定义的渲染模板？

比如这一段被模板渲染出来的 markdown 文档：`## allocate() ⇒ [<code>CacheEntry</code>](#CacheEntry)`

这段 markdown 文档，其格式很糟糕，我不希望我在调用 jsdoc2md.render 渲染函数时，使用默认模板渲染出这样的文档，我希望渲染出这样的文档： `## allocate() ⇒ <code>CacheEntry</code>`

我不希望渲染 markdown 的标题时，内部还嵌套了额外的锚点语法，这会导致我在渲染 vitepress 文档时出现明显错误。

请为我提供一个写法方案，并写在文档内内供我阅读。

## 002

请深度思考。

请你阅读 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\docs\自定义模板使用指南.md` 文档，并阅读 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\templates` 目录下的模板文件。

我希望为 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\markdown-generator.ts` 的 `jsdoc2md.render` 函数，实现自定义导入自定义模板的功能。

1. 将模板管理的逻辑集中在 `template-manager.ts` 文件内，`template-manager.ts` 存放在 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator` 目录内。
2. 确保 markdown-generator.ts 的逻辑简单。能够导入预设的模板即可。
3. 编写一个文档说明如何使用。

## 003

请深度思考。

请你恰当的更改 apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\templates 内的模板，实现生成 markdown 模板 `## allocate() ⇒ <code>CacheEntry</code>`

现在的 markdown 模板生成结果是： `## allocate() ⇒ <code></code>`

这个生成结果不满足文档 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\docs\自定义模板使用指南.md` 的说明要求，请你恰当的修改模板代码。

如果你搞不清楚原来的模板代码，可以阅读此目录内的模板：`apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\temp-store\templates`

## 004

请深度思考。

现在输出的 md 文本是：

```markdown
## allocate() ⇒ <code>

CacheEntry
</code>
```

我希望你输出的 md 文本是 `## allocate() ⇒ <code>CacheEntry</code>`

不要让输出的 `<code>` 闭合标签有换行的情况。

## 005

请深度思考。

形如 `## allocate() ⇒ <code>CacheEntry</code>` 的模板格式，你处理的很好，生成效果很棒。

但是在表格内的 `<code>CacheEntry</code>` 的生成结果，却生成的不好。在 markdown 的 table 表格中，出现了 `MD056/table-column-count` 的错误，因为表格缺少了补全的竖线，导致文档的表格错乱。

请你仔细阅读原来的模板代码 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\temp-store\templates`，请你阅读现在的 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\templates` 模板，搞清楚为什么渲染表格时，其闭合标签 `<code>` 的右侧，总是缺少竖线。

请解决问题，解决后请更新 `apps\gitee.jiumengjun.rmmv\scripts\markdown-generator\README.md` 文档。
