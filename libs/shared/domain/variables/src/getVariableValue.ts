import { DateFormat, tryDateCast } from '@scrapper-gate/shared/common';
import { VariableType } from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import { ResolvableVariable } from './types';

export const getVariableValue = (
  variable: ResolvableVariable,
  dateFormat: string = DateFormat.Date
) => {
  const value = variable.value ?? variable.defaultValue;

  switch (variable.type) {
    case VariableType.Number:
      return parseFloat(value);

    case VariableType.Date: {
      const castedDate = tryDateCast(value);

      return castedDate instanceof Date
        ? format(castedDate, dateFormat)
        : value;
    }

    default:
      return value;
  }
};
