// 深拷贝
// 深拷贝的方式

// 1. JSON.parse(JSON.stringify())
// 缺点： 无法拷贝 函数、正则、时间格式、原型上的属性和方法等
// 2. 递归实现深拷贝

// 解决 循环引用 和 多个属性引用同一个对象（重复拷贝）的情况

// 使用 hash 存储已拷贝过的对象，避免循环拷贝和重复拷贝
// 使用 WeakMap 的好处是，WeakMap 存储的 key 必须是对象，并且 key 都是弱引用，便于垃圾回收
function deepClone (target, hash = new WeakMap()) {
  if (!isObject(target)) return target;
  if (hash.get(target)) return hash.get(target);
  // 兼容数组和对象
  let newObj = Array.isArray(target) ? [] : {};
  // 关键代码，解决对象的属性循环引用 和 多个属性引用同一个对象的问题，避免重复拷贝
  hash.set(target, newObj);
  for (let key in target) {
    if (target.hasOwnProperty(key)) {
      if (isObject(target[key])) {
        newObj[key] = deepClone(target[key], hash); // 递归拷贝
      } else {
        newObj[key] = target[key];
      }
    }
  }
  return newObj;
}
function isObject (target) {
  return typeof target === "object" && target !== null;
}

// 示例
let info = { item: 1 };
let obj = {
  key1: info,
  key2: info,
  list: [1, 2],
  reg: /\.css$/g,
  time: Date.now(),
  hello: function () {
    console.log('hello', 1 + 1)
  }
};

// 循环引用深拷贝示例
obj.key3 = obj;
let val = deepClone(obj);
console.log(val)
console.log(val.key3);

