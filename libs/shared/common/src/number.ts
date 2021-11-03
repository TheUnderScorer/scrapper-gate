export const saveParseNumber =
  (parser: (value: string) => number) =>
  (value: string, defaultValue = 0) => {
    const result = parser(value);

    return Number.isNaN(result) ? defaultValue : result;
  };

export const saveParseFloat = saveParseNumber(parseFloat);

export const saveParseInt = saveParseNumber(parseInt);
