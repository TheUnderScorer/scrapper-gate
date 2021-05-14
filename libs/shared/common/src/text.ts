export const trimEndChar = (value: string, char: string) => {
  if (!value?.endsWith(char)) {
    return value ?? '';
  }

  return value?.slice(0, value.length - 1) ?? '';
};

export const withPrefix = (message: string, prefix: string) =>
  `[${prefix}] - ${message}`;
