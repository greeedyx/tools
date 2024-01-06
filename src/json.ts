import { isArray, isEmpty, isObject } from "./judge";

export function parseJson(val: string, d: any = {}) {
  if (isEmpty(val)) {
    return d;
  }
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