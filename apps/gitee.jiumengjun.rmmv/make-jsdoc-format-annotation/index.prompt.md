# 生成 jsdoc 格式的注释

请深度思考。

在本次对话内，你将负责帮助我批量修改代码的注释，修改成 jsdoc 格式的注释。

在我提供的文件内，会出现很对不符合 jsdoc 格式的注释，你需要将其全部转换成 jsdoc 格式的注释。

其最终目的是为了使用 `jsdoc-to-markdown` 完成文件扫描与识别。

## 可以被修改的文件

你只可以阅读并修改以下我提供的文件地址来读取：

- apps\gitee.jiumengjun.rmmv\main.js
- apps\gitee.jiumengjun.rmmv\rpg_core.js
- apps\gitee.jiumengjun.rmmv\rpg_managers.js
- apps\gitee.jiumengjun.rmmv\rpg_objects.js
- apps\gitee.jiumengjun.rmmv\rpg_scenes.js
- apps\gitee.jiumengjun.rmmv\rpg_sprites.js
- apps\gitee.jiumengjun.rmmv\rpg_windows.js

这些文件都是目标文件，被处理的文件。

## 模仿其他项目的格式做代码拆分

请你先做代码拆分，再开始根据拆分后的代码，做 jsdoc 的格式转换和翻译工作。

目录格式要求如下：

请你模仿 `apps\rmmv-api\sourceCodeFile` 目录内的代码拆分方式，将 `apps\gitee.jiumengjun.rmmv` 目录内的代码拆分到 `apps\gitee.jiumengjun.rmmv\sourceCodeFile` 目录内。

在你拆分代码时，请你直接地对被处理的目标文件做删除。比如你拆分出来一个模块了，就对应的删除对应的代码。以便逐步地减少目标文件的代码长度，避免你出现单文件 token 超限的情况。

这些目标文件预期会被全部拆分完，被拆分完全部模块的代码文件，应该被直接删除。

## 逐步地完成格式转换

请不要一次性的对整个文件的全部模块做注释格式转换。请你分模块地，逐步地完成格式转换。

1. 首先请扫描我提供给你的全部 .js 格式代码。
2. 提出转换计划，并执行你的计划。
3. 归纳已经有的模块。
4. 将全部的模块注释转换进度，写入到 `apps\gitee.jiumengjun.rmmv\make-jsdoc-format-annotation\index.todo.md` 文件内。这个文件将作为你的进度记录文件，当你每完成一个模块的注释格式转换后，就在此文档内记录进度。

## 补全中文翻译

如果你看到一段注释，有英文，但是没有中文注释时，请补全注释。

## 其他注意事项

1. 不需要你处理目标 .js 文件产生的任何 typescript 类型报错。
2. 不要处理任何 lint 错误。
3. 每完成一个模块的格式转换后，你不需要再停下来，一直继续处理。
4. 每完成一个模块后，就去更新进度文件。
5. 在格式转换的时候，适当的对没有中文的注释，增加中文注释。实现英文翻译成中文注释。
6. 保留英文注释。
7. 中文翻译在上面，然后才是英文注释。
