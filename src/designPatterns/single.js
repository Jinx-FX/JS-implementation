// 单例模式
// 一个类只能构造出唯一实例

// 应用案例：弹框

class Single {
  constructor(name) {
    this.name = name
  }
  static getInstance (name) {
    // 静态方法
    if (!this.instance) {
      // 关键代码 this指向的是Single这个构造函数
      this.instance = new Single(name)
    }
    return this.instance
  }
}

let single1 = Single.getInstance("name1")
let single2 = Single.getInstance("name2")
console.log(single1 === single2)  // true

// 使用闭包实现单例模式
const Singleton = (() => {
  let instance;

  const createInstance = () => {
    const state = {
      value: 0,
    };

    return {
      getState: () => state,
      setValue: (newValue) => {
        state.value = newValue;
      },
    };
  };

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// 使用单例
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

instance1.setValue(42);

console.log(instance1.getState().value); // 输出: 42
console.log(instance2.getState().value); // 输出: 42
console.log(instance1 === instance2); // 输出: true
