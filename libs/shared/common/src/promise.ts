export type UnpackPromise<T> = T extends Promise<infer S> ? S : T;
