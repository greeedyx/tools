interface Props {
    [k: string]: any;
}
export declare function sleep(ms: number): Promise<null>;
export declare function isBlank(v: any): boolean;
export declare function isEmpty(v: any): boolean;
export declare function isObject(v: any): boolean;
export declare function isFunction(v: any): boolean;
export declare function isArray(v: any): boolean;
export declare function isPromise(obj: any): boolean;
export declare function debounce<Args extends any[]>(fn: (...s: Args) => any, ms?: number): (...args: Args) => void;
export declare function throttle<Args extends any[]>(fn: (...s: Args) => any, ms?: number): (...args: Args) => void;
export declare function underline(o: string): string;
export declare function underline(o: Props): Props;
export declare function underline<T>(o: Array<T>): Array<T>;
export declare function camel(o: string): string;
export declare function camel(o: Props): Props;
export declare function camel<T>(o: Array<T>): Array<T>;
export declare function sequenceExec<T extends Promise<any>>(ps: ((...args: any[]) => T)[]): Promise<any[]>;
export type SettleSuccess = {
    status: 'fulfilled';
    value: any;
};
export type SettleFailed = {
    status: 'rejected';
    reason: any;
};
export type SettleResult = SettleSuccess | SettleFailed;
export declare function allSettled(ps: Promise<any>[]): Promise<SettleResult[]>;
export {};
