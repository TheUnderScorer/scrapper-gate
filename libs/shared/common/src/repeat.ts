import { MaybePromise } from './promise';

export const repeat = async (
  times: number,
  callback: (iteration: number) => MaybePromise<void>
) => {
  let iter = 0;

  while (times > iter) {
    await callback(iter);

    iter++;
  }
};
