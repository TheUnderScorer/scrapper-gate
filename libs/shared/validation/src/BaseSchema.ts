import { validate } from './validate';
import { Constructor } from '@scrapper-gate/shared/constructor';
import { ValidationOptions } from 'joiful/validation';

export interface BaseSchemaConstructor<T extends BaseSchema<unknown>>
  extends Constructor<T> {
  validate: (payload: unknown, joiOptions?: ValidationOptions) => T;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseSchema<T> {
  static validate<T extends BaseSchema<unknown>>(
    this: { new (): T },
    payload: unknown,
    joiOptions?: ValidationOptions
  ) {
    return validate(payload, this, joiOptions);
  }
}
