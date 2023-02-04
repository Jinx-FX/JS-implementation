// 代理模式
// 代理对象和本体对象具有一致的接口

// 应用案例：图片预加载

// 代理模式
let relImage = (function () {
  let imgNode = document.createElement("img");
  document.body.appendChild(imgNode);
  return {
    setSrc (src) {
      imgNode.src = src;
    }
  };
})();

let proxyImage = (function () {
  let img = new Image();
  // 实际要加载的图片 加载成功后 替换调占位图,加载事件添加
  img.onload = function () {
    relImage.setSrc(img.src);
  };
  return {
    setSrc (src) {
      img.src = src;
      // 设置占位图
      relImage.setSrc(
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      );
    }
  };
})();

// 设置实际要加载的图片
proxyImage.setSrc(
  "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
);
