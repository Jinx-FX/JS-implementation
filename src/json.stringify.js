function getType (o) {
  return typeof o === "symbol"
    ? "Symbol_basic"
    : Object.prototype.toString.call(o).slice(8, -1)
}
function isObject (o) {
  return o !== null && (typeof o === "object" || typeof o === "function")
}
function processOtherTypes (target, type) {
  switch (type) {
    case "String":
      return `"${target.valueOf()}"`
    case "Number":
    case "Boolean":
      return target.valueOf().toString()
    case "Symbol":
    case "Error":
    case "RegExp":
      return "{}"
    case "Date":
      return `"${target.toJSON()}"`
    case "Function":
      return undefined
    default:
      return null
  }
}
function checkCircular (obj, currentParent) {
  let type = getType(obj)
  if (type == "Object" || type == "Array") {
    if (currentParent.includes(obj)) {
      throw new TypeError("Converting circular structure to JSON")
    }
    currentParent.push(obj)
  }
}

// JSON.stringify() 方法将一个 JavaScript 对象或值转换为 JSON 字符串，
// 如果指定了一个 replacer 函数，
// 则可以选择性地替换值，或者指定的 replacer 是数组，
// 则可选择性地仅包含数组指定的属性。

function jsonStringify (target, initParent = [target]) {
  let type = getType(target)
  let iterableList = ["Object", "Array", "Arguments", "Set", "Map"]
  let specialList = ["Undefined", "Symbol_basic", "Function"]
  // 如果是基本数据类型
  if (!isObject(target)) {
    if (type === "Symbol_basic" || type === "Undefined") {
      return undefined
    } else if (Number.isNaN(target) || target === Infinity || target === -Infinity) {
      return "null"
    } else if (type === "String") {
      return `"${target}"`
    }
    return String(target)
  }
  // 如果是引用数据类型
  else {
    let res
    // 如果是不可以遍历的类型
    if (!iterableList.includes(type)) {
      res = processOtherTypes(target, type)
    }
    // 如果是可以遍历的类型
    else {
      // 如果是数组 
      if (type === "Array") {
        res = target.map((item) => {
          if (specialList.includes(getType(item))) {
            return "null"
          } else {
            // 检测循环引用
            let currentParent = [...initParent]
            checkCircular(item, currentParent)
            return jsonStringify(item, currentParent)
          }
        })
        res = `[${res}]`.replace(/'/g, '"')
      }
      // 如果是对象字面量、类数组对象、Set、Map
      else {
        res = []
        Object.keys(target).forEach((key) => {
          // Symbol 类型的 key 直接略过
          if (getType(key) !== "Symbol_basic") {
            let type = getType(target[key])
            if (!specialList.includes(type)) {
              // 检测循环引用
              let currentParent = [...initParent]
              checkCircular(target[key], currentParent)
              // 往数组中 push 键值对
              res.push(`"${key}":${jsonStringify(target[key], currentParent)}`)
            }
          }
        })
        res = `{${res}}`.replace(/'/g, '"')
      }
    }
    return res
  }
}

// 检测对象
let obj = {
  tag: Symbol("student"),
  money: undefined,
  girlfriend: null,
  fn: function () { },
  info1: [1, 'str', NaN, Infinity, -Infinity, undefined, null, () => { }, Symbol()],
  info2: [new Set(), new Map(), new Error(), /a+b/],
  info2: {
    name: 'Chor',
    age: 20,
    male: true
  },
  info3: {
    date: new Date(),
    tag: Symbol(),
    fn: function () { },
    un: undefined
  },
  info4: {
    str: new String('abc'),
    no: new Number(123),
    bool: new Boolean(false),
    tag: Object(Symbol())
  }
}

console.log(jsonStringify(obj))
console.log("------------------------------------------------------------------------------")
console.log(JSON.stringify(obj))
console.log(jsonStringify(obj) === JSON.stringify(obj))

