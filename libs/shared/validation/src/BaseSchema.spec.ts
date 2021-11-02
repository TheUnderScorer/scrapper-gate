/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-non-null-assertion */
import * as jf from 'joiful';
import 'reflect-metadata';
import { BaseSchema } from './BaseSchema';
import { ValidationError } from './ValidationError';

class Nested extends BaseSchema<Nested> {
  @(jf.number().required())
  value: number;
}

class Obj extends BaseSchema<Obj> {
  @(jf.boolean().required())
  isNested: boolean;

  @(jf.object().custom(({ joi }) => {
    return joi.when('isNested', {
      is: true,
      then: Nested.toJoi(),
      otherwise: joi.any(),
    });
  }))
  nested?: Nested = new Nested();
}

describe('BaseSchema', () => {
  it('should validate nested objects conditionally', () => {
    const nestedObj = new Obj();

    nestedObj.isNested = true;
    // @ts-ignore
    nestedObj.nested.value = '';

    try {
      Obj.validate(nestedObj);
    } catch (e) {
      if (!ValidationError.isValidationError(e)) {
        throw e;
      }

      expect(e).toBeInstanceOf(ValidationError);
      expect(e.message).toEqual(
        '"nested" failed custom validation because "value" must be a number'
      );
      expect(e.details[0].type).toEqual('number.base');
      expect(e.details[0].path).toEqual(['nested', 'value']);

      return;
    }

    throw new Error("Validation didn't throw");
  });

  it('should validate nested objects conditionally - passed case', () => {
    const nestedObj = new Obj();

    nestedObj.isNested = true;
    nestedObj.nested!.value = 2;

    expect(() => Obj.validate(nestedObj)).not.toThrowError(ValidationError);
  });
});
