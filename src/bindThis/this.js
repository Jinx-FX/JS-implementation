// call apply bind
// 三者的区别
// 1. 三者都可以显式绑定函数的 this 指向
// 2. 三者第一个参数都是 this 要指向的对象，若该参数为 undefined 或 null，this 则默认指向全局 window
// 3. 传参不同：apply 是数组、call 是参数列表，而 bind 可以分为多次传入，实现参数的合并
// 4. call、apply 是立即执行，bind 是返回绑定 this 之后的函数，如果这个新的函数作为构造函数被调用，
// 那么 this 不再指向传入给 bind 的第一个参数，而是指向新生成的对象

// mark: bind 会创建一个新函数，永久绑定 this，后续 call/apply 无法修改

// 手写call
Function.prototype.Call = function (context, ...args) {
  // context为undefined或null时，则this默认指向全局window
  if (!context || context === null) {
    context = window;
  }
  // 利用Symbol创建一个唯一的key值，防止新增加的属性与obj中的属性名重复
  let fn = Symbol();
  // this指向调用call的函数
  context[fn] = this;
  // 隐式绑定this，如执行obj.foo(), foo内的this指向obj
  let res = context[fn](...args);
  // 执行完以后，删除新增加的属性
  delete context[fn];
  return res;
};

// apply与call相似，只有第二个参数是一个数组，
Function.prototype.Apply = function (context, args) {
  if (!context || context === null) {
    context = window;
  }
  let fn = Symbol();
  context[fn] = this;
  let res = context[fn](...args);
  delete context[fn];
  return res;
};

// bind 要考虑返回的函数，作为构造函数被调用的情况
Function.prototype.Bind = function (context, ...args) {
  if (!context || context === null) {
    context = window;
  }
  let fn = this;
  let f = Symbol();
  const result = function (...args1) {
    if (this instanceof fn) {
      // result如果作为构造函数被调用，this指向的是new出来的对象
      // this instanceof fn，判断new出来的对象是否为fn的实例
      this[f] = fn;
      let res = this[f](...args, ...args1);
      delete this[f];
      return res;
    } else {
      // bind返回的函数作为普通函数被调用时
      context[f] = fn;
      let res = context[f](...args, ...args1);
      delete context[f];
      return res;
    }
  };
  // 如果绑定的是构造函数 那么需要继承构造函数原型属性和方法
  // 实现继承的方式: 使用Object.create
  result.prototype = Object.create(fn.prototype);
  return result;
};
