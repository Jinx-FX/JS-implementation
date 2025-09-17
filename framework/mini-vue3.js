// 1. 响应式系统核心
let activeEffect;
const targetMap = new WeakMap();

// 依赖收集
function track(target, key) {
  if (!activeEffect) return;
  
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  
  dep.add(activeEffect);
}

// 触发更新
function trigger(target, key) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  
  const dep = depsMap.get(key);
  if (dep) {
    dep.forEach(effect => effect());
  }
}

// 创建响应式对象
function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      if (oldValue !== value) {
        Reflect.set(target, key, value, receiver);
        trigger(target, key);
      }
      return true;
    }
  });
}

// 注册副作用函数
function effect(fn) {
  activeEffect = fn;
  fn();
  activeEffect = null;
}

// 2. 虚拟DOM相关
function h(type, props = {}, children = []) {
  return {
    type,
    props,
    children: Array.isArray(children) ? children : [children]
  };
}

// 将虚拟节点转换为真实节点
function createVNode(vnode) {
  let el;
  
  // 创建元素
  if (typeof vnode.type === 'string') {
    el = document.createElement(vnode.type);
  } else {
    // 处理组件
    el = document.createElement('div');
  }
  
  // 处理属性
  if (vnode.props) {
    for (const key in vnode.props) {
      if (key.startsWith('on')) {
        // 处理事件
        const eventName = key.slice(2).toLowerCase();
        el.addEventListener(eventName, vnode.props[key]);
      } else {
        // 处理普通属性
        el.setAttribute(key, vnode.props[key]);
      }
    }
  }
  
  // 处理子节点
  if (vnode.children) {
    vnode.children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(createVNode(child));
      }
    });
  }
  
  vnode.el = el;
  return el;
}

// 3. 组件系统
function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    props: {},
    setupState: {},
    el: null
  };
  return instance;
}

function setupComponent(instance) {
  // 处理props
  instance.props = instance.vnode.props || {};
  
  // 处理setup
  const { type } = instance;
  if (typeof type === 'function') {
    const setupResult = type(instance.props);
    
    if (typeof setupResult === 'object') {
      instance.setupState = setupResult;
    }
  }
  
  // 设置默认渲染函数
  instance.render = () => {
    if (typeof instance.type === 'function') {
      // 函数组件的渲染逻辑
      return instance.type(instance.props);
    }
    return instance.vnode;
  };
}

// 4. 渲染器
function render(vnode, container) {
  if (!vnode) return;
  
  // 处理组件
  if (typeof vnode.type === 'function') {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    
    // 创建渲染effect
    effect(() => {
      const subTree = instance.render();
      if (instance.el) {
        // 简单的更新逻辑：直接替换
        container.replaceChild(createVNode(subTree), instance.el);
      } else {
        // 首次渲染
        instance.el = createVNode(subTree);
        container.appendChild(instance.el);
      }
    });
  } else {
    // 普通元素直接渲染
    container.appendChild(createVNode(vnode));
  }
}

// 5. 对外暴露的API
const MiniVue = {
  createApp: (rootComponent) => {
    return {
      mount: (selector) => {
        const container = document.querySelector(selector);
        const vnode = h(rootComponent);
        render(vnode, container);
      }
    };
  },
  reactive,
  effect,
  h
};

// 示例使用
// 计数器组件
const Counter = {
  setup() {
    const state = MiniVue.reactive({
      count: 0
    });
    
    const increment = () => {
      state.count++;
    };
    
    const decrement = () => {
      state.count--;
    };
    
    return {
      state,
      increment,
      decrement
    };
  },
  render(props) {
    return MiniVue.h('div', {}, [
      MiniVue.h('h1', {}, `Count: ${props.state.count}`),
      MiniVue.h('button', { onClick: props.increment }, 'Increment'),
      MiniVue.h('button', { onClick: props.decrement }, 'Decrement')
    ]);
  }
};

// 应用入口
MiniVue.createApp(Counter).mount('#app');
