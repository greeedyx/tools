import Subject from './subject';
import TaskQueue from './task';
export * from './tools';
export { Subject, TaskQueue };

import {
  sleep,
  isBlank,
  isArray,
  isEmpty,
  isObject,
  isFunction,
  isPromise,
  debounce,
  throttle,
  underline,
  camel,
  sequenceExec,
  allSettled
} from './tools';


const Tools = {
  sleep,
  isBlank,
  isArray,
  isEmpty,
  isObject,
  isFunction,
  isPromise,
  debounce,
  throttle,
  underline,
  camel,
  sequenceExec,
  allSettled,
  Subject,
  TaskQueue
}


export default Tools;