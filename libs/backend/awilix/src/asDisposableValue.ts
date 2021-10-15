import { asFunction, Disposer } from 'awilix';

export const asDisposableValue = <T>(value: T, disposer: Disposer<T>) => {
  return asFunction(() => value)
    .singleton()
    .disposer((value) => (value ? disposer(value) : undefined));
};
