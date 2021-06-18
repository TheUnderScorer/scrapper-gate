import { serializeValue } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import { omit } from 'remeda';

export const extractVariableInput = (variable: Variable) => ({
  ...omit(variable, ['createdAt', 'updatedAt', 'isBuiltIn']),
  value: serializeValue(variable.value),
  defaultValue: serializeValue(variable.defaultValue),
});
