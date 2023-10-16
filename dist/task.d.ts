export default class TaskQueue {
    private _threadNum;
    private _totalCount;
    private _finishCount;
    private _taskArray;
    private onFinishing;
    private onEvering;
    private onSuccessing;
    private onErroring;
    constructor(threadNum?: number);
    get totalCount(): number;
    get finishCount(): number;
    get progress(): string;
    add<T>(task: () => any): this;
    addMany(tasks: (() => any)[]): this;
    run(): void;
    private shiftElements;
    private execute;
    onFinish(fn: Function): this;
    onSuccess(fn: Function): this;
    onEvery(fn: Function): this;
    onError(fn: Function): this;
    reset(): this;
}
