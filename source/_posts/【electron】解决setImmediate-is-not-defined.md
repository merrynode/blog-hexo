---
title: 【electron】解决setImmediate_is_not_defined
date: 2016-11-09 15:06:19
tags: [electron, node.js]
type: node.js
comments: true
categories: 心得笔记
---

----

> 在`electron`渲染的页面中使用`superagent`经常会报`setImmediate is not defined!`
> 原因是预加载的脚本执行的时候`setImmediate`函数仍然可用，但是web页面开始加载时
> `node`的`global`会被清除，所以会出现`setImmediate is not defined`的错误。

----
### 解决方案如下

```js
let _setImmediate = setImmediate;   // 声明_setImmediate暂存setImmediate的引用
process.once('loaded', function() {
  global.setImmediate = _setImmediate;  // 等待进程加载后将引用重新挂载到setImmediate
});
```

