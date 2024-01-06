export interface Props {
  [k: string]: any
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
