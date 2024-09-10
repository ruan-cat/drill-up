# drill-up 模块化改造的钻头项目

阮喵喵学了很多前端工程化的东西，准备那这个仓库练练手，完成旧版本传统 rm 项目的现代化改造。

慢慢来改造。

## 关闭 gitee

本仓库提供 gitee 镜像，但是不再以 gitee 镜像为主了。

## 全部仓库

- https://github.com/RuanZhongNan/drill-up
- https://gitee.com/HechiCollegeComputerAssociation/drill-up

## 两套代码的执行顺序

调整测试 vite 注入代码与 rm 代码的执行顺序。

目前没有办法调整。意识两套代码在实际的 html 内是并行执行的。

## 让 rm 源码实现自主的类型生成 提供类型声明

应该考虑让自己手头上的纯 js 文件，生成出 typescript 类型声明文件。
