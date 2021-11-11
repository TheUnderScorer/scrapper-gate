import 'reflect-metadata';
import { Jsonable } from '@scrapper-gate/shared/data-structures';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const Setter =
  <Raw, Transformed>(transform: (value: Raw) => Transformed) =>
  (target: any, propertyKey: string) => {
    const internalKey = Symbol.for(propertyKey);

    Reflect.defineProperty(target, internalKey, {
      enumerable: true,
      writable: true,
    });

    Reflect.defineProperty(target, propertyKey, {
      set(this: any, v: any) {
        this[internalKey] = transform(v);
      },
      get(this: any): any {
        return this[internalKey];
      },
      enumerable: true,
    });

    const orgToJson = target.toJSON;

    Object.assign(target, {
      toJSON() {
        const orgJson = orgToJson ? orgToJson.call(this) : { ...this };

        orgJson[propertyKey] = (this as any)[internalKey];

        return orgJson;
      },
    } as Jsonable);
  };
