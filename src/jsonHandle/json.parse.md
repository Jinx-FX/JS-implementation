> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903568919527432#heading-1)

> `JSON.parse()` 方法用来解析 JSON 字符串，构造由字符串描述的 JavaScript 值或对象。提供可选的 reviver 函数用以在返回之前对所得到的对象执行变换 (操作)。

前言
==

近日在翻红宝书，看到 JSON 那一章节，忽然想到：“**如何用 JS 实现 JSON.parse？**” 带着这个疑问，我找到了 [JSON 之父 Douglas Crockford 写的 ployfill](https://github.com/douglascrockford/JSON-js)，里面提供了三种实现方式，下面我们逐一来分析。

Eval
====

第一种方式最简单，也最直观，就是直接调用 eval，代码如下：

```js
var json = '{"a":"1", "b":2}';
var obj = eval("(" + json + ")");  // obj 就是 json 反序列化之后得到的对象
```

因为 JSON 脱胎于 JS，同时也是 JS 的子集，所以能够直接交给 eval 运行。  
然而，通常我们都说 eval 是邪恶的，尽量不要使用。为什么这里又用了呢？**其实 eval 并不邪恶，只是对于新手来说，用了容易出问题，所以不建议使用而已**。如果你水平够高，能正确地使用 Eval，那么它还是有很多用处的，比如 [静态模板](https://www.zhihu.com/question/28466557/answer/241364553)。

ok，回到上面，我们像新手一样直接调用 eval，会不会出问题呢？ → **会，这里有 XSS 漏洞**。触发条件：参数 json 并非真正的 JSON 数据，而是可执行的 JS 代码。  
那么，该如何规避这个问题呢？→ 老手 Douglas Crockford 给我们做了示范：**对参数 json 做校验，只有真正符合 JSON 格式，才能调用 eval**，具体就是下面这几个正则匹配。

```js
// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with "@" (a non-JSON character). Second, we
// replace all simple value tokens with "]" characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or "]" or
// "," or ":" or "{" or "}". If that is so, then the text is safe for eval.

var rx_one = /^[\],:{}\s]*$/;
var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

if (
    rx_one.test(
        json
            .replace(rx_two, "@")
            .replace(rx_three, "]")
            .replace(rx_four, "")
    )
) {
    var obj = eval("(" +json + ")");
}
```

看到上面的代码，你是否对那么**复杂的正则感到头晕**呢？反正我是很晕，所以我找了一个非常好用的[正则可视化工具 Regexper](https://regexper.com) 来帮我看懂这些正则，如下图所示。  
![](https://user-images.githubusercontent.com/8401872/36766172-b5133f5a-1c6f-11e8-875a-269df968f7c5.png)  
![](https://user-images.githubusercontent.com/8401872/36766106-5bb16e8c-1c6f-11e8-828b-82ea9383b2dc.png)  
![](https://user-images.githubusercontent.com/8401872/36766234-f38f94b8-1c6f-11e8-95be-cfd4b5521b06.png)

有 2 个地方需要注意：

1.  英文注释中提到：
    
    > Third, we delete all open brackets that follow a colon or comma or that begin the text.
    
    表面上看起来要删除 open brackets 开括号`(`，而实际上正则 rx_four 匹配删除的却是`[`，这是为什么呢？因为**中英文语义的不同**。在中文里，开括号一般指`(`，而在英文里开括号一般指`[`，其间细微差别需要知道。
    
2.  看 rx_three，里面有`(?:)`结构，这是正则的不捕获分组，具体可以参考[这里](https://www.zhihu.com/question/19853431)。使用不捕获分组的原因：要解析的 json 有可能是一个很大的 JSON，如果匹配到的每个 token 都缓存起来的话，那么对内存的消耗是巨大的，而这里我们只想替换字符，并不需要知道都匹配到了哪些字符。
    

拓展阅读：

1.  [JavaScript 为什么不推荐使用 eval？](https://www.zhihu.com/question/20591877)
2.  [JSON: 不要误会, 我真的不是 JavaScript 的子集](https://zhuanlan.zhihu.com/p/29958439)，翻译 By 浪子，原作者 By Magnus Holm

递归
==

第一种 eval 的方法，相当于一股脑儿把 JSON 字符串塞进去。其实我们还可以**手动逐个字符地扫描**，然后进行判断，这就是第二种方法：递归。

```js
// 调用核心的 next 函数，逐个读取字符
var next = function (c) {

// If a c parameter is provided, verify that it matches the current character.

    if (c && c !== ch) {
        error("Expected '" + c + "' instead of '" + ch + "'");
    }

// Get the next character. When there are no more characters,
// return the empty string.

    ch = text.charAt(at);
    at += 1;
    return ch;
};
```

所谓 “递归”，就是重复调用 value 函数。

```js
value = function () {

// Parse a JSON value. It could be an object, an array, a string, a number,
// or a word.

    white();
    // 根据当前字符是什么，我们便能推导出后面应该接的是什么类型
    switch (ch) {
        case "{":
            return object();
        case "[":
            return array();
        case "\"":
            return string();
        case "-":
            return number();
        default:
            return (ch >= "0" && ch <= "9")
                ? number()
                : word();
    }
};
```

还是以 `'{"a":"1", "b":2}'` 为例，程序大致逻辑是：启动 → 首次调用 `value()` → 发现是 `{` → 原来是对象，走 `object()` → 通过 `string()` 得到 key 值为 "a" → 读取到冒号，哦，后面可能是对象、数组、布尔值等等，具体是什么，还得再次调用 `value()` 才知道 → ……

这种实现方案，既没有用 eval，也没有用正则，单纯靠逐个读取字符，所以代码逻辑比较复杂，需要多 debug 才能理清逻辑。lqt0223 也曾分析过这种实现方式：[自己实现 JSON、XML 的解析 没那么难](https://juejin.cn/post/6844903543342628871)。

状态机
===

状态机名字起得很抽象，应用也非常广泛，比如正则引擎、词法分析，甚至是字符串匹配的 KMP 算法都能用它来解释。它代表着一种本质的逻辑：**在 A 状态下，如果输入 B，就会转移到 C 状态**。

那么，**状态机与 JSON 字符串的解析有什么关系呢**？→ JSON 字符串是有格式规范的，比如 key 和 value 之间用冒号隔开，比如不同 key-value 对之间用逗号隔开…… **这些格式规范可以翻译成状态机的状态转移**，比如 “如果检测到冒号，那么意味着下一步可以输入 value” 等等。还是以`'{"a":"1", "b":2}'`为例，我们来看看对这个 JSON 字符串进行解析时，状态机都流经了哪些状态。  
![](https://user-images.githubusercontent.com/8401872/36772416-298b0190-1c90-11e8-835e-d02f91182e16.png)

另外，这第三种实现方式，代码看起来非常的规整，是因为其广泛地应用了访问者模式，比如：

```js
var string = {   // The actions for string tokens
    go: function () {
        state = "ok";
    },
    firstokey: function () {
        key = value;
        state = "colon";
    },
    okey: function () {
        key = value;
        state = "colon";
    },
    ovalue: function () {
        state = "ocomma";
    },
    firstavalue: function () {
        state = "acomma";
    },
    avalue: function () {
        state = "acomma";
    }
};
```

[代码实现见此](https://github.com/Jinx-FX/JS-implementation/blob/main/src/json.parse.FSM.md)

后话
==

看似简单的 JSON.parse，要实现起来也是大有可究之处。如果想顺便看 `JSON.stringify` 的实现方法，可以看 [Douglas Crockford 版](https://github.com/douglascrockford/JSON-js/blob/master/json2.js#L373)，也可以看 [MDN 版](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)，两者大同小异。

另外，鉴于 Douglas Crockford 写的这个 JSON 库有些特殊情况没处理好，后来又出了一个新的库，名为 [JSON3](https://github.com/bestiejs/json3)，它们之间的区别详见[相关的讨论](https://stackoverflow.com/questions/10963723/json-polyfill-json-2-or-json-3)。