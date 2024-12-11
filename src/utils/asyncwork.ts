/**
 * 包装方法: 自动重试的异步方法，重试完成或者Promise状态为resolve时返回结果，否则持续重试且状态为pending
 * @param fn 异步方法
 * @param retryTimes 重试次数
 * @param interval 重试间隔
 * @returns Promise 包装过的异步方法
 * 使用例子：
 * const realWork = fetch('https://api.github.com');
 * const workWrapper = autoRetry(realWork, 3, 1000);
 * workWrapper.then(res => console.log(res)).catch(e => console.error(e));
 */
export const autoRetryWrapper = async (
  fn: Promise<any>,
  retryTimes?: number,
  interval?: number
) => {
  let retry = 0;
  let result: any;
  const innerRetryTimes = retryTimes || 3;
  const innerInterval = interval || 1000;
  return new Promise((resolve, reject) => {
    const tryFn = async () => {
      try {
        result = await fn;
        resolve(result);
      } catch (e) {
        if (retry < innerRetryTimes) {
          retry++;
          setTimeout(tryFn, innerInterval);
        } else {
          reject(e);
        }
      }
    };
    tryFn();
  });
};
