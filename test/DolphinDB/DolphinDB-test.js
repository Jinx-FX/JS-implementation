// ------------ 问题 1：用十六进制写出双精度浮点数 13.25 在计算机内存中的表示
// 例：双精度浮点数 3.5 在内存中表示为 00 00 00 00 00 00 0c 40 (左边为内存低地址，右边为高地址)

/* 双精度浮点数 13.25 在计算机内存中的表示为: 00 00 00 00 00 80 2a 40 */
// Referrence: https://www.cnblogs.com/caomu08/p/15161397.html


// ------------ 问题 2：实现 unique 函数
/** 对数组或 iterable 中的每一项调用 selector，selector 返回的值作为 key 对数组去重（重复值保留后出现的那个）
    要求：时间复杂度 O(n)
    
    @template T
    @param {T[] | Iterable<T>} iterable
    @param {(obj: T) => any} selector
    @returns {T[]} unique 之后所包含元素的数组
*/
export function unique (iterable, selector) {
    const res = new Map()
    for (const user of iterable) {
        res.set(selector(user), user)
    }
    return Array.from(res.values())
}

const users = [
    { name: 'aaa', age: 12 },
    { name: 'bbb', age: 13 },
    { name: 'aaa', age: 14 },
]

unique(users, u => u.name)  // 得到 [{ name: 'aaa', age: 14 }, { name: 'bbb', age: 13 }]



// ------------ 问题 3: 构建导航菜单
// 使用数据库中的结点列表构建导航菜单

// 结点结构如下
// interface Node {
//     /** 导航菜单结点 id */
//     id: number

//     /** 导航菜单父结点 id (parent id)，根结点 pid 为 -1 */
//     pid: number

//     /** 菜单名称 */
//     name: string

//     /** 子菜单列表 */
//     children?: Node[]
// }

// 从数据库取出的结点列表数据
let data = [
    { id: 0, pid: -1, name: '面试' },
    { id: 1, pid: 0, name: '计算机基础知识及原理' },
    { id: 2, pid: 0, name: '前端技能' },
    { id: 3, pid: 0, name: '综合素质' },
    { id: 4, pid: 1, name: '编码' },
    { id: 5, pid: 1, name: '操作系统' },
    { id: 6, pid: 1, name: '网络' },
    { id: 7, pid: 1, name: '数据结构' },
    { id: 8, pid: 2, name: 'js' },
    { id: 9, pid: 2, name: '异步' },
    { id: 10, pid: 2, name: '项目' },
    { id: 11, pid: 3, name: '学习能力' },
    { id: 12, pid: 3, name: '解决问题能力' },
]

/** 构建菜单
    @typedef {{
        id: number
        pid: number
        name: string
        children?: Node[]
    }} Node
    @param {Node[]} nodes
    @returns {Node} 菜单
*/
function build (nodes) {
    // 请实现这个函数，要求时间复杂度 O(n)
    // （可以直接修改结点列表 data 中的各个结点，如增加 children 属性）
    const res = []
    const nodeMap = {}
    for (const node of nodes) {
        const { id, pid } = node
        if (!nodeMap[id]) nodeMap[id] = { children: [] }

        nodeMap[id] = { ...node, children: nodeMap[id].children }

        const tmpNode = nodeMap[id]

        if (pid === -1) res.push(tmpNode)
        else {
            if (!nodeMap[pid]) nodeMap[pid] = { children: [] }
            nodeMap[pid].children.push(nodeMap[id])
        }
    }
    return res[0]
}

build(data)

// Referrence: https://juejin.cn/post/6983904373508145189

// 应该返回以下的对象（省略部分结点）
// {
//     id: 0,
//     pid: -1,
//     name: '面试',
//     children: [
//         {
//             id: 1,
//             pid: 0,
//             name: '计算机基础知识及原理',
//             children: [
//                 {
//                     id: 4,
//                     pid: 1,
//                     name: '编码'
//                 },
//                 {
//                     id: 5,
//                     pid: 1,
//                     name: '操作系统'
//                 },
//                 // ...
//             ]
//         },
//         {
//             id: 2,
//             pid: 0,
//             name: '前端技能',
//             children: [
//                 // ...
//             ]
//         },
//         {
//             id: 3,
//             pid: 0,
//             name: '综合素质',
//             children: [
//                 // ...
//             ]
//         }
//     ]
// }



