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
