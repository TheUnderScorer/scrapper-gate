export const castAsArray = <T>(item: T | T[]): T[] => {
  return Array.isArray(item) ? item : [item];
};

export const getLastIndex = (arr: ArrayLike<unknown>): number => arr.length - 1;

export const isLast = (index: number, arr: unknown[]) =>
  getLastIndex(arr) === index;

export const getById = <T extends { id: unknown }>(arr: T[], id: unknown) => {
  return arr.find((item) => item?.id === id);
};

export const mapToIds = <T extends { id: unknown }>(arr: T[]) =>
  arr.map((item) => item.id);

export const mapToArray = <T>(map: Map<unknown, T>) => {
  return Array.from(map.values());
};

export const removeAtIndex = <T>(array: T[], index: number, count = 1) => {
  const newValue = [...array];
  newValue.splice(index, count);

  return newValue;
};

export const isIndexValid = (index: number) => index > -1;
