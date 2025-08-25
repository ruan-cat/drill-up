# RMMV 脚本框架中文注释

## 介绍

自己添加的 RMMV 脚本框架的中文注释。B 站 ID: 9 梦菌

## 原仓库

- https://gitee.com/jiumengjun/rmmv

## 编写命令来生成文件

- https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/How-to-use-with-npm-run
- https://github.com/jsdoc2md/jsdoc-to-markdown/wiki/How-to-document-TypeScript#3-setup-build-task

```json
{
	"scripts": {
		"make-doc": "jsdoc2md --files ./rpg_*.js > ./dist/jsdoc2md-res.md"
	}
}
```

## typedoc 方案不可行

首先要通过类型检查才行。如果目标 js 文件没有普遍通过类型检查，是不能用 typedoc 生成文件的。

如果跳过类型检查，那么几乎没有文档生成出来。

rmmv 的源码普遍无法通过严格的类型检查。无法继续实现文档生成。

## 严格 jsdoc 格式太少

jsdoc-to-markdown 方案，理论上可行，但是实际上发现大多数目标文件，没有足够数量的，严格 jsdoc 格式的注释，所以无法生成完整覆盖源码的文档。

<!-- TODO: 尝试用 cursor 批量改写代码 转写成满足 jsdoc 格式的文本 -->

## 借助 AI 批量生成的文档

本项目的 api 文档，是用 claude code + gemini cli 的方式来生成的。

- jsdoc 格式是借助 AI 批量转换生成的。少部分是 claude code，大部分是 gemini 生成的。
- 中英文翻译是借助 gemini 翻译的。

项目会不可避免的出现代码缺漏，翻译不准的情况。如果有缺漏，请在本项目的 issue 或 discussion 栏目下反馈，作者尽量补全。

作者并不是深度钻研 rpgmv/mz 源码的开发者。不对翻译注释负责，只对文档生成，文档组织方式负责。至于文档内容，作者并不在乎是否正确。
