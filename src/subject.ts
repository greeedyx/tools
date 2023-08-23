export default class Subject {

  private map: Map<string, Function>;
  private args: any[];
  private containHistory: boolean;

  constructor(history: boolean = true) {
    this.map = new Map();
    this.args = [];
    this.containHistory = history;
  }

  unsubscribe(key: string) {
    this.map.delete(key);
  }

  subscribe(callback: Function) {
    const key = `${new Date().getTime()}_${Math.random()}`;
    this.map.set(key, callback);
    if (this.args.length && this.containHistory) {
      setTimeout(() => callback(...this.args[this.args.length - 1]));
    }
    return key;
  }

  next(...arg: any[]) {
    const args = arg || [];
    this.args.push(args);
    const values = this.map.values();
    for (const callback of values) {
      callback(...args);
    }
  }

  clear() {
    this.args = [];
    this.map = new Map();
  }
}
