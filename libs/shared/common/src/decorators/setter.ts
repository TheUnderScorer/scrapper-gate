import 'reflect-metadata';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const Setter =
  <Raw, Transformed>(transform: (value: Raw) => Transformed) =>
  (target: any, propertyKey: string) => {
    const internalKey = Symbol(propertyKey);

    Reflect.defineProperty(target, propertyKey, {
      set(this: any, v: any) {
        this[internalKey] = transform(v);
      },
      get(this: any): any {
        return this[internalKey];
      },
    });
  };
