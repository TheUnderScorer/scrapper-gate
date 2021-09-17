import { OperationTimeoutError } from '@scrapper-gate/shared/errors';
import { MaybePromise } from './promise';
import { wait } from './timeout';

export const repeatUntil = async <T>(
  handler: (iteration: number) => MaybePromise<T>,
  conditionChecker?: (
    value: T,
    iteration: number
  ) => boolean | Promise<boolean>,
  timeout = 10000
): Promise<T> =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise<T>(async (resolve, reject) => {
    let lastResult = false;
    let lastError: Error;
    let value: T;
    let iteration = 0;

    const timeoutId = setTimeout(() => {
      reject(lastError ?? new OperationTimeoutError('repeat until'));
    }, timeout);

    do {
      if (conditionChecker) {
        value = await handler(iteration);

        lastResult = await conditionChecker(value, iteration);
      } else {
        try {
          value = await handler(iteration);

          lastResult = true;
        } catch (error) {
          lastError = error;
          lastResult = false;
        }
      }

      iteration++;

      /**
       * Without the "wait" here above "setTimeout" is never triggered!
       * */
      await wait(5);
    } while (!lastResult);

    clearTimeout(timeoutId);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolve(value!);
  });
