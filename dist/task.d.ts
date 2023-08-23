export default class TaskQueue {
    private _threadNum;
    private _totalCount;
    private _finishCount;
    private _taskArray;
    private onFinishing;
    private onProcessing;
    private onErroring;
    constructor(threadNum?: number);
    get totalCount(): number;
    get finishCount(): number;
    get progress(): string | 0;
    add<T>(task: () => Promise<any>): this;
    addMany(tasks: (() => Promise<any>)[]): this;
    run(): void;
    private shiftElements;
    private execute;
    onFinish(fn: Function): this;
    onProcess(fn: Function): this;
    onError(fn: Function): this;
    reset(): this;
}
