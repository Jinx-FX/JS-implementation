// 实现 `chainPromise` 函数
// 请在不使用 `async` / `await` 语法的前提下完成
// 完成promise的串行执行

// Math.random() 会造成重复 res.push 的情况
function getPromise (time) {
  return new Promise((resolve, reject) => {
    setTimeout(Math.random() > 0.5 ? resolve : reject, time, time)
  })
}

function chainPromise (arr) {
  let res = []
  return new Promise((resolve, reject) => {
    let init = getPromise(arr.shift()), i =0
    arr
      .reduce((pre, cur) => {
        return pre
          .then((result) => {
            res.push(result)
            return getPromise(cur)
          })
          .catch((err) => {
            res.push(err)
            return getPromise(cur)
          })
      }, init)
      // 确保最后一项被 push 到 res 中
      .then((result) => {
        res.push(result)
      })
      .catch((err) => {
        res.push(err)
      })
      .finally(() => {
        resolve(res)
      })
  })
}

let time = [2000, 4000, 3000, 1000]
let res = chainPromise(time)
//等待10s后输出结果
res.then(console.log)