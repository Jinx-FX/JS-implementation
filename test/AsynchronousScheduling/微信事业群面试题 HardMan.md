> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [jasonlam0990.github.io](https://jasonlam0990.github.io/2019/04/02/%E5%BE%AE%E4%BF%A1%E4%BA%8B%E4%B8%9A%E7%BE%A4%E9%9D%A2%E8%AF%95%E9%A2%98%EF%BC%9AHardMan-LazyMan/)

> 这道题是面试腾讯暑期实习生时，被 WXG 捞起来视频面时做的一道题，当时一脸懵逼，想了好一会，不过确实是不会做。

发表于 2019-04-02 | 分类于 [面试题](https://jasonlam0990.github.io/categories/%E9%9D%A2%E8%AF%95%E9%A2%98/)

这道题是面试腾讯暑期实习生时，被 WXG 捞起来视频面时做的一道题，当时一脸懵逼，想了好一会，不过确实是不会做。主要是因为当时对类的使用以及 Promise 的掌握都还不够熟练，今天刚好想到这道题，于是翻出来好好地做了一下！

> * * *
> 
> 实现一个 HardMan:  
> HardMan(“jack”) 输出:  
> I am jack
> 
> HardMan(“jack”).rest(10).learn(“computer”) 输出  
> I am jack  
> // 等待 10 秒  
> Start learning after 10 seconds  
> Learning computer
> 
> HardMan(“jack”).restFirst(5).learn(“chinese”) 输出  
> // 等待 5 秒  
> Start learning after 5 seconds  
> I am jack  
> Learning chinese

# 方法一、使用 纯Callbacks 调用

主要涉及到的知识点
-----------------------------------

*   1. 使用 ES6 中的箭头函数可规避 this 指向的问题，否则需要用 bind 来绑定
*   2.setTimeout 异步事件，会在同步事件执行完后再开始执行
*   3. 实现链式调用，函数返回 this 即可
*   4. 队列的使用
*   5. 运用了类和面向对象的编程思想

代码展示
--------------------

```js
class _HardMan {
    constructor(name) {
        this.tasks = [];
        // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个next函数，主要是考虑了restFirst的情况
        setTimeout(() => this.next())
        this.tasks.push(() =>{
            console.log(`I am ${name}`)
            this.next()
        })
    }

    next() {
        let task = this.tasks.shift()
        task && task()
    }

    learn(params) {
        this.tasks.push(() =>{
            console.log(`Learning ${params}`)
            this.next()
        })
        return this
    }

    wait(sec) {
        setTimeout(() => {
            console.log(`Start learning after ${sec} seconds`)
            this.next()
        }, sec * 1000);
    }
    waitPrint(sec) {
        console.log(`//等待${sec}秒..`)
        this.next()
    }

    rest(sec) {
        this.tasks.push(this.waitPrint(sec))
        this.tasks.push(this.wait(sec))
        return this
    }

    restFirst(sec) {
        this.tasks.unshift(this.wait(sec))
        this.tasks.unshift(this.waitPrint(sec))
        return this
    }
}

const HardMan = function (name) {
    return new _HardMan(name)
}

HardMan("jack").restFirst(5).learn("chinese")
// //等待5秒..
// Start learning after 5 seconds
// I am jack
// Learning chinese

HardMan("jack").rest(3).learn("computer")
// //等待3秒..
// I am jack
// Start learning after 3 seconds
```

* * *

# 方法二、使用 Promise & Queue

主要涉及到的知识点
-------------------------------------

*   利用了 Promise 的异步特性

代码展示
----------------------

```js
class _HardMan {
    constructor (name) {
        this.tasks = [];
        // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个next函数，主要是考虑了restFirst的情况
        setTimeout(() => this.next());
        this.tasks.push(() => 
            new Promise(resolve => {
                console.log(`I am ${name}`)
                resolve()
            })
        )

        //其实这里可以不用return this，因为调用构造函数没有更改this的指向
        return this
    }

