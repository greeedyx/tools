
export function sleep(ms: number): Promise<null> {
  return new Promise((resolve) => {
    if (ms)
      setTimeout(() => {
        resolve(null);
      }, ms);
  })
}

export function sequenceExec<T extends Promise<any>>(ps: ((...args: any[]) => T)[]) {
  const result: any[] = [];
  let pro = Promise.resolve(result);
  for (const p of ps) {
    pro = pro.then(() => p()).then((r) => {
      result.push(r);
      return result;
    });
  }
  return pro;
}

export function waitUntil<T>(func: Function, options: {
  interval?: number;
  maxWait?: number;
  data?: T;
} = {}): Promise<T | undefined> {
  return new Promise((resolve) => {
    const { interval = 100, maxWait = -1, data } = options;
    const condition = (() => maxWait > 0 ? () => times <= 0 : () => false)();
    let times = Math.ceil(maxWait / interval);
    const timer = setInterval(() => {
      if (func() || condition()) {
        clearInterval(timer);
        resolve(data);
      }
      times--;
    }, interval);
  });
}


export type SettleSuccess = { status: 'fulfilled', value: any };
export type SettleFailed = { status: 'rejected', reason: any };
export type SettleResult = SettleSuccess | SettleFailed;

export function allSettled(ps: Promise<any>[]): Promise<SettleResult[]> {
  const results: SettleResult[] = [];
  const counter = new Map<number, number>();
  const size = ps.length;
  return new Promise((resolve) => {
    for (let index = 0; index < size; index++) {
      const it = ps[index];
      it.then((result) => {
        results[index] = { status: 'fulfilled', value: result };
      }).catch((e) => {
        results[index] = { status: 'rejected', reason: e };
      }).finally(() => {
        counter.set(index, 1);
        if (counter.size === ps.length) {
          resolve(results)
        }
      })
    }
  })

}
