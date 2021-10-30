import { DateFormat, tryDateCast } from '@scrapper-gate/shared/common';
import { VariableType } from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';

export const parseVariableValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  variableType?: VariableType,
  dateFormat: string = DateFormat.Date
) => {
  switch (variableType) {
    case VariableType.Number:
      return parseFloat(value as string);

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
