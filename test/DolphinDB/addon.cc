// 需要node.h头文件
#include <node.h>
#include <iostream>

namespace demo { 
  using v8::Context;
  using v8::Exception;
  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Number;
  using v8::Object;
  using v8::String;
  using v8::Value;
  using v8::Array;

  // 获取内存的方法
  void MemoryDump(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();
    // 如果参数大于一个 error
    if (args.Length() > 1) {
      isolate->ThrowException(
        Exception::TypeError(
          String::NewFromUtf8(
            isolate,
            "Wrong number of arguments"
          ).ToLocalChecked()
        )
      );
      return;
    }
    // 如果参数不是一个数值 error
    if (!args[0]->IsNumber()) {
      isolate->ThrowException(
        Exception::TypeError(
          String::NewFromUtf8(
            isolate,
            "Wrong arguments type"
          ).ToLocalChecked()
        )
      );
      return;
    }

    Local<Context> context = isolate->GetCurrentContext();
    double value = args[0]->NumberValue(context).FromMaybe(0);
    double* temp = &value;
    int len = sizeof(value);

    int mem = 0;
    for (int i = 0; i < len; i++) {
        mem = *((uint8_t *)temp + i);
        printf("%02x ",mem);
    }
    // 设置返回值
    args.GetReturnValue().Set(mem);
  }

  void Initialize(Local<Object> exports) {
    NODE_SET_METHOD(exports, "get_double_mem", MemoryDump);
  }
  
  NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
}