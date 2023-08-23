// 继承

// 多种继承方式
// 1）原型链继承，缺点：引用类型的属性被所有实例共享
// 2）借用构造函数（经典继承）
// 3）原型式继承
// 4）寄生式继承
// 5）组合继承
// 6）寄生组合式继承

// 寄生组合式继承的优势
// 优势：借用父类的构造函数，在不需要生成父类实例的情况下，继承了父类原型上的属性和方法

// 精简版
class Child {
  constructor() {
    // 调用父类的构造函数
    Parent.call(this)
    // 利用Object.create生成一个对象，新生成对象的原型是父类的原型，并将该对象作为子类构造函数的原型，继承了父类原型上的属性和方法
    Child.prototype = Object.create(Parent.prototype)
    // 原型对象的constructor指向子类的构造函数
    Child.prototype.constructor = Child
  }
}

// 通用版
function Parent (name) {
  this.name = name
}
Parent.prototype.getName = function () {
  console.log(this.name)
}
function Child (name, age) {
  // 调用父类的构造函数
  Parent.call(this, name)
  this.age = age
}
function createObj (o) {
  // 目的是为了继承父类原型上的属性和方法，在不需要实例化父类构造函数的情况下，避免生成父类的实例，如new Parent()
  function F () { }
  F.prototype = o
  // 创建一个空对象，该对象原型指向父类的原型对象
  return new F()
}

// 等同于 Child.prototype = Object.create(Parent.prototype)
Child.prototype = createObj(Parent.prototype)
Child.prototype.constructor = Child

let child = new Child("tom", 12)
child.getName() // tom
