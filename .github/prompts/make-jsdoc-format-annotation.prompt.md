# 生成 jsdoc 格式的注释

在本次对话内，你将负责帮助我批量修改代码的注释，修改成 jsdoc 格式的注释。

在我提供的文件内，会出现很对不符合 jsdoc 格式的注释，你需要将其全部转换成 jsdoc 格式的注释。

其最终目的是为了使用 `jsdoc-to-markdown` 完成文件扫描与识别。

## 可以被修改的文件

你只可以阅读并修改以下我提供的文件地址来读取：

apps\gitee.jiumengjun.rmmv\main.js
apps\gitee.jiumengjun.rmmv\rpg_core.js
apps\gitee.jiumengjun.rmmv\rpg_managers.js
apps\gitee.jiumengjun.rmmv\rpg_objects.js
apps\gitee.jiumengjun.rmmv\rpg_scenes.js
apps\gitee.jiumengjun.rmmv\rpg_sprites.js
apps\gitee.jiumengjun.rmmv\rpg_windows.js

## 逐步地完成格式转换

请不要一次性的对整个文件的全部模块做注释格式转换。请你分模块地，逐步地完成格式转换。

1. 首先请扫描我提供给你的全部 .js 格式代码。
2. 提出转换计划，并执行你的计划。
3. 归纳已经有的模块。
4. 将全部的模块注释转换进度，写入到 `.github\prompts\make-jsdoc-format-annotation.todo.md` 文件内。这个文件将作为你的进度记录文件，当你每完成一个模块的注释格式转换后，就在此文档内记录进度。

## 其他注意事项

1. 不需要你处理目标 .js 文件产生的任何 typescript 类型报错。
2. 不要处理任何 lint 错误。
3. 每完成一个模块的格式转换后，停下来，让我检查一遍。
