> 本文由 [简悦 SimpRead](http://ksria.com/simpread/) 转码， 原文地址 [juejin.cn](https://juejin.cn/post/6844903697198088199#heading-4)

本文源自之前面试的时候频繁要求手写 url parse ，故针对此种情况专门写一文来简述如何解析 URL ，如果您有更好的解析方法或题型变种欢迎讨论

> 注意，本文仅讨论开头所列出的一种格式，尚未讨论 URL 的更多格式，更多符合规范的格式（如使用相对路径等的情况）详见：[tools.ietf.org/html/rfc398…](https://link.juejin.cn?target=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc3986%23section-3.3 "https://tools.ietf.org/html/rfc3986#section-3.3")

URL 是啥样的
--------

首先让我们看看一种完整的 URL 是长什么样的： `<scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag>`

如果这样太抽象了，那么我们举个例子具体化一下： `https://juanni:miao@www.foo.com:8080/file;foo=1;bar=2?test=3&miao=4#test`

<table><thead><tr><th>组件</th><th>描述</th><th>默认值</th><th></th></tr></thead><tbody><tr><td>scheme</td><td>访问服务器获取资源时使用的协议</td><td>无</td><td>https</td></tr><tr><td>user</td><td>访问资源时使用的用户名</td><td>无（匿名）</td><td>juanni</td></tr><tr><td>password</td><td>用户的密码，和用户名使用<code>:</code>分割</td><td>E-mail</td><td>miao</td></tr><tr><td>host</td><td>资源服务器主机名或 IP 地址</td><td>无</td><td><a target="_blank" href="https://link.juejin.cn?target=http%3A%2F%2Fwww.foo.com" title="http://www.foo.com" ref="nofollow noopener noreferrer">www.foo.com</a></td></tr><tr><td>port</td><td>资源服务器监听的端口，不同的 scheme 有不同的默认端口（HTTP 使用 80 作为默认端口）</td><td>和 scheme 有关</td><td>8080</td></tr><tr><td>path</td><td>服务器上的资源路径。路径与服务器和 scheme 有关</td><td>默认值</td><td>/file</td></tr><tr><td>params</td><td>在某些 scheme 下指定输入参数，是键值对。可以有多个，使用<code>;</code>分割，单个内的多个值使用<code>,</code> 分割</td><td>默认值</td><td>foo=1;bar=2</td></tr><tr><td>query</td><td>该组件没有通用的格式，HTTP 中打多使用<code>&amp;</code>来分隔多个 query。使用<code>?</code>分隔 query 和其他部分</td><td>无</td><td>test=3&amp;miao=4</td></tr><tr><td>frag/fragment</td><td>一小片或一部分资源名称。引用对象时，不会将 fragment 传送给服务器，客户端内部使用。通过<code>#</code>分隔 fragment 和其余部分</td><td>无</td><td>test</td></tr></tbody></table>

由于 `path parameter` 是 `path` 的一部分，因此我们将其归为 `path` 中

同时，如果要表示哪些部分是可选的，则可以表示为： `[scheme:]//[user[:password]@]host[:port][/path][?query][#fragment]`

如何获取每个组件
--------

我们先不考虑组件内部的数据，先获取每个组件

### 让浏览器帮我们解析 - URLUtils

先介绍一个偷懒的方式： [URLUtils](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FURLUtils "https://developer.mozilla.org/zh-CN/docs/Web/API/URLUtils") ，可以通过该接口获取 href 、 hostname 、 port 等属性。

在浏览器环境中，我们的 `a` 标签，也就是 [HTMLAnchorElement](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FHTMLAnchorElement "https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLAnchorElement") 实现了 `URLUtils` 中定义的属性，那么就可以用如下代码获得每个组件了

```js
/**
 * @param  {string} url
 * 利用 URLUtils 简单解析 URL
 * @returns {protocol, username, password, hostname, port, pathname, search, hash}
 */
function URLParser(url) {
    const a = document.createElement('a');
    a.href = url;
    return {
        protocol: a.protocol,
        username: a.username,
        password: a.password,
        hostname: a.hostname, // host 可能包括 port, hostname 不包括
        port: a.port,
        pathname: a.pathname,
        search: a.search,
        hash: a.hash,
    }
}
```

缺点：

*   依赖浏览器宿主环境接口

### 使用 `URL` 对象

上面使用 `a` 标签的方法在 Node 环境中就失效了，但是我们还有其他方法可以让底层 API 帮我们解析 —— [URL](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FURL%2FURL "https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL")

```js
/**
 * @param  {string} url
 * 利用 URLUtils 简单解析 URL
 * @returns {protocol, username, password, hostname, port, pathname, search, hash}
 */
function URLParser(url) {
    const urlObj = new URL(url);
    return {
        protocol: urlObj.protocol,
        username: urlObj.username,
        password: urlObj.password,
        hostname: urlObj.hostname,
        port: urlObj.port,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
    }
}
```

### 老老实实手撸一个

那要是面试官要老老实实的手撸，那也只能对着撸了：

```js
function parseUrl(url) {
    var pattern = RegExp("^(?:([^/?#]+))?//(?:([^:]*)(?::?(.*))@)?(?:([^/?#:]*):?([0-9]+)?)?([^?#]*)(\\?(?:[^#]*))?(#(?:.*))?");
    var matches =  url.match(pattern) || [];
    return {
        protocol: matches[1],
        username: matches[2],
        password: matches[3],
        hostname: matches[4],
        port:     matches[5],
        pathname: matches[6],
        search:   matches[7],
        hash:     matches[8]
    };
}
parseUrl("https://juanni:miao@www.foo.com:8080/file;foo=1;bar=2?test=3&miao=4#test")
// hash: "#test"
// hostname: "www.foo.com"
// password: "miao"
// pathname: "/file;foo=1;bar=2"
// port: "8080"
// protocol: "https:"
// search: "?test=3&miao=4"
// username: "juanni"
```

这个正则确实有点难懂，不过相信有一些基础的话加上下面两张图还是可以理解：

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/23/1669efcd43da3168~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

![](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/10/23/1669efcd1781d572~tplv-t2oaga2asx-zoom-in-crop-mark:4536:0:0:0.image)

解析 search(query) 部分
-------------------

### 偷懒使用 [URLSearchParams](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FURLSearchParams "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams")

```js
/**
 * @param  {string} search 类似于 location.search
 * @returns {object}
 */
function getUrlQueyr(search) {
    const searchObj = {};
    for (let [key, value] of new URLSearchParams(search)) {
        searchObj[key] = value;
    }
    return searchObj;
}
```

优点：

*   不需要手动使用 `decodeURIComponent`
*   会帮着把 query 上的 + 自动转换为空格（单独使用 `decodeURIComponent` 做不到这点）（至于什么情况把 空格 转换为 `+` ，什么情况把空格转换为 `%20`，可以[参考这里等](https://link.juejin.cn?target=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F2678551%2Fwhen-to-encode-space-to-plus-or-20 "https://stackoverflow.com/questions/2678551/when-to-encode-space-to-plus-or-20")）
*   不支持如 `array[]` / `obj{}` 等形式

### 再手撸一个（残缺版）

要求：

*   对于非法字符不予解析
*   对于形如 list[] 的解析成数组
*   对于形如 obj{} 的解析为对象（暂时只需要用 `JSON.parse` 进行解析）

```js
/**
 * @param  {string} query 形如 location.search
 * @returns {object}
 */
function parseQueryString(query) {
    if (!query) {
        return {};
    }
    query = query.replace(/^\?/, '');
    const queryArr = query.split('&');
    const result = {};
    queryArr.forEach(query => {
        let [key, value] = query.split('=');
        try {
            value = decodeURIComponent(value || '').replace(/\+/g, ' ');
            key = decodeURIComponent(key || '').replace(/\+/g, ' ');
        } catch (e) {
            // 非法
            console.log(e);
            return;
        }
        const type = getQuertType(key);
        switch(type) {
            case 'ARRAY':
                key = key.replace(/\[\]$/, '')
                if (!result[key]) {
                    result[key] = [value];
                } else {
                    result[key].push(value);
                }
                break;
            case 'JSON': 
                key = key.replace(/\{\}$/, '')
                value = JSON.parse(value);
                result.json = value;
                break;
            default:
                result[key] = value;
        }
        
    });
    return result;
    function getQuertType (key) {
        if (key.endsWith('[]')) return 'ARRAY';
        if (key.endsWith('{}')) return 'JSON';
        return 'DEFAULT';
    }
}

const testUrl = 
'?name=coder&age=20&callback=https%3A%2F%2Fmiaolegemi.com%3Fname%3Dtest&list[]=a&list[]=b&json{}=%7B%22str%22%3A%22abc%22,%22num%22%3A123%7D&illegal=C%9E5%H__a100373__b4'
parseQueryString(testUrl)
```

当然，这里还并不严谨，没有考虑到如下问题

1.  相同字段如何处理
2.  没有替换 `+` 为
3.  只有 `key`
4.  只有 `value`
5.  没有解析相对路径
6.  更深入的解析 `Object`

最后，这里推荐一个开源库：[url-parse](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Funshiftio%2Furl-parse "https://github.com/unshiftio/url-parse")，对各种情况处理的比较好，同时这也意味着实现上略复杂，理解即可，面试中更需结合充分理解面试官要求进行解答与扩展

参考
--

*   [【读】这一次, 让我们再深入一点 - URL 你是否真的了解?](https://juejin.cn/post/6844903544668028936 "https://juejin.cn/post/6844903544668028936")
*   [path-parameter-syntax](https://link.juejin.cn?target=https%3A%2F%2Fdoriantaylor.com%2Fpolicy%2Fhttp-url-path-parameter-syntax "https://doriantaylor.com/policy/http-url-path-parameter-syntax")
*   [URLUtils](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FURLUtils "https://developer.mozilla.org/zh-CN/docs/Web/API/URLUtils")
*   [URL](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FURL%2FURL "https://developer.mozilla.org/zh-CN/docs/Web/API/URL/URL")
*   [URLSearchParams](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FURLSearchParams "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams")