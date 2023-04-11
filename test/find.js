const data = [
  { userId: 8, title: "title1" },

  { userId: 11, title: "other" },

  { userId: 15, title: null },

  { userId: 19, title: "title2" },
]

/* 查找数组中，符合 where 条件的数据，并根据 orderBy 指定的条件进行排序 */

const result = find(data)
  .where({
    title: /\d$/, // 这里意思是过滤出数组中，满足title字段中符合正则 /\d$/ 的项
  })
  .orderBy("userId", "desc") // 这里的意思是对数组中的项按照 userId 进行倒序排列

console.log(result.value) // 返回 [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];

// find 函数的类型定义如下

// interface IFindResult {

//  /* 当前结果 */

//  value: Array<{ [key: string]: string | number }>;

//  /* 出现多个字段的条件采用交集，即全满足的筛选 */

//  where(conditions: { [key: string]: RegExp }): IFindResult;

//  /* 支持针对单一字段做升降序 */

//  orderBy(key: string, order: 'desc' | 'asc'): IFindResult;

// }

// type IFind = (arr: Array<{ [key: string]: string | number }>) => IFindResult;

function find (data) {
  return {
    where (condition) {
      this.value = data.filter((item) => {
        for (let key of Object.keys(condition)) {
          if (condition[key].test(item[key])) return item
        }
      })

      return this
    },

    orderBy (key, order) {
      if (order === "desc" || order === "asc")
        this.value.sort((a, b) =>
          order === "asc" ? a[key] - b[key] : b[key] - a[key]
        )

      return this
    },

    value: data,
  }
}