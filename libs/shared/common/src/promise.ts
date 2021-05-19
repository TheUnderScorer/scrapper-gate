export type UnpackPromise<T> = T extends Promise<infer S> ? S : T;

export type MaybePromise<T> = T | Promise<T>;
