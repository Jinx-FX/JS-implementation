// 访问者模式
// 在不改变该对象的前提下访问其结构中元素的新方法

// 应用案例：babel插件

// 元素类
class Student {
  constructor(name, chinese, math, english) {
    this.name = name;
    this.chinese = chinese;
    this.math = math;
    this.english = english;
  }

  accept (visitor) {
    visitor.visit(this);
  }
}

// 访问者类
class ChineseTeacher {
  visit (student) {
    console.log(`语文${student.chinese}`);
  }
}

class MathTeacher {
  visit (student) {
    console.log(`数学${student.math}`);
  }
}

class EnglishTeacher {
  visit (student) {
    console.log(`英语${student.english}`);
  }
}

// 实例化元素类
const student = new Student("张三", 90, 80, 60);
// 实例化访问者类
const chineseTeacher = new ChineseTeacher();
const mathTeacher = new MathTeacher();
const englishTeacher = new EnglishTeacher();
// 接受访问
student.accept(chineseTeacher); // 语文90
student.accept(mathTeacher); // 数学80
student.accept(englishTeacher); // 英语60