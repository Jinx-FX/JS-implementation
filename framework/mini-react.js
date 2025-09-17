// 1. 创建虚拟DOM元素
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      // 处理子元素，将文本节点包装成对象
      children: children.map(child => 
        typeof child === 'object' ? child : createTextElement(child)
      )
    }
  };
}

// 创建文本节点的虚拟DOM
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  };
}

// 2. 渲染函数：将虚拟DOM转换为真实DOM并添加到容器
function render(element, container) {
  // 创建真实DOM节点
  const dom = element.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(element.type);

  // 添加属性
  const isProperty = key => key !== 'children';
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });

  // 递归渲染子元素
  element.props.children.forEach(child => {
    render(child, dom);
  });

  // 将真实DOM添加到容器
  container.appendChild(dom);
  
  // 保存根节点引用，用于后续更新
  root = {
    dom: container,
    props: {
      children: [element]
    }
  };
}

// 3. 实现简单的协调算法(Reconciliation)
function updateDOM(dom, prevProps, nextProps) {
  // 移除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(key => !(key in nextProps))
    .forEach(name => {
      dom[name] = '';
    });

  // 设置新属性或更新现有属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(key => prevProps[key] !== nextProps[key])
    .forEach(name => {
      dom[name] = nextProps[name];
    });
}

// 4. 实现状态管理
let wipRoot = null;
let currentRoot = null;
let nextUnitOfWork = null;
let deletions = [];
let wipFiber = null;
let hookIndex = null;

// 调度更新
function scheduleUpdate() {
  wipRoot = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot
  };
  nextUnitOfWork = wipRoot;
  deletions = [];
}

// 实现useState Hook
function useState(initial) {
  const oldHook = wipFiber.alternate && 
    wipFiber.alternate.hooks && 
    wipFiber.alternate.hooks[hookIndex];
  
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };
  
  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });
  
  const setState = action => {
    hook.queue.push(action);
    scheduleUpdate();
  };
  
  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

// 处理函数组件
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

// 处理原生DOM元素
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

// 创建DOM元素
function createDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(fiber.type);
  
  updateDOM(dom, {}, fiber.props);
  return dom;
}

// 协调子元素
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;
  
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;
    
    // 判断节点类型是否相同
    const sameType = oldFiber && element && element.type === oldFiber.type;
    
    if (sameType) {
      // 类型相同，更新属性
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: 'UPDATE'
      };
    }
    
    if (element && !sameType) {
      // 类型不同，创建新节点
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT'
      };
    }
    
    if (oldFiber && !sameType) {
      // 类型不同，标记旧节点删除
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }
    
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }
    
    prevSibling = newFiber;
    index++;
  }
}

// 执行工作单元
function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  
  // 返回下一个工作单元
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 提交更新到DOM
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

// 提交工作
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  
  const domParent = fiber.parent.dom;
  
  if (fiber.effectTag === 'PLACEMENT' && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom != null) {
    updateDOM(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    domParent.removeChild(fiber.dom);
  }
  
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 工作循环
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  
  requestIdleCallback(workLoop);
}

// 启动工作循环
requestIdleCallback(workLoop);

// 5. 对外暴露的API
const MiniReact = {
  createElement,
  render,
  useState
};

// 示例使用
function Counter() {
  const [count, setCount] = MiniReact.useState(0);
  
  return MiniReact.createElement(
    'div',
    null,
    MiniReact.createElement('h1', null, `Count: ${count}`),
    MiniReact.createElement(
      'button',
      { onClick: () => setCount(c => c + 1) },
      'Increment'
    ),
    MiniReact.createElement(
      'button',
      { onClick: () => setCount(c => c - 1) },
      'Decrement'
    )
  );
}

// 渲染应用
const app = MiniReact.createElement(Counter, null);
MiniReact.render(app, document.getElementById('root'));
