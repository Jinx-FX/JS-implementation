# 异步批量处理

```js
let executeCount = 0;
const targetFn = async (nums) => {
  executeCount++;
  console.log('---', nums)
  return nums.map((num) => 2 * num + 1);
};
 
const batcher = (fn) => {
  // todo batch logic
  return (args) => {}
};
 
const batchedFn = batcher(targetFn);
 
const main = async () => {
  const [result1, result2, result3] = await Promise.all([
    batchedFn([1, 2, 3]),
    batchedFn([4, 5]),
    batchedFn([6, 7]),
  ]);
 
  console.log(result1, result2, result3);
  console.log(executeCount); // 预期为 1
};
 
main();
```

> todo: 实现异步批量处理，无论 batchedFn 函数被调用多少次，targetFn 函数只会在某个延迟中被调用一次

## Solution

> see batcher.js

你可以使用一个队列来存储所有的请求，然后在一个特定的延迟后（例如，下一个事件循环迭代），批量处理所有的请求。以下是一个可能的实现：

```js
const batcher = (fn) => {
  let queue = [];
  let isProcessing = false;

  const processQueue = async () => {
    isProcessing = true;
    const currentQueue = queue;
    queue = [];

    const args = currentQueue.reduce((acc, { nums }) => [...acc, ...nums], []);
    const argsLen = currentQueue.reduce(
      (acc, { nums }) => [...acc, [...nums].length],
      []
    );
    const results = await fn(args);

    let resultIndex = 0;
    let argsIndex = 0;
    for (const { resolve } of currentQueue) {
      const result = [];
      for (let i = 0; i < argsLen[argsIndex]; i++) {
        result.push(results[resultIndex++]);
      }
      argsIndex++;
      resolve(result);
    }

    isProcessing = false;
  };

  return (nums) => {
    return new Promise((resolve) => {
      queue.push({ nums, resolve });

      if (!isProcessing) {
        process.nextTick(processQueue);
        // 或
        // setTimeout(processQueue);
      }
    });
  };
};
```

在这个实现中，`batcher` 函数返回一个新的函数，这个新的函数接收一个参数 `nums`，并返回一个 `Promise`。当这个新的函数被调用时，它会将请求添加到队列中，然后在下一个事件循环迭代中处理队列。

处理队列时，首先将队列中的所有请求的参数合并到一个数组中，然后调用原始的 `fn` 函数处理这个数组。处理完成后，将结果分配给每个请求，并解析每个请求的 `Promise`。

这样，无论 `batchedFn` 函数被调用多少次，`targetFn` 函数只会在下一个事件循环迭代中被调用一次，从而实现了批处理的效果。

> **Note**: `executeCount` 在一次事件循环之后打印为 1，但其数值最后仍为 3，因为这样的队列之后的函数仍会执行
> 
> `setTimeout(processQueue)` 会在每次添加新的调用时都创建一个新的定时器，这可能会导致 processQueue 在同一时间被多次调用。
> 
> 为了解决这个问题，你可以在调用 `setTimeout` 时检查是否已经有一个定时器正在等待。如果有，就不再创建新的定时器。你可以通过在 `batcher` 函数中添加一个 `timeoutId` 变量来实现这个功能：
> 
> ```js
> const batcher = (fn) => {
>   let queue = [];
>   let isProcessing = false;
>   let timeoutId = null;
> 
>   const processQueue = async () => {
>     isProcessing = true;
>     const currentQueue = queue;
>     queue = [];
> 
>     const args = currentQueue.reduce((acc, { nums }) => [...acc, ...nums], []);
>     const argsLen = currentQueue.reduce(
>         (acc, { nums }) => [...acc, [...nums].length],
>         []
>     );
>     const results = await fn(args);
> 
>     let resultIndex = 0;
>     let argsIndex = 0;
>     for (const { resolve } of currentQueue) {
>         const result = [];
>         for (let i = 0; i < argsLen[argsIndex]; i++) {
>         result.push(results[resultIndex++]);
>         }
>         argsIndex++;
>         resolve(result);
>     }
> 
>     isProcessing = false;
>     timeoutId = null;
>   };
> 
>   return (nums) => {
>     return new Promise((resolve) => {
>       queue.push({ nums, resolve });
> 
>       if (!isProcessing && timeoutId === null) {
>         timeoutId = setTimeout(processQueue);
>       }
>     });
>   };
> };
> ```
> 这样，`processQueue` 只会在没有正在等待的定时器时被调度，这应该能够确保 `executeCount` 只增加一次。
> 

### backup

你的 `batcher` 函数已经正确地实现了批处理的逻辑。它将所有的请求存储在一个队列中，然后在下一个事件循环迭代中批量处理这些请求。处理完毕后，它将结果分配给每个请求，并解析每个请求的 Promise。

这样，无论 `batchedFn` 函数被调用多少次，`targetFn` 函数只会在下一个事件循环迭代中被调用一次，从而实现了批处理的效果。

你的 `main` 函数中的 `console.log(executeCount)`; 语句应该输出 1，因为 `targetFn` 函数只被执行了一次。

如果你的代码没有达到预期效果，可能是因为你的环境不支持 `process.nextTick` 函数。在这种情况下，你可以使用 `setTimeout` 函数代替 `process.nextTick` 函数，如下所示：

```js
if (!isProcessing) {
  setTimeout(processQueue, 0);
}
```

这样，processQueue 函数将在下一个事件循环迭代中被调用，而不是在当前的事件循环迭代中。

### process.nextick() vs setTimeout

`process.nextTick` 和 `setTimeout` 都可以用来将函数的执行推迟到下一个事件循环迭代，但它们的工作方式有所不同。

`process.nextTick` 是 Node.js 的一个特性，它会在当前事件循环迭代的所有同步操作完成后，但在开始下一个事件循环迭代之前执行。这意味着如果你在一个 `process.nextTick` 回调中再次调用 `process.nextTick`，那么新的回调将在开始下一个事件循环迭代之前执行，这可能会导致事件循环迭代被无限延长。

`setTimeout` 则会将函数的执行推迟到下一个事件循环迭代，即使你设置的延迟时间为 0。这意味着如果你在一个 `setTimeout` 回调中再次调用 `setTimeout`，那么新的回调将在下一个事件循环迭代中执行，而不会延长当前的事件循环迭代。

因此，如果你的环境不支持 `process.nextTick`（例如，你正在浏览器中运行代码，而不是在 Node.js 中），你可以使用 `setTimeout` 代替 `process.nextTick`。虽然这可能会导致稍微的性能下降（因为 `setTimeout` 的最小延迟时间通常为 4 毫秒，而 `process.nextTick` 几乎没有延迟），但这通常可以忽略不计。