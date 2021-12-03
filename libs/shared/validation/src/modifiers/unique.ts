import { AnySchema } from 'joi';
import { JoiMessages, SchemaModifierParams } from '../types';
import { getParent } from '../utils/getParent';

export interface UniqueParams<
  Context,
  ValueFromContext,
  Schema extends AnySchema = AnySchema
> extends SchemaModifierParams<Schema> {
  getValuesFromContext: (context: Context) => ValueFromContext[];
  getUniqueValue: (value: ValueFromContext) => unknown;
  isTargetValue: (parent: ValueFromContext, value: ValueFromContext) => boolean;
  // Provides additional array of keys, if current value will exist in this array, it will be considered as non-unique
  getAdditionalKeys?: (context: Context) => unknown[];
}

export const unique = <
  Context,
  ValueFromContext = unknown,
  Schema extends AnySchema = AnySchema
>({
  getUniqueValue,
  getValuesFromContext,
  isTargetValue,
  getAdditionalKeys,
  schema,
}: UniqueParams<Context, ValueFromContext, Schema>) =>
  schema.custom((value, helpers) => {
    if (!value) {
      return value;
    }

    const context = helpers.prefs.context as Context;
    const valueFromContext = getValuesFromContext(context);

    const additionalKeys = getAdditionalKeys?.(context) ?? [];

    const parent = getParent<ValueFromContext>(helpers);

    if (!Array.isArray(valueFromContext)) {
      throw new TypeError('Expected value from context to be an array.');
    }

    if (additionalKeys.includes(value)) {
      return helpers.error(JoiMessages.Unique);
    }

    for (const ctxValue of valueFromContext) {
      const existingValue = getUniqueValue(ctxValue);

      if (value === existingValue && !isTargetValue(parent, ctxValue)) {
        return helpers.error(JoiMessages.Unique);
      }
    }

    return value;
  }) as Schema;
