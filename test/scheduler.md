JS 实现一个带并发限制的异步调度去Scheduler

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
