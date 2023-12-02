let executeCount = 0;
const targetFn = async (nums) => {
  executeCount++;
  console.log("---", nums);
  return nums.map((num) => 2 * num + 1);
};

const batcher = (fn) => {
  let queue = [];
  let isProcessing = false;
  let timeoutId = null;

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
    timeoutId = null;
  };

  return (nums) => {
    return new Promise((resolve) => {
      queue.push({ nums, resolve });

      if (!isProcessing && timeoutId === null) {
        // process.nextTick(processQueue)
        timeoutId = setTimeout(processQueue);
      }
    });
  };
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
