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

## 调度 gemini cli 时的注意事项

### 调度任务时的基本步骤

claude code 调度 gemini cli 时，基本遵循以下方式来完成：

1. claude code 要负责的是任务调度，验收结果，而不是亲自去做简单的任务。
2. 先编撰合适的提示词，提示 gemini cli 去修改那个文件，拆分那些代码，并删除那些代码片段。
3. 请你使用 `gemini -p "你的提示词"` 的形式，来调用 gemini 完成读取、拆分、删除代码段的任务，或者是其他小的任务。

### 可委托给 gemini cli 的任务

gemini cli 适合 token 量巨大，简单的任务。如果你在分析拆解任务时，注意到以下任务满足以下类别时，请委托给 gemini 来完成：

- 代码拆分
- 删除代码片段
- 新建文件
- 增加中文注释
- 调整中文翻译与英文注释的顺序

### 不要交给 gemini cli 的任务

有些任务涉及到总结，我不希望用 gemini cli 来完成，要用 claude code 本身的能力来完成：

- 新建、更新进度报告文件

### 调度时的边缘情况

很多小任务将会被委托给 gemini cli 去完成，而不是直接经由 claude code 本身来完成。因为 gemini cli 更适合 token 量更大的读写任务。

1. 请不要让 gemini 使用 mcp 工具，单纯的读写文件、拆分代码、删除代码的任务，是不需要借助 gemini cli 配置的任何 mcp 工具的。
2. 请不要让 gemini 自己新建任何多余的 Python 脚本来完成任务。我们当前的运行环境下，不提供任何 Python 环境。
3. 请不要让 gemini 自己新建任何其他语言的脚本。
4. 每次 gemini cli 时，允许 gemini 单次运行 `15分钟` ，超时后就暂停。并优化对 gemini cli 的提示词。

## 一阶段任务：代码拆分

模仿其他项目的格式做代码拆分。请你先做代码拆分，再开始根据拆分后的代码，做 jsdoc 的格式转换和翻译工作。

目录格式要求如下：

请你模仿 `apps\rmmv-api\sourceCodeFile` 目录内的代码拆分方式，将 `apps\gitee.jiumengjun.rmmv` 目录内的代码拆分到 `apps\gitee.jiumengjun.rmmv\sourceCodeFile` 目录内。

在你拆分代码时，请你直接地对被处理的目标文件做删除。比如你拆分出来一个模块了，就对应的删除对应的代码。以便逐步地减少目标文件的代码长度，避免你出现单文件 token 超限的情况。

这些目标文件预期会被全部拆分完，被拆分完全部模块的代码文件，应该被直接删除。

## 二阶段任务：注释翻译与补全

在该阶段，你只可以去读写 `apps\gitee.jiumengjun.rmmv\sourceCodeFile` 内已经拆分好的文件，更改这些文件的注释。

1. 如果你看到一段注释，有英文，但是没有中文注释时，请补全注释。
2. 在格式转换的时候，适当的对没有中文的注释，增加中文注释。实现英文翻译成中文注释。
3. 中文翻译在上面，然后才是英文注释。注意严格的注释顺序。**先中文**、**后英文**。
4. 保留英文注释。

## 三阶段任务：jsdoc 格式转换

请先完成文件拆分任务后，再开始 jsdoc 的格式转换。

1. 首先请扫描 `apps\gitee.jiumengjun.rmmv\sourceCodeFile` 目录内全部的 .js 格式代码，这些代码是上一个阶段完成的代码拆分任务的成果。
2. 提出 jsdoc 格式转换计划，并执行你的计划。
3. 归纳已经有的模块。
4. 将全部的模块注释转换进度，写入到 `apps\gitee.jiumengjun.rmmv\make-jsdoc-format-annotation\index.todo.md` 文件内。这个文件将作为你的进度记录文件，当你每完成一个模块的注释格式转换后，就在此进度文档内记录进度。

## 其他注意事项

1. 不需要你处理目标 .js 文件产生的任何 typescript 类型报错。
2. 不要处理任何 lint 错误。
3. 每完成一个模块的格式转换后，你不需要再停下来，一直继续处理。
4. 每完成一个模块后，就去更新进度文件。
