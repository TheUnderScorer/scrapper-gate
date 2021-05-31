import { format } from 'date-fns';
import { DateFormat } from './date/DateFormat';

export interface GetValueParams {
  value: unknown;
  dateFormat?: string;
}

export const getValue = ({
  value,
  dateFormat = DateFormat.Date,
}: GetValueParams) => {
  if (!value) {
    return value;
  }

  switch (typeof value) {
    case 'boolean':
      return value ? 'Yes' : 'No';

    case 'object':
      if (value instanceof Date) {
        return format(value, dateFormat);
      }

      return value.valueOf().toString();

    case 'function':
      throw new TypeError('Cannot render function as value.');

    case 'string':
      try {
        const date = new Date(value);

        return format(date, dateFormat);
      } catch {
        return value;
      }

    default:
      return value;
  }
};
