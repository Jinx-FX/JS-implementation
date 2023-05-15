function once (fn) {
  return function (...args) {
    if (fn) {
      const ret = fn.apply(this, args)
      fn = null
      return ret
    }
  }
}


// 对once方法做一些扩展。
// 比如：我们定义了一个对象的初始化方法，这个方法只允许执行一次，
// 如果用户不小心多次执行，我们想让函数抛出异常。我们修改once方法如下代码所示：

function oncePlus (fn, replacer = null) {
  return function (...args) {
    if (fn) {
      const ret = fn.apply(this, args)
      fn = null
      return ret
    }
    if (replacer) {
      return replacer.apply(this, args)
    }
  }
}

const obj = {
  init: oncePlus(() => {
    console.log('Initializer has been called.')
  }, () => {
    throw new Error('This method should be called only once.')
  }),
}

obj.init()
obj.init()
