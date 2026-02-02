import Queue from '../queue';

describe('Queue Class', () => {
  let testQueue: Queue<number, any>;

  beforeEach(() => {
    testQueue = new Queue({
      concurrency: 3,
      queue: [1, 2, 3, 4, 5, 6, 7, 8],
      retry: 5,
      retrydelay: 100,
    });
  });

  test('基本执行成功', async () => {
    const result = await testQueue.every((e) => {
      return Promise.resolve(e * 2);
    });
    for (const e of result) {
      console.log(`遍历结果`, e);
    }
    expect(result.values).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
    expect(result.errors.length).toBe(0);
    expect(result.result.every(r => r.done)).toBe(true);
  });

  test('失败重试机制', async () => {
    const fn = (e: number) => new Promise((resolve, reject) => {
      if (Math.random() < 0.1) {
        reject(new Error('Failed'));
      } else {
        resolve(e * 2);
      }
    });


    const result = await testQueue.every(fn);
    expect(result.values()).toEqual([2, 4, 6, 8, 10, 12, 14, 16]);
    expect(result.errors().length).toBe(0);
    expect(result.result.every(r => r.done)).toBe(true);
  });
});