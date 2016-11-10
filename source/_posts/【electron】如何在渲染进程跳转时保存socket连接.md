---
title: 【electron】如何在渲染进程页面跳转后仍保持socket连接
date: 2016-09-21 20:33:01
tags: [electron,socket,node.js]
type: electron
comments: true
categories: 心得笔记
---

----

> 由于博主的页面是访问的第三方页面,每次页面跳转后无法保持`socket`连接，
> 一开始在主进程建立`socket`连接，渲染进程通过`ipcRenderer`发送事件到主进程中，
> 然后主进程通过`socket`转发渲染进程事件到服务器, 但是这么处理每次都需要做个转发操作，很繁琐，
> 然后查文档，发现有个`remote`模块可以从渲染进程访问主进程的全局变量，
> 我们可以将`socket`保存到主进程里面,然后跳转之后从主进程取这个`socket`对象。
> **需要注意的是跳转之前需要把当前渲染进程中绑定的事件全部都清除掉，不然会报错。**

----

* ### 在主进程定义一个全局变量保存socket连接
```js
const io = require('socket.io-client');
const socket = io('http://localhost');  //连接socket
global.cache = {socket: socket};        //将socket保存到全局的cache变量中
```

* ### 在子进程中通过remote访问主进程的socket
```js
const {remote} = require('electrion');  
const {socket} = remote.getGlobal('cache'); //  获取保存在cache中的socket连接
socket.on('hi', function (msg) {            //  绑定事件
    console.log(msg);
    socket.emit('hello', 'hello');
})
```

* ### 渲染进程页面跳转时清除页面中绑定的事件
```js
    window.onbeforeunload = function () {   //  在页面跳转或关闭前销毁当前页面的所有绑定事件防止报错
        socket.removeAllListeners('hi');
    }
```

> 由于博主的页面是访问的第三方页面并不是单页应用所以只能将`socket`保存在主进程中，如果你是本地页面，建议做成单页应用的方式来避免这种情况出现.

