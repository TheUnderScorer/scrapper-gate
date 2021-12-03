export const safeParseNumber =
  (parser: (value: string) => number) =>
  (value: string, defaultValue = 0) => {
    const result = parser(value);

    return Number.isNaN(result) ? defaultValue : result;
  };

export const safeParseFloat = safeParseNumber(parseFloat);

export const safeParseInt = safeParseNumber(parseInt);
