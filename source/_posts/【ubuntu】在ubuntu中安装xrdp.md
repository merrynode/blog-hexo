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

xrdp的配置文件在/etc/xrdp目录下的xrdp.ini和sesman.ini
xrdp.ini
```vim
[globals]
bitmap_cache=yes       #位图缓存
bitmap_compression=yes #位图压缩
port=3389              #监听端口
crypt_level=low        #加密程度（low为40位，high为128位，medium为双40位）
channel_code=1         #如果设置为0，false或no，此选项将禁用所有通道
```
sesman.ini
```vim
[Globals]
ListenAddress=127.0.0.1      #监听ip地址(默认即可)
ListenPort=3350              #监听端口(默认即可)
EnableUserWindowManager=1    #1为开启,可让用户自定义自己的启动脚本
UserWindowManager=startwm.sh
DefaultWindowManager=startwm.sh

[Security]
AllowRootLogin=1              #允许root登陆
MaxLoginRetry=4               #最大重试次数
TerminalServerUsers=tSUSErs   #允许连接的用户组(如果不存在则默认全部用户允许连接)
TerminalServerAdmins=tsadmins #允许连接的超级用户(如果不存在则默认全部用户允许连接)
 
[Sessions]
MaxSessions=10           #最大会话数
KillDisconnected=0       #是否立即关闭断开的连接(如果为1,则断开连接后会自动注销)
IdleTimeLimit=0          #空闲会话时间限制(0为没有限制)
DisconnectedTimeLimit=0  #断开连接的存活时间(0为没有限制)
 
[Logging]
LogFile=./sesman.log     #登陆日志文件
LogLevel=DEBUG           #登陆日志记录等级(级别分别为,core,error,warn,info,debug)
EnableSyslog=0           #是否开启日志
SyslogLevel=DEBUG        #系统日志记录等级
```