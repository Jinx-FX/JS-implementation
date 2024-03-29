// 定义生成器函数，入参是任意集合
function iteratorGenerator (list) {
  // idx记录当前访问的索引
  let idx = 0
  // len记录传入集合的长度
  let len = list.length
  return {
    // 自定义next方法
    next: function () {
      // 如果索引还没有超出集合长度，done为false
      let done = idx >= len
      // 如果done为false，则可以继续取值
      let value = !done ? list[idx++] : undefined

      // 将当前值与遍历是否完毕（done）返回
      return {
        done: done,
        value: value
      }
    }
  }
}

let iterator = iteratorGenerator(['1号选手', '2号选手', '3号选手'])
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
