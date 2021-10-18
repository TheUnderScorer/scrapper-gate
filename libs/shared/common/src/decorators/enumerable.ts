/* eslint-disable @typescript-eslint/no-explicit-any */

export const Enumerable = (
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) => {
  descriptor.enumerable = true;
};
