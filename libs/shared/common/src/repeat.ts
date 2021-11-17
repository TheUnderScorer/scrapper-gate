import { MaybePromise } from './promise';

export const repeat = async <T>(
  times: number,
  callback: (iteration: number) => MaybePromise<T>
) => {
  let iter = 0;

  const values: T[] = [];

  while (times > iter) {
    values.push(await callback(iter));

    iter++;
  }

  return values;
};
