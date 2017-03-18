---
title: 【ubuntu】在ubuntu16.04中安装xrdp
date: 2017-03-18 10:28:10
tags: [ubuntu,xrdp]
type: linux
comments: true
categories: 心得笔记
---
# 在Ubuntu 16.04上安装xRDP
## 安装过程
### 第一步
使用 `Ubuntu` 的包管理工具安装 `xRDP` ，在终端中执行以下命令
```bash
sudo apt-get install xrdp
```
### 第二步
安装备用桌面，因为 `xRDP` 无法在 `Unity` 或 `Gnome 3` 桌面中，无法正常工作。如果你不安装备用桌面，当你连接到ubuntu的时候，你只能看到一坨灰色的桌面，然后报错断开。这里我使用的是 `cinnamon`， 如果你追求稳定可以装 `Mate` 不过，它的终端*丑爆了*。。。
```bash
sudo add-apt-repository ppa:embrosyn/cinnamon
```
```bash
sudo apt update && sudo apt install cinnamon
```
这个桌面包有点大，需要慢慢等
### 第三步 配置xRDP的桌面环境
进入 `/etc/xrdp` 目录
```bash
cd /etc/xrdp
```
配置桌面环境
```bash
sudo sed -i.bak '/fi/a #xrdp multiple users configuration \n cinnamon-session \n' /etc/xrdp/startwm.sh
```
然后就可以愉快的连上ubuntu折腾了，如下图，之后我会写一篇如何用网页连接远程桌面。

![](http://p1.bqimg.com/567571/d42ec2201d022743.png)