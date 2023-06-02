/**
 * 获取每个组件
 * @param {*} url 
 * @returns 
 */
function parseUrl (url) {
  var pattern = RegExp("^(?:([^/?#]+))?//(?:([^:]*)(?::?(.*))@)?(?:([^/?#:]*):?([0-9]+)?)?([^?#]*)(\\?(?:[^#]*))?(#(?:.*))?")
  var matches = url.match(pattern) || []
  return {
    protocol: matches[1],
    username: matches[2],
    password: matches[3],
    hostname: matches[4],
    port: matches[5],
    pathname: matches[6],
    search: matches[7],
    hash: matches[8]
  }
}
console.log(parseUrl("https://juanni:miao@www.foo.com:8080/file;foo=1;bar=2?test=3&miao=4#test"))
// hash: "#test"
// hostname: "www.foo.com"
// password: "miao"
// pathname: "/file;foo=1;bar=2"
// port: "8080"
// protocol: "https:"
// search: "?test=3&miao=4"
// username: "juanni"

/**
 * 解析url中所有的参数名称与值
 * @param {*} url 
 * @returns 
 */
const getQuery = (url) => {
  // str为？之后的参数部分字符串
  const str = url.substr(url.indexOf('?') + 1)
  // arr每个元素都是完整的参数键值
  const arr = str.split('&')
  // result为存储参数键值的集合
  const result = {}
  for (let i = 0; i < arr.length; i++) {
    // item的两个元素分别为参数名和参数值
    const item = arr[i].split('=')
    result[item[0]] = item[1]
  }
  return result
}

const res = getQuery('https://www.google.com/search?a=123&b=adbxo213&c=UTF-8')
console.log(res)
