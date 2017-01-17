---
title: 【mongodb】在ubuntu上安装mongoDB
date: 2017-01-17 21:06:24
tags: [mongoDB,ubuntu]
type: mongoDB
comments: true
categories: 心得笔记
---
# ubuntu版本14.04

## 导入包管理所使用的公钥
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
```
### 创建一个mongoDB列表文件
```
echo "deb [ arch=amd64 ] http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
```
### 更新本地`package`数据库
```bash
sudo apt-get update
```

### 安装mongoDB
```bash
sudo apt-get install -y mongodb-org
```

### 设置开机自启动
```bash
vim /etc/profile
```
在文件结尾加上
```bash
/usr/bin/mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongodb.log --logappend  &
```

### 添加账户验证
进入mongo命令行
```bash
mongo
```
切换至admin
```bash
use admin
```
添加读写权限用户
```bash
db.createUser(
   {
     user: "rwmemes",
     pwd: "rabbit",
     roles: [ {role:"readWrite", db:"owner"} ]
   }
)
```
退出
```bash
exit
```
### 开启权限验证
在刚才的启动参数后面添加上`--auth`就可以开启权限验证
```bash
/usr/bin/mongod --dbpath /var/lib/mongodb/ --logpath /var/log/mongodb/mongodb.log --logappend  &
```
注：**需要先杀掉刚才后台运行的`mongoDB`**
