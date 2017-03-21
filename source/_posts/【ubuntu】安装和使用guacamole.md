---
title: 【ubuntu】安装和使用guacamole
date: 2017-03-20 20:42:47
tags: [ubuntu, guacamole, vnc]
type: linux
comments: true
categories: 心得笔记
---
# 部署 `guacamole`

### 安装 `guacamole-server`
> 下载压缩包并解压
```bash
wget  "http://apache.org/dyn/closer.cgi?action=download&filename=incubator/guacamole/0.9.11-incubating/source/guacamole-server-0.9.11-incubating.tar.gz" -O guacamole-server-0.9.11.tar.gz
tar -xvf guacamole-server-0.9.11.tar.gz
```

> 在安装前我们需要先安装一些依赖包，依赖说明如下图:
![](http://i1.piimg.com/567571/841734f942541125.png)
> 安装所有依赖
```bash
sudo apt-get install libcairo2-dev  libjpeg62-dev libpng12-dev libossp-uuid-dev -y
```

> 接下来安装扩展包，太长不方便上图，直接贴链接了 [说明地址](http://guacamole.incubator.apache.org/doc/0.9.11-incubating/gug/installing-guacamole.html)
> 我这里图方便安装了所有扩展包
```bash
sudo apt-get install libavcodec-dev libavutil-dev libswscale-dev libfreerdp-dev libpango1.0-dev libssh2-1-dev libtelnet-dev libvncserver-dev libpulse-dev libssl-dev libvorbis-dev libwebp-dev -y
```
> 进入文件目录
```bash
cd guacamole-server-0.9.11-incubating/
```
> 执行 `./configure` 并配置跟随系统启动, 它会进行编译前的依赖项检查 
```bash
sudo ./configure --with-init-dir=/etc/init.d
```
![](http://i1.piimg.com/567571/126e6fc73ca977f3.png)

> ok, 所有准备工作都完成了，接下来安装 `guacd`
```bash
sudo make
sudo make install
sudo ldconfig
```

### 安装 `tocamt`

```bash
sudo apt-get install tomcat7
```

### 配置 `guacamole-client`

> 下载 guacamole-0.9.11.war
```bash
wget "http://apache.org/dyn/closer.cgi?action=download&filename=incubator/guacamole/0.9.11-incubating/binary/guacamole-0.9.11-incubating.war" -O guacamole-0.9.11.war
```
> 将文件拷贝到 `/var/lib/tomcat7/webapps/` 目录下
```
sudo cp guacamole-0.9.11.war /var/lib/tomcat7/webapps/guacamole.war
```
> 创建两个文件目录用于存放配置文件
```bash
sudo mkdir /etc/guacamole
sudo mkdir /usr/share/tomcat7/.guacamole
```
> 接下来创建 `guacamole.properties` 文件, 这是 `guacamole`的主配置文件
```bash
sudo vim /etc/guacamole/guacamole.properties
```
> 插入以下内容 [配置参考](https://guacamole.incubator.apache.org/doc/gug/configuring-guacamole.html#initial-setup)
```vim
guacd-hostname: localhost
guacd-port: 4822
user-mapping: /etc/guacamole/user-mapping.xml
basic-user-mapping: /etc/guacamole/user-mapping.xml
```
> 然后创建 `user-mapping.xml` 文件
```bash
sudo vim /etc/guacamole/user-mapping.xml
```
> 插入以下内容 [配置参考](https://guacamole.incubator.apache.org/doc/gug/configuring-guacamole.html#user-mapping)
```vim
<user-mapping>
    <authorize username="USERNAME" password="PASSWORD">
        <protocol>vnc</protocol>
        <param name="hostname">localhost</param>
        <param name="port">5901</param>
        <param name="password">VNCPASS</param>
    </authorize>
</user-mapping>
```
> 创建一个软连接，告诉tomcat到哪里去找 `guacamole.properties` 这个配置文件。
```bash
ln -s /etc/guacamole/guacamole.properties/usr/share/tomcat7/.guacamole/
```
> 修改配置文件的权限和所有者, **这很重要** 之前修改了配置一直登录失败，折腾了好久！
```bash
sudo chmod 600 /etc/guacamole/user-mapping.xml
sudo chown tomcat7:tomcat7 /etc/guacamole/user-mapping.xml
```

### 重启 `tomcat` 和 `guacd`
```bash
sudo /etc/init.d/tomcat7 restart
sudo /etc/init.d/guacd restart
```
> 到这里基本上就完成了，然后我们打开浏览器测试下
![](http://p1.bpimg.com/519918/7da6991745c7bafb.png)
成功了，但是现在我们还没法登录到server端，因为我们server端还没有开启`VNC`。

# 配置 `vnc` 

### 安装桌面

* 完整安装
```bash
apt install ubuntu-desktop gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal -y
```
* 仅安装核心功能
```bash
sudo apt-get install --no-install-recommends ubuntu-desktop gnome-panel gnome-settings-daemon metacity nautilus gnome-terminal -y
```

 编辑 ~/.vnc/xstartup, 在 x-window-manager & 的后面追加以下内容，建议先备份
 ```vim
gnome-panel &
gnome-settings-daemon &
metacity &
nautilus &
```
完整配置文件如下:
```vim
#!/bin/sh

# Uncomment the following two lines for normal desktop:
# unset SESSION_MANAGER
# exec /etc/X11/xinit/xinitrc

[ -x /etc/vnc/xstartup ] && exec /etc/vnc/xstartup
[ -r $HOME/.Xresources ] && xrdb $HOME/.Xresources
xsetroot -solid grey
vncconfig -iconic &
x-terminal-emulator -geometry 80x24+10+10 -ls -title "$VNCDESKTOP Desktop" &
x-window-manager &

gnome-panel &
gnome-settings-daemon &
metacity &
nautilus &

```
### 安装 vnc4server
```bash
sudo apt-get install vnc4server
```

### 启动 `vncserver`，首次启动，需要输入两次密码. 即`user-mapping.xml`配置的 `VNCPASSWORD`
```bash
vncserver: 1
```

> 现在所有的服务都配置好了，接着在之前打开的浏览器输入账号密码，即`user-mapping.xml`配置的 `USRENAME` 和 `PASSWORD`，然后就可以成功连上远程桌面了。

![Markdown](http://p1.bqimg.com/1949/531b2b2004431787.png)