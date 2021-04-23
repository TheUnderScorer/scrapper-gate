export const castAsArray = <T>(item: T | T[]): T[] => {
  return Array.isArray(item) ? item : [item];
};

export const getLastIndex = (arr: unknown[]): number => arr.length - 1;

export const isLast = (index: number, arr: unknown[]) =>
  getLastIndex(arr) === index;

export const getById = <T extends { id: unknown }>(arr: T[], id: unknown) => {
  return arr.find((item) => item?.id === id);
};

export const mapToArray = <T>(map: Map<unknown, T>) => {
  return Array.from(map.values());
};
