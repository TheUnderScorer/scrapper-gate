import { DateFormat } from '@scrapper-gate/shared/common';
import { parseVariableValue } from './parseVariableValue';
import { ResolvableVariable } from './types';

export const getVariableValue = (
  variable: ResolvableVariable,
  dateFormat: string = DateFormat.Date
) => {
  const value = variable.value ?? variable.defaultValue;

  return parseVariableValue(value, variable.type, dateFormat);
};
