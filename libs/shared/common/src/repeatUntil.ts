import { OperationTimeoutError } from '@scrapper-gate/shared/errors';

export const repeatUntil = async <T>(
  handler: (iteration: number) => Promise<T> | T,
  conditionChecker: (value: T, iteration: number) => boolean | Promise<boolean>,
  timeout = 10000
): Promise<T> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<T>(async (resolve, reject) => {
    let lastResult = false;
    let value: T;
    let iteration = 0;

    const timeoutId = setTimeout(() => {
      reject(new OperationTimeoutError('repeat until'));
    }, timeout);

    do {
      value = await handler(iteration);

      lastResult = await conditionChecker(value, iteration);

      iteration++;
    } while (!lastResult);

    clearTimeout(timeoutId);

    resolve(value);
  });
