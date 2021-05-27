export const prefix = <Value extends string>(value: Value, separator = '-') => {
  return `scrapper${separator}gate${separator}${value}`;
};
