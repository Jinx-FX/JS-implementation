function once (fn) {
  return function (...args) {
    if (fn) {
      const ret = fn.apply(this, args)
      fn = null
      return ret
    }
  }
}

// 一次版本升级中，一部分API将发生变化，旧的用法会被新的用法所取代。
// 但是，由于很多业务中使用了老版本的工具库，不可能一次升级完，
// 因此我们需要做一个平缓过渡：在当前这个版本中，先不取消这些旧的API，
// 而是给它们增加一个提示信息，告诉调用它们的用户，这些API将会在下一次升级中被废弃。
function deprecate (fn, oldApi, newApi) {
  const message = `The ${oldApi} is deprecated.
Please use the ${newApi} instead.`
  const notice = once(console.warn)

  return function (...args) {
    notice(message)
    return fn.apply(this, args)
  }
}

// 通用函数拦截器：
function intercept (fn, { beforeCall = null, afterCall = null }) {
  return function (...args) {
    if (!beforeCall || beforeCall.call(this, args) !== false) {
      // 如果beforeCall返回false，不执行后续函数
      const ret = fn.apply(this, args)
      if (afterCall) return afterCall.call(this, ret)
      return ret
    }
  }
}

// 1. 可以随时监控一个函数的执行过程，不修改代码的情况下获取函数的执行信息：
function sum (...list) {
  return list.reduce((a, b) => a + b)
}

sum = intercept(sum, {
  beforeCall (args) {
    console.log(`The argument is ${args}`)
    console.time('sum') // 监控性能
  },
  afterCall (ret) {
    console.log(`The resulte is ${ret}`)
    console.timeEnd('sum')
  }
})

sum(1, 2, 3, 4, 5)

// 2. 可以调整参数顺序：
const mySetTimeout = intercept(setTimeout, {
  beforeCall (args) {
    [args[0], args[1]] = [args[1], args[0]]
  }
})

mySetTimeout(1000, () => {
  console.log('done')
})

// 3. 可以校验函数的参数类型：
const foo = intercept(`foo`, {
  beforeCall (args) {
    assert(typeof args[1] === 'string')
  }
});

