// 工厂模式
// 工厂模式是用来创建对象的一种最常用的设计模式

// 不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，这个函数就可以被视为一个工厂

// 应用案例： jquery中的window.$

class Car {
  constructor(name, color) {
    this.name = name;
    this.color = color;
  }
}
class Factory {
  static create (type) {
    switch (type) {
      case "car":
        return new Car("汽车", "白色");
      case "bicycle":
        return new Car("自行车", "黑色");
      default:
        console.log("没有该类型");
    }
  }
}
let p1 = Factory.create("car");
let p2 = Factory.create("bicycle");
console.log(p1, p1 instanceof Car); // {name: '汽车', color: '白色'} true
console.log(p2, p2 instanceof Car); // {name: '自行车', color: '黑色'} true