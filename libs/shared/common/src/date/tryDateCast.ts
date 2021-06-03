import { isValid } from 'date-fns';

const returnDateResult = <T>(date: Date, value: T) =>
  isValid(date) ? date : value;

export const tryDateCast = <T>(value: T): T | Date | string => {
  if (value instanceof Date) {
    return returnDateResult(value, '');
  }

  if (!value) {
    return value;
  }

  const trim = String(value).trim();

  try {
    const date = new Date(trim);

    return returnDateResult(date, value);
  } catch {
    return value;
  }
};
