// instanceof
// instanceof 的基本用法
// 它可以判断一个对象的原型链上是否包含该构造函数的原型
// 经常用来判断对象是否为该构造函数的实例

function myInstanceof (obj, fn) {
  let prototype = fn.prototype
  obj = obj.__proto__
  while (true) {
    if (obj === null || obj === undefined)
      return false
    if (prototype === obj)
      return true
    obj = obj.__proto__
  }
}

function instanceOf (obj, fn) {
  let proto = obj.__proto__
  if (proto) {
    if (proto === fn.prototype) {
      return true
    } else {
      return instanceOf(proto, fn)
    }
  } else {
    return false
  }
}

// 测试
function Dog () { }
let dog = new Dog();
console.log(instanceOf(dog, Dog), instanceOf(dog, Object)); // true true