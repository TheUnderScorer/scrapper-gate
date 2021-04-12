import { BuildResolver, DisposableResolver } from 'awilix';
import { Disposable } from '@scrapper-gate/shared/common';

export const asDisposable = <T extends Disposable>(
  baseResolver: BuildResolver<T> & DisposableResolver<T>
) => {
  return baseResolver.disposer((val) => val.dispose());
};
