function parseHTML(html) {
  const stack = [];
  let root = null;
  let i = 0;

  while (i < html.length) {
      if (html[i] === '<') {
          if (html[i + 1] === '/') {
              // 处理闭合标签
              let endIndex = html.indexOf('>', i);
              stack.pop();
              i = endIndex + 1;
          } else {
              // 处理开始标签
              let endIndex = html.indexOf('>', i);
              const tagInfo = html.slice(i + 1, endIndex).trim();
              const tagName = tagInfo.split(' ')[0];
              const newNode = { tag: tagName, children: [] };

              if (stack.length === 0) {
                  root = newNode;
              } else {
                  const parent = stack[stack.length - 1];
                  parent.children.push(newNode);
              }
              stack.push(newNode);
              i = endIndex + 1;
          }
      } else {
          // 处理文本内容
          let endIndex = html.indexOf('<', i);
          if (endIndex === -1) {
              endIndex = html.length;
          }
          const text = html.slice(i, endIndex).trim();
          if (text) {
              const textNode = { tag: 'text', children: [], text };
              const currentParent = stack[stack.length - 1];
              if (currentParent) {
                  currentParent.children.push(textNode);
              }
          }
          i = endIndex;
      }
  }

  return root ? [root] : [];
}

// 示例 HTML 字符串
const html_1 = '<div>Hello <span>World</span></div>';
const result_1 = parseHTML(html_1);
console.log(JSON.stringify(result_1));

// 示例 HTML 字符串，包含换行符和空格
const html_2 = `
<div>
  Hello
  <article>
    <p>World</p>
    <span>!</span>
  </article>
  <article>
    <p>World</p>
    <span>!</span>
  </article>
</div>
`;
const result_2 = parseHTML(html_2);
console.log(JSON.stringify(result_2));
  


