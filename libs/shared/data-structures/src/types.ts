export type Dictionary = Record<string, unknown>;

export type OmitFunctions<T> = Pick<
  T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { [K in keyof T]: T[K] extends () => any ? never : K }[keyof T]
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

export interface Comparable {
  equals: (other: this) => boolean;
}
