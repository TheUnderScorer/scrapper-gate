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
