export const serializeValue = (value: unknown) => {
  switch (typeof value) {
    case 'function':
      return value.toString();

    case 'object':
      if (value instanceof Date) {
        return value.toISOString();
      }

      return JSON.stringify(value);

    default:
      return value;
  }
};
