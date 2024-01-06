import { Props, isArray, isEmpty, isObject } from "./judge";

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