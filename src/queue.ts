import retry from "./retry";

interface QueueOptions<T> {
  // 并发数
  concurrency?: number;
  // 源数据
  queue?: T[];
  // 失败重试次数
  retry?: number;
  // 延迟多久重试
  retrydelay?: number;
}
interface QueueItem<T> {
  e: T;
  i: number;
}

export default class Queue<T, K> {
  // 并发数量
  concurrency: number;
  // 重试次数
  times: number;
  // 存储源数据
  queue: T[];
  // 将源数据分多个队列存储
  queues: Array<QueueItem<T>[]> = [];
  // 异常数据
  errors: Array<any> = [];
  // 执行结果
  result: Array<any> = [];
  // 延迟多久重试
  delay: number;
  total: number;

  constructor({
    concurrency,
    queue,
    retry,
    retrydelay
  }: QueueOptions<T>) {
    // 存储配置
    this.concurrency = concurrency || 1;
    this.times = Number(retry) || 0;
    this.delay = Number(retrydelay) || 0;
    this.queue = queue || [];
    this.total = this.queue.length || 0;
    // 初始化concurrency个空数组
    for (let i = 0; i < this.concurrency; i++) {
      this.queues[i] = [];
    }
    // 将数据依次分配到这些数组中
    this.queue.forEach((it, index) => {
      const idx = index % this.concurrency;
      const el = { e: it, i: index };
      const q = this.queues[idx];
      q.push(el);
    });
  }

  sequenceExec(ps: QueueItem<T>[], fn: (e: QueueItem<T>) => any) {
    let pro = Promise.resolve(0);
    for (let i = 0; i < ps.length; i++) {
      const el = ps[i];
      pro = pro.then(() => fn(el));
    }
    return pro;
  }

  // 添加任务到队列
  every(func: (e: T, i: number, a: number) => K) {
    return Promise.all(this.queues.map(queue => {
      return this.sequenceExec(queue, (it) => {
        return retry({
          executor: () => func(it.e, it.i, this.total),
          times: this.times,
          delay: this.delay,
        }).then((r: K) => {
          this.result[it.i] = { done: true, value: r, index: it.i };
          return r;
        }).catch((e: Error) => {
          // console.log('retry failed:', error);
          this.result[it.i] = { done: false, error: e, index: it.i };
          return e;
        })
      })
    })).then(() => {
      return this.result;
    })
  }

}
