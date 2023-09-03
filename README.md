# greedyx/tools

JavaScript 简易工具库

## 安装

```shell
npm install greedyx/tools
```

## 使用

```
import { sleep, isBlank, isEmpty } from '@greedyx/tools';

sleep(1000).then(() => {
  console.log('1s later');
});
isBlank(' '); // true
isBlank('   '); // true
isBlank('  \n'); // true
isBlank('  \n  '); // true
isEmpty('') // true
isEmpty('  ') // false
isEmpty('  \n') // false
isEmpty(undefined) // true
isEmpty(null) // true
isEmpty(0) // false
isEmpty(false) // false
```

## API

```javascript
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
// 防抖函数
export declare function debounce<Args extends any[]>(fn: (...s: Args) => any, ms?: number): (...args: Args) => void;
// 节流函数
export declare function throttle<Args extends any[]>(fn: (...s: Args) => any, ms?: number): (...args: Args) => void;
// 转换为下划线模式
export declare function underline(o: string): string;
export declare function underline(o: Props): Props;
export declare function underline<T>(o: Array<T>): Array<T>;
// 转换为驼峰模式
export declare function camel(o: string): string;
export declare function camel(o: Props): Props;
export declare function camel<T>(o: Array<T>): Array<T>;
// 将多个返回值是Promise的函数任务顺序执行
export declare function sequenceExec<T extends Promise<any>>(ps: ((...args: any[]) => T)[]): Promise<any[]>;
```
