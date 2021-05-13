import { useCallback, useRef } from 'react';
import { ValidationErrors } from 'final-form';

interface DebouncedValidatorHookProps<Value> {
  validate: (value?: Value) => ValidationErrors | string;
  ms?: number;
}

export const useDebouncedValidator = <Value>({
  validate,
  ms = 1000,
}: DebouncedValidatorHookProps<Value>) => {
  const lastResultRef = useRef<unknown>();

  const timer = useRef<(() => unknown) | null>(null);

  return useCallback(
    (value?: Value) =>
      new Promise((resolve) => {
        if (timer.current) {
          timer.current();
          timer.current = null;
        }

        const timerId = setTimeout(async () => {
          const result = await validate(value);

          lastResultRef.current = result;

          resolve(result);
        }, ms);

        timer.current = () => {
          clearTimeout(timerId);
          resolve(lastResultRef.current);
        };
      }),
    [ms, validate]
  );
};
