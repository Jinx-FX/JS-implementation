// 策略模式
// 根据不同参数命中不同的策略

// 应用案例：表单验证

// 策略对象
const strategies = {
  // 验证是否为空
  isNoEmpty: function (value, errorMsg) {
    if (value.trim() === "") {
      return errorMsg;
    }
  },
  // 验证最小长度
  minLength: function (value, length, errorMsg) {
    if (value.trim().length < length) {
      return errorMsg;
    }
  },
  // 验证最大长度
  maxLength: function (value, length, errorMsg) {
    if (value.length > length) {
      return errorMsg;
    }
  },
  // 验证手机号
  isMobile: function (value, errorMsg) {
    if (
      !/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|17[7]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(
        value
      )
    ) {
      return errorMsg;
    }
  }
};

// 验证类
class Validator {
  constructor() {
    this.cache = []; // 存储要验证的方法
    this.errList = []; // 存储最终的验证结果
  }
  add (value, rules) {
    for (let i = 0, rule; (rule = rules[i++]);) {
      let strategyAry = rule.strategy.split(":");
      let errorMsg = rule.errorMsg;
      this.cache.push(() => {
        let strategy = strategyAry.shift();
        strategyAry.unshift(value);
        strategyAry.push(errorMsg);
        // 执行策略对象中的不同验证规则
        let error = strategies[strategy](...strategyAry);
        if (error) {
          this.errList.push(error);
        }
      });
    }
  }
  start () {
    for (let i = 0, validatorFunc; (validatorFunc = this.cache[i++]);) {
      validatorFunc();
    }
    return this.errList;
  }
}

let validataFunc = function (info) {
  let validator = new Validator();
  validator.add(info.userName, [
    {
      strategy: "isNoEmpty",
      errorMsg: "用户名不可为空"
    },
    {
      strategy: "minLength:2",
      errorMsg: "用户名长度不能小于2位"
    }
  ]);
  validator.add(info.password, [
    {
      strategy: "minLength:6",
      errorMsg: "密码长度不能小于6位"
    }
  ]);
  validator.add(info.phoneNumber, [
    {
      strategy: "isMobile",
      errorMsg: "请输入正确的手机号码格式"
    }
  ]);
  return validator.start();
};

// 需要验证表单的对象
let userInfo = {
  userName: "王",
  password: "1234",
  phoneNumber: "666"
};
let errorMsg = validataFunc(userInfo);
console.log(errorMsg); // ['用户名长度不能小于2位', '密码长度不能小于6位', '请输入正确的手机号码格式']