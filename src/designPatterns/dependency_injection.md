# 依赖注入（Dependency Injection, DI）

**依赖注入（Dependency Injection, DI）**是一种设计模式，用于实现控制反转（Inversion of Control, IoC）。它通过将对象的依赖关系从内部管理转移到外部管理，使得对象的创建和依赖关系的管理更加灵活和可维护。

依赖注入的核心概念

1. 依赖：一个对象需要使用的其他对象。
2. 注入：将依赖传递给需要它的对象，而不是让对象自己创建依赖。
3. 容器：一个管理依赖关系的组件，负责创建和提供依赖。

依赖注入的好处

1. 解耦：对象不再负责创建其依赖，减少了对象之间的耦合。
2. 可测试性：可以轻松地替换依赖对象，使得单元测试更加容易。
3. 可维护性：依赖关系集中管理，代码更容易理解和维护。

依赖注入的实现方式

1. 构造函数注入：通过构造函数传递依赖。
2. 属性注入：通过设置对象的属性传递依赖。
3. 方法注入：通过方法参数传递依赖。

在 TypeScript 中，可以使用依赖注入（Dependency Injection, DI）来管理对象的创建和依赖关系。

依赖注入可以通过多种方式实现，包括构造函数注入、属性注入和方法注入。以下是一个简单的例子，展示如何使用构造函数注入来实现依赖注入。

示例：使用构造函数注入

1. 定义接口和实现类

首先，定义一个接口和它的实现类：

```ts
export interface ILogger {
  log(message: string): void;
}

// filepath: /Users/didi/Desktop/sfcar/src/services/ConsoleLogger.ts
import { ILogger } from './Logger';

export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}
```

2. 定义一个依赖注入容器

接下来，定义一个简单的依赖注入容器来管理对象的创建和依赖关系：

```ts
class Container {
  private services: Map<string, any> = new Map();

  register<T>(name: string, service: new (...args: any[]) => T): void {
    this.services.set(name, service);
  }

  resolve<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service not found: ${name}`);
    }
    return new service();
  }
}

export const container = new Container();
```

3. 注册服务

在应用程序启动时，注册服务到容器中：

```ts
import { container } from './di/Container';
import { ILogger } from './services/Logger';
import { ConsoleLogger } from './services/ConsoleLogger';

container.register<ILogger>('Logger', ConsoleLogger);
```

4. 使用依赖注入

最后，在需要使用依赖的地方，通过容器解析依赖：

```ts
import { container } from '../di/Container';
import { ILogger } from '../services/Logger';

class App {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  run(): void {
    this.logger.log('App is running');
  }
}

const logger = container.resolve<ILogger>('Logger');
const app = new App(logger);
app.run();
```

总结

这个例子展示了如何使用依赖注入来管理对象的创建和依赖关系。通过依赖注入，可以使代码更加模块化、可测试和可维护。

你可以根据需要扩展这个例子，例如添加更多的服务、使用属性注入或方法注入等。