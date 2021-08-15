import { format } from 'date-fns';
import { DateFormat } from './date/DateFormat';

export interface GetValueParams {
  value: unknown;
  dateFormat?: string;
}

export const getDisplayValue = ({
  value,
  dateFormat = DateFormat.Date,
}: GetValueParams): string | number | null | undefined => {
  if (!value) {
    return null;
  }

  switch (typeof value) {
    case 'boolean':
      return value ? 'Yes' : 'No';

    case 'object':
      if (value instanceof Date) {
        return format(value, dateFormat);
      }

      return value?.valueOf()?.toString();

    case 'function':
      throw new TypeError('Cannot render function as value.');

    case 'string':
      // TODO Keep an eye on this, because sometimes we get date in places we should not have
      if (!Number.isNaN(Number(value) || value.startsWith('http'))) {
        return value;
      }

      try {
        const date = new Date(value);

        return format(date, dateFormat);
      } catch {
        return value;
      }

    case 'number':
      return value;

    default:
      return null;
  }
};
