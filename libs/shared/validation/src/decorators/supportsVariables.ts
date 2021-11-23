import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import Joi from 'joi';
import * as jf from 'joiful';
import { AnySchemaModifiers } from 'joiful/decorators/any';
import { PropertyDecorator } from 'joiful/decorators/common';

jf.string();

export interface SupportsVariablesParams<T extends AnySchemaModifiers> {
  // Returns schema that will be used if value contains variable key, ex. "Hello, {{World}}". This also indicates that value is a string.
  onIncludesVariableKey: (joi: Joi.Root, value: string) => Joi.Schema;
  // Returns schema that will be used if value doest not contain a variable key
  onNotIncludesVariableKey: (joi: Joi.Root, value: unknown) => Joi.Schema;
  // Base type that .custom() will be called on
  baseSchema: T;
}

/**
 * Useful for fields that can, but may not contain a variable key.
 * */
export const supportsVariables = <T extends AnySchemaModifiers>({
  onNotIncludesVariableKey,
  onIncludesVariableKey,
  baseSchema,
}: SupportsVariablesParams<T>) =>
  // Seems like "custom" is not triggered if key does not exist
  baseSchema.custom(({ joi }) => {
    return joi.custom((value) => {
      const isVariable = containsVariableKey(value);

      const schema = isVariable
        ? onIncludesVariableKey(joi, value)
        : onNotIncludesVariableKey(joi, value);

      const result = schema.validate(value);

      if (result.error) {
        throw result.error;
      }

      return value;
    });
  }) as PropertyDecorator<string, T>;
