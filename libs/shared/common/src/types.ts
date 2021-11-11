export type FindAndCountResult<T> = [T[], number];

export interface QueryResult<T> {
  total: number;
  items: T[];
}

export type Exists<T> = Exclude<T, null | undefined>;

export type ExistsInObject<T> = {
  [Key in keyof T]-?: Exists<T[Key]>;
};
