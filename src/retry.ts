import { sleep } from "./promise";

interface RetryOptions<T> {
  times: number;
  delay?: number;
  logger?: Function;
  executor: Function | ((...args: any[]) => (T | Promise<T>));
}

/**
 * 执行函数，支持失败重试次数配置
 * @param opts 重试选项对象，包含延迟时间、重试次数和要执行的函数
 * @returns 返回一个Promise，它将在操作成功时解析结果，或者在操作失败且没有剩余重试次数时拒绝
 */
export default function retry<T>(opts: RetryOptions<T>): Promise<T> {
  const { delay = 0, times, executor, logger = console.log } = opts;
  if (typeof executor !== 'function') {
    return Promise.reject(new Error('executor must be a function'));
  }
  if (typeof times !== 'number' || times < 0) {
    return Promise.reject(new Error('times must be a positive number'));
  }
  return sleep(delay)
    .then(() => executor())
    .catch(e => {
      if (times <= 0) {
        return Promise.reject(e);
      }
      if (logger) {
        logger(`剩余${times}次重试......`);
      }
      return retry({ executor, delay, times: times - 1 });
    })
}
