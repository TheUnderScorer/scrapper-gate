import { Maybe } from '@scrapper-gate/shared/schema';
import { isDate } from 'date-fns';

export const castAsDate = (value?: Maybe<string | number | Date>) => {
  if ([null, undefined].includes(value as undefined | null)) {
    throw new TypeError('Unable to cast null or undefined to date');
  }

  const result = isDate(value)
    ? value
    : new Date((value as number | string).toString());

  return result as Date;
};
