import { allSettled, isFunction, isPromise } from "./tools";

export default class TaskQueue {

  private _threadNum = 1;
  private _totalCount = 0;
  private _finishCount = 0;
  private _taskArray: (() => any)[] = [];
  private onFinishing: Function = () => 0;
  private onEvering: Function = () => 0;
  private onSuccessing: Function = () => 0;
  private onErroring: Function = () => 0;

  constructor(threadNum: number = 1) {
    this._threadNum = threadNum;
  }

  get totalCount() {
    return this._totalCount;
  }

  get finishCount() {
    return this._finishCount;
  }

  get progress() {
    return `${this.finishCount}/${this.totalCount}`;
  }

  public add<T>(task: () => any) {
    this._taskArray.push(task);
    this._totalCount++;
    return this;
  }

  public addMany(tasks: (() => any)[]) {
    tasks.forEach(it => this.add(it));
    return this;
  }

  public run() {
    const tasks = this.shiftElements(this._threadNum);
    allSettled(tasks.map(it => this.execute(it)))
      .finally(() => {
        setTimeout(() => {
          this.onFinishing?.()
        });
      })
  }

  private shiftElements(num: number) {
    const result: any[] = [];
    for (let index = 0; index < num && this._taskArray.length; index++) {
      const el = this._taskArray.shift();
      result.push(el);
    }
    return result;
  }

  private execute(task: Function): Promise<any> {
    if (!task) {
      return Promise.resolve();
    }
    let next: Promise<any>;
    try {
      const result = task();
      next = isPromise(result) ? result : Promise.resolve(result);
    } catch (error) {
      next = Promise.reject(error);
    }

    return next.then((res: any) => setTimeout(() => {
      this._finishCount++;
      this.onSuccessing?.(res)
      this.onEvering?.(res, undefined)
    })).catch((err: any) => setTimeout(() => {
      this._finishCount++;
      this.onErroring?.(err)
      this.onEvering?.(undefined, err)
    })).finally(() => setTimeout(() => {
      const [newTask] = this.shiftElements(1);
      return this.execute(newTask);
    }))
  }

  public onFinish(fn: Function) {
    if (isFunction(fn)) {
      this.onFinishing = fn;
    }
    return this;
  }

  public onSuccess(fn: Function) {
    if (isFunction(fn)) {
      this.onSuccessing = fn;
    }
    return this;
  }

  public onEvery(fn: Function) {
    if (isFunction(fn)) {
      this.onEvering = fn;
    }
    return this;
  }

  public onError(fn: Function) {
    if (isFunction(fn)) {
      this.onErroring = fn;
    }
    return this;
  }

  public reset() {
    this._finishCount = 0;
    this._totalCount = 0;
    this._taskArray = [];
    return this;
  }

}
