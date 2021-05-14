import { Constructor } from '@scrapper-gate/shared/constructor';
import * as joi from 'joi';
import * as jf from 'joiful';
import { ValidationOptions } from 'joiful/validation';
import { validate } from './validate';

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

  static toJoi() {
    return joi.object().custom((value, helpers) => {
      const result = jf.validateAsClass(value, this, {
        allowUnknown: helpers.prefs.allowUnknown,
        abortEarly: helpers.prefs.abortEarly,
      });

      // TODO Map paths to actual path using "state" ?
      if (result.error) {
        throw result.error;
      }

      return result.value;
    });
  }
}
