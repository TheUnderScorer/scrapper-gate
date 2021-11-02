export type FindAndCountResult<T> = [T[], number];

export interface QueryResult<T> {
  total: number;
  items: T[];
}

export type Dictionary = Record<string, unknown>;

export type OmitFunctions<T> = Pick<
  T,
  { [K in keyof T]: T[K] extends (_: unknown) => unknown ? never : K }[keyof T]
>;

export interface Jsonable {
  toJSON(): Dictionary;
}

export interface Clonable {
  clone: () => this;
}

export interface WithValue<T> {
  valueOf: () => T;
}

export type Exists<T> = Exclude<T, null | undefined>;

export type ExistsInObject<T> = {
  [Key in keyof T]-?: Exists<T[Key]>;
};
