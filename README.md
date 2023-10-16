# greedyx/tools

- JavaScript 简易工具函数
- 任务队列 TaskQueue
- 发布订阅 Subject

## 安装

```shell
npm install greedyx/tools
```

## 使用

```typescript
import { sleep, isBlank, isEmpty } from "@greedyx/tools";

sleep(1000).then(() => {
  console.log("1s later");
});
isBlank(" "); // true
isBlank("   "); // true
isBlank("  \n"); // true
isBlank("  \n  "); // true
isEmpty(""); // true
isEmpty("  "); // false
isEmpty("  \n"); // false
isEmpty(undefined); // true
isEmpty(null); // true
isEmpty(0); // false
isEmpty(false); // false
```

## API

### 常用工具函数
```typescript
interface Props {
  [k: string]: any;
}
// 延迟执行，返回Promise
export declare function sleep(ms: number): Promise<null>;
// 判断是否为空（去除前后空白字符），返回boolean
export declare function isBlank(v: any): boolean;
// 判断是否为空（null、undefined、空字符串），返回boolean
export declare function isEmpty(v: any): boolean;
// 判断是否为对象，返回boolean
export declare function isObject(v: any): boolean;
// 判断是否为函数，返回boolean
export declare function isFunction(v: any): boolean;
// 判断是否为数组，返回boolean
export declare function isArray(v: any): boolean;
// 判断是否为PromiseLike，返回boolean
export declare function isPromise(v: any): boolean;
// 防抖函数
export declare function debounce<Args extends any[]>(
  fn: (...s: Args) => any,
  ms?: number
): (...args: Args) => void;
// 节流函数
export declare function throttle<Args extends any[]>(
  fn: (...s: Args) => any,
  ms?: number
): (...args: Args) => void;
// 转换为下划线模式
export declare function underline(o: string): string;
export declare function underline(o: Props): Props;
export declare function underline<T>(o: Array<T>): Array<T>;
// 转换为驼峰模式
export declare function camel(o: string): string;
export declare function camel(o: Props): Props;
export declare function camel<T>(o: Array<T>): Array<T>;
// 将多个返回值是Promise的函数任务顺序执行
export declare function sequenceExec<T extends Promise<any>>(
  ps: ((...args: any[]) => T)[]
): Promise<any[]>;
```

### 任务队列

```typescript
import { TaskQueue } from '@greedyx/tools';

// 任务队列, 支持链式调用, 其中构造函数的参数为正整数，表示队列任务的并发执行数
const queue = new TaskQueue(2)
    // 添加单个任务
    .add(() => {
      console.log(1)
      return 1
    })
    .add(() => {
      console.log(2)
      return Promise.resolve(2)
    })
    // 批量添加任务
    .addMany([
      () => {
        console.log(3)
        return 3
      },
      () => {
        console.log(4)
        return Promise.reject(`e4`)
      },
      () => {
        console.log(5)
        throw new Error(`error`)
      },
    ])
    // 监听每个任务的执行
    .onEvery((result, err) => {
      // 打印任务的执行进度
      console.log(queue.progress)
      if (!err) {
        console.log(`执行成功`, result);
      } else {
        console.log(`错误信息`, err?.message || err);
      }
    })
  // 开始执行
  queue.run();
// 执行结果如下
// 1
// 2
// 1/5
// 执行成功 1
// 2/5
// 执行成功 2
// 3
// 4
// 3/5
// 执行成功 3
// 5
// 4/5
// 错误信息 e4
// 5/5
// 错误信息 error

```

### 发布订阅

```typescript

  import { Subject } from '@greedyx/tools';

  // 类似rxjs中的 BehaviorSubject
  const subject = new Subject();

  // 发送通知
  subject.next(`xxx`)

  // 订阅消息
  const subscription = subject.subscribe(args => {
    console.log(args)
  })
  // 取消订阅
  subject.unsubscribe(subscription);

````