    next () {
        let task = this.tasks.shift();
        task && task().then(() => this.next());
    }

    rest(sec) {
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`//等待${sec}秒..`)
                setTimeout(() => {
                    console.log(`Start learning after ${sec} seconds`)
                    resolve()
                }, sec * 1000);
            })
        )
        return this
    }

    restFirst (sec) {
        this.tasks.unshift(() =>
            new Promise(resolve => {
                console.log(`//等待${sec}秒..`)
                setTimeout(() => {
                    console.log(`Start learning after ${sec} seconds`)
                    resolve()
                }, sec * 1000);
            })
        )
        return this
    }

    learn(params) {
        this.tasks.push(() => 
            new Promise(resolve => {
                console.log(`Learning ${params}`)
                resolve()
            })
        )
        return this
    }
}

const HardMan = function (name) {
    return new _HardMan(name)
}

HardMan("jack").restFirst(3).learn("Chinese").learn("Englsih").rest(2).learn("Japanese")

// //等待3秒..
// Start learning after 3 seconds
// I am jack
// Learning Chinese
// Learning Englsih
// //等待2秒..
// Start learning after 2 seconds
// Learning Japanese
```

使用 Async/Await 对方法二进行优化
-----------------------------------------------------------------------------

首先我们可以简单地优化一下，将重复的代码用 wait 抽象出来

```js
wait(sec) {
    return new Promise(resolve => {
        console.log(`//等待${sec}秒..`)
        setTimeout(() => {
            console.log(`Start learning after ${sec} seconds`)
            resolve()
        }, sec * 1000);
    })
}

rest(sec) {
    this.tasks.push(() => this.wait(sec))
    return this
}

restFirst(sec) {
    this.tasks.unshift(() => this.wait(sec))
    return this
}
```

然后删除掉 next 方法，tasks 队列中使用 Async/Await 顺序执行取代`this.next()`即可

```js
setTimeout(async () => {
    for (let task of this.tasks) {
        await task()
    }
})
```

最终代码

```js
class _HardMan {
    constructor(name) {
        this.tasks = [];
        // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，才开始执行第一个next函数，主要是考虑了restFirst的情况
        setTimeout(async () => {
            for (let task of this.tasks) {
                await task()
            }
        })
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`I am ${name}`)
                resolve()
            })
        )

        //其实这里可以不用return this，因为调用构造函数没有更改this的指向
        return this
    }

    wait(sec) {
        return new Promise(resolve => {
            console.log(`//等待${sec}秒..`)
            setTimeout(() => {
                console.log(`Start learning after ${sec} seconds`)
                resolve()
            }, sec * 1000);
        })
    }

    rest(sec) {
        this.tasks.push(() => this.wait(sec))
        return this
    }

    restFirst(sec) {
        this.tasks.unshift(() => this.wait(sec))
        return this
    }

    learn(params) {
        this.tasks.push(() =>
            new Promise(resolve => {
                console.log(`Learning ${params}`)
                resolve()
            })
        )
        return this
    }
}

const HardMan = function (name) {
    return new _HardMan(name)
}

HardMan("jack").restFirst(3).learn("Chinese").learn("Englsih").rest(2).learn("Japanese")

// //等待3秒..
// Start learning after 3 seconds
// I am jack
// Learning Chinese
// Learning Englsih
// //等待2秒..
// Start learning after 2 seconds
// Learning Japanese
```

# 题外话 : 浏览器Event Loop

> * * *
> 
> 首先区分是同步事件还是异步事件？  
> 如果是异步事件，是宏事件还是微事件？  
> 宏事件：整体代码 script，setTimeout，setInterval  
> 微事件：Promise.then，process.nextTick  
> 参考：[https://juejin.im/post/59e85eebf265da430d571f89](https://juejin.im/post/59e85eebf265da430d571f89)