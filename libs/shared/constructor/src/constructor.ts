export interface Constructor<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...args: any[]): T;
}

export type ResolvedConstructor<T> = T extends Constructor<infer S> ? S : never;
