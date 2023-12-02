// dom To JSON
// 将真实dom转化为虚拟dom

// 将真实dom转化为虚拟dom
function dom2Json (dom) {
  if (!dom.tagName) return
  let obj = {}
  obj.tag = dom.tagName
  obj.attrs = {}
  for (const key in dom.attributes) {
    if (dom[key].value) {
      obj.attrs[dom[key].name] = dom[key].value
    }
  }
  obj.children = []
  dom.childNodes.forEach(item => {
    // 去掉空的节点
    dom2Json(item) && obj.children.push(dom2Json(item))
  })
  return obj
}