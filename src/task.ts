import { isFunction } from "./tools";

export default class TaskQueue {

  private _threadNum = 1;
  private _totalCount = 0;
  private _finishCount = 0;
  private _taskArray: (() => Promise<any>)[] = [];
  private onFinishing: Function = () => 0;
  private onProcessing: Function = () => 0;
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
    if (this.totalCount) {
      return (this.finishCount / this.totalCount).toFixed(2);
    } else {
      return 0;
    }
  }

  public add<T>(task: () => Promise<any>) {
    this._taskArray.push(task);
    this._totalCount++;
    return this;
  }

  public addMany(tasks: (() => Promise<any>)[]) {
    tasks.forEach(it => this.add(it));
    return this;
  }

  public run() {
    const tasks = this.shiftElements(this._threadNum);
    Promise.all(tasks.map(it => this.execute(it))).finally(() => {
      setTimeout(() => {
        if (!this._taskArray.length) {
          this.onFinishing?.()
          return;
        }
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

  private execute(task: Function) {
    if (!task) {
      return Promise.resolve();
    }
    return task().then((res: any) => setTimeout(() => {
      this.onProcessing?.(res)
    })).catch((err: any) => setTimeout(() => {
      this.onErroring?.(err)
    })).finally(() => {
      this._finishCount++;
      const [newTask] = this.shiftElements(1);
      return this.execute(newTask);
    })
  }

  public onFinish(fn: Function) {
    if (isFunction(fn)) {
      this.onFinishing = fn;
    }
    return this;
  }

  public onProcess(fn: Function) {
    if (isFunction(fn)) {
      this.onProcessing = fn;
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
