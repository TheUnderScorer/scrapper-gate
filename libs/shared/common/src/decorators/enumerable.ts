/* eslint-disable @typescript-eslint/no-explicit-any */

export const Enumerable =
  (enumerable: boolean) =>
  (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    descriptor.enumerable = enumerable;
  };
