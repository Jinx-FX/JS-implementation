// 假设本地机器无法做加减乘除运算，需要通过远程请求让服务端来实现。
// 以加法为例，现有远程API的模拟实现

const addRemote = async (a, b) => new Promise(resolve => {
  setTimeout(() => resolve(a + b), 1000)
})

// 请实现本地的add方法，调用addRemote，能最优的实现输入数字的加法。
async function add (...inputs) {
  // 你的实现
  return add5(...inputs)
}

// 最基本的实现
async function add1 (...args) {
  let res = 0
  if (args.length < 2) return res

  for (const item of args) {
    res = await addRemote(res, item)
  }
  return res
}

async function add2 (...args) {
  let res = 0
  if (args.length === 0) return res
  if (args.length === 1) return args[0]

  const a = args.pop()
  const b = args.pop()
  args.push(await addRemote(a, b))
  return add(...args)
}

// Promise链式调用版本
async function add3 (...args) {
  return args.reduce((promiseChain, item) => {
    return promiseChain.then(res => {
      return addRemote(res, item)
    })
  }, Promise.resolve(0))
}

// 更好一点的答案：
async function add4 (...args) {
  if (args.length <= 1) return Promise.resolve(args[0])
  const promiseList = []
  for (let i = 0; i * 2 < args.length - 1; i++) {
    const promise = addRemote(args[i * 2], args[i * 2 + 1])
    promiseList.push(promise)
  }

  if (args.length % 2) {
    const promise = Promise.resolve(args[args.length - 1])
    promiseList.push(promise)
  }

  return Promise.all(promiseList).then(results => add(...results))
}

// 加本地缓存
const cache = {}

async function addFn (a, b) {
  const key1 = `${a}-${b}`
  const key2 = `${b}-${a}`
  const cacheVal = cache[key1] || cache[key2]

  if (cacheVal) return Promise.resolve(cacheVal)

  return addRemote(a, b, res => {
    cache[key1] = res
    cache[key2] = res
    return res
  })
}

async function add5 (...args) {
  if (args.length <= 1) return Promise.resolve(args[0])
  const promiseList = []
  for (let i = 0; i * 2 < args.length - 1; i++) {
    const promise = addFn(args[i * 2], args[i * 2 + 1])
    promiseList.push(promise)
  }

  if (args.length % 2) {
    const promise = Promise.resolve(args[args.length - 1])
    promiseList.push(promise)
  }

  return Promise.all(promiseList).then(results => add(...results))
}

// 请用示例验证运行结果:
add(1, 2)
  .then(result => {
    console.log(result) // 3
  })


add(3, 5, 2)
  .then(result => {
    console.log(result) // 10
  })