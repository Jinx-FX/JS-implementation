// 以下是实现带并发限制的异步调度器的代码：

class Scheduler {
    constructor(concurrency) {
      this.concurrency = concurrency;
      this.running = 0;
      this.queue = [];
    }
  
    add(promiseCreator) {
      this.queue.push(promiseCreator);
      this.schedule();
    }
  
    schedule() {
      while (this.running < this.concurrency && this.queue.length) {
        const promiseCreator = this.queue.shift();
        const promise = promiseCreator();
        promise.then(() => {
          this.running--;
          this.schedule();
        });
        this.running++;
      }
    }
  }
  
  const timeout = (time) => new Promise(resolve => {
    setTimeout(resolve, time)
  });
  
  const scheduler = new Scheduler(2);
  
  const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)));
  };
  
  addTask(1000, "1");
  addTask(500, "2");
  addTask(300, "3");
  addTask(400, "4");
  
  // output: 2, 3, 1, 4


// 在这个实现中，我们使用了一个 Scheduler 类来管理任务队列。Scheduler 类有一个 concurrency 属性，表示最大并发数。
// 它还有一个 running 属性，表示当前正在运行的任务数，以及一个 queue 属性，表示任务队列。

// Scheduler 类有一个 add 方法，用于向任务队列中添加任务。每当添加一个任务时，Scheduler 类会调用 schedule 方法来检查当前是否可以运行更多的任务。
// 如果当前正在运行的任务数小于最大并发数，并且任务队列不为空，则会从任务队列中取出一个任务并运行它。

// 每当一个任务完成时，Scheduler 类会将 running 属性减一，并再次调用 schedule 方法来检查是否可以运行更多的任务。

// 在 addTask 函数中，我们使用 scheduler.add 方法来添加任务。每个任务是一个返回 Promise 的函数，它会在一定时间后输出一个数字。

// 最后，我们按照题目要求输出了任务的执行顺序。