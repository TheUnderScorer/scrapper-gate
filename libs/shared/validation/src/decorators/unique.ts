import { first } from '@scrapper-gate/shared/common';
import { JoiMessages } from '../types';
import { CustomCallback } from './decorators.types';

export interface UniqueParams<Context, ValueFromContext> {
  getValueFromContext: (context: Context) => ValueFromContext[];
  getValue: (value: ValueFromContext) => unknown;
  isTarget: (parent: ValueFromContext, value: ValueFromContext) => boolean;
  // Provides additional array of keys, if current value will exist in this array, it will be considered as non-unique
  getAdditionalKeys?: (context: Context) => unknown[];
}

// TODO Add option to pass additional keys
export const unique =
  <Context, ValueFromContext = unknown>({
    getValue,
    getValueFromContext,
    isTarget,
    getAdditionalKeys,
  }: UniqueParams<Context, ValueFromContext>): CustomCallback =>
  ({ joi }) =>
    joi.custom((value, helpers) => {
      if (!value) {
        return value;
      }

      const context = helpers.prefs.context as Context;
      const valueFromContext = getValueFromContext(context);

      const additionalKeys = getAdditionalKeys?.(context) ?? [];

      const parent = first(helpers.state.ancestors);

      if (!Array.isArray(valueFromContext)) {
        throw new TypeError('Expected value from context to be an array.');
      }

      if (additionalKeys.includes(value)) {
        return helpers.error(JoiMessages.Unique);
      }

      for (const ctxValue of valueFromContext) {
        const existingValue = getValue(ctxValue);

        if (value === existingValue && !isTarget(parent, ctxValue)) {
          return helpers.error(JoiMessages.Unique);
        }
      }

      return value;
    });
