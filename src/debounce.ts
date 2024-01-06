
export function debounce<Args extends any[]>(fn: (...s: Args) => any, ms: number = 500) {
  let timer: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
      timer && clearTimeout(timer);
      timer = null;
    }, ms);
  }
}

export function throttle<Args extends any[]>(fn: (...s: Args) => any, ms: number = 500) {
  let timer: NodeJS.Timeout | null;
  return function (...args: Args) {
    if (!timer) {
      timer = setTimeout(() => {
        // @ts-ignore
        fn.apply(this, args);
        timer && clearTimeout(timer);
        timer = null;
      }, ms);
    }
  }
}
