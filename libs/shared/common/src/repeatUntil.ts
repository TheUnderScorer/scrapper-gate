export const repeatUntil = async <T>(
  handler: (iteration: number) => Promise<T> | T,
  conditionChecker: (value: T, iteration: number) => boolean | Promise<boolean>
): Promise<T> => {
  let lastResult = false;
  let value: T;
  let iteration = 0;

  do {
    value = await handler(iteration);

    lastResult = await conditionChecker(value, iteration);

    iteration++;
  } while (!lastResult);

  return value;
};
