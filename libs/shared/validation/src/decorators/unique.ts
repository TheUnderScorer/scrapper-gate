import { first } from '@scrapper-gate/shared/common';
import { JoiMessages } from '../types';
import { CustomCallback } from './decorators.types';

export interface UniqueParams<Context, ValueFromContext> {
  getValueFromContext: (context: Context) => ValueFromContext[];
  getValue: (value: ValueFromContext) => unknown;
  isTarget: (parent: ValueFromContext, value: ValueFromContext) => boolean;
}

// TODO Add option to pass additional keys
export const unique =
  <Context, ValueFromContext = unknown>({
    getValue,
    getValueFromContext,
    isTarget,
  }: UniqueParams<Context, ValueFromContext>): CustomCallback =>
  ({ joi }) =>
    joi.custom((value, helpers) => {
      if (!value) {
        return value;
      }

      const valueFromContext = getValueFromContext(
        helpers.prefs.context as Context
      );

      const parent = first(helpers.state.ancestors);

      if (!Array.isArray(valueFromContext)) {
        throw new TypeError('Expected value from context to be an array.');
      }

      for (const ctxValue of valueFromContext) {
        const existingValue = getValue(ctxValue);

        if (value === existingValue && !isTarget(parent, ctxValue)) {
          return helpers.error(JoiMessages.Unique);
        }
      }

      return value;
    });
