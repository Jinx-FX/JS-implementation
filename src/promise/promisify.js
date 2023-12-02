// promisify 作用：把回调函数转成 promise 形式的函数

function promisify (fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function (err, ...arg) {
        if (err) {
          reject(err)
          return
        }
        resolve(...arg)
      })
      fn.apply(null, args)
    })
  }
}

let add = (a, b, callback) => {
  let num = a + b
  if (typeof num === "number") {
    callback(null, num)
  }
}

const addpromisify = promisify(add)
addpromisify(2, 4).then((res) => {
  console.log(res, "****")
});

