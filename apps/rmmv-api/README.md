# 本仓库资料来源
这是我在很久之前从一个`QQ`群内下载的`rmmv`分类源码，两年前将此代码放到`gitee`仓库。现在我基本上确定了，这些翻译的原作者是[汪汪.心高](https://rpg.blue/home.php?mod=space&uid=171386)。

[点此查看project1的原贴。](https://rpg.blue/thread-385523-1-1.html)
[点此进入github，查看最新版本的翻译。](https://github.com/wangwangxingao/RMMV/tree/master/%E6%B3%A8%E9%87%8A)




# 更多相似资料
除此之外，还有很多类似的`rmmv`源码翻译。

[点此查看9梦菌的rmmv源码翻译。](https://gitee.com/jiumengjun/rmmv)
[点此查看国外整理的rmmv源码。](https://kinoar.github.io/rmmv-doc-web/globals.html)







# 用jsdoc生成文档
本项目侧重于用`jsdoc`工具及其插件生成美观的`API页面`，以及`jsdoc`工具的其他使用，并不是单纯的`rmmv`源码翻译。

## 下载项目
```
git clone https://gitee.com/HechiCollegeComputerAssociation/rmmv-api.git
```

## 初始化项目
```
npm install
```

## 本地生成API网页
```
npm run make-jsdoc-stable
```

## 本地浏览API网页
```
npm run http-server-doc
```






# 简易配置教程
## 用js而不是json做配置
本项目不同于常见的`.json`格式配置，而是用`.js`来做`jsdoc`的配置。
https://jsdoc.app/about-configuring-jsdoc.html#configuration-file-formats




## jsdoc命令行
参考此文章配置jsdoc命令行：
https://blog.csdn.net/weixin_34128839/article/details/91934667

conf.json 的命令行
``` bash
node ./node_modules/jsdoc/jsdoc.js -c conf.json
```

.jsdoc.json 的命令行
``` bash
node ./node_modules/jsdoc/jsdoc.js -c .jsdoc.json
```

jsdoc.json 的命令行
``` bash
node ./node_modules/jsdoc/jsdoc.js -c jsdoc.json
```

参考： https://jsdoc.app/about-configuring-jsdoc.html
jsdoc.js 的命令行
``` bash
node ./node_modules/jsdoc/jsdoc.js -c jsdoc.js
```



## jsdoc2md 命令行
尚未能生效
node ./node_modules/jsdoc-to-markdown/index.js *

## package.json 配置的命令 
显示报错、实际有效
```
"make-jsdoc-file": "node_modules/.bin/jsdoc --configure .jsdoc.json  --verbose"
```
    

