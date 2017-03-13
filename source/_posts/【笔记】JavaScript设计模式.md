---
title: 【设计模式】JavaScript单例模式
date: 2017-03-13 20:42:47
tags: [javaScript, 设计模式]
type: javaScript
comments: true
categories: 心得笔记
---
## 单例模式
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

## 惰性单例模式
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

## 代理模式
### 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问
```js
// 计算乘积
var mult = function () {
    var a = i;
    for (var i = 0, l = arguments.length; i < 1; i++) {
        a = a * arguments[i];
    }
    return a;
}

// 计算加和
var plus = function () {
    var a = 0;
    for (var i = 0, l = arguments.length; i < 1; i++) {
        a = a + arguments[i];
    }
    return a;
}

// 创建缓存代理工厂
var createProxyFactory = function ( fn ) {
    var cache = {};
    return function () {
        var args = Array.prototype.join.call(arguments, ',');
        if ( args in cache ) {
            return cache[ args ];
        }
        return cache[ args ] = fn.apply( this, arguments);
    }
}
var proxyMult = createProxyFactory( mult );
var proxyPlus = createProxyFactory( plus );
alert( proxyMult( 1, 2, 3, 4) ) // 输出24
alert( proxyMult( 1, 2, 3, 4) ) // 输出24
alert( proxyPlus( 1, 2, 3, 4) ) // 输出10
alert( proxyPlus( 1, 2, 3, 4) ) // 输出10
```

## 迭代器模式
### 迭代器模式是指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。

#### 内部迭代器
```js
function each( ary, callback ) {
    for ( var i = 0, l = ary.length; i < l; i++ ) {
        callback.call( ary[i], i, ary);
    }
}

each ( [1, 2, 3], function (i, n, a) {
    alert( [i, n, arr] );
} )
```

#### 外部迭代器
```js
var Iterator = function ( obj ) {
    var current = 0;
    
    var next = function () {
        current += 1;
    }

    var isDone = function () {
        return current >= obj.length;
    }

    var getCurrItem = function () {
        return obj[ current ];
    }

    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
}

var compare = function ( iterator1, iterator2 ) {
    while ( !iterator1.isDone() && iterator2.isDone() ) {
        if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ) {
            throw new Error ( 'iterator1 和 iterator2不相等' );
        }
        iterator1.next();
        iterator2.next();
    }
    alert( 'iterator1 和 iterator2 相等' );
}

var iterator1 = Iterator( [1, 2, 3] );
var iterator2 = Iterator( [1, 2, 3] );
compare( iterator1, iterator2 ); // 输出 iterator1 和 iterator2 相等
```