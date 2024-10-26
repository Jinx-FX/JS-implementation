JS 实现一个带并发限制的异步调度去Scheduler
---

保证同时运行的任务最多有两个

完善下面代码中的 Scheduler 类，使得一下程序能正确输出。

```js
class Scheduler {
  add(promiseCreaor) {}
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

// output: 2, 3, 1 , 4

// 一开始  1、 2 两个任务进入队列
// 500ms 时， 2 完成， 输出2， 任务 3 进队
// 800ms 时， 3 完成， 输出 3，  任务 4 进度
//1000ms 时， 1 完成输出 1
```

> 代码实现：[scheduler.js](./scheduler.js)

补充实现：异步控制并发数
---

在 JavaScript 中，可以通过多种方式来控制异步操作的并发数。以下是一种常见的实现方法：

```js
function asyncFunctionWithConcurrencyLimit(asyncFunctions, concurrencyLimit) {
  let inFlightCount = 0;
  let results = [];
  let index = 0;

  function executeNext() {
    if (index < asyncFunctions.length && inFlightCount < concurrencyLimit) {
      inFlightCount++;
      const currentIndex = index;
      index++;
      const asyncFunc = asyncFunctions[currentIndex];
      asyncFunc()
        .then((result) => {
          results[currentIndex] = result;
          inFlightCount--;
          executeNext();
        })
        .catch((error) => {
          results[currentIndex] = error;
          inFlightCount--;
          executeNext();
        });
    }
  }

  for (let i = 0; i < concurrencyLimit && i < asyncFunctions.length; i++) {
    executeNext();
  }

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (results.length === asyncFunctions.length) {
        clearInterval(interval);
        resolve(results);
      }
    }, 100);
  });
}
```

使用方法如下：

```js
// 模拟一些异步函数
function asyncTask(index) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Task ${index} completed`);
    }, Math.random() * 2000);
  });
}

const tasks = Array.from({ length: 10 }, (_, index) => () => asyncTask(index));
const concurrencyLimit = 3;

asyncFunctionWithConcurrencyLimit(tasks, concurrencyLimit).then((results) => {
  console.log(results);
});
```

在这个例子中，asyncFunctionWithConcurrencyLimit 函数接受一个异步函数数组和一个并发数限制作为参数。它通过控制同时执行的异步函数数量来确保不会超出并发限制。当一个异步函数完成时，会自动启动下一个异步函数，直到所有的异步函数都完成。最后，它返回一个 Promise，当所有异步函数都完成时，这个 Promise 会被 resolve，结果数组包含了所有异步函数的执行结果。
