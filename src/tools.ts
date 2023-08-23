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
export function debounce<Args extends any[]>(fn: (...s: Args) => any, ms: number = 500) {
  positiveCheck(ms);
  let timer: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (timer) {
      clearTimeout(timer)
    } else {
      timer = setTimeout(() => {
        fn(...args);
        timer && clearTimeout(timer);
        timer = null;
      }, ms);
    }
  }
}

export function throttle<Args extends any[]>(fn: (...s: Args) => any, ms: number = 500) {
  positiveCheck(ms);
  let timer: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn(...args);
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


