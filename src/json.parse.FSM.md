# 状态机实现 `JSON.parse`

## 思路分析

我们排除 `eval` 和 `递归` 选用 状态机 的方式来解这道题
题干可以变成解析一个 `JSON` 字符串

```js
expect(parser('a')).toEqual('a');
expect(parser(1)).toEqual('1');
expect(parser('{"a":3}')).toEqual({a: 3});
expect(parser('[{"a":{"b":{"c":[1]}}},null,"str"]')).toEqual([{a: {b: {c: [1]}}, 'null', 'str'])
```

有两个最明显的规律

- 每一个标识符都会被处理成 `string`，例如对 `{ "name": "jack" }`

```
{ ->   -> " -> n -> a -> m -> e -> " -> : ->   -> " -> j -> a -> c -> k -> " ->   -> }
```

- 最小标识符是 `基础类型` ，上一层是 `object` ，上一层是 `array`

所以我们要完成对基础类型的处理、判断对象或数组，下面用 `{ "name": "jack" }` 例子顺便也解释一下 状态机 的概念

```js
// 只针对 { "name": "jack" } 做第一次梳理
function parser(str) {
    let i = 0; // 首先要定义索引，我们会扫描str的每一个节点

    // 第一个状态，扫描到 '{'，意味着对象的开始，后面跟上的一定是 "
    if (str[i] === '{') {
    	i++; // 扫描完 '{' index向后指一格
        // 第二个状态，扫描到了空格，意味着后面可能是空格 * n 或者 "
        while (str[i] === ' ') {
            i++:
        }

        // 空格去除了，index指在了 '"' 开始解析对象
        // 第三个状态，对象的结束边界 '}'
        // 此时index的活动范围在 => "name": "jack" }
        const result = {};
        // 在这个循环中，能把对象解析出来
        while (str[i] === '}') {
            let key = '';
            let value = '';
            // 第四个状态，解析 key 的开始，触发条件为 当前节点 === '"'
            if (str[i] === '"') {
                i++;
                // 第五个状态，解析 key 的结束，触发条件是 当前节点 === '"'
                while (str[i] !== '"') {
                    key += str[i];
                    i++;
                }
                i++;
             }
             // 第6个状态，string结束之后可能出现空格
             while (str[i] === ' ') {
            	i++:
             }
             // 第7个状态，处理好空格一定会出现':'，跳过即可
             if (str[i] !== ':') {
                 throw new Error('冒号呢？');
                 i++
             }
             // 第8个状态，':'之后可能会出现空格
             while (str[i] === ' ') {
            	i++:
             }
             // 第9个状态，处理好空格会出现 '"'，表示 value 的开始
             // value 比较复杂，可能是任意类型，但在梳理逻辑的时候我们默认value是个字符串 jack，于是可以把解析 key 的代码拷过来
             if (str[i] === '"') {
                i++;
                // 第10个状态，解析 key 的结束，触发条件是 当前节点 === '"'
                while (str[i] !== '"') {
                    value += str[i];
                    i++;
                }
                i++;
             }
             // 第11个状态，解析完 value 可能会出现空格
             while (str[i] === ' ') {
                 i++:
             }
             // 到这一步，我们在 "name": "jack" } 中完成了，拿到key(name) value(jack)
             result[key] = value;
         }
    }
}
```

以上是对于一个对象的梳理，其中判断空格，解析字符串，判断冒号重复出现了多次，因此这些逻辑是可以提出来的
解析一个普通对象大约 11 个状态，状态机的概念是：输入一个值，输出一个状态：

```js
while (entry) {
  state = state(entry)
}
```

例如 👆

- 输入{ === 对象开始 输出对象开始结束 -> index++
- 对象开始结束 输入 " 输出 正在解析字符串 -> index++
- 正在解析字符串 输入 n 输出 正在解析字符串 -> index++
- 上面的梳理缺少了除 `string` 类型以外的解析，当然我们需要处理的类型并不多 `number` `object` `array` `true/false/null`，其中可以把 `object` 排除在外，因为 `object` 中包含了所有类型

全部代码补上 👇

```js
function fakeParseJSON(str) {
  let i = 0

  return parseValue()

  function parseValue() {
    skipWhiteSpece()
    const value =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword('true', true) ??
      parseKeyword('false', false) ??
      parseKeyword('null', null)
    skipWhiteSpece()
    return value
  }

  function skipWhiteSpece() {
    while (str[i] === ' ' || str[i] === '\n' || str[i] === '\r') {
      i++
    }
  }

  function parseString() {
    if (str[i] === '"') {
      i++
      let result = ''
      while (str[i] !== '"') {
        result += str[i]
        i++
      }
      i++
      return result
    }
  }

  function parseNumber() {
    let start = i
    if (str[i] === '-') {
      i++
    }
    if (str[i] === '0') {
      i++
    } else if (str[i] >= '1' && str[i] <= '9') {
      i++
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
    }

    if (str[i] === '.') {
      i++
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
    }
    if (str[i] === 'e' || str[i] === 'E') {
      i++
      if (str[i] === '-' || str[i] === '+') {
        i++
      }
      while (str[i] >= '0' && str[i] <= '9') {
        i++
      }
    }
    if (i > start) {
      return Number(str.slice(start, i))
    }
  }

  function parseObject() {
    if (str[i] === '{') {
      i++
      skipWhiteSpece()

      const result = {}

      let isInit = true
      while (str[i] !== '}') {
        if (!isInit) {
          eatComma()
          skipWhiteSpece()
        }
        const key = parseString()
        skipWhiteSpece()
        eatColon()
        const value = parseValue()
        result[key] = value
        isInit = false
      }

      i++
      return result
    }
  }

  function parseArray() {
    if (str[i] === '[') {
      i++
      skipWhiteSpece()

      const result = []
      let isInit = true
      while (str[i] !== ']') {
        if (!isInit) {
          eatComma()
        }
        const value = parseValue()
        result.push(value)
        isInit = false
      }
      i++
      return result
    }
  }

  function parseKeyword(name, value) {
    if (str.slice(i, i + name.length) === name) {
      i += name.length
      return value
    }
  }

  function eatComma() {
    if (str[i] !== ',') {
      throw new Error('Expected ",".')
    }
    i++

    checkNotEmpty()
  }

  function eatColon() {
    if (str[i] !== ':') {
      throw new Error('Expected ":".')
    }
    i++

    checkNotEmpty()
  }

  function checkNotEmpty() {
    if (str[i] === '}' || str[i] === ']') {
      throw new Error('Empty is not allowed')
    }
    i++
  }
}
```
这是一个比较经典的 状态机 题，类似我们可以利用 状态机 完成模拟 `indexOf` `正则` `ast` 和一些边界问题