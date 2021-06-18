type FirstLast = <T extends unknown[] | string>(item: T) => T[0];

export const first: FirstLast = <T extends string | unknown[]>(item: T) => {
  return item[0];
};

export const last: FirstLast = <T extends string | unknown[]>(item: T) => {
  return item[item.length - 1];
};
