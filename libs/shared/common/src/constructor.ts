export interface Constructor<T> {
  new (...args: unknown[]): T;
}
