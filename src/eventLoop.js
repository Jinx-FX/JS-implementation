// 事件轮询机制 Event Loop

// 宏任务 微任务
// 1）宏任务（Macrotasks）
// script全部代码（注意同步代码也属于宏任务）、setTimeout、setInterval、setImmediate等
// 2）微任务（Microtasks）
// Promise、MutationObserver

// 事件轮询机制执行过程
// 1）代码执行过程中，宏任务和微任务放在不同的任务队列中
// 2）当某个宏任务执行完后,会查看微任务队列是否有任务。如果有，执行微任务队列中的所有微任务(注意这里是执行所有的微任务)
// 3）微任务执行完成后，会读取宏任务队列中排在最前的第一个宏任务（注意宏任务是一个个取），执行该宏任务，如果执行过程中，遇到微任务，依次加入微任务队列
// 4）宏任务执行完成后，再次读取微任务队列里的任务，依次类推。

console.log(1)

setTimeout(() => {
  console.log(205)
  Promise.resolve().then(() => {
    console.log(305)
  })
}, 5000)


setTimeout(() => {
  console.log(2)
  Promise.resolve().then(() => {
    console.log(3)
  })
}, 1000)


Promise.resolve().then(() => {
  console.log(4)
}).then(() => {
  console.log(5)
}).then(() => {
  console.log(21)
}).catch(() => {
  console.log(9)
})
async function func () {
  console.log(10) // 同步代码
  await funcRe() // await 隐式返回promise
  console.log("10end") // 这里的执行时机：在执行微任务时执行
}

async function funcRe () {
  console.log("Re")
}

function promise () {
  return new Promise((resolve, reject) => {
    console.log(6) // 同步代码
    resolve()
  }).then(() => {
    console.log(7)
  }).then(() => {
    console.log(20)
  })
    .then(() => {
      throw new Error('123')
    })
}
promise().then(() => {
  console.log(12)
}).catch(() => {
  console.log(13)
})
func()
console.log(11)

// 宏任务：1 6 10 Re 11
// 微任务：4 7 10end 5 20 21 13
// 宏任务，微任务：2 3 205 305