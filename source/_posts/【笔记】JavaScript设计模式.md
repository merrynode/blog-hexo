---
title: 【设计模式】JavaScript单例模式
date: 2017-02-13 20:42:47
tags: [javaScript, 设计模式, 单例模式]
type: javaScript
comments: true
categories: 心得笔记
---
# 单例模式
### 单例模式的核心是确保只有一个实例，并提供全局访问
#### 1. 使用命名空间
```js
var namespace1 = {
    a: function () {
        alert(1);
    }
    b: function () {
        alert(2);
    }
}
```
动态创建命名空间
```js
var MyApp = {};

MyApp.namespace = function (name) {
    var parts = name.split('.');
    var current = MyApp;
    // 遍历创建命名空间，支持多层创建
    for (var i in parts) {
        if ( !current[parts[i]] ) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
}

MyApp.namespace('event');
MyApp.namespace('dom.style');

console.dir(MyApp);
// 等价于;
var MyApp = {
    event: {},
    dom: {
        style: {}
    }
}
```
#### 2. 使用闭包封装私有变量
```js
var user = (function () {
    var _name = 'sven';
    var _age  = '29';
    return {
        getUserInfo: function () {
            return _name + '-' + _age;
        }
    }
    // 注：ES6中可以使用 let 来声明块级作用域;
})
```

# 惰性单例模式
### 惰性单例模式是指在需要的时候才创建的对象实例
#### 1. 简单的惰性单例
```js
    Single.getInstance = (function () {
        var instance;
        return function (name) {
            if ( !instance ) {
                instance = new Single( name );
            }
            return instance;
        }
    })()
```
#### 2. 通用的惰性单例【单一职责原则】
```js
function single (fn) {
    var result;
    return result || fn.apply(this, arguments);
}

var createDiv = single(function () {
    var div = document.createElement('div');
    document.body.appendChild(div);
    return div;
})

createDiv();
createDiv();
createDiv();
// createDIV函数执行了三次，但DIV将会只创建一次，并且每次返回的都是相同的DIV
```