// ------------ 问题 4
/** 给一个递增的数组 a （元素可以有相同的值），含有 a.length 个元素，一个目标值 t, 求数组 a 中小于 t 的元素个数
    （请用最高效的算法实现，并注明时间复杂度）
    
    @param {number[]} a: 递增的数组
    @param {number} t: 目标值 t
    
    @returns {number} 数组 a 中小于 t 的元素的个数
    
    例子:
        f([1, 3, 6, 6, 8, 12], 0) === 0  
        f([1, 3, 6, 6, 8, 12], 1) === 0  
        f([1, 3, 6, 6, 8, 12], 2) === 1  
        f([1, 3, 6, 6, 8, 12], 3) === 1  
        f([1, 3, 6, 6, 8, 12], 4) === 2  
        f([1, 3, 6, 6, 8, 12], 6) === 2  
        f([1, 3, 6, 6, 8, 12], 7) === 4  
        f([1, 3, 6, 6, 8, 12], 8) === 4  
        f([1, 3, 6, 6, 8, 12], 9) === 5  
        f([1, 3, 6, 6, 8, 12], 12) === 5  
        f([1, 3, 6, 6, 8, 12], 13) === 6  
*/
function f (a, t) {
    if (t > a[a.length - 1]) return a.length
    else if (t <= a[0]) return 0

    let left = 0, right = a.length - 1
    while (left <= right) {
        let mid = (left + right) >> 1
        if (a[mid] >= t && a[mid - 1] < t) {
            return mid
        } else if (a[mid] > t) {
            right = mid - 1
        } else if (a[mid] < t) {
            left = mid + 1
        }
    }
}

/* 核心：二分查找，时间复杂度：O(logn) */

// ------------ 问题 5：展示一个你最满意的个人项目，内容不限、形式不限
// 可以是个人网站的链接、github 仓库地址、算法模型、自制游戏、app、论文等

// it's up to you.

// ------------ 附加题 1 (选做)：等待最先完成的任务
/** @param {number} milliseconds */
async function delay (milliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds)
    })
}

/** 执行任务 a 获取结果，返回是否符合要求 */
async function task_a () {
    await delay(2000)
    const valid = Math.random() > 0.5
    console.log('a', valid ? '满足要求' : '不满足要求')
    return valid
}

/** 执行任务 b 获取结果，返回是否符合要求 */
async function task_b () {
    await delay(5000)
    const valid = Math.random() > 0.5
    console.log('b', valid ? '满足要求' : '不满足要求')
    return valid
}

/** 并行开始两个任务，task_a 和 task_b 任意一个完成且满足要求后立即 return true, 且不等待另一个任务（短路） 
    如果第一个完成的任务不满足要求，需要看第二个任务是否满足要求，只有都不满足才返回 false
*/
async function a_or_b () {
    // todo: 请实现该函数
    if (
        await Promise.any([
            task_a().then((value) => {
                if (!value) throw new Error()
                return value
            }),
            task_b(),
        ])
    )
        return true
    return false
}


console.time()
if (await a_or_b())
    console.log('task_a 或 task_b 满足要求')
else
    console.log('task_a 且 task_b 都不满足要求')
console.timeEnd()

// 对于上面给的 task_a, 和 task_b 例子：
// 如果 task_a 满足要求，  a_or_b 应该耗时 2s
// 如果 task_a 不满足要求，a_or_b 应该耗时 5s

// 实际情况中 task_a, task_b 耗时不确定



// ------------ 附加题 2 (选做)：将问题 1 抽象为一个函数，传入任何一个 number，返回对应内存的字符串表示
// 提示：可以用 nodejs c++ addon 来实现
// https://nodejs.org/dist/latest-v17.x/docs/api/addons.html
// https://github.com/nodejs/node-addon-api/

// use c++ in nodejs

//     - npm i node - gyp 或 npm i node-gyp - g
//     - node-gyp configure: 详见配置文件 binding.gyp
//     - node-gyp build

// 中间可能会报错，排除语法错误，大多原因是环境配置问题，建议 google 或 bing

// Referrerce: https://juejin.cn/post/7145407262612258847

/**
    @param {number} x
    @returns {string}
*/
function get_double_mem (x) {
    // todo: 实现该函数
    addon.get_double_mem(x)
}
const addon = require('./build/Release/addon')
// 在 nodejs 中调用
get_double_mem(3.5) === '00 00 00 00 00 00 0c 40'

// 功能实现了解析十六进制的双精度浮点数在计算机内存中的表示，并打印结果，
// 本想用数组保存结果传递到 js 里面，但老是报错，暂时没解决

