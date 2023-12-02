Array.prototype.mySome = function (fn) {
  let result = false;
  for (let i = 0; i < this.length; i++) {
    // 判断条件是否满足，满足跳出循环
    if (fn(this[i])) {
      result = true;
      break;
    }
  }
  return result;
};
console.log([1, 2, 3, 4].mySome(item => item > 6)); // false
