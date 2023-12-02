// 观察者模式
// 一个对象有一系列依赖于它的观察者（watcher），当对象发生变化时，会通知观察者进行更新

// 应用案例： vue 双向绑定

let data = {
  name: "ming",
  age: 18
};
Object.keys(data).forEach(key => {
  let value = data[key];
  Object.defineProperty(data, key, {
    get () {
      console.log("get", value);
      return value;
    },
    set (newValue) {
      console.log("更新");
      value = newValue;
    }
  });
});
data.name = "佩奇";
console.log(data.name);

// 依次打印： 更新 → get 佩奇 → 佩奇