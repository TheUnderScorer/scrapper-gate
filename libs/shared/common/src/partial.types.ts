import { Maybe } from '@scrapper-gate/shared/schema';

export type Perhaps<T> = T | null | undefined;

export type PartialMaybe<T> = {
  [Key in keyof T]?: Maybe<T[Key]>;
};
