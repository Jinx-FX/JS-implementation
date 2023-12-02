// async、await
// 作用：用同步方式，执行异步操作

// 1. async函数是generator（迭代函数）的语法糖
// 2. async函数返回的是一个Promise对象，有无值看有无return值
// 3. await关键字只能放在async函数内部，await关键字的作用 就是获取Promise中返回的resolve或者reject的值
// 4. async、await要结合try/catch使用，防止意外的错误

// generator
// 1. generator函数跟普通函数在写法上的区别就是，多了一个星号*
// 2. 只有在generator函数中才能使用yield，相当于generator函数执行的中途暂停点
// 3. generator函数是不会自动执行的，每一次调用它的next方法，会停留在下一个yield的位置

function generatorToAsync (generatorFn) {
  // 返回的是一个新的函数
  return function () {
    // 先调用generator函数 生成迭代器
    const gen = generatorFn.apply(this, arguments);

    // 返回一个Promise, 因为外部是用.then的方式 或者await的方式去使用这个函数的返回值
    return new Promise((resolve, reject) => {
      // 内部定义一个step函数 用来一步步next
      function step (key, arg) {
        let res;

        // 这个方法需要包裹在try catch中
        // 如果报错了 就把promise给reject掉 外部通过.catch可以获取到错误
        try {
          res = gen[key](arg); // 这里有可能会执行返回reject状态的Promise
        } catch (error) {
          return reject(error); // 报错的话会走catch，直接reject
        }

        // gen.next() 得到的结果是一个 { value, done } 的结构
        const { value, done } = res;
        if (done) {
          // 如果done为true，说明走完了，进行resolve(value)
          return resolve(value);
        } else {
          // 如果done为false，说明没走完，还得继续走

          // value有可能是：常量\Promise；
          // Promise有可能是成功或者失败
          return Promise.resolve(value).then(
            val => step("next", val),
            err => step("throw", err)
          );
        }
      }

      step("next"); // 第一次执行
    });
  };
}

// 测试generatorToAsync

// 1秒后打印data1 再过一秒打印data2 最后打印success
const getData = () =>
  new Promise(resolve => setTimeout(() => resolve("data"), 1000));
var test = generatorToAsync(function* testG () {
  // await被编译成了yield
  const data = yield getData();
  console.log("data1: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
});

test().then(res => console.log(res));