# JS-implementation

#### 原型/原型链

- [手写 instanceof 方法](https://github.com/Jinx-FX/JS-implementation/blob/main/src/instanceof.js)
- [手写 new](https://github.com/Jinx-FX/JS-implementation/blob/main/src/new.js)

#### 深拷贝

- [手写深拷贝](https://github.com/Jinx-FX/JS-implementation/blob/main/src/deepClone.js)

#### call、apply 和 bind

- [手写 call、apply 及 bind 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/this.js)

#### Class 类

- [手写 class 类](https://github.com/Jinx-FX/JS-implementation/blob/main/src/class.js)

#### Promise

- [手写 promise](https://github.com/Jinx-FX/JS-implementation/blob/main/src/promise.js)
- [手写 race、all](https://github.com/Jinx-FX/JS-implementation/blob/main/src/race_all.js)
- [手写 retry](https://github.com/Jinx-FX/JS-implementation/blob/main/src/retry.js)

#### async、await

- [手写async、await](https://github.com/Jinx-FX/JS-implementation/blob/main/src/async_await.js)

#### JSON.stringify、JSON.parse

![](assets/json.stringly.jpg)

- [手写 JSON.stringify](https://github.com/Jinx-FX/JS-implementation/blob/main/src/json.stringify.md)

- [手写 JSON.parse](https://github.com/Jinx-FX/JS-implementation/blob/main/src/json.parse.md)


#### 其他

- [手写 reduce 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/reduce.js)
- [手写 map 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/map.js)
- [手写 some 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/src/some.js)
- [手写数组扁平化](https://github.com/Jinx-FX/JS-implementation/blob/main/src/flat.js)
- [compose](https://github.com/Jinx-FX/JS-implementation/blob/main/src/compose.js)
- [函数柯里化](https://github.com/Jinx-FX/JS-implementation/blob/main/src/curry.js)

#### 设计模式

设计模式是从许多优秀的软件系统中，总结出的成功的、能够实现可维护性、复用的设计方案，使用这些方案将可以让我们避免做一些重复性的工作

- [单例模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/single.js) : 一个类只能构造出唯一实例
- [策略模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/strategies.js) : 根据不同参数命中不同的策略
- [代理模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/proxyImage.js) : 代理对象和本体对象具有一致的接口
- [装饰者模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/decorate.js) : 在不改变对象自身的基础上，动态地给某个对象添加一些额外的职责
- [组合模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/combine.js) : 
  - 组合模式在对象间形成树形结构
  - 组合模式中基本对象和组合对象被一致对待
  - 无须关心对象有多少层, 调用时只需在根部进行调用
- [工厂模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/factory.js) : 不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，这个函数就可以被视为一个工厂
- [访问者模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/visitor.js) : 在不改变该对象的前提下访问其结构中元素的新方法
- [发布订阅模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/eventbus.js) : 订阅者订阅相关主题，发布者通过发布主题事件的方式，通知订阅该主题的对象
- [观察者模式](https://github.com/Jinx-FX/JS-implementation/blob/main/src/observer.js) : 一个对象有一系列依赖于它的观察者（watcher），当对象发生变化时，会通知观察者进行更新

> **观察者与发布订阅模式的区别**
> 
> - 观察者模式：一个对象有一系列依赖于它的观察者（watcher），当对象发生变化时，会通知观察者进行更新
> - 发布订阅模式：订阅者订阅相关主题，发布者通过发布主题事件的方式通知订阅该主题的对象，发布订阅模式中可以基于不同的主题去执行不同的自定义事件


#### 应用

- [函数防抖](https://github.com/Jinx-FX/JS-implementation/blob/main/src/debounce.js)
- [函数节流](https://github.com/Jinx-FX/JS-implementation/blob/main/src/throttle.js)
- [图片懒加载](https://github.com/Jinx-FX/JS-implementation/blob/main/src/observerImg.js)
  - [IntersectionObserver API 使用教程](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html)
- [虚拟dom转化为真实dom](https://github.com/Jinx-FX/JS-implementation/blob/main/src/render.js)
- [将真实dom转化为虚拟dom](https://github.com/Jinx-FX/JS-implementation/blob/main/src/dom2Json.js)

#### 手撕

- [查找数组](https://github.com/Jinx-FX/JS-implementation/blob/main/test/find.js)
- [部门分级关系](https://github.com/Jinx-FX/JS-implementation/blob/main/test/convert.js)
- [实现 `chainPromise` 函数](https://github.com/Jinx-FX/JS-implementation/blob/main/test/chainPromise.js)
- [addRemote](https://github.com/Jinx-FX/JS-implementation/blob/main/test/addRemote.js)
- [DolphinDB-test](https://github.com/Jinx-FX/JS-implementation/blob/main/test/DolphinDB)

# Reference

- https://juejin.cn/post/7146973901166215176
- https://cloud.tencent.com/developer/article/1924374
- https://www.nowcoder.com/discuss/353159470094163968?anchorPoint=comment