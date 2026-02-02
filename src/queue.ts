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
  // 日志函数
  logger?: ((error: string, other: string) => void) | boolean;
}
interface QueueItem<T> {
  e: T;
  i: number;
}

export default class Queue<T, K> {
  // 并发数量
  private concurrency: number;
  // 重试次数
  private times: number;
  // 存储源数据
  public queue: T[];
  // 将源数据分多个队列存储
  private queues: Array<QueueItem<T>[]> = [];
  // 执行结果
  public result: Array<{ done: boolean, index: number, value?: K, error?: Error }> = [];
  // 日志函数
  private logger: Function;
  // 延迟多久重试
  private delay: number;
  // 总数
  public total: number;


  constructor({
    concurrency,
    queue,
    retry,
    retrydelay,
    logger
  }: QueueOptions<T>) {
    // 存储配置
    this.concurrency = concurrency || 1;
    this.times = Number(retry) || 0;
    this.delay = Number(retrydelay) || 0;
    this.logger = typeof logger === 'function' ? logger : logger ? console.log.bind(console) : function () { };
    this.queue = queue || [];
    this.total = this.queue.length || 0;
    // 初始化concurrency个空数组
    for (let i = 0; i < this.concurrency; i++) {
      this.queues[i] = [];
    }
    // 将数据依次分配到这些数组中
    for (let i = 0; i < this.queue.length; i++) {
      const it = this.queue[i];
      const idx = i % this.concurrency;
      const el = { e: it, i: i };
      const q = this.queues[idx];
      q.push(el);
    }
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
          this.logger(`第${it.i + 1}个任务执行失败.`);
          this.result[it.i] = { done: false, error: e, index: it.i };
          return e;
        }).finally(() => {
          this.logger(`第${it.i + 1}个任务执行结束.`);
        })
      })
    })).then(() => {
      const values: any[] = [];
      const errors: any[] = [];
      const result = this.result;
      this.logger(`全部执行完毕,总共${this.total}个,成功${values.length}个,失败${errors.length}个.`);
      return {
        result,
        values: function () {
          return result.filter(t => t.done).map(t => t.value);
        },
        errors: function () {
          return result.filter(t => !t.done).map(t => t.error);
        },
        [Symbol.toPrimitive]: function() {
          return result;
        },
        [Symbol.iterator]: function* () {
          for (const e of result) {
            yield e;
          }
        }
      }
    })
  }

}
