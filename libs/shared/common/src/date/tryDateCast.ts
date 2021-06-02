import { isValid } from 'date-fns';

export const tryDateCast = (value: string) => {
  if (!value) {
    return value;
  }

  const trim = String(value).trim();

  try {
    const date = new Date(trim);

    return isValid(date) ? date : value;
  } catch {
    return value;
  }
};
