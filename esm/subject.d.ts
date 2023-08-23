export default class Subject {
    private map;
    private args;
    private containHistory;
    constructor(history?: boolean);
    unsubscribe(key: string): void;
    subscribe(callback: Function): string;
    next(...arg: any[]): void;
    clear(): void;
}
