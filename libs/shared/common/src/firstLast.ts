interface FirstLast {
  <T extends unknown[]>(item: T): T[number];
  <T extends string>(item: T): T[number];
}

export const first: FirstLast = <T>(item: T) => {
  return item[0];
};

export const last: FirstLast = <T extends string | unknown[]>(item: T) => {
  return item[item.length - 1];
};
