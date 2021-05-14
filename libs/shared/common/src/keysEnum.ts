export type KeysEnum<T> = { [key in keyof Required<T>]: true };

export const getAllObjectKeys = <T>(obj: KeysEnum<T>) => {
  return Object.keys(obj) as Array<keyof T>;
};
