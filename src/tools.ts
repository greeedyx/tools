interface Props {
  [k: string]: any
}

export function sleep(ms: number): Promise<null> {
  positiveCheck(ms);
  return new Promise((resolve) => {
    if (ms)
      setTimeout(() => {
        resolve(null);
      }, ms);
  })
}

function positiveCheck(n: number) {
  if (n < 0) {
    throw new Error(`数值不能小于0`);
  }
}

export function isBlank(v: any) {
  if (isEmpty(v)) {
    return true;
  }
  return !String(v).trim().length;
}

export function isEmpty(v: any) {
  if (v === "" || v === undefined || v === null) {
    return true;
  }
  return false;
}

export function isObject(v: any) {
  return typeof v === 'object' && v !== null;
}

export function isFunction(v: any) {
  return typeof v === 'function';
}

export function isArray(v: any) {
  return Object.prototype.toString.call(v) === "[object Array]";
}

export function isPromise(obj: any) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export function debounce<Args extends any[]>(fn: (...s: Args) => any, ms: number = 500) {
  positiveCheck(ms);
  let timer: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
      timer && clearTimeout(timer);
      timer = null;
    }, ms);
  }
}

export function throttle<Args extends any[]>(fn: (...s: Args) => any, ms: number = 500) {
  positiveCheck(ms);
  let timer: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (!timer) {
      timer = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, args);
        timer && clearTimeout(timer);
        timer = null;
      }, ms);
    }
  }
}

function _underline(name: string) {
  if (isEmpty(name)) {
    return name;
  }
  return name.toString().replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function underline(o: string): string;
export function underline(o: Props): Props;
export function underline<T>(o: Array<T>): Array<T>;
export function underline(o: any): any {
  if (isArray(o)) {
    return o.map((it: any) => underline(it));
  }
  if (isObject(o)) {
    const result: Props = {};
    Object.keys(o).forEach((k) => {
      const newKey = _underline(k);
      result[newKey] = o[k];
    });
    return result;
  } else {
    return _underline(o);
  }
}

function _camel(name: string) {
  if (isEmpty(name)) {
    return name;
  }
  return name.toString().replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
}

export function camel(o: string): string;
export function camel(o: Props): Props;
export function camel<T>(o: Array<T>): Array<T>;
export function camel(o: any): any {
  if (Array.isArray(o)) {
    return o.map((it) => camel(it));
  }
  if (isObject(o)) {
    const result: Props = {};
    Object.keys(o).forEach((k) => {
      const newKey = _camel(k);
      result[newKey] = o[k];
    });
    return result;
  } else {
    return _camel(o);
  }
}

export function sequenceExec<T extends Promise<any>>(ps: ((...args: any[]) => T)[]) {
  const result: any[] = [];
  let pro = Promise.resolve(result);
  for (const p of ps) {
    pro = pro.then(() => p()).then((r) => {
      result.push(r);
      return result;
    });
  }
  return pro;
}

export function waitUntil<T>(func: Function, options: {
  interval?: number;
  maxWait?: number;
  data?: T;
} = {}): Promise<T | undefined> {
  return new Promise((resolve) => {
    const { interval = 100, maxWait = -1, data } = options;
    const condition = (() => maxWait > 0 ? () => times <= 0 : () => false)();
    let times = Math.ceil(maxWait / interval);
    const timer = setInterval(() => {
      if (func() || condition()) {
        clearInterval(timer);
        resolve(data);
      }
      times--;
    }, interval);
  });
}

export function parseJson(val: string, d: any = {}) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return d;
  }
}

export function stringfyJson(val: Object, d: '' | null = '') {
  if (isEmpty(val)) {
    return d;
  }
  if (isArray(val) || isObject(val)) {
    return JSON.stringify(val);
  }
  return String(val);
}

export type SettleSuccess = { status: 'fulfilled', value: any };
export type SettleFailed = { status: 'rejected', reason: any };
export type SettleResult = SettleSuccess | SettleFailed;

export function allSettled(ps: Promise<any>[]): Promise<SettleResult[]> {
  const results: SettleResult[] = [];
  const counter = new Map<number, number>();
  const size = ps.length;
  return new Promise((resolve) => {
    for (let index = 0; index < size; index++) {
      const it = ps[index];
      it.then((result) => {
        results[index] = { status: 'fulfilled', value: result };
      }).catch((e) => {
        results[index] = { status: 'rejected', reason: e };
      }).finally(() => {
        counter.set(index, 1);
        if (counter.size === ps.length) {
          resolve(results)
        }
      })
    }
  })

}
