import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import Joi, { AnySchema } from 'joi';
import { SchemaModifierParams } from '../types';
import { getFirstError } from '../utils/getFirstError';

export interface SupportsVariablesParams<T extends AnySchema>
  extends SchemaModifierParams<T> {
  // Returns schema that will be used if value contains variable key, ex. "Hello, {{World}}". This also indicates that value is a string.
  onIncludesVariableKey: (value: string) => Joi.Schema;
  // Returns schema that will be used if value doest not contain a variable key
  onNotIncludesVariableKey: (value: string) => Joi.Schema;
}

/**
 * Useful for fields that can, but may not contain a variable key.
 * */
export const supportsVariables = <T extends AnySchema>({
  onNotIncludesVariableKey,
  onIncludesVariableKey,
  schema,
}: SupportsVariablesParams<T>) =>
  schema.custom((value, helpers) => {
    const isVariable = containsVariableKey(value.toString());

    const schema = isVariable
      ? onIncludesVariableKey(value)
      : onNotIncludesVariableKey(value);

    const result = schema.validate(value);

    if (result.error) {
      return getFirstError(helpers, result);
    }

    return value;
  });
