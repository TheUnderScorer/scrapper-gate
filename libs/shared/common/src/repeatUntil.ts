import { OperationTimeoutError } from '@scrapper-gate/shared/errors';
import { MaybePromise, UnpackPromise } from './promise';
import { wait } from './timeout';

export interface RepeatUntilOptions<T> {
  conditionChecker?: (
    value: UnpackPromise<T>,
    iteration: number
  ) => MaybePromise<boolean>;
  timeout?: number;
  waitAfterIteration?: number;
}

type RepeatUntilHandler<T> = (iteration: number) => MaybePromise<T>;

export const repeatUntil = async <T>(
  handler: RepeatUntilHandler<T>,
  {
    conditionChecker,
    timeout = 10000,
    waitAfterIteration = 5,
  }: RepeatUntilOptions<T> = {}
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

        lastResult = await conditionChecker(
          value as UnpackPromise<T>,
          iteration
        );
      } else {
        try {
          value = await handler(iteration);

          lastResult = true;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          lastError = error;
          lastResult = false;
        }
      }

      iteration++;

      /**
       * Without the "wait" here above "setTimeout" is never triggered!
       * */
      await wait(waitAfterIteration);
    } while (!lastResult);

    clearTimeout(timeoutId);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    resolve(value!);
  });

repeatUntil.make =
  (options: RepeatUntilOptions<unknown>) =>
  <T>(handler: RepeatUntilHandler<T>, partialOptions?: RepeatUntilOptions<T>) =>
    repeatUntil(handler, {
      ...options,
      ...partialOptions,
    });
