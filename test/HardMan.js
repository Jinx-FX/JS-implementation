/**
 * 函数式实现
 * @param {*} name 
 * @returns 
 */
function HardMan (name) {
  const tasks = []
  const next = () => {
    let task = tasks.shift()
    task && task().then(() => next())
  }

  // 很关键的一步， setTimeout为异步任务，这样可以使得所有的任务入队以后，
  // 才开始执行第一个next函数，主要是考虑了restFirst的情况
  setTimeout(() => next())

  tasks.push(() =>
    new Promise(resolve => {
      console.log(`I am ${name}`)
      resolve()
    }))

  return {
    rest (sec) {
      tasks.push(() =>
        new Promise(resolve => {
          setTimeout(() => {
            console.log(`Start learning after ${sec} seconds`)
            resolve()
          }, sec * 1000)
        })
      )
      return this
    },
    restFirst (sec) {
      tasks.unshift(() =>
        new Promise(resolve => {
          setTimeout(() => {
            console.log(`Start learning after ${sec} seconds`)
            resolve()
          }, sec * 1000)
        })
      )
      return this
    },
    learn (params) {
      tasks.push(() =>
        new Promise(resolve => {
          console.log(`Learning ${params}`)
          resolve()
        })
      )
      return this
    }
  }
}

HardMan("jack").restFirst(3).learn("Chinese").learn("Englsih").rest(2).learn("Japanese")

// //等待3秒..
// Start learning after 3 seconds
// I am jack
// Learning Chinese
// Learning Englsih
// //等待2秒..
// Start learning after 2 seconds
// Learning Japanese