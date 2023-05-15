# 手写 JSON.stringify

> [JSON.stringify](https://github.com/Jinx-FX/JS-implementation/blob/main/src/json.stringify.js) 的简易实现，并没有实现 `JSON.stringify()` 中的 `replacer` 参数和 `space` 参数

**实现的思路**

在接下来的代码实现中，首先会分为基本数据类型和引用数据类型两种情况：

- 基本数据类型：按照上面的规则返回序列化结果。重点处理 `undefined` `类型、symbol` 类型以及 `number` 类型中的 `NaN`、`±Infinity`。
- 引用数据类型（按照是否可以继续遍历再分为两种）：
  - 可继续遍历的类型：包括对象字面量、数组、类数组对象、Set、Map。需要丢失的属性，在遍历时跳过即可。
  - 不可继续遍历的类型：包括基本类型的包装对象、Error 对象、正则对象、日期对象函数。用一个函数集中进行处理
- 此外，在遍历数组或对象的时候，还需要检测是否存在循环引用的情况，若存在需要抛出相应的错误

**数据类型判断**

用 `getType` 获取具体的数据类型。因为对于基本类型 `Symbol` 和它的包装类型的处理方式不同，所以用 "Symbol_basic" 表示基本类型 `Symbol`，用 "Symbol" 表示它的包装类型。

```js
function getType(o) {
  return typeof o === "symbol"
    ? "Symbol_basic"
    : Object.prototype.toString.call(o).slice(8, -1);
}
```

用 `isObject` 判断是引用类型还是基本类型：
```js
function isObject(o){
    return o !== null && (typeof o === 'object' || typeof o === 'function')
}
```

**处理不可继续遍历的类型**

用 `processOtherTypes` 处理所有不可继续遍历的引用类型：

```js
function processOtherTypes(target,type){
    switch(type){
        case 'String':
            return `"${target.valueOf()}"`
        case 'Number':
        case 'Boolean':    
            return target.valueOf().toString()
        case 'Symbol':    
        case 'Error':
        case 'RegExp':    
            return "{}"
        case 'Date':
            return `"${target.toJSON()}"`
        case 'Function':
            return undefined
        default:
            return “”
    }
}
```

尤其需要注意 `String` 包装类型，不能直接返回它的 `valueOf()`，还要在前后加上引号。比如说 {a:"bbb"} ，我们期望的序列化结果应该是 '{a:"bbb"}'，而不是 '{a:bbb}'；同理，对于 Date 对象，直接返回它的 toJSON() 会得到 '{date: 1995-12-16T19:24:00.000Z}'，但我们想得到的是 '{date: "1995-12-16T19:24:00.000Z"}'，所以也要在前后加上引号。

**检测循环引用**

循环引用指的是对象的结构是回环状的，不是树状的：

```js
// 下面的对象/数组存在循环引用
let obj = {};
obj.a = obj;

let obj1 = { a: { b: {} } };
obj1.a.b.c = obj1.a;

let arr = [1, 2];
arr[2] = arr;

// 注意这个对象不存在循环引用，只有平级引用
let obj2 = {a:{}};
obj2.b = obj2.a;
```

如何检测循环引用呢？

- 考虑最简单的情况，只有 `key` 对应的 `value` 为对象或者数组时，才可能存在循环引用，因此在遍历 `key` 的时候，判断 `value` 为对象或者数组之后才往下处理循环引用。
- 每一个 `key` 会有自己的一个数组用来存放父级链，并且在递归的时候始终传递该数组。如果检测到当前 `key` 对应的 `value` 在数组中出现过，则证明引用了某个父级对象，就可以抛出错误；如果没出现过，则加入数组中，更新父级链


所以一个通用的循环引用检测函数如下：

```js
function checkCircular(target,parentArray = [target]){
    Object.keys(target).forEach(key => {
        if(typeof target[key] == 'object'){
            if(parentArray.inlcudes(target[key])
              || checkCircular(target[key],[target[key],...parentArray])
              ){
                throw new Error('存在循环引用')
            }
        }
    })
    console.log('不存在循环引用')
}
```

在 `JSON.stringify` 的实现中，遍历 `key` 的过程已经在主代码完成了，所以这里的 `checkCircular` 只需要包含检测过程。稍加改造如下：

```js
function checkCircular(target, currentParent){
    let type = getType(target)
    if(type == 'Object' || type == 'Array'){
        throw new TypeError('Converting circular structure to JSON')
    }
    currentParent.push(target)
}
```

**核心代码**

最终实现的核心代码如下：
```js
function jsonStringify(target,initParent = [target]){
    let type = getType(target)
    let iterableList = ['Object','Array','Arguments','Set','Map']
    let specialList = ['Undefined','Symbol_basic','Function']
    // 如果是基本数据类型
    if(!isObject(target)){
       if(type === 'Symbol_basic' || type === 'Undefined'){
            return undefined
       } else if(Number.isNaN(target) || target === Infinity || target === -Infinity) {
            return "null"
       } else if(type === 'String'){
            return `"${target}"`
       } 
       return  String(target)
    } 
    // 如果是引用数据类型
    else {
        let res 
        // 如果是不可以遍历的类型
        if(!iterableList.includes(type)){
            res = processOtherTypes(target,type)
        } 
        // 如果是可以遍历的类型
        else {
            // 如果是数组
            if(type === 'Array'){
            	res = target.map(item => {
                    if(specialList.includes(getType(item))){
                        return "null"
                    } else {
                        // 检测循环引用
                        let currentParent = [...initParent]
                        checkCircular(item,currentParent)
                        return jsonStringify(item,currentParent)
                    }
                })
                res = `[${res}]`.replace(/'/g,'"')
            }        
            // 如果是对象字面量、类数组对象、Set、Map
            else {
                res = []
                Object.keys(target).forEach(key => {
                    // Symbol 类型的 key 直接略过
                    if(getType(key) !== 'Symbol_basic'){
                        let keyType = getType(target[key])                        
                        if(!specialList.includes(keyType)){
                            // 检测循环引用
                            let currentParent = [...initParent]
                            checkCircular(target[key],currentParent)
                            // 往数组中 push 键值对
                            res.push(
                                `"${key}":${jsonStringify(target[key],currentParent)}`
                            )
                        }
                    }
                })
                res = `{${res}}`.replace(/'/g,'"')
            }            
        }
        return res
    }
}
```

基本上按照上面表格中的规则来处理就行了，有几个细节可以注意一下：

- `iterableList` 用于存放可以继续遍历的数据类型；`specialList` 用于存放比较特殊的 `Undefined`、`Symbol_basic`、`Function` 三种类型，特殊在于：对象 key 的 value 如果是这些类型，则序列化的时候会丢失，数组的元素如果是这些类型，则序列化的时候会统一转化为 `"null"`。因为这三种类型要多次用到，所以先存起来。

- 为什么要将最终返回的 `res` 初始化为一个空数组？因为：

  - 如果我们处理的 `target` 是数组，则只需要调用 `map` 就可以将数组的每一个元素映射为序列化之后的结果，调用后返回的数组赋给 `res`，再和 `[`、`]` 字符拼接，会隐式调用数组的 `toString` 方法，产生一个标准的序列化结果；
  - 如果处理的 `target` 是对象字面量，则可以将它的每个 key-value 的序列化结果 push 到 `res` 中，最终再和 `{`、`}` 字符拼接，也同样会产生一个标准的序列化结果。
  - 在整个过程中不需要去处理 JSON 字符串中的逗号分隔符。

- 对于对象字面量，类型为 `"Symbol_basic"` 的属性会丢失，属性值为 `Undefined`、`Symbol_basic`、`Function` 三种类型的属性也会丢失。属性丢失其实就是在遍历对象的时候略过这些属性

- 在检测循环引用的时候，存在嵌套关系的对象应该共享同一条父级链，所以递归的时候需要把存放父级链的数组传进去；同时，不存在嵌套关系的两个对象不应该共享同一条父级链（否则会将所有互相引用的情况都误认为是循环引用），所以每次遍历对象 key 的时候，都会重新生成一个 `currentArray`。

- 最后，为保险起见，记得将序列化结果中可能出现的所有单引号替换为双引号