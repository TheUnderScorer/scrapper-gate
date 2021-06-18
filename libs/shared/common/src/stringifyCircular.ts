const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: unknown, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const stringifyCircular = (
  value: Record<string, unknown> | unknown[]
) => {
  return JSON.stringify(value, getCircularReplacer());
};
