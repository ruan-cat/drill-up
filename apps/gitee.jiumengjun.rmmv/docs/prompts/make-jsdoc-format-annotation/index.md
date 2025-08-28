# 生成 jsdoc 格式的注释

请深度思考。

在本次对话内，你将负责帮助我批量修改代码的注释，修改成 jsdoc 格式的注释。

在我提供的文件内，会出现很对不符合 jsdoc 格式的注释，你需要将其全部转换成 jsdoc 格式的注释。

其最终目的是为了使用 `jsdoc-to-markdown` 实现对 javascript 代码的转换，生成出 markdown 文档，并最后交由 vitepress 生成文档。。

## 目录与术语说明

为了便于你找到目录，识别术语，这里专门罗列出来：

- **拆分出来的文件目录**： `apps\gitee.jiumengjun.rmmv\sourceCodeFile`
- **进度报告文件**： `apps\gitee.jiumengjun.rmmv\docs\prompts\make-jsdoc-format-annotation\todo.md`

## 进度报告文件的格式

`进度报告文件` ，是记录任务进度的文档。记录项应该同时包括以下的三项任务。

1. 进度报告文件应该设计成多个分模块的表格。
   - 表格第一列，应该是文件名。
   - 表格的后几列，分别对应以下要求的处理进度。
2. 报告进度表，应该在每一个表格块内，记录进度信息。
3. 任务进度用百分比来标记。
4. 在整个 `进度报告文件` 最底下，应该包括整体进度的报告。

### 修改进度报告文件的时机

1. 在你处理完一个 js 文件时，就应该及时地更新进度报告文件。
   - 不要拖延。
   - 不要累计几个文件的处理后，才开始更新进度报告。

## 处理 js 文件

1. 请扫描 `拆分出来的文件目录` 内全部的 .js 格式代码。这些代码需要被处理。
2. 这些 js 文件有多种被处理的要求。在处理 js 文件时，请同时地，一次性的完成以下的几个要求。
3. 阅读 `进度报告文件` 内罗列出来的文件，按照顺序选定要被处理的文件。不要跳来跳去的选取文件处理。
4. 将全部的代码处理进度，写入到 `进度报告文件` 内。当你每完成一个代码的处理后，就在此进度文档内记录进度。
5. 被完成 jsdoc 格式转换。

## 要求一： jsdoc 格式转换

将目标 js 文件，做 jsdoc 格式的转换。将不满足规范的注释，转换成 jsdoc 格式。

## 要求二： 注释翻译与补全

除了更改注释的格式为 jsdoc，对注释的中英文翻译处理也要满足以下要求：

1. 如果你看到一段注释，有英文，但是没有中文注释时，请补全注释。
2. 在格式转换的时候，适当的对没有中文的注释，增加中文注释。实现英文翻译成中文注释。
3. 中文翻译在上面，然后才是英文注释。注意严格的注释顺序。**先中文**、**后英文**。
4. 保留英文注释。

## 要求三： 补全注释

有部分函数是没有任何 jsdoc 注释的，请你补全好 jsdoc，并遵循上述的要求来补全 jsdoc。

1. 补全中英文注释。
2. 严格遵守 **先中文**、**后英文** 的规则。

## 要求四： 删除无意义的注释

我不希望代码仍旧保留这些无意义的注释。仅仅保留有意义的 jsdoc 注释即可。

## 要求五： 处理非闭合标签

jsdoc 内的注释最终都要成为 vitepress 处理的 markdown 文件，所以 jsdoc 内的注释不应该出现任何自定义的 html 标签语法。

比如以下 jsdoc 注释就是不对的：

```js
/**
 * @static
 * @method extractMetadata
 * @description
 * 从备注字符串中提取<key:value>或<key>格式的元数据。
 * Extracts metadata from note strings in <key:value> or <key> format.
 * @param {Object} data - The data object containing a note property - 包含note属性的数据对象
 */
```

这段注释最终会生成出以下的 markdown 文档：

```markdown
从备注字符串中提取<key:value>或<key>格式的元数据。
Extracts metadata from note strings in <key:value> or <key> format.
```

这段文本就是不对的，你应该这样修改处理 jsdoc：

```js
/**
 * @static
 * @method extractMetadata
 * @description
 * 从备注字符串中提取 `<key:value>` 或 `<key>` 格式的元数据。
 * Extracts metadata from note strings in `<key:value>` or `<key>` format.
 * @param {Object} data - The data object containing a note property - 包含note属性的数据对象
 */
```

那么生成出来的 markdown 文档为：

```markdown
从备注字符串中提取 `<key:value>` 或 `<key>` 格式的元数据。
Extracts metadata from note strings in `<key:value>` or `<key>` format.
```

这样的格式才是正确的，就不会出现 vitepress 编译转换上的错误了。

## 其他注意事项

1. 在你逐个处理文件的时候，请严格按照进度文件内罗列的文件顺序，逐个的完成文件处理。
2. 不需要你处理目标 .js 文件产生的任何 typescript 类型报错。
3. 不要处理任何 lint 错误。
4. 每完成一个文件的任务后，你不需要再停下来，一直继续处理。
5. 每完成一个模块后，就去更新进度文件。
6. 不要停下来给我汇报，请持续的完成你设定的任务。
