---
title: 【Node.js】使用superagent下载文件
date: 2016-09-29 16:57:04
tags: [superagent,node.js]
type: node.js
comments: true
categories: 心得笔记
---

# 说明
> superagent模块是nodejs里一个十分语义化,轻量级的请求模块,可读性高，低学习曲线这也是我特别喜欢这个模块的原因，支持`callback`或者`Promise`, 同时可以用于浏览器!
### 简单的实例
```js
 request
   .post('/api/pet')
   .send({ name: 'Manny', species: 'cat' })
   .set('X-API-Key', 'foobar')
   .set('Accept', 'application/json')
   .end(function(err, res){
     if (err || !res.ok) {
       alert('Oh no! error');
     } else {
       alert('yay got ' + JSON.stringify(res.body));
     }
   });
```
## 使用
### 首先我们需要安装`superagent`这个模块,建议使用[cnpm](https://npm.taobao.org/)安装,  [yarn](https://yarnpkg.com/)这个没用过,找个时间可以研究下.

```bash
cnpm install superagent --save
```
`superagent`提供了`pipe`的方法使我们可以直接写入到`stream`,下面封装了一个下载方法.

```js
    
    const request = require('superagnet');      // 引入superagent模块
    const crypto  = require('crypto');

    function download (URL) {
        return new Promise((resolve, reject) => {

        let path  = crypto.createHmac('md5', 'key').update('' + Math.random(100)} + Date.now()).digest('hex');   // 生成临时文件名

        let stream = fs.createWriteStream(path);    // 在本地创建一个文件

            let download = new request.get(URL).send(param).pipe(stream);

            download.on('close', () => {
                // 下载完成后返回文件名
                resolve(fs.existsSync(_path) && _path.match(/[^/]+\..+/)[0]);
            })

            download.on('error', (error) => reject(error));

            stream.on('pipe', function (write) {
                let size = 0;                                  // 用于统计已下载文件
                let lastResponseTime = Date.now();              // 最后收到data数据的时间
                let fileSize = write.headers['content-length']; // 下载文件大小

                // 超时每隔5秒检测是否有读到数据, 如果10秒内无任何数据写入则抛出错误.
                let timerId = setInterval(() => {
                    
                    console.log(`文件大小:${fileSize}, 已下载:${count}`);  // 打印当前下载进度
                    
                    if ((Date.now() - lastResponseTime) > 10 * 1000) {
                        throw Error('download timeout!');
                    }

                }, 5 * 1000);
                
                // 收到data则更新最后响应时间
                write.on('data', (data) => {
                    size += data.length;
                    lastResponseTime = Date.now();
                });

                write.on('end', () => {
                    console.log('download end!');
                    // 下载完成后清除interval
                    clearInterval(timerId);
                });

                // 检测文件名如果没有文件名则退出下载
                let checkFileName = !(write.headers && write.headers['content-disposition']);

                if (checkFileName) {
                    fs.existsSync(path) && fs.unlinkSync(path); // 删除创建的临时文件
                    write.unpipe();                             // 关闭管道
                    download.close();                           // 退出
                    return;
                } 

                write.headers['content-disposition'] // 例:attachment; filename="filename.xls"
                // todo 如果需要下载后修改原始文件名, 这里可以记录服务器返回的文件名然后下载完成后再修改.
                write.headers['content-length']
                // todo 下载文件大小, 可以和size写一个下载进度条.
            })
        })
    }
```
## 注
> **需要注意的是有些网站使用`gzip`压缩, `header`中可能不包含`content-length`;**
