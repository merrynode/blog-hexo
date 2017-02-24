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
     user: "rwuser",
     pwd: "pwd",
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



## mongoDB用户
> 内建的角色  
数据库用户角色：read、readWrite;  
数据库管理角色：dbAdmin、dbOwner、userAdmin；  
集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；  
备份恢复角色：backup、restore；  
所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase  
超级用户角色：root // 这里还有几个角色间接或直接提供了系统超级用户的访问（dbOwner 、userAdmin、userAdminAnyDatabase）  
内部角色：__system  

### 角色说明：
>Read：允许用户读取指定数据库  
readWrite：允许用户读写指定数据库  
dbAdmin：允许用户在指定数据库中执行管理函数，如索引创建、删除，查看统计或访问system.profile  
userAdmin：允许用户向system.users集合写入，可以找指定数据库里创建、删除和管理用户  
clusterAdmin：只在admin数据库中可用，赋予用户所有分片和复制集相关函数的管理权限。  
readAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读权限  
readWriteAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的读写权限  
userAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的userAdmin权限  
dbAdminAnyDatabase：只在admin数据库中可用，赋予用户所有数据库的dbAdmin权限。  
root：只在admin数据库中可用。超级账号，超级权限  
