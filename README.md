# JS-implementation

> not only javascript, also typescript

#### hooks

- [定时器](https://github.com/Jinx-FX/JS-implementation/blob/main/hooks/useTimer.js)

#### 原型/原型链

- [手写 instanceof 方法](https://github.com/Jinx-FX/JS-implementation/blob/main/src/prototype/instanceof.js)
- [手写 new](https://github.com/Jinx-FX/JS-implementation/blob/main/src/prototype/new.js)
- [手写 寄生组合式继承](https://github.com/Jinx-FX/JS-implementation/blob/main/src/prototype/inherit.js)
- [手写 class 类](https://github.com/Jinx-FX/JS-implementation/blob/main/src/prototype/class.js)

#### 深拷贝

- [手写深拷贝](https://github.com/Jinx-FX/JS-implementation/blob/main/src/deepClone/deepClone.js)

#### call、apply 和 bind

- [手写 call、apply 及 bind 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/bindThis/this.js)

#### Promise

- [手写 promise](https://github.com/Jinx-FX/JS-implementation/blob/main/src/promise/promise.js)
- [手写 race、all](https://github.com/Jinx-FX/JS-implementation/blob/main/src/promise/race_all.js)
- [手写 retry](https://github.com/Jinx-FX/JS-implementation/blob/main/src/promise/retry.js)
- [手写 promisify](https://github.com/Jinx-FX/JS-implementation/blob/main/src/promise/promisify.js)
- [手写async、await](https://github.com/Jinx-FX/JS-implementation/blob/main/src/promise/async_await.js)

#### 生成器

- [手写生成器函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/generator/next.js)

#### EventLoop

- [事件轮询机制](https://github.com/Jinx-FX/JS-implementation/blob/main/src/eventLoop/eventLoop.js)

#### JSON.stringify、JSON.parse

![](assets/json.stringly.jpg)

- [手写 JSON.stringify](https://github.com/Jinx-FX/JS-implementation/blob/main/src/jsonHandle/json.stringify.md)

- [手写 JSON.parse](https://github.com/Jinx-FX/JS-implementation/blob/main/src/jsonHandle/json.parse.md)

#### Error handle

- [catchError](https://github.com/Jinx-FX/JS-implementation/blob/main/src/errorHandle/catchError.ts)

#### 其他

- [手写 reduce 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/others/reduce.js)
- [手写 map 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/others/map.js)
- [手写 some 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/others/some.js)
- [手写数组扁平化](https://github.com/Jinx-FX/JS-implementation/blob/main/src/others/flat.js)
- [compose](https://github.com/Jinx-FX/JS-implementation/blob/main/src/others/compose.js)
- [函数柯里化](https://github.com/Jinx-FX/JS-implementation/blob/main/src/others/curry.js)

#### 设计模式

设计模式是从许多优秀的软件系统中，总结出的成功的、能够实现可维护性、复用的设计方案，使用这些方案将可以让我们避免做一些重复性的工作

- [单例模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/single.js) : 一个类只能构造出唯一实例
- [策略模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/strategies.js) : 根据不同参数命中不同的策略
- [代理模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/proxyImage.js) : 代理对象和本体对象具有一致的接口
- [装饰者模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/decorate.js) : 在不改变对象自身的基础上，动态地给某个对象添加一些额外的职责
- [组合模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/combine.js) :
  - 组合模式在对象间形成树形结构
  - 组合模式中基本对象和组合对象被一致对待
  - 无须关心对象有多少层, 调用时只需在根部进行调用
- [工厂模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/factory.js) : 不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，这个函数就可以被视为一个工厂
- [访问者模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/visitor.js) : 在不改变该对象的前提下访问其结构中元素的新方法
- [发布订阅模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/eventbus.js) : 订阅者订阅相关主题，发布者通过发布主题事件的方式，通知订阅该主题的对象
- [观察者模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/observer.js) : 一个对象有一系列依赖于它的观察者（watcher），当对象发生变化时，会通知观察者进行更新

> **观察者与发布订阅模式的区别**
>
> 观察者模式和发布-订阅模式之间的区别，在于是否存在第三方、发布者能否直接感知订阅者
>
> - 观察者模式：一个对象有一系列依赖于它的观察者（watcher），当对象发生变化时，会通知观察者进行更新
> - 发布订阅模式：订阅者订阅相关主题，发布者通过发布主题事件的方式通知订阅该主题的对象，发布订阅模式中可以基于不同的主题去执行不同的自定义事件。发布者不直接触及到订阅者、而是由**统一的第三方**来完成实际的通信的操作。

- [依赖注入](https://github.com/Jinx-FX/JS-implementation/blob/main/src/designPatterns/dependency_injection.md) : 一种设计模式，用于实现控制反转（Inversion of Control, IoC）。它通过将对象的依赖关系从内部管理转移到外部管理，使得对象的创建和依赖关系的管理更加灵活和可维护。

#### 高阶函数(High Ordered Functions)

高阶函数的范式：

```js
function HOF0(fn) {
  return function(...args) {
    return fn.apply(this, args);
  }
}
```

- [函数防抖](https://github.com/Jinx-FX/JS-implementation/blob/main/src/decorate/debounce.js)
- [函数节流](https://github.com/Jinx-FX/JS-implementation/blob/main/src/decorate/throttle.js)
- [once 装饰](https://github.com/Jinx-FX/JS-implementation/blob/main/src/decorate/once.js)
- [函数拦截器](https://github.com/Jinx-FX/JS-implementation/blob/main/src/decorate/intercept.js)


#### 应用

- [图片懒加载](https://github.com/Jinx-FX/JS-implementation/blob/main/src/apply/observerImg.js)
  - [IntersectionObserver API 使用教程](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
- [虚拟dom转化为真实dom](https://github.com/Jinx-FX/JS-implementation/blob/main/src/apply/render.js)
- [将真实dom转化为虚拟dom](https://github.com/Jinx-FX/JS-implementation/blob/main/src/apply/dom2Json.js)
- [html简易解析](https://github.com/Jinx-FX/JS-implementation/blob/main/src/apply/html2obj.js)

#### 手撕

- [查找数组](https://github.com/Jinx-FX/JS-implementation/blob/main/test/find.js)
- [部门分级关系](https://github.com/Jinx-FX/JS-implementation/blob/main/test/convert.js)
- [DolphinDB-test](https://github.com/Jinx-FX/JS-implementation/blob/main/test/DolphinDB)
- [大数相加](https://github.com/Jinx-FX/JS-implementation/blob/main/test/bigSum.js)
- [url检索](https://github.com/Jinx-FX/JS-implementation/blob/main/test/urlEncode.md)
- [middleware](https://github.com/Jinx-FX/JS-implementation/blob/main/test/middleware.md)

##### 异步调度

- [带并发限制的异步调度去Scheduler](https://github.com/Jinx-FX/JS-implementation/blob/main/test/AsynchronousScheduling/scheduler.md)
- [实现 `chainPromise` 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/test/AsynchronousScheduling/chainPromise.js)
- [addRemote](https://github.com/Jinx-FX/JS-implementation/blob/main/test/AsynchronousScheduling/addRemote.js)
- [HardMan](https://github.com/Jinx-FX/JS-implementation/blob/main/test/AsynchronousScheduling/HardMan.js)
- [异步批量处理](https://github.com/Jinx-FX/JS-implementation/blob/main/test/AsynchronousScheduling/batcher.md)

# Reference

- <https://juejin.cn/post/7146973901166215176>
- <https://cloud.tencent.com/developer/article/1924374>
- <https://www.nowcoder.com/discuss/353159470094163968?anchorPoint=comment>
