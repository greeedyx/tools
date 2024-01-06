import { Props, isEmpty, isObject } from "./judge";


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