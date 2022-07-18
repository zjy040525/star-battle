# Introduction

该项目为[2022年浙江省技工院校网站设计与开发技能竞赛](http://rlsbt.zj.gov.cn/art/2022/5/30/art_1229569595_58929499.html)的赛题，
关于此次比赛想要了解更多请[点击此处](https://mp.weixin.qq.com/s/a7Yfhvau8aaEpaue4yBszA)。

# Getting Started

**不再提供在线游玩链接，需要请自行构建。**

[Releases](https://github.com/chiyukikana/star-battle/releases/)中提供了不需要构建的版本，游戏需要在HTTP中运行！

## 下载项目

使用Git下载，[学习Git如何安装](https://www.cnblogs.com/xueweisuoyong/p/11914045.html)：

```shell
git clone https://github.com/Hti2022/star-battle.git
```

或直接点击[此处下载](https://github.com/Hti2022/star-battle/archive/refs/heads/master.zip)最新版本。

## 环境配置

安装包管理器 [Node.js](https://nodejs.org/en/)，推荐使用LTS的版本。

**（可选）** 安装pnpm（注：pnpm等价于npm，想要了解更多请[点击此处](https://rushjs.io/zh-cn/pages/maintainer/package_managers/)）：

```shell
npm -g install pnpm
```

使用`npm`安装只需要把`pnpm`开头的`p`移除。

安装依赖：

```shell
pnpm install
```

## 运行项目

开发模式预览：

```shell
pnpm dev
```

构建项目并以生产模式预览：

```shell
pnpm build
pnpm preview
```

在生产模式下构建，并以生产模式构建的产物进行预览。

# 项目结构

- .husky（git的钩子，在提交git前会格式化一遍代码。）
- dist（构建的产物）
- node_modules（项目所用到的全部依赖）
- public（公共目录，该目录下所有的文件都不会被Vite构建）
    - common（存放常用资源的文件夹）
    - sounds（存放声音资源的文件夹）
    - favicon.ico（网页的图标）
- src（所有业务逻辑的编写）
    - assets（构建时需要的资源文件夹）
    - classes（所有的类）
    - libs（依赖库）
    - scenes（游戏场景，每个场景对应不同的游戏阶段。）
    - styles（页面所有的样式）
    - utils（工具函数）
    - Game.js（游戏唯一的流程管理器）
    - main.js（入口函数）
- .editorconfig（编辑器代码规范配置文件）
- .gitattributes（git中文件的换行符配置）
- .gitignore（提交时git会忽略哪些文件）
- .prettierignore（prettier在格式化时会忽略哪些文件）
- CHANGELOG.md（更新日志）
- index.html（网页入口文件）
- LICENSE（开源协议）
- package.json（该工程的配置文件）
- pnpm-lock.yaml（提供各个依赖稳定的版本信息）
- prettier.config.js（prettier代码规范配置文件）
- README.md（自述文件）
- vite.config.js（脚手架的配置文件）

# 开发计划

- [x] 使用模块化开发
- [x] 弃用[setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)定时器，使用更为先进的 [requestAnimationFrame API](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame) 监听游戏的各种变化。
- [ ] 使用[TypeScript](https://www.typescriptlang.org/)重构项目
- [ ] 使用[Canvas API](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial)重写逻辑判定
