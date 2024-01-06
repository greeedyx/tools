import { sleep } from "./promise";

interface RetryOptions<T> {
  times: number;
  delay?: number;
  executor: Function | ((...args: any[]) => (T | Promise<T>));
  onfail?: (error: any) => void;
}

export function retry<T>(opts: RetryOptions<T>): Promise<T> {
  const { times, delay = 0, executor, onfail } = opts;
  if (times <= 0) {
    return Promise.reject(new Error('Retry times left 0'));
  }
  if (typeof executor !== 'function') {
    return Promise.reject(new Error('executor must be a function'));
  }
  return sleep(delay).then(() => executor()).catch(error => {
    try {
      onfail?.(error);
    } catch (error) {
    } finally {
      return retry({ ...opts, times: times - 1 });
    }
  })
}