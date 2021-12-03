import { DateFormat } from '@scrapper-gate/shared/common';
import { parseVariableValue } from './parseVariableValue';
import { ResolvableVariable } from './types';

interface GetVariableValueParams {
  variable: ResolvableVariable;
  dateFormat?: string;
  raw?: boolean;
}

export const getVariableValue = ({
  variable,
  dateFormat = DateFormat.Date,
  raw = false,
}: GetVariableValueParams) => {
  const value = variable.value ?? variable.defaultValue;

  return raw ? value : parseVariableValue(value, variable.type, dateFormat);
};
