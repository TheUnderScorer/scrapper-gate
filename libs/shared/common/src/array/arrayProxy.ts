/* eslint-disable @typescript-eslint/ban-types */

import { castAsArray } from './array';

type ArrayProxy<T> = {
  [Key in keyof T]: ArrayProxyItem<T[Key]>;
};

export type ArrayProxyItem<T> = T extends Array<unknown>
  ? T
  : T extends object
  ? ArrayProxy<T>[]
  : T[];

/**
 * Returns a proxy that makes every property inside an object as an array.
 * */
export const makeArrayProxy = <T extends object>(item: T): ArrayProxy<T> => {
  const parsedItem = Object.entries(item).map(([key, value]) => {
    if (typeof value === 'object' && !Array.isArray(value)) {
      return [key, [makeArrayProxy(value)]];
    }

    return [key, castAsArray(value)];
  });

  return new Proxy(Object.fromEntries(parsedItem), {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(target: T, p: string | symbol, value: any) {
      const targetPropertyValue = castAsArray(target[p as keyof T]);

      targetPropertyValue.push(value);

      return true;
    },
    get(target: T, p: string | symbol) {
      const targetPropertyValue = target[p as keyof T];

      return castAsArray(targetPropertyValue);
    },
  }) as ArrayProxy<T>;
};